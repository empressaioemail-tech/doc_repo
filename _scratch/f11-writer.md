# F11-WRITER scratch (Wave 2)

OPEN 2026-08-31T14:35Z — Wave 2 F11-WRITER (F-11, F-02). Allowlist first, then city-scoped conformant setback writer. No apply.

GROUND-TRUTH 2026-08-31T14:32Z — hauska-engine clone `P:/seat-worktrees/property/hauska-engine-f11-setback` branch `seat/property-ctx-f11-writer` HEAD `80fb906` (PR #366 merge). Clean. `atoms-writer-job.mjs` still hardcodes `write-cad-parcel-roll-county.mjs` and sets `CAD_PARCEL_ROLL_PATH=1` unconditionally.

GROUND-TRUTH 2026-08-31T14:30Z — Factory allowlist (`src/control/writer-allowlist.mjs`) already names `f11-setback` as a stub. That is not a job form. Cloud Run cannot override command; the engine entrypoint is the defect.

LESSON — four of five writers have no job form because one file hardcodes the CAD child. Factory WRITER_JOBS naming `f11-setback` does not start the engine writer.

DEAD-END — do not treat the Factory allowlist stub as the F-11 writer. Writers live in `hauska-engine/packages/engine-core/scripts/`.

GROUND-TRUTH 2026-08-31T14:54Z — supervisor re-ran vitest 33/33. Process: no writer → WRITER_REQUIRED exit 2; unknown → WRITER_NOT_ALLOWLISTED exit 2; cad without county → COUNTY_REQUIRED exit 2; setback --city=elgin-tx without county → COUNTY_REQUIRED. HEAD 80fb906 plus dirty tree.

LESSON — selection must run before requireWriterEnv. A missing writer reported as MISSING_ENV means the allowlist never fired.

OPEN — factory-atoms-cad must pass --writer=cad-parcel-roll before the next execute. Setback apply held. Item 3 easement live-fetch handed back. Planner commit after operator go.

GROUND-TRUTH 2026-08-31T14:50Z — implementer finished items 1 and 2 uncommitted on `seat/property-ctx-f11-writer` HEAD `80fb906`. vitest 33/33. Process refusals exit 2: WRITER_REQUIRED, WRITER_NOT_ALLOWLISTED, COUNTY_REQUIRED. CAD_PARCEL_ROLL_PATH is only set for writer cad-parcel-roll.

GROUND-TRUTH 2026-08-31T14:51Z — austin-tx setback table exists but has no county membership in zoning staging or the jurisdiction registry. Binding refuses JURISDICTION_BINDING_UNRESOLVED. Do not invent Travis 48453.

LESSON — Selection must run before requireWriterEnv. Otherwise a missing writer is reported as MISSING_ENV and the allowlist never fires.

LESSON — Existing factory-atoms-cad jobs must pass `--writer=cad-parcel-roll` or `WRITER_NAME=cad-parcel-roll`. The silent CAD default is gone.

DEAD-END — Importing `atoms-writer-job.mjs` (shebang entry) from vitest threw `SyntaxError: Invalid or unexpected token`. Helpers live in `atoms-writer-allowlist.mjs`. Process refusals still spawn the job file.

OPEN 2026-08-31T14:52Z — Item 3 not done. `write-utility-easement-county.mjs` `fetchCityLimitParcels` live-fetches at line 191; cad path live-fetches at 319-326. Landed-bytes path: staged table like well-fact, refuse LANDING_EMPTY. Do not half-break the fetch. Setback `--apply` refuses SETBACK_APPLY_HELD.
