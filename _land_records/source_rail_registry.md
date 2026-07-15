---
id: land_records_source_rail_registry
title: Texas Land Records Source Rails and County Registry
status: draft
last_updated: 2026-07-15
applies_to: portfolio
related: [_land_records/strategy, _land_records/ingest_architecture, 90_runbooks/pia_bulk_request_runbook, _land_records/risk_register]
owner: planner
---

# Source Rails and County Registry

## 1. Purpose and scope

**Purpose.** Enumerate the distinct source rails that together reconstruct what TexasFile aggregates, and define the per-county registry that drives acquisition.

**In scope.** What each rail yields, its legal regime, its cost, its coverage, and how the rails join.

**Out of scope.** Pipeline mechanics (see `ingest_architecture`), request procedure (see `pia_bulk_request_runbook`).

## 2. The four rails at a glance

TexasFile is not one dataset. It is four, joined. Rebuilding it means rebuilding each rail on its own legal and commercial terms.

| Rail | Source | Yields | Legal regime | Cost | Coverage |
|---|---|---|---|---|---|
| A. Clerk OPR | 254 county clerks | Deeds, liens, leases, assignments, easements, plats, probate. Index plus images. | LGC 191.006, 118.011(e), PIA cost rules | PIA cost, modeled low four figures per county | 254 counties, coverage dates vary |
| B. CAD | ~253 appraisal districts | Ownership, valuation, land use, legal description, mineral interests | Tax Code, PIA; many already publish free bulk | Free to low | Near statewide |
| C. Parcel geometry | TxGIO StratMap | Parcel polygons, address points, standardized schema | Free public distribution | $0 | 245+ appraisal districts |
| D. Adjacent state | RRC, SOS UCC, Comptroller | Oil and gas, UCC filings, tax entity data | Open data and bulk order | $0 to low | Statewide |

Rail C is the spine. Rail B hangs off it. Rail A is the hard part and the moat. Rail D is already partly in flight.

## 3. Rail A, county clerk official public records

### 3.1 What it is

County clerks serve as county recorder under Article V Section 20 of the Texas Constitution and LGC 191.001. The clerk must record the contents of each instrument filed and keep the records properly indexed. Source: https://law.justia.com/codes/texas/2017/local-government-code/title-6/subtitle-b/chapter-191/

Record types run well past deeds. Taylor County describes over 34 document types including deeds, deeds of trust, warranty deeds, oil and gas leases, bills of sale, deed restrictions, homestead designations, powers of attorney, and releases, plus the Official Public Record additions of abstracts of judgment, assumed name certificates, state and federal tax liens, plats, occupational bonds, mechanic's liens, livestock brands, and state water permits. Source: https://www.taylorcounty.texas.gov/281/Official-Public-Real-Property-Records

### 3.2 Coverage depth varies enormously and this is a data quality problem, not a nuisance

Taylor County: all records digitized; property records indexed 1972 to present; all other Official Public Record content indexed back to county inception in 1878; pre-1972 property records indexed as staff time permits. Source: https://www.taylorcounty.texas.gov/281/Official-Public-Real-Property-Records

Walker County: Official Public Record begins 1986-01-01; online index plus image 1960 to present; 1846 to 1960 image only, requiring volume and page. Source: https://www.co.walker.tx.us/department/division.php?structureid=104

Travis County via Tyler iDoc Market: documents recorded since 1982-01-01. Source: https://www.searchsystems.net/us/tx/recorded-documents

The pattern: a recent fully-indexed era, an older image-only era, and a paper or microfilm era beneath that. The registry must capture all three boundaries per county, because they determine whether a chain of title can actually be built or only partially built. This is exactly the kind of fact that must live in atom temporal validity and coverage metadata rather than being silently averaged away.

### 3.3 The RMS vendor layer

Clerks run records management systems from a small set of vendors. The vendor determines whether bulk export is a config option or a project.

Observed vendors:

- **Tyler Technologies.** iDoc Market, used by Travis County among others. Also operates tx.countygovernmentrecords.com as a multi-county search site. Sources: https://www.searchsystems.net/us/tx/recorded-documents, https://tx.countygovernmentrecords.com/texas/web/
- **Kofile Technologies.** Vanguard records management software. Walker County describes itself as the 15th Texas county clerk office to deploy it. Source: https://www.co.walker.tx.us/department/division.php?structureid=104
- **Self-hosted or legacy.** Fort Bend runs ccweb.co.fort-bend.tx.us; Harris runs cclerk.hctx.net. Sources: https://www.fortbendcountytx.gov/sites/default/files/document-central/document-central/county-clerk-documents/faq/County-Clerk--Official-Public-Records-Frequently-Asked-Questions.pdf, https://www.cclerk.hctx.net/RealProperty.aspx

**[VERIFY]** Whether records held in a vendor-hosted system remain subject to PIA production at PIA cost is open question 2 in `strategy`. This is the highest-consequence unknown in the entire strategy. If a clerk can say "Tyler holds it, ask Tyler, and Tyler charges commercially," Rail A economics change materially.

### 3.4 Do not confuse e-recording with retrieval

E-recording vendors submit documents *into* the clerk. They are not a retrieval path *out*.

Under LGC 195.003 only certain classes may file electronically: licensed Texas attorneys, banks and savings institutions and credit unions, federally chartered lending institutions and federal government-sponsored entities and approved mortgagees, licensed regulated lenders, licensed title insurance companies and agents, and state agencies. Source: https://law.justia.com/codes/texas/2005/lg/006.00.000195.00.html

Authorized e-recorders for Travis County include Corporation Service Company, eRecording Partners Network, Indecomm Global Service, and Four Tier Software. Source: https://countyclerk.traviscountytx.gov/departments/recording/real-property/

Tarrant County notes it has led Texas e-recording since 2004 and records 86 percent of land record documents electronically, and that becoming an authorized eRecorder requires filing at least two to three hundred documents per month or meeting LGC 195.003 requirements, plus a standing escrow account. Source: https://www.tarrantcountytx.gov/en/county-clerk/real-estate-records/erecording.html

**[INFERENCE]** Hauska has no e-recording use case and would not qualify under 195.003 anyway. Note this rail only so the planning agent does not waste a sprint on it. The one genuinely useful fact here is the 86 percent electronic origination rate in Tarrant, which implies most recent instruments exist as born-digital documents rather than scans, which materially improves OCR-free extraction prospects for recent vintages. Verify per county.

### 3.5 Rail A acquisition posture

PIA request for electronic copies, priced under 118.011(e) and 1 TAC 70.3. Two components:

1. **Index export.** The structured index: instrument number, recording date, document type, grantor, grantee, legal description, book/volume/page, related instruments. This is a database export. Low programming cost, high value. Get this first, always.
2. **Image corpus.** The document images. High media cost, high labor cost, and the redaction fight lives here.

Requesting the index alone first is strictly better: it is cheap, it is fast, it establishes the working relationship with the clerk, and it alone unlocks a substantial share of the product surface. Images can follow per county once the index proves value.

## 4. Rail B, appraisal district data

### 4.1 It is often already free

Several CADs publish full bulk downloads with no request required.

El Paso CAD publishes current-year appraisal roll, real estate, and personal property data files, plus codes and listings files, described as intended for development use. Source: https://epcad.org/OpenGovernment

Tarrant CAD publishes data downloads including a property data file with a delimited pipe-separated variant, a PropertyLocation file, mineral appraisal rolls by year in PDF, TXT, and record layout form back to 2019, residential comp attribute data by year, agent summary data revised weekly, and GIS coverage in ESRI shapefile and file geodatabase format. Source: https://www.tad.org/resources/data-downloads

**[INFERENCE]** The planning agent should assume a meaningful fraction of the 253 CADs already publish bulk, and that the registry population task is largely a discovery exercise rather than a negotiation. Verify empirically; do not assume a number.

### 4.2 There is a statewide standard schema, and this is a gift

Appraisal districts must provide appraisal roll information to the Comptroller in a standard electronic format called the Electronic Appraisal Roll Submission, or EARS, accompanied by Form 50-792 signed by the chief appraiser certifying a true and correct appraisal roll, submitted via secured SFTP. Tax Code 5.03 allows the Comptroller to require electronic submission, and Tax Code 26.01(b) requires chief appraisers to certify appraisal rolls to the Comptroller. Source: https://comptroller.texas.gov/taxes/property-tax/data-submissions.php

The EARS Record Layout and Instructions Manual is published and defines field-level structure including AJR records per property category per taxing unit, category codes, and translation guidance where a district uses different category codes. Source: https://traviscad.org/wp-content/uploads/Electronic-Appraisal-Roll-Submission-Record-Layout-and-Instructions-Manual.pdf

The Comptroller has published an EARS Summary of Record Layout Changes covering 2020 through 2026. Deadlines: 2026 EARS due Aug 1 for districts with 10,000 to 200,000 taxable parcels excluding Category G, and Sept 1 for districts under 10,000 or over 200,000. Source: https://comptroller.texas.gov/taxes/property-tax/newsletter/

**This is the normalization target.** Do not invent a CAD schema. Every district in Texas already conforms its appraisal roll to EARS once a year, under a signed certification. Normalizing Rail B to the EARS layout means normalizing to a schema the sources already produce, with a documented change history and an official record layout manual. That is the cheapest normalization decision available and it comes with provenance built in.

### 4.3 There is a companion sales dataset, with a catch

Tax Code 5.07(c) requires appraisal districts to collect and maintain real property sales information, submitted annually to the Comptroller as the Electronic Property Transaction Submission, or EPTS, in a prescribed format with Form 50-793. EPTS is due Aug 1 for all appraisal districts and must include all property transaction records in their possession. Source: https://comptroller.texas.gov/taxes/property-tax/data-submissions.php

**[INFERENCE, IMPORTANT]** Texas is a non-disclosure state for sales prices. Sales price data reported to a CAD is very likely confidential and not obtainable via PIA. This has not been verified in this research and is flagged in `risk_register` as R7. Do not plan a comp or valuation product surface on EPTS until counsel confirms. If it is confidential, this is a permanent structural gap in any Texas land data product, including TexasFile's, and should be treated as a shared industry constraint rather than a competitive disadvantage.

### 4.4 Statutory publication limits to respect

Tax Code 25.027 provides that information in appraisal records may not be posted on the internet if it is a photograph, sketch, or floor plan of an improvement designed primarily for use as a human residence, or if it indicates the age of a property owner including that an owner is 65 or older. An aerial photograph depicting five or more separately owned buildings is excepted. Source: https://statutes.capitol.texas.gov/Docs/TX/htm/TX.25.htm

Tarrant CAD explicitly notes its site excludes over-65 exemption information per 25.027. Source: https://www.tad.org/resources/data-downloads

Note the scope: 25.027 restricts *posting on the internet*, not possession. **[INFERENCE]** Hauska may hold this data but must gate it out of any public-facing surface. That is a display-layer rule, and it maps cleanly to atom-level license and visibility metadata rather than to ingest filtering. Verify with counsel before relying on the possession/publication distinction.

Also note Tax Code 25.025 and 25.026 restrict certain home address information and shelter center addresses. Source: https://statutes.capitol.texas.gov/Docs/TX/htm/TX.25.htm

## 5. Rail C, parcel geometry, free and standardized

TxGIO, formerly TNRIS, compiles a statewide standardized GIS land parcel schema. Data contributed by county appraisal districts or their service providers is translated into a common schema and published on the TxGIO DataHub. TxGIO collects these data to allow end users to acquire statewide land parcel data in one location at no cost. Delivery is shapefile and geodatabase, with metadata and conversion files. TxGIO does not edit the geometry. Refresh is attempted annually and varies across the state; some counties refresh multiple times per year. Source: https://tnris.org/stratmap/land-parcels.html

StratMap outputs land parcels from more than 245 appraisal districts and approximately 10 million address points across Texas. The target schema was developed with input from more than 30 Texas stakeholders. Source: https://www.esri.com/about/newsroom/arcuser/tnis

Address points are also free, sourced from 9-1-1 coordinators across Texas via CSEC and the Texas 9-1-1 Alliance as authorized aggregators. Source: https://tnris.org/stratmap/address-points

Access: https://data.tnris.org/ and a mirrored ArcGIS item at https://www.arcgis.com/home/item.html?id=3b262ce74a864836972188fca772ca48

**Caveats that must land in atom metadata, not be discarded:**

- Not all counties are available. Source: https://tnris.org/stratmap/land-parcels.html
- Data is received as-is; if data are missing, they were not shared. Source: https://txwaterdatahub.org/dataset/stratmap-land-parcels
- Explicitly not survey grade and not to be used for legal purposes. Source: https://tnris.org/stratmap/land-parcels.html
- Refresh rate varies by county, so temporal validity is per-county, not global.

The "not survey grade, not for legal purposes" disclaimer is precisely the kind of fact that a confidence field and a license field exist to carry. A parcel polygon from StratMap and a metes-and-bounds legal description from a recorded deed are not the same claim and must not collapse into one atom.

**Sequencing note.** Rail C is free, statewide, standardized, and already partially in hand from the existing Travis County and TCAD ArcGIS REST work. It is the parcel key spine. Do it first.

## 6. Rail D, adjacent state sources

- **RRC.** Oil and gas. Already in flight per the Reeves County and Permian work. Open records procedures at https://www.rrc.texas.gov/general-counsel/open-records/procedures-for-requesting-information/
- **SOS UCC bulk.** Two products via the SOS Portal bulk order: Master Unload, a snapshot of the entire database created the first weekend following the end of the previous month; and Daily Filing Update, containing the entire database updates for a specific day. Files are JSON. Requires an SOS Portal account. Bulk order files are available to download 30 days after the order is placed. Contact ucc_assist@sos.texas.gov. Source: https://www.sos.state.tx.us/ucc/bulk-order.shtml

  This is notable: SOS has built exactly the snapshot-plus-daily-delta model that the county clerks have not. It is a useful architectural precedent and a useful thing to point a clerk at.

- **Comptroller public data API.** Franchise tax and sales tax payer endpoints under an x-api-key at api.comptroller.texas.gov, plus open data table endpoints and signed-URL file download. Source: https://api-doc.comptroller.texas.gov/
- **Comptroller CAD directory.** Contact information for appraisal districts and county tax offices, with taxing unit codes. This is the seed list for the Rail B registry. Source: https://comptroller.texas.gov/taxes/property-tax/county-directory/
- **County courthouse directory.** TexasFile publishes a county directory at https://www.texasfile.com/texas-deed-records-directory/ **[INFERENCE]** Using a competitor's directory as a seed list is unwise given their ToS. Use the Comptroller directory and the Texas State Library sources instead.

## 7. Per-county registry schema

This is the artifact the planning agent should scope as a discrete task. 254 rows. Populating it is Phase 0 work and it gates everything else.

```yaml
county_registry_entry:
  # identity
  county_fips: string            # 5-digit
  county_name: string

  # rail A, clerk
  clerk_office_name: string
  clerk_pio_contact: {name, email, phone, mailing_address}
  rms_vendor: enum [tyler_idocmarket, tyler_eagle, kofile_vanguard, govos, self_hosted, unknown]
  public_search_url: string
  opr_start_date: date           # when the Official Public Record begins
  index_coverage_start: date     # earliest fully indexed
  image_coverage_start: date     # earliest imaged
  image_only_range: {start, end} # image without index
  paper_or_microfilm_only_before: date
  erecording_pct: float          # if published; proxy for born-digital share
  published_fee_schedule_url: string
  online_redaction_posture: string
  pia_request_procedure_url: string

  # rail A, request state machine
  request_status: enum [not_started, index_requested, index_itemized, index_paid,
                        index_received, images_requested, images_itemized,
                        images_paid, images_received, refused, disputed]
  request_filed_date: date
  itemized_statement_received_date: date
  itemized_response_due_date: date       # +10 business days, HARD DEADLINE
  quoted_cost: money
  quote_line_items: list
  quote_variance_from_model: float
  ag_ruling_requested: bool
  ag_ruling_id: string
  notes: text

  # rail B, CAD
  cad_name: string
  cad_contact: {name, email, phone}
  cad_bulk_download_url: string | null
  cad_bulk_is_free: bool
  cad_formats: list              # csv, pipe_delimited, txt, shapefile, gdb
  cad_ears_conformant: bool
  cad_refresh_cadence: string
  cad_gis_url: string | null

  # rail C, parcels
  stratmap_parcel_available: bool
  stratmap_last_refresh: date
  stratmap_attribute_completeness: float
  cad_direct_arcgis_rest_url: string | null   # prefer over StratMap where fresher

  # derived
  acquisition_phase: enum [0,1,2,3,4,5]
  priority_score: float
  blocked_by: list
```

**Registry design notes for the planning agent:**

- `itemized_response_due_date` is the single most dangerous field. A request is automatically withdrawn if the requestor does not respond in writing to the itemized statement within 10 business days. Source: https://www.ethics.state.tx.us/contact/open-records/fees.php Missing it means refiling from zero. This field needs alerting, not just storage.
- `quote_variance_from_model` is the dispute trigger. A quote far above the modeled PIA cost is the signal to escalate, not to pay.
- `cad_direct_arcgis_rest_url` should be preferred over StratMap where a CAD publishes live REST, because StratMap refresh is annual and lags. The existing TCAD ArcGIS REST work is the template.
- Populate rails B and C for all 254 before filing a single rail A request. The free data tells you which counties are worth the fight.

## 8. How the rails join

The parcel is the universal join key. That is settled substrate doctrine and this doc does not relitigate it.

Practical joins:

- **Rail C to Rail B:** parcel polygon to CAD account number. Native, since StratMap parcels originate from CAD CAMA systems. Source: https://tnris.org/stratmap/land-parcels.html
- **Rail B to Rail A:** CAD legal description and owner name to clerk index legal description and grantee name. This is the hard join. It is fuzzy, it is where the data quality work lives, and it is where an AI-native substrate has genuine advantage over a keyword index. TexasFile's own AI positioning names legal description extraction as supporting smarter linking and chain-of-title research. Source: https://www.texasfile.com/texas-land-records-data-features/ai-and-data/ That tells you where the industry believes the value is.
- **Rail A internal:** instrument to instrument, via grantor/grantee chaining and referenced volume/page. This is chain of title.
- **Rail D to Rail C:** RRC lease and unit geometry to parcel.

**[INFERENCE]** The Rail B to Rail A join is the actual moat. Every rail individually is commodity public data. The join, done well, parcel-keyed, with provenance and confidence carried per claim, is the product. Plan sprint effort accordingly: acquisition is a solved problem once the runbook exists; the join is not.

## 9. Open questions

1. Vendor-hosted record production under PIA. Blocks Rail A scoping. Counsel. See `strategy` question 2.
2. EPTS sales price confidentiality. Blocks any comp or valuation surface. Counsel. See `risk_register` R7.
3. Tax Code 25.027 possession versus publication distinction. Blocks public surface design. Counsel.
4. Actual count of CADs publishing free bulk. Empirical, Phase 0.
5. Whether EARS files themselves are obtainable from the Comptroller in bulk, which would collapse 253 CAD relationships into one. **[INFERENCE]** Likely worth one email to ptad.ears@cpa.texas.gov. High leverage if it works.

## 10. Cross references

- `_land_records/strategy` - legal foundation and cost model
- `_land_records/ingest_architecture` - pipeline and atom mapping
- `90_runbooks/pia_bulk_request_runbook` - request workflow

## 11. Revision history

- 2026-07-15, research session, initial draft.
- 2026-07-15, reconciled into _land_records/ + adr_027 + 90_runbooks/; cross-references updated.
