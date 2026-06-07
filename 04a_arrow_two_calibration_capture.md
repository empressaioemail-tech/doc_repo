---
id: 04a_arrow_two_calibration_capture
title: Arrow two — calibration capture (build spec for roadmap item 1)
status: active
last_updated: 2026-06-06
applies_to: portfolio
owner: nick
related: [03_structural_constitution_and_drift_guard, 03a_positioning_framework, 04_roadmap_alignment_audit, 00d_portfolio_roadmap_reference, 50_hauska_mcp_server, 80_adrs/adr_018_atom_contract_substrate_layer, 80_adrs/adr_017_atom_access_control, _research/2026-06-06_cross_repo_recon]
---

# Arrow two: calibration capture

> **Purpose.** The canonical home and build spec for roadmap item 1 in [`04_roadmap_alignment_audit.md`](04_roadmap_alignment_audit.md), the one genuinely load-bearing build. The audit names it in a line; this doc turns it into something dispatchable. Arrow two is the deposit mechanism that makes confidence earned rather than asserted, satisfying invariant I3 in [`03_structural_constitution_and_drift_guard.md`](03_structural_constitution_and_drift_guard.md). Without it every shipped surface withdraws from the substrate and never deposits, and the trust claim stays rhetorical.
>
> **Owner.** Nick (strategic, per the audit). Build wiring assigned to cc-agent-C. Phase 0 is recon and design only.
>
> **Sourcing.** Capture-substrate facts from [`_research/2026-06-06_cross_repo_recon.md`](_research/2026-06-06_cross_repo_recon.md) (Codex reviewer accept/edit/reject, decision-event and finding atoms, the `codex_override_write` MCP tool) and the quality-gate commitment that every atom carries a confidence score. Phase 0 verifies all of this against live code before any build.

## The mechanism

Two arrows describe the substrate's relationship to its own confidence. Arrow one is the outbound flow: the substrate emits findings, briefings, and code answers, each carrying a stated confidence score. Every consuming surface (Cortex, the Brief extension, Codex, an outside agent) rides arrow one. On its own, arrow one is pure withdrawal: it spends the substrate's confidence without ever testing or improving it.

Arrow two is the return flow. It captures two signals and routes them back into the confidence of the atoms that produced the output:

1. **Reviewer adjudications.** When a reviewer accepts, edits, or rejects a finding, that judgment is evidence about whether the finding (and the atoms it cited) was right.
2. **Finding accuracy against observed outcome.** When the real-world result lands (a permit approved, a variance granted, a plan-review comment resolved), that outcome is the ground truth the stated confidence should have predicted.

Routed into atom confidence, these turn every surface from a withdrawal into a deposit. This is the flywheel: more use produces more adjudications and outcomes, which tighten calibration, which makes the next output more trustworthy. Per the positioning framework, the value lands concretely on the contributor's own work, so participation is intrinsically rewarded and needs no token.

## Calibration, defined

A calibrated system's stated confidence matches observed frequency: when it says it is highly confident, it has historically been right at that rate, and it tightens that match every time it observes a real outcome. The build target is not a one-time confidence number; it is the loop that checks stated confidence against what actually happened and adjusts. Asserted confidence (a number emitted from internal state with no path to being checked) is the thing I3 forbids and the thing arrow two replaces.

## Current substrate (to verify in Phase 0)

The capture points largely exist. The recon places these in the codebase, and Phase 0 confirms them against live source before any wiring:

- Codex reviewer one-click accept, edit, reject (PRs #66 to #72) is the reviewer-adjudication capture surface.
- decision-event, finding, and submission atoms in cortex-api record the adjudication artifacts.
- The `codex_override_write` MCP tool writes reviewer overrides.
- Every atom carries a confidence score per the quality-gate commitment; the storage shape lives in the atom contract and the engine.

## The gap

Three things are unwired:

1. **Routing.** Adjudications are recorded but do not flow back into the confidence score of the atoms the finding cited. The signal is captured and then stranded.
2. **Outcome observation.** There is no capture of the eventual real-world outcome against which finding accuracy is measured. Adjudication is the reviewer's judgment; outcome is ground truth, and the second is missing.
3. **Calibration computation.** Nothing compares stated confidence to observed frequency or tightens the match with use. The number is asserted, not earned.

## Guardrails (from the pre-mortem, 2026-06-06)

- **Partnership-first.** Adjudications captured from a partner city (Bastrop is the richest deposit) are operational data under the partnership scope. The capture must make the contributor's and the city's own atoms sharper, inside the revenue-share and sovereignty frame. Capture as deposit that improves their own review, never as extraction that aggregates their judgment away from them.
- **Keep the rail quiet (I7).** The calibration and revenue-share plumbing stays invisible under the AI-first integration pitch. The buyer hears that the answers get more trustworthy with use, not the mechanism underneath.
- **Build concentration.** This is the rank-1 build, but it competes for build attention with the MCP build-out ([`52_mcp_offer_and_buildout.md`](52_mcp_offer_and_buildout.md)) and M-Stabilize. Phase 0 is cheap recon and parallel-safe; the Phase 1 build is sequenced deliberately against those, not run alongside them.

## Build phases

- **Phase 0, design and recon (no code).** Map the exact capture points, where atom confidence is stored across cortex-api, the atom contract, and the engine, and the proposed adjudication-to-confidence update path. Output is a wiring-design report with the partnership guardrail built in. Owner: cc-agent-C. This is the next dispatch.
- **Phase 1, wire adjudication into atom confidence.** Route accept/edit/reject through to the cited atoms' confidence. Owner: cc-agent-C, sequenced per the operator.
- **Phase 2, outcome-observation capture.** Add the capture of real-world outcomes so finding accuracy can be measured against ground truth.
- **Phase 3, calibration computation.** Compare stated confidence to observed frequency, tighten with use, and surface the calibration grade (which also feeds the calibration-grade pricing tiers in the positioning framework).

## Cross-references

- [`03_structural_constitution_and_drift_guard.md`](03_structural_constitution_and_drift_guard.md) I3 (confidence earned, not asserted) is the invariant this build satisfies.
- [`03a_positioning_framework.md`](03a_positioning_framework.md) defines calibration as the retention mechanism and tiers contribution by calibration grade.
- [`04_roadmap_alignment_audit.md`](04_roadmap_alignment_audit.md) item 1 is the source line; item 3 names Bastrop as the richest deposit contingent on this capture.
- [`80_adrs/adr_018_atom_contract_substrate_layer.md`](80_adrs/adr_018_atom_contract_substrate_layer.md) is where the confidence field shape lives.

## Revision history

- **2026-06-06 (origin):** Created as the canonical home for roadmap item 1. Mechanism, calibration definition, current substrate, the three-part gap, pre-mortem guardrails, and four build phases. Phase 0 recon dispatched to cc-agent-C.
