---
id: 2026-08-03_gate_complete_county_earns_run
title: Session — D5 probes landed (after a revert cycle), full gate run: Bastrop County 8/8 earns the right to run
date: 2026-08-03
status: closed
owner: nick
agent: claude_code (planner + 1 sonnet executor)
related: [90_operations/onboarding_defect_class_backlog, 90_operations/OPS-8_blocker_free_onboarding_model, _decisions/2026-08-03_consumer_mode_citation_posture, _sessions/2026-08-03_trust_surface_wave1_execution_claude_code]
---

# Gate complete: the county earns its run

Final arc of the 2026-08-03 build day. Wired the last three pre-flight probes, survived a self-inflicted merge-red incident, and ran the complete OPS-8 gate against prod for the first time.

## Outcome

Bastrop County (unincorporated) passed the full 8-check gate 8/8 — the first jurisdiction to EARN THE RIGHT TO RUN through the gate instead of around it. Bastrop city also 8/8. Elgin 5/3, declining on exactly its known adapter and parcel-rail gaps, nothing else. Cost estimate $14.11 per sample-extrapolation against the $200 commitment-#3 gate. The cert machinery was re-proven the same run: the refactored block13-cert-grade (now a thin CLI over src/registry/cert-grade-core.ts) reproduces 7/7 CERT-RESTORE ELIGIBLE against prod. Artifacts in _inbox; defect-class backlog updated (PROBE-UNWIRED and MEASURE-EMPTY-COHORT cleared).

## The incident, on the record

Planner merged engine #218 against a red check: the merge command gated on a gh exit code, which is 0 even when the run conclusion is "failure". Reverted via #219 (gated properly), executor reworked as #220 with the src-never-imports-scripts dependency inversion, merged green. The executor's CI-log forensics then corrected the planner's diagnosis: the red was NOT #218's doing — it was a pre-existing order-dependent flake in the site-plan/pdf suite (decodeAllContentStreams inflateSync; a different test file fails each occurrence; hit 4+ runs across 2026-08-01..03), now filed as engine issue #221. Memory hardened twice: merge gating on the conclusion string, and the script-imports-src dependency rule. The revert was the correct risk posture with the information available; the dependency inversion was correct architecture regardless.

## Also this session

Consumer-mode citation posture ruled (operator accepted the planner recommendation): markerless consumer prose retained, structured sources array always attached derived from actual grounding, marker-proxy confidence (0.75/0.5) retired. Decision record filed; implementation folds into the ldt fix-6 dispatch.

## The decision now on the operator's desk

Greenlight the Bastrop County warm. It is gate-earned: run-what-passes executes the parcel/terrain/flood rails, zoning and setback resolve as honest-absence by unzoned regime, and the resulting cert carries scopeAnnotations per the 2026-08-03 ruling. Elgin unblocks separately via one registry-row edit wiring its Rail A and zoning sources.

## Watch items carried

- Superseded measure reads 0/5732 while live serving demonstrably honest-declines superseded parcels (48021:141364) — a measure-vintage semantics question, not a serving risk; check before trusting the 0 in any external statement.
- Elgin's fips-wide sample PASSes (geometry/cost/superseded) are county-sample results, not Elgin-specific, until its parcel rail exists.
- PDF-suite flake #221 remains open; until fixed, any engine CI red in site-plan/pdf on an untouched file warrants a log pull before diagnosis.
