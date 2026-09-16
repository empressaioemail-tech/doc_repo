## Mission — P-281: a lease for job executions and heavy-scan windows

You launch no sub-agents (FAN-DEPTH 0). You build in `hauska-factory` (and hauska-engine's job
runners if they need the same client) and open PRs. The doc_repo side is a script and a note on
your seat branch; you do not commit to doc_repo main. You do not deploy or apply migrations.

### Where you work

Fresh clones from `origin/main` under `P:/tmp/`, branch `feat/p281-heavy-leases`. Declare start
commits. Factory PRs #157, #158 and #159 are open. #158 (P-284) adds a stage-record table and
touches `src/control/runs.mjs`; read it and build on its shape. Do not edit its files; rebase if
it merges first.

### The gap

AGENT_CONTRACT section 4: at most one heavy PostGIS or full-table scan at a time on a shared
database, announced before and confirmed after. Nothing enforces it:

- no registry, no lease, no check;
- the doc_repo traffic lease (`_catalog/leases/`, `.claude/hooks/traffic-lease-gate.mjs`) covers
  only Cloud Run traffic shifts, and only inside doc_repo-rooted sessions;
- Cloud Run jobs cannot read doc_repo files.

The blocker register's C17 holds 11 instances, including a scheduled job that wrote the verdict
table a walk was grading. The 2026-08-28 read-timeout incident is the precedent.

P-263, P-264, P-294 and Burnet's heavy stages all wait on this.

### What to build (design in CP1, then build)

1. **The lease lives where both jobs and sessions can reach it.** The factory store already has
   a `leases` table and a `factory-control` service. Read both, and decide in CP1 whether
   heavy-scan leases extend that table or get their own. A lease names the store, the window
   kind (`heavy-scan` or `job-execution`), the holder (job execution name or session seat), the
   start and expiry, and the county when there is one.
2. **Job side:** a runner helper that takes the lease before a heavy stage, refuses to start when
   another live lease holds the same store, renews while running, and releases in a `finally`.
   A crashed holder's lease expires; the reaper records it. Wire it into
   `parcel-setback-cells`, `parcel-envelope-cells` and the publish job's bake step, and name any
   other heavy job you find.
3. **Session side:** `scripts/heavy-scan-lease.mjs` (on your doc_repo seat branch): take,
   release and list leases through the factory-control API or a read-only check plus a
   documented take call. Say which in CP1, and name the credential it needs without printing it.
4. **Refusal record:** every refusal is written with the holder it lost to.

### Falsifiers, pre-register your answers first

1. Two runners racing for the same store: exactly one proceeds; the other exits non-zero with the
   holder named. Proven with two real processes against a local or test database.
2. A holder killed mid-run: its lease expires and the next runner proceeds after expiry, not
   before.
3. Different stores do not block each other.
4. **Named bypass:** a job or script that never calls the helper. List every heavy job that does
   not yet.

### Close

Snapshot per repo; files touched; PRs with every CI check's literal conclusion; the CP1 design
decision; the falsifiers; the bypass list. `status`: `closed-partial` until the integration seat
applies it on staging and runs two contending jobs. `probe`: `{"notApplicable": "control lane;
graded by a staging contention run"}`. `subAgents`. `leave_behind`.
