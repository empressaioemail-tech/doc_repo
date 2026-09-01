# Mission — fill the parcel record: Williamson (48491), whole county

## Why

Operator ruling `_decisions/2026-09-01_parcel_record_is_the_gate_to_everything.md`.
PARCEL-SAMPLE-SIX proved the fill job on every county shape; this card runs it for all
of Williamson. Nothing serialises the six county fills; they run in parallel.

## This county's measured shape

- 590,644 parcels with dollar fields at source; livingArea 40.8%; roll atoms hollow.
- 602,050 place_layer_snapshots rows against 319,487 roll atoms — the snapshot table is NOT a projection of the atom table; neither is a source for this fill. cad_property only.
- Setbacks 100% placeholder — placeholders are not values.

## What to do

Execute the `parcel-record-fill` job proven by PARCEL-SAMPLE-SIX for this ENTIRE county:
instantiate every containment parcel's full 52-rail record, then CAD-ingest from
`cad_property`. Chunked (chunk-manifest pattern), idempotent, run row and termination
record per execution per BP-FACTORY-01. Re-verify the sample card's close and every
addendum before starting; if the sample close named a defect in the job for your county's
shape, that defect is your premise, not your surprise.

This card FILLS. It does not fix data, does not acquire, does not bake, does not publish.
A gap found here is reported honestly in its cell state, nothing else.

## Verify (meaning-shaped, after the run)

- `parcel_record` rows for this county = the containment parcel count (independent
  derivation: the containment/jurisdiction table, not the fill job's own counter).
- Cell rows = 52 x record rows, exactly. Parcels with != 52 cells: expect 0, list any.
- `not-applicable` cells joined against containment: zero on in-city parcels, and only on
  the module's unincorporated rail list.
- Stored `$0` at source landed as `value: 0` — count matches the source count for this
  county from an independent `cad_property` query.
- Idempotency spot check: re-run one chunk, zero state drift.
- Paste every verification verbatim with snapshot (store, database, job execution name,
  timestamp).

## Landmines

- READ `cad_property`, NEVER roll atoms for CAD fields; never snapshots as a CAD source.
- Verify the run's scope from the execution's own status and log close line, not from
  store reads under writer load. Cloud Run args are `--name=value`; read back the run
  scope before trusting a job execution for this county.
- The Tuesday 05:00-06:00 UTC maintenance window kills long runs; the queue refuses
  claims inside it but a run STARTED before it will die in it — plan the run so it does
  not straddle the window.
- A county's latest factory success may be a `persist:false` measure run; check the run
  row's arguments, not just its status. `runs.status` is `success`, not `succeeded`.
- Never convert `unaccounted` to `absent-verified`. Never echo a secret. Do not rebuild
  the store token; counties do not conflict and nothing serialises the six fills.

## Close

`_inbox/2026-09-01_parcel-fill-48491_close.json` with per-rail state counts for the
county, `whatContradictedTheCard` (mandatory), `leave_behind`, scratch block.
