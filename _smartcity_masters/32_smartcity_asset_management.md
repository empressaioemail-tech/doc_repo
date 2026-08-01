---
id: 32_smartcity_asset_management
title: SmartCity Asset Management — category master
status: active
last_updated: 2026-08-01
applies_to: smartcity
owner: nick
related: [30_smartcity_os, 07a_smartcity_product_positioning, 41_three_wedge_spine_strategy, 42_stub_thesis_national_twin_substrate, 27c_road_node_engine_and_warm_digital_twin_spec, 2026-07-31_tier3_municipal_wedge_thesis_frame, 2026-07-27_bastrop_composition_inventory, Master Collateral Folder/2026-07-31_smart_site_TECHNICAL_white_paper]
purpose: The category master for SmartCity Asset Management. Source of truth for what the category is, what it holds, what is real, how it is sold, and what may be said about it externally. Written to be consumed by a design agent producing collateral (Vertosoft, Forrest, website); the external-language and approved-claims sections are the only parts that may be printed market-facing.
---

# SmartCity Asset Management

One of four SmartCity categories. Peers: Dashboards, Plan Review, and the storage layer that underpins all three.

## How to use this document

This is a source-of-truth master, not collateral. A design agent producing a one-pager, a deck slide, or website copy draws from [External language](#external-language-what-may-be-said) and [Approved claims](#approved-claims-register), and from nothing else. Everything above those sections is internal reasoning that establishes why the external language is true. Sections marked INTERNAL ONLY must never appear in a market-facing artifact.

The two-altitude rule governs this category as it governs the portfolio: internally this is a twin of a city's physical reality, atomized into the substrate. Externally it is never called a digital twin. Cities do not know the term and it does not sell. The rule and its evidence are in `42_stub_thesis_national_twin_substrate.md`.

## What the category is

Asset Management is how a city's physical reality becomes a permanent, access-controlled, transparent record that the city owns.

Every physical thing a city is responsible for — the water mains under its streets, the sidewalks along them, the lift stations, the streetlights, the signals and signage, the parks and their equipment, the facilities, the vehicles — becomes a durable record: where it is, what it is, what condition it is in, what has been done to it, who may see it, and who changed it and when. Each asset sits in its correct spatial place, connected to the road it runs under, the parcel it serves, and the flood zone it sits in, so a question about one asset can be answered in the context of everything around it.

The scope statement is deliberately total: **every physical asset the city considers an asset.** There is no eligible-asset list and no ineligible category. If the city tracks it, it can be twinned and held.

## What makes this different from the category as it exists in the market

The market's asset management is a system of record that sits alone. An asset lives in a utility layer, in a work-order system, in a spreadsheet, or in a set of as-built drawings in a filing cabinet, and none of those know anything about each other or about the parcels, roads, flood zones, or codes around them.

Three things distinguish this offering.

**The asset sits in a connected structure, not a silo.** A water main is not a line on a utility layer. It is a record attached to the road it runs beneath, the parcels it serves, the terrain it follows, and the flood zone it crosses. That connection is not an integration we perform per customer — it is the structure the asset is stored in. The question "which properties lose water if this main fails, and are any of them in the flood zone" is a query, not a project.

**The record is durable and transparent by construction.** Every asset record carries its source, the date it was established, the confidence in it, and its full edit history. Nothing changes without a trace of who changed it and when. This is a property of the storage layer, not a feature switched on per city, and it is what makes the record defensible years later when the person who created it is gone.

**Access is structural, not administrative.** Who may see an asset is a property of the asset itself, not a setting in a permissions screen. The city's public assets can be public; the sewer network can be visible only to public works and the contractors they authorize; a sensitive facility can be locked to a named few. This is the same mechanism that governs the whole substrate and it is enforced at the point the record is resolved, not at the edge of an application.

INTERNAL ONLY: this third point is the load-bearing municipal thesis. Access control is what turns "more layers" into a system of record — the city's operational truth rather than a copy of it — and it is the switching cost that makes the municipal wedge durable. Established in `_inbox/2026-07-31_tier3_municipal_wedge_thesis_frame.md`, expressed as tenant sovereignty in `CLAUDE.md`.

## The three tiers

The category is a stack. Tier 1 is the base and the moat; tiers 2 and 3 are what sits on top of it. They are ordered by what a city actually cares about, which is not the order a vendor demo usually runs in.

### Tier 1 — the record

The asset as a durable node: geometry, type, material, install date, condition, service and maintenance history, provenance, access policy, and edit history. Attached to its spatial context — the road, the parcels, the terrain, the flood zone.

This is the product. It is the hardest part, it is the part nobody else has solved in a connected structure, and everything else in the category is worth less without it.

### Tier 2 — live state

Sensor and telemetry readings attached to the asset record, so condition is current rather than surveyed once and left to decay. A lift station reports a fault against the lift station's own record; a meter's reading becomes part of that meter's history. The reading does not land on a dashboard and evaporate — it accrues to the asset.

This is the storage layer doing what it does, and it is uniform across every source. When telemetry is connected, the thing being read becomes a node and each reading becomes a record on it. There is no separate sensor system: a reading is held the same way every other fact is held, which means it carries its source, its timestamp, its confidence, and its access policy, and it stays.

The consequence is that live state is not a gauge that overwrites itself. It is a permanent record of how the asset has actually behaved, queryable alongside everything else known about that asset — which is what condition-based maintenance and capital planning need, and what a telemetry feed that only renders to a screen cannot give you.

INTERNAL ONLY: the platform already aggregates live vendor telemetry at production scale — Samsara fleet, Spireon police fleet, Verkada cameras and doors, FirstDue fire and EMS incidents (`30_smartcity_os.md`, integrations inventory). The mechanism is source-agnostic by construction, so no per-source capability caveat applies. What varies per engagement is only whether a city grants access to a given feed — a scoping fact about the city, identical in kind to whether they hand over utility GIS, and not a limit on the capability.

### Tier 3 — the view

The visual surface: the network seen in place, in two dimensions and eventually in three. Real, and deliberately last. The picture is worth having and it is not what makes the system valuable — the structure underneath is. A model without a trustworthy record beneath it is a rendering, not an asset management system.

INTERNAL ONLY: doc 42 states the data structure is the moat and the model is decoration. The 3D push was paused by operator decision 2026-08-01 (commit `0310130`): partway-3D read as broken, and statewide 2D coverage took priority over 3D polish of one block. Do not lead any asset-management material with 3D and do not commit to a 3D delivery date in collateral.

## What this is: a build, not a module

Asset Management is delivered, not switched on.

No two cities have the same assets, the same records, or the same starting point. One city has a clean GIS utility layer; the next has as-built drawings and institutional memory. The work is to build and connect the city's specific reality into the structure — and that work is the offering. There is no version 1 that ships with a defined feature set and a version 2 that adds the rest.

This is stated plainly and it is a strength, not a hedge. A city's utility network is never a product a vendor ships. It is always an engagement. What is constant across every engagement is the substrate the assets land in and the guarantees that substrate provides: connected, provenance-carrying, access-controlled, durable, and queryable alongside everything else the city holds.

INTERNAL ONLY: this makes Asset Management the municipal expression of the custom-build wedge in `41_three_wedge_spine_strategy.md`, which flags custom-build-as-repeatable-offering as the least-defined of the three wedges and owes a framing pass. This document is that pass on the municipal side; the commercial side (Mox-class operators) remains owed. Same theology, different buyer: twin the assets, connect the systems, atomize the decisions. Scoping and pricing this as a repeatable engagement rather than bespoke consulting is open work.

## The durable record

This category is the home for the durable-record capability: the city's asset and operational records held so that they are provable, attributable, and permanent.

Every record carries its origin, its timestamp, its confidence, and its full history of change. Nothing is overwritten silently. The record can be shown to be what it was on a given date, and who changed it and when is part of the record rather than a log that lives somewhere else. Access is controlled at the record, so a durable record is not the same as an exposed one.

This is the better answer to what cities reach for "on-chain" to solve. A city that wants its permit and infrastructure records to be durable and authoritative does not need a blockchain — it needs a substrate with provenance, timestamps, confidence, access control, and an immutable audit trail. That is what this is.

INTERNAL ONLY: the "GovTitle" name is RETIRED as of 2026-08-01 (this session). It was marketed by SmartCity and never built (`41_three_wedge_spine_strategy.md`), and the name drags in a deed-and-title-records expectation this capability does not serve. The capability is described plainly for now; a name may be set later once it has been seen in practice. Do not reintroduce "GovTitle" in any artifact.

The attestation and anchoring substrate underneath this is BUILT, not planned: the SDK carries a verifiable-digital-asset primitive with an event-anchoring hash chain, plus chain and content-addressed-storage adapters (`42_stub_thesis_national_twin_substrate.md`; ADR-018; technical white paper §8). The bridge question — how far we go beyond substrate toward an attestation-to-chain bridge — is explicitly UNDECIDED per doc 41 open item 2. Claim the durable authoritative record. Do not claim a chain bridge, tokenization, or on-chain records.

## The buyer and the sale

**Sell the city manager. Serve public works.**

The city manager buys the durable record and the single connected picture, and has no vendor to compare it to. Public works is the daily user and would compare a work-order-and-condition pitch to Cityworks or Cartegraph, which is a losing frame and an unnecessary one.

**Plug into what public works already runs.** Their existing data feed is read as-is and becomes part of the connected structure. Replacement is offered only when the city asks for it, never led with. This is the same integration-layer posture the whole SmartCity line takes toward incumbents: sit over what a city runs and unify it, rather than attack it (`30_smartcity_os.md`, competitive positioning).

**Never attack an incumbent by name in customer materials.** Standing rule for the product line.

## Why the starting position is unusual

INTERNAL ONLY — grounding for the sales narrative; the numbers may be used externally only per the approved-claims register below.

The road network is the coordinate system a city's physical asset graph attaches to. Water mains run under roads, streetlights line them, storm drains and signage and curb assets and transit stops are all geometrically indexed to them (`27c_road_node_engine_and_warm_digital_twin_spec.md:91`). Most asset-management efforts begin with a spreadsheet and a shapefile and no geometric spine at all.

In Bastrop that spine already exists and is certified: 17,552 road nodes, 26,454 boundary edges, 74,729 parcels, and the zoning, flood, and terrain layers alongside them (`_inbox/2026-07-27_bastrop_composition_inventory.md`, read from code and ledger 2026-07-27). The structure a city asset graph hangs on is live in the city most likely to buy this.

What does not yet exist is any city-owned asset inside that graph. No main, no valve, no lift station, no hydrant has been ingested. The public-record layers describe the city; the asset layer is the city's own operational record and is the work of an engagement. Nothing in this document's external language claims otherwise.

## Relationship to the other categories

**Dashboards** shows assets. Asset Management holds them. A department dashboard renders the asset records this category maintains, and the departmental lenses (public works, parks, fleet, facilities) read from here. Assets appearing across many dashboards is expected — the point of the category is that they are the same records everywhere rather than four systems disagreeing.

**Plan Review** produces decisions that attach to places and, over time, to assets. Both categories deposit into the same structure.

**The storage layer** is what makes all of the above true. The connectedness, the provenance, the access control, and the durability are properties of the substrate rather than features of this category. Asset Management is the category that turns the city's own physical reality into that substrate.

## Competitive frame

The named comparison the buyer may raise is Cityworks or Cartegraph on the public works side, and Esri underneath most of them. The response is not feature-for-feature: it is that those systems hold assets in isolation from everything else the city knows, and this one holds them in a structure connected to the parcels, roads, terrain, flood, and codes — with provenance and access control as properties of the record.

The city manager comparison is to nothing. There is no vendor selling a city a single durable connected record of its physical reality.

Do not attack any of these by name in customer-facing material.

## External language: what may be said

This section and the next are the only parts of this document that may be used in collateral.

**The one-liner.** Every physical thing your city is responsible for, in one place, with a record you own and can prove.

**The short description.** Your water mains, sidewalks, lift stations, streetlights, signals, parks, facilities, and vehicles become a permanent, connected record — where each one is, what condition it is in, what has been done to it, and who changed it and when. Each asset sits in its real place, connected to the roads, properties, and flood zones around it, so a question about one asset can be answered in the context of everything near it. You control who sees what. The record is yours, and it stays.

**The three things to lead with.**

1. *One connected picture, not another silo.* Your assets sit alongside your properties, roads, terrain, and flood data — not in a system that knows nothing about any of it.
2. *A record you can prove.* Every asset carries where it came from, when it was established, and every change since. Years from now, the record still holds up.
3. *You decide who sees what.* Public assets can be public. The sewer network can be visible only to public works and the contractors they authorize. That control is built into the record itself.

**How to describe the delivery.** This is built with you, around what you already have. We connect what public works already runs and build out from there. What we build depends on your assets and your priorities; what does not change is the structure underneath.

**Language to avoid.** Never say digital twin, RWA, tokenization, on-chain, blockchain, atom, node, or substrate in customer-facing material. Never say GovTitle. Never name a competitor. Never promise 3D on a date.

## Approved claims register

Every claim a design agent may print, with its source. A claim not in this table is not approved.

| Claim | May be stated as | Source |
|---|---|---|
| Scope is every physical city asset | "water mains to sidewalks to vehicles — every physical asset your city tracks" | Operator ruling 2026-08-01 (this session) |
| Assets connect to parcels, roads, terrain, flood | Stated plainly as a property of the system | `2026-07-27_bastrop_composition_inventory.md`; `27c` road-node spine |
| Records carry provenance, timestamp, confidence, edit history | Stated plainly | Atom contract; technical white paper §2 |
| Access control is a property of the record | Stated plainly | ADR-017; technical white paper §7 |
| Delivered as a build around what the city has | "built with you, around what you already have" | Operator ruling 2026-08-01 (this session) |
| Live readings attach to the asset record and are kept | "every reading becomes part of that asset's permanent record" — state plainly | Storage layer; `30_smartcity_os.md` integrations (live telemetry in production) |
| Telemetry history is queryable over time | "see how an asset has actually behaved, not just what it reads right now" | Storage layer |
| Bastrop is live | "live with the City of Bastrop, Texas" | `30_smartcity_os.md`; `41_three_wedge_spine_strategy.md` |
| Bastrop layer counts (74,729 parcels; 17,552 road nodes; 26,454 boundary edges) | Usable ONLY as the connected public-record base, never as city-owned assets under management | `_inbox/2026-07-27_bastrop_composition_inventory.md`, verified 2026-07-27 |
| Durable, provable, attributable records | Stated plainly | ADR-018; technical white paper §8 |

**Claims explicitly NOT approved.** Any count of city-owned assets under management (there are none yet). Any 3D delivery commitment or date. Any tokenization, on-chain, or chain-bridge claim. Any GovTitle reference. Any named-competitor comparison. Any claim that a specific city feed is already connected at a city that has not granted it.

## Open items

1. **Repeatable engagement shape.** Scoping, pricing, and delivery model for custom-build as a repeatable offering rather than bespoke consulting. Owed on both the municipal side (this category) and the commercial side (Mox-class), per `41_three_wedge_spine_strategy.md` open item 1.
2. **Durable-record naming.** Capability described plainly; a name may be set once it has been seen in practice. GovTitle retired and not to be reused.
3. **Chain-bridge boundary.** Substrate-only versus substrate-plus-attestation-bridge remains undecided per `41_three_wedge_spine_strategy.md` open item 2. Until decided, collateral claims the durable record and nothing beyond it.
4. **Pricing.** Government pricing tiers remain an operator decision gating the pricing portions of all channel collateral (`07a_smartcity_product_positioning.md`).

## Revision history

- 2026-08-01, origin. Category defined in strategy session: scope is every physical city asset; delivered as a build rather than a staged product; tier order set as record, live state, view (sensors ranked above visualization per operator); buyer is the city manager with public works served through their existing feed; durable-record capability homed here and GovTitle retired.
