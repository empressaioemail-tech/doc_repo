---
decision_id: 2026-08-17_files_compose_then_one_feed
date: 2026-08-17
owner: nick
status: active
related_canonical:
  [
    _decisions/2026-08-17_dashboards_ui_then_one_feed,
    _inbox/2026-08-17_dashboards_missing_pieces,
    90_operations/OPS-17_govtech_stack_plan_of_record,
    _inbox/2026-08-17_g68_smart_files_ui_WDLL,
    _inbox/2026-08-17_g63_feed_adapter_contract_WDLL,
  ]
---

# Decision

Next wave after G-66/G-68/G-69: mount the serving Files browser into Dashboards Work (G-70), hide Files product chrome when iframed (G-72), then grant one public municode calendar feed onto `template-city` writing records to files (G-71). Not a Bastrop tenant. Not MyGov. Not G-24.

## Context

Operator could not find a Smart Files tab on Dashboards. G-68 shipped the browser on `smart-files-app`. G-66 left Work → Files as an unbuilt Preview chip. Operator asked to spawn the next wave and asked whether to start a Bastrop tenant and pull functions. That cutover path stays refused.

Alternatives considered: Bastrop pack plus many feeds (collapses identities). Skip Files compose and start MyGov (private ops on the demo). Write calendar onto spine (L26 holds the atoms slot).

## Structural commitment check

- Sell reasoning, not data: meetings render records with provenance, not a vendor JSON wallpaper.
- Tenant sovereignty: live Bastrop ops stay on the island. Calendar events for the template are public-free.
- Cost per jurisdiction: one adapter grant reused later. Not a cloned city app.
- No privileged data: do not call `smartcityos.io` calendar APIs.

## Reasoning

The hole the operator hit is compose, not a missing Files product. The first feed must be public and already honest. Municode meetings are that candidate. Spine write is blocked by the atoms slot, so this card writes calendar records onto Smart Files and the Overview meetings panel reads them. MyGov and Samsara wait.

## Reversal criteria

Reverse Files compose only if the operator wants Files to stay a separate host with no city tab. Reverse files-not-spine for calendar only if the atoms slot is free and a named spine write WDLL exists. Reverse "not Bastrop" only with a named island replacement WDLL staff will use that day.

## Dependencies

G-66 G-68 G-69 CLOSED. Unblocks compiled G-70 G-71 G-72. Does not start G-52. Does not fill G-24. Live Bastrop no-touch. L26 untouched.

## Counterparties

Internal: operator, Lane B, Lane A. Live city: Bastrop staff on `smartcityos.io`. Demo: `template-city` on Dashboards `00008-d55`.
