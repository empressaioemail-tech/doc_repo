# SUB-COUNTY COVERAGE AUDIT: every city, town and place in the six onboarded counties (READ ONLY)

**Lane:** COVERAGE-SUB. **Plan row:** P-182 (OPS-16). **Run:** 2026-09-13, 15:05 to 17:20 CDT.

## Snapshot

| what | value |
|---|---|
| doc_repo | `main` @ `9eef6a6c4a5c5c7e6baa363800257482b9a8a70d`, working tree dirty (integration seat checkout `P:/doc_repo`) |
| legacy-design-tools | read at `origin/main` @ `78275570d8991da882f2915160a99d5b6726c7bf`, committed 2026-09-13T14:31:45-05:00, via `git show origin/main:<path>` |
| Factory store | Neon `neondb` on `ep-round-base-au0jofwp.c-10.us-east-1.aws.neon.tech`, role `parcel_record_ro`, PostgreSQL 18.6 |
| store credential | `gcloud secrets versions access latest --secret=FACTORY_DATABASE_URL_RO --project=hauska-prod-497015` |
| roster | `_catalog/texas_roster_v1.json`, schema `t6_roster_v1`, generated 2026-08-12T16:47:05Z, last_updated 2026-08-12T21:39:21Z |
| live surface | `https://smartsite.cloud`, anonymous, 88 GETs to `/api/spine/property-atoms/<node>/facets`, all 88 HTTP 200, 20.8 s wall |
| baseline compared against | `90_operations/OPS-22_spine_architecture_map.md` section 2 |

**The read path for product code was `origin/main`, not a working tree.** The local checkout at `P:/legacy-design-tools` sits on `feat/s1-instrument-hardening` @ `10069854` from 2026-08-12 and is dirty. A working tree is a proxy, not the authoritative record, and this audit did not read one.

**The read-only role was verified by violation, not assumed.** `BEGIN; INSERT INTO parcel_record ... ;` returned verbatim:

```
ERROR:  permission denied for table parcel_record
```

That refusal is at the database, not at a code check. The role can SELECT exactly four tables: `parcel_record`, `parcel_record_cell`, `parcel_record_companion_row`, `parcel_gate_verdict`. It cannot see `tx_city_boundary`, `tx_zoning_district_staging` or `landing_parcel_jurisdiction`. Every consequence of that is recorded in COULD NOT ESTABLISH.

---

## The headline, before the tables

**The enumeration this row was created to produce already exists, per parcel, inside the serving store, and nothing ever rolled it up.** `parcel_record_cell` holds, for every parcel in the six counties, a `zoningJurisdictionKey` cell. Where no zoning layer exists for the place that parcel sits in, the cell is `refused` and its reason NAMES THE PLACE: `no tx_zoning_district_staging base layer exists for Thrall yet -- a data-acquisition gap, not a join failure`. There are **73,321 such parcels across 48 named places** in the six counties. A further 465 parcels are refused inside Elgin, where a staged layer exists and a live point-in-polygon against every published Elgin layer found zero hits, which is a different and more careful class of refusal. 73,786 refusals in total. The instrument was already honest and already specific. It refuses at the parcel and aggregates nowhere a human reads, which is how county onboarding could be called done 48 places at a time.

**The dispatch's stated premise is contradicted, and the correction matters.** The premise was that Thrall stayed invisible because we worked only from our own rosters. Thrall is in our roster. `_catalog/texas_roster_v1.json` holds Thrall as place_fips 72824, Williamson parent, probed 2026-08-12T22:14:05Z by lane Z1-central-tx-reopen, carrying a positive determination of absence with a written basis. Thrall is also in the store, named, with 487 refused parcels. Nothing was invisible. Every layer recorded the gap correctly and no layer was ever asked to add them up. That is a different defect from a missing roster and it has a different fix: a rollup and a gate, not an acquisition of knowledge we already hold.

**County onboarding is not the only wrong unit. The rail is also wrong.** Hays County is onboarded, has four cities wired in `ZONING_LAYERS`, and has four ruled setback tables. Its `setbackRules` rail is `unaccounted` for **all 54,835** of its incorporated parcels and `value` for zero of them. The setback writer has never run on Hays. That is invisible in any per-county view because Hays looks onboarded from every angle except the one that serves a customer.

**`envelopeStatus` and `buildableAreaSqFt` are `unaccounted` for 100 percent of incorporated parcels in all six counties, 611,116 of 611,116.** Never `value`, anywhere, in any place. The BUILDABLE refusal the operator saw at Thrall is universal and is not a Thrall gap.

**The deployed surface contradicts the record in both directions.** The facets payload declares `readPath: "record"` and `recordRailStates.zoningDistrict.serve: "record"`, then serves a zoning district for a parcel whose record refuses one, and denies a zoning district for a parcel whose record holds one. Details in the live surface section.

---

## Reproduce or contradict, against OPS-22 section 2

**REPRODUCED, exactly, on the counting rule OPS-22 used.** OPS-22 section 2 records 69 cities across the six counties, 23 with a zoning endpoint, split Bastrop 3/3, Caldwell 3/3, Hays 5/11, Williamson 7/14, Travis 3/18, McLennan 2/20. Counting `_catalog/texas_roster_v1.json` cities by `parent_county_fips`, and counting a zoning endpoint as a non-null `zoning_layer.source_url`:

| county | this audit, cities with a zoning source_url / cities | OPS-22 | agree |
|---|---|---|---|
| Bastrop | 3 / 3 | 3 / 3 | yes |
| Caldwell | 3 / 3 | 3 / 3 | yes |
| Hays | 5 / 11 | 5 / 11 | yes |
| Williamson | 7 / 14 | 7 / 14 | yes |
| Travis | 3 / 18 | 3 / 18 | yes |
| McLennan | 2 / 20 | 2 / 20 | yes |
| **total** | **23 / 69** | **23 / 69** | yes |

**The counting rule matters and OPS-22 does not state it.** 69 is cities by PARENT county. **72 distinct cities have land in at least one of the six counties**, because places whose parent is Falls, Guadalupe or Milam spill across the line; and because cities span county boundaries, the place-by-county pair count is **88**. Three counting rules, three different numbers, all correct. OPS-22's 69 should carry the words "by parent county" where it is read.

**A second, independent derivation confirms the 23.** The 23 cities the T6 roster probed as carrying a zoning layer on 2026-08-12, and the 23 cities the Factory serving store has parcels bound to on 2026-09-13, are the SAME 23, with nothing on either side of the difference:

`austin, bastrop, buda, cedar park, dripping springs, elgin, georgetown, hutto, kyle, lakeway, leander, liberty hill, lockhart, luling, martindale, pflugerville, robinson, round rock, san marcos, smithville, taylor, waco, woodcreek`

Two sources a month apart, different derivations, exact agreement. That is the strongest evidence in this audit and it is why the rest of the numbers can be relied on.

**What OPS-22 does not say, and is the actual finding: having an endpoint is not having coverage.** Of those 23 staged cities, only **17** are wired in `ZONING_LAYERS`, and the same 17 have a ruled setback table. Six cities have a staged zoning layer, parcels bound to it, and neither a registry entry nor a setback table.

---

## The roster question

**Roster used: `_catalog/texas_roster_v1.json`.** Chosen because it is the only roster in reach that carries a per-city zoning-layer probe record with a date and a lane, because `tx_city_boundary` is not visible to the read-only role, and because the T6 recon derived it from TxGIO City_Boundaries spatially joined to TIGER State_County rather than from our own wiring.

**Its scope is incorporated cities only: 1,223 records, all `record_type: "city"`, statewide.** CDPs, unincorporated communities and postal-only places are NOT in it. Central Texas has real named places of that kind inside the six counties, and none of them can appear in this audit. That is a roster gap, it is named here, and this row does not close it.

**A roster field that cannot be trusted.** `cities[].zoning_layer.status` disagrees with the rest of its own record for 12 of the 23. Bastrop city carries `source_url` set, `verification: "verified-live"`, `probe_notes: "live count=7125; fields=23"`, `features_staged: 7075`, and `status: "NOT-FOUND-UNKNOWN-WHY"`. Taylor is the same shape with 8,145 staged features. The status column was overwritten by the L20 factory1.5 fan at 2026-08-14T21:37:46Z and was not derived from the evidence sitting beside it in the same object. **Read `source_url` and `features_staged`; do not read `status`.**

---

## Per place, all six counties

Columns, and what each is measured from.

`zoning layer on file` is the Factory store. STAGED means at least one parcel in that place carries `zoningJurisdictionKey` kind `value`, or an inside-city-limits polygon miss. NONE, refused by name means the store refuses every parcel there with a reason naming the place. UNREPRESENTED means the place appears in no store vocabulary at all, which is a third state and is not the same as NONE.

`in ZONING_LAYERS` is `lib/cad-ingest/src/txgio/zoning-layers.ts` at LDT `origin/main`.

`ruled setback table` is registration in `SETBACK_TABLES`, `lib/adapters/src/local/setbacks/index.ts` at LDT `origin/main`. File presence alone does not count, because registration is what the serving path reads.

`parcels bound`, `parcels refused` and `parcels polygon-miss` come from `parcel_record_cell` where `rail_key='zoningJurisdictionKey'`, split by `cell_state->>'kind'` and by the place named in `cell_state->>'reason'`. Counting rule: one row per parcel per county. A city spanning two counties is counted once per county, and the county sections must never be cross-added into a place total. The ranked list further down does aggregate across counties and says so.

**`ZONING_LAYERS` entries are county-scoped, and that is why a city can read `in ZONING_LAYERS: no` in one county and `yes` in another.** Austin is registered for 48453 only, so its 411 Hays-county parcels and its 13,924 Williamson-county parcels sit outside the registry entry that covers it. San Marcos is registered for 48209 only, so its 70 Caldwell-county parcels sit outside. Elgin is the only city registered twice, once per county. The setback table is keyed by city and is not county-scoped, which is why those rows read `ruled setback table: yes` while the registry reads no.

`live surface` is one anonymous GET per place against `https://smartsite.cloud/api/spine/property-atoms/<parcelNodeId>/facets` for one real parcel in that place, 2026-09-13. Every place holding at least one parcel got a probe. McGregor has no parcel to probe and reads UNMEASURED.


### Bastrop County (48021), 5 places

| place | in roster | zoning layer on file | in ZONING_LAYERS | ruled setback table | parcels bound | parcels refused, no staged layer | parcels polygon-miss inside limits | live surface, one real parcel |
|---|---|---|---|---|---|---|---|---|
| Bastrop | yes | STAGED | yes | yes | 5775 | 0 | 44 | zoning=PDD; coverage.zoning=yes; envelope=declined / no-setback-row |
| Elgin | yes | STAGED | yes | yes | 3740 | 9 | 0 | zoning=R-2; coverage.zoning=yes; envelope=ok |
| Smithville | yes | STAGED | no | no | 2295 | 0 | 111 | zoning=SF-1; coverage.zoning=no; envelope=declined / no-zoning-stamp |
| Webberville village | yes | NONE, refused by name | no | no | 0 | 17 | 0 | zoning=null; coverage.zoning=no; envelope=declined / no-zoning-stamp |
| Mustang Ridge | yes | NONE, refused by name | no | no | 0 | 1 | 0 | zoning=null; coverage.zoning=no; envelope=declined / no-zoning-stamp |

### Caldwell County (48055), 8 places

| place | in roster | zoning layer on file | in ZONING_LAYERS | ruled setback table | parcels bound | parcels refused, no staged layer | parcels polygon-miss inside limits | live surface, one real parcel |
|---|---|---|---|---|---|---|---|---|
| Lockhart | yes | STAGED | yes | yes | 6466 | 0 | 24 | zoning=RLD; coverage.zoning=yes; envelope=ok |
| Luling | yes | STAGED | no | no | 2887 | 0 | 11 | zoning=R-1; coverage.zoning=no; envelope=declined / no-zoning-stamp |
| Martindale | yes | STAGED | no | no | 615 | 0 | 3 | zoning=MU; coverage.zoning=no; envelope=declined / no-zoning-stamp |
| Uhland | yes | NONE, refused by name | no | no | 0 | 221 | 0 | zoning=null; coverage.zoning=no; envelope=declined / no-zoning-stamp |
| Niederwald | yes | NONE, refused by name | no | no | 0 | 170 | 0 | zoning=null; coverage.zoning=no; envelope=declined / no-zoning-stamp |
| Mustang Ridge | yes | NONE, refused by name | no | no | 0 | 157 | 0 | zoning=null; coverage.zoning=no; envelope=declined / no-zoning-stamp |
| San Marcos | yes | STAGED | no | yes | 70 | 0 | 2 | zoning=P; coverage.zoning=no; envelope=declined / no-zoning-stamp |
| Staples | yes | NONE, refused by name | no | no | 0 | 1 | 0 | zoning=null; coverage.zoning=no; envelope=declined / no-zoning-stamp |

### Hays County (48209), 13 places

| place | in roster | zoning layer on file | in ZONING_LAYERS | ruled setback table | parcels bound | parcels refused, no staged layer | parcels polygon-miss inside limits | live surface, one real parcel |
|---|---|---|---|---|---|---|---|---|
| Kyle | yes | STAGED | yes | yes | 19855 | 0 | 214 | zoning=A-DA; coverage.zoning=yes; envelope=declined / setback-rule-pending |
| San Marcos | yes | STAGED | yes | yes | 18601 | 0 | 154 | zoning=MF-12; coverage.zoning=yes; envelope=declined / setback-rule-pending |
| Buda | yes | STAGED | yes | yes | 5876 | 0 | 56 | zoning=B2; coverage.zoning=no; envelope=declined / no-zoning-stamp |
| Dripping Springs | yes | STAGED | yes | yes | 3886 | 0 | 130 | zoning=SF-1; coverage.zoning=yes; envelope=no-buildable-area |
| Wimberley | yes | NONE, refused by name | no | no | 0 | 2273 | 0 | zoning=null; coverage.zoning=no; envelope=declined / no-zoning-stamp |
| Uhland | yes | NONE, refused by name | no | no | 0 | 1045 | 0 | zoning=null; coverage.zoning=no; envelope=declined / no-zoning-stamp |
| Woodcreek | yes | STAGED | no | no | 1026 | 0 | 4 | zoning=Single Family 1; coverage.zoning=no; envelope=declined / no-zoning-stamp |
| Niederwald | yes | NONE, refused by name | no | no | 0 | 727 | 0 | zoning=null; coverage.zoning=no; envelope=declined / no-zoning-stamp |
| Austin | yes | STAGED | no | yes | 411 | 0 | 12 | zoning=RR; coverage.zoning=no; envelope=declined / no-zoning-stamp |
| Mountain City | yes | NONE, refused by name | no | no | 0 | 249 | 0 | zoning=null; coverage.zoning=no; envelope=declined / no-zoning-stamp |
| Bear Creek village | yes | NONE, refused by name | no | no | 0 | 195 | 0 | zoning=null; coverage.zoning=no; envelope=declined / no-zoning-stamp |
| Hays | yes | NONE, refused by name | no | no | 0 | 117 | 0 | zoning=null; coverage.zoning=no; envelope=declined / no-zoning-stamp |
| Creedmoor | yes | NONE, refused by name | no | no | 0 | 4 | 0 | zoning=null; coverage.zoning=no; envelope=declined / no-zoning-stamp |

### McLennan County (48309), 21 places

| place | in roster | zoning layer on file | in ZONING_LAYERS | ruled setback table | parcels bound | parcels refused, no staged layer | parcels polygon-miss inside limits | live surface, one real parcel |
|---|---|---|---|---|---|---|---|---|
| Waco | yes | STAGED | yes | yes | 47679 | 0 | 1014 | zoning=M-2; coverage.zoning=yes; envelope=declined / setback-rule-pending |
| Hewitt | yes | NONE, refused by name | no | no | 0 | 5868 | 0 | zoning=null; coverage.zoning=no; envelope=declined / no-zoning-stamp |
| Robinson | yes | STAGED | no | no | 5686 | 0 | 42 | zoning=AG; coverage.zoning=no; envelope=declined / no-zoning-stamp |
| Woodway | yes | NONE, refused by name | no | no | 0 | 4523 | 0 | zoning=null; coverage.zoning=no; envelope=declined / no-zoning-stamp |
| Bellmead | yes | NONE, refused by name | no | no | 0 | 4352 | 0 | zoning=null; coverage.zoning=no; envelope=declined / no-zoning-stamp |
| Lacy-Lakeview | yes | NONE, refused by name | no | no | 0 | 2628 | 0 | zoning=null; coverage.zoning=no; envelope=declined / no-zoning-stamp |
| West | yes | NONE, refused by name | no | no | 0 | 1589 | 0 | zoning=null; coverage.zoning=no; envelope=declined / no-zoning-stamp |
| Mart | yes | NONE, refused by name | no | no | 0 | 1495 | 0 | zoning=null; coverage.zoning=no; envelope=declined / no-zoning-stamp |
| Bruceville-Eddy | yes | NONE, refused by name | no | no | 0 | 1034 | 0 | zoning=null; coverage.zoning=no; envelope=declined / no-zoning-stamp |
| Lorena | yes | NONE, refused by name | no | no | 0 | 1012 | 0 | zoning=null; coverage.zoning=no; envelope=declined / no-zoning-stamp |
| Moody | yes | NONE, refused by name | no | no | 0 | 1000 | 0 | zoning=null; coverage.zoning=no; envelope=declined / no-zoning-stamp |
| Gholson | yes | NONE, refused by name | no | no | 0 | 840 | 0 | zoning=null; coverage.zoning=no; envelope=declined / no-zoning-stamp |
| Beverly Hills | yes | NONE, refused by name | no | no | 0 | 838 | 0 | zoning=R-2; coverage.zoning=yes; envelope=declined / setback-rule-pending |
| Riesel | yes | NONE, refused by name | no | no | 0 | 740 | 0 | zoning=null; coverage.zoning=no; envelope=declined / no-zoning-stamp |
| Crawford | yes | NONE, refused by name | no | no | 0 | 459 | 0 | zoning=null; coverage.zoning=no; envelope=declined / no-zoning-stamp |
| Hallsburg | yes | NONE, refused by name | no | no | 0 | 335 | 0 | zoning=null; coverage.zoning=no; envelope=declined / no-zoning-stamp |
| Leroy | yes | NONE, refused by name | no | no | 0 | 320 | 0 | zoning=null; coverage.zoning=no; envelope=declined / no-zoning-stamp |
| Ross | yes | NONE, refused by name | no | no | 0 | 242 | 0 | zoning=null; coverage.zoning=no; envelope=declined / no-zoning-stamp |
| Golinda | yes | NONE, refused by name | no | no | 0 | 95 | 0 | zoning=null; coverage.zoning=no; envelope=declined / no-zoning-stamp |
| Valley Mills | yes | NONE, refused by name | no | no | 0 | 41 | 0 | zoning=null; coverage.zoning=no; envelope=declined / no-zoning-stamp |
| McGregor | yes | UNREPRESENTED | no | no | 0 | 0 | 0 | UNMEASURED |

### Travis County (48453), 24 places

| place | in roster | zoning layer on file | in ZONING_LAYERS | ruled setback table | parcels bound | parcels refused, no staged layer | parcels polygon-miss inside limits | live surface, one real parcel |
|---|---|---|---|---|---|---|---|---|
| Austin | yes | STAGED | yes | yes | 203218 | 0 | 861 | zoning=LA; coverage.zoning=yes; envelope=declined / setback-rule-pending |
| Pflugerville | yes | STAGED | yes | yes | 20020 | 0 | 118 | zoning=R; coverage.zoning=yes; envelope=ok |
| Lago Vista | yes | NONE, refused by name | no | no | 0 | 12745 | 0 | zoning=null; coverage.zoning=no; envelope=declined / no-zoning-stamp |
| Lakeway | yes | STAGED | no | no | 8202 | 0 | 57 | zoning=R-1*; coverage.zoning=no; envelope=declined / no-zoning-stamp |
| Manor | yes | NONE, refused by name | no | no | 0 | 8081 | 0 | zoning=null; coverage.zoning=no; envelope=declined / no-zoning-stamp |
| Leander | yes | STAGED | no | yes | 5165 | 0 | 27 | zoning=SFR; coverage.zoning=no; envelope=declined / no-zoning-stamp |
| Jonestown | yes | NONE, refused by name | no | no | 0 | 2769 | 0 | zoning=null; coverage.zoning=no; envelope=declined / no-zoning-stamp |
| Cedar Park | yes | STAGED | no | yes | 2378 | 0 | 11 | zoning=PD; coverage.zoning=no; envelope=declined / no-zoning-stamp |
| Bee Cave | yes | NONE, refused by name | no | no | 0 | 2261 | 0 | zoning=null; coverage.zoning=no; envelope=declined / no-zoning-stamp |
| Mustang Ridge | yes | NONE, refused by name | no | no | 0 | 1826 | 0 | zoning=null; coverage.zoning=no; envelope=declined / no-zoning-stamp |
| Elgin | yes | STAGED | yes | yes | 1250 | 456 | 0 | zoning=R-3; coverage.zoning=no; envelope=declined / no-zoning-stamp |
| West Lake Hills | yes | NONE, refused by name | no | no | 0 | 1543 | 0 | zoning=null; coverage.zoning=no; envelope=declined / no-zoning-stamp |
| Briarcliff village | yes | NONE, refused by name | no | no | 0 | 1329 | 0 | zoning=null; coverage.zoning=no; envelope=declined / no-zoning-stamp |
| Point Venture village | yes | NONE, refused by name | no | no | 0 | 1086 | 0 | zoning=null; coverage.zoning=no; envelope=declined / no-zoning-stamp |
| The Hills village | yes | NONE, refused by name | no | no | 0 | 985 | 0 | zoning=null; coverage.zoning=no; envelope=declined / no-zoning-stamp |
| Rollingwood | yes | NONE, refused by name | no | no | 0 | 603 | 0 | zoning=null; coverage.zoning=no; envelope=declined / no-zoning-stamp |
| Volente village | yes | NONE, refused by name | no | no | 0 | 497 | 0 | zoning=null; coverage.zoning=no; envelope=declined / no-zoning-stamp |
| Sunset Valley | yes | NONE, refused by name | no | no | 0 | 332 | 0 | zoning=null; coverage.zoning=no; envelope=declined / no-zoning-stamp |
| Creedmoor | yes | NONE, refused by name | no | no | 0 | 331 | 0 | zoning=null; coverage.zoning=no; envelope=declined / no-zoning-stamp |
| Round Rock | yes | STAGED | no | yes | 321 | 0 | 3 | zoning=PUD; coverage.zoning=no; envelope=declined / no-zoning-stamp |
| San Leanna village | yes | NONE, refused by name | no | no | 0 | 288 | 0 | zoning=null; coverage.zoning=no; envelope=declined / no-zoning-stamp |
| Webberville village | yes | NONE, refused by name | no | no | 0 | 228 | 0 | zoning=null; coverage.zoning=no; envelope=declined / no-zoning-stamp |
| Buda | yes | STAGED | no | yes | 6 | 0 | 1 | zoning=PD; coverage.zoning=no; envelope=declined / no-zoning-stamp |
| Coupland | yes | NONE, refused by name | no | no | 0 | 5 | 0 | zoning=null; coverage.zoning=no; envelope=declined / no-zoning-stamp |

### Williamson County (48491), 17 places

| place | in roster | zoning layer on file | in ZONING_LAYERS | ruled setback table | parcels bound | parcels refused, no staged layer | parcels polygon-miss inside limits | live surface, one real parcel |
|---|---|---|---|---|---|---|---|---|
| Georgetown | yes | STAGED | yes | yes | 38898 | 0 | 117 | zoning=RS; coverage.zoning=yes; envelope=ok |
| Round Rock | yes | STAGED | yes | yes | 38677 | 0 | 162 | zoning=SF2; coverage.zoning=yes; envelope=ok |
| Leander | yes | STAGED | yes | yes | 26482 | 0 | 105 | zoning=SFE; coverage.zoning=no; envelope=declined / no-zoning-stamp |
| Cedar Park | yes | STAGED | yes | yes | 22284 | 0 | 83 | zoning=OG; coverage.zoning=yes; envelope=ok |
| Hutto | yes | STAGED | yes | yes | 15805 | 0 | 691 | zoning=AG; coverage.zoning=yes; envelope=ok |
| Austin | yes | STAGED | no | yes | 13924 | 0 | 18 | zoning=RR; coverage.zoning=no; envelope=declined / no-zoning-stamp |
| Taylor | yes | STAGED | yes | yes | 8504 | 0 | 37 | zoning=P4; coverage.zoning=no; envelope=declined / no-zoning-stamp |
| Liberty Hill | yes | STAGED | yes | yes | 3061 | 0 | 53 | zoning=SF3; coverage.zoning=no; envelope=declined / no-zoning-stamp |
| Jarrell | yes | NONE, refused by name | no | no | 0 | 2817 | 0 | zoning=null; coverage.zoning=no; envelope=declined / no-zoning-stamp |
| Granger | yes | NONE, refused by name | no | no | 0 | 784 | 0 | zoning=null; coverage.zoning=no; envelope=declined / no-zoning-stamp |
| Bartlett | yes | NONE, refused by name | no | no | 0 | 672 | 0 | zoning=null; coverage.zoning=no; envelope=declined / no-zoning-stamp |
| Florence | yes | NONE, refused by name | no | no | 0 | 549 | 0 | zoning=null; coverage.zoning=no; envelope=declined / no-zoning-stamp |
| Thrall | yes | NONE, refused by name | no | no | 0 | 487 | 0 | zoning=null; coverage.zoning=no; envelope=declined / no-zoning-stamp |
| Coupland | yes | NONE, refused by name | no | no | 0 | 297 | 0 | zoning=null; coverage.zoning=no; envelope=declined / no-zoning-stamp |
| Weir | yes | NONE, refused by name | no | no | 0 | 214 | 0 | zoning=null; coverage.zoning=no; envelope=declined / no-zoning-stamp |
| Pflugerville | yes | STAGED | no | yes | 97 | 0 | 5 | zoning=SF-S; coverage.zoning=no; envelope=declined / no-zoning-stamp |
| Thorndale | yes | NONE, refused by name | no | no | 0 | 4 | 0 | zoning=null; coverage.zoning=no; envelope=declined / no-zoning-stamp |

---

## Ranked: the largest places with no zoning coverage

Ranking is by parcel count, not population. The roster carries no population field, so parcel count is the only denominator available, and it is the better one for this decision anyway: it is what the surface will refuse on. Counts here AGGREGATE a place across every county it touches, which is a different counting rule from the per-county tables above. Mustang Ridge at 1,984 is 1 in Bastrop plus 157 in Caldwell plus 1,826 in Travis.

Every row below has zero parcels bound to any zoning layer. This is the list to act on.

| rank | place | county or counties | parcels with NO zoning layer | ruled setback table | what the deployed surface returns |
|---|---|---|---|---|---|
| 1 | Lago Vista | Travis | 12745 | no | zoning=null, envelope=declined / no-zoning-stamp |
| 2 | Manor | Travis | 8081 | no | zoning=null, envelope=declined / no-zoning-stamp |
| 3 | Hewitt | McLennan | 5868 | no | zoning=null, envelope=declined / no-zoning-stamp |
| 4 | Woodway | McLennan | 4523 | no | zoning=null, envelope=declined / no-zoning-stamp |
| 5 | Bellmead | McLennan | 4352 | no | zoning=null, envelope=declined / no-zoning-stamp |
| 6 | Jarrell | Williamson | 2817 | no | zoning=null, envelope=declined / no-zoning-stamp |
| 7 | Jonestown | Travis | 2769 | no | zoning=null, envelope=declined / no-zoning-stamp |
| 8 | Lacy-Lakeview | McLennan | 2628 | no | zoning=null, envelope=declined / no-zoning-stamp |
| 9 | Wimberley | Hays | 2273 | no | zoning=null, envelope=declined / no-zoning-stamp |
| 10 | Bee Cave | Travis | 2261 | no | zoning=null, envelope=declined / no-zoning-stamp |
| 11 | Mustang Ridge | Bastrop, Caldwell, Travis | 1984 | no | zoning=null, envelope=declined / no-zoning-stamp |
| 12 | West | McLennan | 1589 | no | zoning=null, envelope=declined / no-zoning-stamp |
| 13 | West Lake Hills | Travis | 1543 | no | zoning=null, envelope=declined / no-zoning-stamp |
| 14 | Mart | McLennan | 1495 | no | zoning=null, envelope=declined / no-zoning-stamp |
| 15 | Briarcliff village | Travis | 1329 | no | zoning=null, envelope=declined / no-zoning-stamp |
| 16 | Uhland | Caldwell, Hays | 1266 | no | zoning=null, envelope=declined / no-zoning-stamp |
| 17 | Point Venture village | Travis | 1086 | no | zoning=null, envelope=declined / no-zoning-stamp |
| 18 | Bruceville-Eddy | McLennan | 1034 | no | zoning=null, envelope=declined / no-zoning-stamp |
| 19 | Lorena | McLennan | 1012 | no | zoning=null, envelope=declined / no-zoning-stamp |
| 20 | Moody | McLennan | 1000 | no | zoning=null, envelope=declined / no-zoning-stamp |
| 21 | The Hills village | Travis | 985 | no | zoning=null, envelope=declined / no-zoning-stamp |
| 22 | Niederwald | Caldwell, Hays | 897 | no | zoning=null, envelope=declined / no-zoning-stamp |
| 23 | Gholson | McLennan | 840 | no | zoning=null, envelope=declined / no-zoning-stamp |
| 24 | Beverly Hills | McLennan | 838 | no | zoning=R-2, envelope=declined / setback-rule-pending |
| 25 | Granger | Williamson | 784 | no | zoning=null, envelope=declined / no-zoning-stamp |
| 26 | Riesel | McLennan | 740 | no | zoning=null, envelope=declined / no-zoning-stamp |
| 27 | Bartlett | Williamson | 672 | no | zoning=null, envelope=declined / no-zoning-stamp |
| 28 | Rollingwood | Travis | 603 | no | zoning=null, envelope=declined / no-zoning-stamp |
| 29 | Florence | Williamson | 549 | no | zoning=null, envelope=declined / no-zoning-stamp |
| 30 | Volente village | Travis | 497 | no | zoning=null, envelope=declined / no-zoning-stamp |
| 31 | Thrall | Williamson | 487 | no | zoning=null, envelope=declined / no-zoning-stamp |
| 32 | Crawford | McLennan | 459 | no | zoning=null, envelope=declined / no-zoning-stamp |
| 33 | Creedmoor | Hays, Travis | 335 | no | zoning=null, envelope=declined / no-zoning-stamp |
| 34 | Hallsburg | McLennan | 335 | no | zoning=null, envelope=declined / no-zoning-stamp |
| 35 | Sunset Valley | Travis | 332 | no | zoning=null, envelope=declined / no-zoning-stamp |
| 36 | Leroy | McLennan | 320 | no | zoning=null, envelope=declined / no-zoning-stamp |
| 37 | Coupland | Travis, Williamson | 302 | no | zoning=null, envelope=declined / no-zoning-stamp |
| 38 | San Leanna village | Travis | 288 | no | zoning=null, envelope=declined / no-zoning-stamp |
| 39 | Mountain City | Hays | 249 | no | zoning=null, envelope=declined / no-zoning-stamp |
| 40 | Webberville village | Bastrop, Travis | 245 | no | zoning=null, envelope=declined / no-zoning-stamp |
| 41 | Ross | McLennan | 242 | no | zoning=null, envelope=declined / no-zoning-stamp |
| 42 | Weir | Williamson | 214 | no | zoning=null, envelope=declined / no-zoning-stamp |
| 43 | Bear Creek village | Hays | 195 | no | zoning=null, envelope=declined / no-zoning-stamp |
| 44 | Hays | Hays | 117 | no | zoning=null, envelope=declined / no-zoning-stamp |
| 45 | Golinda | McLennan | 95 | no | zoning=null, envelope=declined / no-zoning-stamp |
| 46 | Valley Mills | McLennan | 41 | no | zoning=null, envelope=declined / no-zoning-stamp |
| 47 | Thorndale | Williamson | 4 | no | zoning=null, envelope=declined / no-zoning-stamp |
| 48 | Staples | Caldwell | 1 | no | zoning=null, envelope=declined / no-zoning-stamp |
| 49 | McGregor | McLennan | UNREPRESENTED, zero rows of any kind | no | UNMEASURED |

**McGregor is the worst row and it is last because it cannot be counted.** McGregor is an incorporated McLennan County city in the roster, and it appears in NO store vocabulary: no bound parcel, no refusal naming it, no polygon miss. Thrall at least produced 487 named refusals. McGregor produced nothing. Two mechanisms explain that and this audit eliminated neither. Either the city-boundary layer the binder uses has no McGregor polygon, so McGregor's in-city parcels fall through to `not-applicable` carrying the reason `unincorporated parcel, county does not zone land outside city limits`, which would be a false statement written into the record for an incorporated city; or McGregor's parcels are absent from the store entirely. The instrument that settles it is a `tx_city_boundary` enumeration for FIPS 48309, which this credential cannot reach. Note that 4,033 parcels carrying situs `MCGREGOR, TX` are flagged `incorporated = false`, which is consistent with the first mechanism and does not prove it, because a mailing city is not a jurisdiction.

---

## Staged zoning, no setback table: six cities, 20,711 parcels

These six have a live zoning layer, parcels bound to it, a real district stamped on each parcel, and no ruled setback table and no `ZONING_LAYERS` entry. They are the cheapest wins on this list, because acquisition is already done and what is missing is a table and a registry line.

| place | county | parcels bound to a staged zoning layer | setbackRules cells written absent-verified | live surface |
|---|---|---|---|---|
| Lakeway | Travis | 8202 | 8259 | zoning=R-1*; coverage.zoning=no; envelope=declined / no-zoning-stamp |
| Robinson | McLennan | 5686 | 5728 | zoning=AG; coverage.zoning=no; envelope=declined / no-zoning-stamp |
| Luling | Caldwell | 2887 | 2898 | zoning=R-1; coverage.zoning=no; envelope=declined / no-zoning-stamp |
| Smithville | Bastrop | 2295 | 2406 | zoning=SF-1; coverage.zoning=no; envelope=declined / no-zoning-stamp |
| Woodcreek | Hays | 1026 | 0 | zoning=Single Family 1; coverage.zoning=no; envelope=declined / no-zoning-stamp |
| Martindale | Caldwell | 615 | 618 | zoning=MU; coverage.zoning=no; envelope=declined / no-zoning-stamp |

Woodcreek reads 0 setback cells written `absent-verified` only because Hays County's setback writer has never run at all. Its 1,026 parcels are `unaccounted`, not verified-absent, and those are different states.

---

## What the live surface actually does

All 88 probes returned HTTP 200 anonymously. All 88 declared `readPath: "record"`. `bakedAt` on the payloads spreads across 2026-07 (35 of 88) and 2026-08 (53 of 88); none is from September, and the record cells this audit read were written 2026-09-02 through 2026-09-10.

**Envelope outcomes across the 88.** 7 returned `ok`. 1 returned `no-buildable-area`. 5 declined `setback-rule-pending`. 1 declined `no-setback-row`. **74 declined `no-zoning-stamp`**, including 54 of the 55 no-layer places, which is the surface behaving exactly correctly, and 20 bound places, which is not.

**Divergence one: the surface asserts a district the record refuses.** Beverly Hills, McLennan, parcel `48309:161056`. The record says:

```
zoningDistrict        | {"kind": "refused", "reason": "no tx_zoning_district_staging base layer exists for Beverly Hills yet -- a data-acquisition gap, not a join failure"}
zoningJurisdictionKey | {"kind": "refused", "reason": "no tx_zoning_district_staging base layer exists for Beverly Hills yet -- a data-acquisition gap, not a join failure"}
```

The surface returns `facets.zoning = {"district": "R-2"}`, `facetCoverage.zoning = true`, `readPath: "record"`, `recordRailStates.zoningDistrict.serve = "record"`, `bakedAt: 2026-07-24T19:33:06.683Z`. A refusal in the canonical record is being served to a customer as a zoning district. This is the dangerous direction.

**Divergence two: the surface denies a district the record holds.** Smithville, Bastrop, parcel `48021:103265`. The record says `zoningDistrict = {"kind":"value","value":"SF-1","source":"tx_zoning_district_staging","vintage":"2026-09-02T15:53:23.557Z"}`. The surface serves `facets.zoning = {"district": "SF-1"}` and, in the same payload, `facetCoverage.zoning = false` and an envelope declining `no-zoning-stamp` with the disclosure `No zoning district observed for parcel, honest absence, no fallback district invented`. One payload both serves and denies the same district. This shape appears in 20 of the 33 bound-city probes.

**Mechanism.** The reading this audit favours is that the zoning facet is composed from the bake, whose age the payload states, while `facetCoverage` and the envelope are computed from a different read, and the `readPath` and `recordRailStates` labels bind neither. The competing mechanism, that production reads a different Factory database or branch than `FACTORY_DATABASE_URL_RO`, was NOT eliminated from this seat and is in COULD NOT ESTABLISH. It is weakened but not killed by Thrall, where surface and record agree on a refusal.

**Either way the declaration is the defect.** `recordRailStates.zoningDistrict.serve = "record"` is a claim the payload makes about itself that at least one probe falsifies. A rail-state declaration nothing enforces is a presence-shaped field, and this is the second time this program has found one (`has_writer` is hand-declared, same shape).

---

## Two states collapsed into one kind

`zoningJurisdictionKey` kind `not-applicable` carries two populations that a consumer cannot separate without parsing the prose in `reason`:

1. **Genuinely unincorporated**, reason `unincorporated parcel, county does not zone land outside city limits`. 370,289 parcels across the six.
2. **Inside a wired city's limits but matching no polygon in that city's staged layer.** 4,170 parcels across 30 place-county pairs, led by Waco 1,014, Austin in Travis 861, Hutto 691, Kyle 214, Round Rock in Williamson 162.

Population two is a coverage hole encoded as `not-applicable`, which reads to every downstream consumer as "the rule does not apply here". The reasons are honest and specific, and some carry a declared-complete basis (Hutto's says the layer is complete at 95.81 percent parcel coverage, so a miss is genuinely unzoned land). The defect is that the KIND does not distinguish them, so nothing can count population two without a regex.

An initial read of the cross-tab looked like a flat contradiction, 4,170 parcels flagged `incorporated = true` while carrying a `not-applicable` cell whose reason says `unincorporated`. That read was wrong: the reason strings differ by population. It is recorded here because catching it required pulling the reason strings rather than trusting the kind, which is the same move the rest of this audit turns on.

---

## `absent-verified` on setbacks means two different things

`setbackRules` cells written `absent-verified` carry a basis. Two distinct findings appear:

- `no ruled setback table exists for <city>-tx`, 88,620 parcels across 53 place-county pairs and 49 distinct places. This is a claim about OUR coverage, not about the world. Lakeway, Hewitt, Lago Vista and the rest all have setbacks in their ordinances.
- `SETBACK_ROUTER_NOT_A_DISTRICT`, 111,948 parcels (Bastrop 3,094, Caldwell 1,051, McLennan 10,166, Travis 60,115, Williamson 37,522). The parcel has a stamped code the router does not recognise as a district. The two classes sum to 200,568, which is exactly the county-level `absent-verified` total, so the split is complete and nothing is unaccounted for between them.

Both are `absent-verified`, which ENFORCEMENT defines as a claim that something looked. Something did look, so the label is not a lie. But `we have no table for this city` and `this code is not a district` are different problems with different owners, and `absent-verified` is a third thing again from `unaccounted`. Hays shows why the distinction is load bearing: Hays writes `unaccounted` for all 54,835 of its incorporated parcels, so Hays appears in NEITHER of the lists above and would be scored as having no setback problem by any instrument that counts `absent-verified`.

---

## Rail state by county, all incorporated parcels

Counting rule: every parcel row in `parcel_record` for that county FIPS, split by the `cell_state->>'kind'` of the named rail. `not-applicable` on these rails is written at row creation for unincorporated parcels per `UNINCORPORATED_NOT_APPLICABLE_RAIL_KEYS`, so the incorporated population is the total minus the `not-applicable` block.

| county | parcels | incorporated | zoningDistrict value | zoningDistrict refused | setbackRules value | setbackRules absent-verified | setbackRules unaccounted | envelopeStatus value |
|---|---|---|---|---|---|---|---|---|
| Bastrop 48021 | 62,256 | 11,992 | 11,810 | 27 | 6,421 | 5,518 | 0 | 0 |
| Caldwell 48055 | 24,988 | 10,627 | 10,038 | 549 | 5,485 | 5,116 | 0 | 0 |
| Hays 48209 | 116,420 | 54,835 | 49,655 | 4,610 | 0 | 0 | 54,835 | 0 |
| McLennan 48309 | 114,254 | 81,832 | 53,365 | 27,411 | 37,513 | 43,305 | 0 | 0 |
| Travis 48453 | 380,917 | 277,003 | 240,560 | 35,365 | 172,243 | 103,283 | 0 | 0 |
| Williamson 48491 | 282,570 | 174,827 | 167,732 | 5,824 | 130,210 | 43,346 | 0 | 0 |
| **total** | **981,405** | **611,116** | **533,160** | **73,786** | **351,872** | **200,568** | **54,835** | **0** |

Three things this table says that a per-county onboarding view cannot.

**McLennan refuses zoning on 27,411 of its 81,832 incorporated parcels, 33.5 percent.** It is the worst county on this measure by a wide margin and it is nominally onboarded.

**Hays is the only county whose setback rail was never written.** Its 54,835 incorporated parcels are `unaccounted`, which is legitimate at rest and fatal at publish, and the surface is publishing.

**`envelopeStatus` is `value` for zero parcels in all six counties.** 611,116 incorporated parcels, zero stamped envelopes. The `buildableAreaSqFt` rail is identical.

---

## COULD NOT ESTABLISH

**`landing_parcel_jurisdiction` was never read.** The dispatch names it as the parcel-binding column. `parcel_record_ro` cannot see it. This audit substituted `parcel_record_cell.zoningJurisdictionKey`, which is the SERVING binding and is the stronger instrument for the question asked, but it is a DIFFERENT instrument and the two have not been reconciled. If they disagree, that disagreement is a free finding and nobody has looked for it. Settling it needs a role that can read `landing_parcel_jurisdiction`.

**`tx_city_boundary` was never read.** OPS-22's own 69-city figure comes from it. This audit reproduced 69 from a different source (`texas_roster_v1.json`), so the two agree, but `tx_city_boundary` itself was not enumerated and the 69 was not confirmed at its own source.

**`tx_zoning_district_staging` was never read.** Staging presence was inferred from parcels bound to it, which is a positive determination in one direction only: a city with a staged layer that has zero parcels bound would read to this audit as having no layer. No such city was found, but none was ruled out either.

**Whether production reads this Factory database.** The surface-versus-record divergences could be explained by a different database or branch behind production's record read. This seat holds one read-only credential and cannot enumerate what production is bound to. Settling it needs the serving service's own secret binding read by field name from the deployed revision.

**CDPs, unincorporated communities and postal-only places.** Out of scope of the only roster available. The dispatch asked for "postal place" and this audit cannot deliver that class. `parcel_record_cell.situsAddress` carries a mailing city per parcel and would enumerate it, but a mailing city is not a jurisdiction and building that list would have invited exactly the mis-reading this audit rejected at McGregor.

**Population.** No roster in reach carries it. Ranking is by parcel count and says so.

**Whether any of the 48 refused places actually publishes a zoning layer we have not found.** This audit measured OUR state, not the world's. The T6 roster probed these cities on 2026-08-12 and recorded `NOT-FOUND-UNKNOWN-WHY`, which under the seven-value taxonomy explicitly means "re-enters the queue", not "does not exist". A month has passed. Nothing here is evidence that Lago Vista, Manor, Hewitt or Woodway lack a published zoning layer; the evidence is only that we have not staged one.

**`situsAddress` sentinels.** Sample addresses returned `, ,` and `, TX` for several places. That defect is known and out of scope here, but it means any future attempt to enumerate places from situs will need to handle it.

---

## Leave behind

Nothing. This lane wrote four files into `_inbox/` and read everything else: this audit, `2026-09-13_coverage-sub_cp1.json`, `2026-09-13_coverage-sub_cp2.json` and `2026-09-13_coverage-sub_close.json`. All four are left uncommitted, because doc_repo commits are planner-owned. No branch, no checkout, no commit, no database write, no deploy.
