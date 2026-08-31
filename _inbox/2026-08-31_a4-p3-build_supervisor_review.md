---
id: 2026-08-31_a4-p3-build_supervisor_review
title: Planner review of A4 P3 build (uncommitted)
date: 2026-08-31
plan_row: F-05, F-06
status: accepted-code-done
---

# Planner review of A4

Reviewed the write paths in `P:/tmp/hauska-factory-a4-p3-build` at `5f9acc3` plus uncommitted tree. Re-ran `node --test test/p3-absence.test.mjs test/p2-job.test.mjs` at 2026-08-31T21:28Z: 26 pass, 0 fail. Did not take the close's test count as evidence.

## Verdict

Accept as code-done. Do not treat as customer-done. 0006 is not applied. No live brief. Planner has not committed.

## Write paths read

`classifyParcelRail` in `src/ledgers/rail_absence.mjs`: unincorporated returns `not-applicable`; in-city and no landed table returns `unmeasured` before any none-found branch; `containmentTotal` is an unused parameter and 357269 does not appear in the result. `emitOverride: not-applicable` on in-city throws `IN_CITY_NOT_APPLICABLE`.

`writeRailAbsence` copies `asOf` from `collect_close.evaluatedAt`, refuses a request-clock match, refuses in-city `not-applicable`, and refuses a character-identical parcel basis.

`serveParcelRail` refuses a stuffed in-city `not-applicable` row rather than rewriting it. County easement rows project onto the parcel and append the parcel id to the basis.

`migrations/0006_rail_absence.sql` seeds no absence. `as_of` and `evaluated_at` have no `DEFAULT now()`. CHECK `rail_absence_not_applicable_unincorporated` is the store door for the ruling. That CHECK has not been shown to fire against Postgres. The in-memory fixture store does not enforce it.

`runP3Absence` refuses `--apply` (`LAPTOP_WRITE_FROZEN` then `APPLY_NOT_THIS_CARD`). `REQUIRED_NON_CAD_WRITERS` stays the original three. `p3-rail-absence` is on `WRITER_JOBS` and not in that required list, which is correct.

## Falsifiers

Arm 2 was violated two ways: `emitOverride` on `48021:INCITY-NOTABLE`, and a stuffed store row with `state=not-applicable` and `incorporation=in-city`. Both throw `IN_CITY_NOT_APPLICABLE`. The honest path is `unmeasured`. That is the ruling.

Arm 1: `48055:RURAL-1` with the T3 county row names `utility-easement` `absent-verified` at `2026-08-05T19:30:00.000Z`. The same parcel without that row is `empty: true` and `assertNamedAbsence` throws `EMPTY_RAIL`.

A second mechanism that would look like a pass: a test that only asserts the happy path and never forces `not-applicable`. Rejected because both poison tests are in the suite and were re-run here.

## What this does not close

`serveParcelBrief` returns `empty: true` rails and does not throw. `assertNamedAbsence` is the gate. A PE consumer that renders `empty` as a blank rail reproduces ADR-029. That is already leave-behind and it is the real remaining hole.

The SQL CHECK is dormant until a recorded migrate applies 0006. A grep of the migration file is not a CHECK firing.

`emitOverride` exists only so classify can be poisoned. The stuffed serve row is the stronger violation because it does not need the hatch.

## Commit posture

Uncommitted on `feat/a4-p3-build`. Planner commits by explicit pathspec when the operator says go. Not this review.
