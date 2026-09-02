---
decision_id: 2026-09-01_mls_vendor_data_closed_as_a_source
date: 2026-09-01
owner: Nick (operator), recorded by doc_repo planner
status: active
related_canonical:
  - _decisions/2026-09-01_parcel_record_rails_v2_template.md
  - _smartsite_gtm/07_rails_by_persona_pricing_input.md
  - _smartsite_gtm/01_central_texas_gtm_strategy.md
  - 09_post_saas_substrate_thesis.md
---

## Decision

**Repliers, and MLS-vendor listing data generally, is CLOSED as a data source for Smart Site.** Evaluated 2026-09-01 and declined the same day. Do not re-open it as a sourcing option without the reversal conditions below being met in fact, not in argument.

## What was evaluated

Repliers is an API-first MLS and property data platform: 500+ MLS boards, 50 US states, 13 Canadian provinces, at $182 / $275 / $365 per month on annual terms. It carries MLS listings, sold data, comparables, photos, and context layers (schools, parks, demographics). It also ships **Repliers MCP**, which connects Claude, Cursor and ChatGPT directly to live MLS listings.

The specific question tested was whether the operator's business partner being a licensed agent opens a legitimate path.

## Why it is closed, from three independent directions

**1. The subscription itself does not reach our use.** Terms of Service: *"The API services and all Service Data are for the exclusive use of the parties to this Agreement and may not be shared, resold, or made accessible to any other individuals, organizations, or third parties."* Our customers are third parties.

**2. The architecture is prohibited.** *"Copying, replicating, or storing any Service Data locally is strictly prohibited without the prior written authorization of Repliers."* Smart Site is a bake-and-store product; the atom store is the product. Termination additionally requires deleting all data and certifying destruction within thirty days, which is incompatible with a durable store and with the compounding-calibration thesis.

**3. The product we are building is named as a prohibited use.** *"Use the API or any Data Product to develop, train, improve, benchmark, validate, or otherwise contribute to any competing product, service, data product, machine learning model, or artificial intelligence system."* Smart Site is a property data product served to an AI system through an MCP connector. That clause describes it exactly.

## The agent-partner path was tested and fails on the vendor's own words

Repliers' own support channel, asked directly: *"Having an agent as a business partner doesn't by itself qualify the app. The MLS license has to sit with the agent or brokerage, and the platform must genuinely be operated as their real estate business, with leads flowing to them. A nominal affiliation isn't enough."*

Their published access requirements say the same thing in prohibitions rather than tests. Disqualified: *"Letting friends or third parties use your MLS® access for their services"* and *"Creating a separate business that uses your MLS® access."* The vendor route does not rescue it either, because a vendor *"can only create products and services for participating MLS® members, not their own products and services."*

Smart Site is our own product, it is public-facing, and it is not operated as anyone's real estate brokerage. There is no configuration of the current company that qualifies.

**This is the same shape as the Moody's ruling of 2026-07-07 and is decided the same way: never operate on a borrowed credential.** The difference here is that the credential would belong to a person the operator is close to, and an MLS violation attaches to the licensee. That makes the downside personal rather than commercial, which strengthens the decision rather than complicating it.

## What follows, and stays true

**Texas is a non-disclosure state, so sale prices are not public record.** The `salesHistory` rail therefore carries dates and events honestly and its price is `absent-verified` in Texas. The rails decision of 2026-09-01 already anticipated this and it is now confirmed rather than assumed: the price is not obtainable through any source we can legitimately use.

**Repliers is a competitor to watch, not a supplier.** They shipped an MCP into the same category P-87 and P-88 occupy, with far more distribution than us. That independently validates the connector thesis and it raises the priority of P-88, because if they are listed in the connector directories and Smart Site is not, they own discovery for the category.

**The differentiation is clean and does not depend on their data.** They answer what is for sale and what it sold for. We answer what can be done with a parcel. Their context layers are schools, parks and demographics; ours are zoning, setbacks, buildable envelope, ETJ, special districts and flood with citations. Constraint requires per-jurisdiction adjudication, which is the expensive part and does not come out of an MLS feed. Watch for them moving from context into constraint; that is the only version of them that threatens the moat.

## Reversal criteria

This reopens only if all of the following are true in fact:

1. Smart Site becomes a product whose **sole use is for licensed real estate professionals**, which means the public and free tiers, anonymous browsing, and publicly readable share links would have to go. That is a different company, not a configuration change.
2. An MLS grants a **specific vendor data license directly**, and specifically approves working with Repliers. Their documentation is explicit that *"Generic MLS® data licenses do not automatically grant permission to use our services."*
3. Counsel reviews the executed agreement. Nothing in this record substitutes for that; the terms here were read through a fetch-and-summarize tool and are recorded as evidence for a decision to decline, which is the safe direction to be wrong in.

A partner, friend, or customer holding an agent licence is **not** a reversal condition and does not become one by being restructured.

## Caveat on the evidence

The Terms of Service and access-requirements language quoted here was retrieved and summarised by tooling rather than read line by line by counsel. That is sufficient for a decision to decline. It would not be sufficient for a decision to proceed.
