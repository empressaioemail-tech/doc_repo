---
id: 2026-07-30_BDC_CLOSE12_BUCKET1_pe_corner_split
title: BDC downtown drill — Bucket 1 PE corner-side display split
date: 2026-07-30
owner: cc-agent-C
repo: hauska-map
wdll: 2026-07-30_BASTROP_DOWNTOWN_DRILL_WDLL
items: [7c-display]
status: dispatched
---

# Bucket 1 — PE display split (8 parcels incl. 105054)

## Standing decisions

- Cotality extinguished / no Regrid / public-record only
- NO privileged data — uniform public endpoints only
- SmartCity READ-ONLY reference (never a data path)
- Deploys planner-owned
- Code-done ≠ customer-done — verify on traffic-shifted revision + full 36-parcel sweep + operator live block-QA (R6)
- CTX/national HELD until swept area passes + operator re-QA

## Work

`atom-chain-to-facets` maps `sideInteriorFt` + `sideCornerFt` → `side_interior_ft` / `side_corner_ft`. Inspect card + `formatSetbackDisplay` render `S 5′ · Corner 15′`.

## Verify live

48021:105054 facets: F25 / S5 interior / Corner15 / R25 (not single side=15).

## Deploy

Planner-owned Vercel deploy after merge.
