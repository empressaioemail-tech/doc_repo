---
id: architecture_homes_overview
title: Architecture homes — the standard and overview
status: active
last_updated: 2026-06-21
applies_to: portfolio
owner: nick
related: [architecture_homes_topology, architecture_homes_atoms, architecture_homes_mcp_gate, architecture_homes_audit_sequence, 80_adrs/adr_008_engine_factor_out, 56_engine_extraction_sprint, calibrated_spine_roadmap_overview]
---

# Architecture homes

This folder is the proposed standard for where every function lives, what every atom is, how the gate exposes us to agents, and the audit-first sequence that gets us there. It exists so the new architecture becomes the single source of truth with no confusion, and so we do not build further on a foundation that is still moving.

The Cortex redefinition override of ADR-008 was granted by the operator 2026-06-21 (decision record: [`_decisions/2026-06-21_adr008_cortex_reframe_override.md`](../_decisions/2026-06-21_adr008_cortex_reframe_override.md)). This folder is now the standard. The ADR-008 amendment that formally records it is a phase-2 doc-scrub deliverable; the scrub then propagates the standard across the doc set.

## The freeze

No new building until the audit completes and this standard is ratified. The audit (atom conformance across all families plus repo and naming cleanup) runs first; then a doc-repo scrub makes this the standard everywhere; then build resumes. This pauses the calibrated-spine build waves ([`calibrated_spine_roadmap`](../_calibrated_spine_roadmap/00_overview.md)) deliberately. Acquisition (already running) is the one exception; it continues, since its output lands in a bucket and does not depend on the homes being finalized.

## Catalog-thesis-check verdict (2026-06-21)

- Cortex reframe (product to reporting function package): CONFLICT requiring conscious override. ADR-008 defines Cortex as an Empressa design-accelerator product; this redefines the name as the reporting function package. The layer placement is fine (cortex-api stays a product-side BFF, not mislabeled as Hauska substrate). GRANTED by operator override 2026-06-21; ADR-008 amendment owed in phase 2.
- AEC-cortex (new architect product): aligned on layer (Empressa surface); record its MCP-first plan per ADR-028; resolve the naming overlap with cortex-api so there is one meaning of "Cortex."
- Surfaces as a repo classification: aligned.
- MCP gate-class rework: aligned (one server many tools per 51; public free Layer 1, paid Layer 2 per 08; read-contract-bearing tools serve commitment #1). Clarification: the gate class "codex" is not the whole Codex product; Codex spans the free public-catalog lookup and the paid codex review per the 2026-05-16 naming.
- User-generated tenant-private atoms: aligned with the tenant-sovereignty commitment.
- Audit-first freeze: aligned as a conscious sequencing decision.

## The override (granted 2026-06-21)

The Cortex redefinition is a conscious override of ADR-008, granted by the operator 2026-06-21. The ADR-008 amendment formalizing it is owed in phase 2 (doc-repo scrub). Everything else passed the thesis check.

## Index

- [`01_homes_and_topology.md`](01_homes_and_topology.md) — the homes, repo classifications, the Cortex reframe and AEC-cortex split, the map-to-reporting manifest contract
- [`02_atoms_lifecycle_ownership.md`](02_atoms_lifecycle_ownership.md) — the full atom vision, the conformance-target shape, the user-generated parcel/project atom lifecycle and download
- [`03_mcp_gate_and_agent_surface.md`](03_mcp_gate_and_agent_surface.md) — the gate-class rework, coverage tools, the third-party agent view and test harness
- [`04_audit_and_sequence.md`](04_audit_and_sequence.md) — the audit-first plan, repo and naming cleanup, the doc-repo scrub, and the build sequence
- [`05_scrub_tracker.md`](05_scrub_tracker.md) — the phase-2 doc-scrub worklist and per-doc status
