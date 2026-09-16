## Mission — P-252: a county that earned nothing must not clear the gate

You launch no sub-agents (FAN-DEPTH 0). You build in `hauska-factory` and open a PR. You do not
deploy and you do not run any job against a store that writes.

### Where you work

`hauska-factory`. Clone fresh from `origin/main` into a new directory under `P:/tmp/`, cut
`fix/p252-zero-earned-refusal`, and declare the commit you started from before you write
anything. Another lane (P-284, stage and cost telemetry) may be working in this repo at the same
time. It touches migrations and the job runner's record-writing, not the gate files below; do
not touch its files, and rebase rather than merge if both land.

### The defect, measured twice by violation on 2026-09-16

At `origin/main` `9171279` (P-201 merged as PR #156), an instantiated county whose 65 rails all
hold `unaccounted` cells:

- `evaluateRailGate` (`src/lib/parcel-record-engine/publish-gate.js`) takes the "no earned cell"
  branch, sees `cells.length > 0`, and returns `ok: true` with the rail declared ahead;
- `toGateVerdictKind` (`src/jobs/publish-gate-sched.mjs`) hands that to `classifyExclusion`
  (`src/lib/gate-exclusion-classifier.mjs`), which returns `excluded-not-applicable` with basis
  `LIVE_ELSEWHERE` for every rail that is live somewhere in Texas: all 65 in the probe;
- `evaluatePreBakeReadiness` (`src/lib/publish-readiness-gate.mjs`), the rail half of the real
  publish refusal `requirePreBakeReadiness` (called by `src/jobs/bastrop-publish.mjs`), refuses
  only on a missing row or `verdict === "refuse"`, so every `excluded-*` value clears.

`evaluatePublishGate` and `assertPublishableCounty` have no production caller (one self-test in
`parcel-record-fill.mjs`).

The integration seat's probe, which you should reproduce as a checked-in test rather than trust:
three parcels, every rail's cells `{kind: "unaccounted"}`, an empty program-wide declared-ahead
set. Result: 65 of 65 `excluded-not-applicable`, pre-bake rail check cleared. Its controls
refused correctly: a rail with one earned and one unaccounted cell reads `refuse` and the
pre-bake check throws `RAIL_REFUSED`. The only thing that stops such a county from publishing
today is the population check, and that stops passing once a bake population exists.

### What to build

1. **The rail gate refuses a zero-earned live rail.** In the "no earned cell" branch: if the rail
   is live program-wide and any of this county's cells is `unaccounted`, return `ok: false` with
   `unaccountedCount` equal to those cells. A county whose cells for the rail are all explicit
   `not-applicable` (written with a reason, the way `maxImperviousCoverPct`'s out-of-scope sweep
   writes them outside Travis) stays an exclusion, and that is the only road to
   `excluded-not-applicable` for a live rail. Rails declared ahead program-wide keep P-201's
   mid-cutover and no-acquisition-path classes.
   - `test/gate-county-scoped-rail.test.mjs` must stay green. Read it first; it is the
     empirical proof of the county-scoped property.
   - **There are two copies of `evaluateRailGate`**: the factory's vendored
     `publish-gate.js` and hauska-engine's engine-core original (the factory calls a CLI;
     confirm which copy the scheduler actually executes before you edit). Change the one
     that runs, and add a divergence test that fails when the two disagree on your fixtures.
     If the executed copy is the engine's, stop and report: that is a different repo and a
     different lane.
2. **`classifyExclusion` cannot say `excluded-not-applicable` for a county whose cells are
   `unaccounted`.** The `LIVE_ELSEWHERE` basis alone is not a reason a rail does not apply.
3. **The pre-bake rail check is an allowlist.** `evaluatePreBakeReadiness` clears `pass` and
   an exclusion whose basis is the county's own `not-applicable` cells; everything else refuses
   with its verdict named.
4. **The uncalled gate.** Either wire `evaluatePublishGate` onto the publish path with a reason,
   or retire it with a test that fails if an exported gate has no production caller. Say which,
   and why.
5. **The fixture.** Check in the all-`unaccounted` county as a test that must REFUSE at the rail
   gate and at the pre-bake check, next to a county whose `maxImperviousCoverPct` cells are all
   `not-applicable` (must stay an exclusion) and a mixed rail (must refuse).

### Before any deploy: the dry run (you produce it; the integration seat decides)

Using the read-only factory credential only (`FACTORY_DATABASE_URL_RO`,
`default_transaction_read_only=on`), compute under the new logic, without writing:

- every (county, rail) verdict in the six counties that would change, old and new;
- every publish-floor rail (`PUBLISH_FLOOR_RAIL_KEYS`) that would then refuse a publish, per
  county;
- the serving consequence: the serve-side reader in legacy-design-tools treats `refuse` like a
  missing verdict and falls back to the legacy value for that rail. List which (county, rail)
  pairs would change serving path, and read the reader to confirm the rule before you state it.

Expected, and not a failure: `agValuation` refuses in Bastrop, Caldwell, Hays and McLennan;
`acreageSqft`, `landUseVintage` and `situsState` refuse outside Hays. If a publish-floor rail
would refuse in any of the six, say so in bold at the top of your close.

If the read-only credential is not in your environment, say so, mark the dry run UNMEASURED,
and do not substitute any other credential.

### Falsifiers, pre-register your answers first

1. The all-`unaccounted` fixture refuses at both layers. If it clears either, the row is not done.
2. The all-`not-applicable` `maxImperviousCoverPct` fixture stays an exclusion. If it refuses,
   you have broken the county-scoped property.
3. A rail with zero cells in a county still returns `RAIL_NEVER_FILLED` (P-195 unchanged).
4. The dry run's verdict changes are exactly the rails that are live elsewhere and unaccounted
   in that county. A change outside that set means the logic is wider than the claim.
5. The divergence test between the two `evaluateRailGate` copies fails when you edit one.

### Do not

- Deploy, run `publish-gate-sched` against a store, or write to any store.
- Fix any rail's data (agValuation, the derived rails): those are P-266 and P-267.
- Change `requireCountyPopulation`.
- Launch sub-agents.

### Close

Snapshot (repo, branch, start and end commits); every file touched; the PR number with every CI
check's literal conclusion string; the five falsifiers with evidence; the dry run tables, or
UNMEASURED with the reason; which `evaluateRailGate` copy runs and how you know. `status` is
`closed-partial` (a green PR is code-done, not customer-done; the integration seat merges,
deploys to staging and grades). `probe`: `{"notApplicable": "build lane, PR not deployed; the
integration seat grades on staging"}`. `subAgents`. `leave_behind`.
