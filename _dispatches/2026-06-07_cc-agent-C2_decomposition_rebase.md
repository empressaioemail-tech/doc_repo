---
id: 2026-06-07_cc-agent-C2_decomposition_rebase
title: Dispatch - rebase + land the plan-set decomposition PR
date: 2026-06-07
agent: cc-agent-C2
repo: legacy-design-tools
kind: dispatch
status: FIRE-READY (small; lands preserved work b06d0ac cleanly on main)
related: [00_current_state, 20_agent_operating_rules, 56_engine_extraction_sprint, 2026-06-07_cc-agent-C2_plan_set_decomposition]
---

# Rebase + land the plan-set decomposition PR

> **FIRE-READY.** The WS1 plan-set decomposition work is committed as `b06d0ac` on `2d/plan-set-decomposition` in the c2 clone, but that branch is based on `a818805` which predates the squash-merge of PR #112, so a planner cherry-pick onto main hit conflicts in `findings.ts`, the schema integration test, and `pnpm-lock.yaml`. This dispatch rebases cleanly and lands it. Verify identifiers against live source before firing.

You are **cc-agent-C2**, the single owner of the `P:\legacy-design-tools-c2` clone for this run.

## Model (HR-12)

Default: **Grok Build 0.1** (multi-file / agentic). Escalate to Claude only if Grok fails after retry; log the escalation. Cursor base URL `https://api.x.ai/v1`.

## Atoms to resolve

- `current-state:portfolio` - fleet status, blockers
- `sprint:55` - the decomposition is WS1; `sprint:56` - it is migration cargo for the extraction
- `product:cortex` - finding-engine + api-server

## Read first (after atoms)

1. [`_inbox/2026-06-07_legacy-design-tools_cc-agent-C2_plan_set_decomposition.md`](../_inbox/2026-06-07_legacy-design-tools_cc-agent-C2_plan_set_decomposition.md) - what was built (your prior report)
2. [`56_engine_extraction_sprint.md`](../56_engine_extraction_sprint.md) - this work is engine-core migration cargo
3. [`20_agent_operating_rules.md`](../20_agent_operating_rules.md) - HR-1, HR-8, HR-11

## Workspace ownership

- Clone: `P:\legacy-design-tools-c2`
- Branch: rebase the decomposition work onto current `origin/main`
- Refuse alien HEAD or uncommitted state; report verbatim `git status` + `git log -3`

## Scope

**In scope:**

- Recon: confirm `b06d0ac` on `2d/plan-set-decomposition` carries the decomposition work (classifier, orchestrator, dedupe, migration `0018`, feature flag, finding-engine + api-server changes). Report `git show --stat b06d0ac`.
- Create a fresh branch off current `origin/main` and replay the decomposition delta onto it (cherry-pick `b06d0ac` or rebase), resolving the conflicts:
  - `artifacts/api-server/src/routes/findings.ts` - keep main's changes + add the `discipline` wire field and orchestrated-path wiring.
  - `lib/db/src/__tests__/integration/schema.integration.test.ts` - merge the new table into main's drift list.
  - `pnpm-lock.yaml` - regenerate against main (`pnpm install`), do not hand-merge.
- Confirm migration `0018_plan_set_decomposition.sql` orders correctly after main's `0017`.
- Run the finding-engine suite + typecheck on Linux/CI (local Windows rollup blocked the prior run); the suite must be green this time.
- Push, open the PR, hold for operator merge.

**Out of scope:**

- Any engine relocation to hauska-engine (that is the later lift; this just lands the work as cargo on cortex-api main).
- New decomposition features.

## Acceptance criteria

- Clean branch off current `origin/main` carrying only the decomposition delta; no #112 / 0017 re-introduction; no `pnpm-lock.yaml` hand-merge.
- Finding-engine suite + typecheck green (report verbatim).
- Migration `0018` orders after `0017`.
- PR opened, held for operator merge.
- Verbatim verification artifacts in report (HR-8).

## Reporting

At break-point write to `P:\doc_repo\_inbox\` as `2026-06-07_legacy-design-tools_cc-agent-C2_decomposition_rebase.md`. Include the prior `b06d0ac` reference, the new branch SHA, PR URL, test output verbatim, blockers verbatim.
