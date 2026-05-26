---
id: 2026-05-25_cc-agent-C_pre_deploy_completion
title: Dispatch — Cortex pre-deploy completion (WS-I closure)
date: 2026-05-25
agent: cc-agent-C
repo: legacy-design-tools
kind: dispatch
operator_greenlight: 2026-05-25
related: [40h_cortex_pre_deploy_completion_sprint, 43_cortex_qa_backlog, _dispatches/2026-05-22_cc-agent-C_cortex_qa_build, 40g_cortex_cockpit_backend_wiring_sprint]
---

# Pre-deploy completion — cc-agent-C (WS-I)

You are **cc-agent-C**. **Goal:** close every open WS-I item in your lane so the operator can deploy once and run QA with **no deferred batches**.

**Do not deploy.** Operator deploys after you + cc-agent-R close.

## Model (HR-12)

Grok Build 0.1 default; grok-code-fast-1 for narrow fixes.

## Baseline

- `main` @ `59125da` minimum (`git pull`)
- Batch 1 done (#118–#121)
- Read [`40h_cortex_pre_deploy_completion_sprint.md`](../40h_cortex_pre_deploy_completion_sprint.md)

## Operator prereqs (assume done before your merge; flag in inbox if missing)

- `HAUSKA_SUBSTRATE_MODE=mcp`, `HAUSKA_MCP_URL`, `HAUSKA_MCP_KEY` on cortex-api
- `REGRID_API_KEY` mounted
- Dallas engagement exists (QA-58)

## Phase 1 — Substrate + Code Library (QA-38)

- Remove fixture vs cortex-local split in UI when mode=mcp
- Code Library shows jurisdictions from MCP `list_jurisdictions` (or equivalent) end-to-end
- Tests: substrate client + panel; no regression to mock mode in CI

**Acceptance:** With mcp env, operator sees full catalog (not "5 jurisdiction fixture").

## Phase 2 — Settings + share (QA-51, QA-53)

- `AccessSection.tsx`: wire share link from packages/share API (#115); remove COMING SOON where API exists
- Client plan review: operator can open share preview + client-facing review entry (package token or dedicated route)
- Copy alignment already in #118; finish functional Access

**Acceptance:** Create share link, copy URL, open in incognito; preview package contents.

## Phase 3 — Letters + intake (QA-27, QA-28, QA-29, QA-52)

Per [`_dispatches/2026-05-22_cc-agent-C_cortex_qa_build.md`](2026-05-22_cc-agent-C_cortex_qa_build.md) Phase 3 spec:

- **QA-27:** Drop/paste link → draft engagement (intake modal / dashboard); draft-only guardrails
- **QA-28:** `generate-deliverable-letter` tool in chat → L3/L6 pipeline
- **QA-29:** Presentation packet deliverable via L6
- **QA-52:** Remove SOON from Review > Letters for both flows

Quality gate: source attribution, AI-origin, draft-only on all generated content.

## Phase 4 — Client materials (QA-50)

MVP: one **Client materials** surface on engagement (Deliver or Settings adjacent):

- Upload PDF / paste link / image URL
- Persist on engagement (JSONB or new table; prefer minimal migration)
- Chat tool: `list_client_materials` so agent can reference them

## Phase 5 — Deliver AI (QA-55, QA-56)

- **QA-55:** Product specs — "Generate draft specs" runs agent/tool over sheet list → editable rows
- **QA-56:** Operator default **B** — fold callouts into specs tab unless dispatch updated; if **A**, separate tab with same generate pattern

30-min product note in PR if you choose B.

## Phase 6 — Workspace (QA-57)

MVP: replace SmartCity workspace preview; persist **firm display name** (+ optional logo URL) per workspace via API + migration if needed.

Remove "Edit (coming soon)" on firm name field; other product settings can stay disabled with honest copy if no backend yet.

## Phase 7 — Global dashboard AI (QA-45)

- Dashboard chat receives workspace context: inbox summary, project list, optional selected engagement
- Remove "Send a snapshot from Revit first" dead-end when projects exist

**Acceptance:** Ask "which projects need attention?" from dashboard without opening an engagement.

## Out of scope (cc-agent-R owns)

- QA-46 mnml integration audit
- QA-48 video rendering tab pipeline

Coordinate with R on Studio tab labels only.

## PR hygiene

- `fix/predeploy/qa-NN-slug` branches; small PRs per phase OK
- PR body lists QA IDs closed
- `pnpm run typecheck` + relevant vitest each PR

## Reporting

Final courier: `P:\doc_repo\_inbox/2026-05-25_legacy-design-tools_cc-agent-C_pre_deploy_completion_close.md`

Include: PR list, merge SHAs, QA table closed vs blocked-on-operator, recommended deploy pin.
