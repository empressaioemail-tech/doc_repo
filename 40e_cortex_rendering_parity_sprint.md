---
id: 40e_cortex_rendering_parity_sprint
title: Cortex rendering parity sprint
status: active
last_updated: 2026-05-23
applies_to: design-accelerator
related: [40c_cortex_rendering_sprint, 40b_advanced_capture_features, 42_design_accelerator_program_plan, 40_design_accelerator, 28_mcp_first_product_design, _decisions/2026-05-23_cortex_rendering_parity_sprint_scope]
owner: nick
---

# Cortex rendering parity sprint

> **What this is.** The successor sprint to
> [`40c_cortex_rendering_sprint.md`](40c_cortex_rendering_sprint.md), which
> closed the V1 gap-fill (PRs #79 + #80, merged 2026-05-22). 40e pulls the
> three named 40c deferrals (B.1 schema-driven per-expert parameter grid,
> B.2 image-upload-as-render-source, the five power tools) into one
> all-scope sprint and bundles UX-polish parity against the
> `Hauska-io/design-suite-web` reference repo.
> Decision: [`_decisions/2026-05-23_cortex_rendering_parity_sprint_scope.md`](_decisions/2026-05-23_cortex_rendering_parity_sprint_scope.md).

## Status — 2026-05-23

Just-dispatched. cc-agent-R re-activated on its dedicated
`legacy-design-tools` clone for the build; dispatch at
[`_dispatches/2026-05-23_cc-agent-R_rendering_parity_build.md`](_dispatches/2026-05-23_cc-agent-R_rendering_parity_build.md).
Three concurrent agents in the repo for the sprint duration: cc-agent-C
(QA-22 EPA Path 1a), cc-agent-C2 (Regrid SCOPE B finishing), cc-agent-R
(this sprint). File-path allowlist in the dispatch enforces disjoint
scope.

Premortem-check run formally 2026-05-23: load-bearing commitments
(1 sell reasoning, 2 partnership-first, 3 cost per jurisdiction) all
GREEN. Operational yellows on three commitments — 4 dual-interface (the
`cortex/render_*` MCP retrofit scope widens materially), 5 Hauska spine
(indirect via Cortex product depth, not direct substrate feed), 6 focus
queue (3 concurrent agents in legacy-design-tools). Operator
acknowledged all three explicitly. Overall verdict: yellow with named
mitigations, cleared to proceed.

Activation in prod remains gated on the operator flipping
`RENDERS_PROD_ENABLED=true` paired with `MNML_RENDER_MODE=live` in the
same Cloud Run revision. No change to that activation model.

## Origin

40c (the gap-fill sprint) shipped 2026-05-22 with two named deferrals
(B.1, B.2) plus four typed-but-not-surfaced power tools. The operator's
2026-05-23 framing pulled all three forward against the
`Hauska-io/design-suite-web` reference repo, summarized as "all of it.
i want to make it work like the examples i gave you."

Three reference repos were named: `design-suite-web`,
`design-suite-server-infra`, `design-suite-web-infra`. The two infra
repos are Terraform/AWS only (ECS Fargate + ECR + ALB) and irrelevant
for the Cortex target, which deploys to Cloud Run. Only `design-suite-web`
is a meaningful pattern target.

The cross-walk (Explore agent, 2026-05-23) found `design-suite-web` is a
React + Vite + TS + Tailwind + shadcn SPA covering 5 generic
image-to-design operations (interior, exterior, style-transfer,
render-enhancer, virtual-staging). It is a **different domain** from
Cortex's BIM-driven mnml integration. The reference has no equivalent
for elevation sets, video, expert selector, GLB sourcing, or Prompt
Generator. Cortex is ahead of the reference on those axes. Where the
reference exceeds Cortex: full per-operation parameter grids, side-by-side
before/after slider, drag-and-drop upload, negative-prompt field, seed
input, processing-time live timer, URL share button, ConstellationCanvas
animated background.

The styling delta limits direct lift. Reference is Tailwind class-string
heavy; portal-ui uses custom `smartcity-*` CSS + design-token CSS
variables. Reference components must be re-implemented against
Cortex's token system, not copy-pasted. This sprint treats `design-suite-web`
as a UX pattern reference and a completeness benchmark, not a code source.

## Scope

In scope for this sprint, organized into three workstreams:

### Workstream A — backend extensions

- **A.1.** Five power-tool client methods added to `MnmlClient` /
  `HttpMnmlClient` / `MockMnmlClient`: `enhance` (POST `/v1/render/enhancer`),
  `upscale` (POST `/v1/upscale`), `aiErase` (POST `/v1/ai-eraser`),
  `inpaint` (POST `/v1/inpaint`), `styleTransfer`
  (POST `/v1/style/transfer`). All multipart upload, all async returning
  job id polled via existing `GET /v1/status/{id}` worker. Unit tests
  per method.
- **A.2.** Five corresponding `api-server` routes (e.g. in a new
  `routes/render-tools.ts`): each handles the multipart upload, calls the
  appropriate `MnmlClient` method, persists the job row, returns the job
  id. Registered alongside the existing renders surface; architect-gated
  + prod-flag-gated.
- **A.3.** Static per-expert parameter schema module
  (`lib/portal-ui/src/schemas/mnml-experts.ts` or equivalent in
  `api-server` shared types). TS-defined from the mnml v4.3-Ultra docs
  capture: 10 common params + per-expert grids (exterior 12, interior 8,
  masterplan 5, landscape 6, product 5, plan 6). Drives B.1 UI; no
  runtime endpoint required.
- **A.4.** Schema migration extending `viewpoint_renders.source_type`
  union to include `'upload' | 'enhance' | 'upscale' | 'erase' | 'inpaint' | 'style_transfer'`;
  new `source_upload_url` column (GCS reference for B.2);
  new `parent_render_output_id` column (parent linkage for tool-derived
  outputs). Migration number adjusts at PR-creation time based on
  current head; agent verifies head before naming.
- **A.5.** Upload-as-source pipe: new image-upload endpoint (multipart),
  stores to GCS, returns a reference usable as the `image` field of a
  subsequent kickoff. Kickoff route extended to accept the upload
  reference as source (vs. existing GLB-capture-only path).
- **A.6.** Extend `render-output` atom variants for tool outputs:
  `source_type` matches the migration; `parent_render_output_id` carries
  the chain; per-tool param sets stored alongside existing render
  parameters. Atom registry update is additive (per the ADR-001 +
  ADR-017 conventions already established for `render-output`).

### Workstream B — frontend functional

- **B.1.** Full per-expert parameter grid component. Schema-driven from
  the A.3 module, rendered as collapsible sections per expert in the
  `RenderKickoffDialog` for the deliverable-render intent. Each control
  is a select / slider / radio per the param's type. Defaults match
  mnml's documented defaults. Replaces the current minimal expert +
  style-only kickoff form. Maintains backward compatibility — existing
  kickoff calls with the minimal param set still work.
- **B.2.** Upload-as-source flow in the kickoff dialog: source-input
  selector (model-capture vs. upload). Upload path uses drag-and-drop
  component from C.2, uploads via A.5 endpoint, passes the resulting GCS
  reference into the kickoff body. Closes the 40c B.2 caveat — concept
  imagery becomes end-to-end from a manual sketch upload.
- **B.3.** Five power-tool dialogs/panels in `portal-ui`:
  - **`RenderEnhancerDialog`** — launched from a `RenderCard` "Enhance"
    action; image input is the parent render's output; sliders for
    geometry, creativity, dynamic (0-10), seed, sharpen; prompt textarea.
  - **`UpscaleDialog`** — launched from a `RenderCard` "Upscale" action;
    image input is the parent render's output; scale select (2/4/8);
    face_enhance toggle.
  - **`AiEraserDialog`** — launched from a `RenderCard` "Erase" action;
    image input is the parent render's output; mask drawn via the
    `MaskCanvas` (B.4); output_format select.
  - **`InpaintDialog`** — launched from a `RenderCard` "Inpaint" action;
    image + mask (via `MaskCanvas`); prompt + negative_prompt textareas;
    seed input; mask_type select (manual vs. automatic).
  - **`StyleTransferDialog`** — launched from a `RenderCard` "Restyle"
    action; image input is the parent render's output; second file
    picker for `reference_image`; prompt textarea; strength +
    color_preservation sliders; preserve_structure toggle.
  Each dialog wires to the corresponding A.2 route and registers the
  resulting job in the standard polling worker.
- **B.4.** `MaskCanvas` component — HTML5 canvas + brush tool (paint
  white on black background per AI Eraser + Inpaint mask semantics);
  controls for brush size, clear, undo (depth-limited), and export to
  PNG matching the source image dimensions. Used by `AiEraserDialog`
  and `InpaintDialog`. ~300-500 LOC; standalone component with its own
  test file.
- **B.5.** Tool-output rendering in the gallery: tool outputs render as
  children of their parent in `RenderGallery`. Visual hierarchy: parent
  render card expanded shows the chain of derived tool outputs (one row
  per derivation kind). `RenderCard` extended to detect `parent_render_output_id`
  and present the parent-child relationship.

### Workstream C — UX polish

- **C.1.** `BeforeAfterSlider` component — side-by-side comparison
  slider for still renders. Renders source image on one side, output
  image on the other, draggable divider. Used in `RenderCard` for still
  renders (elevation-set keeps its existing grid presentation; video
  keeps its video player).
- **C.2.** `DragDropUpload` component — replaces the file picker in
  `RenderKickoffDialog` Prompt Generator (already present), B.2 source
  upload, and the 5 power-tool dialogs (B.3) where a file input is
  needed. Drag-over visual feedback; click-to-pick fallback; file-size
  + type validation per the target endpoint's limits.
- **C.3.** Negative prompt field in `RenderKickoffDialog`. Optional
  textarea; passes through to mnml `archDiffusion-v43` (already
  accepts free per-expert params per V1's loose-typing).
- **C.4.** Seed input in `RenderKickoffDialog`. Numeric input with a
  "random" button that clears the value. Passes through to mnml.
- **C.5.** Processing-time elapsed timer in `RenderCard` for in-flight
  renders. Replaces the current created-at relative time during the
  in-flight window; flips back to created-at on terminal status.
- **C.6.** URL share / copy-to-clipboard button on `RenderCard` for
  terminal-state renders. Uses the existing render-output GCS reference
  URL.
- **C.7.** `ConstellationCanvas` animated background — particle / star
  field behind the `RendersTab`. Canvas-based, with a perf-budget kill
  switch (disable if FPS drops below a threshold). Standalone component;
  cc-agent-R picks Canvas vs WebGL on a brief perf eval.

Out of this sprint's scope:

- **Chat-initiated concept imagery.** Wiring a render-launch action into
  the in-app Cortex chat agent (`chat.ts`) is cc-agent-C territory per
  the 40c deferral and the 42 stream DA-IN-APP-AGENT row. Stays queued
  there.
- **render-output referenced by L6 deliverable and presentation packet.**
  Already tracked in [`43_cortex_qa_backlog.md`](43_cortex_qa_backlog.md)
  WS-G QA-29; lands when QA-29 lands.
- **`cortex/render_*` MCP retrofit.** Per the dual-interface principle,
  the UI-first surface tracked retrofit lands on hauska-mcp-server
  (cc-agent-M) after this sprint's activation. The retrofit scope
  widens materially with 40e — see Watch line.
- **mnml vendor re-evaluation.** Open in
  [`40b_advanced_capture_features.md`](40b_advanced_capture_features.md)
  Lane 1; stays open. This sprint commits to mnml at the existing
  integration depth.

## mnml.ai vendor surface — endpoints added this sprint

Vendor mnml.ai. Base URL `https://api.mnmlai.dev/v1/`. Auth header
`Authorization: Bearer <key>` (existing `MNML_API_KEY` Cloud Run secret
from V1). All endpoints below are async POST returning a job id, polled
via the existing `GET /v1/status/{id}` worker. Captured from
`https://mnmlai.dev/docs` on 2026-05-23; verify each against the live
docs at build time.

| Tool | Path | Required | Optional | Cost | Limits |
|---|---|---|---|---|---|
| Render Enhancer | `POST /v1/render/enhancer` | `image`, `prompt` | `geometry` (0-1, def 1), `creativity` (0-1, def 0.3), `dynamic` (0-10, def 5), `seed`, `sharpen` (0-1, def 0.5) | unspecified | 10MB image max |
| 4K Upscaler | `POST /v1/upscale` | `image` | `scale` (def 2, e.g. 2/4/8), `face_enhance` (bool, def false) | 1 credit | 8MB image max; JPG/PNG/GIF; min 1KB; auto-resized to 1400px width |
| AI Eraser | `POST /v1/ai-eraser` | `image`, `mask` | `output_format` (png/jpg/jpeg, def png) | 1 credit | 8MB image max; mask same dimensions as image, white = erase, black = keep; auto-resized to 1024px width; min 256px width |
| Inpaint | `POST /v1/inpaint` | `image`, `mask` | `prompt` (def ""), `negative_prompt` (def ""), `seed`, `mask_type` (manual/automatic, def manual) | unspecified | 10MB max; mask = PNG black background, white selected area |
| Style Transfer | `POST /v1/style/transfer` | `image`, `reference_image` | `prompt`, `strength` (0-1, def 0.7), `preserve_structure` (bool, def true), `color_preservation` (0-1, def 0.3) | unspecified | 10MB max |

The full `archDiffusion-v43` parameter schema (10 common params + 6
per-expert grids) was captured the same day for the A.3 / B.1 work.
That capture lives in the planner session summary at
[`_sessions/2026-05-23_cortex_rendering_parity_sprint_planning_claude_code.md`](_sessions/2026-05-23_cortex_rendering_parity_sprint_planning_claude_code.md);
the build agent reads from `https://mnmlai.dev/docs/api/arch-diffusion-v43`
directly during the A.3 implementation.

## Architecture

Extends the 40c architecture; new pieces:

**Power-tool client methods + routes.** Same shape as the existing
`triggerRender` path: typed method on `MnmlClient`, route in
`api-server` that accepts multipart and proxies to mnml, job row
persisted on success. Polling worker is unchanged (the same
`/v1/status/{id}` endpoint already handles every mnml job kind). The
job model gets new `source_type` discriminants but doesn't change
shape otherwise.

**Per-expert parameter schema module.** Statically TS-defined in
`portal-ui` (or shared with `api-server` via a `lib/` package); not
fetched from mnml at runtime. Schema is the source of truth for B.1's
schema-driven UI and for parameter validation on the kickoff route.
Updating to a new mnml version is a code change, not a config change —
intentional for type safety.

**Schema migration.** `viewpoint_renders.source_type` is currently a
small union; this sprint extends it (additive — existing values still
valid). `source_upload_url` is a new nullable TEXT column carrying the
GCS reference for B.2 uploaded sources. `parent_render_output_id` is a
new nullable UUID column with FK to `render_outputs.id` for tool
outputs. Migration is additive; no destructive change; cortex-prod is
at `0015` (per QA-04 Part 2), so the new migration is `0016+` (number
finalized at PR-creation by the agent against current head).

**Upload-as-source pipe.** New multipart upload endpoint stores to GCS
under an `uploads/` prefix and returns a stable reference. The kickoff
route accepts that reference as the `image` field of the request body,
parallel to the existing GLB-capture path. Both paths produce a
`render-output` atom with the appropriate `source_type`.

**Render-output atom variants for tool outputs.** When a tool-output
job completes, the resulting atom carries `parent_render_output_id`
pointing to the source render-output, and `source_type` matching the
tool (`enhance` / `upscale` / `erase` / `inpaint` / `style_transfer`).
The atom contract is additive — same `accessPolicy: tenant-private`,
same provenance discipline, plus the parent linkage.

**Mask-drawing canvas (B.4).** Standalone React component, HTML5
canvas backed; brush rendering on offscreen canvas, exported as a
PNG matching the source image's dimensions for the mnml `mask` field.
Self-contained, no global state.

**Before/after slider (C.1).** Standalone component; CSS / clip-path
for the divider, drag handler for repositioning. No new state model.

**ConstellationCanvas (C.7).** Decorative; mounted above the
`RendersTab` layout. Perf-budget guard (disable on low FPS) is the only
load-bearing constraint.

## Build workstreams + sequencing

Owner: cc-agent-R on its dedicated `legacy-design-tools` clone. One
phased dispatch at
[`_dispatches/2026-05-23_cc-agent-R_rendering_parity_build.md`](_dispatches/2026-05-23_cc-agent-R_rendering_parity_build.md).

Recommended sequencing within the sprint:

1. **A** in full (backend extensions): A.1 → A.2 → A.3 → A.4 → A.5 → A.6.
   Backend lands first behind `RENDERS_PROD_ENABLED`. PR per workstream
   item or grouped if cohesive.
2. **B** in functional order: B.4 (mask canvas, isolated standalone) →
   B.3 (power-tool dialogs, depend on A.1-A.2 + B.4 for Eraser/Inpaint)
   → B.1 (param grid, depends on A.3) → B.2 (upload-as-source, depends
   on A.5) → B.5 (tool-output rendering in gallery, depends on A.6).
3. **C** in polish order: C.2 (drag-drop component, reused by B.2 + B.3)
   → C.1 (slider) → C.3 + C.4 (negative prompt + seed) → C.5 (timer) →
   C.6 (share button) → C.7 (ConstellationCanvas).

Cross-workstream dependencies: B.2 needs A.5; B.1 needs A.3; B.5 needs
A.6; B.3 needs A.1 + A.2; B.3 Eraser + Inpaint need B.4. C.2 is
upstream of B.2 + B.3. Otherwise items are independent and the agent
may parallelize within reason.

Concurrent agents in `legacy-design-tools`:

- cc-agent-C — QA-22 EPA Path 1a; touches `lib/adapters/federal/`,
  possibly `lib/codes/`. Disjoint from 40e file paths.
- cc-agent-C2 — Regrid SCOPE B (PR #104 held for operator merge, then
  Phase 2D.1 PR 2 USGS 3DEP DEM raster resumes); touches
  `lib/adapters/national/regrid.ts`, `lib/site-context/server/overlays.ts`,
  api-server DEM client, `SiteMap.tsx`, `site-topography` atom. Disjoint
  from 40e file paths.
- cc-agent-R (this sprint) — `routes/renders.ts`, new
  `routes/render-tools.ts`, `lib/mnml-client/**`, `lib/portal-ui/src/components/Render*`,
  new `MaskCanvas*` / `BeforeAfterSlider*` / `ConstellationCanvas*`
  components, new `lib/portal-ui/src/components/render-tools/**`, new
  `lib/portal-ui/src/schemas/mnml-experts.ts`,
  `artifacts/design-tools/src/components/engagement-detail/RendersTab.tsx`,
  the new schema migration, generated client + OpenAPI spec (additive).

The full allowlist + the disjoint-from list are in the dispatch.
Workspace-hygiene incident from 2026-05-22 (cc-agent-C / cc-agent-R
shared-clone collision) is the failure mode the allowlist is designed
to prevent.

## Exit criteria

- All five power tools surfaced end-to-end: dialog in `portal-ui` →
  multipart upload to api-server route → mnml call → polled job →
  render-output atom with `parent_render_output_id` linkage → result
  visible in gallery as a child of the source render.
- Full per-expert parameter grid present in the `RenderKickoffDialog`
  for the deliverable-render intent (10 common params + the 6
  per-expert grids from the A.3 schema).
- Upload-as-source path end-to-end: drag-and-drop upload in the kickoff
  dialog → A.5 endpoint → GCS → kickoff → render-output with
  `source_type: 'upload'`. Closes the 40c B.2 caveat — concept imagery
  from a manual sketch upload completes end-to-end.
- All UX polish items present: `BeforeAfterSlider` rendering in
  `RenderCard` for still renders; `DragDropUpload` replacing file
  pickers; negative-prompt + seed fields in kickoff; elapsed-time
  timer for in-flight; URL share button on terminal-state renders;
  `ConstellationCanvas` mounted in `RendersTab` with perf-budget guard.
- Mask drawing canvas (`MaskCanvas`) usable in Eraser and Inpaint
  dialogs — drawable mask exports as PNG matching source image
  dimensions.
- `RENDERS_PROD_ENABLED` keeps everything dark in production; mock
  mode in dev/CI/staging produces realistic placeholder outputs for
  all five tools and the upload path (extends the existing
  `MockMnmlClient`).
- No regressions in the existing renders test suite; new components
  carry test files; per-package typecheck green; full workspace
  typecheck green.

Activation in prod remains the two-flag pair
(`RENDERS_PROD_ENABLED=true` + `MNML_RENDER_MODE=live`) in the same
Cloud Run revision. Operator action, no further code change.

## Watch line

- **Credit COGS exposure widens.** AI Eraser + 4K Upscaler are 1 credit
  each per mnml docs; Render Enhancer, Inpaint, and Style Transfer are
  unspecified in the docs and will be discovered at first live call.
  Power tools spend credits on user action; this sprint surfaces them
  without a per-action cost preview or hard cap. Cost controls become
  load-bearing on first external-firm exposure (same posture as 40c).
- **`cortex/render_*` MCP retrofit scope widens materially.** The
  retrofit lands on hauska-mcp-server (cc-agent-M) post-activation.
  With 40e, that retrofit now must cover the 5 power tools + the
  per-expert parameter MCP surface + the upload-as-source MCP tool.
  Tracked on the 42 watch line; not in this sprint's scope.
- **ConstellationCanvas perf cost.** The animated background's
  perf-budget guard should be verified at activation against the
  Cortex prod load profile. If FPS drops materially, the guard
  disables it; if it's still load-bearing for first impression, the
  cc-agent revisits the implementation (Canvas vs WebGL vs CSS-only
  starfield).
- **Mask-canvas UX standard.** The reference repo does not have a
  mask-drawing component (per the cross-walk), so the standard is
  cc-agent-R's call against common-sense brush UX. If the operator
  has a preferred mask UX from another tool, surface it before B.4.

## Structural commitment check

Pre-mortem-check run formally 2026-05-23 against the proposed scope.

**Load-bearing commitments — all GREEN.**

- Commitment 1 (sell reasoning, not data): clean — atoms still carry
  full param + seed + engine + parent linkage. The new
  `parent_render_output_id` chain strengthens provenance for tool
  outputs.
- Commitment 2 (partnership-first sourcing): N/A — mnml.ai is a vendor,
  scoping doctrine excludes vendor capabilities.
- Commitment 3 (cost per jurisdiction): N/A — render credits are
  product COGS, not jurisdiction-onboarding cost.

**Operational commitments — three YELLOWS with named mitigations.**

- Commitment 4 (dual interface): UI surface widens materially; the
  `cortex/render_*` MCP retrofit gap widens correspondingly.
  Mitigation: 42 watch-line amendment captures the larger retrofit
  scope; retrofit lands post-activation as a tracked follow-on.
- Commitment 5 (Hauska spine): Cortex Renders is Empressa product
  surface, not direct Hauska substrate; this sprint deepens an
  already-activated surface (40c activated 2026-05-22), not a new
  non-Hauska direction. Acknowledged as a delivery-depth choice.
- Commitment 6 (focus queue): three concurrent agents in
  legacy-design-tools during the sprint (cc-agent-C QA-22 EPA,
  cc-agent-C2 Regrid SCOPE B finishing, cc-agent-R 40e). Mitigation:
  cc-agent-R uses its dedicated clone + a strict file-path allowlist
  in the dispatch (disjoint from cc-agent-C and cc-agent-C2). If the
  2026-05-22 workspace-hygiene incident reproduces, cc-agent-R is the
  one that pauses.

Operator acknowledged all three operational yellows explicitly
2026-05-23. Overall verdict yellow with named mitigations, cleared to
proceed.

Catalog-thesis-check 2026-05-23, passes. Render-output atoms remain
tenant-private workflow atoms per ADR-017 (no Layer-1/Layer-2
inversion); this is Empressa Cortex product depth, no ADR-008
conflict.

## Cross-references

- [`40c_cortex_rendering_sprint.md`](40c_cortex_rendering_sprint.md) — predecessor sprint (V1 gap-fill); 40c's B.1 + B.2 + power-tool deferrals are 40e scope
- [`_decisions/2026-05-23_cortex_rendering_parity_sprint_scope.md`](_decisions/2026-05-23_cortex_rendering_parity_sprint_scope.md) — scope decision record
- [`_dispatches/2026-05-23_cc-agent-R_rendering_parity_build.md`](_dispatches/2026-05-23_cc-agent-R_rendering_parity_build.md) — the build dispatch
- [`40b_advanced_capture_features.md`](40b_advanced_capture_features.md) — parent doc; Lane 1 (mnml render engine) is the target this sprint extends
- [`42_design_accelerator_program_plan.md`](42_design_accelerator_program_plan.md) — program plan; DA-12 row + deferred-follow-ons watch line track 40e
- [`28_mcp_first_product_design.md`](28_mcp_first_product_design.md) — MCP-first principle; widened `cortex/render_*` retrofit follow-on per this sprint
- [`_decisions/2026-05-22_cortex_rendering_activation.md`](_decisions/2026-05-22_cortex_rendering_activation.md) — original activation decision (predecessor)
