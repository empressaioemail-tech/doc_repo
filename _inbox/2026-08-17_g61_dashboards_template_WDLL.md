---
id: 2026-08-17_g61_dashboards_template_WDLL
title: WDLL — Lane B G-61 Dashboards product template
status: approved
last_updated: 2026-08-17
applies_to: smartcity
owner: nick
related:
  [
    90_operations/OPS-17_govtech_stack_plan_of_record,
    _decisions/2026-08-17_smartcity_product_line_then_bastrop_onboarding,
    _decisions/2026-08-17_g13_consumer_contract,
    _decisions/2026-08-17_smartcity_dashboards_housing,
    _inbox/2026-08-17_g13_consumer_contract_WDLL,
    _inbox/2026-08-17_g18_smartcity_inventory,
    _smartcity_masters/31_smartcity_dashboards,
    _decisions/2026-08-15_capability_mount_composition,
    28_mcp_first_product_design,
  ]
---

# WDLL: Lane B G-61 Dashboards product template

Date: 2026-08-17  Status: approved
Operator approval: 2026-08-17 (operator: both are approved)

Plan row: **G-61** (OPS-17, inserted by A-035). G-13 CLOSED 2026-08-17. Instrument: frozen WDLL approved; template mounts spine + SmartSite + Smart Files; live Bastrop unchanged.

This card is the Dashboards product, not a Bastrop rewrite. Housing is [empressaioemail-tech/smartcity-dashboards](https://github.com/empressaioemail-tech/smartcity-dashboards), local clone `P:\smartcity-dashboards`. The wire is `_decisions/2026-08-17_g13_consumer_contract.md`.

## Done looks like

A Dashboards template exists as a composition surface: the doc 31 lens family (city manager, development services, finance, citizen) over one record, not a clone of the live Bastrop vendor wallpaper. Lenses read Hauska spine, SmartSite map, and Smart Files rooms through the G-13 consumer contract. A vendor feed is not a product; if a feed is shown it is because an adapter wrote a record. Live `smartcityos.io` / `tenant_id=2` is unchanged: zero commits, zero deploys, zero schema, zero seed to the serving city. Bastrop migration is a later named cutover WDLL, not this row.

## Acceptance items

1. **Operator approves this card.** Status flips from draft to approved before any template implementation.
   | check: this file `Operator approval:` dated; status `approved`.
   | grade: [x] met 2026-08-17 | evidence: operator said both are approved.
   | depends on: none

2. **G-13 is closed.** The B integration plan cites the consumer contract. This card does not invent a private mount shape.
   | check: G-13 decision record exists; this WDLL related list names it; no second Hauska MCP server in the template design.
   | grade: [x] met 2026-08-17 | evidence: `_decisions/2026-08-17_g13_consumer_contract.md`; this related list cites it.
   | depends on: 1, G-13

3. **Four lead lenses are named and permissioned.** City manager, development services, finance, citizen. Citizen is a lens, not a SKU named CitizenConnect. Payments are not claimed.
   | check: template surface or spec names the four; citizen copy does not say CitizenConnect; no payment-complete path ships.
   | grade: [x] met 2026-08-17 | evidence: `P:\smartcity-dashboards\src\lenses.mjs` ids city-manager, development-services, finance, citizen; citizen `skuName=null` `payments=false`; tests `src/lenses.test.mjs`.
   | depends on: 1

4. **Not a wallpaper clone.** The template does not ship MyGov / Samsara / OpenGov widgets as the product. Connecting a feed means a record with provenance.
   | check: adversarial read against doc 31 "we do not sell a dashboard that only visualizes a vendor feed"; live Bastrop bundle strings are not the template architecture.
   | grade: [x] met 2026-08-17 | evidence: four lenses over a city pack; grantedAdapters empty on template-city; shape test refuses permitflow/leaflet/stripe.com/pipedrive/CitizenConnect on src+web (except the denylist file).
   | depends on: 1, 3

5. **Mounts, not merges.** Template consumes spine, SmartSite, and Smart Files over the G-13 contract. It does not copy parcels into a second stack, files into `pf_documents`, or review into PermitFlow.
   | check: no new parcel store; no PermitFlow; no local blob table; SmartSite is the map mount; Smart Files is the files mount.
   | grade: [x] met 2026-08-17 | evidence: `src/mounts.mjs` atom-read-http / embed / service-http; `assertNoSupplierDsn` refuses tiny-art and any DATABASE_URL; SmartSite URL is `/?parcelNodeId=`; no pg dependency.
   | depends on: 2

6. **Dual interface.** MCP tools plus UI, per 28. Tools live on the existing Hauska MCP server.
   | check: named MCP tools on serving `hauska-mcp-server`; UI second or same wave; no new MCP process.
   | grade: [ ] partial 2026-08-17 | evidence: tools exist on hauska-mcp-server branch `g61/dashboards-mcp-tools` (`dashboards_list_lenses` public/anon; `dashboards_get_city_pack` identified). Not on serving `00074-tar`. No second MCP process. Fail closed if `DASHBOARDS_BACKEND_URL` unset.
   | depends on: 2

7. **Live Bastrop unchanged.** `P:\smartcity-os` porcelain matches the G-18 pin dirty set. This wave's Cloud Run / Vercel deploy count to `smartcity-os-prod` / `smartcityos.io` is zero.
   | check: git status on `P:\smartcity-os`; serving revision still `smartcity-api-00118-qox` unless a later pin supersedes; deploy count zero.
   | grade: [x] met 2026-08-17 | evidence: `P:\smartcity-os` still `ci/dast-issues-write-permission` with dirty `.github/workflows/secrets_scan.yml` and `server/routes/mygov.ts` only. Zero deploys from this wave. Product clone is `P:\smartcity-dashboards`, not a fork of the city.
   | depends on: 1

8. **Cutover is not this card.** A later named WDLL covers Bastrop tenant migration, PermitFlow kill, Leaflet retirement, Compass rework, G-45 parcel, and feed adapters.
   | check: close artifact names those WDLLs as not started; G-52 not started; G-24 not filled.
   | grade: [ ]
   | depends on: 7

## Out of scope

G-13 implementation (separate card). G-21 close. G-42 Bastrop-specific lenses (needs G-11). G-45 cutover. G-52. G-11. G-24 ingest. PermitFlow deletion on the live city. Compass sidebar ship. Payments. Second `--apply`. G-60 resume. `npx vercel --prod` from any repo root onto the city.

## Amendments

- 2026-08-17: G-13 closed same day; item 2 unblocked. Build still not started because housing is unnamed.
- 2026-08-17: Housing named `empressaioemail-tech/smartcity-dashboards`. One product repo, cities as tenant packs. Build may start. Reason: operator created the remote.

## Finish card (graded at close)

(not yet)
