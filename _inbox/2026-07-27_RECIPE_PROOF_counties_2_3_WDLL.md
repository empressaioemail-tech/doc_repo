---
id: 2026-07-27_RECIPE_PROOF_counties_2_3_WDLL
title: WDLL — RECIPE-PROOF counties #2-3 (Caldwell then Hays) — mold generalization MEASUREMENT
status: approved
date: 2026-07-27
operator_approval: 2026-07-27 (operator RECIPE-PROOF dispatch)
governs: 27d_county_onboarding_recipe_and_fleet_reliability Wave 1 / 27f Amendment 2 / 27e Wave 1
related:
  - 27d_county_onboarding_recipe_and_fleet_reliability
  - 27f_bastrop_through_v2_program
  - 27e_multitrack_program_structure_and_wave_plan
  - _scratch/depth-engine-27c.md
  - _dispatches/2026-07-27_RECIPE_PROOF_caldwell_48055.md
---

# WDLL: RECIPE-PROOF — counties #2-3 (CTX gate)

## Done looks like

A fresh county-lane BUILDER, given only this recipe dispatch + M0 scratch + a Caldwell descriptor, runs the 27d 8-gate recipe on **Caldwell County (48055)** as county #2. The output is a MEASUREMENT, not a pass/fail: for each gate, **HELD** (Bastrop-baked mold carried) vs **RE-OPENED** (new decision surfaced). New decisions are proposed for planner M0 promotion into durable gates so county #3 (Hays 48209) inherits them. Planner verifies LIVE (depth ratio SELECT, cost paste, per-gate tally) and owns promotion. CTX fan-out stays HELD. False-green and false-failure are both wrong — honest generalization number only.

## Framing (27f Amendment 2 — locked)

- This is NOT "did Caldwell work." It is "N of 8 gates held; M new decisions surfaced and were baked."
- Re-opening figuring-out is EXPECTED DATA about the mold, not a failure.
- Re-deriving a decision Bastrop already baked (front-labeling, SCHEMA≠DATA, geometry positive-space, offset-consumes-primitive, honest partial inset, gravel fallthrough, etc.) is an **M0-reach miss** — flag it.

## Acceptance items

1. **DESCRIPTOR IN (gate 1).** Caldwell descriptor authored mirroring Bastrop shape (FIPS, zoning→setback table indexed by road-class+edge-role, assumedRowWidthFt, source adapters, accessPolicy). Record whether Caldwell zoning vocab/setback structure **fits** the Bastrop table shape or needs a **new structure**. | check: descriptor file in engine; shape-fit note pasted | grade: [ ]

2. **INTAKE (gate 2) + AUTHORITATIVE-ROAD-SOURCE-RECON.** Parcels + zoning + roads ingested. Find ALL Caldwell jurisdiction road sources (county + comprehensive + each incorporated city: Lockhart, Luling, Martindale, Mustang Ridge as applicable). Check DATA POPULATION (defined surface/class vs Undefined), not schema alone. OSM best-available where sparse. Record same-split vs new-split. | check: recon JSON + provenance split counts + population ceiling | grade: [ ]

3. **ROAD + FRONT LABELING (gate 3).** Front-labeling fixture gate holds on Caldwell geometry OR surfaces a new labeling case (proposed as gate). | check: vitest green OR named new fixture + proposal | grade: [ ]

4. **RULE (gate 4).** Road-type setbacks resolve from Caldwell descriptor; citation/honest-absence recorded. | check: sample parcel street vs alley (or honest no-alley) divergence or decline | grade: [ ]

5. **REASONING (gate 5).** Boundary primitive + real offset path; 28286-class stays dead. New geometry surprises recorded. | check: named Caldwell promote with insetFeet + area; no asymmetric empty on near-rect | grade: [ ]

6. **WARM→VERIFY→PROMOTE (gate 6).** Mechanical verify gate; only pass promotes. | check: promote outcomes JSON; verifyPass/Fail/decline split | grade: [ ]

7. **TALLY + COST (gate 7).** Live depth ratio (place-type + all-zoning separately if applicable) + measured cost under commitment #3 ($200 + 1hr human). | check: planner live SELECT + cost paste | grade: [ ]

8. **SMOKE (gate 8).** Named Caldwell nodes readable through ledger/retrieval path. | check: live probe on ≥1 warm node | grade: [ ]

9. **GENERALIZATION NUMBER.** Per-gate HELD vs RE-OPENED tally; N held / M new-baked. | check: planner check-in table | grade: [ ]

10. **M0 PROMOTION (planner-owned).** Every NEW Caldwell decision becomes a durable gate (test preferred) before Hays #3. Flag any re-derivation of a baked Bastrop decision as M0-reach miss. | check: promoted gates cited; miss list (or none) | grade: [ ]

11. **CTX HELD.** No Central-TX fan-out opened. | check: no Travis/Williamson/Bexar depth promote | grade: [ ]

12. **Hays #3 (conditional).** Only if Caldwell measurement clears (gates runnable + cost under #3 + M0 promotions landed). Same card, second data point. | check: same per-gate table for 48209 OR deferred with reason | grade: [ ]

## Negative done-line

NOT done if: Caldwell is declared "works" without per-gate held/reopened; a new learning is scored as failure; a baked Bastrop decision is re-derived without an M0-reach miss flag; cost/tally is reported without planner live paste; CTX fan-out is opened; Hays starts before Caldwell M0 promotions land.

## Baseline (planner BEFORE, cortex Neon 2026-07-27)

```
txgio_parcel 48021 (Bastrop) = 74729
txgio_parcel 48055 (Caldwell) = 32781
txgio_parcel 48209 (Hays)     = 131734
```

Caldwell depth_warm / road_nodes BEFORE = to be pasted by planner at verify (atoms substrate). Known PE history: Lockhart setback table RLD/RMD/RHD live; Caldwell node `48055:11386` prior OSM road signal.

## Finish card (graded at close — Caldwell #2, 2026-07-27)

1. met: `caldwell_tx_descriptor.json` mirrors Bastrop shape; RLD/RMD/RHD; hard-holds omitted — planner concurs HELD
2. met (RE-OPENED recorded): AUTHORITATIVE recon + SCHEMA≠DATA held; **UNREACHABLE-CITY-GIS** new — promoted to 27d
3. met: front-labeling fixtures green; no new Caldwell labeling case
4. met: road-type setbacks from descriptor; alley honest-absent
5. met: smoke `48055:103533` area 14177; no 28286-class false-reject in cohort
6. met: warm→verify→promote cohort outcomes; mechanical verify
7. met: planner live tally depth_warm=337/5027=6.70%; cost ~$0.39 flaggedOverCostGate=false
8. met: smoke atom live
9. met: **N=7 held / M=1 new-baked** — check-in `_inbox/2026-07-27_RECIPE_PROOF_caldwell_planner_verify_checkin.md`
10. met: UNREACHABLE-CITY-GIS → 27d + mechanical vitest (engine PR #148); M0-reach miss=none
11. met: CTX not opened
12. dropped: Hays #3 — operator 2026-07-27 close: Caldwell signal banked; mold-first (Bastrop market-ready) before scale. Hays/CTX post-Bastrop.

## Amendments

- 2026-07-27: Gate 2 RE-OPEN recorded as measurement success (27f Amendment 2), not failure — reason: Caldwell taught UNREACHABLE-CITY-GIS.
- 2026-07-27: Track CLOSED — Hays #3 dropped (operator: mold-first). Mechanical UNREACHABLE vitest landed engine PR #148.
