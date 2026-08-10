---
id: 31_smartcity_dashboards
title: SmartCity Dashboards — category master
status: active
last_updated: 2026-08-10
applies_to: smartcity
owner: nick
related: [30_smartcity_os, 32_smartcity_asset_management, 07a_smartcity_product_positioning, 41_three_wedge_spine_strategy, 42_stub_thesis_national_twin_substrate, _sales/03_smartcity_os, Master Collateral Folder/2026-07-31_smart_site_MARKET_white_paper]
purpose: The category master for SmartCity Dashboards. Source of truth for what the category is, the lens model, the department roster, what is real, how it is sold, and what may be said externally. Written to be consumed by a design agent producing collateral (Vertosoft, Forrest, website); the external-language and approved-claims sections are the only parts that may be printed market-facing.
---

# SmartCity Dashboards

One of four SmartCity categories. Peers: Asset Management, Plan Review, and the storage layer that underpins all three.

## How to use this document

This is a source-of-truth master, not collateral. A design agent producing a one-pager, a deck slide, or website copy draws from [External language](#external-language-what-may-be-said) and [Approved claims](#approved-claims-register), and from nothing else. Everything above those sections is internal reasoning that establishes why the external language is true. Sections marked INTERNAL ONLY must never appear in a market-facing artifact.

The two-altitude rule governs this category. Internally these are lenses onto a city's smart sites, rendered from the atom and node structure underneath. Externally we never say twin, atom, node, or substrate. The rule and its evidence are in `42_stub_thesis_national_twin_substrate.md`.

## The unit

Everything in SmartCity is built from smart sites. A smart site is any addressable place, fully twinned — a parcel, a right-of-way, a facility, a corner. A smart city is a bunch of smart sites. This is not a product a city buys alongside the categories; it is what we create, and what the categories do with it.

Dashboards are the lenses onto a city's smart sites. Asset Management is how a city deepens them with its own reality. Plan Review is decisions made against them and deposited back onto them. All three read and write the same places.

## What the category is

Dashboards is how everyone in a city sees what is happening — each person seeing the part that is theirs, all of it drawn from the same underlying record.

It is not one screen. It is a family of views keyed by audience: the city manager sees across the whole city, development services sees the permitting and development pipeline, finance sees the money, public works sees the infrastructure, parks sees its grounds and facilities, police and fire see their operations, and residents see the part of the city that belongs to them. Each view shows what that audience needs and only what that audience is permitted to see.

The views are not separate systems reporting to each other. They are different windows onto one structure, which is why the numbers agree, the map is the same map, and a change in one place is visible everywhere it is relevant.

## The lens model

A lens is defined by three things: the audience it serves, what that audience needs to see, and what that audience is permitted to see.

The third is the one that matters structurally. Permission is a property of the record itself, not a setting in each application. That is why a resident-facing view and a police-facing view can sit on the same underlying records without a wall between two separate systems, and why adding a department does not mean building and securing another silo — it means defining another lens.

INTERNAL ONLY: this is `accessPolicy` enforced at resolution (ADR-017; technical white paper §7), the same mechanism that carries tenant sovereignty across the portfolio. It is the reason the lens model is cheap to extend and the reason the category is honest about the citizen lens sharing infrastructure with internal ones.

**The consequence worth selling.** A city does not buy dashboards one department at a time and hope they line up later. The structure is established once, and each department's view is a lens onto it. Departments that come later inherit everything already there.

## The department roster

Named generously, because a lens model makes breadth structural rather than expensive. Lead with the first four.

**Lead lenses.**

*City manager.* The cross-department view of the whole city. This is the lens that can only exist if everything underneath is genuinely connected — it is the proof of the one-system claim, not merely the executive summary of it.

*Development services.* The permitting and development pipeline: what is in flight, what is stuck, where the backlog is, what is coming. The lens that connects directly to Plan Review.

*Finance.* Budget against actuals, revenue, spend, and the money view of everything the other lenses are doing.

*Citizen.* The public-facing lens. Residents see service requests, status, and what is happening around them. Formerly a separate product (CitizenConnect); it is a lens like any other, distinguished by audience and permission rather than by being a different system.

**Additional lenses in the roster.** Public works and utilities, parks and recreation, police, fire and EMS, code enforcement, planning, streets, facilities, fleet, courts, and human resources. A city with a department not on this list gets a lens for it; the model does not depend on the list being complete.

INTERNAL ONLY — what already runs at Bastrop, from the live integrations inventory (`30_smartcity_os.md`): permits and work orders (MyGov), fleet telemetry (Samsara), police fleet (Spireon), cameras and doors (Verkada), fire and EMS incidents (FirstDue), budget (OpenGov), GIS and geocoding (ArcGIS/Esri), telephony (GoTo Connect, degraded), and embedded reporting (Power BI). The lens roster is not aspirational at the feed level — most of these departments already have live data flowing. What changes under the rebuild is what the data becomes when it lands.

**Citizen lens honest state.** Citizen payments are UI-only with no backend (`41_three_wedge_spine_strategy.md`). Do not claim payment processing in the citizen lens in any collateral until it is built.

## What we do not offer

We do not sell a dashboard that only visualizes a vendor feed.

If a city wants a screen that renders what Samsara or their permit system already reports, they have one. Connecting a feed to us means the thing being measured becomes a record and every reading becomes part of its permanent history — that is what our stack does, and it is what we offer. There is no cheaper version that skips it.

INTERNAL ONLY: this is a deliberate refusal of the easy land-and-expand motion. Every dashboard engagement is therefore a data engagement, and we give up the fast shallow "connect your feeds" deal that would get us in the door quicker. The trade is that we never ship something that is indistinguishable from the incumbent's screen, and there is no lesser tier for a buyer to negotiate down into. Operator ruling 2026-08-01.

**Why this is the differentiator.** Every vendor in this market shows role-based views over integrated feeds. The difference is what happens underneath: in the ordinary case the feed is rendered and gone, and in ours the thing being measured becomes a durable record with history, and the reading joins it. That is the difference between watching the city and knowing it, and it is the sentence a design agent must not flatten into "we integrate your systems."

## The entry sale: a system that becomes the foundation for programs

Dashboards is what a city buys first, and it is a complete, deployable system with a defined outcome. It is not phase one of something larger and must never be described that way, because a buyer told they are getting phase one will wait for the real thing.

What is true is that deployment establishes the foundation. Once a city's reality is in the structure, the programs become possible: deepening the city's own assets, running review against its own code, growing the record it owns. Those are what a city grows into after the system is running.

INTERNAL ONLY: two different conversations, kept apart in collateral. The system conversation sells the entry. The program conversation happens after deployment, or when a city manager asks what comes next. Do not merge them into a single "platform journey" narrative — it makes procurement harder and pushes the value later. Operator framing 2026-08-01.

## The buyer and the sale

The buyer is the city manager, in small-to-medium municipalities — the cities the Palantir-scale vendors skip and the point-solution vendors nickel-and-dime (`07a_smartcity_product_positioning.md`).

**Sell use-case-first.** The government buyer cares about the problem solved, not the technology. Open with the workflow pain, never with architecture. This is the standing rule for the whole product line and it is doubly true here, because Dashboards is the most demo-able category and the most likely to get sold on a feature tour instead of a problem.

**The pain to open with.** Six departments and a dozen systems that do not talk. Staff answering the same property question over and over. Nobody able to see the whole city at once. Institutional knowledge leaving with every retirement.

**Discovery questions that work** (`_sales/03_smartcity_os.md`): how many systems does your staff log into in a day; what question do residents ask that takes your staff longest to answer; when did you last lose institutional knowledge to a retirement.

**The grant angle.** Cities fund modernization through grant programs — resilience, data redundancy, modernization. The category fits grant narratives, which lowers the cost barrier and creates a reason to act now. Ask early whether there is a grant program or budget cycle this could ride.

**Never attack an incumbent by name in customer materials.** Standing rule.

## Competitive frame

The closest analog a buyer will name is Palantir, which serves big government and is priced for it. Point solutions — permit software, GIS viewers, work-order systems — each solve one silo and add another login.

The frame is that this is one system for the whole city, sized and priced for the overlooked middle, where the city owns its data. The differentiator is not that we have more views; it is that the views sit on one record rather than on a stitched-together set of feeds.

Do not attack any of these by name in customer-facing material.

## Relationship to the other categories

**Asset Management** puts the city's own physical reality into the structure; the public works, parks, facilities, fleet, and utilities lenses render it. An asset appearing in several lenses is expected and is the point — it is the same record everywhere, not four systems disagreeing.

**Plan Review** feeds the development services lens directly, and its decisions deposit onto the smart sites the other lenses show.

**The storage layer** is what makes the lens model work: one record, permission carried on the record, history kept by default.

## Constraint set for the peer-recommendation sentence

INTERNAL ONLY. The real distribution channel is a city manager recommending this to another city manager (`30_smartcity_os.md`). Whatever gets said in a hallway at a TCMA or ICMA event is the actual positioning. That sentence is an output of this work, not an input; these are the rules it must satisfy, to be generated against when the positioning pass runs.

It must be one sentence, sayable from memory by a non-technical person. It must describe a result, not an architecture — no twin, atom, node, or substrate, which the two-altitude rule already forbids and which is where jargon dies fastest anyway. It must be about her city rather than about us, because a city manager recommending a vendor is telling a story about their own competence. It should name a pain the listener already feels, since the mechanism is one city manager recognizing their own problem in another's description. It must be true of what is deployed, not what is planned. It should point at durability or ownership somewhere, because that is what no competitor can say and what separates a recommendation from a compliment. And it cannot be a feature list — naming the categories is what a vendor says, and it does not survive a hallway.

## External language: what may be said

This section and the next are the only parts of this document that may be used in collateral.

**The one-liner.** One pane of glass to run your city — and the right view for everyone who runs a piece of it.

**The short description.** Your whole city in one place, with each department seeing what is theirs. The city manager sees across everything. Development services sees the pipeline. Finance sees the money. Residents see what is theirs. Every view is drawn from the same record, so the numbers agree and the map is the same map. You decide who sees what.

**The three things to lead with.**

1. *One view of the whole city, and the right view for each department.* Not another login. Not another system that disagrees with the last one.
2. *Everyone sees what is theirs, and only what is theirs.* Who can see what is built into the record itself.
3. *What comes in is kept.* When a system connects, what it measures becomes part of your city's permanent record — so you can see how something has actually behaved over time, not just what it reads right now.

**How to describe the departmental expansion.** The structure is established once. Each department is a view onto it, and departments that come later inherit everything already there.

**How to describe what we will not do.** We do not sell a screen that just shows you your existing systems in a nicer layout. If that is what you want, you already have it. When a system connects to us, what it measures becomes a permanent part of your city's record.

**Language to avoid.** Never say digital twin, RWA, tokenization, on-chain, blockchain, atom, node, or substrate in customer-facing material. Never say GovTitle. Never name a competitor. Never describe Dashboards as phase one. Never claim citizen payment processing.

## Approved claims register

Every claim a design agent may print, with its source. A claim not in this table is not approved.

| Claim | May be stated as | Source |
|---|---|---|
| Views are keyed by audience and permission | Stated plainly as the lens model | ADR-017; storage layer |
| One underlying record across all views | "the numbers agree and the map is the same map" | Storage layer; `30_smartcity_os.md` atom-graph commitment |
| Named lead lenses: city manager, development services, finance, citizen | Nameable in collateral | Operator ruling 2026-08-01 |
| Broader roster (public works, parks, police, fire, code enforcement, planning, streets, facilities, fleet, courts, HR) | Nameable as available lenses | Operator ruling 2026-08-01 |
| Connected systems become permanent records | "what it measures becomes part of your city's permanent record" | Storage layer |
| Bastrop is live and runs day to day on it | "live with the City of Bastrop, Texas; city leadership runs the city on it day to day" | `30_smartcity_os.md`; `_sales/03_smartcity_os.md` |
| Live feeds already in production | Describable generally as connected operational systems. Do NOT name a vendor feed as connected at a city that has not granted it | `30_smartcity_os.md` integrations inventory |
| Usable from a phone | Stated plainly | `07a_smartcity_product_positioning.md` |
| The city owns its data | Stated plainly | Tenant sovereignty (CLAUDE.md); ADR-005/ADR-017 |
| Fits grant narratives | "supports grant-funded modernization programs" | `07a_smartcity_product_positioning.md` |

**Claims explicitly NOT approved.** Citizen payment processing (UI-only, no backend). Any claim that a specific vendor feed is connected at a city that has not granted it. Any 3D or live-infrastructure-sensor claim in this category (that is Asset Management, and is scoped there). Any named-competitor comparison. Any framing of Dashboards as phase one of a larger platform purchase. Any count of departments live at a customer without verifying it first.

## Open items

1. **Existing collateral is stale on structure.** `_sales/03_smartcity_os.md` and `07a_smartcity_product_positioning.md` both describe a four-surface product line including "parcel / property intelligence" as a separate surface and an "infrastructure vision" as roadmap. Under this structure parcel intelligence is a city's access to its smart sites, and infrastructure is Asset Management. Both need reconciliation to the four-category model.
2. **Compass AI placement.** The assistant surface (`30_smartcity_os.md`) is not resolved into the four-category model. Working assumption is that it is the conversational door onto the storage layer rather than a category; to be settled in the storage-layer master.
3. **Ambient capture.** Positioned in `07a` as a fourth surface bundled into the OS ("it learns your city"). Under the four-category model it is a property of the storage layer, not a surface. To be settled in the storage-layer master.
4. **Fleet boundary.** Vehicles are assets under Asset Management and also appear as a fleet lens here. The same-record-everywhere principle covers it; whether fleet leads as a lens or as an asset class in collateral is unsettled.
5. **Pricing. SET 2026-08-10** — Dashboards entry deployment $65,000, annual $16,250, additional department dashboard $12,000, at the smallest city band. Basis and open items in [Pricing/00_pricing_basis.md](Pricing/00_pricing_basis.md). Population banding above the entry band is still owed. Never quote without the operator.

## Revision history

- 2026-08-01, origin. Category defined in strategy session: dashboards are a lens family keyed by audience and permission, not a single product; CitizenConnect collapsed into the citizen lens; roster named generously with city manager, development services, finance, and citizen as leads; aggregation-only dashboards refused as an offer; framed as a complete system whose deployment becomes the foundation for programs; peer-recommendation constraint set recorded for the positioning pass.
