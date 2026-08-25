---
id: 2026-08-24_p73_ingest_bound_field_map
title: P-73 ingest-bound field map (A3)
date: 2026-08-24
status: filed
plan_row: P-73
snapshot: code-read 2026-08-24; store hop unmeasured (U) where marked
related:
  - _inbox/2026-08-24_parcel_facts_write_path_game_plan.md
  - _inbox/2026-08-24_parcel_facts_write_path_WDLL.md
---

# P-73 ingest-bound field map

This is the A3 deliverable. Every row has source, dest, join, vintage, authority, and empty/sentinel/unmeasured. Store fill percents from dated docs are claims, not re-queried here (U).

A row with dest "column to add" is mapped. It is not harvested. P-79 builds those columns.

| Canvas | Source field(s) | Dest | Join key | Vintage | Authority on conflict | Empty / sentinel / unmeasured |
| --- | --- | --- | --- | --- | --- | --- |
| M07 | `cad_property.situs_*`; `txgio_parcel.situs_address` (99.3% claimed) | PE card title + `facets.situs` bind. No new column. | `parcel_node_id` = `{fips}:{normalizeCadPropId(prop_id)}` → `txgio_parcel (county_fips, prop_id)` | Current txgio load; CAD at declared vintage | CAD sentinel (`, TX`, comma-tail) is absent; then `txgio_parcel.situs_address`. Two real streets that disagree: print CAD and name both sources. Never copy Find/Photon. | Sentinel = absent. Null = absent. Unmeasured if neither row read. |
| M35 city | TxGIO City_Boundaries → `tx_city_boundary` (CLI exists; store claimed 0) | Serve-time `resolveCityContainment`: `incorporated` \| `unincorporated` | Parcel centroid from `txgio_parcel.geometry` PIP | Layer date stamped at boundary ingest | Polygon contains centroid → incorporated. Else unincorporated. | No city rows loaded = **unmeasured**, not unincorporated. |
| M35 ETJ | No statewide layer | Honest `unresolved` chip only | n/a | n/a | Do not derive a statutory buffer on this card. | Unresolved = typed absence. Not a finding. |
| M02 T48453 | `cad_property` row at declared vintage | Facet bind class: hit \| `lookup-failed` | `(county_fips, normalizeCadPropId(prop_id))` only. Not `geo_id`. | Declared `2026/cad-export` (L17) | Declared-vintage row only. Latest-tax_year fallback is the defect. | No row = `lookup-failed` + vintage named. HTTP 200 is not a bind. Structural nulls on a hit row = CAMA card, not this join. |
| S04 year | StratMap DBF `YEAR_BUILT` | `cad_property.year_built` via `landuse.ts` (today forced null) | `(county_fips, prop_id, tax_year)` from DBF | DBF `TAX_YEAR` | CAMA non-null `year_built` on same key wins. StratMap must not overwrite it. CAMA null must not wipe a StratMap year (P-78). | DBF null → SQL null. Never 0. |
| S04 acres | StratMap DBF `GIS_AREA` | `cad_property.land_acres` via `landuse.ts` (today forced null) | same | same | Same merge as year. Shoelace on inspect is a second derivation for the report, not a write. | Null ≠ 0 acres. |
| M03 H01 | `txgio_parcel.geo_id`; CAD REST `GEO_ID` (158/176) | **New** `cad_property.geo_id` (column absent). P-79. | Copy txgio by `(fips, prop_id)` where both exist; REST where not | CAD tax year / txgio load | If txgio `geo_id` and REST `GEO_ID` disagree, **refuse** that row (meaning-shaped). Do not pick a winner. | Missing geo_id = unmeasured join helper. Not zero parcels. |
| M04 H02 | CAD REST `MAP_ID`, `BLOCK`, `TRACT_OR_LOT`, `ABS_SUBDV_CD` (142–151/176) | **New** `cad_property` columns `plat_map_id`, `plat_block`, `plat_tract`, `plat_abs_subdv`. Atom body follows. P-79. | REST by county `prop_id` / account from inventory | CAD layer edit date or tax year | REST is appraisal plat identity. Do not invent from legal description text. | County not in inventory = skip county, typed absence. |
| M15 H03 | CAD REST `DEED_DATE` (148/176) | **New** `cad_property.deed_date`. P-79. | `prop_id` | Tax year of the roll | REST only. Not in `landuse.ts` path. | Null = absent. Not epoch. |
| M17 H04 | CAD REST `SCHOOL` (147/176) | **New** `cad_property.school_district`. P-79. | `prop_id` | Tax year | REST only. Do not infer from `special-district-fact`. | Null = absent. |
| C01 C02 T48113 | DCAD certified zip (`vendors/dcad-certified/parser.ts` on LDT main) | `cad_property.living_area_sqft`, `year_built` | Dallas `ACCOUNT_NUM` | Bulk tax year; flip L17 **after** load | CAMA wins sqft and year_built. Must not wipe legal/values if the CAMA row lacks them (P-78). | CAMA null on a present account = absent-verified. Never write 0. |
| C01 C02 T48439 | TAD `PropertyData` (`vendors/tad-propertydata/parser.ts`) | same | Tarrant `GIS_Link` (StratMap prop_id shape on pilot) | same | same | same |
| T48453 CAMA | TCAD PACS (`pacs/parser.ts` exists; `adapter_kind` still unknown) | same | PACS `prop_id`. Does **not** bind StratMap-only nodes (280238 class). | After P-77 measure; flip declared after load | same P-78 | same. Join miss stays P-77/P-80. |
| T48029 T48085 T48121 | No bulk parser | none this program | n/a | n/a | n/a | **Unmeasured** until a parser card. Not a typed zero. |
| M33 | `tx_building_footprint` (~10.67M / 254). Not L20 zoning 291k. | `hauska_mcp.atoms` `building-footprint` | Geometry-true `ST_Intersects` vs `txgio_parcel` rings (`planCountyStagedFootprints` on seat engine) | Staging load date | Staged geometry over ML fallback (T3). | No intersect = writer honest-absence or omit per existing halt rules. Gold atom-miss today. P-09 apply; P-51 serve. |

## Not in this map

HOA, MLS, Factory 2 setbacks, SB12 remainder, M39 RRC toggle, roads COVER, 58-county geometry, IDENT P-55. Serve leftovers stay on their rows.

## Vacuous-pass guard

WDLL item 1 fails if any ingest-bound canvas above has an empty dest, join, or authority cell. "Job" prose is not a map row.
