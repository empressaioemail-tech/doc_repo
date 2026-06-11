# Fold site-topography into generate-layers + fix silent drainage 422 — cc-agent-C report

**Date:** 2026-06-11  
**Agent:** cc-agent-C  
**Repo:** legacy-design-tools  
**Branch:** `cortex/topography-into-generate-layers`  
**PR:** https://github.com/empressaioemail-tech/legacy-design-tools/pull/176  
**SHA:** `df723a7` (fixup: PL-04 test expects `usgs:3dep-dem` in full-run outcomes)  
**Worktree:** `P:\legacy-design-tools`

---

## Problem (verbatim canary symptom)

Moab engagement `409a3013-273f-4871-b799-bc08def01cec`: **Run drainage + rainfall sim** appeared to no-op. Network showed:

```
POST /api/engagements/409a3013-273f-4871-b799-bc08def01cec/site-drainage/refresh  422
{ "status": "no-topography", "reason": "No site-topography ingest — run POST /api/engagements/:id/site-topography/refresh first." }
```

Generate Layers populated adapter briefing sources but never produced the catchment DEM (`ingestSiteTopography` was only reachable via `/site-topography/refresh`).

---

## Fix locations

| File | Lines | What |
|------|-------|------|
| `artifacts/api-server/src/routes/generateLayers.ts` | 68–72 | Import `ingestSiteTopography` |
| `artifacts/api-server/src/routes/generateLayers.ts` | 74–75 | `GENERATE_LAYERS_TOPOGRAPHY_ADAPTER_KEY = "usgs:3dep-dem"` |
| `artifacts/api-server/src/routes/generateLayers.ts` | 382–421 | `siteTopographyIngestToGenerateLayersOutcome()` — maps ok / no-parcel-coverage / upstream-error to generate-layers outcome wire |
| `artifacts/api-server/src/routes/generateLayers.ts` | 820–866 | After adapter persist + events: best-effort `ingestSiteTopography({ engagementId, history, forceRefresh, log })` when geocoded and not `?adapterKey=` scoped; append outcome to `outcomesWire` |
| `artifacts/design-tools/src/components/engagement-detail/SiteTab.tsx` | 777–828 | `runDrainageRefresh`: on `422` + `status=no-topography`, show **"Generate site layers/topography first, then run drainage."** via existing layer refresh notice; other failures also surfaced (no silent throw) |
| `artifacts/api-server/src/__tests__/generate-layers.test.ts` | hoisted mock + 4 new cases | Mock `ingestSiteTopography`; assert folded outcome, best-effort failure, scoped-run skip |

### Behavior notes

- **Best-effort:** topography throw or upstream-error → failed outcome line; HTTP 200 + adapter rows unchanged.
- **Idempotent:** delegates to existing `inputSignature` + `forceRefresh` in `siteTopographyIngest.ts:760–814`.
- **Scoped refresh:** `?adapterKey=` runs do **not** invoke topography (per-layer refresh stays adapter-only).
- **Spine-transparent:** no change to `ENGINE_SPINE_TOPOGRAPHY` routing inside `ingestSiteTopography`.

---

## Local verification (verbatim)

### Typecheck

```
pnpm run typecheck   # PASS (all artifacts + libs)
```

### Tests

`generate-layers.test.ts` could not execute locally — **`DATABASE_URL` not set** on this workstation (no `.env.local`). CI Test job is the authoritative run for the new cases:

- folds site-topography ingest into full generate-layers runs
- site-topography ingest failure does not fail generate-layers
- `?adapterKey=` scoped runs skip folded site-topography ingest

---

## Canary run logs (post-merge — operator)

**Not captured in this session.** After merge → build → deploy-canary → re-stage `ENGINE_SPINE_BRIEFING` + `ENGINE_SPINE_HYDROLOGY`:

1. Generate Layers on Moab `409a3013-…` — expect log line `generate-layers: site-topography ingest finished` + outcome `usgs:3dep-dem ok`.
2. Run drainage — expect `POST /v1/hydrology/drainage 200` on engine-api (canary `ENGINE_SPINE_HYDROLOGY=1`) and `library` field (`pysheds` vs `native-d8`).

Paste those verbatim logs here after operator verification.

---

## Blockers

| Blocker | Status |
|---------|--------|
| Local Vitest (no `DATABASE_URL`) | Expected on `cente` box without `.env.local`; CI covers integration tests |
| Canary hydrology flip verification | Deferred to post-merge operator steps in dispatch |

---

## PR

https://github.com/empressaioemail-tech/legacy-design-tools/pull/176 — held for operator merge.
