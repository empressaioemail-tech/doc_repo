---
id: 2026-08-30_ctx_walk_scrub_WDLL
title: WDLL — CTX walk grades (BP-CONTENT-01 can fail; S-family in the walk)
date: 2026-08-30
last_updated: 2026-08-30
status: approved
amendment: 1
applies_to: hauska-factory (verify-walk grade set)
plan_row: F-08
depends_on: _decisions/2026-08-30_ctx_one_more_bake.md, _inbox/2026-08-30_ctx_remainder_deep_review.md §3.2 §6, OPS-19 A-021, A-025
operator_go: 2026-08-30 (walk card under the umbrella; gates Wave R)
snapshot: Factory origin/main; BP-CONTENT-01 hasKeyPath accepts null; walk self-test asserts all-null payload passes
owner: property-seat subagent produces the diff; planner commits; Wave R does not run until this card lands
---

# CTX walk grades

Date: 2026-08-30  Status: approved

A-025(2) requires present or explicitly absent-verified. The walk implements the first half only. The self-test that asserts an all-null payload passes converted the defect into a specification. This card extends the walk's grade set. It is not a standalone scrub script.

## Done looks like

An all-null facet payload fails BP-CONTENT-01. A `landUse: null` with no absent-verified pair fails. The walk's required paths include the leaves the schema claims (zoning.district, structuralFact.yearBuilt where the version says they exist). S1, S2, S2b, S4, S5, S8, S11 exist as walk grades, each proven by a poisoned row that fails and a known-good row that passes. A staging publish cannot reach production if any of those grades fail. Parent item 7 (Factory point index) lives here if it is still wanted; it is not a deferral to a missing sibling.

## Acceptance items

1. **Null is not present.** `hasKeyPath` no longer treats a null value as satisfying a required path. The all-null-passes self-test is deleted and replaced by a fixture that must fail. | check: fail-then-pass; the old all-null fixture now fails | grade: [met]

2. **Absent-verified is the only legal null.** A required path that is null must carry verdict + authority + scopeSearched + asOf + basis (BP-ABSENCE-01). A boolean `coverage: false` is not enough. | check: fixtures for legal pair vs landUse null + coverage false | grade: [met]

3. **S2b asOf is evaluation time.** `asOf` on an absent-verified leaf must equal `bakedAt` (or the evaluation clock), not the request clock. `basis` must vary across parcels or name a shared documented rule. | check: two-parcel fixture where request-clock asOf fails | grade: [met]

4. **S1 sentinel sweep.** Walk grade fails on `", ,"`, `", TX 78660"`, exact `0,0` presented as a usable point, `UNKNOWN`, `1900` as yearBuilt, `A1 — A1`. Reported per field, not collapsed. | check: one poisoned row per token | grade: [met]

5. **S4 binding integrity.** Served query point must fall inside the bound ring (`ST_Contains`) when a ring exists. A gate-blocked row with a non-zero point that is not in its ring fails. | check: poisoned wrong-parcel centroid fails; gold joined point passes | grade: [met as letter; same-payload]

6. **S5 refusal reconciliation.** A parcel on a named refused roster (starting with `_inbox/2026-08-08_D4_bastrop_dry_postfork_refused_roster.json`) must serve a body that names that refusal. Rainmaker `48021:8720522` / `no-setback-row` is the fixture. | check: roster join fixture | grade: [met — fed 701b9d5; Rainmaker is walked, not a sweep anchor]

7. **S11 schema-version fidelity.** The same version string cannot emit different required leaf sets across counties. If Travis omits `zoning.district` or `yearBuilt` while Bastrop emits them, the version moves or the walk fails. | check: cross-county shape diff fixture | grade: [met]

8. **S8 provenance.** A served value without source and timestamp fails. | check: poisoned bare value | grade: [met]

9. **Factory point index or drop.** Either an indexed Factory-side parcel point so BP-VALUE-01 is not shared-input, or this item is dropped with the reason that S4 is the second derivation. Do not leave a deferral to a missing sibling. | check: PR citing this item or a dropped line | grade: [dropped; reason rejected — see amendment 1]

10. **Handback.** Diff by file; tests; `leave_behind`. No commit, push, bake. | check: handback | grade: [met]

## Do not

- Ship a standalone scrub script beside the walk.
- Leave the all-null-passes fixture.
- Skip S4 or S5.
- Start Wave R before this card is on the publish image.
- Write PE or LDT bake code here (those are sibling cards).

## Amendment 1 (2026-08-30 planner CP2)

Reason: code reading of `gradeBindingIntegrity` and `runVerifyWalk`. Snapshot: factory worktree `7f41f523` plus uncommitted band 0 diff; tests 88/88 on this machine.

Item 9 drop is accepted as "no Factory parcel-point index on this card." The written reason is rejected. S4 compares the served body's own geometry to the served body's own queryPoint. That is one derivation. `landing_cad_property` has no ring. BP-VALUE-01 already re-derives city-limits containment from `landing_tx_city_boundary`. A parcel-ring second derivation is leave_behind, not a claim that S4 already is one.

Item 6 is partial. The unit fixture fails then passes. The live walk loads the roster and never fetches Rainmaker (not gold, not the three smoke parcels, not a sweep neighbour). S5 is starved until roster ids for the county are unioned into the walk list without becoming sweep anchors. Wave R still waits on a fed S5.

Evidence: `_inbox/2026-08-30_ctx_band0_cp2.json`.

## Amendment 2 (2026-08-30 S5 feed)

Reason: planner committed `701b9d5` on `seat/property-ctx-walk-alias-schema`. `runVerifyWalk` unions county roster ids into the walk list. Rainmaker is fetched and is not a sweep neighbour. Tests 85/85. Item 6 is met. Still not on a publish image. No push.
---
