---
decision_id: 2026-07-04_convergence_program_execution_model
date: 2026-07-04
owner: Nick
status: active
related_canonical: [00_current_state.md, _research/2026-07-02_ai_native_and_twin_review.md, _architecture_homes/00_overview.md, 54_tenant_leg_sprint.md, _inbox/2026-07-02_phase3_tenancy_sprint_plan.md]
---

## Decision

The convergence program is greenlit as the portfolio's active build arc, in dependency order: Phase 0 (rescue and truth reconciliation), Phase 1 (own the layer: single-chokepoint gate, metering live, atom spec published, MCP discoverability), Phase 2 (tenancy: the four-vertical gate), Phase 3 (surfaces: unified command center, hardened and renamed component library, console extraction), Phase 4 (monetization capture), with M1 calibration fuel and the Reeves skeleton as parallel tracks. Execution model: the planner (Claude, Fable, on the Claude Code Max plan) owns planning, dispatch authoring, adversarial review, live-prod verification, merges, deploys, and doc updates; Cursor agents own repo execution (headless via the cursor-agent CLI once installed, hand-carried dispatches until then); verification is never delegated to executors; Nick reviews phase exits and anything touching auth, billing, pricing, or public claims.

## Context

Nick asked what it would take to clean up, fix, and implement everything surfaced by the 2026-07-04 nine-repo audit and the strategy discussions that followed, running a multi-agent model with the planner conducting adversarial reviews. The audit established that the highest-leverage move is convergence (landing stranded work and reconciling three diverging copies of the truth) rather than new building, and that tenancy is the single primitive gating four verticals at once. The repo-intent review settled per-repo direction; this record captures the program frame and the fleet model. Alternatives considered: all-Claude execution (rejected on cost and because Cursor execution under precise dispatches is proven), all-Cursor including review (rejected because the adversarial gate on the Claude side is what has caught prod-killing defects pre-merge).

## Structural commitment check

Commitment 2 (confidence earned): the program keeps M1 on the critical path rather than deferring it. Commitment 4 (MCP-first): Phase 1 is its direct expression. Focus queue rule: the program IS the queue; verticals stay paper until their gates (tenancy, design partners) clear. Tenant sovereignty: Phase 2 is its build. Formal premortem-check runs against the Phase 0 execution plan in plan mode before any commit; this record notes that obligation rather than discharging it.

## Reasoning

Phase ordering follows dependency, not preference: nothing new builds on unreconciled ground (Phase 0 first), money and discoverability need only landing work (Phase 1), every vertical conversation converges on the tenant-private primitive (Phase 2 before vertical builds), and the surfaces Nick named (command center, component library) consume the tenancy and truth work (Phase 3). The fleet split matches observed strengths: Cursor agents execute well against precise dispatches with acceptance criteria and exit gates, and fail at planning altitude; the planner's adversarial-review gate has a track record of catching real defects before merge. Billing lands on existing subscriptions (Max plan for planning and review, Cursor for execution), making rate limits rather than dollars the binding constraint, which the phase-gated cadence absorbs.

## Reversal criteria

Revisit the fleet split if Cursor execution quality on precise dispatches falls below the pass rate the adversarial gate has historically shown, or if Max rate limits make the review cadence untenable for a time-critical phase (the overflow valve is metered API usage). Revisit phase ordering if the Cotality production-key cliff or the ICC term forces a Phase 4 artifact forward. The program itself is revisited if the hard-kill or focus-queue rules fire on any track.

## Dependencies

Depends on: Q-A/Q-B/Q-C rulings (2026-07-04_branding_canon_hauska_substrate_only, 2026-07-04_ldt_decomposition_retirement_path, 2026-07-04_icc_poc_play, 2026-07-04_master_map_and_console_unification), the cursor-agent CLI install (operator, in progress), the Phase 0 execution plan approval in plan mode. Depended on by: every Phase 0 through 4 dispatch, the Reeves skeleton thread (its contract extension is sequenced behind Phase 0's atom-contract cleanup: commit the 1.5.0 source, publish 1.6.0, then the O&G ontology lands as 1.7.0).

## Counterparties

Internal (Nick, planner, Cursor fleet). External parties appear per-phase: ICC (Phase 0/1 via the PoC play), Cotality (production keys), npm/registry ecosystem (Phase 1 discoverability).
