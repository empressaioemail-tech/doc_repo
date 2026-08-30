---
id: 2026-08-30_ctx_consolidated_execution_plan
title: CTX consolidated execution plan and test regime (P0-P8) — supersedes the review pile
date: 2026-08-30
status: proposed (operator approval before P1+ code)
applies_to: hauska-factory, hauska-engine, legacy-design-tools, hauska-map, cortex-api
plan_row: F-01, F-05, F-06, F-08, F-10, F-11, F-18, P-09, P-11, P-17, P-92
author: doc_repo planner (review seat)
supersedes_as_schedule: _inbox/2026-08-30_ctx_w3_collect_WDLL.md (spec only, not a schedule)
---

# 0. What this is

One card. Everything measured on 2026-08-30 across six reviews and eleven agents,
consolidated so a fresh reader does not navigate fifteen `_inbox` files.

**Authoritative:** this card for the schedule and the test regime.
**Reference, do not execute from:** `w3_collect_WDLL` (specification),
`rail_inventory` (inventory), `road_to_prod_accurate` (rationale),
`w3_collect_amendments` (A1-A12), the three review files, the edge handoff.
**Superseded as schedules:** Band C / Band 1.

Every number below was measured this session and names its source. Do not
re-derive. Do re-run the instrument before quoting any of it in a later session —
these are claims about 2026-08-30.

---

# 1. State of play, measured

## Scale and scope

| Fact | Value | Source |
|---|---|---|
| Parcels, six counties | 981,410 | `neondb`, distinct `prop_id` |
| In-city | 624,141 (63.6%) | TxGIO city polygons |
| Unincorporated | **357,269 (36.4%)** | same |
| Bastrop in-city | 12,318 / 62,257 (19.8%) | same |
| Incorporated cities in the six | **72 touching, 69 primary** | `texas_roster_v1`, 1,214/1,223 linked |
| CAD rows with no conformant snapshot | 534,700 | recount |
| Wrong-parcel centroids (Hays + Williamson) | ~58,461 | join-state cross-tab |
| Wells per FIPS | 2,548 / 10,654 / 24 / 458 / 801 / 1,162 | `tx_rrc_well`; **no FIPS is zero** |

## The three-state split — do not collapse

`826,569` is the non-edge remainder, **not** the unincorporated count:

| Population | Parcels | Correct state |
|---|---|---|
| Unincorporated | 357,269 | `not-applicable` (structural) |
| In-city, no setback table | 465,568 | `unmeasured` → `absent-verified` on probe |
| In-city, warmed | 3,732 | `value` |

Stamping `not-applicable` on all 826,569 fabricates a structural claim on
**469,300** in-city parcels.

## Edge honesty, measured

| Fact | Value |
|---|---|
| Bastrop edges | 26,846 on 3,732 parcels |
| By adapter | 19,159 `descriptor-fixture` / 7,687 depth-warm / 426 dual |
| Edges asserting a shared boundary | 7,838 |
| **Pass all three reciprocity tests** | **741 (9.45%)** |
| **Miss rate** | **90.55%** — tolerance-insensitive (90.71 strict / 89.65 loose) |
| Median Δlength on a matched counterpart | 31.2 ft |
| Median bearing error | 85.4° |
| Neighbour ids shipped county-wide | 9,877; **741 sound (7.5%)** |
| ROW/alley edges carrying a neighbour | 2,039 (1,750 + 289), all fixture |
| Of those, parcels actually **touching** | **2,030 (99.56%)** |
| Edge itself on the shared boundary | 211 / 1,341 (15.73%); ROW 12.07%, **alley 35.92%** |
| Name a neighbour >15 ft from that edge | **885 / 1,341 (66%)** |
| `neighbor = "0"` sentinel rows | 20 (a 168-part catch-all polygon) |
| Self-naming edges | 8 — **1 ROW + 7 `neighbor-parcel`** |
| **Retired fixture edges shipping live** | **723** |

**Two writers, not one.** `depth-warm/emit-boundary-edges-from-warm.ts:120`
hardcodes `parcelNeighborPropId: null`; `boundary-primitive/compute.ts:226` writes
it unconditionally. **P4 mints via depth-warm, so P4 does not scale this defect.**
The whole 90.55% is legacy fixture data P4 supersedes.

**The adjacencyKind invariant is REFUSED.** `ROW/alley ⇒ neighbour NULL` would null
~300 geometrically true ids, and splitting by kind is unjustified because alleys
are *more* valid. Correct predicate:

```
keep parcelNeighborPropId only if
  ST_Length(ST_Intersection(edge, ST_Boundary(neighbour))) >= 0.9 * edge_length
```

Two independent derivations; also catches the sentinel, the self-namers, and the
mislabels. Note `adjacencyKind` is frequently the wrong field, not the neighbour
id — on `34169` e3 the edge *is* the shared boundary while its claimed road is
198 ft away.

## Known lies currently in production

`baseFacts.landUse: null` on a known A1 · ~58,461 wrong-parcel centroids · PE says
"not stamped" where zoning exists · `absent-verified` stamped with the request
clock, `basis` identical across parcels · 188,103 placeholder `setback-rule` atoms
(Hays 34,454 and Williamson 124,499 are **100%** placeholder) · McLennan 65,814
envelopes derived from **0** setback rules · 723 retired edges served · 7.5% of
neighbour ids sound · Travis `parcel-node` 804,457 against 380,918 parcels ·
**envelope computed and denied** (wire `envelope.status: "ok"`,
`buildableAreaSqFt: 9350`; DOM says "Buildable: Not stamped here", because
`liveBuildablePct` reads a `buildableAreaPct` the facets envelope never carries) ·
**a retired derivation serving** (`boundaryEdgeFact.setback.provenance:
"road-class-setback-table"` live on the gold front edge; the mold retired the
road-class-to-setback-value path 2026-07-29) · **509,911 parcels (52.0%) carry
`unknown` and no jurisdiction string at all**.

## Controls that exist and cannot fail

`BP-CONTENT-01` accepts `null` and its self-test **asserts an all-null payload
passes** · hauska-map #310 merged and starved at the BFF · the LDT divergence test
skips in CI · recount self-tests grade dead code · `import_ledger` has **zero
SELECTs** · `DrawEdge.state` is a literal type with **one inhabitant** · no job
image contains `_inbox/`, so the collect gate is unreadable · `factory-conformant`
defaults county to 48021.

---

# 2. Workload by wave

| Wave | Work | Exit gate (must be able to fail) |
|---|---|---|
| **P0** docs | Commit the program (9 artifacts, A-026, A-028). OPS-1 A12 **and** `2026-08-08_STATEWIDE_layer_inventory.md` 29-30. Restore road-to-prod P0 item 5. Propagate the 357,269/465,568/3,732 split. Write 72. Re-derive `CTX_RESIDUE` vs W0b no-go. Supersede `collect_WDLL` 53+95. Card H GRADE LOG rows. Reconcile 4-vs-5 easement layers. Rename "facts complete". Restamp the canvas (32 commits behind). | A fresh agent reading **`git show HEAD:`** only, with no session context, reaches this owe table |
| **P1** controls | BP-CONTENT-01 four-state; delete all-null-passes. Gate a job can read. Refuse-on-missing-county + `--name=value`. Schema-version fidelity. Vintage fix-or-delete. Recount repair. **0005 split** (drop 4 seeds, `probed_at NOT NULL`, name the store). **`DrawEdge.state` → real union.** **Serve-path `status` filter.** | Every control run against a poisoned case **and** a known-good; both observed |
| **P2** substrate | County-scope + delta-count `landing-import`, indexes, deploy. Writer allowlist. F-11 setback writer. Easement writer stops live REST. Rule the store split. **Spatial jurisdiction join (primary derivation).** Alias seed reconciles the 48% carrying a string — it is NOT the long pole and NOT a jurisdiction source. | One non-CAD writer runs as a job on a named FIPS and refuses without one |
| **P2b** parallel | Grey-box scope (keep the setbacks half). `"Zone"` label. `A1 — A1` default. yearBuilt **with source**. **X2 edge disposition.** **Restore `sourceAdapter`.** **Absolute anchor on draw** (unblocks X1 + the block view). | Live brief **plus** deployed bundle marker. A merged PR is not the gate |
| **P3** absence | Three states, not one. Four county easement absences. | Caldwell rural brief names county-absence live |
| **P4** rails | Wells **5** · Footprint **5** · Flood = shape conversion · Land 4 `SETBACK_TABLES`, probe other 68 of 72 · Edges ≤154,841 · Envelope where a rule exists · Easements after probe · Zoning stamps F-11 · Roads parked · Quarantine 188,103 + 65,814 | Every rail applied-or-absence with a five-field record; the job **refuses** without it |
| **P5** scrub | S1–S13 **+ S14** edge reciprocity on the `ST_Intersection ≥ 0.9` predicate | Each family fails a poisoned row and passes a gold |
| **P6** pin+stage | Pin W1. Determinism. Six staging concurrent. Walk with new grades. | Six `walkVerdict pass` on the rows those runs wrote; empty body diff |
| **P7** Wave R | Six production **serial** under A-021. GRADE LOG per county. Refusal fixtures green. | Six close lines + gold probes |
| **P8** prove | Repaired recount. Live briefs. Area sweep. **Schedule** the scrub. | Continuous fail on regression |

**Critical path — CORRECTED 2026-08-30 after the enumeration ran.** The alias
table is **not** the long pole, and jurisdiction must not be derived from it.

The enumeration measured 225 distinct `breadth_*` values (Bastrop 49, Caldwell 27,
Hays 87, McLennan 58, Travis 3, Williamson 1) — and found that **509,911 parcels,
52.0% of the six, carry `unknown` and no jurisdiction string at all.** Williamson
is 282,570 under one value with nothing else; Travis 169,688. No alias table
reaches those parcels.

Two further facts kill the alias-as-jurisdiction premise outright:

- **An alias maps a string to a place, not a parcel to corporate limits.** CAD
  situs carries a *postal* city. `48209_kyle` is 30,923 parcels, far more than
  Kyle's incorporated count. Consuming it as jurisdiction would fabricate exactly
  the defect this program is cleaning up.
- **Four keys are county-scoped, not city** — `48209_hays`, `48309_mclennan`,
  and mixed `48021_bastrop` / `48055_caldwell`. All four read as clean matches from
  the string alone, and a naive roster lookup sends `caldwell` to Caldwell city in
  **Burleson County** and `hays` to Hays city.

**So spatial containment is the primary derivation and the alias table is a
name-normalisation fallback.** The inputs are already loaded and indexed:
`tx_city_boundary` (1,222 polygons) and `tx_county_boundary` (254) on cortex
`neondb`, PostGIS 3.5.0, and the equivalent join re-derives in **1.3 s**
zone-major with a `MATERIALIZED` bbox CTE. This is cheaper than the hand-seeding it
replaces, and it is the only derivation that answers "is this parcel inside
corporate limits", which is what every city-scoped rail actually needs.

    P0 -> P1 -> P2 spatial jurisdiction join -> P4 setback land -> P4 edges
       -> P5 -> P6 -> P7

The alias seed still ships, scoped honestly: it reconciles the 48% that carry a
string, and its confirm pass is short — the top 3 values are 63.3% of parcel
weight, the top 25 are 94.7%, and 112 of the 225 values carry two parcels or
fewer. Draft at `_catalog/2026-08-30_breadth_place_alias_seed.json`
(33 `certain` / 93 `likely` / 99 `needs-human`), findings at
`_inbox/2026-08-30_alias_seed_findings.md`.

**One operator ruling is owed before P3.** `place_fips` cannot express **40 values
covering 17 real places** — Cedar Creek, Driftwood, Del Valle, Dale, China Spring,
Elm Mott, Axtell, Paige, McDade and others are absent from both
`texas_roster_v1.json` (1,223 incorporated) and `tx_city_boundary` (1,222); 19 were
probed and 0 found. These are unincorporated communities. Rule: extend the roster
to CDPs, or give them an explicit `unincorporated` disposition. Do not seed around
it.

**Never blocks Wave R:** P2b, easement probes, zoning-stamp remainder, roads,
recount repair, W1 CI, Factory walk grades.

**Queued, not execution:** v3 (lens conversation → UI conversation → v3 WDLL) and
its six measurements.

---

# 3. Test regime

## The two gates the mold already requires and nobody built

`28_THE_BASTROP_MOLD_engine_build_spec.md` names gates 7 and 8 as **engine-build
prerequisites** and records both as not mechanical. P4 is a fan-out. The mold's
own words: a fan-out without a real smoke gate "re-creates the 3-day scan-fix
loop, the exact failure the program exists to prevent."

**Gate 7 — tally and cost. Not mechanical.** No cost-per-parcel check, no CI
fail-closed. Structural commitment #3 (under $200 per jurisdiction) is not
measured in code. Build: coverage as a live SELECT, cost-per-jurisdiction
measured and gated.

**Gate 8 — smoke. Not mechanical.** No end-to-end live-availability gate. The mold
hands over the seed: hash-drivable deep links (`#panel=...&county=...&node=...`),
a headless-Chrome CDP walk asserting rendered content, per-layer live probes with
timing, and a **deployed-bundle marker check** (fetch index → fetch bundle →
assert a change-marker string) that catches the Vercel no-auto-deploy trap
mechanically. Build gate 8 **before P4**.

## Per-phase tests

**Before any job runs (P2 exit):**
- One-off execution on a **non-default** county; read the scope back from the
  execution log, not the invocation. `factory-conformant` defaults to 48021 and
  Cloud Run args are `--name=value` — a spaced-form-only reader runs on defaults.
- Refuse-on-missing-county proven **by violating it**.
- Idempotency: a second run is safe or refuses. `landing-import` today counts the
  whole table and its `LANDING_IMMUTABLE` triggers make a second run unrecoverable.
- Concurrency: two runs on one `(store, entity_type, county_fips)` must conflict.
  One heavy scan per database.

**Before P5 is trusted:**
- Every scrub family run against a poisoned row (must fail) **and** a gold (must
  pass). Both arms. Two near-misses this session were caught only by the positive
  arm: a C-collation bound that silently narrowed, and a wrong fixture that made a
  correct instrument look broken.
- State the tolerance and show the result at two tolerances, so a reader can see
  whether it is tolerance-sensitive.

**Before P7:**
- Determinism: bake one county twice, require an empty body diff.
- Walk grades fail a deliberately broken body.
- Refusal fixtures green.
- **Serve-path parity** on the golds: the same node through facets,
  `get_smart_site`, PE and MCP must agree on **state** — vocabulary may differ,
  state may not. Two readers already disagree on `48021:8720522`.

**Every deploy:**
- Read the serving revision from the request log, never `latestReadyRevisionName`.
- Read traffic as JSON, never a positional formatter — a blank field shifts every
  column after it.
- Assert the deployed bundle carries a change marker.

**Every store session:**
- Enforce read-only and **verify it by violation** (`CREATE TEMP TABLE` must be
  refused).
- Mint short-lived credentials, delete at close, confirm reconnection fails.
- Name the database in every result. `hauska_mcp.atoms` is database.table, not
  schema.table — querying it as a schema returns a false absence.
- A timed-out query is `unmeasured`, never 0.

## Standing rules that earned their place today

State your snapshot, and read the authoritative record: `git show HEAD:`, not the
working tree; the writer the job actually calls, not an adjacent one. Both of this
session's failed claims came from reading the convenient artifact.

Pre-register the falsifier before running a check, including for your own work.
The two checks run last — the write-path read and the centerline falsifier —
overturned a claim I had given the operator twice and stopped a predicate that
would have nulled ~300 true values.

Prefer the type over the check. `DrawEdge.state` widened to a real union makes
every consumer fail to compile; a value-level check would be the fifth control
here that exists and cannot fire.

---

# 4. How to proceed

**1. Commit, today, before anything else.** The whole program — both cards, both
decisions, the amendments, the reviews, this file — is untracked, and the board is
32 commits behind. P0's own gate measures tracked canon. Nothing downstream is
citable until this is done, and it costs minutes.

**2. Freeze new threads until P0 and P1 land.** Fifteen `_inbox` artifacts, four
review files and a scoping card are open. The failure mode this operation
repeatedly hits is knowledge that never becomes mechanism; more threads make that
worse, not better.

**3. Then P1, and only P1.** Every claim after it is unverifiable until the
controls can fail. Build gate 8 alongside it, because P4 is the fan-out the mold
forbids without one.

**4. Start the alias table on the same go as P1.** It is the long pole, it is
hand-seeded, and nothing about it can be compressed later.

**5. Do not run:** 0005 as drafted · `landing-import` · F-18 while it defaults to
48021 · Wave R before P5 and P6 · any absence without a probe · the adjacencyKind
invariant.

```
leave_behind:
  - item: breadth_* to place_fips alias table (hand-seeded; long pole)
    owner: property seat
    plan_row: F-11
  - item: gate 7 (tally + cost) and gate 8 (smoke) — mold prerequisites, unbuilt
    owner: planner
    plan_row: F-08
  - item: Travis parcel-node 804,457 vs 380,918 (2.1x, undiagnosed)
    owner: unassigned
    plan_row: F-06
  - item: McLennan stamped reads 48,441 vs recount 48,431 — two instruments differ by 10
    owner: integration
    plan_row: F-08
  - item: warden/neighbor-consistency.ts consumes the same bad neighbour join
    owner: property seat
    plan_row: P-92
  - item: interpretBoundaryEdgeFactRows discards padded-grammar rows without comparing content (426 parcels)
    owner: property seat
    plan_row: P-92
  - item: v3 scoping — lens conversation, UI conversation, six measurements
    owner: planner
    plan_row: P-92
```
