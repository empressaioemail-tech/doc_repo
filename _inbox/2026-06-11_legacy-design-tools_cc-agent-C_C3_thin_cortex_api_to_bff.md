---
id: 2026-06-11_legacy-design-tools_cc-agent-C_C3_thin_cortex_api_to_bff
title: C3 — thin cortex-api to product BFF
date: 2026-06-11
agent: cc-agent-C
repo: legacy-design-tools
kind: inbox-report
status: IN_PROGRESS
related: [_dispatches/2026-06-11_cc-agent-C_C3_thin_cortex_api_to_bff, 56_engine_extraction_sprint, 80_adrs/adr_008_engine_factor_out]
---

# C3 — thin cortex-api to product BFF

**Branch:** `cortex/thin-cortex-api-to-bff` (from `cortex/append-briefing-hydro-spine-flags` @ `ea9d2d8`)

## Workspace / HEAD (HR-11)

### Verbatim `git status`

```
On branch cortex/thin-cortex-api-to-bff
Changes not staged for commit:
	modified:   .claude/worktrees/recon-add-jurisdiction (untracked content)
	modified:   .claude/worktrees/track-b-ifc-ingest (modified content, untracked content)
no changes added to commit
```

### Verbatim `git log -3`

```
ea9d2d8 ci(deploy): append ENGINE_SPINE_TOPOGRAPHY — completes spine flag bake.
218e75b ci(deploy): bake ENGINE_SPINE_BRIEFING and ENGINE_SPINE_HYDROLOGY into deploy-canary.
1295f64 Merge pull request #177 from empressaioemail-tech/cortex/reproject-parcel-geometry-wgs84
```

**HEAD accepted:** `cortex/` prefix branch; spine flags baked in `.github/workflows/cloud-run-deploy.yml` (all four `ENGINE_SPINE_*=1`).

---

## 1. Recon — all reasoning consumers spine-served

**Answer: YES (prod).** Deploy workflow bakes all flags on; prod soak 2026-06-11 verified. Cortex-api routes delegate through gate-front seam (`engineSpineClient` + `engineSpineRouting` / `engineSpineHydrology`).

| Consumer surface | Engine | Cortex call path | Spine `/v1/*` | Prod flag |
|---|---|---|---|---|
| Plan review findings | Finding (+ orchestrated) | `findings.ts` → `routeGenerateFindings` / `routeGenerateOrchestratedFindings` | `/v1/findings/generate`, `/v1/findings/generate-orchestrated` | `ENGINE_SPINE_FINDINGS=1`, `ENGINE_SPINE_FINDINGS_ORCHESTRATED=1` |
| Parcel briefing | Briefing | `parcelBriefings.ts` → `routeGenerateBriefing` | `/v1/briefing/generate` | `ENGINE_SPINE_BRIEFING=1` |
| Site drainage | Hydrology worker + rainfall | `siteDrainageIngest.ts` → `routeRunHydrologyWorker`, `routeResolveRainfallForcing` | `/v1/hydrology/drainage`, `/v1/hydrology/rainfall-forcing` | `ENGINE_SPINE_HYDROLOGY=1` |
| Site topography DEM | Topography DEM fetch | `siteTopographyIngest.ts` → `routeFetchUsgs3depDem` | `/v1/hydrology/dem` | `ENGINE_SPINE_TOPOGRAPHY=1` |
| Generate-layers | **Adapters (not reasoning)** | `generateLayers.ts` → `@workspace/adapters` `runAdapters` | N/A — stays cortex BFF | No spine flag |
| Extension property brief | Grok summarization (brokerage) | `brokerageBriefLlm.ts` — direct Grok, not `generateBriefing` | N/A — separate BFF path | N/A |
| NOAA design-storms | Atlas 14 point fetch | `siteDrainage.ts` → `fetchNoaaAtlas14PointEstimate` | N/A — upstream data, not engine-api reasoning | N/A |

**BFF intake (pre-spine, stays cortex-side):** plan-set classification (`planSetClassification.ts`), vision image gather (`planSetVision.ts`, `attachedDocumentVision.ts`), contour derivation from DEM bytes (`siteTopographyIngest.ts` d3-contour — spine returns raw DEM only).

### Adapter pack (scope item 3)

**Stays cortex-side as BFF data-fetching.** `lib/adapters` + `generate-layers` route are live with no spine flag. Future lift to `hauska-engine/packages/adapters` is sprint 56 step 3 — **out of scope for C3**.

---

## 2. Kill-list (dead behind flag-off branches)

### Cortex-api — remove unconditional spine cut

| Path | Rationale |
|---|---|
| `artifacts/api-server/src/lib/engineSpineRouting.ts` — `useSpine*` false branches + imports of `generateFindings`, `generateOrchestratedFindings`, `generateBriefing` | Local reasoning fallback |
| `artifacts/api-server/src/lib/engineSpineHydrology.ts` — `useSpine*` false branches + imports of `fetchUsgs3depDem`, `runHydrologyWorker`, `resolveRainfallForcing` | Local hydrology compute fallback |
| `artifacts/api-server/src/lib/engineSpineFlags.ts` — env `flagOn()` gating | Flags permanently on; snapshot becomes always-true |

### Monorepo packages — NOT deleted in C3

| Path | Rationale |
|---|---|
| `lib/finding-engine/` (full package) | Still required by `lib/eval` runners + BFF intake exports (`classifyPlanSetPieces`, `visionSheetRead`, types). **Generate/orchestrate/precedence runtime in cortex-api is dead** but package remains for eval + intake helpers. |
| `lib/briefing-engine/` (full package) | Types + HTML helpers + Grok constants for brokerage; `generateBriefing` no longer called from cortex-api after cut. |
| `lib/site-context/src/server/{usgs3dep,hydrologyWorkerClient,hydrologyNative,rainfallForcing}.ts` | Package-level compute; cortex-api dead path removed; tests/eval may still reference. |

---

## 3. Keep-list (live BFF)

| Path | Role |
|---|---|
| `lib/adapters/**` | Generate-layers adapter pack |
| `artifacts/api-server/src/routes/generateLayers.ts` | Unified adapter run |
| `artifacts/api-server/src/lib/{planSetClassification,planSetVision,attachedDocumentVision}.ts` | Pre-spine intake |
| `artifacts/api-server/src/lib/siteTopographyIngest.ts` | DEM ingest orchestration; contour derive local |
| `artifacts/api-server/src/lib/{siteDrainageIngest,siteDrainageMaterializer}.ts` | Drainage ingest orchestration (spine compute) |
| `artifacts/api-server/src/lib/engineSpineClient.ts` | Gate-front seam client |
| `artifacts/api-server/src/middlewares/gateEngineServiceAuth.ts` | Engine route auth |
| Session/auth, wedge, letters, artifact UX, Revit/IFC ingest routes | Product BFF glue |

---

## 4–7. Execution / verification

*(Updated after implementation)*
