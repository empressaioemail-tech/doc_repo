---
id: 2026-05-24_cc-agent-C_cockpit_backend_wiring
title: Dispatch — Cockpit backend wiring sprint (post-#114)
date: 2026-05-24
agent: cc-agent-C
repo: legacy-design-tools
kind: dispatch
related: [40g_cortex_cockpit_backend_wiring_sprint, 43_cortex_qa_backlog, 00_current_state, 90_runbooks/cloud_run_canary_deploy]
---

# Cockpit backend wiring — cc-agent-C

You are **cc-agent-C**, single owner of `empressaioemail-tech/legacy-design-tools` for this sprint.

## Model (HR-12)

Default: **Grok Build 0.1**. **grok-code-fast-1** for narrow test fixes. Escalate to Claude only after retry; log in session summary.

## Atoms to resolve

- `current-state:portfolio` — #114 live on `cortex-api-00045-pas`; operator QA in parallel
- `sprint:40g` — backend wiring per [`40g_cortex_cockpit_backend_wiring_sprint.md`](../40g_cortex_cockpit_backend_wiring_sprint.md)
- `qa-backlog-item:packages-platform` — close contract + persist + share hydration gaps

## Read first

1. [`40g_cortex_cockpit_backend_wiring_sprint.md`](../40g_cortex_cockpit_backend_wiring_sprint.md) — full phase list
2. [`_sessions/2026-05-24_cockpit_ia_deploy_prod_claude_code.md`](../_sessions/2026-05-24_cockpit_ia_deploy_prod_claude_code.md) — deploy record + stale-canary lesson
3. `artifacts/api-server/src/routes/packages.ts`, `packages.logic.ts`, `engagements.ts`
4. `artifacts/design-tools/src/components/packages/` — `packagesApi.ts`, `PackagesTab`, publisher workbench
5. [`90_runbooks/cloud_run_canary_deploy.md`](../90_runbooks/cloud_run_canary_deploy.md) — deploy after merge

## Workspace

- Clone: **`P:\legacy-design-tools`** on **`main`** @ `c8d7fce` or later
- Do **not** mix `P:\ldt-replit-ui` branch work or openapi drift from other worktrees into this sprint
- One PR per phase (P0, P1, P2) preferred for reviewability

## Scope

**In scope:** P0 OpenAPI/codegen; P1 publisher `formSnapshot.publisherIntake` persist; P2 share `selection` validation + hydration; P3 intake PATCH + `docs/deploy.md` deploy section.

**Out of scope:** Canva integration, file-upload intake, Cockpit SPA layout changes (unless required for API wiring), Replit publish, new migrations unless schema change required (prefer JSONB fields already on `engagement_packages`).

## Acceptance (each phase)

- `pnpm run typecheck` green
- `packages.logic.test.ts` + relevant FE tests updated
- Drop courier summary to `P:\doc_repo\_inbox/` per HR-11 when a phase completes

## Deploy

Do **not** run production deploy yourself. Operator merges and runs canary with **`image_tag=<merge-sha>`** after **build-and-push** completes.

## Reporting

When blocked, state: file path, expected vs actual behavior, and whether Nick's QA found the same issue.
