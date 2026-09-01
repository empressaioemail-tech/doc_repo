You MUST NOT spawn sub-agents. Do not git add / commit / push. Do not deploy. Do not occupy P:/hauska-engine or P:/seat-worktrees/property/hauska-engine. Do not occupy P:/legacy-design-tools. Do not Harris statewide-PBF. Do not mint absence. Do not copy L7 `--honest-absent`. Do not COUNT(*) the atoms heap. Do not start P-09 / P-11 / P-04 / P-05. Do not apply MUD/SD.

Plan row P-17. Occupancy: isolated worktree P:/hauska-engine-worktrees/cover-p17-roads branch cover-p17-roads tracking origin/main. Doc_repo writes: your _inbox JSON only.

WDLL: P:/doc_repo/_inbox/2026-08-21_ops18_all_board_WDLL.md items 9 and 13. Queue: `90_operations/OPS-18c_parallel_execution.md` COVER after P-56 GET. A-017 / `_decisions/2026-08-17_roads_exclude_harris_statewide_pbf.md`: Harris 48201 is excluded from serial statewide-PBF. Writer: `packages/engine-core/scripts/write-road-node-county.mjs`.

## Mission

Take the one atoms slot as P17. Land remaining non-Harris `road-node` counties from the pinned Texas PBF. Score only if the checked-in scorer can emit a roads number. Do not invent coverage.

## Lease

CLI: `node packages/storage/scripts/atoms-writer-lease.mjs` (DATABASE_URL = hauska_mcp via gcloud secret DATABASE_URL project hauska-prod-497015). Do not print the URL.

1. `status` first. Other unexpired holder = STOP.
2. `take --holder=P17 --ttl-sec=14400`. Same holder may re-take.
3. Detached heartbeat every 8 minutes, same holder, ttl 14400. Log P:/tmp/cover_p17_roads/lease_heartbeat.log. Start BEFORE the first `--apply`. Watch `_catalog/watch_registry/cover-p17-roads-lease.json`.
4. Harris lesson: CLI only heartbeats inside the batch write. Extract can expire the lease. Detached heartbeat is the control.

## Roster

Enumerate remaining counties yourself. Do not subtract 98 from 254 in prose.

1. `--list-counties` against `tx_county_boundary` (read at execution time).
2. For each FIPS, bounded EXISTS / prefix-range count on `road-node` (`entity_type='road-node'` and `body->>'countyFips'` or `entity_id` prefix `{fips}:road:`). Never heap COUNT(*).
3. Skip 48201. Do not run `extract_highways.py` against `texas-latest.osm.pbf` for Harris. File it as remaining not-yet with basis `A-017 statewide-PBF excluded`.
4. Skip 48021 and 48055 PBF. Those counties are protected Overpass adapters. Confirm they already have road atoms. If they do not, STOP and file; do not PBF them.
5. Skip any county whose EXISTS is already true. Quote the skip list in CP1.

Pinned PBF: `P:/tmp/statewide-roads/texas-latest.osm.pbf` expected MD5 `4dd27afd6bc1c654f9b9635b709cf424`. If the file is missing or the MD5 disagrees, STOP.

## Apply

`ROAD_NODE_COUNTY_PATH=1 PROPERTY_ATOM_PATH=1 ROAD_PBF_APPLY=1 ATOMS_WRITER_LEASE_HOLDER=P17`
`CORTEX_DATABASE_URL` = DEPLOYMENT_DATABASE_URL secret project legacy-design-tools-prod.
`DATABASE_URL` = atoms (direct Neon host, not pooler).

One county at a time. Dry-run first (omit `--apply`):

`pnpm --filter @hauska-engine/engine-core run write-road-node-county -- --county=<FIPS> --pbf=P:/tmp/statewide-roads/texas-latest.osm.pbf`

The script pins MD5 `4dd27afd6bc1c654f9b9635b709cf424` internally. Confirm the file hash yourself before the first dry-run. Do not pass a flag the script does not accept.

Then `--apply` with the same flags. Progress every county to P:/tmp/cover_p17_roads/apply.log. Watch `_catalog/watch_registry/cover-p17-roads-apply.json`.

If a county extract writes 0 atoms the way Harris did, STOP that county, do not restart statewide-PBF on it, file and continue the rest.

## Score

A1 close: `RAIL_SCORING_DECLARATION` roads is `kind=unspecified`; `countyRailScoreCli` refuses. After the first successful apply, run the checked-in roads score path once. If it refuses unspecified, quote the refuse. Do not invent a coverage row. Do not write a one-off scorer. leave_behind P-47. If a checked-in scorer can emit a number, score only counties you just applied, then stop.

Do not POST ledger recompute. That is planner-owned after a score that actually wrote.

## Return

CP1 before the first `--apply`: occupancy SHA, lease take JSON, remaining FIPS list with EXISTS evidence, Harris skip, 48021/48055 skip, PBF MD5, what you will violate (a 48201 PBF invoke must not run). CP2 after first county dry-run+apply. CLOSE quotes applied FIPS, skipped FIPS, bounded verify per applied county, lease release JSON. Remaining `not-yet` is a named count, never "in progress". leave_behind: planner recompute only if score wrote; else P-47. No product git commits.
