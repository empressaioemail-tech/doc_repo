---
id: 2026-06-17_cc-agent-E_seam_seal_engine_envelope
title: cc-agent-E — seal the gate-front seam (EngineEnvelope + calibrated confidence) for the investor radar
date: 2026-06-17
agent: cc-agent-E
repo: hauska-engine
kind: dispatch
related: [75i_investor_radar_prelaunch_sprint, 61_property_intelligence_master_plan, _research/2026-06-11_engine_robustness_audit]
blocked_on: none. This GATES cc-agent-C task 3 (do not pour Cotality data until the seam is sealed). Coordinate the contract with C.
---

# cc-agent-E — seam seal (61 Wave 1)

Single owner of `hauska-engine`. Full spec: [`75i`](../75i_investor_radar_prelaunch_sprint.md) task 2. Evidence + the EngineEnvelope spec: [`_research/2026-06-11_engine_robustness_audit.md`](../_research/2026-06-11_engine_robustness_audit.md); wave board: [`61`](../61_property_intelligence_master_plan.md) Wave 1.

Model (HR-12): Grok Build 0.1 default.

## The work — seal the seam before data is poured

This is 61 Wave 1, pulled forward as a precondition for the investor radar's Cotality depth (C cannot pour data trustworthily onto an unsealed seam).

1. **Sealed `EngineEnvelope`** at the gate-front: one shape every engine surface emits, Zod-validated, enforced by a single `sealEnvelope()` as Express middleware on the engine route group, plus a CI contract test hitting all surfaces.
2. **Confidence drawn from `effectiveConfidence`** on the read path (the calibration engine already computes it; the wire never consults it). Mark `kind: calibrated | asserted | deterministic`. **No hardcoded `1.0`.** Until calibration is live, emit `asserted` with provenance, never a bare earned number (constitutional commitment #2).
3. **`dataVintage`** = upstream acquisition date, never fetch-time. **`coverage.degraded=true`** whenever any fallback fired (kill silent `status:ok` degradation).
4. Coordinate the contract shape with cc-agent-C so the brief path consumes the sealed envelope directly (confidence-kind + vintage + degraded surface through to the panel).
5. Engine-side for radar task 4: confirm the code/plan-review depth path emits cited rehab/add-unit reasoning; report whether **precedence** is still a prod no-op (61 audit) so C/planner can flag the gap.

## Constraints

Verbatim command output in the report. Tenant-private signal never pools into shared calibration.

## Report back

`P:/doc_repo/_inbox/2026-06-17_hauska-engine_cc-agent-E_seam_seal_engine_envelope_close.md` — the envelope schema, the surfaces brought under contract, the precedence verdict, verbatim CI/test output.
