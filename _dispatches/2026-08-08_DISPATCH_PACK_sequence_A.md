---
id: 2026-08-08_DISPATCH_PACK_sequence_A
title: Dispatch pack A — fork fix, bulk-load, city boundaries (hand-carry to Cursor agents)
date: 2026-08-08
status: READY TO DISPATCH
owner: nick
related: [_decisions/2026-08-08_layer_first_statewide_fabric_sequence, _decisions/2026-08-07_envelope_saga_close_and_geometry_law, _inbox/2026-08-08_PROBE_770_refusal_join, _inbox/2026-08-08_PROBE_profile_hot_path, _inbox/2026-08-08_PROBE_from_scratch_feasibility, _inbox/2026-08-08_STATEWIDE_layer_inventory]
---

# Dispatch pack A

Three dispatches, hand-carried by the operator to Cursor-native agents. D1 and D2 are the same repo and are SERIAL (D2 depends on D1). D3 is a different repo and runs fully parallel.

Every dispatch below is copy-paste ready. Each is self-contained: an executor receiving only the block between the fences has everything it needs. Master planner re-verifies every close against live state; no lane closes on its own report.

Live state at cut time: hauska-engine `origin/main` = `e6265b1`; legacy-design-tools `origin/main` = `b9807f7e`.

---

## D1 — Close the `!dryRun` fork, then re-measure the 770

Highest leverage in the program and small. Until this lands, no dry/apply parity claim means anything.

```
You are a BUILD EXECUTOR on P:\hauska-engine. Operator-authorized 2026-08-08.

MODEL MANDATE: you are running as a Cursor-hosted model. Do not delegate to or spawn other agents; you do the work yourself. If you find yourself wanting to hand work to a sub-agent, do it inline instead.

AUTHORIZATION: you MAY write code, branch, commit, push, and open a PR. You MUST NOT merge, deploy, or run any production data-run/apply. No database writes. SELECT-only queries are permitted where the task calls for measurement.

BRANCH FROM: origin/main at e6265b1. Verify with `git rev-parse --short origin/main` before starting. Branch name: fix/dryrun-fork-parity.

STANDING DECISIONS THAT APPLY (do not violate, do not re-derive):
- THE GEOMETRY LAW (_decisions/2026-08-07_envelope_saga_close_and_geometry_law.md in the doc repo): one ring per parcel (txgio is THE truth frame; BCAD is divergence-reporting only, never a substitute); truth is the RAW ring; write-then-verify on stored bytes; the ground-truth predicate must match a naive independent measurement within 0.5 ft; INSTRUMENT INDEPENDENCE (no fix is closed by a check authored in its own lane); conformance not templates; coordinate-keyed geometry references, never indices; store-truth sizing at execution time.
- Merges gate on the CI conclusion STRING ("success"), never an exit code. You do not merge; the master planner does.
- Every apply-capable script runs dry FIRST and the dry-run must predict the apply.
- Artifacts are written UTF-8 with no BOM.
- Do NOT touch the geometry math (offset core, ground-truth predicate, ring handling). It is proven at 12/12 and is out of scope for this lane.

THE DEFECT: packages/engine-core/scripts/depth-warm-bastrop-batch.mjs line ~653 reads the stored boundary primitive ONLY when `!dryRun`:

    let boundaryEdges = null;
    if (!dryRun && storageHandle?.storage) {
      boundaryEdges = await readBoundaryEdgesForParcel(...)

That flag selects an entirely different compute path. The dry leg CANNOT emit the apply-only failure bucket `road-classification-mismatch` (472 parcels) by construction, because only the apply branch stamps `osmHighwayTag` from storage and the verify gate short-circuits when that field is absent. Counters move in BOTH directions between legs (no-road-adjacency 116 to 14; front-orientation 437 to 569), which is the signature of a DIFFERENT computation, not a degraded one.

Consequence: dry-run has never predicted apply. The primary safety gate of this entire program is structurally incapable of working.

TASK 1 - CLOSE THE FORK. Make the dry leg exercise the same code path it claims to predict. The dry leg must READ the stored boundary primitive (a read is safe on a dry run; only WRITES are forbidden). Preserve the invariant that a dry run performs no writes and no promotes. Read the surrounding code before changing it: understand why the gate was written this way, and if there is a legitimate reason the dry leg cannot read storage, say so with evidence rather than forcing the change.

TASK 2 - AUDIT FOR SIBLINGS. Grep the batch script and the warm/promote path for every other place behavior branches on `dryRun` (or a derived flag) in a way that changes COMPUTATION rather than merely suppressing a write. Report each with file:line and classify: legitimate write-suppression, or an illegitimate compute fork. Fix the illegitimate ones; report the rest.

TASK 3 - TESTS. Add a test proving the dry and apply legs produce identical compute outcomes on a fixture cohort (same verifyPass count, same failure-bucket distribution). This is the regression guard that makes the defect class unrepresentable, per Geometry Law rule 3's pattern.

TASK 4 - RE-MEASURE THE 770 (this is why the fix matters). After the fork is closed, run a dry/apply pair on the Bastrop city cohort and report whether the refusal band persists. Baseline to beat: dry verifyPass 2438, apply promoted 1668, computePassNotPersisted 770, apply-only bucket road-classification-mismatch 472.
IMPORTANT: the APPLY leg of this pair is a production data-run and you are NOT authorized to run it. Run the DRY leg only, and report whether the dry leg now emits the road-classification-mismatch bucket (it must, if the fork is truly closed). The apply half is the master planner's to schedule under the heavy-scan slot.

ALSO: the batch script's refused-parcel instrumentation is inadequate and should be fixed in this lane since you are already in the file. `sampleOutcomes` caps at 8 (line ~826) and `failureSamples` at 30 (line ~865), so a refused cohort of 770 cannot be joined at parcel level. Emit an UNCAPPED refused-parcel roster (parcel id plus named reason) to an artifact file. Additionally, the bare `catch` at line ~823 collapses EnvelopeGroundTruthPromoteDeclineError, EnvelopeWriteThenVerifyMismatchError, and unexpected throws into one `declines.other` counter: add `instanceof` discrimination so the three are counted separately.

DISCIPLINE: run the test suite BEFORE your change to establish a baseline and after; paste BOTH verbatim; never claim green without output. Typecheck must pass. Note that 2 test suites (scripts/__tests__/cert-grade-and-report.test.ts, scripts/__tests__/preflight-and-report.test.ts) and 22 typecheck errors are PRE-EXISTING on main; baseline-compare rather than chasing them. Every command must be exit-bounded: no watch modes, no dev servers, no non-exiting commands. Leave no temp files; report `git status` verbatim.

DELIVERABLE: open a PR (do not merge). Report: the PR URL, what the fork was and how you closed it, the sibling audit findings with file:line, verbatim before/after test output, whether the dry leg now emits road-classification-mismatch, and verbatim git status.
```

---

## D2 — Bulk-load acquisition out of the derivation loop

SERIAL after D1 (same files). Measured 2.32x like-for-like with the geometry unchanged.

```
You are a BUILD EXECUTOR on P:\hauska-engine. Operator-authorized 2026-08-08.

MODEL MANDATE: you are running as a Cursor-hosted model. Do not delegate to or spawn other agents; do the work yourself.

AUTHORIZATION: you MAY write code, branch, commit, push, and open a PR. You MUST NOT merge, deploy, or run any production data-run/apply. No database writes; SELECT-only is permitted.

PREREQUISITE: this lane depends on the `!dryRun` fork fix (branch fix/dryrun-fork-parity). Branch from that branch or from main after it merges - confirm with the master planner which. Do not start until the fork fix exists.

STANDING DECISIONS THAT APPLY:
- THE GEOMETRY LAW (_decisions/2026-08-07_envelope_saga_close_and_geometry_law.md): one ring per parcel (txgio truth frame, BCAD divergence-report only); raw-ring truth; write-then-verify on stored bytes; predicate must equal plain geometry within 0.5 ft; instrument independence; conformance not templates; coordinate-keyed references never indices; store-truth sizing.
- DO NOT TOUCH THE GEOMETRY MATH. The offset core, ground-truth predicate, and ring handling are proven at 12/12 and are explicitly out of scope. Your changes are to ORCHESTRATION only. Reusing the proven math unchanged is what makes the parity test meaningful.
- Merges gate on the CI conclusion STRING. You do not merge.
- Artifacts UTF-8, no BOM.

THE MEASUREMENT (already done, do not re-derive): profiling of the per-parcel loop found 8.89 percent geometry compute and 91.11 percent blocking I/O. Per-parcel serial round trips, each 80-92 ms:
- situs_address SELECT against txgio (27.84 percent of loop wall)
- assertParcelCurrencyInBcad -> fetchBcadParcelRings([id]) -> LIVE HTTP to the county ArcGIS endpoint (27.15 percent, 1.0 calls/parcel)
- the Bastrop layer-23 setback lookup, fired TWICE per qualifying parcel with IDENTICAL arguments and no cache (23.65 + 2.48 percent) - once at districtHasPerParcelSetbackRow (~line 553), again at buildBastropPerParcelSetbackDescriptor (~line 570)
- already-promoted idempotency SELECT (6.10 percent)
- geomResolver.resolve (3.88 percent)
A from-scratch bulk prototype achieved 141.98 ms/parcel with 5 DB queries and ZERO live HTTP calls in the loop, versus a 330 ms/parcel loop-only baseline: 2.32x like-for-like. Artifacts: _inbox/2026-08-08_PROBE_profile_hot_path.json and _inbox/2026-08-08_PROBE_from_scratch_feasibility.json in the doc repo.

TASK: restructure depth-warm-bastrop-batch.mjs so acquisition happens in BULK before the loop, and the loop does compute only.
1. Bulk-fetch the cohort's situs addresses in one query, not per parcel.
2. Bulk-fetch parcel currency. fetchBcadParcelRings ALREADY accepts an array and builds an IN (...) clause - it was written for batching and is being called with a single-element array N times. Keep the currency GATE (it catches superseded prop_ids, 84 on the Bastrop cohort); move it out of the per-parcel path.
3. Cache the layer-23 setback lookup so it fires once per district, not twice per parcel.
4. Bulk-fetch the idempotency check and parcel geometry.
5. The loop then computes from in-memory data with no network and no per-parcel round trips.

CRITICAL - RESTORE R30. The bulk prototype omitted relabelBoundaryEdgesFromRoadLabels (R30), which caused its only parity residuals (block13 5/7; 27 of 250 on a random sample). R30 is a PURE FUNCTION over roads already held in memory - restoring it costs zero I/O. Your implementation MUST include it.

ACCEPTANCE (non-negotiable, and you must measure it yourself):
- Byte-parity with the currently-proven pipeline on the OPERATOR TWELVE. Verbatim expected values are in the doc repo at _inbox/2026-08-08_T1_plain_geometry_twelve_saga_method.json (12/12, per-edge measuredFt, tolerance 1.6 ft, setback members 5/15/25).
- block13 7/7 (roster is the BLOCK13_ROSTER constant in cert-grade-core.ts).
- A random sample of 250+ parcels against stored envelopes.
- USE ROTATION-INVARIANT MATCHING, NOT INDEX-LOCKED COMPARISON. Edge index origin and edge count are instrument conventions on a closed ring (the R32 measurer collapses near-collinear edges; the stored primitive keeps every vertex). Index-locked scoring produced a MISLEADING 8/12 and 2/7 where the true answers are 12/12 and 5/7. This is Geometry Law rule 7 applied to comparison.
- Report the measured ms/parcel and the number of live HTTP calls inside the loop (target: zero).

DISCIPLINE: baseline the test suite before and after, paste both verbatim, never claim green without output. Typecheck must pass (22 pre-existing errors on main; baseline-compare). All commands exit-bounded. No temp files; report git status verbatim.

DELIVERABLE: open a PR (do not merge). Report the PR URL, the measured ms/parcel and speedup, live HTTP calls in loop, the three parity results with the matching method named, verbatim before/after test output, and verbatim git status.
```

---

## D3 — City and county boundary layer (parallel; different repo)

The cheapest complete-in-one-pass win. Currently absent entirely.

```
You are a BUILD EXECUTOR on P:\legacy-design-tools. Operator-authorized 2026-08-08.

MODEL MANDATE: you are running as a Cursor-hosted model. Do not delegate to or spawn other agents; do the work yourself.

AUTHORIZATION: you MAY write code, a migration FILE, branch, commit, push, and open a PR. You MUST NOT run the migration against any database, MUST NOT merge, and MUST NOT deploy. No database writes. SELECT-only queries permitted.

BRANCH FROM: origin/main at b9807f7e. Verify with `git rev-parse --short origin/main`. Branch: feat/city-county-boundary-layer.

STANDING DECISIONS THAT APPLY:
- LAYER-FIRST SEQUENCE (_decisions/2026-08-08_layer_first_statewide_fabric_sequence.md in the doc repo): statewide-uniform layers are acquired ONCE and blanket the state; per-jurisdiction rails are backfilled behind them. This layer is L1 and is the first complete-in-one-pass win.
- HONEST ABSENCE: a jurisdiction where the record genuinely does not resolve is served as an explicit absence with its basis recorded, never as a blank, a zero, or a guess.
- NO city or relationship dependencies. Public-record acquisition only.
- Merges gate on the CI conclusion STRING. You do not merge.
- Artifacts UTF-8, no BOM.

THE GAP (verified 2026-08-08): there is NO city-limits, incorporated-place, or TIGER boundary source anywhere in the codebase. The engine's own comment at packages/engine-core/src/.../cascade-unzoned-envelope-decline.ts:62 states this explicitly: "verified: no city_limits / incorporated_place / TIGER source anywhere in packages/". Consequence: in-city determination is currently INFERRED from address strings and is explicitly hedged in code as "likely, not proof." There is no way to do a real polygon join to answer whether a parcel is inside city limits.

THE SOURCE: the TxGIO City_Boundaries service, already documented in the doc repo at 90_operations/OPS-1_texas_source_registry.md. Approximately 1,225 incorporated-place polygons, zero cost, queryable REST. Also acquire county boundaries from the equivalent TxGIO layer.

MANDATORY SOURCE VERIFICATION before ingesting anything, per the four-point probe rule in OPS-1: probe the service root layer list; confirm the id field and its EXACT casing; run one polygon sample query; record the feature count and the owning organization. Then ADVERSARIALLY RE-PROBE (a second independent probe confirming the first) before treating the source as verified. Registry rows have pointed at the wrong layer index before: a Caldwell row pointed at layer 0, which was Municipal Utility Districts, while Parcels was layer 1. Verify the layer index by inspecting returned geometry, never by assuming.

TASKS:
1. Probe and verify the TxGIO City_Boundaries and county-boundary services per the rule above. Record the probe evidence.
2. Write a migration FILE creating boundary tables (city and county polygons with name, identifier, geometry, source, vintage, and citation columns). Next free migration number: check lib/db/drizzle/ - 0068 and 0069 are taken. Match the SQL and Drizzle style of migrations 0060-0069 exactly. Do NOT run it.
3. Write an ingest adapter/CLI that acquires the full statewide set in one pass. It must be idempotent and re-runnable, and must record source, vintage, and citation per row. Exit-bounded: it must terminate, and it must support a dry-run mode that reports counts without writing.
4. Wire a spatial containment helper: given a parcel geometry or point, return the containing city (or an explicit honest absence for unincorporated territory - which is the CORRECT answer for most of Texas by area, not a failure).
5. Tests: adapter parsing against a recorded fixture, the containment helper on known in-city and known unincorporated cases, and idempotency of a re-run.

KNOWN REPO HAZARDS: a new DB table breaks a hardcoded expected-table list at lib/db/src/__tests__/integration/schema.integration.test.ts (refresh it alphabetically, with a comment explaining the sort position) and requires the schema fixture template to match. Run `tsc -b lib/db` first. The api-server test suite is NOT fully green locally (no reachable DATABASE_URL); baseline-compare against main rather than chasing pre-existing failures. New tables may also need adding to TRUNCATE_TABLES in the test setup for isolation.

DISCIPLINE: baseline the test suite before and after, paste both verbatim, never claim green without output. Typecheck must pass. All commands exit-bounded. No temp files; report git status verbatim.

DELIVERABLE: open a PR (do not merge). Report the PR URL, the four-point probe evidence plus the adversarial re-probe, the migration filename, the verified feature counts for cities and counties, verbatim before/after test output, and verbatim git status.
```

---

## Master planner verification owed at each close

D1: independently confirm the dry leg now emits `road-classification-mismatch`; audit the sibling-fork findings against source; schedule the apply half under the heavy-scan slot.
D2: re-measure the operator twelve myself with the naive instrument (rotation-invariant), not the lane's own numbers. Instrument independence.
D3: re-probe the TxGIO service independently; confirm the feature count against the live endpoint; confirm honest absence renders for unincorporated territory rather than an empty result.

## Not in this pack (next pack)

Parallelism design and the heavy-scan slot replacement (disjoint key ranges, one writer per range, a queryable lock). `rail_state_history` and the run-state/slot registry ride with it. Then L2, the 235-county acquisition. Holes and corpus work slot in as capacity allows.
