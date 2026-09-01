---
id: 2026-08-17_g69_plan_review_ui_WDLL
title: WDLL — Lane C G-69 Plan Review product UI
status: closed
last_updated: 2026-08-17
applies_to: smartcity
owner: nick
related:
  [
    90_operations/OPS-17_govtech_stack_plan_of_record,
    _decisions/2026-08-16_plan_review_is_smart_files_first_consumer,
    _decisions/2026-08-17_ux_implementation_sequence,
    _inbox/2026-08-17_g67_kit_copy_WDLL,
    30c_smartcity_platform_ia,
    _smartcity_masters/33a_smartcity_plan_review,
    48_cortex_reporting_plan_review_spec,
  ]
---

# WDLL: Lane C G-69 Plan Review product UI

Date: 2026-08-17  Status: approved
Operator approval: 2026-08-17

Plan row: **G-69** (OPS-17, A-053). Instrument: serving plan-review-app is kit chrome for queue plus console; inverted matrix; override requires reason; Documents attach from Smart Files, not a local blob table; Dashboards development-services Review composes this host without a foreign chrome (no iframe, or iframe with chrome suppressed and documented as residual). Live Bastrop unchanged. G-51 / G-60 are not re-graded.

G-67 kit copy must be graded first. icc-demo is not minted as a city. Template UDC plus IBC citation-only is internal demo only.

Housing is [empressaioemail-tech/plan-review](https://github.com/empressaioemail-tech/plan-review). QA UI today: `https://plan-review-app-ten.vercel.app`.

## As-found (2026-08-17)

White page, persona gate, Queue / Library / Code / Applicant / Gate. Function harness. Dashboards G-64 iframes this host as the staff path.

## Done looks like

A grader on the serving Plan Review UI lands on the queue, opens a console with Unresolved-only default, quiet Pass, hatched Unchecked, and an override control that stays disabled until a reason is written. Code citations show full title and no licensed body. Documents open a Smart Files picker (or an honest "Files not attached" with basis if the mount is down), never a `pf_documents` table. Comment letter is a layout of finding rows. Applicant view is thin and public. Persona gate is not the product chrome. Dashboards `/?lens=development-services` Review no longer presents a second header or a persona gate as the first thing a staff person sees.

## Acceptance items

1. **Operator approves this card.** Status flips from draft to approved before UI implementation.
   | check: this file `Operator approval:` dated; status `approved`.
   | grade: [ ]
   | depends on: none

2. **G-67 kit is on the serving tree.** Plan Review uses the copied `--sc-` file. No local token fork.
   | check: G-67 close graded; Plan Review kit file hashes with the extract.
   | grade: [ ]
   | depends on: 1, G-67

3. **Queue and console are kit chrome.** No white persona-gate landing as the product. Inverted matrix live. Override disabled without a reason.
   | check: live queue plus one console; override control disabled until reason text.
   | grade: [ ]
   | depends on: 2

4. **Documents are Smart Files.** Attach uses the files service. No new document table in the review app. Finding sheet reference resolves to a file id.
   | check: live attach or fixture; served JS has no `pf_documents` write path added; files service called or honest empty named.
   | grade: [ ]
   | depends on: 3

5. **Citation law holds.** Licensed IBC: full title, no body. Local UDC may quote. icc-demo is not a city pack.
   | check: live code row; no subsection body from IBC in the DOM; cityKey is not `icc-demo`.
   | grade: [ ]
   | depends on: 3

6. **Dashboards Review compose.** Serving Dashboards development-services Review shows this console without a nested product header. Iframe with chrome suppressed is allowed only if named in the close as residual with a kill date. Preferred: native compose.
   | check: live GET Dashboards `/?lens=development-services`; no persona-gate first paint, or residual named.
   | grade: [ ]
   | depends on: 3, G-66 serving or current Dashboards pin

7. **Live Bastrop and L26 untouched.** Zero city deploys. No atoms `--apply`. G-51 not re-graded as this card.
   | check: city pin unchanged; close says G-51 / G-60 residuals untouched.
   | grade: [ ]
   | depends on: 1

## Out of scope

ICC SaaS / G-50. G-51 seven-function re-grade. G-52 MyGov engagement. Compass answer engine. Asset ingest. Live city PermitFlow cut. OAuth Drive ingest.

## Amendments

(none until operator go)

## Finish card (graded at close)

1. met: operator approved 2026-08-17
2. met: G-67 closed; `sc-kit.css` git hash-object matches origin/main; `styles.css` declares no `--sc-*` tokens
3. met after planner fix: `/` lands on queue; `/gate` remains fixture; override binder present
4. met: Documents picker or honest empty; `pf_documents` only in denial copy
5. met: `CITY_KEY=template-city`; IBC title only; icc-demo is QA tenant
6. met as residual: Dashboards still iframes `plan-review-app-ten`; `isEmbedded` hides `.shell-top`; native compose not shipped; kill when a later card removes the iframe
7. met: city `00118-qox`; `/permitflow/review` 200; G-51 / G-60 not re-graded

Evidence: serving `https://plan-review-app-ten.vercel.app` `dpl_CKg13X2su89rQYjore9VevtfDfP9`. PR **#2** squash `4330ac8533d116da2e1899e208c65b40de4642ee`. Close `_inbox/2026-08-17_c_g69_close.json`.
