# StratMap YEAR_BUILT / GIS_AREA sample (Caldwell 48055)

**Verdict: P-78 YEAR_BUILT wiring is real.** GIS_AREA_U must be read before writing `land_acres`.

This is one county, vintage 202503. Other StratMap counties are unmeasured.

## Snapshot

- County: Caldwell, FIPS 48055
- Zip: `stratmap25-landparcels_48055_lp.zip` (11,963,211 bytes)
- Vintage in the shapefile name: 202503
- DBF: `stratmap25-landparcels_48055_caldwell_202503.dbf` (56,077,538 bytes)
- Download URL: `https://data.geographic.texas.gov/0fa04328-872e-481c-b453-126a74777593/resources/stratmap25-landparcels_48055_lp.zip`
- Collection id: `0fa04328-872e-481c-b453-126a74777593` (OPS-1; same UUID as the f4 Nueces scratch)
- Local path: `P:/tmp/stratmap-year-built-sample/`
- Measured at: 2026-08-25T02:00:53.033Z
- No StratMap county zip was already on disk at tmp root, inbox, or scratch. This zip was downloaded this session with a browser User-Agent. No Neon writes. No `--apply`.

Field names match `lib/cad-ingest/src/txgio/parse.ts` (header comment) and `landuse.ts`. `landuse.ts` today hard-nulls `yearBuilt`, `landAcres`, and `livingAreaSqft`.

## Totals

26,155 features. Header record count and streamed DBF rows agree.

## YEAR_BUILT

Header type is `C(60)`, not numeric.

| shape | count | pct |
| --- | ---: | ---: |
| blank / null | 8992 | 34.38 |
| comma-joined YYYY list | 8929 | 34.14 |
| single YYYY | 8229 | 31.46 |
| other | 5 | 0.02 |
| **non-blank** | **17163** | **65.62** |

Single-year numeric min/max: 1870 / 2024.

First 5 raw values in file order (includes empties): `null`, `null`, `null`, `null`, `null`.

First 5 single-year values: `1915`, `2011`, `2023`, `2018`, `2020`.

First 5 multi-year values: `1962,2011,2023`, `2007,2020`, `1938,1998`, `1958,2006`, `1994,2002,2016,2017,2018,2021`.

The five `other` rows are truncated lists or a bogus `209` token (`209,1975,2002,2019,2020`, lists ending in a trailing comma, `209,2019`).

`Number(YEAR_BUILT)` would keep only the 31.46 percent single-year rows and drop the 34.14 percent comma lists. That is the same concatenation pattern `landuse.ts` already handles for `STAT_LAND_`. Taking the first `YYYY` token recovers 17,161 of 26,155 (65.61 percent). Zero-as-year does not appear.

P-78 is not theater for this county. The source field is populated. The current hard-null in `landuse.ts` is leaving real years on the floor. The extension has to parse a character list, not coerce a number. CAMA remains the structural path for `living_area_sqft` (StratMap does not carry it) and for a single authoritative year when StratMap is blank. It is not required in order to get a year on the 65 percent that StratMap already has.

## GIS_AREA and GIS_AREA_U

`GIS_AREA` is `F(19,11)`. Non-null: 26,155 (100 percent). Non-zero: 26,155. Min 4.48e-7, max 3125.00935828.

First 5 raw values: 6.81664393401, 8.85961187694, 8.09568371033, 7.81879990423, 6.48255540131.

`GIS_AREA_U` is `C(8)`. Distinct values: `Acres` x 26,155. No blanks. No other unit.

For Caldwell 202503, `GIS_AREA` is already in acres. P-78 may write `land_acres` from `GIS_AREA` on this county.

P-78 must still read `GIS_AREA_U` before that write. One county being acres does not prove the unit. Fail closed: write acres only when the unit is acres (case-insensitive); refuse if the unit is blank or unknown. Convert only if a named unit table exists. Do not assume acres.

## LEGAL_AREA (context)

Present. `F(19,11)`. Non-null 26,155 (100 percent). Non-zero 17,945 (68.61 percent). Min 0, max 3130.165. `LGL_AREA_U` is `Acres` on every row.

First 5 raw values are all `0`. First 5 non-zero: 2.72, 10, 10.48, 0.5481, 0.4906.

GIS_AREA is the better `land_acres` source here because it is 100 percent non-zero. LEGAL_AREA zeros look like "not carried," not zero-acre parcels.

## What would have made this theater

If YEAR_BUILT were 0 percent non-null, the parser extension would be theater for this county and CAMA would remain the only year path. That is not what the DBF shows.

If GIS_AREA_U were square feet, square meters, or mixed, P-78 would have to refuse or convert. On this county it is acres, and the unit field still has to be read.
