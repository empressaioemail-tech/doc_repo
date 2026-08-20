---
decision_id: 2026-08-20_empressa_trading_single_owner_markets
date: 2026-08-20
owner: systems seat
status: active
related_canonical:
  - _catalog/seat_register.json
  - 62_seat_topology.md
  - _catalog/repo_intents.md
---

## Decision

empressa-trading has a single exclusive owning seat: markets. Trading requests cockpit product and UX changes from markets. A path split was considered and rejected on current evidence.

## Context

doc 62 requires product repositories to have one writer. August 2026 writes in empressa-trading were the markets enforcement arc (TW-68 through TW-74), cutting through `apps/cockpit/backend`, `tools/deploy_gate`, and frontend provenance tiles. Trading remains a registered seat with an empty `repos` array.

## Structural commitment check

Hauska spine: exclusive write prevents shared-index collisions. Operator-not-bottleneck: naming a dormant seat as owner would queue every cockpit change behind a seat that is not writing. Tenant sovereignty: not implicated.

## Reasoning

Last-writer-wins is rejected as the ownership rule. It describes who wrote, not who may write next. Product identity in repo_intents still names a trading venture (Empressa Cockpit). That is why trading stays registered. Exclusive ownership follows the live writer because a path split is not clean: TW-66 already crossed frontend and backend in one commit. Giving trading the whole repo while it is not seated recreates the operator as the bottleneck the topology exists to avoid.

## Reversal criteria

If trading is seated and writing cockpit product code while markets is still writing spine, capture, and deploy-gate code, declare a path split then: frontend plus product routers to trading; spine, capture, and `tools/deploy_gate` to markets. Do not transfer the whole repository as the first move.

## Dependencies

`_catalog/seat_register.json` `_empressaTradingOwnership`. SEAT-01 refuses writes to `P:/Empressa Trading` from any worktree other than `P:/seat-worktrees/markets/empressa-trading`.
