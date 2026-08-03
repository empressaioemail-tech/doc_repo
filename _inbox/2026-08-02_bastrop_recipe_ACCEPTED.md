---
id: 2026-08-02_bastrop_recipe_ACCEPTED
title: THE RECIPE (ACCEPTED) — Bastrop parcel correctness, Phase 0 forensic extraction + planner review
date: 2026-08-02
status: ACCEPTED (coordinator adversarial-review + planner independent code-verify); GATES city-scale build
owner: nick
related: [2026-08-02_bastrop_city_scale_plan, 2026-08-02_bastrop_city_and_fan_MASTER_WDLL, 2026-07-29_setback_authoritative_source_and_road_decouple, 2026-07-31_BASTROP_BLOCK13_CERT_RESTORED]
purpose: The accepted, settled, reversal-resolved, code-verified recipe of what makes a Bastrop parcel correct — the contract city-scale (and eventually fan) work must honor. The full 8-bucket recipe + reversal ledger lives in the coordinator handback; THIS doc records ACCEPTANCE, the planner's independent verification of the critical findings, and 3 review refinements. No build dispatched.
---

# THE RECIPE — ACCEPTED

The Phase 0 forensic extraction (read-only, adversarially reviewed) produced the settled 8-bucket recipe (SOURCE / EDITION-CURRENCY / CONFLICT-DISCLOSURE / SETBACK-MODEL / GEOMETRY / CERT / NON-SETBACK-STEPS / REVERSAL-LEDGER), traced to R1-R32 across 17 amendments, each item marked LIVE-IN-CODE (file:line) or OWED, with a 17-entry reversal ledger of DEAD rules. The full recipe is the coordinator handback (retained in the session record). This doc = acceptance + planner verification + refinements.

## PLANNER INDEPENDENT VERIFICATION (did not take the recipe's word — verified the 2 critical findings live)
- CRITICAL FINDING 1 CONFIRMED: `block13-cert-grade.mjs` is NOT on hauska-engine main (404, verified). The mechanical Block-13 "7/7 certified" was graded by a script that is NOT reproducible from main today; only the partial `block13-r31-regrade.mjs` (pre-cert-restore orientation harness) is on main. => "certified" is not currently reproducible. MERGING the cert script is a hard scale prerequisite. (This alone justifies the entire Phase-0 pause.)
- CRITICAL FINDING 2 CONFIRMED: `boundary-primitive/compute.ts:104` still returns `unmapped-adjacency` / "No parcel or ROW adjacency mapped" on main. R7 (district-default-for-role) is implemented on the WARM path but NOT at primitive bake => any city parcel that skips the R28/R30 re-warm path can still primitive-decline. Real at ~10k-parcel scale; invisible at 7.
- CRITICAL FINDING 3 (cert-scope layering) ACCEPTED as stated: hardening (approvable) vs city-wide CERTIFIED-CLEAN (REVOKED) vs downtown 36/36 (bbox) vs Block-13 7/7 (restored) vs R17 full-city (NOT DONE) are distinct — do not conflate.

## ACCEPTANCE
Recipe ACCEPTED. Adversarial correctness check confirmed no item stated in pre-reversal form; completeness re-scan found no orphan R1-R32 outside the 8 buckets. The two most load-bearing findings independently verified against live code. High confidence the extraction is trustworthy.

## PLANNER REVIEW REFINEMENTS (3 — additions, not rejections)
- REFINEMENT 1 (answer-key corner-side dashes): the Block-13 answer key shows MU and GC corner-side as "–". Given R2 makes corner-side a DISTINCT field and commercial corner lots exist (e.g. 909 Chestnut GC), the recipe must state explicitly whether "–" = "the per-parcel record carries NO corner value for this district" (legitimate, disclose per R25) vs "not extracted" (a gap). A bare dash is the exact ambiguity R25 says to disclose. RESOLVE in Phase 1: confirm each "–" against layer 23.
- REFINEMENT 2 (O3 chip source-link/body gap belongs in the recipe): operator QA 2026-08-02 (909 Chestnut §14.02.008) — a chip with NO openable source link + "Full record unavailable — showing the cited excerpt." Diagnosed (code-confirmed) as an INGEST-QUALITY gap: BDC atoms lack `sourceUrl` (brokerageBrief.ts:492 attaches it only if present) AND carry a truncated snippet not the full section body. This is DISTINCT from Bucket 7.18 (legacy stale-B3 sourceUrls). ADD as a settled recipe requirement: BDC (and every jurisdiction's code) atoms must carry (i) an ordinance deep-link sourceUrl and (ii) the full section body — else the citation contract ("a promise you can open and verify") is violated. Scale-relevant: vague/unlinkable chips would replicate to every county. Owed as a recipe-level ingest requirement.
- REFINEMENT 3 (scale-prereq #4 is the mountain, not a checkbox): "city-wide re-warm ~10k+ parcels still fail-closed post-R13" is the ENTIRE city warm — the single largest Phase-2 work item, not a line next to "update health probes." Weight it accordingly in Phase 1 scoping.

## SCALE PREREQUISITES (from the recipe; NOT Phase-1 scope, but the gate list)
1. Merge `block13-cert-grade.mjs` to main — mechanical cert must be reproducible (CRITICAL FINDING 1).
2. Resolve R16 general edition-currency gate OR confirm the Bastrop-specific B3 string-filter covers all 48021 city parcels (likely yes for Bastrop city; NO for other counties — R16 is a national-fan prerequisite).
3. Implement the R17 full-city cert harness (extend area-sweep/cert-script scope beyond the downtown bbox).
4. City-wide re-warm the ~10k+ parcels currently fail-closed post-R13 (REFINEMENT 3 — the mountain).
5. Close R7 at primitive bake, OR guarantee every city parcel runs the R28/R30 re-warm path (CRITICAL FINDING 2).
6. Update health probes from the abandoned Place Type layer to Zoned_Parcels/83 (Bucket 7.17).
7. Resolve BDC atom sourceUrl + full-body ingest gap (REFINEMENT 2 / O3).
8. Operator R6 on each cert unit (block → district → city, per operator's chosen cadence).

## BLOCK-13 ANSWER KEY (cert reference; corner-side dashes pending REFINEMENT 1)
7 parcels via BCAD blk='BB 13 E W ST': 34145, 34121, 34153, 34137, 34169, 34177, 34161. Draw source: Layer 23. Interior N-S alley at x≈−97.31695.
- SF-1: F25 / interior-side 5 / corner 15 / R25; H35, imp 50%, lot 1/3 ac.
- MU: F15 / interior-side 5 (fire-code per R22) / corner "–" (verify) / R15; H40, imp 60%.
- GC: F20 / interior-side 5 / corner "–" (verify) / R20; H55, imp 65%, lot 1/4 ac.

## R33 (NEW RULING, 2026-08-02 — found during the Phase C SF-1 warm; operator-ratified) — THE WARM PROMOTE-GATE MUST BE CERT-EQUIVALENT
FINDING: during the SF-1 city warm, 126 parcels PASSED warm (`verifyWarmCandidateMechanically`) and PROMOTED, then FAILED mechanical cert — because the warm gate is WEAKER than the cert gate. Cert applies gates warm does not: (a) R32 per-edge inset REMEASURE (cert re-measures with `measurePerEdgeInsetForRings`; warm only checked edge-applied feet), and (b) facesAnswer (cert requires situs-token ↔ OSM-road-name match; warm's `verifyFrontEdgeOrientation` passed even when the names differ). Result: a parcel can be "promoted" but not "certifiable" — a silent quality gap that serves a wrong envelope until cert catches it. This is STRUCTURAL (warm != cert), not Bastrop-specific — it hits EVERY county.

RULING R33: a parcel PROMOTES ONLY IF IT WOULD PASS MECHANICAL CERT. The warm fail-closed promote-gate must be CERT-EQUIVALENT, achieved by a SINGLE SOURCE OF TRUTH: the warm gate CALLS THE SAME cert measurement functions (R32 `measurePerEdgeInsetForRings`, the facesAnswer situs-token match) before promote — not a separate parallel check that can drift. A parcel that would fail cert must HONEST-DECLINE at warm, never promote. This generalizes the R10 principle (persisted==recompute) one level deeper: promote-gate == cert-gate. Mold gate; carries to onboard(fips) and every county.

R33 COROLLARY (facesAnswer normalization — do NOT make warm strict against a too-strict cert): the failing example was a road-name ABBREVIATION/FORMATTING mismatch ("MARTIN LUTHER KING JR DR" vs "Martin Luther King Junior Drive") — the orientation is CORRECT, the name-match is too literal. Before making the shared gate fail-closed, the facesAnswer token-match must NORMALIZE abbreviations (JR/Junior, DR/Drive, ST/Street, etc.) + case + punctuation, so it does not FALSE-NEGATIVE a correctly-oriented parcel. Fix the measurement to be RIGHT (normalize), then share it — do not merely make warm reject what a too-strict cert rejected. (Distinguish: a genuine orientation error — front on the wrong edge — must still fail; only the name-formatting false-negative is normalized away.)

## R35 (NEW RULING, 2026-08-02 — surfaced by the corrected SF-1 sweep; operator-ratified) — NO-FRONTAGE PARCELS HONEST-DECLINE ORIENTATION
FINDING: the corrected SF-1 sweep (proven generalized block13-cert-grade, dominant-district cohort) resolved ~23 of the prior 28 fails as cohort/harness artifacts, leaving 3 genuine findings. One (48021:53859) is a LANDLOCKED / "LOT BEHIND" parcel — its situs is literally "LOT BEHIND 2208 PECAN" with NO street frontage — so facesAnswer cannot match a front-street (it matched "Water Street" against a no-frontage situs). This is not a bug; it is a real-world parcel class (landlocked / flag / "lot behind") the mold had not met at Block-13.

RULING R35: a parcel with NO determinable street frontage (situs carries no street / is a "LOT BEHIND"/flag/landlocked parcel, AND no confident adjacent road resolves) HONEST-DECLINES the FRONT ORIENTATION per R30's fail-closed clause — it does NOT guess a front edge. It is served as parcel + zoning + setbacks with "front orientation not determinable — no street frontage" (honest-absence), which is a PASS at cert (a disclosed honest-decline), NEVER a cert failure and NEVER a fabricated front. The envelope may still draw on the resolvable edges (setbacks by role from the record) where the model can hold it; only the orientation axis declines. Generalizes: every county has landlocked/flag/lot-behind parcels; this is the honest-absence answer for them. Mold gate. (Distinguish from a genuine mis-orientation on a parcel that DOES have frontage — that still fails; R35 covers only the genuinely-no-frontage case.)

R35 NOTE: the other 2 genuine fails (48021:28855, 48021:30857 — setback-verify + orientation, R32 passes) are NOT yet classified — they get the two-blind-measurer treatment to determine real data disagreement vs a 4th unshared gate (a warm/cert divergence R33 didn't cover). Do not assume; measure.

## NEXT
Operator reviews this acceptance + the 3 refinements. On approval → Phase 1 (city gap analysis, read-only): parcel count + district mix in Bastrop city limits, the ~10k re-warm scope, R16-vs-string-filter decision, R17 cert-harness scope, throughput/cost gate, and resolve the corner-side + BDC-ingest gaps. THEN Phase 2 (execute, operator-approved). No build dispatched from Phase 0.
