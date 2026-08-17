---
id: 2026-08-17_g64_lane_c_staff_path_WDLL
title: WDLL — Lane B G-64 Lane C staff path
status: graded
last_updated: 2026-08-17
applies_to: smartcity
owner: nick
related:
  [
    90_operations/OPS-17_govtech_stack_plan_of_record,
    _decisions/2026-08-17_g64_lane_c_staff_path,
    _decisions/2026-08-17_g13_consumer_contract,
    _decisions/2026-08-17_g45_smartsite_staff_map,
    _decisions/2026-08-17_smartcity_product_line_then_bastrop_onboarding,
    _inbox/2026-08-17_g18_smartcity_inventory,
    _inbox/2026-08-16_icc_demo_planner_pickup,
    _smartcity_masters/31_smartcity_dashboards,
    _smartcity_masters/33a_smartcity_plan_review,
    28_mcp_first_product_design,
    51_substrate_v1_sprint,
  ]
---

# WDLL: Lane B G-64 Lane C staff path

Date: 2026-08-17  Status: graded
Operator approval: 2026-08-17 (operator: both the others are approved as well)

Plan row: **G-64** (OPS-17, inserted by A-046). G-45 CLOSED. Instrument: frozen WDLL approved; Dashboards development-services mounts plan-review-app as the staff reviewer, verified on the deployed Dashboards surface; live Bastrop PermitFlow is not cut.

This card is the staff reviewer on the Dashboards product. It is not a G-51 re-grade of doc 48 F1-F7, not G-52 MyGov-record-in, not a G-60 resume, and not a live `/permitflow/*` deletion.

Housing is [empressaioemail-tech/smartcity-dashboards](https://github.com/empressaioemail-tech/smartcity-dashboards). Review host is `https://plan-review-app-ten.vercel.app` (API `https://plan-review-ozx33wafia-ue.a.run.app`). Wire is `_decisions/2026-08-17_g13_consumer_contract.md` (later same-pattern mount: plan-review over HTTP or embed).

## As-found (2026-08-17, this session)

Serving Dashboards `00006-vfk` GET `/` is the G-45 city-manager SmartSite embed of `48021:34137` (908 PINE). Served `app.js` length 3009: `permitflow=0`, `plan-review=0`, `development-services` absent from the JS file (lenses come from the API). HTML has Lead lenses. No review iframe.

Plan-review-app GET `/` 200 is a persona gate: Reviewer / Observer / Applicant for `icc-demo`, then Enter. Queue / Library / Code / Applicant / Gate links present. Plan-review Cloud Run GET `/` 200 `{ok:true,service:plan-review}` (HEAD `/` 404). G-60 CLOSED_ON_DEMO_PATH. G-18 already observed G-51 true on this C host.

Live `smartcityos.io` still ships PermitFlow (`permitflow=160`, `/permitflow/review` in the serving route table). City CSP cannot frame plan-review-app. That city path stays until a named cutover.

The C host exists. The G-64 instrument does not: a grader hitting Dashboards does not see plan-review as the staff reviewer.

## Done looks like

The Dashboards development-services lens is Lane C. Opening serving Dashboards with `?lens=development-services` shows `https://plan-review-app-ten.vercel.app/` without a Compose click. GET `/` without that query still auto-loads the G-45 gold SmartSite map (no regression). The same review URL is what anonymous or identified MCP already uses for Codex / plan-review tools (no second MCP; no new tool name unless compose lacks a `planReview.url` field). The icc-demo persona gate may still show; this card mounts the host, it does not mint a Bastrop reviewer. Live `/permitflow/*` stays. No `pf_documents` table in Dashboards. No atoms `--apply`.

## Acceptance items

1. **Operator approves this card.** Status flips from draft to approved before any staff-review implementation.
   | check: this file `Operator approval:` dated; status `approved`.
   | grade: [x] met 2026-08-17 | evidence: operator said both the others are approved as well.
   | depends on: none

2. **Staff reviewer is plan-review-app, not a third stack.** Decision record names the G-13 later mount. Dashboards does not grow PermitFlow, a `pf_documents` table, or a cloned reviewer. hauska-map is not touched.
   | check: decision `_decisions/2026-08-17_g64_lane_c_staff_path.md` active; Dashboards shape test still refuses `permitflow`; no new review store.
   | grade: [x] met 2026-08-17 | evidence: decision active; Dashboards PR #6 has no pf_documents; served GET `/app.js` permitflow=false; hauska-map not touched.
   | depends on: 1

3. **GET `/?lens=development-services` renders the C host.** Unauthenticated GET of serving Dashboards with that query auto-loads iframe `src` `https://plan-review-app-ten.vercel.app/` (path and query after the origin allowed). A Compose click is not required. GET `/` without the query still shows gold `48021:34137` SmartSite (G-45 must not regress).
   | check: live iframe `src` host is `plan-review-app-ten.vercel.app`; live GET `/` iframe host remains `smartsite.cloud` with `48021:34137`.
   | grade: [x] met 2026-08-17 | evidence: serving `00007-8sc` GET `/?lens=development-services` iframe src `https://plan-review-app-ten.vercel.app/` with no Compose click; GET `/` still gold `48021:34137` on smartsite.cloud.
   | depends on: 2

4. **Live browser: the reviewer is Lane C, not a URL string.** Browser probe of serving Dashboards `/?lens=development-services`: iframe host is plan-review-app; the PE/PermitFlow reviewer is not painted by Dashboards. Paired control: live `https://smartcityos.io` HTML/CSP still omits the plan-review Vercel host (PermitFlow island remains, on purpose).
   | check: screenshot or CDP `iframe.src` plus visible Plan review gate or queue; city CSP `frame-src` still Power BI / Prophecy only.
   | grade: [x] met 2026-08-17 | evidence: browser heading Plan Review; persona gate Reviewer / icc-demo Enter; Queue/Library/Code/Applicant/Gate visible; city CSP still Power BI / Prophecy only.
   | depends on: 3

5. **Dual interface on the existing MCP.** Serving MCP still exposes Codex / plan-review tools against plan-review Cloud Run. No second MCP. No G-60 residual store UPDATE. If Dashboards compose grows `planReview.url`, anonymous or identified `dashboards_compose_city_manager` (or the named compose for this lens) returns that same origin.
   | check: live `POST /mcp` Codex or dashboards tool; MCP serving pin unchanged unless a named PR is required for a URL field; `mcpPrsThisWave` reported.
   | grade: [x] met 2026-08-17 | evidence: anon MCP `dashboards_compose_city_manager` `data.planReview.url` is `https://plan-review-app-ten.vercel.app/`; MCP `00082-mat` tag g11 unchanged; mcpPrsThisWave=0.
   | depends on: 3

6. **Live Bastrop unchanged.** `P:\smartcity-os` porcelain matches the G-18 pin dirty set. This wave's deploy count to `smartcity-os-prod` / `smartcityos.io` is zero. L26 writer slot not taken. Serving city still `smartcity-api-00118-qox` unless a later pin supersedes.
   | check: git status on `P:\smartcity-os`; `gcloud run services describe` first 100% revision.
   | grade: [x] met 2026-08-17 | evidence: city `00118-qox` @100% tag lane4; dirty set secrets_scan.yml + mygov.ts; zero city deploys; L26 slot not taken; `/permitflow/review` still 200.
   | depends on: 1

7. **This is not G-51, G-52, or G-60 resume.** Close names as not started: G-51 OPS-17 re-grade, G-52 MyGov engagement, G-60 store UPDATE / F4 pending DID, live PermitFlow deletion, Compass sidebar, Bastrop tenant cutover, G-24 ingest, G-33, G-42.
   | check: close artifact lists those residuals. G-33 and G-42 stay OPEN. G-65 stays blocked until this card is graded.
   | grade: [x] met 2026-08-17 | evidence: close `_inbox/2026-08-17_g64_close.json` lists G-51 re-grade, G-52, G-60 residuals, live PermitFlow deletion, Compass, Bastrop cutover, G-24, G-33, G-42 as not started. G-65 unblocked by this grade.
   | depends on: 6

## Out of scope

Cutting `/permitflow/*` on `smartcityos.io`. DROPping `pf_*`. G-52. G-51 full F1-F7 re-grade. G-60 residuals. Minting a Bastrop reviewer key. Treating icc-demo Enter as city tenancy. Cloning PermitFlow into Dashboards. Second MCP. Atoms `--apply`. `npx vercel --prod` onto the city. Compass. Leaflet cut.

## Amendments

(none until operator go)

## Finish card (graded at close)

1. met: operator said both the others are approved as well 2026-08-17.
2. met: decision active; no pf_documents; served app.js permitflow=false; hauska-map not touched.
3. met: serving `00007-8sc` GET `/?lens=development-services` auto-loads plan-review-app; GET `/` still gold SmartSite.
4. met: browser shows Plan review persona gate; city CSP still omits plan-review-app.
5. met: anon MCP `data.planReview.url` matches iframe origin; no second MCP.
6. met: city `00118-qox` @100% tag lane4; dirty set unchanged; zero city deploys; L26 slot not taken.
7. met: close names G-51 re-grade, G-52, G-60 residuals, live PermitFlow deletion, Compass, Bastrop cutover, G-24, G-33, G-42 as not started. G-65 unblocked.
