---
decision_id: 2026-07-04_master_map_and_console_unification
date: 2026-07-04
owner: Nick
status: active
related_canonical: [_decisions/2026-06-17_map_extraction_shared_capability.md, _decisions/2026-06-18_map_engine_maplibre_cotality_national.md, 80_adrs/adr_024_shared_surface_package_architecture.md, 75k_max_map_quality_direction.md]
---

## Decision

One component library feeds multiple surfaces: hauska-map's two overlapping operator consoles (the root vanilla-JS spine console and apps/command-center) unify into a single command center app built on the library; map-renderer becomes the single master map and data-viz component, with its LAYER_REGISTRY extended to carry every layer family (real estate, hazard, oil and gas, city) and its allocation made data-driven so the command center sets per-app allocation policy (what each app may show) and each app toggles within its allocation (what it does show); the SLB demo and Reeves skeleton visualizations register layers into the same registry rather than forking; 3D subsurface rendering (wellbore laterals) is the one genuinely new extension and lands with the Reeves skeleton; the Empressa Trading console stays separate, sharing only the atom spec.

## Context

Nick asked whether the unified command center covers both the current command-center objective and the component library, whether the current map and the SLB demo map can merge into one master component with two-level toggle control, and whether the trading console should stay separate. The 2026-07-04 audit verified against origin/main that map-renderer already ships LAYER_REGISTRY (20 layer keys) and resolveLayerAllocation with per-app, per-report, per-tier gating, so the asked-for architecture exists in embryo. The alternative of one mega-app covering operator and customer surfaces was rejected in favor of one library, several surfaces.

## Structural commitment check

Commitment 1 (sell reasoning): supports, the binding map spec remains cited reasoning rendered spatially, never raw geometry. Commitment 4 (dual interface): supports, allocation policy served from the spine is gate-consumable. Focus queue: the 3D extension is explicitly sequenced with the Reeves skeleton, not opened as a separate workstream. No premortem yellow; formal premortem-check runs with the Phase 0 execution plan.

## Reasoning

The command center and the Cortex console are different surfaces built from the same parts bin, so unifying the two operator consoles removes duplication (mcp-inspector, atom-browser, and run-monitor panels exist in both stacks today) without conflating operator and customer products. Extending one registry beats forking per vertical because layer semantics, entitlement gating, and confidence rendering are identical machinery across industries; only the layer families differ. Externalizing allocation into spine-served config turns per-app hardcoding into policy the command center can administer, which is the two-level control Nick asked for. The trading console stays separate because it is a different venture on its own infrastructure with a different risk profile; the atom spec is the correct and only shared surface.

## Reversal criteria

Revisit if the O&G layer families prove too structurally different for one registry (the 3D subsurface spike failing to compose with the 2D registry would be the signal); if spine-served allocation config adds a latency or availability dependency that surfaces cannot tolerate; or if Nick decides the trading venture should converge on shared surfaces after all.

## Dependencies

Depends on: the Reeves skeleton (3D extension, O&G layer families), Phase 3 (console unification and library hardening), the package rename (2026-07-04_branding_canon_hauska_substrate_only). Depended on by: the Reeves viz slice, the ICC PoC command-center metering view (2026-07-04_icc_poc_play), the eventual SmartCity rebuild.

## Counterparties

Internal. Affects Chris (library consumer) and the Reeves skeleton fleet.
