---
id: 2026-07-31_T009_terrain_rgb_tiles_bake
title: Dispatch — T-009 terrain-RGB tile bake + GCS publish
status: closed-local
date: 2026-07-31
closed: 2026-07-31
branch: feat/terrain-dem-acquire
note: Branch held — no push/merge until coordinated with in-flight work.
evidence: terrain-rgb.09ee4eaa72ca/ (1877 PNGs, z0-16); metadata + wire.env; GCS publish planner-owned T-009 stacked on same branch.
---

# T-009 — terrain-RGB tiles bake + publish

## STANDING DECISIONS

- Cotality EXTINGUISHED — re-route, never rotate credential.
- Deploys planner-owned — agent deploys and fixes failed deploys; never escalate deploy to operator.
- No privileged data — TxGIO is public/free; uniform public-record only.
- CTX / national HELD until Bastrop QA-done + operator go.
- Code-done ≠ customer-done — grade is live probe on deployed surface, not merged PR.
- Stage explicit paths — shared clone per repo; standing decisions travel in dispatches.

## Goal

Reproject Bastrop proof DTM → EPSG:3857, encode **Mapbox terrain-RGB** (`rio-rgbify`), tile to parcel corpus zoom range, publish to `gs://hauska-map-tiles`.

## Repo + paths

- **Repo:** `legacy-design-tools` (stack on T-008 branch or merge T-008 first)
- **Create:** `artifacts/tile-pipeline/terrain_rgb_tiles_bake.py`
- **Extend:** `artifacts/tile-pipeline/README-terrain-rgb-tiles-bake.md`

## Pipeline steps

1. Input: staged GeoTIFF + metadata from T-008
2. `gdalwarp -t_srs EPSG:3857` (bilinear; document nodata handling)
3. `rio rgbify -b -10000 -i 0.1 <input.tif> <rgb.tif>` (Mapbox encoding — matches MapLibre `encoding: 'mapbox'`)
4. `gdal2tiles.py` → `{z}/{x}/{y}.png` pyramid, **z0–z16** (match parcel PMTiles max zoom; tune `--zoom` if file size prohibitive)
5. Content-hash manifest → directory `terrain-rgb.<hash12>/`
6. Copy metadata → `terrain-rgb.<hash12>.metadata.json` (add `encoding: mapbox`, `content_hash`, tile URL template)

## Publish (planner-owned after PR merge)

```powershell
gcloud storage rsync -r .\terrain-rgb.<hash12>\ `
  gs://hauska-map-tiles/terrain-rgb.<hash12>/ `
  --cache-control="public, max-age=31536000, immutable" `
  --project=legacy-design-tools-prod
```

## Wire prep for T-010

Emit constant for hauska-map PR:

```
TERRAIN_RGB_URL=https://storage.googleapis.com/hauska-map-tiles/terrain-rgb.<hash12>/{z}/{x}/{y}.png
TERRAIN_RGB_ENCODING=mapbox
TERRAIN_RGB_HASH=<hash12>
```

## Safety

- **Additive only** — tile artifact only; no engine report repoint
- No Vercel function added

## Definition of done

- Browser fetch: open devtools → load sample tile URL at z15 over Bastrop → **200/206**
- Metadata JSON on GCS matches staged sidecar
- WDLL items **3**, **8**

## Landmines

- Use **Mapbox** encoding (doc 40), not Terrarium — fixture code in `gis-terrain.js` uses Terrarium for synthetic DEM only; production tiles must match style `encoding`
- Record vertical datum in metadata unchanged from T-008 — do not re-derive
