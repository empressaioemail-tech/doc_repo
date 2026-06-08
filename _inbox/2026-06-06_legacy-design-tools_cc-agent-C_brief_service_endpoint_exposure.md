---
id: 2026-06-06_legacy-design-tools_cc-agent-C_brief_service_endpoint_exposure
title: Session report — cc-agent-C brief service endpoint exposure
date: 2026-06-06
agent: cc-agent-C
repo: legacy-design-tools
branch: cortex/brief-service-endpoint-exposure
status: merged
model: Grok Build 0.1 (default)
merged_at: 2026-06-07
---

# cc-agent-C — brief service endpoint exposure

## Atom refs touched

- `mcp-offer:52` §3a — service seam for `generate_property_brief` / place-scoped hydrology
- `current-state:portfolio` — MCP build-out lane (coordination with cc-agent-M)

## Workspace hygiene (verbatim)

```
On branch cortex/brief-service-endpoint-exposure
Your branch is up to date with 'origin/main'.

Modified (implementation):
  artifacts/api-server/src/middlewares/brokerageAuth.ts
  artifacts/api-server/src/middlewares/brokerageCors.ts
  artifacts/api-server/src/routes/brokerageBrief.ts
  + new: brokerageServiceAuth.ts, brokerageMetering.ts, mcpPlaceEngagement.ts,
         brokeragePlaceHydrology.ts, README-brokerage-mcp-service.md, tests

Submodule noise (pre-existing, not staged):
  .claude/worktrees/recon-add-jurisdiction (untracked content)
  .claude/worktrees/track-b-ifc-ingest (modified content, untracked content)
```

Branch SHA at session end: `13e568fcad001f361633936bac34f31e4f2bf56f` (feature commit)

## PR / merge (closed)

| Field | Value |
|---|---|
| PR | https://github.com/empressaioemail-tech/legacy-design-tools/pull/144 |
| Branch | `cortex/brief-service-endpoint-exposure` |
| Feature SHA | `13e568fcad001f361633936bac34f31e4f2bf56f` |
| Merge commit on `main` | `6182dbd` — Merge pull request #144 |
| `origin/main` after merge | `6182dbd` (verified 2026-06-07 via `git fetch origin`) |

**Status: merged.** cc-agent-M may wire `legacy-client.ts` against `artifacts/api-server/README-brokerage-mcp-service.md`.

## Blockers (verbatim)

1. ~~Local test execution blocked~~ — CI on PR #144 is the authority; local still lacks `DATABASE_URL` on cente workstation.
2. Submodule dirty state in `.claude/worktrees/*` — pre-existing, not part of this patch

## Escalation

None — Grok Build 0.1 completed without Claude escalation.

## Revision history

- **2026-06-07** — PR #144 merged to `main` (`6182dbd`). Closeout update.
- **2026-06-06** — Initial session report (implementation + contract for cc-agent-M).

## Delivered

### 1. Service-to-service auth for brief

- New middleware `requireBrokerageAuthOrServiceToken` accepts **either** `SERVICE_API_KEY` bearer (MCP) **or** existing brokerage extension keys.
- Service callers set `req.brokerageServiceCaller = true` and `req.serviceAuth.tenantId`.
- `POST /api/brokerage/v1/brief` and `GET /api/brokerage/v1/brief/:runId` work without `X-Hauska-Install-Id`.
- Contract doc: `artifacts/api-server/README-brokerage-mcp-service.md`.

### 2. Metering hook (observable, not charging)

- Service-path POST brief skips wallet 402 (`assertComputeAllowed` not reached when `brokerageServiceCaller`).
- Billable signal on successful POST:
  - Header: `X-Hauska-Billable: property-brief-v1`
  - Body: `meta.metering: { billable: true, sku: "property-brief-v1" }`
- GET run by id is read-only (no billable header).

### 3. Place-scoped drainage / topography (fast-follow)

- Routes on `/api/brokerage/v1/place/*` (same auth as brief):
  - `POST .../place/site-topography/refresh` (+ `/:placeKey/...` variant)
  - `GET .../place/:placeKey/site-topography`
  - `POST .../place/site-drainage/refresh` (+ `/:placeKey/...` variant)
  - `GET .../place/:placeKey/site-drainage`
- `ensureMcpPlaceEngagement` creates/reuses deterministic engagement `mcp-place:{placeKey}` and delegates to existing ingest workers.

## Service-path contract for cc-agent-M

| Item | Value |
|---|---|
| Auth header | `Authorization: Bearer ${LEGACY_BACKEND_API_KEY}` |
| Env pairing | cortex-api `SERVICE_API_KEY` = mcp-server `LEGACY_BACKEND_API_KEY` |
| Install id | **omit** `X-Hauska-Install-Id` |
| Brief POST | `POST /api/brokerage/v1/brief` — same JSON body as extension |
| Brief GET | `GET /api/brokerage/v1/brief/{runId}` |
| Billable (POST only) | Header `X-Hauska-Billable: property-brief-v1`; body `meta.metering` |
| 401 | `{ "error": "unauthorized", "message": "Valid Authorization Bearer (service token or brokerage key) or X-Hauska-Key required" }` |
| 402 | **not returned** on service path for brief |
| Place topo | `POST /api/brokerage/v1/place/site-topography/refresh` with `{ "address": "..." }` |
| Place drainage | `POST /api/brokerage/v1/place/site-drainage/refresh` with `{ "address": "..." }` |

Full shapes: `artifacts/api-server/README-brokerage-mcp-service.md`.

## Verification artifacts

### Typecheck (verbatim)

```
pnpm --filter @workspace/api-server run typecheck
> tsc -p tsconfig.json --noEmit
(exit 0)
```

### Tests

**Blocker:** No `DATABASE_URL` in this workstation clone (no `.env.local`). Route integration tests (`brokerageBrief.test.ts`) and middleware test that imports `session.ts` require a provisioned Postgres test DB per `lib/db/testing`.

Tests added (expect green in CI / local with `DATABASE_URL`):

- `src/middlewares/__tests__/brokerageServiceAuth.test.ts`
- Extended `src/__tests__/brokerageBrief.test.ts` — service token brief + GET runId

Run when DB available:

```
cd artifacts/api-server
pnpm exec vitest run src/middlewares/__tests__/brokerageServiceAuth.test.ts src/__tests__/brokerageBrief.test.ts
```

