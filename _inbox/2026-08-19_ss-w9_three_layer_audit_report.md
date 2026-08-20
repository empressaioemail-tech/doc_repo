---
title: Statewide three-layer data audit — WRITTEN, SCORED, SERVED
date: 2026-08-19
lane: SS-W9
plan_row: P-43
repo: hauska-engine
branch: ss/w9-statewide-audit
pr: https://github.com/empressaioemail-tech/hauska-engine/pull/348
status: active
last_updated: 2026-08-19
---

# Statewide three-layer data audit

Lane SS-W9, PLAN-ROW P-43, OPS-16 amendments A-018 and A-019.

Every figure below carries a label for how it is known: **VERIFIED** means this lane ran
the command and read the output; **RELAYED** means another lane reported it and this lane
did not re-run it; **INFERRED** means this lane reasoned to it from verified inputs. Every
count carries its denominator and its counting rule.

## The three layers, and why the order is the whole finding

```
WRITTEN   atoms actually in the store            hauska_mcp.atoms
SCORED    the county_facet_coverage ledger cells cortex neondb + GET /api/county-ledger
SERVED    what Smart Site actually shows a human the deployed fact-sheet endpoint
```

A rail can be written, unscored and unserved in three different amounts, and each
disagreement names a different job:

| class | what it means | what it costs |
|---|---|---|
| `unwritten` | no atoms | acquisition plus ingestion |
| `written-unscored` | atoms exist, ledger cell is not satisfied | a scorer run |
| `written-unserved` | atoms exist and are scored, the sheet does not show it | a merge or adapter fix |
| `out-of-reach` | above the rail's own reachable ceiling | NOT A GAP |
| `not-measured` | this instrument did not look | never a zero |

## The footprint question, answered

This was the operator's live question and the lane's first validation case.

**WRITTEN — VERIFIED 2026-08-19T14:03Z.** `building-footprint` atoms exist in **174 of
254 counties**, **3,495,678 atom rows**. The key shape is
`<fips>:<propId>:footprint:<slot>`, so atom rows are not parcels; the parcel figure is the
`footprint:primary` slot, **2,829,513 parcels**, one per parcel that has any footprint.
Command and verbatim output are in the evidence appendix.

**Not one metro is among the 174.** Bastrop 48021, Travis 48453, Harris 48201, Dallas
48113, Williamson 48491 and Bexar 48029 all hold **zero** footprint atoms. The largest
footprint counties are Wise 48497 (65,056), Van Zandt 48467 (56,468), Victoria 48469
(53,584), Wood 48499 (52,796) and Waller 48473 (52,514) — the cheap rural counties. That
matches the rail's own stated limitation, `O(fp x parcels) compute limits metro-scale
apply`, read live off the capability probe.

**SCORED — VERIFIED, and the dispatch's framing is half right.** The live
`GET /api/county-ledger` returns HTTP 200 with `computedAt 2026-08-14T17:41:22.500Z`,
`servedAt 2026-08-19T13:58:13.985Z`, `materializationAgeMs 418611485` — **116.3 hours, 4.84
days**. `footprint` reads `not-yet` on **254 of 254** cells, exactly as briefed.

**But staleness is not the reason, and this changes the remediation.** There is **no
`footprint` row in `county_facet_coverage` at all** — not a stale row, no row. The manifest
grid resolves `c.rail_state IS NULL` to `not-yet` by precedence, so **recomputing the ledger
snapshot would leave all 254 cells exactly where they are.** The fix is a footprint scorer,
which does not exist: the three checked-in scorer CLIs in legacy-design-tools cover
land-use, zoning, envelope, flood and geometry, and nothing else.

**SERVED — VERIFIED against the deployed surface, twice, the second time deliberately, and
now measured on every parcel rather than probed.** A live GET on the production fact sheet
for `48021:36521` returns HTTP 200 with `X-Pe-Read-Path: atom-chain-warm` and a 2,045-byte
body carrying 69 key paths. **None of them is a footprint.**

That probe alone would be weak evidence, because Bastrop has no footprint atoms, so an
absent field could be read as a coverage gap rather than a missing slot. So two Wise County
parcels that DO carry `building-footprint` atoms were probed: `48497:200000002` and
`48497:200000104`, both HTTP 200, `X-Pe-Read-Path: atom-chain`, 617 bytes, 30 key paths, and
**zero** matches for footprint, easement, owner, special district, well, pipeline, corridor,
`tier2`, frontage or `attachingRoads`. Wise is the largest footprint county in the state with
65,056 atoms. **The parcel fact sheet has no slot for the rail at all, so no merge could
surface it.** One parcel, all three layers at once: written yes, scored no, served no.

So footprint is all three classes at once, and each part has a different price:

- 174 counties `written-unscored`, sub-shape `scorer-absent` — a scorer must be built, not run.
- 80 counties `unwritten` — including every metro, where the write is the expensive part.
- 254 counties `written-unserved`, sub-shape `no-served-slot` — a field must be added to the sheet.

## Nine of fourteen rails cannot reach a human at all, and I first reported seven

This corrects my own earlier figure in this report, and the correction came from a control
rather than from a re-read.

The first pass counted seven slotless rails, taken from the frozen `FieldKey` union: nine
fields named, so nine rails presumed served, so seven presumed not. The negative control in
`rail-served.test.ts` runs the detector against the **real production body** and was written
asserting that seven. **It failed. The measured answer is nine.**

| | rails |
|---|---|
| have a slot on the real body (5) | `cad`, `envelope`, `geometry`, `landuse`, `zoning` |
| have NO slot on the real body (9) | `easement`, `flood`, `footprint`, `mud`, `owner`, `rail-corridor`, `roads`, `rrc-pipelines`, `rrc-wells` |

`flood` and `roads` are **named in `FieldKey`**, so a reader of the frozen record would assume
both are served. Neither has a key path on the wire: the body carries no `tier2` key at all,
and `attachingRoads` is never copied by the PE adapter. A field being named in a record is not
the same as a field being on the wire, and that gap is exactly the shape of every defect this
programme has found.

`geometry`'s only slot is `/facets/envelope/geojson`, the buildable-envelope polygon. **The
sheet carries no parcel ring.** That is contract invariant I5 inverted and it is why a missing
address presents as a broken Find rather than as a blank field.

### Two of the nine are an adapter fix, not a new field

Measured on a 300-parcel instrument run over Bastrop with the widened sweep:
`rrc-pipeline-fact` and `rail-corridor-fact` resolve **`on-wire-not-served` for 295 of 300
parcels**. The atoms already ride the chain the PE adapter consumes; the adapter has no field
for them. Statewide that is 12,519,688 pipeline atoms across 250 counties and 13,059,613
corridor atoms across 252, sitting one adapter read away from a user.

The nine-field sweep could not see this. It would have had both rails scoped as new product
fields. That is precisely the mis-pricing the three-layer record exists to prevent, and the
narrow sweep would have caused it.

## The three-layer table

WRITTEN measured by this lane 2026-08-19T14:03Z to 14:21Z. SCORED from the live ledger,
`computedAt 2026-08-14T17:41:22.500Z`. Denominator is 254 Texas counties throughout; 253
carry a loaded parcel roster.

| rail | WRITTEN counties | WRITTEN atom rows | SCORED satisfied | SCORED not-yet | ledger rows | written-but-unsatisfied cells | atom rows in them | served slot |
|---|---:|---:|---:|---:|---|---:|---:|---|
| geometry | 253 | 13,717,341 | 253 | 1 | 254 | 1 | 3,791 | yes |
| cad | 15 | 4,891,247 | 13 | 241 | 254 | 2 | 1,474,464 | yes, situsAddress |
| zoning | 19 | 5,385,433 | 1 | 253 | 254 | 18 | 5,313,670 | yes |
| roads | 101 | 1,746,716 | 0 | 254 | **NONE** | 101 | 1,746,716 | frontage, dropped by the adapter |
| flood | 253 | 13,197,039 | 114 | 140 | 177 | 139 | 11,532,633 | slot exists, wire carries no `tier2` |
| envelope | 11 | 1,478,708 | 0 | 254 | 19 | 11 | 1,478,708 | yes |
| landuse | 15 | 4,250,396 | 13 | 241 | 254 | 2 | 1,058,169 | yes |
| footprint | 174 | 3,495,678 | 0 | 254 | **NONE** | 174 | 3,495,678 | **none** |
| easement | **0** | **0** | 0 | 254 | **NONE** | 0 | 0 | **none** |
| owner | 15 | 4,250,396 | 13 | 241 | 254 | 2 | 1,058,169 | **none, stripped by design** |
| rrc-wells | 174 | 4,338,295 | 0 | 254 | **NONE** | 174 | 4,338,295 | **none** |
| rrc-pipelines | 250 | 12,519,688 | 0 | 254 | **NONE** | 250 | 12,519,688 | **none** |
| rail-corridor | 252 | 13,059,613 | 0 | 254 | **NONE** | 252 | 13,059,613 | **none** |
| mud | 253 | 20,844,039 | 209 | 45 | 254 | 44 | 2,665,176 | **none** |
| **total** | | **106,674,589** | **616** | **2,940** | | **1,170** | **59,744,770** | |

**1,170 of 3,556 cells, 32.9% of the manifest grid, hold atoms and no satisfied ledger cell.
59,744,770 atom rows sit in them.** Not one of those is an ingestion problem.

### Gap classes, all 3,556 cells

Classified by the instrument, denominators stated, counted never subtracted.

| class | cells | of 3,556 | remediation |
|---|---:|---:|---|
| `unwritten` | 1,530 | 43.0% | acquire and ingest |
| `written-unscored` | 1,170 | 32.9% | run a scorer — or BUILD one where none exists |
| `not-measured` | 393 | 11.1% | the served sweep has not reached the county yet |
| `out-of-reach` | 241 | 6.8% | nothing; above the rail's own ceiling and NOT a gap |
| `written-unserved` | 222 | 6.2% | fix a merge, an adapter, or add a served field |
| `no-gap` | **0** | 0.0% | — |

`no-gap` is zero for one honest reason and it is not a defect finding: a cell reaches
`no-gap` only when the SERVED layer has been measured for it, and the statewide serving
sweep was still running when this table was cut. The 393 `not-measured` cells are the
written-and-scored ones waiting on that sweep; they will resolve to `no-gap` or to
`written-unserved` and nowhere else. This is stated rather than hidden because a zero from an
unrun measurement is exactly the shape of defect this programme hunts.

`out-of-reach` uses a coarse rule that must be read for what it is: a rail is treated as at
its ceiling when it holds atoms in at least as many counties as its stated
`maxCountiesReachable`, because the capability probe reports a COUNT and not a SET, so no
instrument here can say WHICH counties are reachable. 239 of the 241 are `owner`, whose
ceiling of 15 is exactly the number of counties whose CAD roll is loaded; the other 2 are
`rail-corridor` at 252 written against a ceiling of 253, where at least one of the two is
genuinely reachable and is being called out-of-reach by the coarseness of the rule.

Counting rules. WRITTEN counties = counties holding at least one atom of the rail's family,
which is a PRESENCE test and not a depth test; the atom-row count sits beside it and the two
are never collapsed. WRITTEN atom rows are ROWS, and only six families key one row per
parcel (`geometry`, `zoning`, `envelope`, `flood`, `rrc-pipelines`, `rail-corridor`); the
rest carry a suffix and their row count exceeds their parcel count. `zoning` sums
`zoning-fact` (19 counties, 4,606,757) and `setback-rule` (7 counties, 778,676); the county
figure is the union, 19. SCORED satisfied = the ledger's own `satisfied-present` or
`satisfied-absent` display state, one cell per county per rail.

## Six of fourteen rails have no ledger row at all

VERIFIED by a live query against `county_facet_coverage` joined to `county_rail`:
`roads`, `footprint`, `easement`, `rrc-wells`, `rrc-pipelines` and `rail-corridor` have
**zero rows**. That is **1,524 of 3,556 cells, 42.9% of the manifest grid**, permanently
`not-yet` regardless of what is in the store, and **a ledger recompute moves none of them.**

Of those 1,524 cells, **951 county-cells are written**: rail-corridor 252, rrc-pipelines
250, rrc-wells 174, footprint 174, roads 101, easement 0. **35,159,990 atom rows are in the
store carrying no ledger cell that any recompute could move.** That is the single largest
thing this audit found, and its remediation is a scorer, not an ingest.

The asymmetry is structural, not accidental. hauska-engine ships **twelve county writers**
(`write-parcel-node-county.mjs`, `write-cad-parcel-roll-county.mjs`,
`write-building-footprint-county.mjs`, `write-road-node-county.mjs`,
`write-flood-hazard-fact-county.mjs`, `write-land-use-fact-county.mjs`,
`write-owner-fact-county.mjs`, `write-utility-easement-county.mjs`,
`write-well-fact-county.mjs`, `write-rrc-pipeline-fact-county.mjs`,
`write-rail-corridor-fact-county.mjs`, `write-special-district-fact-county.mjs`).
legacy-design-tools ships **three scorer CLIs** (`countyCoverageScoreCli.ts`,
`countyFloodScoreCli.ts`, `countyGeometryScoreCli.ts`). Twelve producers, three consumers.

And most of the ledger was not written by those three. VERIFIED from
`county_facet_coverage.verified_by_instrument`: `cad`, `landuse` and `owner` (254 rows each)
were written by `score_cad_rails_fast.mjs`; `geometry` by `B2_cp2_geometry_scorer_apply.mjs`
and `l16-score-geometry-48201.mjs`; `mud` by `l16-score-mud.mjs`. Only `flood` (177 rows)
and one `geometry` cell name a checked-in CLI. **The SCORED layer is mostly the residue of
one-off lane scripts**, which is the mechanical reason no recompute route exists.

## The wells contradiction, and it points the other way from the standing finding

Pre-registered at CP1: `rrc-wells` would be written in far more than one county despite a
stated ceiling of one.

**CONFIRMED, VERIFIED.** `well-fact` is written in **174 counties**: **2,041,196** atoms
naming a real API number and **2,297,099** positive-absence atoms with the `none` suffix,
4,338,295 rows in total. The live capability probe on the same response says
`rrc-wells maxCountiesReachable: 1, reachPct: 0.0039`.

**Harris 48201 holds zero well-fact atoms.** The one county the ceiling says is reachable is
the one county with nothing written. The 174 that do carry wells are led by Callahan 48103
(58,557), Wilbarger 48475 (55,192), Sterling 48401 (52,893), Yoakum 48501 (51,684) and
Menard 48317 (46,592) — West and North Texas oil counties, which is where wells are.

The ceiling contradicts its own basis string. `STATIC_RAIL_CAPABILITIES["rrc-wells"]` in
`legacy-design-tools/lib/db/src/railCoverageCapability.ts` sets `maxCountiesReachable: 1`
while its own `sourceBasis` reads *"RRC public GIS Harris County mirror carries **statewide**
well coverage"*. The hostname is Harris; the data is statewide. A ceiling of 1 read the host
and not the sentence.

**This lane does not resolve it.** Either the hardcoded ceiling is wrong, or 2,041,196 well
atoms and 2,297,099 absence determinations are wrong across 173 counties. Those are very
different remediations and the call is the planner's. What this lane can say is that the two
cannot both be right, and that scoring `rrc-wells` against a ceiling of 1 today would
classify 173 genuinely-written counties as out-of-reach.

## Other contradictions found, none rounded off

**C1. A scorer writes a facet name the ledger cannot join.** `countyCoverageScoreCli.ts`
writes `facet: "land-use"` (hyphenated). The rail key is `landuse`. The manifest grid joins
`c.facet = r.rail_key`, so those **19 rows are orphaned** and no cell ever reads them.
VERIFIED: `land-use` is the only facet in `county_facet_coverage` matching no rail.

**C2. The store says 19 zoning cells are satisfied; the console shows 1.** VERIFIED:
`county_facet_coverage` holds 19 rows with `rail_state = 'satisfied-present'` for `zoning`,
of which only 1 is at or above its threshold (mean honest coverage 8.59%). The read path's
`applyDepthRailDisplayGate` demotes the other 18 to `not-yet`. Both numbers are defensible
and they are 19 apart; anyone quoting either must name which.

**C3. The checked-in rail declaration and the live `county_rail` table disagree in both
directions.** VERIFIED: the live table says all fourteen rails are
`atom_family_state = 'present'` with `has_writer = true`. The checked-in declaration in
`countyRailDimension.ts` says `roads`, `footprint` and `easement` have no writer and that
`rrc-wells`, `rrc-pipelines` and `rail-corridor` have no atom family. Six of fourteen rows
differ. The declaration is also wrong about the store in at least two places: the store holds
12,519,688 `rrc-pipeline-fact` and 13,059,613 `rail-corridor-fact` atoms, so those families
are not missing.

**C4. `rrc-pipelines` is bound to no atom family at all.**
`RAIL_ENGINE_BINDINGS["rrc-pipelines"].atomEntityTypes` is the empty array while the store
holds 12,519,688 `rrc-pipeline-fact` atoms across 250 counties. Any derivation reading that
binding concludes the rail cannot exist. This audit names the family explicitly and files the
disagreement rather than silently picking a side.

**C5. `utility-easement` is the only genuinely empty family.** VERIFIED: zero rows, and the
scan returned in 0 seconds. `easement` is the one rail whose 254 `not-yet` cells are honest —
and the one rail with a writer script (`write-utility-easement-county.mjs`) that has never
been run.

**C6. `flood` has no ledger row in 77 counties.** VERIFIED: 177 rows for a 254-cell rail,
114 satisfied. So flood's 140 `not-yet` cells are two different things — 63 scored and below
bar, 77 never scored at all — and the manifest renders them identically.

## The address ladder, carried forward, and it has more rungs than four

Any coverage figure that does not name its rung is not a result. Rungs are SS-W5's,
re-measured by this lane rather than relayed.

**VERIFIED by this lane 2026-08-19T15:09Z**, `txgio_parcel`, 253 loaded counties, DISTINCT
`prop_id` per county summed. Denominator **13,071,975 parcels**.

| rung | rule | parcels | of 13,071,975 | sentinel it lets through |
|---|---|---:|---:|---|
| non-null | `situs_address IS NOT NULL` — the P-27 rule | 12,999,845 | 99.45% | `", ,"` |
| non-blank | `btrim(situs_address) <> ''` | 12,999,845 | 99.45% | the same; the defect was never an empty string |
| carries-a-street | text before the first comma has a letter or digit | 11,751,433 | 89.90% | not yet named; SS-W5 states there is no proof it catches everything |
| carries-a-city | `btrim(situs_city) <> ''` | 8,179,225 | 62.57% | punctuation-only cities, and road references — see rungs five and six |

Three of the four rungs reproduce SS-W5 to the parcel, which is the strongest available
evidence that both instruments are reading the same table the same way.

**The city rung does not, and the divergence is filed rather than reconciled away.** SS-W5
reported 8,178,863; this lane measures 8,179,225 under `btrim(situs_city) <> ''` — **362
parcels apart across 48 counties**, led by Gillespie 48171 (+263) and Cameron 48061 (+20),
the rest one to six parcels each. SS-W5's exact city predicate is not recorded in the merged
source, so the rules cannot be compared directly. Both numbers are published with their
rules; neither is quietly preferred.

**Rung five exists, VERIFIED.** 11 parcels across 8 counties carry a `situs_city` that is
non-blank and contains no alphanumeric at all: the literal values are a comma, a backslash,
an asterisk, an apostrophe, an at-sign and `????`. That is the `", ,"` defect one column over, and it accounts for 11 of the 362.

**Rung six is worse and is not a sentinel at all, VERIFIED.** In Gillespie 48171, 11,827
parcels carry a non-blank `situs_city` and the most common values are `OFF E US HWY 290`
(1,305 parcels), `OFF S RANCH ROAD 783` (693), `OFF W US HWY 290` (505), `OFF S ST HWY 16`
(468) and `OFF FM 2093` (419). Those are **road references stored in the city column**. They
pass non-null, non-blank and alphanumeric, and a person reading "city: OFF E US HWY 290"
learns nothing. No rule proposed so far catches them.

Every rung so far has been a class of non-value that passed the previous rung's test, and the
ladder is now six rungs and still climbing. Nothing here proves it stops at six.

## Scope, and what this is not

This audit measures **existence, scoring and serving**. It does not measure whether a written
atom is **correct**. A county can be green on all three layers and hold wrong data.

The WRITTEN layer is measured at COUNTY granularity for every rail and at PARCEL granularity
only where the atom key proves one row per parcel. Where it does not, the figure is atom rows
and says so at the point of use.

The SERVED layer is the expensive one, and its first run was **stopped and restarted** on an
operator ruling. That run measured the nine frozen `FieldKey` fields against fourteen rails,
which left it blind on four of the six rails this audit had just proved have no scorer either.
It was killed at 33 complete counties, kept labelled at
`P:/tmp/ss_w9_20260819/served_PARTIAL_9field_20260819T1554Z`, and **not merged** into the new
output, because two field sets in one record is how a coverage number loses its counting rule.

The widened run measures all fourteen rails on every parcel of every loaded county. It emits
the frozen nine-field record **unchanged** plus an additive `railServed` tally from the same
composed body in the same pass, so the two cannot drift. Detached, progress at
`P:/tmp/ss_w9_20260819/served14_progress.json`, watch `ss-w9-served-sweep` repointed with a
45 minute quiet budget. Counties it has not reached are `not-measured`, which is a stated
class and never a zero, and the audit regenerates against its output with `--written-from`,
costing a re-read rather than a re-scan.

Each rail lands in one of four states, and they are four different prices: `served`;
`slot-empty` (a field exists and resolves empty); `on-wire-not-served` (an adapter reading a
field it already receives); `no-slot-in-payload` (a new field on the product surface).

For the seven rails that also have a nine-field `FieldTally`, **the FieldTally is
authoritative for coverage** and the slot tally answers only the slot question. The FieldTally
applies the real Fact-state logic — the street-segment address rule, the envelope decline
logic — that a key-path probe cannot see. Publishing a slot count as coverage would restate
the 99.3%-situs mistake in a new column.

## What this instrument cannot do, stated so nobody reads past it

**`unwritten` is an UPPER BOUND on acquisition work, not an estimate of it.** Some writers
record absence positively and this audit counts that correctly: `well-fact` carries 2,297,099
atoms with the `none` suffix and `special-district-fact` carries 4,978,452 with `sd:outside`,
both real determinations that nothing is there. Zoning does not. 235 counties have no
`zoning-fact` atom, and most of unincorporated Texas is genuinely unzoned, which is a
first-class satisfied-absent state and not a backlog. Those 235 cells are called `unwritten`
here, which overstates what is owed. Guessing which of the 235 are honestly unzoned would be
the fabrication this programme exists to prevent, so the number is published with its ceiling
named instead.

**`out-of-reach` is decided from a count, never a set.** The capability probe reports
`maxCountiesReachable` as a number, so nothing here can say which counties a source reaches.

**Nothing here measures correctness.** A county can be present on all three layers and hold
wrong data. rrc-wells is the live example: 2,041,196 well atoms exist and this instrument
cannot say whether they are right.

**The served field set is now measured, not probed.** The fourteen-rail detector runs on
every parcel of every county and records, per rail, whether a slot exists and whether it
carries a value — with the token list it used and the key paths it actually observed
travelling with each county record. Its zeros are evidence because 29 tests prove every
rail's detector fires on a payload that carries its slot.

## What to do with this, in cost order

1. **Build scorers, not ingests.** 1,170 written-but-unsatisfied cells holding 59,744,770
   atom rows are a scorer problem. 951 of those cells, holding 35,159,990 rows, sit on six
   rails with no ledger row at all, so no recompute route — lane SS-W7's work — can reach
   them. SS-W7 should be told this: a recompute is necessary and it is not sufficient.
2. **Reconcile the rrc-wells ceiling against the store before anyone scores that rail.**
   Scoring it today against a ceiling of 1 would classify 173 genuinely-written counties as
   out-of-reach.
3. **Fix the `land-use` / `landuse` facet-name split.** A live scorer is writing rows that
   the ledger read path cannot join.
4. **Decide what the fact sheet owes.** NINE rails have no served slot and only five can
   reach a human at all. Two of the nine — `rrc-pipelines` and `rail-corridor` — are already
   on the retrieval wire and merely dropped by the adapter, so they are the cheap half. The
   rest is a product decision about what a parcel sheet is for, not a data-pipeline bug, and
   it should be made deliberately rather than inherited from whichever fields the first
   adapter happened to carry.
5. **Refresh the rail declaration against the store.** Six of fourteen rows in
   `countyRailDimension.ts` disagree with the live `county_rail` table, and at least two
   disagree with the store itself.

## Evidence appendix

Commands and verbatim output are in `_inbox/2026-08-19_ss-w9_close.json`.

Published records, all measured by this lane:

- `_catalog/three_layer_audit_2026-08-19/three_layer_rollup.json` — per-rail rollup, ceilings, address ladder
- `_catalog/three_layer_audit_2026-08-19/cells.json` — all 3,556 cells, compact, with a legend for the repeated prose
- `_catalog/three_layer_audit_2026-08-19/written_by_family.json` — the WRITTEN scan, per family per county, with its `scannedAt`

The SERVED layer's fourteen-rail instrument is
`packages/retrieval/src/statewide-audit/rail-served.ts` with its detector-liveness and
negative-control tests beside it, driven by
`packages/retrieval/scripts/three-layer-sweep.mjs`. The superseded nine-field partial is kept
labelled at `P:/tmp/ss_w9_20260819/served_PARTIAL_9field_20260819T1554Z` and is deliberately
NOT merged into the widened output.

The frozen record extension is `_catalog/parcel_fact_sheet_contract/three-layer-audit.ts`,
copied byte-for-byte into the engine at `packages/retrieval/src/statewide-audit/types.ts`
with one edit, the import specifier. It extends `StatewideServingSweep` additively with a
single top-level `threeLayer` field, so lane SS-W7's `GET /api/serving-sweep` serves it
without a second shape. The full-prose statewide record regenerates with

```
node --import tsx packages/retrieval/scripts/three-layer-audit.mjs   --out artifacts/three-layer-audit --served-dir P:/tmp/ss_w9_20260819/served14   --written-from artifacts/three-layer-audit/written_by_family.json
```
