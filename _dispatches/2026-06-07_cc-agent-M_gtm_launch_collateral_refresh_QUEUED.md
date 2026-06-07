---
id: 2026-06-07_cc-agent-M_gtm_launch_collateral_refresh_QUEUED
title: Dispatch (QUEUED-on-deploy) — GTM launch collateral refresh to the deployed 46-tool surface + data-package messaging
date: 2026-06-07
agent: cc-agent-M
repo: hauska-mcp-server
kind: dispatch
status: QUEUED
related: [00_current_state, 01a_atom_conventions, 20_agent_operating_rules, 76f_gtm_data_package_go_to_market, 76b_gtm_engine_polish_sprint, 52_mcp_offer_and_buildout, _catalog/ops/gtm_public_capability_matrix_v1.yaml, _catalog/ops/gtm_launch_channel_plan_v1.yaml]
---

# GTM launch collateral refresh to the deployed surface

You are **cc-agent-M**, the single owner of `hauska-mcp-server` for this run.

> **QUEUED-on-deploy. Do not start until the operator fires this.** The collateral must match the deployed surface, so it is authored against prod reality, not merged-but-undeployed code. Gate list in [`76f_gtm_data_package_go_to_market.md`](../76f_gtm_data_package_go_to_market.md) §4. You produce drafts only; the operator publishes every registry and community post (76b N-track).

## Model (HR-12)

Default: **Grok Build 0.1** (multi-file / agentic). Use **grok-code-fast-1** for narrow, speed-only tasks. Escalate to Claude only if Grok fails after retry; log the escalation in your session summary.

Cursor: base URL `https://api.x.ai/v1`.

## Atoms to resolve

Resolve these before reading full canonical docs (catalog: [`01a_atom_conventions.md`](../01a_atom_conventions.md)):

- `current-state:portfolio` — fleet status, deploy state, which creds cleared
- `strategy-module:gtm-data-package-go-to-market` — the per-package messaging (76d §2)
- `capability-matrix:gtm-public-v1` — the honesty matrix the collateral must not exceed

## Read first (after atoms)

1. [`76f_gtm_data_package_go_to_market.md`](../76f_gtm_data_package_go_to_market.md) — §2 per-package messaging, §3 matrix refresh, §4 gate
2. [`_catalog/ops/gtm_public_capability_matrix_v1.yaml`](../_catalog/ops/gtm_public_capability_matrix_v1.yaml) — the source of truth for claims (v1.1)
3. [`_catalog/ops/gtm_launch_channel_plan_v1.yaml`](../_catalog/ops/gtm_launch_channel_plan_v1.yaml) — Decision C channels (drafts live in `hauska-mcp-server/docs/gtm/`)
4. [`52_mcp_offer_and_buildout.md`](../52_mcp_offer_and_buildout.md) — the verified 46-tool surface
5. [`20_agent_operating_rules.md`](../20_agent_operating_rules.md) — HR-1, HR-2, HR-3, HR-8, HR-11

## Workspace ownership

- Clone: `P:\hauska-mcp-server`
- Branch prefix: `gtm/`
- One agent per clone per [`agent_workspace_hygiene`](../90_runbooks/agent_workspace_hygiene.md)
- Refuse alien HEAD or uncommitted state; report verbatim `git status` + `git log -3`

## Scope

**In scope (drafts only):**

- Refresh `docs/gtm/` and the `hauska.dev/mcp` docs copy to the deployed 46-tool reality (11 public + 4 Codex + 31 Cortex), correcting the stale 40-tool figure.
- Add the data-package framing from 76d §2: organize the public/sellable surface by package (Subsurface, Hydrology/flood, Parcel/property, Code/plan-review, Environmental), each with the reasoning-first message and the "what stays free" line.
- Honesty enforcement in copy: every corpus number carries the public-vs-internal split (~478 public-free atoms / 2 jurisdictions + the `federal-accessibility-standards` tenant; 32 platform-internal never marketed public). No calibration claim anywhere; confidence is described as a cited score, calibration in progress.
- Refresh `llms.txt` + `.well-known/agents.txt` to the package framing and the live coverage link.
- Update the Anthropic MCP directory + awesome-mcp-servers draft packages to match the matrix.
- Flag any place where deployed gates disagree with the matrix (pause-publish trigger per 76b kill criteria).

**Out of scope:**

- Publishing anything (operator-gated, N-track).
- New tool definitions or engine work.
- ProductHunt (Wave 2 per the channel plan).
- Government / Vertosoft collateral (separate Layer-3 track, 07a).

## Acceptance criteria

- `docs/gtm/` copy matches the deployed 46-tool surface and the v1.1 matrix; spot-check 5 tools against live gates.
- Data-package sections present, each with reasoning verb + what-stays-free line.
- Every corpus number in the copy carries the public-vs-internal split; grep finds no bare headline atom count and no "calibrated" claim.
- `llms.txt` + `.well-known/agents.txt` refreshed and fetchable in staging.
- Drafts only; nothing published.
- PR held for operator merge (do not merge)
- Verbatim verification artifacts in report (HR-8)

## Reporting

At session break-point, write to `P:\doc_repo\_inbox\` as `2026-MM-DD_hauska-mcp-server_cc-agent-M_gtm_launch_collateral_refresh.md`.

Include:
- Atom refs touched
- Model used (if not default Grok Build 0.1)
- PR URL + branch SHA
- Any matrix-vs-deployed-gate disagreements found (verbatim)
- Blockers verbatim
