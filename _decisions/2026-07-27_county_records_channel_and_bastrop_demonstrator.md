---
id: 2026-07-27_county_records_channel_and_bastrop_demonstrator
title: Decision — county records as a Vertosoft channel product (NOT a national scrub); Bastrop as gift-demonstrator; the "click a parcel, all docs + all data" vision
date: 2026-07-27
type: decision_record
status: active
owner: nick
decided_by: nick (operator), captured by claude_code (planner)
related: [2026-07-26_base_layer_connecting_tissue_thesis_and_tracks, 2026-07-26_temporal_boundary_primitive_and_living_layer, 2026-07-26_v2_sourcing_recon_bastrop, 27f_bastrop_through_v2_program, 30_smartcity_os, 73_partnerships, _prospects/vertosoft]
reversal_criteria: reverse if records access proves impossible even through a county relationship, or if the channel (Vertosoft) does not materialize. The base-layer product does NOT depend on this — it ships records-free — so this is additive and safely reversible.
---

# County records as a channel product + Bastrop demonstrator

Captured 2026-07-27. Resolves the "should we scrub courthouse records nationally" feasibility question (operator was rightly skeptical). Answer: NO national scrub. Records are a per-county CHANNEL PRODUCT sold through Vertosoft, demonstrated first as a GIFT to Bastrop County, layered on top of the base map. This is additive — the base layer goes to market records-free.

## The feasibility resolution

National courthouse-record atomization is infeasible and must NOT be engaged as a build: ~3000 counties, each its own clerk/system/portal (or physical books), scanned images not data, no bulk/API, legal-grade extraction with zero error tolerance. It would consume the entire company and never finish.

The reframe that dissolves it: we do NOT scrub counties. Records arrive per-county through a CHANNEL:
- VERTOSOFT (our govtech reseller, relationship just starting) already has relationships with the counties. County records "brought into Hauska" becomes a PRODUCT Vertosoft sells county-by-county. We build the ingestion capability ONCE; it runs per-county when Vertosoft closes that county. The county is the customer/partner (their records become modern, queryable, map-based — value to them), not a scrape target.
- SMARTCITY OS (our county product, live in Bastrop at city level) is the surface the records module rides on. "Your county records, clickable on the map" is a premium module Vertosoft sells on top of SmartCity.
- Stack: base map (ours, national, GIS-grade, comprehensive-as-scoped WITHOUT records) -> SmartCity OS (county product) -> county-records module (premium, per-county, channel-sold). Each county that buys pulls its own records in.

So courthouse records are a REVENUE-GENERATING CHANNEL PRODUCT, not a cost-center scrub, and they scale through the reseller's relationships, not our labor. Never on the base-layer critical path.

## The product vision (operator, verbatim)

"Here's your map, click a parcel, see all docs + all the data we have." The base map is ours and national; "all docs" (records, plats, easements) arrives per-county through the channel as counties buy in. Nobody offers this: the CAD map exists, county records exist (scanned at the clerk), but nobody merges them into "click a parcel -> the map data AND the records, together, queryable." The base map makes it possible; the records make it nobody-else-has-this.

## Bastrop as gift-demonstrator (the first instance)

Operator has connections in Bastrop to give the county the platform. So the first records instance is a GIFT / warm demonstrator, not a cold pitch — one county, one records system, a relationship to smooth access. Demo scope: City of Bastrop proper (which is exactly where we already have 99.59% depth + the boundary primitive + gold parcels — the map/data half is largely DONE; the demo adds the records layer on top).

## The v1 UX ruling (the feasibility unlock)

Early offering = a DOWNLOADABLE DOC SET on the parcel, EXACTLY like the site-plan export today. Click parcel -> download its doc set (plats, deeds, records we've pulled). Reuses the existing site-plan export pattern; no new interaction paradigm, no rich records-viewer, no rabbit hole.

CRITICAL feasibility unlock: for v1, we do NOT ATOMIZE the records — we ASSOCIATE the document to the parcel and make it downloadable (content-addressed by CID on the substrate, served on click, next to the site plan). Document-ATTACHMENT, not data-EXTRACTION. No OCR, no metes-and-bounds parsing, no atomization required for v1. Having the records ON the parcel at all is already the "nobody offers this" wow.

Two tiers, clean:
- v1 records = documents attached to parcels, downloadable (no extraction). THE DEMO.
- v2 records = those documents PARSED into atoms (survey-grade property-line-tags, easements). Later, demand-driven, per the fidelity track. The premium future.

## Property-line-tags (connects here)

The surveyed boundary bearings/distances on a recorded plat (e.g. `N 41°41'58" W 74.87'`) — the operator calls them "property-line-tags." Two tiers matching the above:
- COMPUTED tags (from GIS parcel-ring geometry) — near-free, we have the geometry; honestly GIS-approximate ("not a survey"). This is the "on steroids" BEFORE any records. Candidate to pull FORWARD into the sellable surface (the boundary primitive already holds it — it is a boundary-edge enrichment, not new structure).
- SURVEY-GRADE tags (from recorded plats) — the exact bearings; a data-EXTRACTION process = the v2 records atomization above. Courthouse-doc territory, demand-driven, NOT now.
Operator ruling: if we can get property-line-tags WITHOUT sourcing courthouse data (i.e. computed from geometry) — DO IT. If it is an extraction process — it belongs in the records-atomization (v2) scope, do not engage now.

## Discipline: this does NOT supersede current objectives

Operator 2026-07-27: this net-new idea must NOT supersede the current build. The Bastrop-through-v2 base-layer build proceeds as planned. The records demo is a FOLLOW-UP Vertosoft conversation (operator handles the Vertosoft conversation tomorrow; the demo is framed as a follow-up, not owed tomorrow). The records-demo build is gated behind a records-access recon (what can we actually pull for City of Bastrop, in what form — bulk-via-connection vs public-document-by-document) and does not start until the base build is where it needs to be.

## Next (when engaged, not now)

Records-access recon (City of Bastrop): bulk data handoff via the county connection, or public per-document? That decides whether the demo is easy (bulk) or a slog (per-document). Then v1 build: associate records as downloadable docs on parcels (no extraction), reuse the site-plan export UX. Atomization (property-line-tags, easements) is v2/demand. All AFTER the base build; none on the critical path.
