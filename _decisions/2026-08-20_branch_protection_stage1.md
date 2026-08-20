---
decision_id: 2026-08-20_branch_protection_stage1
date: 2026-08-20
owner: operator
status: active
related_canonical: [90_runbooks/91_branch_protection_runbook.md, 61_enforcement_doctrine.md, 90_runbooks/90_enforcement_build_order.md]
---

## Decision

Stage 1 branch protection is on for six repositories under `empressaioemail-tech`: Config A (history only, planner direct push kept) on `doc_repo`; Config B Stage 1 (pull request required, zero approving reviews, `enforce_admins` true) on `hauska-map`, `hauska-engine`, `legacy-design-tools`, `empressa-trading`, and `smart-markets`. Stage 2 required checks are not applied.

## Context

As found 2026-08-20 before the PUT: every listed `main` returned HTTP 404 `Branch not protected` and ruleset count 0. That is the sixth state in doc 61: CI can be correct and still bind nothing. The runbook at `91_branch_protection_runbook` named the two configurations and required verification by violation, not settings-API success. Markets were in the same pass because this seat held `admin: true` on both.

## Structural commitment check

Hauska spine rule: protection is estate control, not a product surface. Cost-per-jurisdiction: not applicable. Dual interface: not applicable. Tenant sovereignty: not applicable.

## Reasoning

Config A keeps the planner's direct push on `doc_repo` because requiring a pull request there produces the bypass habit the programme exists to prevent. Force-push and deletion are the load-bearing history rules. Config B Stage 1 routes product and markets changes through pull requests and sets `enforce_admins` true so the person who merges cannot walk around the rule. Required checks wait on a reliability report from run history; requiring a flaky check on day one trains the same bypass habit.

## Reversal criteria

Revert a repository only with an operator ruling, a recorded snapshot of the protection object being removed, and a replacement control named in the same ruling. Do not disable `enforce_admins` on a Config B repository in order to "just merge." Do not add required checks without the reliability report named in the runbook.

## Dependencies

Stage 2 depends on the property seat reliability report (check names from run history, skip-path audit). TW-70 can now observe protection as present; it must not be narrated as "CI is required." Job-rename notes in contributing docs wait until Stage 2, because there are no required check names yet.
