---
id: 01_bastrop_to_network_strategy
title: Bastrop-to-network expansion strategy
status: active
last_updated: 2026-09-03
applies_to: smartcity-os
owner: nick
related:
  - _smartcity_gtm/00_README
  - _smartcity_gtm/02_vertosoft_channel
  - _smartcity_gtm/03_build_readiness_for_sale
  - 18_stakeholder_graph
  - 06_cities_value_narrative
  - 14_pricing_framework
purpose: The target-market plan. Why Bastrop is the proof point, who the next tier of buyers
  is, which relationships and networks reach them, and why sequencing here is gated on build
  state rather than on channel readiness.
---

# Bastrop-to-network expansion strategy

## The frame

SmartCity OS does not have a launch market in the way Smart Site does — it has one live,
deep customer relationship (Bastrop) and a channel partner (Vertosoft) whose job is to turn
that relationship into a repeatable sale. The strategy is not "which city do we target first";
it is "which cities does the Bastrop template reach next, and through which door."

Bastrop is not a data source and is not licensed for a revenue share — partnership-first
sourcing was retired 2026-06-09. Bastrop is a customer and design partner, and the narrative is
that it is pioneering: the first city in a network, not a special case
(`_decisions/2026-06-09_retire_partnership_first_amend_constitution.md`).

## Who buys, and through what relationship

**Bastrop (live, deep partnership).** Sylvia Carrillo, city manager, is the anchor of the
entire city-customer relationship and the gate for any new city introduction
(`18_stakeholder_graph.md`). Bastrop is the source of the permit and inspection ingestion
patterns the template is built from, and the partnership template other cities will follow.
A $1M Bastrop expansion proposal is in live negotiation as of the stakeholder graph's last
update; pricing posture for it is Path A per `14_pricing_framework.md` — phase the work, anchor
year one, expand via change orders. This is a materially different pricing shape from the flat
Vertosoft resell list (`02_vertosoft_channel.md`) and the two should not be conflated in
conversation: Path A is the direct deal-shape for the anchor relationship, the Vertosoft list
is the resell MSRP for cities that come in through the channel.

**The Williamson County belt (next tier, not yet engaged).** Round Rock, Pflugerville, Cedar
Park, Hutto, Georgetown — named in the stakeholder graph as targets for Nick-plus-Sylvia
introductions. As recorded there, this list was framed primarily to support a Tier 1 batch
substrate-ingest motion rather than a SmartCity OS sales motion specifically; the two are
adjacent (the same city relationships serve both) but this document does not assume they are
identical asks, and outreach framing should be scoped per conversation rather than pitched as
one motion.

**TML and TCMA (peer network, credibility channel).** The Texas Municipal League and the Texas
City Management Association are named as the channel for replicating the Bastrop template
through peer introduction rather than cold outreach — city managers hearing from other city
managers. TCMA/ICMA conferences are flagged as having a strong Texas presence. Sylvia
introductions are the preferred path into TCMA specifically.

**Vertosoft (the compliant-purchase door).** Where a city needs a cooperative-purchasing
contract vehicle rather than a warm introduction to buy, Vertosoft is the door — see
`02_vertosoft_channel.md`. This is not a lead-generation channel; Vertosoft's contract-vehicle
access and reseller relationships are what let an already-interested city actually complete a
purchase without a full RFP.

## What is explicitly NOT a sales channel here

County appraisal district directors (Williamson CAD, Bastrop CAD, Travis CAD) are named in the
stakeholder graph as data-source-partner targets, for partner-licensed parcel data feeding the
substrate — a different motion from selling SmartCity OS to a city government. Do not conflate
a CAD data-partnership conversation with a SmartCity OS sales conversation; they have different
counterparties (the appraisal district, not the city) and different asks.

## Sequencing: gated on build state, not on channel appetite

Unlike Smart Site's channel-readiness gating (Stripe activation, instrumentation), SmartCity
OS's constraint is that the template product a second city would actually buy is mid-build.
Selling the Williamson belt or presenting through TML/TCMA before the Dashboards template can
show a non-Bastrop city its own department lenses risks selling a demo that is really Bastrop's
production system with someone else's name painted on — which is exactly what the
Dashboards-template build exists to avoid (see `_smartcity_masters/00_README.md`'s ruling that
live Bastrop is an island, not the next card, and `03_build_readiness_for_sale.md` for current
state). The practical sequencing:

1. Vertosoft distribution agreement finalized and the government price list confirmed
   communicated (see `02_vertosoft_channel.md`).
2. Dashboards template reaches a state where a second city's data can populate it credibly —
   at minimum, the accessibility/VPAT evidence pack is real (not half-shipped, per
   `03_build_readiness_for_sale.md`), since a government sale routinely requires it.
3. Bastrop expansion ($1M proposal) closes or reaches a stable phase, strengthening the case
   study before it is told to a second prospect.
4. Outreach to the Williamson belt and TML/TCMA network begins, framed around what the
   template can actually show, not around what Bastrop's live (no-touch) production system
   shows.

This order is a recommendation grounded in what is verifiably built today, not an operator
ruling — the operator may choose to run outreach and build in parallel, in which case the
collateral shown must be scoped honestly to what a second city would actually receive on day
one.

## What this plan does not do

It does not treat the Williamson belt or TML/TCMA outreach as ready to start today — that
depends on the build-readiness state in `03_build_readiness_for_sale.md`, not on this document.
It does not set or imply pricing outside the ratified list and Path A framing already recorded
elsewhere. It does not enumerate county-records as part of the standard offer — that SKU is
unplaced (`02_vertosoft_channel.md`). It does not touch the Smart Site or Cortex/substrate GTM
motions, which have their own targets and their own channel.
