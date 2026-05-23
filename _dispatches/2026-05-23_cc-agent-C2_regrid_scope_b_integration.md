---
id: 2026-05-23_cc-agent-C2_regrid_scope_b_integration
title: SCOPE B — Regrid adapter integration (cc-agent-C2)
status: fired
fired_at: 2026-05-23
agent: cc-agent-C2
repo: legacy-design-tools (dedicated clone at P:\legacy-design-tools-c2)
related: [40d_cortex_site_context_sprint, 43_cortex_qa_backlog, 46_smartcity_parcel_intelligence, _sessions/2026-05-23_regrid_eval_scope_a_cc-agent-C2.md, _sessions/2026-05-23_regrid_eval_scope_a_cc-agent-C.md, _research/2026-05-23_regrid_openapi_v2.yaml, _decisions/2026-05-23_partnership_first_scoping.md]
---

# SCOPE B — Regrid adapter integration

## Background

Cortex needs a national parcel + zoning baseline. Two independent recons (cc-agent-C + cc-agent-C2) converged on Regrid. Operator approved Regrid pick 2026-05-23 + provisioned `REGRID_API_KEY` Cloud Run secret with IAM binding to cortex-api runtime SA (`1062716564162-compute@developer.gserviceaccount.com`, `roles/secretmanager.secretAccessor`). Partnership-first commitment scoped 2026-05-23 (decision record at [`_decisions/2026-05-23_partnership_first_scoping.md`](../_decisions/2026-05-23_partnership_first_scoping.md)) so national public-records aggregation is now explicitly in-doctrine for Cortex baseline sourcing.

Reference docs:

- OpenAPI spec — [`_research/2026-05-23_regrid_openapi_v2.yaml`](../_research/2026-05-23_regrid_openapi_v2.yaml)
- SCOPE A recon — [`_sessions/2026-05-23_regrid_eval_scope_a_cc-agent-C2.md`](../_sessions/2026-05-23_regrid_eval_scope_a_cc-agent-C2.md) (cc-agent-C2's own; includes 8 contract points)
- SCOPE A recon — [`_sessions/2026-05-23_regrid_eval_scope_a_cc-agent-C.md`](../_sessions/2026-05-23_regrid_eval_scope_a_cc-agent-C.md) (cc-agent-C's convergent recon; ATTOM-structural-wrong analysis + Utah caveat + payload.parcel/zoning key-alias requirements)

## Scope (8 contract points, from cc-agent-C2's SCOPE A)

1. **Adapter placement** — `lib/adapters/src/national/regrid.ts`. Add `"national"` to `AdapterTier` or treat as federal-tier (cc-agent-C2's call).
2. **Two adapters** — `regrid:parcels` + `regrid:zoning`, mirrors the per-layer split (UI tier-toggles stay per-layer; one upstream call regardless via shared HTTP cache).
3. **Payload shape** — Extend `overlays.ts.extractBriefingSourceOverlays(sources)` to recognize GeoJSON Polygon/MultiPolygon under `payload.parcel.geometry.type === "Polygon"`. Cleaner long-term than per-adapter GeoJSON → ArcGIS-rings conversion (future national adapters will mostly emit GeoJSON). Add 3-5 test cases on existing overlays test suite. Alternative: 30-line GeoJSON → ArcGIS-rings helper inside adapter — both work; cc-agent-C2's call.
4. **Provenance mapping**:
   - `briefing_sources.snapshot_date` ← Regrid `ll_last_refresh`
   - `briefing_sources.provider` ← `"Regrid"` or `"Regrid (via <source-county>)"`
   - `briefing_sources.layer_kind` ← `"regrid-parcel"` / `"regrid-zoning"`
   - `briefing_sources.source_kind` ← new value `"national-aggregator"` (cleaner than reusing `"federal-adapter"`)
5. **Cache** — existing 24h Postgres `adapter_response_cache` + 15-min in-memory cache (PR #94 pattern) apply unchanged.
6. **Runner wiring** — Regrid fires for ALL geocoded engagements as baseline; per-county adapters gate behind `partner_city = true` flag on engagement jurisdiction. Bastrop TX `partner_city = true`; Grand County UT currently `false` — so under SCOPE B Grand County adapters DEPRECATE as baseline (kept in tree, gated off). Doc-comment header marks "deprecated as baseline".
7. **Tests** (minimum 6): happy path, no-coverage (Utah trial exclusion → `no-coverage` envelope not hard error), upstream-error (timeout/5xx/malformed), cache hit, partner-city enrichment (per-county + Regrid both fire), non-partner skip.
8. **Env var** — `REGRID_API_KEY` as Cloud Run secret (provisioned 2026-05-23). Adapter reads via `process.env.REGRID_API_KEY`; missing key → adapter disabled (logged warn) rather than runtime error.

## Trial-tier caveat

Regrid trial token is restricted to 7 counties; UT not in default list (per cc-agent-C's recon — sandbox trial-county list checked against documented UT data store page). Operator OK upgrading paid plan post-integration. SCOPE B's `no-coverage` envelope must handle the out-of-coverage error response cleanly (treat as `no-coverage` not as hard failure) so the integration ships without requiring an immediate plan upgrade.

## Consumer-side contract (from cc-agent-C audit)

`overlays.ts` is the ONE structured consumer (`lib/site-context/src/client/overlays.ts`). `briefing-engine/src/prompt.ts` treats payload as opaque JSON (caps at 4000 chars, hands to Claude — no structured-field requirement). `artifacts/api-server/src/atoms/briefing-source.atom.ts` is shape-only, no payload schema enforcement. Site-topography ingest (Phase 2D.1.2) needs parcel boundary geometry, format-agnostic. So the vendor-format question reduces to "does `overlays.ts` need a GeoJSON branch?" → yes, point 3 above handles it.

`payload.parcel.attributes` requires one of `PARCEL_ID_KEYS` + one of `PARCEL_ACRES_KEYS`; `payload.zoning.attributes` requires one of `ZONING_CODE_KEYS` + one of `ZONING_DESC_KEYS` (per `_payloadSummaryHelpers.ts:88-107`). SCOPE B can either map Regrid native names (`parcelnumb` / `gisacre` / `zoning` / `zoning_description`) to existing pilot-county aliases or extend the key-alias arrays — both work, cc-agent-C2's call.

## Sequencing

- Branch prefix `2d/` per parallel-agent hygiene (or `cortex/scope-b-regrid` — cc-agent-C2's call).
- Phase 2D.1 PR 2 (USGS 3DEP DEM raster client extension; was paused for SCOPE A eval) resumes after SCOPE B ships. Sequencing makes 2D.1 PR 2 read from the national parcel baseline rather than per-jurisdiction fallback (simpler integration path).
- Bounded overlap with cc-agent-C: cc-agent-C2 owns `lib/adapters/src/national/*` + `overlays.ts`; cc-agent-C owns `lib/adapters/src/runner.ts` + `lib/adapters/src/federal/fcc-broadband.ts` (FCC drop scope) — file paths disjoint; `runner.ts` only touched by C this round.

## Report

cc-agent-C2 writes session report to `_inbox/` per HR-11 courier protocol. Planner files into doc set on next sweep.
