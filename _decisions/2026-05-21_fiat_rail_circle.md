---
decision_id: 2026-05-21_fiat_rail_circle
date: 2026-05-21
owner: Nick
status: active
related_canonical: [14_pricing_framework, 16_commercialization_roadmap, 09_post_saas_substrate_thesis, 72_hauska_inc_operations]
---

## Decision

Circle is the Hauska v1 fiat settlement rail, superseding the Stripe Connect placeholder named in `14_pricing_framework.md`.

## Context

`14_pricing_framework.md` pinned Stripe Connect as the v1 fiat-rail candidate on 2026-05-18. The 2026-05-21 cross-repo reconciliation read the actual `hauska-sdk` and found the payment package was already built Circle-shaped: the fiat provider type is hardcoded `provider: "circle"`, and there is zero Stripe code anywhere in the repo. The doc and the code disagreed. Nick resolved the disagreement in favor of the code reality rather than re-pointing the SDK at Stripe.

## Structural commitment check

Pre-mortem run 2026-05-21, cleared green. Circle is a Layer 2 settlement rail and does not touch the free Layer 1 tier or the reasoning-chain contract. It is core Hauska payment substrate, so it sits on the Hauska spine. No load-bearing commitment is touched.

## Reasoning

The SDK was authored Circle-shaped in April 2026 and carries 391 passing tests, including a production-grade USDC crypto rail. Re-pointing it at Stripe Connect would be a discard of built work for no named benefit. Circle is also USDC-native, so it unifies the fiat rail with the existing USDC crypto rail (Base, Ethereum, Polygon) under one provider relationship rather than splitting settlement across two. The reconciliation also corrected a second drift: the doc framed the fiat rail as "a single TODO away" (the Circle checkout-URL function at `payment-request.ts:253`). That is wrong. The fiat rail is a near-greenfield build regardless of provider: there is no Circle payment creation, no webhook handling, and no Circle-side verification. This decision settles the provider; it does not change the build status, which is Wave 2 step 3 work.

## Reversal criteria

Revisit if Hauska Inc. corporate-readiness work (banking, money-transmitter posture) surfaces a regulatory or onboarding blocker with Circle that Stripe Connect would not carry; if Circle's terms for a substrate-style usage-routed marketplace prove unworkable; or if a fiat-preferring counterparty at first paid Layer 2 contract requires a rail Circle cannot serve.

## Dependencies

Depends on the hauska-sdk reconciliation finding (verified 2026-05-21). Feeds `16_commercialization_roadmap.md` step 3 (Stream 2B Stripe-and-self-serve signup, which is re-scoped to Circle) and Hauska Inc. corporate readiness in `72_hauska_inc_operations.md` (Circle's KYC and money-transmitter implications, not Stripe's, now drive the regulatory checklist). Does not block Wave 1.

## Counterparties

Internal. Affects Hauska Inc. payment-substrate operations and the Wave 2 paid-tier build. Circle is the prospective payment-processor counterparty; no agreement is in place.
