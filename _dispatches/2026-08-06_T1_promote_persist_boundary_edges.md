---
date: 2026-08-06
track: T1-WS1
wdll: _inbox/2026-08-06_T1_ws1_serve_truth_amendment.md
acceptance_items: [WS1-A1, WS1-A2, WS1-A3, WS1-A4]
engine_repo: empressaioemail-tech/hauska-engine
---

# Dispatch — persist warm-time boundary-edge atoms at promote (Option A)

## WDLL items

| ID | Acceptance |
|----|------------|
| WS1-A1 | `promoteDepthWarmToStorage` writes `property-boundary-edge` atoms for every edge in the verify-pass warm candidate (role, insetFeet, ring tessellation), superseding stale stored primitives |
| WS1-A2 | Promoted boundary edges carry `depthWarmPromotion: depth-warm-promoted-v1` (or equivalent marker) and match warm verify `labelEdgesFromRoads` output at promote time |
| WS1-A3 | **Conclusion-string gate:** unit test on operator-twelve fixture subset (minimum 31362 + 31308) — promote then read stored edges; cert-path labels == stored edgeIndex roles |
| WS1-A4 | `#255` export path unchanged as read-side guard; no regression on block13 7/7 |

## Scope

Master planner **Option A** — persist warm-time labels + ring at promote. Do NOT rely on export-only R28/R30 to fix serve truth.

## Implementation notes

- Extend `emitDepthWarmPromotion` / `promoteDepthWarmToStorage` to emit and write `property-boundary-edge` atoms via existing `writePropertyAtomIfEnabled`.
- Use warm candidate edge list (same source as verify pass inset measurement), not stored primitive reload.
- Supersede prior boundary-edge atoms for the parcel (same pattern as setback-rule/envelope overwrite with `--force-overwrite`).
- Tessellation on write = warm ring edge count; eliminates 4-edge warm vs 6-edge stored mismatch.

## Merge gate

PR must include WS1-A3 conclusion-string test green. block13 regression 7/7 on CI or planner-run post-merge.

## After merge (planner-owned, not this dispatch)

1. Scoped re-persist operator twelve @ pinned serving SHA (dry-run/apply same-SHA).
2. Warden v1.3 `serveTruthEdgeLabels` 12/12 (parallel dispatch if not merged with this PR).
3. Render pack from served state.
4. Cohort re-persist — **store-derived roster** (~4,003 promoted envelopes on FIPS 48021: ~2,026 Bastrop city + ~1,977 Elgin; re-query before apply) — **after T3 pilot apply** heavy-scan slot. Checkpoint: `_inbox/2026-08-06_T1_cohort_repersist_roster_checkpoint.md`.

## References

- Root cause: `_inbox/2026-08-06_T1_operator_twelve_serve_truth.json`
- Ruling: `_inbox/2026-08-06_T1_ws1_serve_truth_amendment.md`
- promote.ts today writes only setback-rule + buildable-envelope
