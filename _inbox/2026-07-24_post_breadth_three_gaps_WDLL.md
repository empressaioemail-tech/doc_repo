---
id: 2026-07-24_post_breadth_three_gaps_WDLL
title: WDLL — post-breadth three gaps (jurisdiction + zero-county probe + setback emit)
status: approved
date: 2026-07-24
applies_to: legacy-design-tools, hauska-engine
owner: nick
---

# WDLL: post-breadth three gaps

Date: 2026-07-24  
Status: approved (operator dispatch)  
Operator approval: 2026-07-24

## Done looks like

Multi-city counties resolve zoning jurisdiction per parcel from the PIP-matched city layer (not a county sole-key). PR #353 is green and merged. Guadalupe / McLennan / Bell honest-0% zoning are diagnosed with dry-run probes under the paging fix — stamped only if fixable. Named Austin / SA / absence parcels show live setback-RULE (and envelope where dims allow) via the per-parcel cityKey. Milestone report in `_inbox/`. Phase 2 not opened.

## Acceptance items

1. `txgio_parcel.zoning_jurisdiction` column exists (migration 0062); stamp writes cityKey alongside district | check: migration applied + stamp summary / sample SQL | grade: [MET]
2. `resolveZoningJurisdiction(parcel)` is PIP-authoritative; `wiredZoningCityKeys` returns a Set; sole-city helper deprecated/null | check: unit tests + code | grade: [MET]
3. Tier-1 bake consumes per-parcel jurisdiction; Travis tests assert SET {austin-tx, pflugerville-tx} | check: jurisdictions.test.ts + Tier1 CLI | grade: [MET]
4. PR #353 Typecheck + Test green; merge on green only | check: `gh pr checks 353` verbatim + merge | grade: [MET]
5. Guadalupe / McLennan / Bell dry-run probe: real gap vs fixable; stamp only fixable | check: probe logs + BEFORE/AFTER if stamped | grade: [MET]
6. Setback emit via resolved cityKey; live chains: Austin, SA, honest-absence | check: pasted atom-chain JSON | grade: [MET]
7. Milestone report filed; cost under $200/county; no Phase 2 | check: `_inbox/` report | grade: [MET]

## Amendments

(none yet)

## Aside (out of scope)

Regrid adapter tests still live in `lib/adapters` despite 2026-06-17 Cotality purge — flag to planner; do not fix in #353.
