---
id: 2026-07-27_CC_A_U3_executor_close
title: CC-A Unit 3 executor close — map swap + degraded panel fixes
status: checkin
date: 2026-07-27
applies_to: hauska-map
wdll: 2026-07-27_CC_A_legible_node_atom_flow_WDLL
owner: builder-u3
related: [2026-07-27_CC_A_builder_units, 2026-07-27_CC_A_phase0_live_reaudit_and_build_spec]
---

# CC-A U3 executor close — map swap + degraded fixes

**Builder does not claim WDLL MET.** Planner grades live on cmdcenter (and PE)
after deploy. This close ships evidence only.

## PR / SHA

| Item | Value |
|---|---|
| Repo | `empressaioemail-tech/hauska-map` |
| Branch | `feat/cc-a-u3-map-and-degraded` |
| PR | https://github.com/empressaioemail-tech/hauska-map/pull/73 |
| SHA | `aa8fb04` (fix on `3aeec72`) |
| Base | `origin/main` @ `aa04baa` |

Avoided U1 collision: no `NodeGraph.tsx` / retrieval organism edits. Touched
LiveMapTile / ExplorerMap shared chrome extraction, panelProbes, ParcelTrace,
RevenueMeter, BFF proxy routes only.

## What landed (by WDLL item)

### WDLL 7 — Map swap

- Moved PE layered chrome into `@hauska/map-renderer/src/chrome/`:
  `LayersControl`, `MapTools`, `satelliteBase`, `mapToolsController`,
  `geoMeasure`, `SHARED_DEFAULT_CENTER`, `SHARED_PARCEL_TILES`.
- CC `LiveMapTile` now mounts FloatingMap with `parcelTiles={SHARED_PARCEL_TILES}`,
  `visibleLayers` + `LayersControl`, and `MapTools` — same LAYER_REGISTRY
  composition path as PE.
- PE browse files are thin re-exports of the shared module (no second shell).
- PE `config.ts` reads center/tiles from shared defaults.
- Guard: `oneReadPath.test.ts` asserts both surfaces share chrome under
  `packages/map-renderer/src/chrome`.

### WDLL 8 — Parcel Trace live-or-honest

- Probe `retrieval-healthz` now GETs `${base}/health` (not `/healthz/`).
- Live pre-fix: `/api/spine/retrieval/health` → **200**
  `{"status":"ok","service":"retrieval-api",…}`; `/healthz` and `/healthz/` →
  **404**.
- BFF (`api/spine.ts` + PE `apps/property-explorer/api/spine.ts`) aliases
  `healthz` → `health` at forward time.
- Parcel Trace copy no longer claims "deployed command-center has no
  interactive map"; points at Site Analysis shared layered map + this panel as
  search/trace companion.

### WDLL 9 — Revenue Meter live-or-honest

- Live pre-fix: `/api/spine/mcp-metering/summary` → **403**
  `{"error":"platform_internal_required"}` (key present but not
  platform_internal, or upstream gate).
- Panel shows explicit honest block: requires platform_internal key; badge
  stays DEGRADED until probe succeeds. Never silent empty; never lying LIVE.
- `fetchMeteringSummary` preserves `platform_internal_required` in message.
- Did **not** wire a new Vercel env secret from this agent (no deploy-key
  access). Operator can promote badge to LIVE by mounting a
  platform_internal `MCP_PRODUCT_KEY`.

### WDLL 10 — Negative done-line (evidence for planner)

- One shared chrome module; PE re-exports; CC imports from package.
- Badges still via `usePanelHealth` / `derivePanelBadge` (F1c) — no hand-set
  LIVE constants added.
- JSON-blob / node-organism items remain U1/U2 scope (untouched here).

## Tests

```
pnpm --filter command-center test -- panelProbes oneReadPath RevenueMeter LiveMapTile ParcelTrace
→ Test Files 5 passed / Tests 35 passed

pnpm --filter property-explorer test
→ Test Files 11 passed / Tests 79 passed
```

CI on PR #73 (SHA `aa8fb04`): Test / Typecheck / test — all **SUCCESS**.

## Deploy / preview

PR opened; Vercel preview (if auto) should attach to #73. Builder did not wait
on preview URL. Planner verifies post-deploy:

1. Site Analysis: Layers + Satellite/Tools chrome present.
2. Parcel Trace badge LIVE (probe /health).
3. Revenue Meter honest DEGRADED (or LIVE if key wired).

## Scratch updates

See `_scratch/depth-engine-27c.md` — GROUND-TRUTH + LESSON for U3 appended.

## Planner grades — builder does not

Do **not** mark WDLL 7/8/9/10 MET from this close. Planner live-walks
cmdcenter-blush (or preview) and grades.
