---
id: 2026-08-17_g68_smart_files_ui_WDLL
title: WDLL — Lane A G-68 Smart Files product UI
status: closed
last_updated: 2026-08-17
applies_to: smartcity
owner: nick
related:
  [
    90_operations/OPS-17_govtech_stack_plan_of_record,
    _decisions/2026-08-15_smart_files_is_a_product,
    _decisions/2026-08-17_ux_implementation_sequence,
    _inbox/2026-08-17_g67_kit_copy_WDLL,
    30c_smartcity_platform_ia,
    _smartcity_masters/34_smartcity_smart_files_and_foundation,
  ]
---

# WDLL: Lane A G-68 Smart Files product UI

Date: 2026-08-17  Status: approved
Operator approval: 2026-08-17

Plan row: **G-68** (OPS-17, A-053). Instrument: serving Smart Files QA host is a kit file browser with access rail and Bring files states; share is a dialog plus People page; live create/upload/share API still works; Cortex stays unmounted; live Bastrop unchanged.

G-67 kit copy must be graded first. This card is the product altitude. City compose of the browser into Dashboards Work → Files may land here if cheap, or be named residual for a follow-on. Drive OAuth is not this card.

Housing is [empressaioemail-tech/smart-files](https://github.com/empressaioemail-tech/smart-files). QA UI today: `https://smart-files-app.vercel.app`.

## As-found (2026-08-17)

Persona select, two-column rooms, upload, share token. Proof of create/upload/share. Not a file browser. Not the access rail. Not Bring files.

## Done looks like

A grader on the serving Files UI sees Places (Search, Recents, My files, Shared with me, Shared by me, Bring files), a list default, and an access rail that states tenant-private and lists each widening as a row. Share is a dialog with a preview of what the recipient sees. People and access lists grants and links with times. Bring files shows the designed states against fixture data (paste-link Available; connected Drive Not connected; no fake OAuth). Shared read-only view uses the same tokens and has no staff nav. QA persona select is a demo fixture, not the product chrome. Existing write API still creates, uploads, and shares. Cortex `/api/smart-files` still 404.

## Acceptance items

1. **Operator approves this card.** Status flips from draft to approved before UI implementation.
   | check: this file `Operator approval:` dated; status `approved`.
   | grade: [ ]
   | depends on: none

2. **G-67 kit is on the serving tree.** Files uses the copied `--sc-` file. No local token fork.
   | check: G-67 close graded; Files kit file hashes with the extract.
   | grade: [ ]
   | depends on: 1, G-67

3. **Browser replaces the QA two-column page.** Places rail and list default are live. Access rail is visible on a selected room or file. Tenant-private is stated.
   | check: live screenshot or DOM; no persona `<select>` in the product chrome (fixture panel only).
   | grade: [ ]
   | depends on: 2

4. **Share and People exist.** Share dialog plus People and access page. A minted share still opens read-only for that room only.
   | check: live share token still resolves one room; People page lists the grant or link.
   | grade: [ ]
   | depends on: 3

5. **Bring files is chrome, not a live Drive sync.** Source register shows paste-link Available and connected Drive Not connected. At least three states are renderable from fixtures: checking or bringing, converted, failed or partial. No OAuth. No two-way sync.
   | check: live Bring files view; served JS has no Google OAuth client id; fixture states visible.
   | grade: [ ]
   | depends on: 3

6. **Write path still works.** Create folder, upload, share against the files service still 201-class. Cortex unmounted.
   | check: BFF or service probes; cortex `/api/smart-files` 404.
   | grade: [ ]
   | depends on: 4

7. **Live Bastrop and L26 untouched.** No city deploy. No atoms `--apply`. No files DSN on Vercel.
   | check: city pin unchanged; Vercel env is URL plus key only.
   | grade: [ ]
   | depends on: 1

## Out of scope

Google / Dropbox / OneDrive OAuth. Two-way sync. Dashboards Work → Files compose if not cheap (name it residual). Plan Review picker (G-69). Asset ingest. IPFS. Second MCP. G-53 customer-done. G-24.

## Amendments

(none until operator go)

## Finish card (graded at close)

1. met: operator approved 2026-08-17
2. met: G-67 closed; `sc-kit.css` git hash-object matches origin/main; `styles.css` declares no `--sc-*` tokens
3. met: live Places rail, list default, persona select only in `#fixture-panel`, tenant-private stated
4. met: share dialog + People; minted token `FT6d3VBvfyM-c1gQBSwf6aH2` GET 200 one folder
5. met: Bring files checking / converted / Not connected; `refuseOAuth`; no Google client id
6. met: create 201 share 201; cortex `/api/smart-files/folders` 404
7. met: city `00118-qox`; Vercel env URL plus key only; L26 not taken

Evidence: serving `https://smart-files-app.vercel.app` `dpl_3KjVHdKS1s7Rcpj3hehDvEJmqKqM`. PR **#2** squash `569bbdbdea814763d8c6aa38a36868cf0550cd90`. Close `_inbox/2026-08-17_a_g68_close.json`.
