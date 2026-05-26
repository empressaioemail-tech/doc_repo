---
id: 2026-05-26_cc-agent-C_jurisdiction_surfacing_v1_5
title: Dispatch — Jurisdiction surfacing v1.5 (workspace practice states)
date: 2026-05-26
agent: cc-agent-C
repo: legacy-design-tools
kind: dispatch
related: [41a_cortex_jurisdiction_surfacing, _dispatches/2026-05-25_cc-agent-C_jurisdiction_surfacing_v1_ui]
prerequisite: QA-59 v1 merged
---

# Jurisdiction surfacing v1.5 — workspace practice states

**Depends on:** QA-59 v1 merged (Code Library three-section IA).

**Canonical:** [`41a_cortex_jurisdiction_surfacing.md`](../41a_cortex_jurisdiction_surfacing.md) § v1.5.

## Goal

When the user has **zero engagements**, Code Library still filters to **firm practice states** from workspace settings, not the full national grid.

## Scope

### 1. Schema + migration `0020_workspace_practice_states.sql`

Extend `workspace_settings`:

```sql
ALTER TABLE workspace_settings
  ADD COLUMN IF NOT EXISTS practice_states jsonb NOT NULL DEFAULT '[]'::jsonb;
```

- Store **2-letter US state codes** uppercase in JSON array, e.g. `["TX","UT"]`.
- Drizzle: `practiceStates: jsonb("practice_states").$type<string[]>().notNull().default([])` on `lib/db/src/schema/workspaceSettings.ts`.

### 2. API (`workspaceSettings.ts`)

- `GET /api/workspace/settings` returns `practiceStates: string[]`.
- `PATCH` accepts `practiceStates?: string[]`:
  - Validate: each entry matches `/^[A-Z]{2}$/`.
  - Dedupe, max 10 states.
  - Reject empty strings.

### 3. OpenAPI + codegen

- Update `artifacts/api-server/openapi.yaml` workspace settings schemas.
- Run `pnpm --filter @workspace/api-spec codegen` if project uses generated client for workspace settings (or extend hand-written `workspaceSettingsApi.ts` to match).

### 4. UI (`Workspace.tsx` + Code Library)

**Workspace → Product settings → Organization card** (or new **Practice regions** card):

- Multi-select or chip input for US states (TX, UT, FL, …).
- Save with firm name (same Save button or dedicated).
- Skippable helper: "Used to filter Code Library before you have projects."

**Code Library** (`CodeLibrary.tsx`):

- Extend v1 filter priority:
  1. Engagement states (union)
  2. **`practiceStates` from workspace settings** (when no engagements or as union)
  3. Explore (all)
- When **no engagements and empty practiceStates**: show onboarding empty state pointing to Workspace settings or create project.

### 5. Tests

- API test: PATCH practiceStates valid/invalid.
- Vitest: Code Library shows filtered cards when settings mock has `["UT"]`.

## Out of scope

- Metro/CBSA chips (states only for v1.5).
- Per-user workspace rows (still single `id = default`).
- Substrate key resolution (v2).

## Acceptance

- [ ] Save `["TX","UT"]` in Workspace → reload Code Library with 0 engagements → only TX/UT jurisdictions in **Your firm** (or empty + message if none match).
- [ ] Invalid state `"Texas"` rejected with 400.
- [ ] Migration idempotent; `run-migrations` on deploy.

## Reporting

`P:\doc_repo\_inbox\2026-05-26_legacy-design-tools_cc-agent-C_jurisdiction_v1_5_close.md`
