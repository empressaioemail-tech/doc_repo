---
date: 2026-05-22
repo: legacy-design-tools
agent: cc-agent-R
kind: session-summary
phase: Phase B — frontend (boundary, session-end)
dispatch: 2026-05-22_cc-agent-R_cortex_rendering_build
sprint: 40c_cortex_rendering_sprint
prs: [79, 80]
status: Phase A merged (#79); Phase B PR open (#80), CI running
---

# cc-agent-R — Phase B complete; gap-fill in flight on `main` (Phase A) and PR #80 (Phase B)

## Session arc

1. Phase A.1 audit → discovered the dispatch's premise is wrong (the
   Cortex render feature is already built and merged by the earlier
   V1 / Spec-54 sprint). Surfaced to the operator with three options.
   See `2026-05-22_legacy-design-tools_cc-agent-R_phase-a1-audit.md`.
2. Operator chose **gap-fill only** — build the doc 40c deltas missing
   from `main`, additively, behind `RENDERS_PROD_ENABLED`.
3. Phase A (backend) built, PR #79 opened, CI green, **merged** to `main`
   as commit `b8b0cdf`. See
   `2026-05-22_legacy-design-tools_cc-agent-R_phase-a-backend.md`.
4. Phase B (frontend) built, PR #80 opened, CI running.

## What Phase B (PR #80) delivers

**`RenderCreditsBadge` (`lib/portal-ui`)**
- Compact `✦ N mnml credits` chip wired to `GET /api/renders/credits`
  via the generated `useGetRenderCredits` hook (doc 40c B.6).
- Silent on 503 `renders_preview_disabled` (the gallery owns that
  user-facing message); friendly "unavailable" chip on any other
  error.
- Mounted in `design-tools` `RendersTab.tsx` next to "New render".

**`RenderKickoffDialog` (`lib/portal-ui`)** — extended with:
- Intent toggle: **Deliverable render** vs **Concept imagery** (doc
  40c B.1). The deliverable intent defaults to exterior + photoreal;
  concept defaults to `plan` + freehand_sketch. The architect can
  override either select afterwards.
- Expert type + render style selects (all six experts, all eight
  styles). `expertName` and `renderStyle` flow through the existing
  kickoff body — no backend change needed; the V1 sprint already
  surfaced them on `KickoffRenderCommonFields`.
- **Prompt Generator** affordance: pick an image (≤8MB), POST it to
  `/api/renders/prompt-generator` via the exported `customFetch`, drop
  the returned prompt straight into the textarea. Existing textarea
  content (if any) is forwarded as the `keywords` hint.
- Both the kickoff `onSuccess` and the prompt-generator `onSuccess`
  invalidate `getGetRenderCreditsQueryKey()` so the badge refreshes
  after every credit-spending action.

**Tests** — 4 new `RenderCreditsBadge` cases + 6 new
`RenderKickoffDialog` cases (intent defaults, intent flip, expert /
style in the kickoff body, generator button enablement, generator
round-trip, oversize-image guard). 447 portal-ui tests green locally;
`pnpm -w typecheck:libs` and `pnpm --filter design-tools typecheck`
both green.

## Decisions made autonomously

1. **Concept-imagery source pipeline (doc 40c B.2) deferred.** Full
   manual-upload-as-render-source needs a new image-upload pipe plus
   `viewpoint_renders` accepting an image source (vs the existing
   GLB-capture-only). This PR delivers the architect-facing concept
   affordance — intent toggle + plan expert + sketch styles + Prompt
   Generator — but the render itself still captures the GLB. Documented
   in the PR as a follow-on.
2. **Full schema-driven per-expert parameter grid (doc 40c B.1) deferred.**
   The kickoff body already accepts a free `expertParams` map and the
   engine handles per-expert validation; this PR exposes the two
   highest-leverage knobs (expert + style) without building the full
   camera-angle × time-of-day × weather grid. Noted as a follow-on.
3. **Multipart file part kept out of the OpenAPI schema (Phase A).** The
   orval codegen has no DOM lib, so a `format: binary` File/Blob body
   type does not compile. The FE builds the multipart body by hand,
   mirroring the snapshot multipart precedent. `customFetch` is now
   exported from `@workspace/api-client-react` for this.

## Operator return-tasks

- **None for this gap-fill.** `MNML_API_KEY` / `MNML_API_URL` Cloud
  Run secrets already exist from the V1 sprint and are reused as-is.
  `RENDERS_PROD_ENABLED` keeps the surface dark in production.
- **No DB migration.** Credits and prompt-generator are stateless; no
  schema change. (Phase 1A's "take migration 0016+" instruction does
  not apply.)

## cc-agent-C overlap

None hit across the session. No shared files; no migration (cc-agent-C
owns migration 0015 in PR #73, this work adds none).

## Workspace note

cc-agent-R worked the primary `legacy-design-tools` clone, branched
twice off `origin/main`:
- `feat/cortex-render-gap-fill` (Phase A) → merged via PR #79, branch
  deleted.
- `feat/cortex-render-gap-fill-ui` (Phase B) → open as PR #80.

The primary tree's prior branch (`fix/p1-5-architect-review-audience`,
PR #77) was left untouched. The autocrlf phantom-diff effect (known
issue) flagged ~90 api-zod generated files as modified with no real
content change after the orval codegen ran in Phase A; only the
genuinely-changed files were committed.

One mid-session glitch: after `gh pr merge 79 --delete-branch` my
local HEAD ended up on `main` (not the Phase B branch). The Phase B
commit was already on the correct content base (Phase A's squash on
`main`), so I force-moved the `feat/cortex-render-gap-fill-ui` ref to
the Phase B commit and `git reset --hard origin/main` on `main` to
roll back. No data lost. Cause was not investigated — likely a
`gh pr merge` side-effect; flagging here so the planner can decide
whether to write a hygiene note.

## Doc-set reconciliation pointer for the planner

The planner sweeps `_inbox/` per HR-11; the audit + Phase A + Phase B
summaries are the input set. Recommended reconciliation:

- **`40c_cortex_rendering_sprint.md`** — mark exit-criteria status
  honestly: every numbered exit criterion is satisfied (deliverable /
  concept intents, single + elevation-set + concept + video, GCS
  storage, polling worker survives restart, credits visible), with
  the caveats that (a) "concept imagery" runs off the GLB capture
  rather than a manual sketch upload (B.2 deferred) and (b) the
  per-expert parameter grid is not the full schema-driven version
  (B.1 deferred).
- **`_decisions/2026-05-22_cortex_rendering_activation.md`** — the
  activation decision presumed greenfield. Suggest a brief amendment
  noting the V1 sprint already shipped the core, and what gap-fill
  was actually done.
- **42_design_accelerator_program_plan.md** — the deferred follow-ons
  (B.1 schema-driven param grid, B.2 manual upload as render source,
  power-tool typing, MCP `cortex/render_*` retrofit) belong on the
  watch line.

## End of session

PR #80 is open and CI is running. Once green, cc-agent-R will
self-merge per the dispatch's autonomy clause; if anything fails, the
operator (or a future cc-agent-R turn) can iterate from CI feedback.
