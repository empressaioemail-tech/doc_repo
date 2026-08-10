---
id: convergence_smart_site_live_layer
title: Smart Site and the live layer — one ladder
status: active
last_updated: 2026-08-06
applies_to: portfolio
owner: nick
related: [sensor_program_overview, watch_app_spec, 76i_smartsite_contribution_economy_roadmap, _smartsite_masters/03_smart_site_white_paper_substance, _inbox/2026-08-02_bastrop_scada_infrastructure_intelligence_ask, 54_tenant_leg_sprint]
---

# Smart Site and the live layer: one ladder

Ratified in the 2026-08-06 sensor program session. The sensor program (65_sensors) is not a sibling product line to Smart Site; it is the live rung of the Smart Site ladder. This doc joins the two doc families so they stop being parallel universes.

## The join

The Smart Site white paper defines the twin as the assembled record of a place: unified, verifiable, current, addressable by people and agents. That is the cold and warm rungs of the sensor program's ladder. The sensor program adds the live rung: the same node graph gains a private, tenant-isolated overlay of senses, watches, equipment inventory, and event history. One twin, two altitudes of data on the same nodes: the public record everyone can see, the private live layer only the owner sees. The white paper's trust model (public pools, private stays isolated, enforced at the data layer) is exactly the boundary the live layer requires; nothing new is invented.

The X-ray extends the same way: today it reads down through the governing layers; a live site's X-ray gains a pulse (current state and event history on top of the record).

## The customer journey

EXPLORE (any site's public twin, free, anonymous; built, the Smart Site surface) → CLAIM (attributed ownership of your site's twin; the 76i claim flow; rides the sprint-54 tenancy/auth leg) → TWIN IT (Capture, Connect, Sense: the live layer) → WATCH IT (freeze, water, energy, maintenance; the paid relationship).

The claim flow is shared infrastructure between the contribution economy (76i) and the watch program, and both gate on sprint-54 auth. This is the single most load-bearing dependency in the convergence.

## Brand and naming (state as of 2026-08-06)

Smart Site is the noun. Twinning is the verb. The watch is the unit of the paid relationship. The watch app is not a third brand; it is the claimed-site experience of Smart Site.

"Twin your home" is the interim consumer articulation of claim-plus-twin. Operator has flagged it as provisional; a rename is expected (candidate floated: "property watch" or similar). Open item, routed through the catalog-thesis check when it lands.

## Surface split (ruled 2026-08-06)

One brand, persona-split surfaces. A homeowner gets one app: their claimed site, its watches, its record. An operator or landlord additionally gets the FIELD COMPANION posture (the maintenance-staff surface specified in `watch_app_spec.md`: alert-ack, walkthrough, commissioning, offline-first) because the person who owns the portfolio and the person standing in the mechanical room at 2am are different people. The homeowner is both people, so one surface serves them.

## The city scaling

A city is a portfolio owner whose sites include right-of-way, mains, lift stations, and pump houses. Same ladder, same claim, same watch contract: a homeowner has one claimed site; an operator has a portfolio; a city has a community of sites including its infrastructure. The Bastrop SCADA twin ask (recorded 2026-08-02, boundaries settled: read-only plus anomaly alerting, custom build) is "twin it live" applied to a pump station. City sensors on mains are systemic senses on the city's arteries, the proactive-first doctrine one scale up: pressure on a building main and pressure on a distribution main are the same watch shape with different targets.

Boundary, stated so it is never fumbled: the city view is built from the city's own sensors on city-owned infrastructure plus the public layer. It does not aggregate private buildings' telemetry; a landlord's data never feeds a city dashboard. This is the tenant-sovereignty rule doing what it was written for, and it is a selling point to both parties. The opt-in future (a neighborhood leak triangulated between a city main sensor and buildings that chose to share) is a consent product, parked, not a default.

## Revision history

- 2026-08-06, origin. Convergence ratified in-session: one ladder, claim as shared infrastructure, one brand with persona-split surfaces, city scaling with the sovereignty boundary stated.
