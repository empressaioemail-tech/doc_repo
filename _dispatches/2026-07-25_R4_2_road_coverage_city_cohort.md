---
id: 2026-07-25_R4_2_road_coverage_city_cohort
title: Dispatch — R4.2 widen road coverage for city-cohort promote
status: closed
date: 2026-07-25
applies_to: [hauska-engine]
planner: depth-engine planning agent
depends_on: R4.1 merged (depth_warm=3 on 33512/47728/47595)
cites:
  - 27c WDLL 7
---

# R4.2 — road coverage so city-cohort can warm

## Context

R4.1 fixed empty-inset; live depth_warm=3. City-cohort n=150 still ~147 `no-road-adjacency` — roads are city-pilot bbox (1188 nodes), not full `BASTROP_CITY_BBOX` / county. Cost already clears; coverage is the gate.

Read `_scratch/depth-engine-27c.md` first.

## Required

1. Widen Overpass ingest to cover Bastrop city (and county if cheap) so city-cohort parcels get road adjacency.
2. Re-run `--city-cohort --promote` (n≥150); paste outcome JSON — promote+verifyPass must be non-trivial (not ~0/150).
3. Live SELECT: road_nodes ↑, depth_warm ↑ past 3; depth ratio pasted.
4. PR, CI green, no merge until planner go. No Central-TX greenlight.

## Env

Same as R4.1: substrate DATABASE_URL + TXGIO_DATABASE_URL=hauska-prod CORTEX_DATABASE_URL + PROPERTY_ATOM_PATH=1.
