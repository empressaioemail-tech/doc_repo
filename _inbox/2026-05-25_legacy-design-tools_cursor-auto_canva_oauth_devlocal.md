# Courier — Canva OAuth + dev:local script

**Date:** 2026-05-25  
**Repo:** `P:\legacy-design-tools`  
**Branch:** `fix/canva-oauth-local` (expected)  
**Agent:** cursor-auto  
**Topic:** dev-local-windows.ps1 → dev:local; OAuth connect fix; UI soft-light Connect button

---

## Status

**Complete in working tree** — not committed. No deploy.

---

## Files changed

| File | Change |
|------|--------|
| `scripts/dev-local-windows.ps1` | API terminal uses `dev:local`, `NODE_ENV=development`, `DATABASE_URL` warning, Canva migration note; status text says **local api-server** (not proxy) |
| `lib/portal-ui/src/canva/apiCanvaIntegrationService.ts` | `connectCanvaAccount()` — OAuth redirect on success; **503-only** dev-connect fallback; rethrows other errors |
| `artifacts/design-tools/src/components/engagement-detail/ClientMaterialsTab.tsx` | OAuth return `?canva=connected` URL cleanup + refresh; connect only refreshes on dev-connect (not before redirect) |
| `artifacts/api-server/README-canva.md` | dev:local vs proxy, scopes, troubleshooting table, connect flow |
| `lib/portal-ui/src/styles/smartcity-soft-light.css` | `.canva-connection-banner-actions .sc-btn-primary` #0284c7 / #fff on soft-light |

**Verified unchanged (prior slice):** `artifacts/api-server/src/routes/canva.ts`, `0020_add_canva.sql`, OpenAPI/codegen, `canvaService.ts`, `smartcity-components.css` Canva banner styles.

---

## PART A acceptance

- Script runs `pnpm --filter @workspace/api-server run dev:local` (no `dev-proxy.mjs` / `[dev-proxy]` log line).
- After boot: `GET http://localhost:8080/api/canva/connection` → local JSON (e.g. `{"state":"disconnected"}`).

---

## PART B — OAuth behavior

| Config | Connect button |
|--------|----------------|
| `CANVA_CLIENT_ID` + `CANVA_CLIENT_SECRET` set | `POST /api/canva/oauth/start` → redirect to Canva → callback → `CANVA_OAUTH_SUCCESS_URL?canva=connected` |
| Credentials **unset** | `oauth/start` → **503** → `POST /api/canva/oauth/dev-connect` (non-prod only) |

`dev-connect` returns **404** when credentials **are** configured (prevents fake tokens with real Canva API).

---

## QA commands

```powershell
cd P:\legacy-design-tools
$env:DATABASE_URL = 'postgresql://...'   # required
cd lib/db; pnpm run push                 # 0020_add_canva

# T1
$env:PORT='8080'; $env:NODE_ENV='development'
$env:CANVA_CLIENT_ID='...'; $env:CANVA_CLIENT_SECRET='...'
$env:CANVA_REDIRECT_URI='http://localhost:8080/api/canva/oauth/callback'
$env:CANVA_OAUTH_SUCCESS_URL='http://localhost:20295/'
pnpm --filter @workspace/api-server run dev:local

# T2 (no VITE_CANVA_API=0)
$env:PORT='20295'; $env:BASE_PATH='/'
pnpm --filter @workspace/design-tools run dev

# Or: .\scripts\dev-local-windows.ps1

curl http://localhost:8080/api/canva/connection
```

```powershell
pnpm --filter @workspace/api-server run typecheck    # OK (this slice)
pnpm --filter @workspace/design-tools run typecheck  # OK (this slice)
# Full `pnpm run typecheck` may fail on unrelated lib/portal-ui viewCubeCamera.ts (pre-existing)
pnpm --filter @workspace/api-server run test -- src/__tests__/canva-route.test.ts  # needs DATABASE_URL
```

---

## OAuth tested

| Mode | Agent ran? |
|------|------------|
| Real OAuth (credentials + Canva Portal redirect) | **No** — human QA on `localhost:20295` |
| dev-connect only | Logic verified in code; route test from prior slice |

---

## Blockers

- Full-repo `pnpm run typecheck` fails on `lib/portal-ui/src/components/viewCubeCamera.ts` (unrelated to this handoff).
- Real OAuth E2E requires human: Canva app + Enterprise + `DATABASE_URL` + migration push.
- Commit/PR: orchestrator.

---

## Deploy pin

None.
