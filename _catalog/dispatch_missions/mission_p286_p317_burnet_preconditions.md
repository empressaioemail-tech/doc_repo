## Mission — P-286 and P-317: Burnet's first publish can actually run

You launch no sub-agents (FAN-DEPTH 0). You build in `hauska-factory` and open ONE PR. You do not
merge, deploy, or run any job against the production store, and you write to no store. The
integration seat merges, deploys and runs.

### Why these two together

Both are Burnet preconditions and both are blockers on the same event: **the first production
publish of a county that has never been published.** Neither is started.

**P-317 — a county's first-ever publish refuses `COVERAGE_UNMEASURED`.**
`src/lib/publish-coverage-floor.mjs`. P-306 (merged, factory `05e5de7b`) made `SERVED_ZONED_SQL` a
`GROUP BY` keyspace query so the floor compares one id keyspace with one id keyspace. A county with
no served tier-1 rows now returns ZERO ROWS, and `requireCountyCoverageFloor` reads zero rows as an
instrument that answered nothing and refuses `COVERAGE_UNMEASURED` — pinned by the test "an
instrument that answers with no row at all is UNMEASURED, not a first bake". But **the query ran and
found no rows, which is a measured zero.** Before P-306 the ungrouped aggregate returned one row
with `rows = 0` and the floor promoted it as `no-prior`. The pure-evaluator tests for `no-prior`
never exercise the store path, so nothing caught the regression. It fails closed and cannot fire for
the six counties (all have served rows, staging included), and it blocks Burnet and every new county.

Done: a SUCCESSFUL served query returning no rows is a measured zero (`no-prior`); a FAILED or
malformed query is still `COVERAGE_UNMEASURED`. The distinction is whether the instrument ran, not
whether it found anything. Correct the store-path test in both directions, and keep the existing
pin's intent — an instrument that could not answer must still be UNMEASURED.

**P-286 — the blocker list is the pre-bake checklist.** The Burnet lane shipped P-287's reconcile
(factory #171, merged: `scripts/parcel-source-reconcile.mjs` plus
`src/lib/parcel-source-reconciliation.mjs`, verdicts `PARCEL_ROWS_RECONCILED`,
`PARCEL_ROW_COUNT_UNEXPLAINED`, `PARCEL_FEATURE_COUNT_UNEXPLAINED`, `PARCEL_BBOX_UNMEASURED`,
`PARCEL_SOURCE_MISSING`, `PARCEL_MEASUREMENT_UNMEASURED`) and **did not build P-286.** That
instrument is a hand-run script today: nothing makes a bake consult it.

Done: the known blockers are a checklist a publish RUNS, not a document someone remembers. It has a
declared trigger, it refuses the publish when a blocker is unresolved, and an unresolved entry can
never read as a pass. Start from what is already measured for Burnet 48053:

- parcels: reconciled, `PARCEL_ROWS_RECONCILED` / `GRID_CELL_BUCKETING` — 59,785 store rows =
  59,785 predicted cells over 50,138 distinct features, which equals the declared source read
  exactly, 0 null-bbox features, insertsPerFeature 1.1924.
- **address points: `txgio_address` holds 0 rows for 48053.** 35,857 points exist in the StratMap
  service and a bounded dry sample read 500 and parsed 500. No Find-box lookup can pass in this
  county until they are loaded, and that load is a production write the integration seat owns. Your
  job is that the checklist KNOWS this and refuses, not that you load it.
- P-278's production credential rotation is owed and is an operator item. The checklist must be able
  to express "owed by a human" as a blocker that refuses, without becoming a control whose answer is
  that a human remembers.

### The three-question gate, answered in the PR

For the checklist: what executes it, what triggers it, what fails when a blocker is unresolved, and
what bypasses it. If the honest answer to "what executes this" is a person, say so and do not ship
it as a control — that is the defect class this operation actually suffers from. A checklist that
exists, is correct, and does nothing is worse than none, because it answers "do we have this"
affirmatively.

### Verify by violation

- P-317: a fixture county with a successful served query and zero rows must pass as `no-prior` under
  the fix and must refuse `COVERAGE_UNMEASURED` before it. A fixture whose query FAILS must refuse
  in both. Show all four cells of that table.
- P-286: a fixture with an unresolved blocker must refuse the publish and leave the store unchanged
  (prove unchanged, do not assert it). A fixture with every blocker resolved must proceed — a
  checklist that always refuses is not a checklist.
- Note that your own verification runs produce records indistinguishable from real ones, and say how
  you excluded them.

### Constraints

- No store writes, no job runs against production, no deploys, no merges. Fixtures only.
- Do not take, renew or release a live lease belonging to anyone else.
- **Do not touch county 48491 in any store.** It was restored from a point-in-time branch on
  2026-09-17 after a publish retired the whole county.
- A separate lane holds P-319, P-320 and P-321 in this same repo (keyspace-aware retirement, a
  blast-radius refusal, and a retired-share watch). If your checklist wants a blast-radius threshold,
  READ what that lane built rather than building a second one, and say which you found. Two
  thresholds in one repo is the defect.
- Branch from current `origin/main` (it now carries #171) and declare the SHA you got.

### Close

Declare: the start commit, the PR number, the four-cell P-317 verification, the P-286 refusal proof
in both directions, the three-question gate answers, what you found of the P-319/P-320 lane's work,
and `leave_behind`.
