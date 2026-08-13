---
id: 2026-08-12_L7_sparse_rail_absence_doctrine
title: L7 — SCORE-time counting rule for sparse statewide-uniform rails
date: 2026-08-12
status: active
plan_row: P-01
serves: [DC-3, DC-9]
rails: [rrc-wells, rrc-pipelines, rail-corridor, mud]
---

# SCORE-time counting rule — sparse uniform rails

This note specifies how a county with **zero features** reaches `satisfied-absent` at SCORE time for sparse statewide-uniform rails. It does **not** run those scorers (applies may still be in flight). It makes the path they need explicit so DC-3 cannot stall on a missing write mechanism.

## Rails in scope

| railKey | Phenomenon | Statewide source of record | Coverage evidence |
|---|---|---|---|
| `rrc-wells` | Oil/gas wells | RRC well inventory staged as `tx_rrc_well` (PIP county_fips populated statewide — A1 close 2026-08-11: 1,394,336/1,396,049 with county_fips, 254 counties) | Source table covers all Texas counties in the join; a county with `count(*)=0` for that FIPS is a positive determination of no wells, not "not scored" |
| `rrc-pipelines` | Pipelines | RRC pipeline inventory staged as `tx_rrc_pipeline` (491,178/491,178 county-attributed) | Same: statewide load + zero rows in county = absent |
| `rail-corridor` | Active rail corridor proximity / parcel hits | Writer family `rail-corridor-fact` over statewide rail geometry (OSM/network source bound on declaration) | Statewide corridor layer intersected to county; zero hits after apply = absent |
| `mud` | MUD / special-district membership (mud is a special-district TYPE per OPS-16 A-002) | `special-district-fact` from statewide district polygons | Statewide district set + zero membership atoms for county (after SF-6 true-geometry membership) = absent |

## Counting rule (SCORE time)

For each sparse rail above, after the writer has run (or after a scorer that reads the staged statewide table directly):

1. **Universe confirmed.** The scorer names the statewide source and asserts it is the coverage universe for Texas (table loaded / layer bound for all 254 FIPS, or an explicit exception list). Without a named universe, absence is forbidden.
2. **County measure.** `featureOrAtomCount(county) = 0` under that universe.
3. **Positive determination.** Write `rail_state = 'satisfied-absent'` with:
   - `absence_basis` non-null, machine-readable, citing the source (e.g. `tx_rrc_well-statewide-zero-features-in-county`)
   - `verified_by_instrument` non-null (the scorer CLI name)
   - `source` non-null (table or layer id)
   - `honest_coverage_pct = 0`, classification `true-source-gap` (or rail-specific equivalent that is not fabricated)
4. **Fail closed.** If the universe is incomplete for that county (source missing, join failed, writer never ran), write `not-yet` — never invent `satisfied-absent`. Zero atoms without a confirmed statewide universe is not absence.
5. **Serve path.** `countyLedger.ts` already passes stored `satisfied-absent` through as `displayState`. No serve-path special case required. DC-9 grades provenance on the cell.

## Geometry precedent (proved in L7)

`countyGeometryScoreCli.ts` implements the same fail-closed shape for the fabric rail: `--honest-absent` + `--artifact` required; null/zero denominator without determination stays `not-yet`. Sparse-rail scorers should copy that contract (determination object with `absenceBasis` + `verifiedByInstrument`), not invent a softer path.

## What this note does not authorize

- Running wells/pipelines/rail-corridor/mud `--apply` or scorers from L7
- Treating Ector geometry 5% coverage as absence (data exists; P-02 re-key)
- Doctrine-sourced rollup cheating (`source='zoning-regime-doctrine'` remains excluded from Texas rollup per existing guard)
