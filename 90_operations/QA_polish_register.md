---
id: QA_polish_register
title: QA polish register — small items deferred by design
date: 2026-08-10
status: living register
owner: planner
memory_graded: pending
related:
  [
    90_operations/OPS-14_texas_flush_game_plan,
    90_operations/OPS-15_owner_and_rrc_rail_gap_analysis,
    _decisions/2026-08-09_texas_flush_launch_gate,
  ]
---

# QA polish register

Small, real, non-blocking defects found while browsing the live product. **Operator ruling 2026-08-10: do NOT stop the build path for these.** They accumulate here and get worked as a batch, or when someone is already in the relevant file.

Entry rules: one line per item, name the surface and the exact string or behavior, and say what "done" looks like. If an item turns out to be load-bearing (wrong number, wrong claim, legal exposure), it is NOT polish — promote it out of this file and into the active lane.

## Open

| # | Surface | Item | Done looks like | Found |
|---|---|---|---|---|
| Q1 | Flood & drainage PDF | Sheet header reads `FLOOD & DRAINAGE · SHEET 1 OF 2` but omits the `SMART SITE` brand prefix the site-plan sheet carries (`SMART SITE · SITE PLAN · SHEET 1 OF 4`) | Both report families lead with the same `SMART SITE ·` prefix; one shared header composer, not two | 2026-08-10 operator |
| Q2 | PE AI chat | Markdown is not rendered — replies show literal `**Identify the current zoning district**` asterisks instead of bold | Chat renders markdown bold/lists (the brief pane already does); no raw `**` reaches the user | 2026-08-10 operator |

## Open — NOT polish, load-bearing (do not batch with the above)

| # | Surface | Item | Why it is not polish | Found |
|---|---|---|---|---|
| **L1** | Site-plan PDF sheet 1 header | On a parcel with NO setback atom, the header prints **`LOT 1,722,104 SF / BUILDABLE 1,722,104 SF`** — identical values, i.e. the claim that 100% of a 39.5-acre Dallas parcel is buildable with zero setback. | **It states a false fact in the strongest position on the sheet.** Mechanism confirmed at source (operator-diagnosed): with no setback rule the inset is zero, so `offset.offsetRing` is non-null and equal to the parcel ring, `buildableAreaSqFt` = `lotAreaSqFt` (`site-model.ts:533`), and `buildableHeaderStat` prints a number instead of its honest `NONE` branch (`render.ts:543`). The header logic is CORRECT; it is being fed a fabricated envelope. The same sheet's own legend already says *"Buildable envelope — not drawn · no setback rule on file"* and *"Setback line — not drawn · no setback rule on file"*, so **the sheet contradicts itself**: the legend is honest and the headline is not. This is the exact class as the 2026-07-30 ponding headline (a stat that passed its own sanity test while being indefensible) — a paid report's headline number asserting something the data does not support. Fix direction: a zero-inset offset ring is NOT an envelope — suppress it upstream so `buildableAreaSqFt` is null and the header prints `NONE`, rather than special-casing the header. | 2026-08-10 planner, from the operator's Dallas export |

## Resolved

_(none yet)_

## Promoted out of this register (were not polish)

_(none yet)_
