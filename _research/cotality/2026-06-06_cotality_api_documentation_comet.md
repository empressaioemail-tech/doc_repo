---
id: 2026-06-06_cotality_api_documentation_comet
title: Cotality (CoreLogic) API Suite — comprehensive documentation (verbatim, Comet-retrieved)
date: 2026-06-06
kind: reference
source: developer.corelogic.com (authenticated, retrieved via Comet 2026-06-06)
related: [_research/2026-06-06_cotality_api_surface_catalog, 77b_cotality_integration_strategy]
owner: nick
---

> Verbatim capture of the consolidated Cotality API documentation pulled from the authenticated developer.corelogic.com portal on 2026-06-06. Stored as the authoritative human-readable reference. The machine-readable OpenAPI/swagger JSONs are the field-level source of truth and belong in `P:\legacy-design-tools\lib\adapters\vendor\cotality\` (see the swaggers README). Strategy: [`77b`](../77b_cotality_integration_strategy.md); distilled catalog: [`2026-06-06_cotality_api_surface_catalog.md`](../2026-06-06_cotality_api_surface_catalog.md).

---

# CoreLogic Cotality API Suite - Comprehensive Documentation

## Overview

The CoreLogic Cotality platform provides a comprehensive suite of real estate and property intelligence APIs. The platform consists of three primary API products:

| API | Description | Base URL |
|---|---|---|
| **MCP** | AI-assisted property data access via Model Context Protocol | `https://mcp.cotality.com/mcp` (Prod) |
| **Spatial Tile API** | Parcel polygon/boundary data, oil & gas, utility, and visual map rendering | `https://api.cotality.com/spatial-tile/` |
| **RiskMeter API** | 70+ natural hazard risk reports and building characteristics | `https://api.cotality.com/riskmeter-api/` |
| **Property API V2** | Legacy property data endpoint | See docs |

All APIs require **OAuth 2.0 Client Credentials** authentication.

## Authentication

All requests require a Bearer token obtained via the OAuth 2.0 `client_credentials` grant type.

### Token Endpoint

| Environment | URL |
|---|---|
| **Production** | `https://mcp.cotality.com/oauth/token?grant_type=client_credentials` |
| **UAT** | `https://mcp-uat.cotality.com/oauth/token?grant_type=client_credentials` |

### Requesting a Token (MCP-host pattern)

```bash
curl -X POST "https://mcp.cotality.com/oauth/token?grant_type=client_credentials" \
     -u "<client_id>:<client_secret>" \
     -H "Content-Length: 0"
```

### Token Response

```json
{ "access_token": "GNdlinr2kVNj3igGI7y176vheYrF", "token_type": "Bearer", "expires_in": 3599 }
```

### REST-host pattern (Integration Guides)

```
POST https://api.cotality.com/oauth/token
Content-Type: application/x-www-form-urlencoded

grant_type=client_credentials&client_id=<ID>&client_secret=<SECRET>&scope=openid
```

Tokens expire ~3600s; on 401 regenerate. Use `Authorization: Bearer <access_token>` on all calls.

---

## MCP (Model Context Protocol) Toolkit

- **Protocol:** JSON-RPC 2.0 over Streamable HTTP. **Endpoint:** `https://mcp.cotality.com/mcp`. Manual token config (no OAuth discovery). Clients: VS Code, Claude Code, Cursor, Windsurf, Python `mcp`.

**CLIP Tools:** `clip-find_property_by_clip` (input `{clip}`), `clip-find_property_by_full_address` (input `{full_address}`). Response envelope `{success, data:[PropertyData], count, messages}`. PropertyData = identifiers (clip, clipStatus, countyCode, county, apn*, universalParcelId), address (full breakdown), geographic (lat/lng), owner (owner1Name, owner2Name, matchCode, propertyMatchScore), nested addressAttributes (admin1-admin7, geocode metadata).

**Property Characteristics:** `pc-characteristics_by_clips_tool` (input `{clips:[]}`). Returns land (landDimensionAcresTotal, landUseCode, propertyIndicatorCode, universalTotalValue; nested lot, landDimension, topography), structure array (actualYearBuilt, buildingClassificationCode, universalConditionCode/styleCode/gradeCode; nested Attic, Basement, Bathroom, Ceiling, Commercial, Dimensions [living sqft, footprint WKT], SquareFootageDetail, Footprint [polygon+source+vintage], FinishComponents, Fireplace, StructureFunctionalComponents [HVAC/fuel/energy], GarageParking, Residential, StructuralComponents [roof, foundation]), propertyAttributes (SummaryData, Owner, Location [cbsa, censusId, municipality, censusTract, township], FunctionalComponents [sewer/water/fuel codes], absenteeOwnerCode, mobileHomeCode, legalPropertyDescription).

**Climate Risk Analytics:** `pacra-property_analytics_by_clips_tool` (Age of Roof + Climate Risk), `pacra-property_analytics_age_of_roof_by_clips_tool`, `pacra-property_climate_risk_by_clips_tool`. Age of Roof: roofAge[], constructionYear, estimatedAge, confidence (HIGH/MEDIUM/LOW). Climate Risk: craStructureGeocode, modelVersion, modelRunDate, perils[] → CraPeril → RcpScenario (RCP 4.5/8.5) → CraTimeHorizon (2030/2050/2100) → AAL + TVaR at 50/100/200/500-yr (AEP and OEP).

**Analytics (shared AnalyticsFilter: geography_type zip/county_fips/cbsa/state + optional time_range):** `pa-analytics_listing_trends_tool` (Active/All/Closed/New/Pending/Sold/Delisted/MarketIndicator), `pa-analytics_market_trends_tool` (TotalSales/Resale/NewConstruction/ReoSales/ShortSales/Equity/Foreclosure/NonOwnerOccupied), `pa-analytics_rental_trends_tool` (rentMean/Median, vacancyRate, capRateMean/Median), `pa-analytics_corelogic_hpi_tool` (hpiTier, marketIndicator), `pa-analytics_corelogic_hpi_forecast_tool` (hpiForecastTier, hpiForecastStandardError). Other MCP tools seen: `pa-unified-client-mobile_tool`, `pa-property-v2-clientside_tool`, `pac-climate-risk_tool`.

---

## RiskMeter API (Formerly Spatial API)

**Base URL:** `https://api.cotality.com/riskmeter-api/`. OAuth2 client credentials. 70+ (83 endpoints) natural hazard + property + tax + geocode endpoints.

**Access pattern:** `GET .../riskmeter-api/<endpoint>?latitude=&longitude=` or `?address=` `&includeEnhancedData=true&mapTile=tile`. Common params: latitude, longitude, address, mapTile (tile/parceltile/static/none), mapZoom (11-19), includeEnhancedData, pdf, referenceNumber.

### Climate Risk — `/climate-risk` (clip|address)
Peril coverage: CALL (Composite All Perils), CFL (Composite Flood), CNFW (Composite Non-Flood Weather), FIXX (Wildfire Fire+Smoke), FLXX (Inland Flood), STTH (Severe Convective Storm), STWS (Winter Storm), TCFL (Hurricane Storm Surge), TCWI (Hurricane Wind), EQTS (Earthquake Tsunami), EQFF (Earthquake Fire Following). Response: clip, fipsCode, modelVersion, modelRunDate, riskTypeScoreGroup (SFR/MFR/COM/IND/AGR/MUN), perils[].

### Hydrology / Flood
`/flood-risk-score` (0-100, floodZone, distanceToCoast, FIRM, BFE), `/flood-risk-score-ffh`, `/flash-flood-risk-score` (topography, drainage, rainfall intensity), `/flood-zone-determination`, `/us-inland-flood-cat-model` + `/us-inland-flood-hazard` (EstimatedFloodDepth 50/100/250/500-yr, WaterSurfaceElev, GroundElev, HUC12), `/first-floor-height` (+`-only`), `/elevation-slope-aspect`, `/distance-to-shore` (+custom).

### Wildfire / Wind / Hurricane / Hail / Quake / Severe
Wildfire: `/wildfire-risk` (+IM, +IMC conflagration; 0-100, slope/aspect/fuel/drought/wind, pastFireOverview), `/us-wildfire-cat-model`, `/wildfire-mitigation-score` (+fw). Hurricane/coastal: `/coastal-storm-risk-score`, `/us-hurricane-cat-model`, `/us-hurricane-hazard`. Wind: `/wind-risk-score`, `/wind-probability`, `/wind-pool`, `/wind-resiliency`, `/wind-loss-mitigation`, `/wind-borne-debris-2`. Hail: `/hail`, `/hail-basic`, `/hail-insight`, `/hail-risk`. Earthquake: `/earthquake-risk-score`, `/us-earthquake-cat-model` (+banking), `/us-earthquake-hazard`. Severe: `/us-severe-convective-storm-cat-model`, `/lightning-risk-score`, `/winter-storm`, `/non-weather-fire-risk-score`, `/non-weather-water-risk-score`, `/fire-protection-class`, `/fire-resiliency`, `/water-resiliency`.

### Env hazards / Property chars / Replacement cost
`/tsunami-evacuation-zone`, `/lava-flow`, `/mine-subsidence`, `/sinkhole-integrated`, `/sewer-backup-risk-score`, `/combined-sewer-area`, `/underground-storage-tank`. `/building-characteristics`, `/age-of-roof`, `/comprehensive-foundation-type`, `/distance-to-fire-station`. `/commercial-replacement-cost`, `/residential-replacement-cost`, `/major-system-permits`.

### Tax / Canada / Geocode / Jurisdiction / Misc
Tax: cable, general-property, lease-rental, payroll, premium, regulated-property, sales-use, telecommunication, utility. Canada: `/canada-crime-risk-score`, `/canada-flood-risk-score`. Crime: `/crime-risk-score`. Geocode: `/address-standardization`, `/geocode`, `/geocode-reverse`, `/geocode-structure`. Jurisdiction: `/city`, `/county`, `/jurisdiction`, `/custom-territory`, `/tier-one-county`. `/foreclosure`, `/search`, `/generate-pdf`.

### Full RiskMeter endpoint list (83)
Address Standardization; Age of Roof; Building Characteristics; Cable Tax; Canada Crime Risk Score; Canada Flood Risk Score; City; Climate Risk; Coastal Distance; Coastal Storm Risk Score; Combined Sewer Area; Commercial Replacement Cost; Comprehensive Foundation Type; County; Crime Risk Score; Custom Territory; Distance To Custom Shore; Distance To Shore; Distance to FireStation; Earthquake Risk Score; Elevation Slope Aspect; Fire Protection Class; Fire Resiliency; First Floor Height; First Floor Height Only; Flash Flood Risk Score; Flood; Flood Risk Score; Flood Risk Score + FFH; Flood Zone Determination; Foreclosure; General Property Tax; Generate PDF; Geocode; Geocode Reverse; Geocode Structure; Hail; Hail Basic; Hail Insight; Hail Risk; Jurisdiction; Lava Flow; Lease and Rental Tax; Lightning Risk Score; Major System Permits; Mine Subsidence; Non-Weather Fire Risk Score; Non-Weather Water Risk Score; Payroll Tax; Premium Tax; Regulated Property Tax; Residential Replacement Cost; Sales and Use Tax; Search; Sewer Backup Risk Score; Sinkhole Integrated; Telecommunication Tax; Tier 1 County; Tsunami Evacuation Zone; US Earthquake Cat Model; US Earthquake Cat Model (Banking); US Earthquake Hazard; US Hurricane Cat Model; US Hurricane Hazard; US Inland Flood Cat Model; US Inland Flood Hazard; US Severe Convective Storm CAT Model; US Wildfire Cat Model; Underground Storage Tank; Utility Tax; Water Resiliency; Wildfire Mitigation Score; Wildfire Mitigation Score FW; Wildfire Risk Score; Wildfire Risk Score + Independent Mitigation; Wildfire Risk Score + Independent Mitigation + Conflagration; Wind Loss Mitigation; Wind Pool; Wind Probability; Wind Resiliency; Wind Risk Score; Wind-Borne Debris 2.0; Winter Storm.

---

## Spatial Tile API

**Base URL:** `https://api.cotality.com/spatial-tile/`. OAuth2 (`property_auth`). 162M parcels / 3,094 counties.

- **Parcel Point** `GET|POST /spatial-tile/parcels` — parcel boundary polygon + centroid. Params: address, city, lat, lon, bbox, geometry (WKT polygon), fips, apn, within, unit, pageNumber, pageSize. Response: `{pageInfo, parcels:[{apn, geometry, centroid:{lat,lon}, county, state}]}`.
- **Spatial Record Oil & Gas** (GET+POST each): `/parcels/SpatialRecordOGBasic`, `/SpatialRecordOGPremium`, `/SpatialRecordOGPro` — parcel-level land record; oil/gas lease, well, production data.
- **Spatial Record Utility** (GET+POST each): `/parcels/SpatialRecordUTBasic`, `/UTPremium`, `/UTPro` — electric/water/gas/telecom infrastructure on parcel.
- **Visual Map** `/spatial-tile/map` (PNG tiles; width/height/lat/lon/zoom/styles/layers/bbox), `/tile/bing`, `/tile/gmap`.

---

## Property API V2

**Base URL:** `https://api.cotality.com/property/...` (swagger server `api1.cotality.com`). OAuth2 (`property_auth`). CLIP-centric. Endpoints: `/v2/properties/search`, `/search/owner`, `/search/owner-search`, `/search/geocode` (→CLIP+geocode), `/typeahead`, `/{clip}/site-location` (centroid, lot, landUseAndZoningCodes), `/{clip}/property-detail` (composite), `/{clip}/buildings`, `/{clip}/ownership`, `/{clip}/ownership-transfers/{saleType}/{latest}`, `/{clip}/tax-assessments/latest`, `/{clip}/transaction-history`, `/{clip}/mortgage` (+`/current`), `/{clip}/liens` (+ involuntary, enriched, SolarPACE), `/{clip}/avm/thv/{model}/{summary}` (thvConsumers/Originations/Marketing/RiskManagement), `/{clip}/comparables`, `/{clip}/climate-risk-analytics/ar6/comprehensive` (CRA AR6), `/{clip}/building-permits`, `/{clip}/home-owners-association`, `/{clip}/propensity-scores/{clip}/{heloc|rent|sale|purchase|refinance}-score`, `/assessor-maps`, `/document-images/{product}`, `/avms/ram`. PropertyData/error envelope `{success, data:[], count, messages}`; HTTP 200/400/401/403/404/429/500.

---

## Integration Guides (verbatim)

### OAuth (REST host)
```
POST https://api.cotality.com/oauth/token
Content-Type: application/x-www-form-urlencoded
grant_type=client_credentials&client_id=<YOUR_CLIENT_ID>&client_secret=<YOUR_CLIENT_SECRET>&scope=openid
```

### Python
```python
import requests
auth_url = "https://api.cotality.com/oauth/token"
auth_payload = {"grant_type":"client_credentials","client_id":"YOUR_CLIENT_ID","client_secret":"YOUR_CLIENT_SECRET","scope":"openid"}
token = requests.post(auth_url, data=auth_payload).json()["access_token"]
headers = {"Authorization": f"Bearer {token}"}
r = requests.get("https://api.cotality.com/riskmeter-api/wildfire-risk",
                 params={"latitude":37.7749,"longitude":-122.4194}, headers=headers)
print(r.json())
```

### cURL quick reference
```bash
TOKEN=$(curl -s -X POST https://api.cotality.com/oauth/token \
  -d "grant_type=client_credentials" -d "client_id=YOUR_CLIENT_ID" \
  -d "client_secret=YOUR_CLIENT_SECRET" -d "scope=openid" | jq -r '.access_token')
curl "https://api.cotality.com/riskmeter-api/wildfire-risk?latitude=37.7749&longitude=-122.4194" -H "Authorization: Bearer $TOKEN"
curl "https://api.cotality.com/property/api/properties?address=1600+Pennsylvania+Ave+NW,+Washington,+DC+20500" -H "Authorization: Bearer $TOKEN"
curl "https://api.cotality.com/spatial-tile/parcels?lat=37.7749&lon=-122.4194" -H "Authorization: Bearer $TOKEN"
```

### Endpoint reference summary
| API | Base URL | Use |
|---|---|---|
| MCP Toolkit | `https://mcp.cotality.com/mcp` | AI assistant property data |
| RiskMeter API | `https://api.cotality.com/riskmeter-api/` | 83 hazard & property endpoints |
| Spatial Tile API | `https://api.cotality.com/spatial-tile/` | parcels, O&G, utility, map tiles |
| Property API V2 | `https://api.cotality.com/property/api/` | property data lookup |
| OAuth Token | `https://api.cotality.com/oauth/token` | auth (all APIs) |

*Source: developer.corelogic.com | 2026 Cotality.*
