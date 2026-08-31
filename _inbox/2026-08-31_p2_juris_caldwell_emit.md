---
id: 2026-08-31_p2_juris_caldwell_emit
title: Caldwell-scoped 01 emitted inside 180s
date: 2026-08-31
last_updated: 2026-08-31
status: filed
plan_row: F-01
snapshot: Factory join 96e3ef4; decoded scoped to 48055 only; 00+01 one psql session; neondb; short-lived URI cleared
---

# Caldwell-scoped 01 emitted

Operator run. Exit 0. Wall 78s including connection and 00.
RO refuse unchanged. Snapshot unchanged.
`parcel_distinct_prop` still 981410.

Volume reading confirmed. Second partition, not two-sixths of a
result. Statewide TOTALS stays UNMEASURED. Nothing adopted.

## Emit (not adopted)

| report | unincorporated | in_city | unresolved | total |
|---|---|---|---|---|
| TOTALS | 14361 | 10628 | 0 | 24989 |

`denom_check` got 24989 / expected 24989. 100% ring
(`n_bbox_centre` 0). `still_unresolved` 0.
`assigned_forbidden_names` 0. `city_rows_named_cdp` 0.

Slivers: 155 under `1e-8` (0.62% of parcels). Bastrop was 320
(0.51%). Threshold behaves across counties, not tuned to one.

## Two-point scaling

| County | Parcels | vs Bastrop | Wall | Result |
|---|---|---|---|---|
| Caldwell 48055 | 24989 | 0.40x | 78s | emit |
| Bastrop 48021 | 62257 | 1.00x | 129s | emit |

Wall includes 00 and connection. A two-point fit with that
overhead still puts McLennan and Hays near or over 180s. That
is an extrapolation. Only a timed run measures it.

The 6 stay unnamed. They do not gate this path.
