---
id: 2026-07-26_FIX3_cc_live_auth_depth_columns
title: Dispatch — FIX 3 CC Node&Graph live-auth + depth columns
status: closed
date: 2026-07-26
applies_to: [hauska-map, hauska-engine]
planner: depth-engine planning agent
cites:
  - _inbox/2026-07-26_bastrop_depth_reconciliation_finding
---

# FIX 3 — CC ledger tells truth

## Problem

NodeGraph fetches `/stats/central-tx-node-graph` without Bearer → 401 → stale artifact. Columns count any envelope; `%` is zoning breadth not depth.

## Required

1. Authenticate the tally fetch with `RETRIEVAL_API_KEY` (same pattern other CC panels use for retrieval). Prefer BFF proxy if browser must not hold the key.
2. Extend live tally JSON (retrieval `central-tx-tally.ts`) with per-county:
   - `depth_warm_promoted` (count buildable-envelope with `depthWarmPromotion=depth-warm-promoted-v1`)
   - `zoning_place_type` (P-1..P-5 or documented place-type filter)
   - `depth_ratio_place_type` pct
3. NodeGraph UI: new column(s) for depth-warm + place-type depth %; keep zoning `%` labeled as zoning breadth; Envelope column labeled so it is clear it is any-atom presence (or hide from depth reading). STALE badge gone when live auth works.
4. PRs (engine retrieval + map CC). CI green. No merge until planner go.

## Verify owed by planner

Load CC Node&Graph; Bastrop shows live depth matching authenticated SELECT; no STALE banner.
