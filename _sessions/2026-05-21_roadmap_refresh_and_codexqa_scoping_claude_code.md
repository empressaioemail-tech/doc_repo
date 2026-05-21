---
date: 2026-05-21
agent: planner
repo: docs
session_type: planning
rolled_up: false
---

# Roadmap catch-up refresh, IP-gate cleanup, M-CodexQA scoping

## What was done

A planner session executing the catch-up queue handed forward from the
2026-05-21 reconciliation session. One commit.

`_inbox/` swept at session start: empty but for its README. Both
cc-agent-C drafts from `legacy-design-tools/_research/` were already
couriered into `_sessions/` at commit 807526b, so nothing to file. The
close-out summary `2026-05-21_cortex_qa_close_out_cc-agent-C.md` was
flipped `rolled_up: true` (43 already carried the PR #59-62 states).

`11_roadmap.md` refreshed:

- End-state model gains a fourth milestone, M-HauskaCommercial (Hauska
  commercial substrate live and revenue-producing per
  `16_commercialization_roadmap.md`). The end-state framing was reworked
  from "three product readiness milestones" to two milestone classes:
  product-readiness plus Hauska commercial activation.
- Fire 3 marked closed (2026-05-19); Summary fire count corrected.
- The Texas IP-attorney-memo ingestion gate retired: the P1 item and the
  Active-sprint-exit-criteria line de-gated.
- ADR-013, ADR-015, ADR-017 corrected from "proposed pending
  ratification" to accepted (they were accepted 2026-05-16); ADR-018 and
  ADR-019 added to the ADR table and References.
- M-Stabilize / M-CortexQA / M-CodexQA milestone statuses refreshed;
  M-CodexQA records the CDX-Phase1-1 resolution.

IP-memo gate cleanup beyond `11_roadmap.md`: the same retired-gate
language was corrected in `73_partnerships.md`, `18_stakeholder_graph.md`,
and `13_risk_register.md`. The memo is parallel bizops tracked in `72`,
not an ingestion gate (Sync 6 was dropped from `51` on 2026-05-19).

M-CodexQA scoped. CDX-Phase1-1 resolved: the Codex 1b reviewer-side QA
surface lives as a new dedicated `codex-reviewer-qa` artifact in
`legacy-design-tools`, separate from `plan-review` (architect-side
window) and `qa` (test harness). Decision record filed at
`_decisions/2026-05-21_codex_reviewer_qa_surface_location.md`;
`48_codex_program_plan.md` updated. The scaffold-build dispatch to
cc-agent-C is filed at
`_dispatches/2026-05-21_cc-agent-C_codex_reviewer_qa_scaffold.md`,
activation-gated behind the Cortex QA close-out merge so no third agent
runs concurrently in `legacy-design-tools`.

QA-21 BD asset logged: a ~7,000-member Facebook group of architects and
home designers who use SoftPlan and ArchiCAD, group owner an operator
relationship. Recorded under a new Distribution channels subsection in
`18_stakeholder_graph.md`; cross-referenced from QA-21 in
`43_cortex_qa_backlog.md`. QA-22 Part 2 wired as an M-PropIntel input.

Pre-mortem run formally on the two load-bearing moves (the end-state
milestone addition and the codex-reviewer-qa artifact decision); both
cleared green, with one operational focus-queue flag resolved by the
dispatch activation gate.

## What was learned

- The retired IP-memo gate had spread wider than the handoff scoped.
  Sync 6 was dropped from `51` on 2026-05-19, but the stale "gates
  non-Bastrop ingestion" framing still lived in `11`, `73`, `18`, and
  `13`. All four are now consistent with the durable rule in
  `memory/skip-tx-ip-attorney-as-gate`.
- The roadmap end-state model predated `16_commercialization_roadmap.md`
  and so did not express the Hauska commercial layer at all. Adding
  M-HauskaCommercial corrected an omission, not a scope expansion.

## What's still open

- The codex-reviewer-qa scaffold dispatch is filed but not fired. It
  activates when cc-agent-C's PRs #59-62 merge and the QA-04 canary
  resolves.
- QA-16 / QA-04 canary deploy remains operator-supervised.
- Wave 2 commercialization decisions: tier prices and call quotas (B),
  GTM channel plan (C).
- ICC API access (Nick pursuing) unblocks Lane E Phase E1.
- The reviewer-surface build proper (Codex Phase 2: CDX-3/4/5) is a
  later dispatch, after the scaffold.

## Suggested canonical doc updates

None outstanding. All canonical updates this session were applied in the
commit batch: `11_roadmap`, `73_partnerships`, `18_stakeholder_graph`,
`13_risk_register`, `48_codex_program_plan`, `43_cortex_qa_backlog`,
`00_current_state`.
