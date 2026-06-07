---
id: 2026-06-07_smartcity_collateral_production_QUEUED
title: Dispatch - SmartCity gov collateral production (Forrest + Vertosoft pack)
date: 2026-06-07
agent: TBD (Replit Agent or cc-agent for HTML/deck build)
repo: collateral build (no product repo)
kind: dispatch
status: QUEUED (do not fire - pricing-independent assets fire on operator go; pricing slide gated on gov pricing decision)
related: [00_current_state, 07a_smartcity_product_positioning, _prospects/vertosoft/2026-06-07_vertosoft_channel_and_offer, 06_cities_value_narrative]
---

# SmartCity gov collateral production

> **HOLD - QUEUED.** Pricing-independent assets (overview deck, per-product one-pagers, Bastrop case study, non-pricing channel pack) fire on operator go. The pricing slide and the channel-pack pricing tiers are gated on the government pricing tiers / list price (operator decision, not yet set). Do not invent pricing or metrics.

## What this is

Produce the SmartCity product-line collateral pack ([`07a_smartcity_product_positioning.md`](../07a_smartcity_product_positioning.md) collateral section), serving Forrest (city-domain SME and rep) and Vertosoft (distributor). Mirror the Mox collateral build pattern (standalone branded HTML plus a walkthrough deck plus an executive summary), SmartCity/gov-branded, use-case-first. The Bastrop deployment is live, so use real screenshots and real metrics, not placeholder mockups.

## Read first

1. [`07a_smartcity_product_positioning.md`](../07a_smartcity_product_positioning.md) - the positioning, the four products use-case-first, the buyer rule, the collateral list and sequence
2. [`06_cities_value_narrative.md`](../06_cities_value_narrative.md) - the Bastrop narrative (Sylvia runs the city from her phone, click-a-parcel, four-inches-of-rain)
3. [`_prospects/vertosoft/2026-06-07_vertosoft_channel_and_offer.md`](../_prospects/vertosoft/2026-06-07_vertosoft_channel_and_offer.md) - the channel, the SKU framing, the keep-the-rail-quiet discipline

## Scope

**In scope (fire on operator go, pricing-independent):**

- Overview deck, use-case-first, the `Mox_Intelligence_Overview` analog, SmartCity/gov-branded.
- Four per-product one-pagers: dashboard (one pane of glass), plan review (Codex), parcel/property intelligence, ambient capture extension. Each problem-statement first, solution second, Bastrop proof third.
- Bastrop case-study / problem-statement one-pager, the lead asset. Built from real Bastrop screenshots. Metrics must be real and source-attributed (quality gate); flag any number that cannot be sourced rather than inventing it.
- Channel-partner pack (non-pricing portions): positioning, problem statements, contract-vehicle list, how-to-position cheat sheet for Vertosoft's team and Forrest.

**Gated (hold until pricing decision):**

- The deck's pricing slide.
- The channel pack's pricing-tier table (per-city annual subscription tiered by population/size, plus onboarding PS).

**Out of scope:**

- Setting the price (operator decision).
- The substrate / calibration / revenue-share plumbing in the pitch (keep it quiet, use-case-first per I7 and Vertosoft's advice).
- AWS-specific framing (the verified stack is GCP Cloud Run + Neon; the AWS-vs-GCP call on the Vertosoft agreement is operator-gated).

## Acceptance criteria

- All pricing-independent assets produced, SmartCity/gov-branded, use-case-first.
- Bastrop case study uses real screenshots; every metric source-attributed or flagged.
- Channel pack usable by Forrest and Vertosoft without further editing (minus the pricing table).
- Pricing slide and pricing-tier table left as clearly-marked placeholders pending the operator pricing decision.

## Reporting

Deliver the assets to the operator-designated location; write a short completion note to `P:\doc_repo\_inbox\` listing assets produced and any metric that could not be sourced.
