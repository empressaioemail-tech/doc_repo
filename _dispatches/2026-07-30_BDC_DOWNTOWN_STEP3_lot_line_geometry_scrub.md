---
id: 2026-07-30_BDC_DOWNTOWN_STEP3_lot_line_geometry_scrub
title: Dispatch — STEP 3 F3 lot-line geometry scrub (test area)
date: 2026-07-30
status: dispatched
repo: hauska-engine
wdll: 2026-07-30_BASTROP_DOWNTOWN_DRILL_WDLL
wdll_items: [4]
---

# STEP 3 — F3 corrupt lot-line geometry scrub

## STANDING DECISIONS (travel with this dispatch)

- Cotality extinguished / no Regrid / public-record only.
- NO privileged data — per-parcel + parcel-geometry sources must be PUBLIC endpoints working for a no-relationship county.
- SmartCity READ-ONLY reference (never a data path).
- Deploys planner-owned.
- Code-done ≠ customer-done — verify vs city live screen AND area-sweep every parcel.
- CTX / national HELD until operator re-QAs the swept area.
- Standing decisions travel in dispatches.

## WDLL items you own

4 (lot-line geometry scrub; rectangular-lot → rectangular-envelope invariant in test area).

## Specimen

`48021:34073` (1006 Jefferson): rectangular lot, jagged setback envelope with jog. Math clean; corrupt boundary metadata upstream of inset.

## Do

1. **Diagnose** starting at 34073: trace shared edges in `packages/engine-core/src/boundary-primitive/` (adjacency-grid, compute) → `depth-warm/geometry.ts` (:181, :199-200 null-ring / self-intersect / self-touch).
2. **Rescrub** lot-line vertices/bearings/shared-edge joins from authoritative county parcel geometry (BCAD/txgio source — public) for **manifest parcels only**.
3. Rebuild boundary primitive + property-boundary-edge atoms for scrubbed parcels; re-inset.
4. **Invariant**: 4-edge near-rect parcel with orthogonal bearings → envelope is near-rect (vertex count ≤ 6, no interior jog > 1 ft without flagged reason).
5. **Mechanical test** on 34073 + at least one shared-edge neighbor in manifest.
6. Document per-parcel diagnosis table in PR: prop_id → root cause → fix applied → verify pass/fail.
7. Check whether scrub clears null-ring verifyFails in area (likely same root cause as global "819" bucket — report parcel-by-parcel, do not bucket).

## Out

- All-Bastrop scrub, area promotion (STEP 4), deploy.

## Do NOT

- Weaken `ringHasSelfTouch` guard to pass bad geometry.
- Re-warm outside manifest (STEP 4 owns promotion).
