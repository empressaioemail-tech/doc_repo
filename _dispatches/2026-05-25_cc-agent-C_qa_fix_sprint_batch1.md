---
id: 2026-05-25_cc-agent-C_qa_fix_sprint_batch1
title: Dispatch — Cortex QA fix sprint Batch 1 (pre-deploy)
date: 2026-05-25
agent: cc-agent-C
repo: legacy-design-tools
kind: dispatch
operator_greenlight: 2026-05-25
related: [_research/2026-05-24_cortex_prod_qa_pass4_sprint_plan, 43_cortex_qa_backlog, 40g_cortex_cockpit_backend_wiring_sprint, _sessions/2026-05-25_cc-agent-C_session_close, 90_runbooks/cloud_run_canary_deploy]
---

# Cortex QA fix sprint — Batch 1 — cc-agent-C

You are **cc-agent-C**, single owner of `empressaioemail-tech/legacy-design-tools` for this sprint.

**Operator greenlit Batch 1 on 2026-05-25.** Sequence: merge QA fixes on `main` → operator deploy (pinned SHA) → operator QA pass 5. **You do not deploy.**

## Model (HR-12)

Default: **Grok Build 0.1**. **grok-code-fast-1** for narrow test/CSS fixes. Escalate to Claude only after one retry; log escalation in session summary.

## Baseline

| Item | Value |
|------|--------|
| **`main` HEAD** | `3250a74` or later (#115 backend, #116 Cockpit tests, #117 site topo) |
| **Prod (unchanged)** | `cortex-api-00045-pas` — #114 image only |
| **QA register** | QA-36–58 in [`43_cortex_qa_backlog.md`](../43_cortex_qa_backlog.md) WS-I |
| **Sprint plan** | [`_research/2026-05-24_cortex_prod_qa_pass4_sprint_plan.md`](../_research/2026-05-24_cortex_prod_qa_pass4_sprint_plan.md) |
| **Prior close** | [`_sessions/2026-05-25_cc-agent-C_session_close.md`](../_sessions/2026-05-25_cc-agent-C_session_close.md) |

## Atoms to resolve

- `qa-backlog-item:WS-I-batch1` — pre-deploy code fixes from operator pass 4
- `sprint:40g` — §J still pending; your fixes unblock pass 5 after deploy
- `current-state:portfolio` — no Cloud Run actions from this agent

## Read first

1. [`43_cortex_qa_backlog.md`](../43_cortex_qa_backlog.md) — WS-I table (QA-36–58)
2. [`_research/2026-05-24_cortex_prod_qa_pass4_sprint_plan.md`](../_research/2026-05-24_cortex_prod_qa_pass4_sprint_plan.md) — clusters A/B and deferred sprints
3. [`_sessions/2026-05-24_cockpit_ia_deploy_prod_claude_code.md`](../_sessions/2026-05-24_cockpit_ia_deploy_prod_claude_code.md) — stale-canary lesson (operator deploy only)
4. Cockpit IA navigation: `artifacts/design-tools/e2e/engagementUrl.ts`, `engagementViews.test.ts` (#116)
5. Site: `lib/site-context/` (`SiteTab.tsx`, `SiteMap.tsx`, `topoContours.ts`), `lib/adapters/src/national/regrid.ts`
6. Packages: `artifacts/design-tools/src/components/packages/`, `artifacts/api-server/src/routes/packages.ts`

## Workspace

- **`P:\legacy-design-tools`** on **`main`** — `git pull` to `3250a74` minimum
- Branch naming: **`fix/qa-NN-short-slug`** (one PR per cluster when practical; stack small related IDs in one PR if they touch the same files)
- Do **not** use `P:\ldt-replit-ui` or Replit publish

## In scope (Batch 1)

Execute in this order. Mark each QA ID **Fixed** in PR body when closed.

### PR 1 — Cluster A: shared button alignment (QA-40, QA-43, QA-47 partial, QA-51 copy)

**Goal:** Icon+label outlined buttons no longer clip text on bottom border; consistent flex/gap/padding.

**Surfaces:** Property Intel "Open map", Model snapshot Full screen 3D / Sheets, Deliver > Packages action buttons, Engagement Settings copy button.

**Acceptance:** Vitest or Playwright spot-check on at least one surface; visual parity across listed surfaces.

### PR 2 — Cluster B: Site / prop intel code path (QA-39, QA-41)

**Goal:** Site tab functional in **local/dev** and ready for prod once operator mounts `REGRID_API_KEY`.

**Code work (not operator secrets):**

- Map overlays from generated layers render on map canvas (not pills-only)
- Palette layer toggles wire to map visibility
- Toolbar + force refresh invoke site-context refresh (not no-op)
- Geocode/pin: tighten to parcel centroid or rooftop where data exists
- Briefing UI: exit `Generating…` / spinner when A–G content is present (mock or live)

**Out of your scope:** Creating `REGRID_API_KEY` secret or Cloud Run mount (operator Block 0). Dallas mock engagement QA-58 (operator data).

**Acceptance:**

- `pnpm --filter @workspace/site-context exec vitest run` green
- Manual or component test: briefing completes state; map toggle changes visible layer count
- Document in PR what still requires prod secret for full Regrid polygon on Dallas

**Regression:** PR #117 topo overlay — do not break `hasContoursGeoJson` mocks; follow #117 pattern for `site-context/client` mocks in tests.

### PR 3 — Cockpit UX polish (QA-42, QA-37, QA-44, QA-36, QA-54)

| ID | Fix |
|----|-----|
| QA-42 | Default engagement segment/view → **Site** on first open (not Model) |
| QA-37 | Dashboard Inbox cards match Projects grid (layout, borders, typography, CTAs) |
| QA-44 | Light theme: sidebar, tabs, 3D chrome, text tokens readable on light surfaces |
| QA-36 | Replace SmartCity OS sidebar placeholder with **Cortex** product branding |
| QA-54 | "Visualize floor plan" only on floor-plan sheet cards (discriminate `source_type` or sheet metadata) |

**Acceptance:** `pnpm run typecheck`; update `engagementViews.test.ts` / Playwright if default route changes.

### PR 4 — Deliver + Review (QA-47, QA-49)

| ID | Fix |
|----|-----|
| QA-47 | Packages tab: scroll container; package **preview** before zip/download (use #115 packages API + share hydration already on `main`) |
| QA-49 | Review > Findings: restore **one-click self-run plan review** in empty state (re-verify QA-34 pattern; address-populated Revit path) |

**Acceptance:** `packages.logic.test.ts` + Packages tab tests if present; plan-review entry point reachable without jurisdiction-only copy.

## Out of scope (defer — do not start)

| Items | Reason |
|-------|--------|
| QA-38, QA-45 | Need `HAUSKA_SUBSTRATE_MODE=mcp` + MCP key on Cloud Run (operator) |
| QA-46, QA-48 | mnml / video rendering — cc-agent-R + Studio pipeline |
| QA-50, QA-52, QA-53, QA-55, QA-56, QA-57 | Phase 3 / workspace settings / large features |
| QA-51 full settings | Partial (copy alignment) in PR 1; full Access/share backend may need deploy to verify #115 |
| QA-58 | Operator creates Dallas County TX engagement |
| Lane 4 40g hardening | Optional after Batch 1 unless you find a one-line fix while in packages code |
| Lane 5 Phase 3 (QA-27/28/29) | Gated on **40g QA signed** after pass 5 |
| **Deploy** | Operator only; pin `image_tag=<merge-sha>` after build-and-push |

## Verification (every PR)

```powershell
cd P:\legacy-design-tools
git checkout main && git pull
pnpm run typecheck
pnpm --filter @workspace/design-tools exec vitest run src/pages/__tests__/EngagementDetail.test.tsx
pnpm --filter @workspace/site-context exec vitest run
pnpm --filter @workspace/api-server exec vitest run src/__tests__/packages.logic.test.ts
```

Add Playwright only when navigation or default tab changes.

## PR hygiene

- Link PR to QA IDs in title/body: `fix(qa): QA-40 QA-43 button alignment`
- Squash merge preferred; note final SHA for operator deploy pin
- If an item is **blocked on operator infra only**, say so in PR and leave backlog **Open** with comment — do not fake-fix with mocks in prod paths

## Reporting

When Batch 1 complete (or blocked), drop courier summary to **`P:\doc_repo\_inbox/`**:

`2026-05-25_legacy-design-tools_cc-agent-C_qa_fix_batch1_close.md`

Include: PR numbers, merge SHAs, QA IDs closed vs deferred, test commands run, deploy pin SHA recommendation (`<final-main-sha>`).

## Operator parallel (not your task)

Nick will: create Dallas engagement (QA-58); confirm `REGRID_API_KEY` + substrate MCP env at deploy; run canary deploy after your merges; QA pass 5 + 40g §J.
