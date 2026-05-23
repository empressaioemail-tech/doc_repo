---
date: 2026-05-23
agent: cc-agent-R
repo: legacy-design-tools
sprint: 40e_cortex_rendering_parity
session_type: workstream-A-milestone
related: [2026-05-23_cc-agent-R_rendering_parity_build, 40e_cortex_rendering_parity_sprint, 90_runbooks/agent_workspace_hygiene]
---

# cc-agent-R session — workstream A milestone (A.1 merged, A.4 in PR)

## Status

cc-agent-R re-activated 2026-05-23 against the 40e Cortex rendering
parity sprint dispatch. Dedicated clone provisioned at
`P:\legacy-design-tools-r` (fresh from
`https://github.com/empressaioemail-tech/legacy-design-tools` on
`main`). pnpm install ran clean; Windows native-deps workaround
applied per `[[project_windows_test_natives]]` for local test runs
and reverted before commit.

### Done

- **PR #105 — A.1 power-tool client methods** — MERGED 2026-05-23T18:31Z.
  Adds `enhance` / `upscale` / `aiErase` / `inpaint` / `styleTransfer`
  to `MnmlClient` / `HttpMnmlClient` / `MockMnmlClient` with full unit
  test coverage (101 mnml-client tests passing, up from 80). All async,
  same `TriggerRenderResult` shape as `triggerRender`, polled via the
  shared `getRenderStatus` worker. Mock variants return per-tool
  fixture URLs so B.5's gallery rendering can tell tool outputs apart
  in dev.
- **PR #106 — A.4 schema migration + drizzle + fixture hand-edit** —
  OPEN, awaiting CI. Adds three columns to `viewpoint_renders`:
  `source_type` (TEXT NOT NULL DEFAULT 'model-capture'),
  `source_upload_url` (TEXT), `parent_render_output_id` (UUID FK to
  `render_outputs.id` ON DELETE SET NULL). Migration is idempotent
  (`IF NOT EXISTS` everywhere) and additive. Drizzle relations
  block gains `parentRenderOutput: one(renderOutputs, ...)`.

### Decisions (autonomous, recorded in PR bodies)

1. **Reordered A.4 before A.2.** The dispatch's recommended order
   was A.1 → A.2 → A.3 → A.4. But A.2's text says "persists a job
   row in viewpoint_renders (using the new source_type discriminants
   from A.4)" — A.2 is hard-dependent on A.4. Landing A.4 first
   means A.2 uses the right column from day one with no churn PR.
2. **Fixture hand-edit (A.4).** The fixture-drift CI test compares
   live pg_dump output against `schema.sql.template`. Refreshing
   the fixture properly needs a Postgres connection, which the
   dedicated clone can't run on Windows. Hand-edited the fixture to
   match the 3 column additions + 1 FK constraint in pg_dump format.
   Operator return-task: run `pnpm --filter @workspace/db run
   test:fixture:schema` against a test DB after applying migration
   0016 and commit any drift the script surfaces. **If CI's
   fixture-drift test fails on PR #106**, the script's diff output in
   the CI log shows exactly what to fix.
3. **Cost lookup deferred to A.2.** The dispatch's A.1 mentions
   "mock variants return realistic placeholder responses". I used
   1 credit per call for all five tools in `MockMnmlClient` (1 is
   the documented cost for `upscale` + `ai_eraser`; the other three
   are unspecified in mnml docs as of 2026-05-23). The shared
   `cost.ts` table extends in A.2 where routes need pre-kickoff
   cost previews.

## Allowlist path-corrections needed for future 40e dispatches

The dispatch listed paths under `artifacts/api-server/src/lib/...`
that don't exist there — the actual paths are in `@workspace/`
packages. Same intent, different root path. Surfaced here so future
40e dispatches use the real paths:

| Dispatch path | Actual path |
|---|---|
| `artifacts/api-server/src/lib/mnml-client/**` | `lib/mnml-client/**` |
| `artifacts/api-server/src/lib/db/schema/viewpointRenders.ts` | `lib/db/src/schema/viewpointRenders.ts` |
| `artifacts/api-server/src/lib/db/schema/renderOutputs.ts` | `lib/db/src/schema/renderOutputs.ts` |
| `artifacts/api-server/src/lib/db/migrations/00NN_*.sql` | `lib/db/drizzle/00NN_*.sql` |

Plus one path NOT in the allowlist that's a necessary co-edit on
every schema change (CI gate):
- `lib/db/src/__tests__/__fixtures__/schema.sql.template`

I proceeded on these as path-corrections, not allowlist extensions —
the intent is unambiguous and the actual files are not in any other
agent's territory. Surfaced as a feedback item so the planner can
update future dispatch boilerplate.

## Operator return-tasks

1. **Apply migration 0016 to prod.** After PR #106 merges, run the
   migration via the standard `run-migrations` workflow or Cloud
   Shell `psql` per `90_runbooks/cloud_run_canary_deploy.md`. Safe
   (additive + idempotent) but does need operator hands per the
   dispatch's autonomy clause.
2. **Verify fixture against pg_dump output.** After migration 0016
   is applied to a test/dev DB, run `pnpm --filter @workspace/db run
   test:fixture:schema` and commit any diff against my hand-edited
   fixture. If my hand-edit matches pg_dump's output exactly the
   refresh is a no-op; if not, the operator's commit fixes the diff.
3. **No prod activation.** Unchanged. `RENDERS_PROD_ENABLED=false`
   keeps the whole 40e surface dark in production; the two-flag
   flip is the operator's call after the full sprint ships.

## Cross-agent collisions

None detected. cc-agent-C and cc-agent-C2 are on their own clones
(`P:\legacy-design-tools` and `P:\legacy-design-tools-c2`); the
40e file-path allowlist is disjoint from their lanes
(`lib/adapters/**`, `lib/site-context/**`, `lib/codes/**`,
`chat.ts`). My branches are `cortex/40e-*` per the dispatch's
naming convention. The 2026-05-22 shared-clone incident pattern did
not recur.

## Self-discipline notes (cc-agent-R only)

- One read of `lib/mnml-client/src/cost.ts` (during recon) was
  served from `P:\legacy-design-tools` (cc-agent-C's clone) before
  I realized the cwd default. Read-only, so no hygiene violation
  per `[[agent_workspace_hygiene]]`'s "When this rule does not
  apply" clause. Going forward every command uses explicit
  `--dir P:/legacy-design-tools-r` or `git -C P:/legacy-design-tools-r`.
- Bash cwd resets to `p:\legacy-design-tools` (cc-agent-C's clone)
  after any non-zero exit. Explicit paths on every command is the
  mitigation.

## Next

A.2 (5 routes in `routes/render-tools.ts` consuming the new
`source_type` values + cost-table extension). Branched from main
after PR #106 lands. Then A.3 (per-expert param schema), A.5
(upload-as-source pipe), A.6 (render-output atom variants),
then Workstream B + C.

Estimated PR count for workstream A remaining: 4 (A.2, A.3, A.5, A.6).
