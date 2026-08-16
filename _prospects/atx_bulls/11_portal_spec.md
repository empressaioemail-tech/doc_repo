---
id: atx_bulls_11_portal_spec
title: Fan portal specification — build detail behind the mockup
status: draft
last_updated: 2026-08-13
applies_to: portfolio
owner: nick
related: [atx_bulls_10_fan_platform_vision, atx_bulls_05_technology_control_plan, atx_bulls_01_fan_monetization_now]
purpose: The buildable specification for the fan portal - entities, user classes, screens, gating, commerce mechanics, and build order. Written while the design mockup is in flight so the first draft gets evaluated against a spec. Pricing and the three pass forks (cap, band, transferability) remain open per Nick; this doc specs mechanics, not prices.
---

# Fan portal specification

## Form factor and posture

Mobile-first PWA (installable, offline-tolerant for the account card and tickets later; list-first layouts), desktop-usable. One web property. The account is the center; everything else is a surface on it. Three user classes share the platform: **fans**, **players**, and **staff**. The design mockup in flight covers the fan class only; the other two are specified here so the build is scoped honestly.

## Identity and auth

1. Fan signup: email magic-link first (lowest friction for the capture window); optional passkey upgrade after first login (custody gradient: hosted at birth, self-custody optional and invisible until wanted). No passwords.
2. Member number: sequential by account creation, assigned at signup, permanent. Everyone gets one, free or paying.
3. **Day One era badge**: any account created before first kickoff (2027-03-20). Imported VIP-list contacts get their badge stamped with their **original signup date** honored from the import, not the migration date. This makes the import an upgrade for early fans, not a paperwork event, and is the single best goodwill move available in week one.
4. Founding Pass number: separate namespace from member number, 1 to cap, assigned at purchase in order. A reserved block (recommend 1 through 21, matching a roster-sized symbolic set) is held back for team use: auctions, honors, partnerships. Assignment logic must be deterministic and disputeproof (payment-settled order).
5. Player and staff logins: same auth rail, role-flagged.

## Data model (portal-level entities)

| Entity | Key fields and rules |
|---|---|
| FanAccount | memberNumber, joinedAt, eraBadge, source provenance (import vs organic, channel), consent flags (terms, marketing), segments (fan, founding, member, deposit-holder, tryout-applicant), passkey enrolled or not |
| FoundingPass | passNumber, tier, issuedAt, holder, status (active, revoked-for-cause), transferabilityFlag (OFF at launch, architected to flip) |
| Membership | seasonKey, status (active, lapsed), startedAt, renewal state; founding purchase includes first season |
| Deposit | amount, creditState (held, applied-to-tickets, refunded-as-credit), priorityOrder |
| PlayerTwin (portal projection) | the portal never touches raw A1 storage; it reads a projection with three rings: public card, member depth, premium. Every displayed number carries its provenance badge; unmeasured shows "not yet tested"; athlete consent per data class gates what enters any projection at all |
| Follow | fan to player edge, tier (free follow vs premium), startedAt; drives content routing and the player payout ledger |
| ContentItem | type (video, article, card), gatingTier (public, member, premium, per-player), publishedAt, linked twin refs |
| Vote | question, options, eligibility (member and above), opensAt, closesAt, live tally, result recorded permanently (the result is content) |
| Order and OrderItem | merch, pass, membership in one cart; member pricing resolved from account at checkout |
| NumberedItem | physical merch with recorded ownership on the buying account (itemNumber, series, cap) |
| PlayerAccrual | per-player ledger rows: source (premium share, collectible cut, appearance, external reference), amount, period, status (**pending / cleared / paid / disputed** with a holdback window - CORRECTED 2026-08-14 per doc 16 F5, ratified during the build; the earlier accrued/paid pair was the bug F5 named); visible to the player |

Under the hood every entity rides the standard record machinery (provenance, event history, access policy); none of that vocabulary surfaces in the portal.

## Access tiers and gating

Four rings, enforced at the content-projection layer, not in UI logic:

1. **Public** (no account): team surface, roster cards with headline verified numbers and badges, shop at public pricing.
2. **Free account**: Day One badge, member number, votes excluded, member pricing excluded; sees what it is missing (honest locked states, never dark patterns).
3. **Founding or Member**: full twin depth, testing-day video, votes, member pricing, early drop windows.
4. **Premium or per-player follow**: close-view player content; the revenue-shared ring.

Rendering rules that carry the brand: locked content shows what it is and which tier unlocks it; missing data says "not yet tested"; every stat badge (GATE-TIMED, HAND-TIMED, VIDEO, SELF-REPORTED) is a tappable explainer of the honesty system. The honesty system is a feature with UI, not a backend property.

## Screens (fan class) — spec against the mockup

Claim, Home and My Card, Founding Pass purchase, Roster, Player detail, Shop and Drops, Votes, Year One card (teaser). Matches the design brief already dispatched. Evaluation checklist for the incoming draft: phone-frame nav works; provenance badges present on every number; banned vocabulary absent; locked states honest; founding pass reads as status not instrument; drop mechanics show member-early window; nothing wallet-or-crypto flavored.

## Player class (small but load-bearing; v1-lite)

Players get a login with four surfaces: **My twin** (exactly what fans see at each ring, so no surprises), **My consents** (per-data-class toggles with plain-language effect statements; changes take effect at next projection build), **My earnings** (the PlayerAccrual ledger, even while amounts are small; visibility is the trust move), **My content** (phase 2: upload or approve close-view content). The recruiting pitch in doc 10 only lands if players can see the machine working for them.

## Staff class (ops console, minimal v1)

Cody's staff need to run this without us in the loop for daily ops: import and segment the fan list, create and schedule drops, publish content with tier gating, create votes and close them, comp passes and memberships (logged), process refunds per the written policy, see the dashboard (accounts, conversion, revenue by stream, top content). Copy for anything sales-facing comes from a reviewed claims file, not free-typed (the claims register operationalized). v1 can be spartan; it cannot be absent.

## Commerce mechanics

1. Checkout: Stripe (cards, Apple Pay and Google Pay are mandatory for mobile conversion), Stripe Tax for Texas digital-goods and merch tax from the first sale.
2. One cart across pass, membership, merch. Member pricing resolved at checkout from the account.
3. Drops: scheduled release, optional member-early window, caps with live remaining count, numbered assignment at payment-settled order. Sellouts are content (the founders series selling out is a story the portal should tell).
4. Deposits: held as credit on the account with a written refund-as-credit policy; applied against season tickets when ticketing exists.
5. Merch fulfillment fork (Nick and Cody call): **bridge** (existing Drop 001 store stays, portal deep-links, member discount via code sync — fastest, weakest data) versus **takeover** (portal owns the store, print-on-demand or existing vendor behind it — the one-cart promise, real member pricing, full data). Recommendation: takeover, because the one-account-one-cart promise and member conversion economics are the point of the whole platform; bridge only if the existing store has contractual entanglements.
6. Player payouts: accrue in the ledger from day one; actual payout mechanics (through team payroll as marketing income vs direct platform payout) held for the accountant and counsel answer before any promise is made to a player (doc 10 open item; the ledger can run and display accruals while payout mechanics settle).

## Twin content pipeline (A1 to portal)

Testing day produces measurements plus video per the A1 protocol. Pipeline: capture (staff, phone-first) into the measurement store with provenance, athlete consent check, projection build (public, member, premium rings), publish as ContentItems. The portal is a read surface of the projections; it can never mint a number. Testing days are also produced as content events: schedule announced to members, day-of clips, results drop. Three testing windows a season equals three guaranteed content tentpoles plus whatever the season provides.

## Integrations and imports

1. VIP list import with original-date honoring (above). Social inbound (DMs) is a manual-triage import path with source recorded.
2. Existing site (atxbulls.com): portal lives at a subdomain or replaces the site's account-facing parts; VIP signup form redirects into Claim. Coordinate so no signups fall between systems during cutover.
3. Ticketing: link-out v1 (venue and vendor unknown until the venue answer); the account holds the deposit and priority order regardless, which is the part fans care about now.
4. Share surfaces: the fan card and year-one card render as share images (the free marketing loop).

## Build order (order and dependencies only, no dates)

1. **Foundation**: auth, FanAccount, member numbers, era badge, VIP import, claim flow, basic home. Everything depends on this; ship the free claim before anything is sellable so the wave lands somewhere.
2. **Money**: Stripe rail, Founding Pass purchase and assignment, deposits, refund policy page, tax. Founding drop can open the moment this is live.
3. **Roster surface**: player cards with verified-number badges (seeded from A1 baseline as soon as preseason testing runs), honest locked states. This is the differentiation moment; sequence baseline testing and this surface together.
4. **Membership and content**: gating rings, ContentItems, testing-day pipeline, votes.
5. **Commerce expansion**: drops engine, numbered items, merch takeover or bridge.
6. **Player class**: twin view, consents, accrual ledger visibility.
7. **Season features**: follows, premium ring, share cards, staff dashboard hardening.

Dependency notes: 2 depends on 1; 3 depends on A1 baseline capture but not on 2; 4 depends on 1 and 3; the founding drop (2) should not wait for 3 or 4; player payouts UI (6) can show accruals before payout mechanics resolve.

## Open forks for Nick (beyond the standing pass forks)

1. Merch bridge versus takeover (recommendation: takeover).
2. Player class in v1-lite or deferred entirely (recommendation: v1-lite at least My twin and My consents; the locker-room trust argument wants it early, and consent surfaces are needed for CUBI paperwork anyway).
3. Reserved pass-number block size and use (1 through 21 recommended, uses decided with Cody).
4. Subdomain versus site takeover for the portal home.
5. Whether the platform is built Bulls-skinned-but-factorable (the reusable franchise kit question, parked at portfolio level; affects nothing in this spec's contract with Cody but affects how we structure the code).
