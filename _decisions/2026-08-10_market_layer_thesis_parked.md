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

---

# Operator amendments 2026-08-10 (both sharpen the honesty mechanics)

## A. Perishable facts need a DECAY MODEL, not just a timestamp

The currency-verification gate we have is built for **editions and re-plats** — slow-moving things where "is this the current edition" is the question and the answer changes on the timescale of ordinances. A zoning district cited to a 2025 adoption is true until repealed, and the repeal is itself a citable public event.

Market facts are not like that. **A listing status is true until it isn't, and it can go stale silently within hours.** No event fires on our side. Nothing gets superseded. It simply becomes wrong.

So the market layer needs a **freshness contract per signal class**, not a shared timestamp field:

- How old is too old **for this class**? A sold price is durable-ish once recorded. An active-listing status is stale in days. A pending status can flip in hours. These are not the same number and must not share one.
- What does the system **DO** when a market fact exceeds its window? The answer is `honest-decline` on the market layer.

**The property that makes this elegant: the parcel does not go dark, the perishable half just goes quiet.** The durable layer keeps answering — zoning, setbacks, envelope, flood are all still true — while the market layer declines with its reason ("listing status last verified 9 days ago; exceeds the 48-hour freshness window for active-listing"). That is a strictly better failure mode than either serving a stale price or blanking the parcel, and it falls straight out of the durable/market split rather than needing new machinery.

This also means **staleness is a first-class field on the market atom**, sized per `signalKind`, and the freshness window belongs in the adapter contract — not in the consumer.

## B. The interested-party problem is a FEATURE, not a labelling chore

The deeper point: provenance labelling ("a seller asserted this") is table stakes. The real payoff is **reconciliation** — putting the interested party's claim next to the record and disclosing the conflict.

> A listing says 2,400 sq ft. The CAD roll says 1,980.

Both are "facts." One is asserted by someone with an interest in the number being larger. **Nobody else can ship the comparison**, because it requires holding the public record independently of the market feed — which is exactly the durable/market split. Portals hold only the listing side; the CAD holds only the record side; we would hold both keyed to one parcel.

This is the reconciliation rule already in the technical white paper — **draw from one, disclose the other** — applied to a new pair. It should be named explicitly as a product capability, not left implicit in the frame.

### THE CONSTRAINT, measured 2026-08-10 — we mostly cannot do this yet

The comparison requires structural facts on the record side. Verified live against `cad_property` (4,599,477 rows / 15 counties):

| Field | Populated | Share |
|---|---:|---:|
| `living_area_sqft` | 483,912 | **10.5%** |
| `year_built` | 467,141 | 10.2% |
| `land_acres` | 766,214 | 16.7% |

And it is **not thin-everywhere — it is all-or-nothing per county**:

| County | rows | sqft % |
|---|---:|---:|
| Williamson 48491 | 319,480 | **76.9%** |
| Hays 48209 | 265,852 | **69.3%** |
| Bastrop 48021 | 77,073 | **52.7%** |
| Caldwell 48055 | 48,382 | 27.9% |
| **Bexar / Dallas / Tarrant / Travis / Collin / Denton** | ~3.3M | **0.0%** |

**Root cause found, and it is a source-tier gap rather than a defect.** Counties WITH structural facts were ingested from **direct CAD exports** (`DATA-EXPORT-01.14.2026.zip`, `property.csv`). Counties WITHOUT came from **TxGIO StratMap** (`stratmap25-landparcels_*`), which carries `owner_name` and `market_value` but no building characteristics. Bexar shows 703,258 rows with 697,088 owners, 695,443 market values, and **zero** square footage.

**Consequence for the thesis:** the sq-ft reconciliation — the most vivid example of the feature — works today in Williamson, Hays, and Bastrop, and nowhere in the metros where listings actually concentrate. Fixable per county by acquiring the CAD export instead of relying on the StratMap roll, which is a known, bounded acquisition motion (the F1 CAD registry lane already does exactly this). It is NOT a reason to weaken the thesis; it IS a reason to not promise the sq-ft demo in a metro before the export lands.

**Reconciliations that DO work statewide today**, on facts we hold at full coverage: land area (shoelace geometry vs listing lot size), zoning district and permitted use vs listing claims ("zoned commercial", "ADU potential"), flood zone vs silence in a listing, and owner of record vs listing agent's stated seller. Those need no additional acquisition and are arguably harder for a portal to contradict than square footage.
