---
id: 2026-07-27_COMPLETE_BASTROP_B1_executor_close
title: Executor close — COMPLETE-BASTROP B1 health monitors
date: 2026-07-27
status: executor-close
owner: executor-B1
planner: adversarial-audit (grades live — do NOT claim WDLL MET)
wdll: 2026-07-27_COMPLETE_BASTROP_hardening_WDLL items 6,7
dispatch: _dispatches/2026-07-27_COMPLETE_BASTROP_B1_health_monitors.md
---

# Executor close — B1 health monitors

Executor built; planner owns live verify and WDLL grading. This close does **not** claim items 6–7 MET.

## PRs

| Repo | PR | Branch |
|---|---|---|
| hauska-engine | https://github.com/empressaioemail-tech/hauska-engine/pull/153 | `feat/complete-bastrop-b1-health-monitors` |
| hauska-map | https://github.com/empressaioemail-tech/hauska-map/pull/79 | `feat/complete-bastrop-b1-spine-health` |
## Health endpoint paths

Process checks (unchanged core):

- `GET /health` — still `{ status, service, startedAt }`; additive `links.spineHealth` / `links.spineHealthRun`
- `GET /healthz/` — unchanged

Spine board (Bearer `RETRIEVAL_API_KEY`, same gate as `/stats/*`):

- `GET /health/spine` — latest persisted summary JSON from `spine_health_probe`
- `GET|POST /health/spine/run` — run Bastrop pack, persist, return summary

Live service (planner): `https://hauska-retrieval-api-h7gvu7rgcq-uc.a.run.app` (rev `00037-nil` until this PR deploys).

BFF (CC): `/api/spine/retrieval/health/spine` and `/api/spine/retrieval/health/spine/run`.

## CC-A panel status

**Panel landed** (not JSON-only): Command Center Substrate → **Spine Health** (`#panel=spine-health`).

Ports Control Tower / RevenueMeter shell. Clients: `fetchSpineHealthSummary` / `runSpineHealthPack` in `atomTrace.ts`. Probe id `retrieval-spine-health`.

Planner UI verify after both PRs deploy: open Spine Health → Run probes → confirm rows + ALERT banner when zero-with-baseline.

## Vitest proof (M0 alert path)

```
pnpm --filter @hauska-engine/retrieval-api test -- src/__tests__/spine-health-alert.test.ts src/__tests__/spine-health-pack.test.ts src/__tests__/spine-health-routes.test.ts src/__tests__/healthz.test.ts
```

Observed 2026-07-27: **16 passed** (alert 5 + pack 2 + routes 3 + healthz 6).

Key assertion: mocked AGOL `count: 0` against seed baseline 574 → `status=dead`, `alert=true`. `bastrop-tx:zoning` → `dead-expected`, `alert=false`.

CC smoke: `pnpm --filter command-center exec vitest run src/admin/control/panels/SpineHealth.smoke.test.tsx` — 2 passed.

## How to run probes

1. Apply migration (substrate / hauska_mcp):

```
SUBSTRATE_DATABASE_URL=postgres://.../hauska_mcp?sslmode=require \
  pnpm --filter @hauska-engine/retrieval-api apply-spine-health-migration
```

2. CLI pack (needs substrate + overlay for full board):

```
SUBSTRATE_DATABASE_URL=... OVERLAY_DATABASE_URL=... \
  pnpm --filter @hauska-engine/retrieval-api run-bastrop-spine-health
```

3. After retrieval deploy:

```
curl -s -H "Authorization: Bearer $RETRIEVAL_API_KEY" \
  "$RETRIEVAL_URL/health/spine/run" | jq '{alertCount, rows: [.rows[] | {probeId, status, alert, currentValue, baselineValue}]}'
```

4. Read latest:

```
curl -s -H "Authorization: Bearer $RETRIEVAL_API_KEY" \
  "$RETRIEVAL_URL/health/spine"
```

## Probe pack contents

Sources: bastrop-tx:parcels, bastrop-tx:floodplain, zoning-agol:bastrop-city-tx, bastrop-tx:zoning (dead-expected), osm-overpass, county-roadway, streets-surveyed-2016, txgio_parcel:48021 (+ zd), place_layer_snapshots:tier1:48021 (+ zoning_present + S-14 delta).

Engines: boundary-primitive, depth-warm, rule-setback (P-5 / bastrop-city-tx), reasoning-chain (gold 48021:33512 keys).

## Out of scope (per dispatch)

- All 254 counties
- Replacing `/health` process checks
- Self-grading WDLL
