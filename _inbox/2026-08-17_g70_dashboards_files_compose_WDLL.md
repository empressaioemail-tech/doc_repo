---
id: 2026-08-17_g70_dashboards_files_compose_WDLL
title: WDLL — Lane B G-70 Dashboards Work Files compose
status: closed
last_updated: 2026-08-17
applies_to: smartcity
owner: nick
related:
  [
    90_operations/OPS-17_govtech_stack_plan_of_record,
    _decisions/2026-08-17_files_compose_then_one_feed,
    _inbox/2026-08-17_g68_smart_files_ui_WDLL,
    _inbox/2026-08-17_g66_dashboards_ui_WDLL,
    30c_smartcity_platform_ia,
  ]
---

# WDLL: Lane B G-70 Dashboards Work Files compose

Date: 2026-08-17  Status: closed
Operator approval: 2026-08-17 (operator: spawn the next wave)

Plan row: **G-70** (OPS-17, A-054). Instrument: serving Dashboards Work → Files is a navigable view that mounts the serving Smart Files host. Live Bastrop unchanged.

This card does not rewrite the Files browser. G-72 may hide Files chrome when iframed. Do not start MyGov. Do not grant adapters.

Housing is [empressaioemail-tech/smartcity-dashboards](https://github.com/empressaioemail-tech/smartcity-dashboards). Files host `https://smart-files-app.vercel.app`. Serving Dashboards pin at draft: `smartcity-dashboards-00008-d55`.

## As-found (2026-08-17)

Work rail Files is `<span class="navitem unbuilt">` with badge Preview. No href. G-68 browser lives on its own host.

## Done looks like

A grader on serving Dashboards clicks Work → Files (or opens `/?work=files`) and sees the Smart Files browser without typing a parcel id. Environment badge still Demo. Overview, finance, citizen, and Plan Review do not regress. Compose form stays gone.

## Acceptance items

1. **Operator approves this card.**
   | check: this file `Operator approval:` dated; status `approved`.
   | grade: [ ]
   | depends on: none

2. **Work → Files is a view.** The Files nav item is a link, not an unbuilt chip. GET `/?work=files` mounts `https://smart-files-app.vercel.app` (query after origin allowed, including `embed=1`).
   | check: live nav href; iframe or native mount host is smart-files-app.
   | grade: [ ]
   | depends on: 1

3. **No second Files rewrite.** Dashboards does not copy the browser. It mounts the existing host. `web/sc-kit.css` is not forked.
   | check: diff has no Files list/share/Bring implementation; kit hash unchanged.
   | grade: [ ]
   | depends on: 2

4. **Other lenses hold.** GET `/` still Overview Demo. GET `/?lens=finance` still honest-empty. GET `/?lens=development-services&tab=review` still plan-review-app.
   | check: live GETs; no compose-form.
   | grade: [ ]
   | depends on: 2

5. **Demo identity and live Bastrop hold.** `template-city`. Zero city deploys. L26 not taken. No atoms `--apply`.
   | check: city `00118-qox`; `P:\smartcity-os` dirty set unchanged.
   | grade: [ ]
   | depends on: 1

## Out of scope

Files browser rewrite. OAuth. G-71 calendar grant. G-52. G-24. Native Review compose. Overview meetings rewrite.

## Amendments

(none)

## Finish card (graded at close)

1. met: operator approved 2026-08-17 spawn the next wave
2. met: live Files nav `href=/?work=files`; compose `smartFiles.url` `https://smart-files-app.vercel.app/?embed=1`; GET `/?work=files` 200
3. met: no Files browser rewrite; kit hash-object `54339204691415d5ee817117699322ed0826c768`
4. met: GET `/` Demo Overview; finance no `$0`; Review still plan-review-app; no compose-form
5. met: `template-city`; city `00118-qox` @100% lane4; L26 not taken

Evidence: Dashboards `00009-vpl` @100%. PR **#9** squash `d2fc9525c6072e725b0edf1537ebcb033f63c559`. Close `_inbox/2026-08-17_b_g70_close.json`.
