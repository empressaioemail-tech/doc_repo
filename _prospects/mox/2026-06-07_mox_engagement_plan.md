---
id: mox_engagement_plan
title: Mox Intelligence Engagement Plan
status: draft
last_updated: 2026-06-07
applies_to: mox_engagement
related: [80_adrs/adr_007_cross_stakeholder_atom_access, 80_adrs/adr_019_layered_code_substrate, 03a_positioning_framework, 03_structural_constitution_and_drift_guard, 04a_arrow_two_calibration_capture, 09_post_saas_substrate_thesis, 52_mcp_offer_and_buildout, 53_hauska_sdk_completion_sprint, _prospects/mox/2026-06-07_mox_operator_direction_parking]
owner: planner
---

> **Planner note (2026-06-07, on logging).** Re-homed from the draft's proposed `42_*` slot: 42 is taken (`42_design_accelerator_program_plan.md`) and the 40-band is Cortex product sprints, so as a prospect engagement this lives in `_prospects/mox/` per convention (resolves open-question #7). Cross-ref names reconciled to the real doc set: `adr_007_capture_scope` -> [`adr_007_cross_stakeholder_atom_access`](../../80_adrs/adr_007_cross_stakeholder_atom_access.md); `adr_019_layered_jurisdiction` -> [`adr_019_layered_code_substrate`](../../80_adrs/adr_019_layered_code_substrate.md); `positioning_framework_ground_truth` -> [`03a_positioning_framework`](../../03a_positioning_framework.md); `structural_constitution_drift_guard` -> [`03_structural_constitution_and_drift_guard`](../../03_structural_constitution_and_drift_guard.md); `recalibration_2026_06_02` -> [`04a_arrow_two_calibration_capture`](../../04a_arrow_two_calibration_capture.md); `catalog_thesis_four_commitments` -> CLAUDE.md four structural commitments. Expands the [parking seed](2026-06-07_mox_operator_direction_parking.md). Body below is the operator/Mox-session draft, verbatim.

# Mox Intelligence Engagement Plan

## Purpose

High level plan for what we intend to build with Mox, written so the planner agent knows what is coming and can sequence work before we have full detail from the client. This is a direction document, not a spec. Figures and feature lists here are intent, and most are illustrative until calibrated on Mox data. Treat everything as draft and provisional until Phase 0 confirms it on real numbers.

## Scope

In scope: how Mox plugs into the Hauska substrate and the Empressa product surfaces, the surfaces we intend to stand up, the calibration and sovereignty commitments that govern the build, a phase sequence, and the longer horizon levers that could materially change Mox's business.

Out of scope: implementation detail, data schemas, exact integration contracts, pricing, and any commitment that depends on access or figures we do not yet have. Those land after Phase 0.

## Background

Mox is a vertically integrated multifamily operator running on Yardi. Three public arms: Manage (operating engine), Invest (capital side), and BLDR (construction, formerly labeled Renovate on their site). Plus Impact Living as a JV. Roughly 40 communities and 10,447 residences operating now, with a larger all time book that indicates an active and churning third party management business. CEO Miguel Arce. Known stakeholders include Sean (CFO and acquisitions), Joe Goss (construction), Andrea, Sarah, Beau, Sammy.

The thesis we are selling: Mox already produces the operating data. Today it is scattered across Yardi, email, broker decks, and many disconnected tools, and most of it is lost after use. We capture that work as it happens, turn it into intelligence Mox owns, and feed it back into the next decision so it gets less wrong over time.

## Current state

Representation collateral is built and in the operator's hands. None of it is wired to Mox data yet.

- Five product mockups as standalone HTML, charcoal and white in Mox brand with the real Mox logo: command center, ambient browser extension, and one app per arm (Manage, Invest, BLDR).
- A diagrams page with three flywheel diagrams: the mechanic, private versus shared, and why it compounds.
- A branded walkthrough deck, Mox_Intelligence_Overview.pptx.
- An executive summary focused on business impact.

All numbers shown in collateral are placeholders for the meeting, not Mox actuals. (Collateral filed under [`_prospects/mox/collateral/`](collateral/).)

## Architecture approach

Mox is a scoped tenant on the shared Hauska substrate, not a fork. The same gate code runs, on Mox's private store.

- Two flywheels, split by competitive sensitivity. A private operating flywheel for Manage and Invest, sovereign, never pooled, where the moat is calibration depth on Mox's own outcomes. A shared ground truth flywheel for the noncompetitive code and regulatory layer that BLDR and Invest parcel intelligence draw on, which gets sharper because the wider network feeds it too.
- Mox MCP exposes shared Hauska tools (search code atoms, parcel intelligence, pre submission review) plus Mox specific tools (log to project, draft in Mox voice, screen a deal against the portfolio). This makes Mox AI native and not locked to any single model.
- Three surfaces over the same core: a dashboard for executives, department apps for deep work, and an ambient browser extension as the universal low friction capture layer that rides across the systems Mox already uses, with no per system integration to build.
- The deposit loop is the calibration mechanism. A human confirm, edit, or reject at the point of work is the contribution that calibrates the core. Capture is assist first, so the assist earns the right to capture.

## Product surfaces to build

1. Command center. Portfolio level read across all communities and the three arms, an action inbox routed from every arm, and Ask Mox over the private store.
2. Manage app. Monthly close and variance with auto drafted commentary, pre coded invoices, exception based review, early churn signals.
3. Invest app. Underwriting against real operating numbers rather than broker pro formas, owned asset actuals versus underwrite, parcel intelligence, predictive twin, pipeline.
4. BLDR app. Multi jurisdiction code intelligence and pre submission plan review with cited findings, scope and subcontractor history.
5. Ambient extension. Context detection, assist in the moment, capture as a byproduct, scoped and private.
6. Mox MCP. The agent facing front door, scoped tenant model described above.

## Structural commitments and guardrails

These govern the build. A surface that violates them should be revised before it ships.

- Sovereignty. The private operating flywheel is never pooled with anyone. Only the noncompetitive code and regulatory layer flows into shared ground truth.
- Calibration. Every confidence assertion must carry outcome capture. Do not ship confidence that is not calibrated against outcomes. This follows the recalibration findings that confidence today is uncalibrated and verdicts are discarded at the substrate boundary.
- Capture is scoped, owned, and role gated per adr_007. It captures the work, not the worker. It is never a keystroke monitor.
- Mox is a scoped MCP tenant on the shared substrate, not a fork.

## Phasing

Phase 0, prove on the owned book. Stand up the data core for a single owned community, wire capture, and prove calibration against real outcomes. Gate to proceed: the results are real and the history is trustworthy. Nothing points outward until this passes.

Phase 1, surfaces and capture. Ship the command center, the three arm apps, and the ambient extension over Mox's private store through the scoped tenant MCP. Get the assist first capture and the deposit loop working in real workflows.

Phase 2, calibration loops live. Add outcome fields to every confidence assertion, wire verdict capture, calibrate confidence against actuals across arms, and turn on cross line compounding where Manage feeds Invest feeds BLDR.

Phase 3, point the proof outward. The 10x horizon below. Sequenced only after the loop is proven on the owned book.

## 10x horizon, not committed

These change what Mox is, not just how efficiently it runs. They reinforce into one engine: more doors produce more data, stronger proof lowers the cost of capital and wins more mandates, which brings more doors. Listed for the planner to anticipate, not to start.

1. Capital engine. A live, verifiable, always on track record built on the calibrated data, so Mox can move from deal by deal capital to programmatic capital and lower its cost of capital.
2. Mandate engine. An owner facing proof surface that wins and retains third party management mandates, growing doors under management without buying buildings.
3. Doors per head. Operations that handle routine cases on their own so a person oversees exceptions across a far larger portfolio, pushing marginal cost per door toward zero. This is what makes the mandate engine scale.
4. Risk and insurance engine. Turn operating data into lower premiums or a captive structure against one of the largest and fastest rising expense lines in multifamily.

Separate strategic note: the largest version is to productize the platform for other operators, which is the platform company itself with Mox as anchor and first proof point. It carries a real tension around arming competitors and belongs in its own conversation.

## Open questions

1. Which arm and which community is the Phase 0 proof site. Route: Mox, Miguel and Sean.
2. Yardi access model and scope, including read level and which entities. Route: Mox ops and IT.
3. Real figures to replace the illustrative placeholders in collateral. Route: Mox.
4. Internal owner for each surface and stakeholder confirmations. Route: Mox.
5. Commercial structure, catalog design partner framing versus custom build, and economics. Route: operator and Texas startup attorney.
6. The private versus shared boundary in writing, what Mox will and will not allow into the shared code layer. Route: operator and Mox.
7. Confirm the canonical doc slot and number for this file. Route: doc_repo agent and planner. (Resolved 2026-06-07: lives in `_prospects/mox/`, not a numbered slot. See planner note above.)

## Dependencies

- Shared Hauska substrate and code corpus for BLDR plan review and Invest parcel intelligence.
- MCP gate code and the scoped tenant model.
- Cortex and Codex surfaces as the basis for the product screens.
- Calibration infrastructure, outcome capture and verdict capture via atom_events, per recalibration_2026_06_02.

## Cross references

- adr_007_capture_scope, ownership, role, and tenant scoping for capture.
- adr_019_layered_jurisdiction, layered model and amendment overlays for the shared code layer.
- positioning_framework_ground_truth, the verified ground truth layer positioning.
- structural_constitution_drift_guard, invariants that govern product and commercial moves.
- recalibration_2026_06_02, the calibration arrow and the feedback loop findings.
- catalog_thesis_four_commitments, AI accessible, verifiable, integrative, portable by default.

## Substrate readiness (planner analysis, 2026-06-07)

How Mox maps onto the current Hauska MCP and engines, what it needs that is not yet built, and the tenant pattern it shares with SmartCity.

### Surface-to-substrate mapping

Half of Mox rides the existing Hauska engines; half is net-new in a domain Hauska does not cover today.

- **BLDR** (code intelligence, pre-submission plan review, cited accept/edit/reject) rides the Codex product (4 MCP tools) plus the plan-review/finding engine and the public code corpus. Closest to ready; the BLDR mockup is the Codex reviewer re-skinned.
- **Invest, parcel half** (zoning, flood, parcel polygon, code risk) rides the public place tools (`resolve_place`, `get_place_dossier`, `get_place_layers`) plus the property/parcel engine (FEMA, USGS, EPA, Regrid, Cotality). Ready-ish; Cotality depth pending the credential fix.
- **Invest, underwriting half** (underwrite vs operating actuals, predictive twin) and **Manage** (close, variance, invoice coding, churn) are net-new, Mox-private. Multifamily operations finance, not jurisdictional intelligence; built on the tenant store.
- **Command center** is a read/aggregation layer over the tenant store, not an engine.
- **Ambient extension** is the `hauska-brief-extension` pattern generalized across Yardi/Gmail/LoopNet/AHJ.
- **Mox MCP** is a scoped-tenant instance of the Hauska MCP gate plus Mox-specific tools (`log to project`, `draft in Mox voice`, `screen a deal`), which are Tier-2 skill/execution-atom territory (ADR-013/014), tenant-scoped.

### The scoped-tenant pattern (Mox and SmartCity are the same shape)

Mox, SmartCity OS, and the brokerage extension are three instances of one pattern: a scoped tenant with custom surfaces on the shared, gated spine, all under the same theology (calibration plus sovereignty, the deposit loop, the gate). The custom pieces (Mox ops-finance apps, the city dashboard) are tenant-specific surfaces, not forks. Operator framing (2026-06-07): the Mox finance and custom pieces are like building a SmartCity dashboard, custom components with the same theology behind the build. SmartCity OS is currently an island (its own parcel data, no substrate connection); bringing it onto the spine is the same work as onboarding Mox, and SmartCity should consume the spine like Mox.

### Dependency chain (what both Mox and SmartCity force)

- **ADR-005 multitenancy** (queued): a scoped per-tenant private store plus tenant `accessPolicy` enforced at the gate. Today the gate gates by product (public/codex/cortex), not by tenant.
- **ADR-008 engine extraction** (unfrozen): gate-front the property/parcel and plan-review engines so a tenant consumes them through the gate rather than reaching cortex-api directly (as the brokerage extension does today).
- **Arrow two** ([`04a`](../../04a_arrow_two_calibration_capture.md), Phase 1 in flight): the deposit loop is Mox's value prop, and the tenant-partitioned evidence ledger is Mox's sovereignty guardrail. Same mechanism.

Mox and SmartCity are the forcing functions that turn these three from roadmap into load-bearing.

### Two flywheels equal the accessPolicy partition

Private operating flywheel (Manage/Invest) is `tenant-private`, never pooled, the sovereignty root. Shared ground-truth (code/regulatory, BLDR plus Invest-parcel) is `public-free`/`public-paid`/`tenant-shared`. One-to-one with the five-value `accessPolicy` union and the arrow-two guardrail. The architecture the plan describes is the substrate architecture; the missing piece is enforcement, not design.

### Commercial note

The substrate-consuming half (BLDR, parcel intel, calibration, tenancy, decoupling) is spine and earns its cycles regardless of Mox. The net-new ops-finance half is a custom tenant surface following the same theology (like a city dashboard), but it should be scoped and priced as a design-partner or custom build (open-question 5), not absorbed silently as spine work.

## Revision history

- 2026-06-07, initial draft from the Mox collateral session. Captures intent and phasing ahead of real Mox data. All figures illustrative.
- 2026-06-07, logged to `_prospects/mox/` by planner; slot re-homed and cross-ref names reconciled (see planner note).
- 2026-06-07, added Substrate readiness section (surface-to-substrate mapping, scoped-tenant pattern shared with SmartCity, ADR-005/ADR-008/arrow-two dependency chain, accessPolicy partition, commercial note).
