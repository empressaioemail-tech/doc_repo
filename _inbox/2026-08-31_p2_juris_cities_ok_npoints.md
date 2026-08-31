---
id: 2026-08-31_p2_juris_cities_ok_npoints
title: cities_ok vertex and area probe 48021 vs 48209
date: 2026-08-31
last_updated: 2026-08-31
status: filed
plan_row: F-01
snapshot: cities_ok as in 01; 00 then two aggregates; no 01 execute; short-lived URI cleared
---

# Geometry story holds

Hays `npoints_sum` is 9.29× Bastrop. The bar was 2×. Area is
10.7×. Within 20% would have killed it.

| County | n_cities | npoints_sum | avg | max | area_deg2_sum |
|---|---|---|---|---|---|
| Bastrop 48021 | 5 | 4649 | 930 | 1279 | 0.0092 |
| Hays 48209 | 13 | 43205 | 3324 | 32811 | 0.0985 |

Austin, 32811 points, is 76% of the Hays vertex budget and 7.1×
Bastrop's whole county. Kyle is 1551, barely above Bastrop's
largest. Austin's full multi-polygon is in Hays `cities_ok`
because it intersects the county (Travis / Hays / Williamson
straddle).

Consistent with Plan C: Hash Join, city side built once, cancel
is runtime. EXPLAIN was blind to vertex cost. Bastrop and
Caldwell emit on 4649-class city sets.

## Named gap

This probe does not say whether Hays parcels reach Austin or
only share a `cities_ok` row. Bbox prefilter may exclude most.
"Austin is expensive when hit" and "Austin is hit often" are
different. Not measured: Austin–Hays city-county overlap area
(bare `ST_Intersects` on city-county, no `1e-8`). A sliver
straddle would still cost every bbox-passing parcel.

Range-chunk is not licensed until that gap is named. Travis and
Williamson also contain Austin; they will be worse per parcel,
not better. Do not run them to confirm.
