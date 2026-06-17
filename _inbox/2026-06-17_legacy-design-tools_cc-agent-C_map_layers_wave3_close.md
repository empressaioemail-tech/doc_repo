---
id: 2026-06-17_legacy-design-tools_cc-agent-C_map_layers_wave3_close
title: cc-agent-C close — map-layers wave-3 + BFF thin + task 11 consume
date: 2026-06-17
agent: cc-agent-C
repo: legacy-design-tools (+ hauska-engine wave-3 PR)
status: complete
---

# cc-agent-C — map layers wave-3 + BFF thin + task 11 — close report

## Summary

| Item | Status |
|------|--------|
| Wave-3 geometry (`floodway`, `dem`, `topography`, `opportunity-zone-tract`) | **Wired in hauska-engine** `mapLayersWave3.ts` — pending → ok |
| Cortex BFF proxy `POST /v1/map-layers/assemble` | `engineSpineMapLayers.ts` + `map-layers` package on spine client |
| Thin `generateLayers.ts` | Spine assemble when `ENGINE_API_URL` set; dedupes `cotality:parcels` / `fema:nfhl-flood-zone` / `cotality:zoning`; skips local topo sidecar when spine covers DEM/topo |
| Task 11 map-data consume | `POST /api/brokerage/v1/map-data` (Max tier) + `brokerageMapReasoningOverlays.ts` |
| Live OZ ingest | `ozTractIngest.ts` + `scripts/ingest-opportunity-zones.mjs` (HUD ArcGIS FeatureServer/13) |
| Live TX Comptroller ingest | `txSpecialDistrictIngest.ts` + `scripts/ingest-tx-special-districts.mjs` (data.texas.gov SPDPID) |

## Cross-repo

**hauska-engine** branch `feat/map-layers-wave-3-geometry` (separate PR required):
- `services/engine-api/src/lib/mapLayersWave3.ts`
- `services/engine-api/src/lib/opportunityZoneRegistry.ts`
- `packages/engine-core/src/map-layers/*` — `wave3` flag + `resolveWave3Slot` dep
- `data/opportunity-zones/oz-1.0.geojson` CI fixture

## Tests (verbatim)

```
pnpm run typecheck — pass

@hauska-engine/engine-core map-layers: 8/8 pass
@hauska-engine/engine-api map-layers HTTP: 4/4 pass

@workspace/api-server:
  brokerageMapReasoningOverlays.test.ts — 1/1
  ozTractIngest.test.ts — 1/1
  engineSpineClient.test.ts — 5/5
```

## PR

- **legacy-design-tools:** continues on `cortex/investor-radar-cotality-depth` → PR #185
- **hauska-engine:** `feat/map-layers-wave-3-geometry` (new PR — engine must merge before prod map-layers wave-3 is live)

## Follow-ups

- extension-agent: rough map render against `layers[].envelope` + `reasoningOverlays`
- Deploy: run ingest scripts (or CI job) to refresh OZ GeoJSON + SPDPID registry on cortex-api image
- Merge hauska-engine wave-3 PR before enabling spine-only generate-layers in prod
