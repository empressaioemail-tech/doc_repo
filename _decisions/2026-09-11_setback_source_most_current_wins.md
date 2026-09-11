---
decision_id: 2026-09-11_setback_source_most_current_wins
date: 2026-09-11
owner: Nick (operator), recorded by the integration seat
status: active
supersedes: 2026-08-31_bastrop_setbacks_bake_ruling (item 3 only, the corner-lot hold)
related_canonical:
  - _decisions/2026-07-29_setback_authoritative_source_and_road_decouple
  - _decisions/2026-08-31_bastrop_setbacks_bake_ruling
  - _decisions/2026-09-05_f11_setback_pe_table_port_and_live_bastrop_fetch
  - 90_operations/OPS-23_surface_completion_program
  - 90_operations/OPS-21_serve_completion_program
---

## Decision

For setbacks and every other dimensional rule, in every city and county: **the source with the
most recent effective date supplies the value.** Authority tier (codified ordinance, per-parcel
GIS record, atom chain) breaks ties only when the dates are equal or cannot be read. The date is
read from the source itself: an ordinance's effective date, an ArcGIS layer's
`editingInfo.lastEditDate`, a corpus edition's adoption date. It is never inferred from the kind
of source. When no date can be read, the row shows both values with both sources and says the
conflict is unresolved. A silent pick is prohibited.

Operator's words: "It's the same rule for all cities and counties. What is the most current,
then use that."

## Context

On 2026-09-11 one parcel, `48021:34049` (1109 Pecan St, Bastrop, SF-1, corner lot), showed
setbacks of 25/5/25/15 on the Property Explorer panel and the feasibility PDF, and 30/10/30/20
on the envelope endpoint the map draws from, the ledger, and `get_smart_site`, every one marked
present and none showing a conflict. The trail: CORRECTION A (2026-07-29) made ordinance text
the number source; R1 (2026-07-30) reversed it in favour of the per-parcel record the plan
reviewer applies; the 2026-08-31 ruling declared the corner-lot case unresolved and required the
user to see "unresolved"; then F-11 (2026-09-05) shipped the layer-23 record into the panel and
OPS-21 S1 (2026-09-10) shipped the ordinance text into the ledger, in the same week, in
different repos, neither citing the other. LDT `authoritativeSetbackSource.ts` ranks by tier
then date; hauska-map `atom-chain-to-facets.ts` treats layer 23 as the only live source.

## Structural commitment check

Confidence is earned, not asserted: a value whose date is read from the source carries the
provenance a reviewer can check; a value chosen by source kind does not. Sell reasoning, not
data: the conflict row, when dates tie, is the reasoning. Cost per jurisdiction: no new ingest,
one resolver. Dual interface: one rule, one resolver, both faces.

## Reasoning

Recency is the only rule that scales across jurisdictions without a per-city argument about which
of a city's own records its reviewer honours. It is also the rule the operator has stated twice
and the operation never wrote down as a mechanism. The 2026-08-31 hold was correct to refuse a
silent pick and wrong to leave the question without an instrument; the instrument is the date
read. Two mechanisms could produce the same disagreement: the two city records genuinely
disagree, or one is stale. The date read distinguishes them; the tier ranking cannot.

## Reversal criteria

Reverse if a jurisdiction is shown to publish a dated record that is more recent and wrong (a
GIS edit that post-dates the ordinance but contradicts it in law). In that case the rule narrows
to "most current among sources the jurisdiction's own reviewer applies" and the finding is
recorded per city, not by retreating to tier-first.

## Dependencies

OPS-23 P-154 implements it in one resolver and re-runs the Bastrop ledger cells under it. The
lane records the three Bastrop dates it reads (layer 23, layer 83, Ordinance 2026-06) in this
record's revision history as the evidence for the parcel that opened the question.

## Counterparties

Internal. City of Bastrop Development Services is the source authority if the dates tie; the
question goes through Sylvia as a customer relationship, not a data licence.
