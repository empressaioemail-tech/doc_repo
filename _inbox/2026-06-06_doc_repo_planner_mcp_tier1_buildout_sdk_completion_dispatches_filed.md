---
id: 2026-06-06_doc_repo_planner_mcp_tier1_buildout_sdk_completion_dispatches_filed
title: Inbox — MCP Tier 1 build-out specs + SDK completion plan + 3 dispatches filed (for main planner)
date: 2026-06-06
from: doc_repo planner (MCP build-out + SDK handoff session)
to: main doc_repo planning agent
kind: planner-handoff
related: [00_current_state, 52_mcp_offer_and_buildout, 53_hauska_sdk_completion_sprint, 50_hauska_mcp_server, 16_commercialization_roadmap, _research/2026-06-06_cross_repo_recon]
---

# MCP Tier 1 build-out + SDK completion — filed and committed

Handoff note for the main planning agent. I took the build-before-launch handoff off the back of `52_mcp_offer_and_buildout.md`, verified the engine surfaces against the live repos, fleshed the Tier 1 tool specs, wrote the SDK completion sprint, cross-linked the canonical set, and filed three dispatches. Committed and pushed to `origin/main`. This note is the digest so you do not have to re-derive it.

## What changed in the doc set

- `52_mcp_offer_and_buildout.md` — new §3a (verified Tier 1 tool spec table), §6 open questions resolved, §7 premortem record.
- `53_hauska_sdk_completion_sprint.md` — NEW (slot 53). Five-item SDK punch list sequenced with acceptance criteria; first-paid-revenue dependency chain stated.
- `50_hauska_mcp_server.md` — current-offer reconciliation note (links 52/53); the "Layer 1 only" business-model line marked superseded.
- `16_commercialization_roadmap.md` — build-out lane added ahead of the launch steps; step 3 rescoped to point at 53; Decision C confirmed pinned.
- `00_current_state.md` — one-line pointer under Commercialization.
- `_dispatches/` — three dispatches (see below).

## Two verification findings that reshaped the build-out (the doc set lagged the code)

1. **Site-context is already exposed at Layer 1.** The shipped public `get_place_layers` / `get_place_dossier` already run the FEMA/USGS/EPA/Regrid adapter set at place granularity (`brokeragePlace.ts:105-230`). The `52` §2 gap row proposing net-new `get_flood_zone` / `get_parcel` / `get_elevation` / `get_site_context` / a `get_flood_risk` teaser is therefore redundant. I de-scoped those. This also keeps the sell-reasoning commitment clean: no bare-data Layer 2 SKU.

2. **The brief endpoint exists but is unwrapped and paywalled.** `POST /api/brokerage/v1/brief` is live and already produces reasoning + lay summaries + cited atoms (`brokerageBrief.ts:323`), but `hauska-mcp-server/src/legacy-client.ts` has no brief method, and the endpoint sits behind `brokerageAuth` plus a wallet paywall (402 at `brokerageBrief.ts:370`). So the brief wrap is a real Tier 1 item and it carries a cross-repo seam (cc-agent-C must expose a service path the MCP gate can call and meter without the extension install-id).

Also confirmed: drainage/topography endpoints are engagement-scoped (need a place-scoped fast-follow for agent callers); encumbrances router live; Cotality 8-adapter pack present but inert pending the CoreLogic credential; SDK fiat rail still a stub at `payment-request.ts:253` with zero revenue-routing code and "CNS Protocol" branding.

## Premortem

Ran `premortem-check` formally (tool tier placement + metering touch the sell-reasoning tier model, load-bearing). Green across all four commitments and three rules. Two items handled in the deliverable rather than slid: redundant bare-data tools de-scoped; the stale "Layer 1 only" line in `50` reconciled to the product-gated tier model (`29`). The moat-bearing Layer 2 atoms (adjudication-records, per-reviewer-pattern, comparable-project-precedent) stay unexposed.

## Dispatches filed (operator hands out; PR-held)

- `_dispatches/2026-06-06_cc-agent-M_mcp_tier1_buildout.md` — the Tier 1 tool wraps in `hauska-mcp-server` (brief keystone, drainage, topography, encumbrances; Cotality built dark).
- `_dispatches/2026-06-06_cc-agent-C_brief_service_endpoint_exposure.md` — the cortex-api service-auth + metering seam the brief tool calls, plus place-scoped drainage/topography fast-follow.
- `_dispatches/2026-06-06_cc-agent-S_hauska_sdk_completion.md` — the SDK build (Circle rail, revenue routing, MCP metering, tests, polish).

## Open items needing operator or planner attention

1. **SDK seat is unassigned.** `hauska-sdk` has no standing fleet owner (seats are C/C2/E/R/M/AC). I marked the SDK dispatch `cc-agent-S (PROPOSED — operator-assigned)` rather than invent an owner. Operator confirms or reassigns the seat before dispatching.
2. **Cotality stays dark until the CoreLogic OAuth credential clears** (`Invalid client identifier`, operator-mechanical fix per `00_current_state.md`). The Cotality tool definitions get built but return credential-pending.
3. **Decision C stays pinned** in `_catalog/ops/gtm_launch_channel_plan_v1.yaml` until the build-out lane lands. Nothing in this work unpins it; sequence is capture → Tier 1 → SDK → unpin C.
4. **Tier 1.b engine code-intelligence tools** (`get_code_definition`, `traverse_cross_references`, `get_code_amendments`, `compare_code_editions`) are a deferred separate cc-agent-E engine dispatch, not in this wave. Flagged in `52` §3a; not yet written as a dispatch.

## Sequencing note

Tier 1 tools ship access-gated by product key immediately; per-call metering and charging activate only when the SDK lands (sprint 53 item 3). First paid Layer 2 revenue needs SDK items 1, 2, 3 live and item 4 green. No public launch until both the Tier 1 lane and the SDK lane land.
