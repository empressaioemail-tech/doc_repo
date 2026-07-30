---
id: 2026-07-30_block13_cert_first_run_matrix
title: Block-13 cert — first run convergence matrix (READ-ONLY, pre-fix failure map)
date: 2026-07-30
status: first-run-complete (1/7 clean; fix dispatch to follow)
owner: nick
related: [30_block_cert_harness_spec, 2026-07-29_setback_authoritative_source_and_road_decouple]
purpose: The true failure map for Block 13 before any fixes. Three-way convergence (PE / SmartCity / city GIS) + measured envelope geometry. Drive this to 7/7 clean.
---

# Block-13 first-run convergence matrix

Read-only run 2026-07-30. Answer key = City GIS layer-23 / SmartCity OnClick (R25: OnClick draws, layer-83 Revisions cited as second source). Envelope inset MEASURED in feet vs the parcel lot ring (R21).

## Answer key (layer 23 / OnClick == SmartCity, confirmed converging)
| APN | Situs | District | F | Side | Corner | R | H | Imp | MinLot |
|---|---|---|---|---|---|---|---|---|---|
| 34145 | 909 Pecan | GC | 20 | 5 | - | 20 | 55 | 65% | 1/4 |
| 34121 | 907 Chestnut | GC (dom; split GC+MU+SF) | 20 | 5 | - | 20 | 55 | 65% | 1/4 |
| 34153 | 909 Chestnut | GC | 20 | 5 | - | 20 | 55 | 65% | 1/4 |
| 34137 | 908 Pine | SF-1 | 25 | 5 | 15 | 25 | 35 | 50% | 1/3 |
| 34169 | 906 Pine | SF-1 (dom; split SF+MU) | 25 | 5 | 15 | 25 | 35 | 50% | 1/3 |
| 34177 | 901 Pecan | MU | 15 | 5* | - | 15 | 40 | 60% | 1/3 |
| 34161 | 905 Pecan | MU (dom; split MU+GC) | 15 | 5* | - | 15 | 40 | 60% | 1/3 |
*MU side "None - Reference Building/Fire Code" -> serve 5' fire-code standard, cited (R22). SF-1 front carries "porches may encroach up to 10 ft".

Second source to CITE (R25): layer-83 Revisions — SF-1 30/10(corner20)/30, MU H45, GC corner10. Called out as a conflicting city schedule, not drawn.

## What PE serves + measured geometry
| APN | PE district | PE setbacks | Source adapter | Envelope status | MEASURED inset (ft) | Verdict |
|---|---|---|---|---|---|---|
| 34145 | GC ✓ | 20/5/20 ✓ | layer-23 ✓ | ok 9,099sf | 20.2/5.1/20.2 ✓ | **CLEAN** |
| 34153 | GC ✓ | 20/5/20 ✓ | layer-23 ✓ | ok 5,281sf | ~12.6 uniform ✗ | FAIL geometry-out-of-sync |
| 34121 | MU ✗ (sliver) | 15/0/15 | layer-23 | ok 14,572sf | front ~7.3 vs 15 ✗ | FAIL district(split) + side0 + geometry |
| 34137 | SF-1 ✓ | DECLINED | descriptor-fixture (repealed) | declined (raw draws 30/10/30) | - | FAIL stale-source-decline |
| 34169 | SF-1 stamp / setback P-3 ✗ | DECLINED | descriptor-fixture (repealed P-3) | declined (raw draws 15/0/5) | - | FAIL stale + internal-district-conflict |
| 34177 | MU ✓ | DECLINED | descriptor-fixture (repealed) | declined | - | FAIL stale-source-decline |
| 34161 | MU ✓ | DECLINED | descriptor-fixture (repealed) | declined | - | FAIL stale-source-decline |

## Score: 1 / 7 clean

## Failures -> fixes (all coverage/drift, none are engine-math rebuilds)
1. STALE-SOURCE DECLINE (34137, 34169, 34177, 34161): re-warm from layer-23. (34169 also fix the SF-1-vs-P-3 internal district conflict.)
2. ENVELOPE OUT OF SYNC (34153, 34121): re-warm so envelope re-insets to the current setback rule (persisted envelope was baked from an older value).
3. SPLIT-ZONE DISTRICT (34121 -> GC dominant, 34169 -> SF-1 dominant): R26 dominant-area governs, disclose minors.
4. MU SIDE (34177, 34161): serve 5' fire-code (R22), not decline.
5. STALE ENVELOPE UNDER DECLINE (all 4 declined): R27 invalidate the dependent envelope atom, don't just suppress at card.
6. FULL FIELDS: surface impervious/height/min-lot on the card for all 7 (mostly parsed already).
7. SECOND-SOURCE DISCLOSURE (R25): add the layer-83 Revisions conflict callout to property details.

Target: re-run the harness -> 7/7 clean (every field converges PE==OnClick, every envelope measures to its rule, geometry within ~1ft), then operator visual confirm, then replicate the METHOD to a next block.
