---
id: 60_data_package_and_providers
title: Oil and gas data package - sources, providers, build versus buy
status: exploration
last_updated: 2026-06-14
applies_to: [hauska, empressa]
owner: nick
related: [00_oil_gas_index, 20_tech_to_og_map, 50_complete_product_plan, 55_spine_data_intelligence_stack, 14_pricing_framework, 08_tiered_access_model]
---

# The oil and gas data package

> **What a complete platform needs to source, and from where.** Compiled from a 2026-06-14 research pass; source URLs are inline. Pricing in this sector is almost universally quote-only; no figure here is fabricated and every aggregator-sourced number is flagged unverified. Vendor coverage counts (well counts, pipeline miles) are the vendors' own marketing figures, not independently audited.
>
> **Strategic frame, per operator direction.** Stay provider-agnostic: no single commercial data vendor is load-bearing. The free public-records layer is the ground-truth spine extension we own; commercial providers are pass-through paid tiers priced at floor, consistent with sell-reasoning-not-data ([`14_pricing_framework.md`](14_pricing_framework.md)). Our margin is the reasoning over the data, never the resale of the data.

## The two-layer sourcing model

| Layer | What it is | Our posture |
|---|---|---|
| Public ground truth | State regulators, federal records, FracFocus, EIA. Free, authoritative, format-heterogeneous. | We ingest it into the spine as atoms. This is jurisdictional-intelligence work, the same adapter pattern as the code corpus. The cost is ingestion engineering, which the cost-per-jurisdiction rule governs. |
| Commercial | Enverus, S&P Global, TGS, Rextag, and aggregators. Subscription, clean, cross-state, broad. | Pass-through paid tiers. Price at floor. Do not make any one of them a dependency. Used where the public layer is fragmented or absent. |

## The build-versus-buy line

The sharpest split, and the thing that determines where our engineering goes:

- **Title and ownership chain: buy or aggregate.** There is no free national title source. County records are fragmented and often image-only. This is exactly why Enverus Courthouse, TexasFile, and CourthouseDirect exist. A complete platform either licenses an aggregator or builds county-by-county ingestion, which is the structurally hardest layer.
- **Production, permits, well data: free but ingestion-heavy.** State regulators and FracFocus give this away, but in bulk dumps, GIS services, and EBCDIC files, not clean APIs. This is our adapter-and-peel competence (the RawPdfAdapter and corpus-ingestion heritage), applied to a new domain.
- **Commodity pricing: clean split.** EIA and FRED free for historical and spot; CME and the commercial feeds for real-time and forward curves.

## Data categories the lifecycle needs, and the source for each

Authoritative public source first (free, ground truth), then commercial (broad, clean, cross-state).

| Category | Public source | Commercial source |
|---|---|---|
| Title / ownership chain | County clerk records; BLM MLRS for federal minerals (blm.gov/services/land-records/mlrs) | Enverus Courthouse (AI title, claims 350M+ records); TexasFile (254 TX counties); CourthouseDirect |
| Leases and obligations | State regulators; BLM lease GIS (gbp-blm-egis.hub.arcgis.com) | Enverus LandTrac/Drillinginfo; MineralSoft for obligation tracking |
| Production | RRC PDQ and EBCDIC bulk (TX); state regulators; EIA-914 national | Enverus, S&P Enerdeq, TGS, WellDatabase |
| Well data / completions / frac | State regulators; FracFocus for frac chemistry and water | Enverus Direct Access API, WellDatabase, TGS |
| Commodity pricing | EIA Open Data API (free key), FRED (free) | CME/NYMEX futures; Enverus MarketView; S&P Global Platts |
| Geology / reservoir / logs | State geological surveys (limited public logs) | TGS (well logs, claims 8M+ rasters); Enverus PRISM; S&P EDIN |
| Regulatory / permits | RRC, NM OCD, ND DMR, CO ECMC, OK OCC, PA DEP (all free) | Enverus, S&P (normalized cross-state) |
| Financial / valuation / type-curves | None authoritative public (SEC filings only, public companies) | Enverus PRISM Valuation Analytics; S&P |
| Midstream / infrastructure | Limited (EIA, pipeline regulators) | Rextag (claims 2M+ pipeline miles) |
| Land base / PLSS | BLM PLSS / Cadastral | USLandGrid (perpetual-license land grid) |
| ESG / produced water | FracFocus, TCEQ and state environmental, USGS, EPA | Enverus and S&P ESG modules (not separately verified) |

## The integrated incumbents to benchmark against

**Enverus** (formerly DrillingInfo) is the dominant integrated player and the most direct comparable. Surface: PRISM analytics platform (land, engineering, geology, production); Courthouse (AI title, 150 TX counties searchable, 246 via FileViewer); MarketView (pricing, forward curves, Excel and API access); PRISM Valuation Analytics (type curves, economics); MineralSoft (minerals management, Enverus claims it tracks ~85% of North American royalty revenue). Programmatic access is the Direct Access Developer API behind a DI Plus subscription, exposing production, completions, wells, rigs, permits, asset transactions, and directional surveys, with an official Python client (github.com/enverus-ea/enverus-developer-api). Pricing not published; the one aggregator figure found ($275/feature/month, Software Finder via Datarade) is low-confidence and explicitly may not map to the API. Do not quote it without confirming with Enverus.

**S&P Global Commodity Insights** (formerly IHS Markit) is the other integrated incumbent. Enerdeq (North American well, production, rig, permit data); EDIN (international E&P and midstream, API access); North American Upstream API (v4.4, March 2025). Subscription, contact-sales, no public pricing.

This matters because Enverus is both the benchmark and the prior vision's assumed dependency. Whether it becomes a partner, a pass-through data source, or a replaced dependency is open per [`00_oil_gas_index.md`](00_oil_gas_index.md); the platform must not be architected to require it.

## Specialist and complementary providers

- **TGS**: subsurface and well-log strength, weak on land and title. R360 portal, register free and pay per product.
- **Rextag**: pipeline and facility GIS, the midstream-infrastructure specialist. Web app, API mapping (WMS/WFS/REST), shapefiles.
- **WellDatabase**: lower-cost analytics challenger with a queryable API and tiered plans.
- **USLandGrid**: the PLSS land-grid base layer, perpetual license. Foundational GIS, not production data.
- **TexasFile and CourthouseDirect**: courthouse-record aggregators, the practical title-aggregation points for Texas.

## The public-records ingestion reality

This is where the engineering lives, and it is heterogeneous by jurisdiction:

- **Texas RRC**: free bulk data, but production ships monthly in EBCDIC format, the "Full Wellbore" file is EBCDIC, and there is no modern REST API. Production Data Query covers 1993 to present, imaged records 1964 to present, and the GIS viewer exports to Excel. A format modernization is underway (legacy R-3 EBCDIC retired August 2025, replaced with JSON). Ingestion requires EBCDIC parsing or scraping. An open-source harvester exists (github.com/mlbelobraydi/TXRRC_data_harvest). Source: rrc.texas.gov/resource-center/research/data-sets-available-for-download.
- **New Mexico OCD**: the most API-friendly state surface found, ArcGIS Hub with CSV, KML, GeoJSON, GeoTIFF, and WMS/WFS endpoints.
- **North Dakota DMR, Colorado ECMC, Oklahoma OCC, Pennsylvania DEP**: all free, formats vary from downloadable files to query apps with report extracts.
- **County clerk records**: no unified national system, the structurally hardest layer, which is why the commercial aggregators exist.
- **BLM MLRS**: the current federal mineral and land records system since March 2022, with lease GIS on ArcGIS Hub. Note a 2023 GAO report flagged BLM data-system weaknesses (gao.gov/assets/720/714590.pdf).
- **EIA Open Data API**: free with a registered key, crude, products, and natural gas prices plus EIA-914 production.
- **FracFocus**: free national frac-chemical registry, bulk SQL and CSV, updated five days a week; proprietary chemicals may be withheld.
- **TCEQ**: Texas environmental jurisdiction, distinct from RRC, and actively developing treated-produced-water land-application permitting (a 2026 rulemaking is in progress). Relevant to the midstream and produced-water angle.

## Flags that route out of engineering

- All commercial pricing is unconfirmable from public sources. Treat every figure here as quote-only and verify directly.
- All vendor coverage counts are self-reported marketing figures.
- **Licensing and redistribution is a counsel question, not researched here.** The terms for redistributing aggregated state and commercial data inside a paid product surface need a legal review before the data enters a paid tier. This routes to Nick alongside the other Hauska Inc. legal items, consistent with the out-of-scope rule.

## How this feeds the rest of the folder

Domain 8 of [`50_complete_product_plan.md`](50_complete_product_plan.md) is this data package. The public-records layer extends the spine ([`55`](55_spine_data_intelligence_stack.md)) the same way the code corpus did. The commercial layer is a set of pass-through paid tiers under the existing tier model ([`08`](08_tiered_access_model.md)). The provider-agnostic principle is the architectural expression of standing on our own merit rather than on an Enverus deal.
