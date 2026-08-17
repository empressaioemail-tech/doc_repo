---
decision_id: 2026-08-17_g13_consumer_contract
date: 2026-08-17
owner: nick
status: active
related_canonical:
  [
    _inbox/2026-08-17_g13_consumer_contract_WDLL,
    _inbox/2026-08-17_g61_dashboards_template_WDLL,
    _decisions/2026-08-17_smartcity_product_line_then_bastrop_onboarding,
    _decisions/2026-08-15_capability_mount_composition,
    _decisions/2026-08-15_smart_files_independent_module,
    _decisions/2026-08-16_plan_review_extract_and_remount,
    _inbox/2026-08-16_ops17_four_lane_alignment,
    90_operations/OPS-17_govtech_stack_plan_of_record,
    28_mcp_first_product_design,
    51_substrate_v1_sprint,
    80_adrs/adr_008_engine_factor_out,
  ]
---

# Decision

SmartCity (and every later Empressa surface) consumes Hauska spine, SmartSite, and Smart Files by a single caller-split contract: agents through one Hauska MCP server; applications through HTTP service-token mount or embed; never a DSN and never a copied table. The pattern is once. The HTTP target is named per supplier because the stores are isolated. There is no fourth private bus.

## Context

OPS-17 G-13 instrument: a decision record; the B integration plan cites it. Lane A and Lane C already shipped this shape without closing S-5: UI HTTP to the product Cloud Run, agents on one Hauska MCP (`_inbox/2026-08-16_ops17_four_lane_alignment.md`). G-61 cannot invent a private mount. Operator approved the G-13 WDLL 2026-08-17.

Capability-mount composition already forbids merged databases. This record chooses the wire.

## The contract

| Supplier | Agent | Application | Forbidden |
|---|---|---|---|
| Hauska spine (atoms) | Tools on the existing Hauska MCP server (atom list/get/chain). accessPolicy at that gate. | Atom-read HTTP: retrieval-api / engine-api. Same accessPolicy. No spine DSN on the consumer. | Copying atoms into `smartcity-os` (or any city DB) as the system of record |
| SmartSite (map / parcel) | MCP map-gate tools on the same server | Embed `smartsite.cloud/?parcelNodeId=` (same mount plan-review and Property Explorer already use). Consumer CSP must allow that host. | Leaflet island, a second parcel stack, a map that cannot reach `smartsite.cloud` |
| Smart Files | MCP files tools on the same server | HTTP to the files Cloud Run (`SMART_FILES_BACKEND_URL` + service API key). No files DSN on the consumer. Default accessPolicy tenant-private. | `pf_documents` as a files store, cortex `smart_file_*` as the live store, files DSN on SmartCity |

Caller split, not category split. Dashboards, Asset Management, and Plan Review as SmartCity categories all use this table. They do not each pick MCP or HTTP.

Plan Review as a product already follows the same pattern (Cloud Run HTTP + Codex tools on the one MCP). SmartCity mounts it later the same way. That does not add a fourth G-13 supplier.

Vendor feed adapters are ingest. They write records onto spine or files. They are not a consumer contract and not a fourth bus.

UI-only composition is not a mount. A screen that renders a vendor JSON blob and does not call MCP or the supplier HTTP fails this record and fails doc 31.

## Structural commitment check

- Sell reasoning, not data: mounts return records with provenance and accessPolicy, not a blob dump.
- Tenant sovereignty: files stay tenant-private by default. Unauth city ops leak is a G-21 item, not a Layer 1 catalog.
- Dual interface (28): MCP plus HTTP/embed. Net-new Dashboards template is MCP-first with UI as the second surface on this contract.
- MCP v1 (51): one Hauska MCP server, many tools. Retarget tools at the supplier service. No second MCP.
- Brand (ADR-008): spine is Hauska. SmartSite, Smart Files, SmartCity are Empressa surfaces that mount.
- Catalog thesis: aligned. Yellow if G-61 copies parcels or files into a city database so the dashboard "has its own data."

## Reasoning

Three isolated stores cannot share a client DSN without becoming one store. The Lane A files mount and the Lane C plan-review remount already prove the alternative: the application carries a URL and a service token; the agent carries an MCP tool that hits the same service. Spine is the same shape with a different HTTP name (retrieval atom-read) because the public catalog is not a product Cloud Run.

Naming MCP or HTTP per category would let Dashboards speak MCP while Asset Management copies Samsara into Postgres. That is the live Bastrop failure. The caller split kills it once.

G-11 stays OPEN. This contract does not claim SmartCity tenancy is enforced. It claims that when a consumer talks to a supplier, it talks over this wire.

## Reversal criteria

Reverse the caller split only if a named consumer cannot attach a second service without a DSN and that blocker is accepted in writing. Reverse "one Hauska MCP server" only if 51 is amended. Reverse the SmartSite embed target only if G-45 names a different live map host. Do not use this record to cut live Bastrop Leaflet or PermitFlow. Do not use it to fill G-24.

## Dependencies

Closes G-13. Unblocks G-61 item 2. Cites `_decisions/2026-08-15_capability_mount_composition.md` and does not reopen housing. G-61 WDLL `_inbox/2026-08-17_g61_dashboards_template_WDLL.md` is the B integration plan that must cite this id. G-11, G-45, G-52 remain OPEN. Live `P:\smartcity-os` remains no-touch. L26 writer slot untouched.

## Counterparties

Internal: operator, Lane B planner. Suppliers: Hauska spine (retrieval + MCP), SmartSite, Smart Files. Later same-pattern mount: plan-review Cloud Run. Not a Vertosoft close. Not G-11.
