---
id: 2026-07-27_QA1_road_feathered_grey_render
title: QA1 dispatch — road render as feathered light-grey corridor (art-directed)
date: 2026-07-27
status: dispatched
owner: nick
planner: qa
repo: hauska-map
related: [2026-07-27_bastrop_qa_defect_register]
---

# QA1 — Road render: feathered light-grey corridor

You are a build agent. Fix ONE thing: the property-explorer map road rendering. The data is 100% correct and roads serve to the viewport fine. This is a PURE STYLING change to a specific operator-approved art direction. Do not touch road data, road-node fetch, near-bbox, or any engine code.

## M0 warm-start (read before touching code)
- Repo: hauska-map. Work off origin/main. Branch `qa/road-feathered-grey`.
- The road overlay is built in `apps/property-explorer/src/browse/road-overlay.ts` and painted by `packages/map-renderer/src/map/overlay-render.js`.
- CRASH GUARD (load-bearing): `packages/map-renderer/src/map-renderer.crash-guard.test.js` proves `line-gradient` driven from feature-state is a MapLibre CRASH source and is forbidden. DO NOT use line-gradient for the feather. The SAFE feather technique is `line-blur` — the same test asserts "glow uses line-blur (safe)". Working precedent to copy: `packages/map-renderer/src/map/gis-hydrology-flow.js` uses `"line-blur": 4` for soft flow lines. Use that pattern.

## The art direction (operator-approved, exact)
Roads must render as a SOFT, FEATHERED LIGHT-GREY CORRIDOR — a gentle grey presence UNDER the parcels, not heavy blue bands over them. Specifically:
1. The ROW/road band = a WIDE, LOW-OPACITY LIGHT-GREY line with `line-blur` so its edges FEATHER out to transparent (soft glow corridor, no hard polygon edge). Grey, not blue.
2. The centerline = a SUPER FAINT hairline down the middle (very low opacity, thin). Keep it, but barely-there.
3. The ROW boundary edges (currently the second/third stacked lines) = REMOVE them as their own visible strokes. The feathered band IS the ROW representation now. (Keep the edge geometry available in the data; just don't paint hard edge lines.)
4. Everything zoom-scaled: thin/faint at overview zoom, gently wider as you zoom in. Use `["interpolate",["linear"],["zoom"], z1,w1, z2,w2]` expressions for width AND blur AND opacity, not fixed pixels.
5. Z-ORDER: roads MUST render BENEATH the parcel line/fill layers so parcels read crisp on top. Today roads are added with no `beforeId` and re-added ABOVE parcels on every pan/zoom — this is the bug that makes roads obscure parcels. Fix it: give road layers a `beforeId` that puts them below `hauska-parcel-tiles-fill`/`-line` (see `packages/map-renderer/src/map/parcel-tiles.js`), and preserve that ordering across the `reconcileOverlays` re-run on viewport move (`map-renderer.js` applyOverlays/reconcileOverlays path).

Net look: parcels crisp and legible; roads a soft feathered light-grey corridor with a whisper of a centerline; nothing blue; nothing obscuring parcels.

## Files
- `apps/property-explorer/src/browse/road-overlay.ts` — replace the two hard-stroke specs (centerline 2.5px/blue :95-107 and ROW edges 1.5px/blue :81-93). New: one wide blurred grey band spec + one faint hairline centerline spec. Colors from a single road-style constant block (light grey, e.g. neutral grey ~#9aa4ad or lighter — pick what reads best, faint). Remove the ROW_EDGE hard-line spec.
- `packages/map-renderer/src/map/overlay-render.js` — the single choke point (~:193-215) where overlay line specs become MapLibre layers. It currently forces a constant `line-width` and appends on TOP (no beforeId). Add: (a) pass through `line-blur` and zoom-interpolation expressions from the spec paint, (b) `beforeId` support so road overlays draw beneath parcels. Do NOT break other overlay consumers (flood, envelope, hydrology) — additive.
- Keep changes minimal and additive; do not refactor the renderer broadly.

## Verify (you do NOT grade MET)
1. `pnpm -C apps/property-explorer build` clean; renderer package build clean.
2. Add/extend a styling regression test: road paint uses `line-blur` (feather) + zoom-interpolated width + grey (not the old blue #1a5f9e/#3b82b0), and road layer is added with a `beforeId` (drawn below parcels). Test goes RED on pre-fix code. Confirm crash-guard test still passes (no line-gradient introduced).
3. Deploy a Vercel PREVIEW of property-explorer and give the planner the preview URL. Do NOT shift production.
4. Report: branch, PR, SHA, build result, test result, preview URL. The OPERATOR looks at the preview across multiple parcels and the PLANNER grades MET after that. You do not claim MET.

Deploys are planner/agent-owned; if the preview deploy fails, fix it yourself (do not escalate the deploy to the operator).
