# radius-hang scratch (P-91)

## GROUND-TRUTH 2026-08-31T19:20Z
Live catalog on fancy-fire-06136146 / neondb / br-crimson-feather-aphfmy91. Four indexes on txgio_parcel: pk (county_fips, tile_key, feature_index), gist(geom), prop_idx (county_fips, prop_id), situs_norm_idx. No bbox index. Fixture claim of exactly one index is false. 16,428,786 reltuples, 18 GB heap.

## GROUND-TRUTH 2026-08-31T19:22Z
EXPLAIN of the shipped candidate query (254-county IN + bbox, lat 30.10592 lng -97.32528 radiusFt 500): Seq Scan on txgio_parcel cost 2.7e6. ANALYZE canceled at 90s / 45s / 40s statement_timeout.

## GROUND-TRUTH 2026-08-31T19:28Z
pg_stat_activity during the statewide SELECT: pid 23520 state=active wait_event_type=Extension wait_event=Neon/PS_ReadIO. Scan I/O, not Lock.

## GROUND-TRUTH 2026-08-31T19:26Z
B only (county_fips='48021' + bbox): Index Scan txgio_parcel_prop_idx, 607.797 ms, 37 rows, 74692 removed by filter.

## GROUND-TRUTH 2026-08-31T19:27Z
B + tile_key g0.02:-97.34000,30.10000: Index Scan pk, 15.677 ms, 37 rows, 1159 removed by filter.

## GROUND-TRUTH 2026-08-31T19:27Z
tx_county_boundary bbox overlap at that point: 48021 Bastrop + 48287 Lee in 4.014 ms.

## LESSON
texasCountyFipsList() as an IN bound makes every (county_fips, *) index non-selective. The store already has the intended read: county_fips + tile_key on the PK. Radius search reinvented a statewide bbox scan.

## DEAD-END
Do not apply a btree (west_lng, south_lat, east_lng, north_lat) from a laptop to fix this. Four independent range predicates use only the leading column. B + tile_key already Index Scans.

## GROUND-TRUTH 2026-08-31T19:35Z
Implemented shape (county_fips IN (48021,48287) AND tile_key = g0.02:-97.34000,30.10000 AND bbox): Index Scan pk, 4.345 ms, 37 rows. Vitest 19/19 passed on txgioRadiusSearch.test.ts + brokeragePlaceRadiusSearch.test.ts.

## OPEN
Planner live probe after deploy: GET /place/radius-search?lat=30.10592&lng=-97.32528&radiusFt=500 and radiusFt=50. This lane cannot deploy.

PLANNER REVIEW 2026-08-31T19:32Z — Accept partial. Re-read txgioRadiusSearch.ts: texasCountyFipsList gone; countiesOverlappingBbox then tile_key IN cellKeysForBbox; empty county refuses radius_county_unresolved; ceiling 2000 and max 5280 unchanged. Independently listed live pg_indexes on fancy-fire-06136146 / neondb: four indexes, no bbox. Re-ran vitest 19/19. tile_key is the existing txgioParcelStore pk path, not a new index. Do not deploy from this review.
