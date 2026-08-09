---
title: "Grading the nineteen pre-2026-08-08 counties against the current standard"
date: 2026-08-08
status: analysis
repo: doc_repo
author: grading-analyst (read-only)
related: [_decisions/2026-08-07_envelope_saga_close_and_geometry_law, _inbox/2026-08-08_FABRIC_statewide_parcel_analysis, _inbox/2026-08-08_L2_first_county_proof, 90_operations/onboarding_defect_class_backlog, 90_runbooks/factory_onboarding_runbook]
---

# Grading the nineteen: what is actually broken

Read-only audit, 2026-08-08. SELECT only against two Postgres databases plus one live Census TIGERweb probe. No writes, no DDL, no ingest, no test runner. Every claim below is followed by the SQL or command that produced it, pasted verbatim, because the briefing that commissioned this audit correctly noted that prior artifacts in this chain have been wrong by factors of five.

The headline is that the fear behind the commission is largely unfounded, but not entirely, and the one place it is founded is not where the briefing pointed.

**The five defects do not have the blast radius the briefing assumed, because sixteen of the nineteen counties never ran the geometry path at all.** Their envelopes are Tier-1 snapshot rows that carry no parcel ring — nothing was computed from a truncated geometry because nothing was computed from a geometry. The multipolygon truncation defect (#278) has a real, measurable victim set, and it is **2,127 parcels concentrated almost entirely in Travis and Bexar**, not the 25,843 that raw multi-part exposure would suggest.

**The one genuinely wrong geometry is Bell County 48027**, which carries 739 parcels lying entirely outside its own county boundary, 694 of them inside McLennan County, confirmed by Census point-in-polygon. That is not a measurement artifact and it was not on the briefing's list.

**Bastrop's stale-envelope finding is confirmed but smaller and cleaner than briefed**: 4,052 parcels serve a positive envelope predating the Geometry Law, of which 2,267 carry an actual ring. There are **zero** parcels with neither an envelope nor a decline record — the 1:1 coverage the honesty doctrine requires actually holds.

---

## 0. Store topology — a correction to the runbook before any number is quoted

The task briefing and `90_runbooks/factory_onboarding_runbook.md` both state that `txgio_parcel` and `county_facet_coverage` live on "the CORTEX database", a different store from the substrate atoms. Verified:

```powershell
$ldt    = gcloud secrets versions access latest --secret=DEPLOYMENT_DATABASE_URL --project legacy-design-tools-prod
$atoms  = gcloud secrets versions access latest --secret=DATABASE_URL           --project hauska-prod-497015
$cortex = gcloud secrets versions access latest --secret=CORTEX_DATABASE_URL    --project hauska-prod-497015
Write-Output "IDENTICAL: $($ldt -eq $cortex)"
```

```
IDENTICAL: True
```

`CORTEX_DATABASE_URL` and `DEPLOYMENT_DATABASE_URL` are **byte-identical**. Both resolve to `ep-lucky-truth-apodo8hr-pooler.c-7.us-east-1.aws.neon.tech/neondb`. The atoms store is genuinely separate (`.../hauska_mcp`), but it is the only separate one.

```
ldt host:    ep-lucky-truth-apodo8hr-pooler.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require
atoms host:  ep-lucky-truth-apodo8hr-pooler.c-7.us-east-1.aws.neon.tech/hauska_mcp?sslmode=require
cortex host: ep-lucky-truth-apodo8hr-pooler.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require
```

There are **two** stores, not three. The runbook's "these are DIFFERENT stores and this portfolio's docs conflate them routinely" warning is itself the conflation: it names a distinction between cortex and ldt that does not exist. Two secrets, one database. This matters because it means a "cortex" query and an "ldt" query cannot disagree, and any past reconciliation effort premised on them being separate was chasing nothing.

`txgio_parcel`, `county_facet_coverage`, `county_gate_cert_state`, `county_manifest`, `county_rail`, and `tx_county_boundary` all live in `neondb`:

```sql
SELECT table_name FROM information_schema.tables WHERE table_schema='public'
  AND (table_name LIKE '%txgio%' OR table_name LIKE '%facet_coverage%' OR table_name LIKE '%county%') ORDER BY 1;
```

```
county_facet_coverage
county_gate_cert_state
county_manifest
county_rail
tx_county_boundary
txgio_address
txgio_parcel
txgio_parcel_staging
```

---

## 1. Scoping — the store has grown to 79 counties; the nineteen are cleanly separable

The briefing describes nineteen counties. The store now holds seventy-nine:

```sql
SELECT county_fips, count(*) AS rows, min(ingested_at) AS first_ingest, min(source_vintage) AS vintage
FROM txgio_parcel GROUP BY county_fips ORDER BY min(ingested_at);
```

Sixty additional counties landed on 2026-08-09 (a statewide L2 wave that ran after the briefing was written), plus Kenedy 48261 on 2026-08-09 00:45. The nineteen target counties are cleanly identified by `ingested_at <= 2026-08-05`, in three loading epochs:

| Epoch | Ingested | Counties |
|---|---|---|
| 1 | 2026-07-14 | Hays 48209, Comal 48091 |
| 2 | 2026-07-19 | Caldwell 48055, Bastrop 48021, Guadalupe 48187, Bell 48027, McLennan 48309, Williamson 48491, Bexar 48029, Travis 48453 |
| 3 | 2026-08-04/05 | Rockwall 48397, Ellis 48139, Kaufman 48257, Johnson 48251, Parker 48367, Collin 48085, Denton 48121, Tarrant 48439, Dallas 48113 |

Row counts for all nineteen reproduce the FABRIC baseline exactly (5,535,897 total). **Everything below is scoped to those nineteen only.** The sixty new counties are out of scope and were not graded.

---

## 2. GEOMETRY SANITY

### 2.1 Degree bounds — clean, confirmed

```sql
SELECT county_fips, count(*) AS rows,
       count(*) FILTER (WHERE west_lng < -107 OR east_lng > -93 OR south_lat < 25 OR north_lat > 37) AS rows_out_of_tx,
       count(*) FILTER (WHERE west_lng > east_lng OR south_lat > north_lat) AS inverted_bbox,
       count(*) FILTER (WHERE abs(west_lng) > 200 OR abs(south_lat) > 90) AS mercator_scale_rows
FROM txgio_parcel GROUP BY county_fips ORDER BY county_fips;
```

Across all nineteen (and in fact all seventy-nine): `rows_out_of_tx = 0`, `inverted_bbox = 0`, `mercator_scale_rows = 0`. The FABRIC claim holds per county. No county carries Web Mercator-scaled coordinates, which is the signature the projection guard defect would have left.

### 2.2 The projection guard (#396/#397) was genuinely latent — verified, not assumed

The briefing asked me to verify rather than assume this. Verified:

```sql
SELECT county_fips, min(source_vintage) AS vintage, right(min(source_vintage),6) AS vintage_yyyymm,
       CASE WHEN right(min(source_vintage),6)='202505' THEN 'WEB-MERCATOR-RISK' ELSE 'degree-vintage' END AS projection_class
FROM txgio_parcel WHERE county_fips IN (<the 19>) GROUP BY 1 ORDER BY 3, 1;
```

```
48021 202503  degree-vintage      48027 202503  degree-vintage      48055 202503  degree-vintage
48085 202503  degree-vintage      48091 202503  degree-vintage      48121 202503  degree-vintage
48187 202503  degree-vintage      48209 202503  degree-vintage      48257 202503  degree-vintage
48309 202503  degree-vintage      48029 202507  degree-vintage      48139 202507  degree-vintage
48367 202507  degree-vintage      48397 202507  degree-vintage      48439 202507  degree-vintage
48491 202507  degree-vintage      48113 202508  degree-vintage      48251 202508  degree-vintage
48453 202508  degree-vintage
```

**Zero 202505 vintages among the nineteen.** Ten are 202503, six are 202507, three are 202508. The `assertWgs84Prj` substring defect could only fire on a projected `.prj`, and no county here shipped one. Combined with the zero Mercator-scale rows in 2.1, this is confirmed latent by two independent measurements. **Defect class 2 is CLEAR for all nineteen.**

### 2.3 County bbox versus true Census extent — Bell County 48027 is genuinely wrong

This is the finding the briefing did not anticipate. First, parcel extent versus the loaded `tx_county_boundary` layer:

```sql
WITH p AS (SELECT county_fips, min(west_lng) pw, max(east_lng) pe, min(south_lat) ps, max(north_lat) pn
           FROM txgio_parcel WHERE county_fips IN (<the 19>) GROUP BY 1),
     b AS (SELECT county_fips, min(west_lng) bw, max(east_lng) be, min(south_lat) bs, max(north_lat) bn
           FROM tx_county_boundary WHERE county_fips IN (<the 19>) GROUP BY 1)
SELECT p.county_fips, round((p.pn-b.bn)::numeric,4) AS d_north, round((p.pw-b.bw)::numeric,4) AS d_west,
  CASE WHEN p.pw < b.bw-0.02 OR p.pe > b.be+0.02 OR p.ps < b.bs-0.02 OR p.pn > b.bn+0.02
       THEN 'OVERFLOW-OUTSIDE-COUNTY' ELSE 'contained' END AS verdict
FROM p JOIN b USING (county_fips) ORDER BY verdict DESC, p.county_fips;
```

Seventeen counties `contained`. Two flagged: **48027 (d_north = +0.0861)** and **48251 (d_west = -0.0281)**.

My first interpretation was that the boundary layer was truncated and the parcels were right. **That was wrong, and the live Census probe reversed it.** TIGERweb, non-generalized county polygon, converted from Web Mercator to degrees:

```
Bell County 48027    Census W=-97.9138 E=-97.0701 S=30.7524 N=31.3202
Johnson County 48251 Census W=-97.6171 E=-97.0870 S=32.1338 N=32.5555
```

Census confirms Bell's true northern limit **is** 31.3202 — exactly what `tx_county_boundary` holds. The boundary layer is correct; the parcels overflow it. Point-in-polygon settles it:

```python
url=('https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/State_County/MapServer/13/query'
 '?geometry=-97.3832,31.3965&geometryType=esriGeometryPoint&inSR=4326'
 '&spatialRel=esriSpatialRelIntersects&outFields=NAME,STATE,COUNTY&f=json&returnGeometry=false')
```

```
Point (-97.3832, 31.3965) is in: [{'NAME': 'McLennan County', 'STATE': '48', 'COUNTY': '309'}]
Point (-97.3832, 31.3100) is in: [{'NAME': 'McLennan County'}]
```

Magnitude and count:

```sql
WITH bell AS (SELECT DISTINCT ON (feature_index) feature_index, prop_id, north_lat, south_lat
              FROM txgio_parcel WHERE county_fips='48027' ORDER BY feature_index, tile_key),
     over AS (SELECT * FROM bell WHERE south_lat > 31.3202),
     mcl  AS (SELECT DISTINCT prop_id FROM txgio_parcel WHERE county_fips='48309')
SELECT (SELECT count(*) FROM bell) AS bell_features_total,
       (SELECT count(*) FROM over) AS fully_north_of_census_line,
       (SELECT count(*) FROM over o JOIN mcl m ON m.prop_id=o.prop_id) AS same_prop_id_also_in_mclennan,
       (SELECT round(max(north_lat)::numeric,4) FROM over) AS max_north;
```

```
 bell_features_total | fully_north_of_census_line | same_prop_id_also_in_mclennan | max_north
---------------------+----------------------------+-------------------------------+-----------
              167412 |                        694 |                           231 |   31.4063
```

Overflow distance, in feet:

```
 case                 | features | max_overflow_ft | min_overflow_ft
----------------------+----------+-----------------+-----------------
 48027 north overflow |      361 |           31353 |            7295
 48251 west overflow  |        2 |            8631 |            6503
```

**Up to 31,353 feet — 5.9 miles — north of the county line.** That is far beyond any boundary-generalization tolerance. These are not edge parcels straddling a line.

They are not duplicates of McLennan rows, so this is not a double-load:

```sql
WITH bell AS (SELECT DISTINCT ON (feature_index) feature_index, prop_id, md5(geometry::text) gh
              FROM txgio_parcel WHERE county_fips='48027' AND south_lat>31.3202 ORDER BY feature_index, tile_key),
     mcl AS (SELECT DISTINCT prop_id, md5(geometry::text) gh FROM txgio_parcel WHERE county_fips='48309' AND north_lat>31.30)
SELECT count(*) AS bell_over,
  count(*) FILTER (WHERE EXISTS (SELECT 1 FROM mcl WHERE mcl.gh=bell.gh)) AS byte_identical_geom_in_mclennan,
  count(*) FILTER (WHERE EXISTS (SELECT 1 FROM mcl WHERE mcl.prop_id=bell.prop_id AND mcl.gh=bell.gh)) AS same_propid_and_geom
FROM bell;
```

```
 bell_over | byte_identical_geom_in_mclennan | same_propid_and_geom
-----------+---------------------------------+----------------------
       694 |                               0 |                    0
```

Zero geometric overlap. These are 694 **distinct parcels filed under the wrong county FIPS**. The 231 shared prop_ids are coincidental account-number reuse across two CADs, not the same parcel twice.

Sample rows, and a complication worth stating plainly:

```
 feature_index | prop_id | owner                   | situs                      | n
---------------+---------+-------------------------+----------------------------+--------
        149860 |  529299 | MH SALADO PROPERTY LLC  | 1907 SLADE DR, SALADO, TX  | 31.3965
        158321 |   11742 | (null)                  | , ,                        | 31.3963
        158323 |   46890 | (null)                  | , ,                        | 31.3624
```

The one row carrying a situs names **Salado**, which is a real Bell County town. This is the honest complication: Salado's built-up area sits near the Bell/McLennan line and StratMap's county assignment may follow CAD jurisdiction rather than Census geography, in which case a CAD legitimately appraising north of the Census line would produce exactly this. I did not resolve which. What is *measured* and not in dispute: 694 Bell-filed parcels sit inside the Census McLennan polygon, up to 5.9 miles in, and any product surface that resolves "which county is this parcel in" from the Census boundary will disagree with the store for all 694.

Full-outside-extent scan across all nineteen, for scale:

```sql
WITH b AS (SELECT county_fips, min(west_lng) bw, max(east_lng) be, min(south_lat) bs, max(north_lat) bn
           FROM tx_county_boundary WHERE county_fips IN (<the 19>) GROUP BY 1),
     pf AS (SELECT DISTINCT ON (county_fips, feature_index) county_fips, feature_index,
                   west_lng,east_lng,south_lat,north_lat
            FROM txgio_parcel WHERE county_fips IN (<the 19>) ORDER BY county_fips, feature_index, tile_key)
SELECT pf.county_fips, count(*) AS features,
  count(*) FILTER (WHERE pf.south_lat>b.bn OR pf.north_lat<b.bs OR pf.west_lng>b.be OR pf.east_lng<b.bw) AS fully_outside_county
FROM pf JOIN b USING (county_fips) GROUP BY 1 ORDER BY fully_outside_county DESC;
```

```
 county_fips | features | fully_outside_county
-------------+----------+----------------------
 48027       |   167412 |                  739
 48439       |   757161 |                  239
 48367       |   100548 |                   47
 48251       |   101847 |                   33
 48257       |    94650 |                    2
 48309       |   115362 |                    1
 (13 others) |          |                    0
```

Bell is a genuine outlier at 739 (0.44 percent). Tarrant's 239 (0.032 percent) and the rest are small enough to be plausible boundary-precision effects and were not individually probed.

---

## 3. MULTIPOLYGON EXPOSURE — the defect is real but 12x smaller than raw exposure suggests

### 3.1 The defect, confirmed in source

The briefing's description is accurate. Verified in git:

```bash
cd /p/hauska-engine && git log --oneline -3 -- packages/engine-core/src/parcel-terrain/parcel-geometry-resolver.ts
```

```
e6265b1 fix(engine-core): fail-closed on multi-part parcel geometry, no more silent truncation (#278)
5e3acea feat(site-plan): shared site model + layered DXF/IFC site-plan export (Wave 1) (#116)
```

The fix landed **2026-08-08 11:15:47 -0500**. The pre-fix code (commit `5e3acea`, in force from 2026-07-25 through 2026-08-08) reduced geometry unconditionally:

```typescript
function exteriorRingFromGeoJson(geometry: unknown): Array<[number, number]> | null {
  if (geom.type === "Polygon") {
    const rings = geom.coordinates as unknown;
    const exterior = Array.isArray(rings) ? rings[0] : null;   // holes dropped
    ...
  }
  if (geom.type === "MultiPolygon") {
    const polygons = geom.coordinates as unknown;
    const firstPolygon = Array.isArray(polygons) ? polygons[0] : null;  // parts 2..N dropped
    const exterior = Array.isArray(firstPolygon) ? firstPolygon[0] : null;
```

The current code fails closed with `MULTI_PART_GEOMETRY_UNSUPPORTED`, and — important for sizing blast radius — it declines **holed Polygons too**, not just MultiPolygons.

**A distinction the briefing collapses, and it matters.** For a holed Polygon the old code returned the correct exterior ring; the hole was dropped, so the *boundary* was right and only the interior void was lost. For a MultiPolygon the old code returned only part 1, genuinely losing whole disjoint pieces of the parcel. These are different severities. I report both and rank on the MultiPolygon count.

### 3.2 Raw exposure per county, feature-deduplicated

```sql
WITH pf AS (
  SELECT DISTINCT ON (county_fips, feature_index) county_fips, feature_index, geometry
  FROM txgio_parcel WHERE county_fips IN (<the 19>) ORDER BY county_fips, feature_index, tile_key)
SELECT county_fips, count(*) AS features,
  count(*) FILTER (WHERE geometry->>'type'='MultiPolygon') AS mp_features,
  sum(CASE WHEN geometry->>'type'='MultiPolygon' THEN jsonb_array_length(geometry->'coordinates')-1 ELSE 0 END) AS parts_discarded_by_truncation,
  count(*) FILTER (WHERE geometry->>'type'='Polygon' AND jsonb_array_length(geometry->'coordinates')>1) AS poly_with_holes,
  round(100.0*count(*) FILTER (WHERE geometry->>'type'='MultiPolygon')/count(*),4) AS mp_pct,
  max(CASE WHEN geometry->>'type'='MultiPolygon' THEN jsonb_array_length(geometry->'coordinates') ELSE 0 END) AS max_parts
FROM pf GROUP BY 1 ORDER BY mp_features DESC;
```

```
 county_fips | features | mp_features | parts_discarded | poly_with_holes | mp_pct  | max_parts
-------------+----------+-------------+-----------------+-----------------+---------+-----------
 48453       |   828773 |        4171 |            4980 |            2184 |  0.5033 |        51
 48439       |   757161 |        3327 |            7579 |            1309 |  0.4394 |        17
 48085       |   387737 |         842 |            1080 |             570 |  0.2172 |        18
 48121       |   353631 |         833 |            1061 |             247 |  0.2356 |        29
 48309       |   115362 |         547 |             682 |             390 |  0.4742 |        54
 48113       |   694160 |         382 |             590 |             270 |  0.0550 |        12
 48027       |   167412 |         344 |             388 |             203 |  0.2055 |        12
 48251       |   101847 |         325 |             415 |            1513 |  0.3191 |        10
 48367       |   100548 |         228 |             254 |             378 |  0.2268 |        11
 48029       |   709541 |         222 |             292 |            1523 |  0.0313 |         9
 48055       |    26155 |         192 |             253 |             213 |  0.7341 |         4
 48257       |    94650 |         187 |             217 |             166 |  0.1976 |         8
 48209       |   117427 |         179 |             206 |             326 |  0.1524 |         6
 48187       |    95571 |         144 |             177 |            2028 |  0.1507 |         7
 48091       |   103537 |         132 |             206 |             183 |  0.1275 |        23
 48397       |    52739 |          72 |              85 |              27 |  0.1365 |         5
 48491       |   282983 |          60 |             112 |            1443 |  0.0212 |        15
 48139       |    98803 |          32 |              57 |             266 |  0.0324 |        26
 48021       |    63357 |           4 |               4 |             423 |  0.0063 |         2
```

Ranked by absolute count as instructed: **Travis 4,171 and Tarrant 3,327 dominate.** Bastrop, the county under the most operational scrutiny, has the *lowest* MultiPolygon count in the entire set at 4. `max_parts` reaches 54 (McLennan) and 51 (Travis) — the tail is long and a two-part assumption would be wrong.

### 3.3 The measurement that actually matters — exposure intersected with what serves

Raw exposure counts parcels that *could* have been truncated. It does not count parcels that *were*. A parcel only carries the defect if something was computed from its ring. I joined all 25,843 exposed parcels against the envelope atoms:

```sql
WITH exposed(entity_id, fips, kind) AS (VALUES <25,843 rows exported from txgio_parcel>)
SELECT e.fips, e.kind, count(*) AS exposed_parcels,
  count(*) FILTER (WHERE a.entity_id IS NOT NULL AND NOT (a.body ? 'warmVerifyDeclineCode')) AS serving_positive_envelope
FROM exposed e
LEFT JOIN atoms a ON a.entity_type='buildable-envelope' AND a.entity_id = e.entity_id
GROUP BY 1,2 ORDER BY serving_positive_envelope DESC;
```

```
 fips  | kind          | exposed_parcels | have_envelope | declined | serving_positive_envelope
-------+---------------+-----------------+---------------+----------+---------------------------
 48453 | multipolygon  |            4171 |          1996 |        0 |                      1996
 48453 | holed_polygon |            2184 |          1250 |        0 |                      1250
 48029 | holed_polygon |            1523 |           421 |        0 |                       421
 48491 | holed_polygon |            1443 |          1442 |     1286 |                       156
 48029 | multipolygon  |             222 |           131 |        0 |                       131
 48209 | holed_polygon |             304 |           246 |      213 |                        33
 48491 | multipolygon  |              60 |            60 |       29 |                        31
 48209 | multipolygon  |             178 |           147 |      122 |                        25
 48055 | holed_polygon |             213 |           207 |      186 |                        21
 48091 | multipolygon  |             132 |           119 |      109 |                        10
 48091 | holed_polygon |             183 |           166 |      161 |                         5
 48021 | holed_polygon |             423 |           423 |      422 |                         1
 48113 | (both)        |             652 |             0 |        0 |                         0
 48439 | (both)        |            4636 |             0 |        0 |                         0
 ... (all remaining counties: 0)
```

**Tarrant's 3,327 MultiPolygons have zero envelope atoms.** Same for Dallas, Denton, Collin, Johnson, Parker, Rockwall, Ellis. Those counties loaded geometry and zoning-facts only; nothing ever consumed their rings.

MultiPolygon parcels serving a positive envelope: **1,996 (Travis) + 131 (Bexar) + 31 (Williamson) + 25 (Hays) + 10 (Comal) = 2,193**. Holed polygons add 1,886. Combined multi-part-exposed parcels serving a positive envelope: **4,079** of 25,843 exposed (15.8 percent).

### 3.4 The severity collapses further — those envelopes carry no ring

The decisive check. An envelope only embeds parcel geometry if it carries a `geojson` key:

```sql
SELECT split_part(entity_id,':',1) AS fips, count(*) AS positive_envelopes,
  count(*) FILTER (WHERE body ? 'geojson') AS with_geojson_ring,
  count(*) FILTER (WHERE NOT (body ? 'geojson')) AS no_ring_tier1_only,
  count(*) FILTER (WHERE (body ? 'geojson') AND (body->>'fetchedAt')::timestamptz < '2026-08-07T00:00:00Z') AS ring_pre_geometry_law
FROM atoms WHERE entity_type='buildable-envelope' AND NOT (body ? 'warmVerifyDeclineCode')
  AND entity_id ~ '^48[0-9]{3}:' GROUP BY 1 ORDER BY with_geojson_ring DESC;
```

```
 fips  | positive_envelopes | with_geojson_ring | no_ring_tier1_only | ring_pre_geometry_law
-------+--------------------+-------------------+--------------------+-----------------------
 48021 |               5720 |              3935 |               1785 |                  2267
 48055 |               5507 |               337 |               5170 |                   337
 48209 |              34454 |                 0 |              34454 |                     0
 48453 |             172713 |                 0 |             172713 |                     0
 48491 |             124499 |                 0 |             124499 |                     0
 48091 |              25389 |                 0 |              25389 |                     0
 48029 |             406611 |                 0 |             406611 |                     0
```

**Only Bastrop and Caldwell have any ring-bearing envelopes at all.** Travis, Bexar, Williamson, Hays, and Comal — all 763,666 of their positive envelopes — carry no geometry. Their `sourceAdapter` is `cortex-tier1-snapshot-breadth-bake` and their `outcome.reason` states it outright:

```json
"outcome": { "kind": "provisional-front-edge",
  "reason": "Setback rule cited; parcel-ring buildable area not yet derived from geometry (Tier-1 atom_path_pending)" }
```

So of the 2,193 MultiPolygon parcels serving a positive envelope, essentially all are Tier-1 rows that never touched `parcel-geometry-resolver.ts`. Bastrop's single exposed-and-serving parcel is a holed polygon, and Caldwell's 21 likewise.

**Verdict on defect class 4: the truncation was real and the code path was genuinely broken for two weeks, but the nineteen counties almost entirely escaped it because sixteen of them never ran depth-warm.** The exposure is latent, not realized. It becomes realized the moment any of these counties is warmed — which is precisely why #278 landing before the statewide wave was the right call.

---

## 4. TILE DUPLICATION / SEAM FACTOR

```sql
WITH f AS (SELECT county_fips, feature_index, count(*) AS nrows
           FROM txgio_parcel WHERE county_fips IN (<the 19>) GROUP BY 1,2)
SELECT county_fips, sum(nrows) AS rows, count(*) AS features,
       round(sum(nrows)::numeric/count(*),4) AS seam_factor,
       round(100.0*(sum(nrows)-count(*))/sum(nrows),3) AS pct_seam_dup
FROM f GROUP BY 1 ORDER BY rows DESC;
```

```
 county_fips |  rows  | features | seam_factor | seam_dup_rows | pct_seam_dup
-------------+--------+----------+-------------+---------------+--------------
 48453       | 894657 |   828773 |      1.0795 |         65884 |        7.364
 48439       | 799524 |   757161 |      1.0559 |         42363 |        5.299
 48029       | 747206 |   709541 |      1.0531 |         37665 |        5.041
 48113       | 726360 |   694160 |      1.0464 |         32200 |        4.433
 48085       | 408681 |   387737 |      1.0540 |         20944 |        5.125
 48121       | 373635 |   353631 |      1.0566 |         20004 |        5.354
 48491       | 304298 |   282983 |      1.0753 |         21315 |        7.005
 48027       | 184470 |   167412 |      1.1019 |         17058 |        9.247
 48209       | 131734 |   117427 |      1.1218 |         14307 |       10.861
 48309       | 130650 |   115362 |      1.1325 |         15288 |       11.701
 48367       | 118833 |   100548 |      1.1819 |         18285 |       15.387
 48091       | 114430 |   103537 |      1.1052 |         10893 |        9.519
 48251       | 113686 |   101847 |      1.1162 |         11839 |       10.414
 48139       | 111274 |    98803 |      1.1262 |         12471 |       11.207
 48187       | 106508 |    95571 |      1.1144 |         10937 |       10.269
 48257       | 106175 |    94650 |      1.1218 |         11525 |       10.855
 48021       |  74729 |    63357 |      1.1795 |         11372 |       15.218
 48397       |  56266 |    52739 |      1.0669 |          3527 |        6.268
 48055       |  32781 |    26155 |      1.2533 |          6626 |       20.213
```

Reproduces FABRIC exactly. Range 1.0464 (Dallas) to 1.2533 (Caldwell); weighted blend 1.0746. The inverse relationship with parcel density holds: rural counties have larger parcels touching more 0.02-degree tiles.

**No outliers requiring action.** Caldwell at 1.2533 is the worst of the nineteen and is still far below Kenedy's 4.4610 — as expected, since all nineteen are metro-corridor counties. The FABRIC 6.95 percent statewide figure is the row-weighted aggregate and is confirmed. Seam duplication is a storage and denominator concern, not a correctness defect: FABRIC proved zero split geometries across 334,638 tile-spanning features, and nothing here contradicts that.

---

## 5. IDENTITY INTEGRITY

```sql
WITH pf AS (SELECT DISTINCT ON (county_fips, feature_index) county_fips, feature_index, prop_id, md5(geometry::text) gh
            FROM txgio_parcel WHERE county_fips IN (<the 19>) ORDER BY county_fips, feature_index, tile_key),
     shared AS (SELECT county_fips, prop_id, count(*) AS nfeat FROM pf
                WHERE prop_id IS NOT NULL AND prop_id NOT IN ('0','','-1')
                GROUP BY 1,2 HAVING count(*)>1)
SELECT p.county_fips, count(*) AS features,
  count(*) FILTER (WHERE prop_id IS NULL) AS null_prop_id,
  count(*) FILTER (WHERE prop_id IN ('0','','-1')) AS sentinel_prop_id,
  count(*) FILTER (WHERE prop_id ~ ':') AS prop_id_contains_colon,
  coalesce((SELECT sum(nfeat) FROM shared s WHERE s.county_fips=p.county_fips),0) AS features_on_shared_prop_id,
  coalesce((SELECT max(nfeat) FROM shared s WHERE s.county_fips=p.county_fips),0) AS worst_shared_prop_id
FROM pf p GROUP BY 1 ORDER BY sentinel_prop_id DESC;
```

```
 county_fips | features | null | sentinel | colon | shared_feats | shared_ids | worst
-------------+----------+------+----------+-------+--------------+------------+-------
 48453       |   828773 |    0 |   423540 |     0 |        28030 |       3714 |  1210
 48367       |   100548 | 1021 |     5452 |     0 |         2804 |       1311 |    14
 48027       |   167412 |    0 |     1743 |     0 |          176 |         80 |     7
 48029       |   709541 |    0 |      888 |     0 |         6025 |        628 |  2187
 48121       |   353631 |    0 |      541 |     0 |         2388 |       1095 |    12
 48187       |    95571 |    0 |      400 |     0 |         2599 |       1155 |    32
 48085       |   387737 |    0 |      366 |     0 |           75 |         37 |     3
 48209       |   117427 |   80 |      342 |     0 |         1074 |        489 |     7
 48055       |    26155 |    0 |      193 |     0 |         1314 |        340 |   116
 48091       |   103537 |    0 |      162 |     0 |          306 |        137 |    19
 48021       |    63357 |    0 |      138 |     0 |         1643 |        680 |    20
 48257       |    94650 |  111 |      110 |     0 |         1817 |        679 |   236
 48309       |   115362 |   11 |      104 |     0 |         1397 |        404 |   227
 48397       |    52739 |    0 |        0 |     0 |          582 |        263 |    26
 48439       |   757161 |    5 |        0 |     0 |        95983 |      28665 |   495
 48113       |   694160 |    0 |        0 |     0 |          709 |        105 |    97
 48251       |   101847 | 1186 |        0 |     0 |          114 |         56 |     3
 48491       |   282983 |  125 |        0 |     0 |          574 |        286 |     4
 48139       |    98803 |    0 |        0 |     0 |         1219 |        566 |    13
```

**Travis `prop_id='0'` — briefing claim corrected.** The briefing says 454,349 rows collapsing to 590 distinct geometries. My deduplicated figure is **423,540 features** carrying the sentinel. Both are right about different things: 454,349 is the *row* count (FABRIC section 5 confirms it), 423,540 is the *feature* count after removing tile-seam replication. The briefing quotes a row count against a feature-count framing. The 590-geometry collapse is FABRIC's and I did not re-derive it. **This is the same row-versus-parcel error class the briefing warned me about, reappearing in the briefing itself.**

**Tarrant is the worst identity case in the set, not Travis.** 28,665 shared prop_ids covering 95,983 features — 12.7 percent of the county. The `A 36-1` case the briefing names (133 leasehold accounts on one DFW Airport polygon) is one instance of a county-wide pattern; the worst single prop_id covers 495 features. Bexar's worst covers 2,187.

**Malformed node ids reached production, confirmed.** The briefing's `48021:0` claim is true and there is more of it:

```sql
SELECT split_part(entity_id,':',1) AS fips, entity_type, count(*) AS n
FROM atoms WHERE entity_id ~ '^48[0-9]{3}:' AND split_part(entity_id,':',2) IN ('0','-1','')
GROUP BY 1,2 ORDER BY n DESC;
```

```
 48021 | property-boundary-edge | 57   (48021:0:boundary:0 ... 48021:0:boundary:56)
 48029 | zoning-fact            |  2   (48029:-1, 48029:0)
 48029 | buildable-envelope     |  2
 48029 | setback-rule           |  2
 ... 16 further single-atom rows across 48055/48085/48091/48121/48187/48209/48257/48309/48367/48453/48021/48027
```

**Bastrop carries 57 `property-boundary-edge` atoms hung off the sentinel node `48021:0`** — a non-parcel that has been given a full boundary decomposition. Bexar carries `48029:-1`, a negative sentinel, with a complete zoning-fact / setback-rule / buildable-envelope chain. These are real garbage atoms serving from the production store, 23 sentinel-keyed entity groups in total.

### 5.1 The consequence the manifest actually feels — unaddressable parcels

Atoms are keyed `{fips}:{prop_id}`. Any parcel with a sentinel/null prop_id, or sharing a prop_id with another feature, cannot be individually addressed:

```sql
WITH pf AS (SELECT DISTINCT ON (county_fips, feature_index) county_fips, feature_index, prop_id
            FROM txgio_parcel WHERE county_fips IN (<the 19>) ORDER BY county_fips, feature_index, tile_key),
     dup AS (SELECT county_fips AS dc, prop_id AS dp FROM pf
             WHERE prop_id IS NOT NULL AND prop_id NOT IN ('0','','-1') GROUP BY 1,2 HAVING count(*)>1)
SELECT pf.county_fips, count(*) AS features,
  count(*) FILTER (WHERE pf.prop_id IS NULL OR pf.prop_id IN ('0','','-1')) AS unaddressable_sentinel,
  count(*) FILTER (WHERE d.dp IS NOT NULL) AS collapsed_into_shared_key,
  round(100.0*count(*) FILTER (WHERE pf.prop_id IS NULL OR pf.prop_id IN ('0','','-1') OR d.dp IS NOT NULL)/count(*),3) AS pct_unaddressable
FROM pf LEFT JOIN dup d ON d.dc=pf.county_fips AND d.dp=pf.prop_id GROUP BY 1 ORDER BY pct_unaddressable DESC;
```

```
 county_fips | features | sentinel | shared_key | total_unaddressable | pct
-------------+----------+----------+------------+---------------------+--------
 48453       |   828773 |   423540 |      28030 |              451570 | 54.487
 48439       |   757161 |        5 |      95983 |               95988 | 12.677
 48367       |   100548 |     6473 |       2804 |                9277 |  9.226
 48055       |    26155 |      193 |       1314 |                1507 |  5.762
 48187       |    95571 |      400 |       2599 |                2999 |  3.138
 48021       |    63357 |      138 |       1643 |                1781 |  2.811
 48257       |    94650 |      221 |       1817 |                2038 |  2.153
 48309       |   115362 |      115 |       1397 |                1512 |  1.311
 48251       |   101847 |     1186 |        114 |                1300 |  1.276
 48209       |   117427 |      422 |       1074 |                1496 |  1.274
 48139       |    98803 |        0 |       1219 |                1219 |  1.234
 48027       |   167412 |     1743 |        176 |                1919 |  1.146
 48397       |    52739 |        0 |        582 |                 582 |  1.104
 48029       |   709541 |      888 |       6025 |                6913 |  0.974
 48121       |   353631 |      541 |       2388 |                2929 |  0.828
 48091       |   103537 |      162 |        306 |                 468 |  0.452
 48491       |   282983 |      125 |        574 |                 699 |  0.247
 48085       |   387737 |      366 |         75 |                 441 |  0.114
 48113       |   694160 |        0 |        709 |                 709 |  0.102
```

**Travis: 54.5 percent of its features cannot be addressed by the atom key.** This is why Travis's zoning-fact count is 380,920 against 828,773 features — the atoms are not missing, the parcels are unreachable by design of the key. FABRIC's N2 finding (business personal-property and utility accounts stamped onto real-property polygons under `prop_id='0'`) is the cause, and I confirm the effect propagates directly into atom coverage.

---

## 6. ATOM COVERAGE

```sql
SELECT split_part(entity_id, ':', 1) AS fips,
  count(*) FILTER (WHERE entity_type='zoning-fact') AS zoning_fact,
  count(*) FILTER (WHERE entity_type='setback-rule') AS setback_rule,
  count(*) FILTER (WHERE entity_type='buildable-envelope') AS buildable_envelope,
  count(*) FILTER (WHERE entity_type='parcel-terrain-model') AS terrain_model,
  count(*) FILTER (WHERE entity_type='property-boundary-edge') AS boundary_edge
FROM atoms WHERE entity_id ~ '^48[0-9]{3}:' GROUP BY 1 ORDER BY zoning_fact DESC;
```

Joined against the usable-prop_id denominator:

| fips | county | usable prop_ids | zoning-fact | setback-rule | buildable-envelope | terrain | boundary-edge | envelope % |
|---|---|---:|---:|---:|---:|---:|---:|---:|
| 48029 | Bexar | 703,256 | 703,259 | 406,611 | 406,611 | 1 | 0 | 57.8 |
| 48113 | Dallas | 693,556 | 693,556 | 0 | **0** | 0 | 0 | **0** |
| 48439 | Tarrant | 689,838 | 689,838 | 0 | **0** | 0 | 0 | **0** |
| 48085 | Collin | 387,333 | 387,334 | 0 | **0** | 0 | 0 | **0** |
| 48453 | Travis | 380,917 | 380,920 | 172,713 | 172,713 | 0 | 0 | 45.3 |
| 48121 | Denton | 351,797 | 351,798 | 0 | **0** | 0 | 0 | **0** |
| 48491 | Williamson | 282,570 | 282,570 | 124,499 | 282,436 | 0 | 0 | 99.9 |
| 48027 | Bell | 165,573 | 165,574 | 0 | 104,404 | 0 | 0 | 63.1 |
| 48209 | Hays | 116,420 | 116,421 | 34,454 | 102,143 | 0 | 0 | 87.7 |
| 48309 | McLennan | 114,254 | 114,255 | 0 | 65,814 | 0 | 0 | 57.6 |
| 48091 | Comal | 103,206 | 103,207 | 25,389 | 101,914 | 0 | 0 | 98.7 |
| 48251 | Johnson | 100,603 | 100,603 | 0 | **0** | 0 | 0 | **0** |
| 48139 | Ellis | 98,150 | 98,150 | 0 | **0** | 0 | 0 | **0** |
| 48187 | Guadalupe | 93,727 | 93,728 | 0 | 63,115 | 0 | 0 | 67.3 |
| 48257 | Kaufman | 93,291 | 93,292 | 0 | 93,292 | 0 | 0 | 100.0 |
| 48367 | Parker | 92,582 | 92,583 | 0 | **0** | 0 | 0 | **0** |
| 48021 | Bastrop | 62,256 | 62,260 | 9,503 | 62,260 | 59 | 26,846 | 100.0 |
| 48397 | Rockwall | 52,420 | 52,420 | 0 | **0** | 0 | 0 | **0** |
| 48055 | Caldwell | 24,988 | 24,989 | 5,507 | 24,006 | 0 | 0 | 96.1 |

**Every county has essentially complete zoning-fact coverage** (matching usable prop_ids to within 1-4 atoms, the excess being the sentinel-keyed garbage from section 5).

**Eight counties have zero buildable-envelope atoms**: Dallas, Tarrant, Collin, Denton, Johnson, Ellis, Parker, Rockwall — 2,467,879 parcels with geometry and zoning-facts but no envelope layer. These are the third loading epoch (2026-08-04/05) that got geometry plus a zoning bake and stopped.

**`parcel-terrain-model` is effectively absent everywhere**: 59 atoms in Bastrop, 1 in Bexar, 0 in the other seventeen. Statewide total is 60. `property-boundary-edge` exists only in Bastrop (26,846, of which 57 are the sentinel garbage).

Cross-checked against the manifest's own coverage table:

```sql
SELECT county_fips, count(*) AS facet_rows, count(*) FILTER (WHERE onboarded) AS onboarded_facets,
  count(*) FILTER (WHERE staleness_flag) AS stale_facets, round(avg(honest_coverage_pct),2) AS avg_coverage_pct,
  max(checked_at)::date AS last_checked
FROM county_facet_coverage WHERE county_fips IN (<the 19>) GROUP BY 1 ORDER BY 1;
```

```
 48021 | 3 | 2 | 0 | 99.18 | 2026-08-03      48027 | 3 | 0 | 0 | 25.92 | 2026-07-21
 48029 | 3 | 0 | 0 | 29.28 | 2026-07-21      48055 | 3 | 0 | 0 | 31.83 | 2026-07-21
 48085 | 3 | 0 | 0 | 33.14 | 2026-08-04      48091 | 3 | 0 | 0 | 17.21 | 2026-07-21
 48113 | 3 | 0 | 0 | 30.94 | 2026-08-05      48121 | 3 | 0 | 0 | 28.86 | 2026-08-04
 48139 | 3 | 0 | 0 |  0.00 | 2026-08-04      48187 | 3 | 0 | 0 | 26.06 | 2026-07-21
 48209 | 3 | 0 | 0 | 29.50 | 2026-07-21      48251 | 3 | 0 | 0 |  0.00 | 2026-08-04
 48257 | 3 | 0 | 0 | 25.08 | 2026-08-04      48309 | 3 | 0 | 0 | 26.40 | 2026-07-21
 48367 | 3 | 0 | 0 |  0.00 | 2026-08-04      48397 | 3 | 0 | 0 |  0.00 | 2026-08-04
 48439 | 3 | 0 | 0 | 33.13 | 2026-08-05      48453 | 3 | 0 | 0 | 15.59 | 2026-07-21
 48491 | 3 | 0 | 0 | 52.37 | 2026-07-21
```

**Only Bastrop is `onboarded` (2 of 3 facets). Eighteen of nineteen are `onboarded=false`.** Zero counties carry `staleness_flag` or `rewarm_unsafe` — meaning the staleness machinery has never flagged any of them, which given section 7 is itself the finding: the flag is not being maintained.

---

## 7. STALENESS

### 7.1 Source vintage — no county is stale relative to what is published

All nineteen are on the StratMap 2025 land-parcels program. Ten on 202503, six on 202507, three on 202508 (section 2.2 table). The 202503 counties are five months behind the newest published edition. Whether a newer per-county file exists is a live-source question I could not answer without probing the TxGIO catalog per county, which I did not do — but the *program* is the current one and no county is on a superseded program.

### 7.2 Atom vintage — this is where staleness actually lives

```sql
SELECT split_part(entity_id,':',1) AS fips, count(*) AS zoning_facts,
  min(body->>'fetchedAt') AS earliest, max(body->>'fetchedAt') AS latest,
  count(*) FILTER (WHERE (body->>'fetchedAt')::timestamptz < '2026-08-01T00:00:00Z') AS pre_august
FROM atoms WHERE entity_type='zoning-fact' AND entity_id ~ '^48[0-9]{3}:' GROUP BY 1 ORDER BY zoning_facts DESC;
```

```
 48029 | 703259 | 2026-07-23 | 2026-07-24 | 703259     48113 | 693556 | 2026-08-05 | 2026-08-05 |      0
 48439 | 689838 | 2026-08-05 | 2026-08-05 |      0     48085 | 387334 | 2026-08-04 | 2026-08-04 |      0
 48453 | 380920 | 2026-07-24 | 2026-07-24 | 380920     48121 | 351798 | 2026-08-04 | 2026-08-04 |      0
 48491 | 282570 | 2026-07-21 | 2026-07-23 | 282570     48027 | 165574 | 2026-07-24 | 2026-07-24 | 165574
 48209 | 116421 | 2026-07-23 | 2026-07-23 | 116421     48309 | 114255 | 2026-07-24 | 2026-07-24 | 114255
 48091 | 103207 | 2026-07-20 | 2026-07-20 | 103207     48251 | 100603 | 2026-08-04 | 2026-08-04 |      0
 48139 |  98150 | 2026-08-04 | 2026-08-04 |      0     48187 |  93728 | 2026-07-24 | 2026-07-24 |  93728
 48257 |  93292 | 2026-08-04 | 2026-08-04 |      0     48367 |  92583 | 2026-08-04 | 2026-08-04 |      0
 48021 |  62260 | 2026-07-30 | 2026-08-06 |      3     48397 |  52420 | 2026-08-04 | 2026-08-04 |      0
 48055 |  24989 | 2026-07-23 | 2026-07-23 |  24989
```

Eight counties carry zoning-facts baked 2026-07-20 through 2026-07-24 — before the entire Geometry Law fix chain (#266 through #275, all merged 2026-08-05 to 2026-08-07). Those are Bexar, Travis, Williamson, Bell, Hays, McLennan, Comal, Guadalupe, Caldwell.

**The `recipeVersion` field is the sharper staleness signal**, and it is missing entirely on the oldest generation:

```sql
SELECT split_part(entity_id,':',1) AS fips, count(*) AS n,
  count(*) FILTER (WHERE body ? 'recipeVersion') AS has_recipe,
  count(*) FILTER (WHERE body ? 'versionStamp') AS has_versionstamp
FROM atoms WHERE entity_type='buildable-envelope'
  AND split_part(entity_id,':',1) IN ('48029','48453','48491','48021') GROUP BY 1;
```

```
 fips  |   n    | has_recipe | has_versionstamp | has_reasoning | no_outcome_kind
-------+--------+------------+------------------+---------------+-----------------
 48021 |  62260 |      60467 |            62260 |         62260 |               0
 48029 | 406611 |          0 |           406611 |        406611 |               0
 48453 | 172713 |          0 |           172713 |        172713 |               0
 48491 | 282436 |     157937 |           282436 |        282436 |               0
```

**Bexar's and Travis's 579,324 envelopes carry no `recipeVersion` at all.** OPS-4's rewarm protocol names `recipe_version` as the mechanism that makes "which jurisdictions need rewarming" computable. For these two counties that mechanism cannot fire — they are invisible to the very machinery meant to catch them. Williamson is half-covered (157,937 of 282,436).

---

## 8. BASTROP 48021 — the extra-attention case

### 8.1 Envelope population by outcome and provenance

```sql
SELECT CASE WHEN body ? 'warmVerifyDeclineCode' THEN 'DECLINE:'||(body->>'warmVerifyDeclineCode')
            WHEN body->'outcome'->>'kind' IS NOT NULL THEN 'OUTCOME:'||(body->'outcome'->>'kind')
            ELSE 'PROMOTED-ENVELOPE' END AS class,
  count(*) AS n,
  count(*) FILTER (WHERE (body->>'fetchedAt')::timestamptz <  '2026-08-07T00:00:00Z') AS provenance_pre_0807,
  count(*) FILTER (WHERE (body->>'fetchedAt')::timestamptz >= '2026-08-07T00:00:00Z') AS provenance_on_after_0807
FROM atoms WHERE entity_type='buildable-envelope' AND entity_id LIKE '48021:%' GROUP BY 1 ORDER BY n DESC;
```

```
 class                                | n     | pre_0807 | on_after_0807
--------------------------------------+-------+----------+---------------
 DECLINE:unzoned-no-district-basis    | 47377 |    47377 |             0
 DECLINE:no-district-on-record        |  5327 |     5327 |             0
 OUTCOME:buildable                    |  3935 |     2267 |          1668
 DECLINE:no-setback-row               |  1948 |        1 |          1947
 OUTCOME:provisional-front-edge       |  1785 |     1785 |             0
 DECLINE:front-orientation            |   571 |        2 |           569
 DECLINE:road-classification-mismatch |   472 |        0 |           472
 DECLINE:r32-per-edge-inset           |   289 |       38 |           251
 DECLINE:null-inset                   |   268 |       44 |           224
 DECLINE:faces-answer                 |   180 |        1 |           179
 DECLINE:superseded-prop-id           |    84 |        0 |            84
 DECLINE:no-road-adjacency            |    14 |        0 |            14
 DECLINE:front-orientation-unresolved |     8 |        0 |             8
 DECLINE:geometry                     |     2 |        2 |             0
```

### 8.2 The stale-envelope finding — confirmed, quantified, and bounded

Positive (area-bearing) envelopes only:

```sql
SELECT body->'outcome'->>'kind' AS outcome_kind, count(*) AS n,
  count(*) FILTER (WHERE (body->>'fetchedAt')::timestamptz < '2026-08-07T00:00:00Z') AS stale_pre_geometry_law
FROM atoms WHERE entity_type='buildable-envelope' AND entity_id LIKE '48021:%'
  AND NOT (body ? 'warmVerifyDeclineCode') GROUP BY 1 ORDER BY n DESC;
```

```
 outcome_kind           |  n   | stale_pre_geometry_law | fresh | recipes
------------------------+------+------------------------+-------+---------
 buildable              | 3935 |                   2267 |  1668 | 1.0.0
 provisional-front-edge | 1785 |                   1785 |     0 | (none)
```

**4,052 Bastrop parcels serve a positive envelope built before the Geometry Law took effect.** Split by whether they embed an actual ring (section 3.4): **2,267 carry a `geojson` ring** computed by the pre-#274 offset core, and **1,785 are Tier-1 `provisional-front-edge` rows with no ring and no `recipeVersion`**.

The 2,267 ring-bearing stale envelopes are the live serve-truth defect. They were computed by the same core that measured 0/12 on the operator's test block three days before the saga closed 12/12. They are serving today.

### 8.3 The "no envelope and no decline" claim — refuted

```sql
SELECT (SELECT count(*) FROM atoms WHERE entity_type='zoning-fact' AND entity_id LIKE '48021:%') AS zoning_facts,
 (SELECT count(*) FROM atoms WHERE entity_type='buildable-envelope' AND entity_id LIKE '48021:%') AS envelopes,
 (SELECT count(*) FROM atoms z WHERE z.entity_type='zoning-fact' AND z.entity_id LIKE '48021:%'
    AND NOT EXISTS (SELECT 1 FROM atoms e WHERE e.entity_type='buildable-envelope' AND e.entity_id=z.entity_id)) AS zoning_fact_without_envelope,
 (SELECT count(*) FROM atoms e WHERE e.entity_type='buildable-envelope' AND e.entity_id LIKE '48021:%'
    AND NOT EXISTS (SELECT 1 FROM atoms z WHERE z.entity_type='zoning-fact' AND z.entity_id=e.entity_id)) AS envelope_without_zoning_fact;
```

```
 zoning_facts | envelopes | zoning_fact_without_envelope | envelope_without_zoning_fact
--------------+-----------+------------------------------+------------------------------
        62260 |     62260 |                            0 |                            0
```

**Perfect 1:1. Zero parcels with neither an envelope nor a decline record.** The briefing's concern that "369 received NO `promoteHonestVerifyDecline` write, meaning they are serving stale envelopes with no honest-decline marker" is **not reproducible in the store**. Every Bastrop parcel with a zoning-fact has an envelope atom, and every envelope atom is either a named outcome or a named decline. There is no bare-pending bucket.

I could not locate the 770-refused / 369-`declines.other` cohort as a store-resident population. `declines.other` is a *batch-JSON summary field* from the depth-warm runner, not an atom state — the runbook's dry/apply parity section names it as such. Whatever those 369 were at run time, they resolved into named atom states by now: the store shows fourteen distinct named decline codes and no unnamed residue. **This is a case where process memory (the batch JSON) and store truth disagree, and per the STORE-TRUTH PRINCIPLE the store wins.**

### 8.4 Bastrop's other defects

- **Multi-part exposure is the lowest of all nineteen**: 4 MultiPolygons, 423 holed polygons. Exactly one exposed parcel serves a positive envelope. Truncation is a non-issue here.
- **57 `property-boundary-edge` atoms on the sentinel node `48021:0`**, plus a zoning-fact / setback-rule / buildable-envelope triple on the same non-parcel.
- **1,781 parcels (2.81 percent) unaddressable** by the atom key — 138 sentinel, 1,643 sharing a prop_id.
- **Setback-rule coverage is 9,503 against 62,260 envelopes** (15.3 percent), consistent with the unzoned-county doctrine where most parcels legitimately have no setback basis.

---

## 9. RANKED REMEDIATION LIST

Ranked by defect severity times parcels affected, with the cheapest sufficient action named.

### Tier 1 — needs a re-warm (ring-bearing geometry computed by a defective core)

**1. Bastrop 48021 — RE-WARM, 2,267 parcels.** The only county in the set with stale ring-bearing envelopes serving today. 2,267 `buildable` envelopes carry a `geojson` ring computed pre-#274, plus 1,785 ringless `provisional-front-edge` rows that should be superseded by a real computation or an honest decline. This is already the named consequence in the Geometry Law close ("the Bastrop city cohort MUST run through the bde34ed pipeline"); this audit sizes it at 4,052 rather than the ~2,026 the decision record estimated. Use `--force-overwrite` per the city re-warm discipline.

**2. Caldwell 48055 — RE-WARM, 337 parcels.** Same defect class, much smaller. 337 ring-bearing envelopes, all pre-Geometry-Law. Worst seam factor (1.2533) and 5.76 percent unaddressable, but neither blocks a re-warm.

### Tier 2 — geometry is actually wrong; needs a source decision before anything else

**3. Bell 48027 — INVESTIGATE THE LOAD, 739 parcels.** 739 features lie fully outside the county boundary; 694 sit inside Census McLennan, up to 5.9 miles in. Not duplicates of McLennan rows. Either StratMap's `48027` file legitimately carries CAD-jurisdiction parcels across the Census line (in which case every county-resolution surface needs to know that) or the load mis-assigned them. **This must be resolved before Bell is warmed**, because 104,404 envelopes already exist on this county and a warm would compute rings for parcels of contested county identity. This is the only county in the set whose geometry is *wrong* rather than merely unmeasured.

### Tier 3 — atom-writing only (geometry is clean; the layer is simply absent)

**4-11. Dallas 48113, Tarrant 48439, Collin 48085, Denton 48121, Johnson 48251, Ellis 48139, Parker 48367, Rockwall 48397 — ATOM-WRITING ONLY, 2,467,879 parcels.** Zero buildable-envelope atoms. Geometry sane, zoning-facts complete and fresh (all baked 2026-08-04/05, post-dating most of the fix chain), no ring ever computed so no truncation exposure realized. These need a depth-warm on the *current* pipeline, not a re-warm — there is nothing to correct, only to create. Rank within the tier by parcel count. **Tarrant carries a caveat**: 12.7 percent of its features are unaddressable by the atom key (95,983 features on 28,665 shared prop_ids), so an envelope bake will silently cover only 87 percent of the county unless the node-identity question is settled first.

**12-16. Bexar 48029, Travis 48453, Williamson 48491, Hays 48209, Comal 48091, Guadalupe 48187, McLennan 48309, Kaufman 48257 — ATOM-WRITING (supersede Tier-1 rows), 1,139,948 positive envelopes.** These carry Tier-1 snapshot envelopes with no ring. They are not *wrong* — they honestly declare "buildable area not yet derived from geometry" — but they are placeholders occupying the slot a real envelope should fill, and Bexar and Travis carry no `recipeVersion`, so the rewarm-detection machinery cannot see them. Superseding them with real computed envelopes is net-new work, not correction. **Travis carries the heaviest caveat in the entire set**: 54.5 percent of its features are unaddressable by the atom key, so any coverage percentage quoted for Travis must state the denominator.

### Tier 4 — clean, no action

**17-19. No county in this set is fully clean.** The closest are Dallas 48113 (0.102 percent unaddressable, zero fully-outside features, fresh zoning-facts, lowest seam factor) and Collin 48085 (0.114 percent unaddressable). Both still need the envelope layer, so they sit in Tier 3.

### Cross-cutting, not county-scoped

**A. Purge sentinel-keyed atoms.** 23 entity groups keyed on `:0` or `:-1` across twelve counties, including 57 `property-boundary-edge` atoms decomposing the non-parcel `48021:0` and a full atom chain on `48029:-1`. These serve from production today.

**B. Backfill `recipeVersion` or accept that Bexar/Travis/half-of-Williamson are invisible to rewarm detection.** 579,324 envelopes with no recipe version, against an OPS-4 protocol that computes rewarm need from exactly that field.

**C. Correct the runbook's store topology.** `CORTEX_DATABASE_URL == DEPLOYMENT_DATABASE_URL`. There are two stores, not three.

---

## 10. WHAT IS ACTUALLY BROKEN

Stated plainly, in descending order of confidence and consequence.

**1. Bell County 48027 holds 694 parcels inside McLennan County.** Confirmed by Census TIGERweb point-in-polygon against two sample coordinates and by bbox arithmetic against the non-generalized county polygon. Up to 31,353 feet past the line. Zero geometric overlap with McLennan's own rows, so these are distinct parcels under a contested FIPS, not a double-load. This is the only *wrong geometry* in the set.

**2. Bastrop serves 2,267 buildable envelopes whose rings were computed by the core that measured 0/12 on the operator's own test block.** Plus 1,785 ringless placeholders. Confirmed by provenance timestamp against the 2026-08-07 Geometry Law date and by `geojson` key presence. This is a live serve-truth defect and it is the one the briefing correctly anticipated.

**3. Eight counties totalling 2,467,879 parcels have geometry and zoning-facts but no buildable-envelope layer at all.** Dallas, Tarrant, Collin, Denton, Johnson, Ellis, Parker, Rockwall. Not a corruption — an absence. The manifest cannot count what was never written.

**4. Travis cannot address 54.5 percent of its parcels and Tarrant 12.7 percent.** 451,570 and 95,988 features respectively are unreachable by the `{fips}:{prop_id}` atom key, through sentinel prop_ids (Travis) and massively shared prop_ids (Tarrant). Every coverage percentage published for these two counties is measured against a denominator that silently excludes half the fabric.

**5. 579,324 envelopes carry no `recipeVersion`,** making Bexar, Travis, and half of Williamson invisible to the OPS-4 rewarm-detection mechanism that is supposed to find exactly this problem.

**6. 23 sentinel-keyed atom groups serve from production,** including a 57-edge boundary decomposition of the non-parcel `48021:0` and a complete zoning/setback/envelope chain on `48029:-1`.

**7. The runbook's store topology is wrong.** Two secrets point at one database.

### What is NOT broken, despite reasonable fear

- **The projection guard defect is genuinely latent for all nineteen.** Zero 202505 vintages, zero Mercator-scale coordinates. Verified two ways, not assumed.
- **Geometry sanity holds everywhere.** Zero rows outside Texas degree bounds, zero inverted bboxes, across all nineteen (and all seventy-nine).
- **Multipolygon truncation, while a real code defect for two weeks, has almost no realized victims among these nineteen** — 25,843 parcels were exposed, but only ~4,079 serve any positive envelope and essentially all of those are ringless Tier-1 rows. Sixteen counties never ran the geometry path.
- **Seam duplication is exactly what FABRIC measured** and is not a correctness defect.
- **Bastrop has zero parcels with neither an envelope nor a decline.** Perfect 1:1 coverage. The honesty doctrine holds.
- **The non-transactional write path (defect 3) left no trace.** Every county's row count and feature count are internally consistent, and no county is half-loaded. This defect could have left a half-deleted county; none is.

---

## 11. WHAT I COULD NOT DETERMINE

**Whether Bell's 694 out-of-county parcels are a load error or correct CAD-jurisdiction behavior.** I proved they are inside the Census McLennan polygon and are not duplicates of McLennan rows. I did not fetch the source shapefile to check whether StratMap's `48027` file itself contains them, which is the one measurement that separates "our loader mis-assigned" from "the source is organized by appraisal district rather than Census geography." The single row carrying a situs names Salado, a real Bell County town near the line, which is weak evidence for the latter. **This is the highest-value follow-up in the audit and it is one download away.**

**Whether the dry/apply COMPUTE FORK (defect 1) affected these counties.** I could not test it. The defect is that the dry leg read stored boundary primitives only when `!dryRun`, so dry and apply ran different programs. Detecting a past instance requires the paired dry/apply artifact JSONs for each county's original run, which live in run records rather than the store. Nothing in the store distinguishes an envelope written by a correct apply from one written by an apply whose dry leg was meaningless. **Any "parity" claim in the original run records for these nineteen remains suspect and I could not clear or confirm it.**

**Whether a newer StratMap edition exists per county.** All nineteen are on the current 2025 program; ten are on the March 2025 edition, five months old. Determining whether TxGIO has since published a newer per-county file requires probing the source catalog for nineteen counties, which I did not do. The staleness grade in section 7 is therefore *relative to the program*, not *relative to the newest available file*.

**The true acreage exposed by multipolygon truncation.** No PostGIS, no source acreage column. FABRIC's bbox-based 12.53 percent is an upper bound and I did not improve on it. I deliberately ranked section 3 by parcel count rather than acreage because the acreage measure is the one that has already been wrong by 4.77x in this chain.

**Whether the 231 Bell/McLennan shared prop_ids indicate a real cross-county account relationship.** I proved they are not the same geometry. Whether two CADs independently reusing the same account numbers is expected, or whether it signals something about the source, was not investigated.

**What the 770-refused / 369-`declines.other` Bastrop cohort resolved into.** The store shows no unnamed residue and perfect 1:1 coverage, so whatever those parcels were at run time they now carry named states. I could not reconstruct the mapping from the batch-JSON counters to current atom states, because the batch JSONs are process memory and the runner does not persist a per-parcel decline ledger keyed to them.

**Whether the eight zero-envelope counties were *intended* to stop after the zoning bake.** I measured the absence. Whether it is a deliberate sequencing decision or an abandoned run is a question for the run records, not the store.

**Anything about the sixty counties loaded 2026-08-09.** Out of scope by construction. They were loaded after the fixes and would need their own grade.
