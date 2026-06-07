---
id: 2026-06-07_cc-agent-M_smartcity_health_watch_and_scraper
title: Dispatch — smartcity W1.A.9 health-watch, scraper-result monitoring, thread-health cron
date: 2026-06-07
agent: cc-agent-M
repo: empressaio_tech_smartcity_os
kind: dispatch
status: ready
related: [00_current_state, 01a_atom_conventions, 20_agent_operating_rules, 76e_platform_observability_sprint, 30a_smartcity_stabilization_sprint, 31a_bastrop_maintenance_sprint, 91_postmortems/2026-05-07_replit_dev_db_wedged]
---

# SmartCity W1.A.9 health-watch, scraper-result monitoring, thread-health cron

> **Fire-ready (Wave B), two real gates.** Planning hold lifted 2026-06-07. Fire only after: (1) cc-agent-M's `hauska-mcp-server` Wave A run is complete (one clone per run, not concurrent), and (2) the M-Stabilize WS-1 2C cutover is clean (do not build on the smartcity data path mid-cutover). Channel is native Cloud Monitoring email per [`76e_platform_observability_sprint.md`](../76e_platform_observability_sprint.md) §Fire order. Emit per the pinned signal contract in 76e; the cc-agent-C hub reads it when it lands and does not block on it.

You are **cc-agent-M**, the single owner of `empressaio_tech_smartcity_os` for this run. You implement the W1.A.9 daily health-watch (designed, not built) and the scraper-result and cron monitoring.

## Model (HR-12)

Default: **Grok Build 0.1** (multi-file / agentic). Use **grok-code-fast-1** for narrow, speed-only tasks. Escalate to Claude only if Grok fails after retry; log the escalation in your session summary.

Cursor: base URL `https://api.x.ai/v1`.

## Atoms to resolve

Resolve these before reading full canonical docs (catalog: [`01a_atom_conventions.md`](../01a_atom_conventions.md)):

- `current-state:portfolio` — fleet status, blockers
- `service:smartcity-api` — city platform health contract
- `service:smartcity-scraper` — MyGov scraper job-result contract
- `jurisdiction:bastrop` — tenant_id 2, the monitored tenant

## Read first (after atoms)

1. [`76e_platform_observability_sprint.md`](../76e_platform_observability_sprint.md) — sprint scope, the scraper-result design constraint, hard rules
2. [`30a_smartcity_stabilization_sprint.md`](../30a_smartcity_stabilization_sprint.md) — W1.A.9 daily health-watch design (the seed); the findings doc lives in smartcity-os `_research/w1_a_9_health_watch_email.md`
3. [`31a_bastrop_maintenance_sprint.md`](../31a_bastrop_maintenance_sprint.md) — P1-5 thread-health Scheduler job, P1-8 wo-manager-sync failure
4. [`91_postmortems/2026-05-07_replit_dev_db_wedged.md`](../91_postmortems/2026-05-07_replit_dev_db_wedged.md) — the mygov_raw_records wedge this alerts against
5. [`20_agent_operating_rules.md`](../20_agent_operating_rules.md) — HR-1, HR-2, HR-3, HR-8, HR-11

## Workspace ownership

- Clone: `P:\empressaio_tech_smartcity_os` (confirm path; the doc-clone-path note in 30a applies)
- Branch prefix: `chore/` or `feat/`
- One agent per clone per [`agent_workspace_hygiene`](../90_runbooks/agent_workspace_hygiene.md)
- Refuse alien HEAD or uncommitted state; report verbatim `git status` plus `git log -3`

## Scope

**In scope:**

- Implement the **W1.A.9 daily health-watch** per the shipped findings/design doc: Cloud Run service status, scraper success and failure counts, Empressa Neon connection health, key metric deltas vs previous day. Delivery via the channel the operator picks in 76e (default native Cloud Monitoring email, 7 AM US Central). Emit the same signals to the cc-agent-C hub.
- **Scraper-result monitoring** across the ten Cloud Scheduler jobs in `smartcity-os-prod` (`full-scrape`, `active-wo-report-hourly`, `manager-load-past-due`, `manager-load-table-sync`, `wo-manager-sync`, `building-inspections`, `inspection-export`, `fire-inspections`, `reviews-sync`, `fee-reports`). Read **execution result** and the `sync_health` row, not `STATE: ENABLED` (the central design constraint: `wo-manager-sync` shows ENABLED yet fails on a Chromium lock per 31a P1-8). Alert on a failed or stale result.
- Create the **thread-health Cloud Scheduler job** (31a P1-5): replaces the in-process thread-health cron disabled on Cloud Run; emits `[thread-monitor]` logs in prod.
- **`mygov_raw_records` growth alert** (the wedge pattern). Surface size and growth delta as an alert and a recommendation only. Do NOT auto-TTL, archive, or delete; city operational data retention is human-gated (hard rule).
- Cloud Monitoring uptime checks for `smartcity-api` and `smartcity-scraper`.

**Out of scope:**

- DATABASE_URL migration or anything on the WS-1 cutover data path while it is active (coordinate timing; this dispatch waits behind a clean 2C).
- Any auto-remediation on MyGov data retention (alert-only, hard rule).
- The central aggregator internals (cc-agent-C); emit signals to it.
- Paid observability vendors (native Cloud Monitoring only).
- Verkada / ESRI / transparency-key binds (those are 31a Phase 2 integration restore, not monitoring).

## Acceptance criteria

- W1.A.9 health-watch delivered on schedule; a sample report pasted in the close note.
- Scraper monitoring distinguishes success from failure on real job results; the `wo-manager-sync` failure surfaces as an alert (verbatim evidence).
- thread-health Scheduler job created and emitting `[thread-monitor]` logs in prod (verbatim log line).
- `mygov_raw_records` growth alert fires on threshold with a recommendation and no data mutation.
- Uptime checks live for both smartcity services.
- All outputs carry source, value/threshold, and timestamp (quality-gate rule).
- Tests: vitest plus typecheck green.
- PR held for operator merge (do not merge).
- Verbatim verification artifacts (HR-8): `gcloud scheduler jobs list`, the failed-job result, the thread-monitor log line, the sample health-watch report.

## Reporting

At session break-point, write to `P:\doc_repo\_inbox\` as `2026-06-07_smartcity-os_cc-agent-M_health_watch_scraper.md`. Include atom refs touched, model used (if not default Grok), PR URL plus branch SHA, the sample health-watch report, and blockers verbatim.
