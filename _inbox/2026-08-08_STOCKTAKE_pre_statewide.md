---
id: stocktake_pre_statewide_2026_08_08
title: Pre-statewide stocktake — independent verification of the six load-bearing claims
date: 2026-08-08
status: complete
owner: nick
related: [90_runbooks/factory_onboarding_runbook, _inbox/2026-08-08_T1_bastrop_bulk_acquisition_parity.json, _inbox/2026-08-08_PROBE_profile_hot_path.json, _catalog/texas_roster_v1.json]
---

# Pre-statewide stocktake

Independent read-only verification taken before a 235-county acquisition commitment. Nothing below is taken from a prior artifact at face value; every number is re-measured against live DB, live endpoint, or live source. No writes performed.

## Verdict table

| # | Claim | Verdict | Evidence |
|---|---|---|---|
| 1 | The manifest tells the truth (3,302 cells / 254 counties / 13 rails) | **HOLDS** on structure, **THINNER THAN STATED** on meaning | Grid is exact and cell-state synthesis is conservative, but 235 of 236 satisfied cells are a hardcoded doctrine string, not measurement |
| 2 | texasCompletenessPct = 4.759, PARTIAL contributes zero | **HOLDS** (arithmetic) / **THINNER THAN STATED** (substance) | Recomputed 4.759231 exactly; but 4.723 of the 4.759 comes from doctrine and only 0.036 from measured work |
| 3 | 2.12x throughput (156 ms vs 330 ms) | **THINNER THAN STATED** | Dry leg with write path excluded; 390/500 sample parcels exited early; the two legs are not the same population |
| 4 | The acquisition path exists for 235 counties | **REFUTED** | `TXGIO_COUNTIES` is a 19-entry hardcoded allowlist == exactly the 19 already loaded; CLI hard-fails on any other county. No bulk loader exists |
| 5 | Store headroom for statewide | **HOLDS** (storage is not the constraint) | ~+11 GB to reach statewide; naive 13x is wrong, real row multiplier is 2.73x |
| 6 | Deployed and serving | **HOLDS** | cortex-api 00488-qif at 100%, latest==serving; CC bundle carries the manifest panel; engine origin/main 8a47f6d |

---

## 1. The manifest tells the truth

### Structure: exact

Live endpoint returned HTTP 200, 1,253,003 bytes.

```
TOP KEYS: ['counties', 'manifestCells', 'summary']
  counties: list len=254
  manifestCells: list len=3302

SUMMARY:
{
  "onboardedCount": 1,
  "totalCounties": 254,
  "staleCount": 0,
  "rewarmUnsafeCount": 0,
  "totalRails": 13,
  "totalCells": 3302,
  "satisfiedCells": 236,
  "texasCompletenessPct": 4.759231416834548
}
```

Every county has exactly 13 cells, with no exceptions:

```
254*13 = 3302  totalCells = 3302  len(manifestCells) = 3302
cells-per-county distribution: {13: 254}
num distinct counties in cells: 254
rails: 13
  cad: 254 / easement: 254 / envelope: 254 / flood: 254 / footprint: 254
  geometry: 254 / join: 254 / landuse: 254 / mud: 254 / owner: 254
  roads: 254 / rrc: 254 / zoning: 254
```

Database confirms the same denominators independently:

```
 manifest_counties | total_parcels
-------------------+---------------
               254 |      13360496

 rails
-------
    13
```

### The finding: 3,010 of 3,302 cells have no backing row at all

`county_facet_coverage` holds only 292 rows across 3 facets:

```
 facet_rows | distinct_counties | distinct_facets
------------+-------------------+-----------------
        292 |               254 |               3

  facet   | rows | sat_absent | sat_present | null_state
----------+------+------------+-------------+------------
 envelope |   19 |          0 |           0 |         19
 land-use |   19 |          0 |           0 |         19
 zoning   |  254 |        235 |          19 |          0
```

The other 3,010 cells are synthesized at serve time from the `county_rail` definition table. This is honest — and the synthesis precedence is correctly fail-closed. From `artifacts/api-server/src/routes/countyLedger.ts`:

```
WHEN r.atom_family_state <> 'present' THEN 'no-atom'
WHEN r.has_writer = false THEN 'no-writer'
WHEN c.rail_state IS NULL THEN 'not-yet'
```

Atom-family and writer state dominate any stored row, so a stray optimistic row cannot make a rail look real. That design is sound and I want to state it plainly: **the manifest does not fabricate presence.**

### Does an untouched county render honestly?

Harris County (48201) has never been worked. All 13 cells, verbatim from the live endpoint:

```json
{"countyFips":"48201","railKey":"cad","displayState":"no-atom","isPartial":false,"honestCoveragePct":null,"thresholdPct":95,"atomFamilyState":"missing","hasWriter":false,"absenceBasis":null,"source":null,"sourceVintage":null,"lastVerifiedAt":null,"verifiedByInstrument":null,"verificationMethod":null,"artifactPath":null}
{"countyFips":"48201","railKey":"easement","displayState":"no-atom",...,"atomFamilyState":"unpublished","hasWriter":false,...}
{"countyFips":"48201","railKey":"envelope","displayState":"not-yet",...,"atomFamilyState":"present","hasWriter":true,...}
{"countyFips":"48201","railKey":"flood","displayState":"no-atom",...,"atomFamilyState":"partial","hasWriter":false,...}
{"countyFips":"48201","railKey":"footprint","displayState":"no-atom",...,"atomFamilyState":"unpublished","hasWriter":false,...}
{"countyFips":"48201","railKey":"geometry","displayState":"no-atom",...,"atomFamilyState":"missing","hasWriter":false,...}
{"countyFips":"48201","railKey":"join","displayState":"no-atom",...,"atomFamilyState":"missing","hasWriter":true,...}
{"countyFips":"48201","railKey":"landuse","displayState":"no-atom",...,"atomFamilyState":"missing","hasWriter":true,...}
{"countyFips":"48201","railKey":"mud","displayState":"no-atom",...,"atomFamilyState":"missing","hasWriter":false,...}
{"countyFips":"48201","railKey":"owner","displayState":"no-atom",...,"atomFamilyState":"missing","hasWriter":false,...}
{"countyFips":"48201","railKey":"roads","displayState":"no-writer",...,"atomFamilyState":"present","hasWriter":false,...}
{"countyFips":"48201","railKey":"rrc","displayState":"no-atom",...,"atomFamilyState":"partial","hasWriter":false,...}
{"countyFips":"48201","railKey":"zoning","displayState":"satisfied-absent","isPartial":false,"honestCoveragePct":0,"thresholdPct":95,"atomFamilyState":"present","hasWriter":true,"absenceBasis":"PASS — county unincorporated = honest absence","source":"zoning-regime-doctrine","verifiedByInstrument":"roster-load","verificationMethod":"roster-load","artifactPath":"doc_repo/_catalog/texas_roster_v1.json#counties[].zoning_regime.doctrine"}
```

**Twelve of thirteen render honestly. The thirteenth does not.**

Harris County's zoning cell reads `satisfied-absent` — a SATISFIED state that counts toward the rollup — on a county that has never been touched. The basis is `verificationMethod: "roster-load"`: the value was read out of a JSON file, not measured against anything.

The doctrine is a constant across all 254 counties:

```
=== zoning_regime doctrine distribution across 254 ===
254 "PASS — county unincorporated = honest absence"
```

Every county in Texas carries the identical string. There is no per-county determination behind it. And all 235 satisfied-absent cells share one basis:

```
--- satisfied-absent breakdown by rail + absenceBasis ---
235 ('zoning', 'PASS — county unincorporated = honest absence', 'zoning-regime-doctrine', 'roster-load')
```

The doctrine itself is defensible as law — Texas counties genuinely cannot zone unincorporated territory. What is not defensible is the **scope**: the claim is asserted at county granularity while the incorporated cities inside those counties absolutely do zone. Harris County contains Houston. Bexar contains San Antonio. The cell says "satisfied" for a county whose largest municipality has a full zoning code that has never been read. The honest reading of that cell is *"the unincorporated remainder is unzoned, and we have not looked at any city inside this county."*

### A second, smaller defect: satisfied-present at zero coverage

Fifteen counties render `displayState: "satisfied-present"` with `honestCoveragePct: 0`:

```
 county_fips | honest_coverage_pct | threshold_pct |    rail_state     | counts_as_satisfied
-------------+---------------------+---------------+-------------------+---------------------
 48021       |               99.77 |         95.00 | satisfied-present | t
 48491       |               33.98 |         95.00 | satisfied-present | f
 48091       |               25.82 |         95.00 | satisfied-present | f
 48209       |                3.61 |         95.00 | satisfied-present | f
 48187       |                0.00 |         95.00 | satisfied-present | f
 48309       |                0.00 |         95.00 | satisfied-present | f
 ... (15 rows at 0.00 total, including 48113 Dallas and 48029 Bexar)
```

These do not contaminate the rollup (`isPartial: true` correctly zeroes them). But a state named `satisfied-present` carrying zero measured coverage is a misleading label on the panel. Dallas and Bexar both render this way.

**Verdict: HOLDS on structure and on 12/13 rails. THINNER THAN STATED on zoning, which is the only rail carrying satisfied cells and is doctrine-asserted rather than measured for 235 of 236 of them.**

---

## 2. The rollup math

Recomputed independently from raw tables, no reuse of served values:

```sql
WITH sat AS (
  SELECT m.county_fips, m.parcel_count_est,
    (SELECT count(*) FROM county_facet_coverage f
      WHERE f.county_fips=m.county_fips
        AND ( f.rail_state='satisfied-absent'
           OR (f.rail_state='satisfied-present' AND f.honest_coverage_pct >= COALESCE(f.threshold_pct,95)) )
    ) AS satisfied_count
  FROM county_manifest m
)
SELECT sum(parcel_count_est) AS sum_parcels,
  sum(parcel_count_est::bigint * satisfied_count) AS weighted_num,
  sum(parcel_count_est::bigint) * 13 AS weighted_den,
  round(100.0 * sum(parcel_count_est::bigint*satisfied_count) / (sum(parcel_count_est::bigint)*13), 6) AS texas_completeness_pct,
  sum(satisfied_count) AS raw_satisfied_cells
FROM sat;
```

```
 sum_parcels | weighted_num | weighted_den | texas_completeness_pct | raw_satisfied_cells
-------------+--------------+--------------+------------------------+---------------------
    13360496 |      8266140 |    173686448 |               4.759231 |                 236
```

**Match. 4.759231 vs served 4.759231416834548; 236 satisfied cells vs served 236.** No discrepancy.

PARTIAL exclusion verified — of 19 scored zoning cells, exactly one clears its threshold:

```
              bucket               | count
-----------------------------------+-------
 satisfied-absent (doctrine)       |   235
 satisfied-present above threshold |     1
```

18 of 19 contribute zero, as stated. The route code confirms the rule:

```
/** A cell counts toward the Texas rollup only when SATISFIED (ruling 3):
    satisfied-present at/above threshold (not PARTIAL), or satisfied-absent.
    PARTIAL contributes zero. */
```

### The substance behind the arithmetic

Decomposing the 4.759 by source:

```
 pct_from_doctrine | pct_from_measurement
-------------------+----------------------
          4.722754 |             0.036478
```

**99.23% of the headline number is the hardcoded doctrine string. 0.77% is measured work.**

The entire measured contribution is Bastrop County's zoning cell:

```
 bastrop_parcels | bastrop_pct_of_state
-----------------+----------------------
           63357 |               0.4742
```

0.4742% of state parcels × 1/13 rails = 0.0365% — exactly the measured contribution. One county, one rail, out of 3,302 cells.

**Verdict: HOLDS as arithmetic — the formula is implemented exactly as specified and reproduces to six decimal places. But the number does not mean what "4.759% of Texas complete" sounds like. Stripped of the doctrine constant, measured statewide completeness is 0.036%.** If the doctrine were ever narrowed from county-wide to unincorporated-only, this number collapses toward zero without any work being lost — which tells you the metric is currently measuring a definition, not progress.

---

## 3. The 2.12x throughput claim

Claim under test, from `_inbox/2026-08-08_T1_bastrop_bulk_acquisition_parity.json`:

```json
"batchDryRun500": {
    "bulkLoadMs": 1277,
    "loopMsTotal": 18526,
    "msPerParcel": 156,
    "liveHttpCallsInLoop": 0,
    "baselineMsPerParcelProfile": 330.07,
    "speedupVsProfileX": 2.12
}
```

### (a) Is 500 parcels representative of the 5,785-parcel cohort?

**No — and the defect is population, not sample size.** From the profile's own caveat:

> This run is a --city-cohort dry leg without --force-overwrite, so 390 of 500 parcels exited early at the no-setback-row branch (before geomResolve/warmThenVerify). That is why geomResolve fired 63 times and warmThenVerify 53 times against 500 parcels processed. Deep-path parcels cost more per parcel (P50 644 ms, P95 1081 ms) than the 330 ms all-parcel mean.

The call counts confirm it directly:

```
situsQuery            calls= 500
bcadCurrencyCheck     calls= 500
layer23SetbackProbe   calls= 491
alreadyPromotedQuery  calls= 110
geomResolve           calls=  63
warmThenVerify        calls=  53
```

Only 53 of 500 parcels (10.6%) reached the actual geometry compute. The 330 ms mean is dominated by 390 parcels that did almost nothing. The profile states the distribution explicitly: mean 330 ms but **P50 644 ms and P95 1081 ms** — the median deep-path parcel costs roughly double the mean.

A real acquisition run touches every parcel through the full path. A mean built from a population that is 78% early-exit is not the mean that governs a full cohort.

### (b) What is EXCLUDED from the 156 ms

Enumerated from the artifact's own fields and the profile's caveats:

1. **Bulk load / setup** — `bulkLoadMs: 1277` is reported separately and excluded from `msPerParcel`. The baseline's equivalent was `setupWallMs: 28255` (roads load, roster load, cohort query), also excluded.
2. **All live HTTP** — `liveHttpCallsInLoop: 0`. The baseline spent **53.29% of wall on live ArcGIS calls** (`bcadCurrencyCheck` 27.15%, `layer23SetbackProbe` 23.65%, `layer23SetbackBuild` 2.48%). The optimization's headline gain is precisely this: hoisting live HTTP out of the loop.
3. **`promoteDepthWarmToStorage` write-then-verify** — caveat 1: *"No apply-path costs measured: promoteDepthWarmToStorage write-then-verify, promoteHonestVerifyDecline writes, and boundaryEdgesRead all add per-parcel atoms-DB round-trips on an apply leg."*
4. **`promoteHonestVerifyDecline` writes** — same caveat.
5. **`boundaryEdgesRead`** — measured `totalMs: 0, callCount: 0` on the dry leg; becomes non-zero on apply.
6. **`bcadDivergenceFetch`** — `callCount: 0`, with the artifact's own note: *"Expect this bucket to become non-zero on --force-overwrite/--force-repromote apply legs."*
7. **The deep geometry path for 78% of parcels** — per (a), never executed for the early-exit majority.

### (c) What would the number be WITH write-then-verify and promote?

**I decline to state a multiplier, and I think stating one would be the error here.** What can be bounded:

- Both measured legs exclude the write path entirely, so the 2.12x ratio is *dry-to-dry*. It is a valid measurement of loop I/O removal and an invalid proxy for end-to-end acquisition throughput.
- The one hard anchor for apply-leg cost: per-parcel Neon round-trips on this deployment measure **91–102 ms each** (`situsQuery` 91.9, `alreadyPromotedQuery` 91.5, `geomResolve` 101.6). Write-then-verify is by definition at least a write plus a read-back. If those remain per-parcel and serial, each adds on the order of ~90–100 ms — which alone is comparable to the entire claimed 156 ms.
- Direction of the unknown is one-way: every excluded stage adds time. 156 ms is a floor, not an estimate.
- Whether the apply path can be bulk-hoisted the way the read path was is **undetermined** — that is the question that actually decides throughput, and no artifact I read measures it.

**Verdict: THINNER THAN STATED.** The 156 ms and 330 ms are both real and honestly labeled in their own artifacts — the profile's caveats are unusually candid and called every one of these limitations itself. The overreach is in carrying "2.12x" forward as a throughput figure for a program whose dominant per-parcel cost (the write path) was never in either measurement.

---

## 4. THE ACQUISITION PATH — REFUTED

This is the critical one, and it does not hold.

### (a) The entry point

`P:\legacy-design-tools\lib\cad-ingest\src\txgio\cli.ts`, invoked as:

```
pnpm --filter @workspace/cad-ingest txgio-ingest -- \
  --county=48209 [--file=...] [--vintage=...] [--batch-size=250] [--limit=N] [--dry-run]
```

It resolves the county through `resolveTxgioCounty()` against `TXGIO_COUNTIES` in `counties.ts`, downloads the per-county StratMap zip, guards the projection, parses the shapefile, and loads via `upsertTxgioParcels` (`ingest.ts`).

### (b) Has it run for a county not already loaded? No — and it cannot.

`TXGIO_COUNTIES` is a hardcoded 19-entry map:

```
export const TXGIO_COUNTIES: Record<string, TxgioCounty> = {
  "48209": county("48209", "Hays"),      "48091": county("48091", "Comal"),
  "48453": county("48453", "Travis"),    "48491": county("48491", "Williamson"),
  "48029": county("48029", "Bexar"),     "48021": county("48021", "Bastrop"),
  "48055": county("48055", "Caldwell"),  "48187": county("48187", "Guadalupe"),
  "48027": county("48027", "Bell"),      "48309": county("48309", "McLennan"),
  "48113": county("48113", "Dallas"),    "48439": county("48439", "Tarrant"),
  "48085": county("48085", "Collin"),    "48121": county("48121", "Denton"),
  "48397": county("48397", "Rockwall"),  "48139": county("48139", "Ellis"),
  "48251": county("48251", "Johnson"),   "48257": county("48257", "Kaufman"),
  "48367": county("48367", "Parker"),
};
```

Any county outside this map hard-fails before touching the network:

```
  const county = resolveTxgioCounty(values.county);
  if (!county) {
    fail(`unknown county "${values.county}" — supported: ${supported} (run --list for the full set)`);
  }
```

Those 19 entries are **exactly the 19 counties already in the store** — verified against the live ldt DB:

```
 total_rows | counties | distinct_features
------------+----------+-------------------
    5535897 |       19 |           5151394
```

The 19 FIPS in the store match the 19 in the allowlist one-for-one. **The allowlist has never contained a county that was not subsequently loaded, and has never been asked to serve one that was not on it.**

Full history of the allowlist — three commits, all pure expansions immediately preceding a load:

```
c48a90ce feat(cad-ingest): register DFW 9 counties in TXGIO_COUNTIES
29f0d27c feat(txgio): unify Central-TX parcel geometry into txgio_parcel for the PMTiles bake (#289)
48661191 feat(geometry): TxGIO self-hosted parcel store — Hays/Comal map + point resolution (+ cad-ingest CLI fixes) (#247)
```

**There is no bulk county loader.** A repo-wide search for anything consuming `TXGIO_COUNTIES` or `txgioDownloadUrl` returns only the CLI itself, its tests, the schema, and api-server read paths — no orchestrator, no loop, no queue, no workflow.

The practical shape of this: acquiring 235 counties today means 235 separate manual CLI invocations, each requiring a prior code change to register the county, merged and shipped. **The path the program rests on has never executed for an unloaded county because it is structurally incapable of doing so.**

Mitigating and material: the source is uniform and the gap is genuinely small in code terms. `txgioDownloadUrl()` builds every URL from one template, the roster confirms **253 of 254 counties are in StratMap**, and the file header states the schema is statewide-normalized. Replacing the hardcoded map with a roster-driven lookup is a contained change — but it is a change that has not been made, not validated, and not run.

```
 in_stratmap | counties | parcels
-------------+----------+----------
 f           |        1 |
 t           |      253 | 13360496
```

The single exception is Donley (48129), which has no StratMap entry **and a null parcel count** — meaning the 13,360,496 statewide denominator silently excludes it.

### (c) Tile-seam duplication

The premise in the brief is inaccurate on two points, both in the program's favor.

It is **not a defect** — it is the deliberate read-index strategy. From `geo.ts`:

> Rows in `txgio_parcel` are keyed by single-CELL keys (`g0.02:<w>,<s>`) ... because the store buckets individual parcels into every cell their bbox intersects — reads are then pk-prefix equality scans over the covering cells.

And the rate is **not 16.6%**. Measured:

```
 pct_seam_dup_rows
-------------------
             6.946
```

Per-county row/feature ratios range 1.05 (Travis, metro) to 1.25 (Caldwell, rural):

```
 county_fips |  rows  | features | rows_per_feature |                    vintage
-------------+--------+----------+------------------+------------------------------------------------
 48453       | 894657 |   828773 |           1.0795 | stratmap25-landparcels_48453_travis_202508
 48439       | 799524 |   757161 |           1.0559 | stratmap25-landparcels_48439_tarrant_202507
 48029       | 747206 |   709541 |           1.0531 | stratmap25-landparcels_48029_bexar_202507
 48113       | 726360 |   694160 |           1.0464 | stratmap25-landparcels_48113_dallas_202508
 ...
 48021       |  74729 |    63357 |           1.1795 | stratmap25-landparcels_48021_bastrop_202503
 48055       |  32781 |    26155 |           1.2533 | stratmap25-landparcels_48055_caldwell_202503
```

Larger rural parcels span more 0.02-degree cells, so the seam factor rises as the program moves out of metros — the opposite of the metro-density assumption elsewhere.

Distinct parcel identity reconciles closely with the cited figure:

```
 distinct_county_propid | null_propid_rows
------------------------+------------------
                4606751 |             2853
```

4,606,751 distinct `(county_fips, prop_id)` against the brief's 4,617,181 — a 0.2% gap, plus 2,853 rows with a null `prop_id` that no `prop_id`-keyed join will ever reach.

### (d) Is it idempotent?

**By construction yes; by test coverage no.**

The design is sound and doubly protected. Replace semantics per county:

```
      log(`replacing existing ${county.fips} rows`);
      await deleteCountyParcels(db, county.fips);
```

plus a conflict-safe upsert on `(countyFips, tileKey, featureIndex)`:

```
      .onConflictDoUpdate({
        target: [txgioParcel.countyFips, txgioParcel.tileKey, txgioParcel.featureIndex],
        set: { propId: ..., geometry: ..., ingestedAt: sql`now()` },
      })
```

The header documents the intent: *"re-runs and fresher vintages are idempotent and never strand stale rows"* and *"a resumed/re-run load after a partial failure is idempotent without a second delete."*

**But no test exercises either function.** A repo-wide search for `upsertTxgioParcels` or `deleteCountyParcels` in any test file returns nothing; the 32 tests in `txgio.test.ts` cover grid math, bbox, point-in-polygon, normalization, the WGS84 guard, and county routing — **parse and geometry only, no write path.** The idempotency guarantee about to be relied on 235 times is asserted in a comment and unverified by CI.

One structural risk worth naming: `deleteCountyParcels` runs **before** the streaming insert and outside any transaction visible in the CLI. A crash between the delete and a completed load leaves that county partially loaded — recoverable by re-running, but a window in which the store under-reports.

### (e) Dry-run story

`--dry-run` exists and is honest about what it does: it parses and drains without a DB connection, and `DATABASE_URL` is not even required.

```
  if (dryRun) {
    for await (const _rec of records) { featuresLoaded += 1; }
  }
```

It reports `features loaded: 0 (dry-run)` and `rows inserted: 0 (dry-run)` rather than projecting. This means **the dry-run validates the source, not the write** — it proves the zip downloads, the projection guard passes, and the schema parses, but it cannot predict row counts or exercise the conflict path. Under the repo's own "dry-run-must-predict-apply" discipline, this dry-run does not predict the apply.

**Verdict: REFUTED.** The path has never run for an unloaded county, cannot be invoked for one without a code change, has no bulk orchestration, and its write path has zero test coverage.

---

## 5. Store headroom for statewide

### Current state

```
 loaded_counties | loaded_rows | txgio_bytes | bytes_per_row
-----------------+-------------+-------------+---------------
              19 |     5535897 |  6225453056 |        1124.6
```

Largest tables on the ldt deployment Neon:

```
        relname        |  total  |    bytes
-----------------------+---------+-------------
 place_layer_snapshots | 10 GB   | 11219460096
 txgio_parcel          | 5937 MB |  6225453056
 txgio_parcel_staging  | 2592 MB |  2717786112
 cad_property          | 1719 MB |  1802240000
 permit_record         | 1417 MB |  1485570048
 txgio_address         | 751 MB  |   787128320
 brokerage_brief_runs  | 686 MB  |   719568896
 sheets                | 377 MB  |   395608064
```

```
 db_size
---------
 24 GB

 max_connections
-----------------
 901
 (current_conns: 17; PostgreSQL 17.10)
```

Atoms Neon: `max_connections` 901, database size 15 GB.

### Why the naive 13x is wrong — and what the right multiplier is

The 19 loaded counties are metro-dense and already hold **38.6% of all Texas parcels**:

```
 loaded_parcels_roster | remaining_parcels_roster | statewide_parcels | pct_of_state_already_loaded | remaining_counties
-----------------------+--------------------------+-------------------+-----------------------------+--------------------
               5157713 |                  8202783 |          13360496 |                       38.60 |                235
```

So the correct row multiplier is **2.73x**, not 13x. The remaining 235 counties hold 8.2M parcels — 1.59x what is already loaded, spread over 12x as many counties.

### Extrapolation, with the assumption named

Assumption: 1,124.6 bytes/row (measured, includes indexes and TOAST) holds for rural geometry. Range driven by the observed seam factor 1.05 (metro) to 1.26 (rural). Rural counties sit at the high end, so the upper bound is the realistic planning number.

```
bytes/row = 1124.6
low  (metro-like seam 1.05)  statewide rows= 14.03M  txgio_parcel= 15.8 GB
mid  (blended 1.13)          statewide rows= 15.10M  txgio_parcel= 17.0 GB
high (rural seam 1.26)       statewide rows= 16.83M  txgio_parcel= 18.9 GB

  seam 1.05: +9.6 GB  -> ~34 GB total db
  seam 1.13: +10.8 GB -> ~35 GB total db
  seam 1.26: +12.7 GB -> ~37 GB total db
```

**Range: statewide `txgio_parcel` lands at 16–19 GB, taking the database from 24 GB to roughly 34–37 GB.**

Two caveats on the byte figure. Rural parcels are geometrically larger with more vertices, so bytes-per-row likely runs above the metro-derived 1,124.6 — call the upper bound soft. And `txgio_parcel_staging` is already carrying 2.6 GB of what appears to be transient load state; if staging scales with the load rather than being truncated between counties, add its share again.

### What breaks first

**Not storage, and not connections.** 901 connections against 17 in use is not a constraint, and a 37 GB Neon database is unremarkable.

What breaks first, in order:

1. **The acquisition path itself** (finding 4) — it cannot address 235 counties at all. This is the binding constraint and it is a code constraint, not a capacity one.
2. **Ingest wall-time and the crash window.** Travis alone is a 346 MB download at batch size 250. Serialized across 235 counties with a non-transactional delete-then-load per county, the exposure is elapsed time and partial-load windows, not disk.
3. **Neon compute/autosuspend behavior under a sustained multi-hour bulk write**, which I could not determine (see below).
4. **The downstream bake.** `place_layer_snapshots` is already the largest table at 10 GB against 19 counties. If PMTiles snapshots scale with parcel count, that table grows faster than `txgio_parcel` and would pass it — this is the storage item worth watching, not the parcel store.

**Verdict: HOLDS.** Storage headroom is adequate with room to spare; the honest finding is that storage was never the risk.

---

## 6. What is actually deployed right now

### cortex-api — deployed and serving

```
{'revisionName': 'cortex-api-00472-web', 'tag': 'smoke4', ...};
{'revisionName': 'cortex-api-00481-xik', 'tag': 'pooling-fix', ...};
{'percent': 100, 'revisionName': 'cortex-api-00488-qif', 'tag': 'canary', ...}

=== LATEST READY ===
cortex-api-00488-qif	cortex-api-00488-qif

NAME: cortex-api-00488-qif   CREATION_TIMESTAMP: 2026-08-08T18:55:56.965802Z
```

**Serving revision == latest ready revision == `cortex-api-00488-qif` at 100%.** No Cloud Run traffic trap. Note the service lives in project `legacy-design-tools-prod`, not `hauska-prod-497015` (`gcloud run services describe cortex-api --project hauska-prod-497015` returns `Cannot find service [cortex-api]`).

It serves `manifestCells` — confirmed by the live 200 above returning 3,302 cells.

### Command Center — deployed and rendering the panel

```
HTTP 200 bytes=438
src="/assets/index-BhrwlQ4M.js"
href="/assets/index-zbi44Atu.css"
```

Bundle `index-BhrwlQ4M.js` (2,132,781 bytes) contains the manifest panel:

```
manifestCells : 2
texasCompletenessPct : 1
satisfied-absent : 4
county-ledger : 6
no-writer : 4
not-yet : 2
absenceBasis : 0
```

Rendering logic present in the shipped bundle:

```
satisfied-absent"?"ABS":o.displayState==="no-atom"?"—":(o.displayState==="no-writer"
satisfied-absent"?"info":o==="partial"?"warn":o==="no-atom"?"danger":"info"
```

and the string `13 rails` appears twice. **The panel is deployed and renders the manifest.**

One gap: `absenceBasis` does not appear in the bundle at all. The doctrine string that justifies all 235 satisfied-absent cells is served by the API but **is not surfaced in the UI** — the operator sees an `ABS` chip with no visible basis. Given finding 1, that is exactly the field that most needs to be on screen.

### Engine — merged and matching

```
origin/main: 8a47f6d fix(depth-warm): bulk acquisition before Bastrop batch compute loop (#281)
local:       6d6cccb fix(depth-warm): bulk acquisition before Bastrop batch compute loop
```

`origin/main` is `8a47f6d`, confirming PR #281 merged as claimed. The local clone sits at `6d6cccb` — the same change pre-squash, not the merged SHA. Anything measured against the local clone was measured against a commit that is not on main.

### Merged vs deployed, per component

| Component | Merged to main | Deployed and serving |
|---|---|---|
| cortex-api manifest endpoint | Yes (ldt b9807f7e, #391) | **Yes** — 00488-qif, 100% traffic, live 200 with 3,302 cells |
| Command Center manifest panel | Yes | **Yes** — bundle index-BhrwlQ4M carries the render logic |
| Engine #281 bulk acquisition | **Yes** — origin/main 8a47f6d | **Not applicable / not deployed** — this is batch-script code, exercised by operator-run CLI, not by a deployed service |
| 19-county TxGIO allowlist | Yes (c48a90ce) | N/A — CLI, run manually |

The engine row is the one to hold onto: **#281 is merged but its benefit is unrealized until someone runs the script, and no apply-leg run has happened.**

**Verdict: HOLDS.**

---

## WHAT WOULD BLOCK L2

Ordered by severity.

**1. There is no statewide acquisition path. (Blocking, finding 4.)** `TXGIO_COUNTIES` is a 19-entry hardcoded allowlist identical to the 19 already loaded; the CLI hard-fails on anything else and no bulk loader exists. Nothing about a 235-county program is executable today. The fix is contained — roster-driven county resolution over the uniform `stratmap25-landparcels_{fips}_lp.zip` template, plus an orchestrator with resume — but it is unwritten, unvalidated, and unrun. **No commitment should be made on the assumption that this path works, because it has never been asked to.**

**2. The write path has no test coverage. (Blocking.)** `upsertTxgioParcels` and `deleteCountyParcels` appear in zero tests. Idempotency and replace-semantics are documented in comments only. Before 235 runs, the delete-then-load sequence needs a test proving re-run convergence, and the non-transactional window between delete and load needs either a transaction or a documented recovery procedure.

**3. `satisfied-absent` overstates at county granularity. (Blocking for any external use of the number.)** 235 of 236 satisfied cells derive from one hardcoded string applied identically to all 254 counties via `roster-load`, with no per-county verification. It is correct about unincorporated territory and silent about every incorporated city inside those counties — Houston, San Antonio, Dallas. Either narrow the cell's scope to unincorporated-only with a separate city-zoning rail, or relabel the state so it cannot be read as "this county's zoning is handled."

**4. texasCompletenessPct is 99.2% definition. (Blocking for external reporting.)** 4.723 of 4.759 is doctrine; 0.036 is measurement. The arithmetic is exact, but the metric currently tracks a definition rather than progress. It must never be quoted externally without the doctrine/measured split, and a doctrine-free companion number should be published alongside it.

**5. The 2.12x figure cannot govern program throughput. (Blocking for planning.)** Both legs exclude the write path; the sample population was 78% early-exit. The apply-leg cost of write-then-verify plus promote is unmeasured, and per-parcel Neon round-trips on this deployment run 91–102 ms — comparable on their own to the entire claimed 156 ms. A single apply-leg run with `--force-overwrite --promote` at a few hundred parcels would settle this cheaply and should precede any throughput-dependent commitment.

**6. `satisfied-present` at zero coverage, and the missing `absenceBasis` in the UI. (Non-blocking, fix cheaply.)** Fifteen counties including Dallas and Bexar render `satisfied-present` with `honestCoveragePct: 0`; the rollup handles them correctly but the label misleads. And `absenceBasis` is absent from the CC bundle, so the doctrine justifying every ABS chip is invisible to the operator.

**Not blocking:** storage (34–37 GB statewide, ample), connections (901 vs 17 in use), rollup arithmetic (exact), manifest grid structure (exact), cell-state synthesis precedence (correctly fail-closed), deployment state (all serving, no traffic trap).

---

## WHAT I COULD NOT DETERMINE

1. **Neon plan limits.** Not discoverable via SQL — no `neon_` catalog views or plan metadata are exposed to the `neondb_owner` role on either database. I could measure sizes and `max_connections` (901) but not the account's storage ceiling, compute autosuspend policy, or overage terms. **A 34–37 GB projection is only safe if someone confirms the plan's storage ceiling out-of-band via the Neon console.**

2. **Actual apply-leg per-parcel cost.** No artifact measures `promoteDepthWarmToStorage` write-then-verify, `promoteHonestVerifyDecline`, or `boundaryEdgesRead` under load. I bounded it (each Neon round-trip 91–102 ms, direction one-way upward) but deliberately did not synthesize a multiplier. Requires one apply-leg run.

3. **Whether the apply path can be bulk-hoisted** the way #281 hoisted the read path. This is the question that actually determines statewide throughput and I found nothing addressing it.

4. **Rural bytes-per-row.** 1,124.6 is derived entirely from metro-dominated counties. Rural parcels have larger, more complex geometry; the true statewide figure is probably higher, making 18.9 GB a soft upper bound.

5. **Whether `txgio_parcel_staging` (2.6 GB) is transient or accumulates** per load. If it scales with the statewide load rather than being truncated, the storage projection needs revision.

6. **Whether `place_layer_snapshots` (10 GB, already the largest table) scales with parcel count.** If the PMTiles bake grows proportionally, it — not `txgio_parcel` — becomes the dominant storage consumer statewide.

7. **Ingest wall-time per county.** No artifact records elapsed time for any TxGIO county load. Travis is a 346 MB download at batch size 250; without a measured baseline I cannot estimate the 235-county serialized duration.

8. **Whether Donley (48129) has any parcel source at all.** It is the sole county absent from StratMap with a null `parcel_count_est`, silently excluded from the 13,360,496 denominator. Its acquisition route is unknown.

9. **Provenance of the brief's 16.6% seam figure and 4,617,181 parcel count.** I measure 6.95% and 4,606,751. The gaps are small but I could not locate the source computation to reconcile the difference in method.
