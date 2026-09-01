---
decision_id: 2026-08-26_p85_records_request_scope
date: 2026-08-26
owner: Nick (operator), recorded by integration seat
status: active
supersedes_partial: 2026-08-26_p85_deep_easement_research_product_shape (scope and name; the shape, the tier, the six counties, and the deferral of the letters stand)
related_canonical:
  - _decisions/2026-08-26_p85_deep_easement_research_product_shape.md
  - _decisions/2026-08-26_p85_easements_studio_tier_and_six_counties.md
  - _inbox/2026-08-26_p85_central_texas_easements_WDLL.md
  - 80_adrs/adr_020_recorded_instruments_and_restriction_clauses.md
  - 80_adrs/adr_027_first_party_land_records_acquisition.md
  - _research/2026-05-26_recorded_restrictions_full_vision.md
  - _inbox/2026-07-16_map_data_sourcing_rulings.md
---

# Decision

Ruled 2026-08-26, late, before the P-85 dispatch went out.

**1. The product is a Records Request, not an easement search.** A Studio user requests the recorded documents for a parcel, from the Reports area of Smart Site, and the run brings back every instrument the county clerk's index ties to that parcel by subdivision, lot and block, by legal description, and by the parties on the appraisal roll: deeds, deeds of trust and their releases, liens of every kind, easements and rights of way, plats and their amendments, declarations of covenants and restrictions and their amendments, homeowner and property owner association notices and liens, affidavits, lis pendens, notices of trustee's sale, powers of attorney, memoranda of lease, mineral and royalty instruments, and anything else the index returns. Everything is acquired and kept with its image and provenance. Easements remain the first thing the map draws.

**2. Extraction depth follows the instrument type.** Easements, rights of way, plats, and restriction declarations get clause extraction and, where placeable, geometry, as the earlier card specified. Deeds, deeds of trust, releases, liens, notices, and affidavits get their header facts (parties, dates, recording reference, amounts and instrument cross-references where the document states them) and the image; their clause text is not extracted in this card. Every instrument is classified by ADR-020 `instrumentType`; where the enum lacks a type (deed, deed of trust, release, notice, affidavit, mineral), the instrument carries `other` with a `documentKind` field until the substrate seat extends the contract.

**3. It lives in Reports and is delivered like a report.** The action sits in the Reports dropdown beside the feasibility study, runs asynchronously, emails on completion, and lands in the parcel's property records with its own section, ordered by recording date, filterable by type.

**4. It is a per-request research service, never a title plant and never a title opinion.** Runs happen one parcel at a time on a customer's request; results are scoped to the requesting user; the product states what the index returned and what the documents say, and does not assert marketable title, priority, or a chain of title. Bulk acquisition of an index (Phase C) proceeds under ADR-027 and keeps the TDI title-plant question deferred exactly as ADR-027 left it. The card carries this boundary as an item.

## Context

The operator's reasoning: real estate professionals need the whole recorded file, not one instrument type; HOA declarations, liens, releases, and deeds are as useful as easements, and once the run is at the clerk's index for a parcel the marginal cost of taking everything is small. The prior motivated-seller research (2026-07-16) already found that pre-foreclosure notices and similar signals are genuine county clerk public record acquired through the same uniform process.

## Structural commitment check

- Sell reasoning, not data: the deliverable is a classified, cited, dated set of instruments with provenance, plus extracted reasoning where the type supports it.
- Confidence is earned: header facts and clauses are machine-read with headers; the graded sample now spans instrument types, not only easements.
- Cost per jurisdiction: per-run cost grows with instrument count; the run records it and the product's per-run ask (a purchase threshold) is designed in.
- Dual interface: the same run result serves the records view, the chat, and the MCP reporting gate.
- No privileged data: county clerk public record and public GIS only; owner and party names are already on the appraisal roll at the identified tier.

## Reasoning

The search is the same search; the acquisition is the same acquisition; ADR-020 already models any recorded instrument. Broadening the scope at the card stage avoids a second product with a second job, a second email, and a second records section. The extraction-depth rule keeps the first release bounded: full reading for the instruments that constrain the land, header facts for the instruments that record its history. The title-plant boundary is written because "grab all of it" across many parcels is precisely the shape Texas regulates, and ADR-027 deliberately left that question open.

## Reversal criteria

- Per-run cost on the measured mix exceeds what Studio can carry; then the product gains a per-run price, a document-type selector, or an instrument cap, by amendment.
- A clerk or a vendor objects that per-request research at our volume constitutes plant building; then the card pauses on that county pending counsel and the ADR-027 deferral is reopened.
- Header-fact extraction on deeds and liens grades below what the operator accepts; then those types ship as image plus index row only until it recovers.

## Dependencies

Unchanged from the product-shape decision, plus a substrate-seat request to extend ADR-020's `instrumentType` enum with the types above.
