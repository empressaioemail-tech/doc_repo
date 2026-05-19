---
id: 28_mcp_first_product_design
title: MCP-first product design principle and product line architecture
status: active
last_updated: 2026-05-19 (combined Cortex/Codex sprint folds MCP co-design into L1-L6 stream rather than queuing retrofit as a separate later phase; Codex 1a, Codex 1b, Cortex all confirmed tracked-retrofit; sprint goes stronger than minimum policy per _decisions/2026-05-19_sync_4_5_and_cortex_sprint.md)
applies_to: portfolio
related: [07_product_line_summary, 09_post_saas_substrate_thesis, 14_pricing_framework, 29_mcp_surface_tier_model, 30_smartcity_os, 40_design_accelerator, 42_design_accelerator_program_plan, 47_codex_plan_review, 48_codex_program_plan, 41_revit_connector, 50_hauska_mcp_server, 60_eci_atomization, _decisions/2026-05-19_sync_4_5_and_cortex_sprint, adr_008_engine_factor_out]
owner: nick
---

# MCP-first product design principle

The product line architecture principle that generalizes existing structural commitment 4 (dual interface, MCP primary for v1) from atom-level to product-line level. Every Empressa product surface either ships MCP-first or retrofits MCP as a tracked roadmap item.

## The principle

**Net-new products ship MCP-first with human UI as the second surface.** Define agent use cases first. Build engine and atoms to support them. Build MCP surface. Wrap with UI for humans who occasionally need direct interaction.

**Existing UI-first products retrofit MCP as v2 or later work.** Identify what an agent would want to do with the product. Map those use cases to atom queries and existing engine functions. Spec MCP tools. Wire accessPolicy enforcement at the MCP layer. Add MCP surface to the product's roadmap with a target date. UI remains as-is.

**Every product roadmap tracks MCP surface ship date as a line item.** This makes the principle visible across the portfolio without forcing all products to ship MCP simultaneously.

## Why this matters

Three reasons the principle is load-bearing.

First, agent operators are the buyer per the catalog thesis. The MCP is the primary value channel for agents. The UI without MCP serves a different (human) audience but doesn't reach the catalog's target market.

Second, dual-interface products produce execution atoms via the SDK payment substrate (per ADR-013). Every product MCP becomes a source of structured organizational memory feeding ECI. The compounding intelligence loop depends on having MCP surfaces across the portfolio, not just on the catalog itself.

Third, the post-SaaS shift commoditizes UI-only products faster than substrate-grounded products. MCP-first design hedges against this commoditization by making the substrate the primary surface.

## The back-into pattern for existing products

For SmartCity OS specifically (the canonical example): the UI is calling an engine layer today. The retrofit work is:

1. Refactor so business logic lives entirely in the engine, not in UI components
2. Expose engine functions as MCP tools (search_atoms, get_atom patterns from 50_hauska_mcp_server, plus product-specific tools)
3. Wire accessPolicy enforcement at the MCP layer per ADR-017
4. Verify both UI and MCP call paths flow through the same engine
5. UI doesn't change for users; new agent surface appears

The pattern generalizes to Codex 1a/1b, Design Accelerator, and other UI-first products. A runbook at 90_runbooks/mcp_retrofit_pattern.md would codify the steps so subsequent retrofits do not re-invent the approach. (Runbook creation queued for the doc_repo agent.)

## Product-by-product status

### Hauska MCP Server
- Status: in development (Sprint 51)
- Coverage: Layer 1 code-section atoms via search_atoms, get_atom, list_jurisdictions
- Notes: the foundational MCP surface. Other product MCPs consume the same atom contract and may share runtime patterns.

### ECI (Empressa Company Intelligence)
- Status: queued for atomization post-51 ship (Q1 from 2026-05-15 catalog roadmap session)
- Coverage: internal atoms (sprint-item, decision-record, open-question, commercial-record, lead-record, knowledge-document, knowledge-chunk, conversation-record, daily-update, meeting-extraction, plus person via shared actor-record atom)
- Notes: the dogfooding play. Once atomized, the Hauska MCP Server (or a dedicated internal MCP) exposes ECI state to authorized actors (operator, strategic agents).

### SmartCity OS
- Status: live in Bastrop, second city pipeline (Jarrell, timing TBD)
- MCP retrofit: queued post-51 ship, sequenced after ECI atomization
- Notes: MCP retrofit and city-to-city data sharing are the same work. Cross-tenant atom access per ADR-007 and ADR-017 is the mechanism; the MCP server tools layer is the surface. Should be tracked as one roadmap item, not two.

### Codex (plan review and code intelligence)
- Codex 1a (contractor-side plan review for firms doing reviews on a city's behalf or self-review pre-submission per 47_codex_plan_review.md): Live or pre-launch. MCP retrofit queued; expected to be highest-leverage commercial MCP because firms already pay per-seat for plan-review tooling and the metering model is per-seat with bundled MCP call quota plus cross-tenant Layer 2 overage per 29_mcp_surface_tier_model.md.
- Codex 1b (city-side plan review): Pre-launch; lands when 11a Bastrop production sprint exits. **MCP retrofit in flight per 2026-05-19 combined Cortex/Codex sprint** — four existing-product tools (`codex/finding_generation`, `codex/override_write`, `codex/briefing_fetch`, `codex/snapshot_ingest`) ride this sprint alongside Cortex retrofit; runs concurrent with Phase 2 QA-readiness work rather than queued post-launch. Per [`_decisions/2026-05-19_sync_4_5_and_cortex_sprint.md`](_decisions/2026-05-19_sync_4_5_and_cortex_sprint.md).
- Codex code intelligence: MCP IS the primary surface (via Hauska MCP Server tools over code-section atoms). Human UI is the Codex code-lookup web tool, free at Layer 1 per 08_tiered_access_model.md. This is the cleanest example of MCP-first design in the portfolio.

Per the 2026-05-16 operator decision, Codex is the product brand covering all three (plan review plus code intelligence). The naming consolidates the brand around code-related agent and human surfaces.

### Design Accelerator (Cortex)
- Status: pre-launch; customer-zero is Empressa's own Moab projects (Arena Roja)
- MCP retrofit: **in flight per 2026-05-19 combined Cortex/Codex sprint** — see [`_decisions/2026-05-19_sync_4_5_and_cortex_sprint.md`](_decisions/2026-05-19_sync_4_5_and_cortex_sprint.md). Co-designed with L1-L6 UI surfaces rather than treated as a separate later phase; this is stronger than the minimum policy. Lane B dispatch: [`_dispatches/2026-05-19_cc-agent-M_mcp_tool_surfaces.md`](_dispatches/2026-05-19_cc-agent-M_mcp_tool_surfaces.md). Tools land in `hauska-mcp-server` under `cortex/*` namespace.
- Notes: architect-facing UI today. MCP version lets architect-side agents query design intelligence directly. Most natural agent use cases involve delegated workflow (draft response letter, query constraint set, generate detail spec).

### Revit Connector
- Status: in development as C# add-in companion to Design Accelerator
- Dual interface: different shape. Revit is itself a closed UI tool. The agent-facing surface generalizes via MCP exposing detail-callout-spec atoms (and other render-target atoms) so any host tool or any agent can consume them. The Revit add-in remains as the primary delivery into Revit specifically.
- Notes: longer-term, multi-host generalization (AutoCAD, ArchiCAD, Vectorworks) is opportunistic via the MCP surface.

### Hauska SDK
- Status: v0.1.0 published; payment substrate is principle-committed, not yet implemented (see 14_pricing_framework.md SDK payment substrate section)
- Human surface: potential future dashboard for atom flow visibility, contract version, connected consumers. Lower priority because SDK buyers are developers.

### doc_repo
- MCP version: discussed and parked. Web_fetch on the public repo handles current read needs adequately. A small MCP server exposing search and fetch by frontmatter could be built if specific friction surfaces, but not now.

## Sequencing recommendation

Post-Sprint 51 ship, the MCP work sequence:

1. **ECI atomization (Phase 1).** Internal-only, smallest scope, highest leverage. Proves the atom contract works for internal state. Unlocks the dogfooding story operationally.

2. **SmartCity OS MCP retrofit and city-to-city data sharing (Phase 2).** Single sprint covering both because they are the same work. Proves cross-tenant access scopes work in production. Unlocks the city-to-city commercial feature on the roadmap.

3. **Codex 1a MCP (Phase 3).** Highest-leverage commercial MCP. Architects pay per submission today; per-call metering is a natural fit. Proves per-call metering and commercial agent consumption work.

4. **Codex 1b MCP (Phase 4).** AHJ batch operations and cross-jurisdictional compliance tracking.

5. **Design Accelerator / Cortex MCP (Phase 5).** At or post-launch, depending on launch timing.

6. **Revit Connector multi-host MCP (Phase 6, opportunistic).**

Each step de-risks the next. Each step also produces execution atoms feeding ECI, which compounds.

## Open questions

These are real and need answers before they become blockers.

**Tier model for product MCP surfaces.** ~~Open.~~ **Resolved 2026-05-16.** See [`29_mcp_surface_tier_model.md`](29_mcp_surface_tier_model.md) for the four cross-cutting principles (Layer 1/2 mirrors 08 atom-tier; within-vs-cross-tenant as second axis with substrate-MCP refinement; SDK as settlement layer; reasoning-call as unifying accounting unit) and per-product matrix covering all eight product MCP surfaces. Side-effect decision: Hauska MCP Server Phase 0 revenue scenario resolved as Scenario B per [`_decisions/2026-05-16_hauska_mcp_server_scenario_b.md`](_decisions/2026-05-16_hauska_mcp_server_scenario_b.md).

**Customer pull validation.** Building MCP for a product that no agent wants to query is wasted work. Need a signal mechanism. Probably the answer is: ship MCP at v1 for products where the agent ecosystem is at least nascent (code intelligence, plan review), wait for signal on products where it is not (SmartCity OS for city managers themselves, who are not running agents yet; their counterparties like developers and brokers are).

**Dev rel capacity.** Every product MCP needs documentation, SDK examples, error reference, change log. That is real dev rel capacity. Empressa does not have a dedicated dev rel function today. Probably handled in-line by engineering for v1 per product; formalize once there are three or four product MCPs in the wild.

**Engineering capacity reality.** Adding "SmartCity OS MCP retrofit" plus "Codex 1a MCP" plus "Codex 1b MCP" plus "Design Accelerator MCP" to the queue saturates capacity. The sequencing recommendation above respects this; each MCP retrofit is its own focused sprint, not parallel work.

## Relationship to structural commitments

This principle extends structural commitment 4 from atom-level to product-line level. Suggested rewording for commitment 4 in the merged Project instructions and in 11_roadmap if relevant:

"Dual interface as product line principle. Net-new products ship MCP-first with UI as second surface. Existing UI-first products retrofit MCP as a tracked roadmap item. Every product surface lands an MCP ship date in its program plan."

The original "MCP primary for v1, web UI deferred to v2" framing remains correct for atom-level work (the catalog itself).

## References

- 07_product_line_summary.md (product portfolio detail)
- 09_post_saas_substrate_thesis.md (strategic motivation)
- 14_pricing_framework.md (commercial model, including SDK payment substrate)
- 50_hauska_mcp_server.md (the canonical MCP implementation)
- 60_eci_atomization.md (ECI MCP retrofit specifics)
- 30_smartcity_os.md (SmartCity OS product home)
- 47_codex_plan_review.md and 48_codex_program_plan.md (Codex product surfaces)
- 40_design_accelerator.md (DA product home)
- 41_revit_connector.md (Revit Connector)
- ADR-008 (Hauska Engine factor-out; the engine being factored out is what MCP surfaces wrap)
- ADR-013 (procedure-execution atoms; produced by every MCP interaction)
- ADR-017 (atom access control; enforced at the MCP layer)
- Session origin: _sessions/2026-05-16_strategic_brainstorm_dual_interface_sdk_post_saas_claude_ai_strategic.md

## Revision history

- **2026-05-16 (per-product MCP tier model session):** "Tier model for product MCP surfaces" Open question resolved via new canonical doc [`29_mcp_surface_tier_model.md`](29_mcp_surface_tier_model.md). Codex 1a product-by-product status row corrected from "architect-side" to "contractor-side" framing per [`47_codex_plan_review.md`](47_codex_plan_review.md), and pricing-unit framing aligned with the per-seat plus bundled call quota plus cross-tenant overage shape settled in 29.
- **2026-05-16 (origin):** drafted during strategic brainstorm session. Extends structural commitment 4 from atom-level to product-line. Sequencing recommendation and product-by-product status captured. Companion to 09_post_saas_substrate_thesis.md.
