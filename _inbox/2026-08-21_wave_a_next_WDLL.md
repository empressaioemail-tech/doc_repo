---
id: 2026-08-21_wave_a_next_WDLL
title: Wave A next — flood EXISTS and Ector re-key scout
status: graded
date: 2026-08-21
plan_row: P-08,P-02
operator_approval: 2026-08-21 verbal go on next with sub agents
related:
  - 90_operations/OPS-18b_data_remediation_plan
  - _inbox/2026-08-21_wave-a_close.json
---

# WDLL: Wave A next

Done looks like: the 76 flood missing-row FIPS are split into atoms-present vs atoms-absent by EXISTS, not by a full-table COUNT(*), and Ector P-02 has a named re-key command that is still dry. No atoms `--apply` this wave. Score-apply is a later dispatch only for FIPS this inventory marks GO.

## Acceptance

1. Enumerate missing flood coverage FIPS: `county_manifest` minus `county_facet_coverage` facet=flood. Count must be 77 including Donley 48129, or the close names why the pin moved. Check: `_inbox/2026-08-21_a4-flood-exists_close.json`.
2. For each of the 76 with `txgio_parcel` (exclude Donley): EXISTS of `flood-hazard-fact` on that FIPS prefix. Instrument: `entity_type = 'flood-hazard-fact' AND entity_id >= '{fips}:' AND entity_id < '{fips};'` (semicolon is the next ASCII after colon) or equivalent range on `(entity_type, entity_id)`. Never `COUNT(*)` the atoms heap. Never `GROUP BY` all flood-hazard-fact rows. Check: GO list and NO-GO list in the close, with query snapshot.
3. GO means atoms exist AND a later `countyFloodScoreCli --county={fips}` (not `--all`) can score without a new apply. NO-GO means no atoms (needs P-08 apply) or Donley skip. Check: leave_behind names the exact score command for GO FIPS, or `none`.
4. Ector 48135: quote the P-02 re-key script path, dry-run invoke, whether the atoms slot is free, foldedExtraFeatures 72100 vs planned geo_id count. No `--apply`. Check: `_inbox/2026-08-21_a5-ector_close.json`.
5. No Harris PBF. No product commits. Occupancy read-only. Do not touch `P:/legacy-design-tools`.

## Amendments

- 2026-08-21: opened after Wave A scout close, operator go.
- 2026-08-21: A4 GO 76 flood FIPS (atoms present). A5 P-02 dry-run named; score-apply 48135 NO-GO; lease expired.

## Finish card (graded 2026-08-21)

1. met: missing flood FIPS 77 including Donley. Planner re-ran the pin.
2. met: 76 prefix-range EXISTS, all true. Sample 48001/48201/48453 true, 48129/00000 false.
3. met: GO is `--county=` not `--all`. leave_behind is 76 commands. No atoms apply.
4. met: `_inbox/2026-08-21_a5-ector_close.json` script, dry-run, lease expired, 72100 vs 71673 delta 427.
5. met: no apply, no PBF, no product commits.
