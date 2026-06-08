---
id: 2026-06-07_legacy-design-tools_cc-agent-C_subsurface_data_layer
title: Inbox — subsurface data layer (cc-agent-C)
date: 2026-06-07
agent: cc-agent-C
repo: legacy-design-tools
branch: cortex/subsurface-data-layer
sha: 907fdf6496251eeb65c625fd779d952b4169d230
model: Grok Build 0.1 (https://api.x.ai/v1)
dispatch: _dispatches/2026-06-07_cc-agent-C_subsurface_data_layer.md
status: complete — PR held for operator merge
---

# Subsurface data layer — cc-agent-C report

## Workspace gate (verbatim)

```
On branch cortex/brief-service-endpoint-exposure
Your branch is up to date with 'origin/cortex/brief-service-endpoint-exposure'.

Changes not staged for commit:
	modified:   .claude/worktrees/recon-add-jurisdiction (untracked content)
	modified:   .claude/worktrees/track-b-ifc-ingest (modified content, untracked content)

commit 13e568fcad001f361633936bac34f31e4f2bf56f
commit ecf0e4847572bbdc3e1d5adc80063a71d5d6262b
commit 96b81bf597a6b0f83a6a58ce7c27088725d6427f
```

**Assessment:** Submodule-only dirt in `.claude/worktrees/*` — no `lib/adapters` or finding-engine changes. Proceeded on fresh branch `cortex/subsurface-data-layer` from `origin/main` (6182dbd). cc-agent-C2 c2 clone untouched.

## Atom refs touched

- `current-state:portfolio` — Wave 1 subsurface workstream landed
- `sprint:55` — Section 6 / workstream 4 (subsurface)
- `product:cortex` — site-context adapters in `@workspace/adapters`

## Deliverables

| Adapter key | Layer kind | Source | Freshness (months) | No-coverage behavior |
|---|---|---|---|---|
| `usda:ssurgo-soils` | `usda-ssurgo-soils` | gSSURGO MapServer + SDA tabular | 24 | `no-coverage` when unmapped; off-US gated by `appliesTo` |
| `usgs:geology` | `usgs-geology` | USGS SGMC FeatureServer/3 | 24 | `no-coverage` off CONUS / empty intersect |
| `usgs:groundwater` | `usgs-groundwater` | NWIS site + IV (parm 72019) | 12 | `ok` + `wellCount:0` note when no wells nearby |
| `usgs:seismic` | `usgs-seismic` | ASCE7-22 designmaps + QFaults | 24 | `no-coverage` when designmaps returns error envelope |

All four registered in `FEDERAL_ADAPTERS` (default on). Federal-tier → `FEDERAL_TIER_CACHE_PREDICATE` → 24h `adapter_response_cache` via existing runner/api-server path.

## Adapter contract (verbatim summary)

From `lib/adapters/src/types.ts`:

- **`Adapter`**: `adapterKey`, `tier`, `sourceKind`, `layerKind`, `provider`, `jurisdictionGate`, `appliesTo(ctx)`, optional `timeoutMs`, `run(ctx) → AdapterResult`, optional `getUpstreamFreshness`.
- **`AdapterResult`**: persisted fields aligned with `briefing_sources` (`adapterKey`, `tier`, `layerKind`, `sourceKind`, `provider`, `snapshotDate`, `payload`, optional `note`).
- **`AdapterRunError(code)`**: `no-coverage` → runner status `no-coverage` (neutral pill); other codes → `failed`.
- **Runner** (`runAdapters`): per-adapter isolation; skipped adapters + thrown `no-coverage` both render neutral pills; federal tier cache via `(adapterKey, latRounded5, lngRounded5)`.

## Files changed (lib/adapters only)

- `lib/adapters/src/federal/_federalGeocodeGate.ts` — shared geocode / CONUS / US envelopes
- `lib/adapters/src/federal/usda-ssurgo.ts`
- `lib/adapters/src/federal/usgs-geology.ts`
- `lib/adapters/src/federal/usgs-groundwater.ts`
- `lib/adapters/src/federal/usgs-seismic.ts`
- `lib/adapters/src/registry.ts`
- `lib/adapters/src/federal/summaries.ts` — chips + freshness thresholds
- `lib/adapters/src/__fixtures__/federalFixtures.ts`
- `lib/adapters/src/__tests__/subsurfaceAdapters.test.ts`

## Verification artifacts (HR-8)

```text
pnpm --filter @workspace/adapters test
 Test Files  18 passed (18)
      Tests  277 passed (277)

pnpm --filter @workspace/adapters exec tsc -p . --noEmit
(exit 0)
```

New suite: 13 tests in `subsurfaceAdapters.test.ts` — SSURGO Central Texas hit, no-coverage, off-US gate, cache replay; geology CONUS/off-CONUS; groundwater hit + zero-well ok path; seismic hit + no-coverage; registry membership.

## Live endpoint recon

Workstation egress to federal hosts returned curl exit 35 (TLS/connect) during this run — live probes blocked. Endpoints coded from dispatch + USGS/USDA public docs:

| Layer | Endpoint |
|---|---|
| SSURGO map unit | `https://nrcsgeoservices.sc.egov.usda.gov/arcgis/rest/services/soils/gssurgo/MapServer/0` |
| SSURGO tabular | `https://sdmdataaccess.sc.egov.usda.gov/tabular/post.rest` |
| Geology | `https://services.arcgis.com/v01gqwM5QqNysAAi/arcgis/rest/services/SB_5888bf4fe4b05ccb964bab9d_USGS_SGMC_feature/FeatureServer/3` |
| Groundwater sites | `https://waterservices.usgs.gov/nwis/site/` (bBox + siteType=GW) |
| Groundwater IV | `https://waterservices.usgs.gov/nwis/iv/` (parameterCd=72019) |
| Seismic design | `https://earthquake.usgs.gov/ws/designmaps/asce7-22.json` |
| Faults | `https://earthquake.usgs.gov/arcgis/rest/services/haz/Qfaults/MapServer/0` |

**Operator QA:** Generate Layers on a Bastrop engagement (`30.1105, -97.3186`) after merge; confirm SSURGO + SGMC + seismic rows populate.

## PR (held)

- **Branch:** `cortex/subsurface-data-layer`
- **SHA:** `907fdf6496251eeb65c625fd779d952b4169d230`
- **Create PR:** https://github.com/empressaioemail-tech/legacy-design-tools/pull/new/cortex/subsurface-data-layer
- **Merge:** operator — do not auto-merge

## Staged follow-ons (out of scope this wave)

- Karst / sinkhole / liquefaction rasters
- MCP tool wraps (cc-agent-M)
- pysheds / Cloud Run bake (WS7 in spine doc)

## Blockers

None. Submodule dirt in `.claude/worktrees/*` pre-existing; not in commit scope.

## Escalation

None — Grok Build 0.1 completed without Claude escalation.
