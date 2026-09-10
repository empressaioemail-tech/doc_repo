---
decision_id: 2026-09-10_available_on_request_sixth_cell_state
date: 2026-09-10
owner: nick
status: active
related_canonical:
  - 80_adrs/adr_031_parcel_record_ledger_over_atoms
  - 90_operations/OPS-21_serve_completion_program
  - _catalog/county_contract_v0.json
  - _decisions/2026-09-01_every_parcel_starts_with_a_full_record
plan_rows: [P-141]
---

# `available-on-request` is the sixth parcel-record cell state

## Decision

The parcel-record cell-state union gains a sixth member: **`available-on-request`**.

It means: *this rail is not acquired in bulk. It is fetched per parcel, on demand, through a
named request path. Nobody has requested it for this parcel.*

Operator ruling 2026-09-10, in-session, against three options put by the planner.

## What it is not

It is **not an absence claim.** It says nothing about whether the fact exists for this
parcel. That is the entire reason it had to be a new state rather than a reuse:

- `absent-verified` would be a lie — nothing looked.
- `not-applicable` would be a lie — the fact probably does apply.
- `refused` means the source cannot say which; here the source can say, we have not paid to ask.
- `unaccounted` is technically true but means "a gap we must close." This is not a gap. It is
  the design working.

`ENFORCEMENT.md`: *"An unrepresentable state gets made representable, never encoded in a
sentinel."* This state was unrepresentable. It is now representable.

## Required fields

A cell in this state carries, and refuses without:

- `requestPath` — the named, reachable path that would fetch it. Today: P-85 Records Request.
- `instrument` and `measuredAt` — as every non-`unaccounted` state does. Here the instrument
  is what established the path is reachable, not what looked for the fact.

**A `requestPath` that is not reachable is not `available-on-request`.** If the path is dead,
the honest state is `unaccounted` or `refused`, not a promise the product cannot keep. This is
the guard that stops the new state becoming cover.

## Gate treatment

The publish gate treats `available-on-request` as **satisfied**, the same as
`not-applicable`. `unaccounted` remains fatal at publish. Without this, widening the gate to
all 65 rails would refuse every county forever on three rails that are working as designed.

## Rails this applies to today

`hoaDeedRestrictions`, `ossf`, `publicRecordRefs` — all three sourced from courthouse records
through the Smart Site records tool, user-initiated, per request. Roughly 2.9M cells across
981,405 parcels.

Adding a rail to this state is a ruling, never a lane's discretion. A lane that finds a rail
hard to acquire does not get to reclassify it as on-request.

## Why not the two rejected options

**Take them out of the 65-rail grid.** Cheapest, and it loses the product signal: the record
would no longer say these facts are obtainable, so nothing tells a user that HOA restrictions
can be fetched for their parcel. The grid's job is to know what should exist.

**Keep them as `not-applicable` with a ruling pointer.** No contract change, and it overloads
a state whose plain meaning is "this does not govern here." A later reader would conclude the
parcel has no HOA. The planner recommended this; the operator rejected it on exactly that
ambiguity, and the operator is right — a state that requires a footnote to be read correctly
will eventually be read incorrectly.

## Reversal criteria

If `available-on-request` is ever observed on a rail whose request path has been dead for more
than one measurement cycle, the state is being used as cover and the guard above has failed;
tighten the reachability check rather than removing the state. If a rail in this state is
later bulk-acquired, it moves to a normal state and its `requestPath` is retired in the same
card, per the ENFORCEMENT retirement rule.

## Consequences

Six-value union across a 981,405 x 65 grid and every consumer that switches on cell state.
Real work, deliberately taken. `parcelRecordAllowlist.ts`, the gate CLI, the serve-layer rail
adapters and the MCP tool schemas each need the new member, and each is a place where a
missing case must fail closed rather than fall through to a default.
