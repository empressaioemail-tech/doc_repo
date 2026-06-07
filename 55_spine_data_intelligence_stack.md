---
id: 55_spine_data_intelligence_stack
title: Spine data-intelligence stack - verified current state, robustness roadmap, COGS
status: active
last_updated: 2026-06-07
applies_to: hauska
owner: nick
related: [00c_portfolio_master_map, 50_hauska_mcp_server, 52_mcp_offer_and_buildout, 54_tenant_leg_sprint, 04a_arrow_two_calibration_capture, 27_engine_evolution_plan, 47_codex_plan_review, 80_adrs/adr_019_layered_code_substrate, 80_adrs/adr_021_constraint_resolution_and_precedence, 80_adrs/adr_010_atom_graph_traversal, 14_pricing_framework, _research/2026-06-06_cross_repo_recon]
---

# Spine data-intelligence stack

> **Purpose.** The canonical reference for what the Hauska spine's analysis engines actually contain (verified against live code 2026-06-07), the robustness roadmap that makes this the most complete real-estate-plus-subsurface intelligence spine, and the all-inclusive COGS of running it. Written because the apps that consume the spine are only as good as the spine; getting the spine rock-solid first makes every consuming surface (Cortex, Codex, the extension, SmartCity, Mox) cheaper to build and deploy.
>
> **Sourcing.** Engine surfaces read directly from `legacy-design-tools` (cortex-api) and `hauska-engine` via a three-agent recon 2026-06-07; corpus and infra ground truth from [`_research/2026-06-06_cross_repo_recon.md`](_research/2026-06-06_cross_repo_recon.md). Every layer below carries a file-of-record; the build roadmap names gaps verified absent, not assumed.

## 1. The whole spine (verified topology)

| Layer | Component | What it is | State |
|---|---|---|---|
| Gate | `hauska-mcp-server` | 46 tools; gates by product at `X-Hauska-Key`; min-instance 1 warm, max 10 | LIVE; no tenant field yet (tenant leg adds it, [`54`](54_tenant_leg_sprint.md)) |
| Product engines | `cortex-api` `@workspace/*` | site-context, hydrology, plan-review/finding, briefing, letters | LIVE; workspace packages; gate-front seam pending |
| Retrieval API | `hauska-engine` | read-only code corpus, 34-35 juris / ~21k atoms, ~56MB snapshot baked into image | LIVE |
| Atom contract | `@hauska/atom-contract` 1.3.0 | shape every layer speaks; 5-value accessPolicy | published; accessPolicy declared, unenforced |
| Commerce | `@hauska-sdk/*` | Circle fiat, USDC crypto, metering | completion merged, dormant |
| Data | Neon x3, GCS objects, corpus snapshot | api_keys, findings, site-context, IFC/GeoTIFF/renders | LIVE |

The spine is compute-light and corpus-heavy. The expensive variable is external data (Cotality), not compute or LLM.

## 2. Site-context stack (verified)

| Layer | Source | Free/Paid | File of record |
|---|---|---|---|
| Elevation point | USGS EPQS | Free | `usgs-ned.ts` |
| DEM raster (topo) | USGS 3DEP ImageServer GeoTIFF, 10m / 1m where lidar | Free | `usgs3dep.ts` |
| Contours | geotiff parse to d3-contour, 5m interval | Free (compute) | `siteTopographyIngest.ts` |
| Flood zone | FEMA NFHL | Free | `fema-nfhl.ts` |
| Environmental/EJ | EPA EJScreen (CalEPA mirror, frozen) | Free | `epa-ejscreen.ts` |
| Broadband | FCC (gated off, WAF-blocked) | Free | `fcc-broadband.ts` |
| Parcel + zoning | Regrid (paid) and Cotality (paid, primary) | Paid | `regrid.ts`, `cotality.ts` |
| Property / climate / hazard / replacement-cost / mineral / utility | Cotality 8-pack | Paid (creds pending) | `cotalityExtended.ts` |
| State/local | UGRC (Utah), Idaho, TCEQ Edwards, Grand County, Lemhi, Bastrop GIS | Free | `state/`, `local/` |
| Cache | `adapter_response_cache`, 24h TTL, keyed lat/lng @ 5dp | n/a | `cache.ts` |

We do NOT use OpenTopography or OpenEarth (zero references). All elevation is USGS 3DEP. OpenTopography is noted as a possible future enhancement for global / higher-resolution lidar coverage outside the 3DEP envelope, not a current dependency.

## 3. Hydrology stack (verified)

Path: DEM (USGS 3DEP, reused) -> D8 flow routing -> rainfall forcing -> flood-depth overlay -> site-drainage atom.

| Step | Source/tech | Free/Paid | Note |
|---|---|---|---|
| DEM | USGS 3DEP (shared with site-context) | Free | |
| D8 drainage | pysheds Python sidecar, native TS fallback | Free (compute) | `artifacts/hydrology-worker/`; not baked into the Cloud Run image yet (deploy gap) |
| Rainfall | NOAA Atlas 14 PFDS, 24-hr design storms | Free | `noaaAtlas14.ts` |
| Flood depth | Cotality hazards (50/100/500yr) | Paid | inert v1 (`useCotalityForcing=false`) |

## 4. Plan-review stack (verified)

Path: inputs (code sections + site-context + sheets/IFC) -> LLM reasoning -> findings with citations + confidence -> lay summary.

- LLM: 3-branch, Grok-first (`grok-3-mini`) / Anthropic fallback (`claude-sonnet-4-5`) / mock default. Lay summary is Grok-first with a deterministic rules-v1 fallback.
- Citations: `code-section` atomId + `briefing-source` id.
- Confidence: the LLM's own emitted number clamped 0-1. It is NOT calibrated. This is the concrete invariant-I3 case arrow-two ([`04a`](04a_arrow_two_calibration_capture.md)) exists to close.
- Document ingestion that exists today: Revit snapshot + per-sheet PNG (`routes/snapshots.ts`); per-sheet vision OCR (`sheetContentExtractor.ts`); IFC parse to BIM geometry (`ifcIngest.ts`); attached-document upload + text extraction (`routes/sheetContent.ts`); generic PDF peel (born-digital pdfjs + scanned OCR) in hauska-engine `raw-pdf/index.ts` (used for code text, reusable for plan sets); a `disciplines` taxonomy (building/fire/zoning/civil) on `submission-classification.atom.ts`.
- Not built: any orchestration that splits a plan set by sheet/discipline, routes each piece to a specialist agent, and re-aggregates by discipline. The finding-engine is a single LLM pass over the whole submission. This is workstream 1 below.

## 5. Code corpus (verified)

- 34-35 Central Texas jurisdictions, municipal/county zoning codes only (Municode HTML + RawPdfAdapter).
- 2021 IRC staged via the ICC Code Connect adapter, credential-gated, not yet live.
- Adapters: Municode HTML, eCode360, RawPdfAdapter, ICC Code Connect (built, creds pending).
- Atom types: code-section, code-definition, code-cross-reference, code-edition, code-amendment, jurisdiction-corpus.
- Absent today: ICC A117.1, ADA Standards, Fair Housing Act Design Manual, IBC, IECC, NFPA, IFC (the IFC/NFPA appear only as references inside city code that adopts them, not as ingested standards). This is workstream 3.

## 6. Subsurface layer (verified)

| Have | Source | Top gaps | Free source to add |
|---|---|---|---|
| Edwards Aquifer zones (TX, gated) | TCEQ | USDA SSURGO soils (drainage, bearing, shrink-swell, hydric) | USDA NRCS, free |
| O&G mineral (wells/leases) | Cotality SpatialRecord | Groundwater / water table / yield | USGS NWIS, free |
| Utility infrastructure | Cotality SpatialRecord | Bedrock + surficial geology | USGS geology, free |
| | | Seismic / fault / design parameters | USGS Earthquake Hazards, free (feeds ASCE 7) |
| | | Liquefaction / subsidence / karst-sinkhole | USGS + state geological surveys, mostly free |

We have topo, hydrology, and flood, but no soils and no geology. SSURGO is the single highest-value subsurface add and it is free federal data (same product-baseline category as FEMA/USGS, clean under the partnership-first scope clarifier). This is workstream 4.

## 7. Spine-wide intelligence rules (cross-cutting invariants)

These should hold across every layer, not per-engine:

1. Provenance, citation, confidence, timestamp on every atom. Exists, except confidence is uncalibrated (workstream 5).
2. Precedence / conflict resolution as a callable primitive (most-stringent-governs, federal-preempts, local-amendment-overlay), per ADR-019 + ADR-021. Latent in atoms today; should be a reasoning pass every engine can call (workstream 2).
3. Calibration (arrow-two): every confidence assertion carries outcome capture.
4. Freshness/recency honesty: each adapter has a freshness threshold; surface staleness to the buyer.
5. Coverage honesty: the neutral no-coverage pill pattern (site-context) generalized spine-wide, an explicit we-do-not-know rather than a guess.
6. Tenant partition / accessPolicy (the tenant leg, [`54`](54_tenant_leg_sprint.md)).
7. Cross-reference graph traversal (ADR-010) available spine-wide, not only within code.

## 8. Robustness roadmap (workstreams)

Partnership-first stays green: every new data source below is national public-records or federal (the allowed product-baseline category per the 2026-05-23 scope clarifier), not city operational data. Sequenced so the spine is solid before the consuming apps lean on it.

| # | Workstream | What | Owner | Buildable now? | Dispatch |
|---|---|---|---|---|---|
| 1 | Plan-set decomposition + per-discipline agents | Classify sheets, dispatch a specialist agent per discipline (accessibility / structural / MEP / civil / fire / zoning), re-aggregate by discipline. The PDF-peel conductor. | cc-agent-C2 | Yes (ingredients exist) | [`_dispatches/2026-06-07_cc-agent-C2_plan_set_decomposition.md`](_dispatches/2026-06-07_cc-agent-C2_plan_set_decomposition.md) |
| 2 | Multi-standard precedence / reconciliation engine | ADR-019/021 promoted to a real finding-engine precedence pass. Resolves the combine-A117.1-ADA-FHA problem. | cc-agent-C2 | Yes (richer with WS3) | [`_dispatches/2026-06-07_cc-agent-C2_precedence_reconciliation_engine.md`](_dispatches/2026-06-07_cc-agent-C2_precedence_reconciliation_engine.md) |
| 3 | Corpus breadth | Accessibility (A117.1 + ADA + FHA Design Manual) + the I-Code family. ADA/FHA via RawPdfAdapter now (free); A117.1 and I-Codes ride ICC Code Connect (creds-gated). | cc-agent-E | Partial (ADA/FHA now) | [`_dispatches/2026-06-07_cc-agent-E_accessibility_corpus_ingest.md`](_dispatches/2026-06-07_cc-agent-E_accessibility_corpus_ingest.md) |
| 4 | Subsurface data layer | SSURGO soils + USGS geology / groundwater / seismic + karst adapters, site-context tier. | cc-agent-C | Yes | [`_dispatches/2026-06-07_cc-agent-C_subsurface_data_layer.md`](_dispatches/2026-06-07_cc-agent-C_subsurface_data_layer.md) |
| 5 | Calibration reinforcement | The uncalibrated-confidence finding is the I3 case arrow-two Phase 2/3 closes. | cc-agent-C | In tenant leg ([`54`](54_tenant_leg_sprint.md)) | (arrow-two dispatches) |
| 6 | Spine-wide intelligence rules | Provenance/citation/confidence/freshness/coverage-honesty/precedence documented as cross-cutting invariants, enforced incrementally. | planner + fleet | Doc now | this doc Section 7 |
| 7 | Deploy-readiness gaps | pysheds bake into the Cloud Run image; SSURGO wiring after WS4. | operator + fleet | Log now | tracked here + 00 |
| 8 | Spine COGS | The COGS table (Section 9) into [`14_pricing_framework.md`](14_pricing_framework.md), with the Cotality-floor flag. | planner | Now | Section 9 |

### Deployment order

- Wave 1 (parallel, different repos/clones): WS3 ADA/FHA corpus (cc-agent-E, hauska-engine) and WS4 subsurface adapters (cc-agent-C, legacy-design-tools main clone) and WS1 plan-set decomposition (cc-agent-C2, legacy-design-tools-c2 clone). Disjoint file sets.
- Wave 2: WS2 precedence engine (cc-agent-C2, after WS1 lands and WS3 has put standards in the corpus to reconcile).

Workspace hygiene: WS4 touches `lib/adapters`; WS1/WS2 touch the finding-engine and routes. Keep WS4 on the main clone and WS1/WS2 on the c2 clone to avoid collisions.

## 9. Spine COGS (all-inclusive, monthly)

| Category | Line items | Monthly | Confidence |
|---|---|---|---|
| Compute (Cloud Run) | retrieval-api + mcp-gate (min-1 warm) + cortex-api (2vCPU/8Gi) | $500-875 | Med (configs verified; traffic-dependent) |
| Data | Neon x3 (substrate small + cortex-prod + smartcity) | $150-350 | Med (tiers not pinned) |
| Storage | GCS objects + NDJSON logs | $50-150 | Low-Med |
| External APIs | Cotality (unknown tier), ICC Code Connect (partnership TBD), Regrid (eval); FEMA/USGS/EPA/NOAA/FCC/USDA = $0 | $500-5,650+ | Low, dominant uncertainty |
| LLM (runtime) | Grok-first + Anthropic fallback; ~$20-60 at launch volume | $20-60 | Med (scales with calls) |
| Other | Cloud Build, Upstash Redis, Secret Manager, Artifact Registry, domain, logging | $30-90 | Med |
| Fixed spine total | | ~$1,250-7,200/mo (midpoint ~$3-4k excluding Cotality/ICC) | |
| Per-jurisdiction onboard (variable) | LLM ingest + eval (51 sprint: ~$1-2k LLM + 60-100 person-hours across first 30 cities) | amortizes toward the <$200 compute + 1hr review target | Med |

Pricing reads: the fixed floor (compute + Neon) is ~$700-1,200 and manageable; LLM is cheap until call volume scales; Cotality is the swing factor and can multiply COGS alone. Sell reasoning (LLM, our margin), price third-party data (Cotality) at floor as pass-through. Gate any Cotality-backed Layer-2 SKU on knowing the Cotality production price.

## Cross-references

- [`52_mcp_offer_and_buildout.md`](52_mcp_offer_and_buildout.md) - the tool surface that exposes these engines
- [`54_tenant_leg_sprint.md`](54_tenant_leg_sprint.md) - tenancy + arrow-two; calibration reinforcement lives there
- [`04a_arrow_two_calibration_capture.md`](04a_arrow_two_calibration_capture.md) - the calibration mechanism that fixes uncalibrated confidence
- [`27_engine_evolution_plan.md`](27_engine_evolution_plan.md) - engine evolution; corpus breadth + subsurface feed it
- [`47_codex_plan_review.md`](47_codex_plan_review.md) - plan review surface that consumes the decomposition + precedence work
- [`80_adrs/adr_019_layered_code_substrate.md`](80_adrs/adr_019_layered_code_substrate.md), [`80_adrs/adr_021_constraint_resolution_and_precedence.md`](80_adrs/adr_021_constraint_resolution_and_precedence.md) - the precedence model
- [`14_pricing_framework.md`](14_pricing_framework.md) - COGS feeds pricing

## Revision history

- **2026-06-07 (origin):** Filed as the spine data-intelligence reference. Verified current stack (site-context, hydrology, plan-review, corpus, subsurface) read from live code; eight-workstream robustness roadmap (plan-set decomposition, precedence engine, corpus breadth incl. accessibility standards, subsurface layer, calibration reinforcement, spine-wide rules, deploy-readiness, COGS); all-inclusive COGS table; deployment order. No OpenTopography/OpenEarth dependency (USGS 3DEP only).
