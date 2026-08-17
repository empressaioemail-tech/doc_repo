---
id: 2026-08-17_g66_dashboards_ui_WDLL
title: WDLL — Lane B G-66 Dashboards product UI
status: draft
last_updated: 2026-08-17
applies_to: smartcity
owner: nick
related:
  [
    90_operations/OPS-17_govtech_stack_plan_of_record,
    _decisions/2026-08-17_dashboards_ui_then_one_feed,
    _inbox/2026-08-17_dashboards_missing_pieces,
    _decisions/2026-08-17_g13_consumer_contract,
    _smartcity_masters/31_smartcity_dashboards,
    28_mcp_first_product_design,
  ]
---

# WDLL: Lane B G-66 Dashboards product UI

Date: 2026-08-17  Status: draft
Operator approval: pending

Plan row: **G-66** (OPS-17, inserted by A-052). G-61 through G-65 CLOSED. Instrument: frozen WDLL approved; serving Dashboards is a navigable product chrome for the four lead lenses on `template-city`; live Bastrop unchanged; no feed ingest.

This card is the human door. It is not a feed, not Compass, not Bastrop onboarding, not G-52.

Housing is [empressaioemail-tech/smartcity-dashboards](https://github.com/empressaioemail-tech/smartcity-dashboards). Serving pin at draft: `smartcity-dashboards-00007-8sc`.

## As-found (2026-08-17)

GET `/` is a city-manager proof: parcel inputs, Compose button, SmartSite iframe of gold `48021:34137`, atoms panel, files room unavailable, four lens cards underneath. GET `/?lens=development-services` swaps the iframe to plan-review-app. The four lenses are catalog cards, not views. A staff person who does not know a parcel node id cannot use this as Dashboards.

Doc 31: city manager sees the city, development services sees the pipeline, finance sees money, citizen sees nearby status. Compass is a later sidebar, not this card.

## Done looks like

Unauthenticated GET of serving Dashboards presents the four lead lenses as navigable views, not four cards under one compose form. City-manager view may still default the gold parcel SmartSite embed. Development-services view still mounts plan-review-app (G-64 stands). Finance and citizen views honest-empty if no records exist (no invented budget, no payment theater). `template-city` only. Live `smartcityos.io` unchanged. No adapter grant. No atoms `--apply`.

## Acceptance items

1. **Operator approves this card.** Status flips from draft to approved before any UI implementation.
   | check: this file `Operator approval:` dated; status `approved`.
   | grade: [ ]
   | depends on: none

2. **Four lead lenses are views.** GET serving Dashboards lets a grader open city-manager, development-services, finance, and citizen without typing a parcel id into a hidden form. Development-services still loads plan-review-app. City-manager may still show gold `48021:34137` SmartSite.
   | check: live navigation; no Compose click required to see each lens chrome.
   | grade: [ ]
   | depends on: 1

3. **Honest empty, not wallpaper.** Finance and citizen do not invent numbers. If no records, the view says empty with a basis. Payments are not claimed. Shape test still refuses `permitflow` and `CitizenConnect` as a product name.
   | check: live finance/citizen copy; served JS string counts.
   | grade: [ ]
   | depends on: 2

4. **Demo identity stays template-city.** Gold parcel remains a demo fixture, not "Bastrop onboarded." No Bastrop city pack. No live ops from morning-brief.
   | check: compose `cityKey` default `template-city`; no work-order names on unauth GET.
   | grade: [ ]
   | depends on: 1

5. **Live Bastrop unchanged.** Zero deploys to `smartcity-os-prod`. City pin `00118-qox` unless a later pin supersedes. L26 writer slot not taken.
   | check: git status on `P:\smartcity-os`; `gcloud` first 100% city revision.
   | grade: [ ]
   | depends on: 1

6. **This is not a feed, Compass, or cutover.** Close names as not started: first adapter grant, scraper copy, Compass sidebar, live Leaflet cut, live PermitFlow cut, G-52, G-24, G-33, G-42, next-city pack.
   | check: close artifact lists those residuals.
   | grade: [ ]
   | depends on: 5

## Out of scope

Feed ingest. Copying MyGov/Samsara scrapers. Compass sidebar. Bastrop staff login. Additional department lenses beyond the four lead. Asset Management housing. Atoms `--apply`. Second MCP. Live city deploy.

## Amendments

(none until operator go)

## Finish card (graded at close)

(empty until close)
