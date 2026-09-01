---
id: 2026-08-31_p2_juris_probe6_timeout
title: Equality-dropped Bastrop probe cancelled at 180s
date: 2026-08-31
last_updated: 2026-08-31
status: filed
plan_row: F-01
snapshot: 01_probe6.sql; decoded 48021; county_fips equality dropped; 00+01 one psql session; short-lived URI cleared
---

# Probe6 cancelled

psql exit 3. Elapsed 230s. RO refuse armed. 01_probe6.sql line 353
`canceling statement due to statement timeout`. No in-city count.
Not 11998, not 11992. The 6 stay unnamed. Remainder open. Nothing
adopted.

Dropping `p.county_fips = c.county_fips` is not a small
relaxation. With equality, each Bastrop parcel joins cities in
48021. Without it, 1,222 city polygons are candidates. Same
parcel set, same 1e-8, same 180s, roughly two orders more
comparisons. Bastrop-with-equality emitted. This did not.

The cancel does not weaken the CP1 mechanism. It shows the
equality is what makes Bastrop tractable. That is a join datum,
not a naming of the 6.

The 326-vs-320 set-diff is starved. `49939` is a literal in
`rural_bastrop`, not a stored identity set. Sliver prop_ids can
be re-emitted from the equality query. The 326 changed rows
cannot. A count difference is not a set.

Cities overlapping 48021 is the wrong narrowing for CP1. The
hypothesis is a hit on a city that does **not** intersect the
county polygon. Restricting to overlapping cities drops the
candidates the prediction names.
