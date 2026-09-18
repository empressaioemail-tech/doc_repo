## Mission — P-334, P-329, P-330: three factory controls that fail on the wrong thing

You launch no sub-agents (FAN-DEPTH 0). You build in `hauska-factory` only, from current `origin/main`
with the SHA declared (`0f4558a4` at compile). Open **three PRs, one per row**, so the seat can merge
and deploy each on its own evidence. You do not merge, deploy, create a schedule or write any store;
the integration seat does all four. Any doc_repo change is handed back as a diff in your close.

These three are controls. Each one today either cannot run or passes on the wrong input. The work is
small; the proof is the point. Every fix is shown failing on the pre-change code before it is shown
passing.

### P-334: the retired-share watch refuses on every run

`src/jobs/publish-retired-share-watch.mjs` `runRetiredShareWatch` calls `resolveTargetStores(env,
target)` (`src/lib/publish-target-env.mjs`), which requires BOTH `PRODUCTION_NEONDB_URL` and
`PRODUCTION_HAUSKA_MCP_URL`. The job template in `cloudbuild.publish.yaml` (the
`factory-retired-share-watch` case) mounts `FACTORY_DATABASE_URL` and `PRODUCTION_NEONDB_URL` only, and
its own comment says the watch needs neither mcp URL. So the deployed job refused `TARGET_ENV_MISSING`
on its first execution (`factory-retired-share-watch-m7cv7`, 2026-09-18). The unit tests hand it a full
environment, so they never saw it.

Build: the watch resolves only the store it reads, through a database-only resolver that keeps the
target discipline (a target reads only its own variables; no `??` chain; an unknown target still
refuses). Do NOT widen the secret mount: a job that holds a credential it never uses is the wider
control. Add a test that reads the job's secret list FROM `cloudbuild.publish.yaml` itself and runs the
watch's resolver against exactly that environment; it must fail on the pre-fix code. Check whether any
other job in that template has the same shape (a resolver wider than its mount) and name what you find.

Note: the template's default args carry `--apply` (the watch records its observations). The band is
P-321's (0.90 ceiling, 0.50 move) and A-220's 0.05 threshold does not change it: that threshold governs
destructive writes, and this job writes only its own observations. Do not move the band.

Hand back the exact dry-run command the seat runs after deploy (target production, no `--apply`), and
what you predict it reads: Williamson 48491 at its restored share (about 0.4694 per the row) and every
served county classified against the band. The schedule's cadence is already set by the operator:
hourly. The seat creates it.

### P-329: the LDT pin comment check breaks on a force-push and accepts any comment

`.github/workflows/ci.yml` job `ldt-sha-comment-presence` passes `github.event.before` as the base on a
push. After a force-push that SHA is unreachable from every ref, so `git diff` fails and the script
exits 2 on every re-run (#173, `294bc2c`). Separately, `scripts/check-ldt-sha-comment-presence.mjs`
passes a `_LDT_SHA` change if the same file diff adds ANY non-empty comment line anywhere in the file.

Build: on a push whose `before` is unreachable, diff against the merge-base with `origin/main` (never a
silent skip, and a base that cannot be resolved at all still exits non-zero with a reason); the pass
requires an added comment line ADJACENT to the changed pin (define adjacency in the script, one place,
and say why that definition). Tests: a fixture repo with a force-pushed branch; a pin bump whose only
added comment is elsewhere in the file (must FAIL); a pin bump with its own comment (must pass); a diff
that does not touch the pin (not applicable, pass). Show the first two failing on the pre-change code.

Separately and read-only: the `ldt-pin-staleness` workflow has failed on every main push since at least
2026-09-18 00:53Z because the bake pin `bae48d40` is behind LDT. That is correct behaviour and P-351
moves the pin; do not touch it here. Say in your close whether P-329's change alters what
`ldt-pin-staleness` sees (it should not).

### P-330: the county runner stops on a declared absence

`src/lib/county-runner-plan.mjs` stage 6 (rail fill) runs eleven jobs as one step. Since #174,
`factory-parcel-ag-valuation` refuses `COUNTY_NO_SOURCE_PENDING` for 48021, 48055, 48209 and 48309
(and `COUNTY_NOT_IN_SCOPE` for Burnet 48053). `src/jobs/county-runner.mjs` treats any failed child as
the step's failure and stops, so `factory-dollar-fields-patch` (the last job of stage 6) and stages 7
to 12 never run for those counties through the runner.

Build: the plan DECLARES which refusal codes from which job are scope refusals, per job, in one place
(the same shape as the depth step's existing `precondition` entry; do not keep a second copy of
another job's scope list, read or reference it). The runner learns a child's refusal code from the
child's own durable record (its run event or a declared exit code), never by inferring it from a failed
execution. A declared scope refusal is recorded on the stage record as `refused` with its code and the
step continues to the next job; an undeclared failure, or a failure whose code cannot be read, still
stops the run. Tests: ag-valuation refusing `COUNTY_NO_SOURCE_PENDING` for 48021 continues to
`dollar-fields-patch`; the same job failing with an undeclared code stops; a failure with no readable
code stops; a declared code from a DIFFERENT job than the one it is declared for stops. Show the first
failing on the pre-change code.

### The three-question gate

Answer for each of the three in your close: what executes it, what triggers it, what fails when it is
violated (and whether that thing runs in production today), and what bypasses it.

### Constraints

- No store writes, no deploys, no schedules, no merges.
- Factory merge order in this wave (the seat serializes): P-333 first, then yours, then P-352 and
  P-361, then P-300 and P-338's writer half, then P-336's. Rebase onto whatever has merged before you
  open for review.
- P-334's fix ships through `cloudbuild.publish.yaml`, which rebuilds every publish job from one image
  (it would also ship P-327's merged gate, and the bake pin is stale until P-351). List exactly which
  jobs and which merged-but-undeployed changes that rebuild would carry, so the seat can sequence it.

### Close

Declare: the start commit, the three PRs, the falsifiers per row with both directions shown, the
secret-list audit result for P-334, the adjacency definition for P-329, the declared-refusal table for
P-330, the three-question gate answers, and `leave_behind`.
