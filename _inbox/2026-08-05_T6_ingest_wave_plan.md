---
id: t6_ingest_wave_plan_v1
title: T6 — Texas ingest wave plan (prioritized factory rollout)
date: 2026-08-05
status: draft (T6 track — updates as CAD probes complete)
owner: nick
related: [T6_texas_roster_recon_track, _catalog/texas_roster_v1.json, t6_vendor_pattern_library]
---

# T6 ingest wave plan

Prioritized factory rollout waves sized by parcel count, data-readiness, and expected defect classes. Cost estimates use engine #250 recalibrated heuristic (directional, not measured full-cohort).

**Statewide StratMap baseline:** 254 counties, 13,360,496 parcels (253 in StratMap + Donley gap). **Harris (~1.5M) is a separate planning object** requiring keyspace sharding before any apply.

## Wave 0 — Certified / in-flight (do not re-onboard)

| FIPS | County | Parcels | Status |
|---|---|---:|---|
| 48021 | Bastrop | 63,357 | Certified city + county cohorts |
| 48055 | Caldwell | 27,445 | Certified 20/20 |
| 48027 | Bell | 167,441 | Cascade done; cert path |
| 48187 | Guadalupe | 95,571 | Certified 20/20 |
| 48309 | McLennan | 115,362 | Breadth onboarded |
| 48091 | Comal | 103,537 | Breadth; stale CAD layer caveat |
| 48029 | Bexar | 709,541 | Breadth rebaked |
| 48453 | Travis | 834,936 | HELD — crosswalk (prop_id bad-rate 0.5147) |
| 48209 | Hays | 117,427 | Cert-blocked — no cadastral REST |
| 48491 | Williamson | 282,983 | Breadth |

**Wave 0 parcel subtotal (excl. Travis HOLD):** ~1,502,636

## Wave 1 — Central TX cert-ready (prop_id join OK, CAD verified)

| FIPS | County | Parcels | CAD vendor | Est. cost USD | Expected defect classes |
|---|---|---:|---|---:|---|
| 48021 | Bastrop | 63,357 | bis-consultants | 0.04 | bis-field-template (cleared structurally) |
| 48055 | Caldwell | 27,445 | county-run-agol | 0.02 | layer-index (cleared), vintage-drift (3 parcels) |
| 48027 | Bell | 167,441 | bis-consultants | 0.11 | bis-field-template |
| 48187 | Guadalupe | 95,571 | bis-consultants | 0.06 | warden-mixed-city (Seguin/Cibolo) |
| 48309 | McLennan | 115,362 | bis-consultants | 0.08 | easement rail available |

**Wave 1 subtotal:** ~468,176 parcels | **~$0.31** directional

## Wave 2 — DFW nine-county fan

Per `_inbox/2026-08-04_dfw_phase0_recon.md`. All prop_id join OK.

| FIPS | County | Parcels | CAD live | Est. cost USD | Expected defect classes |
|---|---|---:|---|---:|---|
| 48139 | Ellis | 98,803 | probe pending | 0.07 | none known |
| 48251 | Johnson | 101,852 | probe pending | 0.07 | none known |
| 48257 | Kaufman | 94,680 | probe pending | 0.06 | none known |
| 48367 | Parker | 100,555 | probe pending | 0.07 | prop_id bad-rate 0.064 |
| 48397 | Rockwall | 52,739 | no-rest | 0.03 | no-rest |
| 48085 | Collin | 387,738 | probe pending | 0.26 | Socrata bulk |
| 48121 | Denton | 353,705 | probe pending | 0.24 | PACS bulk |
| 48439 | Tarrant | 757,171 | unverified | 0.51 | no-rest risk |
| 48113 | Dallas | 694,160 | bulk-only | 0.47 | no-rest |

**Wave 2 subtotal:** ~2,641,403 parcels | **~$1.78** directional

## Wave 3 — Crosswalk HOLD (prop_id_bad_rate >= 0.25)

48453 Travis (834,936), 48395 Robertson, 48359 Oldham, 48393 Roberts, 48345 Motley, 48153 Floyd, 48127 Dimmit, 48295 Lipscomb — blocked until crosswalk build.

## Wave 4 — Harris (48201)

~1,500,000 parcels. Sharding required. Standalone planning object.

## Wave 5 — Remaining counties

~8.7M parcels. CAD four-point probes in flight 2026-08-05. Est. **~$5.80** directional.

## Roll-up

| Wave | Parcels | Cost USD | Gate |
|---|---:|---:|---|
| 0 in-flight | 1,502,636 | sunk | partial |
| 1 Central TX | 468,176 | 0.31 | CAD verified |
| 2 DFW | 2,641,403 | 1.78 | tile done; CAD gaps |
| 3 crosswalk | 834,936+ | blocked | crosswalk |
| 4 Harris | 1,500,000 | 1.00+ | sharding |
| 5 remaining | ~8,700,000 | 5.80 | probes in flight |

**Total target:** 13,360,496 statewide StratMap parcels + Donley gap.
