---
id: 2026-08-31_p2_juris_01_timeout
title: Timed 01 cancelled at 180s on the join-rewrite plan
date: 2026-08-31
last_updated: 2026-08-31
status: filed
plan_row: F-01
snapshot: Factory join 96e3ef4 on seat/property-ctx-p2-juris-join; 00+01 in one psql session; neondb; operator-minted short-lived URI, cleared
---

# Timed 01 cancelled at 180s

Operator ran `00_session.sql` then `01_containment.sql` through
psql. Files from `P:/seat-worktrees/property/hauska-factory-p2-juris-join`
at `96e3ef4`, not Factory main. 01 is the join rewrite: sha
`1f57068a…`, 352 lines, zero literal `1/0`, 29 `county_fips`
references. 00 is byte-identical to main ignoring CR.

TOTALS stays UNMEASURED. Nothing adopted, written, or staged.
Timeout was not raised. Credential cleared.

## RO proof (verbatim)

```
NOTICE: P2-JURIS RO armed: durable CREATE TABLE refused
        [cannot execute CREATE TABLE in a read-only transaction]
```

Session settings: `neondb`, `read_only=on`,
`statement_timeout=3min`, PostGIS 3.5.

## Input snapshot (unchanged)

| city_rows | county_rows | parcel_rows_raw | parcel_distinct_prop |
|---|---|---|---|
| 1222 | 254 | 1568849 | 981410 |

`parcel_distinct_prop` still equals the reconcile denominator.

## TOTALS

None. 01 errored at line 352 (`SELECT … FROM totals t`) with
`canceling statement due to statement timeout` before emitting.
No `d_unincorporated`, no `d_in_city`, no `d_total`. Wall clock
271s (00 plus connection plus the 180s cancel).

## What this does and does not say

It does not contradict the live 05. That plan was Merge Join on
`county_fips`, cost 3.78e7, `isMillionRowCteNestedLoop` false.
A 3.78e7 estimate still does not complete 981,410 parcels against
1,222 city polygons inside 180s. The 05 plan already estimated
one row on that join. That was a bad estimate, not a count. Cost
is a planner number. Runtime is this cancel.

The plan gate was necessary and is not sufficient. It proved the
retired Nested Loop of two CTE scans was gone. Only a timed run
can prove the query finishes. This one did not.

This is not the same miss as `_inbox/2026-08-31_p2_juris_totals_finding.md`.
That query could never run (`1/0` in an aggregate, then Nested
Loop of two MATERIALIZED CTE scans). This query runs and does
not finish. First was a defect. This is a performance ceiling.

Do not raise `statement_timeout`. Do not adopt a new split.
A material divergence, if one ever emits, still names the join.

## Next measurement (not yet run)

Scope `decoded` to `county_fips = '48021'` only. Do not change
the join. Do not shrink `cities_ok` into a different predicate.
Bastrop denom is 62,257. If that emits inside 180s, the query is
correct and the issue is volume. If it also cancels, the Merge
Join is not doing what the estimate suggests.
