# CTX-ACREAGE — the first county graded by the corrected walk failed on a class nobody has measured

Repo: `hauska-factory` for the diagnosis. The fix may not live there; establishing where
it does live is part of the mission.

## The measurement

Williamson staging walk `198fbb56`, 2026-09-09T22:30:50Z, on publish image
`sha256:65fde738` (jobs gen 33/34, `_LDT_SHA 7a739849`), rail applied earlier the same
hour:

    pass = 322    fail = 8

Seven of the eight carry the identical reason:

    3 required leaf(s) fail the four-state contract:
      baseFacts.acreage is null; null is not value|absent-verified|not-applicable|refused;
      zoning declares verdict="unmeasured" which is not one of ...

    48491:76149  76153  76155  76226  365365  77381  73073

The eighth is different:

    48491:PRIVATE ROAD   HTTP 400

## Why this matters more than eight parcels

Williamson touches **none** of the four defect classes this program spent 2026-09-09
resolving. Zero punctuation-only situs rows out of 602,050 (measured by CTX-PROV), no S-P
class, no staleness population, no ceiling in play. It was chosen as the first read
precisely because a failure there could not be blamed on a county's data.

It also had never been graded on content. Its last passing walk, 2026-08-30, carried only
`BP-MEANING-01` and `BP-VERIFY-01`; `BP-CONTENT-01` did not exist. **So this is the first
honest grade Williamson has ever received, and eight parcels is a floor, not a ceiling,
until the population is counted.**

## Three questions, and they are three different defects

Do not treat these as one number or fix them as one change. Two prior lanes on this
program reported distinct classes as a single figure and had to be corrected.

**1. Null `baseFacts.acreage`.** A bare null where the four-state contract requires
`value`, `absent-verified`, `not-applicable` or `refused`. Count the population across all
six counties (48021, 48055, 48209, 48309, 48453, 48491) with a stated counting rule and a
predicate control proving the query can return a non-zero answer for a population you did
not target. Then find the write path that produces it. A bare null is what blocked every
county earlier today in a different leaf, and the fix then was an earned absence, not a
default.

**2. `zoning` declaring `verdict="unmeasured"`.** This is the more interesting one. The
rail's own vocabulary is `value` / `not-applicable` / `refused`, and CTX-CEILING accounted
every Williamson zoning cell hours before this walk. So something is emitting a state the
contract does not recognise.

That is the same shape as `classifyRequiredLeaf` silently passing any unrecognised
declared state as populated, which was fixed this morning — the fix made the walk *refuse*
an uninterpretable state rather than accept it, so this failure may be that fix working
correctly and exposing a producer nobody had seen. **Establish where `unmeasured`
originates and whether it reaches other counties.** If the walk is now correctly refusing
something that was always wrong, say so plainly; that is a good outcome badly disguised.

**3. `48491:PRIVATE ROAD`.** That is a literal string where a `prop_id` belongs, and it
returns HTTP 400. Establish whether it is a lineage artifact or a live id-handling bug.

Relevant prior art you should read rather than rediscover: Caldwell's `48055:1` turned out
to share a `prop_id` with 203 distinct `txgio_parcel` features and 227 share `'0'`, almost
certainly sentinel or bucket ids from the `stratmap25-landparcels` ingest
(`_inbox/2026-09-09_ctx-retire_close.json`). CTX-HAYS-SPLIT then established that StratMap
rows were grafted into `cad_property` and overwrote `source_file` in place
(`_inbox/2026-09-09_ctx-hays-split_close.json`). `PRIVATE ROAD` looks like the same family.
**It is a hypothesis and you must test it, not assume it.** State the second mechanism you
rejected.

## Do not make the walk pass

The walk is correct to fail all eight. Do not widen `BP-CONTENT-01`, do not add
`unmeasured` to the permitted state set, and do not filter any parcel out of the cohort.
The jurisdiction cohort samples `prop_id` ascending, which biases toward low-numbered and
degenerate parcels; two prior lanes deliberately refused to tune that, on the grounds that
adjusting a sampler to avoid a failure it correctly found is sampling around the problem.
That judgement stands.

If a parcel genuinely should not be graded, that is a named class with a counting rule and
a written justification, never a filter.

## What you must NOT do

Do not deploy, submit a Cloud Build, or run any bake, publish, walk or Cloud Run job. The
integration seat owns every execution. Reading a served payload over HTTP is not an
execution and is expected.

Do not write to `legacy-design-tools`, `hauska-engine` or `hauska-map`. If the fix belongs
in one of them, report it with enough precision that a dispatch can be compiled from your
close without a second diagnostic pass — CTX-PROV did exactly that and it saved a full
lane.

Do not touch `cloudbuild.publish.yaml`'s pin or any ceiling.

## Traps carried forward, all paid for today

`parcel_record_cell.place_key` is `<fips>:<prop_id>`, NOT `node:<fips>:<prop_id>`. The
integration seat assumed the latter and got six rows of `n=1` that could have been mistaken
for an answer. `place_layer_snapshots.place_key` IS `node:<fips>:<prop_id>`. Two tables,
two shapes.

Unscoped scans on `parcel_record_cell` time out. Scope by `place_key` prefix or by
`updated_at`, and set `statement_timeout`.

`txgio_parcel` carries multiple geometry rows per `prop_id` (48021: 74,729 rows against
62,257 distinct). Per-parcel `EXISTS` aggregation, never a flat join.

`cli.mjs` has a code-only catch handler that discards error detail; call the job function
directly to see the real error.

## Close contract

Standard lane close JSON, plus:

- The null-acreage population across all six counties, counting rule stated, with the
  predicate control.
- Where `unmeasured` originates, whether it reaches other counties, and whether the walk
  refusing it is the fix working correctly.
- The `PRIVATE ROAD` verdict, the mechanism you chose, and the one you rejected.
- If the fix is elsewhere: where, precisely enough to dispatch.
- `leave_behind`.
