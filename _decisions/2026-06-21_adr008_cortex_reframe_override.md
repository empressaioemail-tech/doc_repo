---
id: 2026-06-21_adr008_cortex_reframe_override
title: ADR-008 override — Cortex reframed from product to reporting function package
date: 2026-06-21
status: active
applies_to: portfolio
owner: nick
related: [80_adrs/adr_008_engine_factor_out, architecture_homes_overview, architecture_homes_topology]
---

# Decision: ADR-008 override — Cortex is the reporting function package

## Decision

"Cortex" is redefined from the Empressa design-accelerator product surface to the reporting function package; the codebase `cortex-api` keeps that name as the reporting engine (composes spine reasoning plus map layers plus atoms into reports; persists report runs; product glue). The architect tooling that "Cortex the product" used to mean (renders, design tools, deliverable UX) splits into a new product repo, `AEC-cortex` (placeholder name), which consumes our functions through the gate.

This consciously overrides the ADR-008 brand placement that lists Cortex as an Empressa design-accelerator product surface.

## Reasoning

cortex-api had accreted into the everything-BFF (brief, findings, site-context, drainage, encumbrances, calibration, warming) under a name meant for one product. Splitting its jobs to their proper homes (reasoning to the spine per sprint 56, spatial to hauska-map, plan review to Codex) leaves reporting as the coherent remaining role. Naming that role "Cortex" decouples the brand from the overreaching product and makes the topology legible. Ran through catalog-thesis-check 2026-06-21: layer placement is clean (cortex-api stays a product-side BFF, not mislabeled as Hauska substrate); the only conflict was the brand redefinition, which this record makes conscious.

## Scope and follow-ons

- The ADR-008 amendment formalizing this is a phase-2 doc-scrub deliverable.
- Resolve the two-Cortex naming overlap (cortex-api reporting vs AEC-cortex) in the amendment.
- L1 to L6 deliverable composition counts as reporting; AEC-cortex owns the architect UX and renders around it (recommendation, to be confirmed in the amendment).
- AEC-cortex, as a net-new product, records an MCP-first plan per ADR-028.

## Reversal criteria

Reverse if the reporting-vs-architect split proves to create more coupling than it removes (e.g., the deliverable composition cannot cleanly separate from the architect UX), or if "Cortex" as a function-package name causes more market confusion than the original product brand did. Re-evaluate at the phase-2 doc scrub before the amendment locks.
