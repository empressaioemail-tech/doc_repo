---
id: 2026-08-30_ctx_w3_collect_amendments
title: Refined CTX W3 collect plan — corrected owe table, city scope, automation sequence
date: 2026-08-30
status: filed
plan_row: F-01, F-09, F-11, F-18, P-09, P-11, P-85
reviewer: doc_repo planner (review seat)
parent: _inbox/2026-08-30_ctx_w3_collect_WDLL.md
companion: _inbox/2026-08-30_ctx_w3_collect_review.md
---

# 1. Verdict

**Do not approve as written. Do not apply 0005. Do not run `landing-import`.**

The collect-then-atomize spine is right and should survive. What fails is that the
card is a **specification presented as a schedule**: it assigns lanes over jobs that
do not exist, gates that cannot fail, and a copy that nothing reads. Three of its
named actions damage state if run.

Snapshot: doc_repo `main` `7841fe2`. Product repos read by ref — hauska-factory
`origin/main` `7f41f52`, hauska-engine `2c90b99`, LDT `d8dfb319`. The property
worktree is `seat/property-ctx-walk-alias-schema` `866c38b`, **3 commits ahead and
unmerged**; the band-0 handback saying "uncommitted diff, no commit" is stale.
Counts below name their database and ran read-only under a named `statement_timeout`.

## Three actions that damage state

1. **Applying 0005 destroys real setback data.** `austin-tx.json`, `kyle-tx.json`,
   `georgetown-tx.json`, `round-rock-tx.json` exist, are registered in
   `SETBACK_TABLES`, carry feet with citations (Georgetown `human-verified` 0.95),
   and were audited 2026-07-23. 0005 seeds those four as `kind='absence'`. Austin
   alone already has **150,702 `setback-rule` atoms** in the store. This inverts
   fail-closed: the rule against inventing feet exists, and this invents their
   *absence*. It also persists the two guessed Round Rock / Cedar Park URLs as
   facts, with no `probed_at` column.

2. **Re-running `landing-import` bricks the lane permanently.** Landing tables carry
   `BEFORE UPDATE OR DELETE → LANDING_IMMUTABLE` triggers, and the job counts the
   whole landing table rather than its own delta, so a second run yields 2x and
   fails forever. The card's instruction to "re-run the import job and file the
   two-count" is the one action that cannot be undone. It also takes no county
   argument.

3. **`factory-conformant` (the F-18 job) defaults `county` to 48021** instead of
   refusing. With the standing Cloud Run `--name=value` argument trap, a flood run
   aimed at another county silently re-runs Bastrop and reports success.

---

# 2. The owe table is over-scoped about 6x

The operator's challenge was correct. Boundaries and setbacks are **city facts**,
and the inventory states them against county denominators.

The mold settles the structure. Line 36: "Zoning | THE CITY source — per
incorporated city. **NOT county GIS (counties don't zone unincorporated land)**."
Gate 4: "setbacks from the jurisdiction's authoritative per-parcel dimensional
record (public GIS), **parcel→district from the LIVE zoning layer**." So the chain
is edges ← setback-rule ← zoning district ← city layer ← **incorporated city**.
Envelope inherits the same scoping. A county-wide setback or edge owe is a category
error, not a coverage gap.

## Incorporated share, measured

DB `neondb`, TxGIO city polygons, **distinct `prop_id`**:

| County | FIPS | In-city | Parcels | In-city % |
|---|---|---|---|---|
| Bastrop | 48021 | 12,318 | 62,257 | 19.8% |
| Caldwell | 48055 | 10,310 | 24,989 | 41.3% |
| Hays | 48209 | 55,943 | 116,421 | 48.1% |
| McLennan | 48309 | 83,075 | 114,255 | 72.7% |
| Travis | 48453 | 280,682 | 380,918 | 73.7% |
| Williamson | 48491 | 181,813 | 282,570 | 64.3% |
| **Six** | | **624,141** | **981,410** | **63.6%** |

**357,269 parcels (36.4%) can never hold a setback record.** In Bastrop that is
80.2% of the county. Caldwell is a bbox-centre approximation because 48055 carries
no parcel geometry — flag it, do not launder it.

Note the Bastrop figure is 19.8% incorporated against the mold's 9.27% *zoned*.
Those are different measures and both are right: incorporated ⊇ zoned. Do not
substitute one for the other.

## Edges are empirically a city fact

Bastrop: 26,846 edges on 3,732 parcels (2,487 `descriptor-fixture`, 1,671
depth-warm, 426 both) — the prior measurement reproduced exactly. **All five other
counties: 0.**

**3,719 of 3,732 edge parcels (99.65%) sit inside a city. 3,734 of the 3,747
refused parcels (99.65%) do too.** The depth-warm universe was already correctly
city-scoped. The apparent 74,067-parcel Bastrop gap is not owed work.

## The honest owe

| Measure | Parcels |
|---|---|
| Ceiling if every city had a table | 624,141 |
| Ceiling under the current setback gate | 158,573 |
| **Edges actually owed** | **~154,841 (15.8%)** |
| Absence rows, not work | **826,569** |

**Hays, McLennan and Williamson owe zero edge work** until a city setback table
lands for them.

## Rails the inventory mis-states

| Inventory claim | Measured | Effect |
|---|---|---|
| Wells: "Bastrop 0", apply the six | Caldwell already has **53,841 `well-fact`** (2026-08-16) | Apply is five counties |
| Footprint: "Bastrop 0" | Caldwell already has **35,269 `building-footprint`** | Apply is five counties |
| "Flood on the five", 48021 has 62,254 derivations | **`flood-hazard-fact` applied on all six, 981,620 atoms**; 48021 has 4 selectors | Not a coverage owe — an F-18 *shape conversion* |
| "McLennan gold unstamped is real" | McLennan **stamped on 48,441 parcels** | Row is wrong |
| "18,100 CAD with no conformant snapshot" | 18,100 is a CTX-cohort figure; the six-county number is **534,700** | Denominator mixing |
| "Zero-FIPS gets coverage-absence and stops" | No FIPS has zero wells (2,548 / 10,654 / 24 / 458 / 801 / 1,162) | Dead branch |
| C-count lane is owed | Factory `import_ledger` shows L2 collect **already ran 2026-08-26/27**, nine clean two-counts | Lane already done |
| Bastrop 15,542 `no-row` | **CONFIRMED exactly** | Stands |

## Two new defects

- **McLennan has 65,814 envelopes derived from 0 setback rules.** An envelope with
  no rule beneath it is a computed value with no input — the exact class ENFORCEMENT
  forbids. Scrub before Wave R.
- **188,103 of 346,676 `setback-rule` atoms cite `storage-port-proof/phase-1a`** —
  the placeholder cohort. **Hays (34,454) and Williamson (124,499) are 100%
  placeholder.** Real sources are Bastrop 7,534 (2,315 layer-23 per-parcel),
  Lockhart 337, Austin 150,702; McLennan zero. Placeholder setbacks are serving as
  if real.
- Travis `parcel-node` is 804,457 against 380,918 parcels (2.1x). Write path is not
  read; flagged, not diagnosed.

---

# 3. Cities

The plan is city-scoped in language and county-scoped everywhere else. The blocker
that would have prevented city scoping is **gone**: the city-to-county join landed
2026-08-11T19:44Z, `_catalog/texas_roster_v1.json` links 1,214 of 1,223, Factory
`city_manifest` carries it, and the join re-derives independently in 1.3 s
(zone-major, `MATERIALIZED` bbox CTE). One query, no ingest.

**The six counties contain 72 cities touching, 69 primary. The plan names 9 and
0005 seeds 8.**

| County | FIPS | Touches | Primary |
|---|---|---|---|
| Bastrop | 48021 | 5 | 3 |
| Caldwell | 48055 | 8 | 3 |
| Hays | 48209 | 13 | 11 |
| McLennan | 48309 | 21 | 20 |
| Travis | 48453 | 24 | 18 |
| Williamson | 48491 | 17 | 14 |
| **Union** | | **72** | **69** |

The selection is inverted against what we hold: the card names **Cedar Park (272
staged zoning districts)** and omits **Leander (27,397)** and **Taylor (8,145)**.
Waco is in McLennan and therefore in scope. Twenty-four cities straddle; Golinda,
Staples and Thorndale hold territory in the six but key to a primary county
outside — that is the 72-vs-69 gap.

Acceptance item 4's check ("registry count equals city roster") is computable but
**ungradeable as written**: it resolves to 69, 72 or 1,223 with no defect anywhere.
It must write the number. **It should be 72.**

## Three prerequisites for per-city automation

1. **`city_manifest.payload` dropped `all_county_fips`** — the store-side roster is
   straddle-blind, so a county-scoped job double-counts or misses the 24.
2. **The roster join uses bare `ST_Intersects` with no area threshold** — a
   7.6e-10 deg² sliver makes Coupland a phantom Travis city. Add a minimum overlap.
3. **Six identifier key forms.** Beyond `city_key` (`round-rock-tx`) and
   `jurisdiction_tenant` (`round_rock_tx`), property atoms key on
   `breadth_<fips>_<free text>` from unnormalised CAD situs: **seven spellings of
   Bastrop**, six of Smithville, five of Cedar Creek, four of Luling, plus zip
   codes, road fragments, `houses_only`, `unknown`, and eight cities not in Bastrop
   County. Canonical is `place_fips`. The `breadth_*` alias table must be
   hand-seeded and is the **only genuinely expensive prerequisite** in the program.

## Setbacks: land, do not probe

The two reviews appeared to disagree and do not. Setback tables exist as
**committed code artifacts** (`SETBACK_TABLES`, four cities with cited feet) and
have **never reached a store or a rail** — `city_rail` reports `setbacks = not-yet`
on 1,223 of 1,223, and `landing_setback_*` is absent from all three databases.

So the setback work is a **landing job, not a probe or a fetch**. 0005 is wrong
twice: it overwrites sourced data, and it mistakes not-landed for not-sourced.

---

# 4. Why nothing can run today

| Component | State |
|---|---|
| `atoms-writer-job.mjs:46` | Hardcodes `"scripts/write-cad-parcel-roll-county.mjs"`; Cloud Run cannot override `command`, so no execution reaches another writer |
| well-fact / footprint / flood writers | pnpm scripts only, no job |
| F-11 setback-rule writer | **Does not exist in any form** |
| Easement writer | Exists, but `write-utility-easement-county.mjs:191` **live-fetches ArcGIS** — the shape the card's own Do-not list forbids |
| `factory-landing-import` | **No job** (zero yaml hits) |
| GIS "fetch jobs" | Parsers only; zero `fetch(` in either file |
| `import_ledger` | Exists, genuine two-count, **zero SELECTs** |
| `collect_close` / `rail_absence` | **Zero hits in any repo** |
| `_inbox/` gate file | Dockerfile copies only `src` + `migrations` — **no job can read it** |
| `refuseHeldCell` | Four call sites: definition, a proof job, two tests |
| Gate field 4 (vintage) | `landing-import.mjs:28-35` returns `"unknown"` for every table, always — vacuous by construction |
| `0001_init.sql` | **Zero indexes**; every per-FIPS count is a seq scan on jsonb |
| 0005 target | `FACTORY_DATABASE_URL` only; `alias-persist --apply` writes to `NEONDB_URL` → **starved**, first insert errors |

Two rails in the inventory — **zoning stamps and roads** — appear zero times in the
collect card or the waves file. Roads measure 0 on Travis and Williamson.

---

# 5. Amendments required before go

**A1. Do not apply 0005 as drafted.** Split it. Drop the four false absence seeds
(Austin, Kyle, Georgetown, Round Rock). Add a `probed_at` column and a NOT NULL
constraint on absence rows so an unprobed absence cannot be written. Re-target the
alias DDL at the bake `neondb` or the alias path stays starved.

**A2. Scope every rail to `place_fips`, not county.** Setbacks, edges and envelope
get an explicit `unincorporated → not-applicable` absence row mirroring the one
zoning already has.

**CORRECTED 2026-08-30 — this amendment's first draft conflated two populations and
the operating cards inherited the error. 826,569 is the non-edge remainder, NOT the
unincorporated count. It splits three ways and the three states are different:**

| Population | Parcels | Correct state |
|---|---|---|
| Unincorporated — no city zones it | **357,269** | `not-applicable` (structural) |
| In-city, no setback table landed yet | **465,568** | `unmeasured` until the city is probed, then `absent-verified` |
| In-city, already warmed | 3,732 | `value` |
| **Non-edge remainder** | **826,569** | — |

Stamping `not-applicable` on all 826,569 fabricates a structural claim ("cannot
exist here") on **469,300 in-city parcels where a setback can exist and simply has
not been sourced.** That is the same defect class A1 was raised against — an
unearned absence — and it is on the declared critical path at P3. Only the 357,269
are `not-applicable`.

**A3. Write the city number.** Item 4's check becomes "registry row count equals 72
territory-touching places in the six, enumerated from `texas_roster_v1` with an
area threshold." Name the 72. Restore `all_county_fips` to `city_manifest.payload`.

**A4. Correct the owe table** to the measured rows in §2. Wells and footprint are a
**five**-county apply. Flood is a shape conversion, not a coverage owe. McLennan is
stamped. Drop the dead zero-FIPS branch. Mark C-count **already complete** from the
2026-08-26/27 `import_ledger` rows rather than scheduling it.

**A5. Setbacks are a landing job.** Replace "probe then fetch" with "land the four
existing `SETBACK_TABLES` artifacts, then probe only the cities with no artifact."

**A6. Do not re-run `landing-import`** until it is county-scoped and delta-counting.
Its immutability triggers make a second run unrecoverable.

**A7. Make the gate readable.** The collect-complete gate must live where a job can
read it. Give `import_ledger` at least one SELECT in a gating position — it has zero
today. A gate no job reads is the planner remembering.

**CORRECTED 2026-08-30.** This amendment's first draft named the routing pin
(`_inbox/2026-08-24_factory_routing_pin.json` → `holds` as `rail:<rail>`) as "the
right mechanism." **That field does not exist.** Verified against the pin itself:
its keys end `… 'held', 'rows'`, and `held = ["P-25","P-09","P-17 COVER","Factory 1
--apply"]` — plan rows, not rail keys. Zero hits for `holds`. So extending the pin
to rails is a schema change, not a lookup. It is also in `_inbox/`, which no job
image copies, so neither shape helps until the gate has a home a job can actually
read. Do not let a lane compile against `holds`.

**A8. Fix the vintage field or delete it.** A field that always returns `"unknown"`
is a ceremony, not a gate condition.

**A9. Every job refuses on a missing county.** `factory-conformant`'s 48021 default
becomes a refusal. Parse `--name=value`, and read back the run scope before
trusting any job on a new county.

**A10. Give zoning stamps and roads a home** — collect, atomize, parked, or named
out. Every W3 rail needs one.

**A11. Quarantine the placeholder cohort.** 188,103 `setback-rule` atoms citing
`storage-port-proof/phase-1a` — Hays and Williamson 100% — must not serve as real
before Wave R. Add to the scrub as a distinct state.

**A12. Fix OPS-1 lines 49 and 51**, which still assert both boundary tables have
"zero rows anywhere, no adapter." Both are loaded and indexed. That line tells the
next agent this work is impossible.

---

# 6. Automation sequence

The current plan's order cannot be automated because its dependencies run backwards.
Shortest path, in dependency order:

**Phase 0 — canon, minutes.** A12 (OPS-1), A4 (owe table), A3 (the 72), A2
(unincorporated absence rows). No code. Removes the false remainder and the false
impossibility.

**Phase 1 — make the gate real.** A7 and A8. Until a job refuses without a
collect-complete record, everything downstream is ceremony. This is the only item
that makes the program non-ceremonial, so it goes first.

**Phase 2 — make one job schedulable.** County-scope `landing-import`, add delta
counting, add indexes to `0001_init.sql`, and deploy it as a job. This is the
template every later lane copies.

**Phase 3 — unlock the writers.** Generalize `atoms-writer-job.mjs` from a hardcoded
path to a writer allowlist, and apply A9's refuse-on-missing-county to all of them.
Retarget well-fact / footprint / flood at whichever store is canonical — today they
read `neondb` and the L2 copy has **zero readers**, so either retarget the writers
or stop copying. Do not do both silently.

**Phase 4 — the expensive one.** Hand-seed the `breadth_*` → `place_fips` alias
table. Everything city-scoped waits on this, and it cannot be derived.

**Phase 5 — land what exists.** A5 setback landing for the four artifact cities,
then probe the remaining 68. Write a real GIS fetch job; the current files are
parsers.

**Phase 6 — atomize, then scrub, then Wave R.** Band 1 writers per
`(store, entity_type, county_fips)`, then the S-family scrub from the prior review
with S13 added: **placeholder-provenance quarantine** (A11) and **derived-without-input**
(McLennan's 65,814 envelopes over 0 rules).

After Phases 1–3 the remainder genuinely is one scheduled chain, which is the
outcome being asked for.

---

# 7. Close

The spine survives. The scope does not: the plan claims roughly six times the
boundary and setback work that is actually owed, schedules five writers that cannot
run, copies 1.4M rows nothing reads, and would overwrite four real setback tables
with invented absences. Corrected, it is a smaller and more automatable program
than the draft — 154,841 parcels of edge work rather than a county-wide sweep, and
72 named cities rather than nine.

```
leave_behind:
  - item: breadth_* to place_fips alias table (hand-seeded; 7 spellings of Bastrop)
    owner: property seat
    plan_row: F-11
  - item: placeholder setback cohort quarantine (188,103 atoms; Hays/Williamson 100%)
    owner: property seat
    plan_row: F-11
  - item: McLennan 65,814 envelopes over 0 setback rules
    owner: property seat
    plan_row: F-11
  - item: Travis parcel-node 804,457 vs 380,918 parcels (2.1x)
    owner: unassigned — diagnose before it is cited
    plan_row: F-06
  - item: zoning stamps and roads have no home in the collect program
    owner: integration
    plan_row: F-10, P-17
  - item: roster join needs an ST_Intersects area threshold (Coupland phantom)
    owner: property seat
    plan_row: F-01
```
