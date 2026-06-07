---
id: 2026-06-07_cc-agent-M_mcp_gate_probe_and_hauska_uptime
title: Dispatch — MCP-gate availability probe, hauska-prod health and uptime
date: 2026-06-07
agent: cc-agent-M
repo: hauska-mcp-server
kind: dispatch
status: queued
related: [00_current_state, 01a_atom_conventions, 20_agent_operating_rules, 76e_platform_observability_sprint, 50_hauska_mcp_server, 90_runbooks/steward_daily_digest]
---

# MCP-gate availability probe, hauska-prod health and uptime

> **QUEUED — do not fire.** Held pending operator sequencing and the gates in [`76e_platform_observability_sprint.md`](../76e_platform_observability_sprint.md) (Scheduler API enable on `hauska-prod-497015`, notification channel).

You are **cc-agent-M**, the single owner of `hauska-mcp-server` for this run. You build the gate-availability probe and the uptime/alert layer for `hauska-prod-497015` (both hauska services). This is a different clone and run from the smartcity-os monitoring dispatch; do not run them concurrently.

## Model (HR-12)

Default: **Grok Build 0.1** (multi-file / agentic). Use **grok-code-fast-1** for narrow, speed-only tasks. Escalate to Claude only if Grok fails after retry; log the escalation in your session summary.

Cursor: base URL `https://api.x.ai/v1`.

## Atoms to resolve

Resolve these before reading full canonical docs (catalog: [`01a_atom_conventions.md`](../01a_atom_conventions.md)):

- `current-state:portfolio` — fleet status, blockers
- `service:hauska-mcp-server` — gate boundary health contract
- `service:hauska-retrieval-api` — retrieval API liveness (coordinate `/healthz` with cc-agent-E)

## Read first (after atoms)

1. [`76e_platform_observability_sprint.md`](../76e_platform_observability_sprint.md) — full sprint scope, verified surface, hard rules
2. [`50_hauska_mcp_server.md`](../50_hauska_mcp_server.md) — gate semantics, `X-Hauska-Key`, product resolution
3. [`20_agent_operating_rules.md`](../20_agent_operating_rules.md) — HR-1, HR-2, HR-3, HR-8, HR-11

## Workspace ownership

- Clone: `P:\hauska-mcp-server` (confirm actual path at start)
- Branch prefix: `mcp/`
- One agent per clone per [`agent_workspace_hygiene`](../90_runbooks/agent_workspace_hygiene.md)
- Refuse alien HEAD or uncommitted state; report verbatim `git status` plus `git log -3`

## Scope

**In scope:**

- `GET /healthz` on `hauska-mcp-server` returning `{status, deps, revision}` (deps = retrieval-api reachable, legacy backend reachable).
- **Gate-availability synthetic probe.** Asserts the three documented gate behaviors: the no-header anonymous path resolves to public; a valid product key resolves to its product; a malformed or unknown key returns 401. The probe uses the `X-Hauska-Key` header (not `Authorization: Bearer`; the wrong header silently falls through to product public, which would mask a gate failure). It emits a structured result for the cc-agent-C hub. Treat a 401 anomaly or an availability drop as alert-only (possible auth incident), never auto-fixed.
- Cloud Monitoring uptime checks for both `hauska-mcp-server` and `hauska-retrieval-api`; metric alert policies for 5xx rate, p95 latency, stale-revision traffic drift.
- Enable the Cloud Scheduler API on `hauska-prod-497015` (or hand the enable to the operator if IAM blocks; report verbatim).
- Emit health and gate-probe signals to the cc-agent-C aggregator hub (agree the emit shape with that dispatch; structured log fields are acceptable).

**Out of scope:**

- retrieval-api `/healthz` internals (cc-agent-E owns; this dispatch only checks reachability as a dep).
- The central aggregator and daily report (cc-agent-C).
- Any gate auto-remediation; gate anomalies are alert-only.
- Paid observability vendors (native Cloud Monitoring only).

## Acceptance criteria

- `/healthz` returns the normalized payload on the deployed revision; verified by curl in the report.
- Gate probe correctly distinguishes anonymous-public, valid-key-product, and malformed-key-401; all three cases pasted verbatim (header used shown explicitly).
- Uptime checks plus alert policies live in `hauska-prod-497015`; one test alert fired to the chosen channel and pasted.
- Probe output carries source, value, and timestamp (quality-gate rule).
- Tests: repo suite plus typecheck green.
- PR held for operator merge (do not merge).
- Verbatim verification artifacts (HR-8): `gcloud run revisions list`, uptime-check list, the three gate-probe responses, the test alert.

## Reporting

At session break-point, write to `P:\doc_repo\_inbox\` as `2026-06-07_hauska-mcp-server_cc-agent-M_gate_probe_uptime.md`. Include atom refs touched, model used (if not default Grok), PR URL plus branch SHA, the three gate-probe responses, and blockers verbatim.
