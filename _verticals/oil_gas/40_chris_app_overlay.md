---
id: 40_chris_app_overlay
title: The surveillance-to-intervention slice for Chris
status: exploration
last_updated: 2026-06-14
applies_to: [hauska, empressa]
owner: nick
related: [00_oil_gas_index, 20_tech_to_og_map, 50_complete_product_plan, 30_smartcity_os, _prospects/mox/2026-06-13_mox_demo_build_plan, 53a_noncustodial_settlement_rail]
---

# The slice Chris needs: surveillance to intervention certainty

> **What this is.** The specific slice of the complete well-twin platform ([`50`](50_complete_product_plan.md)) that Chris's app needs to win the backend. His prototype, Permian Field Health, lives in the reservoir-and-well-surveillance-to-intervention space, the same domain as SLB's Reveal Wireline Surveillance product and its "bring certainty to interventions" campaign. This doc carves the exact backend that serves that app, what we own, what is reuse, and what is not us. Exploration status; honesty guardrails apply.

## The domain, grounded

Reservoir and well surveillance is the practice of measuring what is happening downhole over a well's producing life: production logging (which intervals contribute, where unwanted water enters), saturation monitoring, cement-bond and well-integrity logging, and formation-tester pressure. Those measurements inform expensive intervention decisions: workover, recompletion, water shutoff, perforating a new behind-casing zone. SLB Reveal sells certainty by improving the measurement. The intervention is the bet, the surveillance is the evidence, and certainty is what makes an operator spend the money.

That word, certainty, is the seam, and reading SLB's actual model sharpens exactly where we sit. SLB delivers certainty through better downhole measurement plus its own offsite experts and software interpreting its own tools, per job, with the data routing back into SLB's digital stack. The Reveal sub-products are all measurement tools: caliper and barrier for casing corrosion and cement integrity, leak for noise and temperature, saturation via pulsed neutron, dual barrier for annulus condition (enabling rigless plug-and-abandonment), and sand for sand-entry detection. Their "agnostic, open ecosystem" claim is agnostic into SLB's platform; the data flows to them.

### Where we sit relative to SLB

> **Corrected 2026-06-14: SLB is the customer, not an incumbent we route around.** An earlier draft here framed an operator-owned, cross-vendor twin that "SLB structurally cannot occupy," with a conflict-of-interest wedge against SLB. That is wrong for this engagement and is retired. It is an operator-side thesis; it belongs to our own product track, not to the SLB relationship. See [`80_slb_engagement_and_operator_product_path.md`](80_slb_engagement_and_operator_product_path.md).

SLB is the customer. The position is simple: we are the backend under Chris's frontend for SLB's surveillance-to-intervention surface. We do not try to out-platform SLB's Digital division or replace their tool interpretation, because we lose that fight against a 35-billion-dollar incumbent. We win on speed, on the provenance-and-calibrated-certainty discipline that turns measurements into a defensible, explainable decision, and on a working substrate already proven for a city and a building. The neutral, operator-owned, cross-vendor twin is a separate track and a separate product, our own offering for the underserved SMB long tail SLB does not serve, tracked in [`80`](80_slb_engagement_and_operator_product_path.md). Do not conflate the two, and do not pitch SLB on a posture aimed against SLB.

## The slice in one line

The operations lens of the well twin: ingest surveillance and telemetry, maintain the living well twin, detect and explain anomalies, and recommend interventions with calibrated certainty and provenance. Chris builds the surface; we are everything behind the API.

## What the slice is, mapped to the four layers

| Layer | What it does for Permian Field Health | State |
|---|---|---|
| 1. Spine, ground truth | RRC production and permits, offset wells, geology, regulatory context to validate and contextualize a surveillance signal. The public half that lets "production drop in North Reeves Cluster B" be checked against reality. | LIVE spine, O&G adapters net-new |
| 2. The well twin (inverted) | Well, pad, wellbore, completion, and zone atoms, composed with the production timeseries, surveillance readings, and equipment state, as a living data graph with provenance, confidence, and freshness on every fact. The 3D directional view is one lens on the data, not the twin itself. | twin pattern LIVE (Mox, SmartCity); O&G atom types net-new |
| 3. Connect operational systems | Ride on top of the operator's SCADA, historian, and surveillance feeds (including SLB Reveal output), pulling their exhaust into the twin as atoms. No rip and replace. | pattern LIVE (SmartCity fleet telemetry, incidents); O&G adapters net-new |
| The certainty layer | Anomaly detection, then root-cause reasoning into the app's own categories (surface equipment, artificial lift, reservoir pressure, completion geometry), then an intervention recommendation (workover, recompletion, water shutoff, new perforation), each carrying its evidence chain, a calibration-stated confidence, and a source. | reasoning and provenance LIVE; anomaly scoring net-new |

## The certainty layer is the actual product, and it fixes the prototype's red flags

The prototype shows sensor confidence at 105 of 100 and a Field Health Index with no definition, source, or bound. That is decision-theater. The certainty layer is what replaces it: every score bounded and defined, every confidence value carrying its state (baseline, provenance-backed, not yet calibrated on this operator's outcomes), every alert backed by the evidence that triggered it, and every recommendation paired with a suggested action and a confirmation step before anything real happens. That is "bring certainty to interventions" rendered honestly, and it is the half Chris's surface cannot generate on its own.

## Who owns what

- Chris: the surface, the component library (the map, the directional command center, the cards and rails), the UX, the design system, frontend state.
- Us: the well twin substrate, the ground-truth spine, the connect adapters, the certainty layer (reasoning, provenance, bounded calibrated confidence), and the API the frontend calls.
- The operator and SLB: the raw surveillance and telemetry data. We are the intelligence layer over it, not the sensing layer.

## Reuse versus net-new, honest

Reuse, built or live: the twin pattern (Mox, SmartCity), the connect-and-ingest pattern with health monitoring (SmartCity fleet telemetry and incident feeds), the reasoning and provenance and confidence invariants (the spine), and the integration-layer-over-incumbents positioning. Net-new: the surveillance and logging adapters (in place of Samsara and Spireon), the O&G atom types (well, wellbore, completion, zone, artificial-lift equipment, production timeseries), and the anomaly-scoring analytics that produces the health index. Not us and not in scope: the downhole logging tools themselves (SLB), and the directional-drilling subsystem, which is a specialist concern that should be a separate role and workspace, not bolted onto field health.

## Integration contract

Recommend a thin product API or BFF in front of the engine and the MCP surface, which Chris's frontend calls. It keeps his surface clean of our internals and gives us a stable contract to evolve the twin behind. The alternative, his frontend calling the MCP tools directly, is viable for an agent-first version but couples his UI to tool shapes. This is the one decision to settle with him early.

## Honesty guardrails for anything shown to Chris or the company

Calibration is a baseline today, not yet calibrated on this operator's outcomes; sell the earning loop, not a finished number. Certainty means provenance plus a bounded, state-labeled confidence plus the evidence chain, never a magic score. The telemetry and logging are the operator's and SLB's data; we are the reasoning layer. Mark every capability LIVE, BUILT, or PLANNED and do not present the net-new anomaly scoring as already running.

## The expansion hook

This slice is narrow on purpose, because it is the door this customer is already walking through. But standing up the well twin to make Permian Field Health trustworthy stands up the same twin that powers the land-and-obligations lens and the investor-and-capital lens. The moment the twin exists, the revenue-producing nature of the well lights up the monetization layer ([`50`](50_complete_product_plan.md) and [`53a`](53a_noncustodial_settlement_rail.md)). Field health is the foot in the door; the revenue twin is the platform.

## Status and remaining questions (2026-06-14)

Resolved: the customer is SLB (Chris is building for them). Chris uses his own seeded demo data, so we did not need a live SLB feed for the backend. The directional subsystem is included as a separable lens. The integration is a thin read API the frontend calls (CORS open). The backend is built, committed, and sent: the `slb_prototype` repo (branch `feat/ai-native-backend`), see [`80`](80_slb_engagement_and_operator_product_path.md).

Still open with Chris and SLB as it progresses: whether this is an SLB-internal tool or a product SLB sells to its operator customers (changes the surface emphasis); which part of SLB this is and why it is not going through their central Digital org (decides whether it is a durable initiative or a one-off); and whether they understand the gap we fill is the certainty layer, not telemetry plumbing.
