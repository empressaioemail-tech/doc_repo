---
date: 2026-06-21
agent: map-agent
repo: hauska-map
branch: main
task: Wave 2 — V3/V4/V5 + live console wiring + V9 positioning
status: complete — build verified
related:
  - _calibrated_spine_roadmap/endstate_C_white_label_map.md
  - _calibrated_spine_roadmap/endstate_E_spine_console.md
  - _calibrated_spine_roadmap/04_task_roadmap.md
  - _inbox/2026-06-21_cortex_cc-agent-R_wave1-f4-reach-and-embed-mount.md
  - _inbox/2026-06-21_hauska-atom-contract_cc-agent-AC_wave1-read-contract-type.md
---

# Close — map-agent Wave 2 (hauska-map)

Wave 2 lands V3 dynamic registry + per-app allocation, V4 read-contract consumption (atom-contract@1.4.0 mirror), V5 reasoning layer rendering (input-gated), live E1/E7 wiring, auth-key entry, and V9 positioning fix. **Explicitly not built:** V6 calibrated-accuracy, V7 development-pulse, Cortex Leaflet migration (Decision 4).

## Run

```powershell
cd P:\hauska-map
npm install
npm run dev
```

Open http://localhost:5173/

Query params:

| Param | Purpose |
|---|---|
| `?fixture=0` | Live GIS + atoms (requires Hauska key in top bar) |
| `?api=<cortex-api>` | Override cortex-api base |
| `?mcp=http://127.0.0.1:3000/mcp` | MCP URL (admin introspection = strip `/mcp`) |
| `?retrieval=http://127.0.0.1:8080` | cc-agent-E retrieval-api for atom trace |
| `?app=cortex&report=property-brief` | V3 allocation context |

**Auth:** top-bar **Hauska key** → `localStorage` → `X-Hauska-Key` + `Authorization: Bearer` on cortex-api and MCP admin routes.

Build verified:

```text
> hauska-map@0.2.0-wave2 build
✓ 34 modules transformed.
✓ built in 2.25s
```

---

## V3 — Dynamic layer registry + allocation schema

### Registry (`src/renderer/layer-registry.js`)

26 layer keys (was 22). New / updated:

| key | group | input gate | Wave 2 status |
|---|---|---|---|
| `consequence-choropleth` | reasoning | F2 | rendering built |
| `contested-ground` | calibration | F5 | rendering built |
| `triage-state` | calibration | F2+F4 | rendering built |
| `calibrated-accuracy` | calibration | M1+X | **fuel-gated — not built** |
| `development-pulse` | investor | X3 | **fuel-gated — not built** |

`layerStatusForGates(gates, key)` → `live` | `awaiting-input` | `fuel-gated` | `fixture` | `pending` | `no-data`.

### Allocation resolver (`src/renderer/layer-allocation.js`)

```typescript
resolveLayerAllocation({
  appId: "cortex" | "radar" | "brief" | "smartcity-os" | "codex-reviewer",
  reportType: ReportType,
  tier?: "free" | "pro" | "max",
  allocationKey?: string,  // default `${appId}:${reportType}`
}): LayerAllocation
```

**LayerAllocation shape:**

```typescript
interface LayerAllocation {
  visibleLayers: string[];   // subset of registry keys
  defaultOn: string[];       // initial setLayerVisibility
  fuelGated: string[];       // stripped from defaultOn on free tier
  reasoningOverlays: {
    contestedGround?: boolean;
    triage?: boolean;
    consequenceChoropleth?: boolean;
  };
  layout: { aspectRatio: "16/9" | "4/3" | "auto"; minHeightPx: number };
  allocationKey?: string;
}
```

**Seeded allocation keys (12)** — from cc-agent-R §5 binding table:

| allocationKey | defaultOn highlights | reasoning overlays |
|---|---|---|
| `cortex:property-brief` | parcel, flood, consequence, triage | all three |
| `cortex:site-context` | flood, contours, parcel | — |
| `cortex:hydrology` | D8 flow, flood, contours, contested | contested |
| `cortex:codex-plan-review` | site locator, zoning | — |
| `cortex:cortex-deliverable-site-bound` | flood, parcel | — |
| `radar:radar-baseline` | rent-heat | — |
| `radar:property-brief` | parcel, flood | — |
| `brief:property-brief` | parcel, flood, consequence | all three |
| `brief:site-context` | flood, parcel | — |
| `brief:hydrology` | D8, flood | contested |
| `smartcity-os:property-brief` | parcel, flood, zoning | — |
| `smartcity-os:site-context` | flood, parcel | — |
| `smartcity-os:hydrology` | D8, flood | contested |

Spine console default context: `cortex:property-brief` @ `pro` tier.

---

## V4 — Read-contract consumption (atom-contract@1.4.0)

Local mirror: `src/read-contract/index.js` (pin to `@hauska/atom-contract/read-contract` when npm 1.4.0 publishes).

| Rule | Implementation |
|---|---|
| Widthed object required | `isWidthedConfidence` — estimate + n + intervalWidth + provenance |
| ReadContract on envelope | `extractEnvelopeReadContract(envelope)` |
| Scalar-only unrenderable | `isRenderableEnvelope` → false for `{ value, kind }` legacy; `upsertGisLayer` skips fill |
| Width-as-saturation | `saturationFromIntervalWidth(w)` → `fill-opacity *= saturation` per slot envelope |
| No bare scalar in UI | E2/E7 use `formatReadContractSummary` / `formatAtomReadContract` |

All fixture GIS slots upgraded from scalar `confidence: { value, kind }` to full `readContract` objects.

---

## V5 — Reasoning layers: live vs awaiting input

| Layer | Rendering | Fixture demo | Live gate | Awaiting |
|---|---|---|---|---|
| **consequence-choropleth** | ✅ ASCE/IBC stratum fill | ✅ 192-parcel mesh | F2 typed fields on atoms | cc-agent-E F2 enrichment (zero typed fields on corpus today) |
| **contested-ground** | ✅ D8-vs-FEMA disagreement polygon | ✅ headline band | F5 raw-conflict log | cc-agent-C F5 append-only conflict log |
| **triage-state** | ✅ verify / human-required parcels | ✅ thin-width × high-consequence flags | F2 + widthed read-contract on parcel slots | F2 for consequence stratum; live parcel slots need cortex-api ReadContract emission (W2-2) |

**Gate probe** (`src/lib/input-gates.js`):

- `fixture=1` → F2+F5 gates **live** (synthetic demo — layers visible)
- `fixture=0` → gates flip **live** when `GET /place/:key/atoms` returns consequence facets or conflict log
- Layers auto-add/remove from `visibleLayers` via `reasoningLayerLive(key, gates)`

**Not built (per dispatch):** V6 calibrated-accuracy, V7 development-pulse — registry entries marked fuel-gated only.

---

## E1 / E7 — Live data wiring

### E1 MCP inspector

- **Primary:** `GET {mcpAdminBase}/admin/introspection/tools` (M Wave 1 surface)
- Badge shows **live tool count** from response — not pinned to 46/57
- Columns: tool name, description, **product**, **gate_summary**
- Fallback: MCP JSON-RPC `tools/list` if admin route unreachable

### E7 Atom trace (end-to-end chain)

```
POST /api/brokerage/v1/place/resolve
  → placeKey
GET  /api/brokerage/v1/place/:placeKey/atoms   (uncapped — Decision 6, cc-agent-C Wave 2)
  → atomDid list + optional conflict log (F5 probe)
GET  {retrievalApiUrl}/atoms/trace/:did         (cc-agent-E Wave 1)
  → contextSummary, provenance, citations, inbound/outbound graph
  → traverseAtomGraph() walks edges (500 node safety cap in code; operator surface uncapped by design)
```

Parcel click → E7 panel → atom list → click atom → full trace tree in `#xref-tree`.

### Auth-key entry

Top bar: password input + Save + fixture toggle. Key persisted in `localStorage` (`hauska-spine-console-config`). Save with new key sets `useFixture: false`.

---

## V9 — Positioning fix

Replaced calibrated-source framing everywhere surfaced:

| Surface | Copy |
|---|---|
| Page footer | "Shows its work — provenance, citation, and audit on every output. Built to earn calibration where outcome signal exists." |
| Top tag | "Not the one calibrated source. The surface that shows its work." |
| Legend rail | Read-contract + scalar-unrenderable note |
| Map float legend note | Same footer line (via `POSITIONING_FOOTER`) |

Source: `src/copy/positioning.js` + architecture addendum launch language.

---

## Data populated vs empty (this session)

| Surface | API | Result | Blocker if empty |
|---|---|---|---|
| Map fixture | `getGisFixtureSlots` | **Populated** — 192 parcels + 3 reasoning layers | — |
| Map live | `POST map-data/gis-layer` | Not exercised | Auth key + fixture=0 |
| E1 introspection | `GET /admin/introspection/tools` | **Empty/error** unless local MCP + key | MCP not running |
| E2/E7 atoms | `GET /place/:key/atoms` | **Empty** without key / route deploy | cc-agent-C Wave 2 route + auth |
| E7 trace | `GET /atoms/trace/:did` | **Empty** unless retrieval-api @ :8080 | cc-agent-E local dev |
| E3 backend catalog | `GET /map-data/gis-layers` | Auth required | Hauska key |
| E4/E5 | — | Honest empty (W not running) | W1–W5 |
| Reasoning layers live | F2/F5 probes | **Live in fixture**; **awaiting in live** | E F2 + C F5 |

---

## Files touched (Wave 2)

| Path | Change |
|---|---|
| `src/read-contract/index.js` | **new** — V4 mirror |
| `src/renderer/layer-allocation.js` | **new** — V3 resolver + seed table |
| `src/renderer/layer-registry.js` | V3 dynamic status + reasoning keys |
| `src/map/reasoning-layers.js` | **new** — V5 paint/legend |
| `src/map/gis-fixture-data.js` | readContract envelopes + reasoning fixture slots |
| `src/map/gis-map-render.js` | V4 saturation + unrenderable gate |
| `src/map/gis-map-paint.js` | reasoning layer paints + stack order |
| `src/api/spine-api.js` | introspection, place/atoms, atom trace graph |
| `src/config.js` | retrieval URL, app/report allocation, auth helpers |
| `src/panels/auth-bar.js` | **new** |
| `src/panels/mcp-inspector.js` | E1 introspection |
| `src/panels/parcel-trace.js` | E7 full chain |
| `src/panels/layer-registry-view.js` | allocation + gate columns |
| `src/panels/legend-rail.js` | V5 + V9 |
| `src/copy/positioning.js` | **new** — V9 |
| `src/lib/input-gates.js` | **new** — F2/F5 probes |
| `src/main.js` | Wave 2 shell, auth, gate-driven visibility |
| `src/styles/console.css` | auth bar, footer, awaiting pills |

---

## Blockers for full live (not Wave 2 map-agent)

| Blocker | Owner | Unblocks |
|---|---|---|
| Publish `@hauska/atom-contract@1.4.0` | cc-agent-AC / operator | npm pin vs local mirror |
| `GET /place/:key/atoms` deploy | cc-agent-C | E7 uncapped parcel→atoms |
| cortex-api emits `readContract` on map-data envelopes | cc-agent-C W2-2 | live V4 saturation on GIS layers |
| F2 consequence metadata on corpus atoms | cc-agent-E | live consequence choropleth |
| F5 raw-conflict log | cc-agent-C | live contested-ground |
| MCP + retrieval-api running locally or prod URLs | operator | E1 live count, E7 trace |

---

## Explicitly deferred (confirmed)

- V6 calibrated-accuracy layer (M1 + X)
- V7 development-pulse (X3)
- V8 vintage-decay
- Cortex Leaflet → shared V1 renderer (Decision 4)
- E4/E5 live warming metrics (W1–W5)

---

## Handoff

- cc-agent-R: import `resolveLayerAllocation` from `hauska-map` (or extracted `@workspace/map-registry`) for R1-impl embed hosts.
- cc-agent-C: when `/place/:key/atoms` lands, console already calls it; no map-agent change required beyond auth.
- cc-agent-M: E1 reads `/admin/introspection/tools` — tool count tracks M's live surface automatically.
