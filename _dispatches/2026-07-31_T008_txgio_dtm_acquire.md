---
id: 2026-07-31_T008_txgio_dtm_acquire
title: Dispatch — T-008 acquire TxGIO bare-earth DTM (Bastrop proof AOI)
status: closed
date: 2026-07-31
closed: 2026-07-31
evidence: terrain-dem.6fb2e610e91b.tif (689.5 MB) + metadata sidecar; EPSG:6343 / NAVD88 / US survey foot; 8 qquads / 128 sub-tiles
applies_to: legacy-design-tools
wdll: _inbox/2026-07-31_txgio_terrain_additive_3d_viz_WDLL.md
wdll_items: [2, 8]
blocked_by: T-003 (closed)
branch: feat/terrain-dem-acquire
---

# T-008 — TxGIO DTM acquire (Bastrop city + 2 mi buffer)

## STANDING DECISIONS

- Cotality EXTINGUISHED — re-route, never rotate credential.
- Deploys planner-owned — agent deploys and fixes failed deploys; never escalate deploy to operator.
- No privileged data — TxGIO is public/free; uniform public-record only.
- CTX / national HELD until Bastrop QA-done + operator go.
- Code-done ≠ customer-done — grade is live probe on deployed surface, not merged PR.
- Stage explicit paths — shared clone per repo; standing decisions travel in dispatches.

## Goal

Pull **source bare-earth DTM** from TxGIO DataHub for Bastrop proof AOI. Do **NOT** re-derive from `hauska-engine` Bastrop `Contour1Ft2017` contours (lossy). Structure CLI for statewide extension.

## Repo + paths

- **Repo:** `legacy-design-tools` @ fresh `origin/main`
- **Create:** `artifacts/tile-pipeline/terrain_dem_acquire.py` (+ `README-terrain-rgb-tiles-bake.md` skeleton)
- **Gate doc:** `doc_repo/40j_hauska_map_tile_build_pipeline.md`

## TxGIO source

- Portal: [data.geographic.texas.gov](https://data.geographic.texas.gov) (TxGIO DataHub)
- Filter: Lidar + Elevation; bare-earth **DTM** (not DSM)
- Bastrop county collections likely under **2017 StratMap** / **North & Central Texas Lidar** — verify collection metadata at acquire time
- Bulk: TxGIO bulk downloader (`tnris.org/applications-and-utilities`) if multi-tile

## AOI

- Bastrop **city limits** + **2 mi buffer** (WGS84 bbox — compute from city boundary layer or agreed planner bbox)
- Output: single merged GeoTIFF (or VRT + mosaic step documented)

## Metadata sidecar (REQUIRED)

Write `terrain-dem.<hash12>.metadata.json` alongside staged GeoTIFF:

- `horizontal_crs` (source native, e.g. EPSG:6578 or EPSG:4326+proj)
- `vertical_datum` (expect **NAVD88** — verify from GeoTIFF tags + collection page)
- `vertical_unit` (expect **US survey foot** for StratMap — verify, do not assume)
- `source`, `source_url`, `acquired_at`, `aoi`

## Safety

- **Additive only** — do not wire this file into engine flood, site-topography, or contour adapters
- Do not delete or replace USGS 3DEP paths in hauska-engine

## CLI sketch

```
python artifacts/tile-pipeline/terrain_dem_acquire.py \
  --aoi=bastrop-city-2mi \
  --out-dir=./.terrain-bake \
  [--collection-id=<txgio uuid>]
```

## Definition of done

- Staged GeoTIFF + metadata JSON with all three load-bearing fields recorded
- README section in `README-terrain-rgb-tiles-bake.md` documents statewide `--aoi` extension
- PR cites WDLL items **2**, **8**; CI green (if tests added, metadata schema validation only)

## Verify

- `gdalinfo` on output confirms CRS + vertical datum tags
- Spot elevation sanity vs known Bastrop benchmark or Contour1Ft2017 crossing (validation only — contours are NOT input)
