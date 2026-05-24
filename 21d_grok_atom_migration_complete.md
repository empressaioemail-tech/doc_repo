---
id: 21d_grok_atom_migration_complete
title: Grok + atom-first fleet migration — completion record
status: active
last_updated: 2026-05-23
applies_to: portfolio
related: [21c_grok_atom_migration_plan, 01a_atom_conventions, 20_agent_operating_rules, _decisions/2026-05-23_grok_atom_fleet_migration, _catalog/atoms_index, 00_current_state]
owner: planner
---

# Grok + atom-first fleet migration — complete

**Declared complete:** 2026-05-23 (planner session, post Phase 3 doc reconciliation)

The portfolio agent fleet now operates under HR-12: Grok Build 0.1 default, atom-first context retrieval, Claude escalation only on retry failure. Documentation, dispatch template, and catalog are filed. Fleet validation is in progress (two of three atom-first dispatches executed successfully).

## What was accomplished

### Phase 1 — Policy (2026-05-23)

- Decision record: [`_decisions/2026-05-23_grok_atom_fleet_migration.md`](_decisions/2026-05-23_grok_atom_fleet_migration.md)
- HR-12 in [`20_agent_operating_rules.md`](20_agent_operating_rules.md)
- Portfolio atom catalog: [`01a_atom_conventions.md`](01a_atom_conventions.md)
- Migration plan: [`21c_grok_atom_migration_plan.md`](21c_grok_atom_migration_plan.md)

### Phase 2 — Doc reconciliation (2026-05-23)

- [`21_ai_first_dev_flow.md`](21_ai_first_dev_flow.md) — named fleet, atom-resolve step 0, Grok defaults
- [`CLAUDE.md`](CLAUDE.md), [`00_README.md`](00_README.md), [`00b_doc_repo_guide.md`](00b_doc_repo_guide.md)
- [`90_runbooks/session_close_template.md`](90_runbooks/session_close_template.md) — atom refs + model in close checklist
- [`21b_cursor_workflow_observatory.md`](21b_cursor_workflow_observatory.md) — model layer addendum
- [`_dispatches/_template.md`](_dispatches/_template.md) — Atoms block + HR-12 model line

### Phase 3 — Catalog + fleet alignment (2026-05-23)

- Roadmap, thesis, ground truth, stakeholder graph owner notation updated
- [`01a_atom_conventions.md`](01a_atom_conventions.md) expanded (+10 hot-path atoms)
- [`_catalog/atoms_index.md`](_catalog/atoms_index.md) index mirror

### Phase 3 fleet validation (in progress)

| Dispatch | Agent | Atom anchor | Outcome |
|---|---|---|---|
| #1 | cc-agent-R | `qa-backlog-item:QA-110` | PR #110 CI green; inline kickoff tests + atoms-route fix |
| #2 | cc-agent-C | `qa-backlog-item:QA-22` | PR #111 opened; CalEPA EJScreen mirror opt-in |
| #3 | cc-agent-C2 | `sprint:40d` / migration 0017 | PR #112 — duplicate 0016 prefix fix |

**Fleet validation gate closed 2026-05-24.**

## Remaining operator actions

1. **Cursor xAI config** on all workstations: base URL `https://api.x.ai/v1`, Grok models enabled, global rule pasted (see Phase 1 block in [`21c_grok_atom_migration_plan.md`](21c_grok_atom_migration_plan.md)).
2. **Merge validation PRs** when CI green: PR #110 (40e), PR #111 (CalEPA).
3. ~~**Fire validation dispatch #3**~~ — **Done 2026-05-24:** cc-agent-C2 PR #112 (migration 0017 renumber).
4. **40f (queued)** — after PR #110 merge, cc-agent-R plans Cortex product-runtime Grok migration (`44b_cortex_grok_migration.md`). See [`40f_cortex_grok_runtime_migration_sprint.md`](40f_cortex_grok_runtime_migration_sprint.md). **Planning only; operator greenlight required.**
5. **ECI atomization** — register decision/sprint/runbook atoms in `@empressaio/atom-internal` when that sprint fires (deferred).

## Ongoing governance

### Atom catalog maintenance

- New hot-path refs register in [`01a_atom_conventions.md`](01a_atom_conventions.md) and [`_catalog/atoms_index.md`](_catalog/atoms_index.md).
- One-off session facts stay in `_sessions/` or `_inbox/`; do not atomize ephemeral state.
- doc_repo catalog atoms are separate from Hauska substrate atoms (`@hauska/atom-contract`); dispatches must say which registry applies.

### Model escalation path (HR-12)

- Default: **Grok Build 0.1** for multi-file agentic work.
- Speed-only narrow tasks: **grok-code-fast-1**.
- Escalate to Claude only after Grok retry fails; log escalation in session summary.
- **Cortex product LLM unchanged** — Anthropic Sonnet in api-server finding/briefing/chat engines is product runtime, not agent fleet.

### Dispatch and session hygiene

- Every dispatch: `Atoms to resolve` block before deep doc reads ([`_dispatches/_template.md`](_dispatches/_template.md)).
- Every cc-agent session summary: atoms table + model used → `_inbox/` or `_sessions/`.
- One clone per agent per [`90_runbooks/agent_workspace_hygiene.md`](90_runbooks/agent_workspace_hygiene.md).

## Acceptance criteria (migration doc track)

All five criteria from [`21c_grok_atom_migration_plan.md`](21c_grok_atom_migration_plan.md) §Acceptance criteria are met for the **documentation track**. Fleet validation gate closes when dispatch #3 completes without full-doc regression.

## Cross-references

- [`21c_grok_atom_migration_plan.md`](21c_grok_atom_migration_plan.md) — phase checklist and revision history
- [`25a_atom_principle_llm_economics.md`](25a_atom_principle_llm_economics.md) — economic rationale for atom-first retrieval
- [`_sessions/2026-05-23_grok_atom_migration_phase3_planner.md`](_sessions/2026-05-23_grok_atom_migration_phase3_planner.md) — Phase 3 planner close
- [`_inbox/2026-05-23_legacy-design-tools_cc-agent-R_qa110_inline_kickoff_tests.md`](_inbox/2026-05-23_legacy-design-tools_cc-agent-R_qa110_inline_kickoff_tests.md) — validation dispatch #1

## Revision history

- **2026-05-23:** Migration declared complete on doc track; fleet validation 2/3 in progress.
