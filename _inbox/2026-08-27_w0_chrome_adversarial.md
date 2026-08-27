---
id: 2026-08-27_w0_chrome_adversarial
title: Adversarial review — W0 chrome restore
status: filed
last_updated: 2026-08-27
---

# W0 review

Branch `fix/qa-w0-chrome` on `P:/tmp/hauska-map-qa-w0`, rebased onto `origin/main` `91f1d43`. Planner read the diff.

## What holds

Workbench uses only `openToolId`. Passing `openToolIds={["brief","chat"]}` and `dockSide="left"` still renders one right dock. ExplorerMap no longer passes those props. Draw and layers are separate MapToolset panels with `nextOpenLeftKinds`. Inspect high-level keys are land use / flood / acreage; the rest start collapsed. Note pins have ten colors and hover text. Original legend file was not forked.

A second mechanism that would look the same: hide the left stack in CSS while still owning multi-open state. Rejected. `nextOpenToolId` is the only tap rule; ignored props are voided.

## What does not hold yet

Live screenshot grades are not done. Notifications are not a fourth bubble (removed in an earlier rebrand; ⓘ source info is the extra). One-open overflow is `auto` so a long layer list can still scroll inside the tall column. That is not the old cramped scroll.

## Grade

W0.1–W0.7: met in code and tests. Partial until live probe after deploy.
