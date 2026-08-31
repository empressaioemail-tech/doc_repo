---
id: 2026-08-31_p2_juris_scout_emit
title: Hays scout chunk bounds completed; no mechanism; stop
date: 2026-08-31
last_updated: 2026-08-31
status: filed
plan_row: F-01
snapshot: Factory join 96e3ef4 plus uncommitted scout; RO prefix + scout one session; no 00 snapshot; neondb fancy-fire-06136146 ep-lucky-truth direct; URI cleared
---

# Hays scout completed

Operator go after the 06 cancel. Pre-run ruling `_inbox/2026-08-31_p2_juris_06_ab_and_ceiling.md`. Exit 0. Session wall **2147 ms**. Leak check 0. Raw `_inbox/2026-08-31_p2_juris_scout_raw.txt`.

## RO proven, not asserted

```
NOTICE: P2-JURIS RO armed: durable CREATE TABLE refused
        [cannot execute CREATE TABLE in a read-only transaction]
```

`00` was not run. Its 981k snapshot is not cheap. Prefix only set `read_only=on` and refused durable `CREATE TABLE`.

## Emit

| report | county_fips | target_distinct | lo_inclusive | hi_exclusive | county_distinct | chunk_distinct_verified |
|---|---|---:|---|---|---:|---:|
| SCOUT_CHUNK_BOUNDS | 48209 | 40000 | 100002 | 159378 | 116420 | 40000 |

`county_distinct` 116420 is Hays minus sentinel `prop_id` `'0'`. Board denom 116421 includes that sentinel. Text order, not numeric. `chunk_distinct_verified` 40000 matches the target. Bounds are real. They are not a license to run `07`.

## What this settles, and what it does not

Parcel `DISTINCT prop_id` plus a 40k text-range count on Hays finished in **2.1 s**. The 06 180s cancel is not "enumerating 116k keys is expensive."

That is not a mechanism that separates A from B on `01`. Scout does not decode rings, does not join city polygons, and does not compute bbox reach. City-side alone was already measured (`_inbox/2026-08-31_p2_juris_cities_ok_npoints.md`, Hays 13 / 43205 npoints). This run is the parcel-key side. The product that 06 actually timed out on was not measured. **A remains unestablished. B remains live and unmeasured.**

No fifth fit. These bounds do not say cost is linear in range width. `05_range` and `07` were not run.

## Stop

Six heavy scans already ran. Two small counties emitted. Every Hays attempt cancelled. Scout produced bounds, not a mechanism. Per the pre-run ruling: do not take a seventh scan. Stop optimizing the interactive query. Move containment onto the P2 job template (Factory #40 `dfe1e247`): chunk, ledger, resume, one run row per chunk. 180s is a property of this psql session, not of the work.

TOTALS stays UNMEASURED. Nothing adopted.

```
leave_behind:
  - item: P2-JURIS containment on the job template (chunk/ledger/resume). Interactive 01/06/07 stopped. Bounds 100002/159378 unused until a job writes them.
    owner: property seat
    plan_row: F-01
```
