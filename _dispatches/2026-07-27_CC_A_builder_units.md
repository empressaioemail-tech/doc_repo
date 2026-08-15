---
id: 2026-07-27_CC_A_builder_units
title: CC-A builder unit dispatches — Control-Tower parity (APPROVED — builders GO)
status: active
date: 2026-07-27
applies_to: hauska-map, hauska-engine
wdll: 2026-07-27_CC_A_legible_node_atom_flow_WDLL
owner: nick
related: [2026-07-27_CC_A_phase0_live_reaudit_and_build_spec]
---

# CC-A builder units — GO

**WDLL APPROVED 2026-07-27** with Amendments 1–2. Builders fan now.
Planner verifies live on gold parcels; builders never self-grade. CTX HELD.

Phase 0: `_inbox/2026-07-27_CC_A_phase0_live_reaudit_and_build_spec.md`  
WDLL: `_inbox/2026-07-27_CC_A_legible_node_atom_flow_WDLL.md`  
Scratch (read first): `_scratch/depth-engine-27c.md`

---

## M0 RULE BLOCK (embed verbatim in every builder prompt)

```
M0 / fleet memory (mandatory):
1. Read P:\doc_repo\_scratch\depth-engine-27c.md FIRST. Do not re-derive Stage 2 /
   road / boundary lessons from archaeology.
2. Capture LESSON / DEAD-END / GROUND-TRUTH / OPEN to that scratch as you work.
   Timestamp every GROUND-TRUTH. Do not promote to durable docs/tests yourself —
   planner gates promotion.
3. PORT the trading Control Tower organism — do NOT invent a new inspect UX.
   Reference (source of truth):
   P:\Empressa Trading\apps\cockpit\admin\src\control\panels\NodeGraphBrowser.tsx
   P:\Empressa Trading\apps\cockpit\admin\src\control\panels\AtomInspector.tsx
   Re-deriving instead of porting = M0-reach miss; flag it in your close.
4. Property atoms are RICHER than trading's — render boundary role/adjacency/
   setback/interior, reasoningChain, depthWarm*, property-line-tags. Do not
   flatten to security fields.
5. Confidence is NEVER a bare number — always {n, width, basis}.
6. Verification is NOT yours. Ship evidence (URLs, response snippets, PR links).
   Planner clicks live Bastrop gold parcels and grades.
7. Cite WDLL item numbers in the PR body.
8. Negative done-line: no node type left un-inspectable; no JSON blob where an
   inspector belongs; no hand-set LIVE badges; no second map shell fork.
9. Amendment 1: U1 is NOT done at endpoint-200 — graph must be WALKABLE live on
   48021:28286 (parcel↔boundary-edge↔road↔neighbor) through the CC UI.
10. Amendment 2: property-line-tags OPTIONAL in U1; if present, label
    "not a survey" (GIS-approx). Never block core organism for tags. Survey-
    grade out of scope.
```

---

## UNIT 1 — Node organism + read APIs  (FAN NOW)

**WDLL:** 1, 2, 6 (tags optional under 4 / Amendment 2)  
**Repos:** `P:\hauska-engine` (retrieval-api + storage), `P:\hauska-map` (command-center NodeGraph)  
**Branch:** `feat/cc-a-u1-node-organism`

### Contract

1. HTTP read path for edges (today 404). Prefer a node-detail that returns
   `edges_out` / `edges_in` + identifiers + `atom_counts_by_family`, and/or
   `GET /property-nodes/:id/boundary-edges`. Wire StoragePort
   `listBoundaryEdgesByParcelNodeId` — no second store. Boundary-edge and road
   node detail fetchable by canonical id.
2. CC Node & Graph: structured **NodeInspect** port from Control Tower (fields,
   identifiers, edges OUT/IN **clickable**, atoms-by-family counts). JSON
   demoted to optional debug, not primary.
3. **WALKABLE traversal (Amendment 1 done-line):** from live CC, on
   `48021:28286`, operator can: open parcel card → see boundary-edge edges →
   click one → see role/adjacency/setback → traverse to road it fronts →
   traverse to a neighbor parcel. Endpoint-200 without this UI walk = NOT MET.
4. Property-line-tags: **OPTIONAL**. If you attach GIS bearing+distance, mark
   provenance **"not a survey"**. Do not block merge on tags. Survey plats out.
5. Keep tally LIVE path and G6 id regexes. Road inspect continues to work.

### Gold verify set (planner)

- `48021:28286` (boundary-primitive gold — PRE-2: e1→32341, e2→35671 front)
- `48021:33512` (depth-warm)
- Road: live `48021:road:…`

### Close

File executor close under `_inbox/` citing WDLL 1/2/6. Include deploy URLs /
PR links. Do not claim MET — planner live-walks 28286.

---

## UNIT 2 — Atoms-by-family + inspector + back-nav  (FAN after U1 APIs land, or same wave if U1 branch shared)

**WDLL:** 3, 4, 5  
**Repos:** `P:\hauska-map` (command-center); retrieval atom-by-id if missing  
**Branch:** `feat/cc-a-u2-atom-inspector`  
**Depends:** U1 node-detail + walkable edges (can share worktree / stack on U1)

### Contract

1. From node card, atoms grouped by family; click opens inspector.
2. Inspector ports CT detail: claim; ConfidenceBlock; provenance/citation;
   bitemporal; lineage/supersession; LIVE/AS-OF if backend supports; accessPolicy ∩
   license.
3. Boundary-edge inspector: role, adjacency, setback, interior; property-line-tags
   only if present and labeled "not a survey".
4. Hash: `return=node-graph&node=…&atoms=…` (+ return_*). Closing detail restores
   node card (port `closeDetail` from CT AtomInspector).
5. Do not break code-catalog Atoms search; extend or add property-scoped path.

### Close

Executor close citing WDLL 3/4/5. Planner grades node→atom→back + boundary fields.

---

## UNIT 3 — Map swap + degraded fixes  (FAN NOW — parallel)

**WDLL:** 7, 8, 9, 10  
**Repos:** `P:\hauska-map`; optional mcp/env for metering  
**Branch:** `feat/cc-a-u3-map-and-degraded`

### Contract

1. **Map swap:** CC workspace map uses shared PE layered map composition
   (ExplorerMap / LAYER_REGISTRY over `@hauska/map-renderer`), not CARTO/OSM-only
   LiveMapTile fork. One module, both surfaces. Keep WDLL 4 `node=` lock.
2. **Parcel Trace:** fix BFF/probe so badge matches reality. Today:
   `/api/spine/retrieval/healthz/` 404 while `/health` 200 and geocode works.
   Refresh stale "no interactive map" copy. Prefer LIVE when working; else
   honest DEGRADED with in-panel reason — never lie LIVE.
3. **Revenue Meter:** wire platform_internal metering key for LIVE numbers, OR
   keep DEGRADED with explicit in-panel honest reason (403 / key missing).
4. Badges remain mechanically computed (F1c).

### Close

Executor close citing WDLL 7/8/9/10. Planner verifies map + badge honesty.

---

## Sequencing

```
U1 ──────────────────────────► U2
U3 ────────── (parallel) ────►
```

Planner post-unit: live walk 28286; paste grades to `_inbox/` check-in; update scratch.
