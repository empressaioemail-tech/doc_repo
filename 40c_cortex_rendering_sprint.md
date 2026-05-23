---
id: 40c_cortex_rendering_sprint
title: Cortex rendering sprint
status: active
last_updated: 2026-05-23 (Successor sprint dispatched: 40c's named B.1 + B.2 + 4 power-tool deferrals pulled forward into [`40e_cortex_rendering_parity_sprint.md`](40e_cortex_rendering_parity_sprint.md) per `_decisions/2026-05-23_cortex_rendering_parity_sprint_scope.md`. cc-agent-R re-activated 2026-05-23 on its dedicated clone; dispatch at `_dispatches/2026-05-23_cc-agent-R_rendering_parity_build.md`; behind `RENDERS_PROD_ENABLED` (unchanged). 40c remains the canonical record of the V1 gap-fill that closed PRs #79/#80. Earlier 2026-05-23: Status reset against codebase: cc-agent-R Phase A.1 audit 2026-05-22 found the mnml.ai render feature already ~85-90% shipped from the prior V1 / Spec-54 sprint; operator chose path A — gap-fill only. Phase A (PR #79, mnml `GET /credits` + Prompt Generator) and Phase B (PR #80, credit badge + intent toggle + expert/style selects + Prompt Generator affordance) both merged 2026-05-22. Two scope items deferred as follow-ons: B.1 full schema-driven per-expert parameter grid; B.2 concept-imagery image-upload-as-source pipe — the intent toggle and prompt path shipped, but the underlying render still captures the GLB rather than an uploaded image. Renders surface stays dark in prod behind `RENDERS_PROD_ENABLED=false`; activation requires the env flag flip paired with `MNML_RENDER_MODE=live` in the same Cloud Run revision. Pre-existing 2026-05-22: this sprint is the execution home of `42` DA-12 and Lane 1 of `40b`; Lanes 2 and 3 of 40b stay queued.)
applies_to: design-accelerator
related: [40b_advanced_capture_features, 42_design_accelerator_program_plan, 40_design_accelerator, 43_cortex_qa_backlog, 27_engine_evolution_plan, 28_mcp_first_product_design, _decisions/2026-05-22_cortex_rendering_activation]
owner: nick
---

# Cortex rendering sprint

> **What this is.** The execution plan for the mnml.ai render engine in
> Cortex, activating Lane 1 of
> [`40b_advanced_capture_features.md`](40b_advanced_capture_features.md).
> Lanes 2 and 3 of that doc (image-to-BIM, image-to-CAD) stay queued.
> Activation decision: [`_decisions/2026-05-22_cortex_rendering_activation.md`](_decisions/2026-05-22_cortex_rendering_activation.md).

## Status — 2026-05-23

**Successor sprint dispatched 2026-05-23.** The named B.1 + B.2 +
power-tool deferrals below are now in-scope for
[`40e_cortex_rendering_parity_sprint.md`](40e_cortex_rendering_parity_sprint.md)
per [`_decisions/2026-05-23_cortex_rendering_parity_sprint_scope.md`](_decisions/2026-05-23_cortex_rendering_parity_sprint_scope.md).
cc-agent-R re-activated; dispatch at
[`_dispatches/2026-05-23_cc-agent-R_rendering_parity_build.md`](_dispatches/2026-05-23_cc-agent-R_rendering_parity_build.md).
40c remains the canonical record of the V1 gap-fill that closed
PRs #79/#80; the deferral status preserved below is historical context
for 40e's scope.

The cc-agent-R Phase A.1 audit 2026-05-22 found this sprint's premise
wrong: the mnml.ai render feature was already built and merged to `main`
by the earlier V1 / Spec-54 sprint, roughly 85-90% of 40c. The operator
chose **path A — gap-fill only**, additive behind `RENDERS_PROD_ENABLED`.

Shipped 2026-05-22:

- **Phase A — PR #79 merged** (`b8b0cdf`). `GET /credits` and Prompt
  Generator added to the mnml client and `api-server`, additive behind
  `RENDERS_PROD_ENABLED`, no DB migration.
- **Phase B — PR #80 merged.** `RenderCreditsBadge` in `lib/portal-ui`,
  wired to the credits endpoint via the generated hook. `RenderKickoffDialog`
  extended with deliverable-vs-concept intent toggle (40c B.1, the
  highest-leverage subset), all six expert types and all eight render
  styles exposed as selects, and a Prompt Generator affordance that
  consumes an image and drops the returned prompt into the textarea. 447
  portal-ui tests green, `pnpm -w typecheck:libs` and
  `pnpm --filter design-tools typecheck` green. Self-merged per the
  dispatch autonomy clause.

Deferred follow-ons (not in scope for this sprint's exit):

- **B.1 — full schema-driven per-expert parameter grid.** The kickoff
  body already accepts a free `expertParams` map and the engine handles
  per-expert validation; this sprint exposes the two highest-leverage
  knobs (expert + style) without the full camera-angle × time-of-day ×
  weather grid.
- **B.2 — concept-imagery image-upload-as-source.** Full manual-upload
  as render source needs a new image-upload pipe plus `viewpoint_renders`
  accepting an image source (currently GLB-capture-only). This sprint
  delivers the architect-facing concept affordance (intent toggle, plan
  expert, sketch styles, Prompt Generator), but the underlying render
  still captures the GLB. The concept-imagery flow is **not end-to-end**
  until B.2 lands.

Out of this gap-fill scope by activation-decision call (not deferred,
not scheduled): the remaining four power tools (4K upscaler, render
enhancer, AI eraser, inpainting, style transfer — typed-but-not-surfaced
in the client) and the `cortex/render_*` MCP retrofit. Both stay queued
without named demand.

**Activation in prod is gated.** `RENDERS_PROD_ENABLED=false` keeps the
Renders tab dark in production. Flipping the flag must be paired with
`MNML_RENDER_MODE=live` in the same Cloud Run revision — flipping one
without the other either keeps mock renders behind a live surface (bad
first impression) or makes the surface reachable while still mocked. The
two-flip is an operator action; no further code change is required to
activate the shipped scope.

Doc-set reconciliation owed at session close 2026-05-23: this Status
section, plus the activation-decision amendment at
[`_decisions/2026-05-22_cortex_rendering_activation.md`](_decisions/2026-05-22_cortex_rendering_activation.md),
plus the `42` DA-12 row + deferred-follow-on watch line.

## Origin

The Cortex engagement view carries a Renders tab. The shipped version is
an early placeholder, well short of done. The operator requested the
function several times; it kept being deferred correctly, because doc 40b
held rendering as `queued` behind a five-condition activation gate to
protect customer-zero stabilization capacity. Four of the five gate
conditions are met; only condition 5, the first QA cycle clearing, is
open. The operator authorized the build to start immediately on
2026-05-22, running in parallel with that QA work rather than waiting
(see [Sequencing](#sequencing)).

## Scope

Capture the full mnml.ai render engine as a Cortex product surface,
covering both client-facing deliverable renders and early-design concept
imagery.

In scope for this sprint:

- The render engine endpoint with all six expert types (exterior,
  interior, masterplan, landscape, plan, product) and all eight render
  styles, surfaced through a parameter-driven UI generated from the mnml
  parameter schema.
- **Concept imagery for early-design exploration.** The `plan` expert
  for floor-plan concepts, plus the `freehand_sketch`, `illustration`,
  `clay_model`, and `watercolor` styles across experts, surfaced as an
  explicit concept-exploration mode in the Renders tab, distinct from
  photorealistic deliverable renders. This is image-guided: the
  architect supplies a rough sketch, bubble diagram, or massing as the
  source, and gets concept floor plans, interiors, or massing studies
  back. The Prompt Generator power tool is included for this flow so an
  architect can describe design intent in plain language and get a
  usable prompt. Pure text-to-image with no source is not an mnml
  capability and is out of scope, noted on the watch line.
- Four-direction elevation sets: a batch of four renders, one per camera
  direction, grouped as one set.
- Video AI: image-to-video, five or ten seconds.
- The Renders tab rebuilt from the placeholder.

Deferred to a follow-on:

- The remaining five power tools (4K upscaler, render enhancer, AI
  eraser, inpainting, style transfer). Typed in the client, not
  surfaced. Prompt Generator is in scope per Concept imagery above.
- **Chat-initiated concept imagery.** Wiring a render-launch action into
  the in-app Cortex chat agent (`chat.ts`) so an architect can request
  concept imagery in conversation, the exact ask in the 2026-05-22 QA
  pass. Owned by the `chat.ts` owner (the WS-C lineage, cc-agent-C), not
  cc-agent-R, since `chat.ts` is cc-agent-C territory. Fast-follow once
  Phase A backend is on `main`.
- render-output referenceable by the L6 deliverable and presentation
  packet (ties [`43`](43_cortex_qa_backlog.md) QA-29).
- The `cortex/render_*` MCP tool surface (hauska-mcp-server, cc-agent-M),
  the MCP retrofit per
  [`28_mcp_first_product_design.md`](28_mcp_first_product_design.md).

Out of scope: image-to-BIM and image-to-CAD remain Lanes 2 and 3 of
[`40b`](40b_advanced_capture_features.md), queued.

## mnml.ai API surface

Vendor mnml.ai. Base URL `https://api.mnmlai.dev/v1/`. Auth header
`Authorization: Bearer <key>`. Every generation endpoint is
asynchronous: the POST returns a job id, and the caller polls the status
endpoint. Reference, captured 2026-05-22 from `https://mnmlai.dev/docs`;
verify against the live API at build time.

| Capability | Endpoint | Cost | Notes |
|---|---|---|---|
| Render engine v4.3-Ultra | `POST /archDiffusion-v43` | 3 credits | `expert_name` (exterior, interior, masterplan, landscape, plan, product); `render_style` (raw, photoreal, cgi_render, cad, freehand_sketch, clay_model, illustration, watercolor); per-expert parameter sets (camera angle and direction, time of day, weather, greenery, vehicles, people, and more); `image` source plus up to four `reference_image` inputs; `seed`. Processing 30 to 60s. |
| Video AI | `POST /video-ai` | 10 credits | Image-to-video, `duration` 5 or 10s, `aspect_ratio`, `movement_type`, `direction`, optional `end_image_url` for transitions. Model Kling v2.1. |
| Status check | `GET /status/{id}` | none | Status one of `starting`, `processing`, `success`, `failed`, `canceled`. Output URLs in the `message` array. Poll with exponential backoff. Output URLs expire. |
| Remaining credits | `GET /credits` | none | Account credit balance. |
| Power tools | separate endpoints | varies | Render Enhancer, 4K Upscaler, AI Eraser, Inpainting AI, Style Transfer, Prompt Generator. Prompt Generator is in scope for the concept-imagery flow; the other five are deferred. |
| Errors | standard codes | none | 401 `missing_api_key` / `invalid_api_key`; 400 validation; 429 `rate_limit_exceeded` with `retry_after`; 403 `insufficient_credits` with `available_credits` and `required_credits`; 5xx with `retry_after`. Max three retries, exponential backoff. |

Three properties drive the architecture. Every generation call is
asynchronous POST then poll, so the integration needs a durable job
model and a polling worker, not fire-and-forget. Output URLs expire, so
outputs must be copied into our own storage before the atom is
finalized. The render engine is a single endpoint parameterized by
`expert_name`, so supporting all six expert types costs almost nothing
once the client is generic; the engineering cost is the spine, identical
at any breadth.

## Architecture

**mnml client.** A generic typed client in `api-server` covering every
endpoint, Bearer auth, the error contract above with 429 and 5xx
exponential backoff and a three-retry cap, and `insufficient_credits`
surfaced as a clean caller-facing error. `MNML_API_KEY` is a Cloud Run
secret. The existing `RENDERS_PROD_ENABLED` flag is reused as the
feature gate.

**Render job model and polling worker.** Durable render-job records
persist every job: engagement, expert and style and full parameter set,
source image reference, mnml job id, status, seed, credits consumed,
output references, timestamps. The polling worker polls
`GET /status/{id}` with exponential backoff, reconciles status, and
re-hydrates in-flight jobs on process restart so a render survives a
deploy or the architect navigating away. On `success` the worker
downloads every output from the mnml `message` URLs into the GCS bucket
before those URLs expire, then finalizes the render-output atom against
our stored URLs.

**render-output atom.** Per
[ADR-001](80_adrs/adr_001_atom_architecture.md) and
[ADR-012](80_adrs/adr_012_atom_export_format.md), with the five render
modes, `accessPolicy: tenant-private` per
[ADR-017](80_adrs/adr_017_atom_access_control.md): engagement workflow
data, never a public-catalog atom, consistent with every L-surface atom.
Fields: engagement id, source image reference, source type
(`model-capture` or `upload`), mnml engine and job id, expert type and
render style and the full parameter set, prompt, seed, status, output
GCS references for the still or video, credits consumed, an AI-origin
marker, and created and completed timestamps. The full parameter set
plus seed plus engine version make every render reproducible; that
reproducibility is the provenance the quality-gate rule requires of this
surface, the same discipline applied to the QA-27/28/29 features.

The cc-agent reconciles this against the existing `render-output` and
`viewpoint-render` atom types already named in
[`40_design_accelerator.md`](40_design_accelerator.md); if
`render-output` is already registered, this is verify-and-extend, not a
net-new type, and any registry change is a single coordinated bump per
[`27`](27_engine_evolution_plan.md) Stream B.

**Four-direction elevation set.** Modeled as a light `render-set` parent
atom plus four independently addressable child render-output atoms, one
per camera direction, mirroring the L3/L6 precedent that multi-render
off one source is one-to-many and each render is separately addressable.

**Two render intents.** The Renders tab presents two clearly separated
modes off the same engine and atom. Deliverable renders use the
photorealistic and CGI styles for client-facing exterior and interior
output. Concept imagery uses the `plan` expert and the sketch,
illustration, clay, and watercolor styles for early-design exploration,
floor-plan concepts included. Same `render-output` atom, same job model;
the split is a UI affordance so the architect picks intent first and the
parameter surface follows.

**Source image input.** Two paths. Model-capture screenshots the in-app
Three.js GLB viewer at chosen camera presets; the four-direction set
captures four angles in one action. Manual upload covers a massing
image, a hand sketch, a bubble diagram, or an existing engagement sheet,
and is the source path for concept imagery. Model-capture is the hero
path for elevation sets and depends on the Three.js viewer exposing, or
being extensible to expose, programmatic camera control and frame
export; the cc-agent verifies the viewer component before building that
path.

**Credit handling.** The `GET /credits` balance is displayed in the
Renders tab. No per-action cost preview and no hard cap this sprint;
metered rendering for external firms is a future tier decision, noted on
the watch line below.

## Build phases

Owner cc-agent-R, a build agent working a dedicated clone of
`legacy-design-tools` in parallel with cc-agent-C. One phased dispatch,
[`_dispatches/2026-05-22_cc-agent-R_cortex_rendering_build.md`](_dispatches/2026-05-22_cc-agent-R_cortex_rendering_build.md).

**Phase A, backend (`api-server`).**

- A.1 Audit and replace the placeholder `routes/renders.ts`. Build the
  generic mnml client, config, secret binding, error handling. Surface
  `archDiffusion-v43`, `video-ai`, `status`, `credits`, and
  `prompt-generator`; type the remaining power tools without surfacing
  them.
- A.2 Render-job model and the polling worker. GCS output download and
  storage.
- A.3 render-output and render-set atoms, reconciled against the
  existing registry types.
- A.4 Four-direction set batching.
- A.5 Video AI path.

Phase A exits with an end-to-end server-side render lifecycle testable
through the API.

**Phase B, frontend (`design-tools`), gated on Phase A.**

- B.1 New-render flow with the schema-driven expert, style, and
  parameter picker, opening on an intent choice: deliverable render or
  concept imagery. Concept imagery defaults to the `plan` expert and the
  sketch and illustration styles, and offers the Prompt Generator.
- B.2 Source input: model-capture from the Three.js viewer (verify
  viewer extensibility first) and manual upload, the latter being the
  concept-imagery source path.
- B.3 Four-direction batch UI.
- B.4 Video UI.
- B.5 Render gallery with live job status.
- B.6 Credit-balance display.

Phase B exits with the Renders tab rebuilt from the placeholder and the
full render flow, deliverable and concept, usable on a real engagement.

## Sequencing

The operator authorized this build to start immediately on 2026-05-22,
in parallel with cc-agent-C's IFC-ingest migration and WS-G Cortex QA
build, rather than waiting for them to clear. The build runs as
cc-agent-R on a dedicated clone of `legacy-design-tools`; doc 40b
activation-gate condition 5 (first QA cycle clears) is consciously
overridden. Overlap with cc-agent-C is bounded to drizzle migration
numbering and the atom registry, and resolves at PR-merge.

## Exit criteria

Status reset 2026-05-23 against the codebase + cc-agent-R gap-fill PRs
#79 / #80. Per the Status section above, exit criteria are **satisfied
with two named caveats**:

- The Renders tab is rebuilt with two intents: an architect can run a
  deliverable render or concept imagery on a real engagement, choosing
  expert type, style, and parameters. **Satisfied** (V1 sprint shipped
  the tab; PR #80 added the intent toggle + expert / style selects).
- Single renders, four-direction elevation sets, concept floor-plan
  imagery, and video all complete end-to-end, sourced from model-capture
  or upload. **Satisfied with caveat**: model-capture path is end-to-end;
  the upload-as-source path for concept imagery is deferred as B.2 —
  the architect-facing concept affordance ships but the underlying
  render still captures the GLB.
- Every render produces a `render-output` atom carrying full generation
  provenance and an AI-origin marker; outputs are stored in GCS, not
  referenced from expiring mnml URLs. **Satisfied** (V1 sprint).
- The polling worker survives a process restart with in-flight jobs.
  **Satisfied** (V1 sprint).
- The credit balance is visible in the tab. **Satisfied** (PR #79
  backend + PR #80 `RenderCreditsBadge`).

Caveat summary: B.1 (full schema-driven per-expert param grid) and B.2
(image-upload-as-render-source for concept imagery) are deferred
follow-ons, not in this sprint's exit. Activation in prod requires
`RENDERS_PROD_ENABLED=true` + `MNML_RENDER_MODE=live` in the same Cloud
Run revision — operator action, no further code change.

## Watch line

Render credits are real product COGS (3 credits per still, 10 per
video, 12 per four-direction set). This sprint displays the balance
only. Whether rendering becomes a metered paid capability for external
firms is a future tier decision; the Revit Connector MCP per-seat
metering pattern in
[`29_mcp_surface_tier_model.md`](29_mcp_surface_tier_model.md) and
[`41_revit_connector.md`](41_revit_connector.md) is the precedent. Pure
text-to-image concept generation with no source image is not an mnml
capability; if the operator wants it, that is a separate vendor
decision. Neither is in this sprint's scope.

## Structural commitment check

Pre-mortem run 2026-05-22, cleared green. Load-bearing commitments are
clean: the render-output atom carries full generation provenance, the
"sell reasoning" discipline for this surface; mnml.ai is a vendor, not a
jurisdiction data source, so partnership-first does not apply; render
credits are product COGS, not jurisdiction-onboarding cost, so the
cost-per-jurisdiction envelope is untouched. One operational yellow on
the focus-queue rule: running rendering in parallel puts a second agent
in legacy-design-tools and overrides doc 40b gate condition 5. The
operator consciously accepted that tradeoff on 2026-05-22 (parallel
build on a dedicated clone, fix-in-QA posture); load-bearing commitments
are clean, so the operator-acknowledged operational yellow is absorbed.

The concept-imagery scope addition (2026-05-22) introduces no
structural-commitment change: same vendor, same `render-output` atom,
same architecture; the `plan` expert and the sketch styles were already
inside the full-render-engine scope, and the Prompt Generator is one
additional sibling endpoint.

Catalog-thesis-check 2026-05-22, passes. Rendering is an Empressa Cortex
product surface, no [ADR-008](80_adrs/adr_008_engine_factor_out.md)
conflict; render-output atoms are tenant-private workflow atoms, not
Layer 1 or Layer 2 catalog atoms, so no tier inversion; the Renders tab
is UI-first, correct for an existing UI-first product, with the
`cortex/render_*` MCP retrofit recorded as a tracked follow-on in
[`42_design_accelerator_program_plan.md`](42_design_accelerator_program_plan.md)
per the MCP-first rule.

## Cross-references

- [`40b_advanced_capture_features.md`](40b_advanced_capture_features.md) — parent doc; this sprint activates its Lane 1
- [`42_design_accelerator_program_plan.md`](42_design_accelerator_program_plan.md) — DA-12 render output quality; this is its execution home
- [`43_cortex_qa_backlog.md`](43_cortex_qa_backlog.md) — WS-G, the QA cycle running in parallel
- [`40_design_accelerator.md`](40_design_accelerator.md) — Cortex product home; existing render-output and viewpoint-render atom types
- [`_dispatches/2026-05-22_cc-agent-R_cortex_rendering_build.md`](_dispatches/2026-05-22_cc-agent-R_cortex_rendering_build.md) — the build dispatch
- [`_decisions/2026-05-22_cortex_rendering_activation.md`](_decisions/2026-05-22_cortex_rendering_activation.md) — activation decision record
