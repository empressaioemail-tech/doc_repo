---
id: 24_adaptive_ui_vision
title: Adaptive UI — canonical vision
status: active
last_updated: 2026-06-13
applies_to: portfolio
related: [25_atom_architecture_reference, 26_atom_upgrade_guide, 09_post_saas_substrate_thesis, 28_mcp_first_product_design, 80_adrs/adr_001_atom_architecture, 48_codex_program_plan, 27_engine_evolution_plan, _prospects/mox/2026-06-13_mox_demo_build_plan, _research/2026-06-11_atom_connection_licensing_treatment_theory]
---

# Adaptive UI — canonical vision

> **Purpose.** The portfolio-wide vision for the adaptive interface: the consumption-and-presentation layer of the atom substrate. This folder is the canonical home. Reshaped 2026-06-13 to current brand and the live render-mode substrate from the older intelligence-interface vision lineage, which it supersedes. Companion docs: `design_system.md` (the living design language, grown from Chris's visual work) and `README.md` (the folder index and the pull-back loop).

## Why this is its own principle now

The backend is largely roadmapped: the spine is deployed, the atom contract is published, the reasoning engines are moving onto the gate. The leverage now moves to the surface, to how a person experiences the intelligence. Adaptive UI is the discipline for that surface, and it is portfolio-wide, not a single product feature. It is the visible payoff of the atom treatment.

## The one idea

The interface is not a fixed set of screens a user learns. A person expresses what they want to do, and the surface assembles the right components for that moment from the atom graph. Because every atom is self-describing (a machine-readable context interface plus five render modes), the interface can compose itself around intent instead of around a preset navigation tree.

## The substrate it stands on (current, verified)

- The atom contract is `@hauska/atom-contract` (Hauska substrate, ADR-018), published, and it enforces five render modes at compile time. If an atom type is missing a render mode, the build fails. The mode system is structural, not a guideline. See `25_atom_architecture_reference.md`.
- Five render modes: inline, compact, card, expanded, focus. Same atom, five densities.
- The governing rule, verbatim: windows pick modes; atoms do not know which UI they are in. A window (a Cortex surface, the Mox command center, the browser extension) decides how to render an atom; the atom only knows how to draw itself at each density.
- Rendering is scope-aware: the same atom renders different content to different viewers (inspector vs citizen vs public; CEO vs accountant). Who is looking is a real design input, not a permission checkbox.
- `accessPolicy` on every atom is the private-vs-shared sovereignty boundary, enforced in the data and surfaced in the UI.
- Every output carries a reasoning chain, source citation, confidence, and timestamp (sell reasoning, not data). These four are first-class elements of every render mode, with one consistent visual treatment, not afterthoughts.

## The three dimensions of adaptivity

1. Intent-driven assembly. What components appear is chosen per intent. The same surface assembles differently for "show me this deal" than for "why is this flagged." Windows compose atom render modes in response to what the person is doing.
2. Role, context, and scope awareness. The whole surface adapts to who is looking and what they are doing, not just verbosity. The narrow version already lives inside Codex as the role-aware verbosity tier (CDX-12, trainee to senior, `48_codex_program_plan.md`). The portfolio vision is the broad version, where the surface itself composes for the viewer.
3. Learning over time. The software learns the person. Every confirm, edit, or reject at the point of work (the deposit loop) tunes what the surface shows and how confident it is. This is the same arrow-two calibration that earns confidence; it also personalizes the interface. It gets less wrong and more tailored with use.

## Why a competitor cannot bolt this on

The adaptive UI is only possible because the data is atomized. A normal app hardcodes screens because its data is inert. Self-describing atoms let the interface ask "given this intent and this viewer, which atoms matter and how should they show" and compose the answer. Strip the substrate and the adaptive UI collapses into a normal dashboard. This is Commitment 1 (AI-accessible by default) expressed at the presentation layer.

## One graph, many windows

Every product surface is a window over the same atom graph: Cortex, Codex, SmartCity OS, the Property Brief extension, the Revit Connector, and scoped tenants like Mox. They are not separate apps with separate component sets; they are windows composing shared atom render modes. Designing a render mode well once means every window that shows that atom inherits it. That is the leverage and the discipline. A one-off custom layout that does not fit the mode system is a smell.

## Cinematography is part of the model

Mode transitions are animated, not instant, and the animation signals relationship: an inline reference grows into a card in place; a card opens into focus as if the surface zoomed into the atom. Transitions are how a person keeps track of which entity they are looking at as modes change. They are a property of the rendering model, not decoration.

## Where it is being made real

- `mox_demo` is the first surface built deliberately as an adaptive interface (the adaptive command surface: express intent, components assemble), best foot forward, on a real Austin redevelopment. See `_prospects/mox/2026-06-13_mox_demo_build_plan.md`.
- The Cortex and Codex surfaces in `legacy-design-tools` already render atoms through the five modes today. They are the working reference.
- The Property Brief extension renders atoms from the API payload in the same mode system.

## The Chris loop

Chris (product designer) sharpens the visual expression of this vision in `mox_demo` and `legacy-design-tools`. His agent maintains a living design-system capture as it works, and those captures are pulled back into `design_system.md` here. The vision (this doc) is the why; the design system is the how, and it grows from real design work rather than being specified up front. See `README.md` for the pull-back process.

## Status

Active design workstream as of 2026-06-13. The vision is settled; the design system is being built. Adaptive UI is a standing principle that every product surface leans into going forward.

## Revision history

- 2026-06-13, created. Canonical home for the adaptive UI vision, reshaped to current brand and the live `@hauska/atom-contract` render-mode substrate. Supersedes the older intelligence-interface vision lineage (the intelligence-interface-vision-v4 source and the ECI-era atom rendering sections), which described the same idea in superseded terms.
