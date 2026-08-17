---
id: 2026-08-17_g18_smartcity_inventory
title: G-18 live Bastrop keep / mount / kill inventory
status: active
last_updated: 2026-08-17
applies_to: smartcity
owner: nick
related:
  [
    2026-08-17_g18_smartcity_inventory_WDLL,
    2026-08-17_g18_lane_b_planner_pickup,
    2026-08-17_smartcity_product_line_then_bastrop_onboarding,
    2026-08-17_dashboards_ui_then_one_feed,
    90_operations/OPS-17_govtech_stack_plan_of_record,
    _smartcity_masters/31_smartcity_dashboards,
    _smartcity_masters/32_smartcity_asset_management,
    _smartcity_masters/33a_smartcity_plan_review,
    _smartcity_masters/34_smartcity_smart_files_and_foundation,
  ]
---

# G-18 SmartCity inventory (read-only)

Plan row G-18. WDLL `_inbox/2026-08-17_g18_smartcity_inventory_WDLL.md` approved 2026-08-17. Live pin `_inbox/2026-08-17_g18_cp1.json`.

This is not a rebuild plan. G-21 remains OPEN on the same rows.

Product-line overlay (operator 2026-08-17): `_decisions/2026-08-17_smartcity_product_line_then_bastrop_onboarding.md`. As-found keep / mount / kill below is the live city. The overlay is the build plan. Do not mix them.

## Live pin

Probed 2026-08-17T12:45:56-05:00.

Serving: `smartcity-api-00118-qox` @100% tag `lane4` in `smartcity-os-prod` us-central1. Revision created 2026-08-01T23:04:24Z. URL `https://smartcity-api-7dyaiy7wha-uc.a.run.app`. Domain `https://smartcityos.io`. HTML last-modified Sat, 01 Aug 2026 23:02:34 GMT, 3624 bytes, bundle `/assets/index-kGj7uMs4.js` 5,578,225 bytes (same path as the 2026-08-12 a11y audit). `GET /api/health` 200 `status=ok db=connected` at 2026-08-17T12:45:58.714Z.

`10_ground_truth.md` still cites `smartcity-api-00104-taw`. That revision is a 0% tag, not serving.

CSP on the serving HTML: `connect-src` is self plus `smartcity-api-*.run.app` only. `frame-src` is self plus `app.powerbigov.us`, `app.powerbi.com`, `prophecygov.com`. No `smartsite.cloud`, no `plan-review-app`, no `smart-files`, no `cortex-api`.

Unauthenticated probes were the default. No staff session was supplied.

`P:\smartcity-os` was read, not written. Pre-existing dirty files (`.github/workflows/secrets_scan.yml`, `server/routes/mygov.ts`) were left alone. Deploys this wave: zero.

## Keep / mount / kill (graded rows)

Row format: `name | master | live path (URL + probe) | spine / vendor / mock / UI-only | writes a record? | keep / mount / kill | notes`

Master is 31 Dashboards, 32 Asset Management, 33a Plan Review, 34 Smart Files, or none.

### Named as products in doc 30

Operations Dashboard | 31 | `GET https://smartcityos.io/api/ai/city-snapshot` 200 JSON 2026-08-17T12:48Z (Active Permits 12599, Fleet Vehicles 84, Open Work Orders 142, FY Budget $89.3M). Staff UI `/overview` is AuthGuard (live bundle route). SPA `/dashboard` HTML 200 is catch-all, not a grade. | vendor | MyGov / Samsara / OpenGov copies land in `smartcity-os` tables (`mygov_permits`, `mygov_work_orders`, `fleet_vehicles`). Not spine atoms. Not accessPolicy nodes. | **keep** | Live wallpaper of vendor widgets plus scraped city DB rows. Aggregation-only as an offer is refused by doc 31; what is live today is still that shape. Do not rebuild. Do not sell as five products. Finding: `morning-brief` `activePermits=340` vs snapshot `12599`; `overdueWorkOrders=64` vs snapshot `agenda.workOrders.overdue=0`. Two numbers that should agree and do not.

Parcel Intelligence | 31/32 (suspect 32 in doc 30; live is a dashboard lens over a second parcel stack) | `GET /api/property-intelligence/summary?address=1308%20Chestnut` 401. `GET /api/parcels` 401. Live bundle: `smartsite.cloud=0`, `parcelNodeId=0`, `hauska=0`, `atom-chain=0`, `property-intelligence=5`. CSP cannot connect to SmartSite. Leaflet island present (`leaflet` 11, `tile.openstreetmap` 1, `arcgisonline` 16). | vendor (Esri + local GeoJSON), not spine | No. Local property-intelligence handlers default `tenantId=2` and require a session. | **keep** until a named G-45 mount | Second parcel stack inside the city. Mount target is `smartsite.cloud/?parcelNodeId=`. Do not build a third. Honesty of the staff parcel click is UNGRADED (401). Deployed artifact cannot be a SmartSite mount.

AI Plan Review / Codex 1b | 33a | `GET /api/plan-review` 401. `GET /api/permitflow/queue` 401. Live bundle: `plan-review=0`, `codex=0`, `cotality=0`, `corelogic=0`, `permitflow=160`, `/permitflow=157`. Serving route table includes `/permitflow/review` -> PermitFlowReviewer (AuthGuard). Canonical review host is `https://plan-review-app-ten.vercel.app` (not hit by this city CSP). | vendor / local PermitFlow, not Lane C | PermitFlow writes `pf_documents` and related `pf_*` tables in the city DB. Not plan-review Cloud Run. Not Smart Files. | **keep** the live PermitFlow (do not cut staff path) and **mount** Lane C later as the function | Duplicate in-app review UI is present. Cotality / CoreLogic positively absent from origin/main ts/tsx/sql and from the live bundle. G-51 is observed true on the C host; this city still ships its own reviewer. Do not reimplement. Do not start G-52.

CitizenConnect | none (doc 31: citizen lens, not a product) | SPA `/citizen`, `/citizen/pay-citation`, `/citizen/pay-utilities` HTML 200 catch-all. Live bundle contains those paths and the string `Payment Complete`. AuthGuard wraps `/citizen*` in App.tsx. | UI-only on payments | No. Lookup loads in-page sample arrays; `handlePayment` is `setTimeout` 1500ms then a toast. Live bundle `stripe.com=0`, `js.stripe=0`. | **kill** as a product. Keep as a future 31 citizen lens after honesty. | Catalog oversell named by G-21. Payments are theater. Do not sell CitizenConnect. Do not build a payment rail here.

Digital Twinning / 3D | none (32 view-tier, deliberately last) | Live bundle `Digital Twin` 26, all marketing/pricing copy ("3D models of city infrastructure..."). `cesium=0`, `three.js=0`, `maplibre=0`. No 3d/twin page in origin/main. OG image `/attached_assets/generated_images/digital-twin-city.png`. Schema has `blockchain_assets`. | UI-only | `blockchain_assets` exists as a table. No live 3D scene probed. | **kill** as a product | Theater plus a leftover chain table. Do not SCADA. Do not 3D. Do not tokenize.

Compass | none (doc 34 rework, not shipped) | `GET /api/ai/morning-brief` 200 JSON `generatedAt=2026-08-17T12:48:07.119Z` with overdue WO `25-000280` "Locate Water / Wastewater Lines" assigned Christy Hunn. `GET /api/ai/chat` 401. `/ask-smartcity` is AuthGuard. Bundle `Compass=76`, `Anthropic=0` (server-side). | vendor + LLM | Compass action / memory tables exist (`compassActionLog`, `aiMemoryEntries`). Those are assistant logs, not city asset records. | **keep** (welded staff assistant) | Not the doc 34 sidebar over readable records. It is a chatbot over MyGov/Samsara snapshots. Public morning-brief leaks live Bastrop ops without a session. Do not claim the rework shipped.

### Vendor feeds doc 31

MyGov | 31 | morning-brief 200 names real WO/permit counts and a named work order. city-snapshot 200 `Active Permits=12599`, `Open Work Orders=142`. `/api/mygov` 401. Cron writes `sync_health` process `mygov_full_sync` (source; last-sync row UNGRADED, 401). | vendor (scrape) | Yes, into `mygov_permits`, `mygov_work_orders`, inspections, fees, reviews. City DB records, not spine atoms. | **keep** | Serving Bastrop staff data. Do not fill G-24 from these. G-52 (engagement from a permit) is not this card.

Samsara | 31 | city-snapshot 200 `Fleet Vehicles=84`, `moving=0 parked=84 utilization=0`, underutilization flags by department. `/api/samsara/health` 401. Bundle `Samsara=11`. Cron `samsara_fleet` writes `sync_health` (source). | vendor (API) | Yes, `fleet_vehicles` and location/stats/DVIR tables. Telemetry copies, not Asset Management Tier 1 nodes. | **keep** | Paint plus local fleet rows. Last successful `sync_health` timestamp UNGRADED (401).

Spireon | 31 | `/api/spireon/health` 401. Bundle `Spireon=8`. Doc 30: in-memory cache, no `sync_health`. | UNGRADED (401; no public snapshot field named police fleet) | Unknown whether a durable row lands. Source says cache. | **keep** if police dashboard is used today | Do not cut `/police` until a staff probe. Honesty of live vs mock is G-21 with a session.

Verkada | 31 | `/api/verkada/health` 401. GET `/api/verkada/webhook` SPA HTML (not the POST webhook). Bundle `Verkada=1` / `verkada=32`. CSP connect-src has no Verkada host (streams must proxy through self or they fail). | UNGRADED last-sync | Unknown. | **keep** | Camera/door UI is in the bundle. No public proof it is live today.

FirstDue | 31 | `/api/firstdue/health` 401. `/api/vfd/weather` 401 `{error: Access code required}` (VFD is a separate gate, not anonymous). Bundle `FirstDue=5`. Cron `firstdue_occupancies` writes `sync_health` (source). | UNGRADED last-sync | Occupancy rows if the cron runs; not spine. | **keep** | `/vfd` and `/fire-ems` stay on the do-not-touch list.

OpenGov | 31 | city-snapshot 200 `FY Budget=$89.3M` / `budget.total=89338711`. `/api/opengov/health` 401. `/opengov/code-reference` is AuthGuard and is a chart-of-accounts viewer, not plan-review. Bundle `OpenGov=18`. Cron `opengov_reports`. | vendor (API + cache) | Budget/COA copies in city DB if the cron lands. Not Asset Management. | **keep** | Live budget figure is public via city-snapshot.

ArcGIS | 31 | `GET /api/esri/geocode` 400 `{error: address query parameter is required}`. `GET /api/esri/geocode?address=1308%20Chestnut%20St%20Bastrop%20TX` 200 `{candidates:[], spatialReference:{wkid:4326}}`. `GET /api/esri/suggest` 200 `{suggestions:[]}`. Bundle `arcgis=11`, `esri=15`, `arcgisonline=16`. | vendor (API) | Geocode is on-demand. Not a city asset record. | **keep** | Live Esri handler. Empty candidates on that address is a result, not a mock. Leaflet uses Esri tiles.

Power BI | 31 | `/api/powerbi/status` 401. Serving CSP `frame-src` includes `app.powerbigov.us` and `app.powerbi.com`. Bundle `powerbi=55`. | UNGRADED whether an embed token mints (401) | Embed, not a city record. | **keep** | Frame is allowed by the live CSP. CIP routes exist behind auth.

GoTo Connect | 31 | `/api/goto/health` 401. Bundle `GoTo=4`. `/call-analytics` AuthGuard. Doc 30 already marked degraded. | UNGRADED | Unknown. | **keep** | Do not cut call-analytics until a staff probe. Do not treat degraded as dead without that probe.

Google calendar | 31 | `GET /api/calendar/status` 200 `{ok:true, lastScrapeAt:2026-08-17T10:30:41.290Z, lastScrapeStatus:ok, cachedSource:municode}`. `GET /api/calendar/events/public` 200 10132 bytes, first event "Public Library Board" 2026-09-14, videoUrl `bastrop-tx.municodemeetings.com`. `GET /api/calendar/feed-url` 200 that municode URL. | vendor (municode scrape, not Google Calendar API) | Yes, cached events (`council_agendas` / calendar cache). Vanishes if municode is down and cache expires. | **keep** | Doc 30 named Google APIs. Live status says municode. That is a free finding for G-21.

Anthropic | none (Compass) | morning-brief 200 with `generatedAt` this probe. city-snapshot 200. `/api/ai/chat` 401. | vendor (LLM over city snapshot) | Assistant logs only. | **keep** | Public brief is a live LLM path. Bundle has no Anthropic string (key is server-side).

Pipedrive | none (CRM / sales) | Live bundle `pipedrive=0`. No city screen. Source: signup/login fire-and-forget to Pipedrive. | UNGRADED last-sync (no city UI to probe) | Sales leads, not city records. | **kill** as a city feed | Not a master. Do not put CRM on a city dashboard.

### Three hunts

Plan review duplicate | 33a | Live bundle `permitflow=160`, `plan-review=0`, `cotality=0`. `/permitflow/review` in serving route table. `/api/permitflow/queue` 401. | local PermitFlow | `pf_documents` and related `pf_*` | **keep** live path; **mount** `plan-review-app-ten.vercel.app` later | Positive hit. Cortex BFF not in this bundle (`cortex-api=0`). Cotality positively absent.

Smart Files duplicate | 34 | Live bundle `smart-files=0`, `smartfiles=0`, `multer=0`, `objectStorage=0`, `/api/upload=0`, `FormData=4`. `/api/files` and `/api/uploads` 401. origin/main `pf_documents` table: `file_url` text, metadata, no blob column. PermitFlow `createDocument` inserts named PDF stubs. | local metadata store | `pf_documents` rows, not Smart Files atoms. | **keep** stubs if PermitFlow is used; **mount** `https://smart-files-padrd77ava-ue.a.run.app` for city rooms later | Positive hit on a second store (metadata). Not a mount of Lane A. Cortex `/api/smart-files` 404 is Lane A, not this hunt.

Map Leaflet vs SmartSite | S-3 / G-45 | Live bundle `leaflet=11`, `MapContainer=1`, `smartsite.cloud=0`, `smartsite=0`, `maplibre=0`. CSP cannot connect or frame SmartSite. `InteractiveMap` `data-testid=leaflet-map`. | local Leaflet (OSM + Esri tiles) | No. | **keep** Leaflet until a named G-45 cutover | Confirmed Leaflet island. G-45 not started.

### Honest zero (G-24)

City-owned assets | 32 | No atoms `COUNT(*)` was run (L26 holds the writer slot; a full-table distinct would be a heavy scan). Public spine pack `GET https://hauska-retrieval-api-h7gvu7rgcq-uc.a.run.app/health/spine` 200, pack=bastrop, `txgio_parcel:48021 total=74729`, `boundary-primitive count=26454` (probedAt 2026-08-02, stale as a health heartbeat, usable as the public-record baseline). County ledger 200 `satisfiedCells=616` `computedAt=2026-08-14T17:41:22.500Z`. Engine `PROPERTY_ENTITY_TYPES` (16) = parcel-node, zoning-fact, setback-rule, buildable-envelope, parcel-terrain-model, building-footprint, utility-easement, flood-hazard-fact, cad-parcel-roll, land-use-fact, owner-fact, rail-corridor-fact, well-fact, special-district-fact, road-node, rrc-pipeline-fact. Zero hydrant / valve / main / lift-station / sidewalk / streetlight / facility types. smartcity-os schema has `fleet_vehicles` and `iot_sensors`, not those asset classes. | n/a | No city-owned asset nodes. Public-record parcels/roads/edges are not assets under management. | **do not fill** | Confirmed still zero at type/schema/spine-pack layer. Store COUNT of a rogue `entity_type` string is UNGRADED (no SELECT issued). Do not ingest.

## Do not touch (`tenant_id = 2` serving today)

Anything that would take Bastrop staff off the air if cut:

- MyGov scrape tables and the cron that fills them (morning-brief named a live WO).
- Samsara-backed `fleet_vehicles` (snapshot 84).
- Municode calendar cache (`lastScrapeStatus=ok` this morning).
- OpenGov budget figure on city-snapshot.
- Leaflet maps on fleet / emergency / development-services.
- PermitFlow `/permitflow/*` (in the serving route table).
- `/overview`, `/fleet`, `/police`, `/fire-ems`, `/emergency-response`, `/vfd`, `/opengov`, `/call-analytics`, `/prophecy`.
- Auth / session middleware. Observed only. Not G-11.
- Power BI and Prophecy frame-src allowances on the live CSP.
- `sync_health` rows (checkpoint for scrapes).

Do not DROP, do not migrate, do not "small fix."

## Findings (not extra walk-list rows)

1. Unauth `morning-brief` and `city-snapshot` publish live Bastrop operations (named work order, permit counts, fleet). That is a leak, not a public Layer-1 catalog.
2. Permit totals disagree: 340 vs 12599. Overdue work orders disagree: 64 vs 0. Reconcile on G-21 with a session, do not round off.
3. Calendar is municode, not Google Calendar.
4. Payments are `setTimeout` theater.
5. Serving revision is `00118-qox` (2026-08-01), not the `00104-taw` in `10_ground_truth.md`.

## Product-line overlay (operator 2026-08-17)

G-18 as-found stands. These dispositions replace keep/kill as the build plan. Live `tenant_id=2` stays no-touch until a named island replacement. Destination still "Bastrop as city one of the machine." Path as of A-052 is UI then one feed, not a city-wide cutover (`_decisions/2026-08-17_dashboards_ui_then_one_feed.md`).

| Name | As-found | Build plan |
|---|---|---|
| Operations Dashboard | keep | Template doc 31 lens family, then migrate Bastrop. Do not clone wallpaper. |
| PermitFlow / in-app plan review | keep live path; mount later | Kill as a product. Cutover after plan-review-app is the staff path. Then `pf_documents` goes with it. |
| CitizenConnect | kill as a product | Citizen lens of Dashboards. Keep capability. Do not sell the name. Payments unclaimed. |
| Parcel Intelligence | keep; mount G-45 | Host on SmartSite. Own WDLL. Do not cut Leaflet first. |
| Digital Twin / 3D | kill as a product | Replaced by Asset Management. Do not fill G-24 from this ruling. |
| Compass | keep welded assistant | Rework to doc 34 sidebar. Live chatbot stays until the rework is staff path. |
| Vendor feeds | keep most; kill Pipedrive | Templated adapters that write records. Not products. Pipedrive stays out. |

Next cards as of A-052: G-66 Dashboards UI (draft `_inbox/2026-08-17_g66_dashboards_ui_WDLL.md`), then one source onto `template-city`. G-13 and G-61 through G-65 are CLOSED. Do not dispatch a Bastrop cutover.

## What this card does not do

No mounts. No rebuild. No deploy. No G-52. No G-11. No G-24 ingest. No G-45 cutover. No G-60 resume. Product-line overlay is `_decisions/2026-08-17_smartcity_product_line_then_bastrop_onboarding.md`. Path amendment `_decisions/2026-08-17_dashboards_ui_then_one_feed.md`. This inventory does not start G-66.

## Grade coverage

Walk-list names: 6 products + 12 feeds + 3 hunts + 1 zero = 22. Ungraded honesty (no staff session): Spireon, Verkada, FirstDue, Power BI embed token, GoTo last-sync, Pipedrive last-sync, Parcel Intelligence staff click, PermitFlow queue body, G-24 rogue-type COUNT. Those stay UNGRADED by design of item 11. A card with zero UNGRADED and no staff session would have been a defect.
