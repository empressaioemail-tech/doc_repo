---
id: 2026-08-30_alias-persist-job_supervisor_review
title: Supervisor grade — alias-persist job calls applyAliasLandingRows
date: 2026-08-30
last_updated: 2026-08-30
status: active
lane: ALIAS-PERSIST-JOB
plan_row: F-08
agent: 5c4fb951-5b07-4eca-8861-10886e5ee6e9
snapshot: integration P:/doc_repo; Factory tree P:/seat-worktrees/property/hauska-factory-p1-controls seat/property-ctx-p1-factory HEAD 57e8b66; supervisor re-ran test/alias-persist-job.test.mjs plus test/p1-controls.test.mjs 13/13
---

# Supervisor grade — alias-persist job wire

Seat: integration on `P:/doc_repo`. Reviewed `writePersistedAlias` and `runAliasPersist`, not the handback. Did not apply 0005b. Did not start a job.

## Verdict

`--apply` on this tree goes through `applyAliasLandingRows`. The mock write is gone.

| Item | Grade | Evidence |
|---|---|---|
| Missing table | MET | `runAliasPersist --apply` with empty `information_schema` is `ALIAS_TABLE_MISSING`. No INSERT. `insertLanding` not called. |
| Real INSERT | MET | One `INSERT INTO landing_cad_txgio_alias` via `client.query`. `wroteLanding` equals INSERT count. A client with only `insertLanding` is `ALIAS_LANDING_WRITE_REFUSED`. |
| Planner does not claim a write | MET | `persistCadTxgioAliasBinds(apply=true)` keeps `wroteLanding` at 0 until `writePersistedAlias`. |
| Laptop freeze | MET | No `FACTORY_ALIAS_PERSIST_GO=1` is `ALIAS_PERSIST_GO_REQUIRED`. GO without a run row is `RUN_ROW_REQUIRED`. Gate runs before `openAliasPersistStores`. |

## Holes

1. **ctx-publish still prefers `insertLanding`.** That tree was read, not written. Do not run `--apply` from `seat/property-ctx-walk-alias-schema`.

2. **0005b is still unapplied.** Live INSERT waits on bake `neondb` only. Do not apply drafted 0005. Do not apply 0005b to Factory.

3. **`writtenByFips` increments once per planned row if any landing write happened.** It is not a per-row INSERT count. `assertExpectedCounts` only fails a zero on a positive floor. Do not treat it as the write instrument.

## What I did not do

Apply 0005b. Start a Cloud Run job. Treat 279 as verified (re-ran the three job tests and the ten P1 controls).

## Next

Pathspec commit this tree. Live INSERT after 0005b on bake `neondb`. Ignore or retire the walk-alias `insertLanding` copy.
