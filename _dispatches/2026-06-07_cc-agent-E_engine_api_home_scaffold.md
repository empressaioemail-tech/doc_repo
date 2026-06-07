---
id: 2026-06-07_cc-agent-E_engine_api_home_scaffold
title: Dispatch - scaffold the hauska-engine engine-api home (extraction step 1)
date: 2026-06-07
agent: cc-agent-E
repo: hauska-engine
kind: dispatch
status: FIRE-READY (parallel-safe; scaffold only, no code move)
related: [00_current_state, 01a_atom_conventions, 20_agent_operating_rules, 56_engine_extraction_sprint, 80_adrs/adr_008_engine_factor_out, _decisions/2026-06-07_full_engine_extraction_and_data_packages]
---

# Scaffold the hauska-engine engine-api home (extraction step 1)

> **FIRE-READY, parallel-safe.** Scaffold only, no engine code moves this dispatch. This stands up the destination so the later lift (gated behind M-Stabilize Phase 2C) is mechanical. Verify identifiers against live source before firing.

You are **cc-agent-E**, the single owner of `hauska-engine` for this run.

## Model (HR-12)

Default: **Grok Build 0.1** (multi-file / agentic). Escalate to Claude only if Grok fails after retry; log the escalation. Cursor base URL `https://api.x.ai/v1`.

## Atoms to resolve

- `current-state:portfolio` - fleet status, blockers
- `sprint:56` - engine extraction sprint (this is step 1)
- `decision:2026-06-07_full_engine_extraction_and_data_packages` - the commitment

## Read first (after atoms)

1. [`56_engine_extraction_sprint.md`](../56_engine_extraction_sprint.md) - target architecture, what-moves table, sequence
2. [`80_adrs/adr_008_engine_factor_out.md`](../80_adrs/adr_008_engine_factor_out.md) - the original package layout
3. [`20_agent_operating_rules.md`](../20_agent_operating_rules.md) - HR-1, HR-2, HR-3, HR-8, HR-11

## Workspace ownership

- Clone: `P:\hauska-engine`
- Branch prefix: `engine/`
- One agent per clone per [`agent_workspace_hygiene`](../90_runbooks/agent_workspace_hygiene.md)
- Refuse alien HEAD or uncommitted state; report verbatim `git status` + `git log -3`

## Scope

**In scope (scaffold, no engine logic):**

- Recon first. Report the current repo layout verbatim (`services/retrieval-api`, `packages/corpus`, `packages/atoms`).
- Create the skeletons:
  - `services/engine-api/` - a new HTTP service skeleton (health endpoint, config, no reasoning logic yet). Sibling to `retrieval-api`; retrieval-api stays untouched and read-only.
  - `packages/engine-core/` - empty package skeleton (package.json, tsconfig, index) for the reasoning engines to land in.
  - `packages/adapters/` - empty package skeleton for the site-context + subsurface adapters to land in.
- Define the **gate-front seam contract**: the service-auth interface `engine-api` will accept from the MCP gate (carries product + tenant + package context; trusts the gate's resolution). Document it; do not wire live consumers.
- Wire CI for the new service/packages (build + typecheck only; no tests to pass yet beyond skeleton).
- Do NOT move any engine code from cortex-api. That is the lift (steps 3-4), gated behind M-Stabilize 2C.

**Out of scope:**

- Any cortex-api change.
- Moving adapters / engine-core code (later lift).
- Deploying engine-api.

## Acceptance criteria

- `engine-api` service skeleton builds and serves a health endpoint locally; retrieval-api unchanged.
- `packages/engine-core` and `packages/adapters` skeletons build + typecheck.
- The gate-front seam contract is documented (the auth/context interface the gate will call).
- CI green on the new surfaces.
- PR held for operator merge (do not merge).
- Verbatim verification artifacts in report (HR-8).

## Reporting

At break-point write to `P:\doc_repo\_inbox\` as `2026-06-07_hauska-engine_cc-agent-E_engine_api_home_scaffold.md`. Include atom refs touched, model used (if not default), PR URL + branch SHA, blockers verbatim.
