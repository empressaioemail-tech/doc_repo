---
id: 2026-07-29_mcp_audit_pe_stack_gap
title: MCP audit — live tool surface vs the PE human stack (code-verified reality map)
date: 2026-07-29
status: reference (the map before the MCP build)
owner: nick
verified: read against live hauska-mcp-server + hauska-engine + PE code, NOT the README (which is a stale 5-tool v1)
related: [_STATE.md, 08_tiered_access_model, 75n_icc_code_connect_catalog, 25b_monetization_provenance_storage_stack]
---

# MCP audit — agent surface vs the human (PE) stack

Reality (code-traced): 69 tools across 4 gates (public 11 / codex 5 / reporting 46 / map 7), SDK-metered, deployed. README describes a stale 5-tool v1 — ignore it.

## WHAT'S REAL + WORKING
- METERING (outbound) is REAL — Stripe RETIRED; SDK money boundary (McpMeteringGate.authorizeCall) runs gate-then-serve, authorize-before-serve, paid-gate-only dynamic import. SDK_METERING=1 in prod. GAP: the money RAIL (Circle) is not provisioned (CIRCLE_* unset) — quota gating live, overage-charge/revenue-route honest-degrade to partial.
- ICC INBOUND METER is WIRED (the demo centerpiece the catalog said was "not yet live"): source-obligation-meter.ts accrues an ICC obligation on EVERY reference to an ICC-sourced atom, FREE TIER INCLUDED, before the paid early-return -> source_obligation_ledger (migration 009). Rates unset -> amount_minor null + grace_terms "pending-rate" (countable, honest). Detection is v1 heuristic (allowlist DID / adapter-looks-ICC / citation regex ICC|IBC|IRC|IFC).
- Exports (site-plan, terrain) + property brief have CLEAN agent parity.

## THE FIVE GAPS (human PE capability with no / partial agent equivalent)
1. NO ANONYMOUS GEOCODE FRONT DOOR (#1 blocker) — the whole public catalog is keyed on parcel_node_id; an agent starting from "123 Main St" cannot resolve address->parcel without a PAID reporting key (resolve_place). Humans get free geocode in PE. The front door is locked for an agent's first step. Small, highest-leverage fix.
2. NO CONSOLIDATED parcel-facets TOOL — humans get the whole inspect card (zoning+setbacks+buildable+land-use+acreage+flood) in one call; agents must stitch get_property_atom_chain + place layers and still can't cleanly get land-use/acreage/flood. A get_parcel_facets(parcel_node_id) closes the everyday path.
3. FRAGMENTED FLOOD + NO BBOX HYDROGRAPHY/ROADS — hazard tool is Cotality-INERT; drainage is engagement-scoped (AEC-cortex), not parcel-addressable; the map-context layers we built for PE (hydrography, roads-near-bbox) have NO agent-callable equivalent.
4. DISCOVERY IS A CLIFF — agent points ChatGPT/Claude at /mcp, sees the free catalog via tools/list, but everything valuable 401s with NO self-serve surface saying a key exists or how to get one. Rich introspection is admin-only. No public catalog/manifest/OpenAPI page. Discovery-to-value is a wall.
5. ZERO VISUAL OUTPUT + NO SERVER-SIDE RENDERER — no MCP tool returns image content; exports return base64 CAD/PDF blobs an agent can't render; the map is a CLIENT-SIDE MapLibre renderer (pixels only exist in the browser); engine returns vector GeoJSON not raster. To return a rendered parcel IMAGE requires a NEW server-side rasterizer (headless MapLibre / static-map) that does not exist. NOTE: the site-plan PDF export DOES render server-side — may be leverageable for a parcel image faster than a full headless-MapLibre build.

## THE TWO THEMES
- MAKE THE FRONT DOOR WORK: anonymous geocode + consolidated facets + a discovery/catalog surface. Small, high-leverage — makes an agent able to start from an address, get the answer, and discover the API.
- MAKE IT OUTSTANDING: the server-side rendered IMAGE (the visual differentiator — nobody's property-MCP does this) + bbox map-context tools (hydrography/roads/topography by parcel not engagement).

## ICC-IN-MCP STATE
No dedicated ICC tool — ICC I-Codes flow as atoms through the generic catalog tools. Inbound obligation meter fires correctly (money-owed side safe). CAUTION (flagged, ICC verification pass checking it): accessPolicy gating is GENERIC not ICC-specific — the ICC adapter carries no explicit accessPolicy stamp; whether ICC text is correctly fenced as platform-internal rests on INGEST-TIME stamping the audit could NOT confirm. The don't-leak-licensed-text side needs a corpus-stamp check. (The ICC verification pass is checking this directly — it is the license-risk-right-now question.)

## Bottom line
The stack is more agent-ready than the README suggests (69 tools, real SDK metering, live ICC obligation ledger). The gap is the EVERYDAY FRONT DOOR (geocode + consolidated facets + discovery) and the VISUAL (no server-side renderer). Front-door fixes are small/high-leverage; the visual is a real but scoped build and the top differentiator.
