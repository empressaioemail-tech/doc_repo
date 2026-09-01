---
title: Planner handoff — fill the parcel record, six counties
last_updated: 2026-09-01
status: active
---

# Handoff

## The job

Fill a parcel record for every parcel in six Central Texas counties with data we already
hold, or an honest absence. Operator ruling
`_decisions/2026-09-01_parcel_record_is_the_gate_to_everything.md`: this outranks Wave R,
the rail applies and P5. Rebake is acceptable.

Standing rule `_decisions/2026-09-01_every_parcel_starts_with_a_full_record.md`: a record is
instantiated with its complete column set and is never partially shaped. Acquisition changes
a cell's state, never its existence. **A missing column is invisible; an unaccounted cell is
countable.**

Cell states: `value` with provenance, `absent-verified` with a basis, `not-applicable` with
a reason, `refused` with a name, `unaccounted` which is legitimate at rest and fatal at
publish. **Never convert `unaccounted` to `absent-verified` to clear a gate.**

## The single fact that blocks everything

**`schema.sql` is merged on engine main and has never been applied to any store.** The
parcel-record table does not exist. The 52 rails, the cell-state types, the companion tables
and the publish gate are all code with nothing under them.

`packages/engine-core/src/parcel-record/` on `hauska-engine` main at `bfa9642`.

## The next action, per the operator

**Apply the schema, then fill a handful of parcels in EACH of the six counties — not one
county end to end.** The variance is between counties, not within one, and it is already
measured:

| county | dollar fields at source | livingArea | notes |
|---|---|---|---|
| 48021 Bastrop | 77,164 market | 11.2% | atoms INVENT: 40,602 living vs CAD 8,712 |
| 48055 Caldwell | 48,588 | 27.7% | 24,552 real `$0` improvements in CAD |
| 48209 Hays | 154,313 | 54.3% | roll atoms hollow (265,881 bodies, 29 keys) |
| 48309 McLennan | 113,360 | **0** | assessed also 0 at source |
| 48453 Travis | 494,364 | **0** | roll atoms hollow (492,851 bodies, 3 keys) |
| 48491 Williamson | 590,644 | 40.8% | roll atoms hollow; 602,050 snapshots vs 319,487 atoms |

A six-county sample exercises every one of those shapes at once. One county exercises one.

Then fill all six. Nothing serialises them any more.

## Measured facts to build on, not re-derive

**Parcels: 981,405** across the six (containment, all six complete, zero unresolved).
In-city 611,116, unincorporated **370,289** — not the roadmap's 357,269, which is wrong by
about 13,020 in the split. `not-applicable` for zoning, setbacks, edges and envelope belongs
to the 370,289 and nowhere else.

**Read `cad_property`, never the roll atoms.** Hays, Travis and Williamson bodies are hollow
with 29 / 3 / 7 claim keys; Bastrop atoms invent coverage CAD lacks. `#575` shipped a bake
reader mapped off the atom body and it would have starved three counties and fabricated in a
fourth — merged code, caught by a card constraint, not by CI.

**The snapshot table is not a projection of the atom table.** Williamson has 602,050
`place_layer_snapshots` rows against 319,487 roll atoms. An atom-iterating re-bake misses
282,563 rows.

**Stored zeros are real and differ per county.** Caldwell 24,552 and Bastrop 6,158 `$0`
improvements in `cad_property`. `living_area_sqft` has no stored zeros anywhere.

**Zoning:** 72 unique cities, 23 with a real staged layer, 49 without. Eight need stamping
only, no acquisition. The ledger cannot tell you where zoning is missing — it measures
whether a scorer ran, and Travis serves zoning live while the ledger scores 0.00%.

**Setbacks:** 188,103 placeholder rules; Hays and Williamson are 100% placeholder. A
placeholder-derived setback is not a `value`.

**Store landmines**, each returning a confident wrong answer: the atoms store is database
`hauska_mcp` not `neondb`; factory `runs.status` is `success` not `succeeded`;
`landing.method` is `ring` on every persist row including `covers-v1`; a county's latest
factory success may be a `persist:false` measure run; and **`jurisdiction_tenant` is not a
FIPS scope** — scope by half-open `entity_id` ranges.

**Credentials** are in GCP Secret Manager, never on disk:
`gcloud secrets versions access latest --secret=PRODUCTION_NEONDB_URL --project=hauska-prod-497015`

## The fleet

Four agents, all seat `property`. Queue at `_queue/`, protocol `_queue/README.md`, loop spec
`90_runbooks/seat_loop.md`. Cards are compiled, never hand-written:
`node scripts/dispatch.mjs --plan OPS-19 --lane <ID> --plan-row F-01 --repo <r> --mission-file <f>`.

Seats commit and push their own branches before closing; the planner cannot, SEAT-01 refuses
it. That failed five times in one day before the runbook said so explicitly.

## What the previous planner got wrong

**Five wrong mechanisms**, each refuted by a seat: the write-path falsifier, the Travis
straddler forecast, `#371` as the owner-erosion cause, deletion refuted on bad arithmetic,
and the JSONB predicate hypothesis. The actual answer to the owner question was that two
measurements asked different questions about an unchanged population. **Recover the original
query before theorising about the data.**

**Built queue machinery instead of filling the database.** A store token that locked the
whole store when conflicts are row-scoped, then release semantics, then identity keying,
then a concurrency cap started three messages after the operator said remove it. The token
is now removed. Do not rebuild it. If concurrent load is a real measured problem, fix it
where it is measured.

**Anchored on one-county-end-to-end.** That was right for acquisition, where the L2 work
found five blockers serially. It is wrong for filling from data we already hold, where the
differences between counties are already measured and a six-county sample tests all of them
at once.

**Became the scheduler.** Cards were written one at a time in reaction to each close, so the
board emptied whenever the planner stopped. Pre-card the matrix.

## Do not

Do not rebuild the store token. Do not read roll atoms for CAD fields. Do not stamp
`not-applicable` outside the 370,289. Do not convert `unaccounted` to `absent-verified`. Do
not source Bastrop permits from SmartCity. Do not count a placeholder setback as a value. Do
not trust the ledger for whether zoning exists.
