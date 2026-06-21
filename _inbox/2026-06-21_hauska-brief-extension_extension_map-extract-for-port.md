# Wave 1 close — extension map extract for localhost port

**Agent:** extension agent (Calibrated Spine)  
**Date:** 2026-06-21  
**Program:** [`00_overview.md`](../_calibrated_spine_roadmap/00_overview.md) · End-state C Wave 1  
**Task:** Extract and document the brief-extension map so the map agent can port it to a standalone localhost shell.

---

## Deliverables

| Artifact | Location |
|---|---|
| Portable baseline (module refs + contracts) | [`hauska-brief-extension/docs/map-port-baseline.md`](../../hauska-brief-extension/docs/map-port-baseline.md) |
| Fixture-only localhost verify page | [`hauska-brief-extension/scripts/map-visual-verify.html`](../../hauska-brief-extension/scripts/map-visual-verify.html) |
| Source modules (in-place, not copied) | See § Module index below |

---

## Renderer and layer inventory

### Renderer

- **Engine:** MapLibre GL 5.x (`maplibre-gl` in `package.json`; bundled into `research/research-bundle.js` ~1.7 MB).
- **Basemap:** Carto `dark_all` raster tiles, warm-hue-rotated over `#16110c` canvas — `HAUSKA_GIS_BASE_STYLE` in `src/lib/gis-map-paint.js`.
- **Worker:** CSP worker at `vendor/maplibre-gl-csp-worker.js`; registered in `site-map.js` → `configureMapWorker()`.
- **Default view:** zoom 16, pitch 0 (2D-only; 3D terrain tilt explicitly deferred).
- **Stack manager:** `upsertGisLayer`, `upsertVisualCeilingLayer`, `reorderGisLayers` in `src/lib/gis-map-render.js`.

### Active layer set (what actually renders in Deep Research today)

**On by default** (`renderSiteMap` → `activeFilters`):

| Layer | layerKey | Draw type | Fetch / source |
|---|---|---|---|
| Land use / parcel choropleth | `parcel-polygon` | fill + line (data-driven land-use colors) | Live: `POST …/gis-layer { layer: "parcels" }` pin-intersect. Viewport mesh when bbox supported. Fixture fallback. |
| FEMA flood | `flood-zone` | fill + line (zone-coded) | Live: `{ layer: "fema" }`. Fixture NFHL-shaped polygons on fallback. |
| Rent heat | `rent-heat` | heatmap glow | Fixture point weights; live when parcel mesh carries rent attrs. |
| Hillshade relief | `dem-hillshade` | image raster under choropleth | **Client-only fixture DEM** (`gis-terrain.js`); not fetched from proxy. |
| 5 m contours | `topography-contours` | line | **Client-only** from same fixture DEM grid. |
| Hydrology flow (D8-shaped) | `hydrology-flow` | 3-layer line glow | **Fixture GeoJSON** in fallback bundle; static lines (dash animation removed — MapLibre LineAtlas crash). |
| Researched properties | — | DOM markers | `GET …/workspaces/recent` + geocode; not a GIS layer. |

**Registered, toggleable, partially live:**

- **Buildable envelope, constraint density, OZ×deal, motivated seller** — composite layers via `POST …/composite-layer` in viewport mesh; fixture-first on backend.
- **Federal bbox layers** (SSURGO, groundwater, MUD/PID, Edwards Aquifer, Texas RRC) — in viewport loader when bbox mesh enabled; filter UI marked **pending**.
- **ETJ** — proxy id mapped; filter **pending**.
- **Reasoning pins** (ADU, no-HOA, OZ verdict, FEMA notes, etc.) — from `POST …/map-data` → `reasoningOverlays[]`; filtered by overlay kind, not drawn as polygons.

**In stack but not rendered:**

- **`parcel-extrusion`** — paint + upsert exist; `applyFilters` skips with comment "deferred to next-pass."
- **`zoning`** as separate slot — shares paint with `parcel-polygon`; live pin-intersect returns parcels with assessor land-use attrs, not municipal zoning districts.

Full layerKey list and paint tokens: `GIS_LAYER_STACK` + `LAYER_PAINT` in `src/lib/gis-map-paint.js`. Filter definitions: `FILTER_DEFS` in `src/lib/site-map.js`.

---

## EngineEnvelope consumption shape (today)

The extension does **not** implement the F4 read-contract (no `n`, no interval width, no three-axis object). It consumes a **legacy/normalized envelope** per GIS slot:

```js
// Normalized in gis-proxy-api.js :: envelopeFromJson()
{
  payload: { geojson | geometry | demFixture },
  source: { provider, adapterKey, adapter? },
  dataVintage: string | { label, asOf, acquiredAt },
  confidence: { value: number, kind: "asserted"|"calibrated"|"deterministic", source? },
  coverage: { degraded?: boolean, reason?: string },
}
```

**Where it surfaces:**

| Surface | Module | Fields used |
|---|---|---|
| Layer legend meta | `site-map.js` → `buildLayerLegend` | `confidence.kind`, `dataVintage`, `source.provider`, fixture tag |
| Parcel / layer detail panel | `selectionFromParcelFeature`, `selectionFromSlot` | full `envelope`, `confidence`, `dataVintage` as `<time>` |
| Confidence meter HTML | `envelope-confidence.js` → `confidenceAssertedHtml` | `value`, `kind`; provenance line from `source` + `dataVintage` + `coverage.degraded` |
| Pin ring opacity | `site-map.js` → `confidenceValue` | scalar `value` only → CSS `--confidence` |
| Brief headline (non-map) | same module | `extractEnvelope` / `extractConfidence` from brief root |

**Honesty rules already enforced (pre-F4):**

- Asserted kind: meter shown, **no bare percentage** unless kind is calibrated (and capped at 99%).
- Deterministic: kind label only, no meter.
- Web-scraped / degraded coverage banners via `extractBriefCoverage` (brief-level, not map fill).

Backend may still emit `envelope.honesty.*`; proxy normalizer aliases those into the flat shape above.

---

## Data flow and auth

```
Deep Research tab (research-app.js)
  renderSiteMapSection(brief)
    → resolveBriefCoords
    → resolveGisSlots(settings, coords)     // gis-proxy-api.js
    → fetchMapData(settings, mapDataRequestFromBrief)  // map-data-api.js
    → renderSiteMap({ gisSlots, mapData, reasoningOverlays })
         → MapLibre init (site-map.js)
         → applyFilters → gis-map-render.js
         → viewport pan/zoom → createGisViewportLoader (bbox mesh)
```

### `/api/brokerage/v1/*` endpoints

| Endpoint | Body / params | Returns (map-relevant) |
|---|---|---|
| `POST /map-data` | lat/lng, address, parcelKey, jurisdiction, `contextLayers` from brief | `mapData.place`, `reasoningOverlays[]`, `honesty`, tier |
| `POST /map-data/gis-layer` | `{ layer, latitude, longitude, bbox?, zoom? }` | GeoJSON + envelope fields (or flat `confidence`, `acquiredAt`) |
| `POST /map-data/composite-layer` | `{ layer, bbox, fixture? }` | Composite GeoJSON + envelope |
| `GET /map-data/gis-layers` | — | Catalog (not wired in UI) |
| `GET /entitlement` | — | Max gate |
| `GET /workspaces/recent` | `limit` | Researched-property pin list |

Base URL: `settings.briefApiUrl` (prod default in `install-defaults.js`). Path helper: `brokeragePath(settings, suffix)` → `{base}/api/brokerage/v1{suffix}`.

### Auth headers (every map-data call)

From `brokerage-api.js` → `apiAuthHeaders()` plus GIS override:

```
Content-Type: application/json
X-Hauska-Install-Id: <install id>          // getMapDataInstallId() for Max QA install override
X-Hauska-Key: <brokerage public or user key>
Authorization: Bearer <session JWT if signed in, else brokerage key>
```

Both `X-Hauska-Key` and Bearer are required for brokerage routes; session JWT alone is rejected. Tier gate: Max (`403 tier_required` → upgrade shell in UI).

### Live vs fixture fallback

`resolveGisSlots`: tries live pin-intersect parcels → probes bbox support → on failure returns `getGisFixtureSlots(coords)` (11 synthetic slots including terrain, flow, FEMA, parcel mesh, composites, rent heat). Fixture flag drives bloom CSS class on canvas.

---

## Map state (extension-held)

| State | Where | Notes |
|---|---|---|
| Center / zoom | MapLibre instance | Re-fit on load via `fitToSlots`; not persisted across sessions |
| Active filters | `Set` in render state | Default set hard-coded; not synced to storage |
| GIS slots | `state.gisSlots` | Merged on viewport pan via `mergeGisSlots` |
| Property binding | `mapSectionKey` = `workspace\|address\|lat,lng` | Prevents duplicate fetch; coords from brief geocode |
| Shell mode | `data-expanded`, `data-mode` | docked vs fullscreen; not preserved across brief navigation |
| Brief coords | `opts.briefCoords` | Pin-intersect anchor + viewport loader center |
| Chat context snapshot | `getMapChatContext()` | Exported for area-aware research chat |
| Fetch generation | `mapFetchGen` | Cancels stale async renders |

No registry-driven layer allocation; filters are a static `FILTER_DEFS` table in `site-map.js`.

---

## Module index (extracted references)

| Module | Path | Port priority |
|---|---|---|
| Renderer upsert / stack | `src/lib/gis-map-render.js` | **Required** |
| Style + paints + stack order | `src/lib/gis-map-paint.js` | **Required** |
| Fixture DEM / hillshade / contours | `src/lib/gis-terrain.js` | Required for ceiling layers |
| Hydrology flow lines | `src/lib/gis-hydrology-flow.js` | Required for D8 layer |
| Fixture slot factory | `src/lib/gis-fixture-data.js` | Required for offline shell |
| GIS fetch + slot normalize | `src/lib/gis-proxy-api.js` | Required for live shell |
| Map-data + reasoning overlays | `src/lib/map-data-api.js` | Required for pins |
| Auth + path helpers | `src/lib/brokerage-api.js` | Required for live shell |
| Envelope / confidence UI | `src/lib/envelope-confidence.js` | Required for honesty UI |
| Brief shell (coupled) | `src/lib/site-map.js` | Reference only — decouple for V1 |
| Integration entry | `src/research/research-app.js` → `renderSiteMapSection` | Reference for data orchestration |
| Standalone verify | `scripts/map-visual-verify.html` | **Start here for localhost** |
| Styles | `styles/site-map.css`, `styles/maplibre-gl.css` | Shell chrome |

---

## Reconciliation with `03_gap_analysis.md`

| Gap row claim | Live verification (2026-06-21) | Aligns? |
|---|---|---|
| V map: "Map exists (EngineEnvelope, FEMA live, D8 fixture-rendered, flood/parcel/zoning, Carto track)" | Confirmed. Carto dark basemap; live FEMA + Cotality parcels via proxy when healthy; D8 flow is **fixture-only** on client. | **Yes** |
| "floating viewer and decoupled renderer is Chris's new design" | Confirmed. Map uses Brief pull-tab shell (`hp-spatial`); renderer init is inline in `site-map.js`, not a mount-slot contract. Fullscreen is CSS body class, not an FSM. | **Yes** |
| "registry and per-app allocation absent" | Confirmed. Static `FILTER_DEFS`; no dynamic registry or entitlement-driven allocation. | **Yes** |
| "reasoning layers absent" | **Partial mismatch.** Reasoning **overlays as pins** exist (`reasoningOverlays` from `/map-data`). End-state **choropleth reasoning layers** (consequence, contested-ground, triage, width-as-saturation) are absent. | **Partial** |
| F4: "Confidence is a scalar; EngineEnvelope carries confidence plus kind, not n + width + provenance as one object" | **Confirmed in extension.** Normalizer reads scalar `{ value, kind }`; no width field consumed anywhere in map paint. | **Yes** |
| F6: "severity axis absent" | Confirmed — not referenced in map code. | **Yes** |

**Net:** Gap analysis V-row and F4-row remain accurate. Extension has more layers than the gap summary lists (terrain ceiling, composites, federal pending set), but none of the End-state C honesty rendering (V4–V8) is implemented yet.

---

## Proposed Wave 2 — extension F4 read-contract migration

**Task ID:** F4 propagation (extension slice) · aligns with roadmap F4 + map V4  
**Owner:** extension agent (after F0 verify + cc-agent-AC contract type lands)

### Scope

1. **Replace envelope normalizer** (`gis-proxy-api.js` → `envelopeFromJson`) to accept the inseparable read-contract object (`confidence`, `n`, `width`, `provenance`, axes) with no scalar accessor fallback.
2. **Upgrade map honesty UI** (`envelope-confidence.js`, `site-map.js` detail + legend + pin rings) to:
   - encode interval **width as fill saturation** on choropleth layers (V5),
   - refuse dishonest scalar-only fills when width is missing,
   - show calibration-provenance field when present (K6).
3. **Thread read-contract through selection objects** (`selectionFromParcelFeature`, `selectionFromSlot`, overlay pins) for click-through to atoms (operator surface prep).
4. **Add contract unit tests** against fixture slots + recorded `/gis-layer` responses once F0 confirms live shape.

### Out of scope for extension Wave 2

- Layer registry / per-app allocation (V3 — map agent).
- Contested-ground overlay logic (needs F5 raw-conflict log + backend disagreement signal).
- Fuel-gated calibrated-accuracy choropleth (V6 — blocked on M1).

### Blockers (name explicitly)

| Blocker | Why |
|---|---|
| **F0 verify-first** | Gap analysis is ~2 weeks stale; live `EngineEnvelope` / GIS response field set must be re-checked on main before migration. |
| **F4 contract type (cc-agent-AC)** | Extension cannot migrate until the read-contract TypeScript/schema is locked and emitted by cortex-api `/map-data/*` endpoints. |
| **Backend envelope emission** | `cc-agent-C` / engine must stop emitting scalar-only confidence on GIS layers; extension normalizer is defensive today precisely because backend shape is mixed (`confidence` vs `envelope.honesty`). |
| **V1 decoupled renderer (map agent)** | F4 map paint changes should land on the portable renderer module, not deepen coupling in `site-map.js` shell. Coordinate merge order with map agent Wave 1 shell. |
| **No width in live payloads yet** | Saturation encoding is un-testable until backend ships width; fixture slots need contract-shaped fixtures added in parallel. |

### Suggested dispatch order

1. Map agent completes V1 localhost shell using this baseline (can proceed now with fixture + legacy envelope).
2. F0 close records live envelope shape → extension updates normalizer typings.
3. cc-agent-AC + cc-agent-C ship F4 on `/map-data/gis-layer` → extension Wave 2 lands honesty UI + saturation paint.
4. Map agent V4 consumes same contract in decoupled renderer (single source of truth in shared module or copied contract types).

---

## Acceptance (Wave 1)

- [x] Renderer, basemap, and stack order documented with module paths
- [x] Full active + registered layer inventory with fetch paths
- [x] EngineEnvelope consumption shape documented as-implemented
- [x] Data flow from `/api/brokerage/v1/*` with auth headers
- [x] Map state inventory (center, zoom, filters, property binding)
- [x] Portable baseline doc + localhost verify entry point linked
- [x] Gap analysis reconciliation + Wave 2 F4 proposal with blockers

**Map agent next step:** Stand up localhost shell from `scripts/map-visual-verify.html` + `docs/map-port-baseline.md`; import renderer modules without `site-map.js` shell until V1 contract is defined.
