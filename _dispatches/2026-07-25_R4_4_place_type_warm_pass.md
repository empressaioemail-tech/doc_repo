---
id: 2026-07-25_R4_4_place_type_warm_pass
title: Dispatch — R4.4 place-type-only Bastrop warm pass
status: closed
date: 2026-07-25
applies_to: [hauska-engine]
planner: depth-engine planning agent
depends_on: R4.3 merged (depth_warm=18; PDD ceiling named)
cites:
  - 27c WDLL 7
---

# R4.4 — warm the resolvable place-type universe

## Context

R4.3: gravel closed via 6.5.003 citation; city-cohort mass decline is honest PDD `no-setback-row`. Do not invent PDD feet. Drive depth on parcels whose district has a Place Type setback row (P-1..P-5 and any other rows already in descriptor).

## Required

1. Batch filter: exclude PDD / districts with no setback row; include place-types with rows.
2. Warm→verify→promote across that Bastrop universe (or large measured cohort with clear extrapolation to place-type denominator).
3. Paste cost JSON + outcomes; live SELECT depth_warm and a **place-type depth ratio** (warm / place-type zoning-facts), not only / all zoning-facts.
4. PR CI green; no merge until planner go; no Central-TX greenlight.

## Anti-fabrication

PDD stays honest decline. No fabricated site-specific setbacks.
