---
id: 2026-08-10_smartsite_humanless_gtm_handoff
title: Smart Site humanless GTM — what has to be true (planner handoff)
date: 2026-08-10
status: handoff for roadmap fold-in
owner: nick
related: [76j_smartsite_launch_readiness_program, 76a_operator_autonomous_loops, 76i_smartsite_contribution_economy_roadmap, _smartsite_masters/06_smart_site_gtm_audiences_and_pricing, _smartsite_masters/05_smart_site_product_walkthrough, 14_pricing_framework, empressa-trading/apps/cockpit/docs/GTM_AUTONOMY_T1_SPEC]
purpose: Fold into the Smart Site roadmap. The operator ruling is that Smart Site never gets a sales team — affiliate + share-loop distribution, AI-first, humanless by design. This doc states what must be true for that to work, what already exists, and what is missing. Sales exists only for custom builds and municipal.
---

# Smart Site humanless GTM — what has to be true

## The ruling (operator, 2026-08-10)

**Smart Site never gets a sales team.** Distribution is affiliate links to social-media group owners and influencers, plus the share loop. AI-first on all things, with an effort to be humanless. A sales team is built later, and only for custom builds (Empressa Solutions) and municipal (SmartCity OS).

This is a stronger constraint than "affiliate-led" and it forbids specific things: no demos, no contact-us pricing, no negotiated deals, no onboarding calls, no annual contracts through procurement, and **no enterprise tier that requires a conversation**. A firm or team offering must close self-serve or it does not exist.

The consequence to design around: **the product is the sales force.** The free inspect card, the share loop, and the honest-absence behavior do the closing. Everything else must be built so nobody ever needs to ask a human a question.

## What already exists (do not rebuild)

Verified 2026-08-10 across doc_repo and empressa-trading.

**Shipped in Smart Site.** Entitlement, paywall and dev-role work merged 2026-08-05 (LDT #387, hauska-map #152); external testers run the real checkout with Stripe promo codes rather than a bypass. Rate-limit store moved to Postgres. Neon pooling done on all six serving DSNs. `smartsite.cloud` purchased. The free inspect card, the workbench, and the share link that carries the analysis are live.

**Decided in `76j`.** Affiliate platform is off-the-shelf and Stripe-native (Rewardful / PromoteKit / FirstPromoter class) rather than built — that buys per-affiliate links, attribution windows, conversion tracking against Stripe subscriptions, an affiliate portal with payouts, and promo-code pairing. Launch gating is Texas-first: no out-of-state launch until the factory has those states flush.

**Proven next door in empressa-trading.** A full self-serve billing stack is shipped and tested — checkout, portal, webhook-as-sole-writer of subscription state, a tier→limits entitlement map, and 402 gates on live endpoints. Also shipped: funnel aggregates (activation, conversion, retention) and a governed autonomy model with policy tiers 0-3 and a steward loop. **These are patterns to copy, not code to port** — different stack, different product. The billing shape in particular (webhook is the only writer; clients cannot self-upgrade) is worth replicating exactly.

**Specified in `76a`.** Policy tiers for autonomous GTM: Tier 0 auto (in-app nudges, T1 support replies, referral credit), Tier 1 auto-if-confident (templated lifecycle email, content publish), Tier 2 propose-and-approve, Tier 3 design call. Consent flags are first-class on every event, and the year-zero rule is that they cannot be retrofitted. The event schema and event-type list are already drafted.

## What has to be true — the eight conditions

Ordered by how badly their absence blocks humanless operation.

### 1. A stranger can buy without asking anything

The pricing page has to answer every objection a rep would answer. What happens at the property cap; whether a specific county is covered; what "not verified" means; what happens to saved work on cancel; whether it is a survey; refund policy. If a prospective buyer has a question the page does not answer, the sale dies silently and you never learn why.

**Gap.** No self-serve-complete pricing page exists. The coverage answer today is "confirm on request," which is a human in the loop by definition. Needs a self-serve coverage answer — a checkable map or a plain statement of how rolling coverage works, with the honest per-parcel behavior named as the safeguard.

### 2. Team/firm accounts create themselves

Someone swipes a card and invites colleagues. No quote, no seat negotiation, no invoice.

**Gap.** No team tier exists in the model, and no self-serve team creation, invite, or seat management exists in the product. If a firm offering is wanted, this is the build. If it is not built, **do not put a team tier on the pricing page**, because a team tier that requires a conversation breaks the ruling.

### 3. Plan changes, cancellation, and failed payments are self-service

Upgrade, downgrade, cancel, and card-failure recovery all without email. Stripe Customer Portal covers most of it out of the box.

**Gap.** Dunning is nowhere in either repo. A failed card at 1,500 seats is a steady drip of silent churn that nobody notices. This is small to build and expensive to skip.

### 4. Support is AI-first, grounded, and cannot invent

The operator ruling is AI-first everywhere. For support that means an in-product answer surface grounded in real docs and the product's own records, with the same anti-fabrication discipline the product already enforces: cite or decline.

**Gap.** There is no support surface at all in Smart Site. empressa-trading has eight written help-center articles that are unhosted and not in-app, plus a strong unscheduled spec for an "Ask Help" progressive-disclosure agent. That spec is the model. **Honest note:** AI-first support reduces human load, it does not zero it. Plan for a residual few hours a week rather than discovering it.

### 5. The share loop is instrumented and optimized as a channel

This is the highest-leverage under-exploited asset and it deserves as much design attention as the affiliate program.

Affiliates bring strangers who might be interested. The share loop brings someone who is **in a transaction right now with a person who already uses the product**, landing on a live analysis rather than a landing page. That is a better converter than any ad, and it costs nothing.

**Gap.** The share link exists; the loop is not instrumented and not designed as a funnel. What is needed: `share_created` and `share_viewed` events (already named in the `76a` schema), a recipient path built to convert rather than merely display, an attribution join so a recipient who signs up is credited to the sharer, and a reason for the sharer to keep sharing. **Recommendation: treat share as a first-class acquisition channel with its own conversion target, reported next to affiliate.**

### 6. Funnel events exist before launch, not after

Consent-flagged events on every step: browse started, parcel inspected, signup, property saved, paywall hit, unlock started, subscription created, share created, share viewed, churn. Without these, the affiliate program cannot be optimized and the share loop cannot be proven.

**Gap.** No product analytics in either repo (empressa-trading's `posthog_configured` is hardcoded false). `76a` has the schema drafted and the year-zero consent rule; adopt it rather than redesigning. This blocks everything downstream and should land before affiliate launch, not after.

### 7. Onboarding replaces the demo

A new user reaches a first useful answer without help. The inspect card already does most of this — it is free, instant, and needs no login, which is the best activation surface in the portfolio.

**Gap.** No activation instrumentation. Nothing fires on first parcel inspected, first property saved, first report opened. Without an aha-moment metric the funnel cannot be tuned, and the affiliate program cannot tell a good audience from a bad one.

### 8. Affiliate mechanics are decided, not just the platform

`76j` picked the platform class. Still owed: commission rate and whether it is recurring or one-time, the attribution window, what an affiliate actually receives (link, promo code, demo video, one-line pitch, approved claims), the payout rail and threshold, and anti-gaming rules.

**Recommendation on structure:** recurring commission capped at twelve months. Recurring aligns the affiliate with retention rather than churn-and-burn; the cap protects long-run margin. Industry standard is 20-30 percent, and the financial model in `76j` gates how aggressive the offer can be.

**Recommendation on what they sell:** an affiliate cannot sell "property intelligence." They need one outcome an audience already wants — "find out if you can add an ADU," "check what the water does before you buy," "get the site base without paying for a survey." One line, one demo, one link. That is a positioning deliverable, and it constrains which audiences work.

## The pricing question this opens

Not resolved here; flagged because the humanless ruling changes it.

**Self-serve has a price ceiling.** Above roughly $100-150/mo, buyers want to talk to someone before committing, and conversion falls off without a human to reassure them. That caps ARPU and pushes toward volume.

**The current model has problems worth revisiting** (`_smartsite_masters/06`, ratified 2026-07-29): the $15-per-property-forever unlock has a 6.6-property breakeven against $99 Pro, teaches the buyer to think in $15 increments, and carries an unbounded liability (every future report on that property, free, forever) against a one-time fee. Its keep/kill is already an open operator call in `_inbox/2026-08-09_76j_billing_surface_audit.md`. There is also no tier between free and $99, and "unlimited" prices on nothing when properties are the natural value metric.

**Working target check.** $100K MRR at $99 is ~1,000 seats; at $33 it is ~3,000. Either is a real affiliate program running for a year-plus, and both live or die on churn — at 5-8 percent monthly, 3,000 seats means replacing 150-240 cancellations before growing. Annual pricing (two months free, already in the model) is the main defense and should be the default rather than an option.

## Sequencing recommendation

These fold into `76j`'s existing sequence rather than replacing it.

**Before affiliate launch:** funnel events with consent flags (condition 6), activation instrumentation (7), the self-serve-complete pricing page (1), dunning (3), and the affiliate mechanics decision (8).

**Alongside:** the AI-first support surface (4) and share-loop instrumentation (5). Share-loop work is the item most likely to be under-prioritized and most likely to outperform the affiliate program per unit of effort.

**Only if a firm offering is wanted:** self-serve team creation (2). Otherwise leave team off the pricing page entirely.

**Unchanged from `76j`:** Texas-first gating, the capacity audit as the launch go/no-go, and the Stripe branding defect (the product currently reads "Hauska Pro," a canon violation that must not reach an external tester).

## Open decisions for the operator

1. **Team tier: build self-serve or drop it.** No middle option under the ruling.
2. **The $15 unlock: keep, kill, or reshape** (time-bounded at a higher price is the third path).
3. **Solo price point**, which sets the seat count needed for $100K and interacts with the affiliate commission.
4. **Commission rate and structure** — recommendation above is recurring, capped at twelve months.
5. **The one-line affiliate pitch and the target audiences.** Investor/land-flipping audiences pay professional prices; agent audiences are larger and cheaper.
