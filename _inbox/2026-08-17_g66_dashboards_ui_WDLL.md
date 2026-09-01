---
id: 2026-08-17_g66_dashboards_ui_WDLL
title: WDLL — Lane B G-66 Dashboards product UI
status: closed
last_updated: 2026-08-17
applies_to: smartcity
owner: nick
related:
  [
    90_operations/OPS-17_govtech_stack_plan_of_record,
    _decisions/2026-08-17_dashboards_ui_then_one_feed,
    _decisions/2026-08-17_ux_implementation_sequence,
    _decisions/2026-08-17_smartcity_visual_law,
    _inbox/2026-08-17_g67_kit_copy_WDLL,
    30c_smartcity_platform_ia,
    _smartcity_masters/31_smartcity_dashboards,
  ]
---

# WDLL: Lane B G-66 Dashboards product UI

Date: 2026-08-17  Status: approved
Operator approval: 2026-08-17

Plan row: **G-66** (OPS-17, A-052). Amended 2026-08-17 against the platform layouts. Instrument: serving Dashboards is navigable 30c chrome for the four lead lenses on `template-city`; kit tokens in use; live Bastrop unchanged.

G-67 kit copy must be graded first. This card does not rewrite Smart Files or Plan Review. The G-64 iframe on development-services Review may remain until G-69.

Housing is [empressaioemail-tech/smartcity-dashboards](https://github.com/empressaioemail-tech/smartcity-dashboards). Serving pin at close: `smartcity-dashboards-00008-d55`.

## As-found (2026-08-17)

GET `/` is a city-manager proof: parcel inputs, Compose button, SmartSite iframe of gold `48021:34137`, atoms panel, files room unavailable, four lens cards underneath. GET `/?lens=development-services` iframes plan-review-app. The four lenses are catalog cards, not views.

## Done looks like

Unauthenticated GET of serving Dashboards presents the four lead lenses as navigable views in the designed shell (sidebar, environment badge Demo, no hidden parcel form). City-manager is Overview: decision queue, meetings, source register; gold SmartSite may remain the map subject. Development-services is tabs; Place may still embed SmartSite; Review may still iframe plan-review-app until G-69. Finance is honest-empty with a source register, Partial on permit fees, no metric strip of zeros. Citizen is the thin public lens, no payment theater. Compass is a top-bar source control that presents a sheet (chrome only; no answer engine required). `template-city` only. Live `smartcityos.io` unchanged.

## Acceptance items

1. **Operator approves this card.** Status flips from draft to approved before UI implementation.
   | check: this file `Operator approval:` dated; status `approved`.
   | grade: [ ]
   | depends on: none

2. **G-67 kit is on the serving tree.** Dashboards uses the copied `--sc-` file. No local token fork.
   | check: G-67 close graded; Dashboards kit file hashes with the other two repos or with the 30b extract.
   | grade: [ ]
   | depends on: 1, G-67

3. **Four lead lenses are views.** A grader opens city-manager, development-services, finance, and citizen without typing a parcel id and without a Compose click. Environment badge reads Demo.
   | check: live navigation; no parcel form required; badge text visible.
   | grade: [ ]
   | depends on: 2

4. **Finance and citizen are honest.** Finance has no invented budget and no four zeros. Source register names sources and states. Payments unclaimed. Shape test refuses `permitflow` and `CitizenConnect` as a product name.
   | check: live finance/citizen copy; served JS string counts.
   | grade: [ ]
   | depends on: 3

5. **Compass chrome exists.** Top-bar source control presents a sheet from the control rect (shared-element or an honest reduced-motion instant). No `/compass` route. No answer engine required. Scope line names city and lens.
   | check: live present and dismiss; no full-page chat URL.
   | grade: [ ]
   | depends on: 3

6. **Demo identity stays template-city.** Gold parcel remains a demo fixture, not "Bastrop onboarded." No live ops from morning-brief.
   | check: `cityKey` default `template-city`; no work-order names on unauth GET.
   | grade: [ ]
   | depends on: 1

7. **Live Bastrop unchanged.** Zero deploys to `smartcity-os-prod`. L26 writer slot not taken.
   | check: git status on `P:\smartcity-os`; `gcloud` first 100% city revision.
   | grade: [ ]
   | depends on: 1

8. **Residuals named.** Close names as not started or later cards: G-69 native Review compose (iframe allowed), G-68 Files browser, first adapter grant, live Leaflet cut, live PermitFlow cut, G-52, G-24, next-city pack, Compass answer engine.
   | check: close artifact lists those residuals.
   | grade: [ ]
   | depends on: 7

## Out of scope

Feed ingest. Smart Files browser rewrite. Plan Review console rewrite. Native compose of Review (G-69). Asset ingest. Atoms `--apply`. Second MCP. Live city deploy. Answer generation for Compass.

## Amendments

- 2026-08-17: Rewritten against 30c layouts. Compass chrome in. Review iframe residual until G-69. Kit dependency on G-67. Reason: design landed; first draft was four cards and iframe-forever.

## Finish card (graded at close)

1. met: operator approved 2026-08-17
2. met: G-67 closed; serving GET `/sc-kit.css` 200; `shell.css` declares no `--sc-*` tokens
3. met: live GET `/` `/?lens=development-services` `/?lens=finance` `/?lens=citizen` 200; badge Demo; no compose-form; no parcelNodeId input
4. met: finance source register + Partial; no `$0`; payments unclaimed; served HTML refuses `permitflow` and `CitizenConnect`
5. met: `cp-source` + `cp-sheet` present; GET `/compass` 404
6. met: `data-city-key=template-city`; gold `48021:34137` demo fixture; no morning-brief names
7. met: city `00118-qox` @100% tag `lane4`; `P:\smartcity-os` dirty set still `secrets_scan.yml` + `mygov.ts`; L26 not taken
8. met: residuals named in `_inbox/2026-08-17_b_g66_close.json`

Evidence: serving `smartcity-dashboards-00008-d55` @100% `https://smartcity-dashboards-52ecsl5mvq-ue.a.run.app`. PR **#8** squash `4ad3ba4489d0896744f59cee21ad7b87b3ba51d2`. CI run **32079207831** check-run `test` conclusion `success`. Probe `_scratch/g66_live_probe.json`.
