# Property substrate master-plan dispatch 2026-08-20

## GROUND-TRUTH
- Planner snapshot: doc_repo `P:/doc_repo` branch main `4fa70bb` (integration checkout). Property seat worktree exists at `P:/seat-worktrees/property/doc_repo`. Acting as property planner from the integration tree because that is where this chat is seated; product edits go to FRESH worktrees, never `P:/legacy-design-tools` or dirty seat checkouts.
- hauska-engine origin/main: `d3f3794` VERIFIED
- hauska-map origin/main: `204789f` VERIFIED
- legacy-design-tools origin/main: `1a55566b` (1113c649 + PR #444) VERIFIED
- Worktrees:
  - A1 `P:/tmp/mp-a1-accesspolicy` `fix/w30-accesspolicy-no-default` @ d3f3794
  - A2 `P:/tmp/mp-a2-rename-control` `ci/required-check-rename-guard` @ d3f3794
  - A3 `P:/tmp/mp-a3-s22-card` `fix/s22-geometry-denominator` @ 1a55566b
  - A4 `P:/tmp/mp-a4-landuse-orphan` `fix/landuse-facet-key` @ 1a55566b
  - B  `P:/tmp/mp-b-flood-chain` `fix/flood-geo-failclosed` @ d3f3794

## GROUND-TRUTH (planner, Neon MCP, 2026-08-20, fancy-fire-06136146 / neondb_owner)
- county_facet_coverage: geometry 254/254, landuse 254/254, land-use 19/19, flood 177/177, envelope 19/19, landuse-cad-join 0. VERIFIED.
- land-use vs landuse on the same 19 FIPS are DIFFERENT measurements (cad-roll join vs land-use-fact-atom-count). 48091: 0.00 vs 99.68. 48439: 99.38 vs 89.45. Overlay forbidden.
- place_layer_snapshots: node-facets:tier2 608414, fema:nfhl-flood-zone 176. Column is payload_json not payload.
- flood writer LIVE at write-flood-hazard-fact-county.mjs. well-fact IMPORTS geometryCentroid only. special-district does not mention it. Writer bbox fallback REMOVED (B5). MultiPolygon centroid is null (B5 absence, not B6 containment).

## GROUND-TRUTH (C12, 2026-08-20, hauska-engine d3f3794)
- Original S-25..S-182 list was never filed in doc_repo. It lives in Claude transcript session f6fb1037 / agent aaae06f9fbadca8b4. e6de1eb added only +40 lines to 65_t25 (W-30 + range name).
- **0 of 157 enter the verified 48.** Sampled 71 of 158 original S-ids; none ghosts; 87 unmeasured.
- W-30 / S-73 / S-74 confirmed (A1 PR #353). CellMeasurement.measured is a caller boolean. --check-registry defaults off; no CI passes it. tally.ts has no sentinel defaults. classify.ts `?? 0` collapses null and 0 samplePointDistanceM.
- Filed: `_inbox/2026-08-20_c12_retrieval_candidate_rows.md`

## GROUND-TRUTH (A4, 2026-08-20, ldt 1a55566b then 1c1f5bf4)
- Upsert already writes `landuse-cad-join`. Gate label `evaluateJoinIntegrity({ facet: "land-use" })` is not the ledger key.
- Neon neondb (planner SELECT): land-use 19, landuse 254, landuse-cad-join 0 (measured). 15/19 pct disagree. Overlay forbidden. Comal 48091 0.00 vs 99.68; Tarrant 48439 99.38 vs 89.45.
- Prepare SQL unapplied. Writer-key test violated: constant=`land-use` fails expected landuse-cad-join.
- PR https://github.com/empressaioemail-tech/legacy-design-tools/pull/446 SHA `1c1f5bf4`
- leave_behind: SQL apply is operator; `assertRailLedgerRowFixture` is test-only; table still accepts `land-use` (schema.integration.test still inserts it); drop `land-use` from bake reader only after n=0.

## GROUND-TRUTH (B6, 2026-08-20, hauska-engine 3b221d0)
- Classifier is `(point, ref, store)`. No geometry argument. Production SQL SELECT geometry FROM txgio_parcel. Atom-contains / store-excludes → not-contained. Missing ring → unmeasurable, not not-contained. Plan path atoms length 0 for both refusals.
- Tests 59/59 including B5's 12. Bbox fallback still gone.
- 229 is 229 of 5,750 (first 6,000 feature_index rows), not of 74,729. Filed `_inbox/2026-08-20_b6_parcel_store_containment.md`
- PR https://github.com/empressaioemail-tech/hauska-engine/pull/355 SHA `3b221d0` (B5+B6)
- leave_behind: --from-plan does not re-run containment.

## GROUND-TRUTH (B7, 2026-08-20, hauska-engine 3b221d0, neondb_owner)
- NO --apply. atomsWritten=0. HEAD unchanged. PR #355 not updated.
- Bastrop 48021 SS-W17 population MATCHED (6000 / 138 / 112 / 5750). Stamper notContained=271. Same-object PIP still 229. Extra 42. Fixture 120/120 inside 271. `--limit=100` notContained=7 (gate can fail).
- Extra keys are duplicate prop_id across feature_index (planner SELECT): 10250 {1634,1635}, 10584 five rows, 10657/10705/10745 each two. Mechanism: loadTxgioParcelRingStore last-write-wins vs first-key-wins centroid.
- Brewster 48043 complete DISTINCT ON: 20287 features, contained 16738 / not-contained 195 / unmeasurable 0, MultiPolygon-null loaded 805. Planner SELECT: 35619 rows, 5553 multipart rows, 805 multipart features. NFHL zonesIndexed=0. centroidNullAbsences reason-string masked by empty-zone.
- Apply BLOCKED on the 229 gate. Filed `_inbox/2026-08-20_b7_stamp_dry_run.md`

## OPEN
- Apply still gated on a Bastrop `--limit=6000` dry-run printing notContained===229 AND population identity equation summing to parcelsRead. First-write-wins is on the branch; 229 not re-run this turn. Decision: `_decisions/2026-08-20_flood_stamp_229_licenses_ssw17_convention.md` (229 is SS-W17 convention, not ground truth).
- Brewster hole explained: 2345 skipped-unusable + ~234 skipped-duplicate (uncounted continue) + 775 no-centroid after skip. 805 loaded MultiPolygon includes ~30 also in skip. Identity now throws. Decision: `_decisions/2026-08-20_flood_plan_population_identity.md`.
- Unfiled measurement pattern filed: `_decisions/2026-08-20_unfiled_measurement_is_not_in_the_estate.md` (C12 / S-21 / F-0).
- B5 bbox, land-use overlay, C12 unfiled: operator confirmed the three calls.
- A1 PR https://github.com/empressaioemail-tech/hauska-engine/pull/353 SHA `2c3c52c`
- A2 PR https://github.com/empressaioemail-tech/hauska-engine/pull/354 SHA `0f183d5`
- A3 PR https://github.com/empressaioemail-tech/legacy-design-tools/pull/445 SHA `100b9c26`
- A4 PR https://github.com/empressaioemail-tech/legacy-design-tools/pull/446 SHA `1c1f5bf4` (SQL unapplied)
- B5+B6 PR https://github.com/empressaioemail-tech/hauska-engine/pull/355 SHA `523abba` (identity + first-write-wins on top of 3b221d0)

## LESSON
- Handover body still says 253 and R-7 highest-value; amendment block at top is the truth. Population 254. Zone-vs-X is the flood mass.

## DEAD-END
- Do not query atoms on neondb or txgio_parcel on hauska_mcp. Wrong DB returns zero and reads as absence.
