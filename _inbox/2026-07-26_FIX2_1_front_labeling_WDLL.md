---
id: 2026-07-26_FIX2_1_front_labeling_WDLL
title: WDLL — FIX 2.1 front-labeling correct-by-rule + fixture gate
status: graded
date: 2026-07-26
operator_approval: 2026-07-26
amends: 27c_road_node_engine_and_warm_digital_twin_spec (WDLL 5 edge-labeling; M0 promotion)
parent_finding: _inbox/2026-07-26_FIX2_zero_promote_root_cause.md
---

# WDLL: FIX 2.1 — front-labeling correct-by-rule

Date: 2026-07-26  
Status: **approved**  
Operator approval: 2026-07-26

## Done looks like

Front-edge labeling on Bastrop depth-warm is deterministic and correct-by-rule: footways/paths never win front; among front-eligible roads, a local street (`residential` / `unclassified`) is preferred over a collector for the front edge; and that outcome does not depend on an ineligible way being present to shadow a collector out of `bestByEdge`. A durable FRONT-LABELING FIXTURE GATE (M0 promotion — the R0-geometry-gate equivalent for this class) fails loudly if those rules regress. Under that one labeling path, place-type residual is re-promoted and reclassified once so the true depth ceiling is known. Site-plan HTTP on `hauska-engine-api` serves the already-merged FIX 1.1 WGS84 inset path. Central-TX stays held until those bars clear.

## Acceptance items

1. **Correct-by-rule front competition** | Front selection among edges uses closest **front-eligible non-alley** hit per edge (ineligible ways never own the front-competition slot). Among those eligible candidates, local street (`residential` / `unclassified`) is preferred over collector/highway for the front edge when both are within proximity threshold — not only as a ≤2 m distance tie-break. Footway/path remains ineligible for front (existing in-labeler gate kept). | check: unit tests on synthetic collector+local+optional-footway; live `48021:34785` labels front = unclassified local, not secondary collector | grade: [ ]

2. **Not-by-accident proof on 34785** | Removing any footway/path from the road set does **not** change `48021:34785` front edge or road class. Proves the Chestnut outcome is not the FIX2 “footway shadows collector” accident. | check: fixture/gate test asserts label equality with and without footway; planner live probe optional | grade: [ ]

3. **FRONT-LABELING FIXTURE GATE (M0 durable promotion)** | A dedicated vitest suite (name/path stable, wired into CI with other depth-warm tests) asserts correct labeling on: (a) `48021:34785` collector-vs-local, (b) R4.1 footway-never-front case, (c) R4.3 gravel-front case; plus item 2’s remove-footway invariance. This is the promotion of three prose lessons (R4.1 / R4.3 / FIX2) into a mechanical guard. | check: suite green on PR; planner confirms suite exists and covers the three named cases + invariance | grade: [ ]

4. **Load-time filter subordinate** | Batch `roadAtomToWarmSource` may stop load-time `isFrontEligibleRoad` filtering **only in the same PR** as items 1–3. It must not ship alone. Labeler remains the front-eligibility authority. | check: PR diff couples both; `roadsLoaded` ≈ valid centerline road atoms when filter removed | grade: [ ]

5. **Live 34785 warmThenVerify** | On PR branch with live txgio + substrate roads under the **batch** road path: `warmThenVerify` on `48021:34785` → `verifyPass=true`, buildable area ≈13641, front unclassified/local. | check: planner pastes probe JSON | grade: [ ]

6. **Place-type re-promote + true ceiling** | One place-type city-cohort promote under the unified batch path. Paste before/after live SQL (baseline **2345 / 3657**). Reclassify remaining unwarmed residual **once** under that same path (no-road / geometry-empty / would-promote). would-promote on a second dry pass ≈ 0 (no silent miss class). | check: check-in with verbatim counts | grade: [ ]

7. **Site-plan HTTP FIX 1.1 live** | Deploy `hauska-engine-api` so compose/site-plan serves WGS84 inset path. Live probe on 34785 (or equivalent gated route) non-degenerate offset / honest export — not still pre-1.1 local-only collapse. | check: serving revision + HTTP/evidence paste | grade: [ ]

8. **Central-TX hold** | No county fan-out. Central-TX remains HELD until items 1–3 green, item 6 ceiling posted, item 7 deployed. | check: no new county promote; scratch/CC note | grade: [ ]

## Amendments

- 2026-07-26: Operator reframed before code — load-filter removal is subordinate; load-bearing bar is correct-by-rule front competition that does not depend on footway shadowing; M0 FRONT-LABELING FIXTURE GATE required (three bites: R4.1 footway, R4.3 gravel, FIX2 collector).

## Finish card (graded at close)

1. **met** — `edgeLabeling.ts` eligible-per-edge + local>collector primary; live 34785 front edge 3 unclassified; PR [#135](https://github.com/empressaioemail-tech/hauska-engine/pull/135) `46a1146`.
2. **met** — gate asserts 34785 front identical with/without footway (`front-labeling-fixture-gate.test.ts`).
3. **met** — FRONT-LABELING FIXTURE GATE covers 34785 / R4.1 footway / R4.3 gravel / remove-footway; CI 295/295.
4. **met** — load-time filter removed same PR; `roadsLoaded=4894` on promote.
5. **met** — planner re-confirmed substrate: depth_warm **2712**, `48021:34785` depth-warm promoted; executor live probe verifyPass area≈13641.
6. **met** — before 2345 → after **2712** / 3657 = **74.16%**; residual 110 no-road / 832 geometry-empty / **0** would-promote remaining. Check-in `_inbox/2026-07-26_FIX2_1_checkin.md`.
7. **partial** — `hauska-engine-api-00088-sub` @ **100%** tag `fix21-siteplan`, `/health` service=engine-api; image includes FIX 1.1+2.1. HTTP site-plan refresh for 34785 not probed (ENGINE_API_GATE_TOKEN unavailable in planner shell).
8. **met** — no county fan-out; Central-TX still HELD (ceiling known under one path at 74.16% place-type; geometry-empty 832 remains fix-or-accept).

## Hard rules

- No inventing PDD / not_specified setback feet.
- No Central-TX county fan-out.
- Every PR and dispatch cites acceptance item numbers above.
- Thesis parity: on close, one `_catalog/thesis_parity_ledger.md` entry for the front-labeling mechanical gate (calibration / promoted memory).
