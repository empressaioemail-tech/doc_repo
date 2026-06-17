---
id: 2026-06-17_cc-agent-E_map_layer_capability_extraction
title: cc-agent-E — lift the layer-data assembly to a gate-fronted spine capability (hauska-engine)
date: 2026-06-17
agent: cc-agent-E
repo: hauska-engine
kind: dispatch
related: [75i_investor_radar_prelaunch_sprint, _decisions/2026-06-17_map_extraction_shared_capability, 24_adaptive_ui, 80_adrs/adr_008_engine_factor_out]
blocked_on: seam seal is DONE (#72/#183 live); E order is coverage driver-quality -> THIS. Also depends on the Wave 3 parcel-polygon + flood geometry (cc-agent-C task 3). Pairs with the cc-agent-M gate-exposure dispatch.
---

# cc-agent-E — map layer-data capability extraction (75i task 11)

Single owner of `hauska-engine`. Decision: [`_decisions/2026-06-17_map_extraction_shared_capability.md`](../_decisions/2026-06-17_map_extraction_shared_capability.md). This is the ADR-008 engine-extraction pattern applied to the map's layer assembly (`generate-layers`, which C3 kept cortex-side).

Model (HR-12): Grok Build 0.1 default.

## The work

1. **Lift the layer-data assembly** (parcel resolves to site-context geometry: parcel polygon, flood + floodway, DEM + topography, the OZ tract, zoning where present) from the cortex-api BFF to a **gate-fronted spine capability** consumable by any app through the seam. Do not host a Cortex-only endpoint; build the shared capability.
2. **Each layer rides the sealed `EngineEnvelope`** (from the seam-seal dispatch): data vintage + confidence-kind + degraded flag per layer, so the render component can surface them. No bare geometry.
3. **Coordinate the request/response contract with cc-agent-M** (gate exposure) and cc-agent-C (the cortex/extension consumer), so one parcel-keyed layer request serves Cortex, the extension, SmartCity, and Mox.

## Constraints

The capability is multi-tenant-bound at the gate (cc-agent-M enforces accessPolicy + product-key + tenant scope); never serve layers cross-tenant. Sell reasoning, not data: the capability emits cited, enveloped layers; the paid value (rendered spatially by the consumer) is the reasoning, not raw geometry. Verbatim output in the report.

## Report back

`P:/doc_repo/_inbox/2026-06-17_hauska-engine_cc-agent-E_map_layer_capability_close.md` — the capability contract (request + enveloped layer response), the surfaces lifted off the cortex BFF, the tenant-scope handoff to M, verbatim tests.
