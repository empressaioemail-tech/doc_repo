---
id: 2026-09-18_san_marcos_coverage_recheck_RECORD
title: San Marcos coverage re-check against setback corpus 1.4.0 (ruling 19's precondition)
date: 2026-09-18
last_updated: 2026-09-18 (17:20Z)
status: done. HOLDS. Ruling 19's precondition is met; P-258's re-run may proceed.
kind: seat record
owner: nick
maintained_by: integration seat
programs: [OPS-24, OPS-16]
plan_rows: [P-349, P-258]
snapshot: live zoning layer https://smgis.sanmarcostx.gov/arcgis/rest/services/MPN/MyPermitNowFeatures/MapServer/6 read 2026-09-18T17:16:31Z (1,001 features, 36 zone codes); matcher = hauska-factory `src/lib/setback-writer/setback-table-router.mjs` `mapDistrict` at `0f4558a4` (the live setback writer's own rule); tables = `@empressaio/setback-corpus` 1.4.0 (npm, 27 San Marcos districts) and 1.1.0 (npm, 8 districts, what production serves today); doc_repo main d6ab5e46
related:
  - _decisions/2026-09-18_phase0_closeout_rulings.md (ruling 19)
  - _inbox/2026-09-07_legacy-design-tools-shared-reader_georgetown-san-marcos_close.json (the 2026-09-07 check)
  - _inbox/2026-09-18_san_marcos_coverage_recheck.json (the full per-code output)
  - scripts/san-marcos-coverage-recheck.mjs (the instrument)
---

# San Marcos coverage re-check

**Ruling 19 (A-216):** San Marcos is served from corpus 1.4.0 once the 2026-09-07 area-coverage check
(live zoning layer, area-weighted by district) has been re-run against the 1.4.0 table. If coverage has
fallen below that check's, the switch stops and goes back to the operator.

**Verdict: HOLDS.** The 1.4.0 table covers **88.38 percent** of San Marcos's zoned area, against
**50.47 percent** for the 1.1.0 table production serves today and 12.93 percent for the two districts
the 2026-09-07 check counted. Nothing fell.

## The instrument

`scripts/san-marcos-coverage-recheck.mjs`. A zone code counts as covered only when the live setback
writer's own matcher (`mapDistrict`, imported from the factory file at `0f4558a4`, not re-derived)
maps it to a row. Area is `SHAPE.STArea()`, summed twice: by the server (grouped by `ZONECODE`) and
over all 1,001 paged features. The run refuses if the two disagree, if the layer is empty, or if any
feature has no area. The declared `ACREAGE` field is reported alongside as a third reading, but it is
not used to decide anything.

**Checked by violation.** The self-test passed 11 of 11 checks. Each of two mutated copies then failed
the check aimed at it: one with the baseline comparison disabled, one where an empty layer returns a
verdict instead of refusing. Both exited 1. The first draft had two fixtures that tested nothing,
because the router matches every code to a one-district table (`kind: "single"`). They were fixed
before the run, and a check now pins that router branch.

## Pre-registered, then measured

| Prediction | Measured |
|---|---|
| SF-6 + SF-4.5 reproduce 12.93 percent within 1 point, or the verdict is not trusted | **12.93 percent** (0.129308) |
| D + DR + TH about 0.90 percent | 0.91 percent (0.009090) |
| SF-11 absent from the layer | absent |
| Server and paged area sums agree | agree (no refusal) |
| 1.4.0 covers more than 1.1.0 | 88.38 against 50.47 percent |

The two area readings also agree: the geometry total is 25,980.68 acres and `ACREAGE` sums to 26,091.70
(0.43 percent apart), with one feature carrying no `ACREAGE` value.

## What stays uncovered in 1.4.0 (11.62 percent of area)

Under ruling 6, each of these codes gets a declared refusal that names the district and the city:

| Code | Area share | Polygons | Why no row |
|---|---|---|---|
| MF-24 | 3.03% | 60 | Chapter 9 legacy multifamily; the adopted-redline source stops before Chapter 9 (the table's own note) |
| CD-1 | 1.88% | 7 | open-space district with no principal-building setback block in the code |
| MF-12 | 1.73% | 49 | Chapter 9 legacy |
| MF-18 | 1.45% | 35 | Chapter 9 legacy |
| PDD | 0.88% | 3 | planned development district; no fixed table |
| VMU | 0.71% | 3 | Chapter 9 legacy |
| D | 0.53% | 34 | Chapter 9 legacy |
| SC | 0.36% | 1 | a former-SmartCode translation code |
| TH | 0.30% | 23 | Chapter 9 legacy |
| AR | 0.29% | 3 | Chapter 9 legacy |
| PH-ZL | 0.19% | 4 | Chapter 9 legacy |
| MR | 0.12% | 18 | Chapter 9 legacy |
| PA | 0.08% | 1 | planning area allocation, not a setback district |
| DR | 0.07% | 11 | Chapter 9 legacy |

Chapter 9 legacy residential (MF-*, D, DR, TH, AR, PH-ZL, MR, VMU) is 8.42 percent of area (summed
from the output file, not by hand). Those
codes are the natural next acquisition for San Marcos. They're Phase 1 work (P-346's district tables)
and this switch doesn't depend on them.

## One observation about the table served today

In 1.1.0, the current code `N-CM` (Neighborhood Commercial) matches the legacy `NC Neighborhood
Commercial` row through the router's prefix fallback (`NCM` starts with `NC`). So production has been
serving legacy NC values for N-CM parcels. In 1.4.0 N-CM has its own row and matches it exactly. The
area is 0.02 percent (4 polygons). It's worth recording because the router's prefix rule, which its
own comment calls "deliberately weak", did exactly that here.

## What this unblocks

Ruling 19's precondition is met. P-258's re-run can go ahead: the live setback writer image already
pins corpus 1.4.0, so running it for Hays is what switches San Marcos over. It runs one production
write at a time, dry run first, each recorded. Georgetown is unaffected: it is served from its adopted
rewrite under A-218, and P-354 is carrying the change that makes the surfaces show both dates.
