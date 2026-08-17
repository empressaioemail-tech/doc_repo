---
decision_id: 2026-08-17_dashboards_ui_then_one_feed
date: 2026-08-17
owner: nick
status: active
related_canonical:
  [
    _decisions/2026-08-17_smartcity_product_line_then_bastrop_onboarding,
    _inbox/2026-08-17_dashboards_missing_pieces,
    _inbox/2026-08-17_g66_dashboards_ui_WDLL,
    _inbox/2026-08-17_g18_smartcity_inventory,
    _smartcity_masters/31_smartcity_dashboards,
    90_operations/OPS-17_govtech_stack_plan_of_record,
  ]
---

# Decision

Do not treat "Bastrop cutover" as the next Dashboards card. Next is a UI session on the template. After that, pull one data source at a time onto `template-city` (adapter writes a record, or a copied scraper that imports through that adapter). Live `smartcity-os` / `tenant_id=2` stays an island until a named island replacement, never a city-wide cut.

## Context

G-61 through G-65 closed the template spine: housing, honesty, adapter catalog, fixture tenancy, SmartSite staff map, Lane C staff reviewer, PermitFlow dead as a Dashboards product. Pickup then listed "Bastrop cutover" as next. Operator rejected that path 2026-08-17: prefer one source at a time, or copy scrapers and import; even before that, a UI session; and a hard line between demo city, live Bastrop, and the next city we bring on.

Alternatives considered: one WDLL that migrates Bastrop onto Dashboards (collapses three identities, takes staff off the air, clones wallpaper). Copy MyGov first (Bastrop-private ops into the demo). Skip UI and start feeds (nowhere honest to show them; doc 31 is lenses, not a compose form).

The 2026-08-17 product-line decision still stands as destination (template first, Bastrop is city one of the machine, not a unique codebase). This record replaces its implied next-card sequence.

## Structural commitment check

- Sell reasoning, not data: a UI that only paints a vendor feed is refused by doc 31. Feeds land as records.
- Cost per jurisdiction: one adapter reused per city pack, not a cloned city app.
- Dual interface: UI session is the human door on the existing Dashboards product; MCP stays one Hauska server.
- Tenant sovereignty: live Bastrop ops stay on the island until a named grant. Do not publish morning-brief work orders as Layer 1 on the template.
- Brand: Dashboards is Empressa. Spine stays Hauska.

## Reasoning

Serving Dashboards is a proof: one gold parcel compose, four lens cards, SmartSite embed, plan-review iframe. Doc 31 is a family of audience views. That gap is the UI session. A feed with nowhere to appear will get painted as wallpaper.

Three identities must not collapse. `template-city` is the demo product (today it already uses public-record Bastrop parcel `48021:34137` as gold; that is a demo fixture, not Bastrop onboarded). Live Bastrop is `smartcityos.io` / `00118-qox` / `tenant_id=2` with MyGov/Samsara copies and PermitFlow. The next city is a new pack plus grants, never a copy of `P:\smartcity-os`.

One source at a time is how the machine is proved. Copying a Bastrop scraper is allowed only as an adapter that writes records with provenance onto spine or files, granted on a pack. It is not a lift of `mygov_permits` into Dashboards Neon.

## Reversal criteria

Reverse "UI before feeds" only if the operator names a first feed that can be graded with no new chrome (a compose JSON field is not a product UI). Reverse "one source at a time" only if the operator accepts a multi-feed cutover WDLL with a named staff go-live. Reverse the three-identity split only if live Bastrop is retired as an island in a named WDLL that staff will actually use that day.

## Dependencies

Depends on G-61 through G-65 closed. Unblocks G-66 Dashboards UI WDLL (draft, pending operator approval). Does not start G-52, G-24, Compass, G-33, or G-42. Live Bastrop no-touch. L26 untouched.

## Counterparties

Internal: operator, Lane B planner. Live city: Bastrop staff on `smartcityos.io`. Demo: `template-city` on Dashboards `00007-8sc`. Not a Vertosoft close.
