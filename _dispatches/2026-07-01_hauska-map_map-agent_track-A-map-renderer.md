---
id: dispatches/2026-07-01_hauska-map_map-agent_track-A-map-renderer
title: Track A — extract @hauska/map-renderer from hauska-map
status: active
dispatched: 2026-07-01
agent: map-agent
repo: empressaioemail-tech/hauska-map
track: A
depends_on: nothing — runs immediately in parallel with Track B
unblocks: Track C (cortex-tiles imports map-renderer), extension rebuild
---

# Track A — @hauska/map-renderer extraction

Extract the E6 floating map component from the hauska-map Vite app into a publishable npm package. The command-center app becomes the first consumer of its own package. Every future surface (cortex workspace, extension, Mox demo, SmartCity) imports the package directly — no iframe, no DNS dependency, no running server required.

Read `P:\doc_repo\_architecture_homes\shared_surface_principle.md` before starting. That doc is the architectural authority.

## Success definition

`import { FloatingMap } from '@hauska/map-renderer'` works in any React app. The hauska-map command center imports its own component from the package. The FloatingMap renders MapLibre tiles, the layer registry, the floating window FSM, and parcel drill-through without any WebGL CSP exceptions required in the consuming app. Branch pushed and package published (or workspace-linked for local dev).

## Current state

- Dev server runs at `localhost:5174`
- E6 floating map FSM is built and working (commit `9552799`, 1 commit ahead of origin/main)
- The component lives inside the Vite app — not yet extracted
- Push to origin/main is owed from the E1-E7 sprint

## Repo layout after extraction

```
hauska-map/
  packages/
    map-renderer/              ← new
      src/
        FloatingMap.tsx        ← the E6 component
        FloatingWindowFSM.ts   ← window state machine
        LayerRegistry.ts       ← dynamic layer registry
        LayerAllocation.ts     ← per-app allocation config
        postMessage.ts         ← ADD_OVERLAY / SET_PARCEL / SET_VIEWPORT contracts
        worker/
          map.worker.ts        ← OffscreenCanvas WebGL worker (see Phase 2)
      package.json
      tsconfig.json
      tsup.config.ts
  apps/
    command-center/            ← converted to import from packages/map-renderer
      src/                     ← thin app: import { FloatingMap } from '@hauska/map-renderer'
```

## Phase 1 — scaffold and extract

Spawn one build sub-agent. One adversarial review sub-agent. Merge on green.

### 1A — push the pending commit

The branch is 1 commit ahead of origin/main. Push it first:
```bash
git push origin main
```

### 1B — set up pnpm workspace

Check if the repo already has a `pnpm-workspace.yaml`. If not, create it:
```yaml
# pnpm-workspace.yaml
packages:
  - 'packages/*'
  - 'apps/*'
```

Update the root `package.json` to mark it as a workspace root (add `"private": true` if not present).

### 1C — scaffold the package

Create `packages/map-renderer/` with:

```json
// packages/map-renderer/package.json
{
  "name": "@hauska/map-renderer",
  "version": "0.1.0",
  "private": false,
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  },
  "peerDependencies": {
    "react": ">=18",
    "react-dom": ">=18"
  },
  "dependencies": {
    "maplibre-gl": "*"
  },
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch"
  }
}
```

```ts
// packages/map-renderer/tsup.config.ts
import { defineConfig } from 'tsup'
export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  external: ['react', 'react-dom'],
  sourcemap: true,
})
```

### 1D — move source files

Identify the E6 component files in the existing app. Move (not copy) them into `packages/map-renderer/src/`. Create a barrel export at `packages/map-renderer/src/index.ts`:

```ts
export { FloatingMap } from './FloatingMap'
export { LayerRegistry } from './LayerRegistry'
export type { LayerDef, OverlaySpec, PostMessageContract } from './postMessage'
```

### 1E — convert command-center to import from package

Update `apps/command-center/package.json` to add the workspace dependency:
```json
"dependencies": {
  "@hauska/map-renderer": "workspace:*"
}
```

Update the import in the command-center app from the local relative path to the package:
```ts
// before
import { FloatingMap } from '../../src/renderer/map-renderer'
// after
import { FloatingMap } from '@hauska/map-renderer'
```

Run `pnpm install` to wire the workspace links. Verify the command-center dev server still starts.

### Adversarial review — Phase 1

Confirm:
- The package builds without error (`pnpm --filter @hauska/map-renderer build`)
- The command-center imports from the package and renders the map
- No source files remain in the old location (no dual copies)
- Barrel export covers everything a consumer needs
- Peer dependencies are correct (react/react-dom as peers, not deps)

---

## Phase 2 — OffscreenCanvas WebGL worker

This is the fundamental CSP fix. MapLibre renders WebGL in a Web Worker via OffscreenCanvas, bypassing the consuming app's page CSP entirely.

Spawn one build sub-agent, one adversarial review sub-agent.

### 2A — worker implementation

```ts
// packages/map-renderer/src/worker/map.worker.ts
// Runs in a Worker context — separate CSP, can use WebGL freely

import maplibregl from 'maplibre-gl'

let map: maplibregl.Map | null = null

self.onmessage = (e: MessageEvent) => {
  const { type, payload } = e.data

  if (type === 'INIT') {
    const { canvas, style, center, zoom } = payload
    // MapLibre supports OffscreenCanvas as the canvas parameter
    map = new maplibregl.Map({
      canvas,           // OffscreenCanvas transferred from main thread
      style,
      center,
      zoom,
    })
    map.on('load', () => self.postMessage({ type: 'READY' }))
  }

  if (type === 'ADD_OVERLAY' && map) {
    const { overlay } = payload
    // apply overlay to map (add source + layer)
  }

  if (type === 'SET_PARCEL' && map) {
    const { apn, lng, lat } = payload
    map.flyTo({ center: [lng, lat], zoom: 16 })
  }
}
```

```tsx
// packages/map-renderer/src/FloatingMap.tsx
import { useEffect, useRef } from 'react'

export function FloatingMap({ style, center, zoom, overlays, parcel }: FloatingMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const workerRef = useRef<Worker | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const offscreen = canvas.transferControlToOffscreen()
    const worker = new Worker(new URL('./worker/map.worker.ts', import.meta.url), {
      type: 'module',
    })

    worker.postMessage({ type: 'INIT', payload: { canvas: offscreen, style, center, zoom } }, [offscreen])
    workerRef.current = worker

    return () => worker.terminate()
  }, [])

  // forward overlay and parcel changes to worker
  useEffect(() => {
    overlays?.forEach(overlay => {
      workerRef.current?.postMessage({ type: 'ADD_OVERLAY', payload: { overlay } })
    })
  }, [overlays])

  useEffect(() => {
    if (parcel) {
      workerRef.current?.postMessage({ type: 'SET_PARCEL', payload: parcel })
    }
  }, [parcel])

  return <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
}
```

### 2B — floating window FSM integration

The E6 floating window FSM (move/resize/minimize/maximize/close state machine) wraps the FloatingMap component. Verify it still works after the OffscreenCanvas change — the canvas is inside the window, and the window moves/resizes via CSS transforms on the container div, not the canvas. The OffscreenCanvas should be unaffected by CSS transforms on the parent.

### Adversarial review — Phase 2

Confirm:
- `new Worker(...)` does not trigger any CSP violation in a strict MV3 extension context (check Chrome extension CSP docs — module workers are allowed in MV3)
- `transferControlToOffscreen()` is called exactly once (calling it twice throws)
- The map renders after worker sends `READY`
- Overlay additions and parcel fly-to work through postMessage
- FloatingWindowFSM wraps the component correctly and window drag/resize still works
- The worker is terminated on component unmount (no memory leak)

---

## Phase 3 — publish and verify

```bash
# build the package
pnpm --filter @hauska/map-renderer build

# verify types generated
ls packages/map-renderer/dist/
# should contain: index.js, index.mjs, index.d.ts

# if publishing to npm:
cd packages/map-renderer && npm publish --access public
# or: link locally for workspace consumption
```

For now, workspace-link is sufficient. Track C (cortex-tiles) will consume it via `"@hauska/map-renderer": "workspace:*"` or via npm once published.

---

## Final verification

```bash
# command-center dev server starts
pnpm --filter command-center dev
# → opens localhost:5174, map renders

# package builds cleanly
pnpm --filter @hauska/map-renderer build
# → no errors, dist/ populated
```

---

## Close report

File at `P:\doc_repo\_inbox\2026-07-01_hauska-map_map-agent_track-A-close.md`:

```markdown
---
title: Track A close — @hauska/map-renderer extraction
date: 2026-07-01
agent: map-agent
track: A
---

## Package version
<version>

## npm status
<published / workspace-linked>

## What shipped
<phase by phase>

## OffscreenCanvas worker
<working / fallback used — reason>

## Verification
<command-center renders map: yes/no>
<package build: pass/fail>

## Unblocks
Track C (cortex-tiles) can now import @hauska/map-renderer

## Rollback
<prior command-center commit if needed>
```
