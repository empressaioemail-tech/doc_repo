# A2 RETURN: Stage 2 required-check rename control

SNAPSHOT
- repo: hauska-engine (empressaioemail-tech/hauska-engine)
- worktree: P:/tmp/mp-a2-rename-control
- branch: ci/required-check-rename-guard
- HEAD: d3f37949003fae5a99a82b62956352b7dcaa1022 (confirmed before edit; still HEAD after edit)
- default_branch: main (VERIFIED `gh api repos/empressaioemail-tech/hauska-engine --jq .default_branch`)
- worker: A2. Planner owns commit/PR. No git add, commit, push, or PR from this seat.
- written: 2026-08-20 19:50 UTC

## Pre-registered ways this output could be wrong

Declared before editing, then checked:

1. Collecting every YAML `name:` scalar (including step titles) would let a step named `typecheck + test` satisfy a required check-run name. The input type would be "all name scalars" rather than "job check-run names". GitHub matches the job `name:` field, or the job id when `name:` is absent.
2. Treating an unreachable, 403, or empty protection payload as `required = []`. Forall-over-`string[]` is vacuously true on the empty list, so that is the cheapest satisfier of the name-match predicate and would pass a rename that also broke the API read.

Both were checked. See Proofs.

## Repo choice (planner-decided; not switched)

hauska-engine is the right first vehicle.

The live required set is one context, `typecheck + test`. A rename proof has one string to drop and one string to look for. ldt has four required names and concurrent A3/A4 PRs; a miss there can be blamed on the other lane. hauska-map has two names. This repo's required name is a composite human label (`typecheck + test`) that looks editable, which is the failure mode the control exists to catch.

leave_behind: replicate the same control to legacy-design-tools (four names) and hauska-map (two names). Do not treat this hauska-engine landing as coverage of those repos.

## What was built

Uncommitted on this branch (planner commits):

- `.github/workflows/ci.yml` — new job `required-check-names` (`name: required check names`). Existing job `ci` still has `name: typecheck + test`. That string was not renamed.
- `scripts/ci/assert-required-check-names.mjs` — the instrument.
- `scripts/ci/parse-workflow-yaml.mjs` — YAML parse, not grep.
- `scripts/ci/fixtures/required-check-names/omit-required-name/ci.yml` — job name omitted; step title is the decoy.
- `scripts/ci/fixtures/required-check-names/empty-protection.json` — `contexts: []` and `checks: []`.
- `scripts/ci/fixtures/required-check-names/missing-contexts-field.json` — object with neither field.

The landing-tree `name: typecheck + test` is still present. READ `.github/workflows/ci.yml` after the copy-rename proof; the copy was deleted.

## Live protection (authoritative)

VERIFIED 2026-08-20 19:50 UTC via `gh api repos/empressaioemail-tech/hauska-engine/branches/main/protection/required_status_checks` (operator `gh` keyring, scopes include `repo`):

```
{"url":"https://api.github.com/repos/empressaioemail-tech/hauska-engine/branches/main/protection/required_status_checks","strict":true,"contexts":["typecheck + test"],"contexts_url":"https://api.github.com/repos/empressaioemail-tech/hauska-engine/branches/main/protection/required_status_checks/contexts","checks":[{"context":"typecheck + test","app_id":15368}]}
```

`contexts` and `checks[].context` agree. Expected floor for this repo is that one name. The script uses the live list as the required set when the API is readable. Empty or unreadable is a failure, not a pass.

Second mechanism for this payload: a stale local cache of a previous `gh api` call. Rejected because this process printed a fresh JSON body with `app_id` 15368 (GitHub Actions) and `strict: true` on this invocation, and `default_branch` was independently `main` on the same repo endpoint.

## Four-question gate

1. What executes this?
   `node scripts/ci/assert-required-check-names.mjs`, run by GitHub Actions job `required-check-names` in `.github/workflows/ci.yml`. Locally the same file is the executable. Not a person, not a comment.

2. What triggers it?
   The existing `ci.yml` `on:` block: `push` to `main` and `pull_request` targeting `main`. The new job is a sibling of `typecheck + test`, not `needs:`-gated on it, so a rename of the typecheck job still runs this job.

3. What fails when it is violated, and is that running in production today?
   The script exits 1. The job then fails. That job is **not** in the live required set (live required is only `typecheck + test`). A failing `required check names` check-run does not block merge today. The files are on branch `ci/required-check-rename-guard`, not on `origin/main`. Production: not running. Local name-mismatch and API-unreadable paths: VERIFIED below. GitHub-Actions-on-a-branch: not claimed.

4. What bypasses it?
   - Leave this job off the required status-check list (the current live state). Merge still waits only on `typecheck + test`.
   - Put a decoy job `name: typecheck + test` that does no typecheck. The instrument matches names, not job identity. That is the cheapest satisfier of input type `string` check-run name.
   - Rename the job `name:` and the protection context in the same change. Live API is authoritative; both sides would then agree.
   - Put the real job in a workflow file outside `.github/workflows/*.{yml,yaml}` with no local `jobs.*.uses` pointer. The collector follows local reusable `uses:` and the top-level glob only.
   - Admin merge / push allowances if `enforce_admins` is off. `enforce_admins` was **not** read on this pass (this endpoint is required_status_checks only). That flag is UNMEASURED, not false.
   - GITHUB_TOKEN 403 on the protection API: the live-assert step fails loud (good) but then never reaches the name-mismatch predicate in that step. The in-job `--expect-failure` fixture step still exercises name-mismatch without the API.

## Permissions (READ of GitHub docs)

GET `/repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks` requires Administration: read. GitHub Apps permission matrix lists that GET as `read` for UAT and IAT.

The GITHUB_TOKEN permissions key list in workflow-syntax does **not** include `administration`. Allowed keys include `actions`, `contents`, `checks`, `pull-requests`, and the rest of that list, not `administration`. Putting `administration: read` on the job would risk a workflow-parse 422 and would take down the load-bearing `typecheck + test` job in the same file. The new job therefore sets only:

```
permissions:
  contents: read
  actions: read
```

If GITHUB_TOKEN cannot read protection, the script fails loud with that reason. It does not skip. It does not embed a PAT.

Whether GITHUB_TOKEN actually 403s on this repo's protection endpoint is UNMEASURED until the planner's PR runs on GitHub-hosted runners. This machine's Node `fetch` to `api.github.com` failed TLS (`UNABLE_TO_VERIFY_LEAF_SIGNATURE`; local intercept CA). `gh api` succeeded. The script talks to the API through `gh api` so local and GHA share one client (`gh` is on GitHub-hosted runners).

## Proofs

GitHub-Actions-on-a-branch is **not** claimed. These are local.

### A. Fixture omits the required job name (and plants a step decoy)

Command: `node scripts/ci/assert-required-check-names.mjs --workflows-dir scripts/ci/fixtures/required-check-names/omit-required-name --required-contexts "typecheck + test"`

Result: **exit 1** `required_context_missing_job_name`. `job_names=["not the required check"]`. The step titled `typecheck + test` was not collected.

Second mechanism: parser failed and reported a bogus job name list. Rejected because the fixture was READ and contains exactly one job `name: not the required check` plus a step `name: typecheck + test`, and the printed `job_names` is that one job name.

This is also the cheap-satisfier test for input type: if the collector ingested every `name:` scalar, this fixture would have passed.

### B. Copy of real `ci.yml` with the load-bearing name renamed, then restored

Copied `.github/workflows/ci.yml` to a temp dir, replaced `name: typecheck + test` with `name: typecheck plus test RENAMED`, ran the script against that copy with `--required-contexts "typecheck + test"`.

Result: **exit 1** `required_context_missing_job_name`. `job_names=["required check names","typecheck plus test RENAMED"]`.

Landing tree after restore (copy deleted): `name: typecheck + test` still present in `.github/workflows/ci.yml`. READ after the proof.

Second mechanism: the script still read the landing tree instead of the copy. Rejected because printed job names include `typecheck plus test RENAMED` and do not include `typecheck + test`.

### Opposite: current workflows + required `["typecheck + test"]`

Command: `node scripts/ci/assert-required-check-names.mjs --workflows-dir .github/workflows --required-contexts "typecheck + test"`

Result: **exit 0**. `job_names=["block13 offline 7/7 (txgio frame)","required check names","typecheck + test"]`.

Second mechanism: the required list was empty and forall passed. Rejected because the process printed `required=["typecheck + test"]` and the empty-list path is a distinct failure code (next).

### Empty required list (cheap satisfier of forall)

`--protection-json scripts/ci/fixtures/required-check-names/empty-protection.json`

Result: **exit 1** `empty_required_contexts`.

Second mechanism: file read failed. Rejected because the failure code is `empty_required_contexts` after a successful parse of `contexts: []` / `checks: []`, not `api_unreadable`.

### Missing contexts field (unreadable, not empty)

`--protection-json scripts/ci/fixtures/required-check-names/missing-contexts-field.json`

Result: **exit 1** `api_unreadable`: "protection payload has neither contexts nor checks (unreadable, not empty)".

Absent, empty, and unmeasured are not collapsed.

### Live API, this machine, via `gh`

Command: `node scripts/ci/assert-required-check-names.mjs --repo empressaioemail-tech/hauska-engine --branch main` with `GH_TOKEN` from `gh auth token`.

Result: **exit 0**. `required=["typecheck + test"]` from `https://api.github.com/repos/empressaioemail-tech/hauska-engine/branches/main/protection/required_status_checks`.

### API unreadable: missing token

Unset `GH_TOKEN` / `GITHUB_TOKEN`, same command.

Result: **exit 1** `api_unreadable`: "GITHUB_TOKEN/GH_TOKEN is missing; cannot read branch protection (fail closed, not skipped)".

### API unreadable: bad token

`GH_TOKEN=invalid-token-not-a-secret`

Result: **exit 1** `api_unreadable`: `gh api ... exited 1` / HTTP 401 Bad credentials. Not treated as an empty required set.

### `--expect-failure` invert (what the CI self-test step runs)

Omit fixture with `--expect-failure`: **exit 0**, `expect-failure satisfied via required_context_missing_job_name`.
Empty protection with `--expect-failure`: **exit 0**, `expect-failure satisfied via empty_required_contexts`.
If the instrument could not fail, `--expect-failure` would exit 1.

### Parsed job names from the landing workflows

`--dump-job-names` (YAML parse, both workflow files READ in full):

- `typecheck + test` from job id `ci` in `ci.yml`
- `required check names` from job id `required-check-names` in `ci.yml`
- `block13 offline 7/7 (txgio frame)` from job id `block13-cert-grade` in `block13-cert-grade.yml`

No `workflow_call` children. That is from parsing both files' `jobs:` maps, not from a text search concluding "no other callers". Job-level `uses:` was none. Remote reusable workflows: none observed.

Node `fetch` to `api.github.com` on this machine: failed TLS. That is UNMEASURED as a GITHUB_TOKEN-in-Actions result, not a zero.

## Throwaway proof PR (planner)

One-line recipe: open a discard PR whose only diff is renaming `.github/workflows/ci.yml` job `ci` from `name: typecheck + test` to `name: typecheck plus test`, then confirm `required check names` is red and `typecheck + test` is missing from the PR checks. Do not merge it. This seat did not open that PR.

## leave_behind

```
leave_behind:
- item: replicate required-check rename control to legacy-design-tools (4 names: "SS-W18 api-server boots", "Typecheck", "Test", "SS-W16 tier2 flood not served")
  owner: planner
  plan_row: Stage 2 follow-on
- item: replicate required-check rename control to hauska-map (2 names: "No double-encoded source", "test")
  owner: planner
  plan_row: Stage 2 follow-on
- item: add check-run name "required check names" to hauska-engine required_status_checks if this job is to block merge; today it cannot
  owner: planner
  plan_row: Stage 2 follow-on
- item: GITHUB_TOKEN cannot be granted administration; live API step will fail loud on 403 until a GitHub App installation token with Administration:read exists. Do not embed a PAT. Do not skip.
  owner: planner
  plan_row: Stage 2 follow-on
```

## What this seat did not do

No git add, commit, push, or PR.
Did not rename `name: typecheck + test` on the landing tree.
Did not claim the GitHub-Actions-on-a-branch proof.
