---
id: 2026-08-24_lane1_hover_peel_WDLL
title: Lane 1 — hover uses the same layer as click
status: live
date: 2026-08-24
plan_row: P-60
operator_go: verbal 2026-08-24
---

# WDLL: Hover peel

Peel means delete the extra composer. Hover currently paints live-mesh `hits[0]`. Click uses PMTiles fill. Those are two composers for "this lot."

## Done looks like

Moving the mouse across one lot does not swap to a neighbor or a second nested fill. Hover highlight geometry is the same promote-id feature the click path uses (PMTiles fill). Live mesh stays visible as lines (P-60e fail-open stands). No new suppress.

## Acceptance items

1. **Hover queries the click layer.** `mousemove` uses `PARCEL_TILES_FILL_ID` (or the same promote id), not `interactiveOverlayFillIds()`. | check: unit or renderer test; code read | grade: [met] planner read `map-renderer.js` + `hover-hit.js` on `fix/pe-hover-peel`. `interactiveOverlayFillIds` is gone.

2. **One geometry per parcel_node_id.** Entry edge does not change the highlighted ring for the same id. | check: fixture with two overlapping mesh features under one pixel; hover key is promote id | grade: [met] `hover-hit.test.js` mesh A/B first still returns tile ring `48021:280210`. Mesh-only hits return null.

3. **Fail-open lot lines stay.** `shouldSuppressTileParcelLines` remains unconditionally false. | check: existing parcel-line-dedup tests still pass | grade: [met] live-gis.ts still `return false`.

4. **No new timeout, retry, or opacity-0 hide.** | check: diff is hover hit-test only | grade: [met] map-renderer + new hit-test files only.

## Live 2026-08-24T16:19Z

hauska-map [#204](https://github.com/empressaioemail-tech/hauska-map/pull/204) squash `8cedc9d`. Vercel `dpl_3xeC4Tf2ZDkLDQ7BT9VQsspZxw7H` aliased `smartsite.cloud`. Operator visual owed: walk a lot; highlight must not swap on entry edge.

## Planner review 2026-08-24

Uncommitted on `P:/tmp/hauska-map-hover-peel` `fix/pe-hover-peel` @ `5dda5cb`. Not the A2 tree. Operator visual owed. Post-seal sheet rings remain a third composer (out of card).

## Do not

- Touch PricingModal, envelope POST, or LDT
- Tile rebake
- Commit
- Work in `P:/seat-worktrees/property/hauska-map` (that tree is the A2 lane)
