---
id: PHASE_C_RESUME_merge_then_rewarm
title: PHASE C RESUME — merge the proven generalized artifact to main, then re-warm SF-1 to clean
date: 2026-08-02
status: resume dispatch (corrected path worked — Block-13 7/7 regression held; merge then re-warm)
owner: nick
related: [PHASE_C_CORRECTED_operate_block13_path, 2026-08-02_bastrop_recipe_ACCEPTED, 2026-08-02_operate_the_factory_never_rebuild_it]
---

# PHASE C RESUME — merge, then re-warm SF-1

The corrected operate-the-proven-path approach WORKED. Block-13 still grades 7/7 under the generalized harness (regression held — proof we EXTENDED, did not fork). The prior "28 SF-1 fails" resolved as ~23 cohort/harness artifacts + 3 genuine findings. What remains: merge the proven artifact to main, clear the stale-residue, handle the 3 genuine fails, re-sweep clean, continue.

## STEP 1 — MERGE THE PROVEN ARTIFACT TO MAIN (reproducibility; single source of truth)
The generalized changes are LOCAL only. Merge them to hauska-engine main (they passed the Block-13 7/7 regression — the proof they're safe):
- `block13-cert-grade.mjs` generalized: `--roster-from=block13|query|file`, per-parcel layer-23 answer key, R33 normalization, honest-decline=pass. (The 7-parcel Block-13 invocation MUST still grade 7/7 — keep it as the CI/regression.)
- `depth-warm-bastrop-batch.mjs`: `--dominant-district-cohort` (R26) replacing the layer-23-field cohort.
- `bastrop-dominant-district-roster.mjs`: the R26 dominant-district roster.
- `bastrop-district-cert-grade.mjs`: RETIRED (stub exits 2) — confirm nothing references it.
Get CI GREEN + verify Block-13 grades 7/7 FROM MAIN before proceeding. This is the same reproducibility rule as the Phase A cert-script-not-on-main gap: the proven artifact belongs on main, not local. (Add a note to the ZOMBIE_CODE cleanup ledger that bastrop-district-cert-grade is now retired-stub → removable in the cleanup pass.)

## STEP 2 — RE-WARM SF-1 (clear the 24 stale-residue)
Run from the ON-MAIN scripts: `--dominant-district-cohort --district-prefix=SF-1 --force-overwrite --promote --upsert-ledger`. This clears the 24 stale-residue (promoted but recipeVersion != 1.0.0) to single vintage — an OPS gap from the prior mixed-vintage warm, not a harness bug. The R33 gate is live (warm==cert). Ledger re-upserts SF-1 coverage.

## STEP 3 — HANDLE THE 3 GENUINE FAILS
- 48021:53859 (LANDLOCKED "LOT BEHIND 2208 PECAN", no street frontage) → R35: HONEST-DECLINE the front orientation ("front orientation not determinable — no street frontage"); served as parcel+zoning+setbacks (envelope draws on resolvable edges); this is a PASS at cert (disclosed honest-decline), NOT a failure. Implement R35 in the warm/cert path (a no-determinable-frontage parcel honest-declines orientation, never guesses/fails).
- 48021:28855 + 48021:30857 (setback-verify + orientation fail, R32 passes) → NOT classified. TWO-BLIND-MEASURE them (A16/A17 independent measurers): is it a REAL served-setback/orientation data disagreement (a data fix), or a 4th warm/cert gate not shared (extend R33's shared-measurement)? Do NOT assume — measure. Report the verdict; fix per finding.

## STEP 4 — RE-SWEEP SF-1 (target clean)
Re-run the generalized block13-cert-grade over the SF-1 dominant-district roster. TARGET: blockPass=true — every parcel PASS or disclosed honest-decline (R35 landlocked declines count as PASS); staleResidue=0. If a PROMOTED parcel still fails cert (not an honest-decline), STOP + report (warm/cert still diverging — a real bug).

## STEP 5 — THE 18 REMOVED PARCELS (grade in their OWN blocks, not a flat file)
The 18 removed-from-SF-1 parcels: only 3/18 passed as a flat-file roster — because the other 15 belong in their DOMINANT-district blocks (GC/MU/RR/IND), where they'll be swept with the right answer key. Do NOT force them through SF-1 or a flat roster. They get graded when their dominant-district block runs (STEP 6). Capture each's served district (tee `--roster-from=file` output) so they're bucketed correctly.

## STEP 6 — CONTINUE THE BLOCKS (only after SF-1 blockPass)
GC → MU → RR → PI → IND, each: dominant-district cohort → warm (--force-overwrite, R33 gate) → ledger-upsert → generalized block13-cert-grade sweep → blockPass. The 15 removed parcels get graded here in their real blocks. PDD + null → honest-decline (S-10). Block-13 QUARANTINED (kept as the 7-parcel regression).

## GATE C (stop line — unchanged)
All warmable blocks single-vintage + swept-clean (generalized proven harness) + ledger-populated + CC-visible + PDD/landlocked-declined → STOP for operator R6. NO "certified" claim.

## DISCIPLINE
OPERATE/EXTEND the proven artifact (never fork — the operate-not-rebuild ruling holds). Merge the proven artifact to main before running from it (reproducibility). Verify against live not reports. Both cert gates (mechanical + R6). Block-13 quarantined + 7/7 regression must hold on main. Two-blind-measure genuine geometry/orientation disputes (don't self-grade). If a promoted parcel still fails cert after all this, STOP + report (a real warm/cert gap). Keep capturing recipe refinements (R33, R35 are real ones this run produced — that's the factory working). Paste raw counts.
