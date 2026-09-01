---
id: 2026-08-28_ctx_b_walk_sweep_production_publish_WDLL
title: WDLL — CTX card B: the walk sweeps an area, the publish run owns its walk, the production target is wired and refuses correctly, and the job runs per county
date: 2026-08-28
last_updated: 2026-08-28
status: approved
applies_to: hauska-factory (jobs/bastrop-publish, jobs/verify-walk, lib/publish-guards, cloudbuild.publish.yaml)
plan_row: F-06, F-07, F-08
depends_on: OPS-19 A-020 (Central Texas first), A-021 (standing production word for the six), the publish lane's A-017 commits on seat/property-publish (carried on this branch)
operator_go: 2026-08-28 ("they are all approved"; "spawn subagents to do everything and get this through to completion")
model_law: _blueprint/10_model.md (V3 access never defaulted, V6 situs refused at serve, V9 repoint before retire), _blueprint/40_rule_register.md (BP-SERVE-01, BP-SERVE-02, BP-CONFORMANT-01, BP-VERIFY-01), OPS-19 rule 6 (staging first, identical job second), 50_grading.md
snapshot: hauska-factory origin/seat/property-publish 9b27304 (5 ahead of main a70139a, 10 behind) · factory-bastrop-publish gen on image 2c7c6479 (args `--target=staging --county=48021 --skip-pmtiles`) · staging publish run e1b32af8 succeeded 06:17Z (tier 1 61,695 written of 77,799 conformant rows over 10 pages of 8,000, tier 2 61,695; stamp sourceVintage conformant-v1; walk_id null) · verify walk 6350cb8b passed 06:25Z on 5 parcels (gold 48021:34137, three smoke, the broken fixture) with no area sweep · production cortex-api serves LDT b8983157 (main is 6 ahead, all bake CLI or MCP search commits)
owner: planner-run subagent in P:/seat-worktrees/property/hauska-factory-ctx-publish on seat/property-ctx-publish (from origin/seat/property-publish 9b27304). The subagent produces the diff and the test output and hands back; it does not commit, push, deploy, or execute any job. The planner commits, merges, builds, creates secrets, and executes.
---

# CTX card B: sweep walk, walk ownership, production wiring, per county

Date: 2026-08-28  Status: approved

Bastrop is one walk away from production. The staging publish succeeded on the new shape and the walk passed on gold, but the walk covered five parcels with no area sweep, the publish run does not own its walk, and the production path has two guard defects that make it refuse always and pass vacuously at once. This card fixes the path so the identical job can run for six counties on the standing word.

## What the evidence says

**The walk has no sweep.** `runVerifyWalk` walks gold, three smoke parcels, `opts.sweepParcels` (never supplied), and the broken fixture. The card's item 6 requires at least ten more parcels chosen by area sweep, never by sampling one, and A-021 makes a passed sweep walk the precondition for production. The walk does assert `conformant-v1` provenance per layer (BP-CONFORMANT-01) and the broken fixture (BP-VERIFY-01), which is right and stays.

**The publish run does not own its walk.** With `--skip-walk` the publish stores `walk_id` null and the standalone walk never writes back, so `publish_runs.walk_id` is null on both succeeded staging runs.

**The production guard is wrong twice.** `requireStagingSibling` in `src/lib/publish-guards.mjs` finds the county with `SELECT county_fips FROM publish_runs WHERE id = $1` for the production run's own id, but that row is inserted only after the bakes, so the subquery is null and the guard refuses every production publish (`no passed staging sibling`) regardless of state. And `if (walkVerdict && walkVerdict !== "pass")` lets a sibling with no walk through, so once the first defect is fixed an unwalked staging run would authorise production. Over-broad and vacuous in one function.

**The production bake env falls back.** `bakeEnv` sets `DATABASE_URL: env.STAGING_NEONDB_URL ?? env.DEPLOYMENT_DATABASE_URL` for every target, so a production run with the job's current template would bake into the staging branches while stamping production. The job template carries only `STAGING_NEONDB_URL` and `STAGING_HAUSKA_MCP_URL`.

## Acceptance items

1. **Branch current.** Merge `origin/main` (a70139a) into `seat/property-ctx-publish`, resolve conflicts, `node --test` green. The lane's untracked scratch scripts are not carried. If `cloudbuild.publish.yaml` is not what built image 2c7c6479 (the lane's worktree holds an untracked `cloudbuild.publish.bundle.yaml`), make the tracked file the one that builds the publish and walk jobs with the bake bundle, and say so. | check: merge commit in the diff; test output; the tracked build file names both jobs | grade: [ ]

2. **Area sweep in the walk.** `verify-walk --sweep=<n>` (default 12, refuse below 10) selects the sweep by area, never by sampling: the parcels nearest the gold parcel by a rule you state (same situs street in the landing roll, or the nearest by landing geometry, or contiguous prop_ids in one subdivision) read from the Factory landing for the county, so every neighbour in the area is walked and a broken neighbour cannot hide. The walk body records `sweep: { rule, count, parcels }`. A walk with fewer than ten sweep parcels refuses and records why. | check: fixture with a seeded landing of 15 neighbours walks all of them; the under-ten refusal fixture | grade: [ ]

3. **The publish run owns its walk.** `bastrop-publish` without `--skip-walk` runs the sweep walk inline and stores `walk_id`; `verify-walk --publish-run=<id>` writes `walk_id` onto that publish run. A succeeded publish run without a walk is visible as such (`walk_id` null) and is never treated as walked. | check: fixture: publish then standalone walk links; the body shows the link | grade: [ ]

4. **The production guard is right.** `requireStagingSibling` takes the county from flags, requires the most recent succeeded staging run for that county to carry a `walk_id` whose walk verdict is `pass` and whose sweep count is at least ten, and refuses otherwise with a named code (`STAGING_SIBLING_REQUIRED`, `STAGING_SIBLING_UNWALKED`, `STAGING_SIBLING_FAILED`, `STAGING_SIBLING_NO_SWEEP`). The production publish row records `staging_sibling_id`. Verified by violation: fixtures for each refusal and one pass. | check: four refusal fixtures and one pass | grade: [ ]

5. **Production env, no fallback.** `bakeEnv` selects by target: staging reads `STAGING_NEONDB_URL` and `STAGING_HAUSKA_MCP_URL`; production reads `PRODUCTION_NEONDB_URL` and `PRODUCTION_HAUSKA_MCP_URL`; a missing variable for the selected target refuses with `TARGET_ENV_MISSING` before any bake; no `??` chain across targets. `OPERATOR_PUBLISH_GO` stays an execution-time environment override, never a template value; document the exact `gcloud run jobs execute` form in the job's header comment. `cloudbuild.publish.yaml` declares the two production secrets on the job template (`PRODUCTION_NEONDB_URL:latest`, `PRODUCTION_HAUSKA_MCP_URL:latest`); the planner creates the secrets. | check: refusal fixture; the build file diff | grade: [ ]

6. **Per county.** Confirm the job runs for any county the loop has written (`--county=<fips>`): the bakes scope by county, the freshness stamp and `publish_runs` row are per county and target, the staging reset is county-agnostic, and the served county ledger's `published_at` for that county moves. Where a Bastrop-only assumption remains (name, constant, path), remove it; the job name may stay until a rename card. | check: grep for `48021` and `bastrop` in the publish and walk code with each remaining occurrence justified | grade: [ ]

7. **Handback.** Final message to the planner: the diff summary by file, the full `node --test` output, the sweep rule chosen and why, each remaining Bastrop-only occurrence justified, the exact execute commands for staging reset, staging publish with sweep walk, and production publish for one county, and `leave_behind`. No commit, no push, no deploy, no job execution, no write to doc_repo. | check: handback | grade: [ ]

## Do not

- Commit, push, open a PR, deploy, or execute any Cloud Run job; the planner does those.
- Write to any store, staging included; tests use fixtures or an in-process fake.
- Print any DATABASE_URL, secret, or token.
- Change job templates by hand; `cloudbuild.publish.yaml` is the only place a job's command, args, env, or secrets live (A-019).
- Point production at staging branches or staging at production stores, in code or in a test.
- Pass the walk with presence checks; UNMEASURED is the grade for that.
