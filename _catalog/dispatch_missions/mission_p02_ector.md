You MUST NOT spawn sub-agents. Do not git add / commit / push. Do not deploy. Do not touch P:/legacy-design-tools. Do not apply from P:/seat-worktrees/property/hauska-engine (stale 8d8e880, no lease CLI in tree).

Plan row P-02. Isolated worktree: P:/hauska-engine-worktrees/p02-ector-rekey branch p02-ector-rekey tracking origin/main d3f3794. Doc_repo writes: your _inbox JSON only.

WDLL: P:/doc_repo/_inbox/2026-08-21_p02_flood_score_WDLL.md items 1-5, 7.

## Mission

Take the atoms lease as P02, re-key Ector 48135 on geo_id, verify, release. Geometry rescore is not this lane.

## Lease

CLI: `node packages/storage/scripts/atoms-writer-lease.mjs` (DATABASE_URL = hauska_mcp via gcloud secret DATABASE_URL project hauska-prod-497015). Do not print the URL.

1. `status` first. Expect holder L26 expired.
2. `take --holder=P02 --ttl-sec=14400`. Same holder may re-take; other unexpired holder = STOP.
3. Detached heartbeat every 8 minutes, same holder, ttl 14400. Log P:/tmp/p02_ector_20260821/lease_heartbeat.log. Start this BEFORE dry-run/apply. Watch already at `_catalog/watch_registry/p02-ector-lease.json`.
4. Harris lesson: CLI only heartbeats inside writePropertyAtomsBatch. Plan-phase load can expire the lease. Detached heartbeat is the control. TTL 14400 covers Ector (~75k features), not Harris.

## Re-key

`PARCEL_NODE_PATH=1 TXGIO_DATABASE_URL=<DEPLOYMENT_DATABASE_URL secret project legacy-design-tools-prod> DATABASE_URL=<atoms> ATOMS_WRITER_LEASE_HOLDER=P02`

Dry-run (default):
`pnpm --filter @hauska-engine/engine-core run write-parcel-node-county -- --county=48135 --key-kind=geo_id_crosswalk`

`--key-kind=geo_id_crosswalk` is mandatory. Roster still says prop_id. Without the flag, STOP.

If dry-run extras vs 71673 disagree by more than 5%, STOP and file; do not apply.

Then `--apply` with the same flags. Watch `_catalog/watch_registry/p02-ector-apply.json`. Progress every 5k atoms or every 60s to P:/tmp/p02_ector_20260821/apply.log.

Verify: prefix-range EXISTS/count on parcel-node `entity_id >= '48135:' AND entity_id < '48135;'` plus a sample entity_id that is geo_id-shaped, not the 3791 prop_id collapse. Never COUNT(*) the atoms heap.

Release `--holder=P02` after verify. Confirm status is not a live P02 row.

## Return

CP1/CP2/CLOSE at the dispatch paths. Quote take JSON, dry-run counts, apply counts, bounded verify, release JSON. leave_behind: geometry denom re-rule, not a silent score. No product git commits.
