---
id: FINDING_2026-08-03_factory_product_setback_disconnect
title: RETRACTED FINDING — the factory-product setback "disconnect" was WRONG (I graded the wrong endpoint); the certified atoms DO reach the customer. The real residual is warm COVERAGE (GC/MU/RR/PI/IND not yet warmed).
date: 2026-08-03
status: RETRACTED (adversarial review refuted the original finding; corrected via live verification 2026-08-03)
owner: nick
related: [OPS-WDLL_the_factory, OPS-2_county_onboarding_runbook, 2026-08-02_bastrop_recipe_ACCEPTED, PHASE_C_RESUME_full_sweep_then_blocks]
purpose: Correct the record. The original finding claimed the certified factory output never reaches the customer app (setbacks served from a stale, mis-keyed, hand-curated table). Adversarial review + live re-verification REFUTED it: I graded the wrong endpoint (the cortex node-facets FALLBACK, intentionally envelope-null) instead of PE's real serve path (property-atoms atom-chain), and read a STALE CLI DOCSTRING as live code. The certified per-parcel setbacks + drawn envelope DO reach the customer for warmed parcels. The real residual is narrower: warm COVERAGE (not every district warmed yet).
---

# RETRACTED — the setback "disconnect" finding was wrong

## THE RETRACTION
My original finding (that the certified factory output does not reach the customer app) is WRONG. Two errors:
1. I QA'd the WRONG ENDPOINT. I curled the cortex node-facets FALLBACK `/api/brokerage/v1/place/node/:id/facets` — which is intentionally envelope-null / baseFacts+landUse+flood only. PE does NOT read that for setbacks/envelope. PE reads its OWN BFF `/api/spine/property-atoms/:id/facets` -> the retrieval ATOM-CHAIN (the recipe atoms).
2. I read a STALE DOCSTRING as live code. The `nodeFacetBakeTier1Cli.ts:21-23` docstring describes a retired getSetbackTable->mapDistrict->deriveBuildableEnvelope path. The actual live function `computeTier1Envelope` (lib/nodeFacetBakeTier1.ts) unconditionally returns `status:"declined"`, `declineReason:"atom_path_pending"` with the comment "Tier-1 bake no longer authors product envelope confidence (anti-zombie). Read buildable-envelope from the property atom chain, or honest-decline." The table path I described was killed months ago.

## THE LIVE TRUTH (verified 2026-08-03 against property-explorer-xi.vercel.app)
- PE serve path = `/api/spine/property-atoms/48021:<APN>/facets` -> `source: atom-chain`, `readPath: atom-chain-warm`.
- SF-1 parcel 34137: zoning SF-1; envelope status OK; setbacks front 25 / side 5 / rear 25 / side_corner 15 (the CERTIFIED SF-1 numbers); buildableAreaSqFt 9350; disclosure "Depth-warm verified envelope from promoted ledger — no live re-derive (27c WDLL 8)." THE RECIPE ATOMS REACH THE CUSTOMER.
- GC parcel 33904 (the screenshot parcel): envelope status DECLINED, declineReason "setback-rule-pending" ("Setbacks pending re-warm from city per-parcel record"). This is HONEST ABSENCE for a NOT-YET-WARMED parcel (GC block not warmed yet), NOT a broken pipe.
- The recipe -> depth-warm promoted ledger -> atom-chain -> PE BFF bridge ALREADY EXISTS and is live. The warm store cert grades and the surface the customer reads are the SAME promoted ledger.

## WHAT THE SCREENSHOT ACTUALLY SHOWED
The operator clicked a GC parcel (33904). GC is NOT yet warmed (only SF-1 has passed). So "Setbacks: not verified here" is the CORRECT honest-absence for an unwarmed district — the honesty doctrine working, exactly as designed. It was not evidence of a disconnect.

## THE REAL RESIDUAL (the narrow, true task)
Not a serve-path rewire. The honest residual is WARM COVERAGE: only SF-1 is warmed; GC/MU/RR/PI/IND are not yet warmed, so their parcels honestly decline. The task is simply COMPLETING THE WARM across the remaining district blocks (already the Phase C plan, PHASE_C_RESUME_full_sweep_then_blocks) — after which those parcels serve certified setbacks the same way SF-1 does now.

## WHAT WAS UNSAFE IN THE PROPOSED FIX (do NOT do these)
- "Wire recipe atoms into the node-facet bake" — UNNECESSARY; the atom-chain path PE uses already does this. Re-plumbing node-facets would build a redundant second envelope path (the exact anti-pattern `atom_path_pending` decline exists to prevent).
- "Retire bastrop-tx.json as a zombie" — UNSAFE. `getSetbackTable`/`getSetbackTableForZoning` are still live in the `brokeragePlaceBuildableEnvelope` fallback, localSetbacks, the property-brief prose engine, and cad-ingest. The table registry also serves ~20 other jurisdictions NOT on the recipe warm (Austin, Grand, Lemhi, San Marcos, Dripping Springs, Kyle, Buda, Georgetown, Round Rock...). It is a FALLBACK, not a zombie.

## ONE LEGITIMATE HARDENING (the salvageable instinct)
"Cert should verify at the SERVED PE surface, not only the warm store." Even though the app is NOT broken here (warm store == served ledger for warmed parcels), a cert that ends with a live PE-curl on a sample warmed parcel would prove end-to-end serve, and would have prevented THIS false finding (I'd have curled the right endpoint). Worth adding to OPS-5 as an end-to-end serve assertion — modest, not a rewire.

## DISCIPLINE LESSON (the real takeaway)
The valuable thing here was the ADVERSARIAL REVIEW, which caught a wrong finding before it drove a harmful fix (a redundant serve path + retiring live fallback tables). Verify against the RIGHT live endpoint, and never read a docstring as live code — confirm the actual function body. The operator's mental model ("catch the stale map up to the engine output") was reasonable given the screenshot, but the map is NOT stale for warmed parcels; it's honestly absent for unwarmed ones.
