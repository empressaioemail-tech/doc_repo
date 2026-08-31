---
title: RRC statewide source inventory (wells and pipelines)
type: probe
status: active
last_updated: 2026-08-11
owner: planner
related: _inbox/2026-08-11_RRCPROBE_statewide_source_inventory.json
---

# RRC statewide source inventory

Read-only probe run 2026-08-11 to establish what Texas Railroad Commission oil and gas data can actually be pulled statewide, before anyone writes an adapter for the `rrc-wells` and `rrc-pipelines` manifest rails. No edits, no commits, no ingest. Machine-checkable companion at `_inbox/2026-08-11_RRCPROBE_statewide_source_inventory.json`.

RRC here means the Texas Railroad Commission, the oil and gas regulator. It has nothing to do with railroads. Actual rail infrastructure is the separate `rail-corridor` rail on NTAD NARN and was out of scope.

## Headline

A correct statewide source exists, it is first-party, free, and unauthenticated. The defect that triggered this probe is confirmed and is worse than a coverage gap: it is a source that would have written mass falsehood.

The currently wired source holds 12,796 wells. Texas has 1,396,049. The mirror is 0.92 percent of the state.

## The defect, re-verified at source

The wired layer is `https://www.gis.hctx.net/arcgishcpid/rest/services/TXRRC/Wells/MapServer/0`, a Harris County mirror. Verbatim probe output:

```
returnCountOnly       => {"count":12796}
returnExtentOnly&4326 => {"extent":{"xmin":-95.940204786627049,"ymin":29.506313786938289,
                          "xmax":-94.899877704536664,"ymax":30.173984022480145,...}}
Permian envelope      => {"count":0}
Houston control       => {"count":156}
```

The extent is a single county box. A Permian Basin query returns zero wells; the identical query against the RRC source returns 568. The engine's own docstring at `packages/engine-core/src/well-fact/fetch-wells.ts:2` already says "Harris County mirror layer", so this was documented, not hidden.

The consequence is the important part. The well-fact writer emits a typed absence atom for any parcel with no well found. Run statewide against this source, it would emit machine-verified "no well on or near this property" absence atoms across the Permian, the Panhandle, East Texas and the Eagle Ford, into counties that demonstrably have hundreds of thousands of wells. That is not a coverage shortfall to be improved later. It is confident, cited, wrong output at scale, and it would be indistinguishable from a genuine absence to any downstream consumer. The rail must not run statewide until the source is swapped.

## The correct source

The RRC publishes its own ArcGIS service. The path is not obvious: `gis.rrc.texas.gov/arcgis/...` 404s, and the documented redirect target also 404s. The live root is `gis.rrc.texas.gov/server/rest/services`, which exposes an `rrc_public` folder containing `RRC_Public_Viewer_Srvs` — the service backing the RRC's own public GIS viewer. The `Hosted` folder returns `{"error":{"code":499,"message":"Token Required"}}` and is not usable, but nothing needed sits behind it.

Three layers matter.

**Layer 1, Well Locations.** 1,396,049 point features. Extent spans -106.93 to -93.15 longitude and 25.73 to 36.51 latitude, which is the full state including the Trans-Pecos and the Panhandle.

**Layer 13, Pipelines.** 492,021 line features, same statewide extent. This is the RRC T-4 permit alignment layer, not PHMSA NPMS, so the NPMS security restriction on precise alignment does not apply and the earlier ruling that NPMS is not needed for v1 holds.

**Layer 2, Orphan Wells.** 11,937 points, statewide extent, but only three fields: OBJECTID, API, SHAPE. It is a join key onto layer 1, not a standalone record, and it is the RRC's own orphan determination.

Ignore layer 12, QPipelines. It returns a byte-identical count and extent to layer 13 because it is the generalised small-scale draw of the same data. Treating them as two sources would double-count.

## Statewide proof

An extent is only a bounding box and can be inflated by a few outliers, so coverage was tested by probing a cell in each corner of the state. Both rails return features everywhere.

| Cell | Wells | Pipelines |
|---|---|---|
| Panhandle (-101.8, 35.2) | 10 | 55 |
| East TX (-94.8, 32.3) | 222 | 449 |
| West TX Permian (-102.4, 31.8) | 568 | 199 |
| South TX Eagle Ford (-98.5, 27.8) | 215 | 36 |
| Dallas control (-96.9, 32.7) | 2 | n/a |

The distribution also pattern-matches Texas geology, which a partial or synthetic layer would not reproduce: the Permian cell is densest, the Panhandle sparse, East Texas gas-heavy. Bastrop County's bounding box returns 4,584 wells.

## What the new source adds beyond coverage

This is not a re-point of the same shape. The RRC layer carries fields the mirror does not, and two of them change what the atom can honestly claim.

The mirror carries `SYMNUM, API, RELIAB, Shape, OBJECTID, SURFACE_ID, LONG27, LAT27, LONG83, LAT83, WELLID`. The RRC layer carries `UNIQID, API, GIS_API5, GIS_WELL_NUMBER, SYMNUM, GIS_SYMBOL_DESCRIPTION, RELIAB, GIS_LOCATION_SOURCE, GIS_LAT27, GIS_LONG27, GIS_LAT83, GIS_LONG83`.

`GIS_SYMBOL_DESCRIPTION` is the authoritative status as text, 54 distinct values statewide. `GIS_LOCATION_SOURCE` is positional provenance, with observed values "Operator reported location - Distances and Plat" and "Commission`s hardcopy map" — note the literal backtick, it is in the source data.

That second field matters for the confidence commitment. Paired with `RELIAB` (observed values 15 and 40), it distinguishes a well positioned from an operator plat from one digitised off a paper map. A 152 metre adjacency claim resting on a hardcopy-derived point is materially weaker than the same claim on a plat-derived point, and the atom should say so rather than presenting one uniform number.

Field renames the adapter must handle: `SURFACE_ID` becomes `UNIQID`, `WELLID` becomes `GIS_WELL_NUMBER`, and `LONG83`/`LAT83` become `GIS_LONG83`/`GIS_LAT83`. `parseWellFeature` in `fetch-wells.ts` reads the old names and will silently produce nulls against the new source if not remapped.

## Statewide attribute distribution

Verified by individual where-clause counts, not by an aggregate.

| Well status | Count |
|---|---|
| Plugged Oil Well | 331,856 |
| Oil Well | 316,298 |
| Dry Hole | 295,010 |
| Gas Well | 126,429 |
| Plugged Gas Well | 68,160 |
| any Plugged* | 423,477 |
| any *Injection* | 41,975 |

Pipelines: 432,533 of 492,021 are STATUS "In Service"; 417,922 carry COMMODITY "NATURAL GAS". Travis County has 510 segments, Bastrop 885.

## Atom shape

The R1 split rule holds as already manifested. Wells and pipelines are different source layers with different geometry types, so they split into two rails. Producing versus plugged is an attribute of the same layer-1 point feature, so it subcategorises inside the cell as an atom body field and does not split.

No contract change is needed. `buildPresentWellFactAtom` already takes `wellStatus`, `wellType`, `orphaned`, `surfaceLocation`, `parcelRelation`, `proximityRadiusMeters` and `proximityDistanceMeters`. Only the fetch and the field mapping change.

Two upgrades the new source unlocks. First, `symnum.ts` should prefer `GIS_SYMBOL_DESCRIPTION` text over its hand-maintained SYMNUM set-membership tables, keeping SYMNUM as fallback. Its docstring asserts "Public GIS carries SYMNUM only — not operator or regulatory status text", which is true of the mirror and false of the RRC source; leaving that line in place will cause the next agent to re-derive the same limitation. Second, orphan status should come from joining layer 2 on API rather than being inferred from SYMNUM.

The default-to-producing behaviour is a real correctness problem at scale. `mapSymnumToWellStatus` returns "producing" for any unmatched SYMNUM, and statewide there are 54 status values including "Canceled / Abandoned Location", "Core Test", "Water Supply Well", "Service" and "Shut-In Oil". Survivable across 12,796 Harris wells; a large volume of false producing claims across 1,396,049.

For pipelines, subcategorise on COMMODITY, SYSTEM_TYPE, STATUS, DIAMETER, INTERSTATE, and operator identity via OPERATOR plus P5_NUM. T4PERMIT is the natural citation key. Two data-hygiene notes: one physical pipeline appears as many rows (three sampled East Texas segments shared T4PERMIT 10680 and P5_NUM 253368, differing only by county), so dedupe on T4PERMIT plus P5_NUM at claim composition or the same pipeline crossing one parcel emits duplicate-looking claims. And operator strings are dirty — "ENTERPRISE PRODUCTS OPERATINGLLC" is missing a space — so key identity on P5_NUM, never the name. SYSTEM_TYPE values carry trailing whitespace padding.

Buffer discrepancy to resolve: the dispatch names 152.4 m / 500 ft, but `WELL_FACT_PROXIMITY_RADIUS_METERS` in `plan-county-well-facts.ts` is the integer 152, which is 498.69 ft. Either the constant becomes 152.4 or the docs stop saying 500 ft. The whole point of a named buffer is that the adjacency claim is auditable, and an auditable claim should not be off by a foot between doc and code. Flagged, not changed.

## Staging

Persist. Do not live-fetch per writer run.

The service caps every page at 1,000 records — a `resultRecordCount=2000` request returned exactly 1,000 with `exceededTransferLimit=true`. A full statewide pull is 1,397 sequential pages for wells and 493 for pipelines. Measured payloads with geometry are 452 bytes per well and 2.52 KB per pipeline segment, so a full pull moves roughly 0.63 GB of wells and 1.24 GB of pipelines. Re-streaming that on every county writer run is precisely the building-footprint anti-pattern that re-streams 394 MB per county and makes that rail unusable.

One statewide backfill into Postgres costs roughly 0.49 GB for 1,396,049 well rows and 1.23 GB for 492,021 pipeline rows, about 1.7 GB before indexes. Budget 2.5 GB with a GiST spatial index on each.

Proposed tables `tx_rrc_well` and `tx_rrc_pipeline`, following the `tx_special_district` convention that the special-district rail already stages successfully. Two tables rather than one because the R1 split rule already separates them by geometry type. Pipelines partition by county for free — COUNTY_FIPS and COUNTY_NAME are already denormalised onto every segment. Wells have no county column and need a point-in-county spatial join, done once at backfill rather than per run. Use `f=geojson` (verified supported) with `orderByFields=OBJECTID` for stable paging; a probe at `resultOffset=500000` confirmed deep paging works.

## Blockers and cautions

The high-severity item is the one above: do not run the rail statewide on the current source.

No free bulk shapefile exists. Three plausible archive paths all 404, and the official data-sets page links only tabular well-record products and PDF manuals. The RRC FAQ frames shapefiles as a purchased product, in-person preview in Austin, "before I buy". The REST service supersedes it, but this means backfill is 1,890 paginated requests needing retry and resume logic rather than one archive fetch.

Vintage is UNKNOWN and the service does not expose it. No `editingInfo`, no `lastEditDate`, empty `copyrightText` on both service and layers. The FAQ says only that data is "continually updated and refined". Atoms must carry `observedAt` from the fetch timestamp and must not assert a source vintage.

The RRC's own disclaimer should not be laundered into an unqualified confidence number: "The data is intended solely for the internal use of the Railroad Commission, which makes no claim as to its accuracy or completeness." Combined with RELIAB values as low as 15 and hardcopy-map-derived positions, a well location can be materially imprecise.

Commercial redistribution is marked UNKNOWN, not cleared. The data is public record, unauthenticated, and I found no ToS gate on the REST path, but that "internal use of the Railroad Commission" phrasing is unusual enough that someone should read it properly before this data is resold at Layer 2.

## Alternatives rejected

TxGIO does not hold RRC oil and gas layers at all. Its service list is transportation-domain (land parcels, bicycle inventory, alternative fuel corridors, TA awarded projects). The TxGIO hypothesis is disconfirmed.

Every third-party ArcGIS Online mirror found is the same defect class as the bug being fixed: "New Fairview RRC Wells and Pipelines" is one city, "RRC_Wells_Coastal" is the coastal zone by its own name, Denton County GIS is one county. None probed further, none recommended — recommending any would repeat the Harris mistake with a different bounding box.

## Scale reality check

At 1,396,049 wells against roughly 9 million Texas parcels, the well-fact rail will emit an absence atom for the large majority of parcels even with a correct source, because most Texas parcels genuinely have no well within 152 metres. That is the honest answer. But it means the rail's value concentrates in the Permian, East Texas and the Eagle Ford, and a statewide completion percentage will read as near-total absence by design. That should not be misread as a coverage failure the way the zoning-stamp percentage once was.
