---
id: 61_property_intelligence_master_plan
title: Property-intelligence engine master plan — seal the seam, pour the data, tier it
status: active
last_updated: 2026-06-11
applies_to: hauska
owner: nick
related: [55_spine_data_intelligence_stack, 56_engine_extraction_sprint, 58_gtm_readiness_sprint, 08_tiered_access_model, 14_pricing_framework, 77b_cotality_integration_strategy, 04a_arrow_two_calibration_capture, _research/2026-06-11_engine_robustness_audit, _research/2026-06-06_cotality_api_surface_catalog, 80_adrs/adr_008_engine_factor_out]
---

# Property-intelligence engine master plan

> **Purpose.** The single governing execution board for the property-intelligence engine (a set of ~9 engines plus a spine-wide output contract). It merges three inputs into one sequence: the 2026-06-11 engine robustness audit ([`_research/2026-06-11_engine_robustness_audit.md`](_research/2026-06-11_engine_robustness_audit.md)), the full data-layer inventory and the Cotality every-SKU adoption plan (the basis for tiered subscription planning), and the open execution backlog (the engine-lift flip plus the queued items). Decision posture this doc encodes: **seal the seam before pouring data through it, then tier it.**

> **The verdict that frames everything.** The audit's finding: the spine is well-built per-engine and badly integrated at the seam. It is one integration pass from good, not a rewrite. The three structural gaps (confidence asserted-not-earned on the read path, silent degradation as the default failure idiom, a non-uniform output contract) all live at the seam, and adding data layers on the current seam makes them worse, not better. So the contract work gates the data build-out.

## The spine principle

Every new data layer, on today's contract, inherits fetch-time freshness (cannot tell the buyer how old the physical-world data is), asserted or absent confidence, and silent degradation with `status:ok`. You cannot sell a "calibrated, cited" Layer-2 package when the wire emits a hardcoded `1.0`. Therefore:

```
Wave 0  finish the flip         (engines onto the spine, app-by-app)
Wave 1  seal the seam           (uniform EngineEnvelope + calibrated confidence on read)
Wave 2  fix what is wrong       (pysheds/precedence/vintage/coverage)
Wave 3  pour data through       (Cotality every-SKU + USGS subsurface + missing geotech engines)
Wave 4  tier and commercialize  (data-packages -> L1/L2 + insurability + MCP federation)
```

Each new layer in Wave 3 lands on the Wave 1 contract, so it is trustworthy and immediately tier-sellable, and no adapter is touched twice.

## A. Data-layer inventory (status x analysis x tier)

Organized by entitlement unit (the composable data package per [`08`](08_tiered_access_model.md)), not persona. Status: live and working / built-but-degraded / not implemented. Full engine evidence in the [audit](_research/2026-06-11_engine_robustness_audit.md).

### Parcel / Property package
| Layer | Source | Status | Engine | Tier |
|---|---|---|---|---|
| Parcel polygon | Cotality Spatial Tile `/parcels` (162M) | wired point-only; polygon available, unused | site-context | L1 base / L2 reasoning |
| Zoning / land-use | Cotality Property V2 site-location | degraded (raw county codes, no national taxonomy) | site-context | L1/L2 |
| Owner / sale / tax / AVM | Cotality Property V2 | not wired | briefing (Carfax depth) | L2 |
| Transaction history / comps | Cotality Property V2 | not wired | briefing / market | L2 |
| Regrid parcel | Regrid | DROPPED 2026-06-11 (Cotality is sole parcel/property spine) | n/a | n/a |

### Hydrology / Flood package
| Layer | Source | Status | Engine | Tier |
|---|---|---|---|---|
| Elevation / DEM | USGS EPQS + 3DEP | live (nodata-fill contour bug) | topography | L1 |
| Drainage / flow | 3DEP to D8/pysheds | degraded (pysheds never installed, native math wrong on flat terrain) | hydrology | L1/L2 |
| Design-storm rainfall | NOAA Atlas 14 | live | hydrology forcing | L1 |
| Flood zone | FEMA NFHL | live (only adapter with real vintage) | site-context | L1 |
| Modeled flood depth @ 50/100/250/500yr | Cotality RiskMeter inland-flood-cat-model | available, unused (the real forcing plus validation) | hydrology blend | L2 |
| Climate forward-scenario (AAL/PML to 2050) | Cotality CRA AR6 + RiskMeter | not wired | insurability / feasibility | L2 |

### Subsurface package
| Layer | Source | Status | Engine | Tier |
|---|---|---|---|---|
| Soils (bearing/shrink-swell/hydric) | USDA SSURGO | degraded (centroid not polygon, fetch-time vintage, no confidence) | subsurface | L2 |
| Geology / seismic | USGS SGMC + seismic | degraded (Site Class hardcoded D for every parcel) | subsurface | L2 |
| Groundwater | USGS NWIS | degraded (schema-fragile, silent wellCount:0) | subsurface | L2 |
| Minerals / O&G (lease, well, production) | Cotality Spatial Tile SpatialRecord O&G Basic/Premium/Pro | not wired | subsurface / mineral estate | L2 |
| Mine subsidence / sinkhole / karst / UST | Cotality RiskMeter + USGS | available, unused | subsurface (missing geotech engine) | L2 |
| Foundation type | Cotality RiskMeter `/comprehensive-foundation-type` | not wired | subsurface / structural | L2 |

### Code / Plan-review package
| Layer | Source | Status | Engine | Tier |
|---|---|---|---|---|
| Municipal codes | Municode/eCode/web-first | live (most web-warmed unverified) | corpus / finding | L1 |
| I-Codes / A117.1 | ICC Code Connect | creds-gated | corpus | L1/L2 |
| ADA / FHA accessibility | RawPdfAdapter | live | precedence | L1 |
| Precedence / reconciliation | finding-engine | degraded (production no-op) | precedence | L2 |

### Environmental / Resilience package
| Layer | Source | Status | Engine | Tier |
|---|---|---|---|---|
| EJ / environmental | EPA EJScreen | live (frozen, mis-badged fresh) | site-context | L1 |
| Perils (wildfire/wind/hail/quake) | Cotality RiskMeter (83 endpoints) | 8-pack partial | insurability | L2 |
| Replacement cost (RCV) | Cotality RiskMeter + InterChange + UWC | not wired | insurability module | L2/L3 |
| Broadband | FCC | degraded (WAF-blocked, mis-mapped isResidential) | site-context | L1 |

**Reading the matrix.** Two patterns drive the plan. First, most "not wired / available, unused" cells are Cotality endpoints we have the keys for but have not consumed (Section B). Second, every "degraded" cell is an audit finding that the Wave 1 contract plus Wave 2 fixes resolve. The tier column is the input to subscription planning (Section E).

## B. Cotality every-SKU adoption plan (Regrid dropped)

Regrid is out (operator decision 2026-06-11). Cotality is the sole national parcel/property feed and far more: five APIs across three place-graph planes that fill gaps in every package above. Full endpoint reference: [`_research/2026-06-06_cotality_api_surface_catalog.md`](_research/2026-06-06_cotality_api_surface_catalog.md); strategy: [`77b`](77b_cotality_integration_strategy.md). Adopt in waves, metered per call, data priced at pass-through floor, never resold raw (sell reasoning, not data).

| # | Cotality surface | Fills (package) | Gate |
|---|---|---|---|
| C-1 | Spatial Tile `/parcels` polygon (swap point to polygon) | geometry-aware grounding (fixes the centroid problem across subsurface + parcel) | token works |
| C-2 | RiskMeter `/climate-risk` + inland-flood-cat-model | hydrology forcing plus validation, modeled flood depth | demo-smokeable |
| C-3 | Property V2 detail (owner/sale/tax/AVM/transaction) | Carfax-depth briefing | C-1 smoke |
| C-4 | Spatial Tile SpatialRecord O&G (minerals) plus Utility | subsurface mineral estate (TX), service territory | own dispatch |
| C-5 | RiskMeter env-hazards (mine-subsidence, sinkhole, UST, foundation-type, roof-age, distance-to-shore) | the missing geotech engines plus structural | license |
| C-6 | RiskMeter replacement-cost plus InterChange plus UWC roof | insurability module (Pro tier) | license display rights |
| C-7 | Hauska MCP to Cotality MCP federation | never host their data; orchestrate, meter, cite | MCP eval (Hannah) |

**Cautions baked in.** Do not double-bill flood: FEMA stays the free baseline, Cotality climate is the premium forward-looking layer. Insurability content is informational and source-cited, never a regulated quote. The every-SKU adoption map (beyond the original 8-pack) registers into [`77b`](77b_cotality_integration_strategy.md) so nothing Cotality offers stays unlogged.

## C. Engine-robustness backlog and the uniform contract

The 13-item ranked backlog and the per-engine evidence live in the [audit](_research/2026-06-11_engine_robustness_audit.md). The load-bearing move is the **sealed EngineEnvelope** at the gate-front seam: one shape every one of the 9 surfaces emits, with confidence drawn from `effectiveConfidence` and marked `kind: calibrated|asserted|deterministic`, `dataVintage` as the upstream acquisition date (never fetch-time), and `coverage.degraded=true` whenever any fallback fired. Enforced by a single `sealEnvelope()` wired as Express middleware on the engine route group, Zod-validated, plus a CI contract test hitting all 9 surfaces. This dedupes roughly 30 per-engine findings into a handful of seam changes and brings 9-of-9 surfaces under one contract, which is also the prerequisite for the catalog/MCP dual-interface thesis. Full spec in the audit.

## D. The merged wave sequence

No timeframe estimates; each wave names its gate. Owners per the per-repo single-agent convention (C = legacy-design-tools, E = hauska-engine, M = hauska-mcp-server).

| Wave | Work | Source | Owner | Gate |
|---|---|---|---|---|
| 0 Finish the flip | canary read-confirm, bake `ENGINE_SPINE_*` into `cloud-run-deploy.yml`, shift findings, then flip briefing/hydrology/topography one at a time, then C3 thin cortex-api | engine-lift flip backlog | C + E + planner | canary clean |
| 1 Seal the seam | sealed `EngineEnvelope` at gate-front; wire `effectiveConfidence` plus confidence-kind; automated calibration recompute; fix the tenant-pool leak | audit #1,2,5,6,7 + contract spec | C + E | post-flip |
| 2 Fix what is wrong | pysheds install plus native-D8 math; precedence fires in prod and ports into the spine; `snapshotDate` from vintage; topography/hydrology coverage signals; grounding holes (briefing payload, corpus edition/sourceUrl) | audit #3,4,8,9,10 | E + C | Wave 1 contract |
| 3 Pour data through | Cotality C-1..C-5 (polygon, climate forcing, Carfax, minerals, geotech hazards); USGS subsurface fixes (polygon query, Vs30 site class); the missing geotech engines (karst/bearing/hydric/liquefaction) | data map + Cotality plan + audit "missing" | C + E | Wave 1 |
| 4 Tier and commercialize | data-packages to L1/L2 entitlement at the gate; insurability module (C-6); Hauska MCP to Cotality MCP federation (C-7) | [`08`](08_tiered_access_model.md) + Cotality C-6/7 | M + C | Waves 1-3 |

### Parallel / fast-follow track (does not block the waves)

From the open backlog, slotted so nothing is dropped:
- Engine-lift flip residuals: gate wiring for external agents plus migration 004 (M); engine-api Dockerfile tsx fix on main (E); S2 precedence gate tool (M, after Wave 2 precedence wire).
- New-this-session items: 413 upload fix (signed-URL-to-GCS); web-first coverage reframe (kill "warming", honest "web-grounded on demand" status plus banner plus guardrail mapping); classification off mock (`CLASSIFICATION_LLM_MODE=anthropic`, metadata-only value); honest empty-state ("insufficient content / unresolved jurisdiction" not silent 0).
- Open A/B: grok vs anthropic for findings, now an engine-api decision (engine-api has both keys); deliberate side-by-side, not a blind flip.
- Demand-driven: verified-rate deepeners (UMC/UPC + TAS), San Marcos warm plus Texas Tier-1 pre-warm (less urgent now that web-first grounds live).
- Post-C4: permit/AHJ connector build. External: ICC creds.

## E. Tiering (data-packages to subscription)

Per [`08`](08_tiered_access_model.md), the entitlement unit is a composable data package, not a persona. The status x analysis x tier matrix in Section A is the direct input: Layer 1 is the free public-records baseline for each domain (USGS, FEMA, NOAA, EPA, code text), Layer 2 is calibrated cited reasoning over it, gated at the gate by accessPolicy plus package-entitlement. The binding constraint holds: a package's raw national/federal data and the Cotality pass-through stay floor-priced or free; the moat is the reasoning and the calibration, never raw-data resale. Packages: Subsurface, Hydrology/Flood, Parcel/Property, Code/Plan-review, Environmental/Resilience. Insurability (C-6) is a premium module on Pro/Cortex/SmartCity, Layer 2/3, informational only. Pricing numbers stay in [`14`](14_pricing_framework.md), gated on Cotality production price (the COGS swing factor) and first paid conversions.

## Cross-references

- [`_research/2026-06-11_engine_robustness_audit.md`](_research/2026-06-11_engine_robustness_audit.md) — the 10-engine evidence base + EngineEnvelope spec
- [`55_spine_data_intelligence_stack.md`](55_spine_data_intelligence_stack.md) — the prior engine topology (2026-06-07, pre-lift); superseded on engine status by the audit
- [`58_gtm_readiness_sprint.md`](58_gtm_readiness_sprint.md) — the engine-lift flip this plan's Wave 0 completes
- [`77b_cotality_integration_strategy.md`](77b_cotality_integration_strategy.md) + [`_research/2026-06-06_cotality_api_surface_catalog.md`](_research/2026-06-06_cotality_api_surface_catalog.md) — the Cotality surface Wave 3/4 adopts
- [`08_tiered_access_model.md`](08_tiered_access_model.md) + [`14_pricing_framework.md`](14_pricing_framework.md) — the tiering and pricing the data map feeds

## Revision history

- **2026-06-11 (origin):** Created as the governing master plan. Synthesizes the 10-engine robustness audit, the data-layer inventory (status x analysis x tier across five packages), the Cotality every-SKU adoption plan (Regrid dropped, Cotality sole parcel/property spine plus minerals/flood-depth/insurability), and the open execution backlog into a seam-first wave sequence (0 flip, 1 seal the seam, 2 fix, 3 pour data, 4 tier). Per the 2026-06-11 working session.
