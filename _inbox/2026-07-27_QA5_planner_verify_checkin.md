---
id: 2026-07-27_QA5_planner_verify_checkin
title: QA5 planner verify — bearing parity guard (HOLD merge on CI)
date: 2026-07-27
status: MERGE-READY (CI green; MET pending merge)
owner: nick
planner: qa
dispatch: 2026-07-27_QA5_bearing_parity_restore
pr: https://github.com/empressaioemail-tech/hauska-engine/pull/156
---

# QA5 planner verify

Builder close reviewed. Adversarial against live branch tip `fb65613` (not the report alone).

## Findings

1. **Fork never landed.** origin/main `annotation-placement.ts` still imports/re-exports `gis-property-line-tags`. PR #151 merge did not carry the inline fork. Local `pr-151-c1` is stale-only — correct to leave dead.
2. **Guard shape is right.** Source-text telltales + runtime PDF≡atom on `(0,0)→(10,30)` — mechanical, not prose. Matches M0 promotion preference.
3. **Surgical.** No craft redesign; annotation-placement untouched on the branch (guard-only). Safe alongside QA2 craft work on a separate branch — after both land, guard must stay green on main.

## Grade (dispatch)

| Item | Grade | Evidence |
|---|---|---|
| Confirm main shared import | **MET** | tip source shows Shared import block |
| Kill / prevent fork | **MET** (prevent path) | restore N/A; guard blocks re-inline |
| Mechanical parity guard | **MET** | CI `typecheck + test` SUCCESS on #156 @ `fb65613` |

**Overall:** MERGE-READY. Guard MET. Merge #156 when operator wants; defect register Area 6 closes on merge.

## Next

- Merge #156.
- QA4 HOLD on CI (separate — #158 RequestInfo typecheck).
