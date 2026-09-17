## Mission — P-285: a runner that takes one county through the thirteen stages, with records

You launch no sub-agents (FAN-DEPTH 0). You build in `hauska-factory` and open a PR. You do not
run the runner against any county with `--apply`, and you run no stage job; the integration seat
does, starting with Burnet.

### Where you work

`hauska-factory`, fresh clone from `origin/main` under `P:/tmp/` into a NEW directory, branch
`feat/p285-county-runner`. Declare the start commit (factory main `47c7dfc` at compile). Register
it under the property seat and remove the entry at close. Other factory lanes may be open (P-256
on `parcel-setback-cells.mjs`, P-298 on `load.js` and the scheduler, P-294 on a new
republish job); you add a new job and a new library, and edit shared files only where you must
(the CLI registry), saying so in CP1.

### Why

OPS-24 law 3: Burnet is the first county through the farm, and the farm's machinery is built and
refined during that run. The farm has rows for its manifest (P-187), merge gate (P-198) and
per-stage checks (P-197), and no runner. P-284 (stage and cost records) and P-281 (heavy-scan
leases) are live as of 2026-09-17, which is what this row waited on. The thirteen stages and
their predicates are the table in `90_operations/OPS-24_county_to_serving_program.md` section 2
(P-186 to P-198). Read it and the OPS-24 preamble's laws before designing.

### What to build (a skeleton that is honest about what it cannot do yet)

1. **The runner** (`county-runner`): exit-bounded, one county per invocation, stages 0 to 12 in
   order. For each stage: the job or step it runs today (name the existing Cloud Run job or
   script per stage in CP1, and mark a stage `not-built` where none exists), the stage's
   instrument, and the stop rule. It refuses to continue past a failed instrument and records why.
2. **The manifest.** The runner refuses to start without a pinned manifest naming the LDT,
   engine and factory commits and the two package versions (P-187's four lines). If P-187 has not
   landed, define the file format in CP1 so P-187 adopts it rather than inventing a second.
3. **The three stop points.** A new credential or secret mount, a write to a production serving
   store, and a ruling: the runner stops before each, records that it stopped and why, and
   resumes only with an explicit flag naming the stop point that was cleared.
4. **Records.** Every stage writes a P-284 stage record (started, ended, outcome, the instrument's
   verdict, cost), and heavy stages take P-281's lease through the jobs that already take it.
5. **Dry run by default.** Without `--apply` the runner prints the plan (stage, job, instrument,
   stop point) and executes nothing. With `--apply` it executes one stage at a time and waits for
   each execution to end.
6. **Resume.** A stopped or failed run resumes at the stage that did not finish, reading its own
   records, never re-running a completed stage silently.

### Falsifiers, pre-register your answers first

1. Without a manifest, the runner refuses.
2. A stage whose instrument fails stops the run, and the next invocation resumes at that stage.
3. The runner stops before the production publish stage and does not continue without the flag.
4. A dry run for 48053 (Burnet) prints all thirteen stages with their jobs and marks the
   not-built ones, with no execution and no store write beyond its own telemetry.

### Do not

- Execute any stage job, or run the runner with `--apply`.
- Touch P-256's, P-294's or P-298's files beyond the CLI registry.
- Launch sub-agents.

### Close

Snapshot; files touched; the PR with every CI check's literal conclusion string; the stage-to-job
table; the manifest format; the four falsifiers with evidence. `status`: `closed-partial` (a
skeleton, refined during the Burnet run). `probe`: `{"notApplicable": "build lane; graded by
Burnet's run records"}`. `subAgents`. `leave_behind`.
