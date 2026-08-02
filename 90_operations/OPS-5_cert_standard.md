---
id: OPS-5_cert_standard
title: OPS-5 — Cert Standard (what "certified" means per unit; the anti-sampling, grade-the-geometry gate)
date: 2026-08-02
status: operations doc (gap-closure: cert-not-on-main, R10 reproducibility; the mold's cert law)
owner: nick
related: [OPS-2_county_onboarding_runbook, 2026-08-02_bastrop_recipe_ACCEPTED, 2026-07-31_BASTROP_BLOCK13_CERT_RESTORED]
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

## GAP #2 CLOSE — CERT MUST BE REPRODUCIBLE FROM MAIN
Verified: `block13-cert-grade.mjs` is NOT on main (only on branch `chore/block13-cert-grade-script @ 4f3891e`). "Certified 7/7" is currently NOT reproducible from origin. CLOSE:
- MERGE the cert script to main (a hard scale prerequisite — the mechanical cert must be reproducible).
- EXTEND it from the 7-parcel Block-13 roster to the R17 full-jurisdiction roster (the TxGIO city-limits set for a city).
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
