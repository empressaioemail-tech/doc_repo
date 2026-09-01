---
id: 2026-08-31_p2_juris_hays_06_timeout
title: Hays 06 bbox-reach × npoints cancelled at 180s
date: 2026-08-31
last_updated: 2026-08-31
status: filed
plan_row: F-01
snapshot: Factory join 96e3ef4 plus uncommitted 06; 00+06 one psql session; neondb fancy-fire-06136146 br-crimson-feather-aphfmy91 ep-lucky-truth direct; short-lived URI cleared
---

# Hays 06 cancelled at the licensed ceiling

Operator go for minted RO, CREATE TABLE refuse first, then Hays `00`+`06`. One heavy scan. Exit 3. Session wall **263687 ms** (~264 s) including connect and 00. URI never written; output leak check `postgresql://|npg_` = 0 hits. Raw `_inbox/2026-08-31_p2_juris_hays_06_raw.txt`.

## RO proven, not asserted

```
NOTICE: P2-JURIS RO armed: durable CREATE TABLE refused
        [cannot execute CREATE TABLE in a read-only transaction]
```

`00` set `default_transaction_read_only=on` and `statement_timeout=3min`. Durable `CREATE TABLE` refused. `CREATE TABLE` succeeding would have been the hole; it did not.

## Input snapshot (same as prior 00 runs)

```
 city_rows | county_rows | parcel_rows_raw | parcel_distinct_prop
      1222 |         254 |         1568849 |               981410
```

Database `neondb`, PostGIS 3.5. Denominator 981,410 still stands as an input count.

## What 06 did

`sql/p2-juris/06_bbox_reach_npoints.sql` scoped to Hays `48209`. No parcel GeoJSON. No `ST_Intersects` on parcel rings. Bbox columns only.

```
ERROR: canceling statement due to statement timeout
```

at `06_bbox_reach_npoints.sql:155` (the `SELECT` that would have emitted `BBOX_REACH_NPOINTS`).

A timeout is a finding, not a zero. No per-city reach, no npoints, no product. Hays 06 is **UNMEASURED**. Six-county TOTALS stays **UNMEASURED**. Nothing adopted.

## What this is not

Hays-full `01` already cancelled (wall 217 s on that earlier run). A Hays **completion** via 06 would have been the result worth recording, independent of whether it named the driver. This run did not complete.

Session wall 264 s minus the 180 s 06 cancel leaves ~84 s for connect plus 00. 00 is several statements; each carries the 180 s GUC. The cancel string is on the 06 `SELECT`, so 06 itself hit the ceiling. That does not license a claim that 06 costs the same as 01. 06 decodes no parcel rings. The remaining work is unnamed because the instrument did not emit.

Four cost fits on this card died by becoming predictions after one success. There was no success. No fifth fit. No "linear in parcels." No size licensed. Scout / `05_range` / `07` were not run. One heavy scan used.

```
leave_behind:
  - item: Hays 06 UNMEASURED (180s cancel). Scout then 05_range EXPLAIN then 07 remain licensed. A 07 completion is "this chunk completed in N seconds," not a width law.
    owner: integration
    plan_row: F-01
```
