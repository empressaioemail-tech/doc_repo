---
id: 2026-05-11_codex_cortex_program_plans_claude_ai_planner
title: Codex + Cortex program plans + engine evolution plan
date: 2026-05-11
agent: claude-ai-planner
repo: doc_repo
session_type: doc_framing
status: active
rolled_up: true
rolled_up_into: [27_engine_evolution_plan, 42_design_accelerator_program_plan, 48_codex_program_plan]
---

# Codex + Cortex program plans + engine evolution plan

Comprehensive planning session: drafted three new canonical docs covering shared engine evolution, Design Accelerator (Cortex going forward) program through GA, and Codex program through GA. Capturing the plan in doc_repo so future sessions execute rather than replan. Followed by a same-session cross-track audit pass that added brand migration scope, test isolation reassignment, and Phase 4 coordination note.

## Inputs

- doc_repo orientation report (commit anchor `b144bef`; full read of predecessor Codex launch session 2026-05-10; full state of `47_codex_plan_review.md`, `05_living_lineage_thesis.md`, `06_cities_value_narrative.md`, ADR-007, ADR-008; sister session summaries from migration-track planner; roadmap and migration sprint state)
- Pasted full content of `40_design_accelerator.md` and `40a_customer_zero_observations_arena_roja_2026_05_06.md` mid-session
- Customer-zero observations from `40a_*` drove DA-side atom expansion (L1–L6 fixes)
- Cross-track audit pass against parallel SmartCity OS Stabilization Sprint + fresh recon of doc_repo + legacy-design-tools + smartcity-os

## Outputs

### Three new canonical docs (final content after audit pass)

- `27_engine_evolution_plan.md` — shared engine work stream + atom registry expansion. Seven streams: A (module boundary refactor), B (atom registry implementation), C (engine output quality), D (corpus depth), E (SDK gap closure, gated), F (performance, gated), G (brand migration, added in audit pass). Specs new atoms for both Codex-side (firm-tenant, firm-precedent, per-reviewer-learning, audit-trail-anchor, code-change-broadcast-event, version-drift-snapshot-diff, jurisdictional-precedent) and DA-side (sheet-content-extraction, attached-document, detail-callout-spec, product-spec-reference, deliverable-letter, response-task) driven by customer-zero observations.
- `42_design_accelerator_program_plan.md` — DA program plan from current state through GA. Six phases: Phase 1 foundation (with `DA-Test-Iso` added in audit pass), Phase 2 QA enablement (the QA-readiness milestone), Phase 3 stretch features, Phase 4 Empressa Moab pilot, Phase 5 external pilot, Phase 6 GA. Phase 2 closes customer-zero L1/L2/L3/L6 gaps and lands B1 taxonomy minimum. Cortex rebrand acknowledged at top.
- `48_codex_program_plan.md` — Codex program plan from current state through GA. Seven phases with 1b-first scoping (1a deferred to Phase 5): Phase 1 foundation, Phase 2 1b QA enablement (the QA-readiness milestone), Phase 3 1b stretch, Phase 4 Bastrop activation (with cross-track coordination note added in audit pass), Phase 5 1a invited mode revisit, Phase 6 contractor firm pilot, Phase 7 GA. Cross-track dependencies with SmartCity OS planner explicit.

### Audit pass outputs (this session, post-initial-drafts)

- Stream G (brand migration) added to `27_*` with sequencing (UI copy first, internal identifiers later), gating (hold for PR #17), feature flag decision (not needed), and AGENTS.md `gh` CLI claim correction bundled in.
- `DA-Test-Iso` stream added to `42_*` Phase 1: resolve 4 timestamped `test_<unix_timestamp>_<8hex>` schemas on production-shared Neon (separate test DB or in-memory fixtures recommended). Smartcity-side analog noted as Stabilization Sprint WS-4.
- Cross-track coordination note added to `48_*` Phase 4: smartcity-os slot decision for Codex 1b receiving surface deferred to smartcity track or post-stabilization coordination session.
- Repo path references verified (`legacy-design-tools` consistent throughout; `P:\legacy-design-tools` local; `empressaioemail-tech/legacy-design-tools` remote).
- Cortex rebrand acknowledged in `42_*` current state (canonical product name retained pending `40_*` migration).

## Decisions

1. **Two parallel program plans, shared engine doc** — separate `42` + `48` + shared `27` instead of one combined doc or three full per-track docs; cleanest separation between architect-side and reviewer-side surfaces while keeping engine work in one place.
2. **Phase shape — same skeleton for both program plans**: current state → QA-readiness milestone → phases-with-first-phase-detail → post-QA placeholders → open decisions → references. Lighter detail in later phases with refinement at phase entry.
3. **QA-readiness milestone definition — 8-point structural definition per product surface**: Nick can run a real project end-to-end and structurally evaluate every output (findings, briefings, deliverables) as classified atoms, not free-form chat.
4. **Codex 1b first, 1a deferred to Phase 5** — 1b can QA today using existing engine; 1a requires Bluebeam adapter + ToS gate + firm tenancy ADR. Note in `48` to revisit 1a when gates clear.
5. **Engine + atom registry expansion in one shared doc (27)** — original plan was separate atom registry expansion; consolidated into `27` because they're operationally inseparable (engine evolves to support new atoms; new atoms drive engine work).
6. **`27` slot used for engine evolution plan** — atom registry expansion home settled here rather than appended to `25` or as new sub-doc.
7. **ADR-009 firm tenancy schema deferred** — not needed for 1b QA; queued as Phase 5 gate in `48`.
8. **Migrations (33, 46, 51) queued for next session** — not load-bearing for the plans; can run as separate dispatches.
9. **Brand migration as a stream in `27` (Stream G), referenced from `42`/`48`** — cross-cutting code rename fits as a stream in `27` alongside other cross-cutting work like module boundary refactor (Stream A). Both Plan Review → Codex (larger half) and Design Accelerator → Cortex (smaller half) bundled in one stream because they're touched together at PR time.
10. **Test isolation footgun assigned to `42` Phase 1 (`DA-Test-Iso`)** — was in `11_roadmap.md` P3 generic-agent-owned; reassigned to DA program plan since the affected repo is `legacy-design-tools`.
11. **`27` Stream G out of scope for doc_repo doc-filename renames** — `42_design_accelerator_program_plan.md` → `42_cortex_program_plan.md` is a separate coordination step after canonical `40_design_accelerator.md` migrates.
12. **Phase 4 in `48` cross-track coordination note** — Phase 4 entry gated on smartcity track's slot decision or a dedicated coordination session, not assumed to "just work" via implicit coordination.
13. **Roadmap edits dropped from session-close output** — orchestrating planner is doing portfolio-wide roadmap revision in same session.

## Lessons / patterns

- **Comprehensive planning > tactical execution** when destination is a future state (QA-readiness) requiring multiple parallel agent streams. Capturing the plan once in doc_repo prevents replanning every session and lets every future session execute against rails.
- **Customer-zero observations doc (`40a_*`) → atom expansion** worked as a translation pattern. Each L1–L6 limitation became a specific atom in the registry expansion (sheet-content-extraction, deliverable-letter, response-task, etc.). The customer-zero doc IS the requirements doc for DA-side atoms; treating it that way makes the chain Inputs → Atoms → Features → Streams traceable.
- **QA-readiness as a phased milestone (not a launch criterion)** — Phase 2 exit in both program plans. Distinguishes "can do detailed QA" from "ready for pilot" from "ready for GA." Lets planning specify what's needed for each gate without conflating them.
- **Cross-track coordination notes go in the receiving plan, not the dispatching plan** — Phase 4 coordination note in `48` references what the smartcity planner is doing rather than the smartcity planner referencing what `48` needs from them. The receiving side knows what it depends on.
- **Audit pass before commit is high-leverage** — repo path verification, brand migration scope (zero "Codex" references in repo today caught early), test isolation reassignment, and cross-track coordination gap all caught in the audit. Worth a recon roundtrip before session-close lands.
- **Brand migration as cross-cutting code work, not strategic decision** — the strategic call was made 2026-05-10 (Codex naming landed). The code rename is mechanical follow-through; specs as a stream not an ADR.
- **Zip-handoff pattern for context-window resilience** — when planner output exceeds courier paste limits, bundling as a zip on disk and letting the doc_repo agent read from disk decouples planner output size from commit pipeline. Pattern established this session after inline paste hit truncation.

## Outstanding from this session (handed forward)

### Pre-docs-repo migrations queued
- `33_hauska_sdk_roadmap.md` — gates CDX-15 (audit trail) in `48` Phase 3
- `46_smartcity_parcel_intelligence.md` — informs CDX-6 in `48` Phase 3 and Bastrop property intelligence
- `51_design_accelerator_parcel_intelligence.md` — relevant to engine factor-out (ADR-008) and DA-side parcel briefing depth

### Deferred docs
- `adr_009_firm_tenancy.md` — Phase 5 gate in `48` (revisit when 1a returns to active scope)
- ADR-005 multitenancy migration — gates external pilot in `42` Phase 5
- ADR-006 anchoring substrate — gates `audit-trail-anchor` atom production specifics

### Open decisions from program plans (also surfaced in respective docs' Open decisions sections)
- Reviewer-side QA surface location in legacy-design-tools (`48` Phase 1 CDX-Phase1-1)
- B1 schema design (`42` Phase 2 DA-7)
- ICC-ES integration mechanism (`42` Phase 3 DA-11, `27` open decisions)
- Detail library backing (`42` Phase 3 DA-10, `27` open decisions)
- Empressa-as-customer-zero rotation (`42` Phase 4 DA-17; affects `48` Phase 2)
- Reviewer-side surface migration to smartcity-os (`48` Phase 4 cross-planner design call)
- Smartcity-os slot decision for Codex 1b receiving surface (smartcity track deliverable; this track tracks as awareness)
- Brand migration sequencing within UI-copy phase (`27` Stream G sprint-level call)
- Route URL strategy for Stream G (`/plan-review/` redirect vs alias)
- Test isolation replacement (`42` `DA-Test-Iso` sprint-level call)
- Doc rename timing (`42_*` and `48_*` doc filename renames after `40_*` and `47_*` migrate)

### Coordination with orchestrating planner and parallel tracks
- Roadmap revision (cross-references to 27/42/48/30a + end-state milestone shape) is the orchestrating planner's session work; not in this session-close.
- `10`/`11`/`12`/`13` working-tree dirt from migration-track planner remains untouched by this commit.
- SmartCity OS Stabilization Sprint coordination point: WS-4 (MyGov raw-records audit) is the smartcity-side analog of `DA-Test-Iso`; share findings if test-isolation pattern proves portfolio-wide.
- SmartCity OS planner's slot decision for Codex 1b receiving surface: gates `48` Phase 4 entry; tracked in `48` cross-track coordination note.

## References

- `27_engine_evolution_plan.md` (new this session)
- `42_design_accelerator_program_plan.md` (new this session)
- `48_codex_program_plan.md` (new this session)
- `47_codex_plan_review.md` — Codex product home (input)
- `40_design_accelerator.md` — DA product home (input)
- `40a_customer_zero_observations_arena_roja_2026_05_06.md` — DA atom expansion driver
- `05_living_lineage_thesis.md`, `06_cities_value_narrative.md` — strategic framing
- `80_adrs/adr_001_atom_architecture.md`, `adr_007_cross_stakeholder_atom_access.md`, `adr_008_engine_factor_out.md` — architectural commitments
- `25_atom_architecture_reference.md`, `26_atom_upgrade_guide.md` — atom contract reference
- `_sessions/2026-05-10_codex_launch_claude_ai_planner.md` — predecessor session
- `_sessions/2026-05-10_fire_1_closed_and_bar_c_kickoff_claude_ai_planner.md`, `_sessions/2026-05-10_phase_1b_stage_1_verified_and_fire_4_pr_claude_ai_planner.md` — parallel migration-track sessions (uncommitted in working tree at time of this commit)
