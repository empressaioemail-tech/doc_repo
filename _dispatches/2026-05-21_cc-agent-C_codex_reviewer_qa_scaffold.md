---
id: 2026-05-21_cc-agent-C_codex_reviewer_qa_scaffold
title: Dispatch — cc-agent-C codex-reviewer-qa artifact scaffold (CDX-Phase1-1)
date: 2026-05-21
agent: cc-agent-C
repo: legacy-design-tools
kind: dispatch
related: [48_codex_program_plan, _decisions/2026-05-21_codex_reviewer_qa_surface_location, 11_roadmap, 43_cortex_qa_backlog, 20_agent_operating_rules, CLAUDE.md]
---

# cc-agent-C dispatch — codex-reviewer-qa artifact scaffold

You are cc-agent-C owning the `legacy-design-tools` repo. This dispatch builds the scaffold for the Codex 1b reviewer-side QA surface and resolves the build half of CDX-Phase1-1 in [`48_codex_program_plan.md`](../48_codex_program_plan.md). It advances the M-CodexQA milestone.

## Activation gate

This dispatch does not run yet. It fires only after your Cortex QA close-out is merged: PRs #59, #60, #61, #62 landed on `legacy-design-tools` `main`, and the QA-04 operator-supervised canary resolved. Until then, `legacy-design-tools` has two concurrent agents (you on the close-out, cc-agent-AC on QA-17); a third concurrent workstream in the repo is the collision the operating rules forbid. When the close-out is merged you are the natural owner of this scaffold as the repo expert, on your existing clone, no new clone.

## Why this exists

CDX-Phase1-1 was the open Phase 1 design call in `48_codex_program_plan.md`: where the Codex 1b reviewer-side QA surface lives. It is resolved per [`_decisions/2026-05-21_codex_reviewer_qa_surface_location.md`](../_decisions/2026-05-21_codex_reviewer_qa_surface_location.md): a new dedicated `codex-reviewer-qa` artifact, separate from `plan-review` (the architect-side window) and `qa` (the test harness). Read that decision record before starting; it carries the reasoning for the rejected options.

## Scope

Build the artifact scaffold only. The Phase 1 exit criterion in `48_codex_program_plan.md` is "reviewer-side QA surface location settled and scaffold built."

- Create `artifacts/codex-reviewer-qa/` following the structure and build conventions of the existing artifacts (`plan-review` is the closest reference). Codex-branded name as decided; do not name it `plan-review`-anything or `codex-1b-*`.
- Wire it into the repo's artifact build so it compiles and is routable clean, with a placeholder reviewer-QA page.
- It consumes cortex-api's own L-surface and read endpoints, the same in-process path the in-app surfaces use, not the MCP server. Confirm the engine contract it will call exists or stub the client cleanly where it does not.
- typecheck and build green. Open a PR for review.

## Out of scope

The reviewer surface functionality itself. CDX-3 (one-click AI review pass), CDX-4 (finding accept/edit/reject loop), CDX-5 (jurisdiction switcher), and CDX-9 (comment-letter auto-draft) are `48_codex_program_plan.md` Phase 2 and a later dispatch. This dispatch stops at a routable, building scaffold.

## Run posture

Operator-supervised, not maximum-autonomy. Open a PR for review. Do not self-deploy `cortex-api`.

## Workspace ownership

cc-agent-C owns the `legacy-design-tools` working tree. Branch under `codex-reviewer-qa/*`. Cross-repo work uses `git worktree add` from a separate clone.

## Reporting

At every session break-point, write your session summary and any decision-relevant finding to `P:\doc_repo\_inbox\` as `<date>_legacy-design-tools_cc-agent-C_<topic>.md`. The `_inbox/` write is the one explicitly permitted cross-repo write per HR-11 in [`20_agent_operating_rules.md`](../20_agent_operating_rules.md); it supersedes any older "no cross-repo doc writes" instruction. Do not draft the summary into `legacy-design-tools/_research/` and do not commit to the doc repo. Keep committing the original in your own repo.
