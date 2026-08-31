---
decision_id: 2026-08-16_metro_pipeline_apply_after_roads
date: 2026-08-16
owner: operator
status: active
related_canonical:
  - _inbox/2026-08-15_texas_flush_server_plan_WDLL.md
  - _inbox/2026-08-15_l26_gotomarket_pickup.md
  - 90_operations/OPS-16_texas_market_plan_of_record.md
---

# Decision

After footprints and roads land, L26 circles back to unfinished pipeline work (52 metros plus the deferred keyset counties) and drives it to apply. CAD and gate-grade follow that return. The 12-minute county wall may be raised once a timed 10-pipe batch log exists.

## Context

Amendment 2 deferred TEMP-class metros and installed a 12-minute kill so Angelina could not consume the only writer for hours. Geom backfill and durable GiST are done. The remaining failure is the geography filter after a healthy GiST Nested Loop, plus long pipeline envelopes. Operator 2026-08-16: keep the current ingest through roads, then troubleshoot and execute metro apply and the deferred keyset so the flush finishes.

## Structural commitment check

- Sell reasoning, not data: unchanged. Pipeline atoms still carry source and distance.
- Confidence earned, not asserted: metro apply must land stored atoms or typed absence, not a skip that looks like coverage.
- Cost per jurisdiction: a 10-pipe proof before a full-county sit is the cost control.
- Dual interface: unchanged.

## Reasoning

LATERAL pipeline-major against stored `txgio_parcel.geom` is the right join. The 12-minute wall is a sequencer policy, not a Postgres limit; it stays as the default for silent hangs and can move after a batch log proves the path. Work order after roads: expand the GiST probe with `ST_Expand`, prove 10 Angelina pipes with a `durable-batch` log, explode long lines into short segments if that batch is still hot, bank the plan, then apply. Retry the non-metro keyset defers on the same writer slot, not in parallel.

## Reversal criteria

Reverse the wall raise if a 10-pipe batch still produces no `durable-batch` line or exceeds 3 minutes. Reverse segmentize if EXPLAIN ANALYZE shows it increases geography casts. Do not reverse "circle back after roads" because CAD is only three counties; CAD waits.

## Dependencies

Depends on: footprints and roads draining on the live sequencer; one atoms writer; one heavy neondb scan.
Blocks: CAD 48439 / 48113 / 48135 and ledger materialize until metro return has a graded apply or a named honest hold.
Does not block: the live footprint drain.

## Counterparties

Internal: Nick (operator), L26 planner.
