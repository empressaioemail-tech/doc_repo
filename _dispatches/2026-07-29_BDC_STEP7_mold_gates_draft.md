---
id: 2026-07-29_BDC_STEP7_mold_gates_draft
title: Dispatch — STEP 7 mold rewrite + 3 new gates (draft now; finalize after LIVE)
date: 2026-07-29
status: dispatched
repo: doc_repo
wdll: 2026-07-29_BASTROP_BDC_setback_correction_WDLL
wdll_items: [10]
---

# STEP 7 — mold correction (draft parallel; finalize after Step 5 LIVE)

## STANDING DECISIONS
- Cotality extinguished; no Regrid; public-record only.
- No privileged data; SmartCity READ-ONLY, no-touch.
- Deploys planner-owned; code-done ≠ customer-done.
- Standing decisions travel. CTX HELD until certification passes.

## WDLL item: 10 (certification audit item 11 is PLANNER-OWNED)

## Do (draft PR against doc_repo)
Update `28_THE_BASTROP_MOLD_engine_build_spec.md`:

1. REPLACE the setback model in PART 1a / PART 2 RULE gate:
   - WRONG (retire): road-class-indexed descriptor table as setback VALUE source.
   - RIGHT: CURRENT adopted ordinance dimensional table (ordinance-text-true), parcel→district from LIVE zoning layer, cited to ordinance section, road-DECOUPLED (roads identify front EDGE only), honest-decline on conditional/contextual standards the flat scalar model cannot hold (CORRECTION C).
2. Add three NEW mold gates (adversarial-review-derived):
   - (a) a setback-rule atom must cite a code atom that actually CONTAINS the number.
   - (b) exactly ONE authoring setback source per jurisdiction (kill dual-fork).
   - (c) EDITION-CURRENCY: currentEditionId must not point at a repealed edition; an edition stub with sectionIds:[] fails the bake — SCOPED to exclude legitimately-thin building-code editions (IBC-2018 empty sectionIds OK) and to exclude the 213k placeholder-provenance atoms (separate program) so gate (a) does not fail-closed on 27.6% of corpus.
3. Capture CORRECTION A (GIS card ≠ numbers) and CORRECTION C in PART 3 baked decisions.
4. Bump `last_updated`. Do NOT claim CERTIFIED-CLEAN — that is planner item 11 after LIVE verify.

## Cite
`_decisions/2026-07-29_setback_authoritative_source_and_road_decouple.md` AMENDMENT.
