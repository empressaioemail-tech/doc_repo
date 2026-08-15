---
id: 2026-07-25_R0_1_geometry_truth_followup
title: Dispatch — R0.1 follow-up (throw-safety + WDLL 5 on 714 Spring) before merge of #356
status: active
date: 2026-07-25
applies_to: [legacy-design-tools]
planner: depth-engine planning agent
parent_pr: https://github.com/empressaioemail-tech/legacy-design-tools/pull/356
cites:
  - 27c WDLL 1 (still PARTIAL until live)
  - 27c WDLL 2 (close the throw hole)
  - 27c WDLL 5 (714 Spring shape-front)
related: [_inbox/2026-07-25_R0_verify_checkin, _scratch/depth-engine-27c]
---

# R0.1 — close planner-found gaps on PR #356 before merge

You are the EXECUTOR. Planner verified #356 and **held merge**. Land the deltas below on the same branch `r0/geometry-truth-polygon-offset` (push to the open PR) or a stacked PR targeting that branch. Do not merge.

## FLEET MEMORY (M0)

As you work, capture build knowledge in a scratch block you return in your close, using four entry kinds — LESSON, DEAD-END, GROUND-TRUTH (with timestamp), OPEN. Read scratch context FIRST. Do NOT promote to durable memory yourself.

## Scratch context (start warm)

```
GROUND-TRUTH (2026-07-25 planner verify): PR #356 CI green but HOLD merge.
GROUND-TRUTH: on PARCEL_714_SPRING_33512 under shape fallback, front = globally shortest edge (7.83m). SURVEY_NOISE 1.5m insufficient for WDLL 5 on this lot.
GROUND-TRUTH: non-finite inset feet → polygon-clipping throws "Tried to create degenerate segment" uncaught from insetPerEdge.
DEAD-END: do not broaden esbuild conditions beyond ["workspace"].
LESSON: insetFeetForLabeling keys are front_ft/side_ft/rear_ft.
```

## Required deltas

1. **Throw-safety (WDLL 2 / anti-fabrication).** In `geometry.ts` `insetProjected` / `insetPerEdge`: sanitize inset metres (non-finite → treat as empty/decline); wrap `polygon-clipping` union/difference in try/catch → return honest empty with reason, never throw to the route. Add a vitest that feeds non-finite inset feet and asserts `empty: true` (not an exception).

2. **WDLL 5 on 714 Spring fixture.** Shape fallback must not select the globally shortest edge on `PARCEL_714_SPRING_33512`. Options (pick one, document in close):
   - Improve `frontFromShape` so depth-axis / opposite-pair scoring beats pure shortest among edges ≥ threshold; OR
   - When shape signal would pick the unique shortest edge on a ≥5-edge irregular ring, decline front as approximate/unresolved rather than labeling it front with confidence 0.35.
   Add a test: `labelEdges({ ring: PARCEL_714_SPRING_33512 })` → front edge length is NOT `Math.min(...edge lengths)` (or result honestly refuses a confident front). The existing sliver test stays.

3. **Do not expand scope** into R1 roads-as-nodes, R2 descriptor tables, or cortex deploy. Deploy is planner-owned after merge.

## Done when

- New commits on #356 (or stacked PR)
- CI green
- Close with: PR URL, verbatim vitest for the two new tests, scratch block
- Still do not merge; planner re-verifies then says go
