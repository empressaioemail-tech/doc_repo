---
id: 2026-07-30_BDC_DOWNTOWN_STEP1_executor_close
title: STEP 1 executor close — per-parcel setback source + side model
date: 2026-07-30
status: complete
wdll: 2026-07-30_BASTROP_DOWNTOWN_DRILL_WDLL
wdll_items: [1, 2]
pr: https://github.com/empressaioemail-tech/hauska-engine/pull/185
branch: feat/bdc-downtown-step1-per-parcel-source
---

# STEP 1 close

**PR #185** open — CI failed once on jurisdiction grep gate; planner pushed fix (`cityKey` param). Merge pending green CI.

## Delivered

- `bastrop-per-parcel-record.ts` — layer 23 public REST, feet parsers, corner regex, non-scalar honest-decline, chart disagreement flag
- Atom shape: `sideInteriorFt` + `sideCornerFt` (legacy `side` = interior)
- Router + `depth-warm-bastrop-batch.mjs` rewired to per-parcel numbers (not `bastrop-development-code.json` scalars)
- Tests: 105054 25/5/15/25, 34089 GC 20/5/10/20, MU side decline, SF-1 chart disagreement flagged — **7/7 pass**

## Residual (non-blocking)

- PE card split render (hauska-map) deferred; atom fields in place

## Unblocks

STEP2 (MU/GC router wiring), STEP4 (area promote after STEP2+3).
