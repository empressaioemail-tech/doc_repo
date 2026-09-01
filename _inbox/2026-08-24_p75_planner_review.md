---
id: 2026-08-24_p75_planner_review
title: P-75 planner review of who-serves serve path
status: active
date: 2026-08-24
plan_row: P-75
tree: P:/tmp/ldt-lane3-wave1
---

# P-75 planner review

Read [P-75](79ecf2b8-fc3f-46f5-a54f-b2456e754252) CP1 and the isolated-tree diff. Re-ran `npx vitest run src/lib/whoServesRead.test.ts` in `P:/tmp/ldt-lane3-wave1/artifacts/api-server`: 13 passed, then 16 after the unmeasured split.

## What held

0076 is on the tree. Schema module was missing and was added, pinned to `tx_utility_territory_staging`. No new harvest. GET `/api/who-serves` is mounted (SPA fallthrough would have been HTML 200). Residual is the L10 sentence. TCEQ-as-water throws. `{}` throws. No atoms apply.

## Defect found and fixed on the same tree

An empty staging table would have returned `{ holders: [], residual }` — the same shape as a searched miss. That collapses unmeasured into measured. Planner added `status: "measured" | "unmeasured"`, a COUNT(*) census, and a violation: unmeasured must not carry SERVICE-LETTER-REQUIRED. HTTP empty-store fixture returns unmeasured and does not run the PIP loader.

## Still leftover

Live gold probe. Serving-table row count. Assembler / PE chip. Production migrate. No commit.
