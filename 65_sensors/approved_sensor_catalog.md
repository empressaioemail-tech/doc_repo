---
id: approved_sensor_catalog
title: Approved sensor catalog — criteria and skeleton
status: draft (skeleton; zero models approved)
last_updated: 2026-08-06
applies_to: portfolio
owner: nick
related: [sensor_program_overview, pilot_waypoint, 19_hardware_sovereignty/hardware_sovereignty_overview]
---

# Approved sensor catalog

The descriptor-shaped approved list: per use case, an approved make and model with an install spec, so sensors appear on a drawing sheet as a schedule the same way fixtures do, and so a commissioning flow can bind a known device class to a node without per-engagement research. This is doctrine item 4 in the overview.

**Current state: zero models approved.** This doc is the skeleton and the criteria. Filling the model slots is a sourced research pass; per the same sourcing discipline as the hardware folder, every approved entry must carry a source and an as-of date, and prices are snapshots to re-verify, never quotes. Nothing gets pitched or installed off this doc until its row is filled and sourced.

## Approval criteria

A sensor is approvable only if it passes all five gates:

1. DATA IS OURS AT THE SOURCE. The device's readings must be capturable directly (open radio protocol such as LoRaWAN, or local pulse/wired output) or through a vendor API with export. A device whose only path is a closed vendor cloud is rejected regardless of other merits. This is the program's first filter.
2. RADIO AND POWER POSTURE. Building default is LoRaWAN-class: battery life measured in years, one powered gateway per building, no dependence on customer wifi. Wired or BMS-integrated devices are fine where infrastructure exists (connect before sense). Cellular reserved for isolated assets.
3. INSTALL SIMPLICITY. Installable by an electrician or maintenance tech from the install spec plus the app commissioning flow, without us on site.
4. SERVICEABILITY. Field-replaceable battery, published battery-life figures, and a failure mode we can detect (a sensor that goes silent must be distinguishable from a sensor reading normal; heartbeat or check-in interval required).
5. COST DISCIPLINE. Per-point cost tracked in the catalog row; the pilot establishes the cost-per-building-twinned number the same way commitment 3 tracks cost per jurisdiction.

## Catalog skeleton

| Use case | What it feeds | Placement pattern | Approved model | Source / as-of |
|---|---|---|---|---|
| Pipe / surface temperature | Freeze watch; energy (HVAC health) | Risers, chases, exposed runs, unheated mech spaces | none yet | pending research pass |
| Ambient temperature + humidity | Freeze watch (opt-in units, common areas) | Common areas; opt-in unit interiors | none yet | pending research pass |
| Leak / water presence | Water watch | Water heaters, laundry, mech rooms; opt-in under-sink | none yet | pending research pass |
| Water meter pulse / flow | Water watch (quiet-window flow); energy | Main domestic meter; submeters where present | none yet | pending research pass |
| Energy CT clamp | Energy watch | Panel-level major loads (HVAC, DHW) | none yet | pending research pass |
| LoRaWAN gateway | All watches (backhaul) | One per building; ethernet or cellular backhaul | none yet | pending research pass |

Rows are added per vertical as they earn scoping (vibration for the municipal bearing watch is the first known addition; oil and gas rows only when that vertical is scoped).

## Candidates (research pass 2026-08-06; not approved)

First sourced pass, scoped to the Waypoint demo. Every candidate is open-protocol LoRaWAN, so all pass gate 1 (readings arrive at our own gateway and network server; no vendor cloud in the path). Approval still requires a bench pass: join to our network server, decode the payload, verify heartbeat behavior, and confirm battery and install claims. Prices below are snapshots from distributor listings, mixed currencies, re-verify before quoting anything.

Pipe / surface temperature: Dragino LSN50v2-D22 (two external waterproof probes per device, so one unit reads two pipe points; range -55 to 125 C, stated accuracy plus or minus 0.5 C; 8500 mAh Li-SOCl2, vendor-claimed up to 10 years; onboard temperature alarm feature). Single-probe D20 and D23 variants exist. Source: dragino.com product pages and LSN50v2-D2x datasheet, as of 2026-08-06.

Ambient temperature and humidity: Dragino LHT65N (listed around 34 to 40 EUR at EU distributors) or Milesight EM300-TH (8000 mAh, listed around 52 to 58 EUR). Either works; pick one for fleet consistency at bench time. Sources: invibitshop.com, choovio.com, milesight.com, as of 2026-08-06.

Leak / water presence: Milesight EM300-SLD (spot probe, for water heater pans and point locations) and EM300-ZLD (rope sensor, for zone coverage in laundry and mechanical rooms). Both carry integrated temperature and humidity, 4000 mAh, vendor-claimed up to 5 years. Sources: milesight.com, choovio.com, store.mcci.com, as of 2026-08-06.

Water meter pulse / flow: Dragino SW3L-LB (inline flow sensor, DN15 to DN50 variants, 8500 mAh, reports volume on interval and supports continuous-flow alarm, US915 supported). Caveat recorded: SW3L is an inline device requiring a plumbing cut-in, sized well below a building main; for the demo it fits a high-signal branch (laundry or DHW feed), while the building main should be read from the existing meter's pulse register if one exists. The meter-register reader is an open candidate slot. Sources: dragino.com, amazon.com listings, as of 2026-08-06.

Water pressure (systemic leak signal): Dragino PS-LB (thread-installation NPT probe variants, e.g. PS-LB-TN4-B at 0 to 1 MPa which covers building supply pressure; immersion variants exist; 8500 mAh Li-SOCl2; US915). Installs on an existing port (spare valve, water heater drain, laundry tee) without cutting pipe. Listed 119 to 506 USD at Choovio depending on probe configuration; basic thread variant at the low end. This is the artery instrument for the proactive-first ruling: quiet-window pressure signature deviation flags a leak anywhere in the tree before water reaches a floor. Honest bound: pressure alone is a learned-baseline signal whose strength depends on the building's plumbing (a closed system behind a check valve gives clean decay signatures; an open system is subtler); pairing with meter-pulse flow is the strong configuration. Sources: choovio.com, dragino.com, embeddedworks.net, as of 2026-08-06.

Energy CT clamp: Milesight CT101 (100 A; CT103 300 A, CT105 500 A variants), clamp-on without de-energizing the panel, self-powered by harvesting from the measured conductor so no battery service, threshold alarms supported. Listed at roughly 119 to 139 AUD at one distributor. Sources: milesight.com CT10x datasheet, iot-store.com.au, store.mcci.com, as of 2026-08-06.

LoRaWAN gateway: RAK WisGate Edge Lite 2 (RAK7268V2, 8-channel indoor, variants from roughly 154 to 247 USD as of 2026-05, LTE-backhaul variant available) or Milesight UG65 (SX1302, built-in network server option, triple backhaul). Sources: store.rakwireless.com, store.rokland.com, milesight.com, as of 2026-08-06.

## The industrial family: NCD.io (second radio family, added 2026-08-06)

NCD.io (US manufacturer) is filed as the program's industrial tier, added alongside the LoRaWAN commodity tier, not replacing it. Radio is 900 MHz DigiMesh (Digi mesh networking, not LoRaWAN), 2-mile stated range, battery life claimed 5 to 10 years by model, so it is a second radio family requiring its own gateway where used.

Gate 1 analysis: PASS. The payload protocol is open and documented, gateways publish MQTT to any broker (Azure, AWS, or ours), and modem-plus-computer receiver options exist with no vendor cloud in the path. Their IoT Edge Computer runs OpenWRT with Node-RED preloaded and can store data on a local database, which makes a data-never-leaves-the-building deployment possible; that option is directly relevant to the sovereignty tier in the hardware folder.

What NCD covers that the LoRaWAN candidates do not: condition monitoring. The Vibration Temperature Sensor V3 (3-axis MEMS, plus or minus 16 g, sampling to 25.6 kHz, onboard FFT with RMS velocity and peak frequency outputs, plus raw waveform on demand, IP65, magnet mount) is priced 384.95 to 406.95 USD; receivers run 199.95 (USB modem) to 649 (Enterprise IIoT Gateway), as of 2026-08-06. The family also carries C1D2 hazardous-location certified variants (vibration, leak), which gives the oil and gas vertical a concrete hardware path when it earns scoping. Their catalog also spans current and power monitoring, tank level, machine runtime, and environmental rows that overlap the LoRaWAN tier at a higher price point.

Positioning ruling recorded as candidate doctrine: LoRaWAN is the building default (multifamily, commercial, per-point costs in the tens of dollars); NCD is the machine default (pump stations, motors, compressors, hazardous locations, per-point costs in the hundreds where onboard FFT and certification earn it). The bearing watch on the Bastrop SCADA twin is NCD's natural first engagement. For the Waypoint demo, v1 stays LoRaWAN-only; a single NCD vibration point on a mechanical-room pump is a named option if the demo wants a predictive-maintenance showcase, at the cost of a second gateway.

| Use case | What it feeds | Candidate | Price snapshot (2026-08-06) |
|---|---|---|---|
| Vibration + temperature (condition monitoring) | Bearing watch; energy watch (equipment health) | NCD Vibration Temperature Sensor V3 | 384.95 to 406.95 USD |
| Industrial gateway / receiver | NCD family backhaul | Enterprise IIoT Gateway Lite (379) / Enterprise (649) / USB modem (199.95) | as listed |

Sources: store.ncd.io product and gateway pages, fetched 2026-08-06.

## Install spec convention

Each approved model gets an install spec section in this doc when its row is filled: mounting, placement rules relative to the node it senses, commissioning steps (scan, bind, photo, confirm first reading), and the battery/heartbeat expectations the watch plane monitors. The install spec is written so it can be lifted onto a drawing sheet or handed to a trade unchanged.

## Open

1. The research pass itself: candidate models per row, sourced, with the data-ownership gate applied first.
2. LoRaWAN network server choice (overview open item 2) constrains gateway selection; settle together.

## Revision history

- 2026-08-06, origin. Skeleton and criteria from the sensor program session; no models approved.
- 2026-08-06, first research pass. Candidate models filed for all six rows (Dragino temp/flow, Milesight leak/CT, RAK or Milesight gateway), all open-LoRaWAN, none approved pending bench validation.
- 2026-08-06, industrial family added. NCD.io filed as the second radio family (900 MHz DigiMesh, open protocol, MQTT to any broker, local-only deployment possible): condition-monitoring vibration line, C1D2 variants for oil and gas, gateway economics recorded. Positioning candidate-doctrine: LoRaWAN is the building default, NCD is the machine default.
