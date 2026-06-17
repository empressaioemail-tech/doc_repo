---
id: 2026-06-17_cc-agent-M_map_layer_gate_exposure
title: cc-agent-M — expose the layer-data capability through the gate with tenant/product entitlement (hauska-mcp-server)
date: 2026-06-17
agent: cc-agent-M
repo: hauska-mcp-server
kind: dispatch
related: [75i_investor_radar_prelaunch_sprint, _decisions/2026-06-17_map_extraction_shared_capability, 2026-06-17_cc-agent-E_map_layer_capability_extraction, 80_adrs/adr_017_atom_access_control]
blocked_on: the cc-agent-E layer-capability extraction (consumes its contract). Coordinate the request/response shape with E.
---

# cc-agent-M — map layer capability: gate exposure + entitlement (75i task 11)

Single owner of `hauska-mcp-server`. Decision: [`_decisions/2026-06-17_map_extraction_shared_capability.md`](../_decisions/2026-06-17_map_extraction_shared_capability.md). The layer-data capability cc-agent-E lifts to the spine must be reachable by Cortex, the extension, SmartCity, and Mox through the gate, under entitlement.

Model (HR-12): Grok Build 0.1 default.

## The work

1. **Expose the layer capability as a gate-fronted tool/route** (the same gate that fronts the 57-tool surface), so any product key can request parcel-keyed layers.
2. **Enforce entitlement at the gate**: accessPolicy + product-key + tenant scope per request. The Max-tier entitlement gates the rich layer set; SmartCity tenants see only their tenant-scoped layers. **Never serve layers cross-tenant** (the recently closed isolation leak is the cautionary case; this is a hard requirement, not best-effort).
3. **Make it MCP-consumable** (dual-interface, commitment #4): the capability is an agent-callable tool, not only a UI backend.

## Constraints

Auth via `X-Hauska-Key` (not Authorization Bearer; wrong header silently falls through to product:"public"). Tenant-private layers never pool or leak across tenants. Verbatim output in the report.

## Report back

`P:/doc_repo/_inbox/2026-06-17_hauska-mcp-server_cc-agent-M_map_layer_gate_exposure_close.md` — the gate route/tool, the entitlement enforcement (accessPolicy + product-key + tenant scope), a cross-tenant denial proof, verbatim tests.
