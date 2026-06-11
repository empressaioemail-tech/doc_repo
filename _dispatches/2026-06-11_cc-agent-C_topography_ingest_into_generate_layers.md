---
id: 2026-06-11_cc-agent-C_topography_ingest_into_generate_layers
title: Dispatch — fold site-topography (catchment DEM) ingest into generate-layers + fix the silent drainage 422
date: 2026-06-11
agent: cc-agent-C
repo: legacy-design-tools
kind: dispatch
status: FIRE-READY — unblocks the hydrology flip verification + a real UX gap (drainage button silently no-ops)
related: [58_gtm_readiness_sprint, 61_property_intelligence_master_plan, _research/2026-06-11_engine_robustness_audit]
---

# Fold site-topography ingest into generate-layers + fix the silent drainage 422

> Surfaced verifying the hydrology flip on the canary (Moab engagement `409a3013-273f-4871-b799-bc08def01cec`). Clicking "Run drainage + rainfall sim" appears to do nothing; it actually fires `POST /api/engagements/:id/site-drainage/refresh` which returns **422** with reason `"No site-topography ingest — run POST /api/engagements/:id/site-topography/refresh first."` (`lib/siteDrainageIngest.ts:160-162`). The drainage pass runs on the catchment DEM, and the DEM is produced by `ingestSiteTopography` (`lib/siteTopographyIngest.ts:733`), which `generate-layers` never calls. So the architect runs "Generate Layers" (the adapter pack: FEMA/EPA/SSURGO/USGS/Cotality/UGRC), gets map layers, and drainage still 422s because no catchment DEM exists. Operator intent: **topography ingest should be part of the refresh-layers function.**

You are **cc-agent-C**, single owner of `P:\legacy-design-tools`. Worktree off `origin/main`. Branch prefix `cortex/`. Model: Grok Build 0.1; escalate on failure after retry. HR-8 verbatim artifacts.

## Scope

### 1. Run site-topography ingest as part of generate-layers (the fix)

In `artifacts/api-server/src/routes/generateLayers.ts`, the handler runs `runAdapters(...)` (~line 606) and persists. After the adapter run, when the engagement has a resolved geocode (generate-layers already self-heals the geocode, ~line 460), **also call `ingestSiteTopography(...)`** (`lib/siteTopographyIngest.ts:733`, the same entry the `/site-topography/refresh` route uses at `routes/siteTopography.ts:142`) so the catchment DEM is produced as part of the layer refresh.

- **Best-effort, non-fatal:** mirror the adapter contract — a topography ingest failure must NOT fail the whole generate-layers run. Catch + log + continue.
- **Surface it as a run outcome:** add a topography line to the "Last Generate Layers run" result (e.g. `usgs:3dep-dem ok` / `failed` / `no-coverage`) so the architect sees it alongside the adapters.
- **Idempotent / cached:** do not re-ingest a heavy DEM on every click if a current topography row exists and the parcel/geocode is unchanged; reuse the existing row (the materializer/replay path at `routes/siteTopography.ts:192-216` shows the active-row pattern). `forceRefresh=true` should re-ingest.
- **Spine-flag transparent:** `ingestSiteTopography` already respects `ENGINE_SPINE_TOPOGRAPHY` (routes to engine-api when set, local otherwise). Call it the same way regardless; this dispatch does not change the topography spine routing.

### 2. Fix the silent drainage 422 (the UX gap)

The "Run drainage + rainfall sim" button swallows the 422 and shows nothing — an audit-flavored silent-failure. Surface the precondition: on a `no-topography` 422 from `site-drainage/refresh`, the FE should show a clear message ("Generate site layers/topography first, then run drainage") rather than no-op. With fix #1, a prior Generate Layers will normally have produced the DEM, so this becomes the rare fallback, but the honest message stays.

## Acceptance

- On a geocoded engagement (e.g. Moab `409a3013-...`), clicking **Generate Layers** produces a site-topography ingest (a `site-topography` row + DEM in GCS); the run result shows a topography outcome line.
- Immediately after, **Run drainage + rainfall sim** succeeds (no 422); `GET /site-drainage` returns the drainage result. Paste the verbatim log showing the topography ingest + the drainage run reaching `POST /v1/hydrology/drainage` on engine-api (canary has `ENGINE_SPINE_HYDROLOGY=1` staged).
- Topography ingest failure does not fail the generate-layers run (best-effort verified).
- Drainage button surfaces the precondition message on a `no-topography` 422 instead of silently no-op-ing.
- Typecheck + tests green; PR held for operator merge; HR-8 artifacts.

## Out of scope (separate, tracked in 61)

The adapter failures visible in the same run are NOT this dispatch: `usda:ssurgo-soils` / `usgs:geology` / `usgs:groundwater` HTTP 400 (the subsurface adapter query-param bugs from the audit, Wave 2/3); `cotality:*` `no-coverage` (keys not configured on the deployment — Cotality wiring, Wave 3); `regrid:*` failed (Regrid is being dropped). Leave all of these alone.

## Reporting

Write to `P:\doc_repo\_inbox\` as `2026-06-11_legacy-design-tools_cc-agent-C_topography_into_generate_layers_fix.md`: fix locations (file:line), the generate-layers + drainage verbatim run logs, PR URL + SHA, blockers.

## Post-merge (planner/operator)

Merge → build → deploy-canary (findings flags baked; briefing/hydro still staged manually on canary) → re-stage `ENGINE_SPINE_BRIEFING` + `ENGINE_SPINE_HYDROLOGY` on the canary → Generate Layers on a Moab engagement → run drainage → confirm `POST /v1/hydrology/drainage 200` AND the `library` field (pysheds vs native-d8 — the audit's pysheds-on-spine verification). Then shift + append `ENGINE_SPINE_HYDROLOGY` to the workflow.
