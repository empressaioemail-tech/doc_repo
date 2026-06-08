---
id: 40b_advanced_capture_features
title: Advanced capture features — rendering, image-to-BIM, image-to-CAD
status: active
last_updated: 2026-05-22 (Lane 1 photorealistic rendering activated as the Cortex rendering sprint 40c_cortex_rendering_sprint.md per _decisions/2026-05-22_cortex_rendering_activation.md; Lanes 2 and 3 stay queued; doc renumbered from 41 to 40b, resolving the slot collision with 41_revit_connector)
applies_to: design-accelerator
related: [40_design_accelerator, 40c_cortex_rendering_sprint, 42_design_accelerator_program_plan, 27_engine_evolution_plan, _decisions/2026-05-19_sync_4_5_and_cortex_sprint, _decisions/2026-05-22_cortex_rendering_activation]
---

# Advanced capture features — rendering, image-to-BIM, image-to-CAD

This doc absorbs three feature lanes descoped from the active Cortex/Codex sprint to a queued standalone status. Decision record at [`_decisions/2026-05-19_sync_4_5_and_cortex_sprint.md`](_decisions/2026-05-19_sync_4_5_and_cortex_sprint.md). Move surfaced this session: with substrate v1 Sync 4.5 plus Cortex/Codex L1-L6 plus MCP retrofit plus Replit decouple plus Neon swap absorbing planner and agent capacity, the rendering and vision-to-output lanes are descoped to a standalone follow-on so the sprint focuses on customer-zero-stabilizing capabilities. None of these features are required for the next QA cycle.

> **Amendment 2026-06-08 — buy-not-build governs these lanes.** Per [`_decisions/2026-06-08_buy_not_build_cortex_cockpit.md`](_decisions/2026-06-08_buy_not_build_cortex_cockpit.md): the spine is the value prop; these cockpit lanes are thin vendor integrations, not in-house builds. Repo recon 2026-06-08 against live `main` found Lane 1 more complete than the text below states - image-upload-as-render-source and all five power tools (enhance, upscale, AI eraser, inpaint, style transfer) plus Kling video are wired, contrary to the "deferred" framing in [`42`](42_design_accelerator_program_plan.md). The surface is still dark behind `RENDERS_PROD_ENABLED=false` + `MNML_RENDER_MODE=mock`. mnml is image-in/image-out (plus video) with **zero geometry** - it does NOT do image-to-CAD or image-to-BIM. Lanes 2 (image-to-BIM) and 3 (image-to-CAD): buy, do not build - image/PDF-to-CAD via Aspose/CloudConvert (format) + RasterScan (semantic floor-plan); image-to-3D mesh via Tripo/Meshy (massing, not Revit BIM); true scan-to-BIM (IFC/Revit) via ODA Scan-to-BIM (beta) is the one column still needing real engineering, tracked as a roadmap dependency. **Open security item:** the architect-audience auth gate on the render routes was removed under QA-30/31 - restore per-engagement authorization before any production activation.

## Status

Mixed. **Lane 1, photorealistic rendering, is active** as of 2026-05-22, scoped as the Cortex rendering sprint at [`40c_cortex_rendering_sprint.md`](40c_cortex_rendering_sprint.md) per [`_decisions/2026-05-22_cortex_rendering_activation.md`](_decisions/2026-05-22_cortex_rendering_activation.md). Lanes 2 and 3, image-to-BIM and image-to-CAD, stay `queued` behind the activation gate below.

## Activation gate

Activate after all five conditions clear:

1. Substrate v1 Sync 4.5 fires (4-jurisdiction Bastrop-network corpus passes eval).
2. Cortex/Codex L1-L6 surfaces ship to legacy-design-tools main.
3. MCP retrofit lands for Codex (finding-generation, override-write, briefing-fetch, snapshot-ingest) and Cortex (IFC ingest, BIM-model query, snapshot register, briefing emit).
4. Legacy-design-tools cuts over from Replit autoscale to Cloud Run + new Neon prod instance.
5. First QA cycle through MCP-driven agent workflows clears.

Until all five conditions clear, no engineering capacity allocated to anything in this doc.

## Lane 1 — Photorealistic rendering pipeline

> **Activated 2026-05-22.** Lane 1 is now the scoped, dispatch-ready Cortex rendering sprint at [`40c_cortex_rendering_sprint.md`](40c_cortex_rendering_sprint.md). The sprint-scope decisions (full render engine plus video, both source-input paths, credit-balance display only) are settled in [`_decisions/2026-05-22_cortex_rendering_activation.md`](_decisions/2026-05-22_cortex_rendering_activation.md). The text below is the original descope framing, retained for context; 40c is the execution truth.

Currently wired server-side via [`legacy-design-tools/artifacts/api-server/src/routes/renders.ts`](https://github.com/empressaioemail-tech/legacy-design-tools) and gated by `RENDERS_PROD_ENABLED` env flag. Vendor integration with mnml.ai for photorealistic exterior rendering from massing models. Used in the W2 wave for client deliverables per the [`40_design_accelerator.md`](40_design_accelerator.md) wave plan as originally framed.

**Sprint scope (when activated):**

- Re-evaluate mnml.ai integration depth: pose control, material fidelity, lighting consistency.
- Goal: client-presentation-grade output, not photorealistic perfection — sufficient for client review delivery.
- Wire as a `render-output` atom producer; downstream consumers see a render-output atom that supports the existing five render modes per ADR-001 + ADR-012.

**Open at activation time:**

- Whether mnml.ai stays the vendor or whether an alternative (Stable Diffusion-based local pipeline, AWS Bedrock image generation) is more cost-effective at the volume Empressa actually needs.
- Whether render quality bar should be deliverable-acceptable or client-presentation-grade — likely deliverable-acceptable to start; raise the bar after pilot data.

## Lane 2 — Image-to-BIM

Vision-to-IFC conversion. Forward-looking capability. Input: photographs of existing built structures (or sketches, or PDF plans). Output: an IFC file structurally close enough to the input that the architect can refine in Revit without starting from scratch.

**Sprint scope (when activated):**

- Vision model selection (Claude vision, GPT-4V, dedicated BIM-aware models if any exist in the activation window).
- Output shape: produces `bim-model` atom symmetric with IFC ingest and Push-to-Revit paths per the existing 19-atom registry. The new atom-producer is image-vision, joining the existing two producers (IFC upload, Revit push).
- Quality bar to be set at activation; v1 expectation is "structurally close enough" not "production-accurate."

**Why this is hard:** vision models today produce plausible scene reconstructions but lack the parametric discipline required for a clean IFC. Expect significant prompt engineering and post-processing.

**Why this is queued, not killed:** Empressa customer-zero workflow includes site-photo capture as a regular step; the vision-to-BIM lane is high-value if it works. Capture work is already happening on Moab projects.

## Lane 3 — Image-to-CAD

Vision-to-DWG/DXF conversion. Similar shape to image-to-BIM but with CAD-style output (2D vector geometry, layered drawings) rather than parametric 3D.

**Sprint scope (when activated):**

- Vision model selection (likely overlaps with image-to-BIM; capacity sharing makes sense).
- Output shape: new atom type or reuse of existing atom shape (open question for activation-time decision).
- Use cases: existing-condition surveys, as-built drawings, site condition documentation.

**Coupling with image-to-BIM:** these two lanes share most of the vision-side infrastructure. Sequencing them as a single sprint at activation time is the natural shape, with shared vision pipeline and divergent output formats. Decision deferred to activation-time scoping.

## What this descope does NOT change

The existing mnml.ai integration code in `routes/renders.ts` stays in the codebase, env-flag-gated, available for ad-hoc use. The descope is about sprint scope, not feature removal. Nothing existing breaks.

The W2 wave reference in [`40_design_accelerator.md`](40_design_accelerator.md) is updated to point at this doc rather than describing the rendering scope inline. See [B.4 in the decision record](_decisions/2026-05-19_sync_4_5_and_cortex_sprint.md) for the canonical doc updates landing alongside this file.

## What this descope DOES change

These three lanes do not enter agent-fleet allocation, sprint planning, or roadmap forecasting until the activation gate clears. The strategic-altitude principle: stabilize base capabilities first; expand surface area second. Rendering and vision-to-output capabilities are valuable but not required for customer-zero QA, and trying to ship them concurrently with L1-L6 + MCP retrofit + cutover would saturate capacity.

## Cross-references

- Sprint decision record: [`_decisions/2026-05-19_sync_4_5_and_cortex_sprint.md`](_decisions/2026-05-19_sync_4_5_and_cortex_sprint.md)
- Cortex program plan: [`42_design_accelerator_program_plan.md`](42_design_accelerator_program_plan.md)
- Engine evolution plan: [`27_engine_evolution_plan.md`](27_engine_evolution_plan.md)
- Original product home: [`40_design_accelerator.md`](40_design_accelerator.md) (mnml.ai external service entry now points here)
