# P2-JURIS join rewrite (F-01) — Tier 2 scratch

## LESSON
PostgreSQL Hash Join is not in the method set unless a join qual is equality. MATERIALIZED CTE + bbox inequalities + ST_Intersects is Nested Loop of CTE scans with no index. Zone-major in the SQL text is not zone-major in the plan.

## LESSON
`isMillionRowCteNestedLoop` is three whole-text conjuncts. An inner Nested Loop (city x county) plus both CTE Scans fails a correct Hash Join. City-side `NOT MATERIALIZED` makes conjunct three unrepresentable. `CTE Scan on counties` does not match `cities(_ok)?`.

## DEAD-END
`NOT MATERIALIZED` on `parcels_six` to clear the classifier. Inlines 1M GeoJSON decodes. If Nested Loop remains those decodes run per city.

## DEAD-END
`enable_nestloop=off` without an equality. Planner errors: could not devise a query plan.

## DEAD-END
GiST on a CTE. `CREATE INDEX` refused by the RO file-side guard. TEMP forbidden. Base geometry is GeoJSON text.

## GROUND-TRUTH
2026-08-31 file-side: worktree `P:/seat-worktrees/property/hauska-factory-p2-juris-join` HEAD `a7a804220ad046ac3c70e286d61c83595bb3afe3`. `node --test test/p2-juris-sql.test.mjs` 7 pass / 0 fail. POISON rejected. HASH_CTE accepted. 01 DO kept. 05 no LIMIT. Timeouts 180s / 30s. TOTALS UNMEASURED.

## LESSON
08-30 split 357269/624141 is unrecoverable. Origin is amendments prose, no SQL. execute_plan_review falsifier 15 already said so. Do not reconcile to it.

## LESSON
SS-W15 Caldwell `no-parcel-geometry` is the PostGIS column (with_geom=0). jsonb geometry was populated. 01 decodes jsonb, so 08-31 Caldwell is 100% ring. Do not copy the SS-W15 refusal as a jsonb-ring method.

## DEAD-END
Treating 2026-07-24 BREADTH table line 42 (24989/24989 zoning-fact vs ledger) as a Caldwell geometry measurement. The columns are zoning-fact rows, not rings.

## GROUND-TRUTH
2026-08-31T14:40Z file-side: baseline discarded. Join tree 96e3ef4 plus uncommitted 06/07/08/scout. `node --test test/p2-juris-sql.test.mjs` 9 pass / 0 fail.

## GROUND-TRUTH
2026-08-31T15:21:37Z–15:26:02Z: minted direct neondb URI (ep-lucky-truth, not pooler), cleared after. 00+06 one session. RO refuse: durable CREATE TABLE. Snapshot 1222/254/1568849/981410. Hays 06 SELECT cancelled at statement_timeout 180s. Session wall 263687 ms. Exit 3. No emit. Record `_inbox/2026-08-31_p2_juris_hays_06_timeout.md`.

## LESSON
06 cancel does not establish that ring decode is not the 01 cost (A). B (06's own city×parcel product) voids that elimination. A is not established.

## GROUND-TRUTH
2026-08-31 scout: RO refuse, no 00. Wall 2147 ms. SCOUT_CHUNK_BOUNDS 48209 lo 100002 hi 159378 county_distinct 116420 chunk_distinct_verified 40000. `_inbox/2026-08-31_p2_juris_scout_emit.md`.

## DEAD-END
Seventh interactive scan (05_range / 07) after scout produced bounds but no A/B mechanism. 180s is the psql session, not the work. Stop. Job template #40.

## OPEN
Containment on P2 job template (chunk, ledger, resume). Interactive 01/06/07 stopped. TOTALS UNMEASURED. A unestablished.
