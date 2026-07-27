---
id: 2026-07-27_RECIPE_PROOF_track_close
title: RECIPE-PROOF track CLOSE — Caldwell signal banked; Hays/CTX not opened
status: closed
date: 2026-07-27
planner: depth-engine planning agent
related:
  - _inbox/2026-07-27_RECIPE_PROOF_caldwell_planner_verify_checkin.md
  - _inbox/2026-07-27_RECIPE_PROOF_counties_2_3_WDLL.md
  - 27d_county_onboarding_recipe_and_fleet_reliability
  - 27f_bastrop_through_v2_program
---

# RECIPE-PROOF track CLOSED

Operator ruling 2026-07-27: do **not** fan Hays. Caldwell delivered the generalization data point this track existed for. Priority returns to **Bastrop market-ready** (mold-first, scale-second). Hays / CTX are post-Bastrop-market-ready decisions.

## Banked signal

| Metric | Value |
|--------|-------|
| County #2 | Caldwell 48055 |
| N held / M new-baked | **7 / 1** |
| M0-reach misses | **none** |
| Geometry / front-label / verify | HELD |
| New gate | **UNREACHABLE-CITY-GIS** |
| Live depth (cohort) | 337/5027 = 6.70% |
| Cost | ~$0.39 under commitment #3 |
| Engine land | PR #145 `8b0734c` |
| Mechanical guard | PR #148 merged `1a9fc9f` (UNREACHABLE vitest 5/5) |

## Close-out checklist

1. **UNREACHABLE-CITY-GIS vitest** — landed (`unreachable-city-gis.ts` + 5 vitests). Prose gate → mechanical. Not left as prose.
2. **Docs** — Caldwell planner check-in, WDLL finish card, 27d amendment, scratch, thesis parity, this close — committed to doc_repo.
3. **Scratch flush** — RECIPE-PROOF OPEN closed; Bastrop market-ready is the live OPEN. County-48055 scratch retained as banked measurement memory (not deleted).
4. **Hays** — NOT opened.
5. **CTX fan-out** — NOT opened.

## What this means for "start county X"

Caldwell says the mold mostly generalizes (7/8) and the one re-open was honest new learning, now gated. That is enough signal to stop measuring and finish the mold (Bastrop market-ready). Scaling (Hays / CTX) waits on Bastrop-done + operator go, with Caldwell's gate already in the recipe.

## Next (not this track)

Bastrop Stage 3 market-ready (27f). Track B customer-UI continues independent. RECIPE-PROOF track ended.
