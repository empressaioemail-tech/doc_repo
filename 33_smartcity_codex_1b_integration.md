---
id: 33_smartcity_codex_1b_integration
title: SmartCity OS — Codex 1b integration surface (stub)
status: stub
last_updated: 2026-05-11
applies_to: smartcity-os
related: [30_smartcity_os, 30a_smartcity_stabilization_sprint, 47_codex_plan_review, 48_codex_program_plan, 27_engine_evolution_plan, adr_001_atom_architecture, adr_007_cross_stakeholder_atom_access, adr_008_engine_factor_out]
---

# SmartCity OS — Codex 1b integration surface (stub)

> **Stub doc.** Canonical home for the SmartCity OS-side receiving
> surface that Codex 1b lands on (per `48_codex_program_plan.md`
> Phase 4). Full integration spec is deferred to a post-stabilization
> coordination session — both `30a_smartcity_stabilization_sprint.md`
> (this repo's side) and `48_codex_program_plan.md` (Codex track)
> need to reach their respective exit states before the interface
> details are pinned down. This doc exists now to claim the slot and
> capture what the surface needs to contain.

## Why this doc exists now

Codex Phase 4 (per `48_codex_program_plan.md`) ships Codex 1b — the
city-side standalone reviewer surface — into SmartCity OS's Plan
Review surface. SmartCity OS has no Codex/Cortex references in its
canonical docs today. The receiving surface needs a canonical home
on this side so:

- Codex Phase 4 has a concrete target to ship into
- The cross-track interface contract has a single source of truth
- Vocabulary cross-mapping (M4-B / PLR-1..28 / SD-1..8 / W1-W6 →
  CDX-*) has a place to land per the 2026-05-10 Codex housekeeping
  deferral

The SmartCity-internal M4-B / PLR / SD / W vocabulary stays canonical
SmartCity OS territory; this doc is the place where per-item
cross-mapping to Codex's CDX-* surface lives, plus the contract
details for how Codex 1b plugs into SmartCity OS's Plan Review.

## Scope of the full integration spec (to be authored later)

The full spec, when it lands, needs to cover:

1. **Atom-graph receiving contract.** How Codex-produced atoms (firm
   precedent atoms, per-reviewer learning atoms, audit-trail-anchor
   atoms, code-change-broadcast-event atoms — per
   `47_codex_plan_review.md`) are tenanted and stored when consumed
   in SmartCity OS's city-tenant context. Per ADR-007 cross-stakeholder
   atom access model.
2. **User-facing surface.** What "Codex 1b" looks like in the
   SmartCity OS Plan Review UI — embedded vs federated vs new
   top-level surface; navigation; permissions; reviewer workflow
   integration; relationship to the existing M4-B sprint catalog.
3. **Authentication and authorization.** Trust handoff between Codex
   firm-tenant context (when 1a feeds into 1b) and SmartCity OS
   city-tenant context. References ADR-007 access model and ADR-005
   multitenancy contract.
4. **Data flow and write boundaries.** Who writes what, who reads
   what, conflict resolution under concurrent reviewer activity,
   audit trail propagation.
5. **Vocabulary cross-mapping.** Per-item mapping of SmartCity OS's
   internal M4-B / PLR-1..28 / SD-1..8 / W1-W6 vocabulary to Codex's
   CDX-* feature set, deferred from the 2026-05-10 Codex housekeeping
   pass.
6. **Engine consumption.** How SmartCity OS consumes Hauska Engine
   per ADR-008 factor-out (post-Phase-2C unblock); whether direct
   embed, service call, or shared package. Coordinate with
   `27_engine_evolution_plan.md`.
7. **Federation with Compass AI.** Compass currently provides
   city-side knowledge federation per `30_smartcity_os.md`; the
   surface needs to define whether Codex 1b layers on Compass,
   replaces a sub-surface, or runs alongside.

## Dependencies before full spec can be authored

- `30a_smartcity_stabilization_sprint.md` exit (Empressa Neon
  cutover; multi-tenancy invariants verified; ADR-005 canonical)
- `48_codex_program_plan.md` Phase 3 or beyond (Codex 1a stable
  enough to define the firm-side contract that 1b consumes)
- ADR-008 engine factor-out in progress or complete (defines how
  the engine is consumed)
- A coordination session between the SmartCity OS track and the
  Codex/Cortex track planners

## What this doc is NOT

- Not a Codex feature list — see `47_codex_plan_review.md` and
  `48_codex_program_plan.md`
- Not the M4-B sprint catalog — that's `30_smartcity_os.md` AI Plan
  Review section (the M4-B / PLR / SD / W vocabulary stays
  SmartCity-internal per the 2026-05-10 Codex housekeeping decision)
- Not the engine factor-out plan — see `27_engine_evolution_plan.md`
  and `80_adrs/adr_008_engine_factor_out.md`
- Not a sprint plan — see `30a_smartcity_stabilization_sprint.md` for
  the active sprint on the SmartCity OS side

## References

- `30_smartcity_os.md` — product home, parent
- `30a_smartcity_stabilization_sprint.md` — sprint that must exit
  before this spec can be fully authored
- `47_codex_plan_review.md` — Codex product canonical
- `48_codex_program_plan.md` — Codex program plan (the Phase 4 that
  lands on this surface)
- `27_engine_evolution_plan.md` — engine evolution context
- `80_adrs/adr_001_atom_architecture.md` — atom contract
- `80_adrs/adr_007_cross_stakeholder_atom_access.md` — cross-stakeholder
  access model the integration operationalizes
- `80_adrs/adr_008_engine_factor_out.md` — engine factor-out
- `80_adrs/adr_005_smartcity_multitenancy.md` — multitenancy contract
  (queued for migration via `30a` WS-4 cross-cutting prereq;
  required for cross-tenant work)

## Revision history

- **2026-05-11 (origin):** Stub created during SmartCity OS
  Stabilization Sprint audit pass. Full integration spec deferred to
  post-stabilization coordination session.
