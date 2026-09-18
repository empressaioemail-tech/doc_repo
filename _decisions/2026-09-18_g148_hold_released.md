---
decision_id: 2026-09-18_g148_hold_released
date: 2026-09-18
owner: nick
status: active
amends:
  [
    _decisions/2026-09-17_design_ratification_all_approved.md,
  ]
related_canonical:
  [
    90_operations/OPS-17_govtech_stack_plan_of_record.md,
    _design/SMARTCITY_TRACKER.md,
    _inbox/2026-09-15_roadmap_reconciliation.md,
  ]
---

## Decision

**G-148's hold is RELEASED, and the lane is dispatched as `g148-design-instruments`
(`_dispatches/2026-09-18_g148-design-instruments_dispatch.md`, mission
`_catalog/dispatch_missions/mission_g148_design_instruments.md`).** Operator, 2026-09-18, on the
release being put to them with the reasoning below: *release it - it is the fastest path to the gate
exiting 0*.

G-148 writes the missing `check.mjs` for the four designs that are past DRAFT with no adversarial read:

| Design | Status | Its build row |
|---|---|---|
| `smartcity-overview-lens` | RATIFIED | G-120 |
| `smartcity-map-dock` | APPROVED | G-128 |
| `smartcity-flood-study` | RATIFIED | G-149 |
| `plan-review-departments` | RATIFIED | G-144 |

## Why the hold no longer applied

The 2026-09-17 ruling held G-148 "for the designs with no build row", on the reasoning that
instrumenting a design nobody had built yet was lower value than instrumenting one a build was already
running against. **All four designs now have a build row.** Two of them were DISPATCHED against their
design before any instrument existed (`smartcity-map-dock` to G-128, `smartcity-overview-lens` to
G-120), which is the situation the hold was trying to avoid rather than one it protects. So the hold's
stated exemption covers none of the four, and `design-completion-gate.mjs` (G-146's own acceptance
instrument) cannot reach R3 zero without them.

Measured before the release, at 2026-09-18T15:46Z against `smartcity-dashboards` `origin/main`
`96fdafbb` and `_design` on disk:

```
R3 - designs past DRAFT with NO adversarial read as a file (4)
    plan-review-departments   RATIFIED with no check.mjs
    smartcity-flood-study     RATIFIED with no check.mjs
    smartcity-map-dock        APPROVED with no check.mjs
    smartcity-overview-lens   RATIFIED with no check.mjs
design folders: 18, with an instrument: 12
```

## Two overlaps resolved in the same dispatch, so nothing is built twice

Two of the four instruments are ALSO required by other plan rows, and both of those rows are blocked
while G-148 is not:

- `smartcity-flood-study/check.mjs` is required by **G-149**'s own row text.
- `smartcity-overview-lens/check.mjs` is required by **G-157**'s own row text.

**G-148 writes both; G-149 and G-157 inherit them as satisfied.** The dispatch requires the lane to
report the inheritance in a form the planner can paste into both rows. Two predicates for one design
that can disagree is worse than one, and the alternative reading (each build lane writes its own
design's instrument as part of its build proof) would leave both blocked on D-12 and an operator
capture respectively, which is where they already are.

`plan-review-reasoner` was the fifth name in G-148's original list and is not in this lane: G-150
delivered its `check.mjs` (72 self-tests) and `violate.mjs` (27 plants) on 2026-09-17. Its files are
named in the mission as the working model to copy.

## Reversal criteria

Reverse, and re-hold, if either holds:

1. A G-148 instrument is shown to match nothing on a real artboard, or to pass in both self-test
   directions. That is the Smart Files defect, and an instrument that cannot fail is worse than the
   absent one it replaced.
2. G-149 or G-157 reaches its own build proof and its acceptance is read to require delivering that
   design's `check.mjs` itself rather than inheriting it. In that case the inheritance is withdrawn and
   the row is amended, not silently double-satisfied.

The hold does not return merely because the work is inconvenient. It returns only on one of those two
facts.
