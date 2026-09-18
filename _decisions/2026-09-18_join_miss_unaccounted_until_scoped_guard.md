---
decision_id: 2026-09-18_join_miss_unaccounted_until_scoped_guard
date: 2026-09-18
owner: operator
status: superseded in scope 2026-09-18 by P-333 (hauska-factory #186, merged 07a1215b; overlap threshold 0.95 ruled by the operator, OPS-16 A-226)
supersedes_in_part: _decisions/2026-09-05_cad_join_miss_becomes_absent_verified.md
related_canonical:
  - 90_operations/OPS-16_texas_market_plan_of_record (A-214, P-325, P-333)
  - _inbox/2026-09-16_texas_scaleup_ROADMAP.md
---

## Decision

A CAD join miss in `parcel-record-fill` writes `unaccounted`, in every county, until a
population-scoped guard exists. hauska-factory #175 (P-325) ships as built: it returns every cell
carrying the engine's join-miss signal to `unaccounted` and records the unresolved population by
county and rail. The 2026-09-05 ruling (a genuine join miss becomes `absent-verified`) is suspended,
not retired: P-333 builds the guard that restores it for the populations where a miss is a real
absence, and when P-333 ships this record is superseded.

## Context

The 2026-09-05 ruling made a miss across every ingested tax year an `absent-verified` cell, and named
its own reversal condition: a population whose ids structurally cannot key-match the roll, where a
"miss" means a key-format mismatch rather than an absence. It asked for a population-scoped guard in
that case, not a blanket reversal. Williamson 48491 is that population: P-266's dry run would write
CAD `absent-verified` on all 282,569 parcels because the served ids and the roll's ids are different
numbering systems (P-306, P-310). P-325 was carded as a blanket fix, and #175 built it that way.

The integration seat held #175 on 2026-09-18 because the blanket conflicts with the 2026-09-05
reversal clause. The operator ruled the blanket acceptable provided the proper fix is carded.

## Structural commitment check

Confidence is earned, not asserted (commitment 2). `absent-verified` claims that something looked.
Where the key cannot match, nothing looked, so the blanket removes a false earned state. The cost is
the other direction: a genuine absence in a correctly keyed county now rests as `unaccounted` until
P-333, which is honest (`unaccounted` is legitimate at rest and fatal at publish) but under-reports
what is known.

## Reasoning

Failing closed everywhere now is cheaper than a false absence anywhere. The store's upsert refuses to
downgrade a non-`unaccounted` cell, so absences already earned under the 2026-09-05 ruling stay as
they are, and only new writes are affected. Building the scoped guard first would have held a
fail-closed fix behind a harder design question.

## Reversal criteria

Superseded when P-333 ships: a join miss writes `absent-verified` only in a population the guard has
measured as key-compatible with the roll (an id-overlap measurement with a declared threshold, per
county and keyspace), and `unaccounted` everywhere else, verified by violation in both directions.
Reverse early if the blanket is found to revert a county's served values to the bake at scale before
P-297 ships (OPS-24 item 7): count it, then rule.

## Dependencies

#175 merged and the parcel-record-fill job redeployed. P-333 carded (OPS-16 A-214). P-310's join
decision for Williamson stays open and separate.

## Counterparties

Internal: operator (ruling), integration seat (merge, deploy, record), the factory lane that takes
P-333.

## Superseded in scope, 2026-09-18 22:28Z

P-333 shipped (hauska-factory #186, merge `07a1215b`), and the operator ruled its overlap threshold at
**0.95** (OPS-16 A-226). A join miss now returns to `absent-verified` only in a keyspace whose
shared-classifier basis is own-keyspace-index, whose served-id overlap with the roll is at or above
0.95, and whose county is not a crosswalk county (Hays and Williamson stay excluded by their join).
Every other population stays `unaccounted`, counted by reason. The 2026-09-05 ruling is therefore
restored IN SCOPE, not wholesale. Measured at merge: the restore population is empty in all six
counties (every served keyspace measures 1.0), so the merge moves no stored cell until the record-fill
image is deployed and a county is run; re-run the lane's movement read after any acquisition whose
ids may diverge from the roll.
