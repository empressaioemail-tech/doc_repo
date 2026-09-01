# Mission — P2-JURIS containment, resolved to a number P3 can consume

Plan row: F-01. Board: `_inbox/2026-08-31_p2_juris_partition_record.md`. Decision:
`_decisions/2026-08-31_p2_juris_totals_unmeasured.md`.

## What resolution means

P3 cannot be scoped until one six-county containment split exists, measured under
ONE declared method, with the 2026-08-30 baseline either reconciled to it or
discarded on a stated reason. Anything less leaves P3 stamping `not-applicable`
off a number that has already been contradicted.

Three sub-problems. B is first and may be answerable with no heavy scan.

## A. The instrument

Full-county containment emits for Caldwell (24,989 / 78s) and Bastrop (62,257 /
129s) and cancels at 180s for Hays (116,421), McLennan (114,255), the six-county
run, the Hays 30k slice, and probe6. Williamson (282,570) and Travis (380,918)
were never run.

Four cost mechanisms were proposed and all four lost, each a curve fitted through
two or three points. Do not offer a fifth fit.

| Dead mechanism | Killed by |
|---|---|
| parcels-linear (~1.37 ms/parcel) | predicted McLennan ~156s; it cancelled |
| city-count (parcels x roster touches) | Hays 13 vs McLennan 21; both cancelled |
| chunk-linear | confounded by a plan flip, re-opened, not retired |
| Austin vertex budget | real straddle, but only 3.56% of Hays parcels reach its bbox |

Settled and not to be re-derived: Bastrop and Caldwell emit on Hash Join. Hays-full
(EXPLAIN C) and McLennan cancel on that same shape, so the Hays-full cancel is
runtime, not a plan flip. The Hays 30k Nested Loop was a slice artefact:
`IN (SELECT ... LIMIT)` is opaque, estimated 1,841 against an actual 30,000.
Cost estimates here rest on a `rows=1` cardinality lie, and the cheaper-costed
plan is the one that cancelled.

Two instruments remain live. Neither is licensed as an answer:
- **Range-chunk.** `prop_id >= X AND prop_id < Y` is estimable where the LIMIT
  subquery was not, and should hold Hash Join. It carries no mechanism-backed
  prediction, so running it is an empirical cost-vs-parcels test at a fixed city
  set, not a confirmation.
- **Per-city bbox-reach x npoints.** This is the measurement that would actually
  name the product driving cost. It was offered and not licensed. It is licensed
  now.

## B. The method disagreement (do this first)

The board's P3 populations (357,269 not-applicable / 624,141 in-city / 981,410)
come from `_inbox/2026-08-30_ctx_w3_collect_amendments.md` lines 66-76. The 08-31
runs re-measured two of those six counties under the 1e-8 floor with ring
containment. Both disagree with the baseline, in opposite directions:

| County | 08-30 in-city | 08-31 in-city | Delta | Denominator |
|---|---|---|---|---|
| Bastrop 48021 | 12,318 | 11,992 | -326 | 62,257 both runs |
| Caldwell 48055 | 10,310 | 10,628 | +318 | 24,989 both runs |

Denominators agree exactly, so the parcel universe is identical and only the split
moved. The Bastrop -326 is documented as 320 slivers under 1e-8 plus 6 unnamed.
**The Caldwell +318 is documented nowhere and runs the opposite way.**

Two candidate mechanisms for the Caldwell delta, neither ruled out:
1. Floor application alone. Rejected as sufficient on its own, because the floor
   removes in-city hits and cannot add 318 of them.
2. Method change. The 08-30 doc says Caldwell is "a bbox-centre approximation
   because 48055 carries no parcel geometry." The 08-31 emit says 100% ring,
   `n_bbox_centre` 0. Those two statements contradict each other. Either geometry
   landed between the runs or one record misdescribes its own method.

Establish which. The 08-31 SQL is at `sql/p2-juris/` in the join worktree. **If the
08-30 method cannot be recovered from a tracked artifact, do not reconcile to it.
Declare the baseline unrecoverable and discard it**, and say so in the close, because
a reconciliation against an unrecoverable method is a fabricated agreement.

Direction matters and is the reason this is first: stamping `not-applicable` from
the 08-30 number would over-stamp Caldwell by 318 parcels that are in fact in-city.
That is the exact defect P3 is warned against, an unearned structural claim.

## C. The Bastrop 6

+326 in-city shift is 320 slivers under 1e-8 plus 6 unnamed. The leading CP1
mechanism is a ring leaving 48021 and hitting a city that does not intersect the
county polygon. It is unproven.

The probe that tests it is **unincorporated non-sliver Bastrop parcels against
cities in an adjacent county that do NOT intersect 48021**, same 1e-8 floor. That
is a different predicate, not a scoped re-run. Cities overlapping 48021 is the
wrong cut, and dropping equality against all 1,222 cities was already tried: same
62,257 parcels, ~100x the city side, 180s cancel. Equality is what makes Bastrop
tractable.

`49939` is a literal in the record, not an identity set, so a 326-vs-320 set-diff
is starved. If you want the 6 named you must emit the identity set.

The 6 do not gate the six-county split. Do not let them block A or B.

## Do not

- Do not raise `statement_timeout` above 180s.
- Do not adopt any split without a measured six-county emit under one declared method.
- Do not cut a chunk with `IN (SELECT ... LIMIT)`. It flips the plan.
- Do not use Neon MCP as the timed instrument. `-32001` is the HTTP client, not
  Postgres, and `SET LOCAL` read-only does not bind across MCP statements.
- Do not run psql from a laptop. Short-lived minted RO credential, read-only proven
  by violation (a durable `CREATE TABLE` must refuse) each session, credential
  cleared after each.
- Do not mint a write URI. Persist is not this card; it waits on the P2 job template.
- Do not treat `breadth_*` as a jurisdiction source. It is name-normalisation only.
- Do not give a CDP a `place_fips`.
- Do not run two heavy scans against one Neon concurrently.
- Do not offer a fifth cost fit through two or three points.
- Do not touch any repository other than the Factory join worktree.

## Known leave-behind

Sentinel `prop_id` `"0"` is live in `txgio_parcel` (surfaced by the Bastrop
`min(prop_id)` sampler). It is a persist-time problem, recorded here so it is not
re-found as new.

## Close

Use the exact CP1 / CP2 / CLOSE paths named at the end of this dispatch. Declare snapshot
(repo, branch, commit) in the first output. State the falsifier for each check
before running it. `leave_behind` named, `none` is valid. Subagents do not commit.
Verification does not delegate below the lane planner.
