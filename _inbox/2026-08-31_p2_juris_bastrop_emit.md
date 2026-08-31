---
id: 2026-08-31_p2_juris_bastrop_emit
title: Bastrop-scoped 01 emitted inside 180s
date: 2026-08-31
last_updated: 2026-08-31
status: filed
plan_row: F-01
snapshot: Factory join 96e3ef4; decoded scoped to 48021 only; 00+01 one psql session; neondb; short-lived URI cleared
---

# Bastrop-scoped 01 emitted

Operator run. Exit 0. Inside 180s. Wall 129s including connection
and 00. RO refuse: durable CREATE TABLE refused `[cannot execute
CREATE TABLE in a read-only transaction]`. Snapshot unchanged:
`neondb | on | 3min | PostGIS 3.5`, `parcel_distinct_prop` still
981410.

The query is correct. The six-county cancel is volume.

## Emit (not adopted)

| report | unincorporated | in_city | unresolved | total |
|---|---|---|---|---|
| TOTALS | 50265 | 11992 | 0 | 62257 |

`denom_check` got 62257 / expected 62257. Method 100% ring
(`n_bbox_centre` 0). `still_unresolved` 0.
`assigned_forbidden_names` 0. `city_rows_named_cdp` 0. `kyle_in`
null (Hays out of scope).

Statewide `d_*` in this emit compare against 357269 / 624141 /
981410 and do not apply at this scope. Ignored.

Statewide TOTALS stays UNMEASURED. This is a partition.

## The +326 and the unnamed 6

Prior `rural_bastrop` measurement: unincorporated 49939 /
in-city 12318. This emit: 50265 / 11992. Delta +326 / −326.

Slivers: 320 hits, 320 parcels, `max_deg2` 9.87e-9, all below
the 1e-8 floor. That is the Coupland-phantom class. 326 − 320
leaves 6. Neither 50265 nor 49939 is adopted. The 6 are not
absorbed.

Leading mechanism, pre-registered on the join rewrite CP1: a
parcel whose ring leaves `48021` and hits a city that does not
intersect that county polygon misses under `p.county_fips =
c.county_fips`. The 2026-08-30 measure was all-cities
bbox+intersects. Rival rejected: bbox-centre flip (`n_bbox_centre`
is 0). Rival rejected: the `"0"` sentinel (`min(prop_id)` picked
one row, not six). Rival rejected: snapshot change (1222 / 254 /
981410 unchanged).

Naming query, not yet run: same Bastrop `decoded`, same 1e-8,
drop only `p.county_fips = c.county_fips`, count kept in-city.
If that count is 11998, the 6 are cross-county city hits. If it
is 11992, equality moved nobody and the 6 are still unnamed. If
it is any other number, the remainder stays open.

## Sentinel hygiene

`rural_bastrop.sample_prop_id` is `"0"`. Same class as the
168-part catch-all already named on the edge work
(`neighbor = "0"`). `min(prop_id)` selected a live sentinel in
`txgio_parcel`. Not a correctness miss on this emit. Leave
behind for persist: do not let a sampler, or a node key, treat
`"0"` as a parcel.

## What this does not make the plan

Per-county execution is a legitimate answer for a 62,257-parcel
county. It is not yet the six-county plan. Travis (380,918) and
Williamson (282,570) are 6.1x and 4.5x this emit. Linear in
parcel count against the same 1,222 cities, those cancel at
180s. Hays (116,421) and McLennan (114,255) sit on the bound.
Caldwell (24,989) should emit. A cancel there is a further
partition, not a raised timeout.
