# Spine date rehydration — briefing + hydro/topo audit — cc-agent-C report

**Date:** 2026-06-11  
**Agent:** cc-agent-C  
**Repo:** legacy-design-tools  
**Branch:** `cortex/spine-date-rehydrate-briefing-hydro-topo`  
**PR:** https://github.com/empressaioemail-tech/legacy-design-tools/pull/175  
**SHA:** `879452e`  
**Worktree:** `P:\legacy-design-tools`

---

## Verbatim error (live canary `cortex-api-00159-tuq`, briefing flip)

```
14:28:08  POST /v1/briefing/generate  200        (engine-api — spine briefing succeeded)
14:28:08  briefing generation: engine call starting
14:28:43  briefing generation: failed
  ERR: value.toISOString is not a function
  at PgTimestamp.mapToDriverValue (drizzle-orm/.../pg-core/columns/timestamp.ts:68:16)
  at _SQL.buildQueryFromSourceParams (.../sql/sql.ts:163)
```

---

## Root cause

Same class as `#171`. `routeGenerateBriefing` returned engine-api JSON without rehydrating `generatedAt` (ISO string) to `Date` before `persistGenerationResult` wrote `parcel_briefings.generated_at` via drizzle.

---

## Fix locations

| File | Lines | What |
|------|-------|------|
| `artifacts/api-server/src/lib/engineSpineDeserialize.ts` | 1–12 | Module doc: typed rehydrators at routing boundary; do not coerce JSON-payload ISO strings |
| `artifacts/api-server/src/lib/engineSpineDeserialize.ts` | 60–68 | `rehydrateSpineBriefingResult` — coerces `generatedAt` ISO string → `Date` |
| `artifacts/api-server/src/lib/engineSpineDeserialize.ts` | 71–99 | Hydro/topo audit rehydrators (no-op, documented) |
| `artifacts/api-server/src/lib/engineSpineRouting.ts` | 157 | `routeGenerateBriefing` → `rehydrateSpineBriefingResult(payload.result)` |
| `artifacts/api-server/src/lib/engineSpineHydrology.ts` | 62–71, 104, 133 | Wire audit rehydrators on spine returns for DEM / worker / rainfall |
| `artifacts/api-server/src/lib/__tests__/engineSpineDeserialize.test.ts` | 72–167 | Briefing string→Date + pass-through; hydro/topo audit tests |

### Briefing field coerced

| Field | Type in contract | Persist path |
|-------|------------------|--------------|
| `generatedAt` | `Date` | `parcelBriefings.generatedAt` (drizzle timestamp) |

`BriefingSourceInput.snapshotDate` is intentionally `string` — not coerced.

---

## Hydrology + topography per-route audit

| Route | Spine path | Date-typed persisted fields | Action |
|-------|-----------|------------------------------|--------|
| `routeRunHydrologyWorker` | `/v1/hydrology/drainage` | **None** — GeoJSON + string metadata (`library`, `routing`, etc.); `computedAt` stamped locally as ISO string in atom JSON (`siteDrainageIngest.ts:354`) | No-op rehydrator; verified absent |
| `routeResolveRainfallForcing` | `/v1/hydrology/rainfall-forcing` | **None via drizzle timestamp** — nested `estimate.fetchedAt` is ISO string stored in atom JSON payload (`forcingDetail`) | No-op rehydrator; verified absent |
| `routeFetchUsgs3depDem` | `/v1/hydrology/dem` | **None via drizzle timestamp** — `fetchedAt` is ISO string in atom payload; routing layer stamps locally after base64 decode | No-op rehydrator; verified absent |

**Note:** A generic deep ISO-string→Date walker would break hydrology/topography — those seams intentionally keep `fetchedAt` / `computedAt` as strings in JSON.

---

## Unit test output (verbatim)

```
 RUN  v3.2.4 P:/legacy-design-tools/artifacts/api-server

 ✓ src/lib/__tests__/engineSpineDeserialize.test.ts (7 tests) 3ms

 Test Files  1 passed (1)
      Tests  7 passed (7)
   Start at  09:33:35
   Duration  446ms (transform 37ms, setup 16ms, collect 24ms, tests 3ms, environment 0ms, prepare 93ms)
```

```
pnpm run typecheck   # PASS
```

---

## Post-deploy canary briefing verify

**Status:** PENDING — awaiting operator merge of #175 → deploy-canary → re-run briefing on canary.

**Target engagement:** `613 Sturgeon_A` (`6d9cd127-4bd8-4ce7-a6ae-b5794c2f01a2`)

### Expected log (post-fix)

```
(pending — operator to paste verbatim after canary briefing re-run)
```

---

## Blockers

None for merge. Briefing flip (`ENGINE_SPINE_BRIEFING=1` in deploy workflow) remains **post-verify** per `#174` one-at-a-time convention.

---

## Post-merge (planner/operator)

1. Merge #175 → workflow build → `deploy-canary` (findings flags already baked via `#174`).
2. Re-run briefing on canary with `ENGINE_SPINE_BRIEFING=1` staged manually — confirm persist + lineage.
3. `shift-traffic` → append `ENGINE_SPINE_BRIEFING=1` to `cloud-run-deploy.yml`.
4. Then hydrology (verify pysheds, not native fallback) → topography → C3.
