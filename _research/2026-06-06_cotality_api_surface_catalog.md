---
id: 2026-06-06_cotality_api_surface_catalog
title: Cotality (CoreLogic) API surface catalog — full platform reference
date: 2026-06-06
kind: research
related: [77b_cotality_integration_strategy, 77_place_graph_strategy, _research/2026-05-30_cotality_property_brief_recon, _decisions/2026-06-06_cotality_parcel_provider]
owner: nick
---

# Cotality API surface catalog

> Captured 2026-06-06 from the authenticated developer.corelogic.com portal (via Comet) — full OpenAPI/swagger set for every Cotality API, not just the three provisioned demo apps. This is the authoritative endpoint reference for all Cotality integration work; [`77b_cotality_integration_strategy.md`](77b_cotality_integration_strategy.md) is the strategy that sequences it. Raw swaggers should be dropped into `P:\legacy-design-tools\lib\adapters\vendor\cotality\` for the adapter agents.

## Authentication (confirmed)

OAuth2 `client_credentials`. Two documented token patterns; both behind an Incapsula WAF that rejects body-less POSTs (411).

| Surface | Token endpoint | Auth shape |
|---|---|---|
| REST (api.cotality.com) | `https://api.cotality.com/oauth/token` | creds in **body** form-urlencoded: `grant_type=client_credentials&client_id=&client_secret=&scope=openid` |
| MCP | `https://mcp.cotality.com/oauth/token?grant_type=client_credentials` (prod), `mcp-uat` (UAT) | HTTP **Basic** `-u key:secret` + header `Content-Length: 0` |

Token TTL ~3600s; cache and refresh on 401. Send a real User-Agent (WAF may reject default library UAs). `api1.cotality.com` in the swaggers is the Springdoc "Generated server url" (backend), not the gateway — the gateway is `api.cotality.com`.

## Provisioned demo apps → security schemes

Each Cotality API declares its own OAuth security scheme. Our three demo apps map to schemes; exact key→scheme entitlement confirms at first 200.

| Demo app (env vars) | Likely scheme(s) | Unlocks |
|---|---|---|
| Property (`COTALITY_PROPERTY_*`) | `property_auth` | Property API V2 + Spatial Tile (both declare `property_auth`) |
| RiskMeter (`COTALITY_RISKMETER_*`) | `spatial_auth` | RiskMeter API (all 83 endpoints) |
| SpatialTile (`COTALITY_SPATIALTILE_*`) | `property_auth` | Spatial Tile (parcels/polygons, O&G, utility, map tiles) |

Other schemes seen in the platform (not in our demo set; need provisioning): `location_auth`, `interchange_auth`, `uwc_jwt_auth` (token at `api1.cotality.com/jwt-auth/token`), `wvs_auth`, `insight_auth` (uses `Clgx-Access-Key` query param), `fraudprequal_auth`, `tax_inquiry_auth`.

## API 1 — Property API V2 (`api.cotality.com/v2/properties/...`, `property_auth`)

CLIP-centric, two-step (resolve → detail). **No parcel polygon here — point centroid only.**

- `GET /v2/properties/search/geocode` — address → CLIP + geocode lat/lng (also `/search`, `/search/owner`, `/search/owner-search`, `/typeahead`).
- `GET /v2/properties/{clip}/site-location` — `coordinatesParcel` (centroid), `lot` (acres/sqft), `landUseAndZoningCodes` (zoningCode + description, landUseCode — raw county, no national taxonomy), legal description.
- `GET /v2/properties/{clip}/property-detail` — composite: buildings + ownership + site-location + tax-assessment + last market sale + most recent owner transfer.
- `GET /v2/properties/{clip}/climate-risk-analytics/ar6/comprehensive` — **CRA AR6**: per-peril AAL ratio + risk score 0-100, AEP/OEP 50/100/200/500-yr + TVaR, across SSP1-2.6/SSP2-4.5/SSP5-8.5/RCP scenarios and horizons current/2030/2040/2050.
- `GET /v2/properties/{clip}/avm/thv/{model}/{summary}` — AVM (thvConsumers/Originations/Marketing/RiskManagement).
- Carfax depth: `{clip}/ownership`, `/ownership-transfers/{saleType}/{latest}`, `/transaction-history`, `/tax-assessments/latest`, `/mortgage` (+`/current`), `/liens` (+ involuntary, enriched, SolarPACE), `/buildings`, `/building-permits`, `/home-owners-association`, `/comparables`, `/propensity-scores/{clip}/{heloc|rent|sale|purchase|refinance}-score`, `/assessor-maps`, `/document-images`, `/avms/ram` (rent model).

## API 2 — Spatial Tile (`api.cotality.com/spatial-tile/...`, `property_auth`)

**This is the parcel polygon source** (resolves the geometry gap) AND the oil & gas + utility land-record source.

- `GET|POST /spatial-tile/parcels` — **Parcel Point**: parcel boundary polygon + centroid. Params: address, city, lat, lon, bbox, geometry (WKT polygon filter), fips, apn, within, unit, pageNumber, pageSize. 162M parcels / 3,094 counties.
- **Oil & Gas (capture — feeds 77 mineral/vertical estate):** `GET|POST /spatial-tile/parcels/SpatialRecordOGBasic | SpatialRecordOGPremium | SpatialRecordOGPro`. SpatialRecord = single-source parcel-level land-record solution; the O&G tiers carry oil/gas lease, well, and production data associated with parcels. Directly relevant to TX surface/mineral/air estate split and the TX CRG minerals workstream.
- **Utility:** `GET|POST /spatial-tile/parcels/SpatialRecordUTBasic | UTPremium | UTPro` — electric/water/gas/telecom infrastructure on parcels.
- Tiles: `GET /spatial-tile/map`, `/tile/bing`, `/tile/gmap` — PNG parcel overlay tiles.

## API 3 — RiskMeter (`api.cotality.com/riskmeter-api/...`, `spatial_auth`) — 83 endpoints

Lat/lng or address; many accept `clip`. The hazard + replacement-cost spine.

- **Climate composite:** `/climate-risk` (clip|address) — perils CALL (all), CFL (composite flood), CNFW (non-flood weather), FIXX (wildfire), FLXX (inland flood), STTH (severe convective), STWS (winter storm), TCFL (hurricane surge), TCWI (hurricane wind), EQTS/EQFF (earthquake).
- **Flood / hydrology (forcing for the sim):** `/flood`, `/flood-risk-score`, `/flood-risk-score-ffh`, `/flash-flood-risk-score` (uses flow accumulation, rain intensity/frequency, imperviousness), `/flood-zone-determination` (FEMA zone), `/us-inland-flood-cat-model` + `/us-inland-flood-hazard` (**EstimatedFloodDepth at 50/100/250/500-yr return periods + WaterSurfaceElev + GroundElev + HUC12**), `/first-floor-height` (+`-only`), `/elevation-slope-aspect`.
- **Wildfire:** `/wildfire-risk` (+`-im`, +`-imc` conflagration), `/us-wildfire-cat-model`, `/wildfire-mitigation-score` (+`-fw`).
- **Wind/hurricane:** `/coastal-storm-risk-score`, `/us-hurricane-cat-model`, `/us-hurricane-hazard`, `/wind-risk-score`, `/wind-probability`, `/wind-pool`, `/wind-resiliency`, `/wind-loss-mitigation`, `/wind-borne-debris-2`.
- **Hail:** `/hail`, `/hail-basic`, `/hail-insight`, `/hail-risk`. **Severe/other:** `/us-severe-convective-storm-cat-model`, `/lightning-risk-score`, `/winter-storm`, `/non-weather-fire-risk-score`, `/non-weather-water-risk-score`, `/fire-protection-class`, `/fire-resiliency`, `/water-resiliency`.
- **Earthquake:** `/earthquake-risk-score`, `/us-earthquake-cat-model` (+`-banking`), `/us-earthquake-hazard`.
- **Env hazards:** `/tsunami-evacuation-zone`, `/lava-flow`, `/mine-subsidence`, `/sinkhole-integrated`, `/sewer-backup-risk-score`, `/combined-sewer-area`, `/underground-storage-tank`.
- **Replacement cost (Cortex/insurability):** `/residential-replacement-cost`, `/commercial-replacement-cost`, `/major-system-permits`.
- **Property chars:** `/building-characteristics`, `/age-of-roof`, `/comprehensive-foundation-type`, `/distance-to-shore` (+custom), `/distance-to-fire-station`.
- **Geocode:** `/geocode`, `/geocode-reverse`, `/geocode-structure`, `/address-standardization`. **Jurisdiction:** `/city`, `/county`, `/jurisdiction`, `/custom-territory`, `/tier-one-county`. **Other:** `/foreclosure`, `/crime-risk-score`, `/canada-flood-risk-score`, `/canada-crime-risk-score`, all the tax endpoints (cable/payroll/premium/sales-use/utility/etc.), `/search`, `/generate-pdf`.

## API 4 — MCP (`mcp.cotality.com/mcp`, streamable HTTP, Bearer)

Tools: `clip-find_property_by_clip`, `clip-find_property_by_full_address`, `pc-characteristics_by_clips_tool`, `pacra-property_analytics_by_clips_tool` (+`_age_of_roof`, +`_climate_risk`), `pa-analytics_{listing_trends,market_trends,rental_trends,corelogic_hpi,hpi_forecast}_tool`, `pa-unified-client-mobile_tool`, `pa-property-v2-clientside_tool`, `pac-climate-risk_tool`. The federation foothold (77b §5).

## API 5+ — other platform APIs (exist; not in our demo set)

- **Location API** (`location_auth`): `/location-api/{clip}/landparcel/{id}` and `/structure/{id}` return **geometry in WKT** (parcel + structure footprint) — alternative polygon source. Plus `/summary`, `/detail`.
- **InterChange** (`interchange_auth`): clean building reconstruction components (the data behind CoreLogic RCT Express) — reconstruction-cost input layer for Cortex/insurability.
- **Underwriting Center / Digital Hub** (`uwc_jwt_auth`): roof-condition-insights (roof RCV + current roof value + weather verification hail/wind events + AI imagery).
- **WVS** (`wvs_auth`): weather verification — hail/wind/lightning/tornado history + maps. **Insight** (`insight_auth`): portfolio weather-impact monitoring. **TaxServicingData**, **FraudPrequal** (owner-occupancy / owned-properties).

## Mapping to the place-graph planes (77) and our layers

| Plane / layer | Cotality source |
|---|---|
| C — parcel economics | Property V2 site-location/tax/ownership; **Spatial Tile Parcel Point = polygon** |
| D — physical/environmental | RiskMeter (83 hazard endpoints) + Property CRA AR6 |
| D — hydrology forcing | RiskMeter inland-flood-cat-model (flood depth @ return periods), flash-flood-risk-score, first-floor-height |
| F — market/transaction | Property V2 transaction-history, AVM, comparables; RiskMeter foreclosure |
| Vertical estate (mineral) | **Spatial Tile SpatialRecord O&G Basic/Premium/Pro** |
| Utility/infrastructure | Spatial Tile SpatialRecord Utility; RiskMeter sewer/utility |
| Reconstruction cost | RiskMeter residential/commercial-replacement-cost; InterChange; UWC roof RCV |
| Structure geometry | Location API structure boundary (WKT); Property buildings |
| Insurability module | RiskMeter hazard scores + replacement cost + wind/flood mitigation credits |

## Duplicate assessment of the swagger set

property-api-v2 appeared twice (identical); spatial-tile appeared three times (identical). All other specs (riskmeter, underwriting-center, fraudprequal, wvs, taxservicingdata, insight, location, interchange) are unique. De-duplicate to one copy each when filing into the vendor dir.

## Where this changes the plan (corrections to in-flight work)

1. **Polygon is solved** — Spatial Tile `/spatial-tile/parcels` returns parcel boundary polygons under the SpatialTile (and likely Property) key. The parcel adapter can emit a real GeoJSON polygon, not a point fallback.
2. **Climate is NOT eval-gated** — reachable on demo keys via Property CRA AR6 (Property key) and RiskMeter `/climate-risk` + flood/hazard endpoints (RiskMeter key). The climate-layer dispatch gate flips from "premium SKU, eval-only" to "demo-smokeable once token works."
3. **Hydrology forcing is directly available** — RiskMeter inland-flood-cat-model gives modeled flood depth at return periods + water-surface elevation; this is both an input to and a validation source for the Cortex sim (77b §2). NOAA Atlas 14 still supplies raw design-storm rainfall.
4. **Oil & gas / mineral estate** — Spatial Tile SpatialRecord O&G tiers feed the 77 vertical-estate (mineral) plane and the TX CRG minerals workstream; new integration lane worth its own dispatch later.
5. **Reconstruction cost** has three sources (RiskMeter replacement-cost, InterChange, UWC) — feeds the insurability module and Cortex feasibility.
