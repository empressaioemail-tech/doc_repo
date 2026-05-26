---
id: 40g_cortex_cockpit_backend_wiring_sprint
title: Cortex Cockpit backend wiring sprint
status: active
last_updated: 2026-05-24
note: Code complete PR #115 merged 15c9349; operator deploy + QA sign-off pending
applies_to: design-accelerator
related: [40_design_accelerator, 43_cortex_qa_backlog, 90_runbooks/cloud_run_canary_deploy, _sessions/2026-05-24_cockpit_ia_deploy_prod_claude_code]
---

# Cortex Cockpit backend wiring sprint

> **Goal:** #114 shipped Cockpit IA and packages **CRUD + share** on prod. This sprint wires the remaining **server-side and contract** gaps so the app is fully functional (not demo/localStorage-only) while Nick runs **prod browser QA** in parallel.

**Baseline:** `main` @ **`15c9349`** (PR #115 backend wiring on top of #114 `c8d7fce`). **Prod still on `cortex-api-00045-pas` until operator deploys `15c9349`.** Migration `0018` already applied on prod.

**Owner:** cc-agent-C (`P:\legacy-design-tools` or `P:\ldt-replit-ui` on `main` only — no stale openapi WIP from other worktrees).

**Operator:** Nick — QA per §J below; merge PRs; deploy with pinned SHA per [`90_runbooks/cloud_run_canary_deploy.md`](90_runbooks/cloud_run_canary_deploy.md).

---

## What is already live (do not re-build)

| Area | Status |
|------|--------|
| Cockpit shell, views, themes, dashboard, inbox | SPA on prod |
| Packages CRUD + share tokens + public comments | API + DB |
| Intake create + `clientBrief` read | `POST /api/engagements` |
| Site / Model / Review / Studio (existing APIs) | Regression QA only |

Source: [`_inbox/` handoff filed 2026-05-24](../_sessions/2026-05-24_cockpit_ia_deploy_prod_claude_code.md).

---

## Agent work status (2026-05-24)

**PR #115 merged** — all P0–P3 complete per [`_sessions/2026-05-24_cc-agent-C_cockpit_backend_wiring.md`](_sessions/2026-05-24_cc-agent-C_cockpit_backend_wiring.md). cc-agent-C idle until follow-on bugs from QA.

## Sprint phases (agent work) — COMPLETE in #115

### P0 — Contract hygiene (unblocks FE codegen)

| ID | Deliverable | Acceptance |
|----|-------------|------------|
| P0-1 | OpenAPI: all packages routes + bodies | `openapi.yaml` matches `packages.ts` paths |
| P0-2 | OpenAPI: intake fields on create + `clientBrief` on detail | Matches `engagements.ts` |
| P0-3 | `pnpm --filter @workspace/api-spec codegen` + migrate `packagesApi.ts` to generated hooks where practical | Typecheck green; no hand-fetch regressions |

**Out of scope:** Atom events on package lifecycle (optional P3).

### P1 — Publisher handoff server persist

| ID | Deliverable | Acceptance |
|----|-------------|------------|
| P1-1 | PATCH `formSnapshot.publisherIntake` on `engagement_packages` | Refresh browser: data survives |
| P1-2 | FE: save publisher workbench to API (debounced or explicit Save) | Remove sole reliance on `localStorage` for production path |
| P1-3 | Tests: `packages.logic.test.ts` + one FE test for persist round-trip | CI green |

**Known gap today:** Publisher intake is `localStorage` only — product accepts data loss across browsers until P1 ships.

### P2 — Share viewer and selection wiring

| ID | Deliverable | Acceptance |
|----|-------------|------------|
| P2-1 | Validate `selection` JSONB IDs belong to engagement (renders, sheets, snapshots) | 400 on foreign IDs |
| P2-2 | `GET /api/package-shares/:token` returns resolved asset URLs or signed GCS paths for `selection` | Share page shows thumbnails or deep links, not metadata-only |
| P2-3 | FE package builder: picker writes real IDs into `selection` | Create package from Studio/Deliver picks |

### P3 — Intake post-create + ops docs

| ID | Deliverable | Acceptance |
|----|-------------|------------|
| P3-1 | PATCH `/api/engagements/:id` accepts intake merge into `site_context_raw` | Edit brief after create |
| P3-2 | `docs/deploy.md`: Cloud Run-only, pin SHA, wait for build-and-push, manual traffic | No Replit publish language |
| P3-3 | Optional: `shift-traffic` / `rollback` jobs on `cloud-run-deploy.yml` if missing on `main` | Operator can promote without raw gcloud |

**Deferred (separate epics):** file-upload intake lane, Canva API, server-side ZIP to GCS, email ingestion.

---

## Parallel track — Operator QA (Nick)

Run on **`https://cortex-api-tds7av26va-uc.a.run.app`** (not Replit unless explicitly comparing entry points).

**Engagement:** `977b5469-4b26-4bd0-895e-71ec752b7409`

| # | Check | Pass? |
|---|--------|-------|
| 1 | Cockpit views (not old 13-tab Workbench nav) | |
| 2 | Themes: Navy / Charcoal / Soft light | |
| 3 | Deliver → Packages → four templates | |
| 4 | Create package + share + `/share/:token` comment | |
| 5 | Intake modal → new engagement → Property Intel brief | |
| 6 | Publisher: form + CSV + ZIP (**note localStorage until P1**) | |
| 7 | Site Map ↔ Property Intel citation | |
| 8 | API: `POST …/packages` → 201 | |
| 9 | Regression: Snapshots, Findings, Submit, BIM tab | |

File results in `_research/2026-05-24_cockpit_prod_qa_signoff.md` or reply to planner with blockers only.

---

## Deploy discipline (every agent PR merge)

1. Wait for green **Build & push image** on merge SHA.
2. `gh workflow run "Cloud Run Deploy (cortex-api)" -f action=deploy-canary -f image_tag=<sha>`
3. Smoke canary: healthz, `POST …/packages` → 201, Cockpit UI.
4. `run-migrations` only if new `lib/db/drizzle/*.sql`.
5. `gcloud run services update-traffic` or `shift-traffic` workflow when present.

---

## Success criteria (sprint close)

- P0 codegen merged; FE uses generated client for packages.
- Publisher handoff survives refresh on prod.
- Share link shows at least one resolved asset class from `selection`.
- Intake editable post-create via PATCH.
- Operator QA §J signed with no P0 blockers; remaining gaps logged as follow-on tickets in [`43_cortex_qa_backlog.md`](43_cortex_qa_backlog.md).

---

## Fleet / merge queue (orthogonal but unblock noise)

Operator should merge when CI green: PR **#110**, **#111**, **#112** (Grok validation batch). Close PR **#113** (superseded by #114).
