---
id: 2026-08-26_p85_pia_letters
title: P-85 Public Information Act requests to six Central Texas county clerks (drafts for operator signature)
date: 2026-08-26
last_updated: 2026-08-26
status: draft
plan_row: P-85
applies_to: portfolio
related:
  - _inbox/2026-08-26_p85_central_texas_easements_WDLL.md
  - 80_adrs/adr_027_first_party_land_records_acquisition.md
  - _decisions/2026-08-26_p85_easements_studio_tier_and_six_counties.md
---

# P-85 PIA request letters

Drafts. Angle-bracket fields are placeholders the operator fills before sending. Mailing addresses marked `<verify>` were not confirmed from the clerk's own site this session; verify each against the clerk's website before sending. Send by the method each clerk's site names for public information requests (email, portal, or mail). Record the filed date, method, and any tracking number in the WDLL item 1 row.

Requester of record: Hauska Inc. (the substrate entity per ADR-008 and ADR-027). Signature: Nick.

## Scope note, 2026-08-26 (night)

The product broadened from easements to every recorded document tied to a parcel (`_decisions/2026-08-26_p85_records_request_scope.md`). Item 1 of the template already requests the whole real property index, all document types. Item 2 (images) stays scoped to easement, right-of-way, plat, and restriction instruments for the bulk request, because bulk images of every deed and lien are a different order of volume and cost; per-parcel images for other types are acquired on request by the product. Adjust item 2 before sending only if the operator wants bulk images of all types. The letters remain deferred until the operator chooses to send them.

## Statutory basis used in every letter

- Texas Government Code Chapter 552 (Public Information Act): request for public information; ten business days to produce or seek an Attorney General ruling (552.221, 552.301); itemised cost estimate required when charges exceed $40 (552.2615).
- Local Government Code 118.011(e), as amended by SB 1547 (89th Legislature, effective 2025-06-20): a county clerk providing a copy in a format other than paper of a record maintained by the clerk, including real property records, shall provide the copy and charge a fee in accordance with Government Code 552.231 and 552.262.
- 1 TAC 70.3 (Attorney General cost rules for copies of public information): the charge for electronic copies is the actual cost of the medium and labor as scheduled, not a per-page recording fee.
- Local Government Code 191.006: real property records are public and subject to copying.

## Template

```
<date>

<County> County Clerk
Attn: Public Information Officer / Recording Division
<mailing address, verify>
<email or portal, verify>

Re: Request for public information under Texas Government Code Chapter 552: electronic copies of the Official Public Records real property index and of recorded easement and plat instruments, priced under Local Government Code 118.011(e)

Dear County Clerk,

Under the Texas Public Information Act, Government Code Chapter 552, Hauska Inc. requests copies of the following public information maintained by your office, in electronic form.

1. The Official Public Records real property index, as electronic data, for instruments recorded from <start year, the first year your index exists electronically> through the date of production, containing for each instrument: instrument or document number; volume and page or cabinet and slide where applicable; recording date; document type; grantor and grantee names as indexed; the legal description text as indexed (subdivision, lot, block, abstract, survey, or metes-and-bounds reference where captured); and any cross-reference fields your index carries. Preferred format: a delimited text file (CSV) or a database export in the native format of your recording system, with a field list.

2. Electronic images of all instruments recorded from <start year of electronic images> through the date of production whose indexed document type is any of: EASEMENT, RIGHT OF WAY, PLAT, AMENDED PLAT, REPLAT, or a type your office uses for the same instruments, and any instrument indexed as an amendment, correction, or release of an instrument of those types. Preferred format: PDF or multi-page TIFF, one file per instrument, named by instrument number.

3. A statement of which document types your index uses for the instruments described in item 2, so this request can be matched to your office's vocabulary.

Pricing. Because these copies are in a format other than paper, Local Government Code 118.011(e), as amended by SB 1547 effective June 20, 2025, provides that the clerk "shall provide the copy and charge a fee in accordance with Sections 552.231 and 552.262, Government Code," and therefore the Attorney General's cost rules at 1 TAC 70.3, rather than a per-page recording fee. If the charge for this request will exceed $40, please provide the itemised written estimate required by Government Code 552.2615 before producing the records, and we will confirm in writing.

Standing access. Please also state whether your office offers a standing electronic subscription, bulk data service, or periodic export of the real property index or images, and the terms and cost. If so, we would prefer that path for ongoing updates after this initial production.

Redaction. We understand that images may be redacted as required by law. Please produce the index and images as your office provides them to the public, with the redactions your office applies.

Contact for this request: <name>, Hauska Inc., <email>, <phone>. Please direct any clarification, estimate, or ruling notice to that contact. Thank you.

Sincerely,

<signature>
Nick <surname>, <title>, Hauska Inc.
<address>
```

## County sheets

| County | FIPS | Office and contact (from the clerk's site unless marked) | Index and images | Method | Notes for the letter |
|---|---|---|---|---|---|
| Bastrop | 48021 | Bastrop County Clerk, 804 Pecan Street, Bastrop, TX 78602; 512-332-7236 | Aumentum Recorder Public Access (Harris Recording Solutions) at `cc.co.bastrop.tx.us/RealEstate`; login required; scanned images, no API | `<email or portal, verify>` | Existing county relationship (Bastrop is the gold county). Ask whether the Aumentum system supports a data export; ask for start years of the electronic index and images |
| Travis | 48453 | Travis County Clerk, Recording Division, 5501 Airport Blvd, Austin, TX 78751; (512) 854-9188 | `tccsearch.org`; index mid-1980s to present, updated every 24 hours; redacted images December 2005 to present; $1.00 per page for emailed copies today | `<email or portal, verify>` | Cite 118.011(e) explicitly against the $1.00 per page electronic fee; request the index as data, not as search results |
| Williamson | 48491 | Williamson County Clerk, 1848 Texas Trail, Georgetown, TX 78626; 512-943-1515 (not the District Clerk at 405 M.L.K. St) | TylerHost Official Public Records Search plus a `publicsearch.us` instance | `<email or portal, verify>` | Round Rock and Cedar Park city easement layers carry recordation numbers into this index; ask for the document-type vocabulary so those can be matched |
| Hays | 48209 | Hays County Clerk, Records Division, 712 S Stagecoach Trail, Suite 2008, San Marcos, TX 78666; (512) 393-7738; `recordsdivision@hayscountytx.gov` (from the county site; verify) | `erss.co.hays.tx.us` self-service (Tyler); 1848 to present; $1.00 per page, 24x36 plat $5.00 | email | Plats are large-format; ask for electronic plat images at 118.011(e) cost rather than the $5.00 paper plat fee |
| Caldwell | 48055 | Caldwell County Clerk, 110 S. Main Street, Suite 100, Lockhart, TX 78644; (512) 398-1806 | Web index by grantor, grantee, document type, date range; vendor not confirmed (county site refused automated fetch); a third-party page claims a records subscription exists, unconfirmed | mail or phone first, `<verify>` | Call before mailing; confirm the public information officer and whether a subscription exists; smallest county, likely fastest response |
| McLennan | 48309 | McLennan County Clerk, `<mailing address, verify at mclennan.gov/166>`, Waco, TX; (254) 757-5078 | Electronic records January 1, 1996 forward (1849 to 1995 in book volumes); Online Records Search on the county site | `<email or portal, verify>` | Request electronic index and images from 1996 forward; ask whether pre-1996 plats have been imaged; the CAD's easement linework carries partial document numbers that this index will resolve |

## After sending

Record per county in the WDLL item 1 row: date sent, method, acknowledgement date, the ten-business-day deadline, estimate received (amount, basis), production received (format, counts), and any Attorney General ruling request the clerk files. A clerk that quotes per-page recording fees for electronic copies is answered with the statute text above and, if unresolved, a cost complaint to the Attorney General under 552.269; that is a recorded step, not an argument in email.
