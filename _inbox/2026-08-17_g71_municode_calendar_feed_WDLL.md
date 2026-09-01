---
id: 2026-08-17_g71_municode_calendar_feed_WDLL
title: WDLL — Lane B G-71 first municode calendar feed
status: closed
last_updated: 2026-08-17
applies_to: smartcity
owner: nick
related:
  [
    90_operations/OPS-17_govtech_stack_plan_of_record,
    _decisions/2026-08-17_files_compose_then_one_feed,
    _decisions/2026-08-17_g63_feed_adapter_contract,
    _inbox/2026-08-17_g63_feed_adapter_contract_WDLL,
    _inbox/2026-08-17_dashboards_missing_pieces,
  ]
---

# WDLL: Lane B G-71 first municode calendar feed

Date: 2026-08-17  Status: closed
Operator approval: 2026-08-17 (operator: spawn the next wave)

Plan row: **G-71** (OPS-17, A-054). Instrument: `template-city` has a municode calendar grant; at least one public meeting record exists on files with provenance; Overview meetings reads those records. Live Bastrop unchanged. L26 not taken.

Catalog kind `municode` writesTo spine by default. This card writes calendar onto **files** because the atoms bulk-writer slot is held. That override is named on the grant. Do not call `smartcityos.io` APIs. Do not copy `council_agendas`. Do not start MyGov.

Housing is [empressaioemail-tech/smartcity-dashboards](https://github.com/empressaioemail-tech/smartcity-dashboards). Files write target is the existing Smart Files service already mounted. Serving Dashboards pin at draft: `smartcity-dashboards-00008-d55`.

## As-found (2026-08-17)

`GET /api/adapter-kinds` lists municode. `template-city.grantedAdapters` is `[]`. Overview meetings says the clerk calendar is not connected. Live city calendar scrape stays on the island.

## Done looks like

`template-city` lists a municode grant for calendar, `writesTo=files`, `accessPolicy=public-free`. An adapter run writes at least one public meeting record onto files with source, timestamp, and accessPolicy. Overview meetings lists those records (title, when, source) or stays honest-empty with Partial and a basis if the write failed. `fixture-city` grants stay `[]`. No invented agenda.

## Acceptance items

1. **Operator approves this card.**
   | check: this file `Operator approval:` dated; status `approved`.
   | grade: [ ]
   | depends on: none

2. **Grant exists on template-city only.** Live pack `grantedAdapters` includes municode calendar → files / public-free. `fixture-city` remains `[]`. Shape tests still refuse `pipedrive`.
   | check: live GET city pack or compose; tests updated, not deleted.
   | grade: [ ]
   | depends on: 1

3. **Adapter writes records to files.** At least one meeting file or files-record exists for `template-city` with provenance (source URL or named public municode host, timestamp, accessPolicy). Destination is Smart Files, not Dashboards Neon, not spine atoms.
   | check: files service list or Dashboards meetings API; zero atoms `--apply`.
   | grade: [ ]
   | depends on: 2

4. **Overview meetings reads records.** Serving GET `/` meetings panel shows the written records or honest-empty with basis. No four invented events. No morning-brief work orders.
   | check: live Overview copy; served HTML has no Locate Water / 25-000280.
   | grade: [ ]
   | depends on: 3

5. **Island stay island.** No fetch of `smartcityos.io` `/api/calendar/*`. Zero city deploys. L26 not taken.
   | check: source URL is not smartcityos.io; city `00118-qox`; no `--apply`.
   | grade: [ ]
   | depends on: 1

## Out of scope

MyGov. Samsara. G-24. G-52. G-70 Files tab (do not edit Work → Files nav). Spine atom writes. Live Leaflet or PermitFlow cuts. Next-city pack.

## Amendments

- 2026-08-17: calendar writes to files, not spine, because L26 holds the atoms slot.
- 2026-08-17: Files POST requires a QA persona. Added `template-city` / `g71-calendar` on the files service so the grant can write a tenant-scoped folder. Recorded already-serving icc-demo personas into origin so that deploy did not drop them.

## Finish card (graded at close)

1. met: operator approved 2026-08-17 spawn the next wave
2. met: live template-city grant municode calendar `writesTo=files` `accessPolicy=public-free`; catalog municode still spine
3. met: POST run wrote 5 records to `folder:tenant:template-city:public-meetings`; zero `--apply`
4. met: compose `meetings.recordCount=5` with title/when/source; GET `/` has no Locate Water / 25-000280
5. met: source `https://bastrop-tx.municodemeetings.com/`; city `00118-qox`; L26 not taken

Evidence: Dashboards `00010-vbs`. Files `00005-fdr`. PR **#10** squash `570556c3`. Files PR **#4** squash `abd77f34`. Close `_inbox/2026-08-17_b_g71_close.json`.
