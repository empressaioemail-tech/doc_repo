---
id: 2026-07-25_R4_bastrop_depth_cost
title: Dispatch — R4 Bastrop warm + depth-cost gate
status: closed-partial
date: 2026-07-25
applies_to: [hauska-engine, hauska-map]
planner: depth-engine planning agent
cites:
  - 27c WDLL 7 (BASTROP WARM + COST GATE)
  - 27c WDLL 9 (AERIAL CALIBRATION — consequence check; PARTIAL ok)
depends_on: R3 closed (WDLL 6+8 MET on 48021:33512)
---

# R4 — Bastrop warm + depth-cost gate

## Context (start warm)

R0–R3 closed. Live: 714 Spring `48021:33512` is depth-warm-promoted; PE reads `atom-chain-warm` + `X-PE-Cold-Derive: skipped`. One fixture road node on substrate. Overpass bbox road ingest still OPEN. Uniform-all-fronts fabrication is DEAD — honest partial insets only.

Read `_scratch/depth-engine-27c.md` FIRST.

## Acceptance

**WDLL 7:** Bastrop city + county warmed end to end via warm→verify→promote; ledger tallies FULL (roads + parcels + envelopes, honest gaps) via live SELECT. Real compute+verify cost per parcel MEASURED (paste numbers — dollars and wall time / parcel + extrapolated jurisdiction). Check against commitment #3 ($200 + 1hr/jurisdiction). Number decides eager-Central-TX (planner recommends; Nick decides).

**WDLL 9:** Aerial/parcel/road alignment check on a named Bastrop parcel. PARTIAL ok if ROW still approximate-assumed-per-class.

## Scope (execution order)

1. **Road ingest scale-up** — live Overpass (or equivalent public) bbox ingest for Bastrop roads onto the ONE substrate as road-nodes (no fork). Pilot fixture alone cannot warm 62k parcels honestly.
2. **Batch warm job** — depth-warm over Bastrop parcels that already have zoning-facts (depth-over-breadth). Honest edge labels; decline when geometry/roads insufficient; never fabricate not_specified axes.
3. **Cost instrumentation** — wall-clock + API/compute cost per parcel for warm+verify+promote; roll up to jurisdiction estimate. Paste measured numbers in close.
4. **Ledger tally** — live SELECT: zoning-facts vs depth-warm-promoted envelopes vs road-nodes for FIPS 48021; depth ratio before/after.
5. **WDLL 9 sample** — one named parcel screenshot or measurable alignment note (PARTIAL allowed).

## Out of scope

Central-TX depth (gated on Nick's cost decision). Non-road infra. Special Bastrop data path.

## Operator-routed

Do NOT greenlight eager-Central-TX. Return measured cost + recommendation. Planner surfaces to Nick.

## Done when

PR(s) green; planner live-proves ledger tally + cost paste; WDLL 7 graded. Do not merge until planner says go.

## FLEET MEMORY (M0)

Return LESSON / DEAD-END / GROUND-TRUTH / OPEN. Prefer mechanical guards (cost script that prints measured JSON; tally SQL checked in) over prose.
