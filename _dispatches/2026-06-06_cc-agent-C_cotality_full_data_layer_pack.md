---
id: 2026-06-06_cc-agent-C_cotality_full_data_layer_pack
title: Dispatch — Cotality full data-layer pack (maximal ingest, gating deferred)
date: 2026-06-06
agent: cc-agent-C
repo: legacy-design-tools
kind: dispatch
related: [_research/2026-06-06_cotality_api_surface_catalog, 77b_cotality_integration_strategy, 77_place_graph_strategy, 76c_operator_master_next_steps, 20_agent_operating_rules, _dispatches/2026-06-06_cc-agent-C_cotality_oauth_rework, _dispatches/2026-06-06_cc-agent-C_cotality_property_layer, _dispatches/2026-06-06_cc-agent-C_cotality_climate_layer]
---

# Cotality full data-layer pack

You are **cc-agent-C**, single owner of `P:\legacy-design-tools` for this run.

Operator directive (2026-06-06): **pack the data layer with as much Cotality data as we can; gating/licensing decided later.** Build the full adapter set against the swaggers and fixtures now; live smoke flips on once the OAuth token works (auth is the only blocker, tracked in the oauth-rework dispatch). Consolidates and extends the earlier per-layer dispatches (parcel/property/climate).

## Authoritative reference

[`_research/2026-06-06_cotality_api_surface_catalog.md`](../_research/2026-06-06_cotality_api_surface_catalog.md) — full endpoint set, hosts, auth, demo-key→scheme map, place-graph plane mapping. Operator will drop de-duplicated swaggers into `lib/adapters/vendor/cotality/` (property-api-v2, spatial-tile, riskmeter; plus location, interchange, underwriting-center, wvs for later phases). Read it first.

## Model / hygiene

Grok Build 0.1 default per HR-12; api.x.ai/v1. Branch prefix `cortex/`; stack on `cortex/cotality-adapter-scaffold`. Refuse alien HEAD; verbatim `git status` + `git log -3`. PRs held for operator merge. Verbatim artifacts (HR-8).

## Shared design

Every adapter under `lib/adapters/src/national/`, same `siteContext.layers[]` port pattern as the existing `cotality.ts`, CLIP-joined, sharing one OAuth2 token helper (creds in body + `scope=openid` at `https://api.cotality.com/oauth/token`, real User-Agent, per-app token cache ~60s pre-expiry, WAF-safe non-empty body). Missing key → clean `no-coverage`, zero network, Regrid fallback intact. Per-app keys: `COTALITY_PROPERTY_*`, `COTALITY_RISKMETER_*`, `COTALITY_SPATIALTILE_*`. Endpoint constants env-overridable. One recorded fixture + unit tests per adapter; eligibility contract + package exports updated; full suite + `pnpm run typecheck` green.

**One safety line (not a gating decision):** do not surface Cotality-derived fields in the consumer extension (`brokerageSiteContext.ts` display path) until license terms clear — keep all new layers on the dev/internal tier. Internal data-layer ingest is in scope; consumer redistribution is the only thing held.

## Phase 1 — core (Property + SpatialTile + RiskMeter demo keys)

1. **`cotality:parcels` / `cotality:zoning`** (PR #141, rework done) — confirm against real endpoints; add the **polygon**: Spatial Tile `GET /spatial-tile/parcels?lat=&lon=&pageNumber=0&pageSize=1` → GeoJSON parcel boundary on `payload.parcel.geometry` (centroid fallback). Zoning from Property `/v2/properties/{clip}/site-location` `landUseAndZoningCodes`.
2. **`cotality:property`** (Carfax) — Property `/v2/properties/{clip}/property-detail` (owner, last sale, tax, characteristics) + `/avm/thv/{model}/summary` + `/transaction-history`.
3. **`cotality:climate`** — Property `/v2/properties/{clip}/climate-risk-analytics/ar6/comprehensive` (AR6 SSP scenarios + AAL/AEP/OEP/TVaR, horizons current/2030/2040/2050) AND RiskMeter `/riskmeter-api/climate-risk`. Expose extreme-precip / flood-depth-at-return-period as first-class fields for the 40d sim handoff.

## Phase 2 — RiskMeter hazard + cost breadth (RiskMeter key)

4. **`cotality:hazards`** — RiskMeter point endpoints: `flood-risk-score(-ffh)`, `flash-flood-risk-score`, `us-inland-flood-cat-model` (**flood depth @ 50/100/250/500-yr + water-surface elev** — hydrology forcing), `wildfire-risk`, `hail-risk`, `wind-risk-score`, `earthquake-risk-score`, `flood-zone-determination`, `first-floor-height`. Normalize each as a scored peril sub-layer; one adapter, multiple peril fields.
5. **`cotality:replacementcost`** — RiskMeter `residential-replacement-cost` + `commercial-replacement-cost` (reconstruction cost value; insurability + Cortex feasibility input).

## Phase 3 — land-record breadth (SpatialTile key)

6. **`cotality:mineral`** — Spatial Tile `SpatialRecordOGBasic|Premium|Pro` (parcel-linked oil & gas lease/well/production). Feeds the place-graph vertical/mineral estate plane ([77](../77_place_graph_strategy.md)) and the TX CRG minerals workstream. NOTE: operator has a separate existing O&G app to reconcile with this feed — flag in the close note; do not assume this replaces it.
7. **`cotality:utility`** — Spatial Tile `SpatialRecordUTBasic|Premium|Pro` (electric/water/gas/telecom infrastructure on parcel).

## Deferred (separate dispatches, noted not built here)

Location API parcel/structure WKT geometry; InterChange reconstruction components; Underwriting Center roof RCV; WVS weather verification; MCP federation (`mcp.cotality.com/mcp`). These need scheme provisioning beyond the three demo keys.

## Acceptance

Per-phase: adapters compile + register; no-key clean fallback; fixtures + unit tests green; typecheck green; PRs held. Each adapter records which demo key + scheme it uses and whether live smoke succeeded (per the token status). Build Phases 1-3 against swaggers/fixtures now; live-smoke as the token clears.

## Reporting

`P:\doc_repo\_inbox\2026-06-06_legacy-design-tools_cc-agent-C_cotality_full_data_layer_pack.md` — phase status, adapter list with key/scheme + smoke result, the flood-depth/precip field shape for the 40d handoff, the O&G-app reconciliation flag, and blockers verbatim.
