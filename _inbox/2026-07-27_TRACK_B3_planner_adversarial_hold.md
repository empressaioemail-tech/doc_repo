---
id: 2026-07-27_TRACK_B3_planner_adversarial_hold
title: Planner adversarial HOLD — Track B3 vocab PRs (pre-merge)
status: active
date: 2026-07-27
planner: Track B customer-UI planner
related: [2026-07-27_TRACK_B3_executor_close, 2026-07-27_TRACK_B_customer_ui_quality_WDLL]
---

# B3 adversarial HOLD (planner)

PRs reviewed against WDLL 5 + kickoff BEFORE. **Do not merge.** Live customer-surface verify still owed after deploy (WDLL 6).

## CI (verified via gh)

| PR | HEAD | Checks |
|---|---|---|
| [hauska-map #71](https://github.com/empressaioemail-tech/hauska-map/pull/71) | `c92d72ae` | Test SUCCESS, Typecheck SUCCESS |
| [hauska-engine #141](https://github.com/empressaioemail-tech/hauska-engine/pull/141) | `04555f67` | typecheck+test SUCCESS |

## Contract fit (code review, not live)

- Shared `mapBuildableDisplay` + `violatesHistoricalDisagreementGuard` present; kinds match dispatch.
- PE wiring: `deriveBakedCardModel` passes `hasGeometry: env?.geojson != null` — covers planner BEFORE on 34785 (warm geojson, no pct → must not stay bare pending %).
- Unit suite explicitly names planner BEFORE 34785 warm-geojson class.
- Inspect consume banner keyed off `declined-consume` kind (not independent string match).
- PDF SUMMARY uses `buildablePdfLabel` from same mapper family.

## HOLD reasons

1. **No live PE/PDF probe yet** — WDLL 6 requires customer-surface agreement on trio after deploy. Backend/unit green ≠ app-correct.
2. **Dual-repo mapper copies** — PE and engine each carry a full `buildable-display-vocab.ts`. Drift risk; M0 promote candidate is a shared package or a CI parity check, not prose. Acceptable for v1 if live labels match; flag for promotion after live green.
3. **Facet still may omit `buildableAreaSqFt`** — label path relies on `hasGeometry` / warm area fields; confirm live card after deploy shows non-pending copy without inventing a fake %.

## Grade (pre-live)

| WDLL | Grade |
|---|---|
| 5 vocab reconciliation | PARTIAL — implementation + mechanical guard present; live trio unproven |
| 6 customer QA | OPEN — blocked on merge/deploy then planner probe |
| 7 M0 | OPEN — promote `mapBuildableDisplay` guard after live MET |

## Next

Wait B1/B2 closes (or redeploy pair). On go: canary deploy map+engine → paste trio Buildable lines (card/inspect/PDF) → then merge decision.
