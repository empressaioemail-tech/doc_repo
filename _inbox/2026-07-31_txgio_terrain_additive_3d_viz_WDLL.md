---
id: 2026-07-31_txgio_terrain_additive_3d_viz_WDLL
title: WDLL — statewide TxGIO terrain additive 3D viz foundation
status: approved
last_updated: 2026-07-31
operator_approval: 2026-07-31
related: [40_hauska_map_3d_implementation_brief, 40j_hauska_map_tile_build_pipeline, 42_stub_thesis_national_twin_substrate]
---

# WDLL: TxGIO terrain — additive 3D viz foundation

Date: 2026-07-31  
Status: draft  
Operator approval: **pending**

## Done looks like

A **second tile artifact** (terrain-RGB from TxGIO statewide LiDAR DTM) is built through the documented tile pipeline, served from `hauska-map-tiles`, and wired into hauska-map via `setTerrain` at exaggeration **1.0**. Bastrop city + 2 mi buffer proves the pipeline; structure extends statewide without redesign. The 3D map shows real bluff relief at pitch 45. Envelope extrusion anchoring on terrain is **verified or escalated** before Phase 1/3 scheduling. **Zero** live report paths (flood/drainage, site-plan terrain export) are repointed to the new DEM — additive viz only.

## Acceptance items

1. **T-003 pipeline doc** | check: `40j_hauska_map_tile_build_pipeline.md` records parcel pipeline location, trigger, inputs, who-can-run, and terrain sibling extension | grade: [ ]

2. **Bastrop-buffer DTM acquired** | check: bare-earth GeoTIFF staged; sidecar records horizontal CRS, vertical datum (NAVD88 expected), vertical unit; source is TxGIO DataHub direct download, NOT Bastrop Contour1Ft2017 re-derive | grade: [ ]

3. **Terrain-RGB tiles served** | check: tiles at `storage.googleapis.com/hauska-map-tiles/terrain-rgb.<hash12>/{z}/{x}/{y}.png`; browser network tab shows 200/206 fetches; metadata JSON co-located | grade: [ ]

4. **setTerrain live in hauska-map** | check: deployed PE (and CC if Terrain preset applies) renders 3D terrain at pitch 45 over Bastrop with exaggeration 1.0; sky layer present; no `demotiles.maplibre.org` glyphs in production style | grade: [ ]

5. **Extrusion-base anchoring answered** | check: live probe or shader-cited finding documented — do envelope `fill-extrusion-base: 0` volumes sit on ground elevation when terrain is active? Finding filed in session close + doc 40 open Q2 | grade: [ ]

6. **Additive-only safety** | check: grep + route audit — no change to engine flood/drainage DEM path, `bastrop-contours.ts`, or terrain export refresh routes pointing at new tile URL | grade: [ ]

7. **Basemap pitch degradation addressed** | check: pitched view uses vector basemap OR distance fog; operator screenshot shows no unacceptable raster smear at horizon | grade: [ ]

8. **Designed for statewide** | check: acquire/bake CLIs accept `--aoi` / county list; README documents extension steps without code fork | grade: [ ]

## Dependencies (execution order)

T-003 (doc) → T-008 (DTM) → T-009 (tiles) → T-010 (setTerrain + anchoring probe). T-010 glyph/basemap fixes may ship in same PR as setTerrain.

## Amendments

(none)

## Finish card (graded at close)

(to be filled at wave close)
