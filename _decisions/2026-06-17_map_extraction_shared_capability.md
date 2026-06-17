---
id: 2026-06-17_map_extraction_shared_capability
title: Decision — extract the Cortex map into a shared cross-app capability (Max-tier)
date: 2026-06-17
status: active
owner: nick
kind: decision
related: [75i_investor_radar_prelaunch_sprint, 75g_investor_deal_radar, 24_adaptive_ui, 08_tiered_access_model, 80_adrs/adr_008_engine_factor_out, 80_adrs/adr_018_atom_contract_substrate_layer]
---

# Decision: extract the map into a shared cross-app capability

## Decision

The Cortex map (the spatial render of site-context layers) is added to the investor radar v1 as a **Max-tier** feature and is **extracted into a shared capability** rather than forked per app. Extraction is in two layers:

1. **Layer-data capability.** The layer assembly (parcel resolves to site-context geometry: parcel polygon, flood and floodway, DEM and topography, the Opportunity-Zone tract, zoning where it exists) lifts from the cortex-api BFF to a **gate-fronted spine capability**, consumable by every app through the seam. This is the ADR-008 engine-extraction pattern applied to `generate-layers` (which the C3 cut deliberately kept cortex-side; this is the next extraction).
2. **Render component.** The map viewer becomes a **shared, publishable frontend package**, peer to the `@hauska/atom-contract` extraction, embedded by Cortex, the investor extension, SmartCity OS, and the Mox portfolio view.

## Context

The operator added the map to v1 (predicting it is the highest-conversion tool in the Max stack) and asked whether it must be extracted to use across apps, naming SmartCity as the next consumer. It must, or it gets forked three times. This is the adaptive-UI render-mode thesis ([`24_adaptive_ui`](../24_adaptive_ui/adaptive_ui_vision.md)) made concrete: one layer-render mode, consumed everywhere.

## Binding constraints (from the 2026-06-17 pre-mortem)

- **Sell reasoning, not data (commitment #1).** The Max map's paid value is our cited reasoning rendered spatially (verdicts, findings, the floodway-versus-buildable analysis, the OZ tax reasoning, pinned to locations), with the base geometry, especially the free federal layers (FEMA, OZ, USGS), as the canvas. It is never sold as raw-geometry display ("here is the parcel on a map"). Specced this way it sells reasoning, not data.
- **Confidence earned (commitment #2).** Each layer rides the sealed `EngineEnvelope`; the render component surfaces each layer's data vintage and confidence-kind. No geometry presented as bare authority.
- **Tenant sovereignty (commitment #7 gate).** The shared layer capability is multi-tenant (SmartCity), so it enforces accessPolicy plus product-key plus tenant scope at the gate, per request. It never serves layers cross-tenant. Same pattern as the existing 57-tool gate surface; a hard build requirement given the recently closed isolation leak.

## Placement and ownership

The capability belongs on the spine and gate (shared substrate), the component in a shared package, decided against the target topology, not where `generate-layers` sits today. Backend extraction: cc-agent-E (lift the layer assembly to the seam) plus cc-agent-M (gate exposure with tenant/product entitlement). Render component: the consuming agents build a rough render now; Chris polishes it into the shared package later (he is on Mox). Dependency: the Wave 3 parcel-polygon and flood geometry land first.

## Reversal criteria

- If the extraction proves heavier than a per-app render and SmartCity slips, fall back to a cortex-api-hosted layers endpoint the extension calls directly, with the shared package deferred (accepting the fork risk).
- Promote this record to an ADR (peer to ADR-008) when SmartCity consumes the shared capability, since at that point it is settled cross-product architecture.

## Status

Active. Captured in [`75i`](../75i_investor_radar_prelaunch_sprint.md). Candidate for graduation to an ADR on SmartCity consume.
