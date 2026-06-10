---
id: 2026-06-07_hauska-engine_cc-agent-E_engine_lift_adapters
title: Session — engine lift adapters (GTM A1 / sprint 56 step 3)
date: 2026-06-10
agent: cc-agent-E
repo: hauska-engine
model: Grok Build 0.1 (Cursor base URL https://api.x.ai/v1)
dispatch: 2026-06-07_cc-agent-E_engine_lift_adapters
status: complete — PR held for operator merge
---

# Engine lift adapters — cc-agent-E session report

## Atoms

- `current-state:portfolio` — lift hold-reasons cleared; A1 fire-ready per sprint 58
- `sprint:56` — engine extraction step 3 (adapters)
- `sprint:58` — GTM-readiness Front A step A1
- `decision:2026-06-07_full_engine_extraction_and_data_packages`

## Model

**Grok Build 0.1** (`https://api.x.ai/v1`). No Claude escalation required.

## Workspace hygiene

Primary clone `P:\hauska-engine` refused (alien HEAD + uncommitted state). Work executed in clean worktree:

```
P:\hauska-engine-worktrees\engine-lift-adapters
branch: engine/lift-adapters (from origin/main @ 88e51d9)
```

### Primary clone — verbatim `git status` + `git log -3`

```
On branch chore/retrieval-api-healthz
Your branch is up to date with 'origin/chore/retrieval-api-healthz'.

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
	modified:   services/retrieval-api/DEPLOY.md
	modified:   tools/migrate-legacy-codes/src/index.ts

no changes added to commit (use "git add" and/or "git commit -a")
---
c175d6f fix(retrieval-api): expose /healthz/ for Cloud Run GFE reserved path
9b6e3f6 feat(retrieval-api): add /healthz with corpus count and substrate Neon probe
88e51d9 feat(engine): scaffold engine-api home (ADR-008 step 1) (#67)
```

## PR

- **URL:** https://github.com/empressaioemail-tech/hauska-engine/pull/69
- **Branch:** `engine/lift-adapters`
- **SHA:** `1a0853ed968cecd24433b2e014d84ec0921a96de`
- **Merge:** held for operator (not merged)

## HR-8 verification artifacts

### `git log --oneline origin/main -10` (pre-lift baseline)

```
88e51d9 feat(engine): scaffold engine-api home (ADR-008 step 1) (#67)
5269751 feat(corpus): ingest ADA 2010 and FHA Design Manual accessibility standards (#66)
7e142fb Merge pull request #65 from empressaioemail-tech/feat/property-workspace-atom-pipeline
97d581f fix(ci): use published @hauska/atom-contract@1.3.0 instead of local file override
7a7c75c feat(workspace): brokerage V1 atom emission and retrieval pipeline
3da7ed7 chore(corpus): refresh retrieval-api snapshot post Sync-5 lane batch
b19e9eb Merge pull request #64 from empressaioemail-tech/stream-1d/sync5-batch-merge-pr52-63
00a2533 feat(corpus): batch merge Sync 5 ingests PR #52-#63
24add19 docs(retrieval-api): fix gcloud deploy project id to hauska-prod-497015
0a73bbe fix(corpus): wire Pasadena + Sugar Land into snapshot UNITS
```

### `git ls-tree origin/main packages/adapters` (pre-lift)

```
040000 tree 705369f5af7c553c0972959fef113f6aca917315	packages/adapters
```

Pre-lift skeleton: placeholder `ADAPTERS_SCAFFOLD_VERSION` only.

## Recon — adapter contract (verbatim from source)

Source: `legacy-design-tools/lib/adapters/src/types.ts` (ported unchanged to `@hauska-engine/adapters`).

**Adapter contract (`Adapter` interface):**

- `adapterKey` — stable `<jurisdiction-key>:<source-name>` slug (locked decision #3)
- `tier` — `"federal" | "state" | "local"`
- `sourceKind` — `"federal-adapter" | "state-adapter" | "local-adapter" | "national-aggregator"`
- `layerKind`, `provider`, `jurisdictionGate`, `appliesTo(ctx)`, `run(ctx)`, optional `timeoutMs`, optional `getUpstreamFreshness`

**Run outcome (`AdapterRunOutcome`):**

- `status`: `"ok" | "no-coverage" | "failed"`
- Per-adapter failure isolation; skipped adapters emit `no-coverage` (not silently dropped)
- Cache fields: `fromCache`, `cachedAt`, `upstreamFreshness`

**Cache contract (`cache.ts`):**

- Key: `(adapterKey, latRounded5, lngRounded5)` via `toCacheKey`
- `FEDERAL_TIER_CACHE_PREDICATE` — federal tier only by default
- Cache IO is best-effort; never throws

**Neutral no-coverage:**

- `AdapterError.code` includes `"no-coverage"` for deterministic non-applicability
- Runner maps non-applicable adapters to `status: "no-coverage"` outcomes
- `noApplicableAdaptersMessage()` shared with eligibility gate

## Lift summary

| Item | Detail |
|---|---|
| Source | `legacy-design-tools/lib/adapters` (federal/national/state/local + subsurface + setbacks) |
| Target | `hauska-engine/packages/adapters` (`@hauska-engine/adapters` v0.1.0) |
| Registry counts | ALL=32, FEDERAL=17, STATE=6, LOCAL=9 (FCC gated off by default) |
| engine-api surface | `GET /v1/site-context/registry`, `POST /v1/site-context/run-adapters` |
| cortex-api | **not modified** (paired cc-agent-C cutover) |

## Behavior-parity tests — verbatim

```
pnpm --filter @hauska-engine/adapters test

 Test Files  18 passed (18)
      Tests  277 passed (277)
   Duration  2.04s
```

Workspace CI commands (local):

```
pnpm typecheck  → exit 0
pnpm test       → exit 0
```

`@hauska-engine/engine-api` tests: 5 passed (health + site-context routes).

## Blockers

**None** for this dispatch.

**Non-blocking notes:**

- Primary clone remains dirty on `chore/retrieval-api-healthz` with unstaged `DEPLOY.md` + `migrate-legacy-codes` edits — unrelated to this PR; operator may merge #68 separately.
- Adapters package `tsconfig` excludes `__tests__` from `tsc --noEmit` and sets `noUncheckedIndexedAccess: false` to match legacy-design-tools strictness profile; runtime behavior unchanged, tests still run via vitest.
- Deploy of engine-api with new routes is out of scope (dispatch explicit).

## Next

- Operator merge PR #69
- Fire A2 (`engine_lift_engine_core`) on A1 land
