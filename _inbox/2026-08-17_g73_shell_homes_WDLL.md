---
id: 2026-08-17_g73_shell_homes_WDLL
title: WDLL — Lane B G-73 Dashboards shell homes
status: closed
last_updated: 2026-08-17
applies_to: smartcity
owner: nick
related:
  [
    90_operations/OPS-17_govtech_stack_plan_of_record,
    _decisions/2026-08-17_shell_before_feeds,
    _inbox/2026-08-17_g18_shell_homes,
    30c_smartcity_platform_ia,
  ]
---

# WDLL: Lane B G-73 Dashboards shell homes

Date: 2026-08-17  Status: closed
Operator approval: 2026-08-17 (operator: approved)

Plan row: **G-73** (OPS-17, A-055). Instrument: serving Dashboards nav and Connections page name a home for every row in `_inbox/2026-08-17_g18_shell_homes.md`. No new feed. Live Bastrop unchanged.

This card does not grant adapters. It does not run municode. It does not wipe G-71 files (that is a later named card). It does not start G-52. G-24 stays zero.

Housing is [empressaioemail-tech/smartcity-dashboards](https://github.com/empressaioemail-tech/smartcity-dashboards).

## As-found (2026-08-17)

Serving `00010-vbs`. Four lead lenses. Public works, Police, Fire and EMS, Fleet as Not built. Plan review and Files Preview. No Parks. No Records search. No City group. No Connections register. G-71 Bastrop meetings HOLD.

## Done looks like

A grader on serving Dashboards sees Parks, Records search, Assets, Connections, and People and access in the nav. Connections lists every G-18 / layout-inventory job with its home and disposition. Assets is honest-empty. Badge still Demo. No new compose-form. City `00118-qox` unchanged.

## Acceptance items

1. **Operator approves this card.**
   | check: this file `Operator approval:` dated; status `approved`.
   | grade: [met]
   | depends on: none

2. **Nav names the missing homes.** Parks Not built. Work Records search Not built. City group: Assets, Connections, People and access.
   | check: live GET `/` HTML has those labels; Assets is a real view not an unbuilt chip; People is Not built; Records search is Not built.
   | grade: [met]
   | depends on: 1

3. **Connections is the register.** Serving Connections lists every row from `_inbox/2026-08-17_g18_shell_homes.md` Homes tables (or a counted subset with the file as the remainder, denominator named). Each row has home and disposition. No invented live sync times.
   | check: live GET `/?work=connections` or `/?city=connections`; row count quoted with its counting rule.
   | grade: [met]
   | depends on: 2

4. **Assets empty, G-24 zero.** Assets view is honest-empty for template-city. No hydrant, fleet-as-asset, or sample inventory.
   | check: live Assets copy; no Samsara paint; no `$0` theater.
   | grade: [met]
   | depends on: 2

5. **No feed, island holds.** Zero adapter runs. Zero new grants. Zero city deploys. L26 not taken. Files nav and Plan review mounts still work.
   | check: `template-city` grant count unchanged; city `00118-qox`; GET `/?work=files` still smart-files-app.
   | grade: [met]
   | depends on: 1

## Out of scope

New adapter grants. G-71 wipe/retarget. Compass answer engine. Native Plan Review console. Staff session. G-52. G-24 ingest. Live Leaflet or PermitFlow cuts.

## Amendments

(none)

## Finish card (graded at close)

Graded 2026-08-17 against serving `smartcity-dashboards-00011-nzs`. Probe `_scratch/g73_live_probe.json`. PR [11](https://github.com/empressaioemail-tech/smartcity-dashboards/pull/11) squash `6bad594` CI conclusion `success`.

1. met: operator approved 2026-08-17.
2. met: live GET `/` names Parks, Records search, People as Not built; Assets and Connections are links to `/?work=assets` and `/?work=connections`.
3. met: live GET `/?work=connections` has 67 of 67 Homes-table rows. Counting rule: one row per Homes-table row in `_inbox/2026-08-17_g18_shell_homes.md` (primary 31 + review-product 7 + products 6 + feeds 12 + other 11 = 67). No last-synced theater.
4. met: live Assets is honest-empty for template-city. G-24 stays zero. No Samsara in the Assets section. No `$0`.
5. met: no adapter run. Compose still `template-city` with 5 existing municode meeting files. GET `/?work=files` still `smart-files-app`. City `00118-qox` @100% tag lane4. L26 not taken.
