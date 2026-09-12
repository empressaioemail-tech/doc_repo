---
decision_id: 2026-09-12_footprint_write_provenance_rowed
date: 2026-09-12
owner: Nick (operator); recorded by the integration seat
status: active
related_canonical:
  - 90_operations/OPS-16_texas_market_plan_of_record (A-132, P-171)
  - _inbox/2026-09-11_p158-footprint_close.json
  - _decisions/2026-08-26_ingest_freeze_and_cloud_loader
---

## Decision

The 2026-09-07 building-footprint atoms write (71,501 atoms for 48021 and 396,462 for 48453,
no matching Cloud Run job execution in the window) is rowed as P-171 for the seat that owns
Cloud Run audit in the engine project. The row names the writer from Cloud Logging in both
projects, the `atoms_writer_lease_v2` rows for the scope and the factory `runs` table, and
if it was a laptop run under the freeze, records it as a break-glass row after the fact.

## Context

Found by the P-158 lane while re-measuring finding F8. A production write nobody can
attribute is the unattributed mutation ENFORCEMENT.md says every state-changing operation
must make impossible.

## Reasoning

A lane on a footprint row is not positioned to audit fleet logging, and chasing it there
would have widened P-158 past its predicate. A row with its own owner closes on a record,
which is the only honest end for an unattributed write; leaving it in a leave-behind list is
how it expires.

## Reversal criteria

None; the row closes on a record or on a named writer.
