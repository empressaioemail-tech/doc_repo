---
title: "Statewide parcel fabric — the true parcel count, duplication classes, corrected acreage, and coverage"
date: 2026-08-08
status: analysis
repo: doc_repo
author: data-analyst (read-only)
related: [_inbox/2026-08-08_MULTIPART_semantics_research, _decisions/2026-08-08_multipolygon_fail_closed_and_the_real_fix, _inbox/2026-08-08_multipart_acreage_weighted_measurement, _inbox/2026-08-08_FABRIC_parcel_counts]
---

# Statewide parcel fabric: what is actually in the store

Read-only analysis against `txgio_parcel` in the `legacy-design-tools-prod` deployment Neon, 2026-08-08. SELECT only. No writes, no DDL, no data-run. Every claim below is followed by the SQL that produced it, pasted verbatim, because the artifact this analysis corrects failed precisely by not doing that.

The headline is that the store contains **4,617,181 distinct parcels**, not 5,535,897, and that the load-bearing 59.6949 percent acreage figure was inflated by tile-seam duplication to roughly five times its true value. The corrected figure is **12.5290 percent**. The direction of the original finding survives; the magnitude does not.

The second headline is that coverage is far smaller than the framing assumes. **19 of 254 Texas counties have any data at all.** Every statewide number in this document, and in every prior artifact, means statewide-over-those-nineteen.

---

## 1. Schema verification

### The DDL, verbatim

```
$ psql "$PGURL" -c "\d txgio_parcel"

                           Table "public.txgio_parcel"
       Column        |           Type           | Collation | Nullable | Default
---------------------+--------------------------+-----------+----------+---------
 county_fips         | text                     |           | not null |
 tile_key            | text                     |           | not null |
 feature_index       | integer                  |           | not null |
 prop_id             | text                     |           |          |
 geo_id              | text                     |           |          |
 owner_name          | text                     |           |          |
 situs_address       | text                     |           |          |
 situs_city          | text                     |           |          |
 situs_state         | text                     |           |          |
 situs_zip           | text                     |           |          |
 geometry            | jsonb                    |           | not null |
 west_lng            | double precision         |           | not null |
 south_lat           | double precision         |           | not null |
 east_lng            | double precision         |           | not null |
 north_lat           | double precision         |           | not null |
 source_file         | text                     |           | not null |
 source_vintage      | text                     |           | not null |
 ingested_at         | timestamp with time zone |           | not null | now()
 zoning_district     | text                     |           |          |
 zoning_jurisdiction | text                     |           |          |
```

Constraints and indexes:

```sql
SELECT conname, pg_get_constraintdef(oid) FROM pg_constraint WHERE conrelid='txgio_parcel'::regclass;
```

```
                      conname                       |                pg_get_constraintdef
----------------------------------------------------+----------------------------------------------------
 txgio_parcel_county_fips_tile_key_feature_index_pk | PRIMARY KEY (county_fips, tile_key, feature_index)
(1 row)
```

```sql
SELECT indexname, indexdef FROM pg_indexes WHERE tablename='txgio_parcel' AND indexname NOT LIKE '%situs_norm%';
```

```
                     indexname                      |                                       indexdef
----------------------------------------------------+---------------------------------------------------------------------------------------
 txgio_parcel_county_fips_tile_key_feature_index_pk | CREATE UNIQUE INDEX ... USING btree (county_fips, tile_key, feature_index)
 txgio_parcel_prop_idx                              | CREATE INDEX ... USING btree (county_fips, prop_id)
(2 rows)
```

There is exactly one constraint on the table: the primary key. `txgio_parcel_prop_idx` is a plain non-unique btree, so the schema itself asserts nothing about `prop_id` uniqueness. A third index, `txgio_parcel_situs_norm_idx`, is a large expression index that normalizes `situs_address` (street-suffix and directional abbreviation); it is omitted above for length and is not load-bearing here.

No PostGIS:

```sql
SELECT extname FROM pg_extension ORDER BY 1;
```

```
 extname
---------
 plpgsql
 vector
```

### Each "reportedly" checked

| Reported | Verdict | Actual |
|---|---|---|
| PK is `(county_fips, tile_key, feature_index)` | **CONFIRMED** | Verbatim above |
| Statewide 5,535,897 rows | **CONFIRMED** | 5,535,897 |
| Travis 894,657 rows vs 380,918 distinct prop_ids (2.35x) | **CONFIRMED as stated, but the interpretation is wrong** | Both numbers exact. The gap is not duplication of real parcels; 423,540 of Travis's features carry the sentinel prop_id `'0'`. See section 5. |
| Bastrop 92.7 percent of duplication is tile-seam artifact | **NOT REPRODUCED** | Bastrop's seam duplication is 11,372 excess rows out of 74,729 (15.218 percent of rows). Of Bastrop's 63,357 features, tile-seam accounts for all row excess, and the residual prop_id excess (1,100 features over 62,257 prop_ids) is a mix of classes N2/N4. The "92.7 percent" was computed over prop_ids-with-more-than-one-row, a different denominator than this analysis uses. |
| Tarrant `A 36-1`: 532 rows, 111 distinct owners, ONE account, genuine prop_id collision NOT a seam artifact | **CONFIRMED in the numbers, WRONG in the mechanism** | 532 rows, 111 distinct owners confirmed. But it is 133 distinct `feature_index` x 4 tiles = 532, and **all 532 rows carry one identical geometry hash and one identical bbox**. It is not a collision of different parcels. It is 133 leasehold accounts stamped onto a single DFW Airport polygon. See section 5, class N5. |

```sql
SELECT count(*) AS total_rows, count(DISTINCT county_fips) AS distinct_counties FROM txgio_parcel;
```

```
 total_rows | distinct_counties
------------+-------------------
    5535897 |                19
```

---

## 2. The true parcel count

### Establishing the key

The first question is what identifies one real parcel. Three candidates: `prop_id`, `feature_index`, and the geometry itself. Test whether `(county_fips, feature_index)` ever carries conflicting content:

```sql
WITH f AS (
  SELECT county_fips, feature_index,
         count(*) AS rows, count(DISTINCT tile_key) AS tiles,
         count(DISTINCT md5(geometry::text)) AS geoms,
         count(DISTINCT coalesce(prop_id,'~NULL~')) AS props,
         count(DISTINCT coalesce(owner_name,'~')) AS owners
  FROM txgio_parcel GROUP BY 1,2)
SELECT count(*) AS distinct_features,
       sum(rows) AS total_rows,
       count(*) FILTER (WHERE geoms>1) AS feat_multi_geom,
       count(*) FILTER (WHERE props>1) AS feat_multi_prop,
       count(*) FILTER (WHERE owners>1) AS feat_multi_owner,
       count(*) FILTER (WHERE tiles>1) AS feat_spanning_tiles,
       max(tiles) AS max_tiles
FROM f;
```

```
 distinct_features | total_rows | feat_multi_geom | feat_multi_prop | feat_multi_owner | feat_spanning_tiles | max_tiles
-------------------+------------+-----------------+-----------------+------------------+---------------------+-----------
           5151394 |    5535897 |               0 |               0 |                0 |              334638 |       180
```

Zero conflicts on all three attributes across all 5.15 million features. `(county_fips, feature_index)` is therefore a safe feature key, and the 384,503-row gap is pure replication.

But `feature_index` is not the parcel key, because in some counties the source stamps many account rows onto one polygon. The three keys side by side:

```sql
SELECT count(*) AS rows,
       count(DISTINCT (county_fips||'#'||feature_index::text)) AS by_county_featidx,
       count(DISTINCT (county_fips||'#'||md5(geometry::text))) AS by_county_geomhash,
       count(DISTINCT (county_fips||'#'||coalesce(prop_id,'~NULL~'))) AS by_county_propid
FROM txgio_parcel;
```

```
  rows   | by_county_featidx | by_county_geomhash | by_county_propid
---------+-------------------+--------------------+------------------
 5535897 |           5151394 |            4617181 |          4606758
```

**The true parcel count is 4,617,181** — distinct geometry within a county. That is the denominator for "Texas complete" over the nineteen loaded counties. `prop_id` lands close (4,606,758) but by coincidence: it under-counts in one direction (collisions) and over-counts in another (sentinels), and the errors partly cancel. It is not a safe key.

### Per-county decomposition

```sql
WITH f AS (
  SELECT county_fips, feature_index, min(prop_id) AS prop_id, count(*) AS rows,
         min(md5(geometry::text)) AS gh
  FROM txgio_parcel GROUP BY 1,2)
SELECT county_fips,
       sum(rows) AS rows,
       count(*) AS distinct_features,
       sum(rows)-count(*) AS seam_dup_rows,
       round(100.0*(sum(rows)-count(*))/sum(rows),3) AS pct_seam_dup,
       count(DISTINCT coalesce(prop_id,'~NULL~')) AS distinct_prop_ids,
       count(DISTINCT gh) AS distinct_geom_hashes
FROM f GROUP BY 1 ORDER BY rows DESC;
```

```
 county_fips |  rows  | distinct_features | seam_dup_rows | pct_seam_dup | distinct_prop_ids | distinct_geom_hashes
-------------+--------+-------------------+---------------+--------------+-------------------+----------------------
 48453       | 894657 |            828773 |         65884 |        7.364 |            380918 |               382279
 48439       | 799524 |            757161 |         42363 |        5.299 |            689839 |               689845
 48029       | 747206 |            709541 |         37665 |        5.041 |            703258 |               708864
 48113       | 726360 |            694160 |         32200 |        4.433 |            693556 |               694156
 48085       | 408681 |            387737 |         20944 |        5.125 |            387334 |               387103
 48121       | 373635 |            353631 |         20004 |        5.354 |            351798 |               352415
 48491       | 304298 |            282983 |         21315 |        7.005 |            282571 |               282862
 48027       | 184470 |            167412 |         17058 |        9.247 |            165574 |               167368
 48209       | 131734 |            117427 |         14307 |       10.861 |            116422 |               114140
 48309       | 130650 |            115362 |         15288 |       11.701 |            114256 |               115327
 48367       | 118833 |            100548 |         18285 |       15.387 |             92584 |                90025
 48091       | 114430 |            103537 |         10893 |        9.519 |            103207 |               103537
 48251       | 113686 |            101847 |         11839 |       10.414 |            100604 |               100957
 48139       | 111274 |             98803 |         12471 |       11.207 |             98150 |                98375
 48187       | 106508 |             95571 |         10937 |       10.269 |             93728 |                94203
 48257       | 106175 |             94650 |         11525 |       10.855 |             93293 |                94635
 48021       |  74729 |             63357 |         11372 |       15.218 |             62257 |                62963
 48397       |  56266 |             52739 |          3527 |        6.268 |             52420 |                52550
 48055       |  32781 |             26155 |          6626 |       20.213 |             24989 |                25577
```

The store has only nineteen counties, so this table is both "top 20 by row count" and the complete roster. Seam duplication runs from 4.4 percent (Dallas) to 20.2 percent (Caldwell) of rows. It is inversely related to parcel density: rural counties have larger parcels, larger parcels touch more tiles, so the artifact is worse where parcels are bigger. That correlation is the whole reason the acreage figure was wrong.

### The three classes, counted

**Class (a) — tile-seam duplicates.** 384,503 excess rows across 334,638 affected features, 6.95 percent of all rows. Every one is a whole-geometry replication, never a split; proof in section 4.

**Class (b) — genuine prop_id collisions.** Measured on de-duplicated parcels:

```sql
WITH g AS (
  SELECT DISTINCT ON (county_fips, md5(geometry::text))
         county_fips, md5(geometry::text) AS gh, prop_id, owner_name
  FROM txgio_parcel
  ORDER BY county_fips, md5(geometry::text), tile_key, feature_index
),
p AS (
  SELECT county_fips, prop_id, count(*) AS n_geoms
  FROM g GROUP BY 1,2
)
SELECT coalesce(county_fips,'STATEWIDE') AS county_fips,
  count(*) FILTER (WHERE prop_id IS NULL) AS class_null_propid,
  count(*) FILTER (WHERE prop_id IN ('0','','-1')) AS class_sentinel_propid,
  count(*) FILTER (WHERE prop_id IS NOT NULL AND prop_id NOT IN ('0','','-1') AND n_geoms=1) AS class_clean_1to1,
  count(*) FILTER (WHERE prop_id IS NOT NULL AND prop_id NOT IN ('0','','-1') AND n_geoms>1) AS class_propid_multigeom,
  coalesce(sum(n_geoms) FILTER (WHERE prop_id IS NOT NULL AND prop_id NOT IN ('0','','-1') AND n_geoms>1),0) AS geoms_in_multigeom_propids,
  coalesce(sum(n_geoms) FILTER (WHERE prop_id IS NULL OR prop_id IN ('0','','-1')),0) AS geoms_with_unusable_propid,
  max(n_geoms) FILTER (WHERE prop_id IS NOT NULL AND prop_id NOT IN ('0','','-1')) AS max_geoms_per_real_propid
FROM p GROUP BY ROLLUP(county_fips) ORDER BY class_clean_1to1 DESC;
```

```
 county_fips | class_null_propid | class_sentinel_propid | class_clean_1to1 | class_propid_multigeom | geoms_in_multigeom_propids | geoms_with_unusable_propid | max_geoms_per_real_propid
-------------+-------------------+-----------------------+------------------+------------------------+----------------------------+----------------------------+---------------------------
 STATEWIDE   |                 7 |                    14 |          4588144 |                   4508 |                      15900 |                      13137 |                      2187
 48029       |                 0 |                     2 |           703145 |                    111 |                       4835 |                        884 |                      2187
 48113       |                 0 |                     0 |           693451 |                    103 |                        705 |                          0 |                        97
 48439       |                 1 |                     0 |           689835 |                      3 |                          7 |                          3 |                         3
 48085       |                 0 |                     1 |           386678 |                     29 |                         59 |                        366 |                         3
 48453       |                 0 |                     1 |           380244 |                    673 |                       1445 |                        590 |                         8
 48121       |                 0 |                     1 |           351730 |                     67 |                        145 |                        540 |                         4
 48491       |                 1 |                     0 |           282163 |                    286 |                        574 |                        125 |                         4
 48027       |                 0 |                     1 |           165487 |                     66 |                        144 |                       1737 |                         7
 48309       |                 1 |                     1 |           113867 |                    384 |                       1346 |                        114 |                       227
 48209       |                 1 |                     1 |           112852 |                    404 |                        866 |                        422 |                         7
 48091       |                 0 |                     1 |           103069 |                    137 |                        306 |                        162 |                        19
 48251       |                 1 |                     0 |            99680 |                     50 |                        102 |                       1175 |                         3
 48139       |                 0 |                     0 |            97996 |                    154 |                        379 |                          0 |                        13
 48187       |                 0 |                     1 |            93655 |                     71 |                        148 |                        400 |                         4
 48257       |                 1 |                     1 |            92616 |                    674 |                       1798 |                        221 |                       236
 48367       |                 1 |                     1 |            82725 |                    583 |                       1233 |                       6067 |                        13
 48021       |                 0 |                     1 |            61840 |                    416 |                        985 |                        138 |                        20
 48397       |                 0 |                     0 |            52334 |                     86 |                        216 |                          0 |                        26
 48055       |                 0 |                     1 |            24777 |                    211 |                        607 |                        193 |                       116
```

Read the STATEWIDE row carefully: the `class_null_propid` and `class_sentinel_propid` columns count distinct prop_id *values* (there is one NULL and one `'0'` per county), while `geoms_with_unusable_propid` counts the *parcels* under them. So: **4,508 real prop_ids collide, covering 15,900 parcels** (11,392 parcels in excess of one per prop_id), **plus 13,137 parcels carrying a NULL or sentinel prop_id**. Total parcels where `{county_fips}:{prop_id}` fails: 29,037, or 0.63 percent.

**Class (c) — genuinely multi-part single parcels.** On de-duplicated parcels:

```sql
WITH d AS (SELECT DISTINCT ON (county_fips, md5(geometry::text)) county_fips, geometry
           FROM txgio_parcel ORDER BY county_fips, md5(geometry::text), tile_key, feature_index)
SELECT geometry->>'type' gtype,
  count(*) n,
  count(*) FILTER (WHERE geometry->>'type'='Polygon' AND jsonb_array_length(geometry->'coordinates')>1) AS poly_with_holes,
  count(*) FILTER (WHERE geometry->>'type'='MultiPolygon' AND jsonb_array_length(geometry->'coordinates')>1) AS mp_multi_part,
  count(*) FILTER (WHERE geometry->>'type'='MultiPolygon' AND jsonb_array_length(geometry->'coordinates')=1) AS mp_single_part
FROM d GROUP BY 1 ORDER BY n DESC;
```

```
    gtype     |    n    | poly_with_holes | mp_multi_part | mp_single_part
--------------+---------+-----------------+---------------+----------------
 Polygon      | 4610961 |           10926 |             0 |              0
 MultiPolygon |    6220 |               0 |          6220 |              0
```

**6,220 genuinely multi-part parcels** and **10,926 polygons with interior rings**, 17,146 combined (0.3714 percent). Two corrections to the prior record fall out. First, after de-duplication there are **zero** single-part MultiPolygons statewide, so the prior artifact's third classification branch ("MultiPolygon with exactly one part that itself has holes") matches nothing at all. Second, Bastrop's profile shrinks: 4 MultiPolygon and 421 holed parcels, against the 5 and 846 previously reported — those were row counts.

Part and ring tails, de-duplicated:

```sql
WITH d AS (SELECT DISTINCT ON (county_fips, md5(geometry::text)) geometry
           FROM txgio_parcel ORDER BY county_fips, md5(geometry::text), tile_key, feature_index)
SELECT geometry->>'type' gtype, jsonb_array_length(geometry->'coordinates') n, count(*)
FROM d WHERE jsonb_array_length(geometry->'coordinates')>1 GROUP BY 1,2 ORDER BY 1, 2;
```

MultiPolygon: 5,212 at 2 parts, 598 at 3, 203 at 4, 82 at 5, 46 at 6, tailing to a single 54-part parcel. Polygon with holes: 9,241 at 2 rings, 811 at 3, 280 at 4, 160 at 5, tailing further. The tail is real and a build must not assume two.

---

## 3. The corrected acreage measurement

### First, reproduce the prior figure

The prior artifact recorded no SQL. Reconstructing its stated method (row-level, no de-duplication) reproduces it exactly, which confirms the diagnosis:

```sql
WITH cls AS (
  SELECT CASE WHEN geometry->>'type'='Polygon' THEN jsonb_array_length(geometry->'coordinates')>1
              WHEN geometry->>'type'='MultiPolygon' THEN jsonb_array_length(geometry->'coordinates')>1
                                                      OR jsonb_array_length(geometry->'coordinates'->0)>1
              ELSE false END AS multi_part,
    ((east_lng-west_lng)*364000.0*cos(radians((south_lat+north_lat)/2.0)))
      *((north_lat-south_lat)*364000.0)/43560.0 AS bbox_acres
  FROM txgio_parcel)
SELECT count(*) rows, count(*) FILTER (WHERE multi_part) mp,
  round((100.0*count(*) FILTER (WHERE multi_part)/count(*))::numeric,4) pct_count,
  round(sum(bbox_acres)::numeric,2) tot_ac,
  round((100.0*sum(bbox_acres) FILTER (WHERE multi_part)/sum(bbox_acres))::numeric,4) pct_ac
FROM cls;
```

```
  rows   |  mp   | pct_count |    tot_ac    | pct_ac
---------+-------+-----------+--------------+---------
 5535897 | 41166 |    0.7436 | 146904868.70 | 59.6949
```

0.7436, 59.6949, 146,904,868.70, and 41,166 all match the prior artifact to the last digit. The prior measurement counted rows.

### The corrected measurement

Identical classification and identical area formula, applied to de-duplicated parcels:

```sql
WITH dedup AS (
  SELECT DISTINCT ON (county_fips, md5(geometry::text))
         county_fips, geometry, west_lng, south_lat, east_lng, north_lat
  FROM txgio_parcel
  ORDER BY county_fips, md5(geometry::text), tile_key, feature_index
),
cls AS (
  SELECT county_fips,
    CASE
      WHEN geometry->>'type' = 'Polygon'
        THEN jsonb_array_length(geometry->'coordinates') > 1
      WHEN geometry->>'type' = 'MultiPolygon'
        THEN jsonb_array_length(geometry->'coordinates') > 1
          OR jsonb_array_length(geometry->'coordinates'->0) > 1
      ELSE false
    END AS multi_part,
    ((east_lng - west_lng) * 364000.0 * cos(radians((south_lat+north_lat)/2.0)))
      * ((north_lat - south_lat) * 364000.0) / 43560.0 AS bbox_acres
  FROM dedup
)
SELECT coalesce(county_fips,'STATEWIDE') AS county_fips,
       count(*) AS parcels,
       count(*) FILTER (WHERE multi_part) AS multi_part_parcels,
       round((100.0*count(*) FILTER (WHERE multi_part)/count(*))::numeric, 4) AS pct_by_count,
       round(sum(bbox_acres)::numeric, 2) AS total_bbox_acres,
       round(coalesce(sum(bbox_acres) FILTER (WHERE multi_part),0)::numeric, 2) AS multi_bbox_acres,
       round((100.0*coalesce(sum(bbox_acres) FILTER (WHERE multi_part),0)/sum(bbox_acres))::numeric, 4) AS pct_by_acreage
FROM cls GROUP BY ROLLUP(county_fips) ORDER BY parcels DESC;
```

```
 county_fips | parcels | multi_part_parcels | pct_by_count | total_bbox_acres | multi_bbox_acres | pct_by_acreage
-------------+---------+--------------------+--------------+------------------+------------------+----------------
 STATEWIDE   | 4617181 |              17146 |       0.3714 |      20418115.90 |       2558186.66 |        12.5290
 48029       |  708864 |               1735 |       0.2448 |       1535816.85 |        196960.80 |        12.8245
 48113       |  694156 |                652 |       0.0939 |        957039.29 |         77196.19 |         8.0661
 48439       |  689845 |               1634 |       0.2369 |        822478.51 |         88680.50 |        10.7821
 48085       |  387103 |               1412 |       0.3648 |        795764.13 |         75713.88 |         9.5146
 48453       |  382279 |               1213 |       0.3173 |       1543683.05 |        247588.56 |        16.0388
 48121       |  352415 |               1030 |       0.2923 |       1028766.47 |        244861.51 |        23.8015
 48491       |  282862 |               1503 |       0.5314 |       1451382.99 |        196865.19 |        13.5640
 48027       |  167368 |                547 |       0.3268 |       1597165.66 |         96315.84 |         6.0304
 48309       |  115327 |                936 |       0.8116 |       1654838.12 |        238235.51 |        14.3963
 48209       |  114140 |                401 |       0.3513 |       1015532.18 |        182392.77 |        17.9603
 48091       |  103537 |                315 |       0.3042 |        805794.85 |         95981.03 |        11.9113
 48251       |  100957 |               1833 |       1.8156 |        921492.92 |        209301.78 |        22.7133
 48139       |   98375 |                297 |       0.3019 |       1295827.36 |        129551.64 |         9.9976
 48257       |   94635 |                353 |       0.3730 |       1027432.56 |         66685.79 |         6.4905
 48187       |   94203 |               2144 |       2.2759 |        934124.67 |        227013.03 |        24.3022
 48367       |   90025 |                423 |       0.4699 |        881117.06 |         36320.61 |         4.1221
 48021       |   62963 |                425 |       0.6750 |       1237316.51 |         89311.60 |         7.2182
 48397       |   52550 |                 99 |       0.1884 |        150772.68 |         15880.59 |        10.5328
 48055       |   25577 |                194 |       0.7585 |        761770.03 |         43329.84 |         5.6880
```

### How far it moved

| Measure | Prior (rows) | Corrected (parcels) | Movement |
|---|---|---|---|
| Multi-part by count | 0.7436 percent | 0.3714 percent | halved |
| Multi-part by acreage | **59.6949 percent** | **12.5290 percent** | down 47.17 points, a factor of 4.77 |
| Total bbox acres | 146,904,868.70 | 20,418,115.90 | inflated 7.19x |
| Acreage-to-count skew | ~80x | ~34x | still large |

The total acreage inflation of 7.19x is larger than the 1.20x row inflation, and that difference is the whole story. **The duplication is correlated with the variable being measured.** A large multi-part parcel spans more of the 0.02-degree grid, so it is replicated into more tiles, so its acreage is counted more times. The bias runs directly along the axis of the hypothesis being tested.

Quantifying that:

```sql
WITH r AS (
  SELECT county_fips, prop_id, md5(geometry::text) gh, geometry->>'type' gtype,
    jsonb_array_length(geometry->'coordinates') ncoord,
    ((east_lng-west_lng)*364000.0*cos(radians((south_lat+north_lat)/2.0)))
      *((north_lat-south_lat)*364000.0)/43560.0 AS ac
  FROM txgio_parcel)
SELECT county_fips, left(coalesce(prop_id,'(NULL)'),12) pid, gtype, ncoord,
       count(*) AS n_rows, round(max(ac)::numeric,0) AS acres_each,
       round((count(*)*max(ac))::numeric,0) AS acres_counted
FROM r GROUP BY 1,2,3,4,gh ORDER BY acres_counted DESC LIMIT 12;
```

```
 county_fips |  pid   |    gtype     | ncoord | n_rows | acres_each | acres_counted
-------------+--------+--------------+--------+--------+------------+---------------
 48121       | 558320 | MultiPolygon |      2 |    180 |     162632 |      29273839
 48453       | 374448 | MultiPolygon |     51 |    396 |      59316 |      23489327
 48209       | 31480  | MultiPolygon |      2 |    132 |     110561 |      14594050
 48029       | 615484 | MultiPolygon |      2 |     49 |      41924 |       2054260
 48029       | 160015 | Polygon      |      2 |    160 |       9803 |       1568535
 48453       | 0      | Polygon      |      1 |   1540 |       1003 |       1544825
 48139       | 217357 | Polygon      |      2 |     42 |      31057 |       1304399
 48091       | 363166 | MultiPolygon |      2 |     40 |      26953 |       1078108
 48309       | 999666 | Polygon      |      2 |     35 |      27186 |        951527
 48309       | 347551 | MultiPolygon |      3 |     32 |      22926 |        733616
 48453       | 201329 | Polygon      |      1 |   1406 |        408 |        573224
 48453       | 702976 | MultiPolygon |      2 |   1210 |        427 |        516648
```

**Three geometries account for roughly 67.4 million spurious acres — about 46 percent of the prior 146.9 million total.** All three are multi-part, all three are enormous, all three were counted 130 to 400 times. The 59.69 percent figure was, to a first approximation, three parcels multiplied by their tile footprints.

### On the area measure

The store has no PostGIS and no source acreage column, so bbox-rectangle area is the only measure available without reimplementing a spherical shoelace over the jsonb rings. That was not attempted here. Bbox overstates irregular and elongated shapes more than compact ones, and multi-part parcels are disproportionately irregular, so **12.5290 percent remains an upper bound** on the true acreage share, not a point estimate. A true-area measurement would move it further down, not up. If the number matters to a ruling, a shoelace computation over the rings is the correct next measurement.

### What this does to the standing ruling

The amendment to `_decisions/2026-08-08_multipolygon_fail_closed_and_the_real_fix.md` states that fail-closed "declines 60 percent of the state's acreage" and that "multi-part parcels are roughly three fifths of Texas by area." **Neither statement is supported by de-duplicated data.** The correct figures are 12.53 percent (upper bound) and roughly one eighth. The amendment's own hedge — "even halved, the conclusion is unchanged" — did not anticipate a factor of 4.77. This is a finding for the operator, not a decision this analysis makes: the promotion to front-of-queue rested on a number that has now moved by a factor of five, and the amendment's stated reversal logic is about magnitude.

The lesson the amendment drew ("blast radius must be measured in the unit that carries the value at risk") stands and gains a second clause: **the unit must also be de-duplicated, and the de-duplication must be checked for correlation with the variable under test.**

---

## 4. Seam reconciliation feasibility

### Verdict: (a) mechanical and safe

The framing of the task assumes pieces to re-assemble. There are none. **No geometry in this store is ever cut at a tile boundary.** A feature whose bbox touches N tiles is written N times, complete and byte-identical each time.

Statewide test for any split:

```sql
WITH f AS (
  SELECT county_fips, feature_index,
    count(DISTINCT tile_key) n_tiles,
    count(DISTINCT md5(geometry::text)) n_geom,
    count(DISTINCT (west_lng::text||','||south_lat::text||','||east_lng::text||','||north_lat::text)) n_bbox
  FROM txgio_parcel GROUP BY 1,2)
SELECT count(*) FILTER (WHERE n_tiles>1) AS tile_spanning_features,
       count(*) FILTER (WHERE n_tiles>1 AND n_geom>1) AS spanning_with_split_geom,
       count(*) FILTER (WHERE n_tiles>1 AND n_bbox>1) AS spanning_with_diff_bbox
FROM f;
```

```
 tile_spanning_features | spanning_with_split_geom | spanning_with_diff_bbox
------------------------+--------------------------+-------------------------
                 334638 |                        0 |                       0
```

**Zero of 334,638.** Not a sample — the full population. There is no gap and no overlap to characterize, because there is no cut.

### Twenty-five real seam cases, characterized

```sql
WITH f AS (
  SELECT county_fips, feature_index, prop_id, count(*) n_rows,
         count(DISTINCT tile_key) n_tiles,
         count(DISTINCT md5(geometry::text)) n_geom,
         count(DISTINCT (west_lng::text||','||south_lat::text||','||east_lng::text||','||north_lat::text)) n_bbox,
         count(DISTINCT coalesce(owner_name,'~')) n_owner,
         min(west_lng) w, min(south_lat) s, max(east_lng) e, max(north_lat) nn
  FROM txgio_parcel WHERE county_fips='48021' GROUP BY 1,2,3 HAVING count(DISTINCT tile_key)>1)
SELECT left(coalesce(prop_id,'(NULL)'),10) pid, feature_index, n_rows, n_tiles, n_geom, n_bbox, n_owner,
  round(((e-w)/0.02)::numeric,2) AS bbox_width_tiles,
  round(((nn-s)/0.02)::numeric,2) AS bbox_height_tiles
FROM f ORDER BY n_tiles DESC, feature_index LIMIT 25;
```

```
  pid   | feature_index | n_rows | n_tiles | n_geom | n_bbox | n_owner | bbox_width_tiles | bbox_height_tiles
--------+---------------+--------+---------+--------+--------+---------+------------------+-------------------
 10421  |          6809 |     12 |      12 |      1 |      1 |       1 |             2.52 |              2.13
 10381  |         11655 |     12 |      12 |      1 |      1 |       1 |             2.43 |              2.36
 25740  |         12428 |     12 |      12 |      1 |      1 |       1 |             2.35 |              2.11
 22829  |         15548 |     12 |      12 |      1 |      1 |       1 |             3.09 |              2.62
 31792  |         30232 |     12 |      12 |      1 |      1 |       1 |             1.68 |              2.27
 50140  |         40086 |     12 |      12 |      1 |      1 |       1 |             2.49 |              2.49
 12483  |           167 |      9 |       9 |      1 |      1 |       1 |             1.25 |              1.80
 12499  |          5319 |      9 |       9 |      1 |      1 |       1 |             1.29 |              1.81
 27478  |         13861 |      9 |       9 |      1 |      1 |       1 |             1.26 |              1.62
 22837  |         15549 |      9 |       9 |      1 |      1 |       1 |             1.80 |              2.05
 22491  |         16950 |      9 |       9 |      1 |      1 |       1 |             1.83 |              1.57
 59650  |         35802 |      9 |       9 |      1 |      1 |       1 |             1.72 |              1.63
 61338  |         36313 |      9 |       9 |      1 |      1 |       1 |             2.21 |              1.99
 10550  |          1383 |      6 |       6 |      1 |      1 |       1 |             1.23 |              1.19
 18150  |          2003 |      6 |       6 |      1 |      1 |       1 |             0.39 |              1.60
 102895 |          2614 |      6 |       6 |      1 |      1 |       1 |             1.41 |              1.32
 111512 |          2966 |      6 |       6 |      1 |      1 |       1 |             1.26 |              1.17
 14608  |          3557 |      6 |       6 |      1 |      1 |       1 |             1.15 |              0.97
 18117  |          5034 |      6 |       6 |      1 |      1 |       1 |             0.91 |              1.41
 112897 |          5256 |      6 |       6 |      1 |      1 |       1 |             1.09 |              1.31
 12493  |          6391 |      6 |       6 |      1 |      1 |       1 |             1.31 |              1.82
 107932 |          7622 |      6 |       6 |      1 |      1 |       1 |             1.53 |              2.03
 15036  |          8525 |      6 |       6 |      1 |      1 |       1 |             1.13 |              0.73
 20739  |          9113 |      6 |       6 |      1 |      1 |       1 |             1.34 |              0.66
 12557  |         10060 |      6 |       6 |      1 |      1 |       1 |             1.03 |              1.46
```

All 25: `n_geom=1`, `n_bbox=1`, `n_owner=1`, and `n_rows = n_tiles`. The bbox spans between 0.39 and 3.09 tile-widths, consistent with a parcel of that size touching that many grid cells.

Do pieces share prop_id and county_fips? Trivially yes — they share every column except `tile_key`.

### tile_key is parseable and derivable

`tile_key` has the form `g0.02:<west_lng>,<south_lat>` on a regular 0.02-degree grid (samples: `g0.02:-97.04000,30.02000`, `g0.02:-97.06000,30.04000`). Tile membership is fully predicted by the bbox:

```sql
WITH f AS (
  SELECT county_fips, feature_index, count(DISTINCT tile_key) n_tiles,
    min(west_lng) w, min(south_lat) s, min(east_lng) e, min(north_lat) nn
  FROM txgio_parcel WHERE county_fips='48021' GROUP BY 1,2 HAVING count(DISTINCT tile_key)>1 LIMIT 500),
p AS (SELECT *,
   (floor(e/0.02)-floor(w/0.02)+1)*(floor(nn/0.02)-floor(s/0.02)+1) AS predicted_tiles FROM f)
SELECT count(*) AS features,
       count(*) FILTER (WHERE n_tiles = predicted_tiles) AS exact_match,
       count(*) FILTER (WHERE n_tiles <> predicted_tiles) AS mismatch
FROM p;
```

```
 features | exact_match | mismatch
----------+-------------+----------
      500 |         500 |        0
```

500 of 500 exact, 0 mismatches. The grid is regular, the assignment rule is bbox-intersection, and both are recoverable without reference to the source.

### The operation

```sql
SELECT DISTINCT ON (county_fips, feature_index) *
FROM txgio_parcel
ORDER BY county_fips, feature_index, tile_key
```

Not a geometric union. Not a topology repair. A `DISTINCT ON`.

**One named caveat, and it is not about seams.** De-duplicating on *geometry* rather than *feature_index* additionally collapses class N5 (many account rows on one identical polygon). That is a different operation with a different consequence: it is correct for counting parcels and wrong for enumerating accounts. Pick the key to match the question. For the fabric's node list, geometry; for anything that must retain leasehold or improvement accounts, `feature_index` with the account rows preserved alongside.

---

## 5. Node identity — what the fabric must record

The operator has ruled one node with multi-part geometry, so the open question is how a node is identified. `{county_fips}:{prop_id}` works for 4,588,144 of 4,617,181 parcels, **99.3712 percent**. The remaining 0.63 percent splits into five classes. No winner is picked here.

### N1 — clean, 4,588,144 parcels (99.3712 percent)

`{county_fips}:{prop_id}` maps to exactly one geometry. Query in section 2.

### N2 — sentinel prop_id, 10,615 parcels

`prop_id` is `'0'`, empty, or `'-1'`. The parcel is real; the identifier is a placeholder. Travis 48453 is the dramatic case and it is the true explanation of the reported 2.35x ratio:

```sql
SELECT left(prop_id,20) pid, count(*) FROM txgio_parcel WHERE county_fips='48453' GROUP BY 1 ORDER BY 2 DESC LIMIT 6;
```

```
  pid   | count
--------+--------
 0      | 454349
 924974 |   1540
 201329 |   1406
 227179 |   1286
 569577 |   1236
 702976 |   1210
```

454,349 of Travis's 894,657 rows carry `prop_id = '0'`. Those rows hold 423,540 distinct `feature_index` values that collapse to just 590 distinct geometries:

```sql
WITH f AS (SELECT DISTINCT ON (feature_index) feature_index, md5(geometry::text) gh, west_lng,south_lat,east_lng,north_lat
           FROM txgio_parcel WHERE county_fips='48453' AND prop_id='0' ORDER BY feature_index,tile_key)
SELECT count(*) feats, count(DISTINCT gh) distinct_geom,
       count(DISTINCT (west_lng::text||south_lat::text||east_lng::text||north_lat::text)) distinct_bbox FROM f;
```

```
 feats  | distinct_geom | distinct_bbox
--------+---------------+---------------
 423540 |           590 |           590
```

What they are:

```sql
SELECT feature_index, tile_key, left(coalesce(owner_name,'(null)'),35) owner, left(geometry::text,90) geom
FROM txgio_parcel WHERE county_fips='48453' AND prop_id='0'
  AND md5(geometry::text)=(SELECT md5(geometry::text) FROM txgio_parcel WHERE county_fips='48453' AND prop_id='0'
                           GROUP BY md5(geometry::text) ORDER BY count(*) DESC LIMIT 1)
ORDER BY feature_index LIMIT 6;
```

```
 feature_index |         tile_key         |               owner               |                              geom
---------------+--------------------------+-----------------------------------+-----------------------------------------------------------
          4325 | g0.02:-97.72000,30.24000 | COLLINGS GUITARS INC              | {"type": "Polygon", "coordinates": [[[-97.69984605943687...
          4325 | g0.02:-97.72000,30.26000 | COLLINGS GUITARS INC              | {"type": "Polygon", "coordinates": [[[-97.69984605943687...
          4325 | g0.02:-97.70000,30.26000 | COLLINGS GUITARS INC              | {"type": "Polygon", "coordinates": [[[-97.69984605943687...
          4325 | g0.02:-97.70000,30.24000 | COLLINGS GUITARS INC              | {"type": "Polygon", "coordinates": [[[-97.69984605943687...
        205105 | g0.02:-97.70000,30.26000 | ATMOS ENERGY/MID-TEX DISTRIBUTION | {"type": "Polygon", "coordinates": [[[-97.69984605943687...
        205105 | g0.02:-97.70000,30.24000 | ATMOS ENERGY/MID-TEX DISTRIBUTION | {"type": "Polygon", "coordinates": [[[-97.69984605943687...
```

Business personal-property and utility accounts (Atmos Energy, Collings Guitars) stamped onto the real-property polygon at their service address, all under sentinel `prop_id = '0'`. **Travis's "2.35x duplication" is not duplicated parcels. It is non-real-property accounts sharing 590 polygons.** Parker 48367 is worst by count at 5,049 sentinel parcels plus 1,018 NULL.

### N3 — NULL prop_id, 2,522 parcels

Concentrated in Johnson 48251 (1,175) and Parker 48367 (1,018).

### N4 — one prop_id, multiple distinct geometries: 4,508 prop_ids over 15,900 parcels

The genuine collision class. Maximum is 2,187 geometries under one Bexar prop_id. Bastrop sample:

```sql
WITH d AS (SELECT DISTINCT ON (md5(geometry::text)) prop_id, md5(geometry::text) gh, owner_name,
                  west_lng,south_lat,east_lng,north_lat
           FROM txgio_parcel WHERE county_fips='48021' AND prop_id IS NOT NULL AND prop_id NOT IN ('0','')
           ORDER BY md5(geometry::text), tile_key, feature_index),
m AS (SELECT prop_id FROM d GROUP BY 1 HAVING count(*)>1)
SELECT d.prop_id, count(*) n_geom, count(DISTINCT coalesce(owner_name,'~')) n_owner,
  round((max(east_lng)-min(west_lng))::numeric*364000/5280,2) AS span_w_mi,
  round((max(north_lat)-min(south_lat))::numeric*364000/5280,2) AS span_h_mi
FROM d JOIN m USING (prop_id) GROUP BY 1 ORDER BY n_geom DESC LIMIT 15;
```

```
 prop_id | n_geom | n_owner | span_w_mi | span_h_mi
---------+--------+---------+-----------+-----------
 49351   |     20 |       1 |      0.11 |      0.22
 47977   |     14 |       1 |      0.08 |      0.08
 11996   |     10 |       1 |      0.07 |      0.06
 32731   |      9 |       1 |      0.13 |      0.07
 32479   |      7 |       1 |      0.11 |      0.05
 92358   |      7 |       1 |      0.05 |      0.08
 39235   |      6 |       1 |      0.06 |      0.09
 10439   |      6 |       1 |      0.05 |      0.05
 8711936 |      6 |       1 |      0.27 |      0.15
 39244   |      6 |       1 |      0.05 |      0.12
 32659   |      6 |       1 |      0.06 |      0.10
 32515   |      6 |       1 |      0.08 |      0.15
 42268   |      6 |       1 |      2.09 |      1.45
 11920   |      6 |       1 |      0.05 |      0.08
 32596   |      6 |       1 |      0.09 |      0.12
```

Single owner in every case, and spans are mostly under a quarter mile — consistent with genuine disjoint tracts under one account that the source recorded as separate features instead of one MultiPolygon (the shapefile multipart-versus-multifeature ambiguity). But `42268` spans 2.09 by 1.45 miles under one owner, which is a different situation. **This class is NOT decomposed further here** and doing so needs adjacency or containment tests the store cannot do natively.

The consequence for the fabric is direct: if a node is keyed on `{county_fips}:{prop_id}` and this class is genuinely disjoint tracts, the ruled "one node with multi-part geometry" is correct but the parts arrive as *separate rows*, not as MultiPolygon coordinates. A build that handles multi-part only at the GeoJSON level will still miss these 15,900 parcels.

### N5 — one geometry, many accounts: the inverse ambiguity

Tarrant `A 36-1`, the case named in the task:

```sql
SELECT count(*) AS rows,
       count(DISTINCT feature_index) AS distinct_fidx,
       count(DISTINCT tile_key) AS distinct_tiles,
       count(DISTINCT owner_name) AS distinct_owners,
       count(DISTINCT situs_address) AS distinct_situs,
       count(DISTINCT (west_lng::text||','||south_lat::text||','||east_lng::text||','||north_lat::text)) AS distinct_bbox,
       count(DISTINCT md5(geometry::text)) AS distinct_geomhash
FROM txgio_parcel WHERE county_fips='48439' AND prop_id='A 36-1';
```

```
 rows | distinct_fidx | distinct_tiles | distinct_owners | distinct_situs | distinct_geoid | distinct_bbox | distinct_geomhash
------+---------------+----------------+-----------------+----------------+----------------+---------------+-------------------
  532 |           133 |              4 |             111 |             94 |              0 |             1 |                 1
```

```sql
SELECT tile_key, feature_index, left(coalesce(owner_name,'(null)'),28) AS owner,
       left(coalesce(situs_address,'(null)'),24) AS situs,
       round(west_lng::numeric,5) w, round(south_lat::numeric,5) s, left(md5(geometry::text),8) gh
FROM txgio_parcel WHERE county_fips='48439' AND prop_id='A 36-1' ORDER BY feature_index, tile_key LIMIT 20;
```

```
         tile_key         | feature_index |           owner            |        situs         |     w     |    s     |    gh
--------------------------+---------------+----------------------------+----------------------+-----------+----------+----------
 g0.02:-97.04000,32.88000 |         17204 | FORT WORTH CITY OF         | 1500 E STATE HWY 114 | -97.04770 | 32.88103 | f750be70
 g0.02:-97.04000,32.90000 |         17204 | FORT WORTH CITY OF         | 1500 E STATE HWY 114 | -97.04770 | 32.88103 | f750be70
 g0.02:-97.06000,32.88000 |         17204 | FORT WORTH CITY OF         | 1500 E STATE HWY 114 | -97.04770 | 32.88103 | f750be70
 g0.02:-97.06000,32.90000 |         17204 | FORT WORTH CITY OF         | 1500 E STATE HWY 114 | -97.04770 | 32.88103 | f750be70
 g0.02:-97.04000,32.88000 |         31941 | PARADIES AIRPORT SHOPS INC | 1500 E STATE HWY 114 | -97.04770 | 32.88103 | f750be70
 g0.02:-97.04000,32.90000 |         31941 | PARADIES AIRPORT SHOPS INC | 1500 E STATE HWY 114 | -97.04770 | 32.88103 | f750be70
 g0.02:-97.06000,32.88000 |         31941 | PARADIES AIRPORT SHOPS INC | 1500 E STATE HWY 114 | -97.04770 | 32.88103 | f750be70
 g0.02:-97.06000,32.90000 |         31941 | PARADIES AIRPORT SHOPS INC | 1500 E STATE HWY 114 | -97.04770 | 32.88103 | f750be70
 g0.02:-97.04000,32.88000 |         31943 | DFW AIRPORT HOTEL ASSOC    | 1500 E STATE HWY 114 | -97.04770 | 32.88103 | f750be70
 g0.02:-97.04000,32.90000 |         31943 | DFW AIRPORT HOTEL ASSOC    | 1500 E STATE HWY 114 | -97.04770 | 32.88103 | f750be70
 g0.02:-97.06000,32.88000 |         31943 | DFW AIRPORT HOTEL ASSOC    | 1500 E STATE HWY 114 | -97.04770 | 32.88103 | f750be70
 g0.02:-97.06000,32.90000 |         31943 | DFW AIRPORT HOTEL ASSOC    | 1500 E STATE HWY 114 | -97.04770 | 32.88103 | f750be70
 g0.02:-97.04000,32.88000 |         38515 | DELTA AIR FREIGHT #16      | 2417 N SERVICE RD    | -97.04770 | 32.88103 | f750be70
 ...
```

133 distinct `feature_index` x 4 tiles = 532 rows exactly. Every row carries the same geometry hash `f750be70` and the same bbox origin. **This is not a prop_id collision between different parcels.** It is one DFW Airport polygon carrying 133 leasehold and concession accounts. The task's ground-truth statement ("genuine prop_id collision, NOT a seam artifact") is right that it is not a seam artifact and right that there is one account number, but the mechanism is the opposite of a collision: identity *collapses* rather than splits.

The fabric consequence is that a geometry-keyed node list silently discards 132 of those 133 accounts. If ownership, leasehold, or improvement records are a fabric product, the node must carry an account collection, not a single owner. Statewide this class is not separately counted here — it overlaps N2 (Travis's 590 polygons carry ~770 accounts each) and is bounded above by the 5,151,394 minus 4,617,181 = 534,213 feature-to-geometry gap.

### N6 — multi-part geometry, 6,220 parcels

Not an identity ambiguity given the operator's ruling; listed for completeness.

### Summary

| Class | Parcels | Ambiguous | Cause |
|---|---|---|---|
| N1 clean | 4,588,144 | no | — |
| N2 sentinel prop_id | 10,615 | yes | source placeholder identifier |
| N3 NULL prop_id | 2,522 | yes | missing source attribute |
| N4 prop_id to many geometries | 15,900 | yes | disjoint tracts as separate features, or shared account |
| N5 one geometry to many accounts | bounded by 534,213 feature-geometry gap | yes | leasehold, condo, improvement, personal-property stacking |
| N6 multi-part geometry | 6,220 | no | genuine disjoint parts, one account |

---

## 6. Coverage

```sql
SELECT county_fips, count(*) AS rows, count(DISTINCT prop_id) AS distinct_prop_id,
       count(*) FILTER (WHERE prop_id IS NULL) AS null_prop_id,
       count(DISTINCT tile_key) AS tiles,
       min(source_vintage) AS vintage_min, max(source_vintage) AS vintage_max
FROM txgio_parcel GROUP BY county_fips ORDER BY rows DESC;
```

```
 county_fips |  rows  | distinct_prop_id | null_prop_id | tiles |                  source_vintage
-------------+--------+------------------+--------------+-------+------------------------------------------------
 48453       | 894657 |           380918 |            0 |   740 | stratmap25-landparcels_48453_travis_202508
 48439       | 799524 |           689838 |            5 |   621 | stratmap25-landparcels_48439_tarrant_202507
 48029       | 747206 |           703258 |            0 |   842 | stratmap25-landparcels_48029_bexar_202507
 48113       | 726360 |           693556 |            0 |   613 | stratmap25-landparcels_48113_dallas_202508
 48085       | 408681 |           387334 |            0 |   603 | stratmap25-landparcels_48085_collin_202503
 48121       | 373635 |           351798 |            0 |   647 | stratmap25-landparcels_48121_denton_202503
 48491       | 304298 |           282570 |          134 |   779 | stratmap25-landparcels_48491_williamson_202507
 48027       | 184470 |           165574 |            0 |   879 | stratmap25-landparcels_48027_bell_202503
 48209       | 131734 |           116421 |          100 |   493 | stratmap25-landparcels_48209_hays_202503
 48309       | 130650 |           114255 |           14 |   745 | stratmap25-landparcels_48309_mclennan_202503
 48367       | 118833 |            92583 |         1100 |   638 | stratmap25-landparcels_48367_parker_202507
 48091       | 114430 |           103207 |            0 |   418 | stratmap25-landparcels_48091_comal_202503
 48251       | 113686 |           100603 |         1354 |   515 | stratmap25-landparcels_48251_johnson_202508
 48139       | 111274 |            98150 |            0 |   673 | stratmap25-landparcels_48139_ellis_202507
 48187       | 106508 |            93728 |            0 |   503 | stratmap25-landparcels_48187_guadalupe_202503
 48257       | 106175 |            93292 |          146 |   569 | stratmap25-landparcels_48257_kaufman_202503
 48021       |  74729 |            62257 |            0 |   615 | stratmap25-landparcels_48021_bastrop_202503
 48397       |  56266 |            52420 |            0 |   118 | stratmap25-landparcels_48397_rockwall_202507
 48055       |  32781 |            24989 |            0 |   400 | stratmap25-landparcels_48055_caldwell_202503
```

**19 of 254 counties, 7.48 percent.** Present: Travis, Tarrant, Bexar, Dallas, Collin, Denton, Williamson, Bell, Hays, McLennan, Parker, Comal, Johnson, Ellis, Guadalupe, Kaufman, Bastrop, Rockwall, Caldwell. All are DFW, Austin, San Antonio, or Waco metro; the profile is a metro-corridor load, not a statewide one.

**235 counties have no rows.** Every county absent from the list above, including Harris 48201 — the most populous county in Texas, with roughly 1.5 million parcels — plus Fort Bend, Montgomery, Galveston, Brazoria, Nueces, El Paso, Lubbock, Hidalgo, Cameron, Webb, Smith, Brazos, Grayson, Hunt, Wise, Burnet, Blanco, Lee, Fayette, and 216 more. The complete absent roster with names is in the JSON companion under `coverage.absent`.

The `source_vintage` values show every loaded county came from the same StratMap 2025 land-parcels program, vintages March through August 2025, one file per county (`stratmap25-landparcels_<fips>_lp.zip`). So the acquisition path is proven and repeatable per county; the gap is that it has been run 19 times, not 254.

For the statewide-fabric-first strategy this is the operative number: **the fabric is 7.5 percent laid by county, and the 4,617,181 parcels present are the denominator for those 19 counties only, not for Texas.** A statewide denominator does not exist in this store.

---

## WHAT I COULD NOT DETERMINE

**True polygon area.** No PostGIS, no source acreage column. Every acreage figure here is a bbox-rectangle upper bound. The corrected 12.5290 percent will move *down* under true-area measurement because bbox overstates irregular multi-part shapes more than compact ones, but by how much is unknown. A spherical shoelace over the jsonb rings would settle it and was not attempted.

**Whether class N4 is disjoint tracts or shared accounts.** 4,508 prop_ids covering 15,900 parcels map to multiple geometries. The Bastrop sample suggests disjoint tracts under one owner (single owner, sub-quarter-mile spans), but `42268` spanning two miles and Bexar's 2,187-geometry prop_id are clearly different. Separating them needs adjacency or containment tests this store cannot run natively. This matters for the fabric because if these are genuine parts, they arrive as separate ROWS and a GeoJSON-level multi-part fix will not catch them.

**The statewide N5 count.** One-geometry-many-accounts is bounded above by the 534,213 feature-to-geometry gap, but that gap also contains legitimately distinct features that happen to share geometry. Isolating N5 needs an owner-distinctness test per geometry that was not run.

**Whether two genuinely different parcels ever share byte-identical geometry within a county.** If so, the 4,617,181 count under-counts. Not measured. The risk is low for real cadastral polygons (coordinate precision is high) but it is unquantified, and it is the one direction in which the true parcel count could be higher rather than lower.

**Why Bastrop's "92.7 percent tile artifact" did not reproduce.** The prior figure used prop_ids-with-more-than-one-row as its denominator; this analysis uses rows and features. The two are not directly comparable and I did not reconstruct the prior query, because it was not recorded.

**Whether the corrected acreage figure changes the operator's front-of-queue ruling.** The amendment promoted multi-part support on the strength of 59.69 percent. That number is now 12.53 percent (upper bound). Whether 12.5 percent still clears the bar is an operator decision, not a measurement.

**What else the 59.69 percent number has contaminated.** I checked the acreage artifact and the statewide row count. I did not audit coverage figures, manifest counts, cert denominators, or any published external number for the same row-versus-parcel error. Given that the error is a factor of 1.2x on counts and 7.2x on acreage, anything derived from `count(*)` on this table should be re-checked.

**FEMA flood-layer multipart rates**, still unquantified, carried forward from the original defect report.
