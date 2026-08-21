# W2 SYMNUM fail-closed scratch

## GROUND-TRUTH (2026-08-12T19:47:34Z)
- Engine origin/main `symnum.ts` fallthroughs are `return "unknown"` (status :148, type :162).
- Contract `@empressaio/atom-contract@1.21.0` WELL_STATUS/WELL_TYPE include `unknown` (npm tarball dist verified).
- `tx_rrc_well` unmapped vs PLUGGED∪DRY∪PERMITTED = **563935** (exact CP1=CP2).
- `hauska_mcp` well-fact atoms = **0**.

## LESSON
- A staging-branch fix that never merges + a close artifact claiming "fixed" is how this defect class propagates. P2.3 `4a060d3` was only on `feat/p2-3-rrc-staging-tables`.
- `toContractWellStatus(unknown→permitted)` is the same defect wearing a bridge.
- OIL∪GAS type-membership is not a producing-status set.

## DEAD-END
- Cherry-picking P2.3 symnum.ts wholesale — carries the permitted bridge and misses type fallthrough + Oil/Gas Well description.

## OPEN
- A2 must re-pin engine tip with contract 1.21.0 before any well-fact `--apply`.
- Staging `well_status` column already has unknowns from branch ingest; writer should prefer staged description/status over re-deriving from SYMNUM alone when reading `tx_rrc_well`.
