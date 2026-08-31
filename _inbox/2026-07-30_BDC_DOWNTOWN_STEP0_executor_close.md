---
id: 2026-07-30_BDC_DOWNTOWN_STEP0_executor_close
title: STEP 0 executor close — ground-truth baseline
date: 2026-07-30
status: complete
wdll: 2026-07-30_BASTROP_DOWNTOWN_DRILL_WDLL
---

# STEP 0 close

**36/36 parcels pulled.** Zero errors. Output: `_scratch/bastrop-downtown-drill-ground-truth.json`  
Script: `scripts/bastrop-downtown-drill-pull-ground-truth.mjs` (curl `--ssl-no-revoke` — Node fetch fails TLS on this host).

## District counts (stamped from Zoned_Parcels/83)

| District | Count |
|---|---:|
| SF-1 | 25 |
| GC | 10 |
| MU | 1 |

## Evidence anchors (layer 23 numbers)

| Defect | prop_id | situs | district | front | side int | corner | rear | notes |
|---|---|---|---|---:|---:|---:|---:|---|
| F1 | 34081 | 1004 JEFFERSON | GC | 20 | 5 | 10 | 20 | PE still P-5/build-to pre-fix |
| F2 GC | 34089 | 908 CHESTNUT | GC | 20 | 5 | 10 | 20 | PE blank today |
| F2 MU | 34841 | 1006 HILL | MU | 15 | null | — | 15 | side_decline=true ("Reference Building Code/Fire Code") |
| F3 | 34073 | 1006 JEFFERSON | SF-1 | 25 | 5 | 15 | 25 | geometry specimen |
| F4 | 105054 | 1010 JEFFERSON | SF-1 | 25 | 5 | 15 | 25 | PE serves 30/10/20/30 today |

All rows cite `Ordinance_Link` to city B3 PDF on layer 23 (record vintage; STEP1 adapter carries link as provenance).

**STEP 1 unblocked.**
