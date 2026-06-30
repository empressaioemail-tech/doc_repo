---
date: 2026-06-19
agent: map-track123-dispatch (Cursor)
repos:
  - empressaioemail-tech/hauska-brief-extension
  - empressaioemail-tech/legacy-design-tools
status: complete — Tracks 1–3 shipped on feature branches; PRs open for review
related:
  - 75m_map_data_visual_benchmark.md
  - 75k_max_map_quality_direction.md
  - 75l_cotality_data_stack_catalog.md
---

# Map Track 1–3 visual + free-data close

Dispatch owner for Max map visual ceiling and free federal wiring across `hauska-brief-extension` and `legacy-design-tools`. Cotality production paths untouched.

## PRs (do not merge without review)

| Repo | Branch | PR |
|---|---|---|
| hauska-brief-extension | `map/track123-visual-ceiling` | https://github.com/empressaioemail-tech/hauska-brief-extension/pull/3 |
| legacy-design-tools | `map/track123-free-federal-layers` | https://github.com/empressaioemail-tech/legacy-design-tools/pull/197 |

## GATE 0 — live engine-api verification (2026-06-19)

Probe target: `https://hauska-engine-api-h7gvu7rgcq-uc.a.run.app`  
Test parcel: 205 Javelina Trl, Bastrop TX (`30.1109, -97.3153`)  
Method: bearer `HAUSKA_ENGINE_API_KEY` + gate-front headers (not doc set).

### Summary verdict

| Capability | engine-api today | Map impact |
|---|---|---|
| **DEM / 3DEP** | **LIVE** — `POST /v1/hydrology/dem` → 200, `demBytesBase64` (~88 KB for 97×112 catchment) | Track 1 uses fixture DEM hillshade client-side; live DEM available for future tile cutover |
| **Topography / contours** | **LIVE** — `POST /v1/map-layers/assemble` → `topography` status `ok`, `geojson` in envelope (`site-topography:contours`) | Not previously rendered on map; Track 1 renders fixture 5 m contours |
| **Hydrology D8** | **COMPUTED, not map-visualized** — `POST /v1/hydrology/drainage` returns 400 `invalid_request` with naive `demRaster` body in this probe; prior prod sessions confirm D8 runs via cortex engagement spine with ingested DEM | Track 1 renders **fixture** animated flow channels; live D8 geojson path still needs BFF contract alignment |
| **SSURGO soils** | **WIRED, UPSTREAM BROKEN** — `run-adapters` → `usda:ssurgo-soils` **failed** HTTP 400 from USDA SDA | Track 2 fixes SDA SQL + adds bbox choropleth layer; needs engine-api deploy to verify live |
| **USGS geology** | **WIRED, UPSTREAM BROKEN** — `usgs:geology` **failed** HTTP 400 invalid ArcGIS query params (bad `outFields`) | Track 2 fixes to `outFields: *` + map layer |
| **USGS groundwater** | **WIRED, UPSTREAM BROKEN** — `usgs:groundwater` **failed** HTTP 400 from NWIS site API | Track 2 fixes NWIS params + map layer |
| **Seismic / Vs30** | **LIVE** point adapter — `usgs:seismic` **ok** but `siteClass` was hardcoded `"D"` | Track 2 derives site class from SSURGO shrink-swell when available |
| **FEMA / OZ** | **LIVE** on assemble | unchanged |
| **TCEQ Edwards** | **PARTIAL** — recharge query path 404 on legacy `ContributingZone` MapServer in live probe | Track 2 adds COA fallback URL for contributing zone + bbox map layer |

### Verbatim health

```json
{"status":"ok","service":"engine-api","adapters":true,"engineCore":true,"envelope":true}
```

### map-layers assemble (Bastrop bbox)

| layerKey | status | adapterKey | hasGeojson |
|---|---|---|---|
| dem | ok | usgs:3dep-dem | no (attributes only in assemble payload) |
| topography | ok | site-topography:contours | yes |
| flood-zone | ok | fema:nfhl-flood-zone | yes |
| floodway | ok | fema:nfhl-flood-zone | yes |
| opportunity-zone-tract | ok | national:opportunity-zone | yes |

### site-context run-adapters (subsurface subset)

| adapterKey | status | note |
|---|---|---|
| usda:ssurgo-soils | **failed** | USDA SDA HTTP 400 |
| usgs:geology | **failed** | SGMC ArcGIS HTTP 400 invalid params |
| usgs:groundwater | **failed** | NWIS HTTP 400 |
| usgs:seismic | ok | siteClass D (fixed in PR #197) |
| tceq:edwards-aquifer | **failed** | ContributingZone MapServer 404 |

**Gate conclusion:** Track 1 is almost entirely **surfacing + styling** (fixture DEM/flow/contours/3D). Track 2 is **new map wiring + adapter fixes** for layers that exist in code but fail upstream or were never exposed on `/gis-layer`.

---

## Screenshots

Visual verify harness: `hauska-brief-extension/scripts/map-visual-verify.html` (updated on PR #3).

Before/after capture was attempted via local `npx serve` on port 8765; the Cursor browser MCP could not reach localhost from its sandbox (`chrome-error://chromewebdata/`). Operator can capture locally:

```powershell
cd P:\hauska-brief-extension
npx serve -p 8765 .
# open http://localhost:8765/scripts/map-visual-verify.html
```

Expected after state: dark Carto basemap, cyan FEMA band, saturated parcel choropleth, fire rent-heat, hillshade relief under mesh, blue animated flow lines, 5 m contours, 3D parcel extrusions at default pitch.

Reference screenshot on file (pre-track, v0.6.25 baseline): `_inbox/2026-06-19_hauska-map-v0625-dataviz-levelup.png` (operator capture).

---

## Part E — row-by-row status after this work

### Base, terrain and hydrology

| Data | Status after work | Notes |
|---|---|---|
| Carto dark basemap | **LIVE** | saturation/contrast pass in Track 1 |
| DEM terrain (hillshade) | **FIX** | fixture hillshade LIVE on map; live DEM on engine-api, not yet tiled into extension |
| Contours (5 m) | **FIX** | fixture contours LIVE; engine topography geojson available via assemble |
| Slope | **FIX** | derived in fixture DEM grid; no dedicated layer toggle yet |
| Hydrology D8 flow | **FIX** | animated fixture flow LIVE; engine computes D8 but no map geojson seam verified |
| FEMA flood zone | **LIVE** | unchanged |
| Floodway | **LIVE** | unchanged |
| Buildable envelope | **FIX** | fixture composite LIVE + backend `composite-layer` endpoint (PR #197) |

### Parcel, zoning and regulatory overlays

| Data | Status after work | Notes |
|---|---|---|
| Parcel mesh | **FIX** | unchanged Cotality quota gate |
| Zoning/land-use | **FIX** | unchanged Cotality gate |
| Allowed-height envelope (3D) | **FIX** | fill-extrusion LIVE on fixture mesh |
| Opportunity Zones | **LIVE** | unchanged |
| MUD/PID districts | **FIX** | backend bbox layer + fixture pending live deploy |
| Edwards Aquifer | **FIX** | backend bbox layer + adapter URL fix |
| ETJ / jurisdiction | **still-gated** | Cotality RiskMeter + AGOL backlog |
| Constraint density | **FIX** | fixture heat + backend composite endpoint |

### Investor / valuation (Cotality-gated)

| Data | Status after work | Notes |
|---|---|---|
| Rent AVM heat | **FIX** | fixture fire surface LIVE; real still gated |
| Sale AVM | **still-gated** | no map layer |
| Yield / cap-rate | **still-gated** | composite not built |
| Propensity-to-sell | **GATE** | Cotality prod |
| Absentee owner | **still-gated** | brief only |
| Comps | **still-gated** | Cotality prod |
| Building permits | **BACKLOG** | unwired to map |
| Liens / equity | **still-gated** | brief only |
| HOA / No-HOA | **GATE** | adapter pending |
| Deal score | **FIX** | fixture via oz-deal cross-filter composite |
| Motivated-seller | **FIX** | fixture lead heat LIVE; lights up with Cotality prod |
| Rehab opportunity | **still-gated** | not built |

### Hazard, climate and subsurface

| Data | Status after work | Notes |
|---|---|---|
| Flood depth (return periods) | **GATE** | RiskMeter not subscribed |
| Wildfire / wind / hail / quake | **GATE** | RiskMeter |
| Climate AR6 trajectory | **GATE** | Cotality AR6 |
| Insurance cost | **still-gated** | composite not built |
| SSURGO soils | **FIX** | adapter fix + map choropleth layer; live upstream pending deploy verify |
| Geology / karst | **FIX** | adapter fix + layer wiring; Vs30 site-class fix |
| Groundwater (NWIS) | **FIX** | adapter fix + map overlay |
| O&G / minerals | **FIX** | Texas RRC public layer wired (bbox) |
| EJScreen | **BRIEF** | brief only, optional map deferred |

### Interaction and meta

| Element | Status after work | Notes |
|---|---|---|
| Research pins | **LIVE** | unchanged |
| Legend | **LIVE** | extended per new layer + fixture labels |
| Tooltips/click | **LIVE** | unchanged |
| Layer animation | **FIX** | smooth opacity transitions + flow animation |
| 3D camera | **FIX** | pitch/bearing + extrusion enabled |

---

## What shipped per track

### Track 1 — Visual ceiling (hauska-brief-extension PR #3)

- `gis-terrain.js` — fixture DEM grid, client hillshade, terrarium raster-dem, inline 5 m contours
- `gis-hydrology-flow.js` — glowing animated D8-style channels
- `gis-map-render.js` — terrain/contour/flow/extrusion upsert, 420 ms toggle transitions
- `gis-map-paint.js` — bloom heat ramp, extended stack order
- `site-map.js` — pitch 52° / bearing -18°, compass, new layer toggles
- `site-map.css` — bloom compositing on canvas
- `map-visual-verify.html` — ES module verify page

### Track 2 — Free federal layers (legacy-design-tools PR #197)

- `brokerageGisFederalLayers.ts` — SSURGO, groundwater, MUD/PID, Edwards, Texas RRC bbox GeoJSON
- Extended `brokerageGisLayers.ts` + `brokerageMapData.ts` layer enum
- Adapter fixes: SSURGO SDA, SGMC fields, NWIS params, seismic site-class, TCEQ URL fallback
- New `texas-rrc.ts` adapter

### Track 3 — Composites (legacy-design-tools PR #197 + extension fixtures)

- `brokerageGisCompositeLayers.ts` — buildable-envelope, constraint-density, oz-deal-crossfilter, motivated-seller
- `POST /api/brokerage/v1/map-data/composite-layer` + catalog GET
- Extension fixture slots + `gis-proxy-api.js` client for composite + federal bbox layers

---

## Tests run

```
legacy-design-tools/artifacts/api-server:
  brokerageGisFederalLayers.test.ts   9/9
  brokerageGisCompositeLayers.test.ts 4/4
  lib/adapters subsurfaceAdapters.test.ts 15/15

hauska-brief-extension:
  npm run build — pass
```

---

## Blocked / follow-up

1. **Deploy PR #197 to cortex-api canary** before live federal layers work in extension (fixture=1 works without deploy).
2. **Engine-api adapter fix deploy** (hauska-engine) required for live SSURGO/geology/groundwater brief + map upstream fills.
3. **Hydrology D8 map seam** — align extension with engine drainage geojson contract (engagement path works; direct `/v1/hydrology/drainage` body schema differs from naive probe).
4. **Cotality production keys** — rent heat, propensity, mesh, RiskMeter remain gated per `75l_cotality_data_stack_catalog.md`.
5. **Screenshots** — operator local capture from `map-visual-verify.html` (MCP browser cannot reach localhost).

---

## Cotality paths not touched

Rent-AVM real fill, propensity, comps, RiskMeter hazards, Spatial Tile live mesh quota path — unchanged and still gated on production entitlements.
