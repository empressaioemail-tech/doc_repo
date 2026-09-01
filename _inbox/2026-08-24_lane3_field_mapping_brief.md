---
id: 2026-08-24_lane3_field_mapping_brief
title: Lane 3 — field-mapping pass (feasibility A3)
status: dispatched
date: 2026-08-24
plan_row: P-58
---

# Field-mapping pass

Feasibility A3: no new ingest until gap-matrix fields land mapped. Serve audit already showed two tables on gold (25/5/25 vs 30/10/30). This card maps inspect + envelope + report fields to store / atom / BFF / derive. It does not harvest.

## Done looks like

`_inbox/2026-08-24_field_mapping_pass.md`: each feasibility-v1 inspect/report field has a named store column or atom entity, a named PE bind, and a named derive-or-honest-absent. Gold 25/5/25 vs 30/10/30 has a recommended single writer. ETJ and who-serves are mapped as "no adapter yet" with the next card named, not built.

## Do not

- `--apply`, heavy PostGIS scan, statewide harvest
- Product PRs
- Commit
- Spawn sub-agents
- Start ETJ adapter or who-serves promotion build
