---
id: 2026-06-11_engine_cut_live_master_plan_robustness_audit_claude_code
title: Session — engine cut flipped fully live in prod (4 engines), 10-engine robustness audit, property-intelligence master plan, C3 merged
date: 2026-06-11
kind: session
applies_to: portfolio
related: [00_current_state, 61_property_intelligence_master_plan, _research/2026-06-11_engine_robustness_audit, 58_gtm_readiness_sprint, 56_engine_extraction_sprint, 80_adrs/adr_008_engine_factor_out, 77b_cotality_integration_strategy, 08_tiered_access_model]
---

# Session summary

## Arc

Opened to verify the findings-on-spine canary (the engine cut was a staged 0% canary) and became a full-day arc that flipped the entire ADR-008 engine cut live in production, ran a 10-engine adversarial robustness audit, authored the governing property-intelligence master plan (including the Cotality every-SKU adoption plan with Regrid dropped), and landed C3 (thin cortex-api). The cut was flipped app-by-app, one engine at a time, on a 0% canary with verification before each shift; that discipline caught five integration bugs on the canary, none of which reached production.

## What shipped (legacy-design-tools unless noted)

**The engine cut — flipped fully live in prod, app-by-app.** All four reasoning engines now run on `engine-api` (the spine) over the gate-front seam: findings, briefing, hydrology (drainage + rainfall), topography (DEM). Prod `cortex-api-00169-jep` @ 100%. Flip-blockers caught on the canary and fixed:
- **#171** findings persist — spine returns ISO-string timestamps, drizzle expects `Date` (`rehydrateSpineFindingsResult`).
- **#172** jurisdiction key synthesis — any city resolves a synthesized key so unwarmed jurisdictions web-ground on demand; scoped to the finding path so coverage stays `not_in_catalog` and the honest banner is preserved.
- **#173** provenance read — citation atom-ids partitioned by namespace so `reasoning:*` ids no longer hit the UUID `code_atoms` query (was 500ing the findings list).
- **#175** briefing date rehydration (the date bug is systemic to the spine seam, fixed per-engine; #175's hydro/topo audit confirmed those routes carry no drizzle-timestamp date field).
- **#176** fold site-topography (catchment DEM) ingest into generate-layers + honest drainage-422 message (drainage requires the DEM, which only a separate route produced).
- **#177** reproject ArcGIS/UGRC parcel geometry Web Mercator -> WGS84 before the DEM bbox (Regrid emitted WGS84 and masked this; dropping Regrid for UGRC/Cotality exposed it).

**Durability + warmth.** **#174** baked the findings flags into `cloud-run-deploy.yml`; **#178** completed the bake (all five `ENGINE_SPINE_*` flags) — the cut is fully clobber-proof (the line-204 `--set-env-vars`-replaces-everything class bit three times before the bake). Mirrored secret `HAUSKA_ENGINE_API_KEY` into `legacy-design-tools-prod`, IAM-bound to the api-server-runtime SA. Set `engine-api` `min-instances=1` (warm, no cold starts). Hydrology became a fix, not just topology: `engine-api`'s Dockerfile pip-installs pysheds (verified on hauska-engine main), unlike the cortex image (which the audit found never installs it and silently falls back to broken native-D8).

**C3 — thin cortex-api (#179, merged, NOT deployed).** Recon-first; conservative. Removed only the dead `useSpine*` flag-off branches in cortex-api so the spine path is unconditional; kept the adapter pack (`lib/adapters` + generate-layers, still cortex-side BFF data-fetching) and the engine packages (`lib/finding-engine`/`lib/briefing-engine`/`lib/site-context`, still imported by eval + intake). Added a no-ungated-path CI test and honest engine-unreachable errors on all four paths (no silent empty success). typecheck + unit tests green; full-product regression is CI/operator-gated (no local DATABASE_URL). Merged to main but prod stays on the pre-C3 `00169` — the next deploy activates C3.

## Prod soak (verified clean)

All four engines exercised under real prod traffic, **zero ERROR-level logs**, every `/v1/*` call 200. Latencies: findings ~19s, briefing ~29s (LLM-bound, acceptable), DEM ~1.2s, rainfall ~3.6s, **drainage ~100s (the lone outlier — logged to 61 Wave 2 for profiling)**. The five bug fixes are holding in production.

## Governing artifacts authored

- **[`_research/2026-06-11_engine_robustness_audit.md`](../_research/2026-06-11_engine_robustness_audit.md)** — 10-engine adversarial robustness audit (11-agent workflow, ~1.1M tokens). Verdict: well-built per-engine, badly integrated at the seam. Three structural gaps: confidence asserted-not-earned on the read path (calibration computes `effectiveConfidence` but the wire never consults it; briefing/code-atom hardcode 1.0), silent degradation with `status:ok` the default idiom, non-uniform output contract (3 of 9 surfaces emit the envelope; chat emits none). The fix is one integration pass: a sealed `EngineEnvelope` at the gate-front seam. Includes the 13-item ranked backlog + the contract spec.
- **[`61_property_intelligence_master_plan.md`](../61_property_intelligence_master_plan.md)** — the governing execution board. Data-layer x analysis x tier inventory (five packages); the **Cotality every-SKU adoption plan (Regrid DROPPED**, Cotality the sole parcel/property spine plus minerals/O&G SpatialRecord, flood-depth forcing, insurability, MCP federation); a seam-first wave sequence: 0 flip (done) -> 1 seal the seam -> 2 fix -> 3 pour data -> 4 tier; the open backlog folded into a parallel track so nothing is dropped.

## Live-confirmed data-layer state (from the prod layer dump)

`fema:nfhl` + `epa:ejscreen` + `usgs:seismic` + `ugrc:dem`/`parcels` OK; `usda:ssurgo-soils` + `usgs:geology` + `usgs:groundwater` FAIL HTTP 400 (the audit's subsurface query-param bugs, confirmed live); all `cotality:*` `no-coverage` (keys not configured on the deployment — Cotality is built-but-unwired); `regrid:*` failed (being dropped). These corroborate the 61 matrix.

## Open / next (for the next planner)

1. **Do NOT redeploy cortex-api casually** — the next deploy activates C3 (thin BFF, no local fallback) AND proves the #178 bake durability. Before it: confirm CI full-product regression green, then deploy-canary + smoke (findings/briefing/drainage/DEM on the canary) before shifting, since the local regression couldn't run. This is the C3 go-live, effectively a second one-way-door checkpoint.
2. **Wave 1 — seal the seam** (the master plan's highest-leverage work): the sealed `EngineEnvelope` + wiring `effectiveConfidence` (calibrated confidence on the read path) + automated calibration recompute + the tenant-pool-leak fix. This is the audit's #1 and the structural-commitment-#2 fix.
3. **Wave 2 fixes** including drainage latency (~100s) profiling, precedence-fires-in-prod, data-vintage freshness.
4. **Minor open items:** generate-layers `forceRefresh` does not force a topography re-ingest (signature-keyed); a non-fatal `reviewer_requests` UPDATE failure fires on every generate-layers call (schema/migration drift, worth a look).
5. **Parallel track:** 413 upload fix, web-first coverage reframe, classification-off-mock, honest empty-state, grok-vs-anthropic findings A/B (now an engine-api decision).

## Deploy state at close

cortex-api `00169-jep` @ 100% (all four spine flags, manually applied; the workflow now bakes all five so the next deploy is durable). engine-api `00004-xpl` @ 100% (min-instances=1, anthropic findings + grok briefing, pysheds baked). C3 (#179) merged to main, NOT deployed. Rollback handles: `update-traffic --to-revisions cortex-api-00167-zac=100` (drop topo) or `…-00146-xul=100` (full pre-cut). 13 legacy-design-tools PRs this session (#169-#179 arc), all merged, zero open.
