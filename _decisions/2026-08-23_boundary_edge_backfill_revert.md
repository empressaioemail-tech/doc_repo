---
decision_id: 2026-08-23_boundary_edge_backfill_revert
date: 2026-08-23
owner: Nick
status: active
supersedes_partial: 2026-08-23_p66_entity_type_operator_rulings.md
related_canonical:
  - _catalog/instrument_entity_type_classifications.json
---

## Decision

Revert `property-boundary-edge` `chainAnchoring` from **contemporaneous** to **backfill**. No live boundary re-derive engineering in scope.

## Context

Operator initially picked contemporaneous to align delivery verification with read-time attestation. After review, chose to avoid engineering debt; batch depth-warm boundary edges match actual architecture.

## Reasoning

Boundary edges are computed in county depth-warm runs and served from stored atom-chain atoms. Setback serve policy already handles live-vs-depth-warm on envelope without requiring contemporaneous boundary classification.

## Reversal criteria

Revisit if delivery product requires offline-verified boundary chains at read time and live re-derive is funded.
