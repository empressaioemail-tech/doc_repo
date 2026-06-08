---
id: buildout_deploy_wiring_checklist
title: Build-out deploy wiring checklist (the linchpin)
status: active
last_updated: 2026-06-08
applies_to: portfolio
related: [00_current_state, 76e_platform_observability_sprint, 56_engine_extraction_sprint, 08_tiered_access_model, 90_runbooks/cutover_env_var_bind_procedure, 90_runbooks/cloud_run_canary_deploy, _research/cotality, _research/icc]
---

# Build-out deploy wiring checklist

> **Why this exists.** The merged-but-undeployed build-out wave is the multi-lane linchpin ([`00_current_state.md`](../00_current_state.md)). A 2026-06-08 live probe found the deployed `hauska-mcp-server` is running with placeholder backend URLs (`HAUSKA_BACKEND_URL = https://REPLACE-with-cc-agent-E-engine-url`, `UPSTASH_REDIS_REST_URL = https://REPLACE-with-upstash-rest-url`), so the gate is not wired to the engine and engine-backed MCP tools are dark in prod. This checklist pins the exact wiring so the deferred deploy lands once, cleanly, and does not repeat the placeholder gap. Do not relax the dependency health-check to make `/health` green; fix by wiring the URLs.

## Verified live values (2026-06-08, project + URL ground truth)

| Target | Value | Verified |
|---|---|---|
| Engine retrieval URL (for `HAUSKA_BACKEND_URL`) | `https://hauska-retrieval-api-h7gvu7rgcq-uc.a.run.app` | `/health` returns 200 directly |
| Cortex URL (`LEGACY_BACKEND_URL`) | `https://cortex-api-tds7av26va-uc.a.run.app` | already correct on the gate; `/health` 200 |
| Gate service | `hauska-mcp-server` in `hauska-prod-497015` (us-central1) | serving rev `00004-t5c` @ 100% |
| Cortex service | `cortex-api` in `legacy-design-tools-prod` | serves `00119-laq` @ 100%; `00090-vf9` ready @ 0% (drift) |

Note the project split: the gate + retrieval-api live in `hauska-prod-497015`; cortex-api + api-server in `legacy-design-tools-prod`; smartcity in `smartcity-os-prod`.

## Preconditions (the linchpin gates)

These are external/operator and gate the deploy, not this checklist's mechanics:

- **Cotality OAuth** re-minted as `nick@hauska.io` (Gene/CoreLogic escalation); unblocks the 8-adapter pack (#141 merged-inert) and the Cotality MCP tools.
- **ICC creds + onboarding** for the A117.1 + IRC live-ingest (accessibility corpus #66 is credential-pending on these).
- The relevant fixes/builds landed (incl. the legacy-design-tools `@workspace/db` fixture-drift CI fix so PRs go green).

## Wiring, per service

### 1. hauska-mcp-server (the gate) — `hauska-prod-497015`

- Set `HAUSKA_BACKEND_URL` -> `https://hauska-retrieval-api-h7gvu7rgcq-uc.a.run.app` (currently the literal placeholder). This is the single most important wire: it is why engine-backed tools are dark.
- Set `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` to the real Upstash values (URL is currently a placeholder; the token is a secret ref).
- Confirm `LEGACY_BACKEND_URL` stays `https://cortex-api-tds7av26va-uc.a.run.app` (already correct).
- Deploy the revision carrying the +11 Tier-1 Layer-2 wraps (PR #25 merged): the tool surface goes 46 -> 57. Marketing/collateral uses 46 until this is live (76d capability matrix v1.1).
- Widen the cortex dependency-probe timeout (currently ~2s, which the cortex cold-start exceeds and reports as `aborted`) or accept cold-start as a known transient. Do NOT silence the probe by relaxing it past a real reachability check.

### 2. cortex-api — `legacy-design-tools-prod`

- Deploy the latest-ready revision to 100% traffic (clears the cortex revision-drift alert, [`76e`](../76e_platform_observability_sprint.md) finding 1; `00119-laq` -> the ready `00090-vf9` or newer).
- Ensure the Python sidecar `requirements.txt` (pysheds) is baked into the Cloud Run image so the hydrology engine works in prod (the pysheds-not-baked gap noted in `00`).

### 3. hauska-retrieval-api — `hauska-prod-497015`

- Merge PR #68 (`/healthz` corpus + substrate Neon observability) and deploy, so the gate's retrieval uptime check has a real endpoint to hit once `HAUSKA_BACKEND_URL` is wired.

### 4. SDK metering

- Confirm the Circle fiat rail + revenue routing + gate metering (hauska-sdk #1) is wired and emitting on gated calls once the gate serves real engine-backed tools.

## Post-deploy verification (run these, paste verbatim)

- `curl -sk https://hauska-mcp-server-h7gvu7rgcq-uc.a.run.app/health` -> `status: ok` with `engine_retrieval_api: ok`, `cortex_api: ok`, `upstash: ok`, `postgres: ok` (no `down`, no placeholder fetch-fail). (Curl needs `-k`; the planning host has a TLS-intercepting proxy.)
- Gate probe three cases: anonymous -> `public`; valid product key -> product; malformed key -> 401 (`X-Hauska-Key`).
- Tool count is 57 (46 + 11 Tier-1).
- Cloud Monitoring uptime checks green for both hauska-prod services; the cortex revision-drift alert clears.
- **Retire the `Hauska stale-revision traffic drift (mcp + retrieval)` policy** ([`76e`](../76e_platform_observability_sprint.md) finding 3) once #27's synthetic uptime checks generate steady traffic; delete the always-true test policy `8570526367601301438`.
- GTM E5 external-caller validation (gated on this deploy) can now run; Decision C unpins.

## What this deploy unblocks (the multi-lane payoff)

GTM Decision C unpin, the +11 Tier-1 tools live, SDK metering, the cortex-api drift alert clearing, 76e finding 1/2 resolving, and the engine-extraction lift ([`56`](../56_engine_extraction_sprint.md) steps 3-6, held behind this deploy because step 5 cannot cut consumers onto a gate that is not wired to the engine).

## Revision history

- **2026-06-08 (origin):** Filed after the live probe found the deployed gate running placeholder backend URLs. Pins the exact wiring (gate -> retrieval URL, upstash, cortex probe timeout, +11 tools, cortex drift, retrieval #68, SDK metering) and the post-deploy verification, so the deferred build-out deploy executes once and does not repeat the placeholder gap.
