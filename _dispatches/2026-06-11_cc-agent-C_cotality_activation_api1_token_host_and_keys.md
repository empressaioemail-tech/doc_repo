---
id: 2026-06-11_cc-agent-C_cotality_activation_api1_token_host_and_keys
title: Dispatch — activate Cotality (per-product token host: Property -> api1) + operator key config
date: 2026-06-11
agent: cc-agent-C
repo: legacy-design-tools
kind: dispatch
status: FIRE-READY — vendor (Amanda Morris) re-confirmed the api1 token host + three-key isolation; demo runs to July 6
related: [77b_cotality_integration_strategy, _research/2026-06-06_cotality_api_surface_catalog, 61_property_intelligence_master_plan, 90_runbooks/cotality_mcp_setup]
---

# Activate Cotality — api1 token host + key config

> Cotality Data Implementation Services (Amanda Morris, 2026-06-11) re-confirmed the `InvalidClientIdentifier` fix: **Property API tokens must mint at `POST https://api1.cotality.com/oauth/token?grant_type=client_credentials`**, the platform enforces **strict product isolation** (Property key cannot call Spatial Tile or RiskMeter; each product app authenticates independently against its own endpoint), and **Property API products are included with the Property key**. Demo account valid through **July 6**. Our code defaults the token host to `api.cotality.com` (`lib/adapters/src/national/cotalityClient.ts:32-33`) — the wrong host — and the keys are not configured on the deployment (prod layer dump: `cotality:* no-coverage — COTALITY_PROPERTY_KEY/SECRET is not configured`). This wires the correct per-product token host and lands Property first; Spatial Tile + RiskMeter follow once their token hosts are confirmed from their Swagger tiles. Matches memory `cotality-oauth-three-keys`.

You are **cc-agent-C**, single owner of `P:\legacy-design-tools`. Worktree off `origin/main`. Branch prefix `cortex/`. Model: Grok Build 0.1; escalate on failure after retry. HR-8 artifacts.

## Code change (cc-agent-C)

The token endpoint is a single `COTALITY_TOKEN_URL_DEFAULT = https://api.cotality.com/oauth/token` with one `COTALITY_TOKEN_URL` override (`cotalityClient.ts:32-43`). The three-key isolation model means each product needs its own token endpoint. Make the token host **per-product**:
- Property -> `https://api1.cotality.com/oauth/token?grant_type=client_credentials` (vendor-confirmed).
- Spatial Tile / RiskMeter -> their own token hosts (confirm from each product's Swagger tile in the dev portal; the api surface catalog at [`_research/2026-06-06_cotality_api_surface_catalog.md`](../_research/2026-06-06_cotality_api_surface_catalog.md) notes RiskMeter uses `spatial_auth`, Property/SpatialTile use `property_auth`). Until confirmed, default Spatial Tile/RiskMeter to their documented hosts and gate behind their own env override.
- Keep the override env per product (e.g. `COTALITY_PROPERTY_TOKEN_URL`, `COTALITY_SPATIALTILE_TOKEN_URL`, `COTALITY_RISKMETER_TOKEN_URL`) so hosts can be corrected without a redeploy.
- Send a real User-Agent + `Content-Length: 0` handling per the catalog's WAF note (Incapsula rejects body-less POSTs with 411).

Property is the priority (Amanda confirmed it is provisioned + included). Get Property minting + a Property call green first; Spatial Tile (parcel polygon + O&G minerals) and RiskMeter (flood depth + hazards) are fast-follows on the same pattern.

## Operator step (Nick — provides the keys)

Set the Cotality demo key/secret pairs as secrets on `cortex-api` (`legacy-design-tools-prod`). Per the explicit-placeholder convention, paste the real values into shell vars, echo lengths, then set. At minimum for Property-first:
```
COTALITY_PROPERTY_KEY, COTALITY_PROPERTY_SECRET   (the Property demo app: consumer key ...UkA, nick@hauska.io)
COTALITY_PROPERTY_TOKEN_URL = https://api1.cotality.com/oauth/token?grant_type=client_credentials
(COTALITY_PROPERTY_BASE_URL only if overriding the default)
```
Then Spatial Tile + RiskMeter pairs when activating those. Planner can run the `gcloud run services update cortex-api --update-secrets/--update-env-vars` once Nick supplies the values (do not commit secrets).

## Acceptance

- Property token mints at `api1.cotality.com` (no `InvalidClientIdentifier`); a Property call (`/v2/properties/search/geocode` -> `{clip}/property-detail` or `site-location`) returns 200 on a real parcel.
- `generate-layers` on a parcel flips `cotality:property` (and `cotality:parcels`/`zoning` as wired) from `no-coverage` to `ok`. Paste the verbatim layer-run line.
- Product isolation respected: Property key only hits Property endpoints; Spatial Tile/RiskMeter use their own keys + hosts.
- Honesty: Cotality data carries provenance + the floor-priced-pass-through framing (sell reasoning, not raw data) per `08`/`14`; do not double-bill flood (FEMA stays free baseline, Cotality climate is premium).
- Typecheck + tests green; PR held for operator merge; HR-8 artifacts.

## Reporting

Write to `P:\doc_repo\_inbox\` as `2026-06-11_legacy-design-tools_cc-agent-C_cotality_activation_fix.md`: the per-product token-host change (file:line), the verbatim Property token mint + Property call smoke, the generate-layers `cotality:*` status flip, which products are live vs pending-host-confirm, PR URL + SHA, blockers.
