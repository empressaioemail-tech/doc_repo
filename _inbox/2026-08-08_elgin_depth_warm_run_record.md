---
id: 2026-08-08_elgin_depth_warm_run_record
title: Elgin depth-warm run record — store-truth sizing, dispatch false-premise, residual evidence
date: 2026-08-08
status: in-progress (executor run record)
owner: nick
related: [90_runbooks/factory_onboarding_runbook, 90_operations/onboarding_defect_class_backlog]
---

# Elgin depth-warm run record (2026-08-08)

Engine SHA pinned: `4c43a78201b6a60a4265fb544ef87490db1faaa7` (origin/main), clean worktree at `P:/tmp/elgin-run`.

## STORE-TRUTH ROSTER (Geometry Law rule 8)

Queried immediately before the dry run, not taken from a prior artifact.

| Measure | Count |
|---|---|
| txgio rows in Elgin bbox (incl. tile dupes) | 6,565 |
| distinct prop_id in Elgin bbox | 5,940 |
| script's own `cityParcelUniverse` | 5,447 |
| **districted zoning-facts in bbox = the warm roster** | **3,746** |
| 48021 districted zoning-fact denominator (county) | 9,560 |
| 48021 txgio rows / distinct feature_index | 74,729 / 63,357 |
| 48021 active road-node atoms | 19,907 |

The dispatch's "~1,977 parcels" is **not** the cohort. The nearest real number is 1,967 — the count of Elgin `setback-rule` atoms whose `sourceAdapter` is `descriptor-fixture` (the other 1,779 are `cortex-tier1-snapshot-breadth-bake`, summing to 3,746). The dispatch figure was a partial subset, and store truth supersedes it.

## PRIOR STATE — Elgin is already warmed

| Measure | Count |
|---|---|
| Elgin envelopes WITHOUT `warmVerifyDecline` (promoted) | 3,745 |
| Elgin envelopes WITH `warmVerifyDecline` | 2,195 |
| — of which `unzoned-no-district-basis` | 2,194 |
| — of which `superseded-prop-id` | 1 |

3,745 of the 3,746 roster parcels already carry promoted envelopes. This run is a **re-warm** under `--force-overwrite`, not a first acquisition.

Elgin zoning-fact districts: R-1 1,198 / R-3 1,131 / R-2 976 / C-3 157 / C-2 139 / I 74 / R-4 41 / C-1 29 / SF-1 1.

## BLOCK13 PRE-GATE AND POST-GATE

Pre: `7/7`, `blockPass: true`, `certRestore: "7/7 — CERT-RESTORE ELIGIBLE"`. Artifact: `_inbox/2026-08-08_elgin_block13_pre.json`.

Post: `7/7`, `certRestore: "7/7 — CERT-RESTORE ELIGIBLE"`. Artifact: `_inbox/2026-08-08_elgin_block13_post.json`. Unchanged from pre, as expected — no writes occurred between the two runs.

## PLAIN-GEOMETRY SWEEP (independent instrument, Geometry Law rule 5)

`12/12` pass, 0 fail, at the pinned SHA.

Scope caveat: `plain-geometry-twelve-sweep.mjs` reads its roster from a hardcoded path, `P:/doc_repo/_inbox/2026-08-06_T1_operator_twelve_prop_ids.txt` (the **Bastrop** operator twelve), and hardcodes its import root to `P:/hauska-engine/packages/engine-core`. It is a Bastrop regression instrument. It does **not** measure Elgin geometry, and no Elgin equivalent exists.

## PARCEL-NODE WRITER — DRY RUN (predicts apply)

County-scoped (`--county=48021`); the CLI has no city flag, so it covers all of Bastrop county, not Elgin alone.

```
rowsRead            74,729
distinctFeatures    63,357   seamFactor 1.1795
wouldWriteTotal     62,394
  wouldWriteResolved  61,843
  wouldWriteAbsent       551  (geometry-incomplete 413, parcel-key-unresolved 138, no-parcel-geometry 0)
multiFeatureAccounts   680
foldedExtraFeatures    963
atomsBuilt          62,394   errors 0   wallMs 39,019
vintage: stratmap25-landparcels_48021_bastrop_202503
```

Reconciliation, every term named: 63,357 distinct features − 963 folded extra features = 62,394 planned atoms = 61,843 resolved + 551 absent. No residual term absorbs a difference.

Existing 48021 `parcel-node` atoms before the run: **0**.

## RESIDUAL 1 — orientation tokens: STILL PRESENT

`STREET_SUFFIX_TOKENS` in `packages/engine-core/src/depth-warm/edgeLabeling.ts` normalizes suffixes (ST/DR/RD/AVE/…). It contains **no** route-prefix handling: grep for `SH`, `FM`, `STATE HIGHWAY`, `FARM-TO-MARKET` in that file returns nothing.

Live evidence — 254 Elgin situs rows carry route-prefix tokens; 160 are in the city bbox and 105 are in the districted warm roster. Verbatim dry-run failure on `48021:10839`:

```
facesAnswer: situs "FM 1100 & HWY 95 " != road "Loesch Drive"
  (normalized keys FM 1100 HWY 95 vs LOESCH)
```

The Avenue/AVE half of the residual IS fixed (AVE, AVENUE, AV are all in the suffix set). The SH/FM/Farm-to-Market half is **not**.

## RESIDUAL 2 — rear emit: STILL PRESENT, and worse than "0 vs 10"

Elgin setback table (`packages/adapters/src/local/setbacks/elgin-development-code.json`) carries real rear values: rear=10 for districts 0,1,2,4,6; rear=0 for 3,5,7.

The store shows the emit gap plainly: across the entire Elgin cohort there are only **57** `property-boundary-edge` atoms, against 3,745 promoted envelopes. County-wide, 3,732 parcels of 48021 carry edge atoms. No `boundary-edge` entity type exists (the type is `property-boundary-edge`); a role tally over Elgin returns empty.

Elgin atom inventory: buildable-envelope 5,940 / zoning-fact 5,940 / setback-rule 3,746 / property-boundary-edge 57.

## DRY-RUN COUNTERS — 200-parcel calibration leg

Full-cohort leg was still running at the time of writing; this 200-parcel leg establishes the counter set and timing.

```
processed 200   verifyPass 118   verifyFail 63   promoted 0 (dry)   honestDeclines 0
declines: no-road-adjacency 6, no-setback-row 9, other 4,
          no-geometry 0, invalid-parcel-ring 0, no-roads-available 0,
          already-promoted 0, no-boundary-primitive 0
failureBuckets: faces-answer 33, r32-per-edge-inset 19, front-orientation 9,
                no-setback-row 9, no-road-adjacency 6, null-inset 2, other 4
roadsLoaded 13,987   cityParcelUniverse 5,447
cost: wallMsTotal 92,706   msPerParcel 441   flaggedOverCostGate false
```

Note 118 + 63 = 181, not 200; the 19-parcel gap is the early-decline path (6 no-road-adjacency + 9 no-setback-row + 4 other), which increments `declines` and `processed` but never reaches the verify counters.

## TIMING vs BASELINE

441 ms/parcel on this leg, against the dispatch's pre-bulk baseline of 522 ms/parcel whole-script / 330 ms loop-only. This is **not** a measurement of the bulk path — see the blocker below; the Elgin script has no bulk acquisition. The modest gain over 522 is ordinary run-to-run variance, not the claimed 2.12x.

## DISPATCH FALSE PREMISE — the two pipelines are different programs

The dispatch describes fixes to `depth-warm-bastrop-batch.mjs:653` and treats Elgin as "the first real test of the fixed pipeline." Elgin runs a **different script**, `depth-warm-elgin-batch.mjs`. Verified against the pinned SHA:

| Claimed fix | Reached Elgin? | Evidence |
|---|---|---|
| `!dryRun` compute fork closed (#279) | **YES** | `git show 4bfff71 -- …elgin-batch.mjs` — 10-line sibling fix; dry now opens read-only storage and reads the boundary primitive. Pinned by a source-level test, `depth-warm-bastrop-dryrun-fork-parity.test.ts:204` ("elgin and caldwell sibling batches also read boundary primitive on dry-run"). |
| Bulk acquisition, 2.12x (#281) | **NO** | `git show --stat 8a47f6d` touches only `depth-warm-bastrop-batch.mjs` + `bastrop-batch-bulk-prefetch.mjs`. Elgin imports no bulk prefetch (grep count 0) and still calls `fetchBcadParcelRings([propId])` **inside** the per-parcel loop at lines 405 and 418 — live HTTP per parcel, the exact thing #281 hoisted out. |
| Uncapped refused-parcel roster | **NO** | `--refused-roster-out` exists only in the Bastrop script (lines 187/225–229/984–1000). Elgin has no roster flag and caps its samples at 8 (`sampleOutcomes.length < 8`). |
| Three promote error types counted separately | **NO** | Elgin still has a single bare `stats.declines.other++` at line 509. |
| `computePassNotPersisted` / `writeThenVerifyRefused` / `promoteGateRefused` / `skippedIdempotent` | **NO** | None of these identifiers exist in the Elgin script. Its emitted counter set is `promoted`, `verifyPass`, `verifyFail`, `honestDeclines`, and the eight named `declines` buckets — exactly the pre-amendment set the runbook flags as insufficient.

**Consequence for the gate.** The dispatch's step 4 requires naming every term of the dry-vs-apply reconciliation and forbids leaning on a residual that reconciles by construction. The Elgin script **cannot emit the terms that gate requires**. `computePassNotPersisted` is not merely unpopulated — it is absent, so a dry-vs-apply divergence could not be attributed to read-back refusal, pre-write ground-truth refusal, or a changed compute outcome. Any parity claim would be the retracted framing wearing different clothes.

The uncapped refused roster the dispatch asks me to report is likewise unavailable: the Elgin script caps at 8 samples (`sampleOutcomes.length < 8` at lines 512 and 554; `failureSamples.length < 30` under `--diagnose-failures` at lines 304 and 551). Never uncapped.

## VERDICT — APPLY NOT RUN (STOP, per dispatch step 5 and STOP-on-false-premise)

The dry leg ran. The apply did **not**, and should not until the Elgin script reaches parity with the Bastrop one. Reasons, in order of severity:

1. **The gate the dispatch defines is unrunnable on this script.** Step 4 demands every reconciliation term be named and explicitly forbids a residual that reconciles by construction. `computePassNotPersisted` and its siblings do not exist in `depth-warm-elgin-batch.mjs`. A dry-vs-apply divergence could not be attributed to a cause; I would be asserting parity I cannot measure — the retracted framing again.
2. **Elgin is already 3,745/3,746 promoted.** This is a re-warm of an already-warm cohort, not the queued first acquisition the dispatch describes. The write is not urgent and carries live regression risk against a certified cohort.
3. **The two named residuals are both still present** (evidence above). A re-warm now re-persists envelopes still carrying the orientation-token defect on 105 roster parcels and the edge-emit gap. Warming on top of known-defective inputs bakes the defect into stored bytes.
4. **The claimed 2.12x bulk path is not in this script.** Any timing recorded here would misrepresent the bulk path's cohort-scale behavior — it still issues live per-parcel HTTP inside the loop.

Recommended sequence before an Elgin apply: port #281's bulk acquisition and #279's full counter/roster instrumentation to the Elgin script (or land the OPS-9 S4 registry-parameterized single warm runner and retire the per-city scripts, per operate-not-rebuild), then re-run dry, then apply.

## WHAT WAS AND WAS NOT WRITTEN

No writes of any kind were made. Every leg run was dry or read-only:

- block13 pre-gate — read-only cert grade, 7/7.
- plain-geometry twelve sweep — read-only, 12/12.
- parcel-node writer — dry run only; `--apply` never passed. 48021 `parcel-node` atoms remain 0.
- depth-warm Elgin — `--dry-run` on all legs (25, 200, 4 single parcels, full cohort). `--promote` never passed.
- Store queries — all `SELECT`.

One orphaned dry-run process (PID 125348) from a shell that hit its timeout was killed; it was a `--dry-run` invocation with no write path.

No merge, no deploy, no cohort touched other than Elgin, no bulk cross-county operation. Engine SHA `4c43a78` for every leg; worktree `P:/tmp/elgin-run` clean (`nothing to commit, working tree clean`, detached HEAD at the pinned SHA).

