---
decision_id: 2026-08-26_p85_easements_studio_tier_and_six_counties
date: 2026-08-26
owner: Nick (operator), recorded by integration seat
status: active
related_canonical:
  - 80_adrs/adr_027_first_party_land_records_acquisition.md
  - 80_adrs/adr_020_recorded_instruments_and_restriction_clauses.md
  - 80_adrs/adr_029_building_footprint_and_utility_easement_rails.md
  - 49b_encumbrance_ingestion_pipeline.md
  - _inbox/2026-08-05_T3_easement_source_recon.md
  - _inbox/2026-08-05_T3_ingest_spec_footprints_easements.md
  - _inbox/2026-08-10_smartsite_pricing_and_gtm_LOCKED.md
  - _inbox/2026-08-26_p85_central_texas_easements_WDLL.md
  - _decisions/2026-08-26_factory_model_law_and_option_a.md
  - 90_operations/OPS-16_texas_market_plan_of_record.md
  - 90_operations/OPS-19_factory_plan_of_record.md
---

# Decision

Three rulings, 2026-08-26, after an Austin Smart Site event where a prospect asked whether the app can find easements.

**1. Central Texas courthouse-recorded easements are carded now as OPS-16 P-85**, the customer-facing row, executed on the Factory's layers and stages (OPS-19 F-09 landing and adapters, F-16 resolution, F-18 intensional subjects, F-06 to F-08 publish, staging, verify). Scope is easements and the plats and right-of-way instruments that carry them; deed restrictions and CC&Rs ride the same instruments but are graded on a later card.

**2. Six counties.** Bastrop 48021, Travis 48453, Williamson 48491, Hays 48209, Caldwell 48055, and McLennan 48309. McLennan is added because it is the one county with CAD-digitised plat easement linework (44,197 lines, 16,578 labelled segments with partial document numbers) and because the operator states its platform state is "a really big mess"; the card carries a McLennan reconciliation item that measures that state before any easement attaches to a McLennan parcel.

**3. Easements are a Studio entitlement** on the locked Smart Site pricing ladder. The easement layer (existence, class, width, instrument reference, geometry where digitised, and the instrument image and clause text) resolves for Studio and Team. Free and Solo see the layer as withheld by entitlement, never as absent, and see no count. This amends the reading of ADR-020's `tenant-private` default for public-record instruments: a courthouse-recorded easement is public record and is served under the tiered access model, not as a tenant upload; the substrate seat owns the contract change that expresses public-record instruments with `discoverability` and `entitlement` when F-15 lands.

## Context

The types (ADR-020, ADR-029), the pipeline (49b), the acquisition law (ADR-027, first-party by Public Information Act under LGC 118.011(e) as amended by SB 1547, effective 2025-06-20), and the source recon (T3, 2026-08-05) all exist. Not one courthouse-recorded easement is in `hauska_mcp` (probe 2026-08-26T19:37Z: zero `recorded-instrument`, `restriction-clause`, or `utility-easement` rows); `neondb.recorded_instruments` holds three engagement uploads; the MCP tools `search_encumbrances` and `get_restrictions` read uploads only; PE has no easement facet; the feasibility spec's row 11 says "no card exists." No PIA request has ever been filed. The prospect's question is real and uncarded.

## Structural commitment check

- Sell reasoning, not data: every served easement is an instrument under doc 19: a document node, alias atoms for the recording reference, a fact atom with class-required provenance, `subject-to` and `derivesFrom` edges, and a typed verdict where nothing was found.
- Confidence is earned: OCR and plat vectorisation output is human-verified per subdivision before promotion (49b E.4); resolution decisions are atoms; the provisional queue is visible on the Factory console.
- Cost per jurisdiction: 49b's separate encumbrance cost model applies; the first six PIA responses measure the real number against ADR-027's low-four-figures-per-county model, and the card reports it.
- Dual interface: the same layer serves the inspect card and the MCP reporting gate; audience selects rendering only.
- No privileged data: every source is the county clerk under public records law, the CAD's own GIS, or a city's published GIS. TexasFile stays out per ADR-027.

## Reasoning

Easements are the ideal first family through the conformant stages because they have no legacy rows to demote and they exercise every object doc 19 introduced: documents as nodes, aliases as atoms, intensional subjects (a plat binds a set of lots), provenance classes, verified absence with scope. Building them on the old writer would violate option A (no new county on the old shape) and would create per-parcel enumeration that T1.4 exists to undo. Acquisition, landing, plat extraction, and index harvest touch no atom store and are the long pole regardless of the writer, so they start now. Studio placement follows the locked ladder's rule that tiers split on what the output is: an easement layer with instrument text is a professional deliverable, not a free answer about a place.

## Reversal criteria

- Two or more of the six clerks quote PIA costs above ten times ADR-027's model and the quotes survive an Attorney General cost complaint; then ADR-027's reversal clause 2 applies and the card pauses for a sourcing decision.
- The plat extraction cannot reach a human-verified precision the operator accepts on the first two subdivisions per county; then the card narrows to city GIS layers plus the instrument index (no geometry from plats) and says so on the manifest.
- Studio placement suppresses conversion in a way the operator measures; then existence and count may move to Solo or free by amendment, with the instrument text staying paid.
- The Factory's conformant writer (F-15, F-16, F-18) slips past a landed and resolved corpus; then the pre-contract-marked fill clause of the option A decision applies by amendment naming the counties.

## Dependencies

Depends on: the six PIA requests (operator signs); Factory L2 landing (F-01, F-09); the conformant stage E (F-15, F-16, F-18) for atomisation; publish and staging (F-06, F-07, F-08) for serve; a substrate-seat card for public-record instrument access fields.

Unblocks: feasibility spec row 11; the Smart Site easement facet and MCP layer; the deed-restriction and CC&R card that follows on the same instruments.

Does not unblock: unrecorded HOA rules, master development agreements, deed-chain reading parcel by parcel (49b hard-kill class), TexasFile in any form, any county outside the six.
