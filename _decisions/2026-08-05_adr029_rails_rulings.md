---
id: 2026-08-05_adr029_rails_rulings
title: ADR-029 accepted with rulings — footprint/easement rails unblocked
date: 2026-08-05
status: active
related: [80_adrs/adr_029_building_footprint_and_utility_easement_rails, 90_operations/T3_rails_track, 90_operations/CATCHUP_program_2026-08-05]
---

# ADR-029 rulings (master planner, program authority per operator greenlight 2026-08-05)

Verification basis: City of Bastrop Easements_/43 count=148 independently reproduced by master planner; T3 probe artifacts filed in _inbox; BCAD no-vector-footprint reconciliation accepted (operator's observed "footprints" = EagleView ortho + CAMA tabular; bastropcad.org bulk-download recon stays a follow-on item).

## ADR-029: ACCEPTED, with the five open decisions resolved as follows

1. ABSENCE SHAPE — hybrid, precisely scoped: county-level absence is ONE county-coverage row referenced at serve time ("no footprint/easement source published for this county", probe-evidenced), never millions of per-parcel sentinels. Per-parcel sentinels are used ONLY where a source EXISTS but yields no feature for that parcel (e.g. ML spatial join < 50% overlap threshold finds nothing) — that is genuine per-parcel absence and serves as such.
2. CONTRACT BUMP — additive minor approved, target 1.9.0, sequenced AFTER ADR-028 fields land; cc-agent-AC registration authorized on that sequencing.
3. ML FALLBACK accessPolicy — PUBLIC-FREE, with mandatory sourceTier=ml-derived provenance and ODC-By attribution carried in the atom's provenance/citation. Rationale: structural commitment #1 (sell reasoning, not data) — Microsoft/Overture footprints are open data; the paid value is the composed site plan and reasoning, not the polygons. Charging for open data as public-paid would corrupt the tier doctrine.
4. ADR-021 basis enum — DEFERRED to post-registration ingest pilot; do not couple into the 1.9.0 bump.
5. Renderer obligation (ADR-012 focus mode) — DEFERRED to post-pilot, before any external .atompack export of these types.

## Unblock rulings for the T3 pilot chain

A. Contract registration: GO (per rulings 1-3 above; cc-agent-AC after ADR-028 coordination).
B. Heavy-scan Slot 1 / FIPS 48021: GRANTED, queued immediately behind T1 workstream-1 (city envelope re-warm) completion. Master planner coordinates the handoff; T3 does not start the apply until the slot is explicitly released to it.
C. Phase 2b municipal easements (Bastrop city limits, Easements_/43, 148 features): APPROVED — a city-PUBLISHED public GIS layer is public record, not a relationship dependency; the no-city-dependency rule prohibits ASKS, not reads of published data. Scoped to city limits, rides Slot 1.
D. Sequencing after slot release: contract registration -> ingest adapter + dry-run CLI -> PE overlay/site-plan layer code -> pilot apply (dry-run-exact) -> Jones/Higgins area-sweep cert paired with T1's re-warmed envelopes -> Phase 2 slots 2-8 one FIPS per reservation.

Reversal criteria: if ADR-028 sequencing stalls more than the program's horizon, the bump may proceed as 1.9.0 without ADR-028 fields on a fresh master ruling; if the ML join threshold produces materially wrong footprints at cert, the ml-derived tier gets a stricter gate before any further county.
