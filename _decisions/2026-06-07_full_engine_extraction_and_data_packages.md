---
decision_id: 2026-06-07_full_engine_extraction_and_data_packages
date: 2026-06-07
owner: Nick
status: active
related_canonical: [00c_portfolio_master_map, 56_engine_extraction_sprint, 55_spine_data_intelligence_stack, 08_tiered_access_model, 14_pricing_framework, 27_engine_evolution_plan, 54_tenant_leg_sprint]
related_adr: [80_adrs/adr_008_engine_factor_out, 80_adrs/adr_005_multitenancy]
---

## Decision

Two committed directions, recorded together because they are the same thesis (one spine controls all apps' intelligence and data) seen from the architecture side and the commercial side.

**A. Full engine extraction.** The property/parcel, site-context, hydrology, finding/briefing, plan-set decomposition, and precedence engines are extracted out of cortex-api into the Hauska spine. Home: the `hauska-engine` repo gains a new `engine-api` service plus `packages/engine-core` and `packages/adapters`; the existing `retrieval-api` service stays read-only and reasoning-free. cortex-api thins to a product BFF (UI, session, auth) with no engines. Every app (Cortex, Codex, Brief extension, SmartCity) consumes the spine through the one MCP gate. There is no ungated path to an engine.

**B. Data-package tier model.** The tier model is reframed from a one-dimensional Layer-1-free / Layer-2-paid split into composable data packages (subsurface, hydrology, parcel/property, code/plan-review, environmental) crossed with the access layer (Layer 1 free public baseline, Layer 2 paid calibrated reasoning). Packages are persona-agnostic because buyers overlap (a landman is also a broker). The gate enforces accessPolicy + package-entitlement + tier. This reshapes Decision B's generic price points.

## Two binding conditions (from the pre-mortem)

1. **Packages sell reasoning, not raw data.** Each package's Layer 2 is calibrated, cited reasoning over its domain; the raw national/federal data underneath (SSURGO, USGS, FEMA, code text) stays Layer 1 free. A package must never degrade into a raw-data resale SKU. This keeps structural commitment 1 intact.
2. **Sequence the lift; do not stack it on a live migration.** Scaffold the engine home now (parallel-safe). The physical lift is sequenced behind M-Stabilize Phase 2C, which is verified NOT started (the SmartCity Neon cutover has not begun; production is still `smartcity-api-00104-taw`). ADR-008 itself warns against stacking a structural refactor on a live migration (the Track B saga). The in-flight cortex-api builds (subsurface adapters merged in PR #145, plan-set decomposition pending a rebase) are interim and become migration cargo, not waste.

## Context

The 2026-06-07 spine analysis ([`55`](../55_spine_data_intelligence_stack.md)) plus the consumption/gating discussion established that cortex-api wears two hats: it is the product backend for Cortex/Codex AND the home of the shared engines. That conflation is why only external agents route through the gate today while the first-party apps reach around it. The operator's call: extract all engines so the spine, not a product app, owns the intelligence, and there is no ungated path. This is ADR-008's original intent, now committed rather than deferred. The data-package reframe is the commercial expression of the same single-spine control: one gate entitles any buyer to any composition of packages.

## Structural commitment check

Pre-mortem run 2026-06-07: GREEN. Partnership-first and cost-per-jurisdiction clean (extraction is architecture; accessibility/subsurface data is national public-records product-baseline; zero new jurisdiction onboarding). Dual-interface and Hauska-spine strongly served (this is the MCP-first one-spine thesis realized). Quality gate green (the gate centralizes provenance). Sell-reasoning green under condition 1. Focus-queue operational yellow, mitigated by condition 2 (scaffold now, lift after 2C).

## Reasoning

Building the apps on a clean spine boundary is worth more than the attention saved by deferral, and the boundary is load-bearing for every surface. The freeze was the wrong tool; sequencing is the right control. Extracting also removes the backdoor problem entirely: with no engine left in cortex-api, there is nothing to lock, and the gate is unambiguously the one control plane. The data-package model lets a single buyer compose exactly the intelligence they need across domains, which is what one spine controlling many apps' data is for.

## Reversal criteria

Re-freeze the lift (not the scaffold) if extraction work starts pulling cc-agent or operator attention off the wedge ship before Cortex and the extension are in iterated beta, or if M-Stabilize Phase 2C slips far enough that opening the lift would fragment focus. Revisit the data-package model if package entitlement proves to create unmanageable gate-enforcement overhead, or if the reasoning-not-raw-data line cannot hold commercially (in which case escalate, do not quietly ship raw-data SKUs).

## Dependencies

Amends ADR-008 (extraction committed; gate-front seam = step 1; cortex-api to BFF) and the [`2026-06-07 gate-front-seam scoping decision`](2026-06-07_adr008_gate_front_seam_scoping.md) (seam now applies to all apps, not only cross-tenant). Operationalized by [`56_engine_extraction_sprint.md`](../56_engine_extraction_sprint.md). Reshapes [`08_tiered_access_model.md`](../08_tiered_access_model.md) and Decision B in [`14_pricing_framework.md`](../14_pricing_framework.md). Gated on M-Stabilize Phase 2C ([`30a`](../30a_smartcity_stabilization_sprint.md), not started).

## Counterparties

Internal. Affects cc-agent-E (engine home scaffold + corpus), cc-agent-C / cc-agent-C2 (the migration cargo), and the cortex-api BFF thinning.
