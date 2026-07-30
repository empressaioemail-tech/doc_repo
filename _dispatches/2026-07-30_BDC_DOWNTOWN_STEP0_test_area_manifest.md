---
id: 2026-07-30_BDC_DOWNTOWN_STEP0_test_area_manifest
title: Dispatch — STEP 0 downtown drill test-area manifest + ground-truth pull
date: 2026-07-30
status: dispatched
repo: doc_repo + hauska-engine (script only)
wdll: 2026-07-30_BASTROP_DOWNTOWN_DRILL_WDLL
wdll_items: [0]
---

# STEP 0 — Test area manifest + ground-truth baseline

## STANDING DECISIONS (travel with this dispatch)

- Cotality extinguished / no Regrid / public-record only.
- NO privileged data — per-parcel + parcel-geometry sources must be PUBLIC endpoints working for a no-relationship county.
- SmartCity READ-ONLY reference (never a data path).
- Deploys planner-owned.
- Code-done ≠ customer-done — verify vs city live screen AND area-sweep every parcel.
- CTX / national HELD until operator re-QAs the swept area.
- Standing decisions travel in dispatches.

## WDLL items you own

Precursor to item 1: manifest locked + per-parcel ground-truth JSON for all 36 parcels.

## Do

1. **Manifest is filed** at `_catalog/bastrop_downtown_drill_test_area.json` — treat as authoritative scope; do not expand without WDLL amendment.
2. Build `hauska-engine/scripts/bastrop-downtown-drill-pull-ground-truth.mjs` (or equivalent) that:
   - Reads manifest prop_ids.
   - Queries `Parcels_One_Click/FeatureServer/23` for each (handle multi-row zone overlaps: pick row matching stamped `ZoneTypeClass` from Zoned_Parcels/83 centroid intersection).
   - Emits `_scratch/bastrop-downtown-drill-ground-truth.json` with parsed numeric dims + `Ordinance_Link` + raw SideSetback text for corner parse.
3. Paste summary in executor close: district counts (SF-1/GC/MU), evidence-anchor rows for F1–F4.

## Out

- Engine warm, PE, deploy, geometry fix (later steps).

## Live-confirmed source (planner 2026-07-30 — do not re-derive)

- Numbers: `Parcels_One_Click/FeatureServer/23`
- Fields: `FrontSetback_`, `SideSetback_`, `RearSetback_`, `MaxBuildingHt`, `MinimumLotSize_`, `MaxImpervisionCoverage`, `Ordinance_Link`
- Corner: parse `(Corner Side Street Setback: N ft)` from `SideSetback` string; GC/MU may use `CornerSideSetbacks` from layer 83 join as fallback
- Specimen 105054: 25 / 5 / 15 corner / 25 rear
