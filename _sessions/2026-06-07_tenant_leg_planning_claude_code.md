---
id: 2026-06-07_tenant_leg_planning
title: Session - tenant-leg planning, ADR-005/008 scaffolds, SmartCity-on-spine + collateral scope
date: 2026-06-07
kind: session
agent: claude_code (planner)
related: [54_tenant_leg_sprint, 55_spine_data_intelligence_stack, 80_adrs/adr_005_multitenancy, _decisions/2026-06-07_adr008_gate_front_seam_scoping, 04a_arrow_two_calibration_capture, 30a_smartcity_stabilization_sprint, 31a_bastrop_maintenance_sprint, 07a_smartcity_product_positioning, 14_pricing_framework, _prospects/mox/2026-06-07_mox_engagement_plan, 00c_portfolio_master_map, 00_current_state]
---

# Session - tenant-leg planning + scaffolds

Planning session off the 2026-06-07 handoff. Took the merged build-out leg and planned the next leg (the tenant leg), scaffolded the load-bearing ADRs, authored the cc-agent dispatches (held QUEUED), scoped SmartCity-on-spine and the gov collateral, and updated the current-state docs. No build fired; this is planning + scaffolds, parallel-safe.

## What was done

- **Read-first + code verification.** Read 00/00c/session-record/Mox plan/07a/Vertosoft/04a/30a/31a/52/CLAUDE.md. Ran an Explore agent across six repos to verify the doc set against live source before planning. Key confirmations: the MCP gate (`hauska-mcp-server/src/auth.ts`) resolves `X-Hauska-Key` to product only, no tenant field on `AuthContext`; `accessPolicy` is a declared-but-unenforced five-value union (`tools.ts:155` treats it public-free); the arrow-2 Phase 1 ledger (`atomAdjudicationEvidenceLedger.ts`) partitions on `jurisdictionTenant`; the brief service-seam (`brokerageServiceAuth.ts`, PR #144) exists; engines remain workspace packages; SmartCity is an island with its own `tenant_id` schema and zero Hauska deps. PRs #141/#142/#143/#144 (legacy-design-tools), #25 (mcp), #1 (sdk), #21 (smartcity) confirmed merged.
- **Premortem-check (formal).** Cleared GREEN on all three load-bearing commitments. The tenant partition is the partnership-first sovereignty enforcement; arrow-2 Phase 2/3 is the sell-reasoning confidence mechanism. One operational yellow (commitment 6, build concentration), mitigated by the scaffold-and-hold posture.
- **Two operator decisions ratified.** (1) ADR-005 = one portfolio multitenancy ADR, two enforcement layers (gate + storage), reframing 30a's planned SmartCity-only ADR-005. (2) Dispatch posture = scaffold and hold (QUEUED).

## Artifacts created

- `80_adrs/adr_005_multitenancy.md` - portfolio multitenancy ADR scaffold (status proposed). Layer A: gate tenant resolution + accessPolicy enforcement. Layer B: SmartCity `tenant_id` storage invariants. Resolves the slot collision.
- `_decisions/2026-06-07_adr008_gate_front_seam_scoping.md` - distinguishes the tenant-leg gate-front seam (now) from the repo factor-out (stays on M-Stabilize Phase 2C gate). Does not pull extraction forward.
- `54_tenant_leg_sprint.md` - the sequenced plan (gate tenant resolution -> gate-front seam -> arrow-2 Phase 2 -> Phase 3), SmartCity-on-spine task, Mox Phase 0 readiness, guardrails, QUEUED dispatch index.
- Four QUEUED dispatches: `cc-agent-M_gate_tenant_resolution`, `cc-agent-C_gate_front_seam_and_arrow2_phase2`, `cc-agent-C_arrow2_phase3_calibration`, `cc-agent-M_smartcity_tenant_onboarding`.
- `_dispatches/2026-06-07_smartcity_collateral_production_QUEUED.md` - gov collateral build (pricing-independent assets first; pricing slide gated).

## Artifacts updated

- `07a_smartcity_product_positioning.md` - collateral production scope and sequence added.
- `30a_smartcity_stabilization_sprint.md` (operator's explicit ask) - Phase 2A.0 flipped to verified (PR #21); ADR-005 references repointed to the portfolio ADR (Layer B); header + status-tracking + revision-history entries; frontmatter + last_updated bumped.
- `31a_bastrop_maintenance_sprint.md` - Phase 3 unblocked; P3-2/P3-4 tied to the tenant leg.
- `00c_portfolio_master_map.md` - scoped-tenant section + engine-extraction line updated with the tenant-leg pointers and the seam-vs-factor-out distinction.
- `04a_arrow_two_calibration_capture.md` - Phase 2/3 sequenced into the tenant leg; tenant-partition-is-sovereignty-guardrail note.
- `00_current_state.md` - tenant-leg milestone pointers + ADR-005 line repointed; this session added to Recent sessions.

## State and what is next

Tenant leg is planned and scaffolded; nothing fired. Operator owns: sequencing the QUEUED dispatches against the deferred deploy + M-Stabilize WS-1; the operator-gated inputs (gov pricing, AWS-vs-GCP on Vertosoft, Forrest contract, SKU scope, Cotality creds via Gene, ICC onboarding, deploy timing, Mox Phase 0 site + Yardi access). When sequencing clears, fire step 1 (cc-agent-M gate tenant resolution) first; the rest chain off it.

## Spine data-intelligence analysis (added mid-session)

Operator asked to harden the spine before consuming apps, prompted partly by an EntreArchitect Facebook post ("Dear AI, please combine ICC A117.1 + ADA Standards + Fair Housing Act Design Manual"). Ran a three-agent code recon of the analysis engines and a fourth pass on document ingestion + subsurface. Findings, all verified against live code:

- **Site-context:** USGS 3DEP topo (no OpenTopography/OpenEarth), FEMA/USGS/EPA free + Regrid/Cotality paid, 24h cache.
- **Hydrology:** USGS 3DEP DEM, pysheds D8 (native TS fallback; pysheds not yet baked into the Cloud Run image), NOAA Atlas 14 rainfall, Cotality flood-depth inert v1.
- **Plan review:** Grok-first / Anthropic Sonnet 4.5 fallback / mock; confidence is the raw LLM number, uncalibrated (the I3 case arrow-two closes). PDF-peel + per-discipline specialist-agent orchestration is NOT built (ingredients exist: snapshot/sheet OCR, IFC, attached-doc, a disciplines taxonomy; the conductor does not).
- **Corpus:** 34-35 TX municipal zoning jurisdictions; 2021 IRC staged on ICC Code Connect (creds pending); accessibility standards (A117.1/ADA/FHA), IBC/IECC, NFPA all absent.
- **Subsurface:** Edwards aquifer zones + Cotality mineral/utility only; SSURGO soils, USGS geology/groundwater/seismic, karst all absent.

Filed [`55_spine_data_intelligence_stack.md`](../55_spine_data_intelligence_stack.md) (verified stack tables + eight-workstream robustness roadmap + all-inclusive COGS) and added the COGS section to [`14_pricing_framework.md`](../14_pricing_framework.md) (fixed spine ~$1.25-7.2k/mo; Cotality the binding pricing constraint). Operator approved all eight workstreams and the new doc home.

Four spine dispatches authored FIRE-READY for deployment:

- Wave 1 parallel: `cc-agent-E_accessibility_corpus_ingest` (hauska-engine; ADA/FHA now, A117.1 on ICC creds), `cc-agent-C_subsurface_data_layer` (legacy-design-tools main clone; SSURGO + USGS adapters), `cc-agent-C2_plan_set_decomposition` (legacy-design-tools-c2 clone; the PDF-peel conductor).
- Wave 2: `cc-agent-C2_precedence_reconciliation_engine` (QUEUED until decomposition + accessibility corpus land; the combine-A117.1-ADA-FHA capability).

Atom index gained `sprint:54` and `sprint:55`. The spine dispatches are FIRE-READY (operator chose to deploy); the four tenant-leg dispatches remain QUEUED.

## Engine extraction committed + data-package tiers + PR/M-Stabilize work (added late-session)

After the spine analysis, the operator pushed on the consumption/gating model: one spine must control all apps' intelligence with no ungated path. This converged on committing the full engine extraction (ADR-008's original intent) and reframing tiers around composable data packages.

- **Full engine extraction committed.** Engines lift out of cortex-api into the spine: `hauska-engine` gains an `engine-api` reasoning service (sibling to read-only `retrieval-api`) + `packages/engine-core` + `packages/adapters`; cortex-api thins to a product BFF; all apps consume through the one gate. Decision: [`_decisions/2026-06-07_full_engine_extraction_and_data_packages.md`](../_decisions/2026-06-07_full_engine_extraction_and_data_packages.md). Sprint: [`56_engine_extraction_sprint.md`](../56_engine_extraction_sprint.md). Pre-mortem GREEN with two conditions (packages sell reasoning not raw data; scaffold-now/lift-after-M-Stabilize-2C). ADR-008 + the gate-front-seam decision reframed (seam = step 1, applies to all apps).
- **Data-package tier model.** Tiers reframed from flat L1/L2 into composable data packages (Subsurface, Hydrology, Parcel/property, Code/plan-review, Environmental) x access layer, persona-agnostic (a landman is also a broker). Into [`08_tiered_access_model.md`](../08_tiered_access_model.md); Decision B reshape flagged in [`14_pricing_framework.md`](../14_pricing_framework.md).
- **Spine dispatches landed/handled.** Subsurface PR #145 MERGED to legacy-design-tools main (277 tests green). Plan-set decomposition committed as `b06d0ac` but the planner cherry-pick onto main hit product+lockfile conflicts (base predates #112's squash-merge); preserved the work, backed out, and filed a cc-agent-C2 rebase dispatch ([`_dispatches/2026-06-07_cc-agent-C2_decomposition_rebase.md`](../_dispatches/2026-06-07_cc-agent-C2_decomposition_rebase.md)). Engine-home scaffold dispatch filed ([`_dispatches/2026-06-07_cc-agent-E_engine_api_home_scaffold.md`](../_dispatches/2026-06-07_cc-agent-E_engine_api_home_scaffold.md), fire-now parallel-safe).
- **M-Stabilize verification + correction.** Verified against cc-agent-M's reports: M-Stabilize is NOT done. WS-1 Phase 2A.0 is smartcity-os PR #21 OPEN (not merged); Neon cutover (2A/2B/2C) not started; production still `smartcity-api-00104-taw` (2026-05-19). The prior session-record claim that #21 merged was premature; corrected in 30a + 00. M-Stabilize Phase 2C, the engine-extraction gate, is far off - which is why the lift is scaffold-now/lift-later.

## Doc-governance note

The ADR-005 slot collision (30a's `adr_005_smartcity_multitenancy.md` vs the substrate "ADR-005 multitenancy" references in 00c/Mox/CLAUDE.md) was surfaced and resolved to one portfolio ADR per [[flag-naming-inconsistencies-early]], operator-ratified. CLAUDE.md still references "ADR-005 multitenancy (queued, 30a WS-4)" in its Open-ADRs line; that remains accurate (queued, now scaffolded) and was not edited this session.
