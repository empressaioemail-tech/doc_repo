---
id: 48_codex_program_plan
title: Codex program plan — current state through GA
status: active
last_updated: 2026-05-19 (combined Cortex/Codex sprint launched per _decisions/2026-05-19_sync_4_5_and_cortex_sprint.md; new Phase 2 stream CDX-MCP for existing-product Codex MCP tool exposure — finding-generation, override-write, briefing-fetch, snapshot-ingest)
applies_to: codex
related: [11_roadmap, 27_engine_evolution_plan, 28_mcp_first_product_design, 42_design_accelerator_program_plan, 47_codex_plan_review, 50_hauska_mcp_server, 51_substrate_v1_sprint, 05_living_lineage_thesis, 06_cities_value_narrative, 30_smartcity_os, 40_design_accelerator, _decisions/2026-05-19_sync_4_5_and_cortex_sprint, adr_001_atom_architecture, adr_007_cross_stakeholder_atom_access, adr_008_engine_factor_out]
owner: nick
---

# Codex program plan

> **Purpose.** Phased roadmap from current state through 1b
> QA-readiness, Bastrop activation, 1a invited mode (deferred),
> contractor firm pilot, and GA. Replaces ad-hoc planning by
> capturing phases, parallel streams, gates, and verification
> criteria in one durable doc. Companion to
> [`42_design_accelerator_program_plan.md`](42_design_accelerator_program_plan.md)
> (architect side, same shape). Shared engine work lives in
> [`27_engine_evolution_plan.md`](27_engine_evolution_plan.md);
> this doc references it.

> **Scope expansion (2026-05-16).** Per the 2026-05-16 operator decision, Codex is the product brand covering plan review (this program plan's scope) AND code intelligence (the human/agent code-lookup surface on the Hauska MCP Server). The code intelligence surface is on a separate execution track — primary implementation in [`51_substrate_v1_sprint.md`](51_substrate_v1_sprint.md) via the Hauska MCP Server tools, with the human web tool surface as the wrapper. This program plan continues to cover Codex 1a/1b plan review phases only. Cross-reference [`47_codex_plan_review.md`](47_codex_plan_review.md) for the three-surface product home and [`28_mcp_first_product_design.md`](28_mcp_first_product_design.md) for the MCP-first product line architecture.

> **Scope decision (2026-05-11). Codex 1b first.** 1a invited mode
> (Bluebeam/Acrobat/ProjectDox adapter) is deferred to Phase 5;
> revisit when Bluebeam ToS verification clears and firm tenancy
> ADR (ADR-009) is drafted. 1b can QA today using the same
> legacy-design-tools engine; 1a requires net-new adapter code
> that's gated. This sequencing differs from `47_codex_plan_review.md`'s
> commercial-wedge-first wave ordering — both vocabularies remain
> valid (hybrid option-b per 2026-05-10 Codex launch session); this
> program plan's phasing maps to the QA-first reality of where we
> can actually move today.

## Current state

Codex is pre-launch. Strategic positioning, surface architecture, atom set, customer pathways, and feature roadmap are in [`47_codex_plan_review.md`](47_codex_plan_review.md). This program plan reads it as input and does not duplicate.

**Anchors as of 2026-05-11:**

- Engine: shared with DA per ADR-008. Lives in `legacy-design-tools` (local: `P:\legacy-design-tools`; remote: `empressaioemail-tech/legacy-design-tools`) under `artifacts/api-server/src/`. Same code that powers DA's incremental compliance pass runs Codex's full-pass mode (30–120s) on the same atoms.
- Reviewer-side surface today: `legacy-design-tools` `artifacts/plan-review` is an *architect-side window* showing what the reviewer will see — not the actual reviewer-side surface. Codex 1b's reviewer-side surface is unbuilt; it ships into `smartcity-os` Plan Review surface for production deployment per `47_*`. For QA-readiness, a reviewer-side surface lives in `legacy-design-tools` (location settled in Phase 1).
- Brand state: "Codex" appears zero times in `legacy-design-tools` repo today. UI copy and code identifiers reference "Plan Review." Brand migration is scoped as Stream G in `27_engine_evolution_plan.md`.
- Atom registry: shared with DA. Codex-side atoms expansion specified in `27_engine_evolution_plan.md` (`firm-tenant` deferred to 1a; other Codex atoms in scope for 1b).
- Customer-zero candidate: Empressa-doing-self-review on Moab projects (Musgrave, Seguin, Arena Roja R1). Eats whole dog food across DA → Codex on same projects. Decision settled in Phase 2.
- Wave structure per `47_*`: Wave 1 (1a invited) — deferred. Wave 2 (1b city-side) — drives Phase 1–4 here. Waves 3–5 — pulled into Phases 2/3/7 by feature relevance.
- Reviewer-zero candidates: Empressa (internally, Phase 2), Sylvia Carrillo / Jaime Saldivar (Bastrop, Phase 4).

**Cross-track dependencies — read this carefully.**

Codex production deployment for 1b ultimately ships into `smartcity-os` Plan Review surface (M4-B → Codex 1b per the SmartCity OS planner's track and the canonical naming established 2026-05-10). The parallel SmartCity OS planner manages all `smartcity-os` work. **Smartcity-os has zero Codex references today.** The SmartCity OS planner is selecting how to slot the Codex 1b receiving surface in their parallel planning session — likely a new doc in the `30*` band (e.g., `30a_*` or `33_*`), or an extension of `30_smartcity_os.md`, or deferred pending stabilization sprint closeout. Phase 4 in this plan references whatever they land OR is preceded by a post-stabilization coordination session.

This program plan's Phases 1–3 happen entirely in `legacy-design-tools` (engine + QA surface). Phase 4 Bastrop activation requires coordination with the SmartCity OS planner to ship the reviewer surface in `smartcity-os`. No agents on `smartcity-os` from this track without coordination.

**Outstanding verifications from `47_*` (carried forward):**

- Bluebeam Studio Project participant flow (gates 1a — Phase 5)
- Bluebeam markup writeback as participant (gates 1a — Phase 5)
- Acrobat Shared Reviews FDF roundtrip (gates 1a alternative path — Phase 5+)
- ProjectDox / Avolve API access path (gates 1a alternative path — Phase 5+)
- Bluebeam Max teardown when GA — Phase 5/6 input
- Tyler Technologies plan-review AI capability scan — competitive intel, Phase 5/6 input
- Sylvia interview on skill-level pain points (drives CDX-12 trainee tier) — Phase 3 input
- Reviewer day-in-life observation at one pilot firm — Phase 5/6 input
- Director QBR conversation at one pilot firm — Phase 6 input
- Hauska SDK gap closure timeline (gates CDX-15 audit trail) — Phase 3 gate
- Multi-surface coherence test design — Phase 1 prereq
- Atom graph performance at firm-tenant scale — Phase 6 input

## QA readiness milestone

> **Definition.** Nick can run a real reviewer pass on a real submittal end-to-end through Codex 1b and structurally evaluate every output. "Structurally evaluate" means findings, adjudications, and the comment letter are classified atoms Nick can compare against ground truth — not free-form chat output.

Concretely, at Codex 1b QA-readiness Nick can:

1. **Load a real submittal** — same Moab projects as DA (Musgrave, Seguin, Arena Roja R1). Empressa-doing-self-review pattern: DA outputs become Codex inputs on same projects.
2. **Run engine in full-pass reviewer mode** (30–120s) and see findings.
3. **See findings in the reviewer-side QA surface** (legacy-design-tools location settled in Phase 1) with code citations, severity, plan location.
4. **Adjudicate findings** (accept / edit / reject) and have adjudication state persist as atoms.
5. **Verify each finding cites a real code section** in the Grand County IRC / Bastrop UDC corpus and the citation is accurate.
6. **Switch jurisdictions** (Grand County for Moab projects, Bastrop UDC for Bastrop test data) and see findings change accordingly.
7. **Generate a comment letter** as DOCX/PDF deliverable with all findings + adjudications structured (reuses `deliverable-letter` atom from DA work).
8. **Find bugs structurally.** Every finding is an atom; Nick can point at a specific atom and say "this is wrong because X."

**What 1b QA-readiness does NOT require:**

- 1a invited mode (Bluebeam adapter, markup format adapters) — Phase 5.
- CDX-7 Firm precedent layer — depends on `firm-tenant` atom (deferred to 1a) — Phase 5+.
- CDX-12 Adaptive UI tier — Phase 3 stretch.
- CDX-13 Conversational primitive — Phase 3 stretch.
- CDX-15 Cryptographic audit trail — Phase 3, gated on SDK closure.
- CDX-Jurisdictional cross-jurisdictional precedent — Phase 7 (fabric play).
- Bastrop production activation — Phase 4.
- Contractor firm pilot — Phase 5+.

## Phases

### Phase 1 — Foundation (NOW)

Engine work, atom expansion, and reviewer-side QA surface decision. Parallel-eligible streams.

| Stream | Scope | Source | Effort |
|---|---|---|---|
| **27-A.** Module boundary refactor in `api-server` | Per `27_engine_evolution_plan.md` Stream A — shared with DA | Engine plan | M |
| **27-B.** Atom registry implementation (Codex-side atoms for 1b) | Per `27_*` Stream B; prioritize `audit-trail-anchor` (gated), `code-change-broadcast-event`, `version-drift-snapshot-diff`, `per-reviewer-learning`, `jurisdictional-precedent` (privacy-deferred); `firm-tenant` and `firm-precedent` deferred to Phase 5 with 1a | Engine plan | L |
| **27-C.** Engine output quality — Codex full-pass mode | Per `27_*` Stream C; scenarios drawn from active test projects in reviewer context | Engine plan | M (ongoing) |
| **27-D.** Corpus depth — Bastrop UDC + Grand County IRC | Per `27_*` Stream D; Bastrop UDC tuning ahead of Phase 4 activation; Grand County IRC full ingestion shared with DA | Engine plan | M |
| **27-G.** Brand migration (Plan Review → Codex side) | Per `27_*` Stream G; the larger half of the rename (file paths, packages, UI copy, routes, code identifiers, system prompts, docs). Coordinated with Design Accelerator → Cortex (DA side) in same stream. Gated on PR #17 landing. | Engine plan | (included in M-effort Stream G) |
| **CDX-Phase1-1.** Reviewer-side QA surface location decision | Decide where Codex 1b reviewer-side surface lives in `legacy-design-tools` for QA: extend `plan-review` artifact with reviewer-mode, new artifact (`codex-1b-qa`?), or extend `qa` artifact. Sprint-level design call. | This plan | S |
| **CDX-Phase1-2.** Multi-surface coherence test design | Test design ensuring DA-side and Codex-side engine outputs are coherent on the same project. Listed as verification in `47_*`. | This plan | S |

**Phase 1 gates.** Streams 27-A through 27-D and 27-G follow gates in `27_engine_evolution_plan.md` (27-G gated on PR #17 landing). CDX-Phase1-1 needs the QA surface design call before Phase 2 UI streams start.

**Phase 1 exit criteria:**

- Codex-side 1b-relevant atoms in registry per `27_*`; contract version bumped (single minor bump shared with DA atoms).
- Module boundary refactor verified per `27_*` Stream A.
- Reviewer-side QA surface location settled and scaffold built.
- Engine full-pass mode produces output evaluable enough for Phase 2 work to start (specific bar TBD with CDX-Phase1-2 test design).
- Bastrop UDC corpus tuning to depth-check threshold.

### Phase 2 — Codex 1b QA enablement

Phase 2 builds the reviewer-side surface for 1b QA and closes the gaps that turn "engine produces output" into "Nick can structurally QA the reviewer experience."

| Stream | Scope | Source |
|---|---|---|
| **CDX-3.** One-click AI review pass | Engine full-pass trigger from reviewer-side QA surface; output renders as findings in UI. Maps to `47_*` Wave 1 CDX-3 (reusable across 1a/1b). | `47_*` |
| **CDX-4.** Finding accept/edit/reject loop | Adjudication UI: per-finding accept/edit/reject; adjudication state persists as atoms; reviewer can edit finding text before accepting. | `47_*` |
| **CDX-5.** Jurisdiction switcher | Runtime jurisdiction selection (Grand County / Bastrop UDC / others as corpus exists); findings update on switch. | `47_*` |
| **CDX-9.** Comment-letter auto-draft | Generate comment letter as `deliverable-letter` atom + DOCX/PDF render. Reuses DA-side pipeline established in `42_*` DA-5 (shared deliverable-letter implementation). | `47_*` Wave 4 |
| **CDX-EngineHook-prep.** Engine integration surface | Define engine API contract that smartcity-os Plan Review surface will consume in Phase 4. Build it in legacy-design-tools first; smartcity-os planner consumes when activating. | `47_*` Wave 2 |
| **CDX-QA-1.** Codex 1b QA scenarios documentation | Write the QA scenario set: which projects, which jurisdictions, expected atom outputs at each step, what "wrong" looks like for each. Mirrors DA-8. Durable QA spec; future regression tests run against it. | This plan |
| **CDX-Customer-Zero.** Empressa-as-reviewer-zero rollout | Set up Empressa team to QA Codex 1b on their own DA outputs. Eat whole dog food across DA → Codex on Moab projects. | This plan |
| **CDX-MCP.** Codex MCP tool surface (existing-product retrofit) | Per [`_decisions/2026-05-19_sync_4_5_and_cortex_sprint.md`](_decisions/2026-05-19_sync_4_5_and_cortex_sprint.md) and [`_dispatches/2026-05-19_cc-agent-M_mcp_tool_surfaces.md`](_dispatches/2026-05-19_cc-agent-M_mcp_tool_surfaces.md). Four tools wrapping existing Codex 1b capabilities under the `codex/*` namespace in `hauska-mcp-server`: `finding_generation` (engine full-pass trigger), `override_write` (adjudication-state writes), `briefing_fetch` (briefing atom retrieval), `snapshot_ingest` (submission ingest). All Layer 2 paid; auth required. Stronger than the `28_mcp_first_product_design.md` minimum policy (which queues Codex MCP retrofit post-launch); this sprint runs it concurrent with QA-readiness work because the operator's next QA cycle is expected to flow through MCP-driven agent workflows. Repo: `hauska-mcp-server` (cc-agent-M, Lane B). | Sprint decision; this plan |

**Phase 2 gates:**

- CDX-3, CDX-4, CDX-5 depend on Phase 1 reviewer-side surface scaffold.
- CDX-9 depends on DA Phase 2 DA-5 (`deliverable-letter` atom landed and DOCX/PDF pipeline working).
- CDX-EngineHook-prep depends on 27-A module boundary refactor.
- CDX-QA-1 can start as soon as CDX-3 / CDX-4 / CDX-5 produce evaluable output.
- CDX-Customer-Zero depends on DA Phase 2 producing usable DA outputs for Moab projects.

**Phase 2 exit criteria — this IS the Codex 1b QA-readiness milestone:**

- Nick can run a Moab project through Codex 1b end-to-end per the 8-point definition above.
- All Codex 1b QA scenarios in CDX-QA-1 are executable.
- Empressa team using Codex 1b to QA their own DA outputs (customer-zero loop closed).
- Engine API contract defined for Phase 4 smartcity-os consumption.
- Bugs found are pointable-at-atoms.

### Phase 3 — Codex 1b stretch (raise bar pre-pilot)

Above QA-readiness; below Bastrop activation. Raises engine fidelity and adds the depth features that distinguish Codex from "AI does plan review."

| Stream | Scope | Source |
|---|---|---|
| **CDX-6.** Parcel intelligence pull | Reviewer-side parcel intelligence (city-manager view of property intelligence — Sylvia's hydrology query). Slice of DA parcel briefing engine, scoped at jurisdiction level. Inherits from `46_smartcity_parcel_intelligence.md` (queued migration). | `47_*` Wave 3 |
| **CDX-8.** Per-reviewer learning | Implement `per-reviewer-learning` atom production + consumption. Reviewer adjudication patterns inform finding presentation and UI tier. | `47_*` Wave 3 |
| **CDX-11.** Throughput dashboard | UI on top of finding atoms aggregated per reviewer / per firm / per jurisdiction. | `47_*` Wave 4 |
| **CDX-12.** Adaptive UI tier | Role-aware UI verbosity (trainee 5 → senior plans engineer 1). Driven by Sylvia interview on skill-level pain points (verification outstanding). | `47_*` Wave 4 |
| **CDX-13.** Conversational primitive | Conversational assistant grounded in corpus + jurisdiction + property history. "Explain this code section like I'm new" / "How would Sara have handled this?" / "How would Bastrop handle this?" | `47_*` Wave 4 |
| **CDX-14.** Version drift detector | Implement `version-drift-snapshot-diff` atom production. Detect when code edition changes mid-submission. | `47_*` Wave 4 |
| **CDX-15.** Cryptographic audit trail | `audit-trail-anchor` atom production. Powers audit export workflow. **Gated on Hauska SDK closure (`33_hauska_sdk_roadmap.md` migration + Stream E in `27_*`).** | `47_*` Wave 3 |

**Phase 3 gates:**

- CDX-6 gated on `46_smartcity_parcel_intelligence.md` migration.
- CDX-8 depends on `per-reviewer-learning` atom landing (Phase 1 / 27-B).
- CDX-12 depends on Sylvia interview completion.
- CDX-13 is the most expensive feature; ship on stable foundation per `47_*` strategic frame.
- CDX-15 gated on SDK closure (Stream E in `27_*`).

**Phase 3 exit criteria:**

- Reviewer-side surface includes adaptive UI, conversational primitive, version drift alerts, and (if SDK closed) audit export.
- Per-reviewer learning operates against real adjudication patterns.
- Throughput dashboard renders meaningful aggregates.
- Audit trail produces a verifiable artifact for one test scenario (gated on SDK).

### Phase 4 — Codex 1b Bastrop activation

Codex 1b ships into `smartcity-os` Plan Review surface for Bastrop. **Cross-track coordination required.** Bastrop is the first city-side production deployment of Codex.

> **Cross-track coordination note (added 2026-05-11 audit pass).** Smartcity-os has zero Codex references today. The SmartCity OS planner is selecting how to slot the Codex 1b receiving surface in their parallel planning session (new doc in `30*` band, extension of `30_smartcity_os.md`, or deferred pending stabilization sprint closeout). Phase 4 entry is gated on either (a) the smartcity track landing their slot decision and exposing it as a target for cross-track coordination, OR (b) a dedicated post-stabilization coordination session that aligns both tracks' next-phase scopes. The engine API contract (Phase 2 CDX-EngineHook-prep) is this track's deliverable; the receiving surface integration spec is the smartcity track's deliverable.

| Stream | Scope |
|---|---|
| **CDX-1b-prod.** Standalone web app in smartcity-os | Coordinate with SmartCity OS planner to ship CDX-1b in `smartcity-os` Plan Review surface. Engine API contract from Phase 2 CDX-EngineHook-prep is consumed here. |
| **CDX-Annotation.** PDF viewer + annotation layer | In-browser PDF.js + custom annotation layer in smartcity-os. Coordination with SmartCity OS planner. |
| **CDX-EngineHook.** Engine integration | Smartcity-os calls engine API contract defined Phase 2. Coordination with SmartCity OS planner. |
| **CDX-DashboardFlow.** Findings → dashboard atom flow | Findings flow into SmartCity OS operational dashboards per `06_cities_value_narrative.md`. Coordination with SmartCity OS planner. |
| **CDX-Reviewer-Zero-Bastrop.** Sylvia / Jaime onboarding | Bastrop reviewer-zero(s) running real submittals through Codex 1b in production. Friction log feeds Phase 4.5 hotfixes. |

**Phase 4 gates:**

- All Phase 2 work landed and QA-verified.
- SmartCity OS planner's slot decision landed (or coordination session completed) — see cross-track coordination note above.
- SmartCity OS planner's receiving-surface stream (M4-B / Codex 1b in their vocabulary) ready to receive engine integration.
- Bastrop willing to be reviewer-zero (Sylvia / Jaime engaged).

**Phase 4 exit criteria:**

- Codex 1b live in Bastrop's production SmartCity OS Plan Review surface.
- Sylvia / Jaime using Codex 1b on real Bastrop submittals.
- Findings flowing into SmartCity OS operational dashboards.

### Phase 5 — Codex 1a invited mode (revisit — deferred)

> **Revisit when:** Bluebeam ToS verification clears AND firm tenancy ADR (ADR-009) drafted AND Phase 4 stable.

Phase 5 reopens 1a invited mode. Per `47_*`, 1a is the commercial wedge (contractor firms working in Bluebeam) and the faster revenue path; sequencing here puts 1b first because QA can happen sooner, not because 1a is less important.

| Stream | Scope | Gate |
|---|---|---|
| **CDX-Bluebeam-ToS.** ToS interpretation + commercial outreach | Legal review of Bluebeam Studio Projects ToS for service-account use; commercial outreach to Bluebeam if needed. | Phase 5 entry |
| **ADR-009.** Firm tenancy schema | Drafted as new ADR extending ADR-005 + ADR-007. Settles firm-tenant model, COI controls, per-engagement metadata. | Phase 5 entry |
| **CDX-1a.** Bluebeam invited-participant adapter | Codex authenticates as Bluebeam user, joins Studio Projects as participant, writes findings back as native markups. | ToS + ADR-009 |
| **CDX-2.** Markup format adapters | Bluebeam Studio markups first; Acrobat FDF and ProjectDox follow. | CDX-1a |
| **CDX-7.** Firm precedent layer | `firm-precedent` atom production + retrieval. Most defensible moat feature per `47_*`. | `firm-tenant` atom (Phase 5 atom expansion) |
| **CDX-10.** Firm tenancy + role model | Multi-role per firm; per-engagement COI scoping. | ADR-009 |
| **CDX-Acrobat-FDF.** Acrobat Shared Reviews FDF roundtrip | Alternative host tool path. | Verification outstanding |
| **CDX-ProjectDox.** ProjectDox / Avolve API access | Alternative host tool path. | Access path verification |

**Phase 5 exit criteria:**

- 1a invited mode operational against at least Bluebeam Studio Projects.
- Firm-tenant atoms producing per real firm engagement.
- Firm precedent layer producing aggregations on test firm.

### Phase 6 — Contractor firm pilot

| Stream | Scope |
|---|---|
| **CDX-Pilot-Selection.** Pilot firm selection | TX or UT firms first (Bastrop UDC and Grand County code atoms already loaded). Source via Sylvia's TCMA/ICMA network or direct ICC outreach. Selection criteria from `47_*`. |
| **CDX-Pilot-Onboarding.** 2–3 firms onboard | Pilot firms invited as Codex 1a participants in their Bluebeam Studio Projects. Free pilots. |
| **CDX-COI-Operational.** COI controls operational | Per-engagement metadata + contractual policy live for pilot firms reviewing for City A while consulting for developer B. |
| **CDX-Comment-Letter-Training.** Comment-letter training data legal handling | Data agreement for ingesting firm historical comment letters. Open Codex GA decision in `47_*`. |
| **CDX-Pricing-Pilot.** Pricing held private | Per `47_*`, $300/seat/month default for 1a; pilots free; hold publication until two paid conversions close. |

**Phase 6 exit criteria:**

- 2–3 pilot firms using Codex 1a on real engagements.
- COI controls verified on at least one cross-engagement scenario.
- Two pilot firms converted to paying customers (triggers pricing publication).

### Phase 7 — GA

| Stream | Scope |
|---|---|
| **CDX-Brand-Publication.** Brand publication | Public Codex brand surface; "powered by Hauska Engine" pattern per ADR-008. |
| **CDX-Pricing-Publication.** Pricing publication | Public pricing live. |
| **CDX-Bluebeam-Max-Positioning.** Competitive positioning | Vertical-depth play (jurisdiction-keyed corpus + role-aware UI + multi-surface architecture) vs Max's horizontal AEC AI. Document positioning. |
| **CDX-Fabric-Wave5.** Wave 5 fabric play features | CDX-17 code-change broadcast, CDX-16 cross-jurisdictional code comparison, CDX-Jurisdictional cross-jurisdictional precedent, CDX-18 voice annotation, CDX-19 three-way collaborative session. Selectively shipped based on customer demand. |

## Gates and dependencies

- **Phase 1 → Phase 2.** Atom registry expansion (1b-relevant atoms) complete (27-B); module boundary refactor done (27-A); reviewer-side QA surface scaffold built.
- **Phase 2 → Phase 3.** QA scenarios in CDX-QA-1 passing on Moab projects; Empressa-reviewer-zero loop closed.
- **Phase 3 → Phase 4.** Stretch features verified to QA bar; engine API contract stable for smartcity-os consumption; smartcity-os slot decision landed or coordination session completed.
- **Phase 4 → Phase 5.** Bastrop production stable; reviewer-zero feedback triaged; SmartCity OS planner's M4-B work stable.
- **Phase 5 → Phase 6.** 1a operational against Bluebeam Studio Projects; firm-tenant model proven.
- **Phase 6 → Phase 7.** 2 pilot firms converted to paid; pricing publication triggered.

**Cross-track dependencies:**

- DA program plan's Phase 1/2 (atom landing, `deliverable-letter` pipeline) is upstream of Codex Phase 2 CDX-9 comment letter.
- SmartCity OS planner's slot decision for Codex 1b receiving surface in `smartcity-os` is the Phase 4 receiving surface. Coordination call before Phase 4 entry (see Phase 4 cross-track coordination note).
- Migration sprint Phase 2C (SmartCity OS Empressa Neon swap) unblocks ADR-008 engine factor-out. Codex engine work moves to `hauska-engine` after that; relocation, not workstream change.
- Hauska SDK gap closure (Stream E in `27_*`, gated on `33_hauska_sdk_roadmap.md` migration) unblocks CDX-15 audit trail.

## Verification per phase

| Phase | Verification |
|---|---|
| 1 | Codex-side 1b-relevant atoms in registry per `27_*`; reviewer-side QA surface scaffold built and routable in legacy-design-tools; engine full-pass mode produces evaluable output on a test project; brand migration (Stream G) on track per its own verification |
| 2 | Moab project run end-to-end per QA-readiness 8-point definition; CDX-QA-1 scenario set executable; Empressa-as-reviewer-zero using Codex 1b on own DA outputs; engine API contract documented |
| 3 | Reviewer-side surface includes adaptive UI, conversational primitive, version drift alerts, audit export (if SDK closed); per-reviewer learning operating; audit trail produces verifiable artifact on test scenario |
| 4 | Codex 1b live in Bastrop's SmartCity OS Plan Review surface; Sylvia/Jaime using on real submittals; findings flowing into operational dashboards |
| 5 | 1a operational against Bluebeam Studio Projects; firm-tenant atoms producing; firm precedent aggregation running on test firm |
| 6 | 2–3 pilot firms onboarded; COI controls verified; two pilots converted to paid |
| 7 | Public brand live; pricing public; Wave 5 features shipped selectively per demand |

## Open decisions

- **Reviewer-side QA surface location in legacy-design-tools** — extend `plan-review` artifact, new artifact (`codex-1b-qa`?), or extend `qa` artifact. Resolution required to start Phase 1 CDX-Phase1-1.
- **Empressa-as-customer-zero rotation** — DA customer-zero AND Codex 1b reviewer-zero simultaneously, or sequential? Decided in DA Phase 4 DA-17 with implications for Codex Phase 2.
- **Reviewer-side surface migration to smartcity-os** — when Phase 4 activates, does the surface code move from legacy-design-tools to smartcity-os, get duplicated, or share via component library? Cross-planner design call.
- **Smartcity-os slot for Codex 1b receiving surface** — smartcity track deliverable. Tracked here for awareness; resolution required for Phase 4 entry.
- **Bluebeam ToS interpretation** — open Codex GA decision. Required before Phase 5 entry.
- **Firm tenancy schema** — open Codex GA decision; ADR-009 drafting deferred until Phase 5 entry.
- **Pilot firm selection criteria** — refined in Phase 6 but worth surfacing now.
- **Comment-letter training data legal handling** — open Codex GA decision; required before Phase 6 CDX-Comment-Letter-Training.
- **Code licensing economics escalator** — ICC per-tenant fixed-fee scaling — open Codex GA decision; required before Phase 6/7.
- **Conflict-of-interest controls specifics** — deferred to ADR-009; Phase 5 prerequisite.
- **Brand publication timing** — Phase 7 trigger; ADR-008 settled "powered by Hauska Engine" pattern.
- **Pricing publication timing** — Phase 6 exit criterion; coordinate with `14_pricing_framework.md`.
- **Bluebeam Max competitive positioning** — open Codex GA decision; Phase 5/6 input.

## References

- [`47_codex_plan_review.md`](47_codex_plan_review.md) — Codex product home
- [`27_engine_evolution_plan.md`](27_engine_evolution_plan.md) — shared engine work + atom registry expansion (includes Stream G brand migration)
- [`42_design_accelerator_program_plan.md`](42_design_accelerator_program_plan.md) — sister program plan, DA side
- [`05_living_lineage_thesis.md`](05_living_lineage_thesis.md) — strategic foundation
- [`06_cities_value_narrative.md`](06_cities_value_narrative.md) — cities-facing application
- [`30_smartcity_os.md`](30_smartcity_os.md) — sister product (city side); Codex 1b ships into Plan Review surface
- [`40_design_accelerator.md`](40_design_accelerator.md) — sister product (architect side); shared engine
- [`80_adrs/adr_001_atom_architecture.md`](80_adrs/adr_001_atom_architecture.md) — atom contract
- [`80_adrs/adr_007_cross_stakeholder_atom_access.md`](80_adrs/adr_007_cross_stakeholder_atom_access.md) — access scopes; firm-tenant model extends this
- [`80_adrs/adr_008_engine_factor_out.md`](80_adrs/adr_008_engine_factor_out.md) — engine factor-out
- `33_hauska_sdk_roadmap.md` (queued migration) — gates CDX-15
- `46_smartcity_parcel_intelligence.md` (queued migration) — informs CDX-6
- `adr_009_firm_tenancy.md` (queued, Phase 5 entry) — gates 1a
- `11_roadmap.md` — portfolio working checklist
- `14_pricing_framework.md` — pricing input
- SmartCity OS planner session summaries + slot decision — Phase 4 cross-track coordination
- ADR-005 (queued) and ADR-006 (queued) — multitenancy and anchoring substrate

## Revision history

- **2026-05-11 (origin):** drafted during comprehensive planning session. **1b-first scoping** with 1a deferred to Phase 5. QA-readiness defined as Phase 2 exit milestone. Phases 1–4 concrete; Phases 5–7 lighter detail with refinement at phase entry. Brand migration referenced (Stream G in `27_*`); Phase 4 cross-track coordination note added in same-session audit pass. Companion to `27_engine_evolution_plan.md` (shared engine work) and `42_design_accelerator_program_plan.md` (DA side).
