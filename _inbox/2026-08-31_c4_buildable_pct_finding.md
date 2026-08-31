---
id: 2026-08-31_c4_buildable_pct_finding
title: C4 — a known 9,350 sq ft buildable area renders as not-stamped on the gold parcel
date: 2026-08-31
status: open
plan_row: F-06
owner: unassigned (serve-side; property seat)
source: _inbox/2026-08-31_gate8_live_1437_48021.json (Gate 8 inhabited dayOne, 14:37Z, SHA 3a0dc9a)
snapshot: doc_repo main e904a2b; production arm; PE and smartsite.cloud facets route
---

# The finding

Gate 8's first honest inhabited run failed C4 on the gold parcel. It is the only
one of the three failures that is not already tracked, and it is the only one that
is a wrong answer visible to a customer today.

| node | envelope.status | buildableAreaSqFt | summary.buildableAreaPct | C4 |
|---|---|---|---|---|
| 48021:34137 | `ok` | **9350** | **null** | fail |
| 48055:20478 | `no-buildable-area` | 0 | null | pass |
| 48453:227161 | `declined` | null | null | pass |

The two passes are correct: neither envelope claims a positive buildable area, so a
null percentage is consistent. The gold parcel is different. The envelope status is
`ok`, the buildable area is a real 9,350 sq ft, and the derived percentage is null.
PE's `liveBuildablePct` renders that as **not stamped**.

So the surface tells a customer we have nothing, on a parcel where we have 9,350
square feet. That is not honest absence. Honest absence is what 48055 and 48453 are
doing.

# Two mechanisms, neither ruled out

**A. The derivation is broken or absent.** `buildableAreaPct` is presumably
`buildableAreaSqFt` over a lot area, and the computation is missing from the serve
path or is failing silently to null. If so the fix is the derivation.

**B. The lot area is genuinely unknown**, so the percentage cannot be computed and
null is the correct value for that field. If so the field is right and **the defect
is the rendering**: PE collapses "percentage not computable" into the same
not-stamped state as "no buildable area", and it discards the 9,350 sq ft it holds.

These produce the identical observation from outside. Distinguishing them takes one
read of the serve path for where `summary.buildableAreaPct` is populated, plus a
check of whether a lot area exists for 48021:34137. Do that before proposing a fix;
a fix aimed at A when the truth is B adds a derivation that will still be null.

Under B the customer-facing defect is worse, not better, because the number exists
and is being withheld by a label.

# Why this is not blocked and will be skipped anyway

C4 is serve-side, not write-side. P4's rails do not touch it, so it does not gate
P4, and that is precisely why it needs an owner now: nothing downstream will trip
over it. It is not on the board, not in the P2b PE wiring card's four defects, and
not in the ledger.

It is also a member of a class the board already carries under "known lies in prod":
PE saying not-stamped where data exists. This is a second instance with an exact
measurement attached.

# What would close it

The serve path read that distinguishes A from B, then either the derivation lands
or PE stops collapsing "not computable" into "not stamped" and renders the 9,350
with its unit. Re-run Gate 8 dayOne on 48021:34137 and watch C4 move from fail to
pass on an inhabited body. Do not close it on a code change alone; C4 is already an
assertion in a gate that now works, so the gate is the test.

```
leave_behind:
  - item: C4 buildableAreaPct null on a positive-area envelope (48021:34137)
    owner: unassigned
    plan_row: F-06
```
