---
id: 91_branch_protection_runbook
title: Branch Protection Runbook
status: draft
last_updated: 2026-08-19
applies_to: portfolio
related: [61_enforcement_doctrine, 90_enforcement_build_order]
owner: operator
---

# Branch Protection Runbook

## Why this exists

A repository without branch protection leaves every continuous integration check advisory: it runs, reports accurately, and blocks nothing. That is the sixth state in doc 61, and it invalidates more controls at once than the other five combined. The instance that established the estate was in that state, and the Stage 1 application that followed, are in `_inbox/2026-08-20_branch_protection_close.json` and `_decisions/2026-08-20_branch_protection_stage1.md`. This runbook states how to apply protection, not what GitHub currently returns.

Enabling protection converts existing checks from advisory to binding in a single action. It is the highest leverage item in the enforcement programme and it is a settings change rather than a build.

## Before starting

**Permissions.** This requires admin on each repository. If the executing agent lacks admin, it must stop and say so rather than reporting partial success. Confirm first:

```
gh api repos/OWNER/REPO --jq '.permissions'
```

Before changing anything, record what GitHub returns for protection and ruleset count, and include that snapshot in the close. The expected pre-application reading, when protection has not been applied, is a 404 with "Branch not protected" and a ruleset count of zero. That is a check against the API, not a durable claim about the estate.

## Configuration A, doc_repo. History protection only.

doc_repo's failure mode is not that bad code merges, it is that canon is lost or silently rewritten. The load bearing protections are the ones that protect history. Required review would break the planner's direct push path on day one, which produces the bypass habit this programme exists to prevent.

**Apply: block force push, block deletion. Do not require pull requests. Do not require status checks.**

```
gh api -X PUT repos/OWNER/doc_repo/branches/main/protection \
  -H "Accept: application/vnd.github+json" \
  -f required_status_checks=null \
  -F enforce_admins=false \
  -f required_pull_request_reviews=null \
  -f restrictions=null \
  -F allow_force_pushes=false \
  -F allow_deletions=false
```

Note that required_status_checks, enforce_admins, required_pull_request_reviews and restrictions are required keys in this payload and may be null, but may not be omitted. Verify the current payload shape against GitHub's REST documentation before running, since a rejected call that reports an error is better than a partial application that reports success.

**Do not set enforce_admins on doc_repo.** Direct push by the planner is the intended path and admin enforcement would block it.

## Configuration B, the three product repositories. Staged.

hauska-map, hauska-engine, legacy-design-tools.

### Stage 1, apply now. Structural protection, no check requirements.

```
gh api -X PUT repos/OWNER/REPO/branches/main/protection \
  -H "Accept: application/vnd.github+json" \
  -f required_status_checks=null \
  -F enforce_admins=true \
  -f required_pull_request_reviews[required_approving_review_count]=0 \
  -f restrictions=null \
  -F allow_force_pushes=false \
  -F allow_deletions=false
```

This blocks force push and deletion, routes changes through pull requests, and does not yet require any check to pass. Nothing that currently works stops working.

**enforce_admins is true here and it matters.** Repository admins bypass most protections by default. Left off, protection runs and does not bind for the person doing most of the merging, which is the sixth state rebuilt one layer up.

### Stage 2, apply after the reliability report. Required checks.

Do not run stage 2 until the property seat has reported which checks pass reliably, established from run history rather than assumed. A protection rule that blocks every merge on day one trains the bypass habit.

List what is currently selectable:

```
gh api repos/OWNER/REPO/commits/main/check-runs --jq '.check_runs[].name'
```

A check must have run at least once on the protected branch before it can be required. Anything that has not run recently on main will not appear.

Then add the reliable subset:

```
gh api -X PATCH repos/OWNER/REPO/branches/main/protection/required_status_checks \
  -H "Accept: application/vnd.github+json" \
  -F strict=true \
  -f 'contexts[]=CHECK_NAME_1' \
  -f 'contexts[]=CHECK_NAME_2'
```

Report which checks were made required, which were deferred, and the reason per deferral.

## Three failure modes to avoid

**Admin bypass.** Covered above. enforce_admins true on product repositories, false on doc_repo, and the difference stated deliberately rather than left to default.

**Skipped counts as passing.** A required check is satisfied by a success, skipped, or neutral status. A check that skips therefore satisfies its own requirement without running. This is the presence shaped defect inside GitHub's own semantics.

There is a known live instance: the markets root test command uses a flag that skips a workspace whose script is absent, so a removed script would produce a skip that reads as a pass. Before requiring any check, confirm it cannot skip. Where it can, either remove the skip path or require a check that fails closed instead.

**Job renames break required checks silently.** The required check is matched by job name. Renaming a workflow job removes the requirement without any error, and the branch becomes unprotected for that check. Add a note to the repository's contributing documentation, and treat any job rename as requiring a protection update in the same commit.

## Verification, by violation

A check observed only passing has not been observed working. Do not report protection as enabled on the basis of the settings API returning a configuration.

Two derivations are available and they are different parties. The settings interface reports what the repository is configured to do. A deliberate violation reports what it actually does.

For each repository, on a disposable branch:

```
git checkout -b protection-verify-DATE
git commit --allow-empty -m "protection verification, delete after"
git push origin protection-verify-DATE
```

Then attempt the action protection should refuse. For doc_repo, attempt a force push to main and confirm refusal. For product repositories, attempt a direct push to main and confirm refusal.

Record the exact error returned. A refusal that produces the expected error is the proof. A push that succeeds means protection is not applied regardless of what the settings endpoint reports.

Delete the verification branch afterward.

This is verify by violating applied to protection itself, and it is distinct from probing a control to find a way through: it is deliberate violation of your own protection on a disposable branch to confirm refusal, which is the standard method.

## Acceptance criteria

1. Snapshot of the prior state recorded per repository, in the output.
2. doc_repo carries history protection and no review requirement. Planner direct push verified still working.
3. The three product repositories carry stage 1 protection with enforce_admins true.
4. Every repository verified by violation, with the refusal error quoted.
5. Stage 2 not applied, with the reliability report named as the gate.
6. A table of which repositories now carry which protections, and which are deferred with the reason.
7. Any repository where the executing agent lacked admin is reported as not done rather than omitted.

## What this unblocks

The markets deploy gate stops reporting continuous integration controls as advisory and goes quiet without a code change, since TW-70 queries protection directly.

The property seat's step 2 clears and the flood chain proceeds.

Every existing check in the estate becomes binding at once, which is a larger single gain than every control built in this programme so far combined.

## Revision history

2026-08-19, drafted following the discovery that no repository in the estate carries branch protection and every continuous integration check is therefore advisory.
