---
id: 2026-05-28_brokerage_v1_ship_plan
title: Dispatch plan — Brokerage V1 ship batch (3b/3c/3d/3e in scope)
date: 2026-05-28
agent: planner
repo: doc_repo
kind: dispatch-plan
related: [75_hauska_brokerage_workflow_plan, 75a_hauska_brief_extension, _decisions/2026-05-28_brokerage_v1_expanded_scope, _dispatches/2026-05-28_cc-agent-C_brokerage_v1_workspace_metering_graph, _dispatches/2026-05-28_cc-agent-AC_property_workspace_atom_contract, _dispatches/2026-05-28_cc-agent-E_property_workspace_atom_pipeline, _dispatches/2026-05-28_cc-agent-M_brokerage_workspace_mcp_surface]
---

# Brokerage V1 ship batch

This plan executes Brokerage V1 with `3b/3c/3d/3e` included in scope.

## Execution order

1. Fire `cc-agent-AC` first to define atom contract shapes.
2. Fire `cc-agent-E` after AC starts, to implement atom pipeline against contract branch/tag.
3. Fire `cc-agent-C` immediately in parallel for workspace, sharing, paywall-wallet, and admin graph baseline in `legacy-design-tools`.
4. Fire `cc-agent-M` after AC/E shapes are stable, to expose minimum MCP workspace tools for dual-interface parity.
5. Planner validates inbox closes against acceptance criteria and cuts follow-on fix batch only for misses.

## Ship gates

- V1 user flow works end-to-end: run brief -> reopen workspace -> add attachments/notes -> share -> collaborator reads.
- Paywall behavior enforced: read retained, net-new compute blocked at zero balance.
- Wallet top-up path works in `$5` increments with auto-refill behavior.
- Atom package emitted for workspace, run, attachment, share-edge.
- Admin view shows session dots and share edges with consent-aware graph rules.

## Parallelization rules

- C owns product/API/UI behavior in `legacy-design-tools`.
- AC owns contract types only.
- E owns pipeline/emission/storage against contract.
- M owns MCP tool surface only, no duplicate business logic.

## Required inbox close format

Each agent must report:
- PR URL(s) and commit SHA(s)
- Acceptance checklist (pass/fail per item)
- Verbatim test output
- Blockers with exact failing command/output
