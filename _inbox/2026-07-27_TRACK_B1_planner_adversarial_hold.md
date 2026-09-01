---
id: 2026-07-27_TRACK_B1_planner_adversarial_hold
title: Planner adversarial HOLD — Track B1 road render PRs (pre-merge)
status: active
date: 2026-07-27
planner: Track B customer-UI planner
related: [2026-07-27_TRACK_B1_road_centerline_edges_render, 2026-07-27_TRACK_B_customer_ui_quality_WDLL]
---

# B1 adversarial HOLD (planner)

PRs reviewed against WDLL 1–2 + kickoff BEFORE. **Do not merge.** Live customer-surface verify owed after deploy (WDLL 6). Deploy order: engine #143 (retrieval `attaching-roads`) before map #72.

## CI (verified via gh)

| PR | HEAD | Checks |
|---|---|---|
| [hauska-engine #143](https://github.com/empressaioemail-tech/hauska-engine/pull/143) | `3c1d0a35` | typecheck+test SUCCESS |
| [hauska-map #72](https://github.com/empressaioemail-tech/hauska-map/pull/72) | `8c93f075` | Test + Typecheck SUCCESS |

## Contract fit (code review, not live)

- Engine adds `resolve-attaching-roads` + `road-street-anchors` mapping road-node centerline / leftEdge / rightEdge into STREET (not a second road model).
- Tests assert non-empty STREET with `approximate-assumed-per-class` provenance AND honest absence when no attach.
- PE `road-overlay` + allowlist POST `attaching-roads` (path + methods) — addresses builder lesson that GET-only default blocked the map path.
- DXF/IFC/PDF emitters touched so STREET is not layer-declared-empty-only.

## HOLD reasons

1. **No live gold PDF/DXF or PE screenshot yet** — WDLL 1/2/6 require customer-surface DRAW of fronting road on `48021:34785` (+ spot `48021:33512`).
2. **Deploy dependency** — map is dead without retrieval `attaching-roads` live; merge/deploy engine first.
3. **Attach source honesty** — confirm live whether gold uses boundary-edge `facingRoad` vs proximity fallback; provenance must still mark assumed ROW.

## Grade (pre-live)

| WDLL | Grade |
|---|---|
| 1 site-plan road | PARTIAL — implementation + tests; live STREET unproven |
| 2 map road | PARTIAL — overlay + allowlist; live pixels unproven |
| 6 customer QA | OPEN |

## Next

After engine+map deploy: regenerate gold site plan; PE screenshot; paste into Track B check-in; then merge decision.
