---
decision_id: 2026-06-07_adr008_gate_front_seam_scoping
date: 2026-06-07
owner: Nick
status: active
related_canonical: [00c_portfolio_master_map, 54_tenant_leg_sprint, adr_005_multitenancy]
related_adr: [80_adrs/adr_008_engine_factor_out]
---

## Decision

ADR-008 covers two distinct moves that the tenant leg must not conflate:

1. **Gate-front seam (tenant-leg, now).** Generalize the brief service-seam (`legacy-design-tools/artifacts/api-server/src/middlewares/brokerageServiceAuth.ts`, shipped in PR #144) into a service-auth path the MCP gate uses to reach the property/parcel and plan-review engines. The result is that a tenant consumes those engines through the MCP gate rather than reaching cortex-api directly (as the brokerage extension does today). This is a logical decoupling at the seam, achievable while the engines remain workspace packages inside cortex-api.

2. **Repo factor-out (unchanged).** Physically extracting the engines into the `hauska-engine` repo per ADR-008 stays gated on M-Stabilize Phase 2C and sequenced behind the wedge ship, per [`_decisions/2026-06-06_engine_extraction_unfrozen.md`](2026-06-06_engine_extraction_unfrozen.md).

The tenant leg needs only move 1. This decision does NOT pull the repo factor-out forward.

## Context

The recon-reframed near-term need for the tenant leg is "gate-front the property/parcel and plan-review engines so a tenant consumes them through the gate" (00c scoped-tenant section, Mox substrate-readiness dependency chain). Read literally against ADR-008, that sounds like the repo factor-out, which the 2026-06-06 unfrozen decision deliberately kept gated on M-Stabilize Phase 2C so it does not pull build attention off the wedge ship. Verified 2026-06-07: the engines are still workspace packages (`lib/briefing-engine`, `lib/finding-engine`); the brief extension hits cortex-api `/api/brokerage/v1` directly, bypassing the gate; and the only existing gate-front seam is the brief service path from PR #144 (`requireBrokerageAuthOrServiceToken`, `Authorization: Bearer <SERVICE_API_KEY>`, which sets a `serviceAuth.tenantId`).

The two moves are separable. Routing engine consumption through the gate is a seam change, not a repo move. The seam already exists for the brief; generalizing it to the other engine entry points is the tenant-leg slice and is small relative to a physical extraction.

## Structural commitment check

Pre-mortem run 2026-06-07 as part of the tenant-leg check. Green on all four structural commitments. The gate-front seam positively serves the Hauska spine rule (it expresses the gate as the single tenant-aware front door) and the sell-reasoning commitment (metered consumption flows through the gate). The focus-queue concern that froze and then carefully re-sequenced the repo factor-out is respected, because this decision explicitly does not touch the factor-out timing; the seam work rides the tenant-leg sprint, which is itself sequenced behind the deploy and M-Stabilize WS-1.

## Reasoning

Building the tenant partition (ADR-005 Layer A) requires a single point where reads are scoped to a tenant. The gate is that point. For the gate to scope engine-backed reads, the gate has to be the path to the engines, hence the seam. Making the seam the tenant-leg dependency, and leaving the physical repo move on its M-Stabilize gate, gives the tenant leg what it needs without reopening the sequencing the unfrozen decision settled.

## Reversal criteria

Re-fold into the repo factor-out if generalizing the seam proves to require so much engine-boundary cleanup that doing it in place is wasted work versus extracting; in that case escalate to re-sequence against M-Stabilize Phase 2C rather than building a throwaway seam. Otherwise the split stands.

## Dependencies

Feeds [`54_tenant_leg_sprint.md`](../54_tenant_leg_sprint.md) (the gate-front seam is sequence step 2) and [`adr_005_multitenancy.md`](../80_adrs/adr_005_multitenancy.md) Layer A (enforcement runs behind the seam). Does not amend the ADR-008 body or its repo-factor-out sequencing.

## Update (2026-06-07): widened to all apps, and the seam is step 1 of full extraction

Superseding framing per [`2026-06-07_full_engine_extraction_and_data_packages.md`](2026-06-07_full_engine_extraction_and_data_packages.md): the gate-front seam is no longer just "so other tenants reach the engines." Full engine extraction is committed, so the seam is **step 1 of the extraction** ([`56_engine_extraction_sprint.md`](../56_engine_extraction_sprint.md)) and applies to **every app, including our own** (Cortex, Codex, the extension, SmartCity). The end state is no ungated path to an engine: engines live in the spine (`hauska-engine/engine-api`), cortex-api thins to a BFF, and there is no in-app engine to bypass. The seam-vs-physical-lift distinction in this decision still holds (seam now, physical lift gated behind M-Stabilize 2C); what changed is the seam's scope (all apps) and its role (extraction step 1, not a permanent in-cortex-api shim).

## Counterparties

Internal. Affects cc-agent-C (legacy-design-tools seam generalization) and cc-agent-M (gate consumption of the seam) scope in the tenant-leg sprint, and cc-agent-E (the engine-api home) in the extraction sprint.
