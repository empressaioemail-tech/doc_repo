---
id: 2026-07-26_S2U3_executor_close
title: Executor close — Stage 2 Unit 3 offset consumes boundary primitive (S2-U3)
status: check-in
date: 2026-07-26
executor: cursor agent (S2-U3)
dispatch: _dispatches/2026-07-26_S2U3_offset_consumes_primitive.md
acceptance: [U3.1, U3.2, U3.3, U3.4, U3.5, U3.6]
---

# S2-U3 executor close — offset consumes primitive

Planner verify only; executor does not self-grade Stage 2 or Central-TX done.

## 1. PR + SHA

| Item | Value |
|------|-------|
| PR | https://github.com/empressaioemail-tech/hauska-engine/pull/139 |
| Branch | `feat/s2u3-offset-consumes-primitive` |
| SHA | `288d658` (feat `27e0f44` + CI typecheck fix) |
| Base | Branched from `feat/s2u2-boundary-primitive` (PR #138) — includes U2 until merged |

## 2. Live warm evidence (gold set — substrate 2026-07-27T03:44Z)

All three consume `depth-warm-boundary-primitive-v1`; adjacency-FACT labeling from stored atoms.

### 48021:28286

- verifyPass=true, buildableAreaSqFt=**7316.34**, insetFeet=[0,0,15,0], empty=false
- edge2: front/ROW 15ft | edge0: rear/unmapped 0ft | edge1: side/neighbor 0ft | edge3: side_corner/ROW 0ft

### 48021:34785

- verifyPass=true, buildableAreaSqFt=**13632.37**, insetFeet=[0,0,0,15], empty=false
- edge3: front/ROW 15ft | edge2: side/unmapped 0ft (honest)

### 48021:33512

- verifyPass=true, buildableAreaSqFt=**23254.09**, insetFeet=[0,0,0,5,15,0], empty=false
- edge3: rear/alley 5ft | edge4: front/ROW 15ft | edge0/5: unmapped 0ft

## 3. Vitest (three fixture classes + gates)

```
pnpm --filter @hauska-engine/engine-core test \
  src/boundary-primitive/__tests__/offset-consumes-primitive.test.ts \
  src/geometry/__tests__/clip-self-touch-patch-a.test.ts \
  src/depth-warm/__tests__/front-labeling-fixture-gate.test.ts

 Test Files  3 passed (3)
      Tests  16 passed (16)
```

Full suite: **317 passed | 2 skipped (319)**.

| Class | Test | Result |
|-------|------|--------|
| U3.1 orientation-invariant | 28286 front@edge2 ~7316 via primitive | PASS |
| U3.2 reads primitive | spy: insetRingMetersWithNormals yes, insetRingMeters no | PASS |
| U3.3 unmapped honest | unmapped-adjacency → 0ft, no feet field | PASS |
| U3.4 self-touch guard | genuine self-touch still rejected | PASS |
| U3.6 gates | PATCH-A positive-space + front-labeling gate | PASS (16/16) |

## 4. Re-promote before/after (verbatim)

**BEFORE** (`_inbox/2026-07-26_S2_BEFORE_baseline.json`, 2026-07-27T03:02Z):

```
depth_warm = 3538
place_type_universe = 3657
depth_ratio_place_type = 96.75%  (3538/3657)
boundary_edges = 14  (gold set only)
```

**Boundary bake** (place-type + city cohort, limit=4000):

```
parcelsProcessed=3654  edgesWritten=26454  wallMsTotal=280363
```

**AFTER** (batch finish 2026-07-27T05:56Z, exit 0; wallMsTotal=7602920):

```
outcomes: promoted=104  verifyPass=104  verifyFail=12
declines: already-promoted=3538  no-road-adjacency=0  no-geometry=0  no-boundary-primitive=0
depth_warm = 3642  (= 3538 + 104)
place_type_universe = 3657
depth_ratio_place_type = 99.59%  (3642/3657)
boundary_edges = 26454
delta = +104 promoted (+2.84 pp)
```

Residual unwarmed place-type ≈ **15** (12 verifyFail geometry-empty + ~3 outside batch accounting — not guard-weakened).

## 5. Acceptance mapping (executor claim — planner verifies live)

| # | Claim |
|---|-------|
| U3.1 | Live 28286 primitive warm area ~7316, front@edge2 insetFeet=[0,0,15,0] |
| U3.2 | Fixture proves offset uses insetRingMetersWithNormals, not default re-derive |
| U3.3 | Unmapped edges: 0ft, unmapped-adjacency setback, no fabrication |
| U3.4 | Genuine-self-touch negative fixture still fails guard |
| U3.5 | Re-promote 3538→3642 (96.75%→99.59%) after place-type boundary bake |
| U3.6 | geometry + front-labeling CI fixtures green; full vitest 317 pass |

## 6. M0 scratch block (return to planner)

```
LESSON (U3): when boundaryEdges present, warm path MUST use insetRingMetersWithNormals + stored inwardNormal — orientation-invariant; 28286 front@edge2 now ~7316 live.
LESSON (U3): batch warm reads readBoundaryEdgesForParcel first; legacy labelEdgesFromRoads only when primitive missing (fail-open for non-baked parcels).
LESSON (U3): place-type boundary bake 3654 parcels → 26454 edges in ~280s (one-load index + lazy grid); re-promote +104 without weakening guards.
GROUND-TRUTH (2026-07-27T05:52Z): PR #139 SHA 288d658; depth_warm 3642/3657=99.59%; boundary_edges=26454; gold warm all verifyPass via depth-warm-boundary-primitive-v1.
GROUND-TRUTH (2026-07-27T03:44Z live gold): 28286 area=7316.34 inset=[0,0,15,0]; 34785 area=13632.37 inset=[0,0,0,15]; 33512 area=23254.09 inset=[0,0,0,5,15,0].
OPEN: PR #139 CI re-run after typecheck fix (288d658); merge after green + planner live verify.
OPEN: Stage 2 NOT done — planner grades U3 live; Central-TX HELD.
OPEN: ~15 residual place-type unwarmed — classify (no-road vs geom-empty) on next pass.
```
