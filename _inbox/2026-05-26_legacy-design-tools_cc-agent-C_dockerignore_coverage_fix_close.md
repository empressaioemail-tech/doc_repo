---
date: 2026-05-26
agent: cc-agent-C
repo: legacy-design-tools
type: session
branch: fix/dockerignore-lib-coverage
status: PR open — CI green, awaiting squash merge
related:
  - dispatch: dockerignore excludes lib/coverage (Cortex prod deploy blocker)
---

# Close note — `.dockerignore` lib/coverage fix (Cortex image build)

## PR / branch

| Item | Value |
|------|--------|
| PR | https://github.com/empressaioemail-tech/legacy-design-tools/pull/126 |
| Branch | `fix/dockerignore-lib-coverage` → `main` |
| Commit | `580b789` — fix(docker): stop excluding lib/coverage from Cloud Run image context |
| Worktree | `p:\legacy-design-tools` |
| Merge SHA | **pending** — squash merge when orchestrator approves |
| Image tag | **pending** — GHA build-and-push runs on `push` to `main` only |

## Problem

GHA `build-and-push` failed on main (#124, #125) with:

```text
Could not resolve "@workspace/coverage"
```

during `pnpm --filter @workspace/api-server run build` in Dockerfile. Root cause: `.dockerignore` patterns `coverage` and `**/coverage` excluded the workspace package `lib/coverage/`, not just Vitest output.

## Fix

Single-file change to `.dockerignore`:

- Removed bare `coverage` and `**/coverage`
- Scoped Vitest output ignore to `lib/coverage/coverage` only
- Kept `artifacts/*/coverage` and other test-output patterns

## Verification

| Check | Result |
|-------|--------|
| `lib/coverage/package.json` + `src/index.ts` present | pass |
| `pnpm --filter @workspace/api-server run build` | pass (exit 0, no esbuild errors) |
| `docker build -f Dockerfile -t cortex-api:verify .` | **blocked** — Docker Desktop not running on cente (`dockerDesktopLinuxEngine` pipe missing) |
| PR CI (Typecheck + Test) | pass — https://github.com/empressaioemail-tech/legacy-design-tools/actions/runs/26418467047 |
| GHA build-and-push on main | **pending merge** |

## Operator next steps

1. **Squash merge PR #126** via GitHub UI (CI green on `580b789`).
2. After merge, confirm green **Build & push image** on main:

   ```bash
   gh run list --repo empressaioemail-tech/legacy-design-tools \
     --workflow "Cloud Run Deploy (cortex-api)" --branch main --limit 3
   ```

3. Deploy with **full** Artifact Registry tag (GHA tags `github.sha`, not 7-char short):

   ```text
   us-central1-docker.pkg.dev/legacy-design-tools-prod/apps/cortex-api:<MERGE_SHA>
   ```

   If no newer commits land before merge, operator may also use the pre-fix head they were targeting:

   ```text
   us-central1-docker.pkg.dev/legacy-design-tools-prod/apps/cortex-api:d82fc5edf465356a0b150fedcda2676f1de3a0f2
   ```

   **Note:** `d82fc5e…` image was never pushed (build failed). After this fix merges, use the **new merge SHA** from the green build-and-push run.

4. Re-run Cloud Run deploy-canary with that tag — substrate/MCP unchanged; operator unblocks on image push only.

## Out of scope

Cloud Run deploy, migrations, env/secrets, Replit publish, Hauska MCP / retrieval-api, host connectors program.

## Acceptance criteria status

| # | Criterion | Status |
|---|-----------|--------|
| 1 | `.dockerignore` no longer excludes `lib/coverage/` | done |
| 2 | api-server build passes locally | done |
| 3 | docker build passes | blocked locally (Docker Desktop off); CI authoritative post-merge |
| 4 | PR merged to main | pending orchestrator |
| 5 | GHA build-and-push green on main | pending merge |
| 6 | Close note with merge SHA + image tag | this file — update merge SHA + GHA run URL after merge |
