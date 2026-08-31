# P2-JURIS scratch (F-01 read half)

## LESSON
adoptRoster drops all_county_fips. seed.mjs writes that thin object as city_manifest.payload. Coupland 17312 lists 48453 from bare ST_Intersects; persist must write the spatial array after the 1e-8 floor, not the roster array.

## DEAD-END
Point-major LATERAL city lookup (~218x slower). Also do not use LATERAL to decode parcel jsonb; use a WITH CTE.

## GROUND-TRUTH
2026-08-30 file-side: 72 touching / 24 straddles / Golinda Staples Thorndale primary-outside. Alias seed 225 (33/93/99). Unknown-string 509911. Live join totals UNMEASURED.

## GROUND-TRUTH
2026-08-31T15:26:02Z: Hays 06 cancelled at 180s. RO proven. Snapshot 981410. No reach×npoints emit. `_inbox/2026-08-31_p2_juris_hays_06_timeout.md`.

## GROUND-TRUTH
2026-08-31 scout wall 2147 ms. Bounds 100002/159378 verified 40000. No A/B mechanism. Seventh scan not taken.

## OPEN
08-30 baseline discarded. Interactive containment stopped. Persist seam filled on #40 (P2-JURIS-PERSIST close). Live apply is Cloud Run. TOTALS UNMEASURED until Bastrop/Caldwell match on the job.
