---
id: 2026-08-24_p78_cad_property_merge_SPEC
title: P-78 cad_property merge spec (execution-hardened)
date: 2026-08-24
status: filed
plan_row: P-78
snapshot: doc_repo main ee9b17d976beff216d4d46c4f991eb6099a0f3f6; LDT origin/main 244567a50ae62334984b3f990d776872e1c206ea (local LDT checkout was 10069854, stale; ingest.ts read via git show origin/main)
related:
  - _inbox/2026-08-24_p73_ingest_bound_field_map.md
  - _decisions/2026-08-24_write_path_data_capture_order.md
  - _inbox/2026-08-24_write_path_what_we_missed.md
  - 90_operations/OPS-16_texas_market_plan_of_record.md
---

# P-78 cad_property merge spec

This is the authority rule a later lane implements. It is not a product PR. Current `upsertCadProperties` on LDT `origin/main` `244567a5` last-wins every attribute from `excluded.*`. That is the defect. Do not start Dallas or Tarrant CAMA until the SET clause below is in code and the fixtures in `scripts/fixtures/p78-cad-merge/` fail against last-wins and pass against this merge.

A later lane must not invent a third path, a synthetic tax_year, or a unit assumption. If a case is not named here, refuse the write of that field.

## Snapshot of the defect

`lib/cad-ingest/src/ingest.ts` `upsertCadProperties` ON CONFLICT `(county_fips, prop_id, tax_year)` sets every attribute to `excluded.<col>` and bumps `ingested_at`. `lib/cad-ingest/src/txgio/landuse.ts` `normalizeStratMapLandUse` forces `yearBuilt: null` and `landAcres: null` even when the DBF carries `YEAR_BUILT` and `GIS_AREA`. Schema: `lib/db/src/schema/cadProperty.ts`. Vintage stamp (already on origin/main): `tier:${tier};adapter:${adapter};drop:${drop}` with `tier` in `{cad-export, stratmap-roll}` (`lib/cad-ingest/src/tier.ts`). SQL grades CAMA with `source_vintage LIKE 'tier:cad-export;%'`.

## Two paths. Pick by tax_year. Do not invent a year.

Path A and Path B are alternatives. The incoming row's `tax_year` integer decides. Never mint a year to dodge a merge.

### Path A: in-place merge (same PK)

Use when incoming `(county_fips, prop_id, tax_year)` already exists. This is the `stratmap-landuse` re-run path. It is also the path for any CAMA drop whose export `tax_year` equals the StratMap `TAX_YEAR` already stored for that key (Tarrant pilot shape: 4991/5000 overlap on the same year). Apply the SET clause in section 3. Announce the zip before a metro-scale run. Do not flip L17 during the run; L17 already names this year, so readers see in-place field changes.

### Path B: new tax_year isolation

Use when a CAMA full load's export `tax_year` is a different integer than the StratMap rows already stored for those `(county_fips, prop_id)` keys. Dallas and Tarrant full loads after announce use this path when the certified roll year is new relative to stored StratMap `TAX_YEAR`. INSERT the new year. Do not UPDATE the old year. L17 declared vintage stays on the previously declared year until the load completes and the operator flips. Readers bind the declared vintage only. Latest-`tax_year` fallback is the defect (P-73 M02). Flip L17 after the load is complete, not before and not mid-zip.

If the CAMA export year equals the stored StratMap year, Path B is closed. Use Path A. Do not write CAMA onto a made-up year.

`stratmap-landuse` re-run always Path A. A StratMap re-run never opens a new tax_year.

## Source kinds

Closed set. Fixtures use these strings. SQL uses the vintage prefix.

| sourceKind | Means | `source_vintage` prefix |
| --- | --- | --- |
| `cama` | CAMA / bulk_primary / cad-export | `tier:cad-export;` |
| `stratmap` | StratMap / stratmap-landuse | `tier:stratmap-roll;` |

A `source_vintage` that does not start with `tier:cad-export;` is not CAMA for the CASE below, including legacy unstructured labels.

## Normalize before merge (parser / toInsertRow)

These run on the incoming record before INSERT. They are not SET-clause COALESCE.

`year_built`: parser only. The SQL CASE still sees an integer or NULL. Never emit `0`. Empty, blank, or `0` becomes NULL.

StratMap `YEAR_BUILT` is `C(60)`, not numeric. Caldwell 202503 (measured 2026-08-25T02:00:53Z, 26,155 rows): 34.14 percent comma-joined lists (`1962,2011,2023`), 31.46 percent single YYYY, 34.38 percent blank. `Number(YEAR_BUILT)` is NaN on the lists and would drop that third. That is the same concatenation shape `landuse.ts` already handles for `STAT_LAND_`.

Parse rule (closed):

1. Trim. Empty / `0` → NULL.
2. Split on comma. Walk tokens left to right.
3. A token is a year only when it is exactly four digits and the integer is in `[1800, 2027]` (1800 inclusive; 2027 is this spec's calendar year 2026 plus one). The implementing lane may substitute ingest calendar year plus one for the upper bound, never a wider floor.
4. Take the **first valid year**. Skip junk (`209` in `209,1975,2002` → 1975).
5. No valid token → NULL. Do not emit the raw string. Do not take min, max, or last year.
6. A numeric incoming year already in range is identity. Out of range → NULL.

Fixture F8 is `1962,2011,2023` → 1962. The selftest also refuses `Number()` as the parser.

`living_area_sqft`: empty becomes null. `0` is not remapped here. Do not invent a sqft-zero rule.

`land_acres` from StratMap `GIS_AREA` (parser only; CAMA acres skip this gate):

1. Trim and uppercase `GIS_AREA_U`.
2. If `GIS_AREA` is null, non-finite, or `<= 0`, emit `land_acres` null. Do not write `0` acres.
3. If `GIS_AREA_U` is missing, blank, or not in the tables below, **refuse the `land_acres` write**. Emit `land_acres` null. Do not assume acres. The rest of the row still upserts.
4. Identity acres (write `GIS_AREA` as `land_acres`, numeric(14,4) string with 4 decimals): `AC`, `ACRE`, `ACRES`.
5. Convert, then write 4 decimals: `SF`, `SQFT`, `SQ.FT`, `SQ FT`, `SQUARE FEET` → `GIS_AREA / 43560`. `HA`, `HECTARE`, `HECTARES` → `GIS_AREA * 2.471053814671653`. Round half away from zero to 4 decimals (`1.00004` → `1.0000`, `2.471053814671653` → `2.4711`).
6. Any other token (`UNKNOWN`, `SQM`, `M2`, `SM`, `FT`, empty) refuses `land_acres`.

Shoelace on inspect is a second derivation for a report. It is not a write.

Fixture F5 expect `{refuse: true, reason: "gis_area_u_not_acres_or_convertible"}` is this field refuse, not a whole-row abort.

## Path A SET clause (exact SQL)

Conflict target stays `(county_fips, prop_id, tax_year)`. PK columns are not in SET.

Default for every attribute except `year_built`, `living_area_sqft`, `source_file`, `source_vintage`, `ingested_at`:

```sql
<col> = COALESCE(excluded.<col>, cad_property.<col>)
```

Incoming null keeps existing. Incoming non-null overwrites, including when both are non-null and they disagree. That is the named winner for legal and values: **incoming**.

CAMA null legal does not wipe StratMap legal (F1) because incoming legal is null. CAMA non-null legal replaces StratMap legal (F4) because incoming legal is non-null.

`year_built` (0 already normalized to null on excluded; SQL still NULLIF as defense):

```sql
year_built = CASE
  WHEN NULLIF(excluded.year_built, 0) IS NULL THEN NULLIF(cad_property.year_built, 0)
  WHEN NULLIF(cad_property.year_built, 0) IS NULL THEN NULLIF(excluded.year_built, 0)
  WHEN excluded.source_vintage LIKE 'tier:cad-export;%' THEN NULLIF(excluded.year_built, 0)
  WHEN cad_property.source_vintage LIKE 'tier:cad-export;%' THEN NULLIF(cad_property.year_built, 0)
  ELSE NULLIF(excluded.year_built, 0)
END
```

`living_area_sqft`:

```sql
living_area_sqft = CASE
  WHEN excluded.living_area_sqft IS NULL THEN cad_property.living_area_sqft
  WHEN cad_property.living_area_sqft IS NULL THEN excluded.living_area_sqft
  WHEN excluded.source_vintage LIKE 'tier:cad-export;%' THEN excluded.living_area_sqft
  WHEN cad_property.source_vintage LIKE 'tier:cad-export;%' THEN cad_property.living_area_sqft
  ELSE excluded.living_area_sqft
END
```

Both CASE arms: CAMA (`tier:cad-export;`) wins a two-valued fight regardless of who is incoming. Same-kind re-run (both CAMA, or both not CAMA) takes incoming. Incoming null never wipes (F3). Incoming non-null fills existing null (F2). Existing stored `0` year is treated as null so a real year can replace it, and `0` is never written back.

Provenance of the last writer (not per-field; do not add columns on this card):

```sql
source_file    = excluded.source_file
source_vintage = excluded.source_vintage
ingested_at    = now()
```

### Drizzle `onConflictDoUpdate` `set` (column list)

```
owner_name              = COALESCE(excluded.owner_name, cad_property.owner_name)
owner_mailing_address   = COALESCE(excluded.owner_mailing_address, cad_property.owner_mailing_address)
situs_address           = COALESCE(excluded.situs_address, cad_property.situs_address)
situs_city              = COALESCE(excluded.situs_city, cad_property.situs_city)
situs_zip               = COALESCE(excluded.situs_zip, cad_property.situs_zip)
legal_description       = COALESCE(excluded.legal_description, cad_property.legal_description)
exemption_codes         = COALESCE(excluded.exemption_codes, cad_property.exemption_codes)
land_value              = COALESCE(excluded.land_value, cad_property.land_value)
improvement_value       = COALESCE(excluded.improvement_value, cad_property.improvement_value)
market_value            = COALESCE(excluded.market_value, cad_property.market_value)
assessed_value          = COALESCE(excluded.assessed_value, cad_property.assessed_value)
land_acres              = COALESCE(excluded.land_acres, cad_property.land_acres)
property_use_code       = COALESCE(excluded.property_use_code, cad_property.property_use_code)
year_built              = <CASE above>
living_area_sqft        = <CASE above>
source_file             = excluded.source_file
source_vintage          = excluded.source_vintage
ingested_at             = now()
```

In drizzle, `sql`COALESCE(excluded.owner_name, ${cadProperty.ownerName})`` (or the equivalent raw `cad_property.owner_name`) is the shape. Do not ship `sql\`excluded.owner_name\`` for any attribute except `source_file` and `source_vintage`.

`cad_property.col` in ON CONFLICT SET is the existing row. `excluded.col` is the proposed insert. That is the only pair this spec uses.

## Field authority (no leftover "or")

| Field | Incoming null | Incoming non-null, existing null | Both non-null, disagree |
| --- | --- | --- | --- |
| `legal_description` | keep existing | incoming | **incoming** |
| `land_value`, `improvement_value`, `market_value`, `assessed_value` | keep existing | incoming | **incoming** |
| `land_acres` | keep existing | incoming (after GIS gate) | **incoming** |
| `owner_*`, `situs_*`, `exemption_codes`, `property_use_code` | keep existing | incoming | **incoming** |
| `year_built` | keep existing | incoming (after 0→null) | **CAMA** (`tier:cad-export;`). Else incoming. |
| `living_area_sqft` | keep existing | incoming | **CAMA**. Else incoming. |
| `source_file`, `source_vintage` | incoming | incoming | incoming |
| `ingested_at` | `now()` | `now()` | `now()` |

"StratMap legal/values win if CAMA lacks them" is the incoming-null cell, not a second conflict rule. F4 names incoming as the legal winner when both strings are present.

## What a later lane changes

1. Rewrite `upsertCadProperties` SET to the clause above. Same conflict target.
2. `normalizeStratMapLandUse`: stop forcing `year_built` and `land_acres` null. Read `YEAR_BUILT` through the first-valid-YYYY rule above (empty/`0`/no valid token → null). Read `GIS_AREA` + `GIS_AREA_U` through the unit gate. Do not add value columns to `txgio_parcel`. Do not `Number(YEAR_BUILT)`.
3. Port `scripts/fixtures/p78-cad-merge/*.json` into cad-ingest. A last-wins implementation must fail F1 and F3. This spec's JS reference must keep passing.
4. Dry-run one county for leftover StratMap fields. Then re-run `stratmap-landuse` only where the dest is empty and CAMA is not the authority for that field (P-73 S04 / WDLL item 9).

Do not add `geo_id` or plat columns here. Those are P-79.

## Fixtures

Directory: `scripts/fixtures/p78-cad-merge/`. Each file is `{name, existingRow, incomingRow, sourceKindExisting, sourceKindIncoming, expect}` plus optional `gisArea` / `gisAreaU` on the fixture object (not `cad_property` columns). Rows use camelCase matching `CadPropertyRecord` plus `sourceFile` / `sourceVintage`. Omit `ingestedAt`. `landAcres` is a 4-decimal string or null. `expect` is the merged row or `{refuse: true, reason}`.

| id | Claim |
| --- | --- |
| F1 | CAMA incoming null legal does not wipe StratMap legal on the same key |
| F2 | CAMA incoming non-null sqft fills StratMap null sqft |
| F3 | StratMap re-run incoming null `year_built` does not wipe CAMA `year_built` |
| F4 | Both non-null legal disagree: incoming wins |
| F5 | `GIS_AREA` with `GIS_AREA_U` not acres and not convertible: refuse `land_acres` |
| F6 | Incoming `year_built` `0` stores null |
| F7 | Two identical CAMA rows: merge is identity (runner is not matching everything) |
| F8 | StratMap `YEAR_BUILT` list `1962,2011,2023` stores integer 1962 (first valid YYYY), not the raw string and not NaN |

Reference runner: `scripts/p78-merge-fixtures-selftest.mjs`. No database. Must pass in both directions (fixtures pass; last-wins and other wrong merges fail F1/F3/F2/F5/F6; mutated F7 expect fails; `Number()` on a comma list is not the F8 parser).

## Three-question gate

1. What executes this? Later: `upsertCadProperties` ON CONFLICT SET plus `normalizeStratMapLandUse` GIS/year gates. Today: `node scripts/p78-merge-fixtures-selftest.mjs` executes the JS reference.
2. What triggers it? Same-key INSERT. StratMap parse of `GIS_AREA` / `YEAR_BUILT`. Path B INSERT of a new `tax_year`.
3. What fails when violated? This selftest exits 1. The later cad-ingest fixture test must fail last-wins on F1 and F3. A control that is specified and undeployed enforces nothing in product until that test is wired.
4. What bypasses it? Raw SQL into `cad_property`. A second upsert helper. REST harvest (P-79) if it writes this table without this SET. A parser that emits `land_acres` without reading `GIS_AREA_U`.

## leave_behind

none for this spec card. The implementing lane declares its own.

## Rejected

Last-wins `excluded.*` for attributes. Assuming `GIS_AREA` is acres. Writing `year_built` `0`. `Number(YEAR_BUILT)` on a character list. Taking min/max/last year from a list. Synthetic tax_year to isolate a same-year CAMA load. Latest-tax_year reader fallback. Whole-row abort on a bad `GIS_AREA_U`. Per-field provenance columns on this card. StratMap as legal winner on a two-valued fight (incoming wins; StratMap wins only by still being present when CAMA legal is null).
