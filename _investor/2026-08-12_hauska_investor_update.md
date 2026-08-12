---
id: 2026-08-12_hauska_investor_update
title: Hauska investor update — August 2026
date: 2026-08-12
status: draft for operator review
owner: nick
related: [_STATE.md, portfolio_thesis/01_the_layer_and_the_three_doors, 80_adrs/adr_018_atom_contract_substrate_layer, _smartcity_masters/Pricing/00_pricing_basis, _inbox/2026-08-10_smartsite_pricing_and_gtm_LOCKED]
purpose: Investor-facing update on the Hauska substrate — what it is, what it supports, and the traction underneath it. Every number traced to a live query, live introspection, npm, or a signed document, with the verification date attached.
---

# Hauska — investor update

**August 2026**

Every figure in this update is traceable to a live query, a live system call, a published package, or a signed contract, with its verification date attached. Where something is built but not yet in production, this update says so plainly. That discipline is not modesty; it is the same discipline the product itself runs on, and it is the reason the numbers below can be checked.

---

## What Hauska is

Hauska is infrastructure. It is not a product anyone buys off a shelf, and it does not have customers of its own. It is the layer that everything else in the portfolio is built on.

The thesis is simple to state and hard to execute. The most consequential facts about physical places — what the land is, what you may build on it, what the water does to it, who owns it — are public, and simultaneously unusable. They sit in a thousand county systems, PDF ordinances, federal flood maps, and appraisal rolls that do not agree with each other and were never designed to be joined. Hauska is the layer that assembles them into one structure where every fact carries its source, its date, its confidence, and its access rules as part of what it is.

Three things make that layer valuable rather than merely tidy:

**Every fact is verifiable.** There is no code path that produces a fact without its provenance. An answer can always be opened to the record it came from.

**The system declines rather than guessing.** Where the record does not exist, the system says so with a stated reason. In a domain where answers inform permits, purchases, and loans, a product that mechanically cannot fabricate is worth more than one that is usually right.

**It answers to people and to software identically.** A person opens an application; an AI agent calls the same records through a metered, gated interface. Same facts, same citations, either door.

---

## What the substrate supports

Hauska is the common layer beneath several distinct businesses. None of them share a customer; all of them share the spine.

| Surface | Buyer | Status |
|---|---|---|
| **Smart Site** | Real estate investors, agents, architects | Building toward launch; pricing locked 2026-08-10 |
| **SmartCity OS** | Municipalities | Live with the City of Bastrop; signed contract |
| **Property Watch** | Property owners and operators | Pilot scoped; first customer identified |
| **The agent channel** | Software agents | Live: 71 tools, metered |

That structure is the point. One expensive, slow, unglamorous asset — the assembled and verified layer — is amortized across four ways of selling access to it. Every customer served through any door deepens the layer for everyone on it.

---

## The spine, in numbers

All figures verified against the live store on the dates shown.

**18,556,547 atoms** in the store, of which **11,603,489 are parcel nodes** — the canonical record of an individual property — spanning **252 Texas counties** *(2026-08-12)*.

**253 of 254 Texas counties** carry parcel geometry *(2026-08-11)*. The single gap is a county whose state-level source returns a 404 at origin — a documented absence rather than a defect, which is the distinction the whole system is built to preserve.

**2,386,353 flood-hazard records across 177 counties**, written with **zero verification failures** *(2026-08-12)*.

**1,394,336 oil and gas wells joined to their counties — 99.88% of the state's records — across all 254 counties**, alongside **491,178 pipeline records at 100%** *(2026-08-11)*.

**15,479,206 parcel geometries** in the statewide fabric, with situs addresses on **99.3%** *(2026-08-10)*.

### The engineering result worth understanding

In August the write path was rebuilt. The bottleneck turned out not to be the write at all — it was a verification read performing a sequential scan across ten million records on every batch. Once corrected, throughput went from roughly 20 records per second to **1,114 per second sustained across 2.9 million records** — a **56-fold improvement**, measured on the four largest metropolitan counties in Texas rather than on a benchmark.

Concretely: Dallas, Bexar, Tarrant, and Travis counties took **43 minutes**. On the previous path they would have taken approximately **40 hours**.

That is the difference between a state being a project and a state being a weekend. It is the number that most directly bears on whether this scales nationally, and it was earned by finding a misattributed cost rather than by buying more compute.

---

## The substrate components

**The atom contract** — the typed-data standard that defines what a fact is and what it must carry. Published on npm, currently at **version 1.19.0**, defining **14 property entity types** *(2026-08-10)*. It is deliberately independent of the commercial layer: a product can consume the data standard without inheriting the payment stack.

**The engine** — the assembly and reasoning layer. It ingests county appraisal rolls, city zoning, federal flood maps, terrain, and codes; reconciles conflicting sources; verifies currency; and computes answers such as the buildable envelope. Computed outputs pass mechanical verification gates before they are served.

**The MCP server** — the agent channel. **71 tools across four permission gates, all dependencies healthy, verified by live introspection 2026-08-12.** This is the authorized route by which a software agent consumes verified physical-world truth. That channel does not otherwise exist in the market.

**The SDK** — the commercial substrate. A verifiable-digital-asset primitive, an event-anchoring hash chain, payment rails, and content-addressed storage adapters. Built.

**The source-obligation meter** — live in production. Every reference to a licensed source accrues an obligation to that source on an append-only ledger, **including on the free tier**. This is the mechanism by which a data owner can be paid mechanically per use rather than by contractual promise. It is running against a real source identity today, awaiting only a rate to be set by the first licensed partner.

That last item deserves emphasis. The hard problem in licensing physical-world data is not access; it is provable accounting. A source that can see every reference to its content, metered at the gate and recorded immutably, has something no data partnership currently offers it.

---

## Commercial traction

**Bastrop, Texas — signed.** A municipal software contract executed 2026-02-17: $33,000 for implementation and first-year licence covering six system integrations, $7,500 per additional department dashboard, $12,000 annually from year two, on a two-year initial term. City leadership uses the platform day to day.

That contract is also our clearest pricing lesson. It was underbid. The current municipal price list, built from it and from comparable market evidence, sets the entry deployment at $65,000 with a $16,250 annual — roughly double — with a full four-category program at $150,000. Those prices were submitted to our public-sector distribution channel on 2026-08-10.

**Smart Site pricing locked 2026-08-10.** Free, $49 solo, $129 studio, $299 for a ten-seat team. Sold entirely self-serve through affiliate distribution and the product's own sharing behavior, with no sales team by deliberate design — the sales function is reserved for municipal and custom engagements where it is actually required.

**ICC Code Connect.** Proof-of-concept credentials for the 2018 International Building Code and Property Maintenance Code are live and wired into production infrastructure. Customer-facing use requires the full agreement, which follows a demonstration.

**Public-sector channel.** Pricing submitted; contract vehicles give access to municipal buyers without building a government sales organization.

**Property Watch.** A multifamily operator running student housing and assisted living identified pipe-freeze early warning as worth buying on its own. That was the second customer-originated request for the same capability inside five days, and it founded the program.

---

## What is not yet true

An honest update names its gaps, and these are the ones that matter.

**Coverage is broad, not yet deep.** Texas parcel geometry is essentially complete at 253 of 254 counties. The deeper reasoning layers are not. Zoning is deep in one jurisdiction and thin across the rest, and the buildable answer — the computation that makes the product valuable — currently exists on a small fraction of parcels. In Bexar County, for example, there are over 700,000 zoning records against roughly 800 computed envelopes. Breadth arrived first because breadth is cheap and depth is expensive. Closing that gap for Texas is the current program.

**Five new data rails are built and carry no data yet.** Owner records, wells, rail corridors, building footprints, and special districts are all registered in the contract and published, with their write paths merged. The applies have not run. They are queued behind a single write slot.

**The municipal product does not yet run on the spine.** SmartCity OS is live and is our only signed municipal revenue, and it predates the substrate. It reads its own data. Connecting it is deliberate future work, sequenced after the layer beneath it is hardened rather than before.

**The payment rail is not provisioned.** Metering and quota gating are live; the settlement provider is not yet configured, so overage charging degrades honestly to a partial state rather than failing silently.

None of these are surprises and none are hidden. They are the reason the current program exists in the shape it does.

---

## Why this compounds

The layer is built once and sold repeatedly. A county assembled for a real estate professional is the same county a city uses, the same county an AI agent queries, and the same county a building owner attaches sensors to. The marginal cost of the second customer in a jurisdiction is near zero, and the cost of onboarding a new jurisdiction is held under a hard internal ceiling that measured performance is comfortably beneath.

More importantly, the layer gets deeper as a byproduct of being used. A city recording its decisions, an operator connecting a building, a professional correcting a record — each deposits into the same structure. Nobody buys depth; they buy the answer they came for, and depth accrues.

The verification architecture is what makes that safe. A layer that accumulates unverified contributions degrades. A layer where every fact carries its source, every computed answer passes a mechanical gate, and the system declines rather than guessing is one that can absorb contributions from many sources and remain trustworthy. That is the moat, and it is not the kind a competitor closes by shipping a feature.

---

*Figures verified 2026-08-10 through 2026-08-12 against live systems. Contract terms per executed agreement dated 2026-02-17.*
