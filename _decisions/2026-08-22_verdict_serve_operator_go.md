---
decision_id: 2026-08-22_verdict_serve_operator_go
date: 2026-08-22
owner: operator
status: active
related_canonical:
  - _inbox/2026-08-22_verdict_layer_serve_WDLL.md
  - _decisions/2026-08-22_thesis_planner_parcel_gap_rulings.md
  - 19_the_instrument_contract.md
---

## Decision

Authorize **verdict layer serve** as the next property-seat dispatch (WDLL `_inbox/2026-08-22_verdict_layer_serve_WDLL.md`). P-59 may run in parallel on plumbing only; scorer semantics that treat families as boolean present/absent must not ship until verdict fields are live on inspect.

## Context

Thesis planner recommended go; operator confirmed in session 2026-08-22 evening. Rationale: only board item that corrects a false statement about the world without waiting on ingestion; specified in ratified doc 19; Smart Files already has the absence enum.

## Reversal criteria

Reverse if violation test (empty-success) cannot be made to fail on known metro fixtures without falsely upgrading verdicts in transit.

## Dependencies

OPS-16 plan row P-63 amendment (planner). cortex-api + PE inspect deploy (property seat).
