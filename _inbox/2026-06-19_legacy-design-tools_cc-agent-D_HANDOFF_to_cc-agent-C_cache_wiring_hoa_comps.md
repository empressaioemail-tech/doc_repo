---
date: 2026-06-19
from: cc-agent-D (data-layers)
to: cc-agent-C
repo: legacy-design-tools
subject: HANDOFF — wire the new Cotality map-proxy cache into /gis-layer; add HOA + comps adapters
status: cache built + committed on branch data/cotality-map-cache (2720b241, NOT pushed); wiring + adapters specced below for cc-agent-C to apply
related:
  - _inbox/2026-06-19_legacy-design-tools_cc-agent-D_cotality_cache_quota_design.md
  - _inbox/2026-06-19_legacy-design-tools_cc-agent-D_pending_layers_etj_and_cotality_cutover.md
---

# Handoff to cc-agent-C

Lane agreement, as the operator approved (Option 1: I author the cache as isolated new files, you apply the wiring into your file). I built and committed the cache; the call-site wiring and the two new adapters land in your lane, specced below ready to apply.

Live-tree note when I picked this up: you had 465 uncommitted lines in `brokerageGisLayers.ts` and 85 in `cotalityClient.ts`. I did not touch either. I branched off, committed only my five new/added files, and returned to main leaving your uncommitted work exactly as it was. Because your `brokerageGisLayers.ts` is mid-flight, the wiring below is an integration spec (where to call what), not a literal patch. Reconcile it against your current version.

## What I built and committed (branch `data/cotality-map-cache`, commit 2720b241, not pushed)

New files, all typecheck-clean, 11 unit tests pass:

- `lib/db/drizzle/0043_cotality_map_proxy_cache.sql` — three cache tables.
- `lib/db/src/schema/cotalityMapCache.ts` — Drizzle schema, plus a one-line export added to `lib/db/src/schema/index.ts`.
- `artifacts/api-server/src/lib/brokerageGisCache.ts` — the cache module.
- `artifacts/api-server/src/lib/__tests__/brokerageGisCache.test.ts` — unit tests.

The three caches mirror your `adapter_response_cache` failure-isolation contract exactly (never throw, degrade to live; env-overridable TTLs; `0` disables): `cotality_spatial_tile_cache` (parcel mesh by snapped grid tile, TTL ~30d), `cotality_property_attr_cache` (Property attrs by `(clip, product)`, TTL ~14d), `cotality_geocode_cache` (address to CLIP with negative caching, TTL ~90d).

To get the branch onto your tree once your in-flight work is committed: `git checkout data/cotality-map-cache -- lib/db/drizzle/0043_cotality_map_proxy_cache.sql lib/db/src/schema/cotalityMapCache.ts artifacts/api-server/src/lib/brokerageGisCache.ts artifacts/api-server/src/lib/__tests__/brokerageGisCache.test.ts` and re-apply the one-line `schema/index.ts` export (`export * from "./cotalityMapCache";` next to the adapterResponseCache export). Or cherry-pick 2720b241. Migration 0043 is auto-discovered by `migrate-prod.mjs` (no list to edit).

## Cache module API (what to call)

```ts
import {
  tileKey, normalizeAddrKey,
  getSpatialTile, putSpatialTile,
  getPropertyAttr, putPropertyAttr,
  getGeocodeClip, putGeocodeClip,
} from "./brokerageGisCache";
```

`tileKey(layer, bbox)` returns a stable snapped-grid key so overlapping pans share a row. `getSpatialTile(key)` returns `{payload, featureCount, cachedAt} | null`; `putSpatialTile(key, payload, featureCount)`. `getPropertyAttr(clip, product)` / `putPropertyAttr(clip, product, payload)` where product is `"site-location" | "rent-avm" | "propensity" | "hoa" | "ownership" | "comparables"`. `getGeocodeClip(addrNorm)` returns `{clip: string|null, cachedAt} | null` (null clip is a cached negative); `putGeocodeClip(addrNorm, clip|null)`; build the key with `normalizeAddrKey(street, city, state)`.

## Wiring spec — three call sites in `brokerageGisLayers.ts`

Site 1, the bbox mesh fetch (the dominant Spatial Tile cost). In the bbox branch of `queryGisLayerGeoJson`, before issuing the paginated Spatial Tile fetch, compute `const key = tileKey("parcels", normalizedBbox);` and `const hit = await getSpatialTile(key);`. On a hit, return `hit.payload` as the feature collection and skip the upstream fetch entirely. On a miss, run the existing pagination, then `await putSpatialTile(key, featureCollection, featureCount);` before returning. This is the single biggest quota win; the same viewport never re-fetches within the TTL.

Site 2, the geocode in `resolveClipForSpatialRow`. Before calling Property `/search/geocode`, build `const ak = normalizeAddrKey(catalog.streetAddress, catalog.city, catalog.state);` and `const g = await getGeocodeClip(ak);` — if non-null, return `g.clip` (including a cached negative null, which means do not re-geocode). On a miss, after resolving, `await putGeocodeClip(ak, resolvedClipOrNull);`. The direct-clip fast path (`clipFromParcelRow`) stays first and unchanged.

Site 3, the site-location fetch in `fetchSiteLocationZoning(clip)`. Wrap with `const c = await getPropertyAttr(clip, "site-location");` returning `landUseZoningFromSiteLocation(c.payload)` on a hit; on a miss, after the upstream call, `await putPropertyAttr(clip, "site-location", siteJson);` and continue. Cache the raw site-location JSON (not the extracted subset) so a later consumer that wants other site-location fields still benefits.

Net effect: after one warm pass over a market, a pan re-uses every covered tile, every parcel's geocode, and every parcel's zoning. Verify with the one allowed daily Cotality capture by asserting the upstream call count drops to zero on the second identical request, not just that the response matches.

A `forceRefresh` already exists on the assemble request shape; consider honoring an equivalent `?refresh=1` on `/gis-layer` that bypasses `get` but still writes through `put`, for QA.

## New adapters — HOA + comps (operator greenlit "both before launch")

Both model exactly on `cotalityOwnerOccupancyAdapter` in `cotalityInvestorDepth.ts` (same helpers in scope: `clipFor`, `pickRecord`, `cotalityGetWithApp`, `cotalityAdapterMeta`, `providerLabel`, `snapshotDateFromJson`, `COTALITY_TIMEOUT_MS`, `COTALITY_PROVIDER_LABEL`, `cotalityAppliesGeocoded`, `Adapter`, `AdapterResult`, `AdapterRunError`). Paste these two definitions next to `cotalityOwnerOccupancyAdapter`:

```ts
export const cotalityHoaAdapter: Adapter = {
  adapterKey: "cotality:hoa",
  tier: "federal",
  sourceKind: "national-aggregator",
  layerKind: "cotality-hoa",
  provider: COTALITY_PROVIDER_LABEL,
  jurisdictionGate: {},
  timeoutMs: COTALITY_TIMEOUT_MS,
  appliesTo: cotalityAppliesGeocoded,
  async run(ctx): Promise<AdapterResult> {
    const clipCtx = await clipFor(ctx, this.adapterKey);
    const clip = clipCtx.clip;

    const hoa = await cotalityGetWithApp({
      app: "property",
      path: `/${clip}/home-owners-association`,
      fetchImpl: ctx.fetchImpl,
      signal: ctx.signal,
      adapterKeyForLog: this.adapterKey,
      label: "property-hoa",
    }).catch(() => null);

    if (!hoa) {
      throw new AdapterRunError(
        "no-coverage",
        "Cotality HOA returned no data.",
      );
    }

    const rec = pickRecord(hoa);
    const hoaName = rec.hoaName ?? rec.associationName ?? rec.name ?? null;
    const hoaFee = rec.hoaFee ?? rec.fee ?? rec.dues ?? null;
    // Honest framing per commitment #1: absence in the record is "no HOA on
    // record", not a guarantee of no HOA. The map filter and brief copy must
    // use that phrasing.
    const hasHoaOnRecord = Boolean(hoaName || hoaFee);

    return {
      adapterKey: this.adapterKey,
      tier: this.tier,
      layerKind: this.layerKind,
      sourceKind: this.sourceKind,
      provider: providerLabel(clipCtx.county),
      snapshotDate: snapshotDateFromJson(hoa),
      payload: {
        kind: "cotality-hoa",
        clip,
        hoa,
        hoaName,
        hoaFee,
        hasHoaOnRecord,
        noHoaOnRecord: !hasHoaOnRecord,
        depthRole: "underwriting-on-viewed-property",
        ...cotalityAdapterMeta(this.adapterKey, "property"),
      },
    };
  },
};

export const cotalityCompsAdapter: Adapter = {
  adapterKey: "cotality:comparables",
  tier: "federal",
  sourceKind: "national-aggregator",
  layerKind: "cotality-comparables",
  provider: COTALITY_PROVIDER_LABEL,
  jurisdictionGate: {},
  timeoutMs: COTALITY_TIMEOUT_MS,
  appliesTo: cotalityAppliesGeocoded,
  async run(ctx): Promise<AdapterResult> {
    const clipCtx = await clipFor(ctx, this.adapterKey);
    const clip = clipCtx.clip;

    const comps = await cotalityGetWithApp({
      app: "property",
      path: `/${clip}/comparables`,
      fetchImpl: ctx.fetchImpl,
      signal: ctx.signal,
      adapterKeyForLog: this.adapterKey,
      label: "property-comparables",
    }).catch(() => null);

    if (!comps) {
      throw new AdapterRunError(
        "no-coverage",
        "Cotality comparables returned no data.",
      );
    }

    const rec = pickRecord(comps);
    const list = [rec.comparables, rec.items, rec.results, rec.data].find(
      Array.isArray,
    ) as unknown[] | undefined;

    return {
      adapterKey: this.adapterKey,
      tier: this.tier,
      layerKind: this.layerKind,
      sourceKind: this.sourceKind,
      provider: providerLabel(clipCtx.county),
      snapshotDate: snapshotDateFromJson(comps),
      payload: {
        kind: "cotality-comparables",
        clip,
        comparables: comps,
        comparableCount: Array.isArray(list) ? list.length : 0,
        depthRole: "underwriting-on-viewed-property",
        ...cotalityAdapterMeta(this.adapterKey, "property"),
      },
    };
  },
};
```

Register both in `COTALITY_INVESTOR_DEPTH_ADAPTERS` (append `cotalityHoaAdapter, cotalityCompsAdapter` to the array at line 474). Add both keys to `PRO_EXTRA_KEYS` in `brokerageTierGate.ts` (`"cotality:hoa"`, `"cotality:comparables"`) so they surface in Pro+ briefs. The no-HOA map filter is naturally Max-gated already via the map tier gate; HOA at Pro keeps it in briefs too. If the operator prefers comps as a Max-only premium signal, move `"cotality:comparables"` to `MAX_EXTRA_KEYS` instead.

When wired, the per-CLIP attribute cache (Site 3 pattern) extends cleanly to these: `getPropertyAttr(clip, "hoa")` / `"comparables"` so the no-HOA map filter and comps are also served from cache at viewport scale, not re-fetched per parcel per pan.

## Open question for you

Your 465 in-flight lines in `brokerageGisLayers.ts` — if any of that is already touching the bbox fetch or the zoning enrich functions, ping me with the current shape of those functions and I will adjust the three insertion points to match precisely. I kept off the file to avoid clobbering you; happy to pair on the exact diff once your work lands.
