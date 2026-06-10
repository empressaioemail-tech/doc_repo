---
decision_id: 2026-06-10_precedence_hero_path_s1_prelaunch
date: 2026-06-10
owner: Nick
status: active
related_canonical: [58_gtm_readiness_sprint, 59_spine_moat_and_high_value_features, 03a_positioning_framework, 80_adrs/adr_021_constraint_resolution_and_precedence]
related_skill: [premortem-check, source-required]
related_inbox: [_inbox/2026-06-10_legacy-design-tools_cc-agent-C2_precedence_gate_exposure_recon]
---

## Decision

Treat multi-standard code reconciliation as a HERO go-to-market path for the Texas architect launch, and therefore promote slice **S1** — wiring the `reconcileStandardPrecedence` primitive into the production finding path — from fast-follow to a **pre-launch soft-gate**, folded into the C1 Cortex cut. The `resolve_precedence` gate tool (**S2**) stays fast-follow, sequenced after the A2 engine-core lift so it calls the spine `engine-api` rather than a legacy bypass.

## Context

The precedence recon ([`_inbox/2026-06-10_legacy-design-tools_cc-agent-C2_precedence_gate_exposure_recon.md`](../_inbox/2026-06-10_legacy-design-tools_cc-agent-C2_precedence_gate_exposure_recon.md)) established with file+symbol evidence that `reconcileStandardPrecedence` exists as a library primitive but is **never called in production** — `lib/finding-engine/src/engine.ts` does not invoke it, so live multi-standard findings are LLM-improvised, and the EntreArchitect combine-ADA/FHA/A117.1 demo is test-fixture-only. The taxonomy canary (#149) is fixed; the full matrix is partial (federal + model + local-overlay handled; state-amendment-tier, zoning, CC&R unhandled).

## Reasoning

The positioning line — *the code tells you the rule; Hauska tells you what it means, reconciled with every other code that applies* ([`03a`](../03a_positioning_framework.md)) — is the wedge differentiator. Marketing it live while the capability is test-fixture-only is a sell-reasoning / quality-gate honesty risk (structural commitment 1 + the quality gate): an architect running a review that hits two applicable standards would get an LLM-improvised reconciliation, not the cited, rule-applied reconciliation the line promises. Since the operator is leading the launch with this line, the honest move is to make it true before it is marketed. S1 is small and folds into C1 (cutting Cortex's finding path to the gate is exactly the surface that calls reconcile), so the promotion is marginal added load on the cc-agent-C front, not a new build front. The honesty scope is held: the wired claim is federal accessibility + adopted model code + local amendments on the same dimension; zoning and CC&R cross-layer (S4/S5) are explicitly out and must not be marketed.

## Reversal criteria

Demote S1 back to fast-follow if the launch stops leading with reconciliation (then scope GTM copy honestly to grounded single-code review per the recon's alternative). Never market the full "reconciled with every other code that applies" line as automated while zoning/CC&R cross-layer reconciliation (S4/S5) is unbuilt — that scope boundary is a permanent honesty gate, not a sequencing call.

## Dependencies

Authors the S1 dispatch ([`_dispatches/2026-06-10_cc-agent-C_precedence_wire_finding_engine.md`](../_dispatches/2026-06-10_cc-agent-C_precedence_wire_finding_engine.md), FIRE-READY, folds into C1) and the S2 gate-tool dispatch ([`_dispatches/2026-06-10_cc-agent-M_resolve_precedence_gate_tool.md`](../_dispatches/2026-06-10_cc-agent-M_resolve_precedence_gate_tool.md), QUEUED after A2 + S1). Updates [`58`](../58_gtm_readiness_sprint.md) (precedence sequenced from fast-follow to pre-launch soft-gate) and the [`59`](../59_spine_moat_and_high_value_features.md) item-4 routing. The residual `general`-domain label stickiness the recon flagged routes to S4 (matrix hardening), not S1.

## Counterparties

Internal. The capability scope (no zoning/CC&R overclaim) governs any external GTM copy.
