---
id: blueprint_00_readme
title: Master blueprint — the mesh
status: draft
last_updated: 2026-08-21
compiled_at_commit: e022436908248c9d378fd9358f062a0b39cf5bee
applies_to: portfolio
owner: nick
related: [_blueprint/00_WDLL, 90_operations/OPS-18_canon_reconciliation_plan_of_record]
---

# Master blueprint — the mesh

Compiled at doc_repo `e022436908248c9d378fd9358f062a0b39cf5bee` (integration worktree `P:/doc_repo`, branch `main`, 2026-08-21).

This file classifies every path in the canon set. The set is bounded by the inclusion rule in `_blueprint/00_WDLL.md` D1 and enumerated in `_blueprint/canon_set_listing.json` at commit `e022436908248c9d378fd9358f062a0b39cf5bee`. Status counts below equal `countTotal` in that listing. A curated subset is not the canon set.

## Status counts

| Status | Count |
| --- | ---: |
| AUTHORITATIVE | 12 |
| SUBORDINATE | 23 |
| SUPERSEDED | 0 |
| QUARANTINE | 0 |
| REFERENCE | 203 |
| **Total classified** | **238** |

Listing: `countFiles` 237, `countNpm` 1, `countTotal` 238. npm fetched from registry.npmjs.org 2026-08-21: `@empressaio/atom-contract@1.22.0` (latest).

## Contract vs ADR precedence

Where `@empressaio/atom-contract@1.22.0` (npm, fetched 2026-08-21) and an ADR disagree:

1. **Types and field shapes.** Contract wins. It is the only artifact that refuses to compile.
2. **Architectural intent and reversal criteria.** ADR wins when accepted and not superseded.
3. **ADR marked `proposed`.** Contract wins for shipped fields; ADR wins for intent pending acceptance. ADR-028 is `proposed` but fields from 1.9.0 through 1.22.0 are live on npm; treat contract as authoritative for shape, ADR-028 as SUBORDINATE intent until accepted.
4. **Production store vs contract.** Store audit (`_inbox/2026-08-20_store_audit_atom_graph.md`, 2026-08-20T23:03Z) wins for *what is populated*; contract wins for *what ought to be populated*. That audit is a D7 live-query artifact. It is not a mesh row: `_inbox` is outside the inclusion rule.
5. **Versions 1.9.0 through 1.22.0.** No ADR documents these releases. `./property`, `./reasoning`, `./testing` subpaths are undocumented in the ADR band; the contract export map is AUTHORITATIVE.

## AUTHORITATIVE (12)

The blueprint compiles from these. They govern.

| path | status | blueprint section |
| --- | --- | --- |
| `51_ingestion_pipeline_reference.md` | AUTHORITATIVE | 20_pipeline, 30_lifecycle, 40_rule_register |
| `61_enforcement_doctrine.md` | AUTHORITATIVE | 40_rule_register |
| `80_adrs/adr_001_atom_architecture.md` | AUTHORITATIVE | 10_model |
| `80_adrs/adr_010_atom_graph_traversal.md` | AUTHORITATIVE | 10_model, 20_pipeline |
| `80_adrs/adr_011_atom_identity_across_versions.md` | AUTHORITATIVE | 10_model |
| `80_adrs/adr_017_atom_access_control.md` | AUTHORITATIVE | 10_model, 40_rule_register |
| `80_adrs/adr_018_atom_contract_substrate_layer.md` | AUTHORITATIVE | 10_model |
| `80_adrs/adr_020_recorded_instruments_and_restriction_clauses.md` | AUTHORITATIVE | 10_model |
| `80_adrs/adr_021_constraint_resolution_and_precedence.md` | AUTHORITATIVE | 10_model |
| `@empressaio/atom-contract@1.22.0` | AUTHORITATIVE | 10_model, 20_pipeline, 40_rule_register (npm type surface) |
| `ENFORCEMENT.md` | AUTHORITATIVE | 40_rule_register, 50_grading |
| `_blueprint/00_WDLL.md` | AUTHORITATIVE | 50_grading |

## SUBORDINATE (23)

These elaborate an authoritative source and may not contradict it.

| path | status | blueprint section |
| --- | --- | --- |
| `01_doc_conventions.md` | SUBORDINATE | 00_README |
| `01a_atom_conventions.md` | SUBORDINATE | 10_model |
| `08_tiered_access_model.md` | SUBORDINATE | 10_model |
| `25_atom_architecture_reference.md` | SUBORDINATE | 10_model |
| `80_adrs/adr_005_multitenancy.md` | SUBORDINATE | 10_model |
| `80_adrs/adr_007_cross_stakeholder_atom_access.md` | SUBORDINATE | 10_model |
| `80_adrs/adr_008_engine_factor_out.md` | SUBORDINATE | 10_model |
| `80_adrs/adr_012_atom_export_format.md` | SUBORDINATE | 10_model |
| `80_adrs/adr_013_procedure_execution_atoms.md` | SUBORDINATE | 10_model |
| `80_adrs/adr_015_actor_atoms.md` | SUBORDINATE | 10_model |
| `80_adrs/adr_019_layered_code_substrate.md` | SUBORDINATE | 10_model |
| `80_adrs/adr_022_deal_twin_and_cross_application_capture.md` | SUBORDINATE | 10_model |
| `80_adrs/adr_024_shared_surface_package_architecture.md` | SUBORDINATE | 10_model |
| `80_adrs/adr_025_og_atom_ontology.md` | SUBORDINATE | 10_model |
| `80_adrs/adr_026_sensor_stream_atoms.md` | SUBORDINATE | 10_model |
| `80_adrs/adr_027_first_party_land_records_acquisition.md` | SUBORDINATE | 10_model |
| `80_adrs/adr_028_contract_cross_vertical_adoption.md` | SUBORDINATE | 10_model |
| `80_adrs/adr_029_building_footprint_and_utility_easement_rails.md` | SUBORDINATE | 10_model |
| `90_runbooks/AGENT_CONTRACT.md` | SUBORDINATE | 40_rule_register |
| `90_runbooks/DEV_PROCESS.md` | SUBORDINATE | 50_grading |
| `90_runbooks/fleet_memory_practice.md` | SUBORDINATE | 40_rule_register |
| `_catalog/repo_intents.md` | SUBORDINATE | 00_README |
| `_catalog/repo_map.md` | SUBORDINATE | 00_README |

## SUPERSEDED (0)

Zero listing rows. The frozen package `@hauska/atom-contract@1.6.1` is the renamed contract; it is not in the inclusion rule, so it is not a listing row. Rulings that used to appear as mesh rows (ADR-001 v1.3 ownership note, ADR-010 `target_cid` column name, tier2 flood path, Regrid/Cotality join keys) live in `10_model.md`.

## QUARANTINE (0)

Zero. No listing file contradicts the blueprint in a way that requires a P2 move. Accepted ADRs that conflict stay in place (operator-owned).

## REFERENCE (203)

Narrative, strategy, claims registers, plans of record, and history. They govern nothing in the blueprint compile. All three OPS plans govern work, not the model. SmartCity and SmartSite masters are claims registers, not the spine model.

| path | status | blueprint section |
| --- | --- | --- |
| `00_README.md` | REFERENCE | none |
| `00_current_state.md` | REFERENCE | none |
| `00b_doc_repo_guide.md` | REFERENCE | none |
| `00c_portfolio_master_map.md` | REFERENCE | none |
| `00d_portfolio_roadmap_reference.md` | REFERENCE | none |
| `02_doc_migration_plan.md` | REFERENCE | none |
| `03_structural_constitution_and_drift_guard.md` | REFERENCE | none |
| `03a_positioning_framework.md` | REFERENCE | none |
| `03b_thought_leadership.md` | REFERENCE | none |
| `04_roadmap_alignment_audit.md` | REFERENCE | none |
| `04a_arrow_two_calibration_capture.md` | REFERENCE | none |
| `05_living_lineage_thesis.md` | REFERENCE | none |
| `06_cities_value_narrative.md` | REFERENCE | none |
| `07_product_line_summary.md` | REFERENCE | none |
| `07a_smartcity_product_positioning.md` | REFERENCE | none |
| `09_post_saas_substrate_thesis.md` | REFERENCE | none |
| `10_ground_truth.md` | REFERENCE | none |
| `11_roadmap.md` | REFERENCE | none |
| `11a_bastrop_live_roadmap.md` | REFERENCE | none |
| `12_migration_sprint.md` | REFERENCE | none |
| `13_risk_register.md` | REFERENCE | none |
| `14_pricing_framework.md` | REFERENCE | none |
| `15_replit_neon_ownership_advisory.md` | REFERENCE | none |
| `16_commercialization_roadmap.md` | REFERENCE | none |
| `17_leading_indicators.md` | REFERENCE | none |
| `18_stakeholder_graph.md` | REFERENCE | none |
| `20_agent_operating_rules.md` | REFERENCE | none |
| `21_ai_first_dev_flow.md` | REFERENCE | none |
| `21b_cursor_workflow_observatory.md` | REFERENCE | none |
| `21c_grok_atom_migration_plan.md` | REFERENCE | none |
| `21d_grok_atom_migration_complete.md` | REFERENCE | none |
| `22_workstation_inventory.md` | REFERENCE | none |
| `23_dev_setup_assessment.md` | REFERENCE | none |
| `25a_atom_principle_llm_economics.md` | REFERENCE | none |
| `25b_monetization_provenance_storage_stack.md` | REFERENCE | none |
| `26_atom_upgrade_guide.md` | REFERENCE | none |
| `27_MASTER_WDLL_spine_completion_and_depth_engine.md` | REFERENCE | none |
| `27_engine_evolution_plan.md` | REFERENCE | none |
| `27a_jurisdiction_factory_engine_spec.md` | REFERENCE | none |
| `27b_f1_command_center_completion_program.md` | REFERENCE | none |
| `27c_road_node_engine_and_warm_digital_twin_spec.md` | REFERENCE | none |
| `27d_county_onboarding_recipe_and_fleet_reliability.md` | REFERENCE | none |
| `27e_multitrack_program_structure_and_wave_plan.md` | REFERENCE | none |
| `27f_bastrop_through_v2_program.md` | REFERENCE | none |
| `28_THE_BASTROP_MOLD_engine_build_spec.md` | REFERENCE | none |
| `28_mcp_first_product_design.md` | REFERENCE | none |
| `29_mcp_surface_tier_model.md` | REFERENCE | none |
| `29_scale_warm_architecture.md` | REFERENCE | none |
| `30_block_cert_harness_spec.md` | REFERENCE | none |
| `30_smartcity_os.md` | REFERENCE | none |
| `30a_smartcity_stabilization_sprint.md` | REFERENCE | none |
| `30b_smartcity_design_system.md` | REFERENCE | none |
| `30c_smartcity_platform_ia.md` | REFERENCE | none |
| `31a_bastrop_maintenance_sprint.md` | REFERENCE | none |
| `33_smartcity_codex_1b_integration.md` | REFERENCE | none |
| `40_design_accelerator.md` | REFERENCE | none |
| `40_hauska_map_3d_implementation_brief.md` | REFERENCE | none |
| `40a_customer_zero_observations_arena_roja_2026_05_06.md` | REFERENCE | none |
| `40b_advanced_capture_features.md` | REFERENCE | none |
| `40c_cortex_rendering_sprint.md` | REFERENCE | none |
| `40d_cortex_site_context_sprint.md` | REFERENCE | none |
| `40e_cortex_rendering_parity_sprint.md` | REFERENCE | none |
| `40f_cortex_grok_runtime_migration_sprint.md` | REFERENCE | none |
| `40g_cortex_cockpit_backend_wiring_sprint.md` | REFERENCE | none |
| `40h_cortex_pre_deploy_completion_sprint.md` | REFERENCE | none |
| `40i_cortex_dallas_e2e_grok_plan_review_sprint.md` | REFERENCE | none |
| `40j_hauska_map_tile_build_pipeline.md` | REFERENCE | none |
| `41_host_connectors_program.md` | REFERENCE | none |
| `41_revit_connector.md` | REFERENCE | none |
| `41_three_wedge_spine_strategy.md` | REFERENCE | none |
| `41a_cortex_jurisdiction_surfacing.md` | REFERENCE | none |
| `41b_archicad_connector.md` | REFERENCE | none |
| `41c_sketchup_connector.md` | REFERENCE | none |
| `41d_softplan_connector.md` | REFERENCE | none |
| `41e_host_connectors_hub.md` | REFERENCE | none |
| `41f_archicad_connector_sprint.md` | REFERENCE | none |
| `41g_sketchup_connector_sprint.md` | REFERENCE | none |
| `41h_softplan_connector_sprint.md` | REFERENCE | none |
| `41i_host_connectors_hub_sprint.md` | REFERENCE | none |
| `42_design_accelerator_program_plan.md` | REFERENCE | none |
| `42_stub_thesis_national_twin_substrate.md` | REFERENCE | none |
| `42a_verified_franchise_economy_thesis.md` | REFERENCE | none |
| `42b_stub_thesis_agent_communication_hub.md` | REFERENCE | none |
| `43_cortex_qa_backlog.md` | REFERENCE | none |
| `44_mcp_cortex_architecture_map.md` | REFERENCE | none |
| `45_codex_qa_scenarios.md` | REFERENCE | none |
| `46_smartcity_parcel_intelligence.md` | REFERENCE | none |
| `47_codex_plan_review.md` | REFERENCE | none |
| `48_codex_program_plan.md` | REFERENCE | none |
| `48_cortex_reporting_function_dashboard_spec.md` | REFERENCE | none |
| `48_cortex_reporting_plan_review_spec.md` | REFERENCE | none |
| `49_code_ingestion_pipeline.md` | REFERENCE | none |
| `49b_encumbrance_ingestion_pipeline.md` | REFERENCE | none |
| `50_hauska_mcp_server.md` | REFERENCE | none |
| `51_substrate_v1_sprint.md` | REFERENCE | none |
| `52_mcp_offer_and_buildout.md` | REFERENCE | none |
| `53_hauska_sdk_completion_sprint.md` | REFERENCE | none |
| `53a_noncustodial_settlement_rail.md` | REFERENCE | none |
| `54_tenant_leg_sprint.md` | REFERENCE | none |
| `55_spine_data_intelligence_stack.md` | REFERENCE | none |
| `56_engine_extraction_sprint.md` | REFERENCE | none |
| `57_national_code_warming_sprint.md` | REFERENCE | none |
| `58_gtm_readiness_sprint.md` | REFERENCE | none |
| `59_spine_moat_and_high_value_features.md` | REFERENCE | none |
| `60_eci_atomization.md` | REFERENCE | none |
| `60a_eci_atomization_sprint.md` | REFERENCE | none |
| `61_property_intelligence_master_plan.md` | REFERENCE | none |
| `61a_central_tx_coverage_program.md` | REFERENCE | none |
| `62_proof_of_record_spec.md` | REFERENCE | none |
| `62_seat_topology.md` | REFERENCE | none |
| `63_empressa_certification_program.md` | REFERENCE | none |
| `65_t25_admissibility_enumeration.md` | REFERENCE | none |
| `70_bizops_overview.md` | REFERENCE | none |
| `71_pipeline.md` | REFERENCE | none |
| `72_hauska_inc_operations.md` | REFERENCE | none |
| `72a_capital_raise_positioning.md` | REFERENCE | none |
| `72b_capital_readiness_audit.md` | REFERENCE | none |
| `73_partnerships.md` | REFERENCE | none |
| `74_commercial_agreements.md` | REFERENCE | none |
| `75_hauska_brokerage_workflow_plan.md` | REFERENCE | none |
| `75a_hauska_brief_extension.md` | REFERENCE | none |
| `75b_brief_coverage_v0.md` | REFERENCE | none |
| `75c_property_brief_data_backlog.md` | REFERENCE | none |
| `75d_property_brief_ui_replit_handoff.md` | REFERENCE | none |
| `75e_property_brief_collaboration_sharing_handoff.md` | REFERENCE | none |
| `75f_replit_ui_export_package_spec.md` | REFERENCE | none |
| `75g_investor_deal_radar.md` | REFERENCE | none |
| `75h_investor_deal_radar_launch_readiness.md` | REFERENCE | none |
| `75i_investor_radar_prelaunch_sprint.md` | REFERENCE | none |
| `75j_property_explorer_destination_ledger.md` | REFERENCE | none |
| `75k_max_map_quality_direction.md` | REFERENCE | none |
| `75l_cotality_data_stack_catalog.md` | REFERENCE | none |
| `75m_map_data_visual_benchmark.md` | REFERENCE | none |
| `75n_icc_code_connect_catalog.md` | REFERENCE | none |
| `75o_site_plan_export_spec.md` | REFERENCE | none |
| `76_empressa_wedge_90d_operating_plan.md` | REFERENCE | none |
| `76a_operator_autonomous_loops.md` | REFERENCE | none |
| `76b_gtm_engine_polish_sprint.md` | REFERENCE | none |
| `76c_operator_master_next_steps.md` | REFERENCE | none |
| `76d_gtm_data_package_go_to_market.md` | REFERENCE | none |
| `76e_platform_observability_sprint.md` | REFERENCE | none |
| `76f_investor_deal_radar_gtm.md` | REFERENCE | none |
| `76g_investor_radar_landing_and_webstore.md` | REFERENCE | none |
| `76h_property_explorer_gtm.md` | REFERENCE | none |
| `76i_smartsite_contribution_economy_roadmap.md` | REFERENCE | none |
| `76j_smartsite_launch_readiness_program.md` | REFERENCE | none |
| `77_place_graph_strategy.md` | REFERENCE | none |
| `77a_txcrg_crm_and_brokerage_ops.md` | REFERENCE | none |
| `77b_cotality_integration_strategy.md` | REFERENCE | none |
| `78_talent_education_graph.md` | REFERENCE | none |
| `78a_formation_pattern_outlier_ai_v1.md` | REFERENCE | none |
| `78b_formation_graph_atomization_plan.md` | REFERENCE | none |
| `79_competitive_execution_system.md` | REFERENCE | none |
| `79a_weekly_moat_scoreboard.md` | REFERENCE | none |
| `80_adrs/adr_002_replit_neon_migration.md` | REFERENCE | none |
| `80_adrs/adr_003_replit_neon_tactical.md` | REFERENCE | none |
| `80_adrs/adr_004_future_neon_provisioning.md` | REFERENCE | none |
| `80_adrs/adr_023_cortex_reporting_repo_designation.md` | REFERENCE | none |
| `90_operations/OPS-16_texas_market_plan_of_record.md` | REFERENCE | none |
| `90_operations/OPS-17_govtech_stack_plan_of_record.md` | REFERENCE | none |
| `90_operations/OPS-18_canon_reconciliation_plan_of_record.md` | REFERENCE | none |
| `AGENTS.md` | REFERENCE | none |
| `CLAUDE.md` | REFERENCE | none |
| `_smartcity_masters/00_README.md` | REFERENCE | none |
| `_smartcity_masters/31_smartcity_dashboards.md` | REFERENCE | none |
| `_smartcity_masters/32_smartcity_asset_management.md` | REFERENCE | none |
| `_smartcity_masters/33a_smartcity_plan_review.md` | REFERENCE | none |
| `_smartcity_masters/34_smartcity_smart_files_and_foundation.md` | REFERENCE | none |
| `_smartcity_masters/35_smartcity_positioning_framework.md` | REFERENCE | none |
| `_smartcity_masters/COPY_REVISIONS_home_variations.md` | REFERENCE | none |
| `_smartcity_masters/Pricing/00_pricing_basis.md` | REFERENCE | none |
| `_smartcity_masters/onepager_briefs/00_onepager_system.md` | REFERENCE | none |
| `_smartcity_masters/onepager_briefs/01_onepager_front_door.md` | REFERENCE | none |
| `_smartcity_masters/onepager_briefs/02_onepager_dashboards.md` | REFERENCE | none |
| `_smartcity_masters/onepager_briefs/03_onepager_plan_review.md` | REFERENCE | none |
| `_smartcity_masters/onepager_briefs/04_onepager_asset_management.md` | REFERENCE | none |
| `_smartcity_masters/onepager_briefs/05_onepager_smart_files.md` | REFERENCE | none |
| `_smartcity_masters/onepager_briefs/06_onepager_category_whitespace.md` | REFERENCE | none |
| `_smartcity_masters/onepager_briefs/07_front_door_model.md` | REFERENCE | none |
| `_smartcity_masters/onepagers_v2/00_README.md` | REFERENCE | none |
| `_smartcity_masters/onepagers_v2/01_smartcity_os_front_door.md` | REFERENCE | none |
| `_smartcity_masters/onepagers_v2/02_dashboards.md` | REFERENCE | none |
| `_smartcity_masters/onepagers_v2/03_plan_review.md` | REFERENCE | none |
| `_smartcity_masters/onepagers_v2/04_asset_management.md` | REFERENCE | none |
| `_smartcity_masters/onepagers_v2/05_smart_files.md` | REFERENCE | none |
| `_smartcity_masters/onepagers_v2/06_channel_briefing_whitespace.md` | REFERENCE | none |
| `_smartcity_masters/whitespace_package/00_INDEX.md` | REFERENCE | none |
| `_smartcity_masters/whitespace_package/01_category_whitespace_and_conviction_map.md` | REFERENCE | none |
| `_smartcity_masters/whitespace_package/02_research_battery_coverage_and_pitfalls.md` | REFERENCE | none |
| `_smartcity_masters/whitespace_package/03_R20_national_parcel_database_postmortems.md` | REFERENCE | none |
| `_smartcity_masters/whitespace_package/04_R11_api_access_absence.md` | REFERENCE | none |
| `_smartcity_masters/whitespace_package/05_R15_plan_review_cycle_times.md` | REFERENCE | none |
| `_smartcity_masters/whitespace_package/06_R16_records_request_burden.md` | REFERENCE | none |
| `_smartcity_masters/whitespace_package/07_R17_due_diligence_assembly_costs.md` | REFERENCE | none |
| `_smartsite_masters/00_README.md` | REFERENCE | none |
| `_smartsite_masters/01_smart_site_positioning.md` | REFERENCE | none |
| `_smartsite_masters/02_smart_site_market_white_paper.md` | REFERENCE | none |
| `_smartsite_masters/03_smart_site_white_paper_substance.md` | REFERENCE | none |
| `_smartsite_masters/04_smart_site_technical_white_paper.md` | REFERENCE | none |
| `_smartsite_masters/05_smart_site_product_walkthrough.md` | REFERENCE | none |
| `_smartsite_masters/06_smart_site_gtm_audiences_and_pricing.md` | REFERENCE | none |
| `_smartsite_masters/07_smart_site_faq_bizdev.md` | REFERENCE | none |
| `_smartsite_masters/08_smart_site_glossary_and_quick_reference.md` | REFERENCE | none |

## Mesh compile order

When building or grading an artifact:

1. Read npm `@empressaio/atom-contract@1.22.0` export surface.
2. Read `51_ingestion_pipeline_reference.md` for pipeline and check shape.
3. Read ADRs 001, 010, 011, 017, 018, 020, 021 for model disputes.
4. Read the store audit cited in D7 for production population and starvation. Do not classify that file here.
5. Read `40_rule_register.md` for executable rules and consumers.
6. Grade with `50_grading.md`.

## Pre-registered self-checks (R-01 remainder)

| Check | Result |
| --- | --- |
| **Wrong:** mesh indexes only markdown | **Rejected:** npm contract row is AUTHORITATIVE with section bindings |
| **Wrong:** a classified 60 is the canon set | **Rejected:** 60 was a curated subset of an unbounded set; listing `countTotal` is 238 |
| **Wrong:** store audit is an AUTHORITATIVE mesh row | **Rejected:** `_inbox` is out of the set; D7 cites it as a live-query artifact |
