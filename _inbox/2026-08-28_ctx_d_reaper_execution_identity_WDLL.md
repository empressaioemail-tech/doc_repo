---
id: 2026-08-28_ctx_d_reaper_execution_identity_WDLL
title: WDLL — CTX card D: a run names its own Cloud Run execution at start, and the reaper matches by that name, never by start time
date: 2026-08-28
last_updated: 2026-08-28
status: approved
applies_to: hauska-factory (control/runs, control/reaper, jobs/bastrop-publish, jobs/verify-walk, jobs/f10-cad-loop, jobs/conformant, jobs/restamp-access, jobs/staging-reset)
plan_row: F-03, F-06, F-10
depends_on: OPS-19 A-020 (Central Texas first), A-022(5) (orphan rule), A-019 (job templates from the build config)
operator_go: 2026-08-28 (standing: "they are all approved"; "spawn subagents to do everything and get this through to completion")
model_law: ENFORCEMENT.md (a control whose scope is broader than its claim is a defect; state changing operations leave a record naming the items acted on), _blueprint/40_rule_register.md BP-FACTORY-01 (every run terminates once, with a record)
snapshot: hauska-factory origin/main 25d031b (cards A, B, C, timeout, LDT pin merged) · three staging publish executions started within two seconds at 09:22:59Z to 09:23:01Z (czlpc 48055, csvv8 48309, wqnzb 48209) · `termination_records` shows run 41bcc81a (the Hays staging publish, execution wqnzb) terminated `crashed` at 09:50:25Z by the reaper while its bake was still running (czlpc had finished 09:35Z, csvv8 09:43Z); when wqnzb finished at 10:12Z its own termination hit unique violation 23505 and the run row reads `failed 23505` although `publish_runs` 41bcc81a succeeded and its walk ecd466a7 passed · `src/control/reaper.mjs` matches a `started` run to an execution by job affinity and a 90 s start-time window when the run's scope carries no execution name
owner: planner-run subagent in P:/seat-worktrees/property/hauska-factory-ctx-replay on seat/property-ctx-reaper (from origin/main). The subagent produces the diff and the test output and hands back; it does not commit, push, deploy, or execute any job. The planner commits, merges, rebuilds after the running loop finishes, and reads the rows.
---

# CTX card D: the reaper matches by execution name

Date: 2026-08-28  Status: approved

The reaper's start-time fallback is a control broader than its claim: with three executions of one job starting in the same two seconds it attached a finished sibling to a running run and terminated it as `crashed` mid-bake, and the run's own close then failed on the duplicate termination. The publish itself was right; the ledger about it is wrong twice. The fix is identity, not a wider window.

## Acceptance items

1. **Every run names its execution at start.** `startRun` (or each job's call to it) records `scope.execution = process.env.CLOUD_RUN_EXECUTION` and `scope.job = process.env.CLOUD_RUN_JOB` when they are set (every Factory job runs on Cloud Run), for publish, verify-walk, staging-reset, restamp-access, the loop and its county children (the county child already carries `parentRun`; it gains its own execution name too). A run started on Cloud Run without an execution name refuses `EXECUTION_NAME_REQUIRED`; a run started outside Cloud Run (tests, a dry run on a laptop that is otherwise refused) records `execution: null` with `scope.host = "not-cloud-run"`. | check: tests per job; the fixture asserts the scope fields | grade: [ ]

2. **The reaper matches by name only.** A `started` run whose scope names an execution is reconciled against that execution and nothing else; the start-time fallback applies only to runs whose scope has no execution name AND whose `started_at` predates the deploy of this change (a constant `EXECUTION_NAME_SINCE` in the reaper, set by the planner at merge), and it is removed entirely by a follow-up test date the handback names. A run with a name whose execution cannot be found is left `started` until its age bound, then `orphaned` (A-022(5)), never attached to a sibling. Tests: three same-job runs started in one second with three executions in flight, one finishing, reconcile exactly that one; a named run whose execution is missing is not attached to a live stranger; the legacy fallback still reconciles a pre-date unnamed run. | check: tests; the three-sibling fixture fails on main before the fix | grade: [ ]

3. **A duplicate termination is a named refusal, not a 23505.** `writeTermination` refuses `ALREADY_TERMINATED` with the existing record's exit kind and recorder when a termination exists, and the job's close records that refusal on the run (`refuse_code`, `counts.terminationConflict`) instead of failing the process after a succeeded publish. The publish job's exit code follows the publish and the walk, not the termination race. | check: fixture: a pre-existing termination makes the close record the conflict and the job still exits 0 when the publish succeeded | grade: [ ]

4. **Correct the Hays row honestly.** Add a `reconcile-termination` verb to the reap job that, for a run whose termination was written by the reaper by start-time match while the run's own execution later finished with a different outcome, writes a `termination_records` amendment row (or a `run_event` `termination-corrected` if the table is one row per run) naming both records and sets `runs.status` from the run's own close evidence (`publish_runs` succeeded and walk pass for 41bcc81a). The planner executes it for 41bcc81a after the rebuild. | check: fixture; the verb refuses when there is no evidence of a different outcome | grade: [ ]

5. **Handback.** Diff summary by file, full `node --test` output, the `EXECUTION_NAME_SINCE` value to set, the exact execute command for item 4 on 41bcc81a, and `leave_behind`. No commit, push, deploy, or execution; no store write; no secret printed; doc_repo writes limited to the three checkpoint files. | check: handback | grade: [ ]

## Do not

- Commit, push, open a PR, deploy, or execute any Cloud Run job; the planner does those, and the conformant image is not rebuilt until the running loop (Travis, Williamson) has finished.
- Write to any store; tests use the fake factory.
- Print any DATABASE_URL, secret, or token.
- Widen the start-time window or add a second heuristic; identity replaces the heuristic.
