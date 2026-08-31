---
id: 2026-07-27_CC_A_U1_executor_close
title: CC-A Unit 1 executor close — node organism + read APIs
status: checkin
date: 2026-07-27
applies_to: hauska-engine, hauska-map
wdll: 2026-07-27_CC_A_legible_node_atom_flow_WDLL
owner: cc-a-u1-builder
related: [2026-07-27_CC_A_builder_units, 2026-07-27_CC_A_phase0_live_reaudit_and_build_spec]
---

# CC-A U1 executor close — Node organism + read APIs

**Builder does not grade WDLL MET.** Planner must live-walk `48021:28286` on
deployed CC after engine retrieval + map land. Endpoint-200 alone ≠ done
(Amendment 1).

## PRs / SHAs

| Repo | PR | SHA | CI |
|---|---|---|---|
| hauska-engine | [#144](https://github.com/empressaioemail-tech/hauska-engine/pull/144) | `d4f175df740eb6481a982543b372a57d07c15200` | typecheck + test **pass** |
| hauska-map | [#74](https://github.com/empressaioemail-tech/hauska-map/pull/74) | `eac63c10460377fcf9a93dd60056df98a3aeb06e` | Command Center CI **pass** |

Branch (both): `feat/cc-a-u1-node-organism` (worktrees off `origin/main`).

## What landed

### Engine (WDLL 6 → supports 1+2)

- `GET /property-nodes/:id/boundary-edges` — wires StoragePort
  `listBoundaryEdgesByParcelNodeId` (Phase 0 live 404 path).
- `GET /nodes/:id` — Control-Tower-shaped detail for parcel / road /
  property-boundary-edge: `identifiers`, `edges_out`, `edges_in`,
  `atom_counts_by_family`, plus `boundary_edge` payload on edge nodes.
- `GET /boundary-edges/:id` — same detail by boundary-edge id.
- Atom-chain **unchanged** (no invented edge refs on that path).
- Module: `packages/retrieval/src/node-detail.ts`.

### Map CC (WDLL 1+2)

- Ported Control Tower `NodeInspect` into `NodeGraph.tsx` (structured card;
  raw JSON demoted to optional debug toggle).
- Clickable edges OUT/IN walk hash `node=` across parcel ↔ boundary-edge ↔
  road / neighbor.
- `fetchPropertyNodeDetail` / `fetchBoundaryEdges` in `atomTrace.ts`.
- `node=` accepts parcel / road / boundary-edge; map lock still requires
  strict parcel id.
- Property-line-tags: **not shipped** (Amendment 2 optional) — boundary card
  notes "not a survey" for GIS-approx.

## Local verify snippets (fixture PRE-2 shape)

In-memory retrieval-api (not live substrate — live still 404 until engine
deploy). Gold neighbor/road topology mirrored:

```
GET /property-nodes/48021:28286/boundary-edges → 200
count=2
edges:
  { id: 48021:28286:boundary:1, i:1, role:side, adj:neighbor-parcel, nbr:32341 }
  { id: 48021:28286:boundary:2, i:2, role:front, adj:ROW, nbr:35671, road:48021:road:999 }
```

```
GET /nodes/48021:28286 → 200
edges_out → …:boundary:1, …:boundary:2 (labels include role/adjacency/setback)
atom_counts.property-boundary-edge = 2
```

```
GET /nodes/48021:28286:boundary:2 → 200
summary.role=front, adjacencyKind=ROW, setback.feet=15
edges_out → faces-road 48021:road:999, adjacent-parcel 48021:35671
edges_in  → has-boundary-edge from 48021:28286
```

Vitest: retrieval-api **39/39**; CC NodeGraph smoke + proxyContract **pass**.

## Live pre-deploy baseline (2026-07-27T13:06Z)

```
GET https://cmdcenter-blush.vercel.app/api/spine/retrieval/property-nodes/48021:28286/boundary-edges → 404
GET https://cmdcenter-blush.vercel.app/api/spine/retrieval/nodes/48021:28286 → 404
```

Expected until engine #144 merges + retrieval Cloud Run redeploy + map #74
preview/prod.

## How the UI walk works (planner)

1. Open CC Node & Graph; inspect `48021:28286`.
2. Structured card shows Edges out → click `has-boundary-edge` to
   `48021:28286:boundary:2` (or `:1`).
3. Boundary card shows role / adjacency / setback; Edges out →
   `faces-road` and/or `adjacent-parcel`.
4. Click road → road NodeInspect; click neighbor → that parcel card.
5. Hash stays `#panel=node-graph&node=…` through the walk.

## WDLL cited (not graded)

- **1** Node card (all types) — shipped UI + API shapes; planner grades live.
- **2** Edges OUT/IN + walkable traversal (Amendment 1) — shipped; planner
  live-walks 28286.
- **6** Read path for edges — shipped in #144; live 404 until deploy.

## Deploy / verify notes for planner

1. Merge + deploy engine #144 (`hauska-retrieval-api`).
2. Merge + deploy/preview map #74 (cmdcenter).
3. Re-probe:
   - `GET …/property-nodes/48021:28286/boundary-edges` (expect 200 + live edges)
   - `GET …/nodes/48021:28286` then walk in UI
4. Gold set: `48021:28286`, `48021:33512`, a live `48021:road:…`.

## Scratch / M0

LESSON + GROUND-TRUTH filed to `_scratch/depth-engine-27c.md`.
Property-line-tags skipped (Amendment 2). Port used CT NodeInspect sections
(fields / identifiers / edges / family counts); edges made clickable for
Amendment 1 (CT source displayed edges as text only — walkability is the
property Amendment 1 requirement, flagged so planner knows the delta).

**planner must live-walk — builder does not grade**
