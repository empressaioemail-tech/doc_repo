---
date: 2026-05-30
agent: cc-agent-C
repo: legacy-design-tools
branch: cortex/fix-brief-coverage-html-path
incident: cortex-api deploy-canary run 26643268059
---

# Close — Hotfix brief-coverage.html Cloud Run boot crash

## PR

| Field | Value |
|-------|-------|
| URL | https://github.com/empressaioemail-tech/legacy-design-tools/pull/139 |
| SHA | `b785828` |
| Branch | `cortex/fix-brief-coverage-html-path` |

**Do not merge** — operator merge + redeploy canary.

## Incident

- **Run:** 26643268059 (deploy-canary)
- **Symptom:** Container exit on boot
- **Error:** `ENOENT: no such file or directory, open '/app/artifacts/public/brief-coverage.html'`
- **Cause:** Eager `readFileSync` at module load with `join(dirname(import.meta.url), "../../public/...")`. Bundled `import.meta.url` is `artifacts/api-server/dist/index.mjs`, so `../../public` → `artifacts/public` (wrong).

## Fix

`artifacts/api-server/src/routes/brokerageBrief.ts`:

1. **Lazy read** on first `GET /api/brief-coverage` (no module-load I/O).
2. **Path candidates** (first existing wins):
   - `join(process.cwd(), "artifacts/api-server/public/brief-coverage.html")` — Docker `WORKDIR=/app`
   - `join(process.cwd(), "public/brief-coverage.html")` — local `pnpm start` from artifact dir
   - `join(dirname(import.meta.url), "../public/brief-coverage.html")` — bundled `dist` → `api-server/public`
3. **Missing file:** 503 plain text + `logger.warn`; API boots normally.

## CI

| Job | Status |
|-----|--------|
| Typecheck | pass |
| Test | pass |

Run: https://github.com/empressaioemail-tech/legacy-design-tools/actions/runs/26643532405

New test: `GET /api/brief-coverage` → 200, HTML contains `Central TX coverage`.

## Operator redeploy

1. Merge PR #139
2. `deploy-canary` with merge SHA `b785828`
3. Smoke:
   - `curl -s -o /dev/null -w "%{http_code}\n" "https://canary---<host>/api/healthz"` → 200
   - `curl -s -o /dev/null -w "%{http_code}\n" "https://canary---<host>/api/brief-coverage"` → 200
4. `shift-traffic` when satisfied
