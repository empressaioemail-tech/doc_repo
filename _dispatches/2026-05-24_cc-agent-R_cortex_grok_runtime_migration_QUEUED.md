---
id: 2026-05-24_cc-agent-R_cortex_grok_runtime_migration_QUEUED
title: Dispatch (QUEUED) — Cortex in-app AI Grok runtime migration planning
date: 2026-05-24
agent: cc-agent-R
repo: legacy-design-tools + doc_repo
kind: dispatch
status: queued
related: [40f_cortex_grok_runtime_migration_sprint, _research/2026-05-23_cortex_ai_model_inventory, 21d_grok_atom_migration_complete, 01a_atom_conventions, 20_agent_operating_rules, 90_runbooks/agent_workspace_hygiene]
---

# QUEUED dispatch — Cortex in-app AI Grok runtime migration planning

> **This dispatch is QUEUED, not active.** Do not start until activation gates clear. cc-agent-R has full Grok + atom migration context (HR-12, `01a`, Phases 1–3 complete). Paste this prompt into the cc-agent-R session in `P:\legacy-design-tools-r` when the operator fires it.

## Activation gates

1. **40e PR #110 merged** — rendering parity sprint closed.
2. **Operator says "fire 40f"** — explicit greenlight for product-runtime planning (not implementation).

## Model (HR-12)

Default: **Grok Build 0.1** (multi-file planning + doc_repo writes). Escalate to Claude only on retry failure; log in session summary.

## Atoms to resolve

- `current-state:portfolio` — cc-agent-R idle post-40e; next task queued
- `sprint:40f` — this planning sprint
- `strategy-module:grok-atom-migration-complete` — agent fleet done; product runtime is separate
- `agent:cc-agent-R` — clone `P:\legacy-design-tools-r`
- `runbook:agent_workspace_hygiene` — isolated clone; doc writes to `P:\doc_repo\_inbox/` per HR-11

## Read first (after atoms)

1. [`_research/2026-05-23_cortex_ai_model_inventory.md`](../_research/2026-05-23_cortex_ai_model_inventory.md) — current Anthropic call sites
2. [`40f_cortex_grok_runtime_migration_sprint.md`](../40f_cortex_grok_runtime_migration_sprint.md) — sprint scope and deliverables
3. [`21d_grok_atom_migration_complete.md`](../21d_grok_atom_migration_complete.md) — fleet vs product runtime boundary
4. [`20_agent_operating_rules.md`](../20_agent_operating_rules.md) — HR-11 `_inbox/` reporting

## Workspace ownership

- Code recon clone: `P:\legacy-design-tools-r`
- Doc output: `P:\doc_repo` (planner commits canonical docs; agent drops `_inbox/` summary)
- Branch prefix when code recon needed: `cortex/grok-runtime-plan` (read-only recon OK on main after fetch)
- One agent per clone per [`agent_workspace_hygiene`](../90_runbooks/agent_workspace_hygiene.md)

## Scope

**In scope (planning only — no prod code changes):**

1. Create **`44b_cortex_grok_migration.md`** in doc_repo with:
   - Current call sites summary
   - Recommended Grok models per call site
   - Implementation steps for adding xAI integration
   - Risk assessment (tool-use, vision, JSON output)
   - Phase 1: in-app chat only (highest visibility)

2. Draft technical changes needed in (document in 44b, do not implement):
   - `lib/integrations-xai-grok/` (new module sketch)
   - `artifacts/api-server/src/routes/chat.ts`
   - Environment variables for model selection

3. Update **`01a_atom_conventions.md`** with relevant Cortex runtime atoms (e.g. engagement, finding, briefing surfaces)

4. Provide **execution plan** with branch name and PR checklist for a follow-on implementation dispatch

**Out of scope:**

- Implementing xAI client or merging to main
- Flipping cortex-api Cloud Run env vars
- Agent fleet migration docs (complete)

## Acceptance criteria

- `44b_cortex_grok_migration.md` filed with frontmatter
- Call-site inventory verified against api-server (not inventory doc alone)
- Phase 1 scoped to chat with rollback documented
- `01a` bumped with new atom refs
- Session summary to `_inbox/` with atoms table + **Grok Build 0.1**
- Implementation dispatch stub or checklist in 44b for operator review

## Reporting

Write session summary to `P:\doc_repo\_inbox/2026-05-24_cc-agent-R_cortex_grok_runtime_planning.md` (or dated equivalent). Include atom refs touched, model used, blockers verbatim.

## When fired

Operator renames this file to drop `_QUEUED`, updates `40f` status `queued` → `active`, and bumps `00_current_state.md` §4 cc-agent-R line.
