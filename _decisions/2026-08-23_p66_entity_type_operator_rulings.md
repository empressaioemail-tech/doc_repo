---
decision_id: 2026-08-23_p66_entity_type_operator_rulings
date: 2026-08-23
owner: Nick
status: active
related_canonical:
  - _catalog/instrument_entity_type_classifications.json
  - _inbox/2026-08-23_p66_entity_classification_plan.json
  - 24_instrument_conformance_program.md
  - 19_the_instrument_contract.md
---

## Decision

Operator closed all six open P-66 entity-type classification questions; registry status flipped to **active** (21/21 decided).

## Rulings

| entityType | field | ruling |
| --- | --- | --- |
| property-boundary-edge | chainAnchoring | **contemporaneous** |
| setback-rule | provenanceClass | **Record** |
| parcel-terrain-model | provenanceClass | **Observation** |
| building-footprint | provenanceClass | **Record** |
| road-node | provenanceClass | **split** (county-authoritative → Record; osm-assumed → Derivation) |
| code-amendment | chainAnchoring | **backfill** |

## Context

P-66 draft registry had 15 decided and 6 open types blocking serve-layer wiring and P-67 writer reclassification. Operator reviewed consequences in session and filed rulings 2026-08-23 after Phase 1 smartsite.cloud QA on gold parcel `48021:34137`.

## Structural commitment check

- **Sell reasoning, not data:** Record/Observation/Derivation split locks how citations render on inspect and delivery verification.
- **Confidence is earned:** Observation on terrain and Record on setbacks/footprint raise the bar for writer fields (edition, section, source dataset) in P-67.
- **Fail closed:** contemporaneous on boundary-edge means batch depth-warm edges cannot be served as verified contemporaneous chains without live re-derive (engineering follow-up).

## Reasoning

Boundary contemporaneous aligns delivery verification with live-read attestation (same family as setback live-derive). Setback as Record commits product to code-section citation on every served rule. Terrain as Observation treats DEM as measurement. Footprint as Record attributes present footprints to upstream GIS authority. Roads split preserves honest OSM vs county ROW distinction for manifest and map. Code-amendment backfill preserves historical as-of queries for Codex.

## Reversal criteria

Revisit if P-67 writer pass proves a ruling is unimplementable without lying (e.g. setback Record cannot carry edition+section on all served parcels), or if delivery verification audit finds contemporaneous boundary cannot be met without refusing most counties.

## Dependencies

Unblocks P-67 T1.4 writer reclassification and serve-path registry import. property-boundary-edge contemporaneous creates explicit engineering debt until live re-derive exists or serve refuses batch edges.

## Counterparties

Internal: property seat (serve wiring), substrate/engine (writers). Operator QA Phase 1 passed same session on `48021:34137` signed vs anonymous owner gating.
