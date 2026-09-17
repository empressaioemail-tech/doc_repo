# P-318 — falsifiers, with evidence

Lane `p318-required-check-can-run`, plan row P-318 (`90_operations/OPS-16_texas_market_plan_of_record.md`).
Predictions were pre-registered in `_inbox/2026-09-17_p318-required-check-can-run_cp1.json` **before the first commit**.
All times UTC. Nothing here was merged, deployed, or pushed to another lane's branch.

## The four pull requests

| # | branch | diff vs its base | purpose |
|---|---|---|---|
| [#412](https://github.com/empressaioemail-tech/hauska-map/pull/412) | `ci/p318-required-check-can-run` | `.github/workflows/property-explorer-ci.yml` only | the deliverable |
| [#413](https://github.com/empressaioemail-tech/hauska-map/pull/413) | `ci/p318-falsifier3-workflow-only-negative` | `publish-map-renderer.yml` only, **no fix** | falsifier 3 (negative control) |
| [#415](https://github.com/empressaioemail-tech/hauska-map/pull/415) | `ci/p318-falsifier2-pe-only` | one `apps/property-explorer/**` file only, based on #412's branch | falsifier 2 |
| [#414](https://github.com/empressaioemail-tech/hauska-map/pull/414) | `ci/p318-falsifier5-cc-workflow` | fix + `command-center-ci.yml` only | falsifier 5 (added by the lane) |

#413, #414 and #415 are controls. They are closed, unmerged, with a comment naming what each measured.

## Falsifier 1 — a workflow-only commit produces both required contexts, and both pass

**PASS.** #412's own head is a workflow-only diff. Literal check-run strings for head `86fe8e79890950069ecd1c193893112cc3d8b1be`:

| required context | literal conclusion string | run |
|---|---|---|
| `test` | `completed :: success` | [runs/35264306005/job/105347498363](https://github.com/empressaioemail-tech/hauska-map/actions/runs/35264306005/job/105347498363) |
| `No double-encoded source` | `completed :: success` | [runs/35264305923/job/105347496618](https://github.com/empressaioemail-tech/hauska-map/actions/runs/35264305923/job/105347496618) |

`mergeStateStatus: CLEAN` (was `BLOCKED` on #410 with the same shape), `mergeable: MERGEABLE`, `isDraft: false`. A third check-run, `Typecheck`, is also `completed :: success` — it is produced but not required.

## Falsifier 2 — an app-only commit still produces them (no regression)

**PASS.** On #415 the head carries the FIXED trigger while the diff is exactly one file, `apps/property-explorer/src/lib/fact-sheet-resolver.test.ts`. Literal strings for head `088ada714dd64fba4223a60376225ae3cd212cfa`:

* `test` :: `completed :: success` — [runs/35264437675/job/105347949910](https://github.com/empressaioemail-tech/hauska-map/actions/runs/35264437675/job/105347949910)
* `No double-encoded source` :: `completed :: success` — [runs/35264437673/job/105347950134](https://github.com/empressaioemail-tech/hauska-map/actions/runs/35264437673/job/105347950134)
* `Typecheck` :: `completed :: success` — [runs/35264437675/job/105347950209](https://github.com/empressaioemail-tech/hauska-map/actions/runs/35264437675/job/105347950209)

Baseline it is compared against: [#411](https://github.com/empressaioemail-tech/hauska-map/pull/411) (PE-only, merged 2026-09-17T15:46:52Z) reported the same three names, all `success`.

**Method note, and its limit:** the base of #415 is #412's branch, not `main`, because GitHub evaluates `pull_request.paths` against the diff against the base and runs the workflow version from the head. That is the only way to get a fixed head with an app-only diff. Consequence stated in advance and confirmed: `main`'s branch protection does not apply to a pull request whose base is not `main`, so `mergeStateStatus` is *not* the measurement here — the check-run set is.

## Falsifier 3 — reverting the path change reproduces the miss

**PASS (the miss reproduces).** #413's head `45e1fe87e62daada61fd5ea7516b65e000cd0342` carries one comment added to `publish-map-renderer.yml` against unfixed `main`. Full check-run set for that head:

* `No double-encoded source` :: `completed :: success` — [runs/35264378793/job/105347745906](https://github.com/empressaioemail-tech/hauska-map/actions/runs/35264378793/job/105347745906)
* **no `test` check-run exists** — the API returned exactly one check-run for the head.

`mergeStateStatus: BLOCKED`, `mergeable: MERGEABLE`. The poller held for 240s after that check-run completed to give a late `test` the chance to appear; none did.

This reproduces the defect on a file that is **not** #410's: #410 is the dispatch's own measured instance and this lane must not push to it. Same class, different file, stated rather than blurred.

## Falsifier 4 — the `test` job actually executes the suite

**PASS.** From #412's head, job `105347498363` (Property Explorer CI, 52s, no `if:` on the job, no step skipped):

| step | conclusion | duration | executed? |
|---|---|---|---|
| `pnpm install --frozen-lockfile` | success | 7s | yes |
| `pnpm --filter @empressaio/parcel-fact-sheet test` | success | 1s | yes |
| `pnpm --filter property-explorer test` | success | 31s | yes — real vitest output, named suites |
| `Records copy guard (P-85 item 16)` | success | 0s | yes — log: `Records copy guard passed (240 files scanned).` |
| `Retired checkout seam guard (P-103)` | success | 0s | yes — log: `P-103 seam-retired guard passed (4 checks, each with a live positive control).` |
| `Public pages guard (P-108)` | success | 0s | yes — log: `P-108 public-pages guard passed (6 checks over 3 static pages, each with a live positive control).` |

**A correction to my own instrument, recorded rather than applied silently.** The pre-registered discriminator was "executed = conclusion `success` AND duration > 0s". It reported the three guard steps as NOT EXECUTED. The raw timestamps show why: all three ran inside `2026-09-17T19:21:23Z`, and GitHub's step timestamps have one-second granularity — start and end land on the same second. The discriminator that can separate execution from a no-op is the step's own log output, and it is present for all three (excerpt: `_inbox/2026-09-17_p318-required-check-can-run_test-job-log-excerpt.txt`). Had the log been *absent*, "success, no output, 0s" would have been a defect finding about the job rather than about my discriminator. DEV_PROCESS 2.3's shape: the negative case must be proven on evidence that can distinguish the two.

## Falsifier 5 (added by the lane, pre-registered) — the duplicate-name condition the fix creates

**PASS, with the cost measured.** `test` is a required context matched by bare check-run name, and three workflows define a job named `test`. Before this change, a `.github/workflows/command-center-ci.yml`-only diff produced one `test` (Command Center CI's own, from its self-reference). On #414 — which carries the fix plus that one workflow file — the head `dc822b386062efe780c8c0823f15a9a0d1f07f97` produced **two** check-runs named `test`, both `completed :: success`:

* Command Center CI: [runs/35264410381/job/105347852405](https://github.com/empressaioemail-tech/hauska-map/actions/runs/35264410381/job/105347852405)
* Property Explorer CI: [runs/35264410234/job/105347852112](https://github.com/empressaioemail-tech/hauska-map/actions/runs/35264410234/job/105347852112)
* plus `No double-encoded source` :: `completed :: success` and `Typecheck` :: `completed :: success`

`mergeStateStatus: CLEAN` — a duplicate name does **not** confuse the required-context evaluation here, so the fix's blast radius on `command-center-ci.yml` and `factory-console-ci.yml` changes is safe. The cost is also measured: a workflow-only diff on those two files now runs the full Property Explorer suite as well (52s of CI).

**Observation on the same run, reported because the runbook names the hazard:** Command Center CI's `test` job carries a step `Live GREEN smoke (WDLL 8)` whose conclusion is `skipped` — `if: github.event_name == 'workflow_dispatch' && inputs.live_smoke`, so it is skipped on every pull request by construction. The job's own verdict is still `success`. `91_branch_protection_runbook` states that a required check is satisfied by `skipped`. This is not a defect in the fix and it is not fixed here: the RED-path unit tests do run, the live leg is skipped deliberately, and whether CC-CI should remain a producer of the required context `test` at all is part of the context-set question the close routes to the operator.

**Not measured, stated as a hole:** the mixed case — two producers of `test` on one head, one `success` and one `failure`. That is a question about the required-context design (three co-owners of one required name), not about this fix, and it is routed in the close rather than guessed at.

## What would have falsified the fix, and did not

The fix rests on the premise that the required context is matched by the bare check-run name, not by a workflow identity. Had it been matched to a workflow, `test` would have reported on #412 and the merge would still have refused. It did not: #412 is `CLEAN`. The premise is now measured in the direction that matters instead of assumed.
