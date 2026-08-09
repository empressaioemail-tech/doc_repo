---
id: 2026-08-08_SWEEP_statewide_readiness
title: Statewide readiness sweep — source sweep, store sizing, and rural schema drift, all measured
date: 2026-08-08
status: complete (read-only; SELECT-only against live Postgres, no ingest, no writes, no deploy)
owner: nick
related: [_inbox/2026-08-08_STATEWIDE_acquisition_scope, _inbox/2026-08-08_STOCKTAKE_pre_statewide, _inbox/2026-08-08_SWEEP_county_source_matrix.json, _catalog/texas_roster_v1.json, 90_runbooks/factory_onboarding_runbook]
---

# Statewide readiness sweep

Three measurements were outstanding before the 235-county parcel acquisition: a live sweep of all 254 StratMap sources, the on-disk size of `txgio_parcel` (the number every storage projection rested on without ever being taken), and whether the rural counties' shapefile schema actually matches what the ingest requires. All three are now measured. Every command that produced a number is pasted verbatim.

The headline is that two of the three came back reassuring and the third found a live defect that would have silently corrupted 57 counties.

**The finding that matters: the 202505 StratMap vintage ships coordinates in Web Mercator meters, not degrees, and the ingest's WGS84 guard does not catch it.** Fifty-seven of the 235 counties are on that vintage. None of the 19 loaded counties are, which is the only reason this has not already happened. This is a blocker and it is described in full in section 3.

---

## 1. The source sweep — 254 counties, all range-probed

### Method

Every county in `_catalog/texas_roster_v1.json` was issued an HTTP range request for a single byte against its StratMap URL, with the full browser User-Agent (a short UA returns 403 from the CloudFront edge). Concurrency 4 with a 60-second per-request timeout and up to three retries on transport errors. Exit-bounded, no downloads beyond one byte per county.

The request shape, as issued:

```python
req = urllib.request.Request(u, headers={
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                  "(KHTML, like Gecko) Chrome/124.0 Safari/537.36",
    "Range": "bytes=0-0"})
with urllib.request.urlopen(req, timeout=60) as r:
    rec["http_status"] = r.status
    rec["content_range"] = r.headers.get("Content-Range")
```

URL template, confirmed general in `counties.ts:66`:

```
https://data.geographic.texas.gov/0fa04328-872e-481c-b453-126a74777593/resources/stratmap25-landparcels_{fips}_lp.zip
```

### Result

```
probed: 254 ok: 253 failed: 1
TOTAL all: 6600081063
TOTAL not-loaded: 4256138637
failures: [('48129', 'Donley', 404, 'HTTPError:404')]
```

**253 live, 1 dead. Donley 48129 confirmed as the sole 404**, exactly as the prior scope doc recorded. No redirects were observed on any county; every live county answered 206 Partial Content directly with `Content-Type: application/x-zip-compressed`.

Totals: **6.600 GB for all 254; 4.256 GB for the 235 not yet loaded** (234 of which are live, since Donley is among the not-loaded). Both figures reproduce the prior sweep byte-for-byte, which is a useful independent confirmation that the source is stable across sessions.

Median not-loaded county archive is 7.64 MB; the mean is 18.19 MB. The distribution is heavily skewed by a short metro tail.

### Ranked by download size — the not-loaded counties

```
  48201 Harris           479.5 MB  vintage=202508  est_parcels=536512
  48157 Fort Bend        200.8 MB  vintage=202503  est_parcels=375100
  48339 Montgomery       194.3 MB  vintage=202507  est_parcels=320915
  48141 El Paso          191.6 MB  vintage=202503  est_parcels=407130
  48039 Brazoria         155.7 MB  vintage=202503  est_parcels=275131
  48215 Hidalgo          140.3 MB  vintage=202508  est_parcels=328333
  48035 Bosque           104.2 MB  vintage=202503  est_parcels=19975
  48061 Cameron           88.8 MB  vintage=202507  est_parcels=185069
  48355 Nueces            85.3 MB  vintage=202507  est_parcels=157198
  48167 Galveston         73.8 MB  vintage=202507  est_parcels=188696
  48423 Smith             70.2 MB  vintage=202508  est_parcels=140245
  48245 Jefferson         68.4 MB  vintage=202507  est_parcels=122202
```

And the smallest, which define the cheap first wave:

```
  48261 Kenedy            0.33 MB  vintage=202503
  48269 King              0.70 MB  vintage=202505
  48301 Loving            0.72 MB  vintage=202505
  48431 Sterling          0.79 MB  vintage=202505
  48173 Glasscock         1.04 MB  vintage=202503
  48033 Borden            1.09 MB  vintage=202503
  48235 Irion             1.21 MB  vintage=202505
  48263 Kent              1.22 MB  vintage=202505
  48421 Sherman           1.24 MB  vintage=202505
  48383 Reagan            1.34 MB  vintage=202505
```

The fifty smallest not-loaded counties total **94.1 MB**; the hundred smallest total **315.0 MB**. A first wave of fifty rural counties is under a tenth of a gigabyte of download. Note, though, that six of the ten smallest are on the 202505 vintage, so the obvious "start with the smallest" wave is precisely the wave that would trip the projection defect. That is an unlucky coincidence and it is worth stating plainly.

### One archive-size anomaly worth flagging

Archive bytes per roster parcel, top outliers:

```
  48035 Bosque          104.2 MB /   19975 parcels =     5219 B/parcel  v=202503
  48119 Delta             9.0 MB /    6470 parcels =     1391 B/parcel  v=202503
  48123 DeWitt           27.1 MB /   20802 parcels =     1305 B/parcel  v=202505
  48171 Gillespie        39.1 MB /   32363 parcels =     1208 B/parcel  v=202503
  48417 Shackelford       5.1 MB /    5542 parcels =      914 B/parcel  v=202503

median B/parcel across 234 not-loaded: 432
mean:   480
median B/parcel across loaded 19: 472
```

**Bosque 48035 is a twelve-sigma outlier**: 104 MB of archive for 19,975 parcels, roughly twelve times the statewide median byte-per-parcel. Either its geometry is extraordinarily vertex-dense, or the roster's `parcel_count_est` for Bosque is wrong, or the archive carries something the others do not. It is not a blocker, but it is the one county whose parse should be watched rather than assumed, and it should not be placed in an unattended wave.

The broader point from that same table: **the rural median byte-per-parcel (432) is slightly BELOW the loaded metro median (472)**. Rural archives are not denser per parcel. This matters for section 2.

---

## 2. Store sizing — the measurement nobody had taken

Read-only against the legacy-design-tools deployment Neon (credential per `90_runbooks/factory_onboarding_runbook.md` item 5: `gcloud secrets versions access latest --secret=DEPLOYMENT_DATABASE_URL --project legacy-design-tools-prod`). Every statement below is a `SELECT` or a `SHOW`. No test runner was pointed at this database.

### The number that was missing

```sql
SELECT
  pg_size_pretty(pg_total_relation_size('txgio_parcel')) AS total_pretty,
  pg_total_relation_size('txgio_parcel') AS total_bytes,
  pg_relation_size('txgio_parcel') AS heap_bytes,
  pg_indexes_size('txgio_parcel') AS index_bytes,
  pg_total_relation_size('txgio_parcel') - pg_relation_size('txgio_parcel') - pg_indexes_size('txgio_parcel') AS toast_bytes;
```

```
 total_pretty | total_bytes | heap_bytes | index_bytes | toast_bytes
--------------+-------------+------------+-------------+-------------
 5937 MB      |  6225453056 | 4516954112 |  1066655744 |   641843200
```

```sql
SELECT count(*) AS total_rows,
       count(DISTINCT county_fips) AS counties,
       count(DISTINCT (county_fips, feature_index)) AS distinct_features,
       round(pg_total_relation_size('txgio_parcel')::numeric / count(*), 1) AS bytes_per_row_total,
       round(pg_relation_size('txgio_parcel')::numeric / count(*), 1) AS bytes_per_row_heap,
       round(pg_total_relation_size('txgio_parcel')::numeric / count(DISTINCT (county_fips, feature_index)), 1) AS bytes_per_feature
FROM txgio_parcel;
```

```
 total_rows | counties | distinct_features | bytes_per_row_total | bytes_per_row_heap | bytes_per_feature
------------+----------+-------------------+---------------------+--------------------+-------------------
    5535897 |       19 |           5151394 |              1124.6 |              815.9 |            1208.5
```

**Measured: 1,124.6 bytes per row inclusive of indexes and TOAST; 815.9 bytes of heap; 1,208.5 bytes per distinct feature.** The prior projections assumed 1 to 2 KB per row with nothing behind it. The measurement lands at the bottom of that assumed band, so the assumption was conservative in the right direction but only by luck. This figure now has a query behind it.

Index overhead is 1.07 GB against 4.52 GB of heap — 17 percent of total relation size, which is unremarkable for a table carrying a three-column composite PK plus a prop_id index and a large expression index on normalized situs.

### Row count and the duplication figure — resolving the 16.6 vs 6.95 dispute

```sql
SELECT count(*) AS rows,
       count(DISTINCT (county_fips, feature_index)) AS features,
       round(count(*)::numeric / count(DISTINCT (county_fips, feature_index)), 4) AS rows_per_feature,
       round(100.0*(count(*) - count(DISTINCT (county_fips,feature_index)))::numeric / count(*), 3) AS pct_of_rows_that_are_dup,
       round(100.0*(count(*) - count(DISTINCT (county_fips,feature_index)))::numeric / count(DISTINCT (county_fips,feature_index)), 3) AS pct_inflation_over_features
FROM txgio_parcel;
```

```
  rows   | features | rows_per_feature | pct_of_rows_that_are_dup | pct_inflation_over_features
---------+----------+------------------+--------------------------+-----------------------------
 5535897 |  5151394 |           1.0746 |                    6.946 |                       7.464
```

**Both prior figures were wrong, and the correction is 6.95, not 16.6.** The task framing asked which is right; the answer is that 6.946 percent is correct as "share of stored rows that are duplicates," 7.464 percent is correct as "inflation over the feature count," and neither is 16.6. I could not reproduce 16.6 percent under any denominator, and I agree with the stocktake's correction. The seam factor is 1.0746 rows per feature across the loaded store.

### Largest tables

```sql
SELECT c.relname AS table_name,
       pg_size_pretty(pg_total_relation_size(c.oid)) AS total,
       pg_total_relation_size(c.oid) AS total_bytes,
       pg_size_pretty(pg_indexes_size(c.oid)) AS idx,
       s.n_live_tup AS approx_rows
FROM pg_class c
JOIN pg_namespace n ON n.oid=c.relnamespace
LEFT JOIN pg_stat_user_tables s ON s.relid=c.oid
WHERE c.relkind='r' AND n.nspname='public'
ORDER BY pg_total_relation_size(c.oid) DESC LIMIT 15;
```

```
         table_name          |  total   | total_bytes |   idx   | approx_rows
-----------------------------+----------+-------------+---------+-------------
 place_layer_snapshots       | 10 GB    | 11219460096 | 1182 MB |     5212090
 txgio_parcel                | 5937 MB  |  6225453056 | 1017 MB |     5522215
 txgio_parcel_staging        | 2592 MB  |  2717786112 | 317 MB  |           0
 cad_property                | 1719 MB  |  1802240000 | 236 MB  |     4584652
 permit_record               | 1417 MB  |  1485570048 | 528 MB  |           0
 txgio_address               | 751 MB   |   787128320 | 188 MB  |           0
 brokerage_brief_runs        | 686 MB   |   719568896 | 144 kB  |           4
 sheets                      | 377 MB   |   395608064 | 248 kB  |           0
 code_atoms                  | 53 MB    |    55353344 | 1776 kB |           0
 briefing_sources            | 45 MB    |    46735360 | 72 kB   |           0
 tx_city_boundary            | 26 MB    |    27148288 | 184 kB  |        1222
 tx_county_boundary          | 25 MB    |    26017792 | 72 kB   |         254
 cotality_spatial_tile_cache | 15 MB    |    16080896 | 48 kB   |           1
 adapter_response_cache      | 10 MB    |    10846208 | 72 kB   |           0
 reasoning_atoms             | 10232 kB |    10477568 | 2328 kB |           0
```

`place_layer_snapshots` remains the largest table at 10 GB, larger than `txgio_parcel` itself. The stocktake flagged this as the storage item to watch and I agree; if it scales with parcel count it dominates the statewide picture.

One correction to the prior read: `txgio_parcel_staging` shows `n_live_tup = 0` in the stats view, but an actual count returns **2,475,299 rows**. The stats are stale, not the table empty. It genuinely holds 2.6 GB of data.

```sql
SELECT count(*) AS staging_rows FROM txgio_parcel_staging;
```

```
 staging_rows
--------------
      2475299
```

### Database size and connections

```sql
SELECT pg_size_pretty(pg_database_size(current_database())) AS db_size,
       pg_database_size(current_database()) AS db_bytes, version();
SHOW max_connections;
SELECT count(*) AS current_conns FROM pg_stat_activity;
```

```
 db_size |  db_bytes   |  version
---------+-------------+------------------------------------------------------------
 24 GB   | 25621528576 | PostgreSQL 17.10 (2947584) on aarch64-unknown-linux-gnu ...

 max_connections
-----------------
 901

 current_conns
---------------
            17
```

**24 GB database, 901 max connections, 17 in use.** Connections are not remotely a constraint.

### Per-county density — and a correction to the rural-is-heavier assumption

```sql
SELECT county_fips, count(*) AS rows,
       count(DISTINCT feature_index) AS features,
       round(count(*)::numeric/count(DISTINCT feature_index),4) AS rows_per_feature,
       round(avg(pg_column_size(geometry)),1) AS avg_geom_bytes,
       round(avg(pg_column_size(t.*)),1) AS avg_full_row_bytes
FROM txgio_parcel t GROUP BY county_fips ORDER BY rows_per_feature DESC;
```

```
 county_fips |  rows  | features | rows_per_feature | avg_geom_bytes | avg_full_row_bytes
-------------+--------+----------+------------------+----------------+--------------------
 48055       |  32781 |    26155 |           1.2533 |          569.0 |              866.7
 48367       | 118833 |   100548 |           1.1819 |          610.3 |              876.7
 48021       |  74729 |    63357 |           1.1795 |          514.6 |              785.2
 48309       | 130650 |   115362 |           1.1325 |          657.6 |              953.7
 48139       | 111274 |    98803 |           1.1262 |          629.0 |              928.3
 48209       | 131734 |   117427 |           1.1218 |          665.8 |              964.9
 48257       | 106175 |    94650 |           1.1218 |          507.5 |              795.6
 48251       | 113686 |   101847 |           1.1162 |          551.9 |              815.7
 48187       | 106508 |    95571 |           1.1144 |          567.0 |              856.5
 48091       | 114430 |   103537 |           1.1052 |          809.0 |             1103.4
 48027       | 184470 |   167412 |           1.1019 |          453.3 |              739.9
 48453       | 894657 |   828773 |           1.0795 |          837.0 |             1090.2
 48491       | 304298 |   282983 |           1.0753 |          486.8 |              766.2
 48397       |  56266 |    52739 |           1.0669 |          710.4 |              992.2
 48121       | 373635 |   353631 |           1.0566 |          538.3 |              848.8
 48439       | 799524 |   757161 |           1.0559 |          647.1 |              888.4
 48085       | 408681 |   387737 |           1.0540 |          538.8 |              831.3
 48029       | 747206 |   709541 |           1.0531 |          577.8 |              880.7
 48113       | 726360 |   694160 |           1.0464 |          509.3 |              798.4
```

This table refutes a premise that both prior documents carried forward. The scope doc said "rural parcels are geometrically larger with more vertices, so bytes-per-row likely runs above the metro-derived 1,124.6," making the high projection a soft upper bound.

**The data says the opposite.** Caldwell 48055 is the most rural of the nineteen and has the worst seam factor (1.2533) — but its average geometry payload is 569 bytes, well *below* Travis (837) and Comal (809), the two densest metro counties. The correlation between rurality and geometry size is absent; if anything it is mildly negative. Rural parcels span more grid cells (bigger bbox, higher seam factor) while carrying *simpler* polygons (fewer vertices, because a rectangular ranch section has fewer corners than a curved suburban cul-de-sac lot).

The archive-level evidence in section 1 agrees independently: rural median 432 bytes per parcel against loaded-metro median 472.

**So the seam factor rises for rural counties but the bytes-per-row does not.** The two effects partly cancel. The 1,124.6 figure is a fair central estimate rather than a floor, and the upper bound is softer than previously believed.

### Projection to 254 counties

Assumptions, named explicitly:

1. Bytes per row stays at the measured 1,124.6. Justified by the per-county table above showing no rural penalty; the residual risk is that all 19 loaded counties are Texas metros/near-metros and the deep-rural west is unsampled.
2. New rows equal remaining roster parcels times a seam factor. The roster's `parcel_count_est` for the 235 remaining counties is 8,202,783.
3. Existing 5,535,897 rows are retained.

The multiplier check the task asked for, computed from `parcel_count_est` directly:

```
statewide roster parcels: 13360496
loaded 19 roster parcels: 5157713
remaining 235 roster parcels: 8202783
pct already loaded: 38.60
multiplier statewide/loaded: 2.5904
remaining/loaded: 1.5904
null parcel_count_est: ['48129']
```

**The 38.6 percent figure confirms exactly.** The 2.73x multiplier does not reproduce: against roster parcels the multiplier is **2.59x**, against loaded rows 2.41x, against loaded features 2.59x. I could not find a denominator that yields 2.73. The correct statement is that the 19 loaded counties hold 38.60 percent of statewide roster parcels, so the statewide store is roughly **2.4x to 2.6x** the current one depending on whether you index on rows or parcels — materially smaller than a naive 13x, which is the substantive point and it stands.

The projection across the observed seam range:

```
seam 1.0500 (metro-like low):   new_rows= 8.61M total_rows=14.15M txgio=15.9 GB (+9.7 GB)  db=35.3 GB
seam 1.0750 (observed blended): new_rows= 8.82M total_rows=14.35M txgio=16.1 GB (+9.9 GB)  db=35.5 GB
seam 1.1500 (rural mid):        new_rows= 9.43M total_rows=14.97M txgio=16.8 GB (+10.6 GB) db=36.2 GB
seam 1.2533 (Caldwell worst):   new_rows=10.28M total_rows=15.82M txgio=17.8 GB (+11.6 GB) db=37.2 GB
```

**Projected statewide `txgio_parcel`: 15.9 to 17.8 GB, taking the database from 24 GB to roughly 35 to 37 GB.** The realistic center is the rural-mid case at about 16.8 GB and a 36 GB database, since the remaining counties skew rural and their seam factors will sit above the current blend.

This reproduces the stocktake's 16–19 GB / 34–37 GB range closely, and now both ends rest on a measured bytes-per-row rather than an assumed one.

**Verdict on the question this measurement was taken to answer: Neon sizing is a non-issue, not a blocker.** Roughly 12 GB of growth on a 24 GB database is ordinary. The caveat the stocktake raised stands and I could not clear it: the account's actual plan storage ceiling is not discoverable via SQL, so "36 GB is fine" is a statement about the database, not about the billing plan. Someone must confirm the ceiling in the Neon console out-of-band.

---

## 3. Schema drift on rural counties — the blocker

This is where the sweep found something.

### What the ingest requires

From `parse.ts`, `normalizeTxgioFeature` reads exactly seven DBF fields, all optional-tolerant through the `str()` coercion (a missing field yields null, not a throw):

```
Prop_ID, GEO_ID, OWNER_NAME, SITUS_ADDR, SITUS_CITY, SITUS_STAT, SITUS_ZIP
```

It hard-requires only that the feature carry Polygon or MultiPolygon geometry with a finite bbox. Missing attribute fields degrade to nulls silently; a missing *geometry* is counted as a skip; zero parsed features is a fatal exit.

The one hard assertion is the projection guard, `parse.ts:61`:

```ts
export function assertWgs84Prj(prjText: string, prjPath: string): void {
  const t = prjText.toUpperCase();
  if (!t.includes("GCS_WGS_1984") && !t.includes('GEOGCS["WGS 84"')) {
    throw new Error(`${prjPath} is not GCS_WGS_1984 — refusing to ingest non-WGS84 ...`);
  }
}
```

And the guard is skipped entirely when no `.prj` is present, with only a warning (`cli.ts:202`):

```ts
log("WARNING: no .prj found — assuming WGS84 per the TxGIO program spec");
```

### What the roster does and does not tell us

The roster carries no shapefile field list. Its geometry block is uniform to the point of being uninformative for this question:

```
geometry.source: Counter({'txgio_stratmap_bulk': 254})
geometry.rail:   Counter({'C': 254})
in_stratmap:     Counter({True: 253, False: 1})
verification:    Counter({'verified': 254})
geometry keys:   ['download_url','evidence','feature_count','flags','in_stratmap','rail','source','verification','vintage_date','vintage_yyyymm']
```

The only per-county variation that could bear on schema is vintage:

```
vintage: Counter({'202503': 146, '202505': 57, '202507': 29, '202508': 17, '202509': 4, None: 1})
```

Crossed against loaded status, this produces the observation that opened the investigation:

```
LOADED-19 vintages:      Counter({'202503': 10, '202507': 6, '202508': 3})
NOT-LOADED 235 vintages: Counter({'202503': 136, '202505': 57, '202507': 23, '202508': 14, '202509': 4, None: 1})
```

**No loaded county is on the 202505 vintage, and 57 unloaded counties are.** That is an entire vintage family — 24 percent of the remaining work — that the ingest has never once been exercised against. That was the thread worth pulling.

### The direct test: four rural archives downloaded and inspected

Four of the smallest rural counties were fully downloaded (334 KB to 785 KB each), their DBF headers parsed and their `.prj` and `.shp` headers read. Nothing was ingested; all downloads were deleted after inspection.

```
======================================================================
48261 entries: 69
  PRJ WGS84 GUARD PASSES: True
  prj: GEOGCS["GCS_WGS_1984",DATUM["D_WGS_1984",SPHEROID["WGS_1984",6378137.0,298.257223563]],PRIMEM["Greenwich",0.0],UNIT["Deg
  DBF records: 538 reclen: 2144 nfields: 37
  FIELDS: Prop_ID,GEO_ID,OWNER_NAME,NAME_CARE,LEGAL_AREA,LGL_AREA_U,GIS_AREA,GIS_AREA_U,LEGAL_DESC,STAT_LAND_,LOC_LAND_U,LAND_VALUE,IMP_VALUE,MKT_VALUE,SITUS_ADDR,SITUS_NUM,SITUS_STRE,SITUS_ST_1,SITUS_ST_2,SITUS_CITY,SITUS_STAT,SITUS_ZIP,MAIL_ADDR,MAIL_LINE1,MAIL_LINE2,MAIL_CITY,MAIL_STAT,MAIL_ZIP,SOURCE,DATE_ACQ,FIPS,COUNTY,TAX_YEAR,YEAR_BUILT,OBJECTID_1,Shape_Leng,Shape_Area
  REQUIRED MISSING: NONE — all 7 ingest fields present
======================================================================
48269 entries: 69
  PRJ WGS84 GUARD PASSES: True
  prj: PROJCS["WGS_1984_Web_Mercator_Auxiliary_Sphere",GEOGCS["GCS_WGS_1984",DATUM["D_WGS_1984",SPHEROID["WGS_1984",6378137.0,2
  DBF records: 2326 reclen: 2139 nfields: 35
  FIELDS: Prop_ID,GEO_ID,OWNER_NAME,...,OBJECTID_1
  REQUIRED MISSING: NONE — all 7 ingest fields present
======================================================================
48301 entries: 69
  PRJ WGS84 GUARD PASSES: True
  prj: PROJCS["WGS_1984_Web_Mercator_Auxiliary_Sphere",GEOGCS["GCS_WGS_1984",...
  DBF records: 1918 reclen: 2139 nfields: 35
  REQUIRED MISSING: NONE — all 7 ingest fields present
======================================================================
48431 entries: 71
  PRJ WGS84 GUARD PASSES: True
  prj: PROJCS["WGS_1984_Web_Mercator_Auxiliary_Sphere",GEOGCS["GCS_WGS_1984",...
  DBF records: 2365 reclen: 2139 nfields: 35
  REQUIRED MISSING: NONE — all 7 ingest fields present
```

Two things fall out.

**The attribute schema is genuinely uniform. All seven required fields are present in every sample, in identical order.** The only variation is that 202503 archives carry 37 fields (including the ArcGIS-added `Shape_Leng` and `Shape_Area`) while 202505 carries 35 without them. Since the ingest reads fields by name and tolerates absence, this is harmless. The statewide-uniform-schema claim in the `counties.ts` header holds up against rural counties.

**But three of the four ship a projected coordinate system.**

### The defect, stated precisely

`PROJCS["WGS_1984_Web_Mercator_Auxiliary_Sphere", GEOGCS["GCS_WGS_1984", ...]]` is EPSG:3857 — Web Mercator, coordinates in **meters**. It is not a geographic CRS, and its coordinates are not longitude and latitude.

The guard is a substring test for `GCS_WGS_1984`. Web Mercator's WKT nests a `GEOGCS["GCS_WGS_1984"]` inside the `PROJCS` as its base datum. **The substring is present, so the guard passes.** The guard was written to catch a changed datum and does not test the thing that actually matters here, which is whether the CRS is geographic or projected.

Confirmed against actual coordinate values from the shapefile main-file header bbox (bytes 36–68, four little-endian doubles):

```
48261 Kenedy 202503    GEOGCS/degrees
    SHP header bbox: xmin=-97.9862 ymin=26.5979 xmax=-97.4225 ymax=27.2833
    plausible as TX degrees? True
48269 King 202505      PROJCS/WebMercator(METERS)
    SHP header bbox: xmin=-11189891.3150 ymin=3947657.0592 xmax=-11128288.8778 ymax=4007106.7923
    plausible as TX degrees? False
48301 Loving 202505    PROJCS/WebMercator(METERS)
    SHP header bbox: xmin=-11575383.5426 ymin=3717507.1038 xmax=-11502297.9557 ymax=3763378.1874
    plausible as TX degrees? False
48431 Sterling 202505  PROJCS/WebMercator(METERS)
    SHP header bbox: xmin=-11273068.3673 ymin=3705220.0447 xmax=-11223397.0393 ymax=3774745.2244
    plausible as TX degrees? False
```

### What would happen if these were ingested today

Nothing would throw. The failure is completely silent:

1. `assertWgs84Prj` passes on the substring.
2. `bboxOfGeometry` (`geo.ts:110`) walks coordinates and computes min/max with no range validation whatsoever. It would return `{westLng: -11189891, southLat: 3947657, ...}`.
3. `cellKeysForBbox` (`geo.ts:75`) does `Math.floor(bbox.westLng / 0.02)` — bare arithmetic, no bounds check. It would emit tile keys like `g0.02:-11189900.00000,3947660.00000`.
4. The bbox spans roughly 61,000 by 59,000 meters, which divided by a 0.02 "degree" grid is about 3.08 million by 2.97 million cells. **`cellKeysForBbox` is called with `maxCells` undefined from the ingest path, so the cap never engages, and it would attempt to materialize on the order of 9.1 trillion cell keys for a single parcel.** In practice the run dies on memory exhaustion inside the first feature rather than corrupting the store.

That last point is a partial mercy: the most likely observed symptom is an out-of-memory crash on county one of the 202505 wave, not a quiet corruption. But it is mercy by accident, not by design. A county whose parcels happened to be small enough could plausibly get further, and any row that did land would carry meter coordinates that no read path could ever find, since every reader computes cell keys in degrees.

Worth stating: the store's existing PK is `(county_fips, tile_key, feature_index)`, so contaminated rows would be confined to their own county and removable by `deleteCountyParcels`. The blast radius is one county per bad run, and it is recoverable.

### Blast radius across the 235

The projection was sampled on 27 counties spanning all five vintages — 4 by full download, 23 by partial-zip range fetch of the `.prj` and `.shp` header (fetching the zip's central directory tail, then range-fetching just the two entries).

```
202503 48261 Kenedy       not    GEOGCS_DEGREES       guard=True degrees=True  xmin=-97.99
202503 48173 Glasscock    not    GEOGCS_DEGREES       guard=True degrees=True  xmin=-101.79
202503 48033 Borden       not    GEOGCS_DEGREES       guard=True degrees=True  xmin=-101.69
202503 48055 Caldwell     LOADED GEOGCS_DEGREES       guard=True degrees=True  xmin=-97.90
202505 48269 King         not    PROJCS_WEBMERCATOR   guard=True degrees=False xmin=-11189891.31
202505 48301 Loving       not    PROJCS_WEBMERCATOR   guard=True degrees=False xmin=-11575383.54
202505 48431 Sterling     not    PROJCS_WEBMERCATOR   guard=True degrees=False xmin=-11273068.37
202507 48445 Terry        not    GEOGCS_DEGREES       guard=True degrees=True  xmin=-102.60
202507 48153 Floyd        not    GEOGCS_DEGREES       guard=True degrees=True  xmin=-101.57
202507 48425 Somervell    not    GEOGCS_DEGREES       guard=True degrees=True  xmin=-97.95
202507 48397 Rockwall     LOADED GEOGCS_DEGREES       guard=True degrees=True  xmin=-96.52
202508 48345 Motley       not    GEOGCS_DEGREES       guard=True degrees=True  xmin=-101.04
202508 48295 Lipscomb     not    GEOGCS_DEGREES       guard=True degrees=True  xmin=-100.55
202508 48371 Pecos        not    GEOGCS_DEGREES       guard=True degrees=True  xmin=-103.58
202508 48251 Johnson      LOADED GEOGCS_DEGREES       guard=True degrees=True  xmin=-97.65
202509 48293 Limestone    not    GEOGCS_DEGREES       guard=True degrees=True  xmin=-96.93
202509 48363 Palo Pinto   not    GEOGCS_DEGREES       guard=True degrees=True  xmin=-98.63
202509 48223 Hopkins      not    GEOGCS_DEGREES       guard=True degrees=True  xmin=-95.87
```

A widened second pass on 202505 alone, nine more counties:

```
202505 48235 Irion        not    PROJCS_WEBMERCATOR   guard=True degrees=False xmin=-11273733.35
202505 48263 Kent         not    PROJCS_WEBMERCATOR   guard=True degrees=False xmin=-11248171.68
202505 48421 Sherman      not    PROJCS_WEBMERCATOR   guard=True degrees=False xmin=-11372731.80
202505 48383 Reagan       not    PROJCS_WEBMERCATOR   guard=True degrees=False xmin=-11329673.87
202505 48247 Jim Hogg     not    PROJCS_WEBMERCATOR   guard=True degrees=False xmin=-11015905.38
202505 48011 Armstrong    not    PROJCS_WEBMERCATOR   guard=True degrees=False xmin=-11313190.69
202505 48125 Dickens      not    PROJCS_WEBMERCATOR   guard=True degrees=False xmin=-11247871.79
202505 48447 Throckmorton not    PROJCS_WEBMERCATOR   guard=True degrees=False xmin=-11073282.30
202505 48155 Foard        not    PROJCS_WEBMERCATOR   guard=True degrees=False xmin=-11137445.05
```

**The split is perfect and it tracks vintage, not rurality: 12 of 12 sampled 202505 counties are Web Mercator; 15 of 15 sampled counties on 202503, 202507, 202508 and 202509 are geographic degrees.**

That means the population at risk is **the 57 counties on the 202505 vintage** — 0.246 GB of download and 626,400 roster parcels, about 7.6 percent of the remaining parcel work. The correlation is inference for the 45 unsampled 202505 counties, not measurement; it is strong enough to plan around and not strong enough to trust at ingest time.

### Why no loaded county is affected, confirmed against the store

```sql
SELECT count(*) AS rows_outside_texas_degrees
FROM txgio_parcel
WHERE west_lng < -107 OR west_lng > -93 OR south_lat < 25 OR south_lat > 37;
```

```
 rows_outside_texas_degrees
----------------------------
                          0
```

```sql
SELECT round(min(west_lng)::numeric,4) AS min_w, round(max(east_lng)::numeric,4) AS max_e,
       round(min(south_lat)::numeric,4) AS min_s, round(max(north_lat)::numeric,4) AS max_n
FROM txgio_parcel;
```

```
  min_w   |  max_e   |  min_s  |  max_n
----------+----------+---------+---------
 -98.8100 | -96.0710 | 29.1144 | 33.4306
```

And the loaded vintages contain no 202505 at all:

```
 stratmap25-landparcels_48021_bastrop_202503     stratmap25-landparcels_48027_bell_202503
 stratmap25-landparcels_48029_bexar_202507       stratmap25-landparcels_48055_caldwell_202503
 stratmap25-landparcels_48085_collin_202503      stratmap25-landparcels_48091_comal_202503
 stratmap25-landparcels_48113_dallas_202508      stratmap25-landparcels_48121_denton_202503
 stratmap25-landparcels_48139_ellis_202507       stratmap25-landparcels_48187_guadalupe_202503
 stratmap25-landparcels_48209_hays_202503        stratmap25-landparcels_48251_johnson_202508
 stratmap25-landparcels_48257_kaufman_202503     stratmap25-landparcels_48309_mclennan_202503
 stratmap25-landparcels_48367_parker_202507      stratmap25-landparcels_48397_rockwall_202507
 stratmap25-landparcels_48439_tarrant_202507     stratmap25-landparcels_48453_travis_202508
 stratmap25-landparcels_48491_williamson_202507
```

**The existing store is clean. Zero contaminated rows, and the defect has never fired because the 202505 vintage has never been touched.** This is latent, not active.

### The fix

Two changes, both small, and the second matters more than the first.

Reject projected CRS explicitly in `assertWgs84Prj` — test that the WKT does *not* begin with `PROJCS`, rather than only testing for the datum substring. That closes this specific hole.

Then add a coordinate-range assertion that does not depend on the `.prj` at all. After computing the bbox, assert the coordinates fall within Texas's plausible degree envelope (roughly -107 to -93 longitude, 25 to 37 latitude) and fail the county otherwise. This is the durable guard: it catches a projected CRS, a missing `.prj` (currently a bare warning), a swapped axis order, and any future source change, without needing to enumerate WKT forms. It is the same fail-closed instinct the county-ledger synthesis already uses.

Reprojecting 3857 to 4326 is arithmetically trivial and could be added, but it should be a deliberate decision rather than a silent convenience, and the ingest header already states the correct posture: never silently store non-WGS84 coordinates.

---

## WHAT WOULD BLOCK THE BULK RUN

Ordered by severity.

**1. The 202505 Web Mercator projection defect. (Blocking, new this sweep.)** Fifty-seven of the 235 counties ship coordinates in meters under a `PROJCS["WGS_1984_Web_Mercator_Auxiliary_Sphere"]` whose nested `GEOGCS["GCS_WGS_1984"]` satisfies the ingest's substring guard. Nothing throws; `cellKeysForBbox` does unbounded arithmetic on meter values and would attempt to generate on the order of 9.1 trillion tile keys per parcel. Most likely symptom is an OOM crash on the first 202505 county; worst case is unreachable rows keyed in a coordinate space no reader uses. Six of the ten smallest counties — the natural first wave — are on this vintage. The fix is a `PROJCS` rejection plus a coordinate-range assertion, both small. **No 202505 county should be ingested until that assertion exists.**

**2. The hardcoded 19-county allowlist. (Blocking, confirmed unchanged.)** `TXGIO_COUNTIES` in `counties.ts:83` is still exactly the 19 loaded counties, and `resolveTxgioCounty` (`counties.ts:109`) fails closed before any network call. `txgioDownloadUrl(fips)` at `counties.ts:66` is already general, so the change is confined to resolution. Confirmed by reading the file this session; unchanged since the stocktake.

**3. The write path still has no test coverage.** Carried forward from the stocktake, not re-litigated here. `deleteCountyParcels` runs outside a transaction before the streaming insert, and the 202505 defect makes that window more dangerous, since a mid-county failure is now a realistic outcome rather than a hypothetical one. A county that deletes and then dies on a projection error is left empty rather than merely stale.

**Not blocking, and worth saying plainly.**

Storage is not a constraint. The measurement this sweep was chartered to take came back benign: 1,124.6 bytes per row measured, projecting to a 16 to 18 GB `txgio_parcel` and a 35 to 37 GB database. That is ordinary. The one caveat is that the Neon plan's storage ceiling is not visible from SQL and must be confirmed in the console.

Connections are not a constraint: 901 available, 17 in use.

Download volume is not a constraint: 4.256 GB total for the 235, median county 7.64 MB.

The attribute schema is not a constraint. This was the open question the sweep was chartered to close, and the answer is favorable: all seven required DBF fields are present in every rural sample, in identical order, across all five vintages. The 202503 archives carry two extra ArcGIS fields the ingest ignores. The statewide-uniform-schema claim in the `counties.ts` header holds.

Donley 48129 remains the single honest-absence county, 404 confirmed, and it needs a county CAD or ArcGIS override rather than a StratMap fetch.

---

## WHAT I COULD NOT DETERMINE

**Whether all 57 counties on the 202505 vintage are projected.** Twelve were measured and all twelve are Web Mercator; the other 45 are inference from a perfect vintage correlation across 27 samples. Strong enough to plan around, not strong enough to ingest on. The per-county coordinate-range assertion makes this question moot at run time, which is the argument for building it rather than finishing the sampling.

**Whether any county on 202503, 202507, 202508 or 202509 is projected.** Fifteen were sampled and all fifteen are degrees, but that is 15 of 197. The vintage correlation could be coincidence rather than a batch-processing artifact of the StratMap program. Again, a range assertion settles it per county at zero marginal cost.

**Why Bosque 48035 is a 104 MB archive for 19,975 parcels.** Twelve times the statewide median byte-per-parcel. I did not download it to find out. It could be vertex-dense geometry, a wrong roster count, or extra archive content. It should not go into an unattended wave.

**The Neon account's plan storage ceiling and autosuspend policy.** Not exposed to the `neondb_owner` role; no `neon_` catalog views are visible. The 35 to 37 GB projection is safe as a statement about the database and unverified as a statement about the billing plan. Same gap the stocktake recorded; it requires the console.

**Ingest wall-time per county, and safe write concurrency.** No timing was taken this session — taking one would have required an ingest, which was out of scope. The heavy-scan-slot question the layer-first decision left open is still open.

**Whether `txgio_parcel_staging` accumulates or is transient.** It holds 2,475,299 rows and 2.6 GB despite `n_live_tup` reporting 0 (stale statistics). I did not determine whether it is truncated between loads. If it scales with the statewide load, add its share to the projection.

**Whether `place_layer_snapshots` (10 GB, still the largest table) scales with parcel count.** Unchanged from the stocktake. If it does, it dominates statewide storage rather than `txgio_parcel`.

**Whether rural bytes-per-row holds in the deep west.** All 19 loaded counties are Texas metro or near-metro. The per-county evidence argues rural geometry is simpler, not heavier, and the archive-level bytes-per-parcel agrees — but the sparsest western counties are represented in neither the store nor the byte analysis beyond archive size.

**Whether the 8 counties flagged `HIGH_PROP_ID_BAD_RATE` / `crosswalk_risk` parse cleanly.** The roster flags 8 counties needing `geo_id_or_address_crosswalk` rather than `prop_id`. Geometry ingest does not depend on prop_id quality, so this should not block L2, but I did not sample any of the 8 and their downstream join behavior is unverified.
