---
title: COVERS-FASTPATH result — the containment overlay is dead, and the code that killed it was never committed
last_updated: 2026-09-01
status: active
---

# COVERS-FASTPATH result

Lane snapshot: product work in `P:/tmp/hauska-factory-covers-fastpath` on
`feat/covers-fastpath`. Serving image
`sha256:24e0fd9ad41d94cdc6476400902e2185d82868c04604a972872e11515ec696c1`, job generation
8, read from the job's `image` and `IMAGE_DIGEST` fields rather than the tag.

Independently confirmed from doc_repo: generation 8, and `IMAGE_DIGEST` agrees with the
spec image. Those are two fields on one payload rather than two derivations, so it is an
internal-consistency check, not a meaning-shaped one. It is what was available.

## The measurement

Expected speedup was locked in CP1 before any measure: Williamson chunk 2 at 8 to 20x,
fail if 80s or above; cheap Williamson and McLennan chunk 1 at 5 to 15x; emit must be
identical.

| range | baseline | measured | speedup | emit |
|---|---|---|---|---|
| McLennan 100000 to 112364 | 60.3s / 61.9s | 1.097s | 55.7x | 5876 / 2124 / 0 / 8000 identical |
| Williamson PRIVATE ROAD to R014834 | 84.6s | 2.105s | 40.2x | 4306 / 3694 / 0 / 8000 identical |
| Williamson R014834 to R031819 | 145.2s | 1.838s | 79.0x | 3141 / 4859 / 0 / 8000 identical |

All three arms identical and all three faster than the predicted band. The 80s falsifier
did not fire. The measure was SELECT-only, so run `fb490620`'s 72,000 landing rows were
not rewritten.

## What landed

Fix A: `ST_Covers` then `ST_Area(parcel)`; straddlers still pay `ST_Intersection`. The
`1e-8` floor unchanged.

Fix B: county-scoped city set decoded once per session into TEMP `p2_cities_ok` with GiST
and `ANALYZE`. One `pg.Client`, no Pool.

Fix C: chunk manifest plus `method_version`. A missing version reads as
`intersection-v1`. Applying `covers-v1` onto `fb490620`'s nine chunks refuses
`METHOD_VERSION_MISMATCH`; matching versions still skip. Both directions exercised.

45 tests pass, 0 fail.

## The band was missed upward by 4x, and here is why that is not a free win

The measure is SELECT-only. The baselines were not: the 145.2s chunk also wrote 8,000
rows. So what collapsed 40 to 79x is the **geometry** term, and the **write** term is now
dominant and unmeasured.

The low-vertex counties bound it, because their geometry was already cheap: Bastrop
62,256 rows in 8 chunks over 1m58s is about 15s per chunk; Caldwell 24,988 in 4 chunks
over 1m14s is about 19s. Both figures are geometry plus write.

So the honest run-level prediction for Williamson is 36 chunks at roughly 10 to 15s, about
6 to 9 minutes, **not** the 65 seconds that 1.8s times 36 implies. Travis 48 chunks, 8 to
12 minutes. Still decisive against 8 to 10 hours, and worth stating before the run rather
than after it underperforms arithmetic that quietly dropped the writes.

Registered falsifier for the next run: **per-chunk wall materially above about 20s means
the write path is the new bottleneck** and gets its own card.

## Cost-budget chunking is not needed

The corridor chunk that cost 145s costs 1.838s with the same emit. A uniform 8,000-row
page is sufficient. That card is dropped, not deferred.

## The finding that outranks the speedup

The serving image was built from a working tree that has never been committed to any git
object. Verified from doc_repo:

```
$ git -C /p/tmp/hauska-factory-covers-fastpath rev-parse --abbrev-ref HEAD
feat/covers-fastpath
$ git log --oneline -1
5f9acc3   <- main's tip; the branch carries ZERO commits
$ git diff --stat
 5 files changed, 399 insertions(+), 64 deletions(-)
 ?? test/p2-juris-57p01.test.mjs           269 lines
 ?? test/p2-juris-covers-fastpath.test.mjs 226 lines
```

`origin/main` is `5f9acc3` and `feat/covers-fastpath` is not on origin at all. About 894
lines carrying three separate pieces of live production code — the 57P01 error listeners,
the HELD replay gate, and this fix — exist only as dirty files in `P:/tmp`, which holds
seven factory clones and has been recycled before on this operation.

The lane was right not to commit: the tree tangles its own work with another lane's
uncommitted 57P01 and replay changes, and committing those under a covers-fastpath message
would misdescribe the diff. But the resulting state is that production code is one
directory deletion from unrecoverable. Rescue is step 1 of `CTX-CONTAINMENT-RUN`.

**The related conformance gap:** the job's full env is `CLOUD_RUN_REGION`,
`CONTRACT_VERSION`, `FACTORY_CLOUD`, `FACTORY_DATABASE_URL`, `IMAGE_DIGEST`,
`PRODUCTION_NEONDB_URL`. There is no git SHA of any kind. F-00 requires an execution to
record `engine_sha` alongside `image_digest`; the digest is present and the SHA is not,
which is exactly what let an uncommitted build stay invisible. A digest identifies an
artifact; only a SHA ties it to a source. Carried to the rebuild card.

## Three corrections to the planner's record

**The run row was not `started`.** `mission_covers_fastpath` asserted it as fact. The
planner had not read the control store and cannot. Store truth: the reaper had already
written `killed / execution-finished` at `04:20:29Z`, six minutes after the cancel,
working as designed. `writeTermination` correctly refused `ALREADY_TERMINATED` and was not
overwritten; a named operator-cancellation event was written additively at `04:24:10Z`
recording nine chunks, 72,000 rows, `cancelledCount: 1`. Same error class as the Bastrop
license `1dda40f7` earlier the same day: an inferred state recorded as a measured one.

**The Travis prediction is retired unproven.** Travis was predicted structurally
non-terminating under the old design, with the falsifier that chunk 1 landing under about
3 minutes would refute it. Travis never ran on the old design, so the prediction is now
permanently untestable. It is not scored as a win.

**Fix B was this operation's own known pattern, re-applied.** TEMP once-decode plus GiST
plus one client is the L1 Harris fix from 2026-08-13, already recorded. The P2-JURIS job
was re-decoding the statewide city table every chunk under `NOT MATERIALIZED`. The pattern
existed and was not carried across, which is worth more attention than the novelty of the
`ST_Covers` asymmetry.

## Resume disposition

`fb490620`'s 72,000 rows are forfeit and that is the right call. The emit is proven
identical, so `covers-v1` and `intersection-v1` chunks genuinely are interchangeable, but
building a declared-equivalence path costs more than the roughly nine minutes a clean
restart now costs. The fix made the resume question moot. New run id, from zero, and the
`METHOD_VERSION_MISMATCH` refuse stays as written.
