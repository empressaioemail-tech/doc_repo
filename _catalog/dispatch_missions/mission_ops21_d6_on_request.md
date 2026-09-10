# MISSION - OPS-21 D6: available-on-request (P-141)

## What you are building
Implement the sixth parcel-record cell state, ruled 2026-09-10:
`_decisions/2026-09-10_available_on_request_sixth_cell_state.md`.

Then set `hoaDeedRestrictions`, `ossf` and `publicRecordRefs` to it across the six counties.

## STANDING FACTS
- Those three rails come from courthouse records through the Smart Site records tool
  (P-85), user-initiated, per request. `purchaseApproved` QUEUES A HUMAN, it does not buy.
  Nothing about that path is bulk, and it is working as designed.
- **`available-on-request` is NOT an absence claim.** It says nothing about whether the fact
  exists for the parcel. That is why it had to be a new state rather than a reuse:
  `absent-verified` would be a lie (nothing looked), `not-applicable` would be a lie (it
  probably does apply), `refused` means the source cannot say (here it can, we have not paid
  to ask), and `unaccounted` means "a gap we must close" when this is not a gap.
- **It requires a named, REACHABLE `requestPath`.** Refuse to write the state without one. A
  `requestPath` that is dead makes the cell `unaccounted` or `refused`, never a promise the
  product cannot keep. That guard is what stops this state becoming cover.
- The publish gate treats it as **satisfied**, like `not-applicable`. `unaccounted` stays
  fatal at publish.
- **Adding a rail to this state is a ruling, never a lane's discretion.** Do not extend it to
  a fourth rail because that rail is hard to acquire.

## The consequence you must handle, and it is the real work
A six-value union across a 981,405 x 65 grid and every consumer that switches on cell state:
`parcelRecordAllowlist.ts`, the gate CLI, the serve-layer rail adapters, the MCP tool schemas.
**Each of those is a place where a missing case must FAIL CLOSED rather than fall through to a
default.** Enumerate every switch on cell state before you write the first one, and report the
list. A consumer that silently treats an unknown state as an absence is the `classifyRequiredLeaf`
defect (2026-09-09) reproduced, where 25 of 25 Caldwell zoning rails graded `value` while three
were absences.

## Completion predicate
Count of `hoaDeedRestrictions|ossf|publicRecordRefs` cells in the six CTX counties whose
`cell_state <> 'available-on-request'` equals 0. The predicate counts cells NOT in the state
deliberately, so a relabel to anything else - including a fabricated absence - reopens this lane.
`node scripts/plan-progress.mjs --sql` in doc_repo for the exact query.

## Out of scope
Acquiring any of the three rails. Extending the state to other rails. Changing P-85.
