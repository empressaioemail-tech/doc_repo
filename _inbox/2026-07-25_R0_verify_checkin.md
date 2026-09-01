---
id: 2026-07-25_R0_verify_checkin
title: Check-in — R0 planner verify against live state (HOLD merge)
status: check-in
date: 2026-07-25
planner: depth-engine planning agent
pr: https://github.com/empressaioemail-tech/legacy-design-tools/pull/356
governs: 27c WDLL 1,2,5 / M0.2,M0.3
---

# R0 planner verify check-in

Executor close received for PR #356. Planner verified independently. **HOLD merge** — not a full R0 PASS.

## Independent evidence (pasted)

### CI / local tests (planner-rerun)

```
gh pr view 356 → Typecheck SUCCESS, Test SUCCESS, mergeable MERGEABLE
run 30174564169

pnpm test geometry.test.ts edgeLabeling.test.ts
Test Files  2 passed (2)
Tests  31 passed (31)

pnpm test geometry.test.ts -t "known-bad"
Tests  3 passed | 11 skipped

build.mjs: conditions: ["workspace"],   # unchanged; polygon-clipping in package.json
```

### Live serving (pre-merge baseline)

```
cortex-api traffic: cortex-api-00434-nej @ 100%
POST /api/brokerage/v1/place/buildable-envelope {"address":"714 Spring St, Bastrop, TX 78602"}
→ 200 declined no-zoning-stamp; parcel_node_id 48021:33512; geojson features []
GET .../place/node/48021:33512/facets → zoning.district P-5; envelope null; setbacks absent
```

PR code is **not** on the serving revision. Live drawn-envelope verify for WDLL 1 is blocked until merge+canary **and** the no-zoning-stamp decline is resolved (facets already show P-5 — separate seam).

### Local PR-code probe on checked-in 714 Spring fixture (planner)

```
714_uniform_15 → areaSqFt 17051 / parcel 25797; gatePass true
shape-label front = edge i=3 lengthM 7.83 (GLOBALLY SHORTEST of 6 edges)
714_F15_S0_R0 (front on that edge) → areaSqFt 25412; gatePass true
714_F15_S5_R10 → areaSqFt 21631; gatePass true
714_NaN_should_decline → THREW polygon-clipping "Tried to create degenerate segment" (uncaught)
47728_F15_S5_R10 → areaSqFt 8856; gatePass true
```

## Grades

| Item | Grade | Evidence |
|---|---|---|
| 27c WDLL 2 GEOMETRY GATE | **PARTIAL** | Gate + RED fixtures exist and pass locally/CI. Gap: non-finite inset feet throw out of `polygon-clipping` instead of honest empty — anti-fabrication hole. |
| 27c WDLL 1 GEOMETRY CORRECTNESS | **PARTIAL** | Fixture insets pass the gate (rect/L/corner/714/47728). Live serving still old revision; live POST declines `no-zoning-stamp` so drawn ring cannot be verified on prod. |
| 27c WDLL 5 EDGE-LABELING | **PARTIAL** | Sliver `<1.5m` filtered (test). On real 714 Spring ring, front is **still the globally shortest edge** (7.83m). Depth heuristic did not prevent shortest-wins for this irregular lot. |
| M0.2 fleet uses scratch | **MET** | Scratch read/written; executor returned scratch; DEAD-END on esbuild honored. |
| M0.3 mechanical guard promotion | **PARTIAL** | Gate tests are the right promotion form; hold promoting as "done" until WDLL 2 throw-safety lands. |

## Decision

**Do not merge #356 as R0 complete.** Dispatch a tight R0.1 follow-up on the same PR (or a stacked PR) before merge:

1. Catch `polygon-clipping` throws / non-finite inset metres → honest `empty` (no uncaught throw). Add a test that would have caught `714_NaN_should_decline`.
2. WDLL 5 on the **714 Spring fixture**: shape fallback must not select the globally shortest edge when a better depth-axis / street-side candidate exists; assert front ≠ shortest edge on `PARCEL_714_SPRING_33512` (or require road signal and decline shape-front on this parcel honestly).
3. After merge: canary cortex-api via service cloudbuild (not `gcloud run deploy --source=.`); planner live-probes 714 Spring + three companions; only then grade WDLL 1 toward MET.

## Scratch promotions (planner-gated)

- PROMOTE (after R0.1): mechanical guard test "non-finite inset feet → empty, never throw".
- PROMOTE (after R0.1): mechanical guard test "714 Spring shape-front is not globally shortest" (or honest decline).
- Do NOT promote the executor LESSON "uniform miter equals strip-union on 714" as exonerating the miter — front-labeled path is the production path; uniform-all-edges is not.

## Operator-routed

None yet (R4 cost still future). Formal approve flip on 27/27c still owed.
