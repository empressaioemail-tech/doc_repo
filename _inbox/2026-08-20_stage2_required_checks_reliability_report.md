---
date: 2026-08-20
seat: property substrate
artifact: Stage 2 branch-protection reliability report
status: report only, NO CHANGES APPLIED
related: [90_runbooks/91_branch_protection_runbook.md, 61_enforcement_doctrine]
---

# Stage 2 required-checks reliability report

Three repositories: hauska-map, hauska-engine, legacy-design-tools. **No changes applied.**
Stage 2 application is a separate authorised step and this report is what authorises it.

## Snapshot

Run history read `2026-08-20` via `gh run list --branch main --limit 60`. Check-run names read
via `gh api repos/<r>/commits/<main-sha>/check-runs`, which is authoritative because **branch
protection matches the check-run name, not the workflow name and not the job key.**

Main tips at read time: hauska-map `204789f`, hauska-engine `d3f3794`, legacy-design-tools
`1113c649`.

## BLOCKER: the named first required check does not exist under that name

`ci-api-server-boot-smoke` was named as the first check to require. **No check-run, job key or
job name by that string exists in legacy-design-tools at `1113c649`.**

The actual object is in `.github/workflows/pr-checks.yml`:

```
  ss-w18-api-server-boot:            <- job key
    name: SS-W18 api-server boots    <- check-run name, this is what protection matches
```

The workflow is named `PR Checks`. **The string to require is `SS-W18 api-server boots`.**

This is not a naming quibble. Requiring a context that never reports does not fail open, it
**jams**: the PR shows *Expected, waiting for status to be reported* and can never merge. On
three repos with `enforce_admins: true` that would block every pull request in the estate with
no error message naming the cause.

## The two skip questions, and they have opposite failure modes

The stated rule is that a required check is satisfied by success, skipped or neutral. That is
true for **job-level `if:` skips**, which report a `skipped` conclusion that counts as
satisfied. It is **not** the only failure mode, and the second is the one that bites here.

**A path-filtered or trigger-filtered workflow never creates the check run at all.** Nothing
reports, so the requirement is never satisfied and the PR blocks indefinitely. Same wrong
outcome, opposite direction, and it is invisible until someone opens an unrelated PR.

So each candidate is graded on both: can it report `skipped` (satisfies without running), and
can it fail to report at all (blocks forever).

## legacy-design-tools

Workflow-level history on main, last 60 runs: `PR Checks` 16/19 success, 2 failure, 1 cancelled
(**84%**, or 16/18 = **89%** excluding the cancellation). `Cloud Run Deploy (cortex-api)` 40/41
(**98%**).

`PR Checks` triggers on `pull_request` and `push`, **no path filter, no job-level `if:`, no
`fetch-depth`, no `continue-on-error`** anywhere in the file. Verified by reading the whole
workflow, not by sampling. So none of its jobs can skip and none can fail to report.

| check-run name | history | can skip | reports on every PR | verdict | reason |
|---|---|---|---|---|---|
| **SS-W18 api-server boots** | success on main tip; workflow 89% ex-cancelled | No | Yes | **REQUIRE FIRST** | The only check in the estate proven to fire against a real violation on production main. Four merges shipped unbootable because no test started the process. 25-minute timeout but ~26s typical, no `services:`, unambiguous failure |
| **Typecheck** | success | No | Yes | **REQUIRE** | Deterministic, no external dependency, no skip path |
| **Test** | success | No | Yes | **REQUIRE** | Same. Note the 2 workflow failures in history land here or in Typecheck; that is the check working, not instability |
| **SS-W16 tier2 flood not served** | success | No | Yes | **REQUIRE** | Verified by violation during construction, and three defects in the check itself were found and fixed that way. Guards a closed public exposure from reopening |
| **L17 ci-vintage-predicate** | success | No | Yes | **DEFER** | Discriminating power unknown. No record of it firing against anything real. Stable is not proven |
| **L5 SF-24/SF-25 score greps** | success | No | Yes | **DEFER** | Same. Also grep-shaped, which the doctrine rates as bypassable by anything not passing through CI |
| **L5 SF-26 hand hasWriter grep** | success | No | Yes | **DEFER** | Same |
| **L5 SF-30 Cotality warm grep** | success | No | Yes | **DEFER** | Same |
| **L5 silent-fallback greps** | success | No | Yes | **DEFER** | Same |
| Apply pending DB migrations | **skipped** on main tip | **YES** | No | **DEFER, do not require** | Reports `skipped`, which satisfies a requirement without running. Requiring it is worse than not requiring it |
| Build & push image | **skipped** ×2, success ×1 | **YES** | No | **DEFER, do not require** | Same |
| Deploy 0% canary | **skipped** ×2, success ×1 | **YES** | No | **DEFER, do not require** | Same |
| Shift 100% traffic to the canary tag | **skipped** ×2, success ×1 | **YES** | No | **DEFER, do not require** | Same |
| Roll traffic back to a prior revision | **skipped** ×3 | **YES** | No | **DEFER, do not require** | Same |

The five deploy jobs are the live instance of the skip trap. All five appear on the main tip
with a `skipped` conclusion. Any of them required would be permanently self-satisfying.

## hauska-engine

Workflow-level history on main, last 60 runs: `ci` 51/59 (**86%**), with 6 cancelled and 2
failed. The workflow sets `concurrency: cancel-in-progress: true`, so cancellations are
superseded runs rather than signal. **Excluding cancellations: 51/53, 96%.** Both numbers are
given because reporting only the second flatters and only the first misleads.

`ci` triggers on `push: [main]` and `pull_request: [main]`, **no path filter.**

| check-run name | history | can skip | reports on every PR | verdict | reason |
|---|---|---|---|---|---|
| **typecheck + test** | 51/53 ex-cancelled (**96%**), success on main tip | No | Yes | **REQUIRE** | Only check-run this repo produces on main. No path filter, no skip path. Two real failures in 53 is the check working |
| block13 offline 7/7 (txgio frame) | 1/1, one run only | Unknown | **No** | **DEFER** | **n=1 is not a run history.** Did not appear on the main tip check-runs, so its trigger does not cover ordinary pushes. Requiring it risks the never-reports jam. Re-assess after it has a history |

## hauska-map

Workflow-level history on main, last 60 runs: `Command Center CI` 49/49 (**100%**),
`Source encoding` 7/7 (**100%**), `PE sync retrieval key` 1/4 (**25%**).

| check-run name | history | can skip | reports on every PR | verdict | reason |
|---|---|---|---|---|---|
| **No double-encoded source** | 7/7 (**100%**) | No | **Yes** | **REQUIRE** | Runs on every PR with **no path filter, deliberately**, and its own header records why: the defect it guards hit a property-explorer component *and* both copies of `api/spine.ts`, so a path-filtered job would have let the `api/` occurrences through. Written against a real observed defect. See the caveat below |
| **test** (Command Center CI) | 49/49 (**100%**) | No | Yes | **REQUIRE** | Clean history, no path filter on the job. Its only `if:` gates a `workflow_dispatch` live-smoke step, not the PR path |
| Test (Property Explorer CI) | not on main tip | — | **NO** | **DEFER, blocker** | **`pull_request` only, and PATH-FILTERED** to `apps/property-explorer/**`, `packages/map-renderer/**`, `packages/parcel-fact-sheet/**`, `pnpm-lock.yaml` and its own file. A PR touching none of those never creates the check and the PR blocks forever. Requiring this jams the repo |
| Typecheck (Property Explorer CI) | not on main tip | — | **NO** | **DEFER, blocker** | Same path filter, same jam |
| Sync HAUSKA_ENGINE_API_KEY → Vercel PE env + prod deploy | **1/4, 25%** | — | No | **DEFER** | A deploy and secret-sync action, not a check. **Failing 3 of its last 4 runs on main**, which is an operational problem worth its own item regardless of Stage 2 |

**Caveat on `No double-encoded source`, stated rather than glossed.** It was *written against* a
real observed defect, which is documented in its own header. That is not the same as *proven to
fire against a real violation on production main*, which is the criterion, and which only
`SS-W18 api-server boots` currently meets. It is recommended on the strength of a perfect
history, a deliberate absence of path filtering, and real-defect provenance, one rung below
SS-W18's evidence.

## Recommended Stage 2 set

Six checks across three repositories, every one of which reports on every pull request and none
of which can report `skipped`.

```
legacy-design-tools   SS-W18 api-server boots        <- first, per the criterion
                      Typecheck
                      Test
                      SS-W16 tier2 flood not served
hauska-engine         typecheck + test
hauska-map            No double-encoded source
                      test
```

Deferred: five ldt deploy jobs (skip-satisfiable), five ldt L5/L17 greps (discriminating power
unknown), two hauska-map Property Explorer jobs (path-filtered, would jam), `block13` (n=1), and
`PE sync retrieval key` (not a check, and failing).

Suggest applying legacy-design-tools first with `SS-W18 api-server boots` alone, confirming a
real PR both blocks on red and merges on green, and only then adding the rest. Sequencing one
check on one repo first means a jam is diagnosable.

## The job-rename hazard, which must travel with whatever is required

**A required status check is matched by check-run name. Renaming a workflow job's `name:`
silently removes the requirement, with no error, no warning and a green PR.** The protection
setting keeps naming a string nothing produces, and the branch is unprotected in that respect
from the moment of the rename.

This is not hypothetical here: the check named for requirement in the order that produced this
report, `ci-api-server-boot-smoke`, differs from the real name `SS-W18 api-server boots`. The
drift already exists between the plan and the repo, before anything is applied.

Whatever is required needs that fact noted **where job names are edited**, not only here. The
minimum is a comment at each required job's `name:` field saying the string is load-bearing for
branch protection. The stronger form is a CI check that reads the protection API and fails when
a required context has no matching job, which is the only version that is a control rather than
a note.

## Verification standard, and what this report does not clear

Every verdict above rests on **read run history and read workflow source**. None of it rests on
having watched a required check block a real merge, because nothing is required yet.

**This report is evidence for a decision, not proof that Stage 2 works.** By the standard the
programme applies to everything else, Stage 2 is proven when a pull request with a real defect
is refused, and a clean one merges, on the control's own installation. That is the Stage 2
acceptance step, and it is not this document.

Until it lands, every green in the estate remains a courtesy and not a gate, and any close
citing one should say so.
