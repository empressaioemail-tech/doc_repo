You MUST NOT spawn sub-agents. Do not git add / commit / push unless the lane planner later says so. Do not deploy. Do not shift Cloud Run traffic. Do not touch P:/legacy-design-tools (dirty, forbidden).

Plan row R-09. Property seat. Worktree P:/seat-worktrees/property/legacy-design-tools on branch seat/property. Clean at 164378da.

## Mission

Finish the RAIL_ENGINE_BINDINGS wire. WDLL: P:/doc_repo/_inbox/2026-08-21_r09_binding_wire_WDLL.md items 1-5 (code+tests). Items 6-7 (deploy+recompute+live GET) are planner-owned after you return.

Live today: serving cortex-api-00525-bev @100%, computedAt 2026-08-21T14:50:08.678Z, 3048/3556 cells displayState derivation-indeterminate because manifestReadProbeOptions sets requireEngineRoot true and Cloud Run has no sibling hauska-engine.

The fix: trust committed RAIL_ENGINE_BINDINGS plus ENGINE_PROPERTY_TYPES_SNAPSHOT. CI railEngineBindingCoverage.test.ts already fail-closes that declared writer scripts exist in a real engine checkout. Production must not re-probe that filesystem.

## The write path (read these before editing)

- lib/db/src/railManifestDerivation.ts — deriveAtomFamilyPresent lines 123-127 return indeterminate when engine root is missing. deriveHasWriter lines 244-247 and 269-271 do the same then fall through to false if requireEngineRoot is false. Those are the governing lines.
- lib/db/src/schema/railEngineBinding.ts — the table. Do not empty atomEntityTypes.
- lib/db/src/schema/enginePropertyTypesSnapshot.ts — already includes utility-easement and rrc-pipeline-fact.
- artifacts/api-server/src/countyLedgerCompute.ts — overlay stamps derivation-indeterminate from isRailDerivationIndeterminate. If derivation stops returning indeterminate, the overlay set goes empty. Do not delete the overlay; keep it for a genuine snapshot=null failure.
- lib/db/src/manifestCellResolve.ts — mergeHasWriter is AND (false wins). mergeAtomFamilyState is stricter-wins (partial beats present). After this ships, stored county_rail from the 14:50Z compute is hasWriter false / partial. GET will stay red until planner recomputes. Do not "fix" the merge to OR. That would hide stored negatives.

## Required tests (verify by violating)

1. Absent engine root + committed snapshot: deriveAtomFamilyPresent("easement") === true.
2. Same: deriveHasWriter("easement") === true.
3. cloudRunManifestReadProbeOptions (or equivalent): zero rails isRailDerivationIndeterminate among the fourteen bindings.
4. Fixture binding with neither engineWriterScript nor ldtScorerPath: hasWriter false, not true.
5. Keep railEngineBindingCoverage.test.ts engine-script existence check.

Rewrite lib/db/src/__tests__/railManifestDerivation.test.ts cases that currently require "missing engine ⇒ not true" (SF-20/SF-21 around lines 172-191). The new contract is declared binding ⇒ true without the tree; undeclared writer ⇒ not true.

## Constraints

- No atoms COUNT. No absence minting. No DC-4/DC-5 string changes.
- Do not copy hauska-engine into the Docker image as a substitute for this wire.
- hasWriter is capability, not per-county fill.
- Subagents do not commit. Leave the diff in the worktree. File _inbox/2026-08-21_r09-wire_close.json in doc_repo with paths, test commands, and which WDLL items you claim.

## Return

Diff summary (files, the governing line changes). Test output. WDLL 1-5 met/partial with evidence. leave_behind for deploy+recompute.
