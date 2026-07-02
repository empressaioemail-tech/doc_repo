---
title: Phase 2 shell experience close — header search, edit/view fuse, list layout, server-persisted spaces, module map
date: 2026-07-02
agent: cc-agent (lead, autonomous)
track: Phase 2 experience layer (Cortex Workspace)
repo: empressaioemail-tech/legacy-design-tools
status: COMPLETE
pr: 221
merge_commit: c84af220f495a35e274b2643a04591a03b9f2131
deployed_revision: cortex-api-00281-joy
prior_revision: cortex-api-00279-boj
service_url: https://cortex-api-tds7av26va-uc.a.run.app
migration: 0049_saved_workspace_spaces.sql
---

# Phase 2 shell experience close

Status COMPLETE. The Cortex workspace shell (`@hauska/tile-shell` + the codex-reviewer-qa app) gained the full Phase 2 experience layer across five phases: a prominent header search, an edit/view fuse with drag-reorder plus track-resize plus pop-out/dock-back over a mount-once portal, a non-card list/report layout, server-persisted shareable spaces backed by a new tenant-ready table, and a persona-mapped Module Map surface. Gated per phase by a build pass and two adversarial review sub-agents (frontend shell, backend persistence) that verified with evidence and tried to break it; both returned PASS-WITH-NITS and the MED findings were fixed and re-verified. Merged as PR #221 (squash `c84af22`), deployed via the canary sequence with migration 0049 applied to live Neon, production healthy at 100 percent on `cortex-api-00281-joy`, all six new BFF routes verified live end-to-end.

## Phase 1 — prominent header search

`HeaderSearchBar` (packages/tile-shell/src/components/HeaderSearchBar.tsx) promotes the AddressSearchBox from where it was buried in the SpaceBar (among preset pills, Save, Export, +Functions — users could not find it) to a dedicated always-visible header band and the primary element of the top bar: a wide input, a debounced geocode typeahead preview dropdown, a clear affordance, keyboard focus plus Escape handling, and an active-parcel label. It drives the shared active-parcel exactly as before via `setActiveParcel` on the EngagementProvider; the geocode call is injected (`onGeocode`/`onPreview`) so the package stays BFF-client-free. The old AddressSearchBox export is retained for back-compat; the SpaceBar no longer takes an `addressSearch` prop.

## Phase 2 — edit/view fuse plus dock-back (adapted from the trading-app scout, no new library)

Adopted the trading app's FocusShell mechanics without vendoring any layout library. Edit mode (`editing` state): per-tile chrome (grip header `⠿`, borders, gap), native HTML5 drag-to-reorder that SWAPS positions in the tiles array (the count-keyed CSS-Grid template re-places them by array order), and mouse-drag track resize that rewrites fractional col/row arrays. View mode: a single class toggle (`ts-seamless` in the new packages/tile-shell/src/shell.css) that sets padding:0 / gap:1px / hairline dividers and strips each tile's border/radius/shadow plus hides its header, so the grid reads as one seamless screen; a `ts-solo` variant for a single tile; hover-reveal resize splitters. Mount-once plus portal-into-active-slot (`TileHost` + `createSlotRegistry`, packages/tile-shell/src/components/TileHost.tsx): each tile element is created once keyed by id and portaled into whichever slot hosts it (grid cell, list section, or floating pane), so reorder, resize, edit-view toggle, and dock never remount a heavy tile. Dock-back (`FloatingTileLayer`, packages/tile-shell/src/components/FloatingTileLayer.tsx): pop a tile out into a position:fixed draggable/resizable pane with a "Dock" button that returns it to the grid and triggers a template reflow. This adopts the trading app's template-reflow plus dock-back model, NOT a net-new magnetic snap-to-neighbour engine (explicitly out of scope, noted in the code).

## Phase 3 — non-card list/report layout

A `layoutMode` of `grid` or `list` (ShellToolbar segmented control). List mode renders the same mount-once tiles as a seamless vertical report stack (`ts-tilelist` CSS: full-width sections, no card chrome, hairline dividers) instead of a card grid — for reporting-style stacked views. It is selectable per space and persists in the saved-space snapshot (`layoutMode` field), so a space saved as a list re-opens as a list.

## Phase 4 — server-persisted, shareable spaces (plus migration plus tenant-ready schema note)

Replaced the localStorage-only saved-spaces store with a server-side store. New table `saved_workspace_spaces` (migration `lib/db/drizzle/0049_saved_workspace_spaces.sql`, drizzle schema `lib/db/src/schema/savedWorkspaceSpaces.ts`) plus a BFF route set on planReviewBff.ts: `GET /plan-review/spaces` (list), `GET /plan-review/spaces/by-name/:name` (load), `PUT /plan-review/spaces` (upsert save/update, NamedLayout model), `DELETE /plan-review/spaces/by-name/:name`, `POST /plan-review/spaces/by-name/:name/share` (mint token), `GET /plan-review/spaces/shared/:token` (read-only fetch by link). Typed client methods added to `@hauska/cortex-client`. The app builds the shell's `SavedSpacesApi` from a server-backed factory with localStorage kept as a fast-path cache (createSavedSpacesApi in artifacts/codex-reviewer-qa/src/lib/workspaceSpaces.ts).

Tenant-ready note (the load-bearing design point). Tenancy/auth is NOT live yet (anonymous default tenant), so rows are keyed today by the default tenant plus the resolved owner id, resolved by a `resolveSavedSpaceOwner` helper that mirrors the existing engagement-create route line for line (internal session maps to the legacy internal owner; a user requestor maps to its id; otherwise 401; tenant is `session.tenantId ?? DEFAULT_TENANT_ID`). The `(tenant_id, owner_user_id)` columns plus the unique index on `(tenant_id, owner_user_id, name)` are shaped so the table becomes tenant-private cleanly when the auth build lands — per-user isolation is a WHERE-clause tightening, not a destructive migration. The share route is deliberately not owner-scoped (that is the point of a link) but returns only `{name, snapshot}` — no owner or tenant leak — and is reachable only by an unguessable randomUUID token, never pooled or listed cross-tenant. Per the anonymous-owner model, in a real browser the persistent `pr_anon_owner` cookie (HttpOnly, 7-day) gives one user a stable owner across requests so save/load round-trips; verified live below.

Migration / fixture discipline (all four touched): migration `0049` added; schema fixture `schema.sql.template` refreshed with the CREATE TABLE plus PK plus three indexes in pg_dump alphabetical order; the `schema.integration` expected-tables list gained `saved_workspace_spaces`; and `TRUNCATE_TABLES` in the api-server test setup gained it (a standalone table with no FK, so it needs explicit truncation). One CI iteration was required here: the fixture-drift check builds the live DB via `drizzle-kit push` from the TS schema, not the numbered migrations, so the partial `WHERE (share_token IS NOT NULL)` index in the first cut drifted (the drizzle schema had not declared it). Fixed by declaring a plain `uniqueIndex` on share_token in the drizzle schema (Postgres treats NULLs as distinct, so un-shared rows coexist and any minted token stays unique) and matching the migration plus template to it. Migration 0049 applied to live Neon via run-migrations: `49 migration file(s), 48 already tracked, pending: 0049 -> ok applied`.

## Phase 5 — Module Map surface

A new full-screen surface (`ModuleMap`, packages/tile-shell/src/components/ModuleMap.tsx, opened from the ShellToolbar) that lists every tile with what it does, its category, status, requires/produces, mcpTools, and the USER PERSONA it serves — reviewer, investor, architect, or operator. The persona is inferred data-driven from the registry by a pure `personaForTile` function (produces.findings/letter or requires.completedFindings or Deliverable -> reviewer; Property Intel/Market -> investor; Design Accelerator/Site Analysis or produces.annotations -> architect; Compliance intake/queue -> operator), grouped by persona with an "add to workspace" affordance. It reads the live capability registry passed from the app (`ALL_TILES`, derived from `TILE_CAPABILITIES`, the same array served by GET /admin/tile-registry) so it cannot drift from the 46-tile registry. This answers "see what everything does plus who uses each module."

## Per-phase reviewer verdicts

Two adversarial review sub-agents, both PASS-WITH-NITS, both evidence-backed:

Frontend shell (Phases 1/2/3/5). Verified the mount-once guarantee holds across reorder, pop-out/dock, edit-view, and grid-list (no heavy-tile remount; portal re-targets on slot register/unregister; no first-paint park-then-slot remount); drag-reorder can never drop a floated id into a grid slot; seamless/solo/list CSS classes never collide; ModuleMap reads the live registry. Two MED findings, both FIXED: (1) grid reflow used two disagreeing tile counts (full activeTiles vs docked gridIds) so removing a floated tile left a stale oversized template — refactored so the reflow is the SINGLE source of layout, keyed on the docked-tile signature, with an explicit-preset/snapshot skip guard and the initial preset layout seeded; (2) the header search could commit a stale preview for a since-edited query — now tracks `previewQuery` and only fast-paths a preview that matches the current query. The related LOW setState-in-updater and snapshot-clobber items were resolved by the same refactor.

Backend persistence (Phase 4). Verified resolveSavedSpaceOwner is faithful to the engagement-create route; no cross-owner read/write/delete path exists today; the share route leaks no owner/tenant; the upsert conflict target matches the unique index; DELETE returns a body the client json-parses; and (the load-bearing CI risk) confirmed the schema fixture template matches pg_dump output. One LOW fixed: `isValidSnapshot` now also requires colFr/rowFr arrays so a malformed stored snapshot cannot throw at load time.

## Verification (verbatim)

Local matrix (all green):
- typecheck:libs `tsc --build` EXIT 0; codex-reviewer-qa typecheck Done; api-server typecheck Done.
- app vite build EXIT 0 (188 modules, up from 181 baseline; only the pre-existing >500kB advisory).
- api-server esbuild build EXIT 0, `dist/index.mjs` produced; esbuild conditions still `["workspace"]` only (pg intact — the narrow-conditions gotcha respected).
- package builds: tile-shell + cortex-client build success (tile-shell index.css bundles shell.css).
- app test suite 91/91 pass (incl. tile-registry drift guard 6/6 and the activeParcel provider tests).

CI on PR #221 (final run): Typecheck pass (1m52s), Test pass (6m55s — incl. DB-backed integration, schema fixture-drift, and expected-tables), Eval/Rubric pass. (First run failed only on the share_token fixture-drift, fixed as above.)

Live canary CRUD round-trip (curl with a persisted `pr_anon_owner` cookie, `--ssl-no-revoke`):

```
CANARY GET  /api/plan-review/spaces                 -> [] HTTP 200   (new route live, migrated table)
CANARY PUT  /api/plan-review/spaces (__rt__)        -> {"id":"8be8...","name":"__rt__"} HTTP 200
CANARY GET  /api/plan-review/spaces                 -> [{...,"name":"__rt__",...}] HTTP 200
CANARY GET  /api/plan-review/spaces/by-name/__rt__  -> full snapshot incl. layoutMode:"list" HTTP 200
CANARY POST /api/plan-review/spaces/by-name/.../share -> {"shareToken":"e166..."} HTTP 200
CANARY GET  /api/plan-review/spaces/shared/<token>  -> {"name","snapshot"} only, no owner/tenant leak HTTP 200
CANARY DELETE /api/plan-review/spaces/by-name/...   -> {"ok":true} HTTP 200
CANARY /api/healthz -> {"status":"ok"} 200 ; /codex-reviewer-qa/ 200 ; /admin/tile-registry 200
```

Production smokes after traffic shift:

```
PROD /api/healthz                    -> {"status":"ok"} HTTP 200
PROD /codex-reviewer-qa/             -> HTTP 200
PROD /api/plan-review/spaces         -> [] HTTP 200   (new route live in prod)
PROD /api/plan-review/admin/tile-registry -> HTTP 200
```

## Deploy

Canary sequence on merge SHA `c84af22` (image built by the push-triggered build-and-push, run 28602757470):
- deploy-canary (run 28603035292) -> revision `cortex-api-00281-joy` created at 0%, tag `canary`, Ready. SUCCESS.
- run-migrations (run 28603228622) -> `pending: 0049_saved_workspace_spaces.sql -> ok applied` against live Neon (ep-lucky-truth...neondb). SUCCESS.
- canary smoke (the CRUD round-trip + share above) -> all green.
- shift-traffic (run 28603553911) -> 100% to canary; prod `/api/healthz` 200. SUCCESS.

`gcloud run services describe cortex-api` confirms `cortex-api-00281-joy` serves 100% of production traffic. Prior/rollback revision: `cortex-api-00279-boj`.

## PR + merge

- PR: https://github.com/empressaioemail-tech/legacy-design-tools/pull/221
- Merge: squash-merged to main, merge commit `c84af22`, PR state MERGED. origin/main confirmed to contain the merge (tip `c84af22`); 21 files changed, 2339 insertions.
- Split note: shipped as one PR (the phases are tightly coupled through CortexShell + GridCanvas + the shared types); three checkpoint commits on the branch (feature, review fixes, fixture-drift fix) squashed into the single merge.

## Operational hazard encountered (for the record)

Mid-build, the first tmp clone at `p:\tmp\phase2\shell-legacy-design-tools` was recycled by the shared-tmp cleanup (the `.git` and `packages` trees vanished, matching the known stale-clone / tmp-wipe hazard). Re-cloned fresh into `p:\tmp\p2shell\shell`, re-applied all files from working context, and (on the coordinator's insurance checkpoint) committed and pushed the branch immediately as a safety net before continuing. No work was lost. Lesson reinforced: push a branch checkpoint early rather than leaving the only copy uncommitted on a shared tmp clone.

## Rollback

Roll traffic back to `cortex-api-00279-boj` via the `rollback` workflow_dispatch (`action=rollback`, `rollback_revision=cortex-api-00279-boj`). Migration 0049 is additive (a new table + indexes only); it does not need to be unwound for a code rollback, and the prior revision simply ignores the table.

## Known notes

- Overflow-tile selection (>4 docked tiles) tints the selected overflow chip but does not yet swap it into a visible slot — pre-existing behavior, not introduced here; left as a follow-up (queue behind the wedge).
- `personaForTile` buckets `document-viewer` (Compliance + produces.annotations) under architect via the annotations rule; a deliberate, deterministic mapping, flagged per convention but not changed.
- Share-link fetch requires the token holder to reach the same-origin BFF (session-gated route); a public unauthenticated share surface is not in scope.
