---
title: digital-design-center — IFC pipeline, real Revit push, and the quality wave
date: 2026-07-19
type: session_summary
agent: claude_code
repo_touched: p:/tmp/digital-design-center (local clone of clindenmayer1/envision-testing), doc_repo/_inbox
status: in-progress (paused for Chris design review before committing the visual wave)
related: [_inbox/2026-07-17_architect_design_lifecycle_app_direction_DRAFT, _catalog/repo_intents]
---

# Session summary — digital-design-center IFC pipeline + quality wave

## What this session was

Execution on `digital-design-center` (the source-agnostic architect/client design-lifecycle app on Chris's Envision base). The whole session ran as a multi-agent build loop: planner (this agent) coordinating, subagents building, planner adversarially reviewing and independently verifying every stage against the real pushed model. All work is in a local clone at `p:/tmp/digital-design-center`; nothing pushed to any remote (the repo transfer/IP prerequisite is still open).

The arc: mapping-layer spine (already built prior) to the real Revit push working end-to-end to the full material pipeline to a Chris-quality lighting/materials pass to the start of inserted parts.

## What got built and proven

Real Revit push works end-to-end. The operator pushed the actual Musgrave_Residence_B6 model from Revit 2024 (the existing legacy-revit-sensor add-in, BackendUrl repointed to the new app's receive server, no add-in changes) — 9.4MB IFC4 + 12 sheets landed, rendered, and classified into 532 elements. The add-in was NOT modified; the receive side was built to match its exact four-call handshake, and four real wire-format bugs (that the earlier simulated push could not surface) were caught against captured ground truth and fixed server-side: engagementId must be a bare GUID; auto-bind needs a matchedBy field; multipart part names arrive UNQUOTED from the .NET client; and the model's plumbing fixtures are IfcFlowTerminal, cabinets IfcFurniture, with Revit door-style/location family naming (no literal "cabinet").

Full material pipeline on IFC geometry. IFC meshes arrive with no UVs, so textured materials were impossible. Lifted Chris's UV projectors into a shared module and generate UVs on the ingested geometry, then apply real textured PBR materials reusing the kitchen's recipes. Textured stone counters, wood floors and cabinets, and tile all render on the real pushed house, restyled through Chris's actual configurator rail.

Kitchen-reconciliation audit. The operator correctly suspected the IFC path had approximated things Chris tuned, not reused them. An audit found the seam was reusing correctly for cabinet finishes (the model) but had drifted with parallel builders for countertop/floor/backsplash, plus a wall-env regression where a prior agent had wrongly raised paint reflectivity 32x (Chris deliberately keeps matte paint from reflecting the sky). All 7 findings were reconciled to reuse Chris's real values.

Lighting ported from the kitchen's real rig. The prior IFC lighting was a from-scratch approximation that looked flat and gray, with shadows off entirely. Replaced with the kitchen's actual rig values: warm key/fill/sun RectAreaLights, VSM soft shadows, warm can-light grid, city IBL, NeutralToneMapping.

Camera navigation. Orbit now pivots on what is in view and can push through walls into rooms (the earlier version orbited the Revit project base point 43m below the house and walled the camera out). Dollhouse, section-cut, and per-storey isolation using the 9 real named storeys derived from the model. Fly mode is rough and deferred (needs a PointerLockControls rebuild).

Four new mappable roles. windowFrame, glass (transmissive), door, and trim/ceiling — taking the mappable surfaces from 4 to 8; the model's 28 windows and 41 doors now classify instead of falling to unknown.

## Committed vs uncommitted

Committed to the local clone through `0dd9e37` (full material pipeline + Chris's lighting + camera nav + 4 roles + the receive server + the mapping spine).

Uncommitted, deliberately held for Chris's review: the "10x visual" wave — raking directional sunlight, a window-world backdrop (reusing the kitchen's garden asset), metal polish, and the inserted-parts foundation (faucet GLBs mount on the model's 30 plumbing fixtures with position and scale solid, orientation an honest AABB guess). The operator is sending screenshots to Chris for his eye before this wave is committed.

## Honest limits and open items

- Ambient occlusion is approximated (contact shadows + darker ambient); real SSAO needs the @react-three/postprocessing dep, not added — a pending decision.
- Faucet inserts: position/scale work; orientation is a bbox guess (rotated sinks may face wrong) and it targets all plumbing fixtures (toilets/tubs get faucets too). Next pass reads true IfcLocalPlacement axes and narrows to sinks; pulls/appliances/doors follow the same mechanism (faucet is the template).
- Fly-mode PointerLockControls rebuild; the sheets response-shape cosmetic (add-in reports 0 uploaded though 24 stored); ModelViewerTile render-canvas swap (blocked on a three 0.128-vs-0.169 skew).
- Cross-cutting, still on the operator: repo transfer to org, Chris IP assignment, and the Envision die-vs-diverge decision. Nothing is pushed to any remote; all work is local commits in the p:/tmp clone.

## Next

Await Chris's review of the visual wave. Then: commit the visual wave (with or without his adjustments), decide on real SSAO, and take the inserted-parts foundation to true-orientation + the remaining part types. The strategic prerequisites (repo home, IP) gate anything landing in a real org repo.

## Addendum — one-app consolidation + Plans tab + push to Chris (2026-07-19, later)

After the quality wave, the operator directed a full consolidation: there should not be two
disparate spots. The Revit model + all the IFC work now REPLACES the demo scene inside the
Westlake app shell (header nav), with the demo kitchen as a selectable reference — one app.

Consolidation ran as three sequenced waves, each gated on the demo kitchen staying
BYTE-IDENTICAL (git hash-object of KitchenScene.tsx/SceneCanvas.tsx unchanged through all):
- Wave 1 (structural, commit 6b0ae38): ?snapshot/?ifc become deep-links INTO the shell (not
  bypass hosts); one AppShell; SourceSelector switches kitchen vs pushed model; one RightRail
  driven by a sections prop; the IFC load→mapping→configure sub-flow runs inside the Design
  Center. Fixed a UX bug the operator caught — mapping panel and material rail no longer stack;
  the rail shows only in the restyle phase.
- Wave 2 (capability merge, commit e0ff790): the IFC scene now renders the SAME shared LightingRig
  the kitchen uses, driven by Chris's StudioPanel LightingState — so the Lighting Studio tunes a
  pushed model live. Pose capture (P) added to the IFC scene. Per-source lighting persistence so
  IFC tuning never clobbers the kitchen's. Deleted the bespoke IFC lighting rig.
- Plans tab (commit 7806b92): new header tab showing the Revit sheets the connector already
  pushes (A0 COVER, A1 SITE PLAN, …) — thumbnail grid, click to enlarge. Server read-back plugin
  gained sheet metadata + image routes. Read-only display; annotation is future work.

Deferred (held for Chris's review): Wave 3 = real IFC hardware/pull/door placement (his fitting
conventions, fragile orientation); material recipe de-dup; deleting orphaned old hosts; fly-mode
PointerLockControls rebuild.

HANDOFF: pushed to clindenmayer1/envision-testing main (Chris set the repo up for this project and
holds the original). A README section + ARCHITECTURE_NOTES.md document what to review and how to run.
The repo-transfer-to-org / IP / die-vs-diverge decision is still open and unchanged — the push is
for Chris's review, not a resolution of where this lives long-term.
