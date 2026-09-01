---
id: 2026-08-31_bake-0005b_supervisor_review
title: Supervisor grade — bake-migrate 0005b
date: 2026-08-31
last_updated: 2026-08-31
status: active
lane: bake-0005b
plan_row: F-08
agent: 65497160-eab3-4c2f-9d19-f39552be47a7
snapshot: integration P:/doc_repo; Factory tree P:/seat-worktrees/property/hauska-factory-bake-migrate seat/property-ctx-bake-migrate HEAD a7a804220ad046ac3c70e286d61c83595bb3afe3; uncommitted; 0005b not applied
---

# Supervisor grade — bake-migrate 0005b

Seat: integration on `P:/doc_repo`. Reviewed the write path, not the handback. Re-ran `node --test test/bake-migrate.test.mjs`: 14 pass / 0 fail. Did not apply. Did not pin a Cloud Run job. Did not commit.

## Verdict

File-side accepted. Customer-done is the planner pin, then dry, then `--apply` on staging then production. That has not started.

| Item | Grade | Evidence |
|---|---|---|
| Reads `migrations/bake/` only | MET | `listBakeMigrationFiles` readdir of `migrations/bake`. Factory `listFactoryMigrationFiles` is non-recursive on `migrations/`. Live files: `0005a` in Factory dir, `0005b` in bake/. SQL is `landing_cad_txgio_alias`, not `breadth_*`. |
| `--target=` form | MET | Missing → `BAKE_TARGET_REQUIRED`. Space form → `BAKE_TARGET_FORM`. CLI both fire. |
| Factory URL refuse before connect | MET as specified | `assertNotFactoryUrl` runs before `connectBakeNeondb`. Fail arm: `STAGING_NEONDB_URL` = `FACTORY_DATABASE_URL`, `connectFn` 0. Comparative, not intrinsic. See residual. |
| Record not a count | MET file-side | INSERT `(filename, invocation)` precedes file SQL. INSERT fail → `RECORD_UNWRITABLE`, `readSql` not called, ROLLBACK. |
| New job, bake secrets only | MET | `factory-bake-migrate` in `cloudbuild.publish.yaml`. Secrets are `STAGING_NEONDB_URL` and `PRODUCTION_NEONDB_URL` only. Template args `bake-migrate` with no `--target=` so a bare execute refuses. |
| alias-persist unweakened | MET | Missing table still `ALIAS_TABLE_MISSING`, no INSERT. |
| Did not apply | MET | No Cloud Run execute. Laptop `--apply` is `LAPTOP_WRITE_FROZEN` before connect. |

## Residual

`FACTORY_URL_REFUSED` compares the resolved URL to `FACTORY_DATABASE_URL` in env (string or host/db fingerprint). The deployed job does not mount `FACTORY_DATABASE_URL`. On that job the comparative check is starved. The live split is the secret list. A Secret Manager mis-wire of `STAGING_NEONDB_URL` to the Factory store would not trip this refuse. Before `--apply`, confirm those two secrets are bake neondb, not Factory.

## leave_behind

- Commit this tree by pathspec. Do not add `node_modules`.
- Pin `factory-bake-migrate`. Dry `--target=staging`. Then `--apply`. Repeat production.
- Never `factory-conformant-migrate`. Never a laptop. 0005b stays unapplied until that execute.
