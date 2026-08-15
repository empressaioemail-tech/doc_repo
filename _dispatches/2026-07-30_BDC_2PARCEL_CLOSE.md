---
id: 2026-07-30_BDC_2PARCEL_CLOSE
title: BDC downtown drill — 2-parcel close (R9/R10)
date: 2026-07-30
owner: planner
wdll: 2026-07-30_BASTROP_DOWNTOWN_DRILL_WDLL
items: [7, R9, R10]
status: closed
closeout: 2026-07-30T14:24Z — 37/37 area-sweep PASS; operator R6 live block-QA owed
---

# 2-parcel close — stale data fixes (AMENDMENT 6)

## Standing decisions

- Cotality extinguished / no Regrid / public-record only
- NO privileged data — uniform public endpoints only
- SmartCity READ-ONLY reference (never a data path)
- Deploys planner-owned
- Code-done ≠ customer-done — traffic-shifted revision + full sweep + operator live-QA (R6)
- CTX/national HELD until 37/37 + operator re-QA
- Do NOT change setback/inset math (probe confirmed stale data only)

## Fix 1 — retire 34065, re-key successors

- Remove `34065` from `bastropDowntownDrill.ts` + `_catalog/bastrop_downtown_drill_test_area.json`
- Add `8741972`, `8741974` (Pecan Place Subdivision successors to 1005 Pecan)
- Manifest: 36 → **37** parcels

## Fix 2 — re-promote 39282

- `--force-repromote --promote` on `48021:39282` (stale pre-R7/R8 persisted envelope)

## Fix 3 — retire stale fixture

- Remove `SF1_SETBACKS_FT`; tests use `PARCEL_34073_SF1_LAYER23` (layer 23 rear=25)

## R9 / R10 gates

- R9: `assertParcelCurrencyInBcad` in warm batch path
- R10: sweep assertions (f) BCAD exists, (g) warm served not stale declined

## Acceptance

- 37/37 area-sweep PASS on traffic-shifted revision
- 39282 PE ~9,582 sqft GC envelope
- Operator R6 block-QA ready
