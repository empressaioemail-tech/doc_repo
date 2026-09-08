---
id: 2026-09-08_clean_automerge_reintroduced_the_defect_finding
title: A conflicted PR is never CI-checked, and the merge that fixes that silently reintroduced the defect
date: 2026-09-08
last_updated: 2026-09-08
status: open
applies_to: hauska-engine
plan_rows: [P-120]
seat: integration (doc-repo-79)
severity: process-control
related:
  - _inbox/2026-09-08_PARKED_hauska-engine-api_p120_production_deploy.md
---

# Four failures in one chain, and only the last guard fired

Found by the r05 lane (doc-repo-55) and the integration seat between 22:00Z and 23:30Z on
2026-09-08, during the P-120 R-05 deploy. Recorded as ONE shape because each link produced the
next, and any of them alone would read as bad luck.

## The chain

    1. local green      the lane's suite passed: 180 files, 1,437 tests
    2. dead base        that green was computed against a base that no longer existed --
                        main had moved to 48143d79 while the branch carried nine commits
    3. CI never fired   the PR was CONFLICTED, so GitHub could not build refs/pull/411/merge,
                        so no run was ever QUEUED -- not cancelled, not failed, never created
    4. clean auto-merge merging main in to fix (3) reported "Auto-merging" with NO conflict and
                        produced WRONG code: it re-inserted the wide field block into
                        buildLdtNarrativeFacts, restoring the exact regression just fixed
    5. one guard fired  the frozen-list assertion written for the OTHER SIDE's contract

## Link 3, because the symptom is indistinguishable from nothing being wrong

`ci.yml` triggers on `pull_request` for base `main`. GitHub runs that event against
`refs/pull/N/merge`, a synthetic commit made by merging head into base. **A conflicted PR has no
such commit, so there is nothing to check out and no run is queued.**

The lane pushed twice, waited thirteen minutes, closed and reopened the PR to force a `reopened`
event, waited six more. Silence. It read as "GitHub Actions is silently broken," which is a
plausible mechanism that produces the identical observation, and it was the wrong one.

The tell is one API field:

    mergeable=false   mergeable_state=dirty   rebaseable=false

**Both available options were wrong, for the same underlying reason.** Waiting was the
conservative-looking choice and would have waited forever, because no run was coming. Merging on
local-green would have shipped code verified against a base that no longer existed. Neither is
visible without reading the merge state.

This very likely explains an earlier incident on the same lane, where the same silent-CI symptom
let two commits sit unverified and "the first merge shipped only one of three commits." Same
shape, previously unexplained.

## Link 4, which is the finding worth keeping

**A clean auto-merge is not a correct one.** Git reported no conflict and produced code that
reintroduced the defect: the wide payload block returned to the builder that feeds cortex-api's
`/research/narrative-section`, the exact regression fixed minutes earlier.

Nothing in a 1,437-test suite would have caught it. The wide payload is **valid, well-typed, and
only fails against a service this repo does not run.** Every local check passes on it.

The only thing that fired was a frozen-list assertion pinned on the LDT-facing builder in the fix
commit itself. That is the narrow case where a frozen list is the right instrument rather than a
change-detector: **the contract belongs to the other side.** A frozen list over a module's own
internals only tells you the module changed, which you already knew.

## The restatement that is better than the rule

In the lane's words, kept because it is more precise than how this operation had it:

> "merge only on green CI" is not protecting against a careless local run. It is protecting
> against a CORRECT local run against the wrong tree.

## The dormant control, stated per the three-question gate

Nothing in this fleet notices a PR that is conflicted and therefore never checked. An unchecked
PR is visually identical to one whose checks have not started yet, and **there is no timeout on
"not started."**

    executes  a check over open PRs reading mergeable_state, failing on `dirty`, and on any PR
              whose head commit has no check-run after some bound
    triggers  a schedule, or PR open/synchronize
    fails     non-zero naming the PR and which of the two states it is in -- they need different
              fixes: `dirty` needs a merge, `no runs after N minutes` needs an Actions look
    bypasses  a PR whose conflict appears AFTER the last check ran, which is exactly what
              happened here; the check has to re-evaluate on base movement, not only on push

Not built. Recorded rather than asked of a lane mid-flight.

## Where it ended

The lane stopped rather than working around "merge only on green CI," and asked. That was correct
and would have been correct even if the diagnosis had gone the other way. Deployed and verified
afterwards: `hauska-engine-api-00193-xex` at 100 percent, digest `sha256:25446d8e...`, confirmed
from `status.traffic` by field name and independently by the integration seat.

## Open

The conflicted-PR / unchecked-PR control above.

Whether the earlier "one of three commits" incident was this same cause. Strongly suggested, not
established; the evidence is in that PR's history and nobody has looked.
