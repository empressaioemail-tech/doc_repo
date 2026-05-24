---
id: 40f_cortex_grok_runtime_migration_sprint
title: Cortex in-app AI Grok runtime migration — planning sprint
status: queued
last_updated: 2026-05-24
applies_to: design-accelerator
related: [40_design_accelerator, 44_mcp_cortex_architecture_map, _research/2026-05-23_cortex_ai_model_inventory, 21d_grok_atom_migration_complete, 01a_atom_conventions, _decisions/2026-05-23_grok_atom_fleet_migration]
owner: cc-agent-R
---

# Cortex in-app AI Grok runtime migration — planning sprint

> **What this is.** Product runtime LLM migration planning for Cortex (api-server call sites), separate from the agent-fleet Grok + atom-first migration (HR-12, Phases 1–3 complete per [`21d_grok_atom_migration_complete.md`](21d_grok_atom_migration_complete.md)). Agent fleet uses Grok in Cursor; Cortex production today uses Anthropic Sonnet 4.5/4.6 in finding, briefing, and chat engines.

> **Status:** QUEUED — not active. Filed 2026-05-24 as the next cc-agent-R task after 40e PR #110 merge.

## Scope boundary

| Layer | Current | This sprint |
|---|---|---|
| Agent fleet (cc-agents) | Grok Build 0.1 per HR-12 | Out of scope — done |
| Cortex product runtime (api-server) | Anthropic Sonnet | **In scope — planning only** |

Inventory source: [`_research/2026-05-23_cortex_ai_model_inventory.md`](_research/2026-05-23_cortex_ai_model_inventory.md).

## Activation gates

Both must clear before dispatch fires:

1. **40e close.** PR #110 merged (inline render dashboard + CI green; held for operator as of 2026-05-24).
2. **Operator greenlight.** Explicit approval to plan (not yet implement) product-runtime model vendor change. Planning does not flip prod env vars.

## Owner and clone

- **Agent:** cc-agent-R (`P:\legacy-design-tools-r`)
- **Branch prefix (when execution starts):** `cortex/grok-runtime-plan` or `cortex/grok-chat-phase1`
- **Dispatch:** [`_dispatches/2026-05-24_cc-agent-R_cortex_grok_runtime_migration_QUEUED.md`](_dispatches/2026-05-24_cc-agent-R_cortex_grok_runtime_migration_QUEUED.md)

## Deliverables (planning sprint — doc_repo + research)

Planning sprint produces docs and an execution plan; **no prod code changes** until a follow-on implementation dispatch.

1. **New canonical doc:** `44b_cortex_grok_migration.md` (doc_repo, slot `44b`)
   - Current call sites summary (from inventory + code trace)
   - Recommended Grok models per call site
   - Implementation steps for xAI integration
   - Risk assessment (tool-use, vision, JSON output)
   - Phase 1 recommendation: in-app chat only (highest visibility)

2. **Technical change draft** (in `44b`, not implemented yet)
   - New module sketch: `lib/integrations-xai-grok/`
   - `artifacts/api-server/src/routes/chat.ts` integration points
   - Environment variables for model selection (`XAI_*` / feature flags)

3. **Atom catalog expansion** — update [`01a_atom_conventions.md`](01a_atom_conventions.md) with Cortex runtime atoms (e.g. `product-runtime:chat`, `engagement`, `finding`, `briefing` as applicable)

4. **Execution plan** — branch name, PR checklist, phased rollout (chat → findings → briefing)

## Phased rollout (target — confirm in 44b)

| Phase | Surface | Rationale |
|---|---|---|
| 1 | In-app chat (`chat.ts`) | Highest visibility; existing tool-use loop |
| 2 | Findings / AIR engine | Lower traffic; structured output |
| 3 | Briefing generation | Longest context; highest risk |

## Out of scope (this sprint)

- Implementing xAI client code in legacy-design-tools
- Changing Cloud Run env vars on cortex-api
- Replacing mnml.ai or DXF converter integrations
- Agent fleet doc changes (already complete)

## Acceptance criteria (planning sprint)

- [ ] `44b_cortex_grok_migration.md` filed with frontmatter per doc conventions
- [ ] Call-site table traces every Anthropic invocation in api-server (or documents explicit exclusions)
- [ ] Phase 1 scope bounded to chat with rollback path documented
- [ ] `01a` updated with new Cortex runtime atom refs
- [ ] Session summary in `_inbox/` with atoms table + model used
- [ ] Implementation dispatch teed (separate from this planning sprint)

## Cross-references

- [`_research/2026-05-23_cortex_ai_model_inventory.md`](_research/2026-05-23_cortex_ai_model_inventory.md)
- [`21c_grok_atom_migration_plan.md`](21c_grok_atom_migration_plan.md) — "Not in scope: Cortex production LLM"
- [`40e_cortex_rendering_parity_sprint.md`](40e_cortex_rendering_parity_sprint.md) — predecessor cc-agent-R work

## Revision history

- **2026-05-24:** Sprint queued; cc-agent-R next task after 40e PR #110.
