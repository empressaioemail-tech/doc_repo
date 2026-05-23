---
date: 2026-05-23
agent: cc-agent-R (handoff document)
repo: legacy-design-tools
sprint: 40e_cortex_rendering_parity
session_type: handoff-prompt
purpose: paste-ready activation prompt for the next agent (cc-agent-R successor) to continue the 40e sprint where this session paused
related: [2026-05-23_cc-agent-R_rendering_parity_build, 40e_cortex_rendering_parity_sprint, 2026-05-23_legacy-design-tools_cc-agent-R_A1-A4-milestone]
---

# Handoff prompt for the next cc-agent-R session

The block below is a self-contained activation prompt. Paste it into a new Cursor session for cc-agent-R (or a successor agent) to continue the 40e Cortex rendering parity sprint where this session paused after 3 PRs.

---

```
You are cc-agent-R, resuming the 40e Cortex rendering parity sprint
mid-flight. The prior session (2026-05-23) shipped 3 PRs against
legacy-design-tools and paused at the workstream-A halfway point with
a handoff request from the operator. Your dedicated clone already
exists at P:\legacy-design-tools-r — do NOT re-clone; verify it's
still in good shape, then continue.

# Workspace verification (do this first)

In this exact order:

1. `git -C P:/legacy-design-tools-r branch --show-current` — should be
   either `main` or `cortex/40e-power-tool-routes` (an in-progress A.2
   branch from the prior session — the branch may or may not have a
   commit; check `git -C P:/legacy-design-tools-r log --oneline -3`).
2. `git -C P:/legacy-design-tools-r fetch origin && git -C P:/legacy-design-tools-r checkout main && git -C P:/legacy-design-tools-r pull origin main` — sync to latest.
   The latest main should include commits #105 (A.1) + #106 (A.4) +
   #108 (A.3, once merged).
3. Verify clone isolation: `P:\legacy-design-tools` is cc-agent-C's,
   `P:\legacy-design-tools-c2` is cc-agent-C2's, `P:\legacy-design-tools-r`
   is YOURS. NEVER edit the other two; read-only is fine per the
   workspace-hygiene runbook's "When this rule does not apply" clause.
4. Every Bash command should use `git -C P:/legacy-design-tools-r ...`
   or `pnpm --dir P:/legacy-design-tools-r ...` because the Bash tool's
   cwd resets to `p:\legacy-design-tools` (cc-agent-C's clone) after
   any non-zero exit — explicit paths are the mitigation.

# Read first (in this order)

1. `P:\doc_repo\_inbox\2026-05-23_legacy-design-tools_cc-agent-R_A1-A4-milestone.md`
   — the prior session's mid-sprint summary (A.1 + A.4 milestone)
2. `P:\doc_repo\_inbox\2026-05-23_cc-agent-R_handoff_prompt_for_next_agent.md`
   — this file (the handoff context section below has more detail)
3. `P:\doc_repo\_dispatches\2026-05-23_cc-agent-R_rendering_parity_build.md`
   — the canonical dispatch (your contract for autonomy + scope)
4. `P:\doc_repo\40e_cortex_rendering_parity_sprint.md` — full sprint doc
5. `P:\doc_repo\90_runbooks\agent_workspace_hygiene.md` — discipline
6. `P:\doc_repo\_decisions\2026-05-23_cortex_rendering_parity_sprint_scope.md`
   — five settled scope calls

# State at handoff (2026-05-23T~18:50Z)

## Done in this session

- **PR #105 — A.1 power-tool client methods** — MERGED to main
  2026-05-23T18:31Z. Adds enhance/upscale/aiErase/inpaint/styleTransfer
  to MnmlClient + HttpMnmlClient + MockMnmlClient with full unit tests
  (mnml-client now at 101 tests, up from 80). All async, same
  TriggerRenderResult shape as triggerRender, polled via the shared
  GET /v1/status/{id} via existing getRenderStatus.
- **PR #106 — A.4 schema migration + drizzle + fixture** — MERGED to
  main 2026-05-23T18:41Z. Migration 0016 adds three columns to
  viewpoint_renders: `source_type TEXT NOT NULL DEFAULT 'model-capture'`,
  `source_upload_url TEXT`, `parent_render_output_id UUID FK to
  render_outputs.id ON DELETE SET NULL`. The fixture hand-edit took
  one CI iteration (initial column placement was at table end; pg_dump
  emits them right after `kind` based on drizzle schema order — fixed
  in the second commit).
- **PR #108 — A.3 per-expert parameter schema** — MERGED to main
  2026-05-23T18:52Z. Static TS-defined schema module at
  `lib/portal-ui/src/schemas/mnml-experts.ts` capturing mnml's
  archDiffusion-v43 schema (10 common + 6 per-expert grids; 20 tests).
  Powers B.1; available to A.2 for server-side validation.

## Workstream-A remaining

Sequencing (mostly per dispatch; one reordering already made):

1. **A.2 — 5 power-tool routes** (next; can start now that A.1 + A.4
   are merged). New file `artifacts/api-server/src/routes/render-tools.ts`
   with 5 POSTs:
     - POST /api/render-outputs/:parentId/enhance
     - POST /api/render-outputs/:parentId/upscale
     - POST /api/render-outputs/:parentId/erase
     - POST /api/render-outputs/:parentId/inpaint
     - POST /api/render-outputs/:parentId/style-transfer
   Each parses multipart (Busboy — copy the pattern from the
   prompt-generator route in `routes/renders.ts`), calls the
   corresponding MnmlClient method, inserts a viewpoint_renders row
   with kind='still', source_type=<tool>, parent_render_output_id=<parent>,
   mnml_job_id=<id>, status='queued'. Then fires a fire-and-forget
   polling worker (re-use `runRenderPolling` if you extend it, or
   duplicate the post-trigger logic into a new `runToolPolling`).
   Register in `routes/index.ts`. Also extend `lib/mnml-client/src/cost.ts`
   with the 5 tool costs (RENDER_COST_CREDITS), since the prior session
   deferred that from A.1.
2. **A.5 — Upload-as-source endpoint**. New multipart upload route
   that stores to GCS under an `uploads/` prefix using the existing
   `objectStorageClient` (from `artifacts/api-server/src/lib/objectStorage.ts`),
   returns a stable reference (`gs://...` or signed URL). Extends the
   existing kickoff route in `routes/renders.ts` to accept that
   reference as the `image` field as an alternative to GLB-capture
   path. Both paths produce a render-output atom with the appropriate
   source_type ('upload' vs the existing capture).
3. **A.6 — Render-output atom variant extensions**. The atom-registry
   work for tool outputs. Find the atom file at
   `artifacts/api-server/src/atoms/render-output.atom.ts`; extend
   variants to recognize `source_type` discriminants ('enhance' /
   'upscale' / 'erase' / 'inpaint' / 'style_transfer' / 'upload') and
   surface `parent_render_output_id`. ATOM VERSION bumps per ADR-001.

## Workstream-B (frontend functional) and Workstream-C (UX polish)

Both untouched. Full list and sequencing per the dispatch:

- B.4 (MaskCanvas) → B.3 (5 dialogs) → B.1 (param grid, needs A.3) →
  B.2 (upload flow, needs A.5 + C.2) → B.5 (tool-output gallery,
  needs A.6).
- C.2 (DragDropUpload) → C.1 (BeforeAfterSlider) → C.3 + C.4 (negative
  prompt + seed) → C.5 (elapsed timer) → C.6 (share button) →
  C.7 (ConstellationCanvas).

C.2 is upstream of B.2 + B.3 — build early.

# Allowlist path corrections (carry forward into your PRs)

The dispatch's allowlist named four `artifacts/api-server/src/lib/...`
paths that don't exist there — the actual paths are in `@workspace/`
packages. Same intent, different root. From prior session:

| Dispatch path | Actual path |
|---|---|
| `artifacts/api-server/src/lib/mnml-client/**` | `lib/mnml-client/**` |
| `artifacts/api-server/src/lib/db/schema/viewpointRenders.ts` | `lib/db/src/schema/viewpointRenders.ts` |
| `artifacts/api-server/src/lib/db/schema/renderOutputs.ts` | `lib/db/src/schema/renderOutputs.ts` |
| `artifacts/api-server/src/lib/db/migrations/00NN_*.sql` | `lib/db/drizzle/00NN_*.sql` |

Plus one path NOT in the allowlist that's a necessary co-edit on every
schema change (CI gate):
- `lib/db/src/__tests__/__fixtures__/schema.sql.template`

These are path-corrections, not allowlist extensions. Note them in PR
descriptions so the planner can update future dispatch boilerplate.

# Decisions carried forward (recorded in prior PRs)

- **A.4 was reordered before A.2** because A.2's row inserts need the
  new `source_type` column. Doing A.4 first avoided a churn PR.
- **Fixture hand-edit is unavoidable.** Refreshing via `pnpm --filter
  @workspace/db run test:fixture:schema` needs a live Postgres which
  Windows-side dev can't run. Hand-edit + CI feedback loop works:
  pg_dump emits columns in drizzle-schema-file order (right after
  `kind` for the new columns), not at table end.
- **Cost-table extension lives in A.2**, not A.1. A.1's mock client
  used 1 credit per tool as a placeholder; the real lookup table at
  `lib/mnml-client/src/cost.ts` extends in A.2 when routes need
  pre-kickoff cost previews. mnml-documented: `upscale` + `ai_eraser`
  = 1 credit. mnml-unspecified (discover on first live call): `enhance`,
  `inpaint`, `style_transfer`.
- **Tool outputs use `role: 'primary'`** for now (A.2). Adding
  tool-specific roles is in A.6's scope.

# Windows test runs

`pnpm-workspace.yaml` overrides strip every non-Linux native (rollup,
esbuild, etc.) because the lockfile is Linux-x64-only for CI. To run
tests locally on Windows:

1. Delete the two lines `esbuild>@esbuild/win32-x64: '-'` and
   `rollup>@rollup/rollup-win32-x64-msvc: '-'` from
   `pnpm-workspace.yaml` overrides.
2. `pnpm install --dir P:/legacy-design-tools-r` (non-frozen).
3. Run tests.
4. `git -C P:/legacy-design-tools-r checkout -- pnpm-workspace.yaml
   pnpm-lock.yaml` — revert before commit. node_modules keeps the
   natives so subsequent test runs work without the workaround.

Don't reinstall with --frozen-lockfile afterward or the natives get
stripped again. Memory: `[[project_windows_test_natives]]`.

# Autonomy clause (from dispatch)

Build through all three workstreams autonomously. Self-merge PRs once
CI is green — `RENDERS_PROD_ENABLED` keeps the surface dark in prod.
Two exceptions:

1. **Do NOT apply migrations to prod.** A.4's migration 0016 is queued
   as an operator return-task. If A.2 lands additional migrations,
   same posture: prepare in PR, surface in `_inbox/`.
2. **Do NOT extend the file-path allowlist.** Path corrections (per
   the table above) are not extensions — they're intent-preserving.
   Surface them in PR bodies.

# Reporting

Write session summaries to `P:\doc_repo\_inbox\` as
`<date>_legacy-design-tools_cc-agent-R_<topic>.md` per HR-11. Do NOT
commit to doc_repo (file drop only). The planner sweeps `_inbox/` on
a 10-min loop. Include: PRs opened + merged; autonomous decisions
made; migrations prepared for the operator; cross-agent overlap.

# Cross-agent state

- **cc-agent-C** owns `P:\legacy-design-tools` (currently on
  `docs/qa33-qa22-cc-agent-C-report`). Lane: QA-22 EPA Path 1a, EPA
  adapter work. Touches `lib/adapters/federal/`, possibly `lib/codes/`.
  Disjoint from 40e.
- **cc-agent-C2** owns `P:\legacy-design-tools-c2`. Lane: Phase 2D.x
  PR3 DEM ingest (in flight as PR #107 at handoff time). Touches
  `lib/adapters/national/`, `lib/site-context/server/overlays.ts`,
  api-server DEM client, `SiteMap.tsx`, `site-topography` atom.
  Disjoint from 40e.
- No collisions detected in the prior session.

# Activation gate

Unchanged. `RENDERS_PROD_ENABLED=false` keeps the whole 40e surface
dark in production. After sprint completes, operator flips
`RENDERS_PROD_ENABLED=true` + `MNML_RENDER_MODE=live` together in a
single Cloud Run revision. Don't touch the flag mechanism.

# Begin

Concrete first step: start A.2.

1. `git -C P:/legacy-design-tools-r checkout main && git -C P:/legacy-design-tools-r pull` to make sure A.3 / any
   other landed PRs are reflected.
2. Check if `cortex/40e-power-tool-routes` exists from the prior
   session (`git -C P:/legacy-design-tools-r branch --list cortex/40e-*`).
   If it exists but has no commits or only a fresh checkout, delete
   and re-create.
3. Branch fresh: `git -C P:/legacy-design-tools-r checkout -b cortex/40e-power-tool-routes`.
4. Build A.2 per the design above. The Busboy multipart pattern lives
   in the existing prompt-generator route in
   `artifacts/api-server/src/routes/renders.ts` — search for `Busboy`
   to find it, copy the pattern.
5. After A.2 PR opens with CI passing, merge and continue to A.5.

Mock-mode coverage is already in place (A.1 added per-tool fixture
URLs to MockMnmlClient). Tool-route tests should follow the
`renders-gap-fill-route.test.ts` pattern (the `throwingClient`
factory was already extended for the 5 tools in A.1's PR).
```

---

## Why this handoff

The prior session crossed a natural workstream-A halfway boundary
(3 of 6 A items done — A.1, A.3, A.4; A.2/A.5/A.6 remain) and the
operator asked for a handoff before the largest single PR (A.2). The
remaining work is mostly mechanical now that the foundation is laid:

- **Client surface** (A.1) — done; methods + types + tests all on main.
- **Schema** (A.4) — done; columns + drizzle relations + fixture all
  on main. Operator return-task: apply migration 0016 to prod.
- **Param schema** (A.3) — done locally, awaiting CI green + merge.
- **Routes** (A.2) — the bridge between A.1's client and the UI; not
  started.
- **Upload pipe** (A.5) — independent; small scope.
- **Atom variants** (A.6) — small scope; touches the atom registry.

## Files modified across the session

In legacy-design-tools (all on `cortex/40e-*` branches):

- `lib/mnml-client/src/{types,index,httpClient,mockClient}.ts`
- `lib/mnml-client/src/__tests__/{httpClient,mockClient,factory}.test.ts`
- `artifacts/api-server/src/__tests__/{renders-gap-fill-route,renders-worker}.test.ts`
- `lib/db/src/schema/viewpointRenders.ts`
- `lib/db/drizzle/0016_renders_power_tools_source_type.sql` (new)
- `lib/db/src/__tests__/__fixtures__/schema.sql.template`
- `lib/portal-ui/src/schemas/mnml-experts.{ts,test.ts}` (new)

In doc_repo `_inbox/`:

- `2026-05-23_legacy-design-tools_cc-agent-R_A1-A4-milestone.md`
- `2026-05-23_cc-agent-R_handoff_prompt_for_next_agent.md` (this file)

## Operator return-tasks still queued

1. Apply migration 0016 to prod after PR #106 is on a Cloud Run
   revision: Cloud Shell `psql` or the `run-migrations` workflow per
   `90_runbooks/cloud_run_canary_deploy.md`.
2. Verify fixture against pg_dump output: `pnpm --filter @workspace/db
   run test:fixture:schema` against a test DB; commit any diff. CI's
   fixture-drift on #106 passed after one iteration, so the committed
   fixture should match pg_dump's actual output, but operator-side
   verification at next migration point is good hygiene.
3. NO prod activation. `RENDERS_PROD_ENABLED` stays false until the
   full 40e sprint ships and operator validates the surface.

## Cross-references

- Prior session summary (`_inbox/`): `2026-05-23_legacy-design-tools_cc-agent-R_A1-A4-milestone.md`
- Dispatch: `_dispatches/2026-05-23_cc-agent-R_rendering_parity_build.md`
- Sprint doc: `40e_cortex_rendering_parity_sprint.md`
- Hygiene runbook: `90_runbooks/agent_workspace_hygiene.md`
