---
title: T6 track close report (checkpoint 1)
date: 2026-08-05
status: checkpoint (CAD bulk probe in flight — 211 counties pending)
track: T6_texas_roster_recon
commit: a03821c + follow-on merge
---

# T6 track close report — checkpoint 1

## Statewide totals

| Dimension | Count | Status |
|---|---:|---|
| Counties in roster | 254/254 | Complete — zero silent blanks |
| StratMap Rail C verified | 253/254 | Donley 48129 NOT_COVERED (404) |
| Total StratMap parcels | 13,360,496 | From 2026-08-02 matrix |
| Incorporated cities | 1,223/1,223 | Census 2020 place file |
| CAD four-point verified | 34 | Adversarial pass on sample |
| CAD partial | 6 | Tarrant, Carson, Comal, others |
| CAD honestly absent | 3+ | Hays, Rockwall, Dallas (+ Donley geometry) |
| CAD pending probe | 211 | BIS bulk executor in flight |

## Adversarial review (mandatory)

5/5 REPRODUCED — zero DOWNGRADED:

| FIPS | County | Verdict |
|---|---|---|
| 48021 | Bastrop | REPRODUCED |
| 48055 | Caldwell | REPRODUCED (layer 1 not 0) |
| 48453 | Travis | REPRODUCED (count divergence flagged) |
| 48209 | Hays | REPRODUCED (NOT-FOUND holds) |
| 48397 | Rockwall | REPRODUCED (no-REST holds) |

Artifact: `_inbox/t6_adversarial_review_summary.json`

## Notable finds and risks

1. **BIS Consultants dominance** — `{County}CADWebService` pattern yields verified probes for Calhoun, Camp, Chambers, Colorado, Comanche, Coryell, Crane, Culberson, Dallam, Deaf Smith, and many more. Vendor library documents field template.

2. **Tarrant 48439** — `mapit.tarrantcounty.com/TADParcels` returned 404 on 2026-08-05; services root lists only ODY_Base. StratMap bulk (757k) remains fallback. Gap ledger updated.

3. **Travis crosswalk** — prop_id_bad_rate 0.5147; TCAD MapServer 386k vs StratMap 835k structural divergence. Wave 3 HOLD until crosswalk build.

4. **Harris 48201** — separate planning object; sharding required (~1.5M parcels).

5. **City code publishers (top 59)** — Municode 48, eCode360 3, American Legal 2, General Code 3, Houston unzoned verified, 1 robots-blocked-escalation (encodeplus).

6. **Footprints/easements** — 0/11 onboarded counties have CAD footprint REST; ML-derived default statewide per T3.

## Wave plan summary

| Wave | Parcels | Cost est. | Gate |
|---|---:|---:|---|
| 0 in-flight/certified | ~1.5M | sunk | partial |
| 1 Central TX cert-ready | 468k | $0.31 | 5 counties CAD verified |
| 2 DFW nine | 2.64M | $1.78 | tiles done; Tarrant/Dallas gaps |
| 3 crosswalk HOLD | 835k+ | blocked | Travis crosswalk |
| 4 Harris | 1.5M | $1.00+ | sharding |
| 5 remaining | ~8.7M | $5.80 | 211 probes pending |

Full plan: `_inbox/2026-08-05_T6_ingest_wave_plan.md`

## Gap ledger

Named gaps (no silent blanks): `_inbox/2026-08-05_T6_gap_ledger.md`

## Artifact locations

| Deliverable | Path |
|---|---|
| Roster JSON | `_catalog/texas_roster_v1.json` |
| Roster CSV | `_catalog/texas_roster_v1.csv` |
| Vendor pattern library | `_catalog/t6_vendor_pattern_library.json` |
| OPS-1 expansion | `90_operations/OPS-1_texas_source_registry.md` (T6 section) |
| Ingest wave plan | `_inbox/2026-08-05_T6_ingest_wave_plan.md` |
| Gap ledger | `_inbox/2026-08-05_T6_gap_ledger.md` |
| County CAD probes | `_inbox/t6_cad_probe_{fips}.json` (44 files) |
| Adversarial review | `_inbox/t6_adversarial_review_*.json` |
| City code recon | `_inbox/t6_city_code_recon_top50.json` |
| Pipeline scripts | `_scratch/t6_roster_builder.py`, `_scratch/t6_roster_merge.py` |
| Scratch continuity | `_scratch/t6-roster-recon.md` |

## Acceptance status

| Criterion | Met? |
|---|---|
| 254/254 counties in roster | YES |
| 1223 incorporated cities | YES |
| Zero silent blanks | YES (pending = explicit unverified-flagged) |
| Adversarial sample reproduces | YES (5/5) |
| Wave plan with costs | YES |
| Gap ledger | YES |
| Vendor library | YES |
| OPS-1 updated | YES |
| All counties CAD verified | NO — 211 pending (bulk in flight) |
| Master planner spot-reprobe boring | PARTIAL — sample passes; full statewide audit awaits bulk complete |

**Track status:** CHECKPOINT 1 committed. Resume: BIS bulk executor completes remaining 211 counties → merge → second adversarial sample → final commit → master planner acceptance.
