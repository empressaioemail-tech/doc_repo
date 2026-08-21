# R-09 gate repair scratch

## GROUND-TRUTH (2026-08-21T01:12:50Z)
- Live materialized GET `county-ledger`: all 3556 cells `hasWriter=true`, `atomFamilyState=present`, `isPartial=false`. `computedAt=2026-08-14T17:41:22.500Z`.
- Deployment store read (read-only): SQL computes 18 partial zoning cells; legacy read path erases all to `isPartial=false`.

## GROUND-TRUTH (2026-08-21T01:15:22Z proof script, Cloud Run probe)
- `hasWriter` false: 508 cells (sample `48001:easement`)
- `atomFamilyState` not present: 3048 cells partial (sample `48001:geometry` → displayState `no-atom`)
- `isPartial` true: 18 cells (sample `48027:zoning`, coverage 0 vs threshold 95); legacy path had 0

## LESSON
- Constant indicators came from TWO mechanisms: (1) stale county_rail all-true store + materialized snapshot, (2) read path trusting store columns without overlay, (3) `applyDepthRailDisplayGate` clearing `isPartial`.
- `manifestReadProbeOptions` must use `requireEngineRoot: true` so Cloud Run (no sibling engine) derives negatives; dev worktree with colocated engine is not production shape.
- Proof-by-firing requires Cloud Run probe simulation locally; reading write path is insufficient.

## OPEN
- Deploy + POST recompute (operator/planner, not R-09 store write) needed before live GET reflects repair; default GET still serves 2026-08-14 snapshot until then.
- `rrc-wells` atomFamilyState still derives `present` from engine snapshot while OPS-15 says property spine holds zero O&G — STARVED for live store probe input; owner: engine/spine seat.

## DEAD-END
- Restoring fake `fileExists` true for all `/hauska-engine/` paths — reproduces constant hasWriter on deploy.
