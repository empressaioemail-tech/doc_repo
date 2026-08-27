---
id: 2026-08-27_f02_writer_job_WDLL
title: WDLL — F-02 writer job: the engine atoms-writer as a recorded Factory job in us-east4 (gate 3 of the option A drain)
date: 2026-08-27
last_updated: 2026-08-27
status: approved (amended 2026-08-27, A-003)
applies_to: hauska-engine (image only), hauska-factory (job, run wiring, console row)
plan_row: F-02, F-03
parent_plan_row: P-81, P-82, P-83, P-84 (90_operations/OPS-16_texas_market_plan_of_record.md; the drain card _inbox/2026-08-26_cloud_loader_WDLL.md)
operator_go: 2026-08-27 ("give me the writer job and I will give it to a new agent")
decision: _decisions/2026-08-26_factory_model_law_and_option_a.md (option A); _decisions/2026-08-26_factory_program_and_hold_lifts.md
model_law: 19_the_instrument_contract.md; _blueprint/10_model.md; _blueprint/20_pipeline.md; _blueprint/40_rule_register.md
snapshot: doc_repo main d9a88d2 · hauska-engine main b402c8b (write boundary, batched links, lease v2, run-id refusal all on main) · hauska-factory main 07f48c2, PR #5 open green (lease-v2-migrate) · hauska_mcp: 011 applied 2026-08-27T01:05:58.913Z, atoms_writer_lease_v2 present, 0 rows · us-east4 has twelve factory-* jobs and no engine writer job · Bexar 48029 at 660,000 of 703,257 on the old shape, zero rows written since the freeze
owner: property seat, a new lane. Worktrees registered ahead of creation in _catalog/seat_register.json: P:/seat-worktrees/property/hauska-engine-writer on seat/property-writer and P:/seat-worktrees/property/hauska-factory-writer on seat/property-writer, both created from origin/main. The drain lane keeps hauska-engine-drain and the primary hauska-factory worktree; this lane never opens either. Deploys and job creation are recorded by this lane and verified by the planner.
---

# WDLL: F-02 writer job

Date: 2026-08-27  Status: approved  Operator approval: 2026-08-27

Gate 3 of the option A drain stopped for the right reason: the Bexar resume must run as a recorded Factory job next to the store, and no such job exists. The drain lane refused to fake it from a laptop. This card builds the runner and hands it back. It is Factory build work, the F-02 stage runner every later fill will use; it is not data processing, and it writes the serving store exactly once, in one bounded canary, to prove the runner is real.

## What already exists (read, do not rebuild)

The writer is `packages/engine-core/scripts/write-cad-parcel-roll-county.mjs` on engine `main` `b402c8b`, invoked as `pnpm --filter @hauska-engine/engine-core run write-cad-parcel-roll-county -- --county=48029 --apply --run-id=<uuid> [--batch=N] [--limit=N]`. It requires `CAD_PARCEL_ROLL_PATH=1`; it reads the CAD roll from `CORTEX_DATABASE_URL`, `TXGIO_DATABASE_URL`, or `DATABASE_URL` and writes atoms to `DATABASE_URL` or `SUBSTRATE_DATABASE_URL`; `--apply` on any county other than `48029` exits 2 with `OLD_SHAPE_FILL_FROZEN`; `--apply` without `--run-id` exits 2; the `HeldLease` is minted from the run id by `takeScopedLease` against `atoms_writer_lease_v2` and the write goes through the boundary and the batched links. None of that changes on this card.

The Factory pattern is in `hauska-factory`: a `node:20-slim` image built by `cloudbuild.yaml` into `us-east4-docker.pkg.dev/hauska-prod-497015/hauska-factory/`, jobs as `src/jobs/*.mjs` run by `node src/cli.mjs <cmd>`, each job calling `startRun(factory.client, …)` on `FACTORY_DATABASE_URL` and `refusePoolerHost(env.ATOMS_DATABASE_URL)` before touching the serving store, then `writeTermination`. `src/jobs/bexar-edges.mjs` is the closest sibling. The control plane's `start` verb (`src/control/api.mjs`) already writes a `runs` row. The engine's `cloudbuild.property-atom-bake.yaml` shows the engine monorepo being installed and run inside a build step with `DATABASE_URL` from Secret Manager.

The gap is that the Factory image carries no engine code and the engine has no job image. The writer must run from an image built out of the engine repository, and the run row must be written by the Factory, never by the engine image.

## Done looks like

A Factory run row is created (by the control plane's `start` verb or a Factory job), an execution of `factory-atoms-writer` in `us-east4` runs the engine writer with that run id against `hauska_mcp` on its direct host, the lease row appears under that run id while it runs and is gone after, the Factory writes the termination and the counts from the store, the console shows the run, and every refusal the writer already has fires as a recorded execution rather than as a laptop message. One bounded canary apply on 48029 proves the chain end to end. The drain lane then runs the full Bexar resume through this job and reports item 7.

## Acceptance items

1. **Engine writer image, built by digest from the engine repository.** Add `services/atoms-writer/Dockerfile` (base and native libraries per `services/engine-api/Dockerfile`; install the workspace; entrypoint runs `write-cad-parcel-roll-county` with the container args) and `cloudbuild.atoms-writer.yaml` (substitution `_IMAGE` under `us-east4-docker.pkg.dev/hauska-prod-497015/hauska-factory/hauska-atoms-writer`, tagged by the engine commit SHA). No change to the writer script or to any package under `packages/`; if the image needs one, stop and say so. | check: build from a clean `git archive` of engine `main`; the image digest recorded; `docker run … --list-counties` (or the script's no-op path) exits 0 inside the image | grade: [ ]

2. **The job exists in us-east4 and refuses without its inputs.** `factory-atoms-writer` created as a Cloud Run job in `us-east4` on the image **by digest**, with `CAD_PARCEL_ROLL_PATH=1`, `DATABASE_URL` and the CAD-source URL from Secret Manager (the atoms store secret must resolve to the `hauska_mcp` direct host, never a `-pooler` host, never `neondb`), CPU and memory sized like the landing jobs, task timeout long enough for a county. Creation is a script in the Factory repo (`scripts/jobs/atoms-writer.sh` or the repo's existing convention), not a shell one-liner remembered by one person. An execution with no args exits non-zero with the script's own usage message; an execution with `--county=48029 --apply` and no `--run-id` exits 2 with the run-id refusal; an execution with `--county=48021 --apply --run-id=<any>` exits 2 with `OLD_SHAPE_FILL_FROZEN`. All three recorded as executions with their exit reasons. | check: `gcloud run jobs describe` by field (image digest, secrets, region); three refusal executions named | grade: [ ]

3. **The run row is written by the Factory, keyed before the writer starts.** Either the control `start` verb or a new Factory job `src/jobs/atoms-writer-run.mjs` writes the `runs` row (phase `write`, target `cad_property:48029`, scope `(cad_property, 48029)`, snapshot fields the other jobs carry, `db_host_fingerprint` of the atoms host) and then executes `factory-atoms-writer` with `--run-id=<that id>` through the Cloud Run Jobs API, waits, and writes the termination from the execution result. If the run row cannot be written the writer is never started (`RUN_RECORD_UNWRITABLE`). The engine image never holds `FACTORY_DATABASE_URL`. | check: a run row exists before the execution's start time; a fixture with an unwritable Factory connection starts nothing | grade: [ ]

4. **Counts come from the store, not from the log.** After an execution the Factory reads `atoms_built` for the run (or, where the writer records it, rows with `updated_at >= run start` in scope) and writes them to `runs.counts`; the execution's stdout is stored as an artifact, not treated as the count. A run whose store count and log count disagree terminates `failed` with both numbers. | check: counts fields populated from a SELECT; a deliberately mismatched fixture fails | grade: [ ]

5. **Lease observed during and after.** While an apply execution runs, `atoms_writer_lease_v2` holds one row with `scope_type='cad_property'`, `scope_id='48029'`, and the run id; after termination the row is released. A second execution started during the first refuses with the lease's own code and is recorded as a refused run. | check: two reads by the planner or by the job (during, after); the second-execution refusal recorded | grade: [ ]

6. **Dry run on 48029, recorded.** One execution with `--county=48029 --limit=1000` and no `--apply`, under a run row, terminates `success` with zero serving-store writes (`atoms_built` unchanged, no lease row taken because no apply). | check: run row, execution, before and after counts equal | grade: [ ]

7. **Canary apply, once, bounded.** One execution with `--county=48029 --apply --limit=1000 --run-id=<run>`: the lease row is observed, the write goes through the boundary and batched links, `atoms_built` for 48029 moves by the number the writer reports, the run terminates `success` with counts from the store, and the atoms/s for that chunk is reported as a first reading against item 7's prediction (300, floor 150) without being the benchmark. This is the only apply on this card. If the chunk lands under 150 atoms/s, say so and stop; the drain lane decides. | check: before and after `atoms_built`; run row counts; lease observed; atoms/s reported with the chunk size and wall time | grade: [ ]

8. **Console row.** The run appears on the Smart Site Factory console's runs screen with phase, target, status, counts, and cost, read from the Factory store, not from a hand-declared file. | check: `GET /screens` on `factory-control` (authenticated) shows the run; the console renders it | grade: [ ]

9. **Handback to the drain lane.** Close artifact at `_inbox/2026-08-27_f02-writer-job_close.json` naming the image digest, the job, the creation script, the run ids of every execution (refusals, dry run, canary), the counts, and the atoms/s reading; `leave_behind` declared. The drain lane runs the full resume and reports item 7; this lane does not. | check: artifact filed; drain lane acknowledges | grade: [ ]

10. **Out of this card.** Any change to the writer script or the storage packages (drain lane); any county other than 48029; any apply beyond the one 1,000-row canary; the conformant writer (F-15 to F-18); the console operator-login proxy (F-04, its own card); laptop `--apply` of any kind. | check: pathspec on close; `notStarted` list | grade: [ ]

## Do not

- Run `--apply` from any machine that is not the `factory-atoms-writer` job. Item 25 of the drain card stands.
- Put `FACTORY_DATABASE_URL` in the engine image, or write the `runs` table from the engine.
- Connect to a `-pooler` host or to `neondb` for atoms. The Factory's `refusePoolerHost` is the model; the job's secret must resolve to the direct host.
- Deploy a job by tag. Digest only.
- Touch `hauska-engine-drain`, the primary `hauska-factory` worktree, or any file under `packages/` in the engine.
- Report a count from stdout. Read the store.
- Open a second apply "to get a better number". One canary.

## Amendments

- 2026-08-27 (collision ruling, OPS-19 A-003): the job is `factory-atoms-cad` (already Ready in us-east4 on digest `sha256:afdef0bb…`), not a new `factory-atoms-writer`; the lane finishing this card is the drain lane, the new agent is stood down and commits nothing. Items 2, 3, 4 bind as written against the existing job and the merged `bexar-cad` runner: no per-run job mutation (`--update-env-vars` is banned; args or container overrides through the Admin API), `APPLY` and `COUNTY` out of the job environment, counts from the store. Item 1 is satisfied by engine PR #364 once it is green and merged and the image is rebuilt from engine main with a frozen lockfile and re-pinned by digest. Items 5 to 9 unchanged. The second agent's uncommitted modules are salvage, not a parallel path.

## Finish card (graded at close)

(not yet)
