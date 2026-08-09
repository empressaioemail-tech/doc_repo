---
id: 2026-08-08_MIDSESSION_capture
title: Mid-session capture — the day the factory got measured
date: 2026-08-08
status: active
owner: nick
related: [_decisions/2026-08-08_county_shape_thirteen_rails_and_geometry_first, _decisions/2026-08-08_layer_first_statewide_fabric_sequence, _decisions/2026-08-08_multipolygon_fail_closed_and_the_real_fix, _inbox/2026-08-08_BLUEPRINT_program_plan, _inbox/2026-08-08_FABRIC_statewide_parcel_analysis, _inbox/2026-08-08_STATEWIDE_layer_inventory]
---

# Mid-session capture, 2026-08-08

Session began as a successor handoff (cohort re-persist supervision, LightBox rulings, slot chain). It became something else: the operator asked why drawing setbacks had become so hard, and the answer required measuring the factory for the first time.

## The one-line

**Geometry was never the cost.** The offset core computes an envelope in 0.28 ms, roughly 0.2 percent of the 522 ms per-parcel budget. 97 percent of the pipeline was blocking I/O — six to seven serial per-parcel round trips, one of them the same lookup fired twice with identical arguments. A week of geometry auditing was spent on the wrong layer.

## What was measured (all live-queried, SQL recorded)

| Question | Answer |
|---|---|
| Where does per-parcel time go? | 8.89 percent geometry, 91.11 percent I/O (53 percent live HTTP, 38 percent DB round trips) |
| Can a bulk pass reproduce proven geometry? | Yes. 141.98 ms/parcel, 5 DB queries, 0 live HTTP in loop. Operator twelve 12/12 exact (max delta 0.041 ft) |
| Why do 770 of 2,438 compute-passing parcels refuse to persist? | `depth-warm-bastrop-batch.mjs:653` gates the boundary-primitive read behind `!dryRun`. The dry leg runs a DIFFERENT computation than apply. Dry-run could never predict apply |
| How many real parcels do we hold? | **4,617,181** distinct, across **19 of 254 counties**. Not 5,535,897 rows (16.6 percent are tile duplicates); not 13.36M (that is an estimate for all 254) |
| Which layers are statewide-complete? | **None.** Topo is 60 per-parcel DEM crops; FEMA/SSURGO are point-query adapters with a zero-row cache; roads are 7 per-city scripts; city boundaries do not exist |
| What is Texas completeness? | **1.34 percent** (11 satisfied cells of 3,302), computed honestly for the first time |
| What does a county actually cost? | Bastrop **284.40 dollars** actual vs 1.08 estimated. Over the 200-dollar commitment, on the county we understand best |

## Rulings made (all recorded as decision records)

1. **County shape: thirteen required rails**, three states (satisfied-present / satisfied-absent / not-yet), threshold not binary, geometry-first statewide then backfill, partial jurisdictions release. Operator overruled the planner's recommendation to drop RRC and MUD: a rail held in the SEQUENCE is not absent from the SHAPE.
2. **Join quality moved to a derived metric**, denominator 13 to 12.
3. **Pragmatic display** over strict: real scored data shows with a no-atom marker rather than being hidden by a contract gap.
4. **MultiPolygon: fail closed** (merged, engine #278, `origin/main` e6265b1), with the real multi-ring fix fully specified as the operator's condition. Holes first; genuine multi-part behind statewide layer work.
5. **Layer-first statewide sequence** replaces jurisdiction-first: seam reconciliation, city boundaries, 235 remaining counties, road twins, federal layers, then jurisdiction backfill.
6. **Re-warms do not count** against the per-jurisdiction cost commitment (lifetime cost still tracked separately).
7. **_STATE.md is authoritative** over 00_current_state.md.

## Two rulings the planner got wrong, corrected the same day

**The extended parity equation** (`dry.verifyPass == apply.promoted + computePassNotPersisted`) was ruled valid in the morning. It is arithmetically true but diagnostically empty: `computePassNotPersisted` is defined as the residual, so it reconciles by construction no matter what the pipeline does. Retracted.

**The acreage-weighted measurement** that promoted multi-ring to front-of-queue counted ROWS, not parcels. Corrected figure is 12.53 percent, not 59.69 percent — a factor of 4.77, past the hedge the amendment itself carried. The error was not random: duplication correlates with the variable measured, because a large multi-part parcel spans more tiles and is replicated more. Retracted and re-ruled.

Binding rule added to doctrine: **a measurement artifact that does not record the query that produced it is not evidence and must not be ruled on.** The row-counted artifact recorded no SQL; that absence alone should have blocked the ruling.

## The pattern behind everything found today

Five independent audits found one defect, five times: **an instrument that could not see the thing it was supposed to measure.**

- Dry-run could not predict apply (different code path behind a flag)
- The cert lane grades against a frame the Geometry Law demoted (`OPS-5:34`, `OPS-2:33`, and a third at `PHASE_C_HANDOFF:35`)
- The County Ledger had no denominator, so a county never worked could not appear as missing (`countyLedger.ts:91` is a bare select; `totalCounties` was the count of returned rows)
- The memory grading rung has a 0 percent execution rate: `grep -rl "HARMED" _sessions/` returns 0 of 215
- MultiPolygon truncation happens UPSTREAM of every Geometry Law gate, so the truncated ring IS the reference and every gate passes

Plus the doc-layer version: 1,695 markdown files, six competing factory specs with no precedence, and coverage claims that conflate CODE EXISTS with DATA LOADED with SERVED TO PRODUCT. That conflation produced several of today's wrong premises, including the planner's own.

## Shipped

- engine #278 merged (`e6265b1`): silent MultiPolygon truncation becomes a countable named decline; second independent copy of the bug fixed; new tests for the case that was missing
- ldt #391 open at `f42b9af7`, CI running: migration 0068/0069, `county_manifest` (254 rows), `county_rail` (13 rails), additive state columns, the LEFT JOIN query returning all 3,302 cells
- Command Center mockup v2, 5 tabs, seeded with real county data and honestly showing 1.34 percent
- Five doc files corrected for coverage conflation, including the two BCAD contradictions
- Queue rows filed for everything discovered and not scheduled

## Open in front of the operator

- ldt #391 merge (gated on CI conclusion string)
- Build sequencing: the layer-first plan has stages but not a dispatch order
- Four things nothing records, all needed by the console: `rail_state_history`, `rail_verification`, run-state/slot registry, per-run cost metering
- The heavy-scan slot serializes exactly the work statewide acquisition needs parallel. Unresolved contradiction
- 235 counties to acquire, against a cost commitment that is unverified and one measured actual already over it
