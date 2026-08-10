---
id: 2026-08-06_alan
title: ALAN — sensor program founded (65_sensors), Waypoint pilot scoped end to end, Smart Site convergence, app journey mapped
date: 2026-08-06
status: closed
applies_to: portfolio
owner: nick
related: [65_sensors/sensor_program_overview, 65_sensors/pilot_waypoint, 65_sensors/watch_app_spec, 65_sensors/convergence_smart_site_live_layer, 65_sensors/positioning_and_brand, 76i_smartsite_contribution_economy_roadmap, _inbox/2026-08-02_bastrop_scada_infrastructure_intelligence_ask, 54_tenant_leg_sprint]
---

# ALAN — the sensor program founding session

Named for retrieval: this is the Alan Hoffman / Waypoint Management session. Everything about the pilot, the kit, the app journey, and the program's founding rulings traces here.

## Origin

Nick met with Alan Hoffman (Waypoint Management; multifamily operator, student housing and assisted living, buildings in Minnesota; also Nick's architecture client). Walking the platform presentation, Alan pulled on the digital twin: pipe-freeze early warning alone would be valuable. Demand state recorded honestly: yes to a pilot in the "I'd buy it if it existed" sense; no pricing discussed. Second customer-originated sensor pull in five days (Bastrop SCADA ask 2026-08-02). The session founded the sensor program as a portfolio-wide band and scoped the Waypoint pilot end to end.

## Created: `65_sensors/` (new band, slot 65) — eight artifacts

1. `sensor_program_overview.md` (active) — vocabulary, three planes (record/telemetry/watch), seven-rule doctrine, sense roles, verticals, folder index.
2. `watch_spec.md` (draft) — the watch contract: target/baseline/condition/tier/roster; event lifecycle with acknowledgment trail; notification rules (act-now = push plus SMS always); external signals; API/MCP contract-first; time and runtime conditions (maintenance watches).
3. `approved_sensor_catalog.md` (draft) — five approval gates (data-ours first); sourced LoRaWAN candidates for all rows; PS-LB pressure entry with honest bounds; NCD.io filed as the industrial second radio family (LoRaWAN = building default, NCD = machine default; NCD's natural first engagement is the Bastrop SCADA bearing watch); zero models approved pending bench.
4. `pilot_waypoint.md` (draft) — sequence Capture / Connect / Watch v0 / Sense / Calibrate; MVT kit priced ~773 USD, two-vendor US stock (Rokland RAK7268 gateway 234; Choovio: 5x LHT65N @45, 3x probes @5, 2x EM300-SLD @90, 1x PS-LB ~119; consumables incl. thread seal tape in the box); Texas bench then ship to Minnesota (US915 both states); bench acceptance criteria incl. pressure test-port check; build flow (simulator-first, three parallel tracks meeting at a feed swap); assumptions register; discovery checklist for the Alan call.
5. `watch_app_spec.md` (draft) — mobile-first surface on the watch contract; personas (maintenance staff primary, owner, installer, resident-v2); flows: alert, building, walkthrough, commission, portfolio, photo (all in-app, attached to nodes/events), inventory (label capture → equipment nodes + maintenance schedules; honest-degrade to draft nodes), weather (same feed the watch fires on); offline as hard requirement; PWA + SMS redundancy; list-first; onboarding journey (below).
6. `convergence_smart_site_live_layer.md` (active) — the program is the LIVE rung of the Smart Site ladder. EXPLORE → CLAIM → TWIN IT → WATCH IT; the 76i claim flow is shared infrastructure; one brand with persona-split surfaces (field companion for operators only); city scaling (a city is a portfolio owner of its own sites; city view built from city-owned sensors plus the public layer, never private buildings' telemetry).
7. `positioning_and_brand.md` (draft) — position (giving your site senses; watches on what matters), vocabulary rules, claims discipline, brand mechanics, offer architecture (ratified).
8. `install_guide_waypoint_mvt.html` — six-station field install guide with SVG diagrams, published as a private artifact for phone use: https://claude.ai/code/artifact/747ca727-9bc9-4906-b549-8ed9ca00bee6 (v2, pressure station included). Pipe-marker visual style, sanctioned for trade-facing field materials only.

## Rulings (operator, 2026-08-06)

1. Vocabulary ratified: a twin is the place's record of itself; cold/warm/live; sensors are the twin's senses; Capture → Connect → Sense; a watch = baseline + condition + roster.
2. Water watch is the umbrella (internal leak + external flood conditions).
3. "We watch the building, not the people" — engineering scope rule, deliberately not a positioning artifact.
4. Unit interiors opt-in only (legal side-check named it the low-friction option); consent is a field on the unit node.
5. Master-metered student housing ASSUMED, verify at discovery.
6. Proactive-first: sense roles are predictive / systemic / point, designed in that order; a point-only deployment is explicitly not the product. PS-LB water pressure added as the kit's systemic sense.
7. App calls: PWA not native; act-now never push-alone; MCP-first honored by contract order; list-first; photos in-app (texting flow is pre-app interim); label-capture inventory; in-app weather.
8. Convergence: part of Smart Site, no third brand. Smart Site = noun, twin = verb, watch = paid unit. Field companion for operators; homeowners get one surface. "Twin your home" interim; rename expected (candidate "property watch").
9. Offer architecture ratified (filed in positioning doc): Layer-1-free forecast freeze watch for claimed sites; the watch per site is the purchase unit, never per-sensor; twin fee + watch subscription + hardware pass-through (hardware-is-yours as the commercial twin of data-is-yours); segments (operator pilot-first, assisted living ledger-emphasis, homeowner later, city custom-only); buyer-supplies-the-number sales frame; architect channel (spec the live layer into new construction) and the install guide as a sales asset.
10. Build flow: simulator-first; software does not wait for hardware; freeze watch v0 (forecast-only) can go live before any sensor ships.

## App onboarding journey (operator vision, filed in watch_app_spec.md)

Freebie (claim + forecast watch) → walk-and-shoot capture → AI inventory → the app designs the deployment and produces one cart (inventory = ORDER GENERATOR) → kit ships bench-provisioned and station-labeled with a personalized install guide → install fork (guided self-install / scheduled third-party; concierge-behind-the-button recommended until volume) → live. Simulator carries the whole journey for testing; Nick is user zero, Waypoint is client 1. Design system: extract Smart Site (PE rebrand) tokens as base, add the mobile/alert layer; formalize in the app repo.

## Open items

1. OPERATOR CALL OWED — tenant-private gating: sequence the sense step behind sprint-54 auth, or run the pilot on an explicitly isolated interim deployment. Watch v0 (forecast-only) proceeds either way.
2. Operator answers owed on three UX questions: freebie friction floor (pre-claim SMS teaser vs account), who walks the capture walk at the pilot building (recommend staff-with-app), cart transparency display.
3. Kit order ready to place (~773 USD; PS-LB variant waits on the port-thread discovery answer).
4. Discovery call with Alan — checklist ready in the pilot doc (building pick, drawings, master-metered verify, port thread, meter pulse register, internet, staff roster and protocol, incident history, occupancy calendar, opt-in appetite, PM software).
5. Telemetry plane placement — ADR-008/56 topology check owed (instinct: substrate-level ingest, watch plane as function package, app as Empressa surface).
6. LNS choice (gateway built-in vs central ChirpStack) — not needed until multi-building. Notification provider selection.
7. Consumer rename through the catalog-thesis check.
8. Bench pass before any catalog model flips to approved; Spanish-language guide and app noted; QR labels at bench.

## Next actions in order

Order the kit; book the Alan discovery call; start Track A (watch-plane contract + simulator, then ingest + decoders, then freeze watch v0 live on the building pre-hardware); bench pass on arrival; ship and install; swap simulator feed for the real feed.

## Revision history

- 2026-08-06, session. Mid-session capture folded into this final record at close (the separate capture file was superseded and removed pre-commit).
