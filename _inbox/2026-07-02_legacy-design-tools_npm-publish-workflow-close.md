---
id: inbox/2026-07-02_legacy-design-tools_npm-publish-workflow-close
title: npm publish workflow close — 5 @hauska component packages live on npm
status: COMPLETE
date: 2026-07-02
agent: cc-agent (lead execution, npm publish track)
repo: empressaioemail-tech/legacy-design-tools
pr: 224
merge_commit: 21bb7f1d37d7d10912737ac6e7aa6c0146353e9c
reviewer_verdict: PASS (packed-tarball external-install test, all 5)
---

# npm publish workflow close

All five in-repo @hauska component packages are now published to npm at 0.1.0, externally installable per the C5 requirement (external consumers resolve to built dist, not the src-only workspace path). PR #224 squash-merged to main. No cortex-api deploy from this track (left to the sibling agent).

## Status

DONE. Published to npm: `@hauska/design-tokens@0.1.0`, `@hauska/cortex-client@0.1.0`, `@hauska/tile-shell@0.1.0`, `@hauska/document-viewer@0.1.0`, `@hauska/cortex-tiles@0.1.0`. All five verified live (npm view via the workflow's re-run verify step; see proof below). `@hauska/map-renderer@0.1.1` and `@hauska/atom-contract@1.5.0` were already on npm and are consumed as npm deps.

## The workflow

Added `.github/workflows/publish-packages.yml`. Trigger: `workflow_dispatch` (with a `dry_run` boolean input) plus a `packages-v*` tag push. Sets up node 20 with `registry-url: https://registry.npmjs.org`, `pnpm install --frozen-lockfile`, builds the React/TS packages via tsup in dependency order, then publishes each with `pnpm publish --access public --no-git-checks` and `NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}`. Idempotent: each package is skipped if that exact version is already on npm (an `npm view name@version` guard), so re-dispatch is safe and never attempts a re-publish (npm forbids re-publishing a version anyway). `dry_run=true` packs only, does not publish. Publish order in the workflow: design-tokens, cortex-client (leaves), then tile-shell, document-viewer, then cortex-tiles last.

The token gate: there is NO working local npm publish credential in this environment (`npm whoami` returns E401; the local `~/.npmrc` token is stale). The only working credential is the `NPM_TOKEN` Actions secret on the repo. So publishing was done via `gh workflow run` dispatching the merged workflow, which reads `secrets.NPM_TOKEN` in CI. This is also the durable path Chris/anyone re-runs later.

## Per-package publish-readiness fixes

Each package now: `files` includes the build output; `publishConfig.access = public`; `license` added; the `exports` map keeps the `workspace` condition first (the monorepo's vite/tsc resolve it via `--conditions=workspace` / `customConditions:["workspace"]`) but the standard conditions (`types`/`import`/`require`/`default`) point at dist, so an external install that does NOT pass `--conditions=workspace` lands on dist.

- `@hauska/design-tokens`: CSS-only. `files: ["tokens.css"]`, `main`/`exports` at `./tokens.css`. No build step (nothing to compile).
- `@hauska/cortex-client`: `files: ["dist"]`, `sideEffects: false`, `default` condition added. Zero @hauska deps. Builds cjs+esm+dts via tsup.
- `@hauska/tile-shell`: `files: ["dist"]`. Exposes `./index.css` and `./dist/index.css` subpath exports (the built `shell.css`). Depends on `@hauska/design-tokens` via `workspace:*` (rewritten to `0.1.0` on pack). react/react-dom peers.
- `@hauska/document-viewer`: `files: ["dist"]`. `pdfjs-dist` kept as a regular dependency (heavy lib, auto-installs for the consumer); react/react-dom peers. Benign esbuild `import.meta.url` warning in the CJS build (pdfjs worker URL) — non-blocking, ESM/bundler consumers unaffected.
- `@hauska/cortex-tiles`: `files: ["dist"]`. `@hauska/map-renderer` bumped to `^0.1.1` (npm) — this overlapped the sibling PR #223 which had already made the same bump; the rebase conflict was resolved keeping map-renderer at `^0.1.1` and `maplibre-gl` at `^5.24.0` as a regular dependency (matching #223's now-merged main form; not moved to a peer, to avoid regressing the monorepo app which has `autoInstallPeers: false` and no direct maplibre-gl dep). cortex-client/tile-shell/design-tokens stay `workspace:*` (rewritten to `0.1.0` on pack). react/react-dom peers.

`pnpm pack` (and `pnpm publish`) rewrite the `workspace:*` protocol to the real published version, so the published tarballs carry concrete versions, not `workspace:`.

## External-install test evidence (the adversarial-review gate, done before the irreversible publish)

Packed all 5 with `pnpm pack` into a shared dir, then ran a REAL external install in a fresh dir OUTSIDE the monorepo (`npm init -y` + `npm install` of the 5 local tarballs + react/react-dom/maplibre-gl peers). map-renderer/atom-contract pulled from npm. Results (verbatim):

Tarball contents — all contain built dist:
```
hauska-design-tokens-0.1.0.tgz   -> package/tokens.css
hauska-cortex-client-0.1.0.tgz   -> package/dist/index.{js,mjs,d.ts,d.mts}
hauska-tile-shell-0.1.0.tgz      -> package/dist/index.{js,mjs,d.ts,d.mts} + dist/index.css
hauska-document-viewer-0.1.0.tgz -> package/dist/index.{js,mjs,d.ts,d.mts}
hauska-cortex-tiles-0.1.0.tgz    -> package/dist/index.{js,mjs,d.ts,d.mts}
```

workspace:* rewrite confirmed in the packed cortex-tiles manifest:
```
"@hauska/map-renderer": "^0.1.1",
"@hauska/cortex-client": "0.1.0",
"@hauska/tile-shell": "0.1.0",
"@hauska/design-tokens": "0.1.0"
```

Node resolution WITHOUT --conditions=workspace lands on dist (require -> .js, import -> .mjs); design-tokens -> tokens.css:
```
cortex-client:   .../node_modules/@hauska/cortex-client/dist/index.js
tile-shell:      .../node_modules/@hauska/tile-shell/dist/index.js
document-viewer: .../node_modules/@hauska/document-viewer/dist/index.js
cortex-tiles:    .../node_modules/@hauska/cortex-tiles/dist/index.js
design-tokens:   .../node_modules/@hauska/design-tokens/tokens.css
map-renderer:    .../node_modules/@hauska/map-renderer/dist/index.cjs   (from npm, v0.1.1)
esm import.meta.resolve('@hauska/cortex-tiles') -> .../dist/index.mjs
```

WITH --conditions=workspace it seeks src/index.ts (which is NOT shipped in the tarball), proving the two branches are genuinely distinct and an external install can never hit src:
```
--conditions=workspace -> Cannot find module '.../@hauska/cortex-client/src/index.ts'
```

Runtime + bundler: `require('@hauska/cortex-client')` loads and executes (exports: CortexApiError, TILE_CAPABILITIES, TILE_CAPABILITY_BY_ID, createCortexClient — createCortexClient is a function). A consumer importing PropertyBriefTile/HazardProfileTile/CortexProvider/MapTile/DataroomTile/createCortexClient/CortexShell/PDFViewer + tokens.css bundles under esbuild (browser platform, CSS handled) to 968KB, exit 0, with ZERO `workspace:` or `/src/index.ts` leaks in the bundle. (Bare `node` cannot import the tile packages directly only because they carry `.css` side-effect imports from map-renderer/maplibre — a bundler concern, not a Node/resolution defect; identical to the already-published map-renderer.)

Types resolve for an external consumer: a `tsc` check (moduleResolution: bundler) importing `createCortexClient` from `@hauska/cortex-client` and a type from `@hauska/cortex-tiles` exits 0.

Reviewer verdict: PASS for all 5. No repair cycles needed.

## PR + merge

PR #224 (base main, head phase2/npm-publish-workflow). Rebased onto latest origin/main first to absorb the sibling map-renderer bump (#223, merged as 6d5fdbe); resolved the one expected cortex-tiles/package.json conflict and regenerated pnpm-lock.yaml. CI green (Typecheck pass 1m49s, Test pass 7m19s). Squash-merged as `21bb7f1`, branch deleted.

```
gh pr merge 224 --squash --delete-branch   -> MERGED
mergeCommit: 21bb7f1d37d7d10912737ac6e7aa6c0146353e9c
main tip: 21bb7f1 build(packages): make 5 @hauska packages publish-ready + npm publish workflow (#224)
```

## Publish proof (verbatim)

First real dispatch (run 28623236175, job 84883792089) — publish step:
```
PUBLISH @hauska/design-tokens@0.1.0
+ @hauska/design-tokens@0.1.0
PUBLISH @hauska/cortex-client@0.1.0
+ @hauska/cortex-client@0.1.0
PUBLISH @hauska/tile-shell@0.1.0
+ @hauska/tile-shell@0.1.0
PUBLISH @hauska/document-viewer@0.1.0
+ @hauska/document-viewer@0.1.0
PUBLISH @hauska/cortex-tiles@0.1.0
+ @hauska/cortex-tiles@0.1.0
```
(The first run's Verify step 404'd because it read the registry ~1s after publish, before read-after-write replication caught up. Not a publish failure — the `+ @hauska/...` lines are npm's accepted-publish output, and the `set -e` publish step would have aborted the job on a real failure.)

Idempotent re-dispatch (run 28623475735) confirms all 5 are live and the guard works:
```
SKIP @hauska/design-tokens@0.1.0 — already on npm
SKIP @hauska/cortex-client@0.1.0 — already on npm
SKIP @hauska/tile-shell@0.1.0 — already on npm
SKIP @hauska/document-viewer@0.1.0 — already on npm
SKIP @hauska/cortex-tiles@0.1.0 — already on npm
--- Verify published versions ---
@hauska/design-tokens: 0.1.0
@hauska/cortex-client: 0.1.0
@hauska/tile-shell: 0.1.0
@hauska/document-viewer: 0.1.0
@hauska/cortex-tiles: 0.1.0
```

## Install lines for an external consumer (Chris)

Peers Chris's app must already provide: react >=18, react-dom >=18 (all React packages); maplibre-gl >=5 (comes in transitively via cortex-tiles' deps + map-renderer, but a consumer using FloatingMap directly should install it too). pdfjs-dist is a normal dep of document-viewer (auto-installed).

```
npm install @hauska/design-tokens
npm install @hauska/cortex-client
npm install @hauska/tile-shell react react-dom
npm install @hauska/document-viewer react react-dom
npm install @hauska/cortex-tiles react react-dom maplibre-gl
```

CSS: import the token theme and the shell css in the consumer's entry:
```
import '@hauska/design-tokens/tokens.css'
import '@hauska/tile-shell/index.css'
import 'maplibre-gl/dist/maplibre-gl.css'   // if using the map
```

The consuming app owns bundling (vite/esbuild/webpack) — the packages ship dist for external resolution and the tile packages carry CSS side-effect imports that the consumer's bundler resolves.

## Notes / non-blockers

- The workflow emits a cosmetic `git exit 128` annotation (pnpm reading git metadata during pack/publish in the detached CI checkout). It does not fail the job.
- Node 20 deprecation warning in CI (actions forced to node 24) — cosmetic, tracked upstream by GitHub.
- The publish-readiness note about the extension consuming these (auth seam C2, engagement+APN precondition C3, React re-platform C1) is NOT part of this track. Publishing was necessary-but-not-sufficient per the C5 review; those integration items remain open for Chris's rebuild. This track closed only the C5 publish gate.
