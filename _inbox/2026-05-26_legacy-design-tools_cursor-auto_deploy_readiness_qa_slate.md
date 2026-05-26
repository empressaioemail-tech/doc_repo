---
date: 2026-05-26
agent: cursor-auto (Cursor, cente workstation)
repo: legacy-design-tools
type: recon
status: ready-for-operator
worktree: P:/legacy-design-tools
branch_at_survey: sprint/placid-collateral
related:
  - _inbox/2026-05-26_legacy-design-tools_cursor-auto_studio_prod_enable_close.md
  - _inbox/2026-05-26_legacy-design-tools_cc-agent-C_placid_collateral_close.md
  - _inbox/2026-05-26_legacy-design-tools_cursor-auto_placid_pr124_ci_fix_close.md
  - docs/deploy.md (operator canary sequence)
  - docs/local-dev-windows.md (local QA path)
  - AGENTS.md (2026-05-26 Placid + local dev notes)
transcript: 44374fec-b5a3-4817-860f-1d71507ae7dc
---

# Deploy readiness + clean QA slate — legacy-design-tools

**Purpose:** Give the planning agent a single snapshot of open branches, what is on `main` vs in-flight, migration heads, surfaces, and the recommended merge/deploy sequence so the next QA round starts from a known baseline.

**Survey time:** 2026-05-26 (post-fetch `origin/main` @ `173eddb`).

---

## Executive summary

| Layer | State |
|--------|--------|
| **`origin/main`** | `173eddb` — pre-deploy QA wave merged (#114–#123). SQL migrations through **`0019_workspace_settings`** only. |
| **In-flight (2 agents / 2 open PRs)** | [#124 Placid collateral](https://github.com/empressaioemail-tech/legacy-design-tools/pull/124), [#125 Studio prod enable](https://github.com/empressaioemail-tech/legacy-design-tools/pull/125). Both rebase clean on `main`. |
| **Workstation** | `P:\legacy-design-tools` on `sprint/placid-collateral`, in sync with `origin/sprint/placid-collateral`; no uncommitted product code at survey (untracked `_research/` + `.claude/` only). |
| **Prod assumption** | **Behind `main`** until operator runs Cloud Run canary + migrations + Replit publish. Treat #114–#123 as **not yet validated on prod URLs**. |

**Recommendation for clean QA slate:** **Option A** — merge #124 then #125, single deploy SHA, `run-migrations` through **0025**, then full prod QA matrix. Avoid staging `main`-only deploy if collateral + studio enable are required for the next round.

---

## Machine-readable snapshot (planner)

```yaml
repo: empressaioemail-tech/legacy-design-tools
main_sha: 173eddb
main_migration_head: 0019_workspace_settings
open_prs:
  - number: 124
    branch: sprint/placid-collateral
    sha: ce051cf
    title: "feat(collateral): Placid PDF export replaces Canva autofill as primary"
    migrations: "0020-0025"
    merge_first: true
  - number: 125
    branch: feat/studio-prod-enable
    sha: ac24973
    title: "feat(studio): server GLB resolve + prod enable runbook"
    migrations: none
    post_merge_ops: "RENDERS_PROD_ENABLED + scripts/enable-studio-cloud-run.ps1"
merged_not_deployed_assumption: true  # PRs 114-123 on main, not confirmed on prod
surfaces:
  api: cortex-api (Cloud Run us-central1)
  ui_architect: https://prompt-agent-accelerator.replit.app/
  ui_plan_review: https://prompt-agent-accelerator.replit.app/plan-review/
deploy_sequence: deploy-canary → run-migrations → smoke → shift-traffic → Replit publish
stale_worktrees_notable:
  - path: P:/ldt-replit-ui
    branch: replit/ui-cockpit-ia-consolidation
    note: remote gone; content on main via #114 — archive
```

---

## What is on `main` today (deploy payload if shipping `main` only)

| PR | Capability |
|----|------------|
| **#114** | Cockpit IA consolidation, packages platform, chrome themes |
| **#115** | Packages + intake API wiring |
| **#116** | Test alignment for Cockpit IA navigation |
| **#117** | USGS DEM contour overlay on Site map (2D.1.5) |
| **#118–#121** | QA button alignment, site/briefing, cockpit UX, packages scroll, self-run plan review |
| **#122** | Studio floor-plan viz + video tab (QA-46, QA-48) — prod still gated by `RENDERS_PROD_ENABLED` |
| **#123** | Pre-deploy WS-I Track C close |

**Not on `main`:** Placid collateral (#124), server GLB resolve + studio prod runbook (#125).

**Merged and remote-deleted (ignore):** `cortex/qa-46-48-pre-deploy-studio`, `fix/predeploy/wsi-track-c-close`, `replit/ui-cockpit-ia-consolidation` (folded into #114).

---

## In-flight — the two open PRs

### PR #124 — `sprint/placid-collateral` @ `ce051cf`

- **User path:** Deliver → **Client materials** → Placid headless PDF (primary); Canva Connect retained; autofill UI gated `VITE_CANVA_AUTOFILL=0`.
- **Schema:** `lib/db/drizzle/0020_add_canva.sql` through **`0025_add_collateral.sql`**.
- **API:** `/api/collateral/*`, signed asset fetch, async export jobs.
- **Operator env:** `PLACID_*`, `COLLATERAL_SIGNING_SECRET`, `VITE_COLLATERAL_API=1` — see `artifacts/api-server/README-collateral.md`, `.env.local.example`.
- **Related inbox:** placid collateral close, PR124 CI fix close (same date).

### PR #125 — `feat/studio-prod-enable` @ `ac24973`

- **API:** `POST /api/engagements/:id/renders` may omit `glbUrl`; server `resolveEngagementGlbSignedUrl` (architect GLB → briefing-source).
- **OpenAPI:** `KickoffRenderCommonFields` — `prompt` required, `glbUrl` optional.
- **Ops (on branch):** `docs/studio-prod-enable.md`, `scripts/enable-studio-cloud-run.ps1`.
- **No new SQL.** Post-merge: canary with `RENDERS_PROD_ENABLED=false` → enable script → smoke kickoff without `glbUrl` → shift-traffic.
- **Related inbox:** `2026-05-26_legacy-design-tools_cursor-auto_studio_prod_enable_close.md`.

**Merge order:** **#124 first** (schema + collateral API), then **#125**.

---

## App “versions” (no semver — SHA + migration head + flags)

| Surface | Host | Deploy |
|---------|------|--------|
| **API** | Cloud Run `cortex-api` | `workflow_dispatch` per `docs/deploy.md` |
| **Architect + Plan Review UI** | Replit autoscale | Publish from `main` after merge (separate from image push) |
| **Local QA** | `:20295` / api `:8080` | `.\scripts\dev-local-windows.ps1` — Neon + GCS ADC; not api-server `dev` proxy for BIM/Studio |

### Migration heads

| Environment | Expected head (after recommended deploy) |
|-------------|------------------------------------------|
| **Prod today (assumed)** | ≤ **0019** if last deploy predates #114 stack |
| **`main` today** | **0019** |
| **After #124 merge** | **0025** (`0020`–`0025` via `run-migrations`) |

### Feature flags for next QA round

| Flag | Where | Notes |
|------|--------|-------|
| `RENDERS_PROD_ENABLED` | Cloud Run | Studio/mnml live renders; flip per #125 runbook |
| `VITE_COLLATERAL_API=1` | Replit / design-tools build | Placid UI (#124) |
| `VITE_CANVA_AUTOFILL=0` | Replit | Hide Canva autofill (#124) |
| `PLACID_*`, `COLLATERAL_SIGNING_SECRET` | Cloud Run secrets | PDF export |
| `MNML_*` | Cloud Run | Real stills vs mock |

---

## Worktree / branch noise (not blocking deploy)

**30+ worktrees** under `P:\ldt-*` and `.claude/worktrees/` — mostly stale V1 sprints, cortex QA, detached recon.

| Item | Action |
|------|--------|
| **`P:\ldt-replit-ui`** | `replit/ui-cockpit-ia-consolidation` — **remote gone**; merged via #114. Archive/remove worktree. |
| **`fix/jurisdiction-surfacing-v1.5-v3`, `fix/qa-59-*`, `fix/qa-polish-logo-box`** | At `173eddb` — **no delta vs main**. |
| **`feat/style-probe-chrome-themes`** | 3 commits **not** on `main`; likely superseded by #114 — do not merge unless explicitly wanted. |
| Many local `fix/qa-*`, `cortex/*` | Historical; no open PRs. |

---

## Operator deploy sequence (canonical)

From `docs/deploy.md` — four dispatches, no push-triggered deploy:

```
1. workflow_dispatch  action=deploy-canary     image_tag=<main-sha-after-merges>
2. workflow_dispatch  action=run-migrations   # 0020-0025 after #124; bootstrap=false if tracker seeded
3. smoke canary /api/healthz + spot packages, site map, plan review
4. workflow_dispatch  action=shift-traffic
5. Replit: publish design-tools (+ plan-review if coupled) from main
```

### Post-deploy operator steps (manual)

- **Studio (#125):** `.\scripts\enable-studio-cloud-run.ps1` or gcloud env; smoke `POST .../renders` **without** `glbUrl`.
- **Collateral (#124):** Secret Manager + Replit env for Placid + signing secret; confirm **Generate PDF** on prod.

---

## Clean slate checklist — next QA round

| Step | Why |
|------|-----|
| Merge #124 → #125 on GitHub (operator UI) | Close `open_issues_count`; one baseline SHA |
| Run full canary sequence + Replit publish | Prod matches `main` + migrations |
| Record **deployed SHA**, **migration head**, **flag state** in planner state | QA matrix starts from known baseline |
| `git checkout main && git pull` on `P:\legacy-design-tools` | Single agent worktree |
| Archive `P:\ldt-replit-ui` and other stale `ldt-*` worktrees | Prevent wrong-tree edits |
| Optional: dedicated QA engagement IDs / Neon branch | Avoid pre/post-deploy data confusion |

### Suggested prod QA matrix (after full deploy)

1. Cockpit IA nav + packages/intake (#114–#115)
2. Site DEM overlay + briefing progress (#117–#119)
3. Cockpit UX + plan review self-run (#120–#121)
4. Studio floor-plan + video tab UI (#122); then **live render** after `RENDERS_PROD_ENABLED` (#125)
5. Client materials **Generate PDF** (#124) with Placid templates configured

---

## Deploy options (operator decision)

| Option | When | Tradeoff |
|--------|------|----------|
| **A — Full slate (recommended)** | Merge #124 + #125, one deploy, migrations through 0025 | One SHA, one flag matrix, cleanest QA reset |
| **B — Staged** | Deploy `main` first (#114–#123 only), collateral/studio later | Two QA baselines; risk of conflating bug reports |

---

## LDT repo courier copy

Durable mirror (optional): `legacy-design-tools/_research/2026-05-26_deploy_readiness_qa_slate.md` — same content for agents restricted from `doc_repo/`.

---

## Planner actions

1. File this note → update portfolio `00_current_state` / deploy runbook pointers with `main_sha`, open PRs, migration head targets.
2. Schedule operator: merge order #124 → #125 → canary deploy → post-enable scripts.
3. Sweep stale worktree list in operator runbook (cente workstation `P:\ldt-*`).
4. Delete this inbox file after filing.
