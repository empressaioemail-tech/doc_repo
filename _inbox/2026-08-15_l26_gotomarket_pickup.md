---
id: 2026-08-15_l26_gotomarket_pickup
title: L26 go-to-market pickup — do not lose this on compress
status: active
last_updated: 2026-08-17
---

# L26 go-to-market pickup

Read `_inbox/2026-08-17_l26_backfill_and_gtm_stand.md` first when picking this up. Then this file. Then `_STATE.md` header only.

## Objective (customer-done, not code-done)

Texas flush QA/launch on the current map (operator 2026-08-17). Remaining statewide PBF roads and CAMA are backfill. Ledger materialize and `gate-grade.mjs` DC-3 are not the launch go. A merged PR is not.

## Already done (do not redo)

- Special-district 253/253. Rail-corridor 254/254. Harris parcel-node. Mud scored.
- Pipelines: 19 landed (48001–48037 odd FIPS) + 48039 skipped (old hang).
- Flood `--from-plan`: **84/84 done**, **10,989,635** atoms (remainder+metros 9,465,995 + Harris 1,523,640), 0 VF. Harris applied 15:08Z+.
- 48001 pipeline parity raw **62/211 = 29.4%**. Normalized-key re-run **same 29.4%**. PostGIS re-drain of keyset counties is live. **TEMP-class metros (>=50k features, 52 counties including 48005) are deferred until after deploy** (WDLL amendment 2). 12-minute county wall; timeout or fail defers and continues.
- Metro parcel geom **52/52** done 23:43Z. Live count: 11,702,489 parcel geom, 491,178 pipeline geom, 4,726,297 parcel rows still JSONB-only (non-metro). Durable GiST **valid** 23:56Z: `txgio_parcel_geom_gist_idx` 479 MB, `tx_rrc_pipeline_geom_gist_idx` 21 MB, wall 93s.
- Durable-geom plan path added (`durable-gist-pipeline-major`): join `txgio_parcel.geom` in place, no TEMP rebuild.
- 48005 first proof timed out 12 min on a statewide `txgio_parcel` GROUP BY (empty log). Roster is now county-scoped.
- 48005 retry also timed out 12 min inside the durable join (1,030 pipes × geography ST_DWithin). Geometry-degree prefilter staged. Durable SQL now uses `ST_Expand(pl.geom, 0.0025)` for the GiST probe. 10-pipe plan-only proof is staged (`start_proof_48005_10pipe.cmd`); do not start it while footprints/roads hold neondb.
- Keyset closed 09:41:45Z (**189 landed**). Wells closed 10:44:51Z (**174 landed**, 15 Zod). Footprints closed 12:43:34Z (**174 landed**, 0 fails).
- Roads did not run. Sequencer set `ROAD_NODE_PATH=1`; writer requires `ROAD_NODE_COUNTY_PATH=1`. Env is now fixed in `l26_remaining_ingest.mjs`. Retry roads after metro.
- Old sequencer PID 86380 started CAD 48439 (Tarrant) at 12:46Z. Planner killed 86380. CAD child died with it at **330,000 / 1,603,024**. Resume-safe later. 48113 / 48135 never started.
- **10-pipe Angelina proof CLOSED 12:54:00Z.** `durable-batch` 10/10, 290 hits, **5283 ms**. Wall 12.5s.
- **200-pipe scale CLOSED 13:02:50Z.** 20 batches of 10, wall **294s**, code 0. One hot batch 10-20 at **93s / 749 hits**. Rest 1.7-25s. Full-county plan projects ~25-30 min.
- **Angelina apply LANDED 13:20:38Z.** 54,182 written, 54,182 verified, 0 VF, wall 780s (plan 702s, write 70s). `durable-gist-pipeline-major`.
- **Metro return drain PAUSED 13:37Z.** 48035 failed: 19,975 features is under the 50k metro gate, so it used `keyset-parcel-batch` and hit the 600s statement_timeout. No `durable-batch` line. 48073 was on the same path (46k features / 1,457 pipes). Drain killed. Planner now uses durable-gist whenever parcel geom is complete, not only at >=50k.
- **Keyset geom backfill CLOSED 13:47:14Z.** 12/12 code 0. 48035: 27,224 parcel geom, 0 left.
- **Keyset retries CLOSED 15:29:37Z.** 12/12 landed, 0 fails. 48351 16,182 atoms / 48.5 min. 48443 5,133 / 81s. 48455 24,609 / 114s. 48129 still honest absence.
- **48039 DEFERRED 16:07Z.** 4,721 pipes x 275k parcels. First batch 591s (near the 600s statement_timeout). 11/472 batches in 16 min. Would miss the 90-min wall. Segmentize then retry. Do not block the queue.
- **48157 FAILED 16:58Z.** Plan reached 1580/1609 then a batch hit the 600s statement_timeout. 0 atoms written. Hold for segmentize with 48039. Drain did not stop.
- **Harris 48201 LANDED 18:19:34Z.** 1,523,640 written, 1,523,640 verified, 0 VF, 0 errors. Wall 67.9 min (plan 56.2, write 7.8, verify 3.2). Under the 90-min wall. `durable-gist-pipeline-major`.
- **Metro queue CLOSED 20:40:50Z.** 50/52 landed (48039 skipped, 48157 failed). 48491 **282,569** / 0 VF / 24.1 min. Drain PID gone. Writer free.
- **48039/48157 HONEST HOLD.** v1 subdivide 305s/872. v2 segmentize+subdivide **347s/2983 hits** (more geography casts). Reversed per decision. Do not --apply. Do not raise timeout.
- **Roads drain STOPPED 17:32Z.** 98/254 landed. Two CAPCOG collision holds. Harris third restart killed at 64k ways / 0 written. Operator 17:36Z: QA and launch on current map; remaining roads/CAMA/CAD re-apply are background backfill. Do not restart statewide-PBF Harris. Do not start the 153-county roads drain. Lease heartbeat 22096 still live, expires ~21:37Z.
- **Metro 19/52 landed.** 48183 57,816 / 178s. 48187 93,727 / 89s. Held: 48039, 48157.
- L26 dispatch compiled. L25 not seated. Lease holder **L26**.

## STOP (operator 2026-08-17)

Do not drive the old sequence below. Fill factory is stopped. Remaining PBF roads and CAMA are post-launch backfill. The living record is `_inbox/2026-08-17_l26_backfill_and_gtm_stand.md`. WDLL amendment 5. OPS-16 A-017.

Next work is QA on `https://smartsite.cloud`, Stripe polish, Pipedrive webhook (`smartsite` + tier tags), pricing popup like lander signup. Hobby: no new BFF. Do not restart `start_remaining_ingest.cmd`. Do not statewide-PBF Harris.

Historical sequence (do not resume as launch work): flood 84/84; keyset pipelines 189; wells/footprints 174; metro 50/52 with 48039+48157 honest hold; roads 98/254 then stopped; CAD re-apply never the Dallas sqft gap.

WDLL: `_inbox/2026-08-15_texas_flush_server_plan_WDLL.md`.

## Live processes (detached Node, not Cursor sub-agents)

Work root `P:/tmp/l26_flood_drain_20260815/`. **All fill jobs idle.** Only the L26 lease heartbeat (PID 22096 as of 17:58Z) should still be running. Do not start a second writer.

| Job | How to find | Scoreboard |
|---|---|---|
| Flood remainder | exited | `flood_from_plan_progress.json` |
| Digest retry 48141 | `l26_retry_digest_counties.mjs` | `retry_digest.log` |
| Harris plan | `l26_harris_plan_only.mjs` | `flood_metros/48201.plan.ndjson` + `.plan.log` |
| Harris apply when NDJSON ready | `l26_harris_join_watch.mjs` | `harris_join_watch.json` |
| Rest of ingest | `l26_remaining_ingest.mjs` | `remaining_ingest_progress.json` |
| Metro geom drain | exited 23:43Z | `metro_geom_drain_progress.json` |
| Durable GiST | exited 23:56Z | `gist_create.log` |
| 48005 durable proof | exited (two 12-min fails) | `apply_pipelines_48005_durable.log` |
| 48005 10-pipe proof | staged, do not start yet | `start_proof_48005_10pipe.cmd` |
| Lease heartbeat | `l26_lease_heartbeat.mjs` | `lease_heartbeat.log` ttl 14400 |

Env loaders: `start_*.cmd` in the work root. URLs in `P:/tmp/l16_drain_20260813/*.direct.url`. Do not echo them.

## Standing constraints

- One atoms writer. Lease L26. Kill any other `--apply`.
- One heavy neondb scan. Harris plan holds that slot until NDJSON exists or the process is dead.
- Do not restart per-county JS pipeline runners.
- Do not merge PR #345 until live 48001 parity is graded. DISTINCT ON hang is gone from keyset SQL; TEMP universe DISTINCT ON without geometry is OK.
- PR #344 timers accepted, unmerged.
- Flood writer in `l24-flood-plan-emit` now: bbox keyset parcel load (no geometry); stale plan digest recomputes instead of fail-closed. That is why 48329/48215 landed on retry.

## Traps

- Empty Harris log ≠ dead. Check the PID and `pg_stat_activity`. The old hang is `DISTINCT ON (feature_index)` + `geometry`. If that query is back, kill and keep the bbox keyset path.
- Remaining ingest will not start parity until Harris is applied (`flood-done-harris-pending`). That is correct (one writer). Do not start pipelines yourself while the sequencer is alive.
- 48141/48215/48329 failed first on header digest ≠ body. Do not re-fail-close on that.
- `P:/hauska-engine` is stale. Drain tree is `l24-flood-plan-emit`. Pipeline tree is `l26-pipeline-postgis`.

## If this chat is gone

1. Read `_inbox/2026-08-17_l26_backfill_and_gtm_stand.md`. Then this file. Then `_STATE.md` header only.
2. Do not restart drains from `start_*.cmd`. Fill factory is stopped.
3. QA is `https://smartsite.cloud`. GTM work is Pipedrive webhook + pricing popup + Stripe polish.
