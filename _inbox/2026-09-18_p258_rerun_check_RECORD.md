---
id: 2026-09-18_p258_rerun_check_RECORD
title: P-258's setback re-run checked before it ran; it is a no-op, and San Marcos's switch needs a writer change
date: 2026-09-18
last_updated: 2026-09-18 (17:45Z)
status: measured. No apply was run; a re-run would move zero cells in all six counties. The finding is carded as P-363.
kind: seat record
owner: nick
maintained_by: integration seat
programs: [OPS-24, OPS-16]
plan_rows: [P-258, P-349, P-363]
snapshot: factory store (hauska-prod-497015 FACTORY_DATABASE_URL_RO, neondb) read 2026-09-18 17:26Z to 17:31Z; setback writer job factory-parcel-setback-cells generation 8, image sha256:208fb315 (factory c5622d0b, corpus pin 1.4.0), dry runs 9pg2r (48209) and v7xfd (the other five); corpus 1.1.0 and 1.4.0 from npm; router = hauska-factory setback-table-router.mjs at 0f4558a4; doc_repo main 28d30947
related:
  - _inbox/2026-09-18b_HANDOFF_integration_seat.md (section 2, item 2: "a Hays run IS San Marcos's switch")
  - _inbox/2026-09-18_san_marcos_coverage_recheck_RECORD.md (ruling 19's precondition, HOLDS)
  - _inbox/2026-09-18_setback_corpus_1.1.0_vs_1.4.0_diff.json, _inbox/2026-09-18_setback_stale_match.json
  - scripts/sql/setback-cell-source-census.sql, scripts/sql/setback-value-cells-by-code.sql, scripts/setback-corpus-version-diff.mjs, scripts/setback-stale-match.mjs
---

# P-258's re-run, checked before it ran

The handoff said P-258's setback writer re-run was the next production write, and that because the
writer image pins corpus 1.4.0, running it for Hays would switch San Marcos to 1.4.0. Both halves
were checked before any apply. **Neither holds.** Running it again changes nothing, and it cannot
switch San Marcos.

## 1. The writer never reopens an earned value

`parcel-setback-cells.mjs` releases exactly two populations: cells still `unaccounted`, and the false
absences it wrote itself (P-256's two signatures). Any `value` cell stays frozen, whatever corpus
version it cites. P-256's apply ran on this same image (generation 8, pin 1.4.0) in all six counties
on 2026-09-17 (A-211). So a second run has nothing left to move except `unaccounted` cells the writer
would now resolve differently.

## 2. Hays: zero cells would move

Pre-registered: movement at or near zero. It would be proven wrong by a large movement in San Marcos
districts. Two independent readings, the stored cells and the writer's own dry run, agree to the cell:

| | Stored now (17:26Z) | Dry run `9pg2r` (17:25Z) |
|---|---|---|
| Unaccounted, district not in the table (San Marcos 1,924 + Kyle 270 + Buda 449) | 2,643 | 2,643 |
| Unaccounted, city with no ruled table (8 cities) | 5,640 | 5,640 |
| San Marcos values | 14,540 citing 1.1.0 + 2,119 citing 1.4.0 = 16,659 | 16,659 |

The control parcel `48209:97658` (San Marcos, SF-6) is in the 1.1.0 bucket: front 25, source
`@empressaio/setback-corpus@1.1.0:san-marcos-tx`, vintage 2026-09-15T00:54:11Z.

One of my attempts failed before this one, and it was my fault. I ran `gcloud run jobs execute` from
PowerShell, and its comma operator joined `--args=parcel-setback-cells,--county=48209` into a single
argument. The container refused with its usage line (exit 2) before opening any store. Execution
`n67lb` should be left out of failed-execution counts. The run from Bash was split correctly:
`["parcel-setback-cells","--county=48209"]`.

## 3. 387,237 setback value cells still cite corpus 1.1.0

Six counties, the `setbackFrontFt` rail:

| County | Values citing 1.1.0 | Values citing 1.4.0 |
|---|---|---|
| Bastrop 48021 | 6,421 | 2,169 |
| Caldwell 48055 | 5,485 | 3,408 |
| Hays 48209 | 35,365 | 4,123 |
| McLennan 48309 | 37,513 | 13,276 |
| Travis 48453 | 172,243 | 45,414 |
| Williamson 48491 | 130,210 | 5,878 |
| **Total** | **387,237** | **74,268** |

## 4. Wrong citation, or wrong numbers?

`scripts/setback-corpus-version-diff.mjs` compares the published 1.1.0 and 1.4.0 tables district by
district. It passed its self-test 4 of 4, and a mutated copy failed. The result: **no district's
front, side, rear or corner setback changed in any table.** The only row edits are the not-specified
height placeholder (100 to 999, flagged as not-specified in both versions) in 12 tables. Everything
else is new districts; none were removed or renamed.

`scripts/setback-stale-match.mjs` then runs the writer's own `mapDistrict` on both table versions for
every stored group of (table, district code) that cites 1.1.0. It passed its self-test 4 of 4, and a
mutated copy failed 2 checks:

- **387,231 cells** resolve to the same row under 1.4.0 with the same numbers. Their citation is
  stale; their values are right.
- **6 cells** resolve to a different row with different numbers. They are all San Marcos `N-CM`
  (Neighborhood Commercial, current code): `48209:11795`, `12013`, `134844`, `174073`, `174074`,
  `98186`. Read directly from the store, each holds front 20 / side 5 / rear 5 / corner 15, the
  legacy `NC` row that 1.1.0's table reached through the router's prefix fallback (`NCM` starts with
  `NC`). N-CM's own 1.4.0 row is 5 / 0 / 0 / 5. These are wrong values, and they are frozen.

The tool assumes the current router is the rule those cells were written under. The direct read of
the six parcels confirms it for the only group where it matters.

## 5. What this changes

- **P-258's re-run is not a production write to make.** It is a no-op in Hays (measured). The other
  five counties are in section 6.
- **Ruling 19's San Marcos switch needs a writer change**, carded as **P-363**. The write gate must
  also release a value cell whose source names an older corpus version of the same table and
  re-resolve it under the pinned table. An unchanged row gets its source and citation re-stamped; a
  changed row gets the new values written, under a durable record. The predicted bound is 387,231
  re-stamps and 6 value changes. The served San Marcos rows (the bake's `legacy-transitional`
  1.1.0 atoms) change only when P-349's Hays bake runs, and that waits on P-351.
- **P-255's census re-grade and P-300 with P-338 are not blocked by P-258.** P-300/P-338 still needs a
  compiled dispatch.

## 6. The other five counties: also zero

Dry run `v7xfd` covered Bastrop, Caldwell, McLennan, Travis and Williamson in one execution
(17:30:47Z; args recorded as `["parcel-setback-cells","--county=48021","--county=48055","--county=48309","--county=48453","--county=48491"]`).
Its city lines sum over the five counties. On every class the writer can touch, they equal the
stored cells exactly:

| Five counties | Stored (17:30Z) | Dry run `v7xfd` proposes |
|---|---|---|
| Value | 422,017 | 422,017 |
| Unaccounted | 50,056 | 50,056 |
| Refused | 80,608 | 80,608 |

Not-applicable does not compare this way: the dry run's city lines report 3,600, while the store
holds 312,304. The difference is unincorporated parcels, which fall outside the per-city lines.
Movement on that class is still zero, because an earned not-applicable is never released.

**P-258's re-run would move zero cells in all six counties.** It is closed as measured and not run.
There is nothing for it to write.
