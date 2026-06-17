---
id: 2026-06-17_hauska-engine_cc-agent-E_engine_api_map_layers_deploy_close
title: cc-agent-E close — engine-api deployed with wave-3 map-layers (hauska-engine-api-00008-qaw)
date: 2026-06-17
agent: cc-agent-E
repo: hauska-engine
status: complete — deployed, 100% traffic, verified
note: Mirrored into doc_repo by planner from the agent's chat report.
---

# cc-agent-E — engine-api wave-3 map-layers deploy — close (mirrored)

PR #73 deployed and serving 100% prod traffic. Revision **hauska-engine-api-00008-qaw** (merge lineage `1dddc9f`), image `map-layers-wave3-1dddc9f`, prod URL `https://hauska-engine-api-h7gvu7rgcq-uc.a.run.app`.

**Deploy method:** Cloud Build from repo root using **`services/engine-api/Dockerfile`** (bundles the pysheds hydrology worker). A plain `gcloud run deploy --source .` builds the repo-root Dockerfile, which is the retrieval-api image — engine-api needs its own Dockerfile. Project `hauska-prod-497015`, region us-central1. Env/secrets matched `00006-lap`: `ENGINE_API_GATE_TOKEN`←`HAUSKA_ENGINE_API_KEY`, `XAI_API_KEY`, `ANTHROPIC_API_KEY`, `DATABASE_URL`←`CORTEX_DATABASE_URL`, `BRIEFING_LLM_MODE=grok`, `AIR_FINDING_LLM_MODE=anthropic`, `AIR_FINDING_ORCHESTRATED=1`; 2 CPU / 2Gi / 300s / min-instances=1.

**Stale-tag gotcha (what misled the planner's probe):** the `envelope-canary` tag was pinned to the pre-#73 `00006-lap` revision, which returns "Unknown engine-api route" for `/v1/map-layers/assemble`. E repointed the tag to `00008-qaw`.

**Verified:** `POST /v1/map-layers/assemble` for 501 Congress Ave, Austin (30.2672, -97.7431) returned `floodway`, `dem`, `topography`, `opportunity-zone-tract` all `status: ok`, `confidence.kind: deterministic`, each with a per-layer `EngineEnvelope` (vintage / coverage / source). `GET /v1/map-layers/contract` → `pendingWave3: []`. Full verbatim assemble response in the agent chat report.

**Follow-up:** if a consumer still shows pending, check its `ENGINE_API_BASE_URL` / caching. cortex-api reaches engine-api via `ENGINE_API_URL` (= the default prod URL, which serves `00008-qaw` at 100%).
