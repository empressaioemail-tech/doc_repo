---
id: 2026-06-06_cc-agent-C_brief_service_endpoint_exposure
title: Dispatch — cc-agent-C cortex-api service-auth + metering seam for the MCP brief tool
date: 2026-06-06
agent: cc-agent-C
repo: legacy-design-tools
kind: dispatch
related: [00_current_state, 01a_atom_conventions, 20_agent_operating_rules, 52_mcp_offer_and_buildout, 50_hauska_mcp_server, 29_mcp_surface_tier_model, 53_hauska_sdk_completion_sprint]
---

# cortex-api service seam for the MCP Tier 1 wraps — cc-agent-C

You are **cc-agent-C**, the single owner of `legacy-design-tools` (cortex-api) for this run.

The MCP Tier 1 build-out ([`2026-06-06_cc-agent-M_mcp_tier1_buildout.md`](2026-06-06_cc-agent-M_mcp_tier1_buildout.md)) wraps your shipped brief, drainage, and topography endpoints as Layer 2 MCP tools. Most of those endpoints already exist and cc-agent-M wraps them directly. This dispatch covers only the cortex-api-side work that the wraps cannot do without you: a service-to-service auth path for the wallet-paywalled brief endpoint, a metering hook the MCP gate can drive, and the place-scoped drainage/topography entry points as a fast-follow.

## Model (HR-12)

Default: **Grok Build 0.1** (multi-file / agentic). Use **grok-code-fast-1** for narrow, speed-only tasks. Escalate to Claude only if Grok fails after retry; log the escalation in your session summary.

Cursor: base URL `https://api.x.ai/v1`.

## Atoms to resolve

Resolve these before reading full canonical docs (catalog: [`01a_atom_conventions.md`](../01a_atom_conventions.md)):

- `current-state:portfolio` — fleet status, blockers, the build-out lane
- `mcp-offer:52` → [`52_mcp_offer_and_buildout.md`](../52_mcp_offer_and_buildout.md) §3a — the tool table naming the seam you build

## Read first (after atoms)

1. [`00_current_state.md`](../00_current_state.md) — § MCP build-out + SDK completion only
2. [`52_mcp_offer_and_buildout.md`](../52_mcp_offer_and_buildout.md) §3a — the two findings (site-context already exposed; brief unwrapped with a paywall seam)
3. [`29_mcp_surface_tier_model.md`](../29_mcp_surface_tier_model.md) — why the brief is Layer 2 behind a product key
4. [`20_agent_operating_rules.md`](../20_agent_operating_rules.md) — HR-1, HR-2, HR-3, HR-8, HR-11

## Workspace ownership

- Clone: `P:\legacy-design-tools`
- Branch prefix: `cortex/`
- One agent per clone per [`agent_workspace_hygiene`](../90_runbooks/agent_workspace_hygiene.md)
- Refuse alien HEAD or uncommitted state; report verbatim `git status` + `git log -3`

## Context (verified 2026-06-06)

`POST /api/brokerage/v1/brief` (`artifacts/api-server/src/routes/brokerageBrief.ts:323`) is live and produces the reasoning summary, lay summary, and cited atom projection. It sits behind `brokerageAuth` (`brokerageBrief.ts:199`) plus a wallet paywall returning 402 (`brokerageBrief.ts:370`). The extension consumer path authenticates with `X-Hauska-Install-Id` plus a baked public key. The MCP server is a different caller: it is an authenticated server, not a browser install, and it must call the brief on a service path that does not depend on an install id and that the MCP gate can meter against, rather than the endpoint's own wallet paywall double-charging or blocking.

The drainage and topography endpoints (`siteDrainage.ts`, `siteTopography.ts`) are engagement-scoped (`/api/engagements/:id/...`). An external agent calling through MCP may not have an engagement; the v1 MCP wrap accepts an `engagement_id`, but a place-scoped or address-scoped entry point widens the surface to agent callers who only have an address.

## Scope

### In scope

**1. Service-to-service auth path for the brief endpoint.** Expose a way for the MCP server to call `POST /api/brokerage/v1/brief` and `GET /api/brokerage/v1/brief/{runId}` as an authenticated service. Decide and document whether this is a dedicated service credential recognized by `brokerageAuth`, a header the MCP gate sets, or a sibling route; the constraint is that it must not require `X-Hauska-Install-Id` and must be callable from `hauska-mcp-server`'s `legacy-client.ts`. Coordinate the exact contract (headers, error shapes) with cc-agent-M; the seam is contract-grade.

**2. Metering hook the MCP gate can drive.** The MCP gate, not the endpoint's wallet paywall, is the Layer 2 metering authority for MCP callers (the gate enforces the Decision B bundles via the SDK once the SDK lands; see [`53_hauska_sdk_completion_sprint.md`](../53_hauska_sdk_completion_sprint.md) item 3). For the service path, the brief endpoint must not independently 402 on the wallet paywall when called by the metered service; instead surface the metering signal (a header or response field marking the call as billable) so the MCP gate can account it. Do not build the charging path here; that is the SDK sprint. The goal is that the service path is callable and observable, not double-gated.

**3. Place-scoped drainage and topography entry points (fast-follow).** Add an address-scoped or place-key-scoped entry point for site-drainage and site-topography so an MCP caller with only an address can get drainage and topography without first creating an engagement. Reuse the existing engagement-scoped ingest path internally. This is a fast-follow, not a blocker for cc-agent-M's engagement-scoped wraps; ship it after items 1 and 2.

### Out of scope

- The MCP tool definitions themselves (cc-agent-M owns `hauska-mcp-server`).
- The Cotality credential fix (operator-mechanical; `00_current_state.md`). The Cotality adapters are already merged and inert; nothing to build here.
- The SDK charging path and per-call billing (SDK completion sprint, the hauska-sdk owner).
- Any change that surfaces moat-bearing Layer 2 atoms (adjudication-records, per-reviewer-pattern, comparable-project-precedent) on a public path. The brief is product-gated Layer 2; keep it that way.

## Acceptance criteria

- The MCP server can call `POST /api/brokerage/v1/brief` and `GET .../brief/{runId}` on the service path without an install id; the contract (headers, auth, error shapes) is documented and shared with cc-agent-M.
- The service path does not double-charge or hard-402 the metered MCP caller on the wallet paywall; the billable signal is surfaced for the MCP gate to account.
- Place-scoped (or address-scoped) drainage and topography entry points exist and return the `site-drainage` and `site-topography` atoms for an address without a pre-existing engagement.
- Tests: the repo's configured runner green for the touched routes; paste verbatim. Reasoning, citation, and timestamp remain on the brief response (quality-gate rule).
- PR held for operator merge (do not merge).
- Verbatim verification artifacts in report (HR-8).

## Reporting

At session break-point, write to `P:\doc_repo\_inbox\` as `2026-06-06_legacy-design-tools_cc-agent-C_brief_service_endpoint_exposure.md`.

Include:
- Atom refs touched
- Model used (if not default Grok Build 0.1)
- PR URL + branch SHA
- The service-path contract (headers, auth, error shapes) for cc-agent-M to wire against
- Blockers verbatim
