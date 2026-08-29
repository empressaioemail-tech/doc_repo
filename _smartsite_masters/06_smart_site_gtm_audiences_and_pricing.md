---
id: smartsite_masters_06_gtm_audiences_pricing
title: Smart Site go-to-market — audiences, motion, pricing
status: active
last_updated: 2026-08-29
applies_to: smart_site
owner: nick
purpose: The commercial frame for Smart Site. Who pays, how they find it, what it costs, how the funnel works, and the vision roadmap beyond launch. For biz ops and biz dev; carries internal-only sections that never reach market copy.
pricing_source_of_truth: _inbox/2026-08-10_smartsite_pricing_and_gtm_LOCKED.md
---

# Smart Site go-to-market

## The motion in one line

**Free browse, paid deep.** Anyone can open the map and explore: click a parcel, see the zoning, the setbacks, the buildable area, the flood picture, no account required. The deep work (the X-ray, the Flood and Drainage study, unlimited AI chat, exports, saved properties) sits behind an account and an unlock.

The free layer is not a teaser; it is genuinely useful, and it is the demo. The product converts at the moment of professional need, not at a login wall.

## Who pays

The paying customer is **any professional who analyzes parcels for a living**: real estate agents and brokers, architects, investors, developers, land planners, civil consultants. The wedge is the same for all of them: look like the most informed person in the room, and hand a client or a reviewer a cited professional analysis.

Homeowners and consumers browse free and receive shared smart sites; they are the audience the professional performs for, not the buyer. This is a deal-winning, submittal-supporting professional tool, not a consumer toy.

### One truth, three registers

The facts never change by audience; the presentation does.

| Audience | Register | Example framing |
|---|---|---|
| Homeowner (free) | Plain verdict | "You can likely add an ADU in the shaded area." |
| Investor | Envelope and constraints | "Buildable envelope is about 62% of the lot; duplex allowed by special use, verify with the city." |
| Architect | Citation-forward | "SF-R: front 25 ft, side 5 ft, rear 10 ft, cited to the district standard; envelope drawn." |

## Pricing (LOCKED 2026-08-10)

Operator-locked 2026-08-10. Full rulings, unit economics and the GTM motion in `_inbox/2026-08-10_smartsite_pricing_and_gtm_LOCKED.md`. **Do not re-derive this ladder.**

| Tier | Price | What it adds |
|---|---|---|
| Free | $0 | The map and all layer toggles. The inspect card (zoning, setbacks, buildable envelope, flood, land use, acreage). Save properties. 3 AI chat messages per property. **Share.** |
| Solo | **$49/mo** | The X-ray, the Flood and Drainage study, unlimited AI chat, unlimited properties. The full answer on one parcel at a time. |
| Studio | **$129/mo** | Everything in Solo plus the professional deliverables: site plan CAD (DXF, IFC), terrain export, and owner data. |
| Team | **$299/mo up to 3 seats, then $25 per seat** | Everything in Studio, for a firm. Shared saved properties, seats, one bill. |
| Prospect | post-launch | The set-level answer. Marked **coming soon to Studio and Team**. |

**Per-property unlock: $15 for 30 days** (not "forever"). Breakeven against Solo is 3.3 properties.

Three rulings that must survive translation into any surface or collateral:

**Share is free, and a shared property carries everything the sharer has stored at full fidelity regardless of the recipient's tier.** What is gated is what the recipient can do on their own account, never what they can see of what was shared. A free recipient opening a Studio user's smart site sees the whole analysis. That is the strongest upgrade prompt available: not a locked feature, but a capability they just watched work and cannot produce themselves.

**The 30-day bound exists because data changes, not because of billing liability.** Surface expiry as a freshness property, "verified on [date]", never as a paywall.

**Owner data is Studio, not Solo.** Skip-trace is a professional capability, not a $49 impulse feature.

Tiers split on **what the output IS**, not on volume of the same thing: Free answers about a place, Solo about one parcel deeply, Studio produces deliverables you hand to someone else, Team does it as a firm, Prospect answers about a set. Each rung is a different job, so an upgrade reads as graduating rather than as being taxed for using the product more.

The rule that governs the paywall is unchanged: **one unlock moment, not a wall per button**. Reaching for any paid feature (or the fourth chat message on a property) surfaces a single unified flow, never a different wall per feature.

Team is $299/mo for 3 seats, then $25 per extra seat (operator 2026-08-29; was 10 included). Extra seats stay monthly. The working revenue target is $100K MRR — 2,041 seats at Solo-only, materially fewer on a Studio and Team mix. Annual pricing (roughly two months free) is the primary churn defense and should be the **default presentation**, with monthly as the alternative.

### Superseded — the 2026-07-29 ladder (retired, do not use)

Retained for traceability only. Retired in full 2026-08-10; no surface should still carry it. The copy sweep is tracked as G8 in `90_operations/QA_polish_register.md`.

| Tier | Price | What it included |
|---|---|---|
| ~~Browse~~ | ~~Free, anonymous~~ | ~~Map, layer toggles, inspect card~~ |
| ~~Free account~~ | ~~Free, signed in~~ | ~~Save properties; 3 AI chat messages per property~~ |
| ~~Property unlock~~ | ~~**$15 per property, forever**~~ | ~~Every report on that property, plus unlimited AI chat on it. Terrain not included.~~ |
| ~~Pro~~ | ~~**$149/mo advertised; $99/mo launch**~~ | ~~Unlimited reports, terrain, AI across all properties~~ |

Why it was retired: the forever-unlock carried an unbounded liability (every future report on that property, free, forever, against a one-time fee) and a 6.6-property breakeven that taught buyers to think in $15 increments; there was no tier between free and $99; and "unlimited" priced on nothing when properties are the natural value metric.

INTERNAL ONLY: billing goes live with the launch wave. The entitlement gate and unlock flow are built; do not represent live billing as operating before it ships.

## Coverage posture

Collateral speaks of coverage as **nationwide United States**. The go-to-market assumption is national coverage at launch, produced by the factory pipeline (jurisdictions onboarded in parallel under mechanical certification gates).

The honesty rule still applies at the parcel: where a layer is not yet verified for a place, the product says so plainly rather than guessing. That behavior is a selling point, name it. What collateral must not do is enumerate specific counties as the extent of coverage, or quote a dated count that will be stale in a month.

**The coverage answer must be self-serve.** The prior instruction here — that a buyer's jurisdiction "can be confirmed on request" — is retired 2026-08-10: it puts a human in the loop, which the humanless ruling forbids, and it is the exact gap named as condition 1 of `_inbox/2026-08-10_smartsite_humanless_gtm_handoff.md`. A prospective buyer who has to ask is a sale that dies silently. What replaces it is a checkable coverage surface or a plain statement of how rolling coverage works, with the per-parcel honest-absence behavior named as the safeguard: the product will tell you what it does not know about your parcel, so coverage is a question the product answers, not a question you ask us. Tracked as G3 in `90_operations/QA_polish_register.md`.

## The funnel

Browse → save or research → paywall moment → unlock or subscribe. Each step is measured (browse started, parcel inspected, signup, property saved, paywall hit, unlock started, subscription created, share created, share viewed, churn), with **consent flags first-class on every event** — the year-zero rule is that they cannot be retrofitted. Event schema is drafted in `76a`; adopt it rather than redesigning.

**Smart Site has no sales CRM, because it has no sales team** (operator ruling 2026-08-10). Funnel signal drives affiliate optimization and share-loop attribution, not a rep's queue. There is no qualified-lead handoff, no demo booking, and no stage a human works. CRM tooling belongs to Empressa Solutions (custom builds) and SmartCity OS (municipal), which do get a sales team; do not let that machinery leak onto this product.

A hard privacy boundary applies and can be stated to customers: identity and funnel stage are all that reach any analytics or affiliate system. A customer's research, saved analyses, and report contents never leave their tenant. This is the same sovereignty rule the product itself enforces.

## Distribution

**The share loop is the channel.** The distribution thesis is one professional showing another. The realtor line, "I'll share your smart site with you," is the loop working: a shared smart site carries the analysis (the brief, the drawings, the site plan), and the recipient lands on the product. Every shared artifact is a demo carrying the brand.

**Adjacent doors** (staged, not lead offers):

- A browser extension that recognizes listings on the major listing sites and hands off to the full smart site. Top-of-funnel; staged behind the core launch.
- The installable mobile experience: the map full-bleed with GPS, the answer in hand standing on the site.
- The agent door: the same answers exposed to AI agents programmatically, metered and paid. This is the strategic second market (agents need verified physical-world truth and have no supplier); it launches alongside, not ahead of, the human product.

## What Smart Site is deliberately not

- **Not valuation.** The wedge is constraints and buildability, cited. What a property is worth is out of scope, honestly and deliberately; the product tells you what you can do with a place, and stakes its brand on being right about that.
- **Not a listings site or consumer real-estate portal.** It complements, not competes with, where listings live.
- **Not survey or legal work.** Every export says plainly: derived from public records, not a boundary survey, not for legal record, verify with city staff and licensed professionals. This honesty is brand-consistent and required.

## INTERNAL ONLY — the vision roadmap beyond launch

These frame investor and strategy conversations. None of it is market collateral, and parts of it sit on the never-lead list.

**The agent economy.** The professional product proves the layer parcel by parcel; the durable prize is being the verified source AI agents consult for physical-world truth, metered per call. Same facts, same citations, machine door.

**The contribution economy (vision, explicitly not a now-build).** Owners and stewards claim their smart site and are rewarded for verified contributions to it: correcting a misread setback, confirming a boundary, updating what changed after work was done. Contributions are verified before they are rewarded, the same discipline that governs confidence everywhere in the system. The thesis behind it: as AI compresses the cost of cognitive and physical work, rewards programs are a clean mechanism for people to participate in the upside by contributing the ground truth machines get wrong. Sequencing runs through an internal flag rail first, then pattern review, then a pilot; no commitment to any reward economics before counsel and business review. Never discussed in customer material, and never at market altitude in any language touching tokens.

**The city and enterprise doors.** A community's worth of smart sites is a smart city; SmartCity OS sells that to municipalities through its own positioning set. Enterprises connect their scattered systems into one owned structure over the same layer. Different buyers, different collateral, same build. Smart Site professional collateral never pitches these; it proves the layer they stand on.
