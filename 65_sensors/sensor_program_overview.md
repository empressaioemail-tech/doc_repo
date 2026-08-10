---
id: sensor_program_overview
title: Sensor program — folder overview, vocabulary, and doctrine
status: active
last_updated: 2026-08-06
applies_to: portfolio
owner: nick
related: [42_stub_thesis_national_twin_substrate, 41_three_wedge_spine_strategy, 27c_road_node_engine_and_warm_digital_twin_spec, 04a_arrow_two_calibration_capture, 19_hardware_sovereignty/hardware_sovereignty_overview, _inbox/2026-08-02_bastrop_scada_infrastructure_intelligence_ask, _smartcity_masters/32_smartcity_asset_management]
---

# Sensor program

This folder holds the sensor story across every vertical the stack touches: multifamily (the Waypoint pilot), SmartCity (the Bastrop SCADA twin ask), SmartSite, and oil and gas as a named future. It exists because sensor pull is now customer-originated from two directions in the same week (Bastrop asked for intelligence on its utility infrastructure 2026-08-02; Waypoint said it would buy a freeze watch if it existed 2026-08-06), and the technology, vocabulary, and doctrine should compound in one place instead of being re-derived per vertical.

The vocabulary and doctrine below were ratified by the operator in the 2026-08-06 sensor program session. The specs in this folder are drafts pending their own review cycles.

## Why this matters to the spine

Sensor readings are records on nodes. That ruling already exists in the SmartCity masters (thing read = node, reading = record on it, source-agnostic), so sensors are not a new architecture; they are the substrate extended to current state. The deeper reason this earns cycles: a watch that predicts an event and then measures the outcome is arrow two made physical. Every cold snap logs predicted against measured and the model tightens per building. This program is a calibration-capture machine on physical infrastructure, which is exactly the confidence-is-earned commitment expressed at the building scale.

## Vocabulary (ratified 2026-08-06)

A twin is the place's record of itself. That is the one-sentence external explanation. Everything else is degrees of aliveness of that record.

A COLD twin has the record: we captured what the customer already has (plans, documents, systems, history). A WARM twin has the record verified, with provenance on every fact, consistent with the existing 27c sense of the word. A LIVE twin has senses: existing feeds and sensors streaming current state onto the record.

Sensors are the twin's senses. A twin without senses is a record; a twin with senses knows its own current state. We do not sell sensors; we sell a twin that can feel, and sensors are how it feels.

The twinning process has three verbs. CAPTURE: ingest what they already have. CONNECT: wire in what already reports (thermostats, meters, a BMS if one exists). SENSE: add hardware only where the twin is blind. The order is a cost discipline; hardware is the last resort, after capture and connect are exhausted.

A WATCH is the unit of sensor intelligence: a standing rule on a live twin, defined as baseline plus condition plus roster. Freeze watch, water watch, energy watch, bearing watch. The customer does not buy IoT; the customer buys a freeze watch on their building. The full contract lives in `watch_spec.md`.

Senses have three roles, and the system is proactive-first (operator ruling 2026-08-06). PREDICTIVE senses see the event coming before it exists: temperature trend joined to forecast. SYSTEMIC senses instrument an artery so one instrument watches the whole tree: flow or pressure on the water main sees a drip anywhere in the building as a baseline deviation, before any floor is wet. POINT senses sit at the highest-consequence locations (a water heater pan, an under-sink cabinet) to localize and to catch what escapes the first two layers. Design order is predictive, then systemic, then point: point senses are the floor of the system, never the strategy. A deployment that is only point senses is a reactive product and is not what we sell.

## The three planes

The RECORD plane exists today: nodes, atoms, accessPolicy, provenance. A building, a riser, a pipe run, a controller are nodes.

The TELEMETRY plane is new: high-frequency readings keyed to node ids. Raw samples land in a time-series store and are not atoms (a five-minute temp sensor produces on the order of a hundred thousand readings a year). What gets atomized is derived state: current-state snapshots, events, and baselines, each carrying source, timestamp, confidence, and access policy like any other fact.

The WATCH plane is new: rules and notification. It reads telemetry, external signals (weather forecast), and the record. It emits durable events onto the twin and notifications to a roster.

## Doctrine

1. The data is ours at the source. No approved sensor whose only path is a vendor cloud without API or export. This is the sovereignty story expressed at the hardware edge and the single most important filter on the approved catalog.
2. Read-only. We read; we never actuate. This carries over the SCADA twin boundary (settled 2026-08-02). Actuation is a separate future ruling, never an assumed feature.
3. LoRaWAN-class radio is the building default. Battery sensors that run for years, one powered gateway per building, no dependence on the building's wifi. Cellular for isolated assets; wired or BMS integration where it already exists (connect before sense).
4. The approved catalog is a descriptor-shaped artifact: per use case, an approved make and model with an install spec, so sensors become a schedule on a drawing sheet the same as fixtures. See `approved_sensor_catalog.md`.
5. Install is spec'd, not owned. We manage the first install to prove the loop; the scaling artifact is the install spec plus an in-app commissioning flow any electrician can execute.
6. Unit interiors are opt-in. Common areas, risers, chases, and mechanical spaces are the default sensing surface. Occupied private spaces get senses only on an opt-in basis (rewards or consent mechanics are the operator's side); consent is a field on the unit node and drives what senses exist there. Ruled 2026-08-06 after a legal side-check named this the low-friction posture.
7. We watch the building, not the people. No fall detection, no wander management, no personal emergency response, no care monitoring. Building-state signals that happen to be welfare-relevant (a unit at 52 degrees in an assisted living building) route to staff as building alerts. This is an engineering scope rule that bounds what we build; it is deliberately not a positioning artifact, which differs from the SCADA record where the read-only boundary is stated affirmatively in customer material.

## Verticals

Multifamily: the Waypoint pilot (`pilot_waypoint.md`) is the model engagement. Student housing and assisted living, freeze, water, and energy watches.

SmartCity: the Bastrop SCADA twin ask is the sibling engagement on the municipal side, recorded at `_inbox/2026-08-02_bastrop_scada_infrastructure_intelligence_ask.md` with its own settled boundaries (read-only plus anomaly alerting; custom build, not a product tier). The station is the smart site; a bearing watch is the same watch contract applied to a pump.

SmartSite: a live twin is the ceiling of the smart site ladder; the watch plane is what a smart site graduates into.

Oil and gas: named future. Isolated assets, cellular-first radio posture, same three planes. No work scoped.

## What is sayable

Cities and building operators are asking for this (both asks are on the record). The durable, connected, access-controlled record is real. Sensor work is delivered as a custom engagement scoped per customer. Not sayable: any shipped IoT or live-sensor product tier (doc 41's honest-state note stands), any delivery date, any claim that a specific feed is connected before verifying it.

## What's in this folder

- `sensor_program_overview.md` — this doc. Vocabulary, planes, doctrine, verticals.
- `watch_spec.md` — the watch contract: rule, event, acknowledgment, notification, calibration. Contract-first, exposed as MCP tools, consumed by the app.
- `approved_sensor_catalog.md` — the descriptor-shaped approved list. Skeleton with criteria; zero models approved yet pending a sourced research pass.
- `pilot_waypoint.md` — the Waypoint Management pilot spec: sequence, watch configs, assumptions register, dependencies, discovery checklist.
- `watch_app_spec.md` — the mobile-first human surface on the watch contract.
- `convergence_smart_site_live_layer.md` — the ruling that this program is the live rung of the Smart Site ladder: one brand, the claim flow as shared infrastructure, persona-split surfaces, the city scaling and its sovereignty boundary.
- `positioning_and_brand.md` — positioning and brand guidelines: the live layer inside Smart Site, vocabulary rules, claims discipline, brand mechanics.
- `install_guide_waypoint_mvt.html` — the field install guide for the pilot test kit (also published as a private artifact for phone use).

## Open items

1. Telemetry plane placement. Instinct recorded: ingest at substrate level (the engine owns nodes and records and the telemetry ruling is source-agnostic), watch plane as a function package, product surfaces consuming both. Needs the ADR-008/56 target-topology check before it hardens. Named, not decided.
2. LoRaWAN network server choice (self-hosted ChirpStack versus The Things Stack). Needs a research pass. Named, not decided.
3. Notification channel implementation (SMS provider, push infrastructure). Named, not decided.
4. Tenant-private enforcement gating. Building telemetry is tenant-private by accessPolicy and the tenancy leg (sprint 54) is not built. Resolution paths in `pilot_waypoint.md`; operator call owed.

## Revision history

- 2026-08-06, origin. Folder founded from the sensor program session (Waypoint pull plus the standing Bastrop SCADA ask). Vocabulary and doctrine ratified in-session.
- 2026-08-06, proactive-first ruling. Sense roles named (predictive / systemic / point) with design order predictive first, systemic second, point as the floor; a point-senses-only deployment is explicitly not the product.
