# cc-agent-C — site-drainage ingest flowLineCount fix (PR #142)

**Date:** 2026-06-06  
**Repo:** `empressaioemail-tech/legacy-design-tools`  
**Branch:** `cortex/hydrology-engine`  
**PR:** #142  
**Commit:** `96b81bf` (prior threshold work: `948649d`)

---

## Root cause (confirmed via DB-backed run)

The prior fix (`948649d`) added a correct **grid-relative threshold formula** but wired it to the **wrong dimensions**.

`siteDrainageIngest.ts` called:

```ts
resolveAccumulationThreshold(topoPayload.dem.widthPx, topoPayload.dem.heightPx)
```

`topoPayload.dem.widthPx/heightPx` come from **USGS 3DEP request sizing** (`computeRasterSize(catchmentBbox, 10m)` in `siteTopographyIngest`), not from the parsed GeoTIFF grid.

In `site-drainage-ingest.test.ts`:

| Source | Grid | Threshold |
|--------|------|-----------|
| USGS request (Round Rock parcel + 500 m buffer @ 10 m) | ~112×109 px | **50** (DEFAULT cap) |
| Mocked GeoTIFF (`geotiff` vi.mock) | **10×10** | should be **5** |
| Max D8 accumulation on 10×10 west-draining ramp | — | **~9** |

With threshold **50 > max acc ~9**, `flowLinesFromAccumulation` emitted **zero** features → `flowLineCount: 0`.

This was **not** a `runHydrologyNative` catchment/pour-point bug. The parity unit test in `siteDrainageThreshold.test.ts` passed because it used `resolveAccumulationThreshold(10, 10)` directly — it never exercised the ingest wiring bug.

---

## Fix

**File:** `artifacts/api-server/src/lib/siteDrainageIngest.ts`

1. Download + `parseDemBytes` **before** computing threshold and input signature.
2. Derive threshold from **`parsed.width` / `parsed.height`** (actual hydrology grid).
3. Keep `948649d` grid-relative formula unchanged; large real DEMs still cap at 50.

**Test:** `siteDrainageThreshold.test.ts` — new case `"uses parsed grid size not USGS request size for threshold"` documents the mismatch (request threshold → 0 flow lines; parsed threshold → >0).

Native-TS and Python paths stay in parity — both receive `accumulationThreshold` from ingest.

---

## Verification

### Environment

- `DATABASE_URL=postgres://postgres:postgres@localhost:5432/test_db`
- Local PostgreSQL 18 via `pg_ctl` + pgvector v0.8.2 built/installed on cente workstation
- Cortex MCP: unavailable this session (repo recon only)

### Commands

```powershell
pnpm run typecheck                                    # clean
pnpm --filter @workspace/api-server test -- site-drainage-ingest
pnpm --filter @workspace/api-server test -- siteDrainageThreshold
pnpm --filter @workspace/site-context test -- hydrologyNative
```

### Verbatim `site-drainage-ingest.test.ts` output (HR-8)

```
> @workspace/api-server@0.0.0 test P:\legacy-design-tools\artifacts\api-server
> vitest run "site-drainage-ingest"


 RUN  v3.2.4 P:/legacy-design-tools/artifacts/api-server

 ✓ src/__tests__/site-drainage-ingest.test.ts (3 tests) 465ms

 Test Files  1 passed (1)
      Tests  3 passed (3)
   Start at  18:57:12
   Duration  2.09s (transform 493ms, setup 13ms, collect 1.32s, tests 465ms, environment 0ms, prepare 87ms)
```

(Full run including INFO logs captured at `P:\doc_repo\_inbox\site-drainage-ingest-test-output.txt`.)

---

## Git state

| Item | Value |
|------|-------|
| Branch | `cortex/hydrology-engine` |
| HEAD | `96b81bf` |
| Pushed | yes → `origin/cortex/hydrology-engine` |
| PR | #142 — held for operator merge |

---

## Blockers

None for CI re-run. Local-only note: cente workstation required manual pgvector build (`nmake /F Makefile.win`) + admin copy into PostgreSQL 18 — not a repo blocker.
