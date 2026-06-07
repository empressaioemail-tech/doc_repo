---
id: 2026-06-06_cc-agent-M_mcp_tier1_buildout
title: Dispatch — cc-agent-M Tier 1 MCP build-out (property brief + hydrology + topography + encumbrance + Cotality wraps)
date: 2026-06-06
agent: cc-agent-M
repo: hauska-mcp-server
kind: dispatch
related: [00_current_state, 01a_atom_conventions, 20_agent_operating_rules, 52_mcp_offer_and_buildout, 50_hauska_mcp_server, 29_mcp_surface_tier_model, 14_pricing_framework, _decisions/2026-06-06_v1_tier_pricing_decision_b]
---

# Tier 1 MCP build-out — cc-agent-M

You are **cc-agent-M**, the single owner of `hauska-mcp-server` for this run.

This dispatch lifts shipped cortex-api engine functionality into gated Layer 2 MCP tools. The keystone is `generate_property_brief`, which makes the Property Brief wedge agent-callable instead of extension-only. Specs are verified against the live engine surface in [`52_mcp_offer_and_buildout.md`](../52_mcp_offer_and_buildout.md) §3a; this dispatch is the implementation order.

This pairs with the cc-agent-C cortex-api dispatch ([`2026-06-06_cc-agent-C_brief_service_endpoint_exposure.md`](2026-06-06_cc-agent-C_brief_service_endpoint_exposure.md)), which exposes the service-auth path and metering hook your brief tool calls through. Coordinate on that seam; do not block your tool-definition work on it (you can build and mock-test against the contract, then wire to the real path when cc-agent-C lands).

## Model (HR-12)

Default: **Grok Build 0.1** (multi-file / agentic). Use **grok-code-fast-1** for narrow, speed-only tasks. Escalate to Claude only if Grok fails after retry; log the escalation in your session summary.

Cursor: base URL `https://api.x.ai/v1`.

## Atoms to resolve

Resolve these before reading full canonical docs (catalog: [`01a_atom_conventions.md`](../01a_atom_conventions.md)):

- `current-state:portfolio` — fleet status, blockers, the build-out lane
- `mcp-offer:52` → [`52_mcp_offer_and_buildout.md`](../52_mcp_offer_and_buildout.md) §3a — your verified tool spec table
- `decision:2026-06-06_v1_tier_pricing_decision_b` — the tier and quota numbers metering will eventually enforce

## Read first (after atoms)

1. [`00_current_state.md`](../00_current_state.md) — § MCP build-out + SDK completion only
2. [`52_mcp_offer_and_buildout.md`](../52_mcp_offer_and_buildout.md) §3a — the per-tool spec table; this is your contract
3. [`50_hauska_mcp_server.md`](../50_hauska_mcp_server.md) — current-offer reconciliation note; the existing 46-tool surface you extend
4. [`29_mcp_surface_tier_model.md`](../29_mcp_surface_tier_model.md) — product-gated tier model; Layer 2 tools sit behind a cortex product key
5. [`20_agent_operating_rules.md`](../20_agent_operating_rules.md) — HR-1, HR-2, HR-3, HR-8, HR-11

## Workspace ownership

- Clone: `P:\hauska-mcp-server`
- Branch prefix: `tier1/`
- One agent per clone per [`agent_workspace_hygiene`](../90_runbooks/agent_workspace_hygiene.md)
- Refuse alien HEAD or uncommitted state; report verbatim `git status` + `git log -3`

## Pattern to follow (verified in-repo)

Every tool follows the existing registration shape in `src/tools.ts`: `server.tool(name, description + TIER_COPY, zodSchema, handler)`. The handler calls `requireProduct(name, "cortex")` first and returns `gate.content` on a miss, reads `getCurrentTier()`, calls a `legacyClient.<method>()`, calls `logToolInvocation(...)`, and returns `envelopeContent(...)` with provenance. The cortex-api-calling tools (for example `cortex_briefing_emit` at `src/tools.ts:1262`) are your reference; the engine-calling tools use `hauskaClient`. Add new cortex-api methods to `src/legacy-client.ts` (it has `resolvePlace`, place, and workspace methods today but none of the methods below).

## Scope

### In scope

**Group A — Property Brief (keystone).**

- `generate_property_brief` — wraps cortex-api `POST /api/brokerage/v1/brief` (verified `legacy-design-tools/artifacts/api-server/src/routes/brokerageBrief.ts:323`, mounted at `/api/brokerage/v1` via `brokerageBrief.ts:903`). Add `legacyClient.generateBrief({ address, mls_id?, source?, presentationMode? })`. The endpoint produces `reasoningSummary`, `laySummary`, a cited-atom projection, `siteContext`, and a `brief-run` row. Product `cortex`, Layer 2. Return a `brief-run` atom envelope (`did:hauska:brief-run:<runId>`) with the reasoning and lay summaries and the cited atom projection; carry provenance per the existing `lSurfaceProvenance` / `codexProvenance` pattern as appropriate. The endpoint sits behind `brokerageAuth` plus a wallet paywall (402 at `brokerageBrief.ts:370`); call it on the service path cc-agent-C exposes, not the extension-public install-id path. Until that path lands, mock-test against the contract.
- `get_property_brief_run` — wraps cortex-api `GET /api/brokerage/v1/brief/{runId}` (verified `brokerageBrief.ts:687`). Product `cortex`, Layer 2. Read companion; returns the `brief-run` atom by id.

**Group B — Hydrology and topography.**

- `simulate_site_drainage` and `get_site_drainage` — wrap cortex-api `POST/GET /api/engagements/:id/site-drainage` and `GET /api/engagements/:id/site-drainage/design-storms` (verified `siteDrainage.ts`). Product `cortex`, Layer 2. Returns the `site-drainage` atom (tenant-private). These are engagement-scoped today and require an `engagement_id`; that is the v1 contract. A place-scoped or address-scoped entry point is cc-agent-C fast-follow; do not block on it. Note PR #142 (hydrology) is merged; full-fidelity drainage needs the pysheds sidecar in the Cloud Run image, and the native TS D8 fallback works without it, so the tool functions either way.
- `get_site_topography` — wraps cortex-api `POST/GET /api/engagements/:id/site-topography` (verified `siteTopography.ts`). Product `cortex`, Layer 2. Returns the `site-topography` atom. Same engagement-scoped caveat.

**Group C — Encumbrances.**

- `search_encumbrances` and `get_restrictions` — wrap the cortex-api `brokerageEncumbrances` router under `/api/brokerage/v1/workspaces` (verified `brokerageEncumbrances.ts:29` POST, `:83` GET `/encumbrances`). Product `cortex`, Layer 2. Returns `recorded-instrument`, `restriction-clause`, and `restriction-corpus` atoms (ADR-020/021). Workspace-scoped. Add the `legacyClient` methods.

**Group D — Cotality data tier (build dark).**

- `get_property_detail`, `get_replacement_cost`, `get_hazard_profile`, `get_parcel_polygon` — wrap the Cotality 8-adapter pack (dist-verified adapters: parcels, zoning, property, climate, hazards, replacementCost, mineral, utility). Product `cortex`, Layer 2. **Status: designed, inert.** Build the tool definitions and `legacyClient` methods, but they must return a clean credential-pending envelope until the CoreLogic OAuth credential clears (the blocker is `Invalid client identifier`, an operator-mechanical fix per `00_current_state.md`). Match the adapter's behavior: resolve credentials from env, return credential-pending when absent; never fake data. Do not list these tools as live in any docs-site copy until creds clear.

### Out of scope

- The site-context single tools (`get_flood_zone`, `get_parcel`, `get_elevation`, `get_site_context`, a `get_flood_risk` teaser). De-scoped: the shipped public `get_place_layers` / `get_place_dossier` already run the FEMA/USGS/EPA/Regrid adapter set at place granularity (verified `brokeragePlace.ts:105-230`). Do not build redundant Layer 2 duplicates.
- Tier 1.b engine code-intelligence tools (`get_code_definition`, `traverse_cross_references`, `get_code_amendments`, `compare_code_editions`). Those need hauska-engine retrieval-API endpoints and are a separate cc-agent-E dispatch.
- The actual per-call metering and charging. That is the SDK completion sprint ([`53_hauska_sdk_completion_sprint.md`](../53_hauska_sdk_completion_sprint.md)) item 3, which consumes your product-gated tools. Your tools ship access-gated by product key; charging activates when the SDK lands. Do not build a payment path here.

## Acceptance criteria

- All Group A, B, C tools registered, each gated `requireProduct(..., "cortex")`, each returning a provenance-carrying envelope with reasoning/citation/timestamp where the underlying response provides it (quality-gate rule).
- `legacy-client.ts` gains the new methods; each round-trips against the real cortex-api endpoint (Group A against the cc-agent-C service path once available, else mocked-fetch with the contract documented).
- Group D tools registered and returning the credential-pending envelope; verified they do not fake data and do not appear as live in docs-site copy.
- Per-tool MCP Inspector round-trip: schema validates request, response matches schema. Auth check: a non-cortex key is refused with the standard product-denied envelope; a cortex key succeeds.
- Tests: `npm test` (or the repo's configured runner) green; paste verbatim.
- `50_hauska_mcp_server.md` and `52_mcp_offer_and_buildout.md` §3a updated only if the landed surface diverges from the spec; flag any divergence to the planner before locking tool names (tool surface is contract-grade).
- PR held for operator merge (do not merge).
- Verbatim verification artifacts in report (HR-8).

## Reporting

At session break-point, write to `P:\doc_repo\_inbox\` as `2026-06-06_hauska-mcp-server_cc-agent-M_mcp_tier1_buildout.md`.

Include:
- Atom refs touched
- Model used (if not default Grok Build 0.1)
- PR URL + branch SHA
- The cc-agent-C seam status (did you wire to the real service path or mock it)
- Any tool-name or shape divergence from `52` §3a, for planner ratification
- Blockers verbatim
