---
id: 58_gtm_readiness_sprint
title: GTM-readiness sprint — engine lift (app-by-app QA) + code-library maximization (SCAFFOLD)
status: active
last_updated: 2026-06-09
applies_to: portfolio
owner: nick
related: [56_engine_extraction_sprint, 57_national_code_warming_sprint, 54_tenant_leg_sprint, 04a_arrow_two_calibration_capture, 80_adrs/adr_008_engine_factor_out, 80_adrs/adr_005_multitenancy, 48_codex_program_plan, 30a_smartcity_stabilization_sprint, 31a_bastrop_maintenance_sprint]
---

# GTM-readiness sprint (scaffold)

> **Scaffold.** Claims the slot and frames the lanes; to be fleshed out in the next planning session with the operator (who is moving directly into the engine extraction). Premised on the 2026-06-09 close: arrow-two is closed end-to-end (I3 satisfied), tenant isolation is live end-to-end, the build-out is deployed, the gate is wired, and the cold-warm harness is merged. The lift's three hold-reasons (moving-target on cortex-api, deploy-first baseline, unwired gate) are all resolved.

## Premise

Two coupled efforts get Cortex, the browser extension, and SmartCity ready for the FB-group / 7k-architect launch with an amazing UX. Both can run in parallel lanes.

## Effort 1 — engine lift, done as the QA vehicle

The decoupling (engines out of cortex-api into the `hauska-engine` spine, apps consume through the gate; ADR-008 / [`56`](56_engine_extraction_sprint.md)) is committed direction. Doing it BEFORE the heavy customer-readiness QA means each app is validated in its final shipping topology, not re-QA'd after a later lift. The app-by-app cut (56 step 5) IS the QA vehicle and the de-risked (non-big-bang) way to lift.

Ordering constraint: cortex-api must be static when `engine-core` lifts (56 step 4) — satisfied now that arrow-two Phase 3 has landed.

Sequence to plan:
1. Lift adapters + engine-core to the spine (56 steps 3-4; engine-core cargo already includes the calibration package from Phase 3). One-time, cc-agent-E (hauska-engine).
2. Cut consumers to the gate APP-BY-APP, QA each in its final topology: Cortex (cortex-api repoints to the gate→engine) → browser extension (already hits cortex-api directly; repoint to the gate) → SmartCity/Bastrop (the bigger onboard — an island with zero Hauska deps today; 54 Task 2 + 31a Phase 3 atom-backed context).
3. Thin cortex-api to a BFF (56 step 6).

Two adjacent lanes (separable from the lift topology):
- **Per-user auth on Cortex** (the 7k self-serve isolation; the "task #29 auth layer," distinct from the gate-tenancy #29 already shipped): login/signup, owner/tenant columns + backfill, per-route ownership predicates, metering, rate-limit.
- **Product polish:** browser-extension UX, Cortex UX/features, restore the QA-30/31-removed render auth gate, mnml render activation.

## Effort 2 — code-library maximization for the FB-group launch

Goal: by launch, an architect's lookup hits a deep, calibrated library so the UX is instant and grounded. Three moves:

1. **Warm the first pass (now-fireable).** Fire the cold-warm RUNS dispatch ([`_dispatches/2026-06-09_cc-agent-C_codewarm_runs.md`](_dispatches/2026-06-09_cc-agent-C_codewarm_runs.md)) over the six manifests (~640 sections), with the receiving-agent section-number verification gate. Harness #157 is merged, so it is fireable.
2. **Coverage gap analysis (new — plan this).** A have-vs-need map. HAVE: the engine corpus (~34 jurisdictions / 21k atoms, mostly Texas + federal accessibility; 2 public-free), plus the warmed national model-code reasoning atoms from the first pass. NEED: the full I-Code family at the editions architects actually adopt (2021/2024 + the in-force priors), the states/jurisdictions matching the FB-group geography, the NFPA track (NEC/NFPA 101, license-gated), and the ICC licensed text (creds-gated). Output: a coverage matrix (code family x edition x jurisdiction/state) with have/warmed/missing, and a prioritized fill-list by expected FB-group demand.
3. **Background enhancement loop (new — plan this).** A recurring process (candidate: a scheduled cloud agent, or a paced loop) that keeps the library deepening without manual fan-out: demand-driven warming of new refs from real usage (the lazy-cache), multi-link accretion (more authoritative source links per ref), arrow-two calibration accrual (now that Phase 3 is live, atoms calibrate from usage), edition-adjacency warming, and gap-fill against the analysis. The library compounds in the background while the apps get UX-polished.

Guardrails carry from 57: web-first reasoning atoms (no verbatim text hoarding), spine substrate served through the gate, tenant data sovereignty on calibration, ICC/NFPA as the licensed-display enhance phase.

## Moat features to fold in

The high-value moat features captured at session close ([`59_spine_moat_and_high_value_features.md`](59_spine_moat_and_high_value_features.md)) belong in this sprint's planning. Near-term ones especially: **user-warm with quality-gated coverage escalation** (the operator-refined design — warm-what-we-can + honest coverage report + internal gap-escalation + team curation; no user-supplied content into the shared corpus; this is the demand-driven national-coverage answer and a white-glove touchpoint, and it folds into Effort 2's code-library lane), the **uniform provenance contract** (pairs with the app-by-app cut), and **precedence/reconciliation tightening** (recon first). The **payment/metering activation** routes to the ICC cutover, not this sprint. The deeper moat builders (calibration-grade-sellable, real-outcome capture, participation flywheel, as-of-time, atom-graph, execution atoms) are roadmap items to sequence against this work.

## To resolve in the planning session

Lift sequencing vs the per-user-auth and polish lanes; which apps cut first and the QA checklist per app; the gap-analysis owner + format; the background-enhancement mechanism (scheduled agent vs loop) and cadence; how the FB-group geography scopes the fill-list; whether SmartCity-on-spine rides this sprint or its own; the user-warm coverage-escalation spine functionality (coverage-assessment + gap-escalation + curation workflow); deploy + key-rotation housekeeping.

## Revision history

- **2026-06-09 (scaffold):** Created at session close to frame the GTM-readiness sprint (engine lift as app-by-app QA + code-library maximization for the FB-group launch). To be fleshed out with the operator in the next planning session.
