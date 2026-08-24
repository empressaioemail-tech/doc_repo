---
id: 2026-08-24_p60_parcel_ring_composer_inventory
title: P-60 peel — every parcel-ring composer on ExplorerMap
status: active
date: 2026-08-24
plan_row: P-60
wdll_item: 1
tree: P:/tmp/hauska-map-paint-peel
branch: fix/pe-paint-peel
snapshot: db479df plus peel
---

# Composer inventory

Checked against `ExplorerMap` `mapOverlays` on isolated `fix/pe-paint-peel` from `origin/main` `#208` `db479df`. Mechanism file: `apps/property-explorer/src/browse/parcel-ring-peel.ts`.

| id | file:function | what it paints | peel |
| --- | --- | --- | --- |
| pmtiles-line | `packages/map-renderer/src/map/parcel-tiles.js:addParcelTiles` | Lot outline for every feature in the browse tiles. `parcel-polygon` toggle owns layout visibility. | Keep. Fail-open. |
| pmtiles-feature-state | `packages/map-renderer/src/map/parcel-tiles.js:setParcelFeatureState` | Subject/inspected stroke, fill, glow. | Pre-seal only. `countyRing` demotes the sealed lot. |
| live-gis-mesh | `packages/map-renderer/src/live-gis.ts:toLiveOverlays` | Thin CONTEXT line on every viewport lot (`line-width` 1.1). Same CAD fabric as the tiles. | Omit on PE (`peelParcelMesh`). CC unchanged. |
| inspect-ring | `apps/property-explorer/src/browse/inspect-highlight.ts:countyExactInspectOverlays` | Sealed sheet outer ring, inspected lot only. | Keep. This is the one inspected ring. |
| envelope | `apps/property-explorer/src/browse/envelope-overlay.ts:envelopeInsetOverlay` | Amber dashed inset or consumed outline. | Keep at most one. |
| search-highlight | `apps/property-explorer/src/browse/ExplorerMap.tsx` `setSearchOverlays` | Transient street box. Fades out. | Not a lot ring. |

Tile-line suppress (`shouldSuppressTileParcelLines`) stays unconditionally false. Fetch-ok is not paint. Re-hiding lots on zoom-in is a fail.

Lane 2 parked. See `_inbox/2026-08-24_lane2_parked_after_paint.md`.

## Addendum 2026-08-24 (second agent) — composers the first pass missed, with live-verified paint

Verified against the served bundle (`80c9ad4`) by live style dump plus code read. Diagnosis: `_inbox/2026-08-24_stacked_paint_diagnosis.md`.

| id | file:function | what it paints | default | notes |
| --- | --- | --- | --- | --- |
| pmtiles-glow | `parcel-tiles.js:addParcelTiles` (glow layer) | 9px `rgba(255,225,77,0.55)` halo, SUBJECT only; no-state fallback is transparent AND zero-width (verified live) | on with `parcel-polygon` | not a stray-line source |
| hover | `map-renderer.js:363-426` | `#7dd3fc` fill 0.18 + 2px line on hovered tile feature | always armed | **SEAM DEFECT (measured 22:02Z): draws `hits[0].geometry` = the PER-TILE FRAGMENT, cut at z16 seam ± ~10 m buffer. Simsbrook block sits on a seam cross (lng -97.6354980 / lat 30.4581444); 280233/280234 split in four, 280236/280239 in two; hover draws 280236 as 30 m of 38 m. Fix: feature-state hover, never fragment geometry.** Also no mouseleave clear — lingers when pointer exits to the card |
| road-node-pedestrian (Sidewalks) | `road-overlay.ts:203-233` | `#8fd0ff` dotted centerlines of pedestrian ways | ON at cold open; resets ON at every hard refresh | feed `retrieval/road-nodes/near-bbox` 504ing live — layer silently empty when dead |
| road-node-row-band | `road-overlay.ts:145-200` | `#c7ccd4` wide street band | OFF | owned by `road-nodes` toggle, not Sidewalks |
| live-topography | `live-gis.ts:303-361` | `rgba(180,120,60,0.72)` 0.8px contour lines | ON, z>=14 | the thin brown squiggles in the operator frame |
| live-hydrography | `live-gis.ts:686-699` | `rgba(96,165,250,0.72)` stream lines | ON, z>=11 | no data at Simsbrook in probe session |
| live-fema | `fema-zones.js:77-87` | zone fills + boundary lines; minimal zone = transparent fill, `#9fa5ac` 0.8px line | ON, z>=11 | covers the whole block at Simsbrook (minimal, invisible) |
| live-opportunity-zone-tract | `live-gis.ts:905-911` | green tract fill/line | ON | none in the probe viewport |
| building-footprint | `building-footprint-overlay.ts` | tan fill `#c4a882` | OFF | feed also 504ing live |

Reconcile question from the handoff answered: `reconcileOverlays` (`overlay-render.js:345-368`) DOES remove layers+sources for keys that disappear; a peeled composer cannot leave paint behind. The stacked-ring residue is the seal-state lifecycle cluster (countyRing non-replay after source rebuild `map-renderer.js:574-581`; swallowed clears `parcel-tiles.js:419-432`; failed seals; hover linger), not a hidden composer.
