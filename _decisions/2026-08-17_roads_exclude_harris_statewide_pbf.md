---
decision_id: 2026-08-17_roads_exclude_harris_statewide_pbf
date: 2026-08-17
owner: operator
status: active
related_canonical:
  - _inbox/2026-08-15_texas_flush_server_plan_WDLL.md
  - _inbox/2026-08-15_l26_gotomarket_pickup.md
  - 90_operations/OPS-14_texas_flush_game_plan.md
  - _decisions/2026-08-09_texas_flush_launch_gate.md
---

# Decision

Harris 48201 is excluded from the serial statewide-PBF roads drain. Remaining counties continue on that drain. Harris roads still have to land (roads is a statewide-uniform rail; honest absence would be a lie). They land from a county-clipped or prepared-geometry extract, not from another raise-and-restart of `extract_highways.py` against `texas-latest.osm.pbf`.

## Context

Three Harris extracts against the full Texas PBF burned on the order of a day and wrote zero atoms. Dallas 48113 scanned the same 713 MB PBF and landed 321,958 atoms in 9.8 minutes. The difference is not file size. `extract_highways.py` runs a pure-Python point-in-polygon and every-edge segment test against the Harris ring for every highway whose bbox overlaps Harris. Operator 2026-08-17: Harris excluded.

## Structural commitment check

- Sell reasoning, not data: unchanged. Road-node still carries OSM way id, adapter, and geometry.
- Confidence earned, not asserted: Harris roads stay not-yet until stored atoms exist. Do not mint honest-absence for a county with hundreds of thousands of ways.
- Cost per jurisdiction: a second week of wall-clock restarts on the same nested loop is the cost failure. Prepared geometry or a clipped PBF is the cost control.
- Dual interface: unchanged.

## Reasoning

The two-week fill has been the same defect class on every rail: a Node or Python nested loop over statewide cardinality, killed by a wall, then restarted. Flood and pipelines left that class when the join moved into PostGIS. Roads never did. Raising `WALL_MS` from 20 minutes to 12 hours keeps the nested loop and throws away extract progress on every kill. Skipping Harris unblocks 153 counties that already prove the PBF scan is a 2 to 10 minute job. Harris apply is then `--skip-extract --ndjson` from a prepared-geometry or bbox-clipped extract that does not hold the atoms writer while it runs.

## Reversal criteria

Reverse the skip if a prepared-geometry or clipped-PBF Harris extract disagrees with the exact even-odd predicate on a landed county (Dallas 48113) by more than a named bound, and no index-preserving exact predicate can be built. Do not reverse back onto statewide-PBF raise-and-restart for Harris or Tarrant.

## Dependencies

Depends on: L26 atoms writer continuing the non-Harris roster; off-slot Harris NDJSON extract; apply of that NDJSON when the writer is free.
Blocks: MEASURED-EVERYWHERE roads cells for 48201 until Harris atoms land.
Does not block: the other 153 road counties, CAD tail after those land, or metro pipeline honest holds.
