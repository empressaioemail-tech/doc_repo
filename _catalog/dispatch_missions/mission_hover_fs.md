Plan row **P-60**. WDLL: `_inbox/2026-08-24_hover_feature_state_WDLL.md` items 1–5 (item 6 is operator visual after deploy). Diagnosis: `_inbox/2026-08-24_stacked_paint_diagnosis.md` Round 2.

You are a lane planner. You MAY spawn sub-agents. You supervise every one to completion. Verification never delegates below you. Sub-agents do not commit.

## Occupancy

- Isolated clone only. Preferred: new branch off current `origin/main` in `P:/tmp/hauska-map-paint-peel` (HEAD should be #209 `80c9ad4` or later main). If that tree is dirty with unrelated work, make a fresh isolated clone from `origin/main`. Do not worktree off `hauska-map-rooftop-pick`.
- You MUST NOT occupy `P:/hauska-map` or `P:/seat-worktrees/property/hauska-map`.
- You MUST NOT open `fix/pe-pricing-a2` or any Reports branch.
- Doc_repo writes: CP1 / CP2 / close JSON only. Planner commits doc_repo.

## Mechanism (already measured; do not re-derive)

Hover paints `picked.feature.geometry` at `packages/map-renderer/src/map-renderer.js` ~384 onto `hauska-ovl-hover-highlight`. For vector tiles that geometry is one tile fragment. Simsbrook sits on a z16 seam cross. Feature-state already spans all fragments of an id (the pale fill). The blue box is the fragment.

`hover-peel.test.js` currently asserts the fragment `setData` path as correct. That test is the #204 identity peel. Keep the identity half (query `PARCEL_TILES_FILL_ID` only). Invert the geometry half.

## Mission

One hauska-map PR.

1. Add a `hover` branch to the existing tile fill/line paint expressions in `packages/map-renderer/src/map/parcel-tiles.js`. Safe channels only: fill-color / fill-opacity / line-color / line-width / line-blur. Never dasharray or gradient from feature-state.
2. On mousemove, `setParcelFeatureState` `{ hover: true }` on the promote id; clear the previous id. No `setData` of fragment geometry. Delete `HOVER_SOURCE_ID` layers/source or leave them unused and unwritten.
3. Grep for remaining pre-seal consumers of `picked.feature.geometry`. Retire those writes. Do not edit `apps/property-explorer/src/browse/inspect-highlight.ts` except comments. Post-seal stays on `sheet.geometry.rings`.
4. Violation test: a fixture parcel spanning a mocked tile boundary must highlight as one full lot. The old overlay path, given `hits[0].geometry` from one fragment, must fail that test. Prove the new test fails on the old path before deleting it.
5. Keep Find / rooftop-pick tests green. Hover hit-test stays on `PARCEL_TILES_FILL_ID` only.

CP1 before the paint-expression change: name the files, the hover feature-state key, and the exact assertion the old path will fail. CP2 after the violation test is shown to fail the old path and pass the new one.

## Out of scope

Rebake. Hide-tiles-on-zoom. Photon / Find identity. Live mesh revival. A2 / Reports. Seal-lifecycle replay, red-card, search-bar rewrite, near-bbox 504s.

## Return

PR number, merge SHA if merged, CI conclusion strings by check-run name, whether you deployed (planner-owned; Vercel project must be `property-explorer` `prj_vcZGXbqdffk5C20WzaplEpzFynK3`, never cmdcenter). CLOSE cites WDLL items 1–5 with evidence. Item 6 stays operator visual. leave_behind must name A2 rebase and the later seal-lifecycle card.
