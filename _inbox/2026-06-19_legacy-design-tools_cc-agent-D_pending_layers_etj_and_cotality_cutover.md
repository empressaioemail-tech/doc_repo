---
date: 2026-06-19
agent: cc-agent-D (data-layers)
repo: legacy-design-tools (+ hauska-engine for secret sync)
dispatch: pending data layers (rent heat, likely-to-sell, zoning verify, ETJ) + production Cotality cutover readiness
status: design + readiness report — NOT YET BUILT
related:
  - _inbox/2026-06-19_legacy-design-tools_cc-agent-D_map_brief_data_layer_audit.md
  - _inbox/2026-06-19_legacy-design-tools_cc-agent-D_cotality_cache_quota_design.md
---

# Pending layers + production cutover readiness

Priorities 2 and 3 from the data-layer dispatch. Each pending layer is specified with its provenance per commitment #1 (source, confidence, timestamp). The cutover section confirms exactly what is needed for plug-and-play when production keys land.

## A shared structural fact about the three pending map layers

Rent heat, likely-to-sell, and no-HOA are all per-CLIP Property enrichments. None is a native map geometry layer; none is in `MAP_LAYER_KEYS` (which is parcel-polygon, flood-zone, floodway, dem, topography, opportunity-zone-tract, zoning). To render any of them across a viewport you fetch a per-parcel Property attribute for each parcel in the mesh, which is N Property calls per viewport. That is why all three depend on the CLIP cache from the cache report. With the cache, the cost is once per parcel per TTL window and the surface densifies across sessions for free. Without it, none of them is affordable on any quota. Build order: cache first, then these.

This also keeps the map commitment-#1 compliant: the value rendered is cited reasoning (a modeled rent estimate, a propensity score, an HOA determination) anchored to parcels, not raw resold geometry, consistent with the map-extraction decision.

### Rent heat (Cotality rent AVM to a heat surface)

Source: Cotality Property rent AVM, `GET /v2/properties/{clip}/avms/ram`, already wired as `cotalityRentAvmAdapter` for the brief. Fields: `rentAvm`, `snapshotDate`.

Approach for launch: do not attempt a per-parcel AVM for every parcel in the viewport. Fetch rent AVM for a bounded sample (reuse the existing 25-per-bbox enrich cap), then interpolate a smooth surface over the viewport (inverse-distance or kernel) and render the fire-palette choropleth the operator wants. Label the surface explicitly as modeled and interpolated. Provenance: source `Cotality rent AVM (RAM)`, confidence asserted and deliberately lower than a point estimate because it is interpolated, timestamp from `snapshotDate`. As the CLIP cache fills across sessions the sample density rises and the surface tightens, with no extra quota cost. This is a new spine slot or, cleaner, a new reasoning-overlay surface fed from cached AVM points; it does not belong in the bbox geometry proxy.

### Likely-to-sell (Cotality propensity)

Source: Cotality propensity, `GET .../propensity-scores/{clip}/sale-score`, already wired as `cotalityPropensityAdapter` (it also pulls purchase and refinance). Field: `propensityScores.sale`.

Approach: propensity is a discrete per-parcel score, so render it as a parcel-fill color joined onto the existing parcel mesh, not a smooth surface. Max-gated. Cache by CLIP. Provenance: source `Cotality propensity`, confidence asserted, timestamp from the payload. Important framing already present in the code comments and worth preserving: propensity on the map is underwriting context, not a lead feed. The lead-engine use of propensity is a separate, tenant-private surface and must not be conflated with the public map coloring.

### No-HOA (Cotality HOA)

Source: Cotality Property HOA, `GET /v2/properties/{clip}/home-owners-association`. This adapter is not implemented yet (no HOA adapter exists in the codebase). It is a small addition modeled on the existing per-CLIP adapters. Output: a `hasHoa` boolean (plus any dues/name fields the endpoint returns) that drives a map filter (show only no-HOA parcels). Cache by CLIP. Provenance: source `Cotality HOA`, confidence asserted, timestamp from the payload. Note the data-quality caveat: HOA absence in the Cotality record is not a guarantee of no HOA, so the filter label should read as "no HOA on record" with the disclosure, not "no HOA," to stay honest under commitment #1.

### Zoning color (verify the bridge actually colors parcels)

The stdAddr to geocode to CLIP to site-location bridge is implemented (`brokerageGisLayers.ts` `resolveClipForSpatialRow` plus `fetchSiteLocationZoning`, mtime 2026-06-19), contradicting cc-agent-C's 2026-06-18 note that called it not implemented. What is unverified is whether it actually paints parcels end to end, and that verification is blocked by the exhausted Spatial Tile quota.

Safe verification path that burns at most one daily Cotality capture: run `captureBrokerageGisFixtureCli.ts` on the next quota reset. It fetches the Bastrop bbox tiles and runs the stdAddr-to-CLIP-to-site-location enrich at capture time, baking `zoningCode` and `landUseCode` onto the fixture features. Then `?fixture=1` serves real Cotality WKT shapes with zoning attributes and the extension agent verifies the choropleth colors against the fixture with zero further quota. This unblocks the visual agent and proves the bridge in one capture. Until that capture lands, the fixtures directory holds only a README and `?fixture=1` returns 503.

### ETJ (find a resolvable source, not the dead county host)

There is no ETJ source wired on the gis-layer path, and `gis.bastropcountytx.gov` is dead from Cloud Run (ENOTFOUND). The deeper issue is that ETJ is inherently municipal; there is no national ETJ polygon layer in Cotality. So treat it in two parts.

National baseline (reasoning attribute, every parcel): classify each parcel as in-city, ETJ, or unincorporated from Cotality RiskMeter jurisdiction endpoints (`/riskmeter-api/jurisdiction`, `/city`, `/county`), which resolve per point on the already-licensed RiskMeter key. This gives a national, commitment-#1-compliant jurisdiction signal without chasing per-county GIS, consistent with the national-baseline coverage model the radar already uses for the code layer.

Optional municipal overlay (polygon, where reachable): where a city publishes an ETJ polygon on ArcGIS Online (many Texas cities do, and AGOL hosts resolve from Cloud Run, unlike the dead county host), add it as an optional overlay toggle keyed per jurisdiction, not as the base layer. Validate the pattern against a known-reachable AGOL FeatureServer (for example the City of Austin open-data ETJ layer) before generalizing. Do not reintroduce the per-county-GIS-URL-chasing the national pivot retired; this is overlay polish only.

Recommendation: ship the RiskMeter national jurisdiction classification as the ETJ signal for launch, add municipal polygon overlays opportunistically. This keeps ETJ national and avoids the per-county dead end.

## Production Cotality cutover readiness

The goal is plug-and-play when the operator's production keys arrive. Status: both services already run the full demo stack, so the cutover is a secret-version swap plus a redeploy, not a code change.

### Products and what each is mandatory for

Property API v2 is mandatory. It supplies geocode, CLIP, site-location (zoning and land-use color), and the entire brief underwriting stack (AVM, comps, permits, liens, mortgage, tax, HOA, owner-occupancy, propensity, property detail). Token host `api1.cotality.com`, API host `api1.cotality.com/v2/properties`.

Spatial Tile is mandatory. It supplies the parcel polygon mesh (bbox) and the subject-parcel pin. Token and API host `api.cotality.com/spatial-tile`. This is the map mesh bottleneck and the product the explicit `/parcels` bbox-pagination quota ask is about.

RiskMeter is needed for the brief's sinkhole/karst Max layer and for the ETJ jurisdiction classification proposed above, plus any further hazard depth. Token and API host `api.cotality.com/riskmeter-api`. Not required for the map geometry base, but required if those reasoning layers stay in scope.

### Adapter completeness

Wired and ready for production keys: parcels, zoning, rent AVM, propensity, permits, liens, mortgage, tax, owner-occupancy, property detail, sinkhole. These flip from demo to production on the key swap with no code change.

Not wired (build before launch only if in scope): comps (`/comparables` exists at the provider, no adapter), and HOA (`/home-owners-association` exists, no adapter, needed for the no-HOA filter above).

### Quota to request

Spatial Tile `/parcels` bbox pagination, both concurrent and daily, is the headline ask (the map mesh). Property `/search/geocode` and `/{clip}/site-location` for the zoning enrich, plus the depth endpoints for the brief. With the cache from the companion report, sustained quota scales with unique geography covered rather than with user activity, which materially lowers the production quota the operator has to contract for. The order-of-magnitude figures in cc-agent-C's quota-scope doc (roughly 2,000 Spatial Tile and up to 2,600 Property calls per day at 50 users) are the uncached worst case; quote the cached curve to Cotality, not that one.

### Secret-sync plan

Both target services already mount all six `COTALITY_*` secrets via `:latest` references, verified live this session: cortex-api (`cortex-api-00237-sej`, project `legacy-design-tools-prod`) through `cloud-run-deploy.yml` `--set-secrets`, and hauska-engine-api (`hauska-engine-api-00017-cuy`, project `hauska-prod-497015`) through `--set-secrets` plus `COTALITY_PROPERTY_BASE_URL` set to the api1 host. The engine CLIP resolution needs Property and Spatial Tile; cortex needs all three.

Cutover steps when production credentials arrive. Add a new secret version for each of the six secrets in both projects' Secret Manager, writing values from a temp file and echoing the byte length before the curl test, never piping through PowerShell (the recurring pipe-truncation bug has written 2-char garbage secrets twice; this is the single most likely way to break the cutover). Then force a new revision on each service, because `:latest` is resolved at deploy time and adding a secret version does not roll the running revision on its own. On the engine, `hauska-engine/scripts/sync-cotality-secrets.ps1` copies the values from `legacy-design-tools-prod` to `hauska-prod-497015` and grants the accessor binding, then redeploy. Smoke each product to a 200 token mint and one real parcel call before shifting traffic. Because the demo keys expire on or about 2026-07-06, this swap is time-boxed; past that date the demo stack returns `InvalidClientIdentifier` on all three apps and both the map and the brief comps go dark.

### G2 display license scope

The G2 Cotality consumer-display license gates public consumer display of Cotality-derived parcel polygons and land-use/zoning attributes on the map surface. Development and internal QA proceed without it; public launch is gated on it, the same gate as the rest of the Cotality stack. It is a binding launch constraint alongside the production keys, not a development blocker. Per the GTM constraint already on record, Cotality parcel geometry is a metered pass-through COGS inside the product, never resold as a tile or data-export SKU, which is the framing the display-license conversation should sit inside.

## Recommended execution order

Cache (the companion report) first, because the pending layers and the cutover economics all depend on it. Then the zoning-bridge fixture capture and verification (one daily Cotality call, unblocks the visual agent). Then the per-CLIP reasoning layers in priority order: likely-to-sell (a simple parcel-fill join, cheapest), rent heat (the interpolated surface, the operator's headline visual), no-HOA (needs the new HOA adapter). ETJ national classification can land in parallel since it rides the RiskMeter key. The production cutover is operator-gated on the keys and the G2 license and is plug-and-play on our side once those arrive.
