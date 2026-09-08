---
id: 2026-09-08_ctx-w2_readiness-gate-rebuild_findings
title: Wave 2 preconditions — the gate was refusing a defect that does not exist, and the cadRoll card was built on a superseded premise
date: 2026-09-08
status: closed
applies_to: hauska-factory
seat: integration (doc-repo-79)
plan_rows: [P-124]
snapshot:
  doc_repo: d87b0439 (at read time; main moved during the session)
  hauska_factory_at_start: 570fb4c
  hauska_factory_at_close: df22ea88
  legacy_design_tools_main: 03b4486a
  ldt_pinned_sha: 65f924e8
related:
  - 90_operations/OPS-16_texas_market_plan_of_record
  - _inbox/2026-09-07_ctx-f_close.json
  - _sessions/2026-09-07_ctx_completion_sprint_claude_code.md
---

# Wave 2 preconditions, resolved

Two A-115 preconditions gated the Central Texas bake. Both are now addressed, and
both turned out to rest on a premise that did not survive contact with the code.

## Precondition 1: the readiness gate was refusing a defect that does not exist

CTX-F's instantiation check refused Williamson at 46.9 percent and Caldwell at 51.4
percent. Both refusals were wrong and both counties are fully instantiated.

A-113 and A-115 had already named two defects: the check divided two counts instead
of intersecting two sets, and it read the factory's landing copy rather than the
store the bake reads. A third defect, found by reading `parcel-record-fill.mjs`, is
the one that actually produced the false refusals.

`parcel_record`'s intended population is `landing_parcel_jurisdiction`. Its
`LANDING_PAGE_SQL` pages that table by prop_id and CAD-ingests onto those records.
So `parcel_record` holds the parcel JURISDICTION LAYER and `cad_property` holds an
ACCOUNT roll. A parcel is not an account; a condo tower puts hundreds of accounts on
one parcel. The old metric divided one by the other, which is not a completeness
measure at all.

Measured as real id-set intersections against the live stores, `parcel_record`
equals `landing_parcel_jurisdiction` exactly in all six counties:

| County | landing_parcel_jurisdiction | parcel_record | overlap |
| --- | --- | --- | --- |
| Bastrop 48021 | 62,256 | 62,256 | 100.00% |
| Caldwell 48055 | 24,988 | 24,988 | 100.00% |
| Hays 48209 | 116,420 | 116,420 | 100.00% |
| McLennan 48309 | 114,254 | 114,254 | 100.00% |
| Travis 48453 | 380,917 | 380,917 | 100.00% |
| Williamson 48491 | 282,570 | 282,570 | 100.00% |

This also answers the A-115 open question about `parcel-record-fill`'s intended
population, which had been confirmed in two counties by sampling. It holds in all
six at population level, and `parcel_record` tracks the StratMap layer row count
with a consistent off-by-one in five of the six.

### What the gate checks now

Gated: the bake population, read with the bake's own predicate from
`publish-bake-chunks.mjs`, intersected against `cad_property` two ways, over the
whole roll (a staleness check) and over real accounts only (A-115's content test, a
real `land_value` or `land_acres`, never a `source_file` provenance test which would
have dropped four fifths of Bastrop). Gated: `parcel_record` against its own landing
population. Reported and never gated: the layer-versus-roll ratio, which varies
legitimately from 69.34 percent in Hays to 100 percent in McLennan because it is the
accounts-per-parcel figure. Gating on that ratio is precisely what broke.

The floor is unchanged at 0.99. The six counties pass because the measurement was
corrected, not because a threshold moved.

### Proven by violation

Of 37 counties in `cad_property`, 23 have zero conformant atoms. The real gate code
run against the live production stores, with predictions registered before the run,
passes all six CTX counties and refuses Dallas 48113 at 1,100,154 accounts and
Tarrant 48439 at 984,135 with `BAKE_POPULATION_MISSING`.

`RECORD_FILL_SHORT` has no real-data violation anywhere, because only six counties
have a landing population and all six match exactly. It is proven synthetically and
that limitation is stated in the module header rather than hidden.

### A-113's unresolved hazard is resolved, and it is benign

A-113 flagged that the integration seat could not find `landing_cad_property`
through `FACTORY_DATABASE_URL_RO` while CTX-F read it through
`FACTORY_DATABASE_URL`, and could not establish whether those secrets pointed at
different Neon branches. They do not. Both are the same endpoint and the same
database, differing only by role, and `landing_cad_property` is catalog-present but
`information_schema`-invisible to `parcel_record_ro`. That is the role-scoped
enumeration artifact A-113 itself named as one of the session's five failure modes.

Established with a two-derivation instrument comparing `to_regclass` against
`information_schema`, carrying a known-present and a known-absent control. The
instrument's self-test failed on its first run because the positive control was
`public.pg_class`, which cannot resolve, and it correctly refused to emit findings.

## Precondition 2: the cadRoll card rested on a superseded premise, and its trigger had not fired

Two independent findings, either of which alone would have stopped the fold-in.

The unblock trigger had not actually fired. A-115 records CTX-C's situs gate as
landed. It is not merged. Commit `94cbc11f` sits in open legacy-design-tools PR #637
and is not an ancestor of the pinned bundle SHA `65f924e8`, which predates it by six
days. "Landed clean on all six counties" described a clean dry run, not a merged
guard. Folding the patch in as specified would have run it through a CLI with no
situs guard, which is the fabricated-dollar-value harm, measured at 45.2 percent in
Hays and about 4.4 percent in Travis, that the card was deferred for.

The premise is also superseded. CTX-F's rationale was that every future bake
silently re-nulls the rail. That is true of the legacy `nodeFacetBakeTier1Cli.ts`
and false of the conformant CLI the publish path runs. Read at the pinned SHA, the
tree `Dockerfile.publish` actually bundles rather than at main,
`nodeFacetBakeTier1ConformantCli.ts` line 242 reads "Dollar / living / year / legal
/ exemption: ALWAYS read cad_property", calls `fetchCountyCadPropertyRoll` at 244 and
threads the roll in at 360, and `nodeFacetBakeTier1Conformant.ts` assembles cadRoll
from `cadPropertyFactsFromRow` at 545 and 558. The pinned commit is itself titled
"Wave R CAD dollars from cad_property, never roll atoms".

Two further corrections to the record. CTX-F reported that `dollar-fields-patch` had
never run for any of the six counties. It has: the factory `runs` table carries
twelve succeeded rows, staging and production, one pair per county, all on
2026-09-01. And no production `publish` has ever succeeded for any of the six, so
the served cadRoll values were written by that patch rather than by a bake.

### What was built instead

CTX-F's load-bearing insight survives and is independent of who writes the rail:
`facetScore` does not count cadRoll as a coverage dimension, so a regression there is
invisible to every existing check. A changed CLI, a `cadPropertyRoll` returning
`consulted: false`, or a pin bump could stop populating it and nothing would fail.

So the post-condition CTX-F specified was built, without the fold-in it proposed.
After the bakes and before `publish_runs` can record success, the freshly baked
snapshots must carry a real cadRoll dollar wherever `cad_property` carries one. It
compares two independently derived populations, `cad_property` and the baked payload
read back out of `place_layer_snapshots` by `place_key`, so no single upstream can
satisfy both halves, and it reads the payload rather than a summary the bake reported
about itself. A county whose CAD roll carries no dollars returns a declared absence
rather than passing vacuously, and an empty or unmatched sample refuses.

Blast radius it protects, measured live: 1,185,840 served rows across the six
counties carry at least one real cadRoll dollar, and the per-county figures match
real CAD source populations exactly. Caldwell 48,382 is the June 5 CAD export row
count, Hays 134,606 the preliminary export, Travis 492,848 the Supp 0 export, and
Williamson 319,480 the numeric CAD account count A-113 named.

## An instrument error worth recording, because it is the session's own failure mode

The first cadRoll probe returned zero rows for all six counties and printed a
confident verdict that cadRoll was null everywhere and therefore not a blocker. It
was wrong. `place_key` is `node:<fips>:<propid>` and the probe filtered `<fips>:%`,
so the predicate matched nothing against a table holding millions of node-facet
snapshots. A zero row count cannot distinguish "no such rows" from "my WHERE clause
is wrong", which is the same shape as the wrong-database read A-113 retracted.

The instrument now carries a predicate control: if the county predicate matches zero
rows across all six counties it refuses rather than reporting an absence. The lesson
is not that the reading was wrong, it is that the instrument had no control capable
of catching it, and it was caught only because a zero against a five-million-row
table was implausible on its face.

## Merged

`c59965e` (PR #101) and `df22ea88` (PR #102), both on green CI verified by the
check-runs conclusion string rather than by a summary line. Tests 1033 to 1078,
zero failing, two pre-existing live-DB skips.

## Still open

The `RECORD_FILL_SHORT` half has never been observed failing on real data.

The gate reads the atoms population at gate time, so an atoms write landing between
the gate and the bake is not covered. Nothing serializes concurrent bakes, which
CTX-F recorded as item 6 and nobody has built.

LDT PR #637, the situs guard, is open and unmerged. It is not needed for the bake but
it is needed before `dollar-fields-patch` is ever folded into an automated sequence.
