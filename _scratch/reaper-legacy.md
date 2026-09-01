# reaper-legacy scratch (F-03)

## GROUND-TRUTH 2026-09-01T03:00Z
- worktree: P:/tmp/hauska-factory-reaper-legacy feat/reaper-legacy-remove from origin/main 5f9acc3
- factory control store (Neon project withered-surf-26870298 / hauska-factory, default branch br-noisy-bar-au9cwf7n): 925 runs; started unterminated = 1; unnamed pre-date started = 0; fallback-eligible = 0
- the one started row is fb490620 p2-juris-containment started 2026-09-01T01:51:42Z named factory-p2-juris-hzkqk; removal does not change it
- run_events kind=termination: 640; matched_by start-time-legacy: 0
- MATCHED_BY_START_TIME stays: reap.mjs reconcile-termination and byStartTimeLegacy still read it; historical fixtures use it

## GROUND-TRUTH 2026-09-01T03:07Z
npm test after npm install: 401 tests, 399 pass, 0 fail, 2 skipped. F1 probe failed on current code (exec=czlpc) then passed (exec=null). Expiry test green. Three-file uncommitted diff. No commit.

## LESSON
An expiry date backed by a test that goes red is a control that forces cleanup. Do not absorb the deletion into an unrelated PR.

## OPEN
Planner commits the three factory paths and opens its own PR. #50 and #51 re-green after that merge.
