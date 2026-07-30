---
id: 2026-07-30_BDC_DOWNTOWN_STEP4_area_promotion
title: Dispatch — STEP 4 F1 100% promotion (test area only)
date: 2026-07-30
status: dispatched
repo: hauska-engine
wdll: 2026-07-30_BASTROP_DOWNTOWN_DRILL_WDLL
wdll_items: [5]
depends_on: [STEP1, STEP2, STEP3]
---

# STEP 4 — F1 100% area promotion (no side-by-side regime split)

## STANDING DECISIONS (travel with this dispatch)

- Cotality extinguished / no Regrid / public-record only.
- NO privileged data — per-parcel + parcel-geometry sources must be PUBLIC endpoints working for a no-relationship county.
- SmartCity READ-ONLY reference (never a data path).
- Deploys planner-owned.
- Code-done ≠ customer-done — verify vs city live screen AND area-sweep every parcel.
- CTX / national HELD until operator re-QAs the swept area.
- Standing decisions travel in dispatches.

## WDLL items you own

5 (100% area promotion).

## Do

1. Isolated re-warm/promote **ONLY** prop_ids in `_catalog/bastrop_downtown_drill_test_area.json` (36 parcels).
2. **Zero** parcel in area on repealed P-x / build-to-line regime after promote.
3. **34081** (`1004 Jefferson`) must match neighbors on current BDC/per-parcel-record path — not P-5 F15 build-to.
4. For any parcel that fails verify/promote: one row in executor close with prop_id, failure class, root cause, blocked-on (NOT aggregated as "819").
5. Regenerate-then-swap per `29_scale_warm_architecture.md`; do not mutate live serving during warm.
6. Hand planner: promoted revision id + per-parcel promote/verify tally for STEP 5 deploy.

## Out

- All-Bastrop re-warm (explicitly forbidden until area-sweep passes).
- Deploy (planner STEP 5).

## Evidence anchor

F1: before state — 34081 serves P-5 adjacent to 34073/105054 on SF-1. After — uniform current edition across Jefferson row.
