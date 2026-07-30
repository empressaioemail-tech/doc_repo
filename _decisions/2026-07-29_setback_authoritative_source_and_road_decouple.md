---
id: 2026-07-29_setback_authoritative_source_and_road_decouple
title: Decision — setbacks come from the jurisdiction's AUTHORITATIVE per-parcel record (plan-reviewer-grade), decoupled from the road twin
date: 2026-07-29
type: decision_record
status: active
owner: nick
decided_by: nick (operator), captured by claude_code (planner)
related: [28_THE_BASTROP_MOLD_engine_build_spec, 27c_road_node_engine_and_warm_digital_twin_spec, 29_scale_warm_architecture, 2026-07-26_v2_sourcing_recon_bastrop]
reversal_criteria: reverse only if a jurisdiction genuinely publishes NO authoritative dimensional record and the only source is code-transcription — then the fallback tier applies, but the primary principle (authoritative ORDINANCE-TEXT record, plan-reviewer-grade, road-decoupled) stands.
amended: 2026-07-29 — probe B + adversarial review corrected two things below (see AMENDMENT). The rulings stand; the source mechanic and the "which code" fact are corrected.
---

# Setbacks: authoritative source, road-decoupled

Root cause found (3-probe diagnosis 2026-07-29, DEEPENED by probe B): our setback engine KEYED SETBACK VALUES ON ROAD-CLASS (front-on-collector vs front-on-local, with not_specified defaults). That is the wrong model. But the deeper root cause probe B found: BASTROP REPEALED THE B3 CODE. Ordinance 2026-06 ("B3 Code Repeal and Bastrop Development Code Adoption") passed 2026-04-14, effective immediately. The replacement is the Bastrop Development Code (BDC), Chapter 14 — a conventional EUCLIDEAN code with real districts (P/OS, RR, SF-1, SF-2, SF-3, MU, GC, PI, IND, PDD) and plain minimum setbacks. Place Types P-1..P-5 NO LONGER EXIST in law. Our corpus ingested the REPEALED B3 on 2026-05-26 (six weeks AFTER repeal); currentEditionId still points at the dead B3; our zoning stamp reads the city's ABANDONED 2023 layer (returns P-3). 1010 Jefferson St is SF-1 = 30/10/20/30, height 35, impervious 50% — not any P-3 value. So both our setback tables (descriptor front=15, adapter front=25) describe a REPEALED district; the 25-vs-15 reconciliation is a red herring — both serve a dead code.

## RULINGS (operator 2026-07-29)

1. GIVE THE PRACTICAL ANSWER. Serve the real, usable dimensional numbers a builder/plan-reviewer applies day-to-day (front/side/corner-side/rear/height/impervious/min-lot), NOT the form-based "it's a rule / neighbor-average" reading. Practical = what SCALES NATIONWIDE (every jurisdiction has practical numbers a plan reviewer applies; not every jurisdiction is form-based).

2. ROADS STAY A TWIN, DECOUPLED FROM SETBACKS. The mix-up was using the ROAD as the setback MEASUREMENT BASIS. The road node as a first-class twin (centerline, ROW, classification — for frontage, digital twin, rendering, and knowing WHICH edge is the front) is CORRECT and STAYS. KILL only the road-class -> setback-VALUE dependency. Roads may still identify the front EDGE; they must not supply the setback NUMBER. Do NOT kill the road twin.

3. AUTHORITATIVE PLAN-REVIEWER-GRADE SOURCE. Setbacks come from the record the jurisdiction's own PLANNING & ZONING department uses — the record that STANDS AGAINST A PLAN REVIEWER. Not our PDF transcription of a stale edition, not our derivation. GENERALIZES: every county -> find the jurisdiction's authoritative CURRENT dimensional-standards record and use THAT. Public source, no relationship-privilege.

4. HYDRO VIZ — out of scope for this correction.

## AMENDMENT (2026-07-29, post probe-B + adversarial review)

Two corrections to the source mechanic above:

CORRECTION A — the clean source is ORDINANCE TEXT, not the per-parcel GIS card. The original ruling named the city's Parcels_One_Click / Zoned_Parcels ArcGIS card as the authoritative record. Probe B found the city's own per-parcel GIS card carries DATA-ENTRY DRIFT (a stray SF-1 parcel reads 30/5/25, disagreeing with the adopted SF-1 chart of 30/10/20/30; the 5/15/25 triplet the operator saw on his map matches NO adopted district and traces to that drifted row). So: the authoritative record is the ADOPTED ORDINANCE TEXT (BDC Chapter 14, Sec. 14.02.003 dimensional table). The GIS layer (Zoned_Parcels/83) is used ONLY to map parcel -> district; the setback NUMBERS come from ordinance text. "Plan-reviewer-grade" = ordinance-text-true, not GIS-card-copied.

CORRECTION B — edition currency is now a first-class requirement. The incident's true root was serving a REPEALED edition. The fix is not just correct numbers; it's ingesting the CURRENT code (BDC), flipping currentEditionId off the repealed B3, and fixing the stamp to read the live zoning layer (SF-x) not the abandoned 2023 layer (P-x).

CORRECTION C — the flat scalar setback model cannot hold conditional BDC standards (MU attached-vs-detached, "15 ft abutting residential," highway-corridor-cumulative 14.02.007, contextual neighbor-average 14.02.006, overlay "* unless adjusted by overlay"). Adversarial review (file:line verified) confirmed the atom shape is one scalar per axis. Ruling stands as: serve the practical minimum where the model can hold it HONESTLY; where a district's standard is conditional/contextual, HONEST-DECLINE (existing no-setback-row path) rather than flatten to a wrong number. Do not fabricate a scalar for a conditional rule.

## AMENDMENT 2 (2026-07-30, post live-QA — REVERSES CORRECTION A on the number source)

Operator ran the live side-by-side (PE vs SmartCity) on 1010 Jefferson after the BDC correction shipped. Zoning was fixed (SF-1). But the setback NUMBERS still disagreed: PE served 30/20/30 (the ordinance-text chart, per CORRECTION A); the City of Bastrop's per-parcel Development Services record showed 25 front / 5 side (corner 15) / 25 rear, height 35, impervious 50, min-lot 1/3 ac. The two CITY sources genuinely disagree with each other (the drift CORRECTION A named) — and CORRECTION A bet on the wrong one for the product's promise.

RULING R1 (source reversal) — the AUTHORITATIVE PER-PARCEL RECORD is primary for the setback NUMBER; ordinance text is the CITATION/verification layer, not the number source. When the adopted-ordinance chart and the jurisdiction's per-parcel record disagree, the RECORD THE PLAN REVIEWER ACTUALLY APPLIES wins — because "will this pass plan review" is the product promise, and the reviewer applies the per-parcel record, not the chart. Verified acquirable via a UNIFORM PUBLIC path: SmartCity reads it from the City of Bastrop's own public ArcGIS Feature Server (services7.arcgis.com/qOeXJdBtGknaCJC4) — a public endpoint, NOT a relationship pipe (confirmed in smartcity-os/server/routes/esri.ts). No-relationship rule holds: every county's authoritative per-parcel dimensional record is a public source; the mold reads THAT. This REVERSES CORRECTION A (which is preserved above as the reasoning trail: text-first was right about the drift, wrong about which source a reviewer honors; live evidence settled it).

RULING R2 (model shape) — EXTEND the flat scalar model to carry INTERIOR-SIDE and CORNER-SIDE as distinct fields end-to-end (atom -> warm -> PE card). Our card served one Side value (20') where the record carries two (interior 5', corner 15'); a corner lot like 1010 Jefferson must show both. This is the flat-scalar limit adversarial review flagged (CORRECTION C), now fixed by extension rather than honest-decline for the multi-value-axis case. (CORRECTION C's honest-decline still applies to genuinely CONDITIONAL standards — MU attached-vs-detached, abutting-residential, highway-corridor-cumulative — that no per-axis field can hold.)

## AMENDMENT 3 (2026-07-30, post BLOCK-LEVEL QA — CERT REVOKED)

Operator swept the surrounding block (not just the subject parcel) and the 2026-07-30 CERTIFIED-CLEAN is REVOKED. Block-level QA exposed what parcel-sampling hid:

FINDING F1 — PARTIAL RE-WARM (side-by-side regime split). 1004 Jefferson (34081, verified 2026-07-29) still serves the REPEALED P-5 code ("F 15, S/R not specified, build-to governs") while its next-door neighbors 1006 Jefferson + 1003 Spring (verified 2026-07-30) serve the new SF-1. The re-warm promoted 1777 and left 819 unpromoted — those 819 are STILL ON THE REPEALED REGIME, not an "honest geometry residual." Adjacent identical-zoning parcels on two different code regimes = incoherent; the cert audit sampled 4 parcels that were all in the good 1777 and missed it.

FINDING F2 — BLANK DISTRICTS. MU (1006 Hill, 34841) and GC (908 Chestnut, 34089) show "not verified here." The cert audit KNEW ("MU/GC/PDD absent", line 45) and filed it non-blocking. For the reference county these are core downtown districts; blank is a coverage hole, not a residual. Build them from the per-parcel record.

FINDING F3 — CORRUPT LOT-LINE GEOMETRY (operator theory, code-corroborated). 1006 Jefferson is a RECTANGULAR lot but its setback envelope is a JAGGED polygon with a jog. The setback math is clean (probe A); the engine is insetting a CORRUPT BOUNDARY. Theory: a shared lot-line segment carries corrupt metadata (bad vertex/bearing/mis-joined shared edge). Corroborated: `depth-warm/geometry.ts:181,199-200` fails on "inset ring is null" / self-intersect / self-touch — the exact signatures a corrupt shared edge produces — and boundary geometry + shared-edge adjacency are built upstream in `boundary-primitive/` (adjacency-grid, compute). LIKELY the same root cause as the 819 null-ring verifyFails. Fix = rescrub lot-line/boundary metadata in the test area, don't just re-inset.

RULING R3 — CERT BAR IS AREA-SWEEP, NOT PARCEL-SAMPLE. Re-cert requires sweeping EVERY parcel in a defined area (all districts) and asserting each is internally consistent + matches the city per-parcel record + no blank/stale/old-code parcel + clean envelope geometry. Fail if ANY parcel in the area is wrong. This becomes the mold's re-cert standard for every county (anti-sampling gate). Parcel-sampling certified a broken county; it is retired as the cert method.

RULING R4 — FOCUSED-DOWNTOWN DRILL. Do NOT re-warm all of Bastrop and sample-check. Take a focused downtown Bastrop test area (has SF-1 + MU + GC + dense shared-lot-line geometry), fix all four defects (source-switch, 100% promotion, MU/GC/PDD, lot-line scrub) IN THAT AREA, area-sweep-verify every parcel, THEN expand. Tighter, honest loop.

## AMENDMENT 4 (2026-07-30, post AREA-SWEEP #1 — gate under-strict, 3 buckets remain)

First area-sweep ran and correctly FAILED (24/36 PASS) — the anti-sampling gate working. Remaining 12 split into three clean buckets:
- BUCKET 1 (PE DISPLAY, 8 parcels incl 105054): substrate CORRECT (25/5/15/25) but the PE card renders one side=15 instead of interior 5 / corner 15. Frontend fix in hauska-map (STEP1's "PE card if needed" IS needed). Not a data problem.
- BUCKET 2 (WARM FAILURES, 4-5 parcels): 34065 + 34881 stale (never promoted, still show front 15 vs L23 25); 34785 + 39282 declined (verify-fail at promote); 34769 GC rear=0 vs L23=20. Need actual re-warm/promotion — STEP4 didn't cover them.
- BUCKET 3 (GEOMETRY GATE UNDER-STRICT — operator caught): sweep passed 34073 as "clean 6-vertex envelope," but a rectangular lot must inset to a 4-vertex rectangle. Operator's live screenshot shows a NOTCH the mechanical gate accepted. The audit's own criterion (line 83) is "rectangular lot -> clean rectangular envelope," but assertion (e) only tested not-null / not-self-intersecting, so it passed a notched shape. A GATE THAT PASSES A SHAPE IT SAYS IT REJECTS IS THE EXACT TRAP WE ARE CLOSING.

RULING R5 (geometry gate must enforce its stated invariant) — assertion (e) must MECHANICALLY assert: a rectangular/convex parcel ring insets to a matching-topology convex envelope (a 4-edge rectangle -> ~4-vertex convex inset) or FAILS with a FLAGGED reason (easement/overlay/conditional frontage). Vertex-count/convexity is a real assertion, not "no self-intersect." The residual notch on 34073 is residual shared-lot-line corruption; finish the boundary-primitive scrub so the envelope is a true rectangle. This tightens mold gate (e).

RULING R6 (operator live-QA is a NAMED cert step, not optional) — the mechanical sweep passed a parcel the operator's eye failed. Both gates are required: the mechanical area-sweep AND operator live block-QA on the swept area. Cert is not claimed until BOTH pass. (This is why R3's mechanical sweep alone is insufficient — it can be under-strict; the human catches what the assertion missed, and that catch tightens the assertion.)

## MOLD IMPLICATION (revised per AMENDMENT 2)
The mold's setback model = the jurisdiction's AUTHORITATIVE PER-PARCEL DIMENSIONAL RECORD (public GIS Feature Server, plan-reviewer-grade) as the NUMBER source, cited to the ordinance link that record carries; parcel->district mapped from the live zoning layer; ordinance text ingested as the CITATION/verification layer (and the edition-currency anchor); road-DECOUPLED; multi-value axes (interior/corner side) carried as distinct fields; honest-decline only on genuinely conditional standards no per-axis field can hold. NEW mold gates: (a) a setback-rule atom must cite the authoritative record + its ordinance link; (b) exactly ONE authoritative per-parcel record per jurisdiction (kill dual-fork); (c) EDITION-CURRENCY gate — currentEditionId must not point at a repealed edition, and an edition stub with sectionIds:[] must fail the bake (scoped to exclude legitimately-thin building-code editions); (d) NEW — where the per-parcel record and the ordinance chart DISAGREE, the per-parcel record wins for the number and the disagreement is FLAGGED (not silently resolved). This is a mold-level correction and it GATES scaling. The PRACTICAL per-parcel record a plan reviewer applies is the universal, scalable answer.
