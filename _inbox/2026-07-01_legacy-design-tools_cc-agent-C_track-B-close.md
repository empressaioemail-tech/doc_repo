---
title: Track B close — package workspace scaffold
date: 2026-07-01
agent: cc-agent-C
track: B
repo: empressaioemail-tech/legacy-design-tools
status: COMPLETE
pr: 210
merge_commit: 5617b149dfff2a1ffbbb9d454e7099e950ba34b8
---

# Track B close — package workspace scaffold

Infrastructure only. No tile code moved (Track C migrates tiles, Track D implements document-viewer). The pnpm workspace now carries a `packages/` glob and five scaffolded packages. PR #210 squash-merged to `main`, both CI checks green, adversarial reviewer PASS on all six criteria.

## What shipped

Five packages under `legacy-design-tools/packages/`:

- `@hauska/design-tokens` 0.1.0 — CSS custom properties (`tokens.css`), no build (CSS-only leaf)
- `@hauska/tile-shell` 0.1.0 — TileDef / TileCategory / TileStatus / WorkspaceComposition / LayoutSpec types (scaffold, tsup-built)
- `@hauska/cortex-client` 0.1.0 — `createCortexClient` factory + `CortexApiError` (implemented, plain TS, no React, tsup-built)
- `@hauska/cortex-tiles` 0.1.0 — `CortexProvider` + `useCortexClient` (implemented; tile components deferred to Track C; tsup-built)
- `@hauska/document-viewer` 0.1.0 — `Annotation` / `AnnotationKind` types (scaffold, tsup-built)

Wiring changes (all surgical, existing content preserved):

- `pnpm-workspace.yaml` — added `- packages/*` as the first `packages:` entry. Existing catalog, overrides, minimumReleaseAge, onlyBuiltDependencies untouched.
- root `package.json` — added `"engines": { "node": ">=18", "pnpm": ">=8" }`. Existing scripts, preinstall pnpm guard, devDeps preserved.
- `artifacts/codex-reviewer-qa/package.json` — added the five `@hauska/*: workspace:*` devDependencies. The app still imports from local paths (Track C migrates).
- `pnpm-lock.yaml` — regenerated so CI's `pnpm install --frozen-lockfile` is satisfied.

Commit surface: 27 files (23 new source files + 4 modified config files). `dist/` is gitignored, so no build artifacts were committed. Staged explicit paths only (avoided `git add -A`) so an unrelated mockup-sandbox codegen reorder produced by the whole-workspace build did not ride along.

## Dependency graph (acyclic — verified, no cycles)

Leaves: `design-tokens`, `tile-shell`, `cortex-client` (no React, no @hauska deps — plain-TS leaf), `document-viewer`.
`cortex-tiles` -> { `cortex-client`, `tile-shell`, `design-tokens` } via `workspace:*`.
Only `@workspace/codex-reviewer-qa` consumes `cortex-tiles`. No package depends back up the chain. Matches the arch doc graph (atom-contract -> cortex-client + design-tokens -> tile-shell/map-renderer/document-viewer -> cortex-tiles).

`pnpm why -r @hauska/cortex-tiles` confirms codex-reviewer-qa is the sole consumer.

## pnpm install result

```
Scope: all 43 workspace projects
Lockfile is up to date, resolution step is skipped
Already up to date
Done in 1.2s using pnpm v10.27.0
```
`pnpm install --frozen-lockfile` (the exact CI command) resolves with the committed lockfile.

## Build verification

`pnpm -r build` — all four buildable packages succeed (design-tokens correctly skipped, no build script). Each of tile-shell / cortex-client / cortex-tiles / document-viewer emits `index.js`, `index.mjs`, `index.d.ts`. Note: tile-shell and document-viewer emit 0-byte `.mjs` runtime output because they export only TypeScript types (correct — the type surface is in `.d.ts`); cortex-client and cortex-tiles have real runtime code in both formats.

Type-surface confirmed from emitted `.d.ts`:
- `TileDef` includes `requires` (engagementId/apn/jurisdiction/uploadedDocuments/completedFindings), `produces` (spatialOverlays/findings/annotations/letter), `modes`, `minWidth`, `mcpTools`, `el`.
- `CortexProvider` + `useCortexClient` exported from `@hauska/cortex-tiles`.
- `createCortexClient` + `CortexApiError` exported from `@hauska/cortex-client`.
- `Annotation` + `AnnotationKind` exported from `@hauska/document-viewer`.
- A throwaway consumer importing the built `.d.ts` compiled clean; a negative test (bad `category`) was correctly rejected (TS2322), proving the types are enforced, not `any`.

## Circular-dep check

No circular dependencies. Edge map verified directly from each package.json (see graph above). `pnpm ls -r` and `pnpm why -r @hauska/cortex-tiles` corroborate.

## codex-reviewer-qa still starts: yes

- BUILD: `BASE_PATH=/codex-reviewer-qa/ pnpm --filter @workspace/codex-reviewer-qa build` -> `✓ built` (133 modules).
- DEV BOOT: `VITE v7.3.2 ready in 387 ms`; curl of the served base path returned HTTP 200 with real HTML (`<!DOCTYPE html>`, `<title>Codex Reviewer QA</title>`, `#root`).
- TYPECHECK: passes as part of the full root `pnpm run typecheck` (which builds lib project-reference d.ts first, then typechecks apps — `artifacts/codex-reviewer-qa typecheck: Done`).

Full-repo `pnpm run typecheck` (the CI command) is unaffected by Track B — no error references any `@hauska/*` path.

## CI result

PR #210 checks: Typecheck PASS (1m56s), Test PASS (7m7s). Both green before merge.

## PR + merge status

- PR: https://github.com/empressaioemail-tech/legacy-design-tools/pull/210
- Merge: squash-merged to `main`, merge commit `5617b149dfff2a1ffbbb9d454e7099e950ba34b8`, branch `track-b/package-scaffold` deleted. Branch protection did not block; no `--admin` needed.
- `main` verified to contain `packages/{cortex-client,cortex-tiles,design-tokens,document-viewer,tile-shell}`.

## Deviations from the verbatim dispatch

All are faithful, minimal adaptations forced by the repo's real TS config (`isolatedModules`, strict, `customConditions: ["workspace"]`) and by `minimumReleaseAge: 1440` / `autoInstallPeers: false`. None change the specified type shapes or public API.

- `tile-shell/src/types.ts`: `el: () => React.ReactElement` -> `import type { ReactElement } from 'react'` (React global namespace unavailable under isolatedModules). Identical shape.
- `cortex-tiles/src/CortexProvider.tsx`: `React.ReactNode` -> `import type { ReactNode }` (same reason).
- `cortex-client/src/index.ts`: added `CortexApiError` to the public export (client.ts throws it; the task named it a public export). Barrel now `export { createCortexClient, CortexApiError }`.
- `cortex-client/src/types.ts`: created with a placeholder `export type CortexClientPlaceholder = never` so `export type * from './types'` resolves to a valid module under isolatedModules (dispatch referenced the file but did not provide it).
- `cortex-client/src/client.ts`: added a harmless `res.json() as Promise<T>` cast for strict return typing.
- devDependencies: each tsup-built package pins `"tsup": "^8"` and `"typescript": "~5.9.2"` (root pins `~5.9.2`) instead of bare `"*"` (dispatch omitted devDeps on cortex-client/document-viewer, and bare `*` risks minimumReleaseAge/registry issues). tile-shell / cortex-tiles / document-viewer also add `@types/react ^19` + `@types/react-dom ^19` where dts generation needs React types.
- `document-viewer/package.json`: `"pdfjs-dist": "*"` -> `"^4"` (resolvable, minimumReleaseAge-clean).
- `cortex-tiles/tsup.config.ts`: added the three `@hauska/*` workspace deps to `external` so tsup does not bundle sibling packages.
- New package tsconfigs are self-contained (do NOT extend `tsconfig.base.json`) to avoid the repo's composite / `customConditions` entanglement.
- 1A workspace glob: `pnpm-workspace.yaml` already existed with critical config, so `packages/*` was ADDED (not the file overwritten as the "create if absent" branch implied).
- vite.config.ts of codex-reviewer-qa was NOT modified — the app does not import `@hauska/*` yet (Track C), so no alias is needed and adding one would be risk with no benefit.

Non-blocking observation (not changed, left for Track C): all four buildable packages' `exports` maps order `"types"` last, which triggers an esbuild "condition types will never be used" warning. Builds succeed and `.d.ts` resolves via the top-level `types` field; cheap hardening later is to move `types` first in each `exports["."]`.

## Packages ready for

Track C: tile migration can begin (tile-shell barrel, cortex-tiles provider, cortex-client factory all in place).
Track D: document-viewer implementation can begin (Annotation model scaffolded).

## Unblocks

Track C, Track D — both can start immediately.

## Rollback

Revert merge commit `5617b149dfff2a1ffbbb9d454e7099e950ba34b8` on `main`. Prior tip was `d22aa88209d9f6f87f5315e70e6cc27e50c74d92`.
