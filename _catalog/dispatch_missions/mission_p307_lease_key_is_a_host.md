## Mission — P-307: a heavy-scan lease is keyed on a real store or it is refused

You launch no sub-agents (FAN-DEPTH 0). You build in `hauska-factory` and open a PR. You do not
merge or deploy; the integration seat deploys `factory-control` after merge. Any doc_repo change
(the session client `scripts/heavy-scan-lease.mjs` and its self-test) is handed back as a diff
in your close for the integration seat to commit, never committed by you.

### Where you work

`hauska-factory`, fresh clone from `origin/main` under `P:/tmp/` into a NEW directory, branch
`fix/p307-lease-key-is-a-host`. Declare the start commit (factory main `c5622d0b` at compile).
Register the clone under the property seat and remove the entry at close. Do not take, renew or
release any live lease belonging to anyone else, and do not use a live lease as a test fixture.

### The finding (A-207, measured 2026-09-17 15:20Z)

- `node scripts/heavy-scan-lease.mjs list` showed, live at the same time:
  - store `factory-store`, holder `p266p268-lane` (session-seat, phase
    `p266p268-final-census`), alias `FACTORY_DATABASE_URL_RO`;
  - store `ep-round-base-au0jofwp.c-10.us-east-1.aws.neon.tech`, holder
    `factory-publish-gate-sched-jcljc` (job-execution, phase `publish-gate-sched`), alias
    `FACTORY_DATABASE_URL`.
- `FACTORY_DATABASE_URL` and `FACTORY_DATABASE_URL_RO` both resolve to host
  `ep-round-base-au0jofwp.c-10.us-east-1.aws.neon.tech`. So one store carried two concurrent heavy
  windows (a lane's census scan and the hourly gate apply), and both callers were told they held
  the store.
- Cause, by reading the code: `canonicalStoreKey` in `src/control/heavy-lease.mjs` treats any
  string without a scheme as a bare host, so `factory-store` passes as a host and becomes its own
  contention key. The function's own header names this failure ("both would take successfully,
  both would scan, and every test in this file would still pass").
- Second mechanism considered and rejected: the service might resolve `factory-store` to the
  factory host. If it did, the gate run's take at 15:00Z would have refused `LEASE_HELD`; it did
  not, and it held its lease while the other was live.
- At 12:00Z the same day, a lane lease DID block the gate run, so host-keyed session leases work.
  The defect is the spelling, not the mechanism.
- A second spelling of the same class, found 15:40Z: LDT's `DEPLOYMENT_DATABASE_URL` resolves to
  `ep-lucky-truth-apodo8hr-pooler.c-7.us-east-1.aws.neon.tech` and `DEPLOYMENT_DATABASE_URL_DIRECT`
  (and hauska-prod's `PRODUCTION_NEONDB_URL`) to `ep-lucky-truth-apodo8hr.c-7.us-east-1.aws.neon.tech`.
  One Neon endpoint, two hostnames, so a caller holding the pooler URL and a job holding the direct
  URL get two different contention keys. Neon's pooler host is the endpoint id with `-pooler`
  appended to its first label.

### What to build

1. A take whose store cannot be a real store host is refused with a named code (for example
   `LEASE_STORE_INVALID` with a reason naming the spelling), or is resolved to its host through a
   declared alias table that a test pins. Say which you chose at CP1 and why. A resolution that
   depends on a human keeping a list current must carry a test that fails when a known alias is
   missing from it.
2. The pooler and direct hostnames of one Neon endpoint produce ONE key. Prove it with a test in
   both orders, and prove a different endpoint still gets its own key.
3. Decide what "cannot be a real store host" means from the stores the fleet actually leases
   (Neon endpoint hosts, and any other host in the lease records). Do not ship a rule that would
   refuse a host the fleet uses today.
4. Read the lease records (all rows, not only live ones) and count every key ever taken that is
   not a host, by key and holder. That count goes in the close: it is the silent half of this
   defect.
5. The session client (`scripts/heavy-scan-lease.mjs` in doc_repo) prints the refusal code and
   reason. Hand its diff back in your close.

### Falsifiers — pre-register your predictions before building

1. A test takes a lease on `factory-store` and then a host-keyed lease on
   `ep-round-base-au0jofwp.c-10.us-east-1.aws.neon.tech` (or the reverse) and fails unless one of
   the two is refused.
2. A take on a real, different host still succeeds while the factory host is held.
3. Reverting the fix makes test 1 fail.
4. The URL form and the `host:5432` form of the same host still contend with each other (the
   existing guarantee is not weakened).

### Do not

- Merge, deploy, or restart `factory-control`.
- Touch a live lease, or write to the lease table except through the test database.
- Launch sub-agents.
- Commit to doc_repo.

### Close

Snapshot; files touched; the PR with every CI check's literal conclusion string; the rule you
chose and its CP1 reasoning; the non-host key census from the lease records; the falsifiers with
evidence; the doc_repo client diff. `status`: `closed-partial` until the integration seat deploys
`factory-control` and a live take on `factory-store` is refused. `probe`: `{"notApplicable":
"control-plane change; graded by a live refused take after deploy"}`. `subAgents`. `leave_behind`.
