---
id: 2026-07-27_bastrop_public_data_completeness_recon
title: Bastrop public-data completeness recon — every layer the county + city actually publish, vs what we've ingested
date: 2026-07-27
status: recon (feeds a QA ingest-prioritization dispatch)
owner: nick
verified: live ArcGIS REST enumeration (county server) + City of Bastrop open-data hub
related: [2026-07-26_v2_sourcing_recon_bastrop, 2026-07-27_bastrop_composition_inventory, 27f_bastrop_through_v2_program]
purpose: "complete public data map" — enumerate ALL published public layers so nothing is missed, and rank what to ingest. Before, we only queried Cadastral/Transportation/RoadAndBridgeMap/Planning; this sweeps everything.
---

# Bastrop public-data completeness recon

Live-enumerated 2026-07-27. The goal is a COMPLETE public-data map: every layer Bastrop County + City of Bastrop publish, mapped against what we've ingested, so the QA ingest-prioritization is grounded in the full inventory (not the ~4 folders we'd looked at). This recon method should become a recipe step for every county.

## COUNTY server (maps.co.bastrop.tx.us) — full folder sweep

| Folder | Real content found | Ingested? |
|---|---|---|
| Cadastral / Cadastral_BP | Bastrop_County_Parcels (BCAD) | YES (parcels) |
| Transportation_BP | Bastrop_County_Roadway (city+county, owner/surface/class), Crash_Locations | roads YES; **Crash_Locations NO** |
| RoadAndBridgeMap | StreetsSurveyed2016, **Contour1Ft2017**, **Contour2Ft2017**, SubdivisionReviewJurisdiction, Railroad, PipelinePlus, Parks, USGS_Stream, FEMA_DFIRM_* | roads YES; **1-ft/2-ft CONTOURS NO** (the topo gap); railroad/pipeline/parks NO |
| **Hydrography** | **Creeks_Streams** | **NO** |
| **Imagery** | **Imagery_2019/2021/2022/2024 + CAD_Imagery_2022** (6 years aerial ortho) | **NO** (relevant to aerial-calibration thread) |
| **Topography / Topography_BP** | empty at top level (contours live in RoadAndBridgeMap) | n/a |
| CAD_Mapping | Bastrop_Cad_GIS_blue, CAD_Imagery_2022/2024, FirearmDischargeProhibition | imagery NO |
| Emergency_Management_BP | FEMA_Flood_Hazard_Areas | YES (flood) |
| **Administrative_BP** | **Address_Points**, Bastrop_County_City_Limits, **Subdivisions** | city-limits partial; **Address_Points NO; Subdivisions NO** |
| Utilities / Infrastructure | only GP tooling / empty (county doesn't publish utility assets) | n/a — CITY publishes these |
| Economic_Development / Radio_System / Disaster / Elections / Political_Boundaries / Viewers / Other | tooling / boundaries / not-yet-checked-in-detail | mostly n/a |

## CITY of Bastrop hub (open-data-bastrop.hub.arcgis.com) — the city-asset layers

| Dataset | What it is | Ingested? |
|---|---|---|
| Zoning_Place_Type / "Zoning Simple" / Place Type + Character Districts | **the authoritative zoning source** (PlaceTypeClass) — now correctly cited post-A1 | YES (zoning) |
| **Water Bastrop** | city water infrastructure | **NO** |
| **Utility CCNs and Territory** | water/wastewater CCN service areas + Bastrop Power & Light electric territory | **NO** |
| BCAD Data | appraisal/parcel | YES (parcels) |
| (streetlights / traffic signals) | **NOT FOUND on the city hub** — small city may not publish them as open data; Austin does (regional pattern). Confirm via direct city contact or a deeper hub crawl | **NO / possibly unpublished** |

## THE COMPLETENESS GAP — public layers we DON'T have

Ranked by value:

TIER 1 (high value, directly requested/expected):
- **1-ft + 2-ft CONTOURS** (RoadAndBridgeMap/Contour1Ft2017/2ft) — THE topography gap. This is "nice tight topography." County-authoritative, ingestable. Plus TxGIO LiDAR (statewide, free).
- **AERIAL IMAGERY 2019-2024** (Imagery folder, 6 years) — directly feeds the aerial-calibration thread + a satellite/aerial basemap option. Multiple vintages = a time series.
- **Creeks_Streams (Hydrography)** + USGS_Stream — real hydrography for the water/hydrology studies (vs the derived D8 flow we compute).

TIER 2 (real, useful):
- **Address_Points** (Administrative_BP) — authoritative addressing (vs geocode).
- **Subdivisions** (Administrative_BP + SubdivisionReviewJurisdiction) — subdivision boundaries (relevant to the subdivision/replat living-layer event).
- **City water + Utility CCNs + electric territory** (city hub) — the first UTILITY/infrastructure layers; digital-twin territory.
- **Railroad, PipelinePlus, Parks** (RoadAndBridgeMap) — context layers.
- **Crash_Locations** (Transportation_BP) — safety/traffic data.

TIER 3 (digital-twin / infra assets — mostly city, possibly unpublished):
- **Streetlights / traffic signals** — NOT found on Bastrop's public hubs (small city). Austin publishes them (regional proof they're a city-asset category). For Bastrop specifically: likely requires direct city data handoff (the gift-demonstrator relationship) or they may not exist as GIS. Confirm — do not assume unavailable, but do not assume public either.

## What this tells us (findings)

1. We only ever queried 4 of ~26 county folders. There is substantially more published public data than we've ingested — most notably CONTOURS (the topo gap), 6 years of AERIAL IMAGERY, HYDROGRAPHY, and ADDRESS/SUBDIVISION layers.
2. The topo gap is confirmed AND its source is confirmed available (county 1-ft contours + TxGIO LiDAR) — it's an ingest, not a mystery.
3. Utility/infrastructure assets (water, CCN, electric) are a CITY layer (county doesn't publish them) — same jurisdiction-split as roads. Streetlights/traffic are the one category we could NOT confirm public for Bastrop specifically.
4. This "enumerate ALL published layers before deciding what to ingest" should be a RECIPE STEP for every county — we discovered a whole topo/imagery/hydro category by accident here; the recipe should surface it deterministically.

## Next

A QA/ingest dispatch (separate prompt) prioritizes: TIER 1 first (contours→the topo upgrade already scoped as a QA item; aerial imagery; hydrography), then TIER 2 (address, subdivisions, utility CCN), with the REPLACE-DON'T-BREAK discipline (verify IFC/terrain/hydrology consumers on any elevation/terrain change). TIER 3 (streetlights/traffic) needs a city-data confirmation, not an assumption. Every ingest carries provenance; honest fallback where a layer is absent.
