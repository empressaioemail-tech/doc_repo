---
date: 2026-06-18
agent: cc-agent-C
repo: legacy-design-tools
dispatch: live QA — deep-dive map Zoning + Parcel Cotality gap
status: confirmed + extension handoff
prod_revision: cortex-api-00225-jag
---

# Close — map GIS proxy vs Cotality CLIP gap (deep-dive Zoning + Parcel)

**Symptom (live QA):** Deep-dive map **Zoning** and **Parcel** layers show  
`COTALITY_PROPERTY_KEY not configured — cannot resolve Cotality CLIP` and render nothing.  
**FEMA / OZ / topo render fine.**

**Root cause:** Extension is still sourcing Zoning + Parcel polygons from the **`POST /map-data` engine-spine assemble path**, which resolves `parcel-polygon` and `zoning` via **`cotality:parcels` / `cotality:zoning`** on **hauska-engine-api** (CLIP join). That path is **not** the new ArcGIS GIS proxy. Federal layers (FEMA NFHL, OZ tract, DEM/topography) do not require Cotality CLIP, so they succeed.

**Fix (extension-agent, priority 1):** Wire Zoning + Parcel map toggles to **`POST /api/brokerage/v1/map-data/gis-layer`** with layer keys `zoning` and `parcels` (Bastrop ArcGIS FeatureServers). Do **not** wait on Cotality for county GIS polygons.

---

## 1. GIS proxy — confirmed (ArcGIS, not Cotality)

Implemented in cortex-api (`brokerageGisLayers.ts` + `brokerageMapData.ts`). Queries run **in-process on cortex-api** via `arcgisPointQueryGeoJson()` — **no engine spine, no Cotality CLIP**.

### Endpoints (Max tier)

| Method | Path | Gate |
|--------|------|------|
| `GET` | `/api/brokerage/v1/map-data/gis-layers` | `packageTier === "max"` |
| `POST` | `/api/brokerage/v1/map-data/gis-layer` | `packageTier === "max"` |

**Headers (same as other brokerage routes):**

```
X-Hauska-Key: <BROKERAGE_EXTENSION_PUBLIC_KEY>
X-Hauska-Install-Id: <install-id>
Content-Type: application/json
```

**Max tier resolution:** wallet `subscriptionTier=max` **or** install on `BROKERAGE_MAP_DATA_MAX_INSTALL_IDS` allowlist **or** operator API key.  
(`BROKERAGE_MAP_DATA_MAX_INSTALL_IDS` is **not** baked in `cloud-run-deploy.yml` — operator sets on Cloud Run for QA installs like `extension-agent-map-max-qa`.)

### Layer catalog (`GET /gis-layers` → `layers[]`)

| `layer` key | Provider | `adapterKey` | ArcGIS FeatureServer |
|-------------|----------|--------------|----------------------|
| `fema` | FEMA NFHL | `fema:nfhl-flood-zone` | `https://hazards.fema.gov/arcgis/rest/services/public/NFHL/MapServer/28` |
| `floodplain` | Bastrop County, TX GIS | `bastrop-tx:floodplain` | `https://gis.bastropcountytx.gov/arcgis/rest/services/Hazards/Floodplain/MapServer/0` |
| `zoning` | Bastrop County, TX GIS | `bastrop-tx:zoning` | `https://gis.bastropcountytx.gov/arcgis/rest/services/LandUse/Zoning/MapServer/0` |
| `parcels` | Bastrop County, TX GIS | `bastrop-tx:parcels` | `https://gis.bastropcountytx.gov/arcgis/rest/services/Cadastral/Parcels/MapServer/0` |
| `etj` | Municipal ETJ (configured) | `local:etj` | **env** `BROKERAGE_GIS_ETJ_SERVICE_URL` (unset in prod → 404 `no-coverage`) |

### `POST /gis-layer` request body

```json
{
  "layer": "parcels",
  "latitude": 30.1109,
  "longitude": -97.3152
}
```

`layer` enum: `"fema" | "zoning" | "parcels" | "floodplain" | "etj"`.

Use the **map center / subject property pin** for `latitude` / `longitude` (WGS84).

### `POST /gis-layer` 200 response

```json
{
  "layer": "parcels",
  "provider": "Bastrop County, TX GIS",
  "adapterKey": "bastrop-tx:parcels",
  "serviceUrl": "https://gis.bastropcountytx.gov/arcgis/rest/services/Cadastral/Parcels/MapServer/0",
  "featureCount": 1,
  "geojson": {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "geometry": { "type": "Polygon", "coordinates": [ ... ] },
        "properties": { ... }
      }
    ]
  },
  "packageTier": "max"
}
```

### MapLibre wiring (extension-agent)

**Per layer toggle** (Zoning, Parcels, FEMA county floodplain):

1. `GET /gis-layers` once on map init → populate layer panel metadata.
2. On toggle **on** (or map center change): `POST /gis-layer` with pin coords.
3. `map.getSource(id).setData(geojson)` or `map.addSource` + `addLayer`:
   - `fill` layer — full-opacity polygon fill (`fill-opacity: 0.35` or palette in `GIS_LAYER_PAINT`)
   - `line` layer — parcel/zoning outline
4. Map **source id** suggestion: `hauska-gis-parcels`, `hauska-gis-zoning`, `hauska-gis-fema`.

**Keep on assemble path** (`POST /map-data`) for layers that already work without Cotality polygons:

- `flood-zone`, `floodway` → FEMA (envelope + reasoning overlays)
- `opportunity-zone-tract` → federal OZ
- `dem`, `topography` → elevation
- `reasoningOverlays[]` → cited pins (verdict, flood-zone label, OZ, etc.)

**Stop using** assemble slots `parcel-polygon` and `zoning` for MapLibre polygon sources until Cotality CLIP is healthy on engine (see §2).

### Full-bleed note (viewport vs pin)

Current proxy uses **point-intersect** ArcGIS query (`esriSpatialRelIntersects` at pin). That returns the **subject parcel + zoning district at the pin** (typically 0–1 features each) — correct for highlighting the researched property.

It does **not** return every parcel/zoning polygon in the visible viewport. For viewport-wide mesh, cortex needs a **bbox/envelope** query extension (not shipped). Workarounds until then:

- Render pin-intersect polygons with full map-canvas styling (fill + line) — “full-bleed” visually for the **subject** parcel.
- On `moveend`, re-`POST /gis-layer` with new center (still pin-intersect, not viewport bbox).

**Follow-up (cc-agent-C):** add optional `bbox: { westLng, southLat, eastLng, northLat }` to `POST /gis-layer` when extension needs viewport parcel mesh.

### Live verification (this workstation)

| Check | Result |
|-------|--------|
| Free install → `GET /gis-layers` | **403** `tier_required` ✓ |
| `extension-agent-map-max-qa` without wallet Max | **403** `tier_required` (allowlist env not set on `00225-jag`) |
| Simulated Max checkout → entitlement | `maxActive: false` (Stripe live mode; simulated path inactive) |
| Direct Bastrop ArcGIS from cente DNS | `ENOTFOUND gis.bastropcountytx.gov` (local network; Cloud Run can reach) |
| Code + unit tests (`bastropAdapters.test.ts`) | Bastrop parcel/zoning/floodplain ArcGIS URLs and point query **confirmed** |

**Operator live smoke (Max wallet or allowlist):**

```bash
# After Max checkout OR BROKERAGE_MAP_DATA_MAX_INSTALL_IDS=<install>
curl -sS -X POST "$PROD/api/brokerage/v1/map-data/gis-layer" \
  -H "X-Hauska-Key: $BROKERAGE_EXTENSION_PUBLIC_KEY" \
  -H "X-Hauska-Install-Id: $MAX_INSTALL" \
  -H "Content-Type: application/json" \
  -d '{"layer":"parcels","latitude":30.1109,"longitude":-97.3152}'
# Expect 200, featureCount >= 1, Polygon geometry
```

---

## 2. Cotality CLIP path — separate, lower priority

### Where the error comes from

| Path | Cotality? | Used for |
|------|-----------|----------|
| `POST /map-data` → engine `POST /v1/map-layers/assemble` | **Yes** — `parcel-polygon` → `cotality:parcels`, `zoning` → `cotality:zoning` | Extension spatial map today (broken layers) |
| `POST /map-data/gis-layer` | **No** — Bastrop/FEMA ArcGIS direct | **Use this for Zoning + Parcels** |
| `POST /parcel-key` / brief `captureParcelKey()` | **Yes** — `resolveCotalityClip()` on **cortex-api** | Universal parcel key / CLIP join for briefs |

Error text variants:

- Engine assemble: `COTALITY_PROPERTY_KEY/SECRET is not configured. Cannot resolve Cotality CLIP.`
- Extension may shorten to: `COTALITY_PROPERTY_KEY not configured — cannot resolve Cotality CLIP`

### Prod secret status (cortex-api `00225-jag`)

| Secret | Secret Manager | Mounted on Cloud Run |
|--------|----------------|----------------------|
| `COTALITY_PROPERTY_KEY` | present (len **48**) | ✓ `--set-secrets` in deploy workflow |
| `COTALITY_PROPERTY_SECRET` | present (len **64**) | ✓ |

**Not a missing deploy manifest entry on cortex-api.** Likely causes for assemble-path failure:

1. **hauska-engine-api** (where assemble runs) may lack Cotality OAuth env — CLIP resolution happens on engine, not cortex.
2. Invalid/revoked Cotality OAuth credentials in SM (non-empty but rejected at token exchange).
3. Extension reading failed `mapData.layers[]` slot for `parcel-polygon` / `zoning` and surfacing engine error message.

### Operator actions (when Cotality polygons are wanted on assemble path)

1. Confirm `COTALITY_PROPERTY_KEY` + `COTALITY_PROPERTY_SECRET` on **hauska-engine-api** Cloud Run (not only cortex-api).
2. Smoke `POST /parcel-key` on cortex with Bastrop address — if that fails with same error, repaste Cotality OAuth client credentials in SM.
3. Until fixed, **degraded-expected** for Cotality-derived assemble slots; county GIS via `gis-layer` is the supported Max map path for Bastrop polygons.

---

## 3. Extension-agent checklist

- [ ] **Zoning toggle** → `POST /gis-layer` `{ "layer": "zoning", latitude, longitude }` → MapLibre `geojson` source
- [ ] **Parcel toggle** → `POST /gis-layer` `{ "layer": "parcels", latitude, longitude }`
- [ ] **FEMA toggle** (optional unify) → `gis-layer` `fema` **or** keep assemble `flood-zone` (both FEMA NFHL; assemble already works)
- [ ] **Do not** block map on `parcel-polygon` / `zoning` assemble slots or Cotality CLIP for county GIS
- [ ] Gate unchanged: Max tier required (403 `tier_required` for free/Pro)
- [ ] QA without Max wallet: operator sets `BROKERAGE_MAP_DATA_MAX_INSTALL_IDS=extension-agent-map-max-qa` on cortex-api

---

## Commits (GIS proxy stack, already on main)

| SHA | Summary |
|-----|---------|
| `95151caa` | GIS proxy routes + Max tier gate |
| `860c9f9a` | ArcGIS GeoJSON type fix |

**Files:** `artifacts/api-server/src/lib/brokerageGisLayers.ts`, `artifacts/api-server/src/routes/brokerageMapData.ts`, `lib/adapters/src/arcgis.ts` (`arcgisPointQueryGeoJson`).

---

## Follow-ups

| Owner | Item |
|-------|------|
| **extension-agent** | Wire Zoning + Parcel to `gis-layer` (this close unblocks) |
| **operator** | `BROKERAGE_MAP_DATA_MAX_INSTALL_IDS` for QA; Cotality OAuth on **engine-api** if assemble CLIP needed |
| **cc-agent-C** | Optional bbox on `POST /gis-layer` for viewport-wide parcel mesh |
