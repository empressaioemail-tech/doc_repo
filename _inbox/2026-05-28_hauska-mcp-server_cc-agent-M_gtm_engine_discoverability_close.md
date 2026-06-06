---
id: 2026-05-28_hauska-mcp-server_cc-agent-M_gtm_engine_discoverability_close
title: Close — GTM engine Track M (hauska-mcp-server)
date: 2026-05-28
agent: cc-agent-M
repo: hauska-mcp-server
branch: feat/gtm-engine-discoverability
---

# Track M close report — GTM engine discoverability

## Summary

Shipped Track M deliverables on branch `feat/gtm-engine-discoverability` (based on
`feat/brokerage-workspace-mcp-surface`): docs site content for `hauska.dev/mcp`,
`llms.txt` + `.well-known/agents.txt`, 46-tool LLM description pass, place MCP
tools (feature-flagged), GTM structured logging + `gtm/mcp-event` hook,
`docs/gtm/` registry drafts (unpublished), and `examples/place-dossier-agent`.

**Public claim (honest):** Texas building code MCP + property workspace read API.

## PR / SHAs

| Item | Value |
|------|--------|
| Branch | `feat/gtm-engine-discoverability` |
| Commit (main) | `0842d07` (squash merge PR #24) |
| PR | https://github.com/empressaioemail-tech/hauska-mcp-server/pull/24 (merged) |

## Deploy revision

| Field | Value |
|-------|--------|
| Status | **Deployed 2026-05-29** — Cloud Build `0a18cf9d-5a18-4d6e-9a44-6ae8c9d07950` SUCCESS |
| Latest revision | `hauska-mcp-server-00004-t5c` |
| Service URL | https://hauska-mcp-server-h7gvu7rgcq-uc.a.run.app |
| Post-deploy env | Set `PLACE_API_ENABLED=true`, `HAUSKA_INTERNAL_KEY_HASHES`, `GTM_MCP_EVENT_API_KEY`, `COVERAGE_API_URL` on Cloud Run revision |

## Docs URLs (after DNS + deploy)

| URL | Purpose |
|-----|---------|
| https://hauska.dev/mcp | MCP landing (`/mcp` → `/docs/mcp.html`) |
| https://hauska.dev/llms.txt | Agent discovery (E2) |
| https://hauska.dev/.well-known/agents.txt | Agent discovery (E2) |
| https://hauska.dev/mcp/coverage | Coverage embed redirect |
| https://mcp.hauska.dev/mcp | MCP transport |
| https://mcp.hauska.dev/docs | Alternate docs host |

## Example agent URL

https://github.com/empressaioemail-tech/hauska-mcp-server/tree/feat/gtm-engine-discoverability/examples/place-dossier-agent

## Sprint exit checklist (M lane)

| Exit | Status | Notes |
|------|--------|-------|
| E1 hauska.dev/mcp | **Code ready** | Express `/mcp` redirect; DNS operator (N2) |
| E2 llms.txt + agents.txt | **Code ready** | Built into `docs/site/` at deploy |
| E3 coverage page | **Code ready** | `coverage.html` embeds `COVERAGE_API_URL` |
| E4 registry packages | **Done** | `docs/gtm/` drafts only — not submitted |
| E5 first external caller | **Instrumentation ready** | Filter below; no prod traffic verified |
| E9 place tools probe | **Blocked on C + flag** | `PLACE_API_ENABLED=true` + cortex place routes |
| E10 40-tool audit | **Done** (46 tools)** | Public/place/workspace in `tool-copy.ts`; codex/cortex tier suffix |
| E11 example agent | **Done** | `examples/place-dossier-agent` |

## Cloud Logging — first external caller (E5)

```
resource.type="cloud_run_revision"
resource.labels.service_name="hauska-mcp-server"
jsonPayload.event="tool_call"
jsonPayload.is_external=true
```

Sample query (Logs Explorer):

```
resource.type="cloud_run_revision"
resource.labels.service_name="hauska-mcp-server"
jsonPayload.event="tool_call"
jsonPayload.is_external=true
timestamp>="2026-05-28T00:00:00Z"
```

Configure operator hashes:

```
HAUSKA_INTERNAL_KEY_HASHES=<sha256 from api_keys.key_hash, comma-separated>
```

## MCP Inspector

```powershell
$env:HAUSKA_DEV_MODE='true'
$env:PLACE_API_ENABLED='true'   # after cc-agent-C routes on LEGACY_BACKEND_URL
pnpm dev
.\scripts\mcp-inspector-place.ps1
```

Pilot coords: Bastrop `1311 Main St, Bastrop, TX 78602`; Cedar Hill per 75b manifest.

## Blockers (verbatim)

1. **cc-agent-C place HTTP routes** — `POST /api/brokerage/v1/place/resolve`, `GET .../layers`, `GET .../dossier` must be merged on `legacy-design-tools` before `PLACE_API_ENABLED=true` in prod. MCP client methods are wired; default flag is `false`.

2. **`POST /api/brokerage/v1/gtm/mcp-event`** — MCP server posts when `GTM_MCP_EVENT_API_KEY` (or `LEGACY_BACKEND_API_KEY`) is set. Verify C track route accepts close-report sample payload.

3. **DNS (operator N2)** — `hauska.dev/mcp`, `hauska.dev/llms.txt`, `mcp.hauska.dev` mapping per `deploy/README.md` (hauska.dev domain verification pending on GCP).

4. **E5 evidence** — No first external `key_hash` observed in prod this session (deploy not executed).

5. **Capability matrix sign-off (E7)** — Planner reconcile after C deploy + `list_jurisdictions` Path A parity check.

## Tests

```
pnpm test  → 227 pass (includes tests/gtm-observability.test.ts)
pnpm lint  → clean
pnpm run build:docs → 16 pages + llms.txt + agents.txt
```

## Files touched (high signal)

- `src/gtm-observability.ts`, `src/tool-copy.ts`, `src/tools.ts` (place tools + logToolInvocation)
- `src/legacy-client.ts` (place API client)
- `scripts/build-docs.ts`, `src/index.ts` (discovery routes)
- `docs/content/*`, `docs/gtm/*`
- `examples/place-dossier-agent/*`
