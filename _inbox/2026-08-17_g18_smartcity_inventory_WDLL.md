---
id: 2026-08-17_g18_smartcity_inventory_WDLL
title: WDLL — Lane B G-18 SmartCity keep / mount / kill inventory (read-only)
status: graded
last_updated: 2026-08-17
applies_to: smartcity
owner: nick
related:
  [
    90_operations/OPS-17_govtech_stack_plan_of_record,
    _inbox/2026-08-17_g18_lane_b_planner_pickup,
    _decisions/2026-08-15_capability_mount_composition,
    _decisions/2026-08-17_smartcity_product_line_then_bastrop_onboarding,
    _smartcity_masters/31_smartcity_dashboards,
    _smartcity_masters/32_smartcity_asset_management,
    _smartcity_masters/33a_smartcity_plan_review,
    _smartcity_masters/34_smartcity_smart_files_and_foundation,
    _smartcity_masters/35_smartcity_positioning_framework,
    30_smartcity_os,
  ]
---

# WDLL: Lane B G-18 SmartCity inventory

Date: 2026-08-17  Status: graded
Operator approval: 2026-08-17 (operator: approved proceed)

Plan row: **G-18** (OPS-17). Instrument: *Written inventory of the live codebase against the four category masters.*

Pickup: `_inbox/2026-08-17_g18_lane_b_planner_pickup.md`.

Next card after this inventory is graded was **G-21**. Operator 2026-08-17 overlay: next Lane B cards are **G-13** then **G-61**. G-21 remains OPEN and does not block the template.

## Done looks like

A keep / mount / kill map of live Bastrop exists as a filed inventory. Every named screen and feed from the frozen walk list is one row against the four category masters. Each graded row cites a live probe on the deployed city (URL, status, what the request hit). Rows without a live probe are UNGRADED with a written basis, never inferred from `30_smartcity_os.md`. City-owned assets are confirmed still zero and are not filled. Leaflet versus `smartsite.cloud` is named. Duplicate plan-review UI and local file stores are named or positively absent. A short do-not-touch list names anything `tenant_id = 2` that is serving Bastrop staff today. The live city is unchanged: zero commits, zero deploys, zero schema, zero seed, zero `tenant_id = 2` writes.

## Frozen walk list

Doc 30 is the suspect list, not the answer. Masters that win: `_smartcity_masters/` 31 Dashboards, 32 Asset Management, 33a Plan Review, 34 Smart Files / foundation, 35 positioning. Smart site is the unit. Internal inventory may say twin / atom / substrate. Customer-facing copy in the inventory notes must not.

### Named as products in doc 30 (six rows)

| Name in doc 30 | What the probe is asking |
|---|---|
| Operations Dashboard | Real lens on one record, or wallpaper of vendor widgets? |
| Parcel Intelligence | SmartSite / spine, or a second parcel stack inside SmartCity? |
| AI Plan Review / Codex 1b | Dead stub, or a duplicate of `plan-review-app`? G-51 says review must run with zero SmartCity session. |
| CitizenConnect | Citizen lens (doc 31), or a separate product? Payments already catalogued as UI-only oversell. |
| Digital Twinning / 3D | Early theater versus Asset Management view-tier (deliberately last). |
| Compass | Sidebar over readable records (doc 34 rework, not shipped), or a chatbot on silos? |

CitizenConnect payments walk includes `/citizen/pay-citation` and `/citizen/pay-utilities` from the 2026-08-12 live bundle. Those two are named rows under CitizenConnect, not extra products.

### Vendor feeds doc 31 says already flow at Bastrop (eleven rows)

MyGov (permits / work orders), Samsara, Spireon, Verkada, FirstDue, OpenGov, ArcGIS, Power BI, GoTo Connect (already marked degraded), Google calendar, Anthropic.

For each: last successful sync if observable, `sync_health` row or not, scrape versus API, and whether a row lands as a city asset / permit **record** or only paints the dashboard. Aggregation-only is refused as an offer (doc 31). Pipedrive from doc 30's integrations table is a twelfth feed row under master = none (CRM / sales-side).

### Three modules Bastrop must not reimplement (three hunts)

| Module | Looking for |
|---|---|
| Plan review | Any in-app review UI, Cotality, or cortex BFF still in the city bundle. Canonical host is `https://plan-review-app-ten.vercel.app`. |
| Smart Files | Any local upload / blob table. City rooms must be a mount of `https://smart-files-padrd77ava-ue.a.run.app`, not a second store. |
| Map | Leaflet island versus `smartsite.cloud`. G-45 is adoption, not a second map. Keep the Leaflet island running until a named G-45 cutover. |

### Honest zeros (confirm, do not fill)

City-owned assets in the graph: **zero** (G-24, LIVE 2026-08-10 per doc 32). Bastrop's 74,729 parcels / 17,552 road nodes / 26,454 boundary edges are the public-record base, never assets under management.

The 2026-08-12 accessibility audit listed 139 SPA routes. That table is a finding aid for source mapping. It is not this walk list. Extra nav items found in today's bundle are appendix only unless they claim to be a product, in which case they become UNGRADED extras, not silent keep / mount / kill.

## Row format

One line per surface / feed:

`name | master | live path (URL + probe) | spine / vendor / mock / UI-only | writes a record? | keep / mount / kill | notes`

Master is exactly one of: Dashboards (31), Asset Management (32), Plan Review (33a), Smart Files (34), none.

Keep / mount / kill:

- **keep**: welded into `smartcity-os`, serving Bastrop staff today; cutting it breaks the live city. Leave until a named cutover.
- **mount**: already exists on its own host (SmartSite, Smart Files, plan-review). City should consume it. Do not reimplement.
- **kill**: not a master, oversell, UI-only theater, or a duplicate of Lane A or Lane C. Do not rebuild. Do not sell as a product. Removal is a later named card.

`writes a record?` means source + timestamp + accessPolicy on a node, or a live feed that vanishes when the vendor is down.

If the live-path column is not a live probe, the row is **UNGRADED**. Source comments and doc 30 are not grades.

## Probe law (binds every item)

Live hosts to probe (verify before quoting; they churn): `https://smartcityos.io` and `https://smartcity-api-7dyaiy7wha-uc.a.run.app`. GFE on `*.run.app` intercepts exact `/healthz`; prefer `GET /api/health` or `GET /`. A 200 on an SPA catch-all is not evidence a route exists (2026-08-12 audit). Grade from the handler / network target, not from the HTML shell.

Read-only means: inspect source, probe the **deployed** city URL, query public health / sync if it exists, read the atoms store for the G-24 zero (slot-free). It does not mean: commits, deploys, schema, seed, `tenant_id = 2` writes, a second `--apply`, an ICC store UPDATE, a G-58b DROP, or a "small fix while you are in there."

`P:\smartcity-os` and `P:\empressaio_tech_smartcity_os` are both absolute no-touch on live Bastrop. After this card is approved, source may be **read**. Nothing is written. Dirty `P:\legacy-design-tools` on `feat/s1-instrument-hardening` is never cleaned or stashed. Dirty `P:\hauska-map` is never the deploy vehicle (this wave deploys nothing).

Unauthenticated probes are the default. A 401 on a staff route is a live probe of the gate, not of the data class. Honesty for that row stays UNGRADED unless a public `sync_health` / health endpoint, a response body, or a deployed-bundle network target answers the class question. A staff session is used only if the operator supplies one for this card. Do not mint city users. Do not fake G-11.

L26 holds the atoms bulk-writer slot. Reads are allowed. No second `--apply`.

Scratch as you go: `_scratch/lane_b_g18.md` (LESSON / DEAD-END / GROUND-TRUTH with timestamp / OPEN). Do not self-promote to MEMORY.md.

## Acceptance items

1. **This card is approved.** Operator go on this WDLL. No inventory that opens `smartcity-os` even read-only at scale before that go.
   | check: this file Status is `approved` and Operator approval carries a date.
   | grade: [x] met 2026-08-17 | evidence: operator "approved proceed" in session. Card flipped draft to approved.
   | depends on: nothing

2. **Live city pin.** Serving revision of `smartcity-api` and the HTML / bundle identity on `smartcityos.io` are recorded before any row is graded, with timestamp.
   | check: `gcloud run services describe smartcity-api --project smartcity-os-prod` (read) plus `GET https://smartcityos.io` headers / bundle path. Pin is not the 2026-06-01 `00104-taw` figure in `10_ground_truth.md` unless that is still serving.
   | grade: [x] met 2026-08-17 | evidence: `smartcity-api-00118-qox` @100% tag `lane4` created 2026-08-01T23:04:24Z. `smartcityos.io` HTML last-modified 2026-08-01T23:02:34Z bundle `/assets/index-kGj7uMs4.js` 5578225 bytes. `/api/health` 200 `db=connected` 2026-08-17T12:45:58.714Z. `00104-taw` is a 0% tag.
   | depends on: 1

3. **CP1 walk-list freeze.** The frozen walk list above is the inventory. Any add is a WDLL amendment with a one-line reason.
   | check: `_inbox/2026-08-17_g18_cp1.json` exists, cites this WDLL, lists the six product rows, twelve feed rows, three hunts, and the G-24 zero. No extra product names.
   | grade: [x] met 2026-08-17 | evidence: `_inbox/2026-08-17_g18_cp1.json`. Walk list not expanded.
   | depends on: 1, 2

4. **Six product rows, live-probed.** Operations Dashboard, Parcel Intelligence, AI Plan Review / Codex 1b, CitizenConnect (including the two payment routes), Digital Twinning / 3D, Compass. Each is one inventory row in the named format.
   | check: each row has a live path (URL + status + what it hit) or UNGRADED with basis. Master is one of 31 / 32 / 33a / 34 / none.
   | grade: [x] met 2026-08-17 | evidence: inventory product table. Parcel Intelligence staff-click body UNGRADED (401). Payments UI-only graded from live bundle `Payment Complete` + `stripe.com=0`.
   | depends on: 3

5. **Twelve vendor-feed rows, live-probed.** The eleven doc-31 feeds plus Pipedrive. Each answers last-sync if observable, `sync_health` or not, scrape versus API, record versus paint.
   | check: each row live or UNGRADED. Aggregation-only paint is named as paint, not as Asset Management.
   | grade: [x] met 2026-08-17 | evidence: MyGov/Samsara/OpenGov/ArcGIS/calendar/Anthropic live JSON. Spireon/Verkada/FirstDue/GoTo/Power BI last-sync UNGRADED (401). Pipedrive no city UI.
   | depends on: 3

6. **Plan-review duplicate hunt.** Live city bundle and source (read-only) are searched for in-app review UI, Cotality / CoreLogic, and cortex plan-review BFF. Canonical review host remains `plan-review-app-ten.vercel.app`. G-51 is observed, not faked.
   | check: positive hits named with path, or a positive absence with the search used. Cotality is EXTINGUISHED: re-route observation only, never rotate a credential.
   | grade: [x] met 2026-08-17 | evidence: live bundle `permitflow=160` `plan-review=0` `cotality=0` `cortex-api=0`. `/permitflow/review` in serving route table.
   | depends on: 3

7. **Smart Files duplicate hunt.** Live city is searched for a local upload / blob table or files UI that is not a mount of the files service.
   | check: positive hits named, or positive absence. Cortex `/api/smart-files` staying 404 is not this hunt; this hunt is inside SmartCity.
   | grade: [x] met 2026-08-17 | evidence: bundle `smart-files=0`. origin/main `pf_documents` (`file_url` text). `/api/files` 401.
   | depends on: 3

8. **Map: Leaflet versus SmartSite.** Deployed bundle either embeds / links `smartsite.cloud/?parcelNodeId=` or is the Leaflet island. G-45 is not started. Leaflet keep until a named cutover is the default if the island is what staff use today.
   | check: live page or bundle string evidence, timestamped. Not a source comment.
   | grade: [x] met 2026-08-17 | evidence: bundle `leaflet=11` `smartsite.cloud=0`. CSP connect-src/frame-src cannot reach SmartSite.
   | depends on: 3

9. **G-24 zero re-confirmed, not filled.** City-owned asset nodes in the graph are still zero, with the query and timestamp. Public-record parcel / road / boundary counts are not counted as assets.
   | check: atoms-store READ (slot-free) or a documented public endpoint. Counting rule named next to the number. Do not ingest. If the query cannot be run without a `tenant_id = 2` write or a staff session the operator did not supply, the row is UNGRADED with that basis.
   | grade: [x] partial 2026-08-17 | evidence: type/schema/spine-pack layer is zero (PROPERTY_ENTITY_TYPES 16 has no hydrant/valve/main/lift-station; txgio_parcel 74729 and boundary 26454 are public-record). Atoms `COUNT` of a rogue entity_type UNGRADED (no SELECT; L26 holds slot). Not filled.
   | depends on: 3

10. **Do-not-touch list.** Anything `tenant_id = 2` that is actually serving Bastrop staff today is listed so a later composition surface does not cut it.
    | check: short list in the inventory, sourced from keep rows plus any live staff surface the probes hit. Empty list is allowed only with a positive basis.
    | grade: [x] met 2026-08-17 | evidence: inventory do-not-touch list (MyGov tables, fleet 84, municode calendar, Leaflet, PermitFlow, Prophecy/Power BI CSP).
    | depends on: 4, 5, 8

11. **CP2 before file.** Adversarial re-read of every graded row against this card, not against re-derived intent. At least one row is expected UNGRADED if a staff session was not supplied; a card with zero UNGRADED and no staff session is a defect.
    | check: `_inbox/2026-08-17_g18_cp2.json` exists. Divergence between source comments and live probes is named, not rounded off.
    | grade: [x] met 2026-08-17 | evidence: CP2 names 9 UNGRADED and the 340 vs 12599 / 64 vs 0 / municode-vs-Google / 00118-vs-00104 divergences.
    | depends on: 4, 5, 6, 7, 8, 9, 10

12. **Inventory filed and this card stops.** File `_inbox/2026-08-17_g18_smartcity_inventory.md`. Present keep / mount / kill. Do not start mounts. Do not rebuild. Do not deploy. First mounts after this card (later, named WDLL): SmartSite map, Smart Files city tenant rooms, plan review as a **function**. G-21 remains OPEN on the same rows. G-13 consumer contract remains OPEN. Housing of a future SmartCity composition surface is not decided on this card.
    | check: inventory exists; every walk-list name appears; close names G-21 still OPEN; live city git status on `smartcity-os` is unchanged from the pin in item 2; this wave's Vercel / Cloud Run deploy count is zero.
    | grade: [x] met 2026-08-17 | evidence: inventory + close. `P:\smartcity-os` porcelain still `secrets_scan.yml` + `mygov.ts`. Deploys 0. G-21 OPEN.
    | depends on: 11

## Out of scope

G-21 close. G-52 (MyGov permit to engagement). G-11 auth / tenancy fix. G-13 ruling. G-24 ingest. G-45 SmartSite cutover. G-60 resume. G-58b DROP. Second `--apply`. Second Hauska MCP server. Deleting reporting `cortex_*` tools. Visual redesign of the live city. SCADA. Private infra. Payments as a product. CitizenConnect as a product. Duplicate Smart Files. Duplicate plan-review. Filling the city-owned-asset zero. `npx vercel --prod` from any repo root. Doc_repo commit of the whole dirty tree (named list only, planner-owned, on operator go).

## Checkpoints and close

- CP1: `_inbox/2026-08-17_g18_cp1.json`
- CP2: `_inbox/2026-08-17_g18_cp2.json`
- Inventory: `_inbox/2026-08-17_g18_smartcity_inventory.md`
- Close: `_inbox/2026-08-17_g18_close.json` with `missionPremise`, `completionPredicate`, `scopeBasis`. `"not applicable: doc_repo lane"` for PR / SHA / CI fields.
- Compiled dispatch if handed off: `node scripts/dispatch.mjs --plan OPS-17 --lane B --plan-row G-18`

## Lessons that transfer (do not unlearn)

Citing product is not the access door. Extract then remount; do not glue a new product onto the live city. Own housing when leaving a silo; live Bastrop is not that housing. Map is live SmartSite on the citing surfaces; the city Leaflet island stays until G-45. Command Center is the operator console, not the city product. QA personas are not G-11. Code-done is not customer-done. Do not seed stores. Taking a persona off a dropdown hid live rooms; restore personas, never silent-DELETE store objects.

## Amendments

- 2026-08-17: product-line overlay filed (`_decisions/2026-08-17_smartcity_product_line_then_bastrop_onboarding.md`) because the operator ruled the product after as-found keep/kill. G-18 inventory is not reopened. Next cards G-13 + G-61, not a Bastrop rewrite.

## Finish card (graded at close)

Re-graded 2026-08-17 against the same item numbers. Inventory `_inbox/2026-08-17_g18_smartcity_inventory.md`. Close `_inbox/2026-08-17_g18_close.json`.

1. met: operator approved proceed
2. met: `00118-qox` @100% tag lane4; bundle `index-kGj7uMs4.js`
3. met: CP1 filed; walk list not expanded
4. met: six product rows; Parcel Intelligence staff body UNGRADED
5. met: twelve feed rows; five last-sync UNGRADED
6. met: PermitFlow duplicate live; Cotality absent
7. met: `pf_documents` local metadata store; no Smart Files mount
8. met: Leaflet island; `smartsite.cloud=0`
9. partial: type/schema/spine-pack zero; atoms COUNT UNGRADED
10. met: do-not-touch list filed
11. met: CP2; 9 UNGRADED; divergences named
12. met: inventory filed; stop; G-21 OPEN; zero deploys

Drift vs Start: item 9 is partial because no atoms SELECT was issued while L26 holds the slot. That is in-contract (UNGRADED basis), not silent fill.
