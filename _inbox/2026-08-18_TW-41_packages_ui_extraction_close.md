---
title: "TW-41 close — @smart-markets/ui component library extraction"
status: complete
plan_row: TW-41
repo: empressaioemail-tech/smart-markets
branch: tw41/packages-ui
pr: 6
last_updated: 2026-08-18
---

# TW-41 close — packages/ui extraction

CANON-PREAMBLE v0f465c77 AGENT-CONTRACT v7b714e95. Row TW-41, operator-ruled 2026-08-18 (Smart Markets is unregistered R&D, bounded PRs, no OPS-16/17 PLAN-ROW by design; scope declared in `_rd_disclosure_twin/08_build_scope.md`).

## Result

Branch `tw41/packages-ui`, PR **#6**, https://github.com/empressaioemail-tech/smart-markets/pull/6 — OPEN, NOT MERGED, mergeable. Base `main` at `3dcba82`. Head commit `b13eb23`. CI green on both jobs.

All work was done in an isolated worktree at `P:/smart-markets-worktrees/tw41-packages-ui`, created with `git worktree add -b tw41/packages-ui P:/smart-markets-worktrees/tw41-packages-ui origin/main`. Nothing was checked out in `P:/smart-markets`. Nothing was pushed to main. Nothing was deployed: no vercel, no gcloud, no docker, no non-exiting command.

## Files moved, old path to new path

Every one is a `git mv`, so the diff reads as a rename and history follows.

| Old path | New path |
| --- | --- |
| `apps/web/src/components/AbsenceBlock.tsx` | `packages/ui/src/AbsenceBlock.tsx` |
| `apps/web/src/components/LayerRail.tsx` | `packages/ui/src/LayerRail.tsx` |
| `apps/web/src/components/LayerSection.tsx` | `packages/ui/src/LayerSection.tsx` |
| `apps/web/src/components/ProvenanceStamp.tsx` | `packages/ui/src/ProvenanceStamp.tsx` |
| `apps/web/src/components/ProxyBlock.tsx` | `packages/ui/src/ProxyBlock.tsx` |
| `apps/web/src/components/QuoteBlocks.tsx` | `packages/ui/src/QuoteBlocks.tsx` |
| `apps/web/src/components/UpstreamStatus.tsx` | `packages/ui/src/UpstreamStatus.tsx` |
| `apps/web/src/layers.ts` | `packages/ui/src/layers.ts` |
| `apps/web/src/styles.css` | `packages/ui/src/styles.css` |
| `apps/web/src/__tests__/absence-blocks.test.tsx` | `packages/ui/src/__tests__/absence-blocks.test.tsx` |

`apps/web/src/components/` is gone. `git mv` emptied it and the empty directory was removed. `layers.ts` and `styles.css` show `0` changed lines in the diff stat: pure moves, no content edit at all.

Stayed in `apps/web` exactly as specified: `src/App.tsx`, `src/main.tsx`, `src/client.ts`, `src/views/InstrumentView.tsx`, `src/views/SearchView.tsx`, `src/vite-env.d.ts`, `src/__tests__/instrument-surface.test.tsx`, `src/__tests__/smoke.test.tsx`, `src/__tests__/fixtures.ts`.

## Files created

`packages/ui/package.json`, `packages/ui/tsconfig.json`, `packages/ui/tsconfig.check.json`, `packages/ui/vitest.config.ts`, `packages/ui/scripts/copy-styles.mjs`, `packages/ui/src/index.ts`, `packages/ui/src/__tests__/fixtures.ts`.

## The layers.ts judgement call

**Moved into `packages/ui` and re-exported from the entry point.**

It is layer presentation metadata, not app routing or app state. It holds `LAYER_ORDER` (the contract's own `SERVED_LAYERS_V0_1`), `LAYER_TITLES` (the display strings), `presentLayers` / `omittedLayers` (derivations over a `Twin`), `omittedReason` (narration prose), `headlineSymbol` (which identifier to headline with), and `shortStamp` (timestamp display formatting). There is no router, no state, no fetching, and no app-shape assumption anywhere in it.

`LayerRail` is one of the moved components and imports three of its exports directly, so leaving `layers.ts` behind would have forced a library component to import from the app that consumes it — a dependency cycle and an inverted one. And the titles are shared: `InstrumentView` renders section headers from `LAYER_TITLES` while `LayerRail` renders switch labels from the same object, so splitting them across two workspaces would let a rail and a consumer's headers drift apart.

Its import inside `LayerRail.tsx` changed from `"../layers.js"` to `"./layers.js"`. That is the whole edit.

## The ci.yml diff

```diff
@@ -17,8 +17,10 @@ jobs:
         with:
           node-version: "20"
 
-      # The root postinstall builds packages/contract, so the api and web
-      # typechecks resolve @smart-markets/contract against real declarations.
+      # The root postinstall builds packages/contract and then packages/ui, so
+      # the api and web typechecks resolve @smart-markets/contract and
+      # @smart-markets/ui against real declarations. The order is load
+      # bearing: ui compiles against the contract's emitted types.
       - name: Install
         run: npm install --no-audit --no-fund
 
@@ -37,7 +39,18 @@ jobs:
       # Named explicitly rather than left to the root `npm test`, which runs
       # `--workspaces --if-present` and would silently skip the web surface
       # if its test script were ever removed. A gate that can be disabled by
-      # deleting a line is not a gate.
+      # deleting a line is not a gate. The same reasoning names the component
+      # library, which now carries the tests on the four kinds of nothing.
+      - name: UI tests
+        run: npm run test --workspace @smart-markets/ui
+
+      # The library's build is what a design tool and a second surface both
+      # consume, and the declarations are the API contract they read. Gating
+      # it here means a component that no longer emits types fails on the PR
+      # rather than at the consumer.
+      - name: UI build
+        run: npm run build --workspace @smart-markets/ui
+
       - name: Web tests
         run: npm run test --workspace @smart-markets/web
 
@@ -54,9 +67,13 @@ jobs:
       - name: Checkout
         uses: actions/checkout@v4
 
+      # packages/ui is named alongside apps/web because the components moved
+      # out of the app and into the library. Scoping this gate to apps/web
+      # alone after that move would leave the rendering code it was written
+      # to cover outside it.
       - name: The web app must not call an upstream directly
         run: |
-          if grep -RInE "(COCKPIT_BASE_URL|SMART_FILES_BASE_URL|sec\.gov|edgar|cmegroup\.com)" apps/web/src; then
+          if grep -RInE "(COCKPIT_BASE_URL|SMART_FILES_BASE_URL|sec\.gov|edgar|cmegroup\.com)" apps/web/src packages/ui/src; then
             echo "FAIL: apps/web reached for an upstream. The human door renders only what the union layer returns."
             exit 1
           fi
           echo "web-no-upstream-calls OK"
```

The third hunk is one change beyond what was asked for and I am flagging it rather than burying it. Moving the rendering code out of `apps/web/src` silently narrowed the scope of a gate written to cover that rendering code. Adding `packages/ui/src` to the grep path restores the coverage the move would otherwise have removed. It changes no gate semantics and it passes.

## Proof the declarations were emitted

`ls packages/ui/dist`:

```
AbsenceBlock.d.ts
AbsenceBlock.d.ts.map
AbsenceBlock.js
AbsenceBlock.js.map
LayerRail.d.ts
LayerRail.d.ts.map
LayerRail.js
LayerRail.js.map
LayerSection.d.ts
LayerSection.d.ts.map
LayerSection.js
LayerSection.js.map
ProvenanceStamp.d.ts
ProvenanceStamp.d.ts.map
ProvenanceStamp.js
ProvenanceStamp.js.map
ProxyBlock.d.ts
ProxyBlock.d.ts.map
ProxyBlock.js
ProxyBlock.js.map
QuoteBlocks.d.ts
QuoteBlocks.d.ts.map
QuoteBlocks.js
QuoteBlocks.js.map
UpstreamStatus.d.ts
UpstreamStatus.d.ts.map
UpstreamStatus.js
UpstreamStatus.js.map
index.d.ts
index.d.ts.map
index.js
index.js.map
layers.d.ts
layers.d.ts.map
layers.js
layers.js.map
styles.css
```

Every module emits a `.d.ts` and a `.d.ts.map`, and `styles.css` is in `dist` and reachable as `@smart-markets/ui/styles.css` through the `exports` map. `packages/ui/dist/styles.css` diffed against `origin/main:apps/web/src/styles.css` is identical, zero differing lines; 355 `--sm-` occurrences intact, no reformat, no re-order, no hex touched.

Every exported component's props type is exported. `packages/ui/dist/index.d.ts`:

```
export { AbsenceBlock, OmittedBlock } from "./AbsenceBlock.js";
export type { AbsenceBlockProps, OmittedBlockProps } from "./AbsenceBlock.js";
export { LayerRail } from "./LayerRail.js";
export type { LayerRailProps } from "./LayerRail.js";
export { LayerSection } from "./LayerSection.js";
export type { AnyLayer, LayerSectionProps } from "./LayerSection.js";
export { ProvenanceStamp } from "./ProvenanceStamp.js";
export type { ProvenanceStampProps } from "./ProvenanceStamp.js";
export { ProxyBlock } from "./ProxyBlock.js";
export type { ProxyBlockProps } from "./ProxyBlock.js";
export { MarketQuotes } from "./QuoteBlocks.js";
export type { MarketQuotesProps } from "./QuoteBlocks.js";
export { UpstreamBanner, UpstreamChip } from "./UpstreamStatus.js";
export type { UpstreamBannerProps, UpstreamChipProps } from "./UpstreamStatus.js";
export { headlineSymbol, LAYER_ORDER, LAYER_TITLES, omittedLayers, omittedReason, presentLayers, shortStamp, } from "./layers.js";
```

`packages/ui/dist/AbsenceBlock.d.ts`, the load-bearing one:

```
import type { Absence, ProvenanceClass } from "@smart-markets/contract";
export type AbsenceBlockProps = {
    absence: Absence;
    /** What the absence is about, e.g. "issuer disclosure". Our words. */
    subject?: string;
    /**
     * The class this content would have carried had it been there.
     * `provenanceClass` is on all four layer branches for exactly this reason:
     * a consumer told that nothing is here still needs to know what kind of
     * thing is missing.
     */
    provenanceClass?: ProvenanceClass;
    inset?: boolean;
};
export declare function AbsenceBlock({ absence, subject, provenanceClass, inset, }: AbsenceBlockProps): import("react").JSX.Element;
/**
 * NOTE THE ABSENT FIELDS. There is no `absence` and no `provenanceClass`
 * here, and adding either for symmetry with `AbsenceBlockProps` would hand
 * this block the ability to name an authority nobody consulted. The type is
 * the enforcement.
 */
export type OmittedBlockProps = {
    headline: string;
    reason: string;
    inset?: boolean;
};
/**
 * OMITTED. The fourth nothing, and the only one the server did not say.
 *
 * ...
 *
 * IT TAKES NO `Absence` AND HAS NO AUTHORITY ROW. That is structural, not a
 * styling choice. Nothing was searched and no authority was consulted, so
 * there is no determination to show, and a block that showed one would have
 * invented a determination nobody made. The component cannot render an
 * authority because it is never given one.
 */
export declare function OmittedBlock({ headline, reason, inset }: OmittedBlockProps): import("react").JSX.Element;
```

`OmittedBlockProps` carries neither an `absence` nor a `provenanceClass`. The invariant is now enforced by the exported type, not only by the component body.

## What changed inside the moved component files, and what did not

**Not changed:** any markup, any `className`, any `data-` attribute, any copy string, any prop default, any control flow, any rendered value. **No test assertion was changed anywhere.** The moved test's only edit is its import path (`"../components/AbsenceBlock.js"` to `"../AbsenceBlock.js"`).

**Changed, mechanically, in every component file:** the inline anonymous props object type was lifted out and given an exported name, because "every exported component's props type must be exported too" cannot be satisfied by an anonymous inline type. Each named type is placed **above** the component's doc comment so that comment stays attached to the component in the emitted `.d.ts` rather than sliding onto its props — the first pass put the type between the comment and the function and orphaned the design rationale in the declarations, which for a package whose declarations are read by a design tool is a real regression, so it was corrected before commit.

Byte-level evidence that the rendering did not move: `vite build` produces `assets/index-DGeyXx3g.css` and `assets/index-Dp3eYHfS.js` both before and after the props-type reordering, and the CSS asset is 17.42 kB in both.

## Raw verification output

### npm install

```
> smart-markets@0.1.0 postinstall
> npm run build --workspace @smart-markets/contract && npm run build --workspace @smart-markets/ui


> @smart-markets/contract@0.1.0 build
> tsc -p tsconfig.json


> @smart-markets/ui@0.1.0 build
> tsc -p tsconfig.json && node scripts/copy-styles.mjs


up to date in 4s
```

### npm run build (root, all workspaces)

```
> smart-markets@0.1.0 build
> npm run build --workspaces --if-present


> @smart-markets/contract@0.1.0 build
> tsc -p tsconfig.json


> @smart-markets/ui@0.1.0 build
> tsc -p tsconfig.json && node scripts/copy-styles.mjs


> @smart-markets/api@0.1.0 build
> tsc -p tsconfig.json


> @smart-markets/web@0.1.0 build
> tsc --noEmit -p tsconfig.json && vite build

vite v5.4.21 building for production...
transforming...
✓ 67 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                   0.69 kB │ gzip:  0.42 kB
dist/assets/index-DGeyXx3g.css   17.42 kB │ gzip:  3.84 kB
dist/assets/index-Dp3eYHfS.js   242.05 kB │ gzip: 68.66 kB │ map: 740.73 kB
✓ built in 585ms
```

### npm run test --workspace @smart-markets/ui

```
> @smart-markets/ui@0.1.0 test
> vitest run


 RUN  v2.1.9 P:/smart-markets-worktrees/tw41-packages-ui/packages/ui

 ✓ src/__tests__/absence-blocks.test.tsx (6 tests) 33ms

 Test Files  1 passed (1)
      Tests  6 passed (6)
   Start at  07:40:34
   Duration  1.09s (transform 102ms, setup 0ms, collect 265ms, tests 33ms, environment 475ms, prepare 82ms)
```

### npm run test --workspace @smart-markets/web

```
> @smart-markets/web@0.1.0 test
> vitest run


 RUN  v2.1.9 P:/smart-markets-worktrees/tw41-packages-ui/apps/web

 ✓ src/__tests__/smoke.test.tsx (2 tests) 25ms
 ✓ src/__tests__/instrument-surface.test.tsx (19 tests) 265ms

 Test Files  2 passed (2)
      Tests  21 passed (21)
   Start at  07:40:36
   Duration  1.45s (transform 215ms, setup 0ms, collect 705ms, tests 290ms, environment 1.02s, prepare 184ms)
```

### npm run lint

```
> smart-markets@0.1.0 lint
> eslint .

LINT OK (exit 0)
```

### npm run build --workspace @smart-markets/web

```
> @smart-markets/web@0.1.0 build
> tsc --noEmit -p tsconfig.json && vite build

vite v5.4.21 building for production...
transforming...
✓ 67 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                   0.69 kB │ gzip:  0.42 kB
dist/assets/index-DGeyXx3g.css   17.42 kB │ gzip:  3.84 kB
dist/assets/index-Dp3eYHfS.js   242.05 kB │ gzip: 68.66 kB │ map: 740.73 kB
✓ built in 584ms
```

### npm run typecheck (not asked for, run anyway)

```
> smart-markets@0.1.0 typecheck
> npm run typecheck --workspaces --if-present


> @smart-markets/contract@0.1.0 typecheck
> tsc --noEmit -p tsconfig.check.json


> @smart-markets/ui@0.1.0 typecheck
> tsc --noEmit -p tsconfig.check.json


> @smart-markets/api@0.1.0 typecheck
> tsc --noEmit -p tsconfig.check.json


> @smart-markets/web@0.1.0 typecheck
> tsc --noEmit -p tsconfig.json
```

### git diff --stat origin/main HEAD

```
 .github/workflows/ci.yml                           | 25 ++++++++--
 README.md                                          |  5 +-
 apps/web/package.json                              |  1 +
 apps/web/src/App.tsx                               |  4 +-
 apps/web/src/main.tsx                              |  3 +-
 apps/web/src/views/InstrumentView.tsx              | 17 +++----
 apps/web/src/views/SearchView.tsx                  |  3 +-
 package-lock.json                                  | 27 +++++++++++
 package.json                                       |  2 +-
 packages/ui/package.json                           | 42 +++++++++++++++++
 packages/ui/scripts/copy-styles.mjs                | 13 ++++++
 .../ui/src}/AbsenceBlock.tsx                       | 38 +++++++++-------
 .../components => packages/ui/src}/LayerRail.tsx   | 18 ++++----
 .../ui/src}/LayerSection.tsx                       | 26 +++++------
 .../ui/src}/ProvenanceStamp.tsx                    |  6 ++-
 .../components => packages/ui/src}/ProxyBlock.tsx  |  6 ++-
 .../components => packages/ui/src}/QuoteBlocks.tsx |  6 ++-
 .../ui/src}/UpstreamStatus.tsx                     | 12 ++++-
 .../ui}/src/__tests__/absence-blocks.test.tsx      |  2 +-
 packages/ui/src/__tests__/fixtures.ts              | 41 +++++++++++++++++
 packages/ui/src/index.ts                           | 53 ++++++++++++++++++++++
 {apps/web => packages/ui}/src/layers.ts            |  0
 {apps/web => packages/ui}/src/styles.css           |  0
 packages/ui/tsconfig.check.json                    |  9 ++++
 packages/ui/tsconfig.json                          | 16 +++++++
 packages/ui/vitest.config.ts                       | 18 ++++++++
 26 files changed, 328 insertions(+), 65 deletions(-)
```

Ten of the twenty-six rows render as `{old => new}` renames. `layers.ts` and `styles.css` show zero changed lines.

### CI on PR #6

```
build-test	pass	1m15s	https://github.com/empressaioemail-tech/smart-markets/actions/runs/32138275015/job/95714610245
structural-gates	pass	6s	https://github.com/empressaioemail-tech/smart-markets/actions/runs/32138275015/job/95714610159
```

```
✓ build-test in 1m15s (ID 95714610245)
  ✓ Set up job
  ✓ Checkout
  ✓ Set up Node 20
  ✓ Install
  ✓ Typecheck
  ✓ Lint
  ✓ Format check
  ✓ Test
  ✓ UI tests
  ✓ UI build
  ✓ Web tests
  ✓ Web build
  ✓ Post Set up Node 20
  ✓ Post Checkout
  ✓ Complete job
```

Both new steps ran and passed on the runner, and `Format check` is green on Linux.

## The one item I did not run as specified, and why

`npm run format:check` is red locally with 77 files flagged, including `tsconfig.base.json` and every file under `packages/contract` that this branch never touches. Intersecting the failing list with `git status` shows the overlap is entirely files with CRLF line endings — `core.autocrlf` is `true` on this box, so the working copy is CRLF while the repo stores LF. Re-running as `npx prettier --check --end-of-line auto .` reports `All matched files use Prettier code style!` with exit 0, which isolates the content formatting from the line endings and confirms the new and edited files are clean. Nothing was staged to "fix" it and `prettier --write` was never run at the repo root. The CI `Format check` step passed on the Linux runner, which is the authoritative answer.

## Deliberate departures worth a reviewer's eye

1. **`packages/ui/src/__tests__/fixtures.ts` is a new file, not a move.** The dispatch keeps `apps/web/src/__tests__/fixtures.ts` in the app, but the moved test imports from it. The library cannot import a helper out of the app that depends on the library, so `packages/ui` carries its own copy holding only the two fixtures the component test reads (`gcTwin`, `cvrbTwin`) plus `textOf` and `footerLabels`. Both copies load the same committed golden JSON through the contract's own `parseFixture`, so they cannot drift from the schema; they can in principle drift from each other in their helper bodies, which is the cost of the direction of the dependency. Folding both into a shared test-helper package is the alternative and it was not in scope.

2. **`react` is a `peerDependency` of `@smart-markets/ui`, not a dependency** (and a devDependency so the package can build and test itself). `packages/contract` has no analogous case to mirror. A component library that hard-depends on React can put two Reacts in a consumer's tree, which breaks hooks.

3. **`packages/ui/tsconfig.json` uses `module: ESNext` / `moduleResolution: Bundler`, where `packages/contract` uses `NodeNext`.** The library is React and browser code and the repo already typechecks its React with `Bundler` in `apps/web`. `NodeNext` additionally rejects the fixture JSON imports in the test without `with { type: "json" }` import attributes. Emitted specifiers keep their `.js` extensions, so the output is still valid Node ESM.

4. **`packages/ui/scripts/copy-styles.mjs` exists because `tsc` copies no assets.** Nothing under `src` imports it — the memory note about `src` importing `scripts/*.mjs` polluting the test bundle is respected; it runs only from the `build` script.

5. **`README.md` gained three lines** describing `packages/ui` in the Layout block and the postinstall note. Not requested, but a layout section that omits a workspace is wrong the moment this merges.

## Anything I could not do

Nothing. Every item in the dispatch was completed. The PR is open and unmerged for planner review, as instructed.

## Bugs found

None. Nothing in the moved code needed a fix and nothing was fixed.
