---
id: 2026-09-11_MIDSESSION_ops21_capture
title: MIDSESSION CAPTURE — OPS-21 serve completion, written so a fresh context can pick up cold
date: 2026-09-11
status: active
owner: integration
applies_to: OPS-21
plan_rows: [P-132, P-133, P-134, P-135, P-136, P-137, P-141, P-142, P-145, P-146]
snapshot: doc_repo main b367491d. Written mid-flight, not at close. Re-run scripts/ops21-lane-status.mjs before trusting any lane state below.
---

# MIDSESSION CAPTURE — read this first if you are picking OPS-21 up cold

Written deliberately for a fresh context. Everything a successor needs, with pointers rather
than restatement. **Nothing here is a substitute for re-running the instruments**, and the two
instruments are named at the bottom.

## What OPS-21 is, in one paragraph

The operator's goal, stated verbatim: *"I need all the information we have, including setback
and envelope rails, in production. That has been my goal for weeks and it keeps simply coming
up short."* Not "acquire everything." Every one of the 65 parcel-record rails reaches a real
state with an instrument behind it, in production, for six Central Texas counties. Values
where we have data, honest dispositions where we do not.

Plan: `90_operations/OPS-21_serve_completion_program.md`. Architecture reference:
`90_operations/OPS-22_spine_architecture_map.md`. Rows are P-132..P-146 in OPS-16 (amendments
A-122, A-123).

## THE ROOT CAUSE, and it is the thing to understand first

Setbacks and buildable envelope had **no write path to a value at all** since the anti-zombie
change. Two correct decisions by two owners formed a gap with no owner:

- `computeTier1Envelope` (LDT `nodeFacetBakeTier1.ts:92`) has TWO return branches and BOTH are
  `status:"declined"`. It is called, executes, returns a well-formed object, passes every test,
  and is structurally incapable of returning a value on any branch.
- `write-setback-city.mjs:95` throws `SETBACK_APPLY_HELD` on `--apply` — commit `c344345`, a
  card-scope boundary no later card lifted — and has no live parcel loader at all.

**The generalisable class is VACUOUS WRITE PATHS.** Dormant = no trigger. Starved = trigger
but input never supplied. **Vacuous = runs perfectly, every test passes, cannot succeed on any
branch.** Nothing in the fleet detected the third. S3/P-134 built the detector and found a
SECOND instance (`runP3Absence`, `src/jobs/p3-absence.mjs`), so it was not a one-off.

## Lane board at this snapshot

```
S1  P-132  factory   CLOSED  MERGED PR#135   351,872 parcels with real setback values
S2  P-133  factory   CLOSED  MERGED PR#136   4 of 8 envelope rails; refused to fabricate the other 4
S3  P-134  engine    CLOSED                  34 write-path units carry non-vacuity tests
D1  P-137  factory   CLOSED  MERGED PR#134   5 derivable rails
D5  P-136  factory   CLOSED  PR#132          gate denominator 17 -> 65, 390/390 verdicts live
D6  P-141  factory   CLOSED                  enumeration only, per mid-flight rescope
L1  P-142  LDT       CLOSED                  97 pairs audited, 70 legacy paths still reachable
S4  P-135  LDT       DISPATCHED, HELD        waiting on CTX-PIN4 to green factory main
R1  P-146  factory   RUNNING                 not_specified remediation
H1  P-145  factory   HELD at CP2             Hays; waiting on CTX-HAYS backfill to settle
CTX-PIN4   factory   RUNNING                 _LDT_SHA 591f5efe -> cebd041d
```

Worktrees are all registered in `_catalog/seat_register.json`. **Two name traps live there:**
`hauska-factory-ctx-pin4` is a FINISHED bump (`chore/ctx-pin4-b6-b7` @ `c446e0d`) — the current
lane is `hauska-factory-ctx-pin4-hays`. And `P:/hauska-factory` itself is a stale clone 246
commits behind at "Initial commit"; never work there.

## Rulings taken this session — do not relitigate

1. **`available-on-request` is a sixth cell state.**
   `_decisions/2026-09-10_available_on_request_sixth_cell_state.md`. Requires a named REACHABLE
   `requestPath`; a dead path is `unaccounted` or `refused`, never a promise. Applies to
   `hoaDeedRestrictions`, `ossf`, `publicRecordRefs`. NOTE: the DB CHECK constraint
   (`migrations/0007_parcel_record.sql`) permits only five kinds — a migration is owed.
2. **`not_specified` is three populations, three dispositions.**
   `_decisions/2026-09-11_not_specified_semantics_and_no_approximation_state.md` Ruling 1.
   225 SENTINEL_UNIFORM leave as `absent-verified` (~234,000 cells, CORRECT); 72
   REAL_VALUE_FLAGGED to `value`; 32 SENTINEL_SUSPECT to `refused`. **Scope by (jurisdiction,
   FIELD), never by city.** The governing sentence: 547,657 is the FLAG population, not the
   DEFECT population.
3. **NO "computed by approximation" state.** Same decision, Ruling 2. 3P-14's trigger is the
   road-frontage acquisition, full stop.
4. **The cadRoll overlay is TRANSITIONAL, not permanent** (3P-1), and nothing is deleted until
   L4 measures the divergence. L4 is NOT COMPILED.

## Open, with owners

- **S4 unblocks when CTX-PIN4 lands green.** It may legitimately slate NOTHING — the gate is
  zero-tolerance and S1 left 3,376 parcels unaccounted on `zoningDistrict`, a rail it does not
  own. Its predicate is written so an empty slate MEETS it if the grid and blocking cause are
  reported.
- **H1 releases when the CTX-HAYS backfill settles.** Its CP2 control run on Bastrop and
  Caldwell already proved the completion predicate is a real fireable test.
- **L4 divergence measurement** — not compiled, gates 3P-1 and sizes L3.
- **The Phase 3P deferred register** is in OPS-21, 16 items, each declaring the TRIGGER that
  wakes it. An item with no trigger is refused. Read it before adding work.
- The LDT gitlink item, routed to integration and unowned.

## PLANNER ERROR LOG — the most useful thing in this file

Seven errors, every one caught by a lane or a peer, none by the planner re-reading its own
work. The pattern is identical across all of them: **a claim verified on one side of a seam
and stated generally.**

1. **S3 dispatched at the wrong repo.** `computeTier1Envelope` is in 0 files in hauska-engine,
   6 in LDT. Same shape as CTX-STAMP, 2026-09-09.
2. **D6 under-scoped 3x.** Cell-state consumers: 55 factory, 82 LDT, 14 engine files. Sent to
   one repo.
3. **D5's STANDING FACTS were false for its own repo.** "Widening what is graded changes
   nothing a customer sees" — true of the LDT allowlist, FALSE for the factory's own publish
   gate, which imports `DEFAULT_SCHED_RAIL_KEYS` as its `requiredRails` default. Would have
   blocked every publish. The lane caught it.
4. **`plan-progress.mjs` compared `cell_state` directly** — it is `jsonb`, state is at
   `->>'kind'`. All 8 predicates would throw. D1 found it.
5. **Three predicates JOINed across two Neon hosts** and could never execute. S2 found it. Also
   unnecessary: counting `unaccounted` alone already excludes unincorporated.
6. **Attribution error in `0cc19422`** — swept a peer's uncommitted working-tree edit into a
   planner commit and credited it to "the lane". The shared doc_repo tree makes an uncommitted
   edit by one seat indistinguishable from the planner's at `git add`.
7. **Cited-and-untracked.** Committed the corpus audit markdown and left the instrument that
   produced it untracked on disk.

**The rule this produced, logged in
`_sessions/2026-09-10_ops21_program_open_and_dispatch_claude_code.md` and still PROSE (3P-4):**
before compiling any dispatch, (a) confirm every repo-scoped identifier it names exists in the
repo it names, and (b) for every symbol it tells a lane to CHANGE, enumerate consumers and check
the mission's stated blast radius against the count. Half (a) is presence-shaped; half (b) is
meaning-shaped and is the half that catches errors 2 and 3.

## What the lanes did right, which is why this worked

S2 designed a shape-only buildable-area approximation and **overruled itself** before writing a
line of geometry code, citing this program's own D1 ruling and two ENFORCEMENT rules, and
re-verified both against live files rather than taking the objecting peer's word. S3 fanned four
sub-agents one level deep with a no-nesting clause it verified, then re-executed every claim
itself. H1 obeyed a hold and built a control run instead of idling. L1 refused to adjudicate a
design question and handed it to the operator. **The executor layer is the healthy part of this
machine; the joint is where the errors are.**

## Instruments — run these, do not trust this page

```
node scripts/ops21-lane-status.mjs      lane board: worktree, REGISTERED, branch, ahead, artifacts
node scripts/plan-progress.mjs --sql    every lane's completion predicate as runnable SQL
node scripts/plan-progress.mjs --self-test     12 checks incl. type, store and non-vacuity
node scripts/county-contract.mjs --report      county contract cell states
```

`plan-progress.mjs` refuses with exit 2 rather than reporting a false zero without credentials.
Both it and the lane monitor report UNKNOWN rather than guessing. A lane showing "NONE YET" is
unmeasured from doc_repo, not idle.

## The one number that says whether this is working

`PROGRAM` in `plan-progress.mjs`: `unaccounted` across all 65 rails, six counties, excluding
nothing. If it is not falling week over week, the plan has strayed and the query says so
without anyone having to notice. That is the whole anti-drift design, and OPS-21 is the first
plan in this operation whose completion is machine-checkable.
