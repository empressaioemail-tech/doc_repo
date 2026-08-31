# P4 — wells, footprint, flood. The three rails that are not held.

## How to work this card (read first)

**Do NOT spawn sub-agents. You are the deepest worker; do the work yourself.**

**You are authorized.** Compiled from the plan of record; carries the operator's
go. If a step is wrong, say so in the handback and do the rest.

**Verification must terminate.** Bounded SQL with a named `statement_timeout`,
builds, `vitest run`, or a job execution you read to completion. Never a watch.
**A timed-out query is `unmeasured`, never 0.** Fabricating a zero here is the
worst available outcome.

**Read product code by ref.** `git -C <repo> show origin/main:<path>`.

**Hand back, do not land.** No commit, push, deploy, or migration. Job executions
are planner-run.

## Scope — three rails only

This card is **wells, footprint, and flood**. It is explicitly **not** setbacks,
edges or envelope: those are held until LDT #560 lands and Gate 8's C7 is re-read,
because C7 is a retired `road-class-setback-table` derivation still serving and P4
would propagate it. Do not touch them here.

Gate 8 exists and `dayOne` is the key P4 reads. C3/C4/C7 being red is the
instrument working, not a blocker for these three.

## What is actually owed — the counts are measured, do not re-derive

| Rail | Work | Scope |
|---|---|---|
| RRC wells | apply | **five counties.** Caldwell already has **53,841** `well-fact` (2026-08-16) |
| Footprint | apply | **five counties.** Caldwell already has **35,269** `building-footprint` |
| Flood | **shape conversion, not coverage** | `flood-hazard-fact` is **already applied on all six**, 981,620 atoms. 48021 has 4 selectors, not "62,254 derivations" |

**Three claims in the older inventory are wrong and must not be re-adopted:**
Caldwell is not a zero for wells or footprint; flood is not a coverage owe; and
**no FIPS has zero wells** (2,548 / 10,654 / 24 / 458 / 801 / 1,162), so the
"zero-FIPS writes coverage-absence and stops" branch is dead code, not a path.

Confirm each count before acting on it. If your measurement disagrees materially
with the numbers above, **your predicate is wrong, not the corpus** — say so
rather than adopting a new number.

## Wiring you must check before you run anything

The writers read `neondb`, not the Factory L2 copy. `landing_tx_rrc_well`,
`landing_tx_building_footprint` and `landing_tx_fema_nfhl_flood_zone` were
measured to have **one reference each across all three repos — the spec that
writes them, and zero readers.** Meanwhile `fetch-wells-staged.ts` reads bare
`FROM tx_rrc_well`, `staged-footprint-join.ts` reads `tx_building_footprint`, and
`postgis-flood-plan.ts` reads `tx_fema_nfhl_flood_zone`.

So **collect-complete for these rails is a count of the table the writer actually
reads**, not of the L2 copy. Do not "verify" against a table nothing consumes.

## Job discipline — the traps are named because they have fired here

1. **Every run names its county and the job refuses without one.** P1-FACTORY
   landed refuse-on-missing-county; use it. `factory-conformant` previously
   defaulted to 48021.
2. **Cloud Run args are `--name=value`.** A reader that parses only the spaced
   form runs on defaults and reports success. **Read the resolved run scope back
   off the execution log**, not off the invocation you typed.
3. **One writer per `(store, entity_type, county_fips)`. One heavy scan per
   database.** Serialize the heavy scans — footprint waits for the RRC scan to
   release.
4. **Do not re-run `landing-import`.** Its landing tables carry
   `BEFORE UPDATE OR DELETE → LANDING_IMMUTABLE` triggers and it counts the whole
   table, so a second run yields 2x and then fails permanently. C-count already
   ran 2026-08-26/27 with nine clean two-counts.
5. **`applyMigrations` reads `migrations/` only.** Nothing here applies a
   migration.

## Five-field record per rail, or the writer does not start

A rail may atomize only when a record names all five: **source** (the table the
writer reads), **scope** (which of the six, never 254), **two-count** (source and
result, each timestamped — `0=0` is vacuous unless a coverage-absence row is also
written), **vintage**, and **run id** (a Factory run, not a laptop). P1-FACTORY
landed `SELECT FROM import_ledger` before `startRun` — that is the gate; do not
route around it.

## Acceptance — both directions, and on the served path

- Per-FIPS atom counts before and after, for each of the three rails, reconciling
  to the measured numbers above.
- **A known-well parcel shows the atom on a live brief; Pine stays
  `absent-verified` if RRC genuinely has no well there.** An empty rail on a
  parcel that has data is the failure this rail exists to prevent.
- Gate 8's wire assertions run against the served body after the apply and do not
  regress. C3/C4/C7 stay as they are — if any of them *moves*, something else
  moved and you say so rather than accepting a greener board.
- A deliberately omitted `--county` refuses, observed.
- Any query that times out is reported `unmeasured` with its timeout named.

## Do not

Touch setbacks, edges or envelope. `SELECT tx_rrc_well` from PE — P-50 stands, the
atom is the surface. Copy any landing table into `place_layer_snapshots`. Re-run
`landing-import`. Re-download wells, footprint, flood or CAD. Treat a zero atom
count as collected, or a timeout as a zero. Apply a migration. Start Wave R.
Restart `scllr`, F-09, F-10 254, or Harris PBF. Adopt a new count that disagrees
with the measured table above.
