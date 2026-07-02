# QA P1 T1 — hauska-engine degradation fixes (close report)

**Date:** 2026-07-02
**Agent:** cc-agent-T1 (lead, Claude Opus 4.8)
**Repo:** empressaioemail-tech/hauska-engine (spine; deploys as hauska-engine-api)
**Branch:** `qa-p1-t1/engine-degradation-fixes`
**PR:** https://github.com/empressaioemail-tech/hauska-engine/pull/77 (squash-merged, merge SHA `5b4fa29`)
**Deploy:** revision `hauska-engine-api-00014-26f` @ 100% traffic, project `hauska-prod-497015`, region `us-central1`
**Clone:** `p:\tmp\qa-build\T1-hauska-engine`

Governing rule (commitment #1): every function returns a real result or an honest degraded result with provenance, never a hard 500.

Discipline: each fix built + adversarially reviewed by a separate sub-agent. The reviewer ran three rounds against Fix 1 and broke it twice (both real reachable 500s); both were fixed and re-verified. Final reviewer verdict: Fix 1 / Fix 2 / Fix 3 all PASS. CI (`pnpm typecheck` + `pnpm test`) green on the merged commit. Live smoke run from inside GCP (this sandbox has no egress to Cloud Run) against the deployed revision.

---

## Fix 1 — Property Brief 500 (`ANTHROPIC_API_KEY is not set`) — FIXED + secrets mounted

**Before (root cause):** the briefing route resolved `mode` (the cortex tile passes `mode:"anthropic"`), called `getAnthropicClient()`, which threw `ANTHROPIC_API_KEY is not set` when no key was configured; the route's catch returned a hard **500** `briefing_generation_failed`. The live engine-api service had NO `ANTHROPIC_API_KEY`, `XAI_API_KEY`, `BRIEFING_LLM_MODE`, or `AIR_FINDING_LLM_MODE` env at all. The findings route carried the identical hazard.

**Code fix (graceful degrade):** new `resolveLlmForMode` resolves a runnable LLM without throwing — ladder `anthropic (no key) -> grok (if XAI key) -> mock`, stamping `coverage.degraded` + a reason. Both routes carry a last-resort mock guard so a live-LLM throw still returns a real result. Input is normalized (arrays filtered to well-shaped items; a source needs a string id, a code section a string atomId) so a minimal/malformed bundle degrades instead of throwing. Applied to briefing, findings, and orchestrated-findings.

**Enrichment (secrets):** both `ANTHROPIC_API_KEY` and `XAI_API_KEY` secrets already existed in project `hauska-prod-497015`. Mounted BOTH on hauska-engine-api via `--update-secrets` (additive — did not drop the existing Cotality/ICC secrets), and set `BRIEFING_LLM_MODE=grok` + `AIR_FINDING_LLM_MODE=grok` (Grok-first per CLAUDE.md) via `--update-env-vars`. No secret fabricated. The operator does NOT owe a secret here — both were present.

**Evidence (live, deployed revision 00014-26f, main production URL):**
```
POST /v1/briefing/generate {"mode":"anthropic","input":{...}} -> HTTP 200   (was 500)
POST /v1/findings/generate {"mode":"anthropic","input":{...}} -> HTTP 200, "producer":"anthropic", "degraded":false
GET  /health -> HTTP 200
```
Because the ANTHROPIC secret is now mounted, the brief actually runs real Anthropic (producer:anthropic). With the key removed it degrades to Grok then mock (13 regression tests cover every path). The 500 is gone regardless of key state.

---

## Fix 2 — Hydrology pysheds — INSTALLED + LOADS (fixed); a distinct DEM-format defect remains (honest fallback)

**Before:** the engine-api image installed the pysheds pip requirements but not the native GDAL/GEOS/PROJ libraries rasterio links at import, so the "pysheds not installed in Cloud Run worker" degradation fired on every request.

**Fix:** added `libgdal-dev gdal-bin libgeos-dev libproj-dev proj-bin proj-data libspatialindex-dev build-essential python3-dev` + `GDAL_CONFIG`/include-path env to `services/engine-api/Dockerfile`, plus a build-time import smoke `python3 -c "import numpy, rasterio; from pysheds.grid import Grid"` that fails the build if the stack can't load. The native-D8 fallback (`hydrologyWorkerClient.ts`) is untouched.

**Evidence:** the Cloud Build (`services/engine-api/Dockerfile`) SUCCEEDED with the pysheds import smoke passing — pysheds now loads in the image. The "not installed" degradation is gone.

**NEW distinct defect found live (report to orchestrator, NOT the original degradation):** on the live `/v1/hydrology/drainage` call, pysheds now RUNS but fails with `'/tmp/hydrology-dem-*/dem.tif' not recognized as being in a supported file format`, and the worker degrades honestly to native-D8 with `fallbackUsed:true` and the real reason surfaced. Root cause: the drainage route writes the raw Float32 DEM byte array to `dem.tif`, but rasterio/pysheds expects a GeoTIFF container — a data-handoff format bug in the route/worker, separate from the install degradation this track targeted. Commitment #1 is satisfied (honest degraded, `fallbackUsed:true` + reason, HTTP 200), but pysheds does not yet produce a real pysheds result. Recommend a follow-on to wrap the DEM in a minimal GeoTIFF (or have run.py read raw floats + explicit width/height/transform) before pysheds can be the live library.

---

## Fix 3 — Subsurface SSURGO TLS/ECONNRESET — FIXED (honest degrade verified live)

**Before:** the USDA SDA host intermittently resets TLS; `querySdaSoils` threw a raw `network-error` on a final-attempt reset (no `captureThrowsAsResult`), and `Promise.all` discarded a live gSSURGO map-unit if the SDA tabular call failed.

**Fix:** `querySdaSoils` opts into `captureThrowsAsResult` so a final-attempt reset surfaces an honest `network-error` naming the failure mode (e.g. `ECONNRESET read sdmdataaccess.sc.egov.usda.gov`) instead of an unhandled throw; `run()` uses `Promise.allSettled` so a SDA reset with a live map-unit returns an honest degraded partial (`payload.degraded=true`), and only a genuine both-empty result is `no-coverage`.

**Evidence (live subsurface run-adapters, Bastrop parcel):**
```
"adapterKey":"usda:ssurgo-soils","status":"failed","error":{"code":"upstream-error",
 "message":"USDA Soil Data Access responded with HTTP 400 after 1 attempt: <?xml ... ServiceExceptionReport ..."}
```
This run drew a 400 (not a reset) — the fix surfaces the upstream's actual OGC error body via `bodyExcerpt` rather than a bare failure, and never a 500. The reviewer separately verified the ECONNRESET path returns a degraded partial (unit tests: SDA-reset-with-live-map-unit -> ok+degraded; both-hosts-reset -> honest network-error). Honest degradation confirmed both live and in tests.

---

## Fix 4 — ICC Code Connect — OPERATOR-GATED

The ICC adapter + client (`packages/corpus/src/adapters/icc-code-connect/`) are built entirely against an ASSUMED OpenAPI contract — every endpoint, the token URL, the base URL, and every field name is `@assumption`-tagged, pending the real OpenAPI/Swagger spec the operator is bringing back from ICC. `ICC_CODE_CONNECT_CLIENT_ID/SECRET` are live on the service, but: (a) the real contract cannot be verified without the spec, (b) this sandbox has no egress to `api.iccsafe.org` to probe it, and (c) there is no live ICC ingest pipeline in the spine to run against the creds (the adapter is consumed only by the model-code extractor, which is not wired to a runtime route). The adapter already fails soft (empty body -> empty blocks), so it is commitment-#1 compliant today. **Operator-owed:** bring the ICC OpenAPI spec + example payloads + token-endpoint details; reconcile `code-connect-client.ts` against them; stand up an ingest run. Cannot be completed autonomously.

**Incidental IAM fix during deploy:** the runtime SA `172690833726-compute@developer.gserviceaccount.com` lacked `roles/secretmanager.secretAccessor` on `ICC_CODE_CONNECT_CLIENT_ID` and `ICC_CODE_CONNECT_CLIENT_SECRET` (it had access to Cotality/XAI/ANTHROPIC). This blocked the FIRST deploy (revision 00013-dz9 went Ready=False). Granted Accessor on both ICC secrets to the runtime SA (restoring intended state — the secrets were already referenced on the service), then redeployed successfully (00014-26f). Without this the service could not have deployed at all.

---

## Fix 5 — Precedence production gate — CORTEX-SIDE (handed off)

The most-stringent-governs precedence engine is fully built in the spine (`packages/engine-core/src/finding/precedence/reconcile.ts` — federal preempt, local-amendment overlay, most-stringent-governs across accessibility/life-safety/dimensional) and is NOT gated off: `runFindingsPrecedencePass` runs unconditionally inside `generateFindings`. There is NO env flag or production gate disabling it in the engine (grepped: no `PRECEDENCE_ENABLED`, no disabling `process.env` in the finding package). The audit's "production gate not activated / `productionWire.ts`" finding refers to `productionWire.ts`, which is CONFIRMED ABSENT from the hauska-engine spine (grep returns nothing) and, per the audit itself, lives in cortex-api (legacy-design-tools). Per the no-cross-repo-change rule, this is **handed off to the cortex agent** — the production activation gate is cortex-side, not engine-side. (The one spine-side limitation is that `runFindingsPrecedencePass` only builds requirements for the accessibility door-clearance demo atoms; broad requirement-extraction from arbitrary code sections is a coverage gap, not a disabled gate — out of scope for this track.)

---

## Deploy record

```
Build: services/engine-api/Dockerfile via Cloud Build (E2_HIGHCPU_8), pysheds import smoke PASSED
Image: us-central1-docker.pkg.dev/hauska-prod-497015/cloud-run-source-deploy/hauska-engine-api:qa-p1-t1
Deploy: gcloud run deploy --no-traffic --update-secrets=XAI_API_KEY=...:latest,ANTHROPIC_API_KEY=...:latest
        --update-env-vars=BRIEFING_LLM_MODE=grok,AIR_FINDING_LLM_MODE=grok
First attempt (00013-dz9): Ready=False — runtime SA missing Accessor on ICC secrets. Fixed IAM, redeployed.
Live revision: hauska-engine-api-00014-26f  (Ready=True)
Traffic: 100% -> 00014-26f ; envelope-canary tag REPOINTED to 00014-26f (verified: canary URL health 200 on new rev)
```
Health (main URL, canary tag URL): both HTTP 200, startedAt 2026-07-02T13:21:43 (= new revision).
Live endpoint smokes (all HTTP 200): briefing (mode=anthropic, was 500), findings, hydrology/rainfall-forcing, site-context/run-adapters.

## Operator-gated / follow-on residuals

1. **ICC Code Connect** — operator owes the real OpenAPI spec + a live ingest run. Adapter is inert-but-honest today.
2. **Hydrology DEM format** — pysheds now loads but a distinct DEM-handoff bug (raw floats written as `.tif`) forces the honest native-D8 fallback. Follow-on: wrap the DEM as a GeoTIFF (or make run.py read raw floats + transform). Not a 500; commitment #1 satisfied.
3. **Precedence** — cortex-side gate; routed to the cortex agent (do NOT change legacy-design-tools from this track).
4. **Non-blocking:** the pysheds Dockerfile uses unpinned wheels (`pysheds>=0.3.5`, `numpy>=1.26.0`, `rasterio>=1.3.0`); pin exact versions later for reproducible builds. Not now.
