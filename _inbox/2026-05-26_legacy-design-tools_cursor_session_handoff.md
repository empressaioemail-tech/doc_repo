---
id: 2026-05-26_legacy-design-tools_cursor_session_handoff
title: Handoff — Cursor session (workspace prefs, QA-61 partial, UI fixes, operator substrate)
date: 2026-05-26
agent: cc-agent-C (Cursor)
repo: legacy-design-tools
branch: fix/jurisdiction-surfacing-v1.5-v3 (worktree p:\legacy-design-tools)
status: uncommitted — planning-agent touch-base only
related:
  - 40i_cortex_dallas_e2e_grok_plan_review_sprint
  - QA-57, QA-59, QA-60, QA-61, QA-62
  - _dispatches/2026-05-26_cc-agent-C_substrate_catalog_live_localhost.md
  - _dispatches/2026-05-26_cc-agent-C_grok_finding_engine.md
  - _dispatches/2026-05-26_cc-agent-C_dallas_code_corpus.md
  - _dispatches/2026-05-26_cc-agent-E_dallas_substrate_ingest.md
  - _inbox/2026-05-26_operator_localhost_substrate_qa_runbook.md
  - _inbox/2026-05-26_legacy-design-tools_cc-agent-C_jurisdiction_v1_5|v2|v3_close.md
---

# Cursor session handoff — 2026-05-26

**Purpose:** Catch-up for planning agent. Everything below is **local / uncommitted** on `fix/jurisdiction-surfacing-v1.5-v3` unless noted. **No PRs opened** from this session. **No commits** unless operator requests.

---

## Already in doc_repo (this session)

| Artifact | Path | Notes |
|----------|------|--------|
| QA-62 backlog row | `43_cortex_qa_backlog.md` | Operator MCP env + MCP deploy freshness |
| Operator runbook | `_inbox/2026-05-26_operator_localhost_substrate_qa_runbook.md` | QA-61/62 steps, 40i parallel agents, Dallas E2E order |

**Not previously filed:** jurisdiction v1.5–v3 closes exist; this session’s **workspace + branding + substrate UI + shell** work was **not** given a separate `_inbox` close until this file.

---

## Delivered in legacy-design-tools (uncommitted)

### 1. Workspace Product settings — three “coming soon” cards (QA-57 extension)

| Area | What |
|------|------|
| DB | Migration `0024_workspace_preferences.sql` — `workspace_settings.preferences` jsonb (applied locally via `migrate:prod`) |
| API | `workspacePreferences.ts`, `loadWorkspacePreferences.ts`; PATCH/GET `preferences` + `storageDisplay`; tests `workspacePreferences.test.ts`, extended `workspaceSettings.test.ts` |
| Generate layers | `filterAdaptersByPreferences` in `generateLayers.ts` (federal toggles + site GIS) |
| PDF export | `briefingHtml.ts` + `parcelBriefings.ts` — workspace cover accent + footer watermark |
| FE | `WorkspaceJurisdictionsCard`, `WorkspacePresentationCard`, `WorkspaceStorageCard`; `workspacePreferences.ts`; `Workspace.tsx` wired |

**Honest limits:** Retention policy is persisted only (no purge job). Uploads bucket is read-only from `PRIVATE_OBJECT_DIR`.

### 2. Workspace branding + Cortex logo (earlier in same worktree)

- `0023_workspace_primary_color.sql`, branding card, `CortexBrand` / `CockpitNavBrand`, `public/brand/`, `index.html` title/favicon
- `applyWorkspaceAccent` + custom accent on `.cockpit-shell`

### 3. QA-61 partial — substrate catalog localhost (not on dedicated branch)

Dispatch: `_dispatches/2026-05-26_cc-agent-C_substrate_catalog_live_localhost.md`

| Deliverable | Status |
|-------------|--------|
| `docs/deploy.md` — Local dev: live substrate | Done |
| `.env.local.example` — `HAUSKA_SUBSTRATE_*` block | Done |
| Mock-mode yellow banner | Done — `SubstrateCatalogPanel` |
| Show all jurisdictions toggle | Done — `CodeLibrary` + panel |
| Fix filtered/total summary (no cortex-local count mix-up) | Done |
| `GET /api/substrate/health` | Done |
| Substrate route test for health | Done |

**Still operator-dependent:** `HAUSKA_SUBSTRATE_MODE=mcp` + MCP URL/key + MCP server on current engine corpus (**QA-62**).

### 4. UI contrast fixes (charcoal theme)

| Issue | Fix |
|-------|-----|
| Save buttons white-on-white | `smartcity-charcoal.css` + `smartcity-utilities.css` — `sc-btn-primary.sc-btn-sm` not overridden by ghost `sc-btn-sm` colors; `.workspace-card .sc-btn-primary` safety |
| Toggle chips (states, federal, cover template) | Replaced invalid `var(--bg-page)` with `.workspace-chip` + `var(--text-inverse)`; fixed `JurisdictionCard` book pills |
| **Not in this file’s prior commits** | portal-ui CSS only |

### 5. Cockpit shell UX (this chat, end)

| Change | File |
|--------|------|
| Sidebar collapse/expand control moved to **top of left rail** (not beside search) | `CockpitShell.tsx`, `index.css` |
| ⌘/Ctrl+K hint → **clickable shortcut button** + working **Ctrl+K / ⌘K** (expands rail if collapsed, then focuses search) | `CockpitShell.tsx` |

---

## Jurisdiction surfacing v1.5–v3 (prior closes — same branch)

Already documented in:

- `_inbox/2026-05-26_legacy-design-tools_cc-agent-C_jurisdiction_v1_5_close.md`
- `_inbox/2026-05-26_legacy-design-tools_cc-agent-C_jurisdiction_v2_close.md`
- `_inbox/2026-05-26_legacy-design-tools_cc-agent-C_jurisdiction_v3_close.md`

Same worktree; v3 close does **not** include workspace prefs, QA-61 UI, or shell fixes above.

---

## Outstanding — not done this session

### Dispatches / branches (40i)

| Track | Dispatch | Branch (planned) | Status |
|-------|----------|------------------|--------|
| A — Grok findings | `2026-05-26_cc-agent-C_grok_finding_engine.md` | `cortex/grok-finding-engine` | **Not started** |
| B — Dallas cortex corpus | `2026-05-26_cc-agent-C_dallas_code_corpus.md` | `cortex/dallas-code-corpus` | **Not started** |
| QA-61 full close | `2026-05-26_cc-agent-C_substrate_catalog_live_localhost.md` | `cortex/substrate-catalog-live-local` | **Code largely done in this worktree** — should split to dedicated branch/PR or fold into next push |
| E — Dallas substrate ingest | `2026-05-26_cc-agent-E_dallas_substrate_ingest.md` | `hauska-engine` `stream-1d/dallas-county-tx` | **Operator running Agent E** — out of scope for C |

### Engineering gaps

- **OpenAPI/codegen** for new workspace/substrate fields (hand-written routes used; drift vs `openapi.yaml` possible)
- **Full `pnpm run typecheck`** — not green last known (unrelated Canva/portal-ui issues mentioned in prior handoff)
- **Fixture template** `schema.sql.template` — not regenerated for `0024` preferences column (CI drift test risk on merge)
- **QA-61 acceptance** — needs operator QA-62 env + live MCP
- **QA-60 Dallas E2E** — blocked on Grok + Dallas corpus + substrate live + E ingest handoff

### doc_repo

- **QA-61 row** in `43_cortex_qa_backlog.md` — still **Open**; update status when PR merges
- **Commit doc_repo** — QA-62 + operator runbook written; **git commit in doc_repo not confirmed** (operator to commit if desired)

---

## Recommended commit / PR strategy (for planning agent)

Worktree is **mixed**. Suggested split before merge:

1. **PR: jurisdiction surfacing v1.5–v3** — existing branch scope + coverage/chat if still intended
2. **PR: workspace product settings** — 0023–0024, branding, three cards, prefs API
3. **PR: QA-61 substrate localhost** — deploy.md, health, SubstrateCatalogPanel, CodeLibrary (or merge with #2 if small)
4. **PR: portal-ui button chips + CockpitShell** — charcoal `sc-btn-sm` fix, `workspace-chip`, sidebar/search UX

Alternatively: one “WS-I QA batch” PR if operator prefers single review — **higher blast radius**.

---

## Operator checklist (unchanged priority)

1. **QA-62** — `.env.local`: `HAUSKA_SUBSTRATE_MODE=mcp`, `HAUSKA_MCP_URL`, `HAUSKA_MCP_KEY`; restart api-server; curl `/api/substrate/health` and `?states=TX`
2. Confirm **MCP server** catalog includes Sync 5 metros (#38–#47); redeploy MCP if stale
3. While **Agent E** runs — Dallas ingest on engine only; localhost browse needs (1)+(2); plan review needs **Track B + Warm up**
4. After substrate live — **QA-60** with `AIR_FINDING_LLM_MODE=grok`, `XAI_API_KEY`, `REGRID_API_KEY`

See `_inbox/2026-05-26_operator_localhost_substrate_qa_runbook.md`.

---

## Tests run this session (green)

- `workspaceSettings.test.ts` + `workspacePreferences.test.ts` (api-server)
- `substrate.test.ts` (includes `/api/substrate/health`)
- `briefing-export-pdf` renderBriefingHtml contract tests (after PDF prefs wiring)
- Migration **0024** applied on operator Neon via `pnpm --filter @workspace/db run migrate:prod`

---

## Planning-agent one-liner

**Ingest on hauska-engine is real; localhost still defaults to mock until operator sets MCP env (QA-62). This session finished workspace settings cards, partial QA-61 UI/docs, logo/branding, charcoal button contrast, and sidebar/search UX — all uncommitted on `fix/jurisdiction-surfacing-v1.5-v3`. 40i Tracks A/B and dedicated QA-61 PR remain; Agent E owns Dallas substrate ingest.**
