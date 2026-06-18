---
id: 2026-06-18_map_engine_maplibre_cotality_national
title: Decision — the Max map is a fresh MapLibre renderer on Cotality national geometry (not SmartCity's engine, not per-county GIS)
date: 2026-06-18
status: active
owner: nick
kind: decision
related: [_decisions/2026-06-17_map_extraction_shared_capability, 80_adrs/adr_022_deal_twin_and_cross_application_capture, 75i_investor_radar_prelaunch_sprint]
---

# Decision: MapLibre + Cotality national for the Max map

## Decision

The investor radar's Max spatial map is built as a **fresh MapLibre GL renderer in the extension**, sourcing parcel geometry from **Cotality Spatial Tile (national vector polygons)**, attributes from Cotality Property (land use), and flood from the federal **FEMA NFHL** (no Cotality dependency). It does NOT extract SmartCity's map engine, and it does NOT source geometry from per-county ArcGIS.

Three sub-decisions:
1. **Engine: build fresh MapLibre, do not extract SmartCity.** SmartCity's map is Leaflet + Esri + per-county ArcGIS, tightly coupled to its dashboard (the "island," confirmed by cc-agent-M recon). Lift its styling palettes + layer catalog only.
2. **Geometry source: Cotality national, not per-county GIS.** Cotality Spatial Tile returns vector parcel polygons nationally (`/spatial-tile/parcels`, bbox + pageSize); ParcelPoint is 149M+ parcels. Per-county ArcGIS (Bastrop) was a SmartCity artifact, doesn't scale, and isn't even reachable from Cloud Run (`gis.bastropcountytx.gov` -> ENOTFOUND). Cotality is national, one provider, already licensed.
3. **Build in the extension first; extract to a Hauska package later.** Per the map-extraction decision the end state is a shared publishable render package, but build-in-place then extract when a second real consumer (Cortex/SmartCity/Mox) needs it. The GIS data/proxy half stays a spine capability (the map-data BFF + the `/gis-layer` Cotality retarget).

## Context

Operator QA rejected the design-agent map mockups and asked why we were on Bastrop per-county GIS when Cotality gives national coverage. Web research confirmed Cotality has the national parcel layer (ParcelPoint, 149M parcels) + 250+ per-parcel attributes (land use, ownership, tax). cc-agent-C recon confirmed Spatial Tile parcel geometry is vector (MapLibre-ready), and that the real failure was hauska-engine-api missing the `COTALITY_*` secrets (the CLIP resolution runs on the engine), not a Cotality limitation.

## Reasoning and implications

National from one provider we already pay for is the correct architecture for a national radar and is far better on the cost-per-jurisdiction commitment (no per-county GIS onboarding). The map gains the same national-base + optional-local-overlay model as the code layer: Cotality parcels everywhere; municipal zoning-district GIS is optional polish where reachable. Implemented live: engine `COTALITY_*` secrets mounted (`hauska-engine-api-00017-cuy`), `/gis-layer` retargeted to Cotality Spatial Tile + FEMA NFHL (`cortex-api-00235-sux`), bbox mesh verified at 500 features for Bastrop AND Austin.

Land-use vs zoning: Cotality Property carries land-use codes, not municipal zoning districts, so parcels color by land-use attribute nationally; true municipal zoning is optional local GIS.

## Constraints / open

- **G2 Cotality consumer-display license** gates the Cotality map on a public consumer surface (dev/test proceeds; public launch gated) — same gate as the rest of the Cotality stack.
- **Cotality production quota** — demo tier is quota-limited (429s) and expires ~July 6; production Property + Spatial Tile keys needed for a sustained Max cohort.
- **Zoning-color geocode bridge** (stdAddr -> CLIP -> site-location) is a follow-up.

## Reversal criteria

If Cotality production quota/licensing economics make the national map unviable, fall back to FEMA + the reasoning overlays nationally, with municipal GIS parcels only where a reachable public endpoint exists (the old per-county path, scoped to a few high-value markets). Do not re-extract SmartCity's engine.

## Status

Active. Live on prod (geometry quota-throttled until the Cotality demo quota cools / production keys land). Refines [`2026-06-17_map_extraction_shared_capability`](2026-06-17_map_extraction_shared_capability.md).
