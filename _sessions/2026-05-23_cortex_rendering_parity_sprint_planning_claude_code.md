---
date: 2026-05-23
agent: planner
repo: docs
kind: session-summary
session_type: planning
status: complete
rolled_up: false
related_canonical: [40e_cortex_rendering_parity_sprint, 40c_cortex_rendering_sprint, 42_design_accelerator_program_plan, 00_current_state]
related_decision: _decisions/2026-05-23_cortex_rendering_parity_sprint_scope
related_dispatch: _dispatches/2026-05-23_cc-agent-R_rendering_parity_build
---

# Planner session — Cortex rendering parity sprint (40e) scoped and dispatched

## What was done

Scoped and dispatched a successor sprint to 40c against the operator's
direction to bring the Cortex Renders tab to full parity with the
prior Hauska-built reference repo `Hauska-io/design-suite-web`. Quoted
framing: "all of it. i want to make it work like the examples i gave
you."

Session arc:

1. **Reference-repo recon** — three repos named by operator: `design-suite-web`,
   `design-suite-server-infra`, `design-suite-web-infra`. WebFetch on
   each landing page: web is React+Vite+TS+Tailwind+shadcn SPA; both
   infra repos are pure Terraform/AWS (ECS Fargate + ECR + ALB) and
   irrelevant for Cortex (Cloud Run target). Concluded only `design-suite-web`
   is a meaningful pattern target.
2. **Doc-set orientation** at operator's redirect — read `00_current_state.md`,
   `40c_cortex_rendering_sprint.md`, the three cc-agent-R session
   summaries (Phase A.1 audit, Phase A backend, Phase B frontend), and
   the `_decisions/2026-05-22_cortex_rendering_activation.md` amendment.
   Established that the Cortex renders surface is ~85-90% built per V1
   + 40c gap-fill: full `MnmlClient`, `routes/renders.ts` (1,474 LOC),
   schema + atoms registered, portal-ui Render* components, polling
   worker, GCS mirror, intent toggle, credits badge.
3. **Cross-walk via Explore agent** — dispatched read-only Explore
   agent to clone `design-suite-web` to `P:\tmp\design-suite-web-ref`
   and produce a component-by-component gap matrix against
   `P:\legacy-design-tools`. Findings:
   - Reference is a **different domain** than Cortex — generic image-to-design
     SPA with 5 operations (interior, exterior, style-transfer,
     render-enhancer, virtual-staging). Cortex's mnml integration is
     BIM-driven (still / elevation-set / video × 6 experts × 8 styles).
     Reference has NO equivalent for elevation sets, video, expert
     selector, GLB sourcing, or Prompt Generator.
   - Cortex is ahead on: expert/style breadth, intent toggle, Prompt
     Generator, elevation-set fan-out, video AI, GCS mirroring,
     polling-with-restart, credits badge, cancel affordance.
   - Reference exceeds Cortex on: full per-operation parameter grids,
     before/after slider UX, drag-and-drop upload, negative-prompt,
     seed input, processing-time live timer, URL share button,
     ConstellationCanvas animated background.
   - **Styling delta is the cost driver.** Reference is Tailwind +
     shadcn (className everywhere); Cortex's portal-ui uses custom
     `smartcity-*` CSS + design-token CSS variables. Reference is
     pattern source, not code source.
4. **Mnml docs captured** — WebFetched the mnml.ai docs root +
   authentication page + 5 power-tool endpoint pages + the
   `archDiffusion-v43` schema page. All five power-tool shapes
   captured. Full per-expert parameter schema captured (10 common
   params + 6 per-expert grids).
5. **Operator decision points** — three rounds of AskUserQuestion:
   (a) scope direction (operator chose all-in-one sprint, 1-9
   inclusive); (b) mask-canvas (operator chose build it); (c)
   power-tool docs path (operator pointed at `https://mnmlai.dev/docs`).
6. **Pre-mortem-check run formally** against the proposed scope.
   Load-bearing commitments (1 sell reasoning, 2 partnership-first,
   3 cost per jurisdiction) all GREEN. Three operational yellows
   surfaced: commitment 4 (MCP retrofit gap widens materially),
   commitment 5 (Hauska spine indirect), commitment 6 (three
   concurrent agents in legacy-design-tools). Operator acknowledged
   all three explicitly before commitment.
7. **Plan mode** — wrote structured plan to plan file; operator
   approved.
8. **Files produced this session** (this commit):
   - `40e_cortex_rendering_parity_sprint.md` (new canonical sprint doc)
   - `_decisions/2026-05-23_cortex_rendering_parity_sprint_scope.md` (new decision record)
   - `_dispatches/2026-05-23_cc-agent-R_rendering_parity_build.md` (new dispatch)
   - `40c_cortex_rendering_sprint.md` (edit: successor-sprint pointer)
   - `42_design_accelerator_program_plan.md` (edit: watch-line amendment for 40e activation + widened MCP-retrofit scope)
   - `00_current_state.md` (edit: in-flight tracks + agent fleet + recent sessions + cross-cutting watch line)
   - this session summary

## What was learned

- **40c framing was complete but operator's "all of it" goes wider.**
  The 40c doc named B.1 + B.2 + 4 power tools as deferrals with no
  named demand. The operator's 2026-05-23 framing names them all
  collectively (plus 7 UX-polish items the cross-walk surfaced). The
  reference repo is the named-demand driver — operator wants Cortex
  to match its surface.
- **Reference repo isn't a closer-to-mnml renders UI; it's a different
  domain.** `design-suite-web` operates on user-uploaded images,
  produces image outputs. Cortex's mnml integration operates on
  GLB capture + uploaded images, produces image + video outputs in
  the context of an engagement's render-output atoms. The reference
  has features Cortex doesn't (param grids, slider, drag-drop) and
  Cortex has features the reference doesn't (elevation sets, video,
  Prompt Generator, intent toggle, credits, cancel). 40e is the
  "merge the reference's missing features into Cortex's superset"
  sprint.
- **Styling delta is the cost driver, not the integration.** mnml
  integration is already built. The reference's components don't
  copy-paste into Cortex because Tailwind classes ≠ `smartcity-*`
  CSS + tokens. Every transplanted component is a re-implementation
  against Cortex's design system informed by reference UX. cc-agent-R
  builds against Cortex's existing patterns.
- **mnml.ai docs are well-structured.** Each tool has a dedicated
  page under `https://mnmlai.dev/docs/api/<tool>` with full request
  shape, response shape, async pattern, cost (where stated), limits.
  cc-agent-R reads them directly during A.1 / A.3 implementation.
- **Three-agent concurrency is operationally yellow but mitigable.**
  cc-agent-C (QA-22 EPA), cc-agent-C2 (Regrid SCOPE B finishing), and
  cc-agent-R (40e) overlap zero on file paths if the allowlist is
  enforced. The 2026-05-22 workspace-hygiene incident is the failure
  mode the allowlist + dedicated clone + commit-branch prefix
  discipline prevents.

## Mnml.ai vendor surface captured this session

For preservation in case the live docs change. cc-agent-R should
verify each against `https://mnmlai.dev/docs` at build time.

**Power tools (5):**

| Tool | Path | Required | Optional | Cost | Limits |
|---|---|---|---|---|---|
| Render Enhancer | `POST /v1/render/enhancer` | `image`, `prompt` | `geometry` (0-1, def 1), `creativity` (0-1, def 0.3), `dynamic` (0-10, def 5), `seed`, `sharpen` (0-1, def 0.5) | unspecified | 10MB image max |
| 4K Upscaler | `POST /v1/upscale` | `image` | `scale` (def 2), `face_enhance` (bool, def false) | 1 credit | 8MB max, JPG/PNG/GIF, min 1KB, auto-resized to 1400px width |
| AI Eraser | `POST /v1/ai-eraser` | `image`, `mask` | `output_format` (png/jpg/jpeg, def png) | 1 credit | 8MB max, mask same dimensions, white=erase, auto-resized to 1024px width, min 256px width |
| Inpaint | `POST /v1/inpaint` | `image`, `mask` | `prompt`, `negative_prompt`, `seed`, `mask_type` (manual/automatic) | unspecified | 10MB max, mask PNG black bg + white selected area |
| Style Transfer | `POST /v1/style/transfer` | `image`, `reference_image` | `prompt`, `strength` (0-1, def 0.7), `preserve_structure` (bool, def true), `color_preservation` (0-1, def 0.3) | unspecified | 10MB max |

All five are async POST returning a job id, polled via existing
`GET /v1/status/{id}`. Multipart upload everywhere except status check.
Auth header `Authorization: Bearer <key>`, existing `MNML_API_KEY`
Cloud Run secret.

**ArchDiffusion v4.3-Ultra parameter schema (for A.3 / B.1):**

Required: `image` (multipart, JPEG/PNG/WebP, 15MB max), `prompt`
(max 2000 chars).

Common (all expert types): `expert_name` (exterior/interior/masterplan/landscape/plan/product),
`render_style` (raw/photoreal/cgi_render/cad/freehand_sketch/clay_model/illustration/watercolor),
`geometry` (precise/creative), `view_mode` (auto/manual), `seed` (0-1000000),
`annotation` (true/false), `show_dimensions` (true/false), `markup_mode`
(true/false), `has_collage` (true/false), `reference_image_1-4` (4
optional style references).

Per-expert grids:
- **Exterior (12):** camera_angle, camera_direction, site_context,
  greenery, vehicles, people, street_props, motion, time_of_day,
  weather, ground_wetness (plus shared common).
- **Interior (8):** room_type, room_style, furnishing_level,
  indoor_plants, interior_accessories, lighting_mode, floor_finish,
  ambience.
- **Masterplan (5):** plan_mode, urban_density, development_type,
  water_features, greenery.
- **Landscape (6):** landscape_style, vegetation, water_features,
  hardscape, outdoor_furniture, landscape_lighting.
- **Product (5):** product_category, background, product_lighting,
  material_finish, shadow_style.
- **Plan (6):** plan_view_mode, drawing_style, color_mode, furniture_2d,
  wall_style, view_type_3d.

Cost: 3 credits per generation. Processing: 30-60s typical. Poll
every 3-5s.

Defaults and allowed values per parameter are at
`https://mnmlai.dev/docs/api/arch-diffusion-v43`.

## What's still open

For the planner — nothing immediate from this session. The build is
cc-agent-R's responsibility per dispatch; planner sweeps `_inbox/`
for cc-agent-R's session summaries on the existing 10-minute loop.

Tracked for future planner attention (in 40e watch line):

- mnml unspecified-cost tools (Enhancer, Inpaint, Style Transfer)
  surface their costs at first live call — surface in PR descriptions.
- ConstellationCanvas perf cost validation at activation.
- `cortex/render_*` MCP retrofit scope widens with 40e — capture
  expanded scope in 42 watch line (done this session) and revisit
  when retrofit dispatch is teed.

## Suggested canonical doc updates

All landed this commit:

- New: `40e_cortex_rendering_parity_sprint.md`
- New: `_decisions/2026-05-23_cortex_rendering_parity_sprint_scope.md`
- New: `_dispatches/2026-05-23_cc-agent-R_rendering_parity_build.md`
- Edit: `40c_cortex_rendering_sprint.md` — successor-sprint pointer
- Edit: `42_design_accelerator_program_plan.md` — watch-line amendment for 40e activation + widened MCP-retrofit scope
- Edit: `00_current_state.md` — in-flight tracks (40e dispatch added), agent fleet (cc-agent-R re-activated), recent sessions, cross-cutting watch list line (40c reconciliation → 40e activation succession)
