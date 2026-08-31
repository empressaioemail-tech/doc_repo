---
id: 2026-07-27_CC_A_U2_planner_verify_checkin
title: CC-A U2 planner verify — merged; live CC UI PENDING Vercel
status: checkin
date: 2026-07-27
applies_to: hauska-map/apps/command-center
wdll: 2026-07-27_CC_A_legible_node_atom_flow_WDLL
wdll_items: [3, 4, 5]
owner: nick
related: [2026-07-27_CC_A_U2_executor_close, 2026-07-27_CC_A_U1_planner_verify_checkin]
---

# CC-A U2 planner verify

Builder: [CC-A U2](c39be10e-5200-4382-a6d9-1c8e272e49dd). Planner grades — not builder.

## Merge

| Item | Evidence |
|---|---|
| PR | https://github.com/empressaioemail-tech/hauska-map/pull/75 |
| SHA | `1b50af9` → squash main `91c6268` |
| CI | Command Center CI **SUCCESS** |
| Code review | PASS — CT FamilyCounts / NodeAtoms / `closeDetail` / ConfidenceBlock port; catalog search gated; Amendment 2 tags optional + "not a survey"; LIVE/AS-OF honest-empty (no invented endpoint) |

## Backend dependency LIVE

`GET …/atoms/did:hauska:zoning-fact:48021:33512` via CC BFF → **200** (U2
inspector read path available).

## Live CC UI — NOT YET

Production still serves `index-eWdGi6qE.js` (pre-U1/U2/U3). Bundle miss:
NodeInspect, has-boundary-edge, return=node-graph, Atoms by family, shared
layered. Still HAS stale "no interactive map".

Cannot live-walk node→family→atom→back on cmdcenter-blush until Vercel
redeploys main tip `91c6268` (carries #73+#74+#75).

## Grades

| Item | Grade | Evidence |
|---|---|---|
| 3 Atoms by family | **PARTIAL** | Shipped + CI; live UI not serving |
| 4 Atom inspector | **PARTIAL** | Code + `/atoms/:did` 200; live UI not serving |
| 5 Back-nav `return=` | **PARTIAL** | Port reviewed in PR; live UI not serving |

Re-grade MET after production serves `91c6268` and planner walks
`48021:28286` → boundary family → atom → back.
