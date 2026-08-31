---
id: 2026-07-30_BDC_DOWNTOWN_STEP2_executor_close
title: STEP 2 executor close — MU/GC/PDD from per-parcel record
date: 2026-07-30
status: merged
wdll: 2026-07-30_BASTROP_DOWNTOWN_DRILL_WDLL
wdll_items: [3]
pr: https://github.com/empressaioemail-tech/hauska-engine/pull/187
branch: feat/bdc-downtown-step2-mu-gc-pdd
stacked_on: https://github.com/empressaioemail-tech/hauska-engine/pull/185
---

# STEP 2 close

**PR #187** stacked on #185. Merge after STEP1 lands.

## Delivered

- MU/GC/PDD route through layer 23 per-parcel adapter (no chart-table decline bypass)
- Overlap row selection: `districtCode` stamp picks correct layer-23 row (34841 MU not SF-1)
- Side honest-decline for "Reference Building Code/Fire Code" without fabricating feet
- Tests: 34089 GC 20/5/10/20; 34841 MU 15/decline/15 — **22/22 adapter tests pass**

## Unblocks

STEP4 area promotion (after STEP1+2+3 merge + geometry persist).
