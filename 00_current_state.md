---
id: 00_current_state
title: Current state snapshot — 2026-05-11
status: active
last_updated: 2026-05-11
applies_to: portfolio
related: [11_roadmap, 30a_smartcity_stabilization_sprint, 27_engine_evolution_plan, 42_design_accelerator_program_plan, 48_codex_program_plan]
---

# Current state snapshot

> **Read me first.** Per [`90_runbooks/current_state_protocol.md`](90_runbooks/current_state_protocol.md). Regenerated at every session close. Pointer doc — for full context, follow links into canonical docs.

## 1. Active fires

- **Fire 2** — plaintext secrets in `.replit`. Internal items absorbed into [`30a`](30a_smartcity_stabilization_sprint.md) WS-3; external rotations (Esri, Verkada, Calendar API, VFD) held for Bastrop IT engagement. Owner: Nick + agent.
- **Fire 3** — legacy-design-tools `post-merge.sh` Neon-guard verification. Open. Owner: Nick (browser). Likely moot after [`42`](42_design_accelerator_program_plan.md) Phase 1 clears.

(Fire 1 closed 2026-05-10. Fire 4 closed pending workspace rename. Fire 5 closes at M-Stabilize Phase 2C cutover.)

## 2. In-flight sprints

- **[`30a_smartcity_stabilization_sprint.md`](30a_smartcity_stabilization_sprint.md)** — SmartCity OS — phase 0 of 4 — last update 2026-05-11
  - Owner agent: TBD (4 workstreams: WS-1 migration spine, WS-2 W1 sprint, WS-3 security, WS-4 schema/multi-tenancy)
  - Status: pending across all workstreams; cross-cutting prereqs need clearing before Phase 2A dispatches fire
  - Path to: M-Stabilize

- **[`27_engine_evolution_plan.md`](27_engine_evolution_plan.md) + [`42_*`](42_design_accelerator_program_plan.md) + [`48_*`](48_codex_program_plan.md)** — Codex/Cortex track — Phase 1 across both program plans — last update 2026-05-11
  - Owner agent: TBD (multi-stream: 27-A through 27-G plus DA-1..DA-Test-Iso plus CDX-Phase1-*)
  - Status: pending — Phase 1 streams ready to dispatch (27-G brand migration gated on PR #17)
  - Path to: M-CortexQA, M-CodexQA

## 3. Open ADRs to be aware of

- **ADR-005** multitenancy — queued migration; gates M-Stabilize done criterion #5; [`30a`](30a_smartcity_stabilization_sprint.md) WS-4 cross-cutting prereq
- **ADR-006** schema migration framework — drafted under [`30a`](30a_smartcity_stabilization_sprint.md) WS-1 Phase 3 (Drizzle migrate adoption)
- **ADR-007** cross-stakeholder atom access — active; property-as-tenant; informs M-PropIntel and 1b cross-tenant
- **ADR-008** Hauska Engine factor-out — active; gated on M-Stabilize Phase 2C closure
- **ADR-009** firm tenancy — deferred until [`48`](48_codex_program_plan.md) Phase 5 (1a return)

## 4. Agent fleet assignments

- **claude.ai planner (orchestrator)** — portfolio-wide planning, cross-track audit, roadmap maintenance, session-close orchestration
- **claude.ai planner (smartcity thread)** — [`30a`](30a_smartcity_stabilization_sprint.md) execution dispatches
- **claude.ai planner (codex/cortex thread)** — [`27`](27_engine_evolution_plan.md) / [`42`](42_design_accelerator_program_plan.md) / [`48`](48_codex_program_plan.md) execution dispatches
- **cc-agent-1..4** (Cursor Claude Code) — workstream execution; soft specialization per repo
- **cursor-manual** — Nick's keyboard for ambiguous fixes
- **replit-agent** — Replit-local ops; not for shipping code (per HR-2)
- **Nick** — merge button, deploy button, decisions

## 5. Recent session summaries (last 5)

- **2026-05-11 — Orchestrator: roadmap revision + orientation runbooks** — milestone framing landed; snapshot pattern adopted; session-close template updated.
- **2026-05-11 — Codex/Cortex program plans** — 27 + 42 + 48 drafted with audit pass; Stream G brand migration added; DA-Test-Iso added.
- **2026-05-11 — SmartCity Stabilization Sprint finalized** — 30a + 33 stub landed; cross-track interfaces sectioned.
- **2026-05-10 — Phase 1B Stage 1 verified + Fire 4 PR merged + neon migration runbook**
- **2026-05-10 — Codex launch (fabric thesis, two ADRs, vocabulary cross-mapping)**

## 6. Cross-cutting watch list

- **Brand migration** (Plan Review → Codex; Design Accelerator → Cortex) — [`27`](27_engine_evolution_plan.md) Stream G; gated on legacy-design-tools PR #17 landing
- **M4-B → Codex 1b interface** — stub at [`33_smartcity_codex_1b_integration.md`](33_smartcity_codex_1b_integration.md); full spec deferred to post-M-Stabilize coordination
- **Test isolation patterns** — [`42`](42_design_accelerator_program_plan.md) DA-Test-Iso (legacy-design-tools) and [`30a`](30a_smartcity_stabilization_sprint.md) WS-4 (smartcity-os MyGov audit) are the same footgun shape across two repos; coordinate findings
- **Migration sprint Phase 2** absorbed into [`30a`](30a_smartcity_stabilization_sprint.md) WS-1; [`12_migration_sprint.md`](12_migration_sprint.md) retains canonical phase definitions
- **ADR-005 + ADR-006** authoring pending in active sprints

## References

- [`11_roadmap.md`](11_roadmap.md) — full backlog + milestone roadmap (end-state definition lives here)
- [`30a_smartcity_stabilization_sprint.md`](30a_smartcity_stabilization_sprint.md), [`27_engine_evolution_plan.md`](27_engine_evolution_plan.md), [`42_design_accelerator_program_plan.md`](42_design_accelerator_program_plan.md), [`48_codex_program_plan.md`](48_codex_program_plan.md) — active sprint/program docs
- [`90_runbooks/current_state_protocol.md`](90_runbooks/current_state_protocol.md) — protocol for this snapshot
- [`_sessions/`](_sessions/) — full session history
