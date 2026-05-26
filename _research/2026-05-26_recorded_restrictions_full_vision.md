---
id: 2026-05-26_recorded_restrictions_full_vision
title: Recorded restrictions full vision — research
date: 2026-05-26
status: active
last_updated: 2026-05-26
applies_to: portfolio
related: [80_adrs/adr_020_recorded_instruments_and_restriction_clauses, 80_adrs/adr_021_constraint_resolution_and_precedence, 49b_encumbrance_ingestion_pipeline, _decisions/2026-05-26_recorded_restrictions_phase_0_scope, 49_code_ingestion_pipeline, 27_engine_evolution_plan]
---

# Recorded restrictions full vision — research

> **Status:** Research / planning. Phase 0 **complete** 2026-05-26 (ADRs 020–021, 49b, decision record, dispatches). Implementation: Phase 1+ per [`_decisions/2026-05-26_recorded_restrictions_phase_0_scope.md`](../_decisions/2026-05-26_recorded_restrictions_phase_0_scope.md).

> **Origin:** 2026-05-26 strategic conversation — deed restrictions, CC&Rs, private encumbrances vs Code Library.

## North star

An agent (or architect, or city planner) opens **430 Evergreen Trl, Cedar Hill** and gets one **constraint lattice**:

1. **Public law** — adopted IRC/IBC + city UDC/zoning (`code-section` atoms, Layer 1/2).
2. **Public overlays** — FEMA, zoning district from Regrid/CAD, aquifer, etc. (`constraint-overlay`).
3. **Private recorded encumbrances** — deed restrictions, CC&Rs, plat notes, easements, HOA architectural rules (`recorded-instrument`, `restriction-clause`).
4. **Operational history** — permits, adjudications, firm precedent (`permit-precedent`, `adjudication-record`).

The "library" experience splits into two catalogs that **compose at the parcel**:

| Catalog | Question | Browse axis |
|---------|----------|-------------|
| **Code catalog** (today's Code Library) | What does the jurisdiction require? | State → city → edition → section |
| **Encumbrance catalog** (new) | What did prior owners and subdivisions bind this parcel to? | Engagement/parcel → subdivision → instrument → clause |

Full vision test (from dossier carryover): send **one `.hatom` bundle** for an address; any Hauska-aware agent renders plans, approvals, **and** the private restriction set with provenance, without re-scraping county sites.

## Canonical anchors (post Phase 0)

| Doc | Role |
|-----|------|
| [ADR-020](../80_adrs/adr_020_recorded_instruments_and_restriction_clauses.md) | Atom types |
| [ADR-021](../80_adrs/adr_021_constraint_resolution_and_precedence.md) | Precedence + `constraint-resolution` |
| [49b](../49b_encumbrance_ingestion_pipeline.md) | Ingest pipeline E.1–E.6 |
| [Decision](../_decisions/2026-05-26_recorded_restrictions_phase_0_scope.md) | Phase scope + checks |

## Phased delivery

| Phase | Scope | Status |
|-------|--------|--------|
| 0 | ADR scaffold, 49b, dispatches | **Done** |
| 1 | Upload + Encumbrances UI + briefing (R4) | Dispatched → cc-agent-C |
| 2 | Subdivision corpus + MCP | Queued |
| 3 | Plan review covenant findings | Queued |
| 4–6 | County, title, engine resolver | Queued |

See full vision sections below for taxonomy, partnership tracks, product surfaces, and risks (unchanged from planner recon).

## Taxonomy (instrument classes)

| Instrument class | Typical source | Scope | Plan-review relevance |
|------------------|----------------|-------|------------------------|
| Subdivision plat restrictions | County clerk plat / CAD | All lots in plat | Setbacks, use limits, building lines |
| Declaration of CC&Rs | HOA recording | Subdivision or phase | Use, maintenance, architectural control |
| Supplemental deed restrictions | Owner-to-owner recording | Often one lot | Height, materials, outbuildings |
| Easements | Plat or separate instrument | Appurtenant or utility | Build-over, access, drainage |
| HOA rules & design guidelines | HOA management (often unrecorded) | Subdivision | Aesthetic; weaker legally |
| Master development agreements | City + developer | District | Sometimes stricter than zoning |

## Load-bearing risks

1. Partnership surface area (cities + counties + title + HOAs per market).
2. Legal weight — atoms are substrate, not recorder replacements.
3. HOA unrecorded rules modeled separately from municipal code.
4. False conflicts from bad OCR — human verify before Layer 2 promotion.
5. Focus queue — sequence vs Cortex QA, Sync 5, Dallas E2E.

## Operator next cut

Bastrop walk: one platted subdivision, instruments on one lot, R1 vs R4 for first corpus. Then dispatch cc-agent-C Phase 1 on laptop.
