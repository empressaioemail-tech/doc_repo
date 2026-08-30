---
decision_id: 2026-08-30_ctx_complete_or_absent
date: 2026-08-30
owner: Nick (operator), recorded by integration seat
status: active
related_canonical:
  - 90_operations/OPS-19_factory_plan_of_record.md
  - _decisions/2026-08-30_ctx_one_more_bake.md
  - _inbox/2026-08-30_ctx_w3_rail_inventory_WDLL.md
  - 80_adrs/adr_029_building_footprint_and_utility_easement_rails.md
---

## Decision

Central Texas complete means every named rail is a finished dataset or a named honest absence. Work volume is not a reason to leave a rail out. RRC wells surface on the production brief this pass: apply the existing writer against `tx_rrc_well` for the six, then PE reads `well-fact` atoms. A parcel with no intersecting well is absence, not a miss. Wave R waits until prep of those rails is verified. Prep first, verify, then one production publish.

## Context

A-027 left footprint, wells, roads, easements, F-11 stamps, Rainmaker edges, and leftover CAD out so the snapshot bake would not stall. The operator rejected that denominator: those fields are part of complete, bake means the production surface, and the sequence is prep then verify then one publish. RRC data is already joined in `neondb.tx_rrc_well`; it does not yet appear because PE reads atoms only and `well-fact` is zero on Bastrop.

## Structural commitment check

Sell reasoning, not data: a present rail names source and vintage; an absent rail names the scope searched.
No privileged data: public RRC, CAD, city GIS, OSM, Microsoft ML footprints only.
Fail closed: do not invent a PDD setback table or a well RRC does not have.

## Reasoning

Most rails already have a landing table or a writer. The stall is apply, not invention. The tables that do not exist are F-11 setback authoring (engine still hardcodes Bastrop layer 23), Factory landing for the four known public easement GIS layers, and a serve-visible county-coverage absence row per ADR-029. Those get built. Everything else is a Factory apply of a writer that already exists, plus honest-absence where the source recon already said none.

## Reversal criteria

Reverse a rail back out of Wave R only if a four-point probe finds no public source and the honest-absence row is already serving. Reverse the RRC apply if `tx_rrc_well` county_fips for a CTX FIPS is empty; then the county-coverage absence is the complete state, not a silent zero.

## Dependencies

Reverses the rails-out line of `_decisions/2026-08-30_ctx_one_more_bake.md`. Keeps one production publish and seed-stays. Unlocks W3 rail cards under F-06 / F-10 / F-11 / P-85. Wave R gated on W3 verify.

## Counterparties

Internal: operator, property seat, integration.
