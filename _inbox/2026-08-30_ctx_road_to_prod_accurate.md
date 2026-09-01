---
id: 2026-08-30_ctx_road_to_prod_accurate
title: Central Texas — the road from here to prod serving accurately
date: 2026-08-30
status: filed
plan_row: F-05, F-06, F-08, F-10, F-11, F-18, P-09, P-11, P-17
author: doc_repo planner (review seat)
depends_on: _inbox/2026-08-30_ctx_remainder_deep_review.md, _inbox/2026-08-30_ctx_w3_collect_amendments.md, _inbox/2026-08-30_ctx_w3_collect_review.md
---

# 0. The accuracy contract

Not "100% of parcels have every rail." That is impossible and the mold says so
(§1e, the honest ceiling). The reachable and correct bar is:

> **Every served cell is exactly one of four states, and never anything else.**

| State | Meaning | Proof it must carry |
|---|---|---|
| `value` | a real value | source, vintage, and a **second derivation that agreed** |
| `absent-verified` | we looked, there is none | scope searched, evaluation-time `asOf`, per-cell basis |
| `not-applicable` | cannot exist here | the structural reason |
| `refused` | inputs conflict or are degraded | the conflict, named |

Forbidden in a served body: `null`, `0`, `""`, `unknown`, any sentinel, any value
whose source is unnamed, any `absent-verified` stamped with the request clock, and
any `basis` string identical across two parcels.

**Scale.** 981,410 parcels across the six, roughly 14 rails, about 13.7M cells.
Measured today, **357,269 parcels (36.4%) are unincorporated** and resolve to
`not-applicable` on the city-scoped rails. A further **465,568 are in-city with no
setback table landed**: those are `unmeasured` until their city is probed, then
`absent-verified` — they are NOT `not-applicable`, because a setback can exist
there. Naming these two populations *separately* is most of the work and none of
the cost; collapsing them fabricates a structural claim on 469,300 parcels.

---

# 1. Where we actually are

| | State |
|---|---|
| Serving | Six counties on `node-facets-tier1-conformant-v1`, card H publishes |
| W1 bake inputs | Mostly graded: tax year met, landUse met, honest point met, seed met, alias met. Situs-extend **off** (owner-agree no-go 48021 0.688 / 48055 0.721; 48453 unmeasured) |
| Wave R | Paused |
| W3 collect | Refused pending 12 amendments |
| Band 1 writers | **None runnable.** `atoms-writer-job.mjs` hardcodes the CAD writer; F-11 has no writer at all |
| Rails | Wells + footprint on 5 of 6 needed (Caldwell done). Flood applied on all six — shape conversion only. Edges 0 outside Bastrop |
| Cities | Roster works; **72 in the six**; plan named 9 |
| Known lies in prod | landUse null on a known A1; ~58,461 wrong-parcel centroids; PE says "not stamped" where zoning exists; `absent-verified` stamped now(); 188,103 placeholder setbacks; McLennan 65,814 envelopes over 0 rules |

**A-028 changed the order.** Rails must be apply-or-absence *before* Wave R. So
this is one publish carrying everything, not facts-then-rails.

---

# 2. The map

Each phase exits on a gate that **can fail**. A phase whose exit is a judgment call
is not a phase, it is a hope. Parallel lanes are marked.

```
P0  TRUTH            no code ....................... unblocks honest scoping
      |
P1  CONTROLS         make checks able to fail ...... unblocks every later claim
      |
      +--------------------------+
      |                          |
P2  SUBSTRATE               P2b PE WIRING  (parallel, gates customer-done)
      one job template          |
      writer allowlist          |
      ALIAS TABLE (long pole)   |
      |                          |
P3  ABSENCE          name the 3 states .............. 357,269 n/a + 465,568 unmeasured
      |
P4  RAILS            apply what can apply
      |
P5  SCRUB            S1-S13 over 100% of rows
      |
P6  PIN + STAGE      determinism gate, six staging
      |
P7  WAVE R           six production, serial
      |
P8  PROVE            post-R, live briefs, continuous
```

---

## P0 — Truth. No code.

Everything here is a doc or a number. It runs first because it removes work that
was never owed and stops the next agent re-deriving a false blocker.

1. **OPS-1 lines 49/51** — they assert both boundary tables have "zero rows
   anywhere, no adapter." Both are loaded and indexed. That line tells a fresh
   agent this work is impossible.
2. **Correct the owe table** to the measured rows: wells and footprint are a
   **five**-county apply; flood is a shape conversion, not coverage; McLennan is
   stamped on 48,441 parcels; no FIPS has zero wells; C-count already ran
   2026-08-26/27.
3. **Write the city number: 72** territory-touching in the six. Restore
   `all_county_fips` to `city_manifest.payload`. Add an `ST_Intersects` area
   threshold (Coupland is a 7.6e-10 deg² phantom).
4. **Rename "facts complete."** It appears in no plan, mold, or contract and reads
   as county-complete.
5. **Track the program.** Nine artifacts, A-026, and a card H GRADE LOG row exist
   only in a dirty worktree.

**Exit gate:** a fresh agent reading only tracked canon reaches the same owe table.
Test it by handing the corrected docs to an agent with no session context and
asking what is owed. If it answers county-wide setbacks, P0 failed.

## P1 — Controls. Make checks able to fail.

This is the phase the whole review argues for. Four dormant or starved mechanisms
were found; every downstream claim rests on these.

1. **`BP-CONTENT-01` absent-verified predicate.** It uses `hasKeyPath`, which
   accepts `null` by design, and its own self-test **asserts an all-null payload
   passes**. Replace presence with the four-state contract. Delete the
   all-null-passes assertion — it converted the defect into a specification.
2. **Collect-complete gate must be readable by a job.** No job image contains
   `_inbox/`. Give `import_ledger` at least one SELECT in a gating position — it has
   zero today. **Corrected 2026-08-30:** an earlier draft of this line said to use
   the routing pin's `holds` field keyed `rail:<rail>`. That field does not exist.
   `_inbox/2026-08-24_factory_routing_pin.json` has **`held`**, and it carries
   plan-row values (`["P-25","P-09","P-17 COVER","Factory 1 --apply"]`), not rail
   keys. Extending it to rails is a schema change, not a lookup — and the pin lives
   in `_inbox/`, which no job image copies, so the gate still needs a home a job can
   read before either shape helps.
3. **Refuse on missing county.** `factory-conformant` defaults to 48021. Parse
   `--name=value`. Read back run scope before trusting any job on a new county.
4. **Schema-version fidelity.** Travis and Bastrop emit incompatible bodies under
   one version string. A version that does not move when the leaf set moves cannot
   gate anything.
5. **Fix or delete the vintage field.** `landing-import` returns `"unknown"` for
   every table, always.
6. **Repair the recount instrument** — write guard, run-time commit, DB host,
   `publishRunId` assertion, `ownersAgree` column.

**Exit gate:** every control in this list is run against a known violation and
observed failing, and against a known-good case and observed passing. Both
directions. A reviewer this session nearly refuted a correct finding on a collation
bug that only the positive control caught.

## P2 — Substrate. Make one thing schedulable, then all of them.

1. **County-scope `landing-import`**, make it delta-count (today it counts the
   whole table and its immutability triggers make a second run unrecoverable), add
   indexes to `0001_init.sql` (currently zero — every per-FIPS count is a seq scan
   on jsonb), and **deploy it as a job**. It has none.
2. **Writer allowlist.** `atoms-writer-job.mjs:46` hardcodes
   `write-cad-parcel-roll-county.mjs` and Cloud Run cannot override `command`.
   Generalize to an allowlist. This one change unlocks four of the five writers.
3. **Write the F-11 setback writer.** It does not exist in any form.
4. **Fix the easement writer.** `write-utility-easement-county.mjs:191` live-fetches
   ArcGIS — the shape the collect card's own Do-not list forbids.
5. **Resolve the store split.** Writers read `neondb`; the L2 copy has **zero
   readers**. Either retarget the writers or stop copying. Not both silently.
6. **THE LONG POLE — the `breadth_*` → `place_fips` alias table.** Property atoms
   key on `breadth_<fips>_<free text>` from unnormalised CAD situs: seven spellings
   of Bastrop, six of Smithville, five of Cedar Creek, four of Luling, plus zip
   codes, road fragments, `houses_only`, `unknown`, and eight cities not in Bastrop
   County. It must be hand-seeded; it cannot be derived. **Everything city-scoped
   waits on this, so start it at the top of P2, not when it is needed.**

**Exit gate:** one writer other than CAD runs as a job, on a named county, and
refuses when the county is absent.

## P2b — PE wiring. Parallel. Gates customer-done, not Wave R.

Four defects across three files; #310 is merged and starved, so a redeploy changes
nothing.

1. Grey box: keyed on per-row `absent-uncovered` ∩ `inCoverageBlock`, not envelope
   nullity. The defect is **scope** — a per-parcel state printed as "in this area."
   **Do not fix the string as a unit: the "setbacks" half is true.**
2. `inspectHighLevelLabel` returns the literal `"Zone"` for `landUse`.
3. `"A1 — A1"` is minted inside PE by `description: landUseLabel ?? landUseCode` —
   a defaulted field — then rendered again as a second datum.
4. `yearBuilt` occurs twice repo-wide, both type declarations. Never assigned.
   **Render it with its source**, because CAD 2021 disagrees with listing 2022 on
   Driftwood; a bare number puts two contradicting figures on one screen.

**Exit gate:** a live brief, plus a deployed-bundle marker check (fetch index →
fetch bundle → assert a change-marker string). The mold already specifies this as
gate 8's seed and it has never been built. A merged PR is not the gate — #310
proves it.

## P3 — Absence. The cheapest phase, and the biggest.

Setbacks, edges and envelope inherit their scope from zoning, and counties do not
zone unincorporated land. Zoning already emits `not-applicable` there; the other
three do not.

Add the `unincorporated → not-applicable` row for setbacks, edges and envelope.
Add the four county-level easement absences the T3 recon already established.

| Population | Parcels | State |
|---|---|---|
| In-city ceiling | 624,141 | — |
| Unincorporated | **357,269** | `not-applicable` (structural) |
| In-city, no table yet | **465,568** | `unmeasured` -> `absent-verified` on probe |
| In-city, warmed | 3,732 | `value` |
| Edge work actually owed | ~154,841 | — |

**Do not stamp `not-applicable` on the 826,569 remainder.** Only the 357,269
unincorporated qualify. The other 469,300 are in-city parcels where a setback can
exist and has not been sourced — calling that structural is an unearned absence.

**Exit gate:** a live brief on a Caldwell rural parcel names county-absence rather
than showing an empty rail. Absence must be *served*, not just stored — that was
the ADR-029 gap.

## P4 — Rails. Apply what can apply.

| Rail | Work | Scope |
|---|---|---|
| Wells | apply | **5 counties** (Caldwell has 53,841) |
| Footprint | apply | **5 counties** (Caldwell has 35,269) |
| Flood | **shape conversion only** | already 981,620 atoms on all six |
| Setbacks | **land the 4 existing artifacts**, then probe the other 68 cities | city-scoped |
| Edges | depth-warm, only where a setback table lands | ≤154,841 |
| Envelope | recompute where a rule exists; PDD stays declined | follows setbacks |
| Easements | 4 layers + 4 county absences | probe RR/Cedar Park first — URLs are synthesised |
| Zoning stamps, roads | **need a home** — absent from the collect card entirely | — |

Two quarantines before anything serves: **188,103 placeholder `setback-rule` atoms**
(`storage-port-proof/phase-1a`; Hays and Williamson are 100% placeholder), and
**McLennan's 65,814 envelopes derived from 0 setback rules**.

**Exit gate:** every rail is `applied` or `absence` with a five-field record, and a
Band-1 job **refuses to start** without it.

## P5 — Scrub. 100% of rows, before any publish.

Thirteen families, extending the walk's grade set rather than sitting beside it —
A-021 already gates production on a passed walk, so a new script would be a fifth
dormant mechanism.

| | Family | Second derivation |
|---|---|---|
| S1 | sentinels (`", ,"`, `", TX 78660"`, `0,0`, `A1 — A1`) | real vs non-null coverage |
| S2 | three-state audit — every null carries the full record | null vs its provenance |
| S2b | absence integrity — `asOf` is evaluation time, `basis` varies per parcel | `asOf` vs `bakedAt` |
| S3 | cross-source agreement (landUse, yearBuilt, acreage) | 3-way, disagreement refuses |
| S4 | **point falls inside its own ring** (`ST_Contains`) | geometry vs join label |
| S5 | **refusal reconciliation** — a refused parcel names *that* refusal | roster vs served body |
| S6 | serve-path divergence — facets vs `get_smart_site` vs PE vs MCP | reader vs reader |
| S7 | ledger vs served truth | cell vs live probe |
| S8 | provenance completeness | value vs source |
| S9 | unit and frame | declared unit vs range |
| S10 | identifier hygiene — six key forms today | key vs registry |
| S11 | schema-version fidelity | cross-county shape diff |
| S12 | adapter conflict (426 Bastrop parcels, two geometries) | adapter vs adapter |
| S13 | **placeholder provenance + derived-without-input** | provenance allowlist; envelope vs rule |

Sampling: 100% for anything expressible in SQL. **Area sweep, not random**, for the
HTTP checks, with the hard classes forced in — the refused roster, gate-blocked,
no-row, PDD parcels, 5- and 7-digit ids, two-tax-year parcels, unincorporated, and
the 534,700 CAD rows with no conformant snapshot. Random sampling certified a broken
Bastrop once.

**Exit gate:** each family runs against a poisoned row and fails, and a known-good
row and passes. Both directions, every family.

## P6 — Pin and stage.

1. Pin `_LDT_SHA` to the W1 merge.
2. **Determinism gate**: bake the same county twice, diff the bodies, require empty.
   Tax-year selection had no `ORDER BY`, so two bakes of identical input produced
   different bodies; until this is empty, no divergence test means anything.
3. Six staging bakes, concurrent (A-024(4)).
4. Staging walk with the new grades, S4 and S5 included.

**Exit gate:** six `walkVerdict pass` on the rows those runs wrote, refusal fixtures
green.

## P7 — Wave R.

Six production, **serial**, under A-021 — which is a standing per-county word, so no
new amendment is needed. Item 9 must add the two preconditions it currently omits:
**refusal fixtures green** and a **per-county GRADE LOG row** (revision, run id,
freshness stamp). Card H has zero such rows; that gap is why "was Bastrop complete"
had four different answers.

Golds: 48021:34137 stamped with landUse not null-as-absent; 48021:8720522 PDD with
setbacks **refused honestly** (it is in the 3,747 roster — that refusal is the
correct output, not a miss); 48209:135570 `joined-situs` or honest `gate-blocked`;
48491:76149 never `joined`; 48453:493738 honest `no-row`; 48453:231086
`stamp-missing` for Austin.

## P8 — Prove, then keep proving.

1. Repaired recount on the Wave R `publishRunId`s.
2. Live PE briefs: Laird, Shoalwood, Rainmaker, Pine.
3. **Area sweep, not parcel sample** — every parcel in the chosen blocks.
4. **Continuous:** the scrub becomes scheduled, not one-shot. A rail that regresses
   fails the next run. Without this, P5 certifies a moment, not a system.

---

# 3. Critical path

Everything else can be parallel. This is the line that sets the length:

```
P0 truth  ->  P1 controls  ->  P2 alias table (LONG POLE)  ->  P4 setback landing
          ->  P4 edges     ->  P5 scrub  ->  P6 determinism  ->  P7 Wave R
```

**Start the alias table immediately.** It is hand-seeded, cannot be derived, and
every city-scoped rail waits on it. It is the only item here that cannot be
compressed by adding parallelism.

Runs fully parallel and never blocks Wave R: P2b PE wiring, easement probes, zoning
stamps and roads finding a home, the recount repair.

# 4. What would make this fail

- Publishing before P5. The walk that passed all six counties **cannot fail** on
  the landUse defect; passing it again proves nothing.
- Treating a merged PR as done. #310 is merged, starved, and changes nothing.
- Re-running `landing-import` before P2 fixes it — unrecoverable.
- Applying 0005 as drafted — destroys four real setback tables.
- Naming coverage where the honest answer is `not-applicable`. That is what made
  the owe look 6x larger than it is.
- Any absence written without a probe. An unprobed absence is a fabricated fact,
  and it is harder to detect than a fabricated value.

```
leave_behind:
  - item: breadth_* to place_fips alias table (hand-seeded; long pole)
    owner: property seat
    plan_row: F-11
  - item: zoning stamps and roads have no home in any collect card
    owner: integration
    plan_row: F-10, P-17
  - item: Travis parcel-node 804,457 vs 380,918 parcels (2.1x, undiagnosed)
    owner: unassigned
    plan_row: F-06
  - item: continuous scrub schedule (P8.4) — without it P5 certifies a moment
    owner: planner
    plan_row: F-08
```
