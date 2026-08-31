---
id: 2026-07-27_QA4_executor_close
title: Executor close — QA4 osm-overpass honest fallback
date: 2026-07-27
status: executor-close
owner: executor-QA4
planner: qa (grades live — do NOT claim MET)
dispatch: _dispatches/2026-07-27_QA4_overpass_honest_fallback.md
---

# Executor close — QA4 overpass honest fallback

Builder executed the dispatch. Planner owns live verify and MET grading. This close does **not** claim MET.

## Branch / PR / SHA

| Field | Value |
|---|---|
| Repo | hauska-engine |
| Branch | `qa/overpass-honest-fallback` |
| PR | https://github.com/empressaioemail-tech/hauska-engine/pull/158 |
| SHA | `1d19e63f30969cfa4ed21dee50b03967d024f8bf` |
| Worktree | `P:\hauska-engine-worktrees\qa4-overpass` |

## What landed

1. **FALLBACK ORDER + HONESTY** (`packages/engine-core/src/road-intake/honest-fallback.ts`, `resolve-bastrop-roads-honest.ts`):
   - overpass ok → `overpass-ok`
   - overpass down + county-roadway / surveyed-2016 present → `degraded-covered` ("overpass down, fallback active"), roads still emitable from fallback
   - overpass down + no fallback → `degraded-no-source` ("roads unavailable this run: overpass down, no county roadway source"), `alert=true`
   - overpass ok zero + no county → `genuine-empty` (distinguishable from outage)
2. **RETRY/BACKOFF** (`fetch-overpass-bbox.ts`): bounded 3 attempts on 408/429/502/503/504; prefer city-scope when county single-query fails.
3. **PROBE SEMANTICS** (B1 extend, not rewrite): `probeOsmOverpass` retries, then checks county-roadway + streets-surveyed; `fallbackCovered` → status `degraded-covered`, `alert=false`. Migration `007_spine_health_degraded_covered.sql` widens status CHECK.

## B1-owned file extensions (flag for planner)

Touched B1 spine-health surfaces carefully (extend, do not collide on runner ownership):

- `services/retrieval-api/src/spine-health/probes.ts` — `probeOsmOverpass` only
- `services/retrieval-api/src/spine-health/derive-status.ts` — `fallbackCovered` → `degraded-covered`
- `services/retrieval-api/src/spine-health/types.ts` — status union + DeriveStatusInput
- `services/retrieval-api/src/spine-health/persist.ts` — apply 007 with 006
- `packages/storage/migrations/007_spine_health_degraded_covered.sql` — NEW
- `services/retrieval-api/scripts/apply-spine-health-migration.mjs` — runs 006+007

`run-pack.ts` / probe registration order untouched.

## Build / test (executor)

```
pnpm -C packages/engine-core build          # clean
pnpm -C packages/engine-core exec vitest run
  → 65 files, 385 passed | 2 skipped
pnpm -C services/retrieval-api exec vitest run \
  src/__tests__/spine-health-alert.test.ts \
  src/__tests__/spine-health-pack.test.ts
  → 11 passed (includes QA4 degraded-covered / dead-alert cases)
```

Mechanical gates (must go red on pre-fix):

- mock overpass 504 + county roadway → `degraded-covered`, roads emit via county-roadway node, probe `alert=false`
- mock overpass 504 + no road source → `degraded-no-source`, `alert=true`

## Deploy / migration

| Step | Result |
|---|---|
| Migration 007 on hauska_mcp | Applied `2026-07-27T17:08:59.487Z` |
| Cloud Run revision | `hauska-retrieval-api-00041-hed` tag `qa4-overpass` |
| Traffic | **100%** on `00041-hed` (verified; not stuck on older tag) |
| `/health.startedAt` | `2026-07-27T17:11:01.786Z` |

## Live `/health/spine/run` — osm-overpass row

Live Overpass recovered on retry (attempts=2), so the board shows **firing** rather than degraded-covered. That is honest: retry worked; coverage did not degrade. Degraded-covered path is covered by mechanical tests (and will fire live when Overpass stays 504 after retries while county-roadway is up).

```json
{
  "probeId": "osm-overpass",
  "kind": "source",
  "pack": "bastrop",
  "status": "firing",
  "alert": false,
  "signal": {
    "url": "https://overpass-api.de/api/interpreter",
    "bbox": { "south": 30.04, "west": -97.38, "north": 30.16, "east": -97.25 },
    "tags": { "nodes": "0", "ways": "4893", "relations": "0", "total": "4893" },
    "attempts": 2
  },
  "baselineValue": 4893,
  "currentValue": 4893,
  "error": null,
  "lastSuccessAt": "2026-07-27T17:11:58.844Z",
  "probedAt": "2026-07-27T17:11:58.844Z"
}
```

Full pack artifact: `_inbox/2026-07-27_QA4_live_spine_run.json` (tagged revision run; `alertCount=0`).

Main URL re-run after traffic cutover: same osm-overpass firing / attempts=2 / alertCount=0.

## Before → after (board semantics)

| Moment | osm-overpass |
|---|---|
| Pre-fix (B1 live @ 16:09Z) | `dead` + `alert=true` (HTTP 504), roads masked by county-roadway |
| Post-QA4 live | `firing` after 2 attempts (retry recovered); if 504 persists → `degraded-covered` / no alert when county covers |

## Planner verify checklist (do not self-grade)

1. PR #158 CI green + review of B1 extend surface
2. Live `/health/spine/run` osm-overpass row (paste above) — confirm honest
3. Mechanical tests on branch go red if honest-fallback / probe semantics reverted
4. Confirm traffic still 100% on `00041-hed` / tag `qa4-overpass`

## HOLD fix (typecheck) — 2026-07-27

Planner HOLD: CI typecheck failed on `RequestInfo` in `spine-health-pack.test.ts` (DOM type absent in retrieval-api tsconfig).

- Fix: `Parameters<typeof fetch>[0]` (Node-safe; matches `packages/adapters/src/retry.ts`)
- Local: `pnpm -C services/retrieval-api typecheck` clean; spine-health pack/alert tests 11 passed
- Fix SHA: `aa19e3067475dd19246a35110c4692a5c853e6ce`
- Tip SHA still `1d19e63` for product logic; HEAD of PR now `aa19e30`
- CI: `typecheck + test` **pass** (1m29s) on run https://github.com/empressaioemail-tech/hauska-engine/actions/runs/30288339952
- No redeploy (test-only change; live `00041-hed` unchanged)
