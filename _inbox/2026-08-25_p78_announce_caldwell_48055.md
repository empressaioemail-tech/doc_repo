---
title: P-78 announce — Caldwell 48055 stratmap-landuse leftover rebake
date: 2026-08-25
plan_row: P-78
wdll_item: 2
status: announced-before-write
---

# Announce: Caldwell 48055 stratmap-landuse leftover

| Field | Value |
|---|---|
| FIPS | **48055** Caldwell |
| Source zip | `P:/tmp/stratmap-year-built-sample/stratmap25-landparcels_48055_lp.zip` |
| Source DBF | `P:/tmp/stratmap-year-built-sample/extract/stratmap25-landparcels_48055_caldwell_202503.dbf` |
| Vintage in name | **202503** |
| LDT | isolated worktree `P:/tmp/ldt-p78-caldwell` @ **46e1a5a1** (merge **72cffc8** landuse + P-78 ingest) |
| CLI | `pnpm --filter @workspace/cad-ingest stratmap-landuse -- --county=48055 --file=<zip>` |
| Dest table | **cortex-prod** `neondb.cad_property` via `CORTEX_DATABASE_URL` |
| Merge path | **Path A** (same PK in-place; COALESCE / CAMA-wins CASE per P-78) |
| Fields targeted | `year_built`, `land_acres` from StratMap DBF (leftover hard-null fix) |

## Scope locks

- **One county only:** 48055
- **No** `--allow-stratmap-fallback`
- **No** 48113 Dallas
- **No** 48439 Tarrant
- **No** atoms `--apply`
- **No** L17 write
- **No** rematerialize
- **No** second county

## Operator context

Tarrant **KEEP** 975,885 (`_decisions/2026-08-25_p25_tarrant_keep.md`). P-25 `ready:false`. This rebake does not reopen Tarrant DELETE.

Prop_ID literal `"0"` rows may upsert; counted separately — not leftover success.
