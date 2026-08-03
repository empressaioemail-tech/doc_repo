---
id: PHASE_C_RESUME_recompute_divergence
title: PHASE C RESUME — the 5 recompute-empty fails (null-situs → R35 decline; valid-situs → fix recompute, keep R10)
date: 2026-08-03
status: resume dispatch (SF-1 24 stale cleared; 5 promoted-but-cert-fail remain, split into 2 classes)
owner: nick
related: [PHASE_C_RESUME_merge_then_rewarm, 2026-08-02_bastrop_recipe_ACCEPTED, 2026-08-02_operate_the_factory_never_rebuild_it]
---

# PHASE C RESUME — the 5 recompute-empty fails

SF-1 re-sweep: 1914/1919 pass-or-decline, 24 stale-residue CLEARED, R35 landlocked (53859) PASS. 5 remain: all promoted with VALID served envelopes (R32 + facesAnswer pass on the STORED atom) but cert's RECOMPUTE (`computeWarmCandidateFromBoundary`) returns empty. VERIFIED live: 28855 (509 Laurel) serves 9,214 sqft envelope; 8741972 serves 3,209 sqft — both valid. So the stored atoms are good; cert's re-derivation is what's empty. The 5 split into TWO classes with OPPOSITE correct answers — do NOT fix them the same way.

## CLASS A — NULL-SITUS RE-PLAT SUCCESSORS → R35 HONEST-DECLINE (3 parcels)
8741972, 8741973, 8741974 — the Pecan Place re-plat successors (34065 re-platted → these three; R15). Their situs is NULL, so there is NO front-street reference and orientation recompute is empty for the SAME reason as R35's landlocked case. FIX (per R35 extension): a parcel with NULL situs (no determinable frontage) HONEST-DECLINES the front orientation ("orientation not determinable — no situs/frontage"), served as parcel+zoning+setbacks, envelope draws on resolvable edges, a cert PASS (disclosed decline), NEVER a fabricated front. Implement in the warm/cert path: null-situs → orientation honest-decline (same code path as R35 landlocked; extend the no-frontage condition to include null situs). After this, these 3 are PASSES, not fails.

## CLASS B — VALID-SITUS RECOMPUTE-EMPTY → FIX THE RECOMPUTE (2 parcels; keep R10)
28855 (509 Laurel St, valid situs, valid 9,214 sqft envelope) + 30857 (valid situs + envelope). These have REAL frontage and a VALID stored envelope, but cert's boundary RECOMPUTE (`computeWarmCandidateFromBoundary`) returns EMPTY. This is a genuine warm/cert divergence R33 did NOT cover (R33 shared the MEASUREMENT; the CANDIDATE re-derivation still diverges).
- DO NOT implement the tempting fix "cert passes when stored passes R32 even if recompute is empty" — that makes cert TRUST THE STORED ATOM OVER THE RECOMPUTE, violating R10 (persisted==recompute; the exact persisted!=recompute defect fought all phase). A stale atom could slip through.
- INSTEAD: DIAGNOSE why `computeWarmCandidateFromBoundary` returns empty for 28855/30857 when the warm's own promote path produced a valid candidate for the same parcel. The warm PROMOTED a valid envelope, so the candidate IS derivable — cert's recompute using a different/empty path is the bug. Trace the divergence (does cert pass different inputs — ring source, boundary primitive state, road context — than warm did?). FIX the recompute so it re-derives the SAME candidate warm did → persisted==recompute holds → cert passes for the RIGHT reason. Two-blind-measure already confirmed R32 + orientation are fine on the stored envelope, so the fix is in the CANDIDATE RE-DERIVATION, not the measurement.
- If diagnosis shows 28855/30857 GENUINELY cannot re-derive (a real reason, like R35), then it's an honest-decline — but PROVE that, don't assume it to make the sweep pass.

## STEP ORDER
1. Implement CLASS A (null-situs → R35 orientation honest-decline) — extends the existing R35 no-frontage code. Test: a null-situs parcel honest-declines orientation, cert PASS.
2. DIAGNOSE CLASS B recompute-empty (28855/30857): why is computeWarmCandidateFromBoundary empty when warm derived a valid candidate? Trace the input/state divergence between warm and cert. Report the root cause BEFORE fixing.
3. FIX CLASS B per the diagnosed cause (fix the recompute to match warm — keep R10; do NOT trust-stored-over-recompute). Test: recompute of a valid parcel matches the promoted candidate.
4. Merge to hauska-engine main (CI green; Block-13 7/7 regression still holds).
5. RE-SWEEP SF-1 → target blockPass=true, staleResidue=0, the 5 now PASS (3 R35-declines + 2 recompute-fixed). If a promoted parcel STILL fails cert → STOP + report (a deeper recompute divergence).
6. CONTINUE the blocks (GC → MU → RR → PI → IND) only after SF-1 blockPass. The 15 removed-from-SF-1 parcels grade in their dominant-district blocks here.

## GATE C (unchanged)
All warmable blocks single-vintage + swept-clean + ledger-populated + CC-visible + PDD/landlocked/null-situs-declined → STOP for operator R6. NO "certified" claim.

## DISCIPLINE
Diagnose before fixing — do NOT blanket-trust the stored atom over the recompute (R10 holds; that's the defect we fought all phase). Fix the RIGHT side per class (null-situs=decline; valid-situs=fix recompute). Two-blind-measure genuine disputes. Operate/extend the proven artifact, never fork. Merge to main before running from it. Block-13 7/7 regression must hold. Verify against live not reports. Both cert gates (mechanical + R6). Keep capturing recipe refinements (R35 extension is a real one — re-plat null-situs successors are common at scale). Paste raw counts + the Class B root-cause diagnosis.
