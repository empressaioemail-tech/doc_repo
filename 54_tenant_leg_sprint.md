---
id: 54_tenant_leg_sprint
title: Tenant leg sprint - one spine, two scoped tenants (Mox + SmartCity)
status: active
last_updated: 2026-06-07
applies_to: portfolio
related: [80_adrs/adr_005_multitenancy, 80_adrs/adr_008_engine_factor_out, _decisions/2026-06-07_adr008_gate_front_seam_scoping, 04a_arrow_two_calibration_capture, _prospects/mox/2026-06-07_mox_engagement_plan, 07a_smartcity_product_positioning, 30a_smartcity_stabilization_sprint, 31a_bastrop_maintenance_sprint, 52_mcp_offer_and_buildout, 53_hauska_sdk_completion_sprint, 00c_portfolio_master_map]
owner: nick
---

# Tenant leg sprint

> **What this is.** The sequenced plan for the leg after the merged build-out: standing up the substrate so it serves scoped tenants. Mox (enterprise-customer) and SmartCity/Bastrop (city) are two surfaces on one shared spine. The brokerage extension is the third instance of the same shape. Stand the partition up once; both tenants ride it.
>
> **Posture.** Planning and scaffolds are filed; the build dispatches are written fire-ready but held QUEUED so the tenant leg does not open a third concurrent build front against the deferred deploy and the now-unblocked M-Stabilize WS-1. Fire on operator sequencing.
>
> **Pre-mortem.** Cleared green 2026-06-07 on all three load-bearing commitments. The tenant partition is the partnership-first sovereignty enforcement; arrow-two Phase 2/3 is the sell-reasoning confidence mechanism. One operational yellow (focus / build concentration) is mitigated by the hold posture and the sequencing below.

## Why now

The build-out + commerce + calibration-v1 leg is merged (Tier-1 MCP, brief seam, arrow-2 Phase 1, hydrology, SDK, SmartCity WS-1 Phase 2A.0). The scoped-tenant pattern ([`00c`](00c_portfolio_master_map.md), Mox substrate-readiness section) names the architecture the Mox plan already describes. The missing piece is enforcement, not design. Verified against live source 2026-06-07: the gate gates by product only with no tenant field; `accessPolicy` is a declared-but-unenforced five-value union; the arrow-2 Phase 1 ledger already partitions on `jurisdictionTenant`; the brief service-seam exists; the engines are still workspace packages; SmartCity is an island with its own `tenant_id` schema and zero Hauska dependencies.

## The dependency chain (what both tenants force)

Three roadmap items become load-bearing because two tenants depend on them:

- **ADR-005 multitenancy** ([`adr_005_multitenancy.md`](80_adrs/adr_005_multitenancy.md)): per-tenant partition enforced at the gate (Layer A) and in the SmartCity schema (Layer B).
- **ADR-008 gate-front seam** ([`_decisions/2026-06-07_adr008_gate_front_seam_scoping.md`](_decisions/2026-06-07_adr008_gate_front_seam_scoping.md)): tenants consume the property/parcel and plan-review engines through the gate, not by reaching cortex-api directly. Distinct from the repo factor-out, which stays on its M-Stabilize Phase 2C gate.
- **Arrow two Phase 2 and Phase 3** ([`04a`](04a_arrow_two_calibration_capture.md)): outcome capture and calibration computation, tenant-partitioned. The deposit loop is the tenant value prop; the partitioned ledger is the sovereignty guardrail.

## Sequence (execution order, dependencies named)

The build order. No timeframe estimates; each step names what it depends on.

1. **Gate tenant resolution + accessPolicy enforcement (ADR-005 Layer A).** Bind a tenant to the api-keys record; carry the tenant on `AuthContext`; enforce `accessPolicy` in the MCP tool handlers. This is the load-bearing first step; everything tenant-scoped depends on it. Owner: cc-agent-M. Depends on: ADR-005 ratification.
2. **Gate-front seam generalization (ADR-008 seam).** Generalize the brief service-seam so the gate reaches the engine entry points on a service path. Owner: cc-agent-C. Depends on: step 1 (the gate needs the tenant context the seam carries through).
3. **Arrow-two Phase 2 outcome capture.** Capture real-world outcomes against which finding accuracy is measured, tenant-partitioned on `jurisdictionTenant`. Owner: cc-agent-C. Depends on: the Phase 1 ledger (merged) and step 1 (tenant partition).
4. **Arrow-two Phase 3 calibration computation.** Compare stated confidence to observed frequency, tighten with use, surface the calibration grade. Owner: cc-agent-C. Depends on: step 3 (needs captured outcomes).

SmartCity Layer-B storage invariants (every tenant-scoped table `tenant_id NOT NULL` + FK + index, zero cross-tenant leakage) run inside [`30a`](30a_smartcity_stabilization_sprint.md) WS-4 against this ADR; not duplicated here. They depend on M-Stabilize Phase 2C cutover.

## Task 2 - SmartCity-on-spine

SmartCity OS is an island today. Bringing it onto the spine is the same onboarding as Mox; it becomes the city tenant.

- **SmartCity/Bastrop as a city tenant on the gate.** Provision a tenant key; Bastrop atoms (adjudications, permit history, plan-review precedent) carry `tenant-private` accessPolicy, readable only by Bastrop and Hauska. This is the partnership-first sovereignty frame in code: the city owns its intelligence, revenue-share intact.
- **31a Phase 3 P3-4 (Compass V4 / atom-backed context), now unblocked.** The DB-hold release (2026-06-06) cleared the platform-foundation block. Atom-backed context is SmartCity reading substrate atoms through the gate. Depends on step 1 (tenant resolution) so SmartCity reads as the city tenant rather than anonymously.
- **Ambient capture extension (new SmartCity product).** Per [`07a`](07a_smartcity_product_positioning.md) product 4, the deposit layer bundled into SmartCity OS, built on the `hauska-brief-extension` pattern. It assists city staff in the moment and captures each decision as the city's own intelligence (it learns your city). Guardrail: capture is deposit that sharpens the city's own atoms, never extraction that aggregates the city's judgment away from them; it captures the work, not the worker (ADR-007). Scoped here as a follow-on product build dispatch (waits on the tenant key from step 1); not authored fire-ready this turn.

Mox and SmartCity are planned as one substrate effort, two tenant surfaces. The spine work (steps 1 to 4) is shared; the surfaces differ.

## Task 4 - Mox Phase 0 readiness

Mox Phase 0 (prove on the owned book) is what the tenant leg makes possible. The tenant leg gives Mox: a tenant key; the `accessPolicy` partition that is the two-flywheel sovereignty boundary (private operating flywheel `tenant-private`, never pooled; shared ground-truth `public-free`/`public-paid`/`tenant-shared`); and the deposit loop (arrow-two) as the calibration mechanism.

Phase 0 is gated on operator-supplied inputs that cannot be invented: which arm and community is the proof site (Mox, Miguel and Sean), and the Yardi access model and scope (Mox ops and IT). Until those land, Phase 0 is not buildable. The substrate-consuming half (BLDR plan review, Invest parcel intel, calibration, tenancy, decoupling) is spine and earns its cycles regardless of Mox; the net-new ops-finance half (Manage close/variance, Invest underwriting vs actuals) is a custom tenant surface scoped and priced as a design-partner build (Mox open-question 5), not absorbed silently as spine.

## Guardrails

These govern every dispatch in this sprint:

- **Sovereignty.** `tenant-private` atoms are never pooled. Only the noncompetitive code and regulatory layer flows into shared ground-truth.
- **Capture as deposit, not extraction.** Capture must make the contributor's and the tenant's own atoms sharper, inside the revenue-share and sovereignty frame (the arrow-two pre-mortem guardrail). It captures the work, not the worker (ADR-007).
- **Keep the rail quiet (I7).** The calibration and revenue-share plumbing stays invisible under the AI-first integration pitch. The buyer hears that answers get more trustworthy with use, not the mechanism underneath.
- **Quality gate.** Every output carries reasoning chain, source citation, confidence score, timestamp.

## Dispatch index

All QUEUED (do not fire) pending operator sequencing against the deploy and M-Stabilize WS-1.

| Dispatch | Repo | Owner | Step | Status |
|---|---|---|---|---|
| [`2026-06-07_cc-agent-M_gate_tenant_resolution.md`](_dispatches/2026-06-07_cc-agent-M_gate_tenant_resolution.md) | hauska-mcp-server | cc-agent-M | 1 | **MERGED** (#29, 2026-06-09; `jurisdiction_tenant` on AuthContext, isolation test passes, ~11 ns/check) |
| [`2026-06-07_cc-agent-C_gate_front_seam_and_arrow2_phase2.md`](_dispatches/2026-06-07_cc-agent-C_gate_front_seam_and_arrow2_phase2.md) | legacy-design-tools | cc-agent-C | 2 + 3 | **DONE** (PR #160 `a9f965d`, held for merge; seam carries tenant + Phase 2 outcome capture) |
| [`2026-06-07_cc-agent-C_arrow2_phase3_calibration.md`](_dispatches/2026-06-07_cc-agent-C_arrow2_phase3_calibration.md) | legacy-design-tools | cc-agent-C | 4 | **READY on #160 merge** (final arrow-two build: calibration write-back) |
| [`2026-06-07_cc-agent-M_smartcity_tenant_onboarding.md`](_dispatches/2026-06-07_cc-agent-M_smartcity_tenant_onboarding.md) | hauska-mcp-server + smartcity-os | cc-agent-M | Task 2 | QUEUED (after step 1) |
| Ambient capture extension build | new extension product | TBD | Task 2 | scoped only; not authored fire-ready |

## Operator-gated inputs

Flagged, not invented; the sprint plans around them.

- Mox Phase 0 proof site + Yardi access model (gates Task 4).
- Deploy timing; Cotality credential activation (Gene/CoreLogic) and ICC onboarding (gate the deploy this sprint sequences behind).
- M-Stabilize WS-1 sequencing (Layer B storage invariants depend on Phase 2C cutover).

## Cross-references

- [`adr_005_multitenancy.md`](80_adrs/adr_005_multitenancy.md) - the partition this sprint builds
- [`_decisions/2026-06-07_adr008_gate_front_seam_scoping.md`](_decisions/2026-06-07_adr008_gate_front_seam_scoping.md) - the seam vs repo factor-out split
- [`04a_arrow_two_calibration_capture.md`](04a_arrow_two_calibration_capture.md) - Phase 2/3 spec
- [`_prospects/mox/2026-06-07_mox_engagement_plan.md`](_prospects/mox/2026-06-07_mox_engagement_plan.md) - the enterprise tenant
- [`07a_smartcity_product_positioning.md`](07a_smartcity_product_positioning.md) - the SmartCity product line incl. the ambient extension
- [`30a_smartcity_stabilization_sprint.md`](30a_smartcity_stabilization_sprint.md) WS-4 - Layer B storage verification
- [`31a_bastrop_maintenance_sprint.md`](31a_bastrop_maintenance_sprint.md) Phase 3 - atom-backed context

## Revision history

- **2026-06-07 (origin):** Filed as the tenant-leg sprint. Four-step sequence (gate tenant resolution, gate-front seam, arrow-two Phase 2, arrow-two Phase 3), SmartCity-on-spine task, Mox Phase 0 readiness, guardrails, QUEUED dispatch index. Code state verified against live source.
