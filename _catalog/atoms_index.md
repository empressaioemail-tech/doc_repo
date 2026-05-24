---
id: atoms_index
title: Portfolio atom index — active catalog
status: active
last_updated: 2026-05-23
applies_to: portfolio
related: [01a_atom_conventions, 21c_grok_atom_migration_plan, 00_current_state]
owner: planner
---

# Portfolio atom index

Quick lookup for active portfolio intelligence atoms. Authoritative spec:
[`01a_atom_conventions.md`](../01a_atom_conventions.md). Planner maintains
this index when hot-path refs change; ECI P2 will supersede with code registry.

| Atom ref | Type | Source | Status |
|---|---|---|---|
| `current-state:portfolio` | meta | [`00_current_state.md`](../00_current_state.md) | active |
| `sprint:40e` | sprint | [`40e_cortex_rendering_parity_sprint.md`](../40e_cortex_rendering_parity_sprint.md) | active (~90% code-complete) |
| `sprint:40f` | sprint | [`40f_cortex_grok_runtime_migration_sprint.md`](../40f_cortex_grok_runtime_migration_sprint.md) | QUEUED — product runtime Grok planning |
| `sprint:40d` | sprint | [`40d_cortex_site_context_sprint.md`](../40d_cortex_site_context_sprint.md) | active (2D-first) |
| `sprint:51` | sprint | [`51_substrate_v1_sprint.md`](../51_substrate_v1_sprint.md) | winding down |
| `qa-backlog-item:QA-32` | qa | [`43_cortex_qa_backlog.md`](../43_cortex_qa_backlog.md) | closed 2026-05-23 |
| `qa-backlog-item:QA-110` | qa | [`43_cortex_qa_backlog.md`](../43_cortex_qa_backlog.md) + `00` §6 | open (PR #110 CI) |
| `decision:2026-05-23_grok_atom_fleet_migration` | decision | [`_decisions/2026-05-23_grok_atom_fleet_migration.md`](../_decisions/2026-05-23_grok_atom_fleet_migration.md) | active |
| `decision:2026-05-23_partnership_first_scoping` | decision | [`_decisions/2026-05-23_partnership_first_scoping.md`](../_decisions/2026-05-23_partnership_first_scoping.md) | active |
| `decision:2026-05-22_traffic-shift` | decision | [`_dispatches/2026-05-22_cc-agent-AC_cloud_run_deploy_shift_traffic.md`](../_dispatches/2026-05-22_cc-agent-AC_cloud_run_deploy_shift_traffic.md) | historical |
| `agent:planner` | agent | [`00_current_state.md`](../00_current_state.md) §4 | active |
| `agent:cc-agent-C` | agent | [`00_current_state.md`](../00_current_state.md) §4 | idle |
| `agent:cc-agent-C2` | agent | [`00_current_state.md`](../00_current_state.md) §4 | idle |
| `agent:cc-agent-R` | agent | [`00_current_state.md`](../00_current_state.md) §4 | idle (PR #110) |
| `agent:cc-agent-E` | agent | [`00_current_state.md`](../00_current_state.md) §4 | idle |
| `product:cortex` | product | [`40_design_accelerator.md`](../40_design_accelerator.md) | active |
| `product:empressa` | product | [`07_product_line_summary.md`](../07_product_line_summary.md) | active |
| `strategy-module:ai-first-dev-flow` | strategy | [`21_ai_first_dev_flow.md`](../21_ai_first_dev_flow.md) | active |
| `strategy-module:grok-atom-migration` | strategy | [`21c_grok_atom_migration_plan.md`](../21c_grok_atom_migration_plan.md) | Phase 3 doc complete |
| `strategy-module:grok-atom-migration-complete` | strategy | [`21d_grok_atom_migration_complete.md`](../21d_grok_atom_migration_complete.md) | Migration declared complete 2026-05-23 |
| `runbook:agent_workspace_hygiene` | runbook | [`90_runbooks/agent_workspace_hygiene.md`](../90_runbooks/agent_workspace_hygiene.md) | active |
| `runbook:cloud_run_canary_deploy` | runbook | [`90_runbooks/cloud_run_canary_deploy.md`](../90_runbooks/cloud_run_canary_deploy.md) | active |
| `dispatch-template:standard` | template | [`_dispatches/_template.md`](../_dispatches/_template.md) | active |

## Maintenance

Add a row when an atom appears in three or more dispatches or two consecutive
planner sessions. Remove or mark stale when the underlying doc is superseded.
Do not register one-off session facts.

## Revision history

- **2026-05-23:** Initial index seeded at Grok migration Phase 3.
