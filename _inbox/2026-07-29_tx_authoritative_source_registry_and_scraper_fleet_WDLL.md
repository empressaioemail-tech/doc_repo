---
id: 2026-07-29_tx_authoritative_source_registry_and_scraper_fleet_WDLL
title: WDLL — TX authoritative land-use code registry (Batch 1 CAPCOG) + eCode360/muni-site scrapers
status: approved
last_updated: 2026-07-29
applies_to: portfolio
related:
  - 2026-07-29_setback_authoritative_source_and_road_decouple
  - 28_THE_BASTROP_MOLD_engine_build_spec
  - 90_runbooks/wdll_practice
operator_approval: 2026-07-29 (operator handoff = approval; this card freezes Start)
---

# WDLL: TX authoritative land-use code registry + scraper fleet (Batch 1)

Date: 2026-07-29  Status: approved
Operator approval: 2026-07-29 via planner handoff (this Start card)

## Done looks like

Batch 1 (CAPCOG footprint: Bastrop, Travis, Williamson, Hays, Caldwell + their incorporated places) has a single merged JSON registry at `_catalog/tx_jurisdiction_source_registry.json` where every row names the AUTHORITATIVE CURRENT source of record, carries a currency-proof cross-check (library-"current" vs jurisdiction's own adoption/repeal page), and names a reachable ingest path. Two generalizable scrapers exist in `hauska-engine` (eCode360 header-first; municipal-site) proven on Smithville and Pflugerville with planner-run verbatim-fidelity gates PASS. No live-corpus ingestion, bake, warm, or engine serving change happened. Completeness ledger is fail-loud: attempted must equal in_scope or the wave is not done.

## Acceptance items

1. **Seed list locked** | check: `_catalog/tx_capcog_batch1_seed.json` exists with Census FIPS place-codes, every jurisdiction assigned to exactly one shard, CDPs excluded | grade: [ ]
2. **Track A per-shard registry files complete** | check: every shard file under `_catalog/tx_registry_shards/` covers its seed list; each shard reports in_scope / attempted / complete / gap-list; attempted == in_scope OR ledger explicitly marks wave incomplete | grade: [ ]
3. **Canonical registry merged** | check: `_catalog/tx_jurisdiction_source_registry.json` is planner-merged, deduped by `fips_place_code`, every schema field present or explicitly null/"unknown" with provenance note; no blanks | grade: [ ]
4. **Currency check executed per row** | check: every city/county with a published code has `currency_proof` populated; `prior_code` filled when a recent repeal/replacement is detected; recent-repeal list surfaced in coverage summary | grade: [ ]
5. **Coverage summary** | check: `_catalog/tx_jurisdiction_source_registry_coverage_summary.md` has counts by regime_type, reachable_adapter (incl. newly-unlocked eCode360 count), unzoned, recent-repeal-detected, plus completeness ledger | grade: [ ]
6. **B1 eCode360 scraper (header-first)** | check: scraper lives under `hauska-engine/packages/corpus/src/adapters/` (sibling path); robots.txt read first; ≤1 rps; fails LOUD on block (no empty stub); if headers do not clear 403, STOP report filed (no evasion escalation) | grade: [ ]
7. **B1 Smithville proof extraction** | check: raw HTML/bytes + NormalizedBlock[] on disk; planner-run fidelity harness reports coverage %; fail-closed on dropped/altered legal-text spans; PASS required | grade: [ ]
8. **B2 muni-site scraper (Pflugerville)** | check: crawler locates real UDC content from stub landing page; PDF path calls existing raw-pdf adapter fetch/normalize to a FILE ON DISK only (no bake/ingest/DB); per-city vs generalizes breakdown filed | grade: [ ]
9. **B2 Pflugerville proof extraction** | check: raw source + NormalizedBlock[] on disk; planner-run fidelity harness PASS | grade: [ ]
10. **Gaps register** | check: jurisdictions where authoritative source could not be confirmed listed with why | grade: [ ]
11. **Out-of-scope held** | check: zero live-corpus writes, zero bake/warm, zero engine serving changes, zero corpus-DB writes, zero partnership ask, no TX beyond Batch 1 | grade: [ ]

## Standing decisions (travel in every sub-dispatch)

- PUBLIC-RECORD sources only. No Cotality, no Regrid, no relationship/tenant/privileged data. SmartCity is READ-ONLY reference, never a data path.
- We are NOT partnering with eCode360 / General Code. We SCRAPE public law text. Do not propose partnership as the path.
- NO live-corpus ingestion, NO baking, NO engine serving changes, NO corpus-DB writes in this wave.
- Verify LIVE. Verification is NEVER delegated to the executor.
- SCRAPER ETHICS CEILING: ≤1 rps/host; read robots.txt and STOP if disallowed; if corrected headers do not clear 403, STOP and report — no IP/proxy rotation, session/cookie replay, or CAPTCHA-solving.
- Deploys/commits are planner-owned.
- Two subsystems: this wave touches ONLY corpus code-text adapters (`packages/corpus/src/adapters/`), NOT GIS data-layer adapters (`packages/adapters/src/`).
- Adapter output contract: `NormalizedCode = { metadata, blocks: NormalizedBlock[] }` with flat heading|paragraph|definition|cross-reference|table|figure|note|amendment-record. No Section type.

## Amendments

(none yet)

## Finish card (graded at close)

(graded at wave close)
