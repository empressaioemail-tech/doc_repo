## Mission — P-298: the gate scheduler reads one rail's cells, not a whole county's, and takes the lease

You launch no sub-agents (FAN-DEPTH 0). You build in `hauska-factory` and open a PR. You do not
apply any migration or build any index on a live store; the integration seat does, under a lease.

### Where you work

`hauska-factory`, fresh clone from `origin/main` under `P:/tmp/` into a NEW directory, branch
`fix/p298-scheduler-read-shape`. Declare the start commit (factory main `47c7dfc` at compile).
Register it under the property seat and remove the entry at close. Factory PR #160 (P-256) is
open on `src/jobs/parcel-setback-cells.mjs`; stay out of that file.

### The finding (A-196, measured 2026-09-16)

- The per-rail page query in `src/lib/parcel-record-engine/load.js` is
  `SELECT place_key, cell_state FROM parcel_record_cell WHERE place_key > $1 AND place_key < $2
  AND rail_key = $3 ORDER BY place_key LIMIT $4`. `EXPLAIN` for Bastrop and for Travis both use
  `parcel_record_cell_pkey (place_key, rail_key)`, so each rail pass walks every rail's index
  entries in the county (about 24.7M for Travis) to return one rail's.
- `parcel_record_cell`: 76M rows, 18 GB heap, 7.6 GB indexes; existing indexes are the primary
  key, `parcel_record_cell_rail_idx (rail_key)` and `parcel_record_cell_unaccounted_idx`.
- With a warm cache the six counties took 33 minutes (20:00Z); cold, Travis took about six
  minutes per rail waiting on `Neon/PS_ReadIO`, which would have run past the job's 6-hour
  timeout. The integration seat cancelled that run.
- `load.js` is the vendored engine emit ("do not edit by hand"); P-252 already diverged it once,
  with the divergence recorded in `ENGINE_PIN.json` and pinned by `test/engine-pin-divergence.test.mjs`.
- `src/db/migrate.mjs` runs each migration inside a transaction, so a `CREATE INDEX
  CONCURRENTLY` cannot run through it.
- The scheduler (`src/jobs/publish-gate-sched.mjs`) is on P-281's list of heavy jobs that take no
  lease.

### What to build

1. **The index.** A migration (or a separate, clearly named non-transactional step, if the
   migrate job cannot run it) that creates an index serving the per-rail range read, for example
   `(rail_key, place_key)`, built without blocking writes. State its size estimate and build time
   estimate from the table's own statistics (read-only), and the exact command the integration
   seat will run.
2. **The plan proof.** Show, with `EXPLAIN` on a scratch copy of the schema with realistic
   statistics (or on the live store read-only after the index exists on a branch, if you can do
   that without writing production), that the query uses the new index for Travis and Bastrop. If
   the planner still prefers the primary key, say so and propose the smallest query change,
   recorded as a vendored divergence exactly the way P-252 recorded its own.
3. **The lease.** `publish-gate-sched` takes P-281's lease on the factory store for its run
   (`grantHeavyScanLease` before work, `assertHeld` at each (county, rail) boundary, close in a
   `finally`), using the store key of `FACTORY_DATABASE_URL`, with tests.
4. **The timing.** A small read-only timing harness that times one rail pass for a named county,
   so the integration seat can grade the change cold and warm.

### Falsifiers, pre-register your answers first

1. The per-rail query's plan uses the new index for Travis (paste the plan).
2. A scheduler run refuses `LEASE_HELD` when another holder has the factory store (test).
3. Removing the lease wiring fails a test.

### Do not

- Run `CREATE INDEX` or any DDL against a live store, or run the scheduler.
- Run a heavy scan on the factory store while the integration seat's lease on it is live
  (holder `integration-p252-apply`); check `scripts/heavy-scan-lease.mjs list` first.
- Touch `parcel-setback-cells.mjs`, or launch sub-agents.

### Close

Snapshot; files touched; the PR with every CI check's literal conclusion string; the index
command and its estimates; the plans; the three falsifiers with evidence. `status`:
`closed-partial` until the index is built and a cold six-county run is timed. `probe`:
`{"notApplicable": "build lane; graded by a timed cold scheduler run after the index is built"}`.
`subAgents`. `leave_behind`.
