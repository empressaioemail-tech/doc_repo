# L2 Wave 0 — loaded-record fix + Kenedy re-proof

Date: 2026-08-08 (America/Chicago; merge UTC 2026-08-09T00:40:14Z)
Status: PASS
County: 48261 Kenedy ONLY (no other county ingested)

## Blocker 1 — store-derived loaded-record

Changed on branch `fix/txgio-loaded-from-store` from `origin/main` (worktree `P:\legacy-design-tools-wave0`; did NOT commit on `feat/fema-nfhl-statewide-layer`).

- `storeLoadedLabel(rowsExisting)` / `storeListLoadState` / `listLoadedCountyFips` added in `lib/cad-ingest/src/txgio/ingest.ts`
- CLI summary `loaded before` uses `storeLoadedLabel(rowsExisting)` (yes when >0, no when 0, unknown when null / no DATABASE_URL)
- `--list` queries DISTINCT `county_fips` from `txgio_parcel` when DATABASE_URL set; labels UNKNOWN when absent (never pretends hand map is store truth)
- `TXGIO_COUNTIES` retained for `jurisdictions.ts` composition; split documented in `counties.ts` comments
- Unit tests in `lib/cad-ingest/src/__tests__/txgio.test.ts` (local vitest: 72 passed)

PR: https://github.com/empressaioemail-tech/legacy-design-tools/pull/399
Merge commit: `fb6a42b22d7855b08d6d5de228f41eba298e2629`
CI run: https://github.com/empressaioemail-tech/legacy-design-tools/actions/runs/31286138409
CI conclusion STRING (required gate): `success`
Jobs: Typecheck conclusion=`success`; Test conclusion=`success`

## Blocker 2 — Node TLS on Windows vs TxGIO

Node v24.11.1. Probes (worker, county 48261 only):

1. Baseline Node fetch: FAIL `UNABLE_TO_VERIFY_LEAF_SIGNATURE`
2. `NODE_OPTIONS=--use-system-ca`: SUCCESS status 200, streamed 334740 bytes
3. `NODE_TLS_REJECT_UNAUTHORIZED=0`: SUCCESS (workaround only; NOT wired as library default)
4. Python urllib: SUCCESS 334740 bytes

Resolution: WAVE RECIPE uses `$env:NODE_OPTIONS='--use-system-ca'` (Node flag; system CA). No permanent global TLS disable in `download.ts`. Fallback: Python pre-download + `--file=`. `NODE_TLS_REJECT_UNAUTHORIZED=0` is FINDING D1-workaround only if system-ca fails.

Proved live: dry-run/apply downloaded Kenedy zip under `NODE_OPTIONS=--use-system-ca`.

## Kenedy 48261 re-proof (VERBATIM CLI)

Env: worktree fix branch / local build; DATABASE_URL from `DEPLOYMENT_DATABASE_URL` (legacy-design-tools-prod); NODE_OPTIONS=--use-system-ca.

### Dry-run

```
[txgio-ingest] ---- ingest summary (DRY RUN — nothing written) ----
[txgio-ingest] county:           48261 (Kenedy)
[txgio-ingest] loaded before:    yes
[txgio-ingest] source file:      stratmap25-landparcels_48261_lp.zip
[txgio-ingest] source vintage:   stratmap25-landparcels_48261_kenedy_202503
[txgio-ingest] source CRS:       wgs84-geographic
[txgio-ingest] features read:    538
[txgio-ingest] features parsed:  538
[txgio-ingest] features would load: 538
[txgio-ingest] rows would delete:  2400
[txgio-ingest] rows would insert:  2400 (one per intersecting grid cell)
[txgio-ingest] features skipped: 0 (no polygon geometry)
[txgio-ingest] duration:         1.0s
```

### Apply 1

```
[txgio-ingest] replacing existing 48261 rows (2400 present) — delete + load run in ONE transaction
[txgio-ingest] ---- ingest summary ----
[txgio-ingest] county:           48261 (Kenedy)
[txgio-ingest] loaded before:    yes
[txgio-ingest] features read:    538
[txgio-ingest] features parsed:  538
[txgio-ingest] features load: 538
[txgio-ingest] rows delete:  2400
[txgio-ingest] rows insert:  2400 (one per intersecting grid cell)
[txgio-ingest] duration:         7.4s
```

### Apply 2 (idempotency)

```
[txgio-ingest] replacing existing 48261 rows (2400 present) — delete + load run in ONE transaction
[txgio-ingest] ---- ingest summary ----
[txgio-ingest] county:           48261 (Kenedy)
[txgio-ingest] loaded before:    yes
[txgio-ingest] features load: 538
[txgio-ingest] rows delete:  2400
[txgio-ingest] rows insert:  2400 (one per intersecting grid cell)
[txgio-ingest] duration:         7.4s
```

Dry predicts apply exactly: features 538/538, delete 2400/2400, insert 2400/2400. match=true.

## SQL verification (VERBATIM)

```
SELECT count(*) FROM txgio_parcel WHERE county_fips='48261';
[{"n":2400}]
SELECT count(DISTINCT county_fips) FROM txgio_parcel;
[{"n":20}]
SELECT EXISTS(SELECT 1 FROM txgio_parcel WHERE county_fips='48261') AS store_loaded;
[{"store_loaded":true}]
```

## git status — legacy-design-tools (P:\legacy-design-tools) VERBATIM

```
On branch fix/county-rail-refresh
Your branch is behind 'origin/main' by 2 commits, and can be fast-forwarded.
  (use "git pull" to update your local branch)

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
  (commit or discard the untracked or modified content in submodules)
	modified:   .claude/worktrees/recon-add-jurisdiction (untracked content)
	modified:   .claude/worktrees/track-b-ifc-ingest (modified content, untracked content)
	modified:   artifacts/api-server/data/opportunity-zones/oz-test.geojson
	modified:   artifacts/api-server/src/routes/countyLedger.ts
	modified:   lib/db/src/schema/index.ts

Untracked files:
  (use "git add <file>..." to include in what will be committed)
	.tmp_nfhl_48.zip
	.tmp_nfhl_head.zip
	.tmp_nfhl_tail.zip
	artifacts/api-server/data/county_manifest_seed.generated.sql
	artifacts/api-server/src/countyRailRefreshCli.ts
	lib/db/src/schema/countyRailDimension.ts

no changes added to commit (use "git add" and/or "git commit -a")
```

Note: Wave 0 executed in worktree `P:\legacy-design-tools-wave0` (post-merge on main @ fb6a42b2). Primary checkout above was not the Wave 0 branch and was left untouched for unrelated dirty work.

### Wave 0 worktree status (after merge)

```
On branch main
Your branch is up to date with 'origin/main'.

Untracked files:
  (use "git add <file>..." to include in what will be committed)
	.tmp_wave0_tls/

nothing added to commit but untracked files present (use "git add" to track)
```

```
fb6a42b2 Merge pull request #399 from empressaioemail-tech/fix/txgio-loaded-from-store
71e67b62 fix(txgio): derive CLI loaded-record from store, not hand map
76905c0a feat(txgio): opt-in EPSG:3857 reprojection to unblock the 202505 vintage (#397)
```

## Wave recipe (for later waves)

```powershell
cd P:\legacy-design-tools   # or a clean worktree on main
$env:NODE_OPTIONS='--use-system-ca'
$env:DATABASE_URL = (gcloud secrets versions access latest --secret=DEPLOYMENT_DATABASE_URL --project legacy-design-tools-prod)
pnpm --filter @workspace/cad-ingest txgio-ingest -- --county=<FIPS> --dry-run
# halt if dry metrics != expected apply; then:
pnpm --filter @workspace/cad-ingest txgio-ingest -- --county=<FIPS>
```

Do NOT set NODE_TLS_REJECT_UNAUTHORIZED=0 as default. Do NOT start Wave 1 from this artifact.
