---
id: 2026-06-17_hauska-mcp-server_cc-agent-M_map_layer_gate_exposure_close
title: cc-agent-M close — map-layers gate exposure + tenant/Max entitlement (hauska-mcp-server)
date: 2026-06-17
agent: cc-agent-M
repo: hauska-mcp-server
dispatch: 2026-06-17_cc-agent-M_map_layer_gate_exposure
status: complete
note: Mirrored into doc_repo by planner. cc-agent-M lacks doc_repo access — it could not read the dispatch (worked from the pasted prompt + the engine contract) and wrote its own close to hauska-mcp-server `_inbox/close/`. This is the canonical copy.
---

# cc-agent-M — map-layers gate exposure — close report

Registered the `map-layers` package on hauska-mcp-server and wired gate-front proxying to cc-agent-E's engine-api endpoint per `hauska-engine/services/engine-api/docs/map-layers-contract.md`.

## New surface

MCP tool `assemble_map_layers` — proxies to `POST /v1/map-layers/assemble`.

## Gate enforcement (pre-proxy)

| Check | Behavior |
|---|---|
| Product key | cortex only |
| accessPolicy / tier | tenant-private when key has `jurisdiction_tenant`; platform-internal for operator keys; public-paid for other paid keys |
| Tenant scope | `X-Hauska-Tenant-Id` from `jurisdiction_tenant`; tenant binding required |
| Max-tier | Basic layers (parcel-polygon, flood-zone, zoning) on `developer_pro`; rich wave-3 layers require `team`/`embedder` or `platform_internal` |
| Cross-tenant | Deny when `jurisdiction.localKey` != caller tenant; deny when response `tenantScope` mismatches |

## New modules

- `src/gate-packages.ts` — package registry + entitlement gates
- `src/gate-front.ts` — gate-front header builder
- `src/engine-api-client.ts` — engine-api HTTP client
- `src/map-layers-contract.ts` — wire contract mirror

## Proof tests

`tests/map-layers-gate.test.ts`: cross-tenant denial (mox-living key blocked for bastrop-tx localKey); response tenantScope mismatch rejected; Max-tier blocks `dem` on `developer_pro`, allows on `team`. `tests/engine-api-client.test.ts`: full gate-front header set on proxy. All 287 tests pass.

## Config

`.env.example` adds `HAUSKA_ENGINE_API_URL` (falls back to `HAUSKA_BACKEND_URL`) and `HAUSKA_ENGINE_API_GATE_TOKEN` (falls back to `HAUSKA_ENGINE_API_KEY`).
