---
date: 2026-05-26
agent: cursor-auto (Cursor, cente workstation)
repo: legacy-design-tools
type: session
branch: feat/studio-prod-enable
status: ready-for-review
transcript: ff2452fd-2506-4cc4-affe-d5897c4e53b9
related:
  - _research/2026-05-25_bim-viewport-local-dev_session_close.md (LDT repo — BIM GLB + local dev arc)
  - _inbox/2026-05-26_legacy-design-tools_cc-agent-C_placid_collateral_close.md (parallel track — collateral)
  - 43_cortex_qa_backlog.md (QA-46, QA-48 Studio tabs — prior merge #122)
---

# Close-out — Studio production enable (V1-5 GLB resolve + mnml flip runbook)

## PR

https://github.com/empressaioemail-tech/legacy-design-tools/pull/125

| Field | Value |
|-------|--------|
| Branch | `feat/studio-prod-enable` → `main` |
| Commit | `ac24973` — `feat(studio): server GLB resolve + prod enable runbook for mnml renders` |
| Base | `origin/main` @ `173eddb` (post WS-I Track C / #123) |

**Scope:** Studio render kickoff path only — **not** Placid collateral, Canva OAuth, or jurisdiction surfacing. Those remain on `sprint/placid-collateral` (`ce051cf`, PR #124).

---

## Executive summary

Studio (Design Tools → **Rendering** tab) was already implemented end-to-end in code: mnml kickoff, Puppeteer GLB capture, polling worker, GCS mirror, Dockerfile Chrome deps. Production was gated by env (`RENDERS_PROD_ENABLED`, `MNML_RENDER_MODE`).

This session landed the **last pre-deploy code** so the operator can do **one** Cloud Run deploy + secrets/env pass:

1. **V1-5** — `POST /api/engagements/:id/renders` may **omit** `glbUrl`; api-server resolves the engagement’s primary BIM GLB (architect mesh → briefing-source), signs GCS, runs capture.
2. **OpenAPI/codegen** — `KickoffRenderCommonFields` requires only `prompt`; `glbUrl` optional.
3. **Ops** — `docs/studio-prod-enable.md`, `scripts/enable-studio-cloud-run.ps1`, canary template keeps `RENDERS_PROD_ENABLED=false` until manual flip.

---

## What shipped (file map)

| Area | Path |
|------|------|
| GLB resolve (V1-5) | `artifacts/api-server/src/lib/resolveEngagementGlbUrl.ts` |
| Renders route/worker | `artifacts/api-server/src/routes/renders.ts` |
| Unit tests | `artifacts/api-server/src/__tests__/resolveEngagementGlbUrl.test.ts` |
| Integration tests | `artifacts/api-server/src/__tests__/renders-source-upload.test.ts` (server GLB resolve block), `renders-worker.test.ts` (`engagementId` on `runRenderPolling`) |
| Spec + codegen | `lib/api-spec/openapi.yaml` → `lib/api-zod`, `lib/api-client-react` generated |
| Prod runbook | `docs/studio-prod-enable.md` |
| gcloud helper | `scripts/enable-studio-cloud-run.ps1` (`-MockMnml`, `-DryRun`) |
| Local smoke | `scripts/verify-local-pipeline.ps1` (`-TestRenderKickoff`) |
| Deploy template | `.github/workflows/cloud-run-deploy.yml` — `RENDERS_PROD_ENABLED=false` on canary |
| Env table | `docs/deploy.md` — `RENDERS_PROD_ENABLED` row |
| Local template | `.env.local.example` (GCS + optional mnml + render kickoff smoke) |
| Agent register | `AGENTS.md` — append Studio prod flip + local dev pointer |

---

## Behavior (V1-5)

**Priority** mirrors `EngagementDetail.defaultBimGlbUrl`:

1. First `materializable_elements` row with `glbObjectPath` (load order matches `toBimModelWire`: IFC bundle → briefing-derived → as-built entities).
2. Else first element with `briefingSourceId` → `briefing_sources.glbObjectPath`.
3. Errors: `no_bim_model`, `glb_not_attached`, `briefing_source_glb_missing` (400 on kickoff pre-check).

**When `glbUrl` is provided:** existing `resolveCaptureGlbUrl` normalizes API-relative paths (`/api/materializable-elements/.../glb`) to signed GCS for headless Puppeteer.

**Production gate unchanged:** without `RENDERS_PROD_ENABLED=true`, prod returns **503** `renders_preview_disabled`. Mock mnml still works in dev/CI.

---

## Operator checklist (post-merge)

```text
1. Merge PR #125 → main image build
2. workflow_dispatch → deploy-canary (image_tag = sha)
3. Run migrations if canary DB behind (viewpoint_renders / render_outputs: 0005, 0016)
4. Flip env on cortex-api:
     .\scripts\enable-studio-cloud-run.ps1 -ProjectId legacy-design-tools-prod
   Or mock smoke first:
     .\scripts\enable-studio-cloud-run.ps1 -MockMnml
5. Smoke POST /api/engagements/<id>/renders without glbUrl → 202
6. shift-traffic when green
```

**Secrets (Secret Manager, once):** `MNML_API_URL`, `MNML_API_KEY` when `MNML_RENDER_MODE=http`.

**Local QA:** `docs/local-dev-windows.md` — `.\scripts\dev-local-windows.ps1` (not api-server Cloud Run proxy `dev`). Optional:

```powershell
.\scripts\verify-local-pipeline.ps1 -EngagementId <uuid> -TestRenderKickoff
```

Requires `DATABASE_URL` + `GOOGLE_APPLICATION_CREDENTIALS` + object-storage paths in `.env.local`.

---

## Verification (agent session)

| Check | Result |
|-------|--------|
| `pnpm --filter @workspace/api-spec codegen` | Pass |
| `pnpm --filter @workspace/api-server run typecheck` | Pre-existing `workspaceSettings.ts` prefs typing issue on tree (not introduced by this PR) |
| api-server vitest (renders/resolve) | Not run locally — `DATABASE_URL` unset on cente box during close |
| Branch hygiene | Reset from accidental `ce051cf` placid HEAD; single commit on `origin/main` |

**CI:** Planner should confirm PR #125 checks (typecheck per-artifact + test job).

---

## UI path (unchanged — reference for QA)

1. Engagement → **Studio** → **Rendering**
2. **Model renders** → **Create** → prompt + kick off (GLB optional server-side)
3. **Model** → **Snapshots** → **Render in Studio** (prefills camera; may omit `glbUrl` in API body)
4. Ready still → **Refine** / client materials hooks

Prior Studio tab wiring: PR **#122** (`cortex/qa-46-48-pre-deploy-studio`) — floor plan viz + video tab.

---

## Failure cheatsheet

| Symptom | Fix |
|---------|-----|
| 503 `renders_preview_disabled` | `RENDERS_PROD_ENABLED=true` |
| Boot / mnml env error | Bind `MNML_API_URL` + `MNML_API_KEY` when `MNML_RENDER_MODE=http` |
| 400 `glb_not_attached` | Ensure engagement has mesh or briefing-source GLB (Revit sync / DXF ingest) |
| 400 `no_briefing_for_engagement` | Run briefing generation |
| Capture `browser_unavailable` | Cloud Run memory (8Gi in workflow); Chromium in image |
| Stuck `queued` | api logs for `runRenderPolling`; mnml mock vs http |

Full table: `docs/studio-prod-enable.md` §6.

---

## Git / worktree notes

| Item | Notes |
|------|--------|
| **Placid WIP** | `git stash list` → `wip-all-before-studio-pr` on `sprint/placid-collateral` if operator needs collateral branch state back |
| **Do not merge** | PR #125 does not include `0025_add_collateral.sql`, Canva routes, or Placid env |
| **Parallel PR** | PR #124 (`sprint/placid-collateral`) — separate merge decision |

---

## Planner filing hints

- Roll **Studio prod enable** into `00_current_state.md` Cortex fires / deploy posture when PR #125 merges.
- Cross-link `docs/studio-prod-enable.md` from `90_runbooks/cloud_run_canary_deploy.md` if not already mirrored.
- Relocate this file → `_sessions/2026-05-26_studio_prod_enable_cursor-auto.md` per `01_doc_conventions.md`.

---

## One-liner for next thread

**PR #125 lands V1-5 server GLB resolve + prod flip runbook; after merge, deploy-canary then `enable-studio-cloud-run.ps1` — Studio kickoffs work without `glbUrl` once `RENDERS_PROD_ENABLED` and mnml env are set.**
