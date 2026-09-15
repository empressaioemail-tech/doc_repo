---
id: 2026-09-13_national_program_framework_WDLL
title: National program framework — the durable card (six layers, one dependency order)
date: 2026-09-13
status: draft — thought track, NOT canon, NOT ratified
kind: working-card
owner: nick
plan_rows_referenced: [P-176, P-181, P-182, P-136, P-141, P-162, G-17, G-23, G-111]
related:
  - _inbox/2026-09-13_assumption_register_ldt.md
  - _inbox/2026-09-13_assumption_register_engine.md
  - _inbox/2026-09-13_assumption_register_factory.md
  - _inbox/2026-09-13_tx_source_inventory_and_acquisition_process.md
  - _inbox/2026-09-13_national_scale_working_notes.md
  - _inbox/2026-09-13_national_scale_adversarial_review.md
  - _research/2026-09-12_cotality_reengagement_division_cogs_and_probe.md
  - 80_adrs/adr_032_third_party_source_rights_envelope.md
  - _catalog/tx_source_truth.json
  - _catalog/vendor_testset_ctx.json
---

# National program framework — the durable card

> **NOT CANON. NOT RATIFIED. NOTHING DISPATCHES FROM THIS PAGE.**
> This is the coherent thought track assembled from the 2026-09-12/13 conversation, written
> so a planning agent can merge it with the lanes already in flight. Every figure is either
> traced to a named artifact or marked unmeasured. The operator has deliberately not ruled
> on any of it.

## The thesis, in one paragraph

Nine workstreams were being discussed as if they were a list. They are not a list, they are
a **stack with a strict dependency order**, and the reason the national question kept
producing bad answers is that the bottom layer was invisible. Throughput is already solved
and measured: `OPS-14` records that the wave machinery acquired **177 counties in two days**.
What is not solved is knowing whether what landed is complete or correct, and the P-181
registers found **seven controls that cannot fail**. Until those can fail, every number the
system reports about a county is unfalsifiable, including the ones quoted throughout this
week's analysis. Everything else in this program sits on top of that.

## The stack

```
  L5  SERVE          rails v3 · serving sequence · tiering · available-on-request
       ^                        gated by L4 (what vendors bring) + OPS-23 reader
       |
  L4  BUY            Cotality (P-176 bake-off -> division -> metering)
       ^             ICC (adoption table -> metering)
       |             ONE meter, TWO accrual triggers  [the cross-cutting seam]
       |                        gated by G-17
       |
  L3  FABRIC         federal tier national · statewide tile bake · geometry
       ^             NO DEPENDENCIES. Can start today. The only layer that can.
       |
  L2  INGEST RIGHT   pre-bake audit (will it break) + completeness audit (did we get it all)
       ^                        gated by L0 — a completeness check that cannot fail is noise
       |
  L1  KNOW           source inventory (DONE) · sub-county coverage (P-182, running)
       ^             assumption registers (P-181, DONE, 94 rows)
       |
  L0  TRUST          arm the seven controls that cannot fire
                     GATES EVERYTHING ABOVE. Nothing measured is trustworthy until this lands.
```

---

## L0 — Trust the instruments

**The finding.** Across three repos, seven controls run, report success, and are structurally
incapable of failing. Each is verified at a declared SHA.

| Control | Repo | Why it cannot fail |
|---|---|---|
| `evaluateRailGate` | factory | returns `ok:true` on **zero** earned cells — an empty county passes 65/65 |
| `evaluatePopulation` | factory | falls through all three refusals on `EMPTY_DENOMINATOR` |
| `pin-divergence.test.mjs` | factory | asserts a sha256 is 64 characters long |
| `assertEdgesNotStarved` | engine | compares a computation against itself |
| `resolveZoningJurisdiction` | LDT | two consecutive branches return the same expression |
| `facetCoverage.baseFacts` | LDT | uses the join key as evidence the join worked |
| `computeTier1Envelope` | LDT | both return branches are `declined` (known since 2026-09-10) |

Verbatim, `publish-gate.js:74-83`:

```js
const live = cells.some((c) => isEarnedCell(c.state));
if (!live) {
    return { ok: true, unaccountedCount: 0, excludedDeclaredAhead: [railKey] };
}
```

The control inverts: **partial absence refuses, total absence passes.** The more broken a
county is, the cleaner its verdict.

**Adjacent, same layer.** Three engine rails cannot write at all. `write-owner-fact-county.mjs`,
`write-land-use-fact-county.mjs` and `write-flood-hazard-fact-county.mjs` carry **zero**
mentions of "lease" and call `writePropertyAtomsBatch(slice)`, which throws `LeaseRequiredError`
without one. They plan, contract-validate, print a dry run that predicts the apply, and throw
on the first batch. Owner, land use and flood hazard.

And three factory failure modes write `absent-verified` — an *earned* kind meaning "we looked
and there is nothing" — when no corpus table exists, when a district matcher misses, and when
geometry is absent. `parcelAreaSqFt` is the clearest violation: land cannot have an absent area.

**Why this is the gate.** ENFORCEMENT already says a control that cannot fire is worse than
absent, because absent is visible. Seven of them are armed and green. Arming them is small,
concrete work, and it is cheaper than any new checker.

**Owed:** a ranked list of the seven with a one-line fix each. Not yet written.

---

## L1 — Know what exists

**Done.** The Texas source picture, aggregated from 254 probe artifacts that had sat
unaggregated since 2026-08-05, joined with 165 `L2_WAVE*` geometry-ingest runs.
Instruments `scripts/tx-cad-source-inventory.mjs` and `scripts/tx-source-truth.mjs`, both
self-testing with not-vacuous cases; output `_catalog/tx_source_truth.json`.

```
CAD source              geometry at source          geometry ingest run
  176 rest-reachable      195 stratmap-available       162 pass
   19 rest-unproven        58 unknown                   89 NEVER RUN
   58 rest-absent           1 stratmap-absent            3 fail
    1 unmeasured-network                            (48213, 48291, 48499)

182 of 195 endpoints are services*.arcgis.com  ->  ONE adapter covers 93%
9,198,711 parcels countable at source
47 counties CAD-absent BUT geometry-available
 8 counties flagged prop_id_bad_rate >= 0.25
```

**Done.** Three assumption registers, 94 rows, P-181, at declared SHAs
(LDT `31d181c2`, engine `112bccb8`, factory `97b93877`).

**Running.** P-182, the sub-county coverage audit, opened because of Thrall.

### Thrall, the worked example that opened L1's real gap

`202 ELECTRA ST, THRALL, TX 76578`, Williamson County, APN `R007189`. An incorporated city
inside an onboarded county. The live brief refuses on four rails and each refusal names a
different defect the registers found by reading code:

- "the county's parcel id does not match the appraisal record" — the raw `place_key` versus
  normalized `parcelNodeId` identity seam, Williamson R-prefix
- "No `cad_property` row at declared vintage for 48491:R007189" — `DECLARED_CAD_VINTAGES`
  covers 15 of 254 counties and refuses loudly for the rest, as designed
- "inside Thrall limits; **no zoning layer on file for Thrall**" — a city coverage hole
  inside a county we consider onboarded

**The surface is not defective. It is refusing honestly and naming why.** What Thrall proves
is that **the county was the wrong unit of work.** OPS-22 already recorded 69 cities across
the six counties with only 23 carrying a zoning endpoint, and nobody had turned that into a
gap list.

---

## L2 — Ingest right: two different audits, often confused

These answer different questions and both are needed. Harris proves it: a pre-bake probe
would have caught the multi-shapefile archive; only an independent count could have caught
that the load came in short.

**PRE-BAKE — "will it break?"** An assumption register row per belief the code holds about
its input, each carrying a probe that tests the source *before* a row is written. Of ten
known assumptions, **seven fail silently** and only the Texas bbox assertion fails loud —
the controls we have are on the assumption that was already safe. Four are now fixed and
fail closed (`shapefile-discover.ts`, `assertTexasWgs84Bbox`, `isNullPlaceholderFeature`,
`assertDeclineCeiling`), which is why this must be built from code rather than from defect
history.

**COMPLETENESS — "did we get it all?"** The governing rule, from the Harris report: dry,
apply, apply2 and SQL **all agreed at 564,948 because all four read the same truncated
input**, and the sizing estimate carried the identical bug. A check whose input derives from
the same upstream as the thing it checks cannot detect truncation. What worked was an
independent derivation: reading the ZIP central directory.

The same shape is live in three more places. `RECORD_FILL_SHORT` compares `parcel_record`
against `landing_parcel_jurisdiction`, which is the fill's own input *and* its own reported
denominator. `writePropertyAtomsBatch` returns the pre-dedupe array while inserting the
post-dedupe one, so write-then-verify passes on both sides — **a clean `N/N verified` figure
is consistent with any number of silent collapses, Harris's included.** And one DBF file is
read twice in LDT: the geometry pass has three skip ceilings, the land-use pass over the same
file has none, failing only on `rowsParsed === 0`.

**The rule to carry forward:** at least two independently derived counts per county, agreeing
within a declared bound, or the county does not publish.

---

## L3 — The fabric: the only layer with no dependencies

Jurisdiction-free layers. One pass, same adapters, identical in all 50 states. No per-county
work, no relationship, no licence, no ruling needed.

```
  terrain / topography      USGS 3DEP
  flood                     FEMA NFHL
  roads                     Census TIGER
  boundaries                Census TIGER
  building footprints       Overture / Microsoft
  soils                     USDA NRCS
  pipelines                 PHMSA NPMS
  parcel geometry (TX)      TxGIO StratMap, 253/254 source-available
```

**The operator's addition, 2026-09-13, and it belongs here:** the statewide work already done
for Texas — baking all the tiles, loading geometry — is the same motion at national scale.
It was treated as a Texas project; it is actually the first instance of the L3 pattern, and
the national version is that same job with a bigger extent rather than a new design.

**What this buys.** Every parcel in America carries terrain, flood, roads, footprints and
boundaries, plus downloadable shapefiles, with or without an appraisal district. That is a
real product on day one everywhere, and it is what a CAD-absent county gets instead of
nothing.

**The known cost shape is volume, not complexity** — national 3DEP at full resolution is a
tiling and storage problem with a known answer. **No dollar figure appears here on purpose**
(see "What this card refuses to estimate").

**Owed:** nothing blocking. This is the piece that can start immediately and it has never
been carded.

---

## L4 — Buy what we cannot manufacture

### The division, restated

**Cotality sells facts about a parcel. We manufacture the rules that apply to it. Nobody
sells the rules.** Across the 65 rails: roughly 20 buy, 29 make, 11 already own free, 3
unresolved, 2 split.

### Cotality — state

REST products dead (`InvalidClientIdentifier`). The **MCP eval channel is live** and had
never been probed until 2026-09-12: `litellm-mcp-server` v1.0.0, 11 scope-gated tools.
`pd-get_property_characteristics` returns **84 leaf fields in one call**, including three
rails we cannot source at any effort (`landUseCodeDescription`, `standardSubdivisionCode`,
and roof/foundation/construction type). The `pr-` trend tools are **geography-keyed, not
parcel-keyed**, up to 25 geographies per call, which makes market and rent context a fixed
periodic cost rather than a per-parcel one. **The money rails are not on the live channel.**

**P-176 is compiled and never dispatched.** Sixty parcels, ten per county across the six,
five in-city and five unincorporated, at `_catalog/vendor_testset_ctx.json`, with three
pre-registered falsifiers including one that says zero disagreements means the instrument is
wrong. Eval agreement permits internal evaluation only; outputs may not reach end users.

### ICC — state

The binding is a **declaration and refuses to be a derivation**. `plan-review/sql/005`:
"Nothing derives it from jurisdiction, that guess is exactly what item 8 replaces with a
declaration," and `buildCitation()` throws without `editionId`, `bookId` and `sectionNumber`.

**The adoption table is the unbuilt asset.** Jurisdiction to code family to edition to
effective date. ICC sells the code text; the binding that says *which edition governs this
parcel* is manufactured per jurisdiction from primary sources. It is to ICC exactly what the
ruled setback tables are to zoning, and without it ICC content is a library rather than an
answer. **Never carded.**

ICC content is live in the substrate: tenant `icc-model-code`, 4,966 atoms, anonymous callers
correctly refused.

### The cross-cutting seam: one meter, two accrual triggers

This is the piece that unifies L4 and it is the least obvious thing on this page.

```
  ICC       accrues ON REFERENCE     a cache hit still owes a royalty
                                     -> the meter must sit on the READ path
                                     -> free-tier viewers included

  Cotality  accrues ON ACQUISITION   we pay for the fetch; every later serve is free
                                     -> the meter must sit on the FETCH path
                                     -> this is the entire compounding-margin case
```

A meter fixed to the read path charges us for Cotality cache hits that cost nothing. A meter
fixed to the fetch path silently under-reports the ICC obligation on every cached read, which
is an unmetered source liability. **One meter placement cannot serve both**, so the trigger
has to be a declared property of the source. This is `accrualTrigger` in ADR-032.

**The machinery already exists and is ICC-shaped.** `source_obligation_ledger` (migration
009), `source-obligation-meter.ts`, `source-obligation-reader.ts`, accruing on every read
including free anonymous, with two behaviours worth keeping as law: an unset rate produces a
countable accrual with a null amount and `pending-rate` grace terms rather than a zero, and a
null adapter stamp reads as *unmeasured* rather than "not ICC."

**What blocks a second source riding it: G-17.** Detection today is an allowlist and regex
heuristic; the fix is a hard reference carrying `sourceActorDid` plus the source's own
identifiers. **G-17 is now load-bearing for two sources rather than one, which raises its
priority.** G-23 (rates null everywhere) and G-111 (substrate reader) sit alongside it.

**ADR-032 is proposed, not accepted**, and four of its fields have no value until the Cotality
commercial agreement is read: `retention`, `reproduction`, `redisplay`, `rate.unit`. Those four
decide whether the cache-and-compound model is lawful and whether COGS is per-call or per-field.
`accessPolicyFloor` is the field not to skip, because `accessPolicy` gates a whole atom and the
MCP catalog tools return bodies whole with no field strip.

---

## L5 — Serve it

### Rails v3

The grid is 65 rails; one Cotality call returns 84 fields. Today we cannot represent most of
what a vendor sells, and worse, **we cannot see that we cannot**, which is precisely the
defect the 2026-09-01 ruling names: a missing column is invisible, an unaccounted cell is
countable. The precedent is our own — v1 to v2 went 52 to 65 on exactly this reasoning, and
`RAILS_V2_DECLARED_AHEAD` holds 13 rails deliberately empty.

**The shape**, with one correction already made: a rail for every field we intend to **serve
as an answer**, and a companion rail carrying a **declared field manifest** for the backing
detail — because a companion without a manifest reintroduces the invisible-column defect one
level down. Grain matters: the staging ledger is **county-grain** (254 x 65 ≈ 16,500 rows),
not parcel-grain (≈700M cells for data we do not hold).

**Two hard constraints.** Atom families split by **tier**, not by source, because `accessPolicy`
gates a whole atom and the catalog tools return bodies whole. And source must be a first-class
property so vendor-restricted fields are withheld by policy rather than by every consumer
remembering to strip.

**Sequencing hazard:** rails v3 collides with OPS-21 D5 (P-136), which was moving the gate
denominator from 17 to 65. The factory lane reports D5 has landed and the 17 survive as a
fail-closed `PUBLISH_FLOOR_RAIL_KEYS` — verify before planning against either number.

### The serving sequence

One correction to the operator's original framing, and it matters: **mint synchronously
because it is cheap, derive asynchronously because it is expensive.** The vendor call is
hundreds of milliseconds to seconds; the atom mint is a database transaction. Deferring the
mint saves nothing and creates a divergence class the 2026-09-11 ruling forbids, since one
writer must mint atom, pointer and rendering in one transaction.

```
  0  instant, no network   serve everything held: manufactured rails, free federal
                           layers, geometry. Every rail carries a STATE.
  1  entitlement           does this plan permit this rail
  2  METER GATE            per-account call budget that REFUSES, not warns.
                           37 calls x a scraper x 10,000 hits is a $55k month.
  3  fetch                 composites only, parallel, inside the 55s client abort
  4  mint, synchronous     atom + pointer + rendering + meter, one transaction
  5  serve FROM the atom   user's answer and stored answer are the same object
  6  async                 cells, edges, ledger accounting, dependent re-bakes
```

Second request never reaches step 3. **For ICC the same six phases run in `point-and-fetch`
mode:** the reasoning atom carries the citation, the licensed text is fetched and rendered
behind the gate and never stored, which is the only mode that satisfies a
destroy-on-termination obligation.

### The upgrade prompt already exists as a machine state

`available-on-request` was ruled the sixth cell state on 2026-09-10 and requires a **named,
reachable** `requestPath`; an unreachable path is not this state. A vendor-backed rail on an
unfetched parcel is exactly that. So "there is more information here" is a cell state with a
request path behind it, not a marketing banner — and no rail can advertise depth until the
fetch path behind it is live. P-141 is that row and it is in flight.

### The free-tier inversion, unfixed

Zoning and setbacks exist in about ten Texas jurisdictions while purchased depth would cover
254 counties on day one, so a user in an uncovered place gets an outline and an upgrade prompt
before receiving any value. **The fix costs nothing:** widen the free tier to everything held
free statewide — FEMA flood zone, city limits, ETJ, school district, special districts, wells,
pipelines, roads, terrain — and let zoning and setbacks be the *premium-free* layer where
manufactured. Thrall is this problem with a face on it.

---

## Sequencing

```
  CAN START NOW, no dependency, never carded
    L3 federal tier national + statewide tile/geometry as the national pattern
    L0 arm the seven dead controls
    L4 P-176 Cotality bake-off (compiled, uses the live eval channel, no contract needed)

  RUNNING
    P-181 assumption registers (DONE, 94 rows)
    P-182 sub-county coverage audit

  GATED, and on what
    L2 completeness audit          <- L0 (a check that cannot fail is noise)
    L4 Cotality metering            <- G-17 hard reference + the commercial agreement
    L4 ICC metering                 <- G-17 + the ICC SaaS demo (a bizops step, not a build)
    L4 ICC usefulness               <- the adoption table, unbuilt and uncarded
    L5 rails v3                     <- L4 (what vendors actually bring) + OPS-21 D5 state
    L5 serving sequence             <- the OPS-23 reader, mid-flight

  NOTED FOR LATER, not opened
    Bell 48027 + Milam 48331, with their cities, are the first two counties through the
    revised pipeline once it is shaped. Chosen because they connect geographically to the
    existing six. Bell is already known: 165,574 parcels, certified 20/20 on 2026-08-05,
    and the county whose cost gate was cleared by recalibration (see below).
```

---

## What this card refuses to estimate

Operator ruling 2026-09-13: stop cost-estimating, because any figure we can produce is
inaccurate anyway. Honoured here deliberately, and the reason is specific rather than
philosophical.

The previous draft's economics rested on "$0.24 to $5 per county," which an adversarial review
traced to a setback-depth promotion pass over roughly 5,769 parcels against a 74,729-parcel
county universe — one rail of 65, excluding acquisition — in a document marked
`status: superseded` where it appears as a parenthetical recall rather than a measurement.

Worse, and this is a governance item rather than an estimation one:
`onboarding_defect_class_backlog.md` records **BELL-COST-GATE-BREACH** declining at $333.34
against commitment #3's $200 hard kill, then "CLEARED 2026-08-05 — engine #250 recalibrated
cost model ... **removed stale `$2/1k-calls` term** ... $1.15 PASS." The hard kill was
satisfied by retuning the instrument, and the deleted term is the one a national acquisition
consists of. **That needs the operator's own look and is not part of any row opened here.**

---

## Handoff note for the next planning agent

Read in this order: this card, then the three P-181 registers, then
`_inbox/2026-09-13_tx_source_inventory_and_acquisition_process.md`, then
`_research/2026-09-12_cotality_reengagement_division_cogs_and_probe.md`, then ADR-032.

Then read `_inbox/2026-09-13_national_scale_working_notes.md` **together with its adversarial
review**, and read them as a pair. The notes are wrong in seven confirmed ways and were left
wrong on purpose, because the pair is the more honest record of how the reasoning moved. Do
not plan from the notes alone.

Three rules that will save you the mistakes this session made:

1. **Build from code at a declared SHA, never from defect history.** Four of ten known
   assumptions were already fixed and failing closed. Planning against the historical list
   would have re-fixed solved problems and missed what is open.
2. **`TX-LANDING-ABSENT` means not ingested, never no source.** A 217 figure was misread
   that way once already and it inverted an entire plan.
3. **A single field can lie about a whole county.** Harris classified "absent at source"
   from `service_url: null` while the same artifact carried DNS failures from the probe
   network and untested repackages — and Harris in fact holds 1,523,640 parcel-node atoms.

And one structural note: `P:\hauska-factory` is a stale clone at "Initial commit" and all
three local product checkouts lag `origin/main`. Read `git show origin/main:<path>` and
declare the SHA. Dispatches are compiled through `scripts/dispatch.mjs`, never hand-assembled;
the canon gate refused three attempts in this session and was right every time.

## What is NOT decided

Whether to contract with Cotality. Whether ADR-032 is accepted. Whether rails v3 proceeds and
at what grain. Whether the federal tier is funded. What happens when a vendor value and a
first-party value disagree (the pattern to copy is
`_decisions/2026-09-11_setback_source_most_current_wins.md`). Whether vendor values may enter
the calibration loop, which the 2026-07-13 constraint currently forbids for value and rent.
Whether the county or the place is the unit of onboarding — Thrall raises it, P-182 will
inform it, nobody has ruled.
