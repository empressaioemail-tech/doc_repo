---
id: 2026-05-28_brokerage_v1_launch_sequence
title: Decision — Brokerage wedge order of operations (V1 launch first)
date: 2026-05-28
status: superseded
owner: nick
related: [75a_hauska_brief_extension, 75_hauska_brokerage_workflow_plan, 76_empressa_wedge_90d_operating_plan, _decisions/2026-05-26_empressa_wedge_operating_commitments, _decisions/2026-05-28_brokerage_v1_expanded_scope]
---

# Decision

Lock execution order to launch V1 of the browser extension first, then sequence collaboration, atomization, paywall-wallet, and viral/admin graph features as post-V1 phases.

Superseded on 2026-05-28 by [`_decisions/2026-05-28_brokerage_v1_expanded_scope.md`](_decisions/2026-05-28_brokerage_v1_expanded_scope.md), which moves `3b/3c/3d/3e` into V1 scope.

## Context

The active brokerage wedge already has the extension pilot and merged backend routes (`/api/brokerage/v1/brief`, `/brief/summarize`, `/research/chat`) documented in current-state and inbox close artifacts. Operator added new product requirements that increase value and retention but would expand scope if absorbed before launch. We need a clean sequencing call that preserves launch velocity while capturing these requirements in canonical docs.

## Structural commitment check

- Sell reasoning, not data: **green**. Brief + workspace remain citation-first reasoning artifacts with provenance and confidence.
- Partnership-first sourcing: **green**. No change to sourcing policy; this is workflow and packaging scope.
- Cost per jurisdiction: **green**. Scope is product-layer retention and billing behavior, not jurisdiction ingest expansion.
- Dual interface principle: **green**. Product remains workflow UI-first with tracked MCP-compatible atomization follow-on.
- Focus queue rule: **green with queue call**. New requirements are queued as Phase 3b-3e after V1 gate.

## Reasoning

The highest-risk failure right now is not lack of features; it is failure to launch with a stable retrieval and research loop. The newly captured capabilities are strong multipliers, but they depend on a stable run model and identity thread from V1. Sequencing them post-launch keeps engineering throughput pointed at one gate while still preserving operator intent in canonical plans. This ordering also aligns with the 90-day wedge plan where legal, consent, and GTM observation are staged in parallel without blocking initial product proof.

## Reversal criteria

- Reverse if V1 launch quality is insufficient for pilot trust (for example repeated wrong-jurisdiction outcomes on in-corpus addresses) and immediate workspace-history controls are required to stabilize user trust.
- Reverse if a design partner contract requires sharing/collaboration before pilot signature.
- Reverse if billing constraints require paywall gating at launch to stay within compute budget.

## Dependencies

- Depends on V1 deploy gate: cortex-api deploy + migration 0026 + extension prod endpoint wiring + smoke verification.
- Post-V1 phases depend on legal consent posture for sharing and graph features per the 2026-05-26 operating commitments decision.

## Counterparties

Internal: Nick, planner, cc-agent-C, cc-agent-E. External: Valerie and first brokerage pilot users.
