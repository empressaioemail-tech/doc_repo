# Hand-carry to COVER P-17 agent

Operator halt. You keep the watch. Integration starts SERVE / IDENT / P-47 in parallel. Do not take a second `--apply`.

## What you do

1. Let **48371** finish `--apply`. Dry-run already planned **9136**. Do not kill mid-write.
2. The moment `apply.log` has `county-landed` 48371, **stop**. Do not start 48373. If the rest runner already spawned 48373 dry-run, kill it (extract only). If 48373 `--apply` has started, let that one finish too, then stop.
3. Prefix-range verify 48371: `entity_type='road-node'` and `entity_id` in `[48371:road:, 48371:road;)`. Expect 9136 unless you quote a different stored count. Never heap `COUNT(*)`.
4. Stop rest runner PID (was 70480) and heartbeat PID (was 72424). Confirm `apply.log` has no `county-start` 48201.
5. Release lease `--holder=P17`. Confirm status is not a live P17 row.
6. File CLOSE at `_inbox/2026-08-22_cover-roads_close.json`. Quote landed FIPS, last county 48371 (or 48373 if you had to finish it), Harris remaining not-yet, score refuse `no_measurement_spec` SS-W14 written 0, leave_behind P-47 plus `_inbox/2026-08-22_p17_roads_park_pickup.md`. Remaining not-yet is a named count, never "in progress".
7. Do not POST ledger recompute. Do not invent a roads coverage row. Do not occupy `P:/hauska-engine`. No product git.

## Read these, do not re-derive

- Halt: `_inbox/2026-08-22_p17_operator_halt.md` and `P:/tmp/cover_p17_roads/HALT.json`
- Pickup / resume: `_inbox/2026-08-22_p17_roads_park_pickup.md`
- Decision: `_decisions/2026-08-22_serve_ident_then_background_cover.md`
- CP1 / CP2 already filed

A planner halt watcher may already be running (`P:/tmp/cover_p17_roads/_p17_halt_after_48371.ps1`). If you halt yourself, that is fine. Do not start a second rest runner.

Roads remainder is parked until the operator finishes visual QA. Resume only from the pickup.
