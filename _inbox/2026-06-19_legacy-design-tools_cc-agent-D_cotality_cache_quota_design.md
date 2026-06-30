---
date: 2026-06-19
agent: cc-agent-D (data-layers)
repo: legacy-design-tools
dispatch: caching / quota efficiency for the Cotality map mesh (highest-leverage priority)
status: design complete, build-ready — NOT YET BUILT (lane sign-off with cc-agent-C needed for the call-site wiring)
related:
  - _inbox/2026-06-19_legacy-design-tools_cc-agent-D_map_brief_data_layer_audit.md
---

# Cotality cache + quota efficiency design

The single highest-leverage data-layer task. A persistent cache for the cortex-api `/gis-layer` map mesh so the same parcels and viewports are not re-fetched from Cotality. Serve from cache, hit Cotality only on a miss. This extends the demo quota for development and controls production COGS, and it is the precondition that makes the pending reasoning layers (rent heat, likely-to-sell, no-HOA) affordable at viewport scale.

## What is already cached, and what is not

The brief path is cached. `brokerageSiteContext.ts` line 401 wires `createAdapterResponseCache()` into `runAdapters`, so every Cotality underwriting adapter (rent AVM, permits, liens, mortgage, tax, owner-occupancy, propensity, property detail, sinkhole) is cached in the Postgres `adapter_response_cache` table keyed by `(adapterKey, latRounded5, lngRounded5)` at a 24h default TTL. The engine assemble pin path is cached the same way.

The map mesh path is not cached. `brokerageGisLayers.ts` imports nothing from the cache layer (verified: zero `cache` references in the file). Path B calls Cotality Spatial Tile directly for the bbox mesh and then geocodes plus fetches site-location per parcel for zoning color, with no persistence. Every pan and zoom re-fetches. At the documented caps that is up to 4 Spatial Tile calls plus up to 25 geocode plus up to 25 site-location Property calls per bbox, every time, even for a viewport a different user looked at a minute ago.

The existing `adapter_response_cache` does not fit the map mesh, because its key is `(adapterKey, lat, lng)` for a single point. The mesh is keyed by a viewport (a bbox), and the zoning enrich is keyed by CLIP. So the map proxy needs its own purpose-built cache, not a reuse of the point cache.

## The design: three caches, one new module, one migration

### Migration 0043 (head is currently 0042; verify before authoring)

Three tables, each mirroring the proven shape of `adapter_response_cache` (jsonb payload, `expires_at`, `created_at` bumped on upsert, a unique index for exact-match lookup, an `expires_at` index for the sweep).

`cotality_spatial_tile_cache` keyed by `tile_key` (text). One row per snapped grid tile holds the Spatial Tile parcel rows that fall in that tile. Parcel geometry is near-static, so TTL defaults long (30 days). This is the mesh cache.

`cotality_property_attr_cache` keyed by `(clip, product)` where product is `site-location`, `rent-avm`, `propensity`, `hoa`, `ownership`, and so on. One row per CLIP per attribute family holds the Property response. TTL defaults 14 to 30 days. This is the parcel-attribute cache, and it is the one shared with the brief (see cross-path win below).

`cotality_geocode_cache` keyed by `addr_norm` (normalized `street|city|state`). One row per address holds the resolved CLIP. Address to CLIP is effectively permanent, so TTL defaults 90 days. This kills the geocode half of the zoning-enrich cost on any repeat parcel.

### New module `brokerageGisCache.ts` (mine, no collision)

A small module exposing typed get/put for each of the three caches, copying the failure-isolation contract from `adapterCache.ts` verbatim: lookups and writes never throw, a DB error logs and degrades to a live fetch, TTL is env-overridable (`COTALITY_TILE_CACHE_TTL_MS`, `COTALITY_PROPERTY_ATTR_CACHE_TTL_MS`, `COTALITY_GEOCODE_CACHE_TTL_MS`), and `0` disables a given cache. It reuses the same sweep-worker pattern (or folds into the existing `adapter_cache_sweep` advisory-lock worker so we do not run two sweepers).

### Tiling strategy

Target design: decompose any request bbox into a set of fixed grid tiles (default 0.02 degrees, about 2.2km, env-tunable). For each tile, serve from `cotality_spatial_tile_cache` on a hit; collect the misses; issue Spatial Tile fetches only for the missing tiles; write each fetched tile back; union the tiles and clip to the requested bbox. This is what makes overlapping pans share data, which is the whole point: a user nudging the map 200m reuses every tile but the new edge.

MVP first cut, if the tiling is too much for a first pass: snap the request bbox to the grid and key the cache on the snapped bbox hash. Simpler, still removes the dominant duplicate-viewport cost, and upgrades to true tiling later without a schema change (the `tile_key` column holds either form).

For the zoning enrich, wrap `resolveClipForSpatialRow` with `cotality_geocode_cache` and `fetchSiteLocationZoning` with `cotality_property_attr_cache (clip, 'site-location')`. After the first warm pass over a market, the enrich cost on that market drops toward zero.

## The cross-path win (architecture argument, worth surfacing to the operator)

If the property-attribute cache is keyed by CLIP rather than by lat/lng, the brief and the map share it. A parcel underwritten in a Pro brief yesterday seeds the map's zoning, rent, and propensity coloring for free today, and a parcel the map colored seeds the next brief on it. Right now the brief uses a lat/lng-keyed point cache and the map uses nothing, so the two paths never share a single Cotality response even when they hit the identical parcel. Moving Property attributes to a CLIP-keyed shared cache is the structural fix. It is a larger change (it touches the brief adapters' cache key), so I propose it as a phase 2 after the map-only cache lands and proves out, not as a prerequisite.

## Quota and COGS impact

cc-agent-C's production-quota scope estimates roughly 2,000 Spatial Tile calls per day at 50 Max users panning 5 viewports across 2 sessions, plus 100 to 2,600 Property calls per day once the enrich is on. Those figures assume zero cache. With the tile cache, Spatial Tile calls collapse to roughly the count of distinct tiles ever viewed (bounded by geography, not by user-sessions), so a cohort repeatedly working the same metros pays once per tile per TTL window rather than once per pan. With the geocode and attribute caches, the Property enrich collapses to once per parcel per TTL window. The order-of-magnitude effect is that sustained quota stops scaling with user activity and starts scaling with unique geography covered, which is exactly the cost curve a national radar needs and the only way the demo quota survives development at all.

Independently of production keys, the cache also salvages development: a single allowed daily capture (one tile fetch) populates the cache and then every subsequent pan over that tile serves locally, so a developer is not gated to one viewport per day.

## Lane coordination with cc-agent-C

cc-agent-C owns `brokerageGisLayers.ts`, the `brokerageMapData.ts` route, the Cotality adapters, and the fixture plumbing. The new cache module and the migration are clean, non-colliding new files I own. The collision point is the three call-site insertions inside `brokerageGisLayers.ts` (the bbox mesh fetch, `resolveClipForSpatialRow`, and `fetchSiteLocationZoning`). Two clean options, operator picks:

Option 1: I build the module plus migration plus tests and hand cc-agent-C a small, reviewed diff for the three call sites, which cc-agent-C lands on its next map-proxy commit so we never have two agents writing the same file.

Option 2: I build and wire the whole thing on a dedicated branch (`data/cotality-map-cache`), cc-agent-C pauses map-proxy edits during that window, and we rebase. Cleaner authorship, needs a short exclusive window on that file.

I recommend Option 1. The cache is additive and the diff is small, so handing cc-agent-C the wiring avoids any exclusive-window coordination and keeps single-owner-per-file intact.

## Build sequence (on greenlight)

Author migration 0043 with the three tables and indexes. Build `brokerageGisCache.ts` with the get/put/sweep helpers and env-gated TTLs. Add the tile-decompose-and-coalesce helper (target design) or the snapped-bbox-key helper (MVP). Wire the three call sites in `brokerageGisLayers.ts` (Option 1 hand-off or Option 2 branch). Unit tests for tile snapping, cache hit/miss, and failure isolation, matching the existing `adapterCache` test discipline. Verify with the one allowed daily Cotality capture: first request is a miss and hits Cotality, second identical request is a hit and makes zero Cotality calls (assert on the upstream call count, not just the response).
