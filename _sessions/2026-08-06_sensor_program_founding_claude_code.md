---
id: 2026-08-06_sensor_program_founding
title: Session — sensor program founded (65_sensors), Waypoint pilot scoped, Smart Site convergence
date: 2026-08-06
status: MID-SESSION CAPTURE (session continuing; app UX design discussion next; final close to follow)
applies_to: portfolio
owner: nick
related: [65_sensors/sensor_program_overview, 65_sensors/pilot_waypoint, 65_sensors/convergence_smart_site_live_layer, 76i_smartsite_contribution_economy_roadmap, _inbox/2026-08-02_bastrop_scada_infrastructure_intelligence_ask]
---

# Session capture: sensor program founding

## Origin

Nick met with Alan Hoffman (Waypoint Management; multifamily operator, student housing and assisted living, buildings in Minnesota; also Nick's architecture client). Walking the Mox-style platform presentation, Alan pulled hard on the digital twin: pipe-freeze early warning alone would be valuable ("I'd buy it if it existed"; pilot yes; no pricing discussed). Second customer-originated sensor pull in five days (Bastrop SCADA ask 2026-08-02). Session founded the sensor program as a portfolio-wide band.

## Created this session: `65_sensors/` (new band, slot 65)

1. `sensor_program_overview.md` (active) — vocabulary, three planes, doctrine, verticals.
2. `watch_spec.md` (draft) — the watch contract: target/baseline/condition/tier/roster, event lifecycle with ack trail, notification rules, MCP-contract-first, time/runtime conditions (maintenance watches).
3. `approved_sensor_catalog.md` (draft) — five approval gates; LoRaWAN candidates all rows (Dragino/Milesight/RAK, sourced 2026-08-06); NCD.io filed as second radio family (industrial/machine tier, 900MHz DigiMesh, open MQTT, C1D2 variants, vibration V3 ~385-407 USD); zero models approved pending bench.
4. `pilot_waypoint.md` (draft) — sequence (Capture/Connect/Watch v0/Sense/Calibrate), MVT kit priced ~773 USD two-vendor US-stock (Rokland gateway 234; Choovio: 5x LHT65N @45, 3x probes @5, 2x EM300-SLD @90, 1x PS-LB ~119), TX-bench-then-ship-MN flow, bench acceptance criteria, build flow (simulator-first, three parallel tracks), assumptions register, discovery checklist.
5. `watch_app_spec.md` (draft) — mobile-first; personas (staff primary, owner, installer, resident-v2); flows: alert/building/walkthrough/commission/portfolio/photo/inventory/weather; PWA + SMS redundancy; offline hard requirement; list-first.
6. `convergence_smart_site_live_layer.md` (active) — the program is the LIVE rung of the Smart Site ladder; EXPLORE→CLAIM→TWIN→WATCH journey; claim flow shared with 76i; one brand, persona-split surfaces; city scaling with sovereignty boundary.
7. `positioning_and_brand.md` (draft) — position, vocabulary rules, claims discipline, brand mechanics, offer architecture (ratified).
8. `install_guide_waypoint_mvt.html` — field install guide, 6 stations + verify, published as private artifact https://claude.ai/code/artifact/747ca727-9bc9-4906-b549-8ed9ca00bee6 (v2 with pressure station).

## Rulings made in-session (operator)

1. Vocabulary ratified: twin = the place's record of itself; cold/warm/live; sensors are senses; Capture→Connect→Sense; watch = baseline+condition+roster.
2. Water watch is the umbrella (leak internal + flood external).
3. "We watch the building, not the people" — engineering scope rule, NOT a positioning artifact.
4. Unit interiors opt-in only (legal side-check: low-friction option); consent is a field on the unit node.
5. Master-metered student housing ASSUMED, to verify in discovery.
6. PROACTIVE-FIRST: sense roles are predictive / systemic / point, designed in that order; point-only deployment is explicitly not the product. PS-LB pressure sensor added as the kit's systemic sense.
7. App product calls: PWA not native; act-now = push+SMS always; MCP-first honored by contract order; list-first not 3D-first; photos in-app (no texting; guide's text-photo flow is pre-app interim); label-capture inventory flow (v1.5, but capture visits photograph labels from day one); weather in-app (same feed the watch fires on).
8. Convergence: part of Smart Site, no third brand; Smart Site = noun, twin = verb, watch = paid unit; field companion for operators only (homeowners get one surface); "twin your home" interim, rename expected (candidate "property watch").
9. Offer architecture ratified: Layer-1-free forecast watch; watch-per-site pricing (never per-sensor); twin fee + watch subscription + hardware pass-through (hardware-is-yours); segments; buyer-supplies-the-number sales frame; architect channel.
10. Build flow: simulator-first, software does not wait for hardware; freeze watch v0 (forecast-only) can go live pre-hardware.

## Key research (sourced, as-of 2026-08-06)

LoRaWAN kit: all candidates open-protocol, pass data-ours gate. RAK7268V2 has built-in LNS (no server hosting for bench). PS-LB threads onto existing port, no pipe cutting; honest bound recorded (pressure = learned-baseline "somewhere" signal; pair with meter-pulse flow for strong config). NCD.io: industrial tier, MQTT to any broker, local-only deployment possible (OpenWRT edge computer — ties to hardware sovereignty); positioning candidate-doctrine: LoRaWAN = building default, NCD = machine default; NCD's natural first engagement is the Bastrop SCADA twin bearing watch.

## Open items (program)

1. Telemetry plane placement — ADR-008/56 topology check owed (instinct: substrate-level ingest, watch plane as function package).
2. LNS choice (gateway built-in vs central ChirpStack) — not needed until multi-building.
3. Notification provider selection.
4. Tenant-private gating: sequence behind sprint-54 vs isolated interim deployment — OPERATOR CALL OWED. Watch v0 (forecast-only) can proceed ahead of the ruling.
5. Consumer rename (through catalog-thesis check).
6. Meter-pulse reader candidate (discovery-dependent).
7. Discovery call with Alan — checklist ready in pilot doc (incl. port thread, meter register, PM software, building internet).
8. Kit order — ready to place.
9. Sensor doctrine formally: actuation read-only confirmed in doctrine; bench pass owed before any model is "approved."

## Next in-session

App build discussion: user journey, UX flow, design system. Operator's UX vision stated: freebie first → photo capture of building → generated equipment inventory → one-source ordering (us) → we ship → schedule 3rd-party install OR self-install. Nick tests as user zero; Alan is client 1.

## Revision history

- 2026-08-06, mid-session capture. Final close (session summary completion, 00_current_state refresh, commit plan) to follow.
