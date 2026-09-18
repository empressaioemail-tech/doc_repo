---
id: 2026-09-18_p255_census_regrade_RECORD
title: P-255 setback census re-graded after P-256's apply
date: 2026-09-18
last_updated: 2026-09-18 (18:00Z)
status: done. Every prediction held.
kind: seat record
owner: nick
maintained_by: integration seat
programs: [OPS-24, OPS-16]
plan_rows: [P-255, P-256, P-258, P-300, P-338]
snapshot: factory store (FACTORY_DATABASE_URL_RO, neondb) and atoms store (ATOMS_DATABASE_URL, database hauska_mcp), read 2026-09-18 17:42:15Z to 17:57:13Z by scripts/setback-parcel-census.mjs (self-test 23 of 23 passed at this head); doc_repo main 61b5b2ed
related:
  - _inbox/2026-09-18_setback_parcel_census.json (this run)
  - _inbox/2026-09-16_setback_parcel_census.json (the baseline)
  - _inbox/2026-09-18_p258_rerun_check_RECORD.md (the source census this is cross-checked against)
  - _inbox/2026-09-17_p326-setback-residual-composition_measurement.json (the 58,339 population)
---

# P-255 census re-grade

The census ran after P-256's apply (2026-09-17, A-211) and after P-258's re-run was found to be a
no-op. Before running it I predicted three things. It would be proven wrong if any count disagreed
with the independent instruments, because that would mean one of them reads a different population.

| Prediction | 2026-09-16 | Measured now |
|---|---|---|
| False absences fall to 0 (P-256 moved exactly that population) | 219,472 (125,212 district misses + 94,260 no-table) | **0 and 0** |
| Value cells per county equal the source census taken an hour earlier with a different query (`scripts/sql/setback-cell-source-census.sql`) | not applicable | **Equal in all six:** Bastrop 8,590, Caldwell 8,893, Hays 39,488, McLennan 50,789, Travis 217,657, Williamson 136,088 |
| Unaccounted equals P-326's residual population | not applicable | **58,339**, equal to P-326's 58,339 (Bastrop 1,313, Caldwell 951, Hays 8,283, McLennan 8,610, Travis 33,883, Williamson 5,299) |

Two other counts moved. P-249's population (a setback value, a district and table on record, and a
`no-buildable-area` atom that is not verified-promoted) went from 131,357 to **148,136**. That rise of
16,779 comes from P-256 turning false absences into values: more parcels now have a value and a
blocking atom. Parcels blocked by a zero with no reason held at **26,597**.

**What remains unaccounted on the setback rails is 58,339 parcels**, and all of them are in P-326's
classes:

- 9,510 need a district row their city's table lacks. The ruling 6 refusal covers them (P-338).
- 48,829 are in 40 cities whose zoning layer was never acquired. A-224 splits them by what each city's
  ordinance says (P-300).

The setback rails' 30 open ledger cells close only when those writes are applied.
