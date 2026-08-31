---
id: 2026-08-02_bastrop_scada_infrastructure_intelligence_ask
title: Bastrop ask — intelligence on SCADA / city utility infrastructure
date: 2026-08-02
status: recorded (verbal ask, captured to repo)
owner: nick
applies_to: smartcity
related: [42_stub_thesis_national_twin_substrate, 41_three_wedge_spine_strategy, _smartcity_masters/32_smartcity_asset_management, 30_smartcity_os, 73_partnerships]
purpose: Capture the Bastrop-originated request to put intelligence on the city's SCADA and utility infrastructure, which until now existed only as a verbal ask from the city and as roadmap intent in doc 42. Written so the ask stops living only in the operator's head and so collateral referencing city demand traces to a record.
---

# Bastrop ask — intelligence on SCADA and utility infrastructure

## The ask

Bastrop asked for intelligence on their SCADA and utility infrastructure. The request came verbally through the city operator-zeros (Sylvia, Jaime) and was not previously written up anywhere in this repo. Recorded here 2026-08-02.

This is a customer-originated pull, not a roadmap idea we are pushing at a city. That distinction matters for how it may be described: we can say cities are asking for this, because one is.

## Where it already sits in the doc set

The intent was already canon, without the ask attached to it.

`42_stub_thesis_national_twin_substrate.md` line 26 names DEEPEN as one of the three temporal modes of stub production, with "Bastrop UTILITIES" as the named target. Line 53 states the market posture directly: extend the twin method to city infrastructure, GIS-first as the base layer now, with live-sensor and SCADA work as a separate gated conversation that needs the city, offered via Vertosoft where feasible. The same line carries the claim that the hard part is the data structure rather than the sensors or the 3D model.

`41_three_wedge_spine_strategy.md` line 48 records the honest state of the deployed SmartCity product: the IoT tier is advertised in existing marketing and does not exist as a shipped product tier in that codebase.

Those two facts are not in conflict once the delivery shape is named, which is what this record does.

## What it is: a twin of the control system

The offering is not inventory hygiene and it is not a security product. It is the control system held as a record in the same structure as every other city asset, with an intelligence layer reading across it.

The station is the smart site. The controller in it is a record carrying make, model, firmware, network position, internet reachability, and who installed it when. Its logic is a record, versioned, so the version running now and the version running last month are both retrievable. Its readings accumulate on the station rather than refreshing and vanishing. Each carries source, timestamp, confidence, and access policy like every other fact in the substrate.

The argument this unlocks: a control system is the only city asset asked to be the sole witness to its own condition. Roads have maintenance histories, buildings have permits, vehicles have service records — all checkable against something other than the asset itself. A pump station's configuration, logic, and behavior all live on the controller, so a compromised controller means the city loses not just control but the ability to know what the equipment is doing. Twinning it puts an independent account of what the equipment is supposed to be outside the equipment.

**Intelligence boundary, settled 2026-08-02: read-only plus anomaly alerting.** The layer establishes a baseline from accumulated history, surfaces deviation from it, and tells the city. No write path to the control system, no operating equipment, nothing in the path of anything that does. That boundary is permanent and is stated affirmatively in customer material, because operations staff correctly distrust anything claiming to touch their equipment. The same capability is a maintenance tool on ordinary days (a bearing degrading weeks before failure) and an integrity check on the day it matters.

**Naming, settled 2026-08-02.** No new product name. "Smart SCADA" was considered and rejected: the smart-* family names twinned places and things a city holds, while SCADA is a vendor software category, so the name reads as a competing SCADA product and puts a control word in a brand name. Internal vocabulary is "SCADA twin," consistent with doc 42 DEEPEN mode. External phrasing is "your control system, with a record of itself."

## Delivery shape: custom build, not a product tier

**This is delivered as a custom build.** The capability exists; what varies per city is their equipment, their control system, their network posture, and what they are willing to connect. This is the same delivery shape Asset Management already carries in `_smartcity_masters/32_smartcity_asset_management.md`: built with the city, around what they already have, with the substrate constant across engagements and the specific reality built into it per city. Where the read-only boundary sits is agreed with the city's operations staff in the room, before anything is connected.

This resolves the apparent tension with doc 41's "advertised, not built" note. That note is correct about a shipped IoT product tier in the SmartCity codebase. It is not a statement that the capability is absent, and it does not bar an engagement. What is barred is selling a switch-on IoT module that does not exist.

Consequence for how this is said: describe an engagement, never a tier a city can buy off a price list. No delivery date, consistent with doc 32's approved-claims register.

## Why the timing is live

The Minnesota water-system attacks of 2026-07-26 and 2026-07-27 hit more than thirty systems, and CISA advisory AA26-097A followed on 2026-07-30, with an FBI and EPA public service announcement on 2026-08-01 covering utilities in at least seven states. CISA's mitigation list is asset-inventory-first: identify and remove internet-exposed controllers, segment networks, back up controller logic offline, and monitor for unauthorized configuration changes. Every one of those steps presumes a city knows what it has and what each device's configuration looked like before.

Most small utilities cannot answer that from a record. That is the gap the durable asset record closes, and it is what makes the SCADA conversation a live one with cities right now rather than a roadmap item waiting for demand.

## What is true today, for collateral discipline

Sayable: cities are asking for intelligence on their utility infrastructure; the durable, connected, access-controlled asset record is real and is what security work depends on; sensor and SCADA work is delivered as a custom build scoped per city.

Not sayable: any claim of a shipped IoT or live-sensor product tier; any delivery date; any claim that the system secures, defends, or protects a control system; any claim that a specific Bastrop feed is connected before verifying it.

We are not a security product. The record is the thing, and the record is what a city needs before any of CISA's mitigations are executable.

## Open

1. **Scoping and pricing the engagement.** This is the same open item doc 41 flags as the least-defined of the three wedges: custom-build as a repeatable offering rather than one-off consulting. The municipal side of that framing pass is owed, and this ask is the first concrete municipal case.
2. **Safety and feasibility bounds.** Doc 42 flags that live-sensor work may hit safety or feasibility walls and needs the city's participation. Read-only posture versus anything touching control is a boundary to set explicitly before scoping, and it should be set with the city's operations staff in the room.
3. **Vertosoft packaging.** Doc 42 names Vertosoft as the channel where this is offered where feasible. Whether it packages as a channel offering or stays a direct engagement is unsettled.
4. **What Bastrop specifically wants.** The ask is recorded at the level it was made. The actual scope, which systems, what outcome the city is after, needs a discovery conversation captured back to this record.

## Revision history

- 2026-08-02, origin. Verbal Bastrop ask captured to repo. Delivery shape ruled as custom build, reconciling doc 42's roadmap intent with doc 41's honest state on the unshipped IoT tier.
