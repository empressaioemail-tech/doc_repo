---
id: 2026-08-22_p17_roads_park_pickup
title: P-17 roads remainder — park and resume
status: active
date: 2026-08-22
plan_row: P-17
owner: integration
related:
  - _decisions/2026-08-22_serve_ident_then_background_cover.md
  - _dispatches/2026-08-22_cover-roads_dispatch.md
  - _inbox/2026-08-22_cover-roads_cp1.json
  - _inbox/2026-08-22_cover-roads_cp2.json
---

# P-17 roads remainder pickup

Read this file before touching the roads writer again. Do not re-derive the roster by subtracting 98 from 254. Do not restart Harris statewide-PBF.

## Why it stopped

Operator 2026-08-22: SERVE, IDENT, and the DC-3 instrument first, then deploy for visual QA and GTM. Roads remainder is background. Decision `_decisions/2026-08-22_serve_ident_then_background_cover.md`. Halt rule: finish county 48371, do not start 48373.

## What was running

- Dispatch: `_dispatches/2026-08-22_cover-roads_dispatch.md`
- Worktree: `P:/hauska-engine-worktrees/cover-p17-roads` branch `cover-p17-roads` tracking `origin/main` at `d3f37949003fae5a99a82b62956352b7dcaa1022`
- Writer: `pnpm --filter @hauska-engine/engine-core run write-road-node-county -- --county=<FIPS> --pbf=P:/tmp/statewide-roads/texas-latest.osm.pbf`
- Env: `ROAD_NODE_COUNTY_PATH=1 PROPERTY_ATOM_PATH=1 ROAD_PBF_APPLY=1 ATOMS_WRITER_LEASE_HOLDER=P17`
- Runner: `P:/tmp/cover_p17_roads/_p17_apply_runner.mjs` mode `rest`
- Lease CLI: `node packages/storage/scripts/atoms-writer-lease.mjs` holder `P17` ttl 14400
- Detached heartbeat: `P:/tmp/cover_p17_roads/_p17_detached_heartbeat.mjs` (was PID 72424)
- Pinned PBF: `P:/tmp/statewide-roads/texas-latest.osm.pbf` MD5 `4dd27afd6bc1c654f9b9635b709cf424`

## Roster (measured 2026-08-22T01:26:36.743Z)

`--list-counties` read 254 from `tx_county_boundary`. Prefix EXISTS on `entity_type='road-node'` and `entity_id` in `[fips:road:, fips:road;)`: 101 present, 153 absent. Apply queue was 152 (absent minus Harris). Counting rule is in `_inbox/2026-08-22_cover-roads_cp1.json`. Artifacts: `P:/tmp/cover_p17_roads/list_counties.json`, `exists_roster.json`, `apply_queue.json`.

Skip forever on this method:

- 48201 Harris. EXISTS false, count 0. Basis A-017 statewide-PBF excluded. Next method is clipped or prepared-geometry extract, then `--skip-extract --ndjson`.
- 48021 Bastrop. 36802 road atoms, body-confirmed. Protected Overpass. Do not PBF.
- 48055 Caldwell. 13790 road atoms, body-confirmed. Protected Overpass. Do not PBF.
- Any FIPS already in `progress.json` `landed`.

48261 was never in the apply queue (EXISTS already true).

## Park snapshot

Live numbers belong in `P:/tmp/cover_p17_roads/progress.json` and in the halt verify JSON written at stop. Resume reads those files. Do not copy a stale landed-count into this paragraph and treat it as truth.

Halt executed 2026-08-22T13:19:42Z (`P:/tmp/cover_p17_roads/HALT_EXECUTED.json`). Landed this pass **84**. Last apply **48371 Pecos = 9136** (prefix-range verify 9136 at 2026-08-22T13:21:25.144Z). Failed / zero-atom / refused still 0. Rest PID 70480 and heartbeat 72424 dead. 48373 dry-run killed (PIDs 132872 121316 24780 55448 132492 14424); no `apply_48373.log`. Resume first FIPS is **48373**. Lease `--holder=P17` released 2026-08-22T13:21:27.109Z; status `lease: null`. CLOSE `_inbox/2026-08-22_cover-roads_close.json`. GET 2026-08-22T13:23:41.149Z `railKey=roads` `displayState=not-yet` on 254/254 including Harris 48201.

## Score

Checked-in `countyRailScoreCli.ts --rail=roads --county=48203 --dry-run` exit 2: `UNAVAILABLE` `no_measurement_spec` owner SS-W14, written 0. Artifact `P:/tmp/cover_p17_roads/score_roads_refuse.json`. leave_behind P-47. Do not invent a coverage row. Do not POST ledger recompute for roads until a spec exists.

## How to resume (background)

1. Confirm foreground gate: operator visual QA done, or operator says resume. Decision reversal names this.
2. Isolated worktree from current `origin/main`. Do not occupy `P:/hauska-engine` or `P:/seat-worktrees/property/hauska-engine`.
3. Confirm PBF MD5 still `4dd27afd6bc1c654f9b9635b709cf424`. If missing or drifted, STOP.
4. Re-run prefix EXISTS for the remaining FIPS only (the `applyQueue` minus `progress.landed`). Never heap `COUNT(*)`.
5. Take lease `--holder=P17` (or a new holder if P17 is gone). Detached heartbeat before first `--apply`.
6. Start `_p17_apply_runner.mjs rest`. It skips FIPS already in `progress.landed`. First remaining after a clean 48371 halt is 48373.
7. Hard-refuse 48201 / 48021 / 48055 before any spawn. If a county extract writes 0 atoms, stop that county, do not restart statewide-PBF.
8. Watch: `_catalog/watch_registry/cover-p17-roads-lease.json` and `cover-p17-roads-apply.json`. Unpause when the runner starts.
9. Compile a fresh dispatch. Do not hand-assemble. Cite this pickup and WDLL item 9 as parked remainder.

## What not to do

Do not subtract 98 from 254. Do not `COUNT(*)` the atoms heap. Do not Harris statewide-PBF. Do not PBF Bastrop or Caldwell. Do not mint absence. Do not start P-09 / P-11 / P-04 / P-05 from a roads resume. Do not apply MUD/SD until engine 356 is on main.
