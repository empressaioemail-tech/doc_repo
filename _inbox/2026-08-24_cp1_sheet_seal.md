---
id: 2026-08-24_cp1_sheet_seal
title: CP1 — sheet seal + Find leftover split
date: 2026-08-24
plan_row: P-60
wdll: _inbox/2026-08-24_lane1_sheet_seal_WDLL.md
---

# CP1

Tree: `P:/tmp/hauska-map-sheet-seal` branch `fix/pe-sheet-seal` from `origin/main`. Isolated. Not A2.

## Split

- **Agent A (seal):** `fact-sheet-resolver.ts` + tests, `InspectCard.tsx` (unplaceable ≠ red). WDLL 1, 2, 4.
- **Agent B (swap):** `ExplorerMap.tsx` `runParcelLookup`, `subject-store.ts` if needed. WDLL 3. Do not edit resolver or InspectCard.

Subagents do not commit. Planner reviews diffs, runs tests, commits, PRs, deploys.

## Falsifier

If Wainee facets 200 and envelope declined with matching node, a card that is still red is a failed card.
