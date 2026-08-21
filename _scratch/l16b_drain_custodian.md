# L16B successor drain custodian scratch

## GROUND-TRUTH
- 2026-08-15T01:52:20Z lease taken holder=L16B ttl=14400. Detached heartbeat PID 21364 → lease_heartbeat.log (10min).
- Rogues killed: accidental L16 resume tree + prior HB shells. ZERO after kill.
- Pipelines progress inherited: landed=19 / atoms=1270793 / resume at 48039 (48037 was CLEAN land — not the hang).
- Hang class PLAN_PHASE_UNBOUNDED_SILENCE. Brazoria 275131 features. Budget 90m / kill 135m armed.
- Budgeted runner detached via cmd PID tree: node 80832 + write_pipeline_county 48039. Log pipelines_apply_l16b.log.
- Watches unpaused: l16b-drain-progress, l16b-lease-heartbeat, l16b-pipelines-apply-log.
- CP1: `_inbox/2026-08-14_l16b_cp1.json`. Postmortem: `_inbox/2026-08-14_l16b_pipelines_hang_postmortem.json`.

## GROUND-TRUTH
- 2026-08-15T12:42Z session close: stale L16 Cursor HB terminal 180561/PID 70220 KILLED. L16B detached HB 21364 appears dead. Lease still L16B expires 16:33Z — re-arm owed. Pipelines runner NOT seated (current=48041 named only; procs=0). 48039 skipped by planner.
- Session close: `_sessions/2026-08-15_l16b_overnight_recovery_session_close.md`

## OPEN
- Re-arm detached L16B heartbeat before any --apply
- Finish hard-wall kill proof in worktree `l16b-hard-wall-budget` (tree-kill; failing-first test must go green)
- Brazoria EXPLAIN/fix before re-queue
- Restart pipelines at 48041 with enforcing kill
- DEFERRED at pipelines close: HOLD 40m before wells for HS-FLOOD-48201 (`_inbox/2026-08-14_l16b_deferred_wells_hold.json`)
- Then Ector → (wells after hold) → footprint → flood → roads → Tarrant/Dallas → G2b → master close

## LESSON
- Do not resume as L16 after succession dispatch; release+retake as L16B.
- PowerShell `Start-Process -Environment` unavailable here; use cmd wrapper for detached env.
- `Select-Object -First N` on a live runner pipe kills the runner — never use for long jobs.
