---
id: 2026-07-25_f1a_console_audit
title: F1a — Command Center console audit, CC↔PE drift map, wiring map
status: audit
date: 2026-07-25
applies_to: hauska-map/apps/command-center, hauska-map/apps/property-explorer
implements: [27a_jurisdiction_factory_engine_spec, 27b_f1_command_center_completion_program]
wdll_items: [2]
owner: nick
related: [2026-07-25_GATE_B_checkin_f1a_console_audit, 2026-07-25_GATE_A_checkin_f1_phase0_retrieval_restore]
---

# F1a — Console audit (READ-ONLY)

Frozen inputs: Gate A live restore (`retrieval 00016-ttp`, WDLL 1 MET); operator visual-QA trio (stale stamp / site-plan id / not-verified). No wiring code in this deliverable.

Live PE base: `https://property-explorer-xi.vercel.app`  
Live CC base: `https://cmdcenter-blush.vercel.app`  
Badge rendering: `NavRail.tsx` — hand-set from `PanelDef.live` / `PanelDef.stub` in `PanelRegistry.ts` (not computed; F1c owed).

## 1a.1 Per-panel badge-vs-reality

Source of badge claim: `apps/command-center/src/admin/control/center/PanelRegistry.ts`. Reality = code wiring + live probe where reachable this session.

| Group | Panel id | Badge (hand-set) | Declared / actual target | Reality grade | Evidence |
|---|---|---|---|---|---|
| Workspace | plan-review | LIVE | Cortex workspace space (tiles) | **claims-LIVE — workspace shell**; tile backends vary | Space component; not re-probed tile-by-tile this session |
| Workspace | site-analysis | LIVE | Cortex workspace (Dataroom slot = F1b PE layout source) | **claims-LIVE — shell** | Same |
| Workspace | property-intel | LIVE | Cortex workspace | **claims-LIVE — shell** | Same |
| Workspace | design-accelerator | LIVE | Cortex workspace | **claims-LIVE — shell** | Same |
| Workspace | lens-reviewer / investor / architect | LIVE | Persona lens over workspace | **claims-LIVE — shell** | Registry |
| Substrate | **node-graph** | **STUB** | `retrieval-api /atoms/trace/:did` graph traversal (uncapped) | **genuine-STUB** | `makeStub(...)` in PanelRegistry L65–66 |
| Substrate | atom-inspector | LIVE | MCP `search_atoms` | **real-LIVE (code)** | AtomInspector calls `mcp.callTool('search_atoms')` |
| Substrate | parcel-trace | LIVE | cortex geocode + place atoms + retrieval `/atoms/trace/:did` | **real-LIVE (code)**; shares Node&Graph's declared retrieval target for the click-through leg | ParcelTrace.tsx L101–165 |
| Substrate | mcp-inspector | LIVE | MCP admin introspection + live call probe | **claims-LIVE**; admin introspection paths 404'd from this session's guessed URLs — treat as **unverified-live** until operator opens panel | CC `/api/.../introspection/tools` → 404 (wrong path guess) |
| Substrate | layer-registry | LIVE | GIS layer registry | **claims-LIVE (code)** | LayerRegistryView |
| Substrate | calibration | LIVE | Calibration tracker (honest-empty allowed) | **claims-LIVE — honest-empty** | CalibrationTracker header comment |
| Substrate | lineage-audit | STUB | retrieval-api atom lineage / supersession | **genuine-STUB** | Registry |
| Engines | resolver | STUB | place/resolve + node resolution | **genuine-STUB** | Registry |
| Engines | engine-console | STUB | engine action-atom log | **genuine-STUB** | Registry |
| Engines | run-monitor | LIVE | report_run / runs API | **claims-LIVE (code)** | RunMonitor |
| Engines | agent-view | LIVE | agent surface preview | **claims-LIVE (code)** | AgentView |
| Governance | surface-gate | LIVE | gate / product matrix | **claims-LIVE (code)** | SurfaceGateInspector |
| Governance | revenue-meter | LIVE | metering / revenue | **claims-LIVE (code)** | RevenueMeter |
| Governance | settings | LIVE | local settings | **real-LIVE (local)** | Settings |
| Governance | license-access | STUB | accessPolicy ∩ license | **genuine-STUB** | Registry |

**Load-bearing observation for F1c:** every LIVE/STUB pill is a registry constant (`NavRail.tsx`: `panel.stub ? stub : panel.live ? live`). A panel whose backend is down still shows LIVE. That is the OOM-class failure mode applied to the console itself — mechanical badge is F1c, not F1a.

**Node & Graph vs Parcel Trace:** Parcel Trace already calls retrieval `/atoms/trace/:did` on atom click. Node & Graph STUB declares the same target for an uncapped ledger/graph organism. F1b wires Node & Graph as the balance-sheet ledger; Parcel Trace remains the place→atoms→trace workflow (do not delete; de-dupe the shared trace client).

## 1a.2 CC ↔ PE drift map

### Shared (one substrate already)

| Piece | Shared? | Notes |
|---|---|---|
| Map renderer package | YES | Both apps depend on `@hauska/map-renderer` workspace |
| Retrieval atom-chain | YES (PE) | PE BFF `/api/spine/property-atoms/:id/facets` → retrieval when `PROPERTY_ATOM_PATH=1` |
| Parcel node id shape | PARTIAL | PE facets accept `fips:propId`; MCP site-plan regex is digits-only (`\d+`) — G6 drift |

### Forks / duplicates / disagreements

| Topic | CC | PE | Drift |
|---|---|---|---|
| Product audience | Internal operator console (engines, governance, stubs) | Customer-facing browse+inspect | Correct two-products guardrail — do NOT collapse |
| Inspect surface | Workspace tiles + Parcel Trace | InspectCard (baked/atom-chain facets) | PE built a customer inspect; CC has no shared InspectCard component |
| Node ledger | Node & Graph STUB | none (no ledger panel) | F1b: shared ledger component; PE gets Map\|Ledger customer-safe layout |
| Atom read path | MCP `search_atoms` + retrieval trace (Parcel Trace) | retrieval `property-nodes/:id/atom-chain` via spine BFF | Two read paths for "what is on this parcel" — property chain vs code search. Property ledger must standardize on parcel-node atom-chain + StoragePort tallies |
| Provenance stamp | n/a | "Verified · gate-passed · {bakedAt}" | Bake date misread as read-path freshness (QA-1) |
| Honest absence vocab | State Legend (operator) | "not verified here" on any absent CardFacet | PE over-uses "not verified" for missing % / land-use even when zoning+setbacks live (QA-3) |
| Site-plan / terrain export | optional CC tile not built | InspectCard SitePlanExportSection + TerrainExportSection | PE-only paid export UX; MCP id-flow bug (QA-2) |
| Map tiles / layers | LiveMapTile + cortex layers | ExplorerMap + baked layers | Separate map shells; shared renderer package underneath |

### Named read-path forks (G6 / one-substrate)

1. **Property parcel facts (PE):** `GET /api/spine/property-atoms/:parcelNodeId/facets` → retrieval atom-chain (live confirmed `X-PE-Read-Path: atom-chain`).
2. **Code / catalog atoms (CC Atoms):** MCP `search_atoms` → retrieval search.
3. **Graph traversal (CC Parcel Trace today; Node & Graph target):** `GET {retrieval}/atoms/trace/:did`.
4. **Site-plan export (PE):** BFF → MCP `refresh_parcel_site_plan_export` → engine-api `site-plan-export/*` (id re-stitched in MCP `data`; mapper can false-fail).

F1b consolidation target: one parcel-node read module used by CC ledger, CC map lock, and PE inspect — atom-chain + live tally SELECTs. MCP/search remains for code catalog, not a second parcel fact path.

## 1a.3 Wiring map (input to F1b/c — no code yet)

### STUB → LIVE

| STUB | Needs to go LIVE | Merge / fold |
|---|---|---|
| **Node & Graph** | Live StoragePort tally (counts, present vs honest-absent, references) + node list + graph + inspect + click-to-lock; declared `/atoms/trace/:did` for edges; property-native cockpit shape | Reuse Parcel Trace's retrieval trace client; do not invent a second tracer. Ledger tallies = Gate A SELECT shape (G1) |
| Lineage & Audit | retrieval lineage / supersession API | After Node & Graph; may hang off same DID |
| Resolver | place/resolve + canonical node-id | Align with PE lookup / deep-link `parcelNodeId` (G6) |
| Autonomous Engines | engine action log | Post-F1 supply-engines program — keep STUB through F1 |
| License & Access | accessPolicy ∩ license UI | Governance; after F1c badge discipline |

### PE-leg → shared component library

| PE piece | Fold into | Constraint |
|---|---|---|
| InspectCard facet rows + atom-chain adapter | shared `Inspect` / facet model in `hauska-map` packages | PE remains customer-safe (no engines/governance). Fix "not verified" vs honest-zero / missing-geometry vocabulary in F1b |
| ExplorerMap subject lock on `parcelNodeId` | shared map lock API already partly in map-renderer | Bidirectional binding with Node & Graph (WDLL 4) |
| Site-plan / terrain export sections | stay PE (customer paid) OR shared export chrome | Fix id-flow with site-plan agent (QA-2); CC optional tile later |
| "gate-passed · date" stamp | shared provenance component | Show atom bake time AND read-path/revision separately (QA-1) |

### Dogfood guardrails to build alongside F1b (not after)

| Guardrail | Early build |
|---|---|
| G-smoke (WDLL 8) | Click N named parcels through live ledger AND map; assert zoning/setbacks render; goes red when data unavailable |
| G-coverage (WDLL 9) | CC surfaces Gate A live tally only |
| G-id (G6) | CI asserts MCP / PE / retrieval / contract parcel-id regexes identical |
| Mechanical badge (F1c) | Panel LIVE iff health probe of its declared target succeeds |

### Explicit non-goals this audit

- No F1b wiring.
- No supply engines.
- No collapsing PE into CC.
- Site-plan agent owns the MCP/BFF id-flow fix; F1a only maps the seam.

## Operator visual-QA trio (folded — detail in Gate B check-in)

| # | Named parcel | Verdict |
|---|---|---|
| QA-1 stale stamp | `48453:1000032`, `48209:156346` | Live atom-chain; stamp is bake `fetchedAt`, not stale cache |
| QA-2 site-plan id | `48029:105129` (export path) | Mapper + `callMcpTool` isError drop + engine omits top-level id; G6 regex drift |
| QA-3 not verified | `48021:34169` (P-3), `48453:1000032` (SF-2) | App reads live zoning+setbacks; Buildable/"not verified" is vocabulary bug when `buildableAreaPct` absent / persona ignores present setbacks |

## Grade — WDLL 2

| Item | Grade | Evidence |
|---|---|---|
| 2. F1a console audit committed | **MET** (pending operator Gate B review) | This doc + Gate B check-in; no F1b code merged |
