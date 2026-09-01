# Mission — Williamson 48491, the second-to-last county

## Where this sits

Four of six Central Texas counties are licensed and sum to **317,918 parcels**:

| County | unincorporated / in-city / total | run |
|---|---|---|
| 48021 Bastrop | 50,264 / 11,992 / 62,256 | `85f984c2` |
| 48055 Caldwell | 14,361 / 10,627 / 24,988 | `1e2529a3` |
| 48209 Hays | 61,585 / 54,835 / 116,420 | `bdcf534f` |
| 48309 McLennan | 32,422 / 81,832 / 114,254 | `a62e3fce` |

Williamson (282,570) and Travis (380,918) are the remaining two and are **67.6% of the
parcels**, so this is not a tidy-up. **TOTALS has never existed.** These two produce it.

**This card runs Williamson only. Do not run Travis.**

## Williamson died twice, and the cause is fixed. Read this so you do not re-diagnose it.

`rrn5h` died at 22:45:31 and `8qn9d` at 00:25:31, both with
`terminating connection due to administrator command` and an uncaught pg `'error'`
event.

**Root cause, measured, closed:** the job holds two connections. One to the
**hauska-factory** control store (runs, leases, `run_events`) and one to
**cortex-prod** (landing). A long chunk against cortex-prod left the hauska-factory
connection idle, that compute suspended after five minutes of quiet, and killed it.
Confirmed against hauska-factory's operations log: `suspend_compute` at exactly
22:45:31Z and 00:25:31Z.

**The operator has disabled scale-to-zero on both computes and it is verified.** The
control store held up for over six minutes past the point every previous cycle had
suspended.

So: it was never the image, never the data store, never the reaper, never resource
pressure, and never `dd7c2a94` versus `70e3f714`. **Do not re-open any of that.**

## One residual risk you must respect

The code fix (`FIX-57P01`: error listeners, a lease heartbeat) is **not merged**. The
computes still restart weekly for scheduled updates, **Tuesday 05:00–06:00 UTC**. A run
caught in that window dies the same way, silently, leaving its run row `started`.

**Do not start a run that could still be executing during Tuesday 05:00–06:00 UTC.**

## Before you execute

**Verify the image by digest**, not by tag and not by "main is at X". Factory builds
ship storage tarballs with no `COMMIT_SHA`, so image-to-commit attribution here is
inference. You need an image carrying `loadReplayFromLanding`, which feeds the
`COUNTY_HELD` gate from the store; `sha256:70e3f714` has it. Without that feed the run
refuses `COUNTY_HELD` and never starts. Report the digest you ran on.

**Confirm nothing else is running.** cortex-prod holds `neondb` and `hauska_mcp` on one
compute, so any other heavy operation contends. One at a time.

**Understand this is a RESTART, not a resume.** Completed chunks are keyed by
`run.id`, and a new execute mints a new run. Williamson starts from page one. Do not
pass an old `--run-id` expecting a resume.

## Falsifiers, stated before you execute

**F1. Williamson has NO ORACLE.** `INTERACTIVE_PARTITIONS` carries only 48021 and
48055, so `assertInteractiveMatch` returns `checked: false` and `PARTITION_MISMATCH`
**cannot fire** for 48491. If you run it under the F1 used for Bastrop, your primary
falsifier is silently disabled and a wrong answer looks identical to a right one.

Use the denominator identity, and state it before executing:

```
unincorporated + in_city + unresolved === total
total === 282570
unresolved === 0
```

That is the job's own emit against an independent store count, and no sentinel
satisfies both sides.

**Williamson's sentinel is already measured and it is ZERO.** `n_zero = 0`,
`distinct_all = 282,570`, `n_rows = 304,298`. It is the only county of the four so far
with no sentinel: Bastrop's resolved unincorporated, Caldwell's resolved **in-city**
(Mustang Ridge 50200), Hays carried 375 rows. Confirm it rather than assuming it, but
do not extrapolate a shape from another county.

**F2. Succeeded termination AND an unaided exit.** Not cancelled, not a
planner-written success over a hang. If it hangs after a good write, that is a finding
and you report it.

**A free checkpoint you already have:** both prior runs wrote a first page of
**4,306 / 3,694 / 8,000**. If page one differs this time, something changed in the
input and that is a finding before you reach the end.

## If it fails

The environmental cause is closed, so a failure now means something **new**. Stop,
capture the error and its timestamp, and pull the operations log for **both**
projects — hauska-factory and cortex-prod — not just one. Reading one project and
declaring the platform innocent is a documented planner error from this same
investigation. Do not attempt a second run.

## On success

Report the triple, the licensing `run_id`, and the digest. Read the bind from the
**store** by `GROUP BY run_id`, never from a lane close: Bastrop's bind moved from
`1dda40f7` to `85f984c2` while a close was being cited, and a close is a claim about a
moment while a bind is a fact with a timestamp.

TOTALS stays **UNMEASURED** until Travis also lands. Five counties is not TOTALS.

## Do not

- Do not run Travis.
- Do not re-diagnose the 57P01 failure; it is measured and closed.
- Do not raise `statement_timeout` or change page size from 8,000.
- Do not absorb a sentinel or soften a refusal to make a number match.
- Do not hand-cancel a hang and write a success over it.
- Do not run two heavy store operations at once.
- Do not start a run that could be executing during Tuesday 05:00–06:00 UTC.
- Do not start the setback bake or lift `SETBACK_APPLY_HELD`.
- Do not touch any repository other than the registered Factory worktree you open.

## Close

Use the exact CP1 / CP2 / CLOSE paths named at the end of this dispatch. Declare
snapshot including image digest in the first output. State both falsifiers before
executing. Report the run id, the triple, and whether the process exited unaided.
`leave_behind` named. Subagents do not commit.
