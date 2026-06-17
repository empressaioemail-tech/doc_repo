---
id: 2026-06-16_investor_first_actor
title: Decision — the property-intel extension's first actor is the Austin real estate investor
date: 2026-06-16
status: active
owner: nick
kind: decision
related: [75g_investor_deal_radar, 76f_investor_deal_radar_gtm]
---

# Decision: first actor is the Austin investor

## Decision

The property-intelligence browser extension is refocused from a generic consumer property-brief tool to an investor co-pilot (the "deal radar"), with the Austin real estate investor (wholesaler, fix-and-flip, buy-and-hold) as the explicit first actor and first GTM audience.

## Context

The extension had drifted (canonical doc three versions stale, prod endpoint 503 for weeks, real code unmerged on a branch) while Cortex absorbed every cycle, revealing it as a stranded earlier bet that needed a sharp re-aim. The question was who the extension serves now that Cortex exists. Research into Austin's largest real-estate social communities (Austin RENC ~15.7k, Texas REIAs 20k+, the meetup network) confirmed the dominant, most data-fit, most reputation-driven audience is investors, not architects (Cortex's crowd) or pure consumer buyers.

## Reasoning

The investor workflow is a near-perfect fit for proactive push plus a lightweight per-user profile over our spine: their edge is answering, fast and across many properties, what a property can become and what kills it, which is exactly the calibrated property intelligence we sell. High view volume yields rich per-user signal; outcome-tied keep/reject decisions are the best calibration fuel we have; and tight, loud communities make the tool spread itself. Investors are the distribution-and-calibration wedge, not the revenue ceiling; monetization graduates upward to the agent and operator tiers.

## Reversal criteria

Reverse or re-aim if the S0/S1 pilots show the investor verdicts are not trusted or the profile does not feel true, if investor monetization and retention prove too thin to sustain the channel without the agent/operator tiers carrying revenue, or if a larger, better-fit first actor surfaces from the pilot data.

## Status

Active. Build dispatched 2026-06-16 across `legacy-design-tools` and `hauska-brief-extension`. GTM staged per [`76f`](../76f_investor_deal_radar_gtm.md).
