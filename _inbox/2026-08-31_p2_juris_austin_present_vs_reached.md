---
id: 2026-08-31_p2_juris_austin_present_vs_reached
title: Austin present vs reached on Hays
date: 2026-08-31
last_updated: 2026-08-31
status: filed
plan_row: F-01
snapshot: 00 then two cheap queries; no 01; no ST_Intersects on 116421 parcels; short-lived URI cleared
---

# Present and reached split

Q1. Austin–Hays city-county overlap is 0.001342 deg², 134229×
the `1e-8` floor. Real straddle. City-county floor is not the
fix. Austin belongs in `cities_ok` for 48209.

Q2. 4142 of 116421 Hays parcels (3.56%) have a bbox overlapping
Austin's bbox. 96.44% never reach it. Thin tail, not the hot
path.

Vertex budget is a fact (Hays 9.29× Bastrop; Austin 32811 =
76% of Hays) and fails as the cancel's explanation. Geometry
is the fourth mechanism that does not carry the cancel.

Residual, not a fifth fit: excluding Austin, Hays still has
10394 vertices across 12 cities = 2.24× Bastrop 4649, against
1.87× the parcels. Neither probe measured reach × vertices
per city.

Guard slip: an `ST_Intersects` check printed `must be 0, got 1`
because it matched an `\echo` label, not SQL. Q2's body is bbox
only.

Cost driver for Hays-full stays un-named. Do not offer a fifth
curve from these two totals. Per-city bbox-reach (same
prefilter as Q2, grouped by city, joined to npoints already in
hand) would name the product. Offered, not run.
