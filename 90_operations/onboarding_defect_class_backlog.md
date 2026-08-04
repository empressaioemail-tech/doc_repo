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

## FULL gate run — fips 48021, 2026-08-03 (all 8 checks live, post-#220)

Run artifact: `_inbox/2026-08-03_preflight_48021_full_gate.json`. **Bastrop 8/8. Bastrop County (unincorporated) 8/8 — EARNS THE RIGHT TO RUN** (first jurisdiction through the full gate; unzoned regime PASS, geometry parity holds on sample, serve-path healthy, cost $14.11 est < $200, superseded 0/5732 with a real denominator). Elgin 5/3, declining only its known ADAPTER-NEEDED + PARCEL-LAYER-UNWIRED classes. Annotations: the fips-wide sample checks (geometry/cost/superseded) are county-sample results for Elgin, not Elgin-specific (it has no parcel rail yet); the 0-superseded count carries a measure-vintage watch (live serve demonstrably honest-declines superseded parcels, so run-time honesty is unaffected). Cert machinery re-proven same run: post-refactor block13-cert-grade reproduces **7/7 CERT-RESTORE ELIGIBLE** (`_inbox/2026-08-03_block13_cert_post_refactor.log`). NEXT: the county warm is now a gate-earned run awaiting operator greenlight (run-what-passes: parcels/terrain/flood rails; zoning/setback honest-absence by regime).

## Class register

| Defect class | Members (rows) | Fix that clears the class | Status |
|---|---|---|---|
| PROBE-UNWIRED (geometry parity, serve-path, cost) | ~~all rows~~ | CLEARED by engine #220 (merged e680dc6 after a #218 revert cycle; src/scripts dependency inverted). Full-gate run 2026-08-03 proves it: geometry parity PASS on sample, serve-path PASS, cost $14.10-14.13 < $200 | CLEARED (`_inbox/2026-08-03_preflight_48021_full_gate.json`) |
| MEASURE-EMPTY-COHORT (superseded 0/0 false-PASS) | ~~Bastrop, Bastrop County~~ | CLEARED by #220 (query keyed countyFips which never exists on envelope bodies → parcelNodeId LIKE; DECLINE backstop added). Full-gate denominator now real: 0/5732. Residual watch: 0 superseded vs the known live superseded-decline parcels (e.g. 48021:141364) — measure-vintage semantics question, run-time honest-decline unaffected | CLEARED (watch note) |
| ADAPTER-NEEDED | Elgin (Rail A layer + zoning source both unwired; row flagged ZONING_SOURCE_TODO) | Wire Elgin's Municode-based Rail A source + AGOL/zoning layer into the registry row (Elgin was Sync 4.5-ingested for code atoms — the CODE corpus exists; the PARCEL/zoning rails need sources). One registry-row edit + verification, then re-run the gate | OPEN |
| PARCEL-LAYER-UNWIRED | Elgin (no railPerParcel) | Same registry-row edit as above (county cadastral + CITY=ELGIN filter, mirroring the Bastrop row's shape) | OPEN |
| SUPERSEDED-GT3PCT | none yet (first honest measures arrive post-D5) | R15 successor re-key (class-backlog per OPS-8, never a run blocker) | EMPTY |
| GEOMETRY-DIVERGE (real divergence, not probe-unwired) | none yet | fix engine before warming the affected cohort | EMPTY |
| SERVE-PATH-UNHEALTHY (real, e.g. retrieval 401) | none yet (the 2026-08-03 cortex key desync predates the gate and is FIXED) | key re-sync + fail-loud (shipped in wave 1) | EMPTY |
| COST-GATE | none yet | per commitment #3, engineering review on any breach | EMPTY |
| MIXED-VINTAGE | none yet (scan PASSed all rows) | enumerate + re-warm plan before running | EMPTY |

## COUNTY ONBOARDED — 2026-08-03 (the first gate-onboarded jurisdiction, end to end)

Full arc same-day: gate 8/8 → recon (zoning honest-absence layer already baked 2026-07-24; real gap = zero envelope/setback atoms for the 56,488-parcel unincorporated cohort) → contract-shape STOP honored (no fabricated setback-rule atoms; planner ruled envelope-decline-only via the R27 persisted-decline precedent, code `unzoned-no-district-basis`) → engine #222 merged green → cascade run against prod: **scanned 62,260, cascaded 56,488, errors 0** (dry-run predicted the exact count; city cohort untouched, verified live: exactly 5,732 non-cascade envelopes remain) → **county cert 20/20 PASS (all honest-decline, rings resolve), blockPass true** (`_inbox/2026-08-03_county_cert_20of20.json`). Every unincorporated parcel now carries: zoning-fact (named absence) + buildable-envelope (named decline, honest reason string) + terrain/flood serve-time rails; setback-rule legitimately absent by regime. KNOWN TOOLING ARTIFACT on the cert: one scopeAnnotation claims Rail A "not runnable" — the cert script's internal preflight lacks the HTTP probe wiring the standalone gate CLI has; the authoritative full-gate artifact shows Rail A PASS. Queued nit: wire probes into the cert-path preflight. Queued ADR: first-class absence variants for setback-rule/buildable-envelope in @empressaio/atom-contract (tonight used the R27 precedent instead of extending the contract).

## Operating rule

Fix by class, in isolation, off the critical path; re-run the gate after each class fix; a class row moves to CLEARED with the gate-run artifact that proves it. The run never waits on this ledger.
