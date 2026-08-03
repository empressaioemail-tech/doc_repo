---
id: PHASE_C_CORRECTED_operate_block13_path
title: PHASE C CORRECTED — OPERATE the proven Block-13 path over the city (stop building wrappers)
date: 2026-08-02
status: corrected dispatch (supersedes the wrapper-building approach; operate-don't-rebuild)
owner: nick
related: [2026-08-02_operate_the_factory_never_rebuild_it, PHASE_C_HANDOFF_bastrop_warm, 2026-08-02_bastrop_recipe_ACCEPTED, FLEET-L3-GAP-template-replication-not-enforced]
---

# PHASE C CORRECTED — operate the proven path

## STOP. READ THIS FIRST.
The prior Phase C approach FAILED at the root: the task was to OPERATE the existing proven factory over the Bastrop city input — NOT build new machinery. The fleet re-built the FEEDING + INSPECTION WRAPPERS (a new cohort/roster selector + a NEW cert harness `bastrop-district-cert-grade.mjs` instead of the proven `block13-cert-grade.mjs`) and debugged its own new machinery through three STOP cycles. Every "finding" was a wrapper-vs-proven divergence, not a data discovery. GOVERNING DECISION: `_decisions/2026-08-02_operate_the_factory_never_rebuild_it.md`. You are an OPERATOR of the proven mechanism, NOT a machinist.

VERIFIED (do not re-derive): the ENGINES were NOT the problem — the city warm already uses the SAME core path as block13 (`bastrop-per-parcel-record-layer-23` adapter, `fetchBcadParcelRings`, `labelEdgesFromRoads`, `warmThenVerify`). The divergence is ONLY in the wrappers. So the substrate atoms are likely fine; the fix is to INSPECT with the proven harness and FEED with the block13-style cohort, not to rebuild.

## THE CORRECTED APPROACH — extend the proven artifact, don't fork it

### PRINCIPLE
The proven artifact is `packages/engine-core/scripts/block13-cert-grade.mjs` — it grades 7 parcels 7/7 with the 4 gates (district, setbacks, R32 per-edge inset, front orientation) against a layer-23-derived answer key. The correct move for the city is to GENERALIZE THAT ONE ARTIFACT to take a ROSTER as a parameter — same gates, same measurement, same answer-key derivation, more parcels. Do NOT run the separate `bastrop-district-cert-grade.mjs`; RETIRE it (or fold its only-if-needed pieces INTO block13-cert-grade). One cert harness, widened.

### STEP 1 — GENERALIZE block13-cert-grade.mjs TO A ROSTER (extend, not fork)
Change block13-cert-grade.mjs so the 7-parcel `BLOCK13` constant becomes a ROSTER PARAMETER (`--roster-from=<query|file>`), and the ANSWER_KEY is derived PER-PARCEL FROM LAYER-23 the same way it already derives for the 7 (the answer key is already layer-23-authoritative — just apply it per roster parcel, don't hardcode 7). Everything else — the 4 gates, `measurePerEdgeInsetForRings`, the `labelEdgesFromRoads` orientation token-match (with R33's normalization) — stays EXACTLY as proven. Keep the Block-13 7-parcel invocation working as a regression (it must still grade 7/7). This is the ONLY cert harness.

### STEP 2 — COHORT THE BLOCK-13 WAY (dominant district, not a roster-field)
The district-sweep roster for a block must be parcels whose DOMINANT zoning district is that district (R26 dominant-area-governs — the same rule that gave 34121 GC over the MU sliver in Block-13). The prior wrapper pulled parcels by a layer-23 field that included GC/MU-dominant parcels into the SF-1 sweep (e.g. 48021:59805 served GC, swept as SF-1 → district-fail). Those are NOT failures — they are correctly-warmed parcels being graded against the wrong block. Define the cohort by dominant district so each parcel is swept in ITS block. This is the block13 answer-key logic applied to roster selection — not new machinery.

### STEP 3 — RUN THE PROVEN PATH OVER THE CITY
With the generalized cert harness + dominant-district cohort: for each district block (SF-1 → GC → MU → RR → PI → IND), run the PROVEN warm+promote (the existing engine path, --force-repromote for single vintage, R33 gate live) then the GENERALIZED block13-cert-grade over that block's dominant-district roster. Because warm now shares the cert measurement (R33) AND cert is the proven harness (not a divergent one) AND the cohort is dominant-district, a promoted parcel is certifiable by construction; non-passes are honest-declines only. Ledger-upsert per block (the write-path already works). PDD + null → honest-decline (S-10). Block-13 QUARANTINED (never re-warmed; but its 7 parcels remain the cert regression).

### STEP 4 — VERIFY THE ~28 "FAILURES" WERE COHORT/HARNESS ARTIFACTS
After the corrected run, the prior 28 SF-1 fails should resolve: the ~25 district-fails were GC/MU/RR-dominant parcels now swept in their own block (PASS there); the ~6 setback/orientation fails re-grade under the PROVEN harness — if any STILL fail under block13-cert-grade with a dominant-district cohort, THOSE are genuine data findings (two-blind-measure them). Report which of the 28 were artifacts vs real.

## RETIRE THE DIVERGENT WRAPPERS (the mess cleanup)
- `bastrop-district-cert-grade.mjs` — RETIRE (its correct pieces folded into the generalized block13-cert-grade; do not run two cert harnesses).
- The bbox cohort / `--layer23-city-cohort` roster-field selection — REPLACE with dominant-district cohort (block13 logic).
- Keep: the engine path (unchanged), the ledger-write-path (works), R33 (a real recipe improvement — keep it), the reproducibility PR #210 fixes (keep, they were real).
Note in the mechanism-vs-prose spec: the divergent wrappers were the failure; the generalized-block13 path is the mechanism.

## THE STOP LINE (unchanged)
All warmable blocks warmed (proven path) + swept-clean (generalized block13 harness) + ledger-populated + CC-visible + PDD-declined → STOP for operator R6. NO "certified" claim.

## DISCIPLINE
OPERATE the proven artifact; EXTEND it (roster param), never FORK it. If you believe a new artifact is genuinely needed, STOP and get operator approval first (flagged deviation, per the governing decision) — do NOT build a parallel one by default. Verify against live not reports. Both cert gates (mechanical + R6). Block-13 quarantined + kept as the 7-parcel cert regression. Paste raw counts. If the generalized harness can't grade a parcel the 7-parcel version could, that's a regression — STOP + report.
