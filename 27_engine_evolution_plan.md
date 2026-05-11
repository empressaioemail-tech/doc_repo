---
id: 27_engine_evolution_plan
title: Engine evolution plan and atom registry expansion
status: active
last_updated: 2026-05-11
applies_to: portfolio
related: [25_atom_architecture_reference, 26_atom_upgrade_guide, 40_design_accelerator, 47_codex_plan_review, 42_design_accelerator_program_plan, 48_codex_program_plan, adr_001_atom_architecture, adr_007_cross_stakeholder_atom_access, adr_008_engine_factor_out]
owner: nick
---

# Engine evolution plan and atom registry expansion

> **Purpose.** Specifies the work on the shared engine (Hauska Engine,
> currently in `legacy-design-tools` `api-server`) that both
> [`42_design_accelerator_program_plan.md`](42_design_accelerator_program_plan.md)
> and [`48_codex_program_plan.md`](48_codex_program_plan.md) depend on.
> Engine work is shared because the architecture per
> [`40_design_accelerator.md`](40_design_accelerator.md) commits to one
> engine codebase serving both surfaces. This doc keeps that work in
> one place; program plans reference it rather than re-specifying it.

## Current state

Engine code lives in the `legacy-design-tools` repository (local: `P:\legacy-design-tools`; remote: `empressaioemail-tech/legacy-design-tools`) under `artifacts/api-server/src/`. Consumed by:

- `legacy-design-tools` `artifacts/design-tools` — DA architect-side UI, incremental mode (<5s)
- `legacy-design-tools` `artifacts/plan-review` — DA architect-side window into Codex output, incremental mode
- `smartcity-os` AI Plan Review surface — Codex 1b reviewer-side, full-pass mode (30–120s). Lands when CDX-1b ships.

The repo name `legacy-design-tools` stays through ADR-008 factor-out; Codex and Cortex are product brands, not the repo name. Factor-out targets a new repo `hauska-engine` in the `empressaioemail-tech` org.

Atom registry at `artifacts/api-server/src/atoms/registry.ts` — 19 domain atoms as of 2026-05-05:

> sheet, engagement, snapshot, submission, intent, briefing-source, parcel-briefing, neighboring-context, materializable-element, briefing-divergence, bim-model, reviewer-annotation, reviewer-request, viewpoint-render, render-output, finding, communication-event, decision-event, submission-classification

Code corpus (legal corpus, distinct from domain atoms) — 479 atoms across four sources as of 2026-05-05:

> Grand County Land Use (215), Bastrop Muni Code (189), Grand County IWUIC (61), Grand County IRC R301.2.1 (14)

Production count needs verification against deployment Neon — see [`10_ground_truth.md`](10_ground_truth.md) Open questions.

Engine factor-out to `hauska-engine` repo is **gated on migration sprint Phase 2C closure** per [ADR-008](80_adrs/adr_008_engine_factor_out.md). Until then, engine work happens in place. Pre-factor-out module discipline matters: how the code is organized now sets up how cleanly factor-out goes later.

## Atom registry expansion

New atoms required for the next product wave (Codex Wave 1 + DA pilot expansion). Driven by customer-zero feedback in [`40a_customer_zero_observations_arena_roja_2026_05_06.md`](40a_customer_zero_observations_arena_roja_2026_05_06.md) and the Codex feature roadmap in [`47_codex_plan_review.md`](47_codex_plan_review.md).

Each atom below specifies: name, purpose, producer/consumer surface(s), key fields, outstanding open questions. Detailed schemas live in code; this is the contract-level spec that drives the contract version bump.

### Codex-side new atoms

#### `firm-tenant`
- **Purpose.** Tenant record for contractor firms in Codex 1a invited mode. Holds firm identity, COI metadata, subscription state, host tool credentials.
- **Producer.** Codex provisioning surface (TBD).
- **Consumer.** Codex 1a + 1b (scope checks per ADR-007).
- **Key fields.** `firmId`, `firmName`, `hostToolBindings[]` (Bluebeam/Acrobat/ProjectDox account refs), `coiPolicies[]`, `subscriptionTier`.
- **Gate.** ADR-009 firm tenancy schema (queued; deferred until 1a returns to active scope).

#### `firm-precedent`
- **Purpose.** Cross-engagement learning aggregation scoped to a firm. The most defensible moat feature per `47_codex_plan_review.md`.
- **Producer.** Codex engine (background aggregation pass).
- **Consumer.** Codex engine (retrieval at review time), Codex web companion (precedent queries).
- **Key fields.** `firmId`, `codeSection`, `precedentSummary`, `sourceFindingIds[]`, `confidence`.
- **Open.** Aggregation cadence (real-time vs nightly batch).

#### `per-reviewer-learning`
- **Purpose.** Individual reviewer adjudication patterns; informs adaptive UI tier per CDX-12.
- **Producer.** Codex engine (per adjudication event).
- **Consumer.** Codex adaptive UI surface.
- **Key fields.** `reviewerId`, `verbosityPreference`, `confidenceThreshold`, `adjudicationPatterns[]`.

#### `audit-trail-anchor`
- **Purpose.** Cryptographic anchor for a property's lineage chain per [ADR-001](80_adrs/adr_001_atom_architecture.md). Powers CDX-15.
- **Producer.** Hauska SDK `EventAnchoringService`.
- **Consumer.** Codex audit export, third-party verification.
- **Key fields.** `propertyId`, `chainHashTip`, `anchorTimestamp`, `anchoringSubstrate` (Polygon CDK / TSA / Hauska cluster — settled in deferred ADR-006).
- **Gate.** Hauska SDK gap closure (33 migration → SDK work).

#### `code-change-broadcast-event`
- **Purpose.** Jurisdiction-wide notification on code adoption; powers CDX-17.
- **Producer.** Codex jurisdiction admin surface.
- **Consumer.** All atoms with matching jurisdiction scope (for version-drift detection).

#### `version-drift-snapshot-diff`
- **Purpose.** Diff between code edition snapshots for an in-flight submission; powers CDX-14.
- **Producer.** Codex engine on jurisdiction code-edition change.
- **Consumer.** Codex web companion (drift alerts).

#### `jurisdictional-precedent`
- **Purpose.** City-to-city learning aggregation per [`06_cities_value_narrative.md`](06_cities_value_narrative.md). Federated, privacy-preserving.
- **Producer.** Codex engine (cross-jurisdiction aggregation pass).
- **Consumer.** Codex web companion (cross-jurisdictional queries via CDX-13 conversational primitive).
- **Open.** Privacy model (property-level anonymization, pattern-level queryability).

### DA-side new atoms (customer-zero driven)

#### `sheet-content-extraction`
- **Purpose.** Extracted graphic content and annotation text from sheet PDFs (L2 fix). Goes beyond existing `sheet` atom (metadata only) and `reviewer-annotation` atom (reviewer's markup only).
- **Producer.** DA sheet ingest pipeline (PDF parse + OCR + annotation extraction).
- **Consumer.** DA `plan-review` artifact (compare-against-comments workflow), Codex (when reviewer-side sees architect's sheet content).
- **Key fields.** `sheetId`, `extractedText`, `annotations[]`, `dimensionCallouts[]`, `revisionClouds[]`, `attachedDocRefs[]`.

#### `attached-document`
- **Purpose.** Supporting docs attached to a submission (ICC-ES reports, Rescheck, structural calcs). Today these are inert PDFs; this atom makes them queryable.
- **Producer.** DA submission ingest.
- **Consumer.** DA `plan-review` (cross-reference findings against supporting docs), Codex (same).
- **Key fields.** `documentType`, `extractedText`, `referencedStandards[]`, `submissionId`.

#### `detail-callout-spec`
- **Purpose.** Structured detail specification (layer-by-layer precision, dimension callouts, scale) generable as Revit content (L4 fix).
- **Producer.** DA `design-tools` artifact (engine generates detail spec).
- **Consumer.** Revit add-in (push to Revit via APS Design Automation API).
- **Open.** Detail library backing — pull from manufacturer/AWI/WDMA/NFRC libraries or generate from scratch?

#### `product-spec-reference`
- **Purpose.** Product spec with live ICC-ES Report verification (L5 fix). E.g., Tremco TREMproof 6100 XT with current ESR status.
- **Producer.** DA engine (product recommendation) + ICC-ES integration (verification).
- **Consumer.** DA `design-tools`, DA `plan-review`.
- **Key fields.** `productName`, `manufacturer`, `esrNumber`, `esrStatus`, `esrExpirationDate`, `lastVerified`.
- **Open.** ICC-ES integration mechanism (API vs scrape vs manual refresh).

#### `deliverable-letter`
- **Purpose.** Multi-section deliverable (comment response letter, plan review letter) with structured sections and recipient metadata (L6 fix). Decouples document assembly from token limits.
- **Producer.** DA `design-tools` (architect-side) or Codex (reviewer-side).
- **Consumer.** DA render pipeline (DOCX/PDF generation).
- **Key fields.** `sections[]`, `recipient`, `jobReference`, `attachmentRefs[]`.

#### `response-task`
- **Purpose.** Interactive persistable task state (L1 fix). Today checklists are markdown-only; this atom makes the workflow queryable and addressable.
- **Producer.** DA `design-tools` (architect interaction).
- **Consumer.** DA `design-tools` (workflow UI).
- **Key fields.** `taskText`, `status` (`open|in_progress|done`), `parentEngagementId`, `linkedFindingIds[]`.

### Contract version bump

Adding the above atoms to the registry triggers an `@empressaio/atom` contract version bump. Per [`26_atom_upgrade_guide.md`](26_atom_upgrade_guide.md), this requires coordinated rollout across:

- `legacy-design-tools` api-server (engine + atom validation)
- `smartcity-os` api-server (consumer, when CDX-1b lands)
- `legacy-revit-sensor` (Revit add-in — consumer of `detail-callout-spec`)
- Hauska SDK packages (consumer of `audit-trail-anchor` via `EventAnchoringService`)

**Version bump strategy.** Introduce all new atoms in a single minor version bump (e.g., 1.4 → 1.5) rather than spreading across multiple. Coordination cost is per-bump; one bump for the batch is cheaper than several. Atom additions are non-breaking; existing consumers ignore unknown atoms per the contract's forward-compatibility rules.

## Engine work streams

Seven streams. Some parallel-eligible; some gated.

### A. Module boundary refactor (pre-factor-out)

Reorganize `artifacts/api-server/src/` into clear modules so ADR-008 factor-out is `git mv` rather than recursive untangle:

- `engine/` — compliance pass, briefing generation, context retrieval, AI gateway
- `corpus/` — code atom ingestion, parcel intelligence; placeholders for firm precedent + per-reviewer-learning
- `adapters/` — host tool adapters; placeholder ahead of Bluebeam ToS clearance
- `audit/` — audit trail; placeholder ahead of SDK closure
- `atoms/` — atom registry (existing location moves here)

**Eligibility: starts now. Owner: 1 agent. Effort: M (1–2 sprints).**

### B. Atom registry implementation (pre-factor-out)

Implement the atoms specified above in `artifacts/api-server/src/atoms/registry.ts` and downstream consumers. Includes contract version bump coordination.

**Eligibility: starts now. Owner: 1 agent. Effort: L (multi-sprint due to coordination cost).**

### C. Engine output quality (ongoing)

Improvements to the compliance pass and briefing engine. Driven by QA findings from both surfaces. Customer-zero feedback in `40a_customer_zero_observations_arena_roja_2026_05_06.md` is the seed input (L2 sheet content rendering improves engine context; L5 product-spec verification improves recommendation accuracy).

**Eligibility: starts now, continues indefinitely. Owner: 1 agent at a time, scoped per QA cycle.**

### D. Corpus depth (ongoing)

Code atom corpus expansion and tuning. Near-term needs:

- Grand County IRC residential code (currently only R301.2.1 = 14 atoms; full IRC ingestion pending)
- Bastrop UDC tuning (189 atoms today; depth check needed against real Bastrop submittals)
- Florida Building Code for Miami Beach (Alexander 404 project) — currently zero atoms

Customer-zero feedback references 2021 IBC/IRC/IPC/IMC/IFGC/IECC/IFC + 2023 NEC — that's the actual corpus depth needed for Moab projects.

**Eligibility: starts now per jurisdiction. Owner: 1 agent at a time within a jurisdiction (corpus tuning isn't easily parallelized inside a single code).**

### E. SDK gap closure (gates CDX-15)

Hauska SDK gaps that block `audit-trail-anchor` atom production. Specific gaps live in `33_hauska_sdk_roadmap.md` (queued for migration).

**Eligibility: blocked on 33 migration. Owner: TBD (likely 1 agent on SDK side after migration).**

### F. Performance work (gated on baseline)

Engine performance at firm-tenant scale (per `47_codex_plan_review.md` outstanding verifications). No work until baseline is established at pilot scale.

**Eligibility: deferred until pilot data exists. Owner: TBD.**

### G. Brand migration (Plan Review → Codex; Design Accelerator → Cortex)

Cross-cutting code rename in `legacy-design-tools`. Brand-only change; no functional impact. Codex and Cortex appear zero times in the repo today. Existing references:

- **"Plan Review"** appears in: file paths (`artifacts/plan-review/`, `lib/plan-review-pdf/`), package names (`@workspace/plan-review-pdf`), UI copy (`brandProductName="Plan Review"` on every reviewer-side page), route URL (`/plan-review/`), code identifiers (route handlers, test descriptions), system prompts (`FINDING_SYSTEM_PROMPT` literal "AI plan reviewer"), docs (`AGENTS.md`, `DESIGN.md`, `replit.md`, `docs/wave-*` reports). 2 open PRs (#17, #19), ~10 active branches.
- **"Design Accelerator"** appears once: `AGENTS.md:11`. Smaller migration.

New code and UI use Codex / Cortex going forward; this stream migrates existing references.

**Sequencing.** UI copy first (most visible, lowest blast radius — string changes in `brandProductName` and similar), then internal identifiers (route paths, package names, file paths, code identifiers, system prompt literals). UI copy changes are isolated; package and file path renames are coordination-cost-heavy (consumers update).

**Gating.** Hold until open PR #17 lands to avoid merge conflicts on touched paths. Check PR #19 status before starting (also touches affected surfaces). Coordinate with active branches.

**Feature flag.** Not needed. Brand-only, no functional change. Visual diff on UI copy; structural diff on identifier rename. Standard PR review surfaces both.

**Additional in-scope items bundled here:**

- `AGENTS.md` correction: remove claim that `gh` CLI is unavailable (recon 2026-05-11 confirmed it works — gh 2.92.0, authenticated).
- `docs/wave-*` reports — historical artifacts; lighter touch (one-line note acknowledging rename, don't rewrite history).

**Out of scope for this stream.** Doc filename renames in doc_repo (e.g., `42_design_accelerator_program_plan.md` → `42_cortex_program_plan.md`) are a separate coordination step after canonical product home docs (`40_design_accelerator.md`, `47_codex_plan_review.md`) migrate naming. This stream is `legacy-design-tools` rename only.

**Eligibility: starts after PR #17 lands. Owner: 1 agent. Effort: M.**

## Phasing

```
NOW (pre-factor-out, in legacy-design-tools):
  Stream A — Module boundary refactor      [parallel]
  Stream B — Atom registry implementation  [parallel]
  Stream C — Engine output quality         [parallel]
  Stream D — Corpus depth                  [parallel, 1 at a time within a jurisdiction]
  Stream G — Brand migration               [parallel, gated on PR #17 landing]

GATED on 33 migration:
  Stream E — SDK gap closure

GATED on Phase 2C closure (ADR-008 trigger):
  Engine factor-out sprint (separate doc, drafted when gate clears)

POST-FACTOR-OUT (in hauska-engine):
  All streams continue in new repo
  Stream F — Performance work (post-pilot)
```

## Gates and dependencies

- **Phase 2C closure** (migration sprint) → unblocks ADR-008 engine factor-out → unblocks stream consolidation in `hauska-engine` repo.
- **33 migration** → unlocks Stream E (SDK gap closure) → unblocks `audit-trail-anchor` atom production → unblocks CDX-15.
- **Atom contract version bump** → coordinated across legacy-design-tools + smartcity-os + legacy-revit-sensor + Hauska SDK. Cannot be done piecemeal.
- **Bluebeam ToS verification** → unblocks `adapters/` module having actual content (currently a placeholder for Stream A).
- **PR #17 landing** → unblocks Stream G start. Check PR #19 also.

## Verification criteria per stream

| Stream | Verification |
|---|---|
| A. Module boundary refactor | `artifacts/api-server/src/` directory listing matches target structure; existing tests pass; no engine code left in `src/` root |
| B. Atom registry implementation | New atoms appear in `registry.ts`; contract version bumped to next minor; all consumers updated; existing atom tests pass; new atoms have at least minimal schema tests |
| C. Engine output quality | QA scenarios in DA and Codex program plans pass with engine output Nick can evaluate (specific scenarios defined in each program plan) |
| D. Corpus depth | Corpus count per jurisdiction grows to defined target; retrieval tests pass for representative queries; production Neon corpus count verified |
| E. SDK gap closure | `audit-trail-anchor` atoms produced for test scenarios; CDX-15 audit export workflow ends with a verifiable artifact |
| F. Performance work | Engine pass under 5s incremental + under 120s full-pass at firm-tenant scale (target tied to pilot firm metrics) |
| G. Brand migration | Zero "Plan Review" string occurrences in UI copy (post UI-copy phase); zero "Plan Review" identifier occurrences in code (post identifier phase); `AGENTS.md:11` updated to "Cortex"; `gh` CLI availability note corrected; route URL serves at new path with redirect from `/plan-review/`; no functional regressions |

## Open decisions

- **ICC-ES integration mechanism** for `product-spec-reference` atom (Stream C / DA-side). API vs scrape vs manual refresh? Decision needed before Stream C touches L5 fix.
- **Firm-precedent aggregation cadence** for `firm-precedent` atom (Stream B / Codex-side). Real-time vs nightly batch?
- **Jurisdictional-precedent privacy model** for `jurisdictional-precedent` atom (Stream B / Codex-side). Property-level anonymization specifics — review by counsel before production aggregation runs.
- **Detail library backing** for `detail-callout-spec` atom (Stream B / DA-side). Pull from manufacturer/AWI/WDMA/NFRC libraries or generate from scratch?
- **Anchoring substrate** for `audit-trail-anchor` atom (Stream E / Codex-side). Polygon CDK vs public TSA vs Hauska cluster vs customer-controlled. Settled in deferred ADR-006.
- **Module boundary final shape** for Stream A. Sketch above is starting point; refactor may surface additional modules (e.g., `inference/` for AI gateway specifically) or merge some.
- **Brand migration sequencing within UI-copy phase** for Stream G. Which screens go first; whether a single all-screens PR or page-by-page. Sprint-level call.
- **Route URL strategy for Stream G.** `/plan-review/` → `/codex/` with redirect, or net-new `/codex/` with `/plan-review/` retained as alias? SEO and bookmark continuity vs clean cutover.

## References

- [`25_atom_architecture_reference.md`](25_atom_architecture_reference.md) — atom architecture reference (the existing 19 DA atoms documented in §5)
- [`26_atom_upgrade_guide.md`](26_atom_upgrade_guide.md) — atom contract version bump procedure
- [`80_adrs/adr_001_atom_architecture.md`](80_adrs/adr_001_atom_architecture.md) — atom contract
- [`80_adrs/adr_007_cross_stakeholder_atom_access.md`](80_adrs/adr_007_cross_stakeholder_atom_access.md) — access scopes that govern atom reads/writes
- [`80_adrs/adr_008_engine_factor_out.md`](80_adrs/adr_008_engine_factor_out.md) — engine factor-out timing
- [`40_design_accelerator.md`](40_design_accelerator.md) — DA product home (current engine consumer)
- [`47_codex_plan_review.md`](47_codex_plan_review.md) — Codex product home (engine consumer)
- [`42_design_accelerator_program_plan.md`](42_design_accelerator_program_plan.md) — DA program plan (consumes this doc)
- [`48_codex_program_plan.md`](48_codex_program_plan.md) — Codex program plan (consumes this doc)
- [`40a_customer_zero_observations_arena_roja_2026_05_06.md`](40a_customer_zero_observations_arena_roja_2026_05_06.md) — customer-zero feedback driving DA-side atom additions
- [`12_migration_sprint.md`](12_migration_sprint.md) — Phase 2C gate state

## Revision history

- **2026-05-11 (origin):** drafted during comprehensive planning session. Six streams (A–F) plus brand migration (Stream G, added in same-session audit pass). Establishes shared engine work stream + atom registry expansion. Gating dependencies and verification criteria. Companion to `42_design_accelerator_program_plan.md` and `48_codex_program_plan.md`.
