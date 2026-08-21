# L16 drain custodian scratch

## GROUND-TRUTH
- 2026-08-13T18:32Z rogue sweep: 0 processes matching special.district|rail_apply|solo_seq|a2_staged|write-*-county|writePropertyAtoms
- L1 close CLOSED_PARTIAL; slot released to L16 2026-08-13T17:56:09.291Z
- L15 HONESTLY_PARTIAL: rail/wells/pipelines/ector READY; flood metros 0 landed; flood remainder 1/77; roads IN_FLIGHT
- origin/main at CP1: c50085c (#336 TEMP pool max=1)

## GROUND-TRUTH
- 2026-08-13T18:32Z rogue sweep: 0 matching processes
- 2026-08-13T18:37:49Z eng #337 CI conclusion success (run 31731535918); merged ea043e4
- 2026-08-13T18:39:57Z migration 009 applied hauska_mcp; table atoms_bulk_writer_lease present
- 2026-08-13T18:40:03Z lease TAKEN holder=L16 expires 19:40:03Z
- 2026-08-13T18:43:01Z eng #338 merged e15f7cb (flood --from-plan)
- 2026-08-13T18:42:48Z leg0 48003 landed delete 10470 write 15828 VF 0

## GROUND-TRUTH
- 2026-08-13T19:09:37.158Z leg 0 COMPLETE 81/81 landed, 0 failed, 0 VF. Wall ~27 min (18:42:32Z-19:09:37Z).
- 2026-08-13T19:13:45.337Z lease heartbeat holder=L16 expires 20:13:45.337Z
- Named data: 48393 Roberts wrote 4 (empty district index); 48395 Reagan wrote 0 after delete 16935 (no txgio parcels)
- 2026-08-13T19:21:14Z store-truth reconcile: observed 252, verifiedOk 252, residue 0, totalAtoms 20844038. Named drop 48395 Reagan. Close `_inbox/2026-08-13_l16_leg0_sd_residue_close.json`. CP2 PASS.

## GROUND-TRUTH
- 2026-08-13T21:34:30Z 48395 Robertson (NOT Reagan 48383): txgio_parcel 24016 rows / 16935 features, usable_prop_id=0 (all prop_id NULL), tx_special_district=0, leftover SD atoms=0 before coverage write. True-geom emitted nothing because SQL usable-key filter, not empty table. Honest atom 48395:_county_coverage sdfact_d05a889cf48b761d VF ok. Denom stays 253.

## GROUND-TRUTH
- 2026-08-13T21:34:25Z lease heartbeat L16 expires 22:34:25Z
- Rail runner PID 59460 still running; 77 landed / current 48157 / ~4.46M atoms / VF 0
- eng #339 merged e65baf9 CI conclusion success (run 31746346361). Drain-tree pull queued until rail writer is not live (also picks up #338).

## GROUND-TRUTH
- 2026-08-14T00:07:11Z rail runner HALT 48393 Roberts nearTrueRate=1 on parcelsRead=2 after skippedUnusablePropId=2572 (roster bad_rate 0.9992, CROSSWALK_HOLD). Write of 2 atoms VF 0 already done. False halt, not classifier defect.
- 2026-08-14T00:08:50Z drain tree fast-forward ea043e4..e65baf9 (#338+#339). Halt floor parcelsRead>=100. Runner resumed. Lease heartbeat expires 01:08:50Z.

## GROUND-TRUTH
- 2026-08-14T01:34:26Z leg 1 rail COMPLETE. 252 landed + 2 skipped = 254. VF 0. atomsWritten 13059613. Close `_inbox/2026-08-13_l16_leg1_rail_corridor_close.json`.

## GROUND-TRUTH
- 2026-08-14T04:03:47.332Z mud scorer CLOSED_NAMED_DATA. 254 wrote. present 134 / absent 75 / not-yet 45. 48395 Robertson satisfied-absent via _county_coverage (pct 0, never a parcel). Harris 1523640/1523641 satisfied-present. Ledger GET-equivalent: satisfiedCells 406->615, texasCompletenessPct 12.909486508370861 -> 18.31237937787425. Live HTTP GET timed out 3x (curl 28, 0 bytes) on probeRailCapabilities COUNT(*) FROM atoms. Close `_inbox/2026-08-14_l16_mud_scorer_close.json`.

## GROUND-TRUTH
- 2026-08-14T04:11:53Z Harris 48201 parcel-node --apply STARTED. Drain tree e65baf9 (#338 e15f7cb ancestor, #339 HEAD). storeTruth rows=1602031 features=1523641 seam=1.0514. Scratch runner `_l16_write_harris_parcel_node.mjs` uses indexed WHERE county_fips (not statewide GROUP BY). HS-HARRIS-PARCEL-NODE announced 04:11:47Z. L15 ourActive=null. flood_metros landed=[] (6 failed). Keyset page reads live on txgio_parcel (Neon/PS_ReadIO).

## GROUND-TRUTH
- 2026-08-14T05:09:52.841Z Harris 48201 first --apply FAILED. Plan completed (rowsRead 1602031, wouldWrite 1523640, geometry-incomplete 8683) then 0 written. Error ATOMS_WRITER_LEASE_NOT_HELD: load+plan took ~58 min (04:11:53Z-05:09:52Z) with no heartbeat; lease expired 05:04:14Z. CLI only heartbeats inside writePropertyAtomsBatch.

## GROUND-TRUTH
- 2026-08-14T05:10:32.676Z lease re-taken L16 ttl 14400s expires 09:10:32Z. Harris --apply retry started. Heartbeat loop every 20 min. HS-HARRIS-PARCEL-NODE re-announced. L15 ourActive=null. flood_metros landed=[] still.

## GROUND-TRUTH
- 2026-08-14T06:33:17.238Z Harris 48201 parcel-node RETRY COMPLETE. atomsWritten=1523640 verified=1523640 VF=0 errors=0 wallMs=4951936. First attempt 0 written (lease expiry). Close `_inbox/2026-08-14_l16_leg2_harris_parcel_node_close.json`.

## GROUND-TRUTH
- 2026-08-14T06:36:42.735Z Harris geometry rescore: before not-yet 0.00 / after satisfied-present 100.00 (1523640 atoms / 1523641 features). Ledger 615->616 / 18.312->18.599. Instrument l16-score-geometry-48201.mjs (same SQL as countyGeometryScoreCli.ts --county=48201).

## GROUND-TRUTH
- 2026-08-14T12:18Z operator GO reordered chain: pipelines, Ector, wells, footprint, flood (consume existing metro summaries; do not re-plan blind), roads when split lands. Interrupt capture `_inbox/2026-08-14_l16_interrupt_pipelines_go.json`. Heartbeat loop resumed. Pipeline serial --apply started (254 jsonl, geometry from tx_rrc_pipeline SQL).

## GROUND-TRUTH
- 2026-08-14T15:32:36Z tightening interrupt captured at `_inbox/2026-08-14_l16_interrupt_tightening.json`. Pipeline and heartbeat processes survived and continue from the same state, so no duplicate was started. Pipeline runner: 14 counties landed / 478668 atoms / 0 failed; Bexar 48029 at 235000/703257 written+verified at capture.

## OPEN
- After every scorer: run `countyLedgerMaterializeCli --apply` and record the snapshot result.
- Footprint leg must begin with one small staged-ready county and a pre-registered measured plan/apply budget. At 1.5x, halt-and-EXPLAIN and apply the #335 TEMP+GiST shape. Writer floor `28b85a1` is an ancestor of drain HEAD.
- Flood consumes digest-matching #338 NDJSON. Never re-plan a matching payload.

## GROUND-TRUTH
- 2026-08-14T23:57:24Z pipeline runner exit 1 after heartbeat for 48039 Brazoria with zero child progress, no pipe_48039.json, failed[] empty. Prior: 19 landed / 1,270,793 atoms. Silent ~7.5h gap after 16:29Z heartbeat suggests plan-phase hang then death. Resume from landed set (skip 19).

## OPEN
- Leg 5 RRC-pipelines RESUMING at 48039
- Then Ector, wells, footprint, flood summaries, roads
- Master close + lease release

## LESSON
- parcel-node --apply on a metro loads all txgio rows into memory before the first write. Default lease TTL 3600s is shorter than Harris geometry paging. Heartbeat (or --ttl-sec >= load+write) MUST cover the plan phase, not only writePropertyAtomsBatch.

## LESSON
- Live GET /api/county-ledger can return 0 bytes for 300s because probeRailCapabilities does SELECT COUNT(*) FROM atoms. Reconstruct summary from the same neondb readManifestGrid SQL the route uses; do not treat HTTP silence as no ledger movement.

## LESSON
- Halt on usable-only nearTrueRate with n=2 is a false positive when the alphabet gate skipped the county (Roberts 48393 2572/2574). Floor halt at parcelsRead>=100. Zero usable keys (Robertson 48395) is SATISFIED_ABSENT_NO_USABLE_PROP_ID, not a 0-atom land.

## LESSON
- L15 bbox-area NARN bands systematically understate parcel-weighted nearTrueRate. The 7 named misses (and 15 later) overshoot bandMax ~1.02x-1.89x and sit far under the 0.50 halt. Band is wrong; data is not. Halt remains 50%.

## LESSON
- Rail writer `_feature-${feature_index}` fallback produces illegal parcelNodeId (or spaces/parens in CAD tokens). 48071 Chambers ZodError `parcelNodeId must match {county_fips}:{prop_id}` after plan 35984 / write 0. 7 txgio rows fail alphabet (`Reserve -2`, `Tract 1`, `2948_(1)`, `<New parcel>`, `RES C`). Skip via isUsablePropId (named skippedUnusablePropId); do not `_feature-` invent.

## DEAD-END
- Do not treat L15 flood_metros as READY. Manifest says BLOCKED_L1 / 0 landed.


## LESSON
- Flood metro PLAN-ONLY is slot-free; L15 was blocked by L1 heavy-scan, not by slot law. After L1 release, metros can be planned then --from-plan drained.

## DEAD-END
- Do not treat L15 flood_metros as READY. Manifest says BLOCKED_L1 / 0 landed.
