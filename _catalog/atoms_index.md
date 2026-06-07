---
id: atoms_index
title: Portfolio atom index — active catalog
status: active
last_updated: 2026-05-28
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
| `sprint:54` | sprint | [`54_tenant_leg_sprint.md`](../54_tenant_leg_sprint.md) | active (tenant leg; dispatches QUEUED) |
| `sprint:55` | sprint | [`55_spine_data_intelligence_stack.md`](../55_spine_data_intelligence_stack.md) | active (spine robustness; 4 dispatches teed) |
| `sprint:56` | sprint | [`56_engine_extraction_sprint.md`](../56_engine_extraction_sprint.md) | active (engine extraction; scaffold now, lift after M-Stabilize 2C) |
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
| `strategy-module:formation-graph` | strategy | [`78_talent_education_graph.md`](../78_talent_education_graph.md) | active |
| `formation-pattern:outlier-ai-v1` | formation | [`78a_formation_pattern_outlier_ai_v1.md`](../78a_formation_pattern_outlier_ai_v1.md) + [`_catalog/education/outlier_ai_formation_v1.yaml`](education/outlier_ai_formation_v1.yaml) | active |
| `strategy-module:competitive-execution-system` | strategy | [`79_competitive_execution_system.md`](../79_competitive_execution_system.md) | active |
| `strategy-module:gtm-engine-polish-sprint` | strategy | [`76b_gtm_engine_polish_sprint.md`](../76b_gtm_engine_polish_sprint.md) + [`_catalog/ops/gtm_public_capability_matrix_v1.yaml`](ops/gtm_public_capability_matrix_v1.yaml) | active (Lane P governance filed) |
| `ops-scoreboard:weekly` | ops | [`79a_weekly_moat_scoreboard.md`](../79a_weekly_moat_scoreboard.md) + [`_catalog/ops/weekly_moat_scoreboard_contextsummary.yaml`](ops/weekly_moat_scoreboard_contextsummary.yaml) | active |

## Maintenance

Add a row when an atom appears in three or more dispatches or two consecutive
planner sessions. Remove or mark stale when the underlying doc is superseded.
Do not register one-off session facts.

## Revision history

- **2026-06-07:** Added `sprint:54` (tenant leg), `sprint:55` (spine data-intelligence stack), and `sprint:56` (engine extraction); all appear across the 2026-06-07 dispatch waves.
- **2026-05-28:** Added `strategy-module:gtm-engine-polish-sprint` (76b + capability matrix).
- **2026-05-27:** Added competitive execution system and weekly moat scoreboard atoms.
- **2026-05-27:** Formation graph (additive); outlier-ai-v1 pattern (depersonalized).
- **2026-05-23:** Initial index seeded at Grok migration Phase 3.
