---
decision_id: 2026-06-08_buy_not_build_cortex_cockpit
date: 2026-06-08
owner: Nick
status: active
related_canonical: [40_design_accelerator, 40b_advanced_capture_features, 42_design_accelerator_program_plan, 55_spine_data_intelligence_stack, 56_engine_extraction_sprint, 14_pricing_framework, 28_mcp_first_product_design, 00_current_state]
related_adr: [80_adrs/adr_008_engine_factor_out]
---

## Decision

The Hauska spine is the value proposition and the moat; the Cortex cockpit's visual and conversion features are thin integrations around external vendor APIs, bought not built. Concretely:

The spine (the reasoning engines plus the code corpus, being lifted out of cortex-api into hauska-engine per ADR-008 and `56_engine_extraction_sprint.md`) is where engineering cycles concentrate. It is what carries reasoning, citations, confidence, and provenance, and it is what we sell. The cockpit visual and conversion capabilities that give an architect a full experience around that spine (photorealistic rendering plus video, image-to-CAD, image-to-3D, image-to-BIM) are commodity capabilities in 2026 and are sourced from external vendor APIs rather than rebuilt in house.

These cockpit features live on the cortex-api-to-thin-BFF side of the ADR-008 seam. They are not engines. They do not move to the spine during the engine extraction, they do not gate the lift, and they are not gated by it. The extraction pulls the reasoning (the moat) into hauska-engine; the cockpit stays product-side and calls the vendors. This keeps the architecture clean: spine equals reasoning moat, gate equals control plane, cockpit equals thin vendor wrappers around the spine.

Vendor assignments per cockpit column (verified 2026-06-08; vendor-detail confidence medium, staleness flags below):

1. Rendering plus video. mnml.ai, already integrated and code-complete on legacy-design-tools (exterior, interior, sketch-to-render, 4K/8K upscale, style transfer, virtual staging, inpaint, AI eraser, and Kling-based video, plus image-upload-as-source). This column is solved. The action is activation, not build: flip `RENDERS_PROD_ENABLED=true` plus `MNML_RENDER_MODE=http` with secrets, validate the live mnml wire contract once against a key, and restore the per-engagement authorization removed under QA-30/31 before exposing it in production. Fal.ai or Replicate underneath are an optional later cost-control or custom-arch-pipeline optimization, not a requirement.

2. Image and PDF to CAD (2D vector). Buy both halves. Dumb format conversion (vector PDF to DXF/DWG) is a commodity REST call: Aspose.CAD Cloud or CloudConvert. Semantic floor-plan recognition (separating walls, doors, text, dimensions into proper layers from a raster) is buyable via RasterScan (production, IFC/DXF/GLTF out) or Raster2CAD. Semantic floor-plan extraction has spine synergy: it can feed the same plan-review pipeline, and where it does, its output must carry provenance across the seam.

3. Image to 3D mesh. Buyable via Tripo or Meshy (clean async REST, low per-generation cost). Label it honestly as massing or object capture, not a Revit/IFC deliverable. The output is GLB/OBJ mesh, not a parametric BIM model. This is a cockpit massing-seed, not a BIM checkbox.

4. True scan or image to BIM (classified IFC/Revit). This is the one column where buy-not-build partially breaks and real engineering remains. The only API that emits classified IFC/Revit geometry from capture is the Open Design Alliance Scan-to-BIM SDK, and it is beta; RasterScan is the most integration-ready plan-driven (not photo-driven) BIM-adjacent option and is enterprise quote-only. Treat scan-to-BIM as a tracked roadmap dependency with beta risk and expected human cleanup, not a near-term shipped cockpit feature.

## Context

The operator surfaced an older, fuller Cortex vision (rendering, video, image-to-CAD, image-to-BIM) captured in `40b_advanced_capture_features.md` and `42_design_accelerator_program_plan.md`, and asked whether the existing mnml integration or other vendor APIs already cover these so we do not rebuild commodity capabilities. Two reconciliations 2026-06-08 settled it. Repo recon against legacy-design-tools main: the mnml integration is image-in/image-out (plus video) with zero geometry capability, but the rendering surface is code-complete and further along than the doc set claims (image-upload-as-source and all five power tools are wired, contrary to 40b/42 marking them deferred); it runs dark behind two off-by-default switches; and the architect-audience auth gate was removed under QA-30/31. Vendor-landscape research: rendering plus video is fully buyable (mnml already does it), image-to-CAD and image-to-3D-mesh are buyable as thin integrations, and true scan-to-BIM is the lone column still needing real engineering.

## Structural commitment check

Pre-mortem run 2026-06-08 via the premortem-check skill. All seven green. Sell-reasoning (1, load-bearing): green, the move is the literal expression of it, the spine is the product and the bought visuals are never resold as our data. Partnership-first (2, load-bearing): green, vendor SaaS is commodity tooling, not city operational data, and is outside the refusal scope per the 2026-05-23 clarifier. Cost-per-jurisdiction (3, load-bearing): green, vendor calls are product COGS tracked in 14/55, not the onboarding envelope, and buying reduces engineering spend. Dual-interface (4): green, UI-first surfaces with MCP retrofit tracked per 28. Spine rule (5): green, this protects spine focus by buying the shell. Focus-queue (6): green, rendering is activate-not-build, image-to-CAD/3D queue behind the Miami proof, scan-to-BIM is explicitly roadmap-not-now. Quality-gate (7): green, the contract applies to spine outputs and is preserved, with the noted condition that any cockpit feature feeding back into reasoning carries provenance across the seam.

## Reasoning

The spine is the only defensible thing here. Rendering, vectorization, and image-to-3D are commodities with mature APIs, and a dollar of engineering spent rebuilding them is a dollar not spent on the corpus and reasoning that no competitor can trivially buy. The architecture already wants this split: ADR-008 thins cortex-api to a BFF and lifts the engines to the spine, so the cockpit visual features were never going to be engines and never belonged in the spine. Buying them keeps cortex-api thin and keeps the seam clean. The one honest exception, scan-to-BIM, is flagged as such rather than pretended into a checkbox.

## Reversal criteria

Reverse a specific column from buy to build only if a vendor dependency proves structurally unacceptable: the rendering vendor's API economics break at Empressa's volume (revisit with a Fal.ai/Replicate self-hosted arch pipeline, still not an mnml-equivalent rebuild), or a conversion vendor cannot meet an accuracy or data-residency bar the product requires. Reverse the scan-to-BIM roadmap posture only when a non-beta API emits production-grade classified IFC/Revit, at which point it becomes a thin integration like the others. None of these reversals returns commodity-visual rebuilding to the spine's cycle budget.

## Dependencies

Rendering activation rides the build-out deploy linchpin (it is a Cloud Run env flip on cortex-api), gated additionally on restoring the QA-30/31 auth. Image-to-CAD/3D integrations queue behind the active Miami whole-review proof. The engine-extraction lift (56 steps 3-6) is independent of all cockpit work and proceeds on its own held track. Vendor-detail staleness flags carried forward for confirmation before contracting: mnml API billing/credit tiers are from a marketing page; ODA Scan-to-BIM is beta; RasterScan/Raster2CAD pricing is quote-only; Polycam/Luma "API" is export/app-first, not headless reconstruction.

## Counterparties

Internal direction. External vendors named are candidate API suppliers, not committed contracts; selection and contracting route to the operator. Serves the Cortex product line broadly, including the live Miami investor permit engagement.
