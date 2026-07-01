---
id: 48_cortex_reporting_function_dashboard_spec
title: cortex-reporting configurable tile workspace — spec
status: active
last_updated: 2026-07-01
applies_to: legacy-design-tools, cortex-reporting
owner: nick
related: [adr_023, 47_codex_plan_review, 11a_bastrop_live_roadmap, 75n_icc_code_connect_catalog, endstate_E_spine_console, 75l_cotality_data_stack_catalog]
supersedes: 48_cortex_reporting_plan_review_spec
---

# cortex-reporting configurable tile workspace — spec

Every cortex-reporting function is a self-contained tile component. The workspace shell is domain-agnostic: it renders whatever tiles the operator has selected into a configurable grid. The shell knows nothing about plan review or property intelligence — it just manages the grid, the tile registry, the preset spaces, and the persistence. Swap the tile list and you have a different product.

This is the same pattern as the trading-app FocusShell (TileDef registry, CSS-grid layout map, preset spaces, AI composition contract, reversible snapshot). All differences are content — which tiles exist, which categories they fall into, which preset spaces are shipped.

The surface lives at `legacy-design-tools/artifacts/codex-reviewer-qa` (renamed and rebuilt). The seed is the existing codex-reviewer-qa harness; dependencies are gutted and the shell is rebuilt outward from the working review loop.

---

## Core data types

```typescript
type TileDef = {
  id: string           // 'compliance-run', 'hydrology', 'map', 'letter', etc.
  label: string        // display name in tile picker
  category: TileCategory
  engine?: string      // shared data-engine key: 'engagement' | 'spatial' | 'code'
  el: () => React.ReactElement
  minColShare?: number // min grid width before tile is unreadable
  status: 'live' | 'degraded' | 'partial' | 'planned'
  degradedReason?: string  // shown as tooltip / fix banner
}

type TileCategory =
  | 'Compliance'
  | 'Site Analysis'
  | 'Property Intel'
  | 'Design Accelerator'
  | 'Deliverable'
  | 'Market'

type LayoutSpec = {
  id: string           // e.g. '1', '2h', '2v', '3', '4'
  template: string     // CSS grid-template-areas
}

// AI composition contract (same shape as trading-app)
type WorkspaceComposition = {
  engagementId?: string       // optional — sets the shared engagement engine context
  tiles: string[]             // ordered tile ids to activate
  layoutId: string            // must be a key in LAYOUTS[n]
  why: string                 // agent reasoning, shown in reversible banner
}
```

## Shared data engines

Tiles that share an `engine` key consume the same underlying data context without prop-drilling. Three engines for v1:

**`engagement` engine** — parcel APN, applicant, submission metadata, all report run results keyed by report type. Any tile subscribed to this engine re-renders when a new report result lands. Compliance, findings, topography, drainage, hydrology, hazard, encumbrances, letter tiles all use this engine.

**`spatial` engine** — the live parcel geometry and the active overlay stack. The map tile is the consumer; all other tiles that produce spatial output (topography contours, drainage flow lines, hydrology delineation, hazard flood extent) publish to this engine. The map tile renders whatever overlays are in the stack. No tile has a direct ref to the map component.

**`code` engine** — jurisdiction key, active code corpus (atom chain, precedence result, ICC content). Compliance and findings tiles publish; any tile that needs citation text (letter tile, code-library tile) subscribes.

## Layouts

Same approach as trading-app: a small map from tile-count to a CSS-grid-template-areas string. Supports 1 through 6 tiles. Drag-to-resize adjusts column/row fractions live.

```
LAYOUTS = {
  '1':  '"a"',
  '2h': '"a b"',
  '2v': '"a" / "b"',
  '3l': '"a b" "a c"',
  '3r': '"a b" "c b"',
  '4':  '"a b" "c d"',
  '6':  '"a b c" "d e f"',
}
```

## Preset spaces

Preset spaces replace the idea of fixed tabs. Each is a named tile composition + layout that the operator can switch to in one click. Operator can also save any custom arrangement as a named space (localStorage for v1).

| Space | Tiles | Layout | Purpose |
|---|---|---|---|
| All Functions | tile-picker open, no active tiles | — | Browse and test individual functions |
| Plan Review | intake, compliance-run, map, letter | 4 (2x2) | City reviewer workflow |
| Site Analysis | topography, drainage, hydrology, map | 4 (3r) | Site report proving run |
| Property Intel | property-brief, hazard, encumbrances, map | 4 (3l) | Property diligence |
| Design Accelerator | sheet-extraction, response-tasks, map | 3l | Sheet QA |

Additional spaces are added when a new workstream is ready to prove. The shell is not rebuilt — a new entry in PRESET_SPACES is all that changes.

---

## Architecture: single shell, tile registry

## Tile registry (all functions, all categories)

All functions are registered as tiles from day one. Status badges: `live` (working in production), `degraded` (built but broken, fix owed), `partial` (built, data or key missing), `planned` (designed, not built). Degraded and partial tiles are selectable and mount — they render a status banner with the fix reason so the operator can see exactly what is broken.

#### Category A — Code Compliance

| Function | Status | What it does |
|---|---|---|
| Plan review run | live | Async finding generation per code section (Grok-first, Anthropic fallback) |
| Finding calibration overlay | live | Arrow-two outcome capture; confidence postcapture |
| Precedence / reconciliation engine | degraded | Most-stringent-governs across municipal + I-Code + federal layers; production no-op — fix owed |
| ICC Code Connect ingest | partial | IBC/IPMC atom ingestion; credentials live, API contract not verified |
| Permit AHJ precedent | planned | Permit approved/denied ground truth; designer's #1 question; calibration signal |
| Code-change broadcast | planned | Jurisdiction adoption notifications; alert when watched code section changes |

#### Category B — Site Analysis

| Function | Status | What it does |
|---|---|---|
| Site topography | live | USGS 3DEP DEM, d3-contour (5m interval), slope, hillshade |
| Site drainage | live | D8 flow direction, NOAA Atlas 14 rainfall, return periods (2/10/25/100yr), flood-depth overlay |
| Hydrology (watershed) | degraded | pysheds catchment delineation, flow lines, drainage GeoJSON — pysheds never installed in Cloud Run; fix owed |
| Subsurface suitability | partial | SSURGO soils, USGS geology, groundwater, O&G, minerals — soils ECONNRESET (USDA TLS issue); fix owed |
| Stormwater / detention sizing | planned | D8 flow + impervious-cover requirement estimate |
| Grading / cut-fill volume | planned | Earthwork volume and cost estimate from DEM |
| Solar / aspect | planned | DEM aspect, sun-path orientation, solar exposure |
| Viewshed | planned | View premium analysis from parcel elevation |

#### Category C — Property Intelligence

| Function | Status | What it does |
|---|---|---|
| Property brief | live | Full synthesis: site-context + parcel + code + hazard + market |
| Hazard profile | live | FEMA flood + perils (fire/wind/hail/quake) + insurance estimate |
| Place dossier | live | Comprehensive briefing, snapshot-first |
| Encumbrance report | live | Liens, deed restrictions, CC&Rs, special district membership |
| Local setbacks | live | Dimensional requirements by jurisdiction key |
| Climate risk trajectory | planned | AR6 scenarios (2030/2040/2050) forward-projected hazard surface |
| Insurance cost estimate | planned | Composite hazard + RCV → estimated insurance cost |
| Comparative jurisdiction | planned | Same build type across adjacent jurisdictions, ranked by approval friendliness |

#### Category D — Design Accelerator

| Function | Status | What it does |
|---|---|---|
| Sheet content extraction | live | OCR + structured annotation of submitted plan sheets |
| Attached document parsing | live | Spec/calculation/product-data/narrative with parsed text |
| Product spec reference | live | ICC-ES product verification lookup |
| Detail callout specs | live | L-Surface drawing markup per Cortex Lane C.4 |
| Response tasks | live | Design-accelerator action items |
| BIM model query | live | IFC geometry and element query |
| IFC ingest | live | IFC file → materializable elements |
| Engagement match | live | Revit file → engagement identity resolver |
| Renders | live | Still / elevation-set / video via mnml.ai |
| Collateral export | live | PDF template-pack job via Placid |

#### Category E — Deliverable

| Function | Status | What it does |
|---|---|---|
| Deliverable letter | live | Compose sections (cover / intro / responses / signature); provenance per section |
| Letter completeness gate | live | Validates required section kinds before send |
| Letter render | live | DOCX / PDF render via L6 pipeline |
| Letter send | live | Draft → sent state transition |

#### Category F — Market / Investor

| Function | Status | What it does |
|---|---|---|
| AVM / valuation | partial | Cotality AVM; keys present, not fully wired |
| Rent / comps | partial | Cotality rent-heat and comparable sales; demo quota (100 req/day) |
| Cash-flow pro forma | planned | Rent − tax − insurance − HOA = NOI; cap-rate derivation |
| Deal score | planned | (AVM vs asking) + yield + propensity − hazard penalty |
| Motivated-seller heat | planned | Propensity × absentee-owner × equity × tax-delinquency |
| Rehab opportunity | planned | Old year-built + no recent permits + below-median AVM + rising-rent zone |

### Tile component pattern

Each tile is a self-contained React component:

- Receives only its tile-level props: `tileId`, `engagementId?`, and an optional `onSpatialOutput` callback for publishing to the spatial engine
- Has its own input form (minimal: engagement ID, parcel APN, jurisdiction key, report-specific options)
- Has its own trigger button that calls the BFF and manages its own loading/error/result state
- Shows raw JSON output in a collapsible inspector panel
- Shows its status badge (live/degraded/partial/planned) with fix reason in a tooltip if degraded
- Can be mounted standalone in a browser without the shell — each tile is independently testable

Tiles that produce spatial output call `onSpatialOutput(overlaySpec)` to publish to the shared spatial engine. The map tile listens to the spatial engine and renders whatever overlays are pushed to it. Tiles never hold a ref to the map component.

### Map tile

The map tile (`id: 'map'`) renders the E6 map renderer from hauska-map, centered on the active engagement's parcel. It subscribes to the spatial engine and renders any overlays that other tiles publish. Implementation: iframe embed of the live hauska-map command center with `?apn=<APN>&mode=overlay` query params — fastest path, no dependency coupling. If hauska-map exports E6 cleanly as a package before this build starts, use the package import instead.

All 35 live map layers and 12 proposed composite layers are toggleable within the map tile itself (same layer panel as E3 in the command center). No separate map-layers panel is needed in the shell.

---

## Plan Review preset space (first workspace)

Plan Review is the first preset space and is shipped in the initial build. It composes four tiles into the engagement reviewer workflow.

### Default tile composition

| Position | Tile | Engine | What it does |
|---|---|---|---|
| a (top-left) | `intake-queue` | engagement | Multi-case intake + engagement queue. Selecting an engagement sets the engagement engine context for all other tiles. |
| b (top-right) | `compliance-run` | engagement + code | Runs the compliance engine. Findings appear in-tile; each finding has accept/override/flag reviewer actions. Senior view shows atom chain + confidence per finding. |
| c (bottom-left) | `letter` | engagement + code | Composes letter from accepted/overridden findings. Letterhead per tenant/jurisdiction. Render to PDF, send. |
| d (bottom-right) | `map` | spatial | E6 renderer. Loads parcel on engagement select. Receives overlays from compliance-run, topography, drainage, hydrology when those tiles run. |

Layout: `4` (2x2 grid).

### Plan Review tile detail

**`intake-queue` tile.** Multi-case intake form (link/file/paste/email) plus a queue list of all active engagements by status. Intake parses via `POST /plan-review/intake`; parsed fields marked unverified until confirmed. Batch mode: multiple submittals in one paste or upload, each parsed and shown as a review card before the operator confirms. Selecting an engagement from the queue sets the engagement engine context.

**`compliance-run` tile.** Trigger button → async compliance engine run → finding cards per code section. Junior view: accept / flag / escalate per finding, auto-letter on all accepted. Senior view: full atom chain on any finding, confidence object `{n, width, provenance}`, manual re-run, per-finding override with reason. Role toggle is a setting, not a URL change.

**`letter` tile.** Reads accepted/overridden findings from the engagement engine. Sections: cover (applicant info, project summary), intro (scope of review), findings responses (per code section, determination, citation), signature. Letterhead template per tenant/jurisdiction. Preview inline, render to PDF, send to applicant.

**`map` tile.** Covered above. In the Plan Review context: on engagement select, centers on the parcel and renders regulatory overlays (zone, flood, setback, utility corridor). When compliance-run completes, relevant spatial constraints highlight on the map.

### Operator can modify the preset

Any tile can be swapped out or added while in the Plan Review space. Example: operator adds `topography` and `drainage` tiles alongside `compliance-run` for a site-analysis-heavy submittal. The shell handles the layout reflow; no code change required.

---

## BFF — clean, 10 routes

Lives in a new file `artifacts/api-server/src/routes/planReviewBff.ts` (or a dedicated express app if the api-server monolith becomes a problem). Calls the existing engine functions; does not reimplement them.

```
POST   /plan-review/intake                              — multi-case intake (link/file/paste/email + batch)
GET    /plan-review/queue                               — reviewer queue with status and report run state
GET    /plan-review/engagements/:id                     — engagement detail: metadata + all report results
POST   /plan-review/engagements/:id/reports/:type/run  — trigger a report (compliance/hydrology/drainage/topography/etc.)
GET    /plan-review/engagements/:id/reports/:type       — get report results
PATCH  /plan-review/engagements/:id/findings/:fid       — reviewer markup (accept/override/note)
POST   /plan-review/engagements/:id/letter              — compose letter from accepted findings
POST   /plan-review/engagements/:id/letter/render       — render to PDF (letterhead per tenant)
POST   /plan-review/engagements/:id/letter/send         — send to applicant
GET    /plan-review/admin/functions                     — function catalog with status (feeds Tab 1)
```

Report types for the `:type` parameter: `compliance`, `topography`, `drainage`, `hydrology`, `hazard`, `encumbrances`, `brief`, `subsurface`. Each maps to the existing engine call.

---

## Degraded engine fixes (part of this build)

Three degraded engines must be fixed before the dashboard can surface them as live:

**1. Hydrology (pysheds).** Install pysheds in the hydrology-worker Cloud Run container. The Python script is written; the dependency is missing from the deployment. Fix: add pysheds to the Cloud Run Dockerfile and redeploy. Dispatch to cc-agent-C.

**2. Precedence / reconciliation engine.** Currently a production no-op — the most-stringent-governs logic across municipal + I-Code + federal layers is implemented but not activated in production. Fix: identify the production gate and activate. Dispatch to cc-agent-C with the specific file and gate identified.

**3. SSURGO soils (ECONNRESET).** USDA TLS issue causing connection failures. Fix: check current USDA endpoint, test with curl, update the fetcher or add retry/fallback logic. Dispatch to cc-agent-C.

---

## Seed and build approach

Start from `artifacts/codex-reviewer-qa`. It has the working review loop: one-click AI run, finding cards, per-finding accept/edit/reject, comment letter draft. Keep that functional logic.

Remove: all `@workspace/db` and `@workspace/adapters` imports (replace with API-client calls). These caused the browser bundle crash. Replace all direct DB and adapter imports with `@workspace/api-client-react` calls through the BFF.

Add: Tab 1 admin panel (function catalog, status badges, run panels). The Tab 2 plan review workspace is built from the codex-reviewer-qa seed extended with the queue, multi-case intake, and E6 map.

Build posture: function over form. White background. No product design. Every surface proves a function before any product tab is added.

---

## Acceptance criteria

### Shell

1. Tile registry loads; all tiles listed with correct status badges.
2. Any tile can be added to the grid from the tile picker and mounts independently.
3. Degraded tiles mount and show their fix banner; badge flips to `live` once fixed.
4. Layout is configurable; drag-to-resize works.
5. Preset spaces restore a specific tile + layout combination in one click.
6. Applying a preset snapshots the prior state; undo banner reverses it.
7. Custom spaces can be saved and recalled (localStorage for v1).
8. Shell loads without any SmartCity OS session dependency.

### Plan Review preset

1. Multi-case intake parses link/file/paste/email with unverified-field flags.
2. Selecting an engagement from the queue sets context for all other tiles.
3. Compliance run returns findings per code section with atom-chain citations.
4. Junior/senior role toggle changes depth of finding detail without changing the URL.
5. Reviewer can accept, override (with reason), or flag any finding.
6. Letter composes from accepted findings with correct letterhead per tenant/jurisdiction.
7. Letter renders to PDF and sends to applicant.
8. Map tile loads parcel on engagement select; overlays update when site analysis tiles run.

### Tile independence

1. Any tile can be opened at `localhost:PORT/tile-dev/<tileId>` standalone (without the shell) for individual development and testing.
2. Tiles that produce spatial output publish to the spatial engine and do NOT hold a direct ref to the map component.
