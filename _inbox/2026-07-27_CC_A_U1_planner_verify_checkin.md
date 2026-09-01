---
id: 2026-07-27_CC_A_U1_planner_verify_checkin
title: CC-A U1 planner verify — retrieval LIVE; CC UI deploy PENDING
status: checkin
date: 2026-07-27
applies_to: hauska-engine, hauska-map
wdll: 2026-07-27_CC_A_legible_node_atom_flow_WDLL
wdll_items: [1, 2, 6]
owner: nick
related: [2026-07-27_CC_A_U1_executor_close, 2026-07-27_CC_A_U3_planner_verify_checkin]
---

# CC-A U1 planner verify

Builder: [CC-A U1](9dd3cbe4-b9ec-45aa-bc2c-98bddf2619a5). Planner grades — not builder.

## Merges + retrieval deploy

| Item | Evidence |
|---|---|
| Engine #144 | MERGED `9357d6a` |
| Map #74 | MERGED `1f5e7ab` |
| Retrieval canary | `hauska-retrieval-api-00033-wom` tag `cca1u1` @ 0% then **traffic 100%** |
| Prior traffic | was `00031-hem` @ 100% |

## Live API (Amendment 1 substrate — MET for WDLL 6)

Via CC BFF after traffic shift (~2026-07-27T13:17Z):

```
GET …/property-nodes/48021:28286/boundary-edges → 200 available=true
GET …/nodes/48021:28286 → 200 node_type=parcel boundaryEdgeCount=4
  edges_out:
    boundary:0 rear unmapped
    boundary:1 side neighbor-parcel 0ft
    boundary:2 front ROW 15ft
    boundary:3 side_corner ROW 0ft
  atom_counts: zoning-fact/setback-rule/buildable-envelope=1, property-boundary-edge=4
```

Graph served (stranded edges unblocked). Atom-chain for `48021:33512` still 200
(regression clear).

## Live CC UI walk (Amendment 1 done-line) — NOT YET

cmdcenter-blush still serves **pre-U1/U3** bundle `index-eWdGi6qE.js`:

- miss: NodeInspect / has-boundary-edge / fetchPropertyNodeDetail
- HAS: "no interactive map" (stale)
- UI on `#panel=node-graph&node=48021:28286` still pills + Inspect button only

**WDLL 2 walkable-in-CC = NOT MET** until Vercel production redeploys map main
(`1f5e7ab` includes #74 + prior #73). Operator/Vercel redeploy owed (CLI TLS-blocked
in this environment).

## Grades

| Item | Grade | Evidence |
|---|---|---|
| 6 Read path for edges | **MET** | Live 200 boundary-edges + nodes for 28286 on retrieval `00033-wom` |
| 1 Node card all types | **PARTIAL** | API shapes live; CC UI still old ledger |
| 2 Walkable traversal | **PARTIAL** | API graph walkable; CC UI walk blocked on stale Vercel |

Property-line-tags: correctly skipped (Amendment 2 optional).

## Cross-unit status

| Unit | Status |
|---|---|
| U1 | API MET; UI PARTIAL pending Vercel |
| U3 | MERGED earlier; same Vercel stale → 7–10 PARTIAL |
| U2 | **FANNED** [CC-A U2](c39be10e-5200-4382-a6d9-1c8e272e49dd) on merged U1 main |

CTX HELD.
