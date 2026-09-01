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

## GROUND-TRUTH 2026-08-31T20:15Z
LDT #572 squash-merged as 394424f2520ecd32074470b1bdc4c798bfcdff7c. CI on a3e8ccc7: every required check-run conclusion SUCCESS including Test. MERGEABLE CLEAN.

## GROUND-TRUTH 2026-08-31T20:19Z
build-and-push run 33435023400 job Build & push image conclusion success. AR tag 394424f2 digest sha256:1edc04974ea830717bf1da9a57adf0bcc76506516a44bfbf71a505ad9cb68340.

## GROUND-TRUTH 2026-08-31T20:22Z
Before: cortex-api-00680-vog @100% digest sha256:5130d91b. Canary deploy 33435461759 conclusion success. Revision cortex-api-00682-met digest sha256:1edc0497, 0% traffic, DATABASE_URL=DEPLOYMENT_DATABASE_URL_DIRECT.

## GROUND-TRUTH 2026-08-31T20:25Z
shift-traffic 33435836763 job conclusion success. Serving cortex-api-00682-met percent=100 digest sha256:1edc0497. Digests differ.

## GROUND-TRUTH 2026-08-31T20:26Z
Live authenticated GET on production (Bearer SERVICE_API_KEY, key never printed):
radiusFt=500 -> 200 in 0.354s, received=29 truncated=false first 48021:31254
radiusFt=50 -> 200 in 0.203s, received=3 truncated=false
lat=notanumber -> 400 in 0.135s validation_error
Falsifier (504 / max-time / slow 200) did not fire. Timeout and 2000/5280 ceilings not raised. No bbox index applied.
