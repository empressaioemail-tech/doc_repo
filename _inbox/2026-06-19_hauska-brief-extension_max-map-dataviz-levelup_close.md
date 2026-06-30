---
date: 2026-06-19
agent: claude-code (doc_repo planner, ad-hoc map takeover)
repo: hauska-brief-extension
branch: extension/unified-signin-v067
version: 0.6.25
status: visual level-up shipped against fixture — dark dataviz basemap + full-coverage choropleth + rent-heat fire surface; live national data unchanged (still gated on production Cotality)
related: [75k_max_map_quality_direction, _decisions/2026-06-18_map_engine_maplibre_cotality_national]
---

# Max spatial map — dataviz visual level-up (v0.6.25)

Picks up `75k_max_map_quality_direction.md`. The map rendered (v0.6.24) but read as a muted utility GIS panel: light basemap, a handful of pale fixture parcels, rent-heat "pending". This pass closes the visual gap against the Carto dataviz bar, working entirely against the fixture so no live-data dependency was touched. Engine and source stay settled (MapLibre + Cotality national); nothing about the live data path or the engine was re-litigated.

## What changed (the visual gap, closed)

Dark editorial basemap. Swapped the Carto `light_all` raster for `dark_all`, darkened and warm-tinted toward the brown signature over a deep warm-dark canvas (`#16110c`). The basemap now recedes so the data glows on top, which is the single biggest "utility to dataviz" lever. The light basemap was explicitly named as part of the gap in the direction doc.

Full-coverage saturated choropleth. The fixture was 13 loose parcels in a sparse grid. It is now a gapless tessellated mesh of 192 parcels (16 by 12) with realistic land-use zoning: a single-family fabric, an agricultural fringe, a commercial main-street corridor, multi-family nodes flanking it, a downtown mixed-use core, and an industrial pocket. The land-use palette was re-tuned to luminous colors that read vividly on the dark canvas (green / lime / azure / orange / rust / violet), edge to edge.

Rent-heat fire surface. The highest-value layer in the north-star, previously "pending", is now built. A synthetic rent-AVM point field (one weighted point per parcel, deterministic so it renders identically every load, with a hot downtown core plus two premium nodes) drives a MapLibre heatmap layer with a fire ramp (transparent to indigo to magenta to orange to white). It is calibrated so cold parcels contribute near-zero density and stay transparent, letting the choropleth read underneath, while premium cores genuinely glow. This is the layered composition the direction asked for, not a flat veil. The `rent-heat` filter moved from a pending reasoning overlay to a live GIS layer, default-on.

FEMA recolored cool. Flood overlays shifted from purple to translucent cyan/blue so they read as water against the warm land-use and fire palette.

Polish. Dark-glass float legend with a rent-heat gradient key and glowing swatches, dark-themed map controls and attribution, refined parcel strokes.

## Visual proof

![Dark dataviz basemap + full-coverage choropleth + rent-heat fire surface](2026-06-19_hauska-map-v0625-dataviz-levelup.png)

Headless-rendered (Chrome, SwiftShader WebGL) from `scripts/map-visual-verify.html`, which mirrors the production `gis-map-paint.js` and `gis-fixture-data.js` logic. Carto dark tiles return HTTP 200; the choropleth, fire surface, and land-use clustering are all the production expressions. The live extension additionally carries the dark-glass legend, tooltip, confidence pins, and toolbar (not shown in the bare harness).

## Files changed

| Area | Path |
|------|------|
| Basemap style + palette + fire ramp + heatmap paint | `src/lib/gis-map-paint.js` |
| Dense mesh + rent point field | `src/lib/gis-fixture-data.js` |
| Heatmap render branch + layer reorder + legend | `src/lib/gis-map-render.js` |
| Rent-heat filter to GIS group, default-on, label | `src/lib/site-map.js` |
| Canvas constant (warm-dark) | `src/lib/hauska-map-style.js` |
| Dark-glass legend, gradient key, dark controls | `styles/site-map.css` |
| Visual verify harness (mirrors new look) | `scripts/map-visual-verify.html` |
| Version bump | `manifest.json`, `package.json` |

## Build / load

```powershell
cd P:\hauska-brief-extension
npm run build
# Chrome → Extensions → Load unpacked → P:\hauska-brief-extension → Reload after pull
```

Build is clean; `research/research-bundle.js` regenerated with all changes.

## QA checklist (live extension)

1. Open Deep Research on a Max workspace, click the Map tab.
2. Basemap is dark and editorial; streets recede beneath the data.
3. Land-use choropleth fills the viewport edge to edge in saturated color (192 fixture parcels).
4. Rent-heat fire surface glows over the downtown core, fading to transparent so the choropleth shows around it.
5. Float legend is dark glass with a rent-heat gradient key.
6. Toggle layers (Land use, Rent heat, FEMA) on and off; each shows/hides cleanly.

## What is still gated (not in scope here)

The live national data path is unchanged. The dense mesh and rent surface are fixture-driven; live national parcels and the real rent-AVM heat swap in automatically through `resolveGisSlots()` once production Cotality Property + Spatial Tile keys + display license land (demo tier is 100 req/day and expires ~2026-07-06, so live national cannot be QA'd now). The production-key sync remains the operator dependency tracked in `75k_max_map_quality_direction.md` and the Cotality production scope.

## Note for the fleet

This was authored directly in `hauska-brief-extension` on the shared `extension/unified-signin-v067` branch, which already carries other agents' uncommitted work (billing-api, research-dock, gis-proxy-api, probe scripts). I did not commit; the map changes are staged in the working tree for the extension agent to fold into the branch's normal commit flow. Nothing in the live-data or auth paths was touched.
