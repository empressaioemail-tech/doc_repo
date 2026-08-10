---
id: 2026-08-07_county_gis_coverage_and_gov_data_pitfalls
title: County GIS coverage, government data pitfalls, and the research battery
status: research
date: 2026-08-07
applies_to: hauska, smartcity, smart_site, bizops
source: Claude market-research chat, 2026-08-07, operator-carried into doc_repo. Secondary sources only; no primary verification performed.
owner: nick
related: [09_post_saas_substrate_thesis, 42_stub_thesis_national_twin_substrate, _prospects/vertosoft/2026-06-07_vertosoft_channel_and_offer, _inbox/2026-07-28_vertosoft_govcloud_competitive_scan, 14_pricing_framework]
---

# County GIS coverage, government data pitfalls, and the research battery

Market research produced in a separate Claude chat 2026-08-07 and filed here so it is durable and dispatchable. **Evidence grade: secondary.** The coverage numbers triangulate from aggregator marketing claims (ParcelAtlas, Regrid, ReportAll) and federal reports; none were independently verified. Internal-grade only. No figure in this note may appear in market-facing collateral without an independent primary source.

## Q1 — how many counties have property data online in a GIS

No authoritative census of this exists; FGDC, Census, and NACo do not maintain one. Triangulation:

| Layer of the question | Best available number | Source basis |
|---|---|---|
| Total US county-equivalents | ~3,143 | Census standard count |
| Counties where digital parcel data exists in some form | ~2,900+ (roughly 90%+) | ParcelAtlas claims 151M parcels across 2,900 counties; Regrid claims 3,200+ county-equivalents |
| Counties that publish it themselves via a public online GIS viewer | Unknown; meaningfully lower | No census exists; aggregators fill gaps by buying / digitizing themselves |
| States with a full, free, statewide digital parcel layer | ~10 | Esri and parcel-industry literature |

**The critical nuance: aggregator coverage overstates government publication.** Regrid and ReportAll reach near-total coverage partly by purchasing data, filing records requests, and digitizing paper maps themselves. A county's parcels existing in Regrid does not mean the county serves them online, freely, or machine-readably. The tail of paper / old-CAD counties is real, concentrated in low-population rural counties.

### Why the holdouts stay offline (five barriers, mostly economic)

1. **Funding structure.** Rural GIS runs on general funds plus per-document recording fees (a Wisconsin example: $30/document at the Register of Deeds). Low transaction volume means low fee revenue; levy limits cap the general fund. The revenue base scales with exactly the real-estate activity these counties do not have.
2. **No dedicated staff.** Most small agencies have no GIS position; parcel map changes take 2 to 4 weeks because it is someone's fifth job. Documented GIS talent shortage; urban and private employers outbid counties.
3. **Digitization is a multi-year capital project** that cannot fit one budget cycle for a small county, so it is spread across years or deferred indefinitely.
4. **Software licensing costs.** Esri-stack pricing is built for enterprises; a 5,000-person county cannot justify the recurring line item.
5. **No mandate.** Only ~10 states fund or require a statewide parcel layer (Wisconsin, Colorado OIT, and Texas via TxGIO are partial exceptions). The 1980 National Research Council call for standardized cadastral systems has produced no national mandate in 45 years.

## Q2 — systemic pitfalls in government data

Recurring failure classes across the literature, consistent with what the Bastrop / Central TX work hit empirically:

1. **PDF as the terminal format.** Zoning codes, plats, ordinances published as PDF with no structured equivalent; online but not machine-consumable.
2. **Schema fragmentation.** 3,000+ independent producers, each with its own field names, coding conventions, and semantics.
3. **Departmental silos within one government.** Assessor, recorder, planning, and permitting each keep their own systems; the parcel ID does not join cleanly even inside one county.
4. **Staleness with no freshness signal.** Published once, decays; update frequency irregular and undocumented.
5. **Assertion without provenance.** No lineage, no confidence, no as-of date. (The gap the quality-gate rule exists to exploit.)
6. **Access regression.** Some jurisdictions moving backward: paywalled viewers, vendor portals (eCode360-style 403s), disclaimer-walled downloads, per-record fees.
7. **Digitization is not accuracy.** Digitized boundaries carry legacy survey error; renders beautifully, still wrong. The area-sweep lesson generalizes nationally.
8. **Manual entry as the pipeline.** Hand-keyed at thousands of offices; error rates are structural.

## The research battery

Each question is sized as a single research dispatch, to be filed as a sourced research note on completion.

**Coverage and access gaps (market-sizing the holes)**
1. How many counties publish zoning geometry (district polygons) online versus just ordinance text?
2. How many municipalities have their zoning code online in structured form versus PDF versus vendor portal (Municode / eCode360 / American Legal) versus nothing?
3. What share of counties have digitized subdivision plats and easements versus paper-only in the recorder's vault?
4. How many jurisdictions expose permit data online versus counter-only?
5. Which states mandate and fund statewide parcel programs, at what cost, with what achieved coverage versus the voluntary states?
6. Where do the commercial aggregators (Regrid, ReportAll, CoreLogic) actually fail county-by-county, and why?

**Data quality and trust**
7. Measured error rates in county parcel boundaries versus survey ground truth, correlated with when and how the county digitized.
8. How often assessor, recorder, and GIS records disagree on the same parcel within one county.
9. What fraction of published government GIS layers carry any metadata on update frequency or accuracy; median staleness.
10. How counties handle parcel splits and merges; typical lag between recorded plat and GIS reflecting it.

**Format and machine-readability (the agent-consumption angle)**
11. How many jurisdictions offer API access to property / permit / zoning data versus viewer-only web maps?
12. What share of county ArcGIS servers are unintentionally open REST endpoints versus deliberately published services, and how fragile is that access?
13. Which government data types have zero prevailing standard schema (zoning districts, setbacks, overlays, impact fees), and has anyone attempted one that failed?

**Process and workflow pain (buyer-side problems)**
14. What a title search costs in a paper-record county versus a digital one, and who eats the spread.
15. Average permit / plan-review cycle time by jurisdiction size, and how much of the delay is information retrieval rather than judgment.
16. FOIA / PIA request volume for property data at counties, and fulfillment cost. (Frames the county's own incentive to publish.)
17. What developers, title companies, and lenders currently pay per jurisdiction for due-diligence data assembly, and to whom.

**Vendor and market structure**
18. Market share of Tyler Technologies, Schneider Geospatial, Vanguard, and Esri in county assessment / GIS hosting, and what their contracts do to data openness.
19. Which vendors contractually restrict counties from freely publishing their own data (the eCode360 pattern), and how widespread the clause is.
20. What happened to past national-parcel-database attempts (CRS R40717, HIFLD parcel summit, National Academies 2007 vision), and what killed each.

**Economics of the fix (validates structural commitment 3)**
21. Historical per-parcel digitization cost by county size, and what grants exist today.
22. Which counties have retired or defunded a GIS after standing one up, and why.

## Battery status (updated 2026-08-07, same day)

Five questions dispatched and filed as sourced notes: **Q11** `04_R11_api_access_absence.md`, **Q15** `05_R15_plan_review_cycle_times.md`, **Q16** `06_R16_records_request_burden.md`, **Q17** `07_R17_due_diligence_assembly_costs.md`, **Q20** `03_R20_national_parcel_database_postmortems.md`. The remaining 17 questions are open. The filed notes supersede this note's triangulations where they overlap; per-row grounding for the conviction map is recorded in `01_category_whitespace_and_conviction_map.md`.

One specific correction from the filed notes: this note's "~10 states with a full, free, statewide digital parcel layer" and R20's "31 states report statewide parcel coverage" (NSGIC Geospatial Maturity Assessment 2023, a primary-adjacent source) measure different bars — free-and-complete versus reported coverage of any completeness — and R20's figure is the better-sourced one. Use R20's framing (roughly 31 states, quality varying, no national coordinator) and retire the ~10 figure except when specifically discussing free public access.

## Prioritization (2026-08-07 read)

**For the Vertosoft launch, the buyer-side economics come first: 17, 15, 16.** Question 17 is a pricing anchor for the open government list price decision, which is the launch gate. Questions 15 and 16 can yield third-party, citable problem-scale figures. The never-say rule bars our outcome claims (savings, cycle-time results); it does not bar sourced third-party context about the problem's scale, which the Plan Review claims register already permits for outsourced-review cost. Independently sourced market figures would upgrade that context from operator knowledge to citable fact.

**For the catalog thesis, the original chat's read stands: 1, 2, 11, 17** size the wedge directly (zoning geometry coverage, code-text accessibility, API absence, what buyers pay). **Question 20 is the cheap one with outsized value:** three documented federal failures at building exactly the national layer being built bottom-up; the failure reasons are premortem material and investor-altitude positioning.

## Sources (as carried from the chat; not independently verified)

Regrid parcel coverage report; Esri national parcel data; ReportAll USA coverage; CRS R40717 (Issues Regarding a National Land Parcel Database); National Academies, National Land Parcel Data: A Vision for the Future; Texas statewide parcel data report (TNRIS/TxGIO); id.land, Barriers to a Digital Land Parcel Map; Colorado OIT on remote-county GIS access; Wisconsin SCO studies on local GIS use; GovTech, Low-Budget GIS; Comcate on local-government data management; Outstanding Challenges in Open Government Data Initiatives.
