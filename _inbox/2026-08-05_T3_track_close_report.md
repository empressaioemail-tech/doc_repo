---
id: 2026-08-05_T3_track_close_report
title: T3 track close report — building footprints + public-utility easements
date: 2026-08-05
status: planner-verified
owner: nick
track: T3
related: [CATCHUP_program_2026-08-05, T3_rails_track, HEALTH_CHECK_2026-08-05_verdict]
---

# T3 track close report (master-planner verification)

Operator re-prioritization 2026-08-05: run footprints + easements rails end-to-end in one pass, fold into county recipe, never re-comb Texas. Six workstreams executed via Cursor-hosted executors; master planner independently re-verified probe evidence.

## Acceptance grading (T3_rails_track.md)

| Acceptance item | Grade | Evidence |
|---|---|---|
| Source registry entries with live-probe evidence per county (both rails) | **MET** | `_inbox/2026-08-05_T3_footprint_source_recon.md`, `_inbox/2026-08-05_T3_easement_source_recon.md`; planner re-probe BCAD FeatureServer (layers 0–8, no footprint), City Bastrop Easements count=148, McLennan Easement Text count=16,578 |
| Tiered-quality doctrine written | **MET** | Recon docs §Quality tier doctrine (cad-authoritative / ml-derived / honest-absence); routing rule A > B > C, never present C as CAD |
| Contract/ADR spec ready for master-planner ruling | **MET** | `80_adrs/adr_029_building_footprint_and_utility_easement_rails.md` (PROPOSED); two types: `building-footprint`, `utility-easement`; ADR-020 bridge via `linkedInstrumentDid` only |
| Recipe-line spec merged into runbook (Permanence Rule) | **MET** | `90_runbooks/factory_onboarding_runbook.md` §1C FE1–FE7; ingest spec `_inbox/2026-08-05_T3_ingest_spec_footprints_easements.md` |
| Bastrop pilot serving footprints on live map + site plan with citations | **NOT MET — blocked** | Pilot plan + local join dry-run only (`_scratch/bastrop_footprint_spatial_join_dryrun.json`). Blockers: (1) ADR-029 not accepted / no contract publish, (2) heavy-scan slot owned by T1, (3) serve-surface code not implemented |
| Phase 2 rollout complete across onboarded jurisdictions | **NOT MET — plan only** | Rollout plan + proposed registry `_catalog/t3_rails_registry_rows_proposed.json`; zero prod ingests (correct per coordination rules) |
| Per-parcel honest absence where sources do not cover | **SPEC MET / LIVE NOT MET** | Absence sentinel shape in ADR-029 + ingest spec; live atoms await pilot apply |
| Queue rows flipped | **PARTIAL** | Recon/spec/recipe rows closable; pilot + Phase 2 apply rows remain OPEN until slot + ADR |

## Key findings (planner-verified)

### Footprints

- **BCAD operator observation reconciled:** eSearch/BIS map shows EagleView ortho + CAMA tabular improvement areas — **not** a public vector footprint REST layer. `BastropCADWebService` FeatureServer has Parcels (65,285) only.
- **0/11** onboarded counties expose CAD-authoritative footprint polygons on public REST.
- **Default routing:** Microsoft Global ML Building Footprints (Texas), `sourceTier=ml-derived`, ODC-By license.
- **Follow-on:** `bastropcad.org/data-downloads` bulk export may unlock Tier A if sketch shapefiles exist offline.

### Easements

- **County pattern:** recorded property easements are overwhelmingly **document-parse** or **honest-absence** at county scale.
- **McLennan exception:** CAD Easement Lines (44,197) + Easement Text (16,578) — strongest county GIS rail; partial DOC_NUM coverage.
- **Municipal overlays (Phase 2b):** City of Bastrop 148 polys; Round Rock 1,254; Cedar Park 8,400 — ETJ/city-limits scoped, not county fan-out.
- **Do not conflate:** PipelinePlus, RRC, PUCT CCN, MUD = utility-adjacent only.

## Deliverable index

| Workstream | Artifact |
|---|---|
| WS1 Footprint recon | `_inbox/2026-08-05_T3_footprint_source_recon.md` |
| WS2 Easement recon | `_inbox/2026-08-05_T3_easement_source_recon.md` |
| WS3 Contract/ADR | `80_adrs/adr_029_building_footprint_and_utility_easement_rails.md` |
| WS4 Ingest + recipe | `_inbox/2026-08-05_T3_ingest_spec_footprints_easements.md`; runbook §1C |
| WS5 Bastrop pilot | `_inbox/2026-08-05_T3_bastrop_pilot_plan.md`; dry-run `_scratch/bastrop_footprint_spatial_join_dryrun.json` |
| WS6 Phase 2 plan | `_inbox/2026-08-05_T3_phase2_rollout_plan.md`; `_catalog/t3_rails_registry_rows_proposed.json` |

## Master-planner rulings requested (ADR-029 open items)

1. **Accept ADR-029** and authorize `@empressaio/atom-contract` ~1.9.0 registration (cc-agent-AC dispatch).
2. **ML footprint accessPolicy:** confirm `public-paid` vs `public-free` under ODC-By + ADR-028 license block.
3. **Absence sentinel shape:** per-parcel vs county-coverage atom at serve time.
4. **Grant heavy-scan Slot 1 / FIPS 48021** to T3 after T1 envelope re-warm schedule agreed (pilot apply).
5. **Phase 2b municipal easements:** approve city-scoped ingest for Bastrop city limits before county-wide Phase 2 slot 1 closes.

## Next dispatch (after rulings)

1. cc-agent-AC: register `building-footprint` + `utility-easement` in atom-contract (ADR-029).
2. cc-agent-E: `ingest-site-layers` adapter scaffold + Bastrop dry-run CLI (no apply until slot).
3. cc-agent-C/map: footprint overlay + site-plan BUILDING_FOOTPRINT layer (post contract pin).
4. T3 Phase 2 slots 2–8 per rollout plan, one FIPS per heavy-scan reservation.

## Coordination notes

- T1 owns heavy-scan slot; T3 pilot apply **must not** run until master planner logs slot grant.
- No contract publishes occurred this session (correct).
- T1/T2/T4/T5 lanes untouched (claims honored).
