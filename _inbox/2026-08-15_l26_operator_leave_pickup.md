---
id: 2026-08-15_l26_operator_leave_pickup
title: L26 pickup after operator leave
status: active
last_updated: 2026-08-15
---

# L26 pickup

Operator left 2026-08-15 expecting the flood drain to keep running. Cursor sub-agents are done. Detached Windows processes are the work.

## Read first

- `P:/tmp/l26_flood_drain_20260815/flood_from_plan_progress.json`
- `P:/tmp/l26_flood_drain_20260815/harris_join_watch.json`
- `P:/tmp/l26_flood_drain_20260815/lease_heartbeat.log`
- `_inbox/2026-08-15_texas_flush_server_plan_WDLL.md`
- `_inbox/2026-08-15_l26_code_review.json`

## What continues without a chat

1. Flood `--from-plan --apply --batch=5000` (pid of `l26_flood_from_plan_drain.mjs`).
2. Lease heartbeat L26 every 8 min (pid 22096 at leave).
3. Harris 48201 `--plan-only` on neondb (pids 77264/84668 at leave). Log may stay 0 bytes for a long parcel load.
4. Harris join watch: applies 48201 only after the drain writes `finishedAt` or `halted` and `48201.plan.ndjson` is plan-only with no `_outside`.

## What will not finish alone

- WDLL item 4: engine PR #345 HOLD (DISTINCT ON hang query still in keyset SQL).
- Item 5/6: 48001 parity and Brazoria plan-only. Do not run while Harris holds neondb.
- Item 7/8/9: PR #344 unmerged; no pg_sleep proof.
- Item 11: ledger materialize `--apply` + `node scripts/gate-grade.mjs`.

## Do not

- Restart per-county JS pipeline runners.
- Take the atoms lease as anyone but L26.
- Start a second neondb parcel reader.
- Merge #345.
- Treat empty Harris log as death before checking pids 77264/84668.
