---
id: 2026-08-17_g75_shell_mounts_motion_WDLL
title: WDLL — Lane B G-75 shell, mounts and map motion
status: approved
last_updated: 2026-08-17
applies_to: smartcity
owner: nick
related:
  [
    90_operations/OPS-17_govtech_stack_plan_of_record,
    _inbox/2026-08-17_demo_city_template_handoff,
    _inbox/2026-08-17_g75_shell_mounts_motion,
  ]
---

# WDLL: Lane B G-75 shell, mounts and map motion

Date: 2026-08-17  Status: approved
Operator approval: 2026-08-17 (handoff: build the rest of the demo city; light visual QA for shape)

Plan row: **G-75** (OPS-17, A-057). Instrument: live HTML, live compose, live computed rects. Chrome and mounts. No new feed. Live Bastrop unchanged.

Housing is [empressaioemail-tech/smartcity-dashboards](https://github.com/empressaioemail-tech/smartcity-dashboards).

## Done looks like

A grader on serving Dashboards walks every Bastrop-needed product surface as a home. Maps start in today's rails and expand with Compass spring. Iframes fill their regions with one shell. Empty states explain themselves. Identity from G-74 holds.

## Acceptance items

1. **Operator approved the handoff as the card.**
   | check: `_inbox/2026-08-17_demo_city_template_handoff.md`; this file dated.
   | grade: [met] operator 2026-08-17: other agent builds the rest of the demo city
   | depends on: none

2. **Mounts fill their regions.** Live Overview map iframe height is greater than 220px. Files and Plan Review iframes fill the work surface and pass `embed=1`. One SmartSite iframe serves Overview and Place.
   | check: live computed rects; compose `planReview.url` and `smartFiles.url` contain `embed=1`.
   | grade: [met] serving 1920x1080: map 378x605; files 1630x846; review 1630x846; both hosts `?embed=1`
   | depends on: 1

3. **Map motion is Compass-class and stays in current homes.** Collapsed starts at Overview `#anchor-overview-map` and DS Place `#anchor-place-map`. Same `springEase(320, 32, 0.9, 60)`. Presented and maximized exist. Interruptibility is partial (reversal from position; no velocity or drag-to-dismiss).
   | check: Expand/Full controls on the region bar; agent note measured dismissed rect equals collapsed.
   | grade: [met, partial interruptibility named] Expand and Full live on Overview; 30c §6.4 velocity/drag held
   | depends on: 1

4. **30c chrome exists as screens, honest-empty.** Metric strip, Across departments, Assets inventory, `/?work=review`, Citizen scoped light, named Not-built lenses as views, search disabled with Records search, Compass chrome-only without fake maximize, 67 of 67 Homes-table plus 3 labelled addenda.
   | check: live GET `/`, `/?work=connections`, `/?work=review`, `/?lens=citizen`.
   | grade: [met] Connections 70 rows = 67 + 3 addenda; 67 of 67 still displayed; Parks etc are links not dead chips
   | depends on: 1

5. **Identity and island hold.** Zero Bastrop / Chestnut / forbidden product strings on HTML. Compose meetings empty. No new grant. No plan-review PR. City `00118-qox` unchanged. `shell.css` has zero hex / rgb / :root.
   | check: live HTML needles; compose; city traffic; served `shell.css`.
   | grade: [met] ten needles zero; meetings empty; css hexOrRoot=0; city 00118-qox @100% lane4
   | depends on: 1

## Out of scope

Velocity preservation and drag-to-dismiss. Smart Files content-height layout. SmartSite embed mode. Clerk retarget. G-52. G-24. Live Bastrop. Atoms `--apply`.

## Amendments

(none)

## Finish card (graded at close)

Date: 2026-08-17  Serving: `smartcity-dashboards-00013-vkl` @100%. PR #13 squash `34b307b`. CI run `32088195999` conclusion `success`. Probe `_scratch/g75_live_probe.json`. Close `_inbox/2026-08-17_b_g75_close.json`.

1 met. 2 met. 3 met with named partial on interruptibility. 4 met. 5 met. Drift vs handoff: Plan Review detection was already on the host (G-73 review wrong); no plan-review PR. Register 67+3 not 70 of 70.
