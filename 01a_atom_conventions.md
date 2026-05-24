---
id: 01a_atom_conventions
title: Atom conventions for the portfolio
status: active
last_updated: 2026-05-23
applies_to: portfolio
related: [01_doc_conventions, 20_agent_operating_rules, 21_ai_first_dev_flow, 21c_grok_atom_migration_plan, 25a_atom_principle_llm_economics, 25_atom_architecture_reference, 26_atom_upgrade_guide]
owner: planner
---

# Atom conventions for the portfolio

Standardize the Atom pattern across `doc_repo`, Cortex, Empressa, Hauska, and all agents for predictable, low-token, intent-driven context retrieval.

This doc covers **portfolio intelligence atoms** (doc_repo catalog, planner dispatches, session summaries). The Hauska substrate atom contract (`@hauska/atom-contract`, ADR-001) is separate and specified in [`25_atom_architecture_reference.md`](25_atom_architecture_reference.md). Both layers share the `ContextSummary` shape; do not conflate registry namespaces.

## Core atom contract

Every atom must expose a `ContextSummary`:

```yaml
entity_type: string          # e.g. "sprint", "qa-backlog-item", "agent"
entity_id: string            # e.g. "40e", "QA-32", "cc-agent-C"
prose: string                # 1-4 sentences, template-first when possible
typed: object                # structured fields
key_metrics: object
related_refs: array[AtomRef]
as_of: datetime              # ISO-8601; when this summary was accurate
```

`AtomRef` format: `<entity_type>:<entity_id>` (examples: `sprint:40e`, `decision:2026-05-22_traffic-shift`).

### ContextSummary fields

| Field | Required | Notes |
|---|---|---|
| `entity_type` | yes | Stable type slug; matches catalog registration |
| `entity_id` | yes | Unique within type |
| `prose` | yes | Human-readable; prefer templates over LLM-generated prose for hot paths |
| `typed` | yes | Structured fields agents query without parsing prose |
| `key_metrics` | yes | Counts, statuses, owners, phase labels |
| `related_refs` | yes | May be empty array; use for graph traversal |
| `as_of` | yes | Staleness signal; agents treat older summaries as suspect |

## doc_repo Atom Catalog (Phase 1 — 2026-05-23; expanded Phase 3)

Phase 1 is **manual planner synthesis**: named refs resolve to canonical doc sections or `_decisions/` records. Phase 2 (ECI atomization) registers these in `@empressaio/atom-internal`. Index mirror: [`_catalog/atoms_index.md`](_catalog/atoms_index.md).

| Atom ref | Canonical source |
|---|---|
| `current-state:portfolio` | [`00_current_state.md`](00_current_state.md) |
| `sprint:40e` | [`40e_cortex_rendering_parity_sprint.md`](40e_cortex_rendering_parity_sprint.md) |
| `sprint:40f` | [`40f_cortex_grok_runtime_migration_sprint.md`](40f_cortex_grok_runtime_migration_sprint.md) — QUEUED; Cortex product runtime Grok planning (cc-agent-R) |
| `sprint:40d` | [`40d_cortex_site_context_sprint.md`](40d_cortex_site_context_sprint.md) |
| `sprint:51` | [`51_substrate_v1_sprint.md`](51_substrate_v1_sprint.md) |
| `qa-backlog-item:QA-32` | [`43_cortex_qa_backlog.md`](43_cortex_qa_backlog.md) — closed 2026-05-23 |
| `qa-backlog-item:QA-110` | [`43_cortex_qa_backlog.md`](43_cortex_qa_backlog.md); [`00_current_state.md`](00_current_state.md) 40e watch — PR #110 CI test updates for inline render dashboard |
| `decision:2026-05-23_grok_atom_fleet_migration` | [`_decisions/2026-05-23_grok_atom_fleet_migration.md`](_decisions/2026-05-23_grok_atom_fleet_migration.md) |
| `decision:2026-05-23_partnership_first_scoping` | [`_decisions/2026-05-23_partnership_first_scoping.md`](_decisions/2026-05-23_partnership_first_scoping.md) |
| `decision:2026-05-22_traffic-shift` | [`_dispatches/2026-05-22_cc-agent-AC_cloud_run_deploy_shift_traffic.md`](_dispatches/2026-05-22_cc-agent-AC_cloud_run_deploy_shift_traffic.md); deploy traffic discipline in [`91_postmortems/2026-05-11_canonical_deploy_drift_and_traffic_pin.md`](91_postmortems/2026-05-11_canonical_deploy_drift_and_traffic_pin.md) |
| `agent:cc-agent-C` | [`00_current_state.md`](00_current_state.md) §4 Agent fleet |
| `agent:cc-agent-C2` | [`00_current_state.md`](00_current_state.md) §4; clone `P:\legacy-design-tools-c2` |
| `agent:cc-agent-R` | [`00_current_state.md`](00_current_state.md) §4; clone `P:\legacy-design-tools-r` |
| `agent:cc-agent-E` | [`00_current_state.md`](00_current_state.md) §4; hauska-engine Sync 5 |
| `agent:planner` | [`00_current_state.md`](00_current_state.md) §4; [`CLAUDE.md`](CLAUDE.md) |
| `product:cortex` | [`40_design_accelerator.md`](40_design_accelerator.md) |
| `product:empressa` | [`07_product_line_summary.md`](07_product_line_summary.md) |
| `strategy-module:ai-first-dev-flow` | [`21_ai_first_dev_flow.md`](21_ai_first_dev_flow.md) |
| `strategy-module:grok-atom-migration` | [`21c_grok_atom_migration_plan.md`](21c_grok_atom_migration_plan.md) |
| `strategy-module:grok-atom-migration-complete` | [`21d_grok_atom_migration_complete.md`](21d_grok_atom_migration_complete.md) |
| `runbook:agent_workspace_hygiene` | [`90_runbooks/agent_workspace_hygiene.md`](90_runbooks/agent_workspace_hygiene.md) |
| `runbook:cloud_run_canary_deploy` | [`90_runbooks/cloud_run_canary_deploy.md`](90_runbooks/cloud_run_canary_deploy.md) |
| `dispatch-template:standard` | [`_dispatches/_template.md`](_dispatches/_template.md) |

Expand this table as new hot-path refs stabilize. Do not register one-off session facts as atoms; those stay in `_sessions/`.

## Agent usage rules (HR-12 companion)

All agents (including planner) must:

1. **Prefer resolving named atoms** over reading full raw documents when the dispatch or task names an atom ref.
2. **List required atoms** in every dispatch under a `Read first (atoms)` block before optional deep docs.
3. **Include relevant `related_refs`** in session summaries when the session touched catalog entities.
4. **Request atom resolution from planner** when context is unclear or catalog coverage is missing.

Dispatches that only say "read `00_current_state.md` verbatim" without atom refs are legacy; new dispatches lead with atoms, then link canonical docs for depth.

## Implementation guidance

| Layer | Doc |
|---|---|
| Portfolio atom conventions (this doc) | Phase 1 manual catalog |
| LLM cost economics of atom summaries | [`25a_atom_principle_llm_economics.md`](25a_atom_principle_llm_economics.md) |
| Hauska substrate contract | [`25_atom_architecture_reference.md`](25_atom_architecture_reference.md), ADR-001 |
| ECI internal registry (Phase 2) | [`60_eci_atomization.md`](60_eci_atomization.md) |
| Migration and conflict cleanup | [`21c_grok_atom_migration_plan.md`](21c_grok_atom_migration_plan.md) |

Note: external drafts referenced `EMPRESSA_ATOM_FIT.md`; that file is not in the repo. Treat [`25a_atom_principle_llm_economics.md`](25a_atom_principle_llm_economics.md) plus this doc as the canonical fit guidance until ECI P2 registers doc_repo atoms in code.

## Revision history

- **2026-05-23 (Phase 3):** Catalog expanded (40d, QA-110, grok migration decision, partnership scoping, cc-agent-R/C2/E, runbooks, dispatch template). Index at `_catalog/atoms_index.md`.
- **2026-05-23 (origin):** Phase 1 catalog seeded; HR-12 companion rules filed alongside Grok fleet migration decision.
