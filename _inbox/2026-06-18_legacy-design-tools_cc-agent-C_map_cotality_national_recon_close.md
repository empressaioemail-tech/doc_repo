---
date: 2026-06-18
agent: cc-agent-C
repo: legacy-design-tools (+ hauska-engine recon)
dispatch: national map pivot — Cotality SpatialTile vs county ArcGIS
status: recon complete — do not build county GIS; fix Cotality path first
---

# Recon — national map geometry: Cotality + FEMA (not county ArcGIS)

**Correction accepted:** Bastrop/county ArcGIS in `brokerageGisLayers.ts` is a SmartCity artifact. National investor radar map base = **Cotality parcel vectors + FEMA NFHL flood**. Municipal zoning-**district** polygons are optional per-jurisdiction polish, not the base layer.

**Do not build** further county GIS URL chasing. The bbox viewport machinery (`arcgisEnvelopeQueryGeoJson` / `POST /gis-layer` bbox body) **still applies** — retarget to **Cotality Spatial Tile `bbox` + `pageSize`**, not ArcGIS FeatureServers.

---

## 1. What Cotality SpatialTile returns

### Parcel geometry — **vector, not raster**

| Surface | Format | MapLibre fit |
|---------|--------|--------------|
| **Parcel Point** `GET\|POST /spatial-tile/parcels` | **Vector** — parcel boundary polygon + centroid per feature | **Yes** — GeoJSON-like geometry in JSON; styleable `fill`/`line`; clickable per feature |
| **Visual Map** `/spatial-tile/map`, `/tile/bing`, `/tile/gmap` | **Raster** — PNG map tiles | No — basemap overlay only; not per-parcel attributes or click targets |

**Authoritative catalog:** [`doc_repo/_research/2026-06-06_cotality_api_surface_catalog.md`](../../doc_repo/_research/2026-06-06_cotality_api_surface_catalog.md) § API 2.

**Parcel Point params (national):** `lat`, `lon`, **`bbox`**, `geometry` (WKT filter), `fips`, `apn`, `within`, `pageNumber`, `pageSize`. Coverage claim: **162M parcels / 3,094 counties**.

**Response shape (catalog):**

```json
{
  "pageInfo": { ... },
  "parcels": [
    {
      "apn": "...",
      "geometry": { "type": "Polygon", "coordinates": [...] },
      "centroid": { "lat": 30.11, "lon": -97.32 },
      "county": "...",
      "state": "TX"
    }
  ]
}
```

Unit fixtures also include `clip` on parcel rows (`lib/adapters/src/__fixtures__/cotalityFixtures.ts`).

### What we implement today

`cotality:parcels` adapter (`lib/adapters/src/national/cotality.ts`):

- Spatial Tile `GET /parcels` with **`pageNumber=0`, `pageSize=1`** at pin lat/lon only
- **No `bbox` viewport query wired** in adapters yet
- CLIP join via Property geocode (`resolveCotalityClip`) before/as part of flow

---

## 2. Licensed products + what each supplies for the map

### Demo apps provisioned (six secrets in cortex-api deploy)

| Env pair | OAuth app | Scheme | Map-relevant capability |
|----------|-----------|--------|-------------------------|
| `COTALITY_PROPERTY_KEY/SECRET` | Property | `property_auth` | **CLIP geocode** (`/search/geocode`); **parcel attributes** incl. `landUseAndZoningCodes` via `/{clip}/site-location` |
| `COTALITY_SPATIALTILE_KEY/SECRET` | SpatialTile | `property_auth` | **Parcel boundary polygons** (`/spatial-tile/parcels`); O&G + utility SpatialRecord tiers |
| `COTALITY_RISKMETER_KEY/SECRET` | RiskMeter | `spatial_auth` | Hazards, modeled flood depth, replacement cost — **not** the base flood polygon layer for map |

**Property API does NOT return parcel polygons** — centroid + assessor fields only (`site-location` doc: *"No parcel polygon here — point centroid only"*). **Polygons come from Spatial Tile.**

### Zoning / land-use for map coloring

| Source | What you get | National? | District polygons? |
|--------|--------------|-----------|------------------|
| Property `/{clip}/site-location` → `landUseAndZoningCodes` | `zoningCode`, `zoningDescription`, `landUseCode` — **assessor/county raw codes on the parcel** | **Yes** (CLIP-keyed, national) | **No** — attributes on parcel, not municipal zoning map polygons |
| `cotality:zoning` adapter | Same codes + polygon from parcel geometry (Spatial Tile fallback) | Yes | No |
| County/city ArcGIS zoning layers | Municipal **district** polygons | Per jurisdiction only | Yes |

**GTM constraint** ([`76d_gtm_data_package_go_to_market.md`](../../doc_repo/76d_gtm_data_package_go_to_market.md)): Cotality parcel geometry is **not resold as a tile SKU**; it is a **metered pass-through COGS** inside the product (Max map / brief), not a data export product.

### Can we render a national viewport of parcels with zoning/land-use color?

**Yes, with this architecture:**

1. **Viewport mesh:** Spatial Tile `/parcels?bbox={west,south,east,north}&pageNumber=&pageSize=200-500` → many parcel polygons nationally.
2. **Per-parcel paint:** join Property `site-location` per `clip` (or batch if vendor documents one — **not wired today**). Codes are parcel-level assessor zoning/land-use, sufficient for **choropleth by code** on parcel fills.
3. **Subject highlight:** pin mode `pageSize=1` at lat/lon (existing adapter pattern).
4. **Flood base:** **FEMA NFHL** `fema:nfhl-flood-zone` (public ArcGIS) — **keep as-is**; no Cotality license dependency for the flood canvas.
5. **Optional polish:** municipal zoning-district ArcGIS where reachable — overlay toggle, not base.

**COGS caveat:** viewport + per-parcel `site-location` enrichment = **1 Spatial Tile call + N Property calls** per pan unless Cotality returns zoning fields on Spatial Tile rows (catalog summary does not list them — verify on live bbox response before assuming zero N).

**RiskMeter** is licensed for hazard scoring / modeled flood depth in **brief depth**, not required for the map flood **polygon** layer (operator chose federal NFHL).

---

## 3. Root cause — `COTALITY_PROPERTY_KEY not configured`

### Failure chain (live QA symptom)

```
Extension → POST /api/brokerage/v1/map-data (Max)
         → cortex-api routeAssembleMapLayers()
         → hauska-engine-api POST /v1/map-layers/assemble
         → cotality:parcels / cotality:zoning adapters
         → resolveCotalityClip()  ← requires COTALITY_PROPERTY_KEY/SECRET in process env
         → throws: "COTALITY_PROPERTY_KEY/SECRET is not configured. Cannot resolve Cotality CLIP."
```

FEMA / OZ / topo slots use **federal adapters** on engine — no Cotality CLIP — so they succeed.

### Secret mount state (verified 2026-06-18)

| Service | `COTALITY_PROPERTY_*` | `COTALITY_SPATIALTILE_*` | `COTALITY_RISKMETER_*` |
|---------|----------------------|--------------------------|------------------------|
| **cortex-api** (`legacy-design-tools-prod`) | ✓ `--set-secrets` in deploy YAML; SM len 48/64 | ✓ mounted | ✓ mounted |
| **hauska-engine-api** (`hauska-prod-497015`) | **✗ not mounted** (gcloud env empty) | **✗** | **✗** |

Map-layers assemble runs on **engine-api** (`MAP_LAYER_SPECS` → `cotality:parcels`, `cotality:zoning`). Cortex having secrets does **not** help the assemble path.

`captureParcelKey()` on **cortex-api** (`brokerageParcelKey.ts`) would work when cortex secrets are valid — but the **deep-dive map** uses **engine assemble**, not cortex parcel-key directly.

---

## 4. Fix paths (report only — pick one for build)

### Option A — **Wire Cotality secrets on hauska-engine-api** (recommended minimum)

Mirror cortex-api deploy:

```
--set-secrets=COTALITY_PROPERTY_KEY=...,COTALITY_PROPERTY_SECRET=...,
              COTALITY_SPATIALTILE_KEY=...,COTALITY_SPATIALTILE_SECRET=...,
              COTALITY_RISKMETER_KEY=...,COTALITY_RISKMETER_SECRET=...
```

Also set `COTALITY_PROPERTY_BASE_URL=https://api1.cotality.com/v2/properties` if not already on engine (Property data host; tokens already split per product).

| Pros | Cons |
|------|------|
| Fixes existing `POST /map-data` → engine assemble with **no extension contract change** | Engine deploy is manual (`gcloud run deploy --source`; no baked deploy YAML in hauska-engine) |
| Aligns with map-layers ADR (adapters live on engine) | Does not add viewport bbox by itself — still pin `pageSize=1` until Option C |

### Option B — **Move parcel/zoning geometry resolution to cortex-api**

Cortex already mounts all six secrets. Implement Cotality bbox + pin on **`POST /map-data/gis-layer`** (replace Bastrop ArcGIS backend); extension calls cortex BFF only.

| Pros | Cons |
|------|------|
| Secrets already on cortex; faster to ship national viewport | Engine assemble still broken for other consumers until A |
| Bbox infra already sketched in `brokerageGisLayers.ts` — swap ArcGIS call for `cotalityGetWithApp({ app: "spatialtile", path: "/parcels", query: { bbox, pageSize } })` | Duplicates adapter logic unless shared from `@workspace/adapters` |

### Option C — **Both (recommended for Max map)**

1. **A** — unblock engine assemble / CLIP (fixes error string immediately).
2. **B** — retarget `/gis-layer` to Cotality bbox for full-bleed extension map; keep `layer: "fema"` on FEMA NFHL only.

**Deprecate** county `zoning` / `parcels` / `floodplain` keys in `brokerageGisLayers.ts` (or remove after extension switches).

---

## 5. Target map layer stack (post-pivot)

| Layer | Source | Query mode |
|-------|--------|------------|
| **Parcels (fill, clickable)** | Cotality Spatial Tile `/parcels` | **bbox viewport** + pin `pageSize=1` for subject |
| **Zoning / land-use color** | Property `site-location` `landUseAndZoningCodes` joined to parcel `clip` | Per visible parcel (or batched when vendor supports) |
| **FEMA flood** | `fema:nfhl-flood-zone` (federal NFHL MapServer) | bbox viewport (existing ArcGIS envelope helper OK for **FEMA only**) |
| **OZ / topo / DEM** | Existing assemble slots | Unchanged |
| **Municipal zoning districts** | Optional local ArcGIS per city | Off by default; polish only |

---

## 6. Extension-agent contract (after Cotality retarget)

**Keep** `POST /api/brokerage/v1/map-data/gis-layer` shape from bbox close; **change backends:**

### Viewport parcels (Cotality)

```json
{
  "layer": "parcels",
  "bbox": { "west": -97.32, "south": 30.10, "east": -97.30, "north": 30.12 }
}
```

→ cortex proxies to Spatial Tile with same bbox + `pageSize=500` + pagination.

### Pin subject parcel

```json
{ "layer": "parcels", "latitude": 30.1109, "longitude": -97.3152 }
```

### FEMA flood (unchanged source)

```json
{ "layer": "fema", "bbox": { "west": ..., "south": ..., "east": ..., "north": ... } }
```

### Paint

MapLibre `fill-color` from feature properties: `zoningCode` / `landUseCode` (after Property join). Palette already stubbed in extension `GIS_LAYER_PAINT`.

---

## 7. What NOT to do

- Do **not** chase `gis.bastropcountytx.gov` or county FeatureServer URLs (ENOTFOUND from Cloud Run; wrong product base).
- Do **not** use Cotality **PNG** `/spatial-tile/map` tiles as the parcel layer.
- Do **not** use RiskMeter as the flood **polygon** base when FEMA NFHL is the chosen national public layer.
- Do **not** treat Cotality zoning codes as municipal **district** boundaries — they are parcel assessor attributes.

---

## 8. Build sequence (when approved)

1. **Operator:** mount six `COTALITY_*` secrets on `hauska-engine-api` Cloud Run (+ smoke `resolveCotalityClip` on engine).
2. **cc-agent-C:** replace ArcGIS backends in `brokerageGisLayers.ts` with Cotality Spatial Tile bbox/pin; add Property `site-location` enrichment for zoning props; keep FEMA on NFHL.
3. **extension-agent:** point parcel/zoning toggles at `/gis-layer` Cotality layers; keep `POST /map-data` for reasoning overlays / OZ / topo.
4. **Optional later:** municipal district overlay toggle per jurisdiction catalog.

---

## References

| Doc | Path |
|-----|------|
| API surface catalog | `doc_repo/_research/2026-06-06_cotality_api_surface_catalog.md` |
| Parcel provider decision | `doc_repo/_decisions/2026-06-06_cotality_parcel_provider.md` |
| Map-layers engine contract | `hauska-engine/services/engine-api/docs/map-layers-contract.md` |
| Adapter implementation | `lib/adapters/src/national/cotality.ts`, `cotalityClient.ts` |
| Prior bbox close | `doc_repo/_inbox/2026-06-18_legacy-design-tools_cc-agent-C_map_gis_bbox_allowlist_close.md` |
