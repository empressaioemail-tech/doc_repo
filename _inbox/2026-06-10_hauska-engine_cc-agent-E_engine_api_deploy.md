---
id: 2026-06-10_hauska-engine_cc-agent-E_engine_api_deploy
title: Session — deploy engine-api to Cloud Run (GTM C1 prereq)
date: 2026-06-10
agent: cc-agent-E
repo: hauska-engine
model: Grok Build 0.1 (Cursor base URL https://api.x.ai/v1)
dispatch: 2026-06-10_cc-agent-E_engine_api_deploy
status: complete — engine-api live on Cloud Run; gate wiring unblocked for cc-agent-M
---

# Deploy engine-api to Cloud Run — cc-agent-E session report

## Model

**Grok Build 0.1** (`https://api.x.ai/v1`). No Claude escalation (first deploy revision failed; retried with Dockerfile hotfix — succeeded on revision 00002).

## Workspace hygiene

Primary clone `P:\hauska-engine` refused (dirty on orphaned `chore/retrieval-api-healthz`; unrelated edits to `DEPLOY.md` + `migrate-legacy-codes`).

Work executed in:

```
P:\hauska-engine-worktrees\engine-api-deploy
detached HEAD @ origin/main b4cf80f (lift #69/#70/#71 merged)
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

### origin/main — verbatim `git log -5`

```
b4cf80f feat(engine-core): calibration overlay I/O + site-topo derivation (PR2) (#71)
53d1743 feat(engine): lift reasoning engines into engine-core (ADR-008 step 4 / GTM A2). (#70)
91ab5d4 feat(engine): lift site-context adapters into spine (ADR-008 step 3 / GTM A1) (#69)
b6e6504 feat(retrieval-api): /healthz corpus + substrate Neon observability (#68)
88e51d9 feat(engine): scaffold engine-api home (ADR-008 step 1) (#67)
```

---

## Recon — engine-api deploy story (live source @ b4cf80f)

### Service layout

| Item | Value |
|---|---|
| Service path | `services/engine-api/` |
| Sibling pattern | `services/retrieval-api/` (read-only corpus tier) |
| Image Dockerfile | `services/engine-api/Dockerfile` — **bookworm** base, installs `artifacts/hydrology-worker/requirements.txt` (pysheds, numpy, rasterio), sets `HYDROLOGY_PYTHON=python3` |
| Runtime (upstream) | `node dist/index.js` after `tsc -b` — **broken**: `tsconfig.base.json` has `noEmit: true`, so `dist/` is never produced |
| Runtime (deploy hotfix) | `pnpm --filter @hauska-engine/engine-api exec tsx src/index.ts` (mirrors retrieval-api pattern) |

### Cloud Run target (mirrors retrieval-api)

| Field | Value |
|---|---|
| Project | `hauska-prod-497015` |
| Region | `us-central1` |
| Service name | `hauska-engine-api` (new) |
| Ingress | `--allow-unauthenticated` (bearer + gate-front headers are the access gate, same model as retrieval-api) |
| Service account | `172690833726-compute@developer.gserviceaccount.com` (default compute SA) |

### Required env / secrets

| Env | Purpose | Deploy binding |
|---|---|---|
| `ENGINE_API_GATE_TOKEN` | Bearer shared with MCP gate (`Authorization: Bearer …`) | Secret `HAUSKA_ENGINE_API_KEY:latest` (same key family as retrieval-api bearer) |
| `XAI_API_KEY` | Grok-first LLM (briefing + findings) | Secret `XAI_API_KEY:latest` (created in hauska-prod from legacy-design-tools-prod) |
| `ANTHROPIC_API_KEY` | Anthropic fallback | Secret `ANTHROPIC_API_KEY:latest` (created in hauska-prod from legacy-design-tools-prod) |
| `DATABASE_URL` | Topology-A calibration port → cortex Neon overlay I/O (PR #71 seam; drizzle adapter lands at C1 wire time) | Secret `CORTEX_DATABASE_URL:latest` (created in hauska-prod from `DEPLOYMENT_DATABASE_URL` in legacy-design-tools-prod) |
| `BRIEFING_LLM_MODE` | Briefing engine mode | `grok` |
| `AIR_FINDING_LLM_MODE` | Finding engine mode | `grok` |
| `AIR_FINDING_ORCHESTRATED` | Orchestrated findings path | `1` |
| `HYDROLOGY_PYTHON` | pysheds sidecar interpreter | `python3` (baked in image) |
| `PORT` | Cloud Run listen port | `8080` (image default) |

### Gate-front seam (`X-Hauska-*`)

All `/v1/*` routes require bearer token **plus** gate-front headers (`X-Hauska-Product`, `X-Hauska-Tenant-Id`, `X-Hauska-Package-Id`, `X-Hauska-Access-Tier`, `X-Hauska-Gate-Credential-Id`, `X-Hauska-Request-Id`). `/health` and `/ready` are unauthenticated.

### `/v1/*` endpoints (lift #70 + A1 site-context)

- `POST /v1/briefing/generate`
- `POST /v1/findings/generate`
- `POST /v1/findings/generate-orchestrated`
- `POST /v1/hydrology/dem`, `/drainage`, `/rainfall-forcing`
- `POST /v1/site-context/run-adapters` (+ related site-context routes)

### retrieval-api deploy pattern (reference)

From `services/retrieval-api/DEPLOY.md`:

- Project `hauska-prod-497015`, region `us-central1`, service `hauska-retrieval-api`
- `--allow-unauthenticated`, port 8080, bearer `RETRIEVAL_API_KEY` from `HAUSKA_ENGINE_API_KEY`
- Live URL: `https://hauska-retrieval-api-h7gvu7rgcq-uc.a.run.app` (revision `hauska-retrieval-api-00006-2lq`)

engine-api mirrors project/region/ingress model; uses its own Dockerfile (pysheds) and reasoning env bindings above.

---

## Deploy

### Secrets created in `hauska-prod-497015` (pre-deploy)

Copied from `legacy-design-tools-prod` Secret Manager into hauska-prod:

- `XAI_API_KEY` (v1)
- `ANTHROPIC_API_KEY` (v1)
- `CORTEX_DATABASE_URL` (v1) — cortex Neon `DEPLOYMENT_DATABASE_URL` for Topology-A `DATABASE_URL` binding

Granted `roles/secretmanager.secretAccessor` on `XAI_API_KEY`, `ANTHROPIC_API_KEY`, `CORTEX_DATABASE_URL`, `HAUSKA_ENGINE_API_KEY` to `172690833726-compute@developer.gserviceaccount.com`.

### Image build (Cloud Build)

Worktree hotfix applied to `services/engine-api/Dockerfile` (tsx CMD; drop no-op `tsc -b`):

```bash
# cloudbuild.engine-api.yaml (ephemeral, removed post-build)
gcloud builds submit --project=hauska-prod-497015 \
  --config=cloudbuild.engine-api.yaml \
  P:/hauska-engine-worktrees/engine-api-deploy
```

Build ID: `6ed125c2-708d-419a-b0d4-03b037c956e6` (first image, broken CMD) → rebuild after Dockerfile fix (success).

Image: `us-central1-docker.pkg.dev/hauska-prod-497015/cloud-run-source-deploy/hauska-engine-api:latest`

### Cloud Run deploy

```bash
gcloud run deploy hauska-engine-api \
  --image us-central1-docker.pkg.dev/hauska-prod-497015/cloud-run-source-deploy/hauska-engine-api:latest \
  --project=hauska-prod-497015 \
  --region=us-central1 \
  --allow-unauthenticated \
  --port=8080 \
  --memory=2Gi \
  --cpu=2 \
  --timeout=300 \
  --min-instances=0 \
  --max-instances=10 \
  --set-env-vars="BRIEFING_LLM_MODE=grok,AIR_FINDING_LLM_MODE=grok,AIR_FINDING_ORCHESTRATED=1" \
  --set-secrets="ENGINE_API_GATE_TOKEN=HAUSKA_ENGINE_API_KEY:latest,XAI_API_KEY=XAI_API_KEY:latest,ANTHROPIC_API_KEY=ANTHROPIC_API_KEY:latest,DATABASE_URL=CORTEX_DATABASE_URL:latest"
```

### Deployed URL + revision (for gate wiring — cc-agent-M)

| Field | Value |
|---|---|
| **Service URL** | `https://hauska-engine-api-h7gvu7rgcq-uc.a.run.app` |
| **Alt URL** | `https://hauska-engine-api-172690833726.us-central1.run.app` |
| **Latest ready revision** | `hauska-engine-api-00002-mq5` |
| **Gate env target** | `ENGINE_API_URL=https://hauska-engine-api-h7gvu7rgcq-uc.a.run.app` (cc-agent-M dispatch) |

Revision `hauska-engine-api-00001-w64` failed startup (`Cannot find module '/app/services/engine-api/dist/index.js'` — upstream Dockerfile CMD + `noEmit` mismatch). Fixed on 00002.

---

## HR-8 verification artifacts (verbatim)

### Health

```
GET https://hauska-engine-api-h7gvu7rgcq-uc.a.run.app/health
{"status":"ok","service":"engine-api","adapters":true,"engineCore":true,"startedAt":"2026-06-10T18:51:03.703Z"}

GET https://hauska-engine-api-h7gvu7rgcq-uc.a.run.app/ready
{"status":"ready","engineCore":true}
```

### `/v1/*` behind gate-front seam (Bearer + `X-Hauska-*`)

```
POST /v1/findings/generate  → HTTP 200 (mock body; atomId stamped finding:sub-deploy-1:…)
POST /v1/briefing/generate  → HTTP 200 (mock briefing sections)
POST /v1/site-context/run-adapters → HTTP 200 (adapter outcomes returned; external timeouts expected on cold federal fetches)
POST /v1/hydrology/dem      → HTTP 200 (USGS 3DEP DEM bytes returned; pysheds image path live)
POST /v1/briefing/generate without X-Hauska-* → HTTP 401 gate_front_context_required
```

### Bound env (gcloud describe — secret names only)

```yaml
env:
  - name: BRIEFING_LLM_MODE
    value: grok
  - name: AIR_FINDING_LLM_MODE
    value: grok
  - name: AIR_FINDING_ORCHESTRATED
    value: '1'
  - name: ENGINE_API_GATE_TOKEN
    valueFrom:
      secretKeyRef:
        name: HAUSKA_ENGINE_API_KEY
  - name: XAI_API_KEY
    valueFrom:
      secretKeyRef:
        name: XAI_API_KEY
  - name: ANTHROPIC_API_KEY
    valueFrom:
      secretKeyRef:
        name: ANTHROPIC_API_KEY
  - name: DATABASE_URL
    valueFrom:
      secretKeyRef:
        name: CORTEX_DATABASE_URL
```

---

## Blockers

### Resolved this session

- **Revision 00001 startup failure:** upstream `services/engine-api/Dockerfile` runs `node dist/index.js` but `tsc -b` emits nothing (`noEmit: true` in `tsconfig.base.json`). Deploy hotfix: tsx CMD in worktree Dockerfile. **Follow-on:** land Dockerfile + `index.ts` isMain fix on `main` so future deploys don't need a worktree patch.

### Non-blocking

- **Calibration drizzle adapter not wired in engine-api routes yet** (PR #71 library surface only; `DATABASE_URL` is bound for C1 wire time per Topology A).
- **Primary clone still dirty** on orphaned branch (unrelated to this deploy).
- **No `services/engine-api/DEPLOY.md`** in repo yet (retrieval-api has one; engine-api deploy story documented here).

### Out of scope (per dispatch)

- Gate wiring (`ENGINE_API_URL` on hauska-mcp-server) — cc-agent-M
- cortex-api cutover — cc-agent-C

---

## Next

1. **cc-agent-M:** fire `gate_wire_engine_api` dispatch — point gate at `https://hauska-engine-api-h7gvu7rgcq-uc.a.run.app`, keep `HAUSKA_BACKEND_URL` → retrieval-api.
2. **cc-agent-E follow-up PR:** fix upstream `services/engine-api/Dockerfile` (tsx CMD or enable emit in engine-api tsconfig) + add `DEPLOY.md`.
3. **cc-agent-C:** C1 cortex cut to gate + engine-api seam (per-engine feature flags).
