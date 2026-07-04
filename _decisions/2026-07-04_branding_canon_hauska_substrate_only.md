---
decision_id: 2026-07-04_branding_canon_hauska_substrate_only
date: 2026-07-04
owner: Nick
status: active
related_canonical: [80_adrs/adr_008_engine_factor_out.md, 80_adrs/adr_018_atom_contract_substrate_layer.md, _decisions/2026-06-17_map_extraction_shared_capability.md, _catalog/atoms_index.md]
---

## Decision

Hauska branding is reserved exclusively for true substrate (the atom contract, the Hauska SDK, the Hauska Engine, the Hauska MCP Server gate); every product surface brands Empressa or SmartCity, and the six surface packages currently published under the @hauska npm scope (design-tokens, tile-shell, document-viewer, cortex-client, cortex-tiles, map-renderer) rename to the @empressaio scope during the Phase 3 library hardening.

## Context

The 2026-07-04 repo-intent review surfaced persistent Hauska/Empressa naming crossover. Nick ruled that the SDK and its substrate peers are the only true Hauska-branded components. The component library shipped days earlier under @hauska/* with exactly one internal consumer, making a rename nearly free now and expensive later. The alternative considered was accepting @hauska/* as a shared-package convention; rejected because it erodes the brand boundary ADR-008 established.

## Structural commitment check

Commitment 1 (sell reasoning): neutral. Commitment 4 (dual interface): neutral. Brand placement discipline per ADR-008: directly supports. No premortem yellow; formal premortem-check runs with the Phase 0 execution plan.

## Reasoning

ADR-008 separates Hauska (commercial substrate, Hauska Inc.) from Empressa (product surfaces). The component library is surface tooling consumed by product apps, so @hauska/* misplaces it. map-renderer renames with the rest because the rendering component is surface; the layer data and allocation policy it consumes remain Hauska-side at the gate and engine, preserving the substrate boundary where it actually is. Renaming while the only consumer is the Cortex console keeps the churn to one repo plus the publish workflow.

## Reversal criteria

Revisit if an external consumer adopts the @hauska/* packages before Phase 3 executes the rename, or if map-renderer evolves into a gate-served substrate capability rather than a rendering surface, in which case map-renderer alone stays @hauska.

## Dependencies

Depends on Phase 3 of the convergence program (2026-07-04_convergence_program_execution_model). The Cortex console extraction (2026-07-04_ldt_decomposition_retirement_path) consumes the renamed packages. The @empressaio scope already exists per the 2026-05-18 ECI registry naming decision.

## Counterparties

Internal. Affects Chris (design system onboarding packet references @hauska/* names and needs an update when the rename lands).
