---
title: C-bridge close — tile capability registry HTTP route (Track E unblocker)
date: 2026-07-02
agent: cc-agent-C-bridge (lead, autonomous)
track: C-bridge (Shared Surface Sprint)
repo: empressaioemail-tech/legacy-design-tools
status: COMPLETE
pr: 214
followup_prs: [215, 216]
merge_commits:
  - 410cafbde1603e46b1088106af142d1a008b6805  # PR 214 — route + shared module
  - 58e8072ba9d01f1ec4ed6642550ece45e999fc7e  # PR 215 — esbuild workspace condition (build fix, superseded at runtime)
  - d5eace1e61e6a08817168f93340fa7cff5e5872c  # PR 216 — narrow esbuild conditions to [workspace] (runtime fix)
deployed_revision: cortex-api-00271-hex
service_url: https://cortex-api-tds7av26va-uc.a.run.app
---

# C-bridge close — tile capability registry HTTP route

Status COMPLETE. Track E's `compose_workspace` MCP tool can now fetch the full 46-entry tile capability registry over HTTP, server-to-server. Merged (three PRs), deployed via the canary sequence, production healthy at 100 percent traffic on the new revision, live endpoint independently verified.

## FOR TRACK E — the two load-bearing outputs

Live endpoint:

    GET https://cortex-api-tds7av26va-uc.a.run.app/api/plan-review/admin/tile-registry

Auth requirement (what compose_workspace must send): the route uses `requireServiceTokenOrSession`, identical to every other plan-review BFF route. Present the api-server service token as a bearer header:

    Authorization: Bearer <SERVICE_API_KEY>

`SERVICE_API_KEY` is the same secret the Hauska MCP server already uses to call the legacy-design-tools L-surface / plan-review endpoints (Secret Manager secret name `SERVICE_API_KEY` in project `legacy-design-tools-prod`; the deploy wires it as the `SERVICE_API_KEY` env var on cortex-api). Auth semantics, verified live on prod:
- Valid `Authorization: Bearer <SERVICE_API_KEY>` -> 200 (server-to-server path; use this from the MCP server).
- Present-but-wrong bearer -> 401 `{ "error": "unauthorized" }` (verified on canary).
- No Authorization header -> passes via the browser-session path (this is how the SPA reaches it; the MCP server should send the bearer).

Do NOT use `/api/plan-review/admin/functions` for capability data — that is a pre-existing status-only route (6 entries, `{id,label,category,status,degradedReason}`, no capability fields) and is left unchanged (verified live: 200, 6 entries, no `requires` field).

## Verified live payload (prod, revision cortex-api-00271-hex)

    PROD healthz: 200
    PROD tile-registry HTTP: 200
    PROD entry count: 46
    PROD entries with all 4 capability fields: 46 / 46
    PROD sample (hazard):
    {"id":"hazard","label":"Hazard Profile","category":"Property Intel","engine":"spatial","status":"live","requires":{"engagementId":true,"apn":true},"produces":{"spatialOverlays":true},"modes":["full","card","inline","raw"],"mcpTools":["get_hazard_profile"]}

The route returns a JSON array of 46 `TileCapability` objects. Each carries `id`, `label`, `category`, `status`, optional `degradedReason`, optional `engine`, and the four machine-readable fields `requires`, `produces`, `modes`, `mcpTools` (plus optional `minWidth` / `minColShare`). `mcpTools` is an honest `[]` for planned/client-only tiles.

## What shipped

Single source of truth. The serializable capability descriptors moved into a React-free module `packages/cortex-client/src/tileCapabilities.ts` (`TileCapability` type + `TILE_CAPABILITIES` array of 46 + `TILE_CAPABILITY_BY_ID`), re-exported from `@hauska/cortex-client`. Both consumers read the same array so they cannot drift:
- the SPA `artifacts/codex-reviewer-qa/src/tile-shell/tiles.tsx` now DERIVES its `TILE_REGISTRY` capability fields from `TILE_CAPABILITIES` and attaches the React `el` factories via a local `COMPONENTS` map (the ~564-line inline registry was deleted);
- the api-server BFF `artifacts/api-server/src/routes/planReviewBff.ts` imports `TILE_CAPABILITIES` and serves it verbatim at the new route.

Drift guard. `artifacts/api-server/src/routes/__tests__/tileRegistry.test.ts` asserts >=46 entries, unique ids, all four capability fields on every entry, and valid statuses/categories. Passes in CI.

## PRs and merge status

- PR #214 (route + shared module + test) squash-merged as `410cafb`. Green Typecheck + Test. Adversarial reviewer PASS (7/7, including an in-process supertest against the real router: 200 with 46 entries, wrong-bearer 401).
- PR #215 (esbuild `workspace` condition) squash-merged as `58e8072`. Fixed the Docker build but broke the container at runtime (see below).
- PR #216 (narrow esbuild conditions to `["workspace"]`) squash-merged as `d5eace1`. The runtime fix. Green Typecheck + Test. Reviewer PASS on the earlier over-broad form; the narrow form verified by byte-diff against the last known-good bundle.

## Three resolution surfaces (the real work)

The new code is a value import `import { TILE_CAPABILITIES } from "@hauska/cortex-client"` in the api-server. `@hauska/cortex-client` is a workspace package whose `exports` map has a `"workspace"` condition pointing at `./src` and `import`/`require` pointing at a `dist/` that is NOT prebuilt in CI or the Docker build. The pre-existing imports were type-only (erased before resolution), so this was the first runtime resolution of the package in the api-server. It had to be fixed on three surfaces, each independently:

1. tsc typecheck — already honored `"workspace"` via tsconfig `customConditions`. No change.
2. vitest (CI Test job) — pool:forks uses the SSR resolver. Fixed by adding `resolve.conditions:["workspace"]` AND `ssr.resolve.conditions:["workspace"]` to `artifacts/api-server/vitest.config.ts` (PR #214). Reproduced the failure locally by deleting the dist, confirmed the fix.
3. esbuild production build (`artifacts/api-server/build.mjs`, the Docker image) — bundles `src/index.ts` directly. Fixed by adding `conditions:["workspace"]` (PR #216, after #215's `["workspace","import","default"]` regressed pg).

## The one real regression and how it was caught

PR #215 set esbuild `conditions: ["workspace", "import", "default"]`. That made the Docker build succeed, but listing `"import"`/`"default"` promoted them above `"require"` for every dual-package dependency, flipping `pg` from its CJS entry (`lib/index.js`) to the ESM wrapper (`esm/index.mjs`). Revision `cortex-api-00270-cog` then failed the startup probe:

    TypeError: Class extends value #<Object> is not a constructor or null
        at poolFactory (pg/lib/index.js) ... drizzle-orm/node-postgres
        at file:///app/artifacts/api-server/dist/index.mjs

deploy-canary aborted at revision-create; the failed revision got 0 percent traffic, so production was never affected. PR #216 narrowed to `conditions: ["workspace"]` only (a bespoke condition only the `@hauska/*` packages declare, so nothing else re-resolves). Verified by rebuilding the last known-good deployed config (`c3c2725` / revision 00267, no conditions) and byte-diffing the produced bundle against the `["workspace"]` build: the pg / drizzle / Pool wiring is identical; the only difference is the intended cortex-client tile-registry data.

## Deploy sequence and health

Canary sequence on the final image (`d5eace1`), each a separate `workflow_dispatch`:
- build-and-push (push-triggered on the #216 merge) -> image `d5eace1` in Artifact Registry. SUCCESS.
- deploy-canary (image_tag=d5eace1) -> revision `cortex-api-00271-hex` created at 0 percent, tag `canary`, Ready=True. SUCCESS (the container now boots; the pg crash is gone).
- Canary smoke (canary tag URL): `/api/healthz` 200; `/admin/tile-registry` 200 with 46 entries and the four fields; wrong-bearer 401; `/admin/functions` unchanged (6 entries, no capability fields).
- shift-traffic -> 100 percent to canary; workflow's own prod `/api/healthz` smoke passed. SUCCESS.
- Independent post-shift prod verification (default URL): healthz 200, `/admin/tile-registry` 200, 46 entries, 46/46 with all four capability fields.

Deployed revision `cortex-api-00271-hex` serves 100 percent of production traffic. Prior revision `cortex-api-00267-zol` is the rollback target. No DB migration was involved in this change (run-migrations was not needed; the route is stateless).

## Rollback

Roll traffic back to `cortex-api-00267-zol` via the `rollback` workflow_dispatch (`action=rollback`, `rollback_revision=cortex-api-00267-zol`). No DB state to unwind.
