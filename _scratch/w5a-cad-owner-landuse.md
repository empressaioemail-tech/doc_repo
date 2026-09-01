# W5-A cad / owner / landuse overnight

## GROUND-TRUTH (2026-08-26T11:13Z)

- Seat: integration on `P:/doc_repo` `main` `9753b83`. Isolated engine worktree `P:/hauska-engine-worktrees/w5a-cad-owner-landuse` at `cfa18bc`. Did not commit engine.
- Hidden `Start-Process -WindowStyle Hidden`. Not a Cursor terminal.
- Overnight PID 41200 `P:/tmp/w5a_48257_20260825/overnight.mjs`. Heartbeat PID 21624 holder W5A.
- Writer PID 41260 `write-cad-parcel-roll-county --county=48029 --apply` ~1.9 GB. `48029_cad_apply.json` still absent (file lands at process exit).
- Kaufman 48257 family done: cad/owner/landuse 93291. Overnight logged `family.done` 48257 at 04:15:31Z.
- Bexar cad dry 703257 then apply started 04:18:30Z. Store already holds 703257 Bexar cad atoms. Writer still alive after that count.
- Manifest GET last FRESH 2026-08-25T23:47Z 667/3556. Do not rematerialize. W6 GET after a completed family.

## GROUND-TRUTH (2026-08-26T12:55:43Z)

- Overnight runner 41200 killed 12:46Z. Writer 41260 survived ~8 min, then died 12:54:30Z. `48029_cad_apply.json` never written. Only `48029_cad_dry.json` exists.
- Heartbeat 21624 killed. Lease W5A released. `atoms-writer-lease.mjs status` lease null at 12:55:43Z. Slot FREE.
- Bexar apply is not a verified close. Earlier store count was 703257 cad atoms. That is not `apply.done`.
- Likely mechanism: overnight was `spawnSync` parent. Killing it closed pipes. Child exited without `--out`. Alternate: writer hung in close and died on its own. Not distinguished. Do not treat kill-parent as a clean finish.

## OPEN

- Slot FREE. Overnight queue will not continue. Re-engineer the supervisor so it is not a `spawnSync` parent of the writer.
- Partitioned-lease proposal still `_inbox/2026-08-26_partitioned_lease_review_handoff.md`. Not approved.
- Do not start a second `--apply` until the new process is named.
- Travis HOLD, Dallas, Tarrant, leftover: refuse.

## LESSON

- `spawnSync` swallows writer progress. Overnight.log looks idle while the child is the live write. Store count plus process list is the instrument, not the log tail.
- Killing the `spawnSync` supervisor is not a clean runner-only stop. Writer can die later without `--out`. Detach the writer (Cursor-visible, own process group) before the supervisor is killable.
- Operator monitor is the Cursor terminal. Hidden `Start-Process` hides the only evidence they use.
