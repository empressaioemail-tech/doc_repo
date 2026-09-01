---
id: 2026-08-08_STATEWIDE_layer_inventory
title: Statewide-Uniform Layer Inventory — Code vs Data vs Served (read-only audit)
date: 2026-08-08
status: audit (read-only; inventory only, no writes made)
owner: nick
related: [90_operations/OPS-1_texas_source_registry, _land_records/source_rail_registry, _catalog/texas_roster_v1.json, 80_adrs/adr_029_building_footprint_and_utility_easement_rails, 90_runbooks/factory_onboarding_runbook]
---

# Statewide Layer Inventory — the layer-first pivot audit

> **CORRECTION 2026-08-30 (CTX collect review, A12).** The city-boundary and
> county-boundary rows below are **superseded**. Both tables are **loaded and
> indexed** on cortex `neondb`: `tx_city_boundary` (1,222 polygons, 26 MB) and
> `tx_county_boundary` (254, 25 MB), btree bbox indexes, PostGIS 3.5.0. The
> city-to-county spatial join landed 2026-08-11T19:44Z and re-derives in 1.3 s;
> `_catalog/texas_roster_v1.json` links 1,214 of 1,223 places. This audit's
> 2026-08-08 "No adapter found / zero rows" verdict for those two rows was true
> on its date and is false now. **Do not cite rows 29-30 or the code-comment
> evidence in section "Explicit code evidence of absence" as current.** They told
> agents this work was impossible. Source:
> `_inbox/2026-08-30_ctx_w3_collect_amendments.md`. The roads and NLCD rows are
> NOT corrected here — they were not re-measured.

Operator framing (2026-08-08): pivot from county-by-county onboarding to layer-first — lay statewide-uniform layers across all of Texas first, then backfill jurisdiction-specific rails. This audit answers, per candidate layer: do we HOLD it statewide, partially, or not at all, and in what store, at what coverage, from what source, at what vintage.

**Method:** live SQL against the two production Neon stores (atoms/`hauska_mcp` on `hauska-prod-497015`, txgio/`neondb` on `legacy-design-tools-prod`, both read via `DATABASE_URL`/`DEPLOYMENT_DATABASE_URL` secrets per `90_runbooks/factory_onboarding_runbook.md` section 0.5), plus `grep`/`Read` against `P:\hauska-engine` source, plus the canonical docs named in `related` above. Every row below is either a SQL result (query shown), a file:line citation, or explicitly marked unverified.

## Summary table — code / data / served

| Layer | Statewide-uniform? | Code exists | Data loaded | Served to product | Coverage today |
|---|---|---|---|---|---|
| Parcel geometry (TxGIO StratMap) | Yes | Yes | **Partial — 19/254 counties** | Yes (warm path) | 19 counties in `txgio_parcel`; 253/254 source-availability probed (not loaded) |
| Address points (TxGIO) | Yes | Yes | **Partial — 6/254 counties** | Partial | 6 counties in `txgio_address` |
| CAD attributes (Rail B) | Per-jurisdiction (253 separate CADs) | Yes | Minimal — 15 rows total | No | Effectively none loaded; per-county probe registry exists (`_inbox/t6_cad_probe_*.json`), not bulk data |
| Roads (OSM Overpass) | Statewide source, per-jurisdiction ingest | Yes | **2 counties** (Bastrop, Caldwell partial via city scripts; Elgin city-scoped) | Yes, where ingested | 25,078 road-node atoms, Bastrop (48021) + Caldwell (48055) only |
| Roads (TxDOT) | Yes (uniform) | **No adapter found** | No | No | Not built |
| Topography / elevation (USGS 3DEP) | Yes (federal, uniform) | Yes | **On-demand per-parcel only, not bulk/statewide** | Yes, per-engagement | 60 `parcel-terrain-model` atoms total, single-parcel DEM crops, not a statewide raster/DTM store |
| FEMA flood (NFHL) | Yes (federal, uniform) | Yes (`fema-nfhl.ts`) | **Zero cached** | Live point-query only, no persistence found | 0 rows in `adapter_response_cache` |
| Soils (USDA SSURGO) | Yes (federal, uniform) | Yes (`usda-ssurgo.ts`) | **Zero cached** | Live point-query only | 0 rows in `adapter_response_cache` |
| Hydrology / NHD / watershed | Yes (federal, uniform) | Yes (`hydrography/`, `hydrology/` packages) | Not verified as bulk-loaded; likely same live-query pattern as FEMA/SSURGO | Live point/bbox-query, per site-plan flood-drainage study | Not statewide-loaded; see WHAT I COULD NOT DETERMINE |
| City / jurisdiction boundaries (TxGIO City_Boundaries) | Yes | **SUPERSEDED 2026-08-30 — LOADED** | Yes | Yes | `tx_city_boundary`, 1,222 polygons, 26 MB, btree bbox index, cortex `neondb`. The 2026-08-08 "absent" verdict is false as of 2026-08-30 |
| County boundaries | Yes (Census TIGER candidate) | **SUPERSEDED 2026-08-30 — LOADED** | Yes | Yes | `tx_county_boundary`, 254 polygons, 25 MB, cortex `neondb`. The cited code comment describes 2026-08-08, not today |
| School / special districts | Yes | Not found | No | No | Not found in code or docs |
| Land use / land cover (NLCD) | Yes | **No adapter found** | No | No | Zero grep hits |
| Railroads, pipelines (RRC), utility infra | Statewide (RRC open data) | Partial — RRC PDQ adapter exists (`og-sources/src/adapters/rrc-pdq/`) for oil/gas, not utility/pipeline geometry | Fixture-only sample seen; not confirmed as loaded data | Not confirmed | RRC oil/gas adapter exists per prior Reeves/Permian work; pipeline/utility-corridor layer not found |
| Building footprints | Statewide candidate (ML-derived, e.g. Microsoft Global ML) | **No adapter code found in hauska-engine** | No | No | ADR-029 defines the atom contract shape (`building-footprint`) and names `ml-global-building-footprints` as the default adapter kind, but zero atoms of this entity_type exist live (absent from the 11-type atom breakdown) |
| Utility easements | Per-jurisdiction (not statewide-uniform by nature) | Not found in code search | No | No | ADR-029 contract shape defined; zero atoms of this entity_type exist live |
| Aerial/satellite imagery basemap | Yes (TxGIO ortho + LiDAR/DTM statewide raster exists per OPS-1) | Not verified as ingested | No | Not confirmed | OPS-1 names it as a DataHub-available statewide raster, additive viz only; no ingest code found |
| Parcel tile cache (rendering) | N/A — derived cache, not a source layer | Yes | 165 rows | Yes | Not a primary layer; listed for completeness |

## Detail per layer

### Parcel geometry — TxGIO StratMap (Rail C, "the spine")

- **Code**: `packages/adapters/src/local/bastrop-tx.ts`, ingest pipeline referenced in `factory_onboarding_runbook.md` (bulk zip per county, browser-UA-gated CloudFront).
- **Data loaded**: SQL `SELECT county_fips, count(*) FROM txgio_parcel GROUP BY 1` (txgio/neondb, `legacy-design-tools-prod`) returned **19 distinct counties**, 5,535,897 total rows. Largest: Travis 48453 (894,657), Fort Bend 48439 (799,524), Bexar 48029 (747,206), Dallas 48113 (726,360). Smallest onboarded: Bastrop 48021 (74,729 — resolves the OPS-1-flagged discrepancy against the matrix's 63,357 figure; live DB count is 74,729, matching the agent-summary figure, not the matrix figure), Caldwell 48055 (32,781).
- **Staging table** `txgio_parcel_staging`: only 8 distinct counties, 2,475,299 rows — an in-flight/pre-promote buffer, not additional coverage.
- **Source-availability vs data-loaded — the critical distinction**: OPS-1's "253/254 counties covered" refers to `_scratch/txgio_stratmap_county_matrix_2026-08-02.json` (verified: a 9-key probe-result JSON with a `counties` array and `county_count` field — a **live-probed matrix of which counties have a StratMap zip published and how stale it is**), not to loaded rows. Only 19 of those 254 probed-available counties have actually been bulk-loaded into `txgio_parcel`.
- **Served**: yes, warm path reads from `txgio_parcel` for onboarded counties.
- **Classification**: statewide-uniform SOURCE (free, one acquisition mechanism for all 254 counties); statewide-uniform ACQUISITION is NOT complete — 19/254 loaded.

### Address points — TxGIO

- **Data loaded**: `SELECT county_fips, count(*) FROM txgio_address GROUP BY 1` → **6 counties only** (Bexar 710,316; Travis 433,031; Williamson 345,111; Hays 114,898; Bastrop 61,085; Caldwell 24,509), 1,688,950 rows total.
- OPS-1 states "statewide ~11.7M, PAGINATED REST... Already ingested (txgio_address)." The live count (1.69M / 6 counties) contradicts a blanket "already ingested" read — it is ingested for 6 counties, not statewide. Flagging this as a doc-vs-store divergence per the CLAUDE.md store-truth principle.

### CAD attributes (Rail B, appraisal district)

- `cad_property` table has schema for a full CAD attribute record (owner, value, legal description, year built, etc.) but **only 15 rows total**, effectively unloaded.
- Separately, `_catalog/texas_roster_v1.json` (59,068 lines) and `_inbox/t6_cad_probe_*.json` files record a 253/254-county **CAD REST-endpoint probe registry** (173 verified reachable, 22 partial, 59 honest-absent per OPS-1 T6 section) — this is source-discovery, not data acquisition. Rail B is inherently per-jurisdiction (253 separate CAD systems), not statewide-uniform in the sense the operator's pivot targets, though the discovery/registry work is a completed one-pass exercise.

### Roads — OSM Overpass

- **Code**: `packages/engine-core/scripts/ingest-bastrop-roads-overpass.mjs`, `ingest-caldwell-roads-overpass.mjs`, `ingest-elgin-roads-overpass.mjs` — per-city/county hand-authored scripts, not a single statewide-parameterized ingester.
- **Data**: `road-node` atoms = 25,078 total, split by entity_id county-fips prefix: 48021 (Bastrop) — need to re-verify split, 48055 (Caldwell) present. (Elgin's road ingest, per `factory_onboarding_runbook.md` Step Z10 fallback, added 2,356 ways via engine PR #228 — a separate ingest from the county-level Overpass scripts; not confirmed whether those ways are also `road-node` atoms or a different storage shape.)
- **TxDOT roadway layer**: no adapter or ingest code found anywhere in `hauska-engine` (`grep -ril txdot` returned zero hits outside an unrelated curated-queries file in a code-migration tool).
- **Classification**: OSM Overpass is a statewide-uniform SOURCE (one API, all of Texas), but current ingest tooling is per-jurisdiction hand-scripted, not run as a single statewide pass. This is the layer the operator's "road twins" step depends on — currently far from statewide.

### Topography / elevation — USGS 3DEP

- **Code**: `packages/adapters/src/topography/usgs3dep.ts`, `packages/engine-core/src/parcel-terrain/{author,contour-source,elevation,emitters}.ts`.
- **Data loaded**: `SELECT entity_type, count(*) FROM atoms` → `parcel-terrain-model` = **60 rows**. Sampled two rows directly: each is a single-parcel DEM crop (`exportImage` bbox sized to one parcel's bounding box, e.g. `size=17,18` pixels) fetched live from `elevation.nationalmap.gov` at authoring time and cached as a derived atom with DXF/IFC/PDF site-plan artifacts. This is **not** a statewide DTM/DEM tile store — it is an on-demand, per-parcel, per-engagement terrain pull.
- **Correction to operator's framing**: the operator's sketch says "topo (we have it, we should have any other statewide layers as well if we dont)." Per this audit, topo is **not held statewide** — it is architected as a live federal API call per parcel at depth-warm time, gated behind the same on-demand pattern as FEMA/SSURGO, not a bulk-acquired layer. If the operator's mental model was "topo is the one we already have, unlike FEMA/soils," that model does not hold — all three (topo, flood, soils) are architecturally identical: adapter code exists, none is bulk-loaded/statewide-persisted.
- There IS a `terrain_generation_jobs` table (20 rows, engagement-scoped job queue) and `bastrop-contours.ts` (a Bastrop-specific 1-ft LiDAR contour source layered on top of 3DEP for that one county) — further evidence the terrain pipeline is architected per-parcel/per-engagement/per-county, not statewide-batch.

### FEMA flood (NFHL)

- **Code**: `packages/adapters/src/federal/fema-nfhl.ts` — full working adapter, ArcGIS point-query against `hazards.fema.gov/.../NFHL/MapServer/28`, 12-month freshness threshold, federal/nationwide gate (`federalApplies` fires for any finite lat/lng).
- **Data loaded**: queried `adapter_response_cache` (the generic per-coordinate result cache backing all federal/local adapters per `packages/adapters/src/cache.ts` header comment) — **0 rows total**, so 0 rows for `adapter_key = 'fema:nfhl-flood-zone'` specifically.
- **Served**: the adapter is wired into the adapter registry (`registry.ts:102`) and fires live during engagements, but nothing is persisted/cached from those calls today (or the cache has been fully evicted — see WHAT I COULD NOT DETERMINE). Either way, there is no statewide flood layer sitting in a store; every read is a live federal API round-trip.
- **Classification**: statewide-uniform SOURCE, zero acquisition to date. This is architecturally the cheapest of the "not yet held" layers to convert into a real statewide store, because the adapter already exists and needs no jurisdiction-specific work — it would need a batch/bulk mode added (current code is point-query-only, one parcel at a time) or a parcel-by-parcel sweep across the loaded 19-county parcel spine.

### Soils (USDA SSURGO)

- **Code**: `packages/adapters/src/federal/usda-ssurgo.ts` — same shape as FEMA: point-query via USDA Soil Data Access, `Promise.allSettled` fallback for a known-flaky secondary ArcGIS host, 24-month freshness threshold.
- **Data loaded**: same `adapter_response_cache` — 0 rows.
- **Classification**: identical situation to FEMA — statewide-uniform source, code exists, zero data acquired/cached.

### Hydrology / NHD / watershed

- **Code**: `packages/adapters/src/hydrography/{county-hydrography,index}.ts`, `packages/adapters/src/hydrology/{hydrologyNative,hydrologyWorkerClient,maskRegions,noaaAtlas14,index}.ts`, plus site-plan flood-drainage-study machinery (`flood-drainage-study.ts`, `flood-flow-paths.ts`, `pdf/flood-drainage.ts`) and `services/engine-api/src/routes/hydrology.ts`.
- This is the most heavily built-out federal-layer code path in the repo (drainage/flow modeling, not just a lookup), suggesting real product investment, but:
- **Data loaded**: not confirmed as bulk/statewide. The `county-hydrography.ts` filename suggests per-county scoping already, consistent with the FEMA/SSURGO on-demand pattern rather than a statewide NHD layer table. No dedicated hydrology table found in either store's table list.
- **Classification**: code-heavy, data-unconfirmed. Flagged in WHAT I COULD NOT DETERMINE below — this needs a follow-up read of `hydrologyNative.ts` and `county-hydrography.ts` to confirm the acquisition pattern before making a claim either way.

### City boundaries / county boundaries / TIGER

- **Explicit code evidence of absence** *(SUPERSEDED 2026-08-30 for city/county boundaries — both tables are loaded; the comment below records the codebase as of 2026-08-08 and must not be cited as current)*: `packages/engine-core/src/property-reasoning/cascade-unzoned-envelope-decline.ts:62` — inline comment reads **"(verified: no city_limits / incorporated_place / TIGER source anywhere in [the codebase])"** — this is a prior engineer's own verification note, independently corroborating this audit's grep results (zero hits for `city_boundar`, `city_limits`, `TIGER`, `tiger` anywhere in `hauska-engine` outside that one comment).
- OPS-1 names TxGIO `City_Boundaries/Texas_City_Boundaries/MapServer/0` (1,225 city polygons, queryable REST, $0) as a known available statewide source that would "solve the R17 what-is-the-city problem" — but no adapter, ingest script, or table exists for it. This is a **pure candidate**, not partially built.
- County boundaries: OPS-1 notes "NOT a dedicated TxGIO service; use Census TIGER" — also zero code.

### Land use / land cover (NLCD)

- Zero grep hits for `nlcd` or `land.?cover` anywhere in `hauska-engine`. Not mentioned in OPS-1's statewide-candidate list either. Not built, not planned per any doc read.

### Building footprints / utility easements

- `80_adrs/adr_029_building_footprint_and_utility_easement_rails.md` defines the atom contract shapes and the ingest spec (`_inbox/2026-08-05_T3_ingest_spec_footprints_easements.md`) names `ml-global-building-footprints` (Microsoft Global ML Building Footprints, a real statewide-uniform ML-derived dataset) as the default adapter kind, with CAD/city-GIS preferred where available.
- Live atom breakdown shows **zero** `building-footprint` or `utility-easement` entity types among the 11 types present (`zoning-fact`, `buildable-envelope`, `setback-rule`, `code-section`, `property-boundary-edge`, `road-node`, `code-cross-reference`, `parcel-terrain-model`, `code-edition`, `jurisdiction-corpus`, `code-amendment`).
- `_inbox/2026-08-05_T3_footprint_source_recon.md` states (per OPS-1's own citation) "0/11 onboarded counties have CAD-authoritative footprint REST" — confirming this is fully unimplemented in data terms, contract-designed only.
- Footprints ARE a strong statewide-uniform-acquisition candidate (ML-global dataset, one national/state-clipped download, no per-jurisdiction source hunting) — the ADR already picked the right adapter kind for a layer-first approach; it just has not been run.

### Aerial imagery / LiDAR-DTM statewide raster

- OPS-1 names TxGIO DataHub statewide ortho + LiDAR/DTM raster as available at $0, explicitly caveated as "additive viz only; not a 3DEP replacement — datum-mismatch risk." No ingest code or table found. Not held.

## What IS statewide-complete today

**Nothing found in this audit is statewide-complete (all 254 counties, data loaded).** The closest candidates are source-availability, not data:

- StratMap parcel-source availability probe: 253/254 counties confirmed as havng a fetchable zip (not loaded).
- CAD REST-endpoint reachability probe: 253/254 counties probed (173 verified reachable), per OPS-1 T6 — again, endpoint discovery, not attribute data loaded.

If "statewide-complete" is read as "the acquisition mechanism is proven and requires no further jurisdiction-specific discovery, only a batch run," then StratMap parcels and the federal point-query adapters (FEMA, SSURGO) qualify — but none has been executed statewide.

## Cheapest next complete-in-one-pass win

**FEMA NFHL flood zone**, then **USDA SSURGO soils**, are the strongest candidates, for three reasons converging:

1. Adapter code is fully built and already wired into the adapter registry (`registry.ts`) — zero new source-discovery or jurisdiction-specific adaptation needed, unlike Rail A/B work.
2. The query pattern is point-in-polygon against a single national ArcGIS service — running it once per already-loaded parcel centroid (the 19-county, ~5.5M-row `txgio_parcel` table, or even just parcel centroids independent of full parcel load) requires no new adapter, only a batch-mode wrapper around the existing point-query function plus a bulk-persist step (today `adapter_response_cache` exists but is empty and is a per-coordinate lookup cache, not designed as a queryable statewide layer table — would need either promoting cache writes to be non-expiring/bulk, or a dedicated statewide table).
3. It requires zero jurisdiction-specific knowledge to acquire, matching the operator's own stated definition of what belongs in the layer-first pass.

**Caveat**: FEMA NFHL and SSURGO are currently architected as point-query-per-parcel, not bulk-polygon-download. A true "acquire once, covers everything" statewide layer would mean either (a) bulk-downloading the source NFHL/SSURGO polygon layers directly from FEMA/USDA (both do publish bulk shapefile/geodatabase exports outside this codebase's current adapter, unverified whether faster/cheaper than parcel-by-parcel point queries), or (b) running the existing point-query adapter across every parcel centroid once loaded. Given parcel load is itself only 19/254 counties, flood/soils per-parcel enrichment is currently bounded by the same parcel-load gap. The genuinely standalone, parcel-independent, one-pass-across-all-Texas win is **either a bulk polygon download of NFHL/SSURGO (new work, not yet coded) or completing the City_Boundaries ingest** (1,225 polygons, one clean REST layer, zero rows of code exist yet but the source is simple and well-documented in OPS-1 with the exact endpoint URL already named) — City_Boundaries may be the actually-cheapest first build since it requires writing one new small adapter against a known-good endpoint, versus retrofitting FEMA/SSURGO from point-query to bulk-polygon mode.

## Statewide-uniform vs per-jurisdiction classification (explicit)

**Statewide-uniform (acquire once mechanism, applies to all 254 counties uniformly):**
TxGIO StratMap parcels, TxGIO address points, FEMA NFHL, USDA SSURGO, USGS 3DEP, NHD/hydrography, TxGIO City_Boundaries, County boundaries (via TIGER), NLCD land cover, ML-derived building footprints (Microsoft Global), TxDOT statewide roadway layer (if it exists as a single statewide file — unverified), RRC oil/gas and pipeline data, TxGIO ortho/LiDAR raster.

**Per-jurisdiction (must be acquired up to 254+ times, no single-pass shortcut):**
CAD attribute data (253 separate appraisal district systems, though EARS gives a common target schema per `_land_records/source_rail_registry.md` section 4.2), zoning/setback code text (Rail A, the acknowledged moat), county clerk records (Rail A), municipal utility easements (explicitly ADR-029-flagged as never-county-level), ETJ boundaries (no statewide layer exists; must derive per-city), OSM road tagging quality/normalization per city (the source is statewide-uniform but Elgin's warm-run fallback shows per-city OSM tagging conventions vary enough to need per-city handling today).

## WHAT I COULD NOT DETERMINE

1. **Hydrology/NHD acquisition pattern** — whether `hydrologyNative.ts`/`county-hydrography.ts` bulk-load NHD data per county or query live like FEMA/SSURGO. No dedicated table found in either store, which is suggestive of the live-query pattern, but I did not read the adapter implementation bodies closely enough to confirm definitively. Flag as likely-live-query, not confirmed.
2. **Whether `adapter_response_cache` being 0 rows means "never populated" or "fully expired/evicted since last population."** The table has an `expires_at` column and an index on it; if a TTL sweep job runs, prior FEMA/SSURGO reads could have existed and been purged. I did not find a sweep/cleanup job to confirm or rule this out. Either way the operational conclusion (nothing usable is cached today) holds, but "never ran" vs "ran and expired" is a different remediation story.
3. **Whether the TxGIO ortho/LiDAR statewide raster (named available in OPS-1) has any ingest code anywhere outside hauska-engine** — I did not search `legacy-design-tools` or other repos for this; the task scope named hauska-engine and legacy-design-tools but time/breadth constraints meant legacy-design-tools was not separately grepped for these federal-layer keywords (only hauska-engine was searched in depth). This is a real gap in this audit — a follow-up grep of `P:\legacy-design-tools` for `fema|ssurgo|nlcd|txdot|stratmap|overpass|city.?boundar` would close it.
4. **Elgin's road-node coverage** — the runbook states 2,356 OSM ways were ingested for Elgin (engine PR #228) as a fallback fix for a no-road-adjacency warm failure, but I did not verify whether those ways landed as `road-node` atoms (same entity type queried) or a different storage shape/table, so the 25,078 road-node total may or may not already include Elgin.
5. **RRC pipeline/utility-corridor geometry** (distinct from RRC oil/gas well/lease data) — the adapter found (`og-sources/src/adapters/rrc-pdq/`) appears oil-and-gas-lease-scoped per its Reeves/Permian fixture; whether a separate pipeline-corridor or CCN (utility service area) layer exists was not confirmed either way.
6. **TxDOT statewide roadway layer existence as a single acquirable file/service** — OPS-1 names TxDOT as a candidate rail source but I did not independently verify TxDOT publishes a single statewide roadway GIS layer (as opposed to per-district data) — flagging this as an assumption inherited from OPS-1's framing, not independently source-verified in this audit.
7. **`_land_records/` risk_register.md and strategy.md** were not read in this pass (source_rail_registry.md was read in full); they may contain additional statewide-layer detail relevant to Rail A/D that this audit did not capture.

## Store-truth corrections to existing docs (flagged per CLAUDE.md store-truth principle)

- OPS-1's "Address points... Already ingested (txgio_address)" reads as a blanket statewide claim; live count is 6/254 counties, 1,688,950 of a claimed ~11.7M statewide total (14%).
- OPS-1's Bastrop StratMap discrepancy (matrix said 63,357, agent summary said 74,729) is now resolved: live `txgio_parcel` count for 48021 is **74,729**, matching the agent summary, not the matrix figure.
- The "253/254 counties covered" StratMap figure in OPS-1 is a source-availability probe result, not a data-loaded count, and should not be read as "253 counties are in the parcel store" — only 19 are.
