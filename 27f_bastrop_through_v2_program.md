---
id: 27f_bastrop_through_v2_program
title: Bastrop through v2 — the reference county / the mold for the country
last_updated: 2026-07-26
status: spec (draft, awaiting operator approval)
owner: nick
sub_wdll_of: 27_MASTER_WDLL_spine_completion_and_depth_engine
related: [27_MASTER_WDLL_spine_completion_and_depth_engine, 27c_road_node_engine_and_warm_digital_twin_spec, 27d_county_onboarding_recipe_and_fleet_reliability, 27e_multitrack_program_structure_and_wave_plan, 2026-07-26_temporal_boundary_primitive_and_living_layer, 2026-07-26_base_layer_connecting_tissue_thesis_and_tracks, 2026-07-26_guard_vs_interior_and_boundary_primitive]
---

# Bastrop through v2 — the reference county

Operator decision 2026-07-26: drive Bastrop city + county all the way through v2 before scaling. Bastrop is not one county perfected for its own sake — it is the MOLD for the country. Every bug caught here becomes a gate that protects the national fan-out; every capability proven here becomes a recipe stage. Slow on Bastrop is fast on America. This program defines the stack, the market-ready checkpoint, and the discipline that keeps "through v2" from becoming a bottleneck.

## What "Bastrop through v2" means (the full definition)

A county where every parcel carries the full, honest, correct base-layer answer — not just "buildable," but the living, boundary-aware picture:
- Correct buildable envelopes at the true ceiling (post-PATCH-A), with honest-irregular + no-road as the honest remainder.
- The temporal, adjacency-aware BOUNDARY PRIMITIVE — every property line a first-class node knowing what it is, what it faces (ROW / neighbor-parcel / alley / unmapped), its rule, provenance, effective period.
- v2 FIDELITY where sourceable — true ROW from CAD/county, recorded-plat/survey document parsing, road edges tightened from assumed to real.
- EASEMENTS overlaid on the envelope (buildable = interior - setbacks - easements), from the recorded-doc corpus.
- ROAD centerline + edges RENDERED on the site plan + map (the customer-facing moat feature).
- LIVING-LAYER attach-points wired (temporal fields, supersede-capable node ids) even though the sensing engines do not run yet.
- PDD / overlays honestly handled as their own resolution path, not silently declined.

That is the reference implementation for the entire country.

## The STACK (operator-approved sequencing — a stack, not one push)

The v2 target is a dependency stack with the boundary primitive as the load-bearing middle. Order:

STAGE 1 — PATCH-A + TRUE CEILING (nearly done). Clean the ringHasSelfTouch clip artifact (fix the geometry, do not weaken the guard); widen the geometry gate with positive-space fixtures; re-promote; reclassify residual once; state the honest ceiling (est ~86.8% place-type). This closes the depth-correctness question. Single owner.

STAGE 2 — THE BOUNDARY PRIMITIVE (the keystone — everything v2 consumes it). Property lines as first-class temporal, adjacency-aware nodes, per `2026-07-26_temporal_boundary_primitive_and_living_layer`. Adjacency computed from live parcel+road data (buildable now — confirmed by the guard-vs-interior diagnostic Question B). The offset CONSUMES the stored interior + per-line rule instead of re-deriving. Labeling becomes adjacency-FACT not road-proximity-PROXY. Temporal fields wired in (one version per line in v1, supersede-ready). This is the architecture the geometry track has been missing and the base-layer the twin/title/permit/easement vision needs.

STAGE 2 AMENDMENT (v2-sourcing recon 2026-07-26) — PULL `StreetsSurveyed2016` FORWARD INTO STAGE 2. The recon found Bastrop County serves a live, authoritative, ingestable `RoadAndBridgeMap/StreetsSurveyed2016` FeatureServer (~95 fields incl surface_wi/row_notes/surface/class/road_grave) — the county's OWN ground truth for road surface + classification + width. This REPLACES the OSM `surface=*`/`highway=*` PROXY that caused the recurring road-labeling bug class (gravel, footway, collector-steals-front — FIX 2.1 / R4.3 / R4.1). Ingest it as part of Stage 2 (not deferred to Stage 4 fidelity): "stop patching the proxy, ingest the truth." Expected to retire a whole class of labeling proxy bugs AND improve v1 labeling immediately, on the uniform public-record path (no relationship-privilege). Recon: `_inbox/2026-07-26_v2_sourcing_recon_bastrop.md`.

STAGE 3 — BASTROP MARKET-READY CHECKPOINT (v1.5 — the sellable/showable/recipe-provable state). BEFORE the deeper v2 fidelity work, Bastrop reaches genuinely market-ready: correct envelopes at the true ceiling, boundary-aware labeling, road centerline+edges rendered, honest gaps named, site plan a real deliverable. This is the checkpoint that (a) can be shown, (b) can be sold, (c) proves the recipe on counties #2-3 from a market-ready baseline. THE DISCIPLINE: do not let "through v2" mean "nothing ships until v2." Reach market-ready first; deepen to v2 after.

STAGE 4 — v2 FIDELITY / EASEMENT / LIVING-LAYER DEEPENING (rides the fidelity track; scales across counties). True ROW, recorded-plat/survey parsing, easements overlaid on the envelope, the road edges tightened. The living-layer sensing engines (zoning change, annexation, ownership, permit, lot-line, subdivision) are DESIGN-NOW / build-later on the boundary primitive's attach-points. This stage deepens Bastrop AND scales across counties as ONE fidelity program — it is not Bastrop-only and it does not block Bastrop's market-ready completion.

Road render (centerline + edges) runs IN PARALLEL throughout (Track B, customer-UI) — it is independent of the depth/primitive work.

## THE v2-SOURCING RECON (discipline gate before STAGE 4)

The v2 fidelity sourcing is the LEAST-PROVEN part of everything decided. Depth worked because every step was grounded in "does the data exist, is it computable." v2 sourcing depends on parsing recorded documents (plats, surveys, easements) into atoms — net-new, hard (OCR + legal-document structure + geometry extraction), and possibly non-uniform. Before any v2 fidelity BUILD, a READ-ONLY recon: what recorded-doc / true-ROW / easement / plat data actually exists for Bastrop, in what form, how parseable, at what coverage. Output: whether v2-Bastrop is "mostly achievable" or "achievable in patches" — and v2-coverage is itself a coverage NUMBER, not a switch that flips. This prevents the fidelity track from becoming an open-ended research project disguised as a build, and it keeps the honest-coverage discipline (never quote a v2 number the sourcing does not support).

## WDLL — Bastrop through v2 (frozen at approval; graded live, evidence pasted)

STAGE 1 — depth correct:
1. PATCH-A: near-rect near-rects that should draw DO draw (28286 front@edge2 ~7316; guard NOT weakened — genuine self-touch still rejected; honest-irregular still declines). | grade: [ ]
2. Geometry gate widened with POSITIVE-SPACE fixtures (good near-rects pass on every edge) + a genuine-self-touch negative fixture; goes RED on pre-patch code. | grade: [ ]
3. True ceiling: re-promote, reclassify once, honest ceiling stated (est ~86.8%) with honest-irregular + no-road remainder. | grade: [ ]

STAGE 2 — boundary primitive:
4. Property lines are first-class nodes carrying role + adjacency (ROW/neighbor-parcel/alley/unmapped) + rule + provenance + interior/inward (stored, not re-derived) + temporal fields (supersede-ready). | grade: [ ]
5. Adjacency computed from live parcel+road data (parcel-parcel via jsonb+bbox; parcel-road via road-nodes; unmapped honest). Verified on named Bastrop parcels. | grade: [ ]
6. The offset CONSUMES the primitive (orientation-invariant by construction); labeling is adjacency-FACT not proximity-proxy. Verified the 28286-class cannot recur. | grade: [ ]

STAGE 3 — market-ready (v1.5):
7. Bastrop market-ready: correct envelopes at true ceiling, boundary-aware, road centerline+edges rendered on site plan + map, honest gaps named, site plan a real deliverable. Verified on named parcels through the live app. | grade: [ ]
8. The recipe (27d) proves on counties #2-3 FROM the market-ready baseline (golden-descriptor path) — a fresh lane agent onboards a non-Bastrop county with zero re-teaching / zero re-derivation of a baked decision. | grade: [ ]

STAGE 4 — v2 deepening (post-recon):
9. v2-sourcing recon done; v2-coverage for Bastrop stated as an honest number (what's achievable vs patches). | grade: [ ]
10. v2 fidelity applied where sourceable (true ROW, plat/survey parsing); easements overlaid on the envelope (buildable = interior - setbacks - easements); road edges tightened. Living-layer sensing DESIGNED (not built). | grade: [ ]

Negative done-line (NOT done if ANY): the guard was weakened rather than the geometry cleaned (honest-irregular lots draw fabricated envelopes); the boundary is a private helper rather than a first-class temporal node (built to be rebuilt); "through v2" blocked Bastrop from shipping market-ready; a v2 number is quoted the sourcing does not support; the recipe re-opens figuring-out on counties #2-3 (the mold is not set).

## Pressure-test amendments (2026-07-26 — adversarial review of this plan)

The plan was adversarially reviewed while PATCH-A ran. Five soft spots surfaced; three are corrections folded here, two are flagged risks to confront at their stage.

AMENDMENT 1 (Stage 2 precondition) — PROVE FULL-COUNTY ADJACENCY BEFORE BUILDING THE PRIMITIVE ON IT. The guard-vs-interior diagnostic confirmed parcel-to-parcel adjacency is COMPUTABLE on a handful of named parcels via app-level bbox + jsonb ring PIP (no PostGIS on that Neon). But Stage 2 needs it for all ~62,257 Bastrop parcels, and app-side bbox neighbor search without a spatial index is a scale risk (the same shape as the road-ingest bbox stall). PRECONDITION: before building the boundary primitive, prove parcel-adjacency computes for the FULL county at acceptable cost/time (paste the run). If it does not, the fix is a spatial index (enable PostGIS + typed geometry column for ST_DWithin) BEFORE the primitive build — not discovered mid-build. Do not assert "buildable now" at county scale until it is measured at county scale.

AMENDMENT 2 (Stage 3 item 8 reframed) — COUNTIES #2-3 MEASURE HOW MUCH GENERALIZES, they are not a pass/fail gate. Bastrop has already surfaced ~5 distinct baked decisions (miter, front-labeling, gravel, guard, adjacency-proxy reframe). County #2 will almost certainly surface things Bastrop did not have (different zoning vocab, PDD structured differently, road-data quality, overlay types, ETJ boundaries). Treating "the recipe proves on #2-3" as pass/fail risks a FALSE GREEN (one lucky county declared "it works") or a demoralizing FALSE FAILURE (#2 legitimately teaches something new). Reframe: #2-3 are the second and third data points that MEASURE how much of the mold generalizes vs re-opens figuring-out. The output is a number — "N of the recipe's gates held; M new decisions surfaced and were baked" — which tells us how close "start county X" actually is. Budget for #2-3 re-opening figuring-out; that is expected and is data about the mold, not a failure.

AMENDMENT 3 (resequencing) — HARDEN M0-REACH BEFORE STAGE 2, not before the fan-out. The boundary primitive is the largest, most novel build in the stack — the most likely place for the fleet to re-derive or drift, and the first build big enough to expose the known M0 cc-agent-reach weakness. Harden M0-reach (recipe embeds the memory + scratch by default; per-workstream isolated scratch; class-guards inherited as gates) BEFORE dispatching Stage 2, so the primitive build starts warm and cannot re-derive a baked decision. (Previously slotted before the fan-out; moved earlier because Stage 2 is where it bites first.)

FLAGGED RISK A (confront at Stage 3) — MARKET-READY NEEDS A CUSTOMER-FACING HONESTY UX FOR NON-DRAWING PARCELS. At the true ceiling (~87%), ~13% (honest-irregular + no-road) show NO envelope. "Honest gap named in the ledger" is the engineering answer; it is not automatically the PRODUCT answer. A customer clicking their own obviously-buildable lot and seeing "no envelope" will not care that it is honest. Stage 3 market-ready must define what the customer SEES on a non-drawing parcel (why it declined, what they can do) — engineering-ready is not customer-ready (the F1a backend-healthy != app-correct lesson). Do not declare market-ready on the ledger honesty alone.

FLAGGED RISK B (confront at the v2-sourcing recon) — v2 MAY BE MOSTLY PATCHES, WHICH MAKES THE MOLD A v1.5 MOLD. If the recon finds true-ROW/plat/easement data is patchy (e.g. true ROW for 30% of roads, parseable plats for 50% of parcels), then Bastrop-through-v2 is itself patchy — and if the REFERENCE county is patchy at v2, the national v2 promise is "honest-coverage layer with survey-grade WHERE SOURCEABLE," not "survey-grade everywhere." That is a fine outcome but it changes the strategic story. Name this fork BEFORE the recon so we are not surprised into it; let the recon's coverage number decide whether v2 is a uniform standard or a per-county opportunistic deepening.

FLAGGED (decide at Stage 2 dispatch) — PARALLELISM WITHIN BASTROP. One-owner-per-shared-substrate is correct for the write-path, but the boundary-primitive build, the road-render (Track B), and the v2-sourcing recon are separable enough to run concurrently. Push parallelism further than "road-render is parallel": the sourcing recon and some fidelity-engine DESIGN can run alongside the primitive build. Decide the concurrency at Stage 2 dispatch.

## Why this is the mold, not a detour

Every stage produces a national asset: STAGE 1's gates protect the fan-out; STAGE 2's primitive is the base-layer boundary every vertical references (twin/title/permit/easement); STAGE 3's recipe proof is what makes "start county X" honest; STAGE 4's fidelity engines scale across counties as one program. Bastrop-through-v2 IS the country's mold — the discipline is to set it right once, here, on the anvil, before pressing it across America.

## Next step

On approval: land STAGE 1 (PATCH-A, running) -> STAGE 2 (boundary primitive) -> STAGE 3 (market-ready + recipe proof on #2-3) -> STAGE 4 (v2-sourcing recon, then fidelity/easement deepening). Road render (Track B) in parallel. The doc_repo planner continuously reviews each stage adversarially and mines each report for memory improvements. No CTX fan-out until Bastrop is market-ready and the recipe proves on #2-3; no v2 fidelity build until the sourcing recon grounds it.
