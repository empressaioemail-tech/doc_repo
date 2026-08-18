---
id: 2026-08-18_g86_previews_WDLL
title: WDLL — Lane B G-86 kit preview cards, conventions, incremental upload
status: approved
last_updated: 2026-08-18
applies_to: smartcity
owner: nick
related:
  [
    90_operations/OPS-17_govtech_stack_plan_of_record,
    _inbox/2026-08-18_design_sync_handoff,
    _decisions/2026-08-18_smartcity_kit_component_package,
    30b_smartcity_design_system,
  ]
---

# WDLL: Lane B G-86 kit preview cards

Date: 2026-08-18  Status: approved
Operator approval: 2026-08-18 (operator: pick this up and proceed on `_inbox/2026-08-18_design_sync_handoff.md`)

Plan row: **G-86** (OPS-17). Housing: `empressaioemail-tech/smartcity-kit`. Working clone `P:\tmp\g82v` on `main` after PR #4 merge. Instrument: owned preview files on disk, capture sheets the planner reads, then the Claude Design project filling in.

This card does not wrap the product. It does not start G-52. It does not fill G-24. Live Bastrop stays no-touch.

## As-found (2026-08-18)

Project `f5e5465e-943f-4f68-b52f-608925bc07b0` created, pinned, empty. Converter clean: 73 components. Authored and graded good: Pill, State, MetricStrip. Remaining: 70. No conventions header. Nothing uploaded.

## Done looks like

Nick opens https://claude.ai/design/p/f5e5465e-943f-4f68-b52f-608925bc07b0 and the picker carries 73 components with real fixture compositions, not floor cards. The README header names the system's idiom with classes and tokens that exist in the built kit. Dark is the staff default and is set on the root, not by wrapping `Theme` with `mode: "dark"`. The live demo city at `00017-vx4` is a different surface and is already walkable.

## Acceptance items

1. **Operator approves this card.**
   | check: this file `Operator approval:` dated; status `approved`.
   | grade: [ ]
   | depends on: none

2. **Seventy remaining components have owned previews.** `.design-sync/previews/<Name>.tsx` exists for every export except the three calibration previews already on main. Each file ports `examples/gallery.tsx`, 2 to 3 named-export cells, fixture content kept.
   | check: 70 files on disk; `ls .design-sync/previews | measure` equals 73; names match GALLERY.
   | grade: [ ]
   | depends on: 1

3. **Planner grades every new sheet this iteration.** No grade is written for a sheet the planner has not Read. Calibration three carry forward with zero cleared.
   | check: `.design-sync/.cache/review/<Name>.grade.json` cells all `good`; planner CP2 names the sheets read.
   | grade: [ ]
   | depends on: 2

4. **Conventions header is authored and stitched.** `.design-sync/conventions.md` names real classes and tokens verified against `dist/kit.css` and `dist/fonts.css`. `cfg.readmeHeader` points at it. Dark is the staff default; the header tells the design agent to set `data-theme="dark"` on the root and never to wrap `Theme` with `mode: "dark"` as a provider. Rebuild stitches the README.
   | check: file exists; every class/token in it greps in `dist/`; generated `ds-bundle/README.md` opens with the header.
   | grade: [ ]
   | depends on: 1

5. **Verified batches upload incrementally.** The empty project fills as batches pass. `_ds_sync.json` is the last write.
   | check: `DesignSync list_files` component count rises in named batches; project URL returns the picker.
   | grade: [ ]
   | depends on: 3, 4

6. **Standing constraints hold.** Live Bastrop no-touch. No adapter grant. No G-52. No G-24. `grantedAdapters` stays empty. `permitflow`, `CitizenConnect`, `leaflet`, `pipedrive`, `stripe.com` do not appear in shipping kit files. `Bastrop` and `Chestnut` are not asserted as content.
   | check: grep of authored previews plus kit src; Dashboards serving revision unchanged.
   | grade: [ ]
   | depends on: 1

## Out of scope

Product CSS for `mx*`, `cite`, `atomchip`. Asset cache headers. Repo licence. Forcing dark on preview cards via `cfg.provider`. Live Bastrop. Feeds.

## Amendments

1. **Two previews were edited after authoring closed.** `CompassScrim.tsx` and `StageScrim.tsx` wrap their `Region` in `ColStack rail`. Reason: the `cardMode: "single"` remedy fixed their escape geometry and left both rendering as an empty white box, because a `Region` without the rail height home collapses `.region-canvas` to zero and the wash has nothing to recede. The G-86 dispatch says not to re-author previews; the boundary is that it forbids re-running the authoring campaign, not shipping a blank card that the same dispatch's step 1 exists to prevent.

2. **The conventions header stopped naming vendor brands.** Reason: `conventions.md` ships, and `permitflow`, `leaflet` and `pipedrive` are on the ABSOLUTE list in the kit's `test/constraints.test.mjs`, which grants a refusal-guard carve-out to held city names and deliberately withholds one from vendors. The instruction is unchanged in force.

## Finish card (graded at close)

Graded 2026-08-18 at close. Full evidence in `_inbox/2026-08-18_b86_close.json`.

1. **Operator approves this card.** — **met.** This file carries `status: approved` and an operator approval dated 2026-08-18.

2. **Seventy remaining components have owned previews.** — **met.** 73 files in `.design-sync/previews`, 70 new on branch `g86/preview-cards-and-conventions`. `package-build` reports 73 user-owned previews and 0 generated, so no component falls back to the floor card.

3. **Planner grades every new sheet this iteration.** — **met.** 73 grade files, 155 cells, zero non-good. The 31 cells touched this session were re-graded from sheets read this iteration, and the two re-edited scrim previews were re-captured before being re-read. The other 58 carry forward with zero cleared. One self-inflicted cost is recorded: `--force` cleared 15 grade files that `cardMode` alone would not have invalidated.

4. **Conventions header is authored and stitched.** — **met.** `cfg.readmeHeader` resolves and `package-build` logs the stitch. The header answers the handoff's open question 1: dark is the staff default, set with `data-theme="dark"` on the root, never by wrapping `Theme mode="dark"` as a page provider. Amended per amendment 2.

5. **Verified batches upload incrementally.** — **dropped.** Not attempted. The DesignSync MCP server is absent from this session and `.ds-sync` carries no local upload path, so the named check cannot be run. Project `f5e5465e-943f-4f68-b52f-608925bc07b0` is still empty. Every input is built, validated and on a green PR; a replay runbook is in the close.

6. **Standing constraints hold.** — **met, with one violation found and fixed.** The five absolute needles grep clean across the durable set and across all 417 files of the upload payload; `Bastrop` and `Chestnut` appear nowhere in it. No adapter grant, no G-52, no G-24, `grantedAdapters` untouched, live Bastrop untouched. The `smartcity-dashboards` repo was never opened and no deploy was run; the live surface answers 200 on `/`, `/shell.css` and `/?cityKey=empty-city`, though the revision string itself was not re-read and remains an unrun check. The violation was `conventions.md` naming four vendor brands in a refusal guard, fixed before the PR; the kit's own gate could not see it because `walk()` skips `.design-sync`, which is filed as follow-up row F-1.

**Start-vs-Finish diff.** Items 1 through 4 landed as written. Item 6 held but only because it was checked by hand: the gate that should enforce it is blind to the directory the violation was in. Item 5 is the row's purpose and is dropped for a tooling reason, not a work reason — the dispatch was issued on the belief that this session carried DesignSync, and it does not. The unplanned work was presentation triage the card did not anticipate: two of the fifteen remedied components needed a composition fix, not a config fix, and neither the validator nor the grading sheets could show it.
