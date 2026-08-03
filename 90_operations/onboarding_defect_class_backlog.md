---
id: onboarding_defect_class_backlog
title: Onboarding defect-class backlog (OPS-8 dual-ledger, doc side)
date: 2026-08-03
status: active
owner: nick
related: [OPS-8_blocker_free_onboarding_model, _sessions/2026-08-03_trust_surface_wave1_execution_claude_code, _decisions/2026-08-03_cert_scope_annotation_ruling]
---

# Onboarding defect-class backlog

The class-grouped half of the OPS-8 dual defect ledger: every pre-flight decline and honest-decline event groups by DEFECT CLASS so one fix clears a whole class. The CC per-jurisdiction gaps column is the other half (not yet built). Source of truth for entries: `onboard-preflight` ledger-event JSON from real gate runs, planner-run with prod creds, verbatim artifacts kept alongside.

## First real gate run — fips 48021, 2026-08-03 (baseline, pre-D5 probes)

Run artifact: `_inbox/2026-08-03_preflight_48021_baseline.json`. Verdicts: Bastrop 5/8 PASS, Bastrop County (unincorporated) 5/8 PASS (unzoned regime correctly PASSES zoning as expected honest-absence), Elgin 2/8. Zero mid-run stalls; every gap named up front. The inversion works.

## Class register

| Defect class | Members (rows) | Fix that clears the class | Status |
|---|---|---|---|
| PROBE-UNWIRED (geometry parity, serve-path, cost — reported under GEOMETRY-DIVERGE / SERVE-PATH-UNHEALTHY / COST-GATE with "not runnable: probe not configured") | Bastrop, Bastrop County, Elgin (all rows, all 3 probes) | D5 (`feat/preflight-probes-wired`, in flight 2026-08-03): wires all three probes into the CLI | IN FLIGHT |
| MEASURE-EMPTY-COHORT (superseded check returned 0/0 = could-not-measure masquerading as PASS) | Bastrop, Bastrop County (Elgin excused: no parcel rail) | D5 addendum: 0-denominator on a wired parcel rail becomes a named DECLINE; measurement path diagnosed | IN FLIGHT |
| ADAPTER-NEEDED | Elgin (Rail A layer + zoning source both unwired; row flagged ZONING_SOURCE_TODO) | Wire Elgin's Municode-based Rail A source + AGOL/zoning layer into the registry row (Elgin was Sync 4.5-ingested for code atoms — the CODE corpus exists; the PARCEL/zoning rails need sources). One registry-row edit + verification, then re-run the gate | OPEN |
| PARCEL-LAYER-UNWIRED | Elgin (no railPerParcel) | Same registry-row edit as above (county cadastral + CITY=ELGIN filter, mirroring the Bastrop row's shape) | OPEN |
| SUPERSEDED-GT3PCT | none yet (first honest measures arrive post-D5) | R15 successor re-key (class-backlog per OPS-8, never a run blocker) | EMPTY |
| GEOMETRY-DIVERGE (real divergence, not probe-unwired) | none yet | fix engine before warming the affected cohort | EMPTY |
| SERVE-PATH-UNHEALTHY (real, e.g. retrieval 401) | none yet (the 2026-08-03 cortex key desync predates the gate and is FIXED) | key re-sync + fail-loud (shipped in wave 1) | EMPTY |
| COST-GATE | none yet | per commitment #3, engineering review on any breach | EMPTY |
| MIXED-VINTAGE | none yet (scan PASSed all rows) | enumerate + re-warm plan before running | EMPTY |

## Operating rule

Fix by class, in isolation, off the critical path; re-run the gate after each class fix; a class row moves to CLEARED with the gate-run artifact that proves it. The run never waits on this ledger.
