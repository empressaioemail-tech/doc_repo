---
id: OPS-1_texas_source_registry
title: OPS-1 — Texas Source-of-Truth Registry (the baked-in engine input for L-SOURCE)
date: 2026-08-02
status: operations doc (gap-closure: R-FND-2 registry-as-engine-input; supersedes the CAPCOG prototype)
owner: nick
related: [2026-08-02_DAY_ONE_foundation_brief, 2026-08-02_foundation_ground_truth_ACCEPTED, _land_records/source_rail_registry.md, _catalog/tx_jurisdiction_source_registry.json]
layer: L-SOURCE
closes_gaps: [4 registry-docs-only, 8 recent-repeal-register-unwired]
---

# OPS-1 — Texas Source Registry

## WHAT THIS IS
The registry the ENGINE READS (R-FND-2: baked in, not docs beside it) to know, per Texas jurisdiction: where each layer's authoritative public source is, its freshness, its join-integrity risk, its currency/repeal state, and the frozen source-adapter to use. Every source CITED. The registry is versioned + frozen; the mechanism replays it. Agents AUTHOR registry rows in prep (reviewed → frozen); the warm path only READS frozen rows.

## STATUS (honest — gap-closure doc)
- BUILT: a live-probed Rail C (parcel geometry) matrix exists — `_scratch/txgio_stratmap_county_matrix_2026-08-02.json` (254 counties, probed 2026-08-02) + CSV + adapter-routing YAML. The CAPCOG prototype (`_catalog/tx_jurisdiction_source_registry.json`, 55 jurisdictions) is Rail A (code/zoning) batch 1.
- OWED (the gap): the engine reads NONE of this today — it uses hardcoded per-county adapters (e.g. Bastrop layer-23 URL constant in `bastrop-per-parcel-record.ts`). CLOSING THIS = make the registry a frozen artifact the engine loads. That is a build item in OPS-2/OPS-3.

## THE RAILS (per _land_records/source_rail_registry.md)
- Rail A — jurisdictional code / zoning / setback (the moat; per-jurisdiction; the Bastrop recipe's per-parcel record + adopted code). Source registry = the CAPCOG-style code/adapter map, extended statewide.
- Rail B — CAD appraisal attributes (owner/tax/value/land-use), joined to Rail C geometry. Source = county CAD (PACS/Orion/HCAD) + TxGIO's embedded attributes.
- Rail C — parcel GEOMETRY. Source = TxGIO StratMap (statewide) + county ArcGIS override where fresher. THE SPINE.
- Rail D — flood/terrain/soils (uniform federal/state: FEMA NFHL, USGS 3DEP, USDA SSURGO) + the OZ-style uniform layers.

## RAIL C — TxGIO STRATMAP (live-probed 2026-08-02; the spine)
Source of record: StratMap land parcels, DataHub collection `0fa04328-872e-481c-b453-126a74777593`.
- COVERAGE: 253/254 counties covered. NOT covered: Donley (48129) → needs county CAD/ArcGIS override.
- FRESHNESS: 249 counties STALE (>1yr as of 2026-08-02); 4 FRESH (Cooke 48097, Hopkins 48223, Limestone 48293, Palo Pinto 48363, all 202509). Metros (Travis/Williamson/Bexar/Harris/Dallas) are 202503 = STALE → prefer live county ArcGIS where published + fresher.
- JOIN-INTEGRITY (prop_id bad rate ≥25%, do NOT join CAD on prop_id alone): Robertson 48395 (1.00), Oldham 48359 (0.9995), Roberts 48393 (0.9992), Motley 48345 (0.53), Travis 48453 (0.51), Floyd 48153 (0.46), Dimmit 48127 (0.39), Lipscomb 48295 (0.38). These route join_key → geo_id_or_address_crosswalk, gated by owner-match.
- ACCESS: bulk per-county zip ONLY (parcel REST /query is 400 "not supported" / token-gated — display only). One zip per FIPS: `https://data.geographic.texas.gov/{collection}/resources/stratmap25-landparcels_{fips}_lp.zip`. Browser User-Agent REQUIRED (bare UA → CloudFront 403). No auth, no published rate limit. Warm path = STAGED BULK LOAD per county, not live-per-county REST.
- SCHEMA (frozen adapter contract): geometry (WGS84) + prop_id + geo_id + owner_name + situs_* + provenance (source, date_acq, fips, county, tax_year, source_vintage from zip basename). Full 36-field schema: TNRIS Land Parcel Schema PDF; Hauska ingest subset in `legacy-design-tools/lib/cad-ingest/src/txgio/parse.ts`.
- DISCREPANCY TO VERIFY AT INGEST: agent summary cited Bastrop 74,729 features; matrix JSON says 63,357. Confirm the live count on first Bastrop ingest.

## OTHER TxGIO STATEWIDE LAYERS (candidates for the uniform-data parallel track / Rail D+)
- ADDRESS POINTS — statewide ~11.7M, PAGINATED REST (`Address_Points/stratmap_address_points_48_most_recent/MapServer/0`, where=county='X', maxRecordCount 2000, geojson, ~2 req/s). Already ingested (txgio_address). USE for situs.
- CITY LIMITS — `City_Boundaries/Texas_City_Boundaries/MapServer/0`, 1,225 city polygons, queryable REST. SOLVES the R17 "what is the city" problem (Bastrop Phase 1 flagged BCAD city fields empty). CAVEAT: CPA sales-tax geometry — cities without sales tax omitted. Fields: city_name, geo_id, gnis, geometry.
- HYDROGRAPHY (NHD streams/waterbodies), WATERSHED (WBD/HUC), HYPSOGRAPHY (contours), LEGISLATIVE boundaries — all statewide queryable REST, $0.
- COUNTY BOUNDARIES — NOT a dedicated TxGIO service; use Census TIGER.
- ETJ — NO statewide layer; derive from city-limits + Local Gov Code §42.021, or per-city GIS.
- LiDAR/DTM + ORTHO — statewide raster on DataHub (additive viz only; not a 3DEP replacement — datum-mismatch risk).

## THE FROZEN ADAPTER-ROUTING (from the agent's registry YAML — the engine input shape)
Per county the registry names: geometry_source (stratmap_bulk_zip default; cad_direct override for Donley + metros-where-fresher), join_key (prop_id default; geo_id_or_address_crosswalk for the 8 high-bad-id counties), owner_match_gate (required_before_cad_promote — ALWAYS). Full routing: `_scratch/txgio_stratmap_rail_c_adapter_registry.yaml`.

## REGISTRY SCHEMA (what a frozen jurisdiction row carries — the engine reads this)
Per jurisdiction (county + city): fips; jurisdiction_key; per-rail source (url/endpoint/adapter_kind/access_method/vintage/refresh_cadence); freshness_flag; join_integrity (prop_id_bad_rate, join_key, owner_match_required); currency (current_edition_id, repealed_edition_dids[], repeal_date, stale_source_flag — the recent-repeal register, wired to the R13/R16 currency gate); conflict_register (conflicting-source disclosure rows per R25); confidence; source_citation (URL); registry_version; frozen_at + frozen_by (the prep-time freeze).

## HOW THIS CLOSES THE GAPS
- Gap 4 (registry docs-only): the engine loads this registry (frozen JSON/YAML) instead of hardcoded adapters. Build item: a registry loader in engine-core the warm path reads (OPS-2/OPS-3).
- Gap 8 (recent-repeal unwired): the currency-register rows feed the R13/R16 currency gate as DATA (not a Bastrop-hardcoded string), so any county's repealed edition is caught by the same mechanism.

## PREP-TIME AUTHORING (the agent seam, per R-FND-3)
Registry rows are authored as PRE-FAN PREP: an agent probes a county's sources, determines the adapter/join/currency, and EMITS registry rows → adversarial review → verified → FROZEN + committed. The warm path never authors; it reads frozen rows. New-county onboarding (OPS-2) begins with authoring + freezing its registry row.
