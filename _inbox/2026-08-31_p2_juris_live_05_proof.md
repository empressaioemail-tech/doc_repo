---
id: 2026-08-31_p2_juris_live_05_proof
title: Live 05 EXPLAIN — poison Nested Loop gone
date: 2026-08-31
last_updated: 2026-08-31
status: filed
plan_row: F-01
snapshot: integration P:/doc_repo; Factory join 96e3ef4 on seat/property-ctx-p2-juris-join; neondb fancy-fire-06136146 br-crimson-feather-aphfmy91
---

# Live 05 EXPLAIN

Instrument: Neon MCP `run_sql_transaction` on `fancy-fire-06136146` / `neondb` / `br-crimson-feather-aphfmy91`. `SET LOCAL statement_timeout = '30s'`. `SET LOCAL default_transaction_read_only = on`. SQL is `05_explain.sql` at Factory `96e3ef4`. Timeout not raised. Timed 01 not run. TOTALS stays UNMEASURED.

Raw plan: `_inbox/2026-08-31_p2_juris_live_05_plan.txt`.

## Classifier

`node` import of `sql/p2-juris/assert-explain-plan.mjs` against that file:

```
isMillionRowCteNestedLoop: false
hasNestedLoop: true
hasParcelsCte: true
hasCitiesCte: false
joinMethod: Merge Join
gate: PASS
```

The named poison (Nested Loop of CTE Scan on `parcels_six` and CTE Scan on `cities_ok`) is absent. `cities_ok` is inlined. The remaining Nested Loop is city × six-county via `tx_city_boundary_bbox_idx`, cost 5056, not the 981k parcel join.

## What the plan is

Outer join is Merge Join on `p.county_fips = co.county_fips`, cost 3.78e7 .. 3.79e7. That is not 1.06e10. Estimated rows on the join is 1, which is a bad estimate, not a count.

This is not Nested Loop of `CTE Scan on parcels_six` against an inlined city scan. That residual from the file-side review did not appear.

## What this does not do

It does not measure TOTALS. It does not run 01. A Merge Join with a 3.8e7 cost can still miss the 180s bound on execute. The gate was the plan shape. The plan shape passed.
