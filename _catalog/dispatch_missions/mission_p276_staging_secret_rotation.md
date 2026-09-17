## Mission — P-276: every staging secret a service consumes is either rotated with the branch, or provably never changes

You launch no sub-agents (FAN-DEPTH 0). You build in `hauska-factory` and open a PR. You do not run
`staging-reset`, rotate or write any secret, or deploy.

### Where you work

`hauska-factory`, fresh clone from `origin/main` under `P:/tmp/` into a NEW directory, branch
`fix/p276-staging-secret-targets`. Declare the start commit (factory main `3f3e8be` at compile).
Register the clone under the property seat and remove the entry at close. Stay out of
`src/jobs/verify-walk.mjs` (P-301) and the rail writers (P-266/P-268).

### The row's premise, and a measurement that challenges it

- The row: LDT's `STAGING_ATOMS_DATABASE_URL` (Secret Manager, project
  `legacy-design-tools-prod`) was repointed by hand on 2026-09-16 (A-181, version 6 at
  15:30:29Z). `src/lib/secret-rotation.mjs` rotates `ROTATION_TARGETS`, a frozen two-key object
  (neondb, hauska_mcp), writing into ONE GCP project (`GOOGLE_CLOUD_PROJECT`, default
  `hauska-prod-497015`), so LDT's copy is never a target.
- **Measured by the integration seat 2026-09-17 ~12:10Z:** `factory-staging-reset` ran six times
  that day (for the six-county republish), and the factory's `STAGING_HAUSKA_MCP_URL` gained
  versions 12 to 17. Yet its latest value is **byte-identical** (sha256 prefix `fa8a30eaf4`) to
  LDT's `STAGING_ATOMS_DATABASE_URL` version 6, and LDT's secret connects to `hauska_mcp`. Host
  `ep-floral-grass-ap8jeuo4`, unchanged across the resets.
- So either the reset keeps the endpoint and credentials stable (and the strand the row predicts
  cannot happen today), or it changes them only under a condition that did not occur. Settle that
  at source before building anything.

### What to build

1. **Read `staging-reset.mjs` and the Neon calls it makes** and state exactly when the connection
   string it writes can differ from the previous one (a new branch id, a new endpoint, a password
   reset, a role change). Cite the lines. If it can never differ, say so and why.
2. **A drift control, in either case:** a check (test, or a verb the reset calls after rotating)
   that lists every staging connection secret any service consumes, across both GCP projects
   (`hauska-prod-497015`, `legacy-design-tools-prod`), and fails when a consumed staging secret is
   neither a rotation target nor proven identical to one. The list of consumers comes from the
   services' own configuration (Cloud Run env `secretKeyRef`s, read by field), not from memory.
   Say whether the check runs at reset time, in CI, or both, and what it can and cannot reach
   from each.
3. **If the value can change:** add the third target the row asks for (LDT's secret in its own
   project, with its branch record and project id), make the rotation dry run list all three,
   and add the test the row names. **If it cannot:** do not add a target that rotates nothing;
   close with the finding and the drift control.
4. Tests in both directions for whatever you build.

### Falsifiers, pre-register your answers first

1. A consumed staging secret missing from the targets, and not identical to one, fails the check
   (test).
2. The rotation dry run lists every target it would write, with its project (test or captured
   output).
3. Your answer to "can the written value change" cites the lines that decide it.

### Do not

- Run `staging-reset`, write or rotate any secret, deploy, or merge.
- Print any secret value; compare by hash.
- Touch the files named above as owned by other lanes, or launch sub-agents.

### Close

Snapshot; files touched; the PR with every CI check's literal conclusion string; the
can-it-change answer with citations; the consumer list with its source; the falsifiers with
evidence. `status`: `closed-partial` until the integration seat deploys the reset image and the
check runs once for real. `probe`: `{"notApplicable": "control lane; graded by the check's first
real run"}`. `subAgents`. `leave_behind`.
