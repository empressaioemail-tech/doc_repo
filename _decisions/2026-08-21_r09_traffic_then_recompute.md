---
decision_id: 2026-08-21_r09_traffic_then_recompute
date: 2026-08-21
owner: operator
status: active
related_canonical:
  - 90_operations/OPS-18_canon_reconciliation_plan_of_record
  - _inbox/2026-08-21_r09-finish_close.json
  - _decisions/2026-08-11_texas_flush_launch_gate_amendment
---

## Decision

Shift 100 percent of cortex-api traffic to `cortex-api-00525-bev` first. Confirm live GET still shows the pre-R-09 constants. Then run a non-dry recompute from that same revision. Do not recompute while `cortex-api-00522-row` is serving. Do not split traffic. Leave `00524-pit` unused.

## Context

R-09 compute-fires on canary dry-run. GET is a snapshot read. Both revisions share one database. A non-dry recompute while old code is at 100 percent would write R-09 cells that production then serves through a pre-R-09 read path. Shifting traffic first is customer-invisible if GET only reads the snapshot; the recompute is what changes the served numbers.

## Structural commitment check

Confidence is earned: the instrument must be live on the serving revision before it is allowed to write the snapshot the customer reads. Code-done is not customer-done: dry-run firing is not a live GET.

## Reasoning

Overlay and snapshot have to match. Traffic first, then write. A split plus a shared snapshot is how 00524-pit already served the wrong image at 0 percent.

## Reversal criteria

Reverse the 100 percent shift if a named QA parcel on the launch footprint regresses after the traffic move and before recompute. Reverse the recompute if POST without probe=skip cannot complete inside Cloud Run's 300s and no documented skip path exists. Do not reverse into recompute-first.

## Dependencies

Depends on PR 447 merge SHA `4a52dee1` image on 00525-bev. Blocks treating R-09 as live-GET fired. Does not block R-01 close or R-06.

## Counterparties

Internal. Operator owns the ruling. Planner owns the deploy.

## Operator approval

Operator approved 2026-08-21. Execute traffic then recompute. Planner-owned deploy.

