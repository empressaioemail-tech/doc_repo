## Mission — P-292: a floor rail with a ratified county scope is required only in its scope

You launch no sub-agents (FAN-DEPTH 0). You build in `hauska-factory` and open a PR. You do not
deploy, you do not run any job, and you write no cell anywhere.

### Where you work

`hauska-factory`, fresh clone from `origin/main` under `P:/tmp/`, branch
`fix/p292-county-scoped-floor`. Declare the start commit. **P-252's PR #157 is open and edits
`src/lib/publish-readiness-gate.mjs` too.** Cut your branch from `origin/main`, and if #157 has
merged by then, from the merged tip; if it has not, say so in CP1 and keep your change a
separate, small hunk so the second PR rebases cleanly. P-284 (telemetry) may also be open in this
repo; it does not touch the gate files.

### Why

P-252 makes a live rail with `unaccounted` cells refuse. `maxImperviousCoverPct` is on
`PUBLISH_FLOOR_RAIL_KEYS` (through `SLATE_1B_RAIL_KEYS`), and its writer
(`src/jobs/parcel-max-impervious-cover.mjs`) refuses `COUNTY_NOT_IN_SCOPE` outside Travis and
writes no cell there. So once the gate scheduler runs P-252's code, `requirePreBakeReadiness`
refuses a publish in Bastrop, Caldwell, Hays, McLennan and Williamson on this rail alone. The
P-252 lane found this (close `d1772cbc`, `PUBLISH_FLOOR_CONSEQUENCE_READ_THIS_FIRST`).

**The fix is NOT to write `not-applicable` outside Travis.** That would be a fabricated absence:

- Austin's watershed rules govern Austin's jurisdiction in Williamson and Hays as well; the
  setback census counts 13,924 and 411 `austin-tx` parcels there.
- The factory's own `acquire-edwards-recharge-zone` job feeds this rail for an aquifer zone that
  crosses county lines.

Outside Travis the honest state of this rail is "not acquired", which is what `unaccounted` says.

### What to build

1. **One declared scope map** for floor rails whose acquisition is ratified to a county subset,
   with the ruling named on each entry: `maxImperviousCoverPct → ["48453"]`, ruling "engine #444,
   Travis-only by ratified design". Read engine #444 and the rail's writer header to confirm the
   ruling's wording before you cite it. If you find a second floor rail with the same shape, list
   it in CP1 and ask; do not add it on your own.
2. **The floor is county-aware.** `requirePreBakeReadiness` (and `evaluatePreBakeReadiness`)
   require a scoped rail only for counties in its scope. Outside scope the rail is simply not on
   that county's floor. Its stored verdict is untouched and stays an honest `refuse` with its
   count.
3. **The return value says so.** The readiness summary lists, per publish, the floor rails
   skipped by scope and the ruling that skipped them, so a publish record shows it was not a
   silent pass.
4. **Tests, both directions:**
   - a Travis publish with `maxImperviousCoverPct` refusing still refuses;
   - a Hays publish with the same verdict clears, and the summary names the skip;
   - a scope map entry for a rail that is not on the floor fails a test;
   - a county missing from a scope list cannot be added without the test naming the ruling.

### Falsifiers, pre-register your answers first

1. The Travis case still refuses. If it clears, the change is too wide.
2. The Hays case clears only this rail; any other floor rail refusing in Hays still refuses.
3. No cell is written and no verdict changes; the diff touches only the gate module and tests.

### Do not

- Write `not-applicable` cells, change the writer's scope, or run any job.
- Remove the rail from the floor for every county.
- Deploy, merge, or launch sub-agents.

### Close

Snapshot; files touched; the PR with every CI check's literal conclusion; the three falsifiers
with evidence; the ruling text you cited and where you read it. `status`: `closed-partial` until
the integration seat merges it, runs P-252's scheduler on staging, and shows a non-Travis publish
readiness clearing with the skip named. `probe`: `{"notApplicable": "build lane, PR not
deployed; graded by a staging readiness run"}`. `subAgents`. `leave_behind`.
