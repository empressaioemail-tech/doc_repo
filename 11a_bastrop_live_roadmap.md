---
id: 11a_bastrop_live_roadmap
title: Bastrop-live roadmap — Codex 1b → production + Code Ingestion Pipeline
status: active
last_updated: 2026-05-11
applies_to: portfolio
related: [11_roadmap, 07_product_line_summary, 30a_smartcity_stabilization_sprint, 27_engine_evolution_plan, 47_codex_plan_review, 48_codex_program_plan, 33_smartcity_codex_1b_integration, 42_design_accelerator_program_plan]
owner: nick
---

# Bastrop-live roadmap

> **End state.** Codex 1b live in Bastrop production. Sylvia and Jaime
> running real submittals through the SmartCity OS Plan Review surface.
> Anything past that is speculation until that state is reached.

> **Relationship to other docs.** This roadmap narrows the scope of
> [`48_codex_program_plan.md`](48_codex_program_plan.md) (7 phases through
> GA) to a single objective. The full 48 plan remains as the speculative
> superset; this doc is what's actively planned. The companion capability
> work — Code Ingestion Pipeline (Track B) — now lives in its own doc at
> [`49_code_ingestion_pipeline.md`](49_code_ingestion_pipeline.md). The
> sprint-level summary below remains for sequencing context; the full
> technical design lives in 49.

## The two tracks

| Track | Shape | What it produces |
|---|---|---|
| **A. Codex 1b → Bastrop live** | Finite — ships and ends | Codex 1b running in Bastrop production for Sylvia + Jaime |
| **B. Code Ingestion Pipeline** | Capability buildout — ships and keeps growing | A repeatable process that takes any jurisdiction's code in and produces atomized corpus out |

A and B can run in parallel after A.0 closes. If staffing forces a
choice, A wins. B exists because the moment Bastrop is live, the next
customer conversation needs a cheap path to "your code is loaded too."

---

## Track A — Codex 1b → Bastrop live

### A.0 — M-Stabilize closeout (in flight)

In flight per [`30a_smartcity_stabilization_sprint.md`](30a_smartcity_stabilization_sprint.md).

- WS-1 migration spine
- WS-3 remaining security items
- WS-4 schema / multi-tenancy

**Exit:** SmartCity OS stable on Empressa Neon end-to-end; multi-tenancy
verified; smartcity-os ready to receive Codex 1b receiving surface.

### A.1 — Engine + surface foundation (weeks 1-2)

Implementation work. Bulk of this is mechanical with cc-agents in parallel.

- **27-A.** Module boundary refactor in `legacy-design-tools` `api-server`.
- **27-B narrow.** Codex 1b-relevant atoms in registry. Cut from full plan:
  no `firm-tenant`, no `firm-precedent`, no `audit-trail-anchor`. In:
  whatever 1b reviewer-side findings need.
- **27-C.** Engine full-pass mode producing evaluable output on Moab
  projects (Musgrave, Seguin, Arena Roja R1).
- **One-off corpus load.** Bastrop UDC + Grand County IRC loaded via
  whatever script works. Productizing this happens in parallel via
  Track B; Track A does not wait.
- **Reviewer-side QA surface in `legacy-design-tools`.** Location decision
  + scaffold (CDX-Phase1-1).
- **Brand migration (Stream G).** Per [`27_engine_evolution_plan.md`](27_engine_evolution_plan.md);
  ships if PR #17 lands, otherwise carried into A.2.

**Exit:** Engine produces evaluable findings; QA surface routable;
Bastrop + Grand County corpora loaded one-off; brand-migrated where
unblocked.

### A.2 — QA loop (weeks 3-4)

- **CDX-3.** One-click AI review pass from reviewer surface.
- **CDX-4.** Finding accept / edit / reject; adjudication state persists
  as atoms.
- **CDX-5.** Jurisdiction switcher.
- **CDX-9.** Comment letter auto-draft via DA's `deliverable-letter` atom
  (shared with [`42_design_accelerator_program_plan.md`](42_design_accelerator_program_plan.md)
  Phase 2 DA-5).
- **CDX-EngineHook-prep.** Engine API contract drafted for smartcity-os
  consumption in A.3.
- **Engine-quality eval cycles.** Real Moab + Bastrop submittals through
  the loop; this is the actual time driver, not the implementation work.

**Exit:** Nick can run a real submittal end-to-end and point at every
output as an atom. M-CodexQA effectively achieved here, but the
milestone is not the goal — Bastrop production is.

### A.3 — Bastrop activation (weeks 5-7)

- **Cross-track coordination** with smartcity-os planner. Slot decision
  for Codex 1b receiving surface in smartcity-os (see
  [`33_smartcity_codex_1b_integration.md`](33_smartcity_codex_1b_integration.md)
  stub).
- **CDX-1b-prod.** Standalone integration in smartcity-os Plan Review
  surface.
- **CDX-Annotation.** PDF viewer + annotation layer in smartcity-os.
- **CDX-EngineHook.** Smartcity-os calls engine API contract from A.2.
- **CDX-DashboardFlow.** Findings flow into SmartCity OS operational
  dashboards.
- **Sylvia + Jaime onboarded** as reviewer-zeros. First real Bastrop
  submittal through Codex 1b in production.

**Exit (= end of Track A):** **Bastrop live.** Sylvia + Jaime running
real submittals in production. Program ends.

---

## Track B — Code Ingestion Pipeline

Companion capability. Starts when cc-agent capacity opens after A.1
staffs. Doesn't gate Track A. Full technical design in
[`49_code_ingestion_pipeline.md`](49_code_ingestion_pipeline.md); sprint
summary preserved below for sequencing context.

### B.1 — Input adapter framework

One adapter shape; implementations per source type.

- Municode HTML scrape
- eCode360 API
- Raw PDF OCR
- Jurisdiction-direct downloads

**Exit:** Any jurisdiction's code source flows into the pipeline.

### B.2 — Structural extraction

- Section / subsection hierarchy
- Defined terms
- Cross-references
- Code edition + amendment metadata

**Exit:** Structured tree out for any input.

### B.3 — Code atom types

New atom types added to registry: `code-section`, `code-definition`,
`code-amendment`, `cross-reference`. Coordinated single minor version
bump.

**Exit:** Atomized corpus out.

### B.4 — Retrieval index + eval harness

- Embeddings + structural lookup tuned per atom type
- "For known-answer query Q, does the right section come back?" gate
  before any jurisdiction is declared loaded

**Exit:** Quality bar enforceable per jurisdiction.

### B.5 — Version tracking + coverage dashboard

- Handle amendments (codes change every cycle)
- Surface which jurisdictions are at which quality bar
- Detect drift between loaded snapshot and current published code

**Exit:** Pipeline stable; corpus is a growing asset rather than a
frozen snapshot.

### B.6 — First validation pass

Regenerate Bastrop UDC + Grand County IRC via the pipeline. Diff
against A.1's one-off load.

**Exit (= Track B MVP):** Pipeline matches or exceeds one-off quality.
Ready to ingest the next jurisdiction without engineering work.

---

## Sequencing

- **A.0 gates A.3 specifically.** A.1 and A.2 do not require M-Stabilize
  to be done.
- **Track B can start after A.1 staffs.** If cc-agent capacity is
  constrained, Track A wins.
- **Cortex stays in scope passively.** Cortex shares the engine; A.1's
  engine work benefits it automatically. No Cortex-specific end-state
  is in this plan — Cortex objectives are a separate decision.
- **Code Ingestion Pipeline doc migration.** Done — Track B now lives
  in [`49_code_ingestion_pipeline.md`](49_code_ingestion_pipeline.md).
  This roadmap retains the sprint-level summary for sequencing context.

## What's deliberately absent

The following are real possibilities but post-Bastrop-live, and treated
here as speculation until that state is reached:

- Codex 1a invited mode (Bluebeam adapter)
- Phase 3 stretch features: parcel intelligence, per-reviewer learning,
  throughput dashboard, adaptive UI, conversational primitive, version
  drift detector, cryptographic audit trail
- Contractor firm pilot
- Pricing publication
- Public brand surface
- PropTech ecosystem outreach
- Hauska SDK external developer motion
- Audit trail / anchoring substrate decisions (ADR-006)
- Firm tenancy (ADR-009)

These remain in [`48_codex_program_plan.md`](48_codex_program_plan.md)
and [`47_codex_plan_review.md`](47_codex_plan_review.md) as the
superset. They re-enter active planning after Bastrop is live and you've
seen what actually matters next.

## Timeline (conservative)

**~6-8 weeks for Track A from M-Stabilize close.** Real bottleneck is
engine-quality eval cycles in A.2, not implementation hours. Track B's
MVP runs concurrently and exits B.6 sometime in or shortly after Track A.

The only thing that pushes beyond 8 weeks without scope creep is engine
quality. If eval surfaces 50 failure modes that each need a corpus
tweak / retrieval tweak / prompt tweak, the eval cycle becomes the
calendar driver. Plan for it but don't pre-pad for it.

## References

- [`11_roadmap.md`](11_roadmap.md) — parent portfolio roadmap (this doc
  is the active-objective slice)
- [`07_product_line_summary.md`](07_product_line_summary.md) — product
  line + value props
- [`30a_smartcity_stabilization_sprint.md`](30a_smartcity_stabilization_sprint.md)
  — A.0 dependency
- [`27_engine_evolution_plan.md`](27_engine_evolution_plan.md) — engine
  work source (27-A, 27-B, 27-C, 27-D, 27-G)
- [`47_codex_plan_review.md`](47_codex_plan_review.md) — Codex product
  home (vision; speculative content fine here)
- [`48_codex_program_plan.md`](48_codex_program_plan.md) — full 7-phase
  Codex program plan (superset; this doc is the active narrowing)
- [`33_smartcity_codex_1b_integration.md`](33_smartcity_codex_1b_integration.md)
  — cross-track stub for smartcity-os receiving surface
- [`42_design_accelerator_program_plan.md`](42_design_accelerator_program_plan.md)
  — sister program plan; shared engine work
- `49_code_ingestion_pipeline.md` — to be created when Track B begins

## Revision history

- **2026-05-11 (origin).** Drafted from planning conversation reframing
  Codex scope to "Bastrop live" as the only active objective, with Code
  Ingestion Pipeline elevated to a first-class companion capability.
  Narrows [`48_codex_program_plan.md`](48_codex_program_plan.md) Phases
  1-4 to two tracks; cuts Phases 5-7 as speculative. Replaces phase
  vocabulary with sprint vocabulary (A.0-A.3, B.1-B.6) to reflect
  AI-coding velocity (~weeks, not months).
