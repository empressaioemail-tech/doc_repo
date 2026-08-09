---
id: 75k_max_map_quality_direction
title: Max spatial map — quality direction + fresh-agent handoff
status: superseded
last_updated: 2026-08-09
applies_to: portfolio
owner: nick
related: [75i_investor_radar_prelaunch_sprint, _decisions/2026-06-18_map_engine_maplibre_cotality_national, _decisions/2026-06-17_map_extraction_shared_capability, 80_adrs/adr_022_deal_twin_and_cross_application_capture]
---

# Max spatial map — quality direction + handoff

> **SUPERSEDED 2026-08-09.** Status flipped from active. This handoff describes the Cotality/extension map surface (extension v0.6.24), and Cotality was extinguished 2026-07-13; live code hitting Cotality is a wrong-routing defect, never a credential to rotate, and Regrid is dead as well. Every build-status and gating statement below is therefore stale, and the buildable-now versus Cotality-gated split no longer describes any live path. The current disposition of the parked map layers is in `90_operations/QUEUE_parked_work_index.md` (W3 RRC and W4 MUD both HELD; treat as greenfield). The quality bar and visual north-star sections remain useful as direction; nothing here is a status claim.

Handoff doc for a fresh agent to regroup on the Max map. The map now *renders* but is a mile below the dataviz quality bar the operator wants. This captures the current state, the north-star, the gap, and the split between what's buildable now versus what's gated on data.

## The quality bar (north-star)

Reference: **Carto, 2023's best maps and dataviz** — https://carto.com/blog/2023-best-maps-dataviz/. The map should feel like award-winning **dataviz**, not a utility GIS viewer. The operator's reference set, by quality:
- A **rent-heat choropleth** — a smooth, saturated fire-palette surface over the city showing where value concentrates.
- A **fully saturated, full-coverage zoning map** — every parcel filled with vivid, legible land-use color, edge to edge (the SmartCity-Bastrop density), not a few pale fills.
- A **dot-density dataviz** — glowing, dark-canvas, data-rich, beautiful at a glance.

The throughline: saturation, full coverage, layered surfaces, a refined palette, and polish (smooth transitions, a legible legend, instantly readable). It should look like something you'd screenshot for a pitch.

## Current state (v0.6.24)

Rendering is fixed and real (the blank-canvas root cause — MapLibre under the MV3 CSP — is resolved):
- Carto raster basemap (streets/labels) on the deep-brown canvas.
- Land-use choropleth parcels, FEMA flood overlay, geocoded pins (lazy-init fix so they place on real coords).
- The layers/filters panel (My researched properties, ADU-eligible, No HOA, ETJ, Opportunity Zones, Likely-to-sell, Rent heat, Land use, FEMA), a provenance legend, the dock + small Map tab + resize.

But it's muted and sparse: a light utility basemap, a handful of pale fixture parcels, "pending" on the high-value layers (rent heat, likely-to-sell). It reads as a functional GIS panel, not dataviz. That's the gap to close.

## The gap, split two ways

**1. Visual/styling level-up — buildable NOW (against the fixture, no data dependency).** This is where the fresh agent should focus first:
- Palette + saturation: vivid, cohesive land-use colors; a real fire-palette **rent-heat surface**; saturated full-coverage fills, not pale rectangles.
- Layered surfaces and depth (the dot-density / heat treatments from the Carto set), smooth zoom/pan transitions, a beautiful legend.
- The dataviz feel — study the Carto examples and match that production quality on the styling the extension controls (`hauska-map-style.js`, `gis-map-paint.js`).

**2. Data — gated on production Cotality (operator).** The national full parcel mesh + the rent-AVM heat surface need real data:
- The Cotality **demo tier is 100 requests/day** (exhausted; 429), expires **~2026-07-06**. It cannot support, QA, or demo the live map.
- Production **Cotality Property + Spatial Tile keys + display license** (synced to `legacy-design-tools-prod` and `hauska-prod-497015`) are required for the national mesh + rent heat. Vendor: Cotality Data Implementation Services. Scope: `_inbox/2026-06-18_legacy-design-tools_cc-agent-C_cotality_production_quota_scope.md`.
- Interim: a client-side synthetic fixture + a server-side `?fixture=1` (one real-shape Bastrop capture pending the daily quota reset) let the styling be developed without live data.

## Direction for the fresh agent

Lead with the **visual quality** against the Carto bar, on the fixture — get the map to *look* like award-winning dataviz (saturation, the rent-heat surface, full-coverage fills, polish) before the live data lands. The national real data swaps in automatically via `resolveGisSlots()` once production Cotality is wired. Engine + source are settled: MapLibre + Cotality national geometry ([`_decisions/2026-06-18_map_engine_maplibre_cotality_national`](_decisions/2026-06-18_map_engine_maplibre_cotality_national.md)); do not re-litigate the engine or chase per-county GIS.

## Files

Extension (the render + style): `src/lib/site-map.js`, `gis-map-render.js`, `gis-map-paint.js`, `hauska-map-style.js`, `gis-proxy-api.js`, `gis-fixture-data.js`, `styles/site-map.css` (repo `empressaioemail-tech/hauska-brief-extension`). Backend (data): `/api/brokerage/v1/map-data/gis-layer` (+ `?fixture=1`), the Cotality adapters + zoning-enrich bridge in `legacy-design-tools`.
