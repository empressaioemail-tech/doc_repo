---
decision_id: 2026-09-03_gas_utility_service_rail_closed_unacquirable
date: 2026-09-03
owner: operator
status: active
related_canonical:
  - _decisions/2026-09-01_parcel_record_rails_v2_template.md
  - _decisions/2026-09-01_every_parcel_starts_with_a_full_record.md
  - _inbox/2026-09-02_parcel-scout-gis_close.json
  - _inbox/2026-09-02_parcel-scout-gis_inventory.md
  - _dispatches/2026-09-03_parcel-acquire-gis_dispatch.md
---

## Decision

The gas sub-row of the `utilityService` rail (Texas scope) is ruled permanently
unaccounted — no acquisition path exists by any mechanism found, and it is not
re-scouted on future passes absent a materially different sourcing mechanism.

## Context

`utilityService` is a companion rail added in the rails-v2 growth template
(`_decisions/2026-09-01_parcel_record_rails_v2_template.md`), typed with water,
wastewater, electric, and gas sub-rows. PARCEL-SCOUT-GIS (2026-09-02) scouted all four
live and found three completely different acquisition postures hiding under one rail
name: water/sewer strong (PUCT CCN polygons, three independent live mirrors), electric
weaker (one federal HIFLD source, unverified live endpoint), gas none. The scout's own
leave-behind recommended exactly this ruling rather than leaving gas as a standing
"still looking" item re-scouted indefinitely. The alternative considered — leaving it an
open item and re-checking on each future GIS pass — was rejected because the absence is
structural, not a search gap, and re-scouting would spend cycles with no plausible
payoff absent a new mechanism.

## Structural commitment check

Confidence earned, not asserted: strengthened. A cell that stays honestly unaccounted is
more calibrated than one carrying a live "still investigating" status with no actual
investigation happening. Cost per jurisdiction: relevant — this closes a line item that
would otherwise consume re-scouting cost on every future pass for zero acquisition
payoff. Every-parcel-full-shape doctrine (`ENFORCEMENT.md`): this ruling does not delete
or demote the rail to not-applicable — the gas sub-row stays a real, countable,
unaccounted cell on every parcel; it stops being an open acquisition question, not a
tracked column.

## Reasoning

The scout's live checks: PUCT's own electric/gas maps (`puc.texas.gov/industry/maps/
electricity/`) are static cartographic PDFs, not GIS services — no ArcGIS REST endpoint
for gas or electric distribution-territory boundaries was found anywhere, unlike water/
sewer's PUCT CCN layer. The Railroad Commission of Texas's public GIS viewer publishes
oil and gas well, pipeline, and administrative-district layers — nothing describing gas
distribution retail-territory polygons. This is because Texas gas distribution is not
organized under an exclusive-certificated-territory model the way water/sewer is:
jurisdiction splits between the municipality (franchise ordinance, original authority)
and the Railroad Commission (rates outside municipal limits, pipeline safety) — a
franchise-based structure, not a polygon-based one. The scout explicitly distinguished
this from a read-path failure (403/404/DNS, treated as a different, re-checkable
category throughout its inventory): this is a confirmed structural absence. The one
named alternative — a franchise-city-boundary crosswalk plus a self-published utility
territory map — was flagged as not authoritative GIS data, i.e. not actually an
acquisition path, only a possible future workaround if someone builds it deliberately.

## Reversal criteria

Revisit if a materially different sourcing mechanism is proposed: a gas utility
publishes its own territory GIS layer, PUCT or RRC changes data posture to include
distribution-territory polygons, or the franchise-boundary-crosswalk approach is
deliberately built and its output is treated as a citable secondary source rather than
authoritative GIS data. This ruling is Texas-scoped; if the second-state template work
(Utah, or any future state) surfaces a state where gas distribution is
certificated-territory-based, evaluate that state independently rather than inheriting
this ruling.

## Dependencies

Depends on: PARCEL-SCOUT-GIS close (`_inbox/2026-09-02_parcel-scout-gis_close.json`), the
rails-v2 template decision. Feeds: the derived rail-liveness gate — gas stays excluded
from every coverage denominator and publish-gate score per the rails-v2 safety
conditions, and that exclusion set must continue to print gas by name, not silently.
Does not block or gate `_dispatches/2026-09-03_parcel-acquire-gis_dispatch.md`, which
already excludes gas from its scope regardless of this ruling.

## Counterparties

Internal: property seat (respects the exclusion; does not re-card gas on a future GIS
pass without a named new mechanism), GTM lane (any customer-facing coverage claim on
`utilityService` must carry the three-way split — water/sewer live, electric weak,
gas permanently unaccounted — never a single undifferentiated rail status).
