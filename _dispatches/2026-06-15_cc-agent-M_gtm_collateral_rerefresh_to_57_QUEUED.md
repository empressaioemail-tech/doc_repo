---
id: 2026-06-15_cc-agent-M_gtm_collateral_rerefresh_to_57_QUEUED
title: Dispatch (QUEUED-on-deploy) — GTM collateral re-refresh to the 57-tool live surface + current spine state
date: 2026-06-15
agent: cc-agent-M
repo: hauska-mcp-server
kind: dispatch
status: QUEUED
related: [00_current_state, 01a_atom_conventions, 20_agent_operating_rules, 76d_gtm_data_package_go_to_market, 58_gtm_readiness_sprint, 61_property_intelligence_master_plan, _catalog/ops/gtm_public_capability_matrix_v1.yaml]
---

# GTM collateral re-refresh to the 57-tool live surface

You are **cc-agent-M**, the single owner of `hauska-mcp-server` for this run.

> **QUEUED-on-deploy. Do not start until the operator fires this, and not before the convergent cortex-api deploy lands** (#178 bake / #179 thin BFF / #180 auth-leak fix / #181 + #182 Cotality), so the copy describes live prod, not merged-not-deployed code. This supersedes the residue left by PR #26 (which shipped a stale "46-tool surface" line per [`00_current_state.md`](../00_current_state.md)). You produce drafts only; the operator publishes (76b N-track).

## Model (HR-12)

Default: **Grok Build 0.1** (multi-file / agentic). Use **grok-code-fast-1** for narrow, speed-only tasks. Escalate to Claude only if Grok fails after retry; log the escalation in your session summary.

Cursor: base URL `https://api.x.ai/v1`.

## Atoms to resolve

Resolve these before reading full canonical docs (catalog: [`01a_atom_conventions.md`](../01a_atom_conventions.md)):

- `current-state:portfolio` — deploy state, which of #178-#182 are live, tool count on the live gate
- `strategy-module:gtm-data-package-go-to-market` — the current per-package messaging (76d §2)
- `capability-matrix:gtm-public-v1` — the v1.2 honesty matrix the copy must not exceed

## Read first (after atoms)

1. [`76d_gtm_data_package_go_to_market.md`](../76d_gtm_data_package_go_to_market.md) — §2 per-package messaging (current spine state), §3 matrix v1.2, §4 launch gate (defers to 58)
2. [`_catalog/ops/gtm_public_capability_matrix_v1.yaml`](../_catalog/ops/gtm_public_capability_matrix_v1.yaml) — v1.2, the source of truth for claims
3. [`58_gtm_readiness_sprint.md`](../58_gtm_readiness_sprint.md) — the governing launch sprint + honesty scope on precedence
4. [`20_agent_operating_rules.md`](../20_agent_operating_rules.md) — HR-1, HR-2, HR-3, HR-8, HR-11, HR-13

## Workspace ownership

- Clone: `P:\hauska-mcp-server`
- Branch prefix: `gtm/`
- One agent per clone per [`agent_workspace_hygiene`](../90_runbooks/agent_workspace_hygiene.md)
- Refuse alien HEAD or uncommitted state; report verbatim `git status` + `git log -3`

## Scope

**In scope (drafts only):**

- Correct the tool count everywhere in `docs/gtm/` and `docs/content/`: **46 -> 57** (live gate), removing the stale-46 residue from the PR #26 pass. Verify against the live `tools/list` once `mcp.hauska.dev` resolves.
- Re-sync the data-package sections to current spine state per 76d §2: Cotality SOLVED (Regrid DROPPED, Cotality sole parcel spine), precedence WIRED into the production finding path (honesty scope: same-dimension federal accessibility + adopted model code + local amendments only; zoning/CC&R cross-layer is UNBUILT, do not market), hydrology live on real pysheds, Austin 2024 as the launch hero metro with web-first grounding.
- Re-run the honesty enforcement: every corpus number carries the public-vs-internal split (~478 public-free / 2 jurisdictions + the federal-accessibility-standards tenant; 32 platform-internal never public; the Austin-2024 web-warmed deepening flagged as needing public-vs-internal re-verification before it is marketed public-free). `grep "calibrated"` must return nothing; confidence is a cited score, calibration in progress (asserted-not-earned per the 06-11 audit).
- Refresh `llms.txt` + `.well-known/agents.txt` to 57 + the current package framing.
- Flag any remaining matrix-vs-live-gate disagreement (pause-publish trigger).

**Out of scope:**

- Publishing anything (operator-gated, N-track).
- New tool definitions or engine work.
- The Layer-3 government / Vertosoft collateral (separate track, 07a).
- Marketing any unbuilt capability (zoning/CC&R precedence, calibration).

## Acceptance criteria

- No "46" tool-count claim remains in `docs/gtm/` or `docs/content/`; the live count (57) is used and spot-checked against the live gate.
- Data-package sections match 76d §2 current state (Cotality solved, Regrid dropped, precedence wired with honesty scope, Austin 2024).
- `grep -ri "calibrated"` over the collateral returns nothing; every corpus number carries the public-vs-internal split (grep for a bare headline count returns nothing).
- `llms.txt` + `.well-known/agents.txt` refreshed and fetchable in staging.
- Drafts only; nothing published.
- PR held for operator merge (do not merge)
- Verbatim verification artifacts in report (HR-8)

## Reporting

At session break-point, write to `P:\doc_repo\_inbox\` as `2026-MM-DD_hauska-mcp-server_cc-agent-M_gtm_collateral_rerefresh.md`.

Include:
- Atom refs touched
- Model used (if not default Grok Build 0.1)
- PR URL + branch SHA
- Live `tools/list` count verified (verbatim) once the gate resolves
- Any matrix-vs-live-gate disagreements found (verbatim)
- Blockers verbatim
