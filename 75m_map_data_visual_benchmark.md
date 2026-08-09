---
id: 75m_map_data_visual_benchmark
title: Map data and visual benchmark — every layer, its visual treatment, status, and wiring gap
status: active, PARTIALLY SUPERSEDED 2026-08-08 (Cotality path extinguished; see correction note)
last_updated: 2026-08-08
applies_to: portfolio
owner: nick
related: [75k_max_map_quality_direction, 75l_cotality_data_stack_catalog, 75g_investor_deal_radar, 75c_property_brief_data_backlog, 55_spine_data_intelligence_stack, _decisions/2026-06-18_map_engine_maplibre_cotality_national]
---

## CORRECTION 2026-08-08: MUD/PID and Texas RRC "LIVE" status ran through the dead Cotality/extension path

Cotality was extinguished as of 2026-07-13 (per the standing decision that live code hitting Cotality is a wrong-routing defect, not a credential to rotate; Regrid is also dead). This doc's 2026-06-19 "LIVE" markings for TX Comptroller MUD/PID and Texas RRC below were verified against the map/extension stack that existed before that reversal. They have NOT been re-verified against the current (post-Cotality) map path. Do not cite MUD/PID or Texas RRC as LIVE without a fresh live-smoke check against the current deployed map path. Every table row below carrying these two layers is marked SUPERSEDED, not corrected to a new status, because the current state was not re-queried in this pass; that is a follow-up, not something to guess at here. Doctrine: a coverage claim ("LIVE") must name which of code-exists / data-loaded / served-to-product it means and must be checked against the live deployed path, not a session note from a since-reversed architecture.

# Map data and visual benchmark

This is the standing benchmark for the Max map feature. It enumerates every piece of data in scope, how it is (or should be) visually represented on the map, its current build status, the wiring gap, and the action to close it. It is the reference we QA against and build toward. Review map work against this doc; update statuses here as tracks land rather than restating progress elsewhere.

The objective is the most visually stunning map feature possible, carrying cited reasoning rather than raw data (commitment #1: source, confidence, timestamp on every layer via the EngineEnvelope; commitment #2: confidence surfaced, not asserted).

## The Cotality split (read this first)

The visual ceiling does not depend on Cotality. The dark editorial basemap, terrain and hydrology from free USGS data, FEMA flood, Opportunity Zones, and synthetic fixtures are all live or free today. Cotality production unlocks real per-parcel data fill (rent, propensity, comps, hazard scores), but the map can reach its visual ceiling now while the Cotality production request is pending. Every gap below is tagged buildable-now (free + fixture) or Cotality-gated. Lead the visual push with buildable-now.

Status legend used throughout: LIVE (real on map) · FIX (fixture on map, real data gated) · GATE (built, gated on Cotality production) · BRIEF (live in the brief, not yet on the map) · FREE-UNWIRED (free data available, no map layer yet) · NEW (proposed composite or report, not built).

## Live status — 2026-06-19 session (what landed, verified against live)

This section is the running progress marker against the tables below. Verified live, not from report text.

Render gate cleared. The #1 visual gate (the 2D land-use choropleth + rent-heat flashing on load then vanishing to near-black) was root-caused and fixed. Cause was not z-order/data/style-reset as the static analysis guessed; it was a MapLibre render-loop crash. Two `line-dasharray` sources crashed `setConstantDashPositions` ("Cannot read properties of null (reading 'y')") on every frame and exhausted the LineAtlas ("LineAtlas out of space"), blanking the whole map: the static choropleth line (removed in extension v0.6.30) and the animated hydrology-flow loop that set a new unique dash every requestAnimationFrame frame (made static in v0.6.31, commit `067413f` on `map/track123-visual-ceiling`). The fixture choropleth + rent-heat now render and stay. Hydrology flow renders as static glowing channels; animated flow is deferred to a crash-safe technique (line-gradient + line-progress), never per-frame dasharray mutation.

Federal layers deployed to cortex-api prod (`cortex-api-00249-fil` @ 100%, PR #197 rebased onto the user-aware fix). Live smoke against the canary, fixture:false:
- groundwater (USGS NWIS): now LIVE. Root cause of the prior HTTP 400 was `format=json` + bBox; fixed to `format=rdb` + tab parser + 3-attempt retry. Bastrop bbox returned 7 features.
- edwards-aquifer (TX): now LIVE via the Austin COA mirror chain (the dead TCEQ recharge MapServer was decommissioned, returns 404). 6 features on the COA bbox; Austin layers do not cover the Bastrop viewport.
- mud-pid and texas-rrc: adapters confirmed working as of 2026-06-19 (Austin metro 27 districts; Houston 3493 wells). The earlier Bastrop 404s were valid no-coverage in a tiny viewport, not bugs. **SUPERSEDED 2026-08-08: this verification ran through the Cotality/extension map path, extinguished 2026-07-13. Not re-verified against the current path; treat as unconfirmed until re-checked live.**
- ssurgo-soils: DEGRADED. Upstream ECONNRESET / TLS reset from Cloud Run to the USDA gSSURGO host; marked `degraded:true` in the layer list, not blocking. Separate USDA-connectivity investigation owed.
- usgs-geology / usgs-seismic: brief-path adapters only; not exposed on the map `/gis-layers` path. The 75c/75i-vs-55/61 "available vs unwired" conflict is resolved by this: geology/seismic are brief adapters, not map layers, and SSURGO is wired-but-upstream-degraded on the map path.
- composites (buildable-envelope, constraint-density, oz-deal-crossfilter, motivated-seller): return 200 but are synthetic stubs even at fixture:false; real fill is Cotality-gated.

Durability gap (operator directive 2026-06-19): the goal is these map features AND the engine analyses (hydrology D8, soils, contours, groundwater, geology) built durable and engine-backed, not fixture. Tracks 1-3 below carry that; the engine-side hydrology/subsurface visualization and the SSURGO connectivity fix are the durability work. The hauska-engine deploy carrying the groundwater `format=rdb` fix for the brief path is still owed (the fix is in `lib/adapters` but the engine was not redeployed).

Open per-vendor item unchanged: Cotality production (Property entitlement + RiskMeter subscription + Spatial Tile quota + G2 display license) remains the standing gate for all real per-parcel fill. Cotality does NOT provide the federal/environmental layers (soils, groundwater, geology, aquifer, special districts, O&G, FEMA zones, DEM); those are separate free government sources, each its own integration. See `75l_cotality_data_stack_catalog.md`.

## Part A — Full map data universe

Every source that feeds or could feed the map. Map status is specifically on the map, not in the brief.

| Source | Provider | What it gives the map | Cost | Map status |
|---|---|---|---|---|
| Carto dark_all | CartoDB | Dark editorial basemap (the canvas) | vendor | LIVE v0.6.25 |
| Cotality Spatial Tile | Cotality | National parcel polygons (the mesh) | quota-gated | FIX (192-parcel mesh); real gated |
| Cotality Property | Cotality | Zoning/land-use fill, rent-AVM, propensity, HOA, comps, permits | entitlement-gated | FIX coloring; real gated |
| Cotality RiskMeter | Cotality | Flood-depth, wildfire/wind/hail/quake, roof, foundation, RCV | not subscribed | not on map |
| FEMA NFHL | Federal | Flood zone + floodway overlay | free | LIVE (recolored cyan) |
| USGS 3DEP | Federal | DEM raster: terrain, hillshade, contours, slope | free | DEM on engine; terrain styling not yet |
| USGS EPQS | Federal | Point elevation | free | feeds brief, not a layer |
| Opportunity Zones | Federal GeoJSON | OZ tract highlight | free | LIVE |
| NOAA Atlas 14 | Federal | Design-storm rainfall (hydrology forcing) | free | engine input, not a layer |
| Hydrology engine (pysheds D8) | Hauska + USGS | Flow paths, drainage accumulation | compute | computed, not visualized |
| USDA SSURGO | Federal | Soils: shrink-swell, drainage, bearing | free | DEGRADED on map (USDA TLS ECONNRESET from Cloud Run) |
| USGS geology / seismic | Federal | Bedrock, site class, karst/sinkhole | free | brief adapters only; not a map layer |
| USGS NWIS | Federal | Groundwater table | free | LIVE on map (rdb fix, 2026-06-19) |
| EPA EJScreen | EPA (frozen mirror) | Environmental-justice context | free | feeds brief; not a layer |
| TX Comptroller MUD/PID | State | Special-district encumbrance | free | SUPERSEDED, was LIVE on map (2026-06-19), verified through the now-dead Cotality/extension path; not re-checked |
| TCEQ Edwards Aquifer | State (TX) | Recharge/contributing zones | free | LIVE on map via Austin COA mirror (TX-only), not Cotality-dependent per its own adapter chain, but not re-verified in this pass |
| Texas RRC | State (TX) | O&G wells, pipelines (public) | free | SUPERSEDED, was LIVE on map (2026-06-19), verified through the now-dead Cotality/extension path; not re-checked |
| Listing scrape (Zillow/Redfin/Unlock MLS) | portals | Address entry + asking price | free | LIVE (input, not layer) |
| Stripe / Pipedrive | SaaS | Tier gate / CRM | fees | gate + sync, not visual |

Dropped/deferred: Regrid (superseded by Cotality), Shovels permits, FAA airspace, FCC broadband (WAF-blocked).

Headline: a large amount of map-able, free, federal data is unused as a visual layer (terrain relief, hydrology flow, soils, contours, groundwater). None of it is Cotality-gated. This is the under-exploited reserve for the visual bar.

## Part B — Visual vocabulary (what stunning reaches for)

North-star is Carto award dataviz: saturated, full-coverage, layered surfaces glowing on a dark canvas, screenshot-worthy for a pitch. Operator-named references: rent-heat fire choropleth, fully-saturated edge-to-edge zoning fill, glowing dot-density.

Levers already in the codebase (tuning, not new infra): warm-dark canvas `#16110c`, `landUseFillColorExpr()` palette, MapLibre heatmap fire ramp, dark-glass legend, confidence-scored pins, EngineEnvelope vintage + confidence on every layer.

Missing vocabulary to reach stunning, buildable now:

Terrain depth. The canvas is flat today. Hillshade relief from the DEM under the parcels gives the whole map physical depth. Single biggest wow lever, free USGS data already ingested.

3D. MapLibre fill-extrusion. Extrude parcels by allowed-height or improvement value; extrude terrain. A tilted 3D city of zoning envelopes is the screenshot.

Motion. Animated hydrology flow (water tracing D8 paths), a climate time-slider morphing the hazard surface to 2050, smooth layer-toggle transitions. Motion separates award dataviz from a GIS viewer.

Glow/bloom compositing. The fire heat and dot-density read as premium only with additive blending and a bloom pass. Pure styling.

## Part C — Composite layers (correlation exercise)

Derived layers from combining primitives we already hold; more useful and more striking than any raw layer. All are proposals (NEW) until built.

1. Buildable-envelope surface. parcel − floodway − 100yr floodplain − steep slope (DEM) − aquifer recharge − wetlands. Carved parcel showing the glowing developable footprint. Answers "can I build" spatially. Inputs all free/engine. Highest-value composite, Cotality-independent.

2. Deal-score choropleth. Composite of (AVM vs asking spread) + rent yield + propensity-to-sell + permit activity − hazard penalty, normalized to one warm-to-cool fill. The investor wedge as a map. Cotality-gated for real data; fixture-able now.

3. Yield / cap-rate surface. rent-AVM ÷ sale-AVM per parcel. More investor-relevant than raw rent heat, same data. Cotality-gated.

4. Motivated-seller heat (IN per operator 2026-06-19). propensity-to-sell × absentee-owner × equity-position × tax-delinquency. The standalone lead feed was cut for v1, but motivated-seller map context is in scope. Cotality-gated.

5. Rehab-opportunity layer. old year-built + no recent permits + below-median AVM inside a rising-rent zone. Cotality-gated.

6. Hydrology flow overlay. Engine already computes D8 flow. Render accumulation as glowing animated blue channels across hillshaded terrain. Pure engine + free data, zero Cotality. The prettiest item and buildable now.

7. Allowed-vs-built 3D envelope. Extrude each parcel to zoning-allowed height; overlay actual structure height. The gap is the upside, in 3D. Zoning in brief already; geometry needs the mesh.

8. Climate-trajectory time-slider. AR6 (now/2030/2040/2050) morph the hazard surface forward on a scrubber. Cotality AR6-gated; FEMA-only version animates today.

9. Constraint-density overlay. Count of overlays touching each parcel (FEMA + aquifer + OZ + MUD/PID + soils hazard). Mostly free data.

10. OZ × deal-score cross-filter. Parcels that are both Opportunity Zones and score as deals = tax-advantaged deals. Cheap, high-signal.

11. Comp web. Comps as similarity-sized pins with lines to the subject. Cotality-gated.

12. Foundation-risk choropleth. SSURGO shrink-swell, red where expansive-clay foundation cost is high (very Texas). Free data, unwired.

## Part D — Engine reporting catalog and net-new reports

The engine produces or can: elevation, DEM/topography, contours, flood zone, floodway, site drainage (D8), rainfall forcing, flood depth, the full Cotality-fed property/market/hazard set, plus code findings, lay summaries, precedence, and the atom families. Hydrology is one of roughly a dozen geospatial analyses it can run.

Net-new report types the same primitives could produce (proposals):

1. Buildable-area report. Quantified developable sqft after every constraint subtracted. Pairs with composite 1.
2. Stormwater/detention report. D8 flow + impervious-cover limit, detention requirement estimate.
3. Cut-and-fill grading report. DEM, earthwork volume for a pad, construction cost driver.
4. Solar/aspect report. DEM aspect, orientation and solar exposure, renderable as a sun-path.
5. Viewshed report. What is visible from the parcel, view premium.
6. Insurance-cost estimate. Composite hazard, annual premium band.
7. Cash-flow pro forma. rent-AVM − tax − insurance − HOA − maintenance, NOI, cap rate. The does-it-pencil report.
8. Rehab-scope report. year built + permits + code deltas, likely rehab needs and cost band.
9. Comparative-jurisdiction report. Same build across adjacent jurisdictions, ranked by friendliness. Uses the precedence engine.
10. Risk-trajectory report. AR6 horizons, how insurability and value trend to 2050.
11. Subsurface-suitability report. soils + geology + groundwater + karst, foundation/septic suitability.
12. Encumbrance report. liens + deed restrictions + CC&Rs + MUD/PID, what is attached to this dirt.

Each is sell-reasoning-not-data: a cited verdict, not a raw field dump.

## Part E — Master benchmark table

### Base, terrain and hydrology (mostly Cotality-independent)

| Data | Visual representation (current or should-be) | Status | Gap | Action |
|---|---|---|---|---|
| Carto dark basemap | The canvas | LIVE | per-zoom saturation/contrast tuning added (v0.6.32) | done |
| DEM terrain | Hillshade relief under parcels (2D raster) | 2D-BUILT (v0.6.32, fixture; pending Chrome verify) | 3D tilt deferred to next-pass; real 3DEP swap is the follow-on | swap fixture DEM for live engine 3DEP raster |
| Contours | 5m elevation lines | 2D-BUILT (v0.6.32, fixture; pending verify) | solid lines only (dasharray crashed MapLibre); drawn above the choropleth | swap to real DEM contours |
| Slope | Slope-shade / steep-area mask | FREE-UNWIRED | none | derive from DEM |
| Hydrology D8 flow | Static blue flow channels (animation deferred) | 2D-BUILT (v0.6.32, static fixture) | per-frame animation removed (dasharray crash, v0.6.31); real D8 seam unaligned | align live D8 geojson |
| FEMA flood zone | Translucent cyan fill | LIVE | none | keep |
| Floodway | Distinct hazard band | LIVE | none | keep |
| Buildable envelope | Carved parcel showing developable area | NEW | composite not built | compose terrain + flood + aquifer |

### Parcel, zoning and regulatory overlays

| Data | Visual representation | Status | Gap | Action |
|---|---|---|---|---|
| Parcel mesh | Edge-to-edge tessellated fill | FIX | real geometry gated | Cotality Spatial Tile prod + cache |
| Zoning/land-use | Saturated land-use choropleth | FIX | real fill gated | Cotality Property prod |
| Allowed-height envelope | 3D fill-extrusion by zoning | DEFERRED (next-pass) | 3D explicitly deferred per operator | re-add with terrain in 3D pass |
| Opportunity Zones | Highlighted tracts | LIVE | none | keep |
| MUD/PID districts | Special-district overlay | SUPERSEDED (was LIVE 2026-06-19, via dead Cotality path) | re-verify against current map path | re-check live before citing as LIVE |
| Edwards Aquifer | Recharge-zone overlay (TX) | LIVE (not Cotality-routed; unconfirmed in this pass) | TX-only; Austin COA mirror | keep, re-verify |
| ETJ / jurisdiction | City vs ETJ vs unincorporated fill | BACKLOG | no adapter | RiskMeter baseline + AGOL overlay (Cotality-gated) |
| Constraint density | Encumbrance heat | NEW | composite | stack overlays per parcel |

### Investor / valuation (Cotality-gated, fixture-able now)

| Data | Visual representation | Status | Gap | Action |
|---|---|---|---|---|
| Rent AVM | Fire-ramp heat surface | FIX | real gated | Cotality prod + CLIP cache |
| Sale AVM | Parcel value tint | BRIEF | no layer | join to mesh |
| Yield / cap-rate | rent÷value heat | NEW | composite | derive on cache |
| Propensity-to-sell | Likely-to-sell choropleth | GATE | gated | Cotality prod |
| Absentee owner | Absentee parcel fill | BRIEF | no layer | join ownership |
| Comps | Similarity-sized pins + web | BRIEF | no layer | render comp web |
| Building permits | Permit-activity heat (development pulse) | BACKLOG | unwired | wire /building-permits |
| Liens / equity | Distress markers | BRIEF | no layer | join + style |
| HOA / No-HOA | Boolean parcel filter | GATE | adapter pending | wire HOA endpoint |
| Deal score | Composite warm-cool fill | NEW | composite | compose on cache |
| Motivated-seller | Lead heat (IN) | NEW | composite | compose propensity + absentee + equity + tax |
| Rehab opportunity | Value-add glow | NEW | composite | compose on cache |

### Hazard, climate and subsurface

| Data | Visual representation | Status | Gap | Action |
|---|---|---|---|---|
| Flood depth (return periods) | Graduated inundation surface | GATE | RiskMeter not subscribed | RiskMeter subscription |
| Wildfire / wind / hail / quake | Peril heat layers | GATE | not subscribed | RiskMeter subscription |
| Climate AR6 trajectory | Time-slider hazard morph | GATE | gated | RiskMeter/Property AR6 prod |
| Insurance cost | Composite cost surface | NEW | composite | compose hazards + RCV |
| SSURGO soils | Shrink-swell foundation-risk choropleth | DEGRADED | USDA TLS ECONNRESET from Cloud Run | fix USDA connectivity (retry/proxy/alt host) |
| Geology / karst / sinkhole | Subsurface hazard overlay | BRIEF | brief adapter only; not a map layer | fix Vs30; add map layer if wanted |
| Groundwater (NWIS) | Water-table overlay | LIVE (not Cotality-routed; unconfirmed in this pass) | none (rdb fix 2026-06-19) | keep; engine deploy owed for brief path; re-verify |
| O&G / minerals | Wells + lease overlay | SUPERSEDED (was LIVE via TX RRC through dead Cotality path, 2026-06-19) | re-verify against current map path | re-check live before citing as LIVE |
| EJScreen | EJ context overlay | BRIEF | no layer; frozen mirror | optional layer + freshness flag |

### Interaction and meta (the polish layer)

| Element | Should-be | Status | Action |
|---|---|---|---|
| Research pins | Glowing confidence-scored pins | LIVE | keep |
| Legend | Dark-glass, vintage + confidence per layer | LIVE | extend per new layer |
| Tooltips/click | Cited reasoning, not raw fields | LIVE | keep (commitment #1) |
| Layer animation | Smooth toggles, flow, time-slider | PARTIAL (v0.6.32) | 420ms toggle transitions + per-zoom canvas tuning built; time-slider backlog |
| 3D camera | Tilt/rotate, extrusion | DEFERRED (next-pass) | explicitly deferred per operator; not in this pass |

## Part F — Bring-it-up-to-speed plan (dependency-ordered)

Track 1 — Visual ceiling on free + fixture data (no Cotality dependency). DEM hillshade relief under parcels. Hydrology D8 flow as animated glowing channels. Contours. MapLibre terrain + 3D camera tilt. fill-extrusion on the fixture mesh (allowed-height envelopes). Bloom/saturation styling pass and smooth layer-toggle transitions. Moves the map to stunning, fully demoable while Cotality is pending.

Track 2 — Free federal layers currently unused (parallel, no Cotality). Wire SSURGO soils (foundation-risk choropleth), USGS groundwater, MUD/PID overlay, Edwards Aquifer (TX), Texas RRC minerals into the gis-layer path. Fix the geology Vs30 site-class bug while in there.

Track 3 — Composite/derived layers on data we hold (depends on Tracks 1-2 inputs). Buildable-envelope surface first (terrain + flood + aquifer, all free). Then constraint-density, OZ×deal cross-filter, and the motivated-seller composite (lead IN). The differentiators that make it smart, not just pretty.

Track 4 — Cotality production unlock (gated on the vendor request + licenses). Precondition: production Property entitlement, RiskMeter subscription, Spatial Tile ~2k/day quota, G2 consumer-display license. On landing: real parcel mesh + zoning fill, rent-heat with real AVM, propensity choropleth, HOA filter, comps web, RiskMeter hazard surfaces. Then the gated composites: deal-score, yield, insurance-cost, climate time-slider. The CLIP cache (PR #195 follow-up) is the cost-control precondition so one underwrite seeds both brief and map.

Track 5 — New reporting (rides the same data, surfaces in brief + map click-through). Buildable-area, cash-flow pro forma, stormwater/detention, rehab-scope, comparative-jurisdiction, risk-trajectory. Each becomes a cited brief section and a map pin verdict.

## Verification gate — RESOLVED 2026-06-19

The status conflict (SSURGO/geology "available-on-engine" vs "unwired/degraded") was resolved by a live smoke against the deployed cortex-api map path, not the doc set:
- SSURGO is wired on the map path but upstream-DEGRADED (USDA gSSURGO TLS ECONNRESET from Cloud Run). Real issue, separate connectivity fix owed.
- USGS geology / seismic are brief-path adapters only, not exposed on the map `/gis-layers` path. So "available on engine" (brief) and "no map layer" are both true and not in conflict.
- groundwater, edwards, mud-pid, texas-rrc were verified LIVE on the map path as of 2026-06-19 (see Live status above). **SUPERSEDED 2026-08-08 for mud-pid and texas-rrc specifically: that verification ran through the Cotality/extension path, extinguished 2026-07-13; not re-checked against the current path.** Groundwater and Edwards were not Cotality-routed per their adapter chains but were also not re-verified in this pass.

Remaining durability items (operator wants these built durable, not fixture):
- SSURGO USDA connectivity fix (retry/proxy/alternate host) so the foundation-risk choropleth is real.
- hauska-engine deploy carrying the groundwater `format=rdb` fix for the BRIEF path (map path is fixed; engine not yet redeployed).
- Composites are still synthetic stubs at fixture:false; real fill is Cotality-gated.
- Hydrology D8: rendered as static glowing channels on the map; the real engine D8 seam alignment + a crash-safe flow animation remain.
