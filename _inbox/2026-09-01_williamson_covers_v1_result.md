---
title: Williamson 48491 lands in 5m26s under covers-v1, and the residual cost is straddlers
last_updated: 2026-09-01
status: active
---

# Williamson 48491, covers-v1, complete

Execution `factory-p2-juris-2sk8f`, args `['p2-juris','--county=48491','--apply']`, image
`sha256:24e0fd9...c696c1`. Started `04:52:09Z`, completed `04:57:35Z`, **5m26s**,
`succeededCount: 1`, `Container called exit(0)`. Run id
`2a40517b-df07-4cb9-9f2c-8cfe68416b59`. It beat the Tuesday 05:00 UTC Neon window by
2m25s, which was luck rather than design; see the planner miss below.

| | |
|---|---|
| rows | 282,570 |
| in city | 174,827 |
| unincorporated | 107,743 |
| **unresolved** | **0** |
| chunks | 36 at pageSize 8000 |
| method | `join-rewrite-01`, `methodVersion: covers-v1` |
| chunk wall sum | 277.8s of a 326s run |

Coverage is verified by two derivations rather than one: the chunk manifest's
`denominator: 282570` is a count taken at run start, and `totals.total: 282570` is the sum
of what the 36 chunks emitted. They agree, with zero unresolved.

Prior comparison: the same county under `intersection-v1` managed 9 chunks in 2h23m before
being cancelled.

## The planner's falsifier fired on its threshold and is refuted on its mechanism

Registered before the run: per-chunk wall materially above about 20s means the write path
is the new bottleneck. Nine chunks exceeded 20s, so the number fired. The conclusion is
wrong, and the same log refutes it.

| chunk | wallMs | in_city | rows |
|---|---|---|---|
| 6 | 1,183 | 6,932 | 8,000 |
| 16 | 1,506 | 7,186 | 8,000 |
| 33 | 25,375 | 4,900 | 8,000 |
| 27 to 35 | 20,238 to 25,375 | ~4,100 to 5,100 | 8,000 each |

Every one of those chunks writes 8,000 rows. A 21x spread on identical row counts is not a
write path. And the slow chunks carry **fewer** in-city parcels than the fast ones, so the
in-city ratio does not explain it either.

**The falsifier was badly designed and that is the lesson.** It registered a number rather
than a mechanism, and a number fires for reasons unrelated to the claim it was meant to
test. The correct form would have been: per-chunk cost becomes independent of geography.
The data refutes that cleanly and would have said so on the first read.

## The temporal mechanism is dead, killed from inside the run

The nine slow chunks are contiguous at the tail of `prop_id` order **and** at the tail of
wall-clock time, which confounds geography with time. That is the same confound that
produced the wrong "IT IS THE IMAGE" reading earlier in this program.

**Chunk 36 separates them.** It ran last, at roughly `04:57:33Z`, closest to the 05:00
maintenance window, and it was fast: 2,191ms for 2,570 rows. Under a load or
maintenance-ramp mechanism the final chunk is the worst. It is not. Time is refuted and
geography survives.

Distribution for the record: 25 chunks at 1.2 to 3.0s, four at 7.7 to 9.7s (chunks 8, 13,
20, 26), nine at 20.2 to 25.4s (chunks 27 to 35), and the 2,570-row remainder at 2.2s.
The four mid-cost chunks recurring at roughly every sixth chunk are unexplained and are
recorded as UNMEASURED rather than fitted.

## Leading mechanism: covers-v1 killed interior cost, straddler cost survives

`ST_Covers` fast-paths a parcel wholly inside a city. A parcel straddling a city boundary
still pays the full `ST_Intersection` overlay. Straddlers cluster geographically along
annexation edges and ETJ boundaries, so a contiguous block of `prop_id` can be
straddler-dense while its neighbours are not.

`prop_id` R574469 through R674292 is such a block. R674292 and above is cheap again.

**Second mechanism, not rejected:** those `prop_id` ranges could carry a different record
class (condominium or multi-unit parcels with more complex geometry) rather than more
straddlers. The two are distinguishable and the test is cheap: count, over one slow range,
the parcels where `ST_Intersects` is true and `ST_Covers` is false. That is a straddler
count, and it is a second derivation rather than a re-reading of wall time.

## Travis prediction, revised upward before it runs

Earlier prediction was 8 to 12 minutes at 48 chunks. **Revised: 10 to 22 minutes.**

If straddler density drives the residual, Travis is the worst case in the region rather
than a typical one. Austin's polygon is the 32,811-vertex object already measured, Travis
is dense with Austin boundary and ETJ edges, and Williamson's slow block is plausibly its
Austin-adjacent corner. Williamson ran 9 of 36 chunks slow, about 25 percent. Travis could
run a far larger fraction.

At 48 chunks entirely at ~25s the run is about 20 minutes. **It still terminates**, and
nothing here reopens the structural-non-termination question. It does mean Travis must not
be started against a one-hour window with 20 minutes of assumed headroom.

## Planner miss, recorded

`CTX-CONTAINMENT-RUN` was compiled without the Neon maintenance constraint that the
owner-backfill card has carried all along. Williamson launched at `04:52:09Z` with the
window eight minutes out and finished with 2m25s to spare. That was luck. The guard
belonged on the card that runs a long job, not only on the card that mutates rows.

## Open

`match.checked: false` in the containment payload. Coverage is confirmed by the
manifest-versus-totals agreement above, but whatever `match` was intended to reconcile did
not run, and a match block that reports totals while declaring itself unchecked is the
shape of a control that reads as satisfied. Route to the lane for an answer on what it
compares and why it was skipped.
