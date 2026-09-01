---
id: 2026-08-31_a1-containment_supervisor_review
title: Planner review of A1 containment sweep
date: 2026-08-31
plan_row: F-01
status: accepted-partial
---

# Planner review of A1

Independently re-read landing binds on fancy-fire `neondb` / `br-crimson-feather-aphfmy91` and Cloud Run executions as JSON by field name. Re-ran `node --test test/p2-juris-persist.test.mjs test/p2-job.test.mjs` at `P:/tmp/hauska-factory-a1-containment` `5f9acc3` plus uncommitted patch: 32 pass, 0 fail.

## Verdict

Accept as an honest partial. TOTALS is UNMEASURED. Do not adopt 317918 or 357269. Caldwell is licensed by a succeeded run, not by the hand-cancel. Williamson refused `COUNTY_HELD` live. Travis was not run. The uncommitted replay patch is the right write path and is not commitable as-is: Hays `complete` is presence-shaped.

## Store, re-measured 2026-08-31T21:52Z

Instrument: Neon MCP `run_sql` `GROUP BY county_fips, run_id, disposition` on `landing_parcel_jurisdiction`. Disposition values are `unincorporated` and `in-city` (hyphen). A first query that filtered `in_city` (underscore) returned zeros on that column and is discarded.

| FIPS | run_id | unincorporated | in-city | total |
|---|---|---|---|---|
| 48021 | 85f984c2-e67b-4229-be57-a727f3026b04 | 50264 | 11992 | 62256 |
| 48055 | 1e2529a3-9a3e-4928-bd5d-1e122133a9b5 | 14361 | 10627 | 24988 |
| 48209 | bdcf534f-658e-43f8-bcfc-7c397b7bd04a | 61585 | 54835 | 116420 |
| 48309 | a62e3fce-59ef-49be-b6fc-8f45a115b4e5 | 32422 | 81832 | 114254 |
| 48491 | (no rows) | | | 0 |
| 48453 | (no rows) | | | 0 |

One run_id per county. Matches the close. `LANDING_REPLAY_SQL` uses `in-city`, which is the store token.

## Executions, re-read as JSON

`factory-p2-juris` generation 5, image `sha256:dd7c2a94`. No running execution.

- `6gc9j` args `p2-juris --county=48055 --apply`, succeededCount=1, completionTime 2026-08-31T21:05:51.415807Z
- `bbqmg` args `--county=48309`, succeededCount=1, completionTime 2026-08-31T21:37:41.371216Z
- `hcx7x` args `--county=48491`, failedCount=1, completionTime 2026-08-31T21:45:35.104849Z

Order was Caldwell, then McLennan, then Williamson. One at a time. Sentinel discipline held: Caldwell in-city Mustang Ridge, McLennan unincorporated, Williamson n_zero=0 stated as a measurement.

A second mechanism that would look like a Caldwell license: citing `bd9580d1`. Rejected. That run_id binds zero 48055 rows now.

## Patch

`requireReplayGate` is starved: it exists, `runP2Juris` on the serving digest never constructed `replay`. Live `hcx7x` is the violation. File-side Travis-without-replay already refused. Both doors agree.

`replayFromLandingRows` compares Bastrop and Caldwell to `INTERACTIVE_PARTITIONS` (meaning-shaped). The Caldwell mismatch fixture (10628/24989) keeps `matches.48055` false.

Hays `complete` is `total > 0`. That is presence-shaped. A one-row Hays landing would lift Williamson. The Hays falsifier on this board is completion against 116420, not a positive count. Rewrite before any commit so `complete.48209` is true only when landing total equals the licensed Hays bind (116420 on `bdcf534f`), or refuses UNMEASURED. Do not invent a Hays split.

Do not deploy this patch from this review. A tarball pin would move the digest with no `COMMIT_SHA`.

## Store released

A1 has left `ep-lucky-truth`. A3 may start. A2's unique-key read stays behind A3. Both hit the same compute.
