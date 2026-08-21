# L20 Factory 1.5 zoning sweep scratch

## GROUND-TRUTH
- 2026-08-14T21:35:46.140Z: production fan CLOSED. landed=440 / attempted=497 / halted=null / LAYER-FOUND=55 / NFUW=385 / stageApply=true / runner 0.2.1. outDir `P:/tmp/l20_zd_sweep_20260814/fan`.
- 2026-08-14T21:39:00Z: DC-6 post-roster price: 28 counties / 341 cities / staged 86 cities / 291475 rows / NFUW 254 / noStatus 0 / genuinelyOpen 254 / countiesWithStaging 22 / countiesWithoutStaging 6 (Blanco Fayette Hunt Lee Parker Somervell) / candidate-complete Bastrop+Caldwell only. Artifact `P:/tmp/l20_zd_sweep_20260814/dc6_price_post_roster.json`.
- 2026-08-14T21:37:00Z: roster status-only: 234 updated / 1 no-downgrade (temple-tx ORDINANCE-NO-GIS) / 205 unchanged; Georgetown later restored LAYER-FOUND from Neon 1890 rows after fan NFUW. Uncommitted for planner.
- 2026-08-14T21:39:00Z: Neon spot: austin 21953/44, belton 1228/190, deer-park 301/18, frisco 124/31, georgetown 1890/17. houston-tx not in staging.
- 2026-08-14T16:42:37.992Z: stage-apply re-pilot PASS. Bartonville 109 / Deer Park 301 / Elgin 3220 / Georgetown 1890 staged; Houston never staged; Frisco Parks+CityLimits rejected as NFUW. Store probe matched.
- 2026-08-14T15:09:55.005Z: signed 28-county footprint contains 341 roster cities under `parent_county_fips`; join metadata says 1214 linked / 9 unlinked. Counting rule is one city under its parent county, never explode `all_county_fips`.

## LESSON
- 2026-08-14T21:39:00Z: fan NFUW must not clobber store-backed LAYER-FOUND when Neon already holds staging for that cityKey (Georgetown). Prefer store presence + prior source_url over a later empty discovery pass.
- 2026-08-14T17:14:00Z: Austin Publish_Zoning_AGOL BASE_ZONE failed strong-code-ratio because SF-3/MF-1 hyphen forms and common digit-free Austin tokens (GR/GO/CBD/…) were outside the grammar. Widened SF/MF hyphen forms + short allowlist; absolute escape when strongDistinctCount>=8.
- 2026-08-14T17:08:00Z: unseeded Alamo Heights hung >20m on Hub discovery. Mitigations: Hub num=3, no auto catalogue-root fallback, fetch timeout 25s, maxLayersPerHost 24, city budget 8m force-land NFUW.
- 2026-08-14T16:13:00Z: coverage denominator must be city ∩ layer extent. Elgin is county-split (Bastrop FS/0 + Travis FS/1); grading either layer against the whole Census place under-counts and false-negatives a permanent known-truth.
- 2026-08-14T16:05:00Z: after Parks rejection, Denton City Limits still passed via CityCode abbreviations (FRIS/DENT/PLAN) plus high city coverage. Digit-free codes need a closed short-family allowlist; bare 3–4 letter city abbreviations are not districts. County-scale extents need an extent/city area ceiling.
- 2026-08-14T15:25:00Z: pre-pilot dry calibration measured permanent known-truth Bartonville zoning at 0.41744780293432737 union-area coverage of the current Census place polygon. Raw zoning polygons can omit ROW and other municipal land; the pre-registered coverage floor was amended from 0.65 to 0.40 before the stage-apply re-pilot. Code-distribution thresholds were not changed.
- Factory `extentToBbox` infers Web Mercator from coordinate magnitude (`abs(x) > 180`). Texas State Plane Central WKID 102739/latestWkid 2277 therefore gets transformed as Mercator and rejected outside the city bbox. Known Elgin and Georgetown zoning both fail this way. CRS must be explicit, never inferred solely from magnitude.
- Generic code-like values plus bbox overlap are insufficient zoning identity. Denton Parks `NAME`/`Class` values passed the Euclidean signature and were assigned to Frisco.
- The staging seam assumes `OBJECTID|objectid|FID`; ArcGIS declares the Frisco false hit's OID as `OBJECTID_1`. Staging must consume the service-declared OID field.
- A `LAYER-FOUND` staging error is still added to `progress.landed`. A production runner must fail closed and leave the city re-enterable when staging fails.

## DEAD-END
- Progressive polygon-clipping union over thousands of Georgetown features hung the coverage probe. Early-exit summed intersection area against the coverage floor is the operable measurement.
- Do not run the 440-city `--stage-apply` queue on unrepaired eng #328. The original 5-city pilot yielded 1 false positive and 2/2 known-truth false negatives.

## OPEN
- Planner commit: roster + L20 close/STATE/scratch; eng PR from `l20/factory15-prod-sweep`.
- Frisco trail-feasibility Zoning layer (124 rows) quality review before full-city trust.
- Georgetown fan NFUW vs store staging divergence (roster restored from store).
- Drain+stamp+score+live ledger probe before any DC-6 zoning cell is satisfied.
- L16 still owns atoms slot — do not take it.
