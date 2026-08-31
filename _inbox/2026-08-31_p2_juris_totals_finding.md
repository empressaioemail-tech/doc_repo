---
id: 2026-08-31_p2_juris_totals_finding
title: P2-JURIS TOTALS unmeasured — miss names the join
date: 2026-08-31
last_updated: 2026-08-31
status: active
snapshot: merged 00_session.sql + 01_containment.sql on hauska-factory main; RO session proven; no store write
---

# TOTALS unmeasured

Source: planning-agent RO run, operator-authorised. This seat
did not mint or see the URI. Verified the SQL by reading
`sql/p2-juris/01_containment.sql` on the migrate tree at
`dfe1e24` (ancestor of the merged files).

## RO proof

NOTICE: P2-JURIS RO armed: durable CREATE TABLE refused
`cannot execute CREATE TABLE in a read-only transaction`, on
merged `00_session.sql` unmodified.

The production owner URI was not revoked. Session-level
read-only is what was proven.

## Input snapshot (not a join result)

| city_rows | county_rows | parcel_rows_raw | parcel_distinct_prop |
|---|---|---|---|
| 1222 | 254 | 1568849 | 981410 |

981,410 matches the reconcile denominator. Inputs are sound.

## Finding 1 — query cannot run

`01_containment.sql:202`:

```
CASE WHEN (SELECT n FROM city_ok) = 0 THEN (1 / 0)::bigint
     ELSE count(*) FILTER (WHERE disposition = 'unincorporated')
END AS unincorporated
```

A literal `1/0` in a CASE inside an aggregate target list
evaluates regardless of the condition. Confirmed both ways by
the planning agent: the same CASE outside an aggregate returns
42; inside one it errors. `city_ok` is 1,222. The DO block at
lines 26-34 already refuses an empty city table and ran. Line
202 is redundant and fatal. Delete the CASE. Keep the DO block.

## Finding 2 — after the guard, the join is unusable

Nested Loop cost 1.06e10. CTE Scan on `parcels_six` (~1,043,462)
x CTE Scan on `cities_ok` (~811). About 846 million geometry
comparisons. Both sides are CTE scans, so no index. The bbox
predicates are a filter inside the loop. Zone-major in shape,
not in effect. 180s timeout is not the fix.

`05_explain.sql` currently `LIMIT 1` and says that proves join
shape, not the 981k plan. That is why the file-side zone-major
grep passed and the live plan did not.

## What is not claimed

Containment is cheaper than alias hand-seeding: unproven. The
1.3s figure was the city-to-county roster (1,222 x 254).

A new 357,269 / 624,141 / 981,410 split: not measured. Not
adopted.

## Next

1. Drop the CASE. Keep the DO block. Fixture that `01` has no
   `1/0` in an aggregate. In flight on
   `P:/seat-worktrees/property/hauska-factory-p2-juris-plan`
   (`seat/property-ctx-p2-juris-plan`). Not the join rewrite.
2. `05_explain.sql` explains the unlimited join. A plan with a
   Nested Loop of those two CTE scans fails the gate. Another
   timed run waits on a passing plan.
3. The lane chooses the plan change. No LATERAL is still the
   rule. This seat will not guess the rewrite.
