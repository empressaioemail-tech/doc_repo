---
decision_id: 2026-08-26_p85_deep_easement_research_product_shape
date: 2026-08-26
owner: Nick (operator), recorded by integration seat
status: active
supersedes_partial: 2026-08-26_p85_easements_studio_tier_and_six_counties (sequencing only; the six counties and the Studio tier stand)
related_canonical:
  - _decisions/2026-08-26_p85_easements_studio_tier_and_six_counties.md
  - _inbox/2026-08-26_p85_central_texas_easements_WDLL.md
  - _inbox/2026-08-26_p85_pia_letters.md
  - 80_adrs/adr_027_first_party_land_records_acquisition.md
  - 80_adrs/adr_020_recorded_instruments_and_restriction_clauses.md
  - _decisions/2026-08-04_ecode360_partnership_retired_scrape_posture.md
  - _decisions/2026-08-26_factory_model_law_and_option_a.md
---

# Decision

Three rulings, 2026-08-26, later the same day as the P-85 carding, after the planner explained what the clerk portals expose and what the PIA letters buy.

**1. Online first, today, and no new ingestion.** Everything reachable online is used at click time for the one parcel: the city easement GIS layers (Round Rock, Cedar Park, City of Bastrop) and McLennan CAD's plat easement linework are queried live by geometry, and the clerk portals are searched by a browser agent through a recipe per vendor where each portal's terms, read and recorded per county, permit it. Nothing is landed or atomised on this card; the Factory lands those layers later on the conformant shape once Texas has caught up (amended the same evening: the operator would rather build the Factory and catch Texas up first than take on another chunk of ingestion). Images are never pulled around a paywall; a bot never drives a person's login.

**2. Deep Easement Research is a Studio product, and it is not instant.** A Studio user clicks it on a parcel. A background research run starts: instant sources first (GIS layers, anything already landed), then the clerk index for that parcel's subdivision, lot, and parties, then the instruments and plats themselves (bought per page where the portal sells them, at retail, charged into the product; queued to a human clerk run where a portal requires a person), then a vision read of the images, clause extraction, and a geometry derivation that draws the easement on the map with its confidence and its inputs. The user gets an email when it finishes and the result appears in that parcel's property records. The AI chat reasons over it afterwards. Every run is a record with its cost. The result is written through the existing recorded-instrument path, scoped to the requesting user like an upload, so it ships without waiting for the Factory's conformant public-record writer; promotion to the public layer comes later through that writer.

**3. The PIA letters are deferred.** Bulk first-party acquisition of the clerk indexes and images (ADR-027's path) remains the way the public easement layer and the manifest cells get built, and the letters are drafted, but the operator will deal with them in bulk later. They are not the first item and nothing on the card waits for them.

## Context

The previous decision put the six PIA letters first because they are the only path to the images at cost and to county-wide `absent-verified` verdicts. The operator's product intuition is different and it is right for launch: the person in Austin asked whether the app can find easements on a parcel, not whether the county is covered. A request-driven, asynchronous, emailed deliverable is a Studio product today; the public layer is the Factory's job over a longer horizon. The two converge: every deep research run lands instruments the public layer will later promote, and the bulk export, when it arrives, makes the per-parcel search cheaper and the absence verdicts wider.

## Structural commitment check

- Sell reasoning, not data: the deliverable is the reasoning (which instruments bind this lot, what they say, where the corridor falls), with every instrument cited to its recording reference and every derived geometry carrying its inputs and confidence.
- Confidence is earned: vision reads carry the source and verification headers the existing module already stamps ("never authoritative"); the geometry is a Derivation; the run record makes each result gradeable against a later human read, which is how the `og-title` package earned its baseline.
- Cost per jurisdiction: the run record carries image fees and compute per request; the product price covers it or the operator learns it does not.
- Dual interface: the same run result serves the inspect card, the chat, and the MCP reporting gate for the requesting user.
- No privileged data: clerk portals and public GIS only; TexasFile stays out; images bought at the clerk's price, never bypassed.

## Reasoning

A clerk portal is the custodian's own public-record system, and searching it one parcel at a time on a customer's request is what a person at the counter does; the 2026-08-04 ecode360 ruling already established that public record is acquired by portal where no better path exists. Bulk index harvest is the same code run wide and is decided per portal by its terms. Images are the line: they sit behind a per-page sale and pulling them around it is the conduct every records ToS names. Writing results through the existing tenant-scoped recorded-instrument path respects option A (no new public atoms on the old shape) while shipping the product now.

## Reversal criteria

- A portal's terms prohibit automated retrieval and the clerk objects; that county's deep research falls back to the human clerk-run step for that portal, and the PIA letter for that county moves up.
- Per-run cost (image fees plus compute plus any human step) exceeds what Studio pricing can carry on the measured mix; the product gets a per-run price or a run cap, by amendment.
- The vision read's clause precision on a graded sample falls below what the operator accepts; the product ships the instrument references and images without derived geometry until it recovers.

## Dependencies

Depends on: a transactional email provider (none is wired anywhere today; operator picks one); Studio-level tier granularity in PE's entitlement (today `free | paid` plus the per-property unlock; the Stripe live lane P-60 is adding tier granularity); the existing job pattern (`terrainJobWorker.ts`), vision module (`attachedDocumentVision.ts`), extraction module, and recorded-instrument path in `legacy-design-tools`; the portal terms check.

Unblocks: easements on Smart Site for Studio users in the six counties without waiting for bulk acquisition or the Factory's public writer; a graded corpus of instruments the public layer later promotes.

Does not unblock: county-wide `absent-verified` verdicts (those need the index export); the map layer for non-requesting users; anything outside the six counties.
