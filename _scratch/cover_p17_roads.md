# Scratch — COVER P-17 remaining roads

## GROUND-TRUTH
- 2026-08-22T01:09:58.696Z: take --holder=P17 ttl 14400.
- Isolated worktree P:/hauska-engine-worktrees/cover-p17-roads HEAD d3f37949003fae5a99a82b62956352b7dcaa1022.
- PBF MD5 4dd27afd6bc1c654f9b9635b709cf424 MATCH.
- 2026-08-22T13:19:26.019Z: 48371 Pecos landed 9136.
- 2026-08-22T13:21:25.144Z: prefix-range verify 48371 = 9136.
- 2026-08-22T13:21:27.109Z: lease release P17; status lease=null. Not a live P17 row.
- 2026-08-22T13:23:41.149Z: GET county-ledger railKey=roads displayState=not-yet 254/254. Harris 48201 not-yet honestCoveragePct=null.
- Landed this pass 84 FIPS, atomsWrittenSum 818770. Remaining apply-queue 68 starting 48373. apply.log has no 48201.

## OPEN
- none for this runner. Remainder is named on `_inbox/2026-08-22_p17_roads_park_pickup.md` and CLOSE. Resume after operator visual QA via a compiled dispatch. Do not start a second rest runner from this scratch.

## LESSON
- Writer batch heartbeat uses DEFAULT_LEASE_TTL_MS=1h and shortens a 4h take. Detached heartbeat --ttl-sec=14400 is the control that restores 4h.
- body->>'countyFips' EXISTS without an entity_id prefix is a heap scan. Prefix EXISTS over VALUES(254) returned in 0.6s.
- Planner halt watcher can kill rest+heartbeat while a next-county dry-run is already spawned. Kill that dry-run; do not let it become --apply.

## DEAD-END
- Do not subtract 98 from 254. Measured 101 present.
- Do not statewide GROUP BY left(entity_id,5) on road-node; killed after 3 min (heap-scan class).
- Do not invent a roads coverage row. Score refuse no_measurement_spec SS-W14 written 0. Item 9 is P-47, not roads 254/254.
