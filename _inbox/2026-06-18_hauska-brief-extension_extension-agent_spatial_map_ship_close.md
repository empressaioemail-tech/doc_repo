# Hauska MAX Spatial Map — ship report

**Date:** 2026-06-18  
**Surface:** Deep Research tab (`research/research.html`)  
**Engine:** MapLibre GL 5.x (bundled in `research-bundle.js`)

## Live now

| Capability | Status |
|---|---|
| MapLibre GL renderer | **Live** — replaces SVG `site-map.js` |
| Hauska editorial dark basemap | **Live** — Carto dark raster, desaturated to Edition 02 night palette (`hauska-map-style.js`) |
| Vertical **Map** pull-tab | **Live** — 40px edge tab; click expands side-by-side with brief/chat |
| Layers & filters panel | **Live** — visible only when expanded |
| `POST /map-data` GIS polygons | **Live** — parcel, FEMA flood/floodway, OZ tract, zoning, DEM/topography from existing BFF |
| Cited reasoning pins | **Live** — confidence-ring DOM markers; click → detail strip (source + vintage) |
| Parcel polygon click | **Live** — queryRenderedFeatures → layer provenance panel |
| My researched properties | **Live** — `fetchRecentWorkspaces` + geocode fallback; private pins (deal/keep/pass tier colors) |
| Max tier gate | **Live** — free/public/Pro get pull-tab + upgrade CTA; server 403 `tier_required` respected |
| Max checkout wire | **Live (client)** — `startMaxCheckout()` → `POST /billing/checkout { tier: "max" }` |
| Filter toggles + legend provenance | **Live** — OZ, zoning, FEMA, researched on by default; ADU/HOA/rent/sell toggles filter reasoning pins |

## Pending (blocked on data / cc-agent-C)

| Dependency | Extension behavior |
|---|---|
| GIS proxy ETJ layer | Filter labeled **pending**; auto-enables when `layerKey: "etj"` arrives in `mapData.layers[]` |
| Zoning subcode paint (P-5/P-4/P-2) | Palette defined in `GIS_LAYER_PAINT`; needs subcode properties on GIS features from proxy |
| FEMA subcode paint (AE-floodway/AE/X_500) | Palette defined; needs feature properties from proxy |
| Area-wide for-sale listings feed | **Stub only** — "View listings in filters" toggle disabled, labeled pending; no fake pins |
| Tier-aware Max checkout (server) | Client sends `tier: "max"`; graceful message if API not ready |
| `profile-api` per-property coords | Uses workspace list + geocode; dedicated profile map endpoint not required yet |

## Build size impact (MapLibre)

| Asset | Size |
|---|---|
| `research/research-bundle.js` (prior HEAD) | ~142 KB |
| `research/research-bundle.js` (with MapLibre) | **~1,745 KB** (+~1.60 MB) |
| `vendor/maplibre-gl-csp-worker.js` | ~447 KB (web_accessible) |
| `styles/maplibre-gl.css` | ~68 KB |
| **Total new runtime weight** | **~2.1 MB** (bundle + worker + CSS) |

## Files touched

- `src/lib/site-map.js` — MapLibre spatial map (elevated)
- `src/lib/hauska-map-style.js` — basemap + GIS palettes
- `styles/site-map.css` — pull-tab shell, pins, filters
- `styles/maplibre-gl.css` — copied at build
- `vendor/maplibre-gl-csp-worker.js` — copied at build
- `src/research/research-app.js` — layout integration, researched properties, Max checkout
- `research/research.html` — side-by-side layout shell
- `research/research.css` — brief pane + spatial shell flex
- `src/lib/billing-api.js` — `startMaxCheckout()`
- `scripts/build.mjs` — MapLibre asset copy
- `manifest.json` — worker web_accessible_resource
- `package.json` — `maplibre-gl` dependency

## Operator review

1. Load extension → open Deep Research on a geocoded property.
2. Click **Map** tab on right edge → map expands beside chat.
3. Toggle layers; click pins / parcel polygon → cited reasoning panel.
4. Non-Max account → tab shows upgrade gate with **Upgrade to Max** button.

Rebuild: `npm run build` (required after source edits; research bundle is IIFE output).
