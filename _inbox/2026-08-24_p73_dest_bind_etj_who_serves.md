---
id: 2026-08-24_p73_dest_bind_etj_who_serves
title: P-73 dest/bind rows for M35 city limits and who-serves
status: active
date: 2026-08-24
plan_row: P-73
parent: _inbox/2026-08-24_parcel_facts_write_path_game_plan.md
field_map: _inbox/2026-08-24_field_mapping_pass.md
---

# P-73 dest names that unblock Wave 1

Field-mapping pass already named "no adapter yet" and the next cards. This file is the meaning-shaped dest/bind for the two cards now in flight. It does not harvest.

| Canvas / field | Source field(s) | Dest | Join key | Vintage | Authority on conflict | Empty vs sentinel vs unmeasured |
| --- | --- | --- | --- | --- | --- | --- |
| M35 city limits | TxGIO City_Boundaries polygon (`CITY_NM` / `GEO_ID` / geometry) | `tx_city_boundary` then `resolveCityContainment` result `{status, cityName?, geoId?, basis}` | Parcel centroid (or existing containment query point) vs polygon | Ingest as-of of the boundary CLI run | TxGIO incorporated-place polygon over situs city token | Zero-row index = **unmeasured** (do not emit unincorporated). Point outside all polygons = **unincorporated** (honest absence). Point inside = **incorporated**. ETJ = **unresolved** (no dest column; typed absence). |
| Who-serves water | L22 `tx_utility_territory_staging` `source_key=puct-water-ccn` geometry + territory id / name | Serve DTO holders[] + residual; no atom | Parcel centroid PIP | L22 staging as-of 2026-08-14 close | Staging polygon; do not invent a holder from a city name | No hit = zero water holders (not "no water"). Residual always present. |
| Who-serves sewer | `source_key=puct-sewer-ccn` | same DTO | same | same | same | same |
| Who-serves electric | `source_key=hifld-electric-retail` | same DTO | same | same | same | same |
| Who-serves PWS | `source_key=twdb-pws` | same DTO | same | same | same | Empty-geometry rows already excluded in L22 (31). Do not revive them as holders. |
| Who-governs TCEQ additive | `source_key=tceq-water-districts` (87 additive) | Complementary holder class, not water CCN | same | same | Do not restate a `tx_special_district` duplicate as who-serves water | Alias-rejected Montgomery County MUD 140 stays additive if still staged. |

## Folklore corrections (bind these, do not re-derive)

1. City limits is not ETJ. No statewide ETJ layer. P-76 ships three states. Full ETJ is a later card.
2. L20 291k is zoning staging, not footprints. Do not start P-09 on this go.
3. Who-serves is a read over staged polygons, not a new atom family.

## What this file does not name

Situs sentinel (P-74), Travis join measure (P-77), CAMA authority (P-78), REST harvest dest columns (P-79). Those stay on the parent game plan until their cards start.
