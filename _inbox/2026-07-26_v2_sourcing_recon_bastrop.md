---
id: 2026-07-26_v2_sourcing_recon_bastrop
title: v2-sourcing recon (Bastrop) — what true-ROW / plat / easement / topo data actually exists
date: 2026-07-26
status: finding
owner: nick
read_only: true
governs: 27f Stage 4 (v2 fidelity) + Risk B (is v2 uniform or patchy)
related: [27f_bastrop_through_v2_program, 2026-07-26_temporal_boundary_primitive_and_living_layer, 2026-07-26_base_layer_connecting_tissue_thesis_and_tracks]
---

# v2-sourcing recon — Bastrop

Run 2026-07-26 to ground Risk B (the least-proven part of the v2 plan) with real data BEFORE any v2 fidelity build. Verdict up front: v2 for Bastrop is MORE achievable than feared on ROW/topo (strong public sources exist, some survey-grade), PATCHIER on easements (recorded-document, not queryable data). v2 is real but NON-UNIFORM per source type — exactly the "coverage number, not a switch" the plan predicted. The mold is a v1.5 mold with an opportunistic v2 deepening, and that is fine — name it.

## What was checked (live, public endpoints)

Bastrop County runs a live ArcGIS REST server at `maps.co.bastrop.tx.us/server/rest/services` — 26 service folders, real layers served. This is the decisive source and it is directly ingestable (ArcGIS FeatureServer -> GeoJSON, the same shape as our existing intake). Plus TxDOT open data, TxGIO statewide LiDAR, and the county-clerk recorded-plat path.

## FINDING BY v2 SOURCE TYPE

### TRUE ROW / road width — STRONG, partly SURVEY-GRADE (better than expected)

The county serves `RoadAndBridgeMap/StreetsSurveyed2016` — a live polyline FeatureServer of SURVEYED streets with ~95 fields. Decisive fields present:
- `surface_wi` (surface width), `row_permit`, `row_notes` — ROW-adjacent width data.
- `surface`, `road_paved`, `road_grave`, `road_hotmi`, `road_seale` — surface type (paves the gravel-vs-paved classification we hand-derived from OSM `surface=*`; this is the AUTHORITATIVE source for it).
- `class`, `rdcls_typ` — functional road classification (authoritative vs our OSM-tag proxy).
- `st_name`, `full_name` — road identity.

This is a direct upgrade path from our v1 (OSM centerline + assumed-per-class ROW) to v2 (surveyed streets + real surface/class/width). It is SURVEYED (2016), county-authoritative, and directly ingestable. It does not give a full ROW polygon everywhere, but `surface_wi` + `row_notes` + class is a large step past assumed-width, and it REPLACES our OSM-proxy road classification with the county's own — which also improves v1 labeling.

Also available: TxDOT Open Data Portal (`gis-txdot.opendata.arcgis.com`) TxDOT Roadways for state highways. CAUTION: TxDOT GIS carries a commercial-use / no-resale / no-redistribution restriction — must be checked before use in a commercial product. The county StreetsSurveyed2016 (local public record) is the cleaner source for our sourcing posture; TxDOT is a supplement for state routes with a licensing check.

### TOPOGRAPHY — STRONG, survey-grade available free (big v2/v3 jump)

- County serves `Contour1Ft2017` and `Contour2Ft2017` — 1-foot and 2-foot contours (2017), live FeatureServers. This is dramatically better than our current v1 (USGS 3DEP ~10m DEM, "confidence 0.60 asserted"). 1-ft contours are near-survey-grade for site work.
- TxGIO/TNRIS StratMap: LiDAR now covers the ENTIRE state of Texas, free to download on the DataHub, point-cloud (classifiable to bare-earth/vegetation/structures). CAPCOG obtained 1.4m LiDAR for ~95 sq mi of Bastrop as far back as 2007; statewide modern coverage now exists.
- Verdict: v2 topo (1-ft contours) and v3 topo (LiDAR point cloud) are BOTH sourceable for Bastrop, free, county+state authoritative. This is the strongest v2 story of any source type — and it directly serves the road-topo -> hydrology -> twinning thread and the IFC-with-topo export.

### EASEMENTS — PATCHY (recorded documents, not queryable data) — this is the real Risk-B constraint

- No easement FEATURE LAYER was found in the county REST services (checked Transportation, Planning, RoadAndBridgeMap folders). Easements live in RECORDED PLATS and deed documents at the County Clerk, not as a GIS layer.
- Recorded plats ARE accessible: county-clerk records via the official portal (`cc.co.bastrop.tx.us/RealEstate`) and third-party (TexasFile) as SCANNED IMAGES / PDFs, coverage ~1900-2018, document-by-document search (subdivision name / volume / page), purchasable PDF, NO API / NO bulk. Official recorded plats sourced from the Bastrop County Clerk.
- Verdict: easements are the DOCUMENT-PARSING problem the plan flagged — scanned plats -> OCR + geometry extraction -> easement atoms. Sourceable but HARD and NON-UNIFORM (per-document, no API, must be parsed). This is genuinely v2-with-enhancement, not v2-baseline. It confirms Risk B: easement coverage will be a patchy number driven by parse success, not a switch.

### PLANNED DEVELOPMENT / PDD — a layer exists (helps the PDD wave)

County serves `Planning/PlannedDevelopment` (MapServer). This is directly relevant to the PDD-declines wave (the 127/150 city-cohort PDD parcels) — there may be a served PDD geometry/attribute layer we can use instead of treating PDD as pure honest-absence. Worth a follow-up: does PlannedDevelopment carry setback/dimension data per PD district? If so it partially unblocks PDD.

### BONUS authoritative layers found (v1.5 upgrades, cheap)

`Cadastral/Bastrop_County_Parcels` (parcels — but was "service not started" at check time; retry), `SubdivisionReviewJurisdiction`, `FEMA_DFIRM_SpecialFloodHazardArea` (authoritative flood vs our current FEMA pull), `USGS_Stream`, `PipelinePlus`, `Railroad`, `ParcelARI`. Several are direct v1.5 quality upgrades ingestable now.

## RISK-B VERDICT (the fork, now grounded)

v2 is NON-UNIFORM across source types, exactly as Risk B predicted:
- ROW / road class / surface: STRONG (surveyed streets layer, county-authoritative, ingestable now) — a near-clean v2 upgrade AND it improves v1 labeling (replaces the OSM proxy).
- Topo: STRONGEST (1-ft contours + statewide LiDAR, free) — v2 and v3 both sourceable.
- Easements: PATCHY (recorded scanned plats, document-parse, no API) — genuinely v2-with-enhancement, coverage = parse-success number.
- PDD: a served layer exists — may partially unblock the PDD wave.

So the mold is a v1.5 mold with an OPPORTUNISTIC v2 deepening whose coverage varies by source: high for ROW/topo, patchy for easements. The national story is therefore "honest-coverage base layer, SURVEY-GRADE WHERE SOURCEABLE (strong for ROW/topo, opportunistic for easements)" — NOT "survey-grade everywhere." Name it and price/position accordingly.

## STRATEGIC READ

The good news is bigger than the caveat: the county ALREADY PUBLISHES surveyed streets (with surface/class/width) and 1-ft contours as live, ingestable, authoritative REST services — and statewide LiDAR is free. That means the ROW-precision and topo-precision v2 upgrades are NOT blocked on hard document parsing; they are a straightforward adapter-ingest (same shape as our existing intake), sourced from the uniform public record (on-thesis, no relationship-privileged path). The HARD part (easements, and full ROW polygons where only width is given) is the recorded-document parse — real, but a bounded and known problem, and it is the part that also feeds the connecting-tissue/title vision.

Two immediate consequences for 27f Stage 4:
1. Re-order the v2 fidelity build by SOURCEABILITY: ROW/road-class/surface (from StreetsSurveyed2016) and topo (contours + LiDAR) FIRST — they are ingestable now and high-value. Easements SECOND (the document-parse enhancement). This lands the biggest v2 wins fast and defers the hard parse.
2. The StreetsSurveyed2016 layer improves v1 labeling TODAY (authoritative surface/class replaces the OSM proxy that caused the gravel/footway/collector bugs) — consider pulling it forward into Stage 2/3, not waiting for Stage 4. It may retire a whole class of road-labeling proxy bugs.

## SOURCES

- Bastrop County ArcGIS REST: https://maps.co.bastrop.tx.us/server/rest/services (StreetsSurveyed2016, Contour1Ft2017, PlannedDevelopment, FEMA_DFIRM, parcels)
- TxDOT Open Data: https://gis-txdot.opendata.arcgis.com/datasets/txdot-roadways (commercial-use restriction — verify before use)
- TxGIO/TNRIS StratMap LiDAR: https://tnris.org/stratmap/elevation-lidar.html (free statewide)
- Bastrop County Clerk recorded plats: https://www.bastropcounty.gov/page/co.county_clerk + https://www.texasfile.com/search/texas/bastrop-county/plat-records/ (scanned PDFs, no API)
- City of Bastrop open data: https://open-data-bastrop.hub.arcgis.com/
