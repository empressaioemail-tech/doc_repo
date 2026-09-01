---
id: 2026-08-31_p2_juris_partition_record
title: P2-JURIS timed partition record
date: 2026-08-31
last_updated: 2026-08-31
# amended: A/B EXPLAIN; chunk-linear confounded not retired; identity-slice is instrument defect
status: filed
plan_row: F-01
snapshot: Factory join 96e3ef4; neondb; 00+01 one psql session each run; short-lived URI cleared each time; parcel_distinct_prop 981410 throughout
---

# P2-JURIS timed partition record

The file a next agent reads. Per-run notes stay in the cited
inbox files. This sheet is the board.

SQL home: `P:/seat-worktrees/property/hauska-factory-p2-juris-join`
at `96e3ef4`. Join is `p.county_fips = c.county_fips`. Floor
`1e-8`. No LATERAL. `statement_timeout` 180s, never raised.
RO proven each session by durable CREATE TABLE refuse.
Reconcile target remains 357,269 / 624,141 / 981,410. Nothing
adopted. Statewide TOTALS stays UNMEASURED.

## Timed runs

| Run | Scope | Result | Wall | File |
|---|---|---|---|---|
| Six-county 01 | all six, equality on | cancel at line 352 | 271s | `_inbox/2026-08-31_p2_juris_01_timeout.md` |
| Live 05 | unlimited EXPLAIN | Merge Join, 3.78e7, gate PASS | 30s bound | `_inbox/2026-08-31_p2_juris_live_05_proof.md` |
| Bastrop | `decoded` 48021 | emit 50265 / 11992 / 0 / 62257 | 129s | `_inbox/2026-08-31_p2_juris_bastrop_emit.md` |
| Probe6 | 48021, equality dropped | cancel | 230s | `_inbox/2026-08-31_p2_juris_probe6_timeout.md` |
| Caldwell | `decoded` 48055 | emit 14361 / 10628 / 0 / 24989 | 78s | `_inbox/2026-08-31_p2_juris_caldwell_emit.md` |
| McLennan | `decoded` 48309 | cancel | 263s | `_inbox/2026-08-31_p2_juris_mclennan_timeout.md` |
| Hays | `decoded` 48209 | cancel | 217s | `_inbox/2026-08-31_p2_juris_hays_timeout.md` |
| Hays 30k | `48209` `ORDER BY prop_id LIMIT 30000` | cancel (confounded: Nested Loop on 1841-est) | 218s | `_inbox/2026-08-31_p2_juris_hays30k_timeout.md` |
| EXPLAIN A vs B | Hays 30k vs Bastrop full, no ANALYZE | Nested Loop vs Hash Join | seconds | `_inbox/2026-08-31_p2_juris_explain_a_b.md` |
| EXPLAIN C | Hays-full, no LIMIT, no ANALYZE | Hash Join like B | seconds | `_inbox/2026-08-31_p2_juris_explain_c.md` |
| cities_ok npoints | 48021 vs 48209 | Hays 9.29× vertices; Austin 32811 | seconds | `_inbox/2026-08-31_p2_juris_cities_ok_npoints.md` |
| Austin present vs reached | overlap 0.001342 deg2; bbox 4142/116421 | real straddle, thin tail | seconds | `_inbox/2026-08-31_p2_juris_austin_present_vs_reached.md` |

Both emits: denom exact, 100% ring, `n_bbox_centre` 0, CDP
assignments 0, unresolved 0. Those profiles let the two-county
emit stand. The Hays 30k cancel does not retire parcel volume;
the slice predicate flipped the plan.

City touching-counts in the table below are roster figures
from `_inbox/2026-08-30_ctx_w3_collect_amendments.md`, not
`cities_ok` measured on these runs.

| County | Parcels | Roster touches | Result |
|---|---|---|---|
| Caldwell 48055 | 24989 | 8 | emit 78s |
| Bastrop 48021 | 62257 | 5 | emit 129s |
| McLennan 48309 | 114255 | 21 | cancel |
| Hays 48209 | 116421 | 13 | cancel (full). 30k cancel is instrument, not this row |
| Williamson 48491 | 282570 | 17 | expect cancel, not run |
| Travis 48453 | 380918 | 24 | expect cancel, not run |

## Mechanisms that lost

1. Nested Loop of two MATERIALIZED CTE scans. Retired by live 05
   and the join rewrite. The query runs. It does not always finish.
2. Neon MCP as the timed instrument. `-32001` is the HTTP client,
   not Postgres. `SET LOCAL` RO does not bind across MCP statements.
3. Parcel-only linear fit (~1.37 ms/parcel through Caldwell and
   Bastrop). Predicted McLennan ~156s. McLennan cancelled.
4. City-count (parcels × roster touches). Predicted Hays would
   emit against McLennan's cancel. Hays cancelled. Cities 5→21
   across the four measured counties predict nothing. The
   Hays 30k cancel does not retire parcels; see item 6.
5. Naming the Bastrop 6 by dropping equality against all 1,222
   cities. Same 62,257 parcels, ~100× city side, 180s cancel.
   Equality is what makes Bastrop tractable. The 6 stay unnamed.
   `49939` is a literal, not an identity set, so a 326-vs-320
   set-diff is starved.
6. Identity-slice as a cost instrument. `IN (SELECT … LIMIT
   30000)` is opaque. Planner estimated 1841 `parcels_six` rows
   (actual 30000, 16x under) and chose Nested Loop. Bastrop
   full, no LIMIT subquery, estimated 8018 (actual 62257, 8x
   under) and chose Hash Join. The cheaper-costed plan cancelled.
   This is a defect in the instrument, not a finding about Hays
   geometry. Ninth timed-runs row.
7. Austin vertex budget as the Hays cancel. Present and real
   (overlap 0.001342 deg2). Reached by 3.56% of Hays parcels.
   Vertex count is not per-parcel cost.

## Confounded, re-opened

Chunk-linear. Confounded by the A plan flip. Still live:
`prop_id >= X AND prop_id < Y` is estimable and should keep
Hash Join. No mechanism-backed prediction. An empirical test
of cost vs parcels at a fixed city set, not a confirmation.
Not licensed as a size. Not run this morning.

## What stands

Caldwell and Bastrop emit on Hash Join. Hays-full and
McLennan cancel on the same shape (C measured for Hays). The
Hays-full cancel is runtime. Nested Loop is a slice artefact.
Austin is a real Hays straddle and a thin tail. Cost driver
for Hays-full is un-named. Do not offer a fifth fit.

Do not raise 180s. Do not run Travis or Williamson. Do not
persist. Do not adopt a number. Do not pick a chunk size. Do
not cut another chunk with `IN (SELECT … LIMIT)`.

## Open

- The Bastrop 6 (320 slivers + 6 unnamed vs prior 49939). Honest
  cheaper probe, not yet run: unincorporated non-sliver Bastrop
  parcels against cities in an adjacent county that do not
  intersect 48021, same `1e-8`. Cities overlapping 48021 is the
  wrong cut.
- Cost driver for full Hays: **un-named**. Geometry is a fact
  and not the explanation (Austin real, 3.56% bbox reach).
  Four mechanisms lost: parcels-linear, city-count,
  chunk-linear (confounded), Austin vertex budget. Per-city
  bbox-reach × npoints is the measurement that would name the
  product. Offered, not licensed this morning. Range-chunk
  remains a live instrument without a mechanism-backed
  prediction.
- Sentinel `prop_id` `"0"` live in `txgio_parcel` (Bastrop
  `min(prop_id)` sampler). Leave-behind for persist.

Decision: `_decisions/2026-08-31_p2_juris_totals_unmeasured.md`.
