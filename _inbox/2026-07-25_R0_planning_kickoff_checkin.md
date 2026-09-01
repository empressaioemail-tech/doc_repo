---
id: 2026-07-25_R0_planning_kickoff_checkin
title: Check-in — R0 planning kickoff (library gate locked, executor dispatched)
status: check-in
date: 2026-07-25
planner: depth-engine planning agent
governs: 27c R0 / M0 dogfood
related: [_dispatches/2026-07-25_R0_geometry_truth, _scratch/depth-engine-27c]
---

# R0 planning kickoff check-in

## State

M0 install assumed done (rule + runbook + scratch). Planning agent activated via `_dispatches/2026-07-25_depth_engine_planning_agent_handoff.md`. Started at R0; did not rebuild M0.

## R0 first gate — library pick (LOCKED)

Evidence against live LDT tree (`P:\legacy-design-tools`):

- `artifacts/api-server/package.json` has no turf/jsts/martinez/polygon-clipping (confirmed).
- `artifacts/api-server/build.mjs` hard-codes `conditions: ["workspace"]` with the pg dual-package crash documented in-file (lines 44-55).
- Public API is variable-distance `insetPerEdge(ring, insetFeetPerEdge)` — uniform buffer is structurally wrong.

| Candidate | Call |
|---|---|
| `polygon-clipping@^0.15.7` | USE — strip → union → difference |
| jsts BufferOp / @turf/buffer | REJECT — uniform |
| martinez-polygon-clipping | REJECT — redundant |
| Broaden esbuild conditions | FORBIDDEN — known DEAD-END |

Dispatch: `_dispatches/2026-07-25_R0_geometry_truth.md` (cites 27c WDLL 1, 2, 5 + M0.2/M0.3).

## Grades (this kickoff — not a finish card)

| Item | Grade | Evidence |
|---|---|---|
| 27c WDLL 1 | pending | executor in flight |
| 27c WDLL 2 | pending | executor in flight |
| 27c WDLL 5 | pending | executor in flight |
| M0.2 | partial | scratch read + updated; dogfood live |
| M0.3 | pending | awaits mechanical guard on merge |

## Operator-routed (recommend)

1. Flip `27_MASTER_WDLL_...` and `27c_...` frontmatter from `awaiting operator approval` → `approved` (this handoff activation is the operational go; formal freeze still owed).
2. No other operator decision until R4 depth-cost.

## Next

Executor builds PR. Planner verifies against live probes + pasted vitest RED/GREEN, then grades the finish card and promotes the concave-fixture test (M0.3).
