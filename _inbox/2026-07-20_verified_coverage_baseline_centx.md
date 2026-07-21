---
id: 2026-07-20_verified_coverage_baseline_centx
title: Verified coverage baseline — Central-TX land-use (gate-passed, honest)
status: active
date: 2026-07-20
applies_to: legacy-design-tools (county_facet_coverage ledger), property-brief map surface
related: [2026-07-20_provable_county_data_pipeline_design, 2026-07-20_landuse_join_integrity_and_data_acquisition_backlog, 2026-07-20_what_separates_us_service_elevation]
---

# Verified coverage baseline — Central-TX

The first coverage baseline where every number passed the owner-match integrity gate before being recorded. Snapshot of the `county_facet_coverage` ledger, land-use facet, 2026-07-20. This is the customer-facing "here is exactly what we have verified in your market" artifact — and it is honest: a blocked or blank county records 0, never a fabricated stamp rate.

## Land-use coverage (gate-verified)

| County (FIPS) | Coverage | Gate verdict | Owner-match | Classification |
|---|---|---|---|---|
| Bell 48027 | 77.8% | pass | 100.0% | real-at-ceiling |
| Bexar 48029 | 87.9% | pass | 100.0% | real-at-ceiling |
| McLennan 48309 | 79.2% | pass | 100.0% | real-at-ceiling |
| Guadalupe 48187 | 78.2% | pass | 99.2% | real-at-ceiling |
| Bastrop 48021 | 98.0% | pass | 98.2% | real-at-ceiling |
| Caldwell 48055 | 95.5% | pass | 95.7% | real-at-ceiling |
| Travis 48453 | 46.8% | pass | 92.7% | real-at-ceiling (half the parcels ship id="0" from TxGIO) |
| Comal 48091 | 0.0% | insufficient-sample | n/a | true-source-gap (StratMap ships blank land-use) |
| Hays 48209 | 0.0% | block | 0.0% | fabricated-blocked (was a numeric collision; honestly blocked) |
| Williamson 48491 | 0.0% | insufficient-sample | 0.0% | needs external CAD crosswalk |

Owner-match = fraction of joined parcels where the geometry-side owner and the CAD-side owner agree. A pass means the join is the SAME property; a block means the join was fabricating (different owners) and is refused.

## What this baseline proves

- Every "pass" number is a REAL join (owner-match 92-100%), not a coverage figure inflated by numeric collisions.
- Hays land-use is recorded as 0% BLOCKED, not the ~60% fabricated rate it showed before the gate. Williamson likewise 0%, honest, pending an external crosswalk. The ~151k fabricated land-use snapshots those two counties carried were physically STRIPPED from the store (verified: node 48491:R062578 went from a collision-stamped "A1" to honest null; fabricated count 81,682 + 69,959 -> 0). Real counties were untouched (Bexar 622,764, Bastrop 61,531 land-use rows intact).
- The gate is now MANDATORY and AUTOMATIC in the bake: a land-use join cannot promote data unless the owner-match verdict passes, and the block set is ledger-driven (a new county with a fabricating join is caught by computation, not a hand-edited list). "Coverage that was actually collisions" is structurally impossible to record.

## The honest gaps (queued, not fabricated)

- Hays + Williamson: need the external HaysCAD / WCAD account-to-prop_id crosswalk (their appraisal-roll bulk exports carry it). Until acquired, honest 0% + "not verified here."
- Comal: needs a land-use source with a populated category (StratMap ships blank). Honest 0%.
- Travis: ~half its parcels ship with prop_id="0" from TxGIO; needs a fresher vintage or address crosswalk for that half. The 46.8% is real; the rest is a source-id gap, not a bad join.

These are the acquisition backlog, tracked separately. The point of this baseline is that the gaps are HONEST and VISIBLE — a customer sees exactly what is verified and what is not, which is the trust posture no competitor offers.
