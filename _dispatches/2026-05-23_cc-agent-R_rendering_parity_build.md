---
id: 2026-05-23_cc-agent-R_rendering_parity_build
title: Dispatch — cc-agent-R Cortex rendering parity build (40e)
date: 2026-05-23
agent: cc-agent-R
repo: legacy-design-tools
kind: dispatch
related: [40e_cortex_rendering_parity_sprint, 40c_cortex_rendering_sprint, 42_design_accelerator_program_plan, 28_mcp_first_product_design, 20_agent_operating_rules, 90_runbooks/agent_workspace_hygiene]
---

# cc-agent-R dispatch — Cortex rendering parity build (40e)

You are cc-agent-R, re-activated from dormant for the successor sprint
to 40c. The full scope, architecture, atom shape, and rationale are in
[`40e_cortex_rendering_parity_sprint.md`](../40e_cortex_rendering_parity_sprint.md);
this dispatch is the execution brief. The 40c gap-fill you shipped on
2026-05-22 (PRs #79 + #80) is the predecessor — its deferrals are
40e's scope.

## Mission

Bring the Cortex Renders tab to full parity with the
`Hauska-io/design-suite-web` reference repo. Build behind
`RENDERS_PROD_ENABLED`; production stays dark until the operator
flips the two-flag pair (`RENDERS_PROD_ENABLED=true` +
`MNML_RENDER_MODE=live` in the same Cloud Run revision). No change
to the activation model.

Three workstreams: A backend extensions, B frontend functional,
C UX polish. Sequencing per the 40e Build workstreams section;
cross-workstream dependencies named there. PRs per workstream item or
grouped if cohesive — agent's call, optimized for review-ability.

## Run posture — workspace isolation (critical)

You are the third concurrent agent in `legacy-design-tools` during
this sprint:

- **cc-agent-C** is on QA-22 EPA Path 1a (after PR #102 FCC-drop
  merges); touches `lib/adapters/federal/`, possibly `lib/codes/`.
- **cc-agent-C2** is finishing Regrid SCOPE B (PR #104 held for
  operator merge; then resumes Phase 2D.1 PR 2 USGS 3DEP DEM raster);
  touches `lib/adapters/national/regrid.ts`, `lib/site-context/server/overlays.ts`,
  api-server DEM client, `SiteMap.tsx`, the `site-topography` atom.
- **You (cc-agent-R)** own the file-path allowlist below. Disjoint
  from both.

Work your existing dedicated clone of `legacy-design-tools` per
[`90_runbooks/agent_workspace_hygiene.md`](../90_runbooks/agent_workspace_hygiene.md).
Never touch branches owned by cc-agent-C or cc-agent-C2. Commit
branches prefix `cortex/40e-*` for traceability — e.g.
`cortex/40e-power-tools-client`, `cortex/40e-param-grid`,
`cortex/40e-mask-canvas`, `cortex/40e-ux-polish`.

The 2026-05-22 workspace-hygiene incident is the failure mode this
discipline prevents. If you detect a cross-agent collision (HEAD
switched out from under you, a file in the allowlist modified by
another actor between adjacent shell calls, a branch contaminated by
another agent's commit), STOP and surface to the planner via `_inbox/`
immediately. Do not attempt recovery on your own — the planner
coordinates with the other agents.

## File-path allowlist

You may edit:

- `artifacts/api-server/src/routes/renders.ts` (extend — existing 1,474-line surface)
- `artifacts/api-server/src/routes/render-tools.ts` (NEW — 5 power-tool routes)
- `artifacts/api-server/src/routes/index.ts` (REGISTER new routes only — do not touch unrelated routes)
- `artifacts/api-server/src/lib/mnml-client/**` (extend — add 5 power-tool methods to `MnmlClient` / `HttpMnmlClient` / `MockMnmlClient`)
- `artifacts/api-server/src/lib/db/schema/viewpointRenders.ts` (extend — new columns per A.4)
- `artifacts/api-server/src/lib/db/schema/renderOutputs.ts` (extend if needed)
- `artifacts/api-server/src/lib/db/migrations/00NN_*.sql` (NEW — migration number = current head + 1; verify head with `ls lib/db/migrations/` before naming)
- `lib/portal-ui/src/components/Render*` (extend — `RenderCard`, `RenderGallery`, `RenderKickoffDialog`, `RenderCreditsBadge`)
- `lib/portal-ui/src/components/render-tools/**` (NEW — 5 power-tool dialog components per B.3)
- `lib/portal-ui/src/components/MaskCanvas*` (NEW — B.4)
- `lib/portal-ui/src/components/BeforeAfterSlider*` (NEW — C.1)
- `lib/portal-ui/src/components/ConstellationCanvas*` (NEW — C.7)
- `lib/portal-ui/src/components/DragDropUpload*` (NEW — C.2)
- `lib/portal-ui/src/schemas/mnml-experts.ts` (NEW — A.3 static per-expert parameter schema)
- `artifacts/design-tools/src/components/engagement-detail/RendersTab.tsx` (extend)
- Generated client (`lib/api-zod`, `lib/api-client-react`) + OpenAPI spec (`lib/api-spec/openapi.yaml`) — ADDITIVE ONLY; do not modify unrelated definitions

You may not edit:

- `lib/adapters/**` (cc-agent-C + cc-agent-C2 territory)
- `lib/site-context/**` (cc-agent-C2 territory)
- `lib/codes/**` (cc-agent-C territory)
- `chat.ts` and related in-app chat agent surfaces (chat-initiated concept imagery is a separate deferral, cc-agent-C lane)
- Any test or fixture file outside your allowlist
- Any branch you didn't create

If the agreed scope requires a file outside this allowlist, STOP and
surface to the planner before extending the allowlist.

## Autonomy

Build autonomously through all three workstreams. Do not stop for
operator sign-off. Open PRs and self-merge them to `main` once CI is
green — `RENDERS_PROD_ENABLED` keeps all of this dark in production,
so merging incomplete work to `main` is safe by construction. Where a
real product decision is genuinely required, make the most reasonable
call, record it in the PR body and your session summary, and continue.
The two things you do NOT do autonomously:

1. **Apply database migrations to the production DB.** Prepare the
   migration in the PR; list it in your `_inbox/` summary as an
   operator return-task. The feature does not need the prod migration
   applied to be code-complete (the `_schema_migrations` workflow can
   apply it later per [`90_runbooks/cloud_run_canary_deploy.md`](../90_runbooks/cloud_run_canary_deploy.md)).
2. **Extend the file-path allowlist.** Surface and let the planner
   re-coordinate.

## Vendor API — endpoints added this sprint

mnml.ai. Base URL `https://api.mnmlai.dev/v1/`. Auth header
`Authorization: Bearer <key>` (existing `MNML_API_KEY` Cloud Run
secret from V1 / 40c — no new secret provisioning needed). All
endpoints below are async POST returning a job id, polled via the
existing `GET /v1/status/{id}` worker. Multipart upload everywhere
except status check.

Captured-from-docs reference dated 2026-05-23 lives in
[`40e_cortex_rendering_parity_sprint.md`](../40e_cortex_rendering_parity_sprint.md)
under "mnml.ai vendor surface — endpoints added this sprint". Verify
each endpoint against the live docs at
`https://mnmlai.dev/docs/api/<tool>` during the A.1 implementation
(paths: `/docs/api/render-enhancer`, `/docs/api/4k-upscaler`,
`/docs/api/ai-eraser`, `/docs/api/inpaint`, `/docs/api/style-transfer`).

The full `archDiffusion-v43` per-expert parameter schema (10 common
params + 6 per-expert grids — exterior 12, interior 8, masterplan 5,
landscape 6, product 5, plan 6) is at
`https://mnmlai.dev/docs/api/arch-diffusion-v43`. Read it directly
during A.3 implementation. The planner-session capture at
[`_sessions/2026-05-23_cortex_rendering_parity_sprint_planning_claude_code.md`](../_sessions/2026-05-23_cortex_rendering_parity_sprint_planning_claude_code.md)
has the snapshot if the live docs are inaccessible.

Cost notes: AI Eraser + 4K Upscaler are documented as 1 credit each;
Render Enhancer, Inpaint, and Style Transfer have unspecified cost
in the docs and will surface on first live call. Surface costs in the
PR descriptions as you discover them.

## Workstream A — backend extensions

Order within A is independent except as noted; recommended sequence:
A.1 → A.2 (depends on A.1) → A.3 (independent) → A.4 (independent) →
A.5 (independent) → A.6 (depends on A.4).

- **A.1.** Add five power-tool methods to `MnmlClient`,
  `HttpMnmlClient`, `MockMnmlClient`: `enhance`, `upscale`, `aiErase`,
  `inpaint`, `styleTransfer`. Multipart upload everywhere; async
  return shape matches existing `triggerRender` (job id immediately,
  poll via `getStatus`). Unit tests per method. Mock variants return
  realistic placeholder responses for dev/CI/staging.
- **A.2.** Five new routes in `routes/render-tools.ts` (or grouped
  appropriately): each accepts multipart upload, calls the appropriate
  `MnmlClient` method, persists a job row in `viewpoint_renders`
  (using the new `source_type` discriminants from A.4), returns the
  job id. Architect-gated + prod-flag-gated. Registered in
  `routes/index.ts` (additive — do not touch unrelated route
  registrations).
- **A.3.** Static per-expert parameter schema module at
  `lib/portal-ui/src/schemas/mnml-experts.ts` (or
  `artifacts/api-server/src/lib/render-schemas/mnml-experts.ts` if
  cross-package shared — your call). TS-defined: 10 common params
  (geometry, view_mode, seed, annotation, show_dimensions,
  markup_mode, has_collage, reference_image_1-4) + 6 per-expert
  grids per the live mnml docs. Each parameter declares: name, type
  (string | number | boolean | enum<readonly tuple>), required,
  default, range (for numbers). Used by B.1 to render the UI and
  optionally by A.2 routes for server-side validation.
- **A.4.** Schema migration. New migration file at next available
  number (verify with `ls artifacts/api-server/src/lib/db/migrations/`
  before naming — cortex-prod is at `0015` per QA-04 Part 2; expect
  `0016` or `0017` depending on what else lands first). Extends
  `viewpoint_renders.source_type` union to include `'upload' | 'enhance' | 'upscale' | 'erase' | 'inpaint' | 'style_transfer'`
  (the existing values stay valid — additive). Adds nullable
  `source_upload_url TEXT` column (GCS reference for B.2). Adds
  nullable `parent_render_output_id UUID` column with FK to
  `render_outputs.id` (parent linkage for tool outputs). Idempotent
  SQL (`IF NOT EXISTS` patterns where supported).
- **A.5.** Upload-as-source pipe. New multipart upload endpoint in
  `routes/renders.ts` (or a new `routes/render-uploads.ts` — your
  call). Stores to GCS under an `uploads/` prefix using the existing
  `ObjectStorageService`. Returns a stable reference (the GCS object
  path or a signed URL — whichever the kickoff route accepts as the
  `image` field). Kickoff route extended to accept that reference as
  source, parallel to the existing GLB-capture path. Both paths
  produce a `render-output` atom with the appropriate `source_type`.
- **A.6.** Extend `render-output` atom variants for tool outputs.
  Atom-registry update at `lib/atoms/src/render-output.atom.ts` (or
  wherever the atom is registered): `source_type` matches A.4;
  `parent_render_output_id` carries the chain for tool outputs. Atom
  contract is additive — same `accessPolicy: tenant-private`, same
  provenance discipline, plus parent linkage. Atom version bump per
  the ADR-001 convention (treat as one coordinated bump).

**Workstream A acceptance.** All unit tests pass per package; existing
renders test suite green with no regressions; full workspace typecheck
green (`pnpm -w typecheck:libs`, `pnpm --filter design-tools typecheck`).
Migration runs clean in CI (forward-only).

## Workstream B — frontend functional

Recommended sequence within B: B.4 (mask canvas, standalone) → B.3
(power-tool dialogs, need A.1+A.2+B.4 for Eraser/Inpaint) → B.1 (param
grid, needs A.3) → B.2 (upload-as-source, needs A.5 + C.2) → B.5
(tool-output gallery rendering, needs A.6). Or any equivalent ordering
respecting the dependencies named in 40e Sequencing.

- **B.1.** Full per-expert parameter grid in `RenderKickoffDialog`.
  Schema-driven from A.3. Collapsible sections per expert; each
  control is a select / slider / radio per the param type; defaults
  match mnml's. Replaces the current minimal expert+style-only kickoff
  form. Backward compatible — existing kickoff calls with the minimal
  set still work.
- **B.2.** Upload-as-source flow in the kickoff dialog. Source-input
  selector: model-capture (existing) vs. upload (new). Upload path
  uses `DragDropUpload` (C.2), uploads via A.5 endpoint, passes the
  resulting GCS reference into the kickoff body. Closes the 40c B.2
  caveat.
- **B.3.** Five power-tool dialogs in `lib/portal-ui/src/components/render-tools/`:
  `RenderEnhancerDialog`, `UpscaleDialog`, `AiEraserDialog`,
  `InpaintDialog`, `StyleTransferDialog`. Each launched from a
  `RenderCard` action ("Enhance" / "Upscale" / "Erase" / "Inpaint" /
  "Restyle"). Wire to the corresponding A.2 routes; resulting jobs
  enter the standard polling worker pipeline. Per-dialog param controls
  per 40e B.3 detail.
- **B.4.** `MaskCanvas` component. HTML5 canvas; brush tool with
  configurable size; clear; depth-limited undo; export to PNG matching
  source image dimensions. Used by `AiEraserDialog` and `InpaintDialog`.
  Self-contained with its own test file. Aim ~300-500 LOC.
- **B.5.** Tool-output rendering in `RenderGallery`. Tool outputs
  render as children of their parent (via `parent_render_output_id`
  from A.6). `RenderCard` extended to detect the parent-child
  relationship and present visually. Expanded parent shows derivation
  chain.

**Workstream B acceptance.** All new components have test files (Vitest
+ React Testing Library, matching the existing `RenderKickoffDialog.test.tsx`
+ `RenderGallery.test.tsx` patterns). 447+ portal-ui tests stay green
(current baseline per 40c session summary). `pnpm -w typecheck:libs`
and `pnpm --filter design-tools typecheck` both green.

## Workstream C — UX polish

Order within C: C.2 (drag-drop) is upstream of B.2 + B.3 file inputs,
so build it early. Otherwise items are independent.

- **C.1.** `BeforeAfterSlider` component. Side-by-side comparison for
  still renders; draggable divider; renders source on one side, output
  on the other. Used in `RenderCard` for still renders (elevation-set
  keeps its grid presentation; video keeps its player).
- **C.2.** `DragDropUpload` component. Replaces file pickers in
  Prompt Generator (existing), B.2 upload, all five B.3 dialog file
  inputs. Drag-over visual feedback; click-to-pick fallback; file-size
  + type validation per the target endpoint.
- **C.3.** Negative-prompt field in `RenderKickoffDialog`. Optional
  textarea; passes through as a `negative_prompt` expert param to
  mnml `archDiffusion-v43`. Use the existing free `expertParams`
  passthrough — no engine contract change.
- **C.4.** Seed input in `RenderKickoffDialog`. Numeric; "random"
  button clears the value (mnml defaults to random when seed
  unspecified). Passes through as `seed` expert param.
- **C.5.** Processing-time elapsed timer in `RenderCard` for in-flight
  renders. Replaces `formatRelative()` display during the in-flight
  window (statuses `queued`, `rendering`); flips back to `formatRelative`
  on terminal status (`ready`, `failed`, `cancelled`). Tick at 1s
  resolution.
- **C.6.** URL share / copy-to-clipboard button on `RenderCard` for
  terminal-state renders. Copies the render-output GCS reference URL.
  Standard `navigator.clipboard.writeText` + toast confirmation.
- **C.7.** `ConstellationCanvas` animated background in `RendersTab`.
  Canvas-based particle / star field. Mount above the tab content.
  Perf-budget guard: if measured FPS drops below threshold (e.g. 30
  FPS over a 2-second window), disable animation and render a static
  background. Canvas vs WebGL: your call after a brief perf eval on
  the Cortex prod load profile.

**Workstream C acceptance.** All new components have test files
(unit tests for component behavior; perf budget for ConstellationCanvas
verified in dev). Visual review by operator post-merge before
activation.

## Mock-mode coverage

Extend `MockMnmlClient` to cover the 5 new power-tool methods and the
upload-as-source path. Mock outputs should be realistic enough to
exercise B.3 + B.5 UI end-to-end in dev/CI/staging without hitting the
live mnml API. Mock outputs are deterministic per input (use a hash of
the input to pick a fixture).

## Activation gate

`RENDERS_PROD_ENABLED=false` keeps the entire surface dark in
production. Activation is the operator flipping `RENDERS_PROD_ENABLED=true`
+ `MNML_RENDER_MODE=live` in the same Cloud Run revision — no further
code change required. Do not change the flag mechanism. Do not couple
40e activation to anything other than the existing two-flag pair.

## Reporting

Write session summaries to `P:\doc_repo\_inbox\` as
`<date>_legacy-design-tools_cc-agent-R_<topic>.md` per HR-11 in
[`20_agent_operating_rules.md`](../20_agent_operating_rules.md), at
each working-session boundary and at every workstream boundary. Do
not commit to the doc repo. The planner sweeps `_inbox/` on a
10-minute loop and rolls summaries into the doc set.

Each summary lists: PRs opened and merged; any decision you made
autonomously (with reasoning); any migration prepared for the
operator; any cross-agent overlap you hit (and how you resolved or
escalated it); any item you discovered out-of-allowlist and surfaced.

## Operator return-tasks

- **None for the build itself.** The build is fully agent-driven.
- **Migration apply.** When the new migration lands (A.4), it
  doesn't auto-run on prod; operator applies via Cloud Shell `psql`
  or the `run-migrations` workflow per `90_runbooks/cloud_run_canary_deploy.md`.
- **Activation.** Two-flag pair in a Cloud Run revision —
  unchanged from 40c.
- **Visual review of C-workstream polish** post-merge before
  activation — operator's call on whether the polish components
  match the reference's intent.
- **mnml plan check** if the unspecified-cost tools (Enhancer,
  Inpaint, Style Transfer) prove expensive at first live call.
  Optional.
