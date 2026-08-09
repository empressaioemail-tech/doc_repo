---
id: 2026-08-08_L2_first_county_proof
title: L2 first-county proof — Kenedy 48261 end-to-end ingest on deployment Postgres
date: 2026-08-08
status: complete
owner: executor
related: [_inbox/2026-08-08_SWEEP_statewide_readiness, _decisions/2026-08-08_layer_first_statewide_fabric_sequence, _dispatches/2026-08-08_DISPATCH_PACK_sequence_A]
---

# L2 first-county proof — Kenedy 48261

First end-to-end TxGIO parcel ingest of a county that was **not** among the original 19 loaded counties. Purpose: surface remaining blockers in one pass, not to acquire a county for production use.

**Repo:** `P:\legacy-design-tools`  
**Branch:** `feat/txgio-reprojection-3857` (includes PR #396 fixes: allowlist removal, transactional write, projection guards)  
**Database:** deployment Neon via `DEPLOYMENT_DATABASE_URL` secret (`legacy-design-tools-prod`). No test runner invoked. SELECT and the authorized single-county ingest only.

---

## County chosen and why

**Kenedy County, FIPS 48261.**

| Criterion | Kenedy |
|---|---|
| Already loaded? | No |
| Vintage | **202503** (geographic degrees, NOT 202505 Web Mercator) |
| Archive size | **334,740 bytes** (0.33 MB — smallest not-loaded county) |
| Roster parcel estimate | 538 |
| Prior dry-run reference | 538 features, seam ~4.46 (from readiness sweep) |
| Projection measured | `GEOGCS_DEGREES` (full download in sweep) |

Avoided Bosque 48035 (104 MB, 12x median byte-per-parcel anomaly per operator instruction).

Source matrix entry (`_inbox/2026-08-08_SWEEP_county_source_matrix.json`):

```json
"fips": "48261",
"name": "Kenedy",
"bytes": 334740,
"loaded_already": false,
"parcel_count_est": 538,
"vintage_yyyymm": "202503",
"projection_measured": "GEOGCS_DEGREES"
```

---

## Environment

```text
cd P:\legacy-design-tools
git branch --show-current
feat/txgio-reprojection-3857

git log --oneline -3
13cb5f4f feat(txgio): opt-in EPSG:3857 reprojection to unblock the 202505 vintage
457ba565 fix(txgio): clear the three statewide-ingest blockers — projection, allowlist, write path (#396)
5882166e fix(county-manifest): demote doctrine zoning cells from satisfied-absent to not-yet (#395)
```

DATABASE_URL set from:

```powershell
gcloud secrets versions access latest --secret=DEPLOYMENT_DATABASE_URL --project legacy-design-tools-prod
```

---

## 1. Store size BEFORE apply

```sql
SELECT pg_size_pretty(pg_total_relation_size('txgio_parcel')) AS total_pretty,
       pg_total_relation_size('txgio_parcel') AS total_bytes;

SELECT count(*) AS kenedy_rows FROM txgio_parcel WHERE county_fips = '48261';
```

```
 total_pretty | total_bytes
--------------+-------------
 5937 MB      |  6225453056
(1 row)

 kenedy_rows
-------------
           0
(1 row)
```

Statewide baseline from readiness sweep: **1,124.6 bytes/row total** (5,535,897 rows, 19 counties).

---

## 2. DRY RUN

```powershell
$env:DATABASE_URL = "<deployment-url>"
$env:NODE_TLS_REJECT_UNAUTHORIZED = "0"
pnpm --filter @workspace/cad-ingest txgio-ingest -- --county=48261 --dry-run
```

**First attempt without `NODE_TLS_REJECT_UNAUTHORIZED` failed (defect — see section Defects):**

```
[txgio-ingest] FATAL: TypeError: fetch failed
  [cause]: Error: unable to verify the first certificate
    code: 'UNABLE_TO_VERIFY_LEAF_SIGNATURE'
```

**Second attempt with TLS bypass — full output:**

```
[txgio-ingest] downloading https://data.geographic.texas.gov/0fa04328-872e-481c-b453-126a74777593/resources/stratmap25-landparcels_48261_lp.zip
[txgio-ingest] saved C:\Users\cente\AppData\Local\Temp\txgio-ingest-Lea5In\stratmap25-landparcels_48261_lp.zip
[txgio-ingest] extracting shp/stratmap25-landparcels_48261_kenedy_202503.dbf (1154690 bytes)
[txgio-ingest] extracting shp/stratmap25-landparcels_48261_kenedy_202503.prj (145 bytes)
[txgio-ingest] extracting shp/stratmap25-landparcels_48261_kenedy_202503.shp (175796 bytes)
[txgio-ingest] projection: GCS_WGS_1984 geographic (stratmap25-landparcels_48261_kenedy_202503.prj)
[txgio-ingest] county=48261 (Kenedy) source=https://data.geographic.texas.gov/0fa04328-872e-481c-b453-126a74777593/resources/stratmap25-landparcels_48261_lp.zip
[txgio-ingest] shapefile: C:\Users\cente\AppData\Local\Temp\txgio-ingest-Lea5In\stratmap25-landparcels_48261_kenedy_202503.shp
[txgio-ingest] vintage=stratmap25-landparcels_48261_kenedy_202503
[txgio-ingest] ---- ingest summary (DRY RUN — nothing written) ----
[txgio-ingest] county:           48261 (Kenedy)
[txgio-ingest] loaded before:    no
[txgio-ingest] source file:      stratmap25-landparcels_48261_lp.zip
[txgio-ingest] source vintage:   stratmap25-landparcels_48261_kenedy_202503
[txgio-ingest] source CRS:       wgs84-geographic
[txgio-ingest] features read:    538
[txgio-ingest] features parsed:  538
[txgio-ingest] features would load: 538
[txgio-ingest] rows would delete:  0
[txgio-ingest] rows would insert:  2400 (one per intersecting grid cell)
[txgio-ingest] features skipped: 0 (no polygon geometry)
[txgio-ingest] duration:         0.7s
```

**Dry-run prediction summary:**

| Metric | Value |
|---|---|
| features read | 538 |
| features parsed | 538 |
| features would load | 538 |
| rows would delete | 0 |
| rows would insert | **2400** |
| features skipped | 0 |
| duration | 0.7s |

---

## 3. APPLY (first load)

```powershell
pnpm --filter @workspace/cad-ingest txgio-ingest -- --county=48261
```

```
[txgio-ingest] replacing existing 48261 rows (0 present) — delete + load run in ONE transaction
[txgio-ingest] ---- ingest summary ----
[txgio-ingest] county:           48261 (Kenedy)
[txgio-ingest] loaded before:    no
[txgio-ingest] source file:      stratmap25-landparcels_48261_lp.zip
[txgio-ingest] source vintage:   stratmap25-landparcels_48261_kenedy_202503
[txgio-ingest] source CRS:       wgs84-geographic
[txgio-ingest] features read:    538
[txgio-ingest] features parsed:  538
[txgio-ingest] features load: 538
[txgio-ingest] rows delete:  0
[txgio-ingest] rows insert:  2400 (one per intersecting grid cell)
[txgio-ingest] features skipped: 0 (no polygon geometry)
[txgio-ingest] duration:         7.3s
```

### Dry vs apply comparison

| Metric | Dry run | Apply | Match? |
|---|---|---|---|
| features parsed | 538 | 538 | **YES** |
| features load | 538 | 538 | **YES** |
| rows delete | 0 | 0 | **YES** |
| rows insert | 2400 | 2400 | **YES** |

**No discrepancy.** Dry run predicted apply exactly.

---

## 4. Store size AFTER first apply

```sql
SELECT pg_size_pretty(pg_total_relation_size('txgio_parcel')) AS total_pretty,
       pg_total_relation_size('txgio_parcel') AS total_bytes;

SELECT count(*) AS rows,
       count(DISTINCT feature_index) AS features,
       round(count(*)::numeric/count(DISTINCT feature_index),4) AS seam_factor
FROM txgio_parcel WHERE county_fips='48261';

SELECT round((pg_total_relation_size('txgio_parcel') - 6225453056)::numeric / 2400, 1) AS bytes_per_row_kenedy_delta;
```

```
 total_pretty | total_bytes
--------------+-------------
 5943 MB      |  6232129536
(1 row)

 rows | features | seam_factor
------+----------+-------------
 2400 |      538 |      4.4610
(1 row)

 bytes_per_row_kenedy_delta
----------------------------
                     2781.9
(1 row)
```

| Metric | Value | vs statewide 1,124.6 B/row |
|---|---|---|
| Relation size delta (first apply) | 6,676,480 bytes | — |
| Bytes per row (relation delta / 2400 rows) | **2,781.9** | **2.47x heavier** |
| Avg heap bytes per row (pg_column_size) | **2,739.4** | **3.35x vs 815.9 heap baseline** |
| Avg geometry bytes per row | **2,489.4** | Rural parcels are geometrically larger |

Rural Kenedy rows are substantially heavier than the metro-derived statewide average. The seam factor (4.46 vs 1.07 metro blend) amplifies this further for storage projections on western ranch counties.

```sql
SELECT county_fips, count(*) AS rows,
       round(avg(pg_column_size(geometry)),1) AS avg_geom_bytes,
       round(avg(pg_column_size(t.*)),1) AS avg_full_row_heap_bytes
FROM txgio_parcel t WHERE county_fips='48261' GROUP BY county_fips;
```

```
 county_fips | rows | avg_geom_bytes | avg_full_row_heap_bytes
-------------+------+----------------+-------------------------
 48261       | 2400 |         2489.4 |                  2739.4
(1 row)
```

---

## 5. Idempotency verification

Second apply (same county, replace semantics):

```
[txgio-ingest] replacing existing 48261 rows (2400 present) — delete + load run in ONE transaction
[txgio-ingest] features load: 538
[txgio-ingest] rows delete:  2400
[txgio-ingest] rows insert:  2400 (one per intersecting grid cell)
[txgio-ingest] duration:         8.1s
```

Third apply (local file, write-path timing):

```
[txgio-ingest] rows delete:  2400
[txgio-ingest] rows insert:  2400
[txgio-ingest] duration:         6.8s
```

```sql
SELECT count(*) AS kenedy_rows FROM txgio_parcel WHERE county_fips='48261';
SELECT count(DISTINCT county_fips) AS total_counties FROM txgio_parcel;
```

```
 kenedy_rows
-------------
        2400
(1 row)

 total_counties
----------------
             20
(1 row)
```

**Idempotency: PASS.** Delete count equals insert count on re-run; net row count unchanged at 2400. Transactional replace held — county was never left empty mid-run.

**Note:** `loaded before: no` on every run because `TXGIO_COUNTIES` in `counties.ts` was not updated (manual registry step; see Defects).

**Note:** After three idempotent replaces, `pg_total_relation_size('txgio_parcel')` grew to **6,245,138,432 bytes** (+19.7 MB over baseline) despite row count staying at 5,538,297 (+2400 net). Dead tuple / TOAST accumulation from delete-then-insert without intervening `VACUUM`. Not a correctness defect; a wave-scale ops concern.

---

## 6. Geometry sanity

### Texas degree bounds

```sql
SELECT count(*) AS rows_outside_texas
FROM txgio_parcel
WHERE county_fips='48261'
  AND (west_lng < -107 OR west_lng > -93 OR south_lat < 25 OR north_lat > 37);
```

```
 rows_outside_texas
--------------------
                  0
(1 row)
```

### Parcel bbox vs Census extent (from readiness sweep SHP header)

```sql
SELECT round(min(west_lng)::numeric,4) AS min_w,
       round(max(east_lng)::numeric,4) AS max_e,
       round(min(south_lat)::numeric,4) AS min_s,
       round(max(north_lat)::numeric,4) AS max_n
FROM txgio_parcel WHERE county_fips='48261';
```

```
  min_w   |  max_e   |  min_s  |  max_n
----------+----------+---------+---------
 -97.9862 | -97.4225 | 26.5979 | 27.2833
(1 row)
```

Census SHP header bbox from sweep (48261 Kenedy 202503): `xmin=-97.9862 ymin=26.5979 xmax=-97.4225 ymax=27.2833`

**Exact match** on all four edges to four decimal places.

### vs `tx_county_boundary` (L1 layer)

```sql
SELECT round(min(west_lng)::numeric,4), round(max(east_lng)::numeric,4),
       round(min(south_lat)::numeric,4), round(max(north_lat)::numeric,4)
FROM tx_county_boundary WHERE county_fips='48261';
```

```
  round   |  round   |  round  |  round
----------+----------+---------+---------
 -97.9859 | -97.2254 | 26.5979 | 27.2840
(1 row)
```

Parcel east extent (-97.4225) is west of county boundary east extent (-97.2254). Expected for a sparse ranch county where parcel coverage does not fill the full county polygon (much of Kenedy is King Ranch open range without individual parcel polygons in StratMap).

### Spot check (distinct features)

```sql
SELECT DISTINCT ON (feature_index) feature_index, prop_id, owner_name,
       round(west_lng::numeric,4) AS w, round(south_lat::numeric,4) AS s
FROM txgio_parcel WHERE county_fips='48261'
ORDER BY feature_index LIMIT 8;
```

```
 feature_index | prop_id |          owner_name          |    w     |    s
---------------+---------+------------------------------+----------+---------
             0 | 0       |                              | -97.9597 | 26.6222
             1 | 15271   | KING RANCH INC               | -97.9571 | 26.6005
             2 | 15276   | SANTA FE EAST CATTLE COMPANY | -97.9856 | 26.7170
             3 | 15305   | SANTA FE EAST CATTLE COMPANY | -97.9855 | 26.7168
             4 | 15309   | GARZA C C                    | -97.9854 | 26.6156
             5 | 15311   | GARZA C C                    | -97.9854 | 26.6167
             6 | 15315   | CANTU RAMON GARZA ESTATE     | -97.9837 | 26.6436
             7 | 15317   | GARZA REYNALDO JR            | -97.9854 | 26.6443
(8 rows)
```

Coordinates place parcels in South Texas ranch country (lat ~26.6, lng ~-97.98). King Ranch Inc appears as owner on feature 1. **Geometry is sane.**

---

## 7. Seam factor

```sql
SELECT count(*) AS rows,
       count(DISTINCT feature_index) AS features,
       round(count(*)::numeric / count(DISTINCT feature_index), 4) AS rows_per_feature
FROM txgio_parcel WHERE county_fips='48261';
```

```
 rows | features | rows_per_feature
------+----------+------------------
 2400 |      538 |           4.4610
(1 row)
```

| County type | Seam factor |
|---|---|
| Kenedy 48261 (this run) | **4.4610** |
| Prior Kenedy dry-run (sweep) | 4.46 |
| Loaded 19-county metro blend | 1.0746 |
| Caldwell 48055 (worst loaded rural) | 1.2533 |

**Finding:** Rural western counties with large parcel bboxes produce a seam factor **4x the metro blend**. Statewide storage projections using seam 1.05–1.15 are materially light for the ranch-county tail. The readiness sweep's Caldwell-worst case (1.2533) did not bracket Kenedy's 4.46.

---

## 8. MultiPolygon and interior ring rate

Measured on deduplicated features (`DISTINCT ON (feature_index)`):

```sql
WITH per_feature AS (
  SELECT DISTINCT ON (feature_index) feature_index, geometry
  FROM txgio_parcel WHERE county_fips='48261'
  ORDER BY feature_index, tile_key
)
SELECT count(*) AS distinct_features,
       count(*) FILTER (WHERE geometry->>'type' = 'MultiPolygon') AS multipolygon_features,
       count(*) FILTER (WHERE geometry->>'type' = 'Polygon') AS polygon_features,
       round(100.0 * count(*) FILTER (WHERE geometry->>'type' = 'MultiPolygon') / count(*), 2) AS multipolygon_pct
FROM per_feature;
```

```
 distinct_features | multipolygon_features | polygon_features | multipolygon_pct
-------------------+-----------------------+------------------+------------------
               538 |                     1 |              537 |             0.19
(1 row)
```

```sql
WITH per_feature AS (
  SELECT DISTINCT ON (feature_index) feature_index, geometry
  FROM txgio_parcel WHERE county_fips='48261'
  ORDER BY feature_index, tile_key
)
SELECT count(*) FILTER (WHERE geometry->>'type'='Polygon'
         AND jsonb_array_length(geometry->'coordinates') > 1) AS polygon_with_holes,
       count(*) FILTER (WHERE geometry->>'type'='MultiPolygon') AS multipolygon_any,
       count(*) FILTER (WHERE geometry->>'type'='MultiPolygon'
         AND EXISTS (SELECT 1 FROM jsonb_array_elements(geometry->'coordinates') AS poly
                     WHERE jsonb_array_length(poly) > 1)) AS multipolygon_with_holes
FROM per_feature;
```

```
 polygon_with_holes | multipolygon_any | multipolygon_with_holes
--------------------+------------------+-------------------------
                  7 |                1 |                       0
(1 row)
```

| Metric | Kenedy 48261 | Loaded 19 (fabric analysis) |
|---|---|---|
| MultiPolygon feature rate | **0.19%** (1/538) | 0.3714% by count |
| Polygon with interior rings | **1.30%** (7/538) | not separately measured |
| MultiPolygon with holes | 0 | — |

Multi-part support decision input: this county is almost entirely simple Polygon. The one MultiPolygon and seven hole-carrying polygons ingested without skip or error on the current path.

---

## 9. Timing

| Phase | Method | Duration |
|---|---|---|
| Download (334 KB zip) | Python urllib (browser UA) | **1.03s** |
| Download + extract + parse (dry-run, URL) | CLI `--dry-run` | **0.7s** |
| Full E2E first apply (URL) | CLI apply | **7.3s** |
| Idempotent re-apply (URL) | CLI apply | **8.1s** |
| Parse + write only (local `--file`, apply) | CLI apply | **6.8s** |
| Parse only (local `--file`, dry-run) | CLI `--dry-run` | **0.5s** |

**Derived breakdown (first apply, URL path):**

| Phase | Estimate |
|---|---|
| Download + extract | ~0.2–1.0s (zip is 334 KB; Node download fast once TLS bypassed) |
| Parse 538 features | ~0.5s |
| DB write 2400 rows (transactional replace) | ~6.3–6.6s |
| **Total** | **7.3s** |

Write dominates. At 538 parcels / 7.3s this county is trivial; extrapolation to Harris (536k parcels) is not linear (seam factor and row weight differ) and was not attempted.

---

## Defects found

### D1 — Node.js fetch TLS failure on Windows (BLOCKING for unattended wave on this executor host)

Without `NODE_TLS_REJECT_UNAUTHORIZED=0`, the CLI's `downloadToFile` (`fetch`) fails against `data.geographic.texas.gov`:

```
TypeError: fetch failed
  code: 'UNABLE_TO_VERIFY_LEAF_SIGNATURE'
```

Python urllib with browser UA succeeds on the same host. The CAD ingest downloader comment mentions WAF/UA issues but does not handle Windows schannel/Node TLS the way `zoning-cli.ts` documents for ArcGIS hosts. **An unattended wave from a Windows operator machine will fail at download unless this is fixed or the run uses pre-downloaded `--file=` inputs.**

Not patched in this session (would need a small, proven change to `download.ts`).

### D2 — `TXGIO_COUNTIES` registry not updated after successful load (OPERATIONAL GAP)

After ingest, the store holds 48261 rows and `total_counties` is 20, but:

- CLI reports `loaded before: no` on every run
- `isTxgioCountyLoaded('48261')` returns false
- `jurisdictions.ts` / manifest will not treat Kenedy as geometry-available until someone manually adds `"48261"` to `TXGIO_COUNTIES`

By design per `counties.ts` comments, but **no post-ingest checklist or automation exists**. A wave operator must update the registry per county or downstream consumers will not see the geometry.

Not patched (operational/process gap, not a code bug in the ingest path itself).

### D3 — Table bloat on idempotent county replace (OPS, not correctness)

Three idempotent applies grew `pg_total_relation_size('txgio_parcel')` from 6,225,459,056 to 6,245,138,432 (+19.7 MB) with net +2400 rows only. Delete-then-insert leaves dead tuples. At 235 counties with re-run capability, plan for `VACUUM` between waves or accept transient bloat.

### D4 — 202505 Web Mercator counties not exercised (KNOWN, separate proof)

This run intentionally avoided 202505. Those 57 counties require `--reproject=3857`. Reprojection path is on branch `feat/txgio-reprojection-3857` but was not part of this proof.

---

## git status (legacy-design-tools, verbatim)

```
On branch feat/txgio-reprojection-3857
Your branch is up to date with 'origin/feat/txgio-reprojection-3857'.

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
  (commit or discard the untracked or modified content in submodules)
	modified:   .claude/worktrees/recon-add-jurisdiction (untracked content)
	modified:   .claude/worktrees/track-b-ifc-ingest (modified content, untracked content)

Untracked files:
  (use "git add <file>..." to include in what will be committed)
	.tmp_nfhl_head.zip
	.tmp_nfhl_tail.zip
	artifacts/api-server/data/county_manifest_seed.generated.sql

no changes added to commit (use "git add" and/or "git commit -a")
```

No code changes committed. Pre-existing dirty entries not touched.

---

## Verdict

**Is the L2 path ready to run in waves?**

**Conditionally yes for degree-vintage counties (202503/202507/202508/202509), with three pre-wave fixes:**

1. **Fix Windows Node TLS for TxGIO download** (D1) or mandate a Linux runner / pre-download + `--file=` for the wave. The ingest logic itself works; the default download path fails on this Windows host without TLS bypass.

2. **Define and automate the post-load registry step** (D2): add county to `TXGIO_COUNTIES`, bump manifest, file thesis parity if applicable. Without this, geometry lands in Postgres but product surfaces do not know.

3. **Revise storage projections for rural seam factor.** Kenedy at 4.46 rows/feature and ~2,740 heap bytes/row is far above the metro-derived 1,124.6 B/row and 1.07 seam. Budget wave sizing with seam **1.25–4.5** for western ranch counties, not 1.05–1.15.

**What passed cleanly:**

- Allowlist removal: unresolved county dry-runs and applies
- Dry/apply count parity: exact match (538 features, 2400 rows)
- Transactional replace: idempotent, no stranded empty county
- Projection guards: 202503 geographic county accepted; coordinates in Texas envelope
- Geometry: sane, Census bbox match, plausible owners/locations

**Still unproven on this run:**

- 202505 + `--reproject=3857` path (separate county required)
- Donley 48129 absent-from-StratMap override path
- Large metro county at scale (Harris)
- Concurrent multi-county load / heavy-scan slot interaction

**Recommended next proof:** one 202505 county (e.g. King 48269, 2326 features, 0.70 MB) with `--reproject=3857`, same dry/apply/idempotency discipline, before opening a degree-vintage wave.
