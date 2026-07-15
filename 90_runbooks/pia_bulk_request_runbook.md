---
id: pia_bulk_request_runbook
title: Runbook, PIA Bulk Request to a Texas County Clerk
status: draft
last_updated: 2026-07-15
applies_to: portfolio
related: [_land_records/strategy, _land_records/source_rail_registry, 80_adrs/adr_027_first_party_land_records_acquisition, _land_records/risk_register]
owner: planner
---

# Runbook: PIA bulk request to a Texas county clerk

Draft. This runbook is written from research, not from experience. It must be rewritten after the Bastrop Phase 1 cycle. Treat v1 as a hypothesis.

## 1. Purpose and scope

**Purpose.** The operational sequence for acquiring a county's electronic land records under the Public Information Act.

**In scope.** Request scoping, letter templates, the state machine, escalation.

**Out of scope.** Legal strategy (`strategy`), ingest (`ingest_architecture`).

## 2. Before you file

**Preconditions. Do not file until all are true.**

1. Counsel has confirmed LGC 118.011(e) binds as read. See `strategy` open question 1. **This gates every request.**
2. Registry entry for the county is populated: PIO contact, RMS vendor, coverage dates, published fee schedule, PIA procedure page. See `source_rail_registry` section 7.
3. Rail B and Rail C for this county are already ingested. Free data first. You need to know the county is worth the fight.
4. Someone owns the 10 business day response clock and has calendar alerting configured.

**Identify the right recipient.** Government Code 552.201 provides that the chief administrative officer of a governmental body is the officer for public information, except that each elected county officer is the officer for public information for the information in that officer's custody. Source: https://law.onecle.com/texas/government/title-5/subtitle-a/chapter-552/

For clerk records this means the county clerk personally, not a county-level PIO. Address it correctly the first time.

**Follow their published procedure.** Many counties publish a PIA request procedure. Submit by mail, fax, email, or in person according to the governmental body's reasonable procedures. Source: https://www.sos.state.tx.us/records.shtml Deviating from the published procedure gives a free reason to reset the clock.

## 3. Scoping rules

These are the rules that decide whether a request succeeds or generates a $200,000 quote.

**Rule 1. Ask for records, never for reports.** A governmental body is not required to answer questions, perform legal research, or create new information. Source: https://www.rrc.texas.gov/general-counsel/open-records/procedures-for-requesting-information/ Frame everything as production of existing records.

**Rule 2. Say "in a format other than paper" explicitly and cite 118.011(e).** This is the whole ballgame. If the request does not clearly invoke the non-paper format, the clerk defaults to Chapter 118 per-page pricing under Government Code 552.265 and quotes you $1 per page. Source: https://www.rcfp.org/open-government-guide/texas/

**Rule 3. Ask for the export the system already produces.** Do not specify a schema, a file format you invented, or a transformation. Ask for the standard export from their records management system in whatever native format it emits. Every transformation you request is programmer time at $28.50/hr that you will be billed for, and it is also a lever for an infeasibility claim under 552.231.

**Rule 4. Request the records in their existing redaction state.** This is the single biggest cost control. Ask for the records as already published on the clerk's public search site, with whatever redactions are already applied. A labor charge may be recovered for time spent redacting confidential information mixed with public information. Source: 1 TAC 70.3(d)(4), https://regulations.justia.com/states/texas/title-1/part-3/chapter-70/section-70-3/ If the clerk has to do fresh page-by-page redaction review across millions of images, the labor line will exceed the entire modeled budget by orders of magnitude. If the records are already public online in a given state, producing them in that same state requires no incremental redaction work. Make that explicit in the letter.

**Rule 5. Index first, images second, as two separate requests.** The index is cheap, fast, structurally valuable, and low-risk. It also establishes a working relationship before you ask for four terabytes. Never bundle them.

**Rule 6. Name a closed date range.** Never "and all future records." A body is not required to comply with a continuing request or a request for information prepared in the future. Source: https://www.rrc.texas.gov/general-counsel/open-records/procedures-for-requesting-information/ A request with a forward-looking component invites a full refusal rather than a partial one.

**Rule 7. Offer to supply the media.** Media is billed at actual cost under 70.3(a)(2). Offering to ship new sealed drives removes a line item and a procurement excuse. Expect some clerks to refuse on security grounds. Ask anyway.

**Rule 8. State the deposit willingness up front.** A body may require a bond or deposit where estimated charges exceed $100 for electronic copies or where programming or manipulation is required. Source: https://www.ethics.state.tx.us/contact/open-records/fees.php Pre-empting this removes a delay cycle.

## 4. Template A, index request

> [Date]
>
> [County Clerk Name]
> [County] County Clerk
> [Address]
>
> Re: Request for public information in electronic format, real property records index
>
> Dear Clerk [Name]:
>
> This is a request under Chapter 552 of the Texas Government Code.
>
> I request a copy, in a format other than paper, of the real property records index maintained by your office for the period [START DATE] through [END DATE]. Specifically, I request the standard electronic export produced by your records management system containing the indexed fields for each recorded instrument, including instrument number, recording date, document type, grantor name, grantee name, legal description as indexed, and book/volume/page reference.
>
> I request this information in whatever native electronic format your records management system produces without modification. I am not requesting that any report be created, that any data be reformatted, or that any new information be compiled. I am requesting a copy of records that already exist.
>
> I request these records in the same redaction state in which they are currently made available to the public through your office's online records search at [URL]. No additional redaction work should be necessary, as I am requesting no more than what your office already publishes.
>
> Because this request is for a copy in a format other than paper, Section 118.011(e) of the Local Government Code requires that the copy be provided and the fee charged in accordance with Sections 552.231 and 552.262 of the Government Code, and therefore in accordance with the cost rules at 1 Texas Administrative Code Section 70.3.
>
> If the estimated charges exceed $40, please provide the itemized statement of estimated charges required by Section 552.261(b). I will respond in writing within the required period. If a deposit or bond is required, please state the amount and I will remit promptly.
>
> If you determine that responding requires programming or manipulation of data, please provide the written statement described in Section 552.231 and I will respond in writing.
>
> If any portion of this request is unclear or if narrowing the scope would materially reduce the cost, please contact me and I will work with you to clarify. I am happy to discuss this by phone before you begin any work.
>
> Please direct all correspondence to:
> [Name], [Title]
> Legacy Group ATX LLC
> [Address] / [Email] / [Phone]
>
> Thank you for your assistance.
>
> Sincerely,
> [Name]

## 5. Template B, image request

File only after Template A has closed successfully.

Same structure, with these substitutions:

- Request the document images corresponding to the instruments in the index for the period [START] through [END], in the native electronic image format in which they are stored.
- Add: "I am prepared to provide new, sealed storage media at my own expense to eliminate media cost, and to arrange courier pickup or shipment at my expense. Please advise whether your office will accept requestor-supplied media."
- Add: "I understand this is a large volume request. I am willing to accept delivery in batches over a schedule convenient to your office, and to segment this request by date range if that reduces burden. Please advise what approach minimizes disruption to your operations."

That last paragraph matters. Section 552.231 lets a body claim compliance is not feasible or would substantially interfere with ongoing operations. Source: https://www.rcfp.org/open-government-guide/texas/ Pre-emptively removing the operational disruption argument removes the cleanest path to refusal.

## 6. The state machine

```
not_started
  -> index_requested          (Template A filed, log date)
  -> index_itemized           (itemized statement received)
      !! 10 BUSINESS DAY CLOCK STARTS. Auto-withdrawal on expiry. !!
  -> index_paid               (written acceptance sent + payment/deposit)
  -> index_received           (media/transfer in hand, inventory stage begins)
  -> images_requested         (Template B filed)
  -> ... same cycle ...
  -> images_received

  branch: refused             -> escalation, section 8
  branch: disputed            -> escalation, section 8
```

**Deadlines to instrument:**

- By the 10th business day, the body must either produce, set a reasonable date, or request an AG ruling. Failure to timely request an AG ruling and notify the requestor creates a presumption the information is open absent a compelling reason to withhold. Source: https://comptroller.texas.gov/about/policies/open-records/public-information-act.php
- 552.231 statement generally within 20 days. Source: https://www.rcfp.org/open-government-guide/texas/
- **Requestor's 10 business day response window. This is ours to miss and it is the one that hurts.** Source: https://www.ethics.state.tx.us/contact/open-records/fees.php
- The body must notify of estimate changes above 20 percent of the original and confirm acceptance in writing. Source: https://comptroller.texas.gov/about/policies/open-records/public-information-act.php

## 7. Anticipated objections and responses

| Objection | Response |
|---|---|
| "That will be $1 per page." | The request is for a copy in a format other than paper. LGC 118.011(e) routes non-paper copies, including real property records, to Gov Code 552.231 and 552.262. The Chapter 118 per-page schedule applies to paper copies under Gov Code 552.265. |
| "The Legislature lets us charge ten cents a page for electronic real property records." | That provision was removed by SB 1547, 89th Legislature, effective 2025-06-20. Source: https://legiscan.com/TX/bill/SB1547/2025 The bill analysis states the fee exceeded actual cost of production and conflicted with public records fee law. Source: https://capitol.texas.gov/tlodocs/89R/analysis/pdf/SB01547F.pdf |
| "Our vendor holds the data, ask them." | **[VERIFY]** Counsel must answer this before Phase 2. Do not improvise a response in the field. See `strategy` open question 2. Escalate to counsel and pause the county. |
| "This would substantially interfere with operations." | Offer batching, segmentation by date range, and off-hours scheduling. Cite the SOS UCC Master Unload and Daily Filing Update model as a Texas state agency precedent for exactly this. Source: https://www.sos.state.tx.us/ucc/bulk-order.shtml |
| "We'd have to redact every page." | The request is for the records in the same state already published on your public search site. No incremental redaction is required. |
| "This information is commercially available." | Gov Code 552.027 addresses information in a commercial book or publication purchased by the governmental body. It does not permit refusing to produce the body's own records because a private vendor also sells access to them. **[INFERENCE]** Route to counsel if actually raised; do not argue this in the field. |
| "Why do you want it?" | An officer for public information and the officer's agent may not ask why you want the records. Source: https://www.sos.state.tx.us/records.shtml Answer anyway, politely and briefly. Being right is not the same as being effective. |

**Tone directive.** Every one of these clerks is a potential SmartCity OS customer and sits inside Sylvia's municipal network. Winning a fee argument and losing the relationship is a net loss. Lead with the phone call, not the letter. Lead with "we are building something for cities and we want to do this the right way," not with a statute cite. The statute cites exist for the file, not for the conversation.

## 8. Escalation ladder

Climb in order. Do not skip.

1. **Phone the clerk.** Most quote problems are misunderstanding, not resistance.
2. **Narrow the request.** Shorter date range, index only, requestor-supplied media.
3. **Request the itemized breakdown.** Compare against the 70.3 rate table in `strategy` section 2.4. A quote that does not decompose into those line items is not a lawful quote.
4. **Written overcharge complaint to the OAG.** Open Government Hotline, 512-478-6737 or 1-877-673-6839. Source: https://www.rrc.texas.gov/general-counsel/open-records/procedures-for-requesting-information/
5. **Counsel.** LGC 118.801 provides an officer who in bad faith demands and receives a higher fee than authorized is liable to the aggrieved person for four times the amount unlawfully demanded and received. Source: https://law.justia.com/codes/texas/2017/local-government-code/title-4/subtitle-b/chapter-118/

**Do not climb past step 3 in Phase 1 or Phase 2.** In Bastrop specifically, do not climb past step 2. The relationship is worth more than the county. If Bastrop resists, that is information about the playbook, not a problem to litigate.

## 9. Logging requirements

Every step writes to the registry entry per `source_rail_registry` section 7. Non-negotiable fields at each transition: date, actor, artifact (letter, statement, receipt), amount, and a verbatim copy of the clerk's own words on any refusal or objection.

The verbatim capture matters. The pattern across 254 counties is itself the intelligence asset. It tells you which objections are real and which are folklore, which vendors are the blocker, and where the legislative or AG pressure point actually is. That pattern is worth more than any single county's data.

## 10. Open questions

1. Counsel confirmation of 118.011(e). Gates all requests.
2. Vendor-hosted records. Gates Phase 2.
3. Does any county already have a published bulk data policy or price list that shortcuts this entirely? Empirical, Phase 0. **[INFERENCE]** Worth 30 minutes per county in the registry population task; a published policy skips the whole runbook.

## 11. Cross references

- `_land_records/strategy` section 2, legal foundation
- `_land_records/source_rail_registry` section 7, registry schema
- `_land_records/risk_register`

## 12. Revision history

- 2026-07-15, research session, initial draft. Untested. Rewrite after Bastrop.
- 2026-07-15, reconciled into _land_records/ + adr_027 + 90_runbooks/; cross-references updated.
