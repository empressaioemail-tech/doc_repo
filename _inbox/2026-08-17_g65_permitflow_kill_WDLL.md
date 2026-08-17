---
id: 2026-08-17_g65_permitflow_kill_WDLL
title: WDLL — Lane B G-65 PermitFlow kill as a product
status: graded
last_updated: 2026-08-17
applies_to: smartcity
owner: nick
related:
  [
    90_operations/OPS-17_govtech_stack_plan_of_record,
    _decisions/2026-08-17_g65_permitflow_kill,
    _decisions/2026-08-17_g64_lane_c_staff_path,
    _inbox/2026-08-17_g64_lane_c_staff_path_WDLL,
    _decisions/2026-08-17_smartcity_product_line_then_bastrop_onboarding,
    _inbox/2026-08-17_g18_smartcity_inventory,
    _smartcity_masters/33a_smartcity_plan_review,
  ]
---

# WDLL: Lane B G-65 PermitFlow kill as a product

Date: 2026-08-17  Status: graded
Operator approval: 2026-08-17 (operator: both the others are approved as well). G-64 graded 2026-08-17.

Plan row: **G-65** (OPS-17, inserted by A-047). Blocked on G-64 graded. Instrument: frozen WDLL approved; PermitFlow is dead as a Dashboards product; live Bastrop `/permitflow/*` is not cut.

This card is the product kill. It is not a live city deletion, not a `pf_*` DROP, and not G-52.

## As-found (2026-08-17, this session)

Dashboards `00006-vfk` served `app.js` already has zero `permitflow`. Live city bundle still has `permitflow=160` and `/permitflow/review` in the serving route table. G-18 listed that path as do-not-touch because it is today's staff reviewer. G-64 is the replacement mount on the template. Until G-64 is graded, killing PermitFlow as a product is a slogan.

## Done looks like

After G-64, the staff reviewer on Dashboards is plan-review-app. Dashboards source and served JS contain zero `permitflow`. Live `smartcityos.io` still serves `/permitflow/*` (paired control, on purpose). `pf_documents` is not DROPped. No city deploy. No G-52. Close names the live island cut as Bastrop tenant cutover, not this card.

## Acceptance items

1. **Operator approves this card.** Status flips from draft to approved. Build does not start until G-64 is graded, even if this file is approved earlier.
   | check: this file `Operator approval:` dated; status `approved`; G-64 WDLL status `graded`.
   | grade: [x] met 2026-08-17 | evidence: operator said both the others are approved as well; G-64 WDLL status graded; close `_inbox/2026-08-17_g64_close.json`.
   | depends on: G-64

2. **PermitFlow is not a Dashboards product.** Served Dashboards HTML+JS has zero `permitflow`. No `/permitflow` route on the Dashboards Cloud Run. Development-services is the review entry from G-64.
   | check: live GET `/app.js` and GET `/` string counts; live GET `/?lens=development-services` iframe host is plan-review-app.
   | grade: [x] met 2026-08-17 | evidence: serving `00007-8sc` GET `/app.js` permitflow=0; GET `/` permitflow=0; GET `/permitflow` 404; GET `/permitflow/review` 404; development-services iframe is plan-review-app.
   | depends on: 1

3. **Paired control: live city island remains.** `https://smartcityos.io` still has PermitFlow in the bundle or serving route table. City pin still `00118-qox` unless a later pin supersedes. Zero deploys to `smartcity-os-prod`.
   | check: live bundle or route table still names `/permitflow`; `gcloud` first 100% revision; git status dirty set unchanged.
   | grade: [x] met 2026-08-17 | evidence: city bundle `index-kGj7uMs4.js` permitflow=160; GET `https://smartcityos.io/permitflow/review` 200; city `00118-qox` @100% lane4; dirty set unchanged; zero city deploys.
   | depends on: 1

4. **`pf_documents` is not DROPped.** No migration against the city DB. No Dashboards table of that name.
   | check: this wave issues zero DDL against smartcity-os; Dashboards schema still packs-only.
   | grade: [x] met 2026-08-17 | evidence: this wave issued zero DDL against smartcity-os; Dashboards still packs-only Neon; no Dashboards `pf_documents` table.
   | depends on: 1

5. **Cutover is not this card.** Close names as not started: live `/permitflow/*` deletion, `pf_*` DROP, G-52, Compass sidebar, Bastrop tenant cutover, G-24 ingest, G-33, G-42, G-51 OPS-17 re-grade, G-60 residuals.
   | check: close artifact lists those residuals. G-33 and G-42 stay OPEN.
   | grade: [x] met 2026-08-17 | evidence: close `_inbox/2026-08-17_g65_close.json` lists live `/permitflow/*` deletion, `pf_*` DROP, G-52, Compass, Bastrop cutover, G-24, G-33, G-42, G-51 re-grade, G-60 residuals as not started.
   | depends on: 3

## Out of scope

Deploying `P:\smartcity-os`. Redirecting `/permitflow` to plan-review-app on the live domain. DROP. G-52. Compass. Leaflet cut. Atoms `--apply`. Second MCP.

## Amendments

(none until operator go)

## Finish card (graded at close)

1. met: operator approved 2026-08-17; G-64 graded before this grade.
2. met: serving Dashboards zero `permitflow`; `/permitflow` 404; development-services is plan-review-app.
3. met: city bundle permitflow=160; `/permitflow/review` 200; `00118-qox` unchanged.
4. met: zero city DDL; no Dashboards `pf_documents`.
5. met: close names live island cut as Bastrop cutover, not this card. G-33 and G-42 stay OPEN.
