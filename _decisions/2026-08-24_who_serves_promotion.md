---
decision_id: 2026-08-24_who_serves_promotion
date: 2026-08-24
owner: Nick (operator), recorded by planner
status: active
related_canonical:
  - _decisions/2026-08-24_feasibility_v1_rulings_and_data_capture_program.md
  - _decisions/2026-08-24_write_path_data_capture_order.md
  - _inbox/2026-08-24_parcel_facts_write_path_game_plan.md
  - _inbox/2026-08-12_L10_utility_probe_close.json
  - 90_operations/OPS-16_texas_market_plan_of_record.md
---

# Decision

Who-serves is promoted from L22 acquisition-only staging to a served read path. v1 is serve-time point-in-polygon against `tx_utility_territory_staging`. The product states territory holders plus the fixed residual `SERVICE-LETTER-REQUIRED — territory is not tap/capacity/extension commitment.` There is no who-serves atom family and no `--apply` on this card. Mains stay city-scoped depth, not a rail. Footprint drain and CAMA do not start in parallel with this card.

## Context

A-012 ruling 4 staged PUCT water/sewer CCN, HIFLD electric, TWDB PWS, and TCEQ as acquisition only, with product surface reserved as a post-gate consideration. Feasibility ruling 4 (2026-08-24) named the utilities section as that consumer and approved the promotion. The write-path game plan then refined the shape: serve-time PIP, no atoms. Operator go 2026-08-24 put this card in flight after field-mapping, sequenced before footprint / CAMA.

Rejected alternatives: inventing a who-serves atom family on this card; treating municipal mains as a uniform rail; starting P-09 or P-25 in the same wave.

## Structural commitment check

- Sell reasoning, not data: residual sentence is required on every parcel, including a hit.
- Confidence earned: holders come from staged public-record polygons, not a guessed utility.
- Cost per jurisdiction: reuse L22 staging; no new statewide harvest.
- Dual interface: serve path first; atom family later if ever, on its own card.

## Reasoning

L10 already measured the v1 claim: territory who-serves is statewide and uniform; tap, capacity, and extension are not. Promoting the staging table to a read path satisfies the feasibility utilities section without taking the atoms writer slot. A new atom family would be a second store of the same subject. Mains remain opportunistic city depth (A-014).

## Reversal criteria

- Staging schema 0076 is absent on the serving revision, in which case this card stops at CP1 and does not fake holders.
- A paying customer requires mains adjacency as a launch blocker, in which case that is a new amendment, not a silent widen of P-75.
- Geometry overlap shows L22 subjects duplicate an already-served family (special-district), in which case those rows stay complementary who-governs and are not restated as who-serves water.

## Dependencies

Depends on: A-014 probe verdict, L22 close, feasibility ruling 4, write-path P-75, field-mapping pass (A3).
Unlocks: P-75 implementation. Does not unlock P-09 or P-25.
