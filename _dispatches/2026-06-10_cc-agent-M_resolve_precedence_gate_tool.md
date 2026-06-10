---
id: 2026-06-10_cc-agent-M_resolve_precedence_gate_tool
title: Dispatch — resolve_precedence gate tool (S2, precedence moat productization)
date: 2026-06-10
agent: cc-agent-M
repo: hauska-mcp-server
kind: dispatch
status: QUEUED — fast-follow; fire AFTER the A2 engine-core lift (so the gate calls spine engine-api, not a legacy bypass) and S1 (production wire) lands
related: [58_gtm_readiness_sprint, 59_spine_moat_and_high_value_features, 03a_positioning_framework, 80_adrs/adr_021_constraint_resolution_and_precedence, _inbox/2026-06-10_legacy-design-tools_cc-agent-C2_precedence_gate_exposure_recon, _dispatches/2026-06-10_cc-agent-C_precedence_wire_finding_engine, 20_agent_operating_rules]
---

# resolve_precedence gate tool (S2) — the moat productization step

> The precedence recon ([`_inbox/2026-06-10_legacy-design-tools_cc-agent-C2_precedence_gate_exposure_recon.md`](../_inbox/2026-06-10_legacy-design-tools_cc-agent-C2_precedence_gate_exposure_recon.md) §2) designed this tool in full (inputs / output / envelope). This is recon slice **S2**: expose `resolve_precedence` (alias `reconcile_codes`) at the gate so an external/BYO agent can buy the reconciliation capability — the slogan made a callable product. **Not launch-gating** (fast-follow per sprint 58 moat #4), but high moat value. Fire AFTER the A2 engine-core lift so the gate calls the spine `engine-api`, not a legacy bypass, and after S1 ([`_dispatches/2026-06-10_cc-agent-C_precedence_wire_finding_engine.md`](../_dispatches/2026-06-10_cc-agent-C_precedence_wire_finding_engine.md)) wires the primitive into production.

You are **cc-agent-M**, single owner of `hauska-mcp-server` for this run. Model: **Grok Build 0.1**; escalate to Claude only on failure after retry, log it.

## Read first

1. [`_inbox/2026-06-10_legacy-design-tools_cc-agent-C2_precedence_gate_exposure_recon.md`](../_inbox/2026-06-10_legacy-design-tools_cc-agent-C2_precedence_gate_exposure_recon.md) §2 — the complete tool sketch (Zod inputs, output mapping, envelope); §3 case table for the honest capability scope
2. `hauska-mcp-server/src/atom-shape.ts` → `ToolEnvelope<T>` + `generateBriefEnvelope` (the envelope pattern to mirror)
3. `hauska-mcp-server/src/tools.ts` → `registerTools` (the registration pattern)
4. [`80_adrs/adr_021_constraint_resolution_and_precedence.md`](../80_adrs/adr_021_constraint_resolution_and_precedence.md) L82 — `resolve_constraints` is the broader Phase-2 tool; `resolve_precedence` is the narrower v1 code-standard slice
5. [`20_agent_operating_rules.md`](../20_agent_operating_rules.md) — HR-1, HR-2, HR-8

## Scope

1. **Register `resolve_precedence`** (alias `reconcile_codes`) as a gate tool calling the spine `engine-api` precedence endpoint (post-A2) — NOT a direct legacy-design-tools package import (no legacy bypass). Inputs per the recon's Zod sketch (`jurisdiction`, `domain`, optional `topic`, `requirements[]` OR `code_refs[]` with hydration, `project_facts`, `federal_preempts`, `evaluated_at`). Validation: require `requirements` OR `code_refs` (min 2 after hydration); hydrate shells via the engine's `codeSectionToRequirementShell` / `detectStandardDescriptor` when authority metadata is missing.
2. **Output + uniform provenance envelope.** Map 1:1 from the engine's `PrecedenceReconciliationResult` (reconciliations[], governing, compared, rule_applied, reasoning_chain, conflicts, citations, confidence, evaluated_at). Add `precedenceReconciliationEnvelope()` in `atom-shape.ts` mirroring `generateBriefEnvelope`: enumerate EVERY `compared[].atom_id` (governing + non-governing) into `atoms[]` as `did:hauska:code-section:{entityId}` with source/edition/verification, so lineage is complete for arrow-two. `meta.reasoning` carries rule_applied + precedence_steps + project_facts. **Rail-quiet (I7): `meta.calibration_grade = null` at launch (slot reserved); the grade stays out of buyer-facing output.**
3. **Product gate.** Layer 2, Cortex product key (same tier as plan-review reasoning per the capability matrix). Anonymous/public path does not get the reconciliation tool.
4. **Honest capability scope.** The tool reconciles federal accessibility + adopted model code + local amendments on the same dimension (what S1 wires). It does NOT do zoning (Layer 3) or CC&R cross-layer (S4/S5 unhandled). The tool description must not overclaim; if a caller passes incomparable cross-layer inputs, return `conflict-unresolved`, not a fabricated governing value.

Out of scope: jurisdiction auto-expansion (S3); the state-amendment-tier / zoning / CC&R matrix hardening (S4); full ADR-021 `resolve_constraints` (S5); the engine-side primitive (already exists; S1 wires it).

## Acceptance criteria

- `resolve_precedence` registered, calling spine `engine-api` (no legacy bypass); Zod inputs per the sketch; require-2 validation.
- Output maps from `PrecedenceReconciliationResult`; `precedenceReconciliationEnvelope` enumerates every compared atom into `atoms[]` (complete lineage); rail-quiet grade absent.
- Layer-2 product-key gated; anonymous denied.
- Tool description scoped honestly (no zoning/CC&R overclaim); incomparable input returns conflict-unresolved.
- A gate integration test: a multi-standard call returns the governing value + full reconciliation chain + every compared atom in `atoms[]`.
- CI green. PR held for operator merge. Verbatim verification artifacts (HR-8).

## Reporting

Write to `P:\doc_repo\_inbox\` as `2026-06-10_hauska-mcp-server_cc-agent-M_resolve_precedence_gate_tool.md`: the tool registration, the envelope output verbatim (showing complete `atoms[]` lineage + null grade), the integration-test output, PR URL + SHA, and blockers verbatim.
