---
id: 2026-08-10_smartsite_pricing_and_gtm_LOCKED
title: Smart Site pricing ladder and GTM motion — LOCKED (planner handoff)
date: 2026-08-10
status: locked by operator 2026-08-10; Team included seats amended 2026-08-29 from 10 to 3
last_updated: 2026-08-29
owner: nick
related: [_smartsite_masters/06_smart_site_gtm_audiences_and_pricing, 76j_smartsite_launch_readiness_program, 2026-08-10_smartsite_humanless_gtm_handoff, _decisions/2026-08-10_market_layer_thesis_parked, 14_pricing_framework]
purpose: The locked pricing ladder and go-to-market motion for Smart Site. Hand to the planning agent for roadmap fold-in. Every number here is operator-set 2026-08-10 and supersedes the 2026-07-29 table.
---

# Smart Site pricing and GTM — LOCKED

Operator-locked 2026-08-10. **Supersedes the pricing table ratified 2026-07-29** in `_smartsite_masters/06_smart_site_gtm_audiences_and_pricing.md`; that table's Browse / Free account / $15 unlock / Pro $149-99 ladder is retired.

Scope note: this doc assumes **every capability ships**. Owner data, flood studies, terrain and CAD exports, and the rest are treated as complete because they will be by go-to-market. Coverage depth is deliberately out of scope for this document.

## The ladder

| Tier | Price | What it adds |
|---|---|---|
| **Free** | $0 | The map and all layer toggles. The inspect card (zoning, setbacks, buildable envelope, flood, land use, acreage). Save properties. 3 AI chat messages per property. **Share.** |
| **Solo** | **$49/mo** | The X-ray, the Flood and Drainage study, unlimited AI chat, unlimited properties. The full answer on one parcel at a time. |
| **Studio** | **$129/mo** | Everything in Solo plus the professional deliverables: site plan CAD (DXF, IFC), terrain export, and owner data. |
| **Team** | **$299/mo for up to 3 seats, then $25 per seat** | Everything in Studio, for a firm. Shared saved properties, seats, one bill. |
| **Prospect** | post-launch | The set-level answer. Marked **coming soon to Studio and Team**. |

**Per-property unlock: $15, 30 days** (not "forever"). The on-ramp. Breakeven against Solo is 3.3 properties, which is the right conversion pressure.

## The rulings behind the numbers

**Share is a free function.** If the share loop is the channel, gating it is self-defeating: a free user who cannot share cannot recruit, and every prevented share is a lost acquisition rather than a protected feature. The sharer is doing unpaid marketing and should meet zero friction.

**A shared property carries everything the sharer has stored.** Full fidelity, regardless of the recipient's tier. A free recipient opening a Studio user's smart site sees the whole analysis — X-ray, site plan, owner data. What is gated is what the **recipient can do on their own account**, not what they can see of what was shared. This is the strongest upgrade prompt available: not a locked feature, but a capability they just watched work and cannot produce themselves.

**Tiers split on what the output IS, not on volume of the same thing.** Free answers about a place. Solo answers about one parcel deeply. Studio produces deliverables you hand to someone else. Team does it as a firm. Prospect answers about a set of parcels. Each rung is a different job, so an upgrade reads as graduating rather than as being taxed for using the product more.

**Owner data is Studio, not Solo** (operator, 2026-08-10). Skip-trace is a professional capability, not a $49 impulse feature. It also gives Studio a second reason to exist beyond CAD, so Studio is the professional tier rather than only the architect tier.

**The architect justification is derived-not-drawn, never hours-saved.** The site base comes from a reasoning chain with citations — the envelope insets from the boundary primitive using setback atoms cited to an ordinance section. An architect is buying the hour they do not spend verifying setbacks against the code, with the citation attached if a reviewer asks. That is a capability claim that is true and checkable, and it is why the tier cannot be undercut by someone exporting parcel geometry. **Do not price or pitch it on a time-savings estimate** — that is an unverifiable claim and the approved-claims registers ban that class.

**The unlock is 30 days because data changes, not merely because "forever" is a liability.** Bastrop repealed its entire zoning code and the corpus served the dead version for six weeks. A forever-unlock is a promise to serve a current answer indefinitely on a parcel whose zoning may be repealed next year, and every re-warm to keep that promise costs compute already collected on. **Surface the expiry as a freshness property, not a paywall** — "this answer was verified on [date]" is a feature, and it makes renewal obvious rather than punitive.

**Team starts at 3 seats for the Team price.** Operator 2026-08-29 dropped the included count from 10 to 3. The $299 / $2,990 Team price and the $25/mo extra seat are unchanged. The 2026-08-10 per-head story ($29.90 vs Solo $49) applied to 10 seats and is retired. Extra seats stay monthly; annual Team cannot carry extras.

**Prospect is post-launch and marked coming soon.** The market layer is explicitly parked (`_decisions/2026-08-10_market_layer_thesis_parked.md`: no build lane, no adapter contract, no vendor applications until Texas launches). Launching three rungs and adding a premium tier later is a far easier motion than launching four and discovering the top one is empty. Naming it now gives Studio and Team headroom, so $129 reads as a progression rather than a ceiling.

## Unit economics

At Solo $49, with 20% affiliate commission and Stripe fees:

| Line | Amount |
|---|---|
| Price | $49.00 |
| Affiliate commission (20%, recurring, 12-month cap) | −$9.80 |
| Stripe (2.9% + $0.30) | −$1.72 |
| **Contribution before infrastructure** | **$37.48** |

Seats to $100K MRR at Solo-only: **2,041**. A Studio and Team mix reduces that materially, and Team accounts churn far less than individual seats. Annual pricing (roughly two months free) is the primary churn defense and should be the **default presentation**, with monthly as the alternative.

## The GTM motion

**Smart Site never gets a sales team** (operator ruling, 2026-08-10). Distribution is affiliate links to social-media group owners and influencers, plus the share loop. AI-first everywhere, humanless by design. A sales team gets built later and only for custom builds (Empressa Solutions) and municipal (SmartCity OS).

That forbids: demos, contact-us pricing, negotiated deals, onboarding calls, procurement contracts, and any tier that requires a conversation. **Team must close self-serve** — it is a launch requirement, not a later addition.

**Affiliate mechanics, locked:** 20% commission, recurring, capped at 12 months. Platform is off-the-shelf and Stripe-native (Rewardful / PromoteKit / FirstPromoter class) per `76j`, not built.

**Audience, corrected:** investor, land-flipper and agent are **one audience**, not three — they ask the same questions (can I add a unit, does it pencil, what kills this deal) and buy Solo. The real division is professionals who need the **3D and CAD deliverables**, who buy Studio. Affiliate targeting follows that split.

**The share loop is a first-class acquisition channel**, not a feature. It brings someone already in a transaction with an existing user, landing on a live analysis rather than a landing page. It deserves its own conversion target, reported next to affiliate performance.

## What has to be true (from the humanless handoff)

Full detail in `_inbox/2026-08-10_smartsite_humanless_gtm_handoff.md`. The launch-blocking subset:

1. **Self-serve-complete pricing page** — answers every objection a rep would answer, because there is no rep.
2. **Team creates itself** — swipe a card, invite colleagues, manage seats. No quote, no invoice. Launch requirement.
3. **Plan changes, cancellation, and dunning are self-service.** Dunning is absent today and is silent churn at scale.
4. **AI-first support** — grounded, cite-or-decline, in-product. Reduces human load; does not zero it. Plan for a residual.
5. **Share loop instrumented** — `share_created`, `share_viewed`, recipient-to-signup attribution back to the sharer.
6. **Funnel events with consent flags before launch, not after.** Schema already drafted in `76a`. Blocks affiliate optimization.
7. **Activation instrumentation** — first parcel inspected, first save, first report. Without it the affiliate program cannot tell a good audience from a bad one.

## Additional tier levers (available, not yet assigned)

Named for the planner; no ruling made on these.

**Alerts and saved searches** — likely the strongest retention mechanism in the product and the natural Prospect hook. Converts a research tool into a workflow.

**Export volume** — a natural meter that costs real compute, and a way to separate Studio from Prospect without adding a feature.

**Branded exports** — white-labelled X-ray PDFs with a firm's logo. Cheap to build, disproportionately valuable to a brokerage or architecture firm, and a clean Team differentiator.

**API / agent access** — architecture-true today, not commercially live. A natural top-tier or add-on when the agent channel goes commercial.

**Per-state coverage add-on** — raised and discussed 2026-08-10, then **PARKED with its mechanics settled**: `_inbox/2026-08-10_per_state_coverage_addon_PARKED.md`. Post-launch, same treatment as Prospect. The structural ruling is recorded there and does not reopen this ladder: **tier is what you can do, coverage is where you can do it** — a per-state add-on tiers with the user's existing plan (a Solo user with five states has Solo capabilities in all five), so buying coverage never buys capability. Pricing, the user journey, and a related map-filter/load-time thread are open.

## Downstream work this creates

- `_smartsite_masters/06` pricing table replaced with this ladder; the 2026-07-29 table marked superseded.
- Stripe products and prices rebuilt to match (four recurring plus the 30-day unlock). **Existing Stripe product reads "Hauska Pro" — a branding-canon violation that must not reach an external tester.** Operator has a branding scope with the planning agent; language cleanup rides that.
- Entitlement map updated to four tiers plus unlock, with the unlock time-bounded.
- Team seat management built self-serve.
- Affiliate platform configured at 20% / recurring / 12-month cap.
- "Coming soon to Studio and Team" placement for Prospect on the pricing page.
