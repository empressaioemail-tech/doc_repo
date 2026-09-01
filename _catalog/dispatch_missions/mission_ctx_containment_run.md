# Mission — rescue the code first, then run Williamson and Travis

## The urgent part, and it is not the run

The serving image `sha256:24e0fd9ad41d94cdc6476400902e2185d82868c04604a972872e11515ec696c1`
(job generation 8) was built from a working tree that **has never been committed to any
git object**. Verified from doc_repo:

```
$ git -C /p/tmp/hauska-factory-covers-fastpath rev-parse --abbrev-ref HEAD
feat/covers-fastpath
$ git log --oneline -1
5f9acc3   <- main's tip; the branch has ZERO commits on it
$ git diff --stat
 src/jobs/p2-juris-containment.mjs | 152 ++++--
 src/jobs/p2-juris-store.mjs       | 169 +++++---
 src/jobs/p2-juris.mjs             |  97 +++--
 test/p2-job.test.mjs              |   3 +
 test/p2-juris-persist.test.mjs    |  42 ++-
 5 files changed, 399 insertions(+), 64 deletions(-)
 ?? test/p2-juris-57p01.test.mjs           269 lines
 ?? test/p2-juris-covers-fastpath.test.mjs 226 lines
```

Roughly 894 lines carrying **three separate pieces of load-bearing production code** —
the 57P01 error listeners, the HELD replay gate, and the `ST_Covers` fast path — exist
only as dirty files in `P:/tmp`. `P:/tmp` holds seven factory clones and temp clones on
this operation have been recycled before.

**Step 1 is `git push`.** Before any run, before any PR, before anything else. Commit the
tree to `feat/covers-fastpath` and push it. That is your own branch, it needs no
authorisation, and it takes a minute.

**Commit it as three commits, not one**, because they are three changes and a commit
whose message names one of them misdescribes the other two:

1. 57P01 error listeners (already live in the image, never committed)
2. HELD replay gate (same)
3. `ST_Covers` fast path, TEMP city table, chunk manifest with `method_version`

If separating them cleanly is not possible from the current tree, **push one commit that
says so plainly in its message** rather than inventing a false split. Preserving the code
outranks a tidy history.

## Then run, on the proven digest

**Do not rebuild the image on this card.** Digest `24e0fd9…` is measured on three arms
with identical emit. A rebuild produces a new, unproven digest. The campaign runs on the
artifact that was proven, and the rebuild is a later card.

Run **Williamson 48491 first, then Travis 48453**, serialized. They share one compute on
cortex-prod and must not overlap.

**New run id for each. Do not pass `--run-id fb490620`** — its nine chunks are
`intersection-v1` and `METHOD_VERSION_MISMATCH` will correctly refuse. The restart costs
about nine minutes, which is less than the cost of building a declared-equivalence path.
That refusal is the control working; do not route around it.

Both counties are HELD, so the replay gate applies. Satisfy it properly rather than
lifting it.

## The prediction, registered before you run

The 40–79× was measured **SELECT-only**, while the baselines also wrote 8,000 rows. So
the geometry term collapsed and the **write term now dominates and is unmeasured**.

From the low-vertex counties, where geometry was already cheap: Bastrop 8 chunks in
1m58s (~15s/chunk), Caldwell 4 chunks in 1m14s (~19s/chunk). That bounds the
write-plus-overhead term.

**Predicted: Williamson 36 chunks at roughly 10–15s each, about 6–9 minutes. Travis 48
chunks, about 8–12 minutes.** Not the ~65 seconds that 1.8s × 36 implies.

**The falsifier: if per-chunk wall lands materially above ~20s, the write path is the new
bottleneck.** Stop after Williamson, report it, and do not start Travis. A run that is
merely faster than eight hours is not thereby correct.

Report per-chunk wall times, not just the total. The total hides the shape.

## Do not

- Do not run before the push. The code is one directory deletion from gone.
- Do not rebuild or redeploy the image on this card.
- Do not pass `--run-id fb490620`, and do not weaken the `method_version` refuse.
- Do not lift the HELD replay gate.
- Do not run Williamson and Travis concurrently.
- Do not start Travis if Williamson trips the ~20s falsifier.
- Do not touch any repository other than the registered Factory worktree you open.

## Close

Use the exact CP1 / CP2 / CLOSE paths named at the end of this dispatch. Declare snapshot
including image digest in the first output, and **report the pushed commit SHAs before
running anything**. State per-chunk wall times for both counties against the predicted
band, and say plainly whether the write-path falsifier fired. Report final row counts and
the in-city / unincorporated split per county. `leave_behind` named. Subagents do not
commit.
