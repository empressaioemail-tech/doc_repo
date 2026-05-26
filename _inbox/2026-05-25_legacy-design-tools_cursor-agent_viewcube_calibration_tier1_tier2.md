# Courier — ViewCube calibration Tier 1 + Tier 2

| Field | Value |
|-------|-------|
| **Date** | 2026-05-25 |
| **Repo** | `legacy-design-tools` (`P:\legacy-design-tools`) |
| **Agent** | `cursor-agent` (Cursor Auto) |
| **Topic** | BIM ViewCube roll/up calibration (Tier 1 + Tier 2) |
| **Base SHA** | `173eddb` (no commit on this slice) |
| **PR** | None — working tree only |

---

## Summary

Tightened ViewCube ↔ main viewport calibration per planning analysis (upside-down **RIGHT** label / roll drift):

1. **Tier 1** — Single `camera.up` policy via `applyStableCameraView()` after every programmatic camera move.
2. **Tier 2** — Cube sync uses stabilized `(viewDir, up)` instead of `inverse(mainCamera.quaternion)`; widget now requires orbit target ref.

---

## What changed (this slice only)

| File | Change |
|------|--------|
| `lib/portal-ui/src/components/viewCubeCamera.ts` | `applyStableCameraView`, `computeCubeGroupQuaternion*`, drag/compass snap use stable up; fixed `computeViewDirection(camera.position, target)` |
| `lib/portal-ui/src/components/ViewCubeRenderer.ts` | `setOrientationFromMainCamera(camera, orbitTarget)` uses stabilized quaternion; hover uses world-normal raycast |
| `lib/portal-ui/src/components/ViewCubeWidget.tsx` | New required prop `orbitControls`; rAF passes `controls.target` |
| `lib/portal-ui/src/components/BimModelViewport.tsx` | `orbitControls={controlsRef}`; `applyCameraFit` → `applyStableCameraView` |
| `lib/portal-ui/src/components/__tests__/viewCubeCamera.test.ts` | Top-view up retention, stabilized vs raw quat, consistency tests |
| `lib/portal-ui/src/components/__tests__/ViewCubeWidget.test.tsx` | Mock `orbitControls` ref |
| `lib/portal-ui/src/components/__tests__/BimModelViewport.test.tsx` | `Matrix4` + `quaternion.setFromRotationMatrix` on three mock |

**Not in this slice:** other dirty files under `lib/portal-ui/` (Canva banner, theme/CSS, `index.ts`, etc.) — pre-existing / parallel work; do not bundle with ViewCube PR without review.

---

## Technical notes (for planner / follow-up)

- **Root cause addressed:** full quaternion mirror + split `camera.up` policy (snaps used `resolveCameraUpForDirection`, drags forced `(0,0,1)`).
- **Tier 3 not done:** per-face UV roll correction if any label still inverts against the fixed mini-camera `(2.4, -2.2, 1.9)`.
- **Phase 2 not done:** edge/corner/`iso` raycast (directions exist in `viewCubeModel.ts`; clicks still face-only).
- **HUD vs cube:** `VIEW_PRESETS.front` still `[0,-1,0.05]` vs cube `[0,-1,0]` — minor parity gap.

---

## Verification

```powershell
cd P:\legacy-design-tools\lib\portal-ui
pnpm exec vitest run src/components/__tests__/viewCubeCamera.test.ts src/components/__tests__/ViewCubeWidget.test.tsx src/components/__tests__/BimModelViewport.test.tsx
```

**Result (2026-05-25):** 76 tests passed (10 + 3 + 63).

**Manual QA (Snapshots BIM hero):**

1. `EngagementDetail` → Snapshots tab → immersive `BimModelViewport`.
2. Cube **TOP** snap → cube drag → main canvas keeps plan north (`up ≈ −Y`).
3. Cube **RIGHT** (and other faces) — labels upright in widget; click snaps correctly.
4. **Home** reframes with stable roll.

Optional repo-wide: `pnpm run typecheck` at monorepo root before PR.

---

## Deploy pin

None — `lib/portal-ui` only; consumed by `artifacts/design-tools` / `artifacts/plan-review` via workspace `@workspace/portal-ui`. No separate deploy artifact.

---

## Blockers / next steps

| Item | Status |
|------|--------|
| Commit + PR | Waiting on orchestrator — agent did not commit |
| Visual confirm upside-down RIGHT fixed | Needs human pass on live Snapshots viewer |
| Tier 3 UV table | Only if manual QA still shows inverted face text |
| Align HUD `VIEW_PRESETS` with cube vectors | Optional polish |

---

## Prior context

- Planning recon: ViewCube wiring brief in Cursor chat (coordinate contract, callback table, calibration hypotheses).
- Consumer: `artifacts/design-tools/src/pages/EngagementDetail.tsx` (`presentation="immersive"`).
