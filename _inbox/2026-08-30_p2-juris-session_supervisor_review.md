---
id: 2026-08-30_p2-juris-session_supervisor_review
title: Supervisor grade — P2-JURIS session rewrite
date: 2026-08-30
last_updated: 2026-08-30
status: active
lane: P2-JURIS-SESSION
plan_row: F-01
agent: 9ad676ef-f7e0-44d5-8be9-66392c330132
snapshot: integration P:/doc_repo; Factory tree P:/seat-worktrees/property/hauska-factory-p2-juris seat/property-ctx-p2-juris HEAD 7f41f52; supervisor re-ran node sql/p2-juris/_ro_session_guard.mjs ok true; live TOTALS UNMEASURED
---

# Supervisor grade — P2-JURIS session rewrite

Seat: integration on `P:/doc_repo`. Reviewed `sql/p2-juris/00` and `01`, not the handback. Did not persist. Did not mint a write URI. Did not print a connection URL.

## Verdict

Option 1 accepted. `01` is CTE-only. Live TOTALS stay UNMEASURED.

| Item | Grade | Evidence |
|---|---|---|
| CTE rewrite | MET | `01` is `WITH MATERIALIZED`. No `CREATE TEMP TABLE`. Zone-major is `FROM cities_ok c JOIN parcels_six p`. Floor `1e-8`. LATERAL only in comments. |
| Empty city fail-closed | MET | `00` and `01` RAISE if `tx_city_boundary` count is 0. Do not emit statewide unincorporated. |
| RO proof specified | MET as spec | `00` sets `default_transaction_read_only = on` and `CREATE TABLE p2_juris_ro_probe_must_not_exist`. Success of that CREATE is a RAISE. Caught refuse continues. |
| File-side both arms | MET | Supervisor: `_ro_session_guard.mjs` rejects a fixture with `CREATE TEMP TABLE` + `LATERAL`. Live 00–05 pass. |
| Persist | NOT THIS CARD | `03` UPDATE is commented. Guard fails on uncommented `UPDATE city_manifest`. |
| Live TOTALS | UNMEASURED | No RO URI in this seat's environment. Reconcile target stays 357,269 / 624,141 / 981,410. Material miss = join wrong. |

## Holes

1. **Live durable-write refuse is still unrun.** If Neon uses a SQLSTATE outside `25006` / feature_not_supported / insufficient_privilege, `ON_ERROR_STOP` aborts before TOTALS. Amend the WHEN list from that state. Do not catch `OTHERS`.

2. **`01` TOTALS uses `1/0` when `city_ok` is 0.** Belt after the RAISE. Do not treat that as the empty-city instrument.

3. **`04` is seed-only.** Parcel-matched `ALIAS_DISAGREE` is leave_behind so the 981k join is not run twice.

## What I did not do

Connect. Persist. Adopt a new split. Treat local initdb as a proof (they killed a hang; I did not retry).

## Next

Pathspec commit this SQL. Planner runs `00`+`01` on a short-lived RO URI. Persist waits on that reconcile, then the Cloud Run job on live `03` rows.
