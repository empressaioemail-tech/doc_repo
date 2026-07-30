---
id: 2026-07-30_BDC_DOWNTOWN_STEP2_mu_gc_pdd_from_record
title: Dispatch — STEP 2 F2 build MU / GC / PDD from per-parcel record
date: 2026-07-30
status: dispatched
repo: hauska-engine
wdll: 2026-07-30_BASTROP_DOWNTOWN_DRILL_WDLL
wdll_items: [3]
depends_on: [2026-07-30_BDC_DOWNTOWN_STEP1_per_parcel_source_and_side_model]
---

# STEP 2 — F2 MU / GC / PDD (no blank districts in test area)

## STANDING DECISIONS (travel with this dispatch)

- Cotality extinguished / no Regrid / public-record only.
- NO privileged data — per-parcel + parcel-geometry sources must be PUBLIC endpoints working for a no-relationship county.
- SmartCity READ-ONLY reference (never a data path).
- Deploys planner-owned.
- Code-done ≠ customer-done — verify vs city live screen AND area-sweep every parcel.
- CTX / national HELD until operator re-QAs the swept area.
- Standing decisions travel in dispatches.

## WDLL items you own

3 (MU/GC/PDD from per-parcel record; no blank in test area).

## Do

1. Wire `getSetbackTableForZoning` / warm resolver so **MU (6), GC (7), PDD (10)** route to the STEP 1 per-parcel adapter — not honest-decline-by-default.
2. Remove or bypass the "MU/GC/PDD absent from bastrop-development-code.json" decline path for parcels that have numeric fields on layer 23.
3. **Conditional side** (34841 MU: "None - Reference Building Code/Fire Code"): honest-decline on that axis WITH reason string from record text — do not fabricate 0 or 5.
4. **Tests**: `48021:34841` MU base dims (15 front, 15 rear, height 40, impervious 60%); `48021:34089` GC (20/5/10/20, height 55, impervious 65%).
5. PR after STEP 1 merges. No deploy. No LIVE self-grade.

## Evidence (LIVE layer 23, 2026-07-30)

| prop_id | situs | district | front | side int | corner | rear |
|---|---|---|---:|---:|---:|---:|
| 34089 | 908 CHESTNUT | GC | 20 | 5 | 10 | 20 |
| 34841 | 1006 HILL | MU | 15 | 0 (decline) | — | 15 |

## Out

- Geometry scrub, area promotion, deploy, audit.
