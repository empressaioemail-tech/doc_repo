---
id: 2026-06-07_hauska-engine_cc-agent-E_engine_lift_engine_core
title: Session — engine lift engine-core (GTM A2 / sprint 56 step 4)
date: 2026-06-10
agent: cc-agent-E
repo: hauska-engine
model: Grok Build 0.1 (Cursor base URL https://api.x.ai/v1)
dispatch: 2026-06-07_cc-agent-E_engine_lift_engine_core
status: complete — PR #70 held for operator merge (PR1 of multi-PR lift)
---

# Engine lift engine-core — cc-agent-E session report

## Atoms

- `current-state:portfolio` — A1 (#69) landed; A2 fired
- `sprint:56` — engine extraction step 4
- `sprint:58` — GTM-readiness Front A step A2
- `sprint:55` — engine inventory (briefing, finding, hydrology, precedence)

## Model

**Grok Build 0.1** (`https://api.x.ai/v1`). No Claude escalation.

## Workspace hygiene

Primary clone `P:\hauska-engine` refused (dirty on deleted-upstream `chore/retrieval-api-healthz`). Work executed in:

```
P:\hauska-engine-worktrees\engine-lift-engine-core
branch: engine/lift-engine-core (from origin/main @ 91ab5d4)
```

### Primary clone — verbatim `git status` + `git log -3`

```
On branch chore/retrieval-api-healthz
Your branch is based on 'origin/chore/retrieval-api-healthz', but the upstream is gone.

Changes not staged for commit:
	modified:   services/retrieval-api/DEPLOY.md
	modified:   tools/migrate-legacy-codes/src/index.ts

c175d6f fix(retrieval-api): expose /healthz/ for Cloud Run GFE reserved path
9b6e3f6 feat(retrieval-api): add /healthz with corpus count and substrate Neon probe
88e51d9 feat(engine): scaffold engine-api home (ADR-008 step 1) (#67)
```

## PR

- **URL:** https://github.com/empressaioemail-tech/hauska-engine/pull/70
- **Branch:** `engine/lift-engine-core`
- **SHA:** `b407f971b5f454d2dea1c1e7b5b3bd6d7bc45551`
- **Merge:** held for operator (PR1 of multi-PR lift per dispatch)

## HR-8 verification artifacts

### `git log --oneline origin/main -5` (base)

```
91ab5d4 feat(engine): lift site-context adapters into spine (ADR-008 step 3 / GTM A1) (#69)
b6e6504 feat(retrieval-api): /healthz corpus + substrate Neon observability (#68)
88e51d9 feat(engine): scaffold engine-api home (ADR-008 step 1) (#67)
5269751 feat(corpus): ingest ADA 2010 and FHA Design Manual accessibility standards (#66)
7e142fb Merge pull request #65 from empressaioemail-tech/feat/property-workspace-atom-pipeline
```

## Lift summary (PR #70)

| Cargo | Target | Tests |
|---|---|---|
| briefing-engine | `packages/engine-core/src/briefing/` | 8 files (part of 142) |
| finding-engine + planSet + precedence | `packages/engine-core/src/finding/` | 13 files (part of 142) |
| Pure calibration math | `packages/engine-core/src/calibration/` | 3 tests |
| Grok LLM client | `packages/engine-core/src/llm/grok.ts` | — |
| Hydrology + topo fetch | `packages/adapters/src/hydrology/`, `topography/` | +25 → 302 adapters tests |
| pysheds sidecar | `artifacts/hydrology-worker/` | native path in CI |
| engine-api routes | `/v1/briefing`, `/v1/findings`, `/v1/hydrology` | 6 engine-api tests |

### engine-api endpoints (gate-front required)

- `POST /v1/briefing/generate`
- `POST /v1/findings/generate`
- `POST /v1/findings/generate-orchestrated`
- `POST /v1/hydrology/dem`
- `POST /v1/hydrology/drainage`
- `POST /v1/hydrology/rainfall-forcing`
- (A1) `GET/POST /v1/site-context/*`

### Lineage preserved

- Finding `atomId` stamping at engine boundary: `finding:{submissionId}:{ulid}`
- Citation grammar + `citations[].atomId` validation shared via briefing `citationValidator`
- Precedence reconciliation exports ADA/FHA/A117 atom-id constants unchanged

## Behavior-parity tests — verbatim

```
pnpm --filter @hauska-engine/engine-core test
 Test Files  21 passed (21)
      Tests  142 passed (142)

pnpm --filter @hauska-engine/adapters test
 Test Files  21 passed (21)
      Tests  302 passed (302)

pnpm typecheck → exit 0
pnpm test       → exit 0 (workspace)
```

## Deferred to follow-on PR (documented in PR body)

- **Calibration overlay I/O** (`overlay.ts`, `signals.ts`, `attribution.ts`) — requires `@workspace/db` + `@workspace/codes` repository ports; pure math landed.
- **Site-topography contour ingest orchestration** (`siteTopographyIngest.ts`) — stays in cortex BFF (DB/GCS/atom events); USGS 3DEP client lifted.
- **cortex-api consumer cutover** — paired cc-agent-C dispatch; not modified here.

## pysheds image

`services/engine-api/Dockerfile` installs `artifacts/hydrology-worker/requirements.txt` (pysheds, numpy, rasterio) and sets `HYDROLOGY_PYTHON=python3`.

## Blockers

**None** for PR #70 merge pending CI.

**Non-blocking:**

- Primary clone still dirty on orphaned branch (unrelated edits).
- Calibration overlay DB path is the main remaining engine-core cargo for PR2.

## Next

- Operator merge PR #70 after CI green
- PR2: calibration overlay ports + site-topography derivation module
- cc-agent-C: cortex-api cutover to gate + engine-api seam
