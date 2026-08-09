---
title: "Bell 48027 boundary forensics — StratMap source vs store"
date: 2026-08-08
status: analysis
repo: doc_repo
author: data-forensics (read-only)
related: [_inbox/2026-08-08_GRADE_nineteen_county_audit.md, _inbox/2026-08-08_SWEEP_county_source_matrix.json]
---

# Bell 48027 boundary forensics

## RULING

**Upstream CAD-jurisdiction reality. Serve as-is. Record the Census-vs-CAD divergence. Not a projection defect. Not an ingest geometry defect for the 694. Not "genuinely bad" source coordinates.**

StratMap's `48027` archive itself places 694 parcels fully north of the Census Bell northern line (max north edge 31.406333, matching the store to six decimals). Every one of those features is stamped `SOURCE=BELL APPRAISAL DISTRICT`, `FIPS=48027`, `COUNTY=BELL`. McLennan's own StratMap archive does not contain the same geometries. The overflow is scattered 5 ft to 5.9 mi past the line across an 11.8-mile east-west strip, which kills a uniform projection-shift hypothesis. Live Census PIP puts most of the set in McLennan and a material minority in Coryell.

Trust this measurement over the audit's blanket "694 inside McLennan": a random-80 Census PIP sample measured **60 McLennan / 20 Coryell**.

---

## 1. Source fetch

URL from `_inbox/2026-08-08_SWEEP_county_source_matrix.json`:

`https://data.geographic.texas.gov/0fa04328-872e-481c-b453-126a74777593/resources/stratmap25-landparcels_48027_lp.zip`

```
curl.exe -L --fail -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36" -o .../stratmap25-landparcels_48027_lp.zip <url>

Length: 73890164
```

Byte count matches the sweep matrix exactly (`bytes: 73890164`). McLennan companion archive also fetched for dual-assessment test: `stratmap25-landparcels_48309_lp.zip`, Length `59717405` (matrix match).

Both downloads deleted after analysis (temp dir removed).

---

## 2. Do the SOURCE features lie outside Bell?

Yes. Measured on the shapefile, not the store.

Census Bell non-generalized extent (from prior audit / TIGERweb, reused):

`W=-97.9138 E=-97.0701 S=30.7524 N=31.3202`

```
SHP_HEADER bbox = (-97.921856, 30.737125, -97.063259, 31.406333)
BELL_SOURCE_FEATURE_COUNT_NONEMPTY 167441
BELL_SOURCE_D_NORTH_VS_CENSUS 0.086133
BELL_SOURCE_FULLY_NORTH_OF_LINE 694
BELL_SOURCE_FULLY_OUTSIDE_CENSUS_BBOX 740
BELL_SOURCE_FIPS_DIST {'48027': 167441}
BELL_SOURCE_SOURCE_DIST {'BELL APPRAISAL DISTRICT': 167441}
```

North overflow distance (feet, using 364000 ft/deg lat):

```
MAX_OVERFLOW_BY_NORTH_EDGE_FT 31352.6   # matches audit 31,353
MAX_OVERFLOW_BY_SOUTH_EDGE_FT 30560.6
OVERFLOW_FT_MIN 5.1
OVERFLOW_FT_MEDIAN 6187.1
OVERFLOW_FT_MEAN 8649.7
OVERFLOW_FT_STD 7545.6
OVERFLOW_BUCKETS {'0-1kft': 90, '1kft-1mi': 218, '1-3mi': 257, '3-6mi': 129}
OVERFLOW_LON_SPAN_MI 11.81
OVERFLOW_LAT_SPAN_MI 5.84
```

Other Census edges (boundary-precision noise, not miles of displacement):

```
FULLY_WEST_OF_CENSUS 22  max_ft ~1164
FULLY_EAST_OF_CENSUS 1   max_ft ~171
FULLY_SOUTH_OF_CENSUS 23 max_ft ~3066
```

Metadata purpose text on the shapefile XML is explicit CAD acquisition:

> This dataset was acquired from the County Appraisal District (CAD) or their vendor by BIS Consultants and delivered to TxGIO for distribution in the TxGIO DataHub as part of the annually updated statewide land parcel program.

Native extent in that same XML: `northBL=31.406333` — identical to the shapefile and the store.

---

## 3. `.prj` and the projection hypothesis — REJECTED

Bell `.prj` (verbatim):

```
GEOGCS["GCS_WGS_1984",DATUM["D_WGS_1984",SPHEROID["WGS_1984",6378137.0,298.257223563]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]]
```

McLennan `.prj` is byte-identical WGS84 geographic. Shapefile XML confirms `WKID/EPSG 4326` and a documented `Project` from `NAD_1983_StatePlane_Texas_Central_FIPS_4203_Feet` into GCS_WGS_1984 with transformation `WGS_1984_(ITRF00)_To_NAD_1983` — a legitimate CAD StatePlane → WGS84 pipeline, not a degrees-misread-as-feet disaster.

**Discriminator measured, not assumed:**

| Signal | Projection-shift expectation | Measured |
|---|---|---|
| Overflow magnitude | near-uniform | min 5 ft, max 31,353 ft, std 7,546 ft |
| Direction | one dominant vector | north-only overhang of miles; W/E/S overhangs are hundreds to ~3k ft |
| Spatial cluster | rigid translate of whole county | E-W span 11.8 mi, N-S span 5.8 mi along the line |
| Coordinates scale | Mercator / StatePlane leftovers | all values in degree bounds; vintage is 202503 degree-vintage |

Ruling on projection: **clear**. The displacement is jurisdictional scatter, not a systematic CRS error.

---

## 4. CAD-jurisdiction hypothesis — CONFIRMED

### 4.1 Clustering

694 features sit in a band immediately north of Bell's Census line, from roughly `cx=-97.488` to `-97.288`, `cy=31.3205` to `31.4052`. Not randomly deep across all of McLennan — a corridor along the Bell/McLennan(/Coryell) seam, with a long tail reaching 5.9 miles north.

### 4.2 Situs

Almost no useful situs on the overflow set:

```
OVERFLOW_CITY_TOP [('', 693), ('SALADO', 1)]
OVERFLOW_REAL_SITUS_ADDR_COUNT 1
OVERFLOW_REAL_SITUS_ADDR_ALL [('529299', '1907  SLADE DR, SALADO, TX 76571', 'SALADO', 31.3942, 27787.4)]
OVERFLOW_PROP_CLASS {'usable': 580, 'sentinel': 114}
```

The one real address is Bell-facing (Salado 76571). Census PIP on that centroid: McLennan. The blank situs majority is CAD attribute sparsity, not evidence against CAD packaging — `SOURCE`/`FIPS`/`COUNTY` are filled on all 694.

### 4.3 McLennan StratMap overlap — none for these parcels

```
MCL_FIPS_DIST {'48309': 115362}
MCL_SOURCE_DIST {'MCLENNAN APPRAISAL DISTRICT': 115362}
MCL_SAME_PROP_ID_AS_BELL_OVERFLOW 117
MCL_MATCH_SAME_BBOX5 0
DIFFERENT_BBOX 117
MCL_SAME_ROUNDED_CENTROID_AS_BELL_OVERFLOW 0
```

117 shared `Prop_ID` values are account-number collisions across two CADs (sample McLennan matches are Eddy/Bruceville/Waco/Axtell parcels with different bboxes). **Zero geometric identity.** Not dual-assessment of the same polygon, and not a StratMap file-split bug that duplicated rows into both zips.

### 4.4 Census county of the overflow (revision to the audit)

Stratified + random live TIGERweb PIP:

```
PIP_COUNTY_COUNTS (stratified 29): {'McLennan County': 24, 'Coryell County': 5}
PIP_RANDOM80: {'McLennan County': 60, 'Coryell County': 20}
```

Extrapolated from the random-80: ~75% McLennan (~521), ~25% Coryell (~173). The audit's "694 inside McLennan" is directionally right about "not Bell Census" but overstated McLennan membership. West-of-`-97.43` centroids (141 of 694) align with the Coryell hits.

Sample:

```
max_n  (-97.3824, 31.4052) -> McLennan
west   (-97.4884, 31.3388) -> Coryell
salado (-97.3781, 31.3942) -> McLennan
```

---

## 5. Store vs source — ingest fidelity for the 694

```
DB_BELL_OVERFLOW {
  bell_features_total: 167412,
  fully_north_of_census_line: 694,
  fully_outside_census_bbox: 740,
  county_max_north: 31.406333,
  overflow_max_north: 31.406333,
  max_overflow_deg: 0.086133
}
DB_EDGE_OUTSIDE {fully_west: 22, fully_east: 1, fully_south: 23, fully_north: 694}
BBOX_KEY_MATCH (overflow prop+bbox5) 692 SRC / 692 DB / 692 in both
SRC_KEY_ONLY_N 0  DB_KEY_ONLY_N 0
DB_AT_163570 prop=0 n=31.406333 s=31.404158
SRC_AT_163570 prop=0 n=31.406333 s=31.404158
PROPS_IN_BOTH 581 (all overflow unique props)
```

Overflow set is a **byte-faithful copy of the source**. The loader did not invent these coordinates or mis-assign a McLennan tile into Bell FIPS.

County-wide feature count differs slightly: source `167441` vs store `167412` (Δ 29). Feature index range in store is `0..167440`, so 29 source indices are absent as store features. That is a separate, small completeness gap; **it does not explain the 694**, which match 1:1.

---

## 6. Warming consequence

| Parcel set | Block warm? | Why |
|---|---|---|
| Bell features with `south_lat <= 31.3202` (~166,718) | **No** — not blocked by this finding | Geometry is inside Census Bell; CAD=Census agree |
| 694 fully north of Census Bell line | **Do not depth-warm as Bell Census geography**; exclude or tag before ring compute | Contested Census county (McLennan/Coryell). Atom key `48027:{prop_id}` would claim wrong geographic county |
| Already-written atoms on the 694 | Already present; all declines | See below |

Atoms (usable overflow props only = 580):

```
ATOMS_BELL_ENVELOPES 104404
ATOMS_ENVELOPES_ON_OVERFLOW 580
ATOMS_ZONING_ON_OVERFLOW 580
ATOMS_OVERFLOW_ENV_SPLIT {declined: 580, positive_or_placeholder: 0}
```

All 580 usable overflow props already carry zoning-facts and **declined** buildable-envelope atoms. None serve a positive envelope. The operational risk is not "104,404 stale rings on wrong-county parcels" — it is (a) zoning-facts keyed under Bell for land Census puts in McLennan/Coryell, and (b) any future warm that would compute rings for those 694 without an exclusion.

**Practical warming policy this supports:** warm Bell with an exclusion `south_lat > 31.3202` (or equivalent boundary PIP), serve the remaining county, and record the 694 (plus the 46 non-north fully-outside bbox features if desired) as CAD-overhang with known Census disagreement. Do not treat the overhang as corrupt geometry requiring purge before in-county warm.

---

## 7. Ruled alternatives, one line each

| Hypothesis | Verdict |
|---|---|
| Upstream CAD / StratMap packaging by appraisal district | **RULED IN** |
| Projection / `.prj` defect | **RULED OUT** (WGS84 degrees; scattered overflow; proper StatePlane→WGS84 lineage) |
| Ingest defect inventing/misfiling the 694 | **RULED OUT** (source==store for the set) |
| Genuinely bad source coordinates (random garbage) | **RULED OUT** (coherent seam corridor; CAD-tagged; provenance documented) |
| Dual-assessment overlap with McLennan StratMap | **RULED OUT** (0 shared geometries) |

---

## WHAT I COULD NOT DETERMINE

Whether Bell Appraisal District has a legal or administrative claim that those parcels are taxable in Bell (true CAD jurisdiction) versus a CAD GIS export error that StratMap republished unchanged. The packaging and SOURCE stamp prove CAD origin; they do not prove tax-roll correctness. Resolving that needs Bell CAD / appraisal inquiry, not more spatial forensics.

The exact Census-county partition of all 694. Random-80 gives ~75/25 McLennan/Coryell; a full 694 PIP pass would pin the count. Not done (rate limits / time); the ruling does not depend on the exact split.

Why the store is missing 29 of 167441 source features. Out of scope for the 694; would need a full feature_index diff of the ingest drop.

Why the overflow parcels already have declined envelopes (which warm/decline path wrote them, and which decline codes). Query confirmed decline presence only.

Whether Coryell's StratMap archive contains geometric matches to the west-side overflow subset. Only McLennan was dual-fetched as the brief required.
