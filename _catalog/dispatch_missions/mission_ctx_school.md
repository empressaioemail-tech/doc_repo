# CTX-SCHOOL — twelve parcels are holding two counties at the publish gate

Repo: `hauska-factory` for the diagnosis. The fix may live elsewhere; establishing where is
part of the mission.

Small lane, and the smallness is the point: twelve parcels are the difference between two
counties publishing and not.

## The measurement

Read live from `parcel_gate_verdict` on 2026-09-09 after the zoning rail applied:

    county   rail                    verdict   unaccounted
    48453    schoolDistrict          refuse              2
    48021    schoolDistrict          refuse             10

Every other rail in both counties passes at zero, including `zoningDistrict`, which nine
lanes resolved today. Travis additionally refuses on `maxImperviousCoverPct` at 244,669,
which is separately owned by the integration seat and is NOT yours.

`evaluatePreBakeReadiness` refuses the whole publish when any required rail's verdict is
`refuse`, so these twelve parcels block Bastrop and Travis entirely.

## What is known about the writer, so you start from the code not from scratch

`src/jobs/parcel-school-district.mjs` ingests the `schoolDistrict` scalar rail onto
`parcel_record` from `tx_school_district`, staged on `PRODUCTION_NEONDB_URL` by
`acquire-school-district.mjs`.

Its join method is **centroid-in-polygon**, deliberately different from
`parcel-r4-companions.mjs`'s full-polygon `ST_Contains`/`ST_Intersects`. Its own module doc
explains the zone-major hoist and the reason `tx_school_district` carries no per-row
`county_fips` — an ISD routinely spans counties, so a single scoping value would drop a
boundary-spanning district from a county it actually reaches.

`schoolDistrict` was also one of the four rails PARCEL-SCOUT-GIS found acquirable and
ACQUIRE-GIS wave 1 covered. If that lane's acquisition is incomplete for these counties,
that is a different defect from a join miss and must not be reported as one.

## The three mechanisms, and you must separate them

**A. Degenerate geometry.** A parcel with no valid ring has no usable centroid, so
centroid-in-polygon cannot place it. This is the leading hypothesis and it has a lot of
prior art today: Caldwell's `48055:1` shares a `prop_id` with 203 distinct `txgio_parcel`
features, `48491:PRIVATE ROAD` is a literal string where a `prop_id` belongs, and
CTX-HAYS-SPLIT established StratMap rows were grafted into `cad_property` with
`source_file` overwritten in place. Twelve is exactly the scale that family produces.

**B. A genuine coverage gap.** The parcel's centroid is real and falls outside every staged
district polygon — a boundary sliver, a right-of-way, water. Then the honest answer is a
declared absence, not a value.

**C. Acquisition incomplete.** `tx_school_district` does not hold the district that covers
them. Different defect, different fix, different owner.

Name each of the twelve to a mechanism. Do not report a single number across mechanisms.
State the mechanism you chose per parcel and, for the population as a whole, the second
mechanism you rejected and why.

## The absence must be earned, not defaulted

Whatever the mechanism, the fix is never a default value and never a filter.

If these parcels genuinely have no school district determinable, they earn a declared
absence carrying its basis — the same discipline CTX-LEAVES built for four leaves on
2026-09-08 and CTX-LEAVES2 is extending to `baseFacts.acreage` right now. Note that
CTX-LEAVES2 measured 100 percent of that population as `refused` rather than
`absent-verified`, because the ring was never genuinely examined. **Apply the same test
here rather than inheriting either answer:** `absent-verified` is a claim that something
looked, and per `ENFORCEMENT.md` writing it where nothing looked is a lie that passes every
check.

Do not widen `evaluatePreBakeReadiness`, do not add a tolerance to the rail gate, and do not
exclude any parcel from the count. `unaccounted` is legitimate at rest and fatal at publish
by design; the answer is to account for them honestly, not to stop counting them.

## Verify by violating

Show the rail refusing to write a value for a parcel that genuinely cannot be placed, and
writing a real district for one that can, in the same run, by real parcel id. Confirm the
gate still refuses if any rail's verdict is `refuse` — this lane must not make the gate
stop firing.

## The direct question

State as a plain yes or no: **after your change, do Bastrop and Travis clear
`evaluatePreBakeReadiness` on the `schoolDistrict` rail?** Travis will still refuse on
`maxImperviousCoverPct`; answer only for your rail.

Three lanes today surfaced a precondition nobody had asked about by answering this kind of
question honestly rather than closing clean. Do the same if you find one.

## What you must NOT do

Do not touch `maxImperviousCoverPct`. The integration seat owns it and it is in flight.

Do not deploy, submit a Cloud Build, or run any bake, publish, walk or Cloud Run job. A
read-only query against the stores is expected and is not an execution.

Do not write to `legacy-design-tools`, `hauska-engine` or `hauska-map`. If the fix belongs
in one, report it precisely enough to dispatch — CTX-PROV and CTX-ACREAGE both did exactly
that and each saved a full lane.

## Traps carried forward, all paid for today

`parcel_record_cell.place_key` is `<fips>:<prop_id>`. `place_layer_snapshots.place_key` is
`node:<fips>:<prop_id>`. Two tables, two shapes; the integration seat assumed wrong and got
six rows of `n=1` that looked like an answer.

Unscoped scans on `parcel_record_cell` time out. Scope by `place_key` prefix, `rail_key` or
`updated_at`, and set `statement_timeout`.

`txgio_parcel` carries multiple geometry rows per `prop_id` (48021: 74,729 rows against
62,257 distinct). Per-parcel `EXISTS` aggregation, never a flat join.

A long-running query at near-zero CPU is stuck, not slow.

## Close contract

Standard lane close JSON, plus:

- All twelve parcels by id, each assigned to a mechanism, with the evidence.
- The rejected second mechanism for the population.
- The absence state you chose and whether its verified-absence pair genuinely exists.
- Whether this class appears in the other four counties — measure it, do not assume twelve
  is the whole population.
- Both violation runs by real parcel id.
- The direct yes or no.
- `leave_behind`.
