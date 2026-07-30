---
id: 2026-07-30_BDC_DOWNTOWN_STEP7_mold_area_sweep_update
title: Dispatch — STEP 7 mold update (per-parcel source + area-sweep cert)
date: 2026-07-30
status: dispatched
repo: doc_repo
wdll: 2026-07-30_BASTROP_DOWNTOWN_DRILL_WDLL
wdll_items: [8]
---

# STEP 7 — Mold update (28_THE_BASTROP_MOLD)

## STANDING DECISIONS (travel with this dispatch)

- Cotality extinguished / no Regrid / public-record only.
- NO privileged data — per-parcel + parcel-geometry sources must be PUBLIC endpoints working for a no-relationship county.
- SmartCity READ-ONLY reference (never a data path).
- Deploys planner-owned.
- Code-done ≠ customer-done — verify vs city live screen AND area-sweep every parcel.
- CTX / national HELD until operator re-QAs the swept area.
- Standing decisions travel in dispatches.

## WDLL items you own

8 (mold reflects AMENDMENT 2 + 3).

## Rewrite in `28_THE_BASTROP_MOLD_engine_build_spec.md`

1. **Setback NUMBER source** = jurisdiction authoritative **per-parcel** public record (`Parcels_One_Click/23` for Bastrop), cited to `Ordinance_Link`. Ordinance chart = verification layer only.
2. **Interior + corner side** distinct fields end-to-end (AMENDMENT 2 R2).
3. **Lot-line geometry** scrubbed/validated before inset; **rectangular-lot → rectangular-envelope** invariant; new gate (e) envelope-geometry sanity.
4. **Cert standard** = **area-sweep every parcel** in defined test area (then county), not parcel-sample. Anti-sampling gate for all 254 counties.
5. **MU/GC/PDD** built from per-parcel record base dims; conditional axes honest-decline.
6. **New mold gate (d)**: record-vs-chart disagreement FLAGGED, record wins for number.
7. Retire CORRECTION A text-first language in PART 1a/1b/3 where superseded by AMENDMENT 2.

## Bump `last_updated` to 2026-07-30.
