---
id: 2026-08-31_p4_gate8_live_finding
title: Live Gate 8 does not unblock P4
date: 2026-08-31
last_updated: 2026-08-31
status: filed
plan_row: F-18
snapshot: Factory p4-rails d4721ff; gate8 run 2026-08-31T03:38:08Z UNSTAMPED; gold URL fetched independently at 03:40Z
---

# Live Gate 8 does not unblock P4

Instrument: `node scripts/gate8/run.mjs --arm=production --surface=pe --county=48021` with `NODE_OPTIONS=--use-system-ca` from `hauska-factory-p4-rails` at `d4721ff`. Record `_inbox/2026-08-31_gate8_live_0338_48021.json`.

`dayOne` printed C3/C4/C7 pass. That is not a greener board.

W1 on gold `48021:34137` failed: served body is all-null or empty. C3 passed because both land-use halves were null. C4 passed because envelope claimed nothing. C7 passed because there was no provenance string to fail. Those three passes are the empty-body case of the checks, not a live grade of the gold.

An independent `fetch` of the same URL about two minutes later returned HTTP 200, 10717 bytes, `landUseFact.state=present` code A1. The surface is inhabited. The gate run graded a different, empty body.

The 02:56Z C7 re-read on a real body was C3 fail / C4 fail / C7 fail (`descriptor-fixture`). That is still the last inhabited grade. This run does not replace it.

P4 apply does not start. Writer jobs are not created.
