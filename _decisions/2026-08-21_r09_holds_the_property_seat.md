---
decision_id: 2026-08-21_r09_holds_the_property_seat
date: 2026-08-21
owner: operator
status: active
related_canonical:
  - 90_operations/OPS-18_canon_reconciliation_plan_of_record
  - _catalog/seat_register.json
  - _dispatches/2026-08-21_r09-gate-repair_dispatch.md
  - 62_seat_topology
---

## Decision

R-09 holds the **property seat** for the launch-gate instrument repair. It is authorised to
write `legacy-design-tools`, to commit on `seat/property`, and to open and merge its own PR
on green CI. It is not authorised to deploy to production traffic.

It works in `P:/seat-worktrees/property/legacy-design-tools` on branch `seat/property`. That
is the only legal path: `scripts/enforcement/seat-worktree-gate.mjs` refuses a write from any
worktree not registered in `_catalog/seat_register.json`, so a fresh detached worktree would
be blocked as `unregistered_worktree`, and the shared checkout at `P:/legacy-design-tools` is
precisely the failure that control exists to make impossible.

## Context

The R-09 dispatch carried a deliberate seat fence: the County Manifest and its scorers live
in `legacy-design-tools`, which the property seat owns, and no product write was permitted
without operator confirmation. The operator confirmed on 2026-08-21.

State at the ruling, verified: the property seat worktree exists, sits on `seat/property` at
`10069854`, and is clean. `P:/legacy-design-tools` is dirty on `feat/s1-instrument-hardening`
with 63 files and must never be cleaned or stashed; it is not R-09's tree.

## Structural commitment check

Tenant sovereignty and access control are untouched by this row: R-09 repairs an indicator,
it does not change what is served or to whom.

## Reasoning

Two of the five Texas-flush launch criteria are graded by `hasWriter` and `atomFamilyState`,
both constant across all 3,556 manifest cells on live read 2026-08-20. A criterion that
cannot fail is not a criterion. Making an instrument capable of returning a red is the
opposite of a shortcut to launch; minting absence atoms to close cells is the shortcut, and
that was rejected by prior operator ruling.

Granting the seat rather than routing the change through a second agent removes a handoff
from a lane whose whole subject is that handoffs lose things.

## Consequence the operator should hold

**This is now the only property-seat work that may be in flight.** The gate enforces that a
write comes from the registered worktree on the registered branch; it does not prevent two
agents occupying that one worktree simultaneously. A second property-seat lane started before
R-09 closes would collide inside a control that would report both as legitimate.

## Reversal criteria

Reverse if a second property-seat lane must run before R-09 closes, in which case either
R-09 pauses and hands its prescribed change to that seat, or a distinct worktree is
registered for it in `_catalog/seat_register.json` first. Registering the worktree after the
fact does not cure a write made from an unregistered one.

## Dependencies

OPS-18 R-09. Does not touch OPS-16 launch criteria, which remain operator-ruled and outside
this row.

## Counterparties

Internal. Operator granted the seat. Planner files. R-09 executes.

---

## AMENDMENT 2026-08-21 — the control this decision rested on was dormant

The body above says R-09 has "exactly one legal path" because
`scripts/enforcement/seat-worktree-gate.mjs` refuses a write from an unregistered worktree.

**That protection did not exist when the ruling was made.** The R-04 control census found
`.cursor/hooks/seat-gate.mjs` importing from `../scripts/enforcement/`, which resolves from
`.cursor/hooks/` to `.cursor/scripts/enforcement/`; the real path is `scripts/enforcement/`.
Registered on both the shell and write matchers, it threw ERR_MODULE_NOT_FOUND on every
invocation and exited 0. It had never fired once.

So the reasoning in this decision was sound and its premise was false. R-09 stayed in the
correct worktree because the agent complied, not because anything enforced it.

Fixed and armed 2026-08-21, verified by violation: a write from an unregistered worktree now
returns `permission: deny` with a block message, and the registered tree on main returns
`permission: allow`. `scripts/enforcement/hooks-loadable.test.mjs` was added so a registered
hook that cannot load fails the build instead of passing silently.

The operator consequence in the body stands unchanged and is now actually enforced: this
remains the only property-seat work that may be in flight, because the gate checks the
worktree and branch and does not prevent two agents sharing one registered worktree.
