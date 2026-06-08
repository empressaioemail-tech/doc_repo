---
id: 2026-06-07_hauska-engine_cc-agent-E_retrieval_healthz
title: cc-agent-E — retrieval-api /healthz (corpus + substrate Neon)
date: 2026-06-07
agent: cc-agent-E
repo: hauska-engine
dispatch: 2026-06-07_cc-agent-E_retrieval_api_healthz
status: complete — PR held for operator merge; prod deploy verified
model: Grok Build 0.1 (default; no escalation)
---

# Retrieval-api /healthz — cc-agent-E report

## Workspace hygiene (verbatim)

**Clone:** `P:\hauska-engine` on `main`, clean at dispatch entry.

```
On branch main
Your branch is up to date with 'origin/main'.

nothing to commit, working tree clean
```

```
88e51d9 feat(engine): scaffold engine-api home (ADR-008 step 1) (#67)
5269751 feat(corpus): ingest ADA 2010 and FHA Design Manual accessibility standards (#66)
7e142fb Merge pull request #65 from empressaioemail-tech/feat/property-workspace-atom-pipeline
```

Work executed on branch `chore/retrieval-api-healthz` from the clean primary clone.

## Atoms touched

- `current-state:portfolio` — substrate build-out merged, deploy deferred; observability Wave A fire-ready (2026-06-07)
- `service:hauska-retrieval-api` — read-only corpus retrieval on `hauska-prod-497015`, port 8080 (not yet in `_catalog/atoms_index.md`; inferred from `76e_platform_observability_sprint.md` verified surface table)
- `76e_platform_observability_sprint` — signal-emit contract pinned

## Deliverables

| Item | Status |
|------|--------|
| `GET /healthz` returns `{status, db, corpus}` | Done |
| Substrate Neon `SELECT 1` probe when `SUBSTRATE_DATABASE_URL` / `DATABASE_URL` set | Done |
| Corpus atom count via `storage.countAtoms()`; zero → HTTP 503 / `fail` | Done |
| Structured Cloud Logging emit (`hauska_health=true`, `check: healthz`) | Done |
| Tests + typecheck green | Done — 14/14 packages typecheck; retrieval-api 18/18 tests |
| PR held for operator merge | **https://github.com/empressaioemail-tech/hauska-engine/pull/68** |
| Prod deploy + curl verification | Done — revision `hauska-retrieval-api-00006-2lq` |

## PR + SHA

- **Branch:** `chore/retrieval-api-healthz`
- **SHA:** `c175d6f5003cb185a728103e35ab08e0571e4348`
- **PR:** https://github.com/empressaioemail-tech/hauska-engine/pull/68

## Implementation summary

- **`services/retrieval-api/src/healthz.ts`** — payload builder, status derivation (`ok` / `warn` / `fail`), signal emit
- **`services/retrieval-api/src/substrate-db-probe.ts`** — short-lived `postgres` `SELECT 1` liveness probe
- **`services/retrieval-api/src/server.ts`** — `GET /healthz` + `GET /healthz/` (auth bypass); existing `/health` unchanged
- **`packages/storage`** — `StoragePort.countAtoms()` + `InMemoryStorage` implementation
- **`services/retrieval-api/DEPLOY.md`** — health surface + Cloud Run GFE note

### Status rules

| Condition | `status` | HTTP |
|-----------|----------|------|
| `corpus.atomCount === 0` | `fail` | 503 |
| DB configured but probe fails | `fail` | 503 |
| DB not configured, corpus loaded | `warn` | 200 |
| DB up, corpus loaded | `ok` | 200 |

Prod today is snapshot-only (no `SUBSTRATE_DATABASE_URL` on Cloud Run) → **`warn`** with `atomCount: 21126`.

## Verification artifacts (HR-8, verbatim)

### `gcloud run revisions list`

```
REVISION: hauska-retrieval-api-00006-2lq
ACTIVE: yes
SERVICE: hauska-retrieval-api
DEPLOYED: 2026-06-07 21:01:35 UTC
DEPLOYED BY: empressaioemail@gmail.com

REVISION: hauska-retrieval-api-00005-mnr
ACTIVE:
SERVICE: hauska-retrieval-api
DEPLOYED: 2026-06-07 20:57:53 UTC

REVISION: hauska-retrieval-api-00004-m9t
ACTIVE:
SERVICE: hauska-retrieval-api
DEPLOYED: 2026-05-26 17:27:51 UTC
```

### `/healthz/` response (prod, serving revision)

```
curl -sS --ssl-no-revoke https://hauska-retrieval-api-172690833726.us-central1.run.app/healthz/
```

```json
{"status":"warn","db":{"ok":false,"status":"not_configured","source":"env:SUBSTRATE_DATABASE_URL|DATABASE_URL"},"corpus":{"ok":true,"atomCount":21126,"source":"storage:countAtoms"}}
```

HTTP 200.

### Cloud Run GFE reserved-path finding

Exact `GET /healthz` (no trailing slash) on Cloud Run returns a **Google-branded 404** before the request reaches the container. `GET /healthz/` reaches the handler and returns the contract payload. Documented in `DEPLOY.md`; cc-agent-M uptime dispatch and cc-agent-C hub should poll **`/healthz/`** for this service on Cloud Run.

Local verification (snapshot loaded):

```json
{"status":"warn","db":{"ok":false,"status":"not_configured","source":"env:SUBSTRATE_DATABASE_URL|DATABASE_URL"},"corpus":{"ok":true,"atomCount":21126,"source":"storage:countAtoms"}}
```

### Signal emit sample (from test run)

```json
{"hauska_health":true,"check":"healthz","service":"hauska-retrieval-api","status":"warn","value":"corpus=21126;db=not_configured","threshold":"corpus>0;db=up","source":"GET /healthz","ts":"2026-06-07T21:01:35.000Z"}
```

## Blockers / follow-ons

1. **Operator merge PR #68** — deploy already applied from branch for verification; merge to `main` for canonical CI history.
2. **`SUBSTRATE_DATABASE_URL` not wired on Cloud Run** — db field stays `not_configured` / overall `warn` until operator adds the substrate Neon secret (expected while retrieval-api remains snapshot-only per `DEPLOY.md`).
3. **Cloud Run `/healthz` GFE reservation** — uptime checks and hub must use `/healthz/` on this service; flag to cc-agent-M and cc-agent-C dispatches.
4. **hauska-cortex MCP unavailable** this session (`STATUS.md`: server errored) — atoms resolved from canonical docs instead.
