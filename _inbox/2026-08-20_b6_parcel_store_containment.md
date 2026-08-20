# RETURN-B6.md — worker B6 (containment store gate)

SNAPSHOT: repo hauska-engine, commit d3f37949003fae5a99a82b62956352b7dcaa1022, worktree P:/tmp/mp-b-flood-chain, branch fix/flood-geo-failclosed.

HEAD confirmed VERIFIED: `git rev-parse HEAD` printed `d3f37949003fae5a99a82b62956352b7dcaa1022`. No commit, no push, no `git add`. Did not start B7. No production writes. No stamp --apply. No UPDATE. B5 files left in place (geo.ts fail-closed SFHA, MultiPolygon centroid null, writer bbox fallback still absent).

---

## Pre-registered ways this output could be wrong (before the edit)

1. The classifier still accepts geometry from the caller, so tests can pass the same GeoJSON as both the point source and the ring. Check: read `classifySamplePointContainment` end to end. Signature is `(point, ref, store)`. There is no geometry argument. Passing the atom ring as `store` throws.
2. A missing ring is collapsed into `not-contained`, or a not-contained point is still emitted as present. Check: two distinct violations observed failing, and plan-path atoms for those parcels have length 0.

Both checked before reporting. Results below.

---

## What was built

A store-gated containment check on a finite point. B5 already routes a null centroid to typed absence. This is the second gate: the point that will be asked of FEMA must sit inside the parcel ring loaded from the parcel store.

Three states, never collapsed: `contained` / `not-contained` / `unmeasurable`.

Classifier and policy stay split. `classifySamplePointContainment` answers a question about the world. `floodDeterminationGate` answers what we will publish. `not-contained` refuses. `unmeasurable` on a finite point refuses. They do not become present flood determinations.

Did not import W-17's `classifySamplePointContainment(point, geometry)`. That is the contaminated harness: tests passed the same `C_SHAPED_PARCEL` to centroid and check. Did not import `deriveFloodSamplePoint` (it still has the bbox-centre fallback B5/planner removed from the writer).

---

## Store demonstration (READ, then VERIFIED)

Production adapter: `packages/engine-core/src/flood-hazard-fact/txgio-parcel-ring-store.ts`. It SELECTs `geometry` from `txgio_parcel`, keyed by `county_fips` plus `prop_id` or `feature_index`. Not `hauska_mcp.atoms`. No parcel-node table. Writer keying is unchanged: `prop_id ?? '_feature-${feature_index}'`.

The live single-row SQL (the constants `sql.unsafe` actually runs):

```
SELECT geometry
FROM txgio_parcel
WHERE county_fips = $1
  AND prop_id = $2
ORDER BY feature_index
LIMIT 1
```

```
SELECT geometry
FROM txgio_parcel
WHERE county_fips = $1
  AND feature_index = $2
  AND prop_id IS NULL
ORDER BY feature_index
LIMIT 1
```

County writer prefetch (second query, not the centroid page's GeoJSON objects):

```
SELECT DISTINCT ON (feature_index)
       feature_index, prop_id, geometry
FROM txgio_parcel
WHERE county_fips = $1
  AND (
    prop_id = ANY($2::text[])
    OR (prop_id IS NULL AND feature_index = ANY($3::int[]))
  )
ORDER BY feature_index
```

Writer (READ): after the centroid page, `loadTxgioParcelRingStore(sql, args.county, parcels.map(p => p.parcelKey))`, then `ringStore` is required on both `planCountyFloodHazard` and `planCountyFloodHazardPostgis`. Omitting it throws. The mjs writer cannot skip the gate by accident.

Store-vs-atom test (VERIFIED): `src/__tests__/flood-sample-point-containment.test.ts` "returns not-contained when the store ring excludes a point the atom ring contains". ATOM_RING contains POINT. STORE_RING does not. They are different objects. The W-17 defect copy `classifyContaminated(point, ATOM_RING)` returns `contained` (would go green under contamination). Live `classifySamplePointContainment(point, ref, store)` returns `not-contained` (goes red under the store gate).

---

## Proof by violation (VERIFIED)

Environment: vitest 2.1.9 in this worktree, plus a tsx import of the live modules. Same commit as the snapshot.

`pnpm --filter @hauska-engine/engine-core exec vitest run src/__tests__/flood-sample-point-containment.test.ts src/__tests__/flood-plan-assembly.test.ts src/__tests__/flood-from-plan.test.ts src/__tests__/flood-geo-failclosed.test.ts src/__tests__/property-fact-writers.test.ts`

Result: 5 files, 59 tests passed (includes B5's 12 fail-closed tests, unaltered). Typecheck `tsc --noEmit` exit 0. PIP JS half 3 passed / 8 skipped (no FLOOD_POSTGIS_TEST_URL).

Live tsx print (same commit):

```
atomContainsPoint true
storeContainsPoint false
sameObject false
VIOLATION1 not-contained refuse sample-point-outside-parcel
VIOLATION2 unmeasurable refuse parcel-ring-unmeasurable
V2_not_collapsed_to_not_contained true
storeSource txgio_parcel
fallback_to_geometry_arg THREW classifySamplePointContainment requires a ParcelRingStore; the ring must not travel with the caller
```

Required items:

1. Out-of-parcel point → `not-contained`, gate `refuse` / `sample-point-outside-parcel`. Observed failing.
2. Missing ring → `unmeasurable`, not `not-contained`, gate `refuse` / `parcel-ring-unmeasurable`. Observed failing. A loaded two-vertex ring is the second unmeasurable path (`ring-unusable`), still not `not-contained`.
3. Plan path: both cases produce `plan.planned === []`, `counts.present === 0`, `buildAtomsForFloodHazardPlan` length 0. Present records are typed `samplePointContainment: "contained"` so `not-contained` cannot be constructed as a published present record.

Did not claim a live 229 Bastrop count. That is B7.

---

## Graded with the input type

`classifySamplePointContainment(point: LngLat | null | undefined, ref: ParcelRingRef, store: ParcelRingStore)`.

Ring input type is `ParcelRingLoad = { status: "present"; geometry: unknown } | { status: "absent" }`. Absent is not an empty geometry. Present with zero testable outer rings is `unmeasurable` (`ring-unusable`), not `not-contained`.

The cheapest contamination on a `(point, geometry)` classifier is passing the same GeoJSON as both sides. That signature is gone. The cheapest remaining cheat is passing the atom ring as `store`. That throws (`getRing` is not a function).

---

## Wire into the live plan path

`selectPlannableParcels` requires `ringStore`. Finite centroids are classified before any zone lookup. `isQueryableParcel` is `hasUsableCentroid && gate.decision === "emit"`. Refused parcels never reach FEMA JS or PostGIS.

`assembleCountyFloodHazardPlan` puts refusals in `plan.refused`, never in `plan.planned`. Atoms are built only from `planned`. Null centroid still follows B5 absence and is not counted as a containment class.

---

## Second mechanisms (findings)

Finding: POINT vs STORE_RING is `not-contained`.
Second mechanism: `pointInGeoJson` is inverted and everything is outside. Rejected: the same point against ATOM_RING is inside (`atomContainsPoint true`).

Finding: missing ring is `unmeasurable`.
Second mechanism: the memory store defaults to a world-containing ring, so a miss would look contained. Rejected: `getRing` on an unknown key returns `{ status: "absent" }`; the observed state is `unmeasurable`, and `not-contained` was asserted false.

Finding: the store gate is real.
Second mechanism: tests still pass the same object as centroid source and ring. Rejected: ATOM_RING !== STORE_RING; the contaminated copy returns `contained` on ATOM_RING; the live check returns `not-contained`.

Finding: B5 bbox fallback stayed gone.
Second mechanism: `deriveFloodSamplePoint` was copied in and reintroduced bbox-centre. Rejected: that function was not imported. `geometryCentroid(p.geometry) ??` is still absent from the writer (READ).

---

## Three-question gate

1. What executes this? `selectPlannableParcels` → `classifySamplePointContainment` → `floodDeterminationGate`. Writer executes `loadTxgioParcelRingStore` then both plan backends. Not a person.
2. What triggers it? Every finite-point parcel in a flood county plan (JS and PostGIS).
3. What fails when violated? Gate `refuse`; parcel never enters `plan.planned`; atoms length 0; omitting `ringStore` throws. Running today in this worktree's tests. Not deployed production (no apply).
4. What bypasses it? `--from-plan` drains baked `planned[]` and does not re-run containment. That is a leave_behind, same shape as B5's note that `--from-plan` does not re-parse SFHA_TF.

---

## Files touched (uncommitted, on top of B5)

New:
- `packages/engine-core/src/flood-hazard-fact/containment.ts`
- `packages/engine-core/src/flood-hazard-fact/txgio-parcel-ring-store.ts`
- `packages/engine-core/src/__tests__/flood-sample-point-containment.test.ts`
- `RETURN-B6.md` (this file). `RETURN.md` is still B5's.

Edited (B5 preserved):
- `packages/engine-core/src/flood-hazard-fact/plan-county-flood-hazard.ts`
- `packages/engine-core/src/flood-hazard-fact/postgis-flood-plan.ts` (SFHA SQL still `z.sfha_tf = 'T'`)
- `packages/engine-core/src/flood-hazard-fact/index.ts`
- `packages/engine-core/src/flood-hazard-fact/plan-payload.ts` (`--from-plan` fills empty `refused`)
- `packages/engine-core/scripts/write-flood-hazard-fact-county.mjs` (bbox fallback still removed; ring store loaded as a second query)
- tests: flood-plan-assembly, flood-from-plan, property-fact-writers, flood-postgis-pip

Planner owns commit/PR. Pathspecs above. Do not `git add -A`.

leave_behind:
- item: --from-plan drain does not re-run containment
  owner: planner
  plan_row: not B7 of this chain unless separately scoped
- item: no live Bastrop / 229 count
  owner: B7
  plan_row: B7
- item: PostGIS overlap still does not parse sibling SFHA flags (B5 hole)
  owner: planner
  plan_row: not this card
