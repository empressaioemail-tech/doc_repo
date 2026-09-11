# MISSION - OPS-21 Z2: teach the writers to propagate not-applicable (P-149)

## Z1 inverted the plan. Read this before anything else.

The 3,376-parcel residual was **never blocked on `zoningDistrict` resolving. It already
resolved, correctly.**

Z1 (P-147) queried the Factory store live, twice, primary and replica, zero drift: **there are
ZERO unaccounted `zoningDistrict` cells anywhere, in any county.** The entire residual is
`not-applicable`, and every one is legitimate — a genuine zoning-polygon miss inside a city
whose staged layer IS declared complete (Bastrop, Lockhart, San Marcos, Waco, Austin,
Pflugerville, Leander, Cedar Park, Round Rock, Buda, Hutto, Georgetown, Liberty Hill, Taylor).
Per-county counts 44 / 26 / 1,014 / 1,021 / 1,271 reconcile exactly to S1's and S4's
independent numbers. Z1 had nothing to apply and wrote no code.

**The actual blocker is a missing branch in two writers.**
`parcel-setback-cells.mjs` (S1) and `parcel-envelope-cells.mjs` (S2) advance a parcel only when
its `zoningDistrict` reaches `value` or `refused`. Neither has a branch for `not-applicable`.
Those cells can never become `value` or `refused` — they are correctly and permanently
`not-applicable` — so **3,376 x 8 dependent cells are permanently stuck under current logic.**

That is this program's own defect class pointed at itself: a code path that runs perfectly and
cannot succeed for a population, because no branch exists to move it.

## What you are building

Teach both writers to propagate. When a parcel's `zoningDistrict` is `not-applicable`, its
eight dependent rails are **also `not-applicable`**, carrying the same attestation forward.

    setbackFrontFt  setbackSideFt  setbackRearFt  setbackCornerFt  setbackRules
    maxHeightFt     maxLotCoveragePct            maxFootprintSqFt

**The semantics are the point, so get them right.** A declared-complete city's zoning layer
covers the area that city zones. A parcel inside its limits matching no polygon is **unzoned
land** — right-of-way, water, or a tract the city never zoned. Unzoned land has no zoning
district, therefore no district-based setback, therefore no district-derived height, coverage
or footprint limit. `not-applicable` is the correct and honest state. It is not a deferral and
it is not an absence.

**Carry the attestation.** The `zoningDistrict` cell's `not-applicable` payload holds the
completeness declaration's evidence — layer vintage, both coverage measurements, who
established it. The propagated cells must carry a pointer to that same basis, not a bare
`not-applicable`. A reader must be able to get from a setback cell to why the city was declared
complete.

## STANDING FACTS

- **`parcelAreaSqFt` is NOT in scope.** It never depended on `zoningDistrict` and is already
  resolved for these parcels. S2 says so explicitly.
- **Do not touch the completeness declaration.** `zoning-layer-completeness.mjs` is not yours;
  the cities involved are already declared and the declaration is doing its job correctly here.
- **Do not widen this beyond `not-applicable`.** A `zoningDistrict` that is `unaccounted` or
  `refused` still defers, exactly as today. You are adding one branch, not changing the rule.
- **Writers are gated never to regress an earned cell.** Preserve that. A parcel that already
  reached `value` on a setback rail must not be moved.
- Hays (48209) is excluded; P-145 has not landed.
- `parcel_record_cell` is on the FACTORY host (`ep-round-base-au0jofwp`); cortex tables are on a
  different host; no SQL join across them.

## What this unblocks, and it is the whole point

Those 3,376 parcels are the ONLY reason the eight rails fail their gate. The gate is
zero-tolerance on `unaccounted`, and `not-applicable` satisfies it. **Close this and eight
rails become gate-eligible across all five counties in one move** — which is the last thing
between the program and a slate pass.

## Completion predicate

`unaccounted` count for the eight dependent rails on in-city parcels in the five in-scope
counties **reaches zero**, and the gate verdict for each of those (county, rail) pairs flips to
`pass` on the next scheduled evaluation. Report both — the cell count and the verdict grid —
because the second is what the next lane consumes.

Reconcile exactly, in S1's format: value + absent-verified + refused + not-applicable equals the
denominator, no remainder.

**Re-verify the verdict grid immediately before you close.** S4 proved `parcel_gate_verdict` is
a live table under active scheduled re-evaluation: `48453:parcelAreaSqFt` flipped from `refuse`
to `pass` between its two checkpoints.

## Also flagged by Z1, not yours to fix
`zoning-layer-completeness.mjs` carries a stale prose figure — Elgin "1,680 held" against the
file's own later, binding 506 ceiling. Registered separately. Do not edit that file.

## Out of scope
`parcelAreaSqFt`. The four 3P-14 rails. The completeness declaration. Slating anything
(S5/P-148 and its successor own the slate). Hays. legacy-design-tools.
