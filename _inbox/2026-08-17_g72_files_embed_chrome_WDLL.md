---
id: 2026-08-17_g72_files_embed_chrome_WDLL
title: WDLL — Lane A G-72 Smart Files embed chrome
status: closed
last_updated: 2026-08-17
applies_to: smartcity
owner: nick
related:
  [
    90_operations/OPS-17_govtech_stack_plan_of_record,
    _decisions/2026-08-17_files_compose_then_one_feed,
    _inbox/2026-08-17_g68_smart_files_ui_WDLL,
    _inbox/2026-08-17_g70_dashboards_files_compose_WDLL,
  ]
---

# WDLL: Lane A G-72 Smart Files embed chrome

Date: 2026-08-17  Status: closed
Operator approval: 2026-08-17 (operator: spawn the next wave)

Plan row: **G-72** (OPS-17, A-054). Instrument: serving Files QA, when iframed or `?embed=1`, hides the demo fixture panel and does not present a second product wordmark as the first paint. Write API still works. Cortex stays 404.

This card does not rewrite Places, share, or Bring files. `src/*` and `web/api/files.js` stay untouched.

Housing is [empressaioemail-tech/smart-files](https://github.com/empressaioemail-tech/smart-files). QA `https://smart-files-app.vercel.app`.

## As-found (2026-08-17)

G-68 browser is a full product page. Fixture panel is visible. No embed mode. Dashboards has no Files mount yet (G-70).

## Done looks like

`?embed=1` or `window.self !== window.top` sets embed chrome: fixture panel hidden, product top-bar suppressed or reduced so a city shell can mount it. Direct visit to `/` without embed still shows the product browser and fixture panel. `#share=` read-only still has no staff nav. Create/upload/share still POST `/api/files`.

## Acceptance items

1. **Operator approves this card.**
   | check: this file `Operator approval:` dated; status `approved`.
   | grade: [ ]
   | depends on: none

2. **Embed hides fixture and nested header.** Served JS/CSS: `isEmbedded` or `embed=1` hides `#fixture-panel` and the Files product top bar (or equivalent). Direct `/` still shows them.
   | check: served `app.js` / `styles.css`; no OAuth added.
   | grade: [ ]
   | depends on: 1

3. **Write path and share hold.** `api()` still posts `/api/files`. `#share=` loader kept. `src/*` and `web/api/files.js` untouched. `sc-kit.css` not edited.
   | check: diff names; kit hash-object matches origin/main.
   | grade: [ ]
   | depends on: 2

4. **Cortex and city hold.** Cortex `/api/smart-files` 404. No city deploy. L26 not taken.
   | check: live cortex 404; city pin unchanged.
   | grade: [ ]
   | depends on: 1

## Out of scope

OAuth. G-70 Dashboards nav. G-71 calendar. G-53. Two-way sync.

## Amendments

(none)

## Finish card (graded at close)

1. met: operator approved 2026-08-17 spawn the next wave
2. met: served `isEmbedded`; CSS hides `#fixture-panel` and `#app > .shell-top`; head script sets `data-embed` before CSS
3. met: create 201; `#share=` kept; kit hash-object matches origin/main
4. met: cortex 404; city `00118-qox`; L26 not taken

Evidence: `https://smart-files-app.vercel.app` `dpl_8WCADkEhKByhLa6QSKEfUCbUZ3DZ`. PR **#3** squash `b73bcc6f945691bcac4f01cc8ca11d1a166b404a`. Close `_inbox/2026-08-17_a_g72_close.json`.
