---
date: 2026-05-22
repo: legacy-design-tools
agent: cc-agent-R
kind: incident-note
related_runbook: 90_runbooks/agent_workspace_hygiene
session_summary: 2026-05-22_legacy-design-tools_cc-agent-R_phase-b-frontend.md
prs: [80]
status: contained — recovery complete on cc-agent-R side; operator action needed to untangle origin/feat/p2-deploy-workflow-actions
---

# Workspace-hygiene incident — HEAD silently switched mid-session

## Summary

During the Phase B CI fix, my local HEAD moved out from under me from
`feat/cortex-render-gap-fill-ui` to a branch I had never created or
checked out — `feat/p2-deploy-workflow-actions` — between two adjacent
shell calls in the same session. My `git add` + `git commit` for a
single-file fix landed on that unintended branch and picked up four
unrelated working-tree files staged by some other actor in the same
clone. The commit was then pushed to
`origin/feat/p2-deploy-workflow-actions`.

This is the multi-agent collision pattern
[`90_runbooks/agent_workspace_hygiene.md`](../90_runbooks/agent_workspace_hygiene.md)
codifies (one clone per agent; refuse-to-proceed on evidence of another
agent). The dispatch said cc-agent-C was operating in its own clone;
empirically, something else was operating in the cc-agent-R clone too.

## What happened (reflog reconstruction)

```
aa35f9d HEAD@{0}  commit  (the contaminated fix commit)
233cf82 HEAD@{1}  checkout: moving from feat/cortex-render-gap-fill-ui
                            to feat/p2-deploy-workflow-actions
233cf82 HEAD@{2}  checkout: moving from main
                            to feat/cortex-render-gap-fill-ui
```

`HEAD@{1}` — the checkout to `feat/p2-deploy-workflow-actions` — was
**not initiated by cc-agent-R**. Between `HEAD@{2}` (my deliberate
checkout to the Phase B branch) and `HEAD@{0}` (my fix commit), my
tooling did not run any `git checkout`, `git switch`, or `gh pr` call.
The only intervening commands were:

- `pnpm -w run typecheck:libs`
- `pnpm --filter design-tools run typecheck`
- `pnpm --filter @workspace/portal-ui run test`
- `gh pr checks 80`
- `gh run view 26314589612 --log-failed`
- two `Edit` calls to `RenderKickoffDialog.tsx`
- a `Write` to `P:\doc_repo\_inbox\…phase-b-frontend.md`

None of those switch branches. So another actor in this same clone did
the checkout and staged the four deploy files. The contaminated commit
contained:

- `lib/portal-ui/src/components/RenderKickoffDialog.tsx` — cc-agent-R's fix (legitimate).
- `.github/workflows/cloud-run-deploy.yml` (+246 lines)
- `docs/deploy.md` (+94 lines)
- `lib/db/package.json` (+1 line)
- `lib/db/scripts/migrate-prod.mjs` (new file, +187 lines) — clearly operator P2 deploy work.

The four deploy files were **already staged** in the index when I ran
`git add lib/portal-ui/...` followed by `git commit`. `git add` only
adds the named paths, so the four extras were staged by the other
actor.

## Recovery on cc-agent-R's side

1. Re-applied the dialog fix on `feat/cortex-render-gap-fill-ui`
   (commit `8c0f064`) and pushed; PR #80 will pick it up.
2. Deleted local `feat/p2-deploy-workflow-actions` so I cannot
   accidentally commit there again.
3. Did not touch `origin/feat/p2-deploy-workflow-actions` — that
   branch carries the operator's P2 deploy work and is not
   cc-agent-R territory.

## Outstanding — operator action required

`origin/feat/p2-deploy-workflow-actions` is currently at commit
`aa35f9d27bf0a16fdeb23307c467e8728591e475`. That commit mixes cc-agent-R's
single-file dialog fix with the operator's four deploy files. The
dialog change is now redundant — it lives independently on
`feat/cortex-render-gap-fill-ui` (PR #80) as commit `8c0f064` and will
land on `main` when that PR merges. The operator can untangle in any
of three ways:

- **Drop the dialog file from the branch**: `git revert -n aa35f9d --
  lib/portal-ui/src/components/RenderKickoffDialog.tsx` then commit
  the revert. The four deploy files stay; the dialog change reverts.
  Force-push.
- **Reset and re-commit cleanly**: from a fresh checkout, `git reset
  --hard 233cf82~1` (i.e. back to PR #79's merge into main), reapply
  just the four deploy files, commit, force-push.
- **Rebase onto main after PR #80 merges**: once `8c0f064`'s dialog
  fix is in main via PR #80 merge, rebasing `feat/p2-deploy-workflow-actions`
  onto main will drop the duplicate dialog change as an already-applied
  patch.

The cleanest is the third (no force-push), but waits on PR #80 to merge first.

## Why this incident matters

The dispatch's collision plan (boilerplate from
[`90_runbooks/agent_workspace_hygiene.md`](../90_runbooks/agent_workspace_hygiene.md))
named cc-agent-C as the concurrent agent and bounded overlap to
"drizzle migration numbering and the atom registry." Reality: another
actor was operating in cc-agent-R's clone, staging files I never saw,
and silently switching the branch. The runbook's prescription is
exactly "one clone per cc-agent — never two agents against the same
working tree." This clone violated that.

Recommend the planner / operator:

1. Audit which agent or operator step ran in
   `p:\legacy-design-tools` concurrent with cc-agent-R on 2026-05-22
   evening. The deploy files look like operator P2 work; if it was
   manual operator activity, formalise it as a "single-agent
   sequential" hand-off rather than a parallel-tree share.
2. Extend the workspace-hygiene runbook with a recipe for
   "your HEAD just moved without you doing it" — reflog inspection
   and recovery — since the multi-agent collision pattern is now
   recurring.

## Capture per HR-11

Per the runbook §"Recovery if the rule was violated" step 5: "Capture
the incident in a session summary." This note plus the Phase B session
summary (`…cc-agent-R_phase-b-frontend.md`) constitute that capture.
