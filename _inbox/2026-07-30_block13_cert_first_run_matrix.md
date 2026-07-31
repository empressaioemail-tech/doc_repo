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

## RE-GRADE #1 (2026-07-30, after R22/R26/R27 + R28 winding fix merged + prod re-warm)
6 OF 6 re-warmed parcels now serve CORRECT MEASURED envelopes on the LIVE app (34145 control + 34153/34137/34169/34177/34161). All source = bastrop-per-parcel-record-layer-23 (not repealed). Measured per-edge inset in feet matches OnClick setbacks (interior side 5.0, corner 14.9≈15, front/rear per district). Served sqft == re-warm target, independently shoelace-re-measured within ~1% (honest geometry, not asserted). The R21 measured-geometry gate WORKS on the live app — "setbacks not drawn right" is RESOLVED for these 6. R28 winding fix proven live.
OUTSTANDING: 34121 (irregular 3-ring split-zone) fails R5 near-rect gate — pending R29 relaxation (convexity-required-iff-lot-near-rect). Split-zone zoning-fact re-stamp (34121/34161/34169 -> dominant). Pickup: /boundary-edges endpoint still serves stale road-class edges (decoupled from envelope, doesn't corrupt the grade, but stale).
SCORE: 6/7 measured-clean. Finish+extend CONFIRMED (no rebuild; model correct, bugs were coverage/drift/winding).

## SESSION-CLOSE STATE (2026-07-30, PAUSED — data layer solid, envelope grade in dispute)

ALL PROD WRITES DONE + STABLE (nothing half-applied):
- All 7 Block-13 parcels re-warmed + PROMOTED to serving Neon (34145 control + 34153/34137/34169/34177/34161 + 34121-via-R29). Buildable sqft: 34145=9099, 34153=5281, 34137=9350, 34169=6890, 34177=13083, 34161=15673, 34121=15159.
- Split-zone zoning-facts RE-STAMPED to dominant: 34121→GC, 34161→MU, 34169→SF-1 (applied).

ALL CODE MERGED TO MAIN (green CI each):
- dd9fc1d Block-13 R22/R25/R26/R27 (fire-code side, split-zone dominant, full fields, envelope invalidation)
- e7924a5 R28 winding-recompute (the deep two-agent bug — swapped BCAD ring reused CW-built normals → wrong-edge inset → null; PROVEN live)
- 6399c29 R29 R5-convexity-gated-behind-lot-near-rect (irregular lots get valid non-convex envelope)
- PE #120 (4398418) card display: interior/corner side split + full-field + second-source disclosure

CONFIRMED 7/7 (both re-grades agree): the SETBACK/ZONING DATA layer. Every parcel serves correct district (dominant for splits) + correct setbacks (25/5/25 etc.) + source=bastrop-per-parcel-record-layer-23 (NOT repealed/descriptor-fixture) + full fields, verified 2026-07-30.

THE OPEN QUESTION (resolve fresh): the DRAWN ENVELOPE grade CONFLICTS.
- Re-grade #1 (perpendicular-distance): 6/6 clean.
- Re-grade #2 (independent shapely re-derive + IoU): 3/7 — claims 34169 draws UNIFORM-15ft inset not per-edge 25/5/15/25 (IoU 0.637 to per-edge, 1.000 to uniform); 34121/34161/34177 per-edge mismatch on the irregular/multi-edge lots. The 3 clean per both: 34145/34153/34137 (rectangular lots).
- The dispute is ONLY the drawn polygon on IRREGULAR/MULTI-EDGE lots; rectangular lots pass both. Facet check: 34169 serves setbacks 25/5/25, envelope status ok, 6890 sqft — but whether the polygon insets per-edge or uniform is UNRESOLVED.
- RESOLVE VIA TWO INDEPENDENT MEASURERS (blind, like the winding-bug diagnosis): measure 34169 + 34121 served envelope polygon vs true lot ring in feet. If they converge → truth (7/7 or a real per-edge-envelope bug on irregular lots). Do NOT trust either prior grade.

PICKUPS (non-blocking): boundary-edge PRIMITIVE atoms still carry legacy descriptor-fixture/repealed-B3 sourceUrls + road-class-setback-table setback=0 (the authoritative served setback-rule OVERRIDES them, so decoupled + non-corrupting — but stale, worth a cleanup). retrieval-api R27/R13 hardening deploy still pending (current rev 00045-yek already has R13 filter; R27 envelope-invalidation is the redeploy).

METHOD PROVEN: the block-cert harness (three-way convergence PE/SmartCity/GIS + measured-geometry-in-feet) IS the automated visual/geometry QA instrument for the fan-out. Replicate to a next block after Block-13 hits 7/7.
