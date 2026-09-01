---
id: 2026-07-18_map10x_wave-d4_parcel_pmtiles_serving_artifact
title: Map 10x Wave D4 — parcel PMTiles GCS serving + spine URL artifact (BLOCKED on owner-name scrub)
status: blocked
last_updated: 2026-07-18
applies_to: [legacy-design-tools, cortex-tiles, brief-extension, digital-design-center]
owner: planner
related: [2026-07-15_parcel_mesh_ifc_tile_spec, 55_spine_data_intelligence_stack, 08_tiered_access_model]
---

> STATUS: serving infrastructure is BUILT, CONFIGURED, and PROVEN. The 554MB
> artifact is NOT published because it leaks ~2.5M CAD owner names into a
> public-read, CORS-open, cache-forever file. Do NOT upload the current
> `parcels.c7c0101ecf17.pmtiles` to the public bucket. Ship a clean re-bake
> (owner property dropped) first; the URL below is reserved for that clean
> hash.

# Wave D4 — parcel PMTiles serving artifact

## The spine URL (RESERVED — points at the clean re-bake, not the tainted D3 hash)

Bucket: `gs://hauska-map-tiles` (project `legacy-design-tools-prod`, US-CENTRAL1).

Raw HTTPS form:
`https://storage.googleapis.com/hauska-map-tiles/parcels.<sha256-12>.pmtiles`

MapLibre pmtiles:// form (the parcelTiles source value F3 wires):
`pmtiles://https://storage.googleapis.com/hauska-map-tiles/parcels.<sha256-12>.pmtiles`

The `<sha256-12>` is the content hash the bake stamps on the file. The D3 bake
produced `c7c0101ecf17`, but that archive is owner-name-tainted and must not go
public, so consumers must NOT hardcode `c7c0101ecf17`. Wire the URL from config,
and set the hash to whatever the clean re-bake emits. Source layer is `parcels`,
feature property `parcel_node_id`, promoteId keyed on it, z0-z16.

## Why the D3 archive is blocked

`artifacts/api-server/src/parcelsPmtilesBakeCli.ts` line 332:
`if (row.owner_name) properties.owner = row.owner_name;`

stamps the full CAD owner name on every feature. Verified in the D3 export
`parcels.geojsonseq`: 99,223 of the first 100,000 features carry a real owner
name (e.g. "JOHNSON, VERNON", "NUNEZ RIVERA, PEDRO & ABIGAHIL SALINAS
HERNANDEZ"). Publishing this as a bulk-downloadable, CORS-`*`, immutable public
file ships ~2.5M owner names as a single flat asset. That violates the
no-owner-private-data-in-public-tiles guardrail and the tenant/owner-private
posture. Situs address, apn, county_fips, landUseCode, landUseDescription,
parcel_node_id are public-record and fine.

## The fix (one line in legacy-design-tools, branch feat/pmtiles-bake)

Drop the `owner` property from the baked tile, then re-bake. Either delete
line 332 outright, or gate it behind a non-public output mode. After re-bake,
the file gets a NEW content hash; upload that hash to the bucket and set it in
consumer config. Owner name for a clicked parcel should come from a live gated
lookup (the cad:* brief adapters already do this), never the static public tile.

## What is DONE and verified (serving layer)

Bucket `gs://hauska-map-tiles` created, uniform bucket-level access, public
access prevention inherited (public allowed).

Public read: `allUsers` -> `roles/storage.objectViewer` bound on the bucket.
Anonymous GET verified against a selftest object (since removed).

CORS (verified live): origin `*`, methods GET/HEAD, responseHeader exposes
Content-Type, Range, If-Range, Content-Range, Accept-Ranges, Content-Length,
ETag, Cache-Control. A cross-origin range GET returned
`Access-Control-Allow-Origin: *` plus `Access-Control-Expose-Headers` including
Content-Range and Accept-Ranges.

Range serving (verified live): `curl -r 0-1000` returned `206 Partial Content`,
`Accept-Ranges: bytes`, `Content-Range: bytes 0-1000/8200`. MapLibre pmtiles://
byte-range reads will work.

Cache-Control: uploads must set `public, max-age=31536000, immutable` (verified
present on the selftest object). Safe forever because the filename is
content-hashed.

## Operator upload command (run after the clean re-bake)

```
gcloud storage cp ./<clean-rebake>/parcels.<newhash>.pmtiles \
  gs://hauska-map-tiles/parcels.<newhash>.pmtiles \
  --cache-control="public, max-age=31536000, immutable" \
  --content-type="application/octet-stream" \
  --project=legacy-design-tools-prod
```

Then verify (Windows curl needs --ssl-no-revoke behind the corp proxy):
```
curl -sS --ssl-no-revoke -D - -o /dev/null -r 0-1000 \
  "https://storage.googleapis.com/hauska-map-tiles/parcels.<newhash>.pmtiles"
# expect: 206 Partial Content, Accept-Ranges: bytes, Content-Range present
```

## Cloud CDN (follow-up, not required for v1)

The raw `storage.googleapis.com` URL serves range requests and CORS correctly
today; MapLibre reads it directly. A Cloud CDN + external HTTPS LB in front of
the bucket (backend-bucket with `--enable-cdn`) buys edge caching and a custom
domain (e.g. tiles.hauska.dev) but is not required to unblock F3. Deferred.
Note: keep the immutable Cache-Control so CDN caches the content-hashed object
indefinitely; a re-bake is a new URL so no invalidation is ever needed.
