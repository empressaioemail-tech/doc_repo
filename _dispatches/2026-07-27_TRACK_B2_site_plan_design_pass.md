---
id: 2026-07-27_TRACK_B2_site_plan_design_pass
title: Dispatch — Track B2 site-plan design pass (professional PDF deliverable)
status: active
date: 2026-07-27
applies_to: [hauska-engine]
planner: Track B customer-UI planner
cites:
  - 2026-07-27_TRACK_B_customer_ui_quality_WDLL items 3, 4, 6
related: [75o_site_plan_export_spec, _scratch/customer-ui-track-b]
---

# B2 — Site-plan design pass

## Role

You are BUILDER-B2. Build code only. Do not merge. Do not claim customer QA — planner verifies live PDF. Return scratch block in close.

## FLEET MEMORY (M0)

As you work, capture LESSON / DEAD-END / GROUND-TRUTH (timestamped) / OPEN in your close. Read the scratch block below FIRST. Do NOT self-promote.

## Scratch (start warm)

```
LESSON: current PDF is honest but crude — contour spaghetti, colliding dimension labels, weak craft.
LESSON: CAD+PDF MUST stay same source model (75o); design pass is layout/emit craft, not a second geometry pipeline.
LESSON: GIS bearing+distance tags are GIS-approximate — honesty label required; survey-grade = FAIL.
LESSON (FIX1.1): gold 48021:34785 envelope area ~13641 when offset path correct.
DEAD-END: inventing survey-grade property corners from TxGIO ring.
OPEN: if B1 road geometry not merged yet, design pass still ships on parcel+envelope+setbacks; leave STREET as current state with note.
```

## Problem

Site-plan PDF is correct-enough but not worth paying for. Make it a professional deliverable: clean layout, readable dimensions, parcel + envelope + road + setbacks legible.

## Required (WDLL 3 + 4)

1. **Design pass on PDF emitter** (and CAD labels if they share annotation placement): non-colliding dimension placement, contour declutter (e.g. clip/simplify/label cadence so parcel reads), hierarchy so property line + setback + envelope dominate, north/scale/summary/provenance remain.
2. **Near-free add:** computed property-line tags (bearing + distance from parcel GIS ring) ON the site plan if cheap. MUST be labeled GIS-approximate / not a boundary survey (existing honesty line reinforced). Skip with explicit reason if not near-free — do not fake.
3. **Same-source invariant held:** no second geometry pipeline; PDF reads shared site model.
4. Mechanical/visual fixture or golden sample under `_inbox/` or engine samples path for `48021:34785` (or generate script). CI green. Do not merge until planner go.

## Out of scope

Survey-grade tags; depth promote; map road render (B1); vocab copy (B3); Revit plugin; 3D envelope mass.

## Done when

PR open, CI green, close returns: SHA, before/after notes, regenerate command for gold PDF, scratch block, whether property-line tags shipped or deferred (one-line reason). Planner generates gold PDF and judges professional deliverable.
