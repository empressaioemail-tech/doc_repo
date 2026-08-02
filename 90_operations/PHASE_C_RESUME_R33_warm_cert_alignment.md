---
id: PHASE_C_RESUME_R33_warm_cert_alignment
title: PHASE C RESUME — implement R33 (warm promote-gate = cert-equivalent) + fix #210, then re-warm+re-sweep SF-1
date: 2026-08-02
status: resume dispatch (Phase C stopped at SF-1 STEP 3 on warm!=cert divergence; R33 ratified)
owner: nick
related: [PHASE_C_RESUME_sf1_unblock, PHASE_C_mechanism_vs_prose_SPEC, 2026-08-02_bastrop_recipe_ACCEPTED, _scratch/autonomous-run-bastrop-factory]
---

# PHASE C RESUME — R33 warm/cert alignment

SF-1 STEP 3 correctly STOPPED. Mixed-vintage is FIXED (zero stale residue, ledger populated — CC shows 48021 onboarded 94.72%). The new blocker is a REAL RECIPE GAP, now ruling R33: the warm promote-gate is WEAKER than the cert gate, so 126 parcels promote then fail cert (R32 remeasure + facesAnswer). This is structural (hits every county). Close it, then re-warm+re-sweep SF-1.

## R33 (the ruling to implement — full text in the accepted recipe)
A parcel PROMOTES ONLY IF IT WOULD PASS MECHANICAL CERT. The warm fail-closed gate must be CERT-EQUIVALENT via a SINGLE SOURCE OF TRUTH: warm CALLS THE SAME cert measurement functions (R32 `measurePerEdgeInsetForRings`, the facesAnswer situs-token match) before promote — not a separate check that can drift. A would-fail-cert parcel HONEST-DECLINES at warm, never promotes. Corollary: NORMALIZE the facesAnswer name-match (abbreviations JR/Junior, DR/Drive, ST/Street + case + punctuation) FIRST so it does not false-negative a correctly-oriented parcel — fix the measurement to be RIGHT, then share it. A genuine orientation error (front on wrong edge) still fails; only the name-formatting false-negative is normalized away.

## THE STEPS

### STEP A — FIX PR #210 (reproducibility patches — currently RED)
#210 CI fails on type errors in the new honest-decline-promote.ts: (1) `emptyReason` not a valid property on `{kind:"no-buildable-area"; reason:string}` (use `reason`), (2) `"depth-warm-verify-decline"` not assignable to the envelope kind literal (use the correct kind), (3) a `number` assigned where `WidthedPointEstimate` is expected. Fix to the real atom-contract types; get #210 GREEN. Do NOT merge red. (The patches must be on main for reproducibility — same rule as the Phase A cert-script gap.)

### STEP B — IMPLEMENT R33 (the warm/cert alignment; single source of truth)
1. FACESANSWER NORMALIZATION FIRST (avoid false-negatives): before wiring it into warm, make the facesAnswer situs↔OSM-road-name token-match NORMALIZE — expand common street abbreviations (JR↔JUNIOR, DR↔DRIVE, ST↔STREET, RD↔ROAD, LN↔LANE, BLVD↔BOULEVARD, N/S/E/W↔NORTH/SOUTH/EAST/WEST, etc.), lowercase, strip punctuation, before comparing. Verify on the reported example (48021:35865, "MARTIN LUTHER KING JR DR" vs "Martin Luther King Junior Drive") — it should now MATCH (it's a correctly-oriented parcel). Add a test with abbreviation pairs. A GENUINE front-on-wrong-edge case must still fail (test that too).
2. SHARE THE MEASUREMENT: make the warm promote-gate (`verifyWarmCandidateMechanically` or the promote path) CALL the same functions cert uses — `measurePerEdgeInsetForRings` for the R32 per-edge inset check, and the normalized facesAnswer match — as fail-closed conditions BEFORE promote. A parcel that fails either honest-declines at warm. Warm and cert now share ONE measurement path (they cannot diverge because it is the same code).
3. Add a test asserting a parcel that would fail cert (bad inset OR genuine wrong-orientation) does NOT promote (honest-declines instead).
GATE B: build+tsc+tests green; the R33 alignment is on a PR (can be #210 or a new PR — get it GREEN + merged).

### STEP C — RE-WARM SF-1 (with R33 gate live)
Re-run STEP 1 force-overwrite on the layer-23 SF-1 city roster with the R33 gate in effect. The ~126 that previously promoted-but-failed-cert will now HONEST-DECLINE at warm (except any recovered by the facesAnswer normalization, which will correctly promote). Zero stale residue (single vintage maintained). Ledger re-upserts the new coverage %.

### STEP D — RE-SWEEP SF-1 (target: clean)
Run the district area-sweep cert on the re-warmed SF-1 roster. TARGET: 2466/2466 PASS-or-honest-decline, blockPass=true. Because warm now shares the cert measurement, a promoted parcel CANNOT fail cert — the only non-passes are honest-declines. If ANY promoted parcel still fails cert, STOP + report (that means warm and cert are still not sharing the same path — a real bug, do not force).

### STEP E — CONTINUE THE BLOCKS (only after SF-1 blockPass=true)
GC → MU → RR → PI → IND, each: force-overwrite (R33 gate) → ledger-upsert → area-sweep-clean. PDD + null → graceful honest-decline (S-10). Block-13 QUARANTINED. Each block surfaces in the CC County Ledger (onboarded/coverage/cert-state advance).

### GATE C (stop line — unchanged)
All warmable blocks single-vintage + swept-clean (blockPass) + ledger-populated + CC-visible + PDD-declined → STOP. Report "Bastrop city ready for operator R6" + per-block evidence + CC ledger. NO "certified" claim (operator R6 is the human gate).

## WHY R33 MATTERS (the bigger point — keep capturing this)
R33 is a REAL MOLD IMPROVEMENT found by running the line, exactly as Phase C was meant to surface. It makes "promoted" mean "certifiable" — closing a silent quality gap that would have shipped wrong envelopes at every county. It also SIMPLIFIES onboard(fips): warm and cert become one measurement path, so the generic factory has one gate to trust, not two that must agree. Add R33 to the mechanism-vs-prose spec as a now-MECHANISM item. This is the kind of finding that justifies the by-hand Phase C run.

## DISCIPLINE (unchanged)
Verify against live not agent-reports. Merge only on GREEN CI (head SHA). Fix the measurement to be RIGHT then share it (don't make warm strict against a too-strict cert). Area-sweep not sample. Honest-decline never silent-blank. Both cert gates (mechanical + operator R6). Block-13 quarantined. If a re-sweep still has a promoted-parcel cert-fail after R33, STOP + report (warm/cert still diverging — a bug). Paste raw counts. Keep the mechanism-vs-prose spec current.
