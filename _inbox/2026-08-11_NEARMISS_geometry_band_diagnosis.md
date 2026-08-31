---
id: 2026-08-11_NEARMISS_geometry_band_diagnosis
title: The 94-percent geometry band is one cause, and it is a scorer category error not a data gap
date: 2026-08-11
last_updated: 2026-08-11
status: diagnosis
owner: nick
related: [90_operations/OPS-13_store_topology, 90_operations/OPS-7_coverage_and_honesty_doctrine, _decisions/2026-08-07_envelope_saga_close_and_geometry_law]
---

# The near-miss geometry band

Read-only diagnosis. No repo edits, no writes to either database. Everything below was measured live on 2026-08-11 against the two production stores, and every number is reproducible from the queries this doc names.

## The answer first

There is a single cause and it explains all nine near-miss counties completely, to the row. It is not a data gap, it is not a writer defect, and no parcel is being skipped. The geometry rail divides an ACCOUNT-cardinality numerator by a FEATURE-cardinality denominator. Those are two different things by explicit design, so the rail can never read 100 percent in any county where any CAD account spans more than one platted feature, no matter how complete the data is.

Every one of the nine counties is fully written. The scorer is wrong, not the corpus.

The fix is cheap, it is in the scorer, and it is worth all nine cells. Ector is a genuinely different and more serious defect and must not be swept into the same fix.

## Stores used

`DATABASE_URL` was read from `P:\hauska-mcp-server\.env`, database `hauska_mcp` on `ep-lucky-truth-apodo8hr.c-7.us-east-1.aws.neon.tech`, holding `atoms`. `DEPLOYMENT_DATABASE_URL` was fetched from Secret Manager, `gcloud secrets versions access latest --secret=DEPLOYMENT_DATABASE_URL --project=legacy-design-tools-prod`, database `neondb` on the same host, holding `txgio_parcel`. Passwords redacted and not reproduced here. `P:\hauska-engine\.env` holds only `LEGACY_DATABASE_URL` and was not the right source; the LDT clones carry only `.env.example` files with no live credentials. This confirms the OPS-13 topology exactly, including that the two tables live in different databases on one host and cannot be joined in SQL, which is why the comparison below was done as two separate queries reconciled in the reporting layer.

## The exact shortfall table

Numerator is `select count(*) from atoms where entity_type='parcel-node' and body->>'countyFips'=$1` against `hauska_mcp`. Denominator is `select count(distinct feature_index) from txgio_parcel where county_fips=$1` against `neondb`. The computed percentage reproduces the reported coverage figure exactly in all ten cases, which confirms the denominator was correctly identified.

| FIPS | County | Features | Atoms | Coverage % | Shortfall | Folded extra features |
|---|---|---|---|---|---|---|
| 48095 | Concho | 8,034 | 7,629 | 94.9589 | 405 | 405 |
| 48061 | Cameron | 185,062 | 175,676 | 94.9282 | 9,386 | 9,386 |
| 48315 | Marion | 19,841 | 18,821 | 94.8591 | 1,020 | 1,020 |
| 48459 | Upshur | 30,293 | 28,723 | 94.8173 | 1,570 | 1,570 |
| 48149 | Fayette | 23,882 | 22,642 | 94.8078 | 1,240 | 1,240 |
| 48287 | Lee | 16,090 | 15,236 | 94.6924 | 854 | 854 |
| 48265 | Kerr | 36,913 | 34,939 | 94.6523 | 1,974 | 1,974 |
| 48481 | Wharton | 31,888 | 30,162 | 94.5873 | 1,726 | 1,726 |
| 48013 | Atascosa | 36,791 | 34,707 | 94.3356 | 2,084 | 2,084 |
| 48137 | Edwards | 9,948 | 9,369 | 94.1797 | 579 | 579 |

The last two columns are identical in every row. That is the whole finding. The shortfall is not approximately the fold, it IS the fold.

## Are the missing parcels random

No. They are not missing at all. Nothing is missing.

The planner at `packages/engine-core/src/parcel-node/plan-county-parcel-nodes.ts` deliberately emits one atom per ACCOUNT, not one per source feature. When several `feature_index` values carry the same `prop_id`, they collapse into a single atom and the extras are recorded in `counts.foldedExtraFeatures`. The module's own header states this as rule 2 and explains why: account identity and geometry identity are different things, and a geometry-keyed dedup would silently destroy accounts. Tarrant `A 36-1` is 133 leasehold accounts sharing one polygon, which is the mirror-image case the design protects against.

Reconstructing that logic in SQL predicts each county's atom count exactly. The prediction is `count(distinct usable prop_id) + count(keyless features)`, matching the planner's Step 3 fold plus its Step 4 synthetic-key absence path.

| FIPS | Features | Keyless | Accounts | Folded extra | Predicted atoms | Actual atoms |
|---|---|---|---|---|---|---|
| 48095 | 8,034 | 28 | 7,601 | 405 | 7,629 | 7,629 |
| 48061 | 185,062 | 267 | 175,409 | 9,386 | 175,676 | 175,676 |
| 48315 | 19,841 | 1,491 | 17,330 | 1,020 | 18,821 | 18,821 |
| 48459 | 30,293 | 168 | 28,555 | 1,570 | 28,723 | 28,723 |
| 48149 | 23,882 | 211 | 22,431 | 1,240 | 22,642 | 22,642 |
| 48287 | 16,090 | 468 | 14,768 | 854 | 15,236 | 15,236 |
| 48265 | 36,913 | 346 | 34,593 | 1,974 | 34,939 | 34,939 |
| 48481 | 31,888 | 548 | 29,614 | 1,726 | 30,162 | 30,162 |
| 48013 | 36,791 | 59 | 34,648 | 2,084 | 34,707 | 34,707 |
| 48137 | 9,948 | 213 | 9,156 | 579 | 9,369 | 9,369 |

Ten exact matches. There is no residue to explain. The synthetic keyless-atom counts corroborate independently: querying `atoms` for `parcelNodeId like '%:_feature-%'` returns 28 for Concho, 213 for Edwards, 468 for Lee, 59 for Atascosa and 267 for Cameron, matching the predicted keyless column in every case.

## What the folded rows actually look like

Concho `prop_id` 2615, `geo_id` `PR26-1`, spans 49 distinct feature indexes: 2424, 2426, 5137, 5775, 5779, 5780, 5782, and the contiguous run 6568 through 6612. Their bounding boxes are disjoint. Feature 2424 sits at west -99.72570, south 31.53674, east -99.72350, north 31.53770. Feature 6568 sits at west -99.72378, south 31.54083, east -99.72191, north 31.54165. All carry vintage `stratmap25-landparcels_48095_concho_202503`.

These are 49 physically separate real polygons, almost certainly a platted subdivision or a common-ownership tract, carried on one CAD account. The geometry is present, valid and loaded for every one of them. Concho's next largest are `prop_id` 5921 at 43 features, 37149 at 43, 37215 at 15, 37151 at 14, 535 at 14 and 6028 at 14. Nothing pathological; this is ordinary Texas cadastral structure.

## Is the county mis-scored or under-written

Mis-scored. This distinction was worth checking and it lands cleanly on one side.

The denominator itself is sound. There are zero NULL `feature_index` rows in any county examined, and the index space is dense with no gaps: Concho runs 0 to 8,033 with 8,034 distinct values across a span of 8,034; Edwards runs 0 to 9,947 with 9,948 distinct across 9,948; Lee runs 0 to 16,090 with 16,090 distinct. So the denominator is not inflated by junk rows and it counts real shapefile records. Ector is the one exception, 75,891 distinct across a span of 75,947, a trivial 56-index gap.

Geometry is not a competing cause either. Concho has zero NULL geometries across its 8,034 features: 7,930 Polygon and 104 MultiPolygon. The `geometry-incomplete` and `no-parcel-geometry` paths in the planner produce ABSENCE atoms rather than skips, so even genuinely unusable geometry would still contribute to the numerator and could not open a gap.

So the counties are completely written against their own account roster, and the rail is comparing that roster against a feature roster. The gap is definitional.

## Is it a writer limitation or a data gap

Neither, strictly. It is a deliberate modeling decision colliding with a scorer that was not told about it.

The writer skips nothing. `packages/engine-core/scripts/write-parcel-node-county.mjs:288-295` reads every row for the county with no predicate beyond `county_fips`:

```
SELECT feature_index, tile_key, prop_id, geo_id, geometry, source_vintage
FROM txgio_parcel
WHERE county_fips = ${args.county}
  AND (feature_index, tile_key) > (${lastFeature}, ${lastTile})
ORDER BY feature_index, tile_key
LIMIT ${pageSize}
```

The reduction is entirely in the planner. The load-bearing lines:

`plan-county-parcel-nodes.ts:426-436` builds the account buckets. `plan-county-parcel-nodes.ts:447-454` is the fold itself, taking `bucket[0]` as primary and counting the rest into `foldedExtraFeatures`. `plan-county-parcel-nodes.ts:473-485` emits one resolved atom carrying `additionalFeatureIndexes: extras`, so the extras are reported but never become atoms. `plan-county-parcel-nodes.ts:142-149` is `isUsableKeyToken`, and note that keyless features are NOT dropped, they route to `plan-county-parcel-nodes.ts:519-535` and become typed `parcel-key-unresolved` absence atoms under a synthetic vintage-scoped key. `plan-county-parcel-nodes.ts:488-502` sends multi-part geometry to a `geometry-incomplete` absence atom, again not a skip.

Every path except the account fold preserves cardinality. Only the fold reduces it, and the fold is exactly the shortfall.

## Ector 48135 is a different defect

The existing "multi-feature account fold" label on Ector is misleading and should be corrected. The arithmetic looks like the same fold, but the underlying cause is not the same and the fix is not the same.

In the band counties `prop_id` is a real CAD account that legitimately spans several features. In Ector, `prop_id` is not an account identifier at all. Its values are numeric-formatted quantities. The most frequent are `0.00000000` on 2,974 features, `1576.00000000` on 1,618, `2077.00000000` on 1,102, `114.00000000` on 968, `1814.00000000` on 737 and `2600.00000000` on 686. That is the signature of an acreage or value column having been mapped into the `prop_id` slot during ingest.

The per-parcel identity is present in the data, just on the other column. Ector has 75,891 distinct `feature_index`, 75,464 distinct `geo_id`, and only 3,791 distinct `prop_id`. The writer defaults to `prop_id` at `write-parcel-node-county.mjs:316` (`keyKind: args.keyKind ?? "prop_id"`), so 75,891 real features collapse onto 3,791 pseudo-accounts. Atoms come out at exactly 3,791, matching distinct `prop_id` to the row, hence 5.00 percent.

One secondary bug falls out of this. The all-zero placeholder guard at `plan-county-parcel-nodes.ts:147` tests `/^0+$/` against the trimmed token. Ector's `0.00000000` contains a decimal point, so it passes the guard. The 2,974 features that carry it should have become typed `parcel-key-unresolved` absences and instead were minted onto one fabricated shared account. That is precisely the failure mode the guard's comment says it exists to prevent, defeated by a number format.

Ector's fix is an acquisition and key-policy fix, re-keying on `geo_id` via the existing `--key-kind=geo_id_crosswalk` path or a re-ingest, and it is worth roughly 71,673 additional atoms. It should be tracked separately from the band fix.

## The other counties named in the brief

The same fold explains the lower band too, so those counties are also mis-scored rather than under-written, they simply have more folding.

| FIPS | Features | Keyless | Accounts | Folded extra | Predicted | Actual |
|---|---|---|---|---|---|---|
| 48503 | 16,353 | 301 | 15,064 | 988 | 15,365 | 15,365 |
| 48199 | 41,635 | 2,527 | 36,579 | 2,529 | 39,106 | 39,106 |
| 48219 | 17,242 | 479 | 15,690 | 1,073 | 16,169 | 16,169 |
| 48487 | 11,894 | 941 | 10,202 | 751 | 11,143 | 11,143 |
| 48355 | 157,198 | 832 | 146,338 | 10,028 | 147,170 | 147,170 |
| 48389 | 14,975 | 0 | 13,977 | 998 | 13,977 | 13,977 |
| 48203 | 50,995 | 314 | 47,186 | 3,495 | 47,500 | 47,500 |
| 48439 | 757,161 | 5 | 689,838 | 67,318 | 689,843 | 689,843 |

Tarrant 48439 is the instructive one: 67,318 folded extra features against only 5 keyless, which is the leasehold-account structure the planner's header cites, seen from the other side. Brazoria 48039 is the same mechanism at magnitude, 79,660 folded extras, but it is additionally distinguished by a keyless rate of 24,241 features out of 275,131, roughly 8.8 percent, against well under 1 percent in the band counties. Brazoria therefore has a real secondary key-quality problem worth its own look, though not the one causing the band.

Tarrant's actual atom count is 689,843 against a predicted 689,843. All eight match.

## The fix

Do not change the writer to emit one atom per feature. That would destroy the account-identity ruling the planner documents at lines 24 through 35, and it would reintroduce the Tarrant failure the design was built to prevent. It would also mean 133 leasehold accounts on one polygon become one atom, which is the opposite error and a worse one.

Fix the scorer. The geometry rail should divide by the number of features the written atoms ACCOUNT FOR, not by raw distinct features. That denominator is `count(distinct feature_index) - foldedExtraFeatures`, equivalently `count(distinct usable prop_id) + count(keyless features)`, which is exactly the planner's own `wouldWriteTotal`. The planner already computes `counts.foldedExtraFeatures` at lines 132 and 452-453, and the writer already emits it in its run summary, so nothing new has to be computed. The number needs to be persisted alongside the coverage cell and then used.

Under that denominator all nine near-miss counties score 100.0000 percent, because predicted equals actual exactly in every one. Nine full satisfied cells.

A separate correctness improvement, independent of the score and worth doing on its own merit: the atom's `geometryStoreRef` today carries only `store`, `propId` and `countyFips`, with no `featureIndex`. For Concho account 2615 that means a consumer following the pointer has no way to know which of 49 rings it will get, or that there are 49. Adding `featureIndex` and the `additionalFeatureIndexes` list to `geometryStoreRef` would make the fold legible at the serving edge rather than only in the writer's logs. This is arguably the more important finding for product honesty, since a resolved anchor for a 49-feature account currently presents a part as the whole with nothing on the atom to say so.

## Cells gained

Nine, from the fix above. Ector adds a tenth only after a separate re-key, and it would move from 5.00 percent to roughly 99.4 percent on the corrected denominator, which is worth scheduling given the size of the prize.

## Caveats

The counts move whenever a promote lane runs. These were captured 2026-08-11 with the arithmetic closing exactly, which is itself evidence no lane was writing these counties mid-capture. Re-run the queries before quoting.

The scorer source file itself was not located in the clones on this machine, so the denominator was established by reproducing its output rather than by reading it. That reproduction matches all ten reported percentages to four decimal places, which is strong evidence but is inference from behavior rather than from source. Anyone implementing the fix should read the scorer directly to confirm the denominator expression before changing it.
