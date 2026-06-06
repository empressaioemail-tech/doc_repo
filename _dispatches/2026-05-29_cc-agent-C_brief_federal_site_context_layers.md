---
id: 2026-05-29_cc-agent-C_brief_federal_site_context_layers
title: Dispatch — Property Brief federal site-context layers (USGS, USDA, USFWS, EPA)
date: 2026-05-29
agent: cc-agent-C
repo: legacy-design-tools
kind: dispatch
related: [75c_property_brief_data_backlog, 2026-05-28_central-tx-property-brief-scope, _dispatches/2026-05-28_cc-agent-C_brokerage_fema_regrid_brief_layers, 46_smartcity_parcel_intelligence]
---

# Property Brief — federal site-context layers on `/brief`

You are **cc-agent-C** on `legacy-design-tools`.

**Backlog:** [`75c_property_brief_data_backlog.md`](../75c_property_brief_data_backlog.md) **PB-003**, **PB-008** (TCEQ spike if time).

## Model (HR-12)

Default: **Grok Build 0.1**. Escalate to Claude only on retry failure.

## Atoms to resolve

- `current-state:portfolio`
- `product:property-brief` — Plane D completeness
- `empressa-product:cortex-site-context`

## Context

`/brief` today runs **FEMA + Regrid** only (`brokerageSiteContext.ts`). Engagement `generateLayers` already runs **USGS, USDA, USFWS, EPA (EJScreen)** via the adapter registry. Brokers expect "all environmental layers we have" per product definition in [`75_hauska_brokerage_workflow_plan.md`](../75_hauska_brokerage_workflow_plan.md).

Partnership-first scoping: federal national APIs are **green** (not city operational data).

## Read first

1. `artifacts/api-server/src/lib/brokerageSiteContext.ts`
2. `artifacts/api-server/src/lib/generateLayers.ts` (or equivalent `runAdapters` call site)
3. `lib/adapters/src/registry.ts` — **do not** re-enable FCC (Akamai WAF; QA-22 drop)
4. [`_dispatches/2026-05-26_cc-agent-C_brokerage_site_context_layers.md`](2026-05-26_cc-agent-C_brokerage_site_context_layers.md) — timeout budget 25–30s total

## Tasks

1. **Extend `fetchBrokerageSiteContext`** to invoke the same federal adapters as generate-layers:
   - USGS (elevation/slope)
   - USDA (soils)
   - USFWS (wetlands / critical habitat)
   - EPA EJScreen (mirror disclosure in summary if applicable)
2. **Preserve** snapshots + `adapter_response_cache` behavior (read snapshot first; write after live fetch).
3. **Map to `SiteContextSnippet[]`** with stable `layerKind` strings; extend `laySummary` verdicts only where obvious (e.g. flood stays FEMA-driven; add `wetlands` / `soils` consumer cards if trivial).
4. **Timeout:** 30s total across all adapters; skip failed layers (do not fail brief).
5. **PB-008 spike (optional):** Research TCEQ Edwards Aquifer public API; stub adapter behind feature flag `TCEQ_EDWARDS_ENABLED` if endpoint is straightforward.
6. **Tests:** `brokerageSiteContext.test.ts` — mock adapters; assert prompt/`siteContext.layers` includes ≥2 federal kinds when mocks return ok.

## Out of scope

- FCC broadband (dropped)
- Bastrop city GIS (partnership; Generate Layers only)
- `briefing_sources` table persistence
- Paywall

## Acceptance

- [ ] `POST /api/brokerage/v1/brief` for Bastrop smoke address returns `siteContext.layers` with ok layers beyond fema/regrid when upstreams respond.
- [ ] Research chat receives extended `siteContext` from stored run payload.
- [ ] PR held for operator merge; branch `cortex/brief-federal-site-context` off `main` @ PR #134 merge (`2de10040`+).

## Report back

`P:/doc_repo/_inbox/2026-05-29_legacy-design-tools_cc-agent-C_brief_federal_site_context_close.md`
