# RETURN.md — worker B5 (W-5, W-3, W-4)

SNAPSHOT: repo hauska-engine, commit d3f37949003fae5a99a82b62956352b7dcaa1022, worktree P:/tmp/mp-b-flood-chain, branch fix/flood-geo-failclosed.

HEAD confirmed VERIFIED: `git rev-parse HEAD` printed `d3f37949003fae5a99a82b62956352b7dcaa1022`. No commit, no push, no `git add`.

Did not start B6 (containment) or B7 (corpus stamp). No production writes.

---

## Pre-registered ways this output could be wrong (before the edit)

1. Reachability misread: treat an import as an invocation, or miss a planner call behind a different binding. Check: read the three writer files end to end, then follow each import into index and the plan module. Do not conclude "no other callers" from search.
2. SFHA domain invented from the old JS predicate (`T`/`t`/`true`) instead of a repo artifact. Check: read FEMA adapter comments and the PIP fixture table in this repo.

Both checked before reporting. Results below.

---

## Reachability (defined / imported / invoked are three facts)

READ the writer files and followed imports.

### Flood `geometryCentroid` — DEFINED, IMPORTED, INVOKED

- Defined: `packages/engine-core/src/flood-hazard-fact/geo.ts`.
- Re-exported: `flood-hazard-fact/index.ts`.
- Imported by `write-flood-hazard-fact-county.mjs` from that index.
- Invoked at writer lines 503-510: `geometryCentroid(p.geometry) ?? bbox-midpoint`. Parcel centroids for the JS and PostGIS plan paths go through this call.

Flood centroid is reached. Scope proceeds.

### Well-fact `geometryCentroid` — DEFINED, IMPORTED, NOT INVOKED

- Defined: `packages/engine-core/src/well-fact/geo.ts` (Polygon vertex mean with no closing-vertex de-dup; no MultiPolygon branch, so MultiPolygon falls through to `return null`).
- Re-exported: `well-fact/index.ts`.
- Imported by `write-well-fact-county.mjs` (import list includes `geometryCentroid`).
- READ the entire writer: the identifier never appears after the import. Parcels are pushed with `geometry`, not a computed centroid.
- Followed into `plan-county-well-facts.ts`: it imports `distancePointToPolygonMeters`, `expandBBox`, `haversineMeters`, `metersToLatDegrees`, `metersToLngDegrees`, `pointInGeoJson` from `./geo.js`. It does not import `geometryCentroid`. The planner tests PIP of the well point against parcel geometry.

Canon holds: imported, never called. Did not expand scope. Left the copy in place.

Second mechanism that would look the same: a dynamic call via a renamed local. Rejected because the planner's import list was read and `geometryCentroid` is not in it.

### Special-district `geometryCentroid` — DEFINED, NOT IMPORTED by the writer, NOT INVOKED by the planner

- Defined: `packages/engine-core/src/special-district-fact/geo.ts` (Polygon de-dup via `ringCentroid`; MultiPolygon still silently answers for part one).
- Re-exported: `special-district-fact/index.ts`.
- `write-special-district-fact-county.mjs` import list (READ) does not include `geometryCentroid`. Production path is PostGIS true-geom `ST_Intersects`.
- `plan-county-special-districts.ts` (the JS oracle) imports `buildDistrictSpatialIndex` and types from `./geo.js`, not `geometryCentroid`. Parcels arrive with `centroid` already computed. Tests (`special-district-fact.test.ts`, `special-district-truegeom.test.ts`) pass a centroid in; they do not call `geometryCentroid`.

Canon holds: not imported by the writer. Left the copy in place.

Second mechanism: tests construct centroids with this function. Rejected: both test files were read; they do not call it.

---

## W-5 — SFHA flag (graded with the input type)

Input type: `FloodZoneFeature.sfhaTf: string | null`.

Old predicate: `sfhaTf === "T" || sfhaTf === "t" || sfhaTf === "true"`. Cheapest satisfier on `string | null` is any other string, or null. All of those returned `false`. A hazard flag that fails open.

FEMA domain READ from this repo, not memory:

- `packages/adapters/src/federal/fema-nfhl.ts` lines 112-115: FEMA stamps SFHA_TF as the literal strings T or F.
- `src/__tests__/fixtures/flood-pip-cases.ts` uses only T and F.

The adapter also treats boolean `true` as SFHA. That is a different type than `string | null` and is not a cheapest satisfier of this function. Out of this card's input type.

Replacement: `parseSfhaTf` returns enum `SfhaFlag = "sfha" | "not-sfha"`. Unrecognised (including null, `"Y"`, `"1"`, `""`, `"t"`, `"true"`, `"TRUE"`) raises `UnrecognisedSfhaFlagError`. `isSfhaFlag` is now `parseSfhaTf(...) === "sfha"` and therefore also raises.

`findZoneAtPoint` / grid path: parse EVERY overlapping candidate before preferring.

- Any unrecognised flag: raise. No SFHA preference, no `candidates[0]` fallback.
- Mixed recognised SFHA and non-SFHA: first SFHA in candidate (array) order wins.
- All recognised non-SFHA: first candidate is an honest non-SFHA return.

`.find(isSfhaFlag)` is gone on purpose. Array.find short-circuits: a leading T would hide a later unrecognised sibling. `pickPreferredFloodZone` parses the whole set first.

Callers updated by following the live graph from the flood writer, not by search:

- `geo.ts` `findZoneAtPoint` (live JS linear path)
- `flood-zone-grid.ts` `findZoneAtPointWithGrid` (live JS grid path the writer uses when `planBackend=js`)
- `plan-county-flood-hazard.ts` `assembleCountyFloodHazardPlan` via `isSfhaFlag` (JS and PostGIS both assemble here; a false boolean cannot be written if parse raises)

Named error exported from `flood-hazard-fact/index.ts` so the county writer fail-closes. The writer already wraps plan in try/catch and sets `process.exitCode = 1` before any atom write. Plan throws; apply does not run.

SQL mirror in `postgis-flood-plan.ts` updated from `IN ('T','t','true')` to `sfha_tf = 'T'` so it no longer claims to match a predicate that now raises on `t`/`true`. SQL still cannot raise. See leave_behind.

---

## W-3 / W-4 — third `geometryCentroid` (flood copy only)

Not a winner of the other two. Flood's live function now:

- Point: the point.
- Polygon: de-duplicated vertex mean (`ringCentroid` drops the RFC 7946 closing vertex when first equals last).
- MultiPolygon: `return null` (honest refusal). Explicit branch; not well-fact's silent fallthrough.

Did not edit well-fact or special-district copies.

---

## Proof by violation (VERIFIED)

Environment: vitest 2.1.9 in this worktree, plus a tsx import of the live modules.

`pnpm --filter @hauska-engine/engine-core test -- src/__tests__/flood-geo-failclosed.test.ts src/__tests__/flood-plan-assembly.test.ts src/__tests__/flood-zone-grid.test.ts`

Result: 3 files, 30 tests passed.

`property-fact-writers.test.ts`, `flood-from-plan.test.ts`, JS half of `flood-postgis-pip.test.ts`: passed (8 PostGIS cases skipped; no `FLOOD_POSTGIS_TEST_URL`). Typecheck `tsc --noEmit` exit 0.

Live tsx print (same commit):

```
parseViolations:
  Y    old=false  threw UnrecognisedSfhaFlagError  "unrecognised NFHL SFHA_TF \"Y\"; domain is the literal strings T and F"
  null old=false  threw UnrecognisedSfhaFlagError  "unrecognised NFHL SFHA_TF null; domain is the literal strings T and F"
  1    old=false  threw UnrecognisedSfhaFlagError  "unrecognised NFHL SFHA_TF \"1\"; domain is the literal strings T and F"
overlap two zones flags Y then 1: threw UnrecognisedSfhaFlagError (did not return candidates[0])
centroid closed ring [[0,0],[2,0],[2,2],[0,2],[0,0]]:
  flood third = [1, 1]
  well-fact live dormant copy = [0.8, 0.8]
centroid MultiPolygon two squares:
  flood third = null
  well-fact = null
  (old flood part-one defect copy in the test returns [1, 1])
parseSfhaTf("T") = "sfha"; parseSfhaTf("F") = "not-sfha"
```

Required items:

1. Unrecognised `"Y"`, `null`, `"1"` THROW. Old function in the test (`isSfhaFlagDefect`) returns false for each. Two-plus encodings, not one pass.
2. Two overlapping zones, unrecognised flags: old finder returns `candidates[0]` (`first`). New `findZoneAtPoint` and `findZoneAtPointWithGrid` throw. Additional violation: unrecognised sibling plus a later valid `T` also throws (old finder would prefer the T and hide the bad flag).
3. Closed-ring Polygon: flood `[1,1]`, well-fact `[0.8,0.8]` on the same five-vertex square.
4. MultiPolygon: flood returns null; the kept part-one defect copy returns `[1,1]`.

---

## Second mechanisms (findings)

Finding: old SFHA check failed open.
Second mechanism: production only stores T/F so other encodings never arrive. Rejected: the check is graded with `string | null`, not with an unmeasured corpus. The previous assembly test treated `"TRUE"` as non-SFHA, which is the fail-open specified as if it were a domain.

Finding: `candidates[0]` was a silent SFHA-preference loss.
Second mechanism: zones are loaded `ORDER BY zone_row_id` so array order is "stable enough". Rejected: stability is not a parse. An encoding change still selected an arbitrary overlapping zone.

Finding: flood MultiPolygon answered for part one.
Second mechanism: NFHL zones are 100% MultiPolygon (migration 0073) so this is the intended representative. Rejected: that measurement is about zone polygons, not parcel centroids, and even for zones it is an undeclared degradation. The third implementation refuses.

Finding: well-fact / special-district copies can stay.
Second mechanism: some other production script imports them. Rejected for well-fact by reading the writer and planner; rejected for special-district by reading the writer and planner. Tests of those packages do not call `geometryCentroid`. Unmeasured: other packages outside this import graph. This card did not search the rest of the monorepo to assert absence.

---

## Traps left in place (dormant copies)

1. `packages/engine-core/src/well-fact/geo.ts` `geometryCentroid`: double-counts the closing vertex on every RFC 7946 closed ring. Writer imports it and never calls it. Planner does not import it. MultiPolygon null is honest.
2. `packages/engine-core/scripts/write-well-fact-county.mjs`: dead import of `geometryCentroid`. Looks live from the import line.
3. `packages/engine-core/src/special-district-fact/geo.ts` `geometryCentroid`: Polygon de-dup is correct; MultiPolygon still silently answers for part one. Writer does not import it. JS planner does not call it.

---

## Remaining holes (not this card)

- PostGIS `DISTINCT ON` / hybrid SQL still cannot raise on an unrecognised `sfha_tf`. Unrecognised values order with non-SFHA. `assembleCountyFloodHazardPlan` raises if the *winning* row's flag is unrecognised. If a recognised `T` overlaps an unrecognised sibling, SQL prefers T and JS never sees the sibling. `findZoneAtPoint` parses every overlap; this SQL path does not.
- Writer bbox-midpoint fallback (`geometryCentroid(...) ?? bbox center`) still fires when centroid is null. A MultiPolygon parcel now refuses at centroid and then gets a bbox center unless the writer is changed. **CLOSED by planner 2026-08-20 after review:** the `?? bbox` arm was removed from `write-flood-hazard-fact-county.mjs`. Null centroid now reaches `hasUsableCentroid` → `no-flood-coverage` absence. Violation kept in `flood-geo-failclosed.test.ts` (`writerBboxFallbackDefect` still returns bbox mid; live `geometryCentroid` returns null).
- `--from-plan` drains a baked `inSpecialFloodHazardArea` boolean. It does not re-parse SFHA_TF. B7 corpus stamp, not this card.

---

## Files touched (uncommitted)

- `packages/engine-core/src/flood-hazard-fact/geo.ts`
- `packages/engine-core/src/flood-hazard-fact/flood-zone-grid.ts`
- `packages/engine-core/src/flood-hazard-fact/index.ts`
- `packages/engine-core/src/flood-hazard-fact/postgis-flood-plan.ts` (SQL SFHA predicate aligned to parsed domain T)
- `packages/engine-core/src/__tests__/flood-plan-assembly.test.ts`
- `packages/engine-core/src/__tests__/flood-geo-failclosed.test.ts` (new)

Planner owns commit/PR. Pathspecs above. Do not `git add -A`.

leave_behind:
- item: well-fact/geo.ts dormant geometryCentroid (closed-ring double-count)
  owner: planner
  plan_row: not this card
- item: special-district-fact/geo.ts dormant geometryCentroid (MultiPolygon part-one)
  owner: planner
  plan_row: not this card
- item: write-well-fact-county.mjs unused geometryCentroid import
  owner: planner
  plan_row: not this card
- item: PostGIS overlap does not parse sibling flags
  owner: planner
  plan_row: not B6/B7 of this chain unless separately scoped
- item: writer bbox fallback after null centroid
  owner: planner
  plan_row: not this card
