# F1 flood metro rescope — Tier 2 scratch

## CP1 (registered 2026-08-12 before measurement)

- **approachExpected:** `postgis-pip`
- **rationale:** D2 grid failed because mega-zones span most cells (vertex-volume dominated). PostGIS 3.5.0 is live (A2); footprint pattern (geom + GiST + ST_Intersects) already proven. Flood plan is JS PIP against mega-polygons — exact class PostGIS indexes solve. Expect zone table is jsonb+bbox today (D1 EXPLAIN Seq Scan on bbox cols); adding geom+GiST is the whole answer if index is missing.
- **NOT expected:** geometry-simplification first (riskier, only if PostGIS insufficient). Hybrid only if PostGIS candidate set still needs exact JS for parity edge cases.
- **predictedPlanMs48171:** 400 (SQL join overhead may beat or match small-zone JS; modest win/loss OK)
- **predictedPlanMs48099:** 15000 (target: ≥100× vs D2 writer 1,818,708; still plan-dominated but metro-viable)
- **harrisEstimateSecAfterPrediction:** ~900 (at ~15s plan per 31.5k ≈ 0.48 ms/parcel × 1.52M)
- **metrosViablePrediction:** true if 48099 planMs < 60_000 and parity identical
- **parityGate:** atom sets must match D2 baseline exactly (48171 31745; 48099 31584)

## Slot discipline

Lane A1 holds atoms bulk-writer. NO writer --apply. Dry-runs + SQL EXPLAIN / geom backfill on NFHL staging table only (198k rows, not atoms).

## GROUND-TRUTH (2026-08-12 schema probe)

- PostGIS 3.5 USE_GEOS=1 USE_PROJ=1 USE_STATS=1 — CONFIRMED
- `tx_fema_nfhl_flood_zone`: 198,178 rows, geometry jsonb MultiPolygon, **NO geom column**, **NO GiST** — only PK + bbox btree + dfirm btree
- CP1 approachExpected `postgis-pip` STANDS: adding geom+GiST is the missing half of the answer
- A2 pattern: ADD COLUMN geom geometry(...,4326) → batched ST_GeomFromGeoJSON UPDATE → GiST; query via ST_Contains/ST_Intersects
- Flood zones are MultiPolygon → use unconstrained `geometry` or MultiPolygon, NOT Polygon

## GROUND-TRUTH (2026-08-12T13:5xZ — schema half DONE, executor)

Report: `P:/tmp/f1_nfhl_geom_populate_report.json`. Branch `feat/f1-flood-postgis-pip`, commit `9d5df41`, pushed. No PR (planner owns).

- `tx_fema_nfhl_flood_zone.geom geometry(Geometry,4326)` LIVE on deployment Neon; `tx_fema_nfhl_flood_zone_geom_gist_idx` LIVE; table ANALYZEd.
- **198,178 / 198,178 populated, 0 failures, 4 batches of 50k, 501 s wall.** Geometry-type histogram is **100% MULTIPOLYGON** — the `Polygon`-only column would have rejected every single row, not just the multi ones.
- Both scripts idempotency-verified by re-run: apply emits only "already exists, skipping"; populate reports `updatedTotal=0`, `pending=0`.
- GiST **IS used** in all three plan shapes: `Index Scan` (single point), `Bitmap Index Scan` (county envelope), `Index Scan` inside the LATERAL (batched). Candidate lookup is **0.89 ms** for 1,265 candidate zones.
- atoms store at measurement: **22,525,477** rows; `flood-hazard-fact` **2,524,094** across **181** counties (was 2,386,353 / 177 in `_STATE`) — A1's apply is in flight, so the atoms numbers are rising. Flood staging table is static, so the perf conclusion has shelf life; the atoms figures do not.

## LESSON — THE INDEX WAS NEVER THE WHOLE ANSWER (grades CP1)

**Raw geom + GiST: 17.425 ms/point. ST_Subdivide(geom, 256): 0.209 ms/point. 83x, byte-identical answers** (both 995/1000 matched, both 37 SFHA).

CP1 predicted `planMs48099 = 15000` on the assumption that "adding geom+GiST is the whole answer if index is missing". Measured projection for 48099's 31,584 parcels: **raw ~550 s (misses by 37x)**, **subdivided ~6.6 s (beats by 2.3x)**. Harris ~1.52M parcels: **raw ~7.4 h** (i.e. no better than the JS path D1 measured at 8+ h), **subdivided ~5.3 min**.

Root cause is **geometry size skew, not index absence**: vertex counts p50 **81**, p99 **15,352**, max **1,372,407**; largest single geometry **21 MB**; 3,075 zones over 10k vertices; **3,428 MB** of geometry total. The GiST index finds the candidate in under a millisecond and then `ST_Contains` detoasts and runs GEOS over a multi-megabyte polygon. `Buffers: shared hit=1,810,766` for 1,000 points — ~1,810 buffers per point, all cache hits, so this is warm-cache CPU cost, not IO.

**This is the SAME vertex-volume failure that killed the D2 grid index, in a new costume.** The scratch already recorded "D2 grid failed because mega-zones span most cells (vertex-volume dominated)" and then predicted PostGIS would solve it by indexing. Indexing changes which polygons you test, never what testing one costs. Generalize: **when a cost is dominated by per-object size, no index fixes it — you must shrink the objects.**

## OPEN (for planner / sibling)

- **A persistent subdivided flood-zone table is required for metros.** The plain geom column shipped here is necessary but not sufficient. Statewide subdivide build cost is **UNMEASURED** — the only datapoint is 70.3 s to shred the 1,265 zones in the 48099 envelope into 51,311 pieces. Naive scaling to 198,178 zones is not valid (cost concentrates in the mega-polygons). Needs its own sizing before dispatch.
- Subdivide design open questions: max-vertices tuning (256 used, untested against 128/512); dedupe on `zone_row_id` when a point lands in two pieces of the same zone; whether it becomes a materialized table, a partial table for high-vertex zones only, or a rewrite of `geom` in place.
- Sibling owns the plan path + the 48171/48099 parity gate; nothing in this half touches plan logic.
- Boundary semantics still OPEN and unaddressed here: `ST_Contains` excludes the boundary, JS ray-cast may not. 5 of 1,000 sample points matched no zone — not investigated whether any are boundary cases.

## DEAD-END

- Do NOT expect the plain `geom` + GiST column to make metros viable on its own. It is measured, it is live, and it projects ~7.4 h for Harris. Retrying it hoping for a different number wastes a slot.

## LESSON — SHARED WORKING TREE ATE THIS WORKER'S FILES

`P:/hauska-engine` is a **shared** working tree. Mid-task a sibling checked out `feat/rrc-pipeline-fact` in it, which moved HEAD off my branch and **removed my untracked script files**. The DB work survived because it was already committed to Neon; only local files were lost. Recovered by rewriting into the isolated worktree `P:/hauska-engine-worktrees/f1-postgis-pip` and committing immediately.

Also: that worktree is **shared with the sibling F1 worker on the SAME branch**, which had uncommitted changes to `plan-county-flood-hazard.ts`, `flood-hazard-fact/index.ts`, `write-flood-hazard-fact-county.mjs` plus new `postgis-flood-plan.ts` and two test files. I staged **only my four paths by explicit path**; a `git add -A` or `git commit -a` would have swept a sibling's half-finished work into my commit. **Rule: in this fleet, never stage by wildcard, and never leave work untracked while running anything slow.**

## GROUND-TRUTH (2026-08-12T14:5xZ — plan half DONE, executor)

Report: `P:/tmp/f1_postgis_plan_path_report.json`. Branch `feat/f1-flood-postgis-pip`, commit `ef4179f`, pushed on top of the sibling's `9d5df41`. No PR. No `--apply`; every county number is a dry run.

- **Parity is bit-identical, not merely count-identical.** Added a stable plan digest (sha256 over sorted parcel_key to zone/sfha/bfe outcomes) to dry-run output. JS grid, PostGIS zone-major and PostGIS point-major all produce the SAME digest on both bracket counties: 48171 `9c68dd79`, 48099 `2535f3f2`. Atom counts and SFHA splits match D2 exactly (48171 31745 = 1/31744; 48099 31584 = 1063/30521).
- 48099 planMs **1,818,708 (D2) to 5,025** = 362x. Re-measured JS this session was 975,672, so 194x against a same-session baseline.
- 48171 planMs 1,122 (JS) to 1,411 (PostGIS) — marginally slower, expected, 60 zones in bbox so JS was never the bottleneck there.
- Harris (48201) measured DIRECTLY against real parcel centroids, not extrapolated: **1.222 ms/parcel** at both 25k and 50k batches, so **~1,862 s (31 min)** plan phase for 1,523,641 parcels. The mission-specified extrapolation from the 48099 rate gives 242 s and understates by 7.7x, because plan cost tracks the vertex volume of zones in the county bbox, not parcel count.
- **metrosViable: TRUE.**

## LESSON — THE QUERY SHAPE WAS THE ANSWER, AND IT PARTLY OVERTURNS THE SUBDIVIDE CONCLUSION ABOVE

The mission's suggested shape — per-point `LEFT JOIN LATERAL` over the zone table — is what the schema half measured (17.4 ms/point) and is reproduced here at 34.7 ms/parcel on 48099 full-county. Reordering the join so ZONES are the outer loop makes the same raw `geom` column 218x faster: bbox-filter the zones into a **MATERIALIZED** CTE once, then `CROSS JOIN LATERAL` the point array against it. Each mega-MultiPolygon is then detoasted once per BATCH and amortized across ~25k points instead of once per point.

Measured: 0.159 ms/parcel on 48099 zone-major vs the 0.209 ms/point the sibling measured for the ST_Subdivide table. **So the subdivided table is an optimization, not a prerequisite.** The scratch above records "A persistent subdivided flood-zone table is required for metros" — that is now too strong. Subdivide is still probably worth building (Harris at 1.222 ms/parcel is 7.7x the 48099 rate, so per-object size still shows through, and the two techniques may compound) but metros do not gate on it.

Generalize, refining the earlier lesson: when cost is dominated by per-object size, an index does not help — but you have two moves, not one. **Shrink the objects, OR restructure the loop so each object is touched once.** The scratch jumped straight to shrinking. Reordering was cheaper and shipped first.

## LESSON — `MATERIALIZED` IS LOAD-BEARING, AND ITS ABSENCE FAILS AS A HANG

Dropping `MATERIALIZED` from the zones CTE during an optimization pass let the planner inline it, which pushed the bbox filter below the lateral join and restored the per-point detoast cliff. A 25k-point batch had not returned after 10 minutes. It reads like a cosmetic keyword and is not. Guard shipped: `f1_pip_scaling_probe.mjs` runs the real query at increasing batch sizes under a `statement_timeout`, so the cliff surfaces as a timeout rather than a hang.

## LESSON — BOUNDARY SEMANTICS DIVERGE, AND IT DID NOT MATTER (closes an OPEN above)

`ST_Contains` is false on an edge or vertex; the JS ray-cast in `pointInGeoJson` counts some boundary positions as inside. Real parcel centroids never land exactly on FEMA zone edges, so the divergence did not fire on either bracket county and pure PostGIS holds parity. Encoded rather than assumed: `src/__tests__/fixtures/flood-pip-cases.ts` carries BOTH verdicts per case plus an explicit `PIP_EXPECTED_DIVERGENCES` list, so a future change that accidentally aligns or further diverges the two breaks a test. A `hybrid` backend (ST_Intersects candidates plus JS arbitration) is built and smoke-tested as the escape hatch, but is unused.

## LESSON — `postgres.js` SILENTLY MAKES A JSONB STRING SCALAR

`sql.unsafe(..., [JSON.stringify(obj)])` bound to `$4::jsonb` stores a jsonb **string**, not an object: `jsonb_typeof` returns `string` and `geometry->>'type'` is null. Surfaced as a baffling `PostgresError: unknown GeoJSON type` from `ST_GeomFromGeoJSON`. Fix is the double cast `$4::text::jsonb`. Same trap will bite any fixture or writer that round-trips GeoJSON through this driver.

## LESSON — PowerShell `Tee-Object` writes UTF-16LE

`Tee-Object` produced UTF-16LE with a BOM; `readFileSync(p, "utf8")` then yields garbage and `JSON.parse` fails on `\ufffd\ufffd{`. Sniff the BOM (`buf[0]===0xff && buf[1]===0xfe → "utf16le"`) rather than assuming. Same family as the UTF-8-BOM progress-file trap already recorded in `_STATE`, different encoding.

## CLOSE (planner 2026-08-12T15:05Z)

- Artifact: `_inbox/2026-08-12_F1_flood_metro_rescope_close.json`
- approachChosen: **postgis-pip** (zone-major); simplification NOT used; hybrid unused
- metrosViable: **true**; PR **#315** merged @ `25842d1`; CI success
- CP1 48099 prediction CONFIRMED; 48171 absolute ms REFUTED (RTT); schema-half "subdivide REQUIRED" REFUTED as metro gate
- Planner fix: ORDER BY zone_row_id on JS zone load (8ad9e54)
- atoms at CP2: 25,259,558 � shelf life
- OPEN residual: ST_Subdivide remains an optional densest-county optimization, not a gate; metro apply awaits operator dispatch + free A1 slot
