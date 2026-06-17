---
id: 2026-06-16_cotality_consumer_display_license_gate
title: Decision — Cotality consumer-redisplay license gates public display, not internal pilot
date: 2026-06-16
status: active
owner: nick
kind: decision
related: [75g_investor_deal_radar, 61_property_intelligence_master_plan, _research/2026-06-06_cotality_api_surface_catalog]
---

# Decision: Cotality consumer-display is license-gated; internal pilot proceeds on dev tier

## Decision

Derived, reasoning-only outputs over Cotality data may be built and used internally now (dev tier). Public consumer display of Cotality-sourced figures (comps, AVM, rent, and the rest of the underwriting stack), even derived, is gated on confirming the Cotality consumer-redisplay license scope. The investor deal radar's S0 and S1 pilots run on dev tier and are not blocked; S2 community launch and S3 Web Store are blocked until the license is confirmed.

## Context

`lib/adapters/src/national/cotalityExtended.ts` states in its own header that consumer extension display is intentionally not wired, internal/dev-tier only until license terms clear. Separately, Texas is a non-disclosure state, so sold prices are not in the public record and comps ride entirely on Cotality's licensed dataset, which makes the data license, not appraisal law, the binding constraint on showing comps to a consumer. Texas appraisal law itself permits informational automated estimates with disclaimers (Zillow operates statewide).

## Reasoning

Building the derived reasoning layer now (sell reasoning, not raw data) is both the constitutional posture and the legally safer one, and it is independent of the license question because the raw fields stay server-side. Gating only the public display lets the pilot and calibration proceed at full speed while the commercial question is resolved in parallel, rather than blocking the whole build on a bizops item.

## Reversal criteria

Open the public gate when bizops confirms the Cotality license grants consumer redisplay rights for the relevant SKUs in Texas, with a Texas real estate attorney's blessing on the disclaimer and fee framing (G3). Tighten or narrow if the license is confirmed to exclude consumer redisplay, in which case public outputs fall back to non-Cotality public-record layers plus our own reasoning.

## Status

Active. Routed to bizops. Does not block the internal build or the S0/S1 dev-tier pilots.
