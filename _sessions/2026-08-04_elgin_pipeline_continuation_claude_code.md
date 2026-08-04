---
id: 2026-08-04_elgin_pipeline_continuation
title: Session — Elgin pipeline continuation: Tier-1 → bake → 8/8 gate → warm 1886 promoted; Bastrop cert holds 7/7
date: 2026-08-04
status: closed
owner: nick
agent: cursor_grok (planner) + composer-2.5-fast executors
related: [90_operations/onboarding_defect_class_backlog, _decisions/2026-08-04_elgin_setback_table_ratified, _sessions/2026-08-03_elgin_foundation_and_city_code_refs_claude_code]
---

# Elgin pipeline continuation (STEPS 1–5)

Operator greenlit autonomous planner execution 2026-08-04. Recon-then-review throughout; composer-2.5-fast executors for builds; planner owned merges and prod data-runs.

## STEP 1 — Tier-1 facet re-bake (ldt)

County-wide `--county=48021` only (no Elgin-only flag). Planner ruled semantic Bastrop safety via monotonic `shouldPromote` acceptable. Dry-run then apply: parcels 63,357 / zoning facet 9,620 / promoted upgrade 63,232 / kept mono 125. Post-verify: Elgin Tier-1 zoning facets **3,762** (from 3,798 stamped; collision-explained: multi-geometry prop_id surplus + prop_id=0); Bastrop city Tier-1 **5,773 unchanged**. Artifact: `_inbox/2026-08-04_elgin_step1_tier1_rebake.md`.

## STEP 2 — Engine zoning-fact bake + Option A wiring

Recon caught two blockers before any bake: (1) `COUNTY_FIPS_TO_DISTRICT_MAP_KEY` forced `bastrop_tx` code refs for all 48021; (2) `getSetbackTableForZoning("elgin-tx")` missed because table key is `elgin-development-code`. Planner ruled Option A (proper fix), not mint-then-backfill.

Engine **#226** merged `5ad7755` (CI conclusion string gated; first red was real WDLL 3.8 `\bTX\b` trip on hyphenated `elgin-tx` in a JSDoc — fixed to underscore). Bake dry-run == apply: zoningPresent 9,535 / setback+envelope **3,762** / emitErrors 0 / spikeFlags []. Live SQL: Elgin code refs 3,762; stale cascade on Elgin district parcels **0**; cascade remaining 52,726 (= 56,488 − 3,762); Bastrop gold parcels intact. **REASON-OVERSTATES Elgin slice CLEARED.** Artifact: `_inbox/2026-08-04_elgin_step2_zoning_fact_bake.md`.

## STEP 3 — Re-gate

`onboard-preflight --fips=48021` with DATABASE_URL + CORTEX_DATABASE_URL + RETRIEVAL_API_URL/KEY: **Bastrop 8/8, County 8/8, Elgin 8/8**, ledgerEvents []. ADAPTER-NEEDED + PARCEL-LAYER-UNWIRED cleared for Elgin. Artifact: `_inbox/2026-08-04_preflight_48021_elgin_regate.json`.

## STEP 4 — Depth warm + cert

Code: **#227** `8c52eb4` (ELGIN_CITY_BBOX from AGOL Elgin_Zoning extent, depth-warm-elgin-batch, descriptor cert answer key). First warm pilot 49/50 `no-road-adjacency` — diagnosis: Elgin streets are almost all `county-roadway-undefined` (filtered from warm pool by design); nearest convertible road ~600m. **#228** `f90aaf5` OSM ingest for Elgin bbox; prod ingest **2,356** ways.

Warm promote city-cohort: processed **3,762** / promoted **1,886** / verifyFail 1,564 / no-road-adjacency 57 / no-setback-row 255 / cost under gate. Bastrop block-13 cert re-run: **7/7 CERT-RESTORE ELIGIBLE** (`_inbox/2026-08-04_bastrop_block13_post_elgin_warm_path.json`).

Elgin cert (descriptor answer key): promoted sample **2/10** — not CERT-RESTORE yet. Residual classes (queued, not value-table changes): (a) frontOrientation token match OSM vs CAD situs abbreviations (Avenue/AVE, SH/State Highway, FM/Farm-to-Market); (b) served rear 0 vs descriptor 10 on some rows (`not_specified`/emit path); (c) occasional per-edge role/index mismatch. ScopeAnnotations on cert path still claim Rail A unwired (known cert-path probe gap; standalone gate shows PASS).

## Process notes

- CI merges gated on conclusion string + headSha match (#226 WDLL fix; #227 PDF dossier flake → one `--failed` rerun → success).
- STOP-on-false-premise used twice: Option A before bake; OSM ingest after no-road-adjacency diagnosis.

## Queued

- Elgin cert residual classes (orientation tokens, rear:0 emit, inset role) → re-cert toward CERT-RESTORE.
- Smithville REASON-OVERSTATES neutral re-word (Elgin slice done).
- rowId-keyed cohort loader; cert-path HTTP probe wiring; Travis-side Elgin sliver; PE governed_by / X-ray display (product).
- C-2/I/R-4 warm coverage thin (no-setback-row / verifyFail) — governed_by / formula rows.
