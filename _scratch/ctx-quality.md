# CTX quality scratch

GROUND-TRUTH 2026-08-31T08:40-05: Austin present vs reached. Overlap 0.001342 deg2 (134229× 1e-8), real straddle. Bbox reach 4142/116421 (3.56%). Vertex budget fails as the cancel. Driver un-named. Finding `_inbox/2026-08-31_p2_juris_austin_present_vs_reached.md`.

LESSON 2026-08-31T08:40-05: A guard that matches an echo label is not a check on the SQL. Q2 was bbox-only; the ST_Intersects "got 1" was the label.

OPEN 2026-08-31T08:40-05: P2-JURIS cost driver un-named. Per-city reach × npoints offered, not licensed. Range-chunk live, empirical only, no size. Do not produce a fifth mechanism.

GROUND-TRUTH 2026-08-31T08:33-05: cities_ok npoints. Hays 43205 vs Bastrop 4649 (9.29×). Austin 32811 = 76% of Hays, 7.1× Bastrop whole. Kyle 1551. Geometry holds. Gap: present vs reached. Finding `_inbox/2026-08-31_p2_juris_cities_ok_npoints.md`.

OPEN 2026-08-31T08:33-05: Austin-Hays overlap_deg2 vs 1e-8, plus Hays parcel bbox ∩ Austin bbox count. No full ST_Intersects on 116k. Range-chunk waits. Travis/Williamson not run (also contain Austin).

GROUND-TRUTH 2026-08-31T08:30-05: Plan C Hash Join like B. parcels_six est 13135 actual 116421 (~8.9x under, same degree as Bastrop 8x). Cost 596047. Hays-full cancel is runtime. Nested Loop is slice-only. Finding `_inbox/2026-08-31_p2_juris_explain_c.md`.

OPEN 2026-08-31T08:30-05: Geometry probe next: ST_NPoints/ST_Area on cities_ok 48209 vs 48021, totals and per-city. No 01. Range-chunk waits. If vertices do not differ, stop offering mechanisms.

GROUND-TRUTH 2026-08-31T08:25-05: EXPLAIN A vs B. Hays 30k Nested Loop (parcels_six est 1841, actual 30000). Bastrop Hash Join (est 8018, actual 62257). Cheaper plan cancelled. LIMIT subquery opaque. Identity-slice is instrument defect. Chunk-linear confounded, re-opened. Finding `_inbox/2026-08-31_p2_juris_explain_a_b.md`.

OPEN 2026-08-31T08:25-05: Plan C licensed: EXPLAIN no ANALYZE of Hays-full 01, no LIMIT subquery. Hash/Merge like B means runtime. Nested Loop like A means estimate flips Hays without a slice. Do not cut another IN (SELECT LIMIT) chunk.

LESSON 2026-08-31T08:25-05: A chunk cut the planner cannot see (LIMIT inside GROUP BY ORDER BY) is not a volume test. It is a plan-flip test wearing a volume name.

GROUND-TRUTH 2026-08-31T08:19-05: Hays 30k slice cancelled at 180s. Exit 3, 218s. Chunk-linear retired. Caldwell 25k emits in 78s; Hays 30k does not. Cost driver is per-county and unidentified. Three curve-fits lost. Board updated `_inbox/2026-08-31_p2_juris_partition_record.md`.

OPEN 2026-08-31T08:19-05: Next licensed run is EXPLAIN no ANALYZE of Hays 30k vs Bastrop full. Same join. If plans differ, that is the answer. If same shape, plan flip is out. Do not pick a chunk. Do not raise timeout.

GROUND-TRUTH 2026-08-31T08:12-05: Hays-scoped 01 cancelled at 180s. Exit 3, 217s. City-count retired. Boundary is parcels between 62257 and 114255. Runtime superlinear. Per-county covers two of six. Board `_inbox/2026-08-31_p2_juris_partition_record.md`.

OPEN 2026-08-31T08:12-05: Next licensed run is Hays 30000 by ORDER BY prop_id, equality kept, 180s. Not TABLESAMPLE. Not a bbox. Do not pick chunk size first. Do not run Travis/Williamson. 6 still unnamed.

GROUND-TRUTH 2026-08-31T08:02-05: McLennan-scoped 01 cancelled at 180s. Exit 3, 263s wall. Parcel-only fit predicted ~156s. Per-county is two counties, not six. Boundary between 62257 and 114255. Leading mechanism parcels × cities-in-county (roster touches, not this-run cities_ok). Finding `_inbox/2026-08-31_p2_juris_mclennan_timeout.md`.

OPEN 2026-08-31T08:02-05: Hays 48209 next. Discriminator: ~same parcels as McLennan, 13 roster touches vs 21. Emit supports city-count. Cancel supports parcel-range. Do not pick the split first. Do not raise timeout. 6 still unnamed.

GROUND-TRUTH 2026-08-31T07:56-05: Caldwell-scoped 01 emitted. 14361 / 10628 / 0 / 24989. Exit 0, 78s wall, denom exact, 100% ring, slivers 155 (0.62%). Volume confirmed. Nothing adopted. Statewide TOTALS UNMEASURED. Finding `_inbox/2026-08-31_p2_juris_caldwell_emit.md`.

OPEN 2026-08-31T07:56-05: McLennan 48309 next (114255, smaller bound county). Equality kept. Cancel is the stronger signal. Hays after. 6 still unnamed, not a gate.

GROUND-TRUTH 2026-08-31T07:47-05: Probe6 (Bastrop, equality dropped) cancelled at 180s. Exit 3, 230s wall. 6 unnamed. Remainder open. Equality is what makes Bastrop tractable. Set-diff starved: 49939 is a literal, not identities. Finding `_inbox/2026-08-31_p2_juris_probe6_timeout.md`.

DEAD-END 2026-08-31T07:47-05: Naming the 6 by dropping county equality against all 1222 cities. Same 62257 parcels, ~100x city side, 180s cancel. Do not rerun. Do not raise timeout.

OPEN 2026-08-31T07:47-05: Caldwell 48055 next, equality preserved. Naming the 6 waits on a cheaper CP1-preserving probe (adjacent-county cities that do not intersect 48021, against unincorporated non-sliver Bastrop only). Cities overlapping 48021 is the wrong cut.

GROUND-TRUTH 2026-08-30T23:15-05: Bastrop-scoped 01 emitted. 50265 / 11992 / 0 / 62257. Exit 0, 129s wall, denom exact, 100% ring, CDP 0, unresolved 0. Query correct; six-county cancel is volume. +326 vs prior 49939 = 320 slivers + 6 unnamed. Neither adopted. Statewide TOTALS UNMEASURED. Finding `_inbox/2026-08-31_p2_juris_bastrop_emit.md`.

OPEN 2026-08-30T23:15-05: Name the 6 before absorbing. Same Bastrop decoded, same 1e-8, drop only county_fips equality; if in-city becomes 11998 the 6 are cross-county hits (join CP1 semanticRisk). Then the other five, knowing Travis and Williamson will likely cancel at 180s. Per-county is not yet the plan.

GROUND-TRUTH 2026-08-30T23:02-05: Timed 01 cancelled at 180s. Factory join 96e3ef4, 00+01 one psql session. RO refuse verbatim. Snapshot 1222/254/1568849/981410. No TOTALS row. Wall 271s. Plan gate (Merge Join 3.78e7) necessary, not sufficient. Not the 1/0 / Nested-Loop-CTE defect. Do not raise timeout. Do not adopt. Finding `_inbox/2026-08-31_p2_juris_01_timeout.md`.

LESSON 2026-08-30T23:02-05: EXPLAIN cost is not runtime. 05 already estimated 1 row on the 981k join. Treating 3.78e7 as "will finish" ignored the cardinality lie the same instrument printed.

OPEN 2026-08-30T23:02-05: Next 01 is Bastrop-only (`decoded` WHERE county_fips = '48021'), same join, same 180s. Emit partitions volume from plan. Cancel means the Merge Join is still not doing what the estimate suggests. Statewide TOTALS stays UNMEASURED either way.

GROUND-TRUTH 2026-08-30T22:50-05: Timed 01 via Neon MCP run_sql_transaction returned MCP error -32001 Request timed out. That is the HTTP client, not a Postgres 180s cancel. TOTALS still UNMEASURED. Do not adopt a split. Do not raise statement_timeout. Next 01 needs a session that outlives the MCP HTTP window (psql / 00_session.sql). SET LOCAL default_transaction_read_only on MCP did not bind: CREATE TABLE in the next statement succeeded, then the DO exception rolled it back (to_regclass leftover null).

OPEN 2026-08-30T22:48-05: Gate 8 inhabited-floor + landUse bake agents are out on isolated trees. Planner reviews diffs when they return. Card binding: floor sits in front of dayOne; empty arm must fail; inhabited must stay C3/C4/C7 fail matching 02:56Z; no retry; failed fetch is refused. P4 apply held.

GROUND-TRUTH 2026-08-30T21:04-05: TOTALS UNMEASURED. RO proof passed on unmodified 00_session.sql (durable CREATE TABLE refused). Input snapshot 1222/254/1568849/981410. 01:202 1/0 inside aggregate CASE is fatal always. Neutralised join Nested Loop CTE Scan parcels_six x cities_ok, cost 1.06e10, >180s. Nothing adopted, written, or staged. Decision `_decisions/2026-08-31_p2_juris_totals_unmeasured.md`.

LESSON 2026-08-30T21:04-05: A literal 1/0 in a CASE inside an aggregate target list evaluates regardless of the condition. The same CASE outside an aggregate short-circuits. The empty-city DO block already covers the case. A LIMIT 1 EXPLAIN is not the 981k plan.

LESSON 2026-08-30T21:04-05: The 1.3s containment figure was the city-to-county roster (1222 x 254), not parcel containment (981410 x 1222). Using one join's timing for the other made containment look cheaper than alias seeding. That claim is unproven.

DEAD-END 2026-08-30T21:04-05: Raising statement_timeout will not fix a Nested Loop of two MATERIALIZED CTE scans. Zone-major in the SQL text is not zone-major in the plan.

GROUND-TRUTH 2026-08-30T22:40-05: Live Gate 8 does not unblock P4. dayOne C3/C4/C7 pass was vacuous on an empty body (W1 fail). Independent fetch of the same gold URL 200 / 10717 bytes / landUse A1. Last inhabited grade remains 02:56Z fail/fail/fail. Do not create writer jobs. Finding `_inbox/2026-08-31_p4_gate8_live_finding.md`.

GROUND-TRUTH 2026-08-30T22:36-05: 0005b applied. Staging 6xmvn, production gz6fj. Record names filename + invocation. Dry and apply were separate. First dry qgv2q failed: PowerShell collapsed args to one string.

GROUND-TRUTH 2026-08-30T22:32-05: P4 allowlist ids renamed to factory-atoms-wells / factory-atoms-footprint / factory-conformant at d4721ff. Retired p4-* names refuse WRITER_NOT_ALLOWLISTED. requireWriterJob still Factory-CLI only; engine and direct gcloud are the named bypass.

GROUND-TRUTH 2026-08-30T22:25-05: Live 05 PASS. Merge Join on county_fips, cost 3.78e7. isMillionRowCteNestedLoop false. cities_ok inlined. No CTE Scan on cities_ok. Timed 01 not run. TOTALS UNMEASURED. Proof `_inbox/2026-08-31_p2_juris_live_05_proof.md`. SQL Factory 96e3ef4.

GROUND-TRUTH 2026-08-30T22:20-05: Four lanes committed, not pushed, not applied. Join 96e3ef4. Bake a3f0adf. P4 1e61de4. Leftover e1355730. Dirty p1-edges not merged.

OPEN 2026-08-30T22:18-05: SUPERSEDED 22:20-05. All four parallel lanes file-side accepted. None committed. None applied. Next planner-run: live 05 (join), pin+dry+apply 0005b (bake), leftover pathspec commit, P4 writer jobs then apply. Setbacks HOLD. Do not Wave R.

OPEN 2026-08-30T22:15-05: SUPERSEDED 22:18-05. Bake-migrate file-side accepted (65497160). 0005b not applied. Pin then dry then apply is planner-run. P4 7ac45d46 still running. Join waiting on live 05. Leftover accepted, uncommitted.

OPEN 2026-08-30T22:12-05: SUPERSEDED 22:15-05. Leftover file-side accepted (ee3e087e). One assemble line plus tests. Do not merge dirty p1-edges. P4 7ac45d46 and bake 65497160 still running. Join rewrite waiting on live 05.

OPEN 2026-08-30T22:10-05: SUPERSEDED 22:12-05. Join rewrite file-side accepted (8c113b02). Live 05 still the gate. Do not commit that tree until EXPLAIN. Other three still running: P4 7ac45d46, bake 65497160, leftover ee3e087e.

OPEN 2026-08-30T22:00-05: SUPERSEDED 22:10-05. Four parallel lanes fanned. P4 rails 7ac45d46 on hauska-factory-p4-rails. Join rewrite 8c113b02 on hauska-factory-p2-juris-join. Bake-0005b 65497160 on hauska-factory-bake-migrate. P1 leftover ee3e087e on legacy-design-tools-p1-leftover. Subagents do not commit. Planner reviews write paths then commits.

GROUND-TRUTH 2026-08-30T21:56-05: LDT #560 serving. cortex-api-00672-ceq 100% digest sha256:37f77bfe. Gate 8 dayOne C3 fail / C4 fail / C7 fail. C7 hits are descriptor-fixture only. setbackProvenance null. road-class-setback-table gone. C3/C4 same as pre-deploy. P4 setback HOLD. Proof `_inbox/2026-08-31_f11_ldt_c7_reread.md`. Rollback 00670-bay sha256:679683fd.

GROUND-TRUTH 2026-08-30T21:36-05: SUPERSEDED 21:56-05. LDT #560 MERGED 8f11e81b. Head was b35dde08 (12215749 plus origin/main 1b539598 / #561, clean). Typecheck+Test SUCCESS on that SHA. Not deployed. C7 leave_behind. P4 setback HOLD.

GROUND-TRUTH 2026-08-30T21:18-05: Factory #42 MERGED a7a8042. CASE gone. DO kept. 05 unlimited. Not a join rewrite. TOTALS still UNMEASURED. Next is a plan that is not Nested Loop of parcels_six x cities_ok.

GROUND-TRUTH 2026-08-30T21:12-05: SUPERSEDED 21:18-05. Factory #42 opened at 7bd21de. https://github.com/empressaioemail-tech/hauska-factory/pull/42. CASE gone. DO kept. 05 unlimited. Not a join rewrite. TOTALS still UNMEASURED.

OPEN 2026-08-30T21:10-05: SUPERSEDED 21:12-05. Plan-gate fix on `hauska-factory-p2-juris-plan` (`seat/property-ctx-p2-juris-plan`): drop 01 1/0 CASE, keep DO block, 05 unlimited EXPLAIN, assert-explain-plan rejects Nested Loop CTE scans. Not a join rewrite. Not measured TOTALS. Do not raise the timeout. Do not revoke neondb_owner.

OPEN 2026-08-30T21:04-05: SUPERSEDED 21:10-05. Drop 01:202 CASE. Keep the DO block. 05_explain must gate the unlimited plan (no Nested Loop of parcels_six and cities_ok CTE scans) before another timed run. Lane chooses the rewrite. Persist still waits on measured TOTALS. Production neondb_owner was not revoked.

GROUND-TRUTH 2026-08-30T20:41-05: 0005a CHECK proven on factory-conformant-migrate-q7rd2 (sha256:4bd728c5). INSERT kind=absence probed_at NULL refused 23514 constraint landing_setback_registry_absence_probed. rolled_back true, survived 0. Template restored to args=migrate. Proof `_inbox/2026-08-31_0005a_check_live_proof.md`.

GROUND-TRUTH 2026-08-30T20:41-05: Engine #366 MERGED 80fb9069. LDT f11-ldt committed 12215749 PR https://github.com/empressaioemail-tech/legacy-design-tools/pull/560. C7 leave_behind until deploy; after deploy still hits sourceAdapter=descriptor-fixture.

DEAD-END 2026-08-30T20:41-05: 0005b has no bake-migrate job. applyMigrations reads migrations/ only. factory-publish-migrate args=migrate + FACTORY_DATABASE_URL. Do not laptop-apply 0005b. Need a job that applies migrations/bake/ on STAGING_NEONDB_URL / PRODUCTION_NEONDB_URL.

GROUND-TRUTH 2026-08-30T20:44-05: PE prod deploy dpl_7N1GtdZYBCg8WiTWYjtkYCuvpFVA READY, aliased https://smartsite.cloud. Live bundle `/assets/index-CgJc9x-_.js` sets `document.documentElement.dataset.hauskaBuild="bb02f3b503bdcc463a31eb3286429de2c8757ae1"`. Equals origin/main #316 merge. Accepted.

OPEN 2026-08-30T20:44-05: TOTALS GO. Planning agent mints short-lived RO, refuses CREATE TEMP, runs 00+01 vs 357269/624141/981410, deletes key. #560 CI then merge then LDT deploy then Gate 8 C7. 0005b job still unbuilt. P4 wells needs a compiled dispatch. P4 setbacks HOLD until #560 lands and C7 is re-read. p1-ldt HOLD.

GROUND-TRUTH 2026-08-30T19:37-05: F-11 engine committed `293633a` on `seat/property-ctx-f11-setback`. PR https://github.com/empressaioemail-tech/hauska-engine/pull/366. Supervisor `_inbox/2026-08-31_f11-setback_supervisor_review.md`. CP2 `_inbox/2026-08-31_f11-setback_cp2.json`. Starved `compute.ts` guard removed before commit (could not fail). 18/18 local. CI in flight. Atoms not deleted. Store unmeasured.

LESSON 2026-08-30T19:37-05: `road-class-setback-table` is already gone from writers. What still serves is stored edge provenance. Retirement is consumer refuse plus a write-grep, not another resolver comment. Nulling placeholder slots looks like absence; mark `unknown` and keep the atom.

DEAD-END 2026-08-30T19:37-05: C7 cannot go green from hauska-engine. LDT `boundaryEdgeFactRead` still copies `lead.setback` onto `boundaryEdgeFact`. Do not start that refuse on the dirty p1-ldt tree or the p2b-serve checkout.

OPEN 2026-08-30T19:37-05: #366 CI. Isolated LDT tree for C7 refuse of `road-class-setback-table` on `boundaryEdgeFact` (C3/C4 stay still). Store measure needs `ATOMS_DATABASE_URL`. P4 setback hold releases after C7. #316 merged `bb02f3b`; deploy still HOLD. p1-ldt worktree is not empty vs `13ec82d4` (DrawEdge leftovers); do not close or merge that branch.

GROUND-TRUTH 2026-08-30T19:37-05: LDT #558 MERGED `13ec82d4`. Map #316 MERGED `bb02f3b`. Deploy map still HOLD.

GROUND-TRUTH 2026-08-30T19:21-05: factory-conformant-migrate-c2h5d succeeded on sha256:4bd728c5 (gen 23). stdout `{ok:true, ran:["0005a_landing_setback_easement.sql"]}`. Factory file list has 0005a and not 0005b. Live INSERT absence+null probed_at still UNPROVEN. 0005b unapplied.

GROUND-TRUTH 2026-08-30T19:18-05: F-11 compiled fe0bb09 `_dispatches/2026-08-31_f11-setback_dispatch.md`. Three populations: dimensional value untouched; road-class refused; 188,103 placeholders unknown. Atoms marked not deleted. C7 without C3/C4 moving. Tree `P:/seat-worktrees/property/hauska-engine-f11-setback` at 2c90b99. CP1 `_inbox/2026-08-31_f11-setback_cp1.json`.

GROUND-TRUTH 2026-08-30T19:17-05: factory-conformant-migrate still on sha256:cd065530 (2026-08-28). Does not contain 0066f5ca. Cloud Build 744af220 submitted from detached origin/main dfe1e24 (0066f5ca is ancestor; 0005a present). A-008: wait for that image, then execute migrate, then live INSERT absence+null probed_at must refuse. 0005b bake neondb only. No laptop. No Neon mint from this seat.

OPEN 2026-08-30T19:18-05: Build 744af220 in flight. F-11 lane in flight. #558 update-branch then merge then p1-ldt diff. #316 typecheck fix 2dd8ffb pushed; deploy HOLD until merge. TOTALS UNMEASURED; planning agent has NEON_API_KEY and offered to mint short-lived RO. This seat will not mint without operator word.

GROUND-TRUTH 2026-08-30T18:40-05: Planning board filed `_decisions/2026-08-30_ctx_fan2_planning_board.md`. Item 8 amended: `fd0dfe7` adds `source_url_verified_at` on `landing_easement_gis` plus synthesised-unverified CHECK. Fail-arm first (column missing), then 10/10. Six branches pushed. PRs: factory #38 #39 #40 #41, LDT #558, map #316. Merge #38 first. Deploy map HOLD. TOTALS still UNMEASURED (no RO URI in this env). 0005a apply is the Factory migrate job, not a laptop (A-008).

OPEN 2026-08-30T18:44-05: #38 and #39 merged. #41 updating onto that main. #40 merge-resolved at 907f584, CI pending. #558 typecheck fixture fix pushed. RO TOTALS still UNMEASURED (no URI here). 0005a apply is Factory migrate job (A-008). Do not deploy #316. F-11 waits on operator word. Wave R parked.

GROUND-TRUTH 2026-08-30T18:14-05: SUPERSEDED 18:40-05 on push/PR wait. Fan 2 was local; now pushed.

OPEN 2026-08-30T18:14-05: No write lanes in flight. Next work is planner-owned: RO TOTALS; 0005a live CHECK; 0005b bake apply; persist Cloud Run after TOTALS; push/PR after planning ruling. Do not Wave R.

GROUND-TRUTH 2026-08-30T18:10-05: alias-persist job commit `a892fab` on `seat/property-ctx-p1-factory`. `--apply` calls `applyAliasLandingRows`. Missing table refuses. Laptop needs GO + run row. 0005b unapplied. Grade `_inbox/2026-08-30_alias-persist-job_supervisor_review.md`.

GROUND-TRUTH 2026-08-30T18:08-05: P2-JURIS session commit `a99112f` on `seat/property-ctx-p2-juris`. 01 is CTE-only. Guard fail-arm rejects CREATE TEMP + LATERAL. Live TOTALS UNMEASURED. Persist not executed. Grade `_inbox/2026-08-30_p2-juris-session_supervisor_review.md`.

GROUND-TRUTH 2026-08-30T18:06-05: Map marker + PE copy commit `5804025` on `seat/property-ctx-map-marker`. UNSTAMPED throws locally. This parcel / Land use / no A1-A1 / yearBuilt with source. Not deployed. Not customer-done. Grade `_inbox/2026-08-30_map-marker-pe_supervisor_review.md`.

GROUND-TRUTH 2026-08-30T18:04-05: alias-persist helper commit `57e8b66` on `seat/property-ctx-p1-factory`. `wroteLanding` tracks `INSERT INTO landing_cad_txgio_alias`. insertLanding is not a write. Job on walk-alias still prefers insertLanding. Grade `_inbox/2026-08-30_alias-persist-wire_supervisor_review.md`.

GROUND-TRUTH 2026-08-30T18:02-05: P2-JOB pathspec commit `989010d` on `seat/property-ctx-p2-job`. Supervisor: `p2-juris` → COUNTY_REQUIRED; laptop `--apply` → LAPTOP_WRITE_FROZEN; 12/12. Persist not executed. Grade `_inbox/2026-08-30_p2-job_supervisor_review.md`.

GROUND-TRUTH 2026-08-30T17:59-05: Gate 8 pathspec commit `f95313a` on `seat/property-ctx-gate8`. Instrument + CI job only. `close-county` / 0006 / county-cost left unstaged. Not pushed. Not a Cloud Run job.

GROUND-TRUTH 2026-08-30T17:58-05: P1-FACTORY pathspec commit `53f8b36` on `seat/property-ctx-p1-factory`. 10/10. 0005a/0005b unapplied. alias-persist still starved. Not pushed. Not deployed.

GROUND-TRUTH 2026-08-30T17:57-05: P2b-serve pathspec commit `c70560aa` on `seat/property-ctx-p2b-serve`. 77 pass. `_leave_behind/` untracked. Not pushed. Not customer-done. Do not merge P1-LDT first.

OPEN 2026-08-30T18:05-05: SUPERSEDED 18:14-05. alias-persist job landed `a892fab`.

OPEN 2026-08-30T18:00-05: SUPERSEDED 18:14-05. Fan 2 write lanes all graded and locally committed.

GROUND-TRUTH 2026-08-30T17:50-05: LDT reconcile applied on `legacy-design-tools-p2b-serve`. Null-neighbour is unknown. Retired dropped. 77 tests pass. Note `_inbox/2026-08-30_ldt_drawedge_reconcile.md`. Do not merge P1-LDT first.

GROUND-TRUTH 2026-08-30T22:50Z: P2b-serve write path reviewed. Present-with-id requires reciprocity pass. sourceVintage both arms. yearBuiltFromBake gone. Null-neighbour still ships present (suite asserts it). Grade `_inbox/2026-08-30_p2b-serve_supervisor_review.md`. SUPERSEDED on the null-neighbour present by the 17:50-05 reconcile.

LESSON 2026-08-30T22:50Z: Two LDT trees cut the same DrawEdge files from 28969a36. P1 unknown-on-no-id + retired filter. P2b reciprocity-on-id + vintage. Merge either first without a reconcile list and one hole returns.

OPEN 2026-08-30T22:50Z: Five lanes graded, none committed. Next on operator word: reconcile LDT, then pathspec commits. Do not apply drafted 0005. Do not Wave R. Not customer-done.

GROUND-TRUTH 2026-08-30T22:44Z: Gate 8 production gold `48021:34137` property-atoms body: landUseFact present A1 / baseFacts.landUse null; envelope ok 9350 sqft / no summary.buildableAreaPct; setback provenance `road-class-setback-table`. Selftest F3–F6 F8 fail their own assertions. Grade `_inbox/2026-08-30_gate8_supervisor_review.md`.

LESSON 2026-08-30T22:44Z: Gate 8 production rollup includes C1/C2/C5. Those refuse without DOM. P4 must key `dayOne` C3/C4/C7, not `production.verdict`.

GROUND-TRUTH 2026-08-30T22:44Z: P1-LDT `chooseDrawEdgeState` has no default present. Retired dropped in interpret and assemble. All-retired refuses. ROW+34121 stays unknown. Grade `_inbox/2026-08-30_p1-ldt_supervisor_review.md`.

OPEN 2026-08-30T22:44Z: P2b-serve still in flight. Gate 8 map marker and P1-LDT commit wait on operator word. Do not treat either as customer-done.

GROUND-TRUTH 2026-08-30T23:50Z: P1-FACTORY write path reviewed in `hauska-factory-p1-controls`. Items 1–3 MET. Item 4 PARTIAL (SQL split yes; live CHECK and alias-persist --apply no). `node --test test/p1-controls.test.mjs` 10/10 in that tree. Grade `_inbox/2026-08-30_p1-factory_supervisor_review.md`.

LESSON 2026-08-30T23:50Z: `applyAliasLandingRows` reports `wroteLanding` after a mock `insertLanding`. A pg client never inserts. Same starve as alias-persist --apply that counted a write it did not perform.

OPEN 2026-08-30T23:50Z: P1-FACTORY uncommitted. Do not apply drafted 0005. 0005a Factory then live absence INSERT. 0005b bake neondb only. Wire alias-persist to requireAliasLandingTable and a real INSERT. Gate 8 county job waits on a deployed refuse image.

GROUND-TRUTH 2026-08-30T23:45Z: P2-JURIS read SQL reviewed at `P:/seat-worktrees/property/hauska-factory-p2-juris/sql/p2-juris/`. Zone-major. Floor `1e-8`. No LATERAL. CDP assert present. Live TOTALS UNMEASURED. Grade `_inbox/2026-08-30_p2-juris_supervisor_review.md`.

LESSON 2026-08-30T23:45Z: A read-only session that `CREATE TEMP TABLE`s cannot run. `00` sets `default_transaction_read_only = on`. `01` drops and creates five temp tables. Neon replicas refuse the same. Prove RO with a durable write refuse, or rewrite the join as CTEs.

OPEN 2026-08-30T23:45Z: P2-JURIS persist still leave_behind. Do not mint a write URI to dodge the RO hole. Do not adopt a new 357,269 / 624,141 split. P1-FACTORY close is on disk and unreviewed.

OPEN 2026-08-30T22:29Z: Five lanes in flight. Supervisor CP1 `_inbox/2026-08-30_ctx_five_lanes_cp1.json`. Subagents do not commit. Review each diff before any commit.

OPEN 2026-08-30T22:23Z: Five dispatches ae89dc3. Separate trees. Gate 8 steps 1–2 start now and unlock P4 (served body). Browser walk unlocks P7. 0005b ships (CAD↔TxGIO identity). P2-JURIS read now / persist after P2 job. P2b-serve only — do not use the PE wiring card. Same checkout is a hard no.

OPEN 2026-08-30T22:16Z: Four dispatches compiled dc58be7. Carry P1-FACTORY first, P1-LDT beside, then Gate 8 + P2-JURIS. Containment replaces alias. unincorporated is the CDP disposition. P2b has no dispatch in this batch. Do not apply 0005. Do not Wave R. Do not give a CDP a place_fips.

GROUND-TRUTH 2026-08-30T22:16Z: Three-state split is 357,269 / 465,568 / 3,732. 826,569 is not one state. P2-JURIS must reconcile to 357,269 / 624,141 or the join is wrong. Alias seed is name-normalisation for the 48% that carry a string.

OPEN 2026-08-30T18:49Z: Execute waves P0–P8 filed. P0 landed (OPS-1 A12, measured owe, 72 cities). Next go is three lanes: P1 controls, P2 alias seed (long pole), P2b PE. Do not apply 0005. Do not re-run landing-import. Do not run F-18. Do not Wave R.

GROUND-TRUTH 2026-08-30T18:49Z: Review refused collect-as-written. Caldwell wells 53,841 and footprint 35,269. Flood 981,620 on all six. Edges owed ~154,841. 826,569 not-applicable. 72 cities. 0005 would invent absence over Austin 150,702.

OPEN 2026-08-30T16:55Z: Collect WDLL drafted. Canvas restamped. Review handoff `_inbox/2026-08-30_ctx_w3_collect_review_handoff.md`. Review agent grades the plan only. Do not fetch. Do not apply 0005. Do not Wave R.

OPEN 2026-08-30T16:50Z: Collect program drafted `_inbox/2026-08-30_ctx_w3_collect_WDLL.md` (status draft). Factory is the collector (L2) and the atomizer (L3). Do not fetch from a laptop. Do not live-query ArcGIS inside a writer. Do not start Band C until the operator approves the WDLL. 0005 still not applied. Wave R still paused.

GROUND-TRUTH 2026-08-30T16:25Z: Alias persist committed `866c38b` on `seat/property-ctx-walk-alias-schema`. Job `alias-persist`. --apply needs GO + run row + --target stores. Card H parser fail-closes without parcelJoin.txgio_id. 14/14. Not applied. Not pushed.

LESSON 2026-08-30T16:22Z: A persist job whose --apply only writes when tests inject clients is starved. The CLI path reported wroteLanding and inserted nothing. Fix: target-scoped stores or a named refuse.

GROUND-TRUTH 2026-08-30T16:42Z: Pushed. Factory https://github.com/empressaioemail-tech/hauska-factory/pull/37 (866c38b). LDT https://github.com/empressaioemail-tech/legacy-design-tools/pull/554 (c7685e6a). Operator pause. Bake is premature.

OPEN 2026-08-30T16:42Z: PAUSED. Do not apply 0005. Do not Wave R. Do not treat Band 1 as the next click. Resume when the operator says so.

GROUND-TRUTH 2026-08-30T16:10Z: W1 LDT committed `c7685e6a` on `seat/property-ctx-w1-bake` (parent `7cbe0bc4`). Planner-reviewed write path. 142 tests. Situs-extend off. Seed stays. Not pushed. No bake.

GROUND-TRUTH 2026-08-30T16:09Z: Factory S5 feed committed `701b9d5` on `seat/property-ctx-walk-alias-schema`. Rainmaker is walked, not a sweep neighbour. 85/85. Not pushed. Not on a publish image.

OPEN 2026-08-30T16:10Z: Next code is alias persist (card items 3, 4, 6, 7, 8). Factory worktree free after S5. Do not apply 0005 from a laptop. Do not Wave R. PE still undeployed (`62a5ec5`).

LESSON 2026-08-30T16:08Z: Unioning roster ids into the walk without naming the refusal on fixture bodies fails S5 for real. That is the feed working. Tests that serve a generic fullTier1Body must name the roster reason or they are the violation.

GROUND-TRUTH 2026-08-30T15:43Z: PE band 0 committed `62a5ec5` on `seat/property-ctx-pe-wiring`. Not pushed. Not deployed.

GROUND-TRUTH 2026-08-30T15:42Z: Live facets. Pine `48021:34137` structuralFact.state=present yearBuilt=1910. Laird `48453:231086` zoning status=absent verdict=stamp-missing with five doc-19 fields. PE BFF copy predicate matches both. Not deployed.

LESSON 2026-08-30T15:42Z: #310 already admitted the verdicts on the client guard. The missing change was BFF `layerAbsenceFromRecord` copying them onto the PE payload. A type union without a copy is the #310 shape.

OPEN 2026-08-30T15:42Z: PE item 7 after Band 2 deploy. Do not treat the PE commit as customer-done.

LESSON 2026-08-30T15:40Z: Walk S5 is starved unless Rainmaker is fetched. Loading the roster in runVerifyWalk is a trigger with an empty input. S4 on the served body's own ring is internal consistency, not a second derivation. CP2 `_inbox/2026-08-30_ctx_band0_cp2.json`.

GROUND-TRUTH 2026-08-30T15:40Z: Factory band 0 committed `6ecc021` on `seat/property-ctx-walk-alias-schema` (parent `7f41f523`). Planner-reviewed. 88/88 on walk-scrub + alias-schema + publish. Item 9 drop reason rejected. Not pushed. No persist, no ingest, no bake.

OPEN 2026-08-30T15:40Z: Feed S5 (union county roster ids into the walk list, not as sweep anchors). Owner-agree still UNMEASURED. PE [PE wiring](8bf899e9-8e5c-41b7-9156-80abd2de6d8c) still in flight. Do not Wave R.

OPEN 2026-08-30T10:33-05: Band 0 in flight. Walk [Factory walk](134c6259-28a5-4831-9bce-d4be96e06ab0) handed back. PE [PE wiring](8bf899e9-8e5c-41b7-9156-80abd2de6d8c) spawned. W0b landUse MET. Recount writeReport guard MET (live JSON hash unchanged). Owner-agree UNMEASURED (situs-key SQL timed out). W1 blocked. Do not invent a go.

OPEN 2026-08-30T10:20-05: A-029. Persist CAD to TxGIO situs binds as `identity.alias` + landing. Wave R reads alias first. Backfill card H joined-situs before bake. W1 emits new binds; Factory writes atoms. Decision `_decisions/2026-08-30_ctx_cad_txgio_alias.md`. Card `_inbox/2026-08-30_ctx_w1_alias_WDLL.md`. Seed stays.

OPEN 2026-08-30T10:10-05: Parallel waves filed `_inbox/2026-08-30_ctx_parallel_waves.md`. W0b blocks W1 LDT only. After operator review: spawn Band 0 (Walk, PE, F-11 recon, Ease schema, Abs, Recount, Alias schema) together; W1 waits on W0b 1–2. Band 1 applies slot-aware. No Wave R until verify. No subagent commits. No second bake.

OPEN 2026-08-30T09:58-05: A-028. Complete = finished dataset or honest absence. RRC must surface this pass (apply well-fact; do not read tx_rrc_well in PE). Three tables to build: F-11 setback landing, easement GIS landing (4 layers), rail-absence serve. W3 gates Wave R. SUPERSEDED on "W0b still first for all code" by the 10:10-05 OPEN.

OPEN 2026-08-30T09:50-05: Operator locked one more pass, CTX complete, one bake, no second bake. A-027. SUPERSEDED on rails-out by A-028. W0b still blocks code. Do not bake. Do not run recount --self-test on the live JSON.

GROUND-TRUTH 2026-08-30T14:45Z: Remainder review `_inbox/2026-08-30_ctx_remainder_deep_review.md`. Six load-bearing findings. Parent amended. W1 amended. PE, walk, W0b cards cut. Waves decision superseded by `_decisions/2026-08-30_ctx_one_more_bake.md`.

GROUND-TRUTH 2026-08-30T14:02:24Z: Rainmaker vs gold on same card H run e2c5c6d7. Rainmaker joined TxGIO 57429, PDD, land-use atom A1 (2026-08-12), yearBuilt 2021, livingArea CAD null, envelope null, well/footprint/boundary atom-miss. Pine same landUse bake miss, same well/footprint miss, boundary 4 fixture edges from 2026-07-29. CAD leftover 8720522 living_area_sqft null. County edges on 3732 of 77799 parcels. "100% complete" at Open = ledger cad/geometry 100% plus gold Connect ring_and_edges, not Rainmaker 14-rail. Recon `_inbox/2026-08-30_rainmaker_open_complete_recon.md`.

LESSON 2026-08-30: Map GIS outline and brief `property-boundary-edge` are different stores since P-53. A yellow highlight plus county geometry 100% is not an edge atom. Do not treat Rainmaker atom-miss as a card H wipe.

OPEN 2026-08-30T14:45Z: Session closed. Next agent reads `_inbox/2026-08-30_ctx_remainder_deep_review.md` first, then `_sessions/2026-08-30_ctx_remainder_and_rainmaker_wiring_claude_code.md`. Do not start W1 until the operator routes the review. Do not treat `_state/property/STATE.md` as current.

OPEN 2026-08-30T14:05Z: W1 still next. PE copy (grey box, Zone vs zoning, yearBuilt) parallel. Do not mint a Rainmaker ring in a wiring pass. Do not bake yet. SUPERSEDED by the 14:45Z OPEN (review lock).

OPEN 2026-08-30T13:52Z: W0 closed enough to unblock W1. Live remainder 232770 unstamped 0,0. Travis no-row still 119389 (situs not tried). PE labels partial (not-stamped, not stamp-missing/unmeasured). Next: W1 LDT card (situs-extend + tax year), Factory point index, PE label follow-up in parallel. Do not code P-80 in W1. Do not bake yet.

GROUND-TRUTH 2026-08-30T13:48:33Z: production place_layer_snapshots recount `_inbox/2026-08-30_ctx_w0_residue_recount.json`. Six card H runs. unstamped_sentinel 232770. seed leak 0.

OPEN 2026-08-30T13:48Z: W0 live recount starting. Heavy read on production place_layer_snapshots (six place_key ranges, adapter node-facets:tier1). Column is payload_json plus lat_rounded/lng_rounded, not body. First SQL failed on missing body (named). Gold peek: Kyle joined-situs R-1 with a real point; Taylor gate-blocked 0,0; Shoalwood no-row 0,0; Laird joined with a point.

OPEN 2026-08-30T13:40Z: CTX complete waves drafted on the Land canvas. Facts first (W0 recount+PE probe, W1 point+tax-year code, W2 P-80 only if recount says cannot-bind, R one rebake). Rails (W3) land in parallel and get a later publish. Do not rebake after each card. Do not start W1 without a WDLL. Seed stays. Do not invent P-80 in W1.

OPEN 2026-08-30T13:25Z: New shape landed. Six walked card H production publishes on sha256:7bef3ce7. Cycle stopped. CTX residue still owed: named point source for leftover 0,0 / no-row (pre-H 534,700; post-H unmeasured), Travis 119,389 no-row (P-80 parked), Hays/Williamson situs residue (Taylor gate-blocked is success), two tax years, F-11 zoning stamps, F-08 R1, PE probe after #310 Vercel. Do not restart scllr. Do not lift the seed. Do not invent P-80.

OPEN 2026-08-30T09:40Z: Wave 2 production DONE. Six walked publishes on sha256:7bef3ce7. Cycle stopped. PE label words still need a live PE probe after hauska-map #310 Vercel. Do not restart scllr. Do not lift the seed.

GROUND-TRUTH 2026-08-30T09:39Z: Williamson production `8ghwj` pass 4a4efa03 written 602050 / 602050. Gold 48491:76149 TAYLOR 76574 `parcelJoin.state=gate-blocked` (situs recovery refused). Seed did not leak.

GROUND-TRUTH 2026-08-30T06:23Z: Hays production `x2rw7` pass 003cdc7c written 304332 / 173050. Gold 48209:135570 KYLE 78640 `parcelJoin.state=joined-situs`, landUse `cad-roll-address-join`, zoning R-1. Seed did not leak.

GROUND-TRUTH 2026-08-30T05:30Z: Travis production `hhxg2` pass bb77fa65 written 873766 / 500307. Gold 48453:493738 AUSTIN 78756 `unmeasured` / `no-row`.

GROUND-TRUTH 2026-08-29T20:45Z: McLennan production `kkdm4` pass 70a92b2a written 113090 / 114255. Gold 48309:176914 WACO 76711 `stamp-missing` `parcelJoin.state=joined`.

DEAD-END 2026-08-29T20:36Z: One-shot sleep watchers get aborted. Six-hour stall. Next wake is 15m because Travis is long. If the session dies, resume from this scratch OPEN.

GROUND-TRUTH 2026-08-29T20:22Z: Caldwell production `jptqt` pass cd961998 written 73159 / 48649. Gold 48055:20478 LOCKHART 78644 RMD `parcelJoin.state=joined`.

GROUND-TRUTH 2026-08-29T20:11Z: Bastrop production `vzfnd` pass e2c5c6d7 written 61695 / 77799. Gold 48021:34137 and neighbour 34729 serve BASTROP 78602 SF-1 `parcelJoin.state=joined` run e2c5c6d7.

GROUND-TRUTH 2026-08-29T20:08Z: Travis staging `9kspw` pass f16d018f written 873766 / 500307. Gold 48453:493738 `unmeasured` / `no-row`.

GROUND-TRUTH 2026-08-29T20:04Z: Williamson staging gold 48491:76149 `parcelJoin.state=gate-blocked`, landUseAddressRecovered false, TAYLOR 76574, zoning unmeasured. Honest refuse. Not `joined`.

DEAD-END 2026-08-29T18:53Z: `--update-env-vars=OPERATOR_PUBLISH_GO=1,PRODUCTION_SITE_URL=https://smartsite.cloud` on PowerShell writes one env. Job exits TARGET_ENV_MISSING. Two flags.

GROUND-TRUTH 2026-08-29T18:51Z: Hays staging gold 48209:135570 `parcelJoin.state=joined-situs`, landUse `cad-roll-address-join`, KYLE 78640, zoning R-1, run 198b728c.

GROUND-TRUTH 2026-08-29T17:44Z: Cloud Build `8c3c7d9f` SUCCESS. Local `gcloud builds submit` poller aborted; the remote build finished. Job generation 18 image matches. `_LDT_SHA` 889b1556.

GROUND-TRUTH 2026-08-29T17:37Z: H merged LDT #548 `889b1556`. Factory pin #36 merged `7f41f523`. Seed unlifted.

GROUND-TRUTH 2026-08-29T17:03Z: card G planner re-run 42 passed; commit e9e9581 (+60 -3 on three PE files). Closed set is five verdicts. Display is the verdict string.

GROUND-TRUTH 2026-08-29T17:00Z: Travis written vs rows are different units (recon `_inbox/2026-08-29_ctx_travis_recon.json`). Planner verified parcelNodeIdFromBody drops nid_, written increments on ON CONFLICT, loadConformantPropIds is DISTINCT, CP1 500307, F-10 landing 873766. No SQL this recon.

LESSON 2026-08-29: "open the join" on 48209/48491 is not `LANDUSE_JOIN_DISABLED_FIPS_SEED.delete`. The seed exists because prop_id fabricates. The old bake already recovers on situs + ownersAgree. The conformant bake never called that path.

GROUND-TRUTH 2026-08-28T19:48Z (card F CP1, pre this card): Hays 172,282 and Williamson 602,050 gate-blocked; 534,700 unstamped 0,0 sentinels across the six.

DEAD-END: lifting the seed to "open" Hays/Williamson. That reprints the collision the gate was built to stop.
