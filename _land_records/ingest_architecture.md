---
id: land_records_ingest_architecture
title: Land Records Ingest Architecture
status: draft
last_updated: 2026-07-15
applies_to: portfolio
related: [_land_records/strategy, _land_records/source_rail_registry, 80_adrs/adr_027_first_party_land_records_acquisition, _land_records/risk_register]
owner: [Nick, planner]
---

# Land Records Ingest Architecture

## 1. Purpose and scope

**Purpose.** Define the pipeline that turns acquired land records into parcel-keyed atoms, and name the design constraints that acquisition imposes on it.

**In scope.** Pipeline stages, normalization targets, the delta problem, atom mapping, coverage honesty.

**Out of scope.** Atom contract internals, which are settled in the canonical atom doc set and not relitigated here. Storage cost modeling. OCR build versus buy.

**Note to the planning agent.** This doc names shape and constraints. Field-level atom schema must be routed to Nick and reconciled against the existing atom architecture reference. Do not treat section 5 as a schema.

## 2. Pipeline stages

```
[acquire] -> [land] -> [inventory] -> [normalize] -> [extract] -> [resolve] -> [atomize] -> [publish]
                |                                                     |
           registry state                                       parcel key spine
```

**Stage 1, acquire.** Per-rail. Rail C and most of Rail B are HTTP fetches. Rail A is a human-driven PIA cycle producing physical media or an SFTP drop. The acquire stage is therefore not uniform and must not be modeled as if it were. See `pia_bulk_request_runbook`.

**Stage 2, land.** Immutable raw landing. Never mutate an acquired artifact. Hash on receipt. Record the acquisition event itself as first-class metadata: request date, itemized statement, amount paid, clerk contact, media serial, receipt date. This metadata is not bookkeeping. It is the provenance chain that the atom's license and citation fields will eventually cite. If it is not captured at landing it cannot be reconstructed later.

**Stage 3, inventory.** Before parsing anything, enumerate what actually arrived against what was requested. Clerks under-deliver. Ranges get truncated. Image counts do not match index counts. The inventory delta is a data quality signal that must survive into coverage metadata, not a bug to be silently patched.

**Stage 4, normalize.** To published standard schemas wherever one exists. See section 4.

**Stage 5, extract.** Legal descriptions, party names, instrument references, dates, amounts. Born-digital documents need no OCR. Scans do. See section 6.

**Stage 6, resolve.** The joins. Parcel key resolution, party entity resolution, instrument chaining. This is where the value is and where the effort should go. See `source_rail_registry` section 8.

**Stage 7, atomize.** Emit atoms with provenance, confidence, citation, temporal validity, and license populated from the chain established at stages 2 and 3.

**Stage 8, publish.** Surface-specific, with statutory display gating applied. See section 7.

## 3. The delta problem, and why it drives the design

There is no standing PIA subscription. A governmental body is not required to comply with a continuing request to supply information on a periodic basis, or with a request for information that will be prepared in the future. Source: https://www.rrc.texas.gov/general-counsel/open-records/procedures-for-requesting-information/

**Consequence:** Rail A cannot be a stream. It is a scheduled sequence of discrete requests, each naming a closed date range of records that already exist.

Design implications the planning agent must carry:

1. **The ingest scheduler is a request scheduler, not a poller.** For each county, on cadence, generate and file a fresh PIA request covering `[last_received_date + 1, today - 1]`. The scheduler's primary job is generating correctly-scoped requests and tracking their state machine, not fetching.
2. **Cadence is a cost optimization, not a freshness preference.** Each request carries fixed overhead: staff time to file, the clerk's minimum labor increment, the itemized statement cycle, payment processing. Monthly requests across 254 counties is 3,048 request cycles a year. Weekly is 13,208. The cadence per county should be a function of the county's transaction volume and the marginal cost per cycle, not a global constant. High-volume counties justify tighter cadence. Loving County does not.
3. **The 10 business day response deadline is a hard system requirement.** A request is automatically withdrawn if the requestor does not respond in writing to the itemized statement within 10 business days. Source: https://www.ethics.state.tx.us/contact/open-records/fees.php Missing it silently resets that county to zero. This needs alerting with escalation, not a dashboard field.
4. **Gaps are inevitable and must be represented, not hidden.** A county whose last successful delta was 90 days ago has a 90 day hole. Every atom derived from that county carries temporal validity that terminates at the last confirmed receipt, not at today. The substrate must be able to answer "what do we not know, and as of when" per county. This is the coverage boundary marker from the existing self-observation work, applied concretely.
5. **Rail B and Rail C have their own natural cadences and they are annual.** StratMap refresh is attempted annually and varies by county. Source: https://tnris.org/stratmap/land-parcels.html EARS is certified once a year with Aug 1 and Sept 1 deadlines. Source: https://comptroller.texas.gov/taxes/property-tax/newsletter/ Do not build a uniform refresh loop across rails with fundamentally different clocks. Where a CAD publishes live ArcGIS REST, prefer it over StratMap for freshness. See `source_rail_registry` section 7.

**Precedent worth citing to clerks.** The Secretary of State already runs exactly this model for UCC: a Master Unload monthly snapshot plus a Daily Filing Update, both JSON, via bulk order. Source: https://www.sos.state.tx.us/ucc/bulk-order.shtml A clerk who says periodic bulk export is infeasible can be shown a Texas state agency doing it. This is a persuasion asset for `pia_bulk_request_runbook`, not a legal argument.

## 4. Normalization targets

**Rule: normalize to a schema the source already produces. Do not invent one.**

| Rail | Target | Why |
|---|---|---|
| B, CAD | Comptroller EARS record layout | Every district in Texas already conforms to it annually under a signed chief appraiser certification. Published record layout manual. Documented change history 2020 to 2026. Source: https://comptroller.texas.gov/taxes/property-tax/data-submissions.php |
| C, parcels | TxGIO StratMap land parcel schema | 245+ districts already translated into it. Developed with 30+ stakeholders. Source: https://www.esri.com/about/newsroom/arcuser/tnis |
| A, clerk index | No published standard exists | This is the gap. See below. |

**Rail A has no standard and this is the real work.** There is no statewide clerk index schema. Each RMS vendor has its own. The normalization target must be defined by Hauska, and it should be defined against the *union* of what the vendors emit rather than against an idealized model.

**[INFERENCE]** The TDI Procedural Rule P-12 abstract plant content list is a useful spec for scope even though Hauska is not building a plant. It enumerates what a complete county land record index must include to be adequate for title work: plat and map records, deeds, deeds of trust, mortgages, lis pendens, abstracts of judgment, federal tax liens, mechanic's liens, attachment liens, divorce actions involving real property, probate records, and financing statements relating to items attached to realty, where available for indexing from the county clerk's office. Source: https://www.tdi.texas.gov/title/documents/2012-36_Procedu.doc

Using P-12 as a completeness checklist tells you when a county's Rail A ingest is actually done rather than merely started. It costs nothing to adopt as a coverage rubric. Adopting it does not make Hauska a plant. See `risk_register` R6.

## 5. Atom mapping shape

**Route to Nick. This is shape, not schema.**

The land records domain produces at least four distinct atom classes, and collapsing them is the failure mode:

**Instrument atom.** A recorded document. Provenance terminates at the clerk. Citation is instrument number plus county plus recording date. Temporal validity begins at recording, since an instrument filed with a county clerk is considered recorded from the time it is filed. Source: https://law.justia.com/codes/texas/2017/local-government-code/title-6/subtitle-b/chapter-191/ License is public record under LGC 191.006.

**Assertion atom.** A claim extracted *from* an instrument. "Grantor X conveyed to Grantee Y." Provenance terminates at the instrument atom, not at the clerk. Confidence reflects extraction quality and must be lower for OCR-derived than for born-digital or clerk-indexed. This distinction is the whole reason the atom carries confidence.

**Appraisal atom.** A CAD claim about a parcel. Provenance terminates at the CAD, temporal validity is the tax year, license carries the 25.027 publication restriction where applicable.

**Geometry atom.** A parcel polygon. Provenance terminates at the CAD via StratMap. License and confidence must carry the explicit "not survey grade, not for legal purposes" disclaimer. Source: https://tnris.org/stratmap/land-parcels.html

**The distinction that matters most.** A StratMap parcel polygon and a metes-and-bounds legal description recorded in a deed are two different claims about the same land, from two different custodians, with two different confidence profiles and two different legal statuses. One is an appraisal convenience explicitly disclaimed for legal use. One is the operative legal description. They must never collapse into a single atom. If the substrate cannot represent the disagreement between them, it is not doing its job. Adjudication between them is exactly the adjudication ledger case from the existing architecture work.

**Open architectural hole.** The clerk, the CAD, and TxGIO are all actors making claims. This maps directly onto the actor atom hole already routed to Nick. Land records ingest is a forcing function on that decision, not an independent question.

## 6. Extraction notes

**Born-digital versus scanned is the primary cost split.** Tarrant County records 86 percent of land record documents electronically and has led Texas e-recording since 2004. Source: https://www.tarrantcountytx.gov/en/county-clerk/real-estate-records/erecording.html

**[INFERENCE]** In high e-recording counties, recent-vintage instruments are likely born-digital with extractable text, needing no OCR. Older vintages and low-e-recording counties are scans. The extraction pipeline should branch on this and the registry should carry `erecording_pct` as a planning input. Verify per county rather than assuming Tarrant generalizes.

**Volume reality check.** Taylor County: over 4 million images, roughly 4 terabytes. Source: https://www.taylorcounty.texas.gov/281/Official-Public-Real-Property-Records Dallas County records approximately 400,000 documents per year. Source: https://www.dallascounty.org/government/county-clerk/recording/ Statewide corpus at 254 counties is a serious storage and compute problem that this doc does not solve. Route to a separate storage cost model before Phase 3.

**Index first, images later.** The clerk's index is already structured and already extracted. It is cheap to acquire and needs no OCR. A large share of the product surface runs on index alone. Sequence accordingly and do not let image ingest block index value.

## 7. Publication gating

Possession and publication are different questions and the pipeline must separate them.

Tax Code 25.027 restricts *posting on the internet* of residential photographs, sketches, and floor plans, and of information indicating a property owner is 65 or older. Source: https://statutes.capitol.texas.gov/Docs/TX/htm/TX.25.htm

HB 4350 (89th Legislature) requires clerks, on written request of a peace officer, to omit or redact SSN, driver's license number, and residence address from instruments in a public online database. Source: https://www.mortgagelaw.com/insights/89th-texas-legislature-weekly-update-6-23-2025/

TexasFile's own ToS warns that its data may contain personal information of individuals including social security numbers. Source: https://www.texasfile.com/about/tos That warning applies equally to first-party acquired data.

**[INFERENCE]** These are display-layer rules, not ingest filters. Gating at publish rather than at ingest preserves the complete record for internal adjudication while keeping public surfaces compliant. This maps to atom-level license and visibility metadata. Verify the possession/publication distinction with counsel before relying on it. Flagged in `risk_register` as R8.

## 8. Open questions

1. Atom class boundaries and the actor atom dependency. Nick.
2. Rail A index normalization target definition. Nick plus planner, after Phase 2 vendor variance data exists.
3. Storage and compute cost model at statewide corpus scale. Blocks Phase 3.
4. OCR build versus buy. Deferred until born-digital share is measured empirically.
5. Publication gating architecture, pending the counsel answer on possession versus publication.

## 9. Dependencies

- Atom architecture reference and the four commitments. This doc must not contradict them; if it does, it is wrong.
- Actor atom decision, currently routed to Nick.
- Parcel key model.
- County registry populated through Phase 0, per `source_rail_registry` section 7.

## 10. Cross references

- `_land_records/strategy`
- `_land_records/source_rail_registry`
- `80_adrs/adr_027_first_party_land_records_acquisition`
- `90_runbooks/pia_bulk_request_runbook`

## 11. Revision history

- 2026-07-15, research session, initial draft.
- 2026-07-15, reconciled into _land_records/ + adr_027 + 90_runbooks/; cross-references updated.
