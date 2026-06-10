---
decision_id: 2026-06-10_gtm_readiness_plan
date: 2026-06-10
owner: Nick
status: active
related_canonical: [58_gtm_readiness_sprint, 56_engine_extraction_sprint, 57_national_code_warming_sprint, 59_spine_moat_and_high_value_features, 54_tenant_leg_sprint, 04a_arrow_two_calibration_capture, 03a_positioning_framework]
related_adr: [80_adrs/adr_008_engine_factor_out, 80_adrs/adr_005_multitenancy, 80_adrs/adr_021_constraint_resolution_and_precedence]
related_skill: [premortem-check]
---

## Decision

Flesh the GTM-readiness sprint ([`58`](../58_gtm_readiness_sprint.md)) into a sequenced, premortem-cleared plan: the engine lift done app-by-app as the QA vehicle (Cortex → extension → SmartCity, each validated in its final topology), in parallel with a Texas-first code-library deepening, with the [`59`](../59_spine_moat_and_high_value_features.md) moat features sequenced in. Five planning forks resolved with the operator:

1. **SmartCity-on-spine follows; it does not gate launch.** Cortex + extension gate the architect launch; SmartCity/Bastrop is the third app on the same lift mechanism, off the critical path (the bigger onboard, 54 Task 2 + 31a Phase 3).
2. **User-warm coverage-escalation ships thin for launch** (warm-what-we-can-verify + honest coverage report/pill + manual internal escalation); the full automated loop (coverage-assessment service + automated gap-escalation + curation workflow) is the fast-follow. The no-ingest guardrail is hard in both versions.
3. **The uniform provenance envelope rides the app-by-app cut;** architect-facing surfaces (Cortex findings, extension brief, code lookups) gate launch; full-fleet standardization across all ~57 gate tools is the fast-follow. The arrow-two-critical lineage is already closed (#30/#159/#158), so this is the trust-facing envelope shape, not a correctness fix.
4. **The background enhancement loop is deferred post-launch.** The cold-warm first pass + demand-driven lazy-cache (the thin user-warm path) is enough depth for launch.
5. **Texas-first, deep.** Texas is the launch geography, the test-run, and the template the post-ICC geography expansion reuses. Geography expansion is sequenced after the ICC cutover. No FB-group clock — quality over speed; a few weeks' wait is acceptable.

Plus a sixth, on payment: **payment/metering activation routes to the ICC cutover as the first paid Layer-2 surface**, not this sprint; the gated ICC dispatch is widened to carry that scope.

## Context

Pre-mortem run formally 2026-06-10 (premortem-check skill): GREEN. All three load-bearing commitments clean — sell-reasoning (the provenance envelope enforces it), confidence-is-earned (the plan rides the closed arrow-two loop and preserves the asserted-baseline fallback + the `citations[].atomId` lineage), cost-per-jurisdiction (Texas-first is the cheapest scoping; the corpus is already mostly Texas; cold-warm carries a per-batch cost cap). One operational yellow on the focus-queue rule: cc-agent-C is the single-owner serialization point across cold-warm, gap analysis, the three cuts, per-user auth, user-warm-thin, and polish. Mitigated and acknowledged: the lift (cc-agent-E) is the natural pacer, and the cc-agent-C front is ordered strictly serial (B1 → B2 → per-user auth during the A2 wait, then the cuts on A2 parity), never two concurrent build fronts on the one clone.

Live-state verification (2026-06-10) sharpened the plan: the org-wide open-PR surface is one PR (hauska-engine #68); the cold-warm harness (#157/0036) is merged (so the runs dispatch is fire-ready); the two lineage-audit P0s are closed; the precedence taxonomy canary (#149) is fixed.

## Reasoning

The correctness builds (arrow-two, tenant isolation, the lineage P0s, the precedence taxonomy) are all landed, so the sprint is a lift + coverage + polish sprint, not a make-it-work sprint. Lifting before the heavy customer-readiness QA means each app is validated in its final shipping topology rather than re-QA'd after a later lift; the app-by-app cut IS the QA vehicle and the de-risked (non-big-bang) way to lift. Texas-first plays to the corpus's existing strength and validates the cost envelope before geography expansion — exactly the cost-per-jurisdiction hard-kill discipline. The thin-vs-full calls on user-warm and provenance keep the cc-agent-C critical path tight without compromising the launch honesty surface or the trust envelope on the surfaces architects actually see.

## Two hard acceptance criteria threaded into the dispatches

- The app-by-app cut preserves `citations[].atomId` lineage end-to-end (arrow-two deposit depends on it).
- The user-warm path never writes user-supplied content into the shared corpus (one bad upload poisons the jurisdiction).

## Reversal criteria

Reverse the SmartCity-follows call if a city-tenant commitment (Bastrop or a SmartCity sale) forces SmartCity-on-spine onto the critical path before the architect launch. Reverse the thin-user-warm call if launch feedback shows the manual escalation cannot keep pace with demand (promote the full automated loop forward). Reverse the provenance-rides-the-cut call if an external/agent buyer requires full-fleet auditability as a launch condition. The Texas-first scoping reverses naturally at the ICC cutover, when geography expansion is taken up. The no-ingest guardrail and the lineage-preservation criterion never reverse — they are the trust floor.

## Dependencies

Edits 58 (fleshed), flips the adapters (A1) and codewarm-runs (B1) dispatches to FIRE-READY, re-scopes the cortex-consume dispatch app-by-app + provenance, widens the gated ICC dispatch with the first-paid-surface metering scope, and authors four new dispatches (Texas gap analysis, Cortex per-user auth, user-warm-thin, precedence gate-exposure recon). No canonical-doc commitments change; the constitution amendment of 2026-06-09 stands.

## Counterparties

Internal. No external counterparty notification.
