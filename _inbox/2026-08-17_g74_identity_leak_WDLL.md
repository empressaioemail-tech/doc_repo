---
id: 2026-08-17_g74_identity_leak_WDLL
title: WDLL — Lane B G-74 template-city identity leak
status: approved
last_updated: 2026-08-17
applies_to: smartcity
owner: nick
related:
  [
    90_operations/OPS-17_govtech_stack_plan_of_record,
    _inbox/2026-08-17_g73_shell_design_review,
    _decisions/2026-08-17_shell_before_feeds,
  ]
---

# WDLL: Lane B G-74 template-city identity leak

Date: 2026-08-17  Status: approved
Operator approval: 2026-08-17 (operator: you can do the identity stuff)

Plan row: **G-74** (OPS-17, A-056). Instrument: live compose and live HTML. Design review A1 A2 A3. No new feed. No clerk retarget. Live Bastrop unchanged.

Housing is [empressaioemail-tech/smartcity-dashboards](https://github.com/empressaioemail-tech/smartcity-dashboards).

## As-found (2026-08-17, `00011-nzs`)

Compose hydrates five Bastrop meetings onto template-city Overview (`honesty=read`, Partial chip hidden). Citizen lens names 1311 Chestnut Street. Connections copy says "live Bastrop staff job." G-73 HTML GET missed the hydration leak.

## Done looks like

A grader on serving Dashboards Overview sees the Public meetings empty state after hydration, not Bastrop council. Compose `meetings.records` is []. Citizen names no street. Connections HTML does not contain the word Bastrop. Badge still Demo. City `00118-qox` unchanged.

## Acceptance items

1. **Operator approves this card.**
   | check: this file `Operator approval:` dated; status `approved`.
   | grade: [met] operator 2026-08-17: you can do the identity stuff; this file status approved
   | depends on: none

2. **A1. Overview does not render Bastrop meetings.** Live compose `cityKey=template-city` returns `meetings.records=[]`. JSON does not contain `bastrop-tx.municodemeetings.com`, `Public Library Board`, or `Regular City Council Meeting`. Hydrated Overview keeps the empty state. Grant on template-city is not a Bastrop clerk host.
   | check: live GET `/api/lenses/city-manager/compose?cityKey=template-city`; live GET `/` plus meetings panel after hydration (compose JSON is the instrument).
   | grade: [met] live compose meetings.records=[]; status empty; basis no municode calendar grant on template-city; JSON has no bastrop-tx.municodemeetings.com, Public Library Board, or Regular City Council Meeting
   | depends on: 1

3. **A2. Citizen has no invented counter address.** Live Citizen copy does not contain `1311 Chestnut` or `1308 Chestnut`. Honest-absence: payment unclaimed, no street invented.
   | check: live GET `/?lens=citizen` HTML.
   | grade: [met] live GET /?lens=citizen has no 1311 Chestnut and no 1308 Chestnut
   | depends on: 1

4. **A3. Connections does not name Bastrop.** Live GET `/?work=connections` HTML has zero `Bastrop`. Caption still states the register job without naming the reference customer.
   | check: live HTML; `Bastrop` count is 0.
   | grade: [met] live GET /?work=connections Bastrop count 0
   | depends on: 1

5. **No feed, island holds.** Zero new grants. Zero clerk retarget. Zero city deploys. L26 not taken. Files and Plan review mounts still work. Demo badge.
   | check: city `00118-qox`; GET `/?work=files` still smart-files-app; no new adapter kind.
   | grade: [met] no new grant; no clerk retarget; compose smartFiles still smart-files-app/?embed=1; city 00118-qox @100% lane4; permitflow/review 200; Demo badge
   | depends on: 1

## Out of scope

Clerk retarget to a non-Bastrop host. Deleting leftover meeting files in Smart Files (named residual if Overview no longer reads them). Design review B through G. Compass map motion. Demo-city chrome completeness (separate handoff). G-52. G-24. Live Bastrop.

## Amendments

(none)

## Finish card (graded at close)

Date: 2026-08-17  Serving: `smartcity-dashboards-00012-9dk` @100%. PR #12 squash `00ea669`. CI run `32085187652` conclusion `success`. Probe `_scratch/g74_live_probe.json`. Close `_inbox/2026-08-17_b_g74_close.json`.

1 met. 2 met. 3 met. 4 met. 5 met. Drift: none vs Start card. Residual: leftover meeting files in Smart Files `folder:tenant:template-city:public-meetings` are unread, not deleted.
