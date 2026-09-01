---
decision_id: 2026-08-28_smartsite_mcp_app_v1_v2
date: 2026-08-28
owner: operator
status: superseded
superseded_by: 2026-08-28_smartsite_mcp_app_screen_save_decouple
related_canonical:
  - _inbox/2026-08-28_smartsite_mcp_app_WDLL.md
  - _inbox/2026-08-26_smartsite_ai_connector_WDLL.md
  - 28_mcp_first_product_design.md
  - 09_post_saas_substrate_thesis.md
  - _decisions/2026-08-26_smartsite_product_mcp_and_ai_connector.md
---

## Decision

Superseded 2026-08-28 by `_decisions/2026-08-28_smartsite_mcp_app_screen_save_decouple.md`. The eight-tool honesty work remains. The board-from-`list_my_properties` cut and the "ninth tool waits for item 16" sequencing do not.

Ship a Smart Site MCP App as a screening board and parcel panel on the existing eight-tool product MCP. v1 extends `get_smart_site` and `list_my_properties` and renders only tool results. v2 (named screens, status CRM, drainage overlay, hop-1 codeRefs) is carded now as P-92 and does not start until v1 is customer-done. A ninth tool is a P-92 amendment, not a silent add.

## Context

Operator dropped a prototype and a v1 scope (`P:/tmp/files (12)`) and said this is what to ship. The prototype is the right product: triage of known and unknown, refusals heavier than flood, transcript as navigation. The written scope also asked for `create_screen`, `save_property`, `set_property_status`, and a drainage geom overlay in the same breath. Those are a second product. The connector WDLL still fails a ninth tool. Item 21 is still blocked on copy, not on legal pages.

Alternatives considered: ship the whole scope as one card (rejected: mixes new tools with an unfiled directory listing); ship only the iframe against today's single-id `get_smart_site` (rejected: a 15-row board would fire 15 turns); delay the app until records and export are live (rejected: the board does not need those tools).

## Structural commitment check

Sell reasoning, not data: the board sells dispositions and refusals, not a parcel dump.
Confidence is earned: no coverage percentages; seed draw stays labelled seed; unread is not unknown.
Cost per jurisdiction: no new ingest on either card.
Dual interface: the MCP App is the MCP-first UI for a product that already has a workbench. Not a Hauska catalog surface.

Brand: Empressa / Smart Site. Not Hauska MCP. Same `mcp.smartsite.cloud` server.

## Reasoning

I1 is what keeps the MCP surface as the product. A board endpoint would turn the connector into a data source for a viewer, which is the opposite of the 2026-08-26 product-MCP decision. Batch `stub` on the existing tool is the cheapest way to make a 15-row first paint honest (unread vs unknown). Status CRM and named screens need durable Smart Site rows and new tools; putting them in v1 would either violate I4 (sandbox storage) or violate the eight-tool law. Drainage sheets already exist in Studio; putting them on `draw` is valuable and is also a producer-wire project, so it waits. O1 (42 percent vs envelope refuse) can turn the strongest feature into the worst review; it gates the app, not a later polish pass.

## Reversal criteria

Revisit v1 if Claude Apps require a Team or Enterprise org we do not have and cannot get; then the board stays a workbench surface and this card re-homes. Revisit the no-ninth-tool cut if directory review requires a dedicated screen tool before listing, in which case P-92 item 17 moves forward and P-91 item 14 is amended, not silently absorbed. Revisit O5 if five non-gold parcels return rings from live county geometry; then `descriptor-fixture` on gold is a source note, not a ship gate.

## Dependencies

P-87 eight-tool catalog and draw stub (items 22 to 27) are prerequisites and are live. P-88 item 21 files on the connector path (P-91 item 11), not as a child of the app iframe. P-85 records stay `not_ready` until that card lands; they are not a v1 board dependency. P-92 depends on P-91 item 16 customer-done plus a connector WDLL amendment.
