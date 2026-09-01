# p91-cad-fields-twin scratch

## LESSON
Dollar CAD fields are three-state: present (v>0), zero (key present, v===0), absent (key missing). Collapsing a stored 0 to absent says we do not know where CAD does know. Fail-closed means do not fabricate a zero for a missing key; it does not mean reject every zero. livingAreaSqft stays positive-only: 0 sqft is not a measured floor.

## LESSON (superseded 2026-09-01)
CAD dollar fields must use positiveDollarOrNull at bake time: production flat bodies carry landValue:0 / improvementValue:0; serving 0 would violate fail-closed. WRONG: that reading invented the zero-collapse defect this card fixed. Bastrop has 26,553 improvement values at a real stored zero.

## GROUND-TRUTH (2026-09-01T02:45Z)
feat/p91-cad-fields-twin HEAD 394424f2 uncommitted. vitest 54/54 on cadRollValue.test.ts + parcelDrawFromReads.test.ts + nodeFacetBakeTier1Conformant.test.ts with DATABASE_URL unused. Arm A: improvementValue 0 serializes state zero. Arm B: missing key serializes absent with basis, no v.

## GROUND-TRUTH (2026-08-31T23:54Z)
feat/p91-cad-fields-twin on legacy-design-tools-p2b-serve: planner verified vitest 48/48. Twin node brief exposes onRecord; draw merges cadRoll post-assemble. Superseded count: tests grew to 54 after the zero-state card.

## DEAD-END
Inlining onRecord into assembleParcelDraw input dropped firstPresentSitusLabel import. Merge after assemble instead.

## OPEN
Planner commit + PR + merge before Wave R. Executor did not commit. Post-re-bake live multi-county grade still owed.
