---
id: 2026-07-30_BDC_DOWNTOWN_STEP1_per_parcel_source_and_side_model
title: Dispatch — STEP 1 F4 per-parcel setback source + interior/corner side model
date: 2026-07-30
status: dispatched
repo: hauska-engine (+ hauska-map if PE card shape)
wdll: 2026-07-30_BASTROP_DOWNTOWN_DRILL_WDLL
wdll_items: [1, 2]
---

# STEP 1 — F4 source switch + AMENDMENT 2 R2 side model

## STANDING DECISIONS (travel with this dispatch)

- Cotality extinguished / no Regrid / public-record only.
- NO privileged data — per-parcel + parcel-geometry sources must be PUBLIC endpoints working for a no-relationship county.
- SmartCity READ-ONLY reference (never a data path).
- Deploys planner-owned.
- Code-done ≠ customer-done — verify vs city live screen AND area-sweep every parcel.
- CTX / national HELD until operator re-QAs the swept area.
- Standing decisions travel in dispatches.

## WDLL items you own

1 (authoritative source adapter), 2 (interior/corner side end-to-end).

## Ruling

AMENDMENT 2 R1 + AMENDMENT 3: setback **NUMBERS** come from `Parcels_One_Click/FeatureServer/23`, cited to `Ordinance_Link`. Ordinance text / `bastrop-development-code.json` chart is verification + citation fallback only — **not** the number source when the per-parcel record differs. RETIRE Bastrop city warm path that reads `bastrop-development-code.json` scalars for setback values.

## Do

1. **Adapter** `packages/adapters/src/local/setbacks/bastrop-per-parcel-record.ts` (or extend existing):
   - Public REST client for layer 23 by `prop_id`.
   - Parse feet from `FrontSetback_`, `SideSetback_`, `RearSetback_`.
   - Parse corner from SideSetback text regex; expose `sideInteriorFt` + `sideCornerFt`.
   - Carry `Ordinance_Link`, height, impervious, min-lot; honest-decline when side text is non-scalar ("Reference Building Code/Fire Code").
2. **Atom shape**: extend setback-rule warm payload with `sideInteriorFt` + `sideCornerFt` (keep backward compat: legacy `sideFt` = interior for non-corner lots).
3. **Warm path**: `depth-warm` / setback resolution for `bastrop-city-tx` calls per-parcel adapter FIRST; district from existing Zoned_Parcels stamp.
4. **Router**: `getSetbackTableForZoning` for Bastrop city → per-parcel record path, not `bastrop-development-code.json` row lookup for numbers.
5. **PE card** (hauska-map, if needed): render interior + corner side separately on inspect card.
6. **Tests** (manifest anchors):
   - `105054`: 25 / 5 interior / 15 corner / 25; cites Ordinance_Link
   - `34089` GC: 20 / 5 / 10 corner / 20
   - Disagreement flag when chart would say 30/10/20/30 but record says 25/5/15/25
7. Open PR(s). Do NOT deploy. Do NOT self-grade LIVE.

## Out

- Area re-warm (STEP 4), geometry scrub (STEP 3), MU/GC district table build (STEP 2 — but adapter must return GC/MU numbers; STEP 2 wires router for those districts).

## File hints

- Retire number path: `bastrop-development-code.json` used only for edition/citation atoms, not warm scalars.
- Decision: `_decisions/2026-07-29_setback_authoritative_source_and_road_decouple.md` AMENDMENT 2 + 3.
