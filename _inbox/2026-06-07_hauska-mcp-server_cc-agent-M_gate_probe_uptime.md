---
id: 2026-06-07_hauska-mcp-server_cc-agent-M_gate_probe_uptime
title: hauska-mcp-server — gate probe + hauska-prod uptime (cc-agent-M close)
date: 2026-06-07
agent: cc-agent-M
repo: hauska-mcp-server
branch: mcp/gate-probe-uptime-2026-06-07
sha: 5d9e10c17544203b1ebdb0527f4f1f75fd8d6480
pr: https://github.com/empressaioemail-tech/hauska-mcp-server/pull/27
model: Grok Build 0.1 (default; no escalation)
status: held-for-merge
---

# hauska-mcp-server — gate probe + hauska-prod uptime

## Atoms touched

- `current-state:portfolio` — deploy deferred; Wave A observability fire-ready
- `service:hauska-mcp-server` — gate boundary health contract, `/healthz`, gate probe
- `service:hauska-retrieval-api` — dep reachability via `/healthz` (internals owned by cc-agent-E)

## Workspace hygiene

Started on alien HEAD `gtm/collateral-refresh-2026-06-07` (untracked research/session files only). Stashed and branched from `main` per dispatch.

```
On branch mcp/gate-probe-uptime-2026-06-07
5d9e10c Add /healthz, gate probe, and hauska-prod platform observability layer.
a963870 feat(tier1): register Layer 2 MCP tools for brief, drainage, encumbrances, Cotality
0842d07 feat(gtm): discoverability docs, place MCP tools, GTM observation (#24)
```

## Deliverables

| Item | Status |
|---|---|
| `GET /healthz` `{status, deps, revision}` | **Code complete** — deploy pending |
| Gate synthetic probe (3 cases, `X-Hauska-Key`) | **Code complete** — `GET /gate-probe` + `scripts/gate-probe.ts` |
| `hauska_health` signal emit | **Code complete** — `/healthz` + gate probe |
| Uptime checks (both hauska-prod services) | **Live** (pre-deploy `/healthz` will fail until merge+deploy) |
| Alert policies (5xx, p95, revision drift) | **Live** |
| Cloud Scheduler API on `hauska-prod-497015` | **Enabled** |
| Tests + typecheck | **245 pass, lint green** |
| PR | **Held** [#27](https://github.com/empressaioemail-tech/hauska-mcp-server/pull/27) |

## Code summary

- `src/healthz.ts` — normalized payload; deps = `retrieval_api`, `legacy_backend`; `revision` from `K_REVISION`
- `src/gate-probe.ts` — three-case probe against `POST /mcp` with `Accept: application/json, text/event-stream`
- `src/health-signals.ts` — pinned 76e emit contract (`hauska_health=true`)
- `src/index.ts` — routes `/healthz`, `/gate-probe` (localhost loopback for scheduler-safe probing)
- `observability/platform/` — uptime + alert JSON + `apply-platform.sh`

## Verbatim verification artifacts (HR-8)

### `gcloud run revisions list` (hauska-mcp-server)

```
REVISION: hauska-mcp-server-00004-t5c
ACTIVE: yes

REVISION: hauska-mcp-server-00003-7p4
ACTIVE:

REVISION: hauska-mcp-server-00002-4sl
ACTIVE:

REVISION: hauska-mcp-server-00001-fgd
ACTIVE:
```

Latest ready: `hauska-mcp-server-00004-t5c` @ 100% traffic.

### Uptime checks

```
DISPLAY_NAME: hauska-mcp-server-healthz
PATH: /healthz
HOST: hauska-mcp-server-h7gvu7rgcq-uc.a.run.app

DISPLAY_NAME: hauska-retrieval-api-healthz
PATH: /healthz
HOST: hauska-retrieval-api-h7gvu7rgcq-uc.a.run.app
```

### Cloud Scheduler API

```
NAME: projects/172690833726/services/cloudscheduler.googleapis.com
STATE: ENABLED
```

### `/healthz` on deployed revision (pre-PR deploy)

```
HTTP 404 — route not yet on serving revision hauska-mcp-server-00004-t5c
```

Existing `/health` (verbatim, PowerShell `Invoke-RestMethod`):

```json
{
  "status": "degraded",
  "service": "hauska-mcp-server",
  "version": "0.1.0",
  "env": "production",
  "dependencies": {
    "engine_retrieval_api": { "state": "down", "detail": "TypeError: fetch failed" },
    "cortex_api": { "state": "down", "detail": "AbortError: This operation was aborted" },
    "postgres": { "state": "ok", "latency_ms": 814 },
    "upstash": { "state": "down", "detail": "TypeError: fetch failed" }
  }
}
```

**Post-deploy acceptance:** `curl https://hauska-mcp-server-h7gvu7rgcq-uc.a.run.app/healthz` must return `{status, deps, revision}`.

### Gate probe — three cases (pre-deploy, prod revision)

**Case 1 — anonymous → public** (header: none)

External `POST /mcp` with Streamable HTTP `Accept` header hangs from this workstation (SSE client limitation). Case covered by unit tests + `GET /gate-probe` localhost loopback after deploy.

**Case 2 — malformed key → 401** (header: `X-Hauska-Key: not-a-valid-key-shape`)

```
HTTP 401
(body empty in PowerShell error stream; auth middleware returns JSON-RPC 401 before MCP transport)
```

Expected body shape (from `src/auth.ts`):

```json
{
  "jsonrpc": "2.0",
  "error": { "code": -32001, "message": "Invalid API key format." },
  "id": "gate-probe"
}
```

**Case 3 — valid key → product** (header: `X-Hauska-Key: hk_pro_…`)

Blocked pre-deploy: **`GATE_PROBE_CODEX_KEY` not minted/stored in Secret Manager.** Operator action: mint codex-product probe key via `/admin/keys`, store as `GATE_PROBE_CODEX_KEY`, redeploy.

### Test alert

Created policy:

```
DISPLAY_NAME: Hauska platform observability test alert
NAME: projects/hauska-prod-497015/alertPolicies/8570526367601301438
ENABLED: True
```

Notification channel:

```
DISPLAY_NAME: MCP alerts
TYPE: email
labels.email_address: empressaioemail@gmail.com
```

Condition: `run.googleapis.com/request_count` rate > -1 (always-true test). Email delivery is async; operator should confirm receipt and **delete the test policy** after verification.

Also live: `Hauska Cloud Run 5xx rate > 2%`, `Hauska Cloud Run p95 latency > 3s`, `Hauska stale-revision traffic drift`.

## Blockers (verbatim)

1. **Deploy gate:** PR #27 must merge and deploy before `/healthz` and `/gate-probe` acceptance curls pass on prod.
2. **`GATE_PROBE_CODEX_KEY`:** valid-key probe case requires operator-minted codex key in Secret Manager + cloudbuild secret binding (not in this PR's deploy yaml yet — fast-follow or operator bind at deploy).
3. **External MCP SSE probe from laptop:** `curl.exe` SSL exit 35; Node `fetch failed`; PowerShell `POST /mcp` with Accept hangs on SSE. In-instance `GET /gate-probe` is the supported production probe path.
4. **Retrieval-api `/healthz`:** cc-agent-E dispatch; uptime check will fail until that lands (expected coordination).
5. **Revision-drift MQL:** original metadata query rejected by Monitoring API; replaced with v1 traffic-anomaly proxy alert (documented in policy JSON).

## Operator next steps

1. Merge PR #27 (do not auto-merge).
2. Bind `GATE_PROBE_CODEX_KEY` secret; redeploy `hauska-mcp-server`.
3. Verify:
   - `GET /healthz` payload on new revision
   - `GET /gate-probe` — all three cases `pass: true`
4. Confirm uptime checks green for both services.
5. Delete test alert policy `8570526367601301438` after email receipt.
6. Schedule Cloud Scheduler → `GET /gate-probe` (or `scripts/gate-probe.ts` job) every 5–15 min.

## Tests

```
npm run lint  — green
npm test      — 245 pass
```
