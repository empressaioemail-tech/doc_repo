---
id: 2026-06-11_cc-agent-C_reproject_arcgis_parcel_geometry_to_wgs84
title: Dispatch — reproject ArcGIS/UGRC parcel geometry (Web Mercator) to WGS84 before topography bbox
date: 2026-06-11
agent: cc-agent-C
repo: legacy-design-tools
kind: dispatch
status: FIRE-READY — blocks topography ingest (and therefore the hydrology flip verify) on UGRC/non-Regrid parcels
related: [58_gtm_readiness_sprint, 61_property_intelligence_master_plan, _research/2026-06-11_engine_robustness_audit, _dispatches/2026-06-11_cc-agent-C_topography_ingest_into_generate_layers]
---

# Reproject ArcGIS/UGRC parcel geometry to WGS84 before the topography bbox

> The topography-into-generate-layers fold (#176) worked: topography now ingests as part of Generate Layers. It surfaced a downstream projection bug. On the Moab engagement `409a3013-273f-4871-b799-bc08def01cec`, the run shows `usgs:3dep-dem failed — bbox longitudes out of WGS84 range: -12193513.438655587, -12193473.565844413`. Those values are Web Mercator (EPSG:3857) meters (≈ -109.5°W = Moab), not WGS84 degrees. The UGRC parcel geometry comes back as ArcGIS `rings` in Web Mercator, and `extractParcelGeometryFromPayload` rewraps the rings to GeoJSON coordinates **without reprojecting and discarding `geometry.spatialReference`**, so `geometryToBboxWgs84` reads meters as degrees. Regrid worked only because it emits WGS84; with Regrid dropped for UGRC/Cotality, this is on the critical path (Cotality Spatial Tile parcels will hit it too).

You are **cc-agent-C**, single owner of `P:\legacy-design-tools`. Worktree off `origin/main`. Branch prefix `cortex/`. Model: Grok Build 0.1; escalate on failure after retry. HR-8 verbatim artifacts.

## Root cause

`extractParcelGeometryFromPayload` (`artifacts/api-server/src/lib/siteTopographyIngest.ts:348-356`): the ArcGIS-rings branch returns `{ type: "Polygon", coordinates: g.rings }` and drops `g.spatialReference` (the `wkid` is present in the payload but ignored). UGRC returns rings in Web Mercator (`wkid` 3857 or 102100), so the coordinates are meters. `geometryToBboxWgs84` (`:273`) treats `coords[0]/coords[1]` as lng/lat degrees with no reprojection. Result: out-of-WGS84-range bbox, topography ingest fails, and drainage stays blocked (drainage needs the catchment DEM).

## Fix

Make the parcel geometry WGS84 before the bbox is computed. Preferred: a **defensive reprojection at extraction**, so any Web-Mercator source (UGRC today, Cotality Spatial Tile parcels next) is handled:

1. In `extractParcelGeometryFromPayload`, read `geometry.spatialReference.wkid` on the ArcGIS-rings branch. If it indicates Web Mercator (`3857`, `102100`, or `900913`), reproject every ring coordinate from Web Mercator meters to WGS84 degrees (the standard inverse spherical Mercator transform: `lng = x / 20037508.34 * 180`; `lat = atan(exp(y / 20037508.34 * PI)) * 360/PI - 90`). If `wkid` is absent or already `4326`, pass through unchanged. (Optionally factor a small `webMercatorToWgs84` helper.)
2. **Belt-and-suspenders at the source:** confirm the UGRC parcels adapter query requests `outSR=4326` (the ArcGIS adapter at `lib/adapters/src/arcgis.ts:80` defaults `inSpatialReference` to 4326 but verify the UGRC parcels query sets `outSR`/`outputSpatialReference` to 4326 so freshly-fetched geometry is stored WGS84). Do not regress the Regrid GeoJSON path (already WGS84).
3. Guard `geometryToBboxWgs84`: if the resulting bbox is outside WGS84 range (|lng|>180 or |lat|>90), return null with a clear log rather than producing a garbage DEM request (defense in depth; the reprojection should prevent it).

## Acceptance

- Generate Layers on Moab `409a3013-...` produces `usgs:3dep-dem ok` (bbox in WGS84 range), with the catchment DEM ingested. Paste the verbatim run line.
- `Run drainage` then succeeds (no 422), reaching `POST /v1/hydrology/drainage` on engine-api (canary `ENGINE_SPINE_HYDROLOGY=1`). Paste the engine-api request line + the result `library` field (`pysheds` vs `native-d8`).
- Regrid (WGS84) and any already-4326 ArcGIS source still pass through unchanged (no double-reprojection). Add a unit test: a Web-Mercator ring set reprojects into WGS84 range; a 4326 ring set is unchanged.
- Typecheck + tests green; PR held for operator merge; HR-8 artifacts.

## Reporting

Write to `P:\doc_repo\_inbox\` as `2026-06-11_legacy-design-tools_cc-agent-C_reproject_parcel_geometry_fix.md`: fix locations (file:line), the reprojection helper, the Moab topography + drainage verbatim run logs, PR URL + SHA, blockers.
