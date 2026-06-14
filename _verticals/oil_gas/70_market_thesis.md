---
id: 70_market_thesis
title: Oil and gas market thesis - the underserved SMB operator and dealmaker
status: exploration
last_updated: 2026-06-14
applies_to: [hauska, empressa]
owner: nick
related: [00_oil_gas_index, 20_tech_to_og_map, 50_complete_product_plan, 60_data_package_and_providers, 53a_noncustodial_settlement_rail, 09_post_saas_substrate_thesis]
---

# Market thesis: the underserved oil and gas long tail

> **Supporting documentation.** Compiled from a 2026-06-14 cited research pass. Reliability is flagged inline because this enters company intelligence. The pattern of this sector is that the structural facts are well-sourced from primary documents (EIA, IPAA, SEC filings, Enverus, Deloitte) while the "incumbents are too expensive" framing is real but vendor-sourced and motivated, with no neutral analyst confirmation found. Both are reported honestly below.

## Thesis statement

The US upstream long tail, roughly 9,000 independent producers running the 78% of US wells that produce 15 barrels of oil equivalent per day or less, assembles leases, manages land, and raises drilling capital on spreadsheets, paper, and relationship networks, because the incumbent software stack (Quorum, IFS, Enverus) is enterprise-priced, enterprise-shaped, and sales-gated toward majors and large independents. At the same time the transaction and capital rails this segment depends on (A&D marketplaces, advisory firms, private equity, working-interest syndication) structurally tier out deals below roughly five to thirty million dollars, and have contracted as upstream private equity swung from about 42 billion dollars of net acquisitions across 2016 to 2020 to over 100 billion of net divestitures across 2021 to 2025. The why-now is a historic consolidation wave (192 billion of US upstream M&A in 2023, 105 billion in 2024, 65 billion in 2025) pushing non-core acreage down to exactly this underserved buyer class at the moment their capital channels have thinned and an aging mineral-owner generation is monetizing. A platform that gives this segment modern land and deal tooling plus a capital-formation rail sits on the workflow surface the incumbents have priced and shaped themselves out of.

## Premise corrections (verified, record these)

Three assumptions in the prior oil and gas material are out of date and should not propagate:

1. P2 Energy Solutions was acquired by IFS AB in November 2022 and rebranded IFS Energy and Resources. The P2 product family (Merrick, BOLO, Excalibur, Tobin, Qbyte) is now IFS-branded. Drop the "P2 Land under Quorum" framing. (ifs.com)
2. Quorum ownership is two cycles past Thoma Bravo / Silver Lake: Silver Lake, then Thoma Bravo in 2018, then Francisco Partners announced March 2025 and current. (franciscopartners.com)
3. Enverus ownership is also moving: Genstar, then Hellman and Friedman in 2021, then Blackstone announced August 2025. The "OpenInvest" Enverus product referenced earlier is unverified; drop it. (blackstone.com)

## 1. Market size, and why there is no clean number

Market-research figures for "oil and gas software" diverge by more than an order of magnitude for the same year because each firm scopes the category differently. There is no single authoritative number; treat every figure as scope-dependent.

The most defensible anchors:

- Exploration and production software, the cleanest upstream proxy: about 6.4 billion in 2023 growing to 17.9 billion by 2030, roughly 13.8% CAGR (Global Industry Analysts via ResearchAndMarkets, 2024). The growth rate is well-attested across firms; the base level is a range (5 to 9.8 billion).
- Oil and gas plus chemicals software, built from actual vendor revenue: 14 billion in 2024 to 18.6 billion in 2029, 5.8% CAGR (Apps Run The World, 2025). Most defensible methodology, but bundles chemicals.
- Oil and gas accounting software: about 3.06 billion in 2024 to 6.81 billion by 2033, roughly 9.3% CAGR (SkyQuest, 2025). A competing 25.8 billion figure is an outlier on an implausible CAGR; do not cite it.

The strategically important finding is the absence: upstream land and lease administration software and A&D / asset-transaction software are not publicly sized as standalone categories. The only "land management software" reports span real estate, agriculture, and government, not oil and gas. That absence is itself a signal of an immature, vendor-fragmented, under-instrumented segment, and a bottom-up estimate from incumbent vendor revenues would beat any top-down portal figure. Listicle claims that oil and gas is "52 to 55% of land software demand" trace to SEO pages with no methodology; do not cite them.

## 2. The incumbents and the gap

Quorum runs land under My Quorum Land (enterprise) and On Demand Land (cloud tier), and is itself a roll-up (Landdox 2020, Aucerna and TietoEVRY 2021, Entero 2018). It serves the top of the market: its own page claims 80% of the largest US oil and gas companies and 90-plus North American operators; the Francisco Partners deal page cites over 1,500 customers from emerging operators to supermajors. Pricing is opaque and sales-gated.

IFS Energy and Resources (formerly P2) holds the same enterprise and large-independent base and was Quorum's primary direct competitor in upstream land and accounting. Pricing not public.

Enverus is a data roll-up (Drillinginfo, RS Energy Group, PLS, MineralSoft, RigData, Oildex, others) with the PRISM analytics platform. Broad reach with a heavy capital-markets tilt: the Blackstone deal release cites 8,000 customers and partnerships with over 95% of US energy producers; Enverus's own financial-services page cites 300-plus financial-institution customers and 1,000-plus operators. Tiered subscription, not publicly priced.

The gap for smaller operators is real but the evidence is vendor-sourced and therefore motivated. SMB-focused vendors characterize Quorum Land as "the enterprise default built for 500-plus well operators with dedicated IT" and Enverus as "overbuilt for most small operators," and state that many independents on mature held-by-production leases default to "a spreadsheet and a filing cabinet." No neutral analyst (Gartner or IDC type) calling these tools too expensive was found; that is an open citation gap. The structural facts (enterprise customer base, opaque sales-gated pricing) are independently supportable from the vendor and deal pages.

## 3. The segment

Definitional warning: there is no single authoritative count of "US oil and gas operators." Counts vary by definition (IPAA producing companies, EIA reporters, state operator-of-record registrations like Texas RRC Form P-5 which is materially larger). Any total must state its definition.

- About 9,000 independent producers across 33 states, averaging about 12 employees each; independents operate 95% of US wells and account for 85% of US oil and 90% of onshore gas (IPAA, advocacy framing, current).
- The long tail quantified: about 78% of all US wells produce 15 BOE per day or less in 2023 to 2024; the US had 918,481 producing wells as of December 2024 (EIA, primary).
- Basin fragmentation is a barbell: Eagle Ford has 200-plus active operators, the Bakken 60-plus but with about 8 operators producing roughly 80% of output post-consolidation (industry directories, medium reliability, verify before external use).

The deal-assembly workflow is the wedge surface. A landman or small operator identifies a prospect, runs title at the county courthouse, negotiates leases paying an upfront signature bonus plus a royalty (historically one-eighth, modern leases frequently 20 to 25%), then must fund the drill, bearing 100% of costs as a working-interest owner, typically by syndicating fractional working interests to outside investors. Two distinct capital-intensive stages. Interest mechanics, authoritative (Schlumberger glossary): working interest bears all costs; royalty interest is a share of gross revenue with no costs; net revenue interest is working interest net of all royalty burdens.

Spreadsheet prevalence is well-attested qualitatively and converges across independent landman and vendor sources ("most land services companies or landmen rely on Google Sheets and Excel"), but no neutral source quantifies it with a hard percentage.

## 4. The A&D and asset-transaction marketplace

EnergyNet is the premier technology-enabled marketplace for oil and gas property sales (private sales, sealed bids, auctions, government lease sales), founded 1999, and holds the exclusive contract to host BLM online lease auctions. Volume figures are scoped and dated (about 5 billion closed over a trailing 48 months as of roughly 2021, not cumulative; properties from 1,000 dollars to 250 million-plus). Do not present any figure as a cumulative-since-1999 total; none exists publicly.

The clearest evidence that small deals are tiered out: advisory firm Detring serves 30 million to 500 million-plus assets while its affiliate PetroDivest serves the "lower middle market" at 5 to 30 million, an explicit two-brand split treating sub-30-million as a distinct lower-touch tier, with sub-5-million outside even that. Valuation opacity compounds it: there is no mineral-rights MLS because algorithms struggle to value minerals and there is little data on actual arms-length prices paid.

The A&D trend is the sharpest why-now (Enverus, primary): 192 billion in 2023 (an all-time record), 105 billion in 2024, 65 billion in 2025, and 38 billion in the first quarter of 2026 but with only eight deals over 100 million, tying a post-2020 low in deal count, two-thirds of it a single merger. The strategic read: headline dollars concentrate in a handful of megadeals while deal count thins, which is direct evidence the small-deal segment is underserved.

## 5. Capital formation, and where the moat and the trust problem meet

The best quantitative anchor on capital sources is the Haynes Boone Fall 2023 borrowing-base survey (102 respondents): of next-twelve-months capital, 24% cash flow from operations, 17% bank debt, 10% private and family-office equity, 10% private-equity debt, 9% private-equity equity, 9% monetizations, the rest capital markets and joint ventures. Vintage-sensitive; later surveys show private equity and family offices up, public equity and reserve-based lending down.

Mechanics: most private drilling programs are Regulation D Rule 506(b) or 506(c) private placements sold to accredited investors taking a working interest; the Authorization for Expenditure is the formal funding-call instrument sent to non-operating partners before drilling; DrillCo joint ventures have a capital provider fund drilling for an assigned working interest reverting at a target internal rate of return.

The structural break is the capital-cycle reversal: upstream private equity swung from about 42 billion of net acquisitions across 2016 to 2020 to over 100 billion of net divestitures across 2021 to 2025, pivoting to midstream and infrastructure, with natural-resources private-markets fundraising well below even the depressed late-2010s levels (Deloitte). Capital is scarce for new and small teams specifically.

This is where our settlement design matters. Working-interest offerings are securities (Reg D, accredited thresholds, Form D, state blue-sky), and the SEC actively brings working-interest fraud actions (Heartland Group Ventures, over 122 million and 700-plus investors; Resolute Capital; Zona Energy; Americrude). Working interests are illiquid with no public secondary market; the legitimate secondary market runs through negotiated deals, not online marketplaces. This is simultaneously the regulatory moat and the trust problem a compliant, non-custodial verification rail addresses, which is exactly the posture in [`53a_noncustodial_settlement_rail.md`](53a_noncustodial_settlement_rail.md): verify the transaction, never custody the capital, take a technology fee not a broker fee. The "no digital capital marketplace exists" claim should be presented as an inference from three sourced facts (structural illiquidity, roughly 9,000 fragmented counterparties, contracted traditional channels), not as a directly cited statement.

## 6. Why-now drivers

1. Consolidation, the strongest and primary-sourced: 192 billion (2023), 105 billion (2024), 65 billion (2025), 38 billion first quarter 2026 at a post-2020 low in deal count. Enverus's read is that remaining opportunities are "largely smaller, higher up the cost curve, or both," with majors trimming portfolios and divesting less attractive assets that private equity and small private buyers absorb. That churn is the workflow surface.
2. Aging mineral owners monetizing: widely attested qualitatively (heir fractionalization, transfer costs exceeding value, consolidators aggregating family blocks) but with no clean dated authoritative figure. Weakest sourcing; flag before making it load-bearing.
3. Lagging digital transformation: EY reports upstream data "still recorded manually in disconnected paper records and spreadsheets" with only a small percentage of agreements digitized; McKinsey ties advanced analytics to over 5 dollars per barrel of additional value. The EY land-services point is the strongest direct support. The "Deloitte maturity index 1.3, lowest vertical" stat traces only to a vendor blog; do not cite externally.
4. Capital discipline: the post-2020 pivot from production growth to free cash flow means disciplined majors monetize marginal acreage rather than drill it, feeding the divestiture pipeline to smaller operators who need lean modern tooling.
5. Regulatory whipsaw, handle precisely: the IRA methane Waste Emissions Charge implementing rule was revoked via the Congressional Review Act in 2025, but the CRA killed the rule, not the IRA statute, so the charge mandate remains in law and could be re-implemented. Do not characterize this as "methane fee repealed." It is a persistent reporting and re-implementation-risk burden small operators are poorly tooled to manage.

## Reliability summary and open gaps

Strongest and externally defensible: consolidation and A&D trend (Enverus plus SEC filings), regulatory (EPA and Federal Register primaries), interest mechanics (Schlumberger glossary), securities enforcement (SEC releases), the capital-cycle reversal (Deloitte), the operator and well long tail (EIA and IPAA primaries).

Adequately sourced but motivated: the SMB software gap (vendor-sourced, no neutral analyst), landman workflow and spreadsheet prevalence (commercial, qualitatively convergent, no hard percentage), capital-formation mechanics (industry-participant educational content).

Do not cite externally without follow-up: aging-mineral-owner quantification, the Deloitte 1.3 maturity stat, the "private-equity fundraising down 77% since 2015" figure (unverifiable, drop), any EnergyNet cumulative-since-1999 total, and the unverified names MineralAnswers, Reded, and Enverus OpenInvest.

Two segments are simply not publicly sized: upstream land and lease administration software, and A&D / asset-transaction software. State that plainly; a bottom-up estimate from incumbent vendor revenues is the credible path and is itself a thesis point.

## What this means for us

The research validates the strategic read from the working sessions. The wedge customer is real and quantified: roughly 9,000 independents and the 78% long-tail well base, demonstrably running on spreadsheets, demonstrably tiered out of both the enterprise software stack and the capital and A&D rails. The consolidation wave is actively manufacturing this customer's opportunity by pushing non-core acreage down to them. The capital channels they need have structurally contracted. And the securities-law reality around working-interest capital is both why the space is hard and why a compliant, non-custodial verification rail is valuable rather than just convenient. The "marketplace is a byproduct of equipping the market" sequencing is supported directly by the illiquidity and fragmentation facts: there is no liquid secondary market precisely because there is no instrumented network of verified deals, which is the thing the land wedge accumulates. This is a vertical expression of the post-SaaS substrate thesis ([`09`](09_post_saas_substrate_thesis.md)): verified, reasoning-rich deal data as the substrate that lets capital move on trusted facts.
