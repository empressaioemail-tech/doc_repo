# S-22 RETURN — geometry denominator retirement

Snapshot: repo `legacy-design-tools`, worktree `P:/tmp/mp-a3-s22-card`, branch `fix/s22-geometry-denominator`, commit `1a55566b057f8db4b888d007009c7fcaf84031d7` (HEAD confirmed before edits; still HEAD after; no commit).

Worker A3. Planner owns commit/PR. No `git add`, commit, push, or PR.

## Pre-registered ways this output could be wrong

1. Collapse retired-rows-with-unknown-denominator into unspecified-never-measured (`kind: "none"` or `kind: "unspecified"`). Checked before reporting: geometry stays `atom-count-over-parcel-features` / `entityType: "parcel-node"`; `denominator.kind` is `retired-unknown-denominator`; it is in `retiredDenominatorRails()` and in neither `scoreableRailKeys()` nor `unspecifiedRails()`. Roads still uses `none` / "no measurement spec yet".
2. Ship a divergence test that is internal consistency (registry.kind === a constant copied into the test). Checked before reporting: `EXECUTED_PARCEL_FEATURE_DENOMINATOR_KIND` lives in `measure.ts` next to `readParcelFeatureCount`; the test reads `measure.ts` and requires `count(DISTINCT feature_index)` inside that function; scoreable rails' `rule.denominator` is compared to that executed kind and SQL fragment.

Both were checked. Both would have been the S-22 defect class if they had shipped.

## What changed (one PR, three parts)

### (i) Retire geometry's declared denominator

READ `registry.ts` in full. The geometry rule at the parcel-feature constant was a machine-readable claim that live rows were computed against `txgio-parcel-distinct-feature-index`. The notes already said they were not (accounted features; producer `B2_cp2_geometry_scorer_apply.mjs` not in repo).

- Added `DenominatorKind` variant `retired-unknown-denominator`. Distinct from `none` (unspecified-never-measured; roads / footprint / easement / rrc-* / rail-corridor / mud).
- Geometry `denominator.kind` is now `retired-unknown-denominator`. Historical `notes` kept verbatim, including the "253 live geometry rows" sentence (S-21 evidence trail). Added a retirement line: live geometry rows are **254 over 254 distinct county FIPS**, not 253; 253 was a different rail's figure. Source: `_inbox/2026-08-20_db_probe_five_answers.md` Q2 (READ from `P:/doc_repo`; not re-queried here — not VERIFIED by this worker).
- Did not invent a geometry scorer. `isScoreableRule` now requires a live counting denominator. `measureRailCell` throws `RailNotMeasurableError` reason `denominator_retired` **before** the kind switch, so an atom-count typed geometry rule cannot reach `readParcelFeatureCount`. Engine refuses retired the same way, without calling it unspecified.

Provenance copy sites (READ, unchanged): `engine.ts` ~189 copies `rule.denominator.kind` into the provenance string; `run.ts` ~303 copies it into the run report; `countyRailScoreCli.ts` ~193 prints it. They never compute. That is why (i) was possible and why (iii) exists.

### (ii) Meaning-shaped denominator check

Replaced `expect(kind).toBeTruthy()` + `expect(basis.trim().length).toBeGreaterThan(10)`.

Cheapest satisfier of the old check: kind `"x"`, basis of eleven characters. The new helper rejects that.

- Geometry must be `retired-unknown-denominator` and must not claim a live counting kind.
- Unspecified-never-measured must stay `none`.
- Live reconstructible rails (flood, cad, landuse, owner, zoning, envelope) must declare the executed parcel-feature kind and a basis containing the SQL `measure.ts` runs.

### (iii) Divergence between `rule.denominator` and `measure.ts`

Independently derived: registry field vs `measure.ts` dispatch/query.

- `readParcelFeatureCount` executes `count(DISTINCT feature_index)` (READ the function; VERIFIED the test extracts that slice and requires the SQL).
- `measureAtomCount` / `measureColumnStamp` / `measureColumnConjunction` all call it (READ; VERIFIED by source slice).
- `measureRailCell` refuses `retired-unknown-denominator` before `switch (rule.kind)` (READ; VERIFIED by source order and by executing `measureRailCell` against a query-boom double).
- Flood, cad, landuse, owner, zoning, envelope must declare that executed denominator.
- Geometry claiming that executed kind is a test failure.

A check that only asserted `registry.kind === "txgio-parcel-distinct-feature-index"` as a copied constant in the test would not have caught measure.ts changing the SQL. The SQL lives in measure.ts; the name is exported from measure.ts next to the function; the registry is the other source.

## Violation proofs (environment: vitest in this worktree)

After a green run, registry.ts was mutated, tests run, then restored. Fixture tests that permanently encode the same mutations remain in `registry.test.ts`.

**Violation 1 — geometry given `PARCEL_FEATURE_DENOMINATOR` again.** Four tests failed:

- completeness: `geometry claims live counting kind 'txgio-parcel-distinct-feature-index' while its live rows are retired`
- partition: `retired.has("geometry")` was false
- divergence: `geometry claims the denominator measure.ts would execute (txgio-parcel-distinct-feature-index) while its live rows are retired`
- `measureRailCell throws denominator_retired`: got `Error: must not query: retired geometry must fail before I/O` instead of `RailNotMeasurableError` — the measurer would have executed the parcel-feature count

**Violation 2 — flood given `kind: "x"`, basis `"12345678901"` (eleven chars).** Two tests failed:

- completeness: `flood declares denominator.kind 'x' but measure.ts executes 'txgio-parcel-distinct-feature-index'` and `flood basis does not contain the SQL measure.ts executes (count(DISTINCT feature_index))`
- divergence: same flood drift against measure.ts

The old presence-shaped check would have passed violation 2. Registry restored; focused suite green afterwards.

## Focused tests — VERIFIED

```
pnpm exec vitest run src/lib/railScoring/registry.test.ts \
  src/lib/railScoring/engine.test.ts \
  src/lib/railScoring/run.test.ts \
  src/lib/railScoring/provenance.test.ts \
  src/routes/countyRailScore.test.ts
```

86 passed / 0 failed (countyRailScore.test.ts needs `DATABASE_URL` set to any string so `@workspace/db` can import; dummy `postgres://unused:unused@localhost:5432/unused` used; no database was contacted).

## Findings, with second mechanisms

**Finding.** Geometry's machine-readable `denominator` claimed `txgio-parcel-distinct-feature-index` while live rows were accounted-features from a lost producer.
Second mechanism that would look the same: the notes were wrong and the live rows really were parcel-feature counts. Rejected: notes name `denom=accounted` on `artifact_path` and a producer that is not in the repo (READ); Q2 (READ) confirms 254 geometry rows, which does not make the denominator match.

**Finding.** 253 in the geometry notes is a different rail's figure; live population is 254/254 FIPS.
Second mechanism: 253 counties plus one non-county entity. Rejected: Q2 says "zero non-county entities. One row per Texas county, complete" (READ, not re-queried). Historical "253" left in the notes; correction recorded in the S-22 retirement line only.

**Finding.** `registry.test.ts` ~77-78 was presence-shaped.
Second mechanism: TypeScript's `DenominatorKind` union already forbade `"x"`. Rejected: `as DenominatorKind` / `as const` bypass exists; the runtime check was `toBeTruthy()`; violation 2 ran as JavaScript and the old check would not have fired.

**Finding.** Declared denominator never bound to executed query, so (i) could exist.
Second mechanism: provenance copy sites were supposed to be the bind. Rejected: READ engine.ts / run.ts / countyRailScoreCli.ts — they copy `rule.denominator.kind` into a string. Copying a declaration is not executing it. measure.ts always called `readParcelFeatureCount` regardless of `rule.denominator`.

## Leave behind

leave_behind: none

(No new scorer, no parallel store, no branch besides this worktree's `fix/s22-geometry-denominator`. S-21 re-derivation is a different card and was not started.)

## Files (uncommitted)

- `artifacts/api-server/src/lib/railScoring/registry.ts`
- `artifacts/api-server/src/lib/railScoring/registry.test.ts`
- `artifacts/api-server/src/lib/railScoring/measure.ts`
- `artifacts/api-server/src/lib/railScoring/engine.ts`
- `artifacts/api-server/src/lib/railScoring/engine.test.ts`
- `artifacts/api-server/src/lib/railScoring/run.test.ts`
- `artifacts/api-server/src/countyRailScoreCli.ts`
- `artifacts/api-server/src/routes/countyRailScore.ts`
- `artifacts/api-server/src/routes/countyRailScore.test.ts`

READ vs VERIFIED: registry / measure / engine / run / CLI provenance copy sites / Q2 probe doc = READ. Tests and both violation runs = VERIFIED. Live 254/254 geometry population = READ from Q2, not re-queried.
