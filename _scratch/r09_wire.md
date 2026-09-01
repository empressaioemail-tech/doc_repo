# R-09 binding wire scratch (property implementer)

## GROUND-TRUTH (2026-08-21)
- Seat: property. Worktree P:/seat-worktrees/property/legacy-design-tools on seat/property at 164378da, clean at start.
- Did not touch P:/legacy-design-tools. No git add/commit/push/deploy.

## LESSON
- Cloud Run cortex-api has no sibling hauska-engine. requireEngineRoot true previously returned indeterminate for every engineWriterScript rail (12 x 254 = 3048). Capability must come from committed RAIL_ENGINE_BINDINGS + ENGINE_PROPERTY_TYPES_SNAPSHOT. CI railEngineBindingCoverage.test.ts remains the file-existence proof.

## OPEN
- Planner-owned after this lane: deploy the new revision, then non-dry recompute with probe=skip so stored county_rail matches derivation. GET without that recompute keeps stored false/partial from 14:50Z because mergeHasWriter is AND.

## DEAD-END
- Do not copy hauska-engine into the cortex-api image as a substitute for this wire.
- Do not change mergeHasWriter from AND to OR.
