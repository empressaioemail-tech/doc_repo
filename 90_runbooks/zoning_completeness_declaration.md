---
id: zoning_completeness_declaration
title: Zoning completeness declaration — what it asserts, how to audit it, how to reverse it
last_updated: 2026-09-08
status: active
applies_to: hauska-factory
plan_rows: [P-124]
related:
  - _decisions/2026-09-08_zoning_unaccounted_two_populations.md
  - 90_operations/OPS-16_texas_market_plan_of_record
---

# Zoning completeness declaration

## Read this first if you are debugging a zoning problem

If a parcel is serving "no zoning district" and someone believes it IS zoned, this
document is probably why, and the parcel's own cell will tell you in one query.

On 2026-09-08 a sweep converted roughly 4,170 `zoningDistrict` cells across six Central
Texas counties from `unaccounted` to `not-applicable`. Every one of those cells carries
the reason it was written and the evidence behind it. Nothing was written blind, and
every affected cell is individually identifiable.

## What the declaration asserts

For each of 22 named cities, and ONLY those cities:

> As of a named staged-layer vintage, that city's zoning layer covers the area the city
> zones. Therefore a parcel inside its limits that matches no zoning polygon is unzoned
> land (right-of-way, water, or a tract the city never zoned) rather than a hole in our
> copy of the layer.

That is a falsifiable claim about a specific layer version. It is NOT a claim that the
city is finished, that our data is perfect, or that the parcel has no land-use controls
of any other kind.

The declaration lives at `src/config/zoning-layer-completeness.mjs` in `hauska-factory`.
It is data, not a runtime threshold: a city is cleared because someone recorded an
attestation about it.

## The evidence behind it, and its known weakness

Two independent measurements per city, taken 2026-09-08:

`cellPct`, the share of the city's in-city parcels carrying a real district cell, read
from `parcel_record_cell` which is the population the readiness gate actually scores.
`arealPct`, the share of the city-limits polygon area covered by that city's zoning
polygons, computed in PostGIS from `tx_zoning_district_staging` against
`tx_city_boundary`. Those two tables come from different upstreams, so no single source
can satisfy both halves.

**The weakness, stated plainly.** Neither measurement proves any INDIVIDUAL parcel is
unzoned. They establish that the layer as a whole is not materially missing, and the
per-parcel conclusion is inferred from that. A city can be 99 percent complete and still
have one genuinely missing polygon, and a parcel under that polygon will now read
`not-applicable` when it should read `unaccounted`. That is the residual error this
declaration accepts, it is bounded by the coverage figures, and it is the first thing to
suspect if a specific parcel looks wrong.

## Find every cell this wrote

The attestation travels ON the cell, so no cross-reference to this document is needed.

```sql
-- every cell written by the completeness declaration, with its evidence
SELECT pr.county_fips,
       pr.prop_id,
       prc.rail_key,
       prc.cell_state->'completenessDeclaration'->>'cityName'      AS city,
       prc.cell_state->'completenessDeclaration'->>'layerVintage'  AS layer_vintage,
       prc.cell_state->'completenessDeclaration'->>'cellPct'       AS cell_pct,
       prc.cell_state->'completenessDeclaration'->>'arealPct'      AS areal_pct,
       prc.updated_at
  FROM parcel_record_cell prc
  JOIN parcel_record pr ON pr.place_key = prc.place_key
 WHERE prc.cell_state ? 'completenessDeclaration';
```

Run it against `FACTORY_DATABASE_URL`. Any cell carrying `completenessDeclaration` was
written by this mechanism and by nothing else. A `not-applicable` zoning cell WITHOUT
that key came from somewhere older, most likely the instantiate-time sweep for
unincorporated parcels, and is unrelated.

One parcel:

```sql
SELECT prc.rail_key, prc.cell_state
  FROM parcel_record_cell prc
  JOIN parcel_record pr ON pr.place_key = prc.place_key
 WHERE pr.county_fips = '48309' AND pr.prop_id = '<prop_id>'
   AND prc.rail_key IN ('zoningDistrict','zoningJurisdictionKey','zoningProvenance');
```

## How to tell whether it was wrong

The declaration is wrong for a parcel if that parcel really does sit inside a zoning
district. Three checks, cheapest first.

Read the cell. If `completenessDeclaration.cityName` names a city, the claim being made
is that THAT city's layer is complete. If the parcel is not actually in that city, the
problem is the jurisdiction assignment in `landing_parcel_jurisdiction`, not this
declaration.

Check the city's layer directly. Query `tx_zoning_district_staging` for that
`city_name` and see whether a polygon covers the parcel. If one does, the spatial join
missed it and the declaration is masking a join defect, which is a more serious finding
than a stale layer.

Compare against the city's live source. `source_url` on the staged rows points at the
city's own GIS layer. If the live layer has a district for that parcel and our staged
copy does not, the layer is stale and the city should be REMOVED from the declaration
until it is re-acquired.

## How to reverse it

Reversal is safe, targeted and does not need a code change, because every affected cell
is identifiable by the `completenessDeclaration` key.

One city:

```sql
UPDATE parcel_record_cell
   SET cell_state = '{"kind":"unaccounted"}'::jsonb, updated_at = now()
 WHERE cell_state ? 'completenessDeclaration'
   AND cell_state->'completenessDeclaration'->>'cityName' = '<City Name>';
```

Everything:

```sql
UPDATE parcel_record_cell
   SET cell_state = '{"kind":"unaccounted"}'::jsonb, updated_at = now()
 WHERE cell_state ? 'completenessDeclaration';
```

Then remove the city from `DECLARED_COMPLETE` and add it to `EXPLICITLY_HELD` with the
reason, or the next `parcel-r5-zoning --apply` will simply write it again. Re-run
`publish-gate-sched --apply --rail=zoningDistrict` afterwards or the verdict table will
keep the pre-reversal counts. **Reversing without editing the declaration is a no-op that
looks like a fix.**

## Elgin is deliberately excluded and must stay excluded

Elgin measured 68.73 percent parcel coverage and 56.82 percent areal coverage. Its layer
has real holes, so its 1,706 unmatched parcels are NOT verifiably unzoned and keep the
honest `unaccounted` state. That holds Bastrop county at 26 unaccounted and Travis county
at 1,680, and both counties therefore continue to REFUSE the bake.

That refusal is the feature. The declaration would be worthless if it cleared the one
city it should not, and Elgin is recorded in `EXPLICITLY_HELD` as data rather than by
omission so that "we looked at this city and held it" stays distinguishable from "nobody
ever considered it".

**Do not add Elgin to clear a blocked bake.** Add it when its layer is re-acquired and
re-measured, and record the new figures.

## Adding a city later

Re-measure both figures with `scripts/ctx-w2/city-residue-coverage.mjs`, record the
layer vintage the attestation is against, say who or what established it, and add the
entry. Then run `parcel-r5-zoning --apply` and `publish-gate-sched --apply`.

The 95 percent cutoff used on 2026-09-08 was NOT load-bearing: every declared city sat at
95.39 percent or better and the one held city sat at 68.73, so any cutoff between roughly
70 and 95 produced the same set. If a future city lands in that empty middle, the cutoff
becomes load-bearing for the first time and that is a decision to escalate rather than
settle by precedent.

## Tripwires

If `zoningDistrict` unaccounted falls below its recorded level without either a
`parcel-r5-zoning` run or a new declaration entry, something relabelled. Per-county
counts at the time of writing: Bastrop 26, Caldwell 0, Hays 0, McLennan 0, Travis 1,680,
Williamson 0.

If a count RISES, a reload has re-instantiated cells and the sweep needs re-running.
That is expected after any StratMap reload and is not a defect.

If `completenessDeclaration` ever appears on a rail other than the three zoning rails,
something is writing it that should not be.
