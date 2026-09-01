---
decision_id: 2026-08-17_ux_implementation_sequence
date: 2026-08-17
owner: nick
status: active
related_canonical:
  [
    90_operations/OPS-17_govtech_stack_plan_of_record,
    _inbox/2026-08-17_g66_dashboards_ui_WDLL,
    _decisions/2026-08-17_dashboards_ui_then_one_feed,
    _decisions/2026-08-17_smartcity_product_line_design_system,
  ]
---

# Decision

Implementation of the designed product line is four cards, in this order: kit copy first (G-67), then Dashboards UI (G-66), Smart Files UI (G-68), and Plan Review UI (G-69) in parallel. Asset Management chrome stays designed and unbuilt. G-24 stays zero. Live `smartcityos.io` stays no-touch. Compass chrome ships inside G-66, not as its own product. The G-64 iframe of plan-review-app is allowed to remain until G-69 replaces it with native compose.

## Context

Design sessions 1 through 4 landed in `30b` and `30c`. G-66 as first drafted is stale (four cards, iframe forever, Compass out). Files and Plan Review have no plan rows. Operator asked to implement across everything the kit must touch. WDLL practice forbids starting that build before approved cards.

## Structural commitment check

- Dual interface: kit is human chrome. MCP is not restyled.
- Tenant sovereignty: environment badge and tenant-private default travel with the kit.
- No privileged data: demo is template-city. Gold parcel stays a fixture.

## Reasoning

One kit file in three repos prevents the PermitFlow second-chrome failure. Parallel UI cards after that copy are safe because they do not share a write slot. Serializing Files behind Dashboards would idle Lane A. Replacing the G-64 iframe inside G-66 would couple Dashboards to a Plan Review rewrite and slip both. AM ingest is a different program.

## Reversal criteria

Reverse parallel UI only if one repo cannot take a kit file without a breaking redesign. Reverse "iframe until G-69" only if operator wants Dashboards Review to go native in G-66 with a thinner console. Reverse "AM unbuilt" only if a city engagement needs the empty inventory chrome this wave.

## Dependencies

Depends on prompt 5 housekeeping and planner housing of 30b/30c into `_smartcity_masters/`. Unblocks compiled dispatches only after the three new rows exist in OPS-17 and the four WDLLs are approved.

## Counterparties

Internal: operator, Lane B, Lane A, Lane C.
