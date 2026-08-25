# Parcel facts write-path

## GROUND-TRUTH (2026-08-25T05:25Z)

- Factory operating instructions filed `_inbox/2026-08-25_factory_operating_instructions.md`. Atom/node/edge pointer is P-55 engine PR #356 `29ab77c` (`parcel-write-identity.ts`), not the 2026-08-08 DATA_MODEL proposal. Canvas family Read-with now includes the instructions file. Next planner wave `_inbox/2026-08-25_factory_memory_wave_handoff.md`.
- Routing pin leftovers updated: P-75 #475 / P-76 under 403d8010 on 00579-teh. No longer cites #475 OPEN or deploy UNMEASURED.

## GROUND-TRUTH (2026-08-25T05:05Z)

- Factory routing pin filed `_inbox/2026-08-24_factory_routing_pin.json` (16 rows: 14 Manifest rails + who-serves + city-limits). Instrument `scripts/factory-routing-readiness.mjs` --self-test and --check PASS. Snapshot doc_repo `cd88552` on main. Dump still GET 2026-08-25T04:13:26Z.
- ready:true only on already-serving hops: geometry P-01 (ledger 253 present + Donley absent), flood P-08 (ledger 162 present), envelope P-60 gold setbacks (PE #220 54f55a1 / 48021:34137). Not new ingest.
- P-25 cad/owner, P-09 footprint, P-17 roads COVER stay ready:false. Defects cite P-75 #475 OPEN, P-76 #476 `f2b6987d` deploy UNMEASURED, last-wins, tax_year DESC, A-004 bbox, A-017 Harris PBF 0.
- No --apply. No rematerialize. WDLL `_inbox/2026-08-24_factory_routing_readiness_WDLL.md` related list pointed at pin + script. Not graded here.

## GROUND-TRUTH (2026-08-25T04:55Z)

- P-75 LDT #475 still OPEN. CI green: Test SUCCESS completedAt 2026-08-25T04:54:21Z (gh pr view, run 32810067063). Typecheck SUCCESS. Fixture-red handoff at 04:22Z is stale.
- P-76 LDT #476 MERGED 04:33Z `f2b6987d`. Cortex deploy still UNMEASURED.
- Factory health canvas refreshed. Manifest dump still 667/3556 from GET 04:13:26Z, computedAt 04:10:25Z, rematerialized false. Dump age past 15 min banner; cells unchanged.

## GROUND-TRUTH (2026-08-25T04:45Z)

- P-76 LDT #476 MERGED. origin/main `f2b6987d`. Cortex deploy UNMEASURED. Empty-index now unmeasured on that tree.
- P-75 LDT #475 still OPEN.
- Factory canvas filed `factory-health.canvas.tsx`. Family pointers + union pin row added. Memory report: MEMORY.md holds zero factory lessons. Code read: last-wins and landuse hard-null still on 1.5; footprint apply bbox on engine main; bake still tax_year DESC.

## GROUND-TRUTH (2026-08-25T04:40Z)

- Union pin instrument PASS both directions. `node scripts/two-track-union-pin.mjs --self-test` and `--check`. F2 old Lane 3 queue fixture fails. F4 empty phrase refused. Live canvases present (0 UNMEASURED). Union commit `cd88552`. WDLL item 14.

## GROUND-TRUTH (2026-08-25T04:22Z)

- Two tracks linked. Recalibration board no longer owns Lane 3 ingest order. Authority is this game plan. Handoff `_inbox/2026-08-24_two_track_handoff.md`.
- P-75 LDT #475 OPEN. Test FAILURE is schema fixture drift for `tx_utility_territory_staging` (`schema.sql.template`). Typecheck SUCCESS.
- P-76 LDT #476 OPEN. Typecheck SUCCESS. Test was in progress at 04:21Z. Do not quote later CI from this line.

## GROUND-TRUTH (2026-08-25T04:13:26Z)

- County Manifest operator dump MEASURED. GET `/api/county-ledger` computedAt 2026-08-25T04:10:25.854Z, fetched 04:13:26Z, FRESH (3 min), p47 PASS. rematerialized false. satisfiedCells 667 / 3556 (22.56%). Cad/owner/landuse 13 present. Roads/footprint/easement/rrc-wells/envelope 254 not-yet. Travis cad not-yet @ 59.47. Tarrant cad not-yet @ 89.45. Dallas cad present 99.91. Who-serves and city-limits are not rails. Refresh: `node scripts/county-manifest-canvas-dump.mjs --live` then replace canvas DATA. Do not rematerialize on refresh.

## GROUND-TRUTH (2026-08-25T04:08:53Z)

- County Manifest operator dump MEASURED. GET `/api/county-ledger` computedAt 2026-08-25T04:00:46.525Z, fetched 04:08:53Z, FRESH, p47 PASS. satisfiedCells 667 / 3556 (22.56%). Cad/owner/landuse 13 present. Roads/footprint/easement/rrc-wells 254 not-yet. Travis cad not-yet @ 59.47. Tarrant cad not-yet @ 89.45. Dallas cad present 99.91. Who-serves and city-limits are not rails. Refresh: `node scripts/county-manifest-canvas-dump.mjs --live` then replace canvas DATA. Do not rematerialize on refresh.

## GROUND-TRUTH (2026-08-25T02:08:37Z)

- P-77 live MEASURED on named N=11 at 2026/cad-export: hit 10, miss 1, vintage-gap 0, unmeasured 0. Miss `48453:280238` leading_zero_orphan=false (not a padded key). Hit class 280239/280210/280211 all HIT. First live attempt failed: `psql -c` does not interpolate `:'var'`. Instrument now uses digit literals; `:'var'` refused; postgres URLs redacted.
- Wave 1 stores MEASURED 2026-08-25T01:58:19Z: tx_city_boundary 1222/1222 geo_id; staging 10196 (water 8515, sewer 1455, electric 139, water-district 87). Exact match to L22/ss-w15. Possibly unchanged store.
- Caldwell 48055 StratMap 202503: YEAR_BUILT C(60) 65.62% non-blank, 34.14% comma lists. GIS_AREA 100% filled, GIS_AREA_U 100% Acres. P-78 F8 first-valid-YYYY. Do not Number() the field.

## LESSON

`psql -c` does not interpolate `:'name'`. That interpolation is for `-f` scripts. A self-test that only builds the SQL string will not catch it. First live fail staying UNMEASURED was the instrument working.

## GROUND-TRUTH (2026-08-24T20:55-05)

- P-78 merge locked: COALESCE(excluded, table) for legal/values/owner/situs/use/acres; year_built + living_area_sqft CAMA-wins CASE on `tier:cad-export;%`. GIS_AREA_U closed set AC/ACRE/ACRES identity, SF/SQFT/HA convert, else refuse land_acres. year_built 0 → null. Path A same tax_year (stratmap-landuse re-run). Path B new tax_year only when CAMA export year differs; L17 flip after load. Selftest PASS `node scripts/p78-merge-fixtures-selftest.mjs`.

## GROUND-TRUTH (2026-08-24)

- Game plan `_inbox/2026-08-24_parcel_facts_write_path_game_plan.md`. WDLL draft, operator go pending.
- OPS-16 A-026 adds P-73..P-80.
- `landuse.ts` already persists legal/values/STAT_LAND_ to `cad_property`; forces `yearBuilt`/`livingAreaSqft`/`landAcres` null. `parse.ts` is geometry-only.
- L20 291k = `tx_zoning_district_staging`. Footprint staging = `tx_building_footprint` ~10.67M.
- City-limits CLI exists. ETJ layer does not.
- REST harvest writer ABSENT.
- `upsertCadProperties` last-upsert-wins. No CAMA/StratMap merge.
- Travis join is `prop_id` only. Registry geo_id crosswalk not implemented.
- baked-facets treats any trimmed situs string as present (`, TX` passes).

## LESSON

Effort-tier by report value is not write-path order. Bind existing stores first. Authority rule before a second writer on `cad_property`. Measure a join before loading CAMA onto it.

## DEAD-END

- Extending `parse.ts` to carry values onto `txgio_parcel` (columns do not exist; wrong store).
- Starting Travis CAMA to fix 280238 (CAMA keys CAD account; node is StratMap prop_id).
- Treating L20 zoning counts as footprint staged.

## OPEN

- Phase 1 still wrapping. Waves 3-6 held. A-027 go is P-75/P-76 only.
- Miss list: `_inbox/2026-08-24_write_path_what_we_missed.md` (structural live vs situs baked; GIS_AREA_U; P-78 rewrite; empty-index lie; CAMA close must name atom-apply).
- Cheap wrap A–E done. F (P-25 close contract) still open. Waves 3–6 held.
- P-78 spec + F1–F8. Selftest must keep passing. Product rewrite is Wave 3.
- P-77 serve / honest-miss half still held (A-027).
- A2 PE tree still holds property hauska-map; P-74 needs isolated tree from origin/main.
