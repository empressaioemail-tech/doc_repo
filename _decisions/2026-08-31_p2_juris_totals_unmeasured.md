---
decision_id: 2026-08-31_p2_juris_totals_unmeasured
date: 2026-08-31
owner: Nick (operator), recorded from planning-agent RO run
status: active
related_canonical:
  - _decisions/2026-08-31_ctx_board_0005a_first.md
  - _inbox/2026-08-31_p2_juris_totals_finding.md
  - _inbox/2026-08-31_p2_juris_01_timeout.md
  - _inbox/2026-08-31_p2_juris_bastrop_emit.md
  - _inbox/2026-08-31_p2_juris_live_05_proof.md
  - _inbox/2026-08-31_p2_juris_hays_timeout.md
  - _inbox/2026-08-31_p2_juris_partition_record.md
  - _inbox/2026-08-31_p2_juris_hays30k_timeout.md
  - _inbox/2026-08-31_p2_juris_explain_a_b.md
  - _inbox/2026-08-31_p2_juris_explain_c.md
  - _inbox/2026-08-31_p2_juris_cities_ok_npoints.md
  - _inbox/2026-08-31_p2_juris_austin_present_vs_reached.md
  - _decisions/2026-08-31_p2_juris_baseline_discarded.md
---

## Decision

TOTALS stays UNMEASURED. Nothing is adopted, written, or staged.
Raising the timeout will not fix it.

Amended 2026-08-31 after the join-rewrite timed run. The 1/0 CASE
and the Nested Loop of two CTE scans are gone. Live 05 at Factory
`96e3ef4` was Merge Join on `county_fips`, cost 3.78e7,
`isMillionRowCteNestedLoop` false. Operator then ran `00` plus
that `01` in one psql session. RO armed. Snapshot unchanged
(1222 / 254 / 1568849 / 981410). 01 cancelled at 180s at line
352 before emitting TOTALS. The plan gate was necessary and is
not sufficient. This is a performance ceiling on a runnable
query, not the earlier defect that could never run.

Amended again after the Bastrop-scoped 01. `decoded` restricted
to `48021` only. Exit 0 inside 180s. 50265 / 11992 / 0 / 62257.
Denom exact. 100% ring. Guards clean. Query is correct; the
six-county cancel is volume. Per-county is a legitimate answer,
not yet the plan. The +326 vs prior 49939 is 320 slivers plus 6
unnamed. Neither number is adopted. Statewide TOTALS stays
UNMEASURED.

The 00 input snapshot independently corroborates the denominator:
1,222 city rows, 254 county rows, 1,568,849 raw parcels, 981,410
distinct prop. Inputs are sound. Containment remains the correct
derivation (an alias maps a postal string, not corporate limits).
The claim that containment is cheaper than alias hand-seeding is
unproven; the 1.3s figure was the city-to-county roster join
(1,222 x 254), not parcel containment (981,410 x 1,222).

## Context

Operator-authorised RO run. `00_session.sql` unmodified. Durable
CREATE TABLE refused: cannot execute CREATE TABLE in a read-only
transaction. The production `neondb_owner` URI was minted via the
control-plane API and not persisted. It was not revoked: that
role is live. Read-only was proven at session level.

## Structural commitment check

Sell reasoning, not data: a timed-out join is unmeasured, not a
new split.
Confidence is earned: 981,410 is an input count, not a
containment result.
Fail closed: the 1/0 CASE failed closed always, which is the
wrong close.
Cost per jurisdiction: a Nested Loop of two CTE scans is not a
cheap replacement for alias seeding.

## Reasoning

A literal `1/0` in a CASE inside an aggregate target list
evaluates regardless of the condition. The same CASE outside an
aggregate returns 42. `city_ok_n` is 1,222, not 0. The empty-city
case is already raised by the DO block at lines 26-34. Line 202
is redundant and fatal. MATERIALIZED CTEs make both sides of the
join CTE scans, so the 22 bbox predicates cannot use an index.
Zone-major in the SQL text is not zone-major in the plan. The
No LATERAL rule was earned against a point-major failure and
does not prescribe the next plan.

## Reversal criteria

A timed run of the join-rewrite `01` that emits six-county TOTALS
under the declared method (county equality, 1e-8, jsonb rings).
The 08-30 split 357,269 / 624,141 is discarded
(`_decisions/2026-08-31_p2_juris_baseline_discarded.md`); a miss
versus those numbers is not join-wrong. The 05 plan gate alone
does not reverse this. A single-county emit is a partition, not
a measured statewide TOTALS.

## Dependencies

The CASE is dropped. The DO block stays. Live 05 has passed.
Bastrop and Caldwell have emitted. McLennan, Hays, and Hays 30k
cancelled at 180s. City-count and chunk-linear are retired.
Cost driver is per-county and unidentified. Board is
`_inbox/2026-08-31_p2_juris_partition_record.md`. A vs B is
filed. Plan C is Hash Join like B. Hays-full cancel is
runtime. Austin is a real straddle and a 3.56% tail. Vertex
budget fails as the cancel. Cost driver is un-named. No fifth
mechanism. Range-chunk is empirical only, not licensed this
morning. The 6 stay unnamed and do not gate. Persist stays
after measured six-county TOTALS.

## Counterparties

Internal. Planning agent (RO run), integration planner, Factory
P2-JURIS tree.
