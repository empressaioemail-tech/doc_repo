---
id: 2026-06-07_cc-agent-E_retrieval_api_healthz
title: Dispatch — retrieval API health endpoint (corpus + substrate Neon)
date: 2026-06-07
agent: cc-agent-E
repo: hauska-engine
kind: dispatch
status: ready
related: [00_current_state, 01a_atom_conventions, 20_agent_operating_rules, 76e_platform_observability_sprint]
---

# Retrieval API health endpoint (corpus + substrate Neon)

> **Fire-ready (Wave A).** Planning hold lifted 2026-06-07. Small, app-only; no operator gate blocks this one. Emit per the pinned signal contract in [`76e_platform_observability_sprint.md`](../76e_platform_observability_sprint.md) so the cc-agent-M hauska-prod uptime dispatch and the cc-agent-C hub can read the result without live coordination.

You are **cc-agent-E**, the single owner of `hauska-engine` for this run.

## Model (HR-12)

Default: **Grok Build 0.1** (multi-file / agentic). Use **grok-code-fast-1** for narrow, speed-only tasks. Escalate to Claude only if Grok fails after retry; log the escalation in your session summary.

Cursor: base URL `https://api.x.ai/v1`.

## Atoms to resolve

Resolve these before reading full canonical docs (catalog: [`01a_atom_conventions.md`](../01a_atom_conventions.md)):

- `current-state:portfolio` — fleet status, blockers
- `service:hauska-retrieval-api` — read-only corpus retrieval health contract

## Read first (after atoms)

1. [`76e_platform_observability_sprint.md`](../76e_platform_observability_sprint.md) — sprint scope, verified surface, hard rules
2. [`20_agent_operating_rules.md`](../20_agent_operating_rules.md) — HR-1, HR-2, HR-3, HR-8, HR-11

## Workspace ownership

- Clone: `P:\hauska-engine` (confirm actual path at start). **Note:** the primary clone was flagged dirty on `feat/neon-warmup-pilot-load` (uncommitted neon-warmup work). Refuse alien HEAD or uncommitted state; report verbatim `git status` plus `git log -3` and stop if the tree is not clean. Use a worktree if needed.
- Branch prefix: `stream-1d/` or `chore/`

## Scope

**In scope:**

- `GET /healthz` on `hauska-retrieval-api` (port 8080) returning `{status, db, corpus}` where db = substrate Neon connection liveness and corpus = atoms loaded with a non-zero count (a zero count on a service that should have the committed snapshot is an unhealthy signal).
- Emit the health result per the pinned signal-emit contract in [`76e_platform_observability_sprint.md`](../76e_platform_observability_sprint.md) §Signal emit contract (one structured Cloud Logging line, `hauska_health=true`, `check: healthz`, `service: hauska-retrieval-api`).

**Out of scope:**

- Uptime-check and alert-policy configuration in `hauska-prod-497015` (cc-agent-M owns that for both hauska services).
- The central aggregator (cc-agent-C).
- Any corpus mutation; this is a read-only health surface.

## Acceptance criteria

- `/healthz` returns the payload on the deployed revision; verified by curl in the report.
- Reports corpus atom count and db liveness; zero-corpus returns an unhealthy status.
- Output carries source, value, and timestamp (quality-gate rule).
- Tests: repo suite plus typecheck green.
- PR held for operator merge (do not merge).
- Verbatim verification artifacts (HR-8): `gcloud run revisions list`, the `/healthz` response.

## Reporting

At session break-point, write to `P:\doc_repo\_inbox\` as `2026-06-07_hauska-engine_cc-agent-E_retrieval_healthz.md`. Include atom refs touched, model used (if not default Grok), PR URL plus branch SHA, the `/healthz` response, and blockers verbatim.
