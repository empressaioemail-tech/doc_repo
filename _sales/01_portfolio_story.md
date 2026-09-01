---
id: sales_pack_portfolio_story
title: The portfolio story — one base layer, many applications
status: active
last_updated: 2026-07-29
applies_to: portfolio (sales-facing)
related: [sales_pack_readme, 07_product_line_summary, 06_cities_value_narrative]
owner: nick
---

# The portfolio story

This is the one story that connects everything we sell. Learn it once and every product becomes a chapter of it.

## The problem everyone shares

Everyone who touches property (homeowners, realtors, investors, builders, architects, property managers, cities) has the same problem: the information about any property is scattered across a dozen disconnected places. The appraisal district has one piece. The county courthouse has another. FEMA has the flood map. The city has zoning, permits, and code enforcement. A property manager has six software systems that do not talk to each other. A city has a dozen.

Answering a simple question like "can I build an ADU behind this house" means digging through all of them, or calling the city and waiting.

## What we built: the digital twin base layer

We built a living digital representation of property. Start with one parcel:

- The property boundary is not just a line on a map. It knows it is a boundary, knows which side faces a road and which is an interior lot line, and knows what is on each side of it.
- The roads are not just gaps between parcels (which is all an appraisal district gives you). We built the roads as real objects that know their classification, their easements, and which properties they serve.
- Because the boundaries and roads understand themselves, the system can calculate real things: setbacks, buildable envelopes, road frontage. That is not possible with a plain map.
- Topography, aerial imagery, flood zones, zoning, permits, and ownership records all attach to the same twin.
- When something changes in the real world (a sale is recorded, a permit is pulled, a new appraisal goes out), the twin updates. It is a living record, not a snapshot.

Every piece of data in the twin carries its source, a confidence signal, and a timestamp, and records are anchored with blockchain-based event anchoring in the underlying data layer, making the record tamper-evident. When the system does not have verified data for a place, it says "not verified here" instead of guessing. That honesty is a design feature and a differentiator: prospects have been burned by tools that make things up.

Coverage today: Bastrop is the deepest deployment, Central Texas is live, and expansion across Texas is in progress. (Exact coverage claims: see `05_faq_and_approved_claims.md`.)

## The layer cake: same base, different applications

The base layer is the same for everyone. What changes is what gets stacked on top:

| Buyer | What stacks on the base layer | Product |
|---|---|---|
| Realtors, investors, builders, homeowners | Setbacks, buildable envelopes, flood, reports, site plans, terrain files, AI chat | Property Explorer |
| Property operators (Mox-style) | Their buildings as twins, plus their existing systems (accounting, leasing, maintenance, utilities) wired into one view | Custom build / property operations platform |
| Cities | Their infrastructure (water lines, streetlights, permits, code enforcement, police, finances) wired into one pane of glass | SmartCity OS |

The pitch pattern is identical at every scale: "We start with a base layer of intelligence about your property. Then we wire the systems you care about on top of it. Instead of logging into six places to get one answer, you get one view." Discovery is just finding out which systems and which pain points matter to this buyer.

## Why this matters competitively

Anyone can show a map. The difference is:

1. **The twin is self-aware.** Boundaries, roads, and easements carry meaning, which is what makes automatic setbacks, envelopes, and site plans possible at all.
2. **It spans private to municipal.** The same technology serves a homeowner's back yard, a 300-unit apartment portfolio, and a city's water system. Nobody else covers that range on one base layer.
3. **Everything is cited and honest.** Every answer traces to a source with a timestamp and confidence. No black box, no made-up data.
4. **It is built on public records, uniformly.** No dependence on any private data vendor, no special-access deals. It works the same in any jurisdiction, which is what makes expansion fast.

## How to use this story

Do not open with it. Open with the buyer's problem and the specific tool that solves it (the relevant product file in this pack tells you how). Bring out the layer-cake story when the prospect asks "how does this work" or "what else can it do," or when you are upselling from one layer to the next: a realtor's brokerage might want a custom build, a property owner client might lead you to their city.
