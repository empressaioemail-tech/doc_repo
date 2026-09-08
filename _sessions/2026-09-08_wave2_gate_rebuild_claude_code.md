---
id: 2026-09-08_wave2_gate_rebuild_claude_code
title: Session close — Wave 2 preconditions cleared, and the gate that refused six counties for a real reason
date: 2026-09-08
status: closed
applies_to: portfolio
seat: integration (doc-repo-79)
plan_rows: [P-124, P-120]
related:
  - 90_operations/OPS-16_texas_market_plan_of_record
  - _decisions/2026-09-08_zoning_unaccounted_two_populations.md
  - _inbox/2026-09-08_ctx-w2_readiness-gate-rebuild_findings.md
  - _sessions/2026-09-07_ctx_completion_sprint_claude_code.md
---

# Session close, 2026-09-08

## Why this session existed

A-115 was written as a resumption contract so a fresh planner could pick P-124 up from a
single row. It worked. The two Wave 2 preconditions it named were the whole brief, and
both are now closed, though neither closed the way the row expected.

## Precondition 1: the gate was refusing a defect that does not exist

CTX-F's instantiation check refused Williamson at 46.9 percent and Caldwell at 51.4
percent. Both refusals were wrong.

A-113 and A-115 had already named two defects: two counts divided rather than two sets
intersected, and the wrong store. Reading `parcel-record-fill.mjs` surfaced a third that
nobody had named, and it is the one that produced the false refusals. `parcel_record`'s
intended population is `landing_parcel_jurisdiction`, the parcel jurisdiction layer,
because that is what its `LANDING_PAGE_SQL` pages. `cad_property` is an account roll. A
parcel is not an account; a condo tower puts hundreds of accounts on one parcel. The old
metric divided one population by another that it has no reason to equal.

Measured as real id-set intersections, `parcel_record` equals
`landing_parcel_jurisdiction` exactly in all six counties. Neither county was ever
under-instantiated. That also answers A-115's open `parcel-record-fill` question, which
had been confirmed by sampling in two counties and now holds at population level in six.

The floor is unchanged at 0.99. The counties pass because the measurement was corrected.

Proven by violation in both directions: of 37 counties in `cad_property`, 23 have zero
conformant atoms, and the real gate code run against live production stores passes 6 of 6
CTX counties while refusing Dallas at 1,100,154 accounts and Tarrant at 984,135.
Predictions were registered before the run. `RECORD_FILL_SHORT` has no real-data
violation anywhere and is proven synthetically, which is stated in the module header
rather than hidden.

A-113's unresolved hazard is also resolved and is benign. `FACTORY_DATABASE_URL` and
`FACTORY_DATABASE_URL_RO` are the same endpoint and the same database, differing only by
role; `landing_cad_property` is catalog-present and `information_schema`-invisible to
`parcel_record_ro`. That is the role-scoped enumeration artifact A-113 itself named.

## Precondition 2: the cadRoll card rested on a superseded premise

Two independent findings, either of which alone would have stopped the fold-in.

The unblock trigger had not fired in the sense that matters. CTX-C's situs guard is
commit `94cbc11f`, open in legacy-design-tools PR #637, not merged and not an ancestor of
the pinned bundle SHA. "Landed clean on all six counties" described a clean dry run.
Folding the patch in would have run it through a CLI with no situs guard, which is the
fabricated-dollar-value harm the card was deferred for.

The premise is also superseded. The publish path runs the conformant CLI, not the legacy
one, and at the pinned SHA that CLI always reads `cad_property` for dollar fields. The
pinned commit is titled "Wave R CAD dollars from cad_property, never roll atoms".

What survives is the half that does not depend on who writes the rail: `facetScore` does
not count cadRoll as a coverage dimension, so a regression there is invisible. The
post-condition CTX-F specified was built without the fold-in it proposed, comparing
`cad_property` against the baked payload read back out of `place_layer_snapshots`.

Two corrections to the record along the way: `dollar-fields-patch` HAS run, twelve
succeeded rows on 2026-09-01, contradicting "never run for any of the six counties"; and
no production publish has ever succeeded for any of the six, so the served cadRoll values
came from that patch rather than from a bake.

## What the gate then caught, which is the real finding

With both preconditions closed and the publish image rebuilt and deployed, the first
Bastrop staging bake refused `RAIL_REFUSED` on `zoningDistrict`. It refuses in all six
counties, 79,197 cells, every one on an incorporated parcel.

That is the gate working, and it means P-124's completion definition is not met for any
county. The operator ruled to declare the polygon-miss population not-applicable after
something actually looks at it.

Measuring before acting on that ruling changed its scope by an order of magnitude. The
79,197 cells are two populations: 5,876 polygon misses in cities whose zoning layer is
wired, and 73,321 in cities with no staged layer at all. The ruling only ever applied to
the first. For the second, nothing ever looked, and a declared absence there is the
fabricated absence the doctrine prohibits.

And most of it is not a ruling at all. `parcel-r5-zoning` already carries the honest
resolution, added 2026-09-05, sweeping no-staged-layer cities to a `refused` cell whose
reason names it as a data-acquisition gap rather than a join failure. `refused` is an
earned cell kind while `isUnaccounted` is strictly `kind === "unaccounted"`, so a swept
cell leaves the count honestly. The job last ran 2026-09-02, before the reload that
replaced every parcel row and before the fix itself, and no `refused` cell existed
anywhere. The counts were stale by construction.

The full reasoning is `_decisions/2026-09-08_zoning_unaccounted_two_populations.md`.

## The artifact that is actually missing

`parcel-r5-zoning`'s own header states why a polygon miss stays unaccounted: no per-city
completeness declaration exists anywhere in the stack, so a zone-polygon miss is never
turned into a fabricated absence. To honestly call a polygon miss not-applicable, someone
must be able to say that a city's staged layer is complete. No such declaration exists
for any city. That is the thing to come back to, and it is small: city key, layer
version, what established completeness, date.

## What was wrong tonight, and it was mostly instruments

Four instrument errors, all mine, all caught before they reached a durable claim except
where noted.

A cadRoll probe returned zero rows for all six counties and printed a confident verdict
that cadRoll was null everywhere. `place_key` is `node:<fips>:<propid>` and it filtered
`<fips>:%`. The corrected reading is 1,185,840 rows carrying real dollar values. It now
carries a predicate control that refuses instead of reporting an absence.

A store query returned 06:07Z and nearly produced a wrong conclusion that the Neon
maintenance window had passed. `now() AT TIME ZONE 'UTC'` returns a naive timestamp that
the driver localised as CDT and re-converted, adding exactly five hours. Three
independent clocks put it at 01:07Z.

A bbox containment probe was written to be the "something looked" evidence, and its own
self-test failed: 0 of 300 known-stamped parcels overlapped their city's polygons.
`txgio_parcel.zoning_jurisdiction` carries `bastrop-city-tx` while the staging table
carries `city_key = bastrop-tx` and `city_name = Bastrop`. It was a reimplementation of a
join the real job already does correctly, and building it was the wrong instinct.

A `| tail -30` on a long-running job buffered all output, so a healthy process looked
hung for ten minutes and was killed for nothing.

The one that did not happen: every load-bearing claim this session came from a file-based
instrument with a self-test, and three of those self-tests failed on first run and
refused to emit. That is the difference between this session's error rate and last
night's.

## Measured, and worth carrying

Bake durations, from real execution history rather than estimate: Caldwell 11 minutes,
Bastrop 16, McLennan 21, Hays 51, Travis 2h55m, Williamson 3h5m. Roughly eight hours per
full pass per target. Travis and Williamson must not straddle the 05:00-06:00 UTC window.

Gold parcels exist for all six counties in execution history, not just the one in
`GOLD_PARCELS`, and all six were verified to survive the 2026-09-03 reload.

Road-node dry runs: Travis 218,345 atoms planned, Williamson 115,287, both with
`priorActive: 0` and zero errors. No apply has run.

## Open at close

The zoningDistrict residue after the `parcel-r5-zoning` apply, and the per-city
completeness declaration it needs.

`maxImperviousCoverPct` refuses on Travis at 244,669 while excluded in the other five.
Unexplained and not chased.

LDT PR #637 open and unmerged. hauska-engine main five commits ahead of what serves, with
its deploy card parked at `_inbox/2026-09-08_PARKED_hauska-engine-api_p120_production_deploy.md`.

buildingFootprint reconciliation dispatch compiled and not yet carried.
