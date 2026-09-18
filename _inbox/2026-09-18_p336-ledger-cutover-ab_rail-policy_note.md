# P-336 RAIL_POLICY handback -- read before applying the .diff

File: `_inbox/2026-09-18_p336-ledger-cutover-ab_rail-policy.diff` (a bare patch; `git apply --check` passes clean at doc_repo origin/main 918e21e1).

It moves `parcelGeometry`, `pipelines` and `etjStatus` from the `mid-cutover` class to the default
must-pass loop in `scripts/six-county-completeness.mjs`, and rewrites self-test check 43 in both
directions. Verified by running the script's own `--self-test` with the patch applied: **SELF-TEST OK
(47)**. Reverted afterwards, because doc_repo commits are planner-owned.

## The condition

The patch is machine-correct. Its premise is now in question for **one** of the three rails.

Measured read-only against the atoms store the live readers serve from, with a positive control
(`_inbox/2026-09-18_p336-ledger-cutover-ab_atom-measurements.json`):

| county | `property-boundary-edge` atoms | distinct parcels |
|---|---|---|
| 48021 Bastrop | 26,846 | 3,732 |
| 48055 Caldwell | 57,180 | 6,482 |
| 48209 Hays | 509,928 | 48,611 |
| 48309 McLennan | **0** | 0 |
| 48453 Travis | **0** | 0 |
| 48491 Williamson | **0** | 0 |

The dispatch's trap list names McLennan only. Travis and Williamson are not named, and Travis is a
primary county. `rrc-pipeline-fact` is complete in all six counties, so `pipelines` is unaffected;
`etjStatus` is unmeasured here (its determination is not an atom in this store).

## Why the patch is unsafe for parcelGeometry as written

`refused` is an EARNED cell kind (`cell-state.js`), and the per-rail verdict returns ok when no cell
is `unaccounted` and at least one is earned. So a county whose `parcelGeometry` cells are *all*
`refused atom-miss` still grades **pass**. Applying the patch for `parcelGeometry` would let three
counties read COMPLETE on a rail for which they hold no boundary geometry at all -- the
silent-completion shape P-252 closed one level up, where a fully unaccounted county read as clean.

The writer is not wrong to refuse: A-214 says a join miss is not a verified absence, and mirroring the
reader's own `atom-miss` refusal is the only honest cell. It is the policy move that is premature.

## What to do

- `pipelines` and `etjStatus`: take the patch as-is.
- `parcelGeometry`: resolve THE_FINDING first -- either the three counties' atoms get written
  (`boundary-primitive-county-batch` is the producer the P-204 table names), or a ruling says a
  refused-on-miss rail does not count toward county completion. Splitting the patch is a one-line
  change: apply it for two rails, add `parcelGeometry` to the must-pass list once the atoms exist.

Open, named, not guessed: whether Travis and Williamson hold boundary atoms in a store, database or
tenant this seat's DSN and bind cannot see.
