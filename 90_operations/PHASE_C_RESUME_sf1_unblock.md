---
id: PHASE_C_RESUME_sf1_unblock
title: PHASE C RESUME — unblock SF-1 (single-vintage overwrite + ledger-write-path) then continue the blocks
date: 2026-08-02
status: resume dispatch (Phase C stopped at SF-1 cert on mixed-vintage promotes; operator-decided unblock)
owner: nick
related: [PHASE_C_HANDOFF_bastrop_warm, PHASE_C_mechanism_vs_prose_SPEC, 2026-08-02_bastrop_recipe_ACCEPTED, _scratch/autonomous-run-bastrop-factory]
---

# PHASE C RESUME — SF-1 unblock

Phase C correctly STOPPED at SF-1 mechanical cert. The STOP was RIGHT (the correctness gate caught a real defect; the mold is not broken). Root cause: SF-1 substrate is MIXED-VINTAGE — ~1,444 fresh recipe-1.0.0 promotes from the run + ~844 stale depth-warm-promoted-v1 atoms from pre-Phase-C warms serving OLD setbacks (layer-83 F30/S10/R30) instead of layer-23 authority (F25/S5/R25). This is R10 (persisted != recompute). This resume unblocks SF-1, wires the missing ledger-write-path, and continues the blocks.

## HANDOFF CORRECTIONS (the prior handoff had these wrong — use THESE)
- DB ENV: substrate atoms on `hauska-prod DATABASE_URL`; txgio_parcel + county_facet_coverage on `CORTEX_DATABASE_URL`. (NOT "both on cortex Neon".)
- CITY BOUNDARY: the batch used `BASTROP_CITY_BBOX` (17,217 txgio rows) — OVER-BROAD. The cert roster is layer-23 CITY='BASTROP' (~6,972). Warm+cert must be scoped to the layer-23 city roster, not the bbox.
- WINDOWS TLS: `NODE_OPTIONS=--use-system-ca` required for BCAD ArcGIS.
- LEDGER-WRITE-PATH IS MISSING: the warm promotes atoms to the substrate but does NOT upsert county_facet_coverage on cortex Neon → CC County Ledger stays 0%. This must be WIRED (see step 3).

## THE STEPS (in order; each gates the next)

### STEP 0 — DIAGNOSE THE 783 VERIFY-FAILS FIRST (do NOT re-warm blind)
34% of SF-1 (783/2285) failed verify. Before any overwrite, classify the failures — if a whole class is a systematic bug, force-overwrite just re-fails them. Read-only: bucket the 783 by decline/fail reason (road-classification, null inset, superseded prop_id, no-setback-row, etc.). Report the distribution. Determine for each bucket: is it a LEGITIMATE honest-decline (genuinely un-warmable — e.g. superseded prop_id, no layer-23 row) OR a systematic BUG (e.g. a whole road-class stranding, a null-inset pattern that should resolve). If a systematic bug is found that the recipe should clear, STOP and fix the root cause before overwriting (that is itself a recipe-correctness finding). If they are legitimate honest-declines, proceed — they become honest-absence on PE, never silent blanks.

### STEP 1 — FORCE-OVERWRITE ALL SF-1 TO A SINGLE VINTAGE
Extend the warm to re-promote EVERY SF-1 parcel in the layer-23 city roster UNCONDITIONALLY (not just verify-passers) — overwriting the ~844 stale depth-warm-promoted-v1 atoms with fresh recipe-1.0.0 from layer-23. This also exercises R27 (invalidate stale envelope on re-warm) at scale — a stale-vintage atom must be SUPERSEDED, not left to serve. --force-repromote must overwrite regardless of prior promotion marker. Verify-fails (the honest-decline set from STEP 0) get an honest-decline atom/state, NOT a silent stale atom left behind. END STATE: every SF-1 parcel served is either recipe-1.0.0 OR honest-decline — zero depth-warm-promoted-v1 residue.

### STEP 2 — WIRE THE LEDGER-WRITE-PATH (the missing mechanism)
After a block warms+promotes, UPSERT county_facet_coverage on cortex Neon (CORTEX_DATABASE_URL) for 48021 per facet (zoning, envelope): honest_coverage_pct, recipe_version=1.0.0, cert_state (uncerted→mechanical-pass→r6-pass), source_vintage, owner_match_rate, onboarded=true, checked_at. This is the mechanism that makes the CC County Ledger reflect progress (Phase B built the READ; this is the WRITE). Wire it as a post-block hook. VERIFY: after SF-1, GET /api/county-ledger shows 48021 envelope facet with recipe_version 1.0.0 + a real coverage %, not 0%.

### STEP 3 — RE-SWEEP SF-1 (single-vintage cohort)
Run the district area-sweep cert on the now-single-vintage SF-1 roster. PASS criterion: every rendered SF-1 parcel is recipe-1.0.0-correct against layer-23 (R32 per-edge inset + orientation + district + numbers + convergence) OR a disclosed honest-decline. NO stale-vintage atom. NO silent blank. 2286/2286 must be PASS-or-honest-decline. If it still fails, STOP + report the new root cause (do not force).

### STEP 4 — CONTINUE THE BLOCKS (only after SF-1 PASS)
Repeat STEP 1-3 per block: GC → MU → RR → PI → IND. Each: force-overwrite to single vintage → ledger-upsert → area-sweep to clean. PDD (1978) + null (117) → graceful honest-decline pass (S-10), not cert failures. Block-13 QUARANTINED throughout.

### GATE C (the stop line — unchanged)
All warmable blocks single-vintage + swept-clean + ledger-populated + CC-visible + PDD-declined-honestly → STOP. Report "Bastrop city ready for operator R6" + per-block evidence + the CC ledger showing 48021 onboarded. NO "certified" claim — operator R6 is the human gate.

## PR THE LOCAL PATCHES (owed — get them on main so this is reproducible)
The prior run made LOCAL-ONLY patches (not on hauska-engine main): --district-prefix + Block-13 auto-quarantine in the batch; bastrop-district-cert-grade.mjs (district area-sweep with dynamic layer-23 answer key). PR these to main (CI green) so the warm+cert are reproducible from origin — a reproducibility requirement (same class as the cert-script-not-on-main gap we closed in Phase A). The ledger-write-path (STEP 2) also goes on main.

## DISCIPLINE (unchanged — paste into sub-dispatches)
Verify against live not agent-reports. Area-sweep not sample. Force-overwrite must leave ZERO stale residue (R10/R27). Honest-decline never silent-blank. Deploys/warms planner-owned. Both cert gates (mechanical + operator R6). Block-13 quarantined. If a systematic bug appears (STEP 0) or a re-sweep still fails, STOP + report the root cause — never force. Paste raw counts/probe output. Continue capturing mechanism-vs-prose for the onboard(fips) spec.
