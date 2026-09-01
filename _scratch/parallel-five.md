# parallel-five scratch (F-06, F-02, F-01, F-08)

## GROUND-TRUTH 2026-09-01T02:40Z
- planner: P:/doc_repo main 1fcc7a3
- LDT cad-fields: P:/seat-worktrees/property/legacy-design-tools-p2b-serve feat/p91-cad-fields-twin 394424f2 uncommitted
- engine wells: P:/tmp/hauska-engine-a2-wellfact feat/a2-wellfact-gap 0e96e6a uncommitted
- factory alias: P:/tmp/hauska-factory-alias-regen feat/alias-regen 5f9acc3 two SQL dirties
- map C4: P:/tmp/hauska-map-c4-pct 1bba1e3; origin/main 4401095 includes squash 333c3c0
- factory C3: P:/tmp/hauska-factory-c3-derivation feat/c3-second-derivation 5f9acc3 clean

## GROUND-TRUTH 2026-09-01T02:40Z
Live GET https://smartsite.cloud/api/spine/property-atoms/48021%3A34137/facets HTTP 200. facets.envelope.buildableAreaPct=56.1 summary.buildableAreaPct=56.1 sqft=9350 acreage.sqft=16673. Dispatch context said absent. Convenient. Re-prove.

## GROUND-TRUTH 2026-09-01T02:46Z
Alias SQL committed d7c13df on feat/alias-regen, PR https://github.com/empressaioemail-tech/hauska-factory/pull/50. Two files only. certain 33. Waiting CI conclusion string success before merge.

## OPEN
Four agents still in flight (CAD, wells, C4, C3). Item 1 is the deadline. Alias PR 50 unmerged until CI success.

## LESSON (prep)
LDT origin/main is 3 ahead of cad-fields base 394424f2: d332d799 #574, 26068a1e #573, 72870121 P-98. Those should not touch cadRoll files. Planner rebases after the zero fix.

Wells identity test still present at plan-county-well-facts.test.ts:231. Executor must drop it.

Alias porcelain still two SQL files only.

## GROUND-TRUTH 2026-09-01T02:46Z
Alias SQL committed `d7c13df` on `feat/alias-regen`. PR https://github.com/empressaioemail-tech/hauska-factory/pull/50. Two files only. certain 33. CI not yet conclusion success. Do not merge on pending.

## GROUND-TRUTH 2026-09-01T02:48Z
CAD committed 53869348 (rebased onto d332d799). LDT PR https://github.com/empressaioemail-tech/legacy-design-tools/pull/575. Planner vitest 54/54.

Wells committed 2847d60 on feat/a2-wellfact-gap. Planner vitest 22/22. Identity test gone.

C4 live re-fetch 2026-09-01T02:47:48Z: pct 56.1 / summary 56.1 / sqft 9350 / acreage 16673. Agent Gate 8 dayOne.C4 pass. No deploy.

## GROUND-TRUTH 2026-09-01T02:50Z
C3 committed 73e3ffe. Factory PR https://github.com/empressaioemail-tech/hauska-factory/pull/51. Planner `node --test` 36/36. Source field cad_property.property_use_code. Not wired into dayOne.

## DEAD-END
Factory PR 50 (and any PR off current main) fails `test` on `the legacy start-time fallback is deleted by LEGACY_FALLBACK_REMOVE_BY`. Date is 2026-09-01T00:00:00Z. Not the alias four rows. Do not absorb the reaper drop into this card.

## GROUND-TRUTH 2026-09-01T02:55Z
Interrupt capture: all five product trees clean except `_leave_behind/`. Operator accepted CP1 four calls. #575 Typecheck FAILURE (TS2339 basis on CadRollValueWire union). CAD agent resumed on that. #370 MERGED 238fac62. #50 and #51 HELD with comments. C4 re-fetch 02:56:08Z still 56.1; assertC4 pass on inhabited gold.

## OPEN
C3: built and unwired. assertC3Source exists, 36 tests, invoked by nothing. Do not record as fixed. Wiring into dayOne is leave_behind. Factory PRs held for reaper card.

## GROUND-TRUTH 2026-09-01T03:00Z
CAD typecheck fix committed 8edb0c04, pushed to #575. Narrowing only. Present still has no basis. Planner tsc focused exit 0, vitest 54/54. Waiting Typecheck conclusion success.
