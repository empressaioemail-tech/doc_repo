---
id: 2026-08-02_bastrop_city_scale_plan
title: PLAN — scale the certified block to the WHOLE CITY of Bastrop, ACCURATELY (recipe-extraction-first)
date: 2026-08-02
status: plan (operator-requested; recipe extraction is Phase 0 and GATES everything)
owner: nick
related: [2026-07-29_setback_authoritative_source_and_road_decouple, 2026-07-31_BASTROP_BLOCK13_CERT_RESTORED, 28_THE_BASTROP_MOLD_engine_build_spec, _catalog/bastrop_downtown_drill_test_area.json]
purpose: Scale from 1 certified block (7 parcels) to the whole City of Bastrop WITHOUT losing any of the ~32 rulings / 17 amendments / dozens of hard-won steps it took to get one block right. ACCURATE is the requirement. Phase 0 (forensic recipe extraction) is mandatory and gates all build work — because no summarized memory holds all 32 rulings, several of which REVERSE each other.
---

# Scale the block to the City of Bastrop — accurately

## THE PROBLEM STATEMENT (operator, 2026-08-02)
We spent many sessions and 32 rulings (R1-R32) across 17 amendments getting ONE downtown block (Block-13, 7 parcels) to provable 7/7. We have NOT proven a second block, let alone the city or county. The operator's requirement for scaling to the city: ACCURATE. No "whoops, forgot the property-lines step." Several rulings REVERSE earlier ones (R18 retracted same-day; CORRECTION A reversed by R1; CORRECTION C superseded by R8/R22; geometry-scrub theory overturned by A5). Only the SETTLED state of each is safe to carry. This cannot be done from memory.

## WHY PHASE 0 EXISTS
Reading the setback decision record alone (`2026-07-29_setback_authoritative_source_and_road_decouple.md`) surfaces 32 rulings + 17 amendments + ~7 reversals. There are ~39 OTHER Bastrop docs (COMPLETE_BASTROP hardening A1/B1/C1/C2/D1, PROPERTY_LINE_TAGS WDLL, composition inventory, R0-R4 dispatches, zoning-provenance backfill, health monitors, the cert script itself) that contain MORE steps not in the setback record (property-line tagging, road-node build, provenance backfill, currency gates). The complete recipe is spread across the whole corpus + the live cert script + the live code. Extracting it — deduplicated, reversal-resolved, verified against live code — is the first deliverable and it GATES the build.

## PHASE 0 — FORENSIC RECIPE EXTRACTION (read-only; one coordinator + adversarial review; GATES all build)
Produce THE DEFINITIVE, SETTLED "what makes a Bastrop parcel correct" specification — the recipe — by reading the ENTIRE Bastrop record + the live cert script + the live serving code, distilling every step to its final resolved state, and marking every reversed/superseded ruling DEAD so it cannot leak back.

Read (exhaustive, not sampled):
- The setback decision record + all 17 amendments (R1-R32) — settled state of each.
- ALL COMPLETE_BASTROP docs (hardening WDLL + A1/B1/C1/C2/D1 executor closes + planner verifies + STATUS + regrade).
- PROPERTY_LINE_TAGS_bastrop + its WDLL (the property-line step the operator explicitly fears losing).
- The R0-R4 dispatch series (geometry truth, road-node, road-type setbacks, zoning-stamp-from-atom-chain, place-type warm, depth-cost, city-promote-throughput, gravel-setback-rows, honest-warm-edges).
- The BDC setback correction WDLL + BDC_CLOSE_CLASS_R13_R15 + the composition inventory + the depth-reconciliation finding.
- The CERT SCRIPT itself: `packages/engine-core/scripts/block13-cert-grade.mjs` (the codified truth of what "certified" mechanically means — R32 index-matched inward-normal, road-node front orientation, four fail-closed gates).
- The manifest `_catalog/bastrop_downtown_drill_test_area.json`.
- The LIVE code paths each ruling cites (atom-chain-to-facets.ts, depth-warm/geometry.ts, compute.ts, edgeLabeling.ts, bastrop-per-parcel-record.ts, setbacks/index.ts, depth-warm-bastrop-batch.mjs) — confirm each settled ruling is ACTUALLY IN the live code, not just decided on paper.

Deliver — THE RECIPE, in these buckets (each item: the settled rule + which ruling(s) + whether it's LIVE-IN-CODE or OWED):
1. SOURCE — where each field's number comes from (per-parcel record Layer 23; district from live zoning layer; ordinance as citation only).
2. EDITION CURRENCY — repealed-code unreachability (R13 shipped Bastrop-specific; R16 general gate OWED — flag as a scale prerequisite).
3. CONFLICT DISCLOSURE — Layer-23-vs-83, draw-one-cite-other-disclose (R25).
4. SETBACK MODEL — interior/corner side split; district-default-for-role; GC/MU from record; fire-code-defer→5'; alley role; split-zone dominant; graceful conditional decline.
5. GEOMETRY — BCAD rings trusted (no scrub); primitive-recompute-on-swap (winding invariant); conditional convexity gate; edge-role re-derive (frontage); persisted==recompute; invalidate-on-repeal.
6. CERT — scope = full browsable extent (not bbox/list); grade drawn envelope in feet by engine-frame; per-edge orientation; three-way convergence; full field parity; parcel-currency + re-plat successor completeness; BOTH mechanical + operator R6.
7. PROPERTY-LINE / ROAD-NODE / PROVENANCE / any step from the non-setback docs the setback record does not cover.
8. THE REVERSAL LEDGER — every ruling that was RETRACTED/REVERSED/SUPERSEDED (R18, CORRECTION A, CORRECTION C, geometry-scrub theory, etc.), marked DEAD with what replaced it, so no dead rule re-enters at scale.

ADVERSARIAL REVIEW on the recipe: a separate reviewer checks the recipe for COMPLETENESS against the corpus ("what ruling/step did the extractor miss?") and for CORRECTNESS ("is any item stated in its pre-reversal form?"). The recipe is not accepted until the adversary cannot find a missing or mis-stated step. This is the anti-"whoops-forgot-a-step" gate.

PHASE 0 OUTPUT = the accepted recipe doc. NO build work until it exists and the operator has seen it.

## PHASE 1 — WHAT THE CITY NEEDS THAT THE BLOCK DID NOT (scoped AFTER the recipe, read-only gap analysis)
With the recipe fixed, scope the DELTA from block to city (Bastrop city limits, ~thousands of parcels, all districts):
- The R17 truth: cert scope is the whole city (customer-browsable extent), not a block. What's the actual parcel count + district mix in Bastrop city limits?
- The blast radius: AMENDMENT 10 named ~10k+ 48021 parcels un-re-warmed, fail-closed to "not verified here." City scope must warm every rendered city parcel or honestly mark coverage-in-progress at the district/city level (R17).
- Which recipe steps are per-parcel (must run on every city parcel) vs per-jurisdiction (once): edition-currency gate (once, but R16 general gate owed first), source registration (once), vs re-warm + edge-role + envelope + currency check (every parcel).
- The R16 prerequisite: is the general edition-currency serving gate needed before city scale, or does the Bastrop string-filter cover the whole city (same repealed B3)? (Likely covers the city since it's all Bastrop's B3 — but VERIFY; national needs R16.)
- Throughput: the block was 7 parcels hand-driven. City is thousands. What's the promote/warm throughput path (R4_1 city-promote-throughput dispatch exists — read it) and its measured cost?

## PHASE 2 — EXECUTE (only after Phase 0 recipe + Phase 1 scope, operator-approved)
The area-sweep-the-whole-city loop, honoring every recipe step, cert = R17 full-city scope + R32 engine-frame geometry grade + three-way convergence + operator R6. NOT scoped here — Phase 1 defines it. Likely: warm every city parcel from the per-parcel record with edge-role re-derived, envelope re-inset to current rule, currency-checked, three-way-converged, then full-city area-sweep + operator R6. Blocks/districts as the parallel unit, area-swept whole, never sampled.

## DISCIPLINE (all phases)
Read-only until Phase 2. Adversarial review on the recipe AND on every build report (verification never delegated; two-blind-measurer for load-bearing geometry disputes per A16/A17). Area-sweep not parcel-sample (R3). Grade drawn geometry not card text (R19/R32). Cert scope = customer-browsable extent (R17). Both gates (mechanical + operator R6). No dead ruling re-enters (the reversal ledger). Deploys planner-owned. Cloud Run traffic-trap + :latest-image-race + persisted!=recompute all in play. No timeframe estimates.

## THE BET
Finish+extend: the block proved the model holds (A14/A17: narrow contained bugs, never a model wall). The city is the same recipe applied to more parcels + more districts + more geometry variety. If the city hits a wall the recipe can't clear, THAT is the rebuild trigger — with the tightest failing test case. But the recipe must be COMPLETE first, or we scale a hole.
