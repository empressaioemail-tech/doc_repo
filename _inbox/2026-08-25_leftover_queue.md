---
id: 2026-08-25_leftover_queue
title: Texas leftover queue (Factory 1.5 hygiene)
date: 2026-08-25
status: active
plan_row: P-78
snapshot: doc_repo main @ 9753b83
related:
  - _inbox/2026-08-25_factory_operating_instructions.md
  - _inbox/2026-08-25_texas_complete_wave_plan.md
  - _inbox/2026-08-25_county4_williamson_48491_handoff.md
  - _inbox/2026-08-25_county5_travis_48453_handoff.md
  - _inbox/2026-08-25_county6_atascosa_48013_handoff.md
  - _inbox/2026-08-25_review_travis_48453_leftover.md
  - _inbox/2026-08-25_review_atascosa_48013_leftover.md
  - _inbox/2026-08-25_county7_bandera_48019_handoff.md
  - _inbox/2026-08-25_review_bandera_48019_leftover.md
  - _inbox/2026-08-25_county8_bexar_48029_handoff.md
  - _inbox/2026-08-25_review_bexar_48029_leftover.md
  - _inbox/2026-08-25_county9_blanco_48031_handoff.md
  - _inbox/2026-08-25_review_blanco_48031_leftover.md
  - _inbox/2026-08-25_county10_burnet_48053_handoff.md
  - _inbox/2026-08-25_review_burnet_48053_leftover.md
  - _inbox/2026-08-25_county11_collin_48085_handoff.md
  - _inbox/2026-08-25_review_collin_48085_leftover.md
  - _inbox/2026-08-25_county12_comal_48091_handoff.md
  - _inbox/2026-08-25_review_comal_48091_leftover.md
  - _inbox/2026-08-25_county13_denton_48121_handoff.md
  - _inbox/2026-08-25_review_denton_48121_leftover.md
  - _inbox/2026-08-25_county14_ellis_48139_handoff.md
  - _inbox/2026-08-25_review_ellis_48139_leftover.md
  - _inbox/2026-08-25_county15_fayette_48149_handoff.md
  - _inbox/2026-08-25_review_fayette_48149_leftover.md
  - _inbox/2026-08-25_county16_frio_48163_handoff.md
  - _inbox/2026-08-25_review_frio_48163_leftover.md
  - _inbox/2026-08-25_county17_gillespie_48171_handoff.md
  - _inbox/2026-08-25_review_gillespie_48171_leftover.md
  - _inbox/2026-08-25_county18_guadalupe_48187_handoff.md
  - _inbox/2026-08-25_review_guadalupe_48187_leftover.md
  - _inbox/2026-08-25_county19_hood_48221_handoff.md
  - _inbox/2026-08-25_review_hood_48221_leftover.md
  - _inbox/2026-08-25_county20_hunt_48231_handoff.md
  - _inbox/2026-08-25_review_hunt_48231_leftover.md
  - _inbox/2026-08-25_county21_johnson_48251_handoff.md
  - _inbox/2026-08-25_review_johnson_48251_leftover.md
  - _inbox/2026-08-25_county22_karnes_48255_handoff.md
  - _inbox/2026-08-25_review_karnes_48255_leftover.md
  - _inbox/2026-08-25_county23_kaufman_48257_handoff.md
  - _inbox/2026-08-25_review_kaufman_48257_leftover.md
  - _inbox/2026-08-25_county24_kendall_48259_handoff.md
  - _inbox/2026-08-25_review_kendall_48259_leftover.md
  - _inbox/2026-08-25_county25_kerr_48265_handoff.md
  - _inbox/2026-08-25_review_kerr_48265_leftover.md
  - _inbox/2026-08-25_county26_lee_48287_handoff.md
  - _inbox/2026-08-25_review_lee_48287_leftover.md
  - _inbox/2026-08-25_county27_llano_48299_handoff.md
  - _inbox/2026-08-25_review_llano_48299_leftover.md
  - _inbox/2026-08-25_county28_medina_48325_handoff.md
  - _inbox/2026-08-25_review_medina_48325_leftover.md
  - _inbox/2026-08-25_county29_parker_48367_handoff.md
  - _inbox/2026-08-25_review_parker_48367_leftover.md
  - _inbox/2026-08-25_county30_rockwall_48397_handoff.md
  - _inbox/2026-08-25_review_rockwall_48397_leftover.md
  - _inbox/2026-08-25_county31_somervell_48425_handoff.md
  - _inbox/2026-08-25_review_somervell_48425_leftover.md
  - _inbox/2026-08-25_county32_wilson_48493_handoff.md
  - _inbox/2026-08-25_review_wilson_48493_leftover.md
  - _inbox/2026-08-25_county33_wise_48497_handoff.md
  - _inbox/2026-08-25_review_wise_48497_leftover.md
  - _decisions/2026-08-25_leftover_farm_autonomous.md
  - _inbox/2026-08-24_parcel_facts_write_path_game_plan.md
---

# Texas leftover queue

Mode: data backfill and hygiene. QA is parked. Two finish lines stay separate.

1. Factory 1.5 leftover: `stratmap-landuse` year/acres onto `cad_property` through `scripts/cad-ingest-apply-gate.mjs`. Slot-free.
2. Manifest 14 rails × 254 counties = 3556 cells. Still **667/3556** from GET **2026-08-25T04:13Z** SNAPSHOT. Leftover upserts do not green a cell. Factory 1 atoms `--apply` is the later fill wave.

L17 is the inspect pin. Leftover still writes. Do not flip L17 mid-apply.

## Done (do not rewrite)

| FIPS | County | Path | Leftover year | L17 | Note |
| --- | --- | --- | --- | --- | --- |
| 48055 | Caldwell | B | 2025 n=24989 | 2026 / cad-export | Off inspect |
| 48021 | Bastrop | A +726 | 2025 n=77799 | 2025 / cad-export | On inspect. Gold 34137 living area HOLD |
| 48209 | Hays | A +40870 | 2025 n=172116 | 2026 / cad-export | Acres filled. year_built already saturated |
| 48491 | Williamson | B +282570 | 2025 n=282570 yb=0 la=282570 | 2026 / cad-export | Off inspect. 2026 319480 unchanged. Review KEEP |
| 48453 | Travis | B +380918 | 2025 n=380918 yb=0 la=380918 | 2026 / cad-export | Off inspect. 2026 492848/0/441047 unchanged. Review KEEP |
| 48013 | Atascosa | B +34649 | 2025 n=34649 yb=19709 la=34649 | registry null | Greenfield. 2026 still absent. Review KEEP |
| 48019 | Bandera | B +32755 | 2025 n=32755 yb=0 la=32755 | registry null | Greenfield. 2026 still absent. Review KEEP |
| 48029 | Bexar | A n=703258 | 2025 n=703258 yb=619203 la=703258 | 2025 / stratmap-roll | On inspect. n unchanged. Review KEEP |
| 48031 | Blanco | B +13648 | 2025 n=13648 yb=0 la=13648 | registry null | Greenfield. 2026 still absent. Review KEEP |
| 48053 | Burnet | B +49243 | 2025 n=49243 yb=24607 la=49243 | registry null | Greenfield. Years and acres filled. Review KEEP |
| 48085 | Collin | A n=387334 | 2025 n=387334 yb=338301 la=387334 | 2025 / stratmap-roll | On inspect. n unchanged. Review KEEP |
| 48091 | Comal | A n=103207 | 2025 n=103207 yb=0 la=103207 | 2025 / stratmap-roll | On inspect. Acres filled. year_built stayed 0. Review KEEP |
| 48121 | Denton | A n=351798 | 2025 n=351798 yb=300454 la=351789 | 2025 / stratmap-roll | On inspect. n unchanged. 9 keys still null acres. Review KEEP |
| 48139 | Ellis | B +98150 | 2025 n=98150 yb=0 la=98149 | registry null | Greenfield. 2026 still absent. Review KEEP |
| 48149 | Fayette | B +22432 | 2025 n=22432 yb=12014 la=22432 | registry null | Greenfield. Years and acres filled. 209 no-Prop_ID skips. Review KEEP |
| 48163 | Frio | B +12489 | 2025 n=12489 yb=0 la=12489 | registry null | Greenfield. Acres filled. year_built 0. CAD REST honest_absent. Review KEEP |
| 48171 | Gillespie | B +31452 | 2025 n=31452 yb=17201 la=31452 | registry null | Greenfield. Years and acres filled. 305 no-Prop_ID skips. Review KEEP |
| 48187 | Guadalupe | A n=93728 | 2025 n=93728 yb=69294 la=93728 | 2025 / stratmap-roll | On inspect. n unchanged. Probe 48187:106109 yearBuilt 1994. Review KEEP |
| 48221 | Hood | B +50876 | 2025 n=50876 yb=0 la=50876 | registry null | Greenfield. Acres filled. year_built 0. STAT_LAND_ blank. Review KEEP |
| 48231 | Hunt | B +69542 | 2025 n=69542 yb=48088 la=69542 | registry null | Greenfield. Years and acres filled. 9 no-Prop_ID skips. Review KEEP |
| 48251 | Johnson | B +100603 | 2025 n=100603 yb=0 la=100601 | registry null | Greenfield. Acres filled. year_built 0. 2 null-acres keys named. Review KEEP |
| 48255 | Karnes | B +12397 | 2025 n=12397 yb=0 la=12393 | registry null | Greenfield. Acres filled. year_built 0. 4 null-acres keys named. Review KEEP |
| 48257 | Kaufman | A n=93292 | 2025 n=93292 yb=69244 la=93292 | 2025 / stratmap-roll | On inspect. n unchanged. Probe 48257:10005 yearBuilt 1993. Review KEEP |
| 48259 | Kendall | B +28852 | 2025 n=28852 yb=19193 la=28852 | registry null | Greenfield. Years and acres filled. 438 no-Prop_ID skips. Review KEEP |
| 48265 | Kerr | B +34594 | 2025 n=34594 yb=0 la=34594 | registry null | Greenfield. Acres filled. year_built 0. STAT_LAND_ blank. Review KEEP |
| 48287 | Lee | B +14769 | 2025 n=14769 yb=8359 la=14769 | registry null | Greenfield. Years and acres filled. 25 no-Prop_ID skips. Review KEEP |
| 48299 | Llano | B +34821 | 2025 n=34821 yb=15911 la=34820 | registry null | Greenfield. Years and acres filled. 1 null-acres key named. 37 no-Prop_ID skips. Review KEEP |
| 48325 | Medina | B +40571 | 2025 n=40571 yb=22366 la=40571 | registry null | Greenfield. Years and acres filled. Review KEEP |
| 48367 | Parker | B +92583 | 2025 n=92583 yb=0 la=92583 | registry null | Greenfield. Acres filled. year_built 0. STAT_LAND_ blank. 1022 no-Prop_ID skips. Review KEEP |
| 48397 | Rockwall | B +52420 | 2025 n=52420 yb=0 la=52419 | registry null | Greenfield. Acres filled. year_built 0. STAT_LAND_ blank. 1 null-acres key named. CAD REST honest_absent. Review KEEP |
| 48425 | Somervell | B +6584 | 2025 n=6584 yb=0 la=6584 | registry null | Greenfield. Acres filled. year_built 0. Review KEEP |
| 48493 | Wilson | B +28006 | 2025 n=28006 yb=14226 la=28006 | registry null | Greenfield. Years and acres filled. Review KEEP |
| 48497 | Wise | B +48428 | 2025 n=48428 yb=0 la=48428 | registry null | Greenfield. Acres filled. year_built 0. STAT_LAND_ blank. Review KEEP |

Writer SHA for every apply: `46e1a5a1`. Gate packet `ldtSha` is that same 8-char string.

## KEEP archive (do not rewrite)

Farm done. No next FIPS on this gate.

| # | FIPS | County | Status |
| --- | --- | --- | --- |
| 8 | 48029 | Bexar | **KEEP.** Path A n=703258 yb=619203 la=703258. Review `_inbox/2026-08-25_review_bexar_48029_leftover.md`. |
| 9 | 48031 | Blanco | **KEEP.** Path B +13648 yb=0 la=13648. Review `_inbox/2026-08-25_review_blanco_48031_leftover.md`. |
| 10 | 48053 | Burnet | **KEEP.** Path B +49243 yb=24607 la=49243. Review `_inbox/2026-08-25_review_burnet_48053_leftover.md`. |
| 11 | 48085 | Collin | **KEEP.** Path A n=387334 yb=338301 la=387334. Review `_inbox/2026-08-25_review_collin_48085_leftover.md`. |
| 12 | 48091 | Comal | **KEEP.** Path A n=103207 yb=0 la=103207. Review `_inbox/2026-08-25_review_comal_48091_leftover.md`. |
| 13 | 48121 | Denton | **KEEP.** Path A n=351798 yb=300454 la=351789. Review `_inbox/2026-08-25_review_denton_48121_leftover.md`. |
| 14 | 48139 | Ellis | **KEEP.** Path B +98150 yb=0 la=98149. Review `_inbox/2026-08-25_review_ellis_48139_leftover.md`. |
| 15 | 48149 | Fayette | **KEEP.** Path B +22432 yb=12014 la=22432. Review `_inbox/2026-08-25_review_fayette_48149_leftover.md`. |
| 16 | 48163 | Frio | **KEEP.** Path B +12489 yb=0 la=12489. Review `_inbox/2026-08-25_review_frio_48163_leftover.md`. |
| 17 | 48171 | Gillespie | **KEEP.** Path B +31452 yb=17201 la=31452. Review `_inbox/2026-08-25_review_gillespie_48171_leftover.md`. |
| 18 | 48187 | Guadalupe | **KEEP.** Path A n=93728 yb=69294 la=93728. Review `_inbox/2026-08-25_review_guadalupe_48187_leftover.md`. |
| 19 | 48221 | Hood | **KEEP.** Path B +50876 yb=0 la=50876. Review `_inbox/2026-08-25_review_hood_48221_leftover.md`. |
| 20 | 48231 | Hunt | **KEEP.** Path B +69542 yb=48088 la=69542. Review `_inbox/2026-08-25_review_hunt_48231_leftover.md`. |
| 21 | 48251 | Johnson | **KEEP.** Path B +100603 yb=0 la=100601. Review `_inbox/2026-08-25_review_johnson_48251_leftover.md`. |
| 22 | 48255 | Karnes | **KEEP.** Path B +12397 yb=0 la=12393. Review `_inbox/2026-08-25_review_karnes_48255_leftover.md`. |
| 23 | 48257 | Kaufman | **KEEP.** Path A n=93292 yb=69244 la=93292. Review `_inbox/2026-08-25_review_kaufman_48257_leftover.md`. |
| 24 | 48259 | Kendall | **KEEP.** Path B +28852 yb=19193 la=28852. Review `_inbox/2026-08-25_review_kendall_48259_leftover.md`. |
| 25 | 48265 | Kerr | **KEEP.** Path B +34594 yb=0 la=34594. Review `_inbox/2026-08-25_review_kerr_48265_leftover.md`. |
| 26 | 48287 | Lee | **KEEP.** Path B +14769 yb=8359 la=14769. Review `_inbox/2026-08-25_review_lee_48287_leftover.md`. |
| 27 | 48299 | Llano | **KEEP.** Path B +34821 yb=15911 la=34820. Review `_inbox/2026-08-25_review_llano_48299_leftover.md`. |
| 28 | 48325 | Medina | **KEEP.** Path B +40571 yb=22366 la=40571. Review `_inbox/2026-08-25_review_medina_48325_leftover.md`. |
| 29 | 48367 | Parker | **KEEP.** Path B +92583 yb=0 la=92583. Review `_inbox/2026-08-25_review_parker_48367_leftover.md`. |
| 30 | 48397 | Rockwall | **KEEP.** Path B +52420 yb=0 la=52419. Review `_inbox/2026-08-25_review_rockwall_48397_leftover.md`. |
| 31 | 48425 | Somervell | **KEEP.** Path B +6584 yb=0 la=6584. Review `_inbox/2026-08-25_review_somervell_48425_leftover.md`. |
| 32 | 48493 | Wilson | **KEEP.** Path B +28006 yb=14226 la=28006. Review `_inbox/2026-08-25_review_wilson_48493_leftover.md`. |
| 33 | 48497 | Wise | **KEEP.** Path B +48428 yb=0 la=48428. Review `_inbox/2026-08-25_review_wise_48497_leftover.md`. Farm done. |

CAPCOG leftover for the named five is complete. Bexar KEEP closed the hand-carry loop. The planner-owned farm (`_decisions/2026-08-25_leftover_farm_autonomous.md`) is done: Wise 48497 KEEP closed the last tranche-1 leftover.

## After CAPCOG

Farm done. No next FIPS on this gate. Skip list is a refuse list, not a work queue:

- 48055, 48021, 48209, 48491, 48453, 48013, 48019, 48029, 48031, 48053, 48085, 48091, 48121, 48139, 48149, 48163, 48171, 48187, 48221, 48231, 48251, 48255, 48257, 48259, 48265, 48287, 48299, 48325, 48367, 48397, 48425, 48493, 48497 once written
- Dallas 48113 and Tarrant 48439 (`bulk_primary`; CLI needs `--allow-stratmap-fallback`; the gate refuses that flag)
- Any second county in the same session
- Gold 48021 rewrite
- L17 flip
- Atoms `--apply`
- Rematerialize

Dallas / Tarrant leftover is a later named card if the operator wants those two through a different gate contract. Not this queue.

## Tranche-1 leftover set (KEEP, farm done)

Mechanical pick: `_catalog/tx_cad_source_registry.json`, FIPS ascending, skip KEEP set and `bulk_primary` Dallas 48113 / Tarrant 48439. Eligible leftover in this registry: **33**. KEEP **33**. In flight **none**. Farm done. Dallas 48113 and Tarrant 48439 stay skipped.

This is not 254 Texas leftover. The registry file is tranche 1 only (CAPCOG + AACOG + NCTCOG metro core). Counties not in that file are unnamed until a later roster.

| # | FIPS | County | L17 | Status |
| --- | --- | --- | --- | --- |
| 8 | 48029 | Bexar | 2025 / stratmap-roll | KEEP |
| 9 | 48031 | Blanco | null | KEEP |
| 10 | 48053 | Burnet | null | KEEP |
| 11 | 48085 | Collin | 2025 / stratmap-roll | KEEP |
| 12 | 48091 | Comal | 2025 / stratmap-roll | KEEP |
| 13 | 48121 | Denton | 2025 / stratmap-roll | KEEP |
| 14 | 48139 | Ellis | null | KEEP |
| 15 | 48149 | Fayette | null | KEEP |
| 16 | 48163 | Frio | null | KEEP |
| 17 | 48171 | Gillespie | null | KEEP |
| 18 | 48187 | Guadalupe | 2025 / stratmap-roll | KEEP |
| 19 | 48221 | Hood | null | KEEP |
| 20 | 48231 | Hunt | null | KEEP |
| 21 | 48251 | Johnson | null | KEEP |
| 22 | 48255 | Karnes | null | KEEP |
| 23 | 48257 | Kaufman | 2025 / stratmap-roll | KEEP |
| 24 | 48259 | Kendall | null | KEEP |
| 25 | 48265 | Kerr | null | KEEP |
| 26 | 48287 | Lee | null | KEEP |
| 27 | 48299 | Llano | null | KEEP |
| 28 | 48325 | Medina | null | KEEP |
| 29 | 48367 | Parker | null | KEEP |
| 30 | 48397 | Rockwall | null | KEEP |
| 31 | 48425 | Somervell | null | KEEP |
| 32 | 48493 | Wilson | null | KEEP |
| 33 | 48497 | Wise | null | KEEP |

Skipped forever on this gate: Dallas 48113, Tarrant 48439.

## Wave plan

Authority: `_inbox/2026-08-25_texas_complete_wave_plan.md`. Farm steward after KEEP: `_inbox/2026-08-25_wave_leftover_farm_handoff.md`. Canvas steward (parallel, no store write): `_inbox/2026-08-25_wave_canvas_steward_handoff.md`.

## After leftover hygiene

Factory 1 atoms `--apply` (one slot) is what moves Manifest off 667/3556. Do not start that wave from a leftover session.

Still parked: P-80 Travis join, P-79 REST writer, P-09 footprint, COVER / Harris PBF, Dallas/Tarrant CAMA, QA, PE tree, memory pin raise.
