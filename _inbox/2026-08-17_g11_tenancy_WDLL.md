---
id: 2026-08-17_g11_tenancy_WDLL
title: WDLL — Lane B G-11 city-pack tenancy
status: graded
last_updated: 2026-08-17
applies_to: smartcity
owner: nick
related:
  [
    90_operations/OPS-17_govtech_stack_plan_of_record,
    _decisions/2026-08-17_g11_city_pack_tenancy,
    _decisions/2026-08-17_g63_feed_adapter_contract,
    _decisions/2026-08-17_g62_compose_honesty_before_g11,
    _decisions/2026-08-17_g13_consumer_contract,
    _decisions/2026-08-17_smartcity_dashboards_housing,
    _inbox/2026-08-17_g63_feed_adapter_contract_WDLL,
    54_tenant_leg_sprint,
    80_adrs/adr_005_multitenancy,
    80_adrs/adr_017_atom_access_control,
    08_tiered_access_model,
    28_mcp_first_product_design,
    51_substrate_v1_sprint,
  ]
---

# WDLL: Lane B G-11 city-pack tenancy

Date: 2026-08-17  Status: graded
Operator approval: 2026-08-17 (operator: wdll approved)

Plan row: **G-11** (OPS-17 shared leg S-1). Blocked on G-63 CLOSED. Instrument for this card: frozen WDLL approved; a city pack is a tenant; anonymous and the Dashboards service key are refused tenant-private on Dashboards HTTP and the existing Hauska MCP; live Bastrop unchanged.

This card establishes and sequences S-1 for the Dashboards product. It does not finish sprint-54. It does not grant live MyGov or Samsara. It does not mint a Bastrop-authenticated caller. This file is approved. Implementation may start. Live Bastrop stays no-touch.

Housing is [empressaioemail-tech/smartcity-dashboards](https://github.com/empressaioemail-tech/smartcity-dashboards). Wire is `_decisions/2026-08-17_g13_consumer_contract.md`. Isolation is accessPolicy plus tenant scope, not git (`_decisions/2026-08-17_smartcity_dashboards_housing.md`). G-62 already ruled `DASHBOARDS_API_KEY` is not an accessPolicy subject. ADR-005 Layer A already binds `jurisdiction_tenant` on the Hauska product key (MCP #29).

## Done looks like

A city pack is the tenant. `template-city` stays the public template. A second fixture pack `fixture-city` is tenant-private. Anonymous callers and the Dashboards service Bearer cannot read that pack or tenant-private compose slots. An identified caller is a Hauska product key whose `jurisdiction_tenant` equals the pack `cityKey`. That subject can read its pack and cannot read another pack's private material. Compose still filters `accessPolicy` on the chain wire (G-62 public-paid rule extended to tenant-private). Dual interface stays on the existing Hauska MCP server. No atoms `--apply`. No live vendor ingest. Live `smartcityos.io` / `tenant_id=2` is unchanged. Sprint-54 T2 writes, T3 real second tenant, Cortex anonymous default tenant, claim flow, G-33, and G-42 remain named residuals.

## Acceptance items

1. **Operator approves this card.** Status flips from draft to approved before any tenancy implementation.
   | check: this file `Operator approval:` dated; status `approved`.
   | grade: [x] met 2026-08-17 | evidence: operator said wdll approved.
   | depends on: none

2. **Decision record names the contract.** A city pack is a tenant, not a repo. Isolation is accessPolicy plus tenant scope. `DASHBOARDS_API_KEY` is a service token, not a tenant. The identified caller is a Hauska product key with `jurisdiction_tenant` equal to `cityKey`. Sprint-54 T1-T3 are sequenced, not absorbed.
   | check: `_decisions/2026-08-17_g11_city_pack_tenancy.md` exists and this WDLL cites it. G-13 and G-62 are not rewritten.
   | grade: [x] met 2026-08-17 | evidence: `_decisions/2026-08-17_g11_city_pack_tenancy.md` active; G-13 and G-62 not rewritten.
   | depends on: 1

3. **Fixture pack exists and is not a connected feed.** Live Dashboards holds `fixture-city` as a city pack. It is not Bastrop and not a fork. `grantedAdapters` is `[]`. A kind in the G-63 catalog is still not a grant.
   | check: Bearer or identified GET `/api/city-packs/fixture-city` returns that cityKey; `grantedAdapters` length 0. Pack is absent from unauth public list if one exists.
   | grade: [x] met 2026-08-17 | evidence: identified GET on Dashboards `00005-m5t` returns cityKey fixture-city, accessPolicy tenant-private, grantedAdapters []. Service list omits it. Not Bastrop.
   | depends on: 2

4. **Anonymous and the service key are refused tenant-private.** Unauthenticated GET `/api/city-packs/fixture-city` is 401. Presenting `DASHBOARDS_API_KEY` does not unlock `fixture-city`. Unauthenticated city-manager compose on the gold parcel still omits `owner-fact` (G-62 stands) and omits any `accessPolicy: tenant-private` type.
   | check: live HTTP on serving Dashboards; unit test: service Bearer must not be treated as `fixture-city`. Compose filter is accessPolicy, not a denylist of types.
   | grade: [x] met 2026-08-17 | evidence: live unauth GET 401; Bearer GET 403; unauth compose 48021:34137 atomCount 9 omits owner-fact; no tenant-private types.
   | depends on: 3

5. **Cross-pack refuse.** A `fixture-city` subject can read the `fixture-city` pack. The same subject cannot read another pack's private material. A `template-city` or service subject cannot read `fixture-city`.
   | check: paired live probes, captured in close. Wrong-tenant is 401/403 or isError, not an empty successful pack body that hides the leak.
   | grade: [x] met 2026-08-17 | evidence: fixture key HTTP 200; other-city key HTTP 403; MCP wrong tenant isError before HTTP. Probe `_scratch/g11_live_probe.json`.
   | depends on: 4

6. **Dual interface on the existing MCP.** Identified `dashboards_get_city_pack` with a Hauska product key `jurisdiction_tenant=fixture-city` returns that pack. Anonymous remains isError refused. A product key bound to a different tenant is refused. No second MCP. Probe keys minted for the grade are revoked in the close.
   | check: live `POST /mcp` identified and anon; CI four-set union still passes.
   | grade: [x] met 2026-08-17 | evidence: MCP `00082-mat` tag g11. Identified returns fixture-city grants []. Anon isError. Wrong tenant isError. Keys b878e7e7 and 19237a42 revoked 200. CI four-set all success (run 32049893436).
   | depends on: 5

7. **Tenant-private atom withhold without `--apply`.** Compose unit test: a chain body that includes `{ accessPolicy: "tenant-private" }` is omitted for anonymous and for the service key, and included only for the matching pack subject. Live anonymous MCP still withholds an existing tenant-private seed (files room or atom already in store). This card does not mint atoms and does not take the L26 writer slot.
   | check: unit test in Dashboards; live MCP anon deny captured; close names atomsApply=0.
   | grade: [x] met 2026-08-17 | evidence: Dashboards compose unit test matching tenant only. Live MCP anon compose filesRoom unavailable files auth refused; owner-fact omitted. atomsApply=0. L26 slot not taken.
   | depends on: 4

8. **Live Bastrop unchanged.** `P:\smartcity-os` porcelain matches the G-18 pin dirty set. This wave's deploy count to `smartcity-os-prod` / `smartcityos.io` is zero. L26 writer slot not taken. G-24 still zero. No MyGov or Samsara secret on Dashboards Cloud Run.
   | check: git status on `P:\smartcity-os`; serving revision still `smartcity-api-00118-qox` unless a later pin supersedes.
   | grade: [x] met 2026-08-17 | evidence: dirty set secrets_scan.yml + mygov.ts. Serving `00118-qox` @100% tag lane4. City deploys this wave: 0. Dashboards env has no MyGov or Samsara secret.
   | depends on: 1

9. **This is sequencing, not sprint-54 done.** Close names as not started: sprint-54 T2 tenant-private write primitive, T3 real second tenant plus ADR-005 Layer B load test, Cortex anonymous default tenant, claim flow / Clerk, G-33 Bastrop infra, G-42 Bastrop lenses, live vendor grants, G-45, PermitFlow kill, Compass, Bastrop cutover, G-24 ingest.
   | check: close artifact lists those residuals. G-33 and G-42 stay OPEN and do not silently unblock.
   | grade: [x] met 2026-08-17 | evidence: close `_inbox/2026-08-17_g11_close.json` open list. G-33 and G-42 remain OPEN in OPS-17.
   | depends on: 8

## Out of scope

Sprint-54 T1 rewrite of every reasoning tool. Tenant-private atom writes. Atoms `--apply`. Live MyGov or Samsara. Filling G-24. Clerk / OAuth / claim flow. Cortex anonymous default tenant. Live Bastrop `tenant_id=2`. G-45 Leaflet die. PermitFlow kill. Compass sidebar. Bastrop cutover. Treating `grantedAdapters: []` as a defect. Second MCP. `npx vercel --prod` onto the city. Unlocking `fixture-city` because the caller presented `DASHBOARDS_API_KEY`.

## Amendments

(none until operator go)

## Finish card (graded at close)

1. met: operator said wdll approved 2026-08-17.
2. met: `_decisions/2026-08-17_g11_city_pack_tenancy.md` active.
3. met: live `00005-m5t` identified GET fixture-city tenant-private grants [].
4. met: unauth 401; Bearer 403; unauth compose omits owner-fact.
5. met: fixture key 200; other-city 403; MCP wrong tenant isError.
6. met: MCP `00082-mat` tag g11 identified pack; anon isError; probe keys revoked.
7. met: compose unit test plus live MCP anon filesRoom withheld; atomsApply=0.
8. met: city `00118-qox` @100% tag lane4; dirty set unchanged; zero city deploys.
9. met: close names sprint-54 T2/T3, Cortex default tenant, claim flow, G-33, G-42, G-45, PermitFlow kill, Compass, Bastrop cutover, G-24 ingest as not started. G-33 and G-42 stay OPEN.
