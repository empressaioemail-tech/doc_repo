---
id: 2026-07-01_cortex_reporting_tile_workspace_build
title: cc-agent-C — cortex-reporting configurable tile workspace
status: dispatched
dispatched: 2026-07-01
agent: cc-agent-C
repo: legacy-design-tools
spec: doc_repo/48_cortex_reporting_function_dashboard_spec.md
---

# cc-agent-C: cortex-reporting configurable tile workspace

## What you are building

A configurable tile workspace shell for the cortex-reporting function package (legacy-design-tools). Every cortex function — compliance run, topography, drainage, hydrology, hazard, property brief, letter, map, etc. — is a self-contained tile component that can be mounted independently or composed into a configurable grid with other tiles.

The shell is domain-agnostic: it renders whatever tiles the operator selects into a CSS-grid layout. It knows nothing about plan review — plan review is just a named preset space (default tile composition). The same shell can run any combination of tiles. This mirrors the FocusShell/TileDef pattern from the trading app.

## Starting point

Start from `artifacts/codex-reviewer-qa`. It has working review logic (one-click AI run, finding cards, accept/edit/reject, comment letter draft) that you will keep and build outward from. Do NOT start fresh from a blank React app.

First task: gut the broken dependencies. Remove all direct imports of `@workspace/db`, `@workspace/adapters`, `@workspace/codes` from browser-side code. Replace every one with API-client calls to the BFF. The root cause of the prior white-screen crash was server-only packages (pg, postgres-bytea, node:crypto) imported transitively through these workspace packages into the browser bundle. After gutting those, the browser bundle will build cleanly.

The existing `artifacts/plan-review/` directory is abandoned — it had the same problem at a structural level. Do not reference it.

## Core types (add to a new file: `src/tile-shell/types.ts`)

```typescript
export type TileStatus = 'live' | 'degraded' | 'partial' | 'planned'

export type TileCategory =
  | 'Compliance'
  | 'Site Analysis'
  | 'Property Intel'
  | 'Design Accelerator'
  | 'Deliverable'
  | 'Market'

export type TileDef = {
  id: string
  label: string
  category: TileCategory
  engine?: 'engagement' | 'spatial' | 'code'   // shared engine key
  el: () => React.ReactElement
  minColShare?: number
  status: TileStatus
  degradedReason?: string
}

// AI / programmatic composition contract
export type WorkspaceComposition = {
  engagementId?: string
  tiles: string[]     // ordered tile ids
  layoutId: string    // key into LAYOUTS
  why: string
}

export type PresetSpace = {
  id: string
  label: string
  tiles: string[]
  layoutId: string
}
```

## Tile registry (file: `src/tile-shell/tiles.ts`)

Register all tiles from day one. Planned, degraded, and partial tiles are registered and selectable — they mount a status banner explaining what is needed. Do not omit them from the registry.

```typescript
export const TILE_DEFS: TileDef[] = [
  // --- Compliance ---
  { id: 'intake-queue',       label: 'Intake / Queue',           category: 'Compliance',         engine: 'engagement', status: 'live',     el: () => <IntakeQueueTile /> },
  { id: 'compliance-run',     label: 'Compliance Run',           category: 'Compliance',         engine: 'engagement', status: 'live',     el: () => <ComplianceRunTile /> },
  { id: 'findings-library',   label: 'Findings Library',         category: 'Compliance',         engine: 'engagement', status: 'live',     el: () => <FindingsLibraryTile /> },
  { id: 'calibration',        label: 'Finding Calibration',      category: 'Compliance',         engine: 'engagement', status: 'live',     el: () => <CalibrationTile /> },
  { id: 'precedence',         label: 'Precedence Engine',        category: 'Compliance',         engine: 'code',       status: 'degraded', degradedReason: 'Production gate not activated — most-stringent-governs logic built but disabled.', el: () => <PrecedenceTile /> },
  { id: 'icc-ingest',         label: 'ICC Code Connect Ingest',  category: 'Compliance',         engine: 'code',       status: 'partial',  degradedReason: 'Credentials live; API contract not yet verified.', el: () => <IccIngestTile /> },
  { id: 'ahj-precedent',      label: 'Permit AHJ Precedent',     category: 'Compliance',                               status: 'planned',  el: () => <PlannedTile id="ahj-precedent" /> },
  { id: 'code-broadcast',     label: 'Code Change Broadcast',    category: 'Compliance',                               status: 'planned',  el: () => <PlannedTile id="code-broadcast" /> },

  // --- Site Analysis ---
  { id: 'topography',         label: 'Topography',               category: 'Site Analysis',      engine: 'spatial',    status: 'live',     el: () => <TopographyTile /> },
  { id: 'drainage',           label: 'Drainage',                 category: 'Site Analysis',      engine: 'spatial',    status: 'live',     el: () => <DrainageTile /> },
  { id: 'hydrology',          label: 'Hydrology',                category: 'Site Analysis',      engine: 'spatial',    status: 'degraded', degradedReason: 'pysheds not installed in Cloud Run worker — fix in this sprint.', el: () => <HydrologyTile /> },
  { id: 'subsurface',         label: 'Subsurface Suitability',   category: 'Site Analysis',      engine: 'spatial',    status: 'partial',  degradedReason: 'SSURGO ECONNRESET — USDA TLS issue; fix in this sprint.', el: () => <SubsurfaceTile /> },
  { id: 'stormwater',         label: 'Stormwater / Detention',   category: 'Site Analysis',                            status: 'planned',  el: () => <PlannedTile id="stormwater" /> },
  { id: 'cut-fill',           label: 'Grading / Cut-Fill',       category: 'Site Analysis',                            status: 'planned',  el: () => <PlannedTile id="cut-fill" /> },
  { id: 'solar',              label: 'Solar / Aspect',           category: 'Site Analysis',                            status: 'planned',  el: () => <PlannedTile id="solar" /> },
  { id: 'viewshed',           label: 'Viewshed',                 category: 'Site Analysis',                            status: 'planned',  el: () => <PlannedTile id="viewshed" /> },

  // --- Property Intel ---
  { id: 'property-brief',     label: 'Property Brief',           category: 'Property Intel',     engine: 'engagement', status: 'live',     el: () => <PropertyBriefTile /> },
  { id: 'hazard',             label: 'Hazard Profile',           category: 'Property Intel',     engine: 'spatial',    status: 'live',     el: () => <HazardTile /> },
  { id: 'place-dossier',      label: 'Place Dossier',            category: 'Property Intel',     engine: 'engagement', status: 'live',     el: () => <PlaceDossierTile /> },
  { id: 'encumbrances',       label: 'Encumbrance Report',       category: 'Property Intel',     engine: 'engagement', status: 'live',     el: () => <EncumbrancesTile /> },
  { id: 'setbacks',           label: 'Local Setbacks',           category: 'Property Intel',     engine: 'code',       status: 'live',     el: () => <SetbacksTile /> },
  { id: 'climate-risk',       label: 'Climate Risk Trajectory',  category: 'Property Intel',                           status: 'planned',  el: () => <PlannedTile id="climate-risk" /> },
  { id: 'insurance-estimate', label: 'Insurance Cost Estimate',  category: 'Property Intel',                           status: 'planned',  el: () => <PlannedTile id="insurance-estimate" /> },
  { id: 'jurisdiction-rank',  label: 'Jurisdiction Comparison',  category: 'Property Intel',                           status: 'planned',  el: () => <PlannedTile id="jurisdiction-rank" /> },

  // --- Design Accelerator ---
  { id: 'sheet-extraction',   label: 'Sheet Extraction',         category: 'Design Accelerator', engine: 'engagement', status: 'live',     el: () => <SheetExtractionTile /> },
  { id: 'doc-parsing',        label: 'Document Parsing',         category: 'Design Accelerator', engine: 'engagement', status: 'live',     el: () => <DocParsingTile /> },
  { id: 'product-spec',       label: 'Product Spec Reference',   category: 'Design Accelerator', engine: 'code',       status: 'live',     el: () => <ProductSpecTile /> },
  { id: 'detail-callouts',    label: 'Detail Callout Specs',     category: 'Design Accelerator', engine: 'engagement', status: 'live',     el: () => <DetailCalloutsTile /> },
  { id: 'response-tasks',     label: 'Response Tasks',           category: 'Design Accelerator', engine: 'engagement', status: 'live',     el: () => <ResponseTasksTile /> },
  { id: 'bim-query',          label: 'BIM Model Query',          category: 'Design Accelerator', engine: 'engagement', status: 'live',     el: () => <BimQueryTile /> },
  { id: 'ifc-ingest',         label: 'IFC Ingest',               category: 'Design Accelerator', engine: 'engagement', status: 'live',     el: () => <IfcIngestTile /> },
  { id: 'engagement-match',   label: 'Engagement Match (Revit)', category: 'Design Accelerator', engine: 'engagement', status: 'live',     el: () => <EngagementMatchTile /> },
  { id: 'renders',            label: 'Renders',                  category: 'Design Accelerator', engine: 'engagement', status: 'live',     el: () => <RendersTile /> },
  { id: 'collateral-export',  label: 'Collateral Export',        category: 'Design Accelerator', engine: 'engagement', status: 'live',     el: () => <CollateralExportTile /> },

  // --- Deliverable ---
  { id: 'letter',             label: 'Deliverable Letter',       category: 'Deliverable',        engine: 'engagement', status: 'live',     el: () => <LetterTile /> },
  { id: 'letter-render',      label: 'Letter Render',            category: 'Deliverable',        engine: 'engagement', status: 'live',     el: () => <LetterRenderTile /> },
  { id: 'letter-send',        label: 'Letter Send',              category: 'Deliverable',        engine: 'engagement', status: 'live',     el: () => <LetterSendTile /> },

  // --- Market ---
  { id: 'avm',                label: 'AVM / Valuation',          category: 'Market',             engine: 'engagement', status: 'partial',  degradedReason: 'Cotality AVM keys present; not fully wired.', el: () => <AvmTile /> },
  { id: 'rent-comps',         label: 'Rent / Comps',             category: 'Market',             engine: 'engagement', status: 'partial',  degradedReason: 'Cotality demo quota: 100 req/day; expires ~2026-07-06.', el: () => <RentCompsTile /> },
  { id: 'pro-forma',          label: 'Cash-Flow Pro Forma',      category: 'Market',                                   status: 'planned',  el: () => <PlannedTile id="pro-forma" /> },
  { id: 'deal-score',         label: 'Deal Score',               category: 'Market',                                   status: 'planned',  el: () => <PlannedTile id="deal-score" /> },
  { id: 'motivated-seller',   label: 'Motivated Seller Heat',    category: 'Market',                                   status: 'planned',  el: () => <PlannedTile id="motivated-seller" /> },
  { id: 'rehab-opportunity',  label: 'Rehab Opportunity',        category: 'Market',                                   status: 'planned',  el: () => <PlannedTile id="rehab-opportunity" /> },

  // --- Map (cross-cutting) ---
  { id: 'map',                label: 'Map',                      category: 'Site Analysis',      engine: 'spatial',    status: 'live',     el: () => <MapTile />, minColShare: 0.3 },
]
```

## Layout map

```typescript
export const LAYOUTS: Record<string, string> = {
  '1':  '"a"',
  '2h': '"a b"',
  '2v': '"a" / "b"',
  '3l': '"a b" / "a c"',    // a is wide left
  '3r': '"a b" / "c b"',    // b is wide right
  '4':  '"a b" / "c d"',
  '6':  '"a b c" / "d e f"',
}
```

Auto-select layout by tile count: 1→'1', 2→'2h', 3→'3l', 4→'4', 5→'4' (fifth tile shown in an overflow picker), 6→'6'. Drag splitters adjust column/row fractions live using CSS grid fractional units.

## Preset spaces

```typescript
export const PRESET_SPACES: PresetSpace[] = [
  {
    id: 'plan-review',
    label: 'Plan Review',
    tiles: ['intake-queue', 'compliance-run', 'letter', 'map'],
    layoutId: '4',
  },
  {
    id: 'site-analysis',
    label: 'Site Analysis',
    tiles: ['topography', 'drainage', 'hydrology', 'map'],
    layoutId: '3r',
  },
  {
    id: 'property-intel',
    label: 'Property Intel',
    tiles: ['property-brief', 'hazard', 'encumbrances', 'map'],
    layoutId: '3l',
  },
  {
    id: 'design-accelerator',
    label: 'Design Accelerator',
    tiles: ['sheet-extraction', 'response-tasks', 'map'],
    layoutId: '3r',
  },
]
```

"All Functions" is not a preset space — it is just the tile picker open with no active tiles. The operator picks from the category-grouped list.

## Shared data engines

Three context providers, each at the shell level:

**EngagementProvider** — current `engagementId`, full engagement record (parcel, applicant, all report results keyed by report type), and a `setEngagement(id)` function. Any tile with `engine: 'engagement'` consumes this via `useEngagement()`. When a report run completes, the tile calls `setEngagementReportResult(type, result)` which updates the shared context. The `intake-queue` tile calls `setEngagement(id)` when the operator selects a case, which loads context for all other tiles simultaneously.

**SpatialProvider** — current overlay stack `Array<OverlaySpec>` and `pushOverlay(spec: OverlaySpec)`. Any tile with `engine: 'spatial'` that produces spatial output calls `pushOverlay()` with a named GeoJSON or tile-layer spec. The map tile subscribes to this context and renders whatever is in the stack. Tiles NEVER hold a ref to the map component.

**CodeProvider** — current `jurisdictionKey`, active atom chain results, precedence result. The `compliance-run` tile publishes here; the `letter` and `findings-library` tiles read from it.

## Map tile implementation

The `MapTile` component renders the hauska-map E6 renderer as an `<iframe>`. The iframe src is the live hauska-map command center URL with `?apn=<APN>&jurisdiction=<key>&mode=overlay` query params. The tile subscribes to `SpatialProvider` and, when new overlays arrive, it posts a message to the iframe via `postMessage({ type: 'ADD_OVERLAY', overlay: spec })`. The hauska-map command center must handle this message type and add the overlay to its layer stack.

If hauska-map does not yet support the `ADD_OVERLAY` postMessage API, implement a minimal fallback: the MapTile renders a `<MapboxGL>` instance using the same token as hauska-map (read from env), centers on the engagement parcel, and renders overlays directly. Do not block the build on this question — use the fallback if the postMessage path is not ready.

## BFF routes (new file: `artifacts/api-server/src/routes/planReviewBff.ts`)

These are clean routes that call existing engine functions. Do not reimplement any logic here.

```
POST   /plan-review/intake
         Body: { mode: 'link'|'file'|'paste'|'email', content: string|string[] }
         Returns: IntakeParseResult[]    (one per submittal; unverifiedFields per result)

GET    /plan-review/queue
         Query: status? (filter by Submitted|InReview|Approved|Conditions|Denied)
         Returns: EngagementQueueItem[]  (id, status, reportRunState, openFindingCount, daysInQueue)

GET    /plan-review/engagements/:id
         Returns: EngagementDetail       (metadata + all report results)

POST   /plan-review/engagements/:id/reports/:type/run
         :type = compliance|topography|drainage|hydrology|hazard|encumbrances|brief|subsurface|avm
         Returns: 202 { generationId }   (single-flight; 409 if already running)

GET    /plan-review/engagements/:id/reports/:type
         Returns: report result or { status: 'running'|'not-run'|'error' }

PATCH  /plan-review/engagements/:id/findings/:fid
         Body: { action: 'accept'|'override'|'flag', reason?: string, overrideText?: string }
         Returns: updated Finding

POST   /plan-review/engagements/:id/letter
         Body: { reviewerTier: 'junior'|'senior', tenantId: string }
         Returns: LetterDraft            (sections with provenance per section)

POST   /plan-review/engagements/:id/letter/render
         Body: { letterheadTemplateId: string }
         Returns: { pdfUrl: string }

POST   /plan-review/engagements/:id/letter/send
         Body: { to: string, subject: string }
         Returns: { status: 'sent' }

GET    /plan-review/admin/functions
         Returns: TileDef[] with current status (feeds the tile picker's status badges live)
```

Mount the router at `/plan-review` in the main api-server Express app (same mount point structure as existing routes).

## Degraded engine fixes (fix these in the same sprint)

These three are blocking the tile registry from showing accurate live/degraded status.

**1. Hydrology — pysheds not installed.**
Find the hydrology worker Docker image definition (likely `services/hydrology-worker/Dockerfile` or similar). Add `RUN pip install pysheds` (or add it to `requirements.txt` if one exists). Redeploy the Cloud Run service. Verify by calling the hydrology report endpoint for a known parcel and confirming a GeoJSON flow-lines response rather than an error.

**2. Precedence engine — production no-op.**
Find the precedence/reconciliation engine (search for `most-stringent` or `reconcil` in the codebase). Identify the production gate or feature flag that is preventing it from running. Activate it. Verify by running a plan review for a jurisdiction with both municipal and I-Code atoms and confirming the response includes a `precedenceResult` with the winning rule.

**3. SSURGO soils — ECONNRESET.**
Find the SSURGO/USDA fetcher (search for `SSURGO` or `sdmdataaccess`). The USDA Web Soil Survey endpoint has had TLS issues. Try the current endpoint with a test curl; if it fails, check whether USDA has a newer endpoint (the WFS endpoint at `sdmdataaccess.sc.egov.usda.gov` vs. `websoilsurvey.sc.egov.usda.gov`). Add retry logic with 3 attempts and 1s backoff. If the endpoint is down, add a graceful fallback that returns `{ status: 'unavailable', reason: 'USDA endpoint unreachable' }` rather than throwing.

## Tile component pattern (one file per tile)

Each tile lives at `src/tiles/<category>/<TileId>.tsx`. Every tile:

- Uses `useEngagement()`, `useSpatial()`, or `useCode()` from the shared providers as needed — no prop drilling
- Has its own input form (minimal: engagement ID, parcel APN, jurisdiction key — pre-filled from context if available)
- Has its own trigger button that calls the BFF endpoint for its report type
- Manages its own loading/error/result state with `useState`/`useQuery`
- On spatial output, calls `pushOverlay(spec)` from `useSpatial()` — never a ref to the map
- Renders a `<TileStatusBanner>` at the top if its status is not `live`
- Is mountable standalone at `/tile-dev/<tileId>` for individual testing

The `PlannedTile` component receives `id` and renders a placeholder: the tile label, "Planned — not yet built", and any spec reference.

## Shell layout

```
CortexShell
  SpaceBar              — preset space pills + "Save this space" + undo banner
  TilePicker            — category-grouped add-tile drawer (slides in from left)
  GridCanvas            — CSS grid; renders active tiles; supports drag-resize splitters
    TileWrapper[]       — wraps each tile: drag handle, close button, full-screen toggle
      <tile.el() />     — the tile component
  EngagementProvider    — wraps GridCanvas
  SpatialProvider       — wraps GridCanvas
  CodeProvider          — wraps GridCanvas
```

Applying a preset: `snapshotState()` (capture tiles + layout + engagementId) → apply new tiles + layout → show undo banner ("✦ Plan Review space loaded · Undo"). If operator selects another preset within 10 seconds, undo banner updates but snapshot is refreshed on the new apply.

## What NOT to do

- Do not import `@workspace/db`, `@workspace/adapters`, or `@workspace/codes` anywhere in the browser bundle. All data access goes through the BFF.
- Do not create a custom map component. Use the hauska-map iframe embed or Mapbox fallback as specified.
- Do not design a separate "admin tab" — the tile picker IS the admin function. Every tile is always reachable through the picker.
- Do not add authentication or multi-user session logic. This is an operator-internal tool; single-session is fine for v1.
- Do not skip registering planned/degraded tiles. They must appear in the registry with correct status.

## Deliverables

1. Shell: `src/tile-shell/` (types, tiles, layouts, presets, providers, SpaceBar, TilePicker, GridCanvas, TileWrapper)
2. Tiles: `src/tiles/<Category>/<TileId>.tsx` — priority order: `intake-queue`, `compliance-run`, `letter`, `map`, then site analysis tiles (topography, drainage, hydrology), then property intel
3. BFF: `artifacts/api-server/src/routes/planReviewBff.ts` mounted in main express app
4. Degraded engine fixes: hydrology (pysheds), precedence (activate gate), SSURGO (retry + fallback)
5. Dev harness: `src/tile-dev/` — route that mounts a single tile by id for standalone testing

Open a PR when the shell + Plan Review preset space + BFF routes + three engine fixes are working. Tile completeness: at minimum all tiles in the Plan Review preset plus all tiles in the Site Analysis preset must render (live or degraded). Remaining tiles can be `PlannedTile` stubs with correct status.
