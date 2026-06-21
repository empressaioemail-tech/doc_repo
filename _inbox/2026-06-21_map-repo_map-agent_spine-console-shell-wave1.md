---
date: 2026-06-21
agent: map-agent
repo: hauska-map
branch: main (local init, not pushed)
task: Wave 1 — spine console shell (End-state E) + V1 renderer + V2 window manager
status: complete — localhost verified
related:
  - _calibrated_spine_roadmap/endstate_E_spine_console.md
  - _calibrated_spine_roadmap/endstate_C_white_label_map.md
  - _calibrated_spine_roadmap/06_agent_execution_model.md
---

# Close — map-agent spine console Wave 1

Created dedicated map repo at `P:\hauska-map` (did not exist; execution model lane was unprovisioned). Ported render stack from `hauska-brief-extension` and stood up the all-white function-only spine console on localhost.

## What was built

| Unit | Deliverable |
|---|---|
| **V1** | `src/renderer/map-renderer.js` — decoupled MapLibre renderer with four-signal contract |
| **V2** | `src/window-manager/floating-window.js` — FSM: floating, snapped, minimized, maximized, closed; drag, edge-snap, resize handle, hover chrome; view state preserved across transitions |
| **E layout** | Left files rail, right styling legend rail, center panel tabs (E1–E7), floating map over everything |
| **E1** | MCP inspector panel — lists tools when MCP reachable |
| **E2** | Atom browser — lists atoms when dossier/MCP returns data |
| **E3** | Layer registry view — static Wave 1 registry + optional backend `GET /map-data/gis-layers` |
| **E4** | Calibration tracker — honest empty (warming not built Wave 1) |
| **E5** | Run monitor — honest empty (W1–W5 not running) |
| **E6** | Floating map host wired to V1 + V2 |
| **E7** | Parcel drill-through + cross-reference atom trace UI (click parcel → properties → trace links) |

Map libs ported verbatim from extension: `gis-fixture-data.js`, `gis-map-render.js`, `gis-map-paint.js`, `gis-terrain.js`, `gis-hydrology-flow.js`, `hauska-map-style.js` (light Carto basemap for console context).

## Localhost run command

```powershell
cd P:\hauska-map
npm install
npm run dev
```

Open **http://localhost:5173/**

Build also verified:

```text
> vite build
✓ 28 modules transformed.
✓ built in 2.01s
```

Query params: `?fixture=0` (live GIS attempt), `?api=<cortex-api>`, `?mcp=<mcp-url>`.

## Screenshot / render description

Verified in Cursor browser MCP at http://localhost:5173/ (2026-06-21):

- All-white console chrome: top tab bar (E7/E1–E5), left artifact rail, right styling legend, dashed empty states in center panels.
- **E6 floating map** over the layout showing Bastrop fixture mesh: Carto light basemap, tessellated parcel choropleth (green grid), FEMA band, rent-heat fire glow at center, MapLibre nav controls.
- Window chrome: float / snap / minimize / maximize / close buttons on title bar; maximize expands map to viewport margins while preserving center/zoom.

Operator can drag title bar, resize from corner handle, snap to right edge within 24px threshold.

## V1 renderer — four-signal contract surface

Documented in `RENDERER_CONTRACT` (`src/renderer/map-renderer.js`):

| Signal | Method | Purpose |
|---|---|---|
| 1 mount | `mount(slot: HTMLElement)` | Attach MapLibre canvas to a content slot; renderer knows nothing about windows |
| 2 resize | `resize()` | Propagate container dimension change to MapLibre |
| 3 layer visibility | `setLayerVisibility(visible: Set<string>)` | Toggle which registry layer keys render |
| 4 context binding | `bindContext(ctx)` | Bind `{ center, address, useFixture, onParcelSelect }`; emits parcel selection to E7 |

Additional helpers (not part of thin contract): `getViewState()`, `setViewState()`, `getSlots()`, `destroy()`.

View state preserved: `center`, `zoom`, `pitch`, `bearing` captured before every window FSM transition and restored after.

## Current layer registry list

From `src/renderer/layer-registry.js` (22 keys; Wave 2 keys marked `wave2: true`):

`parcel-polygon`, `parcel-extrusion`, `zoning`, `flood-zone`, `floodway`, `dem-hillshade`, `topography-contours`, `hydrology-flow`, `buildable-envelope`, `constraint-density`, `oz-deal-crossfilter`, `motivated-seller`, `ssurgo-soils`, `groundwater`, `mud-pid`, `edwards-aquifer`, `texas-rrc`, `opportunity-zone-tract`, `rent-heat`, `etj` (pending), `calibrated-accuracy` (Wave 2), `contested-ground` (Wave 2), `triage-state` (Wave 2).

**Wave 1 default visible:** parcel-polygon, flood-zone, dem-hillshade, topography-contours, hydrology-flow, rent-heat, zoning.

## Data populated vs empty (by API)

| Surface | API path | Result this session | Source |
|---|---|---|---|
| Map GIS layers | Fixture (`getGisFixtureSlots`) | **Populated** — 192-parcel Bastrop mesh, FEMA, rent-heat, hillshade, contours, flow | Local fixture (Wave 1 default) |
| Parcel resolve | `resolveParcel()` → fixture | **ok** — 192 fixture parcels | `src/map/gis-fixture-data.js` |
| Parcel resolve live | `POST cortex-api/.../map-data/gis-layer` | Not exercised (fixture=1 default) | cc-agent-C |
| E1 MCP tools | `GET MCP tools/list` @ `http://127.0.0.1:3000/mcp` | **empty/error** — `Failed to fetch` (MCP not running locally) | cc-agent-M expose pending |
| E2 atoms | `GET /place/:placeKey/dossier` + `MCP cortex_retrieve_atoms` | **empty** — no auth key; MCP offline | cc-agent-C + cc-agent-M |
| E2 cross-ref trace | `MCP cortex_get_atom` + `GET /atoms/:id` | **empty** — traversal API not reachable; UI shows explicit message | cc-agent-C Wave 1 expose |
| E3 backend catalog | `GET /api/brokerage/v1/map-data/gis-layers` | **error** — `Valid Authorization Bearer or X-Hauska-Key required` | cortex-api (auth required) |
| E3 local registry | `LAYER_REGISTRY` | **Populated** — 22 layer rows with status pills | map-agent local |
| E4 calibration | `fetchCalibrationState()` | **honest empty** — provenance counts all 0 | Wave 2 (W + F4 + K6) |
| E5 run monitor | `fetchRunMonitor()` | **honest empty** — parcels warmed 0 | Wave 2 (W1–W5) |
| E7 parcel click | fixture parcel feature properties | **Populated** on click — assessor fields, scalar confidence only | fixture envelope |
| E7 atom trace | atoms API | **empty** until MCP/C dossier live | blocked on parallel agents |

No silent stubs: every empty panel renders dashed border + explicit reason string.

## Contradictions vs `03_gap_analysis.md`

| Gap row | Hypothesis | Ground truth this build |
|---|---|---|
| V map | "floating viewer and decoupled renderer is Chris's new design" | **Partially contradicted:** V1/V2 function built without Chris; light basemap in console vs extension dark dataviz is intentional Wave 1 operator shell |
| V map | "registry and per-app allocation absent" | **Confirmed** — static registry only; no per-app allocation (Wave 2 V3) |
| E spine console | "NEW — net-new operator console" | **Resolved for shell** — console exists at localhost; calibration tracker and MCP/atom panels empty until F4/W/MCP expose land |
| F4 read-contract | "confidence is a scalar" | **Confirmed on map click** — fixture envelope exposes scalar confidence; E7 labels it "F4 read-contract pending" |
| Gap: "Map localhost app exists" | Implied extension verify page | **Clarified:** dedicated `hauska-map` repo now owns localhost console; extension map remains embedded in Brief |

## Extension handoff note

Map render stack source of truth remains `P:\hauska-brief-extension` (`site-map.js`, `gis-map-render.js`, etc. on branch `map/track123-visual-ceiling` @ v0.6.32 tip). This repo copies the lib layer for decoupling; extension agent should continue handoff via `_inbox/` with EngineEnvelope slot shapes. Console uses light `HAUSKA_MAP_STYLE` instead of extension dark `HAUSKA_GIS_BASE_STYLE` — styling divergence is intentional for all-white E shell.

## Proposed Wave 2 task list (map-agent lane)

| Task | Work | Depends on | Blockers |
|---|---|---|---|
| **V3** | Dynamic layer registry + per-app allocation config (Cortex / Brief / Radar / SmartCity YAML) | V1 | None — can start after Wave 1 merge |
| **V4** | EngineEnvelope read-contract consumption on every layer (width-as-saturation plumbing) | F4 (cc-agent-AC + propagation) | F4 long pole |
| **V5** | Reasoning layers: consequence choropleth, contested-ground, triage state | F2, F4, F5, V3 | F2 consequence metadata, F5 conflict log |
| **V8** | Vintage-decay rendering + time slider | F7, F8 | Engine hazard signal |
| **V9** | Positioning fix in map footer | none | Can land anytime |
| **E4/E5 live** | Wire calibration tracker + run monitor to W warming read APIs | W1–W3, K6 | cc-agent-C warming harness |
| **E7 depth** | Unlimited cross-ref traversal against cc-agent-C atoms-for-parcel API | C expose + F4 | Atoms API + read-contract type |
| **E1 live** | MCP introspection against cc-agent-M 46-tool surface with product gating display | cc-agent-M | Local MCP or prod endpoint + key |
| **Live GIS cutover** | `?fixture=0` path with auth key UI, viewport mesh loader ported from extension `gis-proxy-api.js` | Cotality/cache path stable | Tier auth + cache (PR #197 deploy) |

**Explicitly not Wave 2 map-agent:** V6 calibrated-accuracy layer, V7 development-pulse (fuel-gated; wait M1 + X3).

## Git state

Local repo initialized at `P:\hauska-map`. Not pushed — no remote configured yet. Recommend `empressaioemail-tech/hauska-map` GitHub repo creation on operator go.

## Verified commands (verbatim)

```text
P:\hauska-map> npm install
added 40 packages, and audited 41 packages in 4s

P:\hauska-map> npm run build
vite v6.4.3 building for production...
✓ 28 modules transformed.
✓ built in 2.01s

P:\hauska-map> npm run dev
VITE v6.4.3  ready in 345 ms
➜  Local:   http://localhost:5173/
```

Browser MCP: page loaded, map tiles + fixture choropleth rendered, E1 MCP panel showed `Failed to fetch` for 127.0.0.1:3000, E3 backend catalog showed auth error (expected without key).
