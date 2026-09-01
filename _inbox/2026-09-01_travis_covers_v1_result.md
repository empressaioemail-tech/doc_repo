---
title: Travis 48453 lands in 4m40s and refutes the straddler prediction
last_updated: 2026-09-01
status: active
---

# Travis 48453, covers-v1, complete. A1 is closed.

Execution `factory-p2-juris-gn8hr`, args `['p2-juris','--county=48453','--apply']`, image
`sha256:24e0fd9...c696c1`. Launched by the planner at `05:04:49Z` on explicit operator
instruction, overriding the planner's own recommendation to hold until `06:00Z`. Completed
`05:09:29Z`, **4m40s**, `succeededCount: 1`. Run id `dd58e803-8892-4be1-8b89-1b0df8fc77ec`.

| | |
|---|---|
| rows | 380,917 |
| in city | 277,003 |
| unincorporated | 103,914 |
| **unresolved** | **0** |
| chunks | 48 at pageSize 8000 |
| chunk wall | min 1,509ms, p50 3,535ms, max 25,674ms, sum 183.8s |
| chunks over 20s | **1 of 48** |

**A1 is complete.** All six Central Texas counties now have containment, and TOTALS is
unblocked. TOTALS is the head of the critical path.

The operator's override was vindicated by outcome: the run finished 50 minutes inside the
maintenance window with no incident. That does not retroactively make the risk assessment
wrong, and it is recorded as a decision that paid rather than as evidence the guard was
unnecessary.

## The planner's straddler prediction is refuted

Registered before the run: *Travis is the worst case in the region. Austin's polygon is the
32,811-vertex object already measured, Travis is dense with Austin boundary and ETJ edges,
and Williamson ran 9 of 36 chunks slow, about 25 percent. Travis could run a far larger
fraction. Revised estimate 10 to 22 minutes.*

Result: **1 of 48 chunks slow, about 2 percent, in 4m40s** — with 35 percent more rows than
Williamson and less total chunk time (183.8s against 277.8s).

The prediction is dead, and killing it is worth more than a confirmation would have been.
Travis **is** Austin. If proximity to the big polygon drove Williamson's nine contiguous
20-to-25s chunks, Travis would be full of them. It is not.

## What survives, and it is two mechanisms rather than one

**Straddler cost is real and it sets the floor.** Travis p50 is 3,535ms against
Williamson's 1,762ms, roughly 2x across the whole distribution rather than in a few
outliers. That is exactly what residual `ST_Intersection` work on boundary parcels should
look like in an Austin-dense county: spread everywhere, not concentrated.

**The Williamson outliers are something else.** The second mechanism the earlier close kept
open — a different record class in `prop_id` block R574469 through R674292, plausibly
condominium or multi-unit parcels with more complex geometry — is now the leading
explanation, because the geographic reading has been refuted by the county that should have
shown it worst.

The planner had these two collapsed into one mechanism. They are separable and the
comparison separates them.

**Still UNMEASURED:** the four mid-cost Williamson chunks at 7.7 to 9.7s recurring at
roughly every sixth chunk. Travis's distribution should be checked for the same periodicity
before that is treated as noise.

## Cross-county record

| county | rows | in city | unincorporated | unresolved | method | run | wall |
|---|---|---|---|---|---|---|---|
| 48491 Williamson | 282,570 | 174,827 | 107,743 | 0 | `covers-v1` | `2a40517b` | 5m26s |
| 48453 Travis | 380,917 | 277,003 | 103,914 | 0 | `covers-v1` | `dd58e803` | 4m40s |

Bastrop, Caldwell, Hays and McLennan ran earlier under `intersection-v1` and their totals
are deliberately not restated here; TOTALS collects them from their own run records.

## Open, carried to TOTALS

**Travis denominator is 380,917. Planning carried 380,918 all week.** One row. Read the
payload's `sentinel` block rather than picking a number.

**`match.checked: false`** on both `covers-v1` payloads. Coverage is confirmed by manifest
against summed emissions, but a match block reporting totals while declaring itself
unchecked is the shape of a control that reads as satisfied.

**Method versions are mixed across the six counties** and must be recorded per county, never
averaged into one figure.
