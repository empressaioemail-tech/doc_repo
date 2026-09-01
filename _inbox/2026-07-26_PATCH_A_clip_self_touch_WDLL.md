---
id: 2026-07-26_PATCH_A_clip_self_touch_WDLL
title: WDLL — PATCH-A clean clip self-touch artifacts (guard stays strict)
status: graded
date: 2026-07-26
operator_approval: 2026-07-26
parent: _inbox/2026-07-26_guard_vs_interior_and_boundary_primitive.md
---

# WDLL: PATCH-A — clean clip artifacts before guard

## Done looks like

`insetRingMeters` returns a clean simple ring (no zero-width spike) so `ringHasSelfTouch` passes on 28286-class near-rects. The guard still rejects genuinely self-touching rings. Positive-space geometry fixtures lock every-edge-index front insets. Place-type depth is re-promoted and the residual reclassified to the new honest ceiling. Boundary primitive is not in this patch.

## Acceptance items

1. Clean clip spikes/collinear self-touch vertices inside `insetRingMeters` before return; do not weaken `ringHasSelfTouch`. | check: unit + live 28286
2. Live 28286: front@edge2 ~7316; uniform15 ~3206; honest-irregular still empty; genuine self-touch still rejected. | check: pasted probes
3. Geometry gate positive-space fixtures (28286 + peers, front-on-each-edge) + negative self-touch fixture; gate RED on pre-patch. | check: vitest
4. Place-type re-promote; before/after from 2712/3657; residual reclassify; new ceiling stated. | check: SQL + check-in
5. Front-labeling gate + concave/corner/714-Spring still green. | check: vitest
6. Central-TX HELD; no boundary primitive in this PR. | check: scope

## Finish card

1. **met** — `cleanClipRingArtifacts` in `insetRingMeters`; guard unchanged. PR #136.
2. **met** — live 28286 edge2 7316; uniform 3206; 47759 uniform still empty; self-touch still rejected.
3. **met** — positive-space + negative fixtures in `clip-self-touch-patch-a.test.ts`; CI 303/303.
4. **met** — 2712→**3538**/3657=**96.75%**; residual 110 no-road / 6 geom-empty / 0 would-promote.
5. **met** — front-labeling gate + warm suites green on merge.
6. **met** — no CTX fan-out; primitive not in patch.
