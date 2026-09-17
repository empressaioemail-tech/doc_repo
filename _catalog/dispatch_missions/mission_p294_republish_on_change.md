## Mission — P-294: a county is republished when its ledger changed (the stopgap)

You launch no sub-agents (FAN-DEPTH 0). You build in `hauska-factory` and open a PR. You do not
deploy, create or enable a schedule, or run a publish; the integration seat does, and the first
automated production run is on the operator's go.

### Where you work

`hauska-factory`, fresh clone from `origin/main` under `P:/tmp/` into a NEW directory, branch
`feat/p294-republish-on-change`. Declare the start commit (factory main `47c7dfc` at compile).
Register it under the property seat and remove the entry at close. Open factory work you must not
touch: PR #160 (P-256, `parcel-setback-cells.mjs`) and the P-298 lane
(`src/lib/parcel-record-engine/load.js`, a migration, `publish-gate-sched.mjs`).

### Why (P-230, A-189, A-190; the ruling that bounds you)

The bake customers read has no trigger; a ledger fix reaches a customer only when someone
republishes the county by hand, and each publish rewrites the whole county (Travis 873,766 rows).
The operator ruled both fixes: this stopgap, and P-295 (the surfaces read the ledger). Your job
lives inside the transition window ruled on 2026-09-17
(`_decisions/2026-09-17_ledger_serving_transition_and_retirement_order.md`): it keeps the bake
current, it does not become a permanent serving path.

### What to build

1. **A change signal that is cheap.** For each onboarded county, decide whether the ledger changed
   since the county's last successful production publish. Do not compute `max(updated_at)` over a
   county's cells (a heavy scan on a 76M-row table). Use records that already exist: writer run
   records (`runs`, `stage_run_records`), `parcel_gate_verdict` rows whose `evaluated_at` and
   verdict changed, and the publish run records for the last production publish per county. Name
   the tables and queries in CP1 with their plans.
2. **A job** (`republish-on-change`) that, per county, one at a time: reports changed or unchanged
   with the evidence; for a changed county runs the existing publish (staging first, then
   production) through `requirePreBakeReadiness`; takes P-281's lease (the publish already takes a
   job-execution lease on the target store; state how the two interact); writes a P-284 stage
   record naming the county, the trigger evidence and the cost. An unchanged county is skipped and
   says so.
3. **Dry run by default.** `--apply` is required to publish, and production additionally requires
   the `OPERATOR_PUBLISH_GO` convention the publish job already uses.
4. **A schedule definition**, checked in and not enabled, with its cadence proposal (the whole
   loop must fit comfortably inside the cadence given that one publish can take hours).
5. **The instrument's hook.** Record, per county, the served `bakedAt` the publish produces, so
   the integration seat can grade "served `bakedAt` is later than the latest cell write, within
   one cycle".

### Falsifiers, pre-register your answers first

1. A county with no writer run and no verdict change since its last publish is skipped, with the
   reason.
2. A county whose writer ran after its last publish is selected, with the run id as evidence.
3. Without `--apply`, nothing is published (test with a fake publish).
4. A publish that `requirePreBakeReadiness` refuses stops the job for that county and is recorded.

### Do not

- Deploy, create or enable a schedule, or run a publish.
- Touch P-256's or P-298's files.
- Launch sub-agents.

### Close

Snapshot; files touched; the PR with every CI check's literal conclusion string; the change-signal
queries with plans; the four falsifiers with evidence. `status`: `closed-partial` until deployed
and the first staging cycle is graded. `probe`: `{"notApplicable": "build lane; graded by served
bakedAt after a staging cycle"}`. `subAgents`. `leave_behind`.
