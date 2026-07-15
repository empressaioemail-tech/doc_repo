---
id: land_records_strategy
title: Texas Land Records Acquisition Strategy
status: draft
last_updated: 2026-07-15
applies_to: portfolio
related: [_land_records/source_rail_registry, _land_records/ingest_architecture, 80_adrs/adr_027_first_party_land_records_acquisition, 90_runbooks/pia_bulk_request_runbook, _land_records/risk_register]
owner: planner
---

# Texas Land Records Acquisition Strategy

## 1. Purpose and scope

**Purpose.** Define how Hauska acquires Texas county land records at substrate scale, with clean provenance and license metadata, without depending on TexasFile or any comparable aggregator.

**In scope.** County clerk official public records, appraisal district data, statewide parcel geometry, and the legal and cost mechanics of getting each at bulk.

**Out of scope.** OCR and extraction quality, atom schema internals (see `ingest_architecture`), commercial packaging, non-Texas jurisdictions.

## 2. Legal foundation

This section is the load-bearing part of the strategy. If any of it is wrong, the economics collapse.

### 2.1 The records are public and copyable

Local Government Code 191.006 provides that all records belonging to the office of the county clerk to which access is not otherwise restricted by law or court order are open to the public at all reasonable times, and that a member of the public may make a copy of any of the records. Source: https://law.justia.com/codes/texas/2017/local-government-code/title-6/subtitle-b/chapter-191/

This is the baseline. There is no discretionary gate on access to the official public records themselves.

### 2.2 Format determines price, and this is the whole game

Two different fee regimes apply depending on the format requested.

**Paper.** Government Code 552.265 provides that the charge for a paper copy made by a district or county clerk's office is the charge provided by Chapter 118 of the Local Government Code or other applicable law. Source: https://www.rcfp.org/open-government-guide/texas/

Under LGC 118.011(a)(4), noncertified paper copies run about $1.00 per page. Source: https://codes.findlaw.com/tx/local-government-code/loc-gov-t-sect-118-011/

**Non-paper.** LGC 118.011(e), current as of 2026-01-01, reads:

> A county clerk who provides a copy in a format other than paper of a record maintained by the clerk, including real property records, shall provide the copy and charge a fee in accordance with Sections 552.231 and 552.262, Government Code.

Source: https://codes.findlaw.com/tx/local-government-code/loc-gov-t-sect-118-011/

The phrase "including real property records" is the operative addition. It forecloses the argument that real property records sit outside the PIA cost regime.

### 2.3 Legislative history confirms the intent

The "including real property records" language arrived via SB 1547, 89th Legislature Regular Session, authored by Zaffirini, sponsored by Orr, effective immediately on 2025-06-20. Source: https://legiscan.com/TX/bill/SB1547/2025

The Senate Research Center bill analysis states that SB 1612 (2023) had included language allowing county clerks to charge $0.10 per page for electronic copies of real property records, that this fee significantly exceeds the actual cost of production and conflicts with existing laws regulating public records fees, that current law limits fees to the actual cost of producing records, and that SB 1547 removes the additional charge to restore the prior position. Source: https://capitol.texas.gov/tlodocs/89R/analysis/pdf/SB01547F.pdf

The Texas Land Title Association's 89th session report describes SB 1547 as resolving an issue where clerks could charge ten cents a page, in the context of maintaining title plants. Source: https://www.tlta.com/common/uploaded%20files/documents/texas_89th_LegislatureReport.pdf

Read plainly: the Legislature was told that per-page pricing on electronic real property records exceeds actual cost, conflicts with the PIA, and burdens plant maintenance. It agreed and removed it. That legislative posture is favorable to a bulk electronic requestor.

**[VERIFY]** This is the single most load-bearing legal claim in the doc set. Counsel should confirm the current codified text of 118.011(e), the effective date, and whether any 89th Legislature companion bill or special session action modified it. Note that statutes.capitol.texas.gov was still serving the pre-amendment text as of this research, with a publication-pending notice referencing SB 1547 and SB 2878. The FindLaw text current as of 2026-01-01 reflects the amendment.

### 2.4 What the PIA cost rules actually allow the clerk to charge

Government Code 552.262 directs the Attorney General to adopt cost rules. Those rules live at 1 Texas Administrative Code 70.3. Source: https://regulations.justia.com/states/texas/title-1/part-3/chapter-70/section-70-3/

The chargeable components:

| Component | Rate | Authority |
|---|---|---|
| Standard paper copy | $0.10 per page | 70.3(a)(1) |
| Nonstandard copy media | actual cost of the media | 70.3(a)(2) |
| Programming labor | $28.50 per hour, programming services only | 70.3(c)(1) |
| General labor (locate, compile, manipulate, reproduce) | $15.00 per hour | 70.3(d)(1) |
| Overhead | 20 percent of the labor charge | 70.3 |
| Computer utilization | client/server $2.20 per clock hour; PC or LAN $1.00 per clock hour | 70.3 |
| Miscellaneous supplies, postage, shipping | actual cost | 70.3(i), 70.3(j) |
| Sales tax | not chargeable | 70.3(k) |

Labor may not be charged for time an attorney or other reviewer spends determining whether exceptions apply or preparing an AG ruling request. Source: 70.3(d)(3), https://regulations.justia.com/states/texas/title-1/part-3/chapter-70/section-70-3/

The rule's own worked example: twenty minutes of programming is $28.50 x 0.20 = $5.70. Source: https://www.ci.crowley.tx.us/media/17881

### 2.5 Procedural rails and requestor protections

- **Itemized statement over $40.** If estimated charges exceed $40, the requestor gets a written itemized statement of estimated charges before work starts, and an opportunity to modify the request. Source: https://comptroller.texas.gov/about/policies/open-records/public-information-act.php
- **Programming or manipulation.** 552.231 governs when a request requires programming or manipulation of data. The body provides a written statement, generally within 20 days, including estimated cost and time. The body has no further obligation until the requestor states in writing that it wants to proceed. Source: https://www.rcfp.org/open-government-guide/texas/
- **Estimate drift.** The body must inform the requestor of changes in estimates above 20 percent of the original estimate and confirm acceptance in writing. Source: https://comptroller.texas.gov/about/policies/open-records/public-information-act.php
- **Deposits.** A body may require a bond or deposit where estimated charges exceed $100 for electronic copies or where programming or manipulation is required. Source: https://www.ethics.state.tx.us/contact/open-records/fees.php
- **Withdrawal trap.** A request is considered automatically withdrawn if the requestor does not respond in writing to the itemized statement within 10 business days. Source: https://www.ethics.state.tx.us/contact/open-records/fees.php This is an operational hazard. See `pia_bulk_request_runbook`.
- **Public interest waiver.** Under 552.267, charges may be waived or reduced where providing the copy primarily benefits the general public. Source: https://www.ethics.state.tx.us/contact/open-records/fees.php **[INFERENCE]** Probably not available to Hauska as a commercial requestor. Do not plan around it.
- **Overcharge complaint.** A written complaint about overcharges goes to the Office of the Attorney General, Open Government Hotline, 512-478-6737. Source: https://www.rrc.texas.gov/general-counsel/open-records/procedures-for-requesting-information/
- **Overcharge penalty.** LGC 118.801 provides that an officer who in bad faith demands and receives a higher fee than authorized is liable to the aggrieved person for four times the amount unlawfully demanded and received; in good faith, for the difference. Source: https://law.justia.com/codes/texas/2017/local-government-code/title-4/subtitle-b/chapter-118/

The overcharge complaint path plus the 4x bad-faith penalty is real leverage. It should be held in reserve, not led with. See `risk_register` risk R4.

### 2.6 The constraint that shapes the architecture

A governmental body is not required to comply with a continuing request to supply information on a periodic basis, or with a request for information that will be prepared in the future. Source: https://www.rrc.texas.gov/general-counsel/open-records/procedures-for-requesting-information/

There is no such thing as a standing PIA subscription. Every incremental delta requires a fresh, discrete request naming a closed date range of records that already exist.

This is not a minor operational detail. It means the ongoing feed for every county is a recurring request cycle, not a pipe. The ingest architecture must be built around scheduled discrete requests rather than streaming. See `ingest_architecture` section 3.

A governmental body is also not required to answer questions, perform legal research, or create new information in response to a request. Source: https://www.rrc.texas.gov/general-counsel/open-records/procedures-for-requesting-information/ Requests must therefore be framed as "produce the records that exist," never as "give us a report of."

### 2.7 The abstract plant question

TexasFile's Terms of Service state that information obtained from TexasFile may not be resold online or used for building title abstract plants as defined by the Texas Department of Insurance. Source: https://www.texasfile.com/about/tos

That is a contractual restriction TexasFile imposes on its users. It is not a restriction on what Hauska may build from first-party sources.

For reference, TDI Procedural Rule P-12 defines an abstract plant used as the basis for issuing title insurance policies as fully indexed records showing all instruments of record affecting lands within the county, covering a period beginning not later than 1979-01-01, geographically arranged, kept to current date, and including plat and map records, deeds, deeds of trust, mortgages, lis pendens, abstracts of judgment, federal tax liens, mechanic's liens, attachment liens, divorce actions involving real property, probate records, and related financing statements, where available for indexing from the county clerk's office. Source: https://www.tdi.texas.gov/title/documents/2012-36_Procedu.doc

Note also that the TDI Basic Manual states an abstract of title prepared from an abstract plant is not title insurance, not a commitment for title insurance, and not any other title insurance form. Source: https://www.tdi.texas.gov/title/titlem4a.html

**[INFERENCE]** The plant definition regulates who may be licensed as a title insurance agent, not who may assemble land records data. Hauska can build a plant-shaped dataset without being a plant, so long as it does not solicit title insurance, collect premiums, or issue or countersign policies. This inference is not verified and is flagged in `risk_register` as R6. Counsel review required before any title-adjacent positioning.

## 3. Why not TexasFile

TexasFile publishes no API. Its pricing is transactional: document image preview $2.00, image purchase $1.00 per page, search results export $0.10 per record, OCR plus PDF $0.25 per page, statewide search $5.00. Bulk exists only for mineral ownership data, at $500 per county roll and $2,500 to $20,000 for multi-county regional packages. Source: https://www.texasfile.com/pricing

Its Terms of Service state that retrieving information by any automated means is specifically prohibited, naming screen scraping, pulling images to avoid charges, and bulk downloading images as examples; that content accessed is the sole property of TexasFile and may not be copied, republished, redistributed, transmitted, altered, edited, or exploited for any purpose without prior written permission; and that information may not be resold online or used for building title abstract plants. Governing venue is Nueces County. Source: https://www.texasfile.com/about/tos

Three independent blockers: no technical rail, a contractual ban on the access pattern, and a contractual ban on the downstream use. There is no clever read of this. See `adr_027`.

One residual option: license negotiation. The existence of bulk mineral pricing proves TexasFile has a commercial bulk motion, just not a self-serve one. **[INFERENCE]** A direct licensing conversation is worth one call as a cost and timeline benchmark. Contact: support@texasfile.com, (214) 705-6400. It should not be a dependency, because a license from an aggregator reintroduces the exact chain-of-provenance problem the substrate exists to solve.

## 4. The provenance argument

This is not only a cost decision. Every Hauska atom carries provenance, confidence, citation, temporal validity, and license as self-describing metadata. That is a structural commitment, not a feature.

Data scraped from a source whose ToS forbids automated retrieval and forbids redistribution cannot carry a truthful license field. Data licensed from an aggregator carries the aggregator's license terms, not the county's, which means the atom's provenance chain terminates at a vendor rather than at the originating jurisdiction.

Only first-party acquisition from the county produces an atom whose provenance chain runs to the actual custodian of record, and whose license field can honestly say "public record, LGC 191.006, no downstream restriction." For a product being sold to municipalities and to title and legal professionals who will be asked where the data came from, that chain is the product.

## 5. Cost model

### 5.1 The comparison

Assume a mid-size county with 4 million document images at roughly 3 pages average. Taylor County reports over 4 million images requiring roughly 4 terabytes, having recorded over 29,000 documents in 2016. Source: https://www.taylorcounty.texas.gov/281/Official-Public-Real-Property-Records

**Per-page path:** 12 million pages x $1.00 = $12,000,000. Not a business.

**PIA electronic path, modeled:**

| Line | Basis | Modeled |
|---|---|---|
| Programming to export index and images | $28.50/hr x 8 hr | $228 |
| Labor to run and verify export | $15.00/hr x 16 hr | $240 |
| Overhead | 20% of labor | $94 |
| Computer utilization | client/server $2.20/clock hr x 40 hr | $88 |
| Media | actual cost, 4 TB on portable drives | ~$300 |
| Shipping | actual | ~$50 |
| **Modeled total** | | **~$1,000** |

**[INFERENCE]** Every hour estimate above is invented for illustration. The real numbers come from the clerk's itemized statement, and will vary by RMS vendor, county size, and how motivated the clerk is. Treat this table as a shape, not a forecast. The point is the ratio, roughly four orders of magnitude, not the absolute.

### 5.2 What actually drives cost variance

- **Redaction burden.** This is the biggest cost lever the clerk controls. Government Code 552.147 addresses social security numbers. HB 4350 (89th Legislature, effective 2025-06-20) requires a county clerk, on written request of a peace officer, to omit or redact SSN, driver's license number, and residence address from an instrument available in an online database made public by the clerk. Source: https://www.mortgagelaw.com/insights/89th-texas-legislature-weekly-update-6-23-2025/ Note under 70.3(d)(4) a labor charge may be recovered for time spent redacting confidential information mixed with public information on a page. If a clerk asserts page-by-page redaction review across millions of images, the labor line explodes. Mitigation: request the records in the same redaction state the clerk already publishes online, so no incremental redaction work is required.
- **RMS vendor.** Whether the clerk's records management system has a usable bulk export path. See `source_rail_registry` section 3.
- **Clerk disposition.** Wide variance. Sequencing matters more than negotiation. See section 6.

### 5.3 What is free

Substantial parts of the target dataset cost nothing. See `source_rail_registry`. Statewide parcel geometry from TxGIO StratMap is free. Many appraisal districts already publish full bulk appraisal roll downloads. Prioritizing these first produces a usable parcel-keyed spine before a single PIA dollar is spent.

## 6. Sequencing

The failure mode is filing 254 requests at once, getting 254 different answers, and having no playbook. Sequence deliberately.

**Phase 0, free data first.** Ingest TxGIO StratMap Land Parcels and Address Points statewide. Ingest the appraisal districts that already publish bulk downloads. This establishes the parcel key spine with zero acquisition cost and zero legal risk. It also produces a working demo before the hard part starts.

**Phase 1, anchor county.** Bastrop. There is an existing municipal deployment and an existing relationship with Sylvia Carrillo as the municipal network anchor. Run the full PIA cycle end to end in one county where a bad outcome is recoverable and a good outcome is referenceable. Produce the runbook from the actual experience, not from theory. See `pia_bulk_request_runbook`.

**Phase 2, playbook validation.** Two or three counties on different RMS vendors, deliberately chosen to test vendor variance rather than to maximize coverage. Confirm the request template survives contact with a Tyler shop, a Kofile shop, and a self-hosted shop.

**Phase 3, corridor.** Travis, Williamson, Hays, Bastrop, Caldwell. This is where existing development and GIS work already concentrates, and where the first commercial pull is most likely.

**Phase 4, Permian.** Reeves and the surrounding Permian counties, aligned to the existing oil and gas jurisdictional intelligence work.

**Phase 5, scale.** Remaining counties, prioritized by transaction volume rather than alphabetically.

Do not skip Phase 1. The runbook is the asset. The data is downstream of the runbook.

## 7. Open questions

1. **Does 118.011(e) as amended actually bind on a bulk request?** Counsel. Blocks capital commitment. `[VERIFY]`
2. **Do vendor-hosted records held by Tyler, Kofile, or GovOS remain subject to the PIA as records held for a governmental body, and can the clerk be compelled to produce them at PIA cost?** Counsel. Blocks Phase 2 scoping. This is the most likely place the strategy breaks. `[VERIFY]`
3. **Can Hauska assemble a plant-shaped dataset without triggering TDI licensing obligations, and does Hauska want to?** Counsel plus strategy. Blocks any title-adjacent positioning. Not urgent for Phase 0 through 2.
4. **What is the realistic redaction posture per county, and can requests be scoped to the already-published redaction state?** Operational, resolve empirically in Phase 1.
5. **Is there value in one TexasFile license conversation as a cost benchmark?** Operator call. Not a dependency.

## 8. Dependencies

- Legal counsel engagement covering questions 1 through 3. Nothing past Phase 1 should commit capital before question 2 is answered.
- Parcel key model from the existing substrate work, since the parcel is the universal join key.
- Storage and cost model for multi-terabyte image corpora at 254-county scale. Not addressed here. Route to `ingest_architecture`.

## 9. Cross references

- `_land_records/source_rail_registry` - what each rail yields and the per-county registry schema
- `_land_records/ingest_architecture` - pipeline and atom mapping
- `80_adrs/adr_027_first_party_land_records_acquisition` - the posture decision
- `90_runbooks/pia_bulk_request_runbook` - operational request workflow
- `_land_records/risk_register` - ranked risks

## 10. Revision history

- 2026-07-15, research session, initial draft from primary source research.
- 2026-07-15, reconciled into _land_records/ + adr_027 + 90_runbooks/; cross-references updated.
