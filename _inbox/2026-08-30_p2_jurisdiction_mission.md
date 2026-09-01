# P2 — spatial jurisdiction join (replaces the alias table as the primary derivation)

## How to work this card (read first)

**Do NOT spawn sub-agents. You are the deepest worker; do the work yourself.**

**You are authorized.** Compiled from the plan of record; carries the operator's
go. If a step is wrong, say so in the handback and do the rest.

**Verification must terminate.** Bounded SQL with a named `statement_timeout`,
builds, `vitest run`. Never a watch or an unbounded scan.

**Read product code by ref.** `git -C <repo> show origin/main:<path>`.

**Hand back, do not land.** No commit, push, deploy, migration, or job start.

## Why this replaces the alias table

The alias enumeration ran and overturned the premise. Measured 2026-08-30 on
`hauska_mcp`:

- 225 distinct `breadth_*` values — Bastrop 49, Caldwell 27, Hays 87, McLennan 58,
  Travis 3, Williamson 1.
- **509,911 parcels, 52.0% of the six, carry `unknown` and no jurisdiction string
  at all.** Williamson is 282,570 under a single value with nothing else; Travis
  169,688. **No alias table reaches them.**
- **An alias maps a string to a POSTAL place, not a parcel to corporate limits.**
  `48209_kyle` is 30,923 parcels, far more than Kyle's incorporated count.
  Consuming it as jurisdiction fabricates the exact defect this program is
  cleaning up.
- **Four keys are county-scoped, not city** — `48209_hays`, `48309_mclennan`, and
  mixed `48021_bastrop` / `48055_caldwell`. All read as clean matches from the
  string alone; a naive roster lookup sends `caldwell` to Caldwell city in
  **Burleson County** and `hays` to Hays city.

So jurisdiction is derived by **containment**, and the alias seed is demoted to
name normalisation for the 48% that carry a string.

## The inputs already exist

On cortex `neondb`, PostGIS 3.5.0: `tx_city_boundary` (1,222 incorporated-place
polygons, 26 MB) and `tx_county_boundary` (254, 25 MB), both populated with btree
bbox indexes. Geometry is `jsonb`, so there is **no GiST** — the bbox btree is what
makes this cheap. An equivalent join re-derived in **1.3 s**.

**Shape it zone-major with a `MATERIALIZED` bbox CTE.** Point-major LATERAL
measured ~218x slower on this store. This is not a style note; it is the
difference between 1.3 s and a timeout.

## What to build

1. **Per-parcel containment.** For each of the six FIPS, resolve every parcel to
   the incorporated place containing it, or to `unincorporated`. Emit the
   `place_fips` where contained.

2. **`unincorporated` is a real disposition, not a null.** Ruled 2026-08-30
   (`_decisions/2026-08-30_unincorporated_is_the_disposition.md`): a parcel outside
   every incorporated polygon is `unincorporated`, and the roster is **not**
   extended to CDPs. 40 values covering 17 real places (Cedar Creek, Driftwood,
   Del Valle, Dale, China Spring, Elm Mott, Axtell, Paige, McDade) have no
   `place_fips` and must not be given one.

3. **An area threshold on the containment test.** The existing roster join uses
   bare `ST_Intersects` with no minimum overlap, which makes Coupland a phantom
   Travis city on a 7.6e-10 deg² slice. Set and state a threshold.

4. **Straddle handling.** 24 of the 72 cities in the six cross county lines;
   Golinda, Staples and Thorndale hold territory in the six but key to a primary
   county outside. `city_manifest.payload` carries only four keys and **dropped
   `all_county_fips`** — restore it, or a county-scoped consumer double-counts or
   misses them.

5. **Reconcile against the alias seed, do not consume it as truth.**
   `_catalog/2026-08-30_breadth_place_alias_seed.json` (225 rows, 33 `certain` /
   93 `likely` / 99 `needs-human`) is the name-normalisation input. Where a string
   and containment disagree, containment wins and the disagreement is **recorded**,
   never silently resolved. Expect disagreement: the string is a postal city.

## Acceptance — both directions

- A parcel known to be inside Kyle resolves to Kyle; a parcel known to be rural
  Bastrop resolves to `unincorporated`. Both observed.
- The 509,911 `unknown`-string parcels receive a containment answer, and the
  count of those still unresolved after the join is **reported**, not rounded away.
- The threshold refuses the Coupland sliver, and a genuine straddle still resolves.
- Totals reconcile to the measured split: **357,269 unincorporated / 624,141
  in-city** across 981,410 parcels. A material divergence from those numbers means
  the join is wrong — say so rather than adopting the new number.
- Query plan verified zone-major; state the runtime and the `statement_timeout`.

## Do not

Write to any store — hand back the SQL and the counts, the planner runs it.
Extend the roster to CDPs. Consume `breadth_*` as jurisdiction. Overwrite a
containment result from a name. Use point-major LATERAL. Treat a timeout as zero.
Report the join working because it produced a plausible number — reconcile it
against the measured split first.
