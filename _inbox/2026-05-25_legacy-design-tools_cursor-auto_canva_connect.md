# Courier — Canva Connect API (legacy-design-tools)

**Date:** 2026-05-25  
**Repo:** `P:\legacy-design-tools` (empressaioemail-tech/legacy-design-tools)  
**Agent:** cursor-auto (Cursor)  
**Topic:** Wire Canva Connect for Design Accelerator — api-server + OpenAPI + portal-ui + design-tools

---

## Status

**Complete in working tree** — not committed or pushed by this agent. No PR opened.

---

## What changed

### Database (`lib/db`)
- New schema: `lib/db/src/schema/canva.ts` — `canva_connections`, `canva_oauth_states`, `canva_push_jobs`, `canva_design_pushes`
- Migration: `lib/db/drizzle/0020_add_canva.sql`
- Export added in `lib/db/src/schema/index.ts`

### API server (`artifacts/api-server`)
- Router: `src/routes/canva.ts` (registered in `src/routes/index.ts`)
- Lib: `src/lib/canva/` — `config`, `oauth`, `client`, `store`, `assets`, `catalog`, `pushWorker`, `wireTypes`
- Endpoints:
  - `GET /api/canva/connection`
  - `DELETE /api/canva/connection`
  - `POST /api/canva/oauth/start`
  - `GET /api/canva/oauth/callback`
  - `POST /api/canva/oauth/dev-connect` (non-prod only, when `CANVA_CLIENT_ID` unset)
  - `GET /api/canva/brand-templates`
  - `GET /api/engagements/:engagementId/canva/assets`
  - `GET /api/engagements/:engagementId/canva/designs`
  - `POST /api/engagements/:engagementId/canva/push` → `202 { jobId }`
  - `GET /api/canva/push-jobs/:jobId`
- Env docs: `artifacts/api-server/README-canva.md`
- Tests: `src/__tests__/canva-route.test.ts`; truncate list updated in `src/__tests__/setup.ts`

### OpenAPI & codegen
- Patch script: `scripts/patch-openapi-canva.mjs` (CRLF-safe insert into `lib/api-spec/openapi.yaml`)
- Codegen run locally: `pnpm --filter @workspace/api-spec codegen` (succeeded)

### Frontend (`lib/portal-ui`, `artifacts/design-tools`)
- `lib/portal-ui/src/canva/apiCanvaIntegrationService.ts` — live `CanvaIntegrationService` via `@workspace/api-client-react`
- `connectCanvaAccount()` / `disconnectCanvaAccount()` exported from `lib/portal-ui/src/index.ts`
- `artifacts/design-tools/src/lib/canvaService.ts` — API default; mock when `VITE_CANVA_API=0`
- `ClientMaterialsTab.tsx` — Connect / Reconnect / Disconnect wired to API (no more inline demo state)

### Unchanged (by design)
- `lib/portal-ui/src/canva/mockCanvaIntegrationService.ts` and `Canva*.tsx` UI components kept for Storybook/tests

---

## Verification (ran)

```powershell
cd P:\legacy-design-tools
pnpm --filter @workspace/api-spec codegen   # OK
pnpm run typecheck                            # OK (all artifacts)
```

```powershell
# Route tests — requires DATABASE_URL + test Postgres (not set in agent shell)
pnpm --filter @workspace/api-server run test -- src/__tests__/canva-route.test.ts
```

---

## Local QA (orchestrator / Empressa)

1. Apply migration `lib/db/drizzle/0020_add_canva.sql` (or `db:push` in your env).
2. Terminal 1: `$env:PORT='8080'; pnpm --filter @workspace/api-server run dev`
3. Terminal 2: `$env:PORT='20295'; $env:BASE_PATH='/'; pnpm --filter @workspace/design-tools run dev`
4. Path: engagement → **Deliver → Client materials**
5. **Without Canva app credentials:** Connect → `POST /api/canva/oauth/dev-connect` → push completes with stub `designUrl`
6. **With credentials:** set `CANVA_CLIENT_ID`, `CANVA_CLIENT_SECRET`, `CANVA_REDIRECT_URI=http://localhost:8080/api/canva/oauth/callback` → Connect → OAuth → real autofill when Enterprise + tokens valid

---

## Deploy pin

None — out of scope per task.

---

## Blockers / follow-ups

| Item | Notes |
|------|--------|
| **Commit + PR** | Orchestrator to review diff, commit, open PR via GitHub UI (no `gh` in this env). |
| **Schema fixture** | If CI runs `lib/db` fixture drift test, refresh fixture after applying `0020` (`pnpm db:push:test` + `pnpm db:dump:test-fixture` in `lib/db`). |
| **api-server tests** | `canva-route.test.ts` written; not executed here — `DATABASE_URL` unset. |
| **design-tools tests** | Not run this slice; optional MSW handlers not added. |
| **Real Canva QA** | Needs Developer Portal app + Enterprise brand templates + redirect URL registered. |

---

## Acceptance criteria (task checklist)

- [x] Six core endpoints + designs history + OAuth callback + dev-connect
- [x] OpenAPI typed; codegen run
- [x] `pnpm run typecheck` passes
- [x] Route tests added (DB-dependent)
- [x] `canvaService.ts` switched to API client; mock retained via env
- [ ] End-to-end local QA on `localhost:20295` — **human/orchestrator** (migration + stack)

---

## Key files (quick grep)

`artifacts/api-server/src/routes/canva.ts`, `lib/portal-ui/src/canva/apiCanvaIntegrationService.ts`, `lib/api-spec/openapi.yaml` (canva paths), `lib/db/drizzle/0020_add_canva.sql`
