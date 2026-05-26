---
date: 2026-05-26
repo: doc_repo
agent: claude_code
topic: brokerage_extension_api_dispatch
---

# Session — Brokerage extension doc + API dispatch

## What we did

1. **Chrome extension pilot** (`P:\hauska-brief-extension` v0.4.1): Shadow DOM panel, property-intel tab, deep research page, MCP brief path, deep-research button fix (background `OPEN_DEEP_RESEARCH`).
2. **Backend dispatch filed** for cc-agent-C: [`_dispatches/2026-05-26_cc-agent-C_brokerage_brief_api.md`](../_dispatches/2026-05-26_cc-agent-C_brokerage_brief_api.md) — three routes on `cortex-api` with Grok via existing `briefingLlmClient`.
3. **Canonical docs added/updated:**
   - New [`75a_hauska_brief_extension.md`](../75a_hauska_brief_extension.md) — extension architecture + API contracts
   - Updated [`75_hauska_brokerage_workflow_plan.md`](../75_hauska_brokerage_workflow_plan.md) — Phase 0/1 status vs extension
   - Updated [`_hauska_brief_extension/README.md`](../_hauska_brief_extension/README.md)
   - Regenerated [`00_current_state.md`](../00_current_state.md) brokerage track

## Decisions

- **Thin client / thick server:** Extension stays MCP-capable for dev; production intelligence moves to `/api/brokerage/v1/*` on `cortex-api` with `BRIEFING_LLM_MODE=grok`.
- **Research chat** is Phase 0 backend slice (not deferred to Phase 4.4 only); UI already shipped.

## Operator next

1. Fire cc-agent-C with dispatch prompt (or confirm already running).
2. After API lands: set extension `briefApiUrl` + `summarizeApiUrl` to prod cortex-api; add `researchApiUrl` in small extension follow-up.
3. Pilot on Bastrop / Cedar Hill listings with `defaultJurisdiction` set.

## Atoms

- `atom:portfolio:brokerage-property-brief` (product)
- `atom:repo:hauska-brief-extension` (code, out of tree)
- `atom:dispatch:2026-05-26_cc-agent-C_brokerage_brief_api`
