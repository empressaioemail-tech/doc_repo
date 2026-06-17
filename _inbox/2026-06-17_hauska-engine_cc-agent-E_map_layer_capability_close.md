---
id: 2026-06-17_hauska-engine_cc-agent-E_map_layer_capability_close
title: cc-agent-E close — map layer-data capability extraction (75i task 11)
date: 2026-06-17
agent: cc-agent-E
repo: hauska-engine
dispatch: 2026-06-17_cc-agent-E_map_layer_capability_extraction
status: complete — capability shell + contract; wave-3 geometry pending cc-agent-C
---

# cc-agent-E — map layer capability extraction — close report

**Dispatch:** [`2026-06-17_cc-agent-E_map_layer_capability_extraction`](../_dispatches/2026-06-17_cc-agent-E_map_layer_capability_extraction.md)  
**Decision:** [`_decisions/2026-06-17_map_extraction_shared_capability`](../_decisions/2026-06-17_map_extraction_shared_capability.md)  
**Seam seal:** satisfied (#72/#183) — all layers ride nested `EngineEnvelope`.

---

## Capability contract

| Item | Value |
|------|-------|
| **Endpoint** | `POST /v1/map-layers/assemble` |
| **Contract discovery** | `GET /v1/map-layers/contract` |
| **Gate package id** | `map-layers` (cc-agent-M exposes with tenant + product entitlement) |
| **Tenant scope** | `X-Hauska-Tenant-Id` → `payload.tenantScope` (never cross-tenant) |
| **Full spec** | `hauska-engine/services/engine-api/docs/map-layers-contract.md` |

### Request (parcel-keyed)

```json
{
  "parcel": {
    "latitude": 30.2672,
    "longitude": -97.7431,
    "address": "501 Congress Ave, Austin, TX",
    "parcelKey": "austin-demo-1"
  },
  "jurisdiction": { "stateKey": "texas", "localKey": null },
  "layers": ["parcel-polygon", "flood-zone", "floodway", "dem", "topography", "opportunity-zone-tract", "zoning"],
  "forceRefresh": false,
  "bbox": { "westLng": -97.75, "southLat": 30.26, "eastLng": -97.74, "northLat": 30.27 }
}
```

`bbox` reserved for wave-3 DEM/topography wiring (cc-agent-C).

### Response shape

- **Outer** `EngineEnvelope` wraps `MapLayersAssemblePayload`.
- **Each** `payload.layers[]` slot has its own nested `EngineEnvelope` (vintage + confidence-kind + degraded per layer).
- **No bare geometry** at the wire root.

### Layer keys — wired vs pending

| Layer key | Status | Source |
|-----------|--------|--------|
| `parcel-polygon` | **Wired** | `cotality:parcels` → `regrid:parcels` fallback |
| `flood-zone` | **Wired** | `fema:nfhl-flood-zone` |
| `zoning` | **Wired** | `cotality:zoning` → `regrid:zoning` fallback |
| `floodway` | **Pending** | cc-agent-C wave-3 RiskMeter floodway geometry |
| `dem` | **Pending** | cc-agent-C wave-3 catchment DEM (`POST /v1/topography/dem` interim) |
| `topography` | **Pending** | cc-agent-C wave-3 contour derivation |
| `opportunity-zone-tract` | **Pending** | cc-agent-C federal OZ registry ingest |

Pending slots return `status: "pending"` with honest `coverage.degraded: true` and `pendingReason`.

---

## Surfaces lifted off cortex BFF

| Cortex BFF (`legacy-design-tools`) | Engine spine (`hauska-engine`) |
|-----------------------------------|--------------------------------|
| `POST /api/engagements/:id/generate-layers` adapter fan-out | `POST /v1/map-layers/assemble` |
| Inline FEMA / Cotality / Regrid via `@workspace/adapters` | Same adapters via `@hauska-engine/adapters` |
| `siteTopographyIngest` (catchment DEM) | Pending in `dem`/`topography` slots; existing `POST /v1/topography/dem` + `/contours` |
| `briefing_sources` persistence + supersession | **Stays cortex-side** until storage lifts |

---

## Coordination handoff

### cc-agent-M (gate exposure)

- Register package id **`map-layers`** on hauska-mcp-server.
- Enforce `accessPolicy` + product-key + **tenant scope** before proxying to engine-api.
- Recommended tiers: `public-paid`, `platform-internal`, `tenant-private` (Max map render).

### cc-agent-C (consumer)

- Point cortex-api / extension at gate-proxied `POST /v1/map-layers/assemble` instead of in-process `generate-layers` geometry fan-out.
- Continue persisting `briefing_sources` in cortex until spine storage lifts.
- Wire wave-3 geometry into pending slots: floodway, dem, topography, opportunity-zone-tract.
- Map render reads `layers[].envelope` — surface per-layer vintage + confidence-kind.

---

## Implementation map

| Path | Role |
|------|------|
| `packages/engine-core/src/map-layers/contract.ts` | Zod request + layer key types |
| `packages/engine-core/src/map-layers/layerSpecs.ts` | Adapter mapping + pending shells |
| `packages/engine-core/src/map-layers/assembler.ts` | Core assembly logic |
| `services/engine-api/src/routes/map-layers.ts` | Gate-fronted HTTP routes |
| `services/engine-api/docs/map-layers-contract.md` | Human + machine contract |

---

## Verbatim test output

### `@hauska-engine/engine-core` — map-layers assembler

```
> @hauska-engine/engine-core@0.1.0 test P:\hauska-engine\packages\engine-core
> vitest run "src/map-layers"

 RUN  v2.1.9 P:/hauska-engine/packages/engine-core

 ✓ src/map-layers/__tests__/assembler.test.ts (6 tests) 6ms

 Test Files  1 passed (1)
      Tests  6 passed (6)
   Start at  12:17:57
   Duration  489ms (transform 101ms, setup 0ms, collect 140ms, tests 6ms, environment 0ms, prepare 117ms)
```

### `@hauska-engine/engine-api` — map-layers HTTP contract

```
> @hauska-engine/engine-api@0.0.0 test P:\hauska-engine\services\engine-api
> vitest run --passWithNoTests "src/__tests__/map-layers.test.ts"

 RUN  v2.1.9 P:/hauska-engine/services/engine-api

 ✓ src/__tests__/map-layers.test.ts (4 tests) 474ms
   ✓ engine-api map-layers capability > POST /assemble returns per-layer EngineEnvelopes 465ms

 Test Files  1 passed (1)
      Tests  4 passed (4)
   Start at  12:17:58
   Duration  1.52s (transform 433ms, setup 0ms, collect 717ms, tests 474ms, environment 0ms, prepare 114ms)
```

---

## Follow-ups

1. **cc-agent-C** — land wave-3 geometry; flip `floodway`, `dem`, `topography`, `opportunity-zone-tract` from `pending` → `ok`.
2. **cc-agent-M** — gate exposure for `map-layers` package with Max-tier entitlement.
3. **cc-agent-C** — cortex BFF thin to proxy assemble; retire duplicate adapter fan-out in `generateLayers.ts`.
4. **Render component** — extension-agent rough map render against `layers[].envelope` (shared package polish deferred to Chris/Mox).

---

## Escalation

None. Grok Build 0.1 completed capability shell on merged `origin/main` envelope infrastructure.
