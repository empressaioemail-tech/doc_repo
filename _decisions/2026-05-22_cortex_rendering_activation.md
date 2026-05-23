---
decision_id: 2026-05-22_cortex_rendering_activation
date: 2026-05-22
owner: Nick
status: active
related_canonical: [40b_advanced_capture_features, 40c_cortex_rendering_sprint, 42_design_accelerator_program_plan, 11_roadmap]
---

## Decision

Activate Lane 1 of
[`40b_advanced_capture_features.md`](../40b_advanced_capture_features.md),
the mnml.ai photorealistic rendering pipeline, as a scoped Cortex sprint.
The execution plan is
[`40c_cortex_rendering_sprint.md`](../40c_cortex_rendering_sprint.md).
Four scope calls are settled here:

1. **Breadth: full render engine plus video.** Capture all six mnml
   expert types and all eight render styles, four-direction elevation
   sets, and Video AI.
2. **Source input: both paths.** A render sources from in-app 3D
   model-capture or from manual upload.
3. **Credit handling: balance display only.** Show the account credit
   balance; no per-action cost preview, no hard cap.
4. **Concept imagery in scope (added 2026-05-22).** Beyond
   photorealistic deliverable renders, the sprint explicitly captures
   concept imagery for early-design exploration: the `plan` expert for
   floor-plan concepts plus the sketch, illustration, clay, and
   watercolor styles, surfaced as a distinct mode in the Renders tab.
   The Prompt Generator power tool is pulled in for this flow; the other
   five power tools stay deferred. No structural-commitment change: same
   vendor, same `render-output` atom, same architecture.

Lanes 2 and 3 of doc 40b (image-to-BIM, image-to-CAD) stay queued.

**Execution.** The operator authorized the build to start immediately on
2026-05-22, in parallel with cc-agent-C's IFC-ingest migration and WS-G
QA build, run by a new build agent cc-agent-R on a dedicated clone of
`legacy-design-tools`, rather than sequenced behind WS-G as originally
scoped.

## Context

The Cortex engagement view carries a Renders tab shipped as an early
placeholder, well short of done. The operator requested the rendering
function repeatedly; it was deferred correctly, because doc 40b held
rendering as `status: queued` behind a five-condition activation gate
set in
[`2026-05-19_sync_4_5_and_cortex_sprint.md`](2026-05-19_sync_4_5_and_cortex_sprint.md)
to protect customer-zero stabilization capacity. Four of the five gate
conditions are now met: the Sync 4.5 corpus, the L1-L6 surfaces, the MCP
retrofit, and the Cloud Run plus Neon cutover. Only condition 5, the
first QA cycle clearing, is open, tracked as WS-G in
[`43_cortex_qa_backlog.md`](../43_cortex_qa_backlog.md).

Rendering is also QA-readiness step 7 and stream DA-12 in
[`42_design_accelerator_program_plan.md`](../42_design_accelerator_program_plan.md).
It is a pre-existing roadmap commitment, not net-new scope. The
concept-imagery addition was operator-requested 2026-05-22 off a QA pass
where the in-app chat agent could not produce floor-plan concept
imagery.

## Structural commitment check

Pre-mortem run 2026-05-22, cleared green. Load-bearing commitments are
clean: the render-output atom carries full generation provenance, the
"sell reasoning" discipline for this surface; mnml.ai is a vendor, not a
jurisdiction data source, so partnership-first does not apply; render
credits are product COGS, not jurisdiction-onboarding cost. One
operational yellow on the focus-queue rule: running the build in
parallel puts a second agent (cc-agent-R) in legacy-design-tools and
overrides doc 40b gate condition 5. The operator consciously accepted
that tradeoff on 2026-05-22 — parallel build on a dedicated clone, with
a fix-in-QA posture — and load-bearing commitments are clean, so the
operator-acknowledged operational yellow is absorbed.

The concept-imagery scope addition introduces no structural-commitment
change: the `plan` expert and the sketch styles were already inside the
full-render-engine breadth, and the Prompt Generator is one additional
sibling endpoint.

Catalog-thesis-check 2026-05-22, passes. Rendering is an Empressa Cortex
product surface, no ADR-008 conflict; render-output atoms are
tenant-private workflow atoms per ADR-017, not Layer 1 or Layer 2 catalog
atoms, so no tier inversion; UI-first is correct for an existing UI-first
product, with the `cortex/render_*` MCP retrofit recorded as a tracked
follow-on in doc 42.

## Reasoning

Breadth full, not exterior-only: the mnml render engine is one endpoint
parameterized by `expert_name`. Once the client is generic and the UI is
schema-driven, supporting all six expert types costs almost nothing; the
engineering cost is the spine (job model, polling worker, storage, atom),
identical at any breadth. Exterior-only would leave interior,
masterplan, landscape, plan, and product as a re-dispatch for no saving.

Concept imagery is the same insight applied: the `plan` expert and the
sketch styles ship for free with the full engine, and the operator has a
named demand for floor-plan concept exploration. Making it an explicit
Renders-tab mode rather than a buried style dropdown is a small UI cost
for a distinct, valuable workflow. It is image-guided (mnml needs a
source image); pure text-to-image is a different vendor capability and
stays out of scope.

Both input paths: model-capture is the hero path for four-direction
elevation sets and removes a manual step; manual upload covers sketches,
bubble diagrams, and massing images, and is the concept-imagery source
path. Supporting both is the complete product at small marginal cost.

Balance display only: during the QA and customer-zero phase the credits
are Empressa's own and the volume is low. Cost controls become
load-bearing only when rendering is metered for external firms.

Parallel start: the operator chose momentum. Rendering does not share
files with cc-agent-C's IFC migration or the WS-G customer-zero-loop
work beyond bounded overlap (migration numbering, atom registry), the
Renders tab is isolated, and the `RENDERS_PROD_ENABLED` flag makes
incremental merges to `main` safe. The speed gain outweighs the bounded
PR-merge coordination cost.

## Reversal criteria

Revisit the breadth call if the non-exterior expert types prove unused
after the customer-zero pilot. Revisit the credit-handling call when
rendering is first exposed to an external firm, at which point a metered
model and cost controls become load-bearing. Pause the parallel build if
cc-agent-R and cc-agent-C collide beyond the bounded overlap — if the
two repeatedly conflict on shared files, sequence them instead.

## Dependencies

The build is one phased dispatch to cc-agent-R,
[`2026-05-22_cc-agent-R_cortex_rendering_build.md`](../_dispatches/2026-05-22_cc-agent-R_cortex_rendering_build.md),
running in parallel with cc-agent-C's IFC-ingest migration and WS-G
Cortex QA build, on a dedicated clone. Advances QA-readiness step 7 and
stream DA-12 in doc 42. Tracked follow-ons: chat-initiated concept
imagery (the `chat.ts` render-launch action, cc-agent-C territory),
render-output in the L6 deliverable pipeline, the `cortex/render_*` MCP
retrofit, and the five remaining power tools.

## Counterparties

Internal. Adds cc-agent-R to the legacy-design-tools agent fleet for the
duration of this build, concurrent with cc-agent-C. Affects the
M-CortexQA milestone path. mnml.ai is the third-party rendering vendor;
this decision commits to the existing mnml.ai integration as the v1
vendor, with vendor re-evaluation noted as open in doc 40b Lane 1.

## Amendment 2026-05-23 — premise correction + actual execution

The activation decision above presumed greenfield: that 40c was building
the mnml render engine from a placeholder. The cc-agent-R Phase A.1
audit 2026-05-22 found that premise wrong. The mnml.ai render feature
was already built and merged to `main` by the earlier V1 / Spec-54
sprint, roughly 85-90% of 40c. The placeholder framing in 40c, in this
decision, and in the cc-agent-R dispatch all reflected pre-V1 state and
were not reconciled against the codebase before this decision was
written.

The operator's response to the audit was **path A — gap-fill only**,
additive behind `RENDERS_PROD_ENABLED`. cc-agent-R executed:

- **PR #79 merged 2026-05-22** (`b8b0cdf`) — backend: `GET /credits` +
  Prompt Generator added to the mnml client and `api-server`, additive
  behind `RENDERS_PROD_ENABLED`, no DB migration.
- **PR #80 merged 2026-05-22** — frontend: `RenderCreditsBadge`,
  `RenderKickoffDialog` extended with the deliverable-vs-concept intent
  toggle, all six expert types + all eight render styles surfaced as
  selects, Prompt Generator affordance wired to the new backend.

Two scope items from this decision deferred as follow-ons (named in 40c
Status):

- **B.1** — the full schema-driven per-expert parameter grid (camera
  angle × time of day × weather × greenery × vehicles × people). The
  highest-leverage subset (expert + style) shipped; the rest is a
  follow-on with no named demand.
- **B.2** — image-upload-as-render-source for concept imagery. The
  architect-facing concept affordance ships (intent toggle, plan expert,
  sketch styles, Prompt Generator), but the underlying render still
  captures the GLB. Concept imagery is **not end-to-end** from a manual
  sketch upload until B.2 lands.

The four remaining power tools (4K upscaler, render enhancer, AI
eraser, inpainting, style transfer) and the `cortex/render_*` MCP
retrofit stay queued per the original Reasoning section — no change to
their treatment.

**Activation gate (added by this amendment).** The shipped scope is
gated by `RENDERS_PROD_ENABLED=false` in prod. Flipping the flag must
be paired with `MNML_RENDER_MODE=live` in the same Cloud Run revision —
flipping one without the other either keeps mock renders behind a live
surface or makes the surface reachable while still mocked. The two-flip
is an operator action; no further code change is required to activate
the shipped scope.

**Premortem deferred to the activation event.** This decision's
pre-mortem covered the build commitment; activation is a smaller commit
(flag flips, no code change) but exposes credit spend to live use. A
brief operator-facing pre-mortem at activation should cover credit-COGS
exposure, vendor uptime dependency, and whether concept imagery is
gated on B.2 landing first (so the toggle doesn't ship a non-functional
upload path to architects).

**Structural-commitment status unchanged.** Load-bearing commitments
are still clean (render-output atom provenance, vendor not jurisdiction,
COGS not jurisdiction-onboarding cost). The operational yellow on
focus-queue resolved positively: the parallel build did not collide
with cc-agent-C beyond the bounded workspace-conflict incident filed
separately at
[`_sessions/2026-05-22_workspace_hygiene_incident_cc-agent-R.md`](../_sessions/2026-05-22_workspace_hygiene_incident_cc-agent-R.md).
