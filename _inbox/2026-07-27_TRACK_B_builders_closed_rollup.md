---
id: 2026-07-27_TRACK_B_builders_closed_rollup
title: Track B — all builders closed; planner HOLD rollup (pre-live)
status: active
date: 2026-07-27
planner: Track B customer-UI planner
related: [2026-07-27_TRACK_B_customer_ui_quality_WDLL, 2026-07-27_TRACK_B_STATUS]
---

# Track B rollup — builders closed, live verify still owed

All three feature builders returned CI-green open PRs. None merged. Planner graded each against WDLL + kickoff BEFORE. **Customer-surface live AFTER is the remaining gate** (WDLL 6). CTX HELD. Depth write-path untouched.

## PR board (HOLD merge)

| Unit | PRs | HEAD | Adversarial |
|---|---|---|---|
| B1 road render | engine [#143](https://github.com/empressaioemail-tech/hauska-engine/pull/143), map [#72](https://github.com/empressaioemail-tech/hauska-map/pull/72) | `3c1d0a35` / `8c93f075` | `_inbox/2026-07-27_TRACK_B1_planner_adversarial_hold.md` |
| B2 design pass | engine [#142](https://github.com/empressaioemail-tech/hauska-engine/pull/142) | `044d552b` | `_inbox/2026-07-27_TRACK_B2_planner_adversarial_hold.md` |
| B3 vocab | map [#71](https://github.com/empressaioemail-tech/hauska-map/pull/71), engine [#141](https://github.com/empressaioemail-tech/hauska-engine/pull/141) | `c92d72ae` / `04555f67` | `_inbox/2026-07-27_TRACK_B3_planner_adversarial_hold.md` |

## Cross-unit conclusions

1. **Road data → render path exists in code** (B1): STREET + PE overlay consume road-node centerline/ROW with provenance; deploy **engine before map** (`attaching-roads`). Live DRAW on gold still unproven.
2. **PDF craft improved offline** (B2): gold sample is a real two-page sheet with GIS-approximate line tags + honesty. Fixture zoning/setbacks/area do **not** match live P-5 / ~13641 — do not treat sample as live QA.
3. **Vocab mapper + mechanical guard exist** (B3): covers planner BEFORE (`buildable % pending` despite warm geojson). Dual-repo mapper copies = M0 drift risk. Live trio agreement unproven.
4. **Merge sequencing recommendation:** engine B1 (#143) + B3 (#141) + B2 (#142) need conflict check (all touch site-plan PDF path) — prefer one sequenced land or rebase before deploy; then map #71+#72; then planner live probes.

## Live verify checklist (planner-only next)

- [ ] Deploy engine (B1 attaching-roads + B2 PDF + B3 SUMMARY) → map (B3 vocab + B1 overlay)
- [ ] B1: gold `48021:34785` / `48021:33512` PDF STREET + PE road pixels
- [ ] B2: live gold PDF professional read + GIS tag honesty
- [ ] B3: trio card / inspect / PDF SUMMARY one truth
- [ ] M0 promote: `mapBuildableDisplay` guard; PE provenance fail-closed vs `"unknown"`; STREET copy drop road-anchor language

## Negative done-line (still in force)

Empty STREET box on live; crude live PDF; surface disagreement; survey-grade fabrication — any one = no close.
