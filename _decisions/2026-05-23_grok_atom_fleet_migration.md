---
decision_id: 2026-05-23_grok_atom_fleet_migration
date: 2026-05-23
owner: nick
status: active
related_canonical: [01a_atom_conventions, 20_agent_operating_rules, 21c_grok_atom_migration_plan, 21_ai_first_dev_flow, 25a_atom_principle_llm_economics, CLAUDE.md, 00_current_state]
---

## Decision

Migrate the portfolio agent fleet from heavy Claude usage to Grok (xAI) models as the default execution stack, and standardize doc_repo plus fleet context retrieval on the Atom pattern (named atom resolution before full-document reads).

## Context

Build heavy-lifting already shifted to Cursor agents on 2026-05-23 while the doc_repo planner stays in planning, filing, and dispatch design. The next step is model economics and context discipline: Grok for speed and cost on code execution, atom-first retrieval to cut orientation token burn across `doc_repo`, Cortex, and engineering dispatches. Nick supplied ready-to-paste conventions, HR-12 model rules, a global Cursor rule template, and a reconciliation prompt.

## Structural commitment check

1. **Sell reasoning, not data:** unchanged; atom summaries carry provenance and `as_of`.
2. **Partnership-first sourcing:** unchanged; doc_repo atoms are portfolio intelligence, not jurisdictional operational ingest.
3. **Cost per jurisdiction onboarded:** Grok migration targets agent COGS, not jurisdiction ingest cost; no conflict.
4. **Dual interface:** atom-first context is MCP-aligned; doc_repo catalog Phase 1 is planner-side, product MCP atom resolution remains on Hauska substrate.

Premortem: green. No load-bearing yellow.

## Reasoning

Claude remains viable for escalation but is no longer the default for cc-agent execution or planner filing when Grok completes the task. `grok-code-fast-1` optimizes speed and cost for most code work; `Grok Build 0.1` fits multi-file dispatch loops that currently burn Claude context. Atom-first rules reduce repeated full reads of `00_current_state.md`, sprint docs, and QA backlogs by resolving named catalog entries (`sprint:40e`, `qa-backlog-item:QA-32`, etc.) before implementation. Planner retains synthesis ownership: agents request atom resolution when context is unclear. HR-12 supersedes prior model-agnostic agent instructions where they conflict. Slot `01` is occupied by `01_doc_conventions.md`; portfolio atom conventions land at `01a_atom_conventions.md` per sub-letter convention.

## Reversal criteria

- Grok failure rate exceeds Claude on three consecutive dispatch cycles for the same workstream type (code ship, doc reconciliation, or multi-file refactor), measured by operator review of PR quality and rework volume.
- Atom catalog Phase 1 fails to reduce average dispatch read-list size within 30 days of rollout (planner compares dispatch `read first` sections before/after).
- xAI API availability or pricing moves Grok above Claude on blended cost per shipped PR for two consecutive weeks.
- ECI atomization sprint ships `@empressaio/atom-internal` with a conflicting catalog schema; reconcile into one registry rather than maintaining parallel conventions.

## Dependencies

- Depends on: operator Cursor settings migration (`https://api.x.ai/v1`, disable non-Grok models during transition).
- Depends on: [`21c_grok_atom_migration_plan.md`](../21c_grok_atom_migration_plan.md) Phase 1 doc updates.
- Unblocks: dispatch template atom-reference boilerplate; ECI decision-record atoms (queued in `60_eci_atomization.md`).
- Conflicts to resolve: `CLAUDE.md`, `21_ai_first_dev_flow.md`, `00_README.md`, skills referencing Claude Code as default planner model.

## Counterparties

Internal: Nick (operator, Cursor config), planner (atom catalog owner), all cc-agents (atom-first consumers). External: xAI (model API).
