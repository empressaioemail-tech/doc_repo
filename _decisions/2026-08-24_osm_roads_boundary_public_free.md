---
decision_id: 2026-08-24_osm_roads_boundary_public_free
date: 2026-08-24
owner: Nick (operator)
status: active
related_canonical:
  - _inbox/2026-08-24_govtech_smartsite_findings_relay.md
  - _decisions/2026-08-24_feasibility_v1_rulings_and_data_capture_program.md
---

# OSM roads and boundary edges are public-free

## Decision

OSM statewide roads and public boundary edges are `public-free`. The two engine `?? "public-free"` defaults in `road-intake` and `depth-warm` are confirmed, not overturned. `load-snapshot-into-pg.mjs` stays ops-only; no card to close its bypass.

## Context

Govtech relayed two SmartSite-territory writer defaults and one snapshot-loader bypass after engine PR #361. The value on roads and edges was already defensible (public record). The defect named was the silent `??`, not the stamp. Operator 2026-08-24: (1) yes public, (2) snapshot script fine.

## Structural commitment check

- No privileged data: holds. These families are public-record.
- Fail closed: the `??` remains until a later explicit-declaration patch. That patch is not this ruling. The ruling is the stamp, not the mechanism rewrite.

## Reasoning

Roads from Geofabrik OSM and public boundary edges are the same class as parcel/flood atoms already stamped public-free. Confirming stops the next audit from treating a correct value as an open hole. The snapshot loader is not live ingest. Operator accepted it as residual.

## Reversal criteria

A road or boundary family that is not public record is added on the same writer. A live caller of `load-snapshot-into-pg.mjs` is named against `hauska_mcp`.

## Dependencies

Relay `_inbox/2026-08-24_govtech_smartsite_findings_relay.md` asks 1 and 2. Explicit-declaration rewrite of the two `??` sites is optional follow-on, not a go.

## Counterparties

Internal. Property / engine for any later explicit-declaration patch.
