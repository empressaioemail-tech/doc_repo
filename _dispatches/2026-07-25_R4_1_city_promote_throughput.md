---
id: 2026-07-25_R4_1_city_promote_throughput
title: Dispatch — R4.1 city promote throughput + county roads
status: closed
date: 2026-07-25
applies_to: [hauska-engine]
planner: depth-engine planning agent
parent_pr: https://github.com/empressaioemail-tech/hauska-engine/pull/127
cites:
  - 27c WDLL 7 (drive PARTIAL → MET)
depends_on: R4 tooling on main (58d53b13)
---

# R4.1 — city promote throughput

## Planner finding

R4 cost clears ($~0.28 extrapolated). Live tally: roads=1188, zoning=5769, depth_warm=1. City batch with `TXGIO_DATABASE_URL` (hauska-prod `CORTEX_DATABASE_URL`) on `48021:47728` and `48021:47595` → verifyFail `inset ring is null` / warm empty. Lexical 500-cohort was rural-skewed (450 no-road-adjacency). Central-TX stays blocked.

## Required

1. Diagnose empty-inset on parcels cortex already envelopes (47728, 47595, re-check 33512 via batch path). Fix edgeLabeling / inset application — no not_specified fabrication.
2. Full-county (or city+ETJ sufficient) Overpass road ingest; re-tally road_nodes.
3. City-geo cohort batch (not lexical prop_id head): paste promote/decline/fail rates + cost JSON; depth_warm count must climb above 1 on live SELECT.
4. PR, CI green, do not merge until planner go. Do not greenlight Central-TX.

## Env

- Substrate `DATABASE_URL` + `PROPERTY_ATOM_PATH=1` (hauska-prod-497015)
- Parcel rings: `TXGIO_DATABASE_URL` = hauska-prod `CORTEX_DATABASE_URL` (has `txgio_parcel`)
