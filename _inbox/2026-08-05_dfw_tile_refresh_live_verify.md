---
title: DFW parcel tile refresh — live verification closeout
date: 2026-08-05
deployment: dpl_GPY7mk8bw7vsZtwJvdKaSSjoPQmH
---

# DFW parcel tile refresh — ACCEPTED

## Artifact hashes

| | Hash | GCS path | Size |
|---|------|----------|------|
| **OLD (rollback)** | `4af31e1901e2` | `gs://hauska-map-tiles/parcels.4af31e1901e2.pmtiles` | retained |
| **NEW (live)** | `3431529a2e8d` | `gs://hauska-map-tiles/parcels.3431529a2e8d.pmtiles` | 936,565,640 bytes (893.2 MB baked) |

## Prod txgio_parcel distinct counts (before bake)

| FIPS | County | distinct parcels |
|------|--------|------------------|
| 48113 | Dallas | 694,160 |
| 48439 | Tarrant | 757,161 |
| 48085 | Collin | 387,737 |
| 48121 | Denton | 353,631 |
| 48251 | Johnson | 101,847 |
| 48367 | Parker | 100,548 |
| 48139 | Ellis | 98,803 |
| 48257 | Kaufman | 94,650 |
| 48397 | Rockwall | 52,739 |

Staging→prod promotion: **not required** (DFW counties already in prod; staging holds only 48021 duplicate).

## Bake summary

- Features exported: **5,151,394** (19 counties)
- GeoJSONSeq: 4401.6 MB
- tippecanoe: default flags unchanged (`--drop-densest-as-needed --coalesce-densest-as-needed --simplification 10 --extend-zooms-if-still-dropping`)
- Duration: **4728.1s (~79 min)**
- Log: `_inbox/2026-08-05_dfw_tile_refresh_bake.log`

## hauska-map

- PR [#151](https://github.com/empressaioemail-tech/hauska-map/pull/151) merged @ `4b7dce5` (CI success)
- Deploy: `dpl_GPY7mk8bw7vsZtwJvdKaSSjoPQmH` → **https://property-explorer-xi.vercel.app**
- Bundle: `index-BYRaQqKa.js`

## Live verification (planner-run)

### Bundle hash marker

```
curl property-explorer-xi.vercel.app/assets/index-BYRaQqKa.js | grep hash
→ 3431529a2e8d present
→ 4af31e1901e2 absent
```

### GCS range serving (new artifact)

```
HTTP/1.1 206 Partial Content
Content-Range: bytes 0-1000/936565640
Accept-Ranges: bytes
Cache-Control: public, max-age=31536000, immutable
```

### Dallas-area PMTiles tile probe (z14, PMTiles getZxy byteLength)

| Location | NEW 3431529a2e8d | OLD 4af31e1901e2 |
|----------|------------------|------------------|
| Dallas downtown (32.7767, -96.7970) z14/3786/6611 | **163,517 bytes** | 0 |
| Fort Worth (32.7555, -97.3308) z14/3762/6612 | **199,163 bytes** | 0 |
| Plano/Collin (33.0198, -96.6989) z14/3791/6598 | **180,843 bytes** | 0 |
| Bastrop control (30.1102, -97.3200) z14/3762/6753 | 155,918 bytes | 155,918 bytes |

PMTiles metadata confirms DFW county_fips in vector layer stats: 48113, 48439, 48085, 48121, 48251, 48367, 48139, 48257, 48397.

Bounds: `-98.810010,29.114370,-96.070962,33.430568` (includes full DFW metro).

## Acceptance checklist

- [x] Nine DFW fips in prod txgio_parcel with counts matching load logs
- [x] New PMTiles in bucket under new hash; old hash retained
- [x] hauska-map merged green + CLI-deployed
- [x] Live bundle carries new hash
- [x] Dallas-area tile demonstrably serves parcels (non-zero MVT bytes; old artifact zero at same z/x/y)
- [x] Evidence filed
