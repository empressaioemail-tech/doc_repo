---
id: 2026-08-24_hover_feature_state_WDLL
title: P-60 — hover highlight is feature-state, never tile-fragment geometry
status: approved
date: 2026-08-24
plan_row: P-60
operator_go: verbal 2026-08-24 (compile the hover feature-state PR; post-seal P-60d ring untouched)
wdll_items: 1-6
---

# WDLL: Hover feature-state

The leftover on the Simsbrook block is the hover/inspect highlight drawing `hits[0].geometry` (`packages/map-renderer/src/map-renderer.js` ~384). That geometry is the per-tile fragment, not the parcel. The block sits on a z16 seam cross (lng -97.6354980, lat 30.4581444). Feature-state already paints the full lot (the pale patch). The blue box is one fragment. Diagnosis `_inbox/2026-08-24_stacked_paint_diagnosis.md` Round 2.

#204 kept hit-test identity. This card retires the fragment draw. P-60d county-exact post-seal ring stays.

## Done looks like

On `smartsite.cloud` after a hard refresh, hover 280236, 280239, and 280233 from either side of the lot. The highlight is the whole lot. The straight cut through the front yards is gone. Entry edge does not change the box. Sealed 280239 still uses the sheet ring. Find still docks `48453:280239`. Gold `48021:34137` still docks.

## Acceptance items

1. **Fragment geometry write is gone.** `mousemove` does not `setData` `picked.feature.geometry` onto `hauska-ovl-hover-highlight`. `HOVER_SOURCE_ID` fill/line layers are deleted or never added. | check: grep the renderer for `picked.feature.geometry` and `hauska-ovl-hover-highlight` setData; both are absent from the hover path | grade: [met] #210 deletes the source/layers + setData; served bundle index-iYfCC3y3.js greps 0 for the overlay id; live style dump has no hover layer/source

2. **Hover is a feature-state branch.** Tile fill/line paint expressions in `parcel-tiles.js` carry a `hover` case. Mousemove set/clears `{ hover: true }` on the promote id. Feature-state spans every fragment of that id. | check: paint expressions include `["feature-state", "hover"]`; no dasharray/gradient from feature-state (crash guard) | grade: [met] 6 hover branches in served paint expressions; crash-guard asserts in hover-feature-state.test.js; live probe: hover on 2-fragment 280236 -> `{hover:true}` on the id

3. **Violation test exists and the old path fails it.** A fixture parcel spanning a mocked tile boundary must highlight as one full lot. Feeding the old overlay the first fragment must fail that test. | check: new test file or amended `hover-peel.test.js`; run the old setData path against the fixture and confirm it fails; run the feature-state path and confirm it passes | grade: [met] hover-feature-state.test.js seam-span fixture: 6/6 FAIL on unmodified 80c9ad4 (recorded before deletion, CP2), 6/6 PASS after

4. **Post-seal ring is untouched.** `countyExactInspectOverlays` / `sheet.geometry.rings` path from P-60d is not edited. Sealed inspect still demotes tile stroke via `countyRing`. | check: `inspect-highlight.ts` diff is empty or comment-only; no change to the sealed overlay composer | grade: [met] inspect-highlight.ts not in the #210 diff; countyRing expressions unchanged

5. **Find identity stays green.** Same pick still opens `48453:280239`. Gold `48021:34137` still docks. Hover pick still keys `PARCEL_TILES_FILL_ID` only. | check: existing rooftop-pick + hover-peel identity tests | grade: [met] identity test kept verbatim and passing; PE suite 1490 pass / 103 files incl. rooftop-pick/Find; pick path untouched

6. **Operator visual on the seam block.** Hover 280236 / 280239 / 280233 on live smartsite.cloud. Full-lot highlight from both entry edges. No straight cut parallel to Simsbrook. | check: operator walk after deploy | grade: [ ] OWED — pre-verified headless 22:34Z (full-lot highlight on 280236, `verify_hover_seam_lot.png`; leave clears state), operator eyes are the grade

## Amendments

- None yet.

## Do not

- Rebake the PMTiles archive
- Hide tile lines on zoom-in (#201)
- Reopen Photon, `trustedRooftop`, or Find identity
- Occupy `P:/seat-worktrees/property/hauska-map` or open `fix/pe-pricing-a2`
- Revive live parcel mesh
- Drive `line-dasharray` or `line-gradient` from feature-state
- Touch the P-60d sealed county-exact ring
- Absorb seal-lifecycle, red-card, search-bar, or near-bbox 504s into this PR

## Leave-behind

```
leave_behind:
- item: fix/pe-pricing-a2 (A2 PricingModal + interval wire), uncommitted on P:/seat-worktrees/property/hauska-map, behind origin/main. Rebase onto main after paint leftover is actually gone; operator visual before deploy.
  owner: planner
  plan_row: P-60
- item: seal-lifecycle / red-card / near-bbox 504s card (diagnosis sections 5-7)
  owner: planner
  plan_row: P-60
```
