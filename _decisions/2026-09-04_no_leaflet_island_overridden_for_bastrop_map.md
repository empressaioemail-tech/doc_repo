---
decision_id: 2026-09-04_no_leaflet_island_overridden_for_bastrop_map
date: 2026-09-04
owner: nick
status: active
related_canonical: [_inbox/2026-09-04_dashboards_map_architecture_scoping, _decisions/2026-09-04_systems_linking_is_the_thesis, 90_operations/OPS-17_govtech_stack_plan_of_record]
---

# Decision

`smartcity-dashboards`' founding "No Leaflet island" rule (G-61, 2026-08-17 — mount the real product via embed, never reimplement its function locally, enforced by two regression tests asserting served output never contains the string "leaflet") is **explicitly overridden for one case**: the native Bastrop property map. A Leaflet-based map page, reading real data through the now-ready `smartcity-os` platform route (`GET /api/platform/property-intel/summary`, PR #49), is authorized to ship inside `smartcity-dashboards`.

## Operator's own reasoning

"at the time of creating that rule i underestimated what the map lift would actually cost in terms of effort and simultaneously i am launching smartsite soon so i dont want to rush into work that could hinder that. so bastrop existing map needs to come into the new platform and we will swap it out later once smartsite is in a better place and we have the capacity to do the wrk. this is the safer path, not perfect but workable."

Two real, named constraints: (1) the rule's own author underestimated, at the time it was written, what a real map integration would actually cost — direct iframing of `smartcity-os`'s own map is independently confirmed technically blocked (`x-frame-options: SAMEORIGIN`), so the only two live options are the Leaflet-native build or continuing to show SmartSite (an unrelated product with no permit/zoning data). (2) A near-term SmartSite launch means no capacity should go toward hardening or expanding the "mount the real product" architecture for this specific case right now, and no risk should be introduced to that launch.

## What this explicitly is and is not

- **Is**: a deliberate, temporary exception, for the property map only, justified by real near-term constraints (a launch, a cost the rule's own author now knows was underestimated).
- **Is not**: a repeal of "No Leaflet island" as a general architectural principle. Everything else this product embeds (SmartSite for anything other than the property map, Plan Review, Smart Files) keeps mounting the real product, unchanged.
- **Is not** permanent. The operator's own stated plan: swap this Leaflet map back out once SmartSite is in a better launch position and there is real capacity to do that integration properly — the eventual, correct architecture (SmartSite/hauska-factory feeding this map, or `smartcity-os` itself becoming framable) is unchanged from what `_inbox/2026-09-04_dashboards_map_architecture_scoping.md` already described; this decision only authorizes a real, working stopgap in the meantime.

## Structural commitment check

- Sell reasoning, not data: unaffected — the map still shows real Bastrop data, sourced honestly (`origin: "feed"`, real ArcGIS values kept as-is).
- Confidence earned, not asserted: unaffected.
- Cost per jurisdiction onboarded: this is explicitly a cost tradeoff decided in the open — accepting a one-time, bounded architectural exception now, against the cost of either delaying the map indefinitely or risking the SmartSite launch.
- Dual interface: unaffected.

## Reversal criteria

Swap the Leaflet map back out for the real, `hauska-factory`-fed architecture once SmartSite has launched and capacity exists — the operator's own stated trigger, not a fixed date.

## Dependencies

Depends on: `smartcity-os` PR #49 (the platform-internal property-intel route), already built and tested, unaffected by this decision.
Feeds: resumption of the `smartcity-dashboards`-side map build, previously halted by the agent that found this exact conflict.
Does not reopen: "No Leaflet island" as a rule for anything other than the property map.
