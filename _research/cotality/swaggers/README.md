---
id: cotality_swaggers_readme
title: Cotality OpenAPI/swagger specs — index
date: 2026-06-06
kind: reference
owner: nick
---

# Cotality swagger specs

The machine-readable OpenAPI/swagger JSONs are the field-level source of truth for the Cotality adapters. **Authoritative home:** `P:\legacy-design-tools\lib\adapters\vendor\cotality\` (where the adapters consume them, per the full-data-layer-pack dispatch). Drop the **downloaded original files** there (and optionally mirror here) — do not retype the large ones; transcription would corrupt the field specs.

Human-readable consolidation: [`../2026-06-06_cotality_api_documentation_comet.md`](../2026-06-06_cotality_api_documentation_comet.md). Distilled catalog: [`../../2026-06-06_cotality_api_surface_catalog.md`](../../2026-06-06_cotality_api_surface_catalog.md).

## Unique specs (retrieved 2026-06-06 via Comet)

| Spec file | API | Auth scheme | Notes |
|---|---|---|---|
| `property-api-v2-openapi3-swagger.json` | Property API V2 | `property_auth` | CLIP detail, CRA AR6, AVM, Carfax. (Was sent twice — identical dupes.) |
| `spatial-tile-swagger.json` | Spatial Tile | `property_auth` | Parcel polygon (Parcel Point), SpatialRecord O&G + Utility tiers, map tiles. (Was sent 3× — identical dupes.) |
| `riskmeter-api-swagger.json` | RiskMeter | `spatial_auth` | 83 hazard/property/tax/geocode endpoints. |
| `location-openapi3-swagger.json` | Location | `location_auth` | CLIP summary/detail + landparcel & structure boundary geometry (WKT). |
| `interchange-openapi3-swagger.json` | InterChange | `interchange_auth` | Reconstruction building components (RCT Express). |
| `underwriting-center-api-openapi3-swagger.json` | Underwriting Center / Digital Hub | `uwc_jwt_auth` (token at `api1.cotality.com/jwt-auth/token`) | Roof condition insights, roof RCV, weather verification. |
| `wvs-api-openapi3-swagger.json` | Weather Verification Services | `wvs_auth` | Hail/wind/lightning/tornado history + maps (host `api.cotality.com`). |
| `taxservicingdata-openapi3-swagger.json` | Tax Servicing Data | `tax_inquiry_auth` | Tax payment/research inquiry. |
| `insight-api-openapi3-swagger.json` | Insight | `insight_auth` (uses `Clgx-Access-Key` query param) | Portfolio weather-impact monitoring. |
| `fraudprequal-openapi3-swagger.json` | FraudPrequal | `fraudprequal_auth` | Owner-occupancy / owned-properties analysis. |

Demo apps provisioned 2026-06-06: Property, RiskMeter, SpatialTile (the first three schemes). The rest need separate provisioning.
