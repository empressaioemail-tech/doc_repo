---
id: 75l_cotality_data_stack_catalog
title: Cotality data stack — master catalog, wiring, access status, and where to use what
status: superseded-as-plan-of-record
last_updated: 2026-07-13
applies_to: portfolio
owner: nick
related: [75g_investor_deal_radar, 75c_property_brief_data_backlog, 75k_max_map_quality_direction, _decisions/2026-06-18_map_engine_maplibre_cotality_national, cotality-oauth-three-keys, cotality-demo-quota-production-gate]
---

# Cotality data stack — master catalog

> **2026-07-13: superseded as the plan of record.** Cotality went dark at OAuth (~07-06 demo-key expiry, vendor unresponsive) and the wedge surfaces migrated to public-record providers per [`_decisions/2026-07-13_cotality_swap_public_record_migration.md`](_decisions/2026-07-13_cotality_swap_public_record_migration.md): county-GIS parcel mesh, `cad_property` store (1.07M properties, 5 counties), CAD brief slots, neutral APN+FIPS parcel key. All Cotality adapters remain wired but dormant behind config; this catalog stays accurate as the re-entry reference if production keys ever land.

The full Cotality stack, what each product gives, where we wire it today, the live access status (probed 2026-06-19), and suggestions for the data we are NOT yet using. Goal: full wiring across the data stack. This is also the log of the entitlement findings to take to Cotality Data Implementation Services.

## Three products, three hosts, three keys

| Product | Keys | OAuth + base host | Auth shape |
|---|---|---|---|
| Property API v2 | `COTALITY_PROPERTY_*` | `api1.cotality.com` → `/v2/properties` | OAuth2 client_credentials, HTTP Basic, `grant_type` in query, empty body + `Content-Length: 0` |
| Spatial Tile | `COTALITY_SPATIALTILE_*` | `api.cotality.com` → `/spatial-tile` | same |
| RiskMeter | `COTALITY_RISKMETER_*` | `api.cotality.com` → `/riskmeter-api` | same |

All three keys are present and well-formed (key 48 / secret 64), and **all three mint OAuth tokens (200)**. The gates are on the data endpoints, not the credentials.

## Live access status (probed 2026-06-19)

| Product | OAuth | Data call | Verdict |
|---|---|---|---|
| Property | ✅ 200 | `/v2/properties` geocode → **403 "account not entitled"** | partial entitlement — geocode/search endpoint NOT entitled on the demo account (site-location reportedly returned 200 earlier; endpoint-specific) |
| Spatial Tile | ✅ 200 | `/spatial-tile/parcels` → **429 "100 requests per 1 day"** | entitled + working, demo-quota-capped |
| RiskMeter | ✅ 200 | `/riskmeter-api` → **401 "no apiproduct match found"** | not subscribed/matched — not accessible |

So it is NOT "everything works" and NOT uniformly "quota." Spatial Tile is quota-blocked; Property has endpoint-level entitlement gaps; RiskMeter is not matched. Demo keys are 100 req/day and expire ~2026-07-06. The vendor ask: production keys with full Property entitlements, a RiskMeter product subscription, a Spatial Tile quota (~2k/day), and the consumer display license.

## Data catalog — available, wired, used, unused

| Data | Cotality source | Wired adapter | Where used today | Status / suggestion |
|---|---|---|---|---|
| Parcel boundary geometry | Spatial Tile `/parcels` | `cotalitySpatialTile` | Max map parcel mesh | wired; quota-blocked |
| Zoning / land use code | Property `/{clip}/site-location` | `cotality:property` | brief (zoning), map parcel coloring | wired; Property-entitlement gated |
| Comparables (comps) | Property `/{clip}/comparables` | `cotalityCompsAdapter` | brief underwriting (comps) | wired; gated |
| HOA | Property `/{clip}/home-owners-association` | `cotalityHoaAdapter` | brief + map "No HOA" layer | wired; gated |
| AVM (value + rent) | Property `/avm` | (partial) | rent-heat surface (map), value estimate (brief) | partially wired → **finish: drives the rent-heat layer + the brief's value/rent estimate** |
| Tax assessment | Property | (via property attrs) | brief | confirm wiring |
| CLIP / geocode | Property `/v2/properties` | `resolveCotalityClip` | the join key for every per-parcel attr | wired; the entitlement gap here is load-bearing (no CLIP → no site-location/comps/HOA) |
| **Building permits** | Property | not wired | — | **SUGGEST: rehab/value-add detection ("what's been pulled here"), the brief's "Rehab reality" signal, and a comp-quality filter** |
| **Propensity / likely-to-sell** | Property | not wired | — | **SUGGEST: the map "Likely to sell" layer + the lead/deal-sourcing signal — the highest-value unwired signal for the investor wedge** |
| **Owner-occupancy / absentee** | Property | not wired | — | **SUGGEST: absentee-owner = motivated-seller targeting; a map layer + a brief signal** |
| **Mortgage / liens / equity** | Property | partially (liens noted) | — | **SUGGEST: equity-position + distress signals ("what kills this deal", motivated seller)** |
| **Transaction / ownership history** | Property | not wired | — | **SUGGEST: flip detection, hold-period, last-sale price vs ask (the "does it pencil" basis)** |
| **Property characteristics** (beds/baths/sqft/year/lot) | Property | partial | brief header | **SUGGEST: confirm full wiring so the brief doesn't re-scrape from the listing** |
| **Hazard risk** (flood depth, wildfire, wind) | RiskMeter | wired (gated) | brief "Insurance and flood cost" chip; map hazard | wired; product not matched — **needs the RiskMeter subscription; then drives insurance-cost + the map hazard surface** |
| Visual basemap tiles | Spatial Tile `/spatial-tile/map` (raster) | not used | — | we use Carto for the basemap; Cotality raster is an option, not needed |

## The "full wiring" roadmap (suggested order, gated on production keys)

1. **Production Cotality keys** (the precondition for all of it) — Property full entitlement + RiskMeter subscription + Spatial Tile quota + display license.
2. **Finish the high-value unwired signals** that make the radar a deal-sourcing engine, not just a brief: propensity/likely-to-sell, owner-occupancy/absentee, building permits, mortgage/equity, transaction history. These are exactly the investor-underwriting + lead signals.
3. **RiskMeter** → the insurance-cost chip + the map hazard surface.
4. **AVM** → finish the rent-heat surface + value estimate.
5. Cross-seed the brief's `adapter_response_cache` with the map's `cotality_property_attr_cache` by CLIP (PR #195 follow-up) so one underwrite seeds both surfaces.

Every wired field carries source + confidence + timestamp (commitment #1). All Cotality consumer display is gated by the G2 display license at public launch.
