---
id: 2026-06-06_cc-agent-C_cotality_oauth_rework
title: Dispatch — Cotality adapter OAuth2 client_credentials rework (PR #141)
date: 2026-06-06
agent: cc-agent-C
repo: legacy-design-tools
kind: dispatch
status: complete
related: [76c_operator_master_next_steps, 77b_cotality_integration_strategy, _decisions/2026-06-06_cotality_parcel_provider, _dispatches/2026-06-06_cc-agent-C_cotality_adapter_scaffold, _inbox/2026-06-06_legacy-design-tools_cc-agent-C_cotality_oauth_rework]
---

# Cotality adapter OAuth2 rework (PR #141)

Issued in chat by the operator 2026-06-06 and recorded here for the dispatch/close-note pairing. Reworks the PR #141 parcel/zoning adapter from the provisional single `COTALITY_API_KEY` + `?apikey=` query-param model to the real CoreLogic Developer Platform (Apigee) **OAuth2 `client_credentials`** model. Completed same day; close note: [`_inbox/2026-06-06_legacy-design-tools_cc-agent-C_cotality_oauth_rework.md`](../_inbox/2026-06-06_legacy-design-tools_cc-agent-C_cotality_oauth_rework.md).

## Why

The demo keys are three separate Apigee apps, each a consumer key (client_id) + secret (client_secret) exchanged for a short-lived bearer token, not a single API key. Six values are mounted on cortex-api (`cortex-api-00119-laq`):

| App | Env vars | Used by |
|---|---|---|
| Property | `COTALITY_PROPERTY_KEY` / `_SECRET` | parcel attrs + zoning |
| SpatialTile | `COTALITY_SPATIALTILE_KEY` / `_SECRET` | parcel polygon geometry |
| RiskMeter | `COTALITY_RISKMETER_KEY` / `_SECRET` | reserved (climate layer) |

## Scope delivered

OAuth2 token helper (`grant_type=client_credentials`, form-urlencoded `client_id`/`client_secret`), per-app token cache to ~60s before expiry, bearer on Property + SpatialTile GETs, no-creds → clean Regrid fallback, GeoJSON contract and `overlays.ts`/`brokerageSiteContext.ts` unchanged. Endpoint constants env-overridable.

## Outcome

PR #141 updated in place, HEAD `ddb7029`, **held for operator merge**. 262/262 adapter tests green, `pnpm run typecheck` exit 0.

## Operator gate before merge

Confirm five endpoint constants from the developer.corelogic.com API DOCUMENTATION tab and the OAuth body format, set env overrides on cortex-api if defaults differ, then smoke 1904 Heathwood Cir. Defaults: `COTALITY_TOKEN_URL=https://api-prod.corelogic.com/oauth/token`, `COTALITY_PROPERTY_BASE_URL=.../property/v2`, `COTALITY_SPATIALTILE_BASE_URL=.../spatialtile/v1`, `COTALITY_PROPERTY_POINT_PATH=/point`, `COTALITY_SPATIALTILE_POINT_PATH=/point`.
