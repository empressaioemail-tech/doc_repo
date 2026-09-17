---
id: 2026-09-17_ship_without_cotality
title: "Decision: ship without Cotality; the rails it would have filled become declared absences"
date: 2026-09-17
last_updated: 2026-09-17
kind: decision
status: active
owner: nick
decided_by: nick (operator)
seat: integration
programs: [OPS-24, OPS-16]
related:
  - 90_operations/OPS-16_texas_market_plan_of_record.md (A-212; rows P-267, P-283, P-322)
  - _decisions/2026-09-16_texas_scaleup_sequence_and_four_rulings.md (the 09-16 vendor posture)
  - _state/shared/STANDING_DECISIONS.md (the fleet-wide bullet, corrected in this session)
---

# Ship without Cotality

## The decision

Cotality is about two weeks away. Nothing waits on it. It is struck from the Phase 0 exit criteria,
P-267 (ag valuation) and P-283 (read the contract) are deferred by declaration to Phase 1, and every
rail that wanted the vendor ships as a **declared absence**: `unaccounted` at rest, labelled where a
customer reads it, never fabricated and never a silent gap. We circle back when the credentials and
the agreement land.

Operator, 2026-09-17: "we are not going to have cotality for another two weeks so we need to proceed
on that premise and finish the rest and get it out to customers."

## Why this is safe to do

The doctrine already permits it and names the shape. Degradation is permitted when it is declared;
silent degradation is not. A degraded answer labelled as degraded is honest. The cells in question
are already honestly `unaccounted` (about 318,000 ag-valuation cells across Bastrop, Caldwell, Hays
and McLennan), and P-253 already gives the rail the state `vendor-pending`. So the gap between
today and shippable is not data. It is whether a customer can READ the absence, which is P-322.

P-267's own text already anticipated this: the Phase 0 exit accepts the rail in those four counties
as `vendor-pending`, and fails once the contract is in hand and the cells are still unaccounted.
This ruling does not overturn that. It removes the vendor from the critical path and makes the
customer-facing half explicit.

## What this decision does NOT license

`unaccounted` must not be converted to `absent-verified` to clear a gate. `absent-verified` is a
claim that something looked, and writing it where nothing looked is a lie that passes every check.
Watch for the unaccounted count falling without a matching acquisition landing: that is relabelling,
and it looks like progress.

P-267's never-run not-applicable sweep would write the false state across all ~318,000 cells. It
must not run, and P-322 makes it refuse rather than relying on nobody running it.

Nothing about the vendor's commercial posture changes: REST stays dead, the credential is never
rotated, the MCP eval channel is internal-evaluation only, no vendor-sourced value reaches a
customer before the agreement is read, and the factory never bulk-calls the vendor.

## Reversal criteria

Reverse when the credentials and the agreement arrive. At that point P-283 is read, ADR-032's four
fields (retention, reproduction, redisplay, billing unit) carry values from the agreement, P-267
loads the four counties through the farm's vendor stage, and the Phase 0 exit stops accepting
`vendor-pending` for that rail. Until then, any row that names Cotality as its blocker is either
deferred to Phase 1 or re-scoped to ship without it; no row sits idle naming the vendor.

Reverse early, and treat it as a defect, if a Cotality-shaped absence is found reaching a customer
as a silent gap or as a fabricated value rather than as a labelled absence.

## Where this was recorded

OPS-16 amendment A-212. The fleet-wide bullet in `_state/shared/STANDING_DECISIONS.md` was corrected
in the same session: it had reverted to "COTALITY IS EXTINGUISHED", which is a third and wrong
state, and every regeneration of `_STATE.md` propagated that into the canon preamble of every
dispatch. The generator's scope gate refused the first correction for naming a plan row in a
fleet-wide bullet, which was right; the program-specific half lives in
`_catalog/program_preambles/OPS-24.md`.
