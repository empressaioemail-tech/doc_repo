---
id: 2026-06-07_cc-agent-C_observability_hub_and_health_watch
title: Dispatch — observability hub, health-watch aggregator, cortex/api-server health
date: 2026-06-07
agent: cc-agent-C
repo: legacy-design-tools
kind: dispatch
status: queued
related: [00_current_state, 01a_atom_conventions, 20_agent_operating_rules, 76e_platform_observability_sprint, 76a_operator_autonomous_loops, 90_runbooks/steward_daily_digest, 90_runbooks/cloud_run_canary_deploy]
---

# Observability hub, health-watch aggregator, cortex/api-server health

> **QUEUED — do not fire.** Held pending operator sequencing against the deferred build-out deploy and the active M-Stabilize WS-1 cutover, and the operator gates in [`76e_platform_observability_sprint.md`](../76e_platform_observability_sprint.md) (Scheduler API enable, notification channel, Neon token).

You are **cc-agent-C**, the single owner of `legacy-design-tools` for this run. You build the central monitoring hub: the daily health-watch aggregator plus the uptime/alert layer for `legacy-design-tools-prod`.

## Model (HR-12)

Default: **Grok Build 0.1** (multi-file / agentic). Use **grok-code-fast-1** for narrow, speed-only tasks. Escalate to Claude only if Grok fails after retry; log the escalation in your session summary.

Cursor: base URL `https://api.x.ai/v1`.

## Atoms to resolve

Resolve these before reading full canonical docs (catalog: [`01a_atom_conventions.md`](../01a_atom_conventions.md)):

- `current-state:portfolio` — fleet status, blockers
- `service:cortex-api` — product reasoning surface health contract
- `service:api-server` — brokerage / extension API surface health contract

Optional additive ops atoms:

- `strategy-module:competitive-execution-system`
- `ops-scoreboard:weekly`

## Read first (after atoms)

1. [`76e_platform_observability_sprint.md`](../76e_platform_observability_sprint.md) — full sprint scope, verified surface, the Tier-0 vs alert-only boundary, hard rules
2. [`90_runbooks/steward_daily_digest.md`](../90_runbooks/steward_daily_digest.md) — the manual maintenance checklist this aggregator automates
3. [`76a_operator_autonomous_loops.md`](../76a_operator_autonomous_loops.md) — Diagram 1 policy tiers
4. [`20_agent_operating_rules.md`](../20_agent_operating_rules.md) — HR-1, HR-2, HR-3, HR-8, HR-11

## Workspace ownership

- Clone: `P:\legacy-design-tools` (confirm actual path at start)
- Branch prefix: `cortex/`
- One agent per clone per [`agent_workspace_hygiene`](../90_runbooks/agent_workspace_hygiene.md)
- Refuse alien HEAD or uncommitted state; report verbatim `git status` plus `git log -3`

## Scope

**In scope:**

- Normalize `GET /healthz` on `cortex-api` and `api-server` to return `{status, db, deps, revision}` (db = cortex-prod Neon connection plus `api_keys` readable; revision = serving Cloud Run revision).
- Central health-watch aggregator: a scheduled job (Cloud Scheduler in `legacy-design-tools-prod` to a small endpoint or Cloud Function) that polls all six services' `/healthz`, reads Cloud Run revision-and-traffic state, ingests the scraper-result and smartcity signals emitted by the smartcity dispatch, queries Neon size (cortex-prod plus, via the smartcity emit, `mygov_raw_records`), and runs the MCP-gate probe result from the cc-agent-M dispatch. It writes a daily health-watch report and fans alerts to the one notification channel on threshold breach. This is the maintenance observation log peer to `gtm_events`; do not fork the GTM analytics plane, sit beside it.
- Cloud Monitoring uptime checks for `cortex-api` and `api-server`; metric alert policies for 5xx rate, p95 latency, and stale-revision traffic drift (latest ready revision not serving 100 percent).
- Enable the Cloud Scheduler API on `legacy-design-tools-prod` (or hand the one-line enable to the operator if IAM blocks it; report verbatim).
- Wire the daily report into the maintenance section of [`90_runbooks/steward_daily_digest.md`](../90_runbooks/steward_daily_digest.md) (replace the manual maintenance steps with the automated query, keep the GTM section as is).

**Out of scope:**

- Any auto-remediation that acts on city operational data retention or deletion (hard rule; alert-only).
- Paid observability vendors (native Cloud Monitoring only; hard rule).
- The mcp-gate probe internals (cc-agent-M owns; consume its emitted result).
- smartcity-os health endpoints and scraper monitoring (cc-agent-M smartcity dispatch).
- Tier 1 through 3 actions; this dispatch is Tier-0 surface plus alerting only.

## Acceptance criteria

- `cortex-api` and `api-server` `/healthz` return the normalized payload; verified by deployed-revision curl in the report.
- Daily health-watch report generated on schedule, covering all six services, revision/traffic drift, scraper result, Neon size, and gate-probe result; sample report pasted in the close note.
- Uptime checks plus alert policies live in `legacy-design-tools-prod`; one alert fired to the chosen channel in a test (synthetic failure) and pasted verbatim.
- Report and alert outputs carry source (probe or query), value/threshold, and timestamp (quality-gate rule).
- Tests: repo unit/integration suite plus typecheck green.
- PR held for operator merge (do not merge).
- Verbatim verification artifacts in report (HR-8): `gcloud run revisions list`, uptime-check list, the test alert.

## Reporting

At session break-point, write to `P:\doc_repo\_inbox\` as `2026-06-07_legacy-design-tools_cc-agent-C_observability_hub.md`. Include atom refs touched, model used (if not default Grok), PR URL plus branch SHA, the sample health-watch report, and blockers verbatim.
