---
decision_id: 2026-08-12_donley_48129_geometry_honest_absence
date: 2026-08-12
owner: nick (promote); L7 lane (draft)
status: provisional
verification_pending:
  - Live GET /api/county-ledger shows geometry cell 48129 displayState=satisfied-absent with non-null absenceBasis and verifiedByInstrument
  - SQL: SELECT rail_state, absence_basis, verified_by_instrument FROM county_facet_coverage WHERE county_fips='48129' AND facet='geometry' returns satisfied-absent with both provenance fields
  - Operator send of CAD outreach draft remains pending (does not block terminal ledger state; basis is StratMap 404 at source)
related_canonical:
  - _decisions/2026-08-11_texas_flush_launch_gate_amendment.md
  - 90_operations/OPS-16_texas_market_plan_of_record.md
  - _inbox/2026-08-09_F6_donley_cad_outreach_draft.md
  - _inbox/2026-08-12_L7_cp1_absence_path_trace.json
---

## Decision

Donley County (FIPS 48129) geometry rail cell is ruled **satisfied-absent**: the statewide StratMap parcel universe returns 404 / zero features for this county, and no public-record parcel geometry is currently loadable into `txgio_parcel`. Outreach to Donley CAD remains pending and does not reopen the cell to `not-yet` while the source gap is confirmed.

## Context

Texas L2 fabric is 253/254 counties in `txgio_parcel`; Donley is the only gap. Live ledger 2026-08-12: geometry 251 satisfied-present / 3 not-yet, with 48129 among the three and `county_facet_coverage` null for that cell (scorer previously skipped zero-denominator counties). Launch gate amendment DC-2 requires every geometry cell terminal as satisfied-present or satisfied-absent with provenance. Leaving Donley as `not-yet` forever would make DC-2 unclosable. Alternatives considered: (a) keep not-yet until CAD responds — rejected because StratMap absence is already a positive determination; (b) fabricate geometry — forbidden; (c) satisfied-absent with StratMap 404 evidence + CAD outreach pending — chosen.

## Structural commitment check

- Sell reasoning, not data: absence carries provenance (absenceBasis + verifiedByInstrument), not a silent hole.
- Confidence is earned: cell is measured (source universe queried; zero features), not asserted empty without instrument.
- Cost per jurisdiction: CAD outreach is the cheap path if a local export appears; no privileged relationship required.
- Dual interface: ledger displayState is the product-facing grade for both console and agents.
- Premortem: no yellow if provenance fields are non-null and CAD outreach stays visible as follow-on; yellow if absence is written without evidence.

## Reasoning

OPS-7 / INV-17 treat honest absence as a first-class satisfied state. StratMap is the statewide public-record parcel universe used for every other Texas county; a 404 / empty load for Donley is a positive determination that the phenomenon (StratMap parcel geometry for 48129) is absent at source, not that we failed to score. The CAD outreach draft (`_inbox/2026-08-09_F6_donley_cad_outreach_draft.md`) is the recovery path if a local export exists; until that arrives, the honest product state is satisfied-absent, not not-yet. DC-9 fails any satisfied cell with all of verifiedByInstrument, source, and absenceBasis null — this decision requires all three provenance legs on the written row.

## Reversal criteria

Reverse (return cell to not-yet or rescore to satisfied-present) if: (1) StratMap publishes a Donley parcel layer that loads into `txgio_parcel` with features > 0; (2) Donley CAD delivers a public shapefile/GDB that ingests under no-privileged-data rules; or (3) an operator ruling requires holding geometry open until CAD reply regardless of StratMap status.

## Dependencies

- L7 geometry scorer write path for fail-closed satisfied-absent (`countyGeometryScoreCli.ts --honest-absent`).
- DC-2 / P-01 geometry terminal cells.
- Does not depend on atoms bulk-writer slot (facet write only).

## Counterparties

Internal: doc_repo planner (promote provisional → active after live proof); L7 lane (ledger write). External: Donley CAD (Paula Lowrie / donleycad.org) for optional recovery export — outreach draft only, not a data-licensing relationship.
