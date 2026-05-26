---
date: 2026-05-26
agent: cursor-auto
repo: legacy-design-tools
type: session
branch: sprint/placid-collateral
status: pushed — awaiting CI on 7fb5b61
related:
  - _inbox/2026-05-26_legacy-design-tools_cc-agent-C_placid_collateral_close.md
  - _inbox/2026-05-26_legacy-design-tools_cursor-auto_placid_collateral_sprint_plan.md
---

# Session close — PR #124 CI fix (Placid collateral)

## PR / branch

| Item | Value |
|------|--------|
| PR | https://github.com/empressaioemail-tech/legacy-design-tools/pull/124 |
| Branch | `sprint/placid-collateral` → `main` |
| Feature commit | `ce051cf` — feat(collateral): Placid PDF export as primary client materials path |
| CI fix commit | `7fb5b61` — fix(ci): typecheck and schema fixture for placid collateral PR |
| Worktree | `p:\legacy-design-tools` |

## What the operator asked

All three GitHub checks on PR #124 were red (Typecheck, Test, Eval/Rubric). This session fixed them and pushed.

## Root causes

### Typecheck

1. **`lib/portal-ui/src/components/ViewCubeWidget.tsx`** — `setOrientationFromMainCamera` expects `PerspectiveCamera`; `mainCamera` ref is typed as `Camera`.
2. **`artifacts/api-server/src/routes/workspaceSettings.ts`** — Drizzle jsonb column expects `Record<string, unknown>`; `WorkspacePreferences` patch lacked a compatible cast on `.set()`.
3. **`artifacts/design-tools/.../ClientMaterialsTab.tsx`** — unused `connecting` state (TS6133).

Eval workflow runs `pnpm run typecheck:libs` first; fixing portal-ui cleared Eval/Rubric as well.

### Test (schema fixture drift)

Committed fixture had Canva + collateral DDL **appended after FK section** (comment block at line ~1991), not in pg_dump section order. CI runs:

1. `pnpm --filter @workspace/db run push` on clean `pgvector/pg14` Postgres
2. `pnpm --filter @workspace/db run test:fixture:drift` — `pg_dump` vs `schema.sql.template`
3. `pnpm test`

Integration tests replay the fixture in isolated schemas; they passed even while drift failed.

Missing from main-body fixture (only in append or absent): `coverage_requests`, engagement coverage columns, workspace `preferences` / `practice_states` / `primary_color`.

## Fixes shipped in `7fb5b61`

| File | Change |
|------|--------|
| `lib/portal-ui/src/components/ViewCubeWidget.tsx` | `cam instanceof THREE.PerspectiveCamera` guard |
| `artifacts/api-server/src/routes/workspaceSettings.ts` | Cast patch for Drizzle `.set()` |
| `artifacts/design-tools/.../ClientMaterialsTab.tsx` | `const [, setConnecting]` — drop unused binding |
| `lib/db/src/__tests__/__fixtures__/schema.sql.template` | Merge canva/collateral/coverage into pg_dump order; patch `engagements` + `workspace_settings` |
| `lib/db/src/__tests__/integration/schema.integration.test.ts` | Expected tables: +8 (canva×4, collateral×3, coverage_requests) |
| `lib/db/scripts/patch-fixture-placid.mjs` | Regeneration helper after future schema edits |

## Local verification (cente, post-push)

```text
pnpm run typecheck                                    # pass
pnpm --filter @workspace/db exec vitest run \
  src/__tests__/integration/schema.integration.test.ts  # 8/8 pass
pnpm --filter @workspace/eval run test                  # 32/32 rubric pass
pnpm --filter @workspace/api-server exec vitest run \
  src/__tests__/collateral-route.test.ts               # 4/4 pass (DATABASE_URL=.env.local)
```

**Note:** `test:fixture:drift` did not run locally — bash/WSL unavailable on Windows (`execvpe(/bin/bash) failed`). CI Linux job is authoritative for drift.

**Note:** Collateral route tests reported one unhandled rejection after pool teardown (async `failJob` on stub export path); tests still exited 0. Watch CI Test job for flake.

## Operator next steps

1. Confirm GitHub checks green on **`7fb5b61`** for PR #124.
2. If **Test** still fails on fixture drift, download CI log diff and run one more fixture alignment (likely `::text` casts or column order vs `drizzle-kit push` output).
3. Merge PR #124 when green (orchestrator via GitHub UI per AGENTS.md).
4. E2E with real `PLACID_TEMPLATE_*` remains operator task — see [placid collateral close](2026-05-26_legacy-design-tools_cc-agent-C_placid_collateral_close.md).

## Decisions (do not relitigate)

- Primary client materials path: **Placid PDF** (`VITE_COLLATERAL_API=1`, `VITE_CANVA_AUTOFILL=0`).
- Canva schema/routes retained; not removed from branch.
- Fixture must match **drizzle push on empty CI Postgres**, not Neon dev extras (`playing_with_neon`, `api_keys`, etc.).

## Out of scope this session

- Splitting PR #124 (large WIP vs collateral-only).
- `resolveEngagementGlbUrl` / studio branch work (separate `feat/studio-prod-enable` line).
- Committing `.env.local`, research notes, or `dist/` artifacts.
