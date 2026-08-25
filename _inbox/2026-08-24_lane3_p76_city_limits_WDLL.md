---
id: 2026-08-24_lane3_p76_city_limits_WDLL
title: Lane 3 — P-76 city-limits ingest + PIP (ETJ adapter card, honestly scoped)
status: approved
date: 2026-08-24
plan_row: P-76
operator_go: verbal 2026-08-24 (Lane 3 ETJ adapter card after mapping)
parent_wdll: _inbox/2026-08-24_parcel_facts_write_path_WDLL.md item 5
depends_on: _inbox/2026-08-24_field_mapping_pass.md
---

# WDLL: P-76 city limits (the ETJ adapter card)

Operator go 2026-08-24 on the screenshot item "ETJ adapter card (OPS-16 amendment) after mapping." Mapping is filed. A-026 already added P-76.

City limits is not ETJ. `tx_city_boundary` and `resolveCityContainment` already exist. There is no statewide ETJ layer. This card loads incorporated-place polygons and serves three honest states: incorporated, unincorporated, ETJ unresolved. A fabricated ETJ buffer is a defect.

Isolated LDT tree only. Do not write `P:/seat-worktrees/property/legacy-design-tools`. No atoms `--apply`.

## Done looks like

Gold `48021:34137` reads incorporated (Bastrop). A named unincorporated control reads unincorporated with basis. Every parcel that is not inside a TxGIO city polygon carries an ETJ-unresolved chip, never a guessed municipal ETJ. Inspect and the future feasibility section 3 can name the city of record or say unresolved. Store 0 on city limits is no longer the live state.

## Acceptance items

1. **Source and dest named.** Source is TxGIO City_Boundaries (`feature.geographic.texas.gov` City_Boundaries/Texas_City_Boundaries/MapServer/0). Dest is `tx_city_boundary`. Join is point-in-polygon on parcel centroid (or the existing containment query point). Vintage is the ingest as-of. Authority on conflict: TxGIO polygon wins over a situs city token. Empty polygon index is unmeasured, not unincorporated. | check: CP1 names those five; code path `resolveCityContainment` | grade: [met] CP1 + `cityLimitsFact` on facets

2. **Table is populated or the miss is named.** `tx_city_boundary` has a measured row count after the existing boundary CLI, or CP1 files that the CLI was not run and why. A zero-row table must not emit unincorporated as if the index were complete. | check: store count + CLI dry-run or apply log with snapshot | grade: [met 2026-08-25T05:12Z] store 1222/1222 geo_id at 2026-08-25T01:58Z; gold `incorporated` on serving 00579-teh proves the index is populated; empty-index path stays unmeasured

3. **Gold is incorporated.** Live `48021:34137` containment is `incorporated` and names Bastrop (or the TxGIO city name for that polygon). | check: live probe after serve wire | grade: [met 2026-08-25T05:12Z] prod facets `cityLimitsFact.status=incorporated` `cityName=Bastrop` `geoId=4805864` `etjStatus=unresolved`

4. **Named unincorporated control.** A filed rural control (Whitetail-class / Kempner 76539 parcel used in the feasibility target, or another named node) is `unincorporated` with basis citing `tx_city_boundary`. | check: same instrument as item 3 | grade: [met 2026-08-25T05:12Z] `48055:1` `status=unincorporated` `etjStatus=unresolved` basis cites `tx_city_boundary` statewide index

5. **ETJ is unresolved, not a buffer.** No derived ETJ ring, no city-limit offset, no guessed municipality. The third state is an explicit unresolved chip / typed absence. | check: code read + fixture that is outside all city polygons; violate "offset 2 miles, call it ETJ" | grade: [met] offset point is unincorporated + `etjStatus: unresolved`

6. **No atom family.** This card does not mint a city-limits or ETJ atom. No `--apply`. | check: git pathspec excludes atom writers | grade: [met] facets PIP only

## Do not

- Invent a statewide ETJ layer or buffer.
- Start P-09 footprint, P-25 CAMA, or P-80 Travis join fix.
- Collapse city-of-record (situs token) with incorporated place.
- Write the property LDT checkout.

## leave_behind

- item: full ETJ derivation when a statewide ETJ source exists
  owner: later card
  plan_row: (new later)
- item: PE inspect chip if cortex serve lands first
  owner: hauska-map isolated tree
  plan_row: P-76
