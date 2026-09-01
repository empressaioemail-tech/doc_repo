# Mission — a time bomb fired as designed; remove the legacy fallback it guards

## Why this card exists

`LEGACY_FALLBACK_REMOVE_BY = "2026-09-01T00:00:00Z"` has passed, and
`test/ctx-execution-identity.test.mjs` now fails until the fallback is deleted. Its own
assertion message states the fix:

> *"delete `legacyStartTimeMatch` and set `LEGACY_START_TIME_FALLBACK = false` in
> `src/control/reaper.mjs`"*

**This is a control working, not a defect.** Somebody put an expiry on a legacy path and
backed it with a test that goes red on the date, so the cleanup is forced rather than
left to rot. That deserves saying plainly, because the same pattern is worth copying.

**It now blocks the whole repo.** hauska-factory PRs #50 (alias SQL) and #51 (C3
derivation) are both `test: FAILURE` for this reason and nothing else, and every future
PR in that repo will be too. Neither of those cards may absorb the removal: a commit
whose message says "alias SQL" and whose diff drops a live control misdescribes itself.

## What the fallback actually does

`matchExecution` reconciles a `started` run row against a Cloud Run execution. A run
whose scope **names** its execution is matched by name and by nothing else. The legacy
path exists only for **unnamed** rows:

```
if (!LEGACY_START_TIME_FALLBACK || !predatesExecutionNames(run, since)) return { exec: null, ... };
const exec = legacyStartTimeMatch(run, executions);
```

It fires only when the run is unnamed, its host is not in `NEVER_AN_EXECUTION_HOSTS`,
the flag is true, and the run **predates `EXECUTION_NAME_SINCE = "2026-08-28T11:00:00Z"`** —
rows the old image wrote before every run carried its execution name.

## The one measurement owed before deleting

**Are there live `started` run rows, unnamed, that predate 2026-08-28T11:00:00Z?**

If any exist, removal changes their disposition: instead of being time-matched to an
execution, they will be left `started` until their age bound and then **orphaned**.

That outcome is intended and already ruled — A-022(5): *a named run whose execution is
not listed is left `started` until its age bound and then orphaned, never attached to a
sibling.* So orphaning is the correct behaviour, not a regression. **But say what will
happen to real rows rather than discovering it.** Report the count.

**This read is on the hauska-factory CONTROL store, not cortex-prod.** Containment owns
cortex-prod; this is a different project and a small `SELECT`, so it does not contend.
Do not read cortex-prod on this card.

## The change

1. Delete `legacyStartTimeMatch`.
2. Set `LEGACY_START_TIME_FALLBACK = false`, or remove the flag entirely if nothing else
   reads it. Say which and why.
3. Remove `MATCHED_BY_START_TIME` **only if** nothing else consumes it — including
   anything that reads a stored `by` value from an earlier reap. Check before deleting a
   constant that may appear in historical records.
4. Leave `EXECUTION_NAME_SINCE` and `predatesExecutionNames` alone unless they become
   unreferenced; if they do, say so rather than removing them silently.

Keep the docblock's account of the identity rule. The comment explaining why matching is
by name and nothing else is still true and still load-bearing.

## Falsifiers, both directions

**The test goes green.** Necessary and not sufficient — the test only asserts the
fallback is gone.

**And a pre-date unnamed row now returns `exec: null`.** Construct the fixture that
previously matched by start time and assert it no longer matches. Watch it fail first
against the current code, so you have seen the fixture exercise the path you are
removing. A deletion verified only by a green suite has not been observed working.

**And a named row still matches by name.** The removal must not touch the primary path.

## What this unblocks, and what it does not

Unblocks: hauska-factory #50, #51, and every subsequent PR in that repo.

Does not: it is not an alias fix, not a C3 fix, and not a containment fix. Merge it on
its own and let those PRs re-green against the new base.

## Do not

- Do not fold this into #50 or #51.
- Do not read cortex-prod; containment owns it.
- Do not weaken or skip the test to get the repo green. The test is the control.
- Do not extend `LEGACY_FALLBACK_REMOVE_BY` to a later date. The removal is the point,
  and pushing the date is how a legacy path becomes permanent.
- Do not touch any repository other than the registered Factory worktree you open.

## Close

Use the exact CP1 / CP2 / CLOSE paths named at the end of this dispatch. Declare
snapshot in the first output. Report the count of live unnamed pre-date `started` rows
and what now happens to them. State each falsifier before running it and report both
directions. `leave_behind` named. Subagents do not commit.
