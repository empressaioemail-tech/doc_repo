---
title: Post-Z2 verification — the residual is now exactly Hays plus the ruled-unwritten rails
date: 2026-09-11
status: active
owner: integration
plan_rows: [P-149, P-132, P-133]
snapshot: >
  scripts/plan-progress.mjs run 2026-09-11T14:25:29Z against FACTORY_DATABASE_URL_RO
  (read-only role, host ep-round-base-au0jofwp), from doc_repo main 94235cf4. Compared
  against the 12:23:30Z run of the same instrument recorded in
  _inbox/2026-09-11_ops21_first_live_progress_grid.md.
---

# Z2 corroborated independently, and the remainder fully explained

Two runs of the same instrument, two hours apart, either side of Z2's apply. Neither run
reads any lane's close.

## The deltas match Z2's claim to the cell

```
S1   291,055 -> 274,175     delta 16,880  =  3,376 parcels x 5 setback rails    EXACT
S2 2,673,932 -> 2,663,804   delta 10,128  =  3,376 parcels x 3 zoning-dependent EXACT
                                                              envelope rails
S4         0 -> 0   DONE    every (county, rail) pair still carries a verdict
```

3,376 is the population S1 identified from the write side, S4 corroborated from the verdict
side, Z1 confirmed as legitimately `not-applicable` from the store side, and Z2 moved. The
deltas are that number times the exact rail counts each lane owns. **Four derivations, one
population, and the movement matches.**

`parcelAreaSqFt` correctly contributes nothing to the S2 delta — it never depended on
`zoningDistrict` and was already resolved. Its absence from the arithmetic is itself a check.

## The remainder is fully accounted for, with no residue

```
S1 remaining   274,175  =  Hays 54,835 x 5 rails                            EXACT
S2 remaining 2,663,804  =  3P-14's four unwritten rails  611,116 x 4 = 2,444,464
                        +  Hays on the four written rails  54,835 x 4 =   219,340
                                                                        ---------
                                                                        2,663,804  EXACT
```

**Nothing is unexplained.** Every remaining unaccounted cell in these two predicates is either
Hays — structurally excluded from every write because P-145 has not landed — or one of the four
rails the operator ruled unwritten on 2026-09-11 (no "computed by approximation" state; the
trigger is the road-frontage acquisition).

There is no third category. There is no unattributed remainder.

## What this establishes

The predicates do not reach zero and **that is now the correct answer, not a gap.** A reader
seeing 274,175 and 2,663,804 should read them as "Hays is held" and "buildable area is ruled
unwritten," both of which are decisions on the record with named triggers.

When P-145 releases and Hays is filled, S1 goes to zero. S2 goes to 2,444,464 and stays there
until 3P-16 (road-frontage acquisition) lands.

## Method note

This is the second production run of the anti-drift instrument and the first used as a
before/after. Its value here was not the absolute numbers — the lanes measured those — but the
DELTA, which no single lane could produce because no lane spans two apply events. That is the
specific thing a program-level instrument does that a lane-level one cannot.
