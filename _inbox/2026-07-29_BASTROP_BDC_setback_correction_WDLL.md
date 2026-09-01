---
id: 2026-07-29_BASTROP_BDC_setback_correction_WDLL
title: WDLL — Bastrop BDC ingest + setback correction + re-warm + CLEAN certification
date: 2026-07-29
status: approved
owner: nick
operator_approval: 2026-07-29 (operator program dispatch is the approval)
related: [2026-07-29_setback_authoritative_source_and_road_decouple, 28_THE_BASTROP_MOLD_engine_build_spec, 29_scale_warm_architecture, _STATE]
purpose: Observable end state for retiring repealed B3, serving BDC Euclidean setbacks, and certifying Bastrop CLEAN so CTX/national can unblock.
---

# WDLL: Bastrop BDC setback correction + re-warm

Date: 2026-07-29  Status: approved
Operator approval: 2026-07-29 (this program dispatch)

## Done looks like

Bastrop serves the CURRENT Bastrop Development Code (Ordinance 2026-06 / Chapter 14), not the repealed B3 Place Types. Parcels stamp to live Euclidean districts (SF-1/SF-2/SF-3/RR/…) from Zoned_Parcels/83. Setback NUMBERS come from ordinance text Sec. 14.02.003 (not the GIS card). Roads still identify the front EDGE but never supply the setback NUMBER. Conditional districts honest-decline. One authoring setback source per jurisdiction. currentEditionId points at BDC with real section atoms. After isolated regenerate-then-swap re-warm, LIVE serving revision shows 1010 Jefferson (and peers) as SF-1 30/10/20/30 with matching envelope. Mold carries the corrected model plus three new gates. A CERTIFIED-CLEAN audit is filed. CTX remains HELD until that audit passes planner LIVE verify.

## Mandatory sequence (deps)

3 → 1 → 2 → 4 → 5 → 7. Step 3 must land before Step 2's stamp RUN (SF-x must not fall through to legacy bastrop-tx.json). Step 5 waits for 1–4 shipped + serving. Planner owns all deploys and LIVE grades; executors never self-grade.

## Repo correction (planner)

Step 2 stamp config lives in **legacy-design-tools** `lib/cad-ingest/src/txgio/zoning-layers.ts` (ZONING_LAYERS + stamp CLI), not hauska-map. Same DB; stamp re-run needs no Cloud Run redeploy. hauska-map only consumes stamped facts.

## Acceptance items

1. **BDC setback table (ordinance text)** | check: `packages/adapters/src/local/setbacks/bastrop-development-code.json` exists with SF-1 30/10/20/30, SF-2 25/7.5/15/20, SF-3 15/5/10/15, RR 50/20/20/50, height 35, impervious 50%; MU/GC/PI/IND/P/OS/PDD absent or marked honest-decline (no fabricated scalars); citations to Sec. 14.02.003 | grade: [ ] | deps: none | STEP 3

2. **Router routes BDC districts** | check: `getSetbackTableForZoning` returns bastrop-development-code for SF-1/SF-2/SF-3/RR (and does not fall through to legacy bastrop-tx.json); unit tests cover SF-1 + P-* legacy path decision | grade: [ ] | deps: 1 | STEP 3

3. **Dual-fork killed** | check: exactly one authoring path for Bastrop setback values — descriptor `setbackTable` OR adapter table, not both competing; `depth-warm-bastrop-batch.mjs` and `bake-from-tier1-snapshot.ts` resolve the same numbers for the same district; adversarial file:line evidence in executor close | grade: [ ] | deps: 1–2 | STEP 3

4. **BDC code-section atoms ingested** | check: `bastrop_tx-bdc-2026-adopted` (or canonical entityId) has non-empty `sectionIds` including 14.02.003 dimensional standards; snapshot committed | grade: [ ] | deps: 1–3 | STEP 1

5. **currentEditionId flipped to BDC** | check: jurisdiction-corpus `currentEditionId` → BDC; B3 closed 2026-04-13T23:59:59 / BDC opens 2026-04-14 (match existing IBC-2018 boundary style — do not invent dates); IBC/ICC path for same jurisdiction undisturbed (LIVE probe or snapshot assert) | grade: [ ] | deps: 4 | STEP 1

6. **Zoning stamp → Zoned_Parcels/83** | check: LDT `ZONING_LAYERS["bastrop-city-tx"]` points at Zoned_Parcels FeatureServer/83 with `ZoneType` (not Zoning_Place_Type/0 PlaceTypeClass); dry-run shows 1010 Jefferson / APN 105054 → SF-1; other cities' layers unchanged | grade: [ ] | deps: 1–3 (stamp RUN after Step 3 merge) | STEP 2

7. **Roads decoupled from setback VALUES** | check: `roadClassSetbackTable` is not used as the setback-VALUE source in warm-compute / boundary-primitive / verify-mechanical; roads still label front EDGE; hard-coded `front:15` fallback in `buildFlatSetbackFallback` DELETED; Caldwell still green on its descriptor tests | grade: [ ] | deps: 1–3 | STEP 4

8. **Isolated re-warm then swap** | check: Bastrop regenerated in isolation per `29_scale_warm_architecture.md`; live serving not mutated during warm; verified set swapped; serving corpus/revision actually carries BDC | grade: [ ] | deps: 4–7 | STEP 5

9. **LIVE multi-parcel certify** | check: planner probes on ACTUAL serving revision (traffic-shifted): 1010 Jefferson SF-1 30/10/20/30 + envelope inset; ≥2 additional SF-x parcels correct; ≥1 conditional district honest-declines; PE/retrieval agree | grade: [ ] | deps: 8 | STEP 5 (planner-owned)

10. **Mold corrected + 3 gates** | check: `28_THE_BASTROP_MOLD` setback model rewritten (ordinance-text, road-decoupled, honest-decline conditional); gates (a) setback cites code atom containing the number, (b) one authoring source/jurisdiction, (c) edition-currency scoped to exclude thin IBC editions and the 213k placeholder-provenance program | grade: [ ] | deps: 1–9 content | STEP 7

11. **BASTROP CERTIFIED-CLEAN audit filed** | check: `_inbox/2026-07-29_BASTROP_CERTIFIED_CLEAN_audit.md` (or dated equivalent) grades this WDLL item-by-item with LIVE evidence; CTX remains HELD until this passes | grade: [ ] | deps: 9–10 | STEP 7 (planner)

## Out of scope (flagged, not fixed here)

- 213,621 placeholder-provenance atoms (`storage-port-proof/phase-1a`) across 9 non-Bastrop jurisdictions — separate program; mold gate (a)/(c) must not fail-closed on them.
- Hydro viz.
- Retire current QA agent after in-flight work (ops, not this WDLL).

## Corrections that govern every dispatch

- **CORRECTION A:** ordinance TEXT supplies numbers; Zoned_Parcels/83 maps parcel→district only. GIS card drift (e.g. 30/5/25) is NOT truth.
- **CORRECTION C:** no fabricated scalars for conditional/contextual standards (MU attached/detached, abutting residential, highway +30, neighbor-average, overlay asterisks) — honest-decline.

## Standing decisions (paste into every sub-dispatch)

- Cotality extinguished; no Regrid; public-record adapters only.
- No privileged/relationship data; every source must work for a no-relationship jurisdiction. SmartCity is READ-ONLY, no-touch (reference only, never a data path).
- Deploys are planner-owned; code-done ≠ customer-done; verify against LIVE serving revision, not agent-said-done.
- Standing decisions travel in dispatches (M0-reach). CTX HELD until certification passes.

## Amendments

- 2026-07-29: Step 2 repo corrected from hauska-map → legacy-design-tools (ZONING_LAYERS + stamp CLI) because that is where the stamp config actually lives.
- 2026-07-29: Step 2 stamp must decode Zoned_Parcels/83 ZoneTypeClass coded domain to district strings (SF-1 not integer 3). Prefer ZoneTypeClass domain names. Numbers still from ordinance text (CORRECTION A).

## Finish card (graded at close)

Audit: `_inbox/2026-07-30_BASTROP_CERTIFIED_CLEAN_audit.md` (2026-07-30). Verdict: CERTIFIED-CLEAN PASSED. CTX remains HELD until operator go.

1. MET — bastrop-development-code.json (#183)
2. MET — router → BDC; LIVE spine SF-1/30
3. MET — dual-fork killed
4. MET — 100 BDC sections in engine snapshot (#184)
5. MET — currentEditionId → BDC (engine + substrate); residual empty substrate sectionIds
6. MET — Zoned_Parcels/83 stamp + PE provenance
7. MET — road VALUE decouple (#182)
8. MET — rewarm 1777 promoted; traffic on 00148-zec / 00045-yek
9. MET — Jefferson + peers + GC decline on PE atom BFF
10. MET — mold rewrite + gates (a)(b)(c) prose
11. MET — this audit filed
