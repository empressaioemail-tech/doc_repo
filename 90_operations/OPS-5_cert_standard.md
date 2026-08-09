---
id: OPS-5_cert_standard
title: OPS-5 — Cert Standard (what "certified" means per unit; the anti-sampling, grade-the-geometry gate)
last_updated: 2026-08-08
owner: nick
related: [OPS-2_county_onboarding_runbook, 2026-08-02_bastrop_recipe_ACCEPTED, 2026-07-31_BASTROP_BLOCK13_CERT_RESTORED, _decisions/2026-08-07_envelope_saga_close_and_geometry_law]
layer: L-LEDGER + L-SURFACE
closes_gaps: [2 cert-not-on-main, 10 R10-live-reproducibility]
---

# OPS-5 — Cert Standard

## WHAT THIS IS
The definition of "certified" for every unit (parcel → block → city → county → state), and the mechanical + operator gates that produce it. Distilled from the recipe's cert bucket (R3-R32). This is what stands against a plan reviewer and what the customer can trust.

## THE TWO GATES (both required — R6)
1. MECHANICAL AREA-SWEEP — every parcel in the FULL browsable extent (R17), graded by the cert harness. Can be under-strict (it once passed a shape it said it rejected) — which is why gate 2 exists.
2. OPERATOR R6 LIVE QA — the operator's eye on the swept area in CC (OPS-6). Catches what the assertion missed; the catch TIGHTENS the assertion. Cert is NOT claimed until BOTH pass.

## SCOPE — WHAT "THE AREA" IS (R11/R14/R17; anti-sampling)
- Cert scope = the customer-BROWSABLE extent, never a bbox/manifest/curated list (those are SEEDS). For a city drill: the whole city limits (use the TxGIO City_Boundaries layer per OPS-1 to define "the city" — solves the empty-BCAD-city-field problem). For a county: the county cadastral browsable set.
- FAIL-CLOSED: any rendered parcel without a current atom = cert FAIL (or a flagged, human-accepted exclusion WITH a reason — never a silent skip).
- One wrong parcel in scope = the whole area FAILS (R3). Never sample.

## THE FOUR MECHANICAL GATES PER PARCEL (from Block-13 cert)
1. DISTRICT — matches the live zoning layer / dominant row (R26).
2. SETBACK NUMBERS — match the per-parcel record (R1), interior/corner-side distinct (R2), all fields (R24: district, F/interior-S/corner-S/R, height, impervious %, min-lot, disclosures).
3. R32 PER-EDGE INSET — the DRAWN envelope, measured in FEET by INDEX-MATCHED INWARD-NORMAL (engine frame, NOT perpendicular-to-nearest which false-flags non-convex lots), matches each edge's setback (R19/R21/R32).
4. FRONT ORIENTATION — the front setback is on the actual street-frontage edge (situs-street-match), via the road-node token match (R30/R31) — not just "the right magnitudes appear somewhere."
PLUS: R20 three-way convergence (PE == SmartCity == city GIS per field); R9 parcel-currency; R10 persisted == recompute; R13 no repealed code served.

## WARM-TIME GEOMETRY GATES (T1 catch-up permanence, 2026-08-05)

> **CORRECTION 2026-08-08:** the R28 line below names BCAD as "the working ring." This is SUPERSEDED by the Geometry Law (`_decisions/2026-08-07_envelope_saga_close_and_geometry_law.md`, engine PR #273 Serve-Consistency): **txgio is THE truth frame** that envelopes are constructed from, verified against, and served on. BCAD is demoted to a currency/divergence-reporting instrument only: it flags `PARCEL-RING-SOURCE-DIVERGENCE`, it never silently substitutes as the working ring. Any cert or warm-time gate still grading against the BCAD ring as the working frame is running the pre-Geometry-Law frame and is a named open item (`_decisions/2026-08-07_envelope_saga_close_and_geometry_law.md` calls out the cert lane's historical BCAD grading frame explicitly as unreconciled). Read "BCAD ring" below as legacy language pending that reconciliation, not current doctrine.

Every city-cohort re-warm MUST run with `--force-overwrite` (implies `--force-repromote`) so the warm path applies the same gates as cert/export:
- **R28**: recompute boundary primitive when stored normals disagree with the working ring (winding swap at equal vertex count). (Legacy text named "BCAD ring" here; per the Geometry Law the working/truth ring is txgio, with BCAD divergence reported separately, not substituted.)
- **R30** — re-derive edge roles from fresh `labelEdgesFromRoads` + situs-street-match; never promote stale boundary-edge roles.
- **Flag-lot rear gating** — inward-normal opposition and same-street backing promotion apply ONLY when `detectFlagLotShape()` is true or the parcel is a corner lot with a single non-front road-adjacent edge (ordinary lots like Block-13 34177 must not regress).

Script: `depth-warm-bastrop-batch.mjs` (and Elgin/Caldwell siblings). Regression gate: Bastrop block-13 **7/7** before and after every warm apply.

## AREA-SWEEP CERT (anti-sampling, T1 catch-up permanence)
Product-visible geometry defects MUST be caught by **full-block area sweeps**, never a 7-parcel sample:
- Use `block13-cert-grade.mjs --roster-from=query --district-prefix=<BLOCK>` (dominant-district roster) or a file roster listing every parcel in the browsable block.
- Minimum acceptance for city drill close: Jones/Higgins lead exhibit block + two additional contiguous SF-1 blocks, all parcels graded.
- One promoted parcel failing R32/R30 in scope = block FAIL (R3).

## WARDEN v1.2 ENVELOPE-SANITY (T1 catch-up permanence)
Post-cert sweeps MUST include checkId `envelopeSanity` (engine PR #256, `warden-sweep.mjs` default set):
- Envelope polygon contained in parcel ring.
- Area ratio within district regime bounds (SF-1: 0.30–0.95; flag sliver <0.05 or full-lot ≥0.995).
- Inset edges parallel to lot edges (12° tolerance).
- defectClass: `ENVELOPE-SHAPE-ANOMALY`. Files never fixes.

## WARDEN v1.3 SERVE-TRUTH EDGE LABELS (T1 WS1 permanence, 2026-08-06)
Post-cert sweeps on zoned cities MUST include checkId `serveTruthEdgeLabels`:
- For each sampled (or cert-roster) promoted parcel: fresh cert-path `labelEdgesFromRoads` edge labels vs export-served roles after `prepareBoundaryEdgesForExport`.
- Compare role at each cert-graded edgeIndex; front edge index must agree.
- defectClass: `CERT-VS-SERVE-EDGE-MISMATCH`. Files never fixes.
- **WS1 close gate:** operator twelve Jones/Higgins must pass 12/12 on this check after Option A promote fix + scoped re-persist. Cert-path area-sweep pass alone does NOT close WS1.
- Dispatch: `_dispatches/2026-08-06_T1_warden_v13_serve_truth.md`

## SERVE-TRUTH WRITE PATH (T1 WS1 permanence, 2026-08-06)
Warm promote MUST persist `property-boundary-edge` atoms (labels + ring tessellation from verify-pass candidate), superseding stale primitives. Export R28/R30 (#255) is read-side guard only. Dispatch: `_dispatches/2026-08-06_T1_promote_persist_boundary_edges.md`

**Cohort re-persist roster:** derive from atoms store (all active promoted `buildable-envelope` parcels per jurisdiction), NOT from a single warm run's promote count. Checkpoint: `_inbox/2026-08-06_T1_cohort_repersist_roster_checkpoint.md`.

## GAP #2 CLOSE — CERT MUST BE REPRODUCIBLE FROM MAIN
**CLOSED 2026-07-31:** `block13-cert-grade.mjs` is on engine main and reproduces 7/7 from origin. Remaining extension:
- EXTEND area-sweep from Block-13 quarantine roster to full district-block rosters (dominant-district query mode shipped; R17 full-jurisdiction roster still queued).
- The cert harness is itself a MECHANICAL GUARD (OPS-3): it's the promoted, durable form of "what correct means."

## GAP #10 CLOSE — R10 LIVE REPRODUCIBILITY
Verified: persisted==recompute (R10) was NOT re-run this session (read-only). CLOSE: a read-only recompute PROBE (no promote) that, for a sample of served parcels, recomputes the envelope fresh and asserts it equals the promoted atom. Run per cert. A drift = a stale promote (re-warm needed) or a nondeterminism leak (OPS-3 I2/I3).

## CERT UNITS + WHAT "CERTIFIED" MEANS AT EACH
| Unit | Cert scope | Gates | Certified means |
|---|---|---|---|
| Parcel | 1 parcel | 4 mechanical + convergence | that parcel is plan-reviewer-correct |
| Block | all parcels in the block | area-sweep + R6 | Block-13 = the proven reference (quarantined) |
| City | all city-limits browsable parcels (TxGIO city boundary) | area-sweep + R6 per district block + PDD honest-decline | the city is a served correct product |
| County | county cadastral browsable set | same, at county scope | the county is served |
| State | all 254 counties onboarded + certified per their unit | per-county certs + coverage-honest banner for gaps | Texas is on the spine |

## THE HONEST-ABSENCE RULE AT CERT (per OPS-7)
A parcel/district/county that genuinely lacks a layer (PDD conditional, unincorporated-unzoned, un-onboarded county) is NOT a cert failure — it HONEST-DECLINES gracefully ("coverage in progress" / "conditional, verify with city"), marked at the app level, never a silent per-parcel blank. Cert asserts: no parcel serves stale/blank/repealed; every served value is correct; every absence is honestly disclosed.

## THE CERT LEDGER (feeds the performance layer, OPS-4/6)
Each cert run records per unit: parcels-swept, pass/fail per gate, the R6 verdict + operator, the recipe-version certified under, timestamp. cert_state flows to county_facet_coverage. A jurisdiction's cert is STALE when its recipe-version < current (rewarm + re-cert needed).
