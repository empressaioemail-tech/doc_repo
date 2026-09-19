## Mission — P-375: LDT's CI Postgres runs out of locks, and a red Test stops meaning anything

You launch no sub-agents (FAN-DEPTH 0). You build in `legacy-design-tools` (`.github/workflows/` and
the test harness only) and open one PR from current `origin/main` with the SHA declared. You do not
merge.

### What is wrong (P-270's close, `_inbox/2026-09-19_p270-city-half_close.json`)

The `Test` job in `pr-checks.yml` fails intermittently on tests the PR under review does not touch:
`lib/codes` `src/queue.test.ts` ("rows whose next_attempt_at is in the future are not picked up") and
`src/__tests__/reasoningAtoms.test.ts`, the second inside `lib/db`'s `dropTestSchema` with Postgres
error **53200 "out of shared memory"**, "You might need to increase max_locks_per_transaction". It
has now hit #722, #727 and P-362's PR. The fleet's answer has been "re-run once"
(`_queue/cards/ldt-576-retry/card.json`), which is a habit, not a control: a real regression in those
suites would be re-run away the same way.

### What to build

1. **Reproduce and measure.** Run the api-server and lib suites against a Postgres container
   configured like CI's service container, and find the limit: how many schemas and objects
   `dropTestSchema` drops at once, and the lock count it needs against `max_locks_per_transaction`
   (default 64) and `--shm-size`.
2. **Fix the cause, not the retry.** Either the service container carries a `max_locks_per_transaction`
   and `shm-size` sized to the measured need (with the measurement in the workflow comment), or the
   harness drops in bounded batches. Say which and why.
3. **Retire the habit.** Once the cause is fixed, a red `Test` is a real signal again: say what
   replaces "re-run once" (nothing, or a named, counted flake list).

### Verify by violation

With the old configuration the failure reproduces (or you show the lock count exceeding the limit);
with the fix it does not, across several runs; a deliberately broken test in `lib/codes` still fails
the job.

### Close

Declare: the start commit and PR, the measured need, the fix, the falsifiers with both directions
shown, and `leave_behind`.
