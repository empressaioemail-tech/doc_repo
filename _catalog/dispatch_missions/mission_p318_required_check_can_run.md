## Mission — P-318: a required check can always run

You launch no sub-agents (FAN-DEPTH 0). You build in `hauska-map` and open a PR. You do not merge,
do not touch branch protection, and do not deploy.

### Where you work

`hauska-map`, fresh clone from `origin/main` under `P:/tmp/` into a NEW directory, branch
`ci/p318-required-check-can-run`. Declare the start commit (map main `3ee35d5e` at compile).
Register the clone under the property seat and remove the entry at close. P-305's #410
(`feat/p305-key-drift-check`, one file: `.github/workflows/property-explorer-sync-retrieval-key.yml`)
is open and is the blocked pull request this row exists for; do not push to it.

### The finding (integration seat, measured 2026-09-17)

- `main` protection: required contexts `test` and `No double-encoded source`, `strict: true`,
  `enforce_admins: true`.
- `test` is produced by `.github/workflows/property-explorer-ci.yml`, whose `pull_request` trigger
  lists `apps/property-explorer/**`, `packages/map-renderer/**`, `packages/parcel-fact-sheet/**`,
  `pnpm-lock.yaml` and its own file.
- `No double-encoded source` comes from `source-encoding.yml`, which has no path filter, so it runs
  on everything.
- #410 changes only `property-explorer-sync-retrieval-key.yml`. `No double-encoded source` passed;
  `test` never ran; `gh pr merge --admin` was refused with `Required status check "test" is
  expected.` The pull request cannot merge by any honest path.
- `command-center-ci.yml` and `factory-console-ci.yml` have the same shape. Check whether either
  produces a required context, and say so either way.

### What to build

1. Make every workflow file that a required check must cover fall inside that check's own trigger
   (the smallest form: add the workflow paths to `property-explorer-ci.yml`'s `pull_request.paths`).
   If you think the better fix is to change which contexts are required, say so in the close and
   build nothing: branch protection is the operator's, not this lane's.
2. Keep the checks meaningful. A workflow-only change must still run a real `test` job, not a
   skipped one that reports success: a required context satisfied by a no-op is the defect class
   this repo already carries elsewhere.
3. Say in the close what OTHER file classes can change without producing `test` today
   (`.gitattributes` is already handled; look for `.github/**`, root config, `packages/**` outside
   the listed two), and which of those a required check should cover.

### Falsifiers — pre-register your predictions before building

1. On your branch, a commit that touches ONLY a workflow file produces both required contexts, and
   both pass.
2. A commit that touches only `apps/property-explorer/**` still produces them (no regression).
3. Reverting the path change reproduces the miss: the workflow-only commit produces no `test`.
4. The `test` job that runs for a workflow-only change actually executes the suite (name the step
   and its duration); a skipped or short-circuited job is a FAIL of this falsifier.

### Do not

- Merge, change branch protection, disable `enforce_admins`, or push to #410.
- Deploy anything.
- Launch sub-agents.

### Close

Snapshot; files touched; the PR with every CI check's literal conclusion string; the falsifiers
with evidence (including the run URLs that show `test` firing on a workflow-only commit); the list
of file classes still uncovered. `status`: `closed-partial` until the integration seat merges this
and then merges #410 through the normal path with `test` green. `probe`: `{"notApplicable": "CI
configuration; graded by #410 merging without a bypass"}`. `subAgents`. `leave_behind`.
