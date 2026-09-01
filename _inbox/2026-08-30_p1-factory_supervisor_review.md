---
id: 2026-08-30_p1-factory_supervisor_review
title: Supervisor grade — P1-FACTORY controls
date: 2026-08-30
last_updated: 2026-08-30
status: active
lane: P1-FACTORY
plan_row: F-08
agent: 2f6084cb-2b20-413a-94d4-b6352e875591
snapshot: integration P:/doc_repo; Factory tree P:/seat-worktrees/property/hauska-factory-p1-controls seat/property-ctx-p1-factory HEAD 7f41f52; uncommitted; no migrate; no job
---

# Supervisor grade — P1-FACTORY

Seat: integration on `P:/doc_repo`. Reviewed the write path in Factory tree A, not the handback. Re-ran `node --test test/p1-controls.test.mjs` in that tree: 10 pass, 0 fail. Did not commit. Did not apply 0005a or 0005b.

## Verdict

Items 1–3 accepted. Item 4 accepted as the SQL split and the table gate. Not accepted as a live `alias-persist --apply` arm. Migrations stay unapplied.

| Item | Grade | Evidence |
|---|---|---|
| 1 four-state walk | MET | `classifyRequiredLeaf` refuses null. `gradeParcelResponse` returns `BP-CONTENT-01` on all-null and on `landUse` null plus a land-use atom. `asOf === requestClock` refuses. Identical `absent-verified` basis refuses. Gold `48021:34137` four-state passes. The all-null-passes assertion is gone; `publish.test.mjs` now rejects that fixture. |
| 2 refuse missing county | MET | `parseConformantFlags` calls `requireCountyFips(flagValue(argv, "--county"))`. No `county: BASTROP` init. Both `--county=` and spaced forms. `99999` is `COUNTY_UNKNOWN`. Close line carries `runScope.county`. `loadBastropLanding` remains a deprecated wrapper, not a CLI default. |
| 3 collect gate | MET | `requireCollectComplete` is a `SELECT FROM import_ledger` in `src/control/`. `runConformant` calls it on `--apply` before `startRun`. Empty / disagree / `0/0` refuse. `cad_property` 77799/77799 passes. `_inbox/` is not on the path. |
| 4 0005 split | PARTIAL | `0005a` is Factory-store schema, no `'absence'` seed values, CHECK `kind <> 'absence' OR probed_at IS NOT NULL`. `0005b` is `migrations/bake/` only; `applyMigrations` `readdirSync`s `migrations/` and does not enter `bake/`. Letter suffix filter matches `0005a`. Live Postgres CHECK and live `alias-persist --apply` are not this card. |

## Holes

1. **`applyAliasLandingRows` writes only when the test injects `insertLanding`.** A `pg` client has `query` and no `insertLanding`. After `requireAliasLandingTable` succeeds it still increments `wroteLanding` and never `INSERT`s. Same starve as the earlier alias-persist `--apply` that reported a write and wrote nothing. Acceptance named `alias-persist --apply`. That job is still on `origin/seat/property-ctx-walk-alias-schema` and does not call this gate.

2. **Item 4 fail arm for the CHECK is a JS mirror plus a regex on the SQL file.** `absenceProbedCheck` is not Postgres. The live arm is planner `INSERT kind=absence probed_at NULL` after 0005a is applied. Named in their CP2. Still true.

3. **`requireCollectComplete` takes `county` and does not query it.** `import_ledger` has no county column (0001). The gate is table-grain. Honest. A Travis `--apply` is allowed by a statewide `cad_property` two-count. Do not pretend this is per-county collect-complete.

4. **0005a still INSERTs Elgin and Lockhart as `sourced` with sentinel `source_url` values** (`elgin-warmed-cohort`, `lockhart-ordinance`) and `source_url_verified_at` NULL. Those are the sentinels the card named. They are not the eight absence seeds. `verified_at` NULL is the honest half. A nonempty sentinel still satisfies `sourced`.

## What I did not do

Commit the worktree. Apply 0005a to `FACTORY_DATABASE_URL`. Apply 0005b to either bake `neondb`. Start a job. Port `alias-persist`. Treat the 276-test headline as verified (I re-ran the ten control tests only).

## Next

Planner commits by explicit pathspec on operator word. Then apply 0005a to the Factory store and prove the CHECK with a live `INSERT`. Apply 0005b to `STAGING_NEONDB_URL` / `PRODUCTION_NEONDB_URL` only. Wire `alias-persist --apply` to `requireAliasLandingTable` and to a real `INSERT`, not `insertLanding`. Do not apply drafted 0005. Gate 8 county-scoped job form waits on this refuse existing **in a deployed image**, not on this close file.
