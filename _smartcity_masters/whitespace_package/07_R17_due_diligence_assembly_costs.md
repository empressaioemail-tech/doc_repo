---
id: 2026-08-07_R17_due_diligence_assembly_costs
title: R17 — what buyers pay per property / per jurisdiction for due-diligence data assembly
status: research
date: 2026-08-07
applies_to: hauska, smart_site, smartcity, bizops, pricing
source: Public-web research by dispatched subagent, 2026-08-07. Evidence grades labeled per claim (published-price / reported-secondary / anecdotal / honest-absence). Research battery question 17 of 02_research_battery_coverage_and_pitfalls.md.
owner: nick
related: [2026-08-07_county_gis_coverage_and_gov_data_pitfalls, 14_pricing_framework, _prospects/vertosoft/2026-06-07_vertosoft_channel_and_offer, 01_category_whitespace_and_conviction_map]
---

# R17 — Due-diligence data assembly: what US developers, title companies, and lenders pay

Research date: 2026-08-07. Public-web sources only; all prices in USD. Evidence grades defined at the end of the note.

## Bottom line

Per-property due-diligence data assembly in the US is priced almost entirely per transaction, not per jurisdiction, and the spread is wide: a borrower pays $15 to $30 for a flood determination, a title company pays $75 to $400 for a residential title search (rising to $1,000 to $2,500+ for commercial), a Florida closing absorbs $100 to $175 for a municipal lien and permit search, and a CRE lender requires a zoning report that runs from roughly $550 at the discount end to $1,000+ typical for a lender-grade PZR report. Municipalities themselves charge $60 to $520 for a zoning verification letter, with big-city fees clustering at $150 to $350, and turnaround measured in weeks. On the data-subscription side, Regrid publishes real per-county prices ($150 to $800 one-time per county, $50,000 to $135,000 per year nationwide) while ATTOM and Cotality (CoreLogic) sell almost entirely on custom quotes; the one reported Cotality anchor is a median enterprise contract around $12,000 per year. Zoning-intelligence SaaS (Zoneomics) is sold per seat at $92 to $279 per month nationally, not per jurisdiction. The direct answer to the structural question: no vendor was found selling jurisdictional or zoning intelligence to the buyer side (developers, lenders, title) as a published per-jurisdiction subscription; the closest shapes are UrbanForm's unpublished "multi-city" plans and Gridics CodeHUB sold per city to the government itself on quote. That gap is the most notable finding: the market prices the per-property document, not standing per-jurisdiction coverage.

## 1. Zoning reports and zoning verification letters

Private zoning report vendors (PZR by LightBox, Millman National Land Services, NV5/Bock & Clark lineage, Zoning Inc., CREtelligent) sell per-report to CRE lenders, CMBS issuers, title companies (ALTA Table A Item 6 compliance), and developers. Millman, LightBox, and CREtelligent do not publish price lists; Zoning Inc. does.

| Product | Seller | Price | Unit | Buyer | Grade |
|---|---|---|---|---|---|
| Zoning report, entry tier | Zoning Inc. | from $75 | per report per site | developers, lenders | published-price |
| Standard single-site Zone IV report, avg. muni fees, 2-3 week turn | Zoning Inc. | $550 to $650 | per report | lenders, title | published-price |
| PZR Report | LightBox (PZR) | "few hundred to a few thousand"; standard starts ~$1,000 | per report | CMBS/bank lenders, title cos | reported-secondary |
| Expert zoning report | Gridics | $650 | per report | developers, brokers | reported-secondary |
| Single-site zoning report (PDF) | UrbanForm | $197 | per report | architects, developers | published-price |
| Zoning Brief (add-on to subscription) | Zoneomics | $55 to $65 | per brief | CRE professionals | published-price |

Municipal zoning verification letters (the government's own product, bought by lenders, title companies, and license applicants):

| Jurisdiction | Fee | Effective / source date | Grade |
|---|---|---|---|
| Austin, TX (zoning verification letter) | $17.68 (free for state-license email verification) | 2026 page | reported-secondary (extracted figure; verify against DSD fee schedule) |
| Peachtree City, GA | $60 | FY2024-25 fee schedule | published-price |
| Los Angeles City (Zoning Information Letter, LADBS) | $70.85 | current LADBS page | published-price |
| Cabarrus County, NC | $100 per parcel | current fee schedule | published-price |
| Prince William County, VA | $112.46 | FY2026 schedule, eff. 2025-07-01 | published-price |
| Chicago, IL (Certificate of Zoning Compliance) | $150 | 2023 form, current | published-price |
| Los Angeles County | $192 | schedule as of 2023-03 | published-price |
| Phoenix, AZ | $350 | current process doc | published-price |
| Union City, CA | $519 + $104 per additional APN | FY2024-25 fee schedule | published-price |

Sources: Zoning Inc. FAQ, zoningreport.com/FAQ.html (undated, current; note the site's TLS certificate is expired, figures taken from search index 2026-08-07); Cypress Environmental & Infrastructure, cypressei.com/engineering/what-is-a-zoning-report-and-why-do-developers-need-one/ (2024-2025); LightBox PZR product page, lightboxre.com/product/pzr/ (2026-08-07); BIM Tools Hub Gridics profile, bimtoolshub.com/gridics (2026); UrbanForm pricing, urbanform.us/pricing (fetched 2026-08-07); Zoneomics subscription pricing, zoneomics.com/pricing/subscription (fetched 2026-08-07); municipal fee schedules: civicclerk (Peachtree City FY24-25), ladbsservices2.lacity.org, cabarruscounty.us fee schedule, pwcva.gov/assets/2024-07/Fee_Schedule_Zoning.pdf, chicago.gov Certificate of Zoning Compliance form (2023-07), planning.lacounty.gov fee schedule (2023-03), phoenix.gov verification-letter-process.pdf, unioncityca.gov Fees FY2024-2025 (all accessed 2026-08-07); austintexas.gov/development-services/zoning-verification (2026-08-07).

## 2. Title searches and title abstracts

Sold by abstractors, title search vendors, and title agencies; bought by title insurers/agents, lenders, attorneys, and investors. Priced per property per search.

| Product | Price | Unit | Grade |
|---|---|---|---|
| Online current-owner search (U.S. Title Records) | from $29 flat | per property | published-price (vendor) |
| Simple residential search | $75 to $250 (most $100 to $200) | per property | reported-secondary |
| Standard residential full search | $200 to $400 | per property | reported-secondary |
| Complex residential | $300 to $600+ | per property | reported-secondary |
| Commercial title search | $1,000 to $2,500+ | per property | reported-secondary |
| Full abstract, residential, 40-60 yr, simple chain | $350 to $500+ | per abstract | published-price (Hawley, Jan 2026) |
| Full abstract, commercial, 40-60 yr | $750 to $1,200+ | per abstract | published-price (Hawley, Jan 2026) |
| Additional chain of title | $150 to $250 each | per chain | published-price (Hawley, Jan 2026) |

Paper versus digital counties: multiple 2025-2026 industry guides state the spread is driven by whether the county is digitized. Well-indexed digital counties price at the low end; rural paper-record counties require an abstractor physically at the courthouse, and that labor pushes searches toward the high end of each band. Rural counties, older urban counties, and states without recording standardization are named as the priciest search markets. This is consistent qualitative evidence; no source published a measured paper-vs-digital price delta (honest absence on the exact delta). Grade: reported-secondary.

Sources: ustitlerecords.com/title-search-cost/ (2026-08-07); TitleTrackr, blog.titletrackr.com/2025/09/22/how-much-is-a-title-search/ and /2025/10/27/how-much-is-title-search/ (2025-09/10); Rocket Mortgage title fees guide, rocketmortgage.com/learn/title-fees (2026-08-07); Harry W. Hawley Inc. abstract costs, hwhawley.com/abstract-costs/ (pricing stated as of Jan 2026); Blazer Title Search state fee guide, blazertitlesearch.com/how-much-does-a-title-search-cost-state-fees-explained (2025); Galadon pricing guide, galadon.com/cost-of-property-title-search (2025-2026).

## 3. Flood zone determinations / flood certs

Sold by Cotality (CoreLogic) Flood Services, ServiceLink National Flood, First American Flood Data Services, LERETA, CDS; bought by mortgage lenders and passed through to borrowers on the closing disclosure. Federally authorized as a chargeable fee (12 CFR 22.8 and parallels).

| Product | Price | Unit | Grade |
|---|---|---|---|
| Flood certification fee (borrower-facing, typically includes life-of-loan monitoring) | $15 to $30, most $15 to $25 | per loan/property, one-time | reported-secondary (consistent across multiple 2025 guides) |
| Wholesale bulk per-determination price to lenders | not publicly published | per determination | honest absence: vendors (Cotality, ServiceLink, LERETA) quote privately; no public price sheet found |
| Elevation certificate (different product, surveyor labor) | $500 to $1,000+ | per property | reported-secondary |

Sources: ezhomesearch.com/blog/flood-certification-fee-real-estate-guide/ (2025); goliathdata.com flood certification guide (2025); ratebeat.com/blog/decoding-the-flood-determination-fee-when-is-it-mandatory-and-can-it-be-waived (2025); 12 CFR 22.8, ecfr.gov/current/title-12/chapter-I/part-22/section-22.8 (current); LERETA flood products, totalflood.com/products.html (2026-08-07); detangle.ai/articles/flood-certification-fee (2025). All accessed 2026-08-07.

## 4. CRE due-diligence packages (records/data assembly portion, ESA excluded)

Honest absence on bundle list prices: LightBox, CREtelligent, Millman, and Partner-style shops all sell bundled due diligence (zoning + flood + records) on quote, with no published package pricing found. What can be measured is the component-sum a CRE buyer or lender actually pays per property for the records-assembly layer:

| Component (per commercial property) | Price band | Grade |
|---|---|---|
| Zoning report (lender-grade) | $550 to $1,500+ | published + reported (Section 1) |
| Commercial title search | $1,000 to $2,500+ | reported-secondary (Section 2) |
| Flood determination | $15 to $30 | reported-secondary (Section 3) |
| Municipal lien / permit search (where applicable) | $100 to $300 | published-price (Section 6) |
| Implied records-assembly total, excl. ESA/survey/PCA | roughly $1,700 to $4,300 | derived from the above |

Sources: cretelligent.com/zoning-reports/ and lightboxre.com/product/pzr/ (both confirm bundling, no prices; 2026-08-07); component sources as cited in their sections.

## 5. Parcel / property data subscriptions

| Product | Seller | Price | Unit | Grade |
|---|---|---|---|---|
| Nationwide parcel license, Standard schema | Regrid | $50,000 | per year | published-price (2023-01 price sheet) |
| Nationwide, Premium schema | Regrid | $80,000 | per year | published-price (2023) |
| Nationwide, Premium + building footprints | Regrid | $135,000 | per year | published-price (2023) |
| Nationwide, Premium + secondary addresses | Regrid | $125,000 | per year | published-price (2023) |
| State-level data | Regrid | $8,000 to $20,000 | per state | published-price (2023) |
| County-level data | Regrid | $150 (CSV std) / $300 (shapefile std) / $500 (premium) / $800 (premium + footprints); blog also cites $200 spreadsheet / $400 shapefile premium | per county, one-time | published-price (2023; datastore blog current) |
| Parcel API | Regrid | $0.10 to $0.28 | per record | published-price (2023) |
| PARLAY (Google Earth parcel layer) | ReportAll | $99.99 | per quarter, unlimited nationwide | published-price |
| Data Store access | ReportAll | $2.99/day or $49.99/month | subscription + per-county purchases | published-price |
| Property Navigator Professional | ATTOM | $499 | per year per seat | published-price |
| Property API entry tier | ATTOM | ~$95/month reported; ~$0.10 per API report at volume | per month / per report | reported-secondary (bulk licensing is custom-quote only) |
| Enterprise data contract | Cotality (CoreLogic) | ~$12,000 median | per year | reported-secondary (buyer-data aggregator; no public list) |
| Trestle API calls | Cotality | $0.005 to $11.50 (involuntary lien) | per call | reported-secondary |

Buyers across this category: proptech developers, lenders, insurers, GIS teams, investors, and government agencies. Note Regrid is the only major vendor publishing a full national-to-county price ladder.

Sources: regrid.com/blog/2023-parcel-data-price-change (2023-01-01 effective; fetched 2026-08-07); regrid.com/blog/datastore (fetched via search 2026-08-07); reportallusa.com/products/parlay, /store, /products/api (2026-08-07); homesage.ai and zillapi.com ATTOM pricing explainers (2026); datarade.ai/data-providers/attom/profile (2026-08-07); realestatetoolkit.ai/tools/corelogic/ (2026); propapis.com/platforms/global/cotality (2026-08-07).

## 6. Municipal lien searches / permit history searches

Sold per property. Two channels: third-party search firms (Florida Municipal Lien Search, PropLogix, Real Res, Elite Property Research) selling mainly to title agents and closing attorneys, and municipalities selling directly.

| Product | Seller | Price | Unit | Grade |
|---|---|---|---|---|
| Municipal lien search (taxes, utilities, code enforcement) | Florida Municipal Lien Search | $100 + gov fees | per property | published-price |
| Expanded lien search (adds open/expired permits, code violations) | Florida Municipal Lien Search | $125 + gov fees | per property | published-price |
| Third-party lien search, market floor | various FL vendors | from $85 | per property | reported-secondary |
| Direct municipal lien search | Cooper City, FL | $125 (eff. 2023-03-13) | per request | published-price |
| Direct municipal lien search | Highland Beach, FL | $175 (eff. 2024-10-01) | per parcel (PCN) | published-price |
| PropLogix lien search | PropLogix | quote-only; no public price | per property | honest absence |
| BuildFax property history (permit) report | BuildFax | $5 partner price stated as "more than 70% off public price" (implies public ~$17 to $20) | per report | reported-secondary |
| Permit database subscription | Buildchek | from $2.50 per report (no-hit free) | per report on subscription | published-price (vendor claim) |

Sources: floridamunicipalliensearch.com/pricing/ (fetched 2026-08-07); liensearchesplus.com/faqs.php and realres.com/municipal-lien-search-florida/ (2026-08-07); coopercity.gov municipal lien search page (eff. 2023-03-13); highlandbeach.us/309/Municipal-Lien-Searches (fee eff. 2024-10-01); proplogix.com/services/municipal-lien-search/ (2026-08-07); support.homegauge.com BuildFax reports article (2026); buildchek.com (2026-08-07).

## Is anything sold as a per-jurisdiction subscription for jurisdictional/zoning intelligence?

Effectively no, on the buyer side, and this is a finding. Zoneomics sells per-seat national subscriptions ($92 to $279 per month per user). ATTOM, Regrid, and ReportAll sell national or per-geography data licenses, but those are data files, not interpreted jurisdictional intelligence, and Regrid's per-county unit is a one-time download, not a subscription. UrbanForm advertises "multi-city plans" and multi-city discounts on its Pro and Enterprise tiers, which is the closest per-jurisdiction-shaped commercial offer found, but pricing is unpublished (custom quote) and coverage is limited to a small set of cities. Gridics CodeHUB and ZoneIQ are sold per city on quote, but to the municipality itself (the government pays to publish its own code; roughly 17 calibrated cities for ZoneIQ), not to developers or lenders as standing coverage. Chicago Cityscape operates a single-metro subscription for Chicago zoning intelligence but its pricing page returned 403 and no price could be verified. No vendor was found publishing a "$X per jurisdiction per year, buyer-side" price for maintained zoning/jurisdictional intelligence. Sources: zoneomics.com/pricing/subscription (2026-08-07); urbanform.us/pricing (2026-08-07); gridics.com/products/ and bimtoolshub.com/gridics (2026); chicagocityscape.com/professionalservices.php (403, 2026-08-07).

## Evidence-grade key

- **published-price**: a price printed on the seller's own site, fee schedule, or ordinance, read directly or via search index on the date given.
- **reported-secondary**: a price reported by a third party (industry blog, aggregator, buyer-data site, partner documentation), not confirmed on the seller's own price sheet.
- **anecdotal**: forum or hearsay figures. None of the figures above rest solely on this grade; where ranges came from practitioner-facing blogs they are graded reported-secondary.
- **honest absence**: searched and not found publicly; stated as such rather than estimated.

## Implications for a government list price

The market has already trained every buyer class to pay per property for assembled jurisdictional facts, and the anchors are surprisingly high for what is often a clerk reading a map: municipalities themselves charge $60 to $520 for a single-parcel zoning letter delivered in one to three weeks, and the private lender-grade equivalent clears $550 to $1,500 per property. A machine-assembled, cited, per-parcel intelligence product that answers what the ZVL and the PZR report answer sits under a per-property willingness-to-pay ceiling somewhere between the $100 municipal lien search and the $1,000 PZR report, with speed and citation quality being the differentiators that justify the upper half of that band. The floor is also visible: pure-data lookups (flood cert at $15 to $30, BuildFax permit report under $20, Regrid county CSV at $150) show that uninterpreted records command only tens of dollars. Interpretation, compliance framing, and lender acceptability are what multiply the price by 20 to 50x.

For per-jurisdiction pricing specifically, the white space is real: nobody sells buyer-side standing coverage of a jurisdiction, so there is no incumbent list price to undercut, but there are two usable triangulation points. Regrid prices a county's raw parcel layer at $300 to $800 one-time, and Zoneomics prices national interpreted access at roughly $1,100 to $3,350 per seat per year. A per-jurisdiction subscription for maintained, cited zoning and land-use intelligence plausibly lands between those anchors, in the low thousands per jurisdiction per year for a professional buyer, which is also consistent with what that buyer already spends on just two or three one-off zoning reports in that jurisdiction. The pitch writes itself against the incumbent unit economics: three PZR reports in one county costs more than a year of standing coverage.

The structural risk in the anchor set is that the highest prices are propped up by lender requirements (ALTA Table A, CMBS underwriting, mandatory flood certs), not by the intrinsic value of the data, so any product that is not yet lender-accepted competes at the discovery-and-diligence tier ($100 to $300 per property) rather than the closing-requirement tier ($550 to $1,500). Municipal fee schedules are the most defensible public comparables for a government-adjacent list price because they are statutory, dated, and per-parcel; the $150 to $350 big-city ZVL band is the single cleanest anchor for a per-answer price on verified zoning facts, and beating the municipality on turnaround (weeks to minutes) at or below its own fee is a defensible opening position.
