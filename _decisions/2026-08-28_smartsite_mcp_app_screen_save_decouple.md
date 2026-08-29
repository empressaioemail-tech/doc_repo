---
decision_id: 2026-08-28_smartsite_mcp_app_screen_save_decouple
date: 2026-08-28
owner: operator
status: active
related_canonical:
  - _decisions/2026-08-28_smartsite_mcp_app_v1_v2.md
  - _inbox/2026-08-28_smartsite_mcp_app_WDLL.md
  - _inbox/2026-08-28_smartsite_mcp_app_v1_scope.md
  - _inbox/2026-08-26_smartsite_ai_connector_WDLL.md
  - 90_operations/OPS-16_texas_market_plan_of_record.md
---

## Decision

Screens and saved properties are decoupled. A screen holds parcel references (node id or null, original query, resolution, intake source). Creating a screen writes nothing to the saved list. Saving is an explicit, origin-independent turn. The board reads a screen. `list_my_properties` is the saved list only. Web-sourced content never enters the panel (I5). Rendering requires no persistence (I6). No listing feed of any kind.

## Context

The 2026-08-28 v1/v2 cut put named screens and status CRM on P-92 so P-91 could ship an eight-tool board from `list_my_properties`. Operator amended the same day: an investor screening forty listings wants one board and maybe three saves; if all forty land in saved properties the saved list is unusable inside a week. The same amendment added I5 (search results must not be laundered into the four-state language) and I6 (a bare node id draws without a save). In-flight eight-tool work (P-91 items 1-5 live on `00635-qux` / `00020-ced`) is not cancelled.

Alternatives rejected: keep the saved-list board for v1 (violates the new 3.3); persist screens in the sandbox (violates I4); render Claude web search beside cited atoms (violates I5); ingest Zillow or any listing feed (operator-settled; Unlock MLS redistribution is already open).

## Structural commitment check

Sell reasoning, not data: the board sells dispositions and refusals on parcels we resolved, not listing copy.
Confidence is earned: web search has no disposition, asOf, producer, or citation in our vocabulary.
Cost per jurisdiction: no new ingest; paste resolves addresses we already have.
Dual interface: new tools are product-MCP tools, named on the connector WDLL before they appear in `tools/list`.

## Reasoning

The data-model change is the load-bearing one. A screen row is an intake record. A save is a CRM record. One write path cannot serve both. `list_my_properties(screenId?)` as previously scoped would have re-coupled them. I6 follows: the parcel panel is a renderer over `get_smart_site`, not a view of a saved row. I5 follows I1: Claude can search; the panel cannot absorb that search into atom language. v1 intake is paste (no product build on the intake side); Claude already parses text, screenshots, PDFs, and CSVs. The tool it must call is `create_screen`, so the iframe cannot ship on the saved list. Street-type abbreviations (O7) sit on the intake path: a silent drop looks identical to a genuine miss.

## Reversal criteria

Revisit the no-feed rule if a licensed MLS redistribution lands and names a producer we can cite as an atom, not as a search snippet. Revisit I5 if Claude Apps later require in-panel search results to pass directory review; then the results still cannot use our five-state vocabulary. Revisit decoupling if a single-parcel consumer never uses screens and the saved list remains the only durable set; the board still must not write forty implicit saves.

## Dependencies

Amends `_decisions/2026-08-28_smartsite_mcp_app_v1_v2.md` (the eight-tool board-from-saves cut). Connector WDLL item 12 must name `create_screen`, `add_to_screen`, `list_screens`, `save_property`, and `set_property_status` before any of them appear in `tools/list`. P-91 items 1-5 stay live. O1 is ruling B (`_decisions/2026-08-28_p91_o1_envelope_xray_must_refuse.md`). Iframe waits for the X-ray refuse plus those tools. Item 21 should not file an eight-tool listing that we immediately grow.

## Counterparties

Internal. Operator. Claude directory review sees the catalog grow only after the named amendment.
