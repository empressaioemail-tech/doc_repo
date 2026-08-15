---
id: 2026-07-29_BDC_STEP1_ingest_edition_flip
title: Dispatch — STEP 1 BDC ingest + currentEditionId flip
date: 2026-07-29
status: dispatched
repo: hauska-engine
wdll: 2026-07-29_BASTROP_BDC_setback_correction_WDLL
wdll_items: [4, 5]
depends_on: [STEP 3 merged — WDLL 1-3]
---

# STEP 1 — after STEP 3

## STANDING DECISIONS
- Cotality extinguished; no Regrid ever; public-record adapters only.
- No privileged/relationship data; SmartCity READ-ONLY, no-touch.
- Deploys planner-owned; code-done ≠ customer-done; LIVE serving revision.
- Standing decisions travel. CTX HELD until certification passes.

## WDLL items: 4, 5

## Do
1. Locate Ord. 2026-06 / Chapter 14 full text (corpus already links PDF; probe extract may be at scratchpad bdc.txt — find or re-extract).
2. Ingest as code-section atoms INTO existing stub `bastrop_tx-bdc-2026-adopted` (snapshot has sectionIds:[]). Fill 14.02.003 dimensional standards at minimum; prefer Chapter 14 sections needed for citation chain.
3. CODE fix: `packages/corpus/src/edition-history/ingest.ts:172` uses `currentEditionId ?? existing` so re-ingest NEVER advances pointer. Add explicit current-edition advancement on temporal supersession (or atom-migration step). Point currentEditionId → BDC.
4. Close B3 at 2026-04-13T23:59:59 / BDC opens 2026-04-14 — MATCH existing IBC-2018 boundary already in snapshot (do not invent a date).
5. Confirm flip does NOT disturb IBC/ICC building-code path sharing the same jurisdiction-corpus (tests + snapshot asserts).
6. Commit regenerated snapshot. Open PR. Do NOT deploy. Do NOT self-grade LIVE.

## Hold
Do not merge before STEP 3 green. Coordinate with planner.
