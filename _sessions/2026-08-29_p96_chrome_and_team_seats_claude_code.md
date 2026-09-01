---
id: 2026-08-29_p96_chrome_and_team_seats
title: Session close — Team included seats 3, P-96 chrome pile, favicon ICO
date: 2026-08-29
agent: planner
repo: docs
session_type: execute
plan_row: P-96
memory_graded: none
rolled_up: false
---

# Session: Team seats 3, then P-96, then the favicon that was not the SVG

Seat: integration on `P:/doc_repo` `main`. Product writes were isolated trees only. Doc_repo files from this session stay uncommitted until the operator says go.

## What was done

Operator dropped Team included seats from 10 to 3 at the same Team price ($299/mo, $2,990/yr). Extra seats stay $25/mo. No live Team subscription existed, so nothing was migrated and `seats_purchased` was not invented.

LDT #549 squash-merged `810e26d1`. `PE_TEAM_INCLUDED_SEATS = 3`. hauska-map #311 squash-merged `d94d605`. First PE CI failed because modal and checkout tests still expected `value="10"` and 12-seat `$349`. Fix: default 3; 12 seats is `$524`. Cortex canary then shift to `cortex-api-00662-hij` @100% tag `canary`. PE Vercel aliased `https://smartsite.cloud`. Live bundle had `up to 3 seats` and no `10 seats`. Operator: good.

Operator then said go on P-96. Isolated tree `P:/tmp/hauska-map-p96` from `origin/main`. hauska-map #312 squash `b9ecbb8`. Vercel `dpl_G9YtZh9RrgQzHaPGvGDA3FSmP2RW`. Live grades: 1, 2, 4, 5, 6, 7, 8 MET. Item 3 PARTIAL (Escape and focus restore live on SignUp, Settings, Pricing; Tab wrap not observed; Checkout not opened).

Operator added item 9: favicon still had the old cool-blue tile. SVG retile #313 (`#2A2A2B`) did not change the tab on a fresh browser. Cause: Chrome asks `/favicon.ico` first; that file was missing; the SPA catch-all returned `index.html` as 200 `text/html`. hauska-map #314 squash `b6b00d1`. Live `/favicon.ico` is `image/x-icon`, 879 bytes, magic `00 00 01 00`. Operator confirmed it is serving.

This seat is idle. P-89 leftover stays on the MCP lane. Accept-invite waits on a Team grant. P-90 stays draft until leftover item 3 is live-MET and the operator greets it.

## What was learned (changes to ground truth)

Team at $299 includes 3 seats, not 10. The old "$29.90/head cheaper than Solo" story is retired. Annual Team still refuses extras. Stripe dashboard copy that still says 10 is a catalog leftover, not a writer.

A coverage percentage baked into the chrome gate is the same defect as the 7.1% snapshot. The control is reprinting the figure from a live walk every run. This tree: 168 billed files, 90 literals measured (hex 35 / triples 55 / hsl 0 / named 0). Old hex-in-tsx instrument would see 20/90 (22.2%).

Pricing, Checkout, and SignUp are custom scrims. They inherit Tab and Escape through `useDialogFocus`, not the kit Modal shell. Settings already uses kit Modal.

`/favicon.ico` must be a real static file. A query-string cache bust on the SVG cannot win Chrome's first request. A 200 HTML body on that path is how the last decoded origin icon survives a hard refresh.

PE vitest is node. A unit that calls `handleDialogKey` is a pin, not a live keyboard grade.

## What's still open

P-96 item 3: Tab wrap and Checkout Escape unwalked. Optional.

P-89 leftover item 3: `download_parcel_dossier_export` must refuse missing or hollow stored X-ray and must not call engine GET `/download`. MCP lane only.

Accept-invite: Wave 3. Needs a Team grant. Invite UI is still display-only. BFF writes stay off. First Team checkout must persist `seats_purchased=3`.

P-90: draft WDLL. Do not compile until leftover item 3 is live-MET and the operator greets the card.

Stripe A1-A4 and the live key: Nick. Do not open `src/checkout/`.

Factory / F-09 / scllr / P-91 writers: not this seat.

Purchased seat count on the operator account: Not read until a Team Stripe grant.

## Suggested canonical doc updates

`_inbox/2026-08-10_smartsite_pricing_and_gtm_LOCKED.md` and `_smartsite_masters/06_smart_site_gtm_audiences_and_pricing.md` already carry 3 included seats. Commit them with this close.

`90_operations/OPS-16_texas_market_plan_of_record.md` A-050 still describes P-96 as the 7.1% pile. A later rollup should mark the row closed and cite #312 #313 #314. Not done in this close because that file has concurrent writers.

Lessons for planner-gated memory (do not self-promote): reprint chrome-gate coverage; never let `/favicon.ico` fall through an SPA catch-all; retarget PE pricing fixtures when `baseSeats` changes.

## Product SHAs (this session)

| Card | Repo | PR | Merge |
|---|---|---|---|
| Team seats 3 | legacy-design-tools | 549 | `810e26d1` |
| Team seats 3 | hauska-map | 311 | `d94d605` |
| P-96 chrome | hauska-map | 312 | `b9ecbb8` |
| P-96 favicon SVG | hauska-map | 313 | `b776f0b` |
| P-96 favicon ICO | hauska-map | 314 | `b6b00d1` |

Cortex last read this seat (JSON `status.traffic[]` by field name, 2026-08-29T18:21Z): `cortex-api-00662-hij` @100% tag `canary`. Do not quote as current without a re-read.

leave_behind: none on P-96 after the ICO. Team seats leave_behind: Stripe dashboard copy and the first grant walk.

## References

- `_decisions/2026-08-29_team_included_seats_3.md`
- `_inbox/2026-08-29_team_included_seats_3_WDLL.md`
- `_inbox/2026-08-29_team_included_seats_3_close.json`
- `_inbox/2026-08-28_p96_chrome_defect_pile_WDLL.md`
- `_inbox/2026-08-29_p96_chrome_defect_pile_close.json`
- `_scratch/p96-chrome-defects.md`
- `_scratch/p94-team-roster.md`
