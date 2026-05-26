---
id: 2026-05-26_legacy-design-tools_cc-agent-C_jurisdiction_v1_5_close
title: Close — Jurisdiction surfacing v1.5 (workspace practice states)
date: 2026-05-26
agent: cc-agent-C
repo: legacy-design-tools
branch: fix/jurisdiction-surfacing-v1.5-v3
---

# v1.5 close — workspace practice states

## Delivered

- Migration `lib/db/drizzle/0022_workspace_practice_states.sql` (`practice_states` jsonb on `workspace_settings`). Note: `0020` was already taken by Canva; practice states uses **0022**.
- Drizzle `practiceStates` on `workspaceSettings` schema.
- `GET`/`PATCH` `/api/workspace/settings` with `practiceStates` validation (2-letter, max 10, dedupe).
- Workspace UI: state chips + save with firm settings.
- Code Library: **Your firm** filters by engagements ∪ `practiceStates`; empty onboarding when zero engagements and no practice states; **Explore catalog** collapsed by default (QA-59 IA).
- Tests: `workspaceSettings.test.ts`, Code Library section Vitest, `collectFirmStateCodes` unit test.

## Operator smoke (after merge + migrations)

1. `run-migrations` applies `0022`.
2. Workspace → save `["TX","UT"]`.
3. Code Library with 0 projects → **Your firm** shows TX/UT jurisdictions only (or honest empty if none in cortex-local corpus).

## API note

Workspace settings remain hand-written (`workspaceSettingsApi.ts`); OpenAPI not extended (no generated client for this route).
