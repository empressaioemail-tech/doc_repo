---
id: 2026-05-26_cc-agent-C_brokerage_site_context_layers
title: Dispatch — Brokerage brief + research chat include parcel site-context layers
date: 2026-05-26
agent: cc-agent-C
repo: legacy-design-tools
branch: cortex/brokerage-site-context
depends_on: PR #128 merged, cortex-api on revision with BROKERAGE_DEV_API_KEY + BRIEFING_LLM_MODE=grok
---

# Brokerage API — parcel layers (Regrid, FEMA, etc.) for Property Brief

## Problem

Chrome extension deep research (v0.4.2) now calls `POST /api/brokerage/v1/research/chat` with Grok, but the brokerage stack only passes **municipal code atoms** (`retrieveAtomsForQuestion`). Cortex engagement flows already load parcel/zoning/flood via `runAdapters` in `generateLayers.ts`. Extension operators expect **all parcel data we have**, not code snippets alone.

## Goal

Enrich brokerage `/brief` and `/research/chat` so Grok receives:

1. Existing code atoms (unchanged).
2. **Site-context layer summaries** for the geocoded parcel: Regrid parcel/zoning, FEMA flood, applicable federal/state/local adapters (same registry as engagements).

No engagement ID required for the extension path.

## Implementation sketch

### 1. `artifacts/api-server/src/lib/brokerageSiteContext.ts` (new)

```ts
// geocodeAddress → AdapterContext → runAdapters(ALL_ADAPTERS or filtered)
// → compact text blocks per ok layer for LLM (not full GeoJSON)
```

- Input: `{ address, latitude?, longitude?, jurisdictionCity?, jurisdictionState? }`
- Reuse `geocodeAddress` when lat/lon missing.
- Build `AdapterContext` same shape as `generateLayers.ts` (read that route).
- Call `runAdapters` from `@workspace/adapters`.
- Map outcomes to `SiteContextSnippet[]`: `{ layerKind, label, summaryText, source }`.
- Timeout budget: 25–30s total; skip failed layers (do not fail brief).

### 2. `brokerageBrief.ts`

- After geocode in `POST /brief`, call `fetchBrokerageSiteContext(...)`.
- Include `siteContext: { layers: [...], fetchedAt }` in response + `payloadJson` stored on run.
- Pass `siteContext` snippets into `generateReasoningSummary` (extend `brokerageBriefLlm.ts` prompt).

### 3. `brokerageBriefLlm.ts`

- Extend `numberedAtomBlock` or add `numberedSiteContextBlock`.
- System prompts: cite code as `[n]` and site layers as `[S1]` or separate section "Parcel data".
- `generateResearchChat`: merge stored site context from run payload + fresh code retrieval for message.

### 4. Env / secrets

- Regrid trial: ensure `REGRID_API_TOKEN` (or existing secret name from deploy.md) on cortex-api.
- No new brokerage env vars required if adapters already work on engagements.

### 5. Tests

- `brokerageBrief.test.ts`: mock `fetchBrokerageSiteContext` returning one flood + one zoning snippet; assert prompt includes layer text.

## Out of scope

- Encumbrance PDF upload (engagement-only).
- Persisting layers to `briefing_sources` (optional v2; v1 in-memory on run payload is enough).
- Hauska MCP catalog tools from brokerage routes.

## Acceptance

- `POST /api/brokerage/v1/brief` for Bastrop pilot address returns `siteContext.layers` with at least Regrid or FEMA when token/coverage allows.
- Research chat answer references parcel layer facts when present (not only code).
- Extension unchanged (consumes richer API automatically).

## Extension status (operator)

`P:\hauska-brief-extension` **v0.4.2** wires deep research to `/research/chat`. Reload extension, re-run brief on listing, then ask questions in deep research.
