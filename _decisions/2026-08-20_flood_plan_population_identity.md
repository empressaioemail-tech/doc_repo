---
decision_id: 2026-08-20_flood_plan_population_identity
date: 2026-08-20
owner: operator
status: active
related_canonical:
  - _inbox/2026-08-20_b7_stamp_dry_run.md
  - 61_enforcement_doctrine.md
---

## Decision

A flood county plan must print and throw unless contained + not-contained + unmeasurable + skipped-unusable + skipped-duplicate equals parcelsRead. A null centroid is unmeasurable (cause no-point). Reporting unmeasurable: 0 while parcels have no centroid is a dropped denominator, which is the failure the three-state rule exists to prevent.

## Context

Brewster 48043 dry-run 2026-08-20: 16,738 contained + 195 not-contained + 0 unmeasurable = 16,933 against 20,287 DISTINCT ON features. 3,354 missing. 805 MultiPolygon centroid-nulls were counted at load but not in the three-state tally. Duplicate-key drops were not counted at all (selectPlannableParcels `seen.has(key) continue`). Skipped-unusable (2,345) was printed but not in the three-state sum. Bastrop passed the same sum only because its one MultiPolygon-null was the single missing 1 against 5,750 plannable, and the reader had to notice.

## Structural commitment check

Instruments over narration. An identity a reader reconstructs from a table is not a control. The dry-run prints the equation and assemble throws when it fails.

## Reasoning

Three states that do not cover the loaded population are two states plus a hole. B5 still publishes a typed absence atom for no-centroid. The containment tally must still name those parcels unmeasurable so they cannot leave the denominator. Duplicate keys are a named skip, never a silent continue.

## Reversal criteria

Reverse only if the writer unit ceases to be DISTINCT ON feature_index loaded rows, in which case parcelsRead must be redefined in the same change as the identity, not left as a stale loaded-row count.

## Dependencies

Companion to 2026-08-20_flood_stamp_229_licenses_ssw17_convention. Identity is required before any apply; it does not replace the 229 gate.

## Counterparties

Internal.
