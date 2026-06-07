---
id: 2026-06-07_cc-agent-E_engine_lift_engine_core
title: Dispatch - engine lift step 4, reasoning engines into engine-core + engine-api
date: 2026-06-07
agent: cc-agent-E
repo: hauska-engine
kind: dispatch
status: QUEUED - FIRE AFTER the adapters lift lands (step 3) and M-Stabilize 2C is clear
related: [00_current_state, 20_agent_operating_rules, 56_engine_extraction_sprint, 55_spine_data_intelligence_stack, _decisions/2026-06-07_full_engine_extraction_and_data_packages]
---

# Engine lift step 4 - reasoning engines into engine-core + engine-api

> **QUEUED.** Fire after the adapters lift (step 3) has landed and M-Stabilize 2C is clear. This lifts the reasoning engines into the spine and stands the engine-api endpoints up over them. The largest lift; expect multiple PRs. Verify identifiers against live source before firing.

You are **cc-agent-E**, the single owner of `hauska-engine` for this run.

## Model (HR-12)

Default: **Grok Build 0.1**. Escalate to Claude only if Grok fails after retry; log it. Cursor base URL `https://api.x.ai/v1`.

## Atoms to resolve

- `current-state:portfolio` - fleet status, blockers
- `sprint:56` - engine extraction (step 4)
- `sprint:55` - the engine inventory being lifted

## Read first

1. [`56_engine_extraction_sprint.md`](../56_engine_extraction_sprint.md) - what-moves table
2. [`55_spine_data_intelligence_stack.md`](../55_spine_data_intelligence_stack.md) - the engines (site-context, hydrology, plan-review/finding, briefing, decomposition, precedence) and their pipelines
3. The `packages/engine-core` + `services/engine-api` skeletons + the gate-front seam contract (PR #67)
4. [`20_agent_operating_rules.md`](../20_agent_operating_rules.md) - HR-1, HR-2, HR-3, HR-8, HR-11

## Workspace ownership

- Clone: `P:\hauska-engine` (worktree if primary dirty)
- Branch prefix: `engine/`
- Refuse alien HEAD or uncommitted state; report verbatim `git status` + `git log -3`

## Scope

**In scope (sequence the sub-lifts; multiple PRs expected):**

- Port the reasoning engines from cortex-api into `packages/engine-core`, consuming `packages/adapters` (step 3): briefing-engine, finding-engine (incl. the plan-set decomposition + per-discipline orchestration from #146 and the precedence/reconciliation pass once it lands), hydrology/drainage (bake the pysheds sidecar into the engine image - closes the deploy gap), site-topography. Preserve citation + confidence + atomId lineage (the arrow-two ledger depends on it).
- Implement the `engine-api` `/v1/*` endpoints over engine-core, behind the gate-front seam contract (the `X-Hauska-*` context the gate supplies). The LLM mode (Grok-first / Anthropic fallback) moves with the engine.
- Behavior-parity tests against the cortex-api originals.
- Do NOT modify cortex-api here (that is the paired cc-agent-C cutover).

**Out of scope:**

- cortex-api changes + the consumer cutover (cc-agent-C).
- Deploy/Cloud Run wiring of engine-api (separate, after parity).

## Acceptance criteria

- engine-core carries the reasoning engines with behavior-parity tests green (report verbatim).
- engine-api `/v1/*` endpoints serve the engines behind the seam; the gate context is honored.
- Citation/confidence/atomId lineage preserved.
- pysheds baked into the engine image (hydrology full-fidelity).
- CI green. PRs held for operator merge.
- Verbatim verification artifacts (HR-8).

## Reporting

Write to `P:\doc_repo\_inbox\` as `2026-06-07_hauska-engine_cc-agent-E_engine_lift_engine_core.md`. Atom refs, model, PR URLs + SHAs, blockers verbatim.
