---
id: 2026-09-07_ctx_completion_sprint_claude_code
title: Session close — the CTX completion sprint, ten lanes, and the bake that must not run yet
date: 2026-09-07
status: closed
applies_to: portfolio
seat: integration (doc-repo-26)
related:
  - 90_operations/OPS-16_texas_market_plan_of_record
  - 90_operations/OPS-20_thread_coordination_index
  - _decisions/2026-08-30_ctx_one_more_bake
  - _decisions/2026-09-06_boundary_envelope_atom_program_scope
---

# Session close, 2026-09-07

## Why this session existed

The operator asked what was ready to be baked. Four Central Texas surfaces had been
deployed that morning and roughly forty merged PRs were finally serving, but a large
share of the work reached no customer until a bake ran, and nobody had scoped which
bake over which counties.

The answer turned out to be that the bake could not run at all, and that running it as
scoped would have destroyed the thing it was meant to publish.

## The premise was wrong four times before any work started

Six read-only agents swept the last sixty hours. Each correction below reversed
something the session had been told or had inferred, and each was found by reading a
write path rather than by measuring output.

There are two bakes, not one. The LDT facet bake produces base facts, land use,
acreage, zoning and a cadRoll block of nulls. It consumes no setback tables at all;
`getSetbackTable` survives in it only as a stale header comment describing deleted
code. Setbacks, buildable envelopes, building footprints and boundary edges, the four
families the operator named, come from elsewhere entirely. Three of them come from the
hauska-engine atom bake, which has no runner in any of the thirty-three Cloud Run jobs
across both projects.

The zoning stamp had been silently erased. On 2026-09-03 a StratMap reload replaced
every parcel row in all six counties and dropped the derived zoning stamp, leaving
`zoning_district` NULL on 1,516,110 parcels. Verified live with Comal 48091 as an
unreloaded control still carrying 28,305 stamps on the same column and predicate.

Running the bake would therefore have been destructive rather than merely useless. The
582,442 baked snapshot rows that still carried a real zoning district were the only
surviving copy of that derived value, and the conformant lane that wrote every one of
them has no monotonic guard. A bake before a re-stamp would have overwritten the last
copy with nulls.

And the ledger cannot see any of this. `county_facet_coverage` reported Bastrop zoning
at 99.77 percent from a 433-row sample against a real 12.3, and Travis at 0.00 from
`sampled=0` with `staleness_flag=false` against a real 46.6. Wrong in both directions,
and the table anyone would have scoped the bake from.

## What the operator ruled

A-027's "one bake; do not rebake" was reversed on its own pre-registered criterion.
P-124 was opened as an eight-lane sprint with a completion definition written so it can
fail. Round Rock's two disagreeing setback tables were reconciled to the corpus
derivation with LDT's district breadth. Georgetown's adopted-not-yet-effective rewrite
serves now with its effective date disclosed. Boundary edges were ruled five of six
rather than acquiring road nodes, then amended at close to six of six with road-node
acquisition folded in, so the next pass finishes rather than increments. One live
index-search against the Hays clerk portal was authorised. Publishing to npm was
authorised.

## What ten lanes found that the planner had not

Every one of these came from a lane reading its own repository, and each contradicted
something this seat had written into a dispatch or an amendment.

The boundary-edge writer could not execute for anyone. `writeBoundaryEdgeAtomsBatch`
never accepted a lease parameter at any layer while the function beneath it hard
requires one. So the write path had thrown on every attempt since the v2 lease law
landed, and Bastrop's 26,846 atoms necessarily predate it. A zero row count cannot
distinguish never-attempted from cannot-succeed.

The cadRoll patch joined on `propId` with no integrity gate. Measured across full
populations rather than samples, Hays disagreed on 37,473 parcels and Travis on 14,403.
Travis appears in no collision list anywhere. A blind apply would have written another
property's market, assessed, land and improvement values onto roughly fourteen thousand
Travis parcels as real data with no absence marker.

A dead-looking auth key was load-bearing. `BROKERAGE_EXTENSION_PUBLIC_KEY` was the only
brokerage secret ever provisioned to cortex-api, and `brokerageAuth()` ran its
`keys.size === 0` gate before the session check. Retiring the extension would have
returned 503 to every brokerage request in production, including real logged-in users,
under a commit message about a chrome extension. The usage evidence that the surface
was dead was correct and measured the wrong thing.

Parcel identity churns and aggregates hide it. Sampling 200 baked Kyle parcels in Hays
found 30.5 percent no longer exist in `txgio_parcel` at all, 19.5 percent exist but no
longer fall inside their polygon, and only 50 percent cleanly persist, while the healthy
90 percent aggregate masked all of it because new parcels backfill the count. Bastrop
then measured zero churn across 400 samples in two cities. So the churn is not universal
and is not established as Hays-specific, and four counties remain unmeasured.

`parcel_record` is a different population from the tax roll. It is drawn from the
StratMap parcel layer rather than the CAD account population, confirmed at row level in
Bastrop at 300 of 300 and by prop_id format in Williamson. Bastrop merely looks healthy
because its StratMap rows carry real values while Williamson's are hollow. That is a
deeper answer to why the ledger is not the serving ledger than the footprint rail was.

## The failure mode, and it was mostly the planner's

Five instances of one thing: an instrument's visibility or precision was part of its
claim, and that part went unstated.

A wrong-database query returned "relation does not exist" and was read as an absence. A
hash comparison hashed an empty string from a failed fetch and reported it as
divergence. A `parcel_record` count from the factory store was divided by a
`cad_property` count from the cortex store and reported as a triangulated instantiation
ratio. A role-scoped `information_schema` enumeration was read as proof a table did not
exist. And a maintenance-window margin was calculated to the tenth of an hour from an
ETA extrapolated from ninety seconds of runtime.

Four of the five were this seat's. Three were caught by lanes, one by the operator, one
by rereading a familiar-looking hash. None was caught by rereading the conclusion.

The counter-pattern that worked, every time, was pre-registering what a wrong answer
would look like. The production outage was caught by predicting a 401 and getting a 503.
The malformed seat registration was caught by running the gate against a deliberately
unregistered control, so that two different refusal codes became the diagnosis. The
stale-base green was caught because a base had moved and someone checked. A falsifier
that cannot fail is not a falsifier, and three of the smoke-test probes offered as proof
that the auth fix was live returned identical results under the broken code.

## What shipped

All six counties stamped and verified, each with an out-of-city NULL check and the
Comal control holding at 28,305 throughout. Caldwell boundary edges complete at 57,180
edges across 6,482 parcels, exact to projection, and the first boundary-edge data
written anywhere since the lease law landed. `@empressaio/setback-corpus@1.1.0`
published with its acceptance gate ported and proven by violation before the publish
rather than after. Round Rock reconciled, the Kyle provenance regression repaired, and
`waco-tx.json` added and now serving, which was the single highest-return item in the
sprint because McLennan was the only county with zero setback coverage. The brokerage
auth defect fixed and verified by digest provenance rather than by behaviour. The
pre-bake readiness gate built with both checks proven by violation through the full
publish path. Eight of ten lanes closed.

Nothing destructive ran. Every write went to `txgio_parcel` or added atoms, and the
served snapshots are untouched.

## Open at close

The full resumption contract is A-115 and a fresh planner should work from that row
rather than from this narrative. In short: Wave 2 cannot run until the readiness gate's
instantiation metric is re-measured against the store the bake reads using a content
test rather than a provenance test, the cadRoll patch is folded into the publish
sequence as a post-condition, the four remaining churn checks are run, and Austin's
stamp completes.

Carried with their own state: the LDT corpus repoint staged and blocked on a
supply-chain policy that was correctly not bypassed, the vendored JSON deletion pending
a consumer audit, the `setbackFrontFt` refused-state ruling with no implementer, the
footprint reconciliation merged and never run, parcel succession scoped and unbuilt and
now measured, the Williamson serving-path identifier question, the `parcel-record-fill`
population question, road-node acquisition for Williamson and Travis, McLennan boundary
edges held past the Neon maintenance window, and hauska-engine main five commits ahead
of what serves.

## The thing worth carrying beyond this sprint

Three separate near-misses were caught by lanes measuring something they were not asked
about, or refusing an explanation that fit. Two of the largest findings came from
retracting a story in the open before it propagated. The planner's dispatches were
wrong in six places and every one was corrected by a lane reading its own code.

The dispatches were built from a six-agent probe that mixed live reads with document
reads. The lanes were in the repositories. That difference is the whole result.
