# R-06 canon-divergence ALARM — deferred

**GROUND-TRUTH 2026-08-23T15:15Z**

## Status

**DEFERRED** — operator ruling: needs more thought; do not pursue GitHub ALARM graduation this sprint.

## What was partial

- `canon-divergence` control exists, REPORTING tier, runs in `enforcement.yml` via `ci-baseline.mjs`
- Fixture bundle + violation path designed in `_inbox/2026-08-23_r06_ci_arm_plan.json`
- Graduation to BLOCKING blocked until GitHub Actions observes ALARM on fixture inject

## Why deferred

Operator wants to think through whether fixture-based ALARM on ubuntu (live clones skipped fail-open) is the right graduation shape vs live clone availability, baseline ratchet policy, and REPORTING→BLOCKING ceremony.

## Pickup when resumed

1. Read `_inbox/2026-08-23_r06_ci_arm_plan.json` and `_inbox/2026-08-21_gov-r06_proof.json`
2. Decide: commit fixture bundle + PR inject ALARM, or amend control scope first
3. Systems seat owns; property does not
