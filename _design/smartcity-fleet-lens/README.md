# SmartCity OS — Fleet lens

**Artifact:** not published. DRAFT of 2026-09-15, produced under OPS-17 G-145, lane
`g145c-fleet-lens`. Publication is the planner's call, not this lane's.
**Decision:** none yet. The ratifying decision belongs in `_decisions/` and should link back here.
**Status:** RATIFIED 2026-09-17, `_decisions/2026-09-17_design_ratification_all_approved.md`. Not dispatched; implementation row to allocate.
**Source:** `smartcity-dashboards` at `origin/main` `f776b4bf24114ed4061609d28c0429f84eb431b7`,
read through a read-only `git archive` of that commit: `src/domains.mjs`,
`src/domains/fleet-vehicles.mjs`, `src/domains/patrol-vehicles.mjs`, `src/fixture-seam.mjs`,
`src/adapters.mjs`, `src/city-pack.mjs`, `src/vendor-live.mjs`, `src/server.mjs`,
`src/staff-review.mjs`, `src/staff-identity.mjs`, `src/shell-homes.mjs`,
`src/lens-claims.test.mjs`, `web/index.html` and `web/app.js`.

The working checkout at `P:\smartcity-dashboards` sits at `e74e525`, which is NOT an ancestor of
`f776b4bf`, so it was not used as the read path. The fleet-relevant files are identical across the
two commits and that is recorded, but it is not what these boards were built from.

## Regenerate and check

    node gen.mjs
    node check.mjs

`source-state.json` is the OUTPUT of the product's own composer, its own live mapper and its own
record-shape guard, imported and run. It is not a transcription. Re-dump it rather than editing
it, then re-run `gen.mjs`. `gen.mjs` throws rather than renders if Fleet acquires a second
registered region, if the region moves, or if the two routes to the roster total stop agreeing.

`_kit.css` is a byte-identical copy of `_design/smartcity-dev-services/_kit.css`,
md5 `58a68730e051b1ee2ffa21f08eae6752`. No token was invented.

## What this lens is

One registered domain under `lensId` `fleet`: `fleet-vehicles`, region "Vehicle roster", gated by
`samsara`, record type `fleet-vehicle`. Granted on the demo pack, fourteen vehicles across four
opaque operator references.

Public works carries two regions. Fire and EMS carries one. Fleet carries one. Parks carries none.
The region strip is drawn at one rather than hidden, for the reason the Fire and EMS lens gives: a
strip that disappears at one entry makes "this lens has one region" indistinguishable from "this
lens has regions we are not showing you".

## Three things make this a different problem from its three neighbours

**It is the first lens in this wave whose vendor actually returns data.** The `src/vendor-live.mjs`
header records a live verification dated 2026-09-03: Samsara, Spireon and Power BI return real
data, FirstDue returns a specific 403 and GoTo is not authorised. Samsara has a live mapper and a
platform route, and `REAL_LIVE_DOMAINS` wires it. Public works, Parks and Fire and EMS were all
drawn at some distance from data, so their second board was about an obstacle. This one has no
obstacle, so its second board is about what the page still says once the feed lands.

**It is deliberately the simple exemplar and the domain says why.** Quoted from
`src/domains/fleet-vehicles.mjs`: *the reason this domain is one of the three exemplars is that it
is SIMPLE and its shape shares almost nothing with the permit queue: a flat roster, no place, no
due date, and one grouping dimension.* So there is no stage column, no due column, no age, no
assignment and no queue vocabulary anywhere on these boards. A design that dressed this as a work
queue would misrepresent the domain and waste the one lens that proves the seam generalises past
case-shaped records.

**A vehicle is not an asset, and this is the standing example.** Also from the domain: *G-24 stays
at zero, and fleet telemetry has been the standing example of the thing that looks like it should
fill an asset inventory and must not.* The Assets surface is excluded from design by ruling for
exactly this reason, so it is drawn here as a rule with four facts rather than as an apology,
following the shape `_design/smartcity-parks-lens/` established for saying what a surface is not.

## The design argument

**The grouping dimension cannot answer a condition question, so it is not asked one, and the
answer is deliberately different from Fire and EMS.** That lens drew its second axis as small
multiples because its domain stated that a rollup could not answer the station question. Fleet is
the opposite case. `operatorRef` is assigned by `1 + ((seq - 1) % OPERATOR_COUNT)` over a plan that
is already ordered by severity, so a cross tab of operator against condition reports the stride
rather than the fleet: OPR-01 and OPR-02 each carry two of four not in service, OPR-03 and OPR-04
each carry one of three, which tracks the 4/4/3/3 vehicle split exactly. A reader would draw a
finding out of a modulo. The cross tab is measured in `source-state.json` and it is NOT DRAWN,
because a refused thing drawn is still drawn and a reader takes the picture rather than the
caption. The dimension is drawn as coverage instead, which is the question it can answer.

**Fourteen of fourteen, and no pager.** The whole roster is on the page. A condition screen showing
the first ten of fourteen is worse than no roster, because the four a reader cannot see are exactly
the four somebody is looking for. That is a property of the fixture size, not a rule for every
pack: a real roster of two hundred needs a pager and an operator filter, and saying so is part of
the design rather than a gap in it.

**Two routes to the same number, shown agreeing.** The four condition tiles sum to fourteen and the
four operator rows sum to fourteen, by two different counting rules over the same records, and
`gen.mjs` throws if they ever stop agreeing.

**Six columns, not the shipped eight, and it is a proposal rather than a cut.** `web/index.html`
ships Vehicle, Unit, Status, Operator, Odometer, DVIR, Safety (7d) and Flags. `web/app.js` fills
the last three from `dvirUnresolvedDefects`, `safetyEvents7d` and `highMileage`/`lowFuel`, and every
one of those is produced by `mapRealFleetVehicleRecord` alone. On a generated pack all three render
blank on every row, through the renderer's null-is-blank path. Three blank columns on a city's own
screen read as missing data about that city's fleet. They are collapsed into one declared column
here, headed "Feed only", whose every cell reads "Not carried", and the basis names the three
shipped columns it stands for. A missing column is invisible; an unaccounted cell is countable.

**Nobody is named, and the dimension survives.** The record carries `operatorBasis`: *a generated
record names no person; the operator is an opaque reference and a granted feed is where a name
would come from.* The declared format is on the page in the panel head, said in words derived from
the product's own regex rather than printed as the literal, so the reference reads as a contract
rather than as a redaction.

## The boards

| Board | Pack | What it shows |
|---|---|---|
| `Main.dc.html` | `template-city` | the whole fourteen-vehicle roster, the four condition tiles plus operators and driver name, the operator dimension as coverage with its declared format, and the four-fact rule that a vehicle is not an asset |
| `Connected.dc.html` | `bastrop_tx` | the one vendor that answers, the three refusals that do not survive the cutover, the three sentinels on one record, and the shape guard that exists and is never called |

Two boards, not three. An unconnected-city board would redraw the sentence
`_design/smartcity-public-works-lens/Empty.dc.html` already draws, which is the reason Fire and EMS
cut its third, and a separate "what this is not" board would restate two basis lines `Main` already
carries under their own panels. Being connected argued for a second board its neighbours did not
need. It did not argue for a third.

## Findings, from comparing two sources rather than re-reading the canvas

**The Samsara mapper does fall back to a colliding sentinel, and it does it three times on one
record.** `recordId` falls to `"unknown-vehicle"`, `unitLabel` to `"Unnamed unit"` and `status` to
`"unknown"`. Every unidentifiable vehicle therefore gets the same record id, so they collide and a
check asking whether a record carries an id passes on all of them.

**The first version of this finding said Fleet was the only mapper doing that, and it was wrong.**
It was read off Fleet's mapper and assumed about the others. Running all five says otherwise: four
of the five live mappers are exported, and every one of them invents exactly three strings on an
empty row. Samsara and Spireon both fall to the literal `"Unnamed unit"`, so the collision crosses
lenses as well as rows. The measurement is in `source-state.json` under `live.peerTriples`, the
board quotes it, and the finding is systemic rather than local, which makes it a larger finding
than the one that was claimed. The previous lane reported only the `recordId` leg of it.

| Mapper | Invented on an empty row |
|---|---|
| `mapRealFleetVehicleRecord` | `unknown-vehicle`, `Unnamed unit`, `unknown` |
| `mapRealPatrolVehicleRecord` | `unknown-patrol`, `Unnamed unit`, `unknown` |
| `mapRealFireApparatusRecord` | `unknown-apparatus`, `Unnamed apparatus`, `unknown` |
| `mapRealCipProjectRecord` | `unknown-project`, `Untitled project`, `unknown` |
| `mapRealCallVolumeRecord` | not exported, so not measured |

**Three refusals do not survive the cutover, and two of them leave the page saying something
false.** `operatorRef`, `operatorBasis` and `inventoryBasis` are all generated-only. The live
composer returns `extras { realStatusCounts }` and nothing else, and `renderFleet` overwrites the
two basis sentences only when `extras.inventoryBasis` and `extras.operators[0]` exist. So on a
granted feed the Operators table renders zero rows under a page that still says *The operator
dimension has not been read for this pack*, about a region that was read, and the inventory
sentence says the same thing about a product rule that was never a reading. The live record's
`operator` field is a bare `null` with no basis at all, which is the absence-with-no-basis defect
this program hunts, wearing a sentence that says something else. The third row of that panel is the
control: the fixture mark correctly disappears, because not every difference at a cutover is a
defect and a panel where every row is a defect is one a refuse-everything rewrite would also pass.

**The record-shape guard exists, is correct, and is never called on the live path.**
`assertRecordShape` runs inside `composeDomain` over every generated record. Nothing in
`src/vendor-live.mjs` calls it. Run by hand against the mapper's own output it REFUSES, with three
faults: `status` carries a raw `engineState` value outside the declared enum, and `operatorRef` and
`odometerBand` are required by `RECORD_SHAPES.samsara` and absent. The live record also carries
twelve fields the shape does not declare.

One of the three faults is a declared position: the module header rules that real status is kept as
is and never force-mapped, so forcing it into the enum is exactly what the product refuses. The
other two are declared nowhere, and the shape table's own preamble claims the opposite, that
*generated fixtures and a granted adapter's real records are then the same shape, which is what
makes swapping a real city in a pack switch instead of a surface change.* The live record falsifies
that sentence.

**Among those twelve undeclared fields are `vin`, `make`, `model` and `odometerMiles`.** That is
the field set of an inventory, and it arrives on the same cutover that drops the one sentence
saying this is not one. The generated record carries `odometerBand`, a declared band, precisely
because a fixture odometer reading is a specific claim about a specific machine; the live record
carries the number. Drawn on the Connected board beside the guard.

**Fleet is ahead of its neighbours on the axis Fire and EMS had to state as a build rule.** That
board had to say that the metric row must take its bands from the payload. Here it already does:
`renderRegionMetrics` branches on `extras.realStatusCounts`, `renderRealStatusTiles` rebuilds the
strip one tile per real value with unknown cardinality, and `statusCell` renders an unmapped vendor
value quiet. This is the payoff of drawing a connected lens, and it is why a fourth copy of the
previous board would have been wrong: it would have restated as an unbuilt rule something the code
already does.

**Three Connections register rows call this lens Not built or Not connected while the region is
registered and the grant is live, and the product already knows.** `src/shell-homes.mjs` routes
"Fleet / operations" and "Fleet map / vehicles / drivers / safety" to Fleet with disposition
"Not built", and the Samsara feed row to Fleet with "Not connected", while `fleet-vehicles` is in
`DOMAIN_REGISTRY` and `PLATFORM_SAMSARA_FLEET_GRANT` is on `bastrop_tx`.
`src/lens-claims.test.mjs` records the reason its own divergence check does not catch this: the
check covers Development services only, because that lens's register rows are region-granular and
stand one to one with its domains, while *every other lens is named by LENS-granular rows that no
domain maps to without a ruling*, and *seven of them across Fleet, Police, Fire and EMS and Public
works look stale in the same way and are routed, not edited here.*

The disposition column is hand-declared and carries no pack field, so it cannot be right or wrong
per pack; it is a constant that has drifted. The alternative reading, that the register is scoped
to the demo pack where nothing is granted, was rejected because nothing in that module or its
render path takes a pack. This is not drawn on either board: it is a finding about the Connections
surface, and drawing it on the Fleet canvas would be designing another surface. The concrete
recommendation is in "Raised, not settled" below.

## The shared constraint, and what Police can and cannot share

The rule is identical on both lenses and the treatment on this board is shareable in full: draw the
opaque reference as a working dimension, put its declared format in the panel head in words, carry
`operatorBasis` verbatim as the panel basis, and never render a per-person condition breakdown.

**One thing is not shareable, and it is a finding rather than a divergence.**
`OPERATOR_REF_FORMAT` and `OPERATOR_BASIS` are declared identically and independently in
`src/domains/fleet-vehicles.mjs` and `src/domains/patrol-vehicles.mjs`. Both are `/^OPR-\d{2}$/`
and the basis strings are byte-identical. So Fleet and Police share one reference namespace, and
nothing in the product says whether OPR-01 on Fleet and OPR-01 on Police are the same person, a
different person, or a coincidence. Neither lens can answer that alone, so neither should assert it
on a page. This design asserts nothing about it and raises it below.

Police faces a stronger version of the same rule in plate reads, which `RECORD_SHAPES.verkada`
already refuses with a stated basis. Nothing on this lens contradicts that.

## The instrument

`check.mjs` self-tests in **both directions** before reading any artboard, aborts with exit 2
rather than reporting a verdict it cannot support, reports a matched-input count per predicate, and
refuses a verdict if any predicate matched nothing across every board.

    self-tests            71 of 71 passed, both directions
    matched inputs        pairs=3, recordTypes=2, regions=2, badges=34, chips=14, cells=108,
                          labels=35, numbers=123, vehicleIds=14, operatorRefs=22, vendors=4
    verbatim              11 of 11 distinct source sentences (12 required, one pair identical)

It refuses: a domain and gate pair the registry does not carry for this lens; an uncatalogued
vendor kind; a record type the registry does not carry here; a region name the product does not
carry; a status band the product does not declare, which is the check that catches a raw vendor
value passed through unmapped; a state word outside the shipped vocabulary; a person-shaped name in
any cell, which on this lens means a driver name; an operator reference that does not match the
declared format; an operator reference the composer never produced; operator coverage that drifts
from the composer's counts; a roster that is not the composer's fourteen in the composer's order,
all or nothing; a vehicle id outside the declared format; a money token; the word this product
never uses externally; and any of twelve source sentences going missing from the set of boards.

**Both known narrownesses in the existing checks are closed, and the closures are stated.**

Vendor names in prose were unchecked, so a basis sentence could name a vendor the structured
provenance foot contradicts. Here every vendor named anywhere on a board must be one the product's
own live-verification record names for this wave, computed as the lens gate plus
`vendorsAnswering` plus `vendorsDeclining`, and a curated list of uncatalogued fleet vendors is
refused by name. That second leg is needle shaped and its needles are named in the file.

The inventory-vocabulary rule is scoped by position rather than by word, because a blanket refusal
would refuse the product's own sentence saying this is NOT a city-owned inventory node. The needle
list has its exclusion set COMPUTED from the verbatim source sentences and printed on every run: at
`f776b4bf` it drops `inventory node` and `tier 1 node` and keeps sixteen. The structural half
applies to assertive positions only, which are column headers, matrix headers, tile keys and fact
labels: one of those may not say "asset", while a panel title and a basis sentence may, because
that is where a negation legitimately lives.

The Parks big-figure rule, scoped to `font:[45]00` at 20px and above, is not carried here and does
not apply: Fleet legitimately renders big figures on its condition tiles, and the rule exists to
catch built-surface vocabulary appearing on a lens that has no built surface.

Verified by violation on 2026-09-15, sixteen planted defects on the real artboards, all sixteen
caught, both artboards proved restored by md5 and `check.mjs` re-run to exit 0 afterwards:

| Violation | Result |
|---|---|
| a roster `OPR-01` cell becomes `R. Alvarado` | caught: cells name people |
| `OPR-02` becomes `OPR-2` | caught: operator reference outside the declared format |
| `OPR-04` becomes `OPR-07` | caught: operator references the composer never produced |
| `FIX-FL-1070` becomes `FIX-FL-9999` | caught: roster drift from the composer |
| column header `Feed only` becomes `Asset tag` | caught: a column header asserts an asset |
| region label `Vehicle roster` becomes `Asset inventory` | caught: region name the product does not carry |
| band chip `In shop` becomes `Idle` | caught: status band the product does not declare |
| an operator count `4` becomes `9` | caught: operator coverage drift |
| a basis clause becomes `straight line depreciation applies` | caught: inventory vocabulary this design wrote |
| `no city rows were read` becomes `no city rows were consulted` | caught: a source sentence no artboard quotes |
| `gatedBy samsara` becomes `gatedBy geotab` | caught: uncatalogued vendor kind |
| badge `Not read` becomes `Syncing` | caught: invented state word |
| prose names `Geotab` | caught: uncatalogued fleet vendor named |
| prose names `Esri` | caught: a vendor the product does not name for this wave |
| a fact gains `$4,200` | caught: money token reached a board |
| a fact gains `The digital twin` | caught: the word this product never uses externally |

## Rendered and looked at

Both boards, both themes, at 1600 by 1040 in headless Chrome, with `{{themeClass}}` substituted to
`sc-dark` and `sc-light` because a raw render silently takes the light branch for both. Four
screenshots, every one opened and read.

Rendering caught three defects that reading did not. The roster clipped its fourteenth row while
the basis directly beneath it claimed all fourteen were on the page, which is the exact shape the
previous lane hit. The right-hand column ran past the bottom edge and over the provenance foot on
both boards. And the Unit column ellipsised "Backhoe loader unit 17" after a column-width change,
which turns a vehicle a reader is looking for into an unreadable row.

## Conventions honoured

Nobody is named on either board. Fixture data is badged as fixture on the page and the record
carries the mark in its own payload. Absent, zero and unmeasured stay apart: the Connected board
renders every tile as Not read or Not carried rather than as a zero, because no live read was
performed by this design. There is no figure of money, and the one rendered code expression whose
template-literal syntax carried a currency symbol is shown as the equivalent concatenation, with
the rewrite declared on the board rather than done quietly. The word "twin" appears nowhere;
externally this is the record, the asset, current state.

## Raised, not settled

**Naming the vendor on a lens panel is a change.** The shipped panel chip says "Telemetry output
contract" and names no vendor; vendors are named on Connections. Both boards name Samsara, and the
Connected board names Spireon and Power BI in describing which feeds answer, because a member of
staff looking at their own page needs to know whose feed it is. Needs an operator ruling before
build, and it is the same question the Fire and EMS folder raised.

**The operator reference namespace is shared between Fleet and Police and nothing resolves it.**
Recommendation: namespace the reference by domain, so that a Fleet reference and a Police reference
cannot be read as the same operator by accident, and state on each lens that the reference is
scoped to its own register. The cheaper alternative, a sentence on each page saying the reference
carries no cross-lens identity, is weaker because it relies on a reader noticing. Either way this
is an operator ruling and a product change, not a design choice, and the two lenses must not answer
it differently.

**The three Connections register rows that name Fleet are stale and unchecked.**
`src/lens-claims.test.mjs` says the mapping needs a ruling rather than a guess, so here is the
mapping this design would propose, for the operator to accept or reject. "Fleet / operations" maps
to `fleet-vehicles` and its disposition should follow the registry. "Fleet map / vehicles / drivers
/ safety" is a bundle whose legs differ, which is exactly the shape G-93 split the auth row on:
vehicles is built, drivers is built as an opaque dimension, safety exists only on a granted feed,
and a fleet map is not built at all. It should be split rather than given one word. The Samsara
feed row is a grant question and `bastrop_tx` carries the grant.

**The two false sentences on a granted feed are a product defect, not a design choice.** The
recommendation is that the live composer carry an `operatorBasis` and an `inventoryBasis` of its
own, stating positively that the live mapper drops the driver name and that the record is still not
an inventory node, so that neither refusal disappears at the cutover and neither default sentence
survives to describe a region that was read.

## Carved out, deliberately

Assets is excluded from design by ruling and is not drawn here; this folder states the boundary and
stops. Police is a separate lane in this wave and is not drawn. The live status vocabulary is not
drawn, because it is unestablished. No live read was performed and no credential was used.

## Unestablished

**What Samsara returns today.** The only evidence in the repository is the reading recorded
2026-09-03 in the `src/vendor-live.mjs` header. It is drawn as a recorded reading badged with its
date and its source file, never as a current one.

**The cardinality and the labels of the real status set.** The recorded reading says Samsara
answers and records none of the values it returned, so the strip is drawn as a mechanism that
rebuilds itself from the payload rather than as a set of tiles with invented labels.

**Whether OPR-01 on Fleet and OPR-01 on Police are one person.** Nothing in the product answers it
and this design assumes neither way.

**Whether the twelve undeclared live fields are intended.** The module header declares the status
position and says nothing about the other eleven. Whether `vin` and `odometerMiles` are meant to
reach a record at all is a ruling nobody has made, and this design states the fact rather than the
intent.
