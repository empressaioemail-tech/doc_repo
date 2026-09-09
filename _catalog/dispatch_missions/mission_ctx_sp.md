# CTX-SP — a real Elgin district exists that our registry never mapped, and ten parcels are about to be called unzoned because of it

Repo: `hauska-engine`, and only hauska-engine. The zoning-staging registry lives at
`packages/engine-core/src/zoning-staging/registry.ts` and `tx_zoning_district_staging` is
written only from this repo (`scripts/stage-tx-zoning-district.mjs`, migration 0074). A
prior dispatch pointed a lane at `legacy-design-tools` for this table and that lane
correctly stopped rather than ship a no-op against `txgio_parcel`. Do not repeat it.

## The finding, established twice by two independent lanes

CTX-ELGIN found it on 2026-09-09 and CTX-ZONESCOPE re-verified it live the same day with
an independent re-fetch and its own PostGIS containment test:

**Eleven live polygons in Elgin's published zoning layer carry `Zone_Code = 'S-P'`, a
genuine Elgin zoning district. This repo's `codeDomainMap` for `elgin-tx` excludes it, so
those polygons were never staged at all.** Nine of the eleven geometrically cover ten
Bastrop parcels:

    12948, 111348, 14457, 124619, 12830, 8712013, 60891, 11364, 85259, 14535

Seven of the ten already carry a real `zoning_district` in `txgio_parcel` through some
other mechanism. **Three do not: `14457`, `12830`, `60891`.**

## Why this is urgent rather than tidy

CTX-PARCELGATE built a per-parcel write gate in `hauska-factory` and then measured what
happens to those three. Because the S-P polygons were never staged, the parcels match no
polygon in the union — structurally, by construction — and because they carry no real
district elsewhere, they pass both gate conditions. **They become eligible for a `refused`
layer-gap cell, indistinguishable from a genuinely uncovered parcel.**

A `refused` cell on them asserts we probed and found no zoning coverage. The land under
them is zoned. That is a wrong statement about a customer-facing parcel, not an honest
absence, and it is exactly the failure this program's gate structure exists to prevent.

That lane reported it as an unresolved correctness gap rather than adding an exception
list, which was correct. This lane closes it at the source.

## The work

1. Establish what `S-P` actually is in Elgin's ordinance, from Elgin's own published
   material, and what it should map to in this program's district vocabulary. **Do not
   guess and do not invent a mapping.** `S-P` commonly denotes a special-purpose or
   site-plan district; whether it has a legitimate equivalent in our vocabulary is a real
   question with a real answer, and the answer might be that it has none.

   If it has no honest equivalent, say so. A district that exists and has no mapping is a
   finding, and the right outcome is then a named, staged district code that carries its
   own identity rather than being forced into a neighbouring one. Forcing a wrong mapping
   would be worse than the current gap, because it would serve a confident wrong district
   instead of a confident wrong absence.

2. Add the mapping to the `codeDomainMap` for Elgin. Note there are now **two** registry
   entries — `elgin-tx` (FeatureServer/0, Bastrop side) and `elgin-tx-travis`
   (FeatureServer/1, Travis side, added by CTX-STAGE2 on 2026-09-09). Establish whether
   `S-P` appears on both layers before deciding whether both entries need it. CTX-STAGE2
   recorded the Travis-side code domain as `A, C-1, C-2, C-3, R-1, R-3` with no `S-P`
   observed, so the honest answer may be that only the Bastrop-side entry needs it.

3. Re-stage the affected layer or layers, dry run first, then apply against
   `CORTEX_DATABASE_URL` on the direct host. Verify the write is confined to its own
   `city_key` partition by reading back the untouched partition's row count, exactly as
   CTX-STAGE2 did when it confirmed `elgin-tx` stayed at 3,220 rows byte-for-byte.

4. Re-measure. Report, per county, the Bastrop residue against the union of Elgin's staged
   base layers, using CTX-STAGE2's counting rule verbatim including its per-parcel
   `EXISTS` aggregation. The expected direction is that Bastrop's raw residue drops from
   36 toward 26 as the ten S-P parcels begin matching a real polygon.

   **Report what you measure, not what is expected.** CTX-STAGE2 expected a re-stage to
   move Bastrop's residue toward 9 and it moved to 58 instead, and reporting that
   disagreement plainly was the most useful thing that lane produced.

5. Confirm, by id, that all ten named parcels now match, and that the three unresolved
   ones specifically resolve to a real district rather than remaining residue.

## Verify by violating

Before you trust the re-measure, run the same instrument against a city this mission never
touches and confirm it can still return a non-zero residue. CTX-STAGE2 used Pflugerville
and got 41 on a labelled 3,000-parcel sample; CTX-ZONESCOPE reproduced that figure exactly
from an independent implementation. An instrument observed only returning the answer you
wanted has not been observed working.

## What you must NOT do

Do not invent a district mapping to make ten parcels match. A wrong district served
confidently is worse than an honest gap.

Do not touch `txgio_parcel` as a write. Reading it for the spatial join is expected and is
what CTX-STAGE2 did.

Do not run `parcel-r5-zoning`, any bake, publish, walk, Cloud Run job or Cloud Build, and
do not deploy. The integration seat owns every execution on this program.

Do not write to `hauska-factory`, `legacy-design-tools` or `hauska-map`. The ceiling and
the per-parcel gate live in hauska-factory and are being changed there concurrently by
CTX-PARCELGATE; you report your residue number and that lane consumes it.

## Traps carried forward from four lanes

A long-running query at near-zero CPU is STUCK, not working. CTX-STAGE2 lost over an hour
to a residue query with no `city_key` restriction and no bbox pre-filter. Restrict by
`city_key`, pre-filter on the numeric bbox columns both tables carry, set
`connect_timeout` and `statement_timeout`, and announce any heavy scan before starting it
per AGENT-CONTRACT section 4 rather than after.

`txgio_parcel` carries multiple geometry rows per `prop_id` (48021: 74,729 rows against
62,257 distinct). Per-parcel `EXISTS` aggregation, never a flat join. A flat join already
produced an impossible number in this program once, caught only because two figures that
should have agreed did not.

The registry entry type carries singular `layerUrl`, `layerId` and `parentCountyFips`
fields and the registry is a plain object literal, so a duplicate key silently overwrites
rather than merging. CTX-STAGE2 hit this and had to add a new key.

## Close contract

Standard lane close JSON, plus:

- What `S-P` is, from Elgin's own material, with the source, and the mapping you chose or
  the reason none is honest.
- Whether `S-P` appears on one layer or both, with evidence.
- Dry run then apply counts, and the untouched-partition read-back proving scope.
- Per-county residue before and after, with the full counting rule.
- All ten parcels by id with their post-stage disposition, and the three unresolved ones
  called out specifically.
- Your non-zero falsifier result on an untouched city.
- `leave_behind`.

Report the numbers. CTX-PARCELGATE is waiting on your post-stage Bastrop residue before it
writes any ceiling, and it has been told to write nothing until this lands.
