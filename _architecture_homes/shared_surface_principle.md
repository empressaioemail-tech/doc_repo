---
id: shared_surface_principle
title: Shared surface principle — UI component and package architecture
status: active
last_updated: 2026-07-01
applies_to: portfolio
related: [adr_008_engine_factor_out, 28_mcp_first_product_design, 51_substrate_v1_sprint, 48_cortex_reporting_function_dashboard_spec]
---

# Shared surface principle

The UI companion to the MCP-first product design rule. Any UI component that appears in more than one product surface ships as a versioned npm package. The unit of sharing is the package — not copy-paste, not iframe, not a running URL. Auth is injected, never assumed. Packages define their boundary in TypeScript. Consumers own bundling.

This is the UI expression of the same principle that governs the substrate: `@hauska/atom-contract` is a package, the SDK is packages, and now shared UI is too.

---

## On the namespace

The `@hauska` scope appears only in `package.json` name fields and import statements. If the brand name changes, a global find-and-replace across all repos plus a re-publish under the new scope handles it completely. No business logic references the name. This is the correct isolation.

To rename:
1. Decide the new scope (e.g. `@newname`)
2. Global replace `@hauska/` → `@newname/` across all repos (one agent, one PR per repo)
3. Re-publish all packages under the new npm scope
4. Update `package.json` dependencies in all consumers

---

## On one master MCP

Everything lives in the one Hauska MCP server. This was committed in `51_substrate_v1_sprint.md` and stands. The server is product-key gated (public / codex / reporting / map — expandable). New capability areas (compose_workspace, annotation, document retrieval) add tools to the existing server under an appropriate product gate. No new MCP servers.

The relationship between packages and the MCP server:

```
MCP server — the data and reasoning protocol layer
  get_property_brief(address) → structured atom data
  get_hazard_profile(address) → structured atom data
  compose_workspace(intent) → WorkspaceComposition
  ...62 tools and growing...

Packages — the rendering layer
  @hauska/cortex-tiles <PropertyBriefTile /> → renders the data
  @hauska/map-renderer <FloatingMap />       → renders the spatial surface
  @hauska/document-viewer <PDFViewer />      → renders documents + annotations
```

They are separate planes. MCP tools provide data. Packages provide rendering. The `mcpTools[]` field on each TileDef names which MCP tools back that tile, making the connection explicit and machine-readable.

---

## Package families

Six packages. Each has a clear, single job.

```
@hauska/design-tokens         ~2KB, CSS custom properties, no JS
@hauska/tile-shell            shell infrastructure
@hauska/map-renderer          spatial surface
@hauska/document-viewer       document surface (PDF + DWG/IFC + annotation)
@hauska/cortex-client         typed BFF client, no React
@hauska/cortex-tiles          tile components — consumes all above
```

### Dependency graph (no cycles)

```
@hauska/atom-contract (v1.5.0, already published)
        │
        ├─────────────────────────────────────────┐
        ▼                                         ▼
@hauska/cortex-client              @hauska/design-tokens
        │                                         │
        ├─────────────────────────────────────────┤
        │                                         │
        ▼                                         ▼
@hauska/tile-shell      @hauska/map-renderer      @hauska/document-viewer
        │                       │                         │
        └───────────────────────┴─────────────────────────┘
                                │
                                ▼
                      @hauska/cortex-tiles
                                │
              ┌─────────────────┼─────────────────┐
              ▼                 ▼                  ▼
       cortex workspace      extension          Mox demo
       (codex-reviewer-qa)   (rebuild)          (adaptive UI)
```

---

## Auth injection — client factory pattern

Auth lives in the consuming app, never in a tile. Every surface constructs one client with its auth strategy and provides it via context. Tiles call `useCortexClient()` — they never handle tokens.

```typescript
// cortex workspace
const client = createCortexClient({
  baseUrl: process.env.VITE_CORTEX_API_URL,
  getToken: () => getDevSessionCookie()
})

// extension
const client = createCortexClient({
  baseUrl: CORTEX_API_URL,
  getToken: () => brokerageKey
})

// SmartCity (future)
const client = createCortexClient({
  baseUrl: CORTEX_API_URL,
  getToken: () => cityUserToken
})

// All three use identical tile components:
<CortexProvider client={client}>
  <ComplianceRunTile />
  <PropertyBriefTile />
</CortexProvider>
```

---

## Render modes

Every tile supports multiple render modes. The default is `full`. Consuming apps drop to `card`, `inline`, or `raw` when they need a non-standard layout.

```
mode="full"                   mode="card"              mode="raw"
┌─────────────────┐           ┌───────────┐            No render.
│ Property Brief  │           │ Brief     │            Children fn receives data:
│ 146 S Frbg      │           │ $485k AVM │
│─────────────────│           │ Zone MF-3 │            <PropertyBriefTile mode="raw">
│ AVM: $485k      │           │ Flood: X  │              {(data) => <CustomUI />}
│ Zone: MF-3      │           │ 0.35 ◐    │            </PropertyBriefTile>
│ Flood: Zone X   │           └───────────┘
│ [cited] [cited] │
│ 0.35 ◐ asserted │           Consuming app controls
│ [Run Brief]     │           layout and styling.
└─────────────────┘
```

`raw` mode is a headless escape hatch. The tile handles data fetching, state management, loading states, error states, and atom contract compliance. The consumer handles rendering. Use it when the standard layout cannot accommodate the surface — the extension sidebar, an inline chat reference, a Mox dashboard widget.

---

## Design tokens

All packages reference CSS custom properties prefixed `--h-`. No hardcoded colors, sizes, or fonts inside any package. Consuming apps override by re-setting variables in their own `:root`.

```css
/* @hauska/design-tokens/tokens.css — complete set */
:root {
  /* Surface */
  --h-surface-0: #111318;
  --h-surface-1: #1a1f2e;
  --h-surface-2: #242938;
  --h-surface-3: #2e3447;

  /* Text */
  --h-text-primary: #e8eaf0;
  --h-text-muted: #7c849a;
  --h-text-link: #4f8ef7;

  /* Border */
  --h-border-subtle: rgba(255,255,255,0.08);
  --h-border-strong: rgba(255,255,255,0.18);

  /* Accent */
  --h-accent: #4f8ef7;
  --h-accent-hover: #6ba3fa;

  /* Status */
  --h-success: #3ecf8e;
  --h-warning: #f5a623;
  --h-error: #e5534b;
  --h-degraded: #7c849a;

  /* Confidence tiers (atom contract) */
  --h-confidence-calibrated: #3ecf8e;
  --h-confidence-asserted: #f5a623;
  --h-confidence-deterministic: #4f8ef7;

  /* Spacing */
  --h-space-xs: 4px;  --h-space-sm: 8px;
  --h-space-md: 16px; --h-space-lg: 24px;  --h-space-xl: 40px;

  /* Radius */
  --h-radius-sm: 4px;  --h-radius-md: 8px;  --h-radius-lg: 12px;

  /* Type */
  --h-font-sans: 'Inter', system-ui, sans-serif;
  --h-font-mono: 'JetBrains Mono', monospace;
  --h-text-sm: 12px;  --h-text-md: 14px;  --h-text-lg: 16px;
}
```

---

## Capability advertisement — extended TileDef

The TileDef type is extended with machine-readable fields that power the `compose_workspace` MCP tool and the adaptive interface.

```typescript
type TileDef = {
  id: string
  label: string
  category: TileCategory
  status: 'live' | 'degraded' | 'partial' | 'planned'
  degradedReason?: string

  // Machine-readable capability contract
  requires: {
    engagementId?: boolean       // needs a selected engagement
    apn?: boolean                // needs a parcel APN
    jurisdiction?: boolean       // needs a jurisdiction key
    uploadedDocuments?: boolean  // needs plan docs attached
    completedFindings?: boolean  // needs a prior compliance run
  }
  produces: {
    spatialOverlays?: boolean    // publishes to SpatialProvider
    findings?: boolean           // publishes findings to EngagementProvider
    annotations?: boolean        // publishes to annotation layer
    letter?: boolean             // produces a deliverable
  }

  modes: Array<'full' | 'card' | 'inline' | 'raw'>
  minWidth?: number
  mcpTools?: string[]            // which MCP tools back this tile

  el: () => React.ReactElement
}
```

The `compose_workspace` MCP tool reads this registry, filters tiles whose `requires` are satisfied by the current engagement context, and returns a `WorkspaceComposition`. The AI does not guess — it reads the contract.

---

## Annotation data model — 2D and 3D unified

Single table, single model, handles both PDF page coordinates and IFC element coordinates.

```typescript
type Annotation = {
  id: string
  engagementId: string
  author: 'ai' | string              // userId for human markup
  kind: 'finding' | 'redline' | 'shape' | 'text' | 'stamp' | 'dimension'
  findingId?: string                 // links to a compliance finding
  confidence?: ConfidenceObject      // from @hauska/atom-contract
  createdAt: string

  // 2D — PDF/image page coordinate (0–1 normalized)
  location2d?: {
    submissionId: string
    page: number
    bbox: [x1: number, y1: number, x2: number, y2: number]
    label: string
  }

  // 3D — IFC/BIM element coordinate
  location3d?: {
    globalId: string    // IFC GlobalId
    elementId: string   // APS element URN
    face?: number
    label: string
  }
}
```

DB: `engagement_annotations` table with nullable `location2d` and `location3d` JSONB columns. Both AI-generated annotations and human redlines use the same model — distinguished by `author`.

---

## Version history — atom/node/edge graph model

Submissions form a directed graph of procedure-execution atoms (ADR-013).

```
[submission:1 "original"]
      │  edge: "superseded-by"
      ▼
[submission:2 "resubmission"]
      │  edge: "superseded-by"
      ▼
[submission:3 "final-approved"]

annotation.location2d.submissionId = "submission:1"

On new submission:
  carry-forward: annotations landing on the same page area
                 get a "carried-from" edge to the new submission
  diff: AI compares page images, flags addressed findings
```

The DocumentViewerTile's version picker traverses the "superseded-by" chain. Diff view renders two submission nodes side by side with carry-forward highlighted.

---

## Error boundary requirement

Every tile component ships with its own React error boundary. One broken tile must not crash the workspace. The boundary shows a named error state: tile label + error message + a retry button. This is a build requirement for every tile in `@hauska/cortex-tiles`, not an afterthought.

---

## Adaptive interface loop

```
User intent → AI (via MCP tools) → WorkspaceComposition → tile-shell → rendered workspace

User: "Show me the hazard and compliance for 146 S Fredricksburg"
  │
  ▼
AI calls: get_property_brief, get_hazard_profile (MCP tools — data)
AI calls: compose_workspace({ intent, engagementId }) (MCP tool — composition)
  │
  ▼
WorkspaceComposition {
  tiles: ["compliance-run", "hazard-profile", "map"],
  layoutId: "3r",
  engagementId: "cc2e0a30...",
  why: "Compliance + hazard + spatial for the selected property"
}
  │
  ▼
@hauska/tile-shell receives composition
renders GridCanvas with those tiles, pre-populated
  │
  ▼
User sees: compliance run + hazard + map, already loaded
Undo banner: "AI loaded Plan Review + Hazard — Undo"
```

---

## Print / export — deliverable pipeline

```
Plan pages (pdftoppm) + annotation SVG rendered to raster
  + page-by-page PDF merge
  + cover sheet (engagement name, jurisdiction, reviewer, date)
  + code citation appendix (from letter tile)
  → court-admissible annotated plan set + comment letter as one package
```

Annotated PDF export extends the existing letter render path. New BFF route: `POST /api/plan-review/engagements/:id/export`. Returns presigned GCS URL.

---

## Repo layout after full extraction

```
hauska-map/
  packages/
    map-renderer/          @hauska/map-renderer
  apps/
    command-center/        spine console — imports @hauska/map-renderer

legacy-design-tools/
  packages/
    design-tokens/         @hauska/design-tokens
    tile-shell/            @hauska/tile-shell
    cortex-client/         @hauska/cortex-client (no React)
    cortex-tiles/          @hauska/cortex-tiles
    document-viewer/       @hauska/document-viewer
  artifacts/
    codex-reviewer-qa/     thin consumer app
    api-server/            BFF — imports types from @hauska/cortex-client

hauska-mcp-server/
  src/tools/
    compose_workspace.ts   WorkspaceComposition tool
    (existing 62 tools)
```
