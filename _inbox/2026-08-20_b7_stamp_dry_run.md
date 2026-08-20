# RETURN-B7.md — worker B7 (corpus stamp PREPARE AND DRY-RUN ONLY)

SNAPSHOT: repo hauska-engine, commit 3b221d0444affd6b31497fe4f95172b21ac15a65, worktree P:/tmp/mp-b-flood-chain, branch fix/flood-geo-failclosed.

HEAD confirmed VERIFIED: `git rev-parse HEAD` printed `3b221d0444affd6b31497fe4f95172b21ac15a65`. Did not revert B5 or B6. No git add, commit, push, or PR. No `--apply`. atomsWritten=0 on every run. No UPDATE/INSERT/DELETE/DDL against neondb or hauska_mcp.

Database snapshot (read path only): cortex-prod fancy-fire-06136146, database neondb, user neondb_owner, host ep-lucky-truth-apodo8hr-pooler.c-7.us-east-1.aws.neon.tech, UTC 2026-08-20. CORTEX_DATABASE_URL came from Neon MCP `get_connection_string` for that project/role/database. DATABASE_URL / SUBSTRATE_DATABASE_URL were unset in the shell so the atoms store could not be opened.

---

## Pre-registered ways this output could be wrong (before the runs)

1. Wrong population, coincidental 229. `--limit` applied to the post-skip 5,750 instead of the first 6,000 DISTINCT ON (feature_index) rows, so a different set yields 229 that is not SS-W17's 229. Check: parcelsRead=6000 AND skippedUnusableKey=138 AND duplicate drops=112 AND plannable=5750, AND the SS-W17 fixture's 120 not-contained keys are a subset of this run's refused. Violation: `--limit=100` must not produce notContained===229.

2. Brewster MultiPolygons collapsed into not-contained or unmeasurable, or counted as 0, so the county chosen for 5,553 MultiPolygons does not exercise B5's typed absence. Check: multipartCentroidNullLoaded against an independent DISTINCT ON (feature_index) MultiPolygon count, and those keys absent from containment.notContained. If that bucket is 0, the stamp is not on the path the county was picked for.

Both checked before reporting. Results below.

---

## Commands actually run (verbatim argv; secret not pasted)

Shell: FLOOD_HAZARD_FACT_PATH=1, CORTEX_DATABASE_URL set, DATABASE_URL unset, no `--apply`.

```
pnpm --filter @hauska-engine/engine-core run write-flood-hazard-fact-county -- --county=48021 --plan-only --out=P:/tmp/mp-b7-48021-violate.ndjson --limit=100
pnpm --filter @hauska-engine/engine-core run write-flood-hazard-fact-county -- --county=48021 --plan-only --out=P:/tmp/mp-b7-48021.ndjson --limit=6000
pnpm --filter @hauska-engine/engine-core exec tsx scripts/_b7-diff-tmp.mjs
pnpm --filter @hauska-engine/engine-core run write-flood-hazard-fact-county -- --county=48043 --plan-only --out=P:/tmp/mp-b7-48043.ndjson
```

pg_stat_activity was empty of concurrent queries before Bastrop and before Brewster. Counties serialized. Local NDJSON only.

Writer instrumentation (uncommitted, 33 lines in `write-flood-hazard-fact-county.mjs`): plan-only header now carries `containment`, compact `refused[]`, `multipartCentroidNullLoaded`, `nullGeomLoaded`, `centroidNullAbsences`. Plan logic, skip rules, and apply path were not changed. Default remains apply:false. `--apply` was never passed.

---

## Check grades (input type, cheapest satisfier)

229 equality. Input type: stamper `plan.containment.notContained` versus SS-W17 recorded 229 on the same 5,750. Meaning-shaped (two independently derived tallies). Cheapest presence-shaped fake: `notContained > 0` (satisfied by 1). Observed FAIL: 271. Violation observed first: `--limit=100` produced notContained=7, not 229.

Population 5,750. Input type: writer skip rules on the first 6,000 DISTINCT ON rows. Meaning-shaped (6000 loaded, 138 unusable, 112 duplicate, remainder 5,750). Cheapest wrong: `--limit=5750`. Observed PASS: 6000 / 138 / 112 / 5750.

Brewster MultiPolygon-null. Input type: load-time (`geometry.type==='MultiPolygon'` AND `geometryCentroid===null`) versus SQL DISTINCT ON MultiPolygon count, versus the settled 5,553 row count. Meaning-shaped. Cheapest false pass: report 805 as if it were 5,553. Observed: 805 matches DISTINCT ON features; does not match 5,553 rows.

Store-gate vs same-object PIP. Input type: B6 store-gated refused keys versus `pointInGeoJson(centroid, same page geometry)`. Meaning-shaped. Cheapest contamination: pass the centroid-page GeoJSON as the store. Observed: same-object = 229; store-gated = 271; extra = 42.

---

## 1) Bastrop 48021 — adjudicated sample

SS-W17 close (`_inbox/2026-08-19_ss-w17_close.json`): first 6,000 DISTINCT ON (feature_index); 138 unusable prop_id; 112 duplicate keys; 5,750 plannable; notContained=229, contained=5521, unmeasurable=0.

Stamper (`--limit=6000`, plan-only, planBackend=postgis, atomsWritten=0):

| bucket | count |
| --- | --- |
| parcelsRead | 6000 |
| skippedUnusableKey | 138 |
| duplicate-key drops | 112 |
| plannable | 5750 |
| contained | 5478 |
| not-contained | 271 |
| unmeasurable | 0 |
| B5 MultiPolygon centroid-null (loaded = plannable) | 1 (prop_id 126418) |
| null jsonb geometry | 0 |
| refused by reasonCode | sample-point-outside-parcel 271 |

Finite-point three-state sum: 5478 + 271 + 0 = 5749. Plus 1 B5 absence = 5750. States not collapsed.

**229 match: MISS. Actual notContained=271. Did not round toward 229.**

Same-object reconstruction on the identical 6,000-row page, live B5 `geometryCentroid` + `pointInGeoJson` against the SAME GeoJSON (the SS-W17 contaminated signature, diagnostic only, not the stamper): notContained=229, contained=5520, centroid-null=1, unmeasurable=0. That is SS-W17's 229 exactly, with the one MultiPolygon pulled out of contained into B5 absence (SS-W17 contained=5521 = 5520 + 126418).

SS-W17 fixture 120 not-contained keys: 120 of 120 are in the stamper's 271. 0 missing.

42 extra store-gated not-contained keys (first 20): 10250, 10584, 10657, 10705, 10745, 109133, 110080, 11017, 11121, 112897, 113833, 11406, 11441, 118199, 11982, 12046, 12392, 128429, 13113, 133284. Full extra set and the 271-key list live in `P:/tmp/mp-b7-48021.ndjson` header `refused[]` and `P:/tmp/mp-b7-48021-diff.json`.

Violation slice `--limit=100`: notContained=7 (keys 103273, 10342, 109440, 109472, 109488, 112238, 112546). The 229-equality check can fail; it then failed on the target population too.

---

## Finding: 271 versus 229

Mechanism: `loadTxgioParcelRingStore` writes `store.set(fips, prop_id, geometry)` once per DISTINCT ON (feature_index) row. Duplicate prop_id across feature_index overwrites the ring. `selectPlannableParcels` first-key-wins on the centroid (lower feature_index). The query point is computed from feature A and tested against feature B's ring. Independent SQL on extra keys: 10250 has feature_index {1634,1635}; 10584 has 5 rows; 10657/10705/10745 each have 2.

Second mechanism that would produce 271: B5 Polygon centroid arithmetic changed, so 42 more vertex-means fall outside their own ring. Rejected: same-object PIP with the live B5 centroid still yields 229, and missingStoreVsSameObject=0 (every same-object not-contained is also store-gated not-contained). The store gate is a superset, not a different centroid.

The 1 MultiPolygon (126418) is a separate, expected B5 delta: SS-W17's part-one centroid was contained; live `geometryCentroid` returns null; it never reaches B6 containment.

---

## 2) Brewster 48043 — full DISTINCT ON county

Settled row counts (planner 2026-08-20): 35,619 parcels, 5,553 MultiPolygon, 0 null jsonb geometry.

Writer unit is DISTINCT ON (feature_index), not COUNT(*). Independent SQL this session:

- rows 35619, features 20287, multipart_rows 5553, multipart_features 805
- DISTINCT ON page: features 20287, MultiPolygon 805, null geom 0

Stamper (no `--limit`, finished, wallMs=23882, atomsWritten=0):

| bucket | count |
| --- | --- |
| parcelsRead | 20287 (complete by DISTINCT ON; not 35619 rows) |
| skippedUnusableKey | 2345 |
| contained | 16738 |
| not-contained | 195 |
| unmeasurable | 0 |
| B5 MultiPolygon centroid-null loaded | 805 |
| B5 MultiPolygon centroid-null after skip (derived: 17708 selection - 16738 - 195) | 775 |
| planned centroidNullAbsences by reason string | 0 |
| null jsonb geometry | 0 |
| refused by reasonCode | sample-point-outside-parcel 195 |
| zonesIndexed | 0 (emptyZoneIndex true) |

Finite-point three-state sum: 16738 + 195 + 0 = 16933. B5 MultiPolygon-null is a fourth bucket, not folded into not-contained (195) or unmeasurable (0).

The 5,553 row-count does not appear as 5,553 absences. It collapses to 805 distinct MultiPolygon features, and the stamper counted 805 at load. That is the writer's population, independently confirmed. The B5 path was exercised (805 >> Bastrop's 1). Reporting 805 as 5,553 would be the false pass named in the grade.

centroidNullAbsences=0 on planned[] is not "zero MultiPolygons." `assembleCountyFloodHazardPlan` emits empty-NFHL absence before the no-usable-centroid branch when zonesIndexed=0, so the 775 plannable null-centroid parcels inherit the empty-zone reason. Load-time 805 is the B5 bucket. Independent confirmation: NFHL bbox overlap for the county envelope = 0, and `z.geom && ST_MakeEnvelope(...)` = 0. Brewster has no NFHL rows in this table. Zone resolution for Brewster is unmeasurable, not a silent outside-SFHA.

---

## Finding: Brewster 805 versus 5,553

Mechanism: COUNT(*) MultiPolygon rows share 805 distinct feature_index values; the writer pages DISTINCT ON (feature_index) and therefore loads 805.

Second mechanism: `geometryCentroid` still answers for part 1, so MultiPolygons would look contained/not-contained rather than null. Rejected: 805 loaded rows were typed MultiPolygon with null centroid, and 0 of those 805 appear as a substitute inside notContained=195.

---

## Finding: Brewster empty NFHL

Mechanism: `countZonesInBBox` (bbox columns) and PostGIS `geom &&` envelope both return 0 for the county bbox. emptyZoneIndex is honest.

Second mechanism: the plan skipped the zone count and defaulted to 0. Rejected: `planBackend=postgis` with geomReadiness.ready true, and two independent overlap queries (bbox columns, geom envelope) both returned 0 this session.

---

## Three containment counts (never collapsed)

Bastrop 48021, 5,750 plannable: contained 5478 / not-contained 271 / unmeasurable 0, plus B5 MultiPolygon-null 1.

Brewster 48043, 20,287 DISTINCT ON features (complete): contained 16738 / not-contained 195 / unmeasurable 0, plus B5 MultiPolygon-null loaded 805 (775 after skip).

Statewide null-geom 4,354,603 was not this card's population. Both counties here had nullGeomLoaded=0.

---

## Hard-stop confirmation

No `--apply`. No atoms INSERT. DATABASE_URL unset. atomsWritten=0. Local artifacts only: `P:/tmp/mp-b7-48021-violate.ndjson`, `P:/tmp/mp-b7-48021.ndjson`, `P:/tmp/mp-b7-48043.ndjson`, `P:/tmp/mp-b7-48021-diff.json`. PR https://github.com/empressaioemail-tech/hauska-engine/pull/355 not pushed to.

---

leave_behind:
- item: uncommitted tally fields in packages/engine-core/scripts/write-flood-hazard-fact-county.mjs (containment/refused/multipart counters on plan-only JSON). Plan behaviour unchanged.
  owner: planner
  plan_row: this chain, not a new apply
- item: packages/engine-core/scripts/_b7-diff-tmp.mjs (SELECT-only 229 reconstruction). Delete or keep; not committed.
  owner: planner
  plan_row: B7
- item: ring-store last-write-wins on duplicate prop_id (Bastrop +42 not-contained vs SS-W17 229). First-key-wins centroid, last-feature ring. Not fixed here.
  owner: planner
  plan_row: needs a card if the 229 gate is still the apply bar
- item: emptyZoneIndex masks B5 centroid-null reason string (Brewster 775 null-centroid parcels labelled empty-NFHL). Load-time counter is the honest bucket.
  owner: planner
  plan_row: not this dry-run
- item: local NDJSON under P:/tmp/mp-b7-*.ndjson (no atoms). --from-plan still does not re-run containment.
  owner: planner
  plan_row: B7
- item: RETURN.md (B5), RETURN-B6.md (B6), this file. HEAD remains 3b221d0. PR #355 not updated.
  owner: planner
  plan_row: this chain
