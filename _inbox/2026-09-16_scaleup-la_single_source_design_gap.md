# Single-source design gap -- what a cell must carry, measured against what exists

lane `scaleup-la-ledger-truth`, 2026-09-16. Companion to `_inbox/2026-09-16_scaleup-la_ledger_truth_report.md`,
which has the live measurements this document reasons from. The operator's requirement: read the
ledger, see every parcel, every fact, what serves, what has an atom -- **from one place.**

## 1. What a cell must carry for one read to answer everything

Measured gap, not aspiration. To answer "what serves, and does it have an atom, and do they
agree" from `parcel_record_cell` alone, a cell needs five things it does not have today:

1. **An atom reference on the cell itself.** Today: `parcelRecordAllowlist.ts`'s reader looks for
   `cell_state.atomDid` and finds it on 0 of a 33,815-row sample (§5 of the report). The ADR-031 /
   2026-09-11 ledger-as-serving-path ruling already specifies this ("a cell is accounting ... never
   a copied value"); P-163 is the row that builds the one writer that sets it. **Not built.**
2. **An atom VERSION, not just an identity.** A DID alone cannot tell a reader whether the atom it
   points to is the one the cell's own rendering was computed from, or a newer one the parcel has
   since drifted from (P-166's job). Today there is no field for this anywhere the report's
   `cell_state` key enumeration found (§5's per-rail key dump for the Hays probe parcel: `kind`,
   `value`, `source`, `vintage`, `basis`, and a handful of rail-specific descriptive fields --
   never a version token). **Not built.**
3. **A SERVE STATUS the cell carries about itself**, not one a reader has to compute from two
   OTHER tables (the slate JSON/TS file and the county-level gate verdict) that live in two
   different repos and can disagree (§2 of the report -- and did, live, on six Hays rails, for
   three days and counting as of this measurement). Today "what serves" is not a fact about the
   cell; it is a fact about which slate file and which verdict row a reader happens to consult, and
   this lane found the two canonical copies of that fact disagreeing with each other in production
   right now.
4. **A RENDERING VERSION keyed to both the atom version and a vocabulary version.** The
   2026-09-11 ruling's own language: "a cached rendering keyed to atom version and vocabulary
   version." The one reader's own response shape already has a slot for this --
   `rendering: {text, atomVersion, vocabVersion} | null` in `parcel-record-reader.ts`'s
   `ParcelRecordRailResponse` type -- but the code that builds it is `rendering: null` **on every
   single rail, unconditionally**, no matter what the cell or atom say (read directly from
   `buildRailResponse`'s return statement). The type exists; the writer that fills it does not.
5. **A STALENESS marker that a node's own identity churn sets.** P-166's own row text: "a node's
   change marks its atoms and cells stale together." Not built (depends on P-163, itself not
   built).

## 2. What exists today (measured, not assumed)

- The **65-rail closed registry** exists and is pinned (`PARCEL_RECORD_RAIL_META`, SHA
  `217b7dd7eb3a1b2f72f3a72d333008079f71fcaf`), vendored into hauska-engine and read by this lane's
  own instrument. This part of "one closed shape" is real and working.
- **One reader exists** (`parcel-record-reader.ts`, P-152) and does compute a serve state and does
  attempt an atom dereference per rail -- the MACHINERY for the single-read answer is built. What
  it lacks is a durable, cell-carried fact to read; it recomputes serve state from two external
  files on every call and always finds `atomDid` absent.
- **Atoms exist, in volume, for the families this program cares about** -- `buildable-envelope`
  (1,478,708 store-wide, 490,185 scoped to the six counties with a `no-buildable-area` outcome
  alone), `zoning-fact`, `setback-rule`, `property-boundary-edge`, `building-footprint`,
  `parcel-node`, all reachable by an index-bounded, parcel-scoped query today. **The atoms are not
  the bottleneck.** The bottleneck is that nothing on the cell points at them.
- **The gate/allowlist machinery is real but split-brained.** Two files, two repos, meant to be
  resynced together, carrying a documented divergence test in each -- and disagreeing live, in
  production, right now (§2 of the report). This is not a hypothetical risk this design-gap doc is
  warning about; it is a measured, dated, present-tense fact.

## 3. Existing rows that build the pieces, and what no row covers

| piece | row | status (this lane's measurement) |
|---|---|---|
| Rail -> atom family map, code-owned | **P-162** | ADDED 2026-09-11, **no artifact found** under `_catalog/` or `_inbox/` as of 2026-09-16 (checked directly). This lane's own `RAIL_TO_ATOM_FAMILY` in `scripts/ledger-truth.mjs` is a stand-in, not a substitute -- provisional, cross-checked against exactly two parcels. |
| One writer: atom + pointer + rendering in one transaction | **P-163** | ADDED 2026-09-11, **not landed** (the reader's own code comment says so; confirmed empirically, 0/33,815 sampled cells carry `atomDid`). Everything in §1 items 1, 3 (partially), 4, 5 depends on this row. |
| Backfill: mint atoms from every gated cell with a value and no atomDid | **P-164** | Depends on P-161, P-163; **cannot start** until P-163 lands (there is nothing to backfill INTO yet). |
| Succession: node change marks atoms+cells stale together | **P-166** | Depends on P-163; **cannot start** for the same reason. |
| `excluded` is three states | **P-201** | This lane's own plan row. Directly relevant: the buildable-envelope family's `R-2 ruled-withheld` class (a legitimate (a)-class exclusion) is currently indistinguishable, AT THE GATE VERDICT LEVEL, from `agValuation`'s four-county `excluded` (which is arguably a (b)- or (c)-class item under the operator's 2026-09-16 "ag valuation applies Texas-wide" ruling -- §7 of the report). P-201's three-way split, once built, should be read by a future single-source cell design as PART of the serve-status field in item 3, not bolted on separately. |
| Mid-cutover rails, ledger cell empty while value serves elsewhere | **P-204** | This lane's own plan row. Measured directly on the gold parcel by this lane's own Mode 1 run: `parcelGeometry`, `roads`, `etjStatus` (all three: `unaccounted` cell kind, `legacy-transitional` serve, non-null companion/atom data on the geometry/road side) reproduce P-204's own premise exactly, live, on the same parcel it was written against. |

**What no row covers:** the SLATE DISAGREEMENT ITSELF (§2 of the report) -- there is no row in
OPS-16 or OPS-24 whose predicate is "the engine's vendored slate and LDT's own allowlist agree,
verified by a live diff, not just a divergence test that exists but was not run since the last
change on either side." The divergence tests this lane found referenced
(`parcel-record-slate.test.ts`, `parcelRecordAllowlist.test.ts`) compare the files AT THE COMMIT
each repo happens to be pinned to when its own test suite runs -- neither repo's CI resyncs
against the OTHER repo's current `origin/main` automatically, which is exactly how a three-day-old,
three-hour-margin divergence like the one in §2 survives undetected. A row for THIS -- an
automated cross-repo resync check, not just a same-repo divergence test -- does not exist yet.

## 4. The tier-1 bake: retire it, or feed it -- the third-copy question

`place_layer_snapshots` (legacy-design-tools' own bake output table, confirmed by this lane to
live in neither `FACTORY_DATABASE_URL_RO` nor `ATOMS_DATABASE_URL` -- a third store this lane holds
no credential for) is what most `legacy-transitional` and `not-cut-over` rails actually serve from
today, per every `*FactServeCutover.ts` module doc this lane read. Two of its own consumers are
directly measured in this lane's own report:

- `nodeFacetBakeTier1ConformantCli.ts`'s `computeTier1Envelope` writes the setback/envelope legacy
  fallback (`setbacksFactServeCutover.ts`'s own doc: "setbacks' legacy value is whatever
  `nodeFacetBakeTier1.ts`'s `computeTier1Envelope` already wrote at bake time, not read live").
- `cadRollServeCutover.ts`'s dollar-rail overlay pattern reads the SAME bake for
  `marketValue`/`assessedValue`/`landValue`/`improvementValue` when the slate does not resolve to
  `record` -- which, per §2 of the report, is EXACTLY the state 48209's six dollar rails are in
  right now, live, because of the unresolved slate disagreement.

**The bake is not a historical artifact; it is load-bearing, present-tense serving infrastructure**
for exactly the rails whose ledger cells this lane found disagreeing about serve state. Two paths,
neither of which this lane can choose (out of scope -- read-only):

- **RETIRE**: once P-163's one-writer lands and the backfill (P-164) completes, every
  `legacy-transitional`/`not-cut-over` rail this lane found becomes `record`-eligible against a
  cell that carries its own atom pointer, and the bake's own outputs become redundant with what
  the ledger + atom chain can serve directly. This is the path the 2026-09-11 ruling's own text
  implies ("one reader ... dereferences atoms and every surface ... consumes it").
  Feed
- **FEED**: alternatively, teach the bake itself to READ atoms (rather than the reverse -- atoms
  being minted FROM the bake's own output, which is the CURRENT direction: every `buildable-envelope`
  atom this lane found carries `source_adapter: cortex-tier1-snapshot-breadth-bake`, meaning the
  bake is the atoms' SOURCE, not their consumer). This would keep the bake as the tier-1
  read-path but make its own output atom-traceable, at the cost of never actually retiring a third
  copy.

**This lane does not recommend one over the other** -- it is a design decision no row currently
owns, and making it without reading `place_layer_snapshots` live (which this lane could not do,
§9 of the report) risks recommending against a fact this lane never verified. What this lane DOES
establish, measured: the "third copy" is not a copy in the sense of stale duplicate data sitting
idle -- it is the CURRENT SOURCE OF TRUTH for the very rails the ledger cell claims are
`legacy-transitional`, and the atoms this lane found in volume are already downstream OF it, not
independent of it. Retiring it without first re-pointing the atom-minting pipeline at whatever
replaces it would silently stop 490,185+ atoms' worth of envelope computation, not just remove a
redundant read path.

## 5. One-sentence summary

The ledger has the right SHAPE (65 closed rails, one reader, one atom store with real volume) and
the wrong CONTENTS (no cell anywhere carries the pointer, version, serve status, or rendering
version the shape was designed to hold), and the two files that currently stand in for "serve
status" disagree with each other in production as this document is being written.
