---
id: dispatches/2026-07-01_legacy-design-tools_cc-agent-C_track-B-package-scaffold
title: Track B — pnpm workspace scaffold in legacy-design-tools
status: active
dispatched: 2026-07-01
agent: cc-agent-C
repo: empressaioemail-tech/legacy-design-tools
track: B
depends_on: nothing — runs immediately in parallel with Track A
unblocks: Track C (tile migration), Track D (document viewer)
---

# Track B — package workspace scaffold

Set up the pnpm workspace and package scaffolds in legacy-design-tools. No tile code moves in this track — only infrastructure. Track C (tile migration) and Track D (document viewer) both depend on this scaffold being in place.

Read `P:\doc_repo\_architecture_homes\shared_surface_principle.md` before starting.

## Success definition

`pnpm install` at the repo root resolves all workspace packages. Each package builds cleanly with `pnpm --filter <name> build`. The `codex-reviewer-qa` artifact references the workspace packages in its `package.json` (but still imports from its local paths — Track C handles the migration). No existing functionality is broken.

## What gets created

```
legacy-design-tools/
  pnpm-workspace.yaml              ← new
  packages/
    design-tokens/                 ← new, @hauska/design-tokens
      tokens.css
      package.json
    tile-shell/                    ← new scaffold, @hauska/tile-shell
      src/index.ts                 (barrel, no implementation yet)
      package.json
      tsconfig.json
      tsup.config.ts
    cortex-client/                 ← new scaffold, @hauska/cortex-client
      src/index.ts
      package.json
      tsconfig.json
      tsup.config.ts
    cortex-tiles/                  ← new scaffold, @hauska/cortex-tiles
      src/index.ts
      package.json
      tsconfig.json
      tsup.config.ts
    document-viewer/               ← new scaffold, @hauska/document-viewer
      src/index.ts
      package.json
      tsconfig.json
      tsup.config.ts
  artifacts/
    codex-reviewer-qa/
      package.json                 ← updated to reference workspace packages
```

## Phase 1 — workspace root

One build sub-agent. One adversarial review sub-agent. No deploy needed.

### 1A — pnpm workspace

Check if `pnpm-workspace.yaml` exists at the repo root. If not, create it:

```yaml
packages:
  - 'packages/*'
  - 'apps/*'
  - 'artifacts/*'
```

Add to root `package.json` if not present:
```json
{
  "private": true,
  "engines": { "node": ">=18", "pnpm": ">=8" }
}
```

### 1B — design-tokens package

```
packages/design-tokens/
  tokens.css
  package.json
```

```json
// package.json
{
  "name": "@hauska/design-tokens",
  "version": "0.1.0",
  "main": "./tokens.css",
  "exports": { ".": "./tokens.css", "./tokens.css": "./tokens.css" }
}
```

```css
/* tokens.css — exact content from shared_surface_principle.md */
:root {
  --h-surface-0: #111318;
  --h-surface-1: #1a1f2e;
  --h-surface-2: #242938;
  --h-surface-3: #2e3447;
  --h-text-primary: #e8eaf0;
  --h-text-muted: #7c849a;
  --h-text-link: #4f8ef7;
  --h-border-subtle: rgba(255,255,255,0.08);
  --h-border-strong: rgba(255,255,255,0.18);
  --h-accent: #4f8ef7;
  --h-accent-hover: #6ba3fa;
  --h-success: #3ecf8e;
  --h-warning: #f5a623;
  --h-error: #e5534b;
  --h-degraded: #7c849a;
  --h-confidence-calibrated: #3ecf8e;
  --h-confidence-asserted: #f5a623;
  --h-confidence-deterministic: #4f8ef7;
  --h-space-xs: 4px;  --h-space-sm: 8px;
  --h-space-md: 16px; --h-space-lg: 24px;  --h-space-xl: 40px;
  --h-radius-sm: 4px; --h-radius-md: 8px;  --h-radius-lg: 12px;
  --h-font-sans: 'Inter', system-ui, sans-serif;
  --h-font-mono: 'JetBrains Mono', monospace;
  --h-text-sm: 12px;  --h-text-md: 14px;  --h-text-lg: 16px;
}
```

### 1C — tile-shell scaffold

```json
// packages/tile-shell/package.json
{
  "name": "@hauska/tile-shell",
  "version": "0.1.0",
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": { ".": { "import": "./dist/index.mjs", "require": "./dist/index.js", "types": "./dist/index.d.ts" } },
  "peerDependencies": { "react": ">=18", "react-dom": ">=18" },
  "devDependencies": { "tsup": "*", "typescript": "*" },
  "scripts": { "build": "tsup", "dev": "tsup --watch" }
}
```

```ts
// packages/tile-shell/tsup.config.ts
import { defineConfig } from 'tsup'
export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  external: ['react', 'react-dom'],
})
```

```ts
// packages/tile-shell/src/index.ts
// Barrel — implementation moves here in Track C
export type { TileDef, TileCategory, TileStatus, WorkspaceComposition, LayoutSpec } from './types'
```

```ts
// packages/tile-shell/src/types.ts
export type TileStatus = 'live' | 'degraded' | 'partial' | 'planned'
export type TileCategory = 'Compliance' | 'Site Analysis' | 'Property Intel' | 'Design Accelerator' | 'Deliverable' | 'Market'

export type TileDef = {
  id: string
  label: string
  category: TileCategory
  status: TileStatus
  degradedReason?: string
  requires: {
    engagementId?: boolean
    apn?: boolean
    jurisdiction?: boolean
    uploadedDocuments?: boolean
    completedFindings?: boolean
  }
  produces: {
    spatialOverlays?: boolean
    findings?: boolean
    annotations?: boolean
    letter?: boolean
  }
  modes: Array<'full' | 'card' | 'inline' | 'raw'>
  minWidth?: number
  mcpTools?: string[]
  el: () => React.ReactElement
}

export type WorkspaceComposition = {
  engagementId?: string
  tiles: string[]
  layoutId: string
  why: string
}

export type LayoutSpec = {
  id: string
  template: string
}
```

### 1D — cortex-client scaffold

```json
// packages/cortex-client/package.json
{
  "name": "@hauska/cortex-client",
  "version": "0.1.0",
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": { ".": { "import": "./dist/index.mjs", "require": "./dist/index.js", "types": "./dist/index.d.ts" } },
  "dependencies": {},
  "scripts": { "build": "tsup", "dev": "tsup --watch" }
}
```

Note: no React peer dep — this is a plain TypeScript client.

```ts
// packages/cortex-client/src/index.ts
export { createCortexClient } from './client'
export type { CortexClient, CortexClientConfig } from './client'
// Response types — populated in Track C
export type * from './types'
```

```ts
// packages/cortex-client/src/client.ts
export type CortexClientConfig = {
  baseUrl: string
  getToken: () => string | Promise<string>
}

export type CortexClient = {
  config: CortexClientConfig
  fetch: <T>(path: string, init?: RequestInit) => Promise<T>
}

export function createCortexClient(config: CortexClientConfig): CortexClient {
  return {
    config,
    async fetch<T>(path: string, init?: RequestInit): Promise<T> {
      const token = await config.getToken()
      const res = await fetch(`${config.baseUrl}${path}`, {
        ...init,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          ...(init?.headers ?? {}),
        },
      })
      if (!res.ok) throw new CortexApiError(res.status, await res.text())
      return res.json()
    },
  }
}

export class CortexApiError extends Error {
  constructor(public status: number, message: string) {
    super(`CortexAPI ${status}: ${message}`)
  }
}
```

### 1E — cortex-tiles scaffold

```json
// packages/cortex-tiles/package.json
{
  "name": "@hauska/cortex-tiles",
  "version": "0.1.0",
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": { ".": { "import": "./dist/index.mjs", "require": "./dist/index.js", "types": "./dist/index.d.ts" } },
  "peerDependencies": { "react": ">=18", "react-dom": ">=18" },
  "dependencies": {
    "@hauska/cortex-client": "workspace:*",
    "@hauska/tile-shell": "workspace:*",
    "@hauska/design-tokens": "workspace:*"
  },
  "scripts": { "build": "tsup", "dev": "tsup --watch" }
}
```

```ts
// packages/cortex-tiles/src/index.ts
// Barrel — tile components move here in Track C
export { CortexProvider, useCortexClient } from './CortexProvider'
```

```tsx
// packages/cortex-tiles/src/CortexProvider.tsx
import { createContext, useContext } from 'react'
import type { CortexClient } from '@hauska/cortex-client'

const CortexContext = createContext<CortexClient | null>(null)

export function CortexProvider({ client, children }: { client: CortexClient; children: React.ReactNode }) {
  return <CortexContext.Provider value={client}>{children}</CortexContext.Provider>
}

export function useCortexClient(): CortexClient {
  const client = useContext(CortexContext)
  if (!client) throw new Error('useCortexClient must be used inside CortexProvider')
  return client
}
```

### 1F — document-viewer scaffold

```json
// packages/document-viewer/package.json
{
  "name": "@hauska/document-viewer",
  "version": "0.1.0",
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": { ".": { "import": "./dist/index.mjs", "require": "./dist/index.js", "types": "./dist/index.d.ts" } },
  "peerDependencies": { "react": ">=18", "react-dom": ">=18" },
  "dependencies": { "pdfjs-dist": "*" },
  "scripts": { "build": "tsup", "dev": "tsup --watch" }
}
```

```ts
// packages/document-viewer/src/index.ts
// Scaffold — implementation in Track D
export type { Annotation, AnnotationKind } from './types'
```

```ts
// packages/document-viewer/src/types.ts
export type AnnotationKind = 'finding' | 'redline' | 'shape' | 'text' | 'stamp' | 'dimension'

export type Annotation = {
  id: string
  engagementId: string
  author: 'ai' | string
  kind: AnnotationKind
  findingId?: string
  confidence?: { value: number; kind: 'calibrated' | 'asserted' | 'deterministic' }
  createdAt: string
  location2d?: {
    submissionId: string
    page: number
    bbox: [number, number, number, number]
    label: string
  }
  location3d?: {
    globalId: string
    elementId: string
    face?: number
    label: string
  }
}
```

### 1G — update codex-reviewer-qa package.json

Add workspace references so the app is ready to import from packages after Track C:

```json
// artifacts/codex-reviewer-qa/package.json — add to dependencies:
{
  "@hauska/design-tokens": "workspace:*",
  "@hauska/tile-shell": "workspace:*",
  "@hauska/cortex-client": "workspace:*",
  "@hauska/cortex-tiles": "workspace:*",
  "@hauska/document-viewer": "workspace:*"
}
```

Also add to `vite.config.ts` if needed — some Vite setups require explicit workspace package resolution.

### Adversarial review — Phase 1

Confirm:
- `pnpm install` at repo root completes with no errors
- All five packages build: `pnpm -r build` (recursive build)
- `@hauska/cortex-tiles` imports from `@hauska/cortex-client` and `@hauska/tile-shell` via workspace links
- No circular dependencies
- `codex-reviewer-qa` installs the workspace packages without error
- Existing `artifacts/api-server` and `artifacts/codex-reviewer-qa` apps still start (no regressions)
- `TileDef` type in `@hauska/tile-shell` includes all `requires`, `produces`, `modes`, `mcpTools` fields
- `CortexProvider` + `useCortexClient` are exported from `@hauska/cortex-tiles`

PR, merge, verify CI green.

---

## Close report

File at `P:\doc_repo\_inbox\2026-07-01_legacy-design-tools_cc-agent-C_track-B-close.md`:

```markdown
---
title: Track B close — package workspace scaffold
date: 2026-07-01
agent: cc-agent-C
track: B
---

## What shipped
<package list with versions>

## pnpm install result
<paste output>

## Build verification
<pnpm -r build output>

## Packages ready for
Track C: tile migration can begin
Track D: document-viewer implementation can begin

## Unblocks
Track C, Track D — both can start immediately

## Rollback
<prior commit SHA>
```
