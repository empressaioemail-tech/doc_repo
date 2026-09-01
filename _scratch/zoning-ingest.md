# zoning-ingest scratch (property, 2026-09-01)

## GROUND-TRUTH
- 2026-09-01T16:02:45.736736Z neondb current_database() on fancy-fire-06136146 / br-crimson-feather-aphfmy91
- 2026-09-01T16:07:57.356566Z hauska_mcp same branch
- engine worktree P:/tmp/hauska-engine-zoning-ingest feat/zoning-ingest 10dfc102
- roster texas_roster_v1.json 2026-08-12T16:47:05.273Z: 69 primary / 72 territory-touching
- table `_inbox/2026-09-01_zoning-ingest_city_truth.json`: 88 county-city rows, 72 unique cities, 23 with a real staging layer, 49 with none
- landing_parcel_jurisdiction method=ring on every six-county row
- McGregor (48309 primary) has 0 in-city landing rows
- Manor KMZ 2026-09-01T16:10:27Z: 3100 Zone fields, 15 codes, parcel-joined grain. Local parse only.
- F1 placeholder/nonPlaceholder re-derived: 48021 1969/7534; 48055 5170/337; 48209 34454/0; 48309 0/0; 48491 124499/0. 48453 UNMEASURED 15s (A3 13:16Z 22011/150702)
- Travis Austin 204079 in-city / 199269 stamped / sample 1000026 serves LA/austin_tx
- Live 48021:34137 serves SF-1/bastrop_city_tx; edge setbacks refused (retired road-class), not a placeholder number
- Card released after partial close. Store token cortex-prod no longer held by this card.

## LESSON
- in_city denominator is landing_parcel_jurisdiction DISTINCT prop_id. A join to txgio_parcel without DISTINCT reprints multi-geometry as extra parcels.
- Layer presence is the staging table. ZONING_LAYERS is the stamp wire. Smithville is staged and unwired. Opposite fix from acquire.
- place_layer_snapshots unique index is (adapter_key, place_key). A place_key-only lookup sequential-scans and times out. Served lookups need adapter_key='node-facets:tier1' and place_key='node:{fips}:{prop_id}'.
- CivicPlus DocumentCenter HEAD can 404 while GET returns the zip. Do not trust HEAD for portal files.
- A city can serve a district on a foreign jurisdiction (Manor RR/austin_tx). That is bleed, not presence of that city's zoning.

## DEAD-END
- Neon MCP run_sql timed out on place_layer_snapshots even `WHERE place_key = '48021:34729'` and on atoms entity_id range. Do not retry MCP for those; use gcloud+local SQL.
- stage-tx-zoning-district.mjs is ArcGIS FeatureServer only. Manor Zone lives in HTML CDATA, not SimpleData. Do not invent an ArcGIS URL for Manor.
- Two concurrent heavy scans (Bastrop served join + Travis/Williamson stamp CTE): served join timed out. One heavy scan at a time.

## OPEN
- KMZ/KML -> tx_zoning_district_staging normalizer. Manor 3100/15 is the fixture.
- LDT ZONING_LAYERS rows for Smithville, Luling, Martindale, Woodcreek, Lakeway, Robinson. Separate LDT card. Dry-run first.
- McGregor containment before zoning.
- Waco/Austin/Pflugerville bleed: stamp must key by city polygon.
- Travis F1 still UNMEASURED at 15s. Do not quote A3 as this-card re-derivation.
- Real setback-rule mint still SETBACK_APPLY_HELD. Hays and Williamson remain 100% placeholder.
- P:/tmp/hauska-engine-zoning-ingest feat/zoning-ingest 10dfc102 — no product commits. Planner may retire.
