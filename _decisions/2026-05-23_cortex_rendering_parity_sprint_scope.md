---
decision_id: 2026-05-23_cortex_rendering_parity_sprint_scope
date: 2026-05-23
owner: Nick
status: active
related_canonical: [40e_cortex_rendering_parity_sprint, 40c_cortex_rendering_sprint, 42_design_accelerator_program_plan, 40b_advanced_capture_features, 28_mcp_first_product_design]
---

## Decision

Activate a successor sprint to
[`40c_cortex_rendering_sprint.md`](../40c_cortex_rendering_sprint.md),
[`40e_cortex_rendering_parity_sprint.md`](../40e_cortex_rendering_parity_sprint.md),
that brings the Cortex Renders tab to full parity with the
`Hauska-io/design-suite-web` reference repo. Five scope calls settled
here:

1. **All three 40c deferrals pulled forward into one sprint.** B.1 full
   schema-driven per-expert parameter grid; B.2 image-upload-as-render-source
   for concept imagery; the five power tools typed-but-not-surfaced
   (Render Enhancer, 4K Upscaler, AI Eraser, Inpaint, Style Transfer).
2. **UX polish bundled in-scope, not sequenced as a follow-on.** Side-by-side
   before/after slider, drag-and-drop upload, negative prompt field,
   seed input, processing-time live elapsed timer, URL share button,
   ConstellationCanvas animated background.
3. **Mask-drawing canvas built in-scope (not deferred).** AI Eraser and
   Inpaint require a usable mask source. Without an in-app mask drawer,
   both tools ship un-usable. Operator chose to build it over the
   alternatives of deferring those two tools or accepting file-upload
   mask-only UX.
4. **Reference repo is pattern source, not code source.** `design-suite-web`
   is a different domain (generic image-to-design SPA, not BIM-driven)
   and uses a different styling system (Tailwind vs Cortex's `smartcity-*`
   CSS + design-token variables). Components from the reference are
   re-implemented against Cortex's conventions, not copy-pasted.
5. **cc-agent-R re-activated as owner on its dedicated clone.** Third
   concurrent agent in `legacy-design-tools` alongside cc-agent-C
   (QA-22 EPA) and cc-agent-C2 (Regrid SCOPE B finishing). Mitigated by
   a strict file-path allowlist in the dispatch — disjoint from both.

The two infra repos the operator named alongside the web reference
(`design-suite-server-infra`, `design-suite-web-infra`) are Terraform/AWS
only and out of scope. Cortex deploys to Cloud Run, not ECS Fargate.

## Context

40c (gap-fill sprint, activated and shipped 2026-05-22) closed the V1 /
Spec-54 sprint's audit-found gap with PRs #79 + #80. Two scope items
plus four power tools were deferred as named follow-ons in 40c + 42 with
no scheduled work. The operator's 2026-05-23 framing — quoted: "all of
it. i want to make it work like the examples i gave you" — pulled the
deferrals forward against the `Hauska-io/design-suite-web` reference.

The cross-walk (Explore agent, 2026-05-23) found the reference is a
different domain than Cortex's BIM-driven mnml integration. Reference
has 5 generic image-to-design operations; Cortex has 3 render kinds
× 6 experts × 8 styles sourced from GLB capture. Cortex is ahead of
the reference on expert/style breadth, intent toggle, Prompt
Generator, elevation-set fan-out, video AI, GCS mirroring, polling-
with-restart, and credits badge. Where the reference exceeds Cortex:
full per-operation parameter grids, before/after slider UX,
drag-and-drop upload, negative-prompt, seed input, processing-time
timer, URL share button, ConstellationCanvas background.

The styling delta is the cost driver. Reference's Tailwind class-string
patterns don't lift into Cortex's `smartcity-*` CSS + design-token
system without rewrite. Operator's stated requirement is to "maintain
our color and design token system we have in cortex" — confirms the
reference is pattern source, not code source.

Mnml docs captured 2026-05-23: all five power-tool endpoint shapes
(paths, params, async pattern, costs where stated) and the full
`archDiffusion-v43` per-expert parameter schema (10 common params + 6
per-expert grids — exterior 12, interior 8, masterplan 5, landscape 6,
product 5, plan 6). Sprint scope drafted against the captured contract,
not against guesses.

## Structural commitment check

Pre-mortem-check run formally 2026-05-23 against the proposed scope.

**Load-bearing commitments — all GREEN.**

- Commitment 1 (sell reasoning, not data): clean. Render-output atoms
  already carry full generation provenance per V1; 40e adds
  `parent_render_output_id` so tool outputs chain back to source.
  Provenance strengthens, not weakens.
- Commitment 2 (partnership-first sourcing): N/A per the 2026-05-23
  scoping decision — mnml.ai is a third-party rendering vendor, not a
  jurisdiction data source.
- Commitment 3 (cost per jurisdiction onboarded): N/A — render credits
  are product COGS, billed per user action, not jurisdiction-onboarding
  cost.

**Operational commitments — three YELLOWS with named mitigations,
operator-acknowledged 2026-05-23.**

- Commitment 4 (dual interface): UI surface widens materially (5 power
  tools + per-expert parameter grid + upload-as-source); the
  `cortex/render_*` MCP retrofit gap widens correspondingly. Mitigation:
  the 42 watch line is amended to capture the expanded retrofit scope;
  retrofit lands post-activation as a tracked follow-on on
  hauska-mcp-server (cc-agent-M).
- Commitment 5 (Hauska spine): this sprint deepens an already-activated
  Empressa product surface (40c activated 2026-05-22), not a new
  non-Hauska direction. Acknowledged as a delivery-depth choice; the
  indirect Hauska expression is the future MCP retrofit pulling render
  tools into Hauska MCP server breadth.
- Commitment 6 (focus queue): cc-agent-R re-activation puts three
  concurrent agents in `legacy-design-tools` for the sprint duration.
  Mitigation: dedicated clone for cc-agent-R + strict file-path
  allowlist in the dispatch (cc-agent-R: `routes/renders.ts` +
  `routes/render-tools.ts` + `lib/mnml-client/**` + portal-ui Render*
  + new `MaskCanvas*` / `BeforeAfterSlider*` / `ConstellationCanvas*`
  + new `render-tools/` dialogs + new schema migration + RendersTab;
  disjoint from cc-agent-C's `lib/adapters/federal/` and cc-agent-C2's
  `lib/adapters/national/regrid.ts` + `lib/site-context/server/overlays.ts`).

Per the premortem-check skill rule, multiple operational yellows push
overall to YELLOW. Operator explicitly acknowledged all three
operational tradeoffs before commitment 2026-05-23; cleared to proceed.

Catalog-thesis-check 2026-05-23, passes. Render-output atoms stay
tenant-private per ADR-017 (no Layer-1/Layer-2 inversion); Empressa
Cortex product depth with no ADR-008 conflict; mnml.ai vendor
commitment unchanged from 40c.

## Reasoning

**One sprint over staged dispatches.** Per-power-tool or per-workstream
incremental dispatch would have re-paid the recon cost (mnml docs,
existing-code audit, file-path planning, premortem) each time. The
reference-parity target is a single operator-driven goal — one sprint
is the right unit. Single PR cadence within the sprint per workstream
item or grouped if cohesive; agent autonomy clause (self-merge on CI
green) carries over from 40c per the established cc-agent-R precedent.

**Mask-drawing canvas in-scope.** Operator's framing rules out
file-upload-mask UX. The reference repo has no mask drawer (it doesn't
need one — generic image operations don't use masks the way AI Eraser
and Inpaint do), so this component is net-new and the standard is
common-sense brush UX. ~300-500 LOC; standalone component with its
own test file; cc-agent-R designs it.

**UX polish bundled with functional.** Splitting polish into a
follow-on sprint would have meant two cc-agent-R activations with
overlapping recon cost. Bundling is cheaper and gives the operator
the full parity surface in one ship.

**Reference as pattern, not source.** The styling delta + domain
mismatch make wholesale lift infeasible. Cross-walk identified the
~9 reference features worth bringing over; cc-agent-R builds each
against Cortex's design-token system informed by the reference's UX
pattern. Components named for parity: `BeforeAfterSlider`,
`DragDropUpload`, `MaskCanvas`, `ConstellationCanvas`, plus the per-
expert parameter grid and the five power-tool dialogs.

**Three concurrent agents accepted.** The 2026-05-22 workspace-
hygiene incident is the failure mode; the file-path allowlist is
the structural mitigation. cc-agent-R has its dedicated clone (the
existing one used for 40c); the dispatch enforces commit-branch
prefix `cortex/40e-*` for traceability. If the allowlist breaks
down in practice, cc-agent-R pauses (it's the latest entry; the
other two are mid-mission on customer-zero-loop work).

## Reversal criteria

- **Pause sprint if cc-agent-R collides with cc-agent-C or cc-agent-C2
  beyond bounded overlap.** The 2026-05-22 workspace-hygiene incident
  is the precedent. If cross-agent conflict reproduces in a way the
  file-path allowlist doesn't prevent, cc-agent-R pauses until the
  other two clear.
- **Split into two dispatches if scope proves too large for single
  coherent ship.** If a workstream or item set turns out to need more
  recon than the dispatch budgeted, cc-agent-R surfaces and the planner
  re-scopes into Workstream A+B first (functional) and Workstream C
  second (polish).
- **Revisit ConstellationCanvas if perf cost on activation is material.**
  The component carries a perf-budget guard; if it fires routinely in
  production, the implementation gets revisited (Canvas vs WebGL vs
  CSS-only starfield) or the component is dropped from the surface.
- **Revisit mnml vendor choice** per
  [`40b_advanced_capture_features.md`](../40b_advanced_capture_features.md)
  Lane 1's open vendor-re-evaluation note. Unchanged by this decision;
  40e commits to mnml at the existing integration depth, no new vendor
  commitment.

## Dependencies

- **cc-agent-R on dedicated `legacy-design-tools` clone** (the existing
  one used for 40c; not net-new clone provisioning).
- **mnml.ai vendor stable.** `MNML_API_KEY` + `MNML_API_URL` already
  mounted as Cloud Run secrets from V1; no new vendor onboarding.
- **40c as predecessor.** 40c's exit-criteria caveats (B.1 + B.2
  deferred) become 40e's exit criteria. 40c gets a "successor sprint
  dispatched" pointer in its Status section.
- **Mnml docs capture (2026-05-23).** Power-tool endpoint shapes +
  full `archDiffusion-v43` per-expert parameter schema captured this
  session; cc-agent-R verifies against `https://mnmlai.dev/docs` at
  build time.

## Counterparties

Internal. mnml.ai is an existing vendor at no new commercial
commitment; trial / standard plan tier is unchanged. cc-agent-R is
re-activated from dormant (per 00 line 40) for the sprint duration;
returns to dormant on sprint close. Affects the M-CortexQA milestone
path indirectly — 40e ships the full Renders tab parity but stays
behind `RENDERS_PROD_ENABLED`, so activation is a separate operator
action and does not gate M-CortexQA timing.
