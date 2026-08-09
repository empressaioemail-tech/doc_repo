---
title: Store capacity analysis — 19 to 254 Texas counties
date: 2026-08-08
status: analysis
author: capacity-analyst (read-only)
related: [_inbox/2026-08-08_FABRIC_statewide_parcel_analysis, _inbox/2026-08-08_PARALLELISM_design_proposal, _inbox/2026-08-08_STATEWIDE_layer_inventory, _catalog/texas_roster_v1.json, 90_runbooks/factory_onboarding_runbook]
---

# Store capacity analysis: can the stores hold 254 counties?

Read-only SELECT session, 2026-08-08. Two production Neon databases were measured live. No writes, no DDL, no commits.

## Executive summary (answer question 3 first)

**Nothing in connection limits or the manifest path blocks L2.** The binding constraints are **disk footprint and write throughput on the shared `neondb` store** (txgio + cortex tables), not Postgres `max_connections` and not the engine pool config (`max: 4` atoms / `max: 2` txgio per process).

**L2 (235-county parcel acquisition) can start** after operator acknowledgment of: (1) **~25–40 GB additional `txgio_parcel` growth** on a database already at **24 GB** with **~13 GB of non-parcel bloat** (`place_layer_snapshots`, empty `txgio_parcel_staging`, stale `cad_property`); (2) **WAL-limited bulk ingest** (`max_wal_size = 1 GB`) favoring **≤8 parallel county writers** with monitoring; (3) **no PostGIS on `txgio_parcel`** — L2 ingest itself is fine, but statewide warm/spatial joins stay application-side.

Ranked **WHAT BREAKS FIRST** is at the end.

---

## Store topology (correct the conflation)

Three URLs appear in runbooks; two distinct physical databases exist today.

| URL secret | Project | Database | Size (live) | Holds |
|---|---|---|---|---|
| `DATABASE_URL` | hauska-prod-497015 | `hauska_mcp` | **15 GB** | Substrate **atoms** (zoning-fact, envelope, road-node, …) |
| `DEPLOYMENT_DATABASE_URL` | legacy-design-tools-prod | `neondb` | **24 GB** | `txgio_parcel`, boundaries, `county_facet_coverage`, ledger tables, … |
| `CORTEX_DATABASE_URL` | hauska-prod-497015 | `neondb` | **24 GB** | **Same database** as `DEPLOYMENT_DATABASE_URL` |

Same-database proof (identical postmaster start time):

```
$ psql "$DEPLOYMENT_DATABASE_URL" -c "SELECT current_database(), pg_postmaster_start_time();"
 current_database |   pg_postmaster_start_time    
------------------+-------------------------------
 neondb           | 2026-07-25 22:35:54.487518+00
(1 row)

$ psql "$CORTEX_DATABASE_URL" -c "SELECT current_database(), pg_postmaster_start_time();"
 current_database |   pg_postmaster_start_time    
------------------+-------------------------------
 neondb           | 2026-07-25 22:35:54.487518+00
(1 row)
```

**Implication:** L2 parcel load and CC manifest/ledger reads share one **24 GB** Neon project today. Atoms warm writes hit a **separate 15 GB** database.

---

## 1. Current physical size

### 1A. Atoms store (`hauska_mcp`, 15 GB)

**Server headroom:**

```
SHOW max_connections;
 max_connections 
-----------------
 901
(1 row)

SELECT current_database(), pg_size_pretty(pg_database_size(current_database())) AS db_size;
 current_database | db_size 
------------------+---------
 hauska_mcp       | 15 GB
(1 row)

SELECT count(*) AS active_conns FROM pg_stat_activity WHERE datname = current_database();
 active_conns 
--------------
            2
(1 row)
```

**Top tables (dominates: `atoms`):**

```
SELECT c.relname AS table_name, COALESCE(s.n_live_tup,0) AS est_rows,
       pg_size_pretty(pg_total_relation_size(c.oid)) AS total_size,
       pg_size_pretty(pg_relation_size(c.oid)) AS heap_size,
       pg_size_pretty(pg_total_relation_size(c.oid) - pg_relation_size(c.oid)) AS index_size
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
LEFT JOIN pg_stat_user_tables s ON s.relid = c.oid
WHERE n.nspname = 'public' AND c.relkind = 'r'
ORDER BY pg_total_relation_size(c.oid) DESC LIMIT 10;
```

```
        table_name        | est_rows | total_size | heap_size | index_size 
--------------------------+----------+------------+-----------+------------
 atoms                    |  6712296 | 15 GB      | 13 GB     | 1887 MB
 atom_links               |    35545 | 31 MB      | 10 MB     | 21 MB
 request_log              |     3379 | 1600 kB    | 968 kB    | 632 kB
 ...
(10 rows)
```

**Exact atom count and entity mix:**

```
SELECT count(*) AS atom_rows FROM atoms;
 atom_rows 
-----------
   6952908
(1 row)

SELECT entity_type, count(*) FROM atoms GROUP BY 1 ORDER BY 2 DESC;
      entity_type       |  count  
------------------------+---------
 zoning-fact            | 4606757
 buildable-envelope     | 1478708
 setback-rule           |  778676
 code-section           |   28567
 property-boundary-edge |   26846
 road-node              |   25078
 ...
(11 rows)
```

**Largest atom indexes:**

```
SELECT indexrelname, pg_size_pretty(pg_relation_size(indexrelid)) AS idx_size
FROM pg_stat_user_indexes WHERE relname = 'atoms'
ORDER BY pg_relation_size(indexrelid) DESC LIMIT 5;
          indexrelname          | idx_size 
--------------------------------+----------
 atoms_pkey                     | 718 MB
 atoms_entity_composite_unique  | 579 MB
 atoms_property_parcel_node_idx | 267 MB
 atoms_section_number_idx       | 77 MB
 atoms_jurisdiction_idx         | 72 MB
(5 rows)
```

**Autovacuum / WAL settings (atoms):**

```
SHOW autovacuum;                  -- on
SHOW autovacuum_vacuum_scale_factor;  -- 0.2
SHOW max_wal_size;                -- 1GB
SHOW shared_buffers;              -- 233MB
```

**Dominant table:** `atoms` is **100% of meaningful disk** on this store (15 GB / 15 GB).

---

### 1B. TxGIO / Cortex store (`neondb`, 24 GB)

**Server headroom:**

```
SHOW max_connections;
 max_connections 
-----------------
 901
(1 row)

SELECT current_database(), pg_size_pretty(pg_database_size(current_database())) AS db_size;
 current_database | db_size 
------------------+---------
 neondb           | 24 GB
(1 row)

SELECT count(*) AS active_conns FROM pg_stat_activity WHERE datname = current_database();
 active_conns 
--------------
            3
(1 row)
```

**Top tables — note non-parcel consumers:**

```
(table query as above, LIMIT 25)
```

```
         table_name          | est_rows | total_size | heap_size  | index_size 
-----------------------------+----------+------------+------------+------------
 place_layer_snapshots       |  5212090 | 10 GB      | 8437 MB    | 2263 MB
 txgio_parcel                |  5522215 | 5937 MB    | 4308 MB    | 1629 MB
 txgio_parcel_staging        |        0 | 2592 MB    | 1920 MB    | 672 MB
 cad_property                |  4584652 | 1719 MB    | 1482 MB    | 237 MB
 permit_record               |        0 | 1417 MB    | 889 MB     | 528 MB
 txgio_address               |        0 | 751 MB     | 562 MB     | 188 MB
 tx_city_boundary            |     1222 | 26 MB      | 1104 kB    | 25 MB
 tx_county_boundary          |      254 | 25 MB      | 136 kB     | 25 MB
 county_facet_coverage       |      292 | 192 kB     | ...        | ...
 county_manifest             |      254 | 136 kB     | ...        | ...
 county_rail                 |       13 | 48 kB      | ...        | ...
(25 rows)
```

**Parcel ground-truth (confirms fabric analysis):**

```
SELECT count(*) AS total_rows, count(DISTINCT county_fips) AS distinct_counties FROM txgio_parcel;
 total_rows | distinct_counties 
------------+-------------------
    5535897 |                19
(1 row)

SELECT count(DISTINCT (county_fips||'#'||md5(geometry::text))) AS true_parcels FROM txgio_parcel;
 true_parcels 
--------------
      4617181
(1 row)
```

Runtime note: the distinct-geometry query took **~128 s** on 5.5M rows — itself a scale signal for ad hoc statewide analytics without dedup keys.

**`txgio_parcel` indexes:**

```
SELECT indexname, pg_size_pretty(pg_relation_size(...)) AS index_size FROM pg_indexes WHERE tablename = 'txgio_parcel';
                     indexname                      | index_size 
----------------------------------------------------+------------
 txgio_parcel_county_fips_tile_key_feature_index_pk | 534 MB
 txgio_parcel_situs_norm_idx                        | 250 MB
 txgio_parcel_prop_idx                              | 233 MB
(3 rows)
```

**Largest columns (full-table aggregate; ~348 s runtime on 5.5M rows):**

```
SELECT a.attname AS column_name,
       pg_size_pretty(SUM(pg_column_size((to_jsonb(t.*)->>a.attname)::text))::bigint) AS approx_text_size
FROM txgio_parcel t
CROSS JOIN pg_attribute a
JOIN pg_class c ON c.oid = a.attrelid
WHERE c.relname = 'txgio_parcel'
  AND a.attnum > 0 AND NOT a.attisdropped
  AND a.attname IN ('geometry','owner_name','situs_address','prop_id','tile_key')
GROUP BY a.attname ORDER BY 1;
  column_name  | approx_text_size 
---------------+------------------
 geometry      | 3872 MB
 owner_name    | 136 MB
 prop_id       | 62 MB
 situs_address | 175 MB
 tile_key      | 148 MB
(5 rows)
```

**`geometry` jsonb is ~65% of heap** (3872 MB of 4308 MB). Secondary columns are minor. A 1% TABLESAMPLE (fast) gave avg geometry **605 B/row**, max **113 KB** — consistent with the aggregate.

**Extensions on `neondb` (no PostGIS enabled in this store):**

```
SELECT extname FROM pg_extension ORDER BY 1;
 extname 
---------
 plpgsql
 vector
(2 rows)
```

PostGIS appears in Neon's *available* extension list but is **not installed** on the live parcel database.

**Boundary + manifest tables (new layer, fixed cardinality):**

```
SELECT count(*) FROM tx_county_boundary;   -- 254
SELECT count(*) FROM tx_city_boundary;    -- 1222
SELECT count(*) FROM county_facet_coverage;  -- 292
SELECT count(*) FROM county_manifest;     -- 254
SELECT count(*) FROM county_rail;         -- 13

SELECT pg_size_pretty(pg_total_relation_size('tx_county_boundary')) AS county_bnd,
       pg_size_pretty(pg_total_relation_size('tx_city_boundary')) AS city_bnd,
       pg_size_pretty(pg_total_relation_size('county_facet_coverage')) AS cfc;
 county_bnd | city_bnd | cfc  
------------+----------+------
 25 MB      | 26 MB    | 192 kB
(1 row)
```

**Dominant tables on `neondb`:** **`place_layer_snapshots` (10 GB)** and **`txgio_parcel` (5.9 GB)** together are **~66%** of the 24 GB database. **`txgio_parcel_staging`** holds **2.6 GB** with **0 live rows** (dead bloat).

---

## 2. Extrapolation to 254 counties

### Ground truth inputs (confirmed this session)

| Measure | Value | SQL / source |
|---|---|---|
| Loaded rows | 5,535,897 | `count(*) FROM txgio_parcel` |
| Loaded true parcels | 4,617,181 | `count(DISTINCT county_fips||'#'||md5(geometry))` |
| Row/parcel ratio (19 counties) | **1.199** | 5,535,897 / 4,617,181 |
| `txgio_parcel` on-disk total | **5937 MB** | `pg_total_relation_size('txgio_parcel')` |
| Bytes / row | **~1,124 B** | 5937 MiB / 5,535,897 |
| Bytes / true parcel (incl. indexes) | **~1,348 B** | 5937 MiB / 4,617,181 |
| Roster statewide parcel estimate | **13,360,496** | sum of `county_manifest.parcel_count_est` |
| Roster null county | **Donley 48129** only | `parcel_count_est IS NULL` |

```
SELECT sum(parcel_count_est) AS manifest_est FROM county_manifest;
 manifest_est 
--------------
     13360496
(1 row)

SELECT county_fips, county_name FROM county_manifest WHERE parcel_count_est IS NULL;
 county_fips | county_name 
-------------+-------------
 48129       | Donley
(1 row)
```

### Reconcile roster vs naive extrapolation

**Naive metro extrapolation (WRONG for planning):**

```
5,535,897 rows / 19 counties × 254 counties = 74,006,202 rows
```

**Why it fails:** the 19 loaded counties are DFW / Austin / San Antonio / Waco metros. Measured density contrast:

```
WITH loaded AS (
  SELECT sum(rows) rows, sum(true_p) tp FROM (
    SELECT county_fips, count(*) rows, count(DISTINCT md5(geometry::text)) true_p
    FROM txgio_parcel GROUP BY 1
  ) x
), roster AS (
  SELECT sum(parcel_count_est) est FROM county_manifest WHERE parcel_count_est IS NOT NULL
)
SELECT l.rows AS loaded_rows, l.tp AS loaded_true_parcels, r.est AS roster_statewide_est,
       round(l.rows::numeric/l.tp, 4) AS row_to_parcel_ratio_loaded,
       round(l.tp::numeric/19, 0) AS avg_true_parcels_per_loaded_county,
       round(r.est::numeric/254, 0) AS avg_est_parcels_per_state_county
FROM loaded l, roster r;
```

```
 loaded_rows | loaded_true_parcels | roster_statewide_est | row_to_parcel_ratio_loaded | avg_true_parcels_per_loaded_county | avg_est_parcels_per_state_county 
-------------+---------------------+----------------------+----------------------------+------------------------------------+----------------------------------
     5535897 |             4617181 |             13360496 |                     1.1990 |                             243010 |                            52600
(1 row)
```

Loaded counties average **243k** true parcels/county; roster statewide average is **52.6k**. Naive extrapolation over-counts by **~5.7×**.

**Which number to trust for distinct parcels:** **`texas_roster_v1.json` / `county_manifest` sum = 13,360,496**, because it uses per-county StratMap `feature_count` / probe evidence, not metro density. The store's 4,617,181 is ground truth for **loaded** counties only; roster estimates **5,157,713** for those same 19 FIPS — store is ~10% below roster even where loaded (vintage/coverage drift).

**Row count range (statewide `txgio_parcel`):** apply roster parcels × seam ratio. Fabric analysis: seam duplication **inversely correlates with density** (rural larger parcels → more tiles → higher ratio). Loaded metros: **1.20×**.

| Scenario | Seam ratio assumption | Statewide rows |
|---|---:|---:|
| Low | 1.10 (optimistic) | 14.7 M |
| **Mid (planning default)** | **1.20** | **16.0 M** |
| High | 1.35 (rural-heavy) | 18.0 M |

**Disk — `txgio_parcel` only:**

```
Mid rows: 16.0 M × 1,124 B/row ≈ 18.0 GB heap
With index overhead (~38% today): ≈ 25 GB total for txgio_parcel
Range: 22–35 GB (low–high scenario)
```

**Disk — full `neondb` store at L2 complete (parcels only, excluding warm/atoms):**

| Component | Today | At 254 counties |
|---|---:|---:|
| `txgio_parcel` | 5.9 GB | **22–35 GB** |
| `place_layer_snapshots` | 10 GB | **unknown** (5.2M rows / 22 adapters today; not county-scoped) |
| Boundaries | 51 MB | **~51 MB** (fixed) |
| `county_facet_coverage` | 192 KB | **≤ ~400 KB** (3302 rows max = 254×13) |
| Staging bloat | 2.6 GB | **should be 0** after cleanup |
| **Total planning band** | **24 GB** | **~45–70 GB** |

**Atoms store (NOT L2, but statewide warm):**

Today: **6.95M atoms / 4.62M loaded true parcels ≈ 1.51 atoms/parcel** (includes non-parcel entities).

Rough warm-state planning (very wide band): if statewide fabric holds **2–4 atoms/parcel** (zoning-fact + envelope minimum) on **13.36M parcels**:

```
13.36M × 3 atoms × ~2.26 KB/atom ≈ 91 GB (order-of-magnitude)
```

Current atoms DB is 15 GB with partial county breadth only. **Full statewide warm is a second storage event**, not L2.

---

## 3. What breaks first (ranked constraints)

Evidence-based ranking for **L2 ingest** then **statewide warm**.

| Rank | Constraint | Current headroom | Evidence |
|:---:|---|---|---|
| **1** | **Disk on `neondb`** | **24 GB used**; **~13 GB non-parcel**; mid L2 adds **~20 GB** parcels | `pg_database_size` = 24 GB; `place_layer_snapshots` 10 GB; empty staging 2.6 GB |
| **2** | **WAL / bulk write throughput** | `max_wal_size = 1 GB` | `SHOW max_wal_size` on both stores; parallel county ingest generates sequential scans + index updates |
| **3** | **Index build / index size** | `txgio_parcel` indexes **1.6 GB** on 19 counties | PK 534 MB + situs_norm 250 MB + prop_idx 233 MB; scales ~linearly with rows |
| **4** | **Query latency (parcel-path)** | Travis `count(*)` **166 ms**; prop lookup **0.07 ms** | EXPLAIN ANALYZE below; Harris-scale (~3× Travis rows) likely **400–600 ms** county aggregates |
| **5** | **Autovacuum lag** | scale factor **0.2**; last autovacuum txgio **2026-08-05** | Bulk load → dead tuples → vacuum at 20% churn |
| **6** | **Ad hoc analytics without dedup keys** | Distinct geometry count **128 s** | Full-table `md5(geometry)` on 5.5M rows |
| **7** | **Connection limit** | **901 max; 2–5 active** | **Not binding** at ≤16 workers × 6 conns = 96 |
| **8** | **Engine pool config (`max:4` / `max:2`)** | Process-side cap | **Not the server ceiling**; raise for throughput after WAL/disk probed |
| **9** | **Neon plan `max_connections`** | Same 901 | Neon compute limit is **CU/RAM**, not connection count at this scale |
| **10** | **PostGIS absence** | jsonb + bbox only | **Not an L2 blocker**; blocks **DB-native spatial joins** at warm scale |

### Pool config vs Neon vs Postgres

**Verdict:** the ceiling for L2 is **`neondb` disk + write throughput**, not `max: 4` / `max: 2` pool settings and not `max_connections = 901`.

```
SHOW max_connections;  -- 901 (both stores)
Active connections: 2–5 (both stores)
Engine per-process pools: 4 atoms + 2 txgio (code config, parallelism proposal §4)
16 workers × 6 connections = 96 ≪ 901
```

---

## 4. Index and query behaviour at scale

### 4A. Manifest query (fixed small — not a scale risk)

```
EXPLAIN (ANALYZE, BUFFERS)
SELECT m.county_fips, m.county_name, r.rail_key, c.facet, c.honest_coverage_pct
FROM county_manifest m
CROSS JOIN county_rail r
LEFT JOIN county_facet_coverage c
  ON c.county_fips = m.county_fips AND c.facet = r.rail_key;
```

```
 Hash Left Join ... (actual time=0.108..2.526 rows=3302 loops=1)
   ->  Nested Loop ... rows=3302
         ->  Seq Scan on county_manifest m ... rows=254
         ->  Materialize ... rows=13  (county_rail)
 Execution Time: 2.697 ms
```

**3302 rows, ~2.7 ms.** Scales with **254 × 13 = 3302**, not parcel count. Safe at statewide.

### 4B. Parcel-path queries (scale with county parcel count)

**Hot path — prop_id lookup (indexed, fast today):**

```
EXPLAIN (ANALYZE, BUFFERS)
SELECT county_fips, prop_id, geometry FROM txgio_parcel
WHERE county_fips = '48021' AND prop_id = '10421' LIMIT 5;
```

```
 Index Scan using txgio_parcel_prop_idx ... (actual time=0.050..0.057 rows=5 loops=1)
   Index Cond: ((county_fips = '48021') AND (prop_id = '10421'))
 Execution Time: 0.071 ms
```

**County-wide aggregate (scales with rows — Travis 48453):**

```
EXPLAIN (ANALYZE, BUFFERS) SELECT count(*) FROM txgio_parcel WHERE county_fips = '48453';
```

```
 Parallel Index Only Scan using txgio_parcel_prop_idx ... (actual time=3.939..133.933 rows=298219 loops=3)
 Execution Time: 166.642 ms
```

**Bbox filter within county (seq-ish scan on county prefix):**

```
EXPLAIN SELECT * FROM txgio_parcel
WHERE county_fips = '48021'
  AND west_lng BETWEEN -97.5 AND -97.0
  AND south_lat BETWEEN 30.0 AND 30.5;
```

```
 Parallel Bitmap Heap Scan ... rows=1695
   Filter: (bbox predicates)
   ->  Bitmap Index Scan on txgio_parcel_prop_idx
         Index Cond: (county_fips = '48021')
```

No spatial index; bbox filter applied **after** county index range scan. Acceptable per-county; **not** a statewide cross-county spatial join plan.

**Atoms parcel lookup (indexed):**

```
EXPLAIN SELECT * FROM atoms
WHERE entity_type = 'zoning-fact'
  AND jurisdiction_tenant LIKE 'breadth_48021_%'
  AND body->>'parcelNodeId' = '48021:10421';
```

```
 Bitmap Index Scan on atoms_property_parcel_node_idx
   Index Cond: (body->>'parcelNodeId' = '48021:10421')
 Filter: jurisdiction_tenant ~~ 'breadth_48021_%' AND entity_type = 'zoning-fact'
```

### 4C. PostGIS absence at statewide scale

- **`txgio_parcel`:** geometry is **jsonb**; containment / area in SQL requires `md5(geometry)` or bbox proxies (fabric analysis used bbox acres).
- **Boundaries:** `tx_county_boundary` / `tx_city_boundary` also **jsonb**, 254 + 1222 rows — point-in-polygon in **application code** is fine for jurisdiction assignment.
- **Blocker shape:** not L2 ingest; **warm-path spatial joins across 13M+ parcel polygons** without PostGIS means **CPU in app tier** or **precomputed joins** (county_fips on parcel rows already helps). N4 adjacency/containment classes in fabric analysis **cannot be resolved in SQL** today.

**Assessment:** absence of PostGIS **does not block L2**. It **does** cap DB-side spatial analytics and makes **statewide ring/containment QA** an application-cost problem at warm time.

---

## 5. Concurrency ceiling (store side)

### Measured limits

Both stores:

```
SHOW max_connections;  → 901
pg_stat_activity count → 2–5 idle sessions during analysis
```

Parallelism proposal (§4) measured the same **901** on 2026-08-08.

### Write ceiling (cannot measure without writes)

**Honest answer:** sustainable **parallel ingest writers** on `txgio_parcel` is **not measured**. A ramp test is required: P = 1, 2, 4, 8, 16 county-disjoint workers; record wall time, `pg_stat_database` blks_write, WAL flush waits, error rate (proposal §4 experiment).

**Conservative store-side starting point (from proposal, not live ramp):**

| Workload | DB | Suggested concurrent writers |
|---|---|---:|
| L2 StratMap → `txgio_parcel` | neondb | **8** |
| Atoms cascade / warm apply | hauska_mcp | **2–4** |

**Atoms concurrent write absorption:** limited by **`writePropertyAtomsBatch` internal 32-wide upserts** + **IPFS pin serialism** (proposal §4), not connection count. Two overlapping writers on the **same `parcelNodeId` keyspace** produced partial mutation (Bastrop 2026-08-07 abort) — **row-level last-writer-wins**, not connection errors.

---

## 6. Cost trajectory (estimate)

**Source:** [Neon plans docs](https://neon.com/docs/introduction/plans) — **$0.35 / GB-month** storage (Launch/Scale), **$0.106 / CU-hour** compute (Launch). Figures below are **estimates**, not invoices.

### Storage (monthly, persistent)

| Store | Today | Mid statewide L2 | Notes |
|---|---:|---:|---|
| `neondb` | 24 GB | **~55 GB** | Parcels + existing snapshots; staging cleaned |
| `hauska_mcp` | 15 GB | 15 GB at L2 | Atoms unchanged until warm |
| **Storage subtotal** | 39 GB | **~70 GB** | |
| **Cost @ $0.35/GB-mo** | **~$13.65/mo** | **~$24.50/mo** | **+$11/mo** storage delta |

Full statewide **warm** (atoms → ~60–100 GB band): add **~$16–28/mo** when that lands.

### Compute (highly variable)

Bulk L2 ingest burst: depends on CU size × wall hours × parallelism. Illustrative: **8 CU × 30 h × $0.106 ≈ $25** one-time burst if compute stays provisioned (likely lower with scale-to-zero between counties).

**Neon does not cap storage at a fixed GB in `pg_settings`** on these projects; `neon.file_cache_size_limit = 9141MB` is local cache, not a quota.

---

## 7. Recommendation before L2 starts

Ranked by urgency:

| Priority | Action | Why |
|:---:|---|---|
| **P0** | **Reclaim `txgio_parcel_staging` ~2.6 GB** (operator-approved TRUNCATE/VACUUM — not done in this session) | Empty table retaining 2.6 GB dead space on a 24 GB DB |
| **P0** | **Confirm Neon billing headroom for ~50–70 GB `neondb`** | #1 breaker; storage cost is modest ($~11/mo delta) but size drives vacuum/I/O |
| **P1** | **Run txgio ingest ramp test** (1→8 counties parallel) before 235-county fan | WAL / write throughput unknown; measure before assuming 8 workers |
| **P1** | **Inventory `place_layer_snapshots` growth policy** (10 GB today, 5.2M rows) | Second-largest consumer; not needed for L2 but competes for disk |
| **P2** | **Plan Harris / mega-county ingest sharding** (roster flags harris-sharding-required) | Single-county row count may exceed Travis 3× |
| **P2** | **Defer PostGIS decision until warm scale** | L2 = bulk jsonb load; PostGIS helps warm/QA not acquisition |
| **P3** | **Consider `county_fips` partitioning** on `txgio_parcel` after L2 | Eases per-county VACUUM/REINDEX; not required to start L2 |
| **P3** | **Raise engine pool `max` after ramp test** | Not the current ceiling |
| **P4** | **Separate store for parcel geometry** | **Not required for L2**; reconsider only if `neondb` shared tenancy with CC/ledger becomes operationally brittle |

**Does anything block L2?** **No hard block** if P0 disk reclamation and Neon headroom are accepted. **Soft block:** running 235 counties without ingest ramp test risks WAL thrash and multi-hour index rebuilds on the shared 24 GB database.

---

## WHAT BREAKS FIRST

1. **`neondb` disk footprint** (parcels + existing 10 GB `place_layer_snapshots` + 2.6 GB staging bloat)
2. **WAL / bulk write throughput** during parallel StratMap ingest (`max_wal_size = 1 GB`)
3. **`txgio_parcel` index size and build time** (1.6 GB indexes for 19 counties → ~5–8 GB at statewide rows)
4. **County-scoped query latency** (166 ms count on Travis; scales with county row count)
5. **Autovacuum cadence** under bulk load (`autovacuum_vacuum_scale_factor = 0.2`)
6. **Ad hoc statewide SQL without dedup keys** (128 s distinct-geometry count on 5.5M rows)
7. **Application-side spatial CPU** (no PostGIS on parcel store at warm scale)
8. **Engine pool config** (`max: 4` / `max: 2`) — tunable, not server-limited
9. **Postgres / Neon `max_connections` (901)** — ample headroom
10. **`county_facet_coverage` / manifest** — fixed 3302-row join, never breaks

---

## WHAT I COULD NOT DETERMINE

1. **Sustainable parallel L2 ingest writer count** — requires write ramp experiment; not run (read-only mandate).
2. **`place_layer_snapshots` statewide growth** — 10 GB / 5.2M rows today; no projection model tied to county count.
3. **Neon compute CU saturation point** during ingest — connection headroom is ample; CPU/WAL cliff unmeasured.
4. **Exact atoms store size after statewide warm** — wide band (~60–100 GB order-of-magnitude); warm not L2.
5. **Bulk apply write-then-verify ms/parcel** on atoms — probes are compute-only elsewhere.
6. **Whether `cad_property` 4.6M rows / 1.7 GB should be purged** before L2 — stale breadth load across 15 counties; operator decision.
7. **Neon organizational storage quota** — no hard quota in `pg_settings`; billing tier limits not introspectable via SQL.
8. **Donley County (48129)** — roster `parcel_count_est` NULL; blocks roster-complete arithmetic for 254/254 until filled.

---

## Condensed verdict for the operator

**Can the stores hold 254 counties?** **Yes, with planning.** Use **13.36M distinct parcels** (roster), not **74M naive rows**. Expect **`txgio_parcel` ~22–35 GB** and **`neondb` ~45–70 GB** at L2 complete; atoms store stays ~15 GB until warm waves.

**What breaks first?** **Disk on the shared `neondb` store**, then **WAL/write throughput**, not connection limits.

**Does anything block L2?** **No**, provided **~2.6 GB staging reclaim**, **Neon storage headroom acknowledged**, and **ingest parallelism validated by ramp test** before full 235-county fan-out.
