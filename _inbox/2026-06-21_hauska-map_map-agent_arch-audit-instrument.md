---
date: 2026-06-21
agent: map-agent
repo: hauska-map
branch: main
task: Architecture-homes phase 1 — operator audit instrument (inspector, agent view, manifest, dock)
status: complete — build verified
dispatch: Architecture-homes phase 1 audit/cleanup — foundational instrument, not new product features
related:
  - _architecture_homes/00_overview.md
  - _architecture_homes/01_homes_and_topology.md
  - _architecture_homes/02_atoms_lifecycle_ownership.md
  - _architecture_homes/03_mcp_gate_and_agent_surface.md
  - _inbox/2026-06-21_hauska-atom-contract_cc-agent-AC_arch-audit-conformance-spec.md
  - _inbox/2026-06-21_hauska-map_map-agent_wave2.md
---

# Close — architecture-homes phase 1 audit instrument (hauska-map)

Phase 1 operator audit instrument: downloadable-atom inspector (cc-agent-AC shape), E8 Agent View tab, report-to-manifest contract with hydrology as first case, and header-docked map window state. Foundational console surfaces for the audit freeze — not new product features.

## Run

```powershell
cd P:\hauska-map
npm install
npm run dev
```

Open http://localhost:5173/

| Param | Purpose |
|---|---|
| `?app=cortex&report=hydrology` | Hydrology report manifest → drainage / flood / contour layers |
| `?fixture=0` | Live GIS + atoms (Hauska key required) |
| `?mcp=http://127.0.0.1:3000/mcp` | MCP admin introspection + call-probe |

Build verified:

```text
> hauska-map@0.2.0-wave2 build
✓ 56 modules transformed.
✓ built in 2.05s
```

---

## 1. Atom inspector (downloadable-atom / cc-agent-AC)

**Source:** doc 02 — "The downloaded atom" portable audit unit.

### Assembly

| Path | Role |
|---|---|
| `src/lib/assemble-downloadable-atom.js` | Assembles export from E2 atom row + E7 trace |
| `src/lib/verify-event-chain-browser.js` | Browser-safe SHA-256 verify-chain (Web Crypto) |
| `src/panels/atom-inspector.js` | Renders all export sections + JSON download |

**Wire order:** gate `atom-export` (when cc-agent-M lands) → local assembly from trace.

**Export sections rendered:**

| Section | Source |
|---|---|
| Identity | `entityType`, `entityId`, `contentId`, `vdaRef` |
| Context summary | E7 trace `contextSummary` or atom fallback |
| Read-contract | Three-axis object (`calibrated` / `asserted` / `consequence`) |
| Composition references | trace inbound/outbound or atom `compositionReferences` |
| Citations | trace `citations` |
| Signed history | data-tier `signedEventChain`; app-tier omitted |
| Verify-chain | `verifyEventChainBrowser()` or wire `verifyChain` |
| Raw JSON download | `atom-export-{entityId}.json` |

### Entry points

- **E2 Atom browser** — click any atom row → inspector panel below table
- **E7 Parcel trace** — click atom id → trace tree + inspector panel

Gate export probe (`fetchAtomExport`) tries `export_atom`, `atom_export`, `get_atom_export` via MCP; honest empty until Track C ships.

**Note:** Browser assembly mirrors `@hauska/atom-contract/export` without importing the Node `history.js` crypto path. `exportVersion` pinned to `1.5.0`.

---

## 2. E8 Agent View tab

**Source:** doc 03 — third-party agent surface.

| Surface | Implementation |
|---|---|
| Tool catalog | `GET {mcpAdmin}/admin/introspection/tools` — filter by **product** (`public` / `codex` / `cortex`) and **tier** (`free_anonymous` hides non-anonymous tools) |
| Discoverability docs | `GET /llms.txt` + `GET /.well-known/agents.txt` from MCP server; static fallback when offline |
| Human test harness | `POST /admin/introspection/tools/:name/call` with `{ arguments, auth: { product, tier } }` — raw response in pane |

**Tab:** E8 Agent (top bar, after E5 Runs).

Click catalog row → pre-selects tool in harness. Harness shows full call-probe JSON including latency and auth simulation.

---

## 3. Report-to-manifest contract

**Source:** doc 01 — "How the map visualizes reports."

Reports declare spatial layers; the renderer reads the manifest and draws from spine atoms through the gate. Report owns narrative + manifest; hauska-map owns rendering.

### Contract shape (`src/renderer/report-layer-manifest.js`)

```typescript
interface ReportLayerManifest {
  manifestVersion: "1.0.0";
  reportType: string;
  appId?: string;
  parcelBinding: string;          // e.g. "report.parcel.placeKey"
  narrativeAtom?: string;         // reasoning atom for prose
  layers: Array<{
    layerKey: string;             // LAYER_REGISTRY key
    label: string;
    sourceAtom?: string;          // spine atom family
    defaultOn?: boolean;
    readContractRole?: string;
  }>;
}
```

| Export | Purpose |
|---|---|
| `REPORT_LAYER_MANIFESTS` | Seeded manifests by report type |
| `resolveReportLayerManifest({ appId, reportType, manifest? })` | Resolve wire or seed |
| `visibleLayersFromManifest(manifest)` | → `Set<string>` for renderer |
| `parseReportLayerManifest(value)` | Validate cortex-api wire manifest |

### First case: hydrology

`?app=cortex&report=hydrology` applies manifest:

| layerKey | label | sourceAtom |
|---|---|---|
| `hydrology-flow` | Drainage (D8 flow) | `site-drainage` |
| `flood-zone` | Flood depth / zone | `site-drainage` |
| `topography-contours` | Elevation contours | `site-topography` |
| `contested-ground` | Contested hydrology overlay | `site-drainage` |

`main.js` → `resolveVisibleLayers()` prefers manifest over V3 allocation when a manifest exists for the report type.

---

## 4. Minimize-to-header (header-docked window)

**FSM extended:** `floating | snapped | minimized | header-docked | maximized | closed`

| Control | Action |
|---|---|
| `⊟` (dock) | `dockToHeader()` — map titlebar moves into `#map-dock-host` in spine topbar |
| `↩` (restore) | `restoreFromHeader()` — returns to pre-dock state |
| All transitions | `captureViewState` / `restoreViewState` preserved (center, zoom, pitch, bearing) |

Map content hidden while header-docked; only titlebar chip visible in topbar. View state survives dock ↔ restore.

---

## Files touched

| Path | Change |
|---|---|
| `src/lib/assemble-downloadable-atom.js` | **new** — downloadable-atom assembly |
| `src/lib/verify-event-chain-browser.js` | **new** — browser verify-chain |
| `src/panels/atom-inspector.js` | **new** — inspector UI + JSON download |
| `src/panels/agent-view.js` | **new** — E8 Agent View |
| `src/renderer/report-layer-manifest.js` | **new** — manifest contract + hydrology seed |
| `src/panels/atom-browser.js` | row click → inspector |
| `src/panels/parcel-trace.js` | trace click → inspector |
| `src/api/spine-api.js` | `fetchAtomExport`, `fetchAgentDiscoverabilityDocs`, `callMcpIntrospectionTool` |
| `src/window-manager/floating-window.js` | `header-docked` state + restore |
| `src/main.js` | E8 tab, manifest wiring, dock host |
| `src/styles/console.css` | inspector, agent view, header-dock styles |

---

## Data populated vs empty (this session)

| Surface | Result | Blocker if empty |
|---|---|---|
| Atom inspector (fixture) | **Populated** — assembly from E2 row + SAMPLE_READ_CONTRACT fallback | — |
| Atom inspector (live) | Partial — needs trace payload for full citations/history | retrieval-api + signed history on atoms |
| Gate atom-export | **Empty** — tool not on gate yet | cc-agent-M Track C |
| E8 catalog | **Empty/error** unless local MCP running | MCP server + bootstrap key |
| E8 discoverability docs | Fallback static when MCP offline | MCP `build:docs` output |
| E8 call-probe | **Empty/error** unless MCP admin reachable | MCP + auth |
| Hydrology manifest | **Populated** — `?report=hydrology` drives layer set | — |
| Header-dock | **Populated** — UI state machine | — |

---

## Blockers / handoff

| Blocker | Owner | Unblocks |
|---|---|---|
| Gate `atom-export` tool | cc-agent-M (Track C) | Inspector `source: gate` instead of `assembled` |
| Signed history on live atoms | cc-agent-E + conformance backfill | Verify-chain pass on real data |
| cortex-api wire manifest on report runs | reporting function package | `parseReportLayerManifest` from live brief/hydrology runs |
| MCP introspection auth for admin routes | operator / cc-agent-M | E8 live catalog + harness |

---

## Explicitly not built (phase 1 scope)

- Agent-operator onboarding / key issuance (phase 3)
- Metering-to-payment wire (phase 3)
- New product surfaces or calibrated-spine build waves (frozen per audit sequence)
