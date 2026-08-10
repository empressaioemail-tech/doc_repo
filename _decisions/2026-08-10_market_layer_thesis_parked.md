---
id: 2026-08-10_market_layer_thesis_parked
title: The market layer — parcel as the join key between durable and market facts
date: 2026-08-10
status: PARKED — explore after Texas launch; do not open a build lane
owner: nick
type: strategy / direction
related:
  [
    09_post_saas_substrate_thesis,
    41_three_wedge_spine_strategy,
    _decisions/2026-08-01_scale_before_new_layers_sequencing,
    90_operations/OPS-15_owner_and_rrc_rail_gap_analysis,
  ]
---

# The market layer

**PARKED by operator 2026-08-10.** Explored in discussion, documented so it does not evaporate, and deliberately NOT opened as a build lane. Revisit after Texas launches. Nothing in this doc competes with the current track.

## The vision, in a paragraph

Every fact we hold today is **durable** — what the land IS under law and physics: zoning, setbacks, flood, geometry, easements, districts, wells. Durable facts are public, parcel-keyed, and stay true for years. There is a second class of fact we hold none of: the **market layer** — what is HAPPENING to a parcel right now. Listed for sale, under contract, sold and for how much, in foreclosure, tax delinquent, in probate, permit pulled, owner just changed. Same parcel, completely different class of fact: perishable, often licensed, and frequently asserted by an interested party rather than established by record. **The parcel is the join key between the two layers.** We already own the durable side statewide, which is the hard and boring half nobody else did. The market layer is what makes it answer a question people pay for today.

## Why the reframe matters

The obvious framing is "build an MLS integration." That builds one thing. The better framing is **a market-source adapter contract** where MLS is merely the first implementation — because every market source answers the identical question, *"which parcels are in play, and why?"*, and differs only in the trigger:

| Source | Signal | What it says | Licensed? |
|---|---|---|---|
| MLS | active listing | for sale, priced | YES — per-MLS vendor approval |
| Auction / foreclosure | trustee sale | distressed, dated | public record |
| Tax delinquency | county roll | owner under pressure | public record |
| Probate | court filing | estate, motivated | public record |
| Code enforcement | violation | problem property | public record |
| Permits | filing | someone is already building | public record |
| FSBO / off-market | feed or scrape | for sale, unlisted | varies |

All of them carry: a **parcel key**, an **event type**, a **date**, a **status**, and **source-asserted attributes**. That is ONE contract with a discriminated `signalKind` — structurally the same move as `districtType` on the mud rail or `rrcAsset` on wells (per the R1 split rule: split on source+geometry, subcategorize on attribute).

## The defensible asymmetry — flip the primary axis

The listing side is a commodity; every IDX vendor has it. The buildability side is what nobody can answer. But the actually defensible thing is neither:

> **We can answer buildability for parcels that are NOT listed.**

Any vendor shows you 400 listings. We can show the 12,000 parcels in a county where a second unit fits, and THEN note which 40 happen to be for sale. That inverts the product: not listing search with extra data, but **opportunity search with a listing filter**. The buildable set is the universe; the market source is one lens on it.

Consequences of the inversion:
- It degrades gracefully. Thin MLS coverage still leaves the buildable universe intact.
- It serves buyers with no MLS access at all — land buyers, small builders, investors — who think in "what could I build," not "what is listed."
- **Market x market may beat durable x market.** *Tax-delinquent AND buildable for a second unit AND not listed* is a lead list nobody can generate, needs NO vendor license, and is entirely public record — clean against the no-privileged-data commitment.

## The output shape

PE's brief leads with a verdict about one parcel. The market-layer surface leads with a verdict about a SET:

> *Of 340 active listings under $400k in Bastrop County, 47 have a buildable envelope supporting a second unit. 12 are in SF-1 where ADUs are permitted by right. 3 sit in a flood zone.*

Every number cited, every parcel clickable into the existing brief. Same reasoning-with-provenance commitment, applied at set scale rather than parcel scale.

## What is genuinely different about market facts (design for it, do not discover it)

1. **Freshness contract.** Durable facts are true until superseded. Market facts are true AS OF a timestamp and decay in days. This is the first perishable thing we would hold; staleness must be visible in the product, not just a field.
2. **Truth model.** A list price is a seller's OPINION; "3 bedrooms" is agent-entered and often wrong. We would be citing that someone SAID it, not that it is true. That distinction must survive into the output.
3. **Access policy.** Licensed sources dictate who may see the data, for how long, and whether it can be cached. Pushes into `tenant-private` / license-scoped territory we have barely used.
4. **Economics.** Durable facts amortize — acquire once, serve for years. Market facts are a permanent subscription cost that stops being worth anything the day you stop paying.

## Portal APIs — checked, and the answer is no

Zillow retired its public property API; what remains is **Bridge Interactive** (Zillow-owned), which brokers MLS data to approved vendors — an MLS licensing motion, not a Zillow-data motion. Redfin has never had a meaningful public API. Realtor.com licenses through partnerships. **The pattern is consistent: the portals do not sell their data, because the data IS the business.** There is no shortcut around MLS licensing, which is precisely why IDX vendors exist as a category.

Strategic read: **the portals own attention, not the answer.** They win because consumers start there. A builder asking "where can I add a unit" was never going to start at Zillow, because Zillow structurally cannot answer it.

*Confidence note: high on Zillow's public API being retired and Bridge being the partner path; less current on Bridge's present terms. Verify before it is load-bearing.*

## Prerequisites this vision imposes on the current build

These are the reasons to write the vision down NOW even though the build is later. All three are advanceable without touching MLS:

1. **Address-to-parcel resolution.** Every market source arrives keyed by an address or an internal id, never by `county:prop_id`. **The join IS the product.** Promoted to current-track work — see `_inbox/2026-08-10_address_to_parcel_resolution_scope.md`.
2. **Buildability queryable as a SET, not derived per parcel.** "Every lot where a second unit fits" is a county-wide filter. If the envelope only exists after someone asks about one parcel, the set query is impossible. Argues for envelope coverage being DENSE in metros, not merely reachable.
3. **Zoning must carry permitted-use, not just district.** The ADU question needs the permitted-use table, not `district: SF-1`. The chain exists (`zoning-fact.codeSectionRefs.permittedUseTable`) — whether it is POPULATED widely enough to filter on is unverified and worth checking.

## Test path when it unparks

Valerie (partner, eXp Realty) holds MLS credentials — the natural first test without any vendor-approval motion. Before that, a **paste-a-list** version needs no license at all: an agent or builder pastes addresses from their own search or CRM, and Smart Site returns the buildability join. Same value, days not quarters, and it answers the question that actually matters — *do buyers care enough about the buildability join to change their workflow?* — before spending on plumbing.

## Explicit non-goals while parked

No build lane. No adapter contract drafted. No MLS vendor applications. No competition with the Texas flush, the five unapplied rails, or the launch gate. This document exists so the thinking survives, not to start work.
