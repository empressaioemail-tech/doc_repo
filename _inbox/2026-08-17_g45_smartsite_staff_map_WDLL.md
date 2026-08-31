---
id: 2026-08-17_g45_smartsite_staff_map_WDLL
title: WDLL — Lane B G-45 SmartSite staff map
status: graded
last_updated: 2026-08-17
applies_to: smartcity
owner: nick
related:
  [
    90_operations/OPS-17_govtech_stack_plan_of_record,
    _decisions/2026-08-17_g45_smartsite_staff_map,
    _decisions/2026-08-17_g13_consumer_contract,
    _decisions/2026-08-17_smartcity_product_line_then_bastrop_onboarding,
    _decisions/2026-08-17_g11_city_pack_tenancy,
    _inbox/2026-08-17_g11_tenancy_WDLL,
    _inbox/2026-08-17_g18_smartcity_inventory,
    _smartcity_masters/31_smartcity_dashboards,
    28_mcp_first_product_design,
    51_substrate_v1_sprint,
  ]
---

# WDLL: Lane B G-45 SmartSite staff map

Date: 2026-08-17  Status: graded
Operator approval: 2026-08-17 (operator: wdll approved)

Plan row: **G-45** (OPS-17 S-3). G-11 CLOSED as sequencing. Instrument: frozen WDLL approved; Bastrop map renders on the Smart Site mapping system, verified in the deployed Dashboards surface; live Bastrop Leaflet is not cut.

This card is the staff map on the Dashboards product. It is not a live `smartcity-os` Leaflet deletion, not a third parcel stack, and not a hauska-map rewrite unless the live embed is blocked.

Housing is [empressaioemail-tech/smartcity-dashboards](https://github.com/empressaioemail-tech/smartcity-dashboards). Wire is `_decisions/2026-08-17_g13_consumer_contract.md` (SmartSite application mount is embed `smartsite.cloud/?parcelNodeId=`). Gold parcel is `48021:34137` (908 PINE, Bastrop), the same node G-61/G-62/G-11 compose used.

## As-found (2026-08-17, this session)

Serving Dashboards `00005-m5t` GET `/` is a city-manager compose page. The SmartSite iframe starts `about:blank`. After Compose on `48021:34137` / `template-city`, iframe `src` is `https://smartsite.cloud/?parcelNodeId=48021%3A34137` and the PE bundle `index-Dt-8jbWe.js` renders 908 PINE on the map. Atoms `ok` count 9. Files `unavailable` / `files auth refused`. Leaflet is already refused in Dashboards source. Live `smartcityos.io` CSP still has no `smartsite.cloud`; city bundle still has Leaflet. That city path stays until a named cutover.

The G-61 mount URL exists. The G-45 instrument does not: a grader hitting GET `/` does not see a Bastrop map.

## Done looks like

The Dashboards staff map is SmartSite. Opening the serving Dashboards origin shows gold Bastrop parcel `48021:34137` on `smartsite.cloud` without a Compose click. Query `?parcelNodeId=` may override. The same embed URL is what anonymous MCP `dashboards_compose_city_manager` already returns. Dashboards source and served `app.js` contain zero `leaflet`. Live `smartcityos.io` / `tenant_id=2` still has its Leaflet island. No second parcel store. No second MCP. No atoms `--apply`.

## Acceptance items

1. **Operator approves this card.** Status flips from draft to approved before any staff-map implementation.
   | check: this file `Operator approval:` dated; status `approved`.
   | grade: [x] met 2026-08-17 | evidence: operator said wdll approved.
   | depends on: none

2. **Staff map is the SmartSite embed, not a third stack.** Decision record names the G-13 embed host. Dashboards does not grow a parcel table, a Leaflet map, or a copied GeoJSON store. hauska-map is touched only if the live iframe is refused by frame policy.
   | check: decision `_decisions/2026-08-17_g45_smartsite_staff_map.md` active; Dashboards shape test still refuses `leaflet`; no new parcel store.
   | grade: [x] met 2026-08-17 | evidence: decision active; Dashboards PR #5 has no parcel table; served GET `/app.js` leaflet=false; hauska-map not touched.
   | depends on: 1

3. **GET `/` renders the gold Bastrop map.** Unauthenticated GET of serving Dashboards `/` (or `/index.html`) auto-composes `parcelNodeId=48021:34137` and `cityKey=template-city`. The iframe `src` is the G-13 embed URL for that parcel. A Compose click is not required for the instrument.
   | check: live GET `/app.js` (or equivalent) auto-loads that parcel; live iframe `src` includes `smartsite.cloud` and `48021:34137` (encoded or decoded). Query `?parcelNodeId=` overrides when present.
   | grade: [x] met 2026-08-17 | evidence: serving `00006-vfk` GET `/app.js` calls `compose(staffMap.parcelNodeId` on load; CDP iframe `#site` src `https://smartsite.cloud/?parcelNodeId=48021%3A34137` with no Compose click. Probe `_scratch/g45_live_probe.json`.
   | depends on: 2

4. **Live browser: the map is SmartSite, not a URL string.** Browser probe of serving Dashboards after auto-load: iframe host is `smartsite.cloud`; the PE surface shows 908 PINE / APN 34137; Dashboards served HTML+JS has zero `leaflet`. Paired control: live `https://smartcityos.io` HTML CSP still omits `smartsite.cloud` (Leaflet island remains, on purpose).
   | check: screenshot or CDP `iframe.src` plus visible situs on the embed; `curl` city CSP `frame-src` still Power BI / Prophecy only.
   | grade: [x] met 2026-08-17 | evidence: browser GET `/?g45=1` no Compose click; iframe host smartsite.cloud; PE shows 908 PINE / APN 34137; served app.js leaflet=false; city CSP `frame-src` still Power BI / Prophecy only.
   | depends on: 3

5. **Dual interface on the existing MCP.** Anonymous `dashboards_compose_city_manager` for `48021:34137` / `template-city` returns the same `smartsite.url` the iframe uses. No new tool name required if that field already matches. No second MCP.
   | check: live `POST /mcp` compose JSON `smartsite.url` equals the iframe src (encoding-normalized).
   | grade: [x] met 2026-08-17 | evidence: anon `dashboards_compose_city_manager` `smartsite.url` equals iframe src. MCP serving still `00082-mat` tag g11. No MCP PR.
   | depends on: 3

6. **Live Bastrop unchanged.** `P:\smartcity-os` porcelain matches the G-18 pin dirty set. This wave's deploy count to `smartcity-os-prod` / `smartcityos.io` is zero. L26 writer slot not taken. Serving city still `smartcity-api-00118-qox` unless a later pin supersedes.
   | check: git status on `P:\smartcity-os`; `gcloud run services describe` first 100% revision.
   | grade: [x] met 2026-08-17 | evidence: `P:\smartcity-os` porcelain still `secrets_scan.yml` + `mygov.ts`. City `00118-qox` @100% tag lane4. cityDeploysThisWave=0.
   | depends on: 1

7. **Cutover is not this card.** Close names as not started: live Leaflet deletion, PermitFlow kill, Compass sidebar, Bastrop tenant cutover, G-24 ingest, G-33, G-42, live vendor grants.
   | check: close artifact lists those residuals. G-33 and G-42 stay OPEN.
   | grade: [x] met 2026-08-17 | evidence: close `_inbox/2026-08-17_g45_close.json` open list. G-33 and G-42 remain OPEN in OPS-17.

## Out of scope

Cutting Leaflet on `smartcityos.io`. Changing live city CSP. PermitFlow. Compass. G-24. Fixture-city private map. A third parcel stack. Cloning PE into Dashboards. Rewriting hauska-map layers. Second MCP. Atoms `--apply`. `npx vercel --prod` onto the city.

## Amendments

(none until operator go)

## Finish card (graded at close)

1. met: operator said wdll approved 2026-08-17.
2. met: decision active; no parcel table; served app.js leaflet=false; hauska-map not touched.
3. met: serving `00006-vfk` GET `/` auto-composes `48021:34137` / `template-city`; iframe src is the G-13 embed URL with no Compose click.
4. met: browser shows 908 PINE / APN 34137 on smartsite.cloud; city CSP still omits smartsite.cloud.
5. met: anon MCP `dashboards_compose_city_manager` `smartsite.url` matches iframe src; no second MCP.
6. met: city `00118-qox` @100% tag lane4; dirty set unchanged; zero city deploys; L26 slot not taken.
7. met: close names live Leaflet deletion, PermitFlow kill, Compass, Bastrop cutover, G-24 ingest, G-33, G-42, live vendor grants as not started. G-33 and G-42 stay OPEN.
