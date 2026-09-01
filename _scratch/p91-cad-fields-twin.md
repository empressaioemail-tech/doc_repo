# p91-cad-fields-twin scratch

## LESSON
CAD dollar fields must use positiveDollarOrNull at bake time: production flat bodies carry landValue:0 / improvementValue:0; serving 0 would violate fail-closed.

## GROUND-TRUTH (2026-08-31T23:54Z)
feat/p91-cad-fields-twin on legacy-design-tools-p2b-serve: planner verified vitest 48/48. Twin node brief exposes onRecord; draw merges cadRoll post-assemble.

## DEAD-END
Inlining onRecord into assembleParcelDraw input dropped firstPresentSitusLabel import. Merge after assemble instead.

## OPEN
Planner commit + PR before Wave R. Post-re-bake live multi-county grade.
