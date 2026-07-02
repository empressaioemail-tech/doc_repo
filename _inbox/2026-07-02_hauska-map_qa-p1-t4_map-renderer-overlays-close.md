---
title: QA P1 T4 close — @hauska/map-renderer overlays prop wired (0.1.1)
date: 2026-07-02
agent: qa-p1-t4 (map-renderer overlays lead)
track: Phase 1 T4
repo: empressaioemail-tech/hauska-map
pr: https://github.com/empressaioemail-tech/hauska-map/pull/3
merge: ed63541c68a2dfe84f5ebef819d1027b2b3649b5
status: MERGED — publish 0.1.1 PENDING NPM_TOKEN
---

# QA P1 T4 close — map-renderer overlays

Wires `@hauska/map-renderer`'s reserved `overlays` prop to real MapLibre draw calls so the cortex Site-Analysis and Hazard tiles can render SpatialProvider overlays (flood, topography, drainage, rent-heat, parcel mesh). This closes the sole OPEN residual carried by the 2026-07-02 publish-swap-deploy close (map-renderer 0.1.1).

## Overlays implementation

New module `packages/map-renderer/src/map/overlay-render.js` exports `reconcileOverlays(map, specs, currentKeys)`. It reconciles the map's overlay layers to exactly the incoming `OverlaySpec[]`:

- Idempotent add. For each spec it checks `map.getSource(id)` first and calls `setData` on the existing GeoJSON source rather than re-adding it; each concrete layer is guarded by `if (!map.getLayer(id))`. Repeated calls with the same specs neither leak sources nor duplicate layers.
- Update in place. Paint overrides re-apply via `setPaintProperty`; visibility toggles via layout `visibility`.
- Remove on drop. `currentKeys` (the set currently drawn) is diffed against the incoming set; any layerKey no longer present has all its layers removed (all suffixes `-fill`/`-line`/`-circle`) BEFORE `removeSource`, so MapLibre never throws source-in-use.
- Geometry to layer. Polygon/MultiPolygon renders fill+line; Point/MultiPoint renders circle; LineString/MultiLineString renders line. A `choropleth` (property + `[value,color]` stops) drives a data-driven interpolate expression on the fill (or circle) color.
- Namespaced. Overlay source/layer ids are prefixed `hauska-ovl-`, so they never collide with the fixture `hauska-gis-` layer stack.

`createMapRenderer` (map-renderer.js) gained `setOverlays(specs)`: it stashes the specs and applies them immediately if the style is loaded, otherwise the `load` handler applies them once the style is ready. `FloatingMap.tsx` wires the `overlays` prop with a `useEffect([overlays])` that mirrors the existing `visibleLayers`/`parcel` wiring, plus a mount-time seed; passing `[]` or omitting the prop clears every drawn overlay.

`OverlaySpec` (postMessage.ts) extended with `layerKind`, `provider`, `choropleth`, and documented `paint` keys. Barrel (index.ts) now also exports `reconcileOverlays`, `overlaySourceId`, `OVERLAY_PREFIX`. Version bumped to 0.1.1. Path is CSP-safe and main-thread-canvas only (no OffscreenCanvas / transferControlToOffscreen / eval), consistent with the Track A render path.

The command-center consumer was extended to pass three sample overlays (a FEMA flood-zone polygon, a drainage line, a rent-heat point choropleth) behind a show/hide toggle, exercising all three geometry shapes and the idempotent add/remove path.

## Publish workflow added

`.github/workflows/publish-map-renderer.yml`: on a `map-renderer-v*` tag push (or manual `workflow_dispatch`), it runs pnpm install (frozen lockfile) -> `pnpm --filter @hauska/map-renderer build` -> `npm publish --access public` from `packages/map-renderer`, with `NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}` and `actions/setup-node` `registry-url: https://registry.npmjs.org`.

## Publish status

MERGED, publish 0.1.1 PENDING NPM_TOKEN. `gh api repos/empressaioemail-tech/hauska-map/actions/secrets` returned `total_count: 0` — the `NPM_TOKEN` Actions secret is not yet set on this repo, so publish was NOT attempted (agents have no npm credential; this is the same gap the 2026-07-02 close flagged). Per the dispatch guardrail, this did NOT block the merge. `npm view @hauska/map-renderer version` = `0.1.0` (0.1.1 not yet on npm).

Operator action to publish 0.1.1: set the `NPM_TOKEN` Actions secret (npm automation token with publish rights to the `@hauska` scope) on `empressaioemail-tech/hauska-map`, then either push the tag `map-renderer-v0.1.1` on `main` (`git tag map-renderer-v0.1.1 ed63541 && git push origin map-renderer-v0.1.1`) or trigger the `Publish @hauska/map-renderer` workflow manually. Verify with `npm view @hauska/map-renderer version`.

## Reviewer verdict

PASS. Adversarial reviewer ran from a fresh clone with a fake-map harness (records addSource/removeSource/addLayer/removeLayer, and its `removeSource` throws if any layer still references the source, mirroring MapLibre). 15/15 assertions passed: two identical reconciles call `addSource` exactly once per key with zero duplicate `addLayer` (2nd routed through `setData`); reconcile-then-`[]` fires `removeSource` with zero leftover layers and no source-in-use throw (proving remove ordering); polygon -> fill+line, point -> circle, line -> line. Both builds pass; consumer builds; no OffscreenCanvas/eval.

## Consumer bump one-liner (for the cortex team)

In `legacy-design-tools/packages/cortex-tiles`: bump `@hauska/map-renderer` from `^0.1.0` to `^0.1.1` in package.json, then in `MapTile.tsx` pass `overlays={spatialProviderOverlays}` to `FloatingMap` (map each SpatialProvider layer to an `OverlaySpec`: `{ layerKey, geojson, choropleth?, paint?, visible? }`). No API break — `overlays` is additive; omitting it keeps 0.1.0 behavior. (Cannot consume until 0.1.1 is on npm — see Publish status.)

## Verification (verbatim)

Package build tail:
```
CJS dist\index.cjs     101.67 KB
ESM dist\index.js      97.49 KB
DTS dist\index.d.cts   22.81 KB
DTS dist\index.d.ts    22.81 KB
```

Consumer build:
```
✓ 47 modules transformed.
✓ built in 2.47s
```

npm:
```
> npm view @hauska/map-renderer version
0.1.0
```

Merge:
```
2dc06a9..ed63541  main -> origin/main   (squash, PR #3, state MERGED)
```

## Blockers

None blocking. One operator dependency: set `NPM_TOKEN` on the repo to publish 0.1.1 (then a tag push publishes). Until then the cortex bump cannot land.
