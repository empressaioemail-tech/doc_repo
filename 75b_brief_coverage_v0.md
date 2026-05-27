---
id: 75b_brief_coverage_v0
title: Property Brief — pilot coverage list (v0)
status: active
last_updated: 2026-05-26
applies_to: portfolio
related: [75_hauska_brokerage_workflow_plan, 76_empressa_wedge_90d_operating_plan, 51_substrate_v1_sprint]
owner: planner
---

# Property Brief — pilot coverage list (v0)

> **Purpose.** Public-facing honesty list for pilot users. Publish at `brief.hauska.dev/coverage` or cortex static route when hosted. Update when cc-agent-E merges new eval-passing cities.

## In corpus (confirmed eval-passing, 2026-05-26)

| `jurisdiction_key` | Notes |
|--------------------|-------|
| `bastrop_tx` | UDC + pilot default |
| `cedar_hill_tx` | Cortex QA test address metro |
| `bastrop_county_tx` | County layer |
| `elgin_tx` | Municode |
| `hutto_tx` | Sync 4.5 network |

Expand to 10+ metros per [`76_empressa_wedge_90d_operating_plan.md`](76_empressa_wedge_90d_operating_plan.md) day-45 gate (planner bumps this table on each Sync 5 merge).

## Not in corpus (explicit gap)

- Addresses outside listed cities: brief returns `not_in_corpus` or partial; UI must not imply city code coverage.
- Smithville TX: deferred (eCode360; partnership track in [`73_partnerships.md`](73_partnerships.md)).

## Parcel layers

Federal/Regrid/FEMA baselines ship per [`_dispatches/2026-05-26_cc-agent-C_brokerage_site_context_layers.md`](_dispatches/2026-05-26_cc-agent-C_brokerage_site_context_layers.md) (not yet on brokerage routes as of 2026-05-26).

## Disclaimer (mirror in product)

Not legal advice. Decision-support only. Verify with city staff and licensed professionals. See Terms of Service before use.
