---
id: 2026-08-17_g62_compose_honesty_WDLL
title: WDLL — Lane B G-62 Dashboards compose honesty
status: graded
last_updated: 2026-08-17
applies_to: smartcity
owner: nick
related:
  [
    90_operations/OPS-17_govtech_stack_plan_of_record,
    _decisions/2026-08-17_g62_compose_honesty_before_g11,
    _decisions/2026-08-17_g13_consumer_contract,
    _decisions/2026-08-17_smartcity_dashboards_housing,
    _inbox/2026-08-17_g61_dashboards_template_WDLL,
    _inbox/2026-08-17_g61_close.json,
    08_tiered_access_model,
    28_mcp_first_product_design,
    51_substrate_v1_sprint,
    80_adrs/adr_017_atom_access_control,
  ]
---

# WDLL: Lane B G-62 Dashboards compose honesty

Date: 2026-08-17  Status: graded
Operator approval: 2026-08-17 (operator: approved)

Plan row: **G-62** (OPS-17, inserted by A-038). Blocked on G-61 CLOSED. Instrument: frozen WDLL approved; unauthenticated city-manager compose atom-reads as anonymous; live gold types omit `owner-fact`; live Bastrop unchanged.

This card is a residue of G-61, not G-11. G-11 stays the longest pole: tenant-private refused to anonymous on every surface. Do not dispatch this work as G-11. Do not start feed adapters on this card. Do not start implementation until this file status is `approved`.

Housing is [empressaioemail-tech/smartcity-dashboards](https://github.com/empressaioemail-tech/smartcity-dashboards). Wire is `_decisions/2026-08-17_g13_consumer_contract.md` (atom-read HTTP: same accessPolicy as MCP). Live fail: unauthenticated GET compose on `48021:34137` lists `owner-fact` in `atoms.types` (`_scratch/g61_dashboards_live_probe.json` ts `2026-08-17T14:30:55.899Z`). MCP tests stamp `owner-fact` `public-paid` and withhold it for anonymous (`hauska-mcp-server` `tests/property-atom-chain.test.ts`).

## Done looks like

Unauthenticated city-manager compose on serving Dashboards atom-reads as an anonymous caller. Retrieval's service Bearer authenticates the product (live unauth GET retrieval is 401 without it) and is not a paid subject. `owner-fact` and any other non-public-free slot is omitted from compose `atoms.types` and `atomCount` using the atom `accessPolicy` on the chain wire, the same rule anonymous MCP uses. Files HTTP on that path does not present `SMART_FILES_API_KEY`. A named MCP tool on the existing Hauska MCP server returns the same honest compose. Live `smartcityos.io` / `tenant_id=2` is unchanged. Identified-caller compose and tenant-private on every surface remain G-11.

## Acceptance items

1. **Operator approves this card.** Status flips from draft to approved before any compose-honesty implementation.
   | check: this file `Operator approval:` dated; status `approved`.
   | grade: [x] met 2026-08-17 | evidence: operator said approved.
   | depends on: none

2. **Anonymous compose does not treat the retrieval service key as a paid subject.** Unauthenticated `GET /api/lenses/city-manager/compose` may send `Authorization: Bearer` with `HAUSKA_RETRIEVAL_API_KEY` or `HAUSKA_ENGINE_API_KEY` because live retrieval-api returns 401 without that service header (planner probe 2026-08-17, no types). That Bearer authenticates the product, not the HTTP caller. Types and atomCount include only atoms whose wire `accessPolicy` is `public-free` (missing defaults public-free, matching retrieval). `public-paid` (including `owner-fact`) is omitted. `DASHBOARDS_API_KEY` is not an accessPolicy subject; presenting it must not unlock paid slots.
   | check: unit test: retrieval fetch MAY carry the service Bearer when the key is in env; a chain body that includes `{ type: "owner-fact", accessPolicy: "public-paid" }` plus a public-free zoning-fact yields types without `owner-fact`. Code review: no hardcoded owner-fact denylist; filter is accessPolicy. Do not drop the Bearer (that 401s the whole chain).
   | grade: [x] met 2026-08-17 | evidence: Dashboards PR #2 `src/compose.test.mjs`; `compose.mjs` allowlists public-free; no owner-fact denylist.
   | depends on: 1

3. **Live gold types match anonymous MCP withhold.** Unauthenticated live GET `https://smartcity-dashboards-52ecsl5mvq-ue.a.run.app/api/lenses/city-manager/compose?parcelNodeId=48021:34137&cityKey=template-city` has `atoms.types` that does not include `owner-fact`. Paired control: anonymous MCP `get_property_atom_chain` on the same parcel withholds `owner-fact`. Compose still returns counts and types only (no atom bodies).
   | check: live JSON on serving Dashboards after deploy; live MCP anon probe; types list captured in close.
   | grade: [x] met 2026-08-17 | evidence: live GET compose 48021:34137 atomCount 9 types omit owner-fact. `_scratch/g62_dashboards_live_probe.json`. Anon MCP atom-chain withholds owner-fact.
   | depends on: 2

4. **Anonymous compose does not impersonate files.** Unauthenticated compose does not send `SMART_FILES_API_KEY`. If files HTTP is unauthorized or unavailable, the basis names that class. It does not invent an empty room to hide a 401.
   | check: unit test asserts files fetch omits that key on the unauthenticated path. Live compose files status is empty or unavailable with a named basis, not a leaked folder list.
   | grade: [x] met 2026-08-17 | evidence: live files unavailable / files auth refused. Test omits SMART_FILES_API_KEY.
   | depends on: 1

5. **Dual interface on the existing MCP.** Serving `hauska-mcp-server` exposes `dashboards_compose_city_manager` (name may be this string). Anonymous caller may invoke it. The tool hits the same Dashboards compose URL. Live anon tool result omits `owner-fact` for `48021:34137`. No second MCP process. Do not route this tool through the engine key.
   | check: live `POST /mcp` anon tool call; `DASHBOARDS_BACKEND_URL` still the Dashboards Cloud Run; CI four-set union still passes.
   | grade: [x] met 2026-08-17 | evidence: serving `00078-xuv` @100% tag g62. Anon `dashboards_compose_city_manager` types omit owner-fact. PR #71 CI all success. No second MCP.
   | depends on: 3, 4

6. **Live Bastrop unchanged.** `P:\smartcity-os` porcelain matches the G-18 pin dirty set. This wave's Cloud Run / Vercel deploy count to `smartcity-os-prod` / `smartcityos.io` is zero. L26 writer slot not taken.
   | check: git status on `P:\smartcity-os`; serving revision still `smartcity-api-00118-qox` unless a later pin supersedes; deploy count zero.
   | grade: [x] met 2026-08-17 | evidence: porcelain still secrets_scan.yml + mygov.ts. Serving 00118-qox @100% lane4. Zero city deploys.
   | depends on: 1

7. **This is not G-11.** Identified-caller compose, tenant-private refused on every surface, Bastrop cutover, and feed adapters are later named cards. Close names them not started.
   | check: close artifact names G-11, feed adapter contract, G-45, PermitFlow kill, Compass, Bastrop cutover, G-24 ingest as not started.
   | grade: [x] met 2026-08-17 | evidence: close `_inbox/2026-08-17_g62_close.json` names those WDLLs not started. G-11 remains OPEN.
   | depends on: 6

## Out of scope

G-11 tenancy sprint. Feed adapter contract. G-45 Leaflet die. PermitFlow kill. Compass sidebar. Bastrop cutover. AM housing. G-24 ingest. G-21 inventory close. G-52. G-60 resume. Second MCP. `npx vercel --prod` from any repo root onto the city. A hardcoded `owner-fact` denylist (filter is accessPolicy on the wire). Unlocking paid slots because the caller presented `DASHBOARDS_API_KEY`. Omitting the retrieval service Bearer so compose 401s instead of serving public-free types. Changing retrieval-api auth or deploying hauska-engine on this card.

## Amendments

- 2026-08-17: Item 2 restated. Live retrieval-api 401s without the service Bearer, so "no Authorization" would make compose unavailable instead of anonymous. Reason: service token authenticates the product; accessPolicy on the chain wire withholds public-paid. Planner probe: GET retrieval atom-chain unauth status 401.

## Finish card (graded at close)

Re-graded 2026-08-17 against the same item numbers. Close `_inbox/2026-08-17_g62_close.json`. Serving Dashboards `00003-jc2`, MCP `00078-xuv` tag `g62`. City `00118-qox` tag `lane4`.

1. met: operator approved
2. met: accessPolicy allowlist on compose; retrieval Bearer kept
3. met: live gold types omit owner-fact, atomCount 9
4. met: files unavailable / files auth refused
5. met: live anon dashboards_compose_city_manager omits owner-fact
6. met: live city pin unchanged, dirty set unchanged, zero city deploys
7. met: G-11 and cutover WDLLs named as not started

Drift vs Start: item 2 restated after live retrieval 401 (amendment). Live files basis moved from G-61 honest-empty (with service key) to files auth refused (no key). parcel-terrain-model also dropped with owner-fact (public-paid class).
