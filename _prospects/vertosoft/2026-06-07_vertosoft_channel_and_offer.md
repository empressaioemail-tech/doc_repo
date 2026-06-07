---
id: 2026-06-07_vertosoft_channel_and_offer
title: Vertosoft — government GTM channel and refined product offer
date: 2026-06-07
kind: channel-partner
status: moving-forward-distribution-agreement-pending
related: [07_product_line_summary, 06_cities_value_narrative, 46_smartcity_parcel_intelligence, 30a_smartcity_stabilization_sprint, 73_partnerships, 08_tiered_access_model, 14_pricing_framework]
owner: nick
---

# Vertosoft — government GTM channel and refined offer

> **What this is.** First in-repo record of Vertosoft. Source: the 2026-06-07 meeting (Nick + Val + Vertosoft rep), transcript on file. We are moving forward; distribution agreement pending. Captures who they are, the deal shape, and the refined product offer + operator decisions.

## What Vertosoft is

A public-sector technology distributor and reseller. Their value to us is twofold: contract-vehicle access (the cooperative-purchasing on-ramps municipalities buy through without a full RFP) and a channel sales motion into government. They are also a strategic AWS partner.

- **Contract vehicles:** broad Texas coverage (Omnia, Sourcewell, GSA, TIPS) plus national cooperatives (NASPO, Omnia, Sourcewell, TIPS) and state-specific contracts (Virginia, Massachusetts, California). Thousands of downstream partners to cover any gap or special designation.
- **Business model:** markup only. They take a cost from us, mark it up a few points, sell to the government. No charge to get added to contract vehicles; they carry the cost of getting us on vehicles, manage the contracts, keep prices updated, pay fees, and do the reporting. They make money on the per-transaction markup.
- **Sells use-case-first:** the gov buyer cares about the problem solved, not the tech. They will help translate the Bastrop deployment into a problem statement and use case, and train their sales team to position it.

## Deal shape (from the meeting)

- **Distribution agreement** = core agreement + an optional professional-services addendum (only if we do time-and-materials/hourly billing) + two AWS addendums (AWS payer-account management + the AWS accelerator/marketplace-certification program).
- **Onboarding after signing:** partner onboarding forms (finance, marketing, sales, contracts), a contracts-team call to prioritize which vehicles to pursue first, then a sales kickoff so their team understands and can position the solution.
- **Our contact to them:** the gentleman being onboarded with city-management / plan-review background acts as the sales-rep contact.
- **Prophecy AI** connection noted: Bastrop uses Prophecy (part of our dashboard via integration), and Prophecy is also in the Vertosoft orbit — that adjacency is how Vertosoft surfaced.

## Refined offer (the convergence with the SmartCity product line)

Vertosoft resells a packaged, priced product. The product is **SmartCity OS as the sharpened government SKU** (the four-surface line): the dashboard (one pane of glass), plan review (Codex), parcel/property intelligence, and the ambient capture extension for city staff. Sold as an **annual per-city subscription, tiered by city size**, plus onboarding professional services. The sales narrative is the Bastrop use case ([`06_cities_value_narrative`](../../06_cities_value_narrative.md)): Sylvia managing the city from her phone, proactive, click-a-parcel-see-everything, "four inches of rain in 24 hours." This is a Layer 3 integrated-product sale to cities, distinct from the Layer 1/2 agent-builder substrate model (Decision B) and from the internal cost-per-jurisdiction target.

## Operator decisions to lock

1. **Government pricing model and list price.** Vertosoft needs a clean list price to mark up. Per-city annual subscription tiered by population/size, plus onboarding PS. The internal unit economics (under $200 compute + 1 hour human review per jurisdiction) are the cost floor; the gov list price is the external number. Not yet set.
2. **AWS vs GCP, flag.** Vertosoft's headline value-adds beyond contract vehicles are AWS-specific (payer-account management, AWS accelerator, AWS marketplace certification). Our verified stack is **GCP Cloud Run + Neon**, not AWS (cortex-api, mcp-server, smartcity-api all on Cloud Run per the cross-repo recon). The contract-vehicle and reseller value is cloud-agnostic and is the real fit; the two AWS addendums likely do not apply unless we deploy to AWS. Decline or strike the AWS addendums in the redline, or clarify whether Vertosoft supports GCP-deployed solutions on the cooperatives. Do not let the distribution agreement commit us to an AWS-marketplace path our infrastructure does not match.
3. **Contract-vehicle priority.** Which vehicles first (TX-focused: TIPS, Omnia, Sourcewell, BuyBoard?) given the Central Texas -> Dallas -> Houston rollout.
4. **SKU scope.** SmartCity OS only, or Codex / parcel intelligence as named add-on SKUs Vertosoft can also carry.
5. **Sales-rep assignment** confirmed (the city-management onboardee as the Vertosoft contact).

## Thesis check

Clean GTM channel, no conflict. Vertosoft is procurement and channel, not a data aggregator: cities remain licensors with revenue share (Bastrop template, partnership-first intact). It is the Layer 3 product-to-cities motion, additive to the substrate model. The one discipline note: keep the rev-share / substrate plumbing quiet in the gov pitch (sell the use case, per Vertosoft's own advice and I7).

## Revision history

- 2026-06-07, origin. Logged from the Vertosoft meeting; refined offer tied to the sharpened SmartCity product line; AWS-vs-GCP discrepancy flagged.
