---
id: 2026-08-28_ctx_a_replay_reaper_dispositions_WDLL
title: WDLL — CTX card A: F-19 replay determinism, reaper reconciliation of orphaned runs, register dispositions for the Central Texas slice
date: 2026-08-28
last_updated: 2026-08-28
status: approved
applies_to: hauska-factory (stages/resolve, stages/replay, jobs/conformant, jobs/reap, ledgers/f10-defect-register, jobs/f10-cad-loop)
plan_row: F-10, F-19, F-03
depends_on: OPS-19 A-020 (Central Texas first), A-021 (standing production word), A-019 (job templates from the build config)
operator_go: 2026-08-28 ("they are all approved"; "spawn subagents to do everything and get this through to completion")
model_law: _blueprint/10_model.md (V1 minted ids, V9 repoint before retire), _blueprint/20_pipeline.md (L3 stages A-E), _blueprint/40_rule_register.md (BP-WRITE-01, BP-VERIFY-01), 19_the_instrument_contract.md
snapshot: hauska-factory origin/main a70139a · factory-conformant gen 18 and factory-f10-cad-loop gen 8 on image 3e1bbea0 · CP2 loop 7eb4d0fd (execution factory-f10-cad-loop-scllr) closed 06:31Z with 7 idempotent, 1 situs-sentinel skip, 2 executed (48055 run 1956886d, 48085 run 75ada535), both terminated success and both TX-REPLAY-NOT-IDENTICAL · three runs stuck at started: 309a07ab (48029 child of loop ff092eb7, 05:51Z), 1bd6316f (publish staging:48021, 08-27 20:13Z), c536c8c6 (control probe, 08-27 22:42Z)
owner: planner-run subagent in P:/seat-worktrees/property/hauska-factory-ctx-replay on seat/property-ctx-replay (from origin/main a70139a). The subagent produces the diff and the test output and hands back; it does not commit, push, deploy, or execute any job. The planner commits, merges, builds, and executes.
---

# CTX card A: replay determinism, reaper reconciliation, register dispositions

Date: 2026-08-28  Status: approved

Three code defects stand between the Central Texas six and a clean new-shape write, and every one of them is in `hauska-factory`. This card fixes them in one worktree with one writer. It runs no job and touches no store; the planner executes after merge.

## What the evidence says

**Replay is non-identical by construction, not by chance.** In `src/jobs/conformant.mjs`, `pipelineFromRows` stages `rs.aliases`, the resolve store's whole cumulative alias list, on every chunk. The store is hydrated from the `aliases` table before pass one and shared across chunks, so chunk N stages every alias hydrated from earlier runs plus every alias emitted by chunks 1 to N. That is why 48055 staged 783,710 atoms for 73,371 landing rows and 48085 staged 2,174,668 for 387,334, and why the Factory `aliases` table holds 247,397 rows for Bastrop's 77,799 parcels. Pass two (`replayCountyCadChunks`) hydrates again, now from a table that already holds pass one's aliases at this run's `knowledgeAt`, so `resolveCandidate`'s `already` check (nodeId, validFrom, knowledgeAt all equal) suppresses the alias for every candidate; pass two's chunk one therefore carries the whole county's aliases from hydration where pass one's chunk one carried only its own. The 48085 diff is exactly that: key `48085:1832707`, an `identity.alias` present on the second side only. The 48055 diff is a `cad-parcel-roll` key whose `atomId` and `atomDid` differ while `nodeId` and the claim hash agree; that one is not yet explained by the alias mechanism and item 1 must find it rather than assume it.

**The reaper cannot see three kinds of orphan.** Run 309a07ab is a `f10-county` child whose `scope` carries `parentRun` and no `execution`, so the execution-to-run mapping in `reap.mjs` never reaches it; it has sat at `started` since 05:51Z and the loop's idempotency guard reads it as `in-flight`, which is why Bexar was skipped as in-flight in the CP2 loop although 2nd9z wrote it clean. Publish run 1bd6316f and control run c536c8c6 are the same shape from other verbs. A run row at `started` with nothing running is a ledger lie of the class A-020 lists as not deferred.

**Three register classes sit on the Central Texas slice and all three block the write outright.** `TX-TRAVIS-JOIN` (48453, disposition `lane`), `TX-HAYS-LANDUSE` (48209, `quarantine`), `TX-SITUS-SENTINELS` (48021 and 48209, `quarantine`). The Travis join is a fabric defect (TxGIO geometry to CAD prop_id), the Hays hold is the landuse fact writer, the situs class is punctuation-only situs strings; none of them is a defect in the CAD roll write, and the bake already refuses a punctuation-only situs at serve (Bastrop's staging publish wrote 61,695 of 77,799 with the rest refused honestly). A-020 rules that these are dispositioned as fix or as an accepted degraded state the manifest shows.

## Acceptance items

1. **Replay identical across passes, by construction.** Stage per chunk only the aliases this chunk's candidates produced (the delta, not the store), and make the alias a candidate emits independent of what an earlier pass persisted: resolution returns the alias for every candidate; the staged alias set for a chunk is that chunk's candidates' aliases; deduplication happens at persist (the alias table's conflict target), never at emission. Find the cause of the 48055 `atomId`-only divergence with a failing test before fixing it; do not assume it is the alias mechanism. Tests: (a) a two-pass fixture where pass two hydrates from pass one's persisted aliases and the chunk fingerprint roll is identical; (b) the same fixture with a deliberately non-deterministic mint fails; (c) staged atoms per chunk equal candidates times the per-candidate atom count, no cumulative growth. | check: tests pass, the negative fixture fails, `node --test` output pasted | grade: [ ]

2. **Reaper reconciles every orphan.** `reap.mjs` reconciles every `runs.status = 'started'` row, not only rows whose scope names an execution: a row older than its `max_duration_s` (default 3600 where absent) with no live execution terminates as `orphaned` with a `termination_records` row; a child run whose `parentRun` is terminated terminates with it; publish and control runs are covered. Test: insert a fake started run older than an hour with no execution, run reap, it is terminated with a record; a run younger than its max duration is left alone. The three live orphans are reconciled by the first scheduled reap after the planner deploys; name them in the handback so the planner reads the rows. | check: test output; the reap job's log line names what it reconciled | grade: [ ]

3. **Register dispositions for the Central Texas slice.** Add a disposition value `execute-degraded` to `f10-defect-register.mjs` and honour it in `f10-cad-loop.mjs`: the county executes, the F-10 county row and the manifest cell carry the class id under a `degraded` field, and the manifest verdict reader shows the class. Set `TX-TRAVIS-JOIN`, `TX-HAYS-LANDUSE`, and `TX-SITUS-SENTINELS` to `execute-degraded` for the Central Texas counties only (48453, 48209, 48021); every other county keeps its current disposition. Test: a work list containing a Central Texas county under each class executes and its cell carries the class; a non-Central-Texas county under the same class still skips. | check: tests; the register diff shows exactly three classes changed and scoped | grade: [ ]

4. **Nothing else.** No writer changes beyond item 1, no loop concurrency, no F-09, no console. If item 1's investigation finds a second non-determinism outside the alias path, fix it under item 1 with its own failing test and name it in the handback. | check: diff pathspec | grade: [ ]

5. **Handback.** Final message to the planner: the diff summary by file, the full `node --test` output, the three fixtures named, the cause of the 48055 divergence stated with a second mechanism that would produce the same diff and why it was rejected, and `leave_behind`. No commit, no push, no deploy, no job execution, no write to doc_repo. | check: handback | grade: [ ]

## Do not

- Commit, push, open a PR, deploy, or execute any Cloud Run job or scheduler; the planner does those.
- Write to any store, staging included; tests use fixtures or an in-process fake.
- Print any DATABASE_URL, secret, or token.
- Change job templates by hand; `cloudbuild.conformant.yaml` is the only place a job's command, args, or resources live (A-019).
- Widen a check to admit the failing case. If replay cannot be made identical for a reason you can name, say so in the handback with the evidence.
