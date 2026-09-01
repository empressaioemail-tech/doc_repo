---
decision_id: 2026-08-31_p2_juris_baseline_discarded
date: 2026-08-31
owner: Nick (operator), recorded from the compiled P2-JURIS dispatch
status: active
related_canonical:
  - _decisions/2026-08-31_p2_juris_totals_unmeasured.md
  - _dispatches/2026-08-31_p2-juris_dispatch.md
  - _inbox/2026-08-30_ctx_w3_collect_amendments.md
  - _inbox/2026-08-30_ctx_execute_plan_review.md
  - _inbox/2026-08-31_p2_juris_partition_record.md
  - _inbox/2026-08-31_p2-juris_cp1.json
---

## Decision

The 2026-08-30 containment split 357,269 unincorporated / 624,141 in-city is discarded. Its method is unrecoverable. Do not reconcile any later emit to it. Do not stamp `not-applicable` from 357,269.

## Context

The compiled dispatch required B first: recover the 08-30 method from a tracked artifact, or discard the baseline. Three file-side agents plus planner review found no SQL, no emit JSON, and no `.mjs` that produced 12,318 / 10,310 / 624,141. The numbers originate as a prose table in `_inbox/2026-08-30_ctx_w3_collect_amendments.md`. `_inbox/2026-08-30_ctx_execute_plan_review.md` falsifier 15 already recorded them as copied, not verified, with no named instrument.

P2-JURIS SQL written on 08-30 was a reconcile harness pointed at those numbers. Store connect was forbidden. The harness never produced them.

08-31 scoped emits under the join-rewrite `01` (county equality, 1e-8, jsonb rings) disagree in opposite directions: Bastrop 11,992 (−326) and Caldwell 10,628 (+318). The Caldwell +318 cannot be a floor effect. The 08-30 Caldwell "no geometry / bbox-centre" line is a copied SS-W15 caveat about an empty PostGIS column, not a measurement of the jsonb rings `01` decodes.

## Structural commitment check

Sell reasoning, not data: a number with no instrument is not a split.
Confidence is earned: 624,141 was never calibrated against a named predicate.
Fail closed: stamping `not-applicable` from 357,269 over-stamps Caldwell parcels that the declared method already placed in-city.
Cost per jurisdiction: discarding a prose baseline is cheaper than a fifth curve fit.

## Reasoning

A reconciliation against an unrecoverable method is a fabricated agreement. The dispatch said that in those words. Direction matters: using 10,310 as Caldwell in-city would mark 318 parcels `not-applicable` that 08-31 ring containment placed in-city. That is the exact P3 defect.

The declared method going forward is the join-rewrite `01`: `p.county_fips = c.county_fips`, ring hits require `overlap_deg2 >= 1e-8`, parcel geometry is jsonb GeoJSON. Bastrop 11,992 and Caldwell 10,628 are partitions under that method. Six-county TOTALS stays UNMEASURED until `01` or a licensed range-chunk emit covers all six.

Denominator 981,410 remains an input count. Per-county denominators remain.

## Reversal criteria

A tracked artifact surfaces whose comments or sibling emit show it produced 12,318 and 10,310 on 2026-08-30 under a named predicate. Finding the P2-JURIS 08-30 SQL does not reverse this: that SQL was written after the numbers and never run.

## Dependencies

Amends the reconcile-target half of `_decisions/2026-08-31_p2_juris_totals_unmeasured.md`. TOTALS-unmeasured still stands. P3 waits on a six-county emit under the declared method. Persist still waits on the P2 job template.

## Counterparties

Internal. Planning agent, integration planner, Factory P2-JURIS join tree.
