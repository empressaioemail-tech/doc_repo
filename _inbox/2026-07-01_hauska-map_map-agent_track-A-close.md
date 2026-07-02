---
title: Track A close — @hauska/map-renderer extraction
date: 2026-07-01
agent: map-agent
track: A
repo: empressaioemail-tech/hauska-map
pr: https://github.com/empressaioemail-tech/hauska-map/pull/2
status: COMPLETE
supersedes: the earlier BLOCKED report at this same path (package-vs-iframe conflict)
---

# Track A close — @hauska/map-renderer

## Note on the prior BLOCKED report

An earlier map-agent run wrote a BLOCKED report at this path: it correctly identified that hauska-map is a vanilla-JS Vite app (no React/TS, no FloatingMap.tsx to extract) and that the sprint docs carried two incompatible Track A models (React package vs iframe/service). The operator resolved that on 2026-07-01: build the React package model, `@hauska/map-renderer` as a real React+TS package, chosen over the iframe/service model. This run honored that decision and completed it as a PORT of the working vanilla map logic into a React+TS package (not a copy-extract, since there was no React component to extract). This report supersedes the BLOCKED one.

## Package version

`@hauska/map-renderer@0.1.0`

## npm status

Workspace-linked (`workspace:*`). NOT published. npm auth is not present on this machine (`npm whoami` returns 401), so per the dispatch guardrail publish was skipped rather than forced. Track C and any other consumer link via the pnpm workspace today; a clean `npm publish --access public` can happen later once npm auth is set. The package is publish-shaped (`private: false`, `files: ["dist"]`, `exports` map, `dist/` builds to cjs+esm+dts).

## What shipped

Phase 1 — scaffold and extract.
The pending E6 commit was already on origin/main (HEAD == origin/main at `9552799`), so nothing was owed to push (dispatch step 1A is a no-op, as the prior report also noted). Set up a pnpm workspace (`pnpm-workspace.yaml` with `packages/*` and `apps/*`, root `package.json` as workspace root). Scaffolded `packages/map-renderer` per the dispatch's package.json/tsup.config shape, with one correction: tsup under `type: module` emits `index.js` for ESM and `index.cjs` for CJS, so the `exports` map points at those actual filenames rather than the dispatch's `index.mjs`. Ported the proven E6 map chain into the package by `git mv` (history-preserving, no dual copies): the renderer factory (`map-renderer.js`), layer registry and allocation, the floating-window FSM, the whole `map/gis-*` render stack, `read-contract`, `input-gates`, `positioning`, and `report-layer-manifest`. Fixed intra-package import paths after the move. Repointed the root vanilla spine-console to import the map chain from `@hauska/map-renderer`, making the root console the first (vanilla) consumer of its own package.

Phase 2 — React component and render path.
Wrote `FloatingMap.tsx`, a React wrapper that mounts the vanilla `createMapRenderer` into a ref'd `<div>` (main-thread canvas) and wraps it with the vanilla `createFloatingWindow` FSM. Props forward through the proven imperative contract via effects: `visibleLayers`, `center`/`address`, `parcel` fly-to, `onParcelSelect`, `onWindowStateChange`. Title-bar controls (float/snap/min/max/close) are wired to the FSM. A `FloatingMapHandle` ref exposes `getViewState`/`setViewState`/`getMap`/`window`. Effect cleanup calls `renderer.destroy()` (→ `map.remove()`) and removes listeners on unmount. Barrel `index.ts` exports `FloatingMap`, `LayerRegistry` (registry array alias), `createMapRenderer`, `createFloatingWindow`, the postMessage/overlay contract types (`OverlaySpec`, `LayerDef`, `ParcelSelection`, `ViewState`, `PostMessageContract`, `WindowState`, `LayerKey`, `Center`), plus the registry/gate/manifest/read-contract helper functions the console consumes. `styles.css` carries the floating-window chrome; MapLibre's own CSS is imported by the consumer.

Phase 3 — consumer and proof.
Added `apps/command-center`, a minimal Vite + React app importing `FloatingMap` from `@hauska/map-renderer` (bare specifier, not a relative path) and rendering it. This is the in-repo rendering proof and the exact pattern Track C's cortex-tiles will use. (Bounded scope: this is a minimal React shell, not a full migration of the vanilla console — the vanilla console remains and now consumes the package too.)

A follow-up fixup commit repointed two dangling imports the first repoint missed in the root vanilla console (`spine-api.js` fixture import; `productSurfaceForLayer` missing from the barrel), caught by adversarial review. After the fixup, all three build targets (package, root vanilla console, command-center) build.

## OffscreenCanvas worker

Fallback used — main-thread canvas. Reason: the dispatch Phase 2 proposed running MapLibre headless in a Web Worker via `new maplibregl.Map({ canvas: offscreen })` over `transferControlToOffscreen()`. Spiked against the installed `maplibre-gl@5.24.0` type definitions and bundles BEFORE writing worker code. MapLibre GL JS v5 does not support this: `MapOptions.container: HTMLElement | string` is a required field ("the HTML element in which MapLibre GL JS will render"), and there is no `canvas`/`OffscreenCanvas` option on the `Map` constructor (the `canvas?: string | HTMLCanvasElement` in the types belongs to `CanvasSource`, a raster data source, not `MapOptions`). MapLibre's own `OffscreenCanvas` usage is confined to its internal tile-parsing worker (`maplibre-gl-csp-worker.js`), which is not a public "run the whole map in a worker" API; worker behavior is configured only via `setWorkerUrl`/`setWorkerCount`. So the worker path would have shipped non-functional code. Per the operator's explicit fallback instruction, `FloatingMap` renders MapLibre on a standard main-thread canvas inside the React component — the proven E6 path — which is a valid React package. This confirms the caution the prior BLOCKED report had already flagged about the OffscreenCanvas assumption.

CSP implications: main-thread MapLibre still spawns MapLibre's own internal tile-parsing worker and uses WebGL, exactly as every MapLibre app does. This package introduces no additional page-CSP burden beyond what any MapLibre consumer already requires (`worker-src blob:` for MapLibre's internal worker, WebGL enabled). The dispatch's premise that a user worker would "bypass the consuming app's page CSP entirely" does not hold, because the path it relied on does not exist in MapLibre v5; the realistic posture is the standard MapLibre CSP, which the extension and cortex workspace already satisfy. If a future MapLibre version adds a supported OffscreenCanvas Map path, the `postMessage.ts` `PostMessageContract` type is already the transport contract to swap the internals behind without changing the public props.

## Verification

command-center renders map: YES. Verified by ACTUAL render in headless Chrome (Playwright driving the system Chrome at `C:/Program Files/Google/Chrome/Application/chrome.exe`) against the command-center dev server. Result: the `.hauska-fw` floating window mounts; MapLibre injects `canvas.maplibregl-canvas` (640x448); the canvas has a live `WebGL2RenderingContext`; the MapLibre navigation control renders; all fixture layers render (screenshot shows the CARTO/OSM Bastrop basemap with street labels, parcel choropleth, rent-heat fire ramp, hydrology flow lines); zero page errors and no CSP/worker exceptions. The only console line is a transient favicon 404, which does not reproduce on reload and is not a map resource.

Independent adversarial review (separate fresh clone) confirmed: fresh `pnpm install` resolves without any sibling-repo tgz; `@hauska/atom-contract@1.5.0` pulls from npm; react/react-dom are true peers (no bundled React in output); no dual copies of the ported source; the FSM buttons genuinely drive window state (min/max/float verified); and effect cleanup fires correctly under React StrictMode double-mount (exactly one canvas survives). The reviewer initially caught the root-console dangling-import regression, which the fixup commit resolved; re-verification confirmed all three build targets pass.

package build: PASS. `pnpm --filter @hauska/map-renderer build` produces `dist/index.js` (ESM), `dist/index.cjs` (CJS), `dist/index.d.ts` + `index.d.cts` (types), `dist/styles.css`, and sourcemaps. DTS build is clean. `dist/` is gitignored (build output not committed).

## DNS

Package-only — no CNAME / no Cloud Run map service needed. With the React package model there is no running map server, so the `map.hauska.io` CNAME is unnecessary. Consumers import the component and bundle it themselves.

## Unblocks

Track C (cortex-tiles) can now import `@hauska/map-renderer`.

For Track C — how to import:
- `import { FloatingMap } from "@hauska/map-renderer"` (named export).
- Also `import "@hauska/map-renderer/styles.css"` and `import "maplibre-gl/dist/maplibre-gl.css"` in the consuming app.
- Peer deps: `react >=18`, `react-dom >=18` (provided by the consumer). Regular deps `maplibre-gl` and `@hauska/atom-contract` are declared by the package.
- Key props: `center?: {latitude, longitude}`, `address?: string`, `useFixture?: boolean`, `visibleLayers?: Set<string> | string[]`, `parcel?: ParcelSelection | null`, `onParcelSelect?: (sel) => void`, `floating?: boolean` (default true — set `false` for a plain filled div with no window chrome, which is what a tile grid will usually want), `title?: string`, `style`/`className`. Ref handle exposes `getViewState`/`setViewState`/`getMap`/`window` (FSM control).
- Barrel also exports `LayerRegistry`, `DEFAULT_VISIBLE_LAYERS`, layer/gate/manifest helper functions, and the contract types (`OverlaySpec`, `LayerDef`, `ParcelSelection`, `ViewState`, `PostMessageContract`).

## Rollback

Revert the merge of PR #2 on `main`. The prior command-center state is commit `9552799` (E1-E7 operator surfaces). The package and the React consumer app are additive; the only change to pre-existing code is the import repointing in the root vanilla console, which the merge revert undoes cleanly.
