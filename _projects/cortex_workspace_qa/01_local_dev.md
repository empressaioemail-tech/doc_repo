---
id: cortex_workspace_qa/01_local_dev
title: Local dev setup — cortex workspace + hauska-map
status: active
last_updated: 2026-07-01
applies_to: design-accelerator
---

# Local dev setup

## Prerequisites

- `P:\legacy-design-tools` cloned and on `main` (pull before starting)
- pnpm installed workspace-wide
- No `.env.local` required — api-server runs via Cloud Run proxy

## Terminal A — api-server (port 8080)

```powershell
cd P:\legacy-design-tools
git pull
$env:PORT = "8080"
pnpm --filter @workspace/api-server run dev
```

This starts `dev-proxy.mjs` which forwards to `https://cortex-api-tds7av26va-uc.a.run.app` (production Cloud Run). The plan-review BFF routes (`/api/plan-review/*`) proxy to production.

Wait for: `api-server listening on :8080`

## Terminal B — codex-reviewer-qa (port 19592)

```powershell
cd P:\legacy-design-tools
$env:PORT = "19592"
$env:BASE_PATH = "/codex-reviewer-qa/"
pnpm --filter @workspace/codex-reviewer-qa run dev
```

Wait for: `VITE ... ready` and `Local: http://localhost:19592/codex-reviewer-qa/`

## URL

Open: **http://localhost:19592/codex-reviewer-qa/**

The trailing slash matters. Without it, Vite returns 404.

## Smoke checks

```powershell
# api-server alive
curl.exe -s http://127.0.0.1:8080/api/healthz
# expected: {"status":"ok"}

# Vite proxy working
curl.exe -s http://127.0.0.1:19592/api/healthz
# expected: {"status":"ok"}

# Queue loads real data
curl.exe -s http://127.0.0.1:19592/api/plan-review/queue
# expected: JSON array of engagements (31 rows as of 2026-07-01)

# Tile function registry
curl.exe -s http://127.0.0.1:19592/api/plan-review/admin/functions
# expected: JSON array with precedence, hydrology, etc. and their status
```

## If port busy

```powershell
netstat -ano | findstr ":19592.*LISTENING"
Stop-Process -Id <PID> -Force
```

## Why the engagement select works without a .env.local

PR #207 added a `devSession` bootstrap to `codex-reviewer-qa/src/lib/devSession.ts`. It sets a `pr_session` cookie with `audience: "internal"` on first load. The plan-review BFF reads that cookie and bypasses the engagementOwnerWhere() filter on engagement reads. This is the same mechanism plan-review uses; it works even when api-server is proxying to production because the BFF check runs in api-server (local), not in Cloud Run.

## Optional: full local Node (dev:local)

To run against Neon DB directly without the Cloud Run proxy, create `.env.local` from `.env.local.example` and set `DATABASE_URL` to the prod Neon connection string, then:

```powershell
# Load env vars
Get-Content .env.local | ForEach-Object {
  if ($_ -match '^\s*#' -or $_ -notmatch '^\s*([A-Za-z_][A-Za-z0-9_]*)=(.*)$') { return }
  Set-Item -Path "env:$($Matches[1])" -Value $Matches[2].Trim().Trim('"').Trim("'")
}
$env:PORT = "8080"
$env:NODE_ENV = "development"
pnpm --filter @workspace/api-server run dev:local
```

`dev:local` is only needed if you need to debug raw DB queries or run ingest scripts. For QA of the tile workspace, the Cloud Run proxy is sufficient.
