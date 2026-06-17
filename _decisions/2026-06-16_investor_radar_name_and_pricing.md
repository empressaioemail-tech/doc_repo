---
id: 2026-06-16_investor_radar_name_and_pricing
title: Decision — investor deal radar keeps the Hauska name; pricing is flat monthly (provisional)
date: 2026-06-16
status: active
owner: nick
kind: decision
related: [75g_investor_deal_radar, 75h_investor_deal_radar_launch_readiness, 08_tiered_access_model, 14_pricing_framework, 80_adrs/adr_008_engine_factor_out]
---

# Decision: name = Hauska, pricing = flat monthly (provisional)

## Decision

1. **Name.** The consumer investor deal radar extension keeps the **Hauska** brand. No separate Empressa consumer brand for this surface.
2. **Pricing.** The paid tier is a **flat monthly subscription**, decided provisionally ("for now"). The free tier (the cheap radar pass plus a capped number of full briefs) is unchanged (Layer 1, per `08_tiered_access_model.md`).

## Context

Two open decisions surfaced in the 2026-06-16 launch-readiness pass for the investor deal radar ([`75g`](../75g_investor_deal_radar.md)). The operator resolved both directly.

## Reasoning and implications

**Name.** This is a conscious override of [`adr_008_engine_factor_out.md`](../80_adrs/adr_008_engine_factor_out.md), which places product surfaces under Empressa and reserves Hauska for the substrate (Engine, SDK, MCP Server, catalog). Keeping a consumer product surface under Hauska diverges from that placement. The operator owns the call (brand simplicity and Hauska equity). Logged as a deliberate override, not silent drift, per naming-consistency discipline.

**Pricing.** Flat monthly supersedes the wallet-metered microfunding ($5 auto-top-up increments) that the earlier Property Brief V1 spec ([`75a`](../75a_hauska_brief_extension.md)) assumed, for this product. A flat monthly is recurring subscription billing, a different primitive than the wallet top-up. Circle (the decided v1 fiat rail, `_decisions/2026-05-21_fiat_rail_circle.md`, USDC-native) may not be the cleanest path for consumer recurring card subscriptions; the billing rail is to be confirmed when the paid tier is wired (a subscription processor may be the better fit). The `brokerage_wallets` schema can still back entitlement, but the charge is recurring, not per-compute. Not on the critical path for the free public launch.

## Reversal criteria

- **Pricing:** revisit after S0/S1 pilot conversion data. Move to usage-based, hybrid, or a different price point if flat monthly does not fit investor willingness-to-pay. The "for now" is explicit.
- **Name:** revisit if the agent-operator catalog and the consumer tool both carrying "Hauska" causes go-to-market or brand-layer confusion (the ADR-008 concern made concrete).

## Status

Active. Captured in [`75g`](../75g_investor_deal_radar.md) and the launch-readiness checklist [`75h`](../75h_investor_deal_radar_launch_readiness.md).
