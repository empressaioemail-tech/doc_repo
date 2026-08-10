---
id: watch_app_spec
title: Watch app spec — mobile-first surface on the watch contract
status: draft
last_updated: 2026-08-06
applies_to: multifamily
owner: nick
related: [sensor_program_overview, watch_spec, pilot_waypoint, 28_mcp_first_product_design]
---

# Watch app spec

The mobile-first human surface on the watch contract. Brand ruling 2026-08-06 (see `convergence_smart_site_live_layer.md`): this is not a third brand; it is the claimed-site experience of Smart Site, split by persona — a homeowner gets one surface; an operator/landlord additionally gets this FIELD COMPANION posture for maintenance staff, because portfolio owner and the person in the mechanical room at 2am are different people. Consumer-facing naming ("twin your home", possible "property watch" rename) is open. Repo placement remains open alongside the telemetry-plane placement question. What is settled here is who it serves, what it does, and the three product calls made 2026-08-06.

Contract order, stated up front so this does not read as a UI-first product: the watch plane's API is specified first (`watch_spec.md`), exposed as MCP tools on the same contract, and this app is a client of that identical API. That ordering is how the program honors the MCP-first commitment.

## Personas, in priority order

1. MAINTENANCE STAFF. The primary mobile user. They are the roster: alerts arrive on their phones, acknowledgment and walkthroughs happen on their feet in the building.
2. OWNER / OPERATOR (Alan). The portfolio layer: buildings, watch status, open events, the season's ledger.
3. INSTALLER. Commissioning is an app flow, which is what makes the install-spec'd-not-owned doctrine real: any electrician can bind a sensor to the twin without us on site.
4. RESIDENT (v2). Opt-in consent flow only in v1; any resident-facing state view is a v2 question.

## Mobile-first rationale

The app lives where the roster lives. Staff are on their feet; the alert, the acknowledgment, the walkthrough, and the commissioning all happen in the building, phone in hand. Desktop is a responsive later-layer for the portfolio view, not the design center.

## Core flows

ALERT. Push arrives; alert detail shows what fired, where in the building, severity tier, why (evidence: readings, forecast values, baseline, with source, confidence, and timestamp; the quality gate rule applies to every alert, not just API outputs), and what to do. Acknowledge lands on the event ledger with a name and a stamp. Act-now alerts also arrive by SMS per the notification redundancy rule.

BUILDING. The live twin as a list-first view: risers, floors, mechanical rooms as nodes with current derived state, sensor states, active watches, occupancy state. "North riser 41 and falling" at a glance.

WALKTHROUGH. A checklist generated from the twin: a freeze pre-alert produces the vacant-unit route, check-off per stop, completion stamped to the event ledger. This is the acknowledgment trail that reads compliance-grade for assisted living.

COMMISSION. Add a sensor: scan its QR or DevEUI, bind to a node on the twin, placement photo and note, live first reading confirms. Commissioning is twin-building; the app is how the sensor plane gets built, not just viewed.

PORTFOLIO. The owner's home screen: buildings, watch status chips, open events, the season's ledger (events caught, acknowledged, resolved, outcomes).

PHOTO. All photos are taken inside the app and attach to the thing they document: a commissioning photo attaches to the sensor's node, a walkthrough photo to the checklist stop, a resolution photo to the event. Nobody texts photos to a number (operator ruling 2026-08-06); the install guide's text-a-photo flow is the pre-app interim only and dies the day this flow ships. Photos are records on the twin like everything else: source, timestamp, who took it.

INVENTORY. Point the camera at any equipment's make/model label (furnace, water heater, RTU, boiler, panel): the app reads the label (vision model), identifies make, model, and serial, and creates the equipment as a node on the twin carrying its attributes, manual link, decoded age where the serial allows, and a generated maintenance schedule from manufacturer intervals. Each schedule line becomes a maintenance watch (time- or runtime-conditioned; see `watch_spec.md`). Unrecognized labels degrade honestly to a draft node the office confirms, never a silent guess; every AI-derived field carries confidence and is correctable, and corrections are logged. This flow is Capture with a camera: walking a building photographing labels IS twinning it, the same way commissioning builds the sensor plane.

WEATHER. The building view carries its own forecast: hourly NWS for the building's location, a named next-freeze banner when a threshold crossing is inside the forecast window ("hard freeze Thursday night, 14 degrees"), and the same feed the freeze watch itself fires on, so staff and the watch plane are looking at one truth, never two apps.

## Product calls (made 2026-08-06)

1. PWA, not native, for the pilot. Push on iOS PWAs is workable now, app-store friction disappears for onboarding a maintenance roster, and nothing in v1 needs native hardware access. The hard companion rule: the act-now tier never depends on push alone; it always sends push plus SMS. Native is a later decision if the program earns it.
2. Contract order per the header: API and MCP tools first, app as client. No app-only capability; anything the app can do, an agent can do through the contract.
3. List-first, not 3D-first. The building view is structured nodes with live state, not a floor-plan renderer, matching the asset-management tier order (record over live state over view). A schematic or plan view is an enhancement that consumes drawn plans later; it is not a v1 dependency.

## Onboarding journey (operator vision, stated 2026-08-06)

The full customer journey, operator-stated, with the structural consequence named: the INVENTORY label-capture flow moves from post-install enrichment to the spine of onboarding, because the photos generate the deployment.

1. FREEBIE. Enter address, see the site's public twin, claim it, forecast freeze watch armed. Value on day one before we hold anything private.
2. WALK AND SHOOT. App-guided capture walk (station-pattern guidance, same interaction DNA as the install guide): photograph equipment labels, panels, risers, shutoffs.
3. INVENTORY. AI reads the labels; equipment nodes, ages, manuals, and maintenance schedules appear on the twin.
4. KIT. From the inventory and capture answers the app designs the deployment (which watches, which senses, where) and produces one cart, one source, us. The inventory step is the ORDER GENERATOR.
5. SHIP. Kit arrives bench-provisioned and station-labeled against the customer's own capture data; the personalized install guide is generated from their capture walk, their photos as the install-here references. Bench provisioning is a fulfillment step, not overhead; it is what keeps self-install zip-tie simple.
6. INSTALL. Fork: guided self-install (station by station, photo-confirm each) or schedule a third-party install. Recommendation recorded, not yet ruled: v1 ships both buttons with the scheduled path fulfilled concierge-style (we arrange the electrician manually) until volume justifies an installer network.
7. LIVE. Senses join, watches arm, weather and measured state on one screen; the first alert closes the loop.

The simulator carries this whole journey for testing: claim a demo building, walk a seeded capture, receive a generated kit, watch a simulated freeze night fire alerts. Operator is user zero; Waypoint is client 1.

Open questions from the 2026-08-06 discussion (unanswered at capture): the freebie's friction floor (a pre-claim address-plus-phone SMS teaser versus requiring the claim account), who walks the capture walk for the pilot building (staff-with-app tests the product; operator-on-site tests nothing), and cart transparency (hardware at visible cost with our fee separate, per the pass-through doctrine, versus bundled display).

## Offline requirement

Mechanical rooms and basements are exactly where phones lose signal, and they are where this app gets used. Photo capture, checklist check-off, and acknowledgment must work offline and sync when signal returns (queued locally, uploaded with original timestamps). This is a hard requirement on the PWA build, not an enhancement.

## v1 scope fence

In: the flows above (alert, building, walkthrough, commission, portfolio, photo, weather), two severity tiers, roster and escalation display, event lifecycle (open, acknowledged, resolved, expired), commissioning against the approved catalog, offline queue. Phased next (v1.5): the inventory label-capture flow and its maintenance watches — specified now because Capture visits should photograph labels from day one so the corpus exists when the flow ships. Out: actuation of any kind (doctrine), resident-facing dashboards, 3D or plan-view rendering, analytics beyond the season ledger, any care-monitoring adjacency (doctrine rule 7).

## Open

1. Repo and hosting placement. Not Command Center (internal operator console), not Property Explorer (customer parcel app); a third surface whose home gets checked against the target topology with the telemetry plane.
2. Brand naming, through the catalog-thesis check.
3. Auth posture: staff accounts ride the tenancy leg question tracked in `pilot_waypoint.md` dependencies.

## Revision history

- 2026-08-06, origin. Drafted from the sensor program session; product calls 1 to 3 ratified in-session.
