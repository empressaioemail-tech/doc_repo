# cc-agent-M — SmartCity OS map scoping probe (mirrored)

**Date:** 2026-06-18  
**Agent:** cc-agent-M (Cursor) — mirrored into doc_repo by planner (M has no doc_repo access)  
**Repo probed:** `empressaioemail-tech/smartcity-os` (read-only recon, no changes)  
**Target consumer:** Hauska investor deal radar (MapLibre-based)  
**Related:** [`_decisions/2026-06-17_map_extraction_shared_capability`](../_decisions/2026-06-17_map_extraction_shared_capability.md), [`80_adrs/adr_022_deal_twin_and_cross_application_capture`](../80_adrs/adr_022_deal_twin_and_cross_application_capture.md)

## Verdict

SmartCity uses **Leaflet + react-leaflet 5.0.0 + Esri ArcGIS raster basemap tiles**, NOT MapLibre and NOT vector tiles. The ~56 GIS layers are fetched as **bbox-scoped GeoJSON** via a Cloud Run proxy (`server/routes/esri.ts`) that queries ArcGIS FeatureServer REST endpoints. The map engine is **NOT cleanly extractable** as a shared component: the renderer is Leaflet-bound, and layer orchestration + styling live inside a ~5,700-line dashboard page (`DevelopmentServicesDashboard.tsx`), Bastrop-locked (hardcoded center, tenant id 2, field names, URLs). Confirms the operator's prior ("island"). Build a new MapLibre renderer; lift the styling + catalog + URL registry.

## Liftable assets (transfer directly to a Hauska MapLibre map)

**Layer catalog (high):** `client/src/components/maps/layerCatalog.ts` — 56 layer defs across 7 categories + 10 view templates + helpers. Display metadata only; URLs live server-side.

**Basemap URLs + MapLayer interface (high):** `client/src/components/maps/types.ts`. Esri public raster tiles (no client key): World_Street_Map, World_Imagery, World_Topo_Map, Canvas/World_Dark_Gray_Base. Backend also exposes `/api/esri/basemap-styles` with Esri **vector** style URLs (MapLibre-compatible) — not used by the frontend today, but relevant for our vector look.

**Styling palettes (extract from dashboard pages — currently duplicated inline):**
- Zoning `ZONING_COLORS`: P-5 Core `#9333ea`, P-4 Mix `#3b82f6`, P-2 Rural `#22c55e`, etc.
- FEMA flood `FEMA_ZONE_COLORS` (key = `FLD_ZONE`+`ZONE_SUBTY`): AE floodway `#7b2d8e`, AE `#9b7bc7`, X_500 `#e8c84a`, etc.
- Future land use `FLU_COLORS`: SFR `#22c55e`, COMMERCIAL `#f97316`, etc.
- PCI ramp (green ≥80 → red <40); 15-color subdivision palette; parcel one-click by PlaceTypeDesc.

**Backend ArcGIS URL registry:** `server/routes/esri.ts` → `BASTROP_LAYER_REGISTRY` (47 layers). Key source URLs for the deal radar:

| Layer | ArcGIS FeatureServer URL |
|---|---|
| FEMA flood (SFHA) | `services7.arcgis.com/qOeXJdBtGknaCJC4/.../FEMA_SFHA/FeatureServer/10` |
| Zoning (Place Types) | `.../PlaceTypesCharacterDistricts/FeatureServer/1` |
| ETJ | `.../City_Limit_and_ETJ_Map_WFL1/FeatureServer/6` |
| City limits | `.../City_Limit_and_ETJ_Map_WFL1/FeatureServer/5` |
| Parcels (CAD) | `services3.arcgis.com/wdTkTU0MdZbNBEZy/.../BCAD_Parcels/FeatureServer/0` |
| Parcels one-click | `.../Parcels_One_Click/FeatureServer/23` |

City of Bastrop org `qOeXJdBtGknaCJC4`; Bastrop County/CAD org `wdTkTU0MdZbNBEZy`.

## Constraints (do NOT reuse as-is)

- **SmartCity's `/api/esri/*` proxy is session-locked + tenant-2-hardcoded** — not reusable cross-app. Hauska needs its OWN backend proxy to ArcGIS (CORS blocks direct browser FeatureServer calls).
- **Bastrop-locked:** URLs, center `[30.1102, -97.3153]`, tenant id, field names (`PlaceTypeClass`, `FLD_ZONE`) are Bastrop-specific. Multi-market (Austin metro) needs each jurisdiction's ArcGIS endpoints. FEMA flood is national-ish; zoning/parcels are per-county.
- **No vector tiles / no self-hosted tiles** — everything is bbox GeoJSON (200-500 features/request). Fine for a Bastrop/Austin POC; may not scale to multi-market without graduating to vector tiles / PMTiles.

## Reuse strategy (M's recommendation)

1. Copy `layerCatalog.ts` + extract style functions into a shared package (`packages/gis-styles`, `packages/gis-catalog`).
2. Fork the `BASTROP_LAYER_REGISTRY` URL table (or call ArcGIS from a Hauska backend proxy).
3. Do NOT depend on SmartCity's Cloud Run API from Hauska prod without an explicit cross-service auth design.
4. Build a NEW MapLibre renderer — the `MapLayer` contract (data, styleFunction, tooltipFunction, visible) maps cleanly to MapLibre geojson sources + fill/line layers with data-driven paint.
5. For scale, consider Esri vector tiles or PMTiles (SmartCity does not do this today).

**Extraction targets (if proceeding):** P0 `gis-styles` (palettes) + `gis-catalog` (catalog + URL mirror), low effort; P1 `gis-proxy` (fork esri.ts) + `useGisLayers()` hook, medium; P2 MapLibre `HauskaMap` renderer, high.

Probe completed read-only; no code changes.
