---
id: 2026-08-30_p91_five_parcel_comparison
title: Bastrop Five Parcel Comparison, Smart Site Node Reads Against Listing Record, 2026-08-30
date: 2026-08-30
status: filed-verbatim
plan_row: P-91
source: operator paste of a Claude session capture (Opus, claude.ai), filed by the integration seat 2026-08-30 without edits to the body
original_id: session_2026_08_30_bastrop_five_parcel_comparison
related: [_inbox/2026-08-30_p91_qa_walk_five_parcels.md]
triage: _inbox/2026-08-30_p91_qa_triage.md
---

Filing note (integration seat). Companion to the QA walk, unedited. Part 4 and Part 6 are web-sourced listing data and stay in this document and the transcript only; nothing in them enters a screen, a panel, or an atom (WDLL I5). The headline finding in Part 2 is a product fact, not a defect, and is routed as such in the triage.

---

# Bastrop Five Parcel Comparison

## Purpose

Companion to `session_2026_08_30_smart_site_mcp_qa_walk`. That doc recorded
defect candidates from two node reads. This one completes the set, opening all
five parcels at depth `node`, and sets the Smart Site output against the public
listing record for the same five addresses.

The QA doc answered "does the connector behave correctly." This one answers "is
the output actually differentiating between properties," which turns out to be a
separate and less comfortable question.

## Scope

In scope: `get_smart_site` at depth `node` for all five Bastrop parcels, a
listing-record lookup per address held to the transcript and to this doc, and
the cross checks between them.

Out of scope: nothing was written to any screen or parcel panel. No
`save_property`, `add_to_screen`, `ask_the_map`, or `request_records` call was
made. All panel rendering remains unmeasured. Listing data below is not Smart
Site data and must not be loaded into the board or panel under the standing
rule.

## Method

Three node reads were added to the two already recorded, completing the set:
`48021:8718296`, `48021:8704645`, `48021:8715051`. One web search per address
for the four not already covered.

## Part 1. Smart Site node reads, side by side

| Field | Rainmaker | Baron Creek | Rimrock | Trailstone | Driftwood |
|---|---|---|---|---|---|
| Node | 48021:8720522 | 48021:8718296 | 48021:8704645 | 48021:8705357 | 48021:8715051 |
| Zoning district | PDD | PDD | PDD | PDD | PDD |
| Jurisdiction | bastrop_city_tx | bastrop_city_tx | bastrop_city_tx | bastrop_city_tx | bastrop_city_tx |
| Zoning source | Zoned_Parcels FS/83 | same | same | same | same |
| Envelope | refused | refused | refused | refused | refused |
| Decline reason | atom_path_pending | atom_path_pending | atom_path_pending | atom_path_pending | atom_path_pending |
| Flood zone | X | X | X | X | X |
| Flood subtype | 0.2 PCT | 0.2 PCT | 0.2 PCT | 0.2 PCT | 0.2 PCT |
| In SFHA | false | false | false | false | false |
| Base flood elev | null | null | null | null | null |
| Flood evaluatedAt | 2026-08-11T23:13:43.774Z | identical | identical | identical | identical |
| Flood citations | empty, degraded | empty, degraded | empty, degraded | empty, degraded | empty, degraded |
| Land use | absent | absent | absent | absent | absent |
| Boundary | unmeasured, geom none | same | same | same | same |
| Footprint | unmeasured, geom none | same | same | same | same |
| Pipeline | absent-verified, degraded, vintage UNKNOWN | same | same | same | same |
| Special district | absent-verified | same | same | same | same |
| Well | unknown, not checked | same | same | same | same |
| Draw confidence | seed | seed | seed | seed | seed |
| **yearBuilt** | **2021** | **2020** | **2018** | **2023** | **2021** |

## Part 2. The headline finding

Across five parcels, one field varies.

`yearBuilt` is the only value that differs between any two rows above, and even
that collides: Rainmaker and Driftwood both return 2021. So the product can
currently distinguish these five properties into four buckets, on the basis of a
single integer that the county already publishes for free.

Every other field, twenty of them, is byte identical across all five. That is
not a bug. All five sit in the same PDD zoning polygon, the same shaded X flood
polygon, and the same set of unmeasured facets. But it does mean that a user
comparing these five parcels in Smart Site today learns nothing that would help
them choose between them.

This is a positioning fact more than a defect. It belongs in front of whoever is
writing the parcel panel value proposition, not only in front of engineering.

## Part 3. Bake batching confirms defect D4

The QA doc flagged that bake timestamps do not track call time. The full set
settles it.

Five node reads returned exactly two distinct timestamps:

| Call order in session | Node | Bake stamp |
|---|---|---|
| 1 | 48021:8720522 | 2026-08-29T20:07:42.056Z |
| 2 | 48021:8705357 | 2026-08-29T20:06:37.384Z |
| 3 | 48021:8718296 | 2026-08-29T20:07:42.056Z |
| 4 | 48021:8704645 | 2026-08-29T20:06:37.384Z |
| 5 | 48021:8715051 | 2026-08-29T20:06:37.384Z |

Calls 1 and 3 share one stamp. Calls 2, 4 and 5 share the other. The stamps are
uncorrelated with call order, and both are dated the day before the session ran.

Confirmed: the stamp is a property of a bake batch, not of an invocation.
`runId` is base64 of node id plus that stamp, so `runId` is fully deterministic
per node and repeats across calls. Any harness keying on `runId` is broken.
D4 should move from candidate to confirmed.

## Part 4. Listing record

Not Smart Site data. Gathered by web search, recorded here for the cross check
in Part 5 only.

| Address | Ask | Sqft | Beds/baths | Built | MLS | Status |
|---|---|---|---|---|---|---|
| 111 Rainmaker Cv | $350,000 | 2,427 | 4 / 3 | 2021 | 6985679 | active, relisted 2026-08-26 |
| 228 Baron Creek Trl | $340,000 | 2,328 | 4 / 3 | 2020 | 8867312 | active, prior MLS 4344151 Sept 2025 |
| 309 Rimrock Ct | $350,000 | 2,481 | 4 / 3 | not found | 9155846 | active, conflicting specs |
| 129 Trailstone Dr | $355,000 | 2,305 | 4 / 2.5 | 2023 | 9798173 | active, listed 2026-07-07 |
| 237 Driftwood Ln | $349,000 | 2,275 or 2,344 | 4 / 2 or 2.5 | 2022 | 4958485 | conflicting, also listed for lease |

Rainmaker price history, the only one with a full published trail, is recorded
in the QA doc and is not repeated here.

Baron Creek carries two MLS numbers, 4344151 from September 2025 under one
brokerage and 8867312 currently under another, with substantially the same
marketing copy. That is a relist under a new listing agreement, not two
properties.

Driftwood appears simultaneously as a resale near $349,000 and as a lease
listing around $2,100 per month under a property management company. Either it
is being dual tracked or one record is stale.

## Part 5. Cross check, CAD year against listing year

`yearBuilt` is the only differentiating field Smart Site produces, which makes
its accuracy disproportionately important.

| Parcel | Smart Site | Listing record | Result |
|---|---|---|---|
| Rainmaker | 2021 | 2021 | agrees |
| Baron Creek | 2020 | 2020 | agrees |
| Rimrock | 2018 | not found | unverified |
| Trailstone | 2023 | 2023 | agrees |
| Driftwood | 2021 | 2022 | conflict |

Three agree, one could not be verified, one conflicts.

The Driftwood conflict is the one to chase. Smart Site returns 2021 and renders
an overlay label reading "Structure of record (2021), footprint unmeasured."
Listing copy for the same address states 2022 and asserts remaining builder
warranty coverage, which is a claim that depends on the build year. One of the
two is wrong, and the Smart Site figure is the one carrying a "structure of
record" framing that reads as authoritative.

Recommendation: pull the CAD record for `48021:8715051` directly and determine
whether the bake is stale, the CAD is wrong, or the listing is wrong. Until
then, `yearBuilt` should not be presented as a record-grade fact when it is
simultaneously the only field the panel differentiates on.

## Part 6. Audit of the source screenshot

The five addresses entered this session from a screenshot of a third party
assistant's output, which asserted all five were 4 bed / 3 bath at roughly
comparable size and price.

| Claim | Verified? |
|---|---|
| Rainmaker $350,000 / 2,427 / 4-3 | correct |
| Baron Creek $340,000 / 2,328 / 4-3 | correct |
| Rimrock $350,000 / 2,481 / 4-3 | price and size match Redfin, bath count disputed by another aggregator |
| Trailstone $355,000 / 2,305 / 4-3 | price and size correct, bath count wrong, actual is 2 full plus 1 half |
| Driftwood $325,000 / 2,344 / 4-3 | price not found in any source, lowest found ask is $349,000, bath count wrong |

Three of five are clean, one has a wrong bath count, one has a price that no
source supports. The blanket "all 4 bed / 3 bath" framing is false for at least
two of the five.

Worth stating plainly since this is the second time in one session that
plausible, well formatted, confidently phrased property data turned out to be
partly wrong. That is the argument for the product, and it is also the reason
none of this belongs in the board until it is sourced.

## Part 7. Data traps catalogue

Every one of these was hit during this session. They are recorded because the
planned `find_listing_history` host turn will walk into all of them.

1. **List page row offset.** Aggregator index pages interleave address and spec
   blocks in an order that flips between sites. Estately paired Rainmaker with
   $275,000 / 1,635 sqft and separately with $169,000 / 1,560 sqft. Coldwell
   Banker's city index pairs Rimrock with 4 bed / 2 bath / 1,998 sqft while
   Redfin's index gives 4 / 3 / 2,481 for the same address. At least one is an
   offset artifact. Detail pages only, never index pages.
2. **Multiple property records per address.** Zillow carries two distinct zpids
   for 228 Baron Creek Trl with different specs. Two of the Zillow URLs
   encountered rendered content for an unrelated Colorado market entirely.
3. **Near-miss street suffixes.** 111 Rainmaker Cv and 111 Rainmaker Ln are
   distinct properties on distinct parcels. 102 Rainmaker Cv also exists and
   appeared adjacent in results.
4. **Long form and short form of the same street.** Rainmaker Cv and Rainmaker
   Cove resolve to one node and are half of the known `duplicate_resolved_node`
   collision pair. Listing sources render the long form.
5. **Sale and lease listings coexisting.** Driftwood appears as both. A scraper
   keying on price will read $2,100 as a sale price.
6. **Tax figures disagreeing between aggregators.** Trailstone showed $5,684 and
   $4,800 annual tax on two sites for the same MLS number.
7. **Texas non-disclosure.** No sale price is published for any closed
   transaction. Any sold figure presented to a user is an estimate, and should
   be labeled as one.

## Part 8. What this changes

Nothing in Part 1 contradicts the QA doc. Every defect candidate D1 through D8
held across five parcels rather than two, which raises confidence on all of them
and moves D4 to confirmed.

Two additions to the earlier picture.

D7, zero geometry, is now five for five on ordinary parcels. The inference that
the 908 Pine gold parcel is the exception rather than the baseline is
substantially stronger, though still not verified against the geometry load
itself. The recommendation stands: do not grade a walk on ring presence until
coverage is established.

D8, thin attribute coverage, was written as informational. Across five parcels
it is closer to structural. One varying field is not a comparison product.

## Provenance

- Smart Site facts: tool JSON from five `get_smart_site` node reads against
  https://mcp.smartsite.cloud on 2026-08-30, node ids and bake stamps recorded
  inline in Part 3.
- Rainmaker price history: Redfin, sourced to Unlock MLS and public records,
  https://www.redfin.com/TX/Bastrop/111-Rainmaker-Cv-78602/home/176279115
- Baron Creek: HAR, https://www.har.com/homedetail/228-baron-creek-trl-bastrop-tx-78602/15122237
  and prior MLS via homecity.com
- Trailstone: Unlock MLS via https://www.search.unlockmls.com/address/129-Trailstone-Dr-Bastrop-TX-78602/9798173
  plus a broker detail page carrying the HOA, lot and tax fields
- Driftwood: Movoto and a broker detail page for MLS 4958485; lease listing via HAR
- Rimrock: no detail page located. Specs in Part 4 come from Redfin's city index
  and are flagged disputed. This is the weakest row in the doc.
- Screenshot audit in Part 6: the screenshot itself is operator supplied. It is
  treated as an unsourced third party claim, which is what the audit tests.
- Inferences, explicitly framed as such and not as fact: that the gold parcel is
  the exception on geometry, that Baron Creek's two MLS numbers represent a
  relist rather than two properties, and that Driftwood is either dual tracked
  or carrying a stale record.

## Open questions

1. Which is right on Driftwood build year, CAD 2021 or listing 2022? Routing:
   pull `48021:8715051` from the CAD directly. Blocks trusting `yearBuilt`,
   which is currently the only differentiating field in the product.
2. Given one varying field across five parcels, what is the parcel panel
   actually claiming to do for a comparison use case today? Routing: operator,
   product positioning. Not an engineering question.
3. Does the flood facet ever return anything other than this exact payload in
   Bastrop, or is the whole county one polygon? Five for five identical is not
   enough to tell. Routing: Nick.
4. Should `find_listing_history` be constrained to detail pages only, given Part
   7? Routing: Nick. Index page scraping produced wrong data on two of the five
   addresses in this session.
5. Band and slot assignment, same as the QA doc. Filed as a dated session
   archive pending the doc_repo agent.

## Dependencies

- Reads on and extends `session_2026_08_30_smart_site_mcp_qa_walk`. Do not file
  one without the other.
- Open question 1 blocks any decision that leans on `yearBuilt`.

## Revision history

- 2026-08-30, Claude, session capture. Completed the five parcel node read set,
  added listing cross checks, confirmed D4, escalated D8 from informational to
  structural.
