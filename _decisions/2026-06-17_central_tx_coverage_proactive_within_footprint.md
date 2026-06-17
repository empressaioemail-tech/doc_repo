---
id: 2026-06-17_central_tx_coverage_proactive_within_footprint
title: Decision — proactive coverage within the wedge footprint (amends demand-driven)
date: 2026-06-17
status: active
owner: nick
kind: decision
related: [61a_central_tx_coverage_program, 61_property_intelligence_master_plan, 75g_investor_deal_radar, _decisions/2026-06-10_texas_coverage_demand_driven]
---

# Decision: proactive coverage within the wedge footprint

## Decision

Pre-warm building-code and ordinance coverage proactively for the deal-volume incorporated cities in the Central Texas wedge footprint (Tier A, ~40-50 cities across the ten core counties). Keep the sub-5,000 and no-zoning tail demand-driven (Tier B). This amends, scoped to the footprint, the 2026-06-10 decision that made all Texas coverage demand-driven rather than flat-batch.

## Context

The 2026-06-10 decision (`_decisions/2026-06-10_texas_coverage_demand_driven.md`) made coverage demand-driven, warmed on first user hit, never pre-warmed. That was correct under its conditions. The investor deal radar changes those conditions.

## Reasoning

This is not a reversal; the decision's premises changed. Three of them. First, there was no defined market footprint in June; now there is (the Central Texas investor wedge, [`75g`](../75g_investor_deal_radar.md)). Second, warming was unreliable because the building-code driver was broken; the driver-quality fix (the keystone of [`61a`](../61a_central_tx_coverage_program.md)) makes it reliable and cheap. Third, ICC landed, unblocking the licensed I-Code layer. And the product logic inverted: for a deal radar, a coverage gap inside the market is a broken first impression at the exact moment of a new user's first use, and in tight investor communities that does not come back ([`76f`](../76f_investor_deal_radar_gtm.md)). So inside the footprint, coverage completeness is the product. The cost commitment (#3, under $200 plus one hour per jurisdiction) is unchanged and enforced per jurisdiction; the batched edition-verification workflow keeps the cumulative review labor tractable.

## Reversal criteria

- Revert to fully demand-driven if the batched-verification workflow fails to keep per-jurisdiction review inside the one-hour envelope, making the wide warm labor-prohibitive.
- Narrow Tier A if early radar usage shows the wedge transacts in a much smaller footprint than the ten-county scope.

## Status

Active. Captured in [`61a`](../61a_central_tx_coverage_program.md). The 2026-06-10 demand-driven decision stands for everything outside the footprint.
