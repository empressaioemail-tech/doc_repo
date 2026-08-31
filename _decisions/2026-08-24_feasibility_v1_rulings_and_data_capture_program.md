---
id: 2026-08-24_feasibility_v1_rulings_and_data_capture_program
title: Feasibility v1 rulings, tier placement, and the effort-tiered data capture program
date: 2026-08-24
status: active
owner: Nick (operator), recorded by planner
supersedes: none
related:
  - _inbox/2026-08-24_feasibility_v1_plan_DRAFT.md
  - _inbox/2026-08-24_track_coverage_map_DRAFT.md
  - _inbox/2026-08-23_phase2_data_ingest_program.md
  - _inbox/2026-08-22_parcel_public_facts_gap_matrix.md
  - _inbox/2026-08-10_smartsite_pricing_and_gtm_LOCKED.md
---

# Feasibility v1 rulings and the data capture program shape

Operator rulings given in-session 2026-08-24, answering the four open calls in the feasibility v1 plan and shaping the data capture program around it.

## Decisions

1. **Tier placement ratified as proposed.** The composed Feasibility Study PDF is a Studio deliverable. A $15/30-day unlocked property receives the reduced package: all sections minus owner data and minus appended CAD-tier content. Share carries whatever the sharer stored, including a generated feasibility PDF, per the locked full-fidelity share ruling. This closes the pricing call RPT1 recorded as unmade.

2. **The feasibility v1 WDLL shape is approved**, with the amendments below recorded in the plan doc. The report is built with honest-absence notations throughout, sits inside the pricing strategy, and is functionally exportable to the correct tiers. Backfill upgrades sections from honest absence to findings over time; the document shape does not change when data lands.

3. **ETJ adapter card approved** (gap matrix row 35, TxGIO City_Boundaries). First ingest item by report value. **Amended 2026-08-24:** P-76 ships the city-limits half (incorporated / unincorporated). ETJ stays unresolved until a later derivation card. P-76 does not close this ruling.

4. **Utilities are in scope for feasibility; who-serves promotion approved.** The staged L22 territory polygons (PUCT CCN water/sewer, HIFLD electric, TWDB PWS, TCEQ) get a served read path. The section states territory holders plus the fixed SERVICE-LETTER-REQUIRED residual. This satisfies the operator ruling reserved by A-012.4.

5. **HOA and recorded documents are a separate program, scoped before built, probably shipped separate.** In feasibility v1 the section ships as an honest absence with the Smart Files mount slot. When recorded-document capture starts, it is scoped holistically: all recorded instrument classes considered together (CC&Rs, management certificates, easements, mineral and oil-and-gas instruments), captured and organized correctly the first time, not incrementally patched. A scoping card precedes any build.

6. **The data capture program is split by effort tier.** Low-hanging fruit ships first (ETJ, who-serves promotion, footprint drain, CAMA depth rows). Harder items run as backfill. Before any new ingest wave, the parcel facts deficit is mapped completely so fields land mapped right the first time; the operation is currently paying for not having done this (ongoing data cleanup) and does not do it again.

7. **Backfill is its own 24/7 program.** The existing started program continues but needs refinement as a named workstream: prioritization by report value, honest coverage accounting, and the effort-tier split above.

## Adjacent rulings from the same session

- **Cold starts:** no min-instances spend yet. Operator will trial the shipped timeout hardening (P-60c) first; min-instances 1 on `hauska-retrieval-api` stays an open option if the softened behavior is still unacceptable.
- **Stripe:** pricing rebuild is a go (sandbox rebuild plus tier-aware wiring). Live-mode activation and annual price amounts remain operator-owed inputs.
- **Tile bake / click resolution:** deferred deliberately; the P-60d highlight fix ships first, click-resolution accuracy is a named follow-up, not silent scope.

## Reversal criteria

- Tier placement (1) reopens only if unlock-conversion data shows the $15 residual package cannibalizes Solo, or Studio attach shows the package priced into the wrong tier.
- The HOA-separate ruling (5) reopens if a cheap, reliable single-county recorded-docs source makes an incremental pilot cheaper than the holistic scoping it replaces; the burden is on showing the pilot does not create a second cleanup program.
- The effort-tier split (6) reopens if a hard item becomes a launch blocker for a paying customer, in which case it jumps the queue by decision, not by drift.
- Ruling 3 ETJ deferral reopens if a statewide ETJ polygon source appears; then a derivation card can replace the unresolved chip.
