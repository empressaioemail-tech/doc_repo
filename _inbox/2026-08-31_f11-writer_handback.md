# F11-WRITER handback (Wave 2 implementer)

Written 2026-08-31T14:52Z. Do not commit. Supervisor reviews the engine diff.

## Snapshot

- Seat: property worktree, supervised by integration on P:/doc_repo
- Repo: hauska-engine
- Worktree: P:/seat-worktrees/property/hauska-engine-f11-setback
- Branch: seat/property-ctx-f11-writer
- HEAD: 80fb9069fc8aec22de5c9d578cd4013bb31583a7 (origin/main; PR #366)
- Dirty (uncommitted, this card):
  - M packages/engine-core/package.json
  - M packages/engine-core/scripts/atoms-writer-job.mjs
  - M packages/engine-core/src/__tests__/atoms-writer-job-env.test.ts
  - ?? packages/engine-core/scripts/atoms-writer-allowlist.mjs
  - ?? packages/engine-core/scripts/write-setback-city.mjs
  - ?? packages/engine-core/src/setback-writer/city-binding.ts
  - ?? packages/engine-core/src/setback-writer/plan-city-setback.ts
  - ?? packages/engine-core/src/setback-writer/index.ts
  - ?? packages/engine-core/src/setback-writer/__tests__/plan-city-setback.test.ts

## Files changed (paths only)

- packages/engine-core/package.json
- packages/engine-core/scripts/atoms-writer-job.mjs
- packages/engine-core/scripts/atoms-writer-allowlist.mjs
- packages/engine-core/scripts/write-setback-city.mjs
- packages/engine-core/src/__tests__/atoms-writer-job-env.test.ts
- packages/engine-core/src/setback-writer/city-binding.ts
- packages/engine-core/src/setback-writer/plan-city-setback.ts
- packages/engine-core/src/setback-writer/index.ts
- packages/engine-core/src/setback-writer/__tests__/plan-city-setback.test.ts

## Tests run

- Command: `pnpm --filter @hauska-engine/engine-core exec vitest run src/__tests__/atoms-writer-job-env.test.ts src/setback-writer/__tests__/plan-city-setback.test.ts`
- Cwd: P:/seat-worktrees/property/hauska-engine-f11-setback
- Result: 2 files passed, 33 tests passed, 0 failed
- Counting rule: one count per vitest `it()` in the two named files. Exclusion set: every other engine-core suite (not run). Both directions: negative process refusals and positive parse/binding/plan cases.

## What was violated on purpose

Process spawns of `node packages/engine-core/scripts/atoms-writer-job.mjs` (cwd engine worktree). Each falsifier: if CAD spawned or exit was 0, the card failed.

| Invocation | Exit | stderr reason |
|---|---|---|
| no --writer, no WRITER_NAME | 2 | `{"event":"atoms-writer.refused","code":"WRITER_REQUIRED"}` |
| `--writer=not-a-writer` | 2 | `{"event":"atoms-writer.refused","code":"WRITER_NOT_ALLOWLISTED"}` |
| `--writer=cad-parcel-roll` without --county | 2 | `{"event":"atoms-writer.refused","code":"COUNTY_REQUIRED"}` |
| `write-setback-city.mjs --city=elgin-tx` (SETBACK_PATH=1, no county) | 2 | `{"event":"setback-city.refused","code":"COUNTY_REQUIRED","county":null}` |

Helpers (no spawn): `--county=48021` resolves 48021. `applyWriterPathEnv` on well-fact does not set CAD_PARCEL_ROLL_PATH. cad-parcel-roll sets only CAD_PARCEL_ROLL_PATH and clears the other PATH guards. Placeholder setback-rule input refuses PLACEHOLDER_COLLISION. Unincorporated plans not-applicable. In-city smithville (no table) plans unmeasured, never not-applicable. --apply on the setback writer refuses SETBACK_APPLY_HELD.

## Item 3 status

handed back. Not done. Do not half-break the fetch.

- File: packages/engine-core/scripts/write-utility-easement-county.mjs
- Live HTTP: `fetchCityLimitParcels` lines 168-221, `fetch()` at line 191. `fetchMunicipalEasements` lines 155-166 also live-REST via `fetchCadEasementFeatures`.
- Call sites: cad-easement-rest path lines 319-326 (`fetchCadEasementFeatures`); municipal-easement-rest path lines 342-343 (`fetchCityLimitParcels` then `fetchMunicipalEasements`).
- Landed-bytes path should be: read staged features from a landing/staging table keyed by county (same shape as write-well-fact-county.mjs `fetchRrcWellsFromStagedTable` / `stagedWellTableExists`). Refuse LANDING_EMPTY when the table is absent or the county has zero rows. Do not HTTP to ArcGIS at write time.

## leave_behind

- item: easement writer live ArcGIS fetch (Item 3)
  owner: property / next F-11 leftover card
  plan_row: F-11
- item: setback --apply held (SETBACK_APPLY_HELD). Conformant chunk/lease/run_event is planned in dry-run only.
  owner: property
  plan_row: F-11
- item: Factory WRITER_JOBS stub is out of this card
  owner: factory seat
  plan_row: F-02

## Fleet memory

LESSON — Cloud Run cannot override command. The engine allowlist in atoms-writer-allowlist.mjs is the job form. Factory naming f11-setback does not select a child script.

LESSON — Selection must run before requireWriterEnv. Otherwise a missing writer is reported as MISSING_ENV and the allowlist never fires.

DEAD-END — Importing atoms-writer-job.mjs (shebang entry) from vitest threw SyntaxError: Invalid or unexpected token. Helpers live in atoms-writer-allowlist.mjs. Process refusals still spawn the job file.

GROUND-TRUTH 2026-08-31T14:50Z — vitest 33/33 pass on the two named files. Process refusals exit 2 with WRITER_REQUIRED / WRITER_NOT_ALLOWLISTED / COUNTY_REQUIRED. HEAD still 80fb906; no commit.

GROUND-TRUTH 2026-08-31T14:51Z — austin-tx table exists but has no county membership in staging or the jurisdiction registry. Binding refuses JURISDICTION_BINDING_UNRESOLVED rather than inventing Travis 48453.

OPEN — Item 3 easement landed-bytes read. Setback apply still held. Existing factory-atoms-cad jobs must pass --writer=cad-parcel-roll or WRITER_NAME=cad-parcel-roll; silent CAD default is gone.

## Close fields

- missionPremise: Cloud Run cannot override command. atoms-writer-job.mjs hardcoded write-cad-parcel-roll-county.mjs and set CAD_PARCEL_ROLL_PATH=1 unconditionally. That is why four of five writers have no job form. The setback writer did not exist. Conformant stage-and-merge, city-scoped, refuse on unresolved binding. Apply is held.
- completionPredicate: Allowlist keyed by writer name; unknown or absent writer name refuses non-zero with a named reason and never defaults to CAD. CAD_PARCEL_ROLL_PATH is a property of the selected writer. --name=value and spaced forms both parse. Missing county refuses. Off-default execution reads run scope back. Setback writer exists, city-scoped, conformant chunked stage-and-merge plan, refuses missing county / unresolved binding / unnamed rule set / unresolvable district. Never not-applicable on an in-city parcel. Negative runs prove allowlist and county parse refuse. No --apply.
- completionPredicateStatus: met for items 1 and 2. Item 3 handed back.
- scopeBasis: hauska-engine this clone only. Item 1 first. Item 2 the setback writer. Item 3 optional and handed back. Factory allowlist out of this card. Do not apply.
