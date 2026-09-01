---
id: 2026-08-31_p2_juris_explain_a_b
title: EXPLAIN pair A Hays 30k vs B Bastrop full
date: 2026-08-31
last_updated: 2026-08-31
status: filed
plan_row: F-01
snapshot: EXPLAIN FORMAT TEXT no ANALYZE; 00 then two plans; same join; short-lived URI cleared
---

# Plans A and B differ

Operator pair. No ANALYZE. Nothing executed.

| | Plan A (Hays 30k, cancelled) | Plan B (Bastrop full, emitted) |
|---|---|---|
| Join on parcel_hits | Nested Loop | Hash Join |
| City side | Index Scan on `tx_city_boundary` per outer row | built once into a Hash |
| `st_intersects` | under the Nested Loop | Hash Join Join Filter |
| `parcels_six` est. | 1841 (actual 30000, 16x under) | 8018 (actual 62257, 8x under) |
| Top-level cost | 253578 | 364424 |

The cheaper-costed plan is the one that cancels. Cardinality
lie at the join, not only at the root.

Mechanism: `LIMIT 30000` inside `GROUP BY … ORDER BY` is opaque
to the planner. At 1841 estimated rows a Nested Loop plus
per-row city index scan looks cheap. At 30000 it is not.

The 30k cancel does not mean cost is not chunk-linear. It means
this cut wrecked the estimate and bought a worse plan. The
identity-slice method is a defect in the instrument.

Chunk-linear is confounded, re-opened. A `prop_id` range
(`>= X AND < Y`) is estimable from statistics. That does not
license a chunk size and does not explain full Hays.

Plan C (Hays-full EXPLAIN, no LIMIT subquery) is the missing
comparison. Not run in this pair.
