---
id: adr_027
title: ADR-027 First-party acquisition posture for land records
status: proposed
date: 2026-07-15
last_updated: 2026-07-15
deciders: [Empressa, Nick, counsel pending]
context: 2026-07-15 land records acquisition research session
related: [_land_records/strategy, _land_records/source_rail_registry, _land_records/ingest_architecture, _land_records/risk_register, 90_runbooks/pia_bulk_request_runbook, adr_020_recorded_instruments_and_restriction_clauses]
---

# ADR-027: First-party acquisition posture for land records

Slot reconciled 2026-07-15: originally drafted as adr_020, which is already taken by `adr_020_recorded_instruments_and_restriction_clauses.md`. Filed at the next free ADR slot, 027 (adr_026 is the sensor-stream ADR authored the same session). This ADR is a sibling to adr_020, not a replacement: adr_020 defines the recorded-instrument atom family; this ADR defines how that family's data is acquired.

## Context

Hauska needs Texas county land records at substrate scale. The obvious path is to consume TexasFile, which aggregates courthouse records and mineral data across 252 to 254 Texas counties.

Three things foreclose it.

**No technical rail.** TexasFile publishes no API. Pricing is per-click and per-page: $2.00 per image preview, $1.00 per page purchase, $0.10 per record for search result export, $0.25 to $0.50 per page for OCR. Bulk exists only for mineral data, at $500 per county roll and $2,500 to $20,000 for regional packages. Source: https://www.texasfile.com/pricing

**Contractual ban on the access pattern.** The Terms of Service state that retrieving information by any automated means is specifically prohibited, naming screen scraping, pulling images to avoid charges, and bulk downloading images. Source: https://www.texasfile.com/about/tos

**Contractual ban on the downstream use.** The same ToS states content may not be copied, republished, redistributed, transmitted, altered, edited, or exploited for any purpose without prior written permission, and that information may not be resold online or used for building title abstract plants as defined by TDI. Source: https://www.texasfile.com/about/tos

Separately, a legal change makes the alternative viable in a way it was not before. LGC 118.011(e), as amended by SB 1547 (89th Legislature, effective 2025-06-20), requires a county clerk providing a copy in a format other than paper, including real property records, to charge under Government Code 552.231 and 552.262, meaning the PIA cost rules at 1 TAC 70.3, rather than the per-page clerk fee schedule. Sources: https://codes.findlaw.com/tx/local-government-code/loc-gov-t-sect-118-011/, https://legiscan.com/TX/bill/SB1547/2025

## Decision

Hauska acquires Texas land records first-party, from the originating custodians, under public records law. Specifically:

1. **No scraping of TexasFile or any comparable aggregator.** Not as a bridge, not for evaluation, not for a demo. TexasFile survives only as a manual internal-grading reference, the same handling class as the Herbert title exemplars: look, never redistribute.
2. **No acquisition of aggregator data as a substrate input**, whether scraped, purchased per-document, or licensed. An aggregator license may be evaluated as a cost benchmark only, never as a dependency.
3. **County clerk records via PIA request for electronic copies**, priced under LGC 118.011(e) and 1 TAC 70.3.
4. **Appraisal district data via published bulk downloads where they exist**, PIA request otherwise, normalized to the Comptroller EARS record layout.
5. **Parcel geometry via TxGIO StratMap and direct CAD ArcGIS REST or bulk file, both free.** Verified 2026-07-15: StratMap parcels are a session-gated per-county file download (the public REST query service is display-only and the vintage service is token-gated), so per-CAD bulk downloads are the primary parcel path where a CAD self-publishes, with StratMap filling gap counties. StratMap address points ARE open paginated REST (11.7M features statewide).
6. **Every atom's license field must name the originating jurisdiction and the statutory basis for access.** An atom whose provenance chain terminates at a vendor is not admissible to the substrate.

## Consequences

Accepted costs: slower (254 separate clerk relationships on 254 timelines), operationally heavy (no standing PIA subscription; every delta is a fresh discrete request), uneven coverage carried honestly rather than papered over, and legal exposure to being wrong about 118.011(e).

Accepted benefits: cost (modeled PIA electronic acquisition low four figures per county against roughly $12M at $1 per page), license cleanliness (public records under LGC 191.006 carry no downstream restriction, so the atom license field can be truthful), a provenance chain terminating at the actual custodian of record (for a product sold to municipalities and title professionals, this chain is the product), no dependency on a competitor's goodwill or existence, and defensibility (nobody can revoke access to public records for competitive reasons).

Explicitly not decided here: whether Hauska assembles a plant-shaped dataset or engages TDI licensing (deferred), and whether to have one TexasFile licensing conversation as a benchmark (operator call).

## Alternatives considered

**Scrape TexasFile.** Rejected. Directly violates an explicit ToS ban on automated retrieval and produces atoms that cannot carry a truthful license field, which violates a structural commitment.

**License TexasFile data.** Rejected as a dependency. A licensed atom's provenance chain terminates at TexasFile, not at the county, which is exactly the single-vendor dependency the substrate exists to displace.

**Per-document purchase at retail.** Rejected on arithmetic. $1 per page does not survive contact with substrate scale.

**E-recording vendor integration.** Rejected as a category error. E-recording vendors submit documents into clerks under LGC 195.003; they are not a retrieval path, and Hauska would not qualify under 195.003.

**Wait for a state-level aggregation to emerge.** Rejected. TxGIO did this for parcel geometry and the Comptroller for appraisal rolls via EARS, but neither did it for clerk records and there is no signal anyone will. The absence is the opportunity. Verified 2026-07-15: the Comptroller EARS pipeline is inbound-submission-only with no self-serve pull, so the 253-CAD relationship does not collapse to one Comptroller feed on the self-serve layer.

## Reversal criteria

Reopen if any of the following occur:
1. Counsel finds LGC 118.011(e) does not bind on bulk electronic requests as read.
2. A pattern emerges across three or more counties of PIA quotes exceeding roughly 10x the modeled cost, surviving AG complaint.
3. Vendor-hosted records are found to be outside PIA production at PIA cost, covering a majority of target counties by transaction volume.
4. A state-level clerk record aggregation with clean license terms becomes available.
