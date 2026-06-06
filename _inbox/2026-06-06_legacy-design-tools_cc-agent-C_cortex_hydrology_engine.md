---
id: 2026-06-06_legacy-design-tools_cc-agent-C_cortex_hydrology_engine
title: Close — Cortex hydrology engine (40d 2D.2 + 2D.3)
date: 2026-06-06
agent: cc-agent-C
repo: legacy-design-tools
branch: cortex/hydrology-engine
base: main @ a17b38a
head: a17b38a (uncommitted working tree — see git status below)
kind: close
related: [40d_cortex_site_context_sprint, 77b_cotality_integration_strategy, 01a_atom_conventions, 80_adrs/adr_017_atom_access_control]
---

# Close — Cortex hydrology engine (cc-agent-C)

## Git hygiene (verbatim)

```
On branch cortex/hydrology-engine
Changes not staged for commit: (submodule noise in .claude/worktrees/* only)
Untracked + modified: hydrology engine files listed below — NOT YET COMMITTED
```

```
a17b38a Merge pull request #140 from empressaioemail-tech/cortex/extension-public-client-key
d4e2e5f Fix typecheck: restore gtmEvents import for rate-limit test
3f21a5b Replace flaky GTM DB poll with gtmPayloadWithClientTier unit assertion
```

**Branch:** `cortex/hydrology-engine` from `main` (independent of `cortex/cotality-adapter-scaffold`).

**PR:** Held for operator — no push/commit in this run.

---

## Atom refs (intended; Cortex MCP unavailable)

| Atom / doc | Status |
|---|---|
| `current-state:portfolio` | Cortex MCP errored at session start — used `40d_cortex_site_context_sprint.md` + repo recon instead |
| `site-context:cortex` | Phase 2D.1 `site-topography` ingest/materializer/routes reused as DEM spine |
| `parcel-briefing:round_rock_tx` | Test parcel geometry: 1904 Heathwood Cir (~30.509, -97.679) in ingest test fixture |

---

## Library choice — **pysheds** (not WhiteboxTools)

**Chosen:** [pysheds](https://github.com/mdbartos/pysheds) Python sidecar (`artifacts/hydrology-worker/run.py`).

**Why not WhiteboxTools:**
- WhiteboxTools ships a Rust/GDAL binary — heavier Cloud Run packaging for a Node api-server.
- pysheds covers 2D.2 (D8 flow dir, accumulation, catchment, river network) and a depression-ponding pass for 2D.3 with pure Python + NumPy.
- Matches the 40d spec's "Python subprocess from Node" pattern.

**Dual backend:**
- **Production path:** spawn `artifacts/hydrology-worker/run.py` via `lib/site-context/src/server/hydrologyWorkerClient.ts`.
- **CI / dev fallback:** inline TypeScript D8 engine `hydrologyNative.ts` when `SITE_DRAINAGE_NATIVE=1`, `NODE_ENV=test`, or Python sidecar fails.

---

## What landed

### Phase 2D.2 — drainage

- Python worker: `artifacts/hydrology-worker/` (pysheds, JSON stdio contract).
- TS D8 fallback: `lib/site-context/src/server/hydrologyNative.ts`.
- Worker client: `lib/site-context/src/server/hydrologyWorkerClient.ts`.
- Ingest: `artifacts/api-server/src/lib/siteDrainageIngest.ts` — reads catchment-clipped DEM from `site-topography` GCS ref, runs hydrology, emits atom event.
- Materializer: `artifacts/api-server/src/lib/siteDrainageMaterializer.ts`.
- Atom: `artifacts/api-server/src/atoms/site-drainage.atom.ts` — `tenant-private`, composes `engagement` + `site-topography` (ADR-011 pin).
- Routes:
  - `POST /api/engagements/:id/site-drainage/refresh`
  - `GET  /api/engagements/:id/site-drainage`
- DB: `lib/db/drizzle/0033_add_site_drainage_source_kind.sql` + schema/fixture CHECK widen.
- Map overlays: `lib/site-context/src/client/drainageOverlays.ts`, `hydrology` tier on `SiteMap`.

### Phase 2D.3 — rainfall simulation

- Forcing: `lib/site-context/src/server/noaaAtlas14.ts` + `rainfallForcing.ts`.
  - Manual depth (inches) wins.
  - NOAA Atlas 14 PFDS CGI (`hdsc.nws.noaa.gov/cgi-bin/new/cgi_readH5.py`) for 2/10/25/100/500-yr 24-hr depths.
  - `GET /api/engagements/:id/site-drainage/design-storms` exposes presets to the UI.
- **Cotality overlay hook (inert v1):** `CotalityFloodDepthForcing` + `cotalityDepthForReturnPeriod()` in `rainfallForcing.ts`; gated by `useCotalityForcing` (default false). Maps `estimatedFloodDepth50yr/100yr/500yr` from future `cotality:hazards` per 77b §2.
- Site tab UI: rainfall depth input, NOAA preset buttons, "Run drainage + rainfall sim" (`SiteTab.tsx`).

### Briefing integration

- `artifacts/api-server/src/lib/siteDrainageBriefing.ts` — post-processes sections B + E with `{{atom|site-drainage|<engagementId>|…}}` citations.
- Wired in `runBriefingGeneration` (`parcelBriefings.ts`) when a `site-drainage` materialized row exists.

---

## NOAA Atlas 14 integration shape

```typescript
// lib/site-context/src/server/noaaAtlas14.ts
buildPfdsUrl(lat, lng)
  → https://hdsc.nws.noaa.gov/cgi-bin/new/cgi_readH5.py?lat=…&lon=…&type=pf&data=depth&units=english&series=pds

fetchNoaaAtlas14PointEstimate({ lat, lng })
  → { source: "noaa-atlas-14-pfds", designStorms: [{ returnPeriodYears, durationHours: 24, depthInches }] }
```

Manual override: `POST …/site-drainage/refresh` body `{ manualDepthInches: 4 }`.

---

## Cotality overlay hook location (77b blend, not wired live)

| File | Symbol | Behavior |
|---|---|---|
| `lib/site-context/src/server/rainfallForcing.ts` | `CotalityFloodDepthForcing` | Shape for `floodDepthAtReturnPeriod.*` fields |
| same | `cotalityDepthForReturnPeriod()` | feet → inches by return period |
| same | `resolveRainfallForcing({ useCotalityForcing: true, cotalityForcing })` | Used when Cotality token clears |
| `artifacts/api-server/src/routes/siteDrainage.ts` | `useCotalityForcing` body flag | Passed through to ingest (default false) |

---

## Tests + typecheck

| Check | Result |
|---|---|
| `pnpm run typecheck` | **Green** |
| `lib/site-context` vitest (`hydrologyNative`, `noaaAtlas14`) | **Green** |
| `siteDrainageBriefing.test.ts` | **Green** |
| `site-drainage-atom.test.ts`, `site-drainage-ingest.test.ts` | Require `DATABASE_URL` (CI Test job); not run locally on cente (no `.env.local`) |
| Fixture | `artifacts/hydrology-worker/fixtures/sample_native_result.json` + sloped-grid unit test |

Smoke path (operator, with DB + GCS):
1. `POST …/site-topography/refresh` for engagement at 1904 Heathwood Cir.
2. `POST …/site-drainage/refresh` `{ "manualDepthInches": 4 }`.
3. Site tab → drainage overlays + rainfall panel summary.

---

## Blockers (verbatim)

- **Cortex MCP (`user-hauska-cortex`)** — errored at dispatch start; atom-first resolve skipped, docs used instead.
- **No commit / push / PR** — per dispatch "PR held for operator merge"; working tree uncommitted.
- **Local PG tests** — `DATABASE_URL` not set on cente workstation; integration tests expect CI test DB.
- **Python sidecar in prod** — Cloud Run image needs `artifacts/hydrology-worker/requirements.txt` installed + `HYDROLOGY_PYTHON` or `python3` on PATH; until then native D8 fallback runs automatically on sidecar failure.

---

## Key files (for review)

```
artifacts/hydrology-worker/run.py
artifacts/api-server/src/lib/siteDrainageIngest.ts
artifacts/api-server/src/atoms/site-drainage.atom.ts
artifacts/api-server/src/routes/siteDrainage.ts
lib/site-context/src/server/rainfallForcing.ts
lib/site-context/src/server/hydrologyNative.ts
lib/db/drizzle/0033_add_site_drainage_source_kind.sql
artifacts/design-tools/src/components/engagement-detail/SiteTab.tsx
```
