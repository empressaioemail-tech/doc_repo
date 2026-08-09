---
id: 2026-08-08_STATEWIDE_acquisition_scope
title: Statewide acquisition scope — the jurisdiction-free layers, probed and sized
date: 2026-08-08
status: scoping (read-only; every source claim live-probed, no writes, no ingest run)
owner: nick
related: [_decisions/2026-08-08_layer_first_statewide_fabric_sequence, _inbox/2026-08-08_STATEWIDE_layer_inventory, _inbox/2026-08-08_FABRIC_statewide_parcel_analysis, _decisions/2026-08-08_county_shape_thirteen_rails_and_geometry_first, 90_operations/OPS-1_texas_source_registry, 40j_hauska_map_tile_build_pipeline, _catalog/texas_roster_v1.json]
---

# Statewide acquisition scope — the layers that need no jurisdiction

This scopes only the JURISDICTION-FREE layers: the ones acquired once from a statewide-uniform public source with no per-jurisdiction knowledge. Zoning, setbacks and code text are out of scope by construction; they are L5 backfill.

Every source below was probed live on 2026-08-08 from this machine. Commands and raw responses are pasted verbatim. Nothing was ingested, nothing was written, no database received anything but SELECT.

The single most important finding is that the download volume for the entire missing parcel spine is **4.26 GB across 235 counties**, and that the acquisition mechanism is already built, already proven nineteen times, and blocked by a **hardcoded nineteen-county allowlist in a single TypeScript file**. That is the first move.

---

## 1. Ordering and concurrency

### Dependency table

| Layer | Hard prerequisite | Blocks | Store | Can start today |
|---|---|---|---|---|
| L1 City + county boundaries | none | honest in-city determination, ETJ derivation | new table, txgio Neon | DONE per operator (1,222 city + 254 county live) |
| **L2 Parcel geometry, 235 counties** | none | PMTiles bake, every per-parcel enrichment, the node list itself | `txgio_parcel` | **YES, this is the first move** |
| L3a Roads, statewide OSM extract | none (source-independent of L2) | frontage, then setbacks | `road-node` atoms, hauska_mcp | YES, concurrently with L2 |
| L3b Road-to-parcel frontage join | L2 AND L3a | setback derivation | derived | no |
| L4a FEMA NFHL statewide polygons | none | flood rail as a layer | new table | YES, concurrently |
| L4b SSURGO soils statewide | none | soils rail as a layer | new table | YES, concurrently |
| L4c 3DEP statewide terrain-RGB | none | 3D viz, terrain-derived features | GCS bucket | YES, concurrently |
| L5 PMTiles statewide bake | **L2 complete** (or per-wave) | map render of the fabric | `gs://hauska-map-tiles` | no, waits on L2 |

### The dependency graph

```
                    (L1 boundaries: DONE)
                              |
   +------------+-------------+--------------+-------------+
   |            |             |              |             |
  L2         L3a roads     L4a FEMA      L4b SSURGO    L4c 3DEP
 parcels     (Geofabrik)   (bulk zip)     (SDA WFS)    (TNM 64GB)
   |            |             |              |             |
   |            +------+------+              |             |
   |                   |                     |             |
   |            L3b frontage join            |             |
   |            (needs L2 AND L3a)           |             |
   |                                         |             |
   +--> L5 PMTiles bake <--------------------+-------------+
        (needs L2; the others are additive layers, not tile inputs)
```

**What genuinely parallelizes.** L2, L3a, L4a, L4b and L4c touch five different sources on five different hosts and land in four different stores. They share nothing except operator attention and the heavy-scan slot. L2 writes `txgio_parcel` on the legacy-design-tools Neon; L3a writes atoms on the hauska_mcp Neon; L4a and L4b want new tables; L4c writes only to GCS and never touches a database at all. **L4c is fully parallel with zero database contention and should be run alongside L2 as a free win.**

**What does not parallelize.** L2 against itself. The ingest CLI does `DELETE FROM txgio_parcel WHERE county_fips = $1` then streams 250-row batches into one Neon instance. Running 235 counties concurrently against one Neon writer is the heavy-scan-slot contradiction the layer-first decision already flagged as unresolved (`_decisions/2026-08-08_layer_first_statewide_fabric_sequence.md`, Open items). Counties are independent at the source and independent at the row level (`county_fips` is the leading PK column), so the contention is purely writer capacity, not correctness.

### The cheapest first win after boundaries

**L2, run as a wave of the ~50 smallest counties.** Not because it is the easiest layer in isolation, L4a FEMA is a single 1.8 GB download, but because L2 is the only layer that is simultaneously (a) the thing every other rail joins to, (b) already built and proven nineteen times, and (c) blocked by a change that is roughly ten lines of code. The 235 missing counties total 4.26 GB; the median county zip is a few megabytes. Fifty rural counties can be acquired for well under 200 MB of download.

If the criterion is instead "smallest amount of new engineering for a complete statewide layer," the answer is different and worth naming: **L4c terrain**, because the GDAL pipeline exists and generalizes cleanly (see section 3), and **L4a FEMA**, because the entire state is one file. Both are real one-pass wins. Neither is on the critical path the way L2 is.

---

## 2. Parcel shapefiles — the 235 missing counties (L2, the spine)

### The source is live, uniform, and cheap

All 254 roster URLs were range-probed. Command shape:

```
curl -sSL -o /dev/null -D - --max-time 60 -r 0-0 \
  -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36" \
  "https://data.geographic.texas.gov/0fa04328-872e-481c-b453-126a74777593/resources/stratmap25-landparcels_48001_lp.zip"
```

Raw response, Anderson 48001:

```
HTTP/1.1 206 Partial Content
Content-Type: application/x-zip-compressed
Content-Length: 1
Last-Modified: Thu, 04 Sep 2025 22:34:46 GMT
Content-Range: bytes 0-0/19260520
```

Harris 48201, the largest and the one flagged as needing sharding:

```
HTTP/1.1 206 Partial Content
Content-Type: application/x-zip-compressed
Content-Length: 1
Last-Modified: Thu, 04 Sep 2025 22:36:22 GMT
Content-Range: bytes 0-0/479483352
```

Donley 48129, the one known gap:

```
HTTP/1.1 404 Not Found
Content-Type: text/html
Content-Length: 1353
```

Full 254-county sweep, run at concurrency 8:

```
probed: 254 ok: 253 failed: 1
TOTAL all 254: 6600081063 = 6.6 GB
TOTAL 235 not-loaded: 4256138637 = 4.26 GB
failures: [('48129', 'Donley', None, 'HTTPError:404')]
largest: [('48201','Harris',479.5), ('48453','Travis',345.8), ('48029','Bexar',326.7),
          ('48439','Tarrant',319.8), ('48113','Dallas',276.8), ('48085','Collin',211.8),
          ('48157','Fort Bend',200.8), ('48339','Montgomery',194.3)]
```

**There is no statewide bulk product.** It is bulk-ZIP-per-county on a uniform URL template, 253 of 254 published, one 404 (Donley, which per OPS-1 needs a county CAD/ArcGIS override). Total 6.6 GB for the whole state; **4.26 GB for the 235 not yet loaded**. This is a trivially small download by any modern standard, the entire Texas cadastral fabric fits on a thumb drive.

Vintage distribution from the roster: 146 counties at 202503, 57 at 202505, 29 at 202507, 17 at 202508, 4 at 202509, 1 null (Donley). Roster feature-count sum across all 254 is 13,360,496; across the 235 absent counties, **8,202,783 features**.

### What the existing ingest actually does today

`P:\legacy-design-tools\lib\cad-ingest\src\txgio\cli.ts` is a complete, exit-bounded, idempotent per-county ingest. It downloads the zip with a browser UA, extracts the shapefile, hard-fails on any `.prj` that is not GCS_WGS_1984, streams features through `normalizeTxgioFeature`, and batch-upserts. It supports `--dry-run` (parse only, no DATABASE_URL required), `--limit=N`, `--batch-size`, `--vintage`, and `--file` override. Replace semantics per county: `deleteCountyParcels` then insert, with `ON CONFLICT DO UPDATE` on the PK so a resumed partial run is idempotent without a second delete.

**It cannot ingest a county that is not already on the allowlist.** From `cli.ts`:

```ts
const county = resolveTxgioCounty(values.county);
if (!county) {
  const supported = Object.values(TXGIO_COUNTIES)
    .map((c) => `${c.fips} ${c.name}`)
    .join(", ");
  fail(`unknown county "${values.county}" — supported: ${supported} ...`);
}
```

And `counties.ts` hardcodes exactly the nineteen loaded counties as a literal `Record<string, TxgioCounty>`, the ten Central-TX counties plus the nine-county DFW fan added 2026-08-04. The same file already contains the general URL builder:

```ts
export function txgioDownloadUrl(fips: string): string {
  return (
    `https://data.geographic.texas.gov/${TXGIO_COLLECTION_ID}/resources/` +
    `stratmap25-landparcels_${fips}_lp.zip`
  );
}
```

**So the blocker is an allowlist, not a capability.** The URL template is already general; the file's own header comment states the schema is statewide-uniform and no per-county field mapping is needed ("the StratMap program publishes ONE statewide-normalized attribute schema... No per-county URL or field-mapping overrides are needed", verified against real Caldwell/Bexar/Travis zips 2026-07-18). The fix is to make `resolveTxgioCounty` accept any valid `48\d{3}` FIPS and synthesize the county row from `txgioDownloadUrl` plus a FIPS-to-name table, keeping the existing nineteen as named entries. That is the smallest change that unlocks the entire spine.

### De-duplication: at ingest or at read? Recommend READ, and it is already there

The duplication mechanism, from `geo.ts`: the ingest buckets each feature into **every** 0.02-degree grid cell its bbox intersects, and `ingest.ts` writes one row per cell:

```ts
for (const tileKey of rec.tileKeys) {
  batch.push({ countyFips: rec.countyFips, tileKey, featureIndex: rec.featureIndex, ... });
}
```

The PK is `(county_fips, tile_key, feature_index)`. The fabric analysis established that this replication is byte-identical in all 334,638 tile-spanning features, with zero split geometries and zero differing bboxes, and that it inflates rows by 16.6 percent.

**Recommendation: keep de-duplication at read time. Do not change the ingest.** Four reasons, in order of weight.

First, the tile-bucketing is not incidental storage waste, it **is** the spatial index. There is no PostGIS in this store (`SELECT extname FROM pg_extension` returns only `plpgsql` and `vector`). Reads work by computing the covering cell keys for a viewport bbox and doing a PK-prefix equality scan. De-duplicating at ingest would mean storing each feature once and then having no way to find it by location without a sequential scan or a new index structure. The 16.6 percent row overhead is the price of the index, and it is cheap.

Second, the read-time dedupe already exists and is already correct in both consumers. The PMTiles bake does `SELECT DISTINCT ON (feature_index) ... ORDER BY feature_index` per county, and its header comment names this explicitly as "the same dedupe the store readers use."

Third, changing ingest semantics now would invalidate the nineteen loaded counties and force a full re-ingest of the metro core to keep the store internally consistent. That is strictly more work for a worse outcome.

Fourth, the fabric analysis established that the correct dedupe key depends on the question being asked, and no single ingest-time choice can serve both. `DISTINCT ON (county_fips, feature_index)` collapses tile seams and preserves account identity. `DISTINCT ON (county_fips, md5(geometry::text))` additionally collapses the N5 class (many accounts on one polygon, the Tarrant `A 36-1` DFW Airport case, 133 leasehold accounts on one geometry) and yields the true 4,617,181 parcel count. Baking either into ingest destroys the other. Read-time keeps both available.

**The one thing that must change:** the honest parcel count must be published as `count(DISTINCT (county_fips, md5(geometry::text)))`, never `count(*)`, and the layer-first decision's `DISTINCT ON (county_fips, feature_index)` seam reconciliation must be applied at every read that reports a number. The fabric analysis' closing warning applies directly, "anything derived from `count(*)` on this table should be re-checked."

### Storage sizing

Live store, verified this session:

```
$ psql "$PGURL" -t -c "SELECT count(DISTINCT county_fips) AS counties, count(*) AS rows FROM txgio_parcel;"
       19 | 5535897
```

19 counties, 5,535,897 rows, 4,617,181 true distinct parcels. Extrapolating on the roster's own feature counts rather than on density guesswork: the 19 loaded counties carry 5,157,713 roster features and produced 5,535,897 rows, a row-to-feature ratio of 1.073. The 235 absent counties carry 8,202,783 roster features. Rural counties have larger parcels touching more tiles, so their ratio will be worse, the observed range is 4.4 percent (Dallas) to 20.2 percent (Caldwell) seam duplication, and Caldwell is the most rural of the nineteen. Assume 1.15 to 1.25 for the rural tail.

**Projected statewide `txgio_parcel`: roughly 13.4M features, 15 to 16.5M rows.** That is about 2.9x the current row count. The current table's on-disk size was not measured this session (see WHAT I COULD NOT DETERMINE), so the byte projection is the one number here without a measurement behind it. The dominant column is a jsonb GeoJSON polygon; at a rough 1 to 2 KB per row the table lands somewhere in the 15 to 35 GB range plus indexes. **Neon storage sizing for this is a real open question and should be checked against the plan before the bulk run starts, not after.**

### Dry-run, idempotency, honest absence

Dry run is native: `--dry-run` parses and counts without requiring `DATABASE_URL` at all. That makes a full 235-county parse-only validation sweep possible with zero write risk, which is the correct first execution, it proves every zip parses and every `.prj` is WGS84 before a single row is written.

Idempotency is native and well-designed: delete-then-insert per county, with `ON CONFLICT DO UPDATE` on the PK so a run that dies mid-county can be re-run without a second delete. Re-running a county with a fresher vintage cleanly replaces it.

Honest absence has exactly one case: **Donley 48129**, which 404s. Per the county-shape ruling's three-state model this is not `satisfied-absent`, StratMap simply does not publish it, and the county's parcels do exist. It is `not-yet` pending a county CAD/ArcGIS override, and it should be recorded as such rather than silently skipped.

### Cost

Zero dollars for the data. TxGIO StratMap is public domain, no auth, no published rate limit, browser UA required. 4.26 GB of egress from CloudFront costs nothing on the receiving side. The cost is compute time and Neon storage/write capacity, not license.

---

## 3. Topography and elevation

### What exists today

`P:\legacy-design-tools\artifacts\tile-pipeline\` holds a **complete and already-executed** GDAL pipeline: `terrain_dem_acquire.py`, `terrain_rgb_tiles_bake.py`, `gdal_runner.py`, `aoi_presets.json`, `requirements.txt`, and a full operator README. This is better than the layer inventory implied, the inventory correctly said topography is not held statewide, but it undersold the tooling.

Proof that it has actually been run and published:

```
$ gcloud storage ls -l --project=legacy-design-tools-prod "gs://hauska-map-tiles/**" | tail
      7917  2026-07-31T22:40:18Z  gs://hauska-map-tiles/terrain-rgb.bac36819c719/9/117/211.png
TOTAL: 3758 objects, 1417554851 bytes (1.32GiB)

$ gcloud storage du -s --project=legacy-design-tools-prod "gs://hauska-map-tiles/terrain-rgb.bac36819c719"
25837066     gs://hauska-map-tiles/terrain-rgb.bac36819c719
```

**A terrain-RGB pyramid already exists in production**: 25.8 MB of z0-z16 PNGs for the `bastrop-city-2mi` AOI, baked 2026-07-31. The pipeline is proven end to end.

Separately, the 60 `parcel-terrain-model` atoms are a completely different thing, per-parcel on-demand DEM crops from `elevation.nationalmap.gov` at authoring time, fetched at engagement time for site plans. Those are not a layer and do not generalize. The tile pipeline is the thing that generalizes.

### Does the AOI design generalize to a whole state?

**Partially. The bake generalizes; the acquire does not, and the source choice is wrong for statewide.**

`aoi_presets.json` holds exactly two presets, both Bastrop, each a bbox plus `tile_name_patterns` that fnmatch against TxGIO `area_type_name` strings:

```json
{
  "bastrop-city-2mi": { "bbox_wgs84": {...}, "tile_name_patterns": ["Bastrop|*", "Bastrop SW|*"] },
  "bastrop-county":   { "bbox_wgs84": {...}, "tile_name_patterns": ["Bastrop","Smithville","Elgin","McDade","Rosanky"] }
}
```

Two structural problems for statewide. First, the default source is `DEFAULT_COLLECTION_ID = "0549d3ba-3f72-4710-b26c-28c65df9c70d"`, StratMap **2017 Central Texas** Lidar. That collection covers Central Texas, not Texas. A statewide run against it would silently produce a Central-Texas-shaped mosaic and call it Texas. Second, `tile_name_patterns` is a hand-authored quad-name list per AOI. Writing those by hand for the whole state is exactly the per-jurisdiction ceremony layer-first exists to eliminate.

The README's own "Statewide extension" section says "Add an AOI preset... Re-run acquire... No code fork." That is true for a *larger AOI within one collection*. It is not true for a genuinely statewide bake, which needs multi-collection mosaicking across the patchwork of TxGIO LiDAR collections with differing vintages, resolutions, and possibly differing vertical datums. The README's own datum-trap warning (TxGIO = NAVD88, FEMA BFE may be NGVD29) becomes a per-collection problem the moment more than one collection is in the mosaic.

### The statewide route: USGS 3DEP, not TxGIO LiDAR

3DEP is genuinely uniform nationwide, which is exactly what a statewide layer wants. Probed live via The National Map API:

```
$ curl "https://tnmaccess.nationalmap.gov/api/v1/products?datasets=National%20Elevation%20Dataset%20(NED)%201/3%20arc-second&polyCode=48&polyType=state&max=500&outputFormat=JSON&prodFormats=GeoTIFF"

total reported: 251 items returned: 251
sum sizeInBytes: 64295943555 = 64.3 GB
sample: USGS 1/3 Arc Second n26w098 20240925  54350873
        https://prd-tnm.s3.amazonaws.com/StagedProducts/Elevation/13/TIFF/historical/n26w098/USGS_13_n26w098_20240925.tif
```

**251 tiles, 64.3 GB, 1/3 arc-second (roughly 10 m), one uniform product, direct S3 download, free.** One vintage family, one vertical datum (NAVD88), no per-county patterns to author.

The 1 m product also exists but is not the right choice here:

```
1m tiles total for TX: 12191
```

12,191 tiles at 1 m. At roughly the same per-tile byte size that is multiple terabytes, and 1 m detail is invisible above roughly z18 anyway. **Use 1/3 arc-second for the statewide layer; keep 1 m and the TxGIO LiDAR collections for per-parcel and per-engagement work where the resolution is load-bearing** (which is what `parcel-terrain/` already does).

### What a statewide terrain-RGB bake requires

Acquire: replace the TNRIS collection walk with a TNM-API tile enumeration for `polyCode=48`, download 251 GeoTIFFs (64.3 GB), `gdalbuildvrt` into a single virtual mosaic. The VRT step means the 64.3 GB never has to be materialized as one file.

Bake: the existing `terrain_rgb_tiles_bake.py` runs unchanged in shape, `gdalwarp` to EPSG:3857, unit conversion, `rio rgbify` Mapbox encoding (`base -10000`, `interval 0.1` m), `gdal2tiles.py` to a z0-z16 XYZ PNG pyramid. One simplification: 3DEP ships in meters on NAVD88, so the US-survey-foot conversion (`× 1200/3937`) that the TxGIO path needs becomes a no-op. That is a real reduction in datum risk, not just convenience.

Output volume: the Bastrop AOI produced 25.8 MB of tiles from a small bbox. Texas is roughly 695,000 km². Scaling by area from a ~500 km² AOI gives a rough order of 10 to 40 GB of PNG tiles at z0-z16, heavily dependent on how much of the pyramid is ocean/nodata (very little, for Texas) and on PNG compression of low-relief terrain (most of Texas is low-relief, which compresses well). **Call it 10 to 40 GB in `gs://hauska-map-tiles`, and treat that range as an estimate, not a measurement.**

Compute: this is the one layer with meaningful compute cost. `gdal2tiles.py` over a statewide mosaic to z16 is hours-to-days of single-machine CPU. It parallelizes cleanly by tile region if needed.

### Cost, the first real dollar figure

Data is free (USGS public domain, S3 requester-pays is not enabled on `prd-tnm`). Compute is a local or VM CPU cost.

**GCS storage is a real recurring dollar cost.** At standard `us-central1` pricing of roughly 0.02 USD per GB-month, 10 to 40 GB of terrain tiles is roughly **0.20 to 0.80 USD per month**, on top of the existing 1.32 GB in the bucket. Egress to the public internet on tile reads is the larger variable and scales with map traffic, not with the bake. Neither figure is alarming, but they are non-zero and recurring, unlike everything else in this document.

---

## 4. PMTiles parcel tile bake

### Current state, verified

```
$ gcloud storage ls -l --project=legacy-design-tools-prod "gs://hauska-map-tiles/*.pmtiles"
 936565640  2026-08-05T13:52:34Z  gs://hauska-map-tiles/parcels.3431529a2e8d.pmtiles
 429291180  2026-07-19T04:23:35Z  gs://hauska-map-tiles/parcels.4af31e1901e2.pmtiles
TOTAL: 2 objects, 1365856820 bytes (1.27GiB)
```

The live wired hash `parcels.3431529a2e8d.pmtiles` is **936.6 MB for 5.15M features across 19 counties**, deployed 2026-08-05, matching `40j_hauska_map_tile_build_pipeline.md`. Rollback artifact `parcels.4af31e1901e2.pmtiles` (429 MB, Central TX only) is retained.

Note the 5.15M figure is the **feature** count (`count(DISTINCT (county_fips, feature_index))` = 5,151,394), not the row count and not the true parcel count. The bake dedupes tile seams but not the N5 geometry-sharing class, which is correct for a map: 133 DFW Airport leaseholds should render as one clickable polygon.

### The PII guardrail, confirmed, and it is enforced in code

The doc's claim is correct and the enforcement is explicit. From `parcelsPmtilesBakeCli.ts`:

```ts
// situsAddress is the parcel's own public street address (on the
// listing, the county site, the map click UX). It is kept.
//
// owner_name is NOT stamped: the CAD owner NAME is the private pairing
// and this PMTiles archive is a public, bulk-downloadable, cache-forever
// artifact. Publishing owner names on ~2.5M features would leak the names
// of millions of Texans. `txgio_owner_for_gate` (when selected) is used
// ONLY inside the address-recovery owner gate below and never assigned to
// `properties`.
```

The enforcement mechanism is that `properties` is built field by field with an explicit allowlist, `county_fips`, `countyName`, `apn`, `parcel_node_id`, `situsAddress`, and land-use fields, rather than by spreading a row object. `owner_name` is selected from the database only for the two gated counties (Williamson, Hays) under the alias `txgio_owner_for_gate`, used solely inside an address-recovery owner match, and never written to `properties`:

```ts
const ownerSelect = needsOwnerForGate
  ? "owner_name AS txgio_owner_for_gate"
  : "NULL::text AS txgio_owner_for_gate";
```

**This invariant holds by construction and scales to 254 counties unchanged.** It is the single most important thing not to break during the statewide bake, because the artifact is public, bulk-downloadable and cached immutable, a leak is unrecallable. Any statewide bake must re-verify the emitted properties allowlist before upload, not merely trust that it was right last time.

There is a second data-integrity gate worth carrying forward: `landUseJoinKey` returns null for counties whose TxGIO prop_ids do not correspond to their CAD roll (Williamson, Hays), because a prior R-strip fabricated land-use onto ~97k Williamson and ~78k Hays parcels at 0.005 percent and 0.013 percent owner-match. **At 254 counties this gate must become data-driven rather than a two-FIPS blocklist**, or the statewide bake will fabricate land use for every county whose numbering diverges. The CLI already loads "the coverage ledger's computed `block` verdicts... seed fallback on an unscored DB," so the mechanism exists; it needs the ledger scored for all 254.

### What a statewide bake requires

Input: the same union of `txgio_parcel` + `txgio_parcel_staging`, per-county `DISTINCT ON (feature_index)`, unchanged.

Tooling: tippecanoe ≥2.x (felt fork; klokantech v1.24 is too old for PMTiles output), native or via the `tippecanoe-felt:latest` Docker image. Unchanged.

Output size: scaling 936.6 MB / 5.15M features to a projected ~13.4M statewide features gives roughly **2.4 GB**, with the caveat that rural parcels are geometrically larger and often simpler, and tippecanoe's zoom-dependent simplification means the relationship is not strictly linear. Expect 2 to 3 GB.

Serving: `gs://hauska-map-tiles`, immutable cache-control, range requests verified per the D4 spec, consumed by `hauska-map` via `apps/property-explorer/src/lib/config.ts` and `packages/map-renderer/src/chrome/sharedMapDefaults.ts`. **PMTiles is single-file and range-read, so a 2.4 GB archive serves fine**, the client fetches only the byte ranges for the tiles in view. This is precisely why PMTiles was the right choice and why the statewide bake does not need re-architecting.

Cost: ~2.4 GB at ~0.02 USD/GB-month is roughly **0.05 USD per month** of storage. Negligible. Egress scales with map traffic.

Trigger: still manual/offline. There is no Cloud Build job, no GitHub Action, no schedule. A statewide program that re-bakes as counties land will want either per-wave bakes (accepting N intermediate hashes and N config updates) or one bake at the end. **Recommend baking per wave, not per county**, each bake is a full re-read of the whole store, so per-county baking is quadratic work for no benefit.

---

## 5. Roads, statewide

### The current state is seven hand-authored scripts and a per-jurisdiction data model

```
$ ls packages/engine-core/scripts/ | grep -iE "road|overpass"
fetch-bastrop-county-roadway-fixture.ps1
fetch-bastrop-overpass-fixture.ps1
fetch-caldwell-cad-roads-fixture.ps1
fetch-caldwell-overpass-fixture.ps1
fetch-elgin-overpass-fixture.ps1
ingest-bastrop-roads-county-roadway.mjs
ingest-bastrop-roads-county-surveyed.mjs
ingest-bastrop-roads-overpass.mjs
ingest-bastrop-roads-pilot.mjs
ingest-caldwell-roads-cad.mjs
ingest-caldwell-roads-overpass.mjs
ingest-elgin-roads-overpass.mjs
```

The deeper problem is not the script count. It is that **the road data model is jurisdiction-bound by design**. `RoadIntakeDescriptor` in `road-intake/types.ts` carries `jurisdictionTenant`, `countyFips`, `defaultAccessPolicy`, `assumedRowWidthFt`, `sourceAdapter` and `sourceUrl`, and `emitRoadNode` consumes it on every single way:

```ts
export function emitRoadNode(descriptor: RoadIntakeDescriptor, obs: OsmRoadObservation, version = 1) {
  const roadNodeId = roadNodeIdFromParts(descriptor.countyFips, obs.osmWayId);
  ...
  const widthFt = assumedRowWidthFt(obs.classification, descriptor.assumedRowWidthFt);
  const { leftEdge, rightEdge } = buildRowEdgesFromCenterline(obs.centerline, widthFt);
```

Descriptors are hand-authored functions, one per jurisdiction: `bastropRoadIntakeDescriptor()`, `elginOsmRoadIntakeDescriptor()`, `caldwellCadRoadIntakeDescriptor()`, `caldwellOsmRoadIntakeDescriptor()`, `bastropCountySurveyedRoadDescriptor()`, `bastropCountyRoadwayDescriptor()`.

**This is rework, not reuse, and I want to be plain about it.** Two things are genuinely reusable: `parseOsmWayElement` (OSM way to observation, fully generic), and `classifyOsmHighwayTag` plus `buildRowEdgesFromCenterline` (classification and ROW-edge geometry, generic given a width table). What is not reusable is the descriptor layer, which requires a hand-authored record per jurisdiction and stamps `countyFips` into the road-node id. A statewide pass needs a **county-resolution step that does not exist**: given an OSM way's centerline, which of the 254 counties is it in, and what happens to a way that crosses a county line? Nothing in the current code answers that. This is the one layer in this document where the honest verdict is "the acquisition is easy, the model needs design work first."

Note also that `assumedRowWidthFt` is *assumed* ROW width from a classification table (highway 100 ft, residential 50 ft, alley 20 ft, and so on). At statewide scale that assumption is doing enormous load-bearing work under frontage and therefore under setbacks. It is defensible as v1 and it should be labeled as assumed in every downstream output, but it is not measurement.

### Overpass cannot do statewide. This is measured, not assumed.

```
$ curl -A "hauska-engine/1.0 (+https://cortex.empressa.io)" \
    -d '[out:json][timeout:170];area["ISO3166-2"="US-TX"][admin_level=4]->.tx;way["highway"](area.tx);out count;' \
    "https://overpass-api.de/api/interpreter"

{
  "version": 0.6,
  "generator": "Overpass API 0.7.62.11 87bfad18",
  ...
  "elements": [ ],
  "remark": "runtime error: Query ran out of memory in \"query\" at line 1. It would need at least 521 MB of RAM to continue."
}
```

A bare **count** of Texas highway ways exceeds the public Overpass memory limit. Not the geometry, the count. And the rate limit is two concurrent slots:

```
$ curl "https://overpass-api.de/api/status"
Connected as: 840482551
Current time: 2026-08-08T21:04:24Z
Announced endpoint: lambert.openstreetmap.de/
Rate limit: 2
2 slots available now.
```

Two slots, shared with the rest of the world, against a query that cannot even count. Tiling Texas into thousands of Overpass bboxes would work but would take days of polite querying, would hammer a free community service the project has no claim on, and would produce a snapshot smeared across days rather than one consistent extract. **Overpass is the wrong mechanism for L3a.** It remains the right mechanism for what it is used for today: a small bbox for one city at warm time.

### Geofabrik Texas extract, the right mechanism, probed live

```
$ curl -sSL -o /dev/null -D - -r 0-0 "https://download.geofabrik.de/north-america/us/texas-latest.osm.pbf"
HTTP/1.1 302 Found
HTTP/1.1 206 Partial Content
Last-Modified: Thu, 06 Aug 2026 23:17:19 GMT
Content-Type: application/octet-stream
Content-Range: bytes 0-0/713163541
Content-Length: 1

$ curl "https://download.geofabrik.de/north-america/us/texas-latest.osm.pbf.md5"
4dd27afd6bc1c654f9b9635b709cf424  texas-latest.osm.pbf
```

**713 MB, dated two days ago, with a published MD5, refreshed daily, free, ODbL.** One consistent snapshot of all Texas OSM. This is the acquisition mechanism.

Processing: `osmium tags-filter texas-latest.osm.pbf w/highway -o roads.pbf` then `osmium export` to GeoJSONSeq, or `osmium extract` per county bbox to preserve the existing per-county descriptor shape as an intermediate step. The way count will be in the low millions; `road-node` atoms currently total 25,078 across two counties, so this is a three-orders-of-magnitude increase in atom volume and the atom store sizing needs its own look.

Attribution obligation: ODbL requires attribution. The existing Overpass path already sets a proper User-Agent and emits `sourceCitation` per way (`OpenStreetMap way/<id> highway=<tag>`), so the citation discipline is already correct and carries over.

**TxDOT was not independently verified in this pass.** OPS-1 names TxDOT as a candidate and the layer inventory found zero adapter code (`grep -ril txdot` returned nothing relevant). I did not probe TxDOT this session, see WHAT I COULD NOT DETERMINE. My recommendation is that TxDOT is not needed for L3a: OSM already carries state highways with `ref` tags, and TxDOT's value would be authoritative ROW width and functional classification, which is a **quality upgrade to the assumed-width table**, not an acquisition prerequisite. Treat it as a follow-on that would let the assumed-width table become measured for state-maintained roads.

Cost: zero dollars. 713 MB download, one-time, plus whatever the atom store costs to hold a few million road-nodes.

---

## 6. Federal uniform layers

### FEMA NFHL, a single statewide file exists, and this changes the plan

The layer inventory called FEMA "point-query-only, would need a batch-mode wrapper." That framing assumed no bulk product. **There is one.** Probed live:

```
$ curl -sS -o /dev/null -D - -r 0-0 "https://hazards.fema.gov/nfhlv2/output/State/NFHL_48_20260101.zip"
HTTP/1.1 206 Partial Content
Content-Type: application/x-zip-compressed
last-modified: Sat, 03 Jan 2026 10:17:57 GMT
content-range: bytes 0-0/1810100601
```

**1.81 GB, the entire state of Texas, one file, dated 2026-01-03.** Naming convention is `NFHL_{statefips}_{YYYYMMDD}.zip`, note `48_20250701.zip` and `48_20260101.zip` both 404, and the directory index returns 403, so the state-FIPS-only form is wrong and directory listing is blocked; the `NFHL_48_` prefix is required. County-level downloads do not exist (`48021C_20250701.zip` → 404).

The live point-query layer the adapter uses today is confirmed intact:

```
$ curl "https://hazards.fema.gov/arcgis/rest/services/public/NFHL/MapServer/28?f=json"
name: Flood Hazard Zones
type: Feature Layer
maxRecordCount: 2000
geomType: esriGeometryPolygon
```

**Effort to convert: LOW, and it is a replacement rather than a retrofit.** Download 1.81 GB, extract the file geodatabase, load the S_FLD_HAZ_AR polygon layer into a new table with the same tile-key bucketing pattern `txgio_parcel` uses (there is still no PostGIS, so the same 0.02-degree cell index applies, and `geo.ts` already exports `cellKeysForBbox` and `pointInGeometry` as reusable dependency-free helpers). The existing `fema-nfhl.ts` adapter stays exactly as it is for out-of-Texas and for freshness fallback; the new table serves Texas locally. Nothing about the current adapter needs to be reworked, because a local layer is a *different* thing sitting beside it, not a modification of it.

Cost: zero dollars. 1.81 GB one-time download; the polygon layer in Postgres is order-of 2 to 5 GB.

### USDA SSURGO, no clean bulk file was found; WFS is the working path

Texas SSURGO scope, from Soil Data Access:

```
$ curl -X POST "https://sdmdataaccess.sc.egov.usda.gov/Tabular/post.rest" \
    -H "Content-Type: application/json" \
    -d '{"query":"SELECT COUNT(*) AS n FROM legend WHERE areasymbol LIKE '\''TX%'\''","format":"JSON"}'
{"Table":[["232"]]}

$ ... '{"query":"SELECT COUNT(*) AS n FROM mapunit m JOIN legend l ON m.lkey=l.lkey WHERE l.areasymbol LIKE '\''TX%'\''"}'
{"Table":[["13187"]]}
```

**232 Texas soil survey areas, 13,187 distinct map units.** Note that 13,187 is map units, not polygons, the polygon count is far higher, since one map unit recurs across many polygons.

Bulk-download attempts all failed. Web Soil Survey cache URLs 400 on every naming variant tried; `nrcs.app.box.com` gSSURGO paths 301 then 404 or 403. I could not establish a working direct bulk URL for gSSURGO Texas this session. It very likely exists behind the Box UI or the Geospatial Data Gateway, but I did not find a machine-fetchable one and I will not assert a URL I did not probe successfully.

What **does** work is the SDA WFS spatial service, which the current adapter does not use at all:

```
$ curl "https://sdmdataaccess.sc.egov.usda.gov/Spatial/SDMWGS84Geographic.wfs?Service=WFS&Version=1.1.0&Request=GetFeature&Typename=MapunitPoly&BBOX=-97.40,30.05,-97.38,30.07"

bytes: 119864
40    (featureMember count)
<ms:musym>AfC2
<ms:mukey>393292
<ms:musym>CsC2
<ms:mukey>393283
```

**Real GML polygons with mukey and musym, 40 features in a 0.02 x 0.02-degree box, 120 KB.** That box is exactly one `txgio_parcel` tile cell, which makes the arithmetic easy: Texas spans roughly 13 degrees of longitude by 11 of latitude, about 358,000 such cells, of which perhaps 60 percent are land within the state boundary. At 40 features and 120 KB per cell that is order-of **8 to 9 million polygons and 25 GB of GML**, which is why bbox sizing and paging discipline matter, and why the bulk file is worth finding before committing to WFS tiling.

**Effort to convert: MEDIUM, and higher than FEMA.** The current `usda-ssurgo.ts` adapter is point-query-only against SDA's tabular endpoint plus a best-effort gSSURGO ArcGIS host that "resets TLS handshakes from Cloud Run (and most non-browser clients), the long-lived SSURGO ECONNRESET degradation." The bulk path is a different service (WFS, GML output) that no existing code touches. This is a **new adapter**, not a retrofit. Say it plainly: nothing in `usda-ssurgo.ts` is reusable for bulk acquisition except the domain knowledge encoded in its SQL.

Cost: zero dollars, but the largest polygon volume of the three federal layers and the least certain acquisition path.

### USGS 3DEP, covered in section 3

**Effort to convert: LOW-to-MEDIUM.** The acquisition is a clean TNM API enumeration (251 tiles, 64.3 GB, probed above) and the bake pipeline exists and has run. The rework is confined to `terrain_dem_acquire.py`'s source selection and the AOI preset mechanism. Highest byte volume of any layer here; lowest conceptual difficulty because the tooling is proven.

### Federal layers ranked by effort

| Rank | Layer | Effort | Why | Bulk source |
|---|---|---|---|---|
| 1 | **FEMA NFHL** | LOW | One 1.81 GB file, whole state, verified live. New table beside the existing adapter; adapter untouched. | `NFHL_48_20260101.zip` |
| 2 | **USGS 3DEP** | LOW-MED | Bake pipeline exists and has run. Rework is source selection in acquire. 64.3 GB, highest volume. | TNM API, 251 tiles |
| 3 | **USDA SSURGO** | MED | No working bulk URL found. WFS path works but is a wholly new adapter, ~8-9M polygons, ~25 GB GML. | SDA WFS (bulk file not located) |

---

## 7. Cost and volume summary

| Layer | Download | Store target | Store volume | Dollar cost | Compute |
|---|---|---|---|---|---|
| L2 parcels, 235 counties | **4.26 GB** (measured, 253/254 probed) | `txgio_parcel`, Neon | ~15-16.5M rows projected; **byte size unmeasured** | $0 data; **Neon storage is the real cost** | 235 zip extract + parse + batch insert |
| L3a roads statewide | **713 MB** (Geofabrik TX PBF, measured) | `road-node` atoms, hauska_mcp Neon | millions of atoms, up from 25,078 | $0 | osmium filter + export |
| L4a FEMA NFHL | **1.81 GB** (measured) | new table, Neon | ~2-5 GB est | $0 | gdb extract + load |
| L4b SSURGO | bulk file **not located**; WFS ~25 GB est | new table, Neon | ~8-9M polygons est | $0 | WFS tiling, thousands of requests |
| L4c 3DEP terrain-RGB | **64.3 GB** (measured, 251 tiles) | `gs://hauska-map-tiles` | 10-40 GB tiles (est) | **~$0.20-0.80/mo GCS + egress** | hours-to-days gdal2tiles |
| L5 PMTiles statewide | n/a (reads L2) | `gs://hauska-map-tiles` | ~2.4 GB (scaled from 936.6 MB measured) | **~$0.05/mo GCS + egress** | tippecanoe full-store re-read |

**Everything with a real dollar cost is GCS storage and egress, and it is under a dollar a month at rest.** No layer in this scope has a license fee, an API key, a quota purchase, or a vendor. That is the whole point of the jurisdiction-free set.

The costs that are actually load-bearing are not dollars:

- **Neon storage and write capacity for L2.** Roughly 2.9x the current parcel row count into one Postgres. This is unsized and should be checked before the run.
- **The heavy-scan slot**, which serializes exactly the work L2 wants parallel. Named as unresolved in the layer-first decision and still unresolved.
- **The sub-200-dollar-per-jurisdiction commitment.** L2 at 4.26 GB across 235 counties is, per county, a few megabytes of download and a bulk insert. This is the cheapest rail by a wide margin and comfortably inside the commitment. It is the twelve rails behind it that are unverified, and the county-shape ruling already says not to cite the sub-200 figure against the full rail set.

---

## WHAT MUST BE BUILT VS REUSED

### Reuse essentially unchanged

The **TxGIO ingest CLI** (`lib/cad-ingest/src/txgio/`), download, WGS84 assertion, shapefile stream, normalize, tile-bucket, batch upsert, delete-then-insert replace, `--dry-run`, `--limit`. Proven nineteen times. Needs one small change (below), not a rewrite.

The **PMTiles bake CLI** (`artifacts/api-server/src/parcelsPmtilesBakeCli.ts`), dual-table union, per-county `DISTINCT ON (feature_index)`, `parcel_node_id` stamping, content-hash naming, and the owner-name PII guardrail. Runs statewide as-is once L2 lands.

The **terrain-RGB bake** (`terrain_rgb_tiles_bake.py`), warp, rgbify, gdal2tiles, metadata sidecar. Proven; a published pyramid exists in the bucket. 3DEP's native meters make it simpler, not harder.

The **geometry helpers** (`geo.ts`), `cellKeysForBbox`, `cellKeyForPoint`, `bboxOfGeometry`, `pointInGeometry`. Dependency-free, PostGIS-free, and directly reusable as the spatial index for the new FEMA and SSURGO layer tables.

The **OSM parse and classify layer**, `parseOsmWayElement`, `classifyOsmHighwayTag`, `buildRowEdgesFromCenterline`. Generic given a width table.

The **FEMA and SSURGO point adapters**, unchanged, as the out-of-Texas and freshness-fallback path. A local bulk layer sits beside them; it does not replace them.

### Build new

**A county-general TxGIO resolver.** `TXGIO_COUNTIES` is a nineteen-entry hardcoded literal and `resolveTxgioCounty` fails closed on anything else. The URL builder `txgioDownloadUrl(fips)` is already general. Make the resolver accept any `48\d{3}`, synthesize the row, keep the nineteen named entries. **This is the single highest-leverage change in this document**, it is roughly ten lines and it unblocks 4.26 GB of already-published, already-uniform, already-parseable data.

**A wave runner for L2.** Something that walks a county list, invokes the ingest exit-bounded per county, records outcome per county (loaded / 404 / parse-fail), respects the heavy-scan slot, and is resumable. The per-county unit is idempotent, so the runner can be simple.

**A statewide OSM road pipeline.** Geofabrik PBF fetch, osmium filter to `w/highway`, and, the genuinely new part, **a way-to-county resolution step that does not exist today**, plus a decision on ways crossing county lines, plus a generalized descriptor that is derived from county FIPS rather than hand-authored per jurisdiction. This is the largest new-build in the scope.

**A FEMA NFHL bulk loader.** Fetch `NFHL_48_<date>.zip`, extract the gdb, load S_FLD_HAZ_AR into a new tile-bucketed table. Small and well-defined.

**An SSURGO bulk loader.** Either from a gSSURGO bulk file (URL not located, find it first) or via SDA WFS tiling. New adapter either way; the point-query adapter contributes nothing to it but domain knowledge.

**A 3DEP-sourced acquire.** Replace `terrain_dem_acquire.py`'s TNRIS collection walk with TNM-API tile enumeration for `polyCode=48` and VRT mosaicking. The AOI-preset mechanism with hand-authored `tile_name_patterns` does not survive contact with statewide and should be superseded rather than extended for this path.

**A data-driven land-use join gate.** The two-FIPS blocklist (Williamson, Hays) must become the scored coverage ledger for all 254 counties before the statewide PMTiles bake, or the bake will fabricate land use wherever CAD numbering diverges, the exact defect that gate was created to stop, at thirteen times the scale.

### Explicitly NOT reuse, said plainly

The **per-jurisdiction road descriptors**. Six hand-authored descriptor functions for two counties and one city. Extending that pattern to 254 counties is the per-jurisdiction ceremony layer-first exists to eliminate. The descriptor concept needs replacing, not multiplying.

The **AOI-preset terrain acquire**. Two Bastrop presets against a Central-Texas-only 2017 LiDAR collection. The README's "statewide extension: add a preset" is true for a bigger AOI in one collection and false for a real statewide bake.

The **`adapter_response_cache`** as a statewide layer store. It is a per-coordinate TTL cache with an `expires_at` column, currently zero rows. It is not a queryable layer table and should not be pressed into that role; FEMA and SSURGO each want a real table.

---

## WHAT I COULD NOT DETERMINE

**The on-disk size of `txgio_parcel` today.** I counted rows (5,535,897) but did not run `pg_total_relation_size`. Every byte projection for the statewide parcel store therefore rests on an assumed 1-2 KB per jsonb row, not a measurement. This is the weakest number in the document and it is the one that determines whether Neon sizing is a non-issue or a blocker. Run it before the bulk load.

**A working bulk-download URL for gSSURGO Texas.** Every naming variant I tried against Web Soil Survey 400'd and the NRCS Box paths 301'd to 404 or 403. The SDA WFS path is verified working and is a real fallback, but it is thousands of requests and roughly 25 GB of GML where a single geodatabase download probably exists. Someone should find it before committing to the WFS route.

**The actual polygon count of Texas SSURGO.** I have 232 survey areas and 13,187 map units, both measured. Polygons are a much larger number I estimated by extrapolating one 0.02-degree box (40 features), which is a single sample in one county and not a defensible basis for a statewide figure.

**Whether TxDOT publishes a single statewide roadway GIS layer.** I did not probe TxDOT at all this session. The layer inventory found zero adapter code and OPS-1 names it as a candidate; both prior claims about it remain unverified, and I am not adding a third.

**Statewide terrain-RGB output volume.** Scaled from a ~25.8 MB Bastrop AOI bake to a whole state by area. The 10-40 GB range is an order-of-magnitude estimate; PNG compression over low-relief terrain could put it well under, and z16 over urban relief could push it over.

**Neon write throughput for L2, and therefore how long it takes.** Per the no-timeframes rule I give no duration, but the shape of the constraint is unmeasured: I do not know how many counties can be ingested concurrently before the single Neon writer degrades, and that number determines the entire L2 execution plan. It is measurable cheaply, ingest two or three mid-size counties concurrently and watch, and it should be measured before the wave runner is designed.

**Whether the 235 absent counties' shapefiles all parse.** All 253 URLs return 206 with a plausible size, but a 206 proves the file is served, not that its `.prj` is GCS_WGS_1984 or that its DBF carries the expected 37 fields. The CLI hard-fails on a non-WGS84 `.prj`, which is the correct behavior, but it means schema drift in some rural county will surface as a run failure. **A `--dry-run` sweep across all 235 would settle this with zero write risk and should be the first thing executed.**

**Whether the OSM road atom volume fits the atom store.** Going from 25,078 road-node atoms to millions is a three-orders-of-magnitude jump into `hauska_mcp`. I did not size that store.

**The N4/N5 identity classes at statewide scale.** The fabric analysis established these across 19 counties. Rural counties have different CAD conventions than metros, and whether sentinel prop_ids and account-stacking are worse, better, or differently shaped in the other 235 is unknown until they land.
