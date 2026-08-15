---
id: 2026-07-25_R3_1_honest_warm_edges
title: Dispatch — R3.1 honest warm edge labels (no uniform-front fabrication)
status: closed
date: 2026-07-25
applies_to: [hauska-engine]
planner: depth-engine planning agent
parent_pr: https://github.com/empressaioemail-tech/hauska-engine/pull/126
cites:
  - 27c WDLL 6
  - anti-fabrication / not_specified honesty
---

# R3.1 — honest warm edges before merge of #126

## Planner finding (verbatim)

On PR #126, `edgeLabelsForSpring714()` / `edgeLabels714SpringUniform()` label **every** edge `front` + `residential` so the inset is uniform 15′. That fabricates front setbacks on side/rear axes that P-5 marks `not_specified`.

Planner probe: honest labels (one front@15, sides/rear@0) on `PARCEL_714_SPRING_33512` → `empty=false`, `verifyPass=true`, `insetFeet=[0,0,0,0,0,15]`. The uniform shortcut is unnecessary and violates anti-fabrication.

## Required (push to #126 or stacked PR)

1. Replace uniform-all-fronts helpers with honest edge labels for 714 Spring (one front residential; other edges side/rear without inventing roadClass setbacks).
2. Assert in tests: not_specified axes remain 0 inset; front remains 15; verify still passes; bad-inject still rejects.
3. Pilot CLI must use the honest helper before any substrate promote.
4. Do NOT merge until planner re-verifies.

## FLEET MEMORY (M0)

Return LESSON: never uniform-apply front setback onto not_specified axes to dodge degeneracy — try honest partial inset first (it works on 714 Spring).
