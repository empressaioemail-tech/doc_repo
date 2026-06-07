---
id: 2026-06-06_cc-agent-C_arrow_two_phase0_recon
title: Dispatch — Arrow two Phase 0 (calibration-capture wiring recon + design, no code)
date: 2026-06-06
agent: cc-agent-C
repo: legacy-design-tools
kind: dispatch
related: [04a_arrow_two_calibration_capture, 04_roadmap_alignment_audit, 03_structural_constitution_and_drift_guard, 03a_positioning_framework, 01a_atom_conventions, 20_agent_operating_rules]
---

# Arrow two Phase 0: calibration-capture wiring recon + design

You are **cc-agent-C**, single owner of `legacy-design-tools` for this run. This is **recon and design only. No code, no PR.** Output is a wiring-design report.

## Model (HR-12)

Default Grok Build 0.1 (agentic). Escalate to Claude only on failure after retry; log it.

## Atoms to resolve

Resolve before reading full docs (catalog: [`01a_atom_conventions.md`](../01a_atom_conventions.md)):

- `current-state:portfolio` — fleet status, blockers
- `finding:*`, `decision-event:*`, `submission:*` — the adjudication-capture atoms in cortex-api
- `code-section:*` / `code-cross-reference:*` — example atoms that carry a confidence score and would be the targets of a confidence update

Cortex MCP has been erroring at dispatch start; if resolve fails, fall back to repo recon and note it verbatim.

## Read first (after atoms)

1. [`04a_arrow_two_calibration_capture.md`](../04a_arrow_two_calibration_capture.md) — the build spec and your task anchor. The mechanism, the three-part gap, the guardrails, and the four phases.
2. [`03_structural_constitution_and_drift_guard.md`](../03_structural_constitution_and_drift_guard.md) I3 (confidence earned, not asserted) and [`03a_positioning_framework.md`](../03a_positioning_framework.md) (calibration as the retention mechanism).
3. [`20_agent_operating_rules.md`](../20_agent_operating_rules.md) — HR-1, HR-2, HR-8.

## Scope (recon + design only)

Establish ground truth in code, then propose the wiring. Cross-repo read is in scope (cortex-api, `hauska-atom-contract`, `hauska-engine`) even though you own cortex-api; you write no code in any of them this run.

1. **Capture points.** Find exactly where reviewer adjudications are recorded today: the Codex reviewer accept/edit/reject path (PRs #66 to #72), the `decision-event` / `finding` / `submission` atom writes, and the `codex_override_write` MCP tool. Cite files and functions.
2. **Confidence storage.** Find where an atom's confidence score is defined and stored, across the atom contract (the field shape) and the engine (persistence / recompute). Cite the type and the storage path.
3. **The link.** Determine how a finding references the atoms it cited (so an adjudication on a finding can be traced back to the specific atoms whose confidence should move). Identify whether that lineage exists or is missing.
4. **Outcome observation.** Determine whether any real-world outcome signal is captured anywhere (permit approved, variance granted, comment resolved), or whether Phase 2 starts from zero.
5. **Propose the update path.** Design (in prose, no code) how an accept/edit/reject adjudication should route into the cited atoms' confidence, and how stated confidence would later be compared to observed frequency. Name the minimal Phase 1 slice (adjudication into atom confidence) versus what defers to Phase 2 (outcome capture) and Phase 3 (calibration computation).
6. **Guardrail check.** Confirm the design keeps partner-city adjudications improving the contributor's and the city's own atoms within the revenue-share / sovereignty frame (04a guardrails), and keeps the rev-share rail quiet (I7). Flag any place the obvious wiring would violate this.

## Out of scope

Any code, schema change, migration, or PR. Calibration computation implementation (Phase 3). Pricing-tier wiring.

## Acceptance criteria

- Wiring-design report covering all six scope items, every capture point and storage location cited by file and symbol (verbatim, HR-8).
- A named minimal Phase 1 slice with its dependencies, and an explicit list of what defers to Phase 2 and Phase 3.
- Guardrail check completed with any conflicts flagged.
- No code, no PR.

## Reporting

Write to `P:\doc_repo\_inbox\` as `2026-06-06_legacy-design-tools_cc-agent-C_arrow_two_phase0_recon.md`: atom refs touched, model used if not default, the six-item findings with verbatim file/symbol citations, the Phase 1 slice proposal, and any guardrail conflicts.
