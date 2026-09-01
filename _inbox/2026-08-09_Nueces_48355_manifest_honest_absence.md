---
id: 2026-08-09_Nueces_48355_manifest_honest_absence
title: Nueces 48355 — manifest honest-absence (eastern coastal strip)
date: 2026-08-09
status: recorded
owner: planner
county_fips: "48355"
rail: geometry (parcel geometry / L2)
---

# Nueces 48355 — eastern coastal strip honest-absence

**No re-ingest.** Re-ingest under supersede would reproduce identical archive extent.

## Classification

| Field | Value |
|---|---|
| basis | **SOURCE_DEFECT** |
| cohort | Eastern coastal strip (~2,100-parcel east wall) |
| east gap | **0.06251°** (store east −97.046791 vs L1 boundary east −96.984281) |

## Citation chain

- Extent triangulation: `_inbox/2026-08-09_F4_nueces_48355_extent_report.md`
- Apply identity proof: `_inbox/2026-08-09_L2_W3R2_48355_declined_idem.json` — `featuresRead=157198` = store distinct = roster
- Coastal C2 frame: `_inbox/2026-08-09_C2_coastal_extent_raw.json`
- Multi-shp ruled out: Harris-only; reader fail-closed on main (#404)

## Source vintage

`stratmap25-landparcels_48355_nueces_202507` — StratMap 202507 vintage omits eastern cohort relative to L1 county boundary.

## Manifest posture

Record **honest-absence / not-yet** for the eastern Nueces coastal strip until a corrected StratMap vintage or CAD override closes the gap. Store is complete for what the archive contains; defect is upstream source extent, not ingest truncation.
