---
id: 2026-08-21_wave_a_execution_WDLL
title: Wave A execution WDLL — score existing uniform rails
status: graded
date: 2026-08-21
plan_row: P-08,P-09,P-01,P-05,P-11,P-12,P-06
operator_approval: 2026-08-21 verbal go spawn agents to proceed
related:
  - 90_operations/OPS-18b_data_remediation_plan
  - _decisions/2026-08-17_qa_launch_current_map
---

# WDLL: Wave A execution

Done looks like: a stranger can score the uniform rails that already have atoms, without a new store census and without minting absence. Scout first. Score apply is a later dispatch after the inventory names GO rails. Recurrence controls are named, not necessarily armed this wave.

## Acceptance

1. Per-rail inventory for geometry, roads, flood, footprint, mud, rrc-wells, rrc-pipelines, rail-corridor: `county_facet_coverage` row counts by `rail_state` (bounded GROUP BY, not atoms COUNT(*)), whether a scorer CLI exists, GO or NO-GO to score without atoms `--apply`. Check: `_inbox/2026-08-21_a1-coverage_close.json`.
2. Roads statewide PBF is NO-GO (A-017 / `_decisions/2026-08-17_qa_launch_current_map.md`). Scoring already-landed road counties is allowed if coverage rows are missing. Check: inventory names A-017 on the roads row.
3. Flood score/serve graph: does `countyFloodScoreCli` read `flood-hazard-fact` or `place_layer_snapshots`? File:line. Distinguish ledger score from inspect-card brokerage facets. Check: `_inbox/2026-08-21_a3-flood_close.json`.
4. Sparse-rail absence path: how L7 wrote Donley `satisfied-absent`; whether wells/pipelines/rail-corridor scorers can emit absent only with `evaluated` true and non-empty `provenanceScope`. No minting. Check: `_inbox/2026-08-21_a2-absence_close.json`.
5. No atoms `--apply`. No Harris PBF. No product commits. Occupancy: read-only on `P:/seat-worktrees/property/legacy-design-tools`. Do not touch `P:/legacy-design-tools`.

## Amendments

- 2026-08-21: opened with operator go to spawn Wave A agents. Scout wave only.
- 2026-08-21: A1 scout closed all five rails NO-GO for score-without-apply. A3 scout: ledger flood scorer already on `flood-hazard-fact`; inspect still on snapshots.

- 2026-08-21: A2 scout: sparse rails cannot go honest-absent today. Pair builders exist; apply CLIs never call them.

## Finish card (graded 2026-08-21)

1. met: `_inbox/2026-08-21_a1-coverage_close.json` five rails, all NO-GO. Planner re-ran the GROUP BY.
2. met: roads row cites A-017; landed-county scoring still NO-GO (spec unspecified).
3. met: `_inbox/2026-08-21_a3-flood_close.json` ledger on flood-hazard-fact; inspect still snapshots.
4. met: `_inbox/2026-08-21_a2-absence_close.json` L7 is facet-only; four scorers unspecified; apply starves the pair.
5. met: no apply, no PBF, no product commits, occupancy held.
