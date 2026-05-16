---
decision_id: 2026-05-16_hauska_mcp_server_scenario_b
date: 2026-05-16
owner: nick
status: active
related_canonical: [29_mcp_surface_tier_model, 50_hauska_mcp_server, 14_pricing_framework, 51_substrate_v1_sprint]
---

## Decision

Select Scenario B (self-serve paid tier) as the revenue model for the Hauska MCP Server, resolving Phase 0 decision #1 of Sprint 51.

## Context

Phase 0 of [`51_substrate_v1_sprint.md`](../51_substrate_v1_sprint.md) carried three candidate revenue scenarios from [`50_hauska_mcp_server.md`](../50_hauska_mcp_server.md) Business model section. The choice was open at Sprint 51 kickoff and was named as a gating decision for Phase 8 (self-serve paid tier infrastructure) and Phase 9 (BD enablement materials). The per-product MCP surface tier model session on 2026-05-16 surfaced the four-tier shape (Free / Pro / Team / Embedder License) as confirmed for the Hauska MCP Server / Codex code intelligence substrate surface. Confirming the tier shape made the A vs B vs C choice operationally next.

Scenarios A, B, C summarized from [`50:57-63`](../50_hauska_mcp_server.md#L57-L63):
- A: Free-only distribution channel. $0 Y1, $0-100K Y2 inbound only, ~$50K/yr cost. No BD. Justified by lead-flow to Codex / Cortex / SmartCity OS.
- B: Self-serve paid tier. $30-150K Y1, $100-400K Y2, ~$60K/yr cost. Pays for itself. No BD.
- C: Self-serve + dedicated BD for embedders. $100-400K Y1, $500K-2M Y2, $200-300K/yr loaded. Real revenue line. Embedder sales cycle 6-18 months.

## Structural commitment check

Premortem-check cleared on the cross-cutting tier-model principles 2026-05-16 (all four structural commitments green; all three operational rules green). Scenario B specifically is consistent with all four structural commitments: it preserves the free tier as the substrate distribution channel (commitment 1, sell reasoning not data, requires the substrate be free at Layer 1); preserves partnership-first sourcing via the Embedder License with revenue routing to source actors (commitment 2); does not affect the per-jurisdiction onboarding envelope (commitment 3); and ships paid-tier scaffolding alongside the v1 MCP surface per the dual-interface principle (commitment 4).

## Reasoning

Scenario B is the right cut for three reasons specific to current state. First, it pays for itself without a BD hire, which respects the focus queue rule: Empressa does not have a dedicated BD function today, and committing to Scenario C without that function in place would either fail to materialize the revenue projection or pull operator cycles from active sprint work to chase embedder deals manually. Second, it preserves the optionality to add Scenario C later: the four-tier scaffolding (Free / Pro / Team / Embedder License) ships at v1 regardless under Scenario B; the only thing Scenario C adds is dedicated BD capacity for the Embedder License segment, which can be hired into when first embedder inbound conversation surfaces (per [`50`](../50_hauska_mcp_server.md) Risk 2 mitigation). Third, the revenue projection difference between A and B ($0 vs $30-150K Y1) is enough to justify the $10K/yr incremental cost of operating the paid tier even if no embedder ever converts. Scenario A would force every paid conversion through manual Codex / Cortex / SmartCity OS sales cycles, which are 6-18 months for cities and 1-3 months for firms; Scenario B captures the bring-your-own-agent developer and indie firm segments who would not otherwise touch the sales funnel.

## Reversal criteria

Revisit if (a) Y1 self-serve revenue underperforms the $30K bottom of the projection range materially (under $10K closed by month 9), suggesting the self-serve funnel does not produce paid conversions at the expected rate; (b) an embedder inbound conversation surfaces that the operator cannot move forward on without dedicated BD capacity, in which case escalate to Scenario C with hire planning; or (c) the catalog thesis shifts such that the substrate MCP surface should be unconditionally free to maximize substrate ownership at all cost (would revert to Scenario A).

## Dependencies

This decision depends on the per-product MCP surface tier model rulings landed in [`29_mcp_surface_tier_model.md`](../29_mcp_surface_tier_model.md) on 2026-05-16, which confirmed the four-tier shape (Free / Pro / Team / Embedder License) for the Hauska MCP Server.

This decision unblocks Sprint 51 Phase 3 (auth, rate limiting, key issuance — now confirmed needed for the four-tier enforcement) and Phase 8 (self-serve paid tier — now confirmed in scope rather than conditional). Phase 9 (BD enablement materials) remains conditional and stays out of Scenario B scope.

## Counterparties

Internal: Nick (operator, decision-maker). Affected stakeholders: the engineering work for Sprint 51 picks up Phase 8 scope; the operator picks up the manual commercial-use enforcement loop per [`50:90-96`](../50_hauska_mcp_server.md#L90-L96).

External: future Developer Pro / Team tier customers (indie devs, AI startups, small firms, agent companies per [`50:67-72`](../50_hauska_mcp_server.md#L67-L72)).
