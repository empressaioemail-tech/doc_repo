# MISSION - OPS-21 S3: non-vacuity guard on write paths (P-134)

## What you are building
The control that would have caught the OPS-21 root cause the day it landed, and that
generalises to every rail.

**A test per registered write path asserting that for at least one real input it produces a
value.** Not that it runs. That it CAN succeed.

## REPO CORRECTION — read this first, it supersedes the dispatch header

The dispatch header says `repo: hauska-engine`. **That is a planner miscope, corrected
2026-09-10 before you hit it.** `computeTier1Envelope` exists in ZERO files in
hauska-engine and six in legacy-design-tools. Your FIRST target is:

    legacy-design-tools  artifacts/api-server/src/lib/nodeFacetBakeTier1.ts:92
    worktree: P:/seat-worktrees/property/legacy-design-tools-ops21-s3
    branch:   fix/ops21-s3-non-vacuity-ldt   (registered; off LDT origin/main)

Work there. The engine worktree stays registered for the second half of the mission (the
sweep of engine-side write paths), but do not start there.

This correction is itself an instance of what your lane is for: a claim verified in one
repo and stated generally. Note it in CP1.

## STANDING FACTS
- **The instance.** `computeTier1Envelope` (LDT `nodeFacetBakeTier1.ts:92`) has two return
  branches, both `status:"declined"`. It is called, executes, returns a well-formed object,
  and every existing test passes. It is structurally incapable of returning a value. Six
  weeks of "setbacks keep coming up short" is this one function.
- **Start there.** Write the failing test against `computeTier1Envelope` FIRST and confirm it
  fails on current main. A test that passes on day one has not been observed working.
- Then enumerate the other registered write paths and add the same assertion. Report the
  count without one - that count is this lane's own completion number.
- **Related but DISTINCT controls that already exist** - do not rebuild them:
  `check-live-job-has-config.mjs`, `writer-cli-reachability`, and the dead-guard reachability
  scan in Empressa Trading. Those catch dormant and starved. This catches VACUOUS: a path
  that runs perfectly and cannot succeed. It is a third category and nothing covers it.
- ENFORCEMENT.md: verify a check by violating it. Both directions, in a file, self-testing.

## Completion predicate
Count of registered write paths with no non-vacuity test equals 0, and the
`computeTier1Envelope` test demonstrably FAILS against current main before any fix.

## Out of scope
Fixing `computeTier1Envelope`. Your job is the detector, not the repair. S1 and S2 write
cells around it; whether that function is later repaired or retired is a separate ruling.
