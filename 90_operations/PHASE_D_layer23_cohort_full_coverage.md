---
id: PHASE_D_layer23_cohort_full_coverage
title: PHASE D (first build) — wire LAYER-23 as the warm cohort source; re-warm Bastrop city to FULL layer-23 coverage
date: 2026-08-03
status: dispatch (closes the atom-roster breadth gap surfaced at R6; the core of onboard(fips) generalization)
owner: nick
related: [2026-08-03_BASTROP_CITY_GATE_C_reached, PHASE_C_FINISH_bastrop_city_remaining_blocks, PHASE_C_mechanism_vs_prose_SPEC, 2026-08-02_operate_the_factory_never_rebuild_it, 2026-08-02_ZOMBIE_CODE_cleanup_ledger, OPS-2_county_onboarding_runbook]
---

# PHASE D (first build) — layer-23 cohort, full-coverage re-warm

## THE GAP (surfaced at operator R6, live-verified)
Bastrop city warmed at GATE C, but coverage is PARTIAL: the warm cohort is ATOM-BACKED, not full layer-23. Live proof: MU parcel 48021:141364 (1101 Pine St, zoning MU) serves `envelope: declined / setback-rule-pending`, snapshotAt 2026-07-23 (pre-warm) — while MU parcel 109388 (warmed this run) serves ok F15/S5/R15. Both are MU; one was in the roster, one wasn't. Per-block roster sizes are well below raw layer-23 counts (SF-1 1919/2469=78%; MU 189/516=37%; GC 253/889; RR 205/645; PI 65/240; IND 31/117). The un-rostered parcels honest-decline against the old baseline — correct (never fabricated) but NOT full coverage. A plan reviewer needs the whole city.

## ROOT CAUSE (exact, mechanism-not-prose)
`packages/engine-core/scripts/bastrop-dominant-district-roster.mjs` -> `loadDominantDistrictRosterFromAtoms(district, sql)` builds the cohort with `SELECT ... FROM atoms WHERE entity_type='setback-rule' AND split_part(districtCode,' ',1)=<district>`. So a parcel enters the roster ONLY if it ALREADY has a setback-rule atom — chicken-and-egg: a never-warmed parcel can never get warmed. The recipe PROSE says "cohort from layer-23"; the MECHANISM reads atoms. This is THE mechanism-vs-prose gap (PHASE_C_mechanism_vs_prose_SPEC).

## THE FIX (a REWIRE — the layer-23 reader already exists; do NOT build new)
`packages/engine-core/scripts/bastrop-layer23-roster.mjs` ALREADY provides `loadLayer23CityPropIds({districtPrefix})` — paginated AGOL query on Parcels_One_Click layer-23 for `CITY='BASTROP' AND ZoneTypeClass=<district>`, returning ALL prop_ids for that district (authoritative full-city enumeration, NOT the retired BASTROP_CITY_BBOX). It is ALREADY imported by the dominant-district roster (line 9). The fix wires it as the COHORT SOURCE:
1. Make the warm cohort for a district = `loadLayer23CityPropIds({districtPrefix=<BLOCK>})` (ALL layer-23 parcels for that district), NOT `loadDominantDistrictRosterFromAtoms` (only already-atom'd). Map prop_id -> parcelNodeId (48021:<prop_id>) for the warm.
2. Keep the R26 dominant-district resolution for split-zone parcels (a parcel's GOVERNING district is still dominant-area) — but SOURCE the candidate set from layer-23, then resolve dominance, rather than sourcing only from existing atoms.
3. `depth-warm-bastrop-batch.mjs --dominant-district-cohort --district-prefix=<BLOCK>` must feed on the layer-23 propId set. Every parcel that is layer-23 CITY='BASTROP' for the district and NOT quarantined Block-13 enters the warm.
4. This UN-ZOMBIES `bastrop-layer23-roster.mjs` (ZOMBIE ledger item A: it is now the ANSWER, not dead — remove it from the retire list; it becomes the cohort source).

## GENERALIZATION (this is onboard(fips)'s core — build it registry-keyed, not Bastrop-hardcoded)
The layer-23 URL + ZoneTypeClass mapping are Bastrop-specific TODAY (`BASTROP_PARCELS_ONE_CLICK_LAYER_23`, `LAYER23_ZONE_TYPE_CLASS`). Phase D's job is to make the cohort source READ THE REGISTRY ROW (OPS-1): the jurisdiction's Rail-A per-parcel record layer URL + its district-code field + its city-filter. So `onboard(fips)` cohorts from the registry's authoritative parcel layer, not a hardcoded Bastrop constant. Do this as the SAME change: wire Bastrop through the registry row it already has (BASTROP_REGISTRY_ROW), so the mechanism is generic and Bastrop is its first instance — NOT a Bastrop special-case that a second jurisdiction re-forks. If full generality is too large this pass, at minimum make the cohort source a named seam that reads the registry row for Bastrop, with a TODO for the per-state provider — but do NOT deepen the Bastrop hardcode.

## RE-WARM TO FULL COVERAGE (operate the proven line, now on the full cohort)
After the rewire (merged to main, CI green, Block-13 7/7 regression still holds):
1. Per block SF-1 -> GC -> MU -> RR -> PI -> IND: warm the FULL layer-23 district cohort `--dominant-district-cohort --district-prefix=<BLOCK> --force-overwrite --promote --upsert-ledger` (R28/R30 mandatory). Now the roster = ALL layer-23 parcels for the district, not the atom subset.
2. Area-sweep each block with the generalized block13-cert-grade.mjs -> blockPass on the FULL roster. Coverage target: roster size ~= layer-23 district count (minus genuine honest-declines: PDD, null-situs, landlocked, no-frontage — those are disclosed PASSES, not gaps).
3. PLANNER VERIFY LIVE per block: the previously-declining parcels now serve. Re-curl 48021:141364 (the R6 miss) on the PE path -> must now serve MU setbacks (or honest-decline for a GENUINE reason, disclosed — not "pending"). Curl a fresh sample of newly-covered parcels per block. Grade the LIVE served surface, not the sweep count.
4. Ledger + CC: coverage % should rise toward full layer-23 per block (the >100% CC display is a separate cosmetic ratio bug — note it, don't chase it here).

## THE EXPECTED HONEST RESIDUAL (what still declines after full coverage, correctly)
Full layer-23 coverage does NOT mean 100% envelope-served. These honest-decline CORRECTLY and are PASSES: PDD (1,978 — conditional/planned-development, no scalar setback), null-situs / re-plat successors (R35), landlocked / no-frontage (R35), any parcel outside the current zoning stamp. The target is: every layer-23 CITY parcel is either SERVED with certified setbacks OR honest-declines for a NAMED, DISCLOSED reason — zero "pending" (pending = not-yet-warmed = the gap we're closing). If a parcel still says "setback-rule-pending" after this, it did not enter the cohort -> STOP + report (the rewire missed it).

## STANDING DECISIONS (paste verbatim into every sub-dispatch)
Operate/extend the proven artifact — this is a REWIRE of an existing loader + the proven warm line, NOT new machinery; the layer-23 reader already exists (un-zombie it). New machinery = flagged operator-approved deviation, rejected at verify. Verification never delegated — planner grades the LIVE PE serve surface (the previously-declining parcels now serve), not the sweep count. persisted==recompute (R10) — --force-overwrite every warm. Anti-fabrication + honest-absence — full coverage means served-or-disclosed-decline, NEVER fabricated; "pending" must go to zero (pending=unwarmed, the gap), genuine declines (PDD/null/landlocked) stay and are PASSES. No special data access — layer-23 is uniform public AGOL; the cohort source must work for a no-relationship jurisdiction (that's why it reads the registry row). Cotality extinguished. Merge only on green CI + run from main. Area-sweep not sample. Block-13 quarantined (7/7 must hold; keep out of the cohort). Both cert gates (mechanical + operator R6 — a NEW R6 after full-coverage re-warm, since the served surface changed). No timeframe estimates. Paste raw command/probe + live-curl output.

## DELIVERABLE
The rewire PR (layer-23 as cohort source, registry-keyed seam), CI green + Block-13 7/7. Then per-block full-coverage re-warm + sweep evidence (roster size now ~= layer-23 count; the honest-decline breakdown by NAMED reason; zero "pending"). Per-block LIVE PE-serve confirmation including 141364 now served. Updated ledger coverage. End: "Bastrop city at FULL layer-23 coverage, ready for operator R6 re-QA." NO certified claim. Note explicitly how much of the cohort-source generalization (registry-keyed vs Bastrop-seam-with-TODO) landed, as the onboard(fips) readiness signal.
