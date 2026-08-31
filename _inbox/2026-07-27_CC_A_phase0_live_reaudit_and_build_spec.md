---
id: 2026-07-27_CC_A_phase0_live_reaudit_and_build_spec
title: CC-A Phase 0 — live re-audit gap list + builder unit plan (Control-Tower parity)
status: checkin
date: 2026-07-27
applies_to: hauska-map/apps/command-center, hauska-engine/services/retrieval-api
implements: [27a_jurisdiction_factory_engine_spec]
wdll: 2026-07-27_CC_A_legible_node_atom_flow_WDLL
owner: nick
related: [2026-07-25_f1a_console_audit, 2026-07-25_GATE_F1c_checkin_mechanical_honesty]
---

# CC-A Phase 0 — live re-audit (planner, read-only)

**Verdict:** F1a is STALE. Node & Graph is **tally LIVE** with present/absent
pills and a raw JSON blob. It is **not** Control-Tower-legible. Boundary-edge
and road nodes exist on the substrate but cannot be traversed from a parcel
card. Parcel Trace + Revenue Meter badges correctly show **DEGRADED** (probe
failures); Parcel Trace geocode still works. Map is still the old CC shell
(CARTO/OSM), not PE's layered map. **Do not build on F1a.**

WDLL draft (needs operator go before builders ship code):
`_inbox/2026-07-27_CC_A_legible_node_atom_flow_WDLL.md`.

Live bases: `https://cmdcenter-blush.vercel.app` · PE
`https://property-explorer-xi.vercel.app` · Control Tower reference =
source at `Empressa Trading/.../NodeGraphBrowser.tsx` (live URL Clerk-gated;
planner could not click through without auth).

Gold parcels used: `48021:33512` (depth-warm), `48021:28286` (boundary-primitive
gold), `48021:34785`.

---

## 1. Live badge board (2026-07-27T12:42Z)

| Panel | Live badge | Reality (this session) |
|---|---|---|
| Workspace (Plan Review… Architect) | LIVE | Shell LIVE; not re-probed tile-by-tile |
| **Node & Graph** | **LIVE** | Tally LIVE via `GET /stats/central-tx-node-graph`; inspect works for parcel + road ids; **organism incomplete** (see gaps) |
| Atoms | LIVE | MCP `search_atoms` **code catalog** only (entity types: code-section…). Confidence object present. **Not** property-node inspector; ignores `node=` for property chain |
| **Parcel Trace** | **DEGRADED** | Geocode WORKS (1101 Colorado → placeKey + honest-0 atoms). Badge DEGRADED because probe `retrieval-healthz` → BFF `/api/spine/retrieval/healthz/` **404**. Direct `/health` via BFF **200** |
| MCP Tools / GIS Layers | LIVE | Badges LIVE; not deep-probed |
| Calibration / Lineage / Resolver / Engines / License | STUB | Honest stubs (unchanged) |
| Runs / Agent Surface / Surface & Gate / Settings | LIVE | Not deep-probed |
| **Revenue Meter** | **DEGRADED** | BFF `/api/spine/mcp-metering/summary` **403**. Proxy contract notes platform_internal key required |

Badge system itself is still mechanical (`usePanelHealth` / `derivePanelBadge`) —
F1c held. The two DEGRADED badges are **correct about their probes**, not hand-set
lies. Cleanup = fix probes / backends so LIVE means usable, or keep honest DEGRADED
with operator-readable reason in-panel.

---

## 2. Node & Graph — what it actually does today

### Works

- **Tally LIVE.** Source line: `live GET /stats/central-tx-node-graph
  (2026-07-27T12:42:59.844Z)`. Bastrop row visible: nodes 62,257; zoning+ 5,769;
  setback/envelope 5,729; depth columns present.
- **Hash binding.** Inspect `48021:33512` → URL
  `#panel=node-graph&node=48021%3A33512`. Locked chip appears.
- **Slot pills.** Gold Bastrop: `zoning-fact: PRESENT`, `setback-rule: PRESENT`,
  `buildable-envelope: PRESENT`.
- **Road inspect path (code).** `fetchRoadAtomChain` + sampleNamed buttons;
  live GET `…/road-nodes/48021:road:123456789/atom-chain` **200** with ROW
  approximate-assumed-per-class.
- **Lock on map** button (ledger → Site Analysis).

### Does NOT work (parity gaps)

| Spec item | Live observation |
|---|---|
| Structured node card | **ABSENT.** Only id input + 3 pills + `<pre>` JSON |
| Atoms by family | **ABSENT.** One "Atom chain (shared client)" JSON dump |
| Atom inspector from node | **ABSENT.** Atoms panel is code search; navigating there keeps `node=` but does not open property atoms |
| Edges OUT/IN | **ABSENT.** No edge list; no click-through |
| Node→node traversal | **ABSENT.** Dead-end after inspect |
| Back-nav `return=` | **ABSENT** in CC (Control Tower has it; CC AtomInspector only "← back to results") |
| Boundary-edge inspect | **BLOCKED.** StoragePort `listBoundaryEdgesByParcelNodeId` exists; **no HTTP route**. Live probes: `/property-nodes/48021:28286/boundary-edges` **404**, `/edges` **404**. Atom-chain keys for gold parcels: `atoms, buildableEnvelope, parcelNodeId, setbackRule, zoningFact` only — **zero** boundary/road edge refs in body (`boundaryishHits=0`) |

### Atom-chain live sample (verbatim keys)

```
GET /api/spine/retrieval/property-nodes/48021:33512/atom-chain → 200
keys: atoms, buildableEnvelope, parcelNodeId, setbackRule, zoningFact
depthWarmPromotion=depth-warm-promoted-v1
```

```
GET …/48021:28286/atom-chain → 200
envelope outcome: {"kind":"buildable","areaSqFt":7316}
(same top-level keys; no boundaryEdges)
```

---

## 3. Parcel Trace / Revenue Meter / Map

**Parcel Trace:** Resolve of `1101 Colorado St, Austin, TX 78701` →
`placeKey: coord:30.27333:-97.74277` + honest "no atoms composed" (not an error).
Panel copy still says "deployed command-center has no interactive map" —
**stale** (Site Analysis has a map). Root badge fail: probe hits `healthz/`
through BFF → 404; retrieval itself serves `/health` and `/healthz` on Cloud Run.

**Revenue Meter:** Panel probe `mcp-metering` → **403**. Fix = wire
platform_internal key **or** honest in-panel explanation + keep DEGRADED.

**Map (Site Analysis live):** MapLibre controls present; attribution
**MapLibre / OSM / CARTO**; "Fixture layers" checkbox. **Not** PE satellite /
LAYER_REGISTRY layered shell. Both apps import `FloatingMap` from
`@hauska/map-renderer`, but CC `LiveMapTile` and PE `ExplorerMap` are **forked
shells** — the "one shared map" swap is unfinished.

---

## 4. Control Tower reference (what to PORT)

Source (auth-blocked live): `NodeGraphBrowser.tsx`

- Node list → **NodeInspect** card: node_id, type, resolution_status, identifiers,
  **edges_out / edges_in** (clickable), **Atoms by family — click to trace**,
  merge-chain.
- `openAtomInspector` writes `return=node-graph&node=…&atoms=…&return_*=…`.
- `AtomInspector.closeDetail` restores node panel from those params.

CC already borrowed ConfidenceBlock spirit for **code** atoms. Property path
never got the organism. **M0 rule:** builders PORT this shape; re-deriving a
novel UX is an M0-reach miss.

Property atoms are richer (boundary primitive role/adjacency/setback/interior,
reasoningChain, depthWarmPromotion) — inspector must **render** those fields,
not flatten to trading's security fields only.

---

## 5. Gap list = CC-A build spec

1. **Retrieval node-detail + edges API** — expose boundary edges + road/neighbor
   references for parcel/road/boundary node types (StoragePort already has
   `listBoundaryEdgesByParcelNodeId`). Extend or companion to atom-chain.
2. **Node card UI** — port NodeInspect; kill JSON-as-primary.
3. **Traversal** — clickable edges across parcel ↔ boundary-edge ↔ road ↔ neighbor.
4. **Atoms-by-family + property atom inspector** — family groups; rich inspector;
   boundary-edge fields + optional GIS property-line-tags ("not a survey").
5. **Back-nav** — `return=` / `return_*` pattern.
6. **Map swap** — shared PE layered map into CC workspace.
7. **Parcel Trace probe/BFF** — healthz allowlist or probe `/health`; refresh stale copy.
8. **Revenue Meter** — live key **or** honest degraded panel body.

Out of scope: thin engine-control panel; Central-TX expansion (HELD); survey-grade
plat tags.

---

## 6. Builder units (3 — fewer agents, tighter contracts)

| Unit | Scope | WDLL items | Repos | Depends |
|---|---|---|---|---|
| **U1 — Node organism + read APIs** | Retrieval node-detail / boundary-edges / edge refs; CC NodeGraph structured card + edges + traversal; optional GIS property-line-tags attach | 1, 2, 6 (+ tags under 4) | hauska-engine, hauska-map | — |
| **U2 — Atoms-by-family + inspector + back-nav** | Family groups; property-rich AtomInspector (or node-scoped detail); `return=` breadcrumb; boundary-edge inspector fields | 3, 4, 5 | hauska-map (+ retrieval atom GET if missing) | U1 APIs |
| **U3 — Map swap + degraded fixes** | Shared PE map shell in CC; Parcel Trace probe/BFF; Revenue Meter live-or-honest | 7, 8, 9, 10 | hauska-map (± mcp/env for metering) | parallel OK |

Full dispatches with M0 block: `_dispatches/2026-07-27_CC_A_builder_units.md`.

**Gate:** no builder ships until WDLL operator-approved.

---

## 7. Per-unit live grades (Phase 0 baseline — all FAIL / NOT BUILT)

| Unit | Grade | Evidence |
|---|---|---|
| U1 node card + traversal | **NOT MET** | Live `48021:33512`: pills + JSON only; no edges; boundary HTTP 404 |
| U2 inspector + back-nav | **NOT MET** | Atoms = code search; no `return=` restore to node card |
| U3 map + degraded | **NOT MET** | Site Analysis = CARTO/OSM; Parcel Trace DEGRADED (healthz 404); Revenue Meter DEGRADED (403) |

Post-unit grades will be planner live walks on the same gold parcels — never
builder self-grade.

---

## 8. Parity scorecard (Phase 0)

| Capability | Trading CT | Property CC live |
|---|---|---|
| Node card | YES | NO (pills + JSON) |
| Atoms by family | YES | NO |
| Rich atom inspector | YES | PARTIAL (code atoms only; no bitemporal/lineage/time-travel full) |
| Back-nav `return=` | YES | NO |
| Node↔node traversal | YES | NO |
| parcel / road / boundary | n/a (securities) | parcel partial; road inspect API only; **boundary none** |
| Map shared w/ product | n/a | **NO** (forked shells) |
| Degraded panels fixed | n/a | **NO** |

---

## 9. M0 notes (planner-gated)

- **Promote candidate:** "trading-parity port pattern" — cite
  NodeGraphBrowser/AtomInspector as the UX contract; property-native fields
  additive, not a redesign.
- **Promote candidate:** node-type-generic card renderer (parcel/road/boundary
  share chrome; type-specific sections plug in).
- **Flag if builder re-derives:** inventing a new inspect UX instead of porting
  CT sections = M0-reach miss.
- F1a audit stamped **STALE** — superseded by this check-in for CC-A.
