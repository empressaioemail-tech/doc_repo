---
id: 2026-08-31_p2_juris_hays30k_timeout
title: Hays 30k slice cancelled at 180s
date: 2026-08-31
last_updated: 2026-08-31
status: filed
plan_row: F-01
snapshot: 01_hays30k.sql; decoded 48209 ORDER BY prop_id LIMIT 30000; equality kept; 00+01 one psql session; short-lived URI cleared
---

# Hays 30k slice cancelled

psql exit 3. Elapsed 218s. RO refuse armed. 01_hays30k.sql
line 366 `canceling statement due to statement timeout`. No
`got`, no TOTALS. Timeout not raised. Nothing adopted.
Statewide TOTALS stays UNMEASURED.

30,000 is within 20% of Caldwell's 24,989, which emitted in
78s. The slice cancelled. Parcel count is not what separates
an emit from a cancel. Chunk-linear is retired. A split inside
the county keyed on parcel volume has nothing to stand on yet.

Cost driver is per-county and unidentified. Three curve-fits
have lost: parcels-linear, city-count, chunk-linear. Do not
offer a fourth from two points.
