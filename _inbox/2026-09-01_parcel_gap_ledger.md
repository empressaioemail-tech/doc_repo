# Parcel-gap ledger

**Lane:** PARCEL-GAP-LEDGER (F-01)
**Seat:** property, claiming from integration `P:/doc_repo` `main` `9453bce`
**Claim:** until 2026-09-01T21:14:33.263Z
**Reads:** READ-ONLY. `SET default_transaction_read_only = on`. No `--apply`. No factory tree writes.
**Snapshot:** FACTORY_DATABASE_URL / neondb measured 2026-09-01T19:55:07.526Z through 20:03:27Z. PRODUCTION_NEONDB_URL / neondb measured 2026-09-01T19:55:08.533Z, 19:59:05Z, 20:07:36Z, 20:08:10Z.
**Engine pin:** PARCEL_RECORD_RAIL_COUNT 65 at ENGINE_SHA `22e71e1c18ec6bcefe590b97d36093ae3849a4fc`. Image not rebuilt.
**Instruments:** `_inbox/2026-09-01_parcel_gap_ledger_factory.json`, `_prod.json`, `_flood.json`, `_flood_ao.json`, `_trace.json`.

Program truth holds: 981,405 landing parcels times 65 rails. Store COUNT is 981,407 because two leftover 52-rail Bastrop orphans remain. Cells on landing-matched rows are 63,791,325. Store cells including leftovers are 63,791,429. `absent-verified` is 0 everywhere. NA on in-city is 0. Publish gate REFUSE on every county.

## 1. Census

Counting rule: `parcel_record` / `parcel_record_cell` on the Factory store, grouped by `county_fips`. Landing denominators from `landing_parcel_jurisdiction` on PRODUCTION neondb, method=ring for all six. Cells = 65 times landing-matched records. A row with cell count other than 65 is an orphan, listed, not deleted.

| county | name | landing | store records | in-city | uninc | unresolved | cells | value | unaccounted | not-applicable | absent-verified | cells/place |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 48021 | Bastrop | 62256 | 62258 | 11992 | 50264 | 2 | 4046744 | 751286 | 2390706 | 904752 | 0 | 62256 at 65; 2 at 52 |
| 48055 | Caldwell | 24988 | 24988 | 10627 | 14361 | 0 | 1624220 | 370650 | 995072 | 258498 | 0 | 24988 at 65 |
| 48209 | Hays | 116420 | 116420 | 54835 | 61585 | 0 | 7567300 | 1479458 | 4979312 | 1108530 | 0 | 116420 at 65 |
| 48309 | McLennan | 114254 | 114254 | 81832 | 32422 | 0 | 7426510 | 1179800 | 5663114 | 583596 | 0 | 114254 at 65 |
| 48453 | Travis | 380917 | 380917 | 277003 | 103914 | 0 | 24759605 | 5069767 | 17819386 | 1870452 | 0 | 380917 at 65 |
| 48491 | Williamson | 282570 | 282570 | 174827 | 107743 | 0 | 18367050 | 1966563 | 14461113 | 1939374 | 0 | 282570 at 65 |
| **sum** | | **981405** | **981407** | **611116** | **370289** | **2** | **63791429** | **10817524** | **46308703** | **6665202** | **0** | |

Landing 62256+24988+116420+114254+380917+282570 = 981405. Dispatch "52 x records" is superseded by the rails-v2 addendum. The 52-rail leftover pair is the only `!= 65` population.

County x rail x kind is in `_inbox/2026-09-01_parcel_gap_ledger_factory.json` `counties[].census`. Every rail is present on every landing-matched row.

## 2. Not-applicable audit

Module contract: `UNINCORPORATED_NOT_APPLICABLE_RAIL_KEYS` is frozen at 18 v1 members. `auditNotApplicableCells` requires NA = 18 times unincorporated, integer, zero on in-city, zero on unresolved.

Live: 18 rails, each stamped on every unincorporated landing row, reason string `unincorporated parcel — county does not zone land outside city limits`. NA on in-city = 0. NA on unresolved = 0. Rails per unincorporated parcel = 18.00 on every county.

| county | NA cells | unincorporated | NA / uninc |
|---|---|---|---|
| 48021 | 904752 | 50264 | 18.00 |
| 48055 | 258498 | 14361 | 18.00 |
| 48209 | 1108530 | 61585 | 18.00 |
| 48309 | 583596 | 32422 | 18.00 |
| 48453 | 1870452 | 103914 | 18.00 |
| 48491 | 1939374 | 107743 | 18.00 |

The 21.24 anomaly is a defect in the 52-rail deterministic proof (`_inbox/2026-09-01_parcel-record_bastrop_proof.json`), not in the live store. That proof instantiated 77,799 CAD parcels (not landing 62,256), wrote NA 1,067,821, then divided by landing unincorporated 50,264. 1,067,821 / 50,264 = 21.24. It mixed the CAD universe with the landing denominator. Do not widen NA to close it. The live audit passes as an integer 18.

`maxImperviousCoverPct` and `treeProtection` are v2 zoning-envelope rails and are **not** on the frozen NA list. They stay unaccounted on unincorporated parcels. That is the intended freeze, not a miss.

## 3. Measured beside derived

Bastrop derived claim was 864,681 cells moved on CAD ingest, computed offline against 77,799 CAD parcels times 52 rails.

Live Factory, 48021, `cell_state->>'source' = 'cad_property'` and kind=value: **689,028** cells. Delta versus 864,681 is **175,653**. The derived figure counted CAD parcels that have no landing row. Landing-matched CAD ingest is 689,028 / 62,256 ≈ 11.07 value cells per parcel. Value minus CAD-source on Bastrop is 751,286 − 689,028 = 62,258, exactly one instantiate rail (`countyFips`) per store row including leftovers.

Program-wide CAD-source value cells: 9,836,117.

## 4. Publish-gate verdict

Expected REFUSE everywhere. Live rails are derived (`kind` in value | absent-verified | refused), not the static 65. Declared-ahead for the gate is the complement of that derived live set. The 13 rails declared ahead in v2 must still be printed:

owner, valueHistory, salesHistory, publicRecordRefs, ossf, utilityService, agValuation, mineralRights, hoaDeedRestrictions, overlayDistricts, schoolDistrict, maxImperviousCoverPct, treeProtection

Those 13 have zero earned cells. So do flood, wells, zoningDistrict, cityLimits, and the rest of the companion/spine set. The derived exclusion list is therefore larger than 13. Coverage figures must exclude the derived declared-ahead set, not only the static 13.

Per-county live CAD-ish rails (plus `countyFips`) and unaccounted remaining on those live rails:

| county | live earned rails | unaccounted still on live rails | verdict |
|---|---|---|---|
| 48021 | 15 (no livingAreaSqft; assessedValue earned on 1 leftover only) | assessed almost all; several situs/yearBuilt holes | REFUSE |
| 48055 | 16 including livingAreaSqft | living 11713 among landing; other CAD-nulls | REFUSE |
| 48209 | 16 including livingAreaSqft | living 63202 among landing; other CAD-nulls | REFUSE |
| 48309 | 11 (no acres, assessed, yearBuilt, living) | assessed/living/acres 114254 | REFUSE |
| 48453 | 15 (no living, no yearBuilt) | living 380917; yearBuilt 380917 | REFUSE |
| 48491 | 7 (acres, apn, countyFips, legal, market, situsAddress) | market 11406; legal 16; situsAddress 5 | REFUSE |

McLennan-shaped counties refuse forever until a cad-null-verified semantic exists, because `ingestCadOntoRecords` never emits `absent-verified`.

## 5. Orphan census

Only Bastrop. Deletion is operator-gated. List, never delete.

| place_key | cells | incorporated | instantiated_at | in landing |
|---|---|---|---|---|
| 48021:0 | 52 | null | 2026-09-01T18:15:44.893Z | no (landing forbids prop_id `0`) |
| 48021:10005 | 52 | null | 2026-09-01T18:15:44.893Z | no |

48021:0 is the Travis-shaped sentinel key appearing in Bastrop from the sample. 48021:10005 carries the one Bastrop `assessedValue` value cell and the leftover improvement $0. Naive `COUNT(*)` on 48021 is 62258, not 62256.

## 6. Non-numeric prop_id

Counting rule: `landing_parcel_jurisdiction.prop_id !~ '^[0-9]+$'`.

| county | numeric | non-numeric | R-prefix | other alpha | has space |
|---|---|---|---|---|---|
| 48021 | 62256 | 0 | 0 | 0 | 0 |
| 48055 | 24988 | 0 | 0 | 0 | 0 |
| 48209 | 116420 | 0 | 0 | 0 | 0 |
| 48309 | 114254 | 0 | 0 | 0 | 0 |
| 48453 | 380917 | 0 | 0 | 0 | 0 |
| 48491 | 0 | 282570 | 282569 | 1 | 1 |

The one non-R alpha key is `PRIVATE ROAD` (unincorporated). It keys a live `parcel_record` row. Do not judge it. Do not strip it.

CAD key shape on `cad_property` (all years, not latest): five counties are numeric-only. Williamson CAD is split: 282,569 R-prefix rows and 319,480 numeric rows (602,050 distinct prop_ids). PRIVATE ROAD exists on CAD as well.

## 7. CAD-join health

Match rate counting rule: Factory records with at least one `cell_state->>'source' = 'cad_property'` value cell, divided by store records.

| county | records | with CAD value cell | rate | CAD latest ∩ landing | notes |
|---|---|---|---|---|---|
| 48021 | 62258 | 62258 | 1.000 | 62256 / 77799 | identity join works; $0 and living>0 sit outside landing |
| 48055 | 24988 | 24988 | 1.000 | 24988 / 48649 | $0 ∩ landing 5630; living>0 ∩ landing 13275 |
| 48209 | 116420 | 116420 | 1.000 | 116420 / 173050 | $0 ∩ landing 22547; living>0 ∩ landing 53218 |
| 48309 | 114254 | 114254 | 1.000 | 114254 / 114255 | one CAD key outside landing; assessed and living null on every landing row |
| 48453 | 380917 | 380917 | 1.000 | 380917 / 500307 | living>0 at CAD latest is 0 county-wide; $0 ∩ landing 47403 |
| 48491 | 282570 | 282570 | 1.000 | 282570 / 602050 | join hits the R-prefix CAD slice; dollars/living live on the numeric slice |

The Williamson addendum sentence "the CAD join matched ZERO rows" is false as an identity-join claim. The fill matched every landing key to an R-prefix (or PRIVATE ROAD) CAD row and stamped apn, acres, legal, market, situsAddress. What matched ZERO is improvement and living: those fields are null on every R-prefix CAD row and populated only on numeric CAD rows.

Key-format mechanism per county:

- Bastrop, Caldwell, Hays, McLennan, Travis: landing and CAD are both numeric. No R-prefix. Identity join is the same string. The Bastrop $0 / living hole is not a prefix scheme.
- Williamson: landing is R-prefixed and zero-padded (`R000009`). CAD holds that scheme **and** a numeric scheme. Field populations are segregated by scheme.

Authoritative landing to CAD crosswalk is `txgio_parcel.prop_id` as persisted by `p2-juris` (`CHUNK_GEOMETRY_SQL`: DISTINCT ON county_fips, prop_id, exclude null / blank / `0`). The fill joins `cadByProp.get(rec.propId)` with exact string equality. There is no normalization. A prefix-strip heuristic would attach numeric CAD accounts onto R-prefix geometry keys. That is a silent mis-join, worse than starving. The reconciliation card is a real account-to-feature crosswalk, then a re-run of CAD ingest (idempotent). Not a migration. Not a strip.

## 8. Bastrop zero-overlap (20 of 8712)

CAD latest living_area>0 not in landing: 8712 confirmed. Of those 8712, **zero** have a `txgio_parcel` row on the same `prop_id`, and **zero** match a leading-zero pad of that `prop_id`.

Twenty traced keys (102708, 102734, 102748, 102801, 102942, 103006, 103026, 103030, 103032, and the next ten in prop_id order) are numeric, have situs addresses and improvement dollars, and are absent from both txgio and landing.

Mechanism A (folded CAD accounts without their own geometry) is the one that fits. Mechanism B (key-format mismatch silently starving real parcels) is rejected for Bastrop: the keys are the same numeric shape as landing, and they are simply not in the feature table. Exactly-zero overlap on two fields is a hard population split (accounts vs features), not a pad/prefix bug.

Do not attach those 8712 living values onto landing parcels. They are other accounts.

CAD latest $0 (6158) remains zero ∩ landing, same split.

## 9. CAD-null unaccounted sizing

`ingestCadOntoRecords` never emits `absent-verified`. NULL at CAD stays unaccounted. $0 on dollars/acres/year_built becomes value 0. living_area 0 or null stays unaccounted.

Class sized here: landing rows that **have** a latest CAD row, and the CAD field is null (or blank text). That is the cad-null-verified candidate. Sizing only. No conversion.

| rail (CAD field) | 48021 | 48055 | 48209 | 48309 | 48453 | 48491 |
|---|---|---|---|---|---|---|
| landing ∩ CAD | 62256 | 24988 | 116420 | 114254 | 380917 | 282570 |
| situsAddress null | 0 | 8 | 2894 | 0 | 15 | 5 |
| situsCity null | 16327 | 96 | 4012 | 2324 | 207180 | 282570 |
| situsZip null | 16406 | 97 | 4816 | 2346 | 6046 | 282570 |
| legalDescription null | 632 | 60 | 245 | 928 | 5943 | 16 |
| exemptionCodes null | 62256 | 16030 | 62092 | 114254 | 154029 | 282570 |
| landUseCode null | 21398 | 196 | 46461 | 23182 | 7458 | 282570 |
| landValue null | 663 | 61 | 485 | 932 | 7458 | 282570 |
| improvementValue null | 21441 | 197 | 13920 | 23206 | 7458 | 282570 |
| marketValue null | 634 | 60 | 18736 | 894 | 5943 | 11406 |
| assessedValue null | 62256 | 266 | 38059 | 114254 | 7458 | 282570 |
| yearBuilt null | 21416 | 11660 | 68261 | 114254 | 380917 | 282570 |
| livingAreaSqft null | 62256 | 11713 | 63202 | 114254 | 380917 | 282570 |
| livingAreaSqft zero | 0 | 0 | 0 | 0 | 0 | 0 |
| acreageAcres null | 0 | 2274 | 37855 | 114254 | 327 | 0 |

McLennan assessed, living, yearBuilt, acres are null on every landing row. Travis living and yearBuilt are null on every landing row (and living>0 is 0 on the entire CAD latest roll). Williamson improvement/living/assessed/land/city/zip are null on the **matching** R-prefix CAD slice; the numeric CAD slice holds those fields and does not join.

A cad-null-verified module semantic would close McLennan assessed/living and Travis living as honest absence. It would **not** close Williamson improvement: those values exist under a different key. Do not convert that class.

## 10. Flood-shape probe

Committed parcel-record flood companion is `{kind, disposition, rowCount, source, vintage}`. Live flood cells are unaccounted on every store row (981,407). No zone, no floodway flag, no BFE, no panel, no effective date. That is thinner than the GTM wedge.

NFHL store `tx_fema_nfhl_flood_zone` (PRODUCTION neondb, ~198,704 est rows) actually carries:

| needed | NFHL column | live |
|---|---|---|
| zone | `fld_zone` | AO exists, AE exists (EXISTS probes 2026-09-01T20:08:10Z) |
| floodway vs floodplain | `zone_subty` (no boolean) | FLOODWAY subtype exists |
| BFE | `static_bfe` | column present; first AE sample rows were null |
| FEMA panel id | `dfirm_id` (community/DFIRM, not a panel+suffix) | column present |
| panel effective date | none | `source_vintage` is `NFHL_48_20260101`, not a panel effective date |

`flood-hazard-fact` atoms on hauska_mcp timed out this session (60s). Prior adjudication `_inbox/2026-08-20_c10_flood_store_adjudication.md` already showed AO vs AE on the same parcel from tile versus point-on-surface. This card reports both stores and reconciles nothing. Atom ingest onto the flood rail was not part of the fill (CAD only). Flood is HOLD-ELSEWHERE.

## 11. Reconciliation input

Ranked by unaccounted cells (rail x county). Material classes only. County ledger coverage is not evidence of zoning presence.

**HOLD-ELSEWHERE** (we hold it, or a store that should feed the cell exists):

- **CAD identity already in.** Do not re-acquire CAD for the six counties. Re-run ingest only after a crosswalk.
- **Williamson dollars/living (numeric CAD, 319,480 keys).** 68,483 $0 and 245,591 living>0 live on numeric CAD and zero of those are R-prefix. Landing is R-prefix from txgio. Card: account-to-feature crosswalk, then idempotent CAD ingest. Not a prefix-strip.
- **Bastrop CAD accounts without geometry (8,712 living, 6,158 $0).** Present in `cad_property`, absent from `txgio_parcel`. Do not stamp them onto landing parcels.
- **Flood.** NFHL plus (unmeasured this session) flood-hazard-fact atoms. Parcel-record flood is 981,407 unaccounted. Ingest companion rows from a reconciled flood store after AO vs AE is decided. The companion shape must grow if zone/floodway/BFE/panel are the product claim.
- **Wells.** `tx_rrc_well` 1,396,049 rows over 254 counties. Rail `wells` unaccounted on every record.
- **Special districts including MUD.** `tx_special_district` 2,775 rows, **1,888 MUD**. MUD is not a separate rail. Rail `specialDistricts` unaccounted everywhere.
- **Zoning in-city.** Unaccounted on all 611,116 in-city records. Zoning-ingest close: 23 of 72 six-county cities have a real staged layer; Austin serves live while the ledger scores 0.00%. Five stamp-gaps (Smithville, Luling, Martindale, Woodcreek, Lakeway). Unincorporated zoning is NA, not a gap.
- **cityLimits / etjStatus / parcelGeometry / roads / terrain.** Landing and txgio already exist. Instantiate did not stamp `cityLimits` from landing disposition (unaccounted on all 981,407 rows). Cheap fill add: stamp jurisdiction rails from `landing_parcel_jurisdiction`.
- **Dollar fields on counties where CAD joined.** Already value where the field was non-null. Remaining holes are the CAD-null class above, not acquisition.
- **Permits.** Do not source Bastrop permits from SmartCity.

**GENUINELY-MISSING** (absent at the CAD source that the fill is allowed to read):

- **Travis livingAreaSqft.** 0 of 500,307 CAD latest have living_area>0. 380,917 landing rows null. Do not invent.
- **Travis yearBuilt.** 380,917 null among landing ∩ CAD.
- **McLennan assessedValue, livingAreaSqft, yearBuilt, acreageAcres.** 114,254 null among landing ∩ CAD. Market and land mostly present.
- **Bastrop livingAreaSqft and assessedValue among landing.** Null at the CAD row that matches the feature. The 8,712 living values belong to other accounts (HOLD-ELSEWHERE), not these landing keys.
- **Placeholder setbacks.** Zoning-ingest close re-derived Hays 34,454/0 and Williamson 124,499/0 placeholder `setback-rule`. A placeholder-derived setback is not a value. In-city setback rails stay unaccounted until a real rule exists. This card did not re-count the 188,103 placeholder figure; use the zoning-ingest close as the source check.

**Do not convert unaccounted to absent-verified on this card.** Size is above. The operator decides whether a cad-null-verified semantic is warranted. It is warranted for Travis living and McLennan assessed/living. It is not warranted for Williamson improvement.

## 12. What the next cards should be

1. Williamson / Bastrop CAD account-to-feature crosswalk (read-only design first). Then re-run `parcel-record-fill` CAD ingest. Idempotent.
2. Optional instantiate stamp of `cityLimits` from landing disposition.
3. Flood ingest after AO vs AE reconciliation. Grow the companion shape or admit the thin wedge.
4. Wells and special-district companion ingest from staged tables already counted.
5. In-city zoning stamp for the five stamp-gap cities; do not re-acquire Austin.
6. Module decision: cad-null-verified for true CAD nulls (Travis living, McLennan assessed/living). Separate type from join-starve.

Raw county x rail x kind, CAD rails, and NA audit live in the JSON instruments. This document is the planner input.
