---
id: dispatches/2026-07-01_legacy-design-tools_cc-agent-C_track-C-tile-migration
title: Track C — migrate tiles and shell into packages
status: active
dispatched: 2026-07-01
agent: cc-agent-C
repo: empressaioemail-tech/legacy-design-tools
track: C
depends_on: Track B close report in _inbox (scaffold must be done)
unblocks: Track E (compose_workspace MCP tool needs stable tile registry)
---

# Track C — tile and shell migration into packages

Move the existing tile components and shell infrastructure out of `artifacts/codex-reviewer-qa/src/` and into the workspace packages set up in Track B. Extract the typed BFF client into `@hauska/cortex-client`. Update the api-server to import response types from the client package. Update `codex-reviewer-qa` to be a thin consumer app.

Read `P:\doc_repo\_architecture_homes\shared_surface_principle.md` and the Track B close report before starting. Do not start until Track B is confirmed done.

## Success definition

`artifacts/codex-reviewer-qa/src/tile-shell/` and `artifacts/codex-reviewer-qa/src/tiles/` are empty (code moved to packages). The app imports from `@hauska/tile-shell` and `@hauska/cortex-tiles`. Every existing tile renders correctly. The api-server imports its BFF response types from `@hauska/cortex-client`. All tiles have the extended `TileDef` capability fields populated.

## Current source locations

```
artifacts/codex-reviewer-qa/src/
  tile-shell/
    CortexShell.tsx
    tiles.tsx                  ← TILE_REGISTRY
    layouts.ts
    components/
      GridCanvas.tsx
      SpaceBar.tsx
      TileWrapper.tsx
  tiles/
    compliance/ComplianceRunTile.tsx
    intake/IntakeTile.tsx
    letter/LetterTile.tsx
    site-analysis/
      TopographyTile.tsx
      DrainageTile.tsx
      HydrologyTile.tsx
    property-intel/
      PropertyBriefTile.tsx
      HazardProfileTile.tsx
      EncumbranceTile.tsx
    design-accelerator/
      SheetExtractionTile.tsx
      ResponseTasksTile.tsx
    map/MapTile.tsx
  lib/
    devSession.ts
    planReviewBff.ts           ← BFF client calls — extract types to cortex-client

artifacts/api-server/src/routes/
  planReviewBff.ts             ← BFF route handlers — import response types from cortex-client
```

## Phase 1 — extract shell into @hauska/tile-shell

Spawn one build sub-agent. One adversarial review sub-agent. No deploy yet.

Move these files into `packages/tile-shell/src/`:
- `CortexShell.tsx` → `packages/tile-shell/src/CortexShell.tsx`
- `layouts.ts` → `packages/tile-shell/src/layouts.ts`
- `components/GridCanvas.tsx` → `packages/tile-shell/src/components/GridCanvas.tsx`
- `components/SpaceBar.tsx` → `packages/tile-shell/src/components/SpaceBar.tsx`
- `components/TileWrapper.tsx` → `packages/tile-shell/src/components/TileWrapper.tsx`
- `providers/` (EngagementProvider, SpatialProvider, CodeProvider) → `packages/tile-shell/src/providers/`

The `tiles.tsx` TILE_REGISTRY stays in `codex-reviewer-qa` for now — it's app-specific. The type definition (`TileDef`) is already in the package from Track B.

Update `packages/tile-shell/src/index.ts` barrel to export everything:
```ts
export { CortexShell } from './CortexShell'
export { GridCanvas } from './components/GridCanvas'
export { SpaceBar } from './components/SpaceBar'
export { TileWrapper } from './components/TileWrapper'
export { EngagementProvider, useEngagement } from './providers/EngagementProvider'
export { SpatialProvider, useSpatial } from './providers/SpatialProvider'
export { CodeProvider, useCode } from './providers/CodeProvider'
export { LAYOUTS } from './layouts'
export type { TileDef, TileCategory, TileStatus, WorkspaceComposition } from './types'
```

Replace all CSS variable references in moved files from hardcoded values to `--h-*` tokens from `@hauska/design-tokens`. Import the tokens CSS at the package level: add `import '@hauska/design-tokens/tokens.css'` to the package entry point.

Update `codex-reviewer-qa` imports from local paths to package:
```ts
// before
import { GridCanvas } from '../tile-shell/components/GridCanvas'
// after
import { GridCanvas } from '@hauska/tile-shell'
```

### Adversarial review — Phase 1

Confirm no files remain in `artifacts/codex-reviewer-qa/src/tile-shell/`. App renders the shell correctly. CSS tokens apply correctly (spot-check `--h-surface-1` is used where `#1a1f2e` was).

---

## Phase 2 — extract typed BFF client into @hauska/cortex-client

Spawn one build sub-agent. One adversarial review sub-agent.

### 2A — define response types

Read `artifacts/api-server/src/routes/planReviewBff.ts` and `artifacts/codex-reviewer-qa/src/lib/planReviewBff.ts`. Extract all response type shapes into `packages/cortex-client/src/types.ts`:

```ts
// packages/cortex-client/src/types.ts

export type QueueRow = {
  id: string
  engagementId: string
  engagementName: string
  status: string
  reportRunState: string | null
  openFindingCount: number
  daysInQueue: number
}

export type Engagement = {
  id: string
  name: string
  jurisdiction: string
  address: string
  apn: string | null
  applicantName: string
  latitude: number | null
  longitude: number | null
  reportResults: Record<string, unknown>
}

export type Finding = {
  findingId: string
  codeSection: string
  description: string
  determination: 'pass' | 'fail' | 'advisory'
  confidence: { value: number; kind: 'calibrated' | 'asserted' | 'deterministic' }
  citationIds: string[]
  status: 'open' | 'accepted' | 'rejected' | 'edited'
}

export type LetterDraft = {
  draft: string | null
  generatedAt: string | null
}

export type ReportResult<T = unknown> = {
  status: 'ok' | 'degraded' | 'error'
  result?: T
  degradedReason?: string
}

// add remaining types for sheets, response-tasks, annotations, hazard, brief, encumbrances
```

### 2B — add typed methods to CortexClient

Extend `packages/cortex-client/src/client.ts` with typed methods:

```ts
// add to CortexClient type and createCortexClient implementation:

getQueue: () => Promise<QueueRow[]>
getEngagement: (id: string) => Promise<Engagement>
runReport: (engagementId: string, type: string) => Promise<void>
getReport: <T>(engagementId: string, type: string) => Promise<ReportResult<T>>
getLetter: (engagementId: string) => Promise<LetterDraft>
generateLetter: (engagementId: string) => Promise<LetterDraft>
patchFinding: (engagementId: string, findingId: string, patch: Partial<Finding>) => Promise<Finding>
getSheets: (engagementId: string) => Promise<{ sheets: Sheet[] }>
getResponseTasks: (engagementId: string) => Promise<{ responseTasks: ResponseTask[] }>
getAnnotations: (engagementId: string) => Promise<{ annotations: Annotation[] }>
createEngagement: (body: { name: string; address: string; jurisdiction: string }) => Promise<{ engagementId: string }>
uploadDocument: (engagementId: string, file: File) => Promise<{ documentId: string }>
```

### 2C — update api-server to import from cortex-client

In `artifacts/api-server/src/routes/planReviewBff.ts`, import response types from the package:

```ts
import type { QueueRow, Engagement, Finding, LetterDraft } from '@hauska/cortex-client'
```

This enforces the contract at the server level. If the BFF response shape changes, TypeScript errors surface immediately.

### Adversarial review — Phase 2

Confirm:
- All BFF response types are in `@hauska/cortex-client/src/types.ts`
- `createCortexClient()` returns all typed methods
- `api-server` imports and uses the types (no `any` on route return shapes)
- `cortex-client` builds with no React dependency

---

## Phase 3 — migrate tile components into @hauska/cortex-tiles

Spawn one build sub-agent. One adversarial review sub-agent.

Move all tile components from `artifacts/codex-reviewer-qa/src/tiles/` into `packages/cortex-tiles/src/`:

```
packages/cortex-tiles/src/
  compliance/
    ComplianceRunTile.tsx
  intake/
    IntakeTile.tsx
  letter/
    LetterTile.tsx
  site-analysis/
    TopographyTile.tsx
    DrainageTile.tsx
    HydrologyTile.tsx
  property-intel/
    PropertyBriefTile.tsx
    HazardProfileTile.tsx
    EncumbranceTile.tsx
  design-accelerator/
    SheetExtractionTile.tsx
    ResponseTasksTile.tsx
  map/
    MapTile.tsx
  index.ts
```

In each tile component:
- Replace direct `fetch` calls with `useCortexClient()` calls
- Replace local type imports with `@hauska/cortex-client` imports
- Add error boundary wrapper (see below)
- Replace hardcoded color values with `--h-*` CSS tokens
- Add `mode` prop: `'full' | 'card' | 'inline' | 'raw'`

**Error boundary pattern** — apply to every tile:
```tsx
// packages/cortex-tiles/src/TileErrorBoundary.tsx
import { Component, type ReactNode } from 'react'
export class TileErrorBoundary extends Component<
  { label: string; children: ReactNode },
  { error: Error | null }
> {
  state = { error: null }
  static getDerivedStateFromError(error: Error) { return { error } }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 'var(--h-space-md)', color: 'var(--h-error)' }}>
          <strong>{this.props.label}</strong>
          <p style={{ color: 'var(--h-text-muted)', fontSize: 'var(--h-text-sm)' }}>
            {this.state.error.message}
          </p>
          <button onClick={() => this.setState({ error: null })}>Retry</button>
        </div>
      )
    }
    return this.props.children
  }
}
```

Wrap every exported tile:
```tsx
// in packages/cortex-tiles/src/compliance/ComplianceRunTile.tsx
export function ComplianceRunTile(props: ...) {
  return (
    <TileErrorBoundary label="Compliance Run">
      <ComplianceRunTileInner {...props} />
    </TileErrorBoundary>
  )
}
```

Update the barrel export `packages/cortex-tiles/src/index.ts`:
```ts
export { ComplianceRunTile } from './compliance/ComplianceRunTile'
export { IntakeTile } from './intake/IntakeTile'
export { LetterTile } from './letter/LetterTile'
export { TopographyTile } from './site-analysis/TopographyTile'
export { DrainageTile } from './site-analysis/DrainageTile'
export { HydrologyTile } from './site-analysis/HydrologyTile'
export { PropertyBriefTile } from './property-intel/PropertyBriefTile'
export { HazardProfileTile } from './property-intel/HazardProfileTile'
export { EncumbranceTile } from './property-intel/EncumbranceTile'
export { SheetExtractionTile } from './design-accelerator/SheetExtractionTile'
export { ResponseTasksTile } from './design-accelerator/ResponseTasksTile'
export { MapTile } from './map/MapTile'
export { CortexProvider, useCortexClient } from './CortexProvider'
```

### Phase 3B — update TILE_REGISTRY with capability advertisement

Update `artifacts/codex-reviewer-qa/src/tiles.tsx` so every TileDef includes the full `requires`, `produces`, `modes`, `mcpTools` fields:

```ts
// example — fill in for every tile
{
  id: 'compliance-run',
  label: 'Compliance Run',
  category: 'Compliance',
  status: 'live',
  requires: { engagementId: true },
  produces: { findings: true, spatialOverlays: true },
  modes: ['full', 'card', 'raw'],
  mcpTools: ['run_compliance_check', 'get_compliance_findings'],
  el: () => <ComplianceRunTile />,
},
{
  id: 'property-brief',
  label: 'Property Brief',
  category: 'Property Intel',
  status: 'live',
  requires: { engagementId: true, apn: true },
  produces: {},
  modes: ['full', 'card', 'inline', 'raw'],
  mcpTools: ['get_property_brief'],
  el: () => <PropertyBriefTile />,
},
// ... all tiles
```

### Phase 3C — thin consumer app

Update `artifacts/codex-reviewer-qa/src/tiles.tsx` to import tiles from the package:
```ts
import {
  ComplianceRunTile, IntakeTile, LetterTile,
  TopographyTile, DrainageTile, HydrologyTile,
  PropertyBriefTile, HazardProfileTile, EncumbranceTile,
  SheetExtractionTile, ResponseTasksTile, MapTile,
} from '@hauska/cortex-tiles'
```

Update `artifacts/codex-reviewer-qa/src/App.tsx` or root to wrap with CortexProvider:
```tsx
import { CortexProvider } from '@hauska/cortex-tiles'
import { createCortexClient } from '@hauska/cortex-client'
const client = createCortexClient({ baseUrl: '/api', getToken: getDevSession })
<CortexProvider client={client}><CortexShell /></CortexProvider>
```

Verify `artifacts/codex-reviewer-qa/src/tiles/` is now empty or removed.

### Adversarial review — Phase 3

Confirm:
- No tile files remain in `artifacts/codex-reviewer-qa/src/tiles/`
- Every tile has an error boundary
- Every tile uses `useCortexClient()` instead of raw fetch
- Every TileDef has `requires`, `produces`, `modes`, `mcpTools` populated
- The app builds and renders all four presets correctly
- No regressions on the compliance run, letter, intake, or property intel tiles

---

## Deploy

After all three phases are merged:
```powershell
gh workflow run "Cloud Run Deploy (cortex-api)" --repo empressaioemail-tech/legacy-design-tools -f action=deploy-canary
gh workflow run "Cloud Run Deploy (cortex-api)" --repo empressaioemail-tech/legacy-design-tools -f action=run-migrations
# smoke: curl.exe -s https://cortex-api-tds7av26va-uc.a.run.app/api/healthz
gh workflow run "Cloud Run Deploy (cortex-api)" --repo empressaioemail-tech/legacy-design-tools -f action=shift-traffic
```

---

## Close report

File at `P:\doc_repo\_inbox\2026-07-01_legacy-design-tools_cc-agent-C_track-C-close.md`:

```markdown
---
title: Track C close — tile and shell migration
date: 2026-07-01
agent: cc-agent-C
track: C
---

## Deployed revision
<revision name>

## What moved
<list of files moved to packages>

## Tile registry — capability fields complete?
<yes / list of tiles missing fields>

## Error boundaries
<all tiles wrapped: yes/no>

## CortexClient typed methods
<list methods implemented>

## api-server imports from cortex-client?
<yes/no>

## codex-reviewer-qa tiles dir empty?
<yes/no>

## Unblocks
Track E (compose_workspace) can begin — tile registry is stable

## Rollback
<prior revision>
```
