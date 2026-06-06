# cc-agent-C deliverable — Cotality OAuth2 rework (PR #141)

**Repo:** `P:\legacy-design-tools`  
**Branch:** `cortex/cotality-adapter-scaffold`  
**PR:** https://github.com/empressaioemail-tech/legacy-design-tools/pull/141 (updated in place; **HELD for operator merge**)  
**Head SHA:** `ddb70292d83795230aa68e9e59ebce249c60a7d0`  
**Date:** 2026-06-06  
**Agent:** cc-agent-C (Cursor)

---

## What changed

Replaced the incorrect `COTALITY_API_KEY` + `?apikey=` query-param scaffold with **OAuth2 `client_credentials`** per CoreLogic Apigee demo app:

| Demo app | Env vars | Used by |
|----------|----------|---------|
| Property | `COTALITY_PROPERTY_KEY` / `COTALITY_PROPERTY_SECRET` | Parcel attrs + zoning (`cotality:parcels` attrs, `cotality:zoning`) |
| SpatialTile | `COTALITY_SPATIALTILE_KEY` / `COTALITY_SPATIALTILE_SECRET` | Parcel polygon geometry (`cotality:parcels`) |
| RiskMeter | `COTALITY_RISKMETER_KEY` / `COTALITY_RISKMETER_SECRET` | **Unused** this PR (future climate layer) |

- `getCotalityAccessToken()` — POST `grant_type=client_credentials` (form-urlencoded `client_id`/`client_secret`), parse `access_token` + `expires_in`, cache per app until ~60s before expiry.
- Bearer `Authorization` on Property + SpatialTile GETs; no `?apikey=`.
- Missing required KEY/SECRET → `no-coverage`, zero network (Regrid fallback unchanged).
- Same GeoJSON `payload.parcel` / `payload.zoning` contract; `overlays.ts` / `brokerageSiteContext.ts` untouched.
- Fixed Node 24 unhandled-rejection quirk: return `promise.finally(...)` wrapper from token inflight dedup instead of attaching `.finally` to the raw returned promise.

**Commit:** `ddb7029` — `feat(adapters): Cotality OAuth2 client_credentials rework (Property + SpatialTile demo apps)`

---

## git status (verbatim)

```
On branch cortex/cotality-adapter-scaffold
Your branch is up to date with 'origin/cortex/cotality-adapter-scaffold'.

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
  (commit or discard the untracked or modified content in submodules)
	modified:   .claude/worktrees/recon-add-jurisdiction (untracked content)
	modified:   .claude/worktrees/track-b-ifc-ingest (modified content, untracked content)

no changes added to commit (use "git add" and/or "git commit -a")
```

## git log -3 (verbatim)

```
ddb7029 feat(adapters): Cotality OAuth2 client_credentials rework (Property + SpatialTile demo apps)
2ba63f9 fix(portal-ui): pin system time in BriefingSourceHistoryPanel stale-range test
bdda1db feat(adapters): Cotality parcel + zoning national adapters (Regrid port parity, COTALITY_API_KEY gated)
```

---

## Test output — `pnpm --filter @workspace/adapters test`

```
 Test Files  16 passed (16)
      Tests  262 passed (262)
   Duration  1.87s
```

Cotality suite (`cotalityAdapters.test.ts`): **11 passed** — covers OAuth token POST mock, bearer on API GETs, per-app token cache (one POST per app across repeated runs), creds-absent zero-network fallback, happy/parse/upstream-error/registry/merge cases.

## Typecheck — `pnpm run typecheck` (exact CI command)

```
> workspace@0.0.0 typecheck
> pnpm run typecheck:libs && pnpm -r --filter "./artifacts/**" --filter "./scripts" --if-present run typecheck

> workspace@0.0.0 typecheck:libs
> tsc --build

(all artifact typecheck jobs: Done)
Exit code: 0
```

---

## Operator must confirm from developer.corelogic.com API DOCUMENTATION

These env-overridable constants default to educated guesses. **Confirm each against the portal before live smoke:**

1. **`COTALITY_TOKEN_URL`** — Apigee OAuth2 token endpoint  
   - Default: `https://api-prod.corelogic.com/oauth/token`

2. **`COTALITY_PROPERTY_BASE_URL`** — Property API v2 base (parcel characteristics + zoning fields)  
   - Default: `https://api-prod.corelogic.com/property/v2`

3. **`COTALITY_SPATIALTILE_BASE_URL`** — Spatial Tile API base (parcel polygon)  
   - Default: `https://api-prod.corelogic.com/spatialtile/v1`

4. **`COTALITY_PROPERTY_POINT_PATH`** — lat/lng point lookup path appended to Property base  
   - Default: `/point`

5. **`COTALITY_SPATIALTILE_POINT_PATH`** — lat/lng point lookup path appended to SpatialTile base  
   - Default: `/point`

Also confirm from portal docs:
- OAuth body format (form `client_id`/`client_secret` vs HTTP Basic) — code uses form-urlencoded today.
- Sample Property v2 point request shape + response fields for normalization tuning.
- Sample Spatial Tile point request + geometry field path.

**Smoke address:** `1904 Heathwood Cir, Round Rock, TX 78664` (30.5083, -97.6789)

**Six creds already on cortex-api revision `cortex-api-00119-laq`.** After confirming URLs above, set env overrides on cortex-api if defaults differ, then run generate-layers smoke.

---

## Out of scope (unchanged)

- Trestle / MLS / bulk
- Removing Regrid
- Consumer extension display of Cotality fields (license gate)
- RiskMeter adapter wiring

---

## Files touched this rework

| File | Change |
|------|--------|
| `lib/adapters/src/national/cotality.ts` | OAuth2 helper, per-app cache, Property+SpatialTile fetch merge, endpoint constants |
| `lib/adapters/src/__tests__/cotalityAdapters.test.ts` | OAuth mocks, token cache, creds gate, existing parity cases |
