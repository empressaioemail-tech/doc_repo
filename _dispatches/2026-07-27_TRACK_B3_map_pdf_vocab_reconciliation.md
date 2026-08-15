---
id: 2026-07-27_TRACK_B3_map_pdf_vocab_reconciliation
title: Dispatch — Track B3 map/PDF/inspect vocabulary reconciliation
status: active
date: 2026-07-27
applies_to: [hauska-map, legacy-design-tools]
planner: Track B customer-UI planner
cites:
  - 2026-07-27_TRACK_B_customer_ui_quality_WDLL item 5, 6
related: [_dispatches/2026-07-26_FIX1_site_plan_offset_parity, _scratch/customer-ui-track-b]
---

# B3 — Map / PDF / inspect vocabulary reconciliation

## Role

You are BUILDER-B3. Build code only. Do not merge. Do not claim live agreement — planner verifies 3 parcels. Return scratch block in close.

## FLEET MEMORY (M0)

As you work, capture LESSON / DEAD-END / GROUND-TRUTH (timestamped) / OPEN in your close. Read the scratch block below FIRST. Do NOT self-promote.

## Scratch (start warm)

```
LESSON (FIX1 root): 34785 map/PDF disagreed because site-plan naive miter said setback-consumes-lot while depth-warm had ~13641 — geometry path fixed; SURFACES may still speak different words for same state.
LESSON (F1a / QA-3 class): a data state (pending / not_specified / provisional) must NEVER render as a false absolute ("unbuildable" / "0%" / "consumes lot") on one surface while another shows a number.
LESSON: buildableAreaPct omitted ≠ "pending forever" if envelope area exists — derive shared display vocabulary from one facet/model.
DEAD-END: papering over disagreement with softer copy while underlying fields still diverge.
OPEN: trio 48021:34785, 48021:47728, 48021:47595.
```

## Problem

Same parcel said different things on different surfaces (map card "buildable % pending" vs PDF "setback-consumes-lot"). FIX-1 addressed geometry root; verify and fix remaining surface vocabulary so map card, inspect, and PDF speak ONE truth.

## Required (WDLL 5)

1. Trace where map card, inspect, and site-plan PDF summary get setback/buildable strings. Identify remaining divergence points (field missing vs honest empty vs declined).
2. Unify customer-facing vocabulary: one shared state enum/mapper (or equivalent) so pending / provisional / buildable-with-area / declined-consume / not_specified axes cannot disagree across surfaces for the same inputs.
3. Prefer reading the warm envelope / shared facet model over re-deriving display math per surface.
4. Unit tests covering the historical disagreement class (envelope area present → no surface says "consumes lot" / bare pending %).
5. PRs as needed (map PE + BFF/ldt if facets live there). CI green. Do not merge until planner go.

## Out of scope

Road render (B1); PDF craft polish (B2); depth promote; inventing buildable % when geometry absent (honest shared pending is ok IF all surfaces agree).

## Done when

PR(s) open, CI green, close returns: SHAs, mapper location, test names, scratch block. Planner probes 3 gold parcels on live map card + inspect + PDF summary and pastes agreement evidence.
