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

## Doc-governance note

The ADR-005 slot collision (30a's `adr_005_smartcity_multitenancy.md` vs the substrate "ADR-005 multitenancy" references in 00c/Mox/CLAUDE.md) was surfaced and resolved to one portfolio ADR per [[flag-naming-inconsistencies-early]], operator-ratified. CLAUDE.md still references "ADR-005 multitenancy (queued, 30a WS-4)" in its Open-ADRs line; that remains accurate (queued, now scaffolded) and was not edited this session.
