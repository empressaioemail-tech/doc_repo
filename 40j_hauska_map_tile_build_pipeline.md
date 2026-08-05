---
id: 40j_hauska_map_tile_build_pipeline
title: Hauska map tile build pipeline — parcel PMTiles + terrain raster (T-003)
status: active
last_updated: 2026-08-05
applies_to: [legacy-design-tools, hauska-map]
related: [40_hauska_map_3d_implementation_brief, 2026-07-18_map10x_wave-d4_parcel_pmtiles_serving_artifact, 42_stub_thesis_national_twin_substrate]
owner: planner
---

# Hauska map tile build pipeline

Answers doc 40 Phase 0B **T-003**. The inventory was correct that **hauska-map** and **hauska-engine** contain no tippecanoe/gdal/rio-rgbify bake tooling. The pipeline lives in **legacy-design-tools** (`empressaioemail-tech/legacy-design-tools`).

## Summary

| Artifact | Build home | Tooling | Serving bucket | Consumer config |
|----------|------------|---------|----------------|-----------------|
| Parcel vector tiles (PMTiles) | `legacy-design-tools` | Node CLI + tippecanoe ≥2.x | `gs://hauska-map-tiles/parcels.<hash12>.pmtiles` | `hauska-map` `config.ts` / `sharedMapDefaults.ts` |
| Terrain RGB raster tiles (planned) | `legacy-design-tools` (new sibling CLI) | Python/GDAL + rio-rgbify + gdal2tiles | `gs://hauska-map-tiles/terrain-rgb.<hash12>/{z}/{x}/{y}.png` | `hauska-map` style `raster-dem` source (T-010) |

Both artifacts share the **same GCS bucket and upload discipline**; they do **not** share the same encode step (vector vs raster).

---

## Parcel PMTiles pipeline (LIVE)

### Location

| Piece | Path |
|-------|------|
| Bake CLI | `legacy-design-tools/artifacts/api-server/src/parcelsPmtilesBakeCli.ts` |
| Operator README | `legacy-design-tools/artifacts/api-server/README-parcels-pmtiles-bake.md` |
| npm script | `pnpm --filter @workspace/api-server parcels-pmtiles-bake` |
| Serving spec (D4) | `doc_repo/_inbox/2026-07-18_map10x_wave-d4_parcel_pmtiles_serving_artifact.md` |

### Trigger

**Manual / offline.** No Cloud Build job, no GitHub Action, no scheduled run. Re-run when:

- staging counties are promoted into prod (`txgio_parcel_staging` → `txgio_parcel`)
- CAD land-use roll changes and choropleth paint should refresh
- geometry ingest adds counties

### Inputs

1. **Postgres** — `DATABASE_URL` or `DEPLOYMENT_DATABASE_URL` (Secret Manager, project `legacy-design-tools-prod`). Read-only union of `txgio_parcel` + `txgio_parcel_staging`; optional `cad_property` land-use join.
2. **tippecanoe ≥ 2.x** — native on PATH or Docker image `tippecanoe-felt:latest` (felt/tippecanoe fork; klokantech v1.24 is too old for PMTiles output).
3. **Optional flags** — `--counties=48021`, `--min-zoom=0`, `--max-zoom=16`, `--export-only`, `--geojson=<path>`.

### Build steps

1. Stream county parcels → `parcels.geojsonseq` (GeoJSONSeq, one feature per line).
2. Stamp `parcel_node_id`, public fields only (**no `owner_name`** on the tile — PII guardrail).
3. Run tippecanoe → temp PMTiles.
4. Content-hash rename → `parcels.<sha256-12>.pmtiles`.

### Publish (planner-owned)

```powershell
gcloud storage cp .\parcels.<hash12>.pmtiles `
  gs://hauska-map-tiles/parcels.<hash12>.pmtiles `
  --cache-control="public, max-age=31536000, immutable" `
  --content-type="application/octet-stream" `
  --project=legacy-design-tools-prod
```

Verify range + CORS (206 Partial Content, `Accept-Ranges: bytes`) per D4 doc.

### Who can run

- **Planner** (default) — has gcloud, Docker, repo clone, Neon/Secret Manager access.
- **Any operator agent** with `legacy-design-tools` clone + `DATABASE_URL` + tippecanoe/docker — read-only on parcel tables; no deploy privilege required for the bake itself.
- Upload to public bucket is **planner-owned** (same deploy lane as Vercel/Cloud Run).

### Live serving revision (verify before quoting)

- Bucket: `gs://hauska-map-tiles` (project `legacy-design-tools-prod`, `us-central1`)
- Current PE/CC wired hash: `parcels.3431529a2e8d.pmtiles` (5.15M features, 19 counties incl 9 DFW; deployed 2026-08-05). Rollback: `parcels.4af31e1901e2.pmtiles` (Central TX only). Config: `hauska-map` `apps/property-explorer/src/lib/config.ts`, `packages/map-renderer/src/chrome/sharedMapDefaults.ts`.

---

## Terrain RGB pipeline (NOT BUILT — T-008/T-009 extension)

Terrain adds a **second artifact** to this pipeline. It reuses bucket + upload discipline; it needs a **new sibling bake** (does not extend `parcelsPmtilesBakeCli.ts`).

### Planned location

| Piece | Path (to create) |
|-------|------------------|
| DTM acquire + metadata CLI | `legacy-design-tools/artifacts/tile-pipeline/terrain_dem_acquire.py` (or `.sh` wrapper) |
| Terrain-RGB tile bake CLI | `legacy-design-tools/artifacts/tile-pipeline/terrain_rgb_tiles_bake.py` |
| Operator README | `legacy-design-tools/artifacts/tile-pipeline/README-terrain-rgb-tiles-bake.md` |

Rationale: parcel bake is Node+tippecanoe; terrain bake is GDAL+Python (rio-rgbify). Same repo home, separate scripts — mirrors "one serving bucket, multiple artifact types."

### Planned trigger

Manual / offline, same as parcels. Re-run when:

- TxGIO publishes a new LiDAR collection for a covered county
- zoom range or encoding changes
- statewide extension adds new AOI mosaics

### Planned inputs

1. **TxGIO DataHub** — bare-earth DTM GeoTIFF(s), NOT Bastrop `Contour1Ft2017` (lossy re-derive). Start: Bastrop city limits + 2 mi buffer; design mosaics for statewide extension.
2. **Toolchain** — GDAL (`gdalwarp`, `gdal2tiles.py`), Python `rio-rgbify` (Mapbox terrain-RGB encoding), optional Docker image pinning versions (repo already ships `gdal-bin` in root Dockerfile).
3. **Metadata sidecar** (required per tile set) — JSON alongside upload:

```json
{
  "horizontal_crs": "EPSG:6578",
  "horizontal_crs_reprojected": "EPSG:3857",
  "vertical_datum": "NAVD88",
  "vertical_unit": "US survey foot",
  "source": "TxGIO DataHub / <collection name>",
  "source_url": "<collection landing URL>",
  "acquired_at": "<ISO8601>",
  "aoi": "bastrop-city-plus-2mi-buffer",
  "encoding": "mapbox",
  "content_hash": "<sha256-12>"
}
```

Phase 3 flood depth (`T-012`) depends on all three CRS/datum/unit fields. Record them at acquire time from GeoTIFF tags + TxGIO collection metadata; do not infer later.

### Planned build steps

1. Download / clip TxGIO bare-earth DTM for AOI.
2. Record CRS, vertical datum, vertical units → sidecar JSON.
3. `gdalwarp` → EPSG:3857 (Web Mercator).
4. `rio rgbify` → Mapbox terrain-RGB GeoTIFF.
5. `gdal2tiles.py` (or equivalent) → `{z}/{x}/{y}.png` pyramid, zoom range aligned with parcel corpus (**z0–z16** initial; tune min zoom to Bastrop extent).
6. Hash the tile tree (or manifest) → `terrain-rgb.<hash12>/`.

### Planned publish

```powershell
gcloud storage rsync -r .\terrain-rgb.<hash12>\ `
  gs://hauska-map-tiles/terrain-rgb.<hash12>/ `
  --cache-control="public, max-age=31536000, immutable" `
  --project=legacy-design-tools-prod

gcloud storage cp .\terrain-rgb.<hash12>.metadata.json `
  gs://hauska-map-tiles/terrain-rgb.<hash12>.metadata.json `
  --cache-control="public, max-age=31536000, immutable" `
  --project=legacy-design-tools-prod
```

Wire URL template in hauska-map: `https://storage.googleapis.com/hauska-map-tiles/terrain-rgb.<hash12>/{z}/{x}/{y}.png`

### Who can run

Same as parcel bake. TxGIO is public/free — **no privileged data**. Large downloads may use TxGIO bulk downloader (`tnris.org` utilities) or per-tile HTTPS.

---

## Safety rules (terrain wave)

**Additive only.** The terrain-RGB layer powers **3D viz + new terrain-derived features**. It does **NOT** repoint live reports:

| Consumer today | Terrain source | Migration |
|----------------|----------------|-----------|
| Flood/drainage study (engine) | USGS 3DEP 10m + Bastrop contours path | Separate per-report migration + datum re-validation |
| Site-plan / terrain export PDF | Parcel-scoped contour/DEM assembly | Separate wave |
| PE `dem-hillshade` CONTEXT layer | Fixture or live county contours | Replace only when operator approves viz swap |

**Vertical-datum trap:** TxGIO LiDAR = NAVD88; FEMA BFE = NGVD29 or NAVD88 by DFIRM panel (~0.5–1 ft Central TX). Any future report migration must convert explicitly and spot-check `BFE − DEM` within tolerance.

---

## Open questions resolved / remaining

| # | Question | Status |
|---|----------|--------|
| 1 | Where does the PMTiles build pipeline live? | **RESOLVED** — `legacy-design-tools`, this doc |
| 2 | Can it take a second raster artifact without restructuring? | **YES** — sibling Python/GDAL bake, same GCS bucket + hash + upload runbook |
| 3 | PMTiles parcel schema documented? | Partial — README-parcels-pmtiles-bake.md + CLI header; no separate JSON schema file |

---

## Revision history

2026-07-31 — planner — T-003 gate closed. Located parcel pipeline in legacy-design-tools; documented trigger/inputs/runners; specified terrain-RGB sibling extension for T-008/T-009.
