---
id: 2026-09-17_HANDOFF_integration_seat
title: Handoff to a fresh integration-seat planner, 2026-09-17 early morning
date: 2026-09-17
last_updated: 2026-09-17
status: active handoff
kind: handoff
owner: nick
from: integration seat, session 9d27b9bd (closed at context limit, 2026-09-17 about 00:45Z)
programs: [OPS-24, OPS-16]
related:
  - _inbox/2026-09-16_texas_scaleup_ROADMAP.md (the live state and the queue; read it second)
  - _sessions/2026-09-16h_gate_rollout_and_serving_ruling_claude_code.md
  - 90_operations/OPS-16_texas_market_plan_of_record.md (A-191 to A-200)
  - _decisions/2026-09-16_county_verdict_is_not_the_serve_switch.md
  - _decisions/2026-09-17_setback_corpus_flag_state_and_default_line_rulings.md
  - _decisions/2026-09-17_ledger_serving_transition_and_retirement_order.md
  - _catalog/program_preambles/OPS-24.md (now seven laws)
snapshot: doc_repo main at the session-close commit; engine b8ae82f (retrieval-api 00096-div), factory 47c7dfc (jobs) and 35007fb (gate scheduler), LDT 44029db on main with cortex-api still serving 9ce30b8 (00815-fiw), corpus 1.3.0 published
---

# Handoff: the integration seat, 2026-09-17

You are the integration seat in `P:/doc_repo` on `main`: you plan, verify, merge and deploy; lanes
build; the operator (Nick) hand-carries the dispatches you compile. You are the only planning
session. Work in active program management mode: drive, decide, report.

**Your posture at start:** six lanes are running. **Wait for the operator to report their
closes**, and handle each as it arrives (section 3). Before that, do the three time-sensitive
checks in section 1, which do not wait for anyone.

## Read first

1. `CLAUDE.md`, `ENFORCEMENT.md` (auto-loaded) and your memory index.
2. `_inbox/2026-09-16_texas_scaleup_ROADMAP.md`: the live state, the serving revisions, the
   ordered queue ("Owed by the integration seat") and what the operator still owes. **Update it
   every time a row changes state, with a change-log line, and take every timestamp from
   `date -u`.**
3. OPS-16 amendments **A-191 to A-200** and rows **P-297 to P-300**.
4. `_catalog/program_preambles/OPS-24.md`, especially **law 7** (the county verdict is a grade,
   not the serve switch; until P-297 ships, one unaccounted cell on a slated rail sends the whole
   county back to the bake).
5. The previous handoff's working rules still apply
   (`_inbox/2026-09-16_HANDOFF_integration_seat.md`, "Working rules").

## 1. Do these first (time-sensitive, nobody else will)

> **Update 2026-09-17 06:56Z (after close):** the apply `8x4jk` **completed successfully at 06:54:32Z** (`succeededCount 1`, read by field; a positional read first showed it as failed, which was the formatter trap) and **grades PASS** (`_inbox/2026-09-17_p252_apply_grade.json`: all 390 pairs rewritten, the 25 predicted flips with their counts, no `pass` or `refuse` change, no bare `excluded`). The lease expired at 02:40Z unrenewed; confirm with `scripts/heavy-scan-lease.mjs list` that nothing is live, and release it with the stored handle if it still is. **Item 1 is done; item 2 is a check; start at item 3** (resume the trigger, watch the first hourly run, which may run long on a cold cache and could overlap the next hour until P-298 lands; then the completeness check and the republish).

> **CONSUMED 2026-09-17 06:57Z by the fresh integration session (06a91261), which now holds the seat. The closed session (9d27b9bd) must take no further action.** State as of 06:57Z: the lease was retaken at 04:53Z as `cdcf84fd` (live until 08:53:17Z, handle in the stored file; **do not release it**; the fresh session releases it after grading the first hourly run). The trigger was **resumed at 06:56:34Z** after the fresh session's own PASS grade, whose self-test passed 8 of 8; the first run fires at 07:00Z and is being watched. If it is still running at 07:55Z, the trigger will be paused again before the 08:00Z fire.

1. **The gate apply** (`factory-publish-gate-sched-8x4jk`, project `hauska-prod-497015`, region
   `us-east4`, started 22:40:32Z with a 12-hour timeout). At 00:42Z Bastrop, Caldwell, Hays and
   McLennan graded clean; Travis was 55 of 65; Williamson not started; 75 pairs left. Grade it:
   ```
   FACTORY_DATABASE_URL_RO=<from Secret Manager> node scripts/p252-apply-compare.mjs \
     --before _inbox/2026-09-16_p252_apply_verdicts_before.csv \
     --prediction _inbox/2026-09-16_p252_rollout_dry_run_prescheduler.json \
     --since 2026-09-16T22:40:00Z --json _inbox/2026-09-17_p252_apply_grade.json
   ```
   It reports UNMEASURED until every pair is rewritten; PASS requires the 25 predicted flips with
   their counts, no `pass` or `refuse` change, and no bare `excluded` left. If it FAILS, stop and
   report to the operator; do not resume the trigger.
2. **The factory-store lease** (`integration-p252-apply`, id `c52a88cf`, expires
   **2026-09-17T02:40:09Z**). Its handle is in `P:/tmp/integration-handoff/p252-apply-lease.json`
   (the holder token; never print it). If the apply is still running near 02:40Z, renew it; when
   the apply ends, release it. Commands are in that file; the P-298 lane is told not to scan the
   factory store while it is live.
3. **The hourly trigger** `factory-publish-gate-sched-hourly` is **PAUSED** (since 21:37Z). After a
   PASS: resume it (`gcloud scheduler jobs resume factory-publish-gate-sched-hourly
   --project=hauska-prod-497015 --location=us-east4`), confirm the next hourly run succeeds, then
   rerun `scripts/six-county-completeness.mjs` and file the result. Then the **six-county
   republish** (operator go, A-190): one county at a time, staging first
   (`gcloud run jobs execute factory-bastrop-publish ... --args=bastrop-publish,--target=staging,--county=<fips>`),
   then production with `OPERATOR_PUBLISH_GO=1`, checking served `bakedAt` moves on a probe parcel.
   Last production publishes: Hays 2026-09-14, the other five 2026-09-10.

## 2. The six lanes in flight (the operator reports their closes)

| Lane | Dispatch | Repo | What to do when it lands |
|---|---|---|---|
| P-297 LDT half (with P-269) | `_dispatches/2026-09-16_p297-cell-serve-ldt_dispatch.md` | LDT (PR #710 open, BEHIND at close) | Review against the ruling; CI green on the current base; merge. Then tell the operator to fire `_dispatches/2026-09-16_p297-cell-serve-engine_dispatch.md` (it copies this lane's shared fixture) |
| P-299 | `_dispatches/2026-09-17_p299-height-flag-and-state_dispatch.md` | corpus + LDT | Review the reconciliation table; merge the corpus PR, bump and publish the minor version (tag `v1.x.0` runs `publish.yml`); merge the LDT PR. This unblocks the LDT deploy |
| P-298 | `_dispatches/2026-09-17_p298-scheduler-read-shape_dispatch.md` | factory | Review; build the index on the factory store yourself under a lease (it is a DDL on production data; the lane only writes the command); rebuild the scheduler image (`cloudbuild.parcel-record-fill.yaml`, which also moves three other jobs); time a cold run |
| P-294 | `_dispatches/2026-09-17_p294-republish-on-change_dispatch.md` | factory | Review; deploy dry-run; a staging cycle graded by served `bakedAt`; the first automated production run needs the operator's go |
| P-285 | `_dispatches/2026-09-17_p285-county-runner_dispatch.md` | factory | Review; merge; a dry run for 48053 (Burnet) |
| P-259 | `_dispatches/2026-09-17_p259-austin-zoning-source_dispatch.md` | LDT | Review; apply the Austin stamp after its dry run; rerun the P-255 census |

**Lane closes land in whatever doc_repo checkout the lane is rooted in:** its own seat worktree
(`P:/seat-worktrees/<lane>/doc_repo`), the dispatch-planner worktree, `P:/doc_repo`, or the second
clone `C:/Users/cente/doc_repo`. Search all of them and copy into `P:/doc_repo/_inbox`.

## 3. The queue after the time-sensitive items (from the roadmap)

1. P-297 merged; then its engine half; then **one `cortex-api` deploy** carrying P-258's tables,
   P-299's height guard, P-297 and (if its proof passes) P-249, plus the hauska-map deploy for
   P-249. **Do not deploy P-258's tables before P-299's guard**: LDT's envelope code
   (`buildableEnvelope/derive.ts:221`) serves a flagged 999 height as a number (10 district rows
   at the serving commit, 39 at main).
2. P-249's staging proof (LDT #701, map #409), as its mission specifies.
3. **P-256** (factory #160, held): after P-297 is live, rebase it on factory main (it conflicts
   with P-281's and P-284's edits to `parcel-setback-cells.mjs`), move the factory corpus pin to
   1.3.0 (`package.json`, lockfile and `CORPUS_VERSION` in `src/lib/setback-writer/setback-table-router.mjs`),
   merge, rebuild the setback writer, dry-run each county, and apply only within the operator's
   per-county ceiling (A-199: Bastrop 5,518, Caldwell 5,116, Hays 18,904, McLennan 43,305, Travis
   103,283, Williamson 43,346 parcels; more than 2 percent over comes back to the operator). Then
   the P-258 writer re-run and the census re-grade. Then fire P-300.
4. P-296 (ETJ) after P-297 merges; P-254 and P-286 (your own rows; P-254's legs read the cell).
5. Dispatch as lanes free (keep about six): P-260, P-263 and P-264, P-266, P-268, P-270 to P-276,
   P-279, P-282, P-287, the P-291 note.

## 4. Owed by the operator

P-278 (production credential rotation, before Burnet's first production publish); the Cotality
contract and credentials (P-267, P-283); an account check for P-243 and P-244a; the first
automated production run of P-294.

## 5. Traps measured this session

- **The gate scheduler has no staging step.** Its hourly Cloud Scheduler run applies to the one
  verdict table production reads, so deploying its image IS the apply. Pause the trigger around
  any change and grade before resuming.
- **Migrations merged are not applied.** `0011a` was missing on the factory store. Check the live
  schema (`pg_constraint`, `pg_class` via the read-only role; the RO role cannot read
  `schema_migrations`) before running code that needs it. Migrations go through
  `factory-publish-migrate` on the rebuilt publish image; its log's `ran` list is the record.
- **The traffic-lease gate checks before the command runs.** Write `_catalog/leases/<service>.json`
  in its own call, then shift.
- **The seat gate reads the shell's leftover directory.** After working in a `P:/tmp` clone, use
  `git -C P:/doc_repo` for doc_repo commits. In `cd X && A & B &`, only A runs in X.
- **Two PRs that merge cleanly can still break each other** (P-252 and P-292 did). Merge `main`
  into the later branch, fix, and let CI run on the integrated tree before merging.
- **The gate scheduler reads a whole county per rail** (P-298); a cold cache turns 33 minutes into
  hours. **The P-295 lane scanned the factory store without a lease**; session leases are voluntary.
- **The retrieval key** is Secret Manager `HAUSKA_ENGINE_API_KEY` in `hauska-prod-497015` (also
  mirrored in `legacy-design-tools-prod`), sent as `Authorization: Bearer`; the coverage route is
  `/parcel-record-gate-verdict/coverage/check`.
- **Timestamps** in living documents come from `date -u`, never an estimate.

## Starter prompt for the fresh session

"You are the integration seat in P:/doc_repo. Read _inbox/2026-09-17_HANDOFF_integration_seat.md
and do what it says: the three time-sensitive checks in section 1 first, then wait for me to report
the six lanes' closes."
