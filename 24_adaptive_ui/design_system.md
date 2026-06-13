---
id: 24_adaptive_ui_design_system
title: Adaptive UI — design system (living)
status: active
last_updated: 2026-06-13
applies_to: portfolio
related: [24_adaptive_ui_vision, 25_atom_architecture_reference, _prospects/mox/2026-06-13_mox_demo_build_plan]
---

# Adaptive UI — design system (living)

> **Purpose.** The living design language for the adaptive interface: how atoms render across the five modes, how reasoning, citation, confidence, and timestamp read, how the surface assembles and reflows, and the motion that carries it. This doc grows from real design work (primarily Chris's, captured in `mox_demo` and pulled back here). It starts as principles and fills in with components as they are designed. The why is in `adaptive_ui_vision.md`; this is the how.

## Status

Seeded 2026-06-13. Awaiting the first design captures from the Mox demo build. The component and motion sections below are placeholders to be filled as the work lands, via the pull-back loop in `README.md`.

## Principles (the floor)

- The four trust elements (reasoning chain, source citation, confidence, timestamp) have one consistent visual treatment across all five render modes. Confidence always carries its state (baseline / provenance-backed / earned-through-outcome); never a bare number shown as earned.
- The private-vs-shared boundary (`accessPolicy`) is visible and legible. A surface never implies a tenant's private data feeds anyone else.
- Windows pick modes; atoms do not know which UI they are in. Design a render mode once; every window inherits it.
- Assist-first: the surface helps first; capture is the byproduct. The deposit loop (confirm, edit, reject) is the core interaction. Design it to feel like assistance, never surveillance.

## Component language (to be filled)

- The five render modes per atom family (finding, code/reasoning, parcel, render-output, person/actor, deal/molecule): inline, compact, card, expanded, focus.
- The confidence, citation, and timestamp treatment.
- The action inbox / "needs your call" pattern.
- The adaptive command surface (intent bar plus assembly choreography).
- The spatial twin panel.
- The investor / data-room surface.

## Motion and cinematography (to be filled)

- Mode transitions (inline grows to card; card opens to focus).
- Assembly and reflow as intent changes.

## Revision history

- 2026-06-13, seeded as the living design-system home. Grows from Chris's captures via the pull-back loop (see `README.md`).
