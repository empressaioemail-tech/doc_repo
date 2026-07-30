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

## AMENDMENT 5 (2026-07-30, post READ-ONLY GEOMETRY PROBE — theory overturned; real bug is resolution-absence)

A read-only geometry dump (SELECT-only, BCAD + both Neon DBs, no writes) on the three suspect parcels (34073, 34785 declined, 39282 declined) OVERTURNED the geometry-corruption theory:
- RINGS ARE CLEAN. No spurious/duplicate vertex, no phantom shared-edge, no self-intersection on any parcel. Stored rings match BCAD in shape+count (diffs are a uniform ~3m georef offset + ±1 legitimate corner). The "6-vertex rectangular lot" on 34073 was a FALSE POSITIVE (real small jog present in BCAD too + closing-vertex counting). STEP3 (lot-line geometry scrub) was chasing a non-bug; scrubbing clean rings accomplishes nothing and risks injecting the 3m BCAD offset as noise. STEP3 is CANCELLED/repurposed.
- THE REAL ROOT CAUSE is SETBACK-RESOLUTION ABSENCE. Every decline is `insetPerEdgeFromPrimitive` bailing on "non-finite setback distance" because an edge carries a `setbackAbsence`: (i) `unmapped-adjacency` when an edge matched no neighbor parcel AND no road (34073 west edge; 34785 two edges); (ii) `no-setback-row` when the district has no table row (39282 is GC; `bastrop-development-code.json` OMITS GC/MU by design per CORRECTION C). NaN on any edge kills the WHOLE envelope.
- SECONDARY: persisted boundary-edge atoms DISAGREE with a fresh recompute on edge→neighbor/setback assignment (labeling DRIFT — atoms baked against older adjacency/road/district state, never re-labeled). Same class as partial-re-warm: stale persisted ≠ current truth.

RULING R7 (unmapped-but-known-role → district default, not NaN). An edge with a KNOWN district and KNOWN role (side/rear/front) resolves to the DISTRICT's setback for that role even when no neighbor parcel/road was detected — the setback value comes from the DISTRICT, not the adjacency; adjacency only picks the ROLE. SF-1 side = 5ft regardless of neighbor detection. Only genuinely role-UNKNOWABLE edges decline. Fixes clean-lot declines 34073, 34785. (`compute.ts:104` currently returns `unmapped-adjacency` absence → NaN; must return district-default-for-role.)

RULING R8 (GC/MU resolve from the per-parcel record — supersedes CORRECTION C for record-covered districts). CORRECTION C honest-declined GC/MU because ordinance TEXT is conditional. But AMENDMENT 2 R1 made the PER-PARCEL RECORD the number source, and layer 23 DOES carry GC=20/5/20 (and MU values). If the city publishes a scalar a plan reviewer applies, we SERVE it, cited to Ordinance_Link — even though the ordinance-text table omits it. GC/MU resolve from the per-parcel record; only genuinely non-scalar conditional axes (MU attached-vs-detached text) honest-decline, and GRACEFULLY (show parcel+zoning+"conditional, verify with city", never a broken/absent envelope). Fixes 39282. This resolves the CORRECTION-C-vs-AMENDMENT-2 conflict in favor of the record.

MOLD IMPLICATION of A5: geometry scrub is NOT a standard onboarding step (rings are trusted from BCAD; only diff-flag >1m dup/straight-split, don't scrub clean rings). The setback engine must (a) resolve district-default-for-role on unmapped-but-known-role edges, (b) source GC/MU/all-record-covered districts from the per-parcel record, (c) re-label persisted atoms so persisted == fresh recompute (kill labeling drift), (d) degrade gracefully (never a broken envelope) where a genuinely-conditional axis declines.

## AMENDMENT 6 (2026-07-30, post 2-parcel probe — last 2 failures are STALE DATA, not bugs, not un-buildable)

Sweep #2 reached 34/36. A read-only probe on the last 2 (34065, 39282) found NEITHER is an inset/setback code bug AND neither is a legitimate un-buildable decline — both are STALE DATA:

FINDING — 34065 (1005 Pecan) is a DEAD PROP_ID. BCAD returns 0 features for 34065; the parcel was RE-PLATTED into Pecan Place Subdivision (successors prop_id 8741972 + 8741974). Our downtown-drill manifest (both `bastropDowntownDrill.ts:61` and `_catalog/bastrop_downtown_drill_test_area.json:41`) references a prop_id that no longer exists in the county cadastral → no ring → null envelope. Fix is DATA: retire 34065, re-key to successors. NOT a math bug, NOT an un-buildable lot.

FINDING — 39282 (1001 Chestnut, GC) — R8 IS CORRECT; PE serves a STALE PERSISTED envelope. Live recompute is clean: BCAD 4-vertex rectangle (~14,328 sqft), layer 23 GC 20/20/5 with NO null axis, R8 resolves every edge to a real value → valid ~9,582 sqft envelope, `empty:false`. The "declined" on PE is a persisted-atom baked BEFORE R7/R8 landed, never re-promoted — the persisted≠recompute / Cloud-Run stale-serving pattern. Fix is RE-PROMOTE, not code.

FINDING — stale hardcoded fixture: `bastropDowntownDrill.ts:54` `SF1_SETBACKS_FT = {front:25, side:5, rear:15}` disagrees with live layer-23 SF-1 (rear 25). Pre-per-parcel-record leftover; retire it (the per-parcel record is the source, not a fixture constant). Didn't cause the declines but must not survive into the mold.

RULING R9 (NEW MOLD GATE — parcel-currency in the cadastral). The re-warm/manifest must verify each prop_id STILL EXISTS in the current county cadastral before warming. A dead/re-platted prop_id must surface as "superseded — re-key to successor(s)", NEVER as a silently-nulled envelope. At 254-county scale, cadastral churn (re-plats, splits, merges) is constant; a parcel-currency check is a required onboarding gate (companion to the edition-currency gate). This is the parcel-level analog of the Bastrop repealed-code lesson: the underlying record can go stale under you.

RULING R10 (persisted == recompute is a cert assertion). The recurring "persisted atom disagrees with fresh recompute" (34073, 39282, the partial re-warm) is the through-line defect. Cert must assert persisted == recompute for every swept parcel; a re-warm that leaves stale persisted state is not done. (If this keeps recurring, the deeper fix is compute-at-read-time rather than persist-the-labeling — flagged, not yet ruled.)

## AMENDMENT 7 (2026-07-30, post 37/37 — operator caught a NON-MANIFEST parcel serving REPEALED code; the sweep grades the LIST, not the MAP)

37/37 PASS, but operator block-QA clicked APN 8723767 (a downtown parcel PE renders) and found it serving the REPEALED build-to code: SF-1 but "F 15' · S/R not specified · build-to governs", verified 2026-07-29 (pre-fix stale). Root cause is a CERT-SCOPE loophole, not a warm bug:

FINDING — THE SWEEP GRADES THE MANIFEST, NOT THE MAP. The area-sweep iterates `DOWNTOWN_DRILL_MANIFEST_PROP_IDS` (a curated hardcoded list). 8723767 was EXPLICITLY EXCLUDED (`_catalog/bastrop_downtown_drill_test_area.json:91`: "Non-CAD prop_id in spatial query; not in BCAD roster"). But PE renders it from the retrieval parcel roster, so it shows on the customer map serving dead-code setbacks. R3 said "sweep EVERY parcel in the AREA"; it was IMPLEMENTED as "sweep every parcel in the MANIFEST" — and those sets diverge (re-plat successors, roster mismatches, late parcels). Any parcel that renders but isn't on the list is INVISIBLE to the gate. This is the R3 area-sweep principle's own loophole — the exact "silent partial coverage reads as done" trap, one level up: we swept a curated list and called the AREA certified.

FINDING — THE EXCLUSION MASKED THE DEFECT. "Not in BCAD roster → excluded" is precisely the silent-drop R9 was meant to prevent. A parcel whose identity is in flux (8723767 is an 8-digit successor-class prop_id, like the 34065 successors) is the R9 case — it must be FLAGGED and resolved, never silently dropped from cert. Excluding a rendered parcel from cert must itself be a flagged event a human accepts with a reason, not a silent manifest line.

RULING R11 (CERT SCOPE = WHAT RENDERS, NOT A CURATED LIST). The area-sweep must grade EVERY parcel that RENDERS in the test-area bbox (the set PE/retrieval actually serves to the customer), not a hardcoded manifest. A parcel that renders but can't be graded FAILS closed (or is a flagged, human-accepted exclusion with a reason) — never a silent skip. The manifest may seed the sweep, but the sweep's SCOPE is the rendered set. This becomes the mold cert standard: cert covers what the customer can see, full stop.

RULING R12 (8723767 must not serve repealed code). Whatever its roster status, a rendered SF-1 parcel must serve current BDC (F25/S5/R25) or honest-decline gracefully — NEVER "build-to governs" from the repealed regime. Identify 8723767 (probe), then warm-correct or graceful-decline. Re-warm covers ALL rendered downtown parcels, not just the 37.

## AMENDMENT 8 (2026-07-30, probe on 8723767 — the REPEALED-FALLBACK is the loaded gun; 2 unswept parcels; re-plat fix was incomplete)

Probe verdict on the non-manifest parcels:
- 8723767 is a REAL current BCAD parcel (split-zoned GC+SF-1, in the roster + layer 23). The manifest "not in BCAD roster" exclusion was FALSE — a lookup miss (split-zone double-row / null situs tripped the builder) that silently dropped it. It serves repealed code because it was excluded from the cohort → never re-warmed → its atom is frozen at the 2026-07-29 `descriptor-fixture` bake (B3 April 2025, F15/S0/R5).
- 8741973 is a SECOND unswept parcel — the DROPPED THIRD Pecan Place successor (34065 re-platted to Lots 1/2/3 = 8741972/8741973/8741974; the R9 fix kept 1+3, silently dropped Lot 2). Renders as a blank-card no-atom parcel. THE R9 RE-PLAT FIX WAS INCOMPLETE (2 of 3 successors).
- ARCHITECTURAL ROOT: PE renders parcels from a LIVE-GIS bbox query (county ArcGIS via cortex-api); the setback card is a SEPARATE per-parcel atom-chain; the sweep grades a THIRD thing (hardcoded list). Nothing reconciles the three. A live `descriptor-fixture` FALLBACK ADAPTER still serves REPEALED B3 numbers on ANY parcel the layer-23 re-warm missed — the loaded gun behind the whole class.

RULING R13 (REMOVE the repealed-B3 fallback — fail-closed, never serve dead code). The `descriptor-fixture` adapter path that serves repealed B3/build-to numbers is REMOVED (or hard-gated to fail-closed). Any parcel without a CURRENT per-parcel-record atom HONEST-DECLINES gracefully ("setbacks pending, verify with city"), NEVER serves repealed code. This closes the class nationwide: no missed parcel can silently serve dead code. The highest-leverage fix in the whole setback saga — the repealed regime must be UNREACHABLE, not just overridden where we remembered to re-warm.

RULING R14 (CERT SCOPE = RENDERED SET, fail-closed on gaps). Re-cert queries the LIVE-GIS parcel set PE actually renders in the bbox, diffs against atom coverage, and FAILS on any rendered parcel lacking a current atom (or serving repealed/blank). NO curated list as cert scope. A tooling lookup miss FLAGS, never silently excludes. Cert covers exactly what the customer can see. Mold cert standard.

RULING R15 (re-plat successor completeness). A re-plat gate must enumerate ALL successors (query the plat/roster for every child of a retired parent), not a subset. 34065→{8741972,8741973,8741974} must all be present. Incomplete successor capture is a silent hole.

## MOLD IMPLICATION (revised per AMENDMENT 2)
The mold's setback model = the jurisdiction's AUTHORITATIVE PER-PARCEL DIMENSIONAL RECORD (public GIS Feature Server, plan-reviewer-grade) as the NUMBER source, cited to the ordinance link that record carries; parcel->district mapped from the live zoning layer; ordinance text ingested as the CITATION/verification layer (and the edition-currency anchor); road-DECOUPLED; multi-value axes (interior/corner side) carried as distinct fields; honest-decline only on genuinely conditional standards no per-axis field can hold. NEW mold gates: (a) a setback-rule atom must cite the authoritative record + its ordinance link; (b) exactly ONE authoritative per-parcel record per jurisdiction (kill dual-fork); (c) EDITION-CURRENCY gate — currentEditionId must not point at a repealed edition, and an edition stub with sectionIds:[] must fail the bake (scoped to exclude legitimately-thin building-code editions); (d) NEW — where the per-parcel record and the ordinance chart DISAGREE, the per-parcel record wins for the number and the disagreement is FLAGGED (not silently resolved). This is a mold-level correction and it GATES scaling. The PRACTICAL per-parcel record a plan reviewer applies is the universal, scalable answer.
