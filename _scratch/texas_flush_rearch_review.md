# Scratch: Texas flush rearchitecture adversarial review

Workstream: texas-flush-drain-rearch
Date: 2026-08-15

## GROUND-TRUTH (2026-08-15T13:30Z)

- Drain PAUSED. L25 CP1 missing. Lease lapsed per session close. `_STATE.md` body still has stale L16B IN_FLIGHT / ONE-LINE contradictions; header is the live one.
- Engine review tree: `P:/hauska-engine-worktrees/l24-flood-plan-emit`. Only two `postgis-*.ts` files.
- Pipelines landed 19 / 1,270,793 atoms / sum wallMs 14,947,123 ms = 85.02 atoms/s. Progress file `leg5_pipelines_progress.json`.
- Banked flood: 78 remainder NDJSON + 5 metro NDJSON = 9,479,281 planned atoms. Harris 48201 has dry-run summary only, no `.plan.ndjson`.
- PostGIS 3.5.0 on neondb (Neon project `fancy-fire-06136146`). `tx_rrc_pipeline` / `tx_rrc_well` / `txgio_parcel` / `tx_special_district` are jsonb+bbox, no geom/GiST. `tx_building_footprint` has geom.
- Brazoria 48039: 304,675 parcel rows / 275,131 features / 4,721 pipeline rows.
- Parcel page EXPLAIN on 48039: Unique + Gather Merge + Sort of ~321k rows per LIMIT 500, index `txgio_parcel_situs_norm_idx`, width 524 with geometry. Same #335 shape.
- 48011 EXPLAIN ANALYZE with geometry: external merge Disk 4208kB, 115 ms (hot). Without geometry (cold): 183 ms, in-memory 498kB.
- Metro digest mismatches 48113 and 48453 are the Zone-X `_outside` → absent pattern (55 and 147). 48029 Bexar digests MATCH (no mismatch file).
- L16B runner used `--batch=5000` but writer caps parcel pages at `min(batch, 2000)`. Kill is `setTimeout` + `child.kill` on `shell:true` pnpm; touch-loop every 5 min. Windows tree-kill is the never-fires class.
- SD write rates in `P:/tmp/l1_sd_plans_20260812/l1_undercount_progress.json`: Tarrant 2042.8 a/s; others 841–2106. Harris SD drain 1524.6 a/s.
- Rail corridor: 252 landed + 2 skips, 13,059,613 atoms, ~6.2 h wall, `--batch=5000`, staged NARN. Same JS parcel-pull architecture.
- L18 materialize duration 1072.2s. `gate-grade.mjs` MAX_AGE_MS = 30 min. Snapshot `computedAt=2026-08-14T13:10:24.947Z`.
- hauska_mcp atom-count query via Neon MCP failed twice (`fetch failed`). Not asserted as absence.

## LESSON

- "Plan phase" is two mechanisms: (1) defective per-page Unique+Sort with geometry in the tuple (0-CPU IO wait, hang class); (2) JS buffer-intersect cost scaling with overlay cardinality (high CPU, slow-but-finishes). Do not treat them as one fix.
- Flood PostGIS still loads full parcel GeoJSON into Node. Harris dry-run `loadParcelsMs=3,173,434`. Server-side predicate ≠ server-side plan.
- L25 H1 is valid for `--from-plan` because the NDJSON already has parcelKey+outcome. The two-database join ban does not apply to draining a banked plan.
- Well-fact grain is well×parcel. Road-node is PBF extract. Neither is an SD port.

## DEAD-END

- Seating L25 as written (H1 headline, H4 last, autopsy from artifacts that lack phase timers).
- Piloting pipeline SQL on Brazoria before a landed-county parity check. That can ship a new predicate against 19 already-written counties.
- Restarting per-county JS runners on 48039 to "diagnose" the hang. The EXPLAIN already shows the shape.
- Using flood's load-parcels-then-SQL module as the pipeline template.

## GROUND-TRUTH (2026-08-15T13:46Z)

- L26 seated. Lease holder L26. Flood `--from-plan --apply --batch=5000` LIVE.
- Measured write rate: Jones 48253 = 14,949 written/verified, 0 VF, writeMs 9643, wall 13012, **1148.9 a/s**. Skipped 12 contract-illegal keys.
- Landed so far: 48261 (527 @ 58.3), 48135 (3791 @ 339.8), 48253 (14949 @ 1148.9). 48337 in flight (resume of a 20k partial).
- Banked flood plans used a weaker key gate than `isUsablePropId` (`^[A-Za-z0-9._-]+$`). First-record CAD tokens like `51831, 558` (Jones) and last-batch `Tract 3` (Power) threw ZodError and killed the county. Filter now runs at apply via `partitionContractLegalFloodPlan`. Digest of the banked file is unchanged.
- Harris 48201 `--plan-only` still alive (pids 77264/84668), log 0 bytes, low CPU. Expected during parcel load. Do not start a second neondb reader.
- L25 not seated. Item 10 done (compiled L26 dispatch).

## GROUND-TRUTH (2026-08-15T15:41Z)

- Objective is go-to-market (full remaining ingest + gate-grade), not flood-only. Pickup: `_inbox/2026-08-15_l26_gotomarket_pickup.md`.
- Flood remainder+metros finished 15:08Z. 82 landed / 9,069,262 atoms after digest retries 48329 (74,821) and 48215 (325,956). 48141 retry in flight.
- Stale NDJSON header digest is not fail-closed: `drainFloodPlanPayload` recomputes and drains the body.
- Harris 48201 first plan hung ~2h on DISTINCT ON+geometry. Killed 15:35Z. Restarted on bbox keyset `--batch=5000`. No NDJSON yet.
- Remaining ingest phase `wait-flood-harris`. Lease L26 heartbeat live.
- PR #345 @ 7438129 keyset DISTINCT ON gone. Unmerged until 48001 parity.

## LESSON

- Flood planner `selectPlannableParcels` only skipped empty/zero. Atom contract rejects comma/space/slash. A single illegal key in batch 1 aborts 0 writes; in a later batch it leaves a resume-safe prefix (48337 wrote 20k then died). Drain must filter with `isUsablePropId` before `createFloodHazardFact`.
- First two county rates (58, 340) were startup + tiny n. First mid-size county is 1149 a/s. Do not promise 1400 SD; 1100 is the live from-plan band so far.
- Empty Harris log + ~0 CPU for hours is the hang class, not a slow plan. Kill it. Do not wait for the operator to say so.
- A status update that ends with "say if you want me to" is a defect against the go-to-market ruling.

## GROUND-TRUTH (2026-08-15T17:34Z)

- Flood 84/84 / 10,989,635 atoms / 0 VF. Harris 48201 1,523,640 written.
- 48001 parity raw 62/211 = 0.2938. Normalized-key re-run same 0.2938; flipped keys now `27721` not `27721.00000000`. Join-key artifact ruled out. WDLL item 5 FAIL. Re-drain 19 + remaining on PostGIS.
- Remaining ingest was exited `parity-hold`. Sequencer patched: `parity-hold` + normalized file > 0.5% → `pipelines-redrain` (no skip of the 19). Restarted via `start_remaining_ingest.cmd`.
- Lease L26 heartbeat live. No second writer.

## GROUND-TRUTH (2026-08-15T18:04Z)

- Pipeline re-drain live. 48001 landed 31,676 / 0 VF / wall 437s / plan 211s / write 31s. 48003 landed 10,467 / 0 VF / wall 253s. 48005 Angelina in plan since 17:47Z.
- 48001 near-count JS 4,146 → PostGIS 3,741. Write band ~900–1,000 a/s; wall is plan SQL.
- Sequencer pid 34184. Lease L26 expires ~21:57Z. No second writer.

## GROUND-TRUTH (2026-08-15T18:34Z)

- Still 2/254 pipeline PostGIS. 48005 Angelina in plan since 17:47Z. 70,445 parcel rows (all with geometry) → TEMP+GiST path (threshold 50k). Live neondb query is the TEMP load INSERT (GeoJSON → geom, 25k keyset). Active, no wait event, ~8s into current batch when sampled. Node CPU 15s over 47 min = blocked on SQL, not hung.
- Do not kill 48005. Silent apply log is expected until planViaTempGist returns.
- Lease L26 expires ~22:29Z.

## GROUND-TRUTH (2026-08-15T19:06Z)

- Pipeline PostGIS 9 landed / 174,298 atoms / 0 VF: 48001 03 07 09 11 13 15 17 19.
- 48005 failed 18:40Z after 53 min: `relation "l1_rrc_parcels_48005" does not exist`. TEMP is session-local; writer pool max=4. Patched `planViaTempGist` to `sql.reserve()` for the whole metro plan. Sequencer now skips only code===0 so failed counties retry.
- Restarted remaining ingest 19:06Z; current=48005 retry. 48021 was killed mid-plan (not landed).
- Lease L26 expires ~23:01Z. Scoreboard loop still 30 min.

## GROUND-TRUTH (2026-08-15T20:13Z)

- Operator: do not sit on problematic counties. Killed 48005 retry (~58 min, still TEMP loading). 52 TEMP-class counties (>=50k features) deferred to after deploy. File `pipeline_defer.json`. Sequencer wall 12 min; timeout/fail defers and continues.
- WDLL amendment 2 filed. 9 keyset counties already landed (174,298). This pass drains the remaining keyset only.

## GROUND-TRUTH (2026-08-15T20:34Z)

- Metros were NOT fixed by ADD COLUMN. geom was empty; TEMP still parsed JSONB.
- Operator: fix the dataset so metros ingest. Keyset drain paused. Metro geom drain live: backfill all 491k pipeline rows, then per-county parcel geom + PostGIS apply, 48005 first. Writer now prefers persistent geom.
- Keyset progress preserved (landed through 48033; 48035 interrupted). Resume after metros or in gaps.

## GROUND-TRUTH (2026-08-15T23:52Z)

- Metro geom drain finished 23:43Z. 52/52 backfillCode=0. Last: Travis 926s, Webb 71s, Wichita 46s, Williamson 88s. Apply skipped `temp-apply-over-12min-wall` after 48005/48021 12-min timeouts.
- Live: parcel_geom 11,702,489; parcel_left 4,726,297; pipe_geom 491,178; parcel_gist 0.
- Durable GiST CONCURRENTLY started 23:54Z (pipe first, then parcel). One heavy scan. Do not start remaining ingest or a second neondb scan until it finishes.
- Keyset still paused at 13 (through 48033). Lease L26 heartbeat live, expires ~03:49Z 2026-08-16.

## GROUND-TRUTH (2026-08-16T00:08Z)

- GiST CONCURRENTLY done 23:56Z, wall 93s. Both indexes valid+ready: parcel 479 MB, pipeline 21 MB.
- Writer now prefers `durable-gist-pipeline-major` when a metro county has zero JSONB-only leftover. TEMP path stays as fallback.
- 48005 durable apply proof started 00:08Z (12-min wall). One atoms writer. Do not start remaining ingest until this proof exits.

## GROUND-TRUTH (2026-08-16T00:23Z)

- 48005 first durable proof timed out 12 min, empty log. Cause: `readParcelRoster()` did `GROUP BY county_fips` on all 16.4M parcels before planning. Join EXPLAIN is healthy (GiST && + county bitmap AND).
- Roster now county-scoped. Retry started 00:22:57Z; `postgis-plan-start` at +1.2s (70,445 rows / 60,693 features / 1,030 pipes). Live query is durable LATERAL join.
- Do not start remaining ingest until this proof exits. Do not retry TEMP.

## GROUND-TRUTH (2026-08-16T00:38Z)

- 48005 retry also timed out 12 min. Reached durable join at +1.2s (70,445 / 60,693 / 1,030). Wall was geography ST_DWithin on GiST candidates (~1.6k/pipe × 1030 ≈ 1.7M casts).
- Keyset remaining ingest restarted 00:37:45Z at 48035 (27,224 rows / 19,975 features / 98 pipes). Queue 189, deferred 52. Sequencer pid 86380.
- Durable SQL now has geometry ST_DWithin(..., 0.0025) prefilter before geography. Do not re-apply 48005 until a timed batch log proves the prefilter.
- Keyset parcel CTE now prefers stored geom (non-metros still JSONB parse).

## GROUND-TRUTH (2026-08-16T00:52Z)

- Keyset resume landed 48043 (84s), 48045 (7s), 48047 (41s), 48049 (37s / 31,029 atoms / plan 18s). Total keyset landed 17. Sequencer on 48051 (34,931 / 27,282 / 3,897 pipes) since 00:50:37Z.
- 48035 failed code 1 at 603s: `canceling statement due to statement timeout` on keyset plan (27k parcels, 98 pipes, no stored geom). Deferred. Not a 12-min wall.
- Defer list now 53 (52 metro + 48035). Sequencer pid 86380 still live.

## GROUND-TRUTH (2026-08-16T01:07Z)

- Keyset landed 25. Since resume: 48043–48049, 48051 (128s / 20,954), 48055, 57, 59, 63, 65, 67, 69. Only fail still 48035. Current 48071 since 01:00:10Z (47,522 / 37,510 / 2,891 pipes).
- High pipe-count keyset is viable: 48051 3,897 pipes under 12 min. Sequencer pid 86380. Lease expires ~05:01Z.

## GROUND-TRUTH (2026-08-16T01:22Z)

- Keyset landed 27. 48071 took 684s (47k / 2,891 pipes). 48073 deferred: 56,543 rows / 46,761 features / 1,457 pipes, keyset path, 600s statement_timeout (same class as 48035). 48075 landed 31s. Current 48077 (23,259 / 13,501 / 1,046).
- Failures this pass: 48035, 48073. Sequencer pid 86380. Lease expires ~05:17Z.

## GROUND-TRUTH (2026-08-16T01:37Z)

- Keyset landed 29. 48077 took 701s (23k / 1,046 pipes). 48079 landed 22s. Current 48081 since 01:34:14Z (13,628 / 8,271 / 617). No new fails. Sequencer pid 86380. Lease expires ~05:33Z.

## GROUND-TRUTH (2026-08-16T01:52Z)

- Keyset landed 38. This tick: 48081 (245s), 83, 87, 89 (308s), 93, 95, 97, 99, 101 (10s). Current 48103 since 01:49:13Z (16,464 / 6,913 / 5,064 pipes). Fails still only 48035 / 48073. Sequencer pid 86380. Lease expires ~05:49Z.

## GROUND-TRUTH (2026-08-16T02:07Z)

- Keyset landed 40. 48103 landed 212s (16k / 5,064 pipes). 48105 deferred on 12-min wall (21,823 / 9,113 / 6,133 pipes). 48107 landed 8s. Current 48109 since 02:04:54Z (28,137 / 13,327 / 3,559). Sequencer pid 86380. Lease expires ~06:05Z.

## GROUND-TRUTH (2026-08-16T02:22Z)

- Keyset landed 46. This tick: 48109 (155s), 111, 115, 117, 119, 125 (6s). 48123 deferred: 29,012 / 20,802 / 3,085 pipes, 600s statement_timeout. Current 48127 since 02:19:34Z (20,939 / 15,542 / 7,965 pipes). Sequencer pid 86380. Lease expires ~06:21Z.

## GROUND-TRUTH (2026-08-16T02:37Z)

- Keyset landed 49. 48127 landed 569s (20,939 / 7,965 pipes). 48129 failed in 0.5s: zero rows in txgio_parcel (honest absence). 48131 (188s) and 48133 (155s) landed. Current 48137 since 02:34:47Z (19,388 / 9,948 / 735). Sequencer pid 86380. Lease expires ~06:29Z.

## GROUND-TRUTH (2026-08-16T02:52Z)

- Keyset landed 54. This tick: 48137 (481s), 143 (98s), 145 (234s), 147 (30s), 149 (156s). Current 48151 since 02:51:25Z (11,259 / 6,817 / 418). No new fails. Sequencer pid 86380. Lease expires ~06:45Z.

## GROUND-TRUTH (2026-08-16T03:07Z)

- Keyset landed 58. This tick: 48151 (158s), 153 (51s), 155 (7s), 159 (46s). Current 48161 since 02:55:47Z (32,050 / 23,979 / 8,067 pipes), ~11 min in plan, 12-min wall imminent. Sequencer pid 86380. Lease expires ~07:01Z.

## GROUND-TRUTH (2026-08-16T03:22Z)

- Keyset landed 63. 48161 deferred on 12-min wall (32,050 / 8,067 pipes). Then 48163 (414s), 165, 169, 171, 173 landed. Current 48175 since 03:21:30Z (15,303 / 10,314 / 1,105). Sequencer pid 86380. Lease expires ~07:17Z.

## GROUND-TRUTH (2026-08-16T03:37Z)

- Keyset landed 74. This tick: 48175, 177, 179, 185, 189, 191, 193, 195, 197, 199, 205. Current 48207 since 03:37:16Z (13,383 / 9,370 / 124). No new fails. Sequencer pid 86380. Lease expires ~07:33Z.

## GROUND-TRUTH (2026-08-16T03:52Z)

- Keyset landed 79. This tick: 48207 (67s), 211, 217, 219 (432s), 223. Current 48225 since 03:51:22Z (38,468 / 26,611 / 1,219). No new fails. Sequencer pid 86380. Lease expires ~07:49Z.

## GROUND-TRUTH (2026-08-16T04:07Z)

- Keyset landed 80. 48225 landed 183s. 48227 deferred on 12-min wall (25,491 / 20,654 / 5,338 pipes). Current 48229 writing 15k / 21,782 (38,359 / 23,954 / 84 pipes). Sequencer pid 86380. Lease expires ~08:05Z.

## GROUND-TRUTH (2026-08-16T04:22Z)

- Keyset landed 83. 48229 landed 62s. 48233 landed 685s (near wall). 48235 landed 36s. Current 48237 since 04:19:30Z (17,441 / 11,866 / 4,743 pipes). Sequencer pid 86380. Lease expires ~08:21Z.

## GROUND-TRUTH (2026-08-16T04:37Z)

- Keyset landed 90. This tick: 48237 (235s), 239 (366s), 241, 243, 247, 249, 253. Current 48255 since 04:34:47Z (21,407 / 14,436 / 5,162 pipes). No new fails. Sequencer pid 86380. Lease expires ~08:29Z.

## GROUND-TRUTH (2026-08-16T04:52Z)

- Keyset landed 98. This tick: 48255 (292s), 259, 261, 263, 265, 267, 269, 271 (397s). Current 48273 since 04:51:59Z (17,918 / 14,909 / 809). No new fails. Sequencer pid 86380. Lease expires ~08:45Z.

## GROUND-TRUTH (2026-08-16T05:07Z)

- Keyset landed 103. This tick: 48273 (61s), 275, 277, 279 (257s), 281. Current 48283 since 05:00:19Z (19,363 / 10,341 / 3,712 pipes), ~7 min in. No new fails. Sequencer pid 86380. Lease expires ~09:01Z.

## GROUND-TRUTH (2026-08-16T05:22Z)

- Keyset landed 104. 48283 deferred: 600s statement_timeout (19,363 / 3,712 pipes). 48285 landed 516s. Current 48287 since 05:18:58Z (22,661 / 16,090 / 3,310). Sequencer pid 86380. Lease expires ~09:17Z.

## GROUND-TRUTH (2026-08-16T05:37Z)

- Keyset landed 106. 48287 landed 567s. 48289 landed 453s. Current 48293 since 05:35:58Z (29,793 / 21,727 / 1,683). No new fails. Sequencer pid 86380. Lease expires ~09:33Z.

## GROUND-TRUTH (2026-08-16T05:52Z)

- Keyset landed 113. This tick: 48293, 295, 297, 299, 301, 305, 307. Current 48311 since 05:51:14Z (8,327 / 4,188 / 2,025). No new fails. Sequencer pid 86380. Lease expires ~09:49Z.

## GROUND-TRUTH (2026-08-16T06:07Z)

- Keyset landed 119. This tick: 48311, 313, 315, 317, 319, 321 (533s). Current 48323 since 06:07:03Z (31,977 / 26,048 / 713). No new fails. Sequencer pid 86380. Lease expires ~10:06Z.

## GROUND-TRUTH (2026-08-16T06:22Z)

- Keyset landed 124. This tick: 48323, 325, 327, 333, 335. 48331 deferred: 600s statement_timeout. Current 48337 since 06:22:25Z (33,612 / 24,836 / 2,182). Sequencer pid 86380. Lease expires ~10:22Z.

## GROUND-TRUTH (2026-08-16T06:37Z)

- Keyset landed 128. 48337 landed 683s. Then 48341, 343, 345. Current 48347 since 06:35:43Z (57,487 / 48,003 features / 2,306 pipes) — under 50k-feature metro cut, so keyset. Sequencer pid 86380. Lease expires ~10:30Z.

## GROUND-TRUTH (2026-08-16T06:52Z)

- Keyset landed 129. 48347 deferred on 12-min wall (57,487 / 48,003 / 2,306). 48349 landed 163s. Current 48351 since 06:50:26Z (30,576 / 23,278 / 435). Sequencer pid 86380. Lease expires ~10:46Z.

## GROUND-TRUTH (2026-08-16T07:07Z)

- Keyset landed 133. 48351 deferred: 600s statement_timeout (30,576 / 435 pipes). Then 48353, 357, 359, 363 landed. Current 48365 since 07:06:29Z (25,304 / 18,812 / 11,872 pipes). Sequencer pid 86380. Lease expires ~11:02Z.

## GROUND-TRUTH (2026-08-16T07:22Z)

- Keyset landed 141. 48365 landed 177s (25,304 / 11,872 pipes). Then 369, 371 (516s), 377, 379, 383, 385, 387. Current 48389 since 07:21:15Z (27,385 / 14,975 / 11,453 pipes). No new fails. Sequencer pid 86380. Lease expires ~11:18Z.

## GROUND-TRUTH (2026-08-16T07:37Z)

- Keyset landed 146. This tick: 48389 (497s / 11,453 pipes), 391, 393, 395, 399. Current 48401 since 07:36:10Z (48,187 / 37,967 / 8,308). No new fails. Sequencer pid 86380. Lease expires ~11:34Z.

## GROUND-TRUTH (2026-08-16T07:52Z)

- Keyset landed 150. This tick: 48401 (345s / 8,308 pipes), 403, 405, 407. Current 48411 since 07:46:16Z (17,223 / 11,591 / 39 pipes), ~6 min in. No new fails. Sequencer pid 86380. Lease expires ~11:50Z.

## GROUND-TRUTH (2026-08-16T08:07Z)

- Keyset landed 161. This tick: 48411 (481s / 39 pipes), 413, 415, 417, 419, 421, 425, 427, 429, 431, 433. Current 48435 since 08:07:25Z (10,745 / 5,905 / 9,024 pipes). No new fails. Sequencer pid 86380. Lease expires ~12:06Z.

## GROUND-TRUTH (2026-08-16T12:37Z)

- Footprints 168 landed, 0 fails. Current 48497 since 12:36:41Z. Sequencer pid 86380. Lease expires ~16:30Z. Restart at fp close.

## GROUND-TRUTH (2026-08-17T17:58Z)

- 15-min scoreboard loop PID 85672 dead. 30-min loop 84712 dead. No extract_highways / write-road-node process. Lease heartbeat 22096 still live, last beat 17:53Z, expires ~21:53Z.
- Operator GTM: Stripe checkout mechanically works (polish owed). Vercel Hobby stays. Pipedrive is Smart Site CRM with tags `smartsite` + user tier. Pricing is a popup like lander signup, not a full page. Decision `_decisions/2026-08-17_smartsite_gtm_pipedrive_popup_hobby.md`.
- Stand record `_inbox/2026-08-17_l26_backfill_and_gtm_stand.md`. Live QA https://smartsite.cloud HTTP 200 Vercel HIT Last-Modified 2026-08-16T05:02Z. No PE deploy (no product code this session). Do not vercel from dirty hauska-map.

## OPEN

- Stripe polish from the operator pass (do not invent a list). Amounts still $29/$65/$99 vs locked $49/$129/$299. Unlock $15 product not created.
- Pipedrive webhook not built. Pricing popup not built. G-63 city-feed refusal still stands.
- Roads backfill redesign (not serial PBF). Harris via clipped/prepared extract + `--skip-extract --ndjson`. CAMA DCAD zip after announce. Engine `DECLARED_CAD_VINTAGES` before Dallas/Tarrant cad-roll re-apply.
- 48039/48157 pipeline honest hold. Do not `--apply`.

## DEAD-END

- Treating 98/254 PBF drain JSON as launch. Restarting statewide-PBF Harris. Detach without `/T`. Raise-and-restart walls. Cad-roll re-apply as the Dallas sqft fix.

## GROUND-TRUTH (2026-08-17T17:38Z)

- Roads drain idle. No write-road-node-county / extract_highways. Progress still current=48201, landed 98, failed 48021+48055, skipped none. Harris apply log frozen at kept=64000 highway_seen=341875 LastWrite 17:26:42Z.
- Operator: QA and launch on current map; do not treat 254/254 roads as the launch blocker. Dallas CAD tail is A1 atoms already present; CAMA zip is the sqft/year gap, not L26 cad-roll.
- Lease heartbeat 22096 expires ~21:37Z. Do not restart statewide PBF. Do not start CAD.

## GROUND-TRUTH (2026-08-17T17:25Z)

- 17:22Z live probe: Harris 366k kept / 3.08M seen / 300 min, still extract-only. Wall of drain 112100 was 18:22Z.
- 17:23Z detach: `taskkill /PID 112100 /F` without `/T` still killed the writer tree (107704/112108/100220/108796 all dead). Adopt watcher 86868 killed before it could fail-close 48201.
- Third Harris restart 17:25:21Z. Drain PID 89084. Extract python 105336 live. Apply log reset to streaming header. WALL_MS now 720 min, expires 05:25Z 18 Aug. Roads still 98/254, 2 CAPCOG holds. Lease heartbeat 22096 expires ~21:21Z. Do not start CAD.

## DEAD-END

- Detaching the drain parent without `/T` to keep a long Harris extract alive. On this spawn shape the children die with the parent. The 366k-way / 5h extract is gone. Do not retry.

## GROUND-TRUTH (2026-08-17T17:07Z)

- Roads 98/254. 48201 Harris retry extracting 284 min (started 12:22:52Z). kept=342000 highway_seen=2826117. Past Dallas 322k. Apply not started. Log LastWrite 17:05:34Z. Python extract CPU 14470s under drain 112100. Wall expires 18:22Z (~75 min). Raise-wall decision 17:52Z if still extracting. 48021+48055 holds. Lease expires ~21:05Z.

## GROUND-TRUTH (2026-08-17T16:52Z)

- Roads 98/254. 48201 Harris retry extracting 269 min (started 12:22:52Z). kept=316000 highway_seen=2587602. Near Dallas 322k. Apply not started. Log LastWrite 16:49:24Z. Python extract CPU 13715s under drain 112100. Wall expires 18:22Z (~90 min). 48021+48055 holds. Lease expires ~20:49Z.

## GROUND-TRUTH (2026-08-17T16:37Z)

- Roads 98/254. 48201 Harris retry extracting 254 min (started 12:22:52Z). kept=300000 highway_seen=2491546. Near Dallas 322k. Apply not started. Log LastWrite 16:37:08Z. Python extract CPU 12970s under drain 112100. Wall expires 18:22Z (~105 min). 48021+48055 holds. Lease expires ~20:33Z.

## GROUND-TRUTH (2026-08-17T16:22Z)

- Roads 98/254. 48201 Harris retry extracting 239 min (started 12:22:52Z). kept=278000 highway_seen=2208160. Apply not started. Log LastWrite 16:19:38Z. Python extract CPU 12149s under drain 112100. Wall expires 18:22Z (~120 min). 48021+48055 holds. Lease expires ~20:17Z.

## GROUND-TRUTH (2026-08-17T16:07Z)

- Roads 98/254. 48201 Harris retry extracting 224 min (started 12:22:52Z). kept=268000 highway_seen=2089050. Apply not started. Log LastWrite 16:06:04Z. Python extract CPU 11426s under drain 112100. Wall expires 18:22Z. 48021+48055 holds. Lease expires ~20:01Z.

## GROUND-TRUTH (2026-08-17T15:52Z)

- Roads 98/254. 48201 Harris retry extracting 209 min (started 12:22:52Z). kept=260000 highway_seen=1997108. Past prior kill (209 min / 426k on 240-min wall). Apply not started. Log LastWrite 15:52:15Z. Python extract CPU 10572s under drain 112100. Wall expires 18:22Z. 48021+48055 holds. Lease expires ~19:45Z.

## GROUND-TRUTH (2026-08-17T15:37Z)

- Roads 98/254. 48201 Harris retry extracting 194 min (started 12:22:52Z). kept=242000 highway_seen=1910166. Log LastWrite 15:33:34Z. Python extract CPU 9777s under drain 112100. Wall expires 18:22Z. 48021+48055 holds. Lease expires ~19:29Z.

## GROUND-TRUTH (2026-08-17T15:22Z)

- Roads 98/254. 48201 Harris retry extracting 179 min (started 12:22:52Z). kept=230000 highway_seen=1811803. Log LastWrite 15:20:29Z. Python extract CPU 8983s under drain 112100. Wall expires 18:22Z. 48021+48055 holds. Lease expires ~19:21Z.

## GROUND-TRUTH (2026-08-17T15:07Z)

- Roads 98/254. 48201 Harris retry extracting 164 min (started 12:22:52Z). kept=220000 highway_seen=1788628. Log LastWrite 15:07:09Z. Python extract CPU 8231s under drain 112100. Wall expires 18:22Z. 48021+48055 holds. Lease expires ~19:05Z.

## GROUND-TRUTH (2026-08-17T14:52Z)

- Roads 98/254. 48201 Harris retry extracting 149 min (started 12:22:52Z). kept=204000 highway_seen=1593997. Log LastWrite 14:51:33Z. Python extract CPU 7596s under drain 112100. Wall expires 18:22Z. 48021+48055 holds. Lease expires ~18:49Z.

## GROUND-TRUTH (2026-08-17T14:37Z)

- Roads 98/254. 48201 Harris retry extracting 134 min (started 12:22:52Z). kept=172000 highway_seen=1398804. Log LastWrite 14:36:44Z. Python extract CPU 6844s under drain 112100. Wall expires 18:22Z. 48021+48055 holds. Lease expires ~18:33Z.

## GROUND-TRUTH (2026-08-17T14:22Z)

- Roads 98/254. 48201 Harris retry extracting 119 min (started 12:22:52Z). kept=160000 highway_seen=1302111. Log LastWrite 14:18:26Z. Python extract CPU 6044s under drain 112100. Wall expires 18:22Z. 48021+48055 holds. Lease expires ~18:17Z.

## GROUND-TRUTH (2026-08-17T14:07Z)

- Roads 98/254. 48201 Harris retry extracting 104 min (started 12:22:52Z). kept=132000 highway_seen=1221325. Log LastWrite 14:06:08Z. Python extract CPU 5329s under drain 112100. Wall expires 18:22Z. 48021+48055 holds. Lease expires ~18:01Z.

## GROUND-TRUTH (2026-08-17T13:52Z)

- Roads 98/254. 48201 Harris retry extracting 89 min (started 12:22:52Z). kept=118000 highway_seen=1174579. Log LastWrite 13:52:09Z. Python extract CPU 4770s under drain 112100. Wall expires 18:22Z. 48021+48055 holds. Lease expires ~17:45Z.

## GROUND-TRUTH (2026-08-17T13:37Z)

- Roads 98/254. 48201 Harris retry extracting 74 min (started 12:22:52Z). kept=108000 highway_seen=1107943. Log LastWrite 13:36:19Z. Python extract CPU 4121s under drain 112100. Wall expires 18:22Z. 48021+48055 holds. Lease expires ~17:29Z.

## GROUND-TRUTH (2026-08-17T13:22Z)

- Roads 98/254. 48201 Harris retry extracting 59 min (started 12:22:52Z). kept=90000 highway_seen=1009942. Log LastWrite 13:21:34Z. Python extract CPU 3274s under drain 112100. Wall expires 18:22Z. 48021+48055 holds. Lease expires ~17:21Z.

## GROUND-TRUTH (2026-08-17T13:07Z)

- Roads 98/254. 48201 Harris retry extracting 44 min (started 12:22:52Z). kept=72000 highway_seen=909189. Log LastWrite 13:06:59Z. Python extract CPU 2454s under drain 112100. Wall expires 18:22Z. 48021+48055 holds. Lease expires ~17:05Z.

## GROUND-TRUTH (2026-08-17T12:52Z)

- Roads 98/254. 48201 Harris retry extracting 30 min (started 12:22:52Z). kept=64000 last flushed 12:24:09Z; python extract CPU 1638s under drain 112100. Same post-cluster buffer as prior passes. Wall expires 18:22Z. 48021+48055 holds. Lease expires ~16:49Z.

## GROUND-TRUTH (2026-08-17T12:37Z)

- Roads 98/254. 48201 Harris retry extracting 15 min (started 12:22:52Z). kept=64000 last flushed 12:24:09Z; python extract CPU 864s under drain 112100. Same dense-cluster-then-buffer pattern. Wall expires 18:22Z. 48021+48055 holds. Lease expires ~16:33Z.

## GROUND-TRUTH (2026-08-17T12:23Z)

- Roads 98/254. Raised WALL_MS 240 → 360. Killed drain 101448 at 209 min Harris extract (kept=426000, highway_seen=3626932, 0 atoms written) before 12:53Z fail. Restarted start_roads_retry.cmd. New drain PID 112100. 48201 retry started 12:22:52Z. Wall expires 18:22Z. 48021+48055 still the only fails. Heartbeat PID 22096 live. Do not second-writer. Do not CAD.

## DEAD-END (2026-08-17T12:23Z)

- 240-min roads wall is too short for Harris-class PBF extract. Same class as 20/60/120. Kill before fail, raise wall, retry. Current wall is 360 min.

## GROUND-TRUTH (2026-08-17T12:07Z)

- Roads 98/254. 48201 Harris retry extracting 194 min (started 08:53:20Z). kept=394000 highway_seen=3402932. Apply not started. Log LastWrite 12:04:20Z. Python extract CPU 11477s under drain 101448. Wall expires 12:53Z (~46 min). Raise-wall decision 12:22Z if still extracting. 48021+48055 holds. Lease expires ~16:01Z.

## GROUND-TRUTH (2026-08-17T11:52Z)

- Roads 98/254. 48201 Harris retry extracting 179 min (started 08:53:20Z). kept=366000 highway_seen=3082098. Past Dallas 322k. Apply not started. Log LastWrite 11:52:10Z. Python extract CPU 10622s under drain 101448. Wall expires 12:53Z (~61 min). Watch 12:22Z for wall raise if still extracting. 48021+48055 holds. Lease expires ~15:45Z.

## GROUND-TRUTH (2026-08-17T11:37Z)

- Roads 98/254. 48201 Harris retry extracting 164 min (started 08:53:20Z). kept=316000 highway_seen=2587602. Near Dallas 322k. Apply not started. Log LastWrite 11:36:35Z. Python extract CPU 9704s under drain 101448. Wall expires 12:53Z (~76 min). 48021+48055 holds. Lease expires ~15:37Z.

## GROUND-TRUTH (2026-08-17T11:22Z)

- Roads 98/254. 48201 Harris retry extracting 149 min (started 08:53:20Z). kept=284000 highway_seen=2273093. Log LastWrite 11:22:06Z. Python extract CPU 8806s under drain 101448. Wall expires 12:53Z. 48021+48055 holds. Lease expires ~15:21Z.

## GROUND-TRUTH (2026-08-17T11:07Z)

- Roads 98/254. 48201 Harris retry extracting 134 min (started 08:53:20Z). kept=262000 highway_seen=2010735. Log LastWrite 11:05:45Z. Python extract CPU 7954s under drain 101448. Wall expires 12:53Z. 48021+48055 holds. Lease expires ~15:05Z.

## GROUND-TRUTH (2026-08-17T10:52Z)

- Roads 98/254. 48201 Harris retry extracting 119 min (started 08:53:20Z). kept=236000 highway_seen=1840595. Log LastWrite 10:51:47Z. Python extract CPU 7115s under drain 101448. Wall expires 12:53Z. 48021+48055 holds. Lease expires ~14:49Z.

## GROUND-TRUTH (2026-08-17T10:37Z)

- Roads 98/254. 48201 Harris retry extracting 104 min (started 08:53:20Z). kept=204000 highway_seen=1593997. Log LastWrite 10:36:45Z. Python extract CPU 6217s under drain 101448. Wall expires 12:53Z. 48021+48055 holds. Lease expires ~14:33Z.

## GROUND-TRUTH (2026-08-17T10:22Z)

- Roads 98/254. 48201 Harris retry extracting 89 min (started 08:53:20Z). kept=168000 highway_seen=1357328. Past first-pass kill (84 min / 162k). Log LastWrite 10:22:07Z. Python extract CPU 5320s under drain 101448. Wall expires 12:53Z. 48021+48055 holds. Lease expires ~14:17Z.

## GROUND-TRUTH (2026-08-17T10:07Z)

- Roads 98/254. 48201 Harris retry extracting 74 min (started 08:53:20Z). kept=134000 highway_seen=1226510. Log LastWrite 10:06:53Z. Python extract CPU 4425s under drain 101448. Wall expires 12:53Z. Tracking first pass (killed at 84 min / 162k). 48021+48055 holds. Lease expires ~14:00Z.

## GROUND-TRUTH (2026-08-17T09:52Z)

- Roads 98/254. 48201 Harris retry extracting 59 min (started 08:53:20Z). kept=106000 highway_seen=1102301. Log LastWrite 09:52:04Z. Python extract CPU 3525s under drain 101448. Wall expires 12:53Z. 48021+48055 holds. Lease expires ~13:44Z.

## GROUND-TRUTH (2026-08-17T09:37Z)

- Roads 98/254. 48201 Harris retry extracting 44 min (started 08:53:20Z). kept=82000 highway_seen=959713. Log LastWrite 09:36:14Z. Python extract CPU 2629s under drain 101448. Wall expires 12:53Z. 48021+48055 holds. Lease expires ~13:36Z.

## GROUND-TRUTH (2026-08-17T09:22Z)

- Roads 98/254. 48201 Harris retry extracting 29 min (started 08:53:20Z). kept=64000 last flushed 08:54:36Z; python extract CPU 1731s under drain 101448. Same post-cluster buffer as first pass. Wall expires 12:53Z. 48021+48055 holds. Lease expires ~13:20Z.

## GROUND-TRUTH (2026-08-17T09:07Z)

- Roads 98/254. 48201 Harris retry extracting 14 min (started 08:53:20Z). kept=64000 last flushed 08:54:36Z; python extract CPU 834s under drain 101448. Same dense-cluster-then-buffer pattern as first pass. Wall expires 12:53Z. 48021+48055 holds. Lease expires ~13:04Z.

## GROUND-TRUTH (2026-08-17T08:53Z)

- Roads 98/254. Raised WALL_MS 120 → 240. Killed drain 35584 at 84 min Harris extract (kept=162000, 0 atoms written) before 09:28Z fail. Restarted start_roads_retry.cmd. New drain PID 101448. 48201 retry started 08:53:20Z. Wall expires 12:53Z. 48021+48055 still the only fails. Heartbeat PID 22096 live. Do not second-writer. Do not CAD.

## DEAD-END (2026-08-17T08:53Z)

- 120-min roads wall is too short for Harris-class PBF extract. Same class as 20-min Bexar and 60-min Brazoria. Kill before fail, raise wall, retry. Current wall is 240 min.

## GROUND-TRUTH (2026-08-17T08:37Z)

- Roads 98/254. 48201 Harris extracting 69 min (started 07:28:07Z). kept=122000 highway_seen=1187649. Apply not started. Python extract CPU 4138s under drain 35584. Wall expires 09:28Z (~51 min). Watch 08:52Z for wall raise if still extracting. 48021+48055 holds. Lease expires ~12:32Z.

## GROUND-TRUTH (2026-08-17T08:22Z)

- Roads 98/254. 48201 Harris extracting 54 min (started 07:28:07Z). kept=98000 highway_seen=1045207. Log LastWrite 08:21:44Z. Python extract live under drain 35584. Wall expires 09:28Z. 48021+48055 holds. Lease expires ~12:16Z.

## GROUND-TRUTH (2026-08-17T08:07Z)

- Roads 98/254. 48201 Harris extracting 39 min (started 07:28:07Z). kept=74000 highway_seen=922666. Log LastWrite 08:05:57Z. Python extract live under drain 35584. Wall expires 09:28Z. 48021+48055 holds. Lease expires ~12:00Z.

## GROUND-TRUTH (2026-08-17T07:52Z)

- Roads 98/254. 48201 Harris still extracting (started 07:28:07Z). Last log line kept=64000 at 07:29:22Z; python extract still live. Wall expires 09:28Z. Drain PID 35584. 48021+48055 holds. Lease expires ~11:44Z.

## GROUND-TRUTH (2026-08-17T07:37Z)

- Roads 98/254. 48201 Harris extracting since 07:28:07Z. 64k ways at 9 min, highway_seen 342k (dense). Wall expires 09:28Z. Also 48197 1986, 48199 7631. Drain PID 35584. 48021+48055 holds. Lease expires ~11:36Z.

## GROUND-TRUTH (2026-08-17T07:22Z)

- Roads 96/254. This interval: 48187 24875 / 34.8 min, 48189 5149, 48191 2093, 48193 2397, 48195 1404. Current 48197 since 07:21:24Z. Harris 48201 two counties out. Drain PID 35584. 48021+48055 holds. Lease expires ~11:20Z.

## GROUND-TRUTH (2026-08-17T07:07Z)

- Roads 91/254. 48187 still extracting (started 06:39:58Z). 20k ways at 27 min, highway_seen 2.41M. Wall expires 08:39Z. Drain PID 35584. 48021+48055 holds. Lease expires ~11:04Z.

## GROUND-TRUTH (2026-08-17T06:52Z)

- Roads 91/254. 48185 6182. Current 48187 extracting since 06:39:58Z, 8k ways at 13 min. Harris 48201 about seven counties out. Drain PID 35584. 48021+48055 holds. Lease expires ~10:48Z.

## GROUND-TRUTH (2026-08-17T06:37Z)

- Roads 90/254. This interval: 48175 1595, 48177 5066, 48179 2866, 48181 24576, 48183 18880. Current 48185 since 06:37:13Z. Harris 48201 about eight counties out. Drain PID 35584. 48021+48055 holds. Lease expires ~10:32Z.

## GROUND-TRUTH (2026-08-17T06:22Z)

- Roads 85/254. This interval: 48167 Galveston 40563, 48169 2992, 48171 6741, 48173 4457. Current 48175 since 06:21:09Z. Drain PID 35584. 48021+48055 holds. Lease expires ~10:16Z.

## GROUND-TRUTH (2026-08-17T06:07Z)

- Roads 81/254. 48157 Fort Bend landed 93,341 / 0 VF / 53.1 min, 0 collisions. 120-min wall paid. Also 48159 2213, 48161 4104, 48163 4506, 48165 16809. Current 48167 Galveston extracting since 06:02:24Z. Drain PID 35584. 48021+48055 holds. Lease expires ~10:00Z.

## GROUND-TRUTH (2026-08-17T05:52Z)

- Roads 76/254. 48157 extract closed: 93,341 highways. Apply writing 45k/93k at snapshot. Drain PID 35584. Wall expires 07:00Z. 48021+48055 holds. Lease expires ~09:44Z.

## GROUND-TRUTH (2026-08-17T05:37Z)

- Roads 76/254. 48157 Fort Bend still extracting (started 05:00:20Z). 56k ways at 37 min, highway_seen 2.36M. Wall expires 07:00Z. Drain PID 35584. 48021+48055 holds. Lease expires ~09:36Z.

## GROUND-TRUTH (2026-08-17T05:22Z)

- Roads 76/254. 48157 Fort Bend still extracting (started 05:00:20Z). 28k ways at 22 min. Wall expires 07:00Z. Drain PID 35584. 48021+48055 holds. Lease expires ~09:20Z.

## GROUND-TRUTH (2026-08-17T05:07Z)

- Roads 76/254. This interval: 48149 8624, 48151 2947, 48153 3460, 48155 1424. Current 48157 Fort Bend extracting since 05:00:20Z (roads, not pipeline hold). Wall expires 07:00Z. Drain PID 35584. 48021+48055 holds. Lease expires ~09:04Z.

## GROUND-TRUTH (2026-08-17T04:52Z)

- Roads 72/254. This interval: 48139 36226, 48141 El Paso 79991, 48143 10740, 48145 3427, 48147 7948. Current 48149 since 04:50:59Z. Drain PID 35584. 48021+48055 holds. Lease expires ~08:48Z.

## GROUND-TRUTH (2026-08-17T04:37Z)

- Roads 67/254. This interval: 48125 1717, 48127 3735, 48129 2304, 48131 1915, 48133 4208, 48135 18349, 48137 2880. Current 48139 since 04:35:01Z. Drain PID 35584. 48021+48055 holds. Lease expires ~08:32Z.

## GROUND-TRUTH (2026-08-17T04:22Z)

- Roads 60/254. This interval: 48117 2313, 48119 1191, 48121 Denton 119629, 48123 4544. Current 48125 since 04:22:02Z. Dallas 321958 still headline. Drain PID 35584. 48021+48055 holds. Lease expires ~08:16Z.

## GROUND-TRUTH (2026-08-17T04:07Z)

- Roads 56/254. 48113 Dallas landed 321,958 / 0 VF / 9.8 min, 0 collisions. Also 48109 4677, 48111 1511, 48115 3310. Current 48117 since 04:06:44Z. Drain PID 35584. 48021+48055 holds. Lease expires ~08:00Z.

## GROUND-TRUTH (2026-08-17T03:52Z)

- Roads 52/254. This interval: 48099 9523, 48101 3807, 48103 3534, 48105 4764, 48107 2509. Current 48109 since 03:51:18Z. Dallas 48113 next metro. Drain PID 35584. 48021+48055 holds. Lease expires ~07:44Z.

## GROUND-TRUTH (2026-08-17T03:37Z)

- Roads 47/254. This interval: 48091 33622 / 21.1 min, 48093 3024, 48095 2210, 48097 14634. Current 48099 extracting since 03:32:29Z. Drain PID 35584. 48021+48055 holds. Lease expires ~07:36Z.

## GROUND-TRUTH (2026-08-17T03:22Z)

- Roads 43/254. 48091 extracting since 03:04:22Z. 32k ways at 18 min, highway_seen 3.43M. Wall expires 05:04Z. Drain PID 35584. 48021+48055 holds. Lease expires ~07:20Z.

## GROUND-TRUTH (2026-08-17T03:07Z)

- Roads 43/254. 48085 Collin landed 147,439 / 0 VF / 6.5 min, 0 collisions. 48087 1924, 48089 6892. Current 48091 extracting since 03:04:22Z. Drain PID 35584. 48021+48055 holds. Lease expires ~07:04Z.

## GROUND-TRUTH (2026-08-17T02:52Z)

- Roads 40/254. This interval: 48073 6431, 48075 2087, 48077 2789, 48079 1495, 48081 2892, 48083 4652. Current 48085 Collin extracting 146k ways, highway_seen 3.97M (near PBF end). Started 02:49:14Z. Wall expires 04:49Z. Drain PID 35584. 48021+48055 holds. Lease expires ~06:48Z.

## GROUND-TRUTH (2026-08-17T02:37Z)

- Roads 34/254. 48069 2426, 48071 8554. Current 48073 extracting since 02:33:46Z. 48021+48055 collision holds. Drain PID 35584. Lease expires ~06:32Z.

## GROUND-TRUTH (2026-08-17T02:22Z)

- Roads 32/254. 48055 Caldwell fail-closed: 1887 collisions with road-intake-caldwell-osm, wrote 10506, code 1. Same class as 48021. Drain kept going. This interval: 48057 2935, 48059 4459, 48061 34493, 48063 1604, 48065 3320, 48067 4776. Current 48069. Drain PID 35584. Lease expires ~06:16Z.

## DEAD-END

- PBF re-apply of 48055. Prior road-node atoms from road-intake-caldwell-osm are protected. Fail-closed is correct. Needs a migration, not another extract.

## GROUND-TRUTH (2026-08-17T02:07Z)

- Roads 26/254. 48053 landed 13,898 / 15.6 min. Current 48055 Caldwell extracting 8k ways since 01:57:23Z. CAPCOG; watch collision like 48021, do not halt. Drain PID 35584. Lease expires ~06:00Z.

## GROUND-TRUTH (2026-08-17T01:52Z)

- Roads 25/254. 48051 landed 4,171 / 22.6 min. Current 48053 extracting 12k ways since 01:41:46Z. Drain PID 35584. 48021 collision hold. Lease expires ~05:52Z.

## GROUND-TRUTH (2026-08-17T01:37Z)

- Roads 24/254. 48051 extracting since 01:19:12Z. 2k ways logged at 18 min, highway_seen 405k (PBF scan early). Drain PID 35584. Wall expires 03:19Z. 48021 collision hold. Lease expires ~05:36Z.

## GROUND-TRUTH (2026-08-17T01:22Z)

- Roads 24/254. This interval: 48041 25747, 48043 7640, 48045 2114, 48047 2185, 48049 5634. Current 48051 extracting since 01:19:12Z. Drain PID 35584. 48021 collision hold. Lease expires ~05:20Z.

## GROUND-TRUTH (2026-08-17T01:07Z)

- Roads 19/254. 48039 Brazoria landed 45,723 / 0 VF / 52.5 min. 120-min wall paid (first try would have died at 60). Current 48041 extracting 22k ways since 01:00:17Z. Drain PID 35584. 48021 collision hold. Lease expires ~05:04Z.

## GROUND-TRUTH (2026-08-17T00:52Z)

- Roads 18/254. 48039 Brazoria still extracting (started 00:07:49Z). 40k ways at 44 min. 120-min wall expires 02:07Z. Drain PID 35584. 48021 collision hold. Lease expires ~04:47Z.

## GROUND-TRUTH (2026-08-17T00:37Z)

- Roads 18/254. 48039 Brazoria still extracting (started 00:07:49Z). 18k ways at 29 min. 120-min wall expires 02:07Z. Drain PID 35584. 48021 collision hold. Lease expires ~04:31Z.

## GROUND-TRUTH (2026-08-17T00:22Z)

- Roads 18/254. 48039 Brazoria retry still extracting (started 00:07:49Z). 10k ways at 14 min. 120-min wall expires 02:07Z. Drain PID 35584. 48021 collision hold. Lease expires ~04:15Z.

## GROUND-TRUTH (2026-08-17T00:07Z)

- Roads 18/254. Killed 48039 at 44 min / 44k kept before 60-min wall. Restarted drain with 120-min wall. 48039 retrying since 00:07:49Z. Drain PID 35584. 48021 collision hold. Lease expires ~03:59Z.

## DEAD-END

- 60-min roads wall on Brazoria-class extracts. 44k ways in 44 min, still streaming, 0 atoms. Same waste class as the 20-min Bexar wall. Raise before the kill, then retry.

## GROUND-TRUTH (2026-08-16T23:52Z)

- Roads 18/254. 48039 Brazoria still extracting (started 23:23:17Z). 24k ways at 29 min. Wall expires 00:23Z. Drain PID 98684. 48021 collision hold. Lease expires ~03:51Z.

## GROUND-TRUTH (2026-08-16T23:37Z)

- Roads 18/254. 48037 landed 12,091. Current 48039 Brazoria extracting since 23:23:17Z, 10k ways at 14 min, wall expires 00:23Z. Roads rail, not the pipeline hold. Drain PID 98684. 48021 collision hold. Lease expires ~03:35Z.

## GROUND-TRUTH (2026-08-16T23:22Z)

- Roads 17/254. 48029 Bexar landed 208,284 / 0 VF / 33.7 min (2 legacy-band collision candidates, skippedProtected=0, code 0). 48031 6703, 48033 2349, 48035 5298. Current 48037 extracting. Drain PID 98684. 48021 collision hold. Lease expires ~03:19Z.

## GROUND-TRUTH (2026-08-16T23:07Z)

- Roads 13/254. 48029 extract closed: 208,284 highways. Apply writing 15k/208k at snapshot. Drain PID 98684. Wall expires 23:37Z. 48021 collision hold. Lease expires ~03:03Z. 60-min wall paid: extract alone was ~29 min.

## GROUND-TRUTH (2026-08-16T22:52Z)

- Roads 13/254. 48029 Bexar still extracting (started 22:37:59Z). 94k ways at 14 min. 60-min wall expires 23:37Z. Drain PID 98684. 48021 collision hold. Lease expires ~02:47Z.

## GROUND-TRUTH (2026-08-16T22:37Z)

- Roads 13/254. Killed 48029 at 18 min / 106k kept before 20-min wall. Restarted drain with 60-min wall. 48029 retrying since 22:37:59Z. 48021 still collision hold. Lease expires ~02:31Z.

## DEAD-END

- 20-min roads wall on Bexar-class extracts. 106k ways in 18 min, still streaming, 0 atoms. Same waste class as sitting on 48039. Raise wall before the kill, then retry.

## GROUND-TRUTH (2026-08-16T22:22Z)

- Roads 13/254. 48021 failed collision-fail-closed 7004 (overpass/elgin adapters). 48023 1891, 48025 3980, 48027 43956. Current 48029 extracting. Drain PID 93996. Lease expires ~02:15Z.

## DEAD-END

- PBF re-apply of 48021. Prior road-node atoms from road-intake-osm-overpass / road-intake-elgin-osm are protected. Fail-closed is correct. Needs a migration, not another extract.

## GROUND-TRUTH (2026-08-16T22:07Z)

- Roads 10/254, 0 fails. This interval: 48015 7830, 48017 1410, 48019 6968. Current 48021 extracting. Drain PID 93996. Lease expires ~01:59Z.

## GROUND-TRUTH (2026-08-16T21:52Z)

- Roads 7/254, 0 fails. This interval: 48005 8424, 48007 3258, 48009 2865, 48011 1280, 48013 11964. Current 48015. Drain PID 93996. Lease expires ~01:51Z.

## GROUND-TRUTH (2026-08-16T21:37Z)

- Roads retry 2/254. 48001 7682 / 424s. 48003 4686 / 98s. Current 48005 extracting. Drain PID 93996. Lease expires ~01:35Z.

## GROUND-TRUTH (2026-08-16T21:22Z)

- 48039 v2: durable-batch 347093ms / 2983 hits. Worse than v1. Segmentize reversed. 48039+48157 honest hold. Roads retry started with pinned PBF. Lease expires ~01:19Z.

## DEAD-END

- ST_Segmentize(500m)+ST_Subdivide(8) on 48039. Hits 872 to 2983, time 305s to 347s. Exploding lines multiplied geography ST_DWithin casts. Reverse.

## GROUND-TRUTH (2026-08-16T21:07Z)

- 48039 v1 ST_Subdivide-only: durable-batch 0-10 of 10, 872 hits, 305418ms. Code 0, wall 327s. Missed 3-min gate. v2 started: ST_Segmentize 500m + ST_Subdivide 8. Lease expires ~01:03Z.

## DEAD-END

- ST_Subdivide(geom, 256) alone on 48039. 2x faster (591s to 305s) but still 5 min. Long 2-vertex transmission lines do not split on vertex count.

## GROUND-TRUTH (2026-08-16T20:52Z)

- Metro queue closed 20:40:50Z. 48491 landed 282569 / 0 VF / 1447s. Landed rows 62 (keyset+angelina+metros). Holds: 48039 skip, 48157 fail. Drain dead. 10-pipe ST_Subdivide proof started on 48039. Lease expires ~00:47Z.

## GROUND-TRUTH (2026-08-16T20:37Z)

- Metro 49/52. 48491 plan closed 225/225; writing 30k/282569. Two hot batches 268s and 254s. Drain PID 101216. Lease expires ~00:31Z. Segmentize waits until 48491 lands.

## GROUND-TRUTH (2026-08-16T20:22Z)

- Metro 49/52. Travis 48453 landed 380917 / 0 VF / 448s. 48479 98045, 48485 57417. Current 48491 (last queue) 90/225. Held 48039+48157. Drain PID 101216. Lease expires ~00:15Z.

## GROUND-TRUTH (2026-08-16T20:07Z)

- Metro 46/52. Tarrant 48439 landed 677252 / 0 VF / 806s. 48441 67770, 48451 58555. Current Travis 48453 140/510 (829k parcels). Drain PID 101216. Lease expires ~23:59Z.

## GROUND-TRUTH (2026-08-16T19:52Z)

- Metro 43/52. This interval: 48373 57393, 48375 53482, 48381 64819, 48397 52420, 48409 37762, 48423 125400. Current Tarrant 48439 1960/4005 at 5 min (757k parcels). Drain PID 101216. Lease expires ~23:51Z.

## GROUND-TRUTH (2026-08-16T19:37Z)

- Metro 37/52. 48339 landed 316270 / 1079s. This interval also 48355 146338, 48361 45892, 48367 92582. Current 48373 1590/1718. Drain PID 101216. Lease expires ~23:35Z.

## GROUND-TRUTH (2026-08-16T19:22Z)

- Metro 33/52. 48329 landed 72126 / 307s. Current 48339 1380/1938 at 14 min. Hot batch 250-260 = 455s (cleared). Drain PID 101216. Lease expires ~23:19Z.

## GROUND-TRUTH (2026-08-16T19:07Z)

- Metro 32/52. This interval: 48257 93291, 48291 113163, 48303 135112, 48309 114254. Current 48329 plan 11850/11996. Drain PID 101216. Lease expires ~23:03Z.

## GROUND-TRUTH (2026-08-16T18:52Z)

- Metro 28/52. 48245 landed 121967 / 970s. 48251 landed 100603 / 212s. Current 48257 writing 75k/93k. Drain PID 101216. Lease expires ~22:47Z.

## GROUND-TRUTH (2026-08-16T18:37Z)

- Metro 26/52. This interval landed 48209 116420, 48213 86765, 48215 325956, 48221 50875, 48231 69542. Current 48245 490/3980 at 6 min. Drain PID 101216. Lease expires ~22:31Z.

## GROUND-TRUTH (2026-08-16T18:22Z)

- Harris 48201 LANDED 18:19:34Z. 1523640 written / verified, 0 VF. Wall 4076s (plan 3370, write 468, verify 192). Metro 21/52. Current 48209 writing. Drain PID 101216. Lease expires ~22:15Z.

## GROUND-TRUTH (2026-08-16T18:07Z)

- Harris 48201 plan 8450/8475 at ~55 min. Write next. Wall 18:41Z (34 min left). Tail hot batch 8340-8350 = 118s. Metro 19/52. Drain PID 101216. Lease expires ~21:59Z.

## GROUND-TRUTH (2026-08-16T17:52Z)

- Harris 48201 still planning. 5520/8475 at ~41 min (65%). Skip gate cleared. Warmest new batch 4240-4250 = 219s. Plan ~63 min + write. Wall 18:41Z. Metro 19/52. Drain PID 101216. Lease expires ~21:51Z.

## GROUND-TRUTH (2026-08-16T17:37Z)

- Harris 48201 still planning. 3430/8475 at ~26 min. Hot batch 2880-2890 = 429856ms / 4273 hits (cleared). Plan ~65 min + write. Wall 18:41Z. Metro 19/52. Drain PID 101216. Lease expires ~21:35Z.

## GROUND-TRUTH (2026-08-16T17:22Z)

- Harris 48201 live since 17:11:38Z. 1523641 features / 8475 pipes. 1530/8475 in ~10 min. Batches 125-4419ms. Projected plan ~55 min + ~1.5M write. Wall 18:41Z. Metro 19/52. Drain PID 101216. Lease expires ~21:19Z.

## GROUND-TRUTH (2026-08-16T17:07Z)

- 48157 failed 16:58:48Z wall 1190s, statement_timeout on batch after 1570-1580. 0 written. 48167 and 48181 landed. Current 48183 2110/9997 pipes, batches ~110ms. Metro 17/52. Held: 48039, 48157. Drain PID 101216. Lease expires ~21:03Z.

## DEAD-END

- A county can die on the last 30 pipes after 19 min of good batches. 600s statement_timeout is per batch; one long line still aborts the whole plan. Segmentize, do not raise timeout first.

## GROUND-TRUTH (2026-08-16T16:52Z)

- Metro 15/52. El Paso 48141 landed 396733 / 308s. Current 48157 Fort Bend plan 1570/1609 pipes at ~13 min (one 164s hot batch). Then 4 counties then Harris. 48039 held. Drain PID 101216. Lease expires ~20:47Z.

## GROUND-TRUTH (2026-08-16T16:37Z)

- Metro 14/52. Dallas 48113 landed 693556 / 364s. 48121 351797/312s, 48135 3791/195s, 48139 98150/95s. Current 48141 El Paso since 16:33:50Z. 48039 held. Drain PID 101216. Lease expires ~20:31Z.

## GROUND-TRUTH (2026-08-16T16:22Z)

- Metro 10/52. This interval landed 48041 74563/91s, 48053 49242/115s, 48061 175409/98s, 48085 387333/217s, 48091 103206/77s. Dallas 48113 writing 693556 (530k+). 48039 still held. Drain PID 101216. Lease expires ~20:15Z.

## GROUND-TRUTH (2026-08-16T16:07Z)

- 48039 killed and skipped: 11 durable-batch lines in 16 min, first 591536ms / 819 hits, later 6-120s. 4721 pipes. Drain restarted 16:07:45Z PID 101216 on 48041 (2245 pipes, first batches 118-186ms). Metro 5/52 + 48039 held. Lease expires ~20:07Z.

## DEAD-END

- Letting 48039 sit on the 90-min wall. At 2.3% in 16 min it would need hours. Skip and segmentize; keep the other metros moving.

## GROUND-TRUTH (2026-08-16T15:52Z)

- Bexar 48029 landed 15:49:34Z: 703257 atoms, 0 VF, wall 859s. 48037 landed 65s / 53173. Current 48039 since 15:50:40Z, 275131 features / 4721 pipes. Metro 5/52. Drain PID 97620. Lease expires ~19:51Z.

## GROUND-TRUTH (2026-08-16T15:37Z)

- Keyset 12/12 closed 15:29Z. Metro phase live: 48021 and 48027 landed. Current 48029 Bexar writing 703257 (55k in at last read). Plan was 416 pipes in ~2 min. Drain PID 97620. 3/52 metros. Lease expires ~19:34Z.

## GROUND-TRUTH (2026-08-16T15:22Z)

- 48351 retry 41/44 batches (410/435 pipes) at ~44 min elapsed. Last batch 400-410: 1.9s / 215 hits. Write next. Drain PID 97620. Lease expires ~19:18Z.

## GROUND-TRUTH (2026-08-16T15:07Z)

- 48351 retry 26/44 batches (260/435 pipes) in 30 min. Last batch 250-260: 89s / 3352 hits. On pace to land before 16:07Z wall. Drain PID 97620. Lease expires ~19:02Z.

## GROUND-TRUTH (2026-08-16T14:52Z)

- 48351 retry live PID 97620. 12/44 batches in 15 min (last 110-120: 88s / 2737 hits). Same heat as first pass. On pace for ~55 min plan under 90-min wall. 9/12 keyset landed. Lease expires ~18:46Z.

## GROUND-TRUTH (2026-08-16T14:37Z)

- 48351 first pass: 16 durable-batch lines in 18 min (hottest 215s / 2059 hits). Projected ~50 min plan vs 45-min wall. Killed parent; child died with it. Drain restarted 14:37:52Z PID 97620 with 90-min wall. 9/12 keyset still landed. Lease expires ~18:30Z.

## LESSON

- A progressing durable-batch county can still miss a 45-min wall when mean batch is ~60s. Raise the wall from measured batch rate, not from Angelina's 13 min.

## GROUND-TRUTH (2026-08-16T14:22Z)

- Keyset retries 9/12 landed, 0 fails. New: 48161 23705/221s, 48227 19833/140s, 48283 7945/214s, 48331 20538/154s, 48347 36175/175s. Current 48351 since 14:18:59Z, 435 pipes, first durable-batch 105s. Drain PID 84704. Lease expires ~18:14Z.

## GROUND-TRUTH (2026-08-16T14:07Z)

- Keyset durable-gist landing: 48035 19508/114s, 48073 44475/143s, 48105 8967/203s, 48123 20750/228s. Current 48161 since 14:03:55Z, 8067 pipes, batches mostly 100-150ms (one 35s hot batch). Drain PID 84704. 0 fails. Lease expires ~18:06Z.

## GROUND-TRUTH (2026-08-16T13:52Z)

- Keyset geom backfill closed 13:47:14Z: 12/12 code 0. 48035 parcel_geom 27224 / left 0.
- Metro return restarted 13:52:27Z PID 84704. 48035 on durable-gist: first two batches 20182ms/956 hits and 4694ms/658 hits of 98 pipes. Lease expires ~17:50Z.

## GROUND-TRUTH (2026-08-16T13:38Z)

- 48035 apply failed 13:33Z wall 603s, code 1, statement_timeout. Shape was keyset-parcel-batch (19975 features < 50k). Drain killed during 48073 (46761 features / 1457 pipes, same path).
- Planner patched: durable-gist whenever `countyDurableGeomReady`, not only above the metro gate.
- Keyset geom backfill started 13:38:24Z PID 97272, current 48035. Metro return paused; 48035 removed from failed so it retries after geom.

## DEAD-END

- Retrying sub-50k keyset timeouts with `--pipeline-batch=10` but no geom backfill. The batch flag only applies to durable-gist. Those counties still run one keyset statement and die at 600s.

## GROUND-TRUTH (2026-08-16T13:22Z)

- Angelina apply landed 13:20:38Z: 54182 written/verified, 0 VF, wall 780s, planSql 702s, write 70s, 7319 near / 46863 outside.
- Metro return drain started 13:22:59Z PID 76672. Phase keyset, current 48035 (27k parcels / 98 pipes). 12 keyset + 51 metro queued. 48129 skipped. Lease expires ~17:18Z.

## GROUND-TRUTH (2026-08-16T13:07Z)

- 200-pipe proof closed 13:02:50Z: 294s, code 0, 20 durable-batch lines. Hot batch 10-20 = 93089ms / 749 hits. Near atoms in dry-run rose from 147 (10 pipes) to 3006 (200 pipes).
- Angelina apply started 13:07:38Z PID 85756, `--apply --pipeline-batch=10`, 45-min wall. First batch 3718ms / 290 hits / of 1030. Lease expires ~17:02Z.

## GROUND-TRUTH (2026-08-16T12:54Z)

- Footprints closed 12:43:34Z: 174 landed, 0 fails. Roads all failed in ~1s: `ROAD_NODE_COUNTY_PATH=1 required`. Sequencer had `ROAD_NODE_PATH=1`. Fixed on disk.
- Old sequencer 86380 started CAD 48439 at 12:46Z. Killed without waiting for metro. CAD child died; Tarrant stopped at 330000/1603024.
- 10-pipe Angelina proof landed 12:54:00Z: `durable-batch` 10/10, 290 hits, 5283ms, wall 12479ms, code 0. Segmentize not needed. 200-pipe scale next.
- Lease heartbeat 22096 expires ~16:46Z.

## DEAD-END

- Scaling the 10-pipe proof as `--pipeline-batch=200 --pipeline-limit=200` (one 200-pipe statement). No `durable-batch` line after 2 min. Killed. Restarted as `--pipeline-batch=10 --pipeline-limit=200`. First 10-of-200 batch printed in 3416ms.

## OPEN

- Roads 98/254. 48201 Harris extracting (120-min wall expires 09:28Z). Hays 48209 likely CAPCOG collision after Harris. Tarrant 48439 still ahead. 48021+48055 holds. CAD after roads.
- Roads retry with `ROAD_NODE_COUNTY_PATH=1` after metro.
- CAD 48439 resume + 48113 + 48135 after roads.
- 48129 needs an honest-absence atom later, not a retry of the join.

## DEAD-END

- Treating a silent 12-min 48005 apply as "TEMP/GiST is still slow" without a start log. The hang was the roster scan.
- Retrying 48005 apply on the same geography-hot LATERAL. 12-min wall is the signal; resume keyset.

## DEAD-END

- Treating a silent 12-min 48005 apply as "TEMP/GiST is still slow" without a start log. The hang was the roster scan.
- Resume leftover keyset counties (`start_remaining_ingest.cmd`).
- Wells / footprints / roads, CAD tail, gate-grade.
- Do not merge #345/#344 until those gates run.

## LESSON

- A TEMP+GiST plan on a postgres.js pool with max>1 will CREATE on one session and later INDEX/SELECT on another. Fail-closed as "relation does not exist" after a long load, not as a hang. Pin with reserve().
