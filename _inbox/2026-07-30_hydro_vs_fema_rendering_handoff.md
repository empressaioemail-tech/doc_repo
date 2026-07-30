---
id: 2026-07-30_hydro_vs_fema_rendering_handoff
title: Handoff — how the hydro study renders vs how the FEMA layer renders (for the fix agent)
date: 2026-07-30
type: technical_handoff
status: active
owner: nick
audience: the agent assigned to fix the hydro-study map visual
related: [_STATE.md, 28_THE_BASTROP_MOLD_engine_build_spec]
---

# Hydro study rendering vs FEMA layer rendering

Purpose: the operator wants the hydro (flood and drainage) map overlay to look like the FEMA flood-zone layer. Three styling passes have not achieved it. This doc describes, with file and line references against live main in both repos, exactly how each pipeline produces its picture, and names the one structural difference that styling cannot fix. Everything below was read from the code on 2026-07-30; the deployed state matches (PE bundle `index-Dmc_ZfJK.js`, engine revision `hauska-engine-api-00152-nuz` serving, PE PR #117 merged).

## 1. How the FEMA layer renders (the look the operator wants)

Data source. FEMA NFHL polygons fetched per viewport bbox through the cortex proxy: `POST {proxy}/brokerage/v1/map-data/gis-layer` with `{ layer: "fema", bbox }`. The response is a GeoJSON FeatureCollection of REAL NFHL features, which are large, smooth, dissolved polygons produced by FEMA's own engineering studies. Feature properties carry `FLD_ZONE`, `SFHA_TF`, etc. Client: `hauska-map/packages/map-renderer/src/live-gis.ts` (`fetchGisLayer`, lines 98 to 139).

Zoom policy. FEMA is fetchable from zoom 11 up (`MIN_FEMA_ZOOM = 11`, line 43); parcels gate at 14.

Rendering. `toLiveOverlays` (live-gis.ts lines 728 to 769) emits an OverlaySpec that the shared renderer reconciles into one geojson source plus a fill layer and a line layer. FEMA is pushed FIRST so its fill draws below the parcel lines. Paint, verbatim from lines 740 to 750:

```
fill-color:  ["match", ["get","FLD_ZONE"], "X", "rgba(96,165,250,0.18)", "rgba(59,130,246,0.6)"]
fill-opacity: 0.4
line-color:  "rgba(59,130,246,0.55)"
line-width:  0.8
```

That is the entire recipe: a handful of big smooth polygons, one categorical fill split (SFHA blue vs zone-X light tint), one thin outline. The visual quality comes almost entirely from the GEOMETRY, not the paint: NFHL polygons have organic, curving, dissolved boundaries that follow terrain and studies.

## 2. How the hydro study renders (current state, after the FD4 restyle)

### 2a. Where the geometry comes from (engine)

The drainage study is computed per parcel by `hauska-engine/packages/engine-core/src/site-plan/flood-drainage-study.ts`:

1. A DEM is fetched for the catchment bbox (never finer than 3 m per pixel for the D8 worker; drainage runs around 10 m).
2. D8 flow direction and accumulation run either in the pysheds worker (`hauska-engine/artifacts/hydrology-worker/run.py`) or the in-process native fallback (`hauska-engine/packages/adapters/src/hydrology/hydrologyNative.ts`).
3. The worker returns boolean raster MASKS (catchment mask, ponding mask) and traced flow lines. The study then serves:
   - `catchmentGeoJson` = the worker's `drainageZonesGeoJson` output verbatim (flood-drainage-study.ts line 878);
   - `drainageZonesGeoJson` = the same features re-graded by flow-line vertex density into `concentration` 0, 1, or 2 (`deriveDrainageZones`, lines 552 to 586);
   - `rainfallResultGeoJson` = the ponding mask polygonized the same way;
   - `flowLinesGeoJson`, `flowExits`, plus the v3 `flowPaths` and `catchmentSwaths` (traced polylines with a normalized strength) and the v2 `gradient` raster (currently unused by the map overlay).

### 2b. THE STRUCTURAL DIFFERENCE: how the masks become polygons

This is the reason the overlay looks like a grid instead of FEMA zones, and no paint change can fix it.

Both mask-to-GeoJSON converters emit ONE SMALL INDEPENDENT SQUARE PER SAMPLED GRID CELL, with no dissolve, no boundary tracing, no simplification, and coarse subsampling:

- pysheds worker: `_mask_to_geojson_polygons` in `artifacts/hydrology-worker/run.py` (lines 51 to 83). `step = max(1, min(height, width) // 20)`, so the mask is sampled on roughly a 20 by 20 lattice and each hit cell becomes its own square Polygon feature.
- native fallback: `maskToGeoJson` in `packages/adapters/src/hydrology/hydrologyNative.ts` (lines 281 onward). Same scheme with `step = min // 12`.

Consequence: `catchmentGeoJson`, `drainageZonesGeoJson`, and `rainfallResultGeoJson` are FeatureCollections of hundreds of DISJOINT AXIS-ALIGNED SQUARES (a checkerboard). The comment in run.py calls it "a coarse GeoJSON FeatureCollection" by design. When PE fills them, the eye reads a blue grid, which is exactly what the operator sees in the dock mini-map and rejected on the main map. FEMA features are the opposite: few, large, contiguous, smooth.

Secondary geometry differences that also read as "not FEMA":

- The modeled region is a SQUARE bbox around the parcel, so the zone field has a hard rectangular outer boundary; FEMA zones have organic extents.
- Zone grading (`concentration` 0/1/2) is per square, so any graded styling produces a patchwork rather than nested categorical regions.
- The squares' edges are aligned to the DEM grid, not to terrain features.

### 2c. How PE draws it (client)

File: `hauska-map/apps/property-explorer/src/browse/flood-map-overlay.ts` (857 lines on main, post PR #117). Applied through the workbench host seam while the Flood and Drainage report is open for the active property; cleared on tool close or property switch.

Model build (`buildFloodMapOverlayModel`, lines 394 to 503): one FeatureCollection, features tagged by `kind`:
- `zone` from `drainageZonesGeoJson` (every feature, no concentration split);
- `ponding` from `rainfallResultGeoJson`;
- `catchment` from `catchmentGeoJson`;
- `flow` from v3 `flowPaths` filtered to parcel relevance (kind `exit`, or any vertex inside the ring, or within 15 m of it, or crossing it; `isParcelRelevantPath` line 290), legacy `flowLinesGeoJson` routed through the same filter;
- `arrow` and `exit` point features: sparse along-line arrows (1 or 2 per surviving line) plus one arrow per ring crossing, hard-capped at 6 total, crossings first (`MAX_FLOW_ARROWS`, cap logic lines 479 to 500).

Layers (`addVectorLayers`, lines 630 to 756): a single geojson source `pe-flood-src` and 8 layers filtered on `kind`, in add order:

| Layer | Type | Paint (constants, lines 86 to 118) | Placement |
|---|---|---|---|
| `pe-flood-zone-fill` | fill | `#60a5fa` at 0.18 | below parcels |
| `pe-flood-zone-line` | line | `rgba(59,130,246,0.55)` at 0.8 px | below parcels |
| `pe-flood-ponding-fill` | fill | `#3b82f6` at 0.42 | below parcels |
| `pe-flood-ponding-line` | line | `#1d4ed8` at 1 px | below parcels |
| `pe-flood-catchment-line` | line | `rgba(59,130,246,0.8)` at 1.4 px, static dash [4,3] | top of stack |
| `pe-flood-flow-line` | line | `#7dd3fc` at 1.5 px, opacity 0.85 | top of stack |
| `pe-flood-arrows` | symbol | rasterized north-pointing arrow icon, size 0.4, `icon-rotate: ["get","bearing"]` | top of stack |
| `pe-flood-exit-arrows` | symbol | amber variant, size 0.55 | top of stack |

"Below parcels" means inserted before the first of `hauska-parcel-tiles-glow`, `-fill`, `-line` (fallback: first symbol layer) via `pickBelowParcelsBeforeId` (line 587). This mirrors the FEMA below-parcel ordering.

Paint discipline (already enforced by tests): no feature-state, no animated dash, static dasharray literals only, plain `["get", ...]` property reads.

### 2d. What was already tried and removed

- FD2/FD3 (PRs #114, #116, engine #179/#181): fuzzy water-gradient raster image overlay, dark scrim dimming other layers, wide catchment swath corridors, strength-scaled animated ribbon casings, arrows across the whole modeled area. Operator rejected the look.
- FD4 (PR #117, live): the FEMA-matched paint above, all dominance/gradient/swath/animation code deleted. Operator still unsatisfied because the underlying geometry is a grid of squares. The `gradient` and `catchmentSwaths` payload fields still arrive from the engine but the map overlay ignores them.

## 3. The delta in one paragraph

Paint parity with FEMA is already achieved (same hues, same opacities, same outline weight, same below-parcel ordering). The remaining and decisive difference is geometry character: FEMA serves a few large dissolved smooth polygons; the hydro study serves hundreds of disjoint subsampled grid squares from `_mask_to_geojson_polygons` (pysheds worker) and `maskToGeoJson` (native fallback). Until the masks are polygonized as dissolved contiguous regions (boundary tracing over the full-resolution mask, dissolve, simplify and smooth, drop speck regions below a minimum area), no client-side styling will make the overlay read like FEMA zones. The obvious candidate fix loci are those two converters (emit dissolved region polygons per mask; marching squares or contour tracing over the boolean mask, then simplification and corner smoothing), or a lower-confidence client-side alternative (dissolve and smooth the squares in PE before rendering). The pipeline is otherwise pass-through: improved polygons in `drainageZonesGeoJson` and `rainfallResultGeoJson` flow to the PE overlay, the dock mini-grid SVG, and the PDF sheets without any contract change, as long as the fields stay FeatureCollections of Polygons.

## 4. Facts the fix agent must not trip over

- The engine study route serializes the study whole; the cached GET study endpoint serves whatever the refresh stored. After an engine change, a parcel must be re-refreshed to see new geometry.
- `deriveDrainageZones` (flood-drainage-study.ts lines 552 to 586) assumes each catchment feature is a Polygon and grades it by counting flow vertices in its bbox. If the fix replaces many squares with a few dissolved regions, the per-feature `concentration` grading semantics change (counts will concentrate); the study test suite pins some of this (`__tests__/flood-drainage-study.test.ts`).
- `featureCollectionAreaSqFt` on the catchment and the parcel-clipped ponding stat (lines 886 to 893) sum polygon areas; disjoint squares currently under-count true mask area because of the subsampling. A dissolved full-resolution polygonization will CHANGE the headline stats. The parcel-scoped stat honesty rule applies (mold, PART 1c): headline numbers must stay parcel-clipped and honest.
- The PDF sheets (`site-plan/pdf/flood-drainage.ts`) and the dock mini-grid consume the same GeoJSON; check both after the change. Sheet tests pin some strings and layout.
- PE layer stack tests (`flood-map-overlay` tests) pin the 8-layer structure, paints, parcel-relevance filter, and the arrow cap. Geometry-side fixes need no PE change; if the fix also wants graded zone fills (concentration 1 vs 2 as two tints, closer to the FEMA SFHA vs X split), that is a small paint change in `addVectorLayers` plus a filter split.
- Deploys: engine images MUST build with `--config cloudbuild.engine-api.yaml` and `_IMAGE` substitution (a bare `--tag` submit builds the wrong root Dockerfile); canary with `--no-traffic --tag`, smoke, then shift. PE deploys via Vercel CLI (`vercel link --yes --project property-explorer` then `vercel deploy --prod`); merge does not deploy. The Bastrop BDC correction program is active in hauska-engine; check open PRs and the serving revision before shifting traffic, and coordinate with the planner seat that owns that program.
- The pysheds worker is a separate artifact (`artifacts/hydrology-worker/`), invoked via `hydrologyWorkerClient.ts`; confirm how it is packaged and deployed before assuming an engine-api image rebuild updates it. The native fallback in `packages/adapters` DOES ship with engine-api.

## 5. Quick reference: file inventory

| What | Repo and path |
|---|---|
| FEMA fetch and paint | `hauska-map/packages/map-renderer/src/live-gis.ts` (fetch 98-139, paint 728-769) |
| Hydro map overlay (PE) | `hauska-map/apps/property-explorer/src/browse/flood-map-overlay.ts` |
| Hydro dock tool and mini-grid | `hauska-map/apps/property-explorer/src/workbench/tools/FloodTool.tsx` |
| Study author (engine) | `hauska-engine/packages/engine-core/src/site-plan/flood-drainage-study.ts` |
| Mask to squares (pysheds) | `hauska-engine/artifacts/hydrology-worker/run.py` lines 51-83 |
| Mask to squares (native) | `hauska-engine/packages/adapters/src/hydrology/hydrologyNative.ts` lines 281+ |
| v3 flow paths and swaths | `hauska-engine/packages/engine-core/src/site-plan/flood-flow-paths.ts` |
| Water gradient raster (unused by map) | `hauska-engine/packages/engine-core/src/site-plan/drainage-gradient.ts` |
| Flood study API routes | `hauska-engine/services/engine-api/src/routes/flood-drainage.ts` |
| PDF sheets | `hauska-engine/packages/engine-core/src/site-plan/pdf/flood-drainage.ts` |
