---
id: 2026-07-30_BDC_DOWNTOWN_STEP4_executor_close
title: STEP 4 planner close — downtown manifest warm/promote
date: 2026-07-30
status: partial
wdll: 2026-07-30_BASTROP_DOWNTOWN_DRILL_WDLL
wdll_items: [5]
---

# STEP 4 close (planner-executed)

## Substrate actions (2026-07-30)

1. **Zoning restamp (manifest only):** 5 parcels updated from layer 83 ground truth (`restamp-bastrop-downtown-zoning.mjs --apply`). **34081 P-5 → GC** (F1). Overlap rule kept **34841 on MU**.
2. **Geometry scrub persist:** 19/36 parcels processed, 78 boundary edges (`boundary-primitive-bastrop-downtown-scrub`; 17 skipped — no zoning-fact row or non-resolvable district in ordinance adapter table; 1 BCAD miss).
3. **Warm/promote v2:** 32/36 promoted + verify-pass. Log: `_scratch/bdc-downtown-step4-warm-v2.log`.

## Evidence anchors (F1–F4)

| Anchor | prop_id | Result |
|---|---|---|
| F1 partial re-warm | 34081 | **PASS** — restamped GC, promoted verify-pass |
| F2 MU | 34841 | **PASS** — promoted verify-pass (non-scalar side honest) |
| F2 GC | 34089 | **PASS** — promoted verify-pass |
| F3 geometry | 34073 | **PASS** — promoted verify-pass |
| F4 per-parcel nums | 105054 | **PASS** — 25/5/15/25 insetFeet, promoted |

## Verify-fail rows (4/36 — per-parcel, not aggregated)

| prop_id | situs | failure class | root cause (live run) | blocked-on |
|---|---|---|---|---|
| 34065 | 1005 PECAN | verify-fail | null inset ring / geometry gate | road-adjacency or ring scrub on Pecan frontage |
| 34785 | (gold P-5 row) | verify-fail | null inset / edge labeling on complex frontage | operator-known geometry edge case; not F1–F4 anchor |
| 34881 | | verify-fail | null inset ring | same class as 34065 — corner/road adjacency |
| 39282 | | verify-fail | null inset ring | road-adjacency decline path masked as verify-fail |

Planner to re-run single-parcel probe for exact verify reason strings before area-sweep row fill.

## Hotfix PR (required for LIVE adapter)

**#188** — numeric `FrontSetback_`/`SideSetback_`/`RearSetback_` doubles on live layer 23; `--force-repromote` skips stale boundary-primitive 30ft insets.

Substrate atoms already written with planner scripts on merged #185–#187 + local hotfix. **Deploy engine-api after #188 merge** for LIVE PE/MCP to read per-parcel path.

## Handoff to STEP 5 (planner)

- Merge #188 → deploy engine-api + retrieval canary → traffic shift tag `bdc-downtown`
- Fill area-sweep audit for all 36 rows
- 4 verify-fail parcels: grade honestly in sweep (FAIL rows with reason)
