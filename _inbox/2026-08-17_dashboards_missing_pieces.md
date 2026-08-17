---
id: 2026-08-17_dashboards_missing_pieces
title: Dashboards missing pieces — demo, Bastrop, next city, UI, feeds
status: active
last_updated: 2026-08-17
applies_to: smartcity
owner: nick
related:
  [
    _decisions/2026-08-17_dashboards_ui_then_one_feed,
    _decisions/2026-08-17_smartcity_product_line_then_bastrop_onboarding,
    _inbox/2026-08-17_g66_dashboards_ui_WDLL,
    _inbox/2026-08-17_g18_smartcity_inventory,
    _smartcity_masters/31_smartcity_dashboards,
  ]
---

# Dashboards missing pieces

Operator 2026-08-17: do not approach this as a Bastrop cutover. Prefer a UI session first, then one data source at a time (or copy scrapers and import through adapters). Name the line between demo city, live Bastrop, and the next city.

This is the gap map. It is not a WDLL. G-66 is the UI card (draft). Feeds stay later named cards, one source each.

## Three identities (do not collapse)

**Demo / template.** Pack `template-city` on Dashboards. Public-free. Gold fixture today is public-record Bastrop parcel `48021:34137` (908 PINE). That parcel is a demo subject, not proof that Bastrop was onboarded. Fixture pack `fixture-city` is the tenancy proof only.

**Live Bastrop.** `https://smartcityos.io`, serving `smartcity-api-00118-qox`, `tenant_id=2`. Welded ops app: MyGov scrape tables, Samsara fleet copies, municode calendar, OpenGov budget, Leaflet, PermitFlow, Compass chatbot, public morning-brief leak. Absolute no-touch until a named island replacement. Staff still work here.

**Next city.** A new city pack plus adapter grants. Same Dashboards product. Not a clone of `P:\smartcity-os`. Bastrop public-record parcels already exist on Hauska spine; that is not the next-city machine. The machine is: pack, grants, one adapter, records with provenance, lenses that read those records.

A later agent that says "onboard Bastrop" without naming which identity is doing the CTRL-1 mix that produced the cutover slogan.

## What is live on Dashboards today

Serving `smartcity-dashboards-00007-8sc`. GET `/` auto-loads SmartSite gold parcel. GET `/?lens=development-services` auto-loads plan-review-app (icc-demo gate). Four lead-lens cards. Compose JSON: atoms, files room (files auth refused), `smartsite.url`, `planReview.url`. Adapter kinds catalog, `template-city.grantedAdapters` empty. MCP `00082-mat` tag g11 proxies compose. No `/permitflow`.

This is a proof of mounts. It is not the doc 31 product.

## What doc 31 still owes as UI

City manager is a cross-department view of the whole city, not a parcel form. Development services is the permitting pipeline, not only an iframe. Finance is budget against actuals from records. Citizen is service requests and nearby status, distinguished by accessPolicy, not a SKU. Additional roster (public works, police, fire, parks, and the rest) is named and unbuilt.

Compass is the doc 34 sidebar that follows the user through those views. Aligned. Not this wave. Live chatbot stays on the Bastrop island.

## Missing pieces (honest)

| Gap | Why it is missing | What closes it |
|---|---|---|
| Product chrome | Proof compose, not audience views | G-66 UI session (draft) |
| Staff session on Dashboards | G-11 is fixture-city sequencing, not Bastrop login | Named later; not G-66 |
| First feed grant | G-63 catalog only; grants [] | One-source card after UI |
| Copied scrapers | Live scrapers write city-DB tables, not spine/files | Adapter that writes records; grant on a pack |
| Compass sidebar | Vision | Own WDLL after chrome exists |
| G-21 honesty | 340 vs 12599 permits; 64 vs 0 overdue | Own card; do not round off in the template |
| AM housing | Doc 32 is a build | Own housing; G-24 stays zero |
| Live Leaflet / PermitFlow islands | Left on purpose by G-45 / G-65 | Named island cuts, one at a time, when staff actually use the replacement |
| Next-city pack | Only template-city and fixture-city | Onboarding card after one feed is proved on the template |
| Citizen payments | Theater on live Bastrop | Unclaimed until built |

## Recommended sequence

1. **UI session (G-66).** Chrome a staff person can navigate. Four lead lenses as views. Gold parcel may remain the city-manager default subject. No feed ingest. No Bastrop deploy. No Compass build.

2. **One source onto template-city.** First feed should be public or already-honest, not MyGov private ops. Municode calendar is the lowest-sovereignty candidate from G-18 (public events, live scrape already proved). Public-record parcels are already on spine; do not call that a feed win. MyGov/Samsara wait until the identity split is visible in the UI (demo vs island).

3. **Copy a scraper only as an adapter.** The Bastrop MyGov job is allowed as source of an adapter implementation. Destination is spine or files with provenance and accessPolicy, granted on a pack. Destination is not Dashboards Neon and not a copied `mygov_permits` table.

4. **Island replacements, one each.** Leaflet dies when staff map on Dashboards is the map they use. PermitFlow dies when plan-review-app is the reviewer they use. Compass chatbot dies when the sidebar is the assistant they use. Each is its own WDLL with a staff go-live. None of those is "Bastrop cutover."

5. **Next city.** New pack. Grant the adapters that already write records. Do not copy `smartcity-os`.

## What not to do

Do not dispatch a Bastrop cutover WDLL. Do not start G-52. Do not fill G-24. Do not steal L26. Do not treat gold `48021:34137` as Bastrop onboarded. Do not put live work-order names on unauth Dashboards.
