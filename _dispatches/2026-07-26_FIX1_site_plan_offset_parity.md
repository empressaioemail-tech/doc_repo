---
id: 2026-07-26_FIX1_site_plan_offset_parity
title: Dispatch — FIX 1 site-plan offset parity with depth-warm (shared polygon-offset)
status: active
date: 2026-07-26
applies_to: [hauska-engine]
planner: depth-engine planning agent
cites:
  - _inbox/2026-07-26_bastrop_depth_reconciliation_finding
  - 27c WDLL 1 / R0 geometry truth
---

# FIX 1 — Site-plan offset = depth-warm insetPerEdge

## Problem (proven live)

`48021:34785` (1009 Chestnut): depth-warm `insetPerEdge([0,0,0,15])` → ~13641 sqft; site-plan `computeSetbackOffset` → `setback-consumes-lot`. Root: `site-plan/ring-geometry.ts` still naive miter; never got R0 polygon-clipping.

## Required

1. ONE shared offset implementation. Site-plan must call depth-warm `insetPerEdge` (or extract shared module both import). Delete/retire naive miter as the production path for setback rings.
2. Preserve site-plan role assignment / CAD segment metadata if needed, but the **offset ring** must come from the shared resolver.
3. Mechanical test: site-plan offset area ≈ depth-warm area on 34785 (clean rect, front 15' only). Fail if paths diverge.
4. PR on hauska-engine, CI green. Do not merge until planner go. No county fan-out. No promote of warm atoms in this PR (geometry only).

## Verify owed by planner

Regenerate site plan for 34785 live; must draw ~13641 envelope, not decline. Before/after pasted.
