## Mission — P-284: every stage records what it cost, so "Bell and Milam beat Burnet" is a query

You launch no sub-agents (FAN-DEPTH 0). You build in `hauska-factory`, including a migration,
and open a PR. You do not apply the migration to any store and you do not deploy; the integration
seat applies it to staging first.

### Where you work

`hauska-factory`. Fresh clone from `origin/main` under `P:/tmp/`, branch
`feat/p284-stage-telemetry`. Declare the start commit. Another lane (P-252) may be editing the
gate files (`publish-gate.js`, `gate-exclusion-classifier.mjs`, `publish-readiness-gate.mjs`,
`publish-gate-sched.mjs`); do not touch them. Number your migration after the highest one on
`origin/main` at the moment you open the PR, and re-check before merge (`0011a` was the highest
at `9171279`).

### Why

OPS-24 law 5: compute dollars and operator minutes per county per stage go on the stage's run
record, so commitment 3 (under 200 dollars of compute plus one hour of human review per
jurisdiction) can fire as a kill. At `9171279` nothing records either. The final teardown grepped
`src` for every cost-shaped name and found only property dollar values. `publish_runs` gives one
stage's wall-clock. `runs` (`src/control/runs.mjs`, `startRun`) and `termination_records`
(`src/control/termination.mjs`) exist and are the natural base; `parcel-envelope-cells` and
`parcel-setback-cells` wrote no row or cost counts on any of 14 sampled runs (A-179). The
operator's plan measures Phase 1 and Phase 2 by these numbers, and the decision on isolated
stores for Bell and Milam is to be made from them.

### What to build

1. **A durable per-(county, stage, run) record** that survives lease release: county FIPS, stage
   id (the thirteen OPS-24 stages, 0 to 12, as a checked enum), run id, started, ended, outcome,
   the stage instrument's verdict and its artifact path, rows written, and the manifest pin when
   one exists (P-187). Decide whether this extends `runs` or is a new table joined to it, and say
   why in the PR.
2. **Compute cost per record.** The Cloud Run job execution's billed CPU and memory seconds, from
   the execution itself, converted to dollars with the rate recorded next to the number and its
   source. Where a stage is not a Cloud Run execution, record `null` with a reason, never zero.
   Absent, zero and unmeasured are three different states.
3. **Operator minutes as a declared input.** No machine can measure them. Record them at the three
   operator stop points (a credential, a production write, a ruling) as a value with who declared
   it and when; `null` with a reason when not declared.
4. **The depth writers write it.** `parcel-envelope-cells` and `parcel-setback-cells` record rows
   and a record per run.
5. **The query.** A checked-in query (or view) that returns one county's per-stage figures and
   compares two counties stage by stage, normalised per 10,000 parcels. The scope's section 10
   lists the measures.
6. **A test that fails when a stage run ends without a record**, proven by violation.

### Falsifiers, pre-register your answers first

1. A run killed mid-stage still leaves a record with outcome and ended time (the reaper path).
2. A stage that is not a Cloud Run execution records cost as `null` with a reason, not `0`.
3. The comparison query returns a row per stage for two fixture counties, and a stage missing
   from one county shows as missing, not as zero.
4. The depth writers' dry runs produce records.

### Do not

- Apply the migration to any database, deploy, or run a writer against a store.
- Touch the gate files listed above.
- Launch sub-agents.

### Close

Snapshot; files touched; the migration's name and DDL; the PR with every CI check's literal
conclusion; the four falsifiers; the comparison query's output on fixtures. `status`:
`closed-partial` until the integration seat applies the migration on staging and a real run
writes a record. `probe`: `{"notApplicable": "build lane, migration not applied; graded when a
staging run writes a record"}`. `subAgents`. `leave_behind`.
