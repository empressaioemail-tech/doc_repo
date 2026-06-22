---
id: architecture_homes_mcp_gate
title: MCP gate rework and the third-party agent surface
status: active
last_updated: 2026-06-21
applies_to: portfolio
owner: nick
related: [architecture_homes_overview, 50_hauska_mcp_server, 52_mcp_offer_and_buildout, 28_mcp_first_product_design, 08_tiered_access_model]
---

# MCP gate rework and the third-party agent surface

The MCP server is the gate and the single door for third-party agents; the buyer is the agent operator, so this is the product. It stays one server with many tools (per sprint 51); what changes is the product-gate grouping and the tool coverage.

## Gate-class rework

From public / codex / cortex (where "cortex" did triple duty) to product gates that match the homes:

| Product gate | Tools | Home | Tier |
|---|---|---|---|
| public (catalog) | search_atoms, get_atom, query_jurisdiction, search_permit_atoms, list_jurisdictions, plus the new atom-trace and read-contract reads | Spine catalog | Layer 1 free, anonymous OK |
| codex | finding generation, override write, briefing fetch, snapshot ingest | Plan review | Layer 2 paid |
| reporting | generate_property_brief, get_brief_run, search_encumbrances, get_restrictions, get_property_detail, get_replacement_cost, deliverable tools | Reporting | Layer 2 paid |
| map | get_parcel_polygon, simulate/get_site_drainage, get_site_topography, get_hazard_profile, GIS layer + composite tools | Spatial / map | Layer 2 paid |

Clarification carried from the catalog-thesis-check: the gate class "codex" is not the whole Codex product. Codex spans the free public-catalog lookup (code intelligence) and the paid codex review, per the 2026-05-16 naming. The gate rename must not fracture that.

Auth and gating are unchanged in mechanism: `X-Hauska-Key` resolves product, tenant, and tier; no header is anonymous public; unknown or malformed keys 401; gating is enforced at call time, not list time.

## Coverage fixes (what makes it truly agent-consumable)

- `get_atom` and the catalog tools return the read-contract object (n, width, provenance), not a bare value.
- A new atom-trace tool on the gate (parcel to atoms to full lineage), agent-callable, not just inside our console, so an external agent can trace and verify.
- New calibration and audit read tools on the gate (the calibration overlay read, the read-contract per atom).
- Payment stays SDK by design, not MCP.

A function an agent should be able to do that is not a gated, metered, read-contract-shaped MCP tool is a function a paying agent operator cannot buy. Closing these gaps is what "everything wired and agent-consumable" means.

## The third-party agent view (operator console)

The console gets an Agent View tab that is exactly what an external operator sees before pointing an agent at us, built on the introspection endpoint M already shipped (which supports a call-probe with auth simulation):

- The agent-facing tool catalog filtered by product and tier (what each tier can call).
- The agent-discoverability docs and README the server generates, surfaced in the tab.
- A human test harness: pick a product and tier, invoke any tool, see the raw read-contract-shaped response, so a human verifies the contract before wiring a real agent.

This makes the console both the operator health/audit instrument and the place a prospective agent operator kicks the tires.

## Third-party interaction model

A third-party agent speaks MCP over Streamable HTTP, presents an `X-Hauska-Key` (or none for anonymous Layer-1 public), and the gate resolves product and tier, meters the call, and stamps provenance and citation lineage. It never reaches the spine directly; the gate is the only door, which is what lets us enforce accessPolicy, meter for billing, and keep the arrow-two deposit loop intact on everything it pulls.
