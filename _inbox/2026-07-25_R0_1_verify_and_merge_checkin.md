---
id: 2026-07-25_R0_1_verify_and_merge_checkin
title: Check-in — R0.1 planner re-verify + merge go (#356)
status: check-in
date: 2026-07-25
planner: depth-engine planning agent
pr: https://github.com/empressaioemail-tech/legacy-design-tools/pull/356
merge_sha: 63bd82eb7b46705d3af7aaf8cffcc101d8aba425
---

# R0.1 re-verify + merge

## Independent evidence

```
commit 08d7b67b on PR head; merge squash → 63bd82eb on main
CI run 30175043737: Typecheck pass 1m49s; Test pass 10m28s

local vitest geometry+edgeLabeling: 33/33 passed

nanProbe: threw=false empty=true emptyReason="non-finite setback distance"
wdll5: frontIndex=5 frontLenM=46.54 minLenM=7.83 frontIsGlobalMin=false
```

## Grades (post R0.1)

| Item | Grade | Evidence |
|---|---|---|
| 27c WDLL 2 | **MET** | Gate + RED fixtures + non-finite → honest empty (planner probe). Mechanical guards in CI. |
| 27c WDLL 5 | **MET** (shape path) | 714 Spring fixture front ≠ global min (planner probe). Sliver test retained. Road/point still preferred in production. |
| 27c WDLL 1 | **PARTIAL** | Code path fixture-green; live serving still pre-canary. Live POST still declined `no-zoning-stamp` on prior probe — canary + stamp seam still owed. |
| M0.2 | **MET** | Scratch dogfood across R0/R0.1. |
| M0.3 | **MET** | Promoted form = vitest guards (throw-safety + 714 shape-front), planner-gated via verify not autonomous MEMORY.md. |

## Decision

**MERGE GO** executed 2026-07-25T21:19:28Z (squash). Image build on push is NOT deploy (runbook trap #1). Next: deploy-canary with full SHA `63bd82eb7b46705d3af7aaf8cffcc101d8aba425` (or `latest` after build), probe canary envelope, then shift only if boot+geometry clear.

## Deploy (done)

- Image build `30175409931` pushed sha `63bd82eb…` + latest.
- Canary `30175547037` → revision `cortex-api-00436-wuc` health 200; POST 714 Spring still `no-zoning-stamp` (parity with old prod).
- Shift `30175629937` → serving `cortex-api-00436-wuc` @ 100%.

## Still open for WDLL 1 MET

1. ~~Canary + shift~~ done.
2. R0.2 dispatched: when GIS `zoningCode` blank, read baked facets district (P-5) so a live ring returns.
3. Planner live probe after R0.2: ring contained, non-self-intersecting, sensible front offset on 714 Spring + three companions.
