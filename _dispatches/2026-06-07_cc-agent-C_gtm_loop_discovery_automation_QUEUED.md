---
id: 2026-06-07_cc-agent-C_gtm_loop_discovery_automation_QUEUED
title: Dispatch (QUEUED-on-deploy) — GTM-loop discovery + observation + steward digest
date: 2026-06-07
agent: cc-agent-C
repo: legacy-design-tools
kind: dispatch
status: QUEUED
related: [00_current_state, 01a_atom_conventions, 20_agent_operating_rules, 76d_gtm_data_package_go_to_market, 76b_gtm_engine_polish_sprint, 79a_weekly_moat_scoreboard, 90_runbooks/diagrams/gtm_loop.mermaid]
---

# GTM-loop discovery + observation + steward digest

You are **cc-agent-C**, the single owner of `legacy-design-tools` for this run.

> **QUEUED-on-deploy. Do not start until the operator fires this.** This loop observes a live MCP surface; it cannot meaningfully run before the build-out wave is deployed to prod and Decision C is unpinned. Gate list in [`76d_gtm_data_package_go_to_market.md`](../76d_gtm_data_package_go_to_market.md) §4. When fired, first verify against live source what already exists (the 76b observation schema may have partly landed); do not re-build what is already there.

## Model (HR-12)

Default: **Grok Build 0.1** (multi-file / agentic). Use **grok-code-fast-1** for narrow, speed-only tasks. Escalate to Claude only if Grok fails after retry; log the escalation in your session summary.

Cursor: base URL `https://api.x.ai/v1`.

## Atoms to resolve

Resolve these before reading full canonical docs (catalog: [`01a_atom_conventions.md`](../01a_atom_conventions.md)):

- `current-state:portfolio` — fleet status, blockers, deploy state
- `strategy-module:gtm-data-package-go-to-market` — the GTM frame this loop serves (76d)
- `ops-scoreboard:weekly` — the 3 MCP metrics this loop feeds (79a)

Optional additive ops atoms (R and D process only):

- `strategy-module:competitive-execution-system`

## Read first (after atoms)

1. [`76d_gtm_data_package_go_to_market.md`](../76d_gtm_data_package_go_to_market.md) — §5 GTM-loop buildable spec (the authority for this dispatch)
2. [`76b_gtm_engine_polish_sprint.md`](../76b_gtm_engine_polish_sprint.md) — Track C observation deliverables (migration 0029 gtm_events extension, error taxonomy, digest)
3. [`90_runbooks/diagrams/gtm_loop.mermaid`](../90_runbooks/diagrams/gtm_loop.mermaid) — the full loop; build only the v1 Tier-0 subset
4. [`20_agent_operating_rules.md`](../20_agent_operating_rules.md) — HR-1, HR-2, HR-3, HR-8, HR-11

## Workspace ownership

- Clone: `P:\legacy-design-tools` (main clone)
- Branch prefix: `gtm/`
- One agent per clone per [`agent_workspace_hygiene`](../90_runbooks/agent_workspace_hygiene.md)
- Refuse alien HEAD or uncommitted state; report verbatim `git status` + `git log -3`

## Scope

**In scope (v1 Tier-0 only):**

- Telemetry plane: extend `gtm_events` (or the dedicated `mcp_usage` table) per 76b Track C migration — `source_surface` in {extension, api, mcp, docs, share_page}; event types `mcp_tool_call`, `mcp_connect`, `mcp_error`, `mcp_docs_clicked`; fields `tool_name`, `error_class`, `jurisdiction_key`, `api_key_hash` (no raw key). Consent flags first-class. VERIFY the migration is not already landed before writing it.
- Unified error taxonomy shared by brief + MCP: `no_coverage`, `empty_corpus`, `auth_reject`, `upstream_timeout`, `geocode_miss`.
- Triage classification (read-only): intent/lead-score, persona/package signal (which data package the caller's tools imply), conversion opportunity, friction. Writes only to the observation log.
- Steward daily digest section + the 3 MCP metrics surfaced for the weekly scoreboard (`external_callers`, `mcp_tool_calls`, `mcp_error_rate`).
- Policy-tier gate enforced in code: Tier 0 actions auto; Tier 1 outbound paths present but HARD-DISABLED behind an `OUTBOUND_ENABLED=false` flag + a consent check + an E&O-bound check. They must not send in v1.

**Out of scope:**

- Any Tier 1+ outbound send, content publish, or paid-signup automation (E&O-gated; not this dispatch).
- New MCP tool definitions (that is cc-agent-M).
- The Layer-3 government / SmartCity / Vertosoft motion.

## Acceptance criteria

- `gtm_events` (or `mcp_usage`) carries MCP events with the fields above; an external MCP caller (non-internal `key_hash`) appears in the observation log.
- Steward digest renders the MCP section; 3 MCP metrics available to the weekly scoreboard.
- Triage classifies a sample of real events into intent/persona/conversion/friction.
- Outbound paths exist but are provably disabled (test asserts no send with the flag off).
- Tests: `npm test` (name the suite in the report)
- PR held for operator merge (do not merge)
- Verbatim verification artifacts in report (HR-8)

## Reporting

At session break-point, write to `P:\doc_repo\_inbox\` as `2026-MM-DD_legacy-design-tools_cc-agent-C_gtm_loop_discovery.md`.

Include:
- Atom refs touched
- Model used (if not default Grok Build 0.1)
- PR URL + branch SHA
- Whether the 76b observation migration was already present (verbatim check)
- Blockers verbatim
