---
id: 2026-06-11_legacy-design-tools_cc-agent-C_C3_thin_cortex_api_to_bff
title: C3 — thin cortex-api to product BFF
date: 2026-06-11
agent: cc-agent-C
repo: legacy-design-tools
kind: inbox-report
status: PR OPEN — awaiting CI + operator merge
related: [_dispatches/2026-06-11_cc-agent-C_C3_thin_cortex_api_to_bff, 56_engine_extraction_sprint, 80_adrs/adr_008_engine_factor_out]
---

# C3 — thin cortex-api to product BFF

**Branch:** `cortex/thin-cortex-api-to-bff` (from `cortex/append-briefing-hydro-spine-flags` @ `ea9d2d8`)

## Workspace / HEAD (HR-11)

### Verbatim `git status` (post-execution)

```
On branch cortex/thin-cortex-api-to-bff
Changes not staged for commit:
	modified:   artifacts/api-server/src/__tests__/engagements.test.ts
	modified:   artifacts/api-server/src/lib/__tests__/engineSpineClient.test.ts
	modified:   artifacts/api-server/src/lib/engineSpineClient.ts
	modified:   artifacts/api-server/src/lib/engineSpineFlags.ts
	modified:   artifacts/api-server/src/lib/engineSpineHydrology.ts
	modified:   artifacts/api-server/src/lib/engineSpineRouting.ts
	modified:   artifacts/api-server/src/lib/siteDrainageIngest.ts
	modified:   artifacts/api-server/src/lib/siteTopographyIngest.ts
	modified:   artifacts/api-server/src/routes/findings.ts
	modified:   artifacts/api-server/src/routes/parcelBriefings.ts
Untracked:
	artifacts/api-server/src/lib/__tests__/engineSpineUngatedPaths.test.ts
```

### Verbatim `git log -3`

```
ea9d2d8 ci(deploy): append ENGINE_SPINE_TOPOGRAPHY — completes spine flag bake.
218e75b ci(deploy): bake ENGINE_SPINE_BRIEFING and ENGINE_SPINE_HYDROLOGY into deploy-canary.
1295f64 Merge pull request #177 from empressaioemail-tech/cortex/reproject-parcel-geometry-wgs84
```

---

## 1. Recon — all reasoning consumers spine-served

**Answer: YES (prod).** Deploy workflow bakes all flags on; prod soak 2026-06-11 verified. After C3 cut, cortex-api routes **unconditionally** delegate through gate-front seam.

| Consumer | Cortex path | Spine endpoint |
|---|---|---|
| Findings | `routeGenerateFindings` / `routeGenerateOrchestratedFindings` | `/v1/findings/generate`, `/v1/findings/generate-orchestrated` |
| Briefing | `routeGenerateBriefing` | `/v1/briefing/generate` |
| Drainage + rainfall | `routeRunHydrologyWorker`, `routeResolveRainfallForcing` | `/v1/hydrology/drainage`, `/v1/hydrology/rainfall-forcing` |
| Topography DEM | `routeFetchUsgs3depDem` | `/v1/hydrology/dem` |

**Adapter pack:** `lib/adapters` + `generate-layers` **stay cortex-side** (BFF data-fetching). Future lift = sprint 56 step 3, out of C3 scope.

**BFF intake (pre-spine, kept):** plan-set classification, vision gather, GeoTIFF parse + d3-contour derivation in `siteTopographyIngest.ts` (spine returns raw DEM bytes only).

### Kill-list (removed dead flag-off paths)

| Path | What was removed |
|---|---|
| `engineSpineRouting.ts` | `useSpine*` branches; imports/calls to `generateFindings`, `generateOrchestratedFindings`, `generateBriefing` |
| `engineSpineHydrology.ts` | `useSpine*` branches; imports/calls to `fetchUsgs3depDem`, `runHydrologyWorker`, `resolveRainfallForcing` |
| `engineSpineFlags.ts` | Env `flagOn()` gating; snapshot now always-true |

### Kill-list (NOT deleted — intentional)

| Path | Why kept |
|---|---|
| `lib/finding-engine/` | `lib/eval` runners + BFF intake (`classifyPlanSetPieces`, `visionSheetRead`, types) |
| `lib/briefing-engine/` | Types, HTML helpers, Grok constants for brokerage |
| `lib/adapters/` | Live generate-layers adapter pack |
| `lib/site-context/server/{usgs3dep,hydrology*,rainfall*}*` | Package-level; cortex dead import path removed |

### Keep-list (live BFF)

`lib/adapters/**`, `generateLayers.ts`, plan-set/vision intake libs, site ingest orchestrators, `engineSpineClient.ts`, `gateEngineServiceAuth`, session/auth, wedge, letters, artifact UX, Revit/IFC ingress.

---

## 2. Code removed / changed

**Net:** −162 / +149 lines across 11 files (+1 new test file).

Core behavioral change: **no local reasoning fallback** — `engine-api` is the only path. Boot validation (`validateEngineSpineEnvAtBoot`) now **always** requires `ENGINE_API_URL`.

---

## 3. No-ungated-path audit

**Route audit:** `artifacts/api-server/src/routes/*.ts` — no direct calls to `generateFindings(`, `generateBriefing(`, `runHydrologyWorker(`, `fetchUsgs3depDem(`, `resolveRainfallForcing(`.

**Gate-front:** All four engine surfaces route through `postEngineSpine` with `buildSpineGateFrontContext*`.

**CI test:** `artifacts/api-server/src/lib/__tests__/engineSpineUngatedPaths.test.ts` — static route-file scan + assertions that findings/briefings use spine routing helpers.

---

## 4. Engine-unreachable error behavior (scope item 5)

| Path | Behavior on `EngineSpineError` / timeout |
|---|---|
| Findings | Run row `state: failed`, error `finding engine failed (<code>): <message>` |
| Briefing | Job row `state: failed`, error `briefing engine failed (<code>): <message>` |
| Topography DEM | Ingest `upstream-error` with codes `engine-api-unreachable` / `engine-api-rejected` |
| Drainage | Ingest `upstream-error` code `engine-api-unreachable` for rainfall-forcing and drainage worker |

Helper: `formatEngineSpineFailure()` in `engineSpineClient.ts`. No silent empty success on spine failure.

---

## 5. Verification (HR-8)

### Typecheck (verbatim)

```
pnpm run typecheck
→ Exit code 0 (all artifacts + libs)
```

### Unit tests (verbatim)

```
cd artifacts/api-server && pnpm test -- src/lib/__tests__/engineSpineUngatedPaths.test.ts src/lib/__tests__/engineSpineDeserialize.test.ts

 RUN  v3.2.4
 ✓ engineSpineUngatedPaths.test.ts (2 tests)
 ✓ engineSpineDeserialize.test.ts (7 tests)
 Test Files  2 passed (2)
 Tests  9 passed (9)
```

### Integration tests — blocked locally

```
pnpm test -- src/__tests__/engagements.test.ts
→ FAIL: DATABASE_URL must be set (test DB not provisioned on this workstation)
```

Full-product regression (plan review, brief, wedge, letters, Site/drainage/topo, extension, Revit) requires `DATABASE_URL` + test schema — **not run locally**; CI `pr-checks.yml` Test job is the authoritative gate.

---

## 6. PR / SHAs

| Item | Value |
|---|---|
| Branch | `cortex/thin-cortex-api-to-bff` |
| PR | https://github.com/empressaioemail-tech/legacy-design-tools/pull/179 |
| Commit SHA | `d31b990` |
| Base | `origin/main` (`ef53f22`) |

---

## 7. Blockers

None on implementation. **Local blocker:** `DATABASE_URL` unset — integration/regression suites cannot run on this workstation without test DB provisioning per `lib/db` testing docs.

---

## Acceptance checklist

| Criterion | Status |
|---|---|
| Recon + kill/keep lists filed before deletion | ✅ |
| Dead flag-off branches removed; adapters preserved | ✅ |
| No ungated path (audit + test) | ✅ |
| Honest engine-unreachable on four paths | ✅ |
| Full-product BFF regression | ⏳ CI / operator with DATABASE_URL |
| CI green | ⏳ pending push |
| PR held for operator merge | ✅ (not self-merged) |
