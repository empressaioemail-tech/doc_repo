---
id: 2026-08-31_p2_juris_explain_c
title: Plan C Hays-full is Hash Join like Bastrop
date: 2026-08-31
last_updated: 2026-08-31
status: filed
plan_row: F-01
snapshot: EXPLAIN FORMAT TEXT no ANALYZE; Hays-full 01 decoded 48209 no LIMIT; short-lived URI cleared
---

# Plan C is Hash Join

Same shape as B. Hays-full cancel is runtime, not a plan flip.

| | A Hays 30k | B Bastrop full | C Hays full |
|---|---|---|---|
| parcel_hits join | Nested Loop | Hash Join | Hash Join |
| City side | index scan per row | built once | built once |
| st_intersects | under Nested Loop | Hash Join Filter | Hash Join Filter |
| parcels_six est. | 1841 (actual 30000) | 8018 (actual 62257) | 13135 (actual 116421) |
| Top-level cost | 253578 | 364424 | 596047 |
| Result | cancel | emit 129s | cancel |

C's estimate is ~8.9x under, same degree as Bastrop's 8x, same
plan. Cost 364k → 596k is 1.6x for 1.9x the parcels. No
inversion. Nested Loop appears only on A, the only LIMIT
subquery. Identity-slice defect confirmed from a second
direction.

EXPLAIN cannot see vertex counts. Next licensed measurement is
`ST_NPoints` / `ST_Area` on `cities_ok` for 48209 vs 48021,
without executing 01.
