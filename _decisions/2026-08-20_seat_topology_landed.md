---
decision_id: 2026-08-20_seat_topology_landed
date: 2026-08-20
owner: systems seat
status: active
related_canonical:
  - 62_seat_topology.md
  - _catalog/seat_register.json
  - ENFORCEMENT.md
  - scripts/enforcement/seat-worktree-gate.mjs
---

## Decision

Planner seats operate one worktree and one branch per owned repository. Shared mutable state is a directory with one file per seat. The first write from an unregistered worktree is refused by SEAT-01.

## Context

Three concurrent write events in one repository in one day, two of which could have destroyed work. Git handles concurrent commits. It does not handle several processes staging into one index. During this landing, `main` moved from `b3fa27f` to `e6de1eb` under the integration checkout, which is the same class.

## Structural commitment check

Declared-is-not-enforced: the bootstrap is a hook, not a protocol step. Fail closed: unregistered worktree refuses. Scope: the gate reads the worktree being mutated, not the hook process cwd.

## Reasoning

Identity is the worktree path in the register, compared to `git rev-parse --show-toplevel` of the target. Branch name prefixes are not used. Integration at `P:/doc_repo` on `main` remains a named checkout so the primary tree is not an unowned default; it is forbidden from writing `_state/<other-seat>/`.

## Reversal criteria

Reverse the integration exception only when every planner seat, including systems, actually opens its registered worktree as the Cursor/Claude workspace. Until then, refusing all writes from `P:/doc_repo` locks the operator out of the merge target.

## Dependencies

C-00 remains internal consistency for the rules vehicles. SEAT-01 is the topology control. Branch prune treats registered seat branches as `live` via `branch-safety.mjs` reading the register.
