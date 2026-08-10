---
id: pilot_waypoint
title: Waypoint Management pilot — freeze, water, and energy watches
status: draft (pre-discovery)
last_updated: 2026-08-06
applies_to: multifamily
owner: nick
related: [sensor_program_overview, watch_spec, approved_sensor_catalog, watch_app_spec, 54_tenant_leg_sprint]
---

# Waypoint Management pilot

Alan Hoffman, Waypoint Management. Multifamily operator (student housing and assisted living) and an architecture client of Nick's; the pilot conversation originated 2026-08-06 when the digital twin portion of the platform walkthrough landed on his standing pain: pipes freezing every winter, tenants leaving with heat off, water damage, and no early warning. Demand state, recorded honestly: he said yes to doing a pilot in the "I'd buy it if it existed" sense. No pricing or terms discussed; this doc scopes the technical engagement, not the commercial one.

Why this pilot matters beyond one operator: it is the model engagement for the sensor program. First non-city, building-scale sensor deployment; first genuinely tenant-private sensor stream in the substrate; and the full-loop proof (architect-drawn plans, software, managed installation) that the program's scaling artifacts (install specs, commissioning flow, approved catalog) get extracted from.

## Building selection

Recommendation: one student-housing building first. Freeze-over-break is the origin pain, the winter-break vacancy cohort is the showcase for occupancy-aware watching, and student housing carries the fewest boundary sensitivities. Assisted living is building two once the loop is proven; it inherits everything and adds the welfare-relevant routing described in the watch spec, under the watch-the-building-not-the-people rule.

## Sequence

CAPTURE. Twin the building cold: as-builts or whatever drawings exist, pipe runs, risers, chases, mechanical rooms, meter locations, unit inventory, staff roster, and the occupancy calendar (semester and break schedule) as a record on the twin. Nick's site survey and drawings are the capture artifact. The install visit doubles as a camera capture pass: photograph every equipment make/model label (feeds the app's inventory flow and the maintenance watches), every shutoff valve with its location (main, riser isolation, unit stops), and the electrical panels. The shutoff map is a first-class twin record: in an active leak, where the shutoff is and whether it turns is the two-in-the-morning question, and the walkthrough checklist should be able to answer it.

CONNECT. Wire in what already reports: utility meter interval data where accessible, any existing thermostats or BMS, water meter pulse output if present. Energy watch v1 should light up here, before any hardware.

WATCH v0. Forecast-only freeze watch: NWS hourly against the building's vulnerability record, roster notifications, walkthrough checklists generated from the twin. Zero hardware; proves the record, the watch plane, and the notify loop end to end.

SENSE. Sensors per the approved catalog at the named vulnerable points: temp on risers and exposed runs, leak points at water heaters and laundry, main-meter flow if not already connected. One gateway. The live plane lights up and alerts move from forecast-risk to measured state.

CALIBRATE. Each cold event logs predicted against measured onto the event ledger. Catch rate, false-alarm rate, and lead time accumulate per the watch spec; the building's baselines move from asserted to earned.

## Watch configuration (from the 2026-08-06 session)

Freeze: forecast low under threshold fires informational pre-alert and generates the vacant-unit walkthrough route; measured pipe temp falling through threshold fires act-now; vacant-unit cold signals rank top of list. Opt-in occupied units report ambient directly; non-opt-in units are inferred from riser and neighbor state.

Water: any leak sensor wet fires act-now; continuous main-meter flow in the quiet window fires act-now (running leak); any flow in a vacant building is leak certainty; heavy-rain forecast at a mapped-flood-zone building fires informational pre-positioning (FEMA layer is already in the record plane).

Energy: master-metered assumption makes this connect-first; weather-normalized baseline deviation fires informational (equipment fault or behavior); runtime anomalies on major loads (short-cycling compressor, long-running DHW element) fire informational and escalate on persistence.

## Build flow (software does not wait for hardware)

Ruled into the plan 2026-08-06: the app and watch plane are built against a SIMULATOR, not the kit. Because the architecture is contract-first (the app consumes the watch-plane API) and both sensor families publish their payload formats and decoder functions openly, everything except physical validation is buildable hardware-free. The simulator emits realistic gateway-format uplinks (temp curves through a freeze night, battery decay, missed heartbeats, a leak event, quiet-window pressure drift) and is a first-class permanent artifact: demo mode for sales, test fixtures for CI, scenario replay for watch tuning — not scaffolding to throw away.

Three tracks run in parallel. TRACK A (software): watch-plane contract, simulator, ingest with documentation-built decoders, freeze watch v0 (forecast-only, needs zero hardware and can go live on the building before any sensor ships), then app core flows. TRACK B (bench, when the kit arrives): join to the gateway, verify real payload bytes against the documentation-built decoders, measure battery drain at our reporting interval, print QR labels, write the site notes sheet. TRACK C (Alan): discovery call (checklist below), site selection, ship, install. The tracks meet at one swap point: the Minnesota install replaces the simulator feed with the real feed on an already-working pipeline. If the contract held, that swap is configuration, not rebuild.

## Assumptions register

1. Student housing is master-metered (owner pays utilities). ASSUMED 2026-08-06, unverified. Discovery must verify; if wrong, energy watch v1 needs hardware (CTs) instead of a meter-data connect.
2. Building internet exists for gateway backhaul. Unverified; cellular backhaul is the fallback.
3. As-builts exist in usable form. Unverified; capture cost rises if the building must be surveyed from scratch.

## Boundaries

Unit interiors are opt-in only (rewards or consent mechanics are on the operator's side of the table; consent is a field on the unit node). Common areas, risers, chases, and mechanical spaces are the default surface. No actuation anywhere in the pilot. We watch the building, not the people; this binds hardest on building two (assisted living) and is an engineering scope rule, not messaging.

## Dependencies

Tenant-private enforcement. Waypoint's building telemetry is tenant-private by accessPolicy, and the substrate does not enforce tenant isolation today (anonymous default tenant; the tenancy leg, sprint 54, is the gate). Two resolution paths, operator call owed: sequence the sense step behind the tenant leg, or run the pilot on an explicitly isolated deployment as an interim posture with a named migration path. WATCH v0 (forecast-only) carries the least sensitive data and can proceed ahead of the ruling.

Approved catalog research pass. The sense step cannot be scheduled until the catalog rows it needs are filled and sourced.

## Minimum viable test kit (priced 2026-08-06)

Two-vendor order, all US stock, US915 band (valid in both Texas and Minnesota). Flow: deliver to Texas, bench the full kit (join sensors to the gateway's built-in network server, verify payloads, heartbeats, and probe placement on a test pipe), then ship the same kit to Minnesota for Alan's install. Scope: risers and common spaces plus one opt-in unit, as basic as it can be. The post-install inventory pass sizes the real deployment.

| Qty | Item | Placement | Unit price | Source |
|---|---|---|---|---|
| 1 | RAK WisGate Edge Lite 2 (RAK7268, US915) | Mech room or office, ethernet to building internet | 234.00 | Rokland (FL, in stock) |
| 5 | Dragino LHT65N (US915) | 2x riser pipe points (external probe strapped under insulation), 1x mech room, 1x common area, 1x test unit ambient | 45.00 | Choovio (Irvine CA, 455 in stock) |
| 3 | LHT65N external temperature probe | For the riser and mech-room units | 5.00 | Choovio |
| 2 | Milesight EM300-SLD spot leak (US915) | Water heater pan; test unit under sink | 90.00 | Choovio (51 in stock) |
| 1 | Dragino PS-LB water pressure, thread variant (US915) | Threaded onto an existing mech-room port (spare valve, water heater drain, or laundry tee) | ~119.00 | Choovio |

Hardware total roughly 773 USD plus consumables shipped in the box: zip ties, foam pipe tape, thread seal tape (for the PS-LB port), command strips, and an ethernet cable. The PS-LB is the kit's systemic sense per the proactive-first ruling (2026-08-06): pressure on the supply artery flags a drip anywhere in the building as a quiet-window baseline deviation, before any floor sensor gets wet; the two leak sensors are point senses at the highest-consequence spots. Discovery must identify an available threaded port (and verify thread size) before the PS-LB variant is ordered, and check whether the existing water meter has a pulse register (the flow half of the systemic pair). Prices are snapshots as of 2026-08-06; re-verify at order time. Cheaper leak alternative (Dragino LWL02, 26.00 at Choovio) was out of stock at pricing time; the Milesight unit is the in-stock reliable pick. The dual-probe Dragino LSN50v2-D22 is the riser upgrade path at inventory time (two pipe points per device, larger battery); the LHT65N-plus-probe is the MVT pick because it is one SKU for every temperature role, US-stocked, and cheap.

Bench acceptance before anything ships to Minnesota: every sensor joined and decoding on the gateway's built-in network server, probe-on-pipe reading verified against a reference thermometer, leak sensor fires wet and clears dry, pressure sensor verified on a test port (reads static pressure sanely, no thread weep at hand-tight-plus-quarter-turn), heartbeat interval confirmed, and the one-page install sheet written from the bench experience.

## Discovery checklist (the Alan conversation)

1. Which building. Confirm the student-housing-first recommendation and pick the specific property.
2. Drawings: what exists (as-builts, renovation sets, anything).
3. Metering: verify master-metered; identify utility provider and whether interval data is accessible.
4. Existing systems: thermostats, BMS, any connected equipment already reporting somewhere.
5. Internet: what backhaul exists for a gateway.
6. Staff: the roster, current freeze protocol, how they get told today.
7. History: past freeze events, burst pipes, water damage incidents. This is the baseline story the first winter's ledger is measured against.
8. Occupancy calendar: break schedule, vacancy patterns.
9. Opt-in mechanics: Alan's appetite and vehicle for unit-interior participation (his side; we only need the answer's shape).

## Revision history

- 2026-08-06, origin. Scoped from the sensor program session, same day as the Waypoint conversation.
- 2026-08-06, MVT kit priced. Two-vendor US-stock order (Rokland gateway, Choovio sensors), roughly 654 USD, Texas bench first then ship to Minnesota; bench acceptance criteria recorded.
- 2026-08-06, proactive-first amendment. Operator ruling reframed sense roles (predictive / systemic / point); PS-LB water pressure sensor added as the kit's systemic sense (total roughly 773 USD); port and meter-register discovery items added.
