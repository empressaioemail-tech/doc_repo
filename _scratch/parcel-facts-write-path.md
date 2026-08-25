# Parcel facts write-path

## GROUND-TRUTH (2026-08-25T02:08:37Z)

- P-77 live MEASURED on named N=11 at 2026/cad-export: hit 10, miss 1, vintage-gap 0, unmeasured 0. Miss `48453:280238` leading_zero_orphan=false (not a padded key). Hit class 280239/280210/280211 all HIT. First live attempt failed: `psql -c` does not interpolate `:'var'`. Instrument now uses digit literals; `:'var'` refused; postgres URLs redacted.
- Wave 1 stores MEASURED 2026-08-25T01:58:19Z: tx_city_boundary 1222/1222 geo_id; staging 10196 (water 8515, sewer 1455, electric 139, water-district 87). Exact match to L22/ss-w15. Possibly unchanged store.
- Caldwell 48055 StratMap 202503: YEAR_BUILT C(60) 65.62% non-blank, 34.14% comma lists. GIS_AREA 100% filled, GIS_AREA_U 100% Acres. P-78 F8 first-valid-YYYY. Do not Number() the field.

## LESSON

`psql -c` does not interpolate `:'name'`. That interpolation is for `-f` scripts. A self-test that only builds the SQL string will not catch it. First live fail staying UNMEASURED was the instrument working.

## GROUND-TRUTH (2026-08-24T20:55-05)

- P-78 merge locked: COALESCE(excluded, table) for legal/values/owner/situs/use/acres; year_built + living_area_sqft CAMA-wins CASE on `tier:cad-export;%`. GIS_AREA_U closed set AC/ACRE/ACRES identity, SF/SQFT/HA convert, else refuse land_acres. year_built 0 → null. Path A same tax_year (stratmap-landuse re-run). Path B new tax_year only when CAMA export year differs; L17 flip after load. Selftest PASS `node scripts/p78-merge-fixtures-selftest.mjs`.

## GROUND-TRUTH (2026-08-24)

- Game plan `_inbox/2026-08-24_parcel_facts_write_path_game_plan.md`. WDLL draft, operator go pending.
- OPS-16 A-026 adds P-73..P-80.
- `landuse.ts` already persists legal/values/STAT_LAND_ to `cad_property`; forces `yearBuilt`/`livingAreaSqft`/`landAcres` null. `parse.ts` is geometry-only.
- L20 291k = `tx_zoning_district_staging`. Footprint staging = `tx_building_footprint` ~10.67M.
- City-limits CLI exists. ETJ layer does not.
- REST harvest writer ABSENT.
- `upsertCadProperties` last-upsert-wins. No CAMA/StratMap merge.
- Travis join is `prop_id` only. Registry geo_id crosswalk not implemented.
- baked-facets treats any trimmed situs string as present (`, TX` passes).

## LESSON

Effort-tier by report value is not write-path order. Bind existing stores first. Authority rule before a second writer on `cad_property`. Measure a join before loading CAMA onto it.

## DEAD-END

- Extending `parse.ts` to carry values onto `txgio_parcel` (columns do not exist; wrong store).
- Starting Travis CAMA to fix 280238 (CAMA keys CAD account; node is StratMap prop_id).
- Treating L20 zoning counts as footprint staged.

## OPEN

- Phase 1 still wrapping. Waves 3-6 held. A-027 go is P-75/P-76 only.
- Miss list: `_inbox/2026-08-24_write_path_what_we_missed.md` (structural live vs situs baked; GIS_AREA_U; P-78 rewrite; empty-index lie; CAMA close must name atom-apply).
- Cheap wrap A–E done. F (P-25 close contract) still open. Waves 3–6 held.
- P-78 spec + F1–F8. Selftest must keep passing. Product rewrite is Wave 3.
- P-77 serve / honest-miss half still held (A-027).
- A2 PE tree still holds property hauska-map; P-74 needs isolated tree from origin/main.
