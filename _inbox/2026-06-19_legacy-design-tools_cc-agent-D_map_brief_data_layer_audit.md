---
date: 2026-06-19
agent: cc-agent-D (data-layers; letter unconfirmed, see naming note)
repo: legacy-design-tools (+ hauska-engine recon)
dispatch: own + harden the radar DATA layers (map + brief); map visual quality is a separate agent
status: audit complete (DELIVERABLE 1) — code-grounded against live main + live prod describe
related:
  - _inbox/2026-06-19_legacy-design-tools_cc-agent-D_cotality_cache_quota_design.md
  - _inbox/2026-06-19_legacy-design-tools_cc-agent-D_pending_layers_etj_and_cotality_cutover.md
---

# Data layer audit — Max map + Property Brief

Every data layer behind the investor radar, traced to the adapter file, endpoint, status, field mapping, and per-request quota or COGS profile. This is the whole picture the operator asked to see first. The caching lever and the pending-layer wiring are the two companion reports linked in the frontmatter.

Ground-truth method: read against live `main` in both repos (legacy-design-tools `0312f44e`, hauska-engine `feat/map-layers-wave-3-geometry` merged `#73`), plus live `gcloud run services describe` for revisions and secret mounts. No Cotality quota was burned (the demo Spatial Tile daily quota is exhausted and the keys expire on or about 2026-07-06).

## Naming note (flagging early, per convention)

This dispatch created a new agent ("you own the DATA layers") with no assigned cc-agent letter. cc-agent-C already owns the GIS proxy route, the Cotality adapters, and brief Cotality depth in this same repo. I have filed under `cc-agent-D` to keep the per-repo single-owner-per-lane model legible, but the operator should confirm or reassign the letter so the fleet roster stays canonical. The lane split I am operating under is in the cache report; the short version is cc-agent-C owns the adapters and the proxy route, I own caching, the pending reasoning layers, and cutover readiness.

## Two data paths (this is the load-bearing distinction)

There are two distinct Cotality data paths, and they have completely different caching and quota behavior. Most of the audit only makes sense once this is clear.

Path A, the engine assemble (pin). `POST /map-data` on cortex-api routes to `routeAssembleMapLayers` (`engineSpineMapLayers.ts`), which calls `POST /v1/map-layers/assemble` on hauska-engine-api. The engine resolves CLIP and a single subject parcel polygon at `pageSize=1`, and runs federal adapters (FEMA, OZ, DEM, topo). This path goes through the engine runner, which has a Postgres `adapter_response_cache` keyed by `(adapterKey, latRounded5, lngRounded5)` with a 24h default TTL. So the subject-parcel pin is cached.

Path B, the cortex-api GIS proxy (bbox mesh). `POST /api/brokerage/v1/map-data/gis-layer` runs in-process on cortex-api in `brokerageGisLayers.ts`. It calls Cotality Spatial Tile directly for the viewport mesh (paginated bbox), then enriches each parcel with zoning by geocoding the parcel address to a CLIP and fetching site-location. This path has zero caching (verified: grep for `cache` in `brokerageGisLayers.ts` returns nothing). Every pan and zoom re-fetches. This is the map mesh hot path and the quota burn. SmartCity does raw bbox GeoJSON with no cache; right now so do we.

## Map layer matrix

| # | Layer | Source / provider | Path | Endpoint | Status | Key fields / mapping | Per-request quota / COGS |
|---|-------|-------------------|------|----------|--------|----------------------|--------------------------|
| 1 | Land use / parcels (geometry) | Cotality Spatial Tile | B (mesh) + A (pin) | `GET /spatial-tile/parcels?bbox=&pageNumber=&pageSize=50` | Live in code, quota-gated live (429); fixture not yet captured | `geometry` -> GeoJSON polygon; `apn`, `stdAddr/stdCity/stdState`, `clip` | Up to 4 Spatial Tile calls per bbox (4x50=200 parcels cap); 1 call per pin |
| 2 | Zoning / land-use color | Cotality Property site-location | B + A | `GET /v2/properties/{clip}/site-location` -> `landUseAndZoningCodes` | Bridge IS implemented (see note); unverified live; uncached | `zoningCode`, `zoningDescription`, `landUseCode`, `landUseDescription` | Up to 25 geocode + 25 site-location Property calls per bbox (the expensive part) |
| 3 | FEMA flood | Federal NFHL (public ArcGIS) | B + A | `MapServer/28/query` point or envelope | Live, public, not quota-gated | `FLD_ZONE`, `ZONE_SUBTY`, `SFHA_TF`, `STATIC_BFE` | 1 ArcGIS call; no auth, no Cotality cost |
| 4 | Opportunity Zones | Bundled federal tract GeoJSON | A (spine) | local point-in-polygon, `resolveOzTractSlot` | Live, fixture-backed, no upstream call | `inOpportunityZone`, `tractGeoid`, `ozRound`/`tractListVersion` | 0 upstream; in-process lookup |
| 5 | ETJ | none wired | n/a | n/a | Not implemented (no `BROKERAGE_GIS_ETJ_SERVICE_URL` adapter on the gis-layer path; `gis.bastropcountytx.gov` is dead) | n/a | n/a — see pending-layers report for a resolvable source |
| 6 | Rent heat | Cotality Property rent AVM (RAM) | brief only today | `GET /v2/properties/{clip}/avms/ram` | Fetched for the brief; NOT a map layer (absent from `MAP_LAYER_KEYS`) | `rentAvm`, `snapshotDate` | 1 Property call per CLIP; a viewport surface would be N calls (see below) |
| 7 | Likely-to-sell | Cotality propensity | brief only today | `GET .../propensity-scores/{clip}/sale-score` (+purchase, refinance) | Fetched for the brief; NOT a map layer | `propensityScores.{sale,purchase,refinance}` | 3 Property calls per CLIP; viewport = 3N |
| 8 | No-HOA | Cotality HOA | neither | `GET /v2/properties/{clip}/home-owners-association` | Not implemented (no HOA adapter found) | would map to `hasHoa` boolean filter | 1 Property call per CLIP; viewport = N |

Note on layer 2: cc-agent-C's 2026-06-18 quota-scope doc states the stdAddr to CLIP zoning bridge is "NOT IMPLEMENTED." That is now stale. The current code (`brokerageGisLayers.ts` lines 181-261, file mtime 2026-06-19) has the full bridge: `resolveClipForSpatialRow` tries the direct `clip` field, then falls back to `catalogAddressFromSpatialRow` -> Property `/search/geocode?bestMatch=true` -> `clipFromGeocodeJson` -> `fetchSiteLocationZoning`. It is wired but unverified against live (quota) and completely uncached, which is why it is the dominant Property-call cost on the map.

## Brief underwriting matrix

All of these are per-CLIP Property or RiskMeter calls. They are tier-gated (Pro+ or Max+). Whether they currently flow through any cache is an open verification item flagged in the cache report; the engine `adapter_response_cache` covers the runner path, but several of these are called directly from `brokerageSiteContext` and may be uncached.

| # | Layer | Source | Adapter | Endpoint | Status | Fields | Tier | COGS / request |
|---|-------|--------|---------|----------|--------|--------|------|----------------|
| 9 | Rent AVM | Cotality Property | `cotalityInvestorDepth.ts` | `/{clip}/avms/ram` | Live | `rentAvm` | Pro+ | 1 |
| 10 | Comps | Cotality Property (`/comparables` exists) | none | `/{clip}/comparables` | Not implemented | n/a | (Max) | would be 1 |
| 11 | Building permits | Cotality Property | `cotalityPermitsAdapter` | `/{clip}/building-permits` | Live | `buildingPermits` | Pro+ | 1 |
| 12 | Liens | Cotality Property | `cotalityLiensMortgageTaxAdapter` | `/{clip}/liens` | Live | `liens` | Pro+ | shares the 3-call fan-out |
| 13 | Mortgage | Cotality Property | same | `/{clip}/mortgage/current` | Live | `mortgageCurrent` | Pro+ | shares fan-out |
| 14 | Tax | Cotality Property | same | `/{clip}/tax-assessments/latest` | Live | `taxAssessment` + MUD/PID scan | Pro+ | shares fan-out (3 calls total) |
| 15 | HOA | Cotality Property | none | `/{clip}/home-owners-association` | Not implemented | n/a | (Pro) | would be 1 |
| 16 | Owner-occupancy | Cotality Property | `cotalityOwnerOccupancyAdapter` | `/{clip}/ownership` | Live | `ownerOccupiedIndicator` | Pro+ | 1 |
| 17 | Propensity | Cotality Property | `cotalityPropensityAdapter` | `/{clip}/propensity-scores/{clip}/{sale,purchase,refinance}-score` | Live | `propensityScores` | Pro+ | 3 |
| 18 | MUD / PID | Cotality tax payload + TX Comptroller registry | `mudPidRegistry.ts` (file-based) + tax-scan | local registry, no HTTP | Live (hybrid, file-based registry) | `mudPidDetected`, `specialDistrictLabels`, `exposure` | Pro+ | 0 extra (rides the tax fan-out) |
| 19 | Property detail (owner, sale, AVM, txn) | Cotality Property | `cotalityExtended.ts` | `/{clip}/property-detail`, `/avm/thv/{model}/summary`, `/{clip}/transaction-history` | Live | `propertyDetail`, `avm`, `transactionHistory` | Pro+ | up to 3 |
| 20 | Sinkhole / karst | Cotality RiskMeter | `cotalitySinkholeAdapter` | `/riskmeter-api/sinkhole-integrated` | Live | `sinkholeIntegrated` | Max+ | 1 (RiskMeter) |
| 21 | Code layer (ADU / setback / STR / pool / addition) | Engine atom corpus, websearch fallback | `brokerageBriefLocalCode.ts` + `brokerageCodeQueries.ts` | vector retrieval, then web reasoning | Live (hybrid) | `sections`, `citations`, `localCodeSource: corpus\|websearch\|none`, `coverage.degraded` | All tiers | 0 Cotality; corpus is local, websearch is token cost only |

## Status rollup

Live and real (code present, returns real data when keys work): parcels geometry, zoning bridge, FEMA, Opportunity Zones, rent AVM (brief), permits, liens, mortgage, tax, owner-occupancy, propensity, MUD/PID, property detail, sinkhole, code layer.

Pending (data exists at the provider, not wired to the surface that needs it): rent heat as a map surface, likely-to-sell as a map layer, no-HOA as a map filter. All three are per-CLIP Property enrichments that have no viewport-scale wiring and, more importantly, no cache to make viewport scale affordable.

Not implemented at all: ETJ (no source on the gis-layer path), comps adapter, HOA adapter.

Quota-gated (works in code, blocked live): the entire Spatial Tile mesh and the zoning enrich, because the demo Spatial Tile quota is exhausted (100 req/day) and the one-shot real-shape fixture has not been captured yet (the fixtures directory holds only a README; `?fixture=1` returns 503 `fixture_unavailable` until a capture lands).

## Live verification (this session, no quota burned)

cortex-api is serving `cortex-api-00237-sej` at the default URL `https://cortex-api-tds7av26va-uc.a.run.app`, with all six `COTALITY_*` secrets mounted. hauska-engine-api is serving `hauska-engine-api-00017-cuy` with all six `COTALITY_*` secrets mounted plus `COTALITY_PROPERTY_BASE_URL=https://api1.cotality.com/v2/properties`. So the secret-mount blocker the 2026-06-18 recon flagged on the engine is resolved; both services have the demo keys. The remaining live blockers are quota and the production-key cutover, not configuration.

## The single highest-leverage finding

The map mesh hot path (Path B) is uncached, and the zoning enrich on that path costs up to 25 geocode plus 25 site-location Property calls per bbox. The three pending reasoning layers (rent heat, likely-to-sell, no-HOA) are each a per-CLIP Property enrichment that multiplies by the parcel count of the viewport. Without a persistent cache keyed by tile and by CLIP, those layers cannot exist at viewport scale on any quota, demo or production. The cache is therefore not a hygiene task, it is the precondition for layers 6, 7, and 8 and the cost control for the production cutover. That design is the next report.
