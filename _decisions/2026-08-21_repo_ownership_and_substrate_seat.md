---
decision_id: 2026-08-21_repo_ownership_and_substrate_seat
date: 2026-08-21
owner: operator
status: active
related_canonical:
  - _catalog/seat_register.json
  - _catalog/repo_intents.md
  - 62_seat_topology
---

## Decision

`plan-review`, `icc-portal` and `smartcity-os` are assigned to the **property** seat.

A new **substrate** seat is created, owning `hauska-mcp-server` and `hauska-atom-contract`.

`smartcity-os` is owned with **no registered worktree**, so SEAT-01 refuses every write to
it. Ownership records who may lift the ABSOLUTE NO-TOUCH ruling; it does not grant a write
path. Lifting it means registering a worktree in the same commit that records the ruling.

## Context, and a correction

The planner first described unassigned repos as "a write collision waiting to happen." That
was wrong. Once SEAT-01 was armed on 2026-08-21, those five repos had **no legal write path
at all**: the gate refuses any write whose worktree is absent from the register, and an
unassigned repo has no registered worktree by definition. Verified before the ruling.

So this was not hygiene. Five repositories were unwritable, including the MCP gate.

## Reasoning

`plan-review` and `icc-portal` are OPS-17 govtech lane surfaces whose two siblings,
`smartcity-dashboards` and `smart-files`, property already owns. Splitting one lane across
two seats would put a handoff inside a wave.

The substrate seat is held separate from property because these are substrate rather than
product surfaces, and because property now carries eight repositories. The atom contract is
the only artifact in this estate that refuses to compile, which makes it the most
authoritative thing here; the MCP server is the single enforcement chokepoint. Both are
Hauska Inc. commercial substrate under ADR-008 and ADR-018, not Empressa product, and the
seat topology should reflect the entity boundary rather than cut across it.

Historical note: `cc-agent-M` served this scope and had no doc_repo access, so the seat is
new as a registered topology entry rather than as a working arrangement.

## Verified, not assumed

Three directions checked after the register was written. A write from
`P:/seat-worktrees/substrate/hauska-mcp-server` is ALLOWED. A write from the shared checkout
`P:/hauska-mcp-server` is REFUSED, which is precisely what SEAT-01 exists to prevent. A write
to `P:/smartcity-os` is REFUSED. `scripts/enforcement/seat-register.mjs` exits 0.

## Reversal criteria

Reverse the substrate split if it produces a handoff inside a single wave, the same reason
plan-review and icc-portal were kept with property. Reverse the `smartcity-os` no-worktree
posture only by registering a worktree in the same commit that records the operator ruling
lifting NO-TOUCH; registering it earlier would create a write path the ruling forbids.

## Counterparties

Internal. Operator ruled. Planner registered and verified.
