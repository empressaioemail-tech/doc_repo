---
id: T1_data_accuracy_track
title: T1 — Data accuracy track (catch-up program)
status: active
owner: nick
related: [CATCHUP_program_2026-08-05, HEALTH_CHECK_2026-08-05_verdict, onboarding_defect_class_backlog, 90_runbooks/factory_onboarding_runbook]
---

# T1 — Data accuracy

Mission: every known data defect cleared or honestly classified, verified by the instrument that found it. Holds the atoms-DB heavy-scan slot; run heavy items strictly serially.

## Workstreams, in execution order

1. CITY ENVELOPE RE-WARM (lead exhibit). The 2026-08-03 depth-warm-verify-promote wrote first-ever envelopes for the Bastrop city cohort with edge-role misassignment on ordinary lots (evidence: HEALTH_CHECK verdict lead exhibit; twelve-parcel Jones/Higgins block sweep; atoms all sourceAdapter=depth-warm-verify-promote 08-03 03:03, single version). Engine #255 fixed edge roles at EXPORT time (R28 ring recompute + R30 relabel in prepare-boundary-edges-for-export.ts); the same gates must now run at WARM time. Re-warm the city cohort with warm-time R28/R30 + situs fallback, dry-run first, then cert by AREA SWEEP (every parcel on at least the Jones/Higgins block and two more contiguous blocks — not a 7-parcel sample), block13 7/7 before/after, then Warden sweep. Deliver before/after envelope renders for the operator's twelve screenshots. This run is ALSO the incremental-rewarm proving run: record wall time, batch size, and what an incremental (changed-only) mode would need.
2. WARDEN v1.2 ENVELOPE-SANITY CHECK: new check — envelope within parcel ring, area ratio within regime bounds, inset edges parallel to lot edges; files findings, never fixes. Ship BEFORE closing workstream 1 so the re-warm is verified by the new instrument.
3. STAMP-TO-ATOMS PROPAGATION BAKE for the 40 stamped parcels (backlog: Bastrop-40 STAMP APPLIED note): scoped zoning-fact bake from district store to atoms, then envelope path per regime; Bastrop Warden re-sweep expecting ~50 neighbor findings to drop to ~9 (7 gaps + 1 edge + 29431).
4. ROSTER-WIDE STAMP UNDER-COVERAGE SWEEP (backlog: STAMP-CENTROID-PRECISION): post-#386 dry-run for EVERY ZONING_LAYERS city; per-city would-stamp count = historical under-coverage; review with master planner, then per-city applies with regression gates, then propagation as in 3.
5. THE 7 GAP PARCELS (backlog: MIXED-VINTAGE-NEIGHBOR recon) — OPERATOR RULING: NO city follow-up. Resolve from public record only: check newer published zoning layers/editions for coverage; if the public record genuinely does not zone them, serve honest no-district-on-record. Never ask the city; never guess.
6. FLAG-LOT ORIENTATION (Mesquite 80577/80578, EDGE-ROLE-MISJUDGED remainder): side-vs-rear judgment for flag/irregular lots in the orientation pass; verify against both Mesquite lots + a fixture; explicitly out of #255's scope, in yours.
7. SMALL CLASSES: 48021:29431 dup-geometry (resolve current geometry vs live CAD, R15 re-key); 3 Caldwell CAD-vintage-drift roster parcels (parcel-currency check); Caldwell county cohort-loader-zero (loader query vs its layer shape).
8. ELGIN PARITY: apply workstream 1's treatment to Elgin's promoted cohort (re-warm with warm-time gates, area-sweep cert) and close the ELGIN-CERT-RESIDUAL (a) orientation-token and (b) rear-emit residuals in the same pass — Elgin must exit this track at the same standard as Bastrop city, not remain a parked lane.
9. CORPUS UNIT DRIFT (pulled in from the queue): Bastrop UDC Municode drift-skip (establish the current-edition unit — pairs with the ADU edition question), ICC unit 0-section drift (citations leg depends on it), Grand County legacy-env absence in snapshot builds (env-provisioning fix or honest retirement of the unit). Eval-gated re-ingests through the standard corpus lane.
10. ADU ANSWER-QUALITY (queue: ANSWER-QUALITY GAP): (a) COVERAGE/EDITION — determine whether Bastrop's ADU provisions (Dev Code Ch. 14; city publishes current code with Feb 2026 updates) exist in the served corpus; the Municode Bastrop UDC unit is drift-skipped and the B3 PDF may predate them; if absent, ingest the current edition unit through the standard corpus lane (eval-gated) and pg-load; (b) RETRIEVAL RANKING — an "ADU" concept query returned park-rules/severability chips; diagnose and fix concept-query ranking (synonyms/definitions boost or embedding path per the retrieval architecture); (c) re-ask the operator's exact question on 109 Higgins and deliver the before/after answer with citations.

## Acceptance (master planner verifies live)

Jones/Higgins block renders uniform correct envelopes; area-sweep cert artifacts on 3+ blocks; block13 7/7 held at every data change; Bastrop Warden sweep at ~9 explained findings with v1.2 check active; roster sweep numbers reported per city with applies landed or explicitly held; 7 gaps resolved-or-honestly-declined with public-record evidence; Mesquite lots render correct side/rear; ADU question answered with citations on the live product; all backlog rows updated; every artifact in _inbox UTF-8.

## Handoff prompt

See the CATCHUP program doc for coordination rules. The prompt hand-carried to this track's planner is in the master planner's chat delivery of 2026-08-05.
