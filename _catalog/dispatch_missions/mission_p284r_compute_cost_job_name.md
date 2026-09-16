## Mission — P-284 remainder: the compute cost asks for the right job, and every record can be filled

You launch no sub-agents (FAN-DEPTH 0). You build in `hauska-factory` and open a PR. You do not
deploy; the integration seat rebuilds the images, including the reaper's.

### Where you work

`hauska-factory`, fresh clone from `origin/main` under `P:/tmp/` into a NEW directory, branch
`fix/p284r-compute-cost-job-name`. Declare the start commit (factory main was `afdda42` at
compile). Register it under the property seat and remove the entry at close. You touch
`src/lib/compute-cost.mjs`, `src/control/stage-runs.mjs`, their tests, and at most a nullable
column added by a new migration. The P-256 lane is open on `src/jobs/parcel-setback-cells.mjs`;
stay out of it.

### The finding (integration seat, 2026-09-16, proven both ways)

P-284 merged as `afdda42`; migration `0012` is applied; the setback writer image was rebuilt and
a Caldwell dry run (`factory-parcel-setback-cells-x9zmt`) wrote its stage record. Its compute
cost reads `BILLABLE_TIME_UNAVAILABLE: why=execution describe failed`, and it always will:

- `computeCostNowForSelf` (`src/lib/compute-cost.mjs:350`) calls
  `getExecution(execution, env, deps)` with no job name. `getExecution`
  (`src/control/cloudrun-jobs.mjs:342`) builds its URL with
  `executionResourceName(name, env, deps.jobName)`, and an undefined job falls to the default
  parameter `jobName()`, which returns `"factory-atoms-cad"`. The request goes to
  `jobs/factory-atoms-cad/executions/factory-parcel-setback-cells-x9zmt`: HTTP 404. The same
  execution under its own job returns 200.
- `backfillStageComputeCosts` (`src/control/stage-runs.mjs:708`) makes the same call the same
  way, so the fill-in path fails identically for every job except `factory-atoms-cad`.
- The backfill only selects records with a `run_id`. A dry run has none, and a job cannot read
  its own final billable time while it runs (`METRIC_NOT_YET_PUBLISHED`), so a dry-run record can
  never be costed, although P-284's own falsifier 4 says a dry run's cost is the one you want.
- The backfill runs inside `reap`, which Cloud Scheduler `factory-conformant-reap` executes on the
  `factory-conformant` job, whose image (`sha256:5e6ebba2...`) predates P-284. The integration
  seat handles that image; you only confirm in CP1 that `reap` is the one caller.

### What to build

1. Both calls name the execution's own job: `CLOUD_RUN_JOB` for the self-measurement, the run
   scope's `job` for the backfill (and refuse with a named reason when neither is known, never a
   default job).
2. A record can be costed after the fact without a run row: store the execution name (and job)
   on every stage record, and let the backfill select by execution name, dry runs included.
   If this needs a column, add it in a new migration with a nullable column; do not edit `0012`.
3. A test that fails if any cost lookup's resource name omits the job or names a job other than
   the execution's own (use `executionResourceName` directly, both directions).
4. Report, do not change: whether the job service account can read executions (the integration
   seat's own credential returned 200; the job's identity was never exercised because the URL was
   wrong first).

### Falsifiers, pre-register your answers first

1. The self-measurement for a `factory-parcel-setback-cells` execution requests
   `jobs/factory-parcel-setback-cells/executions/...`.
2. A dry-run record with an execution name is filled by the backfill once the metric is published.
3. Removing the job name from either call fails a test.

### Do not

- Change `cloudrun-jobs.mjs`'s default job for its other callers without listing every caller.
- Touch the setback writer, the gate files, or `0012`.
- Deploy, or launch sub-agents.

### Close

Snapshot; files touched; the PR with every CI check's literal conclusion string; the three
falsifiers with evidence; the caller list for `reap`. `status`: `closed-partial` until the
integration seat's rebuilt images write a measured cost on a real execution. `probe`:
`{"notApplicable": "build lane; graded by a stage record carrying a measured compute cost"}`.
`subAgents`. `leave_behind`.
