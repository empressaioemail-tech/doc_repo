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

_(none open — L1 resolved 2026-08-10, see below)_

## Resolved

## L1 — RESOLVED 2026-08-10 (eng #298)

Fixed UPSTREAM as directed: `isZeroInsetEnvelope()` in `site-model.ts` returns null for `buildableAreaSqFt` when the offset ring is geometrically identical to the property ring, so the header's existing honest `NONE` branch fires. No header special-case — every consumer (header, sheet-2, layout callout, DXF/IFC, PE vocab) reads the same corrected field.

**Planner verification at source (not taken from the report):**

| Parcel | LOT | BUILDABLE | Verdict |
|---|---|---|---|
| 48021:34137 (has SF-1 setbacks 25/5/25) | 16,673 SF | **14,680 SF** | regression clean — real envelope still real |
| 48113:007701000B0010000 (no setback atom) | 1,722,107 SF | **NONE** | defect gone (was 1,722,104 SF) |

**Tolerance audited, not assumed.** The fix uses a `1e-9` RELATIVE area delta. Planner tested the worst realistic case: a **1-inch** setback on a 39.5-acre parcel produces a relative delta of **2.54e-4** — five orders of magnitude above the threshold, so it is correctly kept as a real envelope. Pure float noise sits at **1.09e-15**, correctly suppressed. The threshold is safe at both ends; a smaller epsilon would have been fragile and a larger one would have eaten real setbacks.

Also fixed: sheet-2 now routes honest-absence to the `noSetbackRule` chip instead of falsely reporting "setbacks consume lot".

### The flagged residual — RESOLVED, and the report had the wrong file

The close report flagged `depth-warm/consume.ts` setting `buildableAreaSqFt = inset.areaSqFt`. **That file does not exist.** The real hits are in `depth-warm/warm-compute.ts`:

- **Line 216** `buildableAreaSqFt: good.parcelAreaSqFt` — reads alarming (literally lot area) but it is inside **`injectBadWarmCandidate`**, a DELIBERATE test fixture that fabricates this exact defect so the verify gate can be proven to catch it. It is the RED demo, not a live path. Leave it.
- **Line 160** `buildableAreaSqFt: inset.areaSqFt` — the real warm path. This is CORRECT and is not the L1 class: it only runs when a setback rule resolved (the inset comes from `buildFlatSetbackFallback(descriptor, district)` with per-edge front/rear/side values). A parcel with no setback rule never reaches this path, which is precisely why Dallas had no bogus buildable-envelope ATOM — only a bogus PDF header.

**Verdict: no follow-up owed.** The residual as described was a misread of a test fixture. The genuine defensive gap — a warm path promoting a full-lot zero-inset ring — is already covered by the verify-mechanical gate that `injectBadWarmCandidate` exists to exercise.


## Promoted out of this register (were not polish)

_(none yet)_
