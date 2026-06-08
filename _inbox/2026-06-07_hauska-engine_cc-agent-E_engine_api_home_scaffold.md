---
id: 2026-06-07_hauska-engine_cc-agent-E_engine_api_home_scaffold
title: cc-agent-E — engine-api home scaffold (ADR-008 step 1)
date: 2026-06-07
agent: cc-agent-E
repo: hauska-engine
dispatch: 2026-06-07_cc-agent-E_engine_api_home_scaffold
status: complete — PR held for operator merge
model: Grok Build 0.1 (default; no escalation)
---

# Engine-api home scaffold — cc-agent-E report

## Workspace hygiene (verbatim)

**Refused dirty primary clone** `P:\hauska-engine` per dispatch + `agent_workspace_hygiene`. Executed from isolated worktree:

```
P:\tmp\hauska-engine-cc-agent-E-engine-api
branch engine/api-home-scaffold
```

**Primary clone `git status` (verbatim at dispatch entry):**

```
On branch feat/neon-warmup-pilot-load
Your branch is up to date with 'origin/main'.

Changes not staged for commit:
	modified:   services/retrieval-api/DEPLOY.md
	modified:   tools/migrate-legacy-codes/src/index.ts

Untracked files:
	services/retrieval-api/corpus/central_texas_coverage.json
	services/retrieval-api/docs/
	tools/migrate-legacy-codes/src/__tests__/export-central-texas-coverage.test.ts
	tools/migrate-legacy-codes/src/__tests__/neon-warmup.test.ts
	tools/migrate-legacy-codes/src/central-texas-pilot-keys.ts
	tools/migrate-legacy-codes/src/export-central-texas-coverage.ts
	tools/migrate-legacy-codes/src/load-neon-warmup-jsonl.ts
	tools/migrate-legacy-codes/src/neon-warmup-types.ts
	tools/migrate-legacy-codes/src/repo-root.ts
	tools/migrate-legacy-codes/src/snapshot-to-legacy-jsonl.ts
	tools/migrate-legacy-codes/tmp/
```

**Primary clone `git log -3` (verbatim):**

```
7e142fb Merge pull request #65 from empressaioemail-tech/feat/property-workspace-atom-pipeline
97d581f fix(ci): use published @hauska/atom-contract@1.3.0 instead of local file override
7a7c75c feat(workspace): brokerage V1 atom emission and retrieval pipeline
```

## Repo layout recon (verbatim, pre-scaffold base @ `7e142fb`)

**`packages/`:** `atom-contract-pin`, `atoms`, `corpus`, `identity`, `retrieval`, `storage`, `workspace`

**`services/`:** `pipeline-runner`, `retrieval-api` (read-only / untouched this dispatch)

**CI:** `.github/workflows/ci.yml` runs `pnpm typecheck` + `pnpm test` recursively; `pnpm-workspace.yaml` includes `packages/*` and `services/*` — new packages auto-join.

## Deliverables

| Item | Status |
|------|--------|
| `services/engine-api` skeleton (health, config, Hono server) | Done |
| `packages/engine-core` empty skeleton | Done |
| `packages/adapters` empty skeleton | Done |
| Gate-front seam contract documented | Done — `services/engine-api/docs/gate-front-seam.md` + `src/gate-front-context.ts` |
| `retrieval-api` unchanged | Verified — zero diff |
| CI green on new surfaces | Done — typecheck 14/14 packages; engine-api tests 3/3 |
| No engine code moves | Confirmed |
| PR held for operator merge | **https://github.com/empressaioemail-tech/hauska-engine/pull/67** |

## PR + SHA

- **Branch:** `engine/api-home-scaffold`
- **SHA:** `a00c81a76478511dfc6f8d1b9751e45eca003ca0`
- **PR:** https://github.com/empressaioemail-tech/hauska-engine/pull/67

## Gate-front seam (summary)

engine-api trusts the MCP gate (`hauska-mcp-server`) as sole caller:

1. **Service auth:** `Authorization: Bearer <ENGINE_API_GATE_TOKEN>`
2. **Context headers:** `X-Hauska-Product`, `X-Hauska-Tenant-Id`, `X-Hauska-Package-Id`, `X-Hauska-Access-Tier`, `X-Hauska-Gate-Credential-Id`, `X-Hauska-Request-Id`, optional `X-Hauska-Subject-Id`
3. **Trust boundary:** gate resolves product + tenant + package + tier; engine-api does not re-resolve
4. **Scaffold behavior:** `/health` + `/ready` unauthenticated; `/v1/*` returns `501 not_implemented` with echoed `gateFront` (middleware wired, no reasoning yet)

Full contract: `services/engine-api/docs/gate-front-seam.md`

## Verification (verbatim)

```
pnpm typecheck  → 14/14 workspace packages green (includes engine-api, engine-core, adapters)
pnpm --filter @hauska-engine/engine-api test  → 3/3 passed
git diff --name-only services/retrieval-api  → (empty)
```

## Atoms touched

- `sprint:56` — engine extraction sprint, step 1
- `decision:2026-06-07_full_engine_extraction_and_data_packages`
- ADR-008 — engine factor-out layout

## Blockers / follow-ons

- **Primary clone still dirty** on `feat/neon-warmup-pilot-load` — operator should not use primary clone for engine work until neon-warmup state is resolved or stashed.
- **Engine lift (steps 3–4)** gated behind M-Stabilize Phase 2C — no cortex-api changes in this PR.
- **Deploy** out of scope — no Cloud Run wiring yet.
- **MCP gate consumer** not wired — contract documented only.
