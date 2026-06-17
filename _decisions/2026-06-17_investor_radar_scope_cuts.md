---
id: 2026-06-17_investor_radar_scope_cuts
title: Decision — investor radar scope cuts (lead engine cut, provider freeze, Free/Pro/Max, G2 launch-blocking)
date: 2026-06-17
status: active
owner: nick
kind: decision
related: [75i_investor_radar_prelaunch_sprint, 75g_investor_deal_radar, 75h_investor_deal_radar_launch_readiness, 61_property_intelligence_master_plan, 08_tiered_access_model]
---

# Decision: investor radar pre-launch scope cuts

## Decision

Per the 2026-06-17 handoff converting the radar from consumer skeleton to Cotality-wired and market-ready:

1. **Lead engine / inverted property feed is CUT.** Cotality building-permits, propensity-to-sell, and owner-occupancy/absentee wire as **underwriting depth on the property the user is viewing** (context that sharpens the verdict), not as a feed.
2. **Provider freeze.** Wire and ship everything already on contract (Cotality) before any new provider is considered. No new provider this sprint.
3. **Owned-identity export** (profile + provenance ledger) is a thin optional stretch, not a blocker; no new provider.
4. **Tiers are Free / Pro / Max** (was Free / Pro): Free = radar (L1); Pro = cited brief + profile + comps/rent; Max = subsurface + insurability + minerals. accessPolicy + package entitlement, with a **metered depth allowance to protect Cotality COGS**.
5. **G2 (Cotality consumer-display license) is now LAUNCH-BLOCKING**, because the paid tiers display Cotality-derived numbers. Push it in parallel from now.

## Context

The earlier plan ([`75g`](../75g_investor_deal_radar.md) Layer 3, the 2026-06-16 dispatches) carried a lead feed as the inversion and a two-tier Free/Pro. The handoff refocuses the build on shipping real Cotality underwriting depth on the property in front of the user, and freezes provider expansion until the contracted surface is fully consumed.

## Reasoning

The verdict's value is depth on the property the user is already looking at; the inverted feed is a separate, heavier build that would distract from shipping the wedge and is far stronger once the profile is rich (a Phase-2). We already hold the full underwriting stack on the Cotality contract, so adding providers before consuming it is waste. Three tiers map the data-package depth cleanly (Pro = parcel/comps/rent, Max = subsurface/insurability/minerals) and the metered allowance protects the per-call Cotality COGS. The paid tiers surface Cotality-derived numbers, so the consumer-display license moves from a paid-tier gate to a launch gate.

## Reversal criteria

- **Lead feed:** revisit as Phase 2 once the wedge converts and the per-user profile is rich enough to make the feed precise.
- **Provider freeze:** lift once the Cotality surface is fully consumed and a real capability gap remains that Cotality cannot fill.
- **Tiers:** revisit the Free/Pro/Max split and the $49 Pro / Max price after S1 conversion data.

## Status

Active. Governs [`75i`](../75i_investor_radar_prelaunch_sprint.md) and the 2026-06-17 dispatches; supersedes the lead-feed scope in [`75g`](../75g_investor_deal_radar.md), [`76f`](../76f_investor_deal_radar_gtm.md), and the 2026-06-16 dispatches.
