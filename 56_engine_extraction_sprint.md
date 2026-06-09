---
id: 56_engine_extraction_sprint
title: Engine extraction sprint - engines out of cortex-api into the spine
status: active
last_updated: 2026-06-09
applies_to: hauska
owner: nick
related: [80_adrs/adr_008_engine_factor_out, _decisions/2026-06-07_full_engine_extraction_and_data_packages, _decisions/2026-06-07_adr008_gate_front_seam_scoping, 55_spine_data_intelligence_stack, 57_national_code_warming_sprint, 54_tenant_leg_sprint, 27_engine_evolution_plan, 30a_smartcity_stabilization_sprint, 00c_portfolio_master_map, _decisions/2026-06-09_codewarm_arrow_two_combined]
---

# Engine extraction sprint

> **What this is.** The operational plan to lift the reasoning engines out of cortex-api into the Hauska spine so the gate is the one control plane and no app reaches an engine ungated. Commits ADR-008 from "accepted, scheduled" into a sequenced sprint. Decision: [`_decisions/2026-06-07_full_engine_extraction_and_data_packages.md`](_decisions/2026-06-07_full_engine_extraction_and_data_packages.md).
>
> **Two binding conditions** (from the pre-mortem): packages/engines sell reasoning not raw data; and the physical lift is sequenced behind M-Stabilize Phase 2C (verified not started). Scaffold now, lift after 2C.

## Target architecture

```
  PRODUCT APPS (thin BFFs)        GATE                      SPINE
  Cortex / Codex SPA ─┐           hauska-mcp-server         hauska-engine repo
  Brief extension ────┼─ all ────→ resolve product+tenant   packages/
  SmartCity ──────────┘  through   +package+tier; enforce     corpus/        (here today)
  Revit add-in ───────┘  the gate  accessPolicy; meter;       adapters/      ← lift from cortex-api lib/adapters
                                   provenance                 engine-core/   ← lift from cortex-api lib/*-engine
                                                            services/
                                                              retrieval-api/ read-only (here today)
                                                              engine-api/    NEW reasoning service, gate-fronted

  cortex-api → product BFF only (UI/session/auth). No engines. No backdoor.
```

## What moves

| From cortex-api | To spine | Notes |
|---|---|---|
| `lib/adapters` (site-context federal/national/state/local + the merged subsurface set) | `hauska-engine/packages/adapters` | PR #145 subsurface is cargo |
| `lib/briefing-engine`, `lib/finding-engine` (+ plan-set decomposition, precedence) | `hauska-engine/packages/engine-core` | decomposition (b06d0ac, pending rebase) + precedence (Wave 2) are cargo |
| reasoning-atom corpus (web-first grounding cache) + adjudication ledger + calibration overlay | `hauska-engine/packages/engine-core` (corpus may split toward the retrieval layer) | the national code-warming substrate ([`57`](57_national_code_warming_sprint.md)); built in cortex-api now behind a clean package seam because capture + lineage live there and the spine reasoning engine-api is scaffold-only (#67); lifts with the finding engine in step 4. Spine substrate, not a Cortex feature; calibration is a spine-wide invariant ([`55`](55_spine_data_intelligence_stack.md) §7) |
| hydrology / drainage worker + site-topography | `hauska-engine/packages/engine-core` (+ pysheds sidecar in the engine image) | closes the pysheds-not-baked deploy gap in the new home |
| brief / engagement reasoning entry points | `hauska-engine/services/engine-api` | gate-fronted; cortex-api calls via the seam during transition |

Stays in cortex-api (becomes the BFF): UI serving, session/auth, snapshot/sheet/IFC upload intake (the Revit + extension ingress), product-specific glue.

## Sequence (execution order, dependencies named)

1. **Scaffold the engine home (now, parallel-safe).** Stand up `hauska-engine/services/engine-api` + `packages/engine-core` + `packages/adapters` skeletons and the gate-front seam contract. No code move. Owner: cc-agent-E. Depends on nothing. Dispatch: [`_dispatches/2026-06-07_cc-agent-E_engine_api_home_scaffold.md`](_dispatches/2026-06-07_cc-agent-E_engine_api_home_scaffold.md).
2. **Land the in-flight cargo.** Subsurface merged (PR #145). Rebase + land plan-set decomposition (dispatch: [`_dispatches/2026-06-07_cc-agent-C2_decomposition_rebase.md`](_dispatches/2026-06-07_cc-agent-C2_decomposition_rebase.md)). Build precedence (Wave 2) - it may target cortex-api still (cargo) or the engine home if scaffolded first; planner re-points at fire time.
3. **Lift adapters.** Move `lib/adapters` into `packages/adapters`; cortex-api imports from the spine package. Behavior-parity tests. Depends on step 1.
4. **Lift engine-core.** Move briefing/finding/hydrology/decomposition/precedence into `packages/engine-core`; expose via `engine-api`; gate-front. Depends on step 3 + the in-flight cargo landed.
5. **Cut consumers to the gate.** Each app consumes engine reasoning through the gate seam; lock cortex-api's direct engine routes. Depends on step 4 + the tenant-leg gate work ([`54`](54_tenant_leg_sprint.md)).
6. **Thin cortex-api to BFF.** Remove the now-migrated engine code; cortex-api is UI/session/auth + ingest only.

Steps 3-6 are gated behind M-Stabilize Phase 2C ([`30a`](30a_smartcity_stabilization_sprint.md)). Step 1 and the cargo (step 2) are safe now.

**Lift status (2026-06-08): 2C is MET, but hold the lift behind the deferred deploy.** The SmartCity migration closed Phase 2C, so the mechanical gate on steps 3-6 is cleared. The lift is nonetheless held, by planner recommendation, behind the build-out deploy (the multi-lane linchpin in [`00_current_state.md`](00_current_state.md)) for three reasons: (1) steps 3-6 pull engine code out of cortex-api, the exact surface the merged-but-undeployed build-out wave still occupies, so lifting now creates a moving-target / merge-conflict risk on cortex-api right as it needs a clean deploy; (2) deploy-first gives a known-good prod baseline to extract against, where lift-first ships the new architecture to prod untested; (3) step 5 ("cut consumers to the gate") is hard-blocked regardless of 2C, because the live gate cannot reach the engine yet — `HAUSKA_BACKEND_URL` is still a placeholder in the deployed mcp-server (verified 2026-06-08; see 76e finding 2), and you cannot cut consumers onto a gate that is not wired to the engine. Net: 2C cleared the mechanical gate; the deploy is the real gate for the lift's payoff. Scaffold (#67) and cargo (#145/#146/#147) are landed; the step-3 adapters dispatch is fire-ready the moment the deploy lands.

## Engine home decision

`engine-api` is a NEW service inside the existing `hauska-engine` repo, sibling to `retrieval-api`. Retrieval stays read-only and reasoning-free; engine-api is the LLM-driven reasoning tier. This matches ADR-008's original `services/engine-api` layout and keeps the "fetch atoms" vs "reason over atoms" separation clean, both behind the one gate.

## Risk and mitigation

- **Stacking on a live migration** (the ADR-008 Track B saga): mitigated by gating steps 3-6 behind M-Stabilize 2C; only the scaffold and cargo run now.
- **Moving-target extraction** while new engines are built in cortex-api: mitigated by landing the in-flight cargo first and re-pointing future engine dispatches at the home once scaffolded.
- **Cross-project hop** (gate in hauska-prod, engines moving to the spine): the seam is the transition bridge; once engines are in the spine the hop is internal to the spine.

## Dispatch index

| Dispatch | Repo | Owner | Step | Status |
|---|---|---|---|---|
| [`2026-06-07_cc-agent-E_engine_api_home_scaffold.md`](_dispatches/2026-06-07_cc-agent-E_engine_api_home_scaffold.md) | hauska-engine | cc-agent-E | 1 | FIRE-READY (parallel-safe now) |
| [`2026-06-07_cc-agent-C2_decomposition_rebase.md`](_dispatches/2026-06-07_cc-agent-C2_decomposition_rebase.md) | legacy-design-tools | cc-agent-C2 | 2 | FIRE-READY |
| [`2026-06-07_cc-agent-E_engine_lift_adapters.md`](_dispatches/2026-06-07_cc-agent-E_engine_lift_adapters.md) | hauska-engine | cc-agent-E | 3 | QUEUED - fire when 2C clears |
| [`2026-06-07_cc-agent-E_engine_lift_engine_core.md`](_dispatches/2026-06-07_cc-agent-E_engine_lift_engine_core.md) | hauska-engine | cc-agent-E | 4 | QUEUED - after adapters lift |
| [`2026-06-07_cc-agent-C_cortex_consume_spine_and_thin_bff.md`](_dispatches/2026-06-07_cc-agent-C_cortex_consume_spine_and_thin_bff.md) | legacy-design-tools | cc-agent-C | 5-6 | QUEUED - after engine-core parity + gate seam |

## Cross-references

- [`80_adrs/adr_008_engine_factor_out.md`](80_adrs/adr_008_engine_factor_out.md) - the ADR this operationalizes
- [`_decisions/2026-06-07_full_engine_extraction_and_data_packages.md`](_decisions/2026-06-07_full_engine_extraction_and_data_packages.md) - the commitment
- [`55_spine_data_intelligence_stack.md`](55_spine_data_intelligence_stack.md) - what the engines contain
- [`54_tenant_leg_sprint.md`](54_tenant_leg_sprint.md) - the gate tenant/seam work this cuts consumers onto
- [`30a_smartcity_stabilization_sprint.md`](30a_smartcity_stabilization_sprint.md) - M-Stabilize 2C, the lift gate

## Revision history

- **2026-06-09:** Reasoning/calibration substrate added as engine-core cargo. The national code-warming reasoning-atom corpus, adjudication ledger, and calibration overlay ([`57`](57_national_code_warming_sprint.md)) are built in cortex-api now behind a clean package seam (capture and lineage live there; the spine reasoning engine-api is scaffold-only #67) and lift with the finding engine in step 4; they are spine substrate, not a Cortex feature, and calibration is a spine-wide invariant ([`55`](55_spine_data_intelligence_stack.md) §7). Per [`_decisions/2026-06-09_codewarm_arrow_two_combined.md`](_decisions/2026-06-09_codewarm_arrow_two_combined.md). Note: the pre-existing 2026-06-08 lift-status note below still cites the `HAUSKA_BACKEND_URL` placeholder as the step-5 block, which the 2026-06-09 recon supersedes (gate wired); the operative block is now engine-api maturity. Left for the engine-track sweep.
- **2026-06-08:** Lift-status note added. M-Stabilize 2C met (SmartCity migration closed), so the mechanical gate on steps 3-6 is cleared, but the lift is held behind the deferred build-out deploy (moving-target risk on cortex-api; deploy-first baseline; step 5 hard-blocked by the unwired gate, `HAUSKA_BACKEND_URL` placeholder verified 2026-06-08). Step-3 adapters dispatch is fire-ready on deploy.
- **2026-06-07 (origin):** Filed to operationalize ADR-008 full extraction. Target architecture (engine-api in hauska-engine, cortex-api to BFF), what-moves table, six-step sequence (scaffold + cargo now; lift gated behind M-Stabilize 2C), engine-home decision, risks, dispatch index.
