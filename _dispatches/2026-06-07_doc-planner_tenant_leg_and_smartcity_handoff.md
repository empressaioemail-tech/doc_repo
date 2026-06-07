---
id: 2026-06-07_doc-planner_tenant_leg_and_smartcity_handoff
title: Handoff — plan the tenant leg + SmartCity-on-spine; coordinate SmartCity collateral
date: 2026-06-07
agent: doc_repo planning agent (planner-to-planner handoff)
repo: doc_repo
kind: dispatch
related: [00_current_state, 00c_portfolio_master_map, 04a_arrow_two_calibration_capture, 07a_smartcity_product_positioning, _prospects/mox/2026-06-07_mox_engagement_plan, _prospects/vertosoft/2026-06-07_vertosoft_channel_and_offer, 30a_smartcity_stabilization_sprint, 31a_bastrop_maintenance_sprint, _sessions/2026-06-07_substrate_buildout_merged_and_tenant_framing_claude_code]
---

# Handoff — tenant leg + SmartCity-on-spine + SmartCity collateral

> **Trail note.** Planner-to-planner handoff sent by the operator 2026-06-07, after the build-out wave merged and the SmartCity product line + Vertosoft offer were sharpened. Status: **sent.** Comes after the build-out leg; the next leg is the tenant leg serving SmartCity + Mox.

## Boot context

The build-out + commerce + calibration-v1 leg is fully merged (Tier-1 MCP, brief seam, arrow-2 Phase 1, hydrology, SDK, SmartCity WS-1 Phase 2A.0). **Code-complete, deploy deferred** by the operator until ICC + Cotality are ready. The next leg is the **tenant leg**: two scoped tenants (SmartCity, Mox) on one shared spine.

## Read first

`00_current_state.md` (2026-06-07 milestone) -> the session summary (`_sessions/2026-06-07_substrate_buildout_merged_and_tenant_framing_claude_code.md`) -> `00c` (scoped-tenant pattern) -> Mox plan substrate-readiness section -> `07a_smartcity_product_positioning.md` + Vertosoft offer doc -> `04a`, `52`, `53`, `30a`, `31a`, `_research/2026-06-06_cross_repo_recon.md` -> `CLAUDE.md`.

## Tasks (priority order)

1. **Plan the tenant leg.** ADR-005 multitenancy (per-tenant private store + tenant `accessPolicy` at the gate; gate gates by product today, not tenant) + ADR-008 engine extraction (gate-front property/parcel + plan-review engines) + arrow-two Phase 2 (outcome capture) and Phase 3 (calibration computation). Verify current code state first (gh, repo grep). Scaffold ADRs/sprint doc; author cc-agent dispatches. Run `premortem-check` (load-bearing: sovereignty, sell-reasoning, partnership-first; tenant partition is the sovereignty guardrail).
2. **SmartCity-on-spine.** Bring SmartCity onto the substrate as the city tenant: 31a Phase 3 atom-backed context (unblocked by the DB-hold release) + the new ambient capture extension product (07a; brokerage extension is the pattern). Plan as one substrate effort with Mox, two tenant surfaces.
3. **SmartCity collateral.** Coordinate production of the 07a collateral (overview deck, per-product one-pagers, Bastrop case study with real screenshots, channel-partner pack) for Forrest + Vertosoft. Scope/sequence as a build.
4. **Mox Phase 0 readiness** per the substrate-readiness section, once operator supplies the Phase 0 site + Yardi access.

## Operator-gated inputs (do NOT invent)

Government pricing tiers / list price (gates the Vertosoft offer + collateral pricing); the AWS-vs-GCP call on the Vertosoft distribution agreement; Forrest contract/commission; SKU scope (SmartCity bundle vs add-ons); Cotality credential activation (Gene) + ICC onboarding; deploy timing. Flag as pending; plan around them.

## Constraints

Do not relitigate settled items (Decision B pricing, brand placement, tier model, the merged build-out). **Decision C (GTM) pinned; deploy deferred** until ICC + Cotality clear. Doc conventions (frontmatter, no em/en dashes in body, edit-in-place + bump, source attribution). Shared-clone hazard: `git log -3` before commit, explicit paths, skip CRLF phantom-dirty files. Verify identifiers/status against live source before dispatching.

## Deliverables

Sequenced tenant-leg plan + ADR-005/008 scaffolds + cc-agent dispatches; the SmartCity-on-spine plan; the collateral production scope; cross-links updated in 00c / 00_current_state. One commit batch, presented for operator review before push.
