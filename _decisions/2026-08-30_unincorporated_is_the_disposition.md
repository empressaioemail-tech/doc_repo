---
decision_id: 2026-08-30_unincorporated_is_the_disposition
date: 2026-08-30
owner: Nick (operator), recorded by doc_repo planner
status: active
related_canonical:
  - _inbox/2026-08-30_ctx_consolidated_execution_plan.md
  - _catalog/2026-08-30_breadth_place_alias_seed.json
  - _inbox/2026-08-30_alias_seed_findings.md
  - 28_THE_BASTROP_MOLD_engine_build_spec.md
---

## Decision

A place that is not an incorporated city gets the explicit disposition
**`unincorporated`**. Do not extend `texas_roster_v1` to CDPs to make those
places addressable, and do not seed around the gap.

## Context

**CORRECTED 2026-08-31: the scope is 36 values over 15 places, not 40 over 17.**
The confirm-sheet pass found a real seed error. `48309_eddy`, `48309_bruceville`,
`brucevill` and `brucville` (4 rows, **2,288 parcels**) were graded as having no
`place_fips`. That is false: **Bruceville-Eddy is `place_fips` 10828, parent county
48309**, verified in the roster. An exact-name lookup missed a hyphenated name and
drew the wrong conclusion. Left uncorrected, this ruling would have applied an
`unincorporated` disposition to a real incorporated city — the precise failure it
exists to prevent. Re-verify a name before adding it to the excluded set.

The alias enumeration found 36 `breadth_*` values covering 15 real places that
`place_fips` cannot express — Cedar Creek, Driftwood, Del Valle, Dale, China
Spring, Elm Mott, Axtell, Paige, McDade and others. All are absent from both
`_catalog/texas_roster_v1.json` (1,223 incorporated places) and
`tx_city_boundary` (1,222 polygons); 19 were probed against the roster and 0
found. They are unincorporated communities carried in CAD situs as postal city
names.

Two shapes were available: extend the roster to census designated places so every
string resolves to an id, or give the population an explicit disposition.

## Structural commitment check

Sell reasoning, not data: `unincorporated` names why a city-scoped rail is absent
rather than leaving a hole a model fills from priors.
Confidence is earned: a CDP id would imply a jurisdiction that does not zone,
stamp, or set setbacks. Nothing downstream could earn confidence from it.
Fail closed: the disposition refuses a city-scoped claim rather than manufacturing
an authority.

## Reasoning

Operator: unincorporated is the right shape, and it is how these places are
referred to in the real world.

It is also the structurally correct answer. Counties do not zone unincorporated
land — the mold's line 36 and gate 4 make setbacks, edges and envelope city facts,
derived from a city zoning layer. A CDP has no zoning layer, no dimensional
record, and no corporate limits. Giving Driftwood a `place_fips` would create an
identifier that reads as a jurisdiction and can never carry one, which is the
"unrepresentable state encoded in a sentinel" ENFORCEMENT forbids. `unincorporated`
is the representable state.

This also keeps one derivation authoritative. Jurisdiction comes from spatial
containment against `tx_city_boundary`; a parcel outside every incorporated
polygon is `unincorporated` by measurement, not by a name lookup. The alias table
stays name normalisation and never becomes a jurisdiction source.

## Reversal criteria

Reverse if a city-scoped rail turns out to have a real per-place source for an
unincorporated community — a CDP that publishes a dimensional setback record or a
zoning layer. In that case the place needs an identifier, and the roster gains
that entry specifically, with its source named. A general CDP import to make
strings resolve is not a reversal, it is the thing this decision refuses.

## Dependencies

Feeds P3 (the three-state absence split) and the P2 spatial jurisdiction join.
Does not unlock P4 rails. Does not change the 357,269 / 465,568 / 3,732 split,
which was measured by containment rather than by name.

## Counterparties

Internal: operator, property seat, integration.
