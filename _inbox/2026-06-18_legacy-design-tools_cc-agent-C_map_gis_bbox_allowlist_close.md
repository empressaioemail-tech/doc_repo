---
date: 2026-06-18
agent: cc-agent-C
repo: legacy-design-tools
dispatch: full-bleed map — GIS bbox viewport + Max QA allowlist bake
status: implemented (local) — prod bbox pending image deploy
prod_revision: cortex-api-00155-hlt @ 100% (allowlist env live)
---

# Close — GIS bbox viewport query + Max QA allowlist

## Summary

| Item | Status |
|------|--------|
| **1. Bbox viewport on `POST /gis-layer`** | **Implemented** in repo (not yet on prod image) |
| **2. `BROKERAGE_MAP_DATA_MAX_INSTALL_IDS` bake** | **In `cloud-run-deploy.yml`** + **live on prod** |
| **Allowlist smoke** | `extension-agent-map-max-qa` → `GET /gis-layers` **200** `packageTier=max` |
| **Bbox prod smoke** | **Blocked** until next cortex-api image deploy (schema rejects `bbox` today) |
| **Bastrop county layers** | `gis.bastropcountytx.gov` → **ENOTFOUND** from Cloud Run (FEMA works) |

---

## 1. Bbox viewport query (extension-agent contract)

### Endpoint

`POST /api/brokerage/v1/map-data/gis-layer` (Max tier)

### Viewport mode (full-bleed map — use on pan/zoom)

```json
{
  "layer": "parcels",
  "bbox": {
    "west": -97.32,
    "south": 30.10,
    "east": -97.30,
    "north": 30.12
  }
}
```

**Accepted `bbox` shapes (any one):**

| Shape | Fields |
|-------|--------|
| Canonical | `westLng`, `southLat`, `eastLng`, `northLat` |
| Cardinal aliases | `west`, `south`, `east`, `north` |
| ArcGIS aliases | `xmin`, `ymin`, `xmax`, `ymax` |

WGS84. `west < east`, `south < north`.

### Pin mode (subject parcel highlight — unchanged)

```json
{
  "layer": "parcels",
  "latitude": 30.1109,
  "longitude": -97.3152
}
```

Provide **either** `bbox` **or** `latitude`+`longitude` (not required together).

### Layers supporting bbox

`parcels`, `zoning`, `fema`, `floodplain` (same ArcGIS services as pin mode; `etj` when env-configured).

### 200 response (viewport)

```json
{
  "layer": "parcels",
  "provider": "Bastrop County, TX GIS",
  "adapterKey": "bastrop-tx:parcels",
  "serviceUrl": "...",
  "queryMode": "bbox",
  "featureCount": 342,
  "truncated": false,
  "geojson": { "type": "FeatureCollection", "features": [ ... ] },
  "packageTier": "max"
}
```

| Field | Meaning |
|-------|---------|
| `queryMode` | `"bbox"` or `"pin"` |
| `featureCount` | `geojson.features.length` |
| `truncated` | `true` when ArcGIS `exceededTransferLimit` after 4×500 feature pages |

### Extension wiring

| Map event | Request |
|-----------|---------|
| Pan/zoom end | `POST /gis-layer` with `bbox` from `map.getBounds()` |
| Subject highlight | `POST /gis-layer` with pin `latitude`/`longitude` |
| Layer toggle on | Viewport fetch if map expanded |

**Suggested:** debounce `moveend` 250–400ms; one request per visible layer toggle.

### Implementation

| File | Change |
|------|--------|
| `lib/adapters/src/arcgis.ts` | `arcgisEnvelopeQueryGeoJson()` — envelope query, 500/page, paginate to 2000 |
| `artifacts/api-server/src/lib/brokerageGisLayers.ts` | `normalizeGisLayerBbox()`, bbox branch in `queryGisLayerGeoJson()` |
| `artifacts/api-server/src/routes/brokerageMapData.ts` | Zod union body; response `queryMode` + `truncated` |

### Viewport query verified (query shape)

Direct ArcGIS envelope query at Bastrop test viewport (`west=-97.32,south=30.10,east=-97.30,north=30.12`):

| Layer (test host) | Features returned |
|-------------------|-------------------|
| ParcelARI (ArcGIS Online stand-in) | **500** (page cap; `exceededTransferLimit`) |
| FEMA NFHL MapServer/28 | **72** |

Confirms SmartCity-style viewport mesh (hundreds of polygons/request), not pin-intersect 0–1.

---

## 2. Max QA allowlist — baked + live

### Deploy YAML

Added to `.github/workflows/cloud-run-deploy.yml` `--set-env-vars`:

```
BROKERAGE_MAP_DATA_MAX_INSTALL_IDS=extension-agent-map-max-qa
```

Persists across `deploy-canary` / `shift-traffic` (same pattern as other baked env vars).

### Prod (immediate)

| Action | Result |
|--------|--------|
| `gcloud run services update --update-env-vars=BROKERAGE_MAP_DATA_MAX_INSTALL_IDS=extension-agent-map-max-qa` | Created `cortex-api-00155-hlt` |
| Traffic shift | **100% → `00155-hlt`** (was stuck on `00225-jag` without new env) |

### Live smoke (`extension-agent-map-max-qa`)

```
GET  /api/brokerage/v1/map-data/gis-layers  → 200 packageTier=max layers=[fema,floodplain,zoning,parcels]
POST /gis-layer {layer:fema, lat, lon}       → 200 featureCount=1
POST /gis-layer {layer:parcels, lat, lon}    → 502 ENOTFOUND gis.bastropcountytx.gov
POST /gis-layer {layer, bbox}                → 400 (old schema — awaits code deploy)
```

---

## Operator follow-ups

1. **Deploy cortex-api image** with bbox code (push → `build-and-push` → `deploy-canary` → `shift-traffic`).
2. **Bastrop ArcGIS hostname** — `gis.bastropcountytx.gov` does not resolve from Cloud Run (`ENOTFOUND`). County parcels reachable via `services3.arcgis.com/.../ParcelARI/FeatureServer/0` (verified 500 features/bbox). Operator should confirm canonical county service URL vs SmartCity lift.
3. **Canary tag** — currently points at `00225-jag` (0% traffic); update canary after next deploy.

---

## Tests

- `lib/adapters/src/__tests__/arcgisEnvelopeGeoJson.test.ts` — pagination merge
- `artifacts/api-server/src/lib/__tests__/brokerageGisLayers.test.ts` — bbox alias normalization
- `pnpm run typecheck` — pass
