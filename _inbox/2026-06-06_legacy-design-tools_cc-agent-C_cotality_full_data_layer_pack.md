# cc-agent-C deliverable — Cotality full data-layer pack (Phases 1-3)

**Repo:** `P:\legacy-design-tools`  
**Branch:** `cortex/cotality-adapter-scaffold`  
**PR:** https://github.com/empressaioemail-tech/legacy-design-tools/pull/141 (**HELD for operator merge**)  
**Head SHA:** `04671e4c1a4c79768319af387c36376645705a71`  
**Date:** 2026-06-06  
**Agent:** cc-agent-C (Cursor)

---

## Phase status

| Phase | Scope | Status |
|-------|-------|--------|
| **1 — Core** | parcels, zoning, property, climate | **Built + unit tests green**; live smoke **pending** (OAuth token) |
| **2 — RiskMeter breadth** | hazards, replacementcost | **Built + tests green**; live smoke **pending** |
| **3 — SpatialTile land records** | mineral (O&G), utility | **Built + tests green**; live smoke **pending** |
| **Deferred** | Location, InterChange, UWC, WVS, MCP | Not built (separate dispatches) |

---

## Adapter inventory (key / scheme / smoke)

| adapterKey | layerKind | Demo key(s) | OAuth scheme | liveSmokeStatus |
|------------|-----------|-------------|--------------|-----------------|
| `cotality:parcels` | cotality-parcel | PROPERTY + SPATIALTILE | property_auth | **pending** |
| `cotality:zoning` | cotality-zoning | PROPERTY | property_auth | **pending** |
| `cotality:property` | cotality-property | PROPERTY | property_auth | **pending** |
| `cotality:climate` | cotality-climate | PROPERTY + RISKMETER | property_auth + spatial_auth | **pending** |
| `cotality:hazards` | cotality-hazards | RISKMETER | spatial_auth | **pending** |
| `cotality:replacementcost` | cotality-replacement-cost | RISKMETER | spatial_auth | **pending** |
| `cotality:mineral` | cotality-mineral | SPATIALTILE | property_auth | **pending** |
| `cotality:utility` | cotality-utility | SPATIALTILE | property_auth | **pending** |

Payloads stamp `cotalityDemoApp`, `cotalityOAuthScheme`, `liveSmokeStatus` via `cotalityAdapterMeta()`.

---

## Architecture

- **`lib/adapters/src/national/cotalityClient.ts`** — shared OAuth (`scope=openid`, WAF-safe body), per-app token cache, CLIP geocode dedup, JSON fetch helpers, geometry normalization.
- **`lib/adapters/src/national/cotality.ts`** — Phase 1 parcel + zoning (Spatial Tile polygon + Property site-location).
- **`lib/adapters/src/national/cotalityExtended.ts`** — property, climate, hazards, replacementcost, mineral, utility.
- **`lib/adapters/src/__fixtures__/cotalityFixtures.ts`** — recorded fixtures per adapter family.
- **`lib/adapters/vendor/cotality/README.md`** — swagger drop zone (operator to populate).

**Token endpoint (confirmed in catalog):** `https://api.cotality.com/oauth/token`  
**NOT** `api-prod.corelogic.com` (prior guess corrected).

---

## 40d sim handoff — flood depth / extreme precip field shape

From `cotality:climate` and `cotality:hazards` payloads:

```json
{
  "floodDepthAtReturnPeriod": {
    "estimatedFloodDepth_50yr": 0.3,
    "estimatedFloodDepth_100yr": 0.8,
    "estimatedFloodDepth_250yr": 1.2,
    "estimatedFloodDepth_500yr": 1.8,
    "waterSurfaceElevation": 512.4,
    "groundElevation": 510.6
  },
  "extremePrecip": {
    "extremePrecipitation": { "current": { "aalRatio": 0.012, "riskScore": 42 } }
  }
}
```

Sources: RiskMeter `/us-inland-flood-cat-model` + Property CRA AR6 comprehensive (`extractClimateForcingFields()`).

---

## O&G app reconciliation flag

`cotality:mineral` payload includes:

> Operator has a separate existing O&G app — do not assume this Cotality SpatialRecord feed replaces it until reconciled.

Default tier: `SpatialRecordOGBasic` (override via `COTALITY_SPATIAL_OG_TIER`).

---

## Blockers (verbatim)

1. **Live OAuth token** — auth is the only blocker for live smoke; fixtures/tests pass with mocks. cortex-api has six creds mounted (`cortex-api-00119-laq`); token POST must succeed against `https://api.cotality.com/oauth/token` with `scope=openid`.
2. **Operator swagger drop** — `lib/adapters/vendor/cotality/` empty except README; normalization is defensive but portal swaggers will tighten field paths post-smoke.
3. **Endpoint confirmation** — defaults follow `_research/2026-06-06_cotality_api_surface_catalog.md`; operator should confirm paths on first 200.

---

## git status (verbatim)

```
On branch cortex/cotality-adapter-scaffold
Your branch is up to date with 'origin/cortex/cotality-adapter-scaffold'.

Changes not staged for commit:
	modified:   .claude/worktrees/recon-add-jurisdiction (untracked content)
	modified:   .claude/worktrees/track-b-ifc-ingest (modified content, untracked content)

no changes added to commit (use "git add" and/or "git commit -a")
```

## git log -3 (verbatim)

```
04671e4 feat(adapters): Cotality full data-layer pack (Phases 1-3)
ddb7029 feat(adapters): Cotality OAuth2 client_credentials rework (Property + SpatialTile demo apps)
2ba63f9 fix(portal-ui): pin system time in BriefingSourceHistoryPanel stale-range test
```

---

## Test output — `pnpm --filter @workspace/adapters test`

```
 Test Files  17 passed (17)
      Tests  264 passed (264)
   Duration  1.97s
```

New suites: `cotalityAdapters.test.ts` (5), `cotalityFullDataLayer.test.ts` (8).

## Typecheck — `pnpm run typecheck`

```
Exit code: 0
(all artifact typecheck jobs: Done)
```

---

## Operator-confirm endpoint constants

| Env var | Default |
|---------|---------|
| `COTALITY_TOKEN_URL` | `https://api.cotality.com/oauth/token` |
| `COTALITY_PROPERTY_BASE_URL` | `https://api.cotality.com/v2/properties` |
| `COTALITY_SPATIALTILE_BASE_URL` | `https://api.cotality.com/spatial-tile` |
| `COTALITY_RISKMETER_BASE_URL` | `https://api.cotality.com/riskmeter-api` |
| `COTALITY_SPATIAL_OG_TIER` | `SpatialRecordOGBasic` |
| `COTALITY_SPATIAL_UT_TIER` | `SpatialRecordUTBasic` |
| `COTALITY_AVM_MODEL` | `thvConsumers` |

**Smoke address:** `1904 Heathwood Cir, Round Rock, TX 78664`

---

## Out of scope (unchanged)

- Consumer extension display (`brokerageSiteContext.ts` logic untouched)
- Trestle / MLS / bulk
- Removing Regrid
- Location API, InterChange, UWC, WVS, MCP federation
