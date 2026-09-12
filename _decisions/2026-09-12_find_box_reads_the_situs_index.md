---
decision_id: 2026-09-12_find_box_reads_the_situs_index
date: 2026-09-12
owner: Nick (operator); recorded by the integration seat
status: active
related_canonical:
  - 90_operations/OPS-16_texas_market_plan_of_record (A-132, P-172, P-27)
  - 90_operations/OPS-23_surface_completion_program (F16)
  - _inbox/2026-09-11_p151_observations.json
---

## Decision

The Find box on smartsite.cloud resolves an address from the situs index first, composing
split-situs rows as situs plus city plus state, resolves a parcel id directly, and runs the
geocoder only when the index has no row, labelling the result as geocoded. Rowed as P-172.

## Context

After the P-151 deploy the operator typed `414 SPILLER LN` and got nothing, while the same
parcel's card, reached by id or by click, seals with its header and all seven rows. The Find
box is a geocoder path separate from the sheet resolver P-151 re-seeded from the record
point; cortex returns `geocode_miss` for this address with or without the city. P-27 ruled the
situs index over any geocoder.

## Reasoning

A customer who types an address the record carries and gets nothing has hit the same defect
class as F5 and F12: geocoding demoted by ruling and still reached. The second mechanism,
that the situs index lacks split-situs Travis rows, is testable by searching the parcel id
and by reading the index, and the P-172 mission checks it before assuming the Find box is at
fault.

## Reversal criteria

Reverse only if the situs index cannot be made to cover a county the product serves; then the
geocoder stays primary for that county, labelled, and the gap is rowed as acquisition.
