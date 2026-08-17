---
id: 2026-08-17_g63_feed_adapter_contract_WDLL
title: WDLL — Lane B G-63 feed adapter contract
status: graded
last_updated: 2026-08-17
applies_to: smartcity
owner: nick
related:
  [
    90_operations/OPS-17_govtech_stack_plan_of_record,
    _decisions/2026-08-17_g63_feed_adapter_contract,
    _decisions/2026-08-17_smartcity_product_line_then_bastrop_onboarding,
    _decisions/2026-08-17_g13_consumer_contract,
    _inbox/2026-08-17_g62_compose_honesty_WDLL,
    _inbox/2026-08-17_g61_dashboards_template_WDLL,
    _inbox/2026-08-17_g18_smartcity_inventory,
    _smartcity_masters/31_smartcity_dashboards,
    28_mcp_first_product_design,
    51_substrate_v1_sprint,
  ]
---

# WDLL: Lane B G-63 feed adapter contract

Date: 2026-08-17  Status: graded
Operator approval: 2026-08-17 (operator: approved)

Plan row: **G-63** (OPS-17, inserted by A-039). Blocked on G-62 CLOSED. Instrument: frozen WDLL approved; decision names the ingest contract; live adapter-kinds catalog exists; template-city `grantedAdapters` is []; live Bastrop unchanged.

This card is the adapter contract, not live MyGov or Samsara ingest, not G-11, and not G-24. Connecting a feed means a record with provenance. It does not mean a screen that renders vendor JSON.

Housing is [empressaioemail-tech/smartcity-dashboards](https://github.com/empressaioemail-tech/smartcity-dashboards). G-13 already says feed adapters are ingest, write records onto spine or files, and are not a fourth bus. Doc 31 refuses aggregation-only dashboards.

## Done looks like

A named contract says how a vendor feed becomes a record: provenance, accessPolicy, write target (spine or files), never a copied table in Dashboards Neon, never a DSN to MyGov or Samsara. Adapter kinds are a catalog on the Dashboards product and on the existing Hauska MCP server. `template-city` has zero granted adapters (honest: no city has granted a feed). Pipedrive is refused as a city feed. No atoms `--apply`. No live Bastrop credentials. No G-24 fill. Live `smartcityos.io` / `tenant_id=2` is unchanged.

## Acceptance items

1. **Operator approves this card.** Status flips from draft to approved before any adapter implementation.
   | check: this file `Operator approval:` dated; status `approved`.
   | grade: [x] met 2026-08-17 | evidence: operator said approved.
   | depends on: none

2. **Decision record names the contract.** Adapters write records onto spine or files with source, timestamp, and accessPolicy. They are ingest, not a product SKU and not a fourth bus. Dashboards does not grow a vendor table. Samsara fleet copies are not G-24 asset nodes.
   | check: `_decisions/2026-08-17_g63_feed_adapter_contract.md` exists and this WDLL cites it. G-13 is not rewritten.
   | grade: [x] met 2026-08-17 | evidence: decision `_decisions/2026-08-17_g63_feed_adapter_contract.md`; G-13 not rewritten.
   | depends on: 1

3. **Adapter kinds are catalogued, not granted.** Live `GET /api/adapter-kinds` on serving Dashboards lists named kinds (at least mygov, samsara, opengov, esri, municode, firstdue, verkada). Each kind declares `writesTo` (`spine` or `files`) and a default `accessPolicy`. `pipedrive` is absent and a shape test refuses it.
   | check: live JSON on Cloud Run after deploy; unit test refuses pipedrive and a local `mygov_permits` table as the write target.
   | grade: [x] met 2026-08-17 | evidence: serving `00004-zsq` live kinds seven ids; samsara writesTo files; pipedrive absent. Probe `_scratch/g63_dashboards_live_probe.json`.
   | depends on: 2

4. **template-city grants stay empty.** `grantedAdapters` on `template-city` is `[]`. A kind in the catalog is not a grant. Compose does not render a vendor JSON blob as the lens.
   | check: live `GET /api/city-packs/template-city` with Bearer; `grantedAdapters` length 0. Adversarial read: no Samsara/MyGov widget as the city-manager body.
   | grade: [x] met 2026-08-17 | evidence: Bearer pack grantedAdapters []. Compose keys lensId/cityKey/parcelNodeId/smartsite/atoms/filesRoom. No mygov widget.
   | depends on: 3

5. **Dual interface on the existing MCP.** Serving `hauska-mcp-server` exposes `dashboards_list_adapter_kinds`. Anonymous caller may invoke it. No second MCP. The tool does not return credentials or grant a city feed.
   | check: live `POST /mcp` anon tool call; CI four-set union still passes.
   | grade: [x] met 2026-08-17 | evidence: MCP `00080-voc` @100% tag g63. Anon tool returns seven kinds, samsara files, no credential leak. CI four-set conclusion success. Probe `_scratch/g63_mcp_serving_probe.json`.
   | depends on: 3

6. **No live ingest on this card.** Zero vendor API calls from Dashboards Cloud Run. Zero atoms `--apply`. Zero Smart Files fixture seed required. Zero rows added toward G-24.
   | check: close names G-24 still zero; L26 slot not taken; no MyGov/Samsara secret on the Dashboards service.
   | grade: [x] met 2026-08-17 | evidence: Dashboards secrets remain database-url, dashboards-api-key, hauska-retrieval-api-key, smart-files-api-key. No MyGov/Samsara secret. L26 not taken. G-24 still zero.
   | depends on: 1

7. **Live Bastrop unchanged.** `P:\smartcity-os` porcelain matches the G-18 pin dirty set. This wave's deploy count to `smartcity-os-prod` / `smartcityos.io` is zero.
   | check: git status on `P:\smartcity-os`; serving revision still `smartcity-api-00118-qox` unless a later pin supersedes.
   | grade: [x] met 2026-08-17 | evidence: dirty set secrets_scan.yml + mygov.ts. Serving `00118-qox` @100% tag lane4. City deploys this wave: 0.
   | depends on: 1

8. **This is not G-11 and not cutover.** Live vendor writes, tenant-private grant, Bastrop MyGov scrape retirement, and AM housing are later named cards. Close names them not started.
   | check: close artifact names G-11, G-45, PermitFlow kill, Compass, Bastrop cutover, G-24 ingest as not started.
   | grade: [x] met 2026-08-17 | evidence: close `_inbox/2026-08-17_g63_close.json` open list.
   | depends on: 7

## Out of scope

G-11 tenancy. Live MyGov scrape. Live Samsara API. Filling G-24. PermitFlow kill. Compass sidebar. Bastrop cutover. G-21 number reconciliation (340 vs 12599). Second MCP. `npx vercel --prod` onto the city. A Dashboards Neon table of permits or fleet rows. Treating `grantedAdapters: []` as a defect. Pipedrive as a city feed.

## Amendments

(none)

## Finish card (graded at close)

1. met: operator said approved 2026-08-17.
2. met: `_decisions/2026-08-17_g63_feed_adapter_contract.md`.
3. met: live `00004-zsq` GET `/api/adapter-kinds` seven kinds; samsara writesTo files; pipedrive absent.
4. met: template-city grantedAdapters []; compose is G-13 mounts only.
5. met: MCP `00080-voc` tag g63 anon `dashboards_list_adapter_kinds` seven kinds, no credentials.
6. met: no vendor secrets; L26 not taken; G-24 still zero.
7. met: city `00118-qox` @100% lane4; dirty set unchanged; zero city deploys.
8. met: close names G-11, G-45, PermitFlow kill, Compass, Bastrop cutover, G-24 ingest as not started.
