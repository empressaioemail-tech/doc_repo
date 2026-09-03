# Mission — ACQUIRE-GIS wave 1: four scouted rails, cited sources only

## Why

`_inbox/2026-09-02_parcel-scout-gis_close.json` and its inventory
(`_inbox/2026-09-02_parcel-scout-gis_inventory.md`) scouted six declared-ahead rails from
`_decisions/2026-09-01_parcel_record_rails_v2_template.md`. Four came back genuinely
acquirable now: `schoolDistrict`, `utilityService` (water/sewer sub-rows only),
`overlayDistricts`, `agValuation`. This card ACQUIRES exactly those four, against exactly
the sources the scout cited. No new source discovery. Do not re-scout the weak/absent
ones (electric, gas, the other five ag counties, the six unconfirmed overlay cities) —
they stay unaccounted, per the scout's own leave-behind recommendation. Gas specifically
is pending a separate operator ruling on permanent-unaccounted status and is out of this
card's scope regardless of that ruling's outcome.

This is not a Factory 1.5 lane (`90_runbooks/factory_1_5_acquisition_staging.md` governs
Rail A-D core: parcel geometry, address, boundary, flood, CAD). It writes into rail cells
on already-instantiated `parcel_record` rows via spatial join and one attribute join, not
new atom rows. No CLI exists for this yet — this is the first wave of it, not a rebuild of
something that already exists. `schema.sql` does not change; the v2 rail set is already
rail-agnostic per `mission_parcel_rails_v2.md`.

## Scope — four rails, four sources, cited

**1. `schoolDistrict` (scalar) — statewide, all six program counties.**
Primary: TEA-hosted ArcGIS Hub mirror of TLC "School Districts 2025."
REST: `https://services2.arcgis.com/5MVN2jsqIrNZD4tP/arcgis/rest/services/Map/FeatureServer/0`
(1,017 features). Cross-check: NCES EDGE
`https://nces.ed.gov/opengis/rest/services/School_District_Boundaries/EDGE_SCHOOLDISTRICT_TL25_SY2425/MapServer/1`
(1,018 features, independent count). Join: spatial, parcel centroid in polygon.
Candidate secondary attribute join: `DISTRICT`/`DISTRICT_C` (Texas County-District
`CCC-DDD` code) if a CAD source already carries it — spatial join is the primary
mechanism regardless.

**2. `utilityService`, water/sewer sub-rows ONLY — statewide, all six counties. Electric
and gas are OUT OF SCOPE this wave.**
PUCT CCN polygons via TWDB mirror (most official-adjacent of the three mirrors the scout
found): `https://services.twdb.texas.gov/arcgis/rest/services/PWS/Public_Utility_Commission_CCN_Water/MapServer`
layer 0. Join: spatial, parcel centroid in polygon. `CCN_NO` leading digit distinguishes
water=1/sewer=2 — use this to populate the two sub-rows, not a single undifferentiated
value.

**3. `overlayDistricts` (companion) — the 12 of 18 in-scope cities the scout confirmed
with a real, distinct layer.** Georgetown, San Marcos, Buda, Austin, Waco, Round Rock,
Bastrop, Kyle, Cedar Park, Pflugerville, Hutto, Taylor. Each city is its own schema (see
the inventory's per-city table for URLs/fields) — build a per-city adapter, not one
uniform puller. Join: spatial, scoped to that city's own jurisdiction boundary (never
apply one city's overlay layer outside its boundary). The 6 unconfirmed/negative cities
(Leander confirmed clean negative; Lockhart, Robinson, Elgin, Dripping Springs, Liberty
Hill unconfirmed) are OUT OF SCOPE this wave — leave unaccounted, do not re-scout here.

**4. `agValuation` (companion) — Williamson County ONLY.**
WCAD Socrata API: `https://data.wcad.org/resource/2ckt-cqwj.json` ("Land -
PropertyDataExport"), geometry from the sibling Parcels dataset (`an3x-cnmw`). Join key:
`propertyid`. Populate `agflag`, `statecode` (D1 = qualified open-space ag land),
`landtype`, acreage and dollar values as found. The other five program counties (Travis,
Bastrop, Caldwell, McLennan, Hays) are OUT OF SCOPE this wave — Travis's flat-file
recheck and Bastrop's bulk-export path are separate follow-up cards, not this one.

## Landmines

- Every written cell carries its source citation and fetch timestamp in provenance. A
  value without a citation is indistinguishable from a fabricated one — do not write a
  cell that cannot show where it came from.
- Do not touch `schema.sql` or any store outside the specific rail cells named above.
- TWDB CCN metadata says "Last Updated: October 1, 2021" but the same description claims
  quarterly updates — a real, unresolved vintage discrepancy. Note it in provenance; do
  not attempt to resolve it in this card.
- Expect ~1,017-1,018 school districts against Texas's ~1,200+ total LEAs — the gap is
  very likely open-enrollment charter authorities with no discrete boundary polygon. This
  is expected, not a defect; do not treat missing charter-district coverage as a bug.
- `overlayDistricts`: a parcel outside all 12 confirmed cities' boundaries stays
  `unaccounted`, never inferred as "no overlay." A parcel inside a confirmed city that
  matches zero overlay polygons is a genuine, legitimate "no overlay applies here" —
  write it as a value (empty/none), not as unaccounted, since the source was actually
  checked.
- `agValuation`: parcels outside Williamson stay `unaccounted`. Do not write
  `absent-verified` for the other five counties — nothing looked there this wave.
- `schoolDistrict`: every Texas parcel sits in exactly one ISD. A parcel matching zero
  district polygons is a genuine anomaly — investigate and report, do not file as
  absent-verified without investigation.
- Follow Factory store discipline
  (`90_runbooks/factory_1_5_acquisition_staging.md` S1/S2/S6 in spirit, even though this
  is not a Factory 1.5 lane): resolve the direct host (no `-pooler`) before any write,
  dry-run must predict apply before the real run, post-apply verify by an independently
  derived count (query the store, not the job's own counter).
- Never convert `unaccounted` to `absent-verified` to make a coverage number look
  better. `absent-verified` is a claim that something looked.

## Verify (meaning-shaped, after the run)

- Per rail, per county: cell-state counts (value / unaccounted / absent-verified),
  derived independently from the `parcel_record` store, not the job's own run counter.
- `schoolDistrict`: value-count approximately equals the containment parcel count for all
  six counties (every parcel has exactly one ISD); list any exceptions by name, not by
  count alone.
- `utilityService` water/sewer: spot-check a sample against the `CCN_NO` leading-digit
  rule to confirm the water/sewer split is correct, not just present.
- `overlayDistricts`: value present only for parcels inside one of the 12 confirmed
  cities' jurisdiction boundary; zero false positives outside it (spot-check a
  neighboring unconfirmed city returns none).
- `agValuation`: value present only for Williamson parcels; zero for the other five
  counties (unaccounted, not absent-verified).
- Sample-pull five written cells across different rails and confirm each carries a
  populated source citation and fetch timestamp, not a placeholder.
- Paste every verification verbatim with snapshot (store, database, job execution name,
  timestamp).

## Close

`_inbox/<date>_parcel-acquire-gis-wave1_close.json`: per-rail per-county state counts,
citation-presence proof, `whatContradictedTheCard` (mandatory), `leave_behind` naming the
out-of-scope items explicitly (electric, gas, the five ag counties, the six overlay
cities) so they read as deferred, not dropped, plus scratch block (LESSON / DEAD-END /
GROUND-TRUTH / OPEN).
