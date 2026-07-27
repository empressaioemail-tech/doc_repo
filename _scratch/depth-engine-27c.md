# scratch: depth-engine-27c

Working memory for the road-node depth engine build (R0-R4 under `27_MASTER_WDLL_spine_completion_and_depth_engine.md`). Tier 2 — cheap, lossy, planner-gated promotion. First dogfood of M0.

## LESSON

- LESSON (CC-A U2 2026-07-27): Node atoms list = assemble from atom-chain +
  boundary-edges + road chain client-side — no `/nodes/:id/atoms` required.
  Property AtomInspector uses `GET /atoms/:did`; LIVE/AS-OF + lineage endpoints
  do not exist on property retrieval — render honest empty, do not invent.
  closeDetail PORT: `return=node-graph&node=&atoms=` restores NodeAtoms filter.
  Catalog MCP search_atoms stays the default Atoms panel; property path only
  when `return=node-graph` or `did:hauska:` id.
- LESSON (CC-A U1 2026-07-27): Serve graph via `GET /nodes/:id` + `GET /property-nodes/:id/boundary-edges` — do **not** stuff edge refs into atom-chain (keeps Gate C shape honest). CT NodeInspect edges were display-only text; property Amendment 1 requires **clickable** walk — port chrome, make edges buttons. Parcel `node=` regex must exclude `:boundary:` / `:road:` or boundary ids falsely lock as parcels. Road reverse edges not indexed — walk faces-road / adjacent-parcel from the boundary-edge card.
- LESSON (CC-A U3 2026-07-27): retrieval upstream serves `/health` only — `/healthz` and `/healthz/` 404 (Google HTML via Cloud Run). Probe must hit `/health`; BFF should alias healthz→health. Metering 403 body is `platform_internal_required` (key present but wrong tier OR gate) — honest in-panel copy, never fake LIVE. Map fork fix = extract PE LayersControl/MapTools/parcelTiles into `@hauska/map-renderer/src/chrome` and mount from CC LiveMapTile — do not invent a third shell.
- LESSON (CC-A Phase 0): F1 closed tally+pills+binding, NOT Control-Tower legibility. Atom-chain returns only zoning/setback/envelope — **no boundary/road edges**. StoragePort `listBoundaryEdgesByParcelNodeId` exists; retrieval HTTP for edges **404**. CC Atoms panel = code catalog MCP, not property inspector. Parcel Trace DEGRADED = BFF `healthz/` 404 while `/health` 200 + geocode works. Revenue Meter DEGRADED = metering **403**. Map fork: CC Site Analysis = CARTO/OSM LiveMapTile; PE = layered ExplorerMap. Port CT `NodeGraphBrowser`+`AtomInspector` (`return=` breadcrumb); do not invent UX.
- LESSON (FIX 1): site-plan naive miter falsely declined front-only 15' on 48021:34785; fix = extract `geometry/polygon-inset.ts` (strip→union→difference), wire `computeSetbackOffset` to same path as `insetPerEdge`. PR [#133](https://github.com/empressaioemail-tech/hauska-engine/pull/133) `de6f422`; vitest 289/289; parity test ~13641 sqft both paths.
- LESSON: naive per-edge miter wrong on concave rings → real polygon-offset via `polygon-clipping` strip→union→difference. PROMOTED: geometry tests + gate on main.
- LESSON: non-finite inset feet / polygon-clipping degenerate segments must become honest empty at insetPerEdge boundary (R0.1). PROMOTED: vitest throw-safety.
- LESSON: frontFromShape must filter depth-perpendicular candidates; else short edge parallel to depth wins (714 Spring 7.83m). PROMOTED: WDLL 5 test.
- LESSON (R0.2): GIS `parcel.zoningCode` can be null while baked facets already carry district — derive must read spine bake before declining `no-zoning-stamp`. Provenance must cite bake, never invent.
- LESSON: `insetFeetForLabeling` keys are `front_ft`/`side_ft`/`rear_ft`.
- LESSON: descriptors still have FLAT setbackTable — R2 indexes by (road-class, edge-role).
- LESSON (R1.1): road-node atoms carry `readContract.axes.assertedConfidence` but NOT `parcelNodeId` — never route through `applyPropertyCalibrationAtRead`; overlay keys are property-atom-only. Live: postgres `UNDEFINED_VALUE` at `pg-calibration-overlay.ts:48`. Fix: engine PR #124.
- LESSON (R3.1): never uniform-apply front setback onto not_specified axes to dodge degeneracy — try honest partial inset first (714 Spring: insetFeet=[0,0,0,0,0,15], verifyPass=true).

## DEAD-END

- DEAD-END: broadening ldt api-server esbuild conditions beyond ["workspace"] boot-crashes ("Class extends value").
- DEAD-END: jsts BufferOp / @turf/buffer as primary (uniform ≠ F/S/R).
- DEAD-END: NAIVE_MITER_BAD as RED fixture for uniform-15 on 714 — equivalent area to strip-union; use bowtie + parcel-as-inset.

## GROUND-TRUTH

- GROUND-TRUTH (2026-07-27T13:25Z CC-A U2 executor): hauska-map PR [#75](https://github.com/empressaioemail-tech/hauska-map/pull/75) SHA `1b50af9` branch `feat/cc-a-u2-atom-inspector` (off U1 main `1f5e7ab`). Vitest scoped **13/13**. Family→NodeAtoms→inspector + closeDetail return breadcrumb. Close `_inbox/2026-07-27_CC_A_U2_executor_close.md`. **Planner grades live — builder does not claim WDLL MET.**
- GROUND-TRUTH (2026-07-27T13:06Z CC-A U1 executor): engine PR [#144](https://github.com/empressaioemail-tech/hauska-engine/pull/144) `d4f175d` + map PR [#74](https://github.com/empressaioemail-tech/hauska-map/pull/74) `eac63c1` opened; both CI pass. Local fixture GET `/property-nodes/48021:28286/boundary-edges` **200** (e1→32341, e2 front→35671+road); `/nodes/48021:28286:boundary:2` edges_out faces-road + adjacent-parcel. Live cmdcenter BFF still **404** on those paths (pre-deploy). Close `_inbox/2026-07-27_CC_A_U1_executor_close.md`. **Planner must live-walk — builder does not grade.**
- GROUND-TRUTH (2026-07-27T13:05Z CC-A U3 executor): hauska-map PR [#73](https://github.com/empressaioemail-tech/hauska-map/pull/73) SHA `aa8fb04` (on `3aeec72`) branch `feat/cc-a-u3-map-and-degraded`. Live probe: `/api/spine/retrieval/health` **200**; `/healthz`+`/healthz/` **404**; `/api/spine/mcp-metering/summary` **403** `platform_internal_required`. Shared chrome at `packages/map-renderer/src/chrome` (LayersControl+MapTools+SHARED_PARCEL_TILES); CC LiveMapTile wired; PE thin re-exports via source path. Unit CC 35 + PE 79. Close `_inbox/2026-07-27_CC_A_U3_executor_close.md`. **Planner grades — builder does not claim WDLL MET.**
- GROUND-TRUTH (2026-07-27T13:17Z CC-A U1): retrieval `hauska-retrieval-api-00033-wom` @ **100%** (tag cca1u1). Live BFF: `48021:28286` nodes+boundary-edges **200**; e1→32341, e2 front ROW 15′ → road `48021:road:123456789` + nbr 35671. WDLL 6 MET. CC UI still stale bundle — Amendment 1 UI walk PENDING Vercel.
- GROUND-TRUTH (2026-07-27T13:15Z CC-A U3 planner): PR #73 merged main `8e1006d`. Live cmdcenter-blush still serves pre-U3 bundle (`index-eWdGi6qE.js` has "no interactive map"; Site Analysis still CARTO/Fixture layers). `/health` 200; healthz 404; metering 403. Grades 7–10 PARTIAL until Vercel redeploy. Check-in `_inbox/2026-07-27_CC_A_U3_planner_verify_checkin.md`.
- GROUND-TRUTH (2026-07-27T12:45Z CC-A Phase 0 live): cmdcenter-blush Node&Graph **tally LIVE** (`generatedAt=2026-07-27T12:42:59.844Z`). Inspect `48021:33512` → pills PRESENT×3 + raw JSON; hash `node=48021:33512`. Atom-chain keys only `atoms,buildableEnvelope,parcelNodeId,setbackRule,zoningFact` (28286/34785 same; boundaryishHits=0). Road chain `48021:road:123456789` **200**. Boundary `/boundary-edges`+`/edges` **404**. Parcel Trace badge DEGRADED; geocode 1101 Colorado → placeKey + honest-0. BFF healthz/ **404**, `/health` **200**. Revenue Meter BFF **403**. Site Analysis map attribution MapLibre/OSM/CARTO (not PE layered). Control Tower live Clerk-gated; port from source. Check-in `_inbox/2026-07-27_CC_A_phase0_live_reaudit_and_build_spec.md`.
- GROUND-TRUTH (2026-07-25T21:49Z): R0+R0.1+R0.2 serving `cortex-api-00438-zop` @ 100%. Merge SHAs: R0 `63bd82eb`, R0.2 `124060c1`.
- GROUND-TRUTH (2026-07-25 live): POST 714 Spring → status=ok, spineZoningSource=baked-snapshot, P-5, Polygon ring, buildableAreaSqFt=21198, edgeSignal=road (corner). Gate(zeros) pass.
- GROUND-TRUTH (2026-07-25 live): 802 Chestnut `48021:47728` ok area=8707; 1010 Pecan `48021:47595` ok area=22302.
- GROUND-TRUTH (2026-07-24): breadth done-wide; depth ~0.1%; Bastrop 62,257 zoning-facts.
- GROUND-TRUTH (2026-07-25T22:10Z): R1 merged (contract 1.11.0 npm, engine #123, map #68). Substrate has 1 Bastrop road-node `48021:road:123456789` Spring Street.
- GROUND-TRUTH (2026-07-25T22:17Z): R1.1 merged `92982a8`; retrieval `00029-jaj` @ 100%. atom-chain 200 Spring Street residential approximate-assumed-per-class attach=1. roadRollup road_nodes=1. WDLL 3 MET.
- GROUND-TRUTH (2026-07-25T22:31Z): R2 merged engine `6982cd91` + ldt `f4784cc5`; cortex `00440-fav` @ 100%. Fixture street front 15′ ≠ alley rear 5′. Live 714 Spring still no alley match (corner).

## GROUND-TRUTH (R4 executor 2026-07-25T23:39Z)

- GROUND-TRUTH: engine branch `feat/r4-bastrop-depth-cost` — Overpass bbox ingest + batch warm + cost JSON + tally SQL. CI 277/277 vitest pass.
- GROUND-TRUTH (live substrate): road_nodes 48021 = **1188** (city pilot bbox ingest; was 1 fixture). depth_warm_promoted = **1** (48021:33512 R3). zoning_facts_with_district = **5769**.
- GROUND-TRUTH (500-parcel cohort cost): wallMsTotal=2218047, msPerParcel=4425, usdPerParcel=0.000049, extrapolatedJurisdictionUsd=**0.2844**, extrapolatedWallHours=7.09, flaggedOverCostGate=**false** (<$200 gate).
- GROUND-TRUTH (cohort outcomes): promoted=0 new (450 no-road-adjacency — city bbox roads don't cover county-wide zoning cohort; 50 verify-fail gravel/service surface tag drift on re-load — fixed in branch with surface provenance + filter).

## GROUND-TRUTH (R4.1 executor 2026-07-26T00:14Z)

- GROUND-TRUTH: PR branch `feat/r4-1-city-promote-throughput`. Live tally after promote: road_nodes=1188, zoning=5769, **depth_warm_promoted=3** (48021:33512, 47728, 47595).
- GROUND-TRUTH (47728 promote): verifyPass=true, buildableAreaSqFt=9247, insetFeet=[5,15,0,0].
- GROUND-TRUTH (47595 promote): verifyPass=true, buildableAreaSqFt=24643, insetFeet=[0,15,0,0,0] (honest partial — alley rear stripped).
- GROUND-TRUTH (city cohort n=150): promoted=0 new (147 no-road-adjacency — road bbox still city-pilot not full cityBbox); verifyFail=3; extrapolatedJurisdictionUsd=0.28.

## LESSON (R4.1)

- LESSON (R4.1 root cause): batch empty-inset on cortex-enveloped city parcels was (a) footway OSM ways winning front + 15′ on small lots, (b) collector priority over residential frontage, (c) alley rear 5′ + front 15′ collapsing inset — fixed by front-eligible OSM denylist, residential-first front tie-break, honest partial inset retry (strip non-front roadClass). No not_specified fabrication.

## GROUND-TRUTH (R4.2 executor 2026-07-26T00:53Z)

- GROUND-TRUTH: branch `feat/r4-2-road-coverage-city-cohort`. Live ingest full `BASTROP_CITY_BBOX` via PowerShell fixture (4893 ways) → substrate road_nodes=**4894** (was 1188 pilot-scale).
- GROUND-TRUTH (city cohort n=150 promote): promoted=**3** new, verifyPass=3, verifyFail=146, no-road-adjacency=**1** (was ~147). Sample promote: `48021:103281` area=57077 insetFeet=[0,5,15,0].
- GROUND-TRUTH (live tally): road_nodes=4894, depth_warm_promoted=**6** (was 3), depth_ratio=**0.104%** (was 0.052%). Cost extrapolatedJurisdictionUsd=0.282.
- GROUND-TRUTH: vitest **285/285** pass on branch.

## LESSON (R4.2)

- LESSON: prior 1188-node ingest was sub-city pilot coverage, not full `BASTROP_CITY_BBOX`; county single-query 504s on overpass-api.de — default ingest scope=`city` (~4893 ways / ~6s PowerShell); `county-tiled` 3×3 for county when needed.
- LESSON: verify must pass OSM `surface=*` into `classifyOsmHighwayTag` (service+unpaved→gravel) — intake stored surface in row.provenance but verify gate ignored it → 149 verifyFail gravel/alley drift until R4.2 fix.
- LESSON: remaining city-cohort verifyFail is mostly `road-class-setback-no-match` on gravel frontage — descriptor gap, not road adjacency; separate WDLL item.

## OPEN (stale block — see below)

## GROUND-TRUTH (R4.2 planner merge 2026-07-26T01:02Z)

- GROUND-TRUTH: PR #129 `1dcd3dfa`. Live road_nodes=4894, depth_warm=6, zoning=5769. Adjacency cleared; gravel descriptor gap remains.

## GROUND-TRUTH (R4.3 executor 2026-07-26T01:08Z)

- GROUND-TRUTH: branch `feat/r4-3-gravel-setback-rows` commit `369f35f`, PR #130. vitest **287/287** pass.
- GROUND-TRUTH (city cohort n=150 promote): promoted=**12**, verifyPass=**12**, verifyFail=4 (geometry empty), already-promoted=3, no-setback-row=130 (PDD honest), no-road-adjacency=1. R4.2 baseline was promoted=3/150.
- GROUND-TRUTH (live tally): road_nodes=4894, depth_warm=**18** (was 6), zoning=5769, depth_ratio=**0.312%** (was 0.104%).
- GROUND-TRUTH (sample promote): 48021:104119 area=8030 insetFeet=[0,0,0,0,15]; 48021:104985 area=22752 (gravel frontage cohort parcel).

## LESSON (R4.3)

- LESSON (path): gravel/unclassified front → B3 6.5.003 Place Type build-to-line (Ch7 street standards cite 6.5.003 for all frontage types; no separate gravel feet in code). Explicit descriptor rows + warm/verify shared `resolveInsetFeetForEdge`.
- LESSON (verify parity): verify gate must use same inset resolver as warm-compute — raw `resolveRoadClassSetback` honest-absence on district-rc miss caused 146 verifyFail while warm applied flat fallback.
- LESSON (cohort): city cohort first-150 is 127/150 **PDD** (Planned Development) — honest `no-setback-row` decline, not verifyFail noise. P-1..P-4 rows from 6.5.003 unlock P-2/P-3 gravel promotes.
- LESSON: `resolveRoadClassSetback` must fall through to flat district table when rc district row or (class,role) cell missing — not return `road-class-setback-no-match` early.

## OPEN

- GROUND-TRUTH (CC-A 2026-07-27T13:50Z planner): Steps 0–5 COMPLETE. Bundle `index-BTKuoNXu.js` (NOT stale eWdGi6qE). Amendment 1 MET on 28286; golds 33512+34785 front-walk MET. WDLL 1–10 MET (9 honest-DEGRADED). WDLL **closed**. Check-in `_inbox/2026-07-27_CC_A_post_deploy_planner_live_verify.md`. CTX HELD. No further CC-A builders.
- LESSON (CC-A **promoted** M0): Port trading Control Tower `NodeGraphBrowser`+`AtomInspector` (structured card / family pills / `return=` / confidence object) — do **not** invent a second organism. Mechanical guard: `hauska-map/.../NodeGraph.smoke.test.tsx`. Parity ledger 2026-07-27 entry.
- OPEN (2026-07-27): RECIPE-PROOF track **CLOSED** (operator). Caldwell banked 7/1. Hays/CTX NOT opened. Next priority = **Bastrop market-ready**. Close `_inbox/2026-07-27_RECIPE_PROOF_track_close.md`. UNREACHABLE-CITY-GIS mechanical PR #148.
- OPEN: WDLL 4 live alley-backed Bastrop parcel (fixture 15′ vs 5′ MET; 714 Spring is corner-street only).
- OPEN: PDD / P-CS / P-EC — site-specific / overlay; honest no-setback-row; separate wave.
- OPEN: operator Central-TX — **HOLD**. No CTX until Bastrop market-ready + operator go. Caldwell signal already in hand.
- GROUND-TRUTH (FIX3): retrieval `00031-hem` @100%; CC BFF `depth_warm_promoted=2345` `depth_ratio_place_type=64.12`; Vercel RETRIEVAL_API_KEY was empty (503) until set.
- GROUND-TRUTH (FIX1.1 2026-07-26): PR [#134](https://github.com/empressaioemail-tech/hauska-engine/pull/134) merged `d34ed4fd`. Live txgio 34785: depth-warm + site-plan WGS84 path both area=**13641**, offsetDegenerate=false.
- GROUND-TRUTH (FIX2 2026-07-26T15:26Z): place-type re-promote **promoted=0**; tally still **2345/3657=64.12%**. Batch `roadsLoaded=3617` vs recon 4894. Residual this pass: 407 no-road / 902 geometry-empty / **0** would-promote.
- LESSON (FIX2): recon 395 would-promote used **unfiltered** road atoms; batch load-filters `isFrontEligibleRoad` → collectors steal front when footways no longer shadow them. Live 34785: filtered → secondary front → empty; unfiltered → unclassified front → verifyPass area 13641. FIX 2.1 owed (finding `_inbox/2026-07-26_FIX2_zero_promote_root_cause.md`).
- LESSON (FIX1.1): shared polygon-clipping alone insufficient — projection frame must match depth-warm (WGS84 insetPerEdge), not bbox-SW local-only.
- GROUND-TRUTH (FIX2.1 2026-07-26): PR [#135](https://github.com/empressaioemail-tech/hauska-engine/pull/135) merged `46a1146`; depth_warm **2712**/3657=**74.16%** (+367); residual 110 no-road / 832 geometry-empty / 0 would-promote. engine-api **`00088-sub` @ 100%** tag `fix21-siteplan`. FRONT-LABELING FIXTURE GATE promoted (M0). WDLL graded. Central-TX HELD.
- GROUND-TRUTH (2026-07-26 geom-empty 832): full classify of 832 — **HONEST-IRREGULAR 371 (44.6%)** / **SHOULD-DRAW 461 (55.4%)**. Residual pass confirmed 110 no-road / 832 empty / 0 would-promote. Finding `_inbox/2026-07-26_geom_empty_832_ceiling_verdict.md`.
- LESSON (48021:28286): near-rect 0.999 / 60×137′; FIX2.1 labels front residential edge2 insetFeet=[0,0,15,0] empty; front@edge0 OK 7316; uniform15 OK 3206; front@edge2/3 empty. Class = asymmetric insetPerEdge / isInsetDegenerate false-fail (not labeling). Do not greenlight on 74.16%.
- GROUND-TRUTH (2026-07-26 GUARD-vs-INTERIOR): **A1 GUARD** on 28286 — `insetRingMeters` edge2 yields ~7316 sqft interior; `ringHasSelfTouch` (`polygon-inset.ts` ~217/287) rejects; inward normals OK. Recommend **PATCH-THEN-BUILD**. Finding `_inbox/2026-07-26_guard_vs_interior_and_boundary_primitive.md`.
- GROUND-TRUTH (boundary primitive B): buildable from live jsonb `txgio_parcel` + road-nodes (bbox/PIP adjacency; no PostGIS on cortex Neon). 28286 edge1→parcel 32341; edge2 front residential + neighbor 35671; unmapped edges observed. Interior=CCW signedArea + PIP once from ring.
- LESSON: “geometry-empty” on near-rects can be a **guard false-reject of a dirty-but-correct clip ring**, not wrong inward. Primitive insight stands (store what each line faces) but is **next**, not the 461 unblock.
- GROUND-TRUTH (PATCH-A 2026-07-26T18:05Z): PR [#136](https://github.com/empressaioemail-tech/hauska-engine/pull/136) `12ab8a1e` merged. Promote **+826** → depth_warm **3538**/3657=**96.75%** (was 2712/74.16%). Residual: 110 no-road / **6** geometry-empty / 0 would-promote. Check-in `_inbox/2026-07-26_PATCH_A_checkin.md`.
- LESSON (M0): geometry gate must include **positive-space** (good near-rects pass on every edge index), not only bad-geometry fails. Pre-patch gate was one-sided.
- OPEN: Stage 2 proxy-retirement **CLOSED honest** (S2-F). City OSM remains best-available (data-sparse). Central-TX HELD. Next = Stage 3 market-ready.
- GROUND-TRUTH (2026-07-27T12:08Z S2-F planner verify): road_nodes=**17552** (auth **5431** / undef **5920** / OSM **4894** / surveyed **1307**). Gold **no-flip** osm-fallback (MET). City defined-surface ceiling=**67**/1061. depth_warm **99.59%** held. PR #140 merged `88cc15c`. Check-in `_inbox/2026-07-27_S2F_planner_verify_checkin.md`.
- GROUND-TRUTH (2026-07-27 S2-F executor): PR #140; close `_inbox/2026-07-27_S2F_executor_close.md`.
- LESSON (M0 **promoted** → 27d recipe): sources split by jurisdiction level AND may be schema-complete but data-sparse — check DATA POPULATION; never authoritative-from-Undefined.
- GROUND-TRUTH (2026-07-27T05:56Z S2 planner close): depth_warm=**3642**/3657=**99.59%**. boundary_edges=**26454**/3654. Live primitive warm 28286=**7316.34** [0,0,15,0] agent=`depth-warm-boundary-primitive-v1`. Merges U1 `ab9d5fd`, U3(+U2) `7540de2`. Rollup `_inbox/2026-07-26_S2_stage2_planner_close_checkin.md`.
- GROUND-TRUTH (2026-07-27 S2-U3 executor): PR #139 SHA 288d658; close `_inbox/2026-07-26_S2U3_executor_close.md`. Planner verify `_inbox/2026-07-26_S2U3_planner_verify_checkin.md` **MET**.
- LESSON (U3): insetRingMetersWithNormals + stored inwardNormal — 28286-class impossible when primitive present. Already-promoted envelope rows may keep old verifiedAt; prove via live compute.
- GROUND-TRUTH (2026-07-27T03:38Z S2-U2 planner verify): gold PRE-2 neighbors ALL MATCH. Check-in `_inbox/2026-07-26_S2U2_planner_verify_checkin.md`.
- LESSON (U2/M0 **promoted**): PRE-2 → `boundary-primitive/adjacency-grid.ts` + U3 fixtures on main. Eager full-county edge precompute hung — lazy grid per parcel.
- GROUND-TRUTH (2026-07-27T03:13Z S2-U1 planner verify): road_nodes=**6201** (county=**1307**). City gold still osm-fallback. U1 merged `ab9d5fd`. Check-in `_inbox/2026-07-26_S2U1_planner_verify_checkin.md`.
- LESSON (U1): StreetsSurveyed2016 ≠ city grid; do not claim city proxy retirement from county CR ingest alone.
- OPEN (M0 promote queue): cleared for Stage 2 (adjacency-grid + offset-consumes + unmapped-honest + county-wins unit tests landed).
- OPEN: HTTP site-plan 34785 still un-run.
- OPEN: master + 27c frontmatter still `awaiting operator approval` — formal flip owed.
- OPEN (2026-07-27): Track B (customer-UI) running in parallel — scratch `_scratch/customer-ui-track-b.md`; depth write-path untouched; CTX HELD.
- GROUND-TRUTH (2026-07-26T02:54Z PRE-2 adjacency at scale): full Bastrop `txgio_parcel` geom set **74729** parcels / **713390** edges; method = one Neon jsonb+bbox load + ~1km cell grid + 3m outward probe + PIP. wallMsTotal=**27306**, adjWallMs=**15181**, failures=**0**. Cost ~$0 (one SELECT). Spot-check MET: 28286 e1→32341 e2→35671; 34785 e0/1→34801/34769 e2 unmapped; 33512 e0/5 unmapped + neighbors on 1/2+. **Scale HOLDS** Bastrop; Travis/Bexar OK on same linear grid path (~1.3 / ~2.4 min est). Naive O(n²) bbox scan does NOT hold (Bexar ~55h est). PostGIS **not installed** (available 3.5.0) — **not a Stage 2 precondition**. Chosen method: app-side grid+PIP. Check-in `_inbox/2026-07-26_PRE2_adjacency_at_scale_checkin.md`. Central-TX HELD. No primitive build.
- LESSON (PRE-2): “~62,257 Bastrop parcels” is zoning-facts headline; full TxGIO geometry universe is **74,729**. Adjacency scale denom = geometry rows.

## GROUND-TRUTH (2026-07-26T12:30Z depth reconciliation)

- GROUND-TRUTH: live depth_warm_promoted **2345**; place-type 2345/3657=**64.12%**; zoning 2345/5769=**40.65%**; nodes 2345/62257=**3.77%**.
- GROUND-TRUTH: live ledger setback/envelope/full_chain=**5729** (any atom); CC artifact 5726 @ 2026-07-25T10:49Z STALE; CC `%` is zoning_present_pct 9.27 not depth.
- GROUND-TRUTH: residual 1312 → no-road 110 / geometry-empty 807 / would-promote 395 (read-only reclassify).
- LESSON (1009 Chestnut 48021:34785): site-plan ring-geometry setback-consumes-lot on front-only 15' clean 98×165 rect; depth-warm insetPerEdge succeeds area 13641. R0 leak is **site-plan path**, not edge labels / not_specified / txgio ring.

## GROUND-TRUTH (R4.4 planner merge 2026-07-26T07:10Z)

- GROUND-TRUTH: PR #131 `dbb1f81a`. Live depth_warm=2345, place-type ratio=64.12%, all-zoning=40.65%, cost ~$0.24. WDLL 7 PARTIAL(place-type).

## GROUND-TRUTH (R4.4 executor 2026-07-26T01:23Z)

- GROUND-TRUTH: branch `feat/r4-4-place-type-warm-pass` commit `1f925ab`, PR [#131](https://github.com/empressaioemail-tech/hauska-engine/pull/131). vitest **287/287** pass local; CI **pass**.
- GROUND-TRUTH (place-type universe): county `zoning_place_type`=**3657** (P-1..P-5); city bbox holds **3654/3657** — county pass ≈ city pass.
- GROUND-TRUTH (batch n=50 `--place-type-cohort --city-cohort --promote`): promoted=**19** new, verifyPass=19, verifyFail=13, already-promoted=15, no-road-adjacency=3. wallMsTotal=270035, extrapolatedJurisdictionUsd=**0.225**.
- GROUND-TRUTH (full pass offset=50 limit=4000): processed=**3604**, promoted=**2308** new, verifyPass=2308, verifyFail=889, no-road-adjacency=404, already-promoted=3. wallMsTotal=20816786 (~5.8h), msPerParcel=5773, extrapolatedJurisdictionUsd=**0.2441**.
- GROUND-TRUTH (combined place-type universe n≈3654): **2327** net new promotes (18→2345). Residual unwarmed place-type ≈**1312** (geometry-empty + no-road-adjacency; no PDD feet invented).
- GROUND-TRUTH (live tally final @ 2026-07-26T07:10Z): road_nodes=4894, depth_warm=**2345**, zoning_all=5769, zoning_place_type=3657, depth_ratio_all=**40.65%**, depth_ratio_place_type=**64.12%**.

## LESSON (R4.4)

- LESSON: `--place-type-cohort` filters SQL via `split_part(district,' ',1) = ANY(P-1..P-5)` — removes PDD `no-setback-row` from cohort denominator noise; extrapolation uses place-type count not all-zoning.
- LESSON: place-type resolvable universe promotes ~**64%** where roads + ring allow inset; residual ~36% is honest geometry-empty verifyFail + no-road-adjacency — not descriptor gap on P-1..P-5.
- LESSON: report `depth_ratio_place_type` separately from `depth_ratio_all`; all-zoning ratio is PDD-diluted (40.6% vs 64.1% on place-type).
- LESSON (FIX 3): NodeGraph raw `fetch(retrievalUrl/stats/...)` bypassed BFF Bearer — use `fetchCentralTxNodeGraphTally` → `getJson` → `/api/spine/retrieval/*` like atom-chain; CC `%` was `zoning_present_pct` (breadth), not depth.

## GROUND-TRUTH (R4.3 planner merge 2026-07-26T01:12Z)

- GROUND-TRUTH: PR #130 `59d96deb`. Live depth_warm=18, road_nodes=4894. Gravel→6.5.003; PDD declines dominate city cohort.

## GROUND-TRUTH (R4 planner close 2026-07-25T23:45Z)

- GROUND-TRUTH: PR #127 merged `58d53b13`. Live SELECT road_nodes=1188, zoning=5769, depth_warm=1.
- GROUND-TRUTH: city promote with TXGIO_DATABASE_URL — 47728 + 47595 verifyFail empty inset (0 new promotes).
- LESSON: TXGIO rings live on hauska-prod `CORTEX_DATABASE_URL` (`txgio_parcel`); batch `--parcel` is single-id only.

## GROUND-TRUTH (R3 close 2026-07-25T22:55Z)

- GROUND-TRUTH: engine #126 `c2fa0d42` + map #69 `b433ef8a` merged. Substrate `48021:33512` buildable-envelope `depth-warm-promoted-v1` area 23507 @ 2026-07-25T22:52:11.361Z.
- GROUND-TRUTH: PE `property-explorer-xi.vercel.app` (dpl_5ZpzHQvDae9TvS7Tv5orLuJiQ2U8) facets → `atom-chain-warm` + `X-PE-Cold-Derive: skipped`. WDLL 6 + 8 MET.

## R3 planner verify (closed)

- LESSON: verify agent is mechanical gates only — geometryCorrectnessGate + classifyOsmHighwayTag parity + per-edge insetFeet match.
- LESSON: depth-warm promotion stamps `depthWarmPromotion=depth-warm-promoted-v1`; PE readPath `atom-chain-warm` + `X-PE-Cold-Derive: skipped`.
- LESSON (R3.1): never uniform-apply front setback onto not_specified axes — honest partial inset first.
- DEAD-END (corrected): executor claimed partial [15,0,…] degenerates → false.

## R2 close notes (2026-07-25T23:22Z executor)

- LESSON: district_code prefix match required — adapter serves `P-5 Core`, descriptor keys `P-5`.
- LESSON: roadClassForEdge attaches classification when a road candidate trust-gates to that edge index.
- LESSON: alley OSM `highway=service` maps to classification `alley` via classifyOsmHighwayTag mirror.
- GROUND-TRUTH (2026-07-25T23:22Z): engine PR #125 branch `feat/r2-road-type-setbacks` commit `47cb9fd`; LDT PR #358 commit `fe0b3fbd`. Tests: engine road-class-setback 4/4; LDT buildableEnvelope R2 21/21.
- GROUND-TRUTH (fixture): residential+front=15', alley+rear=5' on P-5 — street-vs-alley divergence proven in both repos.

## R1 close notes

- LESSON: road node id `{fips}:road:{osm_way_id}` keeps G6 parity with parcel `{fips}:{prop_id}` on one substrate.
- LESSON: v1 ROW = OSM centerline + assumed-per-class width; `row.provenance.kind=approximate-assumed-per-class`.
- DEAD-END: HybridRetrieval({ storage }) — constructor is (storage, options) positional.
- LESSON (planner live): do not apply `applyPropertyCalibrationAtRead` to road-nodes — overlay SQL rejects undefined atomId/jurisdictionTenant.

- GROUND-TRUTH (FIX2 2026-07-26T15:23Z): place-type promote re-pass \--place-type-cohort --city-cohort --promote --limit=4000\ on HEAD @/after \d34ed4fd\. BEFORE/AFTER depth_warm_promoted **2345**; place-type **3657**; ratio **64.12%**. promoted=**0**; verifyPass=**0**; verifyFail=**902**; no-road=**407**; already-promoted=**2345**; wallMs=**8617490**; extrapolatedUsd=**0.0958**. +395 **not** landed. Check-in: \_inbox/2026-07-26_FIX2_place_type_residual_promote_checkin.md\. Log: \hauska-engine/packages/engine-core/fix2-promote-log.txt\.
