# F1 CP1 adversarial review (planner-owned, 2026-08-12)

## Pre-registered prediction (from scratch)
- approachExpected: postgis-pip
- predictedPlanMs48171: 400
- predictedPlanMs48099: 15000
- metrosViablePrediction: true if 48099 planMs < 60s + parity identical

## Schema half findings
1. geom was ABSENT — adding geom+GiST was necessary. CONFIRMED live: 198178/198178 MULTIPOLYGON, GiST used in EXPLAIN.
2. Schema half measured point-major only (17.4 ms/pt) and concluded ST_Subdivide is REQUIRED. That conclusion is TOO STRONG — based on the wrong query shape.
3. Populate wall ~501s for 198k rows; idempotent second run 0 updates.

## Plan half findings (to verify at CP2)
1. Zone-major MATERIALIZED CTE claims 48099 planMs 5025 vs D2 1818708 — must re-check artifact digests.
2. Boundary divergence documented (P02 edge) — correct; hybrid escape hatch present.
3. Fail-closed readiness (partial geom → not ready) — correct.
4. SFHA SQL predicate matches isSfhaFlag case-sensitively — correct.
5. JS zone load lacked ORDER BY zone_row_id — FIXED by planner (8ad9e54).
6. Dual-SFHA attribute divergence on 15k distinct 48099 parcels: 0 (planner probe).
7. Digests match JS↔PostGIS on both brackets (artifact-verified).
8. Harris 1862s is measured on Harris zones, not naive 48099 extrapolation — correct methodology; use 1862 not 242.

## CP2 (planner independent, 2026-08-12T15:01Z)

- approachChosen: **postgis-pip** (zone-major MATERIALIZED CTE). Geometry-simplification NOT required for metro viability. Hybrid built unused.
- predictedPlanMs48171 400 → measured 1411: **REFUTED** (SQL RTT dominates tiny-zone county; correctness bracket still green)
- predictedPlanMs48099 15000 → measured 5025: **CONFIRMED** (beat prediction; 362x vs D2)
- metrosViablePrediction true: **CONFIRMED** (Harris plan measured 1862s ≈ 31 min)
- Independent EXPLAIN 100pts/48099: Execution Time 798ms; zones CTE via **bbox_idx** Bitmap Index Scan (1543 rows), then CTE Scan + ST_Contains — GiST is on the table and used by point-major, but the shipped zone-major hot path wins on single-detoast amortization, not GiST probes per point.
- Schema half "subdivide REQUIRED" based on point-major 17.4ms/pt: **REFUTED** as a metro gate by zone-major.
- atomsTableRowCountAtMeasurement (CP2): **25,259,558** (D2 21,233,787; schema half 22,525,477) — A1 writing; shelf life applies.
- Adversarial tests 29/29 pass; CI PR #315 success; planner fix 8ad9e54 ORDER BY zone_row_id.
- Dual-SFHA distinct-zone overlaps in 15k 48099 parcels: 0.

## Fixes applied by planner
- ORDER BY zone_row_id on JS zone load (8ad9e54)
- PR #315 opened + merged
- Close artifact next
