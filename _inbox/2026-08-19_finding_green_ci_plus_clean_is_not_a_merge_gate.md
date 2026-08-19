---
id: 2026-08-19_finding_green_ci_plus_clean_is_not_a_merge_gate
title: Finding — a green check-run plus a CLEAN merge state does not mean the merge is green
status: active
last_updated: 2026-08-19
applies_to: program
owner: nick
related:
  [
    90_runbooks/DEV_PROCESS,
    90_runbooks/AGENT_CONTRACT,
    90_operations/OPS-17_govtech_stack_plan_of_record,
  ]
---

# A green check-run plus a CLEAN merge state is not a merge gate

Measured 2026-08-19 on OPS-17 Lane B, on two repositories at once, and it generalises to every repo in
this program.

## The standing rule, and the hole in it

The AGENT_CONTRACT rule is: **merge only on the CI check-run conclusion string "success"** — not on a
`gh pr checks` "pass", not on a `gh` exit code. That rule is correct and it held. It is also not
sufficient, and this session produced two independent demonstrations in one hour.

A check-run conclusion is a statement about **the PR's own tree**. `mergeStateStatus: CLEAN` is a
statement about **textual conflict**. Neither is a statement about the tree that exists after the merge.
Where a repo does not require branches to be up to date before merging — none of the three SmartCity
repos does — those two green signals can both be true while the merge result is red.

## Demonstration one, same repo

`smartcity-dashboards` PR #23 (G-89, the lens flash) and PR #24 (G-88 item 7, the addressability gate)
both branched from `6a4580d`. Both went green. They share no source file: #23 owns `web/index.html`,
`web/shell.css` and `web/app.js`; #24 is test-only. GitHub reported #24 as `mergeable: MERGEABLE`,
`mergeStateStatus: CLEAN` after #23 merged.

Merging `origin/main` into #24 locally and running the suite: **218 tests, 215 pass, 3 fail.**

- #23 added `html[data-surface] .lens` rules to `shell.css`, so `data-surface` correctly entered #24's
  stylesheet-read hook population and became REQUIRED in static markup. It is stamped at runtime, so it
  is legitimately absent. #24's created-by-script derivation recognised `X.dataset.Y =` but not
  `setAttribute("data-...", ...)`, which is the form #23 used. Two failures.
- #24 pinned the exact set of words that appear only inside CSS comments, as evidence that the
  comment-strip is what makes an injected `class="hidden"` fire. #23's new CSS comments explain that
  `app.js` is a module, which added a seventh word, `js`. One failure.

Neither PR is wrong. The combination is. The gate was right to fire and its own derivation was
incomplete, which is the most useful kind of failure: an instrument that catches a real interaction and
exposes a hole in itself in the same run.

## Demonstration two, across repos

`smartcity-kit` PR #7 vendors `shell.css`, `index.html` and `app.js` from `smartcity-dashboards`, and
`.github/workflows/ci.yml` checks the product out at `ref: main` so `vendor-parity.test.mjs` arm B
byte-compares against whatever main is at the moment CI runs. PR #7 went green against product main
`6a4580d`. Merging PR #23 moved product main to `ecfae70` and changed all three vendored files.

PR #7's check-run conclusion is still the string `success` and GitHub still reports it `MERGEABLE` /
`CLEAN`. Re-run today, arm B is red. **The green is a fact about a world that no longer exists**, and
the CI configuration that makes the guardrail survive a clone is exactly what makes its green perishable.

Merging on that green would have shipped a kit vendoring a stale product stylesheet — the precise defect
G-88 items 4 and 5 were opened to fix.

## The rule this adds

The check-run conclusion string is necessary and is not sufficient. Before merging, if the base branch
has moved since the PR head was built, **re-green the PR against the current base and read the
conclusion string on the NEW head**. For a cross-repo consumer, the base that matters is the base of
every repo its CI reads, not only its own.

Cheap and mechanizable version, in order of preference:

1. Turn on "Require branches to be up to date before merging" on the protected branch. Then GitHub
   enforces it and nobody has to remember, which is the only kind of control this program trusts.
2. Failing that, the merging agent merges the base locally and runs the suite before pressing merge.
   That is what caught both cases here and it costs one command.

Note that `git rebase` is blocked in this environment's Bash tool. `gh api -X PUT
repos/<owner>/<repo>/pulls/<n>/update-branch` does the same job server-side and re-triggers CI on the
new head, which is the form to reach for.

## The generalisation worth keeping

This is the same shape as the three premises measured false at A-071 and the fourth at
`_inbox/2026-08-19_g88_item10_walk_is_vacuous.md`: a control that is genuinely real, genuinely fires, and
covers a slightly different question than the one being asked of it. "Did this tree pass" is not "will
main pass". The distance between those two sentences is where a whole session's work can quietly land
broken.

Two other instruments in this program have the same perishable-green property and are named here rather
than discovered later: any test in `smartcity-kit` that reads `SC_DASHBOARDS_DIR`, and any doc test that
asserts against a file another repo owns.
