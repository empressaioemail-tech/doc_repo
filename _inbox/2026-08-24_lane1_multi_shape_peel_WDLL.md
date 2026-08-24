---
id: 2026-08-24_lane1_multi_shape_peel_WDLL
title: Lane 1 — peel stacked parcel paint on Travis lots
status: approved
date: 2026-08-24
plan_row: P-60
operator_go: verbal 2026-08-24 (Lane 2 parked, not cancelled; peel tree only; visual then deploy)
---

# WDLL: Multi-shape peel

Find identity is closed (#208). After a successful situs pick on 17005 Simsbrook the card is `48453:280239` and the lot paints more than one shape. The leftover Bastrop / Wainee card is gone. This card is paint only.

#204 peeled hover hit-test. It did not retire a paint composer. P-60e (#201) then #203 made `shouldSuppressTileParcelLines` always false. P-60d (#200) added `inspectRingOverlays` from sheet rings. Envelope still draws a dashed overlay. Live GIS mesh still draws thin blue lines.

## Done looks like

On `smartsite.cloud` after a hard refresh, pick `17005 SIMSBROOK DR` from the dropdown. The inspect card is Parcel 280239. Each visible lot in that block has one outline. The inspected lot may carry one envelope wedge (amber dashed inset or consumed dashed outline) sitting on that one ring. Neighbors do not grow a second ring. Wainee leftover paint and leftover card stay gone. Find still docks 280239.

## Acceptance items

1. **Composer inventory is a file.** A checked-in note lists every overlay that can draw a parcel ring or fill on inspect, with file:function. Includes PMTiles LINE, live GIS mesh, tile feature-state, `inspectRingOverlays`, envelope overlays, search overlays. | check: the note exists and names a line for each | grade: [met] `_inbox/2026-08-24_p60_parcel_ring_composer_inventory.md` + `parcel-ring-peel.ts`

2. **One visible ring per uninspected lot.** In the Simsbrook block after the pick, a neighbor lot shows one outline, not two stacked blues. | check: operator visual on 17005 / 17009 class lots | grade: [ ]

3. **Inspected lot is one ring plus at most one envelope.** Yellow dashed wedge or consumed outline may sit on the county-exact ring. A third box that does not match either is a fail. | check: operator visual on 280239 | grade: [ ]

4. **Find identity stays green.** Same pick still opens `48453:280239` with no yellow geocode. Gold `48021:34137` still docks. | check: existing rooftop-pick tests + one live pick | grade: [partial] rooftop/Find unit 24/24. Live pick owed with visual.

5. **No silent P-60e re-hide.** Tile lines may be suppressed only when a second derivation shows the replacement is painted. Fetch-ok is not paint. A suppress without that proof is a fail. | check: `shouldSuppressTileParcelLines` either stays false or gains a paint-proof input | grade: [met] still unconditionally false; peel omits mesh instead of hiding tiles.

6. **Violation proves the peel.** Forcing an extra composer back on shows two rings. After the peel, the same lot shows one. | check: unit or overlay fixture that fails when two ring composers are both visible for one node | grade: [met] `parcel-ring-peel.test.ts` stacked fixture throws; peeled neighbor/inspected pass; mesh leak throws.

## Amendments

- 2026-08-24: Lane 2 parked, not cancelled. Peel tree must not open `fix/pe-pricing-a2` or any Reports branch. After peel merges, rebase A2 onto main, operator visual, then deploy. Reports Option D starts only after that visual on a new isolated tree from `_temp/Smart Site rebrand project (5)/handoff/Smart Site Reports Dock - Option D.dc.html`. Do not revive `feat/pe-workbench-verdict-reports`. Close must carry the A2 rebase as `leave_behind`. Pin `_inbox/2026-08-24_lane2_parked_after_paint.md`. Reason: two hauska-map writers on one tree was already rejected.
- 2026-08-24: Items 2 and 3 stay open. The leftover is the hover overlay drawing per-tile fragment geometry (`map-renderer.js:384`), measured 22:02Z. Hit-test identity from #204 stays correct; the drawn geometry is the defect. Next cut is the hover feature-state WDLL `_inbox/2026-08-24_hover_feature_state_WDLL.md`. Strike the "do not claim hover is the leftover" line — that line was about hit-test, not paint. Reason: operator falsified the lot-line / mesh referent.

## Do not

- Reopen Photon labels, `trustedRooftop`, or #205/#207/#208 identity
- Work in `P:/seat-worktrees/property/hauska-map` or the A2 pricing tree
- Open `fix/pe-pricing-a2` or any Reports branch in the peel tree
- Tile rebake
- New map architecture
- Hide lots on zoom-in (the #201 defect)
- Treat #204 hit-test identity as the leftover (the id is right; the drawn geometry is not)
- Revive `feat/pe-workbench-verdict-reports`

## Leave-behind if a composer cannot retire

```
leave_behind:
- item: [composer name + file:line]
  owner: planner
  plan_row: P-60
```

Lane 2 is parked on this card, not cancelled. Close must also carry:

```
leave_behind:
- item: fix/pe-pricing-a2 (A2 PricingModal + interval wire). Uncommitted on P:/seat-worktrees/property/hauska-map as of 2026-08-24. Behind origin/main. Rebase onto main after this peel merges. Do not deploy until operator visual. Reports Option D starts only after that visual.
  owner: planner
  plan_row: P-60
```

Do not open that branch in the peel tree. Two hauska-map writers on one tree was already rejected (`_inbox/2026-08-24_cp1_parallel_lanes.md`).
