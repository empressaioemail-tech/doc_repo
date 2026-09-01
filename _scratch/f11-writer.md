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

GROUND-TRUTH 2026-08-31T15:24Z — PR #367 HEAD `243d0f5` on `seat/property-ctx-f11-writer`. CI REST conclusion string `success`. MERGEABLE. Not merged. yaml now `--args=--writer=cad-parcel-roll`; `CAD_PARCEL_ROLL_PATH` removed from deploy env. County not baked. Form verified: `gcloud run jobs deploy --help` `--args=[ARG,...]` comma-separated; first `=` starts the list.

GROUND-TRUTH 2026-08-31T15:20Z — process admit: `--writer=cad-parcel-roll --county=48021` logs `atoms-writer.run-scope` with `scripts/write-cad-parcel-roll-county.mjs` then `MISSING_ENV`. Three refuse arms still exit 2. vitest 36/36.

LESSON — Factory `executeJob` overrides REPLACE template args. `writerArgs()` does not pass `--writer`. After this yaml stamp, a Factory-driven execute that passes only `--county` still fails `WRITER_REQUIRED`. Own Factory card.

DEAD-END — Do not `gcloud run jobs update` to add `--writer`. A-019: templates come from the build config. A changed yaml is not a changed job; read-back after the next build.

OPEN 2026-08-31T15:26Z — After merge: Cloud Build from this yaml, then read back live `factory-atoms-cad` args. Item 3 easement line 191. Factory `writerArgs` `--writer`. Four other writer jobs: own card, not this PR. Setback `--apply` held. Do not merge #367 until operator says so.

GROUND-TRUTH 2026-08-31T15:30Z — PR #367 MERGED as `76b13d1`. CI conclusion string `success` on `243d0f5`.

DEAD-END 2026-08-31T15:33Z — First Cloud Build `d2f60a00` FAILED. PowerShell ate the comma in unquoted `--substitutions=A=x,B=y`, so `_ENGINE_SHA` became `76b13d1 _IMAGE_TAG=76b13d1` and the deploy `--set-env-vars` exited 2. Job stayed generation 2. That submit also retagged `atoms-writer:b402c8b` with the 76b13d1 tree.

LESSON — Quote `--substitutions="A=x,B=y"` on PowerShell. Read the substitutions object from `gcloud builds describe --format=json` before trusting the deploy step.

GROUND-TRUTH 2026-08-31T15:37Z — Build `579fc1d9` status SUCCESS. Live `factory-atoms-cad` generation 3. `containers[0].args` is `["--writer=cad-parcel-roll"]`. No `CAD_PARCEL_ROLL_PATH`. No county. `ENGINE_SHA=76b13d1`. Image `sha256:56bdc23d`. `executionCount` still 8; job was not executed.

OPEN 2026-08-31T15:38Z — Item 3 easement line 191. Factory `writerArgs` must pass `--writer` because execute overrides replace template args. Four other writer jobs: own card. Setback `--apply` held. Tag `b402c8b` is a pin lie after the failed first submit.
