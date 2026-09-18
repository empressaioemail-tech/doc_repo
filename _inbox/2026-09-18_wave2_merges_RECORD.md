---
id: 2026-09-18_wave2_merges_RECORD
title: Wave 2 lane PRs reviewed and merged by the integration seat, 2026-09-18 evening
date: 2026-09-18
last_updated: 2026-09-18 (23:40Z, the rest of the factory order)
status: fifteen PRs merged across two rounds (below); what remains waits on the P-300/P-338 writer half and on P-354's factory and corpus halves
kind: seat record
owner: nick
maintained_by: integration seat
programs: [OPS-24, OPS-16]
plan_rows: [P-353, P-339, P-341, P-354, P-270, P-334, P-329, P-330, P-362, P-358]
snapshot: hauska-map main b08f4b89, hauska-factory main 6f422f6c, legacy-design-tools main bb3b5d06, hauska-engine main cff8d882; doc_repo main d8c78117 plus uncommitted seat edits; read 2026-09-18 20:30Z
related:
  - _inbox/2026-09-18c_HANDOFF_integration_seat.md (the queue this works)
  - _inbox/2026-09-18_phase0_closeout_REGISTER.md
---

# Wave 2 merges, 2026-09-18 evening

Every PR below was merged by squash with `--match-head-commit` set to the head that was reviewed,
and only when its checks were green against the base it merged into. When a merge moved a repo's
main, the next PR in that repo was updated onto the new main with `gh pr update-branch` and merged
only after its checks re-ran green there. Each diff was read at source before merging; each lane's
close was read first. The closes that lived only in seat worktrees or on `origin/lane/*` branches
were copied to `_inbox` and verified identical (byte compare for worktree copies, git blob hash for
branch copies).

## Merged

| Repo | PR | Row | Reviewed head | Base at merge | Merge commit | Merged (UTC) |
|---|---|---|---|---|---|---|
| hauska-map | #423 | P-353 | `b5ae5ce2` | `163fde32` | `0ac74348` | 19:27:54 |
| hauska-map | #422 | P-339 (map half), P-341 | `372fb94f` | `0ac74348` | `d582e0b3` | 19:33:44 |
| hauska-map | #421 | P-354 (map half) | `eaaa955a` | `d582e0b3` | `b1b67641` | 19:36:49 |
| hauska-map | #424 | P-270 address half (map) | `4692dfe6` | `b1b67641` | `b08f4b89` | 19:45:04 |
| hauska-factory | #183 | P-334 | `45cb2e94` | `0f4558a4` | `5ead5564` | 19:32:04 |
| hauska-factory | #184 | P-329 | `1a66e7a1` | `5ead5564` | `dec5493e` | 19:35:40 |
| hauska-factory | #185 | P-330 | `a6776d39` | `dec5493e` | `6f422f6c` | 19:43:03 |
| legacy-design-tools | #722 | P-362 | `0116b3c6` | `25d1782f` | `85c63841` | 19:34:41 |
| legacy-design-tools | #721 | P-270 address half (LDT) | `1a8ada2f` | `85c63841` | `bb3b5d06` | 20:00:33 |
| hauska-engine | #476 | P-358 | `c08b68b4` | `c41a1482` | `cff8d882` | 19:50:19 |

#722's `Test` job was red on its first run with Postgres `53200 out of shared memory` in
`lib/cad-ingest`'s integration test, a file P-362 does not touch; the sibling PRs #720 and #721
passed `Test` on the same base. One re-run of the failed job passed, and the merge followed that.

The factory order in the handoff puts P-333 before P-334/P-329/P-330. P-333 has not closed (its
worktree holds only a CP1), and the P-334 lane measured its three file sets as disjoint from every
open factory PR, so the order was about deploys, not conflicts. The three merged first. Nothing in
the factory was deployed.

## Findings from review, none blocking, each recorded against its row

| Row | Finding |
|---|---|
| P-353 | `parcel-lookup.ts`: after the envelope ladder fails, `if (miss)` replaces the ladder's reason for EVERY class, including `no-hit`. The comment says only `coverage_check_unavailable` does. The behaviour is defensible (the situs index answered, so "no parcel in our records matches" is true); the comment is wrong. |
| P-353 | A cortex outage on `/api/pe-situs-search` now returns HTTP 200 with `coverage_check_unavailable` and a named reason instead of a 502. Anything that pages on that route's 5xx stops firing; the lane found no monitor configured. Operator decision recorded in the lane close. |
| P-339 | The new panel sentence says "the outline is drawn for reference by the drawing route" without the route's answer as an input. Measured true on 4 of 4 parcels by the lane; wrong on any parcel where the route declines. Belongs to the P-339 follow-up. |
| P-339, P-340 | NOT IMPLEMENTED by the lane: P-339's MCP half (legacy-design-tools `parcelDrawEnvelopeModel.ts` collapses modelled, declined and unreached into `null`, so the MCP draw serves `atom_path_pending` beside a ruled table) and all of P-340. The repair is designed in the lane close's `leave_behind[0]`. Needs a dispatch. |
| P-341 | `positive()` treats a 0 percent limit as not applicable, so a 0 percent watershed fact would let the looser zoning figure govern alone. Degrades to the pre-P-341 state rather than fabricating a value, but it collapses zero into absent. |
| P-354 | `todayIso()` is the UTC date. On the evening before an effective date (Texas time) a rule reads as in force about five hours early. Map and LDT both. |
| P-270 | Composer city test is a substring match (inherited): a street named after its own city ("100 AUSTIN AVE") drops the city. The baked card-model path composes a city-limits city into the line without the "city whose limits contain this parcel" label the fact-sheet path adds. |
| P-330 | The exit-code mapping is global, so a declared job that throws `COUNTY_NOT_IN_SCOPE` for some other reason late in a run would also be continued past. |
| P-358 | `resolveEtjDetermination`: a reading declared `conflicting` without a conflict body, beside a city-limits reading that is not `incorporated`, falls through to `present` and silently drops the declared conflict. `composeConflict` defaults the ETJ source to `tx_etj_boundary` when no fact is present. Both reachable only for the bare-string or bodiless cell shapes the lane asked to reconcile against P-336. |

## Still open in the queue

Updated 23:40Z: #720 merged `2e7ca7c4`; #186, #181, #182, engine #474 and #187 merged (last section).

| Repo | PR | Row | Why it waits |
|---|---|---|---|
| hauska-factory | #180 | P-336 | closed; the written order puts it after the P-300/P-338 writer half (recompiled 2026-09-18 evening) |
| hauska-factory | #179 | P-354 (factory half) | read against P-363 (merged `415d3212`) and the P-300/P-338 writer half (recompiled, not yet built) before merging |
| hauska-setback-corpus | #11 | P-354 (corpus) | publish 1.5.0 and the consumer pin bumps go together, after #179 |

## The probe patch P-270 handed back

`_inbox/2026-09-18_p270-address-half_probe.diff` (sha256 `dda93446`) did not apply as filed: it was
saved with a UTF-8 BOM and CRLF endings, and nine em dashes and ellipses in its added comment lines
had been re-encoded as `ΓÇö` and `ΓÇª`. Normalised to LF without the BOM and with the two characters
restored (only in added lines; zero in context lines), it applied strictly against the exact base
blob it names (`4b27d9bd`). `scripts/surface-probe.mjs --self-test`: 285 of 285 before, 310 of 310
after. Verified by violation: a copy with `addressCarriesLedgerLine` forced to PASS fails 14 checks
and exits 1; the copy was deleted afterwards.

## Late evening: the rest of the factory order (23:20Z to 23:35Z)

| Repo | PR | Row | Merged head | Base at merge | Merge commit | Merged (UTC) |
|---|---|---|---|---|---|---|
| hauska-factory | #186 | P-333 (threshold 0.95, operator A-226) | `11f2d601` | `6f422f6c` | `07a1215b` | 22:28:33 |
| hauska-factory | #181 | P-352 | `8d3164a6` (seat merge of main) | `07a1215b` | `94fd6d53` | 23:20:09 |
| hauska-factory | #182 | P-361 | `e8a8f461` (seat verdict line) | `94fd6d53` | `5a3877f9` | 23:28:46 |
| hauska-engine | #474 | P-328 / P-361 | `dd6ed745` (seat re-pin, then main merged) | `cff8d882` | `7c42e1c8` | 23:32:58 |
| hauska-factory | #187 | P-363 | `129a5ac6` | `5a3877f9` | `415d3212` | 23:35:29 |

**P-352 met P-333 in `src/jobs/parcel-record-fill.mjs`.** Merged main into the lane branch in a fresh
clone (`P:/tmp/factory-p352-integrate`, registered under the property seat for the commit and the
register restored byte-identically afterwards). Four hunks, all additive: `instantiateAndIngest`
takes both P-352's `geometryCountByProp` and P-333's `joinMissRestore`; the county-wide loop passes
both; the run returns both lanes' fields; the log line carries both lanes' counters. The sample-mode
calls pass no `joinMissRestore`, exactly as on main. **The merged tree then failed one P-333 test
(0 of 30 cells restored):** P-333's fake store did not answer P-352's `GEOMETRY_COUNT_SQL`, so its two
join-miss parcels read as phantoms and P-352's guard refused to instantiate them. P-352's guard is
refuse-on-neither by design (its own comment: refusing on either "would refuse every legitimate CAD
JOIN MISS"), so the fix is the fixture's: one line answering one geometry per parcel. After it: 160 of
160 on the P-333 and record-fill suites; the full suite's only failures were the walk-decline drift
test reading a stale local LDT worktree (5 of 5 against LDT main `2e7ca7c4`), and CI was green.

**P-361 met P-352 in `src/lib/destructive-write-guard.mjs`.** After main was merged into #182, two
checks went red: P-361's G4 test (every unwired destructive writer carries a "RE-READ AT 0.05"
verdict) failed on P-352's new unwired `retire-phantom-record`, and `engine-declaration-pin` refused
`FACTORY_CONTENT_NOT_PINNED` because the guard's content changed under engine #474's pin. Fixed in two
seat commits: the verdict line on P-352's entry (HOLDS: one authorized key is one key at any
threshold), factory `e8a8f461`; and #474's `PROGRAM_DECLARATION_PIN` re-pinned to that content (blob
`ad618e46`, 25,091 bytes, normalized sha256 `4b166f56`), engine `09c9600f`. Both directions shown with
each repo's own check before pushing: the old pin refuses the new content, the new pin passes, and the
engine's `--factory` re-derivation passes on every leg. The engine push went first so the factory CI's
fallback read saw it. After both merges the factory check reads the declaration from engine MAIN and
passes, and the engine check passes against factory main.

**#474 renames the override variable** to `DESTRUCTIVE_WRITE_AUTHORISATION`; the caller-declared
`share <= maxShare` rule the P-263 apply uses is unchanged, so Williamson (0.848) needs no token.

**P-363's apply inputs** (its six per-county dry runs, all MATCH the prediction: 387,231 re-stamps, 6
value changes, 24 rail cells, 0 refusals) are copied from `C:/Users/cente/_p363_scratch` to
`_inbox/2026-09-18_p363_dryrun/`. Its durable record names value changes only; the seat snapshots the
re-stamp population from the store before the apply, because a count is not a record.
