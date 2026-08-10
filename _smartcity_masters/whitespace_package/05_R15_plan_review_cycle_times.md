---
id: 2026-08-07_R15_plan_review_cycle_times
title: R15 — permit and plan-review cycle times, time decomposition, outsourced review economics, examiner labor market
status: research
date: 2026-08-07
applies_to: smartcity, bizops, pricing
source: Public-web research by dispatched subagent, 2026-08-07. Evidence grades labeled per claim ([M] measured-study / [G] government-document / [V] vendor-claim / [A] anecdotal-secondary). Research battery question 15 of 02_research_battery_coverage_and_pitfalls.md.
owner: nick
related: [2026-08-07_county_gis_coverage_and_gov_data_pitfalls, _smartcity_masters/33a_smartcity_plan_review, 01_category_whitespace_and_conviction_map, 14_pricing_framework]
---

# R15 — Permit and plan-review cycle times, decomposition, outsourced economics, and the examiner labor market

Research note, compiled 2026-08-07. Public-web sources only. Evidence grades: **[M]** measured-study, **[G]** government-document, **[V]** vendor-claim, **[A]** anecdotal/secondary.

## Bottom line

First-cycle commercial plan review in US cities averages about 19 business days (median 14) across a 669-city vendor dataset, but that number measures only the review step; an intake queue of 1 to 6 weeks typically precedes it, and 2 to 4 correction/resubmittal rounds of 2 to 6 weeks each typically follow it, which is how a "14-day review" becomes a multi-month permit. The best government-measured single-city figure is Seattle's 2023 audit: median 50 calendar days of city review time per application, with at least 10 percent exceeding 145 days. At the whole-process level, NAHB's 2026 national survey found 94.2 percent of land developers experience regulatory delay averaging roughly seven months. Nobody has published a decomposition of review time into information-retrieval versus professional judgment; the closest proxies (Seattle's round-by-round data, its finding that only 29 percent of correction comments were "necessary," and lean value-stream heuristics that touch time is 1 to 5 percent of lead time) all point the same direction: elapsed time is dominated by queueing, routing, and resubmission loops, not expert deliberation, but the retrieval-vs-judgment split itself is unmeasured. Outsourced review economics are well documented in public contracts: the dominant structures are percent-of-fee (75 to 80 percent of the city's plan review/permit fee retained by the vendor, per a public SAFEbuilt contract) and hourly ($98 to $145 per hour in 2024 documents), with named-city annual spend ranging from $100K (Evanston, review + inspection support) to $830K (Glenview, full department). The examiner labor market is contracting: the canonical ICC/NIBS survey projected 80 percent of code officials retiring within 15 years of 2014, and BLS projects the inspector occupation to shrink through 2034 with all ~14,800 annual openings being replacement hires.

## 1. Measured cycle times

**Distinguish three clocks.** (a) First plan review: submittal-complete to first comments. (b) Total review: all rounds, city clock only. (c) Permit issuance: application to permit in hand, including applicant response time. Sources below are labeled by which clock they measure.

### National first-review benchmark (clock a)

Permit Place "2026 Permit Speed Index," 669 cities in 44 states, built from the firm's own field-verified commercial plan-review projects (filtered to 5-90 business days, quarterly updates). [V] — large sample but a vendor's own project mix, commercial-skewed.

| Metric | Value |
|---|---|
| Average first commercial plan review | 19.2 business days |
| Median | 14 business days |
| Cities completing first review in <=14 business days | 51% |
| Cities taking >30 business days | 11% |
| Distribution | 5-10 days: 33% of cities; 11-14: 18%; 15-21: 24%; 22-30: 14%; 31-45: 5%; 46-60: 3%; 61-90: 3% |
| Intake queue before review begins | 1-6 weeks typical; 8+ weeks peak-season in SF/LA/NYC |

Source: permitplace.com/permit-speed-index/ (2026). The same page notes most projects run 2-4 resubmittal cycles at 2-6 weeks each.

### Government-measured city and state figures (clocks b and c)

| Jurisdiction | Figure | Clock | Grade | Source |
|---|---|---|---|---|
| Seattle (pop ~750K; ~8,800 construction permits issued 2022) | Median application spent **50 days in city review** (2021-22 data); >=10% took >=145 days, past WA's 120-day statute | b | [G] | Seattle Office of City Auditor, "City's Construction Permitting Needs More Customer Focus and Consistency," 2023-10-18 (seattle.gov ConstructionPermittingAudit_final.pdf) |
| Seattle, by round | Median actual review days by round: R1 **36** (target 49, met), R2 **27**, R3 **25**, R4 **22**, R5 **21** (target 14 for R2-5, all missed ~1.5-2x) | b | [G] | same audit, Exhibit 2 |
| Vancouver, WA | **96%** of land use and **93%** of building permit applications reviewed within the 120-day statutory limit (4-yr lookback) | b | [G] | WA State Auditor performance audit, 2024-04-02 |
| WA statewide (6 audited jurisdictions) | 120-day compliance for land use permits ranged from **>90% (two governments) down to 24%**; only 1/3 of WA local governments publicly report permit timeliness at all | b | [G] | WA SAO GMA performance audit, 2024-04 (sao.wa.gov PA_Growth_Management_Act_ar-1034439.pdf) |
| California statutory clock | Since 2023-01-01 (AB 2234), post-entitlement building permit review must return complete comments within **30 business days** (<=25 units) or **60 business days** (26+ units) | a | [G] | calbo.org/post/permitting-timelines |
| CA coastal vs typical US metro | ~**7 months** average to issue a building permit in CA coastal communities vs ~**4.5 months** typical US metro; LA Coastal Zone ADUs averaged **260 days** to permit vs **147 days** outside the zone | c | [M] | Terner Center (UC Berkeley), ADU coastal-zone study, 2024 |
| National, whole-process (developer survey) | **94.2%** of land developers report regulatory delay, averaging **~7 months**; **93.4%** of builders report construction-phase delay averaging just over 6 weeks; total regulation = $131,734 (26.4%) of a $499,500 avg new home | broader than c (all regulation, not plan review alone) | [M] | NAHB, "Government Regulation in the Price of a New Home: 2026," 2026-06-08 |
| Dallas | Median commercial new-construction permit wait reportedly cut from **276 days (2023) to 189 days (early 2025)** | c | [A] — secondary compilation, not verified against a city document | grokipedia.com compilation |

### By jurisdiction size

No rigorous, size-stratified measured study was found; say so plainly. The evidence that exists is directional: the Permit Speed Index attributes the longest intake queues (8+ weeks) specifically to the largest cities (SF, LA, NYC) [V]; vendor permitting guides consistently report small cities clearing residential permits in days-to-2-weeks while big-city commercial runs months [A]. The WA SAO audit's 24-to->90% compliance spread across six mid-size jurisdictions shows variance within a size class is as large as variance across classes [G]. Best honest framing: first-review time clusters at 1-3 weeks in small/mid jurisdictions and 4-12+ weeks in large ones, but the well-measured quantity is per-city, not per-size-band.

## 2. Where the time goes (decomposition)

**The direct answer: no public study decomposes plan-review time into information-retrieval versus professional judgment.** No NAHB, ICC, academic, or audit source measures "minutes spent looking up code provisions / prior records vs minutes exercising engineering judgment." That measurement does not exist in the public record as of this search. What exists are four partial decompositions, all pointing at process and queueing rather than deliberation:

1. **Queue vs touch.** The intake queue (1-6 weeks before anyone opens the drawings) can exceed the review itself [V] (Permit Place). Generic lean value-stream practice puts value-added touch time at **1-5% of lead time** in administrative processes [A]; a Lean Enterprise Institute government case reduced a building-permit wait "from a month to a day" purely by colocating departments in single-piece flow, i.e., the month was hand-off wait, not work [A].
2. **Rounds, not round length.** Seattle's audit shows the first round roughly meets target; the delay accumulates in rounds 2-5 (each running ~1.5-2x the 14-day target) and in the fact that **total review time is not tracked or managed at all** (reviewers are accountable only for individual rounds). Reviewer assignment itself slips: staff sometimes not assigned until near or past the target review date. Team round-counts vary 2x by discipline. [G]
3. **Correction-comment quality.** SDCI's own 2020 internal correction-letter audit found **only 29% of correction comments were "necessary"** for the project type reviewed, and 34% of surveyed applicants said reviewer feedback was unclear; 61% couldn't tell who to contact. Unnecessary and unclear comments generate the resubmittal rounds in item 2. [G] This is the closest public evidence that a large share of "review" output is low-judgment noise rather than expert findings.
4. **City clock vs applicant clock.** Portland's permit dashboard (updated weekly) publishes median/average business days split between city staff time and applicant response time per review type; the right decomposition structure, no static headline figure. [G] San Francisco publishes on-time-vs-target rates with a 75% goal. [G]

Implication for collateral: the retrieval-vs-judgment split is a greenfield measurement. Anyone can defensibly say "audits show the elapsed time is dominated by queues, routing, and repeated correction rounds rather than reviewer deliberation," citing Seattle and the queue data; no one can yet cite a percentage split, and claiming one would be fabrication.

## 3. Outsourced plan review economics

Public contracts and council documents give a clear picture. Three models dominate: percent-of-fee, hourly, and fixed-fee/deposit for large projects.

| City / doc | Vendor | Structure | Numbers | Grade | Source |
|---|---|---|---|---|---|
| Castle Pines, CO (Resolution 15-27, 2015 PSA) | SAFEbuilt | Percent of city fee | **Plan review: 75% of plan review fee; inspections: 80% of permit fee**; 80% of re-inspection and misc fees; projects >=$3M valuation get 5% reduction + cap; planning staff hourly $74-$145 | [G] | castlepinesco.gov Resolution-15-27 SAFEbuilt contract PDF |
| Same contract, SLA | SAFEbuilt | Turnaround commitments | First comments: <=5 working days residential; <=10 days commercial <$5M; <=15 days commercial >$5M | [G] | same |
| Downers Grove, IL (council motion, 2024-06-18) | SAFEbuilt + TPI | Hourly + annual budget cap | **$98/hour plan review**; expedited 1.5x (5-day) or 2x (3-day); Village budget **$160,000/yr total** for residential permit review, covered by permit fee revenue; CPI escalator | [G] | agendadocs.downers.us MOT_2024-10397 |
| SAFEbuilt reference clients (disclosed in the same 2024 proposal) | SAFEbuilt | Hourly, capped | **Glenview, IL $830K/yr** (entire building department since 2013); **Winnetka, IL $295K/yr**; **Morton Grove, IL $250,160/yr**; **Hampshire, IL $159K/yr**; **Evanston, IL $100K/yr** (plan review + inspections) | [G] for the document, [V] for self-reported figures | same, pp. 31-36 |
| Placer County, CA (large-project agreement) | Bureau Veritas | Fixed fee + hourly, applicant-funded deposit | Applicant deposits **1% of construction valuation** ($790,000 on a $79M project); **plan review fixed fee $81,600**; inspections **$115/hr, 2-hr minimum**; county adds **10% admin fee** | [G] | placer.ca.gov DocumentCenter 53860 |
| LaSalle County, IL (2026 committee action) | SafeBuilt | Percent of fee | SafeBuilt retains the permit fees it collects; county adds a 10% administrative charge | [A] — meeting coverage, not the contract | citizenportal.ai coverage |
| Market scale | SAFEbuilt | — | 1,700+ employees, services in 37 states + DC, ~1,900 communities served; private-equity owned (Riverside Company) | [V] | Downers Grove proposal |

Not found publicly: ICC Community Development Solutions and Interwest (now a SAFEbuilt company) rate sheets; SAFEbuilt's OMNIA cooperative-contract price file returned 403. The observed 75-80%-of-fee and ~$100/hr figures are consistent across the public documents.

## 4. Plans examiner labor market

| Finding | Grade | Source |
|---|---|---|
| **80%** of the code-official workforce expected to retire within 15 years; **30%+ within 5 years**; ~85% already over age 45 (2014 NIBS/ICC survey, published Feb 2015; the 15-year window closes 2029). Still the canonical figure ICC cites | [M] (dated) | ICC Building Safety Month materials |
| BLS projects construction/building inspector employment to **decline 1%, 147,600 (2024) to 146,500 (2034)**; ~**14,800 openings/yr, 100% replacement** (transfers + retirements), zero growth | [G] | bls.gov/ooh construction-and-building-inspectors |
| San Jose: building plan review team 8 vacancies; building inspection team 14 vacancies (21% vacancy rate), cited as directly slowing permits | [A] — local news reporting city statements (~2022-23) | patch.com San Jose coverage |
| Bay Area municipal vacancy context: Berkeley 19%, Vallejo 28% citywide (not examiner-specific) | [A] | CBS SF audit coverage |
| Maui County planning: 15 staff vacancies against a "relentless" workload (2026-03) | [A] | mauinow.com 2026-03-19 |

No national plans-examiner-specific vacancy-rate survey was found for 2023-2026; the evidence base is the 2014 retirement-cliff survey, BLS occupation-level projections, and city-by-city reporting.

## Usable as problem-scale context

Third-party figures safe to cite in market collateral as context about the problem (never as product outcomes):

1. **"94.2% of land developers report regulatory delays averaging roughly seven months"** — NAHB, Government Regulation in the Price of a New Home, June 2026 [M]. Caveat: covers all regulation, not plan review alone.
2. **"In Seattle, the median permit application spent 50 days in city review, and correction rounds 2-5 ran roughly double the city's own 14-day targets; the city's internal audit found only 29% of correction comments were necessary"** — Seattle Office of City Auditor, Oct 2023 [G]. The strongest single citation for "the delay is process, not judgment."
3. **"Median first commercial plan review across 669 US cities is 14 business days, but a 1-6 week intake queue typically precedes it and 2-4 resubmittal rounds follow it"** — Permit Place 2026 Permit Speed Index [V]; label as industry data, not government data.
4. **"Public contracts show cities paying outside firms 75-80% of their plan-review and permit fees, or ~$98-145/hour, with fully outsourced departments running $250K-$830K per year in named Chicago-suburb municipalities"** — Castle Pines CO contract (2015) and Downers Grove IL council record (2024) [G].
5. **"The code-official workforce is aging out: an ICC/NIBS survey projected 80% retiring within 15 years, and BLS projects the inspector occupation to shrink through 2034 with all ~14,800 annual openings being replacement hires"** — ICC/NIBS 2014 + BLS OOH 2024-34 [M]/[G]. Date-label the ICC figure (2014 survey) when using it.

One flag for collateral discipline: the retrieval-versus-judgment split has not been measured by anyone. That absence is itself citable ("no public study decomposes review time into look-up versus judgment"), and it is an opening to publish the first measured decomposition rather than a statistic to borrow.
